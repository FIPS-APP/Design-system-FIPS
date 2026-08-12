// @ts-nocheck
import { useState, useEffect } from 'react'
import { Eye, ArrowRight, User } from 'lucide-react'
import { CodeExportSection } from '../components/CodeExport'
import { PlaygroundProvider, Copyable, CopyableInline, CodePlayground } from '../components/CodePlayground'
import { LoginDsShell } from '../../components/patterns/LoginDsShell'
import '../../styles/login-ds.css'

const BG = '/backgrounds/app-shell-home-trains.png'

/* ═══════════════════════════════════════════ TOKENS ═══════════════════════════════════════════ */
const C={azulProfundo:"var(--color-gov-azul-profundo)",azulEscuro:"var(--color-gov-azul-escuro)",azulClaro:"var(--color-gov-azul-claro)",cinzaChumbo:"var(--color-fg-muted)",cinzaEscuro:"var(--color-fg)",cinzaClaro:"#C0CCD2",azulCeu:"#93BDE4",azulCeuClaro:"#D3E3F4",amareloOuro:"#FDC24E",amareloEscuro:"#F6921E",verdeFloresta:"#00C64C",verdeEscuro:"#00904C",danger:"#DC3545",neutro:"var(--color-surface-soft)",branco:"#FFFFFF",bg:"var(--color-surface-muted)",cardBg:"var(--color-surface)",cardBorder:"var(--color-border)",textMuted:"var(--color-fg-muted)",textLight:"var(--color-fg-muted)"};
const Fn={title:"'Saira Expanded',sans-serif",body:"'Open Sans',sans-serif",mono:"'Fira Code',monospace"};

/* ═══════════════════════════════════════════ ICONS ═══════════════════════════════════════════ */
const Ic={
  grid:(s=14,c=C.amareloOuro)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><rect x="2" y="2" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/><rect x="11" y="2" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/><rect x="2" y="11" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/><rect x="11" y="11" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/></svg>,
};

function JunctionLines({style}:{style?:React.CSSProperties}){return <svg viewBox="0 0 320 200" fill="none" style={{opacity:.12,...style}}><path d="M0 60H100C120 60 120 60 140 40L200 40H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/><path d="M0 60H100C120 60 120 60 140 80L200 80H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/><path d="M0 120H60C80 120 80 120 100 100L160 100H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/><path d="M0 120H60C80 120 80 120 100 140L160 140H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/></svg>}

