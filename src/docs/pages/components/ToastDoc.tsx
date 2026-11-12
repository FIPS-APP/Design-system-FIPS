import { DocPage, DemoSection } from '../../components/DocPage'
import { CodeExportSection } from '../../components/CodeExport'
import { PlaygroundProvider, Copyable, CodePlayground } from '../../components/CodePlayground'
import { Button } from '../../../components/ui/button'
import { Toast, ToastViewport, useToast, type ToastData, type ToastVariant } from '../../../components/composites/Toast'

const VARIANTES: { variant: ToastVariant; nome: string; title: string; message: string; actionLabel?: string; timer: number }[] = [
  { variant: 'sucesso', nome: 'Sucesso', title: 'Salvo com sucesso', message: 'Requisição #4025 aprovada e encaminhada para compra.', timer: 65 },
  { variant: 'erro', nome: 'Erro', title: 'Erro ao salvar', message: 'Não foi possível conectar ao servidor. Tente novamente.', timer: 85 },
  { variant: 'atencao', nome: 'Atenção', title: 'Sessão expirando', message: 'Sua sessão expira em 5 minutos.', actionLabel: 'Renovar', timer: 40 },
  { variant: 'info', nome: 'Info', title: 'Novo registro', message: 'Fornecedor cadastrado por Carlos Santos.', timer: 55 },
  { variant: 'neutro', nome: 'Neutro', title: 'Dados sincronizados', message: 'Último sync: agora. 47 registros atualizados.', timer: 30 },
]

const DISPAROS: { rotulo: string; dados: ToastData }[] = [
  { rotulo: 'Sucesso', dados: { variant: 'sucesso', title: 'Salvo com sucesso', message: 'Requisição #4025 aprovada e encaminhada.', duration: 5000 } },
  { rotulo: 'Erro', dados: { variant: 'erro', title: 'Erro ao salvar', message: 'Falha de conexão com o servidor.', duration: 7000 } },
  { rotulo: 'Atenção', dados: { variant: 'atencao', title: 'Sessão expirando', message: 'Você será desconectado em 5 min.', duration: 6000, actionLabel: 'Renovar' } },
  { rotulo: 'Info', dados: { variant: 'info', title: 'Novo registro', message: 'Fornecedor cadastrado por Carlos Santos.', duration: 5000 } },
  { rotulo: 'Neutro', dados: { variant: 'neutro', title: 'Sincronizado', message: '47 registros atualizados.', duration: 4000 } },
  { rotulo: 'Com ação', dados: { variant: 'info', title: 'Registro excluído', message: 'Fornecedor removido da lista.', duration: 8000, actionLabel: 'Desfazer' } },
]

const GUIA = [
  { nome: 'Sucesso', quando: 'Salvar, aprovar, excluir, cadastrar. Toda ação que completou.', timer: '5s, sem ação.', ex: 'Requisição aprovada; Cadastro salvo.' },
  { nome: 'Erro', quando: 'Falha de conexão, erro no servidor, timeout, permissão negada.', timer: '7s. Dizer o que falhou.', ex: 'Erro ao salvar; Permissão insuficiente.' },
  { nome: 'Atenção', quando: 'Sessão expirando, prazo próximo, dado desatualizado.', timer: '6s, ou com ação como Renovar.', ex: 'Sessão expirando; Prazo em 24h.' },
  { nome: 'Info', quando: 'Novo registro por outro usuário, atualização de fundo.', timer: '5s, só informa.', ex: 'Novo fornecedor cadastrado; Relatório gerado.' },
  { nome: 'Neutro', quando: 'Sincronização, confirmação menor, status do sistema.', timer: '4s, discreto.', ex: 'Dados sincronizados; Preferências salvas.' },
  { nome: 'Com ação', quando: 'Exclusão com desfazer, ação reversível, convite para fluxo.', timer: '8s ou mais, para dar tempo de clicar.', ex: 'Registro excluído, Desfazer.' },
]

const CONTRASTE = [
  ['Sucesso', '--color-semantic-sucesso-fg', '6,15:1', '9,18:1', '--color-success-text', '5,17:1', '9,18:1'],
  ['Erro', '--color-semantic-critico-fg', '5,91:1', '7,94:1', '--color-danger', '3,44:1', '4,01:1'],
  ['Atenção', '--color-semantic-atencao-fg', '4,88:1', '8,49:1', '--color-semantic-atencao-fg', '4,88:1', '8,49:1'],
  ['Info', '--color-semantic-info-fg', '10,49:1', '6,68:1', '--color-semantic-info-fg', '10,49:1', '6,68:1'],
  ['Neutro', '--color-fg', '10,70:1', '12,51:1', '--color-fg-muted', '4,74:1', '6,04:1'],
]

const usoCodigo = (v: (typeof VARIANTES)[number]) => `import { Toast } from '@fips-app/ds-fips'

<Toast
  variant="${v.variant}"
  title="${v.title}"
  message="${v.message}"${v.actionLabel ? `\n  actionLabel="${v.actionLabel}"\n  onAction={() => {}}` : ''}
  onClose={() => {}}
/>`

const hookCodigo = `import { Button, ToastViewport, useToast } from '@fips-app/ds-fips'

function App() {
  const { toasts, addToast, removeToast } = useToast()
  return (
    <>
      <ToastViewport toasts={toasts} onClose={removeToast} />
      <Button
        onClick={() =>
          addToast({ variant: 'sucesso', title: 'Salvo!', message: 'Registro salvo.', duration: 5000 })
        }
      >
        Salvar
      </Button>
    </>
  )
}
`

