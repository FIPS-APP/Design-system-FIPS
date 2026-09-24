import { useState, useRef, useEffect } from 'react'
import { ShieldCheck, AlertTriangle, ArrowUpFromLine, LayoutGrid } from 'lucide-react'
import { CodeExportSection } from '../../components/CodeExport'
import { PlaygroundProvider, Copyable, CodePlayground } from '../../components/CodePlayground'
import { RuleCards } from '../../components/RuleCards'
import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import { PageHero } from '../../../composites/PageHero'
import { cn } from '../../../lib/cn'

const HOME_BACKGROUND = '/backgrounds/app-shell-home-trains.png'

// ─── Mini demo interativa ────────────────────────────────────────────────────

function HeroHeaderDemo() {
  const [scrolled, setScrolled] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => setScrolled(el.scrollTop > 60)
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  const glass = !scrolled

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] shadow-[var(--shadow-card)]">
      {/* Frame do app */}
      <div className="relative h-[420px]">
        {/* Scrollable content */}
        <div ref={scrollRef} className="h-full overflow-y-auto overscroll-contain">

          {/* Hero com fundo */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0">
              <img
                src={HOME_BACKGROUND}
                alt=""
                className="h-full w-full object-cover object-center"
                draggable={false}
              />
              <div className="absolute inset-0 bg-[linear-gradient(118deg,rgba(0,19,56,0.94)_0%,rgba(0,63,138,0.84)_44%,rgba(0,144,208,0.60)_100%)]" />
            </div>

            <div className="relative z-10 px-6 pt-10 pb-14 text-center">
              <Badge className="mb-4 border-0 bg-[rgba(246,146,30,0.95)] text-white shadow-[0_8px_20px_rgba(246,146,30,0.28)]">
                Sistema de Exemplo
              </Badge>
              <h2 className="text-2xl font-bold text-white">
                Hero com <span className="text-[#fdc24e]">Header Adaptativo</span>
              </h2>
              <p className="mt-3 text-sm text-white/75 max-w-xs mx-auto">
                Role a página para ver o cabeçalho transicionar de vidro para branco.
              </p>
              <div className="mt-6 flex gap-3 justify-center">
                <Button variant="accent" size="sm">Ação Primária</Button>
                <Button variant="inverseOutline" size="sm">
                  Secundária
                </Button>
              </div>
            </div>
          </div>

          {/* Conteúdo branco abaixo do hero */}
          <div className="space-y-4 bg-[#f3f6fb] p-6 min-h-[300px]">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl bg-white p-4 shadow-sm">
                <div className="h-3 w-1/3 rounded bg-gray-200 mb-2" />
                <div className="h-2 w-2/3 rounded bg-gray-100" />
              </div>
            ))}
          </div>
        </div>

        {/* Badge de estado */}
        <div className="pointer-events-none absolute bottom-4 right-4 z-30">
          <span className={cn(
            'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold shadow-lg transition-all duration-300',
            glass
              ? 'bg-[#002a68] text-white'
              : 'bg-white text-[#002a68] border border-gray-200',
          )}>
            <span className={cn('h-2 w-2 rounded-full', glass ? 'bg-[#fdc24e]' : 'bg-[#00c64c]')} />
            {glass ? 'Glass (topo)' : 'Branco (rolado)'}
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── Copyable code helpers (hardcoded hex, self-contained) ──────────────────

