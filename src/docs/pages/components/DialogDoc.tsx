// @ts-nocheck
import { useState, useEffect } from "react";
import {
  AlertTriangle, AppWindow, CalendarDays, Check, ClipboardEdit, ClipboardList, Download,
  FileText, HelpCircle, Info, LayoutGrid, Maximize2, Minimize2, Sparkles, Tag, Trash2,
  UserRound, X as XIcon,
} from "lucide-react";
/* Componentes REAIS da library — é o que um app FIPS importa de `@fips-app/ds-fips`.
   Esta página não define casca de modal nem campo próprio: o que está aqui é o que
   deve ser copiado. */
import { Modal, ModalFooter } from '../../../components/ui/Modal';
import { Field, FieldHint, FieldLabel } from '../../../components/ui/field';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Button } from '../../../components/ui/button';
import { Select } from '../../../components/ui/select';
import { ExportPreviewModal } from '../../../components/composites/ExportPreviewModal';
import { ChangelogModal } from '../../../components/layout/ChangelogModal';
import { TutorialOverlay } from '../../../components/domain/TutorialContextual';

/* ═══════════════════════════════════════════ TOKENS ═══════════════════════════════════════════ */
const C={azulProfundo:"var(--color-gov-azul-profundo)",azulEscuro:"var(--color-gov-azul-escuro)",azulClaro:"var(--color-gov-azul-claro)",cinzaChumbo:"var(--color-fg-muted)",cinzaEscuro:"var(--color-fg)",cinzaClaro:"#C0CCD2",azulCeu:"#93BDE4",azulCeuClaro:"#D3E3F4",amareloOuro:"#FDC24E",amareloEscuro:"#F6921E",verdeFloresta:"#00C64C",verdeEscuro:"#00904C",azulCeuProfundo:"#0090D0",danger:"#DC3545",neutro:"var(--color-surface-soft)",branco:"#FFFFFF",bg:"var(--color-surface-muted)",cardBg:"var(--color-surface)",cardBorder:"var(--color-border)",textMuted:"var(--color-fg-muted)",textLight:"var(--color-fg-muted)",inputBorder:"var(--color-border)",focusRing:"rgba(147,189,228,0.35)"};
const Fn={title:"'Saira Expanded',sans-serif",body:"'Open Sans',sans-serif",mono:"'Fira Code',monospace"};

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

function JunctionLines({style}){return <svg viewBox="0 0 320 200" fill="none" style={{opacity:.12,...style}}><path d="M0 60H100C120 60 120 60 140 40L200 40H320" stroke="var(--color-junction-stroke)" strokeWidth="6" strokeLinecap="round"/><path d="M0 60H100C120 60 120 60 140 80L200 80H320" stroke="var(--color-junction-stroke)" strokeWidth="6" strokeLinecap="round"/><path d="M0 120H60C80 120 80 120 100 100L160 100H320" stroke="var(--color-junction-stroke)" strokeWidth="6" strokeLinecap="round"/><path d="M0 120H60C80 120 80 120 100 140L160 140H320" stroke="var(--color-junction-stroke)" strokeWidth="6" strokeLinecap="round"/></svg>}

/* ═══════════════════════════════════════════ BADGE ═══════════════════════════════════════════ */
const BV={sucesso:{bg:"#ECFDF5",color:C.verdeEscuro,border:"#A7F3D0"},atencao:{bg:"#FFF7ED",color:"#C2410C",border:"#FDBA74"},critico:{bg:"#FEF2F2",color:"#B91C1C",border:"#FECACA"},info:{bg:C.azulCeuClaro,color:C.azulEscuro,border:C.azulCeu}};
function Badge({variant="info",children,dot}){const v=BV[variant]||BV.info;return(<span style={{display:"inline-flex",alignItems:"center",gap:5,padding:"2px 8px",fontSize:11,fontWeight:600,fontFamily:Fn.body,color:v.color,background:v.bg,border:`1px solid ${v.border}`,borderRadius:4,whiteSpace:"nowrap"}}>{dot&&<span style={{width:6,height:6,borderRadius:"50%",background:v.color,opacity:.85}}/>}{children}</span>)}

