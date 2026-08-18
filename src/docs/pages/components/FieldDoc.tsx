import { useState, useRef } from "react";
import { CodeExportSection } from '../../components/CodeExport';
import { PlaygroundProvider, Copyable, CodePlayground } from '../../components/CodePlayground';

/* ═══════════════════════════════════════════
   FIPS DESIGN SYSTEM — BRAND TOKENS
   ═══════════════════════════════════════════ */
const C = {
  azulProfundo:"var(--color-gov-azul-profundo)", azulEscuro:"var(--color-gov-azul-escuro)", azulClaro:"var(--color-gov-azul-claro)",
  cinzaChumbo:"var(--color-fg-muted)", cinzaEscuro:"var(--color-fg)", cinzaClaro:"#C0CCD2",
  azulCeu:"#93BDE4", azulCeuClaro:"#D3E3F4",
  amareloOuro:"#FDC24E", amareloEscuro:"#F6921E",
  verdeFloresta:"#00C64C", verdeEscuro:"#00904C",
  danger:"#DC3545", dangerDark:"#C82333", dangerBg:"#FEF2F2",
  neutro:"var(--color-surface-soft)", branco:"#FFFFFF",
  bg:"var(--color-surface-muted)", cardBg:"var(--color-surface)", cardBorder:"var(--color-border)",
  textMuted:"var(--color-fg-muted)", textLight:"var(--color-fg-muted)",
  inputBorder:"var(--color-border)", inputBg:"var(--color-surface)", inputBgDisabled:"var(--color-surface-muted)",
  focusRing:"rgba(147,189,228,0.35)",
};
const F = { title:"'Saira Expanded',sans-serif", body:"'Open Sans',sans-serif", mono:"'Fira Code',monospace" };

/* ═══════════════════════════════════════════ ICONS ═══════════════════════════════════════════ */
const I = {
  pessoa:(s:number=16,c:string=C.cinzaChumbo)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><circle cx="10" cy="6" r="3.5" stroke={c} strokeWidth="1.5"/><path d="M3 17.5c0-3.5 3-5.5 7-5.5s7 2 7 5.5" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>,
  email:(s:number=16,c:string=C.cinzaChumbo)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><rect x="2" y="4" width="16" height="12" rx="2" stroke={c} strokeWidth="1.5"/><path d="M2 6l8 5 8-5" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  busca:(s:number=16,c:string=C.cinzaChumbo)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><circle cx="9" cy="9" r="5.5" stroke={c} strokeWidth="1.5"/><path d="M13.5 13.5L17 17" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>,
  calendario:(s:number=16,c:string=C.cinzaChumbo)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><rect x="2.5" y="3.5" width="15" height="14" rx="2" stroke={c} strokeWidth="1.5"/><path d="M2.5 8h15M7 2v3M13 2v3" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>,
  cadeado:(s:number=16,c:string=C.cinzaChumbo)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><rect x="4" y="9" width="12" height="8" rx="2" stroke={c} strokeWidth="1.5"/><path d="M7 9V6a3 3 0 016 0v3" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>,
  telefone:(s:number=16,c:string=C.cinzaChumbo)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M3 4.5A1.5 1.5 0 014.5 3h2.2a1 1 0 01.95.68l.8 2.4a1 1 0 01-.36 1.1l-1.2.9a10 10 0 004.9 4.9l.9-1.2a1 1 0 011.1-.36l2.4.8a1 1 0 01.68.95v2.2a1.5 1.5 0 01-1.5 1.5C8.5 16.9 3.1 11.5 3 4.5z" stroke={c} strokeWidth="1.5"/></svg>,
  documento:(s:number=16,c:string=C.cinzaChumbo)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M6 2h6l5 5v10a1 1 0 01-1 1H6a1 1 0 01-1-1V3a1 1 0 011-1z" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/><path d="M12 2v5h5M8 11h4M8 14h6" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>,
  placa:(s:number=16,c:string=C.cinzaChumbo)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><rect x="2" y="5" width="16" height="10" rx="2" stroke={c} strokeWidth="1.5"/><path d="M6 5v10M14 5v10M2 10h16" stroke={c} strokeWidth="1.2" opacity=".4"/></svg>,
  moeda:(s:number=16,c:string=C.cinzaChumbo)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke={c} strokeWidth="1.5"/><path d="M10 5v10M7.5 7.5h3.75a1.75 1.75 0 010 3.5H7.5h4a1.5 1.5 0 010 3H7.5" stroke={c} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  olhoOn:(s:number=16,c:string=C.cinzaChumbo)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M2 10s3.5-5 8-5 8 5 8 5-3.5 5-8 5-8-5-8-5z" stroke={c} strokeWidth="1.5"/><circle cx="10" cy="10" r="2.5" stroke={c} strokeWidth="1.5"/></svg>,
  olhoOff:(s:number=16,c:string=C.cinzaChumbo)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M2 10s3.5-5 8-5 8 5 8 5-3.5 5-8 5-8-5-8-5z" stroke={c} strokeWidth="1.5"/><path d="M4 4l12 12" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>,
  limpar:(s:number=14,c:string=C.cinzaChumbo)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M6 6l8 8M14 6l-8 8" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>,
  dropdown:(s:number=16,c:string=C.cinzaChumbo)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M6 8l4 4 4-4" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  save:(s:number=14,c:string="#fff")=><svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M13 1H3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V4l-2-3z" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/><path d="M5 1v4h6V1" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/><rect x="4" y="9" width="8" height="4" rx=".5" stroke={c} strokeWidth="1.5"/></svg>,
  grid:(s:number=16,c:string=C.cinzaChumbo)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><rect x="2" y="2" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/><rect x="11" y="2" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/><rect x="2" y="11" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/><rect x="11" y="11" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/></svg>,
  alerta:(s:number=16,c:string=C.amareloEscuro)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M10 2L1.5 17h17L10 2z" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/><path d="M10 8v4M10 14v.5" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>,
};

/* ═══════════════════════════════════════════ JUNCTION LINES ═══════════════════════════════════════════ */
function JunctionLines({style}:{style?:React.CSSProperties}){return <svg viewBox="0 0 320 200" fill="none" style={{opacity:.12,...style}}><path d="M0 60H100C120 60 120 60 140 40L200 40H320" stroke="var(--color-junction-stroke)" strokeWidth="6" strokeLinecap="round"/><path d="M0 60H100C120 60 120 60 140 80L200 80H320" stroke="var(--color-junction-stroke)" strokeWidth="6" strokeLinecap="round"/><path d="M0 120H60C80 120 80 120 100 100L160 100H320" stroke="var(--color-junction-stroke)" strokeWidth="6" strokeLinecap="round"/><path d="M0 120H60C80 120 80 120 100 140L160 140H320" stroke="var(--color-junction-stroke)" strokeWidth="6" strokeLinecap="round"/><path d="M0 170H320" stroke="var(--color-junction-stroke)" strokeWidth="6" strokeLinecap="round"/><path d="M0 20H320" stroke="var(--color-junction-stroke)" strokeWidth="6" strokeLinecap="round"/></svg>}

