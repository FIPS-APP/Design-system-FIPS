import { useState, useEffect, type ReactNode } from 'react'
import { LayoutGrid, FileDown, Send, Plus, ShieldCheck, AlertTriangle, ArrowUpFromLine, PanelTop } from 'lucide-react'
import { CodeExportSection } from '../../components/CodeExport'
import { PlaygroundProvider, Copyable, CodePlayground } from '../../components/CodePlayground'
import { RuleCards } from '../../components/RuleCards'
import { PageHeader } from '../../../components/composites/PageHeader'
import { Button } from '../../../components/ui/button'

const C = { azulProfundo: 'var(--color-gov-azul-profundo)', azulEscuro: 'var(--color-gov-azul-escuro)', azulClaro: 'var(--color-gov-azul-claro)', cinzaChumbo: 'var(--color-fg-muted)', cinzaEscuro: 'var(--color-fg)', amareloOuro: '#FDC24E', amareloEscuro: '#F6921E', verdeFloresta: '#00C64C', verdeEscuro: 'var(--color-gov-verde-escuro)', danger: '#DC3545', branco: '#FFFFFF', bg: 'var(--color-surface-muted)', cardBg: 'var(--color-surface)', cardBorder: 'var(--color-border)', azulCeuClaro: '#D3E3F4', textLight: 'var(--color-fg-muted)', neutro: 'var(--color-surface-soft)', gradFrom: 'var(--color-gov-gradient-from)', gradTo: 'var(--color-gov-gradient-to)' }
const Fn = { title: "'Saira Expanded', sans-serif", body: "'Open Sans', sans-serif", mono: "'Fira Code', monospace" }
const alpha = (c: string, a: number) => `color-mix(in srgb, ${c} ${Math.round(a * 100)}%, transparent)`

/* ─── Junction Lines SVG ─── */
function JunctionLines({ style }: { style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 320 200" fill="none" style={{ opacity: 0.12, ...style }}>
      <path d="M0 60H100C120 60 120 60 140 40L200 40H320" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
      <path d="M0 60H100C120 60 120 60 140 80L200 80H320" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
      <path d="M0 120H60C80 120 80 120 100 100L160 100H320" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
      <path d="M0 120H60C80 120 80 120 100 140L160 140H320" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
    </svg>
  )
}

function Section({ n, title, desc, children }: { n: string; title: string; desc: string; children: ReactNode }) {
  return (
    <section style={{ marginBottom: 44 }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: C.azulClaro, fontFamily: Fn.title, marginBottom: 6 }}>{n}</div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: C.cinzaEscuro, margin: '0 0 4px', fontFamily: Fn.title, letterSpacing: '0.5px' }}>{title}</h2>
      <p style={{ fontSize: 14, color: C.cinzaChumbo, margin: '0 0 20px', lineHeight: 1.55, fontFamily: Fn.body }}>{desc}</p>
      {children}
    </section>
  )
}

function DSCard({ children, s, mob: m }: { children: ReactNode; s?: React.CSSProperties; mob?: boolean }) {
  return (
    <div style={{ background: C.cardBg, borderRadius: '12px 12px 12px 24px', border: `1px solid ${C.cardBorder}`, padding: m ? 16 : 28, boxShadow: '0 1px 3px rgba(0,75,155,.04),0 4px 14px rgba(0,75,155,.03)', ...s }}>
      {children}
    </div>
  )
}

