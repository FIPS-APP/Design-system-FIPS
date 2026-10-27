import {
  BarChart3,
  Building2,
  CalendarDays,
  Check,
  ChevronsUpDown,
  Headphones,
  Paperclip,
  Upload,
  UserRound,
  Users,
  Video,
  Wrench,
  X,
  Zap,
} from 'lucide-react'
import { useState } from 'react'
import { DocPage, DemoSection } from '../../components/DocPage'
import { CodeExportSection } from '../../components/CodeExport'
import { PlaygroundProvider, Copyable, CodePlayground } from '../../components/CodePlayground'
import { Button } from '../../../components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../components/ui/dialog'
import { Field, FieldLabel, type FieldInset } from '../../../components/ui/field'
import { Input } from '../../../components/ui/input'
import { Select } from '../../../components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'
import { Textarea } from '../../../components/ui/textarea'

/* ─── helpers ─── */

type ModalFieldProps = {
  label: React.ReactNode
  required?: boolean
  inset?: FieldInset
  children: React.ReactNode
}

function ModalField({ label, required = false, inset = 'control', children }: ModalFieldProps) {
  return (
    <Field density="compact" inset={inset}>
      <FieldLabel required={required}>{label}</FieldLabel>
      {children}
    </Field>
  )
}

/* ─── Priority config (padrão CONTPIX) ─── */
const priorityConfig = {
  baixa: {
    label: 'Baixa',
    active: 'border-[var(--color-border-strong)] bg-[var(--color-surface-muted)] text-[var(--color-fg-muted)]',
    dot: 'bg-[var(--color-fg-muted)]/60',
  },
  media: {
    label: 'Média',
    active: 'border-[var(--color-secondary)] bg-[var(--color-secondary)]/8 text-[var(--color-secondary)]',
    dot: 'bg-[var(--color-secondary)]',
  },
  alta: {
    label: 'Alta',
    active: 'border-[var(--color-accent-strong)] bg-[var(--color-accent-strong)]/8 text-[var(--color-accent-strong)]',
    dot: 'bg-[var(--color-accent-strong)]',
  },
  urgente: {
    label: 'Urgente',
    active: 'border-[var(--color-danger)] bg-[var(--color-danger)]/8 text-[var(--color-danger)]',
    dot: 'bg-[var(--color-danger)]',
  },
} as const

type PriorityKey = keyof typeof priorityConfig

/* ─── Chip de responsável ─── */
function OwnerChip({ name, onRemove }: { name: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-[var(--color-secondary)]/20 bg-[var(--color-secondary)]/10 px-2.5 py-0.5 text-[11px] font-medium text-[var(--color-secondary)]">
      {name}
      <button type="button" onClick={onRemove} className="transition-colors hover:text-[var(--color-danger)]">
        <X className="h-3 w-3" />
      </button>
    </span>
  )
}