/* ═══════════════════════════════════════════ FIELD INPUT ═══════════════════════════════════════════ */
function FInput({label,placeholder,icon,iconRight,required,error,errorMsg,disabled,readOnly,helper,compact,value:cv,onChange,onClear,showToggle,size="desktop",cols}:{label?:string,placeholder?:string,icon?:React.ReactNode,iconRight?:React.ReactNode,required?:boolean,error?:boolean,errorMsg?:string,disabled?:boolean,readOnly?:boolean,helper?:string,compact?:boolean,value?:string,onChange?:(v:string)=>void,onClear?:()=>void,showToggle?:boolean,size?:string,cols?:number}){
  const [focused,setFocused]=useState(false);const [val,setVal]=useState(cv||"");const [showPw,setShowPw]=useState(false);const ref=useRef<HTMLInputElement>(null);
  const sm={desktop:{h:35,fs:13},mobile:{h:42,fs:14},compact:{h:30,fs:12}};const sz=compact?sm.compact:sm[size as keyof typeof sm]||sm.desktop;
  const dv=cv!==undefined?cv:val;
  const bc=error?C.danger:focused?C.azulProfundo:C.inputBorder;
  const bg=disabled?C.inputBgDisabled:C.inputBg;
  const sh=focused&&!error?`0 0 0 3px ${C.focusRing}`:error&&focused?`0 0 0 3px ${C.dangerBg}`:"none";
  const wrap={display:"flex",alignItems:"center",gap:8,height:sz.h,padding:"0 12px",background:bg,border:`1.5px solid ${bc}`,borderRadius:8,transition:"all .18s",boxShadow:sh,cursor:disabled?"not-allowed":"text",fontFamily:F.body,fontSize:sz.fs};
  const inp={flex:1,border:"none",outline:"none",background:"transparent",fontFamily:F.body,fontSize:sz.fs,color:disabled?C.cinzaChumbo:C.cinzaEscuro,cursor:disabled?"not-allowed":"text",minWidth:0};
  return(
    <div style={{display:"flex",flexDirection:"column",minWidth:0,gridColumn:cols?`span ${cols}`:undefined}}>
      {label&&<label style={{fontSize:compact?11:12,fontWeight:600,color:C.cinzaEscuro,fontFamily:F.body,marginBottom:1,marginLeft:7,display:"flex",alignItems:"center",gap:3}}>{label}{required&&<span style={{color:C.danger,fontWeight:700,fontSize:14}}>*</span>}</label>}
      <div style={wrap} onClick={()=>!disabled&&ref.current?.focus()}>
        {icon&&<span style={{display:"flex",flexShrink:0,opacity:disabled?.4:.55}}>{icon}</span>}
        <input ref={ref} type={showToggle?(showPw?"text":"password"):("text")} placeholder={placeholder} value={dv} onChange={e=>{setVal(e.target.value);onChange?.(e.target.value)}} onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)} disabled={disabled} readOnly={readOnly} style={inp}/>
        {onClear&&dv&&!disabled&&<span style={{display:"flex",cursor:"pointer",opacity:.45,flexShrink:0}} onClick={e=>{e.stopPropagation();setVal("");onClear?.()}}>{I.limpar(14)}</span>}
        {showToggle&&<span style={{display:"flex",cursor:"pointer",opacity:.45,flexShrink:0}} onClick={e=>{e.stopPropagation();setShowPw(!showPw)}}>{showPw?I.olhoOff(16):I.olhoOn(16)}</span>}
        {iconRight&&!showToggle&&!onClear&&<span style={{display:"flex",flexShrink:0,opacity:disabled?.4:.55}}>{iconRight}</span>}
      </div>
      {(helper||(error&&errorMsg))&&<span style={{fontSize:11,color:error?C.danger:C.textMuted,marginTop:3,marginLeft:7,fontFamily:F.body,lineHeight:1.3}}>{error?errorMsg:helper}</span>}
    </div>
  );
}
function FSelect({label,icon,options=[],value,disabled,compact,cols}:{label?:string,icon?:React.ReactNode,options?:string[],value?:string,disabled?:boolean,compact?:boolean,cols?:number}){
  const h=compact?30:35;
  return(
    <div style={{display:"flex",flexDirection:"column",minWidth:0,gridColumn:cols?`span ${cols}`:undefined}}>
      {label&&<label style={{fontSize:compact?11:12,fontWeight:600,color:C.cinzaEscuro,fontFamily:F.body,marginBottom:1,marginLeft:7}}>{label}</label>}
      <div style={{display:"flex",alignItems:"center",gap:8,height:h,padding:"0 12px",borderRadius:8,border:`1.5px solid ${C.inputBorder}`,background:disabled?C.inputBgDisabled:C.inputBg,fontFamily:F.body,fontSize:compact?12:13,opacity:disabled?.6:1}}>
        {icon&&<span style={{display:"flex",flexShrink:0,opacity:.55}}>{icon}</span>}
        <select style={{flex:1,border:"none",outline:"none",background:"transparent",fontFamily:F.body,fontSize:compact?12:13,color:C.cinzaEscuro,cursor:"pointer",minWidth:0}} defaultValue={value} disabled={disabled}>{options.map(o=><option key={o}>{o}</option>)}</select>
        <span style={{display:"flex",flexShrink:0,opacity:.5,marginLeft:-4}}>{I.dropdown(16)}</span>
      </div>
    </div>
  );
}
function FTextarea({label,placeholder,rows=3,compact,cols}:{label?:string,placeholder?:string,rows?:number,compact?:boolean,cols?:number}){
  return(
    <div style={{display:"flex",flexDirection:"column",minWidth:0,gridColumn:cols?`span ${cols}`:undefined}}>
      {label&&<label style={{fontSize:compact?11:12,fontWeight:600,color:C.cinzaEscuro,fontFamily:F.body,marginBottom:1,marginLeft:7}}>{label}</label>}
      <textarea placeholder={placeholder} rows={rows} style={{padding:"8px 12px",borderRadius:8,border:`1.5px solid ${C.inputBorder}`,background:C.branco,fontFamily:F.body,fontSize:compact?12:13,color:C.cinzaEscuro,outline:"none",resize:"vertical",transition:"all .18s"}} onFocus={e=>{e.target.style.borderColor=C.azulProfundo;e.target.style.boxShadow=`0 0 0 3px ${C.focusRing}`}} onBlur={e=>{e.target.style.borderColor=C.inputBorder;e.target.style.boxShadow="none"}}/>
    </div>
  );
}

