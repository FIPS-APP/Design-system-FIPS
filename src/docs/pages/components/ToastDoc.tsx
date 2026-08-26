// @ts-nocheck
import { useState, useEffect, useRef } from "react";
import { CodeExportSection } from '../../components/CodeExport';
import { PlaygroundProvider, Copyable, CodePlayground } from '../../components/CodePlayground';

/* ═══════════════════════════════════════════ TOKENS ═══════════════════════════════════════════ */
const C={azulProfundo:"var(--color-gov-azul-profundo)",azulEscuro:"var(--color-gov-azul-escuro)",azulClaro:"var(--color-gov-azul-claro)",cinzaChumbo:"var(--color-fg-muted)",cinzaEscuro:"var(--color-fg)",cinzaClaro:"#C0CCD2",azulCeu:"#93BDE4",azulCeuClaro:"#D3E3F4",amareloOuro:"#FDC24E",amareloEscuro:"#F6921E",verdeFloresta:"#00C64C",verdeEscuro:"#00904C",danger:"#DC3545",neutro:"var(--color-surface-soft)",branco:"#FFFFFF",bg:"var(--color-surface-muted)",cardBg:"var(--color-surface)",cardBorder:"var(--color-border)",textMuted:"var(--color-fg-muted)",textLight:"var(--color-fg-muted)"};
const Fn={title:"'Saira Expanded',sans-serif",body:"'Open Sans',sans-serif",mono:"'Fira Code',monospace"};

/* ═══════════════════════════════════════════ ICONS ═══════════════════════════════════════════ */
const Ic={
  check:(s=16,c=C.verdeFloresta)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke={c} strokeWidth="1.5"/><path d="M7 10l2 2 4-4" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  xClose:(s=14,c=C.cinzaChumbo)=><svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>,
  alertTri:(s=16,c=C.amareloEscuro)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M10 2L1.5 17h17L10 2z" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/><path d="M10 8v4M10 14v.5" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>,
  errorX:(s=16,c=C.danger)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke={c} strokeWidth="1.5"/><path d="M7 7l6 6M13 7l-6 6" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>,
  infoI:(s=16,c=C.azulProfundo)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke={c} strokeWidth="1.5"/><path d="M10 9v5M10 6.5v.5" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>,
  grid:(s=14,c=C.amareloOuro)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><rect x="2" y="2" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/><rect x="11" y="2" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/><rect x="2" y="11" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/><rect x="11" y="11" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/></svg>,
};

function JunctionLines({style}){return <svg viewBox="0 0 320 200" fill="none" style={{opacity:.12,...style}}><path d="M0 60H100C120 60 120 60 140 40L200 40H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/><path d="M0 60H100C120 60 120 60 140 80L200 80H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/><path d="M0 120H60C80 120 80 120 100 100L160 100H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/><path d="M0 120H60C80 120 80 120 100 140L160 140H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/></svg>}

/* ═══════════════════════════════════════════ TOAST CONFIG ═══════════════════════════════════════════ */
const TV={
  sucesso:{bg:"#ECFDF5",border:"#A7F3D0",color:C.verdeEscuro,accent:C.verdeFloresta,iconFn:(s)=>Ic.check(s,C.verdeFloresta)},
  erro:{bg:"#FEF2F2",border:"#FECACA",color:"#B91C1C",accent:C.danger,iconFn:(s)=>Ic.errorX(s,C.danger)},
  atencao:{bg:"#FFF7ED",border:"#FDBA74",color:"#C2410C",accent:C.amareloEscuro,iconFn:(s)=>Ic.alertTri(s,C.amareloEscuro)},
  info:{bg:C.azulCeuClaro,border:C.azulCeu,color:C.azulEscuro,accent:C.azulProfundo,iconFn:(s)=>Ic.infoI(s,C.azulProfundo)},
  neutro:{bg:C.bg,border:C.cardBorder,color:C.cinzaEscuro,accent:C.cinzaChumbo,iconFn:(s)=>Ic.infoI(s,C.cinzaChumbo)},
};

/* ═══════════════════════════════════════════ LIVE TOAST ═══════════════════════════════════════════ */
function LiveToast({id,variant,title,message,actionLabel,duration,onClose}){
  const v=TV[variant]||TV.info;
  const [out,setOut]=useState(false);
  const timerId=useRef(null);

  useEffect(()=>{
    if(duration){timerId.current=setTimeout(()=>{setOut(true);setTimeout(()=>onClose(id),300)},duration)}
    return ()=>{if(timerId.current)clearTimeout(timerId.current)};
  },[duration,id,onClose]);

  const dismiss=()=>{setOut(true);setTimeout(()=>onClose(id),300)};

  return(
    <div className="ds-toast-item" style={{background:v.bg,border:`1px solid ${v.border}`,borderRadius:10,borderLeft:`4px solid ${v.accent}`,padding:"12px 16px",width:360,maxWidth:"calc(100vw - 32px)",boxShadow:"0 4px 20px rgba(0,0,0,.1)",display:"flex",gap:12,alignItems:"center",position:"relative",overflow:"hidden",opacity:out?0:1,transform:out?"translateX(110%)":"translateX(0)",transition:"all .3s ease",animation:"toastSlideIn .35s ease"}}>
      <span style={{display:"flex",flexShrink:0,}}>{v.iconFn(22)}</span>
      <div style={{flex:1,minWidth:0}}>
        {title&&<div style={{fontSize:13,fontWeight:700,color:v.color,fontFamily:Fn.body,marginBottom:2}}>{title}</div>}
        {message&&<div style={{fontSize:12,color:v.color,fontFamily:Fn.body,opacity:.85,lineHeight:1.4}}>{message}</div>}
        {actionLabel&&<button onClick={dismiss} style={{marginTop:6,padding:"3px 10px",fontSize:11,fontWeight:700,color:v.accent,background:"transparent",border:`1px solid ${v.accent}`,borderRadius:4,cursor:"pointer",fontFamily:Fn.body}}>{actionLabel}</button>}
      </div>
      <span onClick={dismiss} style={{display:"flex",cursor:"pointer",opacity:.5,flexShrink:0,}}>{Ic.xClose(14,v.color)}</span>
      {duration&&<div style={{position:"absolute",bottom:0,left:0,right:0,height:3}}><div style={{height:3,background:v.accent,opacity:.35,animation:`toastTimer ${duration}ms linear forwards`}}/></div>}
    </div>
  );
}

