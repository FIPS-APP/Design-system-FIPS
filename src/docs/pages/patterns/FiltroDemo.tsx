import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import {
  Building2,
  CalendarClock,
  CircleCheck,
  ClipboardCheck,
  Filter,
  Flag,
  Globe,
  Layers,
  List,
  MapPin,
  SlidersHorizontal,
  User,
  type LucideIcon,
} from 'lucide-react'
import { ActiveFilterChips, MAX_FILTER_CHIPS } from '../../../components/composites/ActiveFilterChips'
import { FilterDrawer } from '../../../components/composites/FilterDrawer'
import {
  LISTING_PERIOD_PRESETS,
  ListingFilterToolbar,
  type ListingPeriodPreset,
} from '../../../components/composites/ListingFilterToolbar'
/* ─── Tipos e catálogo de dimensões (Painel / Histórico OPA) ─── */

type FilterDim =
  | 'area'
  | 'status'
  | 'criticidade'
  | 'tipo'
  | 'municipio'
  | 'classificacao'
  | 'vencimento'
  | 'responsavel'
  | 'subarea'
  | 'empresaObservador'
  | 'empresaEnvolvido'
  | 'funcao'
  | 'atividade'
  | 'local'
  | 'subLocal'

type FilterMeta = { dim: FilterDim; label: string; Icon: LucideIcon; kind: 'pill' | 'chip' }

const PILL_FILTER_META: FilterMeta[] = [
  { dim: 'area', label: 'Área do observador', Icon: Building2, kind: 'pill' },
  { dim: 'status', label: 'Status', Icon: CircleCheck, kind: 'pill' },
  { dim: 'criticidade', label: 'Criticidade', Icon: Flag, kind: 'pill' },
  { dim: 'tipo', label: 'Tipo', Icon: List, kind: 'pill' },
  { dim: 'municipio', label: 'Município', Icon: MapPin, kind: 'pill' },
  { dim: 'classificacao', label: 'Classificação', Icon: ClipboardCheck, kind: 'pill' },
  { dim: 'vencimento', label: 'Vencimento', Icon: CalendarClock, kind: 'pill' },
]

const CHIP_FILTER_META: FilterMeta[] = [
  { dim: 'responsavel', label: 'Responsável', Icon: User, kind: 'chip' },
  { dim: 'subarea', label: 'Subárea do observador', Icon: Layers, kind: 'chip' },
  { dim: 'empresaObservador', label: 'Empresa do observador', Icon: Building2, kind: 'chip' },
  { dim: 'empresaEnvolvido', label: 'Empresa do envolvido', Icon: Building2, kind: 'chip' },
  { dim: 'funcao', label: 'Função envolvida', Icon: User, kind: 'chip' },
  { dim: 'atividade', label: 'Atividade observada', Icon: ClipboardCheck, kind: 'chip' },
  { dim: 'local', label: 'Local', Icon: MapPin, kind: 'chip' },
  { dim: 'subLocal', label: 'Sub-local', Icon: MapPin, kind: 'chip' },
]

const STATUS_COLOR: Record<string, string> = {
  Pendente: '#DC3545',
  Andamento: '#F6921E',
  Finalizado: '#00C64C',
  Improcedente: '#C0CCD2',
}
const CRITICIDADE_COLOR: Record<string, string> = {
  Crítico: '#DC3545',
  Moderado: '#F6921E',
  Tolerável: '#00C64C',
  'Não aplicável': '#C0CCD2',
}
const TIPO_COLOR: Record<string, string> = {
  Comportamento: '#004B9B',
  'Condição insegura': '#F6921E',
  'Quase acidente': '#DC3545',
}
const VENCIMENTO_COLOR: Record<string, string> = {
  'Atrasado · Hoje': '#DC3545',
  'Vencendo (1-2d)': '#F6921E',
  'No prazo (3+d)': '#004B9B',
  'Sem vencimento': '#C0CCD2',
  Concluído: '#00C64C',
}

const DIM_COLOR: Partial<Record<FilterDim, Record<string, string>>> = {
  status: STATUS_COLOR,
  criticidade: CRITICIDADE_COLOR,
  tipo: TIPO_COLOR,
  vencimento: VENCIMENTO_COLOR,
}

const MOCK_OPTIONS: Record<FilterDim, string[]> = {
  area: ['Operações Portuárias', 'SSMA', 'Manutenção'],
  status: ['Pendente', 'Andamento', 'Finalizado', 'Improcedente'],
  criticidade: ['Crítico', 'Moderado', 'Tolerável', 'Não aplicável'],
  tipo: ['Comportamento', 'Condição insegura', 'Quase acidente'],
  municipio: ['Guarujá', 'Santos', 'Cubatão'],
  classificacao: ['Procedente', 'Improcedente', 'Em análise'],
  vencimento: ['Atrasado · Hoje', 'Vencendo (1-2d)', 'No prazo (3+d)', 'Sem vencimento', 'Concluído'],
  responsavel: ['Ana Costa', 'Carlos Santos', 'Mariana Souza'],
  subarea: ['Terminal', 'Pátio', 'Cais'],
  empresaObservador: Array.from({ length: 12 }, (_, i) => `Empresa observador ${i + 1}`),
  empresaEnvolvido: Array.from({ length: 12 }, (_, i) => `Empresa envolvido ${i + 1}`),
  funcao: ['Operador', 'Supervisor', 'Técnico SSMA'],
  atividade: ['Içamento', 'Movimentação', 'Inspeção'],
  local: ['Guarujá · Terminal', 'Santos · Cais'],
  subLocal: ['Berço 1', 'Berço 2', 'Armazém A'],
}