/* ═══════════════════════════════════════════ LAYOUT ═══════════════════════════════════════════ */
function Section({n,title,desc,children}:{n:string,title:string,desc:string,children:React.ReactNode}){return (
  <section style={{marginBottom:44}}><div style={{fontSize:10,fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",color:C.azulClaro,fontFamily:F.title,marginBottom:6}}>{n}</div><h2 style={{fontSize:20,fontWeight:700,color:C.cinzaEscuro,margin:"0 0 4px",fontFamily:F.title,letterSpacing:".5px"}}>{title}</h2><p style={{fontSize:14,color:C.cinzaChumbo,margin:"0 0 20px",lineHeight:1.55,fontFamily:F.body}}>{desc}</p>{children}</section>
);}
function Card({children,s}:{children:React.ReactNode,s?:React.CSSProperties}){return (
  <div style={{background:C.cardBg,borderRadius:"12px 12px 12px 24px",border:`1px solid ${C.cardBorder}`,padding:28,boxShadow:"0 1px 3px rgba(0,75,155,.04),0 4px 14px rgba(0,75,155,.03)",...s}}>{children}</div>
);}

const gc={background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:"10px 10px 10px 18px",overflow:"hidden"};
const gh={padding:"16px 20px",background:C.bg,borderBottom:`1px solid ${C.cardBorder}`,display:"flex",alignItems:"center",gap:12};
const gb={padding:"16px 20px 20px"};
const gl={fontSize:10,fontWeight:700,letterSpacing:"1.2px",textTransform:"uppercase",color:C.azulClaro,fontFamily:F.title,marginBottom:4,marginTop:12};
const gt={fontSize:13,color:C.cinzaEscuro,lineHeight:1.55,margin:0,fontFamily:F.body};
const ge={fontSize:12,color:C.cinzaChumbo,lineHeight:1.5,margin:0,fontFamily:F.body,fontStyle:"italic",paddingLeft:10,borderLeft:`2px solid ${C.azulCeuClaro}`};
const gk={fontSize:11,fontFamily:F.mono,color:C.cinzaChumbo,background:C.cardBg,padding:"2px 8px",borderRadius:4,border:`1px solid ${C.cardBorder}`};

function TokenRow({label,value,color}:{label:string,value:string,color?:string}){
  return (
    <div style={{display:"flex",alignItems:"center",gap:10,fontSize:12,fontFamily:F.body}}>{color&&<div style={{width:16,height:16,borderRadius:4,background:color,border:`1px solid ${C.cardBorder}`,flexShrink:0}}/>}<span style={{color:C.cinzaChumbo,minWidth:100}}>{label}</span><code style={{background:C.neutro,padding:"2px 8px",borderRadius:4,fontSize:11,fontFamily:F.mono,color:C.cinzaEscuro}}>{value}</code></div>
  );
}

const fieldExportCode = `// DS-FIPS — Field + FieldLabel + FieldHint — Copy-paste ready
import { useState, useRef } from "react";

const C = {
  azulProfundo: "#004B9B",
  azulEscuro: "#002A68",
  fg: "#333B41",
  fgMuted: "#7B8C96",
  surface: "#FFFFFF",
  surfaceMuted: "#F8FAFC",
  border: "#E2E8F0",
  branco: "#FFFFFF",
  danger: "#DC3545",
  dangerBg: "#FEF2F2",
  azulCeuClaro: "#D3E3F4",
  focusRing: "rgba(147,189,228,0.35)",
};

const Fn = {
  title: "'Saira Expanded', sans-serif",
  body: "'Open Sans', sans-serif",
  mono: "'Fira Code', monospace",
};

/* FieldLabel — label padrao do DS-FIPS */
export function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label style={{
      fontSize: 12, fontWeight: 600, color: C.fg,
      fontFamily: Fn.body, marginBottom: 1, marginLeft: 7,
      display: "flex", alignItems: "center", gap: 3,
    }}>
      {children}
      {required && <span style={{ color: C.danger, fontWeight: 700, fontSize: 14 }}>*</span>}
    </label>
  );
}

/* FieldHint — helper ou mensagem de erro */
export function FieldHint({ children, error }: { children: React.ReactNode; error?: boolean }) {
  return (
    <span style={{
      fontSize: 11, color: error ? C.danger : C.fgMuted,
      marginTop: 3, marginLeft: 7, fontFamily: Fn.body, lineHeight: 1.3,
    }}>
      {children}
    </span>
  );
}

/* Field — composicao label + input + hint */
interface FieldProps {
  label?: string;
  required?: boolean;
  error?: boolean;
  errorMsg?: string;
  helper?: string;
  children: React.ReactNode;
}

export function Field({ label, required, error, errorMsg, helper, children }: FieldProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
      {label && <FieldLabel required={required}>{label}</FieldLabel>}
      {children}
      {(helper || (error && errorMsg)) && (
        <FieldHint error={error}>{error ? errorMsg : helper}</FieldHint>
      )}
    </div>
  );
}

/* FieldInput — input padrao com icone e estados */
interface FieldInputProps {
  label?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  required?: boolean;
  error?: boolean;
  errorMsg?: string;
  disabled?: boolean;
  readOnly?: boolean;
  helper?: string;
  compact?: boolean;
  value?: string;
  onChange?: (v: string) => void;
}

export function FieldInput({ label, placeholder, icon, required, error, errorMsg, disabled, readOnly, helper, compact, value: cv, onChange }: FieldInputProps) {
  const [focused, setFocused] = useState(false);
  const [val, setVal] = useState(cv || "");
  const ref = useRef<HTMLInputElement>(null);
  const h = compact ? 30 : 35;
  const fs = compact ? 12 : 13;
  const dv = cv !== undefined ? cv : val;
  const bc = error ? C.danger : focused ? C.azulProfundo : C.border;
  const bg = disabled ? C.surfaceMuted : C.surface;
  const sh = focused && !error ? \`0 0 0 3px \${C.focusRing}\` : error && focused ? \`0 0 0 3px \${C.dangerBg}\` : "none";

  return (
    <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
      {label && <FieldLabel required={required}>{label}</FieldLabel>}
      <div
        style={{
          display: "flex", alignItems: "center", gap: 8, height: h, padding: "0 12px",
          background: bg, border: \`1.5px solid \${bc}\`, borderRadius: 8,
          transition: "all .18s", boxShadow: sh,
          cursor: disabled ? "not-allowed" : "text", fontFamily: Fn.body, fontSize: fs,
        }}
        onClick={() => !disabled && ref.current?.focus()}
      >
        {icon && <span style={{ display: "flex", flexShrink: 0, opacity: disabled ? .4 : .55 }}>{icon}</span>}
        <input
          ref={ref} type="text" placeholder={placeholder} value={dv}
          onChange={e => { setVal(e.target.value); onChange?.(e.target.value); }}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          disabled={disabled} readOnly={readOnly}
          style={{
            flex: 1, border: "none", outline: "none", background: "transparent",
            fontFamily: Fn.body, fontSize: fs, color: disabled ? C.fgMuted : C.fg,
            cursor: disabled ? "not-allowed" : "text", minWidth: 0,
          }}
        />
      </div>
      {(helper || (error && errorMsg)) && (
        <FieldHint error={error}>{error ? errorMsg : helper}</FieldHint>
      )}
    </div>
  );
}

// Usage:
// <Field label="Nome" required helper="Campo obrigatorio.">
//   <input style={{...}} />
// </Field>
//
// <FieldInput label="Email" placeholder="email@fips.app.br" icon={<EmailIcon />} required />
// <FieldInput label="Protocolo" value="FIPS-2026-00482" readOnly />
// <FieldInput label="CNPJ" error errorMsg="CNPJ invalido." value="123" />
`;

/* ═══════════════════════════════════════════ PLAYGROUND HELPERS ═══════════════════════════════════════════ */
const fieldIconSvgs: Record<string, string> = {
  pessoa: `<svg width="16" height="16" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="6" r="3.5" stroke="currentColor" strokeWidth="1.5"/><path d="M3 17.5c0-3.5 3-5.5 7-5.5s7 2 7 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>`,
  email: `<svg width="16" height="16" viewBox="0 0 20 20" fill="none"><rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M2 6l8 5 8-5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>`,
  busca: `<svg width="16" height="16" viewBox="0 0 20 20" fill="none"><circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.5"/><path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>`,
  calendario: `<svg width="16" height="16" viewBox="0 0 20 20" fill="none"><rect x="2.5" y="3.5" width="15" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M2.5 8h15M7 2v3M13 2v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>`,
  cadeado: `<svg width="16" height="16" viewBox="0 0 20 20" fill="none"><rect x="4" y="9" width="12" height="8" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M7 9V6a3 3 0 016 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>`,
  grid: `<svg width="16" height="16" viewBox="0 0 20 20" fill="none"><rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4"/></svg>`,
};

interface FieldVariant {
  label: string;
  placeholder: string;
  iconName: string;
  required?: boolean;
  helper?: string;
  showToggle?: boolean;
  onClear?: boolean;
  iconRight?: string;
  type?: "input" | "select";
  options?: string[];
}

function fieldVariantCode(v: FieldVariant): string {
  const iconSvg = fieldIconSvgs[v.iconName] || fieldIconSvgs.pessoa;

  if (v.type === "select") {
    const opts = v.options || ["Selecione"];
    return `// DS-FIPS — Field Select "${v.label}" — Copy-paste ready
// Self-contained: cole no seu projeto React e funciona direto.

export function Field${v.label.replace(/\s+/g, "")}() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 200 }}>
      <label style={{
        fontSize: 13, fontWeight: 600, color: "#333B41",
        fontFamily: "'Open Sans', sans-serif",
      }}>
        ${v.label}
      </label>
      <div style={{
        display: "flex", alignItems: "center", gap: 8, height: 35, padding: "0 12px",
        borderRadius: 8, border: "1.5px solid #CBD5E1",
        background: "#FFFFFF", fontFamily: "'Open Sans', sans-serif", fontSize: 13,
      }}>
        <span style={{ display: "flex", flexShrink: 0, opacity: .55 }}>${iconSvg}</span>
        <select style={{
          flex: 1, border: "none", outline: "none", background: "transparent",
          fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: "#333B41",
          cursor: "pointer", minWidth: 0,
        }}>
          ${opts.map(o => `<option>${o}</option>`).join("\n          ")}
        </select>
      </div>
    </div>
  );
}`;
  }

  return `// DS-FIPS — Field Input "${v.label}" — Copy-paste ready
// Self-contained: cole no seu projeto React e funciona direto.
import { useState } from "react";

export function Field${v.label.replace(/\s+/g, "")}() {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);${v.showToggle ? '\n  const [showPwd, setShowPwd] = useState(false);' : ''}

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 200 }}>
      <label style={{
        fontSize: 13, fontWeight: 600, color: "#333B41",
        fontFamily: "'Open Sans', sans-serif",
      }}>
        ${v.label}${v.required ? ' <span style={{ color: "#DC3545" }}>*</span>' : ''}
      </label>
      <div style={{
        display: "flex", alignItems: "center", gap: 8, height: 35, padding: "0 12px",
        borderRadius: 8, border: focused ? "1.5px solid #004B9B" : "1.5px solid #CBD5E1",
        background: "#FFFFFF", fontFamily: "'Open Sans', sans-serif", fontSize: 13,
        transition: "border-color 0.15s",
      }}>
        <span style={{ display: "flex", flexShrink: 0, opacity: .55 }}>${iconSvg}</span>
        <input
          ${v.showToggle ? 'type={showPwd ? "text" : "password"}' : 'type="text"'}
          value={value}
          onChange={e => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="${v.placeholder}"
          style={{
            flex: 1, border: "none", outline: "none", background: "transparent",
            fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: "#333B41",
          }}
        />${v.showToggle ? `
        <button onClick={() => setShowPwd(p => !p)} style={{ background: "none", border: "none", cursor: "pointer", opacity: .5, fontSize: 14, padding: 0 }}>
          {showPwd ? "🙈" : "👁"}
        </button>` : ''}${v.onClear ? `
        {value && (
          <button onClick={() => setValue("")} style={{ background: "none", border: "none", cursor: "pointer", opacity: .5, fontSize: 14, padding: 0 }}>✕</button>
        )}` : ''}
      </div>${v.helper ? `
      <span style={{ fontSize: 11, color: "#7B8C96", fontFamily: "'Open Sans', sans-serif" }}>
        ${v.helper}
      </span>` : ''}
    </div>
  );
}`;
}

const FIELD_VARIANTS: FieldVariant[] = [
  { label: "Nome do cliente", placeholder: "Nome completo", iconName: "pessoa", required: true, helper: "Use o nome juridico ou comercial principal." },
  { label: "Email", placeholder: "email@fips.app.br", iconName: "email", helper: "Este campo e obrigatorio no cadastro completo." },
  { label: "Busca global", placeholder: "Buscar empresa, CNPJ ou responsavel...", iconName: "busca", onClear: true },
  { label: "Data de vencimento", placeholder: "30/03/2026", iconName: "calendario", iconRight: "calendario" },
  { label: "Senha do certificado", placeholder: "Senha", iconName: "cadeado", showToggle: true, required: true },
  { label: "Segmento", placeholder: "", iconName: "grid", type: "select", options: ["Selecione","Graos","Conteiner","Granel liquido"] },
];

/* ═══════════════════════════════════════════ MAIN ═══════════════════════════════════════════ */
export default function FieldDoc(){
  const [s1,setS1]=useState("");const [errEmail,setErrEmail]=useState("consultoriafiscal");
  return(
    <PlaygroundProvider>
    <div style={{minHeight:"100vh",background:"var(--color-surface-muted)",fontFamily:F.body,color:C.cinzaEscuro}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Saira+Expanded:wght@300;400;500;600;700;800&family=Open+Sans:wght@300;400;600;700&family=Fira+Code:wght@400;500&display=swap');
        input::placeholder { color: ${C.textLight}; }
        input:disabled::placeholder { color: ${C.cinzaClaro}; }
        select { -webkit-appearance: none; -moz-appearance: none; appearance: none; padding-right: 24px; }
      `}</style>

      {/* ══════ HEADER ══════ */}
      <header style={{background:`linear-gradient(135deg,var(--color-gov-gradient-from) 0%,var(--color-gov-gradient-to) 100%)`,padding:"48px 40px 44px",position:"relative",overflow:"hidden"}}>
        <JunctionLines style={{position:"absolute",top:-10,right:-20,width:400,height:250}}/>
        <JunctionLines style={{ position: 'absolute', bottom: -40, left: -60, width: 300, height: 200, transform: 'scaleX(-1)' }} />
        <div style={{position:"relative"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:6,background:`${C.branco}10`,border:`1px solid ${C.branco}18`,borderRadius:20,padding:"5px 14px",fontSize:11,fontWeight:600,letterSpacing:"1.5px",textTransform:"uppercase",color:C.amareloOuro,fontFamily:F.title,marginBottom:16}}>
            {I.grid(14,C.amareloOuro)} Design System FIPS
          </div>
          <h1 style={{fontSize:44,fontWeight:700,color:C.branco,margin:"0 0 10px",fontFamily:F.title,letterSpacing:"1px"}}>Field</h1>
          <p style={{fontSize:16,color:`${C.branco}B0`,lineHeight:1.6,maxWidth:700,margin:0,fontFamily:F.body}}>
            Composição oficial de <strong style={{color:`${C.branco}DD`}}>label + input + helper + mensagem de erro</strong> para qualquer controle de formulário. Todos os projetos devem montar campos a partir desta camada, não por combinações soltas.
          </p>
          <div style={{display:"flex",gap:14,marginTop:24,flexWrap:"wrap"}}>
            {[{l:"label",c:C.cinzaEscuro},{l:"input",c:C.inputBorder},{l:"helper",c:C.textMuted},{l:"erro",c:C.danger},{l:"obrigatório",c:C.danger}].map(t=>(
              <div key={t.l} style={{display:"flex",alignItems:"center",gap:8,background:`${C.branco}08`,border:`1px solid ${C.branco}15`,borderRadius:6,padding:"6px 12px",fontSize:12,color:`${C.branco}90`,fontFamily:F.mono}}>
                <div style={{width:12,height:12,borderRadius:3,background:t.c,border:`1px solid ${C.branco}20`,flexShrink:0}}/>{t.l}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ══════ BODY ══════ */}
      <div style={{padding:"36px 40px 60px",maxWidth:1100,margin:"0 auto"}}>

        {/* 01 — CADASTRO DESKTOP */}
        <Section n="01" title="Cadastro desktop de referência" desc="Formulário completo usando Field como camada de composição. Cada campo é Field + componente base (input, select, textarea).">
          <Card>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
              <h3 style={{fontSize:24,fontWeight:700,color:C.cinzaEscuro,fontFamily:F.title,letterSpacing:".5px",margin:0}}>Dados do Cliente</h3>
              <div style={{display:"flex",gap:10}}>
                <button style={{padding:"7px 18px",fontSize:13,border:`1.5px solid ${C.inputBorder}`,borderRadius:6,background:"transparent",color:C.cinzaChumbo,cursor:"pointer",fontFamily:F.body,fontWeight:600}}>Cancelar</button>
                <button style={{padding:"7px 18px",fontSize:13,border:"none",borderRadius:6,background:C.verdeFloresta,color:C.branco,cursor:"pointer",fontFamily:F.body,fontWeight:600,display:"flex",alignItems:"center",gap:6}}>{I.save(13)} Salvar</button>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"16px 20px"}}>
              <FInput label="ID" value="20223" icon={I.documento()} readOnly helper="Gerado automaticamente." />
              <FInput label="CNPJ" value="56481942420" icon={I.documento()} />
              <FInput label="Nome do cliente" value="Multi Campo QoSJa TestX" icon={I.pessoa()} required />
              <FInput label="Razão social" value="Cristina Peixoto Bragaa Test" icon={I.documento()} cols={2} />
              <FInput label="Nome fantasia" value="CRISTIANA PEIXOTO BRAGA" icon={I.documento()} />
              <FInput label="Email do cliente" value="multiH6Ew@test.com" icon={I.email()} />
              <FSelect label="Segmento" icon={I.grid(16,C.cinzaChumbo)} options={["Selecione","Grãos","Contêiner","Granel líquido","Carga geral"]} />
              <FInput label="Contato telefone" value="11999999999" icon={I.telefone()} />
            </div>
          </Card>
        </Section>

        {/* 02 — ANATOMIA DO FIELD */}
        <Section n="02" title="Anatomia do Field" desc="Estrutura visual completa: label, asterisco, campo de entrada, ícones e texto auxiliar. Todos os espaçamentos são padronizados.">
          <Card s={{marginBottom:20}}>
            <div style={{display:"flex",gap:40,flexWrap:"wrap"}}>
              {/* Annotated */}
              <div style={{flex:1,minWidth:300}}>
                <div style={{padding:"12px 0"}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:C.azulProfundo}}/><span style={{fontSize:10,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.cinzaEscuro,fontFamily:F.title}}>Label</span><span style={{fontSize:10,color:C.textMuted}}>— Open Sans 600 · 12px</span>
                  </div>
                  <div style={{marginLeft:7,marginBottom:1,fontSize:12,fontWeight:600,color:C.cinzaEscuro,fontFamily:F.body,display:"flex",alignItems:"center",gap:3}}>
                    Nome do cliente <span style={{color:C.danger,fontWeight:700,fontSize:14}}>*</span>
                    <span style={{marginLeft:8,display:"inline-flex",alignItems:"center",gap:4}}>
                      <div style={{width:6,height:6,borderRadius:"50%",background:C.danger}}/><span style={{fontSize:10,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.danger,fontFamily:F.title}}>Obrigatório</span>
                    </span>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:6,margin:"3px 0",marginLeft:7}}>
                    <div style={{height:1,width:20,background:C.amareloEscuro}}/><span style={{fontSize:9,color:C.amareloEscuro,fontFamily:F.mono,fontWeight:600}}>1px</span>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:C.verdeFloresta}}/><span style={{fontSize:10,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.verdeFloresta,fontFamily:F.title}}>Componente base (Input)</span>
                  </div>
                  <FInput placeholder="Nome completo" icon={I.pessoa()} />
                  <div style={{display:"flex",alignItems:"center",gap:6,margin:"3px 0",marginLeft:7}}>
                    <div style={{height:1,width:20,background:C.amareloEscuro}}/><span style={{fontSize:9,color:C.amareloEscuro,fontFamily:F.mono,fontWeight:600}}>3px</span>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:C.azulCeu}}/><span style={{fontSize:10,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.azulCeu,fontFamily:F.title}}>Helper text</span><span style={{fontSize:10,color:C.textMuted}}>— Open Sans 400 · 11px</span>
                  </div>
                  <p style={{marginLeft:7,marginTop:3,fontSize:11,color:C.textMuted,fontFamily:F.body}}>Use o nome jurídico ou comercial principal.</p>
                </div>
              </div>
              {/* Error example */}
              <div style={{flex:1,minWidth:300}}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:C.danger}}/><span style={{fontSize:10,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.danger,fontFamily:F.title}}>Estado de erro — helper vira mensagem vermelha</span>
                </div>
                <FInput label="Email" placeholder="email@fips.app.br" icon={I.email()} required error errorMsg="Formato de email inválido. Verifique e tente novamente." value={errEmail} onChange={setErrEmail} />
                <div style={{marginTop:16,display:"flex",alignItems:"center",gap:6}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:C.cinzaChumbo}}/><span style={{fontSize:10,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.cinzaChumbo,fontFamily:F.title}}>Bloqueado — fundo cinza, cursor not-allowed</span>
                </div>
                <div style={{marginTop:6}}><FInput label="Protocolo" icon={I.documento()} disabled value="FIPS-2026-00482" helper="Campo travado por regra de negócio." /></div>
              </div>
            </div>
          </Card>

          {/* Spacing tokens */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))",gap:16}}>
            <div style={gc}>
              <div style={gh}><span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:F.title}}>Espaçamentos internos</span></div>
              <div style={gb}>
                {[
                  {l:"Label → Input",v:"1px",d:"Gap entre label e borda do campo"},
                  {l:"Input → Helper",v:"3px",d:"Gap entre campo e texto auxiliar"},
                  {l:"Label marginLeft",v:"7px",d:"Alinhamento com conteúdo do input"},
                  {l:"Asterisco gap",v:"3px",d:"Distância label ↔ asterisco"},
                  {l:"Entre Fields",v:"16–20px",d:"Espaçamento vertical entre campos"},
                ].map(s=>(
                  <div key={s.l} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                    <code style={{background:`${C.amareloOuro}30`,color:C.amareloEscuro,padding:"2px 8px",borderRadius:4,fontSize:11,fontFamily:F.mono,fontWeight:600,minWidth:55,textAlign:"center"}}>{s.v}</code>
                    <div><span style={{fontSize:12,fontWeight:600,color:C.cinzaEscuro,fontFamily:F.body}}>{s.l}</span><span style={{fontSize:11,color:C.textMuted,fontFamily:F.body,marginLeft:6}}>— {s.d}</span></div>
                  </div>
                ))}
              </div>
            </div>
            <div style={gc}>
              <div style={gh}><span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:F.title}}>Nomenclatura de labels</span></div>
              <div style={gb}>
                <p style={{...gt,marginBottom:10}}>Nomes curtos, descritivos, substantivos. Evitar verbos e abreviações.</p>
                {[
                  {g:"Nome do cliente",b:"Digite o nome"},
                  {g:"Email",b:"Endereço de email do usuário"},
                  {g:"CPF / CNPJ",b:"Documento"},
                  {g:"Data de vencimento",b:"Vencimento dt."},
                  {g:"Placa do veículo",b:"Placa (Mercosul)"},
                ].map(r=>(
                  <div key={r.g} style={{display:"flex",gap:12,fontSize:12,fontFamily:F.body,marginBottom:4}}>
                    <span style={{color:C.verdeFloresta,fontWeight:600,minWidth:140}}>✓ {r.g}</span>
                    <span style={{color:C.danger,opacity:.7}}>✗ {r.b}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* 03 — COMPOSIÇÃO PADRÃO */}
        <Section n="03" title="Composição padrão" desc="Field = Label + Componente base + Helper. Clique em qualquer campo para copiar o código pronto para uso.">
          <Card>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px 20px"}}>
              <Copyable label={FIELD_VARIANTS[0].label} code={fieldVariantCode(FIELD_VARIANTS[0])} preview={<FInput label="Nome do cliente" placeholder="Nome completo" icon={I.pessoa()} required helper="Use o nome jurídico ou comercial principal." />}>
                <FInput label="Nome do cliente" placeholder="Nome completo" icon={I.pessoa()} required helper="Use o nome jurídico ou comercial principal." />
              </Copyable>
              <Copyable label={FIELD_VARIANTS[1].label} code={fieldVariantCode(FIELD_VARIANTS[1])} preview={<FInput label="Email" placeholder="email@fips.app.br" icon={I.email()} helper="Este campo é obrigatório no cadastro completo." />}>
                <FInput label="Email" placeholder="email@fips.app.br" icon={I.email()} helper="Este campo é obrigatório no cadastro completo." />
              </Copyable>
              <Copyable label={FIELD_VARIANTS[2].label} code={fieldVariantCode(FIELD_VARIANTS[2])} preview={<FInput label="Busca global" placeholder="Buscar empresa, CNPJ ou responsável..." icon={I.busca()} onClear={()=>{}} />}>
                <FInput label="Busca global" placeholder="Buscar empresa, CNPJ ou responsável..." icon={I.busca()} value={s1} onChange={setS1} onClear={()=>setS1("")} />
              </Copyable>
              <Copyable label={FIELD_VARIANTS[3].label} code={fieldVariantCode(FIELD_VARIANTS[3])} preview={<FInput label="Data de vencimento" placeholder="30/03/2026" icon={I.calendario()} iconRight={I.calendario(16,C.azulClaro)} />}>
                <FInput label="Data de vencimento" placeholder="30/03/2026" icon={I.calendario()} iconRight={I.calendario(16,C.azulClaro)} />
              </Copyable>
              <Copyable label={FIELD_VARIANTS[4].label} code={fieldVariantCode(FIELD_VARIANTS[4])} preview={<FInput label="Senha do certificado" placeholder="Senha" icon={I.cadeado()} showToggle required />}>
                <FInput label="Senha do certificado" placeholder="Senha" icon={I.cadeado()} showToggle required />
              </Copyable>
              <Copyable label={FIELD_VARIANTS[5].label} code={fieldVariantCode(FIELD_VARIANTS[5])} preview={<FSelect label="Segmento" icon={I.grid(16,C.cinzaChumbo)} options={["Selecione","Grãos","Contêiner","Granel líquido"]} />}>
                <FSelect label="Segmento" icon={I.grid(16,C.cinzaChumbo)} options={["Selecione","Grãos","Contêiner","Granel líquido"]} />
              </Copyable>
            </div>
          </Card>
        </Section>

        {/* 04 — GUIA: FIELD vs INPUT vs SELECT */}
        <Section n="04" title="Guia de composição" desc="Field é a camada de composição. Ele envolve qualquer componente base (Input, Select, Textarea) com a mesma estrutura de label, helper e erro.">
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))",gap:16}}>
            <div style={{...gc,borderLeft:`4px solid ${C.azulProfundo}`}}>
              <div style={gh}><span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:F.title}}>Field + Input</span><code style={gk}>90% dos casos</code></div>
              <div style={gb}>
                <FInput label="Nome" placeholder="Nome completo" icon={I.pessoa()} required helper="Campo de texto padrão." compact />
                <div style={{...gl,marginTop:14,color:C.cinzaEscuro}}>★ COMBINAÇÃO PADRÃO</div>
                <p style={gt}>A composição mais usada. Input de texto com ícone à esquerda, label acima e helper abaixo.</p>
                <div style={gl}>Componentes base</div>
                <p style={gt}>Texto, email, senha, busca, data, telefone, CPF/CNPJ, placa, moeda.</p>
                <div style={gl}>Exemplo FIPS</div>
                <p style={ge}>Todos os formulários: App Visitante, SSMA, Suprimentos, App Visitante, Serrat.</p>
              </div>
            </div>

            <div style={gc}>
              <div style={gh}><span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:F.title}}>Field + Select</span><code style={gk}>dropdowns</code></div>
              <div style={gb}>
                <FSelect label="Status" icon={I.grid(16,C.cinzaChumbo)} options={["Ativo","Inativo","Pendente"]} compact />
                <div style={{...gl,marginTop:14}}>Significado</div>
                <p style={gt}>Campo de seleção com opções predefinidas. Ícone de contexto à esquerda, seta dropdown à direita.</p>
                <div style={gl}>Quando usar</div>
                <p style={gt}>Listas fechadas com 3–15 opções. Segmento, status, tipo de veículo, UF. Acima de 15, use autocomplete (Input + busca).</p>
                <div style={gl}>Exemplo FIPS</div>
                <p style={ge}>"Segmento" no cadastro de cliente; "Tipo de Veículo" no App Visitante; "Status" em filtros de listagem.</p>
              </div>
            </div>

            <div style={gc}>
              <div style={gh}><span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:F.title}}>Field + Textarea</span><code style={gk}>texto longo</code></div>
              <div style={gb}>
                <FTextarea label="Observação" placeholder="Contexto adicional..." rows={2} compact />
                <div style={{...gl,marginTop:14}}>Significado</div>
                <p style={gt}>Área de texto expandível para descrições, observações e justificativas longas.</p>
                <div style={gl}>Quando usar</div>
                <p style={gt}>Descrição de ocorrência, justificativa de aprovação, observações em formulários. Mínimo 2 linhas, resizable.</p>
                <div style={gl}>Exemplo FIPS</div>
                <p style={ge}>"Observação" em modais do App Ocorrências; "Justificativa" em aprovações; "Descrição da ideia" no App Ideias.</p>
              </div>
            </div>
          </div>
        </Section>

        {/* 05 — DENSIDADE COMPACTA */}
        <Section n="05" title="Densidade compacta oficial" desc="Versão compacta do Field para modais, filtros e áreas com espaço restrito. Altura 30px, fonte 12px.">
          <Card s={{background:C.bg}}>
            <div style={{background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:12,padding:24,maxWidth:560}}>
              <div style={{fontSize:15,fontWeight:700,color:C.cinzaEscuro,fontFamily:F.title,marginBottom:16}}>Modal de triagem</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px 16px"}}>
                <FInput label="Busca rápida" placeholder="Empresa ou responsável..." icon={I.busca()} onClear={()=>{}} compact />
                <FSelect label="Status" icon={I.grid(16,C.cinzaChumbo)} options={["Ativo","Inativo","Pendente"]} compact />
              </div>
              <div style={{marginTop:12}}><FTextarea label="Observação" placeholder="Contexto adicional para triagem, filtros e apoio operacional..." rows={3} compact /></div>
              <div style={{display:"flex",justifyContent:"flex-end",gap:10,marginTop:20}}>
                <button style={{padding:"6px 16px",fontSize:12,background:"transparent",border:`1px solid ${C.inputBorder}`,borderRadius:6,color:C.cinzaChumbo,cursor:"pointer",fontFamily:F.body}}>Cancelar</button>
                <button style={{padding:"6px 16px",fontSize:12,background:C.verdeFloresta,border:"none",borderRadius:6,color:C.branco,cursor:"pointer",fontFamily:F.body,fontWeight:600,display:"flex",alignItems:"center",gap:5}}>{I.save(12)} Salvar</button>
              </div>
            </div>
          </Card>
        </Section>

        {/* 06 — GRID DE FORMULÁRIO */}
        <Section n="06" title="Grid de formulário" desc="Regras de layout para organizar Fields em colunas. Desktop usa grid de 2 ou 3 colunas.">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <div style={gc}>
              <div style={gh}><span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:F.title}}>3 colunas</span><code style={gk}>cadastro completo</code></div>
              <div style={{...gb,background:C.bg,padding:16}}>
                <div style={{background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:8,padding:16}}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"10px 14px"}}>
                    <FInput label="ID" value="20223" icon={I.documento()} compact readOnly />
                    <FInput label="CNPJ" placeholder="00.000.000/0000-00" icon={I.documento()} compact />
                    <FInput label="Nome" placeholder="Nome completo" icon={I.pessoa()} compact required />
                  </div>
                </div>
              </div>
              <div style={gb}>
                <div style={gl}>Quando usar</div>
                <p style={gt}>Formulários de cadastro principal com 6+ campos. Aproveita a largura total da tela desktop.</p>
                <div style={gl}>Exemplo FIPS</div>
                <p style={ge}>Cadastro de cliente, fornecedor, colaborador. Telas full-width do App Suprimentos.</p>
              </div>
            </div>

            <div style={gc}>
              <div style={gh}><span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:F.title}}>2 colunas</span><code style={gk}>modais e edição</code></div>
              <div style={{...gb,background:C.bg,padding:16}}>
                <div style={{background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:8,padding:16}}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px 14px"}}>
                    <FInput label="Email" placeholder="email@fips.app.br" icon={I.email()} compact />
                    <FInput label="Telefone" placeholder="(13) 99999-0000" icon={I.telefone()} compact />
                  </div>
                </div>
              </div>
              <div style={gb}>
                <div style={gl}>Quando usar</div>
                <p style={gt}>Modais de edição, formulários com 2–5 campos, drawers laterais. Mais compacto e focado.</p>
                <div style={gl}>Exemplo FIPS</div>
                <p style={ge}>Modais do App Ocorrências, edição rápida no App Cadastros, filtros avançados.</p>
              </div>
            </div>
          </div>
        </Section>

        {/* 07 — ESTADOS DO FIELD */}
        <Section n="07" title="Estados do Field" desc="Cada estado comunica uma situação diferente. Clique nos campos para testar o foco real.">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16}}>
            {[
              {t:"Padrão",d:"Campo aguardando interação. Borda cinza neutra.",comp:<FInput label="Título" placeholder="Ex: Consultoria Fiscal" icon={I.documento()} compact />},
              {t:"Obrigatório",d:"Asterisco vermelho ao lado do label. Erro no submit se vazio.",comp:<FInput label="Nome completo" placeholder="Nome" icon={I.pessoa()} required compact helper="Campo obrigatório em cadastros." />,accent:"warning"},
              {t:"Em foco",d:"Borda azul profundo + anel de foco. Clique para testar.",comp:<FInput label="Email" placeholder="email@fips.app.br" icon={I.email()} compact />},
              {t:"Erro",d:"Borda vermelha + mensagem no lugar do helper.",comp:<FInput label="CNPJ" icon={I.documento()} error errorMsg="CNPJ inválido. Verifique os dígitos." value="123" compact required />,accent:"danger"},
              {t:"Bloqueado",d:"Fundo cinza, cursor not-allowed, opacidade reduzida.",comp:<FInput label="Status" icon={I.documento()} disabled value="Aprovado" compact helper="Travado por regra de negócio." />},
              {t:"Somente leitura",d:"Valor do sistema. Visível mas não editável. Fundo branco.",comp:<FInput label="Protocolo" icon={I.documento()} readOnly value="FIPS-2026-00482" compact />},
            ].map(s=>(
              <div key={s.t} style={{...gc,...(s.accent==="danger"?{borderLeft:`4px solid ${C.danger}`}:s.accent==="warning"?{borderLeft:`4px solid ${C.amareloEscuro}`}:{})}}>
                <div style={gh}><span style={{fontSize:13,fontWeight:700,color:s.accent==="danger"?C.danger:C.azulEscuro,fontFamily:F.title}}>{s.t}</span></div>
                <div style={{...gb,display:"flex",flexDirection:"column",gap:10}}>
                  {s.comp}
                  <p style={{...gt,fontSize:12,color:C.cinzaChumbo,marginTop:4}}>{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* 08 — REGRA OBRIGATÓRIA */}
        <Section n="08" title="Regras obrigatórias" desc="Diretrizes que devem ser seguidas em todos os projetos do ecossistema FIPS.">
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{background:"#FFF7ED",border:`1px solid #FDBA74`,borderRadius:12,padding:20,display:"flex",gap:14,alignItems:"flex-start"}}>
              {I.alerta(20,C.amareloEscuro)}
              <div>
                <p style={{fontSize:14,fontWeight:700,color:C.cinzaEscuro,margin:"0 0 6px",fontFamily:F.body}}>Campos montados devem nascer de "Field + componente base".</p>
                <p style={{fontSize:13,color:C.cinzaChumbo,margin:"0 0 4px",lineHeight:1.5,fontFamily:F.body}}>Ajustes de borda, raio, sombra, altura, padding interno e alinhamento do label não devem ser refeitos na ponta. Quando um contexto exigir outro comportamento, a alteração entra no design system como API oficial.</p>
                <p style={{fontSize:13,color:C.cinzaChumbo,margin:0,lineHeight:1.5,fontFamily:F.body}}>Campos obrigatórios usam asterisco vermelho no label, e estados como foco, inválido e bloqueado devem ser demonstrados nas páginas de componente para orientar todos os projetos.</p>
              </div>
            </div>
            <div style={{background:C.azulCeuClaro+"40",border:`1px solid ${C.azulCeuClaro}`,borderRadius:12,padding:20,display:"flex",gap:14,alignItems:"flex-start"}}>
              <div style={{width:20,height:20,borderRadius:"50%",background:C.azulProfundo,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}><span style={{color:C.branco,fontSize:12,fontWeight:700}}>i</span></div>
              <div>
                <p style={{fontSize:14,fontWeight:700,color:C.cinzaEscuro,margin:"0 0 6px",fontFamily:F.body}}>Tamanhos: Desktop 35px (padrão), Mobile 42px, Compacto 30px.</p>
                <p style={{fontSize:13,color:C.cinzaChumbo,margin:0,lineHeight:1.5,fontFamily:F.body}}>Desktop é o default. Mobile ativa automaticamente em viewports &lt; 768px. Compacto é exclusivo para modais, filtros e toolbars. Nunca usar Compacto em formulários de cadastro principal.</p>
              </div>
            </div>
          </div>
        </Section>

        {/* 09 — TOKENS */}
        <Section n="09" title="Tokens de referência" desc="Valores de design utilizados neste componente — direto do Brandbook FIPS.">
          <Card s={{display:"flex",gap:48,flexWrap:"wrap"}}>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:F.title,marginBottom:4}}>Bordas & fundos</span>
              <TokenRow label="Borda padrão" value="#CBD5E1" color={C.inputBorder}/>
              <TokenRow label="Borda foco" value="#004B9B" color={C.azulProfundo}/>
              <TokenRow label="Borda erro" value="#DC3545" color={C.danger}/>
              <TokenRow label="Anel de foco" value="rgba(147,189,228,.35)" color={C.azulCeu}/>
              <TokenRow label="Fundo bloqueado" value="#F1F5F9" color="#F1F5F9"/>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:F.title,marginBottom:4}}>Tipografia</span>
              <TokenRow label="Label" value="Open Sans 600 12px"/>
              <TokenRow label="Valor" value="Open Sans 400 13px"/>
              <TokenRow label="Placeholder" value="Open Sans 400 13px"/>
              <TokenRow label="Helper" value="Open Sans 400 11px"/>
              <TokenRow label="Erro" value="Open Sans 400 11px"/>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:F.title,marginBottom:4}}>Dimensões</span>
              <TokenRow label="Radius" value="8px"/>
              <TokenRow label="Desktop" value="35px"/>
              <TokenRow label="Mobile" value="42px"/>
              <TokenRow label="Compacto" value="30px"/>
              <TokenRow label="Ícone" value="16px"/>
              <TokenRow label="Anel foco" value="3px"/>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:F.title,marginBottom:4}}>Espaçamentos</span>
              <TokenRow label="Label → Input" value="1px"/>
              <TokenRow label="Input → Helper" value="3px"/>
              <TokenRow label="Label marginLeft" value="7px"/>
              <TokenRow label="Entre Fields" value="16–20px"/>
              <TokenRow label="Grid gap cols" value="20px"/>
            </div>
          </Card>
        </Section>

        <Section n="10" title="Modo Dark" desc="Comportamento e tokens do componente no tema escuro. O DS-FIPS garante consistência visual em ambos os modos — claro e escuro.">
          <Card>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              {[
                {token:"Borda idle",light:"#CBD5E1",dark:"#3A3A3A"},
                {token:"Borda hover",light:"#93BDE4",dark:"#4A4A4A"},
                {token:"Borda focus",light:"#004B9B",dark:"#93BDE4"},
                {token:"Background",light:"#FFFFFF",dark:"#252525"},
                {token:"Texto",light:"#333B41",dark:"#E2E2E8"},
                {token:"Placeholder",light:"#6B7784",dark:"#A1A1AA"},
                {token:"Ring focus",light:"rgba(147,189,228,0.35)",dark:"rgba(147,189,228,0.2)"},
                {token:"Bg disabled",light:"#F1F5F9",dark:"#1E1E1E"},
                {token:"Borda erro",light:"#DC3545",dark:"#F87171"},
                {token:"Ring erro",light:"#FEF2F2",dark:"rgba(248,113,113,0.15)"},
                {token:"Label",light:"#333B41",dark:"#E2E2E8"},
                {token:"Helper",light:"#64748B",dark:"#A1A1AA"},
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

        <CodePlayground />

        <CodeExportSection items={[{
          label: "Field + FieldLabel + FieldHint",
          description: "Composicao oficial de label + input + helper/erro para formularios. Inclui FieldInput com icone e estados.",
          code: fieldExportCode,
        }]} />

        {/* FOOTER */}
        <div style={{textAlign:"center",padding:"20px 0 0",borderTop:`1px solid ${C.cardBorder}`,marginTop:20}}>
          <span style={{fontSize:12,color:C.cinzaChumbo,letterSpacing:".5px",fontFamily:F.title,fontWeight:400}}>DS-FIPS v0.4.2 · Ferrovia Interna do Porto de Santos · Excelência sobre trilhos · {new Date().getFullYear()}</span>
        </div>
      </div>
    </div>
    </PlaygroundProvider>
  );
}
