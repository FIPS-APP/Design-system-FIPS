import type { CSSProperties } from 'react'
import { ShieldCheck, AlertTriangle, Layers, Ban, LayoutGrid, Home, LayoutDashboard, Palette, Component, BookOpen, FileText } from 'lucide-react'
import { RuleCards } from '../../components/RuleCards'
import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import { PageHeader } from '../../../components/composites/PageHeader'
import { DocHeaderStandardPreview } from '../../../components/layout/DocHeaderStandard'
import { DocHeaderSectionNavDemo } from '../../../components/layout/DocHeaderSectionNav'
import { useFipsTheme } from '../../../hooks/useFipsTheme'

const HOME_BACKGROUND = '/backgrounds/app-shell-home-trains.png'

const HOME_TABS = [
  { id: 'start', label: 'Início', active: true, icon: Home },
  { id: 'patterns', label: 'Padrões', active: false, icon: LayoutDashboard },
  { id: 'foundations', label: 'Fundamentos', active: false, icon: Palette },
  { id: 'components', label: 'Componentes', active: false, icon: Component },
  { id: 'meta', label: 'Projeto', active: false, icon: BookOpen },
]

// ─── Hero da Home ────────────────────────────────────────────────────────────
// Cópia fiel do hero real: `src/docs/pages/HomePage.tsx`, o mockup de
// `ApplicationShellDemo.tsx` e a Home do fips-suprimentos usam exatamente estas
// três camadas (arte → overlay azul → vinheta) com as mesmas classes.

