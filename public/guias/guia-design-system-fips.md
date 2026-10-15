# Guia de implementação — Design System FIPS

Documento de referência para equipes que precisam replicar a interface com **fidelidade visual** (pixel perfect) em outros produtos. Complementa o Brandbook institucional (`docs/Brandbook PPT.pdf`): use **sempre o PDF como fonte da verdade** para logotipos finais, área de proteção e aprovações de marca.

**Versão do guia:** 0.4.0  
**Stack de referência:** React 19, TypeScript, Tailwind CSS v4, Vite.

---

## 1. Identidade e logotipo

### 1.1 Nome do produto

- Nome oficial deste design system: **Design System FIPS**.
- Não usar abreviação “DS FIPS” em interfaces ou documentação externa.

### 1.2 Marca institucional

- **FIPS** — Ferrovia Interna do Porto de Santos.
- Tipografia do logotipo (manual): **Saira Expanded** (pesos conforme capítulo de identidade do Brandbook).
- Símbolo: elemento de **junção de vias** derivado da ferrovia do porto.

### 1.3 Arquivos vetoriais neste repositório

| Arquivo | Uso |
|--------|-----|
| `/brand/fips-symbol.svg` | Símbolo isolado (fundo claro, traço Azul Profundo `#004B9B`). |
| Componente React `FipsLogo` | Sidebar e layouts digitais com wordmark + nome completo. |

**Importante:** substitua `/brand/fips-symbol.svg` e ajuste `FipsLogo` quando a área de marca entregar **export oficial** (AI/SVG/PDF) do Brandbook, preservando proporções e área de segurança descritas no manual (ex.: redução mínima digital ~80px de largura para lockup completo).

### 1.4 Cores do logotipo (Brandbook)

- Versão principal: conforme fundo (claro / escuro / 1 cor).
- **Não** aplicar transparência, sombra, contorno arbitrário ou distorção no logo (ver capítulo “Usos indevidos”).

---

## 2. Paleta de cores (hex)

Valores extraídos do Brandbook; conferir sempre o PDF antes de alterar.

### 2.1 Primárias

| Nome | Hex | Uso sugerido |
|------|-----|----------------|
| Azul Profundo | `#004B9B` | Primária digital, sidebar, links fortes |
| Azul Profundo (escuro) | `#002A68` | Hover primário, gradientes, profundidade |
| Cinza chumbo | `#333B41` | Texto principal |
| Cinza metal | `#C0CCD2` | Bordas, divisórias |
| Azul intermediário | `#658EC9` | Destaques secundários em gráficos |

### 2.2 Secundárias

| Nome | Hex |
|------|-----|
| Azul céu claro | `#D3E3F4` |
| Amarelo pastel | `#FFE4B8` |
| Azul céu | `#93BDE4` |
| Azul céu profundo | `#0090D0` |
| Amarelo ouro | `#FDC24E` |
| Amarelo ouro escuro | `#F6921E` |
| Verde claro | `#8BE5AD` |
| Verde floresta | `#00C64C` |
| Verde floresta escuro | `#00904C` |

### 2.3 Neutros

| Nome | Hex |
|------|-----|
| Branco | `#FFFFFF` |
| Neutro claro | `#E8EBFF` |

### 2.4 Tokens semânticos (CSS)

Definidos em `src/styles/globals.css` sob `:root`:

- `--color-primary` → Azul Profundo  
- `--color-primary-hover` → Azul Profundo escuro  
- `--color-secondary` → `#0090D0`  
- `--color-accent` / `--color-accent-strong` → Amarelo ouro  
- `--color-success` / `--color-success-strong` → Verdes institucionais  
- `--color-surface`, `--color-surface-muted`, `--color-border`, `--color-fg`, `--color-fg-muted`  
- `--color-sidebar`, `--color-sidebar-deep`  

Em Tailwind v4, há aliases em `@theme` (`--color-fips-*`).

---

## 3. Tipografia

| Papel | Família | Observação |
|-------|---------|------------|
| Títulos / destaques | **Saira Expanded** | Pesos: Light, Regular, Medium, Semibold, Bold, etc. (Brandbook) |
| Corpo / UI | **Open Sans** | Textos longos; entrelinha confortável (~120% no manual) |

**Google Fonts (referência do projeto):**

```text
Saira+Expanded:wght@300;400;500;600;700;800
Open+Sans:ital,wght@0,300..800;1,300..800
```

Classe utilitária: `font-heading` → aplica `var(--font-heading)`.

---

## 4. Espaçamento, raios e sombras

### 4.1 Espaçamento

