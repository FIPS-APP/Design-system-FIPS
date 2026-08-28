import * as React from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { cn } from '../../lib/cn'
import { getInitials, photoUrl } from '../../lib/foto'

/**
 * Avatar DS-FIPS — foto com fallback automático pras iniciais (o Radix troca
 * sozinho enquanto carrega e se a URL quebrar; era o que a gente vinha
 * re-implementando à mão em cada tela).
 *
 * As primitivas ficam expostas pra casos fora do padrão; no dia a dia use
 * `<PessoaAvatar nome foto />`, que já aplica iniciais + `photoUrl` (a URL do
 * Bubble vem protocol-relative e não carrega num `<img>` sem esquema).
 *
 * Uma parte do original do QLP ficou de fora: lá o avatar com foto é clicável e
 * abre a imagem ampliada com botão de baixar. Isso depende de um proxy
 * `/api/foto/download` no servidor — o CDN do Bubble não manda CORS —, que é
 * responsabilidade de cada app, não do design system.
 */
const Avatar = React.forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn('relative flex h-9 w-9 shrink-0 overflow-hidden rounded-full', className)}
    {...props}
  />
))
Avatar.displayName = 'Avatar'

const AvatarImage = React.forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image ref={ref} className={cn('aspect-square h-full w-full object-cover', className)} {...props} />
))
AvatarImage.displayName = 'AvatarImage'

const AvatarFallback = React.forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, style, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn('flex h-full w-full items-center justify-center rounded-full text-[11px] font-bold', className)}
    style={{ background: 'color-mix(in srgb, var(--color-primary) 12%, transparent)', color: 'var(--color-primary)', ...style }}
    {...props}
  />
))
AvatarFallback.displayName = 'AvatarFallback'

/**
 * Avatar de uma pessoa do QLP: foto do Bubble + iniciais como fallback.
 * Com foto, é clicável — abre a foto ampliada com opção de baixar. Sem foto
 * (só iniciais) fica como antes, não clicável — não tem o que ampliar/baixar.
 */
export function PessoaAvatar({
  nome,
  foto,
  className,
  fallbackClassName,
}: {
  nome?: string | null
  foto?: string | null
  className?: string
  /** Sobrescreve o visual do círculo de iniciais — necessário em fundo escuro
   *  (o default azul-sobre-azul some num painel navy, ex.: Aniversariantes). */
  fallbackClassName?: string
}) {
  const src = photoUrl(foto)

  return (
    <Avatar className={className}>
      {/* no-referrer: o CDN do Bubble recusa a imagem quando recebe o Referer. */}
      {src ? <AvatarImage src={src} alt={nome || ''} referrerPolicy="no-referrer" /> : null}
      {/* Com fallbackClassName, anula o bg/cor inline do Fallback (inline vence
          classe) pra deixar as classes passadas mandarem. */}
      <AvatarFallback
        delayMs={0}
        className={fallbackClassName}
        style={fallbackClassName ? { background: undefined, color: undefined } : undefined}
      >
        {getInitials(nome ?? '')}
      </AvatarFallback>
    </Avatar>
  )
}

/* As primitivas ficam expostas pra casos fora do padrão do `PessoaAvatar`. */
export { Avatar, AvatarImage, AvatarFallback }
