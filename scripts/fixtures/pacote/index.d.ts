// Pacote mínimo para os testes do `fips-ds check` e do `gerar-ai` (não é o pacote real).
export interface ButtonProps {
  variant?: 'primary' | 'secondary'
  className?: string
  children?: unknown
}
export declare function Button(props: ButtonProps): unknown
export interface InputProps {
  className?: string
}
export declare function Input(props: InputProps): unknown
export declare function PageHeader(props: { titulo: string }): unknown
export declare function PageHero(props: { title: string; children?: unknown }): unknown
export declare function cn(...classes: string[]): string
export declare const marca: { nome: string }
export type Tom = 'claro' | 'escuro'
