import { useState, useEffect, useCallback, useRef } from 'react'

export interface TourStep {
  id: string
  /** CSS `[data-tour-step]` value to spotlight, or `null` for a centered welcome step. */
  target: string | null
  title: string
  content: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
  /**
   * Target vive no sidebar. Em viewports estreitas (< lg) o sidebar fica
   * `translate-x-full` fora da tela; o layout abre o drawer antes de medir
   * para o spotlight ter um alvo visível. Ver DocLayout.
   */
  requiresSidebar?: boolean
}

export interface UseTourOptions {
  steps: TourStep[]
  /** localStorage key — when its value is `'completed'`, the tour won't auto-start. */
  storageKey: string
  enabled?: boolean
}

export interface UseTourReturn {
  isActive: boolean
  currentStepIndex: number
  currentStep: TourStep | null
  targetRect: DOMRect | null
  totalSteps: number
  next: () => void
  back: () => void
  skip: () => void
  start: () => void
}

/**
 * Headless guided-tour controller. Auto-starts on first visit (when
 * `localStorage[storageKey] !== 'completed'`), measures the spotlighted
 * element via `[data-tour-step="<target>"]`, and persists completion so the
 * tour only shows once. Call `start()` to replay it on demand.
 *
 * Ported from the Suprimentos app to keep the FIPS onboarding pattern aligned.
 */
export function useTour({ steps, storageKey, enabled = true }: UseTourOptions): UseTourReturn {
  const [isActive, setIsActive] = useState(false)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null)
  const rafRef = useRef<number | null>(null)

  const currentStep = isActive ? (steps[currentStepIndex] ?? null) : null

  const complete = useCallback(() => {
    localStorage.setItem(storageKey, 'completed')
    setIsActive(false)
  }, [storageKey])

  const next = useCallback(() => {
    setCurrentStepIndex((prev) => {
      if (prev >= steps.length - 1) {
        complete()
        return prev
      }
      return prev + 1
    })
  }, [steps.length, complete])

  const back = useCallback(() => {
    setCurrentStepIndex((prev) => Math.max(0, prev - 1))
  }, [])

  const skip = useCallback(() => {
    complete()
  }, [complete])

  const start = useCallback(() => {
    setCurrentStepIndex(0)
    setIsActive(true)
  }, [])

  // Auto-start on first visit
  useEffect(() => {
    if (!enabled) return
    if (steps.length === 0) return

    const stored = localStorage.getItem(storageKey)
    if (stored === 'completed') return

    const timer = setTimeout(() => {
      setCurrentStepIndex(0)
      setIsActive(true)
    }, 600)

    return () => clearTimeout(timer)
  }, [storageKey, enabled, steps.length])

  // Positioning: scroll to target and measure its rect.
  // Não resetamos targetRect de forma síncrona aqui — o GuidedTour já não
  // renderiza spotlight quando inativo ou em passo sem target, e o próximo
  // passo com target remede. Evita setState síncrono no corpo do effect.
  useEffect(() => {
    if (!isActive) return

    const step = steps[currentStepIndex]
    if (!step) return
    if (step.target === null) return

    const element = document.querySelector<HTMLElement>(`[data-tour-step="${step.target}"]`)

    if (!element) {
      // Element not found — auto-skip to next step
      const timer = setTimeout(() => {
        next()
      }, 0)
      return () => clearTimeout(timer)
    }

    const scrollContainer = document.querySelector<HTMLElement>('main')

    if (scrollContainer) {
      const containerRect = scrollContainer.getBoundingClientRect()
      const elementRect = element.getBoundingClientRect()
      const offsetTop =
        elementRect.top -
        containerRect.top +
        scrollContainer.scrollTop -
        containerRect.height / 2 +
        elementRect.height / 2

      scrollContainer.scrollTo({ top: Math.max(0, offsetTop), behavior: 'smooth' })
    }

    // Wait for scroll to settle, then measure
    const timer = setTimeout(() => {
      setTargetRect(element.getBoundingClientRect())
    }, 350)

    return () => clearTimeout(timer)
  }, [currentStepIndex, isActive, steps, next])

  // Recalculate targetRect on scroll/resize
  useEffect(() => {
    if (!isActive) return

    const step = steps[currentStepIndex]
    if (!step || step.target === null) return

    const recalculate = () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }
      rafRef.current = requestAnimationFrame(() => {
        const element = document.querySelector<HTMLElement>(`[data-tour-step="${step.target}"]`)
        if (element) {
          setTargetRect(element.getBoundingClientRect())
        }
        rafRef.current = null
      })
    }

    const scrollContainer = document.querySelector<HTMLElement>('main')

    scrollContainer?.addEventListener('scroll', recalculate)
    window.addEventListener('resize', recalculate)

    return () => {
      scrollContainer?.removeEventListener('scroll', recalculate)
      window.removeEventListener('resize', recalculate)
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [isActive, currentStepIndex, steps])

  // Keyboard navigation
  useEffect(() => {
    if (!isActive) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          skip()
          break
        case 'ArrowRight':
          next()
          break
        case 'ArrowLeft':
          back()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isActive, next, back, skip])

  return {
    isActive,
    currentStepIndex,
    currentStep,
    targetRect,
    totalSteps: steps.length,
    next,
    back,
    skip,
    start,
  }
}
