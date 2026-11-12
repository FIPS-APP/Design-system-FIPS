import { useState } from 'react'
import { Copy, EllipsisVertical, LogOut, Pencil, Settings, Trash2 } from 'lucide-react'
import { DocPage, DemoSection } from '../../components/DocPage'
import { CodeExportSection } from '../../components/CodeExport'
import { PlaygroundProvider, Copyable, CodePlayground } from '../../components/CodePlayground'
import { Button } from '../../../components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu'
import { Separator } from '../../../components/ui/separator'

const ACOES = `import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@fips-app/ds-fips'

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline" size="iconSm" aria-label="Ações da linha">
      <EllipsisVertical />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem onSelect={editar}><Pencil /> Editar</DropdownMenuItem>
    <DropdownMenuItem onSelect={duplicar}><Copy /> Duplicar</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem variant="destructive" onSelect={excluir}><Trash2 /> Excluir</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`

const FILTRO = `<DropdownMenu>
  <DropdownMenuTrigger asChild><Button variant="outline">Colunas</Button></DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Mostrar colunas</DropdownMenuLabel>
    <DropdownMenuCheckboxItem checked={mostraLocal} onCheckedChange={setMostraLocal}>
      Local
    </DropdownMenuCheckboxItem>
  </DropdownMenuContent>
</DropdownMenu>`

const SEPARADOR = `import { Separator } from '@fips-app/ds-fips'

<Separator className="my-4" />
<Separator orientation="vertical" className="h-5" />`

const CONTRASTE = [
  ['Item', '--color-fg', '--color-surface', '11,40:1', '14,20:1'],
  ['Item em foco', '--color-fg', 'acento a 20% (claro) e 12% (escuro) sobre o cartão', '10,34:1', '10,94:1'],
  ['Item destrutivo', '--color-danger-text', '--color-surface', '6,47:1', '9,17:1'],
  ['Destrutivo em foco', '--color-danger-text', 'vermelho a 10% sobre o cartão', '5,68:1', '8,33:1'],
  ['Rótulo', '--color-fg-muted', '--color-surface', '5,05:1', '6,86:1'],
]

export default function DropdownMenuDoc() {
  const [colunaLocal, setColunaLocal] = useState(true)
  const [colunaResp, setColunaResp] = useState(false)
  const [ultima, setUltima] = useState('nenhuma')

  return (
    <PlaygroundProvider>
      <DocPage
        title="DropdownMenu e Separator"
        description="Menu que abre num gatilho (ações da linha, colunas, conta) e a linha fina que separa blocos. API do shadcn sobre Radix, no visual do menu da conta da Gestão OPA."
      >
        <DemoSection title="Ações da linha">
          <p className="mb-4 text-sm text-[var(--color-fg-muted)]">
            Setas, Home e End movem o foco, Enter ou Espaço escolhem, Esc fecha e devolve o foco ao botão. Última ação: <strong>{ultima}</strong>.
          </p>
          <Copyable
            label="Menu de ações"
            code={ACOES}
            preview={<span className="text-xs text-[var(--color-fg-muted)]">Menu com três ações</span>}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="iconSm" aria-label="Ações da linha">
                  <EllipsisVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onSelect={() => setUltima('Editar')}>
                  <Pencil /> Editar
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setUltima('Duplicar')}>
                  <Copy /> Duplicar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onSelect={() => setUltima('Excluir')}>
                  <Trash2 /> Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Copyable>
        </DemoSection>

        <DemoSection title="Rótulo, grupo e item marcável">
          <Copyable
            label="Menu com marcação"
            code={FILTRO}
            preview={<span className="text-xs text-[var(--color-fg-muted)]">Menu com rótulo e itens marcáveis</span>}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Colunas</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>Mostrar colunas</DropdownMenuLabel>
                <DropdownMenuGroup>
                  <DropdownMenuCheckboxItem checked={colunaLocal} onCheckedChange={setColunaLocal} onSelect={(e) => e.preventDefault()}>
                    Local
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked={colunaResp} onCheckedChange={setColunaResp} onSelect={(e) => e.preventDefault()}>
                    Responsável
                  </DropdownMenuCheckboxItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings /> Mais opções
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive">
                  <LogOut /> Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Copyable>
          <p className="mt-3 text-xs text-[var(--color-fg-muted)]">
            Para manter o menu aberto ao marcar, use <code>onSelect={'{(e) => e.preventDefault()}'}</code> no item.
          </p>
        </DemoSection>

        <DemoSection title="Separator">
          <Copyable
            label="Separator"
            code={SEPARADOR}
            preview={<span className="text-xs text-[var(--color-fg-muted)]">Linha horizontal e vertical</span>}
          >
            <div className="max-w-sm rounded-[10px_10px_10px_18px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm text-[var(--color-fg)]">
              <p>Inspeção 4025</p>
              <Separator className="my-3" />
              <div className="flex h-5 items-center gap-3 text-xs text-[var(--color-fg-muted)]">
                <span>Aberta</span>
                <Separator orientation="vertical" />
                <span>Vence em 3 dias</span>
              </div>
            </div>
          </Copyable>
          <p className="mt-3 text-xs text-[var(--color-fg-muted)]">
            Decorativo por padrão (some para o leitor de tela). Com <code>decorative={'{false}'}</code> vira <code>role="separator"</code>.
          </p>
        </DemoSection>

        <DemoSection title="Quando usar">
          <ul className="space-y-1.5 text-xs text-[var(--color-fg)]">
            <li>DropdownMenu: lista curta de ações ou opções que não cabe na tela (3 a 8 itens). Para escolher um valor de formulário use o Select.</li>
            <li>Item <code>destructive</code>: só para o que apaga ou encerra, sempre depois de um Separator e como último item.</li>
            <li>Gatilho só com ícone leva <code>aria-label</code>.</li>
            <li>O item tem 12px de texto e 26px de altura, como no menu da conta. Em tela de toque como alvo principal, use Button <code>touch</code> e um Drawer.</li>
          </ul>
        </DemoSection>

        <DemoSection title="Contraste medido (WCAG 1.4.3, mínimo 4,5:1)">
          <div className="overflow-x-auto rounded-[12px_12px_12px_24px] border border-[var(--color-border)] bg-[var(--color-surface)]">
            <table className="w-full text-left text-xs text-[var(--color-fg)]">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)]">
                  <th className="p-3">Parte</th>
                  <th className="p-3">Texto</th>
                  <th className="p-3">Fundo</th>
                  <th className="p-3">Claro</th>
                  <th className="p-3">Escuro</th>
                </tr>
              </thead>
              <tbody>
                {CONTRASTE.map((l) => (
                  <tr key={l[0]} className="border-b border-[var(--color-border)] last:border-0">
                    {l.map((c, i) => (
                      <td key={i} className={i === 1 || i === 2 ? 'p-3 font-mono text-[11px]' : 'p-3'}>{c}</td>
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
            { label: 'Menu de ações da linha', description: 'Gatilho em ícone, itens e um item destrutivo depois do Separator.', code: ACOES },
            { label: 'Separator', description: 'Linha horizontal e vertical na cor da borda do tema.', code: SEPARADOR },
          ]}
        />
      </DocPage>
    </PlaygroundProvider>
  )
}
