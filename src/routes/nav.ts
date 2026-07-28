import type { LucideIcon } from 'lucide-react'
import {
  Gauge,
  AppWindow,
  Blocks,
  BookOpen,
  Component,
  FormInput,
  Home,
  Layers3,
  LayoutDashboard,
  LayoutTemplate,
  LogIn,
  MousePointer2,
  Palette,
  PanelLeft,
  PanelTop,
  Settings,
  Ruler,
  ScanText,
  SearchCheck,
  Sparkles,
  SwatchBook,
  ShieldCheck,
  TableProperties,
  Type,
  MonitorSmartphone,
  Cpu,
  CircleDot,
} from 'lucide-react'

export type NavItem = {
  label: string
  to: string
  icon?: LucideIcon
}

export type NavGroup = {
  id: string
  label: string
  icon?: LucideIcon
  collapsible?: boolean
  items: NavItem[]
}

export const navGroups: NavGroup[] = [
  {
    id: 'start',
    label: 'Início',
    icon: Home,
    collapsible: false,
    items: [
      { label: 'Home', to: '/docs/home', icon: Home },
      { label: 'Stacks', to: '/docs/stacks', icon: Cpu },
      { label: 'Visão geral', to: '/docs', icon: Sparkles },
      { label: 'Governança', to: '/docs/governance', icon: ShieldCheck },
      { label: 'Histórico de versões', to: '/docs/changelog', icon: BookOpen },
    ],
  },
  {
    id: 'patterns',
    label: 'Padrões',
    icon: LayoutDashboard,
    items: [
      { label: 'Login', to: '/docs/login', icon: LogIn },
      { label: 'Application Shell', to: '/docs/patterns/application-shell', icon: PanelLeft },
      { label: 'Dashboard', to: '/docs/patterns/dashboard', icon: LayoutDashboard },
      { label: 'Data Listing', to: '/docs/patterns/data-listing', icon: TableProperties },
      { label: 'Form Workspace', to: '/docs/patterns/form-workspace', icon: FormInput },
      { label: 'Hero', to: '/docs/patterns/hero', icon: MonitorSmartphone },
      { label: 'Banner', to: '/docs/patterns/hero-banner', icon: PanelTop },
      { label: 'Configurações', to: '/docs/patterns/configuracoes', icon: Settings },
    ],
  },
  {
    id: 'foundations',
    label: 'Fundamentos',
    icon: Palette,
    items: [
      { label: 'Cores', to: '/docs/foundations/colors', icon: Palette },
      { label: 'Tipografia', to: '/docs/foundations/typography', icon: Type },
      { label: 'Espaçamento', to: '/docs/foundations/spacing', icon: Ruler },
      { label: 'Raios', to: '/docs/foundations/radius', icon: SwatchBook },
      { label: 'Sombras', to: '/docs/foundations/shadows', icon: Layers3 },
      { label: 'Iconografia', to: '/docs/foundations/icons', icon: MousePointer2 },
    ],
  },
  {
    id: 'components',
    label: 'Componentes',
    icon: Component,
    items: [
      { label: 'Button', to: '/docs/components/button', icon: Component },
      { label: 'Field', to: '/docs/components/field', icon: FormInput },
      { label: 'Input', to: '/docs/components/input', icon: FormInput },
      { label: 'Progress', to: '/docs/components/progress', icon: Gauge },
      { label: 'Select', to: '/docs/components/select', icon: SearchCheck },
      { label: 'Textarea', to: '/docs/components/textarea', icon: AppWindow },
      { label: 'Badge', to: '/docs/components/badge', icon: Blocks },
      { label: 'Card', to: '/docs/components/card', icon: LayoutTemplate },
      { label: 'Tabs', to: '/docs/components/tabs', icon: BookOpen },
      { label: 'Switch', to: '/docs/components/switch', icon: MousePointer2 },
      { label: 'Table', to: '/docs/components/table', icon: TableProperties },
      { label: 'Modal (legado)', to: '/docs/components/dialog', icon: ScanText },
      { label: 'Modal Radix', to: '/docs/components/modal-radix', icon: ScanText },
      { label: 'Drawer', to: '/docs/components/drawer', icon: PanelLeft },
      { label: 'Header', to: '/docs/components/header', icon: PanelTop },
      { label: 'Sidebar', to: '/docs/components/sidebar', icon: PanelLeft },
      { label: 'Toast', to: '/docs/components/toast', icon: Sparkles },
      { label: 'Tooltip', to: '/docs/components/tooltip', icon: MousePointer2 },
      { label: 'Circular Menu', to: '/docs/components/circular-command-menu', icon: CircleDot },
    ],
  },
]

export const bottomNavItems: NavItem[] = []
