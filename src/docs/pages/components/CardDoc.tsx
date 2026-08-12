import { useState, useEffect } from "react";
import {
  ClipboardList,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  Package,
  Truck,
  Warehouse,
  FilePlus2,
  FileSearch,
  FileCheck2,
  UserCheck,
  FileClock,
  Receipt,
  CircleCheckBig,
} from "lucide-react";
import { CodeExportSection } from '../../components/CodeExport';
import { StatsCard, StatsCardGrid } from '../../../components/composites/StatsCard';
import { HowItWorksCard, HowItWorksGrid } from '../../../components/composites/HowItWorksCard';

/* ═══════════════════════════════════════════ TOKENS ═══════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════ ICONS ═══════════════════════════════════════════ */
const Ic={
  check:(s=16,c=C.verdeFloresta)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke={c} strokeWidth="1.5"/><path d="M7 10l2 2 4-4" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  alert:(s=16,c=C.amareloEscuro)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M10 2L1.5 17h17L10 2z" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/><path d="M10 8v4M10 14v.5" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>,
  clock:(s=16,c=C.azulCeu)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke={c} strokeWidth="1.5"/><path d="M10 5.5V10l3 2" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>,
  fire:(s=16,c=C.danger)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M10 2C7.5 6 5 8 5 11.5a5 5 0 0010 0C12 8 12.5 6 10 2z" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  star:(s=16,c=C.amareloOuro)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M10 2l2.5 5.2 5.7.8-4.1 4 1 5.7L10 14.8 4.9 17.7l1-5.7-4.1-4 5.7-.8L10 2z" fill={c}/></svg>,
  arrowUp:(s=12,c=C.verdeFloresta)=><svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M8 12V4M5 6.5L8 3.5 11 6.5" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  arrowDown:(s=12,c=C.danger)=><svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M8 4V12M5 9.5L8 12.5 11 9.5" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  grid:(s=14,c=C.amareloOuro)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><rect x="2" y="2" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/><rect x="11" y="2" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/><rect x="2" y="11" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/><rect x="11" y="11" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/></svg>,
  chart:(s=16,c=C.azulProfundo)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><rect x="2" y="10" width="3" height="8" rx="1" fill={c} opacity=".3"/><rect x="7" y="6" width="3" height="12" rx="1" fill={c} opacity=".5"/><rect x="12" y="3" width="3" height="15" rx="1" fill={c} opacity=".7"/><rect x="17" y="8" width="3" height="10" rx="1" fill={c}/></svg>,
  doc:(s=16,c=C.cinzaChumbo)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M6 2h6l5 5v10a1 1 0 01-1 1H6a1 1 0 01-1-1V3a1 1 0 011-1z" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/><path d="M12 2v5h5M8 11h4M8 14h6" stroke={c} strokeWidth="1.3" strokeLinecap="round"/></svg>,
};

function JunctionLines({style}:{style?:React.CSSProperties}){return <svg viewBox="0 0 320 200" fill="none" style={{opacity:.12,...style}}><path d="M0 60H100C120 60 120 60 140 40L200 40H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/><path d="M0 60H100C120 60 120 60 140 80L200 80H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/><path d="M0 120H60C80 120 80 120 100 100L160 100H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/><path d="M0 120H60C80 120 80 120 100 140L160 140H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/></svg>}

/* ═══════════════════════════════════════════ BADGE (mini) ═══════════════════════════════════════════ */
const BV:{[k:string]:{bg:string,color:string,border:string}}={sucesso:{bg:"#ECFDF5",color:C.verdeEscuro,border:"#A7F3D0"},atencao:{bg:"#FFF7ED",color:"#C2410C",border:"#FDBA74"},critico:{bg:"#FEF2F2",color:"#B91C1C",border:"#FECACA"},info:{bg:C.azulCeuClaro,color:C.azulEscuro,border:C.azulCeu},ouro:{bg:"#FEF9E7",color:"#92400E",border:C.amareloOuro},default:{bg:C.azulProfundo,color:C.branco,border:"transparent"},secondary:{bg:C.bg,color:C.cinzaEscuro,border:C.cardBorder}};
function Badge2({variant="default",children,dot,icon,pill,size="md"}:{variant?:string,children?:React.ReactNode,dot?:boolean,icon?:React.ReactNode,pill?:boolean,size?:string}){const v=BV[variant]||BV.default;const fs=size==="sm"?10:11;return(<span style={{display:"inline-flex",alignItems:"center",gap:5,padding:`2px ${size==="sm"?6:8}px`,fontSize:fs,fontWeight:600,fontFamily:Fn.body,color:v.color,background:v.bg,border:`1px solid ${v.border}`,borderRadius:pill?999:4,whiteSpace:"nowrap"}}>{dot&&<span style={{width:6,height:6,borderRadius:"50%",background:v.color,opacity:.85}}/>}{icon&&<span style={{display:"flex"}}>{icon}</span>}{children}</span>)}

/* ═══════════════════════════════════════════════════════════════════════════════════════════════
   FAMÍLIA 1: DASHBOARD — KPIs, métricas, trends
   ═══════════════════════════════════════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════════════════════════════════════
   FAMÍLIA 2: RELATÓRIO/STATUS — Resumo, Ação, Lista, Status
   ═══════════════════════════════════════════════════════════════════════════════════════════════ */
