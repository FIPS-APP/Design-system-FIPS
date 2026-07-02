import { useState } from 'react'
import { CodeExportSection } from '../../components/CodeExport'
import { PlaygroundProvider, Copyable, CodePlayground } from '../../components/CodePlayground'
import {
  BadgeDollarSign,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  ClipboardList,
  FolderKanban,
  Layers,
  ListTree,
  MapPin,
  Phone,
  Save,
  Send,
  Eye,
  Tag,
  UserRound,
  AlertTriangle,
  FileCheck,
  Zap,
  ShieldCheck,
  ArrowUpFromLine,
  LayoutGrid,
  Info,
} from 'lucide-react'
import { RuleCards } from '../../components/RuleCards'
import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Field, FieldLabel, FieldHint, type FieldInset } from '../../../components/ui/field'
import { Input } from '../../../components/ui/input'
import { Progress } from '../../../components/ui/progress'
import { Select } from '../../../components/ui/select'
import { Textarea } from '../../../components/ui/textarea'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '../../../components/ui/tooltip'

/* ═══════════════════════════════════════════ STYLES ═══════════════════════════════════════════ */
const workspaceStyles = `
  @keyframes wsFadeUp {
    0% { opacity: 0; transform: translateY(16px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  @keyframes wsSlideIn {
    0% { opacity: 0; transform: translateX(-12px); }
    100% { opacity: 1; transform: translateX(0); }
  }
  @keyframes wsProgressFill {
    0% { width: 0; }
    100% { width: var(--progress-target); }
  }
  @keyframes wsPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(253,194,78,0.3); }
    50% { box-shadow: 0 0 0 6px rgba(253,194,78,0); }
  }
  @keyframes wsTrackSlide {
    0% { background-position: 0 0; }
    100% { background-position: 40px 0; }
  }

  .ws-card {
    transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .ws-card:hover {
    box-shadow: 0 8px 28px rgba(0,75,155,0.08), 0 2px 8px rgba(0,0,0,0.04);
    border-color: var(--color-fips-blue-200);
  }

  .ws-metric-card {
    transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
    position: relative;
    overflow: hidden;
  }
  .ws-metric-card::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--color-fips-yellow-400), var(--color-fips-yellow-600));
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .ws-metric-card:hover::after {
    transform: scaleX(1);
  }
  .ws-metric-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(0,75,155,0.10), 0 2px 6px rgba(0,0,0,0.04);
  }

  .ws-nav-btn {
    transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
    position: relative;
  }
  .ws-nav-btn::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 0;
    background: linear-gradient(180deg, var(--color-fips-yellow-400), var(--color-fips-yellow-600));
    border-radius: 0 4px 4px 0;
    transition: height 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .ws-nav-btn:hover::before {
    height: 60%;
  }
  .ws-nav-btn:hover {
    background: white;
    border-color: var(--color-fips-blue-200);
    box-shadow: 0 4px 16px rgba(0,75,155,0.06);
    transform: translateX(2px);
  }

  .ws-footer {
    background: linear-gradient(135deg, var(--color-gov-gradient-to) 0%, var(--color-gov-gradient-from) 50%, #0090d0 100%);
    position: relative;
    overflow: hidden;
  }
  .ws-footer::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      repeating-linear-gradient(90deg, transparent 0px, transparent 38px, rgba(255,255,255,0.03) 38px, rgba(255,255,255,0.03) 40px);
    animation: wsTrackSlide 3s linear infinite;
    pointer-events: none;
  }

  .ws-section-card {
    animation: wsFadeUp 0.5s ease-out both;
  }
  .ws-section-card:nth-child(1) { animation-delay: 0.05s; }
  .ws-section-card:nth-child(2) { animation-delay: 0.12s; }
  .ws-section-card:nth-child(3) { animation-delay: 0.19s; }

  .ws-checklist-warn {
    position: relative;
    overflow: hidden;
  }
  .ws-checklist-warn::before {
    content: '';
    position: absolute;
    top: 0; left: 0; bottom: 0;
    width: 3px;
    background: linear-gradient(180deg, var(--color-fips-yellow-400), var(--color-fips-yellow-600));
    border-radius: 0 2px 2px 0;
  }
  .ws-checklist-done {
    position: relative;
    overflow: hidden;
  }
  .ws-checklist-done::before {
    content: '';
    position: absolute;
    top: 0; left: 0; bottom: 0;
    width: 3px;
    background: #E2E8F0;
    border-radius: 0 2px 2px 0;
  }
`

