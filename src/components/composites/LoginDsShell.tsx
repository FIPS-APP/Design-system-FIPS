import { useEffect, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { cn } from '../../lib/cn'
import { useIsClient } from '../../lib/useIsClient'
import '../../styles/entrada.css'

/**
 * Tela de entrada FIPS, igual à da Gestão OPA: coluna institucional à esquerda ("Excelência sobre
 * trilhos", texto e rota animada dos princípios) e cartão de vidro à direita com a marca, um texto
 * curto e o botão de contorno do provedor. O CSS sai no `styles.css` do pacote.
 *
 * Imagens do `public/` do app, como no `HomeHero`: `logo` (padrão `/fips-logo-azul.svg`) e `fundo`
 * (padrão `/backgrounds/app-shell-home-trains.png`). O trem que corre embaixo vem embutido.
 */
export interface LoginDsShellProps {
  /** Clique no botão do provedor. Também roda com Enter, porque o botão envia o formulário. */
  onClick?: () => void
  /** Com `href`, o botão vira `<a>` e o navegador segue o link. `onClick` ainda é chamado antes. */
  href?: string
  /** Texto do botão. Padrão "Entrar com FIPS". */
  rotulo?: string
  /** Ícone à direita do rótulo. Padrão: seta. `null` tira o ícone. */
  icone?: ReactNode
  /** Texto acima do botão. */
  texto?: ReactNode
  /** Mensagem de erro, entre o texto e o botão, anunciada ao leitor de tela. */
  erro?: ReactNode
  /** Bloqueia o botão e troca o rótulo por `rotuloCarregando`. */
  carregando?: boolean
  /** Padrão "Entrando…". */
  rotuloCarregando?: string
  /** Bloco abaixo do botão, dentro do cartão. Uso típico: "Entrar como" só em desenvolvimento. */
  rodape?: ReactNode
  /** Caminho da marca no cartão. */
  logo?: string
  /** Texto alternativo da marca. Padrão "App FIPS". */
  logoAlt?: string
  /** Foto de fundo da coluna direita. `null` deixa só o azul. */
  fundo?: string | null
  className?: string
}

const ESTACOES = [
  {
    nome: 'Eficiência',
    texto: 'A busca pela eficiência, com responsabilidade, deve estar presente em nosso dia a dia.',
    cor: 'var(--color-fips-green-500)',
  },
  {
    nome: 'Pessoas',
    texto: 'Pessoas engajadas e um ambiente de trabalho saudável são o alicerce para bons resultados duradouros.',
    cor: 'var(--color-fips-yellow-400)',
  },
  {
    nome: 'Integridade',
    texto: 'Respeitar as pessoas e cumprir os compromissos assumidos é essencial para relacionamentos duradouros.',
    cor: 'var(--color-fips-yellow-600)',
  },
  {
    nome: 'Colaboração',
    texto: 'Trabalho em conjunto, com empatia, para alcançar o melhor resultado para todos.',
    cor: 'var(--color-fips-green-500)',
  },
  {
    nome: 'Segurança',
    texto: 'A segurança das pessoas é prioridade sobre qualquer outro tema.',
    cor: 'var(--color-fips-red-600)',
  },
] as const

const DORMENTES = [28, 62, 96, 130, 164, 198, 232, 266, 300] as const

const TRILHOS = [
  'M0 60H120C140 60 140 60 160 40L240 40H400',
  'M0 60H120C140 60 140 60 160 80L240 80H400',
  'M0 140H80C100 140 100 140 120 120L200 120H400',
  'M0 140H80C100 140 100 140 120 160L200 160H400',
] as const

const AMARELO = 'var(--color-fips-yellow-400)'
const LARANJA = 'var(--color-fips-yellow-600)'
const BRANCO = 'var(--color-white)'

/** `cor` com `pct`% de opacidade, para token em `var()`. */
function alfa(cor: string, pct: number) {
  return `color-mix(in srgb, ${cor} ${pct}%, transparent)`
}

function Trilhos({ style }: { style: CSSProperties }) {
  return (
    <svg viewBox="0 0 400 200" fill="none" aria-hidden style={style}>
      {TRILHOS.map((d) => (
        <path key={d} d={d} stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      ))}
    </svg>
  )
}

function Trem() {
  return (
    <svg viewBox="0 0 720 320" fill="currentColor" aria-hidden>
      <path d="M32 248V156c0-8 6-14 14-14h48l22-38c4-7 12-11 20-11h180c8 0 15 4 19 11l18 38h52c22 0 40 18 40 40v66H32z" />
      <rect x="420" y="132" width="268" height="116" rx="14" />
      <rect x="380" y="168" width="56" height="80" rx="8" />
      <circle cx="120" cy="252" r="36" />
      <circle cx="210" cy="252" r="36" />
      <circle cx="500" cy="252" r="40" />
      <circle cx="600" cy="252" r="40" />
      <path d="M648 132h40l32 48v68h-72V132z" />
    </svg>
  )
}

function Sinal({ cor, ativo }: { cor: string; ativo: boolean }) {
  return (
    <div
      aria-hidden
      style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: ativo ? cor : 'rgba(255,255,255,0.08)',
        boxShadow: ativo ? `0 0 12px ${alfa(cor, 50)}, 0 0 4px ${cor}` : 'none',
        transition: 'all 0.6s ease',
      }}
    />
  )
}

