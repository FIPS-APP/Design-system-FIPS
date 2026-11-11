import './styles/globals.css'

export * from './tokens'
export { cn } from './lib/cn'
export { useFipsTheme, type UseFipsThemeResult } from './hooks/useFipsTheme'
export * from './components/ui'
export { FipsLogo } from './components/brand/FipsLogo'
export { BrandLoader } from './components/brand/BrandLoader'
export type { BrandLoaderProps, BrandLoaderSize } from './components/brand/BrandLoader'
export { PageHero, PAGE_HERO_DEFAULT_DECORATION, type PageHeroProps } from './composites'
export {
  PageHeader,
  type PageHeaderActionsProps,
  type PageHeaderProps,
  type PageHeaderStat,
} from './components/composites/PageHeader'
export {
  PatternPanelHero,
  type PatternPanelHeroProps,
  type PatternPanelHeroStat,
} from './components/composites/PatternPanelHero'
export { FipsTabBar, type FipsTabBarProps, type FipsTabItem } from './components/composites/FipsTabBar'
export {
  BuscarPessoaModal,
  type BuscarPessoaModalProps,
  type Pessoa,
} from './components/composites/BuscarPessoaModal'
export {
  BannerJunctionLines,
  BannerIconBox,
  FIPS_BANNER_CONTENT_CLASS,
  FIPS_BANNER_ICON_BOX_STYLE,
  FIPS_BANNER_PAGE_CLASS,
  FIPS_BANNER_PILL_STYLE,
} from './components/composites/banner-shared'
export {
  StatsCard,
  StatsCardGrid,
  type StatsCardProps,
  type StatsCardSize,
  type StatsCardGridProps,
} from './components/composites/StatsCard'
export {
  HowItWorksCard,
  HowItWorksGrid,
  type HowItWorksCardProps,
  type HowItWorksGridProps,
} from './components/composites/HowItWorksCard'
export {
  RuleTile,
  RuleTileGrid,
  type RuleTileProps,
  type RuleTileTone,
  type RuleTileGridProps,
} from './components/composites/RuleTile'
export {
  ExportButtons,
  type ExportButtonsProps,
} from './components/composites/ExportButtons'
export {
  ExportPreviewModal,
  resolveExportKeys,
  type ExportPreviewModalProps,
  type ExportColumn,
  type ExportLayout,
  type ExportIntent,
} from './components/composites/ExportPreviewModal'
export {
  ListingKpiRow,
  type ListingKpiCard,
  type ListingKpiRowProps,
} from './components/composites/ListingKpiRow'
export {
  CircularCommandMenu,
  type CommandItem,
  type CircularCommandMenuProps,
} from './components/composites/CircularCommandMenu'
export {
  RowActionsMenu,
  type RowMenuAction,
} from './components/composites/RowActionsMenu'
export {
  ActiveFilterChips,
  MAX_FILTER_CHIPS,
  type ActiveFilterChip,
  type ActiveFilterChipsProps,
} from './components/composites/ActiveFilterChips'
export {
  FilterDrawer,
  type FilterGroup,
  type FilterChip,
} from './components/composites/FilterDrawer'
export {
  FilterBlock,
  type FilterBlockProps,
} from './components/composites/FilterBlock'
export { PillFilter, type PillOption } from './components/composites/PillFilter'
export { PillGroup } from './components/composites/PillGroup'
export {
  ListingFilterToolbar,
  LISTING_PERIOD_PRESETS,
  type ListingFilterToolbarProps,
  type ListingPeriodPreset,
} from './components/composites/ListingFilterToolbar'
export {
  AppFipsHeaderLogo,
  type AppFipsHeaderLogoProps,
} from './components/composites/AppFipsHeaderLogo'
export {
  FormSectionCard,
  FormSectionHeader,
} from './components/composites/FormSectionCard'
export {
  ScopeSegment,
  type ScopeSegmentItem,
} from './components/composites/ScopeSegment'
export {
  LocationPinButtons,
  type LocationPinButtonsProps,
} from './components/composites/LocationPinButtons'
export {
  PhotoEvidenceDropzone,
  type PhotoEvidenceDropzoneProps,
} from './components/composites/PhotoEvidenceDropzone'
export { Alert, type AlertProps } from './components/composites/Alert'
export { Lightbox, type LightboxProps } from './components/composites/Lightbox'
export {
  HeroAtalho,
  HeroAtalhos,
  type HeroAtalhoProps,
  type HeroAtalhoAtributos,
  type HeroAtalhosProps,
} from './components/composites/HeroAtalho'
export {
  HeroFileira,
  type HeroFileiraProps,
  type HeroFileiraAtalho,
} from './components/composites/HeroFileira'
export { ExcelIcon, PdfIcon } from './components/icons/FileIcons'
export {
  AbasDeSecao,
  type AbasDeSecaoProps,
  type AbaDeSecao,
} from './components/composites/AbasDeSecao'
export { idDaAba, idPainelDeAba, propsDoPainel } from './components/composites/abasDeSecaoUtil'
export {
  TabelaExpansivel,
  type TabelaExpansivelProps,
  type TabelaExpansivelColuna,
  type TabelaExpansivelOrdenacao,
} from './components/composites/TabelaExpansivel'
export { SecaoNumerada, type SecaoNumeradaProps } from './components/composites/SecaoNumerada'
export {
  BarraAcoesRodape,
  EstadoSalvamento,
  type BarraAcoesRodapeProps,
  type BarraAcoesRodapeVariante,
  type EstadoSalvamentoProps,
  type EstadoSalvamentoValor,
} from './components/composites/BarraAcoesRodape'
export {
  SegmentoAvaliacao,
  type SegmentoAvaliacaoProps,
  type OpcaoAvaliacao,
  type TomAvaliacao,
} from './components/composites/SegmentoAvaliacao'
export { AssinaturaCanvas, type AssinaturaCanvasProps } from './components/composites/AssinaturaCanvas'
export {
  CardChecklist,
  type CardChecklistProps,
  type CardChecklistDado,
  type CardChecklistAcao,
} from './components/composites/CardChecklist'
export {
  HomeHero,
  FaixaPilares,
  SecaoHome,
  CicloDeVida,
  CartoesInformativos,
  CartoesConceito,
  CartoesResponsabilidade,
  PassosGrade,
  TabelaReferencia,
  NotasOperacionais,
  IndicadoresNumerados,
  ChamadaFinal,
  type HomeHeroProps,
  type HomeHeroSobreposicao,
  type FaixaPilaresProps,
  type PilarFaixa,
  type SecaoHomeProps,
  type CicloDeVidaProps,
  type EtapaCiclo,
  type CartoesInformativosProps,
  type CartaoInformativo,
  type CartoesConceitoProps,
  type CartaoConceito,
  type CartoesResponsabilidadeProps,
  type CartaoResponsabilidade,
  type PassosGradeProps,
  type PassoGrade,
  type TabelaReferenciaProps,
  type TabelaReferenciaColuna,
  type TabelaReferenciaLinha,
  type NotasOperacionaisProps,
  type IndicadoresNumeradosProps,
  type IndicadorNumerado,
  type ChamadaFinalProps,
  type PassoChamada,
  type TomHome,
  type NivelTituloHome,
} from './components/composites'
export {
  AppShell,
  AppHeader,
  AppSidebar,
  HeaderTile,
  HeaderTrilha,
  UserChip,
  UserAccountMenu,
  NotificacoesMenu,
  TutorialOverlay,
  type AppShellProps,
  type AppHeaderProps,
  type AcaoDoCabecalho,
  type AppSidebarProps,
  type HeaderTileProps,
  type HeaderTrilhaProps,
  type UserChipProps,
  type UserAccountMenuProps,
  type UsuarioDaConta,
  type SeloDaConta,
  type OpcaoDePerfil,
  type ItemDaConta,
  type NotificacoesMenuProps,
  type ItemDeNotificacao,
  type SecaoDeNotificacoes,
  type TomDaNotificacao,
  type TutorialOverlayProps,
  type LinkDaCasca,
  type RenderizarLinkDaCasca,
  type MarcaDoApp,
  type ItemDoMenu,
  type GrupoDoMenu,
  type PassoDoTutorial,
  type PassoDaTrilha,
} from './components/composites'
export {
  CartaoGrafico,
  GraficoBarras,
  GraficoRosca,
  GraficoLinha,
  GraficoFunil,
  MapaDeCalor,
  ProgressoPorFaixa,
  TONS_GRAFICO,
  SEQUENCIA_CATEGORICA,
  corDoTom,
  formatarNumero,
  participacao,
  textoPaginas,
  Folha,
  CabecalhoDocumento,
  FaixaSecaoDocumento,
  FaixaCategoriaDocumento,
  BlocoDeCamposDocumento,
  TabelaDocumento,
  CabecalhoTabelaDocumento,
  CelulaCabecalhoDocumento,
  CelulaDocumento,
  CorpoTabelaDocumento,
  LinhaTabelaDocumento,
  type CartaoGraficoProps,
  type GraficoBarrasProps,
  type SelecaoDeBarra,
  type DadoBarra,
  type SerieBarra,
  type GraficoRoscaProps,
  type FatiaRosca,
  type GraficoLinhaProps,
  type SelecaoDePonto,
  type SerieLinha,
  type GraficoFunilProps,
  type SelecaoDeEtapa,
  type EtapaFunil,
  type MapaDeCalorProps,
  type TomDeCalor,
  type ProgressoPorFaixaProps,
  type TomGrafico,
  type FaixaProgresso,
  type FolhaProps,
  type CabecalhoDocumentoProps,
  type MetadadoDocumento,
  type FaixaSecaoDocumentoProps,
  type FaixaCategoriaDocumentoProps,
  type ProgressoDaFaixa,
  type TomFaixaDocumento,
  type BlocoDeCamposDocumentoProps,
  type CampoDocumento,
  type ValoresDoBloco,
  type TabelaDocumentoProps,
} from './components/composites'
export {
  AvisoSomenteLeitura,
  AlternadorDeVisao,
  CartaoListagem,
  type AvisoSomenteLeituraProps,
  type AlternadorDeVisaoProps,
  type OpcaoDeVisao,
  type CartaoListagemProps,
} from './components/composites'
export { TabelaClassificacao, type TabelaClassificacaoProps, type LinhaClassificacao } from './components/composites'
