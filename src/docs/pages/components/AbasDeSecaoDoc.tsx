import { useState, type CSSProperties, type ReactNode } from 'react'
import { Palette, SlidersHorizontal, Smartphone } from 'lucide-react'
import { AbasDeSecao, type AbaDeSecao } from '../../../components/composites/AbasDeSecao'

const ABAS: AbaDeSecao[] = [
  { id: 'modo', label: 'Modo', icon: SlidersHorizontal },
  { id: 'tema', label: 'Tema', icon: Palette },
  { id: 'aparelho', label: 'Aparelho', icon: Smartphone },
]

const SEIS: AbaDeSecao[] = ['Início', 'Registro', 'Meus OPAs', 'Pendências', 'Ajustes', 'Ajuda'].map((label) => ({
  id: label,
  label,
}))

function Texto() {
  return (
    <div className="space-y-3 text-sm text-[var(--color-fg-muted)]">
      {Array.from({ length: 24 }, (_, i) => (
        <p key={i}>Conteúdo rolável da aba, linha {i + 1}. A faixa fica parada enquanto isto rola.</p>
      ))}
    </div>
  )
}

/**
 * Moldura de celular. O `transform` cria o bloco de contenção do `position: fixed`
 * da faixa de rodapé: sem ele a faixa grudaria na janela do navegador e cobriria o site.
 */
function Moldura({
  demo,
  largura = 375,
  variaveis,
  abas = ABAS,
  posicao = 'rodape',
  extra,
  ativaInicial,
}: {
  demo: string
  largura?: number
  variaveis?: Record<string, string>
  abas?: AbaDeSecao[]
  posicao?: 'topo' | 'rodape'
  extra?: ReactNode
  ativaInicial?: string
}) {
  const [ativa, setAtiva] = useState(ativaInicial ?? abas[0].id)
  const estilo = {
    width: largura,
    height: 560,
    transform: 'translateZ(0)',
    '--barra-inferior-altura': '46px',
    ...variaveis,
  } as CSSProperties
  return (
    <div
      data-demo={demo}
      style={estilo}
      className="relative overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)]"
    >
      {posicao === 'topo' ? (
        <>
          <AbasDeSecao abas={abas} ativa={ativa} onSelecionar={setAtiva} posicao="topo" label={`Abas ${demo}`} />
          <div data-rolavel className="h-[calc(100%-var(--abas-secao-altura))] overflow-y-auto p-4">
            <Texto />
          </div>
        </>
      ) : (
        <>
          <div data-rolavel className="abas-secao-reserva h-full overflow-y-auto p-4">
            <Texto />
          </div>
          {extra}
          <AbasDeSecao abas={abas} ativa={ativa} onSelecionar={setAtiva} posicao="rodape" label={`Abas ${demo}`} />
          <div
            data-barra
            className="absolute inset-x-0 bottom-0 z-40 flex h-[46px] items-center justify-around bg-[var(--color-fips-blue-950)] text-xs text-white"
          >
            <span>Home</span>
            <span>Meus</span>
            <span>Pendências</span>
            <span>Ajustes</span>
          </div>
        </>
      )}
    </div>
  )
}

const CODIGO = `import { useState } from 'react'
import { AbasDeSecao } from '@fips-app/ds-fips'

// O app publica a altura da própria barra inferior:
// :root { --barra-inferior-altura: 54px; }
// Se existe uma faixa fixa no mesmo vão (por exemplo "registro na fila"):
// :root { --abas-secao-empilha: 40px; }

export function Configuracoes() {
  const [aba, setAba] = useState('modo')
  return (
    <>
      <main className="abas-secao-reserva">…conteúdo…</main>
      <AbasDeSecao
        posicao="rodape"
        label="Configurações"
        abas={[
          { id: 'modo', label: 'Modo' },
          { id: 'tema', label: 'Tema' },
          { id: 'aparelho', label: 'Aparelho' },
        ]}
        ativa={aba}
        onSelecionar={setAba}
      />
    </>
  )
}`

function Secao({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="mb-3 font-heading text-xl font-bold text-[var(--color-fg)]">{titulo}</h2>
      {children}
    </section>
  )
}

