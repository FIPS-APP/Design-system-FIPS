import { useState, useEffect } from "react";

const C={azulProfundo:"var(--color-gov-azul-profundo)",azulEscuro:"var(--color-gov-azul-escuro)",azulClaro:"var(--color-gov-azul-claro)",cinzaChumbo:"var(--color-fg-muted)",cinzaEscuro:"var(--color-fg)",cinzaClaro:"#C0CCD2",azulCeu:"#93BDE4",azulCeuClaro:"#D3E3F4",amareloOuro:"#FDC24E",amareloEscuro:"#F6921E",verdeFloresta:"#00C64C",verdeEscuro:"var(--color-gov-verde-escuro)",danger:"#DC3545",neutro:"var(--color-surface-soft)",branco:"#FFFFFF",bg:"var(--color-surface-muted)",cardBg:"var(--color-surface)",cardBorder:"var(--color-border)",textMuted:"var(--color-fg-muted)",textLight:"var(--color-fg-muted)"};
const Fn={title:"'Saira Expanded',sans-serif",body:"'Open Sans',sans-serif",mono:"'Fira Code',monospace"};
const alpha=(c:string,a:number)=>`color-mix(in srgb, ${c} ${Math.round(a*100)}%, transparent)`;
const shadows={
  none:{label:"Nenhuma",value:"none",level:0,token:"shadow-none"},
  card:{label:"Card",value:"0 1px 3px rgba(0,75,155,.04), 0 4px 14px rgba(0,75,155,.03)",level:1,token:"shadow-card"},
  elevated:{label:"Elevated",value:"0 4px 14px rgba(0,75,155,.08)",level:2,token:"shadow-elevated"},
  dropdown:{label:"Dropdown",value:"0 8px 24px rgba(0,75,155,.12)",level:3,token:"shadow-dropdown"},
  guia:{label:"Guia ativa",value:"0 -4px 12px rgba(0,42,104,.10)",level:3,token:"shadow-guia"},
  modal:{label:"Modal",value:"0 20px 60px rgba(0,42,104,.20)",level:4,token:"shadow-modal"},
};
const shadowOrder=["none","card","elevated","dropdown","guia","modal"];
const Ic={
  grid:(s:number,c:string)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><rect x="2" y="2" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/><rect x="11" y="2" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/><rect x="2" y="11" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/><rect x="11" y="11" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/></svg>,
  card:(s:number,c:string)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><rect x="2" y="3" width="16" height="14" rx="3" stroke={c} strokeWidth="1.3"/><path d="M2 8h16" stroke={c} strokeWidth="1.3"/></svg>,
  layers:(s:number,c:string)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M10 2l8 4-8 4-8-4 8-4z" stroke={c} strokeWidth="1.4" strokeLinejoin="round"/><path d="M2 10l8 4 8-4" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 14l8 4 8-4" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  modal:(s:number,c:string)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><rect x="3" y="4" width="14" height="12" rx="2.5" stroke={c} strokeWidth="1.3"/><path d="M3 8h14" stroke={c} strokeWidth="1.3"/></svg>,
  dropdown:(s:number,c:string)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><rect x="2" y="2" width="16" height="10" rx="2" stroke={c} strokeWidth="1.3"/><path d="M6 15h8M8 18h4" stroke={c} strokeWidth="1.3" strokeLinecap="round"/></svg>,
  tab:(s:number,c:string)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><rect x="2" y="6" width="16" height="11" rx="2" stroke={c} strokeWidth="1.3"/><path d="M2 9h16" stroke={c} strokeWidth="1.3"/><rect x="3" y="6" width="5" height="3" rx="1" fill={c} opacity=".3"/></svg>,
  tooltip:(s:number,c:string)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><rect x="3" y="4" width="14" height="9" rx="2" stroke={c} strokeWidth="1.3"/><path d="M8 13l2 3 2-3" stroke={c} strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  drawer:(s:number,c:string)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><rect x="8" y="2" width="10" height="16" rx="2" stroke={c} strokeWidth="1.3"/><path d="M11 6h4M11 9h4M11 12h2" stroke={c} strokeWidth="1.2" strokeLinecap="round"/></svg>,
  eye:(s:number,c:string)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke={c} strokeWidth="1.5"/><circle cx="10" cy="10" r="2.5" stroke={c} strokeWidth="1.5"/></svg>,
  check:(s:number,c:string)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M4 10l4 4 8-8" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  alert:(s:number,c:string)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M10 2L1.5 17h17L10 2z" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/><path d="M10 8v4M10 14v.5" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>,
  arrow:(s:number,c:string)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M5 10h10M11 6l4 4-4 4" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
};
function JunctionLines({style}:{style?:React.CSSProperties}){return <svg viewBox="0 0 320 200" fill="none" style={{opacity:.12,...style}}><path d="M0 60H100C120 60 120 60 140 40L200 40H320" stroke="var(--color-junction-stroke)" strokeWidth="6" strokeLinecap="round"/><path d="M0 60H100C120 60 120 60 140 80L200 80H320" stroke="var(--color-junction-stroke)" strokeWidth="6" strokeLinecap="round"/><path d="M0 120H60C80 120 80 120 100 100L160 100H320" stroke="var(--color-junction-stroke)" strokeWidth="6" strokeLinecap="round"/><path d="M0 120H60C80 120 80 120 100 140L160 140H320" stroke="var(--color-junction-stroke)" strokeWidth="6" strokeLinecap="round"/></svg>}
function Section({n,title,desc,children}:{n:string,title:string,desc:string,children:React.ReactNode}){return(<section style={{marginBottom:48}}><div style={{fontSize:10,fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",color:C.azulClaro,fontFamily:Fn.title,marginBottom:6}}>{n}</div><h2 style={{fontSize:22,fontWeight:700,color:C.cinzaEscuro,margin:"0 0 4px",fontFamily:Fn.title,letterSpacing:".5px"}}>{title}</h2><p style={{fontSize:14,color:C.cinzaChumbo,margin:"0 0 22px",lineHeight:1.55,fontFamily:Fn.body}}>{desc}</p>{children}</section>)}
function DSCard({children,s,mob:m}:{children:React.ReactNode,s?:React.CSSProperties,mob?:boolean}){return(<div style={{background:C.cardBg,borderRadius:"12px 12px 12px 24px",border:`1px solid ${C.cardBorder}`,padding:m?16:28,boxShadow:shadows.card.value,...s}}>{children}</div>)}

const componentMap=[
  {component:"Card / DSCard",shadow:"card",desc:"Sombra padrão para todos os cards. Sutil, quase plana.",icon:"card",color:C.azulProfundo},
  {component:"Card hover",shadow:"elevated",desc:"Elevação ao passar o mouse. Feedback de interatividade.",icon:"card",color:C.azulCeu},
  {component:"Dropdown / Select",shadow:"dropdown",desc:"Menu flutuante sobre o conteúdo. Destaque claro.",icon:"dropdown",color:C.amareloEscuro},
  {component:"Tooltip",shadow:"dropdown",desc:"Mesma sombra do dropdown. Flutua sobre o conteúdo.",icon:"tooltip",color:C.cinzaChumbo},
  {component:"Tabs Guia (ativa)",shadow:"guia",desc:"Sombra invertida (negativa no Y). Aba 'levanta' do conteúdo.",icon:"tab",color:C.amareloEscuro},
  {component:"Modal",shadow:"modal",desc:"Máxima elevação. Overlay escuro + sombra profunda.",icon:"modal",color:C.azulEscuro},
  {component:"Drawer",shadow:"modal",desc:"Mesma elevação do modal. Painel lateral sobre tudo.",icon:"drawer",color:C.azulProfundo},
];
const rules=[
  {title:"Hierarquia de elevação",desc:"Quanto mais alto o elemento na hierarquia visual, maior a sombra. Card < Dropdown < Modal. Nunca inverta.",icon:"layers"},
  {title:"Uma sombra por elemento",desc:"Nunca combine dois níveis de sombra. Cada elemento usa exatamente um token da escala.",icon:"check"},
  {title:"Sombra não é borda",desc:"Sombra indica elevação, não separação. Para delimitar áreas use border, não box-shadow.",icon:"alert"},
  {title:"Hover = +1 nível",desc:"No hover, suba exatamente um nível na escala. Card (1) → Elevated (2). Nunca pule níveis.",icon:"arrow"},
  {title:"Cor da sombra",desc:"Sempre rgba azul FIPS (0,75,155 ou 0,42,104). Nunca preto puro. Sombra colorida integra com a paleta.",icon:"eye"},
  {title:"Guia é exceção",desc:"Única sombra com Y negativo (-4px). Exclusiva para Tabs Guia. Não usar em outros contextos.",icon:"tab"},
];

export default function DSFIPSShadows(){
  const [w,setW]=useState(typeof window!=="undefined"?window.innerWidth:1200);
  useEffect(()=>{const h=()=>setW(window.innerWidth);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h)},[]);
  const mob=w<640;
  const [playgroundShadow,setPlaygroundShadow]=useState("card");

  return(
    <div style={{minHeight:"100vh",background:"var(--color-surface-muted)",fontFamily:Fn.body,color:C.cinzaEscuro}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Saira+Expanded:wght@300;400;500;600;700;800&family=Open+Sans:wght@300;400;600;700&family=Fira+Code:wght@400;500&display=swap');@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <header style={{background:`linear-gradient(135deg,var(--color-gov-gradient-from) 0%,var(--color-gov-gradient-to) 100%)`,padding:mob?"32px 20px":"48px 40px 44px",position:"relative",overflow:"hidden"}}>
        <JunctionLines style={{position:"absolute",top:-10,right:-20,width:mob?250:400,height:250}}/>
        <div style={{position:"relative"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:6,background:`${C.branco}10`,border:`1px solid ${C.branco}18`,borderRadius:20,padding:"5px 14px",fontSize:11,fontWeight:600,letterSpacing:"1.5px",textTransform:"uppercase",color:C.amareloOuro,fontFamily:Fn.title,marginBottom:16}}>{Ic.grid(14,C.amareloOuro)} Design System FIPS</div>
          <h1 style={{fontSize:mob?30:44,fontWeight:700,color:C.branco,margin:"0 0 10px",fontFamily:Fn.title}}>Sombras</h1>
          <p style={{fontSize:16,color:`${C.branco}B0`,lineHeight:1.6,maxWidth:700,margin:0,fontFamily:Fn.body}}>Escala de elevação com 6 níveis de sombra. Cor azul FIPS integrada à paleta — nunca preto puro. Cada componente tem seu nível definido.</p>
        </div>
      </header>

      <div style={{padding:mob?"24px 16px 40px":"36px 40px 60px",maxWidth:1100,margin:"0 auto"}}>
        <Section n="01" title="Escala visual" desc="6 níveis de sombra do mais sutil ao mais profundo. Compare lado a lado.">
          <div style={{display:"grid",gridTemplateColumns:mob?"repeat(2,1fr)":w<900?"repeat(3,1fr)":"repeat(6,1fr)",gap:mob?12:16}}>
            {shadowOrder.map((key,i)=>{const sh=shadows[key as keyof typeof shadows];return(
              <div key={key} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10,animation:`fadeUp .35s ease ${i*0.06}s both`}}>
                <div style={{width:"100%",aspectRatio:"1",background:C.cardBg,borderRadius:"12px 12px 12px 20px",border:key==="none"?`1px solid ${C.cardBorder}`:"1px solid transparent",boxShadow:sh.value,display:"flex",alignItems:"center",justifyContent:"center",transition:"box-shadow .3s"}}>
                  <span style={{fontSize:24,fontWeight:800,fontFamily:Fn.title,color:alpha(C.azulProfundo,0.13)}}>{sh.level}</span>
                </div>
                <div style={{textAlign:"center"}}>
                  <span style={{fontSize:12,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title,display:"block"}}>{sh.label}</span>
                  <code style={{fontSize:9,fontFamily:Fn.mono,color:C.textMuted}}>{sh.token}</code>
                </div>
              </div>
            )})}
          </div>
        </Section>

        <Section n="02" title="Playground" desc="Clique nos níveis para ver a sombra aplicada ao vivo no card.">
          <div style={{display:"flex",gap:mob?16:32,flexDirection:mob?"column":"row",alignItems:mob?"stretch":"flex-start"}}>
            <div style={{display:"flex",flexDirection:mob?"row":"column",gap:8,flexWrap:mob?"wrap":"nowrap",minWidth:mob?"auto":180}}>
              {shadowOrder.map(key=>{const sh=shadows[key as keyof typeof shadows];const isActive=playgroundShadow===key;return(
                <button key={key} onClick={()=>setPlaygroundShadow(key)} style={{display:"flex",alignItems:"center",gap:8,padding:mob?"8px 12px":"10px 16px",fontSize:12,fontWeight:isActive?700:400,fontFamily:Fn.body,color:isActive?C.azulProfundo:C.cinzaChumbo,background:isActive?alpha(C.azulProfundo,0.03):C.cardBg,border:`1px solid ${isActive?C.azulProfundo:C.cardBorder}`,borderRadius:8,cursor:"pointer",transition:"all .15s",textAlign:"left",whiteSpace:"nowrap"}}>
                  <span style={{width:8,height:8,borderRadius:"50%",background:isActive?C.azulProfundo:C.cardBorder,flexShrink:0,transition:"background .15s"}}/>{sh.label}
                </button>
              )})}
            </div>
            <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:mob?200:280,background:`repeating-conic-gradient(${C.bg} 0% 25%, ${C.cardBg} 0% 50%) 0 0 / 20px 20px`,borderRadius:"12px 12px 12px 24px",border:`1px solid ${C.cardBorder}`,padding:mob?20:40}}>
              <div style={{width:mob?"90%":"70%",maxWidth:360,background:C.cardBg,borderRadius:"12px 12px 12px 24px",border:`1px solid ${playgroundShadow==="none"?C.cardBorder:"transparent"}`,boxShadow:shadows[playgroundShadow as keyof typeof shadows].value,padding:mob?16:24,transition:"box-shadow .4s ease"}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                  <div style={{width:40,height:40,borderRadius:12,background:alpha(C.azulProfundo,0.04),display:"flex",alignItems:"center",justifyContent:"center"}}>{Ic.card(20,C.azulProfundo)}</div>
                  <div><span style={{fontSize:14,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title,display:"block"}}>Card exemplo</span><span style={{fontSize:11,color:C.cinzaChumbo}}>Demonstração de sombra</span></div>
                </div>
                <div style={{height:1,background:C.cardBorder,marginBottom:12}}/>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <code style={{fontSize:11,fontFamily:Fn.mono,color:C.cinzaEscuro,fontWeight:600}}>{shadows[playgroundShadow as keyof typeof shadows].token}</code>
                  <span style={{fontSize:10,fontFamily:Fn.mono,color:C.textMuted}}>nível {shadows[playgroundShadow as keyof typeof shadows].level}</span>
                </div>
              </div>
            </div>
          </div>
          <div style={{marginTop:16,background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:8,padding:"12px 16px",fontFamily:Fn.mono,fontSize:12,color:C.cinzaEscuro,overflowX:"auto"}}>
            <span style={{color:C.textMuted}}>box-shadow: </span><span style={{color:C.cinzaEscuro,fontWeight:600}}>{shadows[playgroundShadow as keyof typeof shadows].value||"none"}</span><span style={{color:C.textMuted}}>;</span>
          </div>
        </Section>

        <Section n="03" title="Uso por componente" desc="Cada componente tem um nível de sombra fixo. Não altere.">
          <div style={{border:`1px solid ${C.cardBorder}`,borderRadius:"12px 12px 12px 24px",overflow:"hidden",background:C.cardBg}}>
            <div style={{display:"grid",gridTemplateColumns:mob?"2fr 1fr":"2fr 1fr 3fr",padding:"10px 20px",background:C.bg,borderBottom:`2px solid ${C.cardBorder}`}}>
              <span style={{fontSize:10,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.cinzaChumbo,fontFamily:Fn.title}}>Componente</span>
              <span style={{fontSize:10,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.cinzaChumbo,fontFamily:Fn.title}}>Token</span>
              {!mob&&<span style={{fontSize:10,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.cinzaChumbo,fontFamily:Fn.title}}>Descrição</span>}
            </div>
            {componentMap.map((cm,i)=>(
              <div key={i} style={{display:"grid",gridTemplateColumns:mob?"2fr 1fr":"2fr 1fr 3fr",padding:"12px 20px",borderBottom:i<componentMap.length-1?`1px solid ${C.cardBorder}`:"none",alignItems:"center",background:i%2===1?"#f8f9fb":"transparent"}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:28,height:28,borderRadius:8,background:alpha(cm.color,0.04),display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{Ic[cm.icon as keyof typeof Ic](14,cm.color)}</div>
                  <span style={{fontSize:13,fontWeight:600,color:C.cinzaEscuro,fontFamily:Fn.body}}>{cm.component}</span>
                </div>
                <code style={{fontSize:11,fontFamily:Fn.mono,color:C.cinzaEscuro,fontWeight:600}}>{shadows[cm.shadow as keyof typeof shadows].token}</code>
                {!mob&&<span style={{fontSize:12,color:C.cinzaChumbo,fontFamily:Fn.body}}>{cm.desc}</span>}
              </div>
            ))}
          </div>
        </Section>

        <Section n="04" title="Comparação ao vivo" desc="Cards com sombras reais aplicadas lado a lado no mesmo fundo.">
          <div style={{background:`repeating-conic-gradient(${C.bg} 0% 25%, ${C.cardBg} 0% 50%) 0 0 / 16px 16px`,borderRadius:"12px 12px 12px 24px",border:`1px solid ${C.cardBorder}`,padding:mob?16:32}}>
            <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr 1fr",gap:mob?16:24}}>
              {["card","elevated","modal"].map(key=>{const sh=shadows[key as keyof typeof shadows];return(
                <div key={key} style={{background:C.cardBg,borderRadius:"10px 10px 10px 18px",boxShadow:sh.value,padding:mob?16:20,border:key==="card"?`1px solid ${C.cardBorder}`:"1px solid transparent"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>{sh.label}</span>
                    <span style={{fontSize:18,fontWeight:800,fontFamily:Fn.title,color:alpha(C.azulProfundo,0.08)}}>{sh.level}</span>
                  </div>
                  <div style={{height:1,background:C.cardBorder,marginBottom:8}}/>
                  <code style={{fontSize:10,fontFamily:Fn.mono,color:C.textMuted,lineHeight:1.6,wordBreak:"break-all"}}>{sh.value}</code>
                </div>
              )})}
            </div>
          </div>
        </Section>

        <Section n="05" title="Regras de uso" desc="Diretrizes para manter consistência na elevação visual.">
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

        <Section n="06" title="Tokens de referência" desc="Valores CSS de cada nível de sombra.">
          <DSCard mob={mob}>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {shadowOrder.map(key=>{const sh=shadows[key as keyof typeof shadows];return(
                <div key={key} style={{display:"flex",alignItems:mob?"flex-start":"center",gap:mob?10:16,padding:"10px 0",borderBottom:`1px solid ${C.cardBorder}`,flexDirection:mob?"column":"row"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,minWidth:140}}>
                    <div style={{width:24,height:24,borderRadius:6,background:C.cardBg,boxShadow:sh.value,border:key==="none"?`1px solid ${C.cardBorder}`:"none",flexShrink:0}}/>
                    <span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>{sh.label}</span>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <code style={{fontSize:10,fontFamily:Fn.mono,color:C.cinzaEscuro,fontWeight:600,background:alpha(C.azulProfundo,0.03),padding:"2px 8px",borderRadius:4}}>{sh.token}</code>
                    <span style={{fontSize:10,fontFamily:Fn.mono,color:C.textMuted,background:C.bg,padding:"2px 6px",borderRadius:4}}>nível {sh.level}</span>
                  </div>
                  <code style={{fontSize:mob?10:11,fontFamily:Fn.mono,color:C.cinzaChumbo,flex:1,wordBreak:"break-all"}}>{sh.value||"none"}</code>
                </div>
              )})}
            </div>
          </DSCard>
        </Section>

        <Section n="07" title="Considerações Dark Mode" desc="Adaptações de sombra para o modo escuro do DS-FIPS.">
          <div style={{background:C.cardBg,borderRadius:"10px 10px 10px 18px",border:`1px solid ${C.cardBorder}`,padding:mob?16:24}}>
            <p style={{fontSize:13,color:C.cinzaChumbo,lineHeight:1.6,margin:"0 0 16px",fontFamily:Fn.body}}>
              No dark mode, sombras precisam de maior intensidade para serem visíveis sobre fundos escuros. Use rgba(0,0,0,0.3-0.5) em vez de rgba(0,75,155,0.08-0.18). Evite sombras azuis — use preto puro com maior opacidade.
            </p>
            <div style={{border:`1px solid ${C.cardBorder}`,borderRadius:8,overflow:"hidden",marginBottom:16}}>
              <div style={{display:"grid",gridTemplateColumns:mob?"1fr 1fr 1fr":"1fr 2fr 2fr",padding:"10px 16px",background:C.bg,borderBottom:`2px solid ${C.cardBorder}`}}>
                <span style={{fontSize:10,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.cinzaChumbo,fontFamily:Fn.title}}>Nível</span>
                <span style={{fontSize:10,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.cinzaChumbo,fontFamily:Fn.title}}>Light</span>
                <span style={{fontSize:10,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.cinzaChumbo,fontFamily:Fn.title}}>Dark</span>
              </div>
              {[
                {level:"Card",light:"rgba(0,75,155,.04) + rgba(0,75,155,.03)",dark:"rgba(0,0,0,.30) + rgba(0,0,0,.20)"},
                {level:"Elevated",light:"rgba(0,75,155,.08)",dark:"rgba(0,0,0,.35)"},
                {level:"Dropdown",light:"rgba(0,75,155,.12)",dark:"rgba(0,0,0,.40)"},
                {level:"Guia",light:"rgba(0,42,104,.10)",dark:"rgba(0,0,0,.35)"},
                {level:"Modal",light:"rgba(0,42,104,.20)",dark:"rgba(0,0,0,.50)"},
              ].map((r,i)=>(
                <div key={i} style={{display:"grid",gridTemplateColumns:mob?"1fr 1fr 1fr":"1fr 2fr 2fr",padding:"9px 16px",borderBottom:i<4?`1px solid ${C.cardBorder}`:"none",alignItems:"center"}}>
                  <span style={{fontSize:12,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>{r.level}</span>
                  <code style={{fontSize:mob?9:10,fontFamily:Fn.mono,color:C.cinzaChumbo}}>{r.light}</code>
                  <code style={{fontSize:mob?9:10,fontFamily:Fn.mono,color:C.cinzaEscuro,fontWeight:600}}>{r.dark}</code>
                </div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:10}}>
              {[
                {label:"Cor da sombra",value:"rgba(0,0,0,…) puro"},
                {label:"Opacidade range",value:"0.20–0.50"},
                {label:"Sombra azul",value:"Não usar no dark"},
                {label:"Offsets / blur",value:"Idênticos ao light"},
              ].map((t,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,fontSize:12,fontFamily:Fn.body}}>
                  <span style={{color:C.cinzaChumbo,minWidth:140}}>{t.label}</span>
                  <code style={{background:C.neutro,padding:"2px 8px",borderRadius:4,fontSize:11,fontFamily:Fn.mono,color:C.cinzaEscuro}}>{t.value}</code>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <div style={{textAlign:"center",padding:"20px 0 0",borderTop:`1px solid ${C.cardBorder}`,marginTop:20}}>
          <span style={{fontSize:12,color:C.cinzaChumbo,letterSpacing:".5px",fontFamily:Fn.title,fontWeight:400}}>DS-FIPS v0.4.2 · Ferrovia Interna do Porto de Santos · Excelência sobre trilhos · {new Date().getFullYear()}</span>
        </div>
      </div>
    </div>
  );
}
