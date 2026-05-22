import { useState } from 'react'
import { Bell } from 'lucide-react'
import { DocPage, DemoSection } from '../../components/DocPage'
import { SettingsPreferenceRow } from '../../../components/composites/SettingsPreferenceRow'
import { Switch } from '../../../components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'

export default function SwitchDoc() {
  const [on, setOn] = useState(true)
  const [email, setEmail] = useState(false)
  const [aprovado, setAprovado] = useState(true)

  return (
    <DocPage
      title="Switch"
      description="Toggle 42×24px com Radix UI. Usado em preferências de configuração (SettingsPreferenceRow) no módulo FIPS Suprimentos."
    >
      <DemoSection title="Estados">
        <div className="flex flex-wrap items-center gap-8 rounded-[12px_12px_12px_24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <label className="flex items-center gap-3 text-sm">
            <Switch checked={on} onCheckedChange={setOn} />
            <span>{on ? 'Ativado' : 'Desativado'}</span>
          </label>
          <label className="flex items-center gap-3 text-sm text-[var(--color-fg-muted)]">
            <Switch disabled checked={false} />
            <span>Desabilitado</span>
          </label>
        </div>
      </DemoSection>

      <DemoSection title="SettingsPreferenceRow (Suprimentos)">
        <Card className="rounded-[12px_12px_12px_24px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-heading text-lg">
              <Bell className="h-5 w-5 text-[var(--color-primary)]" aria-hidden />
              Preferências de notificação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <SettingsPreferenceRow
              label="Escopo aprovado pela área"
              checked={aprovado}
              onCheckedChange={setAprovado}
            />
            <SettingsPreferenceRow
              label="Nova etapa do fluxo"
              checked={on}
              onCheckedChange={setOn}
            />
            <hr className="border-[var(--color-border)]" />
            <SettingsPreferenceRow
              variant="info"
              label="Receber por e-mail"
              description="Além das notificações no sistema"
              checked={email}
              onCheckedChange={setEmail}
            />
          </CardContent>
        </Card>
      </DemoSection>

      <DemoSection title="Tokens">
        <ul className="list-inside list-disc space-y-2 text-sm text-[var(--color-fg-muted)]">
          <li>On: <code className="text-xs">--color-primary</code> (light) / <code className="text-xs">#93bde4</code> (dark)</li>
          <li>Off: <code className="text-xs">--color-fips-gray-400</code></li>
          <li>Thumb: branco, 20px, sombra sutil</li>
          <li>Linha de preferência: radius <code className="text-xs">10px 10px 10px 18px</code></li>
        </ul>
      </DemoSection>
    </DocPage>
  )
}
