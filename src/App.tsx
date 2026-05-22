import { lazy, Suspense, type ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { DocLayout } from './app/DocLayout'

const HomePage = lazy(() => import('./docs/pages/HomePage'))
const StacksPage = lazy(() => import('./docs/pages/StacksPage'))
const OverviewPage = lazy(() => import('./docs/pages/Overview'))
const GovernancePage = lazy(() => import('./docs/pages/GovernancePage'))
const ChangelogPage = lazy(() => import('./docs/pages/ChangelogPage'))
const LoginPage = lazy(() => import('./docs/pages/LoginPage'))
const ColorsPage = lazy(() => import('./docs/pages/foundations/ColorsPage'))
const TypographyPage = lazy(() => import('./docs/pages/foundations/TypographyPage'))
const SpacingPage = lazy(() => import('./docs/pages/foundations/SpacingPage'))
const RadiusPage = lazy(() => import('./docs/pages/foundations/RadiusPage'))
const ShadowsPage = lazy(() => import('./docs/pages/foundations/ShadowsPage'))
const IconsPage = lazy(() => import('./docs/pages/foundations/IconsPage'))
const ButtonDoc = lazy(() => import('./docs/pages/components/ButtonDoc'))
const FieldDoc = lazy(() => import('./docs/pages/components/FieldDoc'))
const InputDoc = lazy(() => import('./docs/pages/components/InputDoc'))
const ProgressDoc = lazy(() => import('./docs/pages/components/ProgressDoc'))
const SelectDoc = lazy(() => import('./docs/pages/components/SelectDoc'))
const TextareaDoc = lazy(() => import('./docs/pages/components/TextareaDoc'))
const BadgeDoc = lazy(() => import('./docs/pages/components/BadgeDoc'))
const CardDoc = lazy(() => import('./docs/pages/components/CardDoc'))
const TabsDoc = lazy(() => import('./docs/pages/components/TabsDoc'))
const SwitchDoc = lazy(() => import('./docs/pages/components/SwitchDoc'))
const TableDoc = lazy(() => import('./docs/pages/components/TableDoc'))
const DialogDoc = lazy(() => import('./docs/pages/components/DialogDoc'))
const ModalRadixDoc = lazy(() => import('./docs/pages/components/ModalRadixDoc'))
const DrawerDoc = lazy(() => import('./docs/pages/components/DrawerDoc'))
const HeaderDoc = lazy(() => import('./docs/pages/components/HeaderDoc'))
const SidebarDoc = lazy(() => import('./docs/pages/components/SidebarDoc'))
const ToastDoc = lazy(() => import('./docs/pages/components/ToastDoc'))
const TooltipDoc = lazy(() => import('./docs/pages/components/TooltipDoc'))
const ApplicationShellDemo = lazy(() => import('./docs/pages/patterns/ApplicationShellDemo'))
const DashboardDemo = lazy(() => import('./docs/pages/patterns/DashboardDemo'))
const DataListingDemo = lazy(() => import('./docs/pages/patterns/DataListingDemo'))
const FormWorkspaceDemo = lazy(() => import('./docs/pages/patterns/FormWorkspaceDemo'))
const ModalWorkflowDemo = lazy(() => import('./docs/pages/patterns/ModalWorkflowDemo'))
const HeroHeaderDoc = lazy(() => import('./docs/pages/patterns/HeroHeaderDoc'))
const HeroBannerDoc = lazy(() => import('./docs/pages/patterns/HeroBannerDoc'))
const ConfiguracoesDemo = lazy(() => import('./docs/pages/patterns/ConfiguracoesDemo'))
const RelatoriosOperacionaisDemo = lazy(() => import('./docs/pages/patterns/RelatoriosOperacionaisDemo'))
const ExportModalDemo = lazy(() => import('./docs/pages/patterns/ExportModalDemo'))
const LoginDesktopTest = lazy(() => import('./docs/pages/LoginDesktopTest'))
const LoginClaudeLab = lazy(() => import('./docs/pages/LoginClaudeLab'))
function RouteFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center px-6 text-sm font-medium text-[var(--color-fg-muted)]">
      Carregando documentacao...
    </div>
  )
}

