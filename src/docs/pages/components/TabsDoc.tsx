// @ts-nocheck
import { useState, useEffect, useRef } from "react";
import { Bell, Database, HardDrive } from "lucide-react";
import { InlineCodeCopy } from '../../components/CodeExport';
import { PlaygroundProvider, Copyable, CodePlayground } from '../../components/CodePlayground';
import { FipsTabBar } from '../../../components/composites/FipsTabBar';

/* ═══════════════════════════════════════════ TOKENS ═══════════════════════════════════════════ */
const C={azulProfundo:"var(--color-gov-azul-profundo)",azulEscuro:"var(--color-gov-azul-escuro)",azulClaro:"var(--color-gov-azul-claro)",cinzaChumbo:"var(--color-fg-muted)",cinzaEscuro:"var(--color-fg)",cinzaClaro:"#C0CCD2",azulCeu:"#93BDE4",azulCeuClaro:"#D3E3F4",amareloOuro:"#FDC24E",amareloEscuro:"#F6921E",verdeFloresta:"#00C64C",verdeEscuro:"#00904C",danger:"#DC3545",neutro:"var(--color-surface-soft)",branco:"#FFFFFF",bg:"var(--color-surface-muted)",cardBg:"var(--color-surface)",cardBorder:"var(--color-border)",textMuted:"var(--color-fg-muted)",textLight:"var(--color-fg-muted)"};
const Fn={title:"'Saira Expanded',sans-serif",body:"'Open Sans',sans-serif",mono:"'Fira Code',monospace"};

/* ═══════════════════════════════════════════ ICONS ═══════════════════════════════════════════ */
const Ic={
  grid:(s=14,c=C.amareloOuro)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><rect x="2" y="2" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/><rect x="11" y="2" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/><rect x="2" y="11" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/><rect x="11" y="11" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/></svg>,
  home:(s=14,c="currentColor")=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M3 10l7-7 7 7" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 8.5V16a1 1 0 001 1h3v-4h2v4h3a1 1 0 001-1V8.5" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  doc:(s=14,c="currentColor")=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M6 2h6l5 5v10a1 1 0 01-1 1H6a1 1 0 01-1-1V3a1 1 0 011-1z" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/><path d="M12 2v5h5" stroke={c} strokeWidth="1.5"/></svg>,
  folder:(s=14,c="currentColor")=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M2 6V4a1 1 0 011-1h5l2 2h7a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V6z" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  list:(s=14,c="currentColor")=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M6 4h12M6 10h12M6 16h12" stroke={c} strokeWidth="1.5" strokeLinecap="round"/><circle cx="2.5" cy="4" r="1" fill={c}/><circle cx="2.5" cy="10" r="1" fill={c}/><circle cx="2.5" cy="16" r="1" fill={c}/></svg>,
  pessoa:(s=14,c="currentColor")=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><circle cx="10" cy="6" r="3.5" stroke={c} strokeWidth="1.5"/><path d="M3 17.5c0-3.5 3-5.5 7-5.5s7 2 7 5.5" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>,
  clock:(s=14,c="currentColor")=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke={c} strokeWidth="1.5"/><path d="M10 5.5V10l3 2" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>,
  clip:(s=14,c="currentColor")=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M14.5 10.5l-5 5a3.5 3.5 0 01-5-5l6.5-6.5a2.5 2.5 0 013.5 3.5l-6.5 6.5a1.5 1.5 0 01-2-2l5-5" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>,
  settings:(s=14,c="currentColor")=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="3" stroke={c} strokeWidth="1.5"/><path d="M10 1v3M10 16v3M1 10h3M16 10h3M3.9 3.9l2.1 2.1M14 14l2.1 2.1M16.1 3.9l-2.1 2.1M6 14l-2.1 2.1" stroke={c} strokeWidth="1.3" strokeLinecap="round"/></svg>,
  shield:(s=14,c="currentColor")=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M10 2L3 5.5v5c0 4 3.5 6.5 7 7.5 3.5-1 7-3.5 7-7.5v-5L10 2z" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  chart:(s=14,c="currentColor")=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><rect x="3" y="10" width="3" height="7" rx="1" stroke={c} strokeWidth="1.3"/><rect x="8.5" y="6" width="3" height="11" rx="1" stroke={c} strokeWidth="1.3"/><rect x="14" y="3" width="3" height="14" rx="1" stroke={c} strokeWidth="1.3"/></svg>,
  bell:(s=14,c="currentColor")=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M10 2a5 5 0 00-5 5v3l-1.5 2.5h13L15 10V7a5 5 0 00-5-5z" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/><path d="M8 16a2 2 0 004 0" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>,
  lock:(s=14,c="currentColor")=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><rect x="4" y="9" width="12" height="9" rx="2" stroke={c} strokeWidth="1.5"/><path d="M7 9V6a3 3 0 016 0v3" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>,
};

function JunctionLines({style}){return <svg viewBox="0 0 320 200" fill="none" style={{opacity:.12,...style}}><path d="M0 60H100C120 60 120 60 140 40L200 40H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/><path d="M0 60H100C120 60 120 60 140 80L200 80H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/><path d="M0 120H60C80 120 80 120 100 100L160 100H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/><path d="M0 120H60C80 120 80 120 100 140L160 140H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/></svg>}

/* ═══════════════════════════════════════════
   TABS — UNDERLINE (sliding indicator)
   ═══════════════════════════════════════════ */
