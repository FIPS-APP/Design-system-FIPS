import re, sys, urllib.request, pathlib, shutil

UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
def pega(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': UA}), timeout=30).read()

FONTES = [
    ('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400..700&display=swap',
     'Open Sans', 'open-sans'),
    # "Saira Expanded" nao e familia do Google — e o Saira no eixo wdth=125.
    ('https://fonts.googleapis.com/css2?family=Saira:wdth,wght@125,500..700&display=swap',
     'Saira Expanded', 'saira-expanded'),
]

CABECALHO = """/* Fontes do DS-FIPS servidas no bundle (sem Google Fonts).
 *
 * Historico medido em ds-fips@0.12.3:
 * 1. O @import do Google caia no meio de dist/styles.css (depois de outras
 *    regras). CSS exige @import no topo — o browser descarta em silencio.
 * 2. family=Saira+Expanded responde 400: essa familia nao existe. "Expanded"
 *    e o eixo wdth=125 do Saira (font-stretch: 125%).
 *
 * Aqui a familia 'Saira Expanded' e declarada sobre o Saira wdth=125, que e
 * o nome que --font-heading ja usa. urls relativos: o Vite empacota os woff2
 * em dist/ junto de styles.css, entao o consumidor nao depende da CDN.
 *
 * Pesos: Open Sans 400-700, Saira Expanded 500-700. Subsets latin + latin-ext.
 * Regenerar: python scripts/atualizar-fontes.py
 */

"""

def gerar(raiz: pathlib.Path):
    fontes_dir = raiz / 'src' / 'fonts'
    if fontes_dir.exists():
        shutil.rmtree(fontes_dir)
    fontes_dir.mkdir(parents=True)

    saida, total = [], 0
    for url, familia, prefixo in FONTES:
        css = pega(url).decode('utf-8')
        for subset, bloco in re.findall(r'/\* ([a-z-]+) \*/\s*(@font-face \{.*?\})', css, re.S):
            if subset not in ('latin', 'latin-ext'):
                continue
            woff = re.search(r'url\((https://[^)]+\.woff2)\)', bloco).group(1)
            nome = f'{prefixo}-{subset}.woff2'
            dados = pega(woff)
            (fontes_dir / nome).write_bytes(dados)
            total += len(dados)
            bloco = re.sub(r"font-family: '[^']+'", f"font-family: '{familia}'", bloco)
            bloco = bloco.replace(f'url({woff})', f"url('../fonts/{nome}')")
            saida.append(f'/* {familia} — {subset} */\n{bloco}')
            print(f'  {nome:34s} {len(dados)/1024:6.1f} KB  ({familia})')

    destino_css = raiz / 'src' / 'styles' / 'fontes-fips.css'
    destino_css.write_text(CABECALHO + '\n\n'.join(saida) + '\n', encoding='utf-8')
    print(f'  → {destino_css}')
    print(f'  total: {total/1024:.0f} KB\n')

raiz = pathlib.Path(__file__).resolve().parents[1]
print(f'== {raiz.name} ==')
gerar(raiz)
