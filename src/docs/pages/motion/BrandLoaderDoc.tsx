import { useState } from 'react'
import { BrandLoader, type BrandLoaderSize } from '../../../components/brand/BrandLoader'

const SIZES: { key: BrandLoaderSize; label: string; px: string; uso: string }[] = [
  { key: 'sm', label: 'sm', px: '96 px', uso: 'dentro de card, célula ou botão grande' },
  { key: 'md', label: 'md', px: '180 px', uso: 'overlay de ação, tela de módulo' },
  { key: 'lg', label: 'lg', px: '280 px', uso: 'estado vazio, carregamento de página' },
  { key: 'splash', label: 'splash', px: '420 px', uso: 'abertura do app e login' },
]

const SPEC = [
  ['Duração', '4 s em loop · 24 fps'],
  ['Entrada da cor', 'começa em 10% e fecha em 80% do ciclo, da esquerda para a direita'],
  ['Cores', 'símbolo #7A818B · wordmark #004B9B · contorno nas mesmas cores'],
  ['Formato', 'WebM VP9 com canal alfa (56 KB) · APNG de fallback (165 KB)'],
  ['Fundo', 'transparente — assenta sobre qualquer superfície, clara ou escura'],
  ['Origem', 'renderizado da arte oficial da marca, não vetorizado'],
  ['Movimento reduzido', 'exibe o quadro final estático, já colorido'],
]

export default function BrandLoaderDoc() {
  const [size, setSize] = useState<BrandLoaderSize>('md')
  const [dark, setDark] = useState(false)

  return (
    <div className="flex flex-col gap-10 pb-16">
      <header className="flex flex-col gap-3">
        <p className="font-heading text-[11px] uppercase tracking-[0.22em] text-[var(--color-primary)]">
          Motion
        </p>
        <h1 className="font-heading text-3xl text-[var(--color-fg)]">BrandLoader</h1>
        <p className="max-w-[68ch] text-[var(--color-fg-muted)]">
          A marca FIPS extrudada em 3D nasce branca, com o contorno já nas cores da marca, e
          recebe a cor da esquerda para a direita conforme a tela carrega. É a peça de espera
          institucional do sistema — a que a pessoa vê ao abrir o app.
        </p>
      </header>

      {/* palco */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {SIZES.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setSize(s.key)}
              className={
                'rounded-[10px_10px_10px_18px] border px-3 py-1.5 text-sm font-semibold transition ' +
                (size === s.key
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                  : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-fg)]')
              }
            >
              {s.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setDark((d) => !d)}
            className="ml-auto rounded-[10px_10px_10px_18px] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-sm font-semibold text-[var(--color-fg)]"
          >
            {dark ? 'Fundo claro' : 'Fundo escuro'}
          </button>
        </div>

        <div
          className="flex min-h-[380px] items-center justify-center rounded-[12px_12px_12px_24px] border border-[var(--color-border)] p-8"
          style={{ background: dark ? '#1A1A1A' : 'var(--color-surface)' }}
        >
          <BrandLoader size={size} caption="Sincronizando QLP" />
        </div>

        <p className="text-sm text-[var(--color-fg-muted)]">
          O fundo alterna para provar o canal alfa: a marca não carrega retângulo branco atrás.
        </p>
      </section>

      {/* tamanhos */}
      <section className="flex flex-col gap-4">
        <h2 className="font-heading text-sm uppercase tracking-[0.14em] text-[var(--color-primary)]">
          Tamanhos
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="py-2 pr-4 font-heading text-[11px] uppercase tracking-[0.12em] text-[var(--color-fg-muted)]">
                  Valor
                </th>
                <th className="py-2 pr-4 font-heading text-[11px] uppercase tracking-[0.12em] text-[var(--color-fg-muted)]">
                  Largura
                </th>
                <th className="py-2 font-heading text-[11px] uppercase tracking-[0.12em] text-[var(--color-fg-muted)]">
                  Usar em
                </th>
              </tr>
            </thead>
            <tbody>
              {SIZES.map((s) => (
                <tr key={s.key} className="border-b border-[var(--color-border)]">
                  <td className="py-2.5 pr-4 font-mono text-[13px] text-[var(--color-fg)]">{s.key}</td>
                  <td className="py-2.5 pr-4 text-[var(--color-fg-muted)]">{s.px}</td>
                  <td className="py-2.5 text-[var(--color-fg-muted)]">{s.uso}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* spec */}
      <section className="flex flex-col gap-4">
        <h2 className="font-heading text-sm uppercase tracking-[0.14em] text-[var(--color-primary)]">
          Especificação
        </h2>
        <dl className="grid gap-2">
          {SPEC.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[160px_1fr] gap-4 border-b border-[var(--color-border)] pb-2">
              <dt className="font-heading text-[11px] uppercase tracking-[0.12em] text-[var(--color-fg-muted)]">
                {k}
              </dt>
              <dd className="text-sm text-[var(--color-fg-muted)]">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* uso */}
      <section className="flex flex-col gap-4">
        <h2 className="font-heading text-sm uppercase tracking-[0.14em] text-[var(--color-primary)]">
          Como usar
        </h2>
        <pre className="overflow-x-auto rounded-[10px_10px_10px_18px] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4 text-[13px] leading-relaxed text-[var(--color-fg)]">
{`import { BrandLoader } from '@fips-app/ds-fips'

// abertura do app
<BrandLoader size="splash" />

// overlay de ação, com legenda
<BrandLoader size="md" caption="Gerando PDF" label="Gerando o PDF do escopo" />`}
        </pre>
        <p className="max-w-[68ch] text-sm text-[var(--color-fg-muted)]">
          Os arquivos de motion são servidos de <code>/motion</code>. Se a aplicação publicar os
          assets em outro caminho, passe <code>basePath</code>.
        </p>
      </section>

      {/* regras */}
      <section className="flex flex-col gap-4">
        <h2 className="font-heading text-sm uppercase tracking-[0.14em] text-[var(--color-primary)]">
          Quando usar, quando não
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[12px_12px_12px_24px] border border-[var(--color-border)] p-4">
            <p className="mb-2 font-heading text-sm text-[var(--color-fg)]">Use</p>
            <ul className="ml-4 list-disc text-sm text-[var(--color-fg-muted)]">
              <li>abertura do app e tela de login</li>
              <li>ação longa e explícita: gerar PDF, sincronizar QLP, importar lote</li>
              <li>troca de módulo, quando a espera passa de 1 segundo</li>
            </ul>
          </div>
          <div className="rounded-[12px_12px_12px_24px] border border-[var(--color-border)] p-4">
            <p className="mb-2 font-heading text-sm text-[var(--color-fg)]">Não use</p>
            <ul className="ml-4 list-disc text-sm text-[var(--color-fg-muted)]">
              <li>dentro de tabela carregando — ali vai skeleton, que mostra a forma do dado</li>
              <li>em botão pequeno ou célula — a marca fica ilegível abaixo de 96 px</li>
              <li>mais de um por tela: é assinatura, não decoração</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
