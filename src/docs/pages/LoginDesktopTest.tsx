import { LoginDsShell } from '../../components/patterns/LoginDsShell'

/** Rota de teste — mesmo shell do app FIPS Suprimentos */
export default function LoginDesktopTest() {
  return (
    <div style={{ minHeight: '100svh' }}>
      <LoginDsShell onBubbleLogin={() => {}} />
    </div>
  )
}
