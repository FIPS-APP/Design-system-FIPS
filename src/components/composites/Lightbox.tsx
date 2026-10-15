import { useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

export interface LightboxProps {
  images: string[]
  index: number | null
  onClose: () => void
  onIndexChange?: (newIndex: number) => void
  alt?: string
}

/** Lightbox de imagens — paridade Gestão OPA / DS-FIPS. */
export function Lightbox({
  images,
  index,
  onClose,
  onIndexChange,
  alt = 'Foto',
}: LightboxProps) {
  const isOpen = index !== null && index >= 0 && index < images.length
  const total = images.length
  const current = isOpen ? images[index!] : null

  const goPrev = useCallback(() => {
    if (index === null || total === 0) return
    onIndexChange?.((index - 1 + total) % total)
  }, [index, total, onIndexChange])

  const goNext = useCallback(() => {
    if (index === null || total === 0) return
    onIndexChange?.((index + 1) % total)
  }, [index, total, onIndexChange])

  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') goPrev()
      else if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', handler)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = prevOverflow
    }
  }, [isOpen, onClose, goPrev, goNext])

  if (!isOpen || !current) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Visualizador de fotos"
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar"
        className="absolute right-4 top-4 inline-flex items-center justify-center rounded-full transition-colors hover:bg-white/15"
        style={{
          width: 40,
          height: 40,
          background: 'rgba(0,0,0,0.40)',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.20)',
          cursor: 'pointer',
        }}
      >
        <X className="h-5 w-5" aria-hidden />
      </button>

      {total > 1 ? (
        <span
          className="absolute left-1/2 top-4 -translate-x-1/2 font-mono text-[12px] font-bold text-white"
          style={{
            padding: '4px 10px',
            background: 'rgba(0,0,0,0.40)',
            borderRadius: 999,
            border: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          {index! + 1} / {total}
        </span>
      ) : null}

      {total > 1 && onIndexChange ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            goPrev()
          }}
          aria-label="Anterior"
          className="absolute left-4 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-full transition-colors hover:bg-white/15"
          style={{
            width: 44,
            height: 44,
            background: 'rgba(0,0,0,0.40)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.20)',
            cursor: 'pointer',
          }}
        >
          <ChevronLeft className="h-6 w-6" aria-hidden />
        </button>
      ) : null}

      {total > 1 && onIndexChange ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            goNext()
          }}
          aria-label="Próxima"
          className="absolute right-4 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-full transition-colors hover:bg-white/15"
          style={{
            width: 44,
            height: 44,
            background: 'rgba(0,0,0,0.40)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.20)',
            cursor: 'pointer',
          }}
        >
          <ChevronRight className="h-6 w-6" aria-hidden />
        </button>
      ) : null}

      <img
        src={current}
        alt={alt}
        className="max-h-[90vh] max-w-[90vw] object-contain"
        style={{ borderRadius: 6, boxShadow: '0 8px 40px rgba(0,0,0,0.50)' }}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  )
}
