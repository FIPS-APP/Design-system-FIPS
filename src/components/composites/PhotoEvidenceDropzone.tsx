import { useCallback, useState, type DragEvent } from 'react'
import { Eye, ImagePlus, Loader2, Trash2 } from 'lucide-react'
import { cn } from '../../lib/cn'
import { Alert } from './Alert'
import { Lightbox } from './Lightbox'

const DEFAULT_ACCEPT = 'image/jpeg,image/png,image/webp,image/heic'

export type PhotoEvidenceDropzoneProps = {
  urls: readonly string[]
  onAddFiles: (files: FileList) => void
  onRemove: (url: string) => void
  /** Se omitido, abre Lightbox interno (paridade Registro OPA). */
  onViewPhoto?: (url: string, index: number) => void
  uploading?: boolean
  error?: string
  accept?: string
  className?: string
  /** Paridade OPA: `Foto do OPA` */
  photoAlt?: string
}

/** Dropzone + grid de thumbnails + tile Adicionar (seção Fotos / Evidências). */
export function PhotoEvidenceDropzone({
  urls,
  onAddFiles,
  onRemove,
  onViewPhoto,
  uploading = false,
  error,
  accept = DEFAULT_ACCEPT,
  className,
  photoAlt = 'Foto do OPA',
}: PhotoEvidenceDropzoneProps) {
  const [dragOver, setDragOver] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const onDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      if (uploading) return
      if (e.dataTransfer.files?.length) onAddFiles(e.dataTransfer.files)
    },
    [onAddFiles, uploading],
  )

  const openPhoto = (url: string, index: number) => {
    if (onViewPhoto) onViewPhoto(url, index)
    else setLightboxIndex(index)
  }

  return (
    <div className={cn(className)}>
      {urls.length === 0 ? (
        <label
          onDragOver={(e) => {
            e.preventDefault()
            if (!uploading) setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className="group relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-5 text-center transition-all"
          style={{
            borderColor: dragOver || uploading ? 'var(--color-primary)' : 'var(--color-border-strong, #CBD5E1)',
            background: dragOver
              ? 'color-mix(in srgb, var(--color-primary) 7%, var(--color-surface))'
              : 'var(--color-surface)',
          }}
        >
          <input
            type="file"
            accept={accept}
            multiple
            disabled={uploading}
            onChange={(e) => {
              if (e.target.files?.length) onAddFiles(e.target.files)
              e.target.value = ''
            }}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
          {uploading ? (
            <span className="flex items-center gap-2.5">
              <Loader2 className="h-6 w-6 animate-spin text-[var(--color-primary)]" aria-hidden />
              <span className="text-[13px] font-semibold text-[var(--color-primary)]">Enviando fotos…</span>
            </span>
          ) : (
            <>
              <span className="flex items-center gap-2.5 text-left">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105"
                  style={{
                    background: 'color-mix(in srgb, var(--color-primary) 12%, transparent)',
                    color: 'var(--color-primary)',
                  }}
                >
                  <ImagePlus className="h-5 w-5" strokeWidth={1.8} aria-hidden />
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="text-[13px] font-semibold text-[var(--color-fg)]">
                    Arraste as fotos aqui ou{' '}
                    <span className="text-[var(--color-primary)] underline decoration-dotted underline-offset-2">
                      clique para enviar
                    </span>
                  </span>
                  <span className="text-[11px] text-[var(--color-fg-muted)]">
                    JPG, PNG, WebP ou HEIC · até 10 MB cada
                  </span>
                </span>
              </span>
            </>
          )}
        </label>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            if (!uploading) setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className="grid grid-cols-2 gap-2 rounded-xl transition-all sm:grid-cols-3 md:grid-cols-4"
          style={{
            outline: dragOver ? '2px dashed var(--color-primary)' : '2px dashed transparent',
            outlineOffset: 4,
          }}
        >
          {urls.map((url, i) => (
            <div
              key={url}
              className="group relative overflow-hidden rounded-lg"
              style={{
                aspectRatio: '1 / 1',
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface-muted)',
              }}
            >
              <img
                src={url}
                alt={photoAlt}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                loading="lazy"
              />
              <button
                type="button"
                onClick={() => openPhoto(url, i)}
                title="Ver a foto ampliada"
                className="absolute right-9 top-1 inline-flex items-center justify-center rounded-md opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                style={{
                  width: 26,
                  height: 26,
                  background: 'rgba(0,0,0,0.65)',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <Eye className="h-3.5 w-3.5" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => onRemove(url)}
                title="Remover foto"
                className="absolute right-1 top-1 inline-flex items-center justify-center rounded-md opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                style={{
                  width: 26,
                  height: 26,
                  background: 'rgba(0,0,0,0.65)',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden />
              </button>
            </div>
          ))}

          <label
            className="group relative flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed transition-all hover:border-[var(--color-primary)]"
            style={{
              aspectRatio: '1 / 1',
              borderColor: uploading ? 'var(--color-primary)' : 'var(--color-border-strong, #CBD5E1)',
              background: 'var(--color-surface)',
            }}
          >
            <input
              type="file"
              accept={accept}
              multiple
              disabled={uploading}
              onChange={(e) => {
                if (e.target.files?.length) onAddFiles(e.target.files)
                e.target.value = ''
              }}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
            {uploading ? (
              <Loader2 className="h-5 w-5 animate-spin text-[var(--color-primary)]" aria-hidden />
            ) : (
              <>
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-lg transition-transform group-hover:scale-105"
                  style={{
                    background: 'color-mix(in srgb, var(--color-primary) 12%, transparent)',
                    color: 'var(--color-primary)',
                  }}
                >
                  <ImagePlus className="h-[18px] w-[18px]" strokeWidth={1.9} aria-hidden />
                </span>
                <span className="text-[10px] font-semibold text-[var(--color-fg-muted)] transition-colors group-hover:text-[var(--color-primary)]">
                  Adicionar
                </span>
              </>
            )}
          </label>
        </div>
      )}

      {error ? (
        <Alert tone="danger" size="xs" className="mt-2">
          {error}
        </Alert>
      ) : null}

      {urls.length > 0 ? (
        <p className="ml-[7px] mt-2 text-[10.5px] text-[var(--color-fg-muted)]">
          {urls.length} {urls.length === 1 ? 'foto adicionada' : 'fotos adicionadas'}
        </p>
      ) : null}

      {onViewPhoto ? null : (
        <Lightbox
          images={[...urls]}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={setLightboxIndex}
          alt={photoAlt}
        />
      )}
    </div>
  )
}