function codeHeroHeaderGlass() {
  return `// DS-FIPS — Hero Header Glass-to-White — Copy-paste ready
import { useState, useRef, useEffect } from 'react'

export function HeroWithAdaptiveHeader() {
  const [scrolled, setScrolled] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => setScrolled(el.scrollTop > 60)
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div ref={scrollRef} style={{ height: '100vh', overflowY: 'auto' }}>
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        height: 56, padding: '0 24px',
        display: 'flex', alignItems: 'center',
        transition: 'all 300ms ease',
        ...(scrolled ? {
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(4px)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          color: '#333B41',
        } : {
          background: 'rgba(255,255,255,0.07)',
          backdropFilter: 'blur(12px)',
          color: '#fff',
        }),
      }}>
        <span style={{ fontFamily: "'Saira Expanded', sans-serif", fontWeight: 700, fontSize: 14 }}>App FIPS</span>
      </header>

      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(118deg, rgba(0,19,56,0.94) 0%, rgba(0,63,138,0.84) 44%, rgba(0,144,208,0.60) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 10, padding: '40px 24px 56px', textAlign: 'center' }}>
          <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 20, background: 'rgba(246,146,30,0.95)', color: '#fff', fontSize: 12, fontWeight: 600 }}>
            Sistema de Exemplo
          </span>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginTop: 16, fontFamily: "'Saira Expanded', sans-serif" }}>
            Hero com <span style={{ color: '#FDC24E' }}>Header Adaptativo</span>
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', marginTop: 12, maxWidth: 320, margin: '12px auto 0' }}>
            Role a pagina para ver o cabecalho transicionar de vidro para branco.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
            <button style={{ background: '#F6921E', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Acao Primaria</button>
            <button style={{ background: 'transparent', color: '#fff', border: '1.5px solid rgba(255,255,255,0.5)', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Secundaria</button>
          </div>
        </div>
      </div>

      <div style={{ background: '#f3f6fb', padding: 24, minHeight: 300 }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ height: 12, width: '33%', borderRadius: 6, background: '#E2E8F0', marginBottom: 8 }} />
          <div style={{ height: 8, width: '66%', borderRadius: 6, background: '#F1F5F9' }} />
        </div>
        <div style={{ background: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ height: 12, width: '40%', borderRadius: 6, background: '#E2E8F0', marginBottom: 8 }} />
          <div style={{ height: 8, width: '55%', borderRadius: 6, background: '#F1F5F9' }} />
        </div>
      </div>
    </div>
  )
}`
}

function codePageHeroFaixa() {
  return `// DS-FIPS — PageHero Faixa de Modulo — Copy-paste ready

export function PageHeroFaixa() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #002A68 0%, #004B9B 100%)',
      position: 'relative', overflow: 'hidden', borderRadius: 12,
    }}>
      <div style={{ padding: '32px 24px' }}>
        <p style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'rgba(255,255,255,0.70)', margin: 0 }}>Exemplo</p>
        <h3 style={{ fontSize: 20, fontWeight: 600, color: '#fff', marginTop: 4, fontFamily: "'Saira Expanded', sans-serif", margin: '4px 0 0' }}>Faixa de modulo (PageHero)</h3>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.80)', marginTop: 8, maxWidth: 448, margin: '8px 0 0' }}>
          Gradiente institucional + imagem sutil a direita.
        </p>
      </div>
    </div>
  );
}`
}

// ─── Página ──────────────────────────────────────────────────────────────────

