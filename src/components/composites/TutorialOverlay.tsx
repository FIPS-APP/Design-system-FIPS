import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight, GraduationCap, X } from 'lucide-react'
import { cn } from '../../lib/cn'
import { indiceDoFocoNoTab, posicaoDoCartao, rolagemParaLiberarOAlvo } from './app-shell-logica'
import type { PassoDoTutorial } from './app-shell-tipos'

export interface TutorialOverlayProps {
  aberto: boolean
  aoFechar: () => void
  /**
   * Passos da tela atual. Passo com `alvo` fora da janela (aba escondida, gaveta fechada, bloco que o
   * perfil não vê) sai da lista ao abrir, para o destaque nunca apontar para o vazio. A lista é
   * calculada ao abrir e não muda no meio do passo a passo. Passe uma lista estável (constante do módulo
   * ou `useMemo`): uma lista nova a cada render refaz a medição.
   */
  passos: PassoDoTutorial[]
  /** Nome do diálogo para leitor de tela. Padrão "Tutorial desta tela". */
  rotulo?: string
}

const LARGURA = 420
const FOLGA_DO_DESTAQUE = 8

/** O alvo existe e está dentro da janela. */
function estaNaTela(seletor: string): boolean {
  const el = document.querySelector(seletor)
  if (!el) return false
  const r = el.getBoundingClientRect()
  return r.width > 0 && r.height > 0 && r.right > 0 && r.left < window.innerWidth
}

function medir(seletor: string): DOMRect | null {
  return document.querySelector(seletor)?.getBoundingClientRect() ?? null
}

/** Rola até o alvo e espera a rolagem suave terminar antes de medir. */
function rolarAte(seletor: string): Promise<void> {
  return new Promise((resolve) => {
    const el = document.querySelector(seletor)
    if (!el) {
      resolve()
      return
    }
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    setTimeout(resolve, 450)
  })
}

/**
 * Tutorial passo a passo: véu azul com recorte (spotlight) no elemento da tela, cartão com título,
 * texto, pontos de progresso e Anterior/Próximo. Teclado: ← → Enter avançam e voltam, Esc fecha, Tab fica preso no cartão e o foco volta a quem abriu. Em janela estreita o cartão não cobre o destaque.
 * Os passos vêm por props; o cartão renderiza em portal acima do cabeçalho e do menu.
 */
