# Favicon e ícones de app (App FIPS)

Critério: a aba do navegador precisa dizer **de que aplicativo FIPS** se trata. O lockup **App FIPS** (marca + texto) é o padrão. O símbolo FIPS sozinho (`public/brand/fips-symbol-only.png`, favicon antigo) **não** serve para aba nem PWA.

**Origem canônica dos bytes:** `OPA-MOBILE` (`main`), pasta `public/icons/` e nomes de arquivo abaixo. Este repo espelha esses três PNG byte a byte.

**OPA-GESTAO:** ainda não está alinhado (PNG e `favicon.png` diferentes do mobile; maskable com outro nome de arquivo). Não copie ícones da Gestão até a issue de paridade fechar. Depois do alinhamento, a Gestão segue os mesmos bytes e nomes do OPA-MOBILE.

Os arquivos publicados pelo DS ficam em `public/icons/`.

## Arquivos que o DS entrega

| Arquivo | Uso |
| --- | --- |
| `public/icons/icon-192.png` | `rel="icon"`, `apple-touch-icon`, ícone 192 do manifest |
| `public/icons/icon-512.png` | Ícone 512 do manifest (any) |
| `public/icons/icon-512-maskable.png` | Ícone 512 **maskable** (Android: margem de segurança ~20%, o SO recorta) |
| `public/favicon.png` | Cópia de `icon-192.png` para quem ainda linka `/favicon.png` |

Nomes iguais ao OPA-MOBILE (`vite.config.ts` / manifest). Não recrie nem troque por `fips-symbol-only.png`.

## HTML mínimo (Vite / SPA)

```html
<meta name="theme-color" content="#004B9B" />
<link rel="icon" type="image/png" href="/icons/icon-192.png" />
<link rel="apple-touch-icon" href="/icons/icon-192.png" />
```

Opcional: `favicon.svg` só se o app tiver SVG próprio; **não** use o SVG antigo do DS com símbolo/“DS” como padrão de produto.

## Manifest (PWA)

Mesma família de PNG (paths iguais ao OPA-MOBILE):

```json
{
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" },
    { "src": "/icons/icon-512-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

`name` / `short_name` do manifest descrevem **o app** (ex.: “Gestão OPA”, “Obrigações”). O ícone continua App FIPS em todos.

## Tamanho 16px na aba

O navegador reduz o PNG. O texto “App FIPS” pode sumir; a silhueta azul + amarelo continua identificável. Não volte ao símbolo sozinho só para “caber” em 16px: isso tira a informação de produto. Recorte dedicado para 16px só entra se o DS publicar arquivo novo aqui (hoje não há).

## O que não copiar

- `public/brand/fips-symbol-only.png` → marca institucional, **não** favicon de app.
- `public/favicon.svg` legado (símbolo + “DS”) → vitrine antiga; apps FIPS seguem os PNG acima.
- `public/icons/` do OPA-GESTAO enquanto os blobs forem diferentes do OPA-MOBILE.

## Checklist para app novo

1. Copiar `public/icons/` (três PNG, mesmos nomes) do Design-system-FIPS **ou** do OPA-MOBILE.
2. Colar o HTML mínimo no `index.html`.
3. Colar o trecho de manifest deste documento (paths batem com os nomes no disco).
4. Conferir aba ao lado do app de campo; Gestão OPA quando estiver alinhada.