export default function AbasDeSecaoDoc() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="font-heading text-3xl font-bold text-[var(--color-fg)]">AbasDeSecao</h1>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--color-fg-muted)]">
        Faixa de abas de seção. No topo fica abaixo do cabeçalho. No rodapé fica fixa logo acima da barra de
        navegação do app, porque no celular a faixa do topo sai da tela assim que a página rola e o polegar já está
        embaixo. As molduras abaixo têm 375px e 412px de largura.
      </p>

      <div className="mt-4 max-w-3xl rounded-2xl border border-[var(--color-semantic-critico-border)] bg-[var(--color-semantic-critico-bg)] p-4 text-sm leading-relaxed text-[var(--color-semantic-critico-fg)]">
        <strong>Sem <code>--barra-inferior-altura</code> a faixa some.</strong> O app tem de publicar a altura da
        própria barra. Sem ela a faixa fica em <code>bottom: 0</code>, por baixo da barra. No OPA-MOBILE:{' '}
        <code>--barra-inferior-altura: var(--barra-abas-altura)</code> e{' '}
        <code>--abas-secao-empilha: var(--faixa-estado-altura, 0px)</code>. A classe{' '}
        <code>abas-secao-reserva</code> substitui a reserva do app: tire a do app do <strong>mesmo elemento</strong>,
        porque uma regra sem camada do app vence a do pacote. Se o app já reserva a altura da faixa de estado no
        corpo da página, não some a reserva duas vezes. Ancestral com <code>transform</code> vira o bloco de
        contenção do <code>fixed</code>.
      </div>

      <Secao titulo="Topo">
        <Moldura demo="topo" posicao="topo" />
      </Secao>

      <Secao titulo="Rodapé, 375px">
        <Moldura demo="rodape-375" />
      </Secao>

      <Secao titulo="Rodapé, 412px">
        <Moldura demo="rodape-412" largura={412} />
      </Secao>

      <Secao titulo="Rodapé com uma faixa fixa no mesmo vão">
        <p className="mb-3 max-w-3xl text-sm text-[var(--color-fg-muted)]">
          A faixa de estado do app (fundo opaco, z-index 40) mora entre as abas e a barra. Quem a tem publica a altura
          em <code>--abas-secao-empilha</code>, e as abas sobem. Sem isso um único registro na fila cobriria as três
          abas por completo.
        </p>
        <Moldura
          demo="empilha"
          variaveis={{ '--abas-secao-empilha': '40px' }}
          extra={
            <div
              data-faixa-estado
              className="absolute inset-x-0 z-40 flex h-10 items-center bg-[var(--color-fips-yellow-600)] px-4 text-xs font-semibold text-[var(--color-fips-blue-950)]"
              style={{ bottom: 'var(--barra-inferior-altura)' }}
            >
              Seu registro está na fila
            </div>
          }
        />
      </Secao>

      <Secao titulo="Altura em variável">
        <p className="mb-3 max-w-3xl text-sm text-[var(--color-fg-muted)]">
          A altura é <code>--abas-secao-altura</code>, que vale <code>max(39px, var(--alvo-toque))</code>: 39px acima de
          767px e o alvo de toque do modo no celular (44px no normal, 48px no fácil, via <code>data-modo</code>). A
          reserva da página deriva dela com a classe <code>abas-secao-reserva</code>, que substitui a reserva da barra
          e não soma. Aqui a variável vale 48px.
        </p>
        <Moldura demo="altura" variaveis={{ '--abas-secao-altura': '48px' }} />
      </Secao>

      <Secao titulo="Uma aba e seis abas">
        <div className="flex flex-wrap gap-6">
          <Moldura demo="uma" abas={[ABAS[0]]} />
          <Moldura demo="seis" abas={SEIS} ativaInicial="Ajuda" />
        </div>
      </Secao>

      <Secao titulo="As três armadilhas do rodapé">
        <ol className="max-w-3xl list-decimal space-y-2 pl-5 text-sm leading-relaxed text-[var(--color-fg-muted)]">
          <li>
            A faixa não é a única coisa fixa nesse vão. Declare a altura do outro elemento em{' '}
            <code>--abas-secao-empilha</code>.
          </li>
          <li>
            O traço da aba ativa pousa sobre a separação. Ela troca de lado com a posição e o traço troca junto. Os dois
            ficam dentro da caixa da faixa, porque o <code>overflow-x</code> dela recortaria o que saísse. A separação
            é um <code>box-shadow</code> inset.
          </li>
          <li>
            A altura mora em <code>--abas-secao-altura</code>. Escrever o número à mão na faixa e na página quebra o
            respiro em silêncio quando o valor muda. E <code>--alvo-toque</code> é declarada junto de cada{' '}
            <code>data-modo</code>, não só na raiz: a propriedade que lê outra resolve no elemento onde foi declarada,
            e um contêiner interno em modo fácil herdaria o 35px da raiz.
          </li>
        </ol>
      </Secao>

      <Secao titulo="Uso">
        <pre className="max-w-3xl overflow-x-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-xs leading-relaxed text-[var(--color-fg)]">
          {CODIGO}
        </pre>
      </Secao>
    </div>
  )
}
