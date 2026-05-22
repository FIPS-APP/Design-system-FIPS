import { useState } from 'react'
import { Bell, Database, HardDrive, Save, Settings } from 'lucide-react'
import { FipsTabBar } from '../../../components/composites/FipsTabBar'
import { PatternPanelHero } from '../../../components/composites/PatternPanelHero'
import { SettingsPreferenceRow } from '../../../components/composites/SettingsPreferenceRow'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'

type TabId = 'notificacoes' | 'backup' | 'sistema'

const settingsCardClass =
  'rounded-[12px_12px_12px_24px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)]'

export default function ConfiguracoesDemo() {
  const [activeTab, setActiveTab] = useState<TabId>('notificacoes')
  const [prefs, setPrefs] = useState({
    escopoAprovado: true,
    novaEtapa: true,
    comentario: false,
    email: false,
  })

  const tabItems = [
    { id: 'notificacoes' as const, label: 'Notificações', icon: <Bell className="h-3.5 w-3.5" strokeWidth={1.9} aria-hidden /> },
    { id: 'backup' as const, label: 'Backup', icon: <Database className="h-3.5 w-3.5" strokeWidth={1.9} aria-hidden /> },
    { id: 'sistema' as const, label: 'Sistema', icon: <HardDrive className="h-3.5 w-3.5" strokeWidth={1.9} aria-hidden /> },
  ]

  return (
    <div className="min-h-full bg-[var(--color-surface-muted)] font-sans text-[var(--color-fg)]">
      <div className="mx-auto max-w-4xl space-y-6 px-4 pb-12 pt-4 md:px-8 md:pt-6">
        <PatternPanelHero
          badgePill
          badge="Preferências"
          title={
            <>
              Configura<span style={{ color: 'var(--color-accent)' }}>ções</span>
            </>
          }
          subtitle="Referência visual do módulo FIPS Suprimentos — notificações, backup e sistema"
          icon={<Settings size={20} strokeWidth={1.6} color="var(--color-accent)" aria-hidden />}
        />

        <p className="text-sm text-[var(--color-fg-muted)]">
          Padrão de referência para telas de preferências. Use <strong>FipsTabBar</strong> para alternar seções e{' '}
          <strong>SettingsPreferenceRow</strong> para cada opção com switch.
        </p>

        <section className="space-y-6" aria-label="Seções de configuração">
          <FipsTabBar tabs={tabItems} activeId={activeTab} onChange={(id) => setActiveTab(id as TabId)} />

          {activeTab === 'notificacoes' && (
            <Card className={settingsCardClass}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-heading text-lg">
                  <Bell className="h-5 w-5 text-[var(--color-primary)]" aria-hidden />
                  Preferências de notificação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <SettingsPreferenceRow
                  label="Escopo aprovado pela área"
                  checked={prefs.escopoAprovado}
                  onCheckedChange={(v) => setPrefs((p) => ({ ...p, escopoAprovado: v }))}
                />
                <SettingsPreferenceRow
                  label="Mudança de etapa do escopo"
                  checked={prefs.novaEtapa}
                  onCheckedChange={(v) => setPrefs((p) => ({ ...p, novaEtapa: v }))}
                />
                <SettingsPreferenceRow
                  label="Novos comentários"
                  checked={prefs.comentario}
                  onCheckedChange={(v) => setPrefs((p) => ({ ...p, comentario: v }))}
                />
                <hr className="border-[var(--color-border)]" />
                <SettingsPreferenceRow
                  variant="info"
                  label="Receber por e-mail"
                  description="Além das notificações no sistema"
                  checked={prefs.email}
                  onCheckedChange={(v) => setPrefs((p) => ({ ...p, email: v }))}
                />
                <div className="flex justify-end pt-4">
                  <Button variant="ouro" size="md">
                    <Save className="h-4 w-4" aria-hidden />
                    Salvar preferências
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'backup' && (
            <Card className={settingsCardClass}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-heading text-lg">
                  <Database className="h-5 w-5 text-[var(--color-primary)]" aria-hidden />
                  Backup do banco
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[var(--color-fg-muted)]">
                  Demo estática — no produto Suprimentos, admin exporta/importa JSON do Postgres da aplicação.
                </p>
              </CardContent>
            </Card>
          )}

          {activeTab === 'sistema' && (
            <Card className={settingsCardClass}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-heading text-lg">
                  <HardDrive className="h-5 w-5 text-[var(--color-primary)]" aria-hidden />
                  Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[var(--color-fg-muted)]">Versão do app, ambiente e metadados operacionais.</p>
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </div>
  )
}
