import { useEffect, useId, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { Eraser } from 'lucide-react'
import { cn } from '../../lib/cn'
import { Button } from '../ui/button'
import { FieldMessage } from '../ui/field'

/** Quadro: borda sólida de 1px, raio `md`, papel branco, no máximo 32rem de largura (como na Manutenção). */
// Caixa de conteúdo: a proporção vale para o desenho e a borda soma 2 px (158,9 px de altura a 512 de largura, como na Manutenção).
const QUADRO = 'box-content block w-[calc(100%-2px)] max-w-[510px] rounded-md border border-[var(--color-border)] bg-[var(--color-white,#fff)]'

export interface AssinaturaCanvasProps {
  /** Quem assina ("Inspetor responsável"). Rótulo do quadro e do `alt` da imagem registrada. */
  rotulo: string
  /** Assinatura já gravada (data URL). Com ela o quadro dá lugar à imagem; "Limpar" volta ao quadro vazio. */
  valor?: string | null
  /** Recebe o PNG (data URL) ao levantar o ponteiro, e `null` ao limpar. */
  onChange: (dataUrl: string | null) => void
  /** Só leitura: sem desenhar, sem botão "Limpar". */
  desabilitado?: boolean
  /** Mostra o asterisco e "(obrigatória)" para leitor de tela. */
  obrigatoria?: boolean
  /** Mensagem de erro. Só aparece enquanto não há assinatura: borda vermelha e texto sob o quadro. */
  erro?: string
  /** Largura interna do PNG gerado, em pixels. Padrão 520. */
  largura?: number
  /** Altura interna do PNG gerado, em pixels. Padrão 160. */
  altura?: number
  /** Texto de apoio com o quadro vazio. */
  dicaVazio?: string
  /** Texto de apoio com a assinatura gravada. */
  dicaRegistrada?: string
  className?: string
}

/**
 * Quadro de assinatura com o dedo, a caneta ou o mouse (eventos de ponteiro: um código para
 * os três). O traço sai do tamanho do quadro na tela para o tamanho interno por regra de três,
 * então o PNG tem sempre `largura` x `altura`, em qualquer tela. O papel é branco nos dois
 * temas (é uma imagem que vai para um documento) e o traço é o azul-escuro da marca.
 *
 * O quadro precisa de ponteiro: quem não consegue desenhar assina por outro caminho do app
 * (campo de nome, foto). O quadro tem `touch-action: none`, então não rola a página por baixo
 * do dedo; fora do quadro a rolagem segue normal.
 */
export function AssinaturaCanvas({
  rotulo,
  valor,
  onChange,
  desabilitado,
  obrigatoria,
  erro,
  largura = 520,
  altura = 160,
  dicaVazio = 'Assine dentro do quadro.',
  dicaRegistrada = 'Assinatura registrada.',
  className,
}: AssinaturaCanvasProps) {
  const idBase = useId()
  const canvas = useRef<HTMLCanvasElement>(null)
  const desenhando = useRef(false)
  // Enquanto a pessoa assina, o quadro fica na tela mesmo depois do primeiro traço gravado.
  const [comTraco, setComTraco] = useState(false)
  const mostrarImagem = !!valor && !comTraco
  const semAssinatura = !valor

  function contexto(): CanvasRenderingContext2D | null {
    const c = canvas.current
    const ctx = c?.getContext('2d') ?? null
    if (c && ctx) {
      ctx.lineWidth = 3
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.strokeStyle = getComputedStyle(c).getPropertyValue('--cor-traco').trim() || '#002a68'
    }
    return ctx
  }

  function pintarPapel() {
    const c = canvas.current
    const ctx = c?.getContext('2d')
    if (!c || !ctx) return
    ctx.fillStyle = getComputedStyle(c).getPropertyValue('--cor-papel').trim() || '#ffffff'
    ctx.fillRect(0, 0, c.width, c.height)
  }

  useEffect(() => {
    if (!mostrarImagem) pintarPapel()
  }, [mostrarImagem])

  function ponto(e: PointerEvent<HTMLCanvasElement>) {
    const c = canvas.current!
    const r = c.getBoundingClientRect()
    return {
      x: ((e.clientX - r.left) / (r.width || largura)) * largura,
      y: ((e.clientY - r.top) / (r.height || altura)) * altura,
    }
  }

  function comecar(e: PointerEvent<HTMLCanvasElement>) {
    if (desabilitado) return
    const ctx = contexto()
    if (!ctx) return
    e.currentTarget.setPointerCapture?.(e.pointerId)
    desenhando.current = true
    const { x, y } = ponto(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
    // Um toque sem arrastar vira um ponto.
    ctx.lineTo(x + 0.01, y + 0.01)
    ctx.stroke()
    setComTraco(true)
  }

  function mover(e: PointerEvent<HTMLCanvasElement>) {
    if (!desenhando.current) return
    const ctx = contexto()
    if (!ctx) return
    const { x, y } = ponto(e)
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  function terminar() {
    if (!desenhando.current) return
    desenhando.current = false
    const c = canvas.current
    if (c) onChange(c.toDataURL('image/png'))
  }

  function limpar() {
    desenhando.current = false
    setComTraco(false)
    pintarPapel()
    onChange(null)
  }

  const temErro = !!erro && semAssinatura
  const idDica = `${idBase}-dica`
  const idErro = `${idBase}-erro`
  const proporcao = { aspectRatio: `${largura} / ${altura}` }
  return (
    <div
      className={cn('space-y-2', className)}
      style={
        {
          '--cor-papel': 'var(--color-white, #fff)',
          '--cor-traco': 'var(--color-fips-blue-950)',
        } as CSSProperties
      }
    >
      <p className="text-[13px] font-semibold text-[var(--color-fg)]">
        {rotulo}
        {obrigatoria ? (
          <>
            <span aria-hidden className="ml-1 text-[var(--color-danger-text)]">
              *
            </span>
            <span className="sr-only"> (obrigatória)</span>
          </>
        ) : null}
      </p>
      <div className="space-y-2">
        {mostrarImagem ? (
          <img
            src={valor!}
            alt={`Assinatura: ${rotulo}`}
            className={cn(QUADRO, temErro && 'border-[var(--color-danger)]')}
            style={proporcao}
          />
        ) : (
          <canvas
            ref={canvas}
            width={largura}
            height={altura}
            role="img"
            aria-label={`Quadro para assinar: ${rotulo}. Desenhe com o dedo ou o mouse.`}
            aria-describedby={temErro ? `${idDica} ${idErro}` : idDica}
            onPointerDown={comecar}
            onPointerMove={mover}
            onPointerUp={terminar}
            onPointerCancel={terminar}
            onPointerLeave={terminar}
            className={cn(QUADRO, temErro && 'border-[var(--color-danger)]', desabilitado ? 'cursor-not-allowed' : 'cursor-crosshair')}
            style={{ ...proporcao, touchAction: 'none' }}
          />
        )}
        <div className="flex items-center justify-between gap-2">
          <span id={idDica} className="text-xs text-[var(--color-fg-muted)]">
            {semAssinatura ? dicaVazio : dicaRegistrada}
          </span>
          {desabilitado ? null : (
            <Button type="button" variant="outline" size="md" onClick={limpar} disabled={semAssinatura && !comTraco}>
              <Eraser aria-hidden />
              Limpar
            </Button>
          )}
        </div>
      </div>
      {temErro ? (
        <FieldMessage id={idErro} className="ml-0">
          {erro}
        </FieldMessage>
      ) : null}
    </div>
  )
}
