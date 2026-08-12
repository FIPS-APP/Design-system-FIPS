#!/usr/bin/env python3
"""
Gera os arquivos de motion do BrandLoader a partir da arte oficial da marca.

Este script é a FONTE DE VERDADE da animação. Se a marca mudar, rode-o de novo
em vez de editar os arquivos em public/motion à mão.

Por que pixel a pixel e não SVG: qualquer vetorização automática (potrace,
autotrace) arredonda os cantos do wordmark e deforma o F, o P e o S. A única
forma de manter a tipografia fiel é compor sobre a arte oficial.

O efeito: a marca extrudada em 3D nasce branca, com o contorno já nas cores da
marca, e a cor entra da esquerda para a direita.

Requisitos:
    pip install pillow
    ffmpeg no PATH

Uso:
    python3 scripts/gen-brandloader-motion.py caminho/para/logo-fips.png

Saída (em public/motion/):
    fips-brandloader.webm         VP9 lossless com canal alfa
    fips-brandloader.apng         fallback para Safari
    fips-brandloader-static.png   quadro final, usado sob prefers-reduced-motion
"""

import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image, ImageChops, ImageFilter

# ── parâmetros da animação ────────────────────────────────────────────────────
SUPERSAMPLE = 3          # render interno; reduzido no fim com LANCZOS
FRAMES = 96              # 4 s a 24 fps
FPS = 24
OUT_WIDTH = 1200         # largura final; o quadro é recortado na marca
LAYERS = 22              # fatias da extrusão
DX, DY = 3.0, 2.0        # deslocamento por fatia (direção da espessura)
FILL_START, FILL_END = 0.10, 0.80   # a cor entra em 10% e fecha em 80% do ciclo

COLOR_SYMBOL = (122, 129, 139, 255)  # #7A818B — contorno do símbolo
COLOR_WORDMARK = (0, 75, 155, 255)   # #004B9B — contorno do wordmark
BODY_WHITE = (255, 255, 255, 255)
BODY_SYMBOL = (236, 238, 241, 255)   # símbolo levemente off-white: as folhas
                                     # somem se ficarem brancas sobre branco


def build_masks(art: Image.Image):
    """Separa a arte em símbolo (cinza) e wordmark (azul) pelo próprio pixel."""
    a = np.array(art)
    r, _, b, alpha = (a[..., i].astype(int) for i in range(4))
    ink = alpha > 110
    blue = ink & ((b - r) > 45)
    gray = ink & ~blue

    def to_mask(m):
        return Image.fromarray((m * 255).astype("uint8"), "L")

    m_all, m_blue, m_gray = to_mask(ink), to_mask(blue), to_mask(gray)

    # contorno = dilatação de 1 px menos o original.
    # MaxFilter(3) é o limite: com 5 ou 7 as folhas do símbolo se fundem.
    outline = ImageChops.subtract(m_all.filter(ImageFilter.MaxFilter(3)), m_all)
    o_blue = ImageChops.multiply(outline, m_blue.filter(ImageFilter.MaxFilter(5)))
    o_gray = ImageChops.subtract(outline, o_blue)
    return m_all, m_gray, o_gray, o_blue


def render(art_path: Path, out_dir: Path):
    art0 = Image.open(art_path).convert("RGBA")
    art = art0.resize((art0.width * SUPERSAMPLE, art0.height * SUPERSAMPLE), Image.LANCZOS)
    m_all, m_gray, o_gray, o_blue = build_masks(art)

    lw, lh = art.width, art.height
    pad_l = pad_t = 10
    pad_r, pad_b = int(LAYERS * DX) + 14, int(LAYERS * DY) + 14   # espaço da extrusão
    W, H = lw + pad_l + pad_r, lh + pad_t + pad_b                  # quadro colado na marca
    ox, oy = pad_l, pad_t
    out_h = round(H * OUT_WIDTH / W)

    tmp = Path(tempfile.mkdtemp(prefix="brandloader-"))
    for f in range(FRAMES):
        t = f / (FRAMES - 1)
        if t < FILL_START:
            p = 0.0
        elif t > FILL_END:
            p = 1.0
        else:
            p = (t - FILL_START) / (FILL_END - FILL_START)
        cut = int(p * lw)

        canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        for i in range(LAYERS, 0, -1):                    # extrusão, do fundo à frente
            k = i / LAYERS
            v = int(118 + (216 - 118) * (1 - k))
            layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
            layer.paste((v, v, min(255, v + 8), 255), (ox + int(i * DX), oy + int(i * DY)), m_all)
            canvas.alpha_composite(layer)

        face = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        face.paste(BODY_WHITE, (ox, oy), m_all)
        face.paste(BODY_SYMBOL, (ox, oy), m_gray)
        face.paste(COLOR_SYMBOL, (ox, oy), o_gray)
        face.paste(COLOR_WORDMARK, (ox, oy), o_blue)

        if cut > 0:                                        # a cor entra pela esquerda
            colored = Image.new("RGBA", (W, H), (0, 0, 0, 0))
            colored.paste(art, (ox, oy), art)
            clip = Image.new("L", (W, H), 0)
            clip.paste(255, (0, 0, ox + cut, H))
            colored.putalpha(ImageChops.multiply(colored.getchannel("A"), clip))
            face.alpha_composite(colored)

        canvas.alpha_composite(face)
        canvas.resize((OUT_WIDTH, out_h), Image.LANCZOS).save(tmp / f"f{f:03d}.png")

    out_dir.mkdir(parents=True, exist_ok=True)
    seq = str(tmp / "f%03d.png")
    subprocess.run(["ffmpeg", "-v", "error", "-framerate", str(FPS), "-i", seq,
                    "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-lossless", "1",
                    "-row-mt", "1", "-an", str(out_dir / "fips-brandloader.webm"), "-y"], check=True)
    subprocess.run(["ffmpeg", "-v", "error", "-framerate", str(FPS), "-i", seq,
                    "-plays", "0", str(out_dir / "fips-brandloader.apng"), "-y"], check=True)
    Image.open(tmp / f"f{FRAMES - 1:03d}.png").save(out_dir / "fips-brandloader-static.png")
    print(f"gerado em {out_dir} — quadro {OUT_WIDTH}x{out_h}, {FRAMES} frames a {FPS} fps")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit("uso: python3 scripts/gen-brandloader-motion.py <logo-fips.png>")
    render(Path(sys.argv[1]), Path(__file__).resolve().parent.parent / "public" / "motion")