function renderLazyRoute(node: ReactNode) {
  return <Suspense fallback={<RouteFallback />}>{node}</Suspense>
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/docs/home" replace />} />
      <Route path="/login-desktop-test" element={renderLazyRoute(<LoginDesktopTest />)} />
      <Route path="/login-claude-lab" element={renderLazyRoute(<LoginClaudeLab />)} />
      <Route path="/docs" element={<DocLayout />}>
        <Route index element={renderLazyRoute(<OverviewPage />)} />
        <Route path="home" element={renderLazyRoute(<HomePage />)} />
        <Route path="stacks" element={renderLazyRoute(<StacksPage />)} />
        <Route path="governance" element={renderLazyRoute(<GovernancePage />)} />
        <Route path="foundations/colors" element={renderLazyRoute(<ColorsPage />)} />
        <Route path="foundations/typography" element={renderLazyRoute(<TypographyPage />)} />
        <Route path="foundations/spacing" element={renderLazyRoute(<SpacingPage />)} />
        <Route path="foundations/radius" element={renderLazyRoute(<RadiusPage />)} />
        <Route path="foundations/shadows" element={renderLazyRoute(<ShadowsPage />)} />
        <Route path="foundations/icons" element={renderLazyRoute(<IconsPage />)} />
        <Route path="components/button" element={renderLazyRoute(<ButtonDoc />)} />
        <Route path="components/field" element={renderLazyRoute(<FieldDoc />)} />
        <Route path="components/input" element={renderLazyRoute(<InputDoc />)} />
        <Route path="components/progress" element={renderLazyRoute(<ProgressDoc />)} />
        <Route path="components/select" element={renderLazyRoute(<SelectDoc />)} />
        <Route path="components/textarea" element={renderLazyRoute(<TextareaDoc />)} />
        <Route path="components/badge" element={renderLazyRoute(<BadgeDoc />)} />
        <Route path="components/card" element={renderLazyRoute(<CardDoc />)} />
        <Route path="components/tabs" element={renderLazyRoute(<TabsDoc />)} />
        <Route path="components/switch" element={renderLazyRoute(<SwitchDoc />)} />
        <Route path="components/table" element={renderLazyRoute(<TableDoc />)} />
        <Route path="components/dialog" element={renderLazyRoute(<DialogDoc />)} />
        <Route path="components/modal-radix" element={renderLazyRoute(<ModalRadixDoc />)} />
        <Route path="components/drawer" element={renderLazyRoute(<DrawerDoc />)} />
        <Route path="components/header" element={renderLazyRoute(<HeaderDoc />)} />
        <Route path="components/sidebar" element={renderLazyRoute(<SidebarDoc />)} />
        <Route path="components/toast" element={renderLazyRoute(<ToastDoc />)} />
        <Route path="components/tooltip" element={renderLazyRoute(<TooltipDoc />)} />
        <Route path="patterns/application-shell" element={renderLazyRoute(<ApplicationShellDemo />)} />
        <Route path="patterns/dashboard" element={renderLazyRoute(<DashboardDemo />)} />
        <Route path="patterns/data-listing" element={renderLazyRoute(<DataListingDemo />)} />
        <Route path="patterns/form-workspace" element={renderLazyRoute(<FormWorkspaceDemo />)} />
        <Route path="patterns/modal-workflow" element={renderLazyRoute(<ModalWorkflowDemo />)} />
        <Route path="patterns/hero" element={renderLazyRoute(<HeroHeaderDoc />)} />
        <Route path="patterns/hero-banner" element={renderLazyRoute(<HeroBannerDoc />)} />
        <Route path="patterns/configuracoes" element={renderLazyRoute(<ConfiguracoesDemo />)} />
        <Route path="patterns/relatorios-operacionais" element={renderLazyRoute(<RelatoriosOperacionaisDemo />)} />
        <Route path="patterns/export-modal" element={renderLazyRoute(<ExportModalDemo />)} />
        <Route path="patterns/hero-header" element={<Navigate to="/docs/patterns/hero" replace />} />
        <Route path="patterns/certificados" element={<Navigate to="/docs/patterns/data-listing" replace />} />
        <Route path="patterns/modal-form" element={<Navigate to="/docs/patterns/modal-workflow" replace />} />
        <Route path="login" element={renderLazyRoute(<LoginPage />)} />
        <Route path="changelog" element={renderLazyRoute(<ChangelogPage />)} />
      </Route>
      <Route path="*" element={<Navigate to="/docs/home" replace />} />
    </Routes>
  )
}
