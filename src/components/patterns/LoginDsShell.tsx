import { useEffect, useState } from 'react'
import { ArrowRight, FlaskConical } from 'lucide-react'

type LoginDsShellProps = {
  onBubbleLogin: () => void
  onTestAdmin?: () => void
  showTestAdmin?: boolean
  testAdminLoading?: boolean
}

const PRINCIPLE_STATIONS = [
  {
    name: 'Eficiencia',
    desc: 'A busca pela eficiencia, com responsabilidade, deve estar presente em nosso dia a dia.',
    color: '#00C64C',
  },
  {
    name: 'Pessoas',
    desc: 'Pessoas engajadas e um ambiente de trabalho saudavel sao o alicerce para bons resultados duradouros.',
    color: '#FDC24E',
  },
  {
    name: 'Integridade',
    desc: 'Respeitar as pessoas e cumprir os compromissos assumidos e essencial para relacionamentos duradouros.',
    color: '#F6921E',
  },
  {
    name: 'Colaboracao',
    desc: 'Trabalho em conjunto, com empatia, para alcancar o melhor resultado para todos.',
    color: '#00C64C',
  },
  {
    name: 'Seguranca',
    desc: 'A seguranca das pessoas e prioridade sobre qualquer outro tema.',
    color: '#FF4D4D',
  },
] as const

const RAIL_SLEEPER_OFFSETS = [28, 62, 96, 130, 164, 198, 232, 266, 300] as const

function SignalDot({
  color,
  active,
}: {
  color: string
  active: boolean
}) {
  return (
    <div
      aria-hidden
      style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: active ? color : 'rgba(255,255,255,0.08)',
        boxShadow: active ? `0 0 12px ${color}80, 0 0 4px ${color}` : 'none',
        transition: 'all 0.6s ease',
      }}
    />
  )
}

