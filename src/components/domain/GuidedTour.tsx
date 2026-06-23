import { useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { createPortal } from 'react-dom'
import { ChevronRight, ChevronLeft, X, Sparkles } from 'lucide-react'
import { cn } from '../../lib/cn'
import type { TourStep } from '../../hooks/useTour'

const FIPS_ORANGE = '#F6921E'

const TUTORIAL_GRAIN_BG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23f)'/%3E%3C/svg%3E")`

export interface GuidedTourProps {
  isActive: boolean
  currentStepIndex: number
  currentStep: TourStep | null
  targetRect: DOMRect | null
  totalSteps: number
  next: () => void
  back: () => void
  skip: () => void
}

/* ------------------------------------------------------------------ */
/*  Positioning                                                         */
/* ------------------------------------------------------------------ */

const BALLOON_WIDTH = 320
const BALLOON_HEIGHT_EST = 280 // generous estimate for clamping (header + dots + footer)
const PAD = 12
const GAP = 10

type Placement = 'top' | 'bottom' | 'left' | 'right'

function resolvePosition(
  requested: Placement,
  raw: DOMRect,
): { top: number; left: number; actualPlacement: Placement } {
  const vw = window.innerWidth
  const vh = window.innerHeight

  // Clamp the target rect to the visible viewport so large elements
  // (that extend above/below the scroll fold) don't push the balloon off-screen.
  const visTop = Math.max(0, Math.min(raw.top, vh))
  const visBottom = Math.max(0, Math.min(raw.bottom, vh))
  const visLeft = Math.max(0, Math.min(raw.left, vw))
  const visRight = Math.max(0, Math.min(raw.right, vw))
  const visCX = (visLeft + visRight) / 2
  const visCY = (visTop + visBottom) / 2

  // Space available in each direction from the visible portion
  const spaceBelow = vh - visBottom - GAP
  const spaceAbove = visTop - GAP
  const spaceRight = vw - visRight - GAP
  const spaceLeft = visLeft - GAP

  // Auto-flip if requested placement doesn't have enough room
  let placement = requested
  if (placement === 'bottom' && spaceBelow < BALLOON_HEIGHT_EST + PAD) {
    if (spaceAbove >= BALLOON_HEIGHT_EST + PAD) placement = 'top'
  } else if (placement === 'top' && spaceAbove < BALLOON_HEIGHT_EST + PAD) {
    if (spaceBelow >= BALLOON_HEIGHT_EST + PAD) placement = 'bottom'
  } else if (placement === 'left' && spaceLeft < BALLOON_WIDTH + PAD) {
    if (spaceRight >= BALLOON_WIDTH + PAD) placement = 'right'
  } else if (placement === 'right' && spaceRight < BALLOON_WIDTH + PAD) {
    if (spaceLeft >= BALLOON_WIDTH + PAD) placement = 'left'
  }

  let top = 0
  let left = 0

  switch (placement) {
    case 'bottom':
      top = visBottom + GAP
      left = visCX - BALLOON_WIDTH / 2
      break
    case 'top':
      top = visTop - GAP - BALLOON_HEIGHT_EST
      left = visCX - BALLOON_WIDTH / 2
      break
    case 'left':
      top = visCY - BALLOON_HEIGHT_EST / 2
      left = visLeft - GAP - BALLOON_WIDTH
      break
    case 'right':
      top = visCY - BALLOON_HEIGHT_EST / 2
      left = visRight + GAP
      break
  }

  // Hard clamp so the balloon never escapes the viewport
  left = Math.max(PAD, Math.min(left, vw - PAD - BALLOON_WIDTH))
  top = Math.max(PAD, Math.min(top, vh - PAD - BALLOON_HEIGHT_EST))

  return { top, left, actualPlacement: placement }
}