/* ═══════════════════════════════════════════ MINI PROGRESS ═══════════════════════════════════════════ */
function WorkspaceProgress({ value }: { value: number }) {
  const segments = [
    { label: 'Cabeçalho', threshold: 30 },
    { label: 'Classificação', threshold: 60 },
    { label: 'Complementar', threshold: 90 },
    { label: 'Envio', threshold: 100 },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-primary)]/8">
            <Zap className="h-4.5 w-4.5 text-[var(--color-primary)]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--color-fg)]">Progresso do formulário</p>
            <p className="text-xs text-[var(--color-fg-muted)]">
              {value < 100 ? 'Preencha todos os campos obrigatórios' : 'Formulário completo'}
            </p>
          </div>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="font-heading text-2xl font-semibold text-[var(--color-primary)]">{value}</span>
          <span className="text-sm font-medium text-[var(--color-fg-muted)]">%</span>
        </div>
      </div>

      <div className="relative">
        <Progress value={value} />
        <div className="mt-3 flex justify-between">
          {segments.map((seg) => (
            <div key={seg.label} className="flex flex-col items-center gap-1.5">
              <div
                className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                  value >= seg.threshold
                    ? 'border-[var(--color-success)] bg-[var(--color-success)]/10'
                    : 'border-[#E2E8F0] bg-[#FFFFFF]'
                }`}
              >
                {value >= seg.threshold ? (
                  <CheckCircle2 className="h-3 w-3 text-[var(--color-success)]" />
                ) : (
                  <div className="h-1.5 w-1.5 rounded-full bg-[var(--color-border)]" />
                )}
              </div>
              <span className={`text-[10px] font-semibold tracking-wide ${
                value >= seg.threshold ? 'text-[var(--color-success-strong)]' : 'text-[#7B8C96]'
              }`}>
                {seg.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════ SECTION HEADER (padrão Governança BI) ═══════════════════════════════════════════ */
/* Cabeçalho de seção numerado: tile 36px com acento cromático + título + descrição. */
function SectionHeader({ index, accent, title, description }: { index: string; accent: string; title: string; description: string }) {
  return (
    <CardHeader>
      <div className="flex items-center gap-3">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
          style={{ background: `color-mix(in srgb, ${accent} 8%, transparent)` }}
        >
          <span className="font-heading text-sm font-bold" style={{ color: accent }}>
            {index}
          </span>
        </div>
        <div>
          <CardTitle className="text-base">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </div>
    </CardHeader>
  )
}

/* ═══════════════════════════════════════════ FIELD WRAPPER (padrão Governança BI) ═══════════════════════════════════════════ */
/* Label com botão de ajuda (tooltip) opcional — ícone Info que explica o campo. */
function FieldLabelWithInfo({ label, required, tooltip }: { label: string; required?: boolean; tooltip?: string }) {
  if (!tooltip) return <FieldLabel required={required}>{label}</FieldLabel>
  return (
    <div className="flex items-center gap-1">
      <FieldLabel required={required}>{label}</FieldLabel>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="flex items-center text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-primary)]"
            aria-label={`Ajuda: ${label}`}
          >
            <Info className="h-3.5 w-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[280px] text-left">
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </div>
  )
}

type WorkspaceFieldProps = {
  label: string
  inset?: FieldInset
  required?: boolean
  tooltip?: string
  hint?: string
  className?: string
  children: React.ReactNode
}

/* Campo em density compact (padrão dos apps FIPS): label+ajuda, controle e hint opcional. */
function WorkspaceField({ label, inset = 'control', required, tooltip, hint, className, children }: WorkspaceFieldProps) {
  return (
    <Field inset={inset} density="compact" className={className}>
      <FieldLabelWithInfo label={label} required={required} tooltip={tooltip} />
      {children}
      {hint ? <FieldHint>{hint}</FieldHint> : null}
    </Field>
  )
}

/* ── Helper: código copy-paste-ready para o Playground ── */
function wsCode(part: 'hero' | 'form' | 'footer') {
  if (part === 'hero') return `// DS-FIPS — Form Workspace Hero Header — Copy-paste ready

export function WorkspaceHeroHeader() {
  const metrics = [
    { label: 'Obrigatorios', value: '8/10', helper: 'campos essenciais' },
    { label: 'Locais', value: '3 pares', helper: 'local e sublocal' },
    { label: 'Cadeia', value: 'Pronta', helper: 'aprovador definido' },
    { label: 'RC SAP', value: 'Depois', helper: 'informado apos criacao' },
  ];

  return (
    <div style={{
      background: 'linear-gradient(135deg, #002A68 0%, #004B9B 60%, #001A4A 100%)',
      padding: '20px 28px', color: '#fff', borderRadius: '12px 12px 0 0',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 44, height: 44, borderRadius: 11, background: 'rgba(253,194,78,0.18)', border: '1px solid rgba(253,194,78,0.19)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FDC24E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></svg>
        </div>
        <div>
          <h2 style={{ fontFamily: "'Saira Expanded',sans-serif", fontSize: 21, fontWeight: 700, margin: 0 }}>
            Workspace de Solicitacao
          </h2>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.66)', margin: '4px 0 0' }}>
            Organize cabecalho, classificacao e contexto operacional
          </p>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginTop: 16 }}>
        {metrics.map(m => (
          <div key={m.label} style={{ borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.07)', padding: '6px 10px', backdropFilter: 'blur(8px)' }}>
            <span style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)' }}>{m.label}</span>
            <p style={{ fontSize: 14, fontWeight: 700, margin: '2px 0 0', color: '#fff' }}>{m.value}</p>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', margin: '1px 0 0' }}>{m.helper}</p>
          </div>
        ))}
      </div>
    </div>
  );
}`

  if (part === 'form') return `// DS-FIPS — Form Workspace Numbered Section — Copy-paste ready

export function WorkspaceFormSection() {
  return (
    <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 16, overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 12, background: 'rgba(0,75,155,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: "'Saira Expanded',sans-serif", fontSize: 14, fontWeight: 700, color: '#004B9B' }}>01</span>
          </div>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#333B41', margin: 0 }}>Cabecalho da solicitacao</h3>
            <p style={{ fontSize: 12, color: '#7B8C96', margin: '2px 0 0' }}>Quem esta abrindo a demanda e qual escopo.</p>
          </div>
        </div>
      </div>
      <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#333B41', marginBottom: 4 }}>
            Data de emissao <span style={{ color: '#DC3545' }}>*</span>
          </label>
          <input placeholder="dd/mm/aaaa" style={{ width: '100%', height: 36, padding: '0 12px', borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#333B41', marginBottom: 4 }}>
            Nome do solicitante <span style={{ color: '#DC3545' }}>*</span>
          </label>
          <input placeholder="Nome completo" style={{ width: '100%', height: 36, padding: '0 12px', borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#333B41', marginBottom: 4 }}>
            Nome do escopo <span style={{ color: '#DC3545' }}>*</span>
          </label>
          <input placeholder="Ex.: Contratacao de manutencao" style={{ width: '100%', height: 36, padding: '0 12px', borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
        </div>
      </div>
    </div>
  );
}`

  return `// DS-FIPS — Form Workspace Footer — Copy-paste ready

export function WorkspaceFooter() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #004B9B 0%, #002A68 50%, #0090D0 100%)',
      borderRadius: 16, padding: 24, color: '#fff',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}>
      <div>
        <p style={{ fontFamily: "'Saira Expanded',sans-serif", fontSize: 14, fontWeight: 600, margin: 0 }}>Acoes do workspace</p>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', margin: '4px 0 0' }}>Rodape persistente para acoes principais.</p>
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <button style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', borderRadius: 8, padding: '8px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Salvar rascunho</button>
        <button style={{ background: '#F6921E', border: 'none', color: '#fff', borderRadius: 8, padding: '8px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Enviar para aprovacao</button>
      </div>
    </div>
  );
}`
}

function wsPreview(part: 'hero' | 'form' | 'footer') {
  const labels = { hero: 'Hero Header + Metricas', form: 'Secao numerada + Fields', footer: 'Footer de acoes' }
  const colors = { hero: '#002A68', form: '#004B9B', footer: '#F6921E' }
  return (
    <div style={{ padding: 12, textAlign: 'center' }}>
      <div style={{ background: `linear-gradient(135deg, ${colors[part]}, #004B9B)`, borderRadius: 8, padding: '14px 12px', color: '#fff', fontSize: 11, fontFamily: "'Saira Expanded', sans-serif" }}>
        <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: 1, color: '#FDC24E', marginBottom: 4 }}>Form Workspace</div>
        <strong>{labels[part]}</strong>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════ MAIN ═══════════════════════════════════════════ */
export default function FormWorkspaceDemo() {
  const [progress] = useState(82)

  return (
    <PlaygroundProvider>
    <TooltipProvider>
    <div style={{ minHeight: '100vh', background: 'var(--color-surface-muted)', fontFamily: "'Open Sans', sans-serif", color: 'var(--color-fg)' }}>
      {/* HEADER HERO */}
      <header style={{ background: 'linear-gradient(135deg, var(--color-gov-gradient-from) 0%, var(--color-gov-gradient-to) 100%)', padding: '48px 40px 44px', position: 'relative', overflow: 'hidden' }}>
        <svg viewBox="0 0 320 200" fill="none" style={{ opacity: 0.12, position: 'absolute', top: -10, right: -20, width: 400, height: 250 }}>
          <path d="M0 60H100C120 60 120 60 140 40L200 40H320" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
          <path d="M0 60H100C120 60 120 60 140 80L200 80H320" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
          <path d="M0 120H60C80 120 80 120 100 100L160 100H320" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
          <path d="M0 120H60C80 120 80 120 100 140L160 140H320" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
        </svg>
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 20, padding: '5px 14px', fontSize: 11, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#FDC24E', fontFamily: "'Saira Expanded', sans-serif", marginBottom: 16 }}>
            <LayoutGrid size={14} color="#FDC24E" /> Design System FIPS
          </div>
          <h1 style={{ fontSize: 44, fontWeight: 700, color: '#fff', margin: '0 0 10px', fontFamily: "'Saira Expanded', sans-serif" }}>Form Workspace</h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.69)', lineHeight: 1.6, maxWidth: 700, margin: 0, fontFamily: "'Open Sans', sans-serif" }}>
            Workspace de formulário para fluxos densos: resumo no topo, seções claras, grid principal + painel contextual lateral. Clique em qualquer seção para copiar o código.
          </p>
        </div>
      </header>

      <div style={{ padding: '36px 40px 60px', maxWidth: 1100, margin: '0 auto' }}>
      <style>{workspaceStyles}</style>

      <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid #E2E8F0', marginBottom: 32 }}>
        <div className="space-y-6 bg-[var(--color-surface-muted)] p-6">

          {/* ═══════ HERO HEADER ═══════ */}
          <Copyable label="Hero Header" code={wsCode('hero')} preview={wsPreview('hero')}>
          <Card className="overflow-hidden">
            <div
              className="relative overflow-hidden border-b border-[var(--color-border)] px-7 py-5"
              style={{
                background: 'linear-gradient(135deg, var(--color-gov-gradient-from) 0%, var(--color-gov-gradient-to) 60%, #001A4A 100%)',
              }}
            >
              {/* Junction lines SVG */}
              <svg viewBox="0 0 320 200" fill="none" className="pointer-events-none absolute -right-6 -top-3" style={{ width: 400, height: 250, opacity: 0.07 }}>
                <path d="M0 60H100C120 60 120 60 140 40L200 40H320" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
                <path d="M0 60H100C120 60 120 60 140 80L200 80H320" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
                <path d="M0 120H60C80 120 80 120 100 100L160 100H320" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
                <path d="M0 120H60C80 120 80 120 100 140L160 140H320" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
              </svg>

              <div className="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex max-w-3xl items-center gap-4">
                  <div
                    className="flex shrink-0 items-center justify-center rounded-[11px]"
                    style={{
                      width: 44,
                      height: 44,
                      background: 'rgba(253,194,78,0.18)',
                      border: '1px solid rgba(253,194,78,0.19)',
                    }}
                  >
                    <ClipboardList className="h-5 w-5" style={{ color: '#FDC24E' }} />
                  </div>
                  <div>
                    <h2
                      className="font-heading font-bold text-white"
                      style={{ fontSize: 21, lineHeight: 1.15, letterSpacing: '-0.2px', margin: 0 }}
                    >
                      Workspace de Solicitação
                    </h2>
                    <p
                      className="text-white/[.66]"
                      style={{ fontSize: 12, margin: '4px 0 0', lineHeight: 1.4 }}
                    >
                      Organize cabeçalho, classificação, contexto operacional e detalhes financeiros · FIPS
                    </p>
                  </div>
                </div>

                {/* Metric cards — glass cards */}
                <div className="xl:min-w-[340px]">
                  <div className="relative grid gap-2 sm:grid-cols-2">
                    {([
                      { label: 'Obrigatórios', value: '8/10', helper: 'campos essenciais', icon: FileCheck, color: '#93BDE4' },
                      { label: 'Locais', value: '3 pares', helper: 'local e sublocal', icon: MapPin, color: 'var(--color-gov-azul-claro)' },
                      { label: 'Cadeia', value: 'Pronta', helper: 'aprovador definido', icon: CheckCircle2, color: '#00C64C' },
                      { label: 'RC SAP', value: 'Depois', helper: 'informado após criação', icon: Clock, color: '#FDC24E' },
                    ] as const).map(({ label, value, helper, icon: Icon, color }) => (
                      <div
                        key={label}
                        className="rounded-lg border border-white/10 bg-white/[0.07] px-2.5 py-1.5 backdrop-blur-sm"
                      >
                        <div className="flex items-center gap-1.5">
                          <Icon className="h-3 w-3 shrink-0" style={{ color }} />
                          <span className="text-[9px] font-semibold uppercase tracking-[0.1em] text-white/50">
                            {label}
                          </span>
                        </div>
                        <p className="mt-0.5 text-sm font-bold text-white">{value}</p>
                        <p className="text-[10px] leading-tight text-white/40">{helper}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Progress + Direction */}
            <CardContent className="space-y-5">
              <WorkspaceProgress value={progress} />

              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-accent)]/12">
                    <ChevronRight className="h-4 w-4 text-[var(--color-accent-strong)]" />
                  </div>
                  <p className="text-sm font-semibold text-[var(--color-fg)]">Direção de preenchimento</p>
                </div>
                <div className="mt-3 grid gap-2.5 text-sm text-[var(--color-fg-muted)] md:grid-cols-2">
                  {[
                    '1. Identifique o solicitante e o escopo.',
                    '2. Classifique a demanda e o contexto.',
                    '3. Complete dados complementares.',
                    '4. Revise o fluxo e as pendências finais.',
                  ].map((step) => (
                    <div key={step} className="flex items-start gap-2">
                      <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--color-accent-strong)]" />
                      <p>{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          </Copyable>

          {/* ═══════ MAIN GRID ═══════ */}
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.22fr)_360px]">

            {/* LEFT — Form sections */}
            <Copyable label="Secoes do Formulario" code={wsCode('form')} preview={wsPreview('form')}>
            <div className="space-y-6">
              {/* Section 1: Cabeçalho */}
              <Card className="ws-card ws-section-card">
                <SectionHeader
                  index="01"
                  accent="var(--color-primary)"
                  title="Cabeçalho da solicitação"
                  description="Quem está abrindo a demanda e qual escopo será tratado."
                />
                <CardContent className="grid gap-5 sm:grid-cols-2">
                  <WorkspaceField
                    label="Nome do solicitante"
                    required
                    className="sm:col-span-2"
                    tooltip="Nome completo de quem abre a demanda. Aparece no histórico de governança e no e-mail enviado ao aprovador."
                  >
                    <Input density="compact" placeholder="Nome completo" leftIcon={<UserRound className="h-4 w-4" aria-hidden />} />
                  </WorkspaceField>
                  <WorkspaceField
                    label="Data de emissão"
                    required
                    tooltip="Data em que a solicitação foi aberta. Preenchida automaticamente, mas editável para lançamentos retroativos."
                  >
                    <Input density="compact" inputMode="numeric" placeholder="dd/mm/aaaa" leftIcon={<CalendarDays className="h-4 w-4" aria-hidden />} />
                  </WorkspaceField>
                  <WorkspaceField
                    label="Prioridade"
                    tooltip="Define a ordem de triagem. «Urgente» notifica o aprovador imediatamente."
                  >
                    <Select density="compact" aria-label="Prioridade" defaultValue="media" leftIcon={<AlertTriangle className="h-4 w-4" aria-hidden />}>
                      <option value="baixa">Baixa</option>
                      <option value="media">Média</option>
                      <option value="alta">Alta</option>
                      <option value="urgente">Urgente</option>
                    </Select>
                  </WorkspaceField>
                  <WorkspaceField
                    label="Nome do escopo"
                    required
                    className="sm:col-span-2"
                    hint="Título curto e reconhecível — evite nomes técnicos de arquivo."
                  >
                    <Input density="compact" placeholder="Ex.: Contratação de manutenção" leftIcon={<FolderKanban className="h-4 w-4" aria-hidden />} />
                  </WorkspaceField>
                </CardContent>
              </Card>

              {/* Section 2: Classificação */}
              <Card className="ws-card ws-section-card">
                <SectionHeader
                  index="02"
                  accent="var(--color-secondary)"
                  title="Classificação e contexto"
                  description="Área responsável, localização e contexto organizacional."
                />
                <CardContent className="grid gap-5 sm:grid-cols-2">
                  <WorkspaceField
                    label="Área processo"
                    required
                    tooltip="Área organizacional dona da demanda. Determina a cadeia de aprovação aplicável."
                  >
                    <Select density="compact" aria-label="Área processo" defaultValue="tecnologia" leftIcon={<Layers className="h-4 w-4" aria-hidden />}>
                      <option value="tecnologia">Tecnologia</option>
                      <option value="operacoes">Operações</option>
                      <option value="logistica">Logística</option>
                    </Select>
                  </WorkspaceField>
                  <WorkspaceField label="Subprocesso" required>
                    <Select density="compact" aria-label="Subprocesso" defaultValue="suporte" leftIcon={<ListTree className="h-4 w-4" aria-hidden />}>
                      <option value="suporte">Suporte</option>
                      <option value="infra">Infraestrutura</option>
                    </Select>
                  </WorkspaceField>
                  <WorkspaceField
                    label="Local de execução"
                    required
                    tooltip="Onde o serviço ou entrega acontece fisicamente. Usado para roteirizar equipes de campo."
                  >
                    <Input density="compact" placeholder="Ex.: Terminal 1" leftIcon={<MapPin className="h-4 w-4" aria-hidden />} />
                  </WorkspaceField>
                  <WorkspaceField label="Sublocal" hint="Opcional — detalha o ponto exato dentro do local.">
                    <Input density="compact" placeholder="Ex.: Casa de força" leftIcon={<MapPin className="h-4 w-4" aria-hidden />} />
                  </WorkspaceField>
                </CardContent>
              </Card>

              {/* Section 3: Complementares */}
              <Card className="ws-card ws-section-card">
                <SectionHeader
                  index="03"
                  accent="var(--color-accent-strong)"
                  title="Dados complementares"
                  description="Informações auxiliares para triagem e Suprimentos."
                />
                <CardContent className="grid gap-5 sm:grid-cols-2">
                  <WorkspaceField
                    label="Centro de custo"
                    required
                    tooltip="Código contábil que recebe o lançamento. Confirme com o financeiro antes de enviar."
                  >
                    <Input density="compact" placeholder="CC 3010" leftIcon={<BadgeDollarSign className="h-4 w-4" aria-hidden />} />
                  </WorkspaceField>
                  <WorkspaceField label="Contato rápido" hint="Telefone para dúvidas durante a triagem.">
                    <Input density="compact" placeholder="(11) 99999-9999" leftIcon={<Phone className="h-4 w-4" aria-hidden />} />
                  </WorkspaceField>
                  <WorkspaceField
                    label="Categoria"
                    required
                    tooltip="«Serviço» envolve mão de obra; «Material» é bem físico. Define o fluxo em Suprimentos."
                  >
                    <Select density="compact" aria-label="Categoria" defaultValue="servico" leftIcon={<Tag className="h-4 w-4" aria-hidden />}>
                      <option value="servico">Serviço</option>
                      <option value="material">Material</option>
                    </Select>
                  </WorkspaceField>
                  <WorkspaceField
                    label="Valor estimado"
                    tooltip="Estimativa em R$. Acima de R$ 50.000 dispara alerta de RDE automaticamente."
                  >
                    <Input density="compact" inputMode="numeric" placeholder="R$ 0,00" leftIcon={<BadgeDollarSign className="h-4 w-4" aria-hidden />} />
                  </WorkspaceField>
                  <WorkspaceField
                    label="Observação"
                    className="sm:col-span-2"
                    tooltip="Contexto livre para o analista: premissas, restrições e links úteis."
                  >
                    <Textarea density="compact" placeholder="Detalhe contexto, premissas, restrições e informações úteis para análise..." />
                  </WorkspaceField>
                </CardContent>
              </Card>
            </div>
            </Copyable>

            {/* RIGHT — Sidebar */}
            <aside className="space-y-4">
              {/* Navegação rápida */}
              <Card className="ws-card">
                <CardHeader>
                  <CardTitle className="text-lg">Navegação rápida</CardTitle>
                  <CardDescription>Links internos para acelerar revisão.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  {([
                    { idx: '01', title: 'Cabeçalho da solicitação', helper: 'Solicitante, título e data', color: 'var(--color-primary)' },
                    { idx: '02', title: 'Classificação e contexto', helper: 'Área, subprocesso e local', color: 'var(--color-secondary)' },
                    { idx: '03', title: 'Dados complementares', helper: 'Financeiro, contato e observação', color: 'var(--color-accent-strong)' },
                  ] as const).map(({ idx, title, helper, color }) => (
                    <button
                      key={title}
                      type="button"
                      className="ws-nav-btn w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-3.5 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl font-heading text-xs font-bold text-white"
                          style={{ background: `linear-gradient(135deg, ${color}, color-mix(in srgb, ${color} 75%, black))` }}
                        >
                          {idx}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[var(--color-fg)]">{title}</p>
                          <p className="mt-0.5 text-xs text-[var(--color-fg-muted)]">{helper}</p>
                        </div>
                        <ChevronRight className="ml-auto h-4 w-4 flex-shrink-0 text-[var(--color-fg-muted)] opacity-40" />
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>

              {/* Checklist */}
              <Card className="ws-card">
                <CardHeader>
                  <CardTitle className="text-lg">Checklist de envio</CardTitle>
                  <CardDescription>O que ainda bloqueia o fluxo.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  <div className="ws-checklist-warn rounded-xl border border-[var(--color-fips-orange-100)] bg-[var(--color-fips-orange-100)]/55 px-4 py-3.5">
                    <div className="flex items-start gap-2.5">
                      <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--color-accent-strong)]" />
                      <p className="text-sm text-[var(--color-accent-strong)]">
                        Confirmar centro de custo antes de enviar para aprovação.
                      </p>
                    </div>
                  </div>
                  <div className="ws-checklist-done rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-3.5">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--color-fg-muted)]" />
                      <p className="text-sm text-[var(--color-fg-muted)]">
                        Revisar observação final e anexos.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Saúde do formulário */}
              <Card className="ws-card">
                <CardHeader>
                  <CardTitle className="text-lg">Saúde do formulário</CardTitle>
                  <CardDescription>Status operacional do workspace.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-fg-muted)]">
                      Cadeia de aprovação
                    </p>
                    <div className="mt-2.5 flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-[var(--color-fg)]">Fluxo calculado</p>
                      <Badge variant="success" dot>
                        Pronto
                      </Badge>
                    </div>
                    <p className="mt-1.5 text-xs text-[var(--color-fg-muted)]">
                      Aprovador da área identificado com base no valor informado.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-fg-muted)]">
                      Salvamento
                    </p>
                    <div className="mt-2.5 flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-[var(--color-success)]" style={{ animation: 'wsPulse 2s ease-in-out infinite' }} />
                      <p className="text-sm font-semibold text-[var(--color-fg)]">Rascunho salvo há 2 min</p>
                    </div>
                    <p className="mt-1.5 text-xs text-[var(--color-fg-muted)]">
                      Última atualização automática às 18:43.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </aside>
          </div>

          {/* ═══════ FOOTER ACTIONS ═══════ */}
          <Copyable label="Footer de Acoes" code={wsCode('footer')} preview={wsPreview('footer')}>
          <div className="ws-footer rounded-2xl p-6 shadow-[var(--shadow-card)]">
            <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="font-heading text-sm font-semibold text-white">Ações do workspace</p>
                <p className="mt-1 text-sm text-white/55">
                  Rodapé persistente para ações principais e secundárias.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="inverseOutline" size="md">
                  <Eye className="h-4 w-4" />
                  Gerar prévia
                </Button>
                <Button variant="inverseOutline" size="md">
                  <Save className="h-4 w-4" />
                  Salvar rascunho
                </Button>
                <Button variant="ouro" size="md">
                  <Send className="h-4 w-4" />
                  Enviar para aprovação
                </Button>
              </div>
            </div>
          </div>
          </Copyable>
        </div>
      </div>

      <RuleCards cards={[
        { icon: <ShieldCheck size={20} color="var(--color-gov-azul-profundo)" />, color: 'var(--color-gov-azul-profundo)', bg: 'color-mix(in srgb, var(--color-gov-azul-profundo) 3%, transparent)', tag: 'REGRA 1', title: 'Formulário em página inteira com seções', desc: 'O Form Workspace é um layout de página inteira para formulários densos. O conteúdo é dividido em seções numeradas (01, 02, 03...), cada uma com título e descrição, e um card de resumo no topo mostra o progresso geral.' },
        { icon: <AlertTriangle size={20} color="#F6921E" />, color: '#F6921E', bg: '#F6921E08', tag: 'REGRA 2', title: 'Formulário à esquerda, contexto à direita', desc: 'Em telas largas, o layout se divide em duas colunas: o formulário principal ocupa a esquerda e o painel de contexto (navegação rápida, checklist, status) fica à direita. Em telas menores, tudo empilha verticalmente.' },
        { icon: <ArrowUpFromLine size={20} color="var(--color-gov-azul-escuro)" />, color: 'var(--color-gov-azul-escuro)', bg: 'color-mix(in srgb, var(--color-gov-azul-escuro) 3%, transparent)', tag: 'REGRA 3', title: 'Quando usar em vez do modal', desc: 'Use o Form Workspace quando o formulário tem muitas seções, campos complementares e contexto lateral que não cabem em um modal. Ideal para cadastros complexos, solicitações com múltiplas etapas e fluxos que exigem visão completa dos dados.' },
      ]} />

        <CodePlayground />

        <CodeExportSection items={[
          {
            label: 'Form Workspace Layout',
            description: 'Layout de formulario em pagina inteira com secoes numeradas, progress bar e painel lateral.',
            code: `/* Form Workspace — DS-FIPS
   Formulario denso em pagina inteira com:
   - Hero header com metricas glass
   - Progress bar com segmentos
   - Secoes numeradas (01, 02, 03...)
   - Painel lateral (navegacao rapida, checklist, status)
   - Footer persistente com acoes

   CSS vars: --color-primary, --color-secondary, --color-accent-strong
   --color-gov-gradient-from / --color-gov-gradient-to
   Fontes: Saira Expanded (titulos), Open Sans (corpo)
*/

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

function FormWorkspacePage() {
  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh' }}>
      {/* Hero com metricas glass */}
      <Card>
        <div style={{
          background: 'linear-gradient(135deg, var(--color-gov-gradient-from), var(--color-gov-gradient-to))',
          padding: '20px 28px', color: '#fff',
        }}>
          <h2 style={{ fontFamily: "'Saira Expanded',sans-serif", fontSize: 21, fontWeight: 700 }}>
            Workspace de Solicitacao
          </h2>
        </div>
        <CardContent>
          <Progress value={82} />
        </CardContent>
      </Card>

      {/* Grid: Form esquerda + Sidebar direita */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.22fr) 360px', gap: 24 }}>
        {/* Secoes numeradas */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <Card>
            <CardHeader>
              <CardTitle>01 — Cabecalho</CardTitle>
            </CardHeader>
            <CardContent>
              <Field inset="control">
                <FieldLabel required>Nome</FieldLabel>
                <Input placeholder="Nome completo" />
              </Field>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar: nav rapida + checklist + status */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Cards de contexto */}
        </aside>
      </div>

      {/* Footer acoes */}
      <div style={{
        background: 'linear-gradient(135deg, var(--color-gov-gradient-to), var(--color-gov-gradient-from))',
        borderRadius: 16, padding: 24, color: '#fff',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <p>Acoes do workspace</p>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button variant="inverseOutline">Salvar rascunho</Button>
          <Button variant="ouro">Enviar para aprovacao</Button>
        </div>
      </div>
    </div>
  )
}`,
          },
        ]} />

        <div style={{ textAlign: 'center', padding: '20px 0 0', borderTop: '1px solid #E2E8F0', marginTop: 20 }}>
          <span style={{ fontSize: 12, color: '#7B8C96', letterSpacing: '0.5px', fontFamily: "'Saira Expanded', sans-serif", fontWeight: 400 }}>DS-FIPS v0.4.2 · Ferrovia Interna do Porto de Santos · Excelência sobre trilhos · {new Date().getFullYear()}</span>
        </div>
      </div>
    </div>
    </TooltipProvider>
    </PlaygroundProvider>
  )
}