const EMPTY_FILTERS = Object.fromEntries(
  [...PILL_FILTER_META, ...CHIP_FILTER_META].map((m) => [m.dim, null]),
) as Record<FilterDim, string | null>

function formatBR(iso: string): string {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y.slice(2)}`
}

/* ─── Tokens de documentação (mesmo vocabulário Data Listing / Hero Banner) ─── */

const C = {
  azulProfundo: 'var(--color-gov-azul-profundo)',
  azulEscuro: 'var(--color-gov-azul-escuro)',
  azulClaro: 'var(--color-gov-azul-claro)',
  cinzaChumbo: 'var(--color-fg-muted)',
  cinzaEscuro: 'var(--color-fg)',
  amareloOuro: '#FDC24E',
  amareloEscuro: '#F6921E',
  danger: '#DC3545',
  branco: '#FFFFFF',
  cardBg: 'var(--color-surface)',
  cardBorder: 'var(--color-border)',
  bg: 'var(--color-surface-muted)',
  gradFrom: 'var(--color-gov-gradient-from)',
  gradTo: 'var(--color-gov-gradient-to)',
}
const Fn = {
  title: "'Saira Expanded', sans-serif",
  body: "'Open Sans', sans-serif",
  mono: "'Fira Code', monospace",
}
const alpha = (color: string, a: number) => `color-mix(in srgb, ${color} ${Math.round(a * 100)}%, transparent)`

const cardShadow = '0 1px 3px rgba(0,75,155,.04)'

const Ic = {
  grid: (s = 14, c = C.amareloOuro) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none" aria-hidden>
      <rect x="2" y="2" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4" />
      <rect x="11" y="2" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4" />
      <rect x="2" y="11" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4" />
      <rect x="11" y="11" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4" />
    </svg>
  ),
}

function JunctionLines({ style }: { style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 320 200" fill="none" style={{ opacity: 0.12, ...style }} aria-hidden>
      <path d="M0 60H100C120 60 120 60 140 40L200 40H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round" />
      <path d="M0 60H100C120 60 120 60 140 80L200 80H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round" />
      <path d="M0 120H60C80 120 80 120 100 100L160 100H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round" />
      <path d="M0 120H60C80 120 80 120 100 140L160 140H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round" />
    </svg>
  )
}

/** Cabeçalho numerado — HeroBannerDoc / DrawerDoc. */
function PatternSection({
  id,
  n,
  title,
  desc,
  children,
}: {
  id?: string
  n: string
  title: string
  desc: string
  children: ReactNode
}) {
  return (
    <section id={id} style={{ marginBottom: 44, scrollMarginTop: 96 }}>
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: C.azulClaro,
          fontFamily: Fn.title,
          marginBottom: 6,
        }}
      >
        {n}
      </div>
      <h2
        style={{
          fontSize: 20,
          fontWeight: 700,
          color: C.cinzaEscuro,
          margin: '0 0 4px',
          fontFamily: Fn.title,
          letterSpacing: '0.5px',
        }}
      >
        {title}
      </h2>
      <p
        style={{
          fontSize: 14,
          color: C.cinzaChumbo,
          margin: '0 0 20px',
          lineHeight: 1.55,
          fontFamily: Fn.body,
          maxWidth: 760,
        }}
      >
        {desc}
      </p>
      {children}
    </section>
  )
}

/** Card de spec — grid Data Listing (padding 18, título Saira 13). */
function SpecCard({
  title,
  icon,
  accent,
  items,
  mob,
}: {
  title: string
  icon: ReactNode
  accent: string
  items: string[]
  mob?: boolean
}) {
  return (
    <div
      style={{
        background: C.cardBg,
        borderRadius: '10px 10px 10px 18px',
        border: `1px solid ${C.cardBorder}`,
        padding: mob ? 16 : 18,
        boxShadow: cardShadow,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 9,
            background: alpha(accent, 0.06),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <span style={{ fontSize: 13, fontWeight: 700, color: C.cinzaEscuro, fontFamily: Fn.title }}>{title}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {items.map((item) => (
          <div
            key={item}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 8,
              fontSize: 11,
              color: C.cinzaEscuro,
              lineHeight: 1.5,
              fontFamily: Fn.body,
            }}
          >
            <span style={{ color: accent, fontWeight: 700, marginTop: 1 }}>•</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function SpecGrid({ mob, children }: { mob?: boolean; children: ReactNode }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: mob ? '1fr' : '1fr 1fr',
        gap: 12,
        marginBottom: 14,
      }}
    >
      {children}
    </div>
  )
}

function TokenPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div
      style={{
        background: C.cardBg,
        borderRadius: '10px 10px 10px 18px',
        border: `1px solid ${C.cardBorder}`,
        padding: 20,
        boxShadow: cardShadow,
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '1.2px',
          textTransform: 'uppercase',
          color: C.azulClaro,
          fontFamily: Fn.title,
          marginBottom: 8,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  )
}

function TokenRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        fontSize: 12,
        fontFamily: Fn.body,
        padding: '6px 0',
        borderBottom: `1px solid ${C.cardBorder}`,
      }}
    >
      <span style={{ color: C.cinzaChumbo, minWidth: 130 }}>{label}</span>
      <code
        style={{
          background: C.bg,
          padding: '2px 8px',
          borderRadius: 4,
          fontSize: 11,
          fontFamily: Fn.mono,
          color: C.cinzaEscuro,
        }}
      >
        {value}
      </code>
    </div>
  )
}

function AnatomyStep({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div
      style={{
        padding: 12,
        background: C.bg,
        borderRadius: 8,
        display: 'flex',
        gap: 10,
        alignItems: 'flex-start',
      }}
    >
      <span style={{ fontSize: 14, fontWeight: 800, color: C.amareloEscuro, fontFamily: Fn.title }}>{n}</span>
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.cinzaEscuro, fontFamily: Fn.title }}>{title}</div>
        <div style={{ fontSize: 11, color: C.cinzaChumbo, marginTop: 2, lineHeight: 1.5, fontFamily: Fn.body }}>{body}</div>
      </div>
    </div>
  )
}

function RuleHighlight({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        background: `linear-gradient(135deg,${alpha(C.azulProfundo, 0.03)} 0%,${C.amareloOuro}10 100%)`,
        border: `2px solid ${C.amareloOuro}`,
        borderRadius: '12px 12px 12px 24px',
        padding: 20,
        marginBottom: 14,
      }}
    >
      {children}
    </div>
  )
}

function CodeBlock({ children }: { children: string }) {
  return (
    <div
      style={{
        background: C.cardBg,
        borderRadius: '12px 12px 12px 24px',
        border: `1px solid ${C.cardBorder}`,
        padding: 24,
        boxShadow: cardShadow,
      }}
    >
      <pre
        style={{
          margin: 0,
          overflow: 'auto',
          padding: 16,
          borderRadius: 8,
          background: C.bg,
          fontFamily: Fn.mono,
          fontSize: 11,
          lineHeight: 1.55,
          color: C.cinzaEscuro,
        }}
      >
        {children}
      </pre>
    </div>
  )
}

function AntiPatternCard({ title, body }: { title: string; body: string }) {
  return (
    <div
      style={{
        background: C.cardBg,
        borderRadius: '10px 10px 10px 18px',
        border: `1px solid ${C.cardBorder}`,
        padding: 16,
        boxShadow: cardShadow,
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 700, color: C.danger, fontFamily: Fn.title, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 11, color: C.cinzaChumbo, lineHeight: 1.55, fontFamily: Fn.body }}>{body}</div>
    </div>
  )
}

export default function FiltroDemo() {
  const [w, setW] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)
  useEffect(() => {
    const h = () => setW(window.innerWidth)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])
  const mob = w < 768

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [scope, setScope] = useState<'minha' | 'todos'>('todos')
  const [search, setSearch] = useState('')
  const [period, setPeriod] = useState<ListingPeriodPreset>('Este ano')
  const [dateStart, setDateStart] = useState('')
  const [dateEnd, setDateEnd] = useState('')
  const [showPeriod, setShowPeriod] = useState(false)

  const periodLabel =
    period === 'Personalizado' && dateStart && dateEnd
      ? `${formatBR(dateStart)} → ${formatBR(dateEnd)}`
      : period

  const canApplyCustom = !!dateStart && !!dateEnd && dateStart <= dateEnd

  const activeCount = useMemo(
    () => Object.values(filters).filter((v) => v != null && v !== '').length,
    [filters],
  )

  const setFilter = (dim: FilterDim, value: string | null) => {
    setFilters((prev) => ({ ...prev, [dim]: value }))
  }

  const clear = () => setFilters(EMPTY_FILTERS)

  const countTodos = useMemo(() => {
    let n = 1375
    n -= activeCount * 47
    if (search.trim()) n = Math.max(0, n - 200)
    return n
  }, [activeCount, search])

  const countMinha = 0
  const resultCount = scope === 'minha' ? countMinha : countTodos

  const chips = useMemo(() => {
    return (Object.entries(filters) as [FilterDim, string | null][])
      .filter(([, v]) => v)
      .map(([dim, v]) => ({
        key: dim,
        label: v as string,
        remove: () => setFilter(dim, null),
      }))
  }, [filters])

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: Fn.body, color: C.cinzaEscuro }}>
      <header
        style={{
          background: `linear-gradient(135deg, ${C.gradFrom} 0%, ${C.gradTo} 100%)`,
          padding: mob ? '32px 20px' : '48px 40px 44px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <JunctionLines
          style={{ position: 'absolute', top: -10, right: -20, width: mob ? 250 : 400, height: 250 }}
        />
        <div style={{ position: 'relative' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: `${C.branco}10`,
              border: `1px solid ${C.branco}18`,
              borderRadius: 20,
              padding: '5px 14px',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              color: C.amareloOuro,
              fontFamily: Fn.title,
              marginBottom: 16,
            }}
          >
            {Ic.grid(14, C.amareloOuro)} Design System FIPS
          </div>
          <h1
            style={{
              fontSize: mob ? 30 : 44,
              fontWeight: 700,
              color: C.branco,
              margin: '0 0 10px',
              fontFamily: Fn.title,
            }}
          >
            Filtro
          </h1>
          <p
            style={{
              fontSize: 16,
              color: `${C.branco}B0`,
              lineHeight: 1.6,
              maxWidth: 700,
              margin: 0,
              fontFamily: Fn.body,
            }}
          >
            Toolbar de manipulação (card FIPS) e drawer lateral 400px — ordem fixa dos controles, catálogo de
            dimensões, tokens e exports{' '}
            <code
              style={{
                fontFamily: Fn.mono,
                fontSize: 12,
                background: `${C.branco}12`,
                padding: '1px 6px',
                borderRadius: 4,
              }}
            >
              ListingFilterToolbar
            </code>
            ,{' '}
            <code
              style={{
                fontFamily: Fn.mono,
                fontSize: 12,
                background: `${C.branco}12`,
                padding: '1px 6px',
                borderRadius: 4,
              }}
            >
              FilterDrawer
            </code>
            ,{' '}
            <code
              style={{
                fontFamily: Fn.mono,
                fontSize: 12,
                background: `${C.branco}12`,
                padding: '1px 6px',
                borderRadius: 4,
              }}
            >
              ActiveFilterChips
            </code>
            . Listagens com botão Filtros — nunca popover ancorado.
          </p>
        </div>
      </header>

      <div style={{ padding: mob ? '20px 12px 40px' : '32px 40px 60px', maxWidth: 1200, margin: '0 auto' }}>
        {/* 01 — Preview */}
        <PatternSection
          id="preview"
          n="01"
          title="Preview ao vivo"
          desc="Interaja na ordem real: Filtros abre o drawer; Alçada alterna o recorte (não é filtro do drawer); Busca restringe texto; Período altera a janela temporal; export desabilita sem resultados."
        >
          <ListingFilterToolbar
            filterActiveCount={activeCount}
            onOpenFilters={() => setDrawerOpen(true)}
            filtersOpen={drawerOpen}
            scope={scope}
            onScopeChange={setScope}
            countMinha={countMinha}
            countTodos={countTodos}
            search={search}
            onSearchChange={setSearch}
            periodLabel={periodLabel}
            period={period}
            onPeriodChange={setPeriod}
            showPeriod={showPeriod}
            onShowPeriodChange={setShowPeriod}
            dateStart={dateStart}
            dateEnd={dateEnd}
            onDateStartChange={setDateStart}
            onDateEndChange={setDateEnd}
            onApplyCustomPeriod={() => {
              if (!canApplyCustom) return
              setPeriod('Personalizado')
              setShowPeriod(false)
            }}
            canApplyCustomPeriod={canApplyCustom}
            exportDisabled={resultCount === 0}
          />

          <FilterDrawer
            open={drawerOpen}
            onOpenChange={setDrawerOpen}
            eyebrow="Dashboard de OPAs"
            activeCount={activeCount}
            resultCount={resultCount}
            onClear={clear}
            groups={PILL_FILTER_META.map(({ dim, label, Icon }) => {
              const colorMap = DIM_COLOR[dim]
              return {
                key: dim,
                label,
                icon: Icon,
                options: [
                  { value: '', label: 'Todos' },
                  ...MOCK_OPTIONS[dim].map((o) => ({ value: o, label: o, color: colorMap?.[o] })),
                ],
                value: filters[dim] ?? '',
                onChange: (v: string) => setFilter(dim, v || null),
              }
            })}
            chips={CHIP_FILTER_META.map(({ dim, label, Icon }) => ({
              key: dim,
              label,
              icon: Icon,
              options: MOCK_OPTIONS[dim],
              value: filters[dim],
              onChange: (v: string | null) => setFilter(dim, v),
            }))}
          />

          <div
            style={{
              marginTop: 14,
              padding: '12px 14px',
              background: C.bg,
              borderRadius: 8,
              border: `1px dashed ${C.cardBorder}`,
              fontSize: 11,
              lineHeight: 1.55,
              color: C.cinzaChumbo,
              fontFamily: Fn.body,
            }}
          >
            <strong style={{ color: C.cinzaEscuro }}>Estado da demo:</strong> {activeCount} filtro(s) no drawer · alçada{' '}
            <em>{scope === 'minha' ? 'Minha Área' : 'Toda jurisdição'}</em> · período <em>{periodLabel}</em> ·{' '}
            {resultCount} registro(s) · contadores (Minha Área = {countMinha}, Toda jurisdição = {countTodos}).
          </div>
        </PatternSection>

        {/* 02 — Toolbar card */}
        <PatternSection
          id="toolbar-card"
          n="02"
          title="Anatomia do card toolbar"
          desc="Um único container flex-wrap. Nunca misture export à esquerda ou filtros à direita. O card não substitui o header da tabela — é um bloco separado."
        >
          <SpecGrid mob={mob}>
            <SpecCard
              mob={mob}
              title="Container (obrigatório)"
              accent="var(--color-primary)"
              icon={<Filter className="h-4 w-4 text-[var(--color-primary)]" aria-hidden />}
              items={[
                'className: mt-3 flex flex-wrap items-center',
                'padding: 14px 18px · gap: 10px',
                'background: var(--color-surface)',
                'border: 1px solid var(--color-border)',
                'borderRadius: 10px 10px 10px 18px',
                'boxShadow: 0 1px 3px rgba(0,75,155,.04)',
                'Implementação: ListingFilterToolbar (não copiar inline)',
              ]}
            />
            <SpecCard
              mob={mob}
              title="Ordem dos slots (fixa)"
              accent="#F6921E"
              icon={<SlidersHorizontal className="h-4 w-4 text-[#F6921E]" aria-hidden />}
              items={[
                '① Filtros (outline sm) → abre FilterDrawer',
                '② Alçada (ScopeSegment) colada ao Filtros',
                '③ Busca (Input compact, flex-1 min-w-0)',
                '④ Período (chip trigger + listbox)',
                '⑤ Excel + PDF (34×34, só ícone + title)',
                'Responsivo: flex-wrap mantém ordem visual',
              ]}
            />
          </SpecGrid>

          <TokenPanel title="Tokens por controle">
            <TokenRow label="Botão Filtros" value='Button variant="outline" size="sm" · Filter h-4 w-4 · badge h-4 min-w-4 rounded-full bg-primary text-[10px] font-semibold' />
            <TokenRow label="Alçada" value="ScopeSegment · fundo --color-fips-blue-100 · borda primary 1.5px · segmento ativo primary cheio" />
            <TokenRow label="Busca" value='Input density="compact" type="search" · placeholder OPAs · flex-1 · ícone Search h-4' />
            <TokenRow label="Período" value="padding 7×12 · font 11/600 · Calendar 13px · ChevronDown 10px · listbox minWidth 200" />
            <TokenRow label="Export" value="34×34 · border 1px · radius 8 · Excel #1D6F42 · PDF #C0392B · disabled opacity 45%" />
          </TokenPanel>
        </PatternSection>

        {/* 03 — Filtros + Alçada */}
        <PatternSection
          id="filtros-alcada"
          n="03"
          title="Botão Filtros e Alçada"
          desc="Filtros e Alçada são independentes: o drawer filtra dimensões do registro; a alçada redefine o universo (Minha Área vs Toda jurisdição) com contadores dinâmicos."
        >
          <SpecGrid mob={mob}>
            <SpecCard
              mob={mob}
              title="Botão Filtros"
              accent="var(--color-primary)"
              icon={<Filter className="h-4 w-4 text-[var(--color-primary)]" aria-hidden />}
              items={[
                'Sempre outline azul — não muda cor quando há filtros ativos',
                'aria-expanded + aria-haspopup="dialog" quando drawer aberto',
                'Badge numérico só se activeCount > 0 (pill 16px, texto surface)',
                'Clique abre FilterDrawer side="left" (Radix Dialog)',
                'Proibido: popover 280px ancorado no botão',
              ]}
            />
            <SpecCard
              mob={mob}
              title="ScopeSegment (Alçada)"
              accent="var(--color-primary)"
              icon={<Globe className="h-4 w-4 text-[var(--color-primary)]" aria-hidden />}
              items={[
                'role="group" aria-label="Alçada"',
                'Dois segmentos: Minha Área | Toda jurisdição',
                'Contador mono 10px ao lado do label (quantos OPAs na combinação atual)',
                'Contadores calculados SEM aplicar o recorte da alçada — cada botão mostra o total se fosse escolhido',
                'Minha Área = 0 quando cadastro sem Área Processo (estado válido)',
                'Doc: /docs/patterns/data-listing#scope-segment',
              ]}
            />
          </SpecGrid>
        </PatternSection>

        {/* 04 — Drawer */}
        <PatternSection
          id="drawer"
          n="04"
          title="Drawer de filtros (FilterDrawer)"
          desc="Painel fixo 400px pela esquerda, cobre a sidebar do app. Três zonas: hero institucional, miolo rolável, rodapé fixo. Fecha com X no hero, overlay, Escape ou botão Ver N resultados."
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: mob ? '1fr' : 'repeat(3, 1fr)',
              gap: 8,
              marginBottom: 14,
            }}
          >
            <AnatomyStep
              n="①"
              title="DrawerHero"
              body="Gradiente gov 3 stops (--color-gov-gradient-from/to + #001A4A). Tile âmbar 44×44 radius 11. Eyebrow Saira 11px uppercase tracking 0.14em accent-strong. Título branco 21px/700. Subtítulo 12px white/65 — contador dinâmico ou copy vazia: «Refine os OPAs pelos campos abaixo». X glass top-right (DrawerClose)."
            />
            <AnatomyStep
              n="②"
              title="Miolo"
              body="flex-1 overflow-y-auto · px-6 py-5 · space-y-4. PillGroup para classificação (≤ ~8 opções visíveis). ChipSelect block para listas longas. Single-select por grupo: value '' = Todos. Painel de Ações pode usar multiple em pills — prop multiple no FilterGroup."
            />
            <AnatomyStep
              n="③"
              title="Rodapé"
              body="border-t · bg surface-muted/70 · px-6 py-4 · gap-2. Limpar tudo: outline primary/20, h-9, disabled se activeCount=0. Ver N resultados: bg --color-secondary, fecha drawer (onOpenChange false)."
            />
          </div>

          <TokenPanel title="DrawerContent">
            <TokenRow label="Largura" value="max-w-[400px] · maxWidth 90vw mobile" />
            <TokenRow label="Posição" value='side="left" · showCloseButton={false} (X só no hero)' />
            <TokenRow label="Classes" value="gap-0 overflow-hidden p-0 sm:p-0" />
            <TokenRow label="Overlay" value="bg slate-950/30 · backdrop-blur 2px · z-50" />
            <TokenRow label="Ícone hero" value="SlidersHorizontal no tile (não Filter)" />
          </TokenPanel>
        </PatternSection>

        {/* 05 — Pills vs Chips */}
        <PatternSection
          id="dimensoes"
          n="05"
          title="Catálogo de dimensões (pills vs ChipSelect)"
          desc="Regra de ouro: poucas opções escaneáveis → PillFilter/PillGroup; muitas opções ou busca necessária → ChipSelect block no drawer. Formulário de cadastro usa Select h-9/h-12, não chip."
        >
          <div
            style={{
              overflowX: 'auto',
              background: C.cardBg,
              borderRadius: '10px 10px 10px 18px',
              border: `1px solid ${C.cardBorder}`,
              boxShadow: cardShadow,
              marginBottom: 14,
            }}
          >
            <table style={{ width: '100%', minWidth: 640, borderCollapse: 'collapse', textAlign: 'left', fontSize: 11, fontFamily: Fn.body }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.cardBorder}`, background: C.bg }}>
                  {['Dimensão', 'Controle', 'Cor semântica', 'Notas'].map((h) => (
                    <th key={h} style={{ padding: '10px 16px', fontWeight: 700, color: C.cinzaEscuro, fontFamily: Fn.title, fontSize: 10, letterSpacing: '0.5px' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...PILL_FILTER_META, ...CHIP_FILTER_META].map((m) => (
                  <tr key={m.dim} style={{ borderBottom: `1px solid ${alpha(C.cardBorder, 0.7)}` }}>
                    <td style={{ padding: '8px 16px', fontWeight: 600, color: C.cinzaEscuro }}>{m.label}</td>
                    <td style={{ padding: '8px 16px' }}>
                      <span
                        style={{
                          borderRadius: 4,
                          padding: '2px 6px',
                          fontFamily: Fn.mono,
                          fontSize: 10,
                          fontWeight: 700,
                          background: m.kind === 'pill' ? alpha('var(--color-primary)', 0.1) : C.bg,
                          color: m.kind === 'pill' ? 'var(--color-primary)' : C.cinzaEscuro,
                        }}
                      >
                        {m.kind === 'pill' ? 'PillGroup' : 'ChipSelect block'}
                      </span>
                    </td>
                    <td style={{ padding: '8px 16px', fontFamily: Fn.mono, fontSize: 10, color: C.cinzaChumbo }}>
                      {DIM_COLOR[m.dim] ? 'Sim (pill ativo)' : m.kind === 'chip' && MOCK_OPTIONS[m.dim].length >= 10 ? 'N/A · busca auto ≥10' : 'Opcional / N/A'}
                    </td>
                    <td style={{ padding: '8px 16px', color: C.cinzaChumbo, lineHeight: 1.45 }}>
                      {m.dim === 'area' ? 'Área do observador, não do responsável (alçada usa responsável)' : m.dim === 'empresaObservador' ? 'Lista longa → busca no dropdown' : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <SpecGrid mob={mob}>
            <SpecCard
              mob={mob}
              title="PillFilter (ativo)"
              accent="#00C64C"
              icon={<CircleCheck className="h-4 w-4 text-[#00C64C]" aria-hidden />}
              items={[
                'Com cor semântica: fundo cheio da cor + texto branco',
                'Inativo com cor: dot 6px colorido (escaneável)',
                'Sem cor (ex. Área): primary cheio quando ativo',
                'Font 11px semibold · px-2 py-[3px] · rounded-md',
                'Sempre incluir opção { value: "", label: "Todos" }',
              ]}
            />
            <SpecCard
              mob={mob}
              title="ChipSelect no drawer"
              accent="var(--color-primary)"
              icon={<Building2 className="h-4 w-4 text-[var(--color-primary)]" aria-hidden />}
              items={[
                'block={true} · largura 100% empilhada',
                'Trigger: Label: Valor · ícone 14px · chevron',
                'Dropdown: radio 14px · radius 8/8/8/14 · shadow elevada',
                'searchable automático se options.length ≥ 10',
                'value null ou "" = Todos · onChange limpa com null',
              ]}
            />
          </SpecGrid>
        </PatternSection>

        {/* 06 — Período */}
        <PatternSection
          id="periodo"
          n="06"
          title="Período (fora do drawer)"
          desc="Período é controle de toolbar, não dimensão do FilterDrawer. Presets fecham o popover; Personalizado usa duas datas + Aplicar intervalo."
        >
          <SpecCard
            mob={mob}
            title="Presets"
            accent="#658EC9"
            icon={<CalendarClock className="h-4 w-4 text-[#658EC9]" aria-hidden />}
            items={[
              ...LISTING_PERIOD_PRESETS.map((p) => `«${p}»`),
              'Personalizado → label «dd/mm/aa → dd/mm/aa»',
              'listbox alinhado right-0 · z-30 · item ativo --color-fips-blue-200 + CheckCircle2',
              'Click outside via ref no ListingFilterToolbar',
            ]}
          />
        </PatternSection>

        {/* 07 — ActiveFilterChips */}
        <PatternSection
          id="chips-ativo"
          n="07"
          title="Chips de filtro ativo (header da tabela)"
          desc="Obrigatório quando existe botão Filtros. Fica à esquerda, colado ao título do card da listagem — nunca no canto direito (lá ficam Tabela/Card e Configurar)."
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 8,
              borderRadius: '12px 12px 12px 24px',
              border: `1px solid ${C.cardBorder}`,
              background: C.cardBg,
              padding: mob ? '14px 16px' : '16px 20px',
              boxShadow: cardShadow,
              marginBottom: 14,
            }}
          >
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, fontFamily: Fn.title, color: C.cinzaEscuro }}>OPAs registrados</h3>
            <ActiveFilterChips chips={chips} onClearAll={clear} onOpenFilters={() => setDrawerOpen(true)} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', gap: 8 }}>
            <AnatomyStep
              n="•"
              title="Um chip = um VALOR"
              body='Ex.: «Moderado ×», «Guarujá ×» — nunca badge «3 filtros» ou «Filtrado» (não diz o que está filtrado).'
            />
            <AnatomyStep
              n="•"
              title={`Limite ${MAX_FILTER_CHIPS} visíveis`}
              body={`Acima de ${MAX_FILTER_CHIPS} chips, excedente vira «+N» que chama onOpenFilters (reabre drawer). A partir de 2 chips aparece link «Limpar».`}
            />
            <AnatomyStep
              n="•"
              title="Separador"
              body="Ponto médio · (text-sm muted) entre título e primeiro chip."
            />
            <AnatomyStep
              n="•"
              title="Ícone no chip"
              body="SlidersHorizontal 10px + label 10px semibold + X 11px — hover brightness."
            />
          </div>
        </PatternSection>

        {/* 08 — Fluxo de dados */}
        <PatternSection
          id="fluxo"
          n="08"
          title="Fluxo de dados recomendado"
          desc="Três ordens diferentes — não misture: (A) slots na toolbar, (B) pipeline de recorte no código, (C) layout do painel. Spec: docs/specs/pattern-filtro.md."
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '1.2px',
              textTransform: 'uppercase',
              color: C.amareloEscuro,
              fontFamily: Fn.title,
              marginBottom: 8,
            }}
          >
            B · Pipeline de recorte (obrigatório no app)
          </div>
          <RuleHighlight>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
              {[
                'Período (base)',
                'Busca textual',
                'Alçada (universo)',
                'Drawer (dimensões)',
              ].map((step, i, arr) => (
                <span key={step} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      borderRadius: 8,
                      border: `1px solid var(--color-primary)`,
                      background: C.cardBg,
                      padding: '6px 10px',
                      fontFamily: Fn.title,
                      fontSize: 11,
                      fontWeight: 700,
                      color: C.cinzaEscuro,
                    }}
                  >
                    {String(i + 1).padStart(2, '0')} {step}
                  </span>
                  {i < arr.length - 1 ? <span style={{ color: C.cinzaChumbo }}>→</span> : null}
                </span>
              ))}
            </div>
            <p style={{ fontSize: 11, lineHeight: 1.55, color: C.cinzaEscuro, fontFamily: Fn.body, margin: '12px 0 0' }}>
              Saída do passo 4: dataset <code style={{ fontFamily: Fn.mono, fontSize: 10 }}>filtered</code> (todos os
              filtros ativos). Contadores da alçada usam período + busca + drawer, <em>sem</em> aplicar minha/todos —
              cada segmento mostra o total se fosse escolhido.
            </p>
          </RuleHighlight>

          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '1.2px',
              textTransform: 'uppercase',
              color: C.azulClaro,
              fontFamily: Fn.title,
              margin: '16px 0 8px',
            }}
          >
            Consumidores (paralelo — não entram no pipeline B)
          </div>
          <SpecGrid mob={mob}>
            <SpecCard
              mob={mob}
              title="KPIs · Tabela · Export"
              accent={C.azulProfundo}
              icon={<List className="h-4 w-4 text-[var(--color-primary)]" aria-hidden />}
              items={[
                'Leem o mesmo `filtered`',
                'Não filtram em série entre si',
                'Export desabilita se filtered.length === 0',
              ]}
            />
            <SpecCard
              mob={mob}
              title="Gráficos (dashboard)"
              accent={C.amareloEscuro}
              icon={<Layers className="h-4 w-4 text-[#F6921E]" aria-hidden />}
              items={[
                'Cross-filter via facet(dim) — exclui a dimensão do próprio gráfico',
                'Camada opcional; ver padrão Dashboard',
                'Clique na barra não substitui o drawer',
              ]}
            />
          </SpecGrid>

          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '1.2px',
              textTransform: 'uppercase',
              color: C.azulClaro,
              fontFamily: Fn.title,
              margin: '8px 0 8px',
            }}
          >
            A · Ordem na toolbar (só UI — §02)
          </div>
          <p style={{ fontSize: 11, lineHeight: 1.55, color: C.cinzaChumbo, fontFamily: Fn.body, margin: '0 0 8px' }}>
            Filtros → Alçada → Busca → Período → Export. Essa sequência é visual; o recorte no código segue sempre o
            pipeline B acima.
          </p>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '1.2px',
              textTransform: 'uppercase',
              color: C.azulClaro,
              fontFamily: Fn.title,
              margin: '8px 0 8px',
            }}
          >
            C · Layout do painel
          </div>
          <p style={{ fontSize: 11, lineHeight: 1.55, color: C.cinzaChumbo, fontFamily: Fn.body, margin: 0 }}>
            Header → KPIs → Toolbar → Table (± gráficos entre toolbar e tabela). Regra fixa no{' '}
            <a href="/docs/patterns/data-listing" style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
              Data Listing §06
            </a>
            .
          </p>
        </PatternSection>

        {/* 09 — Exports */}
        <PatternSection
          id="exports"
          n="09"
          title="Exports do pacote"
          desc="Importe composites — não duplique JSX do drawer ou da toolbar em páginas de produto."
        >
          <CodeBlock>{`import {
  ListingFilterToolbar,
  FilterDrawer,
  ActiveFilterChips,
  ScopeSegment,
  PillGroup,
  PillFilter,
  ChipSelect, // ui/chip-select — toolbar período usa trigger próprio
} from '@fips-app/ds-fips'`}</CodeBlock>
        </PatternSection>

        {/* 10 — Anti-patterns */}
        <PatternSection
          id="anti"
          n="10"
          title="Anti-patterns"
          desc="Erros recorrentes em PRs — evite."
        >
          <SpecGrid mob={mob}>
            {[
              {
                t: 'Popover de filtros',
                d: 'Nunca ancorar checklist no botão Filtros. Drawer left 400px é o único padrão aprovado.',
              },
              {
                t: 'Multi-select checkbox no drawer de listagem',
                d: 'Use pills single-select (ou multiple explícito só no Painel de Ações). Listagem padrão: um valor por dimensão.',
              },
              {
                t: 'Badge «Filtrado» no header',
                d: 'Substitua por ActiveFilterChips com um chip por valor filtrado.',
              },
              {
                t: 'Alçada dentro do drawer',
                d: 'Alçada é ScopeSegment na toolbar — alterna universo, não dimensão de filtro.',
              },
              {
                t: 'Select de formulário no drawer',
                d: 'Altura h-9/h-12 e label acima são para cadastro. No drawer use PillGroup ou ChipSelect block.',
              },
              {
                t: 'Copiar markup do HistoricoPage',
                d: 'Use FilterDrawer + ListingFilterToolbar para correções centralizadas no DS.',
              },
            ].map((r) => (
              <AntiPatternCard key={r.t} title={r.t} body={r.d} />
            ))}
          </SpecGrid>
          <p style={{ fontSize: 13, color: C.cinzaChumbo, fontFamily: Fn.body, lineHeight: 1.55, marginTop: 8 }}>
            Contexto de listagem completa:{' '}
            <a href="/docs/patterns/data-listing" style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
              Data Listing
            </a>
            {' · '}
            <a href="/docs/components/drawer" style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
              Drawer (hero)
            </a>
            {' · '}
            <a href="/docs/components/select" style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
              Select / Chip Filtro
            </a>
            .
          </p>
        </PatternSection>
      </div>
    </div>
  )
}