/* ═══════════════════════════════════════════ STATIC PREVIEW ═══════════════════════════════════════════ */
function ToastPreview({variant,title,message,actionLabel,timer}){
  const v=TV[variant]||TV.info;
  return(
    <div style={{background:v.bg,border:`1px solid ${v.border}`,borderRadius:10,borderLeft:`4px solid ${v.accent}`,padding:"12px 16px",display:"flex",gap:12,alignItems:"center",position:"relative",overflow:"hidden"}}>
      <span style={{display:"flex",flexShrink:0,}}>{v.iconFn(22)}</span>
      <div style={{flex:1,minWidth:0}}>
        {title&&<div style={{fontSize:13,fontWeight:700,color:v.color,fontFamily:Fn.body,marginBottom:2}}>{title}</div>}
        {message&&<div style={{fontSize:12,color:v.color,fontFamily:Fn.body,opacity:.85,lineHeight:1.4}}>{message}</div>}
        {actionLabel&&<span style={{display:"inline-block",marginTop:6,padding:"3px 10px",fontSize:11,fontWeight:700,color:v.accent,border:`1px solid ${v.accent}`,borderRadius:4,fontFamily:Fn.body}}>{actionLabel}</span>}
      </div>
      <span style={{display:"flex",opacity:.4,flexShrink:0,}}>{Ic.xClose(14,v.color)}</span>
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:3}}><div style={{height:3,background:v.accent,opacity:.35,width:`${timer||65}%`}}/></div>
    </div>
  );
}