function arrowClasses(placement: Placement): string {
  // Casa com o painel do padrão (gradiente claro / dark). Borda sutil preto/branco.
  const base = 'absolute w-3 h-3 bg-[#f0f0f2] dark:bg-[#1a1a1e]'
  switch (placement) {
    case 'bottom':
      return `${base} -top-[7px] left-1/2 -translate-x-1/2 rotate-45 border-l border-t border-black/10 dark:border-white/10`
    case 'top':
      return `${base} -bottom-[7px] left-1/2 -translate-x-1/2 rotate-45 border-r border-b border-black/10 dark:border-white/10`
    case 'left':
      return `${base} -right-[7px] top-1/2 -translate-y-1/2 rotate-45 border-r border-t border-black/10 dark:border-white/10`
    case 'right':
      return `${base} -left-[7px] top-1/2 -translate-y-1/2 rotate-45 border-l border-b border-black/10 dark:border-white/10`
  }
}

/* ------------------------------------------------------------------ */
/*  TourBalloon (internal)                                             */
/* ------------------------------------------------------------------ */

interface TourBalloonProps {
  step: TourStep
  targetRect: DOMRect
  stepIndex: number
  totalSteps: number
  onNext: () => void
  onBack: () => void
  onSkip: () => void
}

function TourBalloon({
  step,
  targetRect,
  stepIndex,
  totalSteps,
  onNext,
  onBack,
  onSkip,
}: TourBalloonProps) {
  const requestedPlacement: Placement =
    window.innerWidth < 640 ? 'bottom' : (step.placement ?? 'bottom')

  const { top, left, actualPlacement } = useMemo(
    () => resolvePosition(requestedPlacement, targetRect),
    [requestedPlacement, targetRect],
  )

  const isLast = stepIndex === totalSteps - 1
  const motionY = actualPlacement === 'top' ? -8 : 8

  return (
    <motion.div
      key={step.id}
      initial={{ opacity: 0, y: motionY }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className={cn(
        'pointer-events-auto absolute w-80 max-w-[calc(100vw-1.5rem)] rounded-2xl border',
        'border-black/10 bg-gradient-to-br from-[#fafafa] via-[#f0f0f2] to-[#e8e8ec]',
        'shadow-[0_24px_48px_-12px_rgba(0,0,0,0.22),0_0_0_1px_rgba(255,255,255,0.8)_inset]',
        'dark:border-white/[0.08] dark:from-[#232328] dark:via-[#1a1a1e] dark:to-[#151518]',
        'dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.04)_inset]',
      )}
      style={{ top, left }}
    >
      {/* Arrow (protrai para fora — por isso o container não usa overflow-hidden) */}
      <div className={arrowClasses(actualPlacement)} />

      {/* Grão (mesmo padrão TutorialContextual) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-[0.025] mix-blend-multiply dark:opacity-[0.03] dark:mix-blend-overlay"
        style={{ backgroundImage: TUTORIAL_GRAIN_BG }}
      />
      {/* Faixa azul no topo */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 right-0 top-0 h-[3px] rounded-t-2xl bg-gradient-to-r from-[#004B9B] via-[#93BDE4] to-transparent"
      />

      {/* Header: label do passo + fechar */}
      <div className="relative z-[1] flex items-start justify-between gap-2 px-5 pb-2 pt-4">
        <div className="min-w-0">
          <span className="font-heading text-[10px] font-bold uppercase tracking-[1.5px] text-[#004B9B] dark:text-[#93BDE4]">
            Passo {stepIndex + 1} de {totalSteps}
          </span>
          <h3 className="mt-1 font-heading text-[15px] font-bold text-[#18181b] dark:text-[#fafafa]">
            {step.title}
          </h3>
        </div>
        <button
          type="button"
          onClick={onSkip}
          aria-label="Pular tour"
          className={cn(
            'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all',
            'border border-black/[0.08] bg-black/[0.04] text-zinc-500',
            'hover:border-[rgba(0,75,155,0.25)] hover:bg-[rgba(0,75,155,0.08)] hover:text-[#004B9B]',
            'dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-zinc-400 dark:hover:text-[#93BDE4]',
          )}
        >
          <X className="h-3.5 w-3.5" aria-hidden strokeWidth={2} />
        </button>
      </div>

      {/* Corpo */}
      <div className="relative z-[1] px-5 pb-3">
        <p className="text-[13px] leading-[1.65] text-zinc-600 dark:text-zinc-400">{step.content}</p>
      </div>

      {/* Pontinhos de progresso (laranja) */}
      {totalSteps > 1 && (
        <div className="relative z-[1] flex flex-wrap justify-center gap-1.5 px-5 pb-3">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={cn('rounded-full transition-all duration-300', i > stepIndex && 'bg-black/10 dark:bg-white/15')}
              style={{
                width: i === stepIndex ? 20 : 6,
                height: 6,
                borderRadius: 3,
                background:
                  i === stepIndex
                    ? `linear-gradient(90deg, ${FIPS_ORANGE}, #cf730d)`
                    : i < stepIndex
                      ? 'rgba(0,75,155,0.45)'
                      : undefined,
                boxShadow: i === stepIndex ? '0 0 10px rgba(246,146,30,0.35)' : undefined,
              }}
            />
          ))}
        </div>
      )}

      {/* Rodapé */}
      <div className="relative z-[1] flex items-center justify-between gap-2 border-t border-black/[0.06] px-5 py-3 dark:border-white/[0.06]">
        <button
          type="button"
          onClick={onSkip}
          className="text-[12px] font-semibold text-zinc-500 transition-colors hover:text-[#004B9B] dark:text-zinc-400 dark:hover:text-[#93BDE4]"
        >
          Pular
        </button>
        <div className="flex items-center gap-2">
          {stepIndex > 0 && (
            <button
              type="button"
              onClick={onBack}
              className={cn(
                'flex min-h-[34px] items-center gap-1 rounded-[10px] border px-3 py-1.5 text-[12px] font-semibold transition-all',
                'border-black/10 bg-white/90 text-zinc-700 hover:bg-zinc-100',
                'dark:border-white/10 dark:bg-white/[0.08] dark:text-zinc-200 dark:hover:bg-white/[0.12]',
              )}
            >
              <ChevronLeft className="h-3.5 w-3.5 shrink-0" aria-hidden /> Voltar
            </button>
          )}
          <button
            type="button"
            onClick={onNext}
            className={cn(
              'flex min-h-[34px] items-center gap-1 rounded-[10px] px-4 py-1.5 text-[12px] font-bold text-white transition-all',
              isLast
                ? 'bg-gradient-to-br from-[#00C64C] to-[#00904c] shadow-[0_2px_14px_rgba(0,198,76,0.35)]'
                : 'bg-[#004B9B] hover:bg-[#003d82] shadow-[0_2px_12px_rgba(0,75,155,0.35)]',
            )}
          >
            {isLast ? 'Concluir' : 'Próximo'}
            {!isLast && <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden />}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  GuidedTour                                                         */
/* ------------------------------------------------------------------ */

export function GuidedTour({
  isActive,
  currentStepIndex,
  currentStep,
  targetRect,
  totalSteps,
  next,
  back,
  skip,
}: GuidedTourProps) {
  if (!isActive || !currentStep) return null

  // Welcome step (no target)
  if (currentStep.target === null) {
    return createPortal(
      <motion.div
        /*
         * Tour NÃO BLOQUEANTE: root + backdrop com `pointer-events-none`,
         * só o card com `pointer-events-auto`. O usuário continua interagindo
         * com a página atrás e dispensa o tour pelos botões "Pular"/"Começar"
         * ou Esc.
         */
        className="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Dim overlay (visual only — não captura cliques) */}
        <div className="pointer-events-none absolute inset-0 bg-slate-950/35" aria-hidden />

        {/* Centered card */}
        <motion.div
          className={cn(
            'pointer-events-auto relative z-10 mx-4 w-full max-w-sm overflow-hidden rounded-[20px] border',
            'border-black/10 bg-gradient-to-br from-[#fafafa] via-[#f0f0f2] to-[#e8e8ec]',
            'shadow-[0_24px_48px_-12px_rgba(0,0,0,0.22),0_0_0_1px_rgba(255,255,255,0.8)_inset]',
            'dark:border-white/[0.08] dark:from-[#232328] dark:via-[#1a1a1e] dark:to-[#151518]',
            'dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.04)_inset]',
          )}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {/* Grão + faixa azul no topo */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.025] mix-blend-multiply dark:opacity-[0.03] dark:mix-blend-overlay"
            style={{ backgroundImage: TUTORIAL_GRAIN_BG }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute left-0 right-0 top-0 h-[3px] bg-gradient-to-r from-[#004B9B] via-[#93BDE4] to-transparent"
          />

          {/* Header com ícone neumórfico */}
          <div className="relative z-[1] flex items-center gap-2.5 px-6 pb-2 pt-4">
            <div
              className={cn(
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-black/10',
                'bg-gradient-to-br from-white via-[#ebebeb] to-[#e0e0e0] text-[#004B9B]',
                'shadow-[0_1px_2px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.85)]',
                'dark:border-[#3f3f46] dark:from-[#303036] dark:via-[#222226] dark:to-[#1c1c20] dark:text-[#93BDE4]',
              )}
            >
              <Sparkles className="h-4 w-4" aria-hidden strokeWidth={2} />
            </div>
            <h2 className="font-heading text-[15px] font-bold text-[#18181b] dark:text-[#fafafa]">
              {currentStep.title}
            </h2>
          </div>

          {/* Body */}
          <div className="relative z-[1] px-6 pb-4">
            <p className="text-[13px] leading-[1.65] text-zinc-600 dark:text-zinc-400">
              {currentStep.content}
            </p>
            <div className="mt-5 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={skip}
                className="text-[12px] font-semibold text-zinc-500 transition-colors hover:text-[#004B9B] dark:text-zinc-400 dark:hover:text-[#93BDE4]"
              >
                Pular
              </button>
              <button
                type="button"
                onClick={next}
                className="flex min-h-[34px] items-center gap-1 rounded-[10px] bg-[#004B9B] px-4 py-1.5 text-[12px] font-bold text-white shadow-[0_2px_12px_rgba(0,75,155,0.35)] transition-all hover:bg-[#003d82]"
              >
                Começar <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>,
      document.body,
    )
  }

  // Targeted step — requires targetRect
  if (!targetRect) return null

  return createPortal(
    <AnimatePresence>
      <motion.div
        /*
         * `pointer-events-none` no root garante tour NÃO BLOQUEANTE — o usuário
         * continua interagindo fora da spotlight. O balão restaura
         * `pointer-events: auto` localmente para receber cliques dos botões.
         */
        className="fixed inset-0 z-[60] pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* 1. SVG overlay with spotlight cutout */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <mask id="tour-mask">
              <rect fill="white" width="100%" height="100%" />
              <rect
                fill="black"
                rx="12"
                x={Math.max(0, targetRect.x - 8)}
                y={Math.max(0, targetRect.y - 8)}
                width={targetRect.width + 16}
                height={targetRect.height + 16}
              />
            </mask>
          </defs>
          <rect fill="rgba(15,23,42,0.40)" mask="url(#tour-mask)" width="100%" height="100%" />
        </svg>

        {/* 2. Spotlight ring around target (clipped to viewport) */}
        <motion.div
          className="absolute rounded-xl ring-2 ring-[#F6921E]/50 pointer-events-none"
          style={{
            left: targetRect.x - 8,
            top: targetRect.y - 8,
            width: targetRect.width + 16,
            height: targetRect.height + 16,
          }}
          layout
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />

        {/* 3. Balloon tooltip — always within viewport */}
        <TourBalloon
          step={currentStep}
          targetRect={targetRect}
          stepIndex={currentStepIndex}
          totalSteps={totalSteps}
          onNext={next}
          onBack={back}
          onSkip={skip}
        />
      </motion.div>
    </AnimatePresence>,
    document.body,
  )
}
