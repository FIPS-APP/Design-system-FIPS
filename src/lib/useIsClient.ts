import { useSyncExternalStore } from 'react'

const semAssinatura = () => () => {}

/**
 * `false` no servidor e na hidratação, `true` no cliente.
 * Substitui o par `useState(false)` + `useEffect(() => setMounted(true), [])`.
 */
export function useIsClient(): boolean {
  return useSyncExternalStore(semAssinatura, () => true, () => false)
}
