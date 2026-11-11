import { cva, type VariantProps } from 'class-variance-authority'

/**
 * Fundo das faixas do documento de impressão. A escada vai do mais escuro (seção) ao mais claro
 * (categoria), e cada degrau tem um trabalho: a hierarquia do papel se lê pela cor.
 *
 * - `secao`: azul-noite, abre o nível de cima.
 * - `categoria`: azul, o nível de dentro.
 * - `neutra`: cinza, secção ou categoria ainda indisponível (por transcrever).
 * Todas levam texto branco com 4,5:1 ou mais, nos dois temas. O branco da `categoria` está em cada filho
 * (título, contagem, "feitos/total"), não no contêiner, como na Manutenção; a `secao` mantém o dela.
 */
export const faixaDocumento = cva('flex flex-wrap items-center gap-x-3 gap-y-1', {
  variants: {
    nivel: {
      secao: 'px-[14px] py-[8px] text-white',
      categoria: 'px-[14px] py-[7px]',
    },
    tom: {
      normal: '',
      indisponivel: 'bg-[var(--documento-faixa-neutra)]',
    },
  },
  compoundVariants: [
    { nivel: 'secao', tom: 'normal', class: 'bg-[var(--color-primary-hover)]' },
    { nivel: 'categoria', tom: 'normal', class: 'bg-[var(--color-primary)]' },
  ],
  defaultVariants: { nivel: 'secao', tom: 'normal' },
})

export type FaixaDocumentoVariantes = VariantProps<typeof faixaDocumento>
