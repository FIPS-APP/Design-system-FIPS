import { useState, useEffect } from "react";
import { BrandLoader, type BrandLoaderSize } from "../../../components/brand/BrandLoader";

/* ═══════════════════════════════════════════
   FIPS DESIGN SYSTEM — BRAND TOKENS
   ═══════════════════════════════════════════ */
const C = {
  azulProfundo:"var(--color-gov-azul-profundo)",azulEscuro:"var(--color-gov-azul-escuro)",azulClaro:"var(--color-gov-azul-claro)",
  cinzaChumbo:"var(--color-fg-muted)",cinzaEscuro:"var(--color-fg)",cinzaClaro:"#C0CCD2",
  azulCeu:"#93BDE4",azulCeuClaro:"#D3E3F4",
  amareloOuro:"#FDC24E",amareloEscuro:"#F6921E",
  verdeFloresta:"#00C64C",verdeEscuro:"#00904C",
  danger:"#DC3545",
  neutro:"var(--color-surface-soft)",branco:"#FFFFFF",
  bg:"var(--color-surface-muted)",cardBg:"var(--color-surface)",cardBorder:"var(--color-border)",
  textMuted:"var(--color-fg-muted)",textLight:"var(--color-fg-muted)",
};
const Fn={title:"'Saira Expanded',sans-serif",body:"'Open Sans',sans-serif",mono:"'Fira Code',monospace"};

/* ═══════════════════════════════════════════ ICONS (mini) ═══════════════════════════════════════════ */
const Ic={
  grid:(s:number=14,c:string=C.amareloOuro)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><rect x="2" y="2" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/><rect x="11" y="2" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/><rect x="2" y="11" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/><rect x="11" y="11" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/></svg>,
  check:(s:number=12,c:string=C.verdeEscuro)=><svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  x:(s:number=12,c:string=C.danger)=><svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke={c} strokeWidth="2" strokeLinecap="round"/></svg>,
};

/* ═══════════════════════════════════════════ JUNCTION LINES ═══════════════════════════════════════════ */
function JunctionLines({style}:{style?:React.CSSProperties}){return <svg viewBox="0 0 320 200" fill="none" style={{opacity:.12,...style}}><path d="M0 60H100C120 60 120 60 140 40L200 40H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/><path d="M0 60H100C120 60 120 60 140 80L200 80H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/><path d="M0 120H60C80 120 80 120 100 100L160 100H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/><path d="M0 120H60C80 120 80 120 100 140L160 140H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/></svg>}