/* ─── Banner Padrão de Página (modelo da Overview) ─── */
function BannerPadrao() {
  return (
    <div style={{ background: `linear-gradient(135deg, ${C.gradFrom} 0%, ${C.gradTo} 100%)`, padding: '48px 40px 44px', position: 'relative', overflow: 'hidden', borderRadius: 12 }}>
      <JunctionLines style={{ position: 'absolute', top: -10, right: -20, width: 400, height: 250 }} />
      <div style={{ position: 'relative' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 20, padding: '5px 14px', fontSize: 11, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: C.amareloOuro, fontFamily: Fn.title, marginBottom: 16 }}>
          <LayoutGrid size={14} color={C.amareloOuro} /> Visão Geral
        </div>
        <h2 style={{ fontSize: 44, fontWeight: 700, color: '#fff', margin: '0 0 10px', fontFamily: Fn.title, lineHeight: 1.1 }}>
          Design System<br /><span style={{ color: C.amareloOuro }}>FIPS</span>
        </h2>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.69)', lineHeight: 1.6, maxWidth: 700, margin: '0 0 20px', fontFamily: Fn.body }}>
          Sistema de design unificado da Ferrovia Interna do Porto de Santos. Componentes, tokens e padrões para construir aplicações consistentes, acessíveis e com identidade ferroviária.
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', fontSize: 12, fontWeight: 600, color: '#fff', background: 'rgba(0,198,76,0.18)', border: '1px solid rgba(0,198,76,0.30)', borderRadius: 20, fontFamily: Fn.body }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.verdeFloresta }} />v0.4.2
          </span>
          {['14 componentes', 'React + Tailwind'].map(t => (
            <span key={t} style={{ padding: '4px 12px', fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.75)', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20, fontFamily: Fn.body }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Banner de Página com Badges ─── */
function BannerPaginaComBadges() {
  return (
    <div style={{ background: `linear-gradient(135deg, ${C.gradFrom} 0%, ${C.gradTo} 100%)`, padding: '48px 40px 44px', position: 'relative', overflow: 'hidden', borderRadius: 12 }}>
      <JunctionLines style={{ position: 'absolute', top: -10, right: -20, width: 400, height: 250 }} />
      <div style={{ position: 'relative' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 20, padding: '5px 14px', fontSize: 11, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: C.amareloOuro, fontFamily: Fn.title, marginBottom: 16 }}>
          <LayoutGrid size={14} color={C.amareloOuro} /> Módulo Suprimentos
        </div>
        <h2 style={{ fontSize: 44, fontWeight: 700, color: '#fff', margin: '0 0 10px', fontFamily: Fn.title, lineHeight: 1.1 }}>
          Painel de <span style={{ color: C.amareloOuro }}>Requisições</span>
        </h2>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.69)', lineHeight: 1.6, maxWidth: 700, margin: '0 0 20px', fontFamily: Fn.body }}>
          Gestão completa de compras e requisições do módulo Suprimentos FIPS. Acompanhe status, prioridades e prazos em tempo real.
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { label: 'primário', hex: '#004B9B', dot: '#004B9B' },
            { label: 'destaque', hex: '#F6921E', dot: '#F6921E' },
            { label: 'sucesso', hex: '#00C64C', dot: '#00C64C' },
            { label: 'perigo', hex: '#DC3545', dot: '#DC3545' },
            { label: 'inverso', hex: '#002A68', dot: '#002A68' },
            { label: 'realce', hex: '#FDC24E', dot: '#FDC24E' },
          ].map(b => (
            <span key={b.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.85)', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 20, fontFamily: Fn.body }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: b.dot, flexShrink: 0 }} />
              {b.label} <span style={{ fontFamily: Fn.mono, fontSize: 10, color: 'rgba(255,255,255,0.50)' }}>{b.hex}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Banner de Conteúdo (PageHeader): compacto, ação à direita ───
   O preview é o componente do pacote. A página já tem o h1 no topo, então o título é h2. */
function BannerConteudo1() {
  return (
    <PageHeader
      headingLevel={2}
      icon={<FileDown size={20} strokeWidth={1.6} aria-hidden />}
      title="Sistema de Requisições"
      description="Gestão de compras e requisições do módulo Suprimentos · FIPS"
      actions={
        <Button variant="accent" size="sm">
          <Plus strokeWidth={2.5} aria-hidden /> Nova Solicitação
        </Button>
      }
    />
  )
}

/* ─── Banner de Fluxo (PageHeader com stats): chips de status e KPIs ─── */
function BannerConteudo2() {
  const stats = [
    { label: 'TOTAL', value: '1012', dotColor: C.verdeFloresta },
    { label: 'AGUARDANDO', value: '1004', dotColor: C.amareloEscuro },
    { label: 'APROVADOS', value: '8', dotColor: C.verdeFloresta },
    { label: 'ENTREGUES', value: '2', dotColor: C.danger },
  ]
  return (
    <PageHeader
      headingLevel={2}
      icon={<Send size={20} strokeWidth={1.6} aria-hidden />}
      title="Pedidos"
      description="Solicitação → Análise → Aprovação → Execução → Entrega"
      stats={stats}
      actions={
        <Button variant="accent" size="sm">
          <Plus strokeWidth={2.5} aria-hidden /> Novo pedido
        </Button>
      }
    />
  )
}

/* ─── Medida estreita: o banner muda pela largura do cartão, não pela da janela ─── */
function MedidaEstreita() {
  const acoes = (
    <>
      <Button variant="accent" size="sm">
        <Send aria-hidden /> Nova solicitação
      </Button>
      <Button variant="inverseOutline" size="sm">
        Exportar
      </Button>
    </>
  )
  const props = {
    headingLevel: 2 as const,
    icon: <FileDown size={20} strokeWidth={1.6} aria-hidden />,
    title: 'Acompanhamento das ações de sustentação',
    description: 'Acompanhe, filtre e trate os registros abertos de todas as áreas, com prazo, responsável e o histórico de cada ação da semana',
    actions: acoes,
  }
  const legenda = { margin: '8px 0 0', fontSize: 12, color: C.cinzaChumbo, fontFamily: Fn.body } as const
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 28, alignItems: 'flex-start' }}>
      <figure style={{ margin: 0, width: 'min(343px, 100%)' }}>
        <PageHeader {...props} />
        <figcaption style={legenda}>Cartão de 343px (celular com margem de 16px)</figcaption>
      </figure>
      <figure style={{ margin: 0, width: 'min(375px, 100%)' }}>
        <PageHeader {...props} edge="bleed" />
        <figcaption style={legenda}>edge="bleed" em 375px: sem raio, de borda a borda</figcaption>
      </figure>
    </div>
  )
}

const PAGEHEADER_PROPS: [string, string][] = [
  ['title', 'Título da página. Vira o h1. Aceita JSX, por exemplo uma palavra em var(--color-accent).'],
  ['description', 'Resumo abaixo do título, de 12px a 67% de branco e no máximo 840px de largura.'],
  ['icon', 'Ícone do tile (lucide). A cor (--color-accent) e o tamanho vêm do banner.'],
  ['eyebrow', 'Rótulo de seção em texto, acima do título, sem pílula. Não repita o nome do sistema.'],
  ['info', 'Elemento ao lado do título, por exemplo o ícone de ajuda "como funciona".'],
  ['actions', 'Botões size="sm", como filhos diretos (fragmento, sem div em volta). À direita; com o cartão abaixo de 560px, na última linha, lado a lado e com a mesma largura. Com mais de dois botões a linha quebra.'],
  ['actionsProps', 'Só data-*: vai para o slot de ações. Serve de âncora para o tutorial guiado.'],
  ['stats', 'Chips de contagem abaixo do resumo: [{ label, value, dotColor? }]. É o Banner de Fluxo.'],
  ['headingLevel', 'Nível do título, de 1 a 6. O padrão é 1. A página tem um h1 só: nos outros banners use 2.'],
  ['edge', '"card" (padrão) ou "bleed". Com bleed, abaixo de 560px de cartão o banner perde o raio e encosta nas bordas da tela. A margem lateral é do pai.'],
  ['demais props', 'data-*, aria-*, className, style, id e ref vão para a raiz do componente.'],
]

/* ─── Copyable code helpers (hardcoded hex, self-contained) ─── */

function codeBannerPagina() {
  return `// DS-FIPS — Banner de Pagina — Copy-paste ready

export function BannerDePagina() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, var(--color-gov-gradient-from) 0%, var(--color-gov-gradient-to) 100%)',
      padding: '48px 40px 44px',
      position: 'relative', overflow: 'hidden', borderRadius: 12,
    }}>
      <svg viewBox="0 0 320 200" fill="none" style={{ opacity: 0.12, position: 'absolute', top: -10, right: -20, width: 400, height: 250 }}>
        <path d="M0 60H100C120 60 120 60 140 40L200 40H320" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
        <path d="M0 60H100C120 60 120 60 140 80L200 80H320" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
        <path d="M0 120H60C80 120 80 120 100 100L160 100H320" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
        <path d="M0 120H60C80 120 80 120 100 140L160 140H320" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
      </svg>
      <div style={{ position: 'relative' }}>
        <h1 style={{ fontSize: 44, fontWeight: 700, color: '#fff', fontFamily: "'Saira Expanded', sans-serif", margin: '0 0 10px' }}>
          Design System <span style={{ color: '#FDC24E' }}>FIPS</span>
        </h1>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.69)', maxWidth: 700, lineHeight: 1.6, fontFamily: "'Open Sans', sans-serif", margin: 0 }}>
          Sistema de design unificado da Ferrovia Interna do Porto de Santos.
        </p>
      </div>
    </div>
  );
}`
}

function codeBannerPaginaBadges() {
  return `// DS-FIPS — Banner de Pagina com Badges — Copy-paste ready

export function BannerPaginaComBadges() {
  const badges = [
    { label: 'primario', hex: '#004B9B' },
    { label: 'destaque', hex: '#F6921E' },
    { label: 'sucesso', hex: '#00C64C' },
    { label: 'perigo', hex: '#DC3545' },
  ];

  return (
    <div style={{
      background: 'linear-gradient(135deg, var(--color-gov-gradient-from) 0%, var(--color-gov-gradient-to) 100%)',
      padding: '48px 40px 44px',
      position: 'relative', overflow: 'hidden', borderRadius: 12,
    }}>
      <svg viewBox="0 0 320 200" fill="none" style={{ opacity: 0.12, position: 'absolute', top: -10, right: -20, width: 400, height: 250 }}>
        <path d="M0 60H100C120 60 120 60 140 40L200 40H320" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
        <path d="M0 60H100C120 60 120 60 140 80L200 80H320" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
      </svg>
      <div style={{ position: 'relative' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 20, padding: '5px 14px', fontSize: 11, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#FDC24E', fontFamily: "'Saira Expanded', sans-serif", marginBottom: 16 }}>
          Modulo Suprimentos
        </div>
        <h1 style={{ fontSize: 44, fontWeight: 700, color: '#fff', fontFamily: "'Saira Expanded', sans-serif", margin: '0 0 10px' }}>
          Painel de <span style={{ color: '#FDC24E' }}>Requisicoes</span>
        </h1>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.69)', maxWidth: 700, lineHeight: 1.6, fontFamily: "'Open Sans', sans-serif", margin: '0 0 16px' }}>
          Gestao completa de compras e requisicoes do modulo Suprimentos FIPS.
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {badges.map(b => (
            <span key={b.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.85)', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 20, fontFamily: "'Open Sans', sans-serif" }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: b.hex }} />
              {b.label} <span style={{ fontFamily: "'Fira Code', monospace", fontSize: 10, color: 'rgba(255,255,255,0.50)' }}>{b.hex}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}`
}

function codeBannerConteudo() {
  return `// DS-FIPS: Banner de Conteudo (copy-paste ready)
//
// Com o pacote, use o componente. A medida segue a largura do proprio cartao
// e a acao desce para a ultima linha abaixo de 560px:
//
//   import { PageHeader, Button } from '@fips-app/ds-fips'
//
//   <PageHeader
//     icon={<FileDown />}
//     title="Sistema de Requisicoes"
//     description="Gestao de compras e requisicoes do modulo Suprimentos"
//     actions={<Button variant="accent" size="sm">+ Nova Solicitacao</Button>}
//   />
//
// Sem o pacote, use a versao abaixo. Ela le os mesmos tokens do DS
// (--fips-banner-*, --color-accent, --font-heading): copie-os junto se o app nao os tiver.
// Esta versao nao troca de medida em 375px; la, o componente do pacote e o caminho.

export function BannerConteudo() {
  return (
    <div style={{
      position: 'relative', overflow: 'hidden',
      background: 'var(--fips-banner-content-bg)',
      boxShadow: 'var(--fips-banner-content-shadow)',
      border: '1px solid var(--fips-banner-content-border-color)',
      borderRadius: '12px 12px 12px 24px',
      padding: '22px 26px',
    }}>
      <svg viewBox="0 0 320 200" fill="none" aria-hidden style={{ position: 'absolute', top: -10, right: -20, width: 360, height: 200, pointerEvents: 'none', opacity: 'var(--fips-banner-junction-opacity)' }}>
        <path d="M0 60H100C120 60 120 60 140 40L200 40H320" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
        <path d="M0 60H100C120 60 120 60 140 80L200 80H320" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
        <path d="M0 120H60C80 120 80 120 100 100L160 100H320" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
        <path d="M0 120H60C80 120 80 120 100 140L160 140H320" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
      </svg>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 11, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--color-accent)',
          background: 'color-mix(in srgb, var(--color-accent) 10%, transparent)',
          border: '1px solid color-mix(in srgb, var(--color-accent) 19%, transparent)',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        </div>
        <div style={{ flex: '1 1 256px', minWidth: 0 }}>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: 21, fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.2px', color: '#fff' }}>Sistema de Requisicoes</h1>
          <p style={{ margin: '4px 0 0', maxWidth: 840, fontSize: 12, lineHeight: 1.4, color: 'rgba(255,255,255,0.67)' }}>Gestao de compras e requisicoes do modulo Suprimentos</p>
        </div>
        <button style={{ background: '#F6921E', color: '#fff', border: 'none', borderRadius: 6, height: 30, padding: '0 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
          + Nova Solicitacao
        </button>
      </div>
    </div>
  );
}`
}

function codeBannerFluxo() {
  return `// DS-FIPS: Banner de Fluxo com Status (copy-paste ready)
//
// Com o pacote, use o componente com stats:
//
//   import { PageHeader, Button } from '@fips-app/ds-fips'
//
//   <PageHeader
//     icon={<Send />}
//     title="Pedidos"
//     description="Solicitacao > Analise > Aprovacao > Execucao > Entrega"
//     stats={[{ label: 'TOTAL', value: 1012, dotColor: '#00C64C' }]}
//     actions={<Button variant="accent" size="sm">+ Novo pedido</Button>}
//   />
//
// Sem o pacote, use a versao abaixo. Mesmos tokens do Banner de Conteudo.

export function BannerFluxo() {
  const stats = [
    { label: 'TOTAL', value: '1012', color: '#00C64C' },
    { label: 'AGUARDANDO', value: '1004', color: '#F6921E' },
    { label: 'APROVADOS', value: '8', color: '#00C64C' },
    { label: 'ENTREGUES', value: '2', color: '#DC3545' },
  ];

  return (
    <div style={{
      position: 'relative', overflow: 'hidden',
      background: 'var(--fips-banner-content-bg)',
      boxShadow: 'var(--fips-banner-content-shadow)',
      border: '1px solid var(--fips-banner-content-border-color)',
      borderRadius: '12px 12px 12px 24px',
      padding: '22px 26px',
    }}>
      <svg viewBox="0 0 320 200" fill="none" aria-hidden style={{ position: 'absolute', top: -10, right: -20, width: 360, height: 200, pointerEvents: 'none', opacity: 'var(--fips-banner-junction-opacity)' }}>
        <path d="M0 60H100C120 60 120 60 140 40L200 40H320" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
        <path d="M0 60H100C120 60 120 60 140 80L200 80H320" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
        <path d="M0 120H60C80 120 80 120 100 100L160 100H320" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
        <path d="M0 120H60C80 120 80 120 100 140L160 140H320" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
      </svg>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ flex: '1 1 256px', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 11, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--color-accent)',
              background: 'color-mix(in srgb, var(--color-accent) 10%, transparent)',
              border: '1px solid color-mix(in srgb, var(--color-accent) 19%, transparent)',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </div>
            <div style={{ minWidth: 0 }}>
              <h1 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: 21, fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.2px', color: '#fff' }}>Pedidos</h1>
              <p style={{ margin: '4px 0 0', maxWidth: 840, fontSize: 12, lineHeight: 1.4, color: 'rgba(255,255,255,0.67)' }}>Solicitacao &rarr; Analise &rarr; Aprovacao &rarr; Execucao &rarr; Entrega</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10, paddingLeft: 60 }}>
            {stats.map(s => (
              <span key={s.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.75)', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.color }} />
                {s.label} <strong style={{ color: '#fff' }}>{s.value}</strong>
              </span>
            ))}
          </div>
        </div>
        <button style={{ background: '#F6921E', color: '#fff', border: 'none', borderRadius: 6, height: 30, padding: '0 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
          + Novo pedido
        </button>
      </div>
    </div>
  );
}`
}

/* ─── Página ─── */
export default function HeroBannerDoc() {
  const [w, setW] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)
  useEffect(() => { const h = () => setW(window.innerWidth); window.addEventListener('resize', h); return () => window.removeEventListener('resize', h) }, [])
  const mob = w < 640

  return (
    <PlaygroundProvider>
    <div style={{ minHeight: '100vh', background: "var(--color-surface-muted)", fontFamily: Fn.body, color: C.cinzaEscuro }}>

      <div style={{ padding: mob ? '24px 16px 40px' : '36px 40px 60px', maxWidth: 1100, margin: '0 auto' }}>

        {/* Topo da página: o próprio PageHeader, com o h1 único da página. */}
        <PageHeader
          style={{ marginBottom: 36 }}
          icon={<PanelTop size={20} strokeWidth={1.6} aria-hidden />}
          title="Banner"
          description="Catálogo de banners padronizados do DS-FIPS. Três variantes para cobrir desde landing pages até módulos operacionais com fluxos e KPIs. Degradê azul institucional como fundo obrigatório."
        />

        <div style={{ marginBottom: 44 }}>
          <RuleCards mob={mob} cards={[
            { icon: <ShieldCheck size={20} color="var(--color-gov-azul-profundo)" />, color: 'var(--color-gov-azul-profundo)', bg: alpha(C.azulProfundo, 0.03), tag: 'REGRA 1', title: 'Banner de Página', desc: 'Hero completo com título grande, descrição, badges e arte decorativa. Usado em landing pages, visões gerais de módulo e páginas de documentação standalone que precisam de impacto visual.' },
            { icon: <AlertTriangle size={20} color="#F6921E" />, color: '#F6921E', bg: '#F6921E08', tag: 'REGRA 2', title: 'Banner de Conteúdo', desc: 'Faixa compacta de uma linha com ícone à esquerda, título + subtítulo e botão de ação à direita. É o PageHeader do pacote: o banner de cada página, com o h1. Ideal para cabeçalhos de módulos operacionais como Requisições, Cadastros ou qualquer tela com ação primária.' },
            { icon: <ArrowUpFromLine size={20} color="var(--color-gov-azul-escuro)" />, color: 'var(--color-gov-azul-escuro)', bg: alpha(C.azulEscuro, 0.03), tag: 'REGRA 3', title: 'Banner de Fluxo', desc: 'Variante com badges de status e cadeia de etapas visível (ex: Solicitação → Aprovação → Entrega). Usado em módulos com fluxo sequencial e KPIs por etapa, como Pedidos, Produção e Aprovações.' },
          ]} />
        </div>

        {/* 01 — Banner de Página (sem badges) */}
        <Section n="01" title="Banner de Página" desc="Versão limpa do hero principal. Badge de seção no topo, título em Saira Expanded 44px, descrição em Open Sans e junction lines decorativas. Clique no banner para copiar o código.">
          <Copyable label="Banner de Página" code={codeBannerPagina()} preview={<BannerPadrao />}>
            <DSCard mob={mob} s={{ padding: 0, overflow: 'hidden' }}>
              <BannerPadrao />
            </DSCard>
          </Copyable>
        </Section>

        {/* 02 — Banner de Página com Badges */}
        <Section n="02" title="Banner de Página com Badges" desc="Variante do hero com badges informativos no rodapé (versão, contagem, stack, cores). Clique no banner para copiar o código.">
          <Copyable label="Banner com Badges" code={codeBannerPaginaBadges()} preview={<BannerPaginaComBadges />}>
            <DSCard mob={mob} s={{ padding: 0, overflow: 'hidden' }}>
              <BannerPaginaComBadges />
            </DSCard>
          </Copyable>
        </Section>

        {/* 03 — Banner de Conteúdo */}
        <Section n="03" title="Banner de Conteúdo" desc="O banner de página dos apps, renderizado pelo PageHeader do pacote: tile de 44px, título de 21px e ações à direita. Abaixo de 560px de largura do cartão a medida encolhe e as ações descem para a última linha. Aqui o título é h2 porque esta página já tem o h1. Clique para copiar o código.">
          <Copyable label="Banner de Conteúdo" code={codeBannerConteudo()} preview={<BannerConteudo1 />} fullWidth>
            <DSCard mob={mob} s={{ padding: 0, overflow: 'hidden' }}>
              <BannerConteudo1 />
            </DSCard>
          </Copyable>
        </Section>

        {/* 04 — Banner de Fluxo */}
        <Section n="04" title="Banner de Fluxo" desc="O mesmo PageHeader com a prop stats: cadeia de etapas no resumo e chips de status com KPIs por etapa. Clique para copiar o código.">
          <Copyable label="Banner de Fluxo" code={codeBannerFluxo()} preview={<BannerConteudo2 />} fullWidth>
            <DSCard mob={mob} s={{ padding: 0, overflow: 'hidden' }}>
              <BannerConteudo2 />
            </DSCard>
          </Copyable>
        </Section>

        {/* 05 PageHeader: como usar */}
        <Section n="05" title="PageHeader: como usar" desc="Um componente só para o banner de cada página. A medida segue a largura do próprio cartão (container query de 560px, sem JavaScript): o mesmo banner serve a uma tela de 1440px e a uma coluna de 343px.">
          <div style={{ display: 'grid', gap: 24 }}>
            <div style={{ borderRadius: 10, border: `1px solid ${C.cardBorder}`, background: C.cardBg }}>
              <pre style={{ margin: 0, padding: '14px 18px', fontSize: 12, lineHeight: 1.6, fontFamily: Fn.mono, color: C.cinzaEscuro, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{`import { PageHeader, Button } from '@fips-app/ds-fips'

<PageHeader
  icon={<FileDown />}
  title="Sistema de Requisições"
  description="Gestão de compras e requisições do módulo Suprimentos"
  actions={<Button variant="accent" size="sm">Nova solicitação</Button>}
  actionsProps={{ 'data-tour-step': 'banner-acoes' }}
  data-tour-step="banner"
/>`}</pre>
            </div>

            <MedidaEstreita />

            <div className="overflow-hidden rounded-2xl border border-[var(--color-border)]">
              <div>
                <table className="w-full table-fixed text-sm">
                  <colgroup>
                    <col style={{ width: '9.5rem' }} />
                    <col />
                  </colgroup>
                  <thead>
                    <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)]">
                      <th className="px-4 py-3 text-left font-semibold text-[var(--color-fg)]">Prop</th>
                      <th className="px-4 py-3 text-left font-semibold text-[var(--color-fg)]">Uso</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {PAGEHEADER_PROPS.map(([prop, uso]) => (
                      <tr key={prop} className="bg-[var(--color-surface)]">
                        <td className="break-words px-4 py-3 align-top font-mono text-xs text-[var(--color-fg)]">{prop}</td>
                        <td className="break-words px-4 py-3 text-[var(--color-fg-muted)]">{uso}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <ul style={{ margin: 0, paddingLeft: 20, display: 'grid', gap: 8, fontSize: 14, lineHeight: 1.55, color: C.cinzaChumbo, fontFamily: Fn.body }}>
              <li>PageHeader ou PageHero? O PageHeader é o banner de cada página do app, com o h1 da tela. O PageHero é a faixa de módulo e de Home, com a arte do trem.</li>
              <li>PatternPanelHero continua exportado, como apelido do PageHeader, com as props de antes (subtitle, badge, badgePill, action, stats, compact, dataTutorial). O título dele agora é h1. Em código novo, use o PageHeader.</li>
              <li>O componente ocupa a largura do pai. Não o ponha dentro de um flex em linha nem de um bloco que encolhe ao conteúdo.</li>
              <li>Os estilos moram nas classes .fips-page-header de globals.css. Quem copia o arquivo para um app copia essas regras junto (exports/pattern-panel-hero/page-header.css).</li>
              <li>Não sobrescreva cor, raio ou medida do banner por classe do app. Se faltar uma opção, ela entra aqui.</li>
            </ul>
          </div>
        </Section>

        <CodePlayground />

        <CodeExportSection items={[
          {
            label: 'Banner de Pagina',
            description: 'Hero completo com titulo grande, descricao e junction lines decorativas.',
            code: `/* Banner de Pagina — DS-FIPS
   Hero principal para landing pages e visoes gerais de modulo.
   Degradê azul institucional obrigatorio.

   CSS vars:
   --color-gov-gradient-from: #004B9B
   --color-gov-gradient-to: #002A68
   Fontes: Saira Expanded 44px 700 (titulo), Open Sans 16px (descricao)
*/

function BannerPagina({ title, description, badges }: {
  title: React.ReactNode
  description: string
  badges?: { label: string; color: string }[]
}) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, var(--color-gov-gradient-from) 0%, var(--color-gov-gradient-to) 100%)',
      padding: '48px 40px 44px',
      position: 'relative', overflow: 'hidden', borderRadius: 12,
    }}>
      {/* Junction Lines SVG decorativas (opacity 0.12) */}
      <svg viewBox="0 0 320 200" fill="none" style={{ opacity: 0.12, position: 'absolute', top: -10, right: -20, width: 400, height: 250 }}>
        <path d="M0 60H100C120 60 120 60 140 40L200 40H320" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
        <path d="M0 60H100C120 60 120 60 140 80L200 80H320" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
        <path d="M0 120H60C80 120 80 120 100 100L160 100H320" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
        <path d="M0 120H60C80 120 80 120 100 140L160 140H320" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
      </svg>
      <div style={{ position: 'relative' }}>
        <h1 style={{ fontSize: 44, fontWeight: 700, color: '#fff', fontFamily: "'Saira Expanded', sans-serif" }}>
          {title}
        </h1>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.69)', maxWidth: 700 }}>
          {description}
        </p>
      </div>
    </div>
  )
}`,
          },
          {
            label: 'Banner de Conteudo (compacto)',
            description: 'Faixa compacta com icone + titulo + CTA para cabecalhos de modulos operacionais.',
            code: `/* Banner de Conteudo — DS-FIPS
   Faixa compacta para modulos operacionais.
   Icone 44x44 r11 + titulo Saira 21px + CTA accent.

   CSS vars:
   --color-gov-gradient-from / --color-gov-gradient-to
   Dark mode: usa #1e2a3a -> #162030 -> #1a2840
*/

function BannerConteudo({ icon, title, subtitle, ctaLabel, onCta }: {
  icon: React.ReactNode
  title: string
  subtitle: string
  ctaLabel: string
  onCta: () => void
}) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, var(--color-gov-gradient-from) 0%, var(--color-gov-gradient-to) 60%, #001A4A 100%)',
      borderRadius: '12px 12px 12px 24px',
      padding: '22px 26px',
      display: 'flex', alignItems: 'center', gap: 16,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 11,
        background: 'color-mix(in srgb, var(--color-accent) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--color-accent) 19%, transparent)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <h2 style={{ fontSize: 21, fontWeight: 700, color: '#fff', fontFamily: "'Saira Expanded',sans-serif", margin: 0 }}>
          {title}
        </h2>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.67)', margin: '4px 0 0' }}>{subtitle}</p>
      </div>
      <button onClick={onCta} style={{
        background: '#F6921E', color: '#fff', border: 'none',
        borderRadius: 6, padding: '6px 14px', fontSize: 12, fontWeight: 600,
      }}>
        {ctaLabel}
      </button>
    </div>
  )
}`,
          },
        ]} />

        <div style={{ textAlign: 'center', padding: '20px 0 0', borderTop: `1px solid ${C.cardBorder}`, marginTop: 20 }}>
          <span style={{ fontSize: 12, color: C.cinzaChumbo, letterSpacing: '0.5px', fontFamily: Fn.title, fontWeight: 400 }}>DS-FIPS v0.4.2 · Ferrovia Interna do Porto de Santos · Excelência sobre trilhos · {new Date().getFullYear()}</span>
        </div>
      </div>
    </div>
    </PlaygroundProvider>
  )
}
