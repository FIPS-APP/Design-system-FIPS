import { useCallback, useSyncExternalStore } from 'react'

/** Chave do `localStorage` em que a escolha fica guardada: `'dark'` ou `'light'`. */
const STORAGE_KEY = 'fips-theme'

/** O que `useFipsTheme()` devolve. */
export interface UseFipsThemeResult {
  /** `true` quando o `<html>` tem a classe `.dark`. */
  dark: boolean
  /** Alterna entre claro e escuro e guarda a escolha. */
  toggle: () => void
  /** Força o tema (`true` é o escuro) e guarda a escolha. */
  setDark: (dark: boolean) => void
}

function root(): HTMLElement | null {
  return typeof document === 'undefined' ? null : document.documentElement
}

/**
 * Lê a escolha guardada. Nunca lança: com o armazenamento bloqueado (cookies de
 * terceiros desligados, iframe sem permissão) o simples acesso a `localStorage`
 * dispara `SecurityError`, e esta leitura roda na importação do pacote.
 */
function readStored(): 'dark' | 'light' | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored === 'dark' || stored === 'light' ? stored : null
  } catch {
    return null
  }
}

function writeStored(dark: boolean) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light')
  } catch {
    // Sem onde guardar, a escolha vale só nesta visita.
  }
}

/** O tema é o que está aplicado no `<html>`; o armazenamento só guarda a escolha. */
function isDark(): boolean {
  return root()?.classList.contains('dark') ?? false
}

const listeners = new Set<() => void>()
let observer: MutationObserver | null = null

function notify() {
  listeners.forEach((cb) => cb())
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  const html = root()
  if (!observer && html && typeof MutationObserver !== 'undefined') {
    // Quem muda a classe sem passar por aqui (outro código do app) também atualiza o hook.
    observer = new MutationObserver(notify)
    observer.observe(html, { attributes: true, attributeFilter: ['class'] })
  }
  return () => {
    listeners.delete(cb)
    if (listeners.size === 0 && observer) {
      observer.disconnect()
      observer = null
    }
  }
}

function setDark(dark: boolean) {
  // A classe vem primeiro: a tela muda mesmo quando o armazenamento falha.
  root()?.classList.toggle('dark', dark)
  writeStored(dark)
  notify()
}

// Aplica a escolha guardada na carga, antes do React pintar, para não piscar no tema errado.
if (readStored() === 'dark') root()?.classList.add('dark')

/**
 * Tema claro/escuro do DS. A classe `.dark` no `<html>` é o que os componentes leem;
 * a escolha fica no `localStorage`, na chave `fips-theme`.
 */
export function useFipsTheme(): UseFipsThemeResult {
  const dark = useSyncExternalStore(subscribe, isDark, () => false)
  const toggle = useCallback(() => setDark(!isDark()), [])
  return { dark, toggle, setDark }
}
