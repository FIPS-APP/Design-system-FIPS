import { cn } from '../../lib/cn'

export type AppFipsHeaderLogoProps = {
  className?: string
  theme?: 'light' | 'dark'
}

/**
 * Marca App FIPS no header (< lg), paridade Gestão OPA:
 * claro → assinatura azul `appfips-logo-full`; escuro → lockup branco `appfips-logo`.
 */
export function AppFipsHeaderLogo({ className, theme = 'light' }: AppFipsHeaderLogoProps) {
  const isDark = theme === 'dark'

  return (
    <img
      src={isDark ? '/appfips-logo.png' : '/appfips-logo-full.png'}
      alt="App FIPS"
      className={cn('h-10 w-auto shrink-0 object-contain', className)}
    />
  )
}
