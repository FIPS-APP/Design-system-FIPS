import {
  Fragment,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { ChevronRight } from 'lucide-react'
import { cn } from '../../lib/cn'
import { AdminTableSortHeader } from '../ui/admin-listing'
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
  type TableDensity,
} from '../ui/table'
import { RowActionsMenu, type RowMenuAction } from './RowActionsMenu'
import { cliqueAbreALinha, teclaAbreALinha } from './tabela-linha-logica'

export type TabelaExpansivelColuna<T> = {
  /** Identificador estável da coluna (também é o valor que `aoOrdenar` devolve). */
  id: string
  /** Texto do cabeçalho na tabela e do rótulo do campo no cartão. */
  titulo: string
  /** Conteúdo da célula (e do valor do campo no cartão). */
  celula: (linha: T, indice: number) => ReactNode
  /** Mostra o botão de ordenar no cabeçalho. A ordenação em si é de quem usa. */
  ordenavel?: boolean
  alinhamento?: 'esquerda' | 'centro' | 'direita'
  /** Classes de layout do `<th>`/`<td>` (largura, `whitespace-*`). */
  className?: string
  /** Fica só na tabela: o cartão não mostra esta coluna. */
  ocultaNoCartao?: boolean
  /** No cartão, esta coluna vira o título (sem rótulo). Padrão: a primeira coluna. */
  principal?: boolean
}

export type TabelaExpansivelOrdenacao = { coluna: string; direcao: 'asc' | 'desc' }

export type TabelaExpansivelProps<T> = {
  colunas: TabelaExpansivelColuna<T>[]
  linhas: T[]
  /** Chave única e estável da linha. */
  chave: (linha: T) => string
  /** Conteúdo do painel que abre sob a linha (e sob o cartão no celular). */
  renderDetalhe: (linha: T) => ReactNode
  /** Linhas abertas, modo controlado. Sem esta prop o componente guarda o estado. */
  expandidas?: Iterable<string>
  /** Estado inicial do modo não controlado. */
  expandidasIniciais?: Iterable<string>
  /** Chamado a cada abrir/fechar, com a chave da linha e se ela ficou aberta. */
  aoAlternar?: (chave: string, aberta: boolean) => void
  /** Só uma linha aberta por vez. Vale apenas no modo não controlado. */
  unica?: boolean
  /** Diz se a linha tem painel. Sem painel, a linha não mostra o botão. Padrão: todas têm. */
  temDetalhe?: (linha: T) => boolean
  /** Texto do `aria-label` do botão. Padrão: "Ver detalhe" / "Recolher detalhe". */
  rotuloDetalhe?: (linha: T, aberta: boolean) => string
  /**
   * A linha inteira é clicável (e focável por teclado: Enter e Espaço com o foco na linha). Não dispara
   * em clique dentro de botão, link, campo ou menu da linha (chevron, número, ações). Sem a prop a linha
   * não é clicável.
   */
  aoClicarLinha?: (linha: T) => void
  /** Ações da linha, no menu radial (`RowActionsMenu`). */
  acoesDaLinha?: (linha: T) => RowMenuAction[]
  /** Ordenação atual; use com `aoOrdenar` e `ordenavel` nas colunas. */
  ordenacao?: TabelaExpansivelOrdenacao
  aoOrdenar?: (colunaId: string) => void
  /** Cartão próprio no celular. Sem ele, o cartão sai das colunas. O botão de abrir e o painel continuam do componente. */
  renderCartao?: (linha: T) => ReactNode
  /** Largura mínima do contêiner (px) para mostrar a tabela; abaixo disso vira cartões. Padrão: 768. */
  quebraEm?: number
  /** `aria-label` da tabela / da lista de cartões. */
  rotulo: string
  /** Texto do estado vazio. */
  vazio?: { titulo?: string; descricao?: string }
  densidade?: TableDensity
  /** Zebra. Padrão: `false`, porque a linha do painel quebraria a alternância. */
  zebra?: boolean
  stickyHeader?: boolean
  /** Rodapé dentro da moldura (ex.: `AdminTablePagination`). */
  rodape?: ReactNode
  className?: string
}

type Medida = { ref: (el: HTMLDivElement | null) => void; largo: boolean }

/**
 * Diz se o contêiner tem pelo menos `minimo` px. A quebra segue a área útil (com o menu
 * lateral aberto ou recolhido), não a janela. Sem medida (SSR, sem ResizeObserver) vale "largo".
 */
function useContainerLargo(minimo: number): Medida {
  const [el, setEl] = useState<HTMLDivElement | null>(null)
  const [largo, setLargo] = useState(true)

  useEffect(() => {
    if (!el || typeof ResizeObserver === 'undefined') return
    const medir = () => {
      const largura = el.getBoundingClientRect().width
      if (largura > 0) setLargo(largura >= minimo)
    }
    medir()
    const observador = new ResizeObserver(medir)
    observador.observe(el)
    return () => observador.disconnect()
  }, [el, minimo])

  return { ref: setEl, largo }
}

