import { useState } from 'react'

/**
 * Roda `reset` durante a renderização quando alguma das `deps` muda, e também na
 * primeira renderização. Troca o `useEffect` que só chama `setState` ao abrir um
 * modal ou trocar uma prop ("ajustar o estado quando a prop muda"): não há
 * renderização intermediária com o valor velho. `reset` deve só chamar `setState`
 * do próprio componente.
 */
export function useResetOnChange(deps: readonly unknown[], reset: () => void): void {
  const [anteriores, setAnteriores] = useState<readonly unknown[] | null>(null)
  const mudou =
    anteriores === null ||
    anteriores.length !== deps.length ||
    deps.some((d, i) => !Object.is(d, anteriores[i]))
  if (mudou) {
    setAnteriores(deps)
    reset()
  }
}
