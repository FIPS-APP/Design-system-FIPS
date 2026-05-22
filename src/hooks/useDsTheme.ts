import { useEffect, useState } from 'react'

/** Tema do DS — lê a classe `.dark` no `<html>` (mesmo padrão do app Suprimentos). */
export function useDsTheme() {
  const [dark, setDark] = useState(() =>
    typeof document !== 'undefined'
      ? document.documentElement.classList.contains('dark')
      : false,
  )

  useEffect(() => {
    const root = document.documentElement
    const observer = new MutationObserver(() => {
      setDark(root.classList.contains('dark'))
    })
    observer.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  return { dark }
}
