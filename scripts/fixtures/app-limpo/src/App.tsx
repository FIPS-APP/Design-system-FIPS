import { Button, Input, PageHeader, PageHero, cn } from '@fips-app/ds-fips'

export function App() {
  return (
    <main className={cn('mt-4', 'grid gap-4')} style={{ color: 'var(--color-fg)' }}>
      <PageHeader titulo="Inspeções" />
      <PageHero title="Início" />
      <Input className="w-full max-w-sm" />
      <Button variant="primary" className="mt-2 self-end">Salvar</Button>
      <a href="#conteudo" className="text-[var(--color-app-destaque)]">Pular</a>
    </main>
  )
}
