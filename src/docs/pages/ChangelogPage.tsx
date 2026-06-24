import { DocPage } from '../components/DocPage'
import { Badge } from '../../components/ui/badge'
import type { BadgeVariantProps } from '../../components/ui/badge-variants'

type Entry = { version: string; date: string; items: string[] }

const entries: Entry[] = [
  {
    version: '0.5.4',
    date: '2026-06-23',
    items: [
      'Sidebar: categorias colapsáveis com cabeçalho tipográfico (uppercase, tracking 0.08em) e colapso animado — padrão de navegação unificado entre DS-FIPS, Suprimentos e Governança BI.',
      'Página "Histórico de versões" (antiga "Changelog") reescrita como timeline, com o tipo de versão (major/minor/patch) derivado automaticamente.',
      'Rodapé do sidebar: ação "Menu automático" renomeada para "Modo menu".',
    ],
  },
  {
    version: '0.5.3',
    date: '2026-06-22',
    items: [
      'Remoção completa da função "Ver código" (CodeExportSection) das páginas de documentação.',
      'Correção do build quebrado por imports órfãos.',
    ],
  },
  {
    version: '0.5.2',
    date: '2026-05-22',
    items: [
      'DialogTitle e Modal: título em branco no modo escuro (dark:text-white), alinhado ao ChangelogModal do Suprimentos.',
    ],
  },
  {
    version: '0.5.1',
    date: '2026-05-22',
    items: [
      'Composite Modal + ModalFooter (Radix Dialog): padrão ChangelogModal do Suprimentos — X top-5/right-5, rodapé surface-muted, botão primary «Entendi, continuar».',
      'Nova página /docs/components/modal-radix com demo interativa e anatomia do padrão.',
      'Tutorial contextual: faixa superior azul (#004B9B → #93BDE4), dots de progresso laranja (#F6921E), overlay azul e hover do fechar em azul (sem vermelho legado).',
    ],
  },
  {
    version: '0.5.0',
    date: '2026-05-22',
    items: [
      'Sync visual FIPS Suprimentos: FipsTabBar (abas segmentadas de Configurações), Switch, SettingsPreferenceRow e PatternPanelHero.',
      'Novos padrões documentados: Configurações, Relatórios operacionais e Export modal.',
      'Página Switch + seção 05 Segmented na documentação de Tabs; tokens semânticos e banners em globals.css.',
      'Pacote exports: fips-tab-bar, switch, settings-preference-row, pattern-panel-hero.',
    ],
  },
  {
    version: '0.4.0',
    date: '2026-04-07',
    items: [
      'Versão oficial do produto alinhada para 0.4.0 no app, package metadata, guia público e páginas standalone da documentação.',
      'Catálogo expandido com reescrita das páginas de Button, Input, Select, Textarea, Progress, Badge, Field, Card, Tabs, Table, Dialog, Drawer, Toast e Tooltip.',
      'Padrão Dashboard concluído com visualização rica, exportação em PDF e alinhamento das foundations.',
      'Nova camada de distribuição para IA com documentação consolidada para download e skill portátil do Design System FIPS.',
    ],
  },
  {
    version: '0.3.0',
    date: '2026-04-01',
    items: [
      'Shell principal da documentação consolidado com navegação lateral, changelog, governança e divisão por foundations, components e patterns.',
      'Introdução de PageHero, FipsLogo, composição de Field e InputGroup, além das primeiras regras formais de governança do design system.',
      'Fluxos de modal e form workspace reposicionados para o padrão visual inspirado no CONTPIX, com densidade e hierarquia mais consistentes.',
    ],
  },
  {
    version: '0.2.0',
    date: '2026-03-31',
    items: [
      'Documentação reorganizada por rotas lazy-loaded, com redução do peso inicial e melhor segmentação do catálogo.',
      'Base visual refinada com tokens mais estáveis, sidebar institucional, superfícies e shadows alinhadas ao Brandbook FIPS.',
      'Primeira rodada de vitrines editoriais para consolidar a linguagem visual do design system dentro do produto.',
    ],
  },
  {
    version: '0.1.0',
    date: '2026-03-24',
    items: [
      'MVP da documentação navegável com menu lateral responsivo.',
      'Tokens de cor e tipografia alinhados ao Brandbook FIPS.',
      'Biblioteca inicial: Button, Input, Select, Textarea, Badge, Card, Tabs, Table, Dialog, Drawer, Tooltip e Toast.',
      'Padrões de referência: dashboard, tabela de certificados e modal de formulário.',
    ],
  },
]

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

function formatDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return `${String(d).padStart(2, '0')} ${MESES[m - 1]} ${y}`
}

type Kind = 'major' | 'minor' | 'patch' | 'inicial'

function bumpKind(curr: string, prev?: string): Kind {
  if (!prev) return 'inicial'
  const [aMaj, aMin] = curr.split('.').map(Number)
  const [bMaj, bMin] = prev.split('.').map(Number)
  if (aMaj > bMaj) return 'major'
  if (aMin > bMin) return 'minor'
  return 'patch'
}

const KIND_META: Record<
  Kind,
  { label: string; variant: NonNullable<BadgeVariantProps['variant']> }
> = {
  major: { label: 'Major', variant: 'warning' },
  minor: { label: 'Minor', variant: 'info' },
  patch: { label: 'Patch', variant: 'secondary' },
  inicial: { label: 'Marco inicial', variant: 'success' },
}

export default function ChangelogPage() {
  return (
    <DocPage
      title="Histórico de versões"
      description="Evolução do pacote de design system e da documentação interna, em ordem cronológica decrescente."
    >
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-card)] sm:p-8">
        <ol className="relative">
          {entries.map((e, i) => {
            const isLatest = i === 0
            const isLast = i === entries.length - 1
            const meta = KIND_META[bumpKind(e.version, entries[i + 1]?.version)]
            return (
              <li key={e.version} className="grid grid-cols-[18px_1fr] gap-x-4 sm:gap-x-5">
                {/* trilho da timeline */}
                <div className="relative flex flex-col items-center">
                  <span
                    aria-hidden
                    className={
                      isLatest
                        ? 'mt-1 h-3.5 w-3.5 rounded-full border-2 border-[var(--color-surface)] bg-[var(--color-accent-strong)] shadow-[0_0_0_4px_rgba(246,146,30,0.2)]'
                        : 'mt-[5px] h-2.5 w-2.5 rounded-full border-2 border-[var(--color-primary)] bg-[var(--color-surface)] dark:border-[#93BDE4]'
                    }
                  />
                  {!isLast && <span aria-hidden className="w-px flex-1 bg-[var(--color-border)]" />}
                </div>

                {/* conteúdo da versão */}
                <div className={isLast ? 'pb-0' : 'pb-9'}>
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2">
                    <h2 className="font-heading text-lg font-semibold tracking-tight text-[var(--color-fg)] dark:text-white">
                      v{e.version}
                    </h2>
                    {isLatest ? <Badge variant="warning">Atual</Badge> : null}
                    <Badge variant={meta.variant}>{meta.label}</Badge>
                    <time className="ml-auto text-xs font-medium tabular-nums text-[var(--color-fg-muted)] dark:text-white/60">
                      {formatDate(e.date)}
                    </time>
                  </div>
                  <ul className="mt-3 space-y-2">
                    {e.items.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2.5 text-sm leading-relaxed text-[var(--color-fg-muted)] dark:text-white/70"
                      >
                        <span
                          aria-hidden
                          className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[var(--color-accent-strong)]"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </DocPage>
  )
}