const ALINHAMENTO = {
  esquerda: 'text-left',
  centro: 'text-center',
  direita: 'text-right',
} as const

/**
 * Tabela com linha expansível: cada linha tem um botão chevron que abre um painel de detalhe
 * (resumo, anomalias, histórico) logo abaixo dela. Abaixo de `quebraEm` px de contêiner a tabela
 * vira uma lista de cartões, com o mesmo botão e o mesmo painel.
 */
export function TabelaExpansivel<T>({
  colunas,
  linhas,
  chave,
  renderDetalhe,
  expandidas,
  expandidasIniciais,
  aoAlternar,
  unica = false,
  temDetalhe,
  rotuloDetalhe,
  aoClicarLinha,
  acoesDaLinha,
  ordenacao,
  aoOrdenar,
  renderCartao,
  quebraEm = 768,
  rotulo,
  vazio,
  densidade = 'normal',
  zebra = false,
  stickyHeader = false,
  rodape,
  className,
}: TabelaExpansivelProps<T>) {
  const base = useId().replace(/:/g, '')
  const { ref, largo } = useContainerLargo(quebraEm)

  const controlado = expandidas !== undefined
  const [interno, setInterno] = useState<Set<string>>(() => new Set(expandidasIniciais ?? []))
  const abertas = useMemo(
    () => (controlado ? new Set(expandidas) : interno),
    [controlado, expandidas, interno],
  )

  const alternar = useCallback(
    (k: string) => {
      const vaiAbrir = !abertas.has(k)
      if (!controlado) {
        setInterno((atual) => {
          const proximo = new Set(unica ? [] : atual)
          if (vaiAbrir) proximo.add(k)
          else proximo.delete(k)
          return proximo
        })
      }
      aoAlternar?.(k, vaiAbrir)
    },
    [abertas, controlado, unica, aoAlternar],
  )

  const idPainel = (k: string) => `${base}-detalhe-${k.replace(/\s+/g, '_')}`
  const idBotao = (k: string) => `${base}-botao-${k.replace(/\s+/g, '_')}`
  const colunaPrincipal = colunas.find((c) => c.principal) ?? colunas[0]
  const totalColunas = colunas.length + 1 + (acoesDaLinha ? 1 : 0)

  // Props da linha clicável: clique, Enter/Espaço, foco e cursor. Vazio sem `aoClicarLinha`.
  const propsDaLinha = (linha: T) =>
    aoClicarLinha
      ? {
          tabIndex: 0,
          onClick: (e: MouseEvent<HTMLElement>) => {
            if (cliqueAbreALinha(e.target as Element, e.currentTarget)) aoClicarLinha(linha)
          },
          onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
            if (teclaAbreALinha(e.key, e.target, e.currentTarget)) {
              e.preventDefault()
              aoClicarLinha(linha)
            }
          },
        }
      : {}
  const classeDaLinhaClicavel = aoClicarLinha
    ? 'cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--color-ring)]'
    : undefined

  const botao = (linha: T) => {
    const k = chave(linha)
    const aberta = abertas.has(k)
    const rotuloBotao = rotuloDetalhe
      ? rotuloDetalhe(linha, aberta)
      : aberta
        ? 'Recolher detalhe'
        : 'Ver detalhe'
    return (
      <button
        type="button"
        id={idBotao(k)}
        onClick={() => alternar(k)}
        aria-expanded={aberta}
        aria-controls={idPainel(k)}
        aria-label={rotuloBotao}
        className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-[var(--color-fg-muted)] transition-colors hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-fg)] focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:outline-none"
      >
        <ChevronRight
          className={cn('h-4 w-4 transition-transform', aberta && 'rotate-90')}
          aria-hidden
        />
      </button>
    )
  }

  const painel = (linha: T) => {
    const k = chave(linha)
    return (
      <div id={idPainel(k)} role="region" aria-labelledby={idBotao(k)} className="text-[var(--color-fg)]">
        {renderDetalhe(linha)}
      </div>
    )
  }

  const cabecalho = (c: TabelaExpansivelColuna<T>) => {
    const ativo = ordenacao?.coluna === c.id
    return (
      <TableHead
        key={c.id}
        scope="col"
        className={cn(ALINHAMENTO[c.alinhamento ?? 'esquerda'], c.className)}
        aria-sort={
          c.ordenavel ? (ativo ? (ordenacao?.direcao === 'asc' ? 'ascending' : 'descending') : 'none') : undefined
        }
      >
        {c.ordenavel ? (
          <AdminTableSortHeader
            label={c.titulo}
            active={ativo}
            direction={ordenacao?.direcao}
            onClick={() => aoOrdenar?.(c.id)}
          />
        ) : (
          c.titulo
        )}
      </TableHead>
    )
  }

  const tabela = (
    <Table framed={false} density={densidade} wrapText stickyHeader={stickyHeader} zebra={zebra} aria-label={rotulo}>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead scope="col" className="w-10">
            <span className="sr-only">Detalhe</span>
          </TableHead>
          {colunas.map(cabecalho)}
          {acoesDaLinha ? (
            <TableHead scope="col" className="w-12">
              <span className="sr-only">Ações</span>
            </TableHead>
          ) : null}
        </TableRow>
      </TableHeader>
      <TableBody>
        {linhas.length === 0 ? (
          <TableEmpty colSpan={totalColunas} title={vazio?.titulo} description={vazio?.descricao} />
        ) : (
          linhas.map((linha, indice) => {
            const k = chave(linha)
            const aberta = abertas.has(k)
            const comPainel = temDetalhe ? temDetalhe(linha) : true
            const acoes = acoesDaLinha?.(linha) ?? []
            return (
              <Fragment key={k}>
                <TableRow data-state={aberta ? 'selected' : undefined} className={classeDaLinhaClicavel} {...propsDaLinha(linha)}>
                  <TableCell className="w-10 pr-0">{comPainel ? botao(linha) : null}</TableCell>
                  {colunas.map((c) => (
                    <TableCell key={c.id} className={cn('whitespace-normal', ALINHAMENTO[c.alinhamento ?? 'esquerda'], c.className)}>
                      {c.celula(linha, indice)}
                    </TableCell>
                  ))}
                  {acoesDaLinha ? (
                    <TableCell className="w-12 pl-0">
                      <RowActionsMenu rowId={`${base}-${k}`} actions={acoes} />
                    </TableCell>
                  ) : null}
                </TableRow>
                {comPainel && aberta ? (
                  <TableRow className="bg-[var(--color-surface-muted)] hover:bg-[var(--color-surface-muted)] even:bg-[var(--color-surface-muted)]">
                    <TableCell colSpan={totalColunas} className="p-0 whitespace-normal">
                      {painel(linha)}
                    </TableCell>
                  </TableRow>
                ) : null}
              </Fragment>
            )
          })
        )}
      </TableBody>
    </Table>
  )

  const cartoes = (
    <ul aria-label={rotulo} className="divide-y divide-[var(--color-border)]">
      {linhas.length === 0 ? (
        <li className="px-4 py-10 text-center text-sm text-[var(--color-fg-muted)]">
          {vazio?.titulo ?? 'Nenhum registro encontrado'}
        </li>
      ) : (
        linhas.map((linha, indice) => {
          const k = chave(linha)
          const aberta = abertas.has(k)
          const comPainel = temDetalhe ? temDetalhe(linha) : true
          const acoes = acoesDaLinha?.(linha) ?? []
          const campos = colunas.filter((c) => c !== colunaPrincipal && !c.ocultaNoCartao)
          return (
            <li key={k} className={cn('space-y-2 px-4 py-3', classeDaLinhaClicavel)} {...propsDaLinha(linha)}>
              <div className="flex items-start gap-2">
                {comPainel ? botao(linha) : <span className="size-7 shrink-0" aria-hidden />}
                <div className="min-w-0 flex-1">
                  {renderCartao ? (
                    renderCartao(linha)
                  ) : (
                    <>
                      <div className="text-sm font-semibold text-[var(--color-fg)]">
                        {colunaPrincipal.celula(linha, indice)}
                      </div>
                      {campos.length > 0 ? (
                        <dl className="mt-1.5 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
                          {campos.map((c) => (
                            <Fragment key={c.id}>
                              <dt className="text-[var(--color-fg-muted)]">{c.titulo}</dt>
                              <dd className="min-w-0 text-[var(--color-fg)] [overflow-wrap:anywhere]">
                                {c.celula(linha, indice)}
                              </dd>
                            </Fragment>
                          ))}
                        </dl>
                      ) : null}
                    </>
                  )}
                </div>
                {acoesDaLinha && acoes.length > 0 ? <RowActionsMenu rowId={`${base}-${k}`} actions={acoes} /> : null}
              </div>
              {comPainel && aberta ? (
                <div className="-mx-4 bg-[var(--color-surface-muted)]">{painel(linha)}</div>
              ) : null}
            </li>
          )
        })
      )}
    </ul>
  )

  return (
    <div
      ref={ref}
      data-modo={largo ? 'tabela' : 'cartoes'}
      className={cn(
        'overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)]',
        className,
      )}
    >
      {largo ? tabela : cartoes}
      {rodape}
    </div>
  )
}
