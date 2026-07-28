// @ts-nocheck
import { useState, useEffect, useRef } from "react";
import { PlaygroundProvider, Copyable, CodePlayground } from '../../components/CodePlayground';
import { Select } from '../../../components/ui/select';
import { ExportPreviewModal } from '../../../components/composites/ExportPreviewModal';

/* ═══════════════════════════════════════════ TOKENS ═══════════════════════════════════════════ */
const C={azulProfundo:"var(--color-gov-azul-profundo)",azulEscuro:"var(--color-gov-azul-escuro)",azulClaro:"var(--color-gov-azul-claro)",cinzaChumbo:"var(--color-fg-muted)",cinzaEscuro:"var(--color-fg)",cinzaClaro:"#C0CCD2",azulCeu:"#93BDE4",azulCeuClaro:"#D3E3F4",amareloOuro:"#FDC24E",amareloEscuro:"#F6921E",verdeFloresta:"#00C64C",verdeEscuro:"#00904C",azulCeuProfundo:"#0090D0",danger:"#DC3545",neutro:"var(--color-surface-soft)",branco:"#FFFFFF",bg:"var(--color-surface-muted)",cardBg:"var(--color-surface)",cardBorder:"var(--color-border)",textMuted:"var(--color-fg-muted)",textLight:"var(--color-fg-muted)",inputBorder:"var(--color-border)",focusRing:"rgba(147,189,228,0.35)"};
const Fn={title:"'Saira Expanded',sans-serif",body:"'Open Sans',sans-serif",mono:"'Fira Code',monospace"};
/* Gradiente gov 3-stops — mesma linguagem do PageHeader/hero (idêntico ao BiDetailDialog do Governança BI) */
const GOV_GRAD="linear-gradient(135deg, var(--color-gov-gradient-from) 0%, var(--color-gov-gradient-to) 60%, #001A4A 100%)";

/* ═══════════════════════════════════════════ ICONS ═══════════════════════════════════════════ */
const Ic={
  x:(s=18,c=C.cinzaChumbo)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M5 5l10 10M15 5L5 15" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>,
  grid:(s=14,c=C.amareloOuro)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><rect x="2" y="2" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/><rect x="11" y="2" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/><rect x="2" y="11" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/><rect x="11" y="11" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/></svg>,
  check:(s=28,c=C.verdeFloresta)=><svg width={s} height={s} viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="20" stroke={c} strokeWidth="2.5"/><path d="M16 24l6 6 10-10" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  alertTri:(s=28,c=C.amareloEscuro)=><svg width={s} height={s} viewBox="0 0 48 48" fill="none"><path d="M24 4L2 42h44L24 4z" stroke={c} strokeWidth="2.5" strokeLinejoin="round"/><path d="M24 18v10M24 32v1" stroke={c} strokeWidth="3" strokeLinecap="round"/></svg>,
  trash:(s=28,c=C.danger)=><svg width={s} height={s} viewBox="0 0 48 48" fill="none"><path d="M8 14h32M18 14V10a4 4 0 014-4h4a4 4 0 014 4v4M12 14v26a4 4 0 004 4h16a4 4 0 004-4V14" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M20 22v12M28 22v12" stroke={c} strokeWidth="2.5" strokeLinecap="round"/></svg>,
  infoI:(s=28,c=C.azulProfundo)=><svg width={s} height={s} viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="20" stroke={c} strokeWidth="2.5"/><path d="M24 20v14M24 13v1" stroke={c} strokeWidth="3" strokeLinecap="round"/></svg>,
  pessoa:(s=14,c=C.cinzaChumbo)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><circle cx="10" cy="6" r="3.5" stroke={c} strokeWidth="1.5"/><path d="M3 17.5c0-3.5 3-5.5 7-5.5s7 2 7 5.5" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>,
  pessoaLg:(s=28,c=C.azulCeu)=><svg width={s} height={s} viewBox="0 0 48 48" fill="none"><circle cx="24" cy="14" r="8" stroke={c} strokeWidth="2.5"/><path d="M8 42c0-8 7-13 16-13s16 5 16 13" stroke={c} strokeWidth="2.5" strokeLinecap="round"/></svg>,
  docLg:(s=28,c=C.cinzaChumbo)=><svg width={s} height={s} viewBox="0 0 48 48" fill="none"><path d="M14 6h14l10 10v24a2 2 0 01-2 2H14a2 2 0 01-2-2V8a2 2 0 012-2z" stroke={c} strokeWidth="2.5" strokeLinejoin="round"/><path d="M28 6v10h10M20 24h8M20 30h12M20 36h6" stroke={c} strokeWidth="2" strokeLinecap="round"/></svg>,
  tag:(s=14,c=C.cinzaChumbo)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M2 4a2 2 0 012-2h5.17a2 2 0 011.42.59l7.24 7.24a2 2 0 010 2.83l-5.17 5.17a2 2 0 01-2.83 0L2.59 10.6A2 2 0 012 9.17V4z" stroke={c} strokeWidth="1.5"/><circle cx="6.5" cy="6.5" r="1" fill={c}/></svg>,
  doc:(s=14,c=C.cinzaChumbo)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M6 2h6l5 5v10a1 1 0 01-1 1H6a1 1 0 01-1-1V3a1 1 0 011-1z" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/><path d="M12 2v5h5" stroke={c} strokeWidth="1.5"/></svg>,
  cal:(s=14,c=C.cinzaChumbo)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><rect x="2" y="4" width="16" height="14" rx="2" stroke={c} strokeWidth="1.5"/><path d="M2 8h16M6 2v4M14 2v4" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>,
  keyboard:(s=18,c=C.azulProfundo)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none"><rect x="2" y="4" width="20" height="16" rx="2" stroke={c} strokeWidth="1.8"/><path d="M6 8h2M10 8h2M14 8h2M18 8h0M6 12h2M10 12h2M14 12h2M18 12h0M8 16h8" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>,
  eye:(s=18,c=C.verdeFloresta)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" stroke={c} strokeWidth="1.8"/><circle cx="12" cy="12" r="3" stroke={c} strokeWidth="1.8"/></svg>,
  ban:(s=18,c=C.danger)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke={c} strokeWidth="1.8"/><path d="M4.93 4.93l14.14 14.14" stroke={c} strokeWidth="1.8"/></svg>,
  maximize:(s=16,c=C.cinzaChumbo)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M3 7V4a1 1 0 011-1h3M13 3h3a1 1 0 011 1v3M17 13v3a1 1 0 01-1 1h-3M7 17H4a1 1 0 01-1-1v-3" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>,
  minimize:(s=16,c=C.cinzaChumbo)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M7 3v3a1 1 0 01-1 1H3M13 3v3a1 1 0 001 1h3M17 13h-3a1 1 0 00-1 1v3M3 13h3a1 1 0 011 1v3" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>,
  popup:(s=28,c=C.azulProfundo)=><svg width={s} height={s} viewBox="0 0 48 48" fill="none"><rect x="6" y="10" width="36" height="28" rx="4" stroke={c} strokeWidth="2.5"/><path d="M6 18h36" stroke={c} strokeWidth="2.5"/><circle cx="12" cy="14" r="1.5" fill={c}/><circle cx="18" cy="14" r="1.5" fill={c}/><circle cx="24" cy="14" r="1.5" fill={c}/><rect x="14" y="24" width="20" height="8" rx="2" stroke={c} strokeWidth="1.8" strokeDasharray="3 2"/></svg>,
  helpCircle:(s=28,c=C.azulProfundo)=><svg width={s} height={s} viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="20" stroke={c} strokeWidth="2.5"/><path d="M18 18a6 6 0 0111.13 3.15c0 4-6 5.5-6 9.85M24 36v1" stroke={c} strokeWidth="3" strokeLinecap="round"/></svg>,
  arrowRight:(s=16,c=C.branco)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M4 10h12M12 6l4 4-4 4" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  arrowLeft:(s=16,c=C.cinzaChumbo)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M16 10H4M8 6l-4 4 4 4" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  target:(s=14,c=C.azulProfundo)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke={c} strokeWidth="1.5"/><circle cx="10" cy="10" r="3" stroke={c} strokeWidth="1.5"/><circle cx="10" cy="10" r="1" fill={c}/></svg>,
  clipboard:(s=16,c=C.cinzaChumbo)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><rect x="5" y="3" width="10" height="2" rx="1" stroke={c} strokeWidth="1.4"/><rect x="3" y="5" width="14" height="13" rx="2" stroke={c} strokeWidth="1.4"/><path d="M7 10h6M7 13h4" stroke={c} strokeWidth="1.3" strokeLinecap="round"/></svg>,
  codeBraces:(s=16,c=C.cinzaChumbo)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M7 3C5 3 4 4.5 4 6v2c0 1-1 2-2 2 1 0 2 1 2 2v2c0 1.5 1 3 3 3M13 3c2 0 3 1.5 3 3v2c0 1 1 2 2 2-1 0-2 1-2 2v2c0 1.5-1 3-3 3" stroke={c} strokeWidth="1.4" strokeLinecap="round"/></svg>,
  chevDown:(s=12,c=C.cinzaChumbo)=><svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  lock:(s=14,c=C.cinzaChumbo)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><rect x="4" y="9" width="12" height="8" rx="2" stroke={c} strokeWidth="1.5"/><path d="M7 9V6.5a3 3 0 016 0V9" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>,
};

function JunctionLines({style}){return <svg viewBox="0 0 320 200" fill="none" style={{opacity:.12,...style}}><path d="M0 60H100C120 60 120 60 140 40L200 40H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/><path d="M0 60H100C120 60 120 60 140 80L200 80H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/><path d="M0 120H60C80 120 80 120 100 100L160 100H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/><path d="M0 120H60C80 120 80 120 100 140L160 140H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/></svg>}

/* ═══════════════════════════════════════════ BADGE ═══════════════════════════════════════════ */
const BV={sucesso:{bg:"#ECFDF5",color:C.verdeEscuro,border:"#A7F3D0"},atencao:{bg:"#FFF7ED",color:"#C2410C",border:"#FDBA74"},critico:{bg:"#FEF2F2",color:"#B91C1C",border:"#FECACA"},info:{bg:C.azulCeuClaro,color:C.azulEscuro,border:C.azulCeu}};
function Badge({variant="info",children,dot}){const v=BV[variant]||BV.info;return(<span style={{display:"inline-flex",alignItems:"center",gap:5,padding:"2px 8px",fontSize:11,fontWeight:600,fontFamily:Fn.body,color:v.color,background:v.bg,border:`1px solid ${v.border}`,borderRadius:4,whiteSpace:"nowrap"}}>{dot&&<span style={{width:6,height:6,borderRadius:"50%",background:v.color,opacity:.85}}/>}{children}</span>)}

/* Info card — cartão da ficha de detalhe (modelo: BiDetailDialog/Governança BI): fundo suave, label uppercase discreta, valor em destaque. */
function InfoCard({label,value}){return(<div style={{borderRadius:8,border:`1px solid ${C.cardBorder}`,background:C.bg,padding:"9px 12px",minWidth:0}}><dt style={{fontSize:10,fontWeight:600,letterSpacing:".04em",textTransform:"uppercase",color:C.textMuted,fontFamily:Fn.body}}>{label}</dt><dd style={{margin:"2px 0 0",fontSize:13,fontWeight:500,color:C.cinzaEscuro,fontFamily:Fn.body,wordBreak:"break-word"}}>{value||"—"}</dd></div>)}

/* ═══════════════════════════════════════════
   MODAL — REFINED v2
   ═══════════════════════════════════════════ */
