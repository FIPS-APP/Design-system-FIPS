import type { TourStep } from '../hooks/useTour'

/** localStorage key — bump the version to re-show the tour to everyone. */
export const DS_TOUR_STORAGE_KEY = 'fips_ds_tour_v1'

/**
 * Tour de primeiro acesso do site de documentação do DS-FIPS.
 * Cada `target` casa com um `[data-tour-step]` renderizado no DocLayout/sidebar.
 * Passos cujo elemento não existir na tela são pulados automaticamente (ver useTour).
 */
export const DS_TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    target: null,
    title: 'Bem-vindo ao Design System FIPS',
    content:
      'Este é o portal vivo do DS — tokens, componentes e padrões oficiais da FIPS. Em 4 passos rápidos eu te mostro como navegar e configurar a experiência.',
  },
  {
    id: 'nav-lateral',
    target: 'nav-lateral',
    title: 'Navegação',
    content:
      'Fundamentos, Componentes e Padrões ficam no menu lateral. Cada grupo expande nos seus itens — é por aqui que você explora todo o sistema.',
    placement: 'right',
    requiresSidebar: true,
  },
  {
    id: 'menu-auto',
    target: 'menu-auto',
    title: 'Comportamento do menu',
    content:
      'Aqui você configura se o menu lateral recolhe sozinho e em quanto tempo — alterne entre Manual e Automático quando quiser.',
    placement: 'right',
    requiresSidebar: true,
  },
]