/* ═══════════════════════════════════════════ LAYOUT ═══════════════════════════════════════════ */
function Section({n,title,desc,children}:{n:string;title:string;desc:string;children:React.ReactNode}){return(<section style={{marginBottom:44}}><div style={{fontSize:10,fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",color:C.azulClaro,fontFamily:Fn.title,marginBottom:6}}>{n}</div><h2 style={{fontSize:20,fontWeight:700,color:C.cinzaEscuro,margin:"0 0 4px",fontFamily:Fn.title,letterSpacing:".5px"}}>{title}</h2><p style={{fontSize:14,color:C.cinzaChumbo,margin:"0 0 20px",lineHeight:1.55,fontFamily:Fn.body}}>{desc}</p>{children}</section>)}
function DSCard({children,s,mob:m}:{children:React.ReactNode;s?:React.CSSProperties;mob?:boolean}){return(<div style={{background:C.cardBg,borderRadius:"12px 12px 12px 24px",border:`1px solid ${C.cardBorder}`,padding:m?16:28,boxShadow:"0 1px 3px rgba(0,75,155,.04),0 4px 14px rgba(0,75,155,.03)",...s}}>{children}</div>)}
function TokenRow({label,value,color}:{label:string;value:string;color?:string}){return(<div style={{display:"flex",alignItems:"center",gap:10,fontSize:12,fontFamily:Fn.body}}>{color&&<div style={{width:16,height:16,borderRadius:4,background:color,border:`1px solid ${C.cardBorder}`,flexShrink:0}}/>}<span style={{color:C.cinzaChumbo,minWidth:130}}>{label}</span><code style={{background:C.neutro,padding:"2px 8px",borderRadius:4,fontSize:11,fontFamily:Fn.mono,color:C.cinzaEscuro}}>{value}</code></div>)}

const gc={background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:"10px 10px 10px 18px",overflow:"hidden"};
const gh={padding:"16px 20px",background:C.bg,borderBottom:`1px solid ${C.cardBorder}`,display:"flex",alignItems:"center",gap:12};
const gb={padding:"16px 20px 20px"};
const gl={fontSize:10,fontWeight:700,letterSpacing:"1.2px",textTransform:"uppercase" as const,color:C.azulClaro,fontFamily:Fn.title,marginBottom:4,marginTop:12};

/* ═══════════════════════════════════════════ MAIN ═══════════════════════════════════════════ */
export default function Login(){
  const [w,setW]=useState(typeof window!=="undefined"?window.innerWidth:1200);
  useEffect(()=>{const h=()=>setW(window.innerWidth);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h)},[]);
  const mob=w<640;

  /* ── Shared login CSS (used in both playground + mobile) ── */
  const loginStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Saira+Expanded:wght@300;400;500;600;700;800&family=Open+Sans:wght@300;400;500;600;700&family=Fira+Code:wght@400;500&display=swap');

    @keyframes slideInLeft {
      0% { opacity:0; transform:translateX(-40px); }
      100% { opacity:1; transform:translateX(0); }
    }
    @keyframes slideInRight {
      0% { opacity:0; transform:translateX(30px); }
      100% { opacity:1; transform:translateX(0); }
    }
    @keyframes fadeIn {
      0% { opacity:0; transform:translateY(8px); }
      100% { opacity:1; transform:translateY(0); }
    }
    @keyframes trainSlide {
      0% { transform:translateX(100%); }
      100% { transform:translateX(-120%); }
    }
    @keyframes pulse {
      0%,100% { opacity:0.6; }
      50% { opacity:1; }
    }
    @keyframes lineGrow {
      0% { width:0; }
      100% { width:100%; }
    }
    @keyframes glowBorder {
      0%,100% { border-color: rgba(253,194,78,0.25); }
      50% { border-color: rgba(253,194,78,0.50); }
    }
    @keyframes stationPulse {
      0%, 100% { box-shadow: 0 0 6px rgba(253,194,78,0.4), 0 0 12px rgba(253,194,78,0.15); }
      50% { box-shadow: 0 0 10px rgba(253,194,78,0.7), 0 0 20px rgba(253,194,78,0.3); }
    }
    @keyframes stationReveal {
      0% { opacity: 0; transform: translateX(-12px); }
      100% { opacity: 1; transform: translateX(0); }
    }
    @keyframes railShimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(200%); }
    }
    @keyframes borderRotate {
      0% { --border-angle: 0deg; }
      100% { --border-angle: 360deg; }
    }
    @property --border-angle {
      syntax: "<angle>";
      initial-value: 0deg;
      inherits: false;
    }
    .liquid-card {
      position: relative;
    }
    .liquid-card::before {
      content: '';
      position: absolute;
      inset: -1px;
      border-radius: 29px;
      padding: 1px;
      background: conic-gradient(
        from var(--border-angle),
        transparent 0%,
        transparent 25%,
        rgba(253,194,78,0.45) 35%,
        rgba(255,255,255,0.25) 40%,
        rgba(253,194,78,0.50) 45%,
        transparent 55%,
        transparent 100%
      );
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      mask-composite: exclude;
      animation: borderRotate 6s linear infinite;
      pointer-events: none;
      z-index: 1;
    }
    .liquid-card::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 28px;
      box-shadow:
        0 0 18px rgba(253,194,78,0.06),
        0 0 40px rgba(253,194,78,0.03),
        inset 0 0.5px 0 rgba(255,255,255,0.08);
      pointer-events: none;
      z-index: 1;
    }

    .login-left {
      width:25%;
      flex-shrink:0;
      position:relative;
      display:flex;
      flex-direction:column;
      justify-content:center;
      align-items:center;
      background: linear-gradient(145deg, #001430 0%, #002A68 40%, #00396B 100%);
      overflow:hidden;
      padding:60px 48px;
    }
    .login-right {
      width:75%;
      flex-shrink:0;
      position:relative;
      display:flex;
      flex-direction:column;
      justify-content:center;
      padding:60px 56px;
      overflow:hidden;
    }
    /* Preview da doc não deve ocupar 100svh (viewport real) — o componente é full-page
       no app consumidor, mas aqui vive dentro de um card do playground. */
    .login-doc-preview .login-v1-container {
      min-height: 720px;
    }
    @media (max-width: 768px) {
      .login-v1-container {
        flex-direction: column !important;
        min-height: 100svh !important;
      }
      .login-left {
        width: 100% !important;
        padding: 32px 24px !important;
        align-items: flex-start !important;
      }
      .login-right {
        width: 100% !important;
        padding: 32px 24px !important;
        min-height: 0 !important;
      }
      .login-right .liquid-card {
        max-width: 100% !important;
        padding: 28px 20px !important;
        border-radius: 20px !important;
      }
    }
    @media (max-width: 480px) {
      .login-left {
        padding: 24px 18px !important;
      }
      .login-right {
        padding: 24px 18px !important;
      }
    }
    .login-right::before {
      content:'';
      position:absolute;
      inset:0;
      background:url('${BG}') center 40% / cover no-repeat;
      opacity:0.8;
    }
    .login-right::after {
      content:'';
      position:absolute;
      inset:0;
      background: linear-gradient(135deg, rgba(10,27,53,0.95) 0%, rgba(10,27,53,0.85) 50%, rgba(21,101,192,0.70) 100%);
    }
    .login-tabs {
      display:flex;
      background: rgba(255,255,255,0.04);
      border-radius:12px;
      border: 1px solid rgba(255,255,255,0.06);
      padding:4px;
      margin-bottom:28px;
    }
    .login-tab {
      flex:1;
      display:flex;
      align-items:center;
      justify-content:center;
      gap:8px;
      padding:8px 14px;
      border-radius:9px;
      border:none;
      background:transparent;
      color: rgba(255,255,255,0.35);
      font-family:'Saira Expanded',sans-serif;
      font-size:12px;
      font-weight:600;
      letter-spacing:0.5px;
      cursor:pointer;
      transition:all 0.3s ease;
    }
    .login-tab:hover {
      color: rgba(255,255,255,0.55);
    }
    .login-tab.active {
      background: rgba(253,194,78,0.12);
      color: #FDC24E;
      box-shadow: 0 2px 8px rgba(253,194,78,0.08);
    }
    .login-tab .tab-icon {
      transition: all 0.3s;
    }
    .login-tab.active .tab-icon {
      filter: drop-shadow(0 0 4px rgba(253,194,78,0.3));
    }
    .tab-hint {
      display:flex;
      align-items:center;
      gap:8px;
      padding:10px 14px;
      border-radius:10px;
      background: rgba(253,194,78,0.04);
      border: 1px solid rgba(253,194,78,0.08);
      margin-bottom:24px;
    }
    .tab-hint span {
      font-family:'Open Sans',sans-serif;
      font-size:11px;
      color: rgba(255,255,255,0.35);
      line-height:1.4;
    }
    .rail-input {
      position:relative;
      display:flex;
      align-items:center;
      gap:12px;
      height:42px;
      padding:0 14px;
      border-radius:10px;
      background: rgba(255,255,255,0.07);
      border: 1.5px solid rgba(253,194,78,0.30);
      box-shadow: 0 0 0 3px rgba(253,194,78,0.04), inset 0 0 12px rgba(253,194,78,0.01);
      transition: all 0.35s cubic-bezier(0.22,1,0.36,1);
      overflow:hidden;
    }
    .rail-input:focus-within {
      background: rgba(255,255,255,0.09);
      border-color: rgba(253,194,78,0.50);
      box-shadow:
        0 0 0 4px rgba(253,194,78,0.08),
        0 0 24px rgba(253,194,78,0.06),
        inset 0 0 20px rgba(253,194,78,0.02);
    }
    .rail-input::before {
      content:'';
      position:absolute;
      top:0; left:0;
      width:40%;
      height:100%;
      background: linear-gradient(105deg, transparent 30%, rgba(253,194,78,0.08) 45%, rgba(253,194,78,0.14) 50%, rgba(253,194,78,0.08) 55%, transparent 70%);
      transform: translateX(-100%);
      pointer-events:none;
      z-index:1;
    }
    .rail-input:focus-within::before {
      animation: railShimmer 1.2s ease-out forwards;
    }
    .rail-input .icon {
      color: #FDC24E;
      transition: all 0.35s;
      flex-shrink:0;
    }
    .rail-input:focus-within .icon {
      color: #FDC24E;
      filter: drop-shadow(0 0 4px rgba(253,194,78,0.4));
    }
    .rail-input input {
      flex:1;
      background:transparent;
      border:none;
      outline:none !important;
      color: #FFFFFF;
      font-size:13px;
      font-family:'Open Sans',sans-serif;
      font-weight:400;
      letter-spacing:0.01em;
      min-width:0;
      position:relative;
      z-index:2;
    }
    .rail-input input::placeholder {
      color: rgba(255,255,255,0.45) !important;
      font-weight:400;
      -webkit-text-fill-color: rgba(255,255,255,0.45) !important;
    }
    .rail-input input::-webkit-input-placeholder {
      color: rgba(255,255,255,0.45) !important;
      -webkit-text-fill-color: rgba(255,255,255,0.45) !important;
    }
    .rail-input input:-webkit-autofill,
    .rail-input input:-webkit-autofill:hover,
    .rail-input input:-webkit-autofill:focus {
      -webkit-box-shadow: 0 0 0 50px rgba(0,15,40,0.95) inset !important;
      -webkit-text-fill-color: #FFFFFF !important;
      caret-color: #fff;
      transition: background-color 5000s ease-in-out 0s;
    }
    .rail-input::after {
      content:'';
      position:absolute;
      bottom:-1.5px;
      left:50%;
      height:2px;
      width:60%;
      background: linear-gradient(90deg, transparent, rgba(253,194,78,0.20), transparent);
      border-radius:2px;
      transition: all 0.4s cubic-bezier(0.22,1,0.36,1);
      transform:translateX(-50%);
    }
    .rail-input:focus-within::after {
      width:80%;
      background: linear-gradient(90deg, transparent, #FDC24E, #F6921E, #FDC24E, transparent);
    }
    .rail-label {
      font-family:'Saira Expanded',sans-serif;
      font-size:10px;
      font-weight:700;
      letter-spacing:2px;
      text-transform:uppercase;
      color: #FFFFFF;
      margin-bottom:6px;
      margin-left:14px;
      display:block;
      transition: color 0.3s;
    }
    .rail-label.active {
      color: #FFFFFF;
    }
    .rail-cta {
      position:relative;
      width:100%;
      height:44px;
      border:none;
      border-radius:12px;
      background: linear-gradient(135deg, #FDC24E 0%, #F6921E 100%);
      color: #002A68;
      font-family:'Saira Expanded',sans-serif;
      font-size:13px;
      font-weight:700;
      letter-spacing:0.8px;
      cursor:pointer;
      display:flex; align-items:center; justify-content:center; gap:10px;
      overflow:hidden;
      transition: all 0.3s ease;
      box-shadow:
        0 4px 16px rgba(246,146,30,0.30),
        0 1px 3px rgba(0,0,0,0.10),
        inset 0 1px 0 rgba(255,255,255,0.25);
    }
    .rail-cta:hover {
      transform: translateY(-2px);
      box-shadow:
        0 8px 28px rgba(246,146,30,0.40),
        0 2px 6px rgba(0,0,0,0.12),
        inset 0 1px 0 rgba(255,255,255,0.30);
    }
    .rail-cta:active {
      transform: translateY(0);
    }
    .rail-cta::before {
      content:'';
      position:absolute;
      top:0; left:0; right:0;
      height:50%;
      background: linear-gradient(180deg, rgba(255,255,255,0.20), transparent);
      border-radius:14px 14px 50% 50%;
      pointer-events:none;
    }
    /* ─── Outline Button (slide fill) ─── */
    .outline-btn {
      position:relative; display:flex; align-items:center; justify-content:center; gap:10px;
      width:100%; height:44px; padding:0 24px;
      background:transparent;
      border:1.5px solid #FDC24E;
      border-radius:6px;
      color:#FDC24E; font-size:13px; font-weight:700;
      font-family:'Saira Expanded',sans-serif;
      letter-spacing:1.5px; text-transform:uppercase;
      cursor:pointer; overflow:hidden;
      transition:all 0.4s cubic-bezier(0.22,1,0.36,1);
    }
    .outline-btn::before {
      content:''; position:absolute; inset:0;
      background:linear-gradient(135deg, #FDC24E, #F6921E);
      transform:scaleX(0); transform-origin:left;
      transition:transform 0.4s cubic-bezier(0.22,1,0.36,1);
      z-index:0;
    }
    .outline-btn:hover::before { transform:scaleX(1); }
    .outline-btn:hover { color:#001430; border-color:#F6921E; }
    .outline-btn span, .outline-btn svg { position:relative; z-index:1; }
    .outline-btn:hover svg { transform:translateX(4px); }
    .outline-btn svg { transition:transform 0.3s ease; }

    .rail-link {
      color:#FFFFFF;
      font-size:12px;
      font-weight:700;
      text-decoration:none;
      font-family:'Saira Expanded',sans-serif;
      transition:color 0.2s;
    }
    .rail-link:hover { color:rgba(255,255,255,0.75); }
    .rail-check {
      appearance:none; -webkit-appearance:none;
      width:16px; height:16px;
      border-radius:4px;
      border:1.5px solid rgba(255,255,255,0.40);
      background:rgba(255,255,255,0.06);
      cursor:pointer; flex-shrink:0;
      position:relative; transition:all 0.2s;
    }
    .rail-check:checked {
      background: rgba(253,194,78,0.20);
      border-color: #FDC24E;
    }
    .rail-check:checked::after {
      content:'\\2713'; position:absolute;
      top:-1px; left:2px;
      font-size:11px; color:#FDC24E; font-weight:700;
    }
    .divider-line {
      display:flex; align-items:center; gap:16px;
    }
    .divider-line::before,.divider-line::after {
      content:''; flex:1; height:1px;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
    }
    .train-runner {
      position:absolute;
      bottom:32px; left:0; right:0;
      height:40px;
      overflow:hidden;
      opacity:0.04;
    }
    .train-runner img {
      height:100%;
      animation: trainSlide 25s linear infinite;
      position:absolute;
    }
    .status-bar {
      display:flex;
      align-items:center;
      gap:6px;
      padding:6px 12px;
      border-radius:20px;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.06);
    }
  `;

  /* ── Reusable login V1 renderer (paridade Suprimentos / LoginDsShell) ── */
  const renderLoginV1 = () => (
    <div className="login-doc-preview" style={{ overflow: 'hidden' }}>
      <LoginDsShell onBubbleLogin={() => {}} />
    </div>
  );

  /* ── Code generators (hardcoded hex, self-contained) ── */
  const loginDesktopCode = () => `import { useState, useEffect } from 'react'

/* Login Desktop — DS-FIPS
   Layout: Branding esquerda (25%) + Form direita (75%)
   Card: Liquid Glass + borda conic-gradient rotativa dourada
   Filtro Background Padrao 1 sobre imagem de trens */

const BG = '/backgrounds/app-shell-home-trains.png'

export default function LoginDesktop() {
  const [showPw, setShowPw] = useState(false)
  const [csEmail, setCsEmail] = useState('')
  const [mounted, setMounted] = useState(false)
  const [signalStep, setSignalStep] = useState(0)
  const csEmailValid = csEmail.length === 6 || /^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/.test(csEmail)

  useEffect(() => {
    setMounted(true)
    const t = setInterval(() => setSignalStep(s => (s + 1) % 4), 1200)
    return () => clearInterval(t)
  }, [])

  return (
    <>
      <style>{\`
        @import url('https://fonts.googleapis.com/css2?family=Saira+Expanded:wght@300;400;500;600;700;800&family=Open+Sans:wght@300;400;500;600;700&family=Fira+Code:wght@400;500&display=swap');
        @keyframes slideInLeft { 0%{opacity:0;transform:translateX(-40px)} 100%{opacity:1;transform:translateX(0)} }
        @keyframes slideInRight { 0%{opacity:0;transform:translateX(30px)} 100%{opacity:1;transform:translateX(0)} }
        @keyframes stationPulse { 0%,100%{box-shadow:0 0 6px rgba(253,194,78,0.4),0 0 12px rgba(253,194,78,0.15)} 50%{box-shadow:0 0 10px rgba(253,194,78,0.7),0 0 20px rgba(253,194,78,0.3)} }
        @keyframes stationReveal { 0%{opacity:0;transform:translateX(-12px)} 100%{opacity:1;transform:translateX(0)} }
        @keyframes railShimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }
        @keyframes borderRotate { 0%{--border-angle:0deg} 100%{--border-angle:360deg} }
        @property --border-angle { syntax:"<angle>"; initial-value:0deg; inherits:false; }
        .liquid-card { position:relative; }
        .liquid-card::before {
          content:''; position:absolute; inset:-1px; border-radius:29px; padding:1px;
          background:conic-gradient(from var(--border-angle),transparent 0%,transparent 25%,rgba(253,194,78,0.45) 35%,rgba(255,255,255,0.25) 40%,rgba(253,194,78,0.50) 45%,transparent 55%,transparent 100%);
          -webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
          -webkit-mask-composite:xor; mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
          mask-composite:exclude; animation:borderRotate 6s linear infinite; pointer-events:none; z-index:1;
        }
        .liquid-card::after {
          content:''; position:absolute; inset:0; border-radius:28px;
          box-shadow:0 0 18px rgba(253,194,78,0.06),0 0 40px rgba(253,194,78,0.03),inset 0 0.5px 0 rgba(255,255,255,0.08);
          pointer-events:none; z-index:1;
        }
        .login-left { width:25%; flex-shrink:0; position:relative; display:flex; flex-direction:column; justify-content:center; align-items:center; background:linear-gradient(145deg,#001430 0%,#002A68 40%,#00396B 100%); overflow:hidden; padding:60px 48px; }
        .login-right { width:75%; flex-shrink:0; position:relative; display:flex; flex-direction:column; justify-content:center; padding:60px 56px; overflow:hidden; }
        .login-right::before { content:''; position:absolute; inset:0; background:url('\${BG}') center 40%/cover no-repeat; opacity:0.8; }
        .login-right::after { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(10,27,53,0.95) 0%,rgba(10,27,53,0.85) 50%,rgba(21,101,192,0.70) 100%); }
        .rail-input { position:relative; display:flex; align-items:center; gap:12px; height:42px; padding:0 14px; border-radius:10px; background:rgba(255,255,255,0.07); border:1.5px solid rgba(253,194,78,0.30); box-shadow:0 0 0 3px rgba(253,194,78,0.04),inset 0 0 12px rgba(253,194,78,0.01); transition:all 0.35s cubic-bezier(0.22,1,0.36,1); overflow:hidden; }
        .rail-input:focus-within { background:rgba(255,255,255,0.09); border-color:rgba(253,194,78,0.50); box-shadow:0 0 0 4px rgba(253,194,78,0.08),0 0 24px rgba(253,194,78,0.06),inset 0 0 20px rgba(253,194,78,0.02); }
        .rail-input::before { content:''; position:absolute; top:0;left:0; width:40%; height:100%; background:linear-gradient(105deg,transparent 30%,rgba(253,194,78,0.08) 45%,rgba(253,194,78,0.14) 50%,rgba(253,194,78,0.08) 55%,transparent 70%); transform:translateX(-100%); pointer-events:none; z-index:1; }
        .rail-input:focus-within::before { animation:railShimmer 1.2s ease-out forwards; }
        .rail-input .icon { color:#FDC24E; transition:all 0.35s; flex-shrink:0; }
        .rail-input:focus-within .icon { filter:drop-shadow(0 0 4px rgba(253,194,78,0.4)); }
        .rail-input input { flex:1; background:transparent; border:none; outline:none!important; color:#FFFFFF; font-size:13px; font-family:'Open Sans',sans-serif; font-weight:400; min-width:0; position:relative; z-index:2; }
        .rail-input input::placeholder { color:rgba(255,255,255,0.45)!important; -webkit-text-fill-color:rgba(255,255,255,0.45)!important; }
        .rail-input input:-webkit-autofill { -webkit-box-shadow:0 0 0 50px rgba(0,15,40,0.95) inset!important; -webkit-text-fill-color:#FFFFFF!important; }
        .rail-input::after { content:''; position:absolute; bottom:-1.5px; left:50%; height:2px; width:60%; background:linear-gradient(90deg,transparent,rgba(253,194,78,0.20),transparent); border-radius:2px; transition:all 0.4s cubic-bezier(0.22,1,0.36,1); transform:translateX(-50%); }
        .rail-input:focus-within::after { width:80%; background:linear-gradient(90deg,transparent,#FDC24E,#F6921E,#FDC24E,transparent); }
        .rail-label { font-family:'Saira Expanded',sans-serif; font-size:10px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#FFFFFF; margin-bottom:6px; margin-left:14px; display:block; }
        .outline-btn { position:relative; display:flex; align-items:center; justify-content:center; gap:10px; width:100%; height:44px; background:transparent; border:1.5px solid #FDC24E; border-radius:6px; color:#FDC24E; font-size:13px; font-weight:700; font-family:'Saira Expanded',sans-serif; letter-spacing:1.5px; text-transform:uppercase; cursor:pointer; overflow:hidden; transition:all 0.4s cubic-bezier(0.22,1,0.36,1); }
        .outline-btn::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,#FDC24E,#F6921E); transform:scaleX(0); transform-origin:left; transition:transform 0.4s cubic-bezier(0.22,1,0.36,1); z-index:0; }
        .outline-btn:hover::before { transform:scaleX(1); }
        .outline-btn:hover { color:#001430; border-color:#F6921E; }
        .outline-btn span,.outline-btn svg { position:relative; z-index:1; }
        .rail-link { color:#FFFFFF; font-size:12px; font-weight:700; text-decoration:none; font-family:'Saira Expanded',sans-serif; }
        .rail-check { appearance:none; -webkit-appearance:none; width:16px; height:16px; border-radius:4px; border:1.5px solid rgba(255,255,255,0.40); background:rgba(255,255,255,0.06); cursor:pointer; flex-shrink:0; position:relative; }
        .rail-check:checked { background:rgba(253,194,78,0.20); border-color:#FDC24E; }
        .rail-check:checked::after { content:'\\2713'; position:absolute; top:-1px; left:2px; font-size:11px; color:#FDC24E; font-weight:700; }
        .train-runner { position:absolute; bottom:32px; left:0; right:0; height:40px; overflow:hidden; opacity:0.04; }
        @keyframes trainSlide { 0%{transform:translateX(100%)} 100%{transform:translateX(-120%)} }
        .train-runner img { height:100%; animation:trainSlide 25s linear infinite; position:absolute; }
        @media (max-width:768px) {
          .login-v1-container { flex-direction:column!important; min-height:100svh!important; }
          .login-left { width:100%!important; padding:32px 24px!important; align-items:flex-start!important; }
          .login-right { width:100%!important; padding:32px 24px!important; }
          .login-right .liquid-card { max-width:100%!important; padding:28px 20px!important; border-radius:20px!important; }
        }
      \`}</style>
      <div className="login-v1-container" style={{display:'flex',minHeight:'100vh',overflow:'hidden'}}>
        {/* LEFT — Branding */}
        <div className="login-left">
          <div className="train-runner"><img src="/brand/hero-train-silhouette.svg" alt="" /></div>
          <div style={{position:'relative',zIndex:10,maxWidth:380,animation:mounted?'slideInLeft 0.8s ease-out forwards':'none',opacity:mounted?1:0}}>
            <h1 style={{fontFamily:"'Saira Expanded',sans-serif",fontSize:28,fontWeight:800,color:'#FFFFFF',lineHeight:1.15,margin:'0 0 14px'}}>
              Excelência<br/><span style={{color:'#FDC24E'}}>sobre trilhos</span>
            </h1>
            <p style={{fontFamily:"'Open Sans',sans-serif",fontSize:15,color:'rgba(255,255,255,0.45)',lineHeight:1.7,margin:'12px 0 16px',maxWidth:320}}>
              Sistema integrado da Ferrovia Interna do Porto de Santos.
            </p>
            <div style={{height:440,overflow:'hidden',borderTop:'1px solid rgba(255,255,255,0.06)',paddingTop:16,position:'relative'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14,paddingLeft:4,paddingRight:4}}>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <div style={{width:14,height:2.5,borderRadius:2,background:'linear-gradient(90deg,#FDC24E,#F6921E)'}}/>
                  <span style={{fontFamily:"'Saira Expanded',sans-serif",fontSize:7,fontWeight:700,letterSpacing:'2px',color:'rgba(255,255,255,0.25)',textTransform:'uppercase'}}>Rota dos princípios</span>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:4}}>
                  {[{c:'#FF4D4D',s:1},{c:'#FDC24E',s:2},{c:'#00C64C',s:3}].map((d,i)=>(
                    <div key={i} style={{width:8,height:8,borderRadius:'50%',background:signalStep>=d.s?d.c:'rgba(255,255,255,0.08)',boxShadow:signalStep>=d.s?\`0 0 12px \${d.c}80,0 0 4px \${d.c}\`:'none',transition:'all 0.6s ease',transitionDelay:\`\${i*100}ms\`}}/>
                  ))}
                  <span style={{fontFamily:"'Saira Expanded',sans-serif",fontSize:6,fontWeight:600,letterSpacing:'1px',color:'rgba(255,255,255,0.22)',marginLeft:2,textTransform:'uppercase'}}>Ativo</span>
                </div>
              </div>
              <div style={{position:'relative',paddingLeft:32}}>
                <div style={{position:'absolute',left:9,top:0,bottom:0,width:2,background:'repeating-linear-gradient(180deg,#FDC24E 0px,#FDC24E 8px,transparent 8px,transparent 14px)',opacity:0.5}}/>
                {[
                  {name:'Eficiência',desc:'A busca pela eficiência com responsabilidade.',color:'#00C64C'},
                  {name:'Pessoas',desc:'Pessoas engajadas são o alicerce para bons resultados.',color:'#FDC24E'},
                  {name:'Integridade',desc:'Respeitar as pessoas e cumprir compromissos.',color:'#F6921E'},
                  {name:'Colaboração',desc:'Trabalho em conjunto com empatia.',color:'#00C64C'},
                  {name:'Segurança',desc:'Segurança das pessoas é prioridade.',color:'#FF4D4D'},
                ].map((station,i)=>(
                  <div key={station.name} style={{position:'relative',marginBottom:i<4?28:0,animation:mounted?\`stationReveal 0.4s ease-out \${0.3+i*0.12}s both\`:'none'}}>
                    <div style={{position:'absolute',left:-28,top:2,width:12,height:12,borderRadius:'50%',background:\`radial-gradient(circle at 40% 35%,\${station.color},\${station.color}88 60%,transparent 100%)\`,boxShadow:\`0 0 8px \${station.color}80,0 0 16px \${station.color}30\`,animation:\`stationPulse 2.5s ease-in-out \${i*0.5}s infinite\`}}/>
                    <div style={{fontFamily:"'Saira Expanded',sans-serif",fontSize:11,fontWeight:700,color:station.color,letterSpacing:'0.3px',lineHeight:1.2}}>{station.name}</div>
                    <div style={{fontFamily:"'Open Sans',sans-serif",fontSize:9,color:'rgba(255,255,255,0.25)',lineHeight:1.45,marginTop:3,maxWidth:220}}>{station.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* RIGHT — Form */}
        <div className="login-right">
          <div className="liquid-card" style={{position:'relative',zIndex:10,animation:mounted?'slideInRight 0.7s ease-out 0.2s both':'none',display:'flex',flexDirection:'column',alignItems:'center',width:'100%',maxWidth:380,margin:'0 auto',padding:'36px 32px',borderRadius:28,background:'linear-gradient(160deg,rgba(255,255,255,0.008) 0%,rgba(255,255,255,0.002) 100%)',backdropFilter:'blur(2px) saturate(20%) brightness(1.04)',WebkitBackdropFilter:'blur(2px) saturate(20%) brightness(1.04)',border:'0.5px solid rgba(255,255,255,0.04)',gap:10}}>
            <img src="/fips-logo-azul.svg" alt="FIPS" style={{height:86,objectFit:'contain',marginBottom:2}}/>
            <form onSubmit={e=>e.preventDefault()} style={{display:'flex',flexDirection:'column',gap:16,width:'100%'}}>
              <div>
                <label className="rail-label">CS ou E-mail</label>
                <div className="rail-input">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="icon"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.6"/><path d="M5 20c0-3.3 2.7-6 7-6s7 2.7 7 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
                  <input type="text" placeholder="nome.sobrenome@agfips.com.br" value={csEmail} onChange={e=>setCsEmail(e.target.value)} autoComplete="username"/>
                  {csEmailValid && csEmail.length>0 && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{color:'#00C64C',flexShrink:0,filter:'drop-shadow(0 0 4px rgba(0,198,76,0.4))'}}><path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
              </div>
              <div>
                <label className="rail-label">Senha</label>
                <div className="rail-input">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="icon"><rect x="3" y="11" width="18" height="11" rx="3" stroke="currentColor" strokeWidth="1.6"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><circle cx="12" cy="16.5" r="1.5" fill="currentColor"/></svg>
                  <input type={showPw?'text':'password'} placeholder="--------" autoComplete="current-password"/>
                  <button type="button" onClick={()=>setShowPw(v=>!v)} style={{background:'none',border:'none',color:'#FDC24E',cursor:'pointer',padding:2,display:'flex',opacity:0.6}}>
                    {showPw ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg> : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
                  </button>
                </div>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer'}}>
                  <input type="checkbox" className="rail-check"/>
                  <span className="rail-link" style={{fontSize:12}}>Lembrar acesso</span>
                </label>
                <a href="#" onClick={e=>e.preventDefault()} className="rail-link">Esqueceu a senha?</a>
              </div>
              <button type="submit" className="outline-btn">
                <span>Entrar</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}`

  const loginMobileCode = () => `import { useState } from 'react'

/* Login Mobile — DS-FIPS
   Layout empilhado: Branding (topo) + Form (bottom)
   Card: Liquid Glass + borda conic-gradient rotativa dourada
   Filtro Background Padrao 1 */

const BG = '/backgrounds/app-shell-home-trains.png'

export default function LoginMobile() {
  const [showPw, setShowPw] = useState(false)

  return (
    <>
      <style>{\`
        @import url('https://fonts.googleapis.com/css2?family=Saira+Expanded:wght@300;400;500;600;700;800&family=Open+Sans:wght@300;400;500;600;700&display=swap');
        @keyframes borderRotate { 0%{--border-angle:0deg} 100%{--border-angle:360deg} }
        @property --border-angle { syntax:"<angle>"; initial-value:0deg; inherits:false; }
        .liquid-card-m { position:relative; }
        .liquid-card-m::before {
          content:''; position:absolute; inset:-1px; border-radius:21px; padding:1px;
          background:conic-gradient(from var(--border-angle),transparent 0%,transparent 25%,rgba(253,194,78,0.45) 35%,rgba(255,255,255,0.25) 40%,rgba(253,194,78,0.50) 45%,transparent 55%,transparent 100%);
          -webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
          -webkit-mask-composite:xor; mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
          mask-composite:exclude; animation:borderRotate 6s linear infinite; pointer-events:none; z-index:1;
        }
        .rail-check-m { appearance:none; -webkit-appearance:none; width:16px; height:16px; border-radius:4px; border:1.5px solid rgba(255,255,255,0.40); background:rgba(255,255,255,0.06); cursor:pointer; flex-shrink:0; position:relative; }
        .rail-check-m:checked { background:rgba(253,194,78,0.20); border-color:#FDC24E; }
        .rail-check-m:checked::after { content:'\\2713'; position:absolute; top:-1px; left:2px; font-size:11px; color:#FDC24E; font-weight:700; }
      \`}</style>
      <div style={{display:'flex',flexDirection:'column',minHeight:'100vh',background:'#001430'}}>
        {/* TOP — Branding */}
        <div style={{position:'relative',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',background:'linear-gradient(145deg,#001430 0%,#002A68 40%,#00396B 100%)',overflow:'hidden',padding:'24px 20px',textAlign:'center'}}>
          <h1 style={{fontFamily:"'Saira Expanded',sans-serif",fontSize:22,fontWeight:800,color:'#FFFFFF',lineHeight:1.1,margin:'0 0 8px'}}>
            Excelência <span style={{color:'#FDC24E'}}>sobre trilhos</span>
          </h1>
          <p style={{fontFamily:"'Open Sans',sans-serif",fontSize:12,color:'rgba(255,255,255,0.40)',lineHeight:1.5,margin:0,maxWidth:340}}>
            Sistema integrado da Ferrovia Interna do Porto de Santos.
          </p>
        </div>
        {/* BOTTOM — Form */}
        <div style={{flex:1,position:'relative',display:'flex',flexDirection:'column',justifyContent:'center',padding:'24px 20px',overflow:'hidden'}}>
          <div style={{position:'absolute',inset:0,background:\`url('\${BG}') center 40%/cover no-repeat\`,opacity:0.8}}/>
          <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(10,27,53,0.95) 0%,rgba(10,27,53,0.85) 50%,rgba(21,101,192,0.70) 100%)'}}/>
          <div className="liquid-card-m" style={{position:'relative',zIndex:10,display:'flex',flexDirection:'column',alignItems:'center',width:'100%',maxWidth:340,margin:'0 auto',padding:'28px 20px',borderRadius:20,background:'linear-gradient(160deg,rgba(255,255,255,0.008) 0%,rgba(255,255,255,0.002) 100%)',backdropFilter:'blur(2px) saturate(20%) brightness(1.04)',WebkitBackdropFilter:'blur(2px) saturate(20%) brightness(1.04)',border:'0.5px solid rgba(255,255,255,0.04)',gap:8}}>
            <img src="/fips-logo-azul.svg" alt="FIPS" style={{height:64,objectFit:'contain',marginBottom:2}}/>
            <div style={{display:'flex',flexDirection:'column',gap:14,width:'100%'}}>
              <div>
                <label style={{fontFamily:"'Saira Expanded',sans-serif",fontSize:9,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:'#FFFFFF',marginBottom:4,marginLeft:12,display:'block'}}>CS ou E-mail</label>
                <div style={{display:'flex',alignItems:'center',gap:10,height:38,padding:'0 12px',borderRadius:8,background:'rgba(255,255,255,0.07)',border:'1.5px solid rgba(253,194,78,0.30)'}}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{color:'#FDC24E',flexShrink:0}}><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.6"/><path d="M5 20c0-3.3 2.7-6 7-6s7 2.7 7 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
                  <input type="text" placeholder="nome.sobrenome@agfips.com.br" style={{flex:1,background:'transparent',border:'none',outline:'none',color:'#FFFFFF',fontSize:12,fontFamily:"'Open Sans',sans-serif"}}/>
                </div>
              </div>
              <div>
                <label style={{fontFamily:"'Saira Expanded',sans-serif",fontSize:9,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:'#FFFFFF',marginBottom:4,marginLeft:12,display:'block'}}>Senha</label>
                <div style={{display:'flex',alignItems:'center',gap:10,height:38,padding:'0 12px',borderRadius:8,background:'rgba(255,255,255,0.07)',border:'1.5px solid rgba(253,194,78,0.30)'}}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{color:'#FDC24E',flexShrink:0}}><rect x="3" y="11" width="18" height="11" rx="3" stroke="currentColor" strokeWidth="1.6"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><circle cx="12" cy="16.5" r="1.5" fill="currentColor"/></svg>
                  <input type={showPw?'text':'password'} placeholder="--------" style={{flex:1,background:'transparent',border:'none',outline:'none',color:'#FFFFFF',fontSize:12,fontFamily:"'Open Sans',sans-serif"}}/>
                  <button type="button" onClick={()=>setShowPw(v=>!v)} style={{background:'none',border:'none',color:'#FDC24E',cursor:'pointer',padding:2,display:'flex',opacity:0.6}}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  </button>
                </div>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <label style={{display:'flex',alignItems:'center',gap:6,cursor:'pointer'}}>
                  <input type="checkbox" className="rail-check-m"/>
                  <span style={{fontSize:10,color:'#FFFFFF',fontWeight:700,fontFamily:"'Saira Expanded',sans-serif"}}>Lembrar acesso</span>
                </label>
                <span style={{fontSize:10,color:'#FFFFFF',fontWeight:700,fontFamily:"'Saira Expanded',sans-serif"}}>Esqueceu?</span>
              </div>
              <div style={{width:'100%',height:40,borderRadius:6,background:'transparent',border:'1.5px solid #FDC24E',display:'flex',alignItems:'center',justifyContent:'center',gap:8,fontFamily:"'Saira Expanded',sans-serif",fontSize:12,fontWeight:700,color:'#FDC24E',letterSpacing:'1.5px',textTransform:'uppercase',cursor:'pointer'}}>
                <span>Entrar</span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}`

  return(
    <PlaygroundProvider>
    <div style={{minHeight:"100vh",background:"var(--color-surface-muted)",fontFamily:Fn.body,color:C.cinzaEscuro}}>
      <style>{loginStyles}</style>

      {/* HEADER */}
      <header style={{background:`linear-gradient(135deg,${C.azulProfundo} 0%,${C.azulEscuro} 100%)`,padding:mob?"32px 20px":"48px 40px 44px",position:"relative",overflow:"hidden"}}>
        <JunctionLines style={{position:"absolute",top:-10,right:-20,width:mob?250:400,height:250}}/>
        <div style={{position:"relative"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:6,background:`${C.branco}10`,border:`1px solid ${C.branco}18`,borderRadius:20,padding:"5px 14px",fontSize:11,fontWeight:600,letterSpacing:"1.5px",textTransform:"uppercase",color:C.amareloOuro,fontFamily:Fn.title,marginBottom:16}}>{Ic.grid(14,C.amareloOuro)} Design System FIPS</div>
          <h1 style={{fontSize:mob?30:44,fontWeight:700,color:C.branco,margin:"0 0 10px",fontFamily:Fn.title}}>Login</h1>
          <p style={{fontSize:16,color:`${C.branco}B0`,lineHeight:1.6,maxWidth:700,margin:0,fontFamily:Fn.body}}>Tela de autenticação do sistema FIPS. Filtro background padrão 1 com degradê azul escuro, card liquid glass com borda animada dourada, ícones amarelos, textos brancos e botão outline.</p>
        </div>
      </header>

      <div style={{padding:mob?"24px 16px 40px":"36px 40px 60px",maxWidth:1100,margin:"0 auto"}}>

        {/* 01 -- PLAYGROUND INTERATIVO */}
        <Section n="01" title="Playground interativo" desc="Login V1 completo com painel de branding à esquerda e formulário liquid glass à direita. Clique no demo para copiar o código pronto. Filtro background padrão 1, borda animada dourada, ícones amarelos e textos brancos. Interaja com os inputs, toggle de senha e validação CS/Email.">
          <CopyableInline label="Login Desktop" code={loginDesktopCode()} preview={renderLoginV1()}>
            <DSCard mob={mob} s={{padding:0,overflow:"hidden"}}>
              {renderLoginV1()}
            </DSCard>
          </CopyableInline>
        </Section>

        {/* 02 -- VARIANTE MOBILE */}
        <Section n="02" title="Variante Mobile" desc="Visualização do login em viewport de 375px. Clique no demo para copiar o código mobile pronto. Layout empilhado com branding compacto, filtro padrão 1, borda animada dourada, ícones amarelos e botão outline.">
          <Copyable label="Login Mobile" code={loginMobileCode()} preview={<span style={{fontSize:12,color:'var(--color-fg-muted)'}}>Preview mobile (375px)</span>}>
          <DSCard mob={mob} s={{display:"flex",justifyContent:"center",background:C.bg}}>
            <div style={{
              width:375,
              maxWidth:"100%",
              borderRadius:16,
              overflow:"hidden",
              border:`1px solid ${C.cardBorder}`,
              boxShadow:"0 4px 24px rgba(0,0,0,.08)",
              background:"#001430",
            }}>
              <div style={{
                display:"flex",flexDirection:"column",minHeight:667,
              }}>
                {/* Mobile left (top) */}
                <div style={{
                  position:"relative",
                  display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",
                  background:"linear-gradient(145deg, #001430 0%, #002A68 40%, #00396B 100%)",
                  overflow:"hidden",padding:"24px 20px",textAlign:"center",
                }}>
                  <h1 style={{
                    fontFamily:"'Saira Expanded',sans-serif",
                    fontSize:22,fontWeight:800,color:"#fff",lineHeight:1.1,margin:"0 0 8px",
                  }}>
                    Excelência <span style={{color:"#FDC24E"}}>sobre trilhos</span>
                  </h1>
                  <p style={{
                    fontFamily:"'Open Sans',sans-serif",
                    fontSize:12,color:"rgba(255,255,255,0.40)",lineHeight:1.5,margin:0,maxWidth:340,whiteSpace:"nowrap" as const,
                  }}>
                    Sistema integrado da Ferrovia Interna do Porto de Santos.
                  </p>
                </div>

                {/* Mobile right (bottom) */}
                <div style={{
                  flex:1,position:"relative",
                  display:"flex",flexDirection:"column",justifyContent:"center",
                  padding:"24px 20px",overflow:"hidden",
                }}>
                  <div style={{
                    position:"absolute",inset:0,
                    background:`url('${BG}') center 40% / cover no-repeat`,
                    opacity:0.8,
                  }}/>
                  <div style={{
                    position:"absolute",inset:0,
                    background:"linear-gradient(135deg, rgba(10,27,53,0.95) 0%, rgba(10,27,53,0.85) 50%, rgba(21,101,192,0.70) 100%)",
                  }}/>
                  <div className="liquid-card login-card" style={{
                    position:"relative",zIndex:10,
                    display:"flex",flexDirection:"column",alignItems:"center",
                    width:"100%",maxWidth:340,margin:"0 auto",
                    padding:"28px 20px",borderRadius:20,
                    background:"linear-gradient(160deg, rgba(255,255,255,0.008) 0%, rgba(255,255,255,0.002) 100%)",
                    backdropFilter:"blur(2px) saturate(20%) brightness(1.04)",
                    WebkitBackdropFilter:"blur(2px) saturate(20%) brightness(1.04)",
                    border:"0.5px solid rgba(255,255,255,0.04)",
                    gap:8,
                  }}>
                    <img src="/fips-logo-azul.svg" alt="App FIPS" style={{height:64,objectFit:"contain",marginBottom:2}} />
                    <div style={{display:"flex",flexDirection:"column",gap:14,width:"100%"}}>
                      <div>
                        <label style={{fontFamily:"'Saira Expanded',sans-serif",fontSize:9,fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",color:"#FFFFFF",marginBottom:4,marginLeft:12,display:"block"}}>CS ou E-mail</label>
                        <div style={{display:"flex",alignItems:"center",gap:10,height:38,padding:"0 12px",borderRadius:8,background:"rgba(255,255,255,0.07)",border:"1.5px solid rgba(253,194,78,0.30)"}}>
                          <User size={15} strokeWidth={1.6} style={{color:"#FDC24E",flexShrink:0}} />
                          <span style={{fontSize:12,color:"rgba(255,255,255,0.45)",fontFamily:"'Open Sans',sans-serif"}}>nome.sobrenome@agfips.com.br</span>
                        </div>
                      </div>
                      <div>
                        <label style={{fontFamily:"'Saira Expanded',sans-serif",fontSize:9,fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",color:"#FFFFFF",marginBottom:4,marginLeft:12,display:"block"}}>Senha</label>
                        <div style={{display:"flex",alignItems:"center",gap:10,height:38,padding:"0 12px",borderRadius:8,background:"rgba(255,255,255,0.07)",border:"1.5px solid rgba(253,194,78,0.30)"}}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{color:"#FDC24E",flexShrink:0}}>
                            <rect x="3" y="11" width="18" height="11" rx="3" stroke="currentColor" strokeWidth="1.6" />
                            <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                            <circle cx="12" cy="16.5" r="1.5" fill="currentColor" />
                          </svg>
                          <span style={{fontSize:12,color:"rgba(255,255,255,0.45)",fontFamily:"'Open Sans',sans-serif"}}>--------</span>
                          <Eye size={14} style={{color:"#FDC24E",marginLeft:"auto"}} />
                        </div>
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <label style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer"}}>
                          <input type="checkbox" className="rail-check" />
                          <span style={{fontSize:10,color:"#FFFFFF",fontWeight:700,fontFamily:"'Saira Expanded',sans-serif"}}>Lembrar acesso</span>
                        </label>
                        <span style={{fontSize:10,color:"#FFFFFF",fontWeight:700,fontFamily:"'Saira Expanded',sans-serif"}}>Esqueceu?</span>
                      </div>
                      <div style={{
                        width:"100%",height:40,borderRadius:6,
                        background:"transparent",
                        border:"1.5px solid #FDC24E",
                        display:"flex",alignItems:"center",justifyContent:"center",gap:8,
                        fontFamily:"'Saira Expanded',sans-serif",fontSize:12,fontWeight:700,color:"#FDC24E",
                        letterSpacing:"1.5px",textTransform:"uppercase",
                      }}>
                        <span>Entrar</span>
                        <ArrowRight size={13} strokeWidth={2.4} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DSCard>
          </Copyable>
        </Section>

        {/* 03 -- GLASSMORPHISM */}
        <Section n="03" title="Liquid Glass" desc="O login usa Liquid Glass ultra-transparente com borda conic-gradient rotativa dourada, ícones amarelos #FDC24E e textos brancos sobre filtro background padrão 1.">
          <DSCard mob={mob}>
            <div style={{...gc,borderLeft:`4px solid ${C.amareloEscuro}`}}>
              <div style={gh}>
                <span style={{fontSize:10,fontWeight:700,letterSpacing:"2px",color:C.amareloEscuro,fontFamily:Fn.title,textTransform:"uppercase"}}>Como funciona</span>
              </div>
              <div style={gb}>
                <div style={{fontSize:13,color:C.cinzaEscuro,lineHeight:1.8,fontFamily:Fn.body}}>
                  <div style={{marginBottom:12}}>
                    O card de login usa <strong>Liquid Glass</strong> — uma camada quase invisível sobre o background dos trens, com borda animada dourada rotativa.
                    O efeito é construído com as seguintes propriedades CSS:
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    <div><code style={{fontSize:11,fontFamily:Fn.mono,background:C.neutro,padding:"2px 8px",borderRadius:4}}>background: rgba(255,255,255,0.008)</code> — fundo ultra-transparente</div>
                    <div><code style={{fontSize:11,fontFamily:Fn.mono,background:C.neutro,padding:"2px 8px",borderRadius:4}}>backdrop-filter: blur(2px) saturate(20%) brightness(1.04)</code> — vidro sutil</div>
                    <div><code style={{fontSize:11,fontFamily:Fn.mono,background:C.neutro,padding:"2px 8px",borderRadius:4}}>border: conic-gradient rotativo</code> — borda animada dourada (6s loop)</div>
                  </div>
                  <div style={{marginTop:12,fontSize:12,color:C.cinzaChumbo,fontStyle:"italic"}}>
                    Ícones em <code style={{fontSize:11,fontFamily:Fn.mono}}>#FDC24E</code> (amarelo ouro), textos e labels em <code style={{fontSize:11,fontFamily:Fn.mono}}>#FFFFFF</code> (branco), botão outline com preenchimento no hover.
                  </div>
                </div>
              </div>
            </div>
          </DSCard>
        </Section>

        {/* 04 -- ANATOMIA E COMPORTAMENTO */}
        <Section n="04" title="Anatomia e comportamento" desc="Estrutura visual e regras de comportamento da tela de login. Ícones amarelos, labels brancos, borda animada e filtro padrão 1.">
          <DSCard mob={mob}>
            <div style={{display:"flex",gap:40,flexWrap:"wrap"}}>
              <div style={{flex:1,minWidth:280}}>
                <span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title,display:"block",marginBottom:12}}>Estrutura</span>
                {[
                  {l:"Card glass",v:"Ultra-transparente + borda conic-gradient rotativa dourada"},
                  {l:"Logo",v:"fips-logo-azul.svg, 86px height, centered"},
                  {l:"Labels",v:"Saira Expanded 600 10px, uppercase, branco #FFF"},
                  {l:"Ícones",v:"Amarelo ouro #FDC24E, com glow no focus"},
                  {l:"Inputs rail-style",v:"42px height, gold border, shimmer on focus, texto branco"},
                  {l:"Validation check",v:"CheckCircle2 verde, CS 6 chars ou email regex"},
                  {l:"Toggle password",v:"Eye/EyeOff 16px, amarelo #FDC24E"},
                  {l:"Checkbox",v:"16px custom, borda branca, check amarelo"},
                  {l:"CTA button",v:"Outline dourado, slide fill no hover, Saira 700 13px"},
                  {l:"Links",v:"Branco #FFF, hover rgba(255,255,255,0.75)"},
                  {l:"Princípios route",v:"Train route vertical com 5 estações animadas"},
                ].map(s=>(
                  <div key={s.l} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                    <div style={{width:6,height:6,borderRadius:"50%",background:C.azulProfundo,flexShrink:0}}/>
                    <span style={{fontSize:12,fontWeight:600,color:C.cinzaEscuro,fontFamily:Fn.body,minWidth:120}}>{s.l}</span>
                    <span style={{fontSize:11,color:C.cinzaChumbo,fontFamily:Fn.body}}>{s.v}</span>
                  </div>
                ))}
              </div>
              <div style={{flex:1,minWidth:250}}>
                <span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title,display:"block",marginBottom:12}}>Comportamento</span>
                {[
                  {l:"backdrop-filter",v:"blur(2px) saturate(20%) brightness(1.04)"},
                  {l:"CS validation",v:"6 caracteres exatos = valido"},
                  {l:"Email validation",v:"Regex /^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/"},
                  {l:"Signal dots",v:"3 cores, ciclo 1.2s, step animation"},
                  {l:"Station pulse",v:"box-shadow pulse 2.5s infinite per station"},
                  {l:"Rail shimmer",v:"translateX shimmer 1.2s on input focus"},
                  {l:"Gold line",v:"Gradient line grows to 80% on focus"},
                  {l:"Mount animation",v:"slideInLeft 0.8s + slideInRight 0.7s"},
                ].map(s=>(
                  <div key={s.l} style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:6}}>
                    <code style={{background:`${C.amareloOuro}30`,color:C.amareloEscuro,padding:"2px 8px",borderRadius:4,fontSize:10,fontFamily:Fn.mono,fontWeight:600,minWidth:100,textAlign:"center",flexShrink:0}}>{s.l}</code>
                    <span style={{fontSize:12,color:C.cinzaEscuro,fontFamily:Fn.body}}>{s.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </DSCard>
        </Section>

        {/* 05 -- FILTRO BACKGROUND PADRÃO1 */}
        <Section n="05" title="Filtro Background Padrão 1" desc="Degradê overlay aplicado sobre a imagem de fundo do login. Escurece o suficiente para legibilidade sem perder a foto, com toque azulado.">
          <DSCard mob={mob}>
            <div style={{...gc,borderLeft:`4px solid ${C.azulProfundo}`}}>
              <div style={gh}>
                <span style={{fontSize:10,fontWeight:700,letterSpacing:"2px",color:C.cinzaEscuro,fontFamily:Fn.title,textTransform:"uppercase"}}>Filtro Padrão 1</span>
              </div>
              <div style={gb}>
                <div style={{borderRadius:16,overflow:"hidden",marginBottom:16,position:"relative",height:120}}>
                  <div style={{position:"absolute",inset:0,background:`url('${BG}') center 40% / cover no-repeat`,opacity:0.8}}/>
                  <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg, rgba(10,27,53,0.95) 0%, rgba(10,27,53,0.85) 50%, rgba(21,101,192,0.70) 100%)"}}/>
                  <div style={{position:"relative",zIndex:1,display:"flex",alignItems:"center",justifyContent:"center",height:"100%"}}>
                    <span style={{fontFamily:Fn.title,fontSize:14,fontWeight:700,color:"#fff",letterSpacing:"1px"}}>Resultado do filtro sobre a imagem</span>
                  </div>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  <div style={gl}>Composição do degradê</div>
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    <div style={{display:"flex",alignItems:"center",gap:12}}>
                      <div style={{width:32,height:32,borderRadius:8,background:"rgba(10,27,53,0.95)",border:`1px solid ${C.cardBorder}`,flexShrink:0}}/>
                      <div>
                        <code style={{fontSize:11,fontFamily:Fn.mono,background:C.neutro,padding:"2px 8px",borderRadius:4}}>0% — rgba(10,27,53,0.95)</code>
                        <div style={{fontSize:11,color:C.cinzaChumbo,marginTop:2}}>#0a1b35 com 95% de opacidade — escuro máximo</div>
                      </div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:12}}>
                      <div style={{width:32,height:32,borderRadius:8,background:"rgba(10,27,53,0.85)",border:`1px solid ${C.cardBorder}`,flexShrink:0}}/>
                      <div>
                        <code style={{fontSize:11,fontFamily:Fn.mono,background:C.neutro,padding:"2px 8px",borderRadius:4}}>50% — rgba(10,27,53,0.85)</code>
                        <div style={{fontSize:11,color:C.cinzaChumbo,marginTop:2}}>#0a1b35 com 85% de opacidade — transição</div>
                      </div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:12}}>
                      <div style={{width:32,height:32,borderRadius:8,background:"rgba(21,101,192,0.70)",border:`1px solid ${C.cardBorder}`,flexShrink:0}}/>
                      <div>
                        <code style={{fontSize:11,fontFamily:Fn.mono,background:C.neutro,padding:"2px 8px",borderRadius:4}}>100% — rgba(21,101,192,0.70)</code>
                        <div style={{fontSize:11,color:C.cinzaChumbo,marginTop:2}}>#1565c0 com 70% de opacidade — toque azulado</div>
                      </div>
                    </div>
                  </div>
                  <div style={{marginTop:12,padding:"12px 16px",borderRadius:10,background:`color-mix(in srgb, ${C.azulProfundo} 3%, transparent)`,border:`1px solid color-mix(in srgb, ${C.azulProfundo} 8%, transparent)`}}>
                    <code style={{fontSize:11,fontFamily:Fn.mono,color:C.cinzaEscuro,lineHeight:1.8,display:"block",wordBreak:"break-all" as const}}>
                      background: linear-gradient(135deg, rgba(10,27,53,0.95) 0%, rgba(10,27,53,0.85) 50%, rgba(21,101,192,0.70) 100%);
                    </code>
                  </div>
                  <div style={{marginTop:8,fontSize:12,color:C.cinzaChumbo,fontStyle:"italic"}}>
                    Direção: <code style={{fontSize:11,fontFamily:Fn.mono}}>135deg</code> (diagonal top-left → bottom-right). Aplicado como <code style={{fontSize:11,fontFamily:Fn.mono}}>::after</code> sobre a imagem de fundo.
                  </div>
                </div>
              </div>
            </div>
          </DSCard>
        </Section>

        {/* 06 -- TOKENS DE REFERENCIA */}
        <Section n="06" title="Tokens de referência" desc="Valores de design da tela de Login FIPS.">
          <DSCard mob={mob} s={{display:"flex",gap:mob?24:48,flexWrap:"wrap"}}>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:Fn.title,marginBottom:4}}>Cores</span>
              <TokenRow label="Card bg" value="rgba(255,255,255,0.008)" color="rgba(255,255,255,0.008)"/>
              <TokenRow label="Card border" value="conic-gradient rotativo" color={C.amareloOuro}/>
              <TokenRow label="Ícones" value="#FDC24E (amarelo ouro)" color={C.amareloOuro}/>
              <TokenRow label="Textos/Labels" value="#FFFFFF (branco)" color="#FFFFFF"/>
              <TokenRow label="Gold dark" value="#F6921E" color={C.amareloEscuro}/>
              <TokenRow label="Green valid" value="#00C64C" color={C.verdeFloresta}/>
              <TokenRow label="Left panel" value="#001430 -> #002A68" color={C.azulEscuro}/>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:Fn.title,marginBottom:4}}>Blur / Filters</span>
              <TokenRow label="Card blur" value="blur(2px)"/>
              <TokenRow label="Saturate" value="saturate(20%)"/>
              <TokenRow label="Brightness" value="brightness(1.04)"/>
              <TokenRow label="Input border" value="rgba(253,194,78,0.30)"/>
              <TokenRow label="Input focus border" value="rgba(253,194,78,0.50)"/>
              <TokenRow label="Input bg" value="rgba(255,255,255,0.07)"/>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:Fn.title,marginBottom:4}}>Tipografia</span>
              <TokenRow label="Headings" value="Saira Expanded 700-800"/>
              <TokenRow label="Body" value="Open Sans 400-600"/>
              <TokenRow label="Labels" value="Saira Expanded 600 10px"/>
              <TokenRow label="Input text" value="Open Sans 400 13px"/>
              <TokenRow label="CTA" value="Saira Expanded 700 13px"/>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:Fn.title,marginBottom:4}}>Dimensoes</span>
              <TokenRow label="Card maxWidth" value="380px"/>
              <TokenRow label="Card borderRadius" value="28px"/>
              <TokenRow label="Logo height" value="86px (desktop) / 64px (mobile)"/>
              <TokenRow label="Card padding" value="36px 32px"/>
              <TokenRow label="Input height" value="42px"/>
              <TokenRow label="Input borderRadius" value="10px"/>
              <TokenRow label="CTA height" value="44px"/>
              <TokenRow label="CTA borderRadius" value="12px"/>
              <TokenRow label="Left panel" value="25% width"/>
            </div>
          </DSCard>
        </Section>

        <CodePlayground />

        <CodeExportSection items={[
          {
            label: 'Login Page FIPS',
            description: 'Tela de login com liquid glass, borda dourada animada e filtro background padrao 1.',
            code: `/* Login Page — DS-FIPS
   Layout: Branding esquerda (25%) + Form direita (75%)
   Card: Liquid Glass ultra-transparente + borda conic-gradient rotativa

   Filtro Background Padrao 1:
   background: linear-gradient(135deg,
     rgba(10,27,53,0.95) 0%,
     rgba(10,27,53,0.85) 50%,
     rgba(21,101,192,0.70) 100%
   );

   Liquid Glass:
   background: rgba(255,255,255,0.008)
   backdrop-filter: blur(2px) saturate(20%) brightness(1.04)
   border: conic-gradient rotativo dourado (6s loop)
*/

/* ── Tokens ── */
const loginTokens = {
  cardBg: 'rgba(255,255,255,0.008)',
  cardBlur: 'blur(2px) saturate(20%) brightness(1.04)',
  cardRadius: 28,
  cardMaxWidth: 380,
  cardPadding: '36px 32px',

  iconColor: '#FDC24E',         // amarelo ouro
  textColor: '#FFFFFF',
  inputBg: 'rgba(255,255,255,0.07)',
  inputBorder: 'rgba(253,194,78,0.30)',
  inputBorderFocus: 'rgba(253,194,78,0.50)',
  inputHeight: 42,
  inputRadius: 10,

  ctaGradient: 'linear-gradient(135deg, #FDC24E 0%, #F6921E 100%)',
  ctaColor: '#002A68',
  ctaHeight: 44,
  ctaRadius: 12,

  leftPanelBg: 'linear-gradient(145deg, #001430 0%, #002A68 40%, #00396B 100%)',
  logoHeight: 86,      // desktop
  logoHeightMob: 64,   // mobile

  validGreen: '#00C64C',
}

/* ── Animações ── */
// @keyframes railShimmer — shimmer dourado no input focus (1.2s)
// @keyframes stationReveal — entrada das estações dos princípios
// @keyframes stationPulse — pulse nas estações (2.5s)
// @keyframes slideInLeft / slideInRight — mount animations
// conic-gradient rotation — borda do card (6s infinite)`,
          },
        ]} />

        <div style={{textAlign:"center",padding:"20px 0 0",borderTop:`1px solid ${C.cardBorder}`,marginTop:20}}>
          <span style={{fontSize:12,color:C.cinzaChumbo,letterSpacing:".5px",fontFamily:Fn.title,fontWeight:400}}>DS-FIPS v2.0 -- Ferrovia Interna do Porto de Santos -- Excelência sobre trilhos -- {new Date().getFullYear()}</span>
        </div>
      </div>
    </div>
    </PlaygroundProvider>
  );
}