export function TutorialOverlay({ aberto, aoFechar, passos, rotulo = 'Tutorial desta tela' }: TutorialOverlayProps) {
  const idMascara = useId().replace(/:/g, '')
  const idTitulo = `tutorial-titulo-${idMascara}`
  const [indice, setIndice] = useState(0)
  // Medida do alvo do passo `indice`. Enquanto não houver medida do passo atual a página está rolando
  // até o alvo: o cartão fica no centro e o recorte espera.
  const [medido, setMedido] = useState<{ indice: number; caixa: DOMRect | null } | null>(null)
  const [alturaDoCartao, setAlturaDoCartao] = useState(280)
  const cartaoRef = useRef<HTMLDivElement>(null)
  const alturaRef = useRef(280)

  const lista = useMemo(
    () => passos.filter((p) => !aberto || !p.alvo || estaNaTela(p.alvo)),
    [aberto, passos],
  )
  const passo = lista[indice]
  const ultimo = indice === lista.length - 1
  const primeiro = indice === 0

  // Reabrir recomeça do primeiro passo.
  const [abertoAntes, setAbertoAntes] = useState(aberto)
  if (abertoAntes !== aberto) {
    setAbertoAntes(aberto)
    if (aberto) {
      setIndice(0)
      setMedido(null)
    }
  }

  useEffect(() => {
    if (!aberto) return
    const alvo = passo?.alvo
    if (!alvo) return
    let vivo = true
    void rolarAte(alvo).then(() => {
      if (!vivo) return
      let caixa = medir(alvo)
      // Celular: se o cartão não cabe nem acima nem abaixo do alvo, ele encosta no pé da janela; rola a
      // página para o alvo ficar na parte livre, em vez de o cartão cobri-lo.
      if (caixa && window.innerWidth < 640) {
        const h = alturaRef.current
        const cabeAbaixo = caixa.bottom + 28 + h < window.innerHeight - 16
        const cabeAcima = caixa.top - h - 28 > 16
        if (!cabeAbaixo && !cabeAcima) {
          const delta = rolagemParaLiberarOAlvo(caixa, h, window.innerHeight)
          if (Math.abs(delta) > 2) {
            window.scrollBy({ top: delta, behavior: 'instant' as ScrollBehavior })
            caixa = medir(alvo)
          }
        }
      }
      setMedido({ indice, caixa })
    })
    const atualizar = () => setMedido({ indice, caixa: medir(alvo) })
    const timer = setTimeout(() => {
      window.addEventListener('scroll', atualizar, true)
      window.addEventListener('resize', atualizar)
    }, 500)
    return () => {
      vivo = false
      clearTimeout(timer)
      window.removeEventListener('scroll', atualizar, true)
      window.removeEventListener('resize', atualizar)
    }
  }, [aberto, indice, passo])

  const proximo = useCallback(() => {
    if (!ultimo) setIndice((i) => i + 1)
    else aoFechar()
  }, [ultimo, aoFechar])
  const anterior = useCallback(() => {
    if (!primeiro) setIndice((i) => i - 1)
  }, [primeiro])

  useEffect(() => {
    if (!aberto) return
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') aoFechar()
      // Enter num botão do cartão é o clique dele (Anterior, Fechar): não avança junto.
      const emBotao = e.target instanceof Element && e.target.closest('button') !== null
      if (e.key === 'ArrowRight' || (e.key === 'Enter' && !emBotao)) proximo()
      if (e.key === 'ArrowLeft') anterior()
      // Tab fica preso no cartão (aria-modal): volta ao começo depois do último botão.
      if (e.key === 'Tab' && cartaoRef.current) {
        const focaveis = Array.from(cartaoRef.current.querySelectorAll<HTMLElement>('button:not(:disabled)'))
        const atual = focaveis.indexOf(document.activeElement as HTMLElement)
        const alvo = focaveis[indiceDoFocoNoTab(focaveis.length, atual, e.shiftKey)]
        if (alvo) {
          e.preventDefault()
          alvo.focus()
        }
      }
    }
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [aberto, proximo, anterior, aoFechar])

  useLayoutEffect(() => {
    if (!aberto || !cartaoRef.current) return
    const h = cartaoRef.current.offsetHeight
    if (h > 0) {
      alturaRef.current = h
      setAlturaDoCartao(h)
    }
  }, [aberto, indice, passo?.titulo, passo?.descricao])

  // O foco entra no cartão ao abrir (no botão principal) e volta a quem o tinha ao fechar.
  useEffect(() => {
    if (!aberto) return
    const origem = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const timer = setTimeout(() => {
      cartaoRef.current?.querySelector<HTMLElement>('[data-tutorial-proximo]')?.focus({ preventScroll: true })
    }, 0)
    return () => {
      clearTimeout(timer)
      if (origem?.isConnected) origem.focus({ preventScroll: true })
    }
  }, [aberto])

  if (!aberto || lista.length === 0 || typeof document === 'undefined') return null

  const largura = Math.min(LARGURA, window.innerWidth - 32)
  const spot = passo?.alvo && medido?.indice === indice ? medido.caixa : null
  const pos = posicaoDoCartao(spot, largura, alturaDoCartao, {
    largura: window.innerWidth,
    altura: window.innerHeight,
  })

  return createPortal(
    <div className="fixed inset-0 z-[9999]">
      <svg className="pointer-events-none absolute inset-0 z-0 h-full w-full" aria-hidden>
        <defs>
          <mask id={`tutorial-mask-${idMascara}`}>
            <rect width="100%" height="100%" fill="white" />
            {spot ? (
              <rect
                x={spot.left - FOLGA_DO_DESTAQUE}
                y={spot.top - FOLGA_DO_DESTAQUE}
                width={spot.width + FOLGA_DO_DESTAQUE * 2}
                height={spot.height + FOLGA_DO_DESTAQUE * 2}
                rx={10}
                fill="black"
              />
            ) : null}
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="rgb(0 42 104 / 0.55)"
          mask={`url(#tutorial-mask-${idMascara})`}
        />
      </svg>

      {spot ? (
        <div
          className="pointer-events-none absolute z-0 rounded-[10px] border-2 border-[var(--color-fips-blue-900)] shadow-[0_0_20px_rgb(0_75_155/0.4),0_0_60px_rgb(0_75_155/0.15)]"
          style={{
            top: spot.top - FOLGA_DO_DESTAQUE,
            left: spot.left - FOLGA_DO_DESTAQUE,
            width: spot.width + FOLGA_DO_DESTAQUE * 2,
            height: spot.height + FOLGA_DO_DESTAQUE * 2,
            transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      ) : null}

      {/* Clique fora do cartão fecha. */}
      <div className="absolute inset-0 z-[1] cursor-pointer" onClick={aoFechar} aria-hidden />

      <div
        ref={cartaoRef}
        role="dialog"
        aria-modal="true"
        aria-label={rotulo}
        aria-labelledby={idTitulo}
        className="absolute z-[2]"
        style={{
          top: pos.top,
          left: pos.left,
          transform: pos.transform,
          width: LARGURA,
          maxWidth: 'calc(100vw - 32px)',
          transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {pos.seta === 'cima' && spot ? (
          <div className="-mt-2 mb-0 flex justify-center">
            <div className="fips-tutorial-seta fips-tutorial-seta--cima" aria-hidden />
          </div>
        ) : null}

        <div className="fips-tutorial-cartao relative overflow-hidden rounded-[20px]">
          <div
            aria-hidden
            className="pointer-events-none absolute top-0 right-0 left-0 h-[3px] rounded-t-[20px] bg-gradient-to-r from-[var(--color-fips-blue-900)] via-[var(--color-fips-blue-400)] to-transparent"
          />

          <div className="relative z-[1] flex items-center justify-between px-5 pt-3 pb-2">
            <div className="flex items-center gap-2.5">
              <div className="fips-header-tile pointer-events-none h-9 w-9" aria-hidden>
                <GraduationCap className="h-4 w-4" strokeWidth={2} />
              </div>
              <span className="font-heading text-[10px] font-bold tracking-[1.5px] text-[var(--color-primary-text)] uppercase">
                Passo {indice + 1} de {lista.length}
              </span>
            </div>
            <button
              type="button"
              onClick={aoFechar}
              aria-label="Fechar tutorial"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-black/[0.08] bg-black/[0.04] text-zinc-500 transition-all hover:border-[color-mix(in_srgb,var(--color-primary)_30%,transparent)] hover:bg-[color-mix(in_srgb,var(--color-primary)_10%,transparent)] hover:text-[var(--color-primary-text)] focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:outline-none dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-zinc-400"
            >
              <X className="h-3.5 w-3.5" aria-hidden strokeWidth={2} />
            </button>
          </div>

          <div className="relative z-[1] max-h-[200px] overflow-y-auto px-5 pb-3">
            <h3
              id={idTitulo}
              className="mb-1.5 font-heading text-[15px] font-bold text-zinc-900 dark:text-[var(--color-fips-prata-25)]"
            >
              {passo?.titulo}
            </h3>
            <p className="text-[13px] leading-[1.6] whitespace-pre-line text-zinc-600 dark:text-zinc-400">
              {passo?.descricao}
            </p>
          </div>

          <div className="relative z-[1] flex justify-center gap-1.5 pb-3" aria-hidden>
            {lista.map((_, i) => (
              <div
                key={i}
                className={cn(
                  'h-[6px] rounded-full transition-all duration-300',
                  i === indice
                    ? 'w-5 bg-gradient-to-r from-[var(--color-fips-yellow-600)] to-[var(--color-fips-yellow-800)] shadow-[0_0_10px_rgb(246_146_30/0.35)]'
                    : 'w-[6px]',
                  i < indice && 'bg-[color-mix(in_srgb,var(--color-fips-blue-900)_45%,transparent)]',
                  i > indice && 'bg-black/10 dark:bg-white/15',
                )}
              />
            ))}
          </div>

          <div className="relative z-[1] flex items-center justify-between gap-3 px-5 pb-4">
            <button
              type="button"
              onClick={anterior}
              disabled={primeiro}
              className={cn(
                'flex min-h-[36px] items-center gap-1 rounded-[10px] border border-black/10 bg-white/90 px-3 py-2 text-[12px] font-semibold text-zinc-700 transition-all hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:outline-none dark:border-white/10 dark:bg-white/[0.08] dark:text-zinc-200 dark:hover:bg-white/[0.12]',
                primeiro && 'pointer-events-none opacity-40',
              )}
            >
              <ChevronLeft className="h-3.5 w-3.5 shrink-0" aria-hidden />
              Anterior
            </button>
            <button
              type="button"
              data-tutorial-proximo=""
              onClick={proximo}
              className={cn(
                'flex min-h-[36px] items-center gap-1 rounded-[10px] px-4 py-2 text-[12px] font-bold text-white transition-all hover:brightness-110 focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2 focus-visible:outline-none',
                ultimo
                  ? 'bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-fips-green-700)_85%,black),color-mix(in_srgb,var(--color-fips-green-700)_60%,black))] shadow-[0_2px_14px_rgb(0_198_76/0.35)]'
                  : 'bg-[var(--color-fips-blue-900)] shadow-[0_2px_12px_rgb(0_75_155/0.35)]',
              )}
            >
              {ultimo ? 'Entendi!' : 'Próximo'}
              {!ultimo ? <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden /> : null}
            </button>
          </div>
        </div>

        {pos.seta === 'baixo' && spot ? (
          <div className="-mb-2 flex justify-center">
            <div className="fips-tutorial-seta fips-tutorial-seta--baixo" aria-hidden />
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  )
}
