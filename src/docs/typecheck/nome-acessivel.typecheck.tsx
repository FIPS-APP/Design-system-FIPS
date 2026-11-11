/**
 * Conferência de tipo do nome acessível de Progress, Button só-ícone e InputGroupButton,
 * rodada pelo `tsc` (sem execução). Cada `@ts-expect-error` falha o `tsc` se a regra afrouxar.
 */
import { Button } from '../../components/ui/button'
import { InputGroupButton } from '../../components/ui/input-group'
import { Progress } from '../../components/ui/progress'

export const progressoComRotulo = <Progress value={40} aria-label="Preenchimento" />
export const progressoComLigacao = <Progress value={40} aria-labelledby="titulo-progresso" />
// @ts-expect-error sem nome nenhum o Progress não compila
export const progressoSemNome = <Progress value={40} />

export const iconeComRotulo = <Button size="icon" aria-label="Fechar" />
export const iconeSmComLigacao = <Button size="iconSm" aria-labelledby="titulo-fechar" />
export const iconeAsChild = <Button size="icon" asChild><a href="/" aria-label="Início" /></Button>
export const textoSemNome = <Button>Salvar</Button>
// @ts-expect-error Button size="icon" sem nome não compila
export const iconeSemNome = <Button size="icon" />
// @ts-expect-error Button size="iconSm" sem nome não compila
export const iconeSmSemNome = <Button size="iconSm" />

export const grupoComRotulo = <InputGroupButton size="icon-xs" aria-label="Limpar" />
export const grupoSmComLigacao = <InputGroupButton size="icon-sm" aria-labelledby="titulo-limpar" />
export const grupoTexto = <InputGroupButton>Buscar</InputGroupButton>
// @ts-expect-error InputGroupButton icon-xs sem nome não compila
export const grupoSemNome = <InputGroupButton size="icon-xs" />
// @ts-expect-error InputGroupButton icon-sm sem nome não compila
export const grupoSmSemNome = <InputGroupButton size="icon-sm" />