export default function ToastDoc() {
  const { toasts, addToast, removeToast } = useToast()

  return (
    <PlaygroundProvider>
      <ToastViewport toasts={toasts} onClose={removeToast} />
      <DocPage
        title="Toast"
        description="Aviso passageiro de feedback de ação. Aparece no canto superior direito, fecha sozinho com barra de tempo e empilha até 5."
      >
        <DemoSection title="Playground interativo">
          <p className="mb-4 text-sm text-[var(--color-fg-muted)]">
            Cada botão dispara um aviso real no canto superior direito. O X fecha na hora.
          </p>
          <div className="flex flex-wrap gap-2.5">
            {DISPAROS.map((d) => (
              <Button key={d.rotulo} variant="outline" size="sm" onClick={() => addToast(d.dados)}>
                {d.rotulo}
              </Button>
            ))}
          </div>
        </DemoSection>

        <DemoSection title="Variantes">
          <p className="mb-4 text-sm text-[var(--color-fg-muted)]">
            Cinco variantes: fundo, borda, texto e ícone vêm dos tokens semânticos e mudam sozinhos no tema escuro. Clique para copiar o código.
          </p>
          <div className="flex max-w-[420px] flex-col gap-3">
            {VARIANTES.map((v) => (
              <Copyable
                key={v.variant}
                label={`Toast ${v.nome}`}
                code={usoCodigo(v)}
                preview={<Toast variant={v.variant} title={v.title} message={v.message} actionLabel={v.actionLabel} />}
              >
                <Toast
                  variant={v.variant}
                  title={v.title}
                  message={v.message}
                  actionLabel={v.actionLabel}
                  onClose={() => {}}
                  className="animate-none"
                />
              </Copyable>
            ))}
          </div>
        </DemoSection>

        <DemoSection title="Guia de uso por variante">
          <div className="grid gap-4 md:grid-cols-2">
            {GUIA.map((g) => (
              <div key={g.nome} className="rounded-[10px_10px_10px_18px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
                <div className="text-[13px] font-bold text-[var(--color-fg)]">{g.nome}</div>
                <p className="mt-2 text-[13px] text-[var(--color-fg)]">{g.quando}</p>
                <p className="mt-2 text-xs text-[var(--color-fg-muted)]">Tempo: {g.timer}</p>
                <p className="mt-2 border-l-2 border-[var(--color-border)] pl-2.5 text-xs italic text-[var(--color-fg-muted)]">{g.ex}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-[var(--color-fg-muted)]">
            Aviso com ação: 8s ou mais. Erro crítico: sem <code>duration</code>, fecha só pelo X.
          </p>
        </DemoSection>

        <DemoSection title="Anatomia e comportamento">
          <div className="grid gap-6 rounded-[12px_12px_12px_24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 md:grid-cols-2">
            <ul className="space-y-1.5 text-xs text-[var(--color-fg)]">
              <li>Borda lateral de 4px na cor de destaque da variante.</li>
              <li>Ícone de 22px conforme a variante.</li>
              <li>Título 13px em negrito e mensagem 12px.</li>
              <li>Botão de ação em contorno, na cor do texto.</li>
              <li>X de 14px que fecha na hora.</li>
              <li>Barra de tempo de 3px a 35% de opacidade.</li>
            </ul>
            <ul className="space-y-1.5 text-xs text-[var(--color-fg)]">
              <li>Posição fixa, 16px do canto superior direito, z-index 9999.</li>
              <li>Entrada deslizando da direita em 0,35s; saída em 0,3s.</li>
              <li>Largura 360px, no máximo 100vw menos 32px.</li>
              <li>Pilha de até 5, o mais novo em cima.</li>
              <li>Erro usa <code>role="alert"</code>; as demais, <code>role="status"</code>.</li>
              <li>Com redução de movimento ligada, sem animação.</li>
            </ul>
          </div>
        </DemoSection>

        <DemoSection title="Contraste medido">
          <p className="mb-4 text-sm text-[var(--color-fg-muted)]">
            Texto sobre o fundo do aviso (mínimo 4,5:1) e destaque da borda e do ícone (mínimo 3:1), sobre o cartão, nos dois temas. Travado em <code>scripts/contraste-toast.test.mjs</code>.
          </p>
          <div className="overflow-x-auto rounded-[10px_10px_10px_18px] border border-[var(--color-border)] bg-[var(--color-surface)]">
            <table className="w-full text-left text-xs text-[var(--color-fg)]">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)]">
                  <th className="p-3">Variante</th>
                  <th className="p-3">Texto (token)</th>
                  <th className="p-3">Claro</th>
                  <th className="p-3">Escuro</th>
                  <th className="p-3">Destaque (token)</th>
                  <th className="p-3">Claro</th>
                  <th className="p-3">Escuro</th>
                </tr>
              </thead>
              <tbody>
                {CONTRASTE.map((l) => (
                  <tr key={l[0]} className="border-b border-[var(--color-border)] last:border-0">
                    {l.map((c, i) => (
                      <td key={i} className={i === 1 || i === 4 ? 'p-3 font-mono text-[11px]' : 'p-3'}>{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DemoSection>

        <CodePlayground />

        <CodeExportSection
          items={[
            {
              label: 'Toast com useToast',
              description: 'Pilha de avisos com variantes, barra de tempo e até 5 empilhados, vinda do pacote.',
              code: hookCodigo,
            },
          ]}
        />
      </DocPage>
    </PlaygroundProvider>
  )
}
