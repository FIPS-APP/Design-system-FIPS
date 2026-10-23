# PageHeader e PatternPanelHero

Banner de página do DS-FIPS (Banner de Conteúdo): ícone, título em h1, resumo, ações e chips de KPI opcionais, sobre o gradiente institucional com trilhos.

Arquivos:

- `PageHeader.tsx`: o componente.
- `PatternPanelHero.tsx`: apelido do PageHeader com as props de antes (`subtitle`, `badge`, `badgePill`, `action`, `stats`, `compact`, `dataTutorial`).
- `banner-shared.tsx`: `BannerJunctionLines` (trilhos), `BannerIconBox` (tile) e as constantes `FIPS_BANNER_*`.
- `page-header.css`: as regras do banner. Sem elas o componente não tem fundo nem medida.

## Como copiar

1. Copie os quatro arquivos para o app.
2. Importe `page-header.css` uma vez, junto do CSS global.
3. Troque o import de `cn` (`../../lib/cn`) pelo do app: é `twMerge(clsx(...))`.
4. O app precisa dos tokens do DS: `--color-accent`, `--color-accent-strong`, `--font-heading`, `--font-sans`, `--color-gov-gradient-from` e `--color-gov-gradient-to`. Os tokens `--fips-banner-*` já vêm no CSS; apague-os de lá se o app os tem.

Se o app instala `@fips-app/ds-fips`, não copie nada: `import { PageHeader } from '@fips-app/ds-fips'`.

## Uso

```tsx
<PageHeader
  icon={<FileDown />}
  title="Sistema de Requisições"
  description="Gestão de compras e requisições do módulo Suprimentos"
  actions={<Button variant="accent" size="sm">Nova solicitação</Button>}
/>
```

- A medida segue a largura do cartão (container query de 560px), não a da janela. Abaixo disso as ações descem para a última linha.
- O título é h1. A página tem um h1 só: nos outros banners da página, `headingLevel={2}`.
- `actions` leva os botões como filhos diretos (fragmento, sem div em volta). Com mais de dois, a linha quebra.
- `data-*` e `aria-*` vão para a raiz; `actionsProps` leva `data-*` ao slot de ações (âncora de tutorial).
- `edge="bleed"` tira o raio abaixo de 560px, para o banner encostar nas bordas da tela.
- `badge` do PatternPanelHero é só para estado da tela ("Passo 2 de 4"), nunca o nome do sistema.
- O componente ocupa a largura do pai: não o ponha dentro de um flex em linha.
- Com ponteiro de toque os botões de `actions` têm 44px de altura, desde que sejam filhos diretos do slot.
