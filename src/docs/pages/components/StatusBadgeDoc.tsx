import { DocPage, DemoSection } from '../../components/DocPage'
import { PlaygroundProvider, Copyable } from '../../components/CodePlayground'
import { StatusBadge } from '../../../components/ui/status-badge-component'
import { STATUS_BADGE_GRUPOS, STATUS_BADGE_SINONIMOS, type StatusBadgeGrupo } from '../../../components/ui/status-badge'

const ORDEM: StatusBadgeGrupo[] = ['pendente', 'andamento', 'concluido', 'atrasado', 'cancelado', 'rascunho', 'critico']

const QUANDO: Record<StatusBadgeGrupo, string> = {
  pendente: 'Espera ação de alguém: aguardando aprovação, solicitação aberta.',
  andamento: 'Alguém está trabalhando: em andamento, triagem, desenvolvimento, no prazo.',
  concluido: 'Terminou bem: concluído, finalizado, aprovado, entregue.',
  atrasado: 'Passou do prazo: vencido, fora do prazo.',
  cancelado: 'Saiu do fluxo sem falha: cancelado, improcedente, inativo, pausado.',
  rascunho: 'Ainda não entrou no fluxo: rascunho, backlog.',
  critico: 'Falhou ou foi negado: crítico, erro, recusado, rejeitado.',
}

// Contraste do texto, pior das três superfícies. Medido por scripts/status-badge.test.mjs.
const CONTRASTE: Record<string, [string, string]> = {
  warning: ['4,61:1', '7,41:1'],
  info: ['10,49:1', '5,81:1'],
  success: ['6,15:1', '8,03:1'],
  danger: ['5,91:1', '7,00:1'],
  outline: ['11,40:1', '14,20:1'],
  secondary: ['10,70:1', '12,51:1'],
}

const porGrupo = (g: StatusBadgeGrupo) =>
  Object.entries(STATUS_BADGE_SINONIMOS)
    .filter(([, grupo]) => grupo === g)
    .map(([chave]) => chave)

const codigo = `import { StatusBadge, statusBadge } from '@fips-app/ds-fips'

// Mostra o próprio texto do status, na cor do grupo
<StatusBadge status="em_andamento">Em andamento</StatusBadge>
<StatusBadge status="Fora do Prazo" />

// Só a variante, para quem monta o Badge sozinho
const { grupo, variant } = statusBadge(row.status)
<Badge variant={variant}>{row.status}</Badge>`

export default function StatusBadgeDoc() {
  return (
    <PlaygroundProvider>
      <DocPage
        title="StatusBadge"
        description="Mapa oficial de status para a cor do Badge. Sete grupos, uma variante cada, com os sinônimos que os apps já usam."
      >
        <DemoSection title="Grupos">
          <div className="grid gap-3 md:grid-cols-2">
            {ORDEM.map((g) => (
              <Copyable
                key={g}
                label={`StatusBadge ${g}`}
                code={`<StatusBadge status="${porGrupo(g)[0]}">${STATUS_BADGE_GRUPOS[g].label}</StatusBadge>`}
                preview={<StatusBadge status={g}>{STATUS_BADGE_GRUPOS[g].label}</StatusBadge>}
              >
                <div className="flex flex-col gap-2">
                  <div>
                    <StatusBadge status={g}>{STATUS_BADGE_GRUPOS[g].label}</StatusBadge>
                  </div>
                  <p className="text-xs text-[var(--color-fg-muted)]">{QUANDO[g]}</p>
                </div>
              </Copyable>
            ))}
          </div>
          <p className="mt-4 text-xs text-[var(--color-fg-muted)]">
            Atrasado e crítico usam a mesma variante (danger). O que muda é o texto: use o rótulo do grupo ou o do app.
          </p>
        </DemoSection>

        <DemoSection title="Tabela do mapa">
          <div className="overflow-x-auto rounded-[10px_10px_10px_18px] border border-[var(--color-border)] bg-[var(--color-surface)]">
            <table className="w-full text-left text-xs text-[var(--color-fg)]">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)]">
                  <th className="p-3">Grupo</th>
                  <th className="p-3">Variante</th>
                  <th className="p-3">Contraste claro</th>
                  <th className="p-3">Contraste escuro</th>
                  <th className="p-3">Status reconhecidos</th>
                </tr>
              </thead>
              <tbody>
                {ORDEM.map((g) => {
                  const v = STATUS_BADGE_GRUPOS[g].variant
                  return (
                    <tr key={g} className="border-b border-[var(--color-border)] align-top last:border-0">
                      <td className="p-3 font-semibold">{g}</td>
                      <td className="p-3"><code>{v}</code></td>
                      <td className="p-3">{CONTRASTE[v][0]}</td>
                      <td className="p-3">{CONTRASTE[v][1]}</td>
                      <td className="p-3 text-[var(--color-fg-muted)]">{porGrupo(g).join(', ')}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-[var(--color-fg-muted)]">
            A busca ignora caixa, acento e pontuação: <code>Em Votação</code>, <code>EM_VOTACAO</code> e <code>em votacao</code> dão o mesmo grupo.
            Status que não está na tabela volta <code>secondary</code>, sem grupo. Contraste do texto sobre as três superfícies (cartão, cartão suave e faixa), pior caso, travado em <code>scripts/status-badge.test.mjs</code>.
          </p>
        </DemoSection>

        <DemoSection title="Uso">
          <pre className="overflow-x-auto rounded-[10px_10px_10px_18px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-xs text-[var(--color-fg)]"><code>{codigo}</code></pre>
        </DemoSection>
      </DocPage>
    </PlaygroundProvider>
  )
}
