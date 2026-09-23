import { cn } from '../../lib/cn'

export type AppFipsHeaderLogoProps = {
  className?: string
  theme?: 'light' | 'dark'
}

/** Marca App FIPS no header de app (Gestão OPA): PNG light/dark, altura h-10. */
export function AppFipsHeaderLogo({ className, theme = 'light' }: AppFipsHeaderLogoProps) {
  const isDark = theme === 'dark'

  return (
    <img
      src={isDark ? '/brand/appfips-logo-dark.png' : '/brand/appfips-logo-light.png'}
      alt="App FIPS"
      className={cn('h-10 w-auto shrink-0 object-contain', className)}
    />
  )
}