Base **4px**. Escala documentada: `0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96` px (mapear para tokens Tailwind `0–24`).

### 4.2 Raios

- `rounded-sm` → 6px  
- `rounded-md` → 8px  
- `rounded-lg` → 12px  
- `rounded-xl` → 16px  
- `rounded-2xl` → 20px  

Campos e botões: `rounded-lg`. Cards e modais: `rounded-xl` / `rounded-2xl`.

### 4.3 Sombras

- `--shadow-card`: elevação leve para cards e tabelas.  
- `--shadow-elevated`: modais, drawers, overlays.

---

## 5. Layout da documentação (referência de produto)

- **Sidebar:** fundo em Azul Profundo com gradiente sutil; item ativo com **borda esquerda** em Amarelo Ouro (`--color-accent`) e fundo branco translúcido.
- **Top bar:** superfície branca, título da página, busca (read-only na demo).
- **Conteúdo:** `max-width` ~80rem (container interno `max-w-5xl` nas páginas de doc).

Replicar em outros apps: manter **contraste mínimo WCAG AA** para texto sobre `--color-primary` e sobre `--color-accent`.

### 5.1 Hero de módulo (`PageHero`)

- **Home:** barra superior em vidro sobre imagem + gradiente (padrão **Hero** na doc do DS: `/docs/patterns/hero`).  
- **Todas as outras páginas de produto (Produção, Governança, etc.):** usar o composite **`PageHero`**: faixa só com o degradê azul institucional. Desde a 0.16.0 ele não tem arte de trem nem props de decoração; quem precisar de arte no topo desenha no `children`.

```tsx
import { PageHero } from 'ds-fips'

<PageHero>
  <div className="px-8 py-10">{/* título, badge, KPIs sobrepostos, botão Atualizar… */}</div>
</PageHero>
```

---

## 6. Componentes (API resumida)

Biblioteca em `src/components/ui/`. Padrão de importação em consumidores:

```tsx
import { Button } from '@seu-pacote/components/ui/button'
```

| Componente | Notas |
|------------|--------|
| Button | Variantes: `primary`, `secondary`, `outline`, `ghost`, `accent`, `danger`, `link`. Tamanhos: `sm`, `md`, `lg`, `icon`. |
| Input / Select / Textarea | Borda `var(--color-border)`, foco com anel `var(--color-primary)` ~25% opacidade. |
| Badge | Variantes semânticas: `default`, `secondary`, `success`, `warning`, `danger`, `outline`. |
| Card | `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`. |
| Tabs | Radix Tabs; lista com fundo `surface-muted`. |
| Table | Wrapper com borda e hover de linha. |
| Dialog / Drawer | Radix Dialog; drawer = painel à direita. |
| Tooltip | Radix; requer `TooltipProvider` na raiz. |
| Toast | Sonner; `Toaster` no layout. |

Variantes CVA: `button-variants.ts`, `badge-variants.ts`.

---

## 7. Padrões de tela (referência visual)

Inspirados nos prints em `Referencias/`:

1. **Dashboard / módulos** — `PageHero` (gradiente azul + trem sutil), KPIs em cards com barra superior colorida, etapas numeradas com círculo amarelo ouro.  
2. **Tabela de certificados** — faixa de filtros, chips de status, linhas com realce semântico (ex.: vencido em vermelho claro).  
3. **Modal de formulário** — abas superiores, formulário em duas colunas no desktop, prioridade como grupo de botões, área de anexo tracejada.

---

## 8. Checklist pixel perfect

- [ ] Cores conferidas com o Brandbook (hex exatos).  
- [ ] Fontes carregadas (Saira Expanded + Open Sans) com `font-display: swap`.  
- [ ] Sidebar e primários usam Azul Profundo; acentos de destaque usam Amarelo Ouro conforme contexto.  
- [ ] Bordas e divisórias usam Cinza metal (`#C0CCD2`) ou token `--color-border`.  
- [ ] Foco visível em todos os interativos (`focus-visible:ring-2`).  
- [ ] Logotipo sem distorção e com área de proteção do manual.  
- [ ] Sombras e raios alinhados às seções Foundations do site de documentação.  
- [ ] Testar em larguras 360px, 768px, 1280px.

---

## 9. Onde copiar referências no site

Cada página da documentação inclui blocos **“Referência para copiar”** com tokens, JSX ou trechos CSS/Tailwind para colar no projeto consumidor.

---

## 10. Contato e evolução

- Alterações de marca: alinhar com responsável pelo **Brandbook FIPS**.  
- Evolução técnica: versionar este guia e o `Changelog` na documentação interna.

**Última atualização:** março/2026.