function CardResumo({title,desc,children,badges,footer}:{title:string,desc?:string,children?:React.ReactNode,badges?:React.ReactNode,footer?:React.ReactNode}){
  return(
    <div style={{background:C.cardBg,borderRadius:"12px 12px 12px 24px",border:`1px solid ${C.cardBorder}`,boxShadow:"0 1px 3px rgba(0,75,155,.04)",overflow:"hidden"}}>
      <div style={{padding:"20px 24px"}}>
        <h3 style={{fontSize:16,fontWeight:700,color:C.cinzaEscuro,margin:"0 0 4px",fontFamily:Fn.title}}>{title}</h3>
        {desc&&<p style={{fontSize:13,color:C.cinzaChumbo,margin:"0 0 12px",lineHeight:1.5,fontFamily:Fn.body}}>{desc}</p>}
        {children}
        {badges&&<div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:12}}>{badges}</div>}
      </div>
      {footer&&<div style={{padding:"12px 24px",background:C.bg,borderTop:`1px solid ${C.cardBorder}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>{footer}</div>}
    </div>
  );
}

function CardAcao({title,desc,primary,secondary,urgency,children}:{title:string,desc?:string,primary?:string,secondary?:string,urgency?:string,children?:React.ReactNode}){
  return(
    <div style={{background:C.cardBg,borderRadius:"12px 12px 12px 24px",border:`1px solid ${C.cardBorder}`,boxShadow:"0 1px 3px rgba(0,75,155,.04)",overflow:"hidden"}}>
      <div style={{padding:"20px 24px"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
          <h3 style={{fontSize:16,fontWeight:700,color:C.cinzaEscuro,margin:0,fontFamily:Fn.title}}>{title}</h3>
          {urgency&&<Badge2 variant={urgency==="alta"?"critico":urgency==="media"?"atencao":"sucesso"} size="sm">{urgency}</Badge2>}
        </div>
        {desc&&<p style={{fontSize:13,color:C.cinzaChumbo,margin:"0 0 12px",lineHeight:1.5,fontFamily:Fn.body}}>{desc}</p>}
        {children}
      </div>
      {(primary||secondary)&&(
        <div style={{padding:"12px 24px",background:C.bg,borderTop:`1px solid ${C.cardBorder}`,display:"flex",gap:10,justifyContent:"flex-end"}}>
          {secondary&&<button style={{padding:"6px 16px",fontSize:12,background:"transparent",border:`1px solid ${C.cinzaClaro}`,borderRadius:6,color:C.cinzaChumbo,cursor:"pointer",fontFamily:Fn.body}}>{secondary}</button>}
          {primary&&<button style={{padding:"6px 16px",fontSize:12,background:C.azulProfundo,border:"none",borderRadius:6,color:C.branco,cursor:"pointer",fontFamily:Fn.body,fontWeight:600}}>{primary}</button>}
        </div>
      )}
    </div>
  );
}

function CardLista({title,items=[]}:{title?:string,items?:{icon?:React.ReactNode,label:string,badge?:React.ReactNode,value?:string}[]}){
  return(
    <div style={{background:C.cardBg,borderRadius:"12px 12px 12px 24px",border:`1px solid ${C.cardBorder}`,boxShadow:"0 1px 3px rgba(0,75,155,.04)",overflow:"hidden"}}>
      {title&&<div style={{padding:"14px 24px",borderBottom:`1px solid ${C.cardBorder}`}}><h3 style={{fontSize:14,fontWeight:700,color:C.cinzaEscuro,margin:0,fontFamily:Fn.title}}>{title}</h3></div>}
      {items.map((item,i)=>(
        <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 24px",borderBottom:i<items.length-1?`1px solid ${C.cardBorder}`:"none"}}>
          {item.icon&&<span style={{display:"flex",flexShrink:0}}>{item.icon}</span>}
          <span style={{flex:1,fontSize:13,color:C.cinzaEscuro,fontFamily:Fn.body}}>{item.label}</span>
          {item.badge&&item.badge}
          {item.value&&<span style={{fontSize:13,fontWeight:600,color:C.cinzaEscuro,fontFamily:Fn.mono}}>{item.value}</span>}
        </div>
      ))}
    </div>
  );
}

/* SparkArea para E2 */
function SparkArea({data,color,w=130,h=30}:{data:number[],color:string,w?:number,h?:number}){
  const max=Math.max(...data),min=Math.min(...data);
  const pts=data.map((v,i)=>`${(i/(data.length-1))*w},${h-((v-min)/(max-min||1))*(h-4)+2}`);
  const uid=color.replace('#','')+(w+h);
  return <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{display:"block",width:"100%"}}><defs><linearGradient id={`ga${uid}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity=".18"/><stop offset="100%" stopColor={color} stopOpacity="0"/></linearGradient></defs><polygon points={`0,${h} ${pts.join(" ")} ${w},${h}`} fill={`url(#ga${uid})`}/><polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

/* Donut ring para D */
function Donut({pct,color,size=52,stroke=5}:{pct:number,color:string,size?:number,stroke?:number}){
  const r=(size-stroke)/2;const circ=2*Math.PI*r;const offset=circ-(pct/100)*circ;
  return <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{transform:"rotate(-90deg)"}}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke={`${color}18`} strokeWidth={stroke}/><circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"/></svg>;
}

/* Card KPI E2 — ícone padrão DS canto direito + area chart */
function CardKPIE2({label,value,delta,up,icon,color,spark=[]}:{label:string,value:string,delta:string,up:boolean,icon:React.ReactNode,color:string,spark?:number[]}){
  const deltaColor=up&&color!==C.danger?C.verdeFloresta:C.danger;
  return(
    <div style={{background:C.cardBg,borderRadius:"10px 10px 10px 18px",border:`1px solid ${C.cardBorder}`,overflow:"hidden",boxShadow:"0 1px 3px rgba(0,75,155,.04)"}}>
      <div style={{padding:"18px 20px 10px",position:"relative"}}>
        <div style={{position:"absolute",top:16,right:16,width:40,height:40,borderRadius:12,background:`${color}0A`,display:"flex",alignItems:"center",justifyContent:"center"}}>{icon}</div>
        <span style={{fontSize:11,fontWeight:600,color:C.cinzaChumbo,display:"block",marginBottom:8}}>{label}</span>
        <div style={{display:"flex",alignItems:"baseline",gap:8}}>
          <span style={{fontSize:28,fontWeight:800,fontFamily:Fn.title,color:C.cinzaEscuro,lineHeight:1}}>{value}</span>
          <span style={{display:"inline-flex",alignItems:"center",gap:2,fontSize:10,fontWeight:600,fontFamily:Fn.mono,color:deltaColor}}>
            {up?Ic.arrowUp(10,deltaColor):Ic.arrowDown(10,deltaColor)}{delta}
          </span>
        </div>
      </div>
      <SparkArea data={spark} color={color} w={300} h={34}/>
    </div>
  );
}

/* Card Status D — split metric + donut ring */
function CardStatusD({label,value,delta,up,color,pct}:{label:string,value:string,delta:string,up:boolean,color:string,pct:number}){
  const deltaColor=up&&color!==C.danger?C.verdeFloresta:C.danger;
  return(
    <div style={{background:C.cardBg,borderRadius:"10px 10px 10px 18px",border:`1px solid ${C.cardBorder}`,padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",boxShadow:"0 1px 3px rgba(0,75,155,.04)"}}>
      <div>
        <span style={{fontSize:10,fontWeight:600,color:C.cinzaChumbo,display:"block",marginBottom:3,textTransform:"uppercase",letterSpacing:".5px"}}>{label}</span>
        <span style={{fontSize:24,fontWeight:800,fontFamily:Fn.title,color:C.cinzaEscuro,display:"block",lineHeight:1}}>{value}</span>
        <span style={{display:"inline-flex",alignItems:"center",gap:2,fontSize:10,fontWeight:600,fontFamily:Fn.mono,color:deltaColor,marginTop:3}}>
          {up?Ic.arrowUp(10,deltaColor):Ic.arrowDown(10,deltaColor)}{delta}
        </span>
      </div>
      <div style={{position:"relative",flexShrink:0}}>
        <Donut pct={pct} color={color} size={48} stroke={4}/>
        <span style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,fontFamily:Fn.mono,color}}>{pct}%</span>
      </div>
    </div>
  );
}

/* Card Relatório — mesma estrutura do StatusD, levemente mais compacto */
function CardRelatorio({label,value,subtitle,icon,color}:{label:string,value:string,subtitle?:string,icon:React.ReactNode,color:string}){
  return(
    <div style={{background:C.cardBg,borderRadius:"10px 10px 10px 18px",border:`1px solid ${C.cardBorder}`,padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",boxShadow:"0 1px 3px rgba(0,75,155,.04)",borderLeft:`4px solid ${color}`}}>
      <div>
        <span style={{fontSize:10,fontWeight:600,color:C.cinzaChumbo,display:"block",marginBottom:3,textTransform:"uppercase",letterSpacing:".5px"}}>{label}</span>
        <span style={{fontSize:24,fontWeight:800,fontFamily:Fn.title,color:color||C.azulEscuro,display:"block",lineHeight:1}}>{value}</span>
        {subtitle&&<span style={{fontSize:10,color:C.cinzaChumbo,display:"block",marginTop:3,fontFamily:Fn.body}}>{subtitle}</span>}
      </div>
      <div style={{width:40,height:40,borderRadius:"50%",background:`${color}0A`,border:`1px solid ${color}15`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{icon}</div>
    </div>
  );
}

/* Card Princípio — stripe topo + ícone circular centralizado + título + descrição */
function CardPrincipio({title,desc,icon,color}:{title:string,desc:string,icon:React.ReactNode,color:string}){
  return(
    <div style={{background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:"10px 10px 10px 18px",overflow:"hidden",boxShadow:"0 1px 3px rgba(0,75,155,.04)"}}>
      <div style={{height:3,background:`linear-gradient(90deg,${color},${color}60)`}}/>
      <div style={{padding:"18px 16px 16px",textAlign:"center"}}>
        <div style={{width:44,height:44,borderRadius:"50%",background:C.bg,border:`1.5px solid ${C.cardBorder}`,display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:10}}>{icon}</div>
        <h3 style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,margin:"0 0 6px",fontFamily:Fn.title}}>{title}</h3>
        <p style={{fontSize:11,color:C.cinzaChumbo,lineHeight:1.5,margin:0,fontFamily:Fn.body}}>{desc}</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════ LAYOUT ═══════════════════════════════════════════ */
function Section({n,title,desc,children}:{n:string,title:string,desc:string,children:React.ReactNode}){return(<section style={{marginBottom:44}}><div style={{fontSize:10,fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",color:C.azulClaro,fontFamily:Fn.title,marginBottom:6}}>{n}</div><h2 style={{fontSize:20,fontWeight:700,color:C.cinzaEscuro,margin:"0 0 4px",fontFamily:Fn.title,letterSpacing:".5px"}}>{title}</h2><p style={{fontSize:14,color:C.cinzaChumbo,margin:"0 0 20px",lineHeight:1.55,fontFamily:Fn.body}}>{desc}</p>{children}</section>)}
function DSCard({children,s,mob:m}:{children:React.ReactNode,s?:React.CSSProperties,mob?:boolean}){return(<div style={{background:C.cardBg,borderRadius:"12px 12px 12px 24px",border:`1px solid ${C.cardBorder}`,padding:m?16:28,boxShadow:"0 1px 3px rgba(0,75,155,.04),0 4px 14px rgba(0,75,155,.03)",...s}}>{children}</div>)}
function FamilyLabel({icon,label,color}:{icon:React.ReactNode,label:string,color:string}){return(<div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16,padding:"10px 16px",background:`${color}10`,borderRadius:8,border:`1px solid ${color}25`}}><span style={{display:"flex"}}>{icon}</span><span style={{fontSize:13,fontWeight:700,color,fontFamily:Fn.title,letterSpacing:".5px"}}>{label}</span></div>)}

const gc:React.CSSProperties={background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:"10px 10px 10px 18px",overflow:"hidden"};
const gh:React.CSSProperties={padding:"16px 20px",background:C.bg,borderBottom:`1px solid ${C.cardBorder}`,display:"flex",alignItems:"center",gap:12};
const gb:React.CSSProperties={padding:"16px 20px 20px"};
const gl:React.CSSProperties={fontSize:10,fontWeight:700,letterSpacing:"1.2px",textTransform:"uppercase",color:C.azulClaro,fontFamily:Fn.title,marginBottom:4,marginTop:12};
const gt:React.CSSProperties={fontSize:13,color:C.cinzaEscuro,lineHeight:1.55,margin:0,fontFamily:Fn.body};
const ge:React.CSSProperties={fontSize:12,color:C.cinzaChumbo,lineHeight:1.5,margin:0,fontFamily:Fn.body,fontStyle:"italic",paddingLeft:10,borderLeft:`2px solid ${C.azulCeuClaro}`};
const gk:React.CSSProperties={fontSize:11,fontFamily:Fn.mono,color:C.cinzaChumbo,background:C.cardBg,padding:"2px 8px",borderRadius:4,border:`1px solid ${C.cardBorder}`};
function TokenRow({label,value,color}:{label:string,value:string,color?:string}){return(<div style={{display:"flex",alignItems:"center",gap:10,fontSize:12,fontFamily:Fn.body}}>{color&&<div style={{width:16,height:16,borderRadius:4,background:color,border:`1px solid ${C.cardBorder}`,flexShrink:0}}/>}<span style={{color:C.cinzaChumbo,minWidth:130}}>{label}</span><code style={{background:C.neutro,padding:"2px 8px",borderRadius:4,fontSize:11,fontFamily:Fn.mono,color:C.cinzaEscuro}}>{value}</code></div>)}

const cardExportCode = `// DS-FIPS — Card — Copy-paste ready
import { useState, useEffect } from "react";

const C = {
  azulProfundo: "#004B9B",
  azulEscuro: "#002A68",
  azulClaro: "#0090D0",
  fg: "#333B41",
  fgMuted: "#7B8C96",
  surface: "#FFFFFF",
  surfaceMuted: "#F8FAFC",
  border: "#E2E8F0",
  branco: "#FFFFFF",
};

const Fn = {
  title: "'Saira Expanded', sans-serif",
  body: "'Open Sans', sans-serif",
  mono: "'Fira Code', monospace",
};

interface CardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function Card({ children, style }: CardProps) {
  return (
    <div style={{
      background: C.surface,
      borderRadius: "12px 12px 12px 24px",
      border: \`1px solid \${C.border}\`,
      padding: 28,
      boxShadow: "0 1px 3px rgba(0,75,155,.04), 0 4px 14px rgba(0,75,155,.03)",
      ...style,
    }}>
      {children}
    </div>
  );
}

interface CardResumoProps {
  title: string;
  desc?: string;
  children?: React.ReactNode;
  badges?: React.ReactNode;
  footer?: React.ReactNode;
}

export function CardResumo({ title, desc, children, badges, footer }: CardResumoProps) {
  return (
    <div style={{
      background: C.surface,
      borderRadius: "12px 12px 12px 24px",
      border: \`1px solid \${C.border}\`,
      boxShadow: "0 1px 3px rgba(0,75,155,.04)",
      overflow: "hidden",
    }}>
      <div style={{ padding: "20px 24px" }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: C.fg, margin: "0 0 4px", fontFamily: Fn.title }}>{title}</h3>
        {desc && <p style={{ fontSize: 13, color: C.fgMuted, margin: "0 0 12px", lineHeight: 1.5, fontFamily: Fn.body }}>{desc}</p>}
        {children}
        {badges && <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12 }}>{badges}</div>}
      </div>
      {footer && (
        <div style={{
          padding: "12px 24px",
          background: C.surfaceMuted,
          borderTop: \`1px solid \${C.border}\`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>{footer}</div>
      )}
    </div>
  );
}

interface CardAcaoProps {
  title: string;
  desc?: string;
  primary?: string;
  secondary?: string;
  children?: React.ReactNode;
}

export function CardAcao({ title, desc, primary, secondary, children }: CardAcaoProps) {
  return (
    <div style={{
      background: C.surface,
      borderRadius: "12px 12px 12px 24px",
      border: \`1px solid \${C.border}\`,
      boxShadow: "0 1px 3px rgba(0,75,155,.04)",
      overflow: "hidden",
    }}>
      <div style={{ padding: "20px 24px" }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: C.fg, margin: "0 0 8px", fontFamily: Fn.title }}>{title}</h3>
        {desc && <p style={{ fontSize: 13, color: C.fgMuted, margin: "0 0 12px", lineHeight: 1.5, fontFamily: Fn.body }}>{desc}</p>}
        {children}
      </div>
      {(primary || secondary) && (
        <div style={{
          padding: "12px 24px",
          background: C.surfaceMuted,
          borderTop: \`1px solid \${C.border}\`,
          display: "flex", gap: 10, justifyContent: "flex-end",
        }}>
          {secondary && <button style={{ padding: "6px 16px", fontSize: 12, background: "transparent", border: \`1px solid \${C.border}\`, borderRadius: 6, color: C.fgMuted, cursor: "pointer", fontFamily: Fn.body }}>{secondary}</button>}
          {primary && <button style={{ padding: "6px 16px", fontSize: 12, background: C.azulProfundo, border: "none", borderRadius: 6, color: C.branco, cursor: "pointer", fontFamily: Fn.body, fontWeight: 600 }}>{primary}</button>}
        </div>
      )}
    </div>
  );
}

// Usage:
// <Card><p>Conteudo do card</p></Card>
// <CardResumo title="Resumo" desc="Descricao" footer={<span>Ver detalhes</span>} />
// <CardAcao title="Proxima acao" desc="Descricao" primary="Confirmar" secondary="Cancelar" />
`;

/* ═══════════════════════════════════════════ MAIN ═══════════════════════════════════════════ */
export default function CardDoc(){
  const [w,setW]=useState(typeof window!=="undefined"?window.innerWidth:1200);
  useEffect(()=>{const h=()=>setW(window.innerWidth);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h)},[]);
  const mob=w<640;

  return(
    <div style={{minHeight:"100vh",background:"var(--color-surface-muted)",fontFamily:Fn.body,color:C.cinzaEscuro}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Saira+Expanded:wght@300;400;500;600;700;800&family=Open+Sans:wght@300;400;600;700&family=Fira+Code:wght@400;500&display=swap');`}</style>

      {/* HEADER */}
      <header style={{background:`linear-gradient(135deg,${C.azulProfundo} 0%,${C.azulEscuro} 100%)`,padding:mob?"32px 20px":"48px 40px 44px",position:"relative",overflow:"hidden"}}>
        <JunctionLines style={{position:"absolute",top:-10,right:-20,width:mob?250:400,height:250}}/>
        <div style={{position:"relative"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:6,background:`${C.branco}10`,border:`1px solid ${C.branco}18`,borderRadius:20,padding:"5px 14px",fontSize:11,fontWeight:600,letterSpacing:"1.5px",textTransform:"uppercase",color:C.amareloOuro,fontFamily:Fn.title,marginBottom:16}}>{Ic.grid(14,C.amareloOuro)} Design System FIPS</div>
          <h1 style={{fontSize:mob?30:44,fontWeight:700,color:C.branco,margin:"0 0 10px",fontFamily:Fn.title}}>Card</h1>
          <p style={{fontSize:16,color:`${C.branco}B0`,lineHeight:1.6,maxWidth:700,margin:0,fontFamily:Fn.body}}>Container base para agrupar informações, métricas e ações. Duas famílias: Dashboard (métricas com trends) e Relatório/Status (informação descritiva e ações).</p>
        </div>
      </header>

      <div style={{padding:mob?"24px 16px 40px":"36px 40px 60px",maxWidth:1100,margin:"0 auto"}}>

        {/* ════════════════════════════════════════════════════
           FAMÍLIA 1: DASHBOARD
           ════════════════════════════════════════════════════ */}
        <FamilyLabel icon={Ic.chart(18,C.azulProfundo)} label="FAMÍLIA 1 — DASHBOARD" color={C.azulProfundo} />

        {/* 01 — KPI E2 com area chart */}
        <Section n="01" title="Card KPI com area chart" desc="Ícone padrão DS no canto superior direito + gráfico de tendência no rodapé. Para dashboards operacionais com visão de tendência.">
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr 1fr":"repeat(4, 1fr)",gap:12}}>
            <CardKPIE2 label="Solicitações" value="247" delta="+12%" up={true} icon={Ic.doc(20,C.azulProfundo)} color={C.azulProfundo} spark={[10,14,12,18,16,22,20,25,24,28]}/>
            <CardKPIE2 label="Finalizadas" value="189" delta="+8%" up={true} icon={Ic.check(18,C.verdeFloresta)} color={C.verdeFloresta} spark={[6,8,10,9,14,16,15,18,20,19]}/>
            <CardKPIE2 label="Aguardando" value="38" delta="-4%" up={false} icon={Ic.clock(18,C.amareloEscuro)} color={C.amareloEscuro} spark={[18,16,17,14,15,12,13,10,11,9]}/>
            <CardKPIE2 label="Atrasadas" value="5" delta="+2" up={true} icon={Ic.alert(20,C.danger)} color={C.danger} spark={[1,2,1,3,2,4,3,5,4,5]}/>
          </div>
        </Section>

        {/* 04 — Status D com donut */}
        <Section n="02" title="Card Status com donut" desc="Métrica à esquerda + donut ring com percentual à direita. Para painéis de distribuição por situação atual.">
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr 1fr":"repeat(4, 1fr)",gap:12}}>
            <CardStatusD label="Solicitadas" value="247" delta="+12%" up={true} color={C.azulProfundo} pct={100}/>
            <CardStatusD label="Concluídas" value="189" delta="+8%" up={true} color={C.verdeFloresta} pct={76}/>
            <CardStatusD label="Em andamento" value="38" delta="-4%" up={false} color={C.amareloEscuro} pct={15}/>
            <CardStatusD label="Pendentes" value="20" delta="+3" up={true} color={C.danger} pct={8}/>
          </div>
        </Section>

        {/* 03 — Card Relatório */}
        <Section n="03" title="Card Relatório" desc="Card limpo com label, número grande, subtítulo e ícone padrão DS no canto. Para relatórios, cadastros e visões consolidadas sem tendência.">
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr 1fr":"repeat(4, 1fr)",gap:12}}>
            <CardRelatorio label="Total de Empresas" value="335" subtitle="Cadastradas no sistema" icon={Ic.chart(18,C.azulProfundo)} color={C.azulProfundo}/>
            <CardRelatorio label="Ativas" value="304" subtitle="91% do total" icon={Ic.check(18,C.verdeFloresta)} color={C.verdeFloresta}/>
            <CardRelatorio label="Novas" value="31" subtitle="Adicionadas recentemente" icon={Ic.clock(18,C.amareloEscuro)} color={C.amareloEscuro}/>
            <CardRelatorio label="Inativas" value="38" subtitle="Sem movimentação" icon={Ic.doc(18,C.azulEscuro)} color={C.azulEscuro}/>
          </div>
        </Section>

        {/* 03b — Card Stats compact (Home Suprimentos / Tecnopano) */}
        <Section
          n="03b"
          title="Card Stats compact (Home)"
          desc="Componente canônico exportável StatsCard + StatsCardGrid. Anatomia Tecnopano: texto à esquerda → ícone circular à direita, borda esquerda accent, valor na cor. Densidade compacta para fileira de KPIs (ex.: Home Suprimentos). Sem clique — envolva se precisar de ação."
        >
          <div style={{marginBottom:12}}>
            <code style={gk}>import {'{'} StatsCard, StatsCardGrid {'}'} from '@fips-app/ds-fips'</code>
          </div>
          <StatsCardGrid columnsXl={7}>
            <StatsCard label="Solicitações" value="247" subtitle="No período" icon={ClipboardList} color={C.azulProfundo} />
            <StatsCard label="Finalizadas" value="189" subtitle="76% do total" icon={CheckCircle2} color={C.verdeFloresta} />
            <StatsCard label="Aguardando" value="38" subtitle="Em fila" icon={Clock3} color={C.amareloEscuro} />
            <StatsCard label="Atrasadas" value="5" subtitle="Crítico" icon={AlertTriangle} color={C.danger} />
            <StatsCard label="Itens" value="1.284" subtitle="Em estoque" icon={Package} color={C.azulEscuro} />
            <StatsCard label="Entregas" value="62" subtitle="Hoje" icon={Truck} color="#0EA5E9" />
            <StatsCard label="Almoxarifados" value="4" subtitle="Ativos" icon={Warehouse} color="#7C3AED" />
          </StatsCardGrid>
          <div style={{marginTop:16,display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:12}}>
            <div>
              <div style={{...gl,marginTop:0}}>size="compact" (padrão)</div>
              <StatsCard label="Compact" value="42" subtitle="Home / fileira" icon={ClipboardList} color={C.azulProfundo} size="compact" />
            </div>
            <div>
              <div style={{...gl,marginTop:0}}>size="default"</div>
              <StatsCard label="Default" value="42" subtitle="Mais respiro" icon={ClipboardList} color={C.azulProfundo} size="default" />
            </div>
          </div>
        </Section>

        {/* 03c — Como Funciona (Home Suprimentos) */}
        <Section
          n="03c"
          title="Card Como Funciona (etapas)"
          desc="Réplica da seção Como Funciona da Home Suprimentos: badge numerada, ícone em caixa arredondada, título e descrição densos. Grade 1 → 2 → 3 → 7 colunas no lg+."
        >
          <div style={{marginBottom:12}}>
            <code style={gk}>import {'{'} HowItWorksCard, HowItWorksGrid {'}'} from '@fips-app/ds-fips'</code>
          </div>
          <HowItWorksGrid>
            <HowItWorksCard step={1} title="Pré-cadastro" description="A demanda acabou de ser criada; o formulário ainda nem foi aberto." icon={FilePlus2} />
            <HowItWorksCard step={2} title="Preenchimento" description="O solicitante responde o formulário. Pode salvar e voltar quando quiser." icon={FileSearch} />
            <HowItWorksCard step={3} title="Pronto para envio" description="Campos obrigatórios completos. O sistema libera o envio sem pendências." icon={FileCheck2} />
            <HowItWorksCard step={4} title="Superior imediato" description="O gestor aprova e encaminha, ou reprova com justificativa." icon={UserCheck} />
            <HowItWorksCard step={5} title="Aprovação da área" description="Gerente e/ou diretor avaliam e aprovam ou devolvem." icon={FileClock} />
            <HowItWorksCard step={6} title="RC e Suprimentos" description="Anexa a RC e entra na fila de Suprimentos para análise final." icon={Receipt} />
            <HowItWorksCard step={7} title="Concluída" description="Suprimentos aprovou. PDF consolidado fica no histórico." icon={CircleCheckBig} />
          </HowItWorksGrid>
        </Section>

        {/* 04 — Card Princípio */}
        <Section n="04" title="Card Princípio" desc="Stripe colorida no topo, ícone circular centralizado, título e descrição. Para pilares, valores, regras e destaques institucionais.">
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr 1fr":"repeat(4, 1fr)",gap:12}}>
            <CardPrincipio title="Segurança primeiro" desc="Nenhuma operação começa sem inspeção SSMA aprovada. Zero tolerância a riscos não mapeados." icon={Ic.alert(20,C.azulProfundo)} color={C.azulProfundo}/>
            <CardPrincipio title="Rastreabilidade" desc="Todo movimento de carga, vagão e equipamento é registrado. Nada opera sem código de rastreio." icon={Ic.doc(20,C.verdeFloresta)} color={C.verdeFloresta}/>
            <CardPrincipio title="Agilidade" desc="Processos digitais reduzem tempo de resposta. Requisições, aprovações e inspeções em minutos." icon={Ic.clock(20,C.amareloEscuro)} color={C.amareloEscuro}/>
            <CardPrincipio title="Padronização" desc="Todos os sistemas usam o mesmo Design System. Uma linguagem visual para toda a empresa." icon={Ic.grid(20,C.azulEscuro)} color={C.azulEscuro}/>
          </div>
        </Section>

        {/* ════════════════════════════════════════════════════
           FAMÍLIA 2: RELATÓRIO / STATUS
           ════════════════════════════════════════════════════ */}
        <FamilyLabel icon={Ic.doc(18,C.verdeEscuro)} label="FAMÍLIA 2 — RELATÓRIO / STATUS" color={C.verdeEscuro} />

        {/* 04 — Resumo + Ação */}
        <Section n="05" title="Card de Resumo e Ação" desc="Cards para contexto descritivo, badges de status e botões CTA. Para relatórios, triagens e decisões.">
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:16}}>
            <CardResumo title="Resumo operacional" desc="Indicadores consolidados do mês com performance geral e pontos de atenção identificados pela equipe."
              badges={<><Badge2 variant="sucesso" dot>Fluxo ativo</Badge2><Badge2 variant="secondary">Revisão visual</Badge2></>}
              footer={<><span style={{fontSize:11,color:C.textMuted}}>Atualizado há 2h</span><span style={{fontSize:12,fontWeight:600,color:C.cinzaEscuro,cursor:"pointer"}}>Ver detalhes →</span></>}
            />
            <CardAcao title="Próxima ação recomendada" desc="Revisar componentes antes de fechar padrões de dashboard e regras de negócio." urgency="alta" primary="Iniciar revisão" secondary="Adiar" />
            <CardAcao title="Atualizar cadastro" desc="3 fornecedores com dados desatualizados. Verificar CNPJ e contatos." urgency="media" primary="Ver fornecedores" secondary="Ignorar">
              <div style={{background:C.bg,borderRadius:6,padding:10,display:"flex",gap:8,flexWrap:"wrap"}}>
                {["MRS Logística","VLI Multimodal","Brado"].map(n=><Badge2 key={n} variant="atencao" size="sm">{n}</Badge2>)}
              </div>
            </CardAcao>
            <CardResumo title="Checklist de revisão" desc="Itens pendentes para validação do Design System.">
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {[{done:true,t:"Validar tokens de cor"},{done:true,t:"Revisar tipografia"},{done:false,t:"Fechar componentes de formulário"},{done:false,t:"Documentar padrões de layout"}].map(item=>(
                  <div key={item.t} style={{display:"flex",alignItems:"center",gap:8,fontSize:12,fontFamily:Fn.body}}>
                    <div style={{width:16,height:16,borderRadius:4,background:item.done?C.verdeEscuro:C.cardBorder,display:"flex",alignItems:"center",justifyContent:"center"}}>
                      {item.done&&<svg width="10" height="10" viewBox="0 0 16 16" fill="none"><path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke={C.branco} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </div>
                    <span style={{color:item.done?C.cinzaChumbo:C.cinzaEscuro,textDecoration:item.done?"line-through":"none"}}>{item.t}</span>
                  </div>
                ))}
              </div>
            </CardResumo>
          </div>
        </Section>

        {/* 04 — Card Lista */}
        <Section n="06" title="Card de Lista" desc="Itens estruturados com ícone, badge e valor. Para menus, ocorrências e indicadores descritivos.">
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:16}}>
            <CardLista title="Últimas ocorrências" items={[
              {icon:Ic.fire(14,C.danger),label:"Vazamento pátio 47-B",badge:<Badge2 variant="critico" size="sm" dot>Crítica</Badge2>},
              {icon:Ic.alert(14,C.amareloEscuro),label:"Atraso manutenção locomotiva",badge:<Badge2 variant="atencao" size="sm" dot>Pendente</Badge2>},
              {icon:Ic.check(14,C.verdeFloresta),label:"Treinamento SSMA concluído",badge:<Badge2 variant="sucesso" size="sm" dot>Resolvida</Badge2>},
              {icon:Ic.clock(14,C.azulCeu),label:"Inspeção trilho 12",badge:<Badge2 variant="info" size="sm" dot>Em análise</Badge2>},
            ]}/>
            <CardLista title="Indicadores do mês" items={[
              {label:"Requisições abertas",value:"47"},
              {label:"Concluídas",value:"32",badge:<Badge2 variant="sucesso" size="sm">68%</Badge2>},
              {label:"Em andamento",value:"12",badge:<Badge2 variant="atencao" size="sm">26%</Badge2>},
              {label:"Pendentes",value:"3",badge:<Badge2 variant="critico" size="sm">6%</Badge2>},
            ]}/>
          </div>
        </Section>

        {/* 05 — GUIA POR TIPO */}
        <Section n="07" title="Guia de uso por tipo" desc="Quando usar cada tipo de card nas duas famílias.">
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:16}}>
            {[
              {name:"KPI com area chart",fam:"Dashboard",c:C.azulProfundo,desc:"Ícone padrão DS no canto, número grande, delta e gráfico de tendência no rodapé. O dado numérico com evolução visual.",when:"Dashboards operacionais, cabeçalhos de módulo, painéis com métricas de volume.",not:"Textos longos (usar Resumo). Mais de 6 KPIs na mesma linha (perde impacto).",ex:"Dashboard Suprimentos (247 solicitações); Dashboard SSMA; App Ocorrências."},
              {name:"Status com donut",fam:"Dashboard",c:C.azulCeu,desc:"Split com métrica à esquerda + donut ring com percentual à direita. Para distribuição por situação.",when:"Painel de status, distribuição percentual, header de tela com totalizadores.",not:"Dados com tendência — usar KPI com area chart. Textos descritivos — usar Resumo.",ex:"Status das solicitações; distribuição por prioridade; painel SSMA."},
              {name:"Relatório",fam:"Dashboard",c:C.amareloEscuro,desc:"Borda esquerda colorida + número na cor + ícone circular. Card limpo para dados consolidados sem tendência.",when:"Relatórios, cadastros, visões consolidadas, métricas estáticas.",not:"Dados com evolução temporal — usar KPI com area chart. Ações — usar Card Ação.",ex:"Dashboard Cadastros (335 empresas); relatórios mensais; visão de módulo."},
              {name:"Resumo",fam:"Relatório",c:C.verdeFloresta,desc:"Texto descritivo com badges e footer. Para contexto, notas e composições informativas.",when:"Introdução de tela, notas do gestor, resumo com badges e link 'Ver detalhes'.",not:"Apenas números — usar KPI. Apenas ação — usar Card Ação.",ex:"'Resumo operacional' no dashboard; notas de contexto; card de ideia no App Ideias."},
              {name:"Ação",fam:"Relatório",c:C.amareloEscuro,desc:"Card com CTA, badge de urgência e botões. Para decisões, aprovações e próximos passos.",when:"Fluxos de aprovação, tarefas pendentes, recomendações do sistema com urgência.",not:"Informação passiva — usar Resumo. Múltiplas ações — usar tabela.",ex:"'Aprovar requisição' no Suprimentos; 'Revisar cadastro' no App Cadastros."},
              {name:"Lista",fam:"Relatório",c:C.cinzaChumbo,desc:"Itens com ícone, badge e valor em linhas. Para menus, ocorrências e indicadores descritivos.",when:"Menu lateral com contadores, últimas ocorrências, indicadores por status.",not:"Dados tabulares complexos — usar Table. Métricas com trend — usar KPI.",ex:"'Últimas ocorrências' no dashboard; indicadores por status; atalhos."},
              {name:"Checklist",fam:"Relatório",c:C.verdeEscuro,desc:"Card Resumo com items de checklist (✓/pendente). Para listas de tarefas e validações.",when:"Inspeções SSMA, checklists de onboarding, validação de documentos.",not:"Tarefas com múltiplos campos — usar formulário. Fluxos multi-step — usar Progress Steps.",ex:"Checklist SSMA diário; validação do cadastro visitante; revisão do DS."},
            ].map(t=>(
              <div key={t.name} style={{...gc,borderLeft:`4px solid ${t.c}`}}>
                <div style={gh}>
                  <span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>{t.name}</span>
                  <code style={gk}>{t.fam}</code>
                </div>
                <div style={gb}>
                  <p style={gt}>{t.desc}</p>
                  <div style={gl}>Quando usar</div><p style={gt}>{t.when}</p>
                  <div style={{...gl,color:C.danger}}>Quando NÃO usar</div><p style={{...gt,color:C.cinzaChumbo}}>{t.not}</p>
                  <div style={gl}>Exemplo FIPS</div><p style={ge}>{t.ex}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* 06 — CENÁRIOS */}
        <Section n="08" title="Cenários de negócio" desc="Composições reais das duas famílias em contextos operacionais FIPS.">
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:16}}>
            {/* App Ideias */}
            <div style={{background:C.bg,border:`1px solid ${C.cardBorder}`,borderRadius:"10px 10px 10px 20px",padding:mob?16:24}}>
              <h3 style={{fontSize:14,fontWeight:700,color:C.cinzaEscuro,margin:"0 0 4px",fontFamily:Fn.title}}>Card de ideia</h3>
              <p style={{fontSize:12,color:C.cinzaChumbo,margin:"0 0 16px"}}>App Ideias — card com Fipcoins</p>
              <CardResumo title="Automação do pátio" desc="Sensores IoT para monitoramento automático de vagões no pátio ferroviário."
                badges={<><Badge2 variant="info" size="sm" pill>Inovação</Badge2><Badge2 variant="secondary" size="sm" pill>IoT</Badge2><Badge2 variant="ouro" size="sm" icon={Ic.star(9,C.amareloOuro)}>+50</Badge2></>}
                footer={<><span style={{fontSize:11,color:C.textMuted}}>Diogo Paiva · 3 dias</span><span style={{fontSize:12,fontWeight:600,color:C.cinzaEscuro,cursor:"pointer"}}>Votar ↑</span></>}
              />
            </div>

            {/* Dashboard Cadastros */}
            <div style={{background:C.bg,border:`1px solid ${C.cardBorder}`,borderRadius:"10px 10px 10px 20px",padding:mob?16:24}}>
              <h3 style={{fontSize:14,fontWeight:700,color:C.cinzaEscuro,margin:"0 0 4px",fontFamily:Fn.title}}>Dashboard Cadastros</h3>
              <p style={{fontSize:12,color:C.cinzaChumbo,margin:"0 0 16px"}}>Card Relatório com dados reais</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <CardRelatorio label="Total de Empresas" value="335" subtitle="Cadastradas" icon={Ic.chart(18,C.azulProfundo)} color={C.azulProfundo}/>
                <CardRelatorio label="Ativas" value="304" subtitle="91% do total" icon={Ic.check(18,C.verdeFloresta)} color={C.verdeFloresta}/>
              </div>
            </div>

            {/* Requisição */}
            <div style={{background:C.bg,border:`1px solid ${C.cardBorder}`,borderRadius:"10px 10px 10px 20px",padding:mob?16:24}}>
              <h3 style={{fontSize:14,fontWeight:700,color:C.cinzaEscuro,margin:"0 0 4px",fontFamily:Fn.title}}>Aprovação de requisição</h3>
              <p style={{fontSize:12,color:C.cinzaChumbo,margin:"0 0 16px"}}>App Suprimentos</p>
              <CardAcao title="REQ-4022 · Equipamento SSMA" desc="3 extintores + 10 cones para o pátio." urgency="media" primary="Aprovar" secondary="Rejeitar">
                <div style={{display:"flex",gap:10,fontSize:12,color:C.cinzaChumbo,marginBottom:8}}>
                  <span>Solicitante: <strong>Carlos Santos</strong></span>
                  <span>Valor: <strong style={{color:C.cinzaEscuro}}>R$ 2.450</strong></span>
                </div>
              </CardAcao>
            </div>

            {/* Checklist SSMA */}
            <div style={{background:C.bg,border:`1px solid ${C.cardBorder}`,borderRadius:"10px 10px 10px 20px",padding:mob?16:24}}>
              <h3 style={{fontSize:14,fontWeight:700,color:C.cinzaEscuro,margin:"0 0 4px",fontFamily:Fn.title}}>Inspeção SSMA</h3>
              <p style={{fontSize:12,color:C.cinzaChumbo,margin:"0 0 16px"}}>Checklist diário</p>
              <CardLista title="Inspeção 02/04/2026" items={[
                {icon:Ic.check(14,C.verdeFloresta),label:"EPI da equipe",badge:<Badge2 variant="sucesso" size="sm">OK</Badge2>},
                {icon:Ic.check(14,C.verdeFloresta),label:"Sinalização",badge:<Badge2 variant="sucesso" size="sm">OK</Badge2>},
                {icon:Ic.alert(14,C.amareloEscuro),label:"Extintor B",badge:<Badge2 variant="atencao" size="sm">Vencendo</Badge2>},
                {icon:Ic.fire(14,C.danger),label:"Junção 47-B",badge:<Badge2 variant="critico" size="sm">Aberta</Badge2>},
              ]}/>
            </div>
          </div>
        </Section>

        {/* 07 — TOKENS */}
        <Section n="09" title="Tokens de referência" desc="Valores de design utilizados nos cards.">
          <DSCard mob={mob} s={{display:"flex",gap:mob?24:48,flexWrap:"wrap"}}>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:Fn.title,marginBottom:4}}>Estrutura</span>
              <TokenRow label="Border radius" value="12px 12px 12px 24px"/>
              <TokenRow label="Border" value="1px solid #E2E8F0" color={C.cardBorder}/>
              <TokenRow label="Background" value="#FFFFFF" color={C.cardBg}/>
              <TokenRow label="Header/Footer" value="#F2F4F8" color={C.bg}/>
              <TokenRow label="Sombra" value="0 1px 3px rgba(...)"/>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:Fn.title,marginBottom:4}}>Borda lateral / topo</span>
              <TokenRow label="Success" value="#00C64C" color={C.verdeFloresta}/>
              <TokenRow label="Warning" value="#F6921E" color={C.amareloEscuro}/>
              <TokenRow label="Danger" value="#DC3545" color={C.danger}/>
              <TokenRow label="Info" value="#93BDE4" color={C.azulCeu}/>
              <TokenRow label="Default" value="#004B9B" color={C.azulProfundo}/>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:Fn.title,marginBottom:4}}>Tipografia</span>
              <TokenRow label="KPI valor" value="Saira 700 32px"/>
              <TokenRow label="Status valor" value="Saira 700 22px"/>
              <TokenRow label="Título card" value="Saira 700 16px"/>
              <TokenRow label="Trend número" value="Fira Code 700 11px"/>
              <TokenRow label="Trend label" value="Open Sans 400 10px"/>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:Fn.title,marginBottom:4}}>Grid</span>
              <TokenRow label="KPI desktop" value="4 colunas"/>
              <TokenRow label="KPI mobile" value="2 colunas"/>
              <TokenRow label="Status desktop" value="5 colunas"/>
              <TokenRow label="Resumo/Ação" value="2 colunas"/>
              <TokenRow label="Gap" value="16px"/>
            </div>
          </DSCard>
        </Section>

        <Section n="10" title="Card Regra (Rule Card)" desc="Card com cabeçalho colorido, ícone em container branco, tag de identificação e corpo descritivo. Para documentar regras, princípios obrigatórios e diretrizes de governança. Usado nas páginas de padrões do DS.">
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr 1fr",gap:16}}>
            {[
              {icon:Ic.check(20,C.azulProfundo),color:C.azulProfundo,bg:`color-mix(in srgb, ${C.azulProfundo} 3%, transparent)`,tag:"REGRA 1",title:"Título da regra",desc:"Descrição da regra ou princípio. Texto descritivo que explica o contexto, a motivação e como aplicar no dia a dia do projeto."},
              {icon:Ic.alert(20,C.amareloEscuro),color:C.amareloEscuro,bg:`${C.amareloEscuro}08`,tag:"REGRA 2",title:"Título do alerta",desc:"Descrição de algo a observar ou evitar. O tom é de atenção — não proibição absoluta, mas cuidado redobrado na implementação."},
              {icon:Ic.fire(20,C.azulEscuro),color:C.azulEscuro,bg:`color-mix(in srgb, ${C.azulEscuro} 3%, transparent)`,tag:"REGRA 3",title:"Título da evolução",desc:"Descrição de como evoluir o sistema quando surgir um caso não coberto. Processo, documentação e validação antes de usar."},
            ].map((p,i)=>(
              <div key={i} style={{background:C.cardBg,borderRadius:"10px 10px 10px 18px",border:`1px solid ${C.cardBorder}`,overflow:"hidden",boxShadow:"0 2px 8px rgba(0,75,155,.05)"}}>
                <div style={{background:p.bg,padding:mob?"16px 16px 14px":"20px 22px 16px",borderBottom:`1px solid ${C.cardBorder}`}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                    <div style={{width:42,height:42,borderRadius:12,background:C.cardBg,border:`1px solid ${C.cardBorder}`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 6px rgba(0,75,155,.06)"}}>{p.icon}</div>
                    <span style={{fontSize:9,fontWeight:700,letterSpacing:"1.5px",fontFamily:Fn.title,color:p.color,background:C.cardBg,padding:"3px 8px",borderRadius:4,border:`1px solid ${p.color}20`}}>{p.tag}</span>
                  </div>
                  <h3 style={{fontSize:mob?14:16,fontWeight:700,color:C.cinzaEscuro,margin:0,fontFamily:Fn.title,lineHeight:1.3}}>{p.title}</h3>
                </div>
                <div style={{padding:mob?"14px 16px":"16px 22px 20px"}}>
                  <p style={{fontSize:13,color:C.cinzaChumbo,lineHeight:1.6,margin:0,fontFamily:Fn.body}}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <DSCard mob={mob} s={{marginTop:16}}>
            <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:16}}>
              <div>
                <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:Fn.title,display:"block",marginBottom:8}}>Quando usar</span>
                <p style={{fontSize:13,color:C.cinzaChumbo,lineHeight:1.6,margin:0,fontFamily:Fn.body}}>Páginas de padrões (Banner, Application Shell, Hero, Form Workspace), governança e qualquer documentação que precise destacar regras obrigatórias com hierarquia visual clara.</p>
              </div>
              <div>
                <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:Fn.title,display:"block",marginBottom:8}}>Anatomia</span>
                <p style={{fontSize:13,color:C.cinzaChumbo,lineHeight:1.6,margin:0,fontFamily:Fn.body}}>Cabeçalho com fundo semitransparente (cor 8% opacity), ícone em container branco 42×42 r12, tag de identificação à direita, título Saira 700 16px. Corpo com descrição Open Sans 13px.</p>
              </div>
            </div>
          </DSCard>
        </Section>

        <Section n="11" title="Modo Dark" desc="Comportamento e tokens do componente no tema escuro. O DS-FIPS garante consistência visual em ambos os modos — claro e escuro.">
          <DSCard mob={mob}>
            <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:12}}>
              {[
                {token:"Card bg",light:"#FFFFFF",dark:"#1E1E1E"},
                {token:"Card border",light:"#E2E8F0",dark:"#333333"},
                {token:"Card shadow",light:"rgba(0,75,155,0.04)",dark:"rgba(0,0,0,0.2)"},
                {token:"Header/Footer bg",light:"#F2F4F8",dark:"#252525"},
                {token:"Título",light:"#333B41",dark:"#E2E2E8"},
                {token:"Descrição",light:"#64748B",dark:"#A1A1AA"},
                {token:"Borda lateral success",light:"#00C64C",dark:"#4ADE80"},
                {token:"Borda lateral warning",light:"#F6921E",dark:"#FBBF24"},
                {token:"Borda lateral danger",light:"#DC3545",dark:"#F87171"},
                {token:"Borda lateral info",light:"#93BDE4",dark:"#93BDE4"},
                {token:"Spark area fill",light:"rgba(0,75,155,0.18)",dark:"rgba(26,111,196,0.25)"},
                {token:"Donut track",light:"rgba(0,75,155,0.09)",dark:"rgba(147,189,228,0.1)"},
              ].map((r,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",borderRadius:8,border:`1px solid ${C.cardBorder}`,background:C.bg}}>
                  <div style={{display:"flex",gap:4,flexShrink:0}}>
                    <span style={{width:16,height:16,borderRadius:4,background:r.light,border:"1px solid rgba(0,0,0,0.1)"}}/>
                    <span style={{width:16,height:16,borderRadius:4,background:r.dark,border:"1px solid rgba(255,255,255,0.1)"}}/>
                  </div>
                  <div>
                    <span style={{fontSize:12,fontWeight:600,color:C.cinzaEscuro,display:"block"}}>{r.token}</span>
                    <span style={{fontSize:10,fontFamily:"'Fira Code',monospace",color:C.cinzaChumbo}}>{r.light} → {r.dark}</span>
                  </div>
                </div>
              ))}
            </div>
          </DSCard>
        </Section>

        <CodeExportSection items={[{
          label: "Card",
          description: "Card base, CardResumo (com badges e footer) e CardAcao (com botoes CTA).",
          code: cardExportCode,
          preview: (
            <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
              <CardResumo title="Resumo Operacional" desc="Movimentacao mensal consolidada." badges={<><Badge2 variant="sucesso">Ativo</Badge2><Badge2 variant="info">Atualizado</Badge2></>} footer={<span style={{fontSize:11,color:C.cinzaChumbo,fontFamily:Fn.body}}>Atualizado agora</span>} />
              <CardAcao title="Aprovar Carga" desc="Lote #4521 aguardando liberacao." urgency="alta" primary="Aprovar" secondary="Recusar" />
            </div>
          ),
        }]} />

        <div style={{textAlign:"center",padding:"20px 0 0",borderTop:`1px solid ${C.cardBorder}`,marginTop:20}}>
          <span style={{fontSize:12,color:C.cinzaChumbo,letterSpacing:".5px",fontFamily:Fn.title,fontWeight:400}}>DS-FIPS v0.4.2 · Ferrovia Interna do Porto de Santos · Excelência sobre trilhos · {new Date().getFullYear()}</span>
        </div>
      </div>
    </div>
  );
}
