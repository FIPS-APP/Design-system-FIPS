import { useState, useEffect } from "react";
import { PlaygroundProvider, Copyable, CodePlayground } from '../../components/CodePlayground'
import { CodeExportSection } from '../../components/CodeExport'

const C={azulProfundo:"var(--color-gov-azul-profundo)",azulEscuro:"var(--color-gov-azul-escuro)",azulClaro:"var(--color-gov-azul-claro)",cinzaChumbo:"var(--color-fg-muted)",cinzaEscuro:"var(--color-fg)",cinzaClaro:"#C0CCD2",azulCeu:"#93BDE4",azulCeuClaro:"#D3E3F4",amareloOuro:"#FDC24E",amareloEscuro:"#F6921E",verdeFloresta:"#00C64C",verdeEscuro:"var(--color-gov-verde-escuro)",danger:"#DC3545",neutro:"var(--color-surface-soft)",branco:"#FFFFFF",bg:"var(--color-surface-muted)",cardBg:"var(--color-surface)",cardBorder:"var(--color-border)",textMuted:"var(--color-fg-muted)",textLight:"var(--color-fg-muted)"};
const Fn={title:"'Saira Expanded',sans-serif",body:"'Open Sans',sans-serif",mono:"'Fira Code',monospace"};
const alpha=(c:string,a:number)=>`color-mix(in srgb, ${c} ${Math.round(a*100)}%, transparent)`;
const Ic={
  grid:(s:number,c:string)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><rect x="2" y="2" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/><rect x="11" y="2" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/><rect x="2" y="11" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/><rect x="11" y="11" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/></svg>,
  check:(s:number,c:string)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M4 10l4 4 8-8" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  x:(s:number,c:string)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M5 5l10 10M15 5L5 15" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>,
  alert:(s:number,c:string)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M10 2L1.5 17h17L10 2z" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/><path d="M10 8v4M10 14v.5" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>,
  eye:(s:number,c:string)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke={c} strokeWidth="1.5"/><circle cx="10" cy="10" r="2.5" stroke={c} strokeWidth="1.5"/></svg>,
  layers:(s:number,c:string)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M10 2l8 4-8 4-8-4 8-4z" stroke={c} strokeWidth="1.4" strokeLinejoin="round"/><path d="M2 10l8 4 8-4" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 14l8 4 8-4" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  shield:(s:number,c:string)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M10 2L3 5.5v5c0 4 3.5 6.5 7 7.5 3.5-1 7-3.5 7-7.5v-5L10 2z" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/></svg>,
};
function JunctionLines({style}:{style?:React.CSSProperties}){return <svg viewBox="0 0 320 200" fill="none" style={{opacity:.12,...style}}><path d="M0 60H100C120 60 120 60 140 40L200 40H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/><path d="M0 60H100C120 60 120 60 140 80L200 80H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/><path d="M0 120H60C80 120 80 120 100 100L160 100H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/><path d="M0 120H60C80 120 80 120 100 140L160 140H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/></svg>}
function Section({n,title,desc,children}:{n:string,title:string,desc:string,children:React.ReactNode}){return(<section style={{marginBottom:48}}><div style={{fontSize:10,fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",color:C.azulClaro,fontFamily:Fn.title,marginBottom:6}}>{n}</div><h2 style={{fontSize:22,fontWeight:700,color:C.cinzaEscuro,margin:"0 0 4px",fontFamily:Fn.title,letterSpacing:".5px"}}>{title}</h2><p style={{fontSize:14,color:C.cinzaChumbo,margin:"0 0 22px",lineHeight:1.55,fontFamily:Fn.body}}>{desc}</p>{children}</section>)}
function DSCard({children,s,mob:m}:{children:React.ReactNode,s?:React.CSSProperties,mob?:boolean}){return(<div style={{background:C.cardBg,borderRadius:"12px 12px 12px 24px",border:`1px solid ${C.cardBorder}`,padding:m?16:28,boxShadow:"0 1px 3px rgba(0,75,155,.04),0 4px 14px rgba(0,75,155,.03)",...s}}>{children}</div>)}
function TokenRow({label,value}:{label:string,value:string}){return(<div style={{display:"flex",alignItems:"center",gap:10,fontSize:12,fontFamily:Fn.body}}><span style={{color:C.cinzaChumbo,minWidth:160}}>{label}</span><code style={{background:C.neutro,padding:"2px 8px",borderRadius:4,fontSize:11,fontFamily:Fn.mono,color:C.cinzaEscuro}}>{value}</code></div>)}

const families=[
  {name:"Saira Expanded",family:Fn.title,tag:"Títulos",tagColor:C.azulProfundo,desc:"Headers, títulos de página, seção, modal, card. Personalidade expandida e industrial — identidade FIPS.",
   weights:[{w:800,l:"ExtraBold",use:"Hero h1, destaque máximo"},{w:700,l:"Bold",use:"Títulos de seção, modal, card"},{w:600,l:"SemiBold",use:"Subtítulos, tab ativa, labels destaque"},{w:500,l:"Medium",use:"Labels secundários"},{w:400,l:"Regular",use:"Footer, textos auxiliares em Saira"}],
   specimen:"Ferrovia Interna do Porto de Santos",charSet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789"},
  {name:"Open Sans",family:Fn.body,tag:"Corpo",tagColor:C.verdeFloresta,desc:"Textos de corpo, descrições, labels de formulário, tabela, parágrafos. Leitura confortável em qualquer tamanho.",
   weights:[{w:700,l:"Bold",use:"Destaque em corpo, nome em tabela"},{w:600,l:"SemiBold",use:"Labels de input, botões, badges"},{w:400,l:"Regular",use:"Corpo de texto, descrições, placeholders"}],
   specimen:"Excelência sobre trilhos desde 1980",charSet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789"},
  {name:"Fira Code",family:Fn.mono,tag:"Mono",tagColor:C.amareloEscuro,desc:"Valores numéricos, códigos, IDs, tokens, hex colors, snippets técnicos. Ligaduras tipográficas para código.",
   weights:[{w:600,l:"SemiBold",use:"Valores monetários destaque (R$ 15.600)"},{w:500,l:"Medium",use:"IDs, códigos (REQ-4025)"},{w:400,l:"Regular",use:"Tokens, hex, snippets, valores secundários"}],
   specimen:"REQ-4025 → R$ 15.600 #004B9B",charSet:"0123456789 {} [] () => -> !== === #$ R$ % @"},
];
const sizeScale=[
  {px:44,token:"text-hero",family:Fn.title,weight:700,lh:1.1,use:"Hero h1 desktop",color:C.azulEscuro,sample:"Design System"},
  {px:30,token:"text-hero-mob",family:Fn.title,weight:700,lh:1.15,use:"Hero h1 mobile",color:C.azulEscuro,sample:"Design System"},
  {px:22,token:"text-h2",family:Fn.title,weight:700,lh:1.2,use:"Título de seção",color:C.azulEscuro,sample:"Variantes visuais"},
  {px:20,token:"text-h3",family:Fn.title,weight:700,lh:1.25,use:"Título de card, anatomia",color:C.azulEscuro,sample:"Playground interativo"},
  {px:16,token:"text-subtitle",family:Fn.body,weight:400,lh:1.6,use:"Subtítulo hero, descrição",color:C.cinzaChumbo,sample:"Componentes e tokens para aplicações consistentes."},
  {px:15,token:"text-card-title",family:Fn.title,weight:700,lh:1.3,use:"Título interno de card",color:C.azulEscuro,sample:"App Suprimentos"},
  {px:14,token:"text-body",family:Fn.body,weight:400,lh:1.55,use:"Corpo padrão, parágrafos",color:C.cinzaEscuro,sample:"Tabela de dados com ordenação por coluna e seleção de linhas."},
  {px:13,token:"text-sm",family:Fn.body,weight:400,lh:1.55,use:"Corpo menor, guide text",color:C.cinzaEscuro,sample:"Ícones usam a cor do contexto. Tab ativa = laranja."},
  {px:12,token:"text-xs",family:Fn.body,weight:400,lh:1.5,use:"Captions, helper, footer",color:C.cinzaChumbo,sample:"6 requisições · 3 pendentes"},
  {px:11,token:"text-caption",family:Fn.body,weight:400,lh:1.45,use:"Badges, tooltips, notas",color:C.cinzaChumbo,sample:"Segmento: Ferroviário · Score: 94%"},
  {px:10,token:"text-micro",family:Fn.title,weight:700,lh:1.3,use:"Section number, labels uppercase",color:C.azulClaro,sample:"01 · NAVEGAÇÃO · TOKENS"},
];
const weightContexts=[
  {weight:800,label:"ExtraBold",family:"Saira Expanded",contexts:"Hero h1 (44px)",color:C.azulProfundo},
  {weight:700,label:"Bold",family:"Saira Expanded",contexts:"Títulos h2/h3, card title, modal title, tab label ativa",color:C.azulEscuro},
  {weight:700,label:"Bold",family:"Open Sans",contexts:"Nome em tabela, destaque em corpo, valor monetário",color:C.verdeFloresta},
  {weight:600,label:"SemiBold",family:"Saira Expanded",contexts:"Subtítulos, labels destaque, tab config ativa",color:C.amareloOuro},
  {weight:600,label:"SemiBold",family:"Open Sans",contexts:"Label de input, botão texto, badge, cell header tabela",color:C.amareloEscuro},
  {weight:600,label:"SemiBold",family:"Fira Code",contexts:"Valores monetários (R$ 15.600), IDs destaque",color:C.danger},
  {weight:500,label:"Medium",family:"Fira Code",contexts:"Códigos (REQ-4025), tokens",color:C.cinzaChumbo},
  {weight:400,label:"Regular",family:"Open Sans",contexts:"Corpo de texto, descrições, parágrafos, placeholder",color:C.cinzaEscuro},
  {weight:400,label:"Regular",family:"Saira Expanded",contexts:"Footer, texto auxiliar",color:C.textMuted},
  {weight:400,label:"Regular",family:"Fira Code",contexts:"Hex, snippets, valores secundários, tokens reference",color:C.textMuted},
];
const rules=[
  {title:"Saira só para títulos",desc:"Nunca use Saira Expanded em corpo de texto ou parágrafos. É uma fonte expandida — em blocos longos prejudica a leitura.",icon:"shield"},
  {title:"Open Sans para tudo legível",desc:"Corpo, labels, descrições, tabela, formulário. Quando em dúvida, use Open Sans Regular 14px.",icon:"check"},
  {title:"Fira Code só para valores",desc:"Mono é exclusivo para números, códigos, IDs, tokens e hex. Nunca use como corpo de texto ou título.",icon:"alert"},
  {title:"Line-height por contexto",desc:"Títulos: 1.1–1.3 (compacto). Corpo: 1.5–1.6 (confortável). Nunca use 1.0 em texto legível.",icon:"eye"},
  {title:"Não misture famílias",desc:"Cada contexto tem sua família definida. Título em Open Sans ou corpo em Saira são erros. Siga a tabela.",icon:"x"},
  {title:"Uppercase só em labels",desc:"Texto uppercase apenas em section numbers (01), labels de coluna e categorias. Nunca em títulos ou corpo.",icon:"layers"},
];

export default function DSFIPSTypography(){
  const [w,setW]=useState(typeof window!=="undefined"?window.innerWidth:1200);
  useEffect(()=>{const h=()=>setW(window.innerWidth);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h)},[]);
  const mob=w<640;

  return(
    <PlaygroundProvider>
    <div style={{minHeight:"100vh",background:"var(--color-surface-muted)",fontFamily:Fn.body,color:C.cinzaEscuro}}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <header style={{background:`linear-gradient(135deg,var(--color-gov-gradient-from) 0%,var(--color-gov-gradient-to) 100%)`,padding:mob?"32px 20px":"48px 40px 44px",position:"relative",overflow:"hidden"}}>
        <JunctionLines style={{position:"absolute",top:-10,right:-20,width:mob?250:400,height:250}}/>
        <div style={{position:"relative"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:6,background:`${C.branco}10`,border:`1px solid ${C.branco}18`,borderRadius:20,padding:"5px 14px",fontSize:11,fontWeight:600,letterSpacing:"1.5px",textTransform:"uppercase",color:C.amareloOuro,fontFamily:Fn.title,marginBottom:16}}>{Ic.grid(14,C.amareloOuro)} Design System FIPS</div>
          <h1 style={{fontSize:mob?30:44,fontWeight:700,color:C.branco,margin:"0 0 10px",fontFamily:Fn.title}}>Tipografia</h1>
          <p style={{fontSize:16,color:`${C.branco}B0`,lineHeight:1.6,maxWidth:700,margin:0,fontFamily:Fn.body}}>Três famílias tipográficas com funções definidas: <strong style={{color:C.amareloOuro}}>Saira Expanded</strong> para títulos, <strong style={{color:`${C.branco}D0`}}>Open Sans</strong> para corpo e <strong style={{color:`${C.branco}D0`}}>Fira Code</strong> para valores técnicos.</p>
        </div>
      </header>

      <div style={{padding:mob?"24px 16px 40px":"36px 40px 60px",maxWidth:1100,margin:"0 auto"}}>
        <Section n="01" title="Famílias tipográficas" desc="Cada família tem função exclusiva. Specimens, pesos disponíveis e character set.">
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {families.map((f)=>(
              <DSCard key={f.name} mob={mob}>
                <div style={{display:"flex",alignItems:mob?"flex-start":"center",gap:mob?12:20,marginBottom:20,flexDirection:mob?"column":"row"}}>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                      <code style={{fontSize:10,fontFamily:Fn.mono,background:alpha(f.tagColor,0.07),color:f.tagColor,padding:"3px 8px",borderRadius:4,fontWeight:600}}>{f.tag}</code>
                      <span style={{fontSize:mob?20:28,fontWeight:700,color:C.cinzaEscuro,fontFamily:f.family,lineHeight:1.2}}>{f.name}</span>
                    </div>
                    <p style={{fontSize:13,color:C.cinzaChumbo,margin:0,lineHeight:1.55,fontFamily:Fn.body}}>{f.desc}</p>
                  </div>
                </div>
                <div style={{background:C.bg,borderRadius:8,padding:mob?12:16,marginBottom:16}}>
                  <span style={{fontSize:mob?18:24,fontWeight:700,fontFamily:f.family,color:C.cinzaEscuro,display:"block",marginBottom:4,lineHeight:1.3}}>{f.specimen}</span>
                  <span style={{fontSize:11,fontFamily:f.family,color:C.textMuted,wordBreak:"break-all",lineHeight:1.6}}>{f.charSet}</span>
                </div>
                <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"repeat(auto-fit,minmax(200px,1fr))",gap:8}}>
                  {f.weights.map(wt=>(
                    <div key={wt.l} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",borderRadius:6,border:`1px solid ${C.cardBorder}`,background:C.cardBg}}>
                      <span style={{fontFamily:f.family,fontWeight:wt.w,fontSize:18,color:C.cinzaEscuro,minWidth:mob?40:56}}>{wt.w}</span>
                      <div style={{flex:1}}>
                        <span style={{fontSize:12,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.body,display:"block"}}>{wt.l}</span>
                        <span style={{fontSize:10,color:C.textMuted,fontFamily:Fn.body}}>{wt.use}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </DSCard>
            ))}
          </div>
        </Section>

        <Section n="02" title="Escala de tamanhos" desc="11 tamanhos definidos — do hero 44px ao micro 10px. Cada um com família, peso e line-height fixos.">
          <DSCard mob={mob}>
            <div style={{display:"flex",flexDirection:"column",gap:0}}>
              {sizeScale.map((s,i)=>{
                const familyName = s.family === Fn.title ? "Saira Expanded" : s.family === Fn.body ? "Open Sans" : "Fira Code";
                const codeSnippet = `// DS-FIPS — ${s.token} (${s.use})\nfontFamily: "'${familyName}', ${familyName==="Fira Code"?"monospace":"sans-serif"}"\nfontSize: ${s.px}\nfontWeight: ${s.weight}\nlineHeight: ${s.lh}`;
                return (
                <Copyable
                  key={s.token}
                  label={`type-${s.token}`}
                  code={codeSnippet}
                  preview={
                    <div>
                      <span style={{fontSize:Math.min(s.px,24),fontWeight:s.weight,fontFamily:s.family,color:"#333B41",lineHeight:s.lh,display:"block",marginBottom:8}}>{s.sample}</span>
                      <code style={{fontSize:10,fontFamily:"'Fira Code', monospace",color:"#6B7784"}}>{s.token} - {familyName} {s.weight} {s.px}px</code>
                    </div>
                  }
                >
                <div style={{display:"flex",alignItems:mob?"flex-start":"center",gap:mob?8:16,padding:mob?"10px 0":"8px 0",borderBottom:i<sizeScale.length-1?`1px solid ${C.cardBorder}`:"none",flexDirection:mob?"column":"row",cursor:"pointer"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,minWidth:mob?"auto":200,flexShrink:0}}>
                    <code style={{fontSize:12,fontWeight:700,fontFamily:Fn.mono,color:C.cinzaEscuro,minWidth:32,textAlign:"right"}}>{s.px}px</code>
                    <code style={{fontSize:9,fontFamily:Fn.mono,color:C.textMuted,background:C.bg,padding:"1px 6px",borderRadius:3}}>{s.token}</code>
                  </div>
                  <div style={{flex:1,minWidth:0,overflow:"hidden"}}>
                    <span style={{fontSize:Math.min(s.px,mob?22:s.px),fontWeight:s.weight,fontFamily:s.family,color:s.color,lineHeight:s.lh,display:"block",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{s.sample}</span>
                  </div>
                  {!mob&&<span style={{fontSize:10,color:C.textMuted,fontFamily:Fn.body,minWidth:160,textAlign:"right",flexShrink:0}}>{s.use}</span>}
                </div>
                </Copyable>
                )
              })}
            </div>
          </DSCard>
        </Section>

        <Section n="03" title="Pesos por contexto" desc="Quando usar cada combinação de família + peso. Referência rápida.">
          <div style={{border:`1px solid ${C.cardBorder}`,borderRadius:"12px 12px 12px 24px",overflow:"hidden",background:C.cardBg}}>
            <div style={{display:"grid",gridTemplateColumns:mob?"1fr 1fr":"60px 100px 1.5fr 2fr",padding:"10px 20px",background:C.bg,borderBottom:`2px solid ${C.cardBorder}`}}>
              <span style={{fontSize:10,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.cinzaChumbo,fontFamily:Fn.title}}>Peso</span>
              {!mob&&<span style={{fontSize:10,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.cinzaChumbo,fontFamily:Fn.title}}>Nome</span>}
              <span style={{fontSize:10,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.cinzaChumbo,fontFamily:Fn.title}}>Família</span>
              {!mob&&<span style={{fontSize:10,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.cinzaChumbo,fontFamily:Fn.title}}>Contextos</span>}
            </div>
            {weightContexts.map((wc,i)=>(
              <div key={i} style={{display:"grid",gridTemplateColumns:mob?"1fr 1fr":"60px 100px 1.5fr 2fr",padding:"9px 20px",borderBottom:i<weightContexts.length-1?`1px solid ${C.cardBorder}`:"none",alignItems:"center",background:i%2===1?"#f8f9fb":"transparent"}}>
                <code style={{fontSize:13,fontWeight:700,fontFamily:Fn.mono,color:wc.color}}>{wc.weight}</code>
                {!mob&&<span style={{fontSize:12,fontWeight:600,color:C.cinzaEscuro,fontFamily:Fn.body}}>{wc.label}</span>}
                <span style={{fontSize:11,color:C.cinzaChumbo,fontFamily:Fn.body}}>{wc.family}</span>
                {!mob&&<span style={{fontSize:11,color:C.cinzaChumbo,fontFamily:Fn.body}}>{wc.contexts}</span>}
              </div>
            ))}
          </div>
        </Section>

        <Section n="04" title="Hierarquia visual" desc="Exemplo de uma página real com a tipografia correta aplicada em cada nível.">
          <DSCard mob={mob}>
            <div style={{background:C.bg,borderRadius:"10px 10px 10px 18px",padding:mob?16:24,border:`1px solid ${C.cardBorder}`}}>
              <div style={{marginBottom:20}}>
                <div style={{fontSize:10,fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",color:C.azulClaro,fontFamily:Fn.title,marginBottom:4}}>01 <span style={{marginLeft:8,fontSize:9,color:C.textLight,fontFamily:Fn.mono}}>text-micro · Saira 700 10px uppercase</span></div>
                <div style={{fontSize:mob?20:22,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title,marginBottom:2}}>Playground interativo <span style={{marginLeft:8,fontSize:9,color:C.textLight,fontFamily:Fn.mono}}>text-h2 · Saira 700 22px</span></div>
                <div style={{fontSize:14,color:C.cinzaChumbo,fontFamily:Fn.body,lineHeight:1.55,marginBottom:16}}>Tabela completa com dados reais. Clique nos headers para ordenar. <span style={{fontSize:9,color:C.textLight,fontFamily:Fn.mono}}>text-body · Open Sans 400 14px</span></div>
              </div>
              <div style={{background:C.cardBg,borderRadius:"10px 10px 10px 18px",border:`1px solid ${C.cardBorder}`,padding:mob?12:16,marginBottom:12}}>
                <div style={{fontSize:15,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title,marginBottom:4}}>App Suprimentos <span style={{fontSize:9,color:C.textLight,fontFamily:Fn.mono}}>text-card-title · Saira 700 15px</span></div>
                <div style={{fontSize:13,color:C.cinzaEscuro,fontFamily:Fn.body,lineHeight:1.55,marginBottom:8}}>Requisições com avatar, valor monetário e badge. <span style={{fontSize:9,color:C.textLight,fontFamily:Fn.mono}}>text-sm · Open Sans 400 13px</span></div>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <span style={{fontSize:12,fontWeight:600,fontFamily:Fn.body,color:C.cinzaEscuro}}>Carlos Santos <span style={{fontSize:9,color:C.textLight,fontFamily:Fn.mono}}>Open Sans 600</span></span>
                  <span style={{fontFamily:Fn.mono,fontWeight:600,fontSize:12,color:C.cinzaEscuro}}>R$ 15.600 <span style={{fontSize:9,color:C.textLight,fontFamily:Fn.body,fontWeight:400}}>Fira Code 600</span></span>
                  <code style={{fontSize:11,fontFamily:Fn.mono,fontWeight:500,color:C.cinzaChumbo}}>REQ-4025 <span style={{fontSize:9,color:C.textLight,fontFamily:Fn.body,fontWeight:400}}>Fira Code 500</span></code>
                </div>
              </div>
              <div style={{fontSize:12,color:C.cinzaChumbo,fontFamily:Fn.title,fontWeight:400}}>DS-FIPS v0.4.2 · Excelência sobre trilhos <span style={{fontSize:9,color:C.textLight,fontFamily:Fn.mono}}>text-xs · Saira 400 12px</span></div>
            </div>
          </DSCard>
        </Section>

        <Section n="05" title="Line-height" desc="Espaçamento entre linhas por contexto. Títulos compactos, corpo confortável.">
          <DSCard mob={mob}>
            <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr 1fr",gap:mob?16:24}}>
              {[
                {lh:"1.1",label:"Compacto",use:"Hero h1 (44px)",family:Fn.title,weight:700,size:28,sample:"Design System FIPS",color:C.azulEscuro},
                {lh:"1.2–1.3",label:"Título",use:"h2, h3, card title",family:Fn.title,weight:700,size:20,sample:"Playground\ninterativo",color:C.azulEscuro},
                {lh:"1.5–1.6",label:"Corpo",use:"Parágrafos, descrições",family:Fn.body,weight:400,size:14,sample:"Tabela de dados com ordenação\npor coluna, seleção de linhas\ne hover interativo.",color:C.cinzaEscuro},
              ].map(item=>(
                <div key={item.label} style={{background:C.bg,borderRadius:8,padding:mob?12:16,border:`1px solid ${C.cardBorder}`}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                    <code style={{fontSize:16,fontWeight:700,fontFamily:Fn.mono,color:C.cinzaEscuro}}>{item.lh}</code>
                    <div><span style={{fontSize:12,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title,display:"block"}}>{item.label}</span><span style={{fontSize:10,color:C.textMuted,fontFamily:Fn.body}}>{item.use}</span></div>
                  </div>
                  <div style={{background:C.cardBg,borderRadius:6,padding:12,border:`1px solid ${C.cardBorder}`}}>
                    <span style={{fontSize:Math.min(item.size,mob?16:item.size),fontWeight:item.weight,fontFamily:item.family,color:item.color,lineHeight:parseFloat(item.lh),whiteSpace:"pre-line"}}>{item.sample}</span>
                  </div>
                </div>
              ))}
            </div>
          </DSCard>
        </Section>

        <Section n="06" title="Regras de uso" desc="Diretrizes para manter consistência tipográfica.">
          <DSCard mob={mob}>
            <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:mob?16:24}}>
              {rules.map(r=>(
                <div key={r.title} style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                  <div style={{width:36,height:36,borderRadius:10,background:C.bg,border:`1px solid ${C.cardBorder}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{(Ic as Record<string,(s:number,c:string)=>React.ReactNode>)[r.icon](16,C.azulProfundo)}</div>
                  <div><span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title,display:"block",marginBottom:2}}>{r.title}</span><span style={{fontSize:12,color:C.cinzaChumbo,fontFamily:Fn.body,lineHeight:1.5}}>{r.desc}</span></div>
                </div>
              ))}
            </div>
          </DSCard>
        </Section>

        <Section n="07" title="Tokens de referência" desc="Valores tipográficos do sistema.">
          <DSCard mob={mob} s={{display:"flex",gap:mob?24:48,flexWrap:"wrap"}}>
            <div style={{display:"flex",flexDirection:"column",gap:10,minWidth:220}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:Fn.title,marginBottom:4}}>Famílias</span>
              <TokenRow label="Títulos" value="Saira Expanded"/>
              <TokenRow label="Corpo" value="Open Sans"/>
              <TokenRow label="Mono" value="Fira Code"/>
              <div style={{height:1,background:C.cardBorder,margin:"4px 0"}}/>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:Fn.title,marginBottom:4}}>Bundle local</span>
              <TokenRow label="Arquivo" value="fontes-fips.css"/>
              <TokenRow label="Saira" value="wdth=125 · 500–700"/>
              <TokenRow label="Open Sans" value="400–700"/>
              <TokenRow label="Mono" value="ui-monospace (token)"/>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10,minWidth:220}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:Fn.title,marginBottom:4}}>Tamanhos</span>
              {sizeScale.map(s=>(<TokenRow key={s.token} label={s.token} value={`${s.px}px / ${s.weight} / ${s.lh}`}/>))}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10,minWidth:180}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:Fn.title,marginBottom:4}}>Line-height</span>
              <TokenRow label="Hero" value="1.1"/>
              <TokenRow label="Título h2/h3" value="1.2–1.25"/>
              <TokenRow label="Card title" value="1.3"/>
              <TokenRow label="Corpo" value="1.5–1.55"/>
              <TokenRow label="Subtítulo hero" value="1.6"/>
              <div style={{height:1,background:C.cardBorder,margin:"4px 0"}}/>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:Fn.title,marginBottom:4}}>Letter-spacing</span>
              <TokenRow label="Hero" value="-0.5px"/>
              <TokenRow label="Títulos" value="0.5px"/>
              <TokenRow label="Uppercase labels" value="1–2px"/>
              <TokenRow label="Corpo" value="normal"/>
            </div>
          </DSCard>
        </Section>

        <Section n="08" title="Considerações Dark Mode" desc="Adaptações tipográficas para o modo escuro do DS-FIPS.">
          <div style={{background:C.cardBg,borderRadius:"10px 10px 10px 18px",border:`1px solid ${C.cardBorder}`,padding:mob?16:24}}>
            <p style={{fontSize:13,color:C.cinzaChumbo,lineHeight:1.6,margin:"0 0 16px",fontFamily:Fn.body}}>
              No dark mode, o foreground principal muda de #333B41 para #E2E2E8 e o muted de #6B7784 para #A1A1AA. Fontes e pesos permanecem idênticos — a hierarquia tipográfica não muda entre modos.
            </p>
            <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:10}}>
              {[
                {label:"fg (light)",value:"#333B41"},
                {label:"fg (dark)",value:"#E2E2E8"},
                {label:"fg-muted (light)",value:"#6B7784"},
                {label:"fg-muted (dark)",value:"#A1A1AA"},
                {label:"Fontes",value:"Idênticas em ambos"},
                {label:"Pesos",value:"Idênticos em ambos"},
                {label:"Line-height",value:"Sem alteração"},
                {label:"Hierarquia",value:"Mantida por cor de texto"},
              ].map((t,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,fontSize:12,fontFamily:Fn.body}}>
                  <span style={{color:C.cinzaChumbo,minWidth:140}}>{t.label}</span>
                  <code style={{background:C.neutro,padding:"2px 8px",borderRadius:4,fontSize:11,fontFamily:Fn.mono,color:C.cinzaEscuro}}>{t.value}</code>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <CodePlayground />

        <CodeExportSection items={[
          {
            label: 'Escala Tipografica FIPS',
            description: 'Familias, pesos e escala de tamanhos do DS-FIPS.',
            code: `/* ═══════════════════════════════════════════
   Typography Scale — DS-FIPS
   3 familias: Saira Expanded, Open Sans, Fira Code
   ═══════════════════════════════════════════ */

/* Google Fonts import */
:root {
  /* ── Familias ── */
  --font-heading: 'Saira Expanded', sans-serif;
  --font-body: 'Open Sans', sans-serif;
  --font-mono: 'Fira Code', monospace;

  /* ── Escala de tamanhos ── */
  --text-hero: 44px;       /* Hero h1 desktop — Saira 700 */
  --text-hero-mob: 30px;   /* Hero h1 mobile — Saira 700 */
  --text-h2: 22px;         /* Titulo secao — Saira 700 */
  --text-h3: 20px;         /* Titulo card — Saira 700 */
  --text-subtitle: 16px;   /* Subtitulo — Open Sans 400 */
  --text-card-title: 15px; /* Titulo interno card — Saira 700 */
  --text-body: 14px;       /* Corpo padrao — Open Sans 400 */
  --text-sm: 13px;         /* Corpo menor — Open Sans 400 */
  --text-xs: 12px;         /* Captions, helper — Open Sans 400 */
  --text-caption: 11px;    /* Badges, tooltips — Open Sans 400 */
  --text-micro: 10px;      /* Section labels — Saira 700 uppercase */
}

/* ── Tailwind utilities (se usar Tailwind) ── */
.font-heading { font-family: var(--font-heading); }
.font-body    { font-family: var(--font-body); }
.font-mono    { font-family: var(--font-mono); }

/* ── Uso por contexto ──
   Saira Expanded: Headers, titulos, section labels, tab labels
   Open Sans: Corpo, descricoes, labels de form, tabela, botoes
   Fira Code: Valores monetarios, IDs, codigos, tokens, hex
*/`,
          },
        ]} />

        <div style={{textAlign:"center",padding:"20px 0 0",borderTop:`1px solid ${C.cardBorder}`,marginTop:20}}>
          <span style={{fontSize:12,color:C.cinzaChumbo,letterSpacing:".5px",fontFamily:Fn.title,fontWeight:400}}>DS-FIPS v0.4.2 · Ferrovia Interna do Porto de Santos · Excelência sobre trilhos · {new Date().getFullYear()}</span>
        </div>
      </div>
    </div>
    </PlaygroundProvider>
  );
}