function Modal({open,onClose,title,subtitle,eyebrow,eyebrowColor,children,footer,footerBg,width=480,icon,iconBg,iconBorder,bodyBg,noPadBody,headerBg="#002A68"}){
  const [vis,setVis]=useState(false);
  const [animIn,setAnimIn]=useState(false);
  useEffect(()=>{
    if(open){setVis(true);requestAnimationFrame(()=>requestAnimationFrame(()=>setAnimIn(true)))}
    else{setAnimIn(false);const t=setTimeout(()=>setVis(false),280);return()=>clearTimeout(t)}
  },[open]);
  useEffect(()=>{if(!open)return;const h=e=>{if(e.key==="Escape")onClose()};document.addEventListener("keydown",h);return()=>document.removeEventListener("keydown",h)},[open,onClose]);
  if(!vis)return null;
  const isHero=headerBg===GOV_GRAD;
  return(
    <div style={{position:"fixed",inset:0,zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(0,42,104,.45)",backdropFilter:"blur(2px)",WebkitBackdropFilter:"blur(2px)",opacity:animIn?1:0,transition:"opacity .28s",cursor:"pointer"}}/>
      <div role="dialog" aria-modal="true" aria-labelledby="modal-title" style={{position:"relative",zIndex:1,width,maxWidth:"95vw",maxHeight:"90vh",background:C.cardBg,borderRadius:"12px 12px 12px 24px",boxShadow:"0 12px 48px rgba(0,42,104,.2), 0 2px 8px rgba(0,42,104,.08)",display:"flex",flexDirection:"column",transform:animIn?"scale(1) translateY(0)":"scale(.96) translateY(10px)",opacity:animIn?1:0,transition:"all .28s cubic-bezier(.32,.72,.37,1.1)",overflow:"hidden"}}>
        {/* Botão fechar — canto superior direito */}
        <div onClick={onClose} tabIndex={0} role="button" aria-label="Fechar modal" style={{position:"absolute",top:14,right:14,zIndex:2,width:32,height:32,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,transition:"all .15s",background:"rgba(255,255,255,0.08)"}} onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.18)"}} onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.08)"}} onKeyDown={e=>{if(e.key==="Enter")onClose()}}>{Ic.x(16,"rgba(255,255,255,0.75)")}</div>
        <div style={{padding:"20px 24px",paddingRight:56,background:headerBg,display:"flex",alignItems:"center",gap:16,flexShrink:0,position:"relative",overflow:"hidden"}}>
          {/* Decoração do header: JunctionLines no gradiente gov (= Pic 2); shimmer liso nos headers sólidos */}
          {isHero
            ? <JunctionLines style={{position:"absolute",top:-10,right:-20,width:360,height:200,opacity:.06}}/>
            : <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)",pointerEvents:"none"}}/>}
          <div style={{display:"flex",gap:14,alignItems:"center",minWidth:0,position:"relative"}}>
            {icon&&<div style={{width:44,height:44,borderRadius:10,background:iconBg||"linear-gradient(145deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.06) 56%, rgba(0,24,58,0.22) 100%)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,border:`1px solid ${iconBorder||"rgba(255,255,255,0.16)"}`,boxShadow:"0 1px 2px rgba(0,42,104,0.3), inset 0 1px 0 rgba(255,255,255,0.08)"}}>{icon}</div>}
            <div style={{minWidth:0}}>
              {eyebrow&&<span style={{display:"block",fontSize:11,fontWeight:600,letterSpacing:"0.14em",textTransform:"uppercase",color:eyebrowColor||C.amareloEscuro,fontFamily:Fn.title,lineHeight:1.2,marginBottom:1}}>{eyebrow}</span>}
              <h2 id="modal-title" style={{fontSize:21,fontWeight:700,color:"#FFFFFF",margin:0,fontFamily:Fn.title,lineHeight:1.2,letterSpacing:"-0.2px"}}>{title}</h2>
              {subtitle&&<p style={{fontSize:12,color:"rgba(255,255,255,0.65)",margin:"3px 0 0",lineHeight:1.4,fontFamily:Fn.body}}>{subtitle}</p>}
            </div>
          </div>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:noPadBody?0:"20px 24px",background:bodyBg||"transparent"}}>{children}</div>
        {footer&&<div style={{padding:"14px 24px",borderTop:`1px solid ${C.cardBorder}`,background:footerBg||C.bg,display:"flex",gap:10,justifyContent:"flex-end",alignItems:"center",flexShrink:0}}>{footer}</div>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   TUTORIAL MODAL — Step-by-step contextual walkthrough
   ═══════════════════════════════════════════ */
function TutorialModal({open,onClose,title,subtitle,steps=[]}){
  const [vis,setVis]=useState(false);
  const [animIn,setAnimIn]=useState(false);
  const [step,setStep]=useState(0);
  const bodyRef=useRef(null);
  useEffect(()=>{if(open){setStep(0);setVis(true);requestAnimationFrame(()=>requestAnimationFrame(()=>setAnimIn(true)))}else{setAnimIn(false);const t=setTimeout(()=>setVis(false),280);return()=>clearTimeout(t)}},[open]);
  useEffect(()=>{if(!open)return;const h=e=>{if(e.key==="Escape")onClose();if(e.key==="ArrowRight"&&step<steps.length-1)setStep(s=>s+1);if(e.key==="ArrowLeft"&&step>0)setStep(s=>s-1)};document.addEventListener("keydown",h);return()=>document.removeEventListener("keydown",h)},[open,onClose,step,steps.length]);
  useEffect(()=>{if(bodyRef.current)bodyRef.current.scrollTo({top:0,behavior:"smooth"})},[step]);
  if(!vis||!steps.length)return null;
  const cur=steps[step];const total=steps.length;const pct=((step+1)/total)*100;
  return(
    <div style={{position:"fixed",inset:0,zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(0,42,104,.50)",backdropFilter:"blur(3px)",WebkitBackdropFilter:"blur(3px)",opacity:animIn?1:0,transition:"opacity .28s",cursor:"pointer"}}/>
      <div role="dialog" aria-modal="true" aria-labelledby="tutorial-title" style={{position:"relative",zIndex:1,width:540,maxWidth:"95vw",maxHeight:"90vh",background:C.cardBg,borderRadius:"12px 12px 12px 24px",boxShadow:"0 12px 48px rgba(0,42,104,.22), 0 2px 8px rgba(0,42,104,.08)",display:"flex",flexDirection:"column",transform:animIn?"scale(1) translateY(0)":"scale(.96) translateY(10px)",opacity:animIn?1:0,transition:"all .28s cubic-bezier(.32,.72,.37,1.1)",overflow:"hidden"}}>
        {/* Header */}
        <div style={{padding:"20px 24px",paddingRight:50,borderBottom:`1px solid ${C.cardBorder}`,display:"flex",alignItems:"center",gap:16,flexShrink:0,background:`linear-gradient(135deg,${C.azulProfundo}08 0%,${C.azulCeuClaro}20 100%)`}}>
          <div style={{width:48,height:48,borderRadius:14,background:`${C.azulProfundo}10`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,border:`1px solid ${C.azulCeu}30`}}>{Ic.helpCircle(28,C.azulProfundo)}</div>
          <div style={{minWidth:0,flex:1}}>
            <h2 id="tutorial-title" style={{fontSize:17,fontWeight:700,color:C.azulEscuro,margin:0,fontFamily:Fn.title,lineHeight:1.3}}>{title}</h2>
            {subtitle&&<p style={{fontSize:12,color:C.cinzaChumbo,margin:"3px 0 0",lineHeight:1.4,fontFamily:Fn.body}}>{subtitle}</p>}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
            <span style={{fontSize:11,fontWeight:700,color:C.azulProfundo,fontFamily:Fn.mono}}>{step+1}/{total}</span>
          </div>
        </div>
        {/* Close */}
        <div onClick={onClose} tabIndex={0} role="button" aria-label="Fechar tutorial" style={{position:"absolute",top:10,right:10,zIndex:2,width:32,height:32,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"all .15s",background:"transparent"}} onMouseEnter={e=>{e.currentTarget.style.background=C.bg}} onMouseLeave={e=>{e.currentTarget.style.background="transparent"}} onKeyDown={e=>{if(e.key==="Enter")onClose()}}>{Ic.x(16,C.cinzaChumbo)}</div>

        {/* Progress bar */}
        <div style={{height:3,background:C.bg,flexShrink:0}}>
          <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${C.azulProfundo},${C.azulCeu})`,borderRadius:2,transition:"width .35s cubic-bezier(.4,0,.2,1)"}}/>
        </div>

        {/* Body — current step */}
        <div ref={bodyRef} style={{flex:1,overflowY:"auto",padding:"24px 28px",background:"#fafafa"}}>
          {/* Step number + title */}
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
            <div style={{width:36,height:36,borderRadius:10,background:`linear-gradient(135deg,${C.azulProfundo},${C.azulCeu})`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:`0 4px 12px ${C.azulProfundo}30`}}>
              <span style={{color:C.branco,fontSize:15,fontWeight:700,fontFamily:Fn.mono}}>{step+1}</span>
            </div>
            <div>
              <h3 style={{fontSize:16,fontWeight:700,color:C.azulEscuro,margin:0,fontFamily:Fn.title}}>{cur.title}</h3>
              {cur.ref&&<span style={{fontSize:11,color:C.azulClaro,fontFamily:Fn.mono,display:"flex",alignItems:"center",gap:4,marginTop:2}}>{Ic.target(12,C.azulClaro)} {cur.ref}</span>}
            </div>
          </div>

          {/* Description */}
          <p style={{fontSize:13,color:C.cinzaEscuro,lineHeight:1.7,margin:"0 0 16px",fontFamily:Fn.body}}>{cur.description}</p>

          {/* Visual hint / card */}
          {cur.visual&&(
            <div style={{background:C.cardBg,borderRadius:10,border:`1px solid ${C.cardBorder}`,padding:16,marginBottom:16}}>
              {cur.visual}
            </div>
          )}

          {/* Tips */}
          {cur.tips&&cur.tips.length>0&&(
            <div style={{background:`${C.azulCeuClaro}30`,border:`1px solid ${C.azulCeuClaro}`,borderRadius:10,padding:"14px 18px"}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.azulProfundo,fontFamily:Fn.title,display:"block",marginBottom:8}}>Dica</span>
              {cur.tips.map((t,i)=>(
                <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:i<cur.tips.length-1?6:0}}>
                  <span style={{color:C.azulProfundo,fontSize:12,marginTop:1,flexShrink:0}}>→</span>
                  <span style={{fontSize:12,color:C.cinzaEscuro,lineHeight:1.5}}>{t}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer — navigation */}
        <div style={{padding:"14px 24px",borderTop:`1px solid ${C.cardBorder}`,background:C.bg,display:"flex",gap:10,justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            {steps.map((_,i)=>(
              <div key={i} onClick={()=>setStep(i)} style={{width:i===step?20:8,height:8,borderRadius:4,background:i===step?C.azulProfundo:i<step?C.azulCeu:`${C.cinzaClaro}`,cursor:"pointer",transition:"all .25s"}}/>
            ))}
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <div style={{display:"flex",gap:4,marginRight:8}}>
              <Kbd>←</Kbd><Kbd>→</Kbd>
            </div>
            {step>0&&<Btn label="Anterior" outline onClick={()=>setStep(s=>s-1)}/>}
            {step<total-1?<Btn label="Próximo" color={C.azulProfundo} onClick={()=>setStep(s=>s+1)}/>:<Btn label="Concluir" color={C.verdeFloresta} onClick={onClose}/>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   POPUP MODAL — Resizable: Normal / Grande / Tela Cheia
   ═══════════════════════════════════════════ */
const POPUP_SIZES={
  normal:{width:480,maxH:"85vh",label:"Normal"},
  grande:{width:720,maxH:"90vh",label:"Grande"},
  "tela-cheia":{width:"92vw",maxH:"95vh",label:"Tela cheia"},
};
const POPUP_ORDER=["normal","grande","tela-cheia"];

function PopupModal({open,onClose,title,subtitle,children,footer,icon,iconBg,iconBorder,headerBg=GOV_GRAD}){
  const [vis,setVis]=useState(false);
  const [animIn,setAnimIn]=useState(false);
  const [size,setSize]=useState("normal");
  useEffect(()=>{if(open){setSize("normal");setVis(true);requestAnimationFrame(()=>requestAnimationFrame(()=>setAnimIn(true)))}else{setAnimIn(false);const t=setTimeout(()=>setVis(false),280);return()=>clearTimeout(t)}},[open]);
  useEffect(()=>{if(!open)return;const h=e=>{if(e.key==="Escape")onClose()};document.addEventListener("keydown",h);return()=>document.removeEventListener("keydown",h)},[open,onClose]);

  const cycleSize=()=>{const i=POPUP_ORDER.indexOf(size);setSize(POPUP_ORDER[(i+1)%POPUP_ORDER.length])};
  const sz=POPUP_SIZES[size];
  const isFullscreen=size==="tela-cheia";

  if(!vis)return null;
  return(
    <div style={{position:"fixed",inset:0,zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:isFullscreen?8:16}}>
      <div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(0,42,104,.45)",backdropFilter:"blur(2px)",WebkitBackdropFilter:"blur(2px)",opacity:animIn?1:0,transition:"opacity .28s",cursor:"pointer"}}/>
      <div role="dialog" aria-modal="true" style={{position:"relative",zIndex:1,width:typeof sz.width==="number"?sz.width:undefined,maxWidth:typeof sz.width==="string"?sz.width:"95vw",minWidth:typeof sz.width==="string"?sz.width:undefined,maxHeight:sz.maxH,background:C.cardBg,borderRadius:isFullscreen?"8px":"12px 12px 12px 24px",boxShadow:"0 12px 48px rgba(0,42,104,.2), 0 2px 8px rgba(0,42,104,.08)",display:"flex",flexDirection:"column",transform:animIn?"scale(1) translateY(0)":"scale(.96) translateY(10px)",opacity:animIn?1:0,transition:"all .28s cubic-bezier(.32,.72,.37,1.1), width .25s ease, max-width .25s ease",overflow:"hidden"}}>
        {/* Header — padrão canônico DS-FIPS: faixa gov + trilhos + ícone-tile âmbar + título 21px */}
        <div style={{padding:"20px 24px",paddingRight:100,background:headerBg,display:"flex",alignItems:"center",gap:16,flexShrink:0,position:"relative",overflow:"hidden"}}>
          {headerBg===GOV_GRAD
            ? <JunctionLines style={{position:"absolute",top:-10,right:-20,width:360,height:200,opacity:.06}}/>
            : <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)",pointerEvents:"none"}}/>}
          <div style={{display:"flex",gap:14,alignItems:"center",minWidth:0,flex:1,position:"relative"}}>
            {icon&&<div style={{width:44,height:44,borderRadius:10,background:iconBg||"linear-gradient(145deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.06) 56%, rgba(0,24,58,0.22) 100%)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,border:`1px solid ${iconBorder||"rgba(255,255,255,0.16)"}`,boxShadow:"0 1px 2px rgba(0,42,104,0.3), inset 0 1px 0 rgba(255,255,255,0.08)"}}>{icon}</div>}
            <div style={{minWidth:0}}>
              <h2 style={{fontSize:21,fontWeight:700,color:"#FFFFFF",margin:0,fontFamily:Fn.title,lineHeight:1.2,letterSpacing:"-0.2px"}}>{title}</h2>
              {subtitle&&<p style={{fontSize:12,color:"rgba(255,255,255,0.65)",margin:"3px 0 0",lineHeight:1.4,fontFamily:Fn.body}}>{subtitle}</p>}
            </div>
          </div>
          {/* Size toggle + Close */}
          <div style={{position:"absolute",top:14,right:14,display:"flex",gap:6,zIndex:2}}>
            <button onClick={cycleSize} style={{display:"flex",alignItems:"center",gap:5,padding:"5px 10px",borderRadius:8,border:"1px solid rgba(255,255,255,0.2)",background:"rgba(255,255,255,0.08)",cursor:"pointer",fontSize:10,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:"rgba(255,255,255,0.8)",fontFamily:Fn.title,transition:"all .15s"}} onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.15)";e.currentTarget.style.color="#fff"}} onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.08)";e.currentTarget.style.color="rgba(255,255,255,0.8)"}}>
              {isFullscreen?Ic.minimize(13,"rgba(255,255,255,0.8)"):Ic.maximize(13,"rgba(255,255,255,0.8)")}
              {sz.label}
            </button>
            <div onClick={onClose} tabIndex={0} role="button" aria-label="Fechar" style={{width:32,height:32,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"all .15s",background:"rgba(255,255,255,0.08)"}} onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.18)"}} onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.08)"}} onKeyDown={e=>{if(e.key==="Enter")onClose()}}>{Ic.x(16,"rgba(255,255,255,0.75)")}</div>
          </div>
        </div>
        {/* Body */}
        <div style={{flex:1,overflowY:"auto",padding:"20px 24px",background:"#fafafa"}}>{typeof children==="function"?children({size,isWide:size!=="normal",isFullscreen}):children}</div>
        {/* Footer */}
        {footer&&<div style={{padding:"14px 24px",borderTop:`1px solid ${C.cardBorder}`,background:C.bg,display:"flex",gap:10,justifyContent:"flex-end",alignItems:"center",flexShrink:0}}>{footer}</div>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════ FORM COMPONENTS ═══════════════════════════════════════════ */
/* Focus/blur padrão DS-FIPS (compact): ring 2px primary/20 + border primary; base = shadow-sm */
const FIELD_BASE_SHADOW="0 1px 2px rgba(0,0,0,.05)";
const fieldFocus=el=>{el.style.borderColor=C.azulProfundo;el.style.boxShadow="0 0 0 2px rgba(0,75,155,.2)"};
const fieldBlur=el=>{el.style.borderColor=C.inputBorder;el.style.boxShadow=FIELD_BASE_SHADOW};
function FInput({label,placeholder,value,required,icon,type="text"}){
  return(
    <div style={{display:"flex",flexDirection:"column",gap:4}}>
      {label&&<label style={{fontSize:12,fontWeight:600,lineHeight:"16px",color:C.cinzaEscuro,fontFamily:Fn.body,marginLeft:12,display:"flex",gap:3}}>{label}{required&&<span style={{color:C.danger}}>*</span>}</label>}
      <div style={{display:"flex",alignItems:"center",gap:8,height:36,padding:"0 12px",border:`1px solid ${C.inputBorder}`,borderRadius:12,background:C.branco,boxShadow:FIELD_BASE_SHADOW,transition:"all .2s"}} onClick={e=>{const inp=e.currentTarget.querySelector("input");if(inp)inp.focus()}}>
        {icon&&<span style={{display:"flex",flexShrink:0,color:C.textMuted}}>{icon}</span>}
        <input type={type} placeholder={placeholder} defaultValue={value} style={{flex:1,height:"100%",border:"none",outline:"none",background:"transparent",fontFamily:Fn.body,fontSize:14,color:C.cinzaEscuro,minWidth:0,cursor:type==="date"?"pointer":"text"}} onFocus={e=>fieldFocus(e.target.parentElement)} onBlur={e=>fieldBlur(e.target.parentElement)}/>
      </div>
    </div>
  );
}
function FSelect({label,options=[],value,icon}){
  return(
    <div style={{display:"flex",flexDirection:"column",gap:4}}>
      {label&&<label style={{fontSize:12,fontWeight:600,lineHeight:"16px",color:C.cinzaEscuro,fontFamily:Fn.body,marginLeft:12}}>{label}</label>}
      <Select
        density="compact"
        aria-label={typeof label==="string"?label:undefined}
        defaultValue={value??options[0]}
        leftIcon={icon}
        options={options.map(o=>({value:o,label:o}))}
      />
    </div>
  );
}
function Btn({label,color,outline,onClick,full,danger}){
  const bg=danger?C.danger:color||C.azulProfundo;
  return <button onClick={onClick} style={{padding:"8px 20px",fontSize:12,fontWeight:600,background:outline?"transparent":bg,color:outline?danger?C.danger:color||C.cinzaChumbo:C.branco,border:outline?`1.5px solid ${danger?C.danger:color||C.cinzaClaro}`:"none",borderRadius:8,cursor:"pointer",fontFamily:Fn.body,width:full?"100%":"auto",transition:"all .15s"}} onMouseEnter={e=>{e.currentTarget.style.opacity=".85";if(!outline)e.currentTarget.style.boxShadow=`0 2px 8px ${bg}40`}} onMouseLeave={e=>{e.currentTarget.style.opacity="1";e.currentTarget.style.boxShadow="none"}}>{label}</button>;
}

/* ═══════════════════════════════════════════ LAYOUT ═══════════════════════════════════════════ */
function Section({n,title,desc,children}){return(<section style={{marginBottom:44}}><div style={{fontSize:10,fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",color:C.azulClaro,fontFamily:Fn.title,marginBottom:6}}>{n}</div><h2 style={{fontSize:20,fontWeight:700,color:C.azulEscuro,margin:"0 0 4px",fontFamily:Fn.title,letterSpacing:".5px"}}>{title}</h2><p style={{fontSize:14,color:C.cinzaChumbo,margin:"0 0 20px",lineHeight:1.55,fontFamily:Fn.body}}>{desc}</p>{children}</section>)}
function DSCard({children,s,mob:m}){return(<div style={{background:C.cardBg,borderRadius:"12px 12px 12px 24px",border:`1px solid ${C.cardBorder}`,padding:m?16:28,boxShadow:"0 1px 3px rgba(0,75,155,.04),0 4px 14px rgba(0,75,155,.03)",...s}}>{children}</div>)}
const gc={background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:"10px 10px 10px 18px",overflow:"hidden"};
const gh={padding:"16px 20px",background:C.bg,borderBottom:`1px solid ${C.cardBorder}`,display:"flex",alignItems:"center",gap:12};
const gb={padding:"16px 20px 20px"};
const gl={fontSize:10,fontWeight:700,letterSpacing:"1.2px",textTransform:"uppercase",color:C.azulClaro,fontFamily:Fn.title,marginBottom:4,marginTop:12};
const gt={fontSize:13,color:C.cinzaEscuro,lineHeight:1.55,margin:0,fontFamily:Fn.body};
const ge={fontSize:12,color:C.cinzaChumbo,lineHeight:1.5,margin:0,fontFamily:Fn.body,fontStyle:"italic",paddingLeft:10,borderLeft:`2px solid ${C.azulCeuClaro}`};
function TokenRow({label,value,color}){return(<div style={{display:"flex",alignItems:"center",gap:10,fontSize:12,fontFamily:Fn.body}}>{color&&<div style={{width:16,height:16,borderRadius:4,background:color,border:`1px solid ${C.cardBorder}`,flexShrink:0}}/>}<span style={{color:C.cinzaChumbo,minWidth:130}}>{label}</span><code style={{background:C.neutro,padding:"2px 8px",borderRadius:4,fontSize:11,fontFamily:Fn.mono,color:C.cinzaEscuro}}>{value}</code></div>)}
function Kbd({children}){return <kbd style={{display:"inline-flex",alignItems:"center",justifyContent:"center",minWidth:26,height:24,padding:"0 7px",background:C.branco,border:`1px solid ${C.cardBorder}`,borderBottom:`2px solid ${C.cinzaClaro}`,borderRadius:5,fontSize:11,fontWeight:600,fontFamily:Fn.mono,color:C.cinzaEscuro,boxShadow:"0 1px 2px rgba(0,0,0,.06)"}}>{children}</kbd>}

/* ═══════════════════════════════════════════ CODE EXPORT ═══════════════════════════════════════════ */
function CodeExport({label,description,code}){
  const [copied,setCopied]=useState(false);
  const [expanded,setExpanded]=useState(false);
  const doCopy=()=>{navigator.clipboard.writeText(code).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2000)})};
  return(
    <div style={{borderRadius:"10px 10px 10px 18px",border:`1px solid ${C.cardBorder}`,overflow:"hidden",background:C.cardBg,transition:"all .2s"}}>
      <div style={{padding:"16px 20px",display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
        <div style={{width:40,height:40,borderRadius:10,background:"#004B9B12",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,border:"1px solid #004B9B25"}}>{Ic.codeBraces(20,"#93BDE4")}</div>
        <div style={{flex:1,minWidth:150}}>
          <span style={{fontSize:14,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title,display:"block"}}>{label}</span>
          <span style={{fontSize:11,color:C.textMuted,lineHeight:1.4}}>{description}</span>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <Btn label={expanded?"{ } Ocultar":"{ } Ver código"} color="#546E7A" onClick={()=>setExpanded(e=>!e)}/>
          <Btn label={copied?"✓ Copiado!":"📋 Copiar código"} color={copied?"#00C64C":"#004B9B"} onClick={doCopy}/>
        </div>
      </div>
      {expanded&&(
        <div style={{borderTop:`1px solid ${C.cardBorder}`}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 20px",background:C.bg}}>
            <span style={{fontSize:10,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.textMuted,fontFamily:Fn.title}}>{code.split("\n").length} linhas · TSX · Copy-paste ready</span>
            <Btn label={copied?"✓ Copiado":"📋 Copiar"} color={copied?"#00C64C":"#004B9B"} onClick={doCopy}/>
          </div>
          <pre style={{margin:0,padding:"18px 20px",background:"#0F172A",color:"#E2E8F0",fontFamily:Fn.mono,fontSize:11.5,lineHeight:1.7,overflowX:"auto",maxHeight:420,overflowY:"auto",whiteSpace:"pre",tabSize:2}}><code>{code}</code></pre>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════ EXPORTABLE CODE STRINGS ═══════════════════════════════════════════ */

const MODAL_CODE=`// ═══════════════════════════════════════════
// DS-FIPS — Modal — Copy-paste ready
// Requer: React 18+, fonts Saira Expanded + Open Sans + Fira Code
// CSS vars: --color-surface, --color-fg, --color-border, --color-fg-muted,
//           --color-surface-muted, --color-surface-soft,
//           --color-gov-azul-profundo, --color-gov-azul-escuro, --color-gov-azul-claro
// ═══════════════════════════════════════════
import { useState, useEffect } from "react";

const C = {
  azulProfundo: "#004B9B",
  azulEscuro: "#002A68",
  cinzaChumbo: "#7B8C96",
  cinzaEscuro: "#333B41",
  cinzaClaro: "#C0CCD2",
  azulCeu: "#93BDE4",
  verdeFloresta: "#00C64C",
  verdeEscuro: "#00904C",
  danger: "#DC3545",
  branco: "#FFFFFF",
  bg: "#F8FAFC",
  cardBg: "#FFFFFF",
  cardBorder: "#E2E8F0",
  textMuted: "#7B8C96",
  inputBorder: "#E2E8F0",
  focusRing: "rgba(147,189,228,0.35)",
};

const Fn = {
  title: "'Saira Expanded', sans-serif",
  body: "'Open Sans', sans-serif",
  mono: "'Fira Code', monospace",
};

/* Ícones inline */
const Ic = {
  x: (s = 18, c = C.cinzaChumbo) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <path d="M5 5l10 10M15 5L5 15" stroke={c} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
};

/* Botão reutilizável */
function Btn({ label, color, outline, onClick, danger }) {
  const bg = danger ? C.danger : color || C.azulProfundo;
  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 20px", fontSize: 12, fontWeight: 600,
        background: outline ? "transparent" : bg,
        color: outline ? (danger ? C.danger : color || C.cinzaChumbo) : C.branco,
        border: outline ? \`1.5px solid \${danger ? C.danger : color || C.cinzaClaro}\` : "none",
        borderRadius: 8, cursor: "pointer", fontFamily: Fn.body,
        transition: "all .15s",
      }}
    >
      {label}
    </button>
  );
}

/* ═══════════════════════════════════════════
   MODAL — DS-FIPS
   Overlay blur, animação spring, ESC fecha, border-radius FIPS, aria-modal
   ═══════════════════════════════════════════ */
export function Modal({ open, onClose, title, subtitle, children, footer, footerBg, width = 480, icon, iconBg, bodyBg, noPadBody }) {
  const [vis, setVis] = useState(false);
  const [animIn, setAnimIn] = useState(false);

  useEffect(() => {
    if (open) {
      setVis(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setAnimIn(true)));
    } else {
      setAnimIn(false);
      const t = setTimeout(() => setVis(false), 280);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [open, onClose]);

  if (!vis) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,42,104,.45)", backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)", opacity: animIn ? 1 : 0, transition: "opacity .28s", cursor: "pointer" }} />
      <div role="dialog" aria-modal="true" aria-labelledby="modal-title" style={{
        position: "relative", zIndex: 1, width, maxWidth: "95vw", maxHeight: "90vh",
        background: C.cardBg, borderRadius: "12px 12px 12px 24px",
        boxShadow: "0 12px 48px rgba(0,42,104,.2), 0 2px 8px rgba(0,42,104,.08)",
        display: "flex", flexDirection: "column",
        transform: animIn ? "scale(1) translateY(0)" : "scale(.96) translateY(10px)",
        opacity: animIn ? 1 : 0,
        transition: "all .28s cubic-bezier(.32,.72,.37,1.1)",
        overflow: "hidden",
      }}>
        <div onClick={onClose} tabIndex={0} role="button" aria-label="Fechar modal" style={{ position: "absolute", top: 10, right: 10, zIndex: 2, width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all .15s", background: "transparent" }}>
          {Ic.x(16, C.cinzaChumbo)}
        </div>
        <div style={{ padding: "20px 24px", paddingRight: 50, borderBottom: \`1px solid \${C.cardBorder}\`, display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
          {icon && <div style={{ width: 48, height: 48, borderRadius: 14, background: iconBg || C.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: \`1px solid \${C.cardBorder}\` }}>{icon}</div>}
          <div style={{ minWidth: 0 }}>
            <h2 id="modal-title" style={{ fontSize: 17, fontWeight: 700, color: C.azulEscuro, margin: 0, fontFamily: Fn.title, lineHeight: 1.3 }}>{title}</h2>
            {subtitle && <p style={{ fontSize: 12, color: C.cinzaChumbo, margin: "3px 0 0", lineHeight: 1.4, fontFamily: Fn.body }}>{subtitle}</p>}
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: noPadBody ? 0 : "20px 24px", background: bodyBg || "transparent" }}>{children}</div>
        {footer && <div style={{ padding: "14px 24px", borderTop: \`1px solid \${C.cardBorder}\`, background: footerBg || C.bg, display: "flex", gap: 10, justifyContent: "flex-end", alignItems: "center", flexShrink: 0 }}>{footer}</div>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// USO:
// const [open, setOpen] = useState(false);
// <Modal open={open} onClose={() => setOpen(false)}
//   title="Título do modal" subtitle="Subtítulo descritivo"
//   icon={<span>📋</span>} width={480}
//   footer={<><Btn label="Cancelar" outline onClick={() => setOpen(false)} /><Btn label="Confirmar" color="#00C64C" onClick={() => setOpen(false)} /></>}
// >
//   <p>Conteúdo do modal aqui.</p>
// </Modal>
// ═══════════════════════════════════════════`;

const TUTORIAL_MODAL_CODE=`// ═══════════════════════════════════════════
// DS-FIPS — TutorialModal — Copy-paste ready
// Requer: React 18+, fonts Saira Expanded + Open Sans + Fira Code
// ═══════════════════════════════════════════
import { useState, useEffect, useRef } from "react";

const C = {
  azulProfundo: "#004B9B",
  azulEscuro: "#002A68",
  azulClaro: "#0090D0",
  cinzaChumbo: "#7B8C96",
  cinzaEscuro: "#333B41",
  cinzaClaro: "#C0CCD2",
  azulCeu: "#93BDE4",
  azulCeuClaro: "#D3E3F4",
  verdeFloresta: "#00C64C",
  branco: "#FFFFFF",
  bg: "#F8FAFC",
  cardBg: "#FFFFFF",
  cardBorder: "#E2E8F0",
  textMuted: "#7B8C96",
};

const Fn = {
  title: "'Saira Expanded', sans-serif",
  body: "'Open Sans', sans-serif",
  mono: "'Fira Code', monospace",
};

const Ic = {
  x: (s = 18, c = C.cinzaChumbo) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <path d="M5 5l10 10M15 5L5 15" stroke={c} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  helpCircle: (s = 28, c = C.azulProfundo) => (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="20" stroke={c} strokeWidth="2.5" />
      <path d="M18 18a6 6 0 0111.13 3.15c0 4-6 5.5-6 9.85M24 36v1" stroke={c} strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),
  target: (s = 14, c = C.azulProfundo) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7" stroke={c} strokeWidth="1.5" />
      <circle cx="10" cy="10" r="3" stroke={c} strokeWidth="1.5" />
      <circle cx="10" cy="10" r="1" fill={c} />
    </svg>
  ),
};

function Btn({ label, color, outline, onClick }) {
  const bg = color || C.azulProfundo;
  return (
    <button onClick={onClick} style={{
      padding: "8px 20px", fontSize: 12, fontWeight: 600,
      background: outline ? "transparent" : bg, color: outline ? C.cinzaChumbo : "#fff",
      border: outline ? \`1.5px solid \${C.cinzaClaro}\` : "none",
      borderRadius: 8, cursor: "pointer", fontFamily: Fn.body, transition: "all .15s",
    }}>{label}</button>
  );
}

function Kbd({ children }) {
  return <kbd style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 26, height: 24, padding: "0 7px", background: C.branco, border: \`1px solid \${C.cardBorder}\`, borderBottom: \`2px solid \${C.cinzaClaro}\`, borderRadius: 5, fontSize: 11, fontWeight: 600, fontFamily: Fn.mono, color: C.cinzaEscuro }}>{children}</kbd>;
}

/**
 * TutorialModal — Walkthrough step-by-step contextual
 * Props:
 *   open: boolean
 *   onClose: () => void
 *   title: string
 *   subtitle?: string
 *   steps: Array<{ title, ref?, description, tips?: string[], visual?: ReactNode }>
 */
export function TutorialModal({ open, onClose, title, subtitle, steps = [] }) {
  const [vis, setVis] = useState(false);
  const [animIn, setAnimIn] = useState(false);
  const [step, setStep] = useState(0);
  const bodyRef = useRef(null);

  useEffect(() => {
    if (open) { setStep(0); setVis(true); requestAnimationFrame(() => requestAnimationFrame(() => setAnimIn(true))); }
    else { setAnimIn(false); const t = setTimeout(() => setVis(false), 280); return () => clearTimeout(t); }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const h = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && step < steps.length - 1) setStep((s) => s + 1);
      if (e.key === "ArrowLeft" && step > 0) setStep((s) => s - 1);
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [open, onClose, step, steps.length]);

  useEffect(() => { if (bodyRef.current) bodyRef.current.scrollTo({ top: 0, behavior: "smooth" }); }, [step]);

  if (!vis || !steps.length) return null;
  const cur = steps[step];
  const total = steps.length;
  const pct = ((step + 1) / total) * 100;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,42,104,.50)", backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)", opacity: animIn ? 1 : 0, transition: "opacity .28s", cursor: "pointer" }} />
      <div role="dialog" aria-modal="true" style={{
        position: "relative", zIndex: 1, width: 540, maxWidth: "95vw", maxHeight: "90vh",
        background: C.cardBg, borderRadius: "12px 12px 12px 24px",
        boxShadow: "0 12px 48px rgba(0,42,104,.22), 0 2px 8px rgba(0,42,104,.08)",
        display: "flex", flexDirection: "column",
        transform: animIn ? "scale(1) translateY(0)" : "scale(.96) translateY(10px)",
        opacity: animIn ? 1 : 0, transition: "all .28s cubic-bezier(.32,.72,.37,1.1)", overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{ padding: "20px 24px", paddingRight: 50, borderBottom: \`1px solid \${C.cardBorder}\`, display: "flex", alignItems: "center", gap: 16, flexShrink: 0, background: \`linear-gradient(135deg,\${C.azulProfundo}08 0%,\${C.azulCeuClaro}20 100%)\` }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: \`\${C.azulProfundo}10\`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: \`1px solid \${C.azulCeu}30\` }}>{Ic.helpCircle(28, C.azulProfundo)}</div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: C.azulEscuro, margin: 0, fontFamily: Fn.title, lineHeight: 1.3 }}>{title}</h2>
            {subtitle && <p style={{ fontSize: 12, color: C.cinzaChumbo, margin: "3px 0 0", lineHeight: 1.4, fontFamily: Fn.body }}>{subtitle}</p>}
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: C.azulProfundo, fontFamily: Fn.mono }}>{step + 1}/{total}</span>
        </div>
        {/* Close */}
        <div onClick={onClose} tabIndex={0} role="button" aria-label="Fechar tutorial" style={{ position: "absolute", top: 10, right: 10, zIndex: 2, width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all .15s", background: "transparent" }}>
          {Ic.x(16, C.cinzaChumbo)}
        </div>
        {/* Progress */}
        <div style={{ height: 3, background: C.bg, flexShrink: 0 }}>
          <div style={{ height: "100%", width: \`\${pct}%\`, background: \`linear-gradient(90deg,\${C.azulProfundo},\${C.azulCeu})\`, borderRadius: 2, transition: "width .35s cubic-bezier(.4,0,.2,1)" }} />
        </div>
        {/* Body */}
        <div ref={bodyRef} style={{ flex: 1, overflowY: "auto", padding: "24px 28px", background: "#fafafa" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: \`linear-gradient(135deg,\${C.azulProfundo},\${C.azulCeu})\`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ color: "#fff", fontSize: 15, fontWeight: 700, fontFamily: Fn.mono }}>{step + 1}</span>
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: C.azulEscuro, margin: 0, fontFamily: Fn.title }}>{cur.title}</h3>
              {cur.ref && <span style={{ fontSize: 11, color: C.azulClaro, fontFamily: Fn.mono, display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>{Ic.target(12, C.azulClaro)} {cur.ref}</span>}
            </div>
          </div>
          <p style={{ fontSize: 13, color: C.cinzaEscuro, lineHeight: 1.7, margin: "0 0 16px", fontFamily: Fn.body }}>{cur.description}</p>
          {cur.visual && <div style={{ background: C.cardBg, borderRadius: 10, border: \`1px solid \${C.cardBorder}\`, padding: 16, marginBottom: 16 }}>{cur.visual}</div>}
          {cur.tips?.length > 0 && (
            <div style={{ background: \`\${C.azulCeuClaro}30\`, border: \`1px solid \${C.azulCeuClaro}\`, borderRadius: 10, padding: "14px 18px" }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: C.azulProfundo, fontFamily: Fn.title, display: "block", marginBottom: 8 }}>Dica</span>
              {cur.tips.map((t, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: i < cur.tips.length - 1 ? 6 : 0 }}>
                  <span style={{ color: C.azulProfundo, fontSize: 12, marginTop: 1, flexShrink: 0 }}>→</span>
                  <span style={{ fontSize: 12, color: C.cinzaEscuro, lineHeight: 1.5 }}>{t}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Footer */}
        <div style={{ padding: "14px 24px", borderTop: \`1px solid \${C.cardBorder}\`, background: C.bg, display: "flex", gap: 10, justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {steps.map((_, i) => (
              <div key={i} onClick={() => setStep(i)} style={{ width: i === step ? 20 : 8, height: 8, borderRadius: 4, background: i === step ? C.azulProfundo : i < step ? C.azulCeu : C.cinzaClaro, cursor: "pointer", transition: "all .25s" }} />
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ display: "flex", gap: 4, marginRight: 8 }}><Kbd>←</Kbd><Kbd>→</Kbd></div>
            {step > 0 && <Btn label="Anterior" outline onClick={() => setStep((s) => s - 1)} />}
            {step < total - 1 ? <Btn label="Próximo" color={C.azulProfundo} onClick={() => setStep((s) => s + 1)} /> : <Btn label="Concluir" color={C.verdeFloresta} onClick={onClose} />}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// USO:
// const steps = [
//   { title: "Passo 1", ref: "Seção 01", description: "Descrição...", tips: ["Dica 1"], visual: <div>Preview</div> },
//   { title: "Passo 2", description: "Descrição do passo 2..." },
// ];
// <TutorialModal open={open} onClose={() => setOpen(false)} title="Tutorial" subtitle="Guia da página" steps={steps} />
// ═══════════════════════════════════════════`;

const POPUP_MODAL_CODE=`// ═══════════════════════════════════════════
// DS-FIPS — PopupModal (redimensionável) — Copy-paste ready
// Requer: React 18+, fonts Saira Expanded + Open Sans + Fira Code
// ═══════════════════════════════════════════
import { useState, useEffect } from "react";

const C = {
  azulProfundo: "#004B9B",
  azulEscuro: "#002A68",
  cinzaChumbo: "#7B8C96",
  cinzaEscuro: "#333B41",
  cinzaClaro: "#C0CCD2",
  azulCeu: "#93BDE4",
  branco: "#FFFFFF",
  bg: "#F8FAFC",
  cardBg: "#FFFFFF",
  cardBorder: "#E2E8F0",
};

const Fn = {
  title: "'Saira Expanded', sans-serif",
  body: "'Open Sans', sans-serif",
  mono: "'Fira Code', monospace",
};

const Ic = {
  x: (s = 18, c = C.cinzaChumbo) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <path d="M5 5l10 10M15 5L5 15" stroke={c} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  maximize: (s = 16, c = C.cinzaChumbo) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <path d="M3 7V4a1 1 0 011-1h3M13 3h3a1 1 0 011 1v3M17 13v3a1 1 0 01-1 1h-3M7 17H4a1 1 0 01-1-1v-3" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  minimize: (s = 16, c = C.cinzaChumbo) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <path d="M7 3v3a1 1 0 01-1 1H3M13 3v3a1 1 0 001 1h3M17 13h-3a1 1 0 00-1 1v3M3 13h3a1 1 0 011 1v3" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
};

const POPUP_SIZES = {
  normal: { width: 480, maxH: "85vh", label: "Normal" },
  grande: { width: 720, maxH: "90vh", label: "Grande" },
  "tela-cheia": { width: "92vw", maxH: "95vh", label: "Tela cheia" },
};
const POPUP_ORDER = ["normal", "grande", "tela-cheia"];

/**
 * PopupModal — Modal redimensionável Normal / Grande / Tela Cheia
 * Props:
 *   open, onClose, title, subtitle, icon, iconBg, footer
 *   children: ReactNode | (({ size, isWide, isFullscreen }) => ReactNode)
 */
export function PopupModal({ open, onClose, title, subtitle, children, footer, icon, iconBg }) {
  const [vis, setVis] = useState(false);
  const [animIn, setAnimIn] = useState(false);
  const [size, setSize] = useState("normal");

  useEffect(() => {
    if (open) { setSize("normal"); setVis(true); requestAnimationFrame(() => requestAnimationFrame(() => setAnimIn(true))); }
    else { setAnimIn(false); const t = setTimeout(() => setVis(false), 280); return () => clearTimeout(t); }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [open, onClose]);

  const cycleSize = () => { const i = POPUP_ORDER.indexOf(size); setSize(POPUP_ORDER[(i + 1) % POPUP_ORDER.length]); };
  const sz = POPUP_SIZES[size];
  const isFullscreen = size === "tela-cheia";

  if (!vis) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: isFullscreen ? 8 : 16 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,42,104,.45)", backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)", opacity: animIn ? 1 : 0, transition: "opacity .28s", cursor: "pointer" }} />
      <div role="dialog" aria-modal="true" style={{
        position: "relative", zIndex: 1,
        width: typeof sz.width === "number" ? sz.width : undefined,
        maxWidth: typeof sz.width === "string" ? sz.width : "95vw",
        minWidth: typeof sz.width === "string" ? sz.width : undefined,
        maxHeight: sz.maxH, background: C.cardBg,
        borderRadius: isFullscreen ? "8px" : "12px 12px 12px 24px",
        boxShadow: "0 12px 48px rgba(0,42,104,.2), 0 2px 8px rgba(0,42,104,.08)",
        display: "flex", flexDirection: "column",
        transform: animIn ? "scale(1) translateY(0)" : "scale(.96) translateY(10px)",
        opacity: animIn ? 1 : 0,
        transition: "all .28s cubic-bezier(.32,.72,.37,1.1), width .25s ease, max-width .25s ease",
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{ padding: "20px 24px", paddingRight: 100, borderBottom: \`1px solid \${C.cardBorder}\`, display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
          {icon && <div style={{ width: 48, height: 48, borderRadius: 14, background: iconBg || C.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: \`1px solid \${C.cardBorder}\` }}>{icon}</div>}
          <div style={{ minWidth: 0 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: C.azulEscuro, margin: 0, fontFamily: Fn.title, lineHeight: 1.3 }}>{title}</h2>
            {subtitle && <p style={{ fontSize: 12, color: C.cinzaChumbo, margin: "3px 0 0", fontFamily: Fn.body }}>{subtitle}</p>}
          </div>
          <div style={{ position: "absolute", top: 12, right: 12, display: "flex", gap: 6, zIndex: 2 }}>
            <button onClick={cycleSize} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 8, border: \`1px solid \${C.cardBorder}\`, background: "transparent", cursor: "pointer", fontSize: 10, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: C.cinzaChumbo, fontFamily: Fn.title, transition: "all .15s" }}>
              {isFullscreen ? Ic.minimize(13, C.cinzaChumbo) : Ic.maximize(13, C.cinzaChumbo)}
              {sz.label}
            </button>
            <div onClick={onClose} tabIndex={0} role="button" aria-label="Fechar" style={{ width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all .15s", background: "transparent" }}>
              {Ic.x(16, C.cinzaChumbo)}
            </div>
          </div>
        </div>
        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", background: "#fafafa" }}>
          {typeof children === "function" ? children({ size, isWide: size !== "normal", isFullscreen }) : children}
        </div>
        {/* Footer */}
        {footer && <div style={{ padding: "14px 24px", borderTop: \`1px solid \${C.cardBorder}\`, background: C.bg, display: "flex", gap: 10, justifyContent: "flex-end", alignItems: "center", flexShrink: 0 }}>{footer}</div>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// USO:
// <PopupModal open={open} onClose={() => setOpen(false)}
//   title="Formulário" subtitle="Descrição"
//   icon={<span>📋</span>}
//   footer={<><button onClick={() => setOpen(false)}>Cancelar</button><button>Salvar</button></>}
// >
//   {({ size, isWide, isFullscreen }) => (
//     <div style={{ display: "grid", gridTemplateColumns: isWide ? "1fr 1fr" : "1fr", gap: 14 }}>
//       <input placeholder="Campo 1" />
//       <input placeholder="Campo 2" />
//       {isWide && <input placeholder="Campo extra (grande)" />}
//       {isFullscreen && <input placeholder="Campo extra (tela cheia)" />}
//     </div>
//   )}
// </PopupModal>
// ═══════════════════════════════════════════`;

/* ═══════════════════════════════════════════ COPYABLE HELPERS ═══════════════════════════════════════════ */
function modalCode(variant: string, title: string, subtitle: string, width: number) {
  const headerMap: Record<string,string> = {
    confirm: '#00904C',
    delete: '#B91C1C',
    alert: '#C2410C',
    info: '#002A68',
    form: '#002A68',
    list: '#002A68',
    popup: '#002A68',
    tutorial: '#002A68',
  };
  const headerBg = headerMap[variant] || '#002A68';

  if (variant === 'popup') {
    return `// DS-FIPS — Popup Modal "${title}" — Copy-paste ready
import { useState, useEffect } from "react";

export function PopupModalExample() {
  const [open, setOpen] = useState(false);
  const [vis, setVis] = useState(false);
  const [animIn, setAnimIn] = useState(false);

  useEffect(() => {
    if (open) { setVis(true); requestAnimationFrame(() => requestAnimationFrame(() => setAnimIn(true))); }
    else { setAnimIn(false); const t = setTimeout(() => setVis(false), 280); return () => clearTimeout(t); }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [open]);

  return (
    <>
      <button onClick={() => setOpen(true)}
        style={{ padding: "8px 18px", fontSize: 12, fontWeight: 600, background: "#004B9B", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontFamily: "'Open Sans', sans-serif" }}>
        Abrir Popup
      </button>
      {vis && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div onClick={() => setOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,42,104,.45)", backdropFilter: "blur(2px)", opacity: animIn ? 1 : 0, transition: "opacity .28s", cursor: "pointer" }} />
          <div style={{ position: "relative", zIndex: 1, width: ${width}, maxWidth: "95vw", maxHeight: "90vh", background: "#FFFFFF", borderRadius: "12px 12px 12px 24px", boxShadow: "0 12px 48px rgba(0,42,104,.2)", display: "flex", flexDirection: "column", transform: animIn ? "scale(1)" : "scale(.96)", opacity: animIn ? 1 : 0, transition: "all .28s cubic-bezier(.32,.72,.37,1.1)", overflow: "hidden" }}>
            <div style={{ padding: "20px 24px", paddingRight: 56, background: "${headerBg}", display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
              <div>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: "#FFFFFF", margin: 0, fontFamily: "'Saira Expanded', sans-serif" }}>${title}</h2>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", margin: "3px 0 0", fontFamily: "'Open Sans', sans-serif" }}>${subtitle}</p>
              </div>
            </div>
            <div onClick={() => setOpen(false)} style={{ position: "absolute", top: 14, right: 14, zIndex: 2, width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "rgba(255,255,255,0.08)" }}>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M5 5l10 10M15 5L5 15" stroke="rgba(255,255,255,0.75)" strokeWidth="1.8" strokeLinecap="round"/></svg>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <input placeholder="Campo 1" style={{ height: 35, padding: "0 12px", border: "1.5px solid #CBD5E1", borderRadius: 8, fontFamily: "'Open Sans', sans-serif", fontSize: 13 }} />
                <input placeholder="Campo 2" style={{ height: 35, padding: "0 12px", border: "1.5px solid #CBD5E1", borderRadius: 8, fontFamily: "'Open Sans', sans-serif", fontSize: 13 }} />
              </div>
            </div>
            <div style={{ padding: "14px 24px", borderTop: "1px solid #E2E8F0", background: "#F2F4F8", display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setOpen(false)} style={{ padding: "7px 18px", fontSize: 12, fontWeight: 600, background: "transparent", color: "#7B8C96", border: "1.5px solid #C0CCD2", borderRadius: 6, cursor: "pointer" }}>Cancelar</button>
              <button onClick={() => setOpen(false)} style={{ padding: "7px 18px", fontSize: 12, fontWeight: 600, background: "#004B9B", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}`;
  }
  if (variant === 'tutorial') {
    return `// DS-FIPS — Tutorial Modal "${title}" — Copy-paste ready
import { useState, useEffect } from "react";

export function TutorialModalExample() {
  const [open, setOpen] = useState(false);
  const [vis, setVis] = useState(false);
  const [animIn, setAnimIn] = useState(false);
  const [step, setStep] = useState(0);

  const steps = [
    { title: "Passo 1", description: "Descricao do primeiro passo.", tips: ["Dica 1"] },
    { title: "Passo 2", description: "Descricao do segundo passo." },
  ];

  useEffect(() => {
    if (open) { setStep(0); setVis(true); requestAnimationFrame(() => requestAnimationFrame(() => setAnimIn(true))); }
    else { setAnimIn(false); const t = setTimeout(() => setVis(false), 280); return () => clearTimeout(t); }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const h = (e) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight" && step < steps.length - 1) setStep((s) => s + 1);
      if (e.key === "ArrowLeft" && step > 0) setStep((s) => s - 1);
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [open, step]);

  const cur = steps[step];
  const total = steps.length;
  const pct = ((step + 1) / total) * 100;

  return (
    <>
      <button onClick={() => setOpen(true)}
        style={{ padding: "8px 18px", fontSize: 12, fontWeight: 600, background: "#004B9B", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontFamily: "'Open Sans', sans-serif" }}>
        Abrir Tutorial
      </button>
      {vis && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div onClick={() => setOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,42,104,.50)", backdropFilter: "blur(3px)", opacity: animIn ? 1 : 0, transition: "opacity .28s", cursor: "pointer" }} />
          <div style={{ position: "relative", zIndex: 1, width: 540, maxWidth: "95vw", maxHeight: "90vh", background: "#FFFFFF", borderRadius: "12px 12px 12px 24px", boxShadow: "0 12px 48px rgba(0,42,104,.22)", display: "flex", flexDirection: "column", transform: animIn ? "scale(1)" : "scale(.96)", opacity: animIn ? 1 : 0, transition: "all .28s cubic-bezier(.32,.72,.37,1.1)", overflow: "hidden" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: 16 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: "#002A68", margin: 0, fontFamily: "'Saira Expanded', sans-serif", flex: 1 }}>${title}</h2>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#004B9B", fontFamily: "'Fira Code', monospace" }}>{step + 1}/{total}</span>
              <span onClick={() => setOpen(false)} style={{ cursor: "pointer", opacity: 0.5 }}>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M5 5l10 10M15 5L5 15" stroke="#7B8C96" strokeWidth="1.8" strokeLinecap="round"/></svg>
              </span>
            </div>
            <div style={{ height: 3, background: "#F2F4F8" }}>
              <div style={{ height: "100%", width: pct + "%", background: "linear-gradient(90deg,#004B9B,#93BDE4)", borderRadius: 2, transition: "width .35s" }} />
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#002A68", margin: "0 0 12px", fontFamily: "'Saira Expanded', sans-serif" }}>{cur.title}</h3>
              <p style={{ fontSize: 13, color: "#333B41", lineHeight: 1.7, margin: "0 0 16px", fontFamily: "'Open Sans', sans-serif" }}>{cur.description}</p>
              {cur.tips && cur.tips.map((t, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                  <span style={{ color: "#004B9B", fontSize: 12 }}>→</span>
                  <span style={{ fontSize: 12, color: "#333B41", lineHeight: 1.5 }}>{t}</span>
                </div>
              ))}
            </div>
            <div style={{ padding: "14px 24px", borderTop: "1px solid #E2E8F0", background: "#F2F4F8", display: "flex", gap: 10, justifyContent: "flex-end" }}>
              {step > 0 && <button onClick={() => setStep((s) => s - 1)} style={{ padding: "7px 18px", fontSize: 12, fontWeight: 600, background: "transparent", color: "#7B8C96", border: "1.5px solid #C0CCD2", borderRadius: 6, cursor: "pointer" }}>Anterior</button>}
              {step < total - 1
                ? <button onClick={() => setStep((s) => s + 1)} style={{ padding: "7px 18px", fontSize: 12, fontWeight: 600, background: "#004B9B", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>Próximo</button>
                : <button onClick={() => setOpen(false)} style={{ padding: "7px 18px", fontSize: 12, fontWeight: 600, background: "#00C64C", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>Concluir</button>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}`;
  }
  return `// DS-FIPS — Modal "${title}" — Copy-paste ready
import { useState, useEffect } from "react";

export function ModalExample() {
  const [open, setOpen] = useState(false);
  const [vis, setVis] = useState(false);
  const [animIn, setAnimIn] = useState(false);

  useEffect(() => {
    if (open) { setVis(true); requestAnimationFrame(() => requestAnimationFrame(() => setAnimIn(true))); }
    else { setAnimIn(false); const t = setTimeout(() => setVis(false), 280); return () => clearTimeout(t); }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [open]);

  return (
    <>
      <button onClick={() => setOpen(true)}
        style={{ padding: "8px 18px", fontSize: 12, fontWeight: 600, background: "#004B9B", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontFamily: "'Open Sans', sans-serif" }}>
        Abrir Modal
      </button>
      {vis && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div onClick={() => setOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,42,104,.45)", backdropFilter: "blur(2px)", opacity: animIn ? 1 : 0, transition: "opacity .28s", cursor: "pointer" }} />
          <div style={{ position: "relative", zIndex: 1, width: ${width}, maxWidth: "95vw", maxHeight: "90vh", background: "#FFFFFF", borderRadius: "12px 12px 12px 24px", boxShadow: "0 12px 48px rgba(0,42,104,.2)", display: "flex", flexDirection: "column", transform: animIn ? "scale(1)" : "scale(.96)", opacity: animIn ? 1 : 0, transition: "all .28s cubic-bezier(.32,.72,.37,1.1)", overflow: "hidden" }}>
            <div style={{ padding: "20px 24px", paddingRight: 56, background: "${headerBg}", display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
              <div>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: "#FFFFFF", margin: 0, fontFamily: "'Saira Expanded', sans-serif" }}>${title}</h2>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", margin: "3px 0 0", fontFamily: "'Open Sans', sans-serif" }}>${subtitle}</p>
              </div>
            </div>
            <div onClick={() => setOpen(false)} style={{ position: "absolute", top: 14, right: 14, zIndex: 2, width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "rgba(255,255,255,0.08)" }}>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M5 5l10 10M15 5L5 15" stroke="rgba(255,255,255,0.75)" strokeWidth="1.8" strokeLinecap="round"/></svg>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
              <p style={{ fontSize: 13, color: "#333B41", fontFamily: "'Open Sans', sans-serif" }}>Conteudo do modal aqui.</p>
            </div>
            <div style={{ padding: "14px 24px", borderTop: "1px solid #E2E8F0", background: "#F2F4F8", display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setOpen(false)} style={{ padding: "7px 18px", fontSize: 12, fontWeight: 600, background: "transparent", color: "#7B8C96", border: "1.5px solid #C0CCD2", borderRadius: 6, cursor: "pointer" }}>Cancelar</button>
              <button onClick={() => setOpen(false)} style={{ padding: "7px 18px", fontSize: 12, fontWeight: 600, background: "#004B9B", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}`;
}

/* ═══════════════════════════════════════════ EXPORTAÇÃO ═══════════════════════════════════════════ */
const EXPORT_COLUMNS = [
  { key: 'codigo', label: 'Código' },
  { key: 'titulo', label: 'Título' },
  { key: 'status', label: 'Status' },
  { key: 'area', label: 'Área' },
  { key: 'detalhe', label: 'Detalhe expandido' },
];
const EXPORT_ROWS = Array.from({ length: 24 }, (_, i) => ({
  codigo: `REQ-${4000 + i}`,
  titulo: `Requisição de compra ${i + 1}`,
  status: i % 3 === 0 ? 'concluido' : 'em_andamento',
  area: 'Suprimentos',
  detalhe: `Linha ${i + 1}`,
}));
const EXPORT_MODAL_CODE = `// DS-FIPS — ExportPreviewModal "Exportar planilha" — composite completo (paridade Tecnopano)
// Fonte: src/components/composites/ExportPreviewModal.tsx
// Padrão dedicado com mais contexto: /docs/patterns/export-modal

import { useState } from "react";
import { ExportPreviewModal } from "../components/composites/ExportPreviewModal";

const COLUMNS = [
  { key: "codigo", label: "Código" },
  { key: "titulo", label: "Título" },
  { key: "status", label: "Status" },
  { key: "area", label: "Área" },
  { key: "detalhe", label: "Detalhe expandido" },
];

export function ExportExample({ rows }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Exportar</button>
      <ExportPreviewModal
        open={open}
        onOpenChange={setOpen}
        intent="excel"
        filename="requisicoes"
        columns={COLUMNS}
        data={rows}
        onExportExcel={() => {/* gerar XLSX */}}
        onPrint={() => window.print()}
      />
    </>
  );
}`;

/* ═══════════════════════════════════════════ MAIN ═══════════════════════════════════════════ */
export default function DialogDoc(){
  const [w,setW]=useState(typeof window!=="undefined"?window.innerWidth:1200);
  useEffect(()=>{const h=()=>setW(window.innerWidth);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h)},[]);
  const mob=w<640;
  const [m,setM]=useState(null);
  const open=id=>setM(id);const close=()=>setM(null);

  const tutorialSteps=[
    {title:"Playground interativo",ref:"Seção 01 — Topo da página",description:"O playground permite testar cada tipo de modal em tempo real. Clique nos botões coloridos para abrir os 6 tipos de modal disponíveis no DS-FIPS. Cada variante tem cor, ícone e comportamento específico para seu contexto de uso.",tips:["Todos os modais fecham com ESC, clique no overlay ou botão X","Teste no mobile — os modais adaptam para 95vw automaticamente"],visual:(
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        {[{l:"✓ Confirm.",c:C.verdeFloresta},{l:"✕ Destrutivo",c:C.danger},{l:"⚠ Alerta",c:C.amareloEscuro},{l:"ℹ Info",c:C.azulProfundo},{l:"📝 Form",c:C.azulCeu},{l:"📋 Lista",c:C.cinzaChumbo}].map(b=>(
          <span key={b.l} style={{padding:"4px 12px",fontSize:11,borderRadius:6,background:`${b.c}15`,color:b.c,fontWeight:600,fontFamily:Fn.body,border:`1px solid ${b.c}30`}}>{b.l}</span>
        ))}
      </div>
    )},
    {title:"Guia de uso por tipo",ref:"Seção 02 — Regras de cada variante",description:"Cada tipo de modal tem regras claras de CTA (botões), cor dominante e quando usar. O card azul abaixo dos tipos mostra a hierarquia: Modal para decisões rápidas, Drawer para visualização lateral, Tela para cadastros complexos.",tips:["NUNCA use botão verde para ação de exclusão","Modal informativo tem apenas 1 botão ('Entendi'), sem cancelar","Formulários no modal devem ter no máximo 6 campos — mais que isso, use Drawer ou tela dedicada"]},
    {title:"Anatomia do modal",ref:"Seção 03 — Estrutura em 5 camadas",description:"O modal DS-FIPS segue uma estrutura rigorosa de 5 camadas: Overlay → Panel → Header → Body → Footer. O diagrama interativo mostra a composição visual de cada camada com seus tokens de design exatos.",tips:["O border-radius assimétrico (12 12 12 24) é padrão do Brandbook FIPS","O ícone no Header usa container 48×48 com radius 14px e cor contextual"],visual:(
      <div style={{display:"flex",gap:8}}>
        {[{n:"①",nm:"Overlay",c:C.azulEscuro},{n:"②",nm:"Panel",c:C.cinzaChumbo},{n:"③",nm:"Header",c:C.verdeFloresta},{n:"④",nm:"Body",c:C.amareloEscuro},{n:"⑤",nm:"Footer",c:C.azulCeu}].map(l=>(
          <div key={l.n} style={{flex:1,textAlign:"center",padding:"8px 4px",borderRadius:6,background:`${l.c}10`,borderBottom:`2px solid ${l.c}`}}>
            <span style={{fontSize:14,fontWeight:700,color:l.c,fontFamily:Fn.mono,display:"block"}}>{l.n}</span>
            <span style={{fontSize:10,color:C.cinzaChumbo}}>{l.nm}</span>
          </div>
        ))}
      </div>
    )},
    {title:"Acessibilidade e tokens",ref:"Seções 04–08 — Referência completa",description:"As seções finais cobrem atalhos de teclado (ESC, Tab, Enter), atributos ARIA obrigatórios, regras de Faça/Evite, três tamanhos padrão (Compacto, Padrão, Largo), micro-interações de UX (blur, spring animation, glow) e todos os tokens de design.",tips:["Sempre conecte o título via aria-labelledby","Ao fechar, retorne o foco ao elemento que abriu o modal","Use cubic-bezier(.32,.72,.37,1.1) para animação de entrada — leve overshoot orgânico","Body backgrounds: transparente (padrão), #fafafa (formulário), #f5f6f8 (lista)"]},
  ];

  return(
    <PlaygroundProvider>
    <div style={{minHeight:"100vh",background:"var(--color-surface-muted)",fontFamily:Fn.body,color:C.cinzaEscuro}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Saira+Expanded:wght@300;400;500;600;700;800&family=Open+Sans:wght@300;400;600;700&family=Fira+Code:wght@400;500&display=swap');`}</style>

      {/* ══════════════════════════════════════════════
          LIVE MODALS
          ══════════════════════════════════════════════ */}

      {/* 1. CONFIRMAÇÃO */}
      <Modal open={m==="confirm"} onClose={close} eyebrow="Confirmação" eyebrowColor="rgba(255,255,255,0.9)" title="Aprovar requisição?" subtitle="Encaminhará REQ-4025 para o departamento de compras." icon={Ic.check(24,"#fff")} width={440} headerBg="#00904C"
        footer={<><Btn label="Cancelar" outline onClick={close}/><Btn label="Aprovar" color={C.verdeFloresta} onClick={close}/></>}>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{display:"flex",justifyContent:"space-between",padding:"10px 14px",background:C.bg,borderRadius:8}}><span style={{fontSize:12,color:C.cinzaChumbo}}>Solicitante</span><span style={{fontSize:13,fontWeight:600}}>Carlos Santos</span></div>
          <div style={{display:"flex",justifyContent:"space-between",padding:"10px 14px",background:C.bg,borderRadius:8}}><span style={{fontSize:12,color:C.cinzaChumbo}}>Valor total</span><span style={{fontSize:13,fontWeight:700,color:C.azulProfundo}}>R$ 2.450,00</span></div>
          <div style={{display:"flex",justifyContent:"space-between",padding:"10px 14px",background:C.bg,borderRadius:8}}><span style={{fontSize:12,color:C.cinzaChumbo}}>Status</span><Badge variant="atencao" dot>Pendente</Badge></div>
        </div>
      </Modal>

      {/* 2. DESTRUTIVO */}
      <Modal open={m==="delete"} onClose={close} eyebrow="Ação irreversível" eyebrowColor="rgba(255,255,255,0.9)" title="Excluir fornecedor?" subtitle="Esta ação é irreversível e afetará contratos ativos." icon={Ic.trash(24,"#fff")} width={420} headerBg="#B91C1C" footerBg="#FEF8F8"
        footer={<><Btn label="Cancelar" outline onClick={close}/><Btn label="Excluir permanentemente" danger onClick={close}/></>}>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div style={{padding:"12px 16px",background:C.bg,borderRadius:8}}>
            <span style={{fontSize:14,fontWeight:700,color:C.cinzaEscuro,display:"block"}}>MRS Logística S.A.</span>
            <span style={{fontSize:11,color:C.textMuted}}>CNPJ: 01.417.222/0001-77 · Ativo desde 2019</span>
          </div>
          <div style={{background:"#FEF2F2",border:"1px solid #FECACA",borderRadius:8,padding:"12px 16px",display:"flex",gap:10,alignItems:"flex-start"}}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{flexShrink:0,marginTop:1}}><path d="M10 2L1.5 17h17L10 2z" stroke={C.danger} strokeWidth="1.5" strokeLinejoin="round"/><path d="M10 8v4M10 14v.5" stroke={C.danger} strokeWidth="1.8" strokeLinecap="round"/></svg>
            <div>
              <span style={{fontSize:12,fontWeight:700,color:"#B91C1C",display:"block",marginBottom:2}}>Impacto desta ação:</span>
              <span style={{fontSize:11,color:"#B91C1C",lineHeight:1.5,display:"block"}}>3 contratos ativos serão cancelados. Histórico de 47 requisições será perdido. Esta ação não pode ser desfeita.</span>
            </div>
          </div>
        </div>
      </Modal>

      {/* 3. ALERTA */}
      <Modal open={m==="alert"} onClose={close} eyebrow="Atenção" eyebrowColor="rgba(255,255,255,0.9)" title="Sessão expirando" subtitle="Sessões inativas são encerradas por segurança." icon={Ic.alertTri(24,"#fff")} width={400} headerBg="#C2410C"
        footer={<><Btn label="Sair agora" outline onClick={close}/><Btn label="Renovar sessão" color={C.azulProfundo} onClick={close}/></>}>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{padding:"16px",background:"#FFF7ED",border:"1px solid #FDBA74",borderRadius:8,textAlign:"center"}}>
            <span style={{fontSize:28,fontWeight:700,color:C.amareloEscuro,fontFamily:Fn.mono,display:"block"}}>4:59</span>
            <span style={{fontSize:11,color:"#C2410C"}}>minutos restantes</span>
          </div>
          <p style={{fontSize:13,color:C.cinzaChumbo,margin:0,lineHeight:1.5,textAlign:"center"}}>Clique em <strong>"Renovar"</strong> para continuar trabalhando sem perder dados.</p>
        </div>
      </Modal>

      {/* 4. INFORMATIVO — detalhe de artefato read-only (modelo oficial: "Movimentação de Pátio" / Governança BI) */}
      <Modal open={m==="info"} onClose={close} eyebrow="Dashboard" title="Movimentação de Pátio" icon={Ic.grid(24,C.amareloOuro)} iconBg={`${C.amareloOuro}1A`} iconBorder={`${C.amareloOuro}30`} headerBg={GOV_GRAD} width={680}
        footer={<Btn label="Entendi" color={C.azulProfundo} onClick={close}/>}>
        <div style={{display:"flex",flexDirection:"column",gap:18}}>
          {/* Descrição read-only */}
          <p style={{fontSize:13,color:C.cinzaEscuro,margin:0,lineHeight:1.6}}>Movimentação diária de contêineres por terminal, turno e tipo de operação. Consolida entradas e saídas do pátio para acompanhamento operacional.</p>
          {/* Classificação */}
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            <Badge variant="info" dot>Operacional</Badge>
            <Badge variant="critico" dot>Crítico</Badge>
            <Badge variant="sucesso" dot>Publicado</Badge>
            <Badge variant="info">RLS ativo</Badge>
          </div>
          {/* Metadados — ficha em cartões */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
            {[
              {l:"Área Processo",v:"Operações Portuárias"},
              {l:"Workspace",v:"Pátio & Terminais"},
              {l:"Abrangência",v:"Corporativo"},
              {l:"Responsável",v:"Ana Ribeiro"},
              {l:"Publicação",v:"12 mar 2025"},
              {l:"Atualização",v:"Diária"},
            ].map(f=><InfoCard key={f.l} label={f.l} value={f.v}/>)}
          </div>
          {/* Auditoria — read-only, condicional por papel */}
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <div style={{display:"flex",alignItems:"center",gap:7}}>
              {Ic.lock(14,C.textMuted)}
              <span style={{fontSize:11,fontWeight:600,letterSpacing:".04em",textTransform:"uppercase",color:C.textMuted,fontFamily:Fn.body}}>Auditoria · visível para Responsável BI e TI</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
              {[
                {l:"Fonte de Dados",v:"SAP TM · Oracle WMS"},
                {l:"Método",v:"Pipeline incremental"},
                {l:"Frequência",v:"A cada 4h"},
                {l:"Última Revisão",v:"28 mai 2026"},
                {l:"Público-Alvo",v:"Coordenação operacional"},
              ].map(f=><InfoCard key={f.l} label={f.l} value={f.v}/>)}
              <InfoCard label="Risco de Fonte" value={<Badge variant="sucesso">Baixo</Badge>}/>
            </div>
          </div>
        </div>
      </Modal>

      {/* 5. FORMULÁRIO — body #fafafa */}
      <Modal open={m==="form"} onClose={close} title="Atribuir responsável" subtitle="Selecione o colaborador e tipo de atribuição." icon={Ic.pessoaLg(24,C.amareloOuro)} iconBg={`${C.amareloOuro}1A`} iconBorder={`${C.amareloOuro}30`} bodyBg="#fafafa" headerBg={GOV_GRAD} width={480}
        footer={<><Btn label="Cancelar" outline onClick={close}/><Btn label="Salvar atribuição" color={C.verdeFloresta} onClick={close}/></>}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <FInput label="Responsável" placeholder="Nome do colaborador" required icon={Ic.pessoa(14)}/>
          <FSelect label="Tipo" options={["Interno","Externo","Terceiro"]} value="Interno" icon={Ic.tag(14)}/>
          <FSelect label="Prioridade" options={["Baixa","Média","Alta","Urgente"]} value="Média" icon={Ic.doc(14)}/>
          <FInput label="Prazo" type="date" icon={Ic.cal(14)}/>
        </div>
        <div style={{marginTop:14}}>
          <label style={{fontSize:12,fontWeight:600,lineHeight:"16px",color:C.cinzaEscuro,fontFamily:Fn.body,marginLeft:12,display:"block",marginBottom:4}}>Observação</label>
          <textarea placeholder="Notas sobre a atribuição..." rows={2} style={{width:"100%",minHeight:72,padding:"8px 12px",border:`1px solid ${C.inputBorder}`,borderRadius:12,fontFamily:Fn.body,fontSize:14,color:C.cinzaEscuro,outline:"none",resize:"vertical",boxSizing:"border-box",background:C.branco,boxShadow:FIELD_BASE_SHADOW,transition:"all .2s"}} onFocus={e=>fieldFocus(e.target)} onBlur={e=>fieldBlur(e.target)}/>
        </div>
      </Modal>

      {/* 6. LISTA — body #f5f6f8 */}
      <Modal open={m==="list"} onClose={close} title="Itens da requisição" subtitle="REQ-4025 · 3 itens · R$ 2.450,00" icon={Ic.docLg(24,C.amareloOuro)} iconBg={`${C.amareloOuro}1A`} iconBorder={`${C.amareloOuro}30`} bodyBg="#f5f6f8" headerBg={GOV_GRAD} width={520} noPadBody
        footer={<><span style={{fontSize:11,color:C.textMuted,marginRight:"auto",fontWeight:600}}>Total: <span style={{color:C.azulProfundo,fontSize:13}}>R$ 2.450,00</span></span><Btn label="Fechar" outline onClick={close}/><Btn label="Aprovar tudo" color={C.verdeFloresta} onClick={close}/></>}>
        <div>
          {[
            {item:"Extintor PQS 6kg",qty:3,val:"R$ 450,00",status:"sucesso",sl:"Cotado"},
            {item:"Cone sinalização 75cm",qty:10,val:"R$ 1.200,00",status:"sucesso",sl:"Cotado"},
            {item:"Fita zebrada 200m",qty:5,val:"R$ 800,00",status:"atencao",sl:"Aguardando"},
          ].map((r,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",padding:"14px 24px",borderBottom:i<2?`1px solid ${C.cardBorder}`:"none",gap:14,background:C.branco,transition:"background .1s"}} onMouseEnter={e=>e.currentTarget.style.background=C.bg} onMouseLeave={e=>e.currentTarget.style.background=C.branco}>
              <div style={{flex:1}}>
                <span style={{fontSize:13,fontWeight:600,color:C.cinzaEscuro,display:"block"}}>{r.item}</span>
                <span style={{fontSize:11,color:C.textMuted}}>Qtd: {r.qty}</span>
              </div>
              <Badge variant={r.status} dot>{r.sl}</Badge>
              <span style={{fontSize:13,fontWeight:700,color:C.azulEscuro,fontFamily:Fn.mono,minWidth:85,textAlign:"right"}}>{r.val}</span>
            </div>
          ))}
        </div>
      </Modal>

      {/* 7. POPUP — Resizable */}
      <PopupModal open={m==="popup"} onClose={close} title="Atribuir responsável" subtitle="Selecione o colaborador e tipo de atribuição para a tarefa." icon={Ic.popup(24,C.amareloOuro)} iconBg={`${C.amareloOuro}1A`} iconBorder={`${C.amareloOuro}30`}
        footer={<><Btn label="Cancelar" outline onClick={close}/><Btn label="Salvar atribuição" color={C.verdeFloresta} onClick={close}/></>}>
        {({size,isWide,isFullscreen})=>(
          <div style={{display:"grid",gridTemplateColumns:isWide?"1fr 1fr":"1fr",gap:isFullscreen?20:14}}>
            <FInput label="Responsável" placeholder="Nome do colaborador" required icon={Ic.pessoa(14)}/>
            <FSelect label="Tipo" options={["Interno","Externo","Terceiro"]} icon={Ic.tag(14)}/>
            <FSelect label="Prioridade" options={["Baixa","Média","Alta","Urgente"]} icon={Ic.doc(14)}/>
            <FInput label="Prazo" type="date" icon={Ic.cal(14)}/>
            {isWide&&<>
              <FSelect label="Departamento" options={["Operações","Logística","Administrativo","Financeiro"]}/>
              <FInput label="Observação" placeholder="Notas sobre a atribuição..."/>
            </>}
            {isFullscreen&&<>
              <FInput label="E-mail" placeholder="email@empresa.com"/>
              <FInput label="Telefone" placeholder="(00) 00000-0000"/>
              <FSelect label="Turno" options={["Manhã","Tarde","Noite","Integral"]}/>
              <FSelect label="Nível de acesso" options={["Visualização","Edição","Aprovação","Administrador"]}/>
            </>}
            <div style={{gridColumn:isWide?"1 / -1":"auto",padding:"10px 14px",background:`${C.azulCeuClaro}30`,borderRadius:8,display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:11,color:C.azulProfundo,fontWeight:600,fontFamily:Fn.body}}>Tamanho atual:</span>
              <span style={{fontSize:12,fontWeight:700,color:C.azulEscuro,fontFamily:Fn.mono,textTransform:"uppercase"}}>{size}</span>
              <span style={{fontSize:11,color:C.cinzaChumbo,marginLeft:4}}>— Clique no botão no header para alternar</span>
            </div>
          </div>
        )}
      </PopupModal>

      {/* 8. TUTORIAL CONTEXTUAL */}
      <TutorialModal open={m==="tutorial"} onClose={close} title="Como usar esta página" subtitle="Tour guiado pelos recursos do Modal (Dialog)" steps={tutorialSteps}/>

      {/* 9. EXPORTAÇÃO — composite real ExportPreviewModal (paridade Tecnopano), não o ExportModal legado */}
      <ExportPreviewModal
        open={m==="export"}
        onOpenChange={(v)=> v ? open("export") : close()}
        intent="excel"
        filename="requisicoes"
        columns={EXPORT_COLUMNS}
        tableColumnKeys={['codigo','titulo','status','area']}
        expandedColumnKeys={['codigo','titulo','status','area','detalhe']}
        data={EXPORT_ROWS}
        onExportExcel={()=>undefined}
        onPrint={()=>window.print()}
      />

      {/* ══════════════════════════════════════════════
          PAGE CONTENT
          ══════════════════════════════════════════════ */}
      <header style={{background:`linear-gradient(135deg,${C.azulProfundo} 0%,${C.azulEscuro} 100%)`,padding:mob?"32px 20px":"48px 40px 44px",position:"relative",overflow:"hidden"}}>
        <JunctionLines style={{position:"absolute",top:-10,right:-20,width:mob?250:400,height:250}}/>
        <div style={{position:"relative"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:6,background:`${C.branco}10`,border:`1px solid ${C.branco}18`,borderRadius:20,padding:"5px 14px",fontSize:11,fontWeight:600,letterSpacing:"1.5px",textTransform:"uppercase",color:C.amareloOuro,fontFamily:Fn.title,marginBottom:16}}>{Ic.grid(14,C.amareloOuro)} Design System FIPS</div>
          <h1 style={{fontSize:mob?30:44,fontWeight:700,color:C.branco,margin:"0 0 10px",fontFamily:Fn.title}}>Modal</h1>
          <p style={{fontSize:16,color:`${C.branco}B0`,lineHeight:1.6,maxWidth:700,margin:0,fontFamily:Fn.body}}>Janela sobreposta para confirmações, alertas, formulários e decisões. Overlay com blur, animação spring, ESC fecha, border-radius do Brandbook, aria-modal para acessibilidade.</p>
        </div>
      </header>

      <div style={{padding:mob?"24px 16px 40px":"36px 40px 60px",maxWidth:1100}}>

        {/* ═══════════════════ 01 — PLAYGROUND ═══════════════════ */}
        <Section n="01" title="Playground interativo" desc="Clique em qualquer botão para abrir o modal e copiar o código correspondente. ESC ou overlay para fechar. Hover nos botões para ver feedback visual.">
          <DSCard mob={mob}>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              <Copyable label="Modal Confirmação" code={modalCode("confirm","Aprovar requisição?","Encaminhará REQ-4025 para o departamento de compras.",440)} preview={<Btn label="✓ Confirmação" color={C.verdeFloresta} onClick={()=>open("confirm")}/>}>
                <Btn label="✓ Confirmação" color={C.verdeFloresta} onClick={()=>open("confirm")}/>
              </Copyable>
              <Copyable label="Modal Destrutivo" code={modalCode("delete","Excluir fornecedor?","Esta ação é irreversível e afetará contratos ativos.",420)} preview={<Btn label="✕ Destrutivo" danger onClick={()=>open("delete")}/>}>
                <Btn label="✕ Destrutivo" danger onClick={()=>open("delete")}/>
              </Copyable>
              <Copyable label="Modal Alerta" code={modalCode("alert","Sessão expirando","Sessões inativas são encerradas por segurança.",400)} preview={<Btn label="⚠ Alerta" color={C.amareloEscuro} onClick={()=>open("alert")}/>}>
                <Btn label="⚠ Alerta" color={C.amareloEscuro} onClick={()=>open("alert")}/>
              </Copyable>
              <Copyable label="Modal Informativo" code={modalCode("info","Movimentação de Pátio","Detalhe de artefato BI — somente leitura",680)} preview={<Btn label="ℹ Informativo" color={C.azulProfundo} onClick={()=>open("info")}/>}>
                <Btn label="ℹ Informativo" color={C.azulProfundo} onClick={()=>open("info")}/>
              </Copyable>
              <Copyable label="Modal Formulário" code={modalCode("form","Atribuir responsável","Selecione o colaborador e tipo de atribuição.",480)} preview={<Btn label="📝 Formulário" color={C.azulCeu} onClick={()=>open("form")}/>}>
                <Btn label="📝 Formulário" color={C.azulCeu} onClick={()=>open("form")}/>
              </Copyable>
              <Copyable label="Modal Lista" code={modalCode("list","Itens da requisição","REQ-4025 · 3 itens · R$ 2.450,00",520)} preview={<Btn label="📋 Lista" color={C.cinzaChumbo} onClick={()=>open("list")}/>}>
                <Btn label="📋 Lista" color={C.cinzaChumbo} onClick={()=>open("list")}/>
              </Copyable>
              <Copyable label="Modal Popup" code={modalCode("popup","Atribuir responsável","Selecione o colaborador e tipo de atribuição para a tarefa.",480)} preview={<Btn label="🖥 Popup" color={C.azulClaro} onClick={()=>open("popup")}/>}>
                <Btn label="🖥 Popup" color={C.azulClaro} onClick={()=>open("popup")}/>
              </Copyable>
              <Copyable label="Modal Tutorial" code={modalCode("tutorial","Como usar esta página","Tour guiado pelos recursos do Modal (Dialog)",540)} preview={<Btn label="❓ Tutorial" color={C.azulEscuro} onClick={()=>open("tutorial")}/>}>
                <Btn label="❓ Tutorial" color={C.azulEscuro} onClick={()=>open("tutorial")}/>
              </Copyable>
              <Copyable label="Modal Exportação" code={EXPORT_MODAL_CODE} preview={<Btn label="📤 Exportação" color={C.azulCeuProfundo} onClick={()=>open("export")}/>}>
                <Btn label="📤 Exportação" color={C.azulCeuProfundo} onClick={()=>open("export")}/>
              </Copyable>
            </div>
            <p style={{fontSize:11,color:C.textMuted,marginTop:14,lineHeight:1.6}}>9 variantes: confirmação, destrutivo, alerta, informativo, formulário, lista, popup redimensionável, tutorial step-by-step e exportação (ExportPreviewModal — Tudo/Tabela/Expandida, chips, drag, Imprimir/Planilha). Todos fecham com ESC, clique no overlay ou botão X.</p>
          </DSCard>
        </Section>

        {/* ═══════════════════ 02 — GUIA ═══════════════════ */}
        <Section n="02" title="Guia de uso por tipo" desc="Seis propósitos com regras de CTA, cor e comportamento.">
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:16}}>
            {[
              {name:"Confirmação",c:C.verdeFloresta,desc:"Pedir confirmação antes de ação positiva. Dados em cards bg cinza.",cta:"Cancelar (outline) + Ação verde (aprovar/salvar).",ex:"'Aprovar requisição?' no Suprimentos; 'Salvar alterações?'"},
              {name:"Destrutivo",c:C.danger,desc:"Ação irreversível. Footer com tint vermelho. Alerta de impacto visível.",cta:"Cancelar (outline) + Excluir (vermelho). NUNCA verde para excluir.",ex:"'Excluir fornecedor?' no App Cadastros; 'Revogar acesso?'"},
              {name:"Alerta",c:C.amareloEscuro,desc:"Aviso com timer ou countdown. Card laranja com número grande.",cta:"Ação secundária + Ação principal (azul).",ex:"'Sessão expirando'; 'Prazo vencendo'; aviso de sistema."},
              {name:"Informativo",c:C.azulProfundo,desc:"Detalhe read-only de um artefato: descrição + classificação + ficha de metadados (auditoria por papel).",cta:"Apenas 'Entendi' (azul). Sem cancelar.",ex:"'Movimentação de Pátio'; 'Detalhe de indicador'; ficha de dashboard."},
              {name:"Formulário",c:C.azulCeu,desc:"Modal com inputs. Body #fafafa para contraste. Focus ring nos campos.",cta:"Cancelar + Salvar (verde). Validação visual nos campos.",ex:"'Atribuir responsável'; 'Adicionar nota'; criação rápida."},
              {name:"Lista de itens",c:C.cinzaChumbo,desc:"Itens em rows com hover. Body #f5f6f8. Total no footer à esquerda.",cta:"Total + Fechar + Ação contextual.",ex:"'Itens da requisição'; 'Pendências'; checklist de aprovação."},
            ].map(t=>(
              <div key={t.name} style={{...gc,borderLeft:`4px solid ${t.c}`}}>
                <div style={gh}><span style={{fontSize:13,fontWeight:700,color:C.azulEscuro,fontFamily:Fn.title}}>{t.name}</span></div>
                <div style={gb}>
                  <p style={gt}>{t.desc}</p>
                  <div style={gl}>Botões (CTA)</div><p style={gt}>{t.cta}</p>
                  <div style={gl}>Exemplo FIPS</div><p style={ge}>{t.ex}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{marginTop:16,background:`${C.azulCeuClaro}40`,border:`1px solid ${C.azulCeuClaro}`,borderRadius:12,padding:20,display:"flex",gap:14,alignItems:"flex-start"}}>
            <div style={{width:20,height:20,borderRadius:"50%",background:C.azulProfundo,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{color:C.branco,fontSize:12,fontWeight:700}}>i</span></div>
            <div>
              <p style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,margin:"0 0 6px"}}>Modal vs Drawer vs Tela</p>
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                {[{r:"Confirmação ou decisão rápida",v:"→ Modal",c:C.azulProfundo},{r:"Visualizar/editar sem sair da lista",v:"→ Drawer",c:C.verdeFloresta},{r:"Cadastro complexo ou multi-step",v:"→ Tela dedicada",c:C.cinzaChumbo}].map(i=>(
                  <div key={i.r} style={{display:"flex",alignItems:"center",gap:8,fontSize:12}}><div style={{width:6,height:6,borderRadius:"50%",background:i.c,flexShrink:0}}/><span style={{color:C.cinzaChumbo,flex:1}}>{i.r}</span><span style={{fontWeight:700,color:i.c}}>{i.v}</span></div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* ═══════════════════ 03 — ANATOMIA ═══════════════════ */}
        <Section n="03" title="Anatomia do Modal" desc="Estrutura em 5 camadas — cada uma com responsabilidade visual e funcional definida.">
          <DSCard mob={mob}>
            {/* Visual diagram */}
            <div style={{position:"relative",borderRadius:12,overflow:"hidden",border:`2px dashed ${C.azulCeu}`,padding:0}}>
              {/* Layer 1 — Overlay */}
              <div style={{background:"rgba(0,42,104,.12)",padding:mob?12:20}}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:mob?8:12}}>
                  <span style={{width:8,height:8,borderRadius:"50%",background:C.azulEscuro}}/>
                  <span style={{fontSize:10,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.azulEscuro,fontFamily:Fn.title}}>① Overlay</span>
                  <code style={{fontSize:10,fontFamily:Fn.mono,color:C.textMuted,marginLeft:4}}>rgba(0,42,104,.45) + blur(2px)</code>
                </div>

                {/* Layer 2 — Panel */}
                <div style={{background:C.cardBg,borderRadius:"12px 12px 12px 24px",boxShadow:"0 8px 32px rgba(0,42,104,.15)",overflow:"hidden",maxWidth:mob?"100%":440,margin:"0 auto"}}>

                  {/* Layer 3 — Header */}
                  <div style={{padding:"16px 20px",borderBottom:`1px solid ${C.cardBorder}`,display:"flex",alignItems:"center",justifyContent:"space-between",position:"relative"}}>
                    <div style={{display:"flex",alignItems:"center",gap:12}}>
                      <div style={{width:42,height:42,borderRadius:12,background:`${C.verdeFloresta}10`,border:`1px solid ${C.cardBorder}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                        {Ic.check(22,C.verdeFloresta)}
                      </div>
                      <div>
                        <div style={{fontSize:14,fontWeight:700,color:C.azulEscuro,fontFamily:Fn.title}}>Título do modal</div>
                        <div style={{fontSize:11,color:C.cinzaChumbo}}>Subtítulo descritivo</div>
                      </div>
                    </div>
                    <div style={{width:28,height:28,borderRadius:6,background:C.bg,display:"flex",alignItems:"center",justifyContent:"center"}}>{Ic.x(14,C.cinzaChumbo)}</div>
                    {/* Label */}
                    <div style={{position:"absolute",top:-1,right:mob?60:100}}>
                      <div style={{display:"flex",alignItems:"center",gap:4}}>
                        <span style={{width:8,height:8,borderRadius:"50%",background:C.verdeFloresta}}/>
                        <span style={{fontSize:10,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.verdeFloresta,fontFamily:Fn.title}}>③ Header</span>
                      </div>
                    </div>
                  </div>

                  {/* Layer 4 — Body */}
                  <div style={{padding:"16px 20px",background:"#fafafa",position:"relative",minHeight:60}}>
                    <div style={{display:"flex",gap:10}}>
                      <div style={{flex:1,height:28,background:C.branco,borderRadius:6,border:`1px solid ${C.inputBorder}`}}/>
                      <div style={{flex:1,height:28,background:C.branco,borderRadius:6,border:`1px solid ${C.inputBorder}`}}/>
                    </div>
                    <div style={{marginTop:8,height:28,background:C.branco,borderRadius:6,border:`1px solid ${C.inputBorder}`}}/>
                    <div style={{position:"absolute",top:4,right:20,display:"flex",alignItems:"center",gap:4}}>
                      <span style={{width:8,height:8,borderRadius:"50%",background:C.amareloEscuro}}/>
                      <span style={{fontSize:10,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.amareloEscuro,fontFamily:Fn.title}}>④ Body</span>
                    </div>
                  </div>

                  {/* Layer 5 — Footer */}
                  <div style={{padding:"12px 20px",background:C.bg,borderTop:`1px solid ${C.cardBorder}`,display:"flex",justifyContent:"flex-end",gap:8,position:"relative"}}>
                    <div style={{padding:"6px 16px",borderRadius:6,border:`1px solid ${C.cinzaClaro}`,fontSize:11,color:C.cinzaChumbo,fontFamily:Fn.body}}>Cancelar</div>
                    <div style={{padding:"6px 16px",borderRadius:6,background:C.verdeFloresta,fontSize:11,color:C.branco,fontWeight:600,fontFamily:Fn.body}}>Confirmar</div>
                    <div style={{position:"absolute",top:4,left:20,display:"flex",alignItems:"center",gap:4}}>
                      <span style={{width:8,height:8,borderRadius:"50%",background:C.azulCeu}}/>
                      <span style={{fontSize:10,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.azulCeu,fontFamily:Fn.title}}>⑤ Footer</span>
                    </div>
                  </div>
                </div>

                {/* Panel label */}
                <div style={{display:"flex",alignItems:"center",gap:4,marginTop:mob?8:12}}>
                  <span style={{width:8,height:8,borderRadius:"50%",background:C.cinzaChumbo}}/>
                  <span style={{fontSize:10,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.cinzaChumbo,fontFamily:Fn.title}}>② Panel</span>
                  <code style={{fontSize:10,fontFamily:Fn.mono,color:C.textMuted,marginLeft:4}}>radius 12 12 12 24 · shadow dual</code>
                </div>
              </div>
            </div>

            {/* Camadas table */}
            <div style={{marginTop:24,display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:10}}>
              {[
                {n:"①",name:"Overlay",color:C.azulEscuro,desc:"Fundo escuro semi-transparente com blur(2px). Clique fecha o modal. z-index: 1000."},
                {n:"②",name:"Panel",color:C.cinzaChumbo,desc:"Container branco com border-radius FIPS (12 12 12 24). Sombra dupla para profundidade. max-height 90vh com scroll interno."},
                {n:"③",name:"Header",color:C.verdeFloresta,desc:"Ícone em container 48×48 (radius 14) + título Saira 700 17px + subtítulo Open Sans 12px + botão X 32×32."},
                {n:"④",name:"Body",color:C.amareloEscuro,desc:"Conteúdo principal. Fundo contextual: transparente (padrão), #fafafa (formulário), #f5f6f8 (lista). Scroll automático."},
                {n:"⑤",name:"Footer",color:C.azulCeu,desc:"Botões de ação alinhados à direita. Background #F2F4F8 padrão, #FEF8F8 para destrutivo. Info (total) à esquerda."},
              ].map(l=>(
                <div key={l.n} style={{display:"flex",gap:10,padding:"10px 14px",background:C.bg,borderRadius:8,borderLeft:`3px solid ${l.color}`}}>
                  <span style={{fontSize:16,fontWeight:700,color:l.color,fontFamily:Fn.mono,flexShrink:0,lineHeight:1.4}}>{l.n}</span>
                  <div>
                    <span style={{fontSize:12,fontWeight:700,color:C.cinzaEscuro,display:"block"}}>{l.name}</span>
                    <span style={{fontSize:11,color:C.cinzaChumbo,lineHeight:1.5}}>{l.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </DSCard>
        </Section>

        {/* ═══════════════════ 04 — ACESSIBILIDADE ═══════════════════ */}
        <Section n="04" title="Acessibilidade e teclado" desc="O modal captura o foco e responde a atalhos de teclado. Atributos ARIA garantem leitura por screen readers.">
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:16}}>
            {/* Keyboard shortcuts */}
            <DSCard mob={mob}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
                {Ic.keyboard(22,C.azulProfundo)}
                <span style={{fontSize:14,fontWeight:700,color:C.azulEscuro,fontFamily:Fn.title}}>Atalhos de teclado</span>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {[
                  {keys:["Esc"],action:"Fecha o modal (qualquer tipo)",note:"Equivale a clicar no X ou overlay"},
                  {keys:["Tab"],action:"Navega entre elementos focáveis",note:"Inputs, selects e botões dentro do modal"},
                  {keys:["Shift","Tab"],action:"Navega para trás",note:"Cicla pelo footer → body → header"},
                  {keys:["Enter"],action:"Ativa o botão focado",note:"Confirma a ação do botão com foco"},
                ].map((s,i)=>(
                  <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                    <div style={{display:"flex",gap:4,flexShrink:0,paddingTop:1}}>
                      {s.keys.map((k,j)=><span key={j}><Kbd>{k}</Kbd>{j<s.keys.length-1&&<span style={{margin:"0 2px",color:C.textLight,fontSize:10}}>+</span>}</span>)}
                    </div>
                    <div style={{minWidth:0}}>
                      <span style={{fontSize:12,fontWeight:600,color:C.cinzaEscuro,display:"block"}}>{s.action}</span>
                      <span style={{fontSize:11,color:C.textMuted}}>{s.note}</span>
                    </div>
                  </div>
                ))}
              </div>
            </DSCard>

            {/* ARIA attributes */}
            <DSCard mob={mob}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke={C.verdeFloresta} strokeWidth="1.8"/><path d="M12 7v0M9 10h6M10 10v7M14 10v7" stroke={C.verdeFloresta} strokeWidth="1.8" strokeLinecap="round"/></svg>
                <span style={{fontSize:14,fontWeight:700,color:C.azulEscuro,fontFamily:Fn.title}}>Atributos ARIA</span>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {[
                  {attr:'role="dialog"',desc:"Identifica o container como diálogo para screen readers."},
                  {attr:'aria-modal="true"',desc:"Indica que conteúdo atrás está inerte. Leitores de tela ficam confinados ao modal."},
                  {attr:'aria-labelledby',desc:"Conecta o título (h2#modal-title) como label do diálogo."},
                  {attr:'aria-label="Fechar"',desc:"No botão X — descreve a ação para quem não vê o ícone."},
                  {attr:'tabIndex={0}',desc:"Botão X recebe foco via Tab e responde a Enter."},
                ].map((a,i)=>(
                  <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",padding:"8px 12px",background:C.bg,borderRadius:6}}>
                    <code style={{fontSize:11,fontFamily:Fn.mono,color:C.azulProfundo,fontWeight:600,flexShrink:0,whiteSpace:"nowrap"}}>{a.attr}</code>
                    <span style={{fontSize:11,color:C.cinzaChumbo,lineHeight:1.5}}>{a.desc}</span>
                  </div>
                ))}
              </div>
            </DSCard>
          </div>

          {/* Best practices callout */}
          <div style={{marginTop:16,background:`${C.verdeFloresta}08`,border:`1px solid ${C.verdeFloresta}30`,borderRadius:12,padding:"16px 20px",display:"flex",gap:12,alignItems:"flex-start"}}>
            {Ic.eye(20,C.verdeFloresta)}
            <div>
              <span style={{fontSize:13,fontWeight:700,color:C.verdeEscuro,display:"block",marginBottom:4}}>Boas práticas de acessibilidade</span>
              <span style={{fontSize:12,color:C.cinzaChumbo,lineHeight:1.6}}>Sempre inclua um título descritivo (aria-labelledby). Garanta que o primeiro elemento focável receba foco automaticamente ao abrir. Ao fechar, retorne o foco ao elemento que disparou a abertura. Teste com leitor de tela (NVDA, VoiceOver) e apenas teclado.</span>
            </div>
          </div>
        </Section>

        {/* ═══════════════════ 05 — FAÇA / EVITE ═══════════════════ */}
        <Section n="05" title="Faça e evite" desc="Padrões corretos e erros comuns no uso de modais no ecossistema FIPS.">
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:16}}>
            {/* FAÇA */}
            <DSCard mob={mob} s={{borderTop:`3px solid ${C.verdeFloresta}`}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
                <div style={{width:28,height:28,borderRadius:8,background:`${C.verdeFloresta}12`,display:"flex",alignItems:"center",justifyContent:"center"}}>{Ic.check(18,C.verdeFloresta)}</div>
                <span style={{fontSize:15,fontWeight:700,color:C.verdeEscuro,fontFamily:Fn.title}}>Faça</span>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {[
                  "Use título como pergunta em confirmações: \"Aprovar requisição?\"",
                  "Footer com tint vermelho #FEF8F8 para ações destrutivas",
                  "Exiba impacto visível antes de exclusão (itens afetados, contratos)",
                  "Inputs com focus ring azul 3px no modal formulário",
                  "Subtítulo para dar contexto (código REQ, nome do item)",
                  "Body #fafafa em formulários — inputs brancos flutuam",
                  "Botão primário sempre à direita no footer",
                  "ESC e clique no overlay como opções de fechar",
                ].map((t,i)=>(
                  <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start"}}>
                    <span style={{color:C.verdeFloresta,fontWeight:700,fontSize:14,lineHeight:1.4,flexShrink:0}}>✓</span>
                    <span style={{fontSize:12,color:C.cinzaEscuro,lineHeight:1.5}}>{t}</span>
                  </div>
                ))}
              </div>
            </DSCard>

            {/* EVITE */}
            <DSCard mob={mob} s={{borderTop:`3px solid ${C.danger}`}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
                <div style={{width:28,height:28,borderRadius:8,background:`${C.danger}12`,display:"flex",alignItems:"center",justifyContent:"center"}}>{Ic.ban(18,C.danger)}</div>
                <span style={{fontSize:15,fontWeight:700,color:"#B91C1C",fontFamily:Fn.title}}>Evite</span>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {[
                  "Botão verde para ação de exclusão — confunde o usuário",
                  "Modal dentro de modal (stacking) — use drawer ou tela",
                  "Mais de 6 campos — prefira drawer ou tela dedicada",
                  "Fechar sem confirmação em modal com dados preenchidos",
                  "Título genérico como \"Atenção\" — seja específico",
                  "Dois botões primários no footer (ambos coloridos)",
                  "Modal para conteúdo que precisa de scroll longo",
                  "Abrir modal automaticamente sem ação do usuário",
                ].map((t,i)=>(
                  <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start"}}>
                    <span style={{color:C.danger,fontWeight:700,fontSize:14,lineHeight:1.4,flexShrink:0}}>✕</span>
                    <span style={{fontSize:12,color:C.cinzaEscuro,lineHeight:1.5}}>{t}</span>
                  </div>
                ))}
              </div>
            </DSCard>
          </div>
        </Section>

        {/* ═══════════════════ 06 — TAMANHOS ═══════════════════ */}
        <Section n="06" title="Tamanhos" desc="Três larguras padrão. No mobile (<640px) todos usam 95vw.">
          <DSCard mob={mob}>
            <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr 1fr",gap:20}}>
              {[
                {name:"Compacto",w:"400–420px",use:"Confirmações, alertas, informações rápidas",types:"Confirmação, Destrutivo, Alerta",color:C.azulProfundo,pct:70},
                {name:"Padrão",w:"440–480px",use:"Formulários curtos, informações detalhadas",types:"Formulário, Informativo",color:C.verdeFloresta,pct:85},
                {name:"Largo",w:"500–560px",use:"Listas com dados tabulares, detalhes completos",types:"Lista de itens",color:C.amareloEscuro,pct:100},
              ].map(s=>(
                <div key={s.name} style={{display:"flex",flexDirection:"column",gap:12}}>
                  <div style={{textAlign:"center"}}>
                    <span style={{fontSize:15,fontWeight:700,color:C.azulEscuro,fontFamily:Fn.title,display:"block"}}>{s.name}</span>
                    <code style={{fontSize:13,fontFamily:Fn.mono,color:s.color,fontWeight:600}}>{s.w}</code>
                  </div>
                  {/* Visual bar */}
                  <div style={{background:C.bg,borderRadius:6,height:8,overflow:"hidden"}}>
                    <div style={{width:`${s.pct}%`,height:"100%",background:s.color,borderRadius:6,transition:"width .4s"}}/>
                  </div>
                  {/* Details */}
                  <div style={{background:C.bg,borderRadius:8,padding:"10px 14px"}}>
                    <div style={{fontSize:10,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.azulClaro,fontFamily:Fn.title,marginBottom:4}}>Quando usar</div>
                    <p style={{fontSize:12,color:C.cinzaEscuro,margin:"0 0 8px",lineHeight:1.5}}>{s.use}</p>
                    <div style={{fontSize:10,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.azulClaro,fontFamily:Fn.title,marginBottom:4}}>Tipos</div>
                    <p style={{fontSize:12,color:C.cinzaChumbo,margin:0}}>{s.types}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{marginTop:20,padding:"12px 16px",background:`${C.azulCeuClaro}30`,borderRadius:8,display:"flex",gap:10,alignItems:"center"}}>
              <code style={{fontSize:11,fontFamily:Fn.mono,color:C.azulProfundo,fontWeight:600,flexShrink:0}}>maxWidth: 95vw</code>
              <span style={{fontSize:12,color:C.cinzaChumbo}}>Todos os modais respeitam 95vw como máximo, garantindo margens laterais de 2.5% em qualquer tela.</span>
            </div>
          </DSCard>
        </Section>

        {/* ═══════════════════ 07 — DETALHES UX ═══════════════════ */}
        <Section n="07" title="Detalhes de UX refinados" desc="Micro-interações e decisões visuais que fazem diferença na experiência.">
          <DSCard mob={mob}>
            <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr 1fr",gap:16}}>
              {[
                {title:"Overlay com blur",desc:"backdrop-filter: blur(2px) no overlay. Fundo desfocado reforça foco no modal sem escurecer demais.",color:C.azulProfundo},
                {title:"Ícone em container",desc:"48×48px com borderRadius 14px e fundo contextual ultra-leve (5–7% opacity). Borda sutil 1px.",color:C.verdeFloresta},
                {title:"Botão hover glow",desc:"Botões primários ganham box-shadow colorido no hover. Feedback visual antes do clique.",color:C.amareloEscuro},
                {title:"Input focus ring",desc:"Campos com anel azul 3px (focusRing) idêntico ao padrão Input do DS-FIPS.",color:C.azulCeu},
                {title:"Body layer",desc:"Formulário #fafafa, Lista #f5f6f8. Inputs brancos 'flutuam'. Header branco → Body cinza → Footer cinza.",color:C.cinzaChumbo},
                {title:"Footer tintado",desc:"Modal destrutivo com footer #FEF8F8 (tint vermelho). Reforça visualmente a gravidade da ação.",color:C.danger},
                {title:"Animação spring",desc:"cubic-bezier(.32,.72,.37,1.1) — leve overshoot na entrada. Mais orgânico que ease padrão.",color:C.azulProfundo},
                {title:"Row hover na lista",desc:"Itens mudam fundo no hover. Interação visual que indica clicabilidade e destaca a linha.",color:C.verdeFloresta},
                {title:"X button refinado",desc:"32×32px com borderRadius 8px. Hover muda fundo para cinza. Área de clique generosa + aria-label.",color:C.cinzaEscuro},
              ].map(d=>(
                <div key={d.title} style={{padding:"14px 16px",background:C.bg,borderRadius:8,borderLeft:`3px solid ${d.color}`}}>
                  <span style={{fontSize:12,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.body,display:"block",marginBottom:4}}>{d.title}</span>
                  <span style={{fontSize:11,color:C.cinzaChumbo,lineHeight:1.5}}>{d.desc}</span>
                </div>
              ))}
            </div>
          </DSCard>
        </Section>

        {/* ═══════════════════ 08 — TOKENS ═══════════════════ */}
        <Section n="08" title="Tokens de referência" desc="Valores de design do componente Modal.">
          <DSCard mob={mob} s={{display:"flex",gap:mob?24:48,flexWrap:"wrap"}}>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:Fn.title,marginBottom:4}}>Estrutura</span>
              <TokenRow label="Border radius" value="12px 12px 12px 24px"/>
              <TokenRow label="Sombra" value="0 12px 48px + 0 2px 8px"/>
              <TokenRow label="Overlay" value="rgba(0,42,104,.45) + blur(2px)"/>
              <TokenRow label="z-index" value="1000"/>
              <TokenRow label="Icon container" value="48px · radius 14px"/>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:Fn.title,marginBottom:4}}>Body backgrounds</span>
              <TokenRow label="Padrão" value="transparent (branco)"/>
              <TokenRow label="Formulário" value="#fafafa" color="#fafafa"/>
              <TokenRow label="Lista" value="#f5f6f8" color="#f5f6f8"/>
              <TokenRow label="Footer padrão" value="#F2F4F8" color={C.bg}/>
              <TokenRow label="Footer destrutivo" value="#FEF8F8" color="#FEF8F8"/>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:Fn.title,marginBottom:4}}>Animação</span>
              <TokenRow label="Entrada" value="scale(.96→1) + fade"/>
              <TokenRow label="Curva" value=".32,.72,.37,1.1"/>
              <TokenRow label="Duração" value=".28s"/>
              <TokenRow label="Btn hover" value="glow + opacity .85"/>
              <TokenRow label="Row hover" value="background #F2F4F8"/>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:Fn.title,marginBottom:4}}>Tipografia</span>
              <TokenRow label="Título" value="Saira 700 17px"/>
              <TokenRow label="Subtítulo" value="Open Sans 400 12px"/>
              <TokenRow label="Body" value="Open Sans 400 13px"/>
              <TokenRow label="Botão" value="Open Sans 600 12px"/>
              <TokenRow label="Btn padding" value="8px 20px"/>
            </div>
          </DSCard>
        </Section>

        {/* ═══════════════════ 09 — TUTORIAL MODAL ═══════════════════ */}
        <Section n="09" title="Modal de Tutorial" desc="Walkthrough step-by-step contextual para guiar o usuário em cada página do sistema. Padrão obrigatório em todas as DocPages e módulos operacionais.">
          <DSCard mob={mob}>
            <div style={{display:"flex",gap:16,alignItems:mob?"stretch":"flex-start",flexDirection:mob?"column":"row"}}>
              {/* Preview visual */}
              <div style={{flex:"0 0 260px",background:`linear-gradient(135deg,${C.azulProfundo}08,${C.azulCeuClaro}20)`,borderRadius:12,border:`1px solid ${C.cardBorder}`,padding:20,display:"flex",flexDirection:"column",gap:12}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:40,height:40,borderRadius:12,background:`${C.azulProfundo}10`,display:"flex",alignItems:"center",justifyContent:"center",border:`1px solid ${C.azulCeu}30`}}>{Ic.helpCircle(22,C.azulProfundo)}</div>
                  <div>
                    <span style={{fontSize:13,fontWeight:700,color:C.azulEscuro,fontFamily:Fn.title,display:"block"}}>Tutorial contextual</span>
                    <span style={{fontSize:11,color:C.cinzaChumbo}}>4 passos · Barra de progresso</span>
                  </div>
                </div>
                {/* Mini progress */}
                <div style={{height:3,background:C.bg,borderRadius:2,overflow:"hidden"}}>
                  <div style={{height:"100%",width:"50%",background:`linear-gradient(90deg,${C.azulProfundo},${C.azulCeu})`,borderRadius:2}}/>
                </div>
                {/* Mini step preview */}
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {["Playground interativo","Guia de uso por tipo","Anatomia do modal","Acessibilidade e tokens"].map((s,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",borderRadius:6,background:i===1?`${C.azulProfundo}10`:C.branco,border:i===1?`1px solid ${C.azulProfundo}20`:`1px solid ${C.cardBorder}`}}>
                      <div style={{width:22,height:22,borderRadius:6,background:i===1?`linear-gradient(135deg,${C.azulProfundo},${C.azulCeu})`:i<1?`${C.verdeFloresta}15`:C.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                        <span style={{fontSize:10,fontWeight:700,color:i===1?C.branco:i<1?C.verdeFloresta:C.cinzaChumbo,fontFamily:Fn.mono}}>{i<1?"✓":i+1}</span>
                      </div>
                      <span style={{fontSize:11,color:i===1?C.azulEscuro:C.cinzaChumbo,fontWeight:i===1?600:400}}>{s}</span>
                    </div>
                  ))}
                </div>
                <Btn label="❓ Abrir tutorial" color={C.azulEscuro} onClick={()=>open("tutorial")} full/>
              </div>

              {/* Specs */}
              <div style={{flex:1,display:"flex",flexDirection:"column",gap:16}}>
                {/* Estrutura */}
                <div>
                  <div style={gl}>Estrutura</div>
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {[
                      {part:"Header",desc:"Ícone ❓ em container azul 48×48 + título + subtítulo + contador de passos (ex: 2/4). Fundo com gradiente sutil azul.",color:C.azulProfundo},
                      {part:"Barra de progresso",desc:"Barra de 3px com gradiente azulProfundo→azulCeu. Largura proporcional ao passo atual. Transição suave 350ms.",color:C.azulCeu},
                      {part:"Body (passo ativo)",desc:"Número do passo em círculo gradiente 36×36 + título + referência ao elemento (com ícone ⊕). Descrição + card visual opcional + box de dicas.",color:C.amareloEscuro},
                      {part:"Footer",desc:"Dots de navegação clicáveis + hints de teclado (← →) + botões Anterior/Próximo. Último passo mostra 'Concluir' em verde.",color:C.verdeFloresta},
                    ].map(p=>(
                      <div key={p.part} style={{display:"flex",gap:10,padding:"8px 12px",background:C.bg,borderRadius:6,borderLeft:`3px solid ${p.color}`}}>
                        <span style={{fontSize:12,fontWeight:700,color:C.cinzaEscuro,minWidth:80}}>{p.part}</span>
                        <span style={{fontSize:11,color:C.cinzaChumbo,lineHeight:1.5}}>{p.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Comportamento */}
                <div>
                  <div style={gl}>Comportamento</div>
                  <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:8}}>
                    {[
                      {icon:"⌨",title:"Teclado",desc:"← → para navegar entre passos, ESC para fechar"},
                      {icon:"●",title:"Dots clicáveis",desc:"Pular para qualquer passo diretamente"},
                      {icon:"↑",title:"Scroll automático",desc:"Body retorna ao topo ao mudar de passo"},
                      {icon:"✓",title:"Último passo",desc:"Botão muda de 'Próximo' para 'Concluir' (verde)"},
                    ].map(b=>(
                      <div key={b.title} style={{padding:"10px 12px",background:`${C.azulCeuClaro}20`,borderRadius:8,border:`1px solid ${C.azulCeuClaro}`}}>
                        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                          <span style={{fontSize:14}}>{b.icon}</span>
                          <span style={{fontSize:12,fontWeight:700,color:C.azulEscuro}}>{b.title}</span>
                        </div>
                        <span style={{fontSize:11,color:C.cinzaChumbo,lineHeight:1.4}}>{b.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Como implementar */}
                <div style={{background:`${C.verdeFloresta}08`,border:`1px solid ${C.verdeFloresta}30`,borderRadius:10,padding:"14px 18px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                    {Ic.check(18,C.verdeFloresta)}
                    <span style={{fontSize:13,fontWeight:700,color:C.verdeEscuro,fontFamily:Fn.title}}>Como implementar</span>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:4}}>
                    {[
                      "Cada página define um array de steps com: title, ref (referência visual), description, tips[] e visual (JSX opcional)",
                      "Use 3 a 5 passos por página — menos é superficial, mais cansa",
                      "O campo 'ref' mostra a seção/componente referenciado (ex: 'Seção 02 — Guia de uso')",
                      "O campo 'visual' aceita JSX — use para mini-previews, badges ou diagramas inline",
                      "Botão de trigger: ❓ no header da página ou no playground",
                    ].map((t,i)=>(
                      <div key={i} style={{display:"flex",gap:6,alignItems:"flex-start"}}>
                        <span style={{color:C.verdeFloresta,fontWeight:700,fontSize:12,flexShrink:0}}>✓</span>
                        <span style={{fontSize:11,color:C.cinzaEscuro,lineHeight:1.5}}>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </DSCard>

          {/* Tokens do tutorial modal */}
          <div style={{marginTop:16}}>
            <DSCard mob={mob} s={{display:"flex",gap:mob?24:40,flexWrap:"wrap"}}>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:Fn.title,marginBottom:4}}>Estrutura</span>
                <TokenRow label="Largura" value="540px (max 95vw)"/>
                <TokenRow label="Overlay" value="rgba(0,42,104,.50) + blur(3px)"/>
                <TokenRow label="Header bg" value="gradient azul sutil"/>
                <TokenRow label="Body bg" value="#fafafa"/>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:Fn.title,marginBottom:4}}>Progresso</span>
                <TokenRow label="Barra height" value="3px"/>
                <TokenRow label="Barra gradient" value="azulProfundo → azulCeu" color={C.azulProfundo}/>
                <TokenRow label="Step circle" value="36×36 radius 10"/>
                <TokenRow label="Dot ativo" value="20×8 (pill) azulProfundo" color={C.azulProfundo}/>
                <TokenRow label="Dot inativo" value="8×8 (circle) cinzaClaro" color={C.cinzaClaro}/>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:Fn.title,marginBottom:4}}>Navegação</span>
                <TokenRow label="← →" value="Navegar passos"/>
                <TokenRow label="ESC" value="Fechar tutorial"/>
                <TokenRow label="Último CTA" value="'Concluir' verde"/>
                <TokenRow label="Transição" value=".35s ease"/>
              </div>
            </DSCard>
          </div>
        </Section>

        {/* ═══════════════════ 10 — MODAL POPUP ═══════════════════ */}
        <Section n="10" title="Modal Popup" desc="Modal redimensionável com 3 tamanhos: Normal, Grande e Tela Cheia. Botão no header alterna entre tamanhos ciclicamente. Padrão usado em formulários operacionais (Coleta, Expedição, Produção).">
          <DSCard mob={mob}>
            <div style={{display:"flex",gap:16,alignItems:mob?"stretch":"flex-start",flexDirection:mob?"column":"row"}}>
              {/* Preview + trigger */}
              <div style={{flex:"0 0 280px",display:"flex",flexDirection:"column",gap:14}}>
                {/* Size cards */}
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {[
                    {size:"normal",w:"480px",maxH:"85vh",desc:"Formulários simples, decisões rápidas",c:C.azulProfundo,pct:45},
                    {size:"grande",w:"720px",maxH:"90vh",desc:"Formulários com mais campos, grid 2 colunas",c:C.verdeFloresta,pct:70},
                    {size:"tela-cheia",w:"92vw",maxH:"95vh",desc:"Operações completas, todos os campos visíveis",c:C.amareloEscuro,pct:100},
                  ].map(s=>(
                    <div key={s.size} style={{borderRadius:10,border:`1px solid ${C.cardBorder}`,overflow:"hidden"}}>
                      <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:`${s.c}06`}}>
                        <div style={{width:28,height:28,borderRadius:8,background:`${s.c}12`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                          {s.size==="tela-cheia"?Ic.minimize(14,s.c):Ic.maximize(14,s.c)}
                        </div>
                        <div style={{flex:1}}>
                          <span style={{fontSize:12,fontWeight:700,color:C.azulEscuro,fontFamily:Fn.title,display:"block",textTransform:"capitalize"}}>{s.size.replace("-"," ")}</span>
                          <span style={{fontSize:10,color:C.cinzaChumbo}}>{s.desc}</span>
                        </div>
                      </div>
                      <div style={{padding:"0 14px 10px 14px",display:"flex",alignItems:"center",gap:8}}>
                        <div style={{flex:1,height:4,background:C.bg,borderRadius:2,overflow:"hidden"}}>
                          <div style={{height:"100%",width:`${s.pct}%`,background:s.c,borderRadius:2}}/>
                        </div>
                        <code style={{fontSize:10,fontFamily:Fn.mono,color:s.c,fontWeight:600}}>{s.w}</code>
                      </div>
                    </div>
                  ))}
                </div>
                <Btn label="🖥 Abrir popup" color={C.azulClaro} onClick={()=>open("popup")} full/>
              </div>

              {/* Specs */}
              <div style={{flex:1,display:"flex",flexDirection:"column",gap:16}}>
                {/* Ciclo de tamanho */}
                <div>
                  <div style={gl}>Ciclo de tamanho</div>
                  <div style={{display:"flex",alignItems:"center",gap:8,padding:"14px 16px",background:C.bg,borderRadius:10}}>
                    {POPUP_ORDER.map((s,i)=>(
                      <div key={s} style={{display:"flex",alignItems:"center",gap:8}}>
                        <div style={{padding:"6px 14px",borderRadius:8,background:i===0?`${C.azulProfundo}12`:i===1?`${C.verdeFloresta}12`:`${C.amareloEscuro}12`,border:`1px solid ${i===0?`${C.azulProfundo}30`:i===1?`${C.verdeFloresta}30`:`${C.amareloEscuro}30`}`}}>
                          <span style={{fontSize:11,fontWeight:700,color:i===0?C.azulProfundo:i===1?C.verdeFloresta:C.amareloEscuro,textTransform:"capitalize",fontFamily:Fn.title}}>{s.replace("-"," ")}</span>
                        </div>
                        {i<2&&<span style={{fontSize:14,color:C.cinzaClaro}}>→</span>}
                      </div>
                    ))}
                    <span style={{fontSize:14,color:C.cinzaClaro,marginLeft:4}}>↻</span>
                  </div>
                </div>

                {/* Comportamento por tamanho */}
                <div>
                  <div style={gl}>Comportamento adaptativo</div>
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {[
                      {part:"Layout do body",desc:"Normal: 1 coluna. Grande: grid 2 colunas. Tela cheia: grid 2 colunas com campos extras (NF, peso, motorista).",color:C.azulProfundo},
                      {part:"Botão toggle",desc:"No header, ao lado do X. Mostra ícone Maximize/Minimize + label do tamanho atual. Click alterna ciclicamente.",color:C.verdeFloresta},
                      {part:"Transição",desc:"width e max-width animam com .25s ease. Scale spring na entrada. Border-radius muda para 8px em tela cheia.",color:C.amareloEscuro},
                      {part:"Render props",desc:"Body recebe função children({size, isWide, isFullscreen}) para adaptar conteúdo condicionalmente por tamanho.",color:C.cinzaChumbo},
                    ].map(p=>(
                      <div key={p.part} style={{display:"flex",gap:10,padding:"8px 12px",background:C.bg,borderRadius:6,borderLeft:`3px solid ${p.color}`}}>
                        <span style={{fontSize:12,fontWeight:700,color:C.cinzaEscuro,minWidth:80}}>{p.part}</span>
                        <span style={{fontSize:11,color:C.cinzaChumbo,lineHeight:1.5}}>{p.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quando usar */}
                <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:10}}>
                  <div style={{padding:"12px 16px",background:`${C.verdeFloresta}08`,border:`1px solid ${C.verdeFloresta}30`,borderRadius:10}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                      {Ic.check(16,C.verdeFloresta)}
                      <span style={{fontSize:12,fontWeight:700,color:C.verdeEscuro}}>Quando usar</span>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:3}}>
                      {["Formulários operacionais (Coleta, Expedição, Produção)","Cadastros que variam em complexidade","Quando o usuário quer mais espaço sem sair do contexto","Modais com grid de dados ou listas longas"].map((t,i)=>(
                        <div key={i} style={{display:"flex",gap:6,alignItems:"flex-start"}}>
                          <span style={{color:C.verdeFloresta,fontSize:11,flexShrink:0}}>✓</span>
                          <span style={{fontSize:11,color:C.cinzaEscuro,lineHeight:1.4}}>{t}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{padding:"12px 16px",background:`${C.danger}06`,border:`1px solid ${C.danger}20`,borderRadius:10}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                      {Ic.ban(16,C.danger)}
                      <span style={{fontSize:12,fontWeight:700,color:"#B91C1C"}}>Evite</span>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:3}}>
                      {["Confirmações simples (use modal padrão)","Modais informativos de apenas leitura","Alertas e avisos rápidos","Conteúdo que não muda entre tamanhos"].map((t,i)=>(
                        <div key={i} style={{display:"flex",gap:6,alignItems:"flex-start"}}>
                          <span style={{color:C.danger,fontSize:11,flexShrink:0}}>✕</span>
                          <span style={{fontSize:11,color:C.cinzaEscuro,lineHeight:1.4}}>{t}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DSCard>

          {/* Tokens */}
          <div style={{marginTop:16}}>
            <DSCard mob={mob} s={{display:"flex",gap:mob?24:40,flexWrap:"wrap"}}>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:Fn.title,marginBottom:4}}>Tamanhos</span>
                <TokenRow label="Normal" value="480px · max-h 85vh"/>
                <TokenRow label="Grande" value="720px · max-h 90vh"/>
                <TokenRow label="Tela cheia" value="92vw · max-h 95vh"/>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:Fn.title,marginBottom:4}}>Toggle button</span>
                <TokenRow label="Posição" value="Header, top-right"/>
                <TokenRow label="Ícone" value="Maximize2 / Minimize2"/>
                <TokenRow label="Label" value="Normal / Grande / Tela cheia"/>
                <TokenRow label="Border" value="1px fips-border"/>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:Fn.title,marginBottom:4}}>Transição</span>
                <TokenRow label="Width" value=".25s ease"/>
                <TokenRow label="Entrada" value="scale(.96→1) spring"/>
                <TokenRow label="Radius full" value="8px (tela cheia)"/>
                <TokenRow label="Radius normal" value="12 12 12 24"/>
              </div>
            </DSCard>
          </div>
        </Section>

        <CodePlayground />

        {/* ═══════════════════ 11 — EXPORTAR CÓDIGO ═══════════════════ */}
        <Section n="11" title="Exportar Código" desc="Código copy-paste ready de cada componente. Inclui tokens, ícones, helpers e exemplo de uso. Cole direto no seu projeto.">
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <CodeExport label="Modal" description="Modal base — confirmação, destrutivo, alerta, informativo, formulário, lista" code={MODAL_CODE}/>
            <CodeExport label="TutorialModal" description="Walkthrough step-by-step contextual com barra de progresso e navegação por teclado" code={TUTORIAL_MODAL_CODE}/>
            <CodeExport label="PopupModal" description="Modal redimensionável — Normal (480px), Grande (720px), Tela Cheia (92vw)" code={POPUP_MODAL_CODE}/>
          </div>
        </Section>

        <div style={{textAlign:"center",padding:"20px 0 0",borderTop:`1px solid ${C.cardBorder}`,marginTop:20}}>
          <span style={{fontSize:12,color:C.cinzaChumbo,letterSpacing:".5px",fontFamily:Fn.title,fontWeight:400}}>DS-FIPS v2.0 · Ferrovia Interna do Porto de Santos · Excelência sobre trilhos · {new Date().getFullYear()}</span>
        </div>
      </div>
    </div>
    </PlaygroundProvider>
  );
}