/* ═══════════════════════════════════════════ LAYOUT ═══════════════════════════════════════════ */
function Section({n,title,desc,children}){return(<section style={{marginBottom:44}}><div style={{fontSize:10,fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",color:C.azulClaro,fontFamily:Fn.title,marginBottom:6}}>{n}</div><h2 style={{fontSize:20,fontWeight:700,color:C.cinzaEscuro,margin:"0 0 4px",fontFamily:Fn.title,letterSpacing:".5px"}}>{title}</h2><p style={{fontSize:14,color:C.cinzaChumbo,margin:"0 0 20px",lineHeight:1.55,fontFamily:Fn.body}}>{desc}</p>{children}</section>)}
function DSCard({children,s,mob:m}){return(<div style={{background:C.cardBg,borderRadius:"12px 12px 12px 24px",border:`1px solid ${C.cardBorder}`,padding:m?16:28,boxShadow:"0 1px 3px rgba(0,75,155,.04),0 4px 14px rgba(0,75,155,.03)",...s}}>{children}</div>)}

const gc={background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:"10px 10px 10px 18px",overflow:"hidden"};
const gh={padding:"16px 20px",background:C.bg,borderBottom:`1px solid ${C.cardBorder}`,display:"flex",alignItems:"center",gap:12};
const gb={padding:"16px 20px 20px"};
const gl={fontSize:10,fontWeight:700,letterSpacing:"1.2px",textTransform:"uppercase",color:C.azulClaro,fontFamily:Fn.title,marginBottom:4,marginTop:12};
const gt={fontSize:13,color:C.cinzaEscuro,lineHeight:1.55,margin:0,fontFamily:Fn.body};
const ge={fontSize:12,color:C.cinzaChumbo,lineHeight:1.5,margin:0,fontFamily:Fn.body,fontStyle:"italic",paddingLeft:10,borderLeft:`2px solid ${C.azulCeuClaro}`};
function TokenRow({label,value,color}){return(<div style={{display:"flex",alignItems:"center",gap:10,fontSize:12,fontFamily:Fn.body}}>{color&&<div style={{width:16,height:16,borderRadius:4,background:color,border:`1px solid ${C.cardBorder}`,flexShrink:0}}/>}<span style={{color:C.cinzaChumbo,minWidth:130}}>{label}</span><code style={{background:C.neutro,padding:"2px 8px",borderRadius:4,fontSize:11,fontFamily:Fn.mono,color:C.cinzaEscuro}}>{value}</code></div>)}
function Btn({label,color,onClick}){return <button onClick={onClick} style={{padding:"8px 18px",fontSize:12,fontWeight:600,background:color,color:C.branco,border:"none",borderRadius:6,cursor:"pointer",fontFamily:Fn.body}}>{label}</button>}

/* ═══════════════════════════════════════════ EXPORT CODE ═══════════════════════════════════════════ */
const toastExportCode = `// DS-FIPS — Toast Notification — Copy-paste ready
import { useState, useEffect, useRef } from "react";

const C = {
  azulProfundo: "#004B9B",
  azulEscuro: "#002A68",
  cinzaChumbo: "#7B8C96",
  cinzaEscuro: "#333B41",
  verdeFloresta: "#00C64C",
  verdeEscuro: "#00904C",
  amareloEscuro: "#F6921E",
  danger: "#DC3545",
  branco: "#FFFFFF",
  bg: "#F8FAFC",
  cardBorder: "#E2E8F0",
};

const Fn = {
  body: "'Open Sans', sans-serif",
  mono: "'Fira Code', monospace",
};

type ToastVariant = "sucesso" | "erro" | "atencao" | "info" | "neutro";

const TV: Record<ToastVariant, { bg: string; border: string; color: string; accent: string }> = {
  sucesso: { bg: "#ECFDF5", border: "#A7F3D0", color: C.verdeEscuro, accent: C.verdeFloresta },
  erro: { bg: "#FEF2F2", border: "#FECACA", color: "#B91C1C", accent: C.danger },
  atencao: { bg: "#FFF7ED", border: "#FDBA74", color: "#C2410C", accent: C.amareloEscuro },
  info: { bg: "#D3E3F4", border: "#93BDE4", color: C.azulEscuro, accent: C.azulProfundo },
  neutro: { bg: C.bg, border: C.cardBorder, color: C.cinzaEscuro, accent: C.cinzaChumbo },
};

interface ToastItem {
  id: number; variant: ToastVariant; title?: string;
  message?: string; actionLabel?: string; duration?: number;
}

function Toast({ id, variant, title, message, actionLabel, duration, onClose }: ToastItem & { onClose: (id: number) => void }) {
  const v = TV[variant] || TV.info;
  const [out, setOut] = useState(false);
  const timerId = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (duration) { timerId.current = setTimeout(() => { setOut(true); setTimeout(() => onClose(id), 300); }, duration); }
    return () => { if (timerId.current) clearTimeout(timerId.current); };
  }, [duration, id, onClose]);

  const dismiss = () => { setOut(true); setTimeout(() => onClose(id), 300); };

  return (
    <div style={{ background: v.bg, border: \`1px solid \${v.border}\`, borderRadius: 10, borderLeft: \`4px solid \${v.accent}\`, padding: "12px 16px", width: 360, maxWidth: "calc(100vw - 32px)", boxShadow: "0 4px 20px rgba(0,0,0,.1)", display: "flex", gap: 12, alignItems: "center", position: "relative", overflow: "hidden", opacity: out ? 0 : 1, transform: out ? "translateX(110%)" : "translateX(0)", transition: "all .3s ease" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && <div style={{ fontSize: 13, fontWeight: 700, color: v.color, fontFamily: Fn.body, marginBottom: 2 }}>{title}</div>}
        {message && <div style={{ fontSize: 12, color: v.color, fontFamily: Fn.body, opacity: 0.85, lineHeight: 1.4 }}>{message}</div>}
        {actionLabel && <button onClick={dismiss} style={{ marginTop: 6, padding: "3px 10px", fontSize: 11, fontWeight: 700, color: v.accent, background: "transparent", border: \`1px solid \${v.accent}\`, borderRadius: 4, cursor: "pointer", fontFamily: Fn.body }}>{actionLabel}</button>}
      </div>
      <span onClick={dismiss} style={{ display: "flex", cursor: "pointer", opacity: 0.5, flexShrink: 0 }}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke={v.color} strokeWidth="1.8" strokeLinecap="round"/></svg>
      </span>
      {duration && <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3 }}><div style={{ height: 3, background: v.accent, opacity: 0.35, animation: \`toastTimer \${duration}ms linear forwards\` }} /></div>}
    </div>
  );
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);
  const add = (t: Omit<ToastItem, "id">) => { const id = ++nextId.current; setToasts((prev) => [{ ...t, id }, ...prev].slice(0, 5)); };
  const remove = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));
  const ToastContainer = () => (
    <div style={{ position: "fixed", top: 16, right: 16, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8, pointerEvents: "none" }}>
      <style>{\`@keyframes toastTimer{from{width:100%}to{width:0%}}\`}</style>
      {toasts.map((t) => <div key={t.id} style={{ pointerEvents: "auto" }}><Toast {...t} onClose={remove} /></div>)}
    </div>
  );
  return { addToast: add, ToastContainer };
}

// Usage:
// function App() {
//   const { addToast, ToastContainer } = useToast();
//   return (
//     <>
//       <ToastContainer />
//       <button onClick={() => addToast({ variant: "sucesso", title: "Salvo!", message: "Registro salvo.", duration: 5000 })}>
//         Salvar
//       </button>
//     </>
//   );
// }
`;

/* ═══════════════════════════════════════════ COPYABLE HELPERS ═══════════════════════════════════════════ */
function toastCode(variant: string, title: string, message: string, extra = '') {
  const colorMap: Record<string, { bg: string; border: string; color: string; accent: string }> = {
    sucesso: { bg: "#ECFDF5", border: "#A7F3D0", color: "#00904C", accent: "#00C64C" },
    erro: { bg: "#FEF2F2", border: "#FECACA", color: "#B91C1C", accent: "#DC3545" },
    atencao: { bg: "#FFF7ED", border: "#FDBA74", color: "#C2410C", accent: "#F6921E" },
    info: { bg: "#D3E3F4", border: "#93BDE4", color: "#002A68", accent: "#004B9B" },
    neutro: { bg: "#F2F4F8", border: "#E2E8F0", color: "#333B41", accent: "#7B8C96" },
  };
  const v = colorMap[variant] || colorMap.info;
  const hasAction = extra.includes('actionLabel');
  const actionLabel = extra.match(/"([^"]+)"/)?.[1] || 'Ação';
  return `// DS-FIPS — Toast "${variant}" — Copy-paste ready
import { useState, useEffect, useRef } from "react";

export function ToastExample() {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);

  const addToast = () => {
    const id = ++nextId.current;
    setToasts((prev) => [{ id, out: false }, ...prev].slice(0, 5));
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.map((t) => t.id === id ? { ...t, out: true } : t));
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 300);
  };

  return (
    <>
      <style>{\`@keyframes toastTimer{from{width:100%}to{width:0%}}\`}</style>
      <button onClick={addToast}
        style={{ padding: "8px 18px", fontSize: 12, fontWeight: 600, background: "${v.accent}", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontFamily: "'Open Sans', sans-serif" }}>
        Disparar Toast
      </button>
      <div style={{ position: "fixed", top: 16, right: 16, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8 }}>
        {toasts.map((t) => (
          <ToastItem key={t.id} id={t.id} out={t.out} onClose={removeToast} />
        ))}
      </div>
    </>
  );
}

function ToastItem({ id, out, onClose }) {
  const timerId = useRef(null);
  useEffect(() => {
    timerId.current = setTimeout(() => onClose(id), 5000);
    return () => { if (timerId.current) clearTimeout(timerId.current); };
  }, [id, onClose]);

  return (
    <div style={{ background: "${v.bg}", border: "1px solid ${v.border}", borderRadius: 10, borderLeft: "4px solid ${v.accent}", padding: "12px 16px", width: 360, maxWidth: "calc(100vw - 32px)", boxShadow: "0 4px 20px rgba(0,0,0,.1)", display: "flex", gap: 12, alignItems: "center", position: "relative", overflow: "hidden", opacity: out ? 0 : 1, transform: out ? "translateX(110%)" : "translateX(0)", transition: "all .3s ease" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "${v.color}", fontFamily: "'Open Sans', sans-serif", marginBottom: 2 }}>${title}</div>
        <div style={{ fontSize: 12, color: "${v.color}", fontFamily: "'Open Sans', sans-serif", opacity: 0.85, lineHeight: 1.4 }}>${message}</div>${hasAction ? `
        <button onClick={() => onClose(id)}
          style={{ marginTop: 6, padding: "3px 10px", fontSize: 11, fontWeight: 700, color: "${v.accent}", background: "transparent", border: "1px solid ${v.accent}", borderRadius: 4, cursor: "pointer", fontFamily: "'Open Sans', sans-serif" }}>${actionLabel}</button>` : ''}
      </div>
      <span onClick={() => onClose(id)} style={{ display: "flex", cursor: "pointer", opacity: 0.5, flexShrink: 0 }}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="${v.color}" strokeWidth="1.8" strokeLinecap="round"/></svg>
      </span>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3 }}>
        <div style={{ height: 3, background: "${v.accent}", opacity: 0.35, animation: "toastTimer 5000ms linear forwards" }} />
      </div>
    </div>
  );
}`;
}

/* ═══════════════════════════════════════════ MAIN ═══════════════════════════════════════════ */
export default function ToastDoc(){
  const [w,setW]=useState(typeof window!=="undefined"?window.innerWidth:1200);
  useEffect(()=>{const h=()=>setW(window.innerWidth);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h)},[]);
  const mob=w<640;

  const [toasts,setToasts]=useState([]);
  const nextId=useRef(0);
  const addToast=(t)=>{const id=++nextId.current;setToasts(prev=>[{...t,id},...prev].slice(0,5))};
  const removeToast=(id)=>{setToasts(prev=>prev.filter(t=>t.id!==id))};

  return(
    <PlaygroundProvider>
    <div style={{minHeight:"100vh",background:"var(--color-surface-muted)",fontFamily:Fn.body,color:C.cinzaEscuro}}>
      <style>{`
@keyframes toastSlideIn{from{transform:translateX(110%);opacity:0}to{transform:translateX(0);opacity:1}}
        @keyframes toastTimer{from{width:100%}to{width:0%}}
      `}</style>

      {/* LIVE TOAST STACK */}
      <div style={{position:"fixed",top:16,right:16,zIndex:9999,display:"flex",flexDirection:"column",gap:8,pointerEvents:"none"}}>
        {toasts.map(t=><div key={t.id} style={{pointerEvents:"auto"}}><LiveToast {...t} onClose={removeToast}/></div>)}
      </div>

      {/* HEADER */}
      <header style={{background:`linear-gradient(135deg,${C.azulProfundo} 0%,${C.azulEscuro} 100%)`,padding:mob?"32px 20px":"48px 40px 44px",position:"relative",overflow:"hidden"}}>
        <JunctionLines style={{position:"absolute",top:-10,right:-20,width:mob?250:400,height:250}}/>
        <div style={{position:"relative"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:6,background:`${C.branco}10`,border:`1px solid ${C.branco}18`,borderRadius:20,padding:"5px 14px",fontSize:11,fontWeight:600,letterSpacing:"1.5px",textTransform:"uppercase",color:C.amareloOuro,fontFamily:Fn.title,marginBottom:16}}>{Ic.grid(14,C.amareloOuro)} Design System FIPS</div>
          <h1 style={{fontSize:mob?30:44,fontWeight:700,color:C.branco,margin:"0 0 10px",fontFamily:Fn.title}}>Toast</h1>
          <p style={{fontSize:16,color:`${C.branco}B0`,lineHeight:1.6,maxWidth:700,margin:0,fontFamily:Fn.body}}>Notificações temporárias para feedback de ações. Aparecem no canto superior direito, auto-dismiss com timer visual e empilhamento inteligente.</p>
        </div>
      </header>

      <div style={{padding:mob?"24px 16px 40px":"36px 40px 60px",maxWidth:1100,margin:"0 auto"}}>

        {/* 01 — PLAYGROUND */}
        <Section n="01" title="Playground interativo" desc="Clique nos botões para disparar toasts reais no canto superior direito. Timer visual, empilhamento até 5, X para fechar.">
          <DSCard mob={mob}>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              <Btn label="✓ Sucesso" color={C.verdeFloresta} onClick={()=>addToast({variant:"sucesso",title:"Salvo com sucesso",message:"Requisição #4025 aprovada e encaminhada.",duration:5000})}/>
              <Btn label="✕ Erro" color={C.danger} onClick={()=>addToast({variant:"erro",title:"Erro ao salvar",message:"Falha de conexão com o servidor.",duration:7000})}/>
              <Btn label="⚠ Atenção" color={C.amareloEscuro} onClick={()=>addToast({variant:"atencao",title:"Sessão expirando",message:"Você será desconectado em 5 min.",duration:6000,actionLabel:"Renovar"})}/>
              <Btn label="ℹ Info" color={C.azulProfundo} onClick={()=>addToast({variant:"info",title:"Novo registro",message:"Fornecedor cadastrado por Carlos Santos.",duration:5000})}/>
              <Btn label="● Neutro" color={C.cinzaChumbo} onClick={()=>addToast({variant:"neutro",title:"Sincronizado",message:"47 registros atualizados.",duration:4000})}/>
              <Btn label="+ Com ação" color={C.azulEscuro} onClick={()=>addToast({variant:"info",title:"Registro excluído",message:"Fornecedor removido da lista.",duration:8000,actionLabel:"Desfazer"})}/>
            </div>
            <p style={{fontSize:11,color:C.textMuted,marginTop:12}}>Toasts aparecem no canto superior direito. X fecha imediatamente. Barra de timer diminui até auto-dismiss.</p>
          </DSCard>
        </Section>

        {/* 02 — VARIANTES */}
        <Section n="02" title="Variantes" desc="Cinco variantes semânticas com cor de fundo, borda lateral, ícone e timer. Clique em qualquer toast para copiar o código.">
          <div style={{display:"flex",flexDirection:"column",gap:12,maxWidth:420}}>
            <Copyable label="Toast Sucesso" code={toastCode("sucesso","Salvo com sucesso","Requisição #4025 aprovada e encaminhada para compra.")} preview={<ToastPreview variant="sucesso" title="Salvo com sucesso" message="Requisição #4025 aprovada e encaminhada para compra."/>}>
              <ToastPreview variant="sucesso" title="Salvo com sucesso" message="Requisição #4025 aprovada e encaminhada para compra."/>
            </Copyable>
            <Copyable label="Toast Erro" code={toastCode("erro","Erro ao salvar","Não foi possível conectar ao servidor. Tente novamente.")} preview={<ToastPreview variant="erro" title="Erro ao salvar" message="Não foi possível conectar ao servidor. Tente novamente." timer={85}/>}>
              <ToastPreview variant="erro" title="Erro ao salvar" message="Não foi possível conectar ao servidor. Tente novamente." timer={85}/>
            </Copyable>
            <Copyable label="Toast Atenção" code={toastCode("atencao","Sessão expirando","Sua sessão expira em 5 minutos.",'\n        actionLabel: "Renovar",')} preview={<ToastPreview variant="atencao" title="Sessão expirando" message="Sua sessão expira em 5 minutos." actionLabel="Renovar" timer={40}/>}>
              <ToastPreview variant="atencao" title="Sessão expirando" message="Sua sessão expira em 5 minutos." actionLabel="Renovar" timer={40}/>
            </Copyable>
            <Copyable label="Toast Info" code={toastCode("info","Novo registro","Fornecedor 'Brado Logística' cadastrado por Carlos Santos.")} preview={<ToastPreview variant="info" title="Novo registro" message="Fornecedor 'Brado Logística' cadastrado por Carlos Santos." timer={55}/>}>
              <ToastPreview variant="info" title="Novo registro" message="Fornecedor 'Brado Logística' cadastrado por Carlos Santos." timer={55}/>
            </Copyable>
            <Copyable label="Toast Neutro" code={toastCode("neutro","Dados sincronizados","Último sync: agora. 47 registros atualizados.")} preview={<ToastPreview variant="neutro" title="Dados sincronizados" message="Último sync: agora. 47 registros atualizados." timer={30}/>}>
              <ToastPreview variant="neutro" title="Dados sincronizados" message="Último sync: agora. 47 registros atualizados." timer={30}/>
            </Copyable>
          </div>
        </Section>

        {/* 03 — GUIA */}
        <Section n="03" title="Guia de uso por variante" desc="Significado, timer e exemplos FIPS para cada tipo de toast.">
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:16}}>
            {[
              {name:"Sucesso",c:C.verdeFloresta,desc:"Confirmação positiva. Verde com check.",when:"Salvar, aprovar, excluir, cadastrar. Toda ação que completou.",timer:"5s. Sem ação necessária.",ex:"'Requisição aprovada'; 'Cadastro salvo'; 'Documento enviado'."},
              {name:"Erro",c:C.danger,desc:"Falha na ação. Vermelho com X. Atenção imediata.",when:"Falha de conexão, erro no servidor, timeout, permissão negada.",timer:"7s. Mensagem clara sobre o que falhou.",ex:"'Erro ao salvar'; 'Falha de conexão'; 'Permissão insuficiente'."},
              {name:"Atenção",c:C.amareloEscuro,desc:"Alerta preventivo. Laranja com triângulo.",when:"Sessão expirando, prazo próximo, dado desatualizado.",timer:"6s ou com CTA. Pode incluir 'Renovar sessão'.",ex:"'Sessão expirando'; 'Prazo em 24h'; 'Dados desatualizados'."},
              {name:"Info",c:C.azulProfundo,desc:"Informação neutra. Azul com (i). Sem urgência.",when:"Novo registro por outro usuário, atualização de fundo.",timer:"5s. Informativo apenas.",ex:"'Novo fornecedor cadastrado'; 'Relatório gerado'."},
              {name:"Neutro",c:C.cinzaChumbo,desc:"Feedback genérico. Cinza discreto.",when:"Sincronização, confirmação menor, status de sistema.",timer:"4s. Rápido e discreto.",ex:"'Dados sincronizados'; 'Preferências salvas'."},
              {name:"Com ação",c:C.azulEscuro,desc:"Toast com botão CTA. Permite desfazer ou agir.",when:"Exclusão com undo, ação reversível, convite para fluxo.",timer:"8s+. Dar tempo para clicar.",ex:"'Registro excluído — Desfazer'; 'Rascunho salvo — Editar'."},
            ].map(t=>(
              <div key={t.name} style={{...gc,borderLeft:`4px solid ${t.c}`}}>
                <div style={gh}><span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>{t.name}</span></div>
                <div style={gb}>
                  <p style={gt}>{t.desc}</p>
                  <div style={gl}>Quando usar</div><p style={gt}>{t.when}</p>
                  <div style={gl}>Timer</div><p style={gt}>{t.timer}</p>
                  <div style={gl}>Exemplo FIPS</div><p style={ge}>{t.ex}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* 04 — ANATOMIA */}
        <Section n="04" title="Anatomia e comportamento" desc="Estrutura visual e regras de comportamento do toast.">
          <DSCard mob={mob}>
            <div style={{display:"flex",gap:40,flexWrap:"wrap"}}>
              <div style={{flex:1,minWidth:280}}>
                <span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title,display:"block",marginBottom:12}}>Estrutura</span>
                {[
                  {l:"Borda lateral",v:"4px solid [cor variante]"},
                  {l:"Ícone",v:"18px — semântica da variante"},
                  {l:"Título",v:"Open Sans 700 13px"},
                  {l:"Mensagem",v:"Open Sans 400 12px, 85% opacity"},
                  {l:"Botão X",v:"14px — fecha imediatamente"},
                  {l:"Timer bar",v:"3px, 35% opacity, CSS animation"},
                  {l:"Ação",v:"Botão outline na cor da variante"},
                ].map(s=>(
                  <div key={s.l} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                    <div style={{width:6,height:6,borderRadius:"50%",background:C.azulProfundo,flexShrink:0}}/>
                    <span style={{fontSize:12,fontWeight:600,color:C.cinzaEscuro,fontFamily:Fn.body,minWidth:90}}>{s.l}</span>
                    <span style={{fontSize:11,color:C.cinzaChumbo,fontFamily:Fn.body}}>{s.v}</span>
                  </div>
                ))}
              </div>
              <div style={{flex:1,minWidth:250}}>
                <span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title,display:"block",marginBottom:12}}>Comportamento</span>
                {[
                  {l:"Posição",v:"Fixed, top-right (16px)"},
                  {l:"Entrada",v:"slideIn da direita, .35s ease"},
                  {l:"Saída",v:"slideOut + fade, .3s ease"},
                  {l:"Auto-dismiss",v:"Timer CSS (não bloqueia render)"},
                  {l:"Stack máximo",v:"5 toasts, novos no topo"},
                  {l:"Largura",v:"360px (max 100vw - 32px)"},
                  {l:"z-index",v:"9999"},
                  {l:"Sombra",v:"0 4px 20px rgba(0,0,0,.1)"},
                ].map(s=>(
                  <div key={s.l} style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:6}}>
                    <code style={{background:`${C.amareloOuro}30`,color:C.amareloEscuro,padding:"2px 8px",borderRadius:4,fontSize:10,fontFamily:Fn.mono,fontWeight:600,minWidth:80,textAlign:"center",flexShrink:0}}>{s.l}</code>
                    <span style={{fontSize:12,color:C.cinzaEscuro,fontFamily:Fn.body}}>{s.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </DSCard>
        </Section>

        {/* 05 — CENÁRIOS */}
        <Section n="05" title="Cenários de negócio" desc="Exemplos reais de toasts nos apps FIPS.">
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:16}}>
            <div style={{background:C.bg,border:`1px solid ${C.cardBorder}`,borderRadius:"10px 10px 10px 20px",padding:mob?16:24}}>
              <h3 style={{fontSize:14,fontWeight:700,color:C.cinzaEscuro,margin:"0 0 4px",fontFamily:Fn.title}}>App Suprimentos</h3>
              <p style={{fontSize:12,color:C.cinzaChumbo,margin:"0 0 16px"}}>Aprovação de requisição</p>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <ToastPreview variant="sucesso" title="Requisição aprovada" message="REQ-4025 encaminhada para compra. Prazo: 15 dias."/>
                <ToastPreview variant="erro" title="Erro ao aprovar" message="REQ-4026 sem orçamento disponível." timer={90}/>
              </div>
            </div>
            <div style={{background:C.bg,border:`1px solid ${C.cardBorder}`,borderRadius:"10px 10px 10px 20px",padding:mob?16:24}}>
              <h3 style={{fontSize:14,fontWeight:700,color:C.cinzaEscuro,margin:"0 0 4px",fontFamily:Fn.title}}>App Ocorrências</h3>
              <p style={{fontSize:12,color:C.cinzaChumbo,margin:"0 0 16px"}}>Gestão SSMA</p>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <ToastPreview variant="atencao" title="Ocorrência crítica" message="Vazamento junção 47-B. Equipe acionada." actionLabel="Ver detalhes" timer={45}/>
                <ToastPreview variant="info" title="Inspeção concluída" message="Pátio 12 finalizado por Ana Costa."/>
              </div>
            </div>
            <div style={{background:C.bg,border:`1px solid ${C.cardBorder}`,borderRadius:"10px 10px 10px 20px",padding:mob?16:24}}>
              <h3 style={{fontSize:14,fontWeight:700,color:C.cinzaEscuro,margin:"0 0 4px",fontFamily:Fn.title}}>App Ideias</h3>
              <p style={{fontSize:12,color:C.cinzaChumbo,margin:"0 0 16px"}}>Fipcoins e submissões</p>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <ToastPreview variant="sucesso" title="+50 Fipcoins!" message="Ideia 'Automação do pátio' aprovada."/>
                <ToastPreview variant="info" title="Nova ideia" message="Carlos Santos enviou 'Drone para trilhos'."/>
              </div>
            </div>
            <div style={{background:C.bg,border:`1px solid ${C.cardBorder}`,borderRadius:"10px 10px 10px 20px",padding:mob?16:24}}>
              <h3 style={{fontSize:14,fontWeight:700,color:C.cinzaEscuro,margin:"0 0 4px",fontFamily:Fn.title}}>Sistema geral</h3>
              <p style={{fontSize:12,color:C.cinzaChumbo,margin:"0 0 16px"}}>Sessão e sincronização</p>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <ToastPreview variant="atencao" title="Sessão expirando" message="Desconexão em 5 min." actionLabel="Renovar" timer={35}/>
                <ToastPreview variant="neutro" title="Sincronizado" message="47 registros atualizados." timer={20}/>
              </div>
            </div>
          </div>
        </Section>

        {/* 06 — TIMERS */}
        <Section n="06" title="Duração por variante" desc="Timer recomendado para cada tipo de toast.">
          <DSCard mob={mob}>
            <div style={{display:"grid",gridTemplateColumns:mob?"1fr 1fr":"repeat(5, 1fr)",gap:12}}>
              {[
                {v:"Sucesso",t:"5s",c:C.verdeFloresta,d:"Rápido. Sem ação."},
                {v:"Erro",t:"7s",c:C.danger,d:"Mais tempo para ler."},
                {v:"Atenção",t:"6s",c:C.amareloEscuro,d:"Pode ter CTA."},
                {v:"Info",t:"5s",c:C.azulProfundo,d:"Informativo."},
                {v:"Neutro",t:"4s",c:C.cinzaChumbo,d:"Rápido e discreto."},
              ].map(d=>(
                <div key={d.v} style={{textAlign:"center",padding:16,background:C.bg,borderRadius:8,borderTop:`3px solid ${d.c}`}}>
                  <span style={{fontSize:24,fontWeight:700,color:d.c,fontFamily:Fn.mono,display:"block"}}>{d.t}</span>
                  <span style={{fontSize:12,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title,display:"block",marginTop:4}}>{d.v}</span>
                  <span style={{fontSize:11,color:C.cinzaChumbo,fontFamily:Fn.body,marginTop:4,display:"block"}}>{d.d}</span>
                </div>
              ))}
            </div>
            <div style={{marginTop:16,background:`${C.azulCeuClaro}40`,border:`1px solid ${C.azulCeuClaro}`,borderRadius:8,padding:"12px 16px",display:"flex",gap:10,alignItems:"center"}}>
              <div style={{width:18,height:18,borderRadius:"50%",background:C.azulProfundo,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{color:C.branco,fontSize:11,fontWeight:700}}>i</span></div>
              <span style={{fontSize:12,color:C.cinzaChumbo,fontFamily:Fn.body}}>Toasts com ação: <strong>8s+</strong>. Erros críticos: <strong>sem auto-dismiss</strong> (só X).</span>
            </div>
          </DSCard>
        </Section>

        {/* 07 — TOKENS */}
        <Section n="07" title="Tokens de referência" desc="Valores de design do componente Toast.">
          <DSCard mob={mob} s={{display:"flex",gap:mob?24:48,flexWrap:"wrap"}}>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:Fn.title,marginBottom:4}}>Cores de fundo</span>
              <TokenRow label="Sucesso" value="#ECFDF5" color="#ECFDF5"/>
              <TokenRow label="Erro" value="#FEF2F2" color="#FEF2F2"/>
              <TokenRow label="Atenção" value="#FFF7ED" color="#FFF7ED"/>
              <TokenRow label="Info" value="#D3E3F4" color={C.azulCeuClaro}/>
              <TokenRow label="Neutro" value="#F2F4F8" color={C.bg}/>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:Fn.title,marginBottom:4}}>Borda lateral</span>
              <TokenRow label="Sucesso" value="#00C64C" color={C.verdeFloresta}/>
              <TokenRow label="Erro" value="#DC3545" color={C.danger}/>
              <TokenRow label="Atenção" value="#F6921E" color={C.amareloEscuro}/>
              <TokenRow label="Info" value="#004B9B" color={C.azulProfundo}/>
              <TokenRow label="Largura" value="4px"/>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:Fn.title,marginBottom:4}}>Dimensões</span>
              <TokenRow label="Largura" value="360px"/>
              <TokenRow label="Padding" value="12px 16px"/>
              <TokenRow label="Border radius" value="10px"/>
              <TokenRow label="Timer bar" value="3px"/>
              <TokenRow label="Max stack" value="5"/>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:Fn.title,marginBottom:4}}>Tipografia</span>
              <TokenRow label="Título" value="Open Sans 700 13px"/>
              <TokenRow label="Mensagem" value="Open Sans 400 12px"/>
              <TokenRow label="Botão ação" value="Open Sans 700 11px"/>
              <TokenRow label="Ícone" value="18px"/>
              <TokenRow label="X (fechar)" value="14px"/>
            </div>
          </DSCard>
        </Section>

        {/* 08 — MODO DARK */}
        <Section n="08" title="Modo Dark" desc="Tokens e comportamento do componente no tema escuro. Consistência visual garantida em ambos os modos.">
          <div style={{background:C.cardBg,borderRadius:"10px 10px 10px 18px",border:`1px solid ${C.cardBorder}`,padding:mob?16:24}}>
            <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:12}}>
              {[
                {token:"Sucesso bg",light:"#ECFDF5",dark:"#0D2818"},
                {token:"Sucesso border",light:"#A7F3D0",dark:"#166534"},
                {token:"Erro bg",light:"#FEF2F2",dark:"#2A1215"},
                {token:"Erro border",light:"#FECACA",dark:"#7F1D1D"},
                {token:"Atenção bg",light:"#FFF7ED",dark:"#2A1F0E"},
                {token:"Atenção border",light:"#FDBA74",dark:"#92400E"},
                {token:"Info bg",light:"#D3E3F4",dark:"#0F1F33"},
                {token:"Info border",light:"#93BDE4",dark:"#1E3A5F"},
                {token:"Neutro bg",light:"#F2F4F8",dark:"#1A2332"},
                {token:"Text color",light:"var(--color-fg)",dark:"#D1D9E0"},
                {token:"Timer bar",light:"35% opacity",dark:"45% opacity"},
                {token:"Shadow",light:"rgba(0,0,0,0.1)",dark:"rgba(0,0,0,0.35)"},
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
          </div>
        </Section>

        <CodePlayground />

        <CodeExportSection items={[{
          label: "Toast Notification",
          description: "Notificacoes temporarias com variantes semanticas, timer visual, empilhamento e hook useToast.",
          code: toastExportCode,
        }]} />

        <div style={{textAlign:"center",padding:"20px 0 0",borderTop:`1px solid ${C.cardBorder}`,marginTop:20}}>
          <span style={{fontSize:12,color:C.cinzaChumbo,letterSpacing:".5px",fontFamily:Fn.title,fontWeight:400}}>DS-FIPS v2.0 · Ferrovia Interna do Porto de Santos · Excelência sobre trilhos · {new Date().getFullYear()}</span>
        </div>
      </div>
    </div>
    </PlaygroundProvider>
  );
}