function HomeHeroPreview() {
  return (
    <section className="relative isolate overflow-hidden text-white">
      <img
        src={HOME_BACKGROUND}
        alt=""
        aria-hidden
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover object-center"
        draggable={false}
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-[#002A68]/60 via-[#002A68]/45 to-[#002A68]/60" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/15" />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-5 px-4 py-12 text-center sm:px-6 sm:py-16">
        <Badge className="mb-5 rounded-full border-0 bg-[rgba(246,146,30,0.95)] text-white shadow-[0_12px_28px_rgba(246,146,30,0.28)]">
          Padrão Home
        </Badge>

        <h2 className="font-heading text-3xl font-bold leading-tight text-white sm:text-5xl">
          Home do <span className="text-[var(--color-accent)]">Aplicativo FIPS</span>
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
          Arte institucional, degradê azul e vinheta — leitura clara mesmo com imagem forte no fundo.
        </p>

        <div className="flex flex-wrap justify-center gap-2 pt-1">
          <Button variant="ouro" size="sm">Ação Primária</Button>
          <Button variant="inverseOutline" size="sm">Ação Secundária</Button>
        </div>
      </div>
    </section>
  )
}

// ─── Página ──────────────────────────────────────────────────────────────────

export default function HeroHeaderDoc() {
  const { dark } = useFipsTheme()

  const h2: CSSProperties = { fontSize: 20, fontWeight: 700, color: 'var(--color-gov-azul-escuro)', margin: '0 0 12px', fontFamily: "'Saira Expanded', sans-serif" }
  const lead: CSSProperties = { fontSize: 14, color: 'var(--color-fg-muted)', marginBottom: 16, lineHeight: 1.55 }
  const code: CSSProperties = { fontFamily: "'Fira Code', monospace", fontSize: 11 }

  return (
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
            Padrão da Home: arte institucional full-bleed + overlay azul vertical + vinheta, abaixo do header padrão
            sólido (o mesmo de todas as rotas). Nas demais telas — módulos, formulários, listagens — a faixa é o
            Banner de Conteúdo, não este hero.
          </p>
        </div>
      </header>

      <div style={{ padding: '36px 40px 60px', maxWidth: 1100, margin: '0 auto' }}>

      <RuleCards cards={[
        { icon: <Layers size={20} color="var(--color-gov-azul-profundo)" />, color: 'var(--color-gov-azul-profundo)', bg: 'color-mix(in srgb, var(--color-gov-azul-profundo) 3%, transparent)', tag: 'REGRA 1', title: 'Três camadas, sempre as três', desc: 'Arte ferroviária full-bleed (object-cover, object-center) + overlay azul vertical #002A68 60→45→60 + vinheta preta 35→transparente→15. A vinheta não é enfeite: é ela que segura o contraste do texto nas faixas em que a foto clareia. Nunca troque o conjunto por um degradê puro nem use a foto sem overlay.' },
        { icon: <Ban size={20} color="#DC3545" />, color: '#DC3545', bg: '#DC354508', tag: 'REGRA 2', title: 'O header não é mais glass', desc: 'O header acima do hero é o padrão sólido (DocHeaderStandard: toolbar --color-surface-soft com a arte lavada + faixa de abas), sticky e opaco em todas as rotas, inclusive a Home. O antigo header glass-to-white — transparente sobre o hero e branco ao rolar 60px — foi aposentado na v0.6.3; não reintroduza.' },
        { icon: <ShieldCheck size={20} color="var(--color-gov-azul-escuro)" />, color: 'var(--color-gov-azul-escuro)', bg: 'color-mix(in srgb, var(--color-gov-azul-escuro) 3%, transparent)', tag: 'REGRA 3', title: 'Hero é exclusivo da Home', desc: 'Só a Home de cada produto usa este hero com foto. Módulos, formulários e listagens abrem com o Banner de Conteúdo (faixa-card compacta: tile âmbar + eyebrow + título 21px + ações) — trocar um pelo outro quebra a hierarquia entre entrada do produto e telas de trabalho.' },
      ]} />

      {/* Preview real — header padrão + hero */}
      <section style={{ marginTop: 36 }}>
        <h2 style={h2}>Header padrão + hero da Home</h2>
        <p style={lead}>
          Montagem real: <code style={code}>DocHeaderStandardPreview</code> (o mesmo componente do header de produção)
          com o hero logo abaixo. O header é opaco e não muda de aparência ao rolar — o contraste do hero vem das
          camadas dele, não da transparência do cabeçalho.
        </p>
        <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] shadow-[var(--shadow-card)]">
          <DocHeaderStandardPreview
            groupLabel="Padrões"
            pageTitle="Home"
            dark={dark}
            sectionNav={<DocHeaderSectionNavDemo tabs={HOME_TABS} dark={dark} />}
            withCardChrome={false}
            footer={<HomeHeroPreview />}
          />
        </div>
        <p style={{ ...lead, marginTop: 12, marginBottom: 0 }}>
          Quando a Home tem indicadores, eles montam em cima da borda do hero com <code style={code}>-mt-7</code> (desktop)
          — anatomia completa em <strong>Padrão: Application Shell</strong>.
        </p>
      </section>

      {/* Anatomia — camadas */}
      <section style={{ marginTop: 36 }}>
        <h2 style={h2}>Anatomia — camadas do hero</h2>
        <div className="overflow-hidden rounded-2xl border border-[var(--color-border)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)]">
                <th className="px-4 py-3 text-left font-semibold text-[var(--color-fg)]">Camada</th>
                <th className="px-4 py-3 text-left font-semibold text-[var(--color-fg)]">Classe / valor</th>
                <th className="px-4 py-3 text-left font-semibold text-[var(--color-fg)]">Papel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {[
                ['Container', 'relative isolate overflow-hidden text-white', 'Isola o empilhamento e corta as camadas no formato do hero'],
                ['1. Arte', `<img src="${HOME_BACKGROUND}"> · absolute inset-0 h-full w-full object-cover object-center`, 'Identidade ferroviária FIPS — mesma arte usada nos banners'],
                ['2. Overlay azul', 'bg-gradient-to-b from-[#002A68]/60 via-[#002A68]/45 to-[#002A68]/60', 'Institucionaliza a foto e baixa o ruído no miolo'],
                ['3. Vinheta', 'bg-gradient-to-t from-black/35 via-transparent to-black/15', 'Escurece topo e base — é o que garante o contraste do texto'],
                ['4. Conteúdo', 'relative z-10 mx-auto max-w-6xl px-4 py-12 text-center sm:px-6 sm:py-16', 'Badge, título, subtítulo e ações, centralizados'],
              ].map(([camada, cls, papel]) => (
                <tr key={camada} className="bg-[var(--color-surface)]">
                  <td className="px-4 py-3 font-medium whitespace-nowrap text-[var(--color-fg)]">{camada}</td>
                  <td className="px-4 py-3 font-mono text-xs text-[var(--color-fg-muted)]">{cls}</td>
                  <td className="px-4 py-3 text-[var(--color-fg-muted)]">{papel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Conteúdo do hero */}
      <section style={{ marginTop: 36 }}>
        <h2 style={h2}>Conteúdo do hero</h2>
        <div className="overflow-hidden rounded-2xl border border-[var(--color-border)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)]">
                <th className="px-4 py-3 text-left font-semibold text-[var(--color-fg)]">Elemento</th>
                <th className="px-4 py-3 text-left font-semibold text-[var(--color-fg)]">Especificação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {[
                ['Badge', 'Pill laranja bg-[rgba(246,146,30,0.95)] + shadow-[0_12px_28px_rgba(246,146,30,0.28)], texto branco. Nomeia o produto/contexto ("FIPS Suprimentos", "Design System FIPS").'],
                ['Título', 'font-heading (Saira Expanded) text-3xl sm:text-5xl font-bold branco, com um termo destacado em <span className="text-[var(--color-accent)]">.'],
                ['Subtítulo', 'text-white/80 max-w-2xl leading-7 (text-base sm:text-lg) — uma frase sobre o que o produto resolve.'],
                ['Ações', 'Par de botões size="sm": variant="ouro" (ou "accent") para a ação primária + variant="inverseOutline" para a secundária. Nunca botão claro chapado sobre o hero.'],
                ['Indicadores', 'Opcionais, em grid abaixo do hero com straddle -mt-7 (desktop) / -mt-6 (tablet) / -mt-3 (mobile).'],
              ].map(([el, spec]) => (
                <tr key={el} className="bg-[var(--color-surface)]">
                  <td className="px-4 py-3 font-medium whitespace-nowrap text-[var(--color-fg)]">{el}</td>
                  <td className="px-4 py-3 text-[var(--color-fg-muted)]">{spec}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Faixa de módulo */}
      <section style={{ marginTop: 36 }}>
        <h2 style={h2}>Faixa de módulo — não é este padrão</h2>
        <p style={lead}>
          Módulos, listagens e formulários não abrem com o hero da Home. A faixa dessas telas é o
          <strong> Banner de Conteúdo</strong> (menu <strong>Padrões → Banner</strong>): faixa-card compacta,
          gradiente gov de 3 stops terminando em <span style={code}>#001A4A</span>, raio assimétrico
          <span style={code}> 12px 12px 12px 24px</span>, trilhos sutis à direita, tile âmbar 44×44, eyebrow
          <span style={code}> accent-strong</span>, título Saira 21px e ações <span style={code}>accent</span> +
          <span style={code}> inverseOutline</span>. Desde a v0.13.0 é um composite governado da library
          — <span style={code}>import {'{'} PageHeader {'}'} from '@fips-app/ds-fips'</span> — promovido a partir
          do <span style={code}>PageHeader</span> que o Governança BI usa nas 14 telas dele. Não recrie a faixa
          por tela.
        </p>
        <PageHeader
          eyebrow="Suprimentos"
          title="Sistema de Requisições"
          description="Gestão de compras e requisições do módulo · FIPS"
          icon={<FileText size={20} color="var(--color-accent)" aria-hidden />}
          actions={<Button variant="accent" size="sm">Nova requisição</Button>}
        />
        <p style={{ ...lead, marginTop: 12, marginBottom: 0 }}>
          Variante <strong>Banner de Fluxo</strong> (mesma faixa com chips de KPI) e o Banner de Página estão em
          <strong> Padrões → Banner</strong>.
        </p>
      </section>

      {/* Regra de cores por fundo */}
      <section style={{ marginTop: 36 }}>
        <h2 style={h2}>Regra de cores por fundo</h2>
        <div className="overflow-hidden rounded-2xl border border-[var(--color-border)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)]">
                <th className="px-4 py-3 text-left font-semibold text-[var(--color-fg)]">Contexto</th>
                <th className="px-4 py-3 text-left font-semibold text-[var(--color-fg)]">Fundo</th>
                <th className="px-4 py-3 text-left font-semibold text-[var(--color-fg)]">Texto / ícones</th>
                <th className="px-4 py-3 text-left font-semibold text-[var(--color-fg)]">Destaque</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {[
                ['Header (todas as rotas, inclusive Home)', '--color-surface-soft sólido + arte lavada (dark: #1A1A1A)', 'Cinza / azul normal — nunca invertido', 'Hover dourado dos botões neumorphic'],
                ['Home — sobre o hero', 'Foto + overlay azul + vinheta', 'Branco / white-80', '--color-accent no termo do título'],
                ['Home — conteúdo abaixo do hero', '--color-surface-muted', 'Cinza / azul normal', 'Cards em --color-surface'],
                ['Módulos internos', 'Banner de Conteúdo — gradiente gov 3 stops → #001A4A', 'Branco / white-67', 'Tile e eyebrow em --color-accent'],
              ].map(([ctx, bg, text, destaque]) => (
                <tr key={ctx} className="bg-[var(--color-surface)]">
                  <td className="px-4 py-3 font-medium text-[var(--color-fg)]">{ctx}</td>
                  <td className="px-4 py-3 font-mono text-xs text-[var(--color-fg-muted)]">{bg}</td>
                  <td className="px-4 py-3 text-[var(--color-fg-muted)]">{text}</td>
                  <td className="px-4 py-3 text-[var(--color-fg-muted)]">{destaque}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Aposentado */}
      <section style={{ marginTop: 36 }}>
        <h2 style={h2}>Aposentado — header glass-to-white</h2>
        <div className="flex gap-3 rounded-2xl border border-[#DC3545]/25 bg-[#DC3545]/[0.04] p-4">
          <AlertTriangle size={20} color="#DC3545" style={{ flexShrink: 0, marginTop: 2 }} />
          <p style={{ ...lead, margin: 0 }}>
            Até a v0.6.2 o produto usava um cabeçalho que começava transparente com <em>backdrop-filter</em> sobre
            o hero e virava branco ao passar de 60px de scroll, com o hero em degradê diagonal
            (<span style={code}>118deg</span>, sem foto). Esse padrão saiu do produto: nem a Home do DS, nem o mockup do
            Application Shell, nem o fips-suprimentos usam listener de scroll no header. Se encontrar código com
            <span style={code}> scrollTop &gt; 60</span> trocando o fundo do header, é resíduo — migre para o header
            padrão + as três camadas do hero acima.
          </p>
        </div>
      </section>

      {/* Implementação */}
      <section style={{ marginTop: 36 }}>
        <h2 style={h2}>Implementação</h2>
        <p style={{ ...lead, marginBottom: 0 }}>
          Referências reais, na ordem: <strong>src/docs/pages/HomePage.tsx</strong> (Home do próprio DS),
          <strong> ApplicationShellDemo.tsx</strong> (mockup do shell, com os indicadores em straddle) e a
          <strong> Home.tsx do fips-suprimentos</strong> — as três usam as mesmas classes. Copie de lá em vez de
          reescrever o empilhamento.
        </p>
      </section>

        <div style={{ textAlign: 'center', padding: '20px 0 0', borderTop: '1px solid var(--color-border)', marginTop: 36 }}>
          <span style={{ fontSize: 12, color: '#7B8C96', letterSpacing: '0.5px', fontFamily: "'Saira Expanded', sans-serif", fontWeight: 400 }}>DS-FIPS · Ferrovia Interna do Porto de Santos · Excelência sobre trilhos · {new Date().getFullYear()}</span>
        </div>
      </div>
    </div>
  )
}