/* ═══════════════════════════════════════════ PRIMITIVES DA DOC ═══════════════════════════════════════════ */
function Section({n,title,desc,children}:{n:string,title:string,desc:string,children:React.ReactNode}){return(<section style={{marginBottom:44}}><div style={{fontSize:10,fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",color:C.azulClaro,fontFamily:Fn.title,marginBottom:6}}>{n}</div><h2 style={{fontSize:20,fontWeight:700,color:C.cinzaEscuro,margin:"0 0 4px",fontFamily:Fn.title,letterSpacing:".5px"}}>{title}</h2><p style={{fontSize:14,color:C.cinzaChumbo,margin:"0 0 20px",lineHeight:1.55,fontFamily:Fn.body}}>{desc}</p>{children}</section>)}
function Card({children,s,mob:m}:{children:React.ReactNode,s?:React.CSSProperties,mob?:boolean}){return(<div style={{background:C.cardBg,borderRadius:"12px 12px 12px 24px",border:`1px solid ${C.cardBorder}`,padding:m?16:28,boxShadow:"0 1px 3px rgba(0,75,155,.04),0 4px 14px rgba(0,75,155,.03)",...s}}>{children}</div>)}
const gl={fontSize:10,fontWeight:700,letterSpacing:"1.2px",textTransform:"uppercase",color:C.azulClaro,fontFamily:Fn.title,marginBottom:8,display:"block"};

const ASSETS = [
  {file:"fips-brandloader.webm", size:"117 KB"},
  {file:"fips-brandloader.apng", size:"200 KB"},
  {file:"fips-brandloader-static.png", size:"96 KB"},
];

const COMPONENT_SRC = `import * as React from 'react'
import { cn } from '../../lib/cn'

export type BrandLoaderSize = 'sm' | 'md' | 'lg' | 'splash'

export interface BrandLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** sm 96px · md 180px · lg 280px · splash 420px de largura */
  size?: BrandLoaderSize
  /** Texto anunciado por leitor de tela. */
  label?: string
  /** Legenda visível abaixo da marca (ex.: "Sincronizando QLP"). */
  caption?: string
  /** Caminho base dos arquivos de motion, se servidos fora de /motion. */
  basePath?: string
}

const SIZE_CLASS: Record<BrandLoaderSize, string> = {
  sm: 'w-24',
  md: 'w-[180px]',
  lg: 'w-[280px]',
  splash: 'w-[420px]',
}

/**
 * BrandLoader — a marca FIPS extrudada em 3D que nasce branca, com contorno nas
 * cores da marca, e recebe a cor da esquerda para a direita conforme carrega.
 *
 * A animação é uma peça de motion da marca (WebM com canal alfa + APNG de
 * fallback), renderizada a partir da arte oficial. Não é SVG: a fidelidade
 * tipográfica do wordmark exige o arquivo original.
 *
 * Acessibilidade: \`role="status"\` com \`aria-live="polite"\`. Sob
 * \`prefers-reduced-motion\` exibe o quadro final estático, já colorido.
 */
export const BrandLoader = React.forwardRef<HTMLDivElement, BrandLoaderProps>(
  ({ size = 'md', label = 'Carregando', caption, basePath = '/motion', className, ...props }, ref) => {
    const [reduced, setReduced] = React.useState(false)

    React.useEffect(() => {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
      setReduced(mq.matches)
      const onChange = (e: MediaQueryListEvent) => setReduced(e.matches)
      mq.addEventListener('change', onChange)
      return () => mq.removeEventListener('change', onChange)
    }, [])

    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        aria-label={label}
        className={cn('inline-flex flex-col items-center gap-3', className)}
        {...props}
      >
        {reduced ? (
          <img
            src={\`\${basePath}/fips-brandloader-static.png\`}
            alt=""
            aria-hidden="true"
            className={cn(SIZE_CLASS[size], 'h-auto')}
          />
        ) : (
          <video
            className={cn(SIZE_CLASS[size], 'h-auto')}
            autoPlay
            loop
            muted
            playsInline
            aria-hidden="true"
            poster={\`\${basePath}/fips-brandloader-static.png\`}
          >
            <source src={\`\${basePath}/fips-brandloader.webm\`} type="video/webm" />
            {/* Safari não toca WebM com alfa: cai no APNG */}
            <img src={\`\${basePath}/fips-brandloader.apng\`} alt="" />
          </video>
        )}

        {caption ? (
          <p className="font-heading text-xs uppercase tracking-[0.14em] text-[var(--color-fg-muted)]">
            {caption}
          </p>
        ) : null}
      </div>
    )
  },
)
BrandLoader.displayName = 'BrandLoader'
`;

const SIZES:{key:BrandLoaderSize,px:string,uso:string}[]=[
  {key:"sm",px:"96 px",uso:"dentro de card, painel lateral ou botão grande"},
  {key:"md",px:"180 px",uso:"overlay de ação, tela de módulo carregando"},
  {key:"lg",px:"280 px",uso:"estado vazio e carregamento de página inteira"},
  {key:"splash",px:"420 px",uso:"abertura do app e tela de login"},
];

const SPEC:[string,string][]=[
  ["Duração","4 s em loop, 24 fps"],
  ["Entrada da cor","começa em 10% e fecha em 80% do ciclo, da esquerda para a direita"],
  ["Cores","símbolo #7A818B · wordmark #004B9B · contorno nas mesmas cores"],
  ["Formato","WebM VP9 lossless com canal alfa · APNG de fallback para Safari"],
  ["Quadro","1200 × 363, recortado na marca — sem margem vazia desperdiçando resolução"],
  ["Fundo","transparente: assenta sobre qualquer superfície, clara ou escura"],
  ["Origem","renderizado da arte oficial da marca, pixel a pixel — não é vetorização"],
  ["Movimento reduzido","exibe o quadro final estático, já colorido"],
];

/* ═══════════════════════════════════════════ MAIN ═══════════════════════════════════════════ */
export default function BrandLoaderDoc(){
  const [w,setW]=useState(typeof window!=="undefined"?window.innerWidth:1200);
  useEffect(()=>{const h=()=>setW(window.innerWidth);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h)},[]);
  const mob=w<640;

  const [size,setSize]=useState<BrandLoaderSize>("lg");
  const [dark,setDark]=useState(false);
  const [copied,setCopied]=useState(false);

  return(
    <div style={{minHeight:"100vh",background:"var(--color-surface-muted)",fontFamily:Fn.body,color:C.cinzaEscuro}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Saira+Expanded:wght@300;400;500;600;700;800&family=Open+Sans:wght@300;400;600;700&family=Fira+Code:wght@400;500&display=swap');`}</style>

      {/* HEADER */}
      <header style={{background:`linear-gradient(135deg,${C.azulProfundo} 0%,${C.azulEscuro} 100%)`,padding:mob?"32px 20px":"48px 40px 44px",position:"relative",overflow:"hidden"}}>
        <JunctionLines style={{position:"absolute",top:-10,right:-20,width:mob?250:400,height:250}}/>
        <div style={{position:"relative"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:6,background:`${C.branco}10`,border:`1px solid ${C.branco}18`,borderRadius:20,padding:"5px 14px",fontSize:11,fontWeight:600,letterSpacing:"1.5px",textTransform:"uppercase",color:C.amareloOuro,fontFamily:Fn.title,marginBottom:16}}>{Ic.grid(14,C.amareloOuro)} Design System FIPS</div>
          <h1 style={{fontSize:mob?30:44,fontWeight:700,color:C.branco,margin:"0 0 10px",fontFamily:Fn.title}}>BrandLoader</h1>
          <p style={{fontSize:16,color:`${C.branco}B0`,lineHeight:1.6,maxWidth:700,margin:0,fontFamily:Fn.body}}>A marca extrudada em 3D nasce branca, com o contorno já nas cores da marca, e recebe a cor da esquerda para a direita conforme a tela carrega. É a peça de espera institucional do sistema.</p>
        </div>
      </header>

      <div style={{padding:mob?"24px 16px 40px":"36px 40px 60px",maxWidth:1100,margin:"0 auto"}}>

        {/* 01 — PALCO */}
        <Section n="01" title="A marca carregando" desc="Alterne o fundo para conferir o canal alfa: a marca não carrega retângulo branco atrás dela.">
          <Card mob={mob}>
            <div style={{display:"flex",flexWrap:"wrap",gap:8,alignItems:"center",marginBottom:20}}>
              {SIZES.map(s=>(
                <button key={s.key} type="button" onClick={()=>setSize(s.key)} style={{
                  fontFamily:Fn.title,fontSize:12,fontWeight:600,letterSpacing:".5px",cursor:"pointer",
                  padding:"7px 14px",borderRadius:"10px 10px 10px 18px",
                  border:`1px solid ${size===s.key?C.azulProfundo:C.cardBorder}`,
                  background:size===s.key?C.azulProfundo:C.cardBg,
                  color:size===s.key?C.branco:C.cinzaEscuro,transition:"all .18s ease",
                }}>{s.key}</button>
              ))}
              <button type="button" onClick={()=>setDark(d=>!d)} style={{
                marginLeft:"auto",fontFamily:Fn.title,fontSize:12,fontWeight:600,letterSpacing:".5px",cursor:"pointer",
                padding:"7px 14px",borderRadius:"10px 10px 10px 18px",border:`1px solid ${C.cardBorder}`,
                background:C.cardBg,color:C.cinzaEscuro,
              }}>{dark?"Fundo claro":"Fundo escuro"}</button>
            </div>

            <div style={{
              minHeight:mob?260:400,display:"flex",alignItems:"center",justifyContent:"center",
              borderRadius:"10px 10px 10px 18px",border:`1px solid ${C.cardBorder}`,padding:mob?20:40,
              background:dark?"#1A1A1A":C.bg,transition:"background .25s ease",
            }}>
              <BrandLoader size={size} caption="Sincronizando QLP"/>
            </div>
          </Card>
        </Section>

        {/* 02 — TAMANHOS */}
        <Section n="02" title="Tamanhos" desc="A marca perde leitura abaixo de 96 px — não existe tamanho menor que o sm por decisão de governança.">
          <Card mob={mob} s={{overflowX:"auto"}}>
            <table style={{width:"100%",minWidth:520,borderCollapse:"collapse",fontFamily:Fn.body}}>
              <thead>
                <tr style={{borderBottom:`1px solid ${C.cardBorder}`}}>
                  {["Valor","Largura","Usar em"].map(h=>(
                    <th key={h} style={{textAlign:"left",padding:"0 12px 10px 0",fontSize:10,fontWeight:700,letterSpacing:"1.2px",textTransform:"uppercase",color:C.azulClaro,fontFamily:Fn.title}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SIZES.map(s=>(
                  <tr key={s.key} style={{borderBottom:`1px solid ${C.cardBorder}`}}>
                    <td style={{padding:"12px 12px 12px 0"}}><code style={{fontSize:11,fontFamily:Fn.mono,color:C.cinzaEscuro,background:C.neutro,padding:"2px 8px",borderRadius:4}}>{s.key}</code></td>
                    <td style={{padding:"12px 12px 12px 0",fontSize:13,color:C.cinzaChumbo}}>{s.px}</td>
                    <td style={{padding:"12px 0",fontSize:13,color:C.cinzaChumbo}}>{s.uso}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </Section>

        {/* 03 — ESPECIFICAÇÃO */}
        <Section n="03" title="Especificação" desc="O que está travado na peça e não deve ser recriado a cada consumo.">
          <Card mob={mob}>
            <div style={{display:"grid",gap:10}}>
              {SPEC.map(([k,v])=>(
                <div key={k} style={{display:"grid",gridTemplateColumns:mob?"1fr":"180px 1fr",gap:mob?2:16,alignItems:"baseline",paddingBottom:10,borderBottom:`1px solid ${C.cardBorder}`}}>
                  <span style={{fontSize:10,fontWeight:700,letterSpacing:"1.2px",textTransform:"uppercase",color:C.azulClaro,fontFamily:Fn.title}}>{k}</span>
                  <span style={{fontSize:13,color:C.cinzaChumbo,lineHeight:1.55}}>{v}</span>
                </div>
              ))}
            </div>
          </Card>
        </Section>

        {/* 04 — USO */}
        <Section n="04" title="Como usar" desc="Os arquivos de motion são servidos de /motion. Se a aplicação publicar em outro caminho, passe basePath.">
          <Card mob={mob}>
            <span style={gl}>Import</span>
            <pre style={{margin:"0 0 20px",padding:16,background:C.bg,border:`1px solid ${C.cardBorder}`,borderRadius:"10px 10px 10px 18px",fontSize:12.5,fontFamily:Fn.mono,color:C.cinzaEscuro,overflowX:"auto",lineHeight:1.7}}>
{`import { BrandLoader } from '@fips-app/ds-fips'`}
            </pre>
            <span style={gl}>Abertura do app</span>
            <pre style={{margin:"0 0 20px",padding:16,background:C.bg,border:`1px solid ${C.cardBorder}`,borderRadius:"10px 10px 10px 18px",fontSize:12.5,fontFamily:Fn.mono,color:C.cinzaEscuro,overflowX:"auto",lineHeight:1.7}}>
{`<BrandLoader size="splash" />`}
            </pre>
            <span style={gl}>Ação longa, com legenda</span>
            <pre style={{margin:0,padding:16,background:C.bg,border:`1px solid ${C.cardBorder}`,borderRadius:"10px 10px 10px 18px",fontSize:12.5,fontFamily:Fn.mono,color:C.cinzaEscuro,overflowX:"auto",lineHeight:1.7}}>
{`<BrandLoader
  size="md"
  caption="Gerando PDF"
  label="Gerando o PDF do escopo"
/>`}
            </pre>
          </Card>
        </Section>

        {/* 05 — REGRAS */}
        <Section n="05" title="Quando usar, quando não" desc="É assinatura de marca, não indicador genérico de espera. Usar demais gasta o efeito.">
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:16}}>
            <Card mob={mob}>
              <span style={{...gl,color:C.verdeEscuro}}>Use</span>
              <ul style={{margin:0,paddingLeft:0,listStyle:"none",display:"grid",gap:10}}>
                {["abertura do app e tela de login","ação longa e explícita: gerar PDF, sincronizar QLP, importar lote","troca de módulo, quando a espera passa de 1 segundo"].map(t=>(
                  <li key={t} style={{display:"flex",gap:8,alignItems:"flex-start",fontSize:13,color:C.cinzaChumbo,lineHeight:1.55}}>
                    <span style={{marginTop:3,flexShrink:0}}>{Ic.check(12,C.verdeEscuro)}</span>{t}
                  </li>
                ))}
              </ul>
            </Card>
            <Card mob={mob}>
              <span style={{...gl,color:C.danger}}>Não use</span>
              <ul style={{margin:0,paddingLeft:0,listStyle:"none",display:"grid",gap:10}}>
                {["dentro de tabela carregando — ali vai skeleton, que mostra a forma do dado","em botão pequeno ou célula: a marca fica ilegível abaixo de 96 px","mais de um por tela — é assinatura, não decoração"].map(t=>(
                  <li key={t} style={{display:"flex",gap:8,alignItems:"flex-start",fontSize:13,color:C.cinzaChumbo,lineHeight:1.55}}>
                    <span style={{marginTop:3,flexShrink:0}}>{Ic.x(12,C.danger)}</span>{t}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </Section>

        {/* 06 — ASSETS E REPRODUÇÃO */}
        <Section n="06" title="Assets e reprodução" desc="Tudo que a peça precisa está versionado no repositório. Ninguém precisa recriar a animação no olho — nem pessoa, nem IA.">
          <Card mob={mob}>
            <span style={gl}>1. Baixe os três arquivos</span>
            <p style={{fontSize:13,color:C.cinzaChumbo,lineHeight:1.55,margin:"0 0 14px"}}>
              Coloque-os em <code style={{fontSize:11,fontFamily:Fn.mono,background:C.neutro,padding:"2px 6px",borderRadius:4}}>public/motion/</code> do projeto que vai consumir. É o caminho que o componente procura por padrão.
            </p>
            <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:24}}>
              {ASSETS.map(a=>(
                <a key={a.file} href={`/motion/${a.file}`} download style={{
                  display:"inline-flex",alignItems:"center",gap:8,textDecoration:"none",
                  padding:"9px 14px",borderRadius:"10px 10px 10px 18px",
                  border:`1px solid ${C.cardBorder}`,background:C.cardBg,
                }}>
                  <span style={{fontSize:12.5,fontWeight:600,fontFamily:Fn.title,color:C.azulProfundo}}>{a.file}</span>
                  <span style={{fontSize:11,fontFamily:Fn.mono,color:C.cinzaChumbo}}>{a.size}</span>
                </a>
              ))}
            </div>

            <span style={gl}>2. Copie o componente</span>
            <p style={{fontSize:13,color:C.cinzaChumbo,lineHeight:1.55,margin:"0 0 14px"}}>
              Se o projeto instala a library, basta importar. Se o projeto <strong>porta</strong> os componentes — como o FIPS Suprimentos faz —, copie o arquivo abaixo para <code style={{fontSize:11,fontFamily:Fn.mono,background:C.neutro,padding:"2px 6px",borderRadius:4}}>src/components/brand/BrandLoader.tsx</code>.
            </p>
            <div style={{display:"flex",gap:8,marginBottom:24,flexWrap:"wrap"}}>
              <button type="button" onClick={()=>{navigator.clipboard.writeText(COMPONENT_SRC);setCopied(true);setTimeout(()=>setCopied(false),1800)}} style={{
                fontFamily:Fn.title,fontSize:12,fontWeight:600,letterSpacing:".5px",cursor:"pointer",
                padding:"9px 16px",borderRadius:"10px 10px 10px 18px",border:"none",
                background:copied?C.verdeEscuro:C.azulProfundo,color:C.branco,transition:"background .2s ease",
              }}>{copied?"Copiado":"Copiar BrandLoader.tsx"}</button>
            </div>
            <pre style={{margin:"0 0 24px",padding:16,background:C.bg,border:`1px solid ${C.cardBorder}`,borderRadius:"10px 10px 10px 18px",fontSize:12,fontFamily:Fn.mono,color:C.cinzaEscuro,overflowX:"auto",lineHeight:1.65,maxHeight:280}}>
{COMPONENT_SRC}
            </pre>

            <span style={gl}>3. Se a marca mudar, regere</span>
            <p style={{fontSize:13,color:C.cinzaChumbo,lineHeight:1.55,margin:"0 0 14px"}}>
              A animação não foi desenhada à mão: ela é gerada por um script versionado, a partir do PNG oficial da marca. Rode-o em vez de editar os arquivos.
            </p>
            <pre style={{margin:"0 0 14px",padding:16,background:C.bg,border:`1px solid ${C.cardBorder}`,borderRadius:"10px 10px 10px 18px",fontSize:12.5,fontFamily:Fn.mono,color:C.cinzaEscuro,overflowX:"auto",lineHeight:1.7}}>
{`pip install pillow          # e ffmpeg no PATH
python3 scripts/gen-brandloader-motion.py caminho/logo-fips.png`}
            </pre>
            <p style={{fontSize:12,color:C.cinzaChumbo,lineHeight:1.5,margin:0,fontStyle:"italic",paddingLeft:10,borderLeft:`2px solid ${C.azulCeuClaro}`}}>
              O script compõe sobre a arte oficial pixel a pixel — não vetoriza. Qualquer vetorização automática arredonda os cantos do wordmark e deforma o F, o P e o S. Está comentado dentro do arquivo, junto do porquê de cada parâmetro.
            </p>
          </Card>
        </Section>

      </div>
    </div>
  );
}