function RotaDosPrincipios({ montado, passo }: { montado: boolean; passo: number }) {
  return (
    <div
      className="login-principles-route"
      style={{ height: 440, overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16, position: 'relative' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, paddingLeft: 4, paddingRight: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 14, height: 2.5, borderRadius: 2, background: `linear-gradient(90deg, ${AMARELO}, ${LARANJA})` }} />
          <span className="font-heading" style={{ fontSize: 7, fontWeight: 700, letterSpacing: '2px', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' }}>
            Rota dos princípios
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Sinal cor="var(--color-fips-red-600)" ativo={passo >= 1} />
          <Sinal cor={AMARELO} ativo={passo >= 2} />
          <Sinal cor="var(--color-fips-green-500)" ativo={passo >= 3} />
          <span className="font-heading" style={{ fontSize: 6, fontWeight: 600, letterSpacing: '1px', color: 'rgba(255,255,255,0.22)', marginLeft: 2, textTransform: 'uppercase' }}>
            Ativo
          </span>
        </div>
      </div>

      <div style={{ position: 'relative', paddingLeft: 32 }}>
        <div
          aria-hidden
          style={{
            position: 'absolute',
            left: 9,
            top: 0,
            bottom: 0,
            width: 2,
            background: `repeating-linear-gradient(180deg, ${AMARELO} 0px, ${AMARELO} 8px, transparent 8px, transparent 14px)`,
            opacity: 0.5,
          }}
        />
        {DORMENTES.map((y) => (
          <div key={y} aria-hidden style={{ position: 'absolute', left: 2, top: y, width: 16, height: 2, background: AMARELO, opacity: 0.12, borderRadius: 1 }} />
        ))}
        {ESTACOES.map((estacao, i) => (
          <div
            key={estacao.nome}
            style={{
              position: 'relative',
              marginBottom: i < ESTACOES.length - 1 ? 28 : 0,
              animation: montado ? `stationReveal 0.4s ease-out ${0.3 + i * 0.12}s both` : 'none',
            }}
          >
            <div
              aria-hidden
              style={{
                position: 'absolute',
                left: -28,
                top: 2,
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: `radial-gradient(circle at 40% 35%, ${estacao.cor}, ${alfa(estacao.cor, 53)} 60%, transparent 100%)`,
                boxShadow: `0 0 8px ${alfa(estacao.cor, 50)}, 0 0 16px ${alfa(estacao.cor, 19)}`,
                animation: `stationPulse 2.5s ease-in-out ${i * 0.5}s infinite`,
              }}
            />
            <div aria-hidden style={{ position: 'absolute', left: -30, top: 0, width: 16, height: 16, borderRadius: '50%', border: `1.5px solid ${alfa(estacao.cor, 25)}`, pointerEvents: 'none' }} />
            <div aria-hidden style={{ position: 'absolute', left: -12, top: 8, width: 8, height: 1, background: alfa(estacao.cor, 31) }} />
            <div className="font-heading" style={{ fontSize: 11, fontWeight: 700, color: estacao.cor, letterSpacing: '0.3px', lineHeight: 1.2 }}>
              {estacao.nome}
            </div>
            <div style={{ marginTop: 3, maxWidth: 220, fontSize: 9, lineHeight: 1.45, color: 'rgba(255,255,255,0.25)' }}>
              {estacao.texto}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function LoginDsShell({
  onClick,
  href,
  rotulo = 'Entrar com FIPS',
  icone,
  texto = 'Acesso unificado FIPS. Clique abaixo e entre com sua conta corporativa.',
  erro,
  carregando = false,
  rotuloCarregando = 'Entrando…',
  rodape,
  logo = '/fips-logo-azul.svg',
  logoAlt = 'App FIPS',
  fundo = '/backgrounds/app-shell-home-trains.png',
  className,
}: LoginDsShellProps) {
  const montado = useIsClient()
  const [passo, setPasso] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => setPasso((s) => (s + 1) % 4), 1200)
    return () => window.clearInterval(timer)
  }, [])

  const enviar = (event: FormEvent) => {
    event.preventDefault()
    if (carregando) return
    onClick?.()
    if (href) window.location.assign(href)
  }

  const iconeFinal = icone === undefined ? <ArrowRight size={15} strokeWidth={2.4} aria-hidden /> : icone
  const conteudoBotao = (
    <>
      <span>{carregando ? rotuloCarregando : rotulo}</span>
      {!carregando ? iconeFinal : null}
    </>
  )

  return (
    <div
      className={cn('login-v1-container relative', className)}
      style={{ '--login-fundo': fundo ? `url('${fundo}')` : 'none' } as CSSProperties}
    >
      <div className="login-left">
        <Trilhos style={{ color: BRANCO, opacity: 0.07, position: 'absolute', top: 0, right: 0, width: 500 }} />
        <Trilhos style={{ color: BRANCO, opacity: 0.07, position: 'absolute', bottom: 0, left: 0, width: 400, transform: 'rotate(180deg)' }} />

        <div className="train-runner" style={{ color: BRANCO }}>
          <Trem />
        </div>

        <div className={`login-left-content ${montado ? 'login-left-content--enter' : ''}`}>
          <h1 className="font-heading" style={{ margin: '0 0 12px', fontSize: 22, fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.3px', color: BRANCO }}>
            Excelência
            <br />
            <span style={{ color: AMARELO }}>sobre trilhos</span>
          </h1>

          <p style={{ margin: '12px 0 16px', maxWidth: 320, fontSize: 15, lineHeight: 1.7, color: 'rgba(255,255,255,0.45)' }}>
            Sistema integrado da Ferrovia Interna do Porto de Santos.
          </p>

          <RotaDosPrincipios montado={montado} passo={passo} />
        </div>
      </div>

      <div className="login-right">
        <div className={`liquid-card login-card ${montado ? 'login-card--enter' : ''}`}>
          <img src={logo} alt={logoAlt} className="login-card-logo" style={{ height: 86, objectFit: 'contain', marginBottom: 2 }} />

          <form className="login-form" onSubmit={enviar}>
            {texto ? (
              <p style={{ margin: '0 0 8px', fontSize: 13, lineHeight: 1.55, color: 'rgba(255,255,255,0.65)', textAlign: 'center' }}>{texto}</p>
            ) : null}

            {erro ? (
              <p
                role="alert"
                style={{
                  margin: 0,
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: `1px solid ${alfa('var(--color-fips-red-600)', 35)}`,
                  background: alfa('var(--color-fips-red-600)', 10),
                  color: 'var(--color-fips-red-300)',
                  fontSize: 12,
                  lineHeight: 1.45,
                  textAlign: 'center',
                }}
              >
                {erro}
              </p>
            ) : null}

            {href && !carregando ? (
              <a className="outline-btn" href={href} onClick={() => onClick?.()}>
                {conteudoBotao}
              </a>
            ) : (
              <button type="submit" className="outline-btn" disabled={carregando} aria-busy={carregando}>
                {conteudoBotao}
              </button>
            )}
          </form>
          {rodape ? <div style={{ marginTop: 18 }}>{rodape}</div> : null}
        </div>
      </div>
    </div>
  )
}
