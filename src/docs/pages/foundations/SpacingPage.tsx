import { useState, useEffect } from "react";
import { PlaygroundProvider, Copyable, CodePlayground } from '../../components/CodePlayground'

/* ═══════════════════════════════════════════ TOKENS ═══════════════════════════════════════════ */
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
  settings:(s:number,c:string)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="3" stroke={c} strokeWidth="1.5"/><path d="M10 1v3M10 16v3M1 10h3M16 10h3M3.9 3.9l2.1 2.1M14 14l2.1 2.1M16.1 3.9l-2.1 2.1M6 14l-2.1 2.1" stroke={c} strokeWidth="1.3" strokeLinecap="round"/></svg>,
};

function JunctionLines({style}:{style?:React.CSSProperties}){return <svg viewBox="0 0 320 200" fill="none" style={{opacity:.12,...style}}><path d="M0 60H100C120 60 120 60 140 40L200 40H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/><path d="M0 60H100C120 60 120 60 140 80L200 80H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/><path d="M0 120H60C80 120 80 120 100 100L160 100H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/><path d="M0 120H60C80 120 80 120 100 140L160 140H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/></svg>}

function Section({n,title,desc,children}:{n:string,title:string,desc:string,children:React.ReactNode}){return(<section style={{marginBottom:48}}><div style={{fontSize:10,fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",color:C.azulClaro,fontFamily:Fn.title,marginBottom:6}}>{n}</div><h2 style={{fontSize:22,fontWeight:700,color:C.cinzaEscuro,margin:"0 0 4px",fontFamily:Fn.title,letterSpacing:".5px"}}>{title}</h2><p style={{fontSize:14,color:C.cinzaChumbo,margin:"0 0 22px",lineHeight:1.55,fontFamily:Fn.body}}>{desc}</p>{children}</section>)}
function DSCard({children,s,mob:m}:{children:React.ReactNode,s?:React.CSSProperties,mob?:boolean}){return(<div style={{background:C.cardBg,borderRadius:"12px 12px 12px 24px",border:`1px solid ${C.cardBorder}`,padding:m?16:28,boxShadow:"0 1px 3px rgba(0,75,155,.04),0 4px 14px rgba(0,75,155,.03)",...s}}>{children}</div>)}
function TokenRow({label,value}:{label:string,value:string}){return(<div style={{display:"flex",alignItems:"center",gap:10,fontSize:12,fontFamily:Fn.body}}><span style={{color:C.cinzaChumbo,minWidth:160}}>{label}</span><code style={{background:C.neutro,padding:"2px 8px",borderRadius:4,fontSize:11,fontFamily:Fn.mono,color:C.cinzaEscuro}}>{value}</code></div>)}

/* ═══════════════════════════════════════════ DATA ═══════════════════════════════════════════ */
const scale=[
  {px:4, token:"space-xs",  use:"Gap ícone–badge, margin mínimo",        color:C.azulCeu},
  {px:8, token:"space-sm",  use:"Gap entre badges, padding badge, gap inline", color:C.azulCeu},
  {px:12,token:"space-md",  use:"Padding input, gap tab–conteúdo, gap cards internos", color:C.verdeFloresta},
  {px:16,token:"space-lg",  use:"Padding card mobile, gap entre cards, padding body", color:C.verdeFloresta},
  {px:20,token:"space-xl",  use:"Padding card desktop, gap seções internas", color:C.amareloOuro},
  {px:24,token:"space-2xl", use:"Padding modal/drawer, gap entre seções", color:C.amareloOuro},
  {px:32,token:"space-3xl", use:"Padding header hero, margem entre blocos", color:C.amareloEscuro},
  {px:48,token:"space-4xl", use:"Margem entre seções do catálogo, separação visual forte", color:C.amareloEscuro},
];

const paddings=[
  {component:"Badge",padding:"2px 6px",token:"space-xs",color:C.verdeEscuro},
  {component:"Button sm",padding:"6px 12px",token:"space-sm / space-md",color:C.azulProfundo},
  {component:"Button padrão",padding:"8px 16px",token:"space-sm / space-lg",color:C.azulProfundo},
  {component:"Input / Select",padding:"8px 12px",token:"space-sm / space-md",color:C.cinzaChumbo},
  {component:"Input compacto",padding:"6px 10px",token:"—",color:C.cinzaChumbo},
  {component:"Tab item",padding:"8px 16px",token:"space-sm / space-lg",color:C.amareloEscuro},
  {component:"Table cell",padding:"10px 16px",token:"— / space-lg",color:C.verdeFloresta},
  {component:"Table cell compacta",padding:"6px 16px",token:"— / space-lg",color:C.verdeFloresta},
  {component:"Card (mobile)",padding:"16px",token:"space-lg",color:C.azulCeu},
  {component:"Card (desktop)",padding:"28px",token:"—",color:C.azulCeu},
  {component:"Modal body",padding:"20px 24px",token:"space-xl / space-2xl",color:C.azulEscuro},
  {component:"Drawer body",padding:"20px 24px",token:"space-xl / space-2xl",color:C.azulEscuro},
  {component:"Header hero (desktop)",padding:"48px 40px",token:"space-4xl / —",color:C.amareloOuro},
  {component:"Header hero (mobile)",padding:"32px 20px",token:"space-3xl / space-xl",color:C.amareloOuro},
  {component:"Página (desktop)",padding:"36px 40px",token:"— / —",color:C.textMuted},
  {component:"Página (mobile)",padding:"24px 16px",token:"space-2xl / space-lg",color:C.textMuted},
];

const gaps=[
  {context:"Ícone — texto (badge)",gap:"4px",token:"space-xs",color:C.azulCeu},
  {context:"Ícone — texto (botão/tab)",gap:"6px",token:"—",color:C.azulCeu},
  {context:"Ícone — texto (input)",gap:"8px",token:"space-sm",color:C.verdeFloresta},
  {context:"Cards dentro de grid",gap:"12–16px",token:"space-md / space-lg",color:C.verdeFloresta},
  {context:"Seções dentro de card",gap:"16–20px",token:"space-lg / space-xl",color:C.amareloOuro},
  {context:"Seções da página (catálogo)",gap:"48px",token:"space-4xl",color:C.amareloEscuro},
  {context:"Variantes em grid 2×2",gap:"16px",token:"space-lg",color:C.verdeFloresta},
  {context:"Label → Input",gap:"1px margin-bottom",token:"—",color:C.cinzaChumbo},
  {context:"Input → Helper/Error",gap:"4px",token:"space-xs",color:C.cinzaChumbo},
  {context:"Cenários grid",gap:"16–24px",token:"space-lg / space-2xl",color:C.amareloOuro},
];

const rules=[
  {title:"Múltiplos de 4",desc:"Todos os valores de espaçamento são múltiplos de 4px. Nunca use 5px, 7px, 13px ou qualquer valor ímpar/quebrado.",icon:"check"},
  {title:"Escala fixa — 8 valores",desc:"Use apenas os 8 tokens da escala (4→48). Se nenhum encaixa, repense o layout em vez de inventar um valor novo.",icon:"layers"},
  {title:"Mobile reduz 1 nível",desc:"No mobile, padding e gap descem 1 nível na escala. Desktop 24px → Mobile 16px. Desktop 16px → Mobile 12px.",icon:"settings"},
  {title:"Consistência interna",desc:"Dentro de um mesmo componente, use o mesmo token de padding horizontal. Nunca 12px left e 16px right.",icon:"eye"},
  {title:"Vertical > Horizontal",desc:"Padding vertical pode ser menor que horizontal em elementos inline (badges, tabs). Nunca o inverso.",icon:"alert"},
  {title:"Separação visual = gap maior",desc:"Quanto mais importância na separação, maior o gap. Seções 48px, cards 16px, itens inline 4–8px.",icon:"grid"},
];

/* ═══════════════════════════════════════════ MAIN ═══════════════════════════════════════════ */
export default function DSFIPSSpacing(){
  const [w,setW]=useState(typeof window!=="undefined"?window.innerWidth:1200);
  useEffect(()=>{const h=()=>setW(window.innerWidth);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h)},[]);
  const mob=w<640;
  const [playPad,setPlayPad]=useState(16);
  const [playGap,setPlayGap]=useState(12);

  return(
    <PlaygroundProvider>
    <div style={{minHeight:"100vh",background:"var(--color-surface-muted)",fontFamily:Fn.body,color:C.cinzaEscuro}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Saira+Expanded:wght@300;400;500;600;700;800&family=Open+Sans:wght@300;400;600;700&family=Fira+Code:wght@400;500&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      <header style={{background:`linear-gradient(135deg,var(--color-gov-gradient-from) 0%,var(--color-gov-gradient-to) 100%)`,padding:mob?"32px 20px":"48px 40px 44px",position:"relative",overflow:"hidden"}}>
        <JunctionLines style={{position:"absolute",top:-10,right:-20,width:mob?250:400,height:250}}/>
        <div style={{position:"relative"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:6,background:`${C.branco}10`,border:`1px solid ${C.branco}18`,borderRadius:20,padding:"5px 14px",fontSize:11,fontWeight:600,letterSpacing:"1.5px",textTransform:"uppercase",color:C.amareloOuro,fontFamily:Fn.title,marginBottom:16}}>{Ic.grid(14,C.amareloOuro)} Design System FIPS</div>
          <h1 style={{fontSize:mob?30:44,fontWeight:700,color:C.branco,margin:"0 0 10px",fontFamily:Fn.title}}>Espaçamento</h1>
          <p style={{fontSize:16,color:`${C.branco}B0`,lineHeight:1.6,maxWidth:700,margin:0,fontFamily:Fn.body}}>Escala de 8 valores baseada em <strong style={{color:C.amareloOuro}}>múltiplos de 4px</strong>. Padding, gap e margin consistentes em todos os componentes. Mobile reduz 1 nível automaticamente.</p>
        </div>
      </header>

      <div style={{padding:mob?"24px 16px 40px":"36px 40px 60px",maxWidth:1100,margin:"0 auto"}}>

        <Section n="01" title="Escala visual" desc="8 valores de espaçamento. Barras proporcionais ao tamanho real.">
          <DSCard mob={mob}>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {scale.map((s,i)=>(
                <Copyable
                  key={s.token}
                  label={`spacing-${s.px}`}
                  code={`// DS-FIPS — Spacing ${s.px}\npadding: ${s.px} // or "${s.px}px"\n// Token: --${s.token}`}
                  preview={
                    <div style={{display:"flex",alignItems:"center",gap:12}}>
                      <div style={{background:"#004B9B",borderRadius:4,width:s.px*3,height:s.px*3,minWidth:12,minHeight:12,transition:"all .3s"}}/>
                      <div style={{fontSize:12,fontFamily:"'Fira Code',monospace",color:"#1B2A4A"}}>{s.px}px — {s.token}</div>
                    </div>
                  }
                >
                <div style={{display:"flex",alignItems:"center",gap:mob?8:16,animation:`fadeUp .3s ease ${i*0.04}s both`}}>
                  <code style={{fontSize:12,fontWeight:700,fontFamily:Fn.mono,color:C.cinzaEscuro,minWidth:mob?36:44,textAlign:"right"}}>{s.px}px</code>
                  <div style={{width:s.px*(mob?2.5:4),height:mob?18:22,borderRadius:4,background:`linear-gradient(90deg,${s.color},${s.color}88)`,flexShrink:0,transition:"width .3s"}}/>
                  <div style={{flex:1,minWidth:0}}>
                    <code style={{fontSize:10,fontFamily:Fn.mono,color:C.cinzaEscuro,fontWeight:600}}>{s.token}</code>
                    {!mob&&<span style={{fontSize:11,color:C.cinzaChumbo,fontFamily:Fn.body,marginLeft:8}}>{s.use}</span>}
                  </div>
                </div>
                </Copyable>
              ))}
            </div>
          </DSCard>
        </Section>

        <Section n="02" title="Playground" desc="Ajuste padding e gap ao vivo. Veja como o espaçamento afeta o layout.">
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:16}}>
            <DSCard mob={mob}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:"1.2px",textTransform:"uppercase",color:C.textLight,fontFamily:Fn.title,display:"block",marginBottom:12}}>Padding</span>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>
                {scale.map(s=>(
                  <button key={s.px} onClick={()=>setPlayPad(s.px)} style={{padding:"4px 8px",fontSize:11,fontWeight:playPad===s.px?700:400,fontFamily:Fn.mono,background:playPad===s.px?C.azulProfundo:"transparent",color:playPad===s.px?C.branco:C.cinzaChumbo,border:`1px solid ${playPad===s.px?C.azulProfundo:C.cardBorder}`,borderRadius:5,cursor:"pointer",transition:"all .15s"}}>{s.px}</button>
                ))}
              </div>
              <div style={{background:C.bg,borderRadius:8,border:`1px solid ${C.cardBorder}`,padding:4}}>
                <div style={{background:C.cardBg,borderRadius:6,border:`2px dashed ${C.azulCeu}`,padding:playPad,transition:"padding .3s ease"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:32,height:32,borderRadius:8,background:alpha(C.azulProfundo,0.04),display:"flex",alignItems:"center",justifyContent:"center"}}>{Ic.eye(16,C.azulProfundo)}</div>
                    <div>
                      <span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title,display:"block"}}>Card exemplo</span>
                      <span style={{fontSize:11,color:C.cinzaChumbo}}>padding: {playPad}px</span>
                    </div>
                  </div>
                </div>
              </div>
              <code style={{fontSize:11,fontFamily:Fn.mono,color:C.textMuted,marginTop:8,display:"block"}}>padding: {playPad}px → {scale.find(s=>s.px===playPad)?.token||"—"}</code>
            </DSCard>
            <DSCard mob={mob}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:"1.2px",textTransform:"uppercase",color:C.textLight,fontFamily:Fn.title,display:"block",marginBottom:12}}>Gap</span>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>
                {[4,8,12,16,24].map(g=>(
                  <button key={g} onClick={()=>setPlayGap(g)} style={{padding:"4px 8px",fontSize:11,fontWeight:playGap===g?700:400,fontFamily:Fn.mono,background:playGap===g?C.azulProfundo:"transparent",color:playGap===g?C.branco:C.cinzaChumbo,border:`1px solid ${playGap===g?C.azulProfundo:C.cardBorder}`,borderRadius:5,cursor:"pointer",transition:"all .15s"}}>{g}</button>
                ))}
              </div>
              <div style={{background:C.bg,borderRadius:8,border:`1px solid ${C.cardBorder}`,padding:12}}>
                <div style={{display:"flex",flexDirection:"column",gap:playGap,transition:"gap .3s ease"}}>
                  {[1,2,3].map(i=>(
                    <div key={i} style={{background:C.cardBg,border:`2px dashed ${C.verdeFloresta}60`,borderRadius:6,padding:"10px 14px",display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:8,height:8,borderRadius:"50%",background:C.verdeFloresta}}/>
                      <span style={{fontSize:12,color:C.cinzaEscuro,fontFamily:Fn.body}}>Item {i}</span>
                    </div>
                  ))}
                </div>
              </div>
              <code style={{fontSize:11,fontFamily:Fn.mono,color:C.textMuted,marginTop:8,display:"block"}}>gap: {playGap}px → {scale.find(s=>s.px===playGap)?.token||"—"}</code>
            </DSCard>
          </div>
        </Section>

        <Section n="03" title="Padding por componente" desc="Cada componente tem padding definido. Valores exatos para desktop e mobile.">
          <div style={{border:`1px solid ${C.cardBorder}`,borderRadius:"12px 12px 12px 24px",overflow:"hidden",background:C.cardBg}}>
            <div style={{display:"grid",gridTemplateColumns:mob?"2fr 1fr":"2fr 1.5fr 1fr",padding:"10px 20px",background:C.bg,borderBottom:`2px solid ${C.cardBorder}`}}>
              <span style={{fontSize:10,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.cinzaChumbo,fontFamily:Fn.title}}>Componente</span>
              <span style={{fontSize:10,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.cinzaChumbo,fontFamily:Fn.title}}>Padding</span>
              {!mob&&<span style={{fontSize:10,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.cinzaChumbo,fontFamily:Fn.title}}>Token</span>}
            </div>
            {paddings.map((p,i)=>(
              <div key={i} style={{display:"grid",gridTemplateColumns:mob?"2fr 1fr":"2fr 1.5fr 1fr",padding:"9px 20px",borderBottom:i<paddings.length-1?`1px solid ${C.cardBorder}`:"none",alignItems:"center",background:i%2===1?"#f8f9fb":"transparent"}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{width:6,height:6,borderRadius:"50%",background:p.color,flexShrink:0}}/>
                  <span style={{fontSize:12,fontWeight:600,color:C.cinzaEscuro,fontFamily:Fn.body}}>{p.component}</span>
                </div>
                <code style={{fontSize:11,fontFamily:Fn.mono,color:C.cinzaEscuro,fontWeight:600}}>{p.padding}</code>
                {!mob&&<code style={{fontSize:10,fontFamily:Fn.mono,color:C.textMuted}}>{p.token}</code>}
              </div>
            ))}
          </div>
        </Section>

        <Section n="04" title="Gap entre elementos" desc="Distância entre componentes em diferentes contextos.">
          <DSCard mob={mob}>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {gaps.map((g,i)=>(
                <div key={i} style={{display:"flex",alignItems:mob?"flex-start":"center",gap:mob?8:16,padding:"8px 0",borderBottom:i<gaps.length-1?`1px solid ${C.cardBorder}`:"none",flexDirection:mob?"column":"row"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,minWidth:mob?"auto":220}}>
                    <div style={{width:parseInt(g.gap)*(mob?2:3)||12,height:mob?12:16,borderRadius:3,background:`linear-gradient(90deg,${g.color},${g.color}70)`,flexShrink:0}}/>
                    <code style={{fontSize:12,fontWeight:700,fontFamily:Fn.mono,color:C.cinzaEscuro}}>{g.gap}</code>
                  </div>
                  <div style={{flex:1,display:"flex",alignItems:mob?"flex-start":"center",gap:8,flexWrap:"wrap"}}>
                    <span style={{fontSize:12,color:C.cinzaEscuro,fontFamily:Fn.body}}>{g.context}</span>
                    <code style={{fontSize:10,fontFamily:Fn.mono,color:C.cinzaEscuro,background:alpha(C.azulProfundo,0.03),padding:"1px 6px",borderRadius:3}}>{g.token}</code>
                  </div>
                </div>
              ))}
            </div>
          </DSCard>
        </Section>

        <Section n="05" title="Mobile vs Desktop" desc="No mobile, espaçamentos reduzem 1 nível na escala. Comparação ao vivo.">
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:16}}>
            <div style={{background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:"10px 10px 10px 18px",overflow:"hidden"}}>
              <div style={{padding:"10px 16px",background:C.bg,borderBottom:`1px solid ${C.cardBorder}`,display:"flex",alignItems:"center",gap:6}}>
                <div style={{width:10,height:10,borderRadius:"50%",background:C.verdeFloresta}}/>
                <span style={{fontSize:12,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>Desktop</span>
                <code style={{fontSize:10,fontFamily:Fn.mono,color:C.textMuted,marginLeft:"auto"}}>≥ 640px</code>
              </div>
              <div style={{padding:28}}>
                <div style={{background:C.bg,borderRadius:8,padding:24,marginBottom:16}}>
                  <div style={{height:12,width:"60%",borderRadius:4,background:C.cardBorder,marginBottom:8}}/>
                  <div style={{height:8,width:"80%",borderRadius:3,background:`${C.cardBorder}80`}}/>
                </div>
                <div style={{display:"flex",gap:16}}>
                  <div style={{flex:1,background:C.bg,borderRadius:6,padding:16,height:40}}/>
                  <div style={{flex:1,background:C.bg,borderRadius:6,padding:16,height:40}}/>
                </div>
              </div>
              <div style={{padding:"8px 16px",borderTop:`1px solid ${C.cardBorder}`,display:"flex",gap:12,flexWrap:"wrap"}}>
                {[{l:"padding",v:"28px"},{l:"gap",v:"16px"},{l:"inner",v:"24px"}].map(t=>(
                  <code key={t.l} style={{fontSize:10,fontFamily:Fn.mono,color:C.cinzaEscuro}}>{t.l}: <strong>{t.v}</strong></code>
                ))}
              </div>
            </div>
            <div style={{background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:"10px 10px 10px 18px",overflow:"hidden"}}>
              <div style={{padding:"10px 16px",background:C.bg,borderBottom:`1px solid ${C.cardBorder}`,display:"flex",alignItems:"center",gap:6}}>
                <div style={{width:10,height:10,borderRadius:"50%",background:C.amareloEscuro}}/>
                <span style={{fontSize:12,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>Mobile</span>
                <code style={{fontSize:10,fontFamily:Fn.mono,color:C.textMuted,marginLeft:"auto"}}>&lt; 640px</code>
              </div>
              <div style={{padding:16}}>
                <div style={{background:C.bg,borderRadius:8,padding:16,marginBottom:12}}>
                  <div style={{height:12,width:"60%",borderRadius:4,background:C.cardBorder,marginBottom:6}}/>
                  <div style={{height:8,width:"80%",borderRadius:3,background:`${C.cardBorder}80`}}/>
                </div>
                <div style={{display:"flex",gap:12}}>
                  <div style={{flex:1,background:C.bg,borderRadius:6,padding:12,height:36}}/>
                  <div style={{flex:1,background:C.bg,borderRadius:6,padding:12,height:36}}/>
                </div>
              </div>
              <div style={{padding:"8px 16px",borderTop:`1px solid ${C.cardBorder}`,display:"flex",gap:12,flexWrap:"wrap"}}>
                {[{l:"padding",v:"16px"},{l:"gap",v:"12px"},{l:"inner",v:"16px"}].map(t=>(
                  <code key={t.l} style={{fontSize:10,fontFamily:Fn.mono,color:C.amareloEscuro}}>{t.l}: <strong>{t.v}</strong></code>
                ))}
              </div>
            </div>
          </div>
          <div style={{marginTop:16,background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:8,padding:"14px 20px"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
              <span style={{fontSize:10,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.textLight,fontFamily:Fn.title}}>Contexto</span>
              <span style={{fontSize:10,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.verdeFloresta,fontFamily:Fn.title}}>Desktop</span>
              <span style={{fontSize:10,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.amareloEscuro,fontFamily:Fn.title}}>Mobile</span>
              {[{ctx:"Card padding",d:"28px",m:"16px"},{ctx:"Modal padding",d:"24px",m:"16px"},{ctx:"Header hero",d:"48px 40px",m:"32px 20px"},{ctx:"Página padding",d:"36px 40px",m:"24px 16px"},{ctx:"Grid gap",d:"16px",m:"12px"},{ctx:"Seção margin",d:"48px",m:"32px"}].map((r,i)=>[
                <span key={`c${i}`} style={{fontSize:12,fontWeight:600,color:C.cinzaEscuro,fontFamily:Fn.body,padding:"4px 0"}}>{r.ctx}</span>,
                <code key={`d${i}`} style={{fontSize:11,fontFamily:Fn.mono,color:C.verdeFloresta,fontWeight:600,padding:"4px 0"}}>{r.d}</code>,
                <code key={`m${i}`} style={{fontSize:11,fontFamily:Fn.mono,color:C.amareloEscuro,fontWeight:600,padding:"4px 0"}}>{r.m}</code>,
              ])}
            </div>
          </div>
        </Section>

        <Section n="06" title="Regras de uso" desc="Diretrizes para manter consistência no espaçamento.">
          <DSCard mob={mob}>
            <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:mob?16:24}}>
              {rules.map(r=>(
                <div key={r.title} style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                  <div style={{width:36,height:36,borderRadius:10,background:C.bg,border:`1px solid ${C.cardBorder}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{(Ic as Record<string,(s:number,c:string)=>React.ReactNode>)[r.icon](16,C.azulProfundo)}</div>
                  <div>
                    <span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title,display:"block",marginBottom:2}}>{r.title}</span>
                    <span style={{fontSize:12,color:C.cinzaChumbo,fontFamily:Fn.body,lineHeight:1.5}}>{r.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </DSCard>
        </Section>

        <Section n="07" title="Tokens de referência" desc="Todos os valores de espaçamento do sistema.">
          <DSCard mob={mob} s={{display:"flex",gap:mob?24:48,flexWrap:"wrap"}}>
            <div style={{display:"flex",flexDirection:"column",gap:10,minWidth:220}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:Fn.title,marginBottom:4}}>Escala</span>
              {scale.map(s=>(<TokenRow key={s.token} label={s.token} value={`${s.px}px`}/>))}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10,minWidth:220}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:Fn.title,marginBottom:4}}>Breakpoints</span>
              <TokenRow label="Mobile" value="< 640px"/>
              <TokenRow label="Tablet" value="< 900px"/>
              <TokenRow label="Desktop" value="≥ 900px"/>
              <div style={{height:1,background:C.cardBorder,margin:"4px 0"}}/>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:Fn.title,marginBottom:4}}>Inputs</span>
              <TokenRow label="Height desktop" value="35px"/>
              <TokenRow label="Height mobile" value="42px"/>
              <TokenRow label="Height compacto" value="30px"/>
              <div style={{height:1,background:C.cardBorder,margin:"4px 0"}}/>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:Fn.title,marginBottom:4}}>Regra</span>
              <TokenRow label="Base unit" value="4px"/>
              <TokenRow label="Fórmula" value="n × 4px"/>
            </div>
          </DSCard>
        </Section>

        <Section n="08" title="Considerações Dark Mode" desc="Comportamento do espaçamento no modo escuro do DS-FIPS.">
          <div style={{background:C.cardBg,borderRadius:"10px 10px 10px 18px",border:`1px solid ${C.cardBorder}`,padding:mob?16:24}}>
            <p style={{fontSize:13,color:C.cinzaChumbo,lineHeight:1.6,margin:"0 0 16px",fontFamily:Fn.body}}>
              A escala de espaçamento é idêntica em ambos os modos. Não há alteração de padding, margin ou gap entre light e dark — apenas cores de superfície e borda mudam.
            </p>
            <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:10}}>
              {[
                {label:"Escala (4–48px)",value:"Idêntica"},
                {label:"Padding",value:"Sem alteração"},
                {label:"Margin",value:"Sem alteração"},
                {label:"Gap",value:"Sem alteração"},
                {label:"Superfícies",value:"Mudam via CSS vars"},
                {label:"Bordas",value:"Mudam via CSS vars"},
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

        <div style={{textAlign:"center",padding:"20px 0 0",borderTop:`1px solid ${C.cardBorder}`,marginTop:20}}>
          <span style={{fontSize:12,color:C.cinzaChumbo,letterSpacing:".5px",fontFamily:Fn.title,fontWeight:400}}>DS-FIPS v0.4.2 · Ferrovia Interna do Porto de Santos · Excelência sobre trilhos · {new Date().getFullYear()}</span>
        </div>
      </div>
    </div>
    </PlaygroundProvider>
  );
}
