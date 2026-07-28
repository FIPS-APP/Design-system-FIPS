// @ts-nocheck
import { useState, useEffect, useRef, useMemo } from 'react'
import { Ban, Pencil, Trash2 } from 'lucide-react'
import { CodeExportSection } from '../../components/CodeExport'
import { PlaygroundProvider, CopyableInline, CodePlayground } from '../../components/CodePlayground'
import type { CSSProperties } from 'react'
import { useFipsTheme } from '../../../hooks/useFipsTheme'
import { ExportButtons } from '../../../components/composites/ExportButtons'
import { RowActionsMenu } from '../../../components/composites/RowActionsMenu'
import { ExportPreviewModal, type ExportIntent } from '../../../components/composites/ExportPreviewModal'

/* ═══════════════════════════════════════════ TOKENS ═══════════════════════════════════════════ */
const C={azulProfundo:"var(--color-gov-azul-profundo)",azulEscuro:"var(--color-gov-azul-escuro)",azulClaro:"var(--color-gov-azul-claro)",cinzaChumbo:"var(--color-fg-muted)",cinzaEscuro:"var(--color-fg)",cinzaClaro:"#C0CCD2",azulCeu:"#93BDE4",azulCeuClaro:"#D3E3F4",amareloOuro:"#FDC24E",amareloEscuro:"#F6921E",verdeFloresta:"#00C64C",verdeEscuro:"var(--color-gov-verde-escuro)",danger:"#DC3545",branco:"#FFFFFF",bg:"var(--color-surface-muted)",cardBg:"var(--color-surface)",cardBorder:"var(--color-border)",textMuted:"var(--color-fg-muted)",textLight:"var(--color-fg-muted)",gradFrom:"var(--color-gov-gradient-from)",gradTo:"var(--color-gov-gradient-to)"};
const alpha = (c: string, a: number) => `color-mix(in srgb, ${c} ${Math.round(a*100)}%, transparent)`;
const Fn={title:"'Saira Expanded',sans-serif",body:"'Open Sans',sans-serif",mono:"'Fira Code',monospace"};

/* ═══════════════════════════════════════════ ICONS ═══════════════════════════════════════════ */
const Ic={
  list:(s=14,c=C.azulProfundo)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M3 5h14M3 10h14M3 15h14" stroke={c} strokeWidth="1.6" strokeLinecap="round"/></svg>,
  grid:(s=14,c=C.azulProfundo)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><rect x="2" y="2" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/><rect x="11" y="2" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/><rect x="2" y="11" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/><rect x="11" y="11" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/></svg>,
  settings:(s=14,c=C.cinzaChumbo)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><line x1="3" y1="5" x2="17" y2="5" stroke={c} strokeWidth="1.5" strokeLinecap="round"/><line x1="3" y1="10" x2="17" y2="10" stroke={c} strokeWidth="1.5" strokeLinecap="round"/><line x1="3" y1="15" x2="17" y2="15" stroke={c} strokeWidth="1.5" strokeLinecap="round"/><circle cx="13" cy="5" r="2.3" fill={C.cardBg} stroke={c} strokeWidth="1.5"/><circle cx="6" cy="10" r="2.3" fill={C.cardBg} stroke={c} strokeWidth="1.5"/><circle cx="14" cy="15" r="2.3" fill={C.cardBg} stroke={c} strokeWidth="1.5"/></svg>,
  search:(s=14,c=C.cinzaChumbo)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><circle cx="9" cy="9" r="5.5" stroke={c} strokeWidth="1.5"/><path d="M13.5 13.5L17 17" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>,
  filter:(s=14,c=C.cinzaChumbo)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M3 5h14M5 10h10M8 15h4" stroke={c} strokeWidth="1.6" strokeLinecap="round"/></svg>,
  check:(s=12,c="#fff")=><svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  drag:(s=12,c=C.cinzaClaro)=><svg width={s} height={s} viewBox="0 0 16 16" fill="none"><circle cx="6" cy="4" r="1" fill={c}/><circle cx="10" cy="4" r="1" fill={c}/><circle cx="6" cy="8" r="1" fill={c}/><circle cx="10" cy="8" r="1" fill={c}/><circle cx="6" cy="12" r="1" fill={c}/><circle cx="10" cy="12" r="1" fill={c}/></svg>,
  edit:(s=12,c=C.cinzaChumbo)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M12 3l5 5-10 10H2v-5L12 3z" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  more:(s=14,c=C.cinzaChumbo)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><circle cx="5" cy="10" r="1.5" fill={c}/><circle cx="10" cy="10" r="1.5" fill={c}/><circle cx="15" cy="10" r="1.5" fill={c}/></svg>,
  plus:(s=14,c="#fff")=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M10 4v12M4 10h12" stroke={c} strokeWidth="2" strokeLinecap="round"/></svg>,
  density:(s=14,c=C.cinzaChumbo)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M3 5h14M3 9h14M3 13h14M3 17h14" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>,
  columns:(s=14,c=C.cinzaChumbo)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><rect x="2" y="3" width="4" height="14" rx="1" stroke={c} strokeWidth="1.5"/><rect x="8" y="3" width="4" height="14" rx="1" stroke={c} strokeWidth="1.5"/><rect x="14" y="3" width="4" height="14" rx="1" stroke={c} strokeWidth="1.5"/></svg>,
  sortAsc:(s=10,c=C.azulProfundo)=><svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M8 3v10M5 6l3-3 3 3" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  sortNone:(s=10,c=C.cinzaClaro)=><svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M5 6l3-3 3 3M5 10l3 3 3-3" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  x:(s=12,c=C.cinzaChumbo)=><svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>,
  arrowUp:(s=10,c=C.verdeFloresta)=><svg width={s} height={s} viewBox="0 0 12 12" fill="none"><path d="M6 10V2M2 6l4-4 4 4" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  inbox:(s=14,c=C.azulProfundo)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M2 13l3-9h10l3 9v4H2v-4z" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/><path d="M2 13h5l1 2h4l1-2h5" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  doc:(s=14,c=C.azulProfundo)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M5 2h7l4 4v12H5z" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/><path d="M12 2v4h4M8 11h5M8 14h3" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>,
  clock:(s=14,c=C.amareloEscuro)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke={c} strokeWidth="1.5"/><path d="M10 6v4l3 2" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>,
  checkCircle:(s=14,c=C.verdeFloresta)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke={c} strokeWidth="1.5"/><path d="M7 10l2 2 4-4" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  cash:(s=14,c=C.verdeEscuro)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><rect x="2" y="5" width="16" height="11" rx="2" stroke={c} strokeWidth="1.5"/><circle cx="10" cy="10.5" r="2.5" stroke={c} strokeWidth="1.5"/></svg>,
  excel:(s=14,c="#1D6F42")=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><rect x="2.5" y="2.5" width="15" height="15" rx="1.5" fill={c} fillOpacity=".08" stroke={c} strokeWidth="1.5"/><path d="M2.5 7h15M2.5 12h15M7.5 2.5v15M12.5 2.5v15" stroke={c} strokeWidth="1.1" opacity=".6"/><path d="M6.5 9.5l3 3M9.5 9.5l-3 3" stroke={c} strokeWidth="1.6" strokeLinecap="round"/></svg>,
  pdf:(s=14,c=C.danger)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M5 2h7l4 4v12a0 0 0 010 0H5a0 0 0 010 0V2z" fill={c} fillOpacity=".08" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/><path d="M12 2v4h4" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/><path d="M7 11.5h2.2c.6 0 1 .4 1 1s-.4 1-1 1H7v1.5M11.5 11.5v3M11.5 11.5h1.5M11.5 13h1" stroke={c} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  calendar:(s=14,c=C.cinzaChumbo)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><rect x="3" y="4.5" width="14" height="13" rx="1.5" stroke={c} strokeWidth="1.5"/><path d="M3 8h14M7 2.5v3M13 2.5v3" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>,
  chev:(s=10,c=C.cinzaChumbo)=><svg width={s} height={s} viewBox="0 0 12 12" fill="none"><path d="M3 4.5l3 3 3-3" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
};

function JunctionLines({ style }: { style?: CSSProperties }) {
  return <svg viewBox="0 0 320 200" fill="none" style={{opacity:.12,...style}}><path d="M0 60H100C120 60 120 60 140 40L200 40H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/><path d="M0 60H100C120 60 120 60 140 80L200 80H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/><path d="M0 120H60C80 120 80 120 100 100L160 100H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/><path d="M0 120H60C80 120 80 120 100 140L160 140H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/></svg>}

const BV_LIGHT={sucesso:{bg:"#ECFDF5",color:"#00904C",border:"#A7F3D0"},atencao:{bg:"#FFF7ED",color:"#C2410C",border:"#FDBA74"},critico:{bg:"#FEF2F2",color:"#B91C1C",border:"#FECACA"},info:{bg:"#D3E3F4",color:"#002A68",border:"#93BDE4"}};
const BV_DARK={sucesso:{bg:"rgba(0,198,76,0.14)",color:"#8BE5AD",border:"rgba(0,198,76,0.28)"},atencao:{bg:"rgba(246,146,30,0.14)",color:"#FDC24E",border:"rgba(246,146,30,0.28)"},critico:{bg:"rgba(239,68,68,0.14)",color:"#FCA5A5",border:"rgba(239,68,68,0.28)"},info:{bg:"rgba(147,189,228,0.14)",color:"#93BDE4",border:"rgba(147,189,228,0.28)"}};
function Badge({variant="info",children,dot,dark}){const v=(dark?BV_DARK:BV_LIGHT)[variant]||(dark?BV_DARK:BV_LIGHT).info;return(<span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"2px 7px",fontSize:10,fontWeight:600,fontFamily:Fn.body,color:v.color,background:v.bg,border:`1px solid ${v.border}`,borderRadius:4,whiteSpace:"nowrap"}}>{dot&&<span style={{width:5,height:5,borderRadius:"50%",background:v.color}}/>}{children}</span>)}

function Avatar({name,size=28}){const p=(name||"").split(" ").filter(Boolean);const ini=p.length>=2?`${p[0][0]}${p[p.length-1][0]}`:p[0]?p[0][0]:"?";return <div style={{width:size,height:size,borderRadius:"50%",background:C.bg,border:`1px solid ${C.cardBorder}`,color:C.cinzaChumbo,display:"flex",alignItems:"center",justifyContent:"center",fontSize:Math.round(size*0.36),fontWeight:700,fontFamily:Fn.title,flexShrink:0,letterSpacing:".5px"}}>{ini.toUpperCase()}</div>}