export default function HeroHeaderDoc() {
  return (
    <PlaygroundProvider>
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
          <h1 style={{ fontSize: 44, fontWeight: 700, color: '#fff', margin: '0 0 10px', fontFamily: "'Saira Expanded', sans-serif" }}>Hero</h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.69)', lineHeight: 1.6, maxWidth: 700, margin: 0, fontFamily: "'Open Sans', sans-serif" }}>
            Padrão da Home: barra superior da aplicação sobre o hero com vidro (glass) e transição para branco ao rolar — não confundir com o header da documentação (DocLayout). Nas demais rotas (módulos), use PageHero com faixa azul e trem sutil.
          </p>
        </div>
      </header>

      <div style={{ padding: '36px 40px 60px', maxWidth: 1100, margin: '0 auto' }}>

      <RuleCards cards={[
        { icon: <ShieldCheck size={20} color="var(--color-gov-azul-profundo)" />, color: 'var(--color-gov-azul-profundo)', bg: 'color-mix(in srgb, var(--color-gov-azul-profundo) 3%, transparent)', tag: 'REGRA 1', title: 'Header adaptativo glass-to-white', desc: 'Na Home, o header começa transparente com efeito vidro (glass) sobre a imagem do hero, criando imersão visual. Ao rolar a página, ele transiciona suavemente para fundo branco sólido com sombra.' },
        { icon: <AlertTriangle size={20} color="#F6921E" />, color: '#F6921E', bg: '#F6921E08', tag: 'REGRA 2', title: 'Exclusivo da página Home', desc: 'Este padrão de header glass só deve ser usado na Home do aplicativo. Todas as outras rotas (módulos, formulários, listagens) usam o header branco estático padrão — nunca aplique glass fora da Home.' },
        { icon: <ArrowUpFromLine size={20} color="var(--color-gov-azul-escuro)" />, color: 'var(--color-gov-azul-escuro)', bg: 'color-mix(in srgb, var(--color-gov-azul-escuro) 3%, transparent)', tag: 'REGRA 3', title: 'Transição suave ao rolar', desc: 'A mudança de glass para branco acontece quando o usuário rola além de 60px. A animação dura 300ms e é fluida. Isso garante que o header fique legível tanto sobre a imagem do hero quanto sobre o conteúdo claro abaixo.' },
      ]} />

      {/* PageHero — faixa de módulo */}
      <section style={{ marginTop: 36 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-gov-azul-escuro)', margin: '0 0 12px', fontFamily: "'Saira Expanded', sans-serif" }}>PageHero — faixa de módulo (não é este padrão)</h2>
        <p style={{ fontSize: 14, color: '#7B8C96', marginBottom: 16, lineHeight: 1.55 }}>
          Produção, Governança e demais telas internas usam esta faixa azul padrão — não o header glass da
          Home. A faixa é só o gradiente institucional: a arte de trem saiu do hero em 0.13.0. Clique para copiar o código.
        </p>
        <Copyable label="PageHero Faixa" code={codePageHeroFaixa()} preview={
          <div style={{ background: 'linear-gradient(135deg, #002A68 0%, #004B9B 100%)', borderRadius: 12, padding: '24px 20px', color: '#fff', fontFamily: "'Saira Expanded', sans-serif", fontSize: 14 }}>
            Faixa de Modulo (PageHero)
          </div>
        }>
          <div className="max-w-3xl overflow-hidden rounded-xl border border-[var(--color-border)] shadow-sm">
            <PageHero>
              <div className="px-6 py-8">
                <p className="text-xs font-medium uppercase tracking-wide text-white/70">Exemplo</p>
                <h3 className="mt-1 font-heading text-xl font-semibold text-white">Faixa de módulo (PageHero)</h3>
                <p className="mt-2 max-w-md text-sm text-white/80">
                  Gradiente institucional. Detalhes em Padrão: Dashboard.
                </p>
              </div>
            </PageHero>
          </div>
        </Copyable>
      </section>

      {/* Demo interativa */}
      <section style={{ marginTop: 36 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-gov-azul-escuro)', margin: '0 0 12px', fontFamily: "'Saira Expanded', sans-serif" }}>Demo interativa — role o conteúdo. Clique para copiar o código.</h2>
        <Copyable label="Hero Header Glass" code={codeHeroHeaderGlass()} preview={
          <div style={{ background: 'linear-gradient(135deg, #002A68, #004B9B)', borderRadius: 12, padding: '20px 16px', color: '#fff', fontFamily: "'Saira Expanded', sans-serif", fontSize: 13, textAlign: 'center' }}>
            <span style={{ color: '#FDC24E' }}>Glass-to-White</span> Header
          </div>
        }>
          <HeroHeaderDemo />
        </Copyable>
      </section>


      {/* Implementação */}
      <section style={{ marginTop: 36 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-gov-azul-escuro)', margin: '0 0 12px', fontFamily: "'Saira Expanded', sans-serif" }}>Implementação</h2>
        <p style={{ fontSize: 14, color: '#7B8C96', lineHeight: 1.55 }}>
          O padrão está implementado no <strong>fips-suprimentos</strong> (App.tsx + Home.tsx)
          e segue o mesmo layout do <strong>ApplicationShell</strong>.
          Copie o bloco acima como ponto de partida para novos produtos FIPS.
        </p>
      </section>

      {/* Regra de cores por fundo */}
      <section style={{ marginTop: 36 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-gov-azul-escuro)', margin: '0 0 12px', fontFamily: "'Saira Expanded', sans-serif" }}>Regra de cores por fundo</h2>
        <div className="overflow-hidden rounded-2xl border border-[var(--color-border)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)]">
                <th className="px-4 py-3 text-left font-semibold text-[var(--color-fg)]">Contexto</th>
                <th className="px-4 py-3 text-left font-semibold text-[var(--color-fg)]">Background do header</th>
                <th className="px-4 py-3 text-left font-semibold text-[var(--color-fg)]">Texto / ícones</th>
                <th className="px-4 py-3 text-left font-semibold text-[var(--color-fg)]">Logo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {[
                ['Home (topo, hero visível)', 'bg-white/7 + backdrop-blur-md', 'Branco (inverted)', 'Container branco'],
                ['Home (rolado, fundo branco)', 'bg-white/95 + backdrop-blur-sm', 'Cinza / azul normal', 'Container branco'],
                ['Outras páginas', 'bg-white sólido', 'Cinza / azul normal', 'Container branco'],
              ].map(([ctx, bg, text, logo]) => (
                <tr key={ctx} className="bg-[var(--color-surface)]">
                  <td className="px-4 py-3 font-medium text-[var(--color-fg)]">{ctx}</td>
                  <td className="px-4 py-3 font-mono text-xs text-[var(--color-fg-muted)]">{bg}</td>
                  <td className="px-4 py-3 text-[var(--color-fg-muted)]">{text}</td>
                  <td className="px-4 py-3 text-[var(--color-fg-muted)]">{logo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

        <CodePlayground />

        <CodeExportSection items={[
          {
            label: 'Hero Header Glass-to-White',
            description: 'Header adaptativo que transiciona de glass transparente para branco solido ao rolar.',
            code: `/* Hero Header — DS-FIPS
   Exclusivo da pagina Home. Transiciona de glass para branco ao rolar.
   Threshold: 60px de scroll.

   CSS vars: --color-border, --color-fg, --color-fg-muted
*/

import { useState, useEffect, useRef } from 'react'

function AdaptiveHeader() {
  const [scrolled, setScrolled] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => setScrolled(el.scrollTop > 60)
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      height: 56, padding: '0 24px',
      display: 'flex', alignItems: 'center',
      transition: 'all 300ms ease',
      // Glass state (topo, hero visivel)
      ...(scrolled ? {
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(4px)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        color: '#333B41',
      } : {
        background: 'rgba(255,255,255,0.07)',
        backdropFilter: 'blur(12px)',
        color: '#fff',
      }),
    }}>
      {/* Logo + Nav + Actions */}
    </header>
  )
}

/* Regra de cores por fundo:
   Home (topo):    bg-white/7 + blur-md  -> textos brancos
   Home (rolado):  bg-white/95 + blur-sm -> textos cinza/azul
   Outras paginas: bg-white solido       -> textos cinza/azul
*/`,
          },
        ]} />

        <div style={{ textAlign: 'center', padding: '20px 0 0', borderTop: '1px solid #E2E8F0', marginTop: 20 }}>
          <span style={{ fontSize: 12, color: '#7B8C96', letterSpacing: '0.5px', fontFamily: "'Saira Expanded', sans-serif", fontWeight: 400 }}>DS-FIPS v0.4.2 · Ferrovia Interna do Porto de Santos · Excelência sobre trilhos · {new Date().getFullYear()}</span>
        </div>
      </div>
    </div>
    </PlaygroundProvider>
  )
}
