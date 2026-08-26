import { useState, useEffect } from "react";
import { CodeExportSection } from '../../components/CodeExport';

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

/* ═══════════════════════════════════════════ ICONS (mini) ═══════════════════════════════════════════ */
const Ic={
  check:(s:number=12,c:string="#fff")=><svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  x:(s:number=10,c:string=C.cinzaChumbo)=><svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke={c} strokeWidth="2" strokeLinecap="round"/></svg>,
  star:(s:number=12,c:string=C.amareloOuro)=><svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M8 1l2.2 4.5L15 6.3l-3.5 3.4.8 4.8L8 12.2 3.7 14.5l.8-4.8L1 6.3l4.8-.8L8 1z" fill={c}/></svg>,
  clock:(s:number=12,c:string=C.cinzaChumbo)=><svg width={s} height={s} viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke={c} strokeWidth="1.5"/><path d="M8 4.5V8l2.5 1.5" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>,
  alert:(s:number=12,c:string=C.amareloEscuro)=><svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M8 1.5L1 14h14L8 1.5z" stroke={c} strokeWidth="1.3" strokeLinejoin="round"/><path d="M8 6v3.5M8 11.5v.5" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>,
  fire:(s:number=12,c:string=C.danger)=><svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M8 1C6 4 4 5.5 4 8.5a4 4 0 008 0C12 5.5 10 4 8 1z" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  info:(s:number=12,c:string=C.azulProfundo)=><svg width={s} height={s} viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke={c} strokeWidth="1.5"/><path d="M8 7v4M8 5v.5" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>,
  grid:(s:number=14,c:string=C.amareloOuro)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><rect x="2" y="2" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/><rect x="11" y="2" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/><rect x="2" y="11" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/><rect x="11" y="11" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/></svg>,
};

function JunctionLines({style}:{style?:React.CSSProperties}){return <svg viewBox="0 0 320 200" fill="none" style={{opacity:.12,...style}}><path d="M0 60H100C120 60 120 60 140 40L200 40H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/><path d="M0 60H100C120 60 120 60 140 80L200 80H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/><path d="M0 120H60C80 120 80 120 100 100L160 100H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/><path d="M0 120H60C80 120 80 120 100 140L160 140H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/></svg>}

/* ═══════════════════════════════════════════
   BADGE COMPONENT
   ═══════════════════════════════════════════ */
const VARIANTS = {
  default:   { bg:C.azulProfundo, color:C.branco, border:"transparent" },
  secondary: { bg:C.bg, color:C.cinzaEscuro, border:C.cardBorder },
  sucesso:   { bg:"#ECFDF5", color:C.verdeEscuro, border:"#A7F3D0" },
  atencao:   { bg:"#FFF7ED", color:"#C2410C", border:"#FDBA74" },
  critico:   { bg:"#FEF2F2", color:"#B91C1C", border:"#FECACA" },
  outline:   { bg:"transparent", color:C.cinzaEscuro, border:C.cinzaClaro },
  info:      { bg:C.azulCeuClaro, color:C.azulEscuro, border:C.azulCeu },
  ouro:      { bg:"#FEF9E7", color:"#92400E", border:C.amareloOuro },
};