/* ─── Copyable code helper (hardcoded hex, self-contained) ─── */
function codeModalForm() {
  return `// DS-FIPS — Modal Form com Tabs — Copy-paste ready
import { useState } from "react";

export function ModalFormDemo() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("atendimento");
  const [priority, setPriority] = useState("media");

  const priorityConfig = {
    baixa:   { label: 'Baixa',   border: '#94A3B8', bg: '#F1F5F9', text: '#64748B', dot: '#94A3B8' },
    media:   { label: 'Media',   border: '#004B9B', bg: '#E8F0FE', text: '#004B9B', dot: '#004B9B' },
    alta:    { label: 'Alta',    border: '#F6921E', bg: '#FFF3E0', text: '#F6921E', dot: '#F6921E' },
    urgente: { label: 'Urgente', border: '#DC3545', bg: '#FDE8EA', text: '#DC3545', dot: '#DC3545' },
  };

  const tabs = [
    { id: 'atendimento', label: 'Atendimento' },
    { id: 'tarefa', label: 'Tarefa' },
    { id: 'reuniao', label: 'Reuniao' },
  ];

  return (
    <>
      <button onClick={() => setOpen(true)} style={{ background: '#004B9B', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
        Nova Tarefa
      </button>

      {open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={() => setOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} />
          <div style={{ position: 'relative', width: '95vw', maxWidth: 900, maxHeight: '90vh', background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.18)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '16px 24px', borderBottom: '1px solid #E2E8F0' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#E8F0FE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#004B9B" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              </div>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: '#333B41', margin: 0 }}>Novo Item</h2>
                <p style={{ fontSize: 12, color: '#7B8C96', margin: '2px 0 0' }}>Crie uma nova tarefa ou agende uma reuniao.</p>
              </div>
            </div>

            <div style={{ padding: '16px 24px', overflowY: 'auto', flex: 1 }}>
              <div style={{ display: 'flex', gap: 4, padding: 4, background: '#F1F5F9', borderRadius: 12, marginBottom: 16 }}>
                {tabs.map(t => (
                  <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ flex: 1, padding: '8px 12px', borderRadius: 8, fontSize: 13, fontWeight: 600, border: 'none', background: activeTab === t.id ? '#fff' : 'transparent', color: activeTab === t.id ? '#004B9B' : '#7B8C96', boxShadow: activeTab === t.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none', cursor: 'pointer' }}>
                    {t.label}
                  </button>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#333B41', display: 'block', marginBottom: 4 }}>Titulo <span style={{ color: '#DC3545' }}>*</span></label>
                    <input placeholder="Ex: Consultoria Fiscal" style={{ width: '100%', height: 36, padding: '0 12px', borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#333B41', display: 'block', marginBottom: 4 }}>Cliente</label>
                    <input placeholder="Buscar empresa..." style={{ width: '100%', height: 36, padding: '0 12px', borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: '#333B41', display: 'block', marginBottom: 4 }}>Data Inicio</label>
                      <input type="date" defaultValue="2026-04-01" style={{ width: '100%', height: 36, padding: '0 12px', borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: '#333B41', display: 'block', marginBottom: 4 }}>Fim do Prazo</label>
                      <input type="date" style={{ width: '100%', height: 36, padding: '0 12px', borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#333B41', display: 'block', marginBottom: 4 }}>Prioridade</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                      {Object.entries(priorityConfig).map(([key, cfg]) => (
                        <button key={key} onClick={() => setPriority(key)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: '6px 8px', borderRadius: 8, border: \`2px solid \${priority === key ? cfg.border : '#E2E8F0'}\`, background: priority === key ? cfg.bg : '#fff', color: priority === key ? cfg.text : '#7B8C96', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: priority === key ? cfg.dot : '#CBD5E1' }} />
                          {cfg.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#333B41', display: 'block', marginBottom: 4 }}>Descricao</label>
                    <textarea placeholder="Detalhes, contexto, links..." rows={3} style={{ width: '100%', padding: '8px 12px', borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 13, outline: 'none', resize: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', borderTop: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: 11, color: '#7B8C96' }}>Cmd+Enter para salvar</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setOpen(false)} style={{ height: 36, padding: '0 16px', fontSize: 14, fontWeight: 600, borderRadius: 12, border: '1px solid #E2E8F0', background: '#fff', color: '#333B41', cursor: 'pointer' }}>Cancelar</button>
                <button style={{ height: 36, padding: '0 16px', fontSize: 14, fontWeight: 600, borderRadius: 12, border: 'none', background: '#00C64C', color: '#fff', cursor: 'pointer' }}>Salvar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}`
}

