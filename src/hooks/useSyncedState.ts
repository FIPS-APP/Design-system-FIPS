import { useState, type Dispatch, type SetStateAction } from 'react'

/**
 * Estado local que acompanha uma prop opcional: quando `prop` muda para um valor
 * definido, o estado passa a ele; sem prop, o estado é livre.
 *
 * A atualização acontece durante a renderização ("ajustar o estado quando a prop
 * muda"), sem useEffect e sem uma renderização intermediária com o valor velho.
 */
export function useSyncedState<T>(prop: T | undefined, inicial: T): [T, Dispatch<SetStateAction<T>>] {
  const [valor, setValor] = useState<T>(prop ?? inicial)
  const [propAnterior, setPropAnterior] = useState(prop)
  if (prop !== propAnterior) {
    setPropAnterior(prop)
    if (prop !== undefined) setValor(prop)
  }
  return [valor, setValor]
}
