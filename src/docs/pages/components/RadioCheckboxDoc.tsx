import { useState } from 'react'
import { DocPage, DemoSection } from '../../components/DocPage'
import { Checkbox } from '../../../components/ui/checkbox'
import { Radio, RadioGroup } from '../../../components/ui/radio'

const code = 'block overflow-x-auto rounded-lg bg-[var(--color-surface-muted)] p-4 text-xs leading-5 text-[var(--color-fg)]'

const PROPS_RADIOGROUP: [string, string, string][] = [
  ['name', 'string', 'Nome no formulário. Padrão: gerado.'],
  ['value / defaultValue', 'string', 'Opção marcada (controlado / não controlado).'],
  ['onValueChange', '(value: string) => void', 'Chamado ao marcar uma opção.'],
  ['label', 'ReactNode', 'Pergunta do grupo. Nomeia o grupo (aria-labelledby). Sem ela, passe aria-label.'],
  ['description / error', 'ReactNode', 'Apoio e erro. O erro liga aria-invalid no grupo; os dois entram em aria-describedby.'],
  ['required / disabled', 'boolean', 'required mostra o asterisco e liga aria-required; disabled desliga todas as opções.'],
  ['variant', "'default' | 'pill'", "pill mostra cada opção como pílula. Padrão: default."],
  ['orientation', "'vertical' | 'horizontal'", 'Padrão: vertical na lista, horizontal (com quebra) na pílula.'],
]
const PROPS_RADIO = [
  ['value', 'string', 'Obrigatório. Valor da opção dentro do grupo.'],
  ['label', 'ReactNode', 'Obrigatório. O rótulo é clicável.'],
  ['description', 'ReactNode', 'Apoio da opção (na pílula só vai para leitores de tela).'],
  ['disabled', 'boolean', 'Desliga só esta opção.'],
]
const PROPS_CHECKBOX = [
  ['label', 'ReactNode', 'Obrigatório. O rótulo é clicável.'],
  ['description', 'ReactNode', 'Apoio abaixo do rótulo (aria-describedby).'],
  ['error', 'ReactNode', 'Mensagem de erro: liga aria-invalid e aria-describedby e pinta a caixa de vermelho.'],
  ['required', 'boolean', 'Asterisco e atributo required.'],
  ['indeterminate', 'boolean', 'Estado misto (marcação parcial), só visual.'],
  ['checked / defaultChecked / onChange / disabled', 'nativos', 'Os do input nativo.'],
]