function Checkbox({checked,onChange,size=16}){return(<div onClick={onChange} style={{width:size,height:size,borderRadius:4,border:`1.5px solid ${checked?C.azulProfundo:C.cardBorder}`,background:checked?C.azulProfundo:"var(--color-surface)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,transition:"all .12s"}}>{checked&&Ic.check(Math.round(size*0.65))}</div>)}

function Toggle({checked,onChange}){return(<div onClick={onChange} style={{width:30,height:18,borderRadius:9,background:checked?C.azulProfundo:C.cardBorder,position:"relative",cursor:"pointer",transition:"all .15s",flexShrink:0}}><div style={{position:"absolute",top:2,left:checked?14:2,width:14,height:14,borderRadius:"50%",background:C.branco,boxShadow:"0 1px 3px rgba(0,0,0,.15)",transition:"all .15s"}}/></div>)}

const STATUSES=["Aprovada","Pendente","Em análise","Recusada"];
const DEPTS=["SSMA","Operações","TI","Suprimentos","Manutenção","Financeiro"];
const PRIO=["Crítica","Alta","Média","Baixa"];
const NAMES=["Mariana Souza","Carlos Pereira","Amanda Silva","João Mendes","Patricia Costa","Rafael Lima","Beatriz Santos","Eduardo Almeida","Fernanda Castro","Lucas Oliveira"];
const STATUS_COLOR={"Aprovada":"sucesso","Pendente":"atencao","Em análise":"info","Recusada":"critico"};
const PRIO_COLOR={"Crítica":C.danger,"Alta":C.amareloEscuro,"Média":C.azulClaro,"Baixa":C.cinzaChumbo};

function seed(n){
  let r=137;const rnd=()=>{r=(r*9301+49297)%233280;return r/233280;};
  return Array.from({length:n},(_,i)=>({
    id:`REQ-${4000+i}`,
    sol:NAMES[Math.floor(rnd()*NAMES.length)],
    dept:DEPTS[Math.floor(rnd()*DEPTS.length)],
    status:STATUSES[Math.floor(rnd()*STATUSES.length)],
    priority:PRIO[Math.floor(rnd()*PRIO.length)],
    valor:Math.floor(500+rnd()*15000),
    sla:Math.floor(40+rnd()*60),
    data:`${String(1+Math.floor(rnd()*28)).padStart(2,"0")}/03/2026`,
  }));
}

const ALL_COLUMNS=[
  {id:"id",label:"Código",default:true,fixed:true},
  {id:"sol",label:"Solicitante",default:true},
  {id:"dept",label:"Departamento",default:true},
  {id:"status",label:"Status",default:true},
  {id:"priority",label:"Prioridade",default:true},
  {id:"sla",label:"SLA",default:true},
  {id:"valor",label:"Valor",default:true},
  {id:"data",label:"Criado em",default:true},
  {id:"actions",label:"Ações",default:true,fixed:true},
];

const DENSITY={
  compact:{rowH:30,fs:11,padX:12},
  normal:{rowH:42,fs:12,padX:16},
  comfortable:{rowH:56,fs:13,padX:20},
};

/* ── Helper: código copy-paste-ready para o Playground ── */
function dlCode(part: string) {
  if (part === 'header') return `// DS-FIPS — Data Listing Header Navy — Copy-paste ready

export function DataListingHeader() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #002A68 0%, #004B9B 60%, #001A4A 100%)',
      borderRadius: '12px 12px 12px 24px', padding: '22px 26px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      color: '#fff', boxShadow: '0 4px 20px rgba(0,42,104,0.12)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 44, height: 44, borderRadius: 11, background: 'rgba(253,194,78,0.18)', border: '1px solid rgba(253,194,78,0.30)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FDC24E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
        </div>
        <div>
          <h2 style={{ fontFamily: "'Saira Expanded',sans-serif", fontSize: 21, fontWeight: 700, margin: 0 }}>Sistema de Requisicoes</h2>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.67)', margin: '4px 0 0' }}>Gestao de compras e requisicoes do modulo Suprimentos</p>
        </div>
      </div>
      <button style={{ background: '#F6921E', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>+ Nova Solicitacao</button>
    </div>
  );
}`

  if (part === 'kpi') return `// DS-FIPS — Data Listing KPI Cards — Copy-paste ready

export function DataListingKPIs() {
  const kpis = [
    { label: 'Total registros', value: '60', color: '#004B9B' },
    { label: 'Pendentes', value: '15', color: '#F6921E' },
    { label: 'Aprovadas', value: '18', color: '#00C64C' },
    { label: 'Volume total', value: 'R$ 482k', color: '#00904C' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
      {kpis.map(kpi => (
        <div key={kpi.label} style={{
          background: '#fff', border: '1px solid #E2E8F0',
          borderRadius: '10px 10px 10px 18px', overflow: 'hidden',
        }}>
          <div style={{ padding: '16px 18px 12px' }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#7B8C96' }}>{kpi.label}</span>
            <p style={{ fontSize: 24, fontWeight: 800, fontFamily: "'Saira Expanded',sans-serif", color: '#333B41', marginTop: 6, margin: '6px 0 0' }}>{kpi.value}</p>
          </div>
          <div style={{ height: 32, padding: '0 18px 8px' }}>
            <svg viewBox="0 0 120 24" style={{ width: '100%', height: '100%' }}>
              <path d="M0 20 L20 14 L40 16 L60 8 L80 12 L100 6 L120 10 L120 24 L0 24Z" fill={kpi.color} fillOpacity="0.12" />
              <path d="M0 20 L20 14 L40 16 L60 8 L80 12 L100 6 L120 10" fill="none" stroke={kpi.color} strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
}`

  return `// DS-FIPS — Data Listing Table — Copy-paste ready

export function DataListingTable() {
  const rows = [
    { id: 'RC-001', solicitante: 'Ana Silva', status: 'Aprovada', statusColor: '#00C64C', prioridade: 'Alta', prioridadeColor: '#F6921E', valor: 'R$ 12.500' },
    { id: 'RC-002', solicitante: 'Carlos Lima', status: 'Pendente', statusColor: '#F6921E', prioridade: 'Media', prioridadeColor: '#004B9B', valor: 'R$ 8.200' },
    { id: 'RC-003', solicitante: 'Julia Santos', status: 'Em analise', statusColor: '#004B9B', prioridade: 'Baixa', prioridadeColor: '#7B8C96', valor: 'R$ 3.400' },
  ];

  return (
    <div style={{
      background: '#fff', border: '1px solid #E2E8F0',
      borderRadius: '10px 10px 10px 18px', overflow: 'hidden',
    }}>
      <div style={{ padding: '12px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input type="text" placeholder="Buscar..." style={{ height: 32, padding: '0 12px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12, outline: 'none', width: 180 }} />
          <button style={{ height: 32, padding: '0 12px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#fff', fontSize: 11, fontWeight: 600, color: '#333B41', cursor: 'pointer' }}>Filtros</button>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ height: 32, padding: '0 12px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#fff', fontSize: 11, fontWeight: 600, color: '#333B41', cursor: 'pointer' }}>Excel</button>
          <button style={{ height: 32, padding: '0 12px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#fff', fontSize: 11, fontWeight: 600, color: '#333B41', cursor: 'pointer' }}>PDF</button>
        </div>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#F3F6FB' }}>
            <th style={{ padding: '8px 16px', fontSize: 11, fontWeight: 700, color: '#333B41', textAlign: 'left' }}>Codigo</th>
            <th style={{ padding: '8px 16px', fontSize: 11, fontWeight: 700, color: '#333B41', textAlign: 'left' }}>Solicitante</th>
            <th style={{ padding: '8px 16px', fontSize: 11, fontWeight: 700, color: '#333B41', textAlign: 'left' }}>Status</th>
            <th style={{ padding: '8px 16px', fontSize: 11, fontWeight: 700, color: '#333B41', textAlign: 'left' }}>Prioridade</th>
            <th style={{ padding: '8px 16px', fontSize: 11, fontWeight: 700, color: '#333B41', textAlign: 'right' }}>Valor</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.id} style={{ background: i % 2 === 1 ? '#D3E3F440' : '#fff' }}>
              <td style={{ padding: '8px 16px', fontSize: 13, fontWeight: 600, color: '#004B9B' }}>{row.id}</td>
              <td style={{ padding: '8px 16px', fontSize: 13, color: '#333B41' }}>{row.solicitante}</td>
              <td style={{ padding: '8px 16px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, color: row.statusColor, background: row.statusColor + '15' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: row.statusColor }} />
                  {row.status}
                </span>
              </td>
              <td style={{ padding: '8px 16px' }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: row.prioridadeColor }}>{row.prioridade}</span>
              </td>
              <td style={{ padding: '8px 16px', fontSize: 13, fontWeight: 600, color: '#333B41', textAlign: 'right' }}>{row.valor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}`
}

function dlPreview(part: string) {
  const labels = { header: 'Header Navy + CTA', kpi: 'KPI Cards + Sparkline', toolbar: 'Toolbar + Table' }
  return (
    <div style={{ padding: 12, textAlign: 'center' }}>
      <div style={{ background: 'linear-gradient(135deg, #002A68, #004B9B)', borderRadius: 8, padding: '14px 12px', color: '#fff', fontSize: 11, fontFamily: "'Saira Expanded', sans-serif" }}>
        <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: 1, color: '#FDC24E', marginBottom: 4 }}>Data Listing</div>
        <strong>{labels[part] || part}</strong>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════ MAIN ═══════════════════════════════════════════ */
export default function DataListingDemo() {
  const {dark}=useFipsTheme();
  const accentBg=dark?"rgba(147,189,228,0.12)":"#D3E3F4";
  const accentRing=dark?"rgba(147,189,228,0.2)":"#D3E3F4";
  const zebraBg=dark?"rgba(255,255,255,0.03)":"#D3E3F440";
  const [w,setW]=useState(typeof window!=="undefined"?window.innerWidth:1200);
  useEffect(()=>{const h=()=>setW(window.innerWidth);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h)},[]);
  const mob=w<768;

  const [view,setView]=useState("table");
  const [viewDemo,setViewDemo]=useState("table");
  const [showConfigDemo,setShowConfigDemo]=useState(false);
  const [selected,setSelected]=useState(new Set());
  const [showConfig,setShowConfig]=useState(false);
  const [showFilters,setShowFilters]=useState(false);
  const [periodo,setPeriodo]=useState("Últimos 30 dias");
  const [showPeriodo,setShowPeriodo]=useState(false);
  const [showCustom,setShowCustom]=useState(false);
  const [customStart,setCustomStart]=useState("");
  const [customEnd,setCustomEnd]=useState("");
  const [filters,setFilters]=useState({status:[],dept:[],priority:[]});
  const [search,setSearch]=useState("");
  const [searchFocused,setSearchFocused]=useState(false);
  const [exportOpen,setExportOpen]=useState(false);
  const [exportIntent,setExportIntent]=useState<ExportIntent>("excel");
  const [configTab,setConfigTab]=useState("colunas");
  const [density,setDensity]=useState("normal");
  const [visibleCols,setVisibleCols]=useState(new Set(ALL_COLUMNS.filter(c=>c.default).map(c=>c.id)));
  const [appearance,setAppearance]=useState({zebra:true,verticalBorders:false,stickyHeader:true,wrapText:false});
  const [sortBy,setSortBy]=useState({col:null,dir:"asc"});

  const allData=useMemo(()=>seed(60),[]);
  const data=useMemo(()=>{
    let r=allData;
    if(search)r=r.filter(x=>x.id.toLowerCase().includes(search.toLowerCase())||x.sol.toLowerCase().includes(search.toLowerCase()));
    if(filters.status.length)r=r.filter(x=>filters.status.includes(x.status));
    if(filters.dept.length)r=r.filter(x=>filters.dept.includes(x.dept));
    if(filters.priority.length)r=r.filter(x=>filters.priority.includes(x.priority));
    return r.slice(0,10);
  },[allData,search,filters]);
  const D=DENSITY[density];

  const totalFilters=filters.status.length+filters.dept.length+filters.priority.length;
  const toggleFilter=(group,val)=>setFilters(f=>{const a=f[group]||[];return{...f,[group]:a.includes(val)?a.filter(v=>v!==val):[...a,val]}});
  const clearFilters=()=>setFilters({status:[],dept:[],priority:[]});

  const [hovKpi,setHovKpi]=useState(null); // {c:cardIdx, p:pointIdx}

  const filterRef=useRef(null);
  const configRef=useRef(null);
  const periodoRef=useRef(null);
  const configDemoRef=useRef(null);
  useEffect(()=>{
    if(!showFilters)return;
    const h=e=>{if(filterRef.current&&!filterRef.current.contains(e.target))setShowFilters(false)};
    document.addEventListener("mousedown",h);
    return()=>document.removeEventListener("mousedown",h);
  },[showFilters]);
  useEffect(()=>{
    if(!showConfig)return;
    const h=e=>{if(configRef.current&&!configRef.current.contains(e.target))setShowConfig(false)};
    document.addEventListener("mousedown",h);
    return()=>document.removeEventListener("mousedown",h);
  },[showConfig]);
  useEffect(()=>{
    if(!showPeriodo)return;
    const h=e=>{if(periodoRef.current&&!periodoRef.current.contains(e.target))setShowPeriodo(false)};
    document.addEventListener("mousedown",h);
    return()=>document.removeEventListener("mousedown",h);
  },[showPeriodo]);
  useEffect(()=>{
    if(!showConfigDemo)return;
    const h=e=>{if(configDemoRef.current&&!configDemoRef.current.contains(e.target))setShowConfigDemo(false)};
    document.addEventListener("mousedown",h);
    return()=>document.removeEventListener("mousedown",h);
  },[showConfigDemo]);

  const toggleSel=id=>{const n=new Set(selected);n.has(id)?n.delete(id):n.add(id);setSelected(n)};
  const toggleAll=()=>{if(selected.size===data.length)setSelected(new Set());else setSelected(new Set(data.map(r=>r.id)))};
  const toggleCol=id=>{const c=ALL_COLUMNS.find(x=>x.id===id);if(c?.fixed)return;const n=new Set(visibleCols);n.has(id)?n.delete(id):n.add(id);setVisibleCols(n)};
  const restoreCols=()=>setVisibleCols(new Set(ALL_COLUMNS.filter(c=>c.default).map(c=>c.id)));

  const visibleColumnList=ALL_COLUMNS.filter(c=>visibleCols.has(c.id));

  const Section=({n,title,desc,children})=>(
    <div style={{marginBottom:mob?32:48}}>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:6}}>
        <span style={{fontSize:11,fontWeight:700,color:C.amareloOuro,fontFamily:Fn.mono,letterSpacing:"1.5px"}}>{n}</span>
        <h2 style={{fontSize:mob?17:20,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title,margin:0,letterSpacing:"-0.3px"}}>{title}</h2>
      </div>
      {desc&&<p style={{fontSize:13,color:C.cinzaChumbo,margin:"0 0 18px 32px",lineHeight:1.55,fontFamily:Fn.body,maxWidth:760}}>{desc}</p>}
      {children}
    </div>
  );

  return(
    <PlaygroundProvider>
    <div style={{minHeight:"100vh",background:"var(--color-surface-muted)",fontFamily:Fn.body,color:C.cinzaEscuro}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Saira+Expanded:wght@300;400;500;600;700;800&family=Open+Sans:wght@300;400;600;700&family=Fira+Code:wght@400;500&display=swap');
        @keyframes popIn{from{opacity:0;transform:scale(.95) translateY(-4px)}to{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes dsShimmer{0%{left:-100%}100%{left:150%}}
        .ds-btn-wrap{position:relative;overflow:hidden;display:inline-flex;border-radius:6px}
        .ds-btn-wrap::after{content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(105deg,transparent 20%,rgba(255,255,255,0) 30%,rgba(255,255,255,0.35) 50%,rgba(255,255,255,0) 70%,transparent 80%);pointer-events:none;transition:none}
        .ds-btn-wrap:hover::after{animation:dsShimmer 0.65s ease-out forwards}
      `}</style>

      <header style={{background:`linear-gradient(135deg,${C.gradFrom} 0%,${C.gradTo} 100%)`,padding:mob?"32px 20px":"48px 40px 44px",position:"relative",overflow:"hidden"}}>
        <JunctionLines style={{position:"absolute",top:-10,right:-20,width:mob?250:400,height:250}}/>
        <div style={{position:"relative"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:6,background:`${C.branco}10`,border:`1px solid ${C.branco}18`,borderRadius:20,padding:"5px 14px",fontSize:11,fontWeight:600,letterSpacing:"1.5px",textTransform:"uppercase",color:C.amareloOuro,fontFamily:Fn.title,marginBottom:16}}>{Ic.grid(14,C.amareloOuro)} Design System FIPS</div>
          <h1 style={{fontSize:mob?30:44,fontWeight:700,color:C.branco,margin:"0 0 10px",fontFamily:Fn.title}}>Data Listing</h1>
          <p style={{fontSize:16,color:`${C.branco}B0`,lineHeight:1.6,maxWidth:700,margin:0,fontFamily:Fn.body}}>Padrão completo para painéis de relatórios e ações: Header, KPIs, Toolbar, Table. Clique em qualquer seção para copiar o código.</p>
        </div>
      </header>

      <div style={{padding:mob?"20px 12px 40px":"32px 40px 60px",maxWidth:1200,margin:"0 auto"}}>

        {/* ═══ 01 — Data listing completo ═══ */}
        <Section n="01" title="Painel de Relatório completo" desc="Padrão completo de Painel de Relatório seguindo a ordem obrigatória: Header → KPIs → Toolbar → Table. Use esse padrão sempre que precisar exibir dados administrativos com ações principais, métricas e listagem.">

          {/* HEADER DO PAINEL — navy com ícone + título/subtítulo + CTA */}
          <CopyableInline label="Header Navy" code={dlCode('header')} preview={dlPreview('header')}>
          <div style={{background:dark?`linear-gradient(135deg,#1e2a3a 0%,#162030 50%,#1a2840 100%)`:`linear-gradient(135deg,${C.gradFrom} 0%,${C.gradTo} 60%,#001A4A 100%)`,borderRadius:"12px 12px 12px 24px",padding:mob?"18px 18px":"22px 26px",position:"relative",overflow:"hidden",marginBottom:mob?12:16,boxShadow:dark?"0 4px 20px rgba(0,0,0,.35),inset 0 1px 0 rgba(255,255,255,.04)":"0 4px 20px rgba(0,42,104,.12)",border:dark?"1px solid rgba(147,189,228,0.08)":"none"}}>
            <JunctionLines style={{position:"absolute",top:-10,right:-20,width:mob?180:360,height:200,opacity:dark?.04:.06}}/>
            <div style={{position:"relative",display:"flex",alignItems:"center",gap:mob?12:16,flexWrap:"wrap"}}>
              {/* Esquerda: ícone + título + subtítulo */}
              <div style={{width:mob?38:44,height:mob?38:44,borderRadius:11,background:`${C.amareloOuro}18`,border:`1px solid ${C.amareloOuro}30`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{Ic.inbox(mob?18:20,C.amareloOuro)}</div>
              <div style={{flex:1,minWidth:0}}>
                <h2 style={{fontSize:mob?17:21,fontWeight:700,color:C.branco,fontFamily:Fn.title,margin:0,lineHeight:1.15,letterSpacing:"-0.2px"}}>Sistema de Requisições</h2>
                <p style={{fontSize:mob?11:12,color:`${C.branco}AA`,fontFamily:Fn.body,margin:"4px 0 0",lineHeight:1.4}}>Gestão de compras e requisições do módulo Suprimentos · FIPS</p>
              </div>
              {/* Direita: CTA Nova Solicitação — DSButton variant accent (Destaque) size small */}
              <span className="ds-btn-wrap" style={{flexShrink:0}}>
                <button onMouseEnter={e=>{e.currentTarget.style.background="#E0820A";e.currentTarget.style.boxShadow="0 2px 8px rgba(0,75,155,0.18)"}} onMouseLeave={e=>{e.currentTarget.style.background=C.amareloEscuro;e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="scale(1)"}} onMouseDown={e=>{e.currentTarget.style.transform="scale(0.97)"}} onMouseUp={e=>{e.currentTarget.style.transform="scale(1)"}} style={{display:"inline-flex",alignItems:"center",justifyContent:"center",gap:7,padding:"6px 14px",height:30,fontSize:12,fontWeight:600,fontFamily:Fn.body,borderRadius:6,border:"1.5px solid transparent",background:C.amareloEscuro,color:C.branco,cursor:"pointer",transition:"all 0.18s ease",letterSpacing:"0.01em",whiteSpace:"nowrap",outline:"none",boxShadow:"none"}}>{Ic.plus(13,C.branco)} Nova Solicitação</button>
              </span>
            </div>
          </div>
          </CopyableInline>

          {/* KPIs sparkline — variante alternativa (fora do card da toolbar) */}
          <CopyableInline label="KPI Cards (sparkline — variante)" code={dlCode('kpi')} preview={dlPreview('kpi')}>
          {(()=>{
            const total=allData.length;
            const pendentes=allData.filter(r=>r.status==="Pendente").length;
            const aprovadas=allData.filter(r=>r.status==="Aprovada").length;
            const volume=allData.reduce((a,r)=>a+r.valor,0);
            // Sparkline com variância garantida — não fica linha reta nunca
            const mkSpark=(seed)=>{
              let r=seed;
              return Array.from({length:12},(_,i)=>{
                r=(r*9301+49297)%233280;
                const noise=(r/233280-0.5)*40;
                const trend=Math.sin(i*0.7+seed*0.08)*32;
                return Math.max(8,Math.round(55+noise+trend));
              });
            };
            const months=["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
            const kpis=[
              {label:"Total registros",value:total.toLocaleString("pt-BR"),delta:"+12%",icon:Ic.inbox,color:C.azulProfundo,spark:mkSpark(11)},
              {label:"Pendentes",value:pendentes,delta:`${Math.round(pendentes/total*100)}%`,icon:Ic.clock,color:C.amareloEscuro,spark:mkSpark(23)},
              {label:"Aprovadas",value:aprovadas,delta:`${Math.round(aprovadas/total*100)}%`,icon:Ic.checkCircle,color:C.verdeFloresta,spark:mkSpark(37)},
              {label:"Volume total",value:`R$ ${(volume/1000).toFixed(0)}k`,delta:"+8%",icon:Ic.cash,color:C.verdeEscuro,spark:mkSpark(53)},
            ];
            return(
              <div style={{display:"grid",gridTemplateColumns:mob?"repeat(2,1fr)":"repeat(4,1fr)",gap:mob?10:14,marginBottom:mob?12:16}}>
                {kpis.map((k,i)=>{
                  const max=Math.max(...k.spark),min=Math.min(...k.spark);
                  const sw=200,sh=44;
                  const pts=k.spark.map((v,j)=>({x:(j/(k.spark.length-1))*sw,y:sh-((v-min)/(max-min||1))*(sh-10)+5}));
                  const line=pts.map(p=>`${p.x},${p.y}`).join(" ");
                  const uid=`spk${i}`;
                  const hovPt=hovKpi&&hovKpi.c===i?hovKpi.p:-1;
                  return(
                    <div key={i} style={{background:C.cardBg,borderRadius:"10px 10px 10px 18px",border:`1px solid ${C.cardBorder}`,boxShadow:"0 1px 3px rgba(0,75,155,.04)",position:"relative",overflow:"hidden"}}>
                      <div style={{padding:mob?"14px 14px 4px":"16px 18px 4px"}}>
                        <div style={{position:"absolute",top:mob?12:14,right:mob?12:14,width:mob?32:36,height:mob?32:36,borderRadius:9,background:alpha(k.color,0.06),display:"flex",alignItems:"center",justifyContent:"center"}}>{k.icon(mob?15:17,k.color)}</div>
                        <span style={{fontSize:11,fontWeight:600,color:C.cinzaChumbo,display:"block",marginBottom:6}}>{k.label}</span>
                        <div style={{display:"flex",alignItems:"baseline",gap:7,minHeight:26}}>
                          {hovPt>=0?
                            <><span style={{fontSize:mob?20:24,fontWeight:800,fontFamily:Fn.title,color:k.color,lineHeight:1}}>{k.spark[hovPt]}</span><span style={{fontSize:10,fontWeight:600,fontFamily:Fn.body,color:C.cinzaChumbo}}>{months[hovPt]}</span></>
                          :
                            <><span style={{fontSize:mob?20:24,fontWeight:800,fontFamily:Fn.title,color:C.cinzaEscuro,lineHeight:1}}>{k.value}</span><span style={{display:"inline-flex",alignItems:"center",gap:2,fontSize:10,fontWeight:700,fontFamily:Fn.mono,color:C.verdeFloresta}}>{Ic.arrowUp(8,C.verdeFloresta)}{k.delta}</span></>
                          }
                        </div>
                      </div>
                      <div style={{marginLeft:-1,marginRight:-1,marginBottom:-1,marginTop:6}}>
                        <svg width="100%" height={sh+10} viewBox={`-2 -8 ${sw+4} ${sh+18}`} preserveAspectRatio="none" style={{display:"block"}} onMouseLeave={()=>setHovKpi(null)}>
                          <defs><linearGradient id={uid} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={k.color} stopOpacity=".25"/><stop offset="100%" stopColor={k.color} stopOpacity="0"/></linearGradient></defs>
                          <polygon points={`0,${sh} ${line} ${sw},${sh}`} fill={`url(#${uid})`}/>
                          <polyline points={line} fill="none" stroke={k.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          {/* Linha vertical no hover */}
                          {hovPt>=0&&<line x1={pts[hovPt].x} y1={-2} x2={pts[hovPt].x} y2={sh+2} stroke={k.color} strokeWidth=".8" strokeDasharray="2 2" opacity=".5"/>}
                          {/* Hit areas + dots */}
                          {pts.map((p,j)=>(
                            <g key={j} onMouseEnter={()=>setHovKpi({c:i,p:j})} style={{cursor:"pointer"}}>
                              <rect x={p.x-(sw/k.spark.length/2)} y={-8} width={sw/k.spark.length} height={sh+18} fill="transparent"/>
                              <circle cx={p.x} cy={p.y} r={hovPt===j?3.5:0} fill={k.color} stroke={C.cardBg} strokeWidth="1.5" style={{transition:"r .12s"}}/>
                            </g>
                          ))}
                        </svg>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
          </CopyableInline>
          {/* TOOLBAR SEPARADA — card próprio: filtros/busca à esquerda, export à direita */}
          <CopyableInline label="Toolbar + Table" code={dlCode('toolbar')} preview={dlPreview('toolbar')}>
          <div style={{background:C.cardBg,borderRadius:"10px 10px 10px 18px",border:`1px solid ${C.cardBorder}`,overflow:"visible",boxShadow:"0 1px 3px rgba(0,75,155,.04)",marginBottom:14}}>
            <div style={{padding:"14px 18px",display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
              {/* Filtros */}
              <div ref={filterRef} style={{position:"relative"}}>
                <button onClick={()=>setShowFilters(!showFilters)} style={{display:"inline-flex",alignItems:"center",gap:5,padding:"7px 12px",fontSize:11,fontWeight:600,color:totalFilters>0?C.azulProfundo:C.cinzaEscuro,background:totalFilters>0?accentBg:C.cardBg,border:`1px solid ${totalFilters>0?C.azulProfundo:C.cardBorder}`,borderRadius:8,cursor:"pointer",fontFamily:Fn.body,transition:"all .15s"}}>{Ic.filter(13,totalFilters>0?C.azulProfundo:C.cinzaChumbo)} Filtros{totalFilters>0&&<span style={{fontSize:9,fontFamily:Fn.mono,padding:"1px 5px",background:C.azulProfundo,color:C.branco,borderRadius:8}}>{totalFilters}</span>}</button>
                {showFilters&&<div style={{position:"absolute",top:"calc(100% + 6px)",left:0,zIndex:50,width:280,background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:"10px 10px 10px 16px",boxShadow:"0 12px 36px rgba(0,42,104,.18),0 2px 8px rgba(0,42,104,.06)",animation:"popIn .18s ease",overflow:"hidden"}}>
                  <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.cardBorder}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>Filtros</span>
                    {totalFilters>0&&<button onClick={clearFilters} style={{fontSize:10,fontWeight:600,color:C.danger,background:"transparent",border:"none",cursor:"pointer",fontFamily:Fn.body}}>Limpar tudo</button>}
                  </div>
                  <div style={{padding:"12px 16px",maxHeight:340,overflowY:"auto"}}>
                    <span style={{fontSize:9,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.cinzaChumbo,fontFamily:Fn.title,display:"block",marginBottom:6}}>Status</span>
                    <div style={{display:"flex",flexDirection:"column",gap:2,marginBottom:14}}>
                      {STATUSES.map(s=>(
                        <div key={s} onClick={()=>toggleFilter("status",s)} style={{padding:"6px 8px",fontSize:11,color:C.cinzaEscuro,cursor:"pointer",borderRadius:5,display:"flex",alignItems:"center",gap:8}} onMouseEnter={e=>e.currentTarget.style.background=C.bg} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                          <div style={{width:14,height:14,borderRadius:3,border:`1.5px solid ${filters.status.includes(s)?C.azulProfundo:C.cardBorder}`,background:filters.status.includes(s)?C.azulProfundo:C.branco,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{filters.status.includes(s)&&Ic.check(10)}</div>
                          <Badge variant={STATUS_COLOR[s]} dot dark={dark}>{s}</Badge>
                        </div>
                      ))}
                    </div>
                    <span style={{fontSize:9,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.cinzaChumbo,fontFamily:Fn.title,display:"block",marginBottom:6}}>Departamento</span>
                    <div style={{display:"flex",flexDirection:"column",gap:2,marginBottom:14}}>
                      {DEPTS.map(d=>(
                        <div key={d} onClick={()=>toggleFilter("dept",d)} style={{padding:"6px 8px",fontSize:11,color:C.cinzaEscuro,cursor:"pointer",borderRadius:5,display:"flex",alignItems:"center",gap:8}} onMouseEnter={e=>e.currentTarget.style.background=C.bg} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                          <div style={{width:14,height:14,borderRadius:3,border:`1.5px solid ${filters.dept.includes(d)?C.azulProfundo:C.cardBorder}`,background:filters.dept.includes(d)?C.azulProfundo:C.branco,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{filters.dept.includes(d)&&Ic.check(10)}</div>
                          <span>{d}</span>
                        </div>
                      ))}
                    </div>
                    <span style={{fontSize:9,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.cinzaChumbo,fontFamily:Fn.title,display:"block",marginBottom:6}}>Prioridade</span>
                    <div style={{display:"flex",flexDirection:"column",gap:2}}>
                      {PRIO.map(p=>(
                        <div key={p} onClick={()=>toggleFilter("priority",p)} style={{padding:"6px 8px",fontSize:11,color:C.cinzaEscuro,cursor:"pointer",borderRadius:5,display:"flex",alignItems:"center",gap:8}} onMouseEnter={e=>e.currentTarget.style.background=C.bg} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                          <div style={{width:14,height:14,borderRadius:3,border:`1.5px solid ${filters.priority.includes(p)?C.azulProfundo:C.cardBorder}`,background:filters.priority.includes(p)?C.azulProfundo:C.branco,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{filters.priority.includes(p)&&Ic.check(10)}</div>
                          <span style={{display:"inline-flex",alignItems:"center",gap:5}}><span style={{width:7,height:7,borderRadius:"50%",background:PRIO_COLOR[p]}}/>{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>}
              </div>
              <div onClick={e=>e.currentTarget.querySelector("input")?.focus()} style={{display:"flex",alignItems:"center",gap:8,height:32.5,padding:"0 12px",background:"var(--color-surface)",border:`1.5px solid ${searchFocused?C.azulProfundo:"#E2E8F0"}`,borderRadius:8,boxShadow:searchFocused?`0 0 0 3px ${accentRing}`:"none",transition:"all 0.18s ease",cursor:"text",flex:1,minWidth:200,maxWidth:320}}>
                <span style={{display:"flex",flexShrink:0,opacity:.7}}>{Ic.search(15)}</span>
                <input value={search} onChange={e=>setSearch(e.target.value)} onFocus={()=>setSearchFocused(true)} onBlur={()=>setSearchFocused(false)} placeholder="Buscar requisições..." style={{flex:1,border:"none",outline:"none",background:"transparent",fontFamily:Fn.body,fontSize:13,color:C.cinzaEscuro,minWidth:0}}/>
                {search&&<span onClick={e=>{e.stopPropagation();setSearch("")}} style={{display:"flex",cursor:"pointer",opacity:.5,flexShrink:0}}>{Ic.x(14,C.cinzaChumbo)}</span>}
              </div>
              {/* Período (single-select dropdown) */}
              <div ref={periodoRef} style={{position:"relative"}}>
                <button onClick={()=>setShowPeriodo(!showPeriodo)} style={{display:"inline-flex",alignItems:"center",gap:6,padding:"7px 12px",fontSize:11,fontWeight:600,color:C.cinzaEscuro,background:C.cardBg,border:`1px solid ${showPeriodo?C.azulProfundo:C.cardBorder}`,borderRadius:8,cursor:"pointer",fontFamily:Fn.body,transition:"all .15s"}}>{Ic.calendar(13)}<span style={{color:C.cinzaChumbo}}>Período:</span><span style={{color:C.cinzaEscuro,fontWeight:700}}>{periodo}</span>{Ic.chev(10,showPeriodo?C.azulProfundo:C.cinzaChumbo)}</button>
                {showPeriodo&&<div style={{position:"absolute",top:"calc(100% + 6px)",left:0,zIndex:50,minWidth:240,background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:"8px 8px 8px 14px",boxShadow:"0 12px 36px rgba(0,42,104,.18),0 2px 8px rgba(0,42,104,.06)",animation:"popIn .18s ease",overflow:"hidden",padding:"6px 0"}}>
                  {["Hoje","Últimos 7 dias","Últimos 30 dias","Últimos 90 dias","Este ano","Todos"].map(opt=>{
                    const isA=periodo===opt;
                    return(
                      <div key={opt} onClick={()=>{setPeriodo(opt);setShowCustom(false);setShowPeriodo(false)}} style={{padding:"8px 14px",fontSize:11,color:isA?C.azulProfundo:C.cinzaEscuro,fontWeight:isA?700:500,cursor:"pointer",display:"flex",alignItems:"center",gap:8,background:isA?accentBg:"transparent",transition:"background .12s"}} onMouseEnter={e=>{if(!isA)e.currentTarget.style.background=C.bg}} onMouseLeave={e=>{if(!isA)e.currentTarget.style.background="transparent"}}>
                        <div style={{width:14,height:14,borderRadius:"50%",border:`1.5px solid ${isA?C.azulProfundo:C.cardBorder}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{isA&&<div style={{width:6,height:6,borderRadius:"50%",background:C.azulProfundo}}/>}</div>
                        <span style={{flex:1}}>{opt}</span>
                      </div>
                    );
                  })}
                  {/* Divider */}
                  <div style={{height:1,background:C.cardBorder,margin:"6px 0"}}/>
                  {/* Personalizado */}
                  {(()=>{const isA=periodo.includes("→")||showCustom;return(
                    <div onClick={()=>setShowCustom(true)} style={{padding:"8px 14px",fontSize:11,color:isA?C.azulProfundo:C.cinzaEscuro,fontWeight:isA?700:500,cursor:"pointer",display:"flex",alignItems:"center",gap:8,background:isA?accentBg:"transparent",transition:"background .12s"}} onMouseEnter={e=>{if(!isA)e.currentTarget.style.background=C.bg}} onMouseLeave={e=>{if(!isA)e.currentTarget.style.background="transparent"}}>
                      <div style={{width:14,height:14,borderRadius:"50%",border:`1.5px solid ${isA?C.azulProfundo:C.cardBorder}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{isA&&<div style={{width:6,height:6,borderRadius:"50%",background:C.azulProfundo}}/>}</div>
                      <span style={{flex:1,display:"inline-flex",alignItems:"center",gap:6}}>{Ic.calendar(11,isA?C.azulProfundo:C.cinzaChumbo)} Personalizado</span>
                    </div>
                  )})()}
                  {/* Sub-form com inputs de data */}
                  {showCustom&&<div style={{padding:"10px 14px 12px",background:`${C.bg}80`,borderTop:`1px solid ${C.cardBorder}`,marginTop:6}}>
                    <div style={{display:"flex",flexDirection:"column",gap:8}}>
                      <div style={{display:"flex",flexDirection:"column",gap:3}}>
                        <label style={{fontSize:9,fontWeight:700,letterSpacing:".5px",textTransform:"uppercase",color:C.cinzaChumbo,fontFamily:Fn.title,display:"inline-flex",alignItems:"center",gap:5}}>{Ic.calendar(11,C.azulProfundo)} Data início</label>
                        <div style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",border:`1px solid ${C.cardBorder}`,borderRadius:6,background:C.cardBg}}>
                          {Ic.calendar(13,C.cinzaChumbo)}
                          <input type="date" value={customStart} onChange={e=>setCustomStart(e.target.value)} style={{flex:1,minWidth:0,fontSize:11,border:"none",fontFamily:Fn.body,color:C.cinzaEscuro,outline:"none",background:"transparent",cursor:"pointer"}}/>
                        </div>
                      </div>
                      <div style={{display:"flex",flexDirection:"column",gap:3}}>
                        <label style={{fontSize:9,fontWeight:700,letterSpacing:".5px",textTransform:"uppercase",color:C.cinzaChumbo,fontFamily:Fn.title,display:"inline-flex",alignItems:"center",gap:5}}>{Ic.calendar(11,C.azulProfundo)} Data fim</label>
                        <div style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",border:`1px solid ${C.cardBorder}`,borderRadius:6,background:C.cardBg}}>
                          {Ic.calendar(13,C.cinzaChumbo)}
                          <input type="date" value={customEnd} onChange={e=>setCustomEnd(e.target.value)} min={customStart||undefined} style={{flex:1,minWidth:0,fontSize:11,border:"none",fontFamily:Fn.body,color:C.cinzaEscuro,outline:"none",background:"transparent",cursor:"pointer"}}/>
                        </div>
                      </div>
                      <div style={{display:"flex",gap:6,marginTop:4}}>
                        <button onClick={()=>{setShowCustom(false);setCustomStart("");setCustomEnd("")}} style={{flex:1,padding:"7px 10px",fontSize:10,fontWeight:600,color:C.cinzaEscuro,background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:6,cursor:"pointer",fontFamily:Fn.body}}>Cancelar</button>
                        <button onClick={()=>{
                          if(!customStart||!customEnd)return;
                          const fmt=d=>{const[y,m,day]=d.split("-");return `${day}/${m}/${y.slice(2)}`};
                          setPeriodo(`${fmt(customStart)} → ${fmt(customEnd)}`);
                          setShowCustom(false);
                          setShowPeriodo(false);
                        }} disabled={!customStart||!customEnd} style={{flex:1,padding:"7px 10px",fontSize:10,fontWeight:700,color:C.branco,background:(!customStart||!customEnd)?C.cinzaClaro:C.azulProfundo,border:"none",borderRadius:6,cursor:(!customStart||!customEnd)?"not-allowed":"pointer",fontFamily:Fn.body}}>Aplicar</button>
                      </div>
                    </div>
                  </div>}
                </div>}
              </div>

              <div style={{flex:1}}/>

              <ExportButtons
                onExcel={()=>{setExportIntent("excel");setExportOpen(true)}}
                onPdf={()=>{setExportIntent("pdf");setExportOpen(true)}}
              />
            </div>
          </div>

          <ExportPreviewModal
            open={exportOpen}
            onOpenChange={setExportOpen}
            intent={exportIntent}
            filename="requisicoes"
            columns={[
              {key:"id",label:"Código"},
              {key:"sol",label:"Solicitante"},
              {key:"dept",label:"Departamento"},
              {key:"status",label:"Status"},
              {key:"priority",label:"Prioridade"},
              {key:"sla",label:"SLA"},
              {key:"valor",label:"Valor",render:(row)=>`R$ ${Number((row as {valor?:number}).valor??0).toLocaleString("pt-BR")}`},
              {key:"data",label:"Data"},
            ]}
            tableColumnKeys={["id","sol","dept","status","priority","valor","data"]}
            expandedColumnKeys={["id","sol","dept","status","priority","sla","valor","data"]}
            data={allData as Record<string,unknown>[]}
            onExportExcel={()=>undefined}
            onExportPdf={()=>undefined}
            onPrint={()=>window.print()}
          />

          {/* TABLE CARD com Header obrigatório (ícone + título + subtítulo) */}
          <div style={{background:C.cardBg,borderRadius:"12px 12px 12px 24px",border:`1px solid ${C.cardBorder}`,overflow:"visible",boxShadow:"0 1px 3px rgba(0,75,155,.04)"}}>
            {/* Header obrigatório */}
            <div style={{padding:"18px 20px 14px",display:"flex",alignItems:"center",gap:14,borderBottom:`1px solid ${C.cardBorder}`}}>
              <div style={{width:48,height:48,borderRadius:14,background:alpha(C.azulProfundo,0.04),border:`1px solid ${alpha(C.azulProfundo,0.08)}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{Ic.inbox(22,C.azulProfundo)}</div>
              <div style={{flex:1,minWidth:0}}>
                <h3 style={{fontSize:16,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title,margin:0,lineHeight:1.2}}>Requisições</h3>
                <p style={{fontSize:11,color:C.cinzaChumbo,fontFamily:Fn.body,margin:"3px 0 0",lineHeight:1.4}}>{data.length} {data.length===1?"registro":"registros"} {(search||totalFilters>0)?"filtrados":"no total"} · Atualizado agora</p>
              </div>
              {/* Lado direito do header: filtrado + config */}
              <div style={{display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
                {(search||totalFilters>0)&&<span style={{fontSize:10,fontWeight:700,letterSpacing:".5px",textTransform:"uppercase",color:C.cinzaEscuro,background:accentBg,padding:"4px 10px",borderRadius:12,fontFamily:Fn.title}}>Filtrado</span>}
                {/* Toggle Tabela/Card */}
                <div style={{display:"flex",gap:3,padding:3,background:C.bg,borderRadius:8,border:`1px solid ${C.cardBorder}`}}>
                  <button onClick={()=>setView("table")} style={{display:"inline-flex",alignItems:"center",gap:5,padding:"5px 10px",fontSize:11,fontWeight:600,color:view==="table"?C.azulProfundo:C.cinzaChumbo,background:view==="table"?C.cardBg:"transparent",border:"none",borderRadius:6,cursor:"pointer",fontFamily:Fn.body,boxShadow:view==="table"?"0 1px 2px rgba(0,42,104,.08)":"none",transition:"all .15s"}}>{Ic.list(12,view==="table"?C.azulProfundo:C.cinzaChumbo)} Tabela</button>
                  <button onClick={()=>setView("cards")} style={{display:"inline-flex",alignItems:"center",gap:5,padding:"5px 10px",fontSize:11,fontWeight:600,color:view==="cards"?C.azulProfundo:C.cinzaChumbo,background:view==="cards"?C.cardBg:"transparent",border:"none",borderRadius:6,cursor:"pointer",fontFamily:Fn.body,boxShadow:view==="cards"?"0 1px 2px rgba(0,42,104,.08)":"none",transition:"all .15s"}}>{Ic.grid(12,view==="cards"?C.azulProfundo:C.cinzaChumbo)} Cards</button>
                </div>
                <div ref={configRef} style={{position:"relative"}}>
                  <button onClick={()=>setShowConfig(!showConfig)} style={{display:"inline-flex",alignItems:"center",gap:6,padding:"7px 12px",fontSize:11,fontWeight:600,fontFamily:Fn.body,color:showConfig?C.azulProfundo:C.cinzaEscuro,background:showConfig?accentBg:C.cardBg,border:`1px solid ${showConfig?C.azulProfundo:C.cardBorder}`,borderRadius:8,cursor:"pointer",transition:"all .15s"}} title="Configurações da tabela">{Ic.settings(14,showConfig?C.azulProfundo:C.cinzaChumbo)} Configurar</button>
                  {showConfig&&<div style={{position:"absolute",top:"calc(100% + 6px)",right:0,zIndex:50,width:300,background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:"10px 10px 10px 16px",boxShadow:"0 12px 36px rgba(0,42,104,.18),0 2px 8px rgba(0,42,104,.06)",animation:"popIn .18s ease",overflow:"hidden"}}>
                    <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.cardBorder}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                      <span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>Configurações</span>
                      <button onClick={()=>setShowConfig(false)} style={{width:22,height:22,background:"transparent",border:"none",cursor:"pointer",borderRadius:5,display:"flex",alignItems:"center",justifyContent:"center"}}>{Ic.x(12)}</button>
                    </div>
                    <div style={{display:"flex",borderBottom:`1px solid ${C.cardBorder}`,background:C.bg}}>
                      {[{id:"colunas",label:"Colunas",icon:Ic.columns},{id:"densidade",label:"Densidade",icon:Ic.density},{id:"aparencia",label:"Aparência",icon:Ic.grid}].map(t=>(
                        <button key={t.id} onClick={()=>setConfigTab(t.id)} style={{flex:1,display:"inline-flex",alignItems:"center",justifyContent:"center",gap:5,padding:"9px 8px",fontSize:11,fontWeight:600,color:configTab===t.id?C.azulProfundo:C.cinzaChumbo,background:configTab===t.id?C.cardBg:"transparent",border:"none",borderBottom:`2px solid ${configTab===t.id?C.azulProfundo:"transparent"}`,cursor:"pointer",fontFamily:Fn.body,transition:"all .12s"}}>{t.icon(12,configTab===t.id?C.azulProfundo:C.cinzaChumbo)} {t.label}</button>
                      ))}
                    </div>
                    <div style={{padding:"12px 16px",maxHeight:320,overflowY:"auto"}}>
                      {configTab==="colunas"&&<div style={{display:"flex",flexDirection:"column",gap:2}}>
                        <span style={{fontSize:9,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.cinzaChumbo,fontFamily:Fn.title,marginBottom:6,marginLeft:4}}>Visíveis ({visibleCols.size})</span>
                        {ALL_COLUMNS.map(col=>{const isVisible=visibleCols.has(col.id);return(
                          <div key={col.id} onClick={()=>toggleCol(col.id)} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 8px",borderRadius:6,cursor:col.fixed?"not-allowed":"pointer",opacity: col.fixed ? 0.6 : 1,transition:"background .12s"}} onMouseEnter={e=>{if(!col.fixed)e.currentTarget.style.background=C.bg}} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                            {Ic.drag(10)}
                            <Checkbox checked={isVisible} onChange={()=>{}} size={14}/>
                            <span style={{fontSize:11,color:C.cinzaEscuro,fontWeight:500,flex:1}}>{col.label}</span>
                            {col.fixed&&<span style={{fontSize:9,color:C.textLight,fontFamily:Fn.mono}}>fixa</span>}
                          </div>
                        )})}
                      </div>}
                      {configTab==="densidade"&&<div style={{display:"flex",flexDirection:"column",gap:6}}>
                        <span style={{fontSize:9,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.cinzaChumbo,fontFamily:Fn.title,marginBottom:6,marginLeft:4}}>Altura das linhas</span>
                        {[{id:"compact",label:"Compacta",desc:"30px · alta densidade"},{id:"normal",label:"Normal",desc:"42px · padrão"},{id:"comfortable",label:"Confortável",desc:"56px · acessível"}].map(opt=>{const isA=density===opt.id;return(
                          <div key={opt.id} onClick={()=>setDensity(opt.id)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:8,border:`1px solid ${isA?C.azulProfundo:C.cardBorder}`,background:isA?accentBg:C.cardBg,cursor:"pointer",transition:"all .12s"}}>
                            <div style={{width:18,height:18,borderRadius:"50%",border:`2px solid ${isA?C.azulProfundo:C.cardBorder}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{isA&&<div style={{width:8,height:8,borderRadius:"50%",background:C.azulProfundo}}/>}</div>
                            <div style={{flex:1}}>
                              <div style={{fontSize:12,fontWeight:600,color:isA?C.azulProfundo:C.cinzaEscuro}}>{opt.label}</div>
                              <div style={{fontSize:10,color:C.cinzaChumbo}}>{opt.desc}</div>
                            </div>
                            <div style={{display:"flex",flexDirection:"column",gap:2,alignItems:"flex-end"}}>
                              {[1,2,3].map(i=><div key={i} style={{height:opt.id==="compact"?2:opt.id==="normal"?3:4,width:24,borderRadius:1,background:isA?C.azulProfundo:C.cardBorder,opacity:.6}}/>)}
                            </div>
                          </div>
                        )})}
                      </div>}
                      {configTab==="aparencia"&&<div style={{display:"flex",flexDirection:"column",gap:2}}>
                        <span style={{fontSize:9,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.cinzaChumbo,fontFamily:Fn.title,marginBottom:6,marginLeft:4}}>Aparência da tabela</span>
                        {[{id:"zebra",label:"Linhas zebradas",desc:"Alterna fundo das linhas"},{id:"verticalBorders",label:"Bordas verticais",desc:"Linhas entre colunas"},{id:"stickyHeader",label:"Header fixo",desc:"Cabeçalho fica visível ao rolar"},{id:"wrapText",label:"Quebra de linha",desc:"Texto longo quebra em várias linhas"}].map(opt=>(
                          <div key={opt.id} onClick={()=>setAppearance(a=>({...a,[opt.id]:!a[opt.id]}))} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 8px",borderRadius:6,cursor:"pointer",transition:"background .12s"}} onMouseEnter={e=>e.currentTarget.style.background=C.bg} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                            <div style={{flex:1}}>
                              <div style={{fontSize:11,fontWeight:600,color:C.cinzaEscuro}}>{opt.label}</div>
                              <div style={{fontSize:10,color:C.cinzaChumbo}}>{opt.desc}</div>
                            </div>
                            <Toggle checked={appearance[opt.id]} onChange={()=>{}}/>
                          </div>
                        ))}
                      </div>}
                    </div>
                    <div style={{padding:"10px 14px",borderTop:`1px solid ${C.cardBorder}`,background:C.bg,display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
                      <button onClick={configTab==="colunas"?restoreCols:()=>{setDensity("normal");setAppearance({zebra:true,verticalBorders:false,stickyHeader:true,wrapText:false})}} style={{fontSize:10,color:C.cinzaChumbo,background:"transparent",border:"none",cursor:"pointer",fontFamily:Fn.body,fontWeight:600}}>Restaurar padrão</button>
                      <button onClick={()=>setShowConfig(false)} style={{padding:"6px 12px",fontSize:11,fontWeight:700,color:C.branco,background:C.azulProfundo,border:"none",borderRadius:6,cursor:"pointer",fontFamily:Fn.body}}>Aplicar</button>
                    </div>
                  </div>}
                </div>
              </div>
            </div>

            {/* TABELA */}
            {view==="table"&&<div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontFamily:Fn.body}}>
                <thead><tr style={{background:C.bg}}>
                  <th style={{padding:`8px ${D.padX}px`,textAlign:"left",width:36,borderBottom:`2px solid ${C.cardBorder}`}}><Checkbox checked={selected.size===data.length&&selected.size>0} onChange={toggleAll} size={14}/></th>
                  {visibleColumnList.filter(c=>c.id!=="actions").map(col=>(
                    <th key={col.id} onClick={()=>setSortBy(s=>({col:col.id,dir:s.col===col.id&&s.dir==="asc"?"desc":"asc"}))} style={{padding:`8px ${D.padX}px`,textAlign:col.id==="valor"?"right":"left",fontSize:9,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.cinzaChumbo,fontFamily:Fn.title,borderBottom:`2px solid ${C.cardBorder}`,whiteSpace:"nowrap",cursor:"pointer",borderRight:appearance.verticalBorders?`1px solid ${C.cardBorder}`:"none"}}>
                      <span style={{display:"inline-flex",alignItems:"center",gap:4}}>{col.label}{sortBy.col===col.id?Ic.sortAsc(10):Ic.sortNone(10)}</span>
                    </th>
                  ))}
                  {visibleCols.has("actions")&&<th style={{padding:`8px ${D.padX}px`,textAlign:"center",fontSize:9,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.cinzaChumbo,fontFamily:Fn.title,borderBottom:`2px solid ${C.cardBorder}`,width:80}}>Ações</th>}
                </tr></thead>
                <tbody>{data.map((r,i)=>{
                  const isSel=selected.has(r.id);
                  const bg=isSel?alpha(C.azulProfundo,0.024):appearance.zebra&&i%2===1?zebraBg:"transparent";
                  return(<tr key={r.id} style={{borderBottom:`1px solid ${C.cardBorder}`,background:bg,height:D.rowH,transition:"background .12s",cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.background=`${C.amareloOuro}15`} onMouseLeave={e=>e.currentTarget.style.background=bg}>
                    <td style={{padding:`0 ${D.padX}px`}}><Checkbox checked={isSel} onChange={()=>toggleSel(r.id)} size={14}/></td>
                    {visibleCols.has("id")&&<td style={{padding:`0 ${D.padX}px`,fontSize:D.fs-1,fontFamily:Fn.mono,fontWeight:600,color:C.cinzaEscuro,whiteSpace:appearance.wrapText?"normal":"nowrap",borderRight:appearance.verticalBorders?`1px solid ${C.cardBorder}`:"none"}}>{r.id}</td>}
                    {visibleCols.has("sol")&&<td style={{padding:`0 ${D.padX}px`,borderRight:appearance.verticalBorders?`1px solid ${C.cardBorder}`:"none"}}><div style={{display:"flex",alignItems:"center",gap:8}}><Avatar name={r.sol} size={density==="compact"?22:density==="normal"?28:34}/><span style={{fontSize:D.fs,color:C.cinzaEscuro,fontWeight:600,whiteSpace:appearance.wrapText?"normal":"nowrap"}}>{r.sol}</span></div></td>}
                    {visibleCols.has("dept")&&<td style={{padding:`0 ${D.padX}px`,fontSize:D.fs-1,color:C.cinzaChumbo,borderRight:appearance.verticalBorders?`1px solid ${C.cardBorder}`:"none"}}>{r.dept}</td>}
                    {visibleCols.has("status")&&<td style={{padding:`0 ${D.padX}px`,borderRight:appearance.verticalBorders?`1px solid ${C.cardBorder}`:"none"}}><Badge variant={STATUS_COLOR[r.status]} dot dark={dark}>{r.status}</Badge></td>}
                    {visibleCols.has("priority")&&<td style={{padding:`0 ${D.padX}px`,borderRight:appearance.verticalBorders?`1px solid ${C.cardBorder}`:"none"}}><span style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:D.fs-1,fontWeight:600,color:PRIO_COLOR[r.priority]}}><span style={{width:6,height:6,borderRadius:"50%",background:PRIO_COLOR[r.priority]}}/>{r.priority}</span></td>}
                    {visibleCols.has("sla")&&<td style={{padding:`0 ${D.padX}px`,borderRight:appearance.verticalBorders?`1px solid ${C.cardBorder}`:"none"}}><div style={{display:"flex",alignItems:"center",gap:6,minWidth:80}}><div style={{flex:1,height:4,borderRadius:2,background:`${r.sla>=70?C.verdeFloresta:r.sla>=50?C.amareloEscuro:C.danger}20`}}><div style={{height:4,borderRadius:2,background:r.sla>=70?C.verdeFloresta:r.sla>=50?C.amareloEscuro:C.danger,width:`${r.sla}%`}}/></div><span style={{fontSize:9,fontFamily:Fn.mono,fontWeight:700,color:r.sla>=70?C.verdeFloresta:r.sla>=50?C.amareloEscuro:C.danger}}>{r.sla}%</span></div></td>}
                    {visibleCols.has("valor")&&<td style={{padding:`0 ${D.padX}px`,fontSize:D.fs-1,fontFamily:Fn.mono,fontWeight:700,color:C.cinzaEscuro,textAlign:"right",whiteSpace:"nowrap",borderRight:appearance.verticalBorders?`1px solid ${C.cardBorder}`:"none"}}>R$ {r.valor.toLocaleString("pt-BR")}</td>}
                    {visibleCols.has("data")&&<td style={{padding:`0 ${D.padX}px`,fontSize:D.fs-1,fontFamily:Fn.mono,color:C.textMuted,whiteSpace:"nowrap",borderRight:appearance.verticalBorders?`1px solid ${C.cardBorder}`:"none"}}>{r.data}</td>}
                    {visibleCols.has("actions")&&<td style={{padding:`0 ${D.padX}px`,textAlign:"center"}} onClick={e=>e.stopPropagation()}>
                      <RowActionsMenu
                        rowId={r.id}
                        radius={56}
                        actions={[
                          {key:"edit",label:"Editar pedido",icon:<Pencil className="h-4 w-4"/>,onClick:()=>undefined},
                          {key:"cancel",label:"Cancelar",icon:<Ban className="h-4 w-4"/>,danger:true,onClick:()=>undefined},
                          {key:"delete",label:"Excluir",icon:<Trash2 className="h-4 w-4"/>,danger:true,onClick:()=>undefined},
                        ]}
                      />
                    </td>}
                  </tr>);
                })}</tbody>
              </table>
            </div>}

            {view==="cards"&&<div style={{padding:16,display:"grid",gridTemplateColumns:mob?"1fr":"repeat(auto-fill,minmax(280px,1fr))",gap:12}}>
              {data.map(r=>{const isSel=selected.has(r.id);return(
                <div key={r.id} onClick={()=>toggleSel(r.id)} style={{padding:14,background:isSel?alpha(C.azulProfundo,0.03):C.cardBg,border:`1px solid ${isSel?C.azulProfundo:C.cardBorder}`,borderRadius:"8px 8px 8px 14px",cursor:"pointer",transition:"all .15s"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                    <span style={{fontSize:10,fontFamily:Fn.mono,fontWeight:700,color:C.cinzaEscuro}}>{r.id}</span>
                    <Badge variant={STATUS_COLOR[r.status]} dot dark={dark}>{r.status}</Badge>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                    <Avatar name={r.sol} size={32}/>
                    <div><span style={{fontSize:12,fontWeight:600,color:C.cinzaEscuro,display:"block"}}>{r.sol}</span><span style={{fontSize:10,color:C.cinzaChumbo}}>{r.dept}</span></div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}>
                    <div style={{flex:1,height:4,borderRadius:2,background:`${r.sla>=70?C.verdeFloresta:r.sla>=50?C.amareloEscuro:C.danger}20`}}><div style={{height:4,borderRadius:2,background:r.sla>=70?C.verdeFloresta:r.sla>=50?C.amareloEscuro:C.danger,width:`${r.sla}%`}}/></div>
                    <span style={{fontSize:9,fontFamily:Fn.mono,fontWeight:700,color:r.sla>=70?C.verdeFloresta:r.sla>=50?C.amareloEscuro:C.danger,minWidth:30,textAlign:"right"}}>{r.sla}%</span>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:10,borderTop:`1px solid ${C.cardBorder}`}}>
                    <span style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:10,fontWeight:600,color:PRIO_COLOR[r.priority]}}><span style={{width:5,height:5,borderRadius:"50%",background:PRIO_COLOR[r.priority]}}/>{r.priority}</span>
                    <span style={{fontSize:12,fontFamily:Fn.mono,fontWeight:700,color:C.cinzaEscuro}}>R$ {r.valor.toLocaleString("pt-BR")}</span>
                  </div>
                </div>
              )})}
            </div>}

            {/* Footer — mesma anatomia do footer do <Table> governado (TableDoc.tsx:320-343):
                faixa C.bg, range à esquerda, "Linhas:" + nav ‹ 1 2 3 4 › à direita. */}
            <div style={{padding:"10px 16px",borderTop:`1px solid ${C.cardBorder}`,background:C.bg,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap",fontSize:11,color:C.cinzaChumbo,fontFamily:Fn.body}}>
              <span style={{fontSize:11,color:C.textMuted}}>Mostrando 1–{data.length} de 247 registros {selected.size>0&&<>· <strong style={{color:C.cinzaEscuro}}>{selected.size} selecionado{selected.size>1?"s":""}</strong></>}</span>
              <div style={{display:"flex",alignItems:"center",gap:8,marginLeft:"auto"}}>
                <div style={{display:"flex",alignItems:"center",gap:4}}>
                  <span style={{fontSize:11,color:C.textMuted}}>Linhas:</span>
                  <select defaultValue={10} style={{padding:"2px 4px",fontSize:11,border:`1px solid ${C.cardBorder}`,borderRadius:4,background:C.cardBg,color:C.cinzaEscuro,fontFamily:Fn.body,cursor:"pointer"}}>
                    {[10,25,50].map(n=><option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <button style={{padding:"4px 10px",fontSize:11,fontWeight:600,fontFamily:Fn.body,background:"transparent",color:C.textLight,border:`1px solid ${C.cardBorder}`,borderRadius:5,cursor:"default",transition:"all .15s"}}>‹</button>
                {[1,2,3,4].map(p=>(
                  <button key={p} style={{width:24,height:24,fontSize:11,fontWeight:p===1?700:400,fontFamily:Fn.body,background:p===1?C.azulProfundo:"transparent",color:p===1?C.branco:C.cinzaChumbo,border:p===1?"none":`1px solid ${C.cardBorder}`,borderRadius:5,cursor:"pointer"}}>{p}</button>
                ))}
                <button style={{padding:"4px 10px",fontSize:11,fontWeight:600,fontFamily:Fn.body,background:C.cardBg,color:C.azulProfundo,border:`1px solid ${C.azulCeu}`,borderRadius:5,cursor:"pointer",transition:"all .15s"}}>›</button>
              </div>
            </div>
          </div>
          </CopyableInline>
        </Section>

        {/* ═══ 02 — Header do Painel ═══ */}
        <Section n="02" title="Header do Painel" desc="Faixa navy no topo do painel — identidade do sistema. Sempre presente, à esquerda ícone + título + subtítulo, à direita o CTA principal de criação. Usa o gradient navy padrão FIPS com JunctionLines decorativas.">
          <div style={{background:C.cardBg,borderRadius:"10px 10px 10px 18px",border:`1px solid ${C.cardBorder}`,padding:mob?16:24,boxShadow:"0 1px 3px rgba(0,75,155,.04)"}}>
            {/* Mini exemplo do header */}
            <div style={{background:dark?`linear-gradient(135deg,#1e2a3a 0%,#162030 50%,#1a2840 100%)`:`linear-gradient(135deg,${C.gradFrom} 0%,${C.gradTo} 60%,#001A4A 100%)`,borderRadius:"10px 10px 10px 18px",padding:"18px 22px",position:"relative",overflow:"hidden",marginBottom:18,border:dark?"1px solid rgba(147,189,228,0.08)":"none",boxShadow:dark?"0 4px 16px rgba(0,0,0,.3),inset 0 1px 0 rgba(255,255,255,.04)":"none"}}>
              <JunctionLines style={{position:"absolute",top:-10,right:-20,width:300,height:180,opacity:dark?.04:.06}}/>
              <div style={{position:"relative",display:"flex",alignItems:"center",gap:14}}>
                <div style={{width:44,height:44,borderRadius:11,background:`${C.amareloOuro}18`,border:`1px solid ${C.amareloOuro}30`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{Ic.inbox(20,C.amareloOuro)}</div>
                <div style={{flex:1,minWidth:0}}>
                  <h3 style={{fontSize:18,fontWeight:700,color:C.branco,fontFamily:Fn.title,margin:0,lineHeight:1.15}}>Sistema de Requisições</h3>
                  <p style={{fontSize:11,color:`${C.branco}AA`,fontFamily:Fn.body,margin:"3px 0 0",lineHeight:1.4}}>Gestão de compras · Suprimentos FIPS</p>
                </div>
                <span className="ds-btn-wrap" style={{flexShrink:0}}>
                  <button style={{display:"inline-flex",alignItems:"center",justifyContent:"center",gap:7,padding:"6px 14px",height:30,fontSize:12,fontWeight:600,fontFamily:Fn.body,borderRadius:6,border:"1.5px solid transparent",background:C.amareloEscuro,color:C.branco,cursor:"pointer",letterSpacing:"0.01em"}}>{Ic.plus(13,C.branco)} Nova Solicitação</button>
                </span>
              </div>
            </div>
            {/* Anatomia: 4 elementos */}
            <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:12}}>
              {[
                {n:"①",label:"Container navy",desc:"Gradient azulProfundo → azulEscuro → #001A4A. JunctionLines decorativas. borderRadius FIPS 12 12 12 24. Box-shadow soft."},
                {n:"②",label:"Ícone 44×44",desc:"Container quadrado borderRadius 11, fundo amareloOuro18, borda amareloOuro30. Ícone do sistema em amareloOuro 20px."},
                {n:"③",label:"Título + Subtítulo",desc:"Saira Expanded 21/700 branco. Subtítulo Open Sans 12 branco AA. Identifica o sistema/módulo."},
                {n:"④",label:"CTA Destaque",desc:"DSButton variant accent (laranja) size small com shimmer. Sempre criação de novo registro: 'Nova X'."},
              ].map((it,i)=>(
                <div key={i} style={{padding:12,background:C.bg,borderRadius:8,display:"flex",gap:10,alignItems:"flex-start"}}>
                  <span style={{fontSize:14,fontWeight:800,color:C.amareloEscuro,fontFamily:Fn.title}}>{it.n}</span>
                  <div><div style={{fontSize:12,fontWeight:700,color:C.cinzaEscuro}}>{it.label}</div><div style={{fontSize:11,color:C.cinzaChumbo,marginTop:2,lineHeight:1.5}}>{it.desc}</div></div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ═══ 03 — Cards do Painel ═══ */}
        <Section n="03" title="Cards do Painel" desc="Bloco de cards entre o Header e a Toolbar. Por padrão usa CardKPI com sparkline, mas qualquer card do catálogo de Cards pode ser usado dependendo do contexto: Status, Relatório, Princípio, Resumo, Ação, Lista. Sempre 4 cards (2×2 mobile).">

          {/* Tipo padrão: KPI explicado */}
          <div style={{background:C.cardBg,borderRadius:"10px 10px 10px 18px",border:`1px solid ${C.cardBorder}`,padding:18,boxShadow:"0 1px 3px rgba(0,75,155,.04)",marginBottom:14}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
              <div style={{width:32,height:32,borderRadius:9,background:`${C.amareloOuro}18`,border:`1px solid ${C.amareloOuro}40`,display:"flex",alignItems:"center",justifyContent:"center"}}>{Ic.checkCircle(15,C.amareloEscuro)}</div>
              <div>
                <div style={{fontSize:9,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.amareloEscuro,fontFamily:Fn.title}}>Padrão recomendado</div>
                <div style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>CardKPI com sparkline area chart</div>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr 1fr",gap:12}}>
              {[
                {title:"Estrutura do card",color:C.azulProfundo,items:["Label superior (11px cinzaChumbo 600)","Valor principal (Saira 24/800 azulEscuro)","Delta % verde com seta arrowUp","Ícone colorido 36×36 no canto top-right","Sparkline area chart embaixo (full bleed)"]},
                {title:"Sparkline interativo",color:C.verdeFloresta,items:["12 pontos (mensais por padrão)","Linha + área com gradiente da cor do KPI","Hit areas invisíveis sobre cada ponto","Hover mostra dot crescendo + linha vertical","Header substitui valor por valor do mês"]},
                {title:"Regras",color:C.amareloEscuro,items:["Sempre 4 cards (2×2 mobile)","Agregados de toda a base","Spread visível em todas as séries","Cores semânticas","Delta comparativo ao período anterior"]},
              ].map((r,i)=>(
                <div key={i} style={{padding:12,background:C.bg,borderRadius:8}}>
                  <div style={{fontSize:11,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title,marginBottom:6}}>{r.title}</div>
                  <div style={{display:"flex",flexDirection:"column",gap:4}}>
                    {r.items.map((item,j)=>(
                      <div key={j} style={{display:"flex",alignItems:"flex-start",gap:6,fontSize:10,color:C.cinzaEscuro,lineHeight:1.45}}>
                        <span style={{color:r.color,fontWeight:700,marginTop:1}}>•</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Outros tipos de cards disponíveis */}
          <div style={{background:C.cardBg,borderRadius:"10px 10px 10px 18px",border:`1px solid ${C.cardBorder}`,padding:18,boxShadow:"0 1px 3px rgba(0,75,155,.04)"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,flexWrap:"wrap",gap:10}}>
              <div>
                <div style={{fontSize:9,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.cinzaChumbo,fontFamily:Fn.title}}>Outros tipos disponíveis no catálogo</div>
                <div style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>Qualquer card do arquivo Cards pode ser usado</div>
              </div>
              <a href="https://design-system.fips.app.br/card" target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:6,padding:"7px 14px",fontSize:11,fontWeight:600,fontFamily:Fn.body,color:C.cinzaEscuro,background:"transparent",border:`1.5px solid ${C.azulProfundo}`,borderRadius:6,cursor:"pointer",textDecoration:"none",transition:"all .15s",letterSpacing:"0.01em"}} onMouseEnter={e=>{e.currentTarget.style.background=dark?"rgba(147,189,228,0.12)":"#D3E3F4"}} onMouseLeave={e=>{e.currentTarget.style.background="transparent"}}>Navegar mais detalhes {Ic.chev(11,C.azulProfundo)}</a>
            </div>
            <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr 1fr",gap:10}}>
              {[
                {n:"CardKPI",label:"KPI com sparkline",desc:"Métrica numérica com tendência. Padrão deste painel.",color:C.azulProfundo,icon:Ic.inbox},
                {n:"CardStatus",label:"Status percentual",desc:"Valor + delta + barra/donut de proporção.",color:C.verdeFloresta,icon:Ic.checkCircle},
                {n:"CardRelatorio",label:"Relatório simples",desc:"Label, valor, subtítulo e ícone. Sem sparkline.",color:C.azulEscuro,icon:Ic.list},
                {n:"CardPrincipio",label:"Princípio operacional",desc:"Stripe colorida + ícone central + título + descrição.",color:C.amareloEscuro,icon:Ic.filter},
                {n:"CardResumo",label:"Resumo com badges",desc:"Título, descrição, badges e footer customizável.",color:C.azulClaro,icon:Ic.doc},
                {n:"CardLista",label:"Lista de itens",desc:"Lista vertical com label + valor por linha.",color:C.cinzaChumbo,icon:Ic.list},
              ].map((c,i)=>(
                <div key={i} style={{padding:14,background:C.bg,borderRadius:8,border:`1px solid ${C.cardBorder}`,display:"flex",flexDirection:"column",gap:8,transition:"all .15s",cursor:"default"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=c.color;e.currentTarget.style.background=alpha(c.color,0.024)}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.cardBorder;e.currentTarget.style.background=C.bg}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:28,height:28,borderRadius:7,background:alpha(c.color,0.08),display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{c.icon(14,c.color)}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:11,fontFamily:Fn.mono,fontWeight:700,color:c.color}}>{c.n}</div>
                      <div style={{fontSize:10,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>{c.label}</div>
                    </div>
                  </div>
                  <div style={{fontSize:10,color:C.cinzaChumbo,lineHeight:1.5}}>{c.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ═══ 04 — Toolbar ═══ */}
        <Section n="04" title="Toolbar" desc="Card próprio entre KPIs e Table. Esquerda agrupa filtros e busca (manipulação de dados). Direita agrupa exportações. Spacer no meio empurra os grupos pras pontas. Card minimal com mesmo borderRadius FIPS.">
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:12}}>
            {[
              {title:"Esquerda — Manipulação",icon:Ic.filter,color:C.azulProfundo,items:["Filtros (multi-select popover)","Busca (DSInput desktop com focus state)","Período (single-select com Personalizado)","Botões agrupados, gap 10","Próximos da entrada de dados"]},
              {title:"Direita — Exportação",icon:Ic.excel,color:"#1D6F42",items:["Excel (botão 32.5×32.5, ícone verde)","PDF (botão 32.5×32.5, ícone vermelho)","Hover suave com cor da extensão","Sem labels — só ícones com tooltip","Ações de saída de dados · ExportButtons"]},
              {title:"Padrão visual",icon:Ic.list,color:C.amareloEscuro,items:["Card próprio com borderRadius FIPS","Padding 14px 18px","display:flex flexWrap:wrap","Spacer central com flex:1","marginBottom 14 antes da Table"]},
              {title:"Filtros oficiais",icon:Ic.calendar,color:C.verdeFloresta,items:["Multi-select (popover com 3 grupos)","Single-select (dropdown com radio)","Período suporta presets + Personalizado","Personalizado abre 2 inputs date","Contador no botão quando há filtros"]},
            ].map((r,i)=>(
              <div key={i} style={{background:C.cardBg,borderRadius:"10px 10px 10px 18px",border:`1px solid ${C.cardBorder}`,padding:18,boxShadow:"0 1px 3px rgba(0,75,155,.04)"}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                  <div style={{width:32,height:32,borderRadius:9,background:alpha(r.color,0.06),display:"flex",alignItems:"center",justifyContent:"center"}}>{r.icon(16,r.color)}</div>
                  <span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>{r.title}</span>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {r.items.map((item,j)=>(
                    <div key={j} style={{display:"flex",alignItems:"flex-start",gap:8,fontSize:11,color:C.cinzaEscuro,lineHeight:1.5}}>
                      <span style={{color:r.color,fontWeight:700,marginTop:1}}>•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ═══ 05 — Table ═══ */}
        <Section n="05" title="Table" desc="Card final do padrão. Header obrigatório com ícone, título e subtítulo à esquerda. À direita: badge Filtrado, toggle Tabela/Card e botão Configurar. Body com tabela densa, footer com paginação completa.">
          <div style={{background:C.cardBg,borderRadius:"10px 10px 10px 18px",border:`1px solid ${C.cardBorder}`,padding:24,boxShadow:"0 1px 3px rgba(0,75,155,.04)",marginBottom:14}}>
            {/* Toggle Tabela/Card interativo */}
            <div style={{fontSize:9,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.cinzaChumbo,fontFamily:Fn.title,marginBottom:10}}>Toggle Tabela / Card</div>
            <div style={{display:"flex",justifyContent:"center",marginBottom:16}}>
              <div style={{display:"flex",gap:3,padding:3,background:C.bg,borderRadius:8,border:`1px solid ${C.cardBorder}`}}>
                <button onClick={()=>setViewDemo("table")} style={{display:"inline-flex",alignItems:"center",gap:5,padding:"6px 14px",fontSize:12,fontWeight:600,color:viewDemo==="table"?C.azulProfundo:C.cinzaChumbo,background:viewDemo==="table"?C.cardBg:"transparent",border:"none",borderRadius:6,cursor:"pointer",fontFamily:Fn.body,boxShadow:viewDemo==="table"?"0 1px 2px rgba(0,42,104,.08)":"none",transition:"all .15s"}}>{Ic.list(13,viewDemo==="table"?C.azulProfundo:C.cinzaChumbo)} Tabela</button>
                <button onClick={()=>setViewDemo("cards")} style={{display:"inline-flex",alignItems:"center",gap:5,padding:"6px 14px",fontSize:12,fontWeight:600,color:viewDemo==="cards"?C.azulProfundo:C.cinzaChumbo,background:viewDemo==="cards"?C.cardBg:"transparent",border:"none",borderRadius:6,cursor:"pointer",fontFamily:Fn.body,boxShadow:viewDemo==="cards"?"0 1px 2px rgba(0,42,104,.08)":"none",transition:"all .15s"}}>{Ic.grid(13,viewDemo==="cards"?C.azulProfundo:C.cinzaChumbo)} Cards</button>
              </div>
            </div>
            <div style={{padding:"12px 14px",background:C.bg,borderRadius:8,marginBottom:18,display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:32,height:32,borderRadius:8,background:alpha(C.azulProfundo,0.06),display:"flex",alignItems:"center",justifyContent:"center"}}>{viewDemo==="table"?Ic.list(16,C.azulProfundo):Ic.grid(16,C.azulProfundo)}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:11,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>Estado: <span style={{color:C.cinzaEscuro}}>{viewDemo==="table"?"Tabela":"Cards"}</span></div>
                <div style={{fontSize:10,color:C.cinzaChumbo,marginTop:2}}>{viewDemo==="table"?"Linhas estruturadas — análise comparativa":"Grid de cards — leitura rápida em mobile"}</div>
              </div>
            </div>
            {/* Anatomia em 2 colunas */}
            <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:12}}>
              {[
                {n:"①",label:"Header obrigatório",desc:"Ícone 48×48 + título Saira 16/700 + subtítulo Open Sans 11. Sem exceções."},
                {n:"②",label:"Lado direito do header",desc:"Filtrado badge + Toggle Tabela/Card + botão Configurar."},
                {n:"③",label:"Body — Tabela densa",desc:"Sortable, zebra, hover, seleção em massa. Densidade ajustável."},
                {n:"④",label:"Configurar (3 abas)",desc:"Colunas (visível/oculta), Densidade (3 níveis), Aparência (4 toggles)."},
                {n:"⑤",label:"Footer — Paginação",desc:"Mostrando X-Y de Z + per-page selector + nav (primeira/anterior/páginas/próxima/última)."},
                {n:"⑥",label:"Estados",desc:"Empty, loading skeleton, erro, selecionado — todos obrigatórios."},
              ].map((it,i)=>(
                <div key={i} style={{padding:12,background:C.bg,borderRadius:8,display:"flex",gap:10,alignItems:"flex-start"}}>
                  <span style={{fontSize:14,fontWeight:800,color:C.amareloEscuro,fontFamily:Fn.title}}>{it.n}</span>
                  <div><div style={{fontSize:12,fontWeight:700,color:C.cinzaEscuro}}>{it.label}</div><div style={{fontSize:11,color:C.cinzaChumbo,marginTop:2,lineHeight:1.5}}>{it.desc}</div></div>
                </div>
              ))}
            </div>
          </div>
          {/* Botão Configurar — exemplo interativo */}
          <div style={{background:C.cardBg,borderRadius:"10px 10px 10px 18px",border:`1px solid ${C.cardBorder}`,padding:24,boxShadow:"0 1px 3px rgba(0,75,155,.04)",marginBottom:14}}>
            <div style={{fontSize:9,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.cinzaChumbo,fontFamily:Fn.title,marginBottom:10}}>Botão Configurar</div>
            <div style={{display:"flex",justifyContent:"center",marginBottom:16}}>
              <div ref={configDemoRef} style={{position:"relative"}}>
                <button onClick={()=>setShowConfigDemo(!showConfigDemo)} style={{display:"inline-flex",alignItems:"center",gap:6,padding:"7px 12px",fontSize:11,fontWeight:600,fontFamily:Fn.body,color:showConfigDemo?C.azulProfundo:C.cinzaEscuro,background:showConfigDemo?accentBg:C.cardBg,border:`1px solid ${showConfigDemo?C.azulProfundo:C.cardBorder}`,borderRadius:8,cursor:"pointer",transition:"all .15s"}}>{Ic.settings(14,showConfigDemo?C.azulProfundo:C.cinzaChumbo)} Configurar</button>
                {showConfigDemo&&<div style={{position:"absolute",top:"calc(100% + 6px)",left:"50%",transform:"translateX(-50%)",zIndex:50,width:300,background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:"10px 10px 10px 16px",boxShadow:"0 12px 36px rgba(0,42,104,.18),0 2px 8px rgba(0,42,104,.06)",animation:"popIn .18s ease",overflow:"hidden"}}>
                  <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.cardBorder}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>Configurações</span>
                    <button onClick={()=>setShowConfigDemo(false)} style={{width:22,height:22,background:"transparent",border:"none",cursor:"pointer",borderRadius:5,display:"flex",alignItems:"center",justifyContent:"center"}}>{Ic.x(12)}</button>
                  </div>
                  <div style={{display:"flex",borderBottom:`1px solid ${C.cardBorder}`,background:C.bg}}>
                    {[{id:"colunas",label:"Colunas",icon:Ic.columns},{id:"densidade",label:"Densidade",icon:Ic.density},{id:"aparencia",label:"Aparência",icon:Ic.grid}].map(t=>(
                      <button key={t.id} onClick={()=>setConfigTab(t.id)} style={{flex:1,display:"inline-flex",alignItems:"center",justifyContent:"center",gap:5,padding:"9px 8px",fontSize:11,fontWeight:600,color:configTab===t.id?C.azulProfundo:C.cinzaChumbo,background:configTab===t.id?C.cardBg:"transparent",border:"none",borderBottom:`2px solid ${configTab===t.id?C.azulProfundo:"transparent"}`,cursor:"pointer",fontFamily:Fn.body,transition:"all .12s"}}>{t.icon(12,configTab===t.id?C.azulProfundo:C.cinzaChumbo)} {t.label}</button>
                    ))}
                  </div>
                  <div style={{padding:"14px 16px",minHeight:120,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <div style={{textAlign:"center"}}>
                      <div style={{width:36,height:36,borderRadius:9,background:alpha(C.azulProfundo,0.06),display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:8}}>{configTab==="colunas"?Ic.columns(18,C.azulProfundo):configTab==="densidade"?Ic.density(18,C.azulProfundo):Ic.grid(18,C.azulProfundo)}</div>
                      <div style={{fontSize:11,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>Aba {configTab==="colunas"?"Colunas":configTab==="densidade"?"Densidade":"Aparência"}</div>
                      <div style={{fontSize:10,color:C.cinzaChumbo,marginTop:2,maxWidth:220}}>{configTab==="colunas"?"Visibilidade e ordem das colunas":configTab==="densidade"?"Altura das linhas (3 níveis)":"Zebra, bordas, header fixo, wrap"}</div>
                    </div>
                  </div>
                  <div style={{padding:"10px 14px",borderTop:`1px solid ${C.cardBorder}`,background:C.bg,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <button style={{fontSize:10,color:C.cinzaChumbo,background:"transparent",border:"none",cursor:"pointer",fontFamily:Fn.body,fontWeight:600}}>Restaurar padrão</button>
                    <button onClick={()=>setShowConfigDemo(false)} style={{padding:"6px 12px",fontSize:11,fontWeight:700,color:C.branco,background:C.azulProfundo,border:"none",borderRadius:6,cursor:"pointer",fontFamily:Fn.body}}>Aplicar</button>
                  </div>
                </div>}
              </div>
            </div>
            <div style={{padding:"12px 14px",background:C.bg,borderRadius:8,marginBottom:18,display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:32,height:32,borderRadius:8,background:alpha(C.azulProfundo,0.06),display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{Ic.settings(16,C.azulProfundo)}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:11,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>{showConfigDemo?<>Popover aberto · Aba <span style={{color:C.cinzaEscuro}}>{configTab==="colunas"?"Colunas":configTab==="densidade"?"Densidade":"Aparência"}</span></>:"Clique no botão acima para abrir o popover"}</div>
                <div style={{fontSize:10,color:C.cinzaChumbo,marginTop:2}}>Popover ancorado no botão · 3 abas (Colunas, Densidade, Aparência) · Footer com Restaurar padrão e Aplicar · Fecha ao clicar fora</div>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:12}}>
              {[
                {n:"①",label:"Botão (estado normal)",desc:"Ícone sliders + label 'Configurar'. Border cardBorder, background branco, color cinzaEscuro. Padding 7×12, fontSize 11."},
                {n:"②",label:"Botão (estado ativo)",desc:"Quando o popover está aberto: border azulProfundo, background azulCeuClaro, ícone e texto em azulProfundo."},
                {n:"③",label:"Popover anchored",desc:"Position absolute top:calc(100% + 6px), right:0 (alinhado pela direita). Width 300, borderRadius FIPS, shadow elevada."},
                {n:"④",label:"3 abas no header",desc:"Tabs com ícone + label, ativa em azulProfundo com border-bottom 2px. Conteúdo trocado conforme aba selecionada."},
                {n:"⑤",label:"Footer com 2 ações",desc:"Restaurar padrão (link cinza à esquerda) + Aplicar (botão azulProfundo à direita). Aplicar fecha o popover."},
                {n:"⑥",label:"Click outside",desc:"Listener no document.mousedown verifica se o clique foi fora do ref do popover. Se sim, fecha automaticamente."},
              ].map((it,i)=>(
                <div key={i} style={{padding:12,background:C.bg,borderRadius:8,display:"flex",gap:10,alignItems:"flex-start"}}>
                  <span style={{fontSize:14,fontWeight:800,color:C.amareloEscuro,fontFamily:Fn.title}}>{it.n}</span>
                  <div><div style={{fontSize:12,fontWeight:700,color:C.cinzaEscuro}}>{it.label}</div><div style={{fontSize:11,color:C.cinzaChumbo,marginTop:2,lineHeight:1.5}}>{it.desc}</div></div>
                </div>
              ))}
            </div>
          </div>
          {/* Configurar — 3 abas explicativas */}
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr 1fr",gap:12}}>
            {[
              {title:"Aba Colunas",icon:Ic.columns,color:C.azulProfundo,items:["Lista todas as colunas disponíveis","Drag handle pra reordenar","Checkbox visível/oculta","Colunas fixas não podem ser ocultadas"]},
              {title:"Aba Densidade",icon:Ic.density,color:C.amareloEscuro,items:["Compacta (30px)","Normal (42px) — padrão","Confortável (56px)","Ajusta altura, fontSize e padding"]},
              {title:"Aba Aparência",icon:Ic.grid,color:C.verdeFloresta,items:["Linhas zebradas","Bordas verticais","Header fixo","Quebra de linha em texto longo"]},
            ].map((r,i)=>(
              <div key={i} style={{background:C.cardBg,borderRadius:"10px 10px 10px 18px",border:`1px solid ${C.cardBorder}`,padding:16,boxShadow:"0 1px 3px rgba(0,75,155,.04)"}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                  <div style={{width:30,height:30,borderRadius:8,background:alpha(r.color,0.06),display:"flex",alignItems:"center",justifyContent:"center"}}>{r.icon(14,r.color)}</div>
                  <span style={{fontSize:12,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>{r.title}</span>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:5}}>
                  {r.items.map((item,j)=>(
                    <div key={j} style={{display:"flex",alignItems:"flex-start",gap:6,fontSize:10,color:C.cinzaEscuro,lineHeight:1.5}}>
                      <span style={{color:r.color,fontWeight:700,marginTop:1}}>•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ═══ 06 — Regras gerais ═══ */}
        <Section n="06" title="Regras gerais do Painel" desc="Diretrizes obrigatórias para qualquer Painel de Relatório no DS-FIPS. A ordem dos elementos é fixa, não pode ser invertida nem ter elementos pulados.">
          {/* Card destacado com a ordem obrigatória */}
          <div style={{background:`linear-gradient(135deg,${alpha(C.azulProfundo,0.03)} 0%,${C.amareloOuro}10 100%)`,border:`2px solid ${C.amareloOuro}`,borderRadius:"12px 12px 12px 24px",padding:mob?16:20,marginBottom:14}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
              <div style={{width:34,height:34,borderRadius:9,background:C.amareloOuro,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{Ic.list(17,C.azulEscuro)}</div>
              <div>
                <div style={{fontSize:9,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.amareloEscuro,fontFamily:Fn.title}}>Regra #1 — Obrigatória</div>
                <div style={{fontSize:14,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>Ordem dos elementos do Painel</div>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:mob?6:10,flexWrap:"wrap",marginBottom:10}}>
              {["Header","KPIs","Toolbar","Table"].map((step,i)=>(
                <div key={step} style={{display:"flex",alignItems:"center",gap:mob?6:10}}>
                  <div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"6px 12px",background:C.cardBg,border:`1.5px solid ${C.azulProfundo}`,borderRadius:8,fontSize:11,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.body}}>
                    <span style={{fontSize:9,fontFamily:Fn.mono,opacity:.6}}>{`0${i+1}`}</span>
                    {step}
                  </div>
                  {i<3&&<span style={{color:C.cinzaChumbo,fontSize:14,fontWeight:700}}>→</span>}
                </div>
              ))}
            </div>
            <p style={{fontSize:11,color:C.cinzaEscuro,margin:0,lineHeight:1.55}}>Sempre nessa ordem, nunca invertida. Elementos podem ser ocultados em casos específicos (ex: Painel sem KPIs), mas a sequência dos elementos visíveis deve respeitar essa ordem.</p>
          </div>

          {/* Demais regras */}
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:12}}>
            {[
              {t:"Quando usar este Painel",d:"Sempre que precisar exibir dados administrativos com 4 elementos: ações principais (Header), métricas agregadas (KPIs), manipulação de dados (Toolbar) e listagem detalhada (Table). Ex: Painel de Requisições, Ações, Ocorrências."},
              {t:"Header obrigatório no Card",d:"Toda Table dentro do painel precisa de header próprio com ícone (48×48), título (Saira 16/700) e subtítulo (Open Sans 11). Sem exceções — é a identidade do dataset, distinto do Header navy do painel."},
              {t:"4 KPIs sempre",d:"Bloco de KPIs sempre tem 4 cards (2×2 mobile). Agregados de TODA a base, não da página. Sparkline area chart obrigatório com hover interativo. Sem linha reta — todas as séries com spread visível."},
              {t:"Toolbar separada",d:"Card próprio entre KPIs e Table. Esquerda agrupa Filtros + Busca + Período. Direita agrupa Excel + PDF. Spacer central. Nunca colocar exportação à esquerda nem filtros à direita."},
              {t:"Densidade padrão Normal",d:"Tabela inicia em Normal (42px). Compacta só para power users em telas com 1000+ registros. Confortável para apresentações ou acessibilidade."},
              {t:"Colunas fixas",d:"Pelo menos uma coluna identificadora (Código/ID) e a coluna Ações devem ser fixas. Não podem ser desabilitadas pelo usuário no botão Configurar."},
              {t:"Persistência por usuário",d:"Preferências de Colunas, Densidade, Aparência e Filtros devem persistir por usuário (localStorage ou backend), não por sessão."},
              {t:"Header navy = identidade",d:"O Header navy do painel mostra o sistema (ex: Sistema de Requisições) — não o conteúdo. Subtítulo descreve o módulo. CTA Destaque sempre cria novo registro."},
            ].map((r,i)=>(
              <div key={i} style={{background:C.cardBg,borderRadius:"10px 10px 10px 18px",border:`1px solid ${C.cardBorder}`,padding:16,boxShadow:"0 1px 3px rgba(0,75,155,.04)"}}>
                <div style={{fontSize:12,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title,marginBottom:6}}>{r.t}</div>
                <div style={{fontSize:11,color:C.cinzaChumbo,lineHeight:1.55}}>{r.d}</div>
              </div>
            ))}
          </div>
        </Section>

        <CodePlayground />

        <CodeExportSection items={[
          {
            label: 'Data Listing Pattern',
            description: 'Toolbar + Tabela paginada com header, KPIs, filtros e acoes contextuais.',
            code: `/* Data Listing Pattern — DS-FIPS
   Ordem: Header Navy > KPIs > Toolbar > Table
   Nunca inverter a sequencia.

   Tokens:
   --color-gov-gradient-from / --color-gov-gradient-to (header)
   --color-surface / --color-surface-muted (cards/bg)
   --color-border (bordas)
   --color-primary / --color-accent-strong / --color-success / --color-danger
   Fontes: Saira Expanded (titulos), Open Sans (corpo), Fira Code (IDs/valores)
*/

function DataListingPage() {
  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh' }}>
      {/* Header Navy — icone + titulo + subtitulo + CTA */}
      <div style={{
        background: 'linear-gradient(135deg, var(--color-gov-gradient-from), var(--color-gov-gradient-to))',
        borderRadius: '12px 12px 12px 24px',
        padding: '22px 26px', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <h2 style={{ fontFamily: "'Saira Expanded',sans-serif", fontSize: 21, fontWeight: 700, margin: 0 }}>
            Sistema de Requisicoes
          </h2>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.67)', margin: '4px 0 0' }}>
            Gestao de compras e requisicoes
          </p>
        </div>
        <button style={{
          background: '#F6921E', color: '#fff', border: 'none',
          borderRadius: 6, padding: '6px 14px', fontSize: 12, fontWeight: 600,
        }}>
          + Nova Solicitacao
        </button>
      </div>

      {/* Toolbar — Filtros | Busca | Periodo || Excel | PDF */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '12px 12px 12px 24px',
        padding: '12px 20px', margin: '16px 0',
        display: 'flex', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {/* Select filtros + Input busca + DateRange */}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {/* Btn Excel + Btn PDF */}
        </div>
      </div>

      {/* Table — border-radius caixa, header proprio */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '12px 12px 12px 24px',
        overflow: 'hidden',
      }}>
        {/* Table header: icone 48x48 + titulo + subtitulo */}
        {/* Table body: zebra, avatar, badges, acoes */}
        {/* Pagination: items/pagina + navegacao */}
      </div>
    </div>
  )
}

/* Regras:
   - Densidade padrao Normal (42px row height)
   - Pelo menos 1 coluna fixa (ID) + coluna Acoes fixa
   - Persistencia por usuario (localStorage ou backend)
   - Badges de status com dot colorido
*/`,
          },
        ]} />

        <div style={{textAlign:"center",padding:"24px 0 0",marginTop:24}}>
          <span style={{fontSize:11,color:C.cinzaChumbo,letterSpacing:".5px",fontFamily:Fn.title}}>DS-FIPS v2.0 · Data List · Ferrovia Interna do Porto de Santos · {new Date().getFullYear()}</span>
        </div>
      </div>
    </div>
    </PlaygroundProvider>
  );
}
