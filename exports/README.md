# DS-FIPS — Código Exportável

Componentes copy-paste ready do Design System FIPS.
Cada pasta contém um componente self-contained (.tsx) + README com instruções.

## Como usar

1. Copie a pasta do componente desejado para seu projeto
2. Adicione as CSS variables do DS-FIPS ao seu `:root` (ver README de qualquer componente)
3. Importe e use: `import { ComponentName } from './ComponentName'`

## Componentes disponíveis

| Componente | Descrição | Linhas |
|---|---|---|
| [Badge](./badge) | Badge/tag com variantes semânticas (sucesso, atenção, crítico, info, ouro), dot indicator, contador, removível | 99 |
| [Button](./button) | Botão com 10 variantes (primary, secondary, outline, ghost, danger, save, accent, ouro, link, inverse), 3 tamanhos, loading e disabled | 119 |
| [Card](./card) | Container card com border-radius FIPS (12 12 12 24), sombra sutil, composição flexível | 118 |
| [Modal](./modal) | Modal overlay com blur, animação spring, ESC fecha, 6 variantes (confirmação, destrutivo, alerta, info, formulário, lista) | 132 |
| [TutorialModal](./tutorial-modal) | Modal walkthrough step-by-step com barra de progresso, navegação por teclado (← →), dots clicáveis, scroll automático | 183 |
| [PopupModal](./popup-modal) | Modal redimensionável com 3 tamanhos: Normal (480px), Grande (720px), Tela Cheia (92vw) | 141 |
| [Drawer](./drawer) | Painel lateral deslizante (slide-in), overlay, ESC fecha | 76 |
| [FieldLabel](./field-label) | Composição Field + FieldLabel + FieldHint para formulários | 140 |
| [Input](./input) | Campo input com label, ícone, password toggle, clear button, 3 tamanhos, estados error/disabled/readOnly | 152 |
| [ProgressBar](./progress-bar) | Barra de progresso linear com 3 tamanhos (sm/md/lg), modo indeterminado, cor automática por porcentagem | 133 |
| [DSSelect](./d-s-select) | Dropdown select customizado com opções, ícone, estados error/disabled, modo compacto | 107 |
| [DSTable](./d-s-table) | Tabela com sorting asc/desc por coluna, paginação, striped rows, hover, render customizado, footer | 132 |
| [TabsUnderline](./tabs-underline) | Tabs com indicador deslizante laranja 3px | 89 |
| [TabsFilled](./tabs-filled) | Tabs com fundo azul na aba ativa, container cinza, sombra | 25 |
| [TabsGuia](./tabs-guia) | Tabs estilo folder/guia para posicionar acima de tabelas como filtro | 26 |
| [TabsBordered](./tabs-bordered) | Tabs com borda sutil, suporta orientação vertical com borda lateral laranja 2px | 26 |
| [FipsTabBar](./fips-tab-bar) | Abas segmentadas em card (Configurações Suprimentos) | 100 |
| [Switch](./switch) | Toggle Radix 42×24px | 32 |
| [SettingsPreferenceRow](./settings-preference-row) | Linha de preferência com switch | 41 |
| [PatternPanelHero](./pattern-panel-hero) | Banner de conteúdo com stats chips | 157 |
| [DSTextarea](./d-s-textarea) | Textarea com auto-resize, maxLength counter com cor, estados error/disabled/readOnly | 96 |
| [toast](./toast) |  | 91 |
| [Tooltip](./tooltip) | Tooltip com 6 variantes, 4 posições, arrow, delay, suporte a título rich | 82 |

## Requisitos globais

- React 18+
- Fonts: [Saira Expanded](https://fonts.google.com/specimen/Saira+Expanded), [Open Sans](https://fonts.google.com/specimen/Open+Sans), [Fira Code](https://fonts.google.com/specimen/Fira+Code)
- CSS Variables (dark/light) — ver qualquer README individual

---

*Gerado automaticamente pelo Design System FIPS v2.0*