function LoginPrinciplesRoute({ mounted, signalStep }: { mounted: boolean; signalStep: number }) {
  return (
    <div
      className="login-principles-route"
      style={{
        height: 440,
        overflow: 'hidden',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        paddingTop: 16,
        position: 'relative',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 14,
          paddingLeft: 4,
          paddingRight: 4,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 14,
              height: 2.5,
              borderRadius: 2,
              background: 'linear-gradient(90deg, #FDC24E, #F6921E)',
            }}
          />
          <span
            className="font-heading"
            style={{
              fontSize: 7,
              fontWeight: 700,
              letterSpacing: '2px',
              color: 'rgba(255,255,255,0.25)',
              textTransform: 'uppercase',
            }}
          >
            Rota dos principios
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <SignalDot color="#FF4D4D" active={signalStep >= 1} />
          <SignalDot color="#FDC24E" active={signalStep >= 2} />
          <SignalDot color="#00C64C" active={signalStep >= 3} />
          <span
            className="font-heading"
            style={{
              fontSize: 6,
              fontWeight: 600,
              letterSpacing: '1px',
              color: 'rgba(255,255,255,0.22)',
              marginLeft: 2,
              textTransform: 'uppercase',
            }}
          >
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
            background:
              'repeating-linear-gradient(180deg, #FDC24E 0px, #FDC24E 8px, transparent 8px, transparent 14px)',
            opacity: 0.5,
          }}
        />
        {RAIL_SLEEPER_OFFSETS.map((y, i) => (
          <div
            key={i}
            aria-hidden
            style={{
              position: 'absolute',
              left: 2,
              top: y,
              width: 16,
              height: 2,
              background: '#FDC24E',
              opacity: 0.12,
              borderRadius: 1,
            }}
          />
        ))}
        {PRINCIPLE_STATIONS.map((station, i) => (
          <div
            key={station.name}
            style={{
              position: 'relative',
              marginBottom: i < PRINCIPLE_STATIONS.length - 1 ? 28 : 0,
              animation: mounted
                ? `stationReveal 0.4s ease-out ${0.3 + i * 0.12}s both`
                : 'none',
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
                background: `radial-gradient(circle at 40% 35%, ${station.color}, ${station.color}88 60%, transparent 100%)`,
                boxShadow: `0 0 8px ${station.color}80, 0 0 16px ${station.color}30`,
                animation: `stationPulse 2.5s ease-in-out ${i * 0.5}s infinite`,
              }}
            />
            <div
              aria-hidden
              style={{
                position: 'absolute',
                left: -30,
                top: 0,
                width: 16,
                height: 16,
                borderRadius: '50%',
                border: `1.5px solid ${station.color}40`,
                pointerEvents: 'none',
              }}
            />
            <div
              aria-hidden
              style={{
                position: 'absolute',
                left: -12,
                top: 8,
                width: 8,
                height: 1,
                background: `${station.color}50`,
              }}
            />
            <div
              className="font-heading"
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: station.color,
                letterSpacing: '0.3px',
                lineHeight: 1.2,
              }}
            >
              {station.name}
            </div>
            <div
              style={{
                marginTop: 3,
                maxWidth: 220,
                fontSize: 9,
                lineHeight: 1.45,
                color: 'rgba(255,255,255,0.25)',
              }}
            >
              {station.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function LoginDsShell({
  onBubbleLogin,
  onTestAdmin,
  showTestAdmin,
  testAdminLoading = false,
}: LoginDsShellProps) {
  const [mounted, setMounted] = useState(false)
  const [signalStep, setSignalStep] = useState(0)

  useEffect(() => {
    setMounted(true)
    const timer = window.setInterval(() => {
      setSignalStep((s) => (s + 1) % 4)
    }, 1200)
    return () => window.clearInterval(timer)
  }, [])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    onBubbleLogin()
  }

  return (
    <div className="login-v1-container relative">
      <div className="login-left">
        <svg
          viewBox="0 0 400 200"
          fill="none"
          aria-hidden
          style={{ opacity: 0.07, position: 'absolute', top: 0, right: 0, width: 500 }}
        >
          <path
            d="M0 60H120C140 60 140 60 160 40L240 40H400"
            stroke="#fff"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M0 60H120C140 60 140 60 160 80L240 80H400"
            stroke="#fff"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M0 140H80C100 140 100 140 120 120L200 120H400"
            stroke="#fff"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M0 140H80C100 140 100 140 120 160L200 160H400"
            stroke="#fff"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
        <svg
          viewBox="0 0 400 200"
          fill="none"
          aria-hidden
          style={{
            opacity: 0.07,
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: 400,
            transform: 'rotate(180deg)',
          }}
        >
          <path
            d="M0 60H120C140 60 140 60 160 40L240 40H400"
            stroke="#fff"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M0 60H120C140 60 140 60 160 80L240 80H400"
            stroke="#fff"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M0 140H80C100 140 100 140 120 120L200 120H400"
            stroke="#fff"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M0 140H80C100 140 100 140 120 160L200 160H400"
            stroke="#fff"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>

        <div className="train-runner">
          <img src="/brand/hero-train-silhouette.svg" alt="" draggable={false} />
        </div>

        <div className={`login-left-content ${mounted ? 'login-left-content--enter' : ''}`}>
          <h1
            className="font-heading"
            style={{
              margin: '0 0 12px',
              fontSize: 22,
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.3px',
              color: '#fff',
            }}
          >
            Excelência
            <br />
            <span style={{ color: '#FDC24E' }}>sobre trilhos</span>
          </h1>

          <p
            style={{
              margin: '12px 0 16px',
              maxWidth: 320,
              fontSize: 15,
              lineHeight: 1.7,
              color: 'rgba(255,255,255,0.45)',
            }}
          >
            Sistema integrado da Ferrovia Interna do Porto de Santos.
          </p>

          <LoginPrinciplesRoute mounted={mounted} signalStep={signalStep} />
        </div>
      </div>

      <div className="login-right">
        <div className={`liquid-card login-card ${mounted ? 'login-card--enter' : ''}`}>
          <img
            src="/fips-logo-azul.svg"
            alt="App FIPS"
            className="login-card-logo"
            style={{ height: 86, objectFit: 'contain', marginBottom: 2 }}
          />

          <form className="login-form" onSubmit={handleSubmit}>
            <p
              style={{
                margin: '0 0 8px',
                fontSize: 13,
                lineHeight: 1.55,
                color: 'rgba(255,255,255,0.65)',
                textAlign: 'center',
              }}
            >
              Acesso unificado FIPS. Clique abaixo e entre com sua conta corporativa.
            </p>

            <button type="submit" className="outline-btn">
              <span>Entrar com FIPS</span>
              <ArrowRight size={15} strokeWidth={2.4} aria-hidden />
            </button>

            {showTestAdmin && onTestAdmin ? (
              <button
                type="button"
                className="login-dev-btn"
                onClick={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  onTestAdmin()
                }}
                disabled={testAdminLoading}
                aria-busy={testAdminLoading}
              >
                <FlaskConical size={16} aria-hidden />
                {testAdminLoading ? 'Entrando…' : 'Testar ADMIN (dev)'}
              </button>
            ) : null}
          </form>
        </div>
      </div>
    </div>
  )
}