/* Info card — cartão da ficha de detalhe (modelo: BiDetailDialog/Governança BI): fundo suave, label uppercase discreta, valor em destaque. */
function InfoCard({label,value}){return(<div style={{borderRadius:8,border:`1px solid ${C.cardBorder}`,background:C.bg,padding:"9px 12px",minWidth:0}}><dt style={{fontSize:10,fontWeight:600,letterSpacing:".04em",textTransform:"uppercase",color:C.textMuted,fontFamily:Fn.body}}>{label}</dt><dd style={{margin:"2px 0 0",fontSize:13,fontWeight:500,color:C.cinzaEscuro,fontFamily:Fn.body,wordBreak:"break-word"}}>{value||"—"}</dd></div>)}

/* ═══════════════════════════════════════════
   POPUP — tamanhos do `<Modal>` que o exemplo redimensionável percorre
   ═══════════════════════════════════════════ */
const POPUP_SIZES = {
  normal: { size: 'lg', label: 'Normal' },
  grande: { size: '2xl', label: 'Grande' },
  'tela-cheia': { size: 'full', label: 'Tela cheia' },
};
const POPUP_ORDER = ['normal', 'grande', 'tela-cheia'];


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

/* ═══════════════════════════════════════════ MAIN ═══════════════════════════════════════════ */
export default function DialogDoc(){
  const [w,setW]=useState(typeof window!=="undefined"?window.innerWidth:1200);
  useEffect(()=>{const h=()=>setW(window.innerWidth);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h)},[]);
  const mob=w<640;
  const [m,setM]=useState(null);
  const [popupSize,setPopupSize]=useState("normal");
  const open=id=>setM(id);const close=()=>setM(null);

  return(
    <div style={{minHeight:"100vh",background:"var(--color-surface-muted)",fontFamily:Fn.body,color:C.cinzaEscuro}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Saira+Expanded:wght@300;400;500;600;700;800&family=Open+Sans:wght@300;400;600;700&family=Fira+Code:wght@400;500&display=swap');`}</style>

      {/* ══════════════════════════════════════════════
          LIVE MODALS
          ══════════════════════════════════════════════ */}

      {/* ──────────────────────────────────────────────────────────────────────
          As 7 variantes abaixo usam o `<Modal>` REAL da library — mesma API que
          um app FIPS consome (`@fips-app/ds-fips`). Nada de casca local: header,
          ícone, footer, ESC/overlay/X e os campos vêm dos componentes governados.
          ────────────────────────────────────────────────────────────────────── */}

      {/* 1. CONFIRMAÇÃO — faixa sólida verde, acento branco */}
      <Modal open={m==="confirm"} onOpenChange={v=>!v&&close()} hero tone="success" headerIcon={Check}
        eyebrow="Confirmação" title="Aprovar requisição?"
        description="Encaminhará REQ-4025 para o departamento de compras." size="md">
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{display:"flex",justifyContent:"space-between",padding:"10px 14px",background:C.bg,borderRadius:8}}><span style={{fontSize:12,color:C.cinzaChumbo}}>Solicitante</span><span style={{fontSize:13,fontWeight:600}}>Carlos Santos</span></div>
          <div style={{display:"flex",justifyContent:"space-between",padding:"10px 14px",background:C.bg,borderRadius:8}}><span style={{fontSize:12,color:C.cinzaChumbo}}>Valor total</span><span style={{fontSize:13,fontWeight:700,color:C.azulProfundo}}>R$ 2.450,00</span></div>
          <div style={{display:"flex",justifyContent:"space-between",padding:"10px 14px",background:C.bg,borderRadius:8}}><span style={{fontSize:12,color:C.cinzaChumbo}}>Status</span><Badge variant="atencao" dot>Pendente</Badge></div>
        </div>
        <ModalFooter>
          <Button variant="secondary" onClick={close}>Cancelar</Button>
          <Button variant="success" onClick={close}>Aprovar</Button>
        </ModalFooter>
      </Modal>

      {/* 2. DESTRUTIVO — faixa sólida vermelha, CTA `danger` */}
      <Modal open={m==="delete"} onOpenChange={v=>!v&&close()} hero tone="danger" headerIcon={Trash2}
        eyebrow="Ação irreversível" title="Excluir fornecedor?"
        description="Esta ação é irreversível e afetará contratos ativos." size="md">
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div style={{padding:"12px 16px",background:C.bg,borderRadius:8}}>
            <span style={{fontSize:14,fontWeight:700,color:C.cinzaEscuro,display:"block"}}>MRS Logística S.A.</span>
            <span style={{fontSize:11,color:C.textMuted}}>CNPJ: 01.417.222/0001-77 · Ativo desde 2019</span>
          </div>
          <div style={{background:"var(--color-semantic-critico-bg)",border:"1px solid var(--color-semantic-critico-border)",borderRadius:8,padding:"12px 16px",display:"flex",gap:10,alignItems:"flex-start"}}>
            <AlertTriangle size={18} style={{flexShrink:0,marginTop:1,color:"var(--color-danger)"}}/>
            <div>
              <span style={{fontSize:12,fontWeight:700,color:"var(--color-semantic-critico-fg)",display:"block",marginBottom:2}}>Impacto desta ação:</span>
              <span style={{fontSize:11,color:"var(--color-semantic-critico-fg)",lineHeight:1.5,display:"block"}}>3 contratos ativos serão cancelados. Histórico de 47 requisições será perdido. Esta ação não pode ser desfeita.</span>
            </div>
          </div>
        </div>
        <ModalFooter>
          <Button variant="secondary" onClick={close}>Cancelar</Button>
          <Button variant="danger" onClick={close}>Excluir permanentemente</Button>
        </ModalFooter>
      </Modal>

      {/* 3. ALERTA — faixa sólida laranja */}
      <Modal open={m==="alert"} onOpenChange={v=>!v&&close()} hero tone="warning" headerIcon={AlertTriangle}
        eyebrow="Atenção" title="Sessão expirando"
        description="Sessões inativas são encerradas por segurança." size="md">
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{padding:"16px",background:"var(--color-badge-warning-bg)",border:"1px solid var(--color-fips-yellow-400)",borderRadius:8,textAlign:"center"}}>
            <span style={{fontSize:28,fontWeight:700,color:C.amareloEscuro,fontFamily:Fn.mono,display:"block"}}>4:59</span>
            <span style={{fontSize:11,color:"var(--color-accent-strong)"}}>minutos restantes</span>
          </div>
          <p style={{fontSize:13,color:C.cinzaChumbo,margin:0,lineHeight:1.5,textAlign:"center"}}>Clique em <strong>"Renovar"</strong> para continuar trabalhando sem perder dados.</p>
        </div>
        <ModalFooter>
          <Button variant="secondary" onClick={close}>Sair agora</Button>
          <Button variant="primary" onClick={close}>Renovar sessão</Button>
        </ModalFooter>
      </Modal>

      {/* 4. INFORMATIVO — detalhe read-only, faixa gov (tone default) */}
      <Modal open={m==="info"} onOpenChange={v=>!v&&close()} hero headerIcon={LayoutGrid}
        eyebrow="Dashboard" title="Movimentação de Pátio" size="2xl">
        <div style={{display:"flex",flexDirection:"column",gap:18}}>
          <p style={{fontSize:13,color:C.cinzaEscuro,margin:0,lineHeight:1.6}}>Movimentação diária de contêineres por terminal, turno e tipo de operação. Consolida entradas e saídas do pátio para acompanhamento operacional.</p>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            <Badge variant="info" dot>Operacional</Badge>
            <Badge variant="critico" dot>Crítico</Badge>
            <Badge variant="sucesso" dot>Publicado</Badge>
            <Badge variant="info">RLS ativo</Badge>
          </div>
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
        <ModalFooter>
          <Button variant="primary" onClick={close}>Entendi</Button>
        </ModalFooter>
      </Modal>

      {/* 5. FORMULÁRIO — a variante que mais sai errada.
          Campo é SEMPRE Field + FieldLabel + primitive governado, com `density="compact"`
          nos dois (o Field controla gap/recuo do label; o controle controla a altura).
          Nada de <label>+<input> montado à mão. */}
      <Modal open={m==="form"} onOpenChange={v=>!v&&close()} hero headerIcon={UserRound}
        title="Atribuir responsável"
        description="Selecione o colaborador e tipo de atribuição." size="lg">
        <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:14}}>
          <Field density="compact">
            <FieldLabel required>Responsável</FieldLabel>
            <Input density="compact" placeholder="Nome do colaborador" leftIcon={<UserRound size={14}/>}/>
          </Field>
          <Field density="compact">
            <FieldLabel>Tipo</FieldLabel>
            <Select density="compact" aria-label="Tipo" defaultValue="Interno" leftIcon={<Tag size={14}/>}
              options={["Interno","Externo","Terceiro"].map(o=>({value:o,label:o}))}/>
          </Field>
          <Field density="compact">
            <FieldLabel>Prioridade</FieldLabel>
            <Select density="compact" aria-label="Prioridade" defaultValue="Média" leftIcon={<FileText size={14}/>}
              options={["Baixa","Média","Alta","Urgente"].map(o=>({value:o,label:o}))}/>
          </Field>
          <Field density="compact">
            <FieldLabel>Prazo</FieldLabel>
            <Input density="compact" type="date" leftIcon={<CalendarDays size={14}/>}/>
          </Field>
        </div>
        <Field density="compact" style={{marginTop:14}}>
          <FieldLabel>Observação</FieldLabel>
          <Textarea density="compact" rows={2} placeholder="Notas sobre a atribuição..."/>
          <FieldHint>Opcional — fica no histórico da atribuição.</FieldHint>
        </Field>
        <ModalFooter hint="Você poderá editar depois.">
          <Button variant="secondary" onClick={close}>Cancelar</Button>
          <Button variant="success" onClick={close}>Salvar atribuição</Button>
        </ModalFooter>
      </Modal>

      {/* 6. LISTA — corpo sem padding (`noPadBody`), a lista controla o próprio espaçamento */}
      <Modal open={m==="list"} onOpenChange={v=>!v&&close()} hero headerIcon={ClipboardList}
        title="Itens da requisição" description="REQ-4025 · 3 itens · R$ 2.450,00" size="xl" noPadBody>
        <div>
          {[
            {item:"Extintor PQS 6kg",qty:3,val:"R$ 450,00",status:"sucesso",sl:"Cotado"},
            {item:"Cone sinalização 75cm",qty:10,val:"R$ 1.200,00",status:"sucesso",sl:"Cotado"},
            {item:"Fita zebrada 200m",qty:5,val:"R$ 800,00",status:"atencao",sl:"Aguardando"},
          ].map((r,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",padding:"14px 24px",borderBottom:i<2?`1px solid ${C.cardBorder}`:"none",gap:14}}>
              <div style={{flex:1}}>
                <span style={{fontSize:13,fontWeight:600,color:C.cinzaEscuro,display:"block"}}>{r.item}</span>
                <span style={{fontSize:11,color:C.textMuted}}>Qtd: {r.qty}</span>
              </div>
              <Badge variant={r.status} dot>{r.sl}</Badge>
              <span style={{fontSize:13,fontWeight:700,color:C.azulEscuro,fontFamily:Fn.mono,minWidth:85,textAlign:"right"}}>{r.val}</span>
            </div>
          ))}
        </div>
        <ModalFooter hint={<>Total: <strong style={{color:C.azulProfundo,fontSize:13}}>R$ 2.450,00</strong></>}>
          <Button variant="secondary" onClick={close}>Fechar</Button>
          <Button variant="success" onClick={close}>Aprovar tudo</Button>
        </ModalFooter>
      </Modal>

      {/* 7. POPUP REDIMENSIONÁVEL — mesmo `<Modal>`, trocando `size` por estado.
          O controle vive em `headerActions`, ao lado do X. */}
      <Modal open={m==="popup"} onOpenChange={v=>!v&&close()} hero headerIcon={AppWindow}
        title="Atribuir responsável"
        description="Selecione o colaborador e tipo de atribuição para a tarefa."
        size={POPUP_SIZES[popupSize].size}
        headerActions={
          <button type="button" onClick={()=>setPopupSize(s=>POPUP_ORDER[(POPUP_ORDER.indexOf(s)+1)%POPUP_ORDER.length])}
            title={`Tamanho: ${POPUP_SIZES[popupSize].label} — clique para alternar`}
            style={{display:"inline-flex",alignItems:"center",gap:6,height:32,padding:"0 10px",borderRadius:8,border:"none",cursor:"pointer",background:"rgba(255,255,255,0.08)",color:"rgba(255,255,255,0.85)",fontFamily:Fn.body,fontSize:11,fontWeight:600}}>
            {popupSize==="tela-cheia"?<Minimize2 size={14}/>:<Maximize2 size={14}/>}
            {POPUP_SIZES[popupSize].label}
          </button>
        }>
        <div style={{display:"grid",gridTemplateColumns:popupSize==="normal"?"1fr":"1fr 1fr",gap:14}}>
          <Field density="compact">
            <FieldLabel required>Responsável</FieldLabel>
            <Input density="compact" placeholder="Nome do colaborador" leftIcon={<UserRound size={14}/>}/>
          </Field>
          <Field density="compact">
            <FieldLabel>Tipo</FieldLabel>
            <Select density="compact" aria-label="Tipo" leftIcon={<Tag size={14}/>}
              options={["Interno","Externo","Terceiro"].map(o=>({value:o,label:o}))}/>
          </Field>
          <Field density="compact">
            <FieldLabel>Prioridade</FieldLabel>
            <Select density="compact" aria-label="Prioridade" leftIcon={<FileText size={14}/>}
              options={["Baixa","Média","Alta","Urgente"].map(o=>({value:o,label:o}))}/>
          </Field>
          <Field density="compact">
            <FieldLabel>Prazo</FieldLabel>
            <Input density="compact" type="date" leftIcon={<CalendarDays size={14}/>}/>
          </Field>
          {popupSize!=="normal"&&<>
            <Field density="compact">
              <FieldLabel>Departamento</FieldLabel>
              <Select density="compact" aria-label="Departamento"
                options={["Operações","Logística","Administrativo","Financeiro"].map(o=>({value:o,label:o}))}/>
            </Field>
            <Field density="compact">
              <FieldLabel>E-mail</FieldLabel>
              <Input density="compact" placeholder="email@empresa.com"/>
            </Field>
          </>}
          <div style={{gridColumn:popupSize==="normal"?"auto":"1 / -1",padding:"10px 14px",background:"var(--color-semantic-info-bg)",borderRadius:8,display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:11,color:"var(--color-semantic-info-fg)",fontWeight:600,fontFamily:Fn.body}}>Tamanho atual:</span>
            <span style={{fontSize:12,fontWeight:700,color:"var(--color-semantic-info-fg)",fontFamily:Fn.mono,textTransform:"uppercase"}}>{popupSize}</span>
            <span style={{fontSize:11,color:C.cinzaChumbo,marginLeft:4}}>— o botão no header alterna</span>
          </div>
        </div>
        <ModalFooter>
          <Button variant="secondary" onClick={close}>Cancelar</Button>
          <Button variant="success" onClick={close}>Salvar atribuição</Button>
        </ModalFooter>
      </Modal>

      {/* 8. TUTORIAL CONTEXTUAL */}
      {/* Tutorial — componente REAL de produção (`TutorialOverlay`), o mesmo que o ícone
          de capelo do header abre. Não é um modal local: o padrão do tutorial é o overlay
          contextual com spotlight, que lê os passos de `PAGE_TUTORIALS[pageName]`. Mesmo
          tratamento de "Exportação" (ExportPreviewModal) e "Novidades" (ChangelogModal). */}
      <TutorialOverlay open={m==="tutorial"} onClose={close} pageName="dialog"/>

      {/* 9. EXPORTAÇÃO — composite real ExportPreviewModal (paridade Tecnopano), não o ExportModal legado */}
      <ExportPreviewModal
        open={m==="export"}
        onOpenChange={(v)=> v ? open("export") : close()}
        filename="requisicoes"
        columns={EXPORT_COLUMNS}
        tableColumnKeys={['codigo','titulo','status','area']}
        expandedColumnKeys={['codigo','titulo','status','area','detalhe']}
        data={EXPORT_ROWS}
        onPrint={()=>window.print()}
        onExportPdf={()=>undefined}
        onExportExcel={()=>undefined}
      />

      {/* 10. NOVIDADES — composite real ChangelogModal, mesmo usado no rodapé do sidebar */}
      <ChangelogModal open={m==="changelog"} onOpenChange={v=>v?open("changelog"):close()} />

      {/* ══════════════════════════════════════════════
          PAGE CONTENT
          ══════════════════════════════════════════════ */}
      <header style={{background:`linear-gradient(135deg,var(--color-gov-gradient-from) 0%,var(--color-gov-gradient-to) 100%)`,padding:mob?"32px 20px":"48px 40px 44px",position:"relative",overflow:"hidden"}}>
        <JunctionLines style={{position:"absolute",top:-10,right:-20,width:mob?250:400,height:250}}/>
        <div style={{position:"relative"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:6,background:`${C.branco}10`,border:`1px solid ${C.branco}18`,borderRadius:20,padding:"5px 14px",fontSize:11,fontWeight:600,letterSpacing:"1.5px",textTransform:"uppercase",color:C.amareloOuro,fontFamily:Fn.title,marginBottom:16}}>{Ic.grid(14,C.amareloOuro)} Design System FIPS</div>
          <h1 style={{fontSize:mob?30:44,fontWeight:700,color:C.branco,margin:"0 0 10px",fontFamily:Fn.title}}>Modal</h1>
          <p style={{fontSize:16,color:`${C.branco}B0`,lineHeight:1.6,maxWidth:700,margin:0,fontFamily:Fn.body}}>Janela sobreposta para confirmações, alertas, formulários e decisões. Overlay com blur, animação spring, ESC fecha, border-radius do Brandbook, aria-modal para acessibilidade.</p>
        </div>
      </header>

      <div style={{padding:mob?"24px 16px 40px":"36px 40px 60px",maxWidth:1280,margin:"0 auto"}}>

        {/* ═══════════════════ 01 — PLAYGROUND ═══════════════════ */}
        <Section n="01" title="Playground interativo" desc="Clique em qualquer botão para abrir o modal correspondente. ESC ou overlay para fechar. Hover nos botões para ver feedback visual.">
          <DSCard mob={mob}>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              <Button variant="success" onClick={()=>open("confirm")}><Check size={14}/>Confirmação</Button>
              <Button variant="danger" onClick={()=>open("delete")}><XIcon size={14}/>Destrutivo</Button>
              <Button variant="accent" onClick={()=>open("alert")}><AlertTriangle size={14}/>Alerta</Button>
              <Button variant="primary" onClick={()=>open("info")}><Info size={14}/>Informativo</Button>
              <Button variant="outline" onClick={()=>open("form")}><ClipboardEdit size={14}/>Formulário</Button>
              <Button variant="secondary" onClick={()=>open("list")}><ClipboardList size={14}/>Lista</Button>
              <Button variant="outline" onClick={()=>open("popup")}><Maximize2 size={14}/>Popup</Button>
              <Button variant="primary" onClick={()=>open("tutorial")}><HelpCircle size={14}/>Tutorial</Button>
              <Button variant="secondary" onClick={()=>open("export")}><Download size={14}/>Exportação</Button>
              <Button variant="ouro" onClick={()=>open("changelog")}><Sparkles size={14}/>Novidades</Button>
            </div>
            <div style={{marginTop:18,borderTop:`1px solid ${C.cardBorder}`,paddingTop:16}}>
              <div style={{...gl,marginTop:0}}>A API — é isto que se copia</div>
              <p style={{fontSize:12,color:C.cinzaChumbo,margin:"0 0 10px",lineHeight:1.55,fontFamily:Fn.body}}>
                Todos os modais desta página usam o <strong>componente real</strong> da library.
                Não existe casca local aqui: header, ícone, rodapé, ESC/overlay/X e os campos vêm
                dos componentes governados.
              </p>
              <pre style={{margin:0,padding:"14px 16px",background:C.bg,border:`1px solid ${C.cardBorder}`,borderRadius:8,overflowX:"auto",fontSize:12,lineHeight:1.65,fontFamily:Fn.mono,color:C.cinzaEscuro}}>{`import { Modal, ModalFooter, Field, FieldLabel, Input, Button } from '@fips-app/ds-fips'
import { UserRound } from 'lucide-react'

<Modal
  open={open} onOpenChange={setOpen}
  hero                       // faixa institucional (gov). tone="success|danger|warning" = faixa sólida
  headerIcon={UserRound}     // sempre — modal sem ícone está fora do padrão
  eyebrow="Requisição"       // opcional; não repete palavra do título
  title="Atribuir responsável"
  description="Selecione o colaborador e tipo de atribuição."
  size="lg"                  // sm md lg xl 2xl 3xl full workflow — nunca className="max-w-*"
>
  <Field density="compact">           {/* campo = Field + label + primitive governado */}
    <FieldLabel required>Responsável</FieldLabel>
    <Input density="compact" placeholder="Nome do colaborador" />
  </Field>

  <ModalFooter hint="Você poderá editar depois.">
    <Button variant="secondary" onClick={() => setOpen(false)}>Cancelar</Button>
    <Button variant="success">Salvar atribuição</Button>
  </ModalFooter>
</Modal>`}</pre>
              <p style={{...ge,marginTop:12}}>
                A densidade <code>compact</code> vai no <code>Field</code> <strong>e</strong> no controle:
                o Field cuida do gap e do recuo do label, o controle cuida da própria altura. Passar só
                num dos dois deixa o campo com altura de formulário de página dentro do modal.
              </p>
            </div>
            <p style={{fontSize:11,color:C.textMuted,marginTop:14,lineHeight:1.6}}>10 variantes: confirmação, destrutivo, alerta, informativo, formulário, lista, popup redimensionável, tutorial step-by-step, exportação (ExportPreviewModal — Tudo/Tabela/Expandida, chips, drag, Imprimir/Planilha) e novidades (ChangelogModal — header gov, versão atual + histórico expansível). Todos fecham com ESC, clique no overlay ou botão X.</p>
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
                <Button variant="primary" className="w-full" onClick={()=>open("tutorial")}><HelpCircle size={14}/>Abrir tutorial</Button>
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
                <Button variant="outline" className="w-full" onClick={()=>open("popup")}><Maximize2 size={14}/>Abrir popup</Button>
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

        <div style={{textAlign:"center",padding:"20px 0 0",borderTop:`1px solid ${C.cardBorder}`,marginTop:20}}>
          <span style={{fontSize:12,color:C.cinzaChumbo,letterSpacing:".5px",fontFamily:Fn.title,fontWeight:400}}>DS-FIPS v2.0 · Ferrovia Interna do Porto de Santos · Excelência sobre trilhos · {new Date().getFullYear()}</span>
        </div>
      </div>
    </div>
  );
}
