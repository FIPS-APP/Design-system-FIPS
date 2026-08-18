import { useState, useEffect, type ReactNode } from 'react'
import { LayoutGrid, FileDown, Send, Plus, ShieldCheck, AlertTriangle, ArrowUpFromLine } from 'lucide-react'
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
      <path d="M0 60H100C120 60 120 60 140 40L200 40H320" stroke="var(--color-junction-stroke)" strokeWidth="6" strokeLinecap="round" />
      <path d="M0 60H100C120 60 120 60 140 80L200 80H320" stroke="var(--color-junction-stroke)" strokeWidth="6" strokeLinecap="round" />
      <path d="M0 120H60C80 120 80 120 100 100L160 100H320" stroke="var(--color-junction-stroke)" strokeWidth="6" strokeLinecap="round" />
      <path d="M0 120H60C80 120 80 120 100 140L160 140H320" stroke="var(--color-junction-stroke)" strokeWidth="6" strokeLinecap="round" />
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
        <h1 style={{ fontSize: 44, fontWeight: 700, color: '#fff', margin: '0 0 10px', fontFamily: Fn.title, lineHeight: 1.1 }}>
          Design System<br /><span style={{ color: C.amareloOuro }}>FIPS</span>
        </h1>
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
        <h1 style={{ fontSize: 44, fontWeight: 700, color: '#fff', margin: '0 0 10px', fontFamily: Fn.title, lineHeight: 1.1 }}>
          Painel de <span style={{ color: C.amareloOuro }}>Requisições</span>
        </h1>
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

/* ─── Banner de Conteúdo — Opção 1 (compacto, CTA à direita) ─── */
/* Renderiza o composite governado: a doc mostra o componente real, não uma réplica. */
function BannerConteudo1() {
  return (
    <PageHeader
      title="Sistema de Requisições"
      description="Gestão de compras e requisições do módulo Suprimentos · FIPS"
      icon={<FileDown size={20} color="var(--color-accent)" aria-hidden />}
      actions={
        <Button variant="accent" size="sm">
          <Plus size={13} strokeWidth={2.5} aria-hidden /> Nova Solicitação
        </Button>
      }
    />
  )
}

/* ─── Banner de Conteúdo — Opção 2 (fluxo com status badges) ─── */
function BannerConteudo2() {
  return (
    <PageHeader
      title="Pedidos"
      description="Solicitação → Análise → Aprovação → Execução → Entrega"
      icon={<Send size={20} color="var(--color-accent)" aria-hidden />}
      stats={[
        { label: 'TOTAL', value: '1012', dotColor: C.verdeFloresta },
        { label: 'AGUARDANDO', value: '1004', dotColor: C.amareloEscuro },
        { label: 'APROVADOS', value: '8', dotColor: C.verdeFloresta },
        { label: 'ENTREGUES', value: '2', dotColor: C.danger },
      ]}
      actions={
        <Button variant="accent" size="sm">
          <Plus size={13} strokeWidth={2.5} aria-hidden /> Novo pedido
        </Button>
      }
    />
  )
}