function TabsUnderline({tabs=[],active=0,onChange,size="md"}){
  const sz={sm:{fs:12,py:8,px:16},md:{fs:13,py:10,px:20},lg:{fs:14,py:12,px:24}};
  const s=sz[size]||sz.md;
  const refs=useRef([]);
  const [line,setLine]=useState({left:0,width:0});
  useEffect(()=>{
    const el=refs.current[active];
    if(el)setLine({left:el.offsetLeft,width:el.offsetWidth});
  },[active,tabs.length]);

  return(
    <div className="ds-tabs-scroll" style={{position:"relative",borderBottom:`2px solid ${C.cardBorder}`,gap:0}}>
      {tabs.map((t,i)=>{
        const isA=active===i;const dis=t.disabled;
        const ic=isA?C.amareloEscuro:C.cinzaChumbo;
        return(
          <div key={i} ref={el=>refs.current[i]=el} onClick={()=>!dis&&onChange?.(i)} style={{padding:`${s.py}px ${s.px}px`,fontSize:s.fs,fontWeight:isA?600:400,fontFamily:Fn.body,color:dis?C.textLight:isA?C.azulEscuro:C.cinzaChumbo,cursor:dis?"not-allowed":"pointer",display:"flex",alignItems:"center",gap:7,whiteSpace:"nowrap",transition:"all .2s",opacity:dis?.45:1}}
            onMouseEnter={e=>{if(!dis&&!isA)e.currentTarget.style.color=C.cinzaEscuro}}
            onMouseLeave={e=>{if(!dis&&!isA)e.currentTarget.style.color=C.cinzaChumbo}}
          >
            {t.icon&&<span style={{display:"flex"}}>{typeof t.icon==="function"?t.icon(ic):t.icon}</span>}
            {t.label}
            {t.count!==undefined&&<span style={{minWidth:18,height:18,borderRadius:999,background:isA?C.azulProfundo:C.cinzaClaro,color:isA?C.branco:C.cinzaChumbo,fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 5px",fontFamily:Fn.mono,transition:"all .2s"}}>{t.count}</span>}
            {t.dot&&<span style={{width:7,height:7,borderRadius:"50%",background:t.dotColor||C.verdeFloresta}}/>}
          </div>
        );
      })}
      {/* Sliding orange underline */}
      <div style={{position:"absolute",bottom:-2,left:line.left,width:line.width,height:3,background:C.amareloEscuro,borderRadius:"3px 3px 0 0",transition:"left .3s cubic-bezier(.4,0,.2,1), width .3s cubic-bezier(.4,0,.2,1)"}}/>
    </div>
  );
}

/* ═══════════════════════════════════════════
   TABS — FILLED
   ═══════════════════════════════════════════ */
function TabsFilled({tabs=[],active=0,onChange,size="md"}){
  const sz={sm:{fs:12,py:7,px:14},md:{fs:13,py:9,px:18},lg:{fs:14,py:11,px:22}};
  const s=sz[size]||sz.md;
  return(
    <div className="ds-tabs-scroll" style={{gap:6,background:C.bg,padding:4,borderRadius:10,flexWrap:"wrap"}}>
      {tabs.map((t,i)=>{
        const isA=active===i;const dis=t.disabled;
        const ic=isA?C.branco:C.cinzaEscuro;
        return(
          <div key={i} onClick={()=>!dis&&onChange?.(i)} style={{padding:`${s.py}px ${s.px}px`,fontSize:s.fs,fontWeight:isA?700:500,fontFamily:Fn.body,color:dis?C.textLight:isA?C.branco:C.cinzaEscuro,background:isA?C.azulProfundo:"transparent",borderRadius:7,cursor:dis?"not-allowed":"pointer",display:"flex",alignItems:"center",gap:6,whiteSpace:"nowrap",transition:"all .25s cubic-bezier(.4,0,.2,1)",opacity:dis?.45:1,boxShadow:isA?"0 2px 8px rgba(0,75,155,.25)":"none"}}
            onMouseEnter={e=>{if(!dis&&!isA)e.currentTarget.style.background=`color-mix(in srgb, ${C.azulProfundo} 7%, transparent)`}}
            onMouseLeave={e=>{if(!dis&&!isA)e.currentTarget.style.background="transparent"}}
          >
            {t.icon&&<span style={{display:"flex"}}>{typeof t.icon==="function"?t.icon(ic):t.icon}</span>}
            {t.label}
            {t.count!==undefined&&<span style={{minWidth:18,height:18,borderRadius:999,background:isA?`${C.branco}30`:C.cinzaClaro,color:isA?C.branco:C.cinzaChumbo,fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 5px",fontFamily:Fn.mono}}>{t.count}</span>}
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════
   TABS — GUIA (folder/browser tab style)
   ═══════════════════════════════════════════ */
function TabsGuia({tabs=[],active=0,onChange,size="md"}){
  const sz={sm:{fs:11,py:8,px:18},md:{fs:12,py:10,px:20},lg:{fs:13,py:12,px:24}};
  const s=sz[size]||sz.md;
  return(
    <div className="ds-tabs-scroll" style={{gap:0,alignItems:"flex-end",position:"relative"}}>
      {tabs.map((t,i)=>{
        const isA=active===i;const dis=t.disabled;
        const ic=isA?C.azulEscuro:C.cinzaChumbo;
        return(
          <div key={i} onClick={()=>!dis&&onChange?.(i)} style={{
            padding:`${s.py}px ${s.px}px`,
            fontSize:s.fs,fontWeight:isA?700:500,fontFamily:Fn.body,
            color:dis?C.textLight:isA?C.azulEscuro:C.cinzaChumbo,
            background:C.cardBg,
            borderRadius:"10px 10px 0 0",
            border:"none",
            cursor:dis?"not-allowed":"pointer",
            display:"flex",alignItems:"center",gap:7,whiteSpace:"nowrap",
            transition:"all .2s ease",opacity:dis?.45:1,
            position:"relative",zIndex:isA?3:1,
            boxShadow:isA?"0 -4px 12px rgba(0,42,104,.1), 0 -1px 4px rgba(0,42,104,.06)":"none",
          }}
            onMouseEnter={e=>{if(!dis&&!isA){e.currentTarget.style.color=C.azulEscuro;e.currentTarget.style.boxShadow="0 -2px 8px rgba(0,42,104,.05)"}}}
            onMouseLeave={e=>{if(!dis&&!isA){e.currentTarget.style.color=C.cinzaChumbo;e.currentTarget.style.boxShadow="none"}}}
          >
            {t.icon&&<span style={{display:"flex"}}>{typeof t.icon==="function"?t.icon(ic):t.icon}</span>}
            {t.label}
            {t.count!==undefined&&<span style={{minWidth:20,height:20,borderRadius:999,background:isA?(t.color||C.azulProfundo):`${C.cinzaChumbo}18`,color:isA?C.branco:C.cinzaChumbo,fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 6px",fontFamily:Fn.mono,transition:"all .2s"}}>{t.count}</span>}
            {t.dot&&<span style={{width:7,height:7,borderRadius:"50%",background:t.dotColor||C.verdeFloresta}}/>}
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════
   TABS — BORDERED (vertical capable)
   ═══════════════════════════════════════════ */
function TabsBordered({tabs=[],active=0,onChange,size="md",vertical}){
  const sz={sm:{fs:12,py:7,px:14},md:{fs:13,py:9,px:16},lg:{fs:14,py:11,px:20}};
  const s=sz[size]||sz.md;
  return(
    <div style={{display:"flex",flexDirection:vertical?"column":"row",gap:vertical?1:4,flexWrap:vertical?"nowrap":"wrap"}}>
      {tabs.map((t,i)=>{
        const isA=active===i;const dis=t.disabled;
        const ic=isA?C.azulProfundo:C.cinzaChumbo;
        return(
          <div key={i} onClick={()=>!dis&&onChange?.(i)} style={{
            padding:`${s.py}px ${s.px}px`,fontSize:s.fs,
            fontWeight:isA?600:400,fontFamily:Fn.body,
            color:dis?C.textLight:isA?C.azulProfundo:C.cinzaChumbo,
            background:isA?`color-mix(in srgb, ${C.azulProfundo} 2%, transparent)`:"transparent",
            border:vertical?"none":`1px solid ${isA?`color-mix(in srgb, ${C.azulProfundo} 19%, transparent)`:C.cardBorder}`,
            borderLeft:vertical?`2px solid ${isA?C.amareloEscuro:"transparent"}`:(isA?`1px solid color-mix(in srgb, ${C.azulProfundo} 19%, transparent)`:`1px solid ${C.cardBorder}`),
            borderRadius:vertical?"0 6px 6px 0":6,
            cursor:dis?"not-allowed":"pointer",
            display:"flex",alignItems:"center",gap:7,whiteSpace:"nowrap",
            transition:"all .2s ease",opacity:dis?.45:1,
          }}
            onMouseEnter={e=>{if(!dis&&!isA){e.currentTarget.style.background=`color-mix(in srgb, ${C.azulProfundo} 2%, transparent)`;e.currentTarget.style.color=C.cinzaEscuro}}}
            onMouseLeave={e=>{if(!dis&&!isA){e.currentTarget.style.background="transparent";e.currentTarget.style.color=C.cinzaChumbo}}}
          >
            {t.icon&&<span style={{display:"flex",color:isA?C.amareloEscuro:C.cinzaChumbo,transition:"color .2s"}}>{typeof t.icon==="function"?t.icon(ic):t.icon}</span>}
            {t.label}
            {t.count!==undefined&&<span style={{minWidth:18,height:18,borderRadius:999,background:isA?C.azulProfundo:`${C.cinzaChumbo}15`,color:isA?C.branco:C.cinzaChumbo,fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 5px",fontFamily:Fn.mono,marginLeft:vertical?"auto":0,transition:"all .2s"}}>{t.count}</span>}
            {t.dot&&<span style={{width:6,height:6,borderRadius:"50%",background:t.dotColor||C.verdeFloresta,marginLeft:vertical?"auto":0}}/>}
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════ CONTENT PANEL with fade ═══════════════════════════════════════════ */
function TabContent({children,k}){return <div key={k} style={{padding:"10px 0",fontSize:13,color:C.cinzaEscuro,fontFamily:Fn.body,lineHeight:1.6,animation:"tabFadeIn .25s ease"}}>{children}</div>}

/* ═══════════════════════════════════════════ LAYOUT ═══════════════════════════════════════════ */
function Section({n,title,desc,children}){return(<section style={{marginBottom:44}}><div style={{fontSize:10,fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",color:C.azulClaro,fontFamily:Fn.title,marginBottom:6}}>{n}</div><h2 style={{fontSize:20,fontWeight:700,color:C.cinzaEscuro,margin:"0 0 4px",fontFamily:Fn.title,letterSpacing:".5px"}}>{title}</h2><p style={{fontSize:14,color:C.cinzaChumbo,margin:"0 0 20px",lineHeight:1.55,fontFamily:Fn.body}}>{desc}</p>{children}</section>)}
function DSCard({children,s,mob:m}){return(<div style={{background:C.cardBg,borderRadius:"12px 12px 12px 24px",border:`1px solid ${C.cardBorder}`,padding:m?16:28,boxShadow:"0 1px 3px rgba(0,75,155,.04),0 4px 14px rgba(0,75,155,.03)",...s}}>{children}</div>)}

const gc={background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:"10px 10px 10px 18px",overflow:"hidden"};
const gh={padding:"16px 20px",background:C.bg,borderBottom:`1px solid ${C.cardBorder}`,display:"flex",alignItems:"center",gap:12};
const gb={padding:"16px 20px 20px"};
const gl={fontSize:10,fontWeight:700,letterSpacing:"1.2px",textTransform:"uppercase",color:C.azulClaro,fontFamily:Fn.title,marginBottom:4,marginTop:12};
const gt={fontSize:13,color:C.cinzaEscuro,lineHeight:1.55,margin:0,fontFamily:Fn.body};
const ge={fontSize:12,color:C.cinzaChumbo,lineHeight:1.5,margin:0,fontFamily:Fn.body,fontStyle:"italic",paddingLeft:10,borderLeft:`2px solid ${C.azulCeuClaro}`};
const gk={fontSize:11,fontFamily:Fn.mono,color:C.cinzaChumbo,background:C.cardBg,padding:"2px 8px",borderRadius:4,border:`1px solid ${C.cardBorder}`};
function TokenRow({label,value,color}){return(<div style={{display:"flex",alignItems:"center",gap:10,fontSize:12,fontFamily:Fn.body}}>{color&&<div style={{width:16,height:16,borderRadius:4,background:color,border:`1px solid ${C.cardBorder}`,flexShrink:0}}/>}<span style={{color:C.cinzaChumbo,minWidth:130}}>{label}</span><code style={{background:C.neutro,padding:"2px 8px",borderRadius:4,fontSize:11,fontFamily:Fn.mono,color:C.cinzaEscuro}}>{value}</code></div>)}

/* ═══════════════════════════════════════════ EXPORT CODE ═══════════════════════════════════════════ */
const TABS_UNDERLINE_CODE = `// DS-FIPS — Tabs (Underline) — Copy-paste ready
import { useState, useEffect, useRef } from "react";

const C = {
  azulProfundo: "#004B9B",
  azulEscuro: "#002A68",
  cinzaChumbo: "#7B8C96",
  cinzaEscuro: "#333B41",
  amareloEscuro: "#F6921E",
  branco: "#FFFFFF",
  cardBorder: "#E2E8F0",
  textLight: "#7B8C96",
};

const Fn = {
  body: "'Open Sans', sans-serif",
  mono: "'Fira Code', monospace",
};

interface Tab {
  label: string;
  icon?: (color: string) => React.ReactNode;
  count?: number;
  disabled?: boolean;
}

export function TabsUnderline({
  tabs = [], active = 0, onChange, size = "md",
}: {
  tabs: Tab[]; active?: number;
  onChange?: (i: number) => void; size?: "sm" | "md" | "lg";
}) {
  const sz = { sm: { fs: 12, py: 8, px: 16 }, md: { fs: 13, py: 10, px: 20 }, lg: { fs: 14, py: 12, px: 24 } };
  const s = sz[size] || sz.md;
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const [line, setLine] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const el = refs.current[active];
    if (el) setLine({ left: el.offsetLeft, width: el.offsetWidth });
  }, [active, tabs.length]);

  return (
    <div style={{ position: "relative", display: "flex", borderBottom: \`2px solid \${C.cardBorder}\`, overflow: "hidden" }}>
      {tabs.map((t, i) => {
        const isA = active === i;
        const dis = t.disabled;
        const ic = isA ? C.amareloEscuro : C.cinzaChumbo;
        return (
          <div key={i} ref={(el) => (refs.current[i] = el)}
            onClick={() => !dis && onChange?.(i)}
            style={{
              padding: \`\${s.py}px \${s.px}px\`, fontSize: s.fs,
              fontWeight: isA ? 600 : 400, fontFamily: Fn.body,
              color: dis ? C.textLight : isA ? C.azulEscuro : C.cinzaChumbo,
              cursor: dis ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", gap: 7,
              whiteSpace: "nowrap", transition: "all .2s",
              opacity: dis ? 0.45 : 1,
            }}
          >
            {t.icon && <span style={{ display: "flex" }}>{t.icon(ic)}</span>}
            {t.label}
            {t.count !== undefined && (
              <span style={{
                minWidth: 18, height: 18, borderRadius: 999,
                background: isA ? C.azulProfundo : "#C0CCD2",
                color: isA ? C.branco : C.cinzaChumbo,
                fontSize: 10, fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "0 5px", fontFamily: Fn.mono,
              }}>{t.count}</span>
            )}
          </div>
        );
      })}
      <div style={{
        position: "absolute", bottom: -2, left: line.left, width: line.width,
        height: 3, background: C.amareloEscuro, borderRadius: "3px 3px 0 0",
        transition: "left .3s cubic-bezier(.4,0,.2,1), width .3s cubic-bezier(.4,0,.2,1)",
      }} />
    </div>
  );
}

// Usage:
// const [active, setActive] = useState(0);
// <TabsUnderline tabs={[{label:"Home"},{label:"Docs"},{label:"Off",disabled:true}]} active={active} onChange={setActive} />
`;

const TABS_FILLED_CODE = `// DS-FIPS — Tabs (Filled) — Copy-paste ready
import { useState } from "react";
const C={azulProfundo:"#004B9B",cinzaChumbo:"#7B8C96",cinzaEscuro:"#333B41",cinzaClaro:"#C0CCD2",branco:"#FFFFFF",bg:"#F8FAFC",textLight:"#7B8C96"};
const Fn={body:"'Open Sans',sans-serif",mono:"'Fira Code',monospace"};

export function TabsFilled({tabs=[],active=0,onChange,size="md"}){
  const sz={sm:{fs:12,py:7,px:14},md:{fs:13,py:9,px:18},lg:{fs:14,py:11,px:22}};
  const s=sz[size]||sz.md;
  return(
    <div style={{display:"flex",gap:6,background:C.bg,padding:4,borderRadius:10,flexWrap:"wrap"}}>
      {tabs.map((t,i)=>{
        const isA=active===i; const dis=t.disabled;
        return(
          <div key={i} onClick={()=>!dis&&onChange?.(i)} style={{padding:\`\${s.py}px \${s.px}px\`,fontSize:s.fs,fontWeight:isA?700:500,fontFamily:Fn.body,color:dis?C.textLight:isA?C.branco:C.cinzaEscuro,background:isA?C.azulProfundo:"transparent",borderRadius:7,cursor:dis?"not-allowed":"pointer",display:"flex",alignItems:"center",gap:6,whiteSpace:"nowrap",transition:"all .25s",opacity:dis?.45:1,boxShadow:isA?"0 2px 8px rgba(0,75,155,.25)":"none"}}>
            {t.icon&&<span style={{display:"flex"}}>{typeof t.icon==="function"?t.icon(isA?C.branco:C.cinzaEscuro):t.icon}</span>}
            {t.label}
            {t.count!==undefined&&<span style={{minWidth:18,height:18,borderRadius:999,background:isA?\`\${C.branco}30\`:C.cinzaClaro,color:isA?C.branco:C.cinzaChumbo,fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 5px",fontFamily:Fn.mono}}>{t.count}</span>}
          </div>
        );
      })}
    </div>
  );
}
// USO: <TabsFilled tabs={[{label:"Todas",count:23},{label:"Ativas",count:8}]} active={0} onChange={setActive} />
`;

const TABS_GUIA_CODE = `// DS-FIPS — Tabs (Guia) — Copy-paste ready
import { useState } from "react";
const C={azulEscuro:"#002A68",azulProfundo:"#004B9B",cinzaChumbo:"#7B8C96",cinzaEscuro:"#333B41",branco:"#FFFFFF",cardBg:"#FFFFFF",textLight:"#7B8C96",verdeFloresta:"#00C64C"};
const Fn={body:"'Open Sans',sans-serif",mono:"'Fira Code',monospace"};

export function TabsGuia({tabs=[],active=0,onChange,size="md"}){
  const sz={sm:{fs:11,py:8,px:18},md:{fs:12,py:10,px:20},lg:{fs:13,py:12,px:24}};
  const s=sz[size]||sz.md;
  return(
    <div style={{display:"flex",gap:0,alignItems:"flex-end",position:"relative"}}>
      {tabs.map((t,i)=>{
        const isA=active===i; const dis=t.disabled;
        return(
          <div key={i} onClick={()=>!dis&&onChange?.(i)} style={{padding:\`\${s.py}px \${s.px}px\`,fontSize:s.fs,fontWeight:isA?700:500,fontFamily:Fn.body,color:dis?C.textLight:isA?C.azulEscuro:C.cinzaChumbo,background:C.cardBg,borderRadius:"10px 10px 0 0",border:"none",cursor:dis?"not-allowed":"pointer",display:"flex",alignItems:"center",gap:7,whiteSpace:"nowrap",transition:"all .2s",opacity:dis?.45:1,position:"relative",zIndex:isA?3:1,boxShadow:isA?"0 -4px 12px rgba(0,42,104,.1)":"none"}}>
            {t.icon&&<span style={{display:"flex"}}>{typeof t.icon==="function"?t.icon(isA?C.azulEscuro:C.cinzaChumbo):t.icon}</span>}
            {t.label}
            {t.count!==undefined&&<span style={{minWidth:20,height:20,borderRadius:999,background:isA?(t.color||C.azulProfundo):\`\${C.cinzaChumbo}18\`,color:isA?C.branco:C.cinzaChumbo,fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 6px",fontFamily:Fn.mono}}>{t.count}</span>}
            {t.dot&&<span style={{width:7,height:7,borderRadius:"50%",background:t.dotColor||C.verdeFloresta}}/>}
          </div>
        );
      })}
    </div>
  );
}
// USO: <TabsGuia tabs={[{label:"Todos"},{label:"Pendentes"},{label:"Aprovados"}]} active={0} onChange={setActive} />
`;

const TABS_BORDERED_CODE = `// DS-FIPS — Tabs (Bordered) — Copy-paste ready
import { useState } from "react";
const C={azulProfundo:"#004B9B",azulEscuro:"#002A68",cinzaChumbo:"#7B8C96",cinzaEscuro:"#333B41",cinzaClaro:"#C0CCD2",amareloEscuro:"#F6921E",branco:"#FFFFFF",cardBorder:"#E2E8F0",textLight:"#7B8C96",verdeFloresta:"#00C64C"};
const Fn={body:"'Open Sans',sans-serif",mono:"'Fira Code',monospace"};

export function TabsBordered({tabs=[],active=0,onChange,size="md",vertical=false}){
  const sz={sm:{fs:12,py:7,px:14},md:{fs:13,py:9,px:16},lg:{fs:14,py:11,px:20}};
  const s=sz[size]||sz.md;
  return(
    <div style={{display:"flex",flexDirection:vertical?"column":"row",gap:vertical?1:4,flexWrap:vertical?"nowrap":"wrap"}}>
      {tabs.map((t,i)=>{
        const isA=active===i; const dis=t.disabled;
        return(
          <div key={i} onClick={()=>!dis&&onChange?.(i)} style={{padding:\`\${s.py}px \${s.px}px\`,fontSize:s.fs,fontWeight:isA?600:400,fontFamily:Fn.body,color:dis?C.textLight:isA?C.azulProfundo:C.cinzaChumbo,background:isA?"rgba(0,75,155,0.02)":"transparent",border:vertical?"none":\`1px solid \${isA?"rgba(0,75,155,0.19)":C.cardBorder}\`,borderLeft:vertical?\`2px solid \${isA?C.amareloEscuro:"transparent"}\`:undefined,borderRadius:vertical?"0 6px 6px 0":6,cursor:dis?"not-allowed":"pointer",display:"flex",alignItems:"center",gap:7,whiteSpace:"nowrap",transition:"all .2s",opacity:dis?.45:1}}>
            {t.icon&&<span style={{display:"flex",color:isA?C.amareloEscuro:C.cinzaChumbo}}>{typeof t.icon==="function"?t.icon(isA?C.azulProfundo:C.cinzaChumbo):t.icon}</span>}
            {t.label}
            {t.count!==undefined&&<span style={{minWidth:18,height:18,borderRadius:999,background:isA?C.azulProfundo:\`\${C.cinzaChumbo}15\`,color:isA?C.branco:C.cinzaChumbo,fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 5px",fontFamily:Fn.mono,marginLeft:vertical?"auto":0}}>{t.count}</span>}
            {t.dot&&<span style={{width:6,height:6,borderRadius:"50%",background:t.dotColor||C.verdeFloresta,marginLeft:vertical?"auto":0}}/>}
          </div>
        );
      })}
    </div>
  );
}
// USO: <TabsBordered tabs={[{label:"Perfil"},{label:"Segurança"},{label:"Notificações",count:3}]} active={0} onChange={setActive} vertical />
`;

/* ═══════════════════════════════════════════ COPYABLE HELPERS ═══════════════════════════════════════════ */
function tabsCopyCode(variant: string, tabs: string) {
  const styles: Record<string, { bg: string; activeBg: string; activeColor: string; inactiveColor: string; border: string; indicator: string }> = {
    underline: { bg: "transparent", activeBg: "transparent", activeColor: "#002A68", inactiveColor: "#7B8C96", border: "none", indicator: "underline" },
    filled: { bg: "#F1F5F9", activeBg: "#004B9B", activeColor: "#FFFFFF", inactiveColor: "#333B41", border: "none", indicator: "fill" },
    guia: { bg: "transparent", activeBg: "#004B9B10", activeColor: "#004B9B", inactiveColor: "#7B8C96", border: "1px solid #E2E8F0", indicator: "border" },
    bordered: { bg: "transparent", activeBg: "#FFFFFF", activeColor: "#333B41", inactiveColor: "#7B8C96", border: "1px solid #E2E8F0", indicator: "top-border" },
  };
  const s = styles[variant] || styles.underline;
  const label = variant.charAt(0).toUpperCase() + variant.slice(1);

  return `// DS-FIPS — Tabs ${label} — Copy-paste ready
import { useState } from "react";

const TABS = ${tabs};

export function Tabs${label}() {
  const [active, setActive] = useState(0);

  return (
    <div style={{ position: "relative" }}>
      <div style={{
        display: "flex", gap: ${variant === 'filled' ? 4 : 0},
        ${s.border !== 'none' ? `border: "${s.border}",` : ''}
        ${variant === 'filled' ? 'background: "#F1F5F9", borderRadius: 8, padding: 3,' : ''}
        ${variant === 'underline' ? 'borderBottom: "2px solid #E2E8F0",' : ''}
      }}>
        {TABS.map((tab, i) => {
          const isActive = i === active;
          const isDisabled = tab.disabled;
          return (
            <button
              key={i}
              onClick={() => !isDisabled && setActive(i)}
              disabled={isDisabled}
              style={{
                padding: "8px 20px",
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                fontFamily: "'Open Sans', sans-serif",
                color: isDisabled ? "#C0CCD2" : isActive ? "${s.activeColor}" : "${s.inactiveColor}",
                background: isActive ? "${s.activeBg}" : "${s.bg}",
                border: "none",
                ${variant === 'bordered' ? 'borderTop: isActive ? "2px solid #F6921E" : "2px solid transparent",' : ''}
                ${variant === 'filled' ? 'borderRadius: 6,' : ''}
                cursor: isDisabled ? "not-allowed" : "pointer",
                transition: "all 0.15s",
                opacity: isDisabled ? 0.5 : 1,
                position: "relative",
              }}
            >
              {tab.label}
              {tab.count != null && (
                <span style={{
                  marginLeft: 6, fontSize: 10, fontWeight: 700,
                  padding: "1px 6px", borderRadius: 10,
                  background: isActive ? "rgba(255,255,255,0.2)" : "#E2E8F0",
                  color: isActive ? "${s.activeColor}" : "#7B8C96",
                }}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
      ${variant === 'underline' ? `{/* Underline indicator */}
      <div style={{
        position: "absolute", bottom: -2, height: 3,
        background: "#F6921E", borderRadius: "3px 3px 0 0",
        transition: "left 0.3s, width 0.3s",
      }} />` : ''}
    </div>
  );
}

// Uso: <Tabs${label} />
`;
}

/* ═══════════════════════════════════════════ MAIN ═══════════════════════════════════════════ */
export default function TabsDoc(){
  const [w,setW]=useState(typeof window!=="undefined"?window.innerWidth:1200);
  useEffect(()=>{const h=()=>setW(window.innerWidth);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h)},[]);
  const mob=w<640;

  const [p1,setP1]=useState(0);
  const [v1,setV1]=useState(0);const [v2,setV2]=useState(0);const [v3,setV3]=useState(0);const [v4,setV4]=useState(0);
  const [sc1,setSc1]=useState(0);const [sc2,setSc2]=useState(0);const [sc3,setSc3]=useState(0);const [sc4,setSc4]=useState(0);
  const [vert,setVert]=useState(0);
  const [cfgTab,setCfgTab]=useState(0);
  const [fipsSegTab,setFipsSegTab]=useState("notificacoes");

  const fipsConfigTabs=[
    {id:"notificacoes",label:"Notificações",icon:<Bell size={14} strokeWidth={1.9}/>},
    {id:"backup",label:"Backup",icon:<Database size={14} strokeWidth={1.9}/>},
    {id:"sistema",label:"Sistema",icon:<HardDrive size={14} strokeWidth={1.9}/>},
  ];

  const mainTabs=[
    {label:"Home",icon:(c)=>Ic.home(14,c)},
    {label:"Nova Solicitação",icon:(c)=>Ic.doc(14,c)},
    {label:"Minhas Solicitações",icon:(c)=>Ic.list(14,c)},
    {label:"Banco de Projetos",icon:(c)=>Ic.folder(14,c)},
    {label:"Painel de Análise",icon:(c)=>Ic.chart(14,c)},
  ];
  const mainContent=[
    <TabContent k={0}><strong style={{color:C.cinzaEscuro}}>Home</strong> — Dashboard com indicadores consolidados, KPIs e alertas recentes. Dados em tempo real.</TabContent>,
    <TabContent k={1}><strong style={{color:C.cinzaEscuro}}>Nova Solicitação</strong> — Formulário de abertura de solicitação com campos obrigatórios e anexos.</TabContent>,
    <TabContent k={2}><strong style={{color:C.cinzaEscuro}}>Minhas Solicitações</strong> — Lista de solicitações criadas por você. Filtros por status e data.</TabContent>,
    <TabContent k={3}><strong style={{color:C.cinzaEscuro}}>Banco de Projetos</strong> — Projetos em andamento com timeline, responsáveis e progresso.</TabContent>,
    <TabContent k={4}><strong style={{color:C.cinzaEscuro}}>Painel de Análise</strong> — Relatórios e gráficos de desempenho por período e departamento.</TabContent>,
  ];

  return(
    <PlaygroundProvider>
    <div style={{minHeight:"100vh",background:"var(--color-surface-muted)",fontFamily:Fn.body,color:C.cinzaEscuro}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Saira+Expanded:wght@300;400;500;600;700;800&family=Open+Sans:wght@300;400;600;700&family=Fira+Code:wght@400;500&display=swap');
        @keyframes tabFadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        .ds-tabs-scroll{display:flex;overflow-x:auto;-ms-overflow-style:none;scrollbar-width:none}
        .ds-tabs-scroll::-webkit-scrollbar{display:none}
      `}</style>

      {/* HEADER */}
      <header style={{background:`linear-gradient(135deg,${C.azulProfundo} 0%,${C.azulEscuro} 100%)`,padding:mob?"32px 20px":"48px 40px 44px",position:"relative",overflow:"hidden"}}>
        <JunctionLines style={{position:"absolute",top:-10,right:-20,width:mob?250:400,height:250}}/>
        <div style={{position:"relative"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:6,background:`${C.branco}10`,border:`1px solid ${C.branco}18`,borderRadius:20,padding:"5px 14px",fontSize:11,fontWeight:600,letterSpacing:"1.5px",textTransform:"uppercase",color:C.amareloOuro,fontFamily:Fn.title,marginBottom:16}}>{Ic.grid(14,C.amareloOuro)} Design System FIPS</div>
          <h1 style={{fontSize:mob?30:44,fontWeight:700,color:C.branco,margin:"0 0 10px",fontFamily:Fn.title}}>Tabs</h1>
          <p style={{fontSize:16,color:`${C.branco}B0`,lineHeight:1.6,maxWidth:700,margin:0,fontFamily:Fn.body}}>Navegação por abas com indicador deslizante, hover interativo e transição de conteúdo animada. Quatro variantes para diferentes contextos.</p>
        </div>
      </header>

      <div style={{padding:mob?"24px 16px 40px":"36px 40px 60px",maxWidth:1100,margin:"0 auto"}}>

        {/* 01 — PLAYGROUND */}
        <Section n="01" title="Playground interativo" desc="Clique nas abas — o indicador desliza suavemente e o conteúdo aparece com fade. Hover muda o fundo da aba.">
          <DSCard mob={mob}>
            <TabsUnderline tabs={mainTabs} active={p1} onChange={setP1} size="md"/>
            {mainContent[p1]}
          </DSCard>
        </Section>

        {/* 02 — VARIANTES */}
        <Section n="02" title="Variantes visuais" desc="Quatro estilos com hover, transição e destaque forte. Clique em qualquer variante para copiar o código e visualizar no playground abaixo.">
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:16,alignItems:"start"}}>
            {/* Underline */}
            <Copyable label="Tabs Underline" code={tabsCopyCode("underline",'[{label:"Geral"},{label:"Detalhes"},{label:"Histórico"},{label:"Off",disabled:true}]')} preview={<TabsUnderline tabs={[{label:"Geral"},{label:"Detalhes"},{label:"Histórico"},{label:"Off",disabled:true}]} active={0} onChange={()=>{}} size="sm"/>}>
            <div style={{...gc,borderLeft:`4px solid ${C.azulProfundo}`}}>
              <div style={gh}><span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>Underline</span><code style={gk}>★ padrão</code></div>
              <div style={gb}>
                <TabsUnderline tabs={[{label:"Geral",icon:(c)=>Ic.home(12,c)},{label:"Detalhes",icon:(c)=>Ic.doc(12,c)},{label:"Histórico",icon:(c)=>Ic.clock(12,c)},{label:"Off",icon:(c)=>Ic.lock(12,c),disabled:true}]} active={v1} onChange={setV1} size="sm"/>
                <div style={gl}>Significado</div>
                <p style={gt}>Indicador deslizante 3px laranja (amarelo escuro FIPS) que acompanha a aba ativa. Ícone muda para laranja no ativo. Texto azul escuro ativo, cinza inativo. Hover escurece o texto.</p>
                <div style={gl}>Quando usar</div>
                <p style={gt}>Navegação principal, tabs de detalhe, qualquer contexto padrão.</p>
                <div style={gl}>Exemplo FIPS</div>
                <p style={ge}>Tabs do App Suprimentos; seções de detalhe; App Visitante.</p>
                <InlineCodeCopy label="Underline" code={TABS_UNDERLINE_CODE}/>
              </div>
            </div>
            </Copyable>

            {/* Filled */}
            <Copyable label="Tabs Filled" code={tabsCopyCode("filled",'[{label:"Todas",count:23},{label:"Inovação",count:8},{label:"Operações",count:9},{label:"Off",disabled:true}]')} preview={<TabsFilled tabs={[{label:"Todas",count:23},{label:"Inovação",count:8},{label:"Operações",count:9}]} active={0} onChange={()=>{}} size="sm"/>}>
            <div style={{...gc,borderLeft:`4px solid ${C.verdeFloresta}`}}>
              <div style={gh}><span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>Filled</span><code style={gk}>destaque forte</code></div>
              <div style={gb}>
                <TabsFilled tabs={[{label:"Todas",icon:(c)=>Ic.list(12,c),count:23},{label:"Inovação",icon:(c)=>Ic.chart(12,c),count:8},{label:"Operações",icon:(c)=>Ic.settings(12,c),count:9},{label:"Off",icon:(c)=>Ic.lock(12,c),disabled:true}]} active={v2} onChange={setV2} size="sm"/>
                <div style={gl}>Significado</div>
                <p style={gt}>Fundo azul com sombra na aba ativa. Container cinza. Máximo contraste e destaque. Hover sutil azul.</p>
                <div style={gl}>Quando usar</div>
                <p style={gt}>Filtros de categoria, toolbar, modos de visualização.</p>
                <div style={gl}>Exemplo FIPS</div>
                <p style={ge}>Categorias no App Ideias; filtros rápidos em dashboards.</p>
                <InlineCodeCopy label="Filled" code={TABS_FILLED_CODE}/>
              </div>
            </div>
            </Copyable>

            {/* Guia */}
            <Copyable label="Tabs Guia" code={tabsCopyCode("guia",'[{label:"Todos"},{label:"Pendentes"},{label:"Aprovados"},{label:"Rejeitados"}]')} preview={<TabsGuia tabs={[{label:"Todos"},{label:"Pendentes"},{label:"Aprovados"},{label:"Rejeitados"}]} active={0} onChange={()=>{}} size="sm"/>}>
            <div style={{...gc,borderLeft:`4px solid ${C.amareloEscuro}`}}>
              <div style={gh}><span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>Guia</span><code style={gk}>filtro de tabela</code></div>
              <div style={gb}>
                <TabsGuia tabs={[{label:"Todos",icon:(c)=>Ic.list(12,c)},{label:"Pendentes",icon:(c)=>Ic.clock(12,c)},{label:"Aprovados",icon:(c)=>Ic.shield(12,c)},{label:"Rejeitados",icon:(c)=>Ic.lock(12,c)}]} active={v3} onChange={setV3} size="sm"/>
                <div style={gl}>Significado</div>
                <p style={gt}>Projetada para ser posicionada acima de tabelas como filtro de dados. Topo arredondado, aba ativa com sombra que "levanta" — funciona como extensão visual da tabela abaixo. Sem fundo cinza, sem borda — só sombra define a aba ativa.</p>
                <div style={gl}>Quando usar</div>
                <p style={gt}>Sempre acima de tabelas para filtrar registros por categoria, status ou período. O padrão "Guia + Tabela" é o uso canônico.</p>
                <div style={gl}>Exemplo FIPS</div>
                <p style={ge}>Guia + Tabela de fornecedores no App Suprimentos; filtro de período no Dashboard Power BI; abas de status em listagens.</p>
                <InlineCodeCopy label="Guia" code={TABS_GUIA_CODE}/>
              </div>
            </div>
            </Copyable>

            {/* Bordered */}
            <Copyable label="Tabs Bordered" code={tabsCopyCode("bordered",'[{label:"Perfil"},{label:"Segurança"},{label:"Notificações",count:3},{label:"Admin",disabled:true}]')} preview={<TabsBordered tabs={[{label:"Perfil"},{label:"Segurança"},{label:"Notificações",count:3}]} active={0} onChange={()=>{}} size="sm"/>}>
            <div style={{...gc,borderLeft:`4px solid ${C.azulCeu}`}}>
              <div style={gh}><span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>Bordered</span><code style={gk}>borda + vertical</code></div>
              <div style={gb}>
                <TabsBordered tabs={[{label:"Perfil",icon:(c)=>Ic.pessoa(12,c)},{label:"Segurança",icon:(c)=>Ic.shield(12,c)},{label:"Notificações",icon:(c)=>Ic.bell(12,c),count:3},{label:"Admin",icon:(c)=>Ic.lock(12,c),disabled:true}]} active={v4} onChange={setV4} size="sm"/>
                <div style={gl}>Significado</div>
                <p style={gt}>Borda sutil ao redor (30% opacity no ativo). Vertical usa borda esquerda laranja 2px como indicador. Fundo ultra-leve, hover delicado.</p>
                <div style={gl}>Quando usar</div>
                <p style={gt}>Configurações, formulários multi-parte, sidebar de navegação vertical.</p>
                <div style={gl}>Exemplo FIPS</div>
                <p style={ge}>Seções de configuração; sidebar do App Acesso; formulários multi-step.</p>
                <InlineCodeCopy label="Bordered" code={TABS_BORDERED_CODE}/>
              </div>
            </div>
            </Copyable>
          </div>
        </Section>

        {/* 03 — VERTICAL */}
        <Section n="03" title="Orientação vertical" desc="Tabs empilhadas para sidebars. Borda lateral laranja 2px na aba ativa. Ícone contextual, hover sutil.">
          <DSCard mob={mob}>
            <div style={{display:"flex",gap:0,flexWrap:"wrap"}}>
              <div style={{width:mob?"100%":220,borderRight:mob?"none":`1px solid ${C.cardBorder}`,paddingRight:mob?0:24}}>
                <TabsBordered tabs={[{label:"Perfil",icon:(c)=>Ic.pessoa(14,c)},{label:"Segurança",icon:(c)=>Ic.shield(14,c)},{label:"Notificações",icon:(c)=>Ic.bell(14,c),count:3},{label:"Integrações",icon:(c)=>Ic.settings(14,c)},{label:"Avançado",icon:(c)=>Ic.lock(14,c),disabled:true}]} active={vert} onChange={setVert} size="md" vertical/>
              </div>
              <div style={{flex:1,paddingLeft:mob?0:24,minWidth:0}}>
                {vert===0&&<TabContent k="v0"><strong style={{color:C.cinzaEscuro}}>Perfil</strong> — Dados pessoais, foto, departamento e cargo. Edite suas informações de cadastro.</TabContent>}
                {vert===1&&<TabContent k="v1"><strong style={{color:C.cinzaEscuro}}>Segurança</strong> — Alterar senha, 2FA, sessões ativas e log de acessos.</TabContent>}
                {vert===2&&<TabContent k="v2"><strong style={{color:C.cinzaEscuro}}>Notificações</strong> — Configurar alertas: email, SMS, push. 3 pendentes.</TabContent>}
                {vert===3&&<TabContent k="v3"><strong style={{color:C.cinzaEscuro}}>Integrações</strong> — Power BI, N8N, App Cadastros. Gerenciar tokens de API.</TabContent>}
                {vert===4&&<TabContent k="v4"><span style={{color:C.textMuted}}>Acesso restrito ao administrador.</span></TabContent>}
              </div>
            </div>
          </DSCard>
        </Section>

        {/* 04 — CENÁRIOS */}
        <Section n="04" title="Cenários de negócio" desc="Tabs aplicadas em contextos reais do ecossistema FIPS. Todas interativas.">
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:16,alignItems:"start"}}>
            <div style={{background:C.bg,border:`1px solid ${C.cardBorder}`,borderRadius:"10px 10px 10px 20px",padding:mob?12:18}}>
              <h3 style={{fontSize:14,fontWeight:700,color:C.cinzaEscuro,margin:"0 0 4px",fontFamily:Fn.title}}>App Ocorrências</h3>
              <p style={{fontSize:12,color:C.cinzaChumbo,margin:"0 0 10px"}}>Detalhe — Info / Histórico / Anexos</p>
              <div style={{background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:8,padding:12}}>
                <TabsUnderline tabs={[{label:"Informações",icon:(c)=>Ic.doc(12,c)},{label:"Histórico",icon:(c)=>Ic.clock(12,c)},{label:"Anexos",icon:(c)=>Ic.clip(12,c),count:2}]} active={sc1} onChange={setSc1} size="sm"/>
                {sc1===0&&<TabContent k="s0">Tipo, local, responsável, status e descrição da ocorrência.</TabContent>}
                {sc1===1&&<TabContent k="s1">Linha do tempo: criação → notificação → atualização → resolução.</TabContent>}
                {sc1===2&&<TabContent k="s2">2 anexos: foto (JPG, 2.4MB) e relatório (PDF, 890KB).</TabContent>}
              </div>
            </div>
            <div style={{background:C.bg,border:`1px solid ${C.cardBorder}`,borderRadius:"10px 10px 10px 20px",padding:mob?12:18}}>
              <h3 style={{fontSize:14,fontWeight:700,color:C.cinzaEscuro,margin:"0 0 4px",fontFamily:Fn.title}}>App Suprimentos</h3>
              <p style={{fontSize:12,color:C.cinzaChumbo,margin:"0 0 10px"}}>Tabs com contadores por status</p>
              <div style={{background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:8,padding:12}}>
                <TabsFilled tabs={[{label:"Todas",icon:(c)=>Ic.list(12,c),count:47},{label:"Pendentes",icon:(c)=>Ic.clock(12,c),count:12},{label:"Aprovadas",icon:(c)=>Ic.shield(12,c),count:32},{label:"Rejeitadas",icon:(c)=>Ic.lock(12,c),count:3}]} active={sc2} onChange={setSc2} size="sm"/>
                {sc2===0&&<TabContent k="ss0">47 requisições no total. Use filtros para refinar.</TabContent>}
                {sc2===1&&<TabContent k="ss1">12 requisições aguardando aprovação do gestor.</TabContent>}
                {sc2===2&&<TabContent k="ss2">32 requisições aprovadas e encaminhadas para compra.</TabContent>}
                {sc2===3&&<TabContent k="ss3">3 requisições rejeitadas. Verifique justificativas.</TabContent>}
              </div>
            </div>
            <div style={{background:C.bg,border:`1px solid ${C.cardBorder}`,borderRadius:"10px 10px 10px 20px",padding:mob?12:18}}>
              <h3 style={{fontSize:14,fontWeight:700,color:C.cinzaEscuro,margin:"0 0 4px",fontFamily:Fn.title}}>Guia + Tabela</h3>
              <p style={{fontSize:12,color:C.cinzaChumbo,margin:"0 0 10px"}}>Filtro de status acima da tabela</p>
              <div style={{background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:8,overflow:"hidden"}}>
                <div style={{padding:"12px 12px 0"}}>
                  <TabsGuia tabs={[{label:"Todos",icon:(c)=>Ic.list(12,c)},{label:"Pendentes",icon:(c)=>Ic.clock(12,c)},{label:"Aprovados",icon:(c)=>Ic.shield(12,c)}]} active={sc3} onChange={setSc3} size="sm"/>
                </div>
                <table style={{width:"100%",fontSize:12,borderCollapse:"collapse",fontFamily:Fn.body}}>
                  <thead><tr style={{background:C.bg}}>
                    <th style={{padding:"6px 12px",textAlign:"center",fontWeight:600,color:C.cinzaEscuro,borderBottom:`1px solid ${C.cardBorder}`}}>Item</th>
                    <th style={{padding:"6px 12px",textAlign:"center",fontWeight:600,color:C.cinzaEscuro,borderBottom:`1px solid ${C.cardBorder}`}}>Status</th>
                  </tr></thead>
                  <tbody>
                    {[
                      {item:"Parafuso M10",st:"Pendente",c:"#F6921E"},
                      {item:"Graxa Industrial",st:"Aprovado",c:C.verdeFloresta},
                      {item:"Correia TR-50",st:"Pendente",c:"#F6921E"},
                    ].filter(r=>sc3===0||( sc3===1&&r.st==="Pendente")||(sc3===2&&r.st==="Aprovado")).map((r,i)=>(
                      <tr key={i} style={{borderBottom:`1px solid ${C.cardBorder}`}}>
                        <td style={{padding:"6px 12px",color:C.cinzaEscuro}}>{r.item}</td>
                        <td style={{padding:"6px 12px"}}><span style={{fontSize:11,fontWeight:600,color:r.c}}>{r.st}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div style={{background:C.bg,border:`1px solid ${C.cardBorder}`,borderRadius:"10px 10px 10px 20px",padding:mob?12:18}}>
              <h3 style={{fontSize:14,fontWeight:700,color:C.cinzaEscuro,margin:"0 0 4px",fontFamily:Fn.title}}>Configurações do Usuário</h3>
              <p style={{fontSize:12,color:C.cinzaChumbo,margin:"0 0 10px"}}>Bordered com navegação lateral (legado). Para Suprimentos use FipsTabBar — seção 05.</p>
              <div style={{background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:8,padding:12}}>
                <TabsBordered tabs={[{label:"Perfil",icon:(c)=>Ic.pessoa(12,c)},{label:"Segurança",icon:(c)=>Ic.shield(12,c)},{label:"Notificações",icon:(c)=>Ic.bell(12,c),count:3}]} active={sc4} onChange={setSc4} size="sm"/>
                {sc4===0&&<TabContent k="env0">Nome, departamento, cargo e foto. Edite suas informações de cadastro.</TabContent>}
                {sc4===1&&<TabContent k="env1">Alterar senha, 2FA ativo, sessões recentes e log de acessos.</TabContent>}
                {sc4===2&&<TabContent k="env2">3 alertas pendentes: email, SMS e push. Configure preferências.</TabContent>}
              </div>
            </div>
          </div>

          {/* Cenário: Configuração — full width */}
          <div style={{marginTop:20,background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:"12px 12px 12px 24px",overflow:"hidden"}}>
            <div style={{padding:mob?"16px 16px 0":"24px 28px 0"}}>
              <h2 style={{fontSize:mob?18:22,fontWeight:700,color:C.cinzaEscuro,margin:0,fontFamily:Fn.title}}>Configurações</h2>
              <p style={{fontSize:13,color:C.cinzaChumbo,margin:"4px 0 20px",fontFamily:Fn.body}}>Gerencie as configurações gerais do sistema.</p>
            </div>
            <div className="ds-tabs-scroll" style={{position:"relative",borderBottom:`1.5px solid ${C.cardBorder}`,gap:0,padding:mob?"0 12px":"0 28px"}}>
              {["Geral","Categorias","Departamentos","Permissões","Classificações","Pipeline","Atendimento"].map((t,i)=>{
                const isA=cfgTab===i;
                return(
                  <div key={t} onClick={()=>setCfgTab(i)} style={{padding:mob?"8px 12px":"10px 18px",fontSize:mob?12:13,fontWeight:isA?600:400,fontFamily:Fn.body,color:isA?C.azulEscuro:C.cinzaChumbo,cursor:"pointer",transition:"all .2s",borderBottom:isA?`3px solid ${C.amareloEscuro}`:"3px solid transparent",marginBottom:-2,whiteSpace:"nowrap"}}
                    onMouseEnter={e=>{if(!isA)e.currentTarget.style.color=C.cinzaEscuro}}
                    onMouseLeave={e=>{if(!isA)e.currentTarget.style.color=C.cinzaChumbo}}
                  >{t}</div>
                );
              })}
            </div>
            <div style={{padding:mob?"16px":"24px 28px",background:C.bg,minHeight:140}}>
              {cfgTab===0&&(
                <div style={{background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:10,padding:20}}>
                  <h3 style={{fontSize:15,fontWeight:700,color:C.cinzaEscuro,margin:"0 0 4px",fontFamily:Fn.title}}>Configurações Gerais</h3>
                  <p style={{fontSize:12,color:C.cinzaChumbo,margin:"0 0 16px",fontFamily:Fn.body}}>Informações básicas do sistema.</p>
                  <div style={{display:"flex",flexDirection:"column",gap:0}}>
                    {[{l:"Nome do sistema",v:"FIPS — Ferrovia Interna do Porto de Santos"},{l:"Versão",v:"v2.4.1"},{l:"Ambiente",v:"Produção"},{l:"Último deploy",v:"02/04/2026 às 15:30"}].map((r,i)=>(
                      <div key={r.l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:i<3?`1px solid ${C.cardBorder}`:"none"}}>
                        <span style={{fontSize:12,color:C.cinzaChumbo,fontFamily:Fn.body}}>{r.l}</span>
                        <span style={{fontSize:12,fontWeight:600,color:C.cinzaEscuro,fontFamily:Fn.body}}>{r.v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {cfgTab===1&&<TabContent k="cfg1"><strong style={{color:C.cinzaEscuro}}>Categorias</strong> — Gerenciar categorias de requisições, ocorrências e ideias.</TabContent>}
              {cfgTab===2&&<TabContent k="cfg2"><strong style={{color:C.cinzaEscuro}}>Departamentos</strong> — Estrutura organizacional com hierarquia e gestores.</TabContent>}
              {cfgTab===3&&<TabContent k="cfg3"><strong style={{color:C.cinzaEscuro}}>Permissões</strong> — Perfis de acesso e roles por módulo.</TabContent>}
              {cfgTab===4&&<TabContent k="cfg4"><strong style={{color:C.cinzaEscuro}}>Classificações</strong> — Tabelas auxiliares para formulários e relatórios.</TabContent>}
              {cfgTab===5&&<TabContent k="cfg5"><strong style={{color:C.cinzaEscuro}}>Pipeline</strong> — Fluxos de aprovação e regras de automação.</TabContent>}
              {cfgTab===6&&<TabContent k="cfg6"><strong style={{color:C.cinzaEscuro}}>Atendimento</strong> — Canais, SLA e distribuição de chamados.</TabContent>}
            </div>
          </div>
        </Section>

        {/* 05 — SEGMENTED (FipsTabBar) */}
        <Section n="05" title="Segmented — FipsTabBar" desc="Abas em pílulas dentro de um card com radius assimétrico FIPS. Padrão oficial de Configurações no módulo FIPS Suprimentos (notificações, backup, sistema).">
          <DSCard mob={mob}>
            <FipsTabBar tabs={fipsConfigTabs} activeId={fipsSegTab} onChange={setFipsSegTab}/>
            <div style={{marginTop:16}}>
              {fipsSegTab==="notificacoes"&&<TabContent k="fips-n">Preferências de notificação do escopo — switches por tipo de alerta.</TabContent>}
              {fipsSegTab==="backup"&&<TabContent k="fips-b">Exportação e importação de backup (admin).</TabContent>}
              {fipsSegTab==="sistema"&&<TabContent k="fips-s">Metadados do ambiente e versão do app.</TabContent>}
            </div>
          </DSCard>
          <p style={{fontSize:12,color:C.cinzaChumbo,marginTop:12,fontFamily:Fn.body}}>
            Ver também: <a href="/docs/patterns/configuracoes" style={{color:C.azulProfundo,fontWeight:600}}>Padrão Configurações</a> · componente em <code style={gk}>src/components/composites/FipsTabBar.tsx</code> · export em <code style={gk}>exports/fips-tab-bar/</code>
          </p>
        </Section>

        {/* 06 — TOKENS */}
        <Section n="06" title="Tokens de referência" desc="Valores de design do componente Tabs.">
          <DSCard mob={mob} s={{display:"flex",gap:mob?24:48,flexWrap:"wrap"}}>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:Fn.title,marginBottom:4}}>Cores</span>
              <TokenRow label="Ativo texto" value="#002A68" color={C.azulEscuro}/>
              <TokenRow label="Underline ativo" value="#F6921E" color={C.amareloEscuro}/>
              <TokenRow label="Ícone ativo" value="#F6921E" color={C.amareloEscuro}/>
              <TokenRow label="Filled bg ativo" value="#004B9B" color={C.azulProfundo}/>
              <TokenRow label="Inativo" value="#7B8C96" color={C.cinzaChumbo}/>
              <TokenRow label="Sombra guia" value="0 -4px 12px rgba(...)"/>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:Fn.title,marginBottom:4}}>Dimensões</span>
              <TokenRow label="Underline bar" value="3px height"/>
              <TokenRow label="Vertical bar" value="2px width laranja"/>
              <TokenRow label="Filled radius" value="7px"/>
              <TokenRow label="Guia radius" value="10px 10px 0 0"/>
              <TokenRow label="Guia shadow" value="0 -4px 12px rgba(...)"/>
              <TokenRow label="Bordered border" value="1px solid 30%"/>
              <TokenRow label="Vertical indicator" value="2px solid laranja"/>
              <TokenRow label="Dot size" value="7px"/>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:Fn.title,marginBottom:4}}>Animações</span>
              <TokenRow label="Slide indicator" value=".3s cubic-bezier"/>
              <TokenRow label="Content fade" value=".25s ease (translateY 6px)"/>
              <TokenRow label="Hover transition" value=".2s ease"/>
              <TokenRow label="Color transition" value=".2s ease"/>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:Fn.title,marginBottom:4}}>Tipografia</span>
              <TokenRow label="Underline ativo" value="Open Sans 600"/>
              <TokenRow label="Filled/Guia ativo" value="Open Sans 700"/>
              <TokenRow label="Inativo" value="Open Sans 400–500"/>
              <TokenRow label="SM / MD / LG" value="12 / 13 / 14px"/>
              <TokenRow label="Contador" value="Fira Code 700 10px"/>
            </div>
          </DSCard>
        </Section>

        {/* 07 — MODO DARK */}
        <Section n="07" title="Modo Dark" desc="Tokens e comportamento do componente no tema escuro. Consistência visual garantida em ambos os modos.">
          <div style={{background:C.cardBg,borderRadius:"10px 10px 10px 18px",border:`1px solid ${C.cardBorder}`,padding:mob?16:24}}>
            <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:12}}>
              {[
                {token:"Active tab text",light:"#002A68",dark:"#93BDE4"},
                {token:"Inactive text",light:"#7B8C96",dark:"#8A9BA7"},
                {token:"Underline indicator",light:"#F6921E",dark:"#FDC24E"},
                {token:"Tab border",light:"#E2E8F0",dark:"#2A3A4A"},
                {token:"Filled active bg",light:"#004B9B",dark:"#1565C0"},
                {token:"Filled active text",light:"#FFFFFF",dark:"#FFFFFF"},
                {token:"Container bg",light:"#F2F4F8",dark:"#1A2332"},
                {token:"Icon active",light:"#F6921E",dark:"#FDC24E"},
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

        <div style={{textAlign:"center",padding:"20px 0 0",borderTop:`1px solid ${C.cardBorder}`,marginTop:20}}>
          <span style={{fontSize:12,color:C.cinzaChumbo,letterSpacing:".5px",fontFamily:Fn.title,fontWeight:400}}>DS-FIPS v2.0 · Ferrovia Interna do Porto de Santos · Excelência sobre trilhos · {new Date().getFullYear()}</span>
        </div>
      </div>
    </div>
    </PlaygroundProvider>
  );
}