/* ─── Component ─── */
export default function ModalFormDemo() {
  const [open, setOpen] = useState(false)
  const [priority, setPriority] = useState<PriorityKey>('media')
  const [progress, setProgress] = useState(0)
  const [owners, setOwners] = useState<string[]>(['Diogo'])

  return (
    <DocPage
      title="Padrão: Modal de formulário"
      description="Formulário em duas colunas com abas superiores, seletor de prioridade com dots, barra de progresso, chips de responsável e upload de documentos. Clique no demo para copiar o código."
    >
      <PlaygroundProvider>
      <DemoSection title="Interativo — Novo Item">
        <Copyable label="Modal Form" code={codeModalForm()} preview={
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #E2E8F0', fontFamily: "'Open Sans', sans-serif", fontSize: 13, maxWidth: 300 }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: '#333B41', marginBottom: 8 }}>Novo Item</div>
            <div style={{ fontSize: 12, color: '#7B8C96', marginBottom: 12 }}>Modal com Tabs + Grid 2 colunas + Prioridade dots</div>
            <div style={{ display: 'flex', gap: 6 }}>
              <span style={{ padding: '3px 10px', borderRadius: 6, background: '#E8F0FE', color: '#004B9B', fontSize: 11, fontWeight: 600 }}>Atendimento</span>
              <span style={{ padding: '3px 10px', borderRadius: 6, background: '#F1F5F9', color: '#64748B', fontSize: 11 }}>Tarefa</span>
              <span style={{ padding: '3px 10px', borderRadius: 6, background: '#F1F5F9', color: '#64748B', fontSize: 11 }}>Reuniao</span>
            </div>
          </div>
        }>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Zap className="h-4 w-4" aria-hidden />
              Nova Tarefa
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto p-0">
            {/* Header */}
            <DialogHeader className="border-b border-[var(--color-border)] px-6 pb-4 pt-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-fips-blue-200)]">
                  <Zap className="h-5 w-5 text-[var(--color-secondary)]" aria-hidden />
                </div>
                <div>
                  <DialogTitle>Novo Item</DialogTitle>
                  <DialogDescription>Crie uma nova tarefa ou agende uma reunião.</DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {/* Body */}
            <div className="space-y-4 px-6 py-4">
              {/* Tabs tipo (padrão CONTPIX) */}
              <Tabs defaultValue="atendimento" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="atendimento" className="gap-1.5">
                    <Headphones className="h-3.5 w-3.5" aria-hidden />
                    Atendimento
                  </TabsTrigger>
                  <TabsTrigger value="tarefa" className="gap-1.5">
                    <Wrench className="h-3.5 w-3.5" aria-hidden />
                    Tarefa
                  </TabsTrigger>
                  <TabsTrigger value="reuniao" className="gap-1.5">
                    <Video className="h-3.5 w-3.5" aria-hidden />
                    Reunião
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="atendimento" className="space-y-0 border-0 p-0 pt-4 shadow-none">
                  <div className="grid gap-x-5 gap-y-3 md:grid-cols-2">
                    {/* ═══ LEFT COLUMN ═══ */}
                    <div className="space-y-3">
                      {/* Título */}
                      <ModalField label="Título" required inset="icon">
                        <Input
                          density="compact"
                          placeholder="Ex: Consultoria Fiscal"
                          leftIcon={<Zap className="h-4 w-4" aria-hidden />}
                        />
                      </ModalField>

                      {/* Cliente + Tipo */}
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <ModalField label="Cliente" inset="icon">
                            <Input
                              density="compact"
                              placeholder="Buscar empresa..."
                              leftIcon={<UserRound className="h-4 w-4" aria-hidden />}
                            />
                          </ModalField>
                        </div>
                        <div className="w-[100px]">
                          <ModalField label={<span className="invisible">Tipo</span>}>
                            <Select density="compact" aria-label="Tipo" defaultValue="interno">
                              <option value="interno">Interno</option>
                              <option value="externo">Externo</option>
                            </Select>
                          </ModalField>
                        </div>
                      </div>

                      {/* Departamento + Responsável */}
                      <div className="grid grid-cols-2 gap-2">
                        <ModalField label="Departamento" inset="icon">
                          <Select
                            density="compact"
                            aria-label="Departamento"
                            leftIcon={<Building2 className="h-4 w-4" aria-hidden />}
                            defaultValue="tecnologia"
                          >
                            <option value="tecnologia">Tecnologia</option>
                            <option value="fiscal">Fiscal</option>
                            <option value="contabil">Contábil</option>
                            <option value="dp">Dep. Pessoal</option>
                          </Select>
                        </ModalField>
                        <div className="space-y-1">
                          <ModalField label="Responsável(is)" inset="icon">
                            <button
                              type="button"
                              className="flex h-9 w-full items-center justify-between rounded-xl border border-[var(--color-border)]/60 bg-[var(--color-surface)] px-3 text-left text-sm text-[var(--color-fg)] shadow-sm transition-all duration-200 hover:border-[var(--color-border)]/80"
                            >
                              <span className="flex items-center gap-2 truncate">
                                <Users className="h-3.5 w-3.5 text-[var(--color-fg-muted)]" aria-hidden />
                                {owners.length > 0 ? `${owners.length} selecionado(s)` : 'Selecione...'}
                              </span>
                              <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 opacity-50" />
                            </button>
                          </ModalField>
                          {owners.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {owners.map((name, idx) => (
                                <OwnerChip
                                  key={idx}
                                  name={name}
                                  onRemove={() => setOwners(owners.filter((_, i) => i !== idx))}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Data Início + Fim do Prazo */}
                      <div className="grid grid-cols-2 gap-2">
                        <ModalField label="Data Início" inset="icon">
                          <Input
                            density="compact"
                            type="date"
                            defaultValue="2026-04-01"
                            leftIcon={<CalendarDays className="h-4 w-4" aria-hidden />}
                          />
                        </ModalField>
                        <ModalField label="Fim do Prazo" inset="icon">
                          <Input
                            density="compact"
                            type="date"
                            placeholder="dd/mm/aaaa"
                            leftIcon={<CalendarDays className="h-4 w-4" aria-hidden />}
                          />
                        </ModalField>
                      </div>

                      {/* Status */}
                      <ModalField label="Status" inset="icon">
                        <Select
                          density="compact"
                          aria-label="Status"
                          leftIcon={<Building2 className="h-4 w-4" aria-hidden />}
                          defaultValue="backlog"
                        >
                          <option value="backlog">Backlog</option>
                          <option value="afazer">A Fazer</option>
                          <option value="em-progresso">Em Progresso</option>
                          <option value="revisao">Em Revisão</option>
                          <option value="concluido">Concluído</option>
                        </Select>
                      </ModalField>
                    </div>

                    {/* ═══ RIGHT COLUMN ═══ */}
                    <div className="space-y-3">
                      {/* Prioridade — seletor com dots (padrão CONTPIX) */}
                      <div className="space-y-1">
                        <p className="ml-1.5 text-xs font-semibold uppercase tracking-[0.02em] text-[var(--color-fg-muted)]">
                          Prioridade
                        </p>
                        <div className="grid grid-cols-4 gap-1.5">
                          {(Object.keys(priorityConfig) as PriorityKey[]).map((key) => {
                            const cfg = priorityConfig[key]
                            const isActive = priority === key
                            return (
                              <button
                                key={key}
                                type="button"
                                onClick={() => setPriority(key)}
                                className={`flex items-center justify-center gap-1 rounded-lg border-2 px-2 py-1.5 text-xs font-medium transition-all duration-200 ${
                                  isActive
                                    ? cfg.active
                                    : 'border-[#E2E8F0]/60 bg-[#FFFFFF] text-[#7B8C96] hover:border-[#E2E8F0] hover:bg-[#F8FAFC]'
                                }`}
                              >
                                <span
                                  className={`h-1.5 w-1.5 rounded-full ${isActive ? cfg.dot : 'bg-[#7B8C96]/40'}`}
                                />
                                {cfg.label}
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {/* Progresso — slider (padrão CONTPIX) */}
                      <div className="space-y-1">
                        <p className="ml-1.5 text-xs font-semibold uppercase tracking-[0.02em] text-[var(--color-fg-muted)]">
                          Progresso
                        </p>
                        <div className="flex items-center gap-3">
                          <BarChart3 className="h-3.5 w-3.5 shrink-0 text-[var(--color-fg-muted)]" aria-hidden />
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            value={progress}
                            onChange={(e) => setProgress(parseInt(e.target.value))}
                            className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-[var(--color-surface-muted)] [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:bg-[var(--color-secondary)] [&::-moz-range-thumb]:shadow-lg [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--color-secondary)] [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-[var(--color-secondary)]/30"
                          />
                          <span className="min-w-[32px] text-right text-xs font-semibold text-[var(--color-fg-muted)]">
                            {progress}%
                          </span>
                        </div>
                      </div>

                      {/* Descrição */}
                      <div className="space-y-1">
                        <p className="ml-1.5 text-xs font-semibold uppercase tracking-[0.02em] text-[var(--color-fg-muted)]">
                          Descrição
                        </p>
                        <div className="relative">
                          <Textarea
                            density="compact"
                            placeholder="Detalhes, contexto, links..."
                            className="resize-none"
                          />
                        </div>
                      </div>

                      {/* Documentos */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <p className="ml-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.02em] text-[var(--color-fg-muted)]">
                            <Paperclip className="h-3.5 w-3.5" aria-hidden />
                            Documentos
                          </p>
                          <Button type="button" size="sm" variant="secondary" className="gap-1.5">
                            <Upload className="h-3 w-3" aria-hidden />
                            Anexar
                          </Button>
                        </div>
                        <div className="rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 py-3">
                          <p className="text-center text-xs text-[var(--color-fg-muted)]">Nenhum documento anexado</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="tarefa" className="pt-4 text-sm text-[var(--color-fg-muted)]">
                  Conteúdo exemplo da aba Tarefa — mesma estrutura, tipo diferente.
                </TabsContent>
                <TabsContent value="reuniao" className="pt-4 text-sm text-[var(--color-fg-muted)]">
                  Conteúdo exemplo da aba Reunião — inclui campos de horário e plataforma.
                </TabsContent>
              </Tabs>
            </div>

            {/* Footer */}
            <DialogFooter className="border-t border-[var(--color-border)] px-6 py-3">
              <div className="flex w-full items-center justify-between">
                <p className="text-xs text-[var(--color-fg-muted)]">⌘ + Enter para salvar</p>
                <div className="flex gap-2">
                  <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="button" variant="success" className="gap-2">
                    <Check className="h-4 w-4" aria-hidden />
                    Salvar
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        </Copyable>
      </DemoSection>

      <CodePlayground />

      <CodeExportSection items={[
        {
          label: 'Modal Form com Primitivas DS-FIPS',
          description: 'Formulario modal com Tabs, Field, Input, Select, Textarea — composicao oficial DS-FIPS.',
          code: `/* Modal Form — DS-FIPS (primitivas oficiais)
   Diferente do Modal Workflow, este usa as primitivas do DS:
   - Dialog + DialogHeader/Footer/Content
   - Tabs + TabsList/Trigger/Content
   - Field + FieldLabel (density="compact")
   - Input, Select, Textarea (density="compact")
   - Button (variant="success" / "secondary")

   CSS vars: --color-primary, --color-secondary, --color-accent-strong
   --color-danger, --color-fg, --color-fg-muted, --color-border
*/

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

const priorityConfig = {
  baixa:   { label: 'Baixa',   dot: 'bg-[#7B8C96]/60' },
  media:   { label: 'Media',   dot: 'bg-[var(--color-secondary)]' },
  alta:    { label: 'Alta',    dot: 'bg-[var(--color-accent-strong)]' },
  urgente: { label: 'Urgente', dot: 'bg-[var(--color-danger)]' },
}

function ModalForm() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Nova Tarefa</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="border-b px-6 pb-4 pt-5">
          <DialogTitle>Novo Item</DialogTitle>
          <DialogDescription>Crie uma nova tarefa ou agende uma reuniao.</DialogDescription>
        </DialogHeader>

        <div className="px-6 py-4">
          <Tabs defaultValue="atendimento">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="atendimento">Atendimento</TabsTrigger>
              <TabsTrigger value="tarefa">Tarefa</TabsTrigger>
              <TabsTrigger value="reuniao">Reuniao</TabsTrigger>
            </TabsList>
            <TabsContent value="atendimento">
              <div className="grid gap-x-5 gap-y-3 md:grid-cols-2">
                {/* Left: Titulo, Cliente, Departamento, Datas, Status */}
                {/* Right: Prioridade (4 botoes dot), Progresso slider, Descricao, Documentos */}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="border-t px-6 py-3">
          <Button variant="secondary">Cancelar</Button>
          <Button variant="success">Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}`,
        },
      ]} />
      </PlaygroundProvider>
    </DocPage>
  )
}
