import { DocPage, DemoSection } from '../../components/DocPage'
import { CodeExportSection } from '../../components/CodeExport'
import { PlaygroundProvider, Copyable, CodePlayground } from '../../components/CodePlayground'
import { Skeleton } from '../../../components/ui/skeleton'

const cartaoCodigo = `import { Skeleton } from '@fips-app/ds-fips'

<div role="status" aria-label="Carregando requisição" className="space-y-3 rounded-xl border p-4">
  <Skeleton className="h-4 w-2/5" />
  <Skeleton className="h-3 w-full" />
  <Skeleton className="h-3 w-4/5" />
  <Skeleton className="h-9 w-28" />
</div>`

const linhaCodigo = `import { Skeleton, Table, TableBody, TableCell, TableRow } from '@fips-app/ds-fips'

<Table role="status" aria-label="Carregando lista">
  <TableBody>
    {Array.from({ length: 4 }, (_, i) => (
      <TableRow key={i}>
        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
        <TableCell><Skeleton className="h-4 w-48" /></TableCell>
        <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>`

const MEDIDAS = [
  ['Sobre --color-surface (cartão)', '1,33:1', '1,28:1'],
  ['Sobre --color-surface-soft', '1,31:1', '1,21:1'],
  ['Sobre --color-surface-muted (cabeçalho de tabela)', '1,25:1', '1,13:1'],
]

export default function SkeletonDoc() {
  return (
    <PlaygroundProvider>
      <DocPage
        title="Skeleton"
        description="Bloco de carregamento. Mostra a forma do conteúdo enquanto o dado não chega."
      >
        <DemoSection title="Cartão">
          <Copyable label="Skeleton de cartão" code={cartaoCodigo} preview={null}>
            <div
              role="status"
              aria-label="Carregando requisição"
              className="max-w-sm space-y-3 rounded-[12px_12px_12px_24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
            >
              <Skeleton className="h-4 w-2/5" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-4/5" />
              <Skeleton className="h-9 w-28" />
            </div>
          </Copyable>
        </DemoSection>

        <DemoSection title="Linha de tabela">
          <Copyable label="Skeleton de linha de tabela" code={linhaCodigo} preview={null}>
            <div
              role="status"
              aria-label="Carregando lista"
              className="overflow-x-auto rounded-[10px_10px_10px_18px] border border-[var(--color-border)] bg-[var(--color-surface)]"
            >
              <table className="w-full">
                <tbody>
                  {Array.from({ length: 4 }, (_, i) => (
                    <tr key={i} className="border-b border-[var(--color-border)] last:border-0">
                      <td className="p-3"><Skeleton className="h-4 w-20" /></td>
                      <td className="p-3"><Skeleton className="h-4 w-48" /></td>
                      <td className="p-3"><Skeleton className="h-5 w-16 rounded-full" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Copyable>
        </DemoSection>

        <DemoSection title="API, acessibilidade e movimento">
          <ul className="space-y-1.5 text-sm text-[var(--color-fg)]">
            <li><code>className</code> define tamanho e forma (<code>h-4 w-40</code>, <code>rounded-full</code> para avatar). Aceita as props de uma <code>div</code>.</li>
            <li>Cada bloco nasce com <code>aria-hidden="true"</code>. O aviso ao leitor de tela vai no contêiner: <code>role="status"</code> e <code>aria-label</code> ("Carregando lista"), uma vez só, não por bloco.</li>
            <li>Pulsa com <code>animate-pulse</code>. Com redução de movimento ligada no sistema, fica parado.</li>
            <li>Cor: <code>--color-border</code>, nos dois temas. Sem cor fixa.</li>
            <li>Use em tela leve que carrega em menos de 2 s. Para espera longa, use <code>BrandLoader</code> ou <code>Progress</code>.</li>
          </ul>
        </DemoSection>

        <DemoSection title="Contraste do bloco medido">
          <p className="mb-4 text-sm text-[var(--color-fg-muted)]">
            O bloco não é texto: o que se mede é se ele aparece sobre o fundo. Travado em <code>scripts/skeleton.test.mjs</code> (mínimo 1,2:1 sobre cartão e cartão suave).
          </p>
          <div className="overflow-x-auto rounded-[10px_10px_10px_18px] border border-[var(--color-border)] bg-[var(--color-surface)]">
            <table className="w-full text-left text-xs text-[var(--color-fg)]">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)]">
                  <th className="p-3">Fundo</th>
                  <th className="p-3">Claro</th>
                  <th className="p-3">Escuro</th>
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
            { label: 'Skeleton de cartão', description: 'Blocos dentro de um contêiner com role="status".', code: cartaoCodigo },
            { label: 'Skeleton de linha de tabela', description: 'Quatro linhas de espera enquanto a lista carrega.', code: linhaCodigo },
          ]}
        />
      </DocPage>
    </PlaygroundProvider>
  )
}