function Tabela({ linhas }: { linhas: string[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)] text-xs uppercase tracking-wider text-[var(--color-fg-muted)]">
            <th className="py-2 pr-4 font-semibold">Prop</th>
            <th className="py-2 pr-4 font-semibold">Tipo</th>
            <th className="py-2 font-semibold">Efeito</th>
          </tr>
        </thead>
        <tbody>
          {linhas.map(([p, t, d]) => (
            <tr key={p} className="border-b border-[var(--color-border)] align-top text-[var(--color-fg)]">
              <td className="py-2 pr-4 font-mono text-xs">{p}</td>
              <td className="py-2 pr-4 font-mono text-xs text-[var(--color-fg-muted)]">{t}</td>
              <td className="py-2">{d}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function RadioCheckboxDoc() {
  const [canal, setCanal] = useState('email')
  const [nivel, setNivel] = useState<string | undefined>()
  const [parecer, setParecer] = useState('')
  const [termos, setTermos] = useState(false)
  const [itens, setItens] = useState([true, false, false])
  const todos = itens.every(Boolean)
  const algum = itens.some(Boolean)

  return (
    <DocPage
      title="Radio e Checkbox"
      description="Escolha única (RadioGroup + Radio, em lista ou em pílula) e marcação independente (Checkbox). Rótulo clicável, descrição, erro anunciado, foco visível, claro e escuro."
    >
      <DemoSection title="RadioGroup em lista">
        <div className="grid gap-8 md:grid-cols-2">
          <RadioGroup label="Canal de aviso" value={canal} onValueChange={setCanal} description="Como a equipe recebe o resumo.">
            <Radio value="email" label="E-mail" />
            <Radio value="app" label="Aviso no aplicativo" description="Aparece no sino do cabeçalho." />
            <Radio value="nenhum" label="Sem aviso" disabled />
          </RadioGroup>
          <RadioGroup label="Prioridade" required error="Escolha uma prioridade." name="prioridade-erro">
            <Radio value="a" label="Alta" />
            <Radio value="b" label="Baixa" />
          </RadioGroup>
        </div>
      </DemoSection>

      <DemoSection title="RadioGroup em pílula (nível e parecer da auditoria)">
        <div className="space-y-6">
          <RadioGroup label="Nível" variant="pill" value={nivel} onValueChange={setNivel}>
            <Radio value="1" label="Nível 1" />
            <Radio value="2" label="Nível 2" />
            <Radio value="3" label="Nível 3" />
            <Radio value="4" label="Nível 4" />
          </RadioGroup>
          <RadioGroup label="Parecer" variant="pill" required value={parecer} onValueChange={setParecer} error={parecer ? undefined : 'Informe o parecer.'}>
            <Radio value="conforme" label="Conforme" />
            <Radio value="parcial" label="Parcial" />
            <Radio value="nao" label="Não conforme" />
            <Radio value="na" label="Não se aplica" disabled />
          </RadioGroup>
        </div>
      </DemoSection>

      <DemoSection title="Checkbox">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-1">
            <Checkbox label="Todos os itens" checked={todos} indeterminate={algum && !todos} onChange={(e) => setItens(itens.map(() => e.target.checked))} />
            <div className="space-y-1 pl-7">
              {['Segurança', 'Qualidade', 'Meio ambiente'].map((n, i) => (
                <Checkbox key={n} label={n} checked={itens[i]} onChange={(e) => setItens(itens.map((v, j) => (j === i ? e.target.checked : v)))} />
              ))}
            </div>
          </div>
          <div className="space-y-1">
            <Checkbox label="Li e aceito os termos" required description="Sem o aceite o envio fica bloqueado." error={termos ? undefined : 'Aceite os termos para continuar.'} checked={termos} onChange={(e) => setTermos(e.target.checked)} />
            <Checkbox label="Receber resumo semanal" defaultChecked />
            <Checkbox label="Desabilitado" disabled />
            <Checkbox label="Desabilitado e marcado" disabled defaultChecked />
          </div>
        </div>
      </DemoSection>

      <DemoSection title="Como usar">
        <pre className={code}>{`import { Checkbox, Radio, RadioGroup } from '@fips-app/ds-fips'

<RadioGroup label="Nível" variant="pill" value={nivel} onValueChange={setNivel}>
  <Radio value="1" label="Nível 1" />
  <Radio value="2" label="Nível 2" />
</RadioGroup>

<Checkbox label="Li e aceito" error={erro} checked={ok} onChange={(e) => setOk(e.target.checked)} />`}</pre>
      </DemoSection>

      <DemoSection title="Teclado e acessibilidade">
        <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--color-fg)]">
          <li>Radio: Tab entra no grupo (na opção marcada, ou na primeira), setas movem e marcam a opção (nas duas direções, com volta), Tab sai do grupo. É o comportamento nativo de input type="radio" com o mesmo name.</li>
          <li>Checkbox: Espaço alterna. Clicar no rótulo alterna.</li>
          <li>O grupo é role="radiogroup" nomeado pelo label; o erro liga aria-invalid e aria-describedby.</li>
          <li>Foco visível: anel --color-ring de 2px com recuo na cor do fundo, na caixa e na pílula.</li>
          <li>Contraste (WCAG 1.4.11, mínimo 3:1): borda de --color-border-control e caixa marcada em --color-switch-on, medidas nos dois temas por npm test.</li>
          <li>Na pílula a opção marcada usa --color-primary com texto branco e contorno --color-switch-on.</li>
        </ul>
      </DemoSection>

      <DemoSection title="Props">
        <div className="space-y-8">
          <div><h3 className="mb-2 text-sm font-semibold text-[var(--color-fg)]">RadioGroup</h3><Tabela linhas={PROPS_RADIOGROUP} /></div>
          <div><h3 className="mb-2 text-sm font-semibold text-[var(--color-fg)]">Radio</h3><Tabela linhas={PROPS_RADIO} /></div>
          <div><h3 className="mb-2 text-sm font-semibold text-[var(--color-fg)]">Checkbox</h3><Tabela linhas={PROPS_CHECKBOX} /></div>
        </div>
      </DemoSection>
    </DocPage>
  )
}
