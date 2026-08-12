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
  shield:(s:number,c:string)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M10 2L3 5.5v5c0 4 3.5 6.5 7 7.5 3.5-1 7-3.5 7-7.5v-5L10 2z" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  layers:(s:number,c:string)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M10 2l8 4-8 4-8-4 8-4z" stroke={c} strokeWidth="1.4" strokeLinejoin="round"/><path d="M2 10l8 4 8-4" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 14l8 4 8-4" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
};
function JunctionLines({style}:{style?:React.CSSProperties}){return <svg viewBox="0 0 320 200" fill="none" style={{opacity:.12,...style}}><path d="M0 60H100C120 60 120 60 140 40L200 40H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/><path d="M0 60H100C120 60 120 60 140 80L200 80H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/><path d="M0 120H60C80 120 80 120 100 100L160 100H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/><path d="M0 120H60C80 120 80 120 100 140L160 140H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/></svg>}
function Section({n,title,desc,children}:{n:string,title:string,desc:string,children:React.ReactNode}){return(<section style={{marginBottom:48}}><div style={{fontSize:10,fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",color:C.azulClaro,fontFamily:Fn.title,marginBottom:6}}>{n}</div><h2 style={{fontSize:22,fontWeight:700,color:C.cinzaEscuro,margin:"0 0 4px",fontFamily:Fn.title,letterSpacing:".5px"}}>{title}</h2><p style={{fontSize:14,color:C.cinzaChumbo,margin:"0 0 22px",lineHeight:1.55,fontFamily:Fn.body}}>{desc}</p>{children}</section>)}
function DSCard({children,s,mob:m}:{children:React.ReactNode,s?:React.CSSProperties,mob?:boolean}){return(<div style={{background:C.cardBg,borderRadius:"12px 12px 12px 24px",border:`1px solid ${C.cardBorder}`,padding:m?16:28,boxShadow:"0 1px 3px rgba(0,75,155,.04),0 4px 14px rgba(0,75,155,.03)",...s}}>{children}</div>)}
function TokenRow({label,value}:{label:string,value:string}){return(<div style={{display:"flex",alignItems:"center",gap:10,fontSize:12,fontFamily:Fn.body}}><span style={{color:C.cinzaChumbo,minWidth:160}}>{label}</span><code style={{background:C.neutro,padding:"2px 8px",borderRadius:4,fontSize:11,fontFamily:Fn.mono,color:C.cinzaEscuro}}>{value}</code></div>)}

const symmetricScale=[
  {px:0,label:"Nenhum",use:"Separadores, linhas",token:"radius-none"},
  {px:4,label:"4px",use:"Badges, chips, tags",token:"radius-xs"},
  {px:6,label:"6px",use:"Botões sm, inputs compactos",token:"radius-sm"},
  {px:8,label:"8px",use:"Botões, inputs, selects, dropdowns",token:"radius-md"},
  {px:10,label:"10px",use:"Cards internos, containers",token:"radius-lg"},
  {px:14,label:"14px",use:"Icon containers (modal/drawer)",token:"radius-xl"},
  {px:20,label:"20px",use:"Pills, badges grandes, tags",token:"radius-pill"},
  {px:"50%",label:"50%",use:"Avatares, dots, indicadores",token:"radius-full"},
];
const caixaVariations=[
  {name:"Grande",radius:"12px 12px 12px 24px",token:"caixa-lg",use:"Cards principais, Modal, Table, DSCard",w:160,h:100,color:C.azulProfundo},
  {name:"Médio",radius:"10px 10px 10px 18px",token:"caixa-md",use:"Cards internos, cenários, guide cards",w:130,h:85,color:C.verdeFloresta},
  {name:"Pequeno",radius:"10px 10px 10px 20px",token:"caixa-sm",use:"Cards de cenário, containers de seção",w:110,h:70,color:C.amareloEscuro},
];
const componentRadius=[
  {component:"Card / DSCard",radius:"12px 12px 12px 24px",type:"Caixa",color:C.azulProfundo},
  {component:"Modal",radius:"12px 12px 12px 24px",type:"Caixa",color:C.azulEscuro},
  {component:"Table",radius:"12px 12px 12px 24px",type:"Caixa",color:C.verdeFloresta},
  {component:"Drawer",radius:"0 (full height)",type:"Nenhum",color:C.cinzaChumbo},
  {component:"Card interno",radius:"10px 10px 10px 18px",type:"Caixa md",color:C.azulCeu},
  {component:"Button",radius:"8px",type:"Simétrico",color:C.amareloEscuro},
  {component:"Input / Select",radius:"8px",type:"Simétrico",color:C.cinzaChumbo},
  {component:"Badge",radius:"4px",type:"Simétrico",color:C.verdeEscuro},
  {component:"Tooltip",radius:"8px",type:"Simétrico",color:C.textMuted},
  {component:"Dropdown menu",radius:"8px",type:"Simétrico",color:C.azulProfundo},
  {component:"Icon container",radius:"14px",type:"Simétrico",color:C.amareloOuro},
  {component:"Avatar",radius:"50%",type:"Circular",color:C.danger},
  {component:"Tab Guia ativa",radius:"10px 10px 0 0",type:"Topo",color:C.amareloEscuro},
  {component:"Pill / Tag",radius:"20px",type:"Pill",color:C.azulCeu},
];
const rules=[
  {title:"Elemento Caixa é obrigatório",desc:"Todo container principal (card, modal, table, seção) usa border-radius assimétrico do Brandbook. Canto inferior esquerdo sempre maior.",icon:"shield"},
  {title:"Canto maior = inferior esquerdo",desc:"O canto com raio maior é sempre o bottom-left. Nunca rotacione ou espelhe o padrão. É a assinatura visual FIPS.",icon:"eye"},
  {title:"Simétrico só em elementos pequenos",desc:"Botões, inputs, badges, tooltips e dropdowns usam raio simétrico. Só containers grandes usam o Elemento Caixa.",icon:"layers"},
  {title:"Nunca misture padrões",desc:"Um elemento usa Caixa OU simétrico, nunca ambos. Não invente combinações novas de raios.",icon:"x"},
  {title:"Proporção importa",desc:"Container maior = caixa-lg (24px). Container menor = caixa-md (18px). O canto maior escala com o tamanho.",icon:"check"},
  {title:"Tabs Guia são exceção",desc:"Único componente com radius só no topo (10px 10px 0 0). A aba 'encaixa' no conteúdo abaixo.",icon:"alert"},
];

export default function DSFIPSRadius(){
  const [w,setW]=useState(typeof window!=="undefined"?window.innerWidth:1200);
  useEffect(()=>{const h=()=>setW(window.innerWidth);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h)},[]);
  const mob=w<640;
  const [hovRadius,setHovRadius]=useState<string|null>(null);

  return(
    <PlaygroundProvider>
    <div style={{minHeight:"100vh",background:"var(--color-surface-muted)",fontFamily:Fn.body,color:C.cinzaEscuro}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Saira+Expanded:wght@300;400;500;600;700;800&family=Open+Sans:wght@300;400;600;700&family=Fira+Code:wght@400;500&display=swap');@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <header style={{background:`linear-gradient(135deg,var(--color-gov-gradient-from) 0%,var(--color-gov-gradient-to) 100%)`,padding:mob?"32px 20px":"48px 40px 44px",position:"relative",overflow:"hidden"}}>
        <JunctionLines style={{position:"absolute",top:-10,right:-20,width:mob?250:400,height:250}}/>
        <div style={{position:"relative"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:6,background:`${C.branco}10`,border:`1px solid ${C.branco}18`,borderRadius:20,padding:"5px 14px",fontSize:11,fontWeight:600,letterSpacing:"1.5px",textTransform:"uppercase",color:C.amareloOuro,fontFamily:Fn.title,marginBottom:16}}>{Ic.grid(14,C.amareloOuro)} Design System FIPS</div>
          <h1 style={{fontSize:mob?30:44,fontWeight:700,color:C.branco,margin:"0 0 10px",fontFamily:Fn.title}}>Raios</h1>
          <p style={{fontSize:16,color:`${C.branco}B0`,lineHeight:1.6,maxWidth:700,margin:0,fontFamily:Fn.body}}>Border-radius simétricos e o <strong style={{color:C.amareloOuro}}>Elemento Caixa</strong> assimétrico — assinatura visual do Brandbook FIPS. Canto inferior esquerdo maior, inspirado nos contornos dos vagões ferroviários.</p>
        </div>
      </header>

      <div style={{padding:mob?"24px 16px 40px":"36px 40px 60px",maxWidth:1100,margin:"0 auto"}}>
        <Section n="01" title="Escala simétrica" desc="Raios uniformes para elementos menores. Do zero ao circular.">
          <div style={{display:"grid",gridTemplateColumns:mob?"repeat(2,1fr)":w<900?"repeat(4,1fr)":"repeat(8,1fr)",gap:mob?10:14}}>
            {symmetricScale.map((r,i)=>{const isHov=hovRadius===r.token;const isCircle=r.px==="50%";const radiusVal=typeof r.px==="number"?r.px+"px":r.px;return(
              <Copyable
                key={r.token}
                label={`radius-${r.label}`}
                code={`// DS-FIPS — Radius ${r.label}\nborderRadius: ${typeof r.px==="number"?r.px:'"'+r.px+'"'} // or "${radiusVal}"\n// Token: --${r.token}`}
                preview={
                  <div style={{display:"flex",alignItems:"center",gap:14}}>
                    <div style={{width:56,height:56,background:"#004B9B",borderRadius:typeof r.px==="number"?r.px:r.px,transition:"all .3s"}}/>
                    <div style={{fontSize:12,fontFamily:"'Fira Code',monospace",color:"#1B2A4A"}}>{r.label} — {r.token}</div>
                  </div>
                }
              >
              <div onMouseEnter={()=>setHovRadius(r.token)} onMouseLeave={()=>setHovRadius(null)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8,animation:`fadeUp .35s ease ${i*0.04}s both`}}>
                <div style={{width:isCircle?72:80,height:isCircle?72:56,background:C.cardBg,borderRadius:typeof r.px==="number"?r.px:r.px,border:`2px solid ${isHov?C.azulProfundo:C.cardBorder}`,boxShadow:isHov?"0 4px 12px rgba(0,75,155,.08)":"none",transition:"all .2s",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <code style={{fontSize:isCircle?11:13,fontWeight:700,fontFamily:Fn.mono,color:isHov?C.azulProfundo:C.cinzaChumbo,transition:"color .2s"}}>{r.label}</code>
                </div>
                <span style={{fontSize:10,color:C.cinzaChumbo,fontFamily:Fn.body,textAlign:"center",lineHeight:1.3}}>{r.use}</span>
                <code style={{fontSize:9,fontFamily:Fn.mono,color:C.textLight}}>{r.token}</code>
              </div>
              </Copyable>
            )})}
          </div>
        </Section>

        <Section n="02" title="Elemento Caixa" desc="Assinatura visual do Brandbook FIPS. Border-radius assimétrico com canto inferior esquerdo maior.">
          <div style={{display:"flex",gap:mob?16:32,flexDirection:mob?"column":"row",alignItems:mob?"stretch":"flex-start"}}>
            <div style={{flex:1}}>
              <DSCard mob={mob}>
                <span style={{fontSize:11,fontWeight:700,letterSpacing:"1.2px",textTransform:"uppercase",color:C.textLight,fontFamily:Fn.title,display:"block",marginBottom:20}}>Anatomia</span>
                <div style={{display:"flex",justifyContent:"center",marginBottom:20}}>
                  <div style={{position:"relative",width:mob?200:260,height:mob?140:180}}>
                    <div style={{width:"100%",height:"100%",borderRadius:"12px 12px 12px 24px",background:`linear-gradient(135deg,${alpha(C.azulProfundo,0.06)},${alpha(C.azulProfundo,0.02)})`,border:`2px dashed ${alpha(C.azulProfundo,0.25)}`}}/>
                    <div style={{position:"absolute",top:-8,left:-4,background:C.bg,border:`1px solid ${C.cardBorder}`,borderRadius:4,padding:"2px 6px"}}><code style={{fontSize:10,fontFamily:Fn.mono,color:C.cinzaChumbo,fontWeight:600}}>12px</code></div>
                    <div style={{position:"absolute",top:-8,right:-4,background:C.bg,border:`1px solid ${C.cardBorder}`,borderRadius:4,padding:"2px 6px"}}><code style={{fontSize:10,fontFamily:Fn.mono,color:C.cinzaChumbo,fontWeight:600}}>12px</code></div>
                    <div style={{position:"absolute",bottom:-8,right:-4,background:C.bg,border:`1px solid ${C.cardBorder}`,borderRadius:4,padding:"2px 6px"}}><code style={{fontSize:10,fontFamily:Fn.mono,color:C.cinzaChumbo,fontWeight:600}}>12px</code></div>
                    <div style={{position:"absolute",bottom:-8,left:-4,background:C.azulProfundo,borderRadius:4,padding:"2px 8px"}}><code style={{fontSize:11,fontFamily:Fn.mono,color:C.branco,fontWeight:700}}>24px ★</code></div>
                    <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center"}}>
                      <code style={{fontSize:mob?11:13,fontFamily:Fn.mono,color:C.cinzaEscuro,fontWeight:700,display:"block"}}>12px 12px 12px 24px</code>
                      <span style={{fontSize:10,color:C.textMuted,fontFamily:Fn.body,marginTop:4,display:"block"}}>top-left · top-right · bottom-right · bottom-left</span>
                    </div>
                  </div>
                </div>
                <div style={{background:`${C.amareloOuro}15`,border:`1px solid ${C.amareloOuro}30`,borderRadius:8,padding:"10px 14px",display:"flex",gap:8,alignItems:"flex-start"}}>
                  <span style={{color:C.amareloEscuro,fontSize:14,lineHeight:"18px",flexShrink:0}}>★</span>
                  <span style={{fontSize:12,color:C.cinzaEscuro,fontFamily:Fn.body,lineHeight:1.5}}>O canto inferior esquerdo com raio maior é a <strong>assinatura visual</strong> herdada do logo FIPS — remete à curva dos vagões e elementos ferroviários do Brandbook.</span>
                </div>
              </DSCard>
            </div>
            <div style={{flex:1}}>
              <DSCard mob={mob}>
                <span style={{fontSize:11,fontWeight:700,letterSpacing:"1.2px",textTransform:"uppercase",color:C.textLight,fontFamily:Fn.title,display:"block",marginBottom:20}}>Variações de tamanho</span>
                <div style={{display:"flex",flexDirection:"column",gap:24}}>
                  {caixaVariations.map(v=>(
                    <div key={v.name} style={{display:"flex",alignItems:"center",gap:mob?12:20}}>
                      <div style={{width:mob?v.w*0.65:v.w,height:mob?v.h*0.65:v.h,borderRadius:v.radius,background:`linear-gradient(135deg,${v.color},${alpha(v.color,0.8)})`,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                        <code style={{fontSize:mob?9:10,fontFamily:Fn.mono,color:`${C.branco}90`}}>{v.radius}</code>
                      </div>
                      <div>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                          <span style={{fontSize:14,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>{v.name}</span>
                          <code style={{fontSize:10,fontFamily:Fn.mono,color:v.color,fontWeight:600,background:alpha(v.color,0.06),padding:"1px 6px",borderRadius:3}}>{v.token}</code>
                        </div>
                        <span style={{fontSize:12,color:C.cinzaChumbo,fontFamily:Fn.body,lineHeight:1.4}}>{v.use}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </DSCard>
            </div>
          </div>
        </Section>

        <Section n="03" title="Comparação visual" desc="Elemento Caixa vs simétrico lado a lado. A diferença sutil que cria identidade.">
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:16}}>
            <div style={{background:`repeating-conic-gradient(${C.bg} 0% 25%, ${C.cardBg} 0% 50%) 0 0 / 16px 16px`,borderRadius:"12px 12px 12px 24px",border:`1px solid ${C.cardBorder}`,padding:mob?20:32,display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
              <div style={{width:"80%",height:mob?100:130,background:C.cardBg,borderRadius:"12px 12px 12px 24px",border:`1px solid ${C.cardBorder}`,boxShadow:"0 4px 14px rgba(0,75,155,.08)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <code style={{fontSize:12,fontFamily:Fn.mono,color:C.cinzaEscuro,fontWeight:600}}>12 12 12 24</code>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <div style={{width:20,height:20,borderRadius:"50%",background:C.verdeFloresta,display:"flex",alignItems:"center",justifyContent:"center"}}>{Ic.check(12,C.branco)}</div>
                <span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>Elemento Caixa</span>
              </div>
              <span style={{fontSize:11,color:C.cinzaChumbo,fontFamily:Fn.body,textAlign:"center"}}>Identidade FIPS. Personalidade visual.</span>
            </div>
            <div style={{background:`repeating-conic-gradient(${C.bg} 0% 25%, ${C.cardBg} 0% 50%) 0 0 / 16px 16px`,borderRadius:"12px 12px 12px 24px",border:`1px solid ${C.cardBorder}`,padding:mob?20:32,display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
              <div style={{width:"80%",height:mob?100:130,background:C.cardBg,borderRadius:12,border:`1px solid ${C.cardBorder}`,boxShadow:"0 4px 14px rgba(0,75,155,.08)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <code style={{fontSize:12,fontFamily:Fn.mono,color:C.cinzaChumbo}}>12 12 12 12</code>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <div style={{width:20,height:20,borderRadius:"50%",background:C.danger,display:"flex",alignItems:"center",justifyContent:"center"}}>{Ic.x(12,C.branco)}</div>
                <span style={{fontSize:13,fontWeight:700,color:C.cinzaChumbo,fontFamily:Fn.title}}>Simétrico genérico</span>
              </div>
              <span style={{fontSize:11,color:C.cinzaChumbo,fontFamily:Fn.body,textAlign:"center"}}>Sem identidade. Qualquer design system.</span>
            </div>
          </div>
        </Section>

        <Section n="04" title="Uso por componente" desc="Cada componente tem seu border-radius definido. Não altere.">
          <div style={{border:`1px solid ${C.cardBorder}`,borderRadius:"12px 12px 12px 24px",overflow:"hidden",background:C.cardBg}}>
            <div style={{display:"grid",gridTemplateColumns:mob?"2fr 1fr 1fr":"2fr 2fr 1fr",padding:"10px 20px",background:C.bg,borderBottom:`2px solid ${C.cardBorder}`}}>
              <span style={{fontSize:10,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.cinzaChumbo,fontFamily:Fn.title}}>Componente</span>
              <span style={{fontSize:10,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.cinzaChumbo,fontFamily:Fn.title}}>Border-radius</span>
              <span style={{fontSize:10,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.cinzaChumbo,fontFamily:Fn.title}}>Tipo</span>
            </div>
            {componentRadius.map((cr,i)=>(
              <div key={i} style={{display:"grid",gridTemplateColumns:mob?"2fr 1fr 1fr":"2fr 2fr 1fr",padding:"10px 20px",borderBottom:i<componentRadius.length-1?`1px solid ${C.cardBorder}`:"none",alignItems:"center",background:i%2===1?C.bg:"transparent"}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{width:6,height:6,borderRadius:"50%",background:cr.color,flexShrink:0}}/>
                  <span style={{fontSize:12,fontWeight:600,color:C.cinzaEscuro,fontFamily:Fn.body}}>{cr.component}</span>
                </div>
                <code style={{fontSize:mob?10:11,fontFamily:Fn.mono,color:C.cinzaEscuro,fontWeight:600}}>{cr.radius}</code>
                <span style={{fontSize:11,color:cr.type==="Caixa"||cr.type==="Caixa md"?C.amareloEscuro:C.cinzaChumbo,fontWeight:cr.type.startsWith("Caixa")?700:400,fontFamily:Fn.body}}>{cr.type}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section n="05" title="Regras de uso" desc="Diretrizes para manter consistência nos border-radius.">
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

        <Section n="06" title="Tokens de referência" desc="Todos os border-radius do sistema.">
          <DSCard mob={mob} s={{display:"flex",gap:mob?24:48,flexWrap:"wrap"}}>
            <div style={{display:"flex",flexDirection:"column",gap:10,minWidth:220}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:Fn.title,marginBottom:4}}>Simétricos</span>
              {symmetricScale.map(r=>(<TokenRow key={r.token} label={r.token} value={r.label}/>))}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10,minWidth:220}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:Fn.title,marginBottom:4}}>Elemento Caixa</span>
              {caixaVariations.map(v=>(<TokenRow key={v.token} label={v.token} value={v.radius}/>))}
              <div style={{height:1,background:C.cardBorder,margin:"4px 0"}}/>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:Fn.title,marginBottom:4}}>Especiais</span>
              <TokenRow label="Tab Guia ativa" value="10px 10px 0 0"/>
              <TokenRow label="Drawer" value="0 (full height)"/>
              <TokenRow label="Pill" value="20px"/>
              <TokenRow label="Circle" value="50%"/>
            </div>
          </DSCard>
        </Section>

        <Section n="07" title="Considerações Dark Mode" desc="Comportamento dos border-radius no modo escuro do DS-FIPS.">
          <div style={{background:C.cardBg,borderRadius:"10px 10px 10px 18px",border:`1px solid ${C.cardBorder}`,padding:mob?16:24}}>
            <p style={{fontSize:13,color:C.cinzaChumbo,lineHeight:1.6,margin:"0 0 16px",fontFamily:Fn.body}}>
              Raios de borda são idênticos em ambos os modos. No dark mode, as bordas usam #2E2E2E (strong: #3A3A3A) em vez de #D7E0EA.
            </p>
            <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:10}}>
              {[
                {label:"Border-radius",value:"Idêntico em ambos"},
                {label:"Elemento Caixa",value:"Sem alteração"},
                {label:"Borda (light)",value:"#D7E0EA"},
                {label:"Borda (dark)",value:"#2E2E2E"},
                {label:"Borda strong (light)",value:"#C0CCD2"},
                {label:"Borda strong (dark)",value:"#3A3A3A"},
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
            label: 'Border Radius Tokens FIPS',
            description: 'Escala completa de border-radius incluindo o padrao Caixa assimetrico.',
            code: `/* ═══════════════════════════════════════════
   Border Radius Tokens — DS-FIPS
   Inclui simetricos e o padrao Caixa assimetrico
   ═══════════════════════════════════════════ */

:root {
  /* ── Simetricos ── */
  --radius-none: 0;
  --radius-xs:   4px;   /* Badges, chips, tags */
  --radius-sm:   6px;   /* Botoes sm, inputs compactos */
  --radius-md:   8px;   /* Botoes, inputs, selects, dropdowns */
  --radius-lg:   10px;  /* Cards internos, containers */
  --radius-xl:   14px;  /* Icon containers (modal/drawer) */
  --radius-pill:  20px; /* Pills, badges grandes */
  --radius-full: 50%;   /* Avatares, dots */

  /* ── Elemento Caixa (assimetrico — identidade FIPS) ── */
  --radius-caixa-lg: 12px 12px 12px 24px;  /* Cards principais, Modal, Table */
  --radius-caixa-md: 10px 10px 10px 18px;  /* Cards internos, cenarios */
  --radius-caixa-sm: 10px 10px 10px 20px;  /* Cards de cenario menores */

  /* ── Especiais ── */
  /* Tab Guia ativa: 10px 10px 0 0 */
  /* Drawer: 0 (full height) */
}

/* ── Referencia por componente ──
   Card/DSCard:     12px 12px 12px 24px (caixa-lg)
   Modal:           12px 12px 12px 24px (caixa-lg)
   Table:           12px 12px 12px 24px (caixa-lg)
   Card interno:    10px 10px 10px 18px (caixa-md)
   Button:          8px (simetrico)
   Input/Select:    8px (simetrico)
   Badge:           4px (simetrico)
   Avatar:          50% (circular)
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
