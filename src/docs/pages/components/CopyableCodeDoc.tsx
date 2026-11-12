import { DocPage, DemoSection } from '../../components/DocPage'
import { CodeExportSection } from '../../components/CodeExport'
import { PlaygroundProvider, Copyable, CodePlayground } from '../../components/CodePlayground'
import { CopyableCode } from '../../../components/ui/copyable-code'

const basicoCodigo = `import { CopyableCode } from '@fips-app/ds-fips'

<CopyableCode value="OPA-2026-00417" />`

const exibidoCodigo = `<CopyableCode value="https://opa.fips.com.br/r/00417" copyLabel="Copiar link" copiedLabel="Link copiado">
  opa.fips.com.br/r/00417
</CopyableCode>`

const whatsappCodigo = `<CopyableCode value="(11) 99999-0000" whatsapp />
// copia "(11) 99999-0000" e abre https://wa.me/5511999990000`

const MEDIDAS = [
  ['Texto do código sobre --color-surface-soft', '11,18:1', '13,45:1', '4,5:1'],
  ['Texto do botão sobre --color-surface-soft', '11,18:1', '13,45:1', '4,5:1'],
  ['Texto do botão no hover (--color-surface-muted)', '10,70:1', '12,51:1', '4,5:1'],
  ['Link do WhatsApp (--color-primary-text) sobre --color-surface-soft', '8,31:1', '8,35:1', '4,5:1'],
  ['Contorno (--color-border-control) sobre --color-surface', '3,39:1', '3,62:1', '3:1'],
]

export default function CopyableCodeDoc() {
  return (
    <PlaygroundProvider>
      <DocPage
        title="CopyableCode"
        description="Texto ou código com botão de copiar. Serve para número de protocolo, link, chave e telefone."
      >
        <DemoSection title="Básico">
          <Copyable label="CopyableCode básico" code={basicoCodigo} preview={null}>
            <CopyableCode value="OPA-2026-00417" />
          </Copyable>
        </DemoSection>

        <DemoSection title="Texto exibido diferente do copiado">
          <Copyable label="CopyableCode com texto exibido" code={exibidoCodigo} preview={null}>
            <CopyableCode value="https://opa.fips.com.br/r/00417" copyLabel="Copiar link" copiedLabel="Link copiado">
              opa.fips.com.br/r/00417
            </CopyableCode>
          </Copyable>
        </DemoSection>

        <DemoSection title="Telefone com link do WhatsApp">
          <Copyable label="CopyableCode com WhatsApp" code={whatsappCodigo} preview={null}>
            <CopyableCode value="(11) 99999-0000" whatsapp />
          </Copyable>
        </DemoSection>

        <DemoSection title="API, acessibilidade e falha">
          <ul className="space-y-1.5 text-sm text-[var(--color-fg)]">
            <li><code>value</code> é o que vai para a área de transferência. <code>children</code> troca só o que aparece.</li>
            <li>O botão tem rótulo visível ("Copiar"), então o nome acessível é o próprio texto. Troque por <code>copyLabel</code> e <code>copiedLabel</code>.</li>
            <li>Depois de copiar, o botão mostra "Copiado" por 2 s (<code>resetMs</code>) e uma região <code>role="status"</code> anuncia o mesmo texto ao leitor de tela.</li>
            <li>Sem <code>navigator.clipboard</code> (página sem HTTPS) ou com recusa, tenta <code>execCommand('copy')</code>. Se nada copiar, avisa por <code>errorLabel</code> e seleciona o texto para copiar à mão.</li>
            <li><code>whatsapp</code> trata o valor como telefone: só dígitos, 55 na frente de DDD + número, link <code>https://wa.me/&lt;número&gt;</code> em nova aba. Valor com menos de 10 dígitos não mostra o link.</li>
            <li><code>copiarTexto(texto)</code> e <code>linkWhatsApp(numero)</code> saem pelo pacote para quem precisa só da função.</li>
          </ul>
        </DemoSection>

        <DemoSection title="Contraste medido">
          <p className="mb-4 text-sm text-[var(--color-fg-muted)]">
            Travado em <code>scripts/copyable-code.test.mjs</code>. Texto a partir de 4,5:1, contorno de controle a partir de 3:1.
          </p>
          <div className="overflow-x-auto rounded-[10px_10px_10px_18px] border border-[var(--color-border)] bg-[var(--color-surface)]">
            <table className="w-full text-left text-xs text-[var(--color-fg)]">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)]">
                  <th className="p-3">Par</th>
                  <th className="p-3">Claro</th>
                  <th className="p-3">Escuro</th>
                  <th className="p-3">Mínimo</th>
                </tr>
              </thead>
              <tbody>
                {MEDIDAS.map((l) => (
                  <tr key={l[0]} className="border-b border-[var(--color-border)] last:border-0">
                    {l.map((c, i) => <td key={i} className="p-3">{c}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DemoSection>

        <CodePlayground />

        <CodeExportSection
          items={[
            { label: 'CopyableCode básico', description: 'Valor com botão Copiar.', code: basicoCodigo },
            { label: 'CopyableCode com texto exibido', description: 'Mostra o link curto e copia o completo.', code: exibidoCodigo },
            { label: 'CopyableCode com WhatsApp', description: 'Telefone com link wa.me.', code: whatsappCodigo },
          ]}
        />
      </DocPage>
    </PlaygroundProvider>
  )
}
