import { useId, useRef, useState, type ReactNode } from 'react'
import { Download, Info } from 'lucide-react'
import { cn } from '../../lib/cn'
import { cliqueEhDeToque, nomeDoArquivoImagem } from './grafico-logica'
import { baixarNoComoPng } from './cartao-imagem'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'

export interface CartaoGraficoProps {
  /** Título do gráfico. Vira o heading do cartão. */
  titulo: string
  /** Uma frase que explica o que o gráfico mede. Abre num balão ao lado do título (foco ou ponteiro) e, no toque, numa nota sob o título. */
  info?: string
  /** Canto direito do cabeçalho: total, legenda compacta ou ações. */
  lateral?: ReactNode
  /** Nível do heading. Padrão 3. */
  nivelTitulo?: 2 | 3 | 4
  /** Quando verdadeiro, no lugar do gráfico aparece `mensagemVazio`. */
  vazio?: boolean
  /** Texto do estado vazio. Padrão: "Nenhum dado no período." */
  mensagemVazio?: ReactNode
  /** Altura mínima do corpo em estado vazio, para o cartão não encolher na grade. Padrão 160. */
  alturaVazio?: number
  /**
   * Mostra o botão "Baixar imagem" no cabeçalho: salva o cartão (título, gráfico e legenda, sem o botão) como
   * PNG, desenhado pelo navegador a partir do que está na tela, sem dependência. Padrão desligado.
   */
  permiteBaixarImagem?: boolean
  /** Nome do arquivo PNG. Padrão: o título sem acento e com hífens (`opas-por-status.png`). */
  nomeArquivoImagem?: string
  className?: string
  children?: ReactNode
}

/**
 * Moldura padrão de um gráfico: título, explicação sob demanda, canto direito e corpo. Raio assimétrico
 * `10/10/10/18` como os cartões de painel. O cartão é um contêiner (`@container`): os gráficos de dentro
 * escolhem a disposição pela largura do cartão, não pela da janela.
 */
export function CartaoGrafico({
  titulo,
  info,
  lateral,
  nivelTitulo = 3,
  vazio = false,
  mensagemVazio = 'Nenhum dado no período.',
  alturaVazio = 160,
  permiteBaixarImagem = false,
  nomeArquivoImagem,
  className,
  children,
}: CartaoGraficoProps) {
  const cartao = useRef<HTMLElement>(null)
  // No toque o balão não abre (só hover e foco de teclado): o toque abre a nota abaixo do título.
  const [notaAberta, setNotaAberta] = useState(false)
  const idNota = useId()
  const [baixando, setBaixando] = useState<'parado' | 'gerando' | 'erro'>('parado')
  async function baixar() {
    if (!cartao.current || baixando === 'gerando') return
    setBaixando('gerando')
    try {
      await baixarNoComoPng(cartao.current, nomeArquivoImagem ?? nomeDoArquivoImagem(titulo))
      setBaixando('parado')
    } catch {
      setBaixando('erro')
    }
  }
  const Titulo = `h${nivelTitulo}` as 'h2' | 'h3' | 'h4'
  return (
    <section
      ref={cartao}
      data-cartao-grafico=""
      className={cn(
        '@container min-w-0 rounded-[10px_10px_10px_18px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 pb-3 pt-3.5 shadow-[var(--shadow-card)]',
        className,
      )}
    >
      <header className="mb-3 flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <Titulo className="font-heading min-w-0 text-[13px] font-semibold leading-snug text-[var(--color-fg)]">{titulo}</Titulo>
          {info ? (
            <TooltipProvider delayDuration={150}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    aria-label={`Sobre este gráfico: ${info}`}
                    aria-expanded={notaAberta}
                    aria-controls={notaAberta ? idNota : undefined}
                    onClick={(e) => {
                      if (cliqueEhDeToque(e.nativeEvent as PointerEvent)) setNotaAberta((v) => !v)
                    }}
                    className="inline-flex size-6 shrink-0 items-center justify-center rounded-full text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-primary-text)] focus-visible:text-[var(--color-primary-text)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--color-primary-text)]"
                  >
                    <Info className="size-3.5" aria-hidden />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-[16rem] text-[11px] leading-snug">{info}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : null}
        </div>
        {lateral || permiteBaixarImagem ? (
          <div className="flex shrink-0 items-center gap-1 text-[11px] text-[var(--color-fg-muted)]">
            {lateral}
            {permiteBaixarImagem && !vazio ? (
              <button
                type="button"
                data-sem-imagem=""
                onClick={baixar}
                disabled={baixando === 'gerando'}
                aria-label={`Baixar imagem do gráfico ${titulo}`}
                title="Baixar imagem (PNG)"
                className="inline-flex size-6 shrink-0 items-center justify-center rounded-md text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-primary-text)] focus-visible:text-[var(--color-primary-text)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--color-primary-text)] disabled:cursor-wait disabled:opacity-60"
              >
                <Download className="size-3.5" aria-hidden />
              </button>
            ) : null}
          </div>
        ) : null}
      </header>
      {info && notaAberta ? (
        <p
          id={idNota}
          role="note"
          data-sem-imagem=""
          className="mb-2 rounded-md bg-[var(--color-surface-muted)] px-2.5 py-2 text-[11px] leading-snug text-[var(--color-fg)]"
        >
          {info}
        </p>
      ) : null}
      {baixando === 'erro' ? (
        <p data-sem-imagem="" role="alert" className="mb-2 text-[11px] text-[var(--color-danger-text)]">
          Não foi possível gerar a imagem. Tente de novo.
        </p>
      ) : null}
      {vazio ? (
        <div
          role="status"
          style={{ minHeight: alturaVazio }}
          className="flex items-center justify-center rounded-lg border border-dashed border-[var(--color-border)] px-4 text-center text-sm text-[var(--color-fg-muted)]"
        >
          {mensagemVazio}
        </div>
      ) : (
        children
      )}
    </section>
  )
}
