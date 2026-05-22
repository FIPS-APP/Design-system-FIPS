import { DocPage, DemoSection } from '../components/DocPage'

const entries = [
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

export default function ChangelogPage() {
  return (
    <DocPage
      title="Changelog"
      description="Histórico de evolução do pacote de design system e da documentação interna."
    >
      {entries.map((e) => (
        <DemoSection
          key={e.version}
          title={`${e.version} · ${e.date}`}
        >
          <ul className="list-inside list-disc space-y-2 text-sm text-[var(--color-fg-muted)]">
            {e.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </DemoSection>
      ))}
    </DocPage>
  )
}
