import type { ComponentProps, HTMLAttributes, ReactNode, TdHTMLAttributes, ThHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Progress } from '../ui/progress'
import { faixaDocumento } from './documento-variants'
import { ProgressoPorFaixa } from './ProgressoPorFaixa'
import { textoPaginas } from './grafico-logica'

/*
 * Documento de impressão: o formulário de papel reproduzido na tela como UMA folha com grade, e não como
 * pilha de cartões. A moldura mora na Folha e só nela; o resto entra rente, sem raio e sem sombra.
 */

// ─── Folha ─────────────────────────────────────────────────────────────────

export interface FolhaProps {
  /** Cabeçalho, blocos, faixas e tabelas do documento, na ordem do impresso. */
  children: ReactNode
  className?: string
}

/**
 * A folha: uma borda de 1px em `--color-border-strong`, sem raio, com `overflow` escondido para que faixa
 * e grade encostem na borda. Os filhos entram rentes. A folha não aplica espaçamento: qualquer margem
 * aqui reabriria a pilha de cartões que ela existe para fechar.
 */
export function Folha({ children, className }: FolhaProps) {
  return (
    <div
      data-folha=""
      className={cn('overflow-hidden rounded-none border border-[var(--color-border-strong)] bg-[var(--color-surface)]', className)}
    >
      {children}
    </div>
  )
}

// ─── Cabeçalho do documento ────────────────────────────────────────────────

export interface MetadadoDocumento {
  rotulo: string
  valor: string
  /**
   * O que escrever quando o documento ainda não tem este valor. Célula em branco lê-se como "o sistema
   * perdeu"; com esta prop sai em cinza e itálico ("sem revisão"). Sem ela, valor vazio sai vazio.
   */
  quandoVazio?: string
}

export interface CabecalhoDocumentoProps {
  titulo: string
  /** Código, revisão, elaboração, aprovação. Lista vazia some com a grade. */
  metadados: MetadadoDocumento[]
  /** Bloco da marca, à esquerda do título (por exemplo a logo em branco). Sem ele a faixa ocupa a linha toda. */
  marca?: ReactNode
  /** Nível do título: `1` quando a folha é a página inteira e este é o `h1`; `2` (padrão) dentro de uma página. */
  nivel?: 1 | 2
  className?: string
}

/**
 * Topo do documento: marca e título numa faixa verde, e abaixo a linha de metadados em células, cada
 * rótulo numa barra grafite sobre o próprio valor (no impresso o rótulo é cabeçalho de coluna). Sem
 * moldura própria: a borda é da `Folha`.
 */
export function CabecalhoDocumento({ titulo, metadados, marca, nivel = 2, className }: CabecalhoDocumentoProps) {
  const Titulo = nivel === 1 ? 'h1' : 'h2'
  return (
    <header className={cn('overflow-hidden bg-[var(--color-surface)]', className)}>
      <div className="flex items-stretch bg-[var(--documento-faixa-titulo)]">
        {marca ? (
          <div className="flex shrink-0 items-center justify-center border-r border-white/25 px-4 py-2">{marca}</div>
        ) : null}
        <div className="flex min-w-0 flex-1 items-center justify-center px-[14px] py-[11px]">
          <Titulo className="font-heading min-w-0 text-center text-[15px] font-extrabold uppercase tracking-[0.04em] text-white">
            {titulo}
          </Titulo>
        </div>
      </div>
      {metadados.length > 0 ? (
        <dl className="grid grid-cols-2 md:grid-cols-4">
          {metadados.map((meta) => {
            const faltando = meta.valor.trim() === '' && meta.quandoVazio !== undefined
            const escrito = faltando ? (meta.quandoVazio as string) : meta.valor
            return (
              <div key={meta.rotulo} className="min-w-0 border-r border-t border-[var(--color-border)]">
                <dt className="bg-[var(--documento-faixa-rotulo)] px-2 py-[5px] text-center text-[10.5px] font-bold uppercase tracking-[0.08em] text-white">
                  {meta.rotulo}
                </dt>
                <dd
                  className={cn(
                    'truncate px-2 py-[7px] text-center font-mono text-[13px]',
                    faltando ? 'italic text-[var(--color-fg-muted)]' : 'text-[var(--color-fg)]',
                  )}
                  title={escrito}
                >
                  {escrito}
                </dd>
              </div>
            )
          })}
        </dl>
      ) : null}
    </header>
  )
}

// ─── Faixas de seção e de categoria ────────────────────────────────────────

export interface ProgressoDaFaixa {
  feitos: number
  total: number
}

export type TomFaixaDocumento = 'normal' | 'indisponivel' | 'legenda'