export default function HeroBannerDoc() {
  const [w, setW] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)
  useEffect(() => { const h = () => setW(window.innerWidth); window.addEventListener('resize', h); return () => window.removeEventListener('resize', h) }, [])
  const mob = w < 640

  return (
    <div style={{ minHeight: '100vh', background: "var(--color-surface-muted)", fontFamily: Fn.body, color: C.cinzaEscuro }}>

      {/* HEADER HERO */}
      <header style={{ background: `linear-gradient(135deg, ${C.gradFrom} 0%, ${C.gradTo} 100%)`, padding: mob ? '32px 20px' : '48px 40px 44px', position: 'relative', overflow: 'hidden' }}>
        <JunctionLines style={{ position: 'absolute', top: -10, right: -20, width: mob ? 250 : 400, height: 250 }} />
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 20, padding: '5px 14px', fontSize: 11, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: C.amareloOuro, fontFamily: Fn.title, marginBottom: 16 }}>
            <LayoutGrid size={14} color={C.amareloOuro} /> Design System FIPS
          </div>
          <h1 style={{ fontSize: mob ? 30 : 44, fontWeight: 700, color: C.branco, margin: '0 0 10px', fontFamily: Fn.title }}>Banner</h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.69)', lineHeight: 1.6, maxWidth: 700, margin: 0, fontFamily: Fn.body }}>
            Catálogo de banners padronizados do DS-FIPS. Três variantes para cobrir desde landing pages até módulos operacionais com fluxos e KPIs. Degradê azul institucional como fundo obrigatório.
          </p>
        </div>
      </header>

      <div style={{ padding: mob ? '24px 16px 40px' : '36px 40px 60px', maxWidth: 1100, margin: '0 auto' }}>

        <div style={{ marginBottom: 44 }}>
          <RuleCards mob={mob} cards={[
            { icon: <ShieldCheck size={20} color="var(--color-gov-azul-profundo)" />, color: 'var(--color-gov-azul-profundo)', bg: alpha(C.azulProfundo, 0.03), tag: 'REGRA 1', title: 'Banner de Página', desc: 'Hero completo com título grande, descrição, badges e arte decorativa. Usado em landing pages, visões gerais de módulo e páginas de documentação standalone que precisam de impacto visual.' },
            { icon: <AlertTriangle size={20} color="#F6921E" />, color: '#F6921E', bg: '#F6921E08', tag: 'REGRA 2', title: 'Banner de Conteúdo', desc: 'Faixa compacta de uma linha com ícone à esquerda, título + subtítulo e botão de ação à direita. Ideal para cabeçalhos de módulos operacionais como Requisições, Cadastros ou qualquer tela com ação primária.' },
            { icon: <ArrowUpFromLine size={20} color="var(--color-gov-azul-escuro)" />, color: 'var(--color-gov-azul-escuro)', bg: alpha(C.azulEscuro, 0.03), tag: 'REGRA 3', title: 'Banner de Fluxo', desc: 'Variante com badges de status e cadeia de etapas visível (ex: Solicitação → Aprovação → Entrega). Usado em módulos com fluxo sequencial e KPIs por etapa, como Pedidos, Produção e Aprovações.' },
          ]} />
        </div>

        {/* 01 — Banner de Página (sem badges) */}
        <Section n="01" title="Banner de Página" desc="Versão limpa do hero principal. Badge de seção no topo, título em Saira Expanded 44px, descrição em Open Sans e junction lines decorativas.">
          <DSCard mob={mob} s={{ padding: 0, overflow: 'hidden' }}>
            <BannerPadrao />
          </DSCard>
        </Section>

        {/* 02 — Banner de Página com Badges */}
        <Section n="02" title="Banner de Página com Badges" desc="Variante do hero com badges informativos no rodapé (versão, contagem, stack, cores).">
          <DSCard mob={mob} s={{ padding: 0, overflow: 'hidden' }}>
            <BannerPaginaComBadges />
          </DSCard>
        </Section>

        {/* 03 — Banner de Conteúdo */}
        <Section n="03" title="Banner de Conteúdo" desc="Faixa compacta para cabeçalhos de módulos operacionais. Ícone 44x44, título Saira 21px e botão CTA accent (#F6921E).">
          <DSCard mob={mob} s={{ padding: 0, overflow: 'hidden' }}>
            <BannerConteudo1 />
          </DSCard>
        </Section>

        {/* 04 — Banner de Fluxo */}
        <Section n="04" title="Banner de Fluxo" desc="Variante com cadeia de etapas visível e badges de status com KPIs por etapa.">
          <DSCard mob={mob} s={{ padding: 0, overflow: 'hidden' }}>
            <BannerConteudo2 />
          </DSCard>
        </Section>

        <div style={{ textAlign: 'center', padding: '20px 0 0', borderTop: `1px solid ${C.cardBorder}`, marginTop: 20 }}>
          <span style={{ fontSize: 12, color: C.cinzaChumbo, letterSpacing: '0.5px', fontFamily: Fn.title, fontWeight: 400 }}>DS-FIPS v0.4.2 · Ferrovia Interna do Porto de Santos · Excelência sobre trilhos · {new Date().getFullYear()}</span>
        </div>
      </div>
    </div>
  )
}
