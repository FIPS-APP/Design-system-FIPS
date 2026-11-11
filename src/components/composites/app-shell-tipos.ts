import type { CSSProperties, ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

/** Props que a casca entrega a quem desenha um link. O app liga ao roteador dele (`<Link to={href} …>`). */
export interface LinkDaCasca {
  href: string
  className: string
  style?: CSSProperties
  children: ReactNode
  title?: string
  'aria-label'?: string
  'aria-current'?: 'page'
  /** Sempre passe adiante: a gaveta do celular fecha por aqui. */
  onClick?: () => void
}

/**
 * Desenha um link da casca (item do menu, aba do cabeçalho, marca). Sem ele a casca usa `<a href>` e a
 * página recarrega. Com roteador: `renderLink={(p) => <Link to={p.href} className={p.className} …>}`.
 */
export type RenderizarLinkDaCasca = (props: LinkDaCasca) => ReactNode

/** Marca App FIPS. Os três arquivos ficam na pasta pública do app (o DS não empacota imagem). */
export interface MarcaDoApp {
  /** Lockup branco (menu lateral aberto e cabeçalho escuro). Padrão `/appfips-logo.png`. */
  logo?: string
  /** Lockup azul (cabeçalho claro, abaixo de 1024px). Padrão `/appfips-logo-full.png`. */
  logoNoClaro?: string
  /** Só o símbolo, para o menu recolhido. Padrão `/appfips-mark-collapsed.png`. */
  simbolo?: string
  /** Texto alternativo do lockup do menu. Padrão `App FIPS`. */
  alt?: string
}

export const MARCA_PADRAO = {
  logo: '/appfips-logo.png',
  logoNoClaro: '/appfips-logo-full.png',
  simbolo: '/appfips-mark-collapsed.png',
  alt: 'App FIPS',
} as const satisfies Required<MarcaDoApp>

/** Item do menu lateral. */
export interface ItemDoMenu {
  /** Único no menu. */
  id: string
  rotulo: string
  href: string
  icone: LucideIcon
  /** Item da tela atual: azulejo âmbar e `aria-current="page"`. */
  ativo?: boolean
  /** Selo à direita (contador ou texto curto). No menu recolhido vira um ponto no canto do azulejo. `0` e vazio não aparecem. */
  selo?: number | string
}

/** Grupo do menu. Sem `titulo` o grupo abre sem rótulo (o primeiro costuma ser assim); recolhido vira um traço. */
export interface GrupoDoMenu {
  id: string
  titulo?: string
  itens: ItemDoMenu[]
}

/** Passo do tutorial. Sem `alvo` o cartão abre centralizado, sem destaque. */
export interface PassoDoTutorial {
  titulo: string
  /** Aceita quebra de linha (`\n`). */
  descricao: string
  /** Seletor CSS do elemento a destacar. Passo cujo alvo não está na janela sai da lista sozinho. */
  alvo?: string
}

/** Passo da trilha do cabeçalho. O último é a tela atual. */
export interface PassoDaTrilha {
  label: string
  href?: string
}