export interface FaixaSecaoDocumentoProps {
  nome: string
  /** Páginas do impresso onde a seção aparece. Vazio some com o texto. */
  paginas?: (string | number)[]
  /** Ações da seção, alinhadas à direita. */
  acoes?: ReactNode
  /** Barra de preenchimento com "feitos/total". Sem total não há o que medir e a barra não sai. */
  progresso?: ProgressoDaFaixa
  /** Nome acessível da barra. Padrão: "Progresso de <nome>". */
  rotuloDoProgresso?: string
  /** `indisponivel`: a seção existe no impresso e ainda não pode ser preenchida (cinza). `legenda`: a linha de legenda do papel (grafite). */
  tom?: TomFaixaDocumento
  /** Nível do título. Padrão 3. */
  nivelTitulo?: 2 | 3 | 4
  /** Título centralizado na faixa (o impresso da folha de referência). */
  centralizado?: boolean
  className?: string
}

/** A faixa que abre cada seção do documento: o degrau mais escuro da escada. */
export function FaixaSecaoDocumento({
  nome,
  paginas = [],
  acoes,
  progresso,
  rotuloDoProgresso,
  tom = 'normal',
  nivelTitulo = 3,
  centralizado = false,
  className,
}: FaixaSecaoDocumentoProps) {
  const Titulo = `h${nivelTitulo}` as 'h2' | 'h3' | 'h4'
  const referencia = textoPaginas(paginas)
  const temBarra = progresso !== undefined && progresso.total > 0
  return (
    <div data-faixa="secao" data-tom={tom} className={cn(faixaDocumento({ nivel: 'secao', tom }), className)}>
      <Titulo
        className={cn(
          'font-heading min-w-0 flex-1 text-[12px] font-bold uppercase tracking-[0.08em] text-white',
          centralizado && 'text-center',
        )}
      >
        {nome}
      </Titulo>
      {referencia ? <span className="font-mono text-[11px] text-white/90">{referencia} do impresso</span> : null}
      {temBarra ? (
        <div className="flex min-w-[160px] flex-1 items-center gap-2">
          <Progress
            value={progresso.feitos}
            max={progresso.total}
            className="h-2 flex-1"
            aria-label={rotuloDoProgresso ?? `Progresso de ${nome}`}
          />
          <span className="font-mono text-[11px] font-semibold text-white [font-variant-numeric:tabular-nums]">
            {progresso.feitos}/{progresso.total}
          </span>
        </div>
      ) : null}
      {acoes ? <div className="flex shrink-0 items-center gap-1">{acoes}</div> : null}
    </div>
  )
}

export interface FaixaCategoriaDocumentoProps {
  nome: string
  /** Contagem de itens: texto puro ou Badge. */
  contagem?: ReactNode
  /** Barra colorida pela faixa de porcentagem, com "feitos/total". */
  progresso?: ProgressoDaFaixa
  /** Nome acessível da barra. Padrão: "Preenchimento de <nome>". */
  rotuloDoProgresso?: string
  tom?: TomFaixaDocumento
  /** Nível do título. Padrão 4. */
  nivelTitulo?: 2 | 3 | 4
  /** Título centralizado na faixa. */
  centralizado?: boolean
  className?: string
}

/**
 * A faixa de categoria, logo abaixo da faixa da seção: um degrau acima em claridade. Categoria é opcional;
 * quando a seção não tem, quem chama não renderiza esta faixa.
 */
export function FaixaCategoriaDocumento({
  nome,
  contagem,
  progresso,
  rotuloDoProgresso,
  tom = 'normal',
  nivelTitulo = 4,
  centralizado = false,
  className,
}: FaixaCategoriaDocumentoProps) {
  const Titulo = `h${nivelTitulo}` as 'h2' | 'h3' | 'h4'
  const temBarra = progresso !== undefined && progresso.total > 0
  return (
    <div data-faixa="categoria" data-tom={tom} className={cn(faixaDocumento({ nivel: 'categoria', tom }), className)}>
      <Titulo
        className={cn(
          'font-heading min-w-0 text-[12.5px] font-bold uppercase tracking-[0.06em] text-white',
          centralizado && 'flex-1 text-center',
        )}
      >
        {nome}
      </Titulo>
      {contagem !== undefined ? <span className="font-mono text-[11px] text-white/90">{contagem}</span> : null}
      {temBarra ? (
        <div className="flex min-w-[160px] flex-1 items-center gap-2">
          <ProgressoPorFaixa
            valor={progresso.feitos}
            maximo={progresso.total}
            className="flex-1"
            rotulo={rotuloDoProgresso ?? `Preenchimento de ${nome}`}
          />
          <span className="font-mono text-[11px] font-semibold text-white [font-variant-numeric:tabular-nums]">
            {progresso.feitos}/{progresso.total}
          </span>
        </div>
      ) : null}
    </div>
  )
}

// ─── Bloco de campos ───────────────────────────────────────────────────────

export interface CampoDocumento {
  rotulo: string
  /** `null` é campo ainda em branco, não campo inexistente: sai como "a preencher". */
  valor: string | null
}