function Badge({ variant="default", size="md", children, icon, dot, dotColor, count, onRemove, pill }:{ variant?:string, size?:string, children?:React.ReactNode, icon?:React.ReactNode, dot?:boolean, dotColor?:string, count?:number, onRemove?:()=>void, pill?:boolean }) {
  const v = VARIANTS[variant as keyof typeof VARIANTS] || VARIANTS.default;
  const sm = { sm:{fs:10,px:6,py:1,gap:4,dotSz:5}, md:{fs:11,px:8,py:2,gap:5,dotSz:6}, lg:{fs:12,px:10,py:3,gap:6,dotSz:7} };
  const s = sm[size as keyof typeof sm] || sm.md;

  return (
    <span style={{
      display:"inline-flex",alignItems:"center",gap:s.gap,
      padding:`${s.py}px ${s.px}px`,
      fontSize:s.fs,fontWeight:600,fontFamily:Fn.body,
      color:v.color,background:v.bg,
      border:`1px solid ${v.border}`,
      borderRadius:pill?999:4,
      lineHeight:1.3,whiteSpace:"nowrap",
      transition:"all .15s",
    }}>
      {dot&&<span style={{width:s.dotSz,height:s.dotSz,borderRadius:"50%",background:dotColor||v.color,flexShrink:0,opacity:.85}}/>}
      {icon&&<span style={{display:"flex",flexShrink:0}}>{icon}</span>}
      {count!==undefined&&<span style={{minWidth:s.fs+4,height:s.fs+4,borderRadius:999,background:v.color,color:v.bg==="transparent"?C.branco:v.bg,fontSize:s.fs-1,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 3px",fontFamily:Fn.mono}}>{count>99?"99+":count}</span>}
      {children}
      {onRemove&&<span onClick={onRemove} style={{display:"flex",cursor:"pointer",opacity:.6,marginLeft:2,transition:"opacity .15s"}} onMouseEnter={e=>e.currentTarget.style.opacity="1"} onMouseLeave={e=>e.currentTarget.style.opacity=".6"}>{Ic.x(size==="sm"?8:10,v.color)}</span>}
    </span>
  );
}

/* ═══════════════════════════════════════════ LAYOUT ═══════════════════════════════════════════ */
function Section({n,title,desc,children}:{n:string,title:string,desc:string,children:React.ReactNode}){return(<section style={{marginBottom:44}}><div style={{fontSize:10,fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",color:C.azulClaro,fontFamily:Fn.title,marginBottom:6}}>{n}</div><h2 style={{fontSize:20,fontWeight:700,color:C.cinzaEscuro,margin:"0 0 4px",fontFamily:Fn.title,letterSpacing:".5px"}}>{title}</h2><p style={{fontSize:14,color:C.cinzaChumbo,margin:"0 0 20px",lineHeight:1.55,fontFamily:Fn.body}}>{desc}</p>{children}</section>)}
function Card({children,s,mob:m}:{children:React.ReactNode,s?:React.CSSProperties,mob?:boolean}){return(<div style={{background:C.cardBg,borderRadius:"12px 12px 12px 24px",border:`1px solid ${C.cardBorder}`,padding:m?16:28,boxShadow:"0 1px 3px rgba(0,75,155,.04),0 4px 14px rgba(0,75,155,.03)",...s}}>{children}</div>)}

const gc={background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:"10px 10px 10px 18px",overflow:"hidden"};
const gh={padding:"16px 20px",background:C.bg,borderBottom:`1px solid ${C.cardBorder}`,display:"flex",alignItems:"center",gap:12};
const gb={padding:"16px 20px 20px"};
const gl={fontSize:10,fontWeight:700,letterSpacing:"1.2px",textTransform:"uppercase",color:C.azulClaro,fontFamily:Fn.title,marginBottom:4,marginTop:12};
const gt={fontSize:13,color:C.cinzaEscuro,lineHeight:1.55,margin:0,fontFamily:Fn.body};
const ge={fontSize:12,color:C.cinzaChumbo,lineHeight:1.5,margin:0,fontFamily:Fn.body,fontStyle:"italic",paddingLeft:10,borderLeft:`2px solid ${C.azulCeuClaro}`};
const gk={fontSize:11,fontFamily:Fn.mono,color:C.cinzaChumbo,background:C.cardBg,padding:"2px 8px",borderRadius:4,border:`1px solid ${C.cardBorder}`};
function TokenRow({label,value,color}:{label:string,value:string,color?:string}){return(<div style={{display:"flex",alignItems:"center",gap:10,fontSize:12,fontFamily:Fn.body}}>{color&&<div style={{width:16,height:16,borderRadius:4,background:color,border:`1px solid ${C.cardBorder}`,flexShrink:0}}/>}<span style={{color:C.cinzaChumbo,minWidth:120}}>{label}</span><code style={{background:C.neutro,padding:"2px 8px",borderRadius:4,fontSize:11,fontFamily:Fn.mono,color:C.cinzaEscuro}}>{value}</code></div>)}

const badgeExportCode = `// DS-FIPS — Badge — Copy-paste ready
import { useState, useEffect } from "react";

const C = {
  azulProfundo: "#004B9B",
  azulEscuro: "#002A68",
  fg: "#333B41",
  fgMuted: "#7B8C96",
  surface: "#FFFFFF",
  surfaceMuted: "#F8FAFC",
  border: "#E2E8F0",
  branco: "#FFFFFF",
  verdeEscuro: "#00904C",
  azulCeu: "#93BDE4",
  azulCeuClaro: "#D3E3F4",
  amareloOuro: "#FDC24E",
};

const Fn = {
  title: "'Saira Expanded', sans-serif",
  body: "'Open Sans', sans-serif",
  mono: "'Fira Code', monospace",
};

const VARIANTS: Record<string, { bg: string; color: string; border: string }> = {
  default:   { bg: C.azulProfundo, color: C.branco, border: "transparent" },
  secondary: { bg: C.surfaceMuted, color: C.fg, border: C.border },
  sucesso:   { bg: "#ECFDF5", color: "#00904C", border: "#A7F3D0" },
  atencao:   { bg: "#FFF7ED", color: "#C2410C", border: "#FDBA74" },
  critico:   { bg: "#FEF2F2", color: "#B91C1C", border: "#FECACA" },
  outline:   { bg: "transparent", color: C.fg, border: "#C0CCD2" },
  info:      { bg: C.azulCeuClaro, color: C.azulEscuro, border: C.azulCeu },
  ouro:      { bg: "#FEF9E7", color: "#92400E", border: C.amareloOuro },
};

interface BadgeProps {
  variant?: string;
  size?: "sm" | "md" | "lg";
  children?: React.ReactNode;
  icon?: React.ReactNode;
  dot?: boolean;
  dotColor?: string;
  count?: number;
  onRemove?: () => void;
  pill?: boolean;
}

export function Badge({ variant = "default", size = "md", children, icon, dot, dotColor, count, onRemove, pill }: BadgeProps) {
  const v = VARIANTS[variant] || VARIANTS.default;
  const sm: Record<string, { fs: number; px: number; py: number; gap: number; dotSz: number }> = {
    sm: { fs: 10, px: 6, py: 1, gap: 4, dotSz: 5 },
    md: { fs: 11, px: 8, py: 2, gap: 5, dotSz: 6 },
    lg: { fs: 12, px: 10, py: 3, gap: 6, dotSz: 7 },
  };
  const s = sm[size] || sm.md;

  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: s.gap,
      padding: \`\${s.py}px \${s.px}px\`,
      fontSize: s.fs, fontWeight: 600, fontFamily: Fn.body,
      color: v.color, background: v.bg,
      border: \`1px solid \${v.border}\`,
      borderRadius: pill ? 999 : 4,
      lineHeight: 1.3, whiteSpace: "nowrap",
      transition: "all .15s",
    }}>
      {dot && <span style={{ width: s.dotSz, height: s.dotSz, borderRadius: "50%", background: dotColor || v.color, flexShrink: 0, opacity: 0.85 }} />}
      {icon && <span style={{ display: "flex", flexShrink: 0 }}>{icon}</span>}
      {count !== undefined && (
        <span style={{
          minWidth: s.fs + 4, height: s.fs + 4, borderRadius: 999,
          background: v.color, color: v.bg === "transparent" ? C.branco : v.bg,
          fontSize: s.fs - 1, fontWeight: 700,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "0 3px", fontFamily: Fn.mono,
        }}>{count > 99 ? "99+" : count}</span>
      )}
      {children}
      {onRemove && (
        <span onClick={onRemove} style={{ display: "flex", cursor: "pointer", opacity: 0.6, marginLeft: 2, transition: "opacity .15s" }}
          onMouseEnter={e => e.currentTarget.style.opacity = "1"}
          onMouseLeave={e => e.currentTarget.style.opacity = ".6"}>
          <svg width={size === "sm" ? 8 : 10} height={size === "sm" ? 8 : 10} viewBox="0 0 16 16" fill="none">
            <path d="M4 4l8 8M12 4l-8 8" stroke={v.color} strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
      )}
    </span>
  );
}

// Usage:
// <Badge variant="sucesso" dot>Ativo</Badge>
// <Badge variant="atencao" dot>Pendente</Badge>
// <Badge variant="critico" icon={<FireIcon />}>Urgente</Badge>
// <Badge variant="info" pill onRemove={() => {}}>Tag</Badge>
// <Badge variant="default" count={5}>Notificacoes</Badge>
`;

/* ═══════════════════════════════════════════ MAIN ═══════════════════════════════════════════ */
export default function BadgeDoc(){
  const [w,setW]=useState(typeof window!=="undefined"?window.innerWidth:1200);
  useEffect(()=>{const h=()=>setW(window.innerWidth);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h)},[]);
  const mob=w<640;

  const [tags,setTags]=useState(["React","Supabase","Tailwind","N8N","Power BI"]);
  const [notif,setNotif]=useState(5);

  return(
    <div style={{minHeight:"100vh",background:"var(--color-surface-muted)",fontFamily:Fn.body,color:C.cinzaEscuro}}>
      <style>{``}</style>

      {/* HEADER */}
      <header style={{background:`linear-gradient(135deg,${C.azulProfundo} 0%,${C.azulEscuro} 100%)`,padding:mob?"32px 20px":"48px 40px 44px",position:"relative",overflow:"hidden"}}>
        <JunctionLines style={{position:"absolute",top:-10,right:-20,width:mob?250:400,height:250}}/>
        <div style={{position:"relative"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:6,background:`${C.branco}10`,border:`1px solid ${C.branco}18`,borderRadius:20,padding:"5px 14px",fontSize:11,fontWeight:600,letterSpacing:"1.5px",textTransform:"uppercase",color:C.amareloOuro,fontFamily:Fn.title,marginBottom:16}}>{Ic.grid(14,C.amareloOuro)} Design System FIPS</div>
          <h1 style={{fontSize:mob?30:44,fontWeight:700,color:C.branco,margin:"0 0 10px",fontFamily:Fn.title}}>Badge</h1>
          <p style={{fontSize:16,color:`${C.branco}B0`,lineHeight:1.6,maxWidth:700,margin:0,fontFamily:Fn.body}}>Etiquetas compactas para status, categorias, contadores e tags. Visuais informativos que não ocupam espaço — perfeitos para tabelas, cards e listas.</p>
        </div>
      </header>

      <div style={{padding:mob?"24px 16px 40px":"36px 40px 60px",maxWidth:1100,margin:"0 auto"}}>

        {/* 01 — VITRINE COMPLETA */}
        <Section n="01" title="Vitrine de variantes" desc="Todas as variantes, composições e tamanhos do Badge em um único painel.">
          <Card mob={mob}>
            {/* Variantes base */}
            <div style={{marginBottom:20}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.azulClaro,fontFamily:Fn.title,display:"block",marginBottom:8}}>Variantes</span>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
                <Badge variant="default">Padrão</Badge>
                <Badge variant="secondary">Secundário</Badge>
                <Badge variant="sucesso">Sucesso</Badge>
                <Badge variant="atencao">Atenção</Badge>
                <Badge variant="critico">Crítico</Badge>
                <Badge variant="outline">Contorno</Badge>
                <Badge variant="info">Informativo</Badge>
                <Badge variant="ouro">Destaque</Badge>
              </div>
            </div>

            {/* Com dot */}
            <div style={{marginBottom:20}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.azulClaro,fontFamily:Fn.title,display:"block",marginBottom:8}}>Com indicador (dot)</span>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
                <Badge variant="sucesso" dot>Ativo</Badge>
                <Badge variant="atencao" dot>Pendente</Badge>
                <Badge variant="critico" dot>Inativo</Badge>
                <Badge variant="info" dot>Em análise</Badge>
                <Badge variant="secondary" dot dotColor={C.azulProfundo}>Rascunho</Badge>
                <Badge variant="secondary" dot dotColor={C.amareloEscuro}>Aguardando</Badge>
              </div>
            </div>

            {/* Com ícone */}
            <div style={{marginBottom:20}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.azulClaro,fontFamily:Fn.title,display:"block",marginBottom:8}}>Com ícone</span>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
                <Badge variant="sucesso" icon={Ic.check(11,C.verdeEscuro)}>Aprovado</Badge>
                <Badge variant="atencao" icon={Ic.alert(11,"#C2410C")}>Atenção</Badge>
                <Badge variant="critico" icon={Ic.fire(11,"#B91C1C")}>Urgente</Badge>
                <Badge variant="info" icon={Ic.info(11,C.azulEscuro)}>Info</Badge>
                <Badge variant="ouro" icon={Ic.star(11,"#92400E")}>Destaque</Badge>
                <Badge variant="secondary" icon={Ic.clock(11,C.cinzaChumbo)}>Pendente</Badge>
              </div>
            </div>

            {/* Pill shape */}
            <div style={{marginBottom:20}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.azulClaro,fontFamily:Fn.title,display:"block",marginBottom:8}}>Formato pílula (pill)</span>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
                <Badge variant="default" pill>Versão 2.0</Badge>
                <Badge variant="sucesso" pill dot>Online</Badge>
                <Badge variant="critico" pill dot>Offline</Badge>
                <Badge variant="info" pill>Novo</Badge>
                <Badge variant="ouro" pill icon={Ic.star(10,"#92400E")}>Premium</Badge>
              </div>
            </div>

            {/* Contadores */}
            <div style={{marginBottom:20}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.azulClaro,fontFamily:Fn.title,display:"block",marginBottom:8}}>Com contador</span>
              <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
                <Badge variant="default" count={notif}>Notificações</Badge>
                <Badge variant="critico" count={3}>Erros</Badge>
                <Badge variant="atencao" count={12}>Pendentes</Badge>
                <Badge variant="info" count={99}>Mensagens</Badge>
                <Badge variant="critico" count={150}>Alertas</Badge>
                <button onClick={()=>setNotif(n=>n+1)} style={{padding:"4px 10px",fontSize:11,border:`1px solid ${C.cardBorder}`,borderRadius:4,background:C.bg,cursor:"pointer",fontFamily:Fn.body,color:C.cinzaChumbo}}>+ Incrementar</button>
              </div>
            </div>

            {/* Removíveis */}
            <div style={{marginBottom:20}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.azulClaro,fontFamily:Fn.title,display:"block",marginBottom:8}}>Removíveis (tags)</span>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
                {tags.map(t=>(
                  <Badge key={t} variant="info" onRemove={()=>setTags(p=>p.filter(x=>x!==t))} pill>{t}</Badge>
                ))}
                {tags.length===0&&<span style={{fontSize:12,color:C.textMuted,fontStyle:"italic"}}>Todas removidas. </span>}
                {tags.length<5&&<span onClick={()=>setTags(["React","Supabase","Tailwind","N8N","Power BI"])} style={{fontSize:11,color:C.cinzaEscuro,cursor:"pointer",fontWeight:600,textDecoration:"underline"}}>Resetar</span>}
              </div>
            </div>

            {/* Tamanhos */}
            <div>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.azulClaro,fontFamily:Fn.title,display:"block",marginBottom:8}}>Tamanhos</span>
              <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                  <Badge variant="default" size="sm">Small</Badge>
                  <span style={{fontSize:9,color:C.textLight,fontFamily:Fn.mono}}>10px</span>
                </div>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                  <Badge variant="default" size="md">Medium</Badge>
                  <span style={{fontSize:9,color:C.textLight,fontFamily:Fn.mono}}>11px ★</span>
                </div>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                  <Badge variant="default" size="lg">Large</Badge>
                  <span style={{fontSize:9,color:C.textLight,fontFamily:Fn.mono}}>12px</span>
                </div>
                <div style={{width:1,height:28,background:C.cardBorder,margin:"0 8px"}}/>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                  <Badge variant="sucesso" size="sm" dot>SM</Badge>
                  <span style={{fontSize:9,color:C.textLight,fontFamily:Fn.mono}}>com dot</span>
                </div>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                  <Badge variant="sucesso" size="md" dot>MD</Badge>
                  <span style={{fontSize:9,color:C.textLight,fontFamily:Fn.mono}}>com dot</span>
                </div>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                  <Badge variant="sucesso" size="lg" dot>LG</Badge>
                  <span style={{fontSize:9,color:C.textLight,fontFamily:Fn.mono}}>com dot</span>
                </div>
              </div>
            </div>
          </Card>
        </Section>

        {/* 02 — GUIA POR VARIANTE */}
        <Section n="02" title="Guia de uso por variante" desc="Significado, regras e exemplos FIPS para cada variante de badge.">
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:16}}>
            {[
              {name:"Padrão (default)",v:"default",badge:<Badge variant="default">Padrão</Badge>,desc:"Badge institucional azul. Destaque primário, identificador genérico.",when:"Identificação principal, versão, categoria padrão. Quando nenhum status semântico se aplica.",ex:"'Componentes' no menu; tag de versão 'v0.4.2'; identificador de módulo."},
              {name:"Secundário",v:"secondary",badge:<Badge variant="secondary">Secundário</Badge>,desc:"Badge neutro com fundo cinza. Menor hierarquia visual, informação de suporte.",when:"Metadados, contadores discretos, informações auxiliares. Tags de categoria genérica.",ex:"Contagem de registros em listagens; metadata em cards; categoria 'Geral'."},
              {name:"Sucesso",v:"sucesso",badge:<Badge variant="sucesso" dot>Ativo</Badge>,desc:"Verde suave para status positivo. Comunica aprovação, conclusão, ativo.",when:"Status ativo, aprovado, concluído, online, verificado. Sempre com dot para status.",ex:"'Ativo' em tabelas do Suprimentos; 'Aprovado' em fluxos; 'Online' no sistema."},
              {name:"Atenção",v:"atencao",badge:<Badge variant="atencao" dot>Pendente</Badge>,desc:"Laranja suave para alerta moderado. Requer ação mas não é urgente.",when:"Pendente, aguardando, próximo do prazo, em revisão. Fluxos que precisam de atenção.",ex:"'Pendente' em requisições; 'Aguardando aprovação'; 'Prazo próximo' no SSMA."},
              {name:"Crítico",v:"critico",badge:<Badge variant="critico" dot>Inativo</Badge>,desc:"Vermelho suave para status negativo ou urgente. Ação imediata necessária.",when:"Inativo, rejeitado, vencido, erro, offline. Situações que impedem continuidade.",ex:"'Inativo' em cadastros; 'Rejeitado' em aprovações; 'Vencido' no App Cadastros."},
              {name:"Contorno (outline)",v:"outline",badge:<Badge variant="outline">Contorno</Badge>,desc:"Badge sem preenchimento, apenas borda. Mínimo impacto visual.",when:"Tags de baixa prioridade, filtros visuais, categorias discretas. Onde cor cheia seria pesado demais.",ex:"Tags de filtro em dashboards; categorias em listas; labels auxiliares."},
              {name:"Informativo",v:"info",badge:<Badge variant="info" icon={Ic.info(11,C.azulEscuro)}>Info</Badge>,desc:"Azul claro para informação neutra. Destaque sem urgência.",when:"Notas informativas, status neutro, identificadores de tipo. 'Novo', 'Em análise', 'Informação'.",ex:"'Novo' em itens recém-criados; 'Em análise' em ocorrências; tip de contexto."},
              {name:"Destaque (ouro)",v:"ouro",badge:<Badge variant="ouro" icon={Ic.star(11,"#92400E")}>Destaque</Badge>,desc:"Dourado para premiação, gamificação e destaques especiais.",when:"Fipcoins, conquistas, badges de mérito, itens premium ou em destaque.",ex:"'Fipcoins +50' no App Ideias; badge de conquista; item destacado em listagem."},
            ].map(t=>(
              <div key={t.name} style={gc}>
                <div style={gh}>
                  <span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>{t.name}</span>
                  <div style={{marginLeft:"auto"}}>{t.badge}</div>
                </div>
                <div style={gb}>
                  <p style={gt}>{t.desc}</p>
                  <div style={gl}>Quando usar</div><p style={gt}>{t.when}</p>
                  <div style={gl}>Exemplo FIPS</div><p style={ge}>{t.ex}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* 03 — COMPOSIÇÕES */}
        <Section n="03" title="Composições" desc="Badge pode ser combinado com dot, ícone, contador e botão de remoção. Cada composição tem uma função específica.">
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:16}}>
            {/* Dot */}
            <div style={gc}>
              <div style={gh}><span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>Com dot (indicador)</span><code style={gk}>status ao vivo</code></div>
              <div style={gb}>
                <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
                  <Badge variant="sucesso" dot>Ativo</Badge>
                  <Badge variant="critico" dot>Offline</Badge>
                  <Badge variant="secondary" dot dotColor={C.amareloEscuro}>Aguardando</Badge>
                </div>
                <p style={gt}>Bolinha colorida antes do texto. Indica status em tempo real, presença, estado de conexão.</p>
                <div style={gl}>Regra</div>
                <p style={{...gt,fontWeight:600}}>Dot é exclusivo para status que mudam dinamicamente. Não usar em categorias fixas.</p>
              </div>
            </div>

            {/* Ícone */}
            <div style={gc}>
              <div style={gh}><span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>Com ícone</span><code style={gk}>semântica reforçada</code></div>
              <div style={gb}>
                <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
                  <Badge variant="sucesso" icon={Ic.check(11,C.verdeEscuro)}>Aprovado</Badge>
                  <Badge variant="critico" icon={Ic.fire(11,"#B91C1C")}>Urgente</Badge>
                  <Badge variant="ouro" icon={Ic.star(11,"#92400E")}>Destaque</Badge>
                </div>
                <p style={gt}>Ícone SVG antes do texto. Reforça visualmente o significado do badge para leitura rápida.</p>
                <div style={gl}>Regra</div>
                <p style={{...gt,fontWeight:600}}>Máximo 1 ícone por badge. Não combinar dot + ícone no mesmo badge.</p>
              </div>
            </div>

            {/* Contador */}
            <div style={gc}>
              <div style={gh}><span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>Com contador</span><code style={gk}>notificações</code></div>
              <div style={gb}>
                <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
                  <Badge variant="default" count={5}>Mensagens</Badge>
                  <Badge variant="critico" count={3}>Erros</Badge>
                  <Badge variant="critico" count={150}>Alertas</Badge>
                </div>
                <p style={gt}>Contador numérico em círculo. Acima de 99 mostra "99+". Para notificações e contagens.</p>
                <div style={gl}>Regra</div>
                <p style={{...gt,fontWeight:600}}>Contador fica à esquerda do texto. Cor invertida (fundo = cor do texto, texto = cor do fundo).</p>
              </div>
            </div>

            {/* Removível */}
            <div style={gc}>
              <div style={gh}><span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>Removível (tag)</span><code style={gk}>filtros e tags</code></div>
              <div style={gb}>
                <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
                  <Badge variant="info" onRemove={()=>{}} pill>React</Badge>
                  <Badge variant="info" onRemove={()=>{}} pill>Tailwind</Badge>
                  <Badge variant="atencao" onRemove={()=>{}}>Filtro ativo</Badge>
                </div>
                <p style={gt}>Botão X à direita para remover. Ideal para tags editáveis, filtros ativos e seleções múltiplas.</p>
                <div style={gl}>Regra</div>
                <p style={{...gt,fontWeight:600}}>X aparece com hover opacity. Combina bem com formato pill para visual de tag.</p>
              </div>
            </div>
          </div>
        </Section>

        {/* 04 — CENÁRIOS DE NEGÓCIO */}
        <Section n="04" title="Cenários de negócio" desc="Composições reais aplicadas em contextos operacionais do ecossistema FIPS.">
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:16}}>

            {/* Tabela com status */}
            <div style={{background:C.bg,border:`1px solid ${C.cardBorder}`,borderRadius:"10px 10px 10px 20px",padding:mob?16:24}}>
              <h3 style={{fontSize:14,fontWeight:700,color:C.cinzaEscuro,margin:"0 0 4px",fontFamily:Fn.title}}>Status em tabela</h3>
              <p style={{fontSize:12,color:C.cinzaChumbo,margin:"0 0 16px"}}>App Suprimentos — listagem de requisições</p>
              <div style={{background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:8,overflow:"hidden"}}>
                {[
                  {id:"#REQ-4021",nome:"Material elétrico",status:"sucesso",label:"Aprovado",dot:true},
                  {id:"#REQ-4022",nome:"Equipamento SSMA",status:"atencao",label:"Pendente",dot:true},
                  {id:"#REQ-4023",nome:"Peças locomotiva",status:"critico",label:"Rejeitado",dot:true},
                  {id:"#REQ-4024",nome:"Ferramentas",status:"info",label:"Em análise",dot:true},
                ].map((r,i)=>(
                  <div key={r.id} style={{display:"flex",alignItems:"center",padding:"10px 16px",borderBottom:i<3?`1px solid ${C.cardBorder}`:"none",gap:14}}>
                    <span style={{fontSize:12,fontWeight:600,color:C.cinzaEscuro,fontFamily:Fn.mono,minWidth:75}}>{r.id}</span>
                    <span style={{fontSize:13,color:C.cinzaEscuro,flex:1}}>{r.nome}</span>
                    <Badge variant={r.status} dot={r.dot} size="sm">{r.label}</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Card com tags */}
            <div style={{background:C.bg,border:`1px solid ${C.cardBorder}`,borderRadius:"10px 10px 10px 20px",padding:mob?16:24}}>
              <h3 style={{fontSize:14,fontWeight:700,color:C.cinzaEscuro,margin:"0 0 4px",fontFamily:Fn.title}}>Tags em card</h3>
              <p style={{fontSize:12,color:C.cinzaChumbo,margin:"0 0 16px"}}>App Ideias — card de ideia com categorias</p>
              <div style={{background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:8,padding:16}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                  <span style={{fontSize:14,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>Automação do pátio</span>
                  <Badge variant="ouro" icon={Ic.star(10,"#92400E")} size="sm">+50 Fipcoins</Badge>
                </div>
                <p style={{fontSize:12,color:C.cinzaChumbo,margin:"0 0 12px",lineHeight:1.4}}>Implementar sensores IoT para monitoramento automático de vagões no pátio ferroviário.</p>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  <Badge variant="info" size="sm" pill>Inovação</Badge>
                  <Badge variant="secondary" size="sm" pill>Operações</Badge>
                  <Badge variant="secondary" size="sm" pill>IoT</Badge>
                </div>
              </div>
            </div>

            {/* Menu com contadores */}
            <div style={{background:C.bg,border:`1px solid ${C.cardBorder}`,borderRadius:"10px 10px 10px 20px",padding:mob?16:24}}>
              <h3 style={{fontSize:14,fontWeight:700,color:C.cinzaEscuro,margin:"0 0 4px",fontFamily:Fn.title}}>Contadores em menu</h3>
              <p style={{fontSize:12,color:C.cinzaChumbo,margin:"0 0 16px"}}>App Ocorrências — sidebar com contagens</p>
              <div style={{background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:8,overflow:"hidden"}}>
                {[
                  {label:"Todas",count:47,v:"secondary"},
                  {label:"Pendentes",count:12,v:"atencao"},
                  {label:"Críticas",count:3,v:"critico"},
                  {label:"Resolvidas",count:32,v:"sucesso"},
                ].map((item,i)=>(
                  <div key={item.label} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 16px",borderBottom:i<3?`1px solid ${C.cardBorder}`:"none",cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.background=C.bg} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <span style={{fontSize:13,color:C.cinzaEscuro}}>{item.label}</span>
                    <Badge variant={item.v} size="sm" pill>{item.count}</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Filtros ativos */}
            <div style={{background:C.bg,border:`1px solid ${C.cardBorder}`,borderRadius:"10px 10px 10px 20px",padding:mob?16:24}}>
              <h3 style={{fontSize:14,fontWeight:700,color:C.cinzaEscuro,margin:"0 0 4px",fontFamily:Fn.title}}>Filtros ativos</h3>
              <p style={{fontSize:12,color:C.cinzaChumbo,margin:"0 0 16px"}}>Power BI / Suprimentos — barra de filtros</p>
              <div style={{background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:8,padding:16}}>
                <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
                  <span style={{fontSize:12,color:C.cinzaChumbo,marginRight:4}}>Filtros:</span>
                  <Badge variant="info" onRemove={()=>{}} pill size="sm">Status: Ativo</Badge>
                  <Badge variant="info" onRemove={()=>{}} pill size="sm">Segmento: Grãos</Badge>
                  <Badge variant="info" onRemove={()=>{}} pill size="sm">Período: 2026</Badge>
                  <span style={{fontSize:11,color:C.cinzaEscuro,cursor:"pointer",fontWeight:600,marginLeft:4}}>Limpar tudo</span>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* 05 — TOKENS */}
        <Section n="05" title="Tokens de referência" desc="Valores de design utilizados neste componente — direto do Brandbook FIPS.">
          <Card mob={mob} s={{display:"flex",gap:mob?24:48,flexWrap:"wrap"}}>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:Fn.title,marginBottom:4}}>Cores de fundo</span>
              <TokenRow label="Padrão" value="#004B9B" color={C.azulProfundo}/>
              <TokenRow label="Secundário" value="#F2F4F8" color={C.bg}/>
              <TokenRow label="Sucesso" value="#ECFDF5" color="#ECFDF5"/>
              <TokenRow label="Atenção" value="#FFF7ED" color="#FFF7ED"/>
              <TokenRow label="Crítico" value="#FEF2F2" color="#FEF2F2"/>
              <TokenRow label="Info" value="#D3E3F4" color={C.azulCeuClaro}/>
              <TokenRow label="Ouro" value="#FEF9E7" color="#FEF9E7"/>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:Fn.title,marginBottom:4}}>Tamanhos</span>
              <TokenRow label="SM font" value="10px"/>
              <TokenRow label="MD font ★" value="11px"/>
              <TokenRow label="LG font" value="12px"/>
              <TokenRow label="SM padding" value="1px 6px"/>
              <TokenRow label="MD padding" value="2px 8px"/>
              <TokenRow label="LG padding" value="3px 10px"/>
              <TokenRow label="Border radius" value="4px (default)"/>
              <TokenRow label="Pill radius" value="999px"/>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:Fn.title,marginBottom:4}}>Composições</span>
              <TokenRow label="Dot SM" value="5px"/>
              <TokenRow label="Dot MD" value="6px"/>
              <TokenRow label="Dot LG" value="7px"/>
              <TokenRow label="Ícone" value="11–12px"/>
              <TokenRow label="Contador min-w" value="font + 4px"/>
              <TokenRow label="X (remove)" value="10px"/>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:Fn.title,marginBottom:4}}>Tipografia</span>
              <TokenRow label="Texto" value="Open Sans 600"/>
              <TokenRow label="Contador" value="Fira Code 700"/>
              <TokenRow label="Line height" value="1.3"/>
              <TokenRow label="White space" value="nowrap"/>
            </div>
          </Card>
        </Section>

        <Section n="06" title="Modo Dark" desc="Comportamento e tokens do componente no tema escuro. O DS-FIPS garante consistência visual em ambos os modos — claro e escuro.">
          <Card mob={mob}>
            <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:12}}>
              {[
                {token:"Default bg",light:"#004B9B",dark:"#1A6FC4"},
                {token:"Default text",light:"#FFFFFF",dark:"#FFFFFF"},
                {token:"Sucesso bg",light:"#ECFDF5",dark:"rgba(0,168,62,0.15)"},
                {token:"Sucesso text",light:"#00904C",dark:"#4ADE80"},
                {token:"Atenção bg",light:"#FFF7ED",dark:"rgba(251,191,36,0.15)"},
                {token:"Atenção text",light:"#C2410C",dark:"#FBBF24"},
                {token:"Crítico bg",light:"#FEF2F2",dark:"rgba(248,113,113,0.15)"},
                {token:"Crítico text",light:"#B91C1C",dark:"#F87171"},
                {token:"Info bg",light:"#D3E3F4",dark:"rgba(147,189,228,0.15)"},
                {token:"Info text",light:"#002A68",dark:"#93BDE4"},
                {token:"Ouro bg",light:"#FEF9E7",dark:"rgba(253,194,78,0.15)"},
                {token:"Ouro text",light:"#92400E",dark:"#FDC24E"},
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
          </Card>
        </Section>

        <CodeExportSection items={[{
          label: "Badge",
          description: "Badge com variantes (default, sucesso, atencao, critico, info, ouro, outline), dot, icone, contador e remocao.",
          code: badgeExportCode,
          preview: (
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
              <Badge variant="default">Default</Badge>
              <Badge variant="sucesso" dot>Sucesso</Badge>
              <Badge variant="atencao" icon={Ic.alert()}>Atencao</Badge>
              <Badge variant="critico" count={5}>Critico</Badge>
              <Badge variant="info" pill>Info</Badge>
              <Badge variant="ouro" icon={Ic.star()}>Ouro</Badge>
              <Badge variant="outline">Outline</Badge>
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
