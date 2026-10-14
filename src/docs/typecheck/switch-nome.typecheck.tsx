/**
 * Conferência de tipo do nome do Switch, rodada pelo `tsc` (sem execução).
 * Cada `@ts-expect-error` falha o `tsc` se a regra afrouxar.
 */
import { Switch } from '../../components/ui/switch'

export const comRotulo = <Switch aria-label="Modo escuro" />
export const comLigacao = <Switch aria-labelledby="rotulo-modo" />
export const comId = <Switch id="modo-escuro" />
// @ts-expect-error sem nome nenhum o Switch não compila
export const semNome = <Switch />