/** Quanto o valor mais comprido pede da célula, que decide onde a grade troca de colunas: 2 a partir de 34rem e 3 a partir de 42rem (`curtos`) ou 53rem (`longos`). */
export type ValoresDoBloco = 'curtos' | 'longos'

export interface BlocoDeCamposDocumentoProps {
  /** Vira a faixa escura do bloco, por exemplo "Dados do equipamento". */
  titulo: string
  campos: CampoDocumento[]
  valores?: ValoresDoBloco
  /** Texto do campo sem valor. Padrão "a preencher". */
  textoVazio?: string
  /** Nível do título. Padrão 3. */
  nivelTitulo?: 2 | 3 | 4
  className?: string
}

const GRADE: Record<ValoresDoBloco, string> = {
  curtos: 'grid grid-cols-1 @min-[34rem]:grid-cols-2 @min-[42rem]:grid-cols-3',
  longos: 'grid grid-cols-1 @min-[34rem]:grid-cols-2 @min-[53rem]:grid-cols-3',
}

/**
 * Os dados do documento: faixa escura com o nome do bloco e, abaixo, rótulo e valor lado a lado em células
 * de grade. A quebra de colunas é por contêiner (`@container`), então responde à abertura do menu lateral.
 * Valor longo quebra em outra linha: nada é cortado.
 */
export function BlocoDeCamposDocumento({
  titulo,
  campos,
  valores = 'curtos',
  textoVazio = 'a preencher',
  nivelTitulo = 3,
  className,
}: BlocoDeCamposDocumentoProps) {
  const Titulo = `h${nivelTitulo}` as 'h2' | 'h3' | 'h4'
  return (
    <section className={cn('@container overflow-hidden bg-[var(--color-surface)]', className)}>
      <Titulo className="font-heading bg-[var(--color-primary-hover)] px-[10px] py-[6px] text-center text-[11px] font-bold uppercase tracking-[0.1em] text-white">
        {titulo}
      </Titulo>
      {campos.length > 0 ? (
        <dl className={GRADE[valores]}>
          {campos.map((campo) => (
            <div key={campo.rotulo} className="flex min-w-0 items-baseline gap-2 border-r border-t border-[var(--color-border)] px-[14px] py-[6px]">
              <dt className="shrink-0 text-[10.5px] font-bold uppercase tracking-[0.08em] text-[var(--color-fg-muted)]">{campo.rotulo}</dt>
              <dd
                className={cn(
                  'min-w-0 flex-1 text-right font-mono text-[13px]',
                  campo.valor === null ? 'italic text-[var(--color-fg-muted)]' : 'font-semibold text-[var(--color-primary-text)]',
                )}
                title={campo.valor ?? textoVazio}
              >
                {campo.valor ?? textoVazio}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}
    </section>
  )
}

// ─── Tabela do documento ───────────────────────────────────────────────────

/** Moldura, zebra e fio vertical são a própria definição da grade, então não se abrem para quem chama. */
export type TabelaDocumentoProps = Omit<ComponentProps<typeof Table>, 'framed' | 'zebra' | 'verticalBorders'>

/**
 * Tabela de itens em forma de grade de documento: rente (sem moldura), sem zebra, com fio vertical e
 * horizontal em toda célula. Monta-se sobre a `Table` do DS.
 */
export function TabelaDocumento({ density = 'compact', className, ...props }: TabelaDocumentoProps) {
  return (
    <Table data-tabela-documento="" framed={false} zebra={false} verticalBorders density={density} className={cn('w-full', className)} {...props} />
  )
}

export { TableBody as CorpoTabelaDocumento, TableRow as LinhaTabelaDocumento }

/** Cabeçalho da tabela em faixa escura, como as demais faixas do documento (sem hover claro, sem fio duplo). */
export function CabecalhoTabelaDocumento({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <TableHeader
      className={cn('bg-[var(--color-primary-hover)]', '[&_tr]:border-0 [&_tr:hover]:bg-transparent', className)}
      {...props}
    />
  )
}

/** Célula de cabeçalho: texto branco em caixa alta, fio branco de baixa opacidade entre colunas. */
export function CelulaCabecalhoDocumento({ className, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <TableHead
      className={cn(
        'px-[9px] py-[7px] text-[10px] font-bold uppercase tracking-[0.08em] text-white',
        'border-r border-white/25 last:border-r-0',
        className,
      )}
      {...props}
    />
  )
}

/** Célula de corpo: 42px de altura fixa (a grade do impresso é regular) e fio embaixo e à direita. */
export function CelulaDocumento({ className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <TableCell
      className={cn('h-[42px] px-[9px] py-[4px]', 'border-b border-r border-[var(--color-border)] last:border-r-0', className)}
      {...props}
    />
  )
}
