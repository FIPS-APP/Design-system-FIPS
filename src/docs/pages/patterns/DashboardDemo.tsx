import { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { CodeExportSection } from '../../components/CodeExport'
import { PlaygroundProvider, Copyable, CodePlayground } from '../../components/CodePlayground'
import { LuLayoutGrid, LuCircleCheck, LuClock, LuTriangleAlert, LuFileText, LuList, LuChartColumnIncreasing, LuArrowUp, LuArrowDown, LuX, LuBuilding2, LuCalendar, LuUser, LuFlag, LuFileSpreadsheet, LuFileDown, LuChevronDown } from "react-icons/lu";
import * as echarts from "echarts/core";
import { PieChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([PieChart, CanvasRenderer]);
import { useFipsTheme } from '../../../hooks/useFipsTheme';

const C={azulProfundo:"#004B9B",azulEscuro:"#002A68",azulClaro:"#658EC9",cinzaChumbo:"var(--color-fg-muted)",cinzaEscuro:"var(--color-fg)",cinzaClaro:"#C0CCD2",azulCeu:"#93BDE4",azulCeuClaro:"#D3E3F4",amareloOuro:"#FDC24E",amareloEscuro:"#F6921E",verdeFloresta:"#00C64C",verdeEscuro:"#00904C",danger:"#DC3545",neutro:"var(--color-surface-soft)",branco:"#FFFFFF",bg:"var(--color-surface-muted)",cardBg:"var(--color-surface)",cardBorder:"var(--color-border)",textMuted:"var(--color-fg-muted)",textLight:"var(--color-fg-muted)"};
const Fn={title:"'Saira Expanded',sans-serif",body:"'Open Sans',sans-serif",mono:"'Fira Code',monospace"};


function JunctionLines({style}:{style?:React.CSSProperties}){return <svg viewBox="0 0 320 200" fill="none" style={{opacity:.12,...style}}><path d="M0 60H100C120 60 120 60 140 40L200 40H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/><path d="M0 60H100C120 60 120 60 140 80L200 80H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/><path d="M0 120H60C80 120 80 120 100 100L160 100H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/><path d="M0 120H60C80 120 80 120 100 140L160 140H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/></svg>}

function Donut({pct,color,size=48,stroke=4}:{pct:number,color:string,size?:number,stroke?:number}){
  const ref=useRef<HTMLDivElement>(null);
  const chartRef=useRef<echarts.ECharts|null>(null);
  useEffect(()=>{
    if(!ref.current)return;
    const chart=echarts.init(ref.current,undefined,{width:size,height:size});
    chartRef.current=chart;
    return ()=>{chart.dispose();chartRef.current=null};
  },[size]);
  useEffect(()=>{
    const inner=(size-stroke*2)/2-stroke,outer=(size-stroke)/2,c=size/2-1;
    chartRef.current?.setOption({
      series:[{
        type:"pie",
        radius:[inner,outer],
        center:[c,c],
        startAngle:90,
        silent:true,
        animation:false,
        label:{show:false},
        labelLine:{show:false},
        itemStyle:{borderWidth:0},
        data:[{value:pct,itemStyle:{color}},{value:100-pct,itemStyle:{color:`${color}18`}}],
      }],
    });
  },[pct,color,size,stroke]);
  return <div ref={ref} style={{width:size,height:size}}/>;
}

const BV_LIGHT: Record<string,{bg:string,color:string,border:string}>={Finalizada:{bg:"#ECFDF5",color:C.verdeEscuro,border:"#A7F3D0"},Aguardando:{bg:"#FFF7ED",color:"#C2410C",border:"#FDBA74"},Recusada:{bg:"#FEF2F2",color:"#B91C1C",border:"#FECACA"},"Em análise":{bg:C.azulCeuClaro,color:C.azulEscuro,border:C.azulCeu}};
const BV_DARK: Record<string,{bg:string,color:string,border:string}>={Finalizada:{bg:"rgba(0,198,76,0.14)",color:"#8BE5AD",border:"rgba(0,198,76,0.28)"},Aguardando:{bg:"rgba(246,146,30,0.14)",color:"#FDC24E",border:"rgba(246,146,30,0.28)"},Recusada:{bg:"rgba(239,68,68,0.14)",color:"#FCA5A5",border:"rgba(239,68,68,0.28)"},"Em análise":{bg:"rgba(147,189,228,0.14)",color:"#93BDE4",border:"rgba(147,189,228,0.28)"}};
function Badge({variant,children,dot}:{variant:string,children:React.ReactNode,dot?:boolean}){const{dark}=useFipsTheme();const BV=dark?BV_DARK:BV_LIGHT;const v=BV[variant]||BV.Finalizada;return <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"2px 6px",fontSize:10,fontWeight:600,fontFamily:Fn.body,color:v.color,background:v.bg,border:`1px solid ${v.border}`,borderRadius:4,whiteSpace:"nowrap"}}>{dot&&<span style={{width:5,height:5,borderRadius:"50%",background:v.color}}/>}{children}</span>}
function MiniProgress({value=0}:{value?:number}){const color=value>=90?C.verdeEscuro:value>=60?C.verdeFloresta:value>=30?C.amareloEscuro:C.danger;return <div style={{display:"flex",alignItems:"center",gap:6}}><div style={{flex:1,height:4,borderRadius:2,background:`${color}20`}}><div style={{height:4,borderRadius:2,background:color,width:`${value}%`}}/></div><span style={{fontSize:10,fontWeight:600,color,fontFamily:Fn.mono,minWidth:28,textAlign:"right"}}>{value}%</span></div>}

/* ═══════════════════════════════════════════ DATASET ═══════════════════════════════════════════ */
const MONTHS=["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
const YEARS=["2025","2026"];
const DEPTS=["SSMA","Operações","Logística","TI","RH","Financeiro"];
const STATUSES=["Finalizada","Aguardando","Recusada","Em análise"];
const PRIORITIES=["Crítica","Alta","Média","Baixa"];
const NAMES=["Carlos Santos","Ana Costa","Marcos Oliveira","Julia Ferreira","Pedro Lima","Lucia Mendes","Rafael Souza","Camila Rocha"];
const STATUS_COLOR: Record<string,string>={Finalizada:C.verdeFloresta,Aguardando:C.amareloEscuro,Recusada:C.danger,"Em análise":C.azulCeu};
const DEPT_COLOR: Record<string,string>={SSMA:C.azulProfundo,Operações:C.azulCeu,Logística:C.verdeFloresta,TI:C.amareloEscuro,RH:C.cinzaChumbo,Financeiro:C.azulClaro};
const PRIO_COLOR: Record<string,string>={Crítica:C.danger,Alta:C.amareloEscuro,Média:C.azulProfundo,Baixa:C.verdeFloresta};

interface Row { id:string; year:string; month:string; dept:string; status:string; priority:string; sla:number; valor:number; sol:string; data:string; }

function seed(): Row[]{
  const rows: Row[]=[];
  let id=3000;
  YEARS.forEach(year=>{
    for(let m=0;m<12;m++){
      const n=15+Math.floor(Math.random()*25);
      for(let j=0;j<n;j++){
        id++;
        rows.push({id:`REQ-${id}`,year,month:MONTHS[m],dept:DEPTS[Math.floor(Math.random()*DEPTS.length)],status:STATUSES[Math.floor(Math.random()*STATUSES.length)],priority:PRIORITIES[Math.floor(Math.random()*PRIORITIES.length)],sla:Math.floor(40+Math.random()*60),valor:Math.floor(500+Math.random()*15000),sol:NAMES[Math.floor(Math.random()*NAMES.length)],data:`${String(1+Math.floor(Math.random()*28)).padStart(2,"0")}/${String(m+1).padStart(2,"0")}/${year}`});
      }
    }
  });
  return rows;
}

/* ═══════════════════ DSSelect ═══════════════════ */
/* Chip de filtro — 32.5px, dropdown com radio (padrão da toolbar: DataListingDemo/ChipSelect real do Governança BI).
   Substitui o antigo DSSelect (box rotulado, label acima) na barra de filtros. */
function ChipSelect({label,value,onChange,options,placeholder="Todos",icon}:{label:string,value:string|null,onChange:(v:string|null)=>void,options:string[],placeholder?:string,icon?:React.ReactNode}){
  const {dark}=useFipsTheme();
  const [open,setOpen]=useState(false);
  const ref=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    if(!open)return;
    const h=(e:MouseEvent)=>{if(ref.current&&!ref.current.contains(e.target as Node))setOpen(false)};
    document.addEventListener("mousedown",h);
    return()=>document.removeEventListener("mousedown",h);
  },[open]);
  const display=value||placeholder;
  const active=Boolean(value);
  const accent=dark?"#93BDE4":C.azulProfundo;
  return(
    <div ref={ref} style={{position:"relative"}}>
      <button type="button" onClick={()=>setOpen(v=>!v)} style={{display:"inline-flex",alignItems:"center",gap:6,padding:"7px 12px",fontSize:11,fontWeight:600,color:active?accent:C.cinzaEscuro,background:active?(dark?"rgba(147,189,228,0.10)":C.azulCeuClaro):C.cardBg,border:`1px solid ${open||active?accent:C.cardBorder}`,borderRadius:8,cursor:"pointer",fontFamily:Fn.body,boxShadow:open?`0 0 0 2px ${dark?"rgba(147,189,228,.25)":"rgba(0,75,155,.12)"}`:"none",transition:"all .15s",whiteSpace:"nowrap"}}>
        {icon&&<span style={{display:"flex",flexShrink:0,opacity:.7}}>{icon}</span>}
        <span style={{color:C.cinzaChumbo,flexShrink:0}}>{label}:</span>
        <span style={{fontWeight:700}}>{display}</span>
        <LuChevronDown size={11} color={C.cinzaChumbo} style={{flexShrink:0,transform:open?"rotate(180deg)":"none",transition:"transform .2s"}}/>
      </button>
      {open&&(
        <div role="listbox" style={{position:"absolute",left:0,top:"calc(100% + 6px)",zIndex:50,minWidth:180,maxHeight:280,overflowY:"auto",background:dark?"var(--color-surface)":C.branco,border:`1px solid ${C.cardBorder}`,borderRadius:"8px 8px 8px 14px",boxShadow:dark?"0 12px 36px rgba(0,0,0,.35)":"0 12px 36px rgba(0,42,104,.18),0 2px 8px rgba(0,42,104,.06)",padding:"6px 0"}}>
          <div onClick={()=>{onChange(null);setOpen(false)}} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 14px",fontSize:11,fontWeight:!value?700:500,color:!value?accent:C.cinzaEscuro,cursor:"pointer",background:!value?(dark?"rgba(147,189,228,.14)":`${C.azulProfundo}10`):"transparent"}}>
            <ChipRadioDot active={!value} color={accent}/>{placeholder}
          </div>
          {options.map(o=>{
            const sel=o===value;
            return(
              <div key={o} onClick={()=>{onChange(o);setOpen(false)}} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 14px",fontSize:11,fontWeight:sel?700:500,color:sel?accent:C.cinzaEscuro,cursor:"pointer",background:sel?(dark?"rgba(147,189,228,.14)":`${C.azulProfundo}10`):"transparent"}}>
                <ChipRadioDot active={sel} color={accent}/>{o}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
function ChipRadioDot({active,color}:{active:boolean,color:string}){
  return <span style={{display:"flex",flexShrink:0,alignItems:"center",justifyContent:"center",width:14,height:14,borderRadius:"50%",border:`1.5px solid ${active?color:C.cardBorder}`}}>{active&&<span style={{width:6,height:6,borderRadius:"50%",background:color}}/>}</span>;
}

/* ═══════════════════ PDF Export ═══════════════════ */
function exportPDF(data: Row[], filters: Record<string,string|null>, totals: {valor:string}){
  const now=new Date();const dt=`${String(now.getDate()).padStart(2,"0")}/${String(now.getMonth()+1).padStart(2,"0")}/${now.getFullYear()} ${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
  const cols=["Código","Solicitante","Depto","Status","Prioridade","SLA (%)","Valor (R$)","Data"];
  const rows=data.map(r=>[r.id,r.sol,r.dept,r.status,r.priority,String(r.sla),r.valor.toLocaleString("pt-BR"),r.data]);
  const colW=[62,100,65,60,55,40,65,55];const pageW=595.28;const pageH=841.89;const mx=40;const headerH=90;const rowH=16;
  const maxRows=Math.floor((pageH-headerH-80)/rowH);const pages: string[][]=[];
  for(let i=0;i<rows.length;i+=maxRows)pages.push(rows.slice(i,i+maxRows).map(r=>r.join(",")));
  if(pages.length===0)pages.push([]);

  // Rebuild pages as array of row arrays for proper PDF generation
  const pageRows: string[][][]=[];
  for(let i=0;i<rows.length;i+=maxRows)pageRows.push(rows.slice(i,i+maxRows));
  if(pageRows.length===0)pageRows.push([]);

  let pdf="%PDF-1.4\n";const objs: {n:number,content:string}[]=[];
  function addObj(content:string){const n=objs.length+1;objs.push({n,content});return n;}
  const catRef=addObj("");const pagesRef=addObj("");
  const fontRef=addObj("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  const fontBRef=addObj("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");
  const pageRefs: number[]=[];

  pageRows.forEach((pRows,pi)=>{
    let s="BT\n";
    s+="0.016 0.169 0.392 rg\n";
    s+=`40 ${pageH-45} Td /FB 14 Tf (Painel de Requisicoes - FIPS) Tj\n`;
    s+="0.318 0.38 0.427 rg\n";
    s+=`40 ${pageH-60} Td /F1 9 Tf (Gerado em: ${dt}  |  Pagina ${pi+1} de ${pageRows.length}  |  ${data.length} registros) Tj\n`;
    const fArr: string[]=[];
    if(filters.year)fArr.push(`Ano: ${filters.year}`);if(filters.month)fArr.push(`Mes: ${filters.month}`);
    if(filters.dept)fArr.push(`Area: ${filters.dept}`);if(filters.sol)fArr.push(`Nome: ${filters.sol}`);
    if(filters.priority)fArr.push(`Prioridade: ${filters.priority}`);if(filters.status)fArr.push(`Status: ${filters.status}`);
    if(fArr.length>0){s+=`40 ${pageH-74} Td /F1 8 Tf (Filtros: ${fArr.join(" | ")}) Tj\n`;}
    s+="ET\n";
    const tTop=pageH-headerH;
    s+="0.878 0.894 0.925 rg\n";
    s+=`${mx} ${tTop-14} ${pageW-mx*2} 16 re f\n`;
    s+="BT\n0.016 0.169 0.392 rg\n";
    let cx=mx+4;
    cols.forEach((c,i)=>{s+=`${cx} ${tTop-11} Td /FB 7 Tf (${c}) Tj\n`;cx+=colW[i];});
    s+="ET\n";
    pRows.forEach((row,ri)=>{
      const ry=tTop-14-((ri+1)*rowH);
      if(ri%2===1){s+="0.949 0.957 0.973 rg\n";s+=`${mx} ${ry-2} ${pageW-mx*2} ${rowH} re f\n`;}
      s+="BT\n0.2 0.231 0.255 rg\n";
      let rx=mx+4;
      row.forEach((cell,ci)=>{s+=`${rx} ${ry+3} Td /F1 7 Tf (${cell}) Tj\n`;rx+=colW[ci];});
      s+="ET\n";
    });
    const fy=tTop-14-((pRows.length+1)*rowH)-8;
    s+="0.886 0.906 0.937 rg\n";s+=`${mx} ${fy} ${pageW-mx*2} 0.5 re f\n`;
    s+="BT\n0.318 0.38 0.427 rg\n";
    s+=`${mx} ${fy-12} Td /F1 7 Tf (Total: R$ ${totals.valor}  |  ${data.length} requisicoes  |  DS-FIPS v0.4.2 - Ferrovia Interna do Porto de Santos) Tj\n`;
    s+="ET\n";

    const streamRef=addObj(`<< /Length ${s.length} >>\nstream\n${s}endstream`);
    const pRef=addObj(`<< /Type /Page /Parent ${pagesRef} 0 R /MediaBox [0 0 ${pageW} ${pageH}] /Contents ${streamRef} 0 R /Resources << /Font << /F1 ${fontRef} 0 R /FB ${fontBRef} 0 R >> >> >>`);
    pageRefs.push(pRef);
  });

  objs[pagesRef-1].content=`<< /Type /Pages /Kids [${pageRefs.map(r=>`${r} 0 R`).join(" ")}] /Count ${pageRefs.length} >>`;
  objs[catRef-1].content=`<< /Type /Catalog /Pages ${pagesRef} 0 R >>`;

  const offsets: number[]=[];
  objs.forEach(o=>{offsets.push(pdf.length);pdf+=`${o.n} 0 obj\n${o.content}\nendobj\n`;});
  const xrefOff=pdf.length;
  pdf+=`xref\n0 ${objs.length+1}\n0000000000 65535 f \n`;
  offsets.forEach(off=>{pdf+=`${String(off).padStart(10,"0")} 00000 n \n`;});
  pdf+=`trailer\n<< /Size ${objs.length+1} /Root ${catRef} 0 R >>\nstartxref\n${xrefOff}\n%%EOF`;

  const blob=new Blob([pdf],{type:"application/pdf"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");a.href=url;a.download=`FIPS_Requisicoes_${now.getFullYear()}${String(now.getMonth()+1).padStart(2,"0")}${String(now.getDate()).padStart(2,"0")}.pdf`;
  document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(url);
}

/* ═══════════════════ ChartTooltip ═══════════════════ */
function ChartTooltip({title,color,rows,x,y,total}:{title:string,color:string,rows:{label:string,value:number,color?:string}[],x:number,y:number,total?:number}){
  const {dark:dk}=useFipsTheme();
  if(!rows)return null;
  const maxVal=Math.max(...rows.map(r=>r.value),1);
  return(
    <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:0.15,ease:"easeOut"}} style={{position:"fixed",left:x+12,top:y-10,zIndex:50,pointerEvents:"none"}}>
      <div style={{background:dk?"var(--color-surface)":C.branco,borderRadius:"8px 8px 8px 14px",border:`1px solid ${C.cardBorder}`,boxShadow:dk?"0 8px 30px rgba(0,0,0,.4),0 2px 8px rgba(0,0,0,.2)":"0 8px 30px rgba(0,42,104,.18),0 2px 8px rgba(0,0,0,.08)",minWidth:180,maxWidth:260,overflow:"hidden"}}>
        <div style={{background:color,padding:"8px 14px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span style={{fontSize:12,fontWeight:700,color:C.branco,fontFamily:Fn.title}}>{title}</span>
          {total!=null&&<span style={{fontSize:11,fontWeight:700,color:`${C.branco}CC`,fontFamily:Fn.mono}}>{total}</span>}
        </div>
        <div style={{padding:"8px 0"}}>
          {rows.map((r,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"4px 14px"}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:r.color||color,flexShrink:0}}/>
              <span style={{fontSize:11,color:C.cinzaEscuro,fontFamily:Fn.body,flex:1,whiteSpace:"nowrap"}}>{r.label}</span>
              <div style={{width:50,height:4,borderRadius:2,background:`${r.color||color}15`,flexShrink:0}}>
                <div style={{height:4,borderRadius:2,background:r.color||color,width:`${(r.value/maxVal)*100}%`}}/>
              </div>
              <span style={{fontSize:11,fontWeight:700,color:r.color||color,fontFamily:Fn.mono,minWidth:22,textAlign:"right"}}>{r.value}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

const KPI_META=[
  {label:"Solicitações",color:C.azulProfundo,breakdown:"status" as const,statusFilter:null as string|null,slaFilter:false},
  {label:"Finalizadas",color:C.verdeFloresta,breakdown:"dept" as const,statusFilter:"Finalizada",slaFilter:false},
  {label:"Aguardando",color:C.amareloEscuro,breakdown:"dept" as const,statusFilter:"Aguardando",slaFilter:false},
  {label:"Atrasadas",color:C.danger,breakdown:"priority" as const,statusFilter:null as string|null,slaFilter:true},
];
const STATUS_D_META=[
  {label:"Solicitadas",filterKey:null as string|null},
  {label:"Concluídas",filterKey:"Finalizada"},
  {label:"Em andamento",filterKey:"Aguardando"},
  {label:"Pendentes",filterKey:"Recusada"},
];
const DAYS_LABELS=["Seg","Ter","Qua","Qui","Sex"];

function getRowBreakdownValue(row: Row, breakdown: "status" | "dept" | "priority") {
  if (breakdown === "status") return row.status;
  if (breakdown === "dept") return row.dept;
  return row.priority;
}

/* ── Helper: código copy-paste-ready para o Playground ── */
function dashCode(part: 'kpi' | 'filters' | 'chart') {
  if (part === 'kpi') return `// DS-FIPS — KPI Card com Sparkline — Copy-paste ready
import { useState } from "react";

const KPIS = [
  { label: "Solicitações", value: "487", delta: "+12%", up: true, color: "#004B9B", spark: [12,18,14,22,28,25,32,30,35,38,42,48] },
  { label: "Finalizadas", value: "312", delta: "64%", up: true, color: "#00C64C", spark: [8,12,15,18,22,20,25,28,30,35,32,38] },
  { label: "Aguardando", value: "98", delta: "20%", up: false, color: "#F6921E", spark: [15,12,18,14,10,13,8,11,9,7,10,8] },
  { label: "Atrasadas", value: "77", delta: "16%", up: false, color: "#DC3545", spark: [5,8,6,10,12,9,14,11,15,13,10,8] },
];

export function KPICards() {
  const [hov, setHov] = useState(-1);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
      {KPIS.map((k, i) => {
        const max = Math.max(...k.spark), min = Math.min(...k.spark);
        const sw = 200, sh = 40;
        const pts = k.spark.map((v, j) => ({
          x: (j / (k.spark.length - 1)) * sw,
          y: sh - ((v - min) / (max - min || 1)) * (sh - 8) + 4,
        }));
        const line = pts.map(p => \`\${p.x},\${p.y}\`).join(" ");
        return (
          <div key={i}
            onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(-1)}
            style={{
              background: "#fff", border: "1px solid #E2E8F0",
              borderRadius: "10px 10px 10px 18px", overflow: "hidden",
              transform: hov === i ? "translateY(-2px)" : "none",
              boxShadow: hov === i ? "0 4px 16px rgba(0,75,155,0.1)" : "none",
              transition: "all 0.2s",
            }}>
            <div style={{ padding: "18px 20px 6px" }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#7B8C96", fontFamily: "'Open Sans', sans-serif" }}>{k.label}</span>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 8 }}>
                <span style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Saira Expanded', sans-serif", color: "#333B41" }}>{k.value}</span>
                <span style={{ fontSize: 10, fontWeight: 600, color: k.up ? "#00C64C" : "#DC3545" }}>
                  {k.up ? "↑" : "↓"} {k.delta}
                </span>
              </div>
            </div>
            <svg width="100%" height={sh + 16} viewBox={\`-2 -12 \${sw + 4} \${sh + 28}\`} preserveAspectRatio="none" style={{ display: "block" }}>
              <defs>
                <linearGradient id={\`g\${i}\`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={k.color} stopOpacity=".18" />
                  <stop offset="100%" stopColor={k.color} stopOpacity="0" />
                </linearGradient>
              </defs>
              <polygon points={\`0,\${sh} \${line} \${sw},\${sh}\`} fill={\`url(#g\${i})\`} />
              <polyline points={line} fill="none" stroke={k.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        );
      })}
    </div>
  );
}`;

  if (part === 'filters') return `// DS-FIPS — Barra de Filtros Dashboard — Copy-paste ready
import { useState } from "react";

function FilterSelect({ label, options, value, onChange }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <label style={{ fontSize: 10, fontWeight: 600, color: "#7B8C96", fontFamily: "'Open Sans', sans-serif" }}>{label}</label>
      <select
        value={value || ""}
        onChange={e => onChange(e.target.value || null)}
        style={{
          height: 32, padding: "0 10px", fontSize: 12, fontFamily: "'Open Sans', sans-serif",
          border: "1.5px solid #CBD5E1", borderRadius: 8, background: "#fff", color: "#333B41",
          cursor: "pointer", outline: "none",
        }}
      >
        <option value="">Todos</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

export function DashboardFilters() {
  const [filters, setFilters] = useState({ area: null, ano: null, mes: null, solicitante: null, prioridade: null, status: null });
  const setF = (key, val) => setFilters(f => ({ ...f, [key]: val }));

  return (
    <div style={{
      background: "#fff", borderRadius: "10px 10px 10px 18px",
      border: "1px solid #E2E8F0", padding: "14px 20px",
      boxShadow: "0 1px 3px rgba(0,75,155,0.04)",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#333B41", fontFamily: "'Saira Expanded', sans-serif" }}>Filtros</span>
        <button style={{
          fontSize: 10, fontWeight: 600, color: "#DC3545",
          background: "rgba(220,53,69,0.05)", border: "1px solid rgba(220,53,69,0.13)",
          borderRadius: 6, padding: "4px 10px", cursor: "pointer",
        }}>
          Relatório
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12 }}>
        <FilterSelect label="Área" options={["Operações","Financeiro","RH","TI","Comercial"]} value={filters.area} onChange={v => setF("area", v)} />
        <FilterSelect label="Ano" options={["2024","2025","2026"]} value={filters.ano} onChange={v => setF("ano", v)} />
        <FilterSelect label="Mês" options={["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"]} value={filters.mes} onChange={v => setF("mes", v)} />
        <FilterSelect label="Solicitante" options={["Ana","Carlos","Maria","Pedro"]} value={filters.solicitante} onChange={v => setF("solicitante", v)} />
        <FilterSelect label="Prioridade" options={["Crítica","Alta","Média","Baixa"]} value={filters.prioridade} onChange={v => setF("prioridade", v)} />
        <FilterSelect label="Status" options={["Aberta","Em andamento","Concluída","Cancelada"]} value={filters.status} onChange={v => setF("status", v)} />
      </div>
    </div>
  );
}`;

  return `// DS-FIPS — Chart Card (Barras por Mês) — Copy-paste ready
import { useState } from "react";

const MONTHS = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
const DATA = [32, 45, 28, 52, 61, 48, 55, 42, 67, 58, 72, 65];

export function BarChart() {
  const [hov, setHov] = useState(null);
  const max = Math.max(...DATA);
  const bw = 28, gp = 10, chartH = 100;

  return (
    <div style={{
      background: "#fff", border: "1px solid #E2E8F0",
      borderRadius: "10px 10px 10px 18px", overflow: "hidden",
      padding: 20, boxShadow: "0 1px 3px rgba(0,75,155,0.04)",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#333B41", fontFamily: "'Saira Expanded', sans-serif" }}>
          Solicitações por Mês
        </span>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <svg width={DATA.length * (bw + gp) - gp} height={chartH + 30}
          viewBox={\`0 -10 \${DATA.length * (bw + gp) - gp} \${chartH + 40}\`}>
          {DATA.map((v, i) => {
            const bh = Math.max(4, (v / max) * chartH);
            const x = i * (bw + gp);
            return (
              <g key={i} onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)} style={{ cursor: "pointer" }}>
                <rect x={x} y={chartH - bh} width={bw} height={bh} rx={5}
                  fill="#004B9B" opacity={hov === i ? 1 : 0.65} style={{ transition: "opacity 0.15s" }} />
                <text x={x + bw / 2} y={chartH - bh - 6} textAnchor="middle"
                  fontSize="10" fontWeight="700" fill="#002A68" fontFamily="'Fira Code', monospace">{v}</text>
                <text x={x + bw / 2} y={chartH + 14} textAnchor="middle"
                  fontSize="9" fill="#7B8C96" fontFamily="'Open Sans', sans-serif">{MONTHS[i]}</text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}`;
}

/* ── Preview components para o Playground ── */
function DashPreviewKPI() {
  const kpis = [
    { label: "Solicitações", value: "487", delta: "+12%", color: "#004B9B" },
    { label: "Finalizadas", value: "312", delta: "64%", color: "#00C64C" },
  ];
  return (
    <div style={{ display: "flex", gap: 10 }}>
      {kpis.map((k, i) => (
        <div key={i} style={{ flex: 1, background: "#fff", border: "1px solid #E2E8F0", borderRadius: "8px 8px 8px 14px", padding: "10px 12px" }}>
          <span style={{ fontSize: 9, fontWeight: 600, color: "#7B8C96", display: "block" }}>{k.label}</span>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 4 }}>
            <span style={{ fontSize: 18, fontWeight: 800, fontFamily: "'Saira Expanded',sans-serif", color: "#333B41" }}>{k.value}</span>
            <span style={{ fontSize: 8, fontWeight: 600, color: "#00C64C" }}>↑ {k.delta}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function DashPreviewFilters() {
  return (
    <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 8, padding: "8px 12px" }}>
      <span style={{ fontSize: 10, fontWeight: 700, color: "#333B41", fontFamily: "'Saira Expanded',sans-serif", display: "block", marginBottom: 6 }}>Filtros</span>
      <div style={{ display: "flex", gap: 6 }}>
        {["Área", "Ano", "Status"].map(l => (
          <div key={l} style={{ flex: 1, height: 24, borderRadius: 6, border: "1px solid #CBD5E1", display: "flex", alignItems: "center", padding: "0 6px", fontSize: 9, color: "#7B8C96" }}>{l}</div>
        ))}
      </div>
    </div>
  );
}

function DashPreviewChart() {
  const data = [32, 45, 28, 52, 61, 48];
  const max = Math.max(...data);
  return (
    <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 8, padding: "8px 12px" }}>
      <span style={{ fontSize: 10, fontWeight: 700, color: "#333B41", fontFamily: "'Saira Expanded',sans-serif", display: "block", marginBottom: 6 }}>Solicitações/Mês</span>
      <svg width="100%" height={50} viewBox="0 0 180 50">
        {data.map((v, i) => (
          <rect key={i} x={i * 30} y={50 - (v / max) * 45} width={22} height={(v / max) * 45} rx={3} fill="#004B9B" opacity={0.7} />
        ))}
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════ MAIN ═══════════════════════════════════════════ */
export default function DSFIPSDashboard(){
  const {dark}=useFipsTheme();
  const barColor=dark?"#93BDE4":"#004B9B";
  const barLabelColor=dark?"#E2E2E8":"#002A68";
  const dkc=(c:string)=>dark?({"#004B9B":"#93BDE4","#002A68":"#658EC9","#00904C":"#8BE5AD"}[c]||c):c;
  const [w,setW]=useState(typeof window!=="undefined"?window.innerWidth:1200);
  useEffect(()=>{const h=()=>setW(window.innerWidth);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h)},[]);
  const mob=w<640;

  const [allData]=useState(()=>seed());
  const [filter,setFilter]=useState<Record<string,string|null>>({year:null,month:null,status:null,dept:null,priority:null,sol:null});
  const hasFilter=filter.year||filter.month||filter.status||filter.dept||filter.priority||filter.sol;

  const toggle=(key:string,val:string)=>setFilter(f=>({...f,[key]:f[key]===val?null:val}));
  const setF=(key:string,val:string|null)=>setFilter(f=>({...f,[key]:val||null}));
  const clearAll=()=>setFilter({year:null,month:null,status:null,dept:null,priority:null,sol:null});

  const filtered=useMemo(()=>allData.filter(r=>{
    if(filter.year&&r.year!==filter.year)return false;
    if(filter.month&&r.month!==filter.month)return false;
    if(filter.status&&r.status!==filter.status)return false;
    if(filter.dept&&r.dept!==filter.dept)return false;
    if(filter.priority&&r.priority!==filter.priority)return false;
    if(filter.sol&&r.sol!==filter.sol)return false;
    return true;
  }),[allData,filter]);

  /* Derived data */
  const byMonth=useMemo(()=>MONTHS.map(m=>({l:m,v:filtered.filter(r=>r.month===m).length})),[filtered]);
  const byStatus=useMemo(()=>STATUSES.map(s=>({label:s,value:filtered.filter(r=>r.status===s).length,color:STATUS_COLOR[s]})),[filtered]);
  const byDept=useMemo(()=>DEPTS.map(d=>({l:d,v:filtered.filter(r=>r.dept===d).length,color:DEPT_COLOR[d]})).sort((a,b)=>b.v-a.v),[filtered]);
  const byPrio=useMemo(()=>PRIORITIES.map(p=>{const all=filtered.filter(r=>r.priority===p);const ok=all.filter(r=>r.sla>=70);return{label:p,total:all.length,ok:ok.length,color:PRIO_COLOR[p]}}),[filtered]);
  const total=filtered.length;
  const finalizadas=filtered.filter(r=>r.status==="Finalizada").length;
  const aguardando=filtered.filter(r=>r.status==="Aguardando").length;
  const atrasadas=filtered.filter(r=>r.sla<50).length;
  const sparkByMonth=MONTHS.map(m=>allData.filter(r=>r.month===m).length);

  const [hovBar,setHovBar]=useState<number|null>(null);
  const [hovDonut,setHovDonut]=useState<number|null>(null);
  const [hovHbar,setHovHbar]=useState<number|null>(null);
  const [hovSla,setHovSla]=useState<number|null>(null);
  const [hovRow,setHovRow]=useState(-1);
  const [hovDelta,setHovDelta]=useState(-1);
  const [hovKpiPt,setHovKpiPt]=useState<{c:number,p:number}|null>(null);
  const [hovKpiCard,setHovKpiCard]=useState(-1);
  const [hovStatusD,setHovStatusD]=useState(-1);
  const [hovSideLine,setHovSideLine]=useState(-1);
  const [hovSideBar,setHovSideBar]=useState(-1);
  const [hovCombo,setHovCombo]=useState(-1);
  const [hovStacked,setHovStacked]=useState(-1);
  const [tipPos,setTipPos]=useState({x:0,y:0});
  const trackMouse=(e:React.MouseEvent)=>setTipPos({x:e.clientX,y:e.clientY});

  /* Tooltip data builders */
  const tipBar=useMemo(()=>{
    if(hovBar===null)return null;
    const m=MONTHS[hovBar];const mData=allData.filter(r=>r.month===m);
    return{title:m,color:dkc(C.azulProfundo),total:mData.length,rows:STATUSES.map(s=>({label:s,value:mData.filter(r=>r.status===s).length,color:STATUS_COLOR[s]}))};
  },[hovBar,allData,dark]);

  const tipDonutData=useMemo(()=>{
    if(hovDonut===null)return null;
    const s=STATUSES[hovDonut];const sData=filtered.filter(r=>r.status===s);
    return{title:s,color:STATUS_COLOR[s],total:sData.length,rows:DEPTS.map(d=>({label:d,value:sData.filter(r=>r.dept===d).length,color:DEPT_COLOR[d]})).filter(r=>r.value>0).sort((a,b)=>b.value-a.value)};
  },[hovDonut,filtered]);

  const tipHbarData=useMemo(()=>{
    if(hovHbar===null)return null;
    const d=byDept[hovHbar];if(!d)return null;
    const dData=filtered.filter(r=>r.dept===d.l);
    return{title:d.l,color:d.color,total:dData.length,rows:PRIORITIES.map(p=>({label:p,value:dData.filter(r=>r.priority===p).length,color:PRIO_COLOR[p]})).filter(r=>r.value>0)};
  },[hovHbar,filtered,byDept]);

  const tipSlaData=useMemo(()=>{
    if(hovSla===null)return null;
    const p=PRIORITIES[hovSla];const pData=filtered.filter(r=>r.priority===p);
    const atrasados=pData.filter(r=>r.sla<70).slice(0,4);
    return{title:`${p} — SLA`,color:PRIO_COLOR[p],total:pData.length,rows:atrasados.length>0?atrasados.map(r=>({label:`${r.id} · ${r.sol}`,value:r.sla,color:r.sla<50?C.danger:C.amareloEscuro})):[{label:"Todos no prazo",value:100,color:C.verdeFloresta}]};
  },[hovSla,filtered]);

  const tipKpiCard=useMemo(()=>{
    if(hovKpiCard<0)return null;
    const meta=KPI_META[hovKpiCard];
    const colors: Record<string,Record<string,string>>={status:STATUS_COLOR,dept:DEPT_COLOR,priority:PRIO_COLOR};
    const lists: Record<string,string[]>={status:STATUSES,dept:DEPTS,priority:PRIORITIES};
    const src=meta.slaFilter?filtered.filter(r=>r.sla<50):meta.statusFilter?filtered.filter(r=>r.status===meta.statusFilter):filtered;
    const keys=lists[meta.breakdown];const clrs=colors[meta.breakdown];
    return{title:meta.label,color:dkc(meta.color),total:src.length,rows:keys.map(k=>({label:k,value:src.filter(r=>getRowBreakdownValue(r,meta.breakdown)===k).length,color:clrs[k]})).filter(r=>r.value>0).sort((a,b)=>b.value-a.value).slice(0,5)};
  },[hovKpiCard,filtered,dark]);

  const tipStatusD=useMemo(()=>{
    if(hovStatusD<0)return null;
    const meta=STATUS_D_META[hovStatusD];
    const src=meta.filterKey?filtered.filter(r=>r.status===meta.filterKey):filtered;
    return{title:meta.label,color:[dkc(C.azulProfundo),C.verdeFloresta,C.amareloEscuro,C.danger][hovStatusD],total:src.length,rows:DEPTS.map(d=>({label:d,value:src.filter(r=>r.dept===d).length,color:DEPT_COLOR[d]})).filter(r=>r.value>0).sort((a,b)=>b.value-a.value).slice(0,5)};
  },[hovStatusD,filtered]);

  const tipSideLine=useMemo(()=>{
    if(hovSideLine<0)return null;
    const m=MONTHS[hovSideLine];const mData=allData.filter(r=>r.month===m);
    return{title:`${m} — Tendência`,color:dkc(C.azulProfundo),total:mData.length,rows:STATUSES.map(s=>({label:s,value:mData.filter(r=>r.status===s).length,color:STATUS_COLOR[s]}))};
  },[hovSideLine,allData,dark]);

  const sideBarVals=useMemo(()=>DAYS_LABELS.map(()=>Math.round(filtered.length*(0.15+Math.random()*0.12))),[filtered.length]);
  const tipSideBarData=useMemo(()=>{
    if(hovSideBar<0)return null;
    const d=DAYS_LABELS[hovSideBar];
    return{title:`${d} — Requisições`,color:dkc(C.azulProfundo),total:Math.round(filtered.length*0.2),rows:[{label:"Manhã (8h–12h)",value:Math.round(filtered.length*0.09),color:C.azulCeu},{label:"Tarde (13h–17h)",value:Math.round(filtered.length*0.08),color:dkc(C.azulProfundo)},{label:"Noite (18h+)",value:Math.round(filtered.length*0.03),color:dkc(C.azulEscuro)}]};
  },[hovSideBar,filtered,dark]);

  const comboData=useMemo(()=>MONTHS.map(m=>{const mf=filtered.filter(r=>r.month===m);return{l:m,abertas:mf.length,concluidas:mf.filter(r=>r.status==="Finalizada").length,sla:mf.length?Math.round(mf.reduce((a,r)=>a+r.sla,0)/mf.length):0}}),[filtered]);
  const tipCombo=useMemo(()=>{
    if(hovCombo<0)return null;
    const d=comboData[hovCombo];
    return{title:d.l,color:dkc(C.azulProfundo),total:d.abertas,rows:[{label:"Abertas",value:d.abertas,color:dkc(C.azulProfundo)},{label:"Concluídas",value:d.concluidas,color:C.verdeFloresta},{label:"SLA médio",value:d.sla,color:d.sla>=70?C.verdeFloresta:d.sla>=50?C.amareloEscuro:C.danger}]};
  },[hovCombo,comboData,dark]);

  const stackedData=useMemo(()=>MONTHS.map(m=>{const mf=filtered.filter(r=>r.month===m);return{l:m,segs:STATUSES.map(s=>({s,v:mf.filter(r=>r.status===s).length,color:STATUS_COLOR[s]}))}}),[filtered]);
  const tipStacked=useMemo(()=>{
    if(hovStacked<0)return null;
    const d=stackedData[hovStacked];const tot=d.segs.reduce((a,s)=>a+s.v,0);
    return{title:d.l,color:dkc(C.azulProfundo),total:tot,rows:d.segs.filter(s=>s.v>0).map(s=>({label:s.s,value:s.v,color:s.color}))};
  },[hovStacked,stackedData,dark]);

  const kpis=[
    {label:"Solicitações",value:total,delta:`${total>150?"+":""}${Math.round((total/allData.length)*100)}%`,up:true,icon:(s:number,c:string)=><LuFileText size={s} color={c}/>,color:C.azulProfundo,spark:sparkByMonth,deltaDesc:"do total filtrado"},
    {label:"Finalizadas",value:finalizadas,delta:total?`${Math.round(finalizadas/total*100)}%`:"0%",up:true,icon:(s:number,c:string)=><LuCircleCheck size={s} color={c}/>,color:C.verdeFloresta,spark:MONTHS.map(m=>allData.filter(r=>r.month===m&&r.status==="Finalizada").length),deltaDesc:"taxa de conclusão"},
    {label:"Aguardando",value:aguardando,delta:total?`${Math.round(aguardando/total*100)}%`:"0%",up:false,icon:(s:number,c:string)=><LuClock size={s} color={c}/>,color:C.amareloEscuro,spark:MONTHS.map(m=>allData.filter(r=>r.month===m&&r.status==="Aguardando").length),deltaDesc:"em análise ou aprovação"},
    {label:"Atrasadas",value:atrasadas,delta:total?`${Math.round(atrasadas/total*100)}%`:"0%",up:true,icon:(s:number,c:string)=><LuTriangleAlert size={s} color={c}/>,color:C.danger,spark:MONTHS.map(m=>allData.filter(r=>r.month===m&&r.sla<50).length),deltaDesc:"SLA abaixo de 50%"},
  ];

  const tableData=filtered.slice(-8).reverse();
  const Avatar=({name}:{name:string})=>{const p=(name||"").split(" ").filter(Boolean);const ini=p.length>=2?`${p[0][0]}${p[p.length-1][0]}`:p[0]?p[0][0]:"?";return <div style={{width:32,height:32,borderRadius:"50%",background:C.bg,border:`1px solid ${C.cardBorder}`,color:C.cinzaChumbo,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,fontFamily:Fn.title,flexShrink:0,letterSpacing:".5px"}}>{ini.toUpperCase()}</div>};

  return(
    <PlaygroundProvider>
    <div style={{minHeight:"100vh",background:"var(--color-surface-muted)",fontFamily:Fn.body,color:C.cinzaEscuro}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Saira+Expanded:wght@300;400;500;600;700;800&family=Open+Sans:wght@300;400;600;700&family=Fira+Code:wght@400;500&display=swap');
      `}</style>

      {/* ═══ HERO ═══ */}
      <header style={{background:`linear-gradient(135deg,${C.azulProfundo} 0%,${C.azulEscuro} 100%)`,padding:mob?"32px 20px":"48px 40px 44px",position:"relative",overflow:"hidden"}}>
        <JunctionLines style={{position:"absolute",top:-10,right:-20,width:mob?250:400,height:250}}/>
        <div style={{position:"relative"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:6,background:`${C.branco}10`,border:`1px solid ${C.branco}18`,borderRadius:20,padding:"5px 14px",fontSize:11,fontWeight:600,letterSpacing:"1.5px",textTransform:"uppercase",color:C.amareloOuro,fontFamily:Fn.title,marginBottom:16}}><LuLayoutGrid size={14} color={C.amareloOuro}/> Design System FIPS</div>
          <h1 style={{fontSize:mob?30:44,fontWeight:700,color:C.branco,margin:"0 0 10px",fontFamily:Fn.title}}>Dashboard</h1>
          <p style={{fontSize:16,color:`${C.branco}B0`,lineHeight:1.6,maxWidth:700,margin:0,fontFamily:Fn.body}}>Padrão de painel operacional com KPIs, gráficos interativos, barra de filtros e tabela de dados. Clique em qualquer seção para copiar o código.</p>
        </div>
      </header>

      <div style={{padding:mob?"16px 12px 32px":"24px 40px 48px",maxWidth:1200,margin:"0 auto"}}>

        {/* ═══ BARRA DE FILTROS ═══ */}
        <Copyable label="Barra de Filtros" code={dashCode('filters')} preview={<DashPreviewFilters />} fullWidth>
        <div style={{background:C.cardBg,borderRadius:"10px 10px 10px 18px",border:`1px solid ${C.cardBorder}`,padding:mob?"12px":"14px 20px",marginBottom:mob?16:28,boxShadow:"0 1px 3px rgba(0,75,155,.04)"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <LuLayoutGrid size={16} color={dark?"#93BDE4":C.azulProfundo}/>
              <span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>Filtros</span>
              {hasFilter&&<span style={{fontSize:10,color:C.textMuted,fontFamily:Fn.body}}>· {filtered.length} de {allData.length}</span>}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <button onClick={()=>exportPDF(filtered,filter,{valor:filtered.reduce((a,r)=>a+r.valor,0).toLocaleString("pt-BR")})} style={{display:"inline-flex",alignItems:"center",gap:4,padding:"4px 10px",fontSize:10,fontWeight:600,color:C.danger,background:`${C.danger}12`,border:`1px solid ${C.danger}30`,borderRadius:6,cursor:"pointer",fontFamily:Fn.body}} title="Gerar relatório PDF"><LuFileDown size={12} color={C.danger}/> Relatório</button>
              {hasFilter&&<button onClick={clearAll} style={{display:"inline-flex",alignItems:"center",gap:4,padding:"4px 10px",fontSize:10,fontWeight:600,color:C.cinzaChumbo,background:C.bg,border:`1px solid ${C.cardBorder}`,borderRadius:6,cursor:"pointer",fontFamily:Fn.body}}><LuX size={10} color={C.cinzaChumbo}/> Limpar</button>}
            </div>
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            <ChipSelect label="Área / Processo" value={filter.dept} onChange={v=>setF("dept",v)} options={DEPTS} icon={<LuBuilding2 size={14} color={C.cinzaChumbo}/>}/>
            <ChipSelect label="Ano" value={filter.year} onChange={v=>setF("year",v)} options={YEARS} icon={<LuCalendar size={14} color={C.cinzaChumbo}/>}/>
            <ChipSelect label="Mês" value={filter.month} onChange={v=>setF("month",v)} options={MONTHS} icon={<LuCalendar size={14} color={C.cinzaChumbo}/>}/>
            <ChipSelect label="Solicitante" value={filter.sol} onChange={v=>setF("sol",v)} options={NAMES} icon={<LuUser size={14} color={C.cinzaChumbo}/>}/>
            <ChipSelect label="Prioridade" value={filter.priority} onChange={v=>setF("priority",v)} options={PRIORITIES} placeholder="Todas" icon={<LuFlag size={14} color={C.cinzaChumbo}/>}/>
            <ChipSelect label="Status" value={filter.status} onChange={v=>setF("status",v)} options={STATUSES} icon={<LuCircleCheck size={14} color={C.cinzaChumbo}/>}/>
          </div>
        </div>
        </Copyable>

        {/* ═══ FILTROS ATIVOS (badges) ═══ */}
        {hasFilter&&(
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:14,flexWrap:"wrap"}}>
            {filter.year&&<span style={{padding:"3px 8px",fontSize:10,fontWeight:600,color:C.cinzaEscuro,background:dark?"rgba(147,189,228,0.06)":`${C.azulProfundo}10`,borderRadius:4,fontFamily:Fn.body}}>Ano: {filter.year}</span>}
            {filter.month&&<span style={{padding:"3px 8px",fontSize:10,fontWeight:600,color:C.cinzaEscuro,background:dark?"rgba(147,189,228,0.06)":`${C.azulProfundo}10`,borderRadius:4,fontFamily:Fn.body}}>Mês: {filter.month}</span>}
            {filter.dept&&<span style={{padding:"3px 8px",fontSize:10,fontWeight:600,color:DEPT_COLOR[filter.dept],background:`${DEPT_COLOR[filter.dept]}10`,borderRadius:4,fontFamily:Fn.body}}>Área: {filter.dept}</span>}
            {filter.sol&&<span style={{padding:"3px 8px",fontSize:10,fontWeight:600,color:C.cinzaEscuro,background:dark?"rgba(101,142,201,0.06)":`${C.azulEscuro}10`,borderRadius:4,fontFamily:Fn.body}}>Nome: {filter.sol}</span>}
            {filter.priority&&<span style={{padding:"3px 8px",fontSize:10,fontWeight:600,color:PRIO_COLOR[filter.priority],background:`${PRIO_COLOR[filter.priority]}10`,borderRadius:4,fontFamily:Fn.body}}>Prioridade: {filter.priority}</span>}
            {filter.status&&<span style={{padding:"3px 8px",fontSize:10,fontWeight:600,color:STATUS_COLOR[filter.status],background:`${STATUS_COLOR[filter.status]}10`,borderRadius:4,fontFamily:Fn.body}}>Status: {filter.status}</span>}
          </div>
        )}

        {/* ═══ KPIs ═══ */}
        <Copyable label="KPI Cards" code={dashCode('kpi')} preview={<DashPreviewKPI />} fullWidth>
        <div style={{display:"grid",gridTemplateColumns:mob?"repeat(2,1fr)":"repeat(4,1fr)",gap:mob?10:16,marginBottom:mob?16:24}}>
          {kpis.map((k,i)=>{
            const dc=k.up&&k.color!==C.danger?C.verdeFloresta:C.danger;
            const max=Math.max(...k.spark),min=Math.min(...k.spark);
            const sw=200,sh=40;
            const pts=k.spark.map((v,j)=>({x:(j/(k.spark.length-1))*sw,y:sh-((v-min)/(max-min||1))*(sh-8)+4}));
            const line=pts.map(p=>`${p.x},${p.y}`).join(" ");
            const uid=k.color.replace('#','')+'k'+i;
            const hovPt=hovKpiPt&&hovKpiPt.c===i?hovKpiPt.p:-1;
            return(
              <motion.div key={i} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:0.35,delay:i*0.06,ease:"easeOut"}} onMouseEnter={()=>setHovKpiCard(i)} onMouseLeave={()=>setHovKpiCard(-1)} onMouseMove={trackMouse} style={{background:C.cardBg,borderRadius:"10px 10px 10px 18px",border:`1px solid ${C.cardBorder}`,position:"relative"}}>
                <div style={{padding:mob?"14px 12px 6px":"18px 20px 6px",position:"relative",zIndex:2}}>
                  <div style={{position:"absolute",top:mob?12:16,right:mob?10:16,width:mob?34:40,height:mob?34:40,borderRadius:mob?9:12,background:`${dkc(k.color)}0A`,display:"flex",alignItems:"center",justifyContent:"center"}}>{k.icon(mob?16:20,dkc(k.color))}</div>
                  <span style={{fontSize:11,fontWeight:600,color:C.cinzaChumbo,display:"block",marginBottom:mob?6:8}}>{k.label}</span>
                  <div style={{display:"flex",alignItems:"baseline",gap:8}}>
                    <span style={{fontSize:mob?22:28,fontWeight:800,fontFamily:Fn.title,color:C.cinzaEscuro,lineHeight:1}}>{k.value}</span>
                    <span onMouseEnter={()=>setHovDelta(i)} onMouseLeave={()=>setHovDelta(-1)} style={{display:"inline-flex",alignItems:"center",gap:2,fontSize:10,fontWeight:600,fontFamily:Fn.mono,color:k.color!==C.danger?dc:C.danger,cursor:"help",position:"relative"}}>
                      {k.up?<LuArrowUp size={10} color={k.color!==C.danger?dc:C.danger}/>:<LuArrowDown size={10} color={dc}/>}{k.delta}
                      {hovDelta===i&&<span style={{position:"absolute",bottom:"100%",left:"50%",transform:"translateX(-50%)",marginBottom:6,background:dark?"#658EC9":C.azulEscuro,color:C.branco,padding:"5px 10px",borderRadius:6,fontSize:10,fontFamily:Fn.body,whiteSpace:"nowrap",zIndex:20,boxShadow:"0 4px 12px rgba(0,0,0,.2)"}}>{k.delta} {k.deltaDesc}<span style={{position:"absolute",top:"100%",left:"50%",transform:"translateX(-50%)",width:0,height:0,borderLeft:"4px solid transparent",borderRight:"4px solid transparent",borderTop:`4px solid ${dark?"#658EC9":C.azulEscuro}`}}/></span>}
                    </span>
                  </div>
                </div>
                <div style={{overflow:"hidden",borderRadius:"0 0 0 18px",marginLeft:-1,marginRight:-1,marginBottom:-1}}>
                  <svg width="100%" height={sh+16} viewBox={`-2 -12 ${sw+4} ${sh+28}`} preserveAspectRatio="none" style={{display:"block"}} onMouseLeave={()=>setHovKpiPt(null)}>
                    <defs><linearGradient id={`ga${uid}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={dkc(k.color)} stopOpacity=".18"/><stop offset="100%" stopColor={dkc(k.color)} stopOpacity="0"/></linearGradient></defs>
                    <polygon points={`0,${sh} ${line} ${sw},${sh}`} fill={`url(#ga${uid})`}/>
                    <polyline points={line} fill="none" stroke={dkc(k.color)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    {pts.map((p,j)=>(
                      <g key={j} onMouseEnter={()=>setHovKpiPt({c:i,p:j})} style={{cursor:"pointer"}}>
                        <circle cx={p.x} cy={p.y} r="10" fill="transparent"/>
                        <circle cx={p.x} cy={p.y} r={hovPt===j?4:0} fill={dkc(k.color)} style={{transition:"r .1s"}}/>
                        {hovPt===j&&<><text x={p.x} y={p.y-8} textAnchor="middle" fontSize="9" fontWeight="700" fill={dkc(k.color)} fontFamily={Fn.mono}>{k.spark[j]}</text><text x={p.x} y={sh+10} textAnchor="middle" fontSize="7" fill={C.cinzaChumbo} fontFamily={Fn.body}>{MONTHS[j]}</text></>}
                      </g>
                    ))}
                    {pts.map((p,j)=>j%2===0&&hovPt===-1?<text key={`m${j}`} x={p.x} y={sh+10} textAnchor="middle" fontSize="7" fill={C.textLight} fontFamily={Fn.body}>{MONTHS[j]}</text>:null)}
                  </svg>
                </div>
                {hovKpiCard===i&&tipKpiCard&&<ChartTooltip {...tipKpiCard} x={tipPos.x} y={tipPos.y}/>}
              </motion.div>
            );
          })}
        </div>
        </Copyable>

        {/* ═══ CHARTS ROW 1 (2 colunas) ═══ */}
        <Copyable label="Graficos Dashboard" code={dashCode('chart')} preview={<DashPreviewChart />} fullWidth>
        <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:mob?12:16,marginBottom:mob?16:24}}>

          {/* Bar — por mês */}
          {(()=>{
            const max=Math.max(...byMonth.map(d=>d.v),1);
            const bw=28,gp=10,chartW=byMonth.length*(bw+gp)-gp,chartH=100;
            return(
              <div style={{background:C.cardBg,borderRadius:"10px 10px 10px 18px",border:`1px solid ${filter.month?(dark?"#93BDE4":C.azulProfundo):C.cardBorder}`,padding:mob?14:20,boxShadow:"0 1px 3px rgba(0,75,155,.04)",transition:"border-color .15s",position:"relative"}} onMouseMove={trackMouse}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
                  <div><span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title,display:"block"}}>Por mês</span><span style={{fontSize:10,color:C.cinzaChumbo}}>Clique para filtrar</span></div>
                  <div style={{width:30,height:30,borderRadius:8,background:dark?"rgba(147,189,228,0.04)":`${C.azulProfundo}0A`,display:"flex",alignItems:"center",justifyContent:"center"}}><LuChartColumnIncreasing size={14} color={dark?"#93BDE4":C.azulProfundo}/></div>
                </div>
                <div style={{display:"flex",justifyContent:"center"}}>
                  <svg width={chartW} height={chartH+48} viewBox={`0 -28 ${chartW} ${chartH+48}`}>
                    {byMonth.map((d,i)=>{
                      const bh=max?Math.max(4,(d.v/max)*chartH):4;const x=i*(bw+gp);
                      const isActive=filter.month===d.l;const isDimmed=filter.month&&!isActive;
                      return <g key={i} onClick={()=>toggle("month",d.l)} onMouseEnter={()=>setHovBar(i)} onMouseLeave={()=>setHovBar(null)} style={{cursor:"pointer"}}>
                        <rect x={x} y={-20} width={bw} height={chartH+40} fill="transparent"/>
                        <rect x={x} y={chartH-bh} width={bw} height={bh} rx={5} fill={barColor} opacity={isDimmed?.15:isActive?1:hovBar===i?.9:.55+(.45*d.v/(max||1))}/>
                        <text x={x+bw/2} y={chartH-bh-6} textAnchor="middle" fontSize="10" fontWeight="700" fill={isDimmed?"#6b7784":barLabelColor} fontFamily={Fn.mono}>{d.v}</text>
                        <text x={x+bw/2} y={chartH+14} textAnchor="middle" fontSize="9" fill={isActive?barColor:dark?"#A1A1AA":"#6b7784"} fontFamily={Fn.body} fontWeight={isActive?700:400}>{d.l}</text>
                        {isActive&&<rect x={x-2} y={chartH-bh-2} width={bw+4} height={bh+4} rx={6} fill="none" stroke={barColor} strokeWidth="1.5" strokeDasharray="4 2"/>}
                      </g>;
                    })}
                  </svg>
                </div>
                {tipBar&&<ChartTooltip {...tipBar} x={tipPos.x} y={tipPos.y}/>}
              </div>
            );
          })()}

          {/* Donut — por status */}
          {(()=>{
            const total2=byStatus.reduce((a,s)=>a+s.value,0)||1;
            const size=120,cx=size/2,cy=size/2,r=44,sw=14;
            let acc=0;const circ=2*Math.PI*r;
            return(
              <div style={{background:C.cardBg,borderRadius:"10px 10px 10px 18px",border:`1px solid ${filter.status?STATUS_COLOR[filter.status]:C.cardBorder}`,padding:mob?14:20,boxShadow:"0 1px 3px rgba(0,75,155,.04)",transition:"border-color .15s",position:"relative"}} onMouseMove={trackMouse}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
                  <div><span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title,display:"block"}}>Por status</span><span style={{fontSize:10,color:C.cinzaChumbo}}>Clique para filtrar</span></div>
                  <div style={{width:30,height:30,borderRadius:8,background:`${C.amareloEscuro}0A`,display:"flex",alignItems:"center",justifyContent:"center"}}><LuLayoutGrid size={14} color={C.amareloEscuro}/></div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:mob?12:20,justifyContent:"center"}}>
                  <div style={{position:"relative"}}>
                    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{transform:"rotate(-90deg)"}}>
                      {byStatus.map((s,i)=>{const pct=s.value/total2;const dash=pct*circ;const off=acc*circ;acc+=pct;const isActive=filter.status===s.label;const isDimmed=filter.status&&!isActive;return <circle key={`v${i}`} cx={cx} cy={cy} r={r} fill="none" stroke={s.color} strokeWidth={hovDonut===i?sw+4:sw} strokeDasharray={`${dash} ${circ-dash}`} strokeDashoffset={-off} strokeLinecap="round" opacity={isDimmed?.2:1} style={{transition:"all .15s",pointerEvents:"none"}}/>})}
                      {(()=>{let a2=0;return byStatus.map((s,i)=>{const pct=s.value/total2;const dash=pct*circ;const off=a2*circ;a2+=pct;return <circle key={`h${i}`} cx={cx} cy={cy} r={r} fill="none" stroke="transparent" strokeWidth={30} strokeDasharray={`${dash} ${circ-dash}`} strokeDashoffset={-off} style={{cursor:"pointer"}} onClick={()=>toggle("status",s.label)} onMouseEnter={()=>setHovDonut(i)} onMouseLeave={()=>setHovDonut(null)}/>})})()}
                    </svg>
                    <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",pointerEvents:"none"}}>
                      {hovDonut!==null?<><span style={{fontSize:16,fontWeight:800,fontFamily:Fn.title,color:byStatus[hovDonut].color,lineHeight:1}}>{byStatus[hovDonut].value}</span><span style={{fontSize:8,color:C.cinzaChumbo}}>{Math.round(byStatus[hovDonut].value/total2*100)}%</span></>:<><span style={{fontSize:20,fontWeight:800,fontFamily:Fn.title,color:C.cinzaEscuro,lineHeight:1}}>{filtered.length}</span><span style={{fontSize:9,color:C.cinzaChumbo}}>total</span></>}
                    </div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:6}}>
                    {byStatus.map((s,i)=>{const isActive=filter.status===s.label;const isDimmed=filter.status&&!isActive;return(
                      <div key={i} onClick={()=>toggle("status",s.label)} onMouseEnter={()=>setHovDonut(i)} onMouseLeave={()=>setHovDonut(null)} style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer",padding:"2px 4px",borderRadius:4,background:isActive?`${s.color}10`:hovDonut===i?`${s.color}08`:"transparent",transition:"background .12s",opacity:isDimmed?.4:1}}>
                        <div style={{width:8,height:8,borderRadius:"50%",background:s.color,flexShrink:0}}/>
                        <span style={{fontSize:11,color:isActive||hovDonut===i?s.color:C.cinzaEscuro,fontFamily:Fn.body,fontWeight:isActive?700:400,transition:"all .12s"}}>{s.label}</span>
                        <code style={{fontSize:10,fontWeight:700,fontFamily:Fn.mono,color:s.color,marginLeft:"auto"}}>{s.value}</code>
                      </div>
                    )})}
                  </div>
                </div>
                {tipDonutData&&<ChartTooltip {...tipDonutData} x={tipPos.x} y={tipPos.y}/>}
              </div>
            );
          })()}
        </div>

        {/* ═══ CHARTS ROW 2 ═══ */}
        <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:mob?12:16,marginBottom:mob?16:24}}>

          {/* Horizontal — por depto */}
          {(()=>{
            const max=Math.max(...byDept.map(d=>d.v),1);const totalH=byDept.reduce((a,d)=>a+d.v,0)||1;
            return(
              <div style={{background:C.cardBg,borderRadius:"10px 10px 10px 18px",border:`1px solid ${filter.dept?DEPT_COLOR[filter.dept]:C.cardBorder}`,padding:mob?14:20,boxShadow:"0 1px 3px rgba(0,75,155,.04)",transition:"border-color .15s",position:"relative"}} onMouseMove={trackMouse}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
                  <div><span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title,display:"block"}}>Por departamento</span><span style={{fontSize:10,color:C.cinzaChumbo}}>Clique para filtrar</span></div>
                  <div style={{width:30,height:30,borderRadius:8,background:dark?"rgba(147,189,228,0.04)":`${C.azulProfundo}0A`,display:"flex",alignItems:"center",justifyContent:"center"}}><LuList size={14} color={dark?"#93BDE4":C.azulProfundo}/></div>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {byDept.map((d,i)=>{
                    const isActive=filter.dept===d.l;const isDimmed=filter.dept&&!isActive;const isH=hovHbar===i;
                    return(
                      <div key={i} onClick={()=>toggle("dept",d.l)} onMouseEnter={()=>setHovHbar(i)} onMouseLeave={()=>setHovHbar(null)} style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",padding:"2px 0",opacity:isDimmed?.3:1,transition:"opacity .15s"}}>
                        <span style={{fontSize:11,fontWeight:isActive||isH?700:600,color:isActive?d.color:C.cinzaEscuro,fontFamily:Fn.body,minWidth:70,transition:"all .12s"}}>{d.l}</span>
                        <div style={{flex:1,height:isH||isActive?10:8,borderRadius:4,background:`${d.color}12`,transition:"height .12s"}}>
                          <div style={{height:"100%",borderRadius:4,background:d.color,width:`${(d.v/max)*100}%`,transition:"width .3s",opacity:isActive?1:.8}}/>
                        </div>
                        <code style={{fontSize:10,fontWeight:700,fontFamily:Fn.mono,color:d.color,minWidth:50,textAlign:"right"}}>{d.v}{(isH||isActive)?` (${Math.round(d.v/totalH*100)}%)`:""}</code>
                      </div>
                    );
                  })}
                </div>
                {tipHbarData&&<ChartTooltip {...tipHbarData} x={tipPos.x} y={tipPos.y}/>}
              </div>
            );
          })()}

          {/* SLA — por prioridade */}
          <div style={{background:C.cardBg,borderRadius:"10px 10px 10px 18px",border:`1px solid ${filter.priority?PRIO_COLOR[filter.priority]:C.cardBorder}`,padding:mob?14:20,boxShadow:"0 1px 3px rgba(0,75,155,.04)",transition:"border-color .15s",position:"relative"}} onMouseMove={trackMouse}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
              <div><span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title,display:"block"}}>SLA por prioridade</span><span style={{fontSize:10,color:C.cinzaChumbo}}>Clique para filtrar</span></div>
              <div style={{width:30,height:30,borderRadius:8,background:`${C.verdeFloresta}0A`,display:"flex",alignItems:"center",justifyContent:"center"}}><LuCircleCheck size={14} color={C.verdeFloresta}/></div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {byPrio.map((d,i)=>{
                const pct=d.total?Math.round((d.ok/d.total)*100):0;const isH=hovSla===i;
                const isActive=filter.priority===d.label;const isDimmed=filter.priority&&!isActive;
                return(
                  <div key={i} onClick={()=>toggle("priority",d.label)} onMouseEnter={()=>setHovSla(i)} onMouseLeave={()=>setHovSla(null)} style={{cursor:"pointer",opacity:isDimmed?.3:1,transition:"opacity .15s"}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <div style={{width:8,height:8,borderRadius:"50%",background:d.color}}/>
                        <span style={{fontSize:11,fontWeight:isActive||isH?700:600,color:isActive||isH?d.color:C.cinzaEscuro,transition:"all .12s"}}>{d.label}</span>
                      </div>
                      <span style={{fontSize:10,fontFamily:Fn.mono,color:C.cinzaChumbo}}>{d.ok}/{d.total} <span style={{fontWeight:700,color:pct>=90?C.verdeFloresta:pct>=70?C.amareloEscuro:C.danger}}>{pct}%</span>{(isH||isActive)&&<span style={{fontSize:9,color:C.textMuted}}> no prazo</span>}</span>
                    </div>
                    <div style={{height:isActive?10:isH?8:6,borderRadius:3,background:`${d.color}12`,transition:"height .12s"}}>
                      <div style={{height:"100%",borderRadius:3,background:d.color,width:`${pct}%`,opacity:isActive?1:pct>=90?1:.8}}/>
                    </div>
                    {isActive&&<div style={{height:2,borderRadius:1,background:d.color,marginTop:2,opacity:.4}}/>}
                  </div>
                );
              })}
            </div>
            {tipSlaData&&<ChartTooltip {...tipSlaData} x={tipPos.x} y={tipPos.y}/>}
          </div>
        </div>

        {/* ═══ COMBO + STACKED (2 colunas) ═══ */}
        <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:mob?12:16,marginBottom:mob?16:24}}>

          {/* Combo: Abertas vs Concluídas + SLA line */}
          {(()=>{
            const maxV=Math.max(...comboData.map(d=>Math.max(d.abertas,d.concluidas)),1);
            const pw=16,gp=5,pair=pw*2+3,cW=comboData.length*(pair+gp)-gp,cH=110,padL=22,padR=22;
            const slaPts=comboData.map((d,i)=>({x:padL+i*(pair+gp)+pair/2,y:cH-(d.sla/100)*cH}));
            const slaLine=slaPts.map(p=>`${p.x},${p.y}`).join(" ");
            return(
              <div style={{background:C.cardBg,borderRadius:"10px 10px 10px 18px",border:`1px solid ${C.cardBorder}`,padding:mob?14:20,boxShadow:"0 1px 3px rgba(0,75,155,.04)",position:"relative"}} onMouseMove={trackMouse}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                  <div>
                    <span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title,display:"block"}}>Abertas vs Concluídas</span>
                    <span style={{fontSize:10,color:C.cinzaChumbo}}>Duas colunas + linha SLA</span>
                  </div>
                  <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
                    <span style={{display:"flex",alignItems:"center",gap:3,fontSize:9,color:C.cinzaEscuro,fontFamily:Fn.body}}><span style={{width:8,height:8,borderRadius:2,background:dark?"#93BDE4":C.azulProfundo}}/>Abertas</span>
                    <span style={{display:"flex",alignItems:"center",gap:3,fontSize:9,color:C.verdeFloresta,fontFamily:Fn.body}}><span style={{width:8,height:8,borderRadius:2,background:C.verdeFloresta}}/>Concluídas</span>
                    <span style={{display:"flex",alignItems:"center",gap:3,fontSize:9,color:C.amareloEscuro,fontFamily:Fn.body}}><span style={{width:10,height:2,borderRadius:1,background:C.amareloEscuro}}/>SLA</span>
                  </div>
                </div>
                <svg width="100%" height={cH+40} viewBox={`0 -18 ${cW+padL+padR} ${cH+58}`} preserveAspectRatio="none" style={{display:"block"}}>
                  <line x1={padL} y1={0} x2={padL+cW} y2={0} stroke={C.cardBorder} strokeWidth=".5" strokeDasharray="3 3"/>
                  <line x1={padL} y1={cH/2} x2={padL+cW} y2={cH/2} stroke={C.cardBorder} strokeWidth=".5" strokeDasharray="3 3"/>
                  <line x1={padL} y1={cH} x2={padL+cW} y2={cH} stroke={C.cardBorder} strokeWidth=".5"/>
                  <text x={padL-3} y={4} textAnchor="end" fontSize="7" fill={C.textLight} fontFamily={Fn.mono}>{maxV}</text>
                  <text x={padL-3} y={cH/2+3} textAnchor="end" fontSize="7" fill={C.textLight} fontFamily={Fn.mono}>{Math.round(maxV/2)}</text>
                  <text x={padL-3} y={cH+3} textAnchor="end" fontSize="7" fill={C.textLight} fontFamily={Fn.mono}>0</text>
                  <text x={padL+cW+3} y={4} textAnchor="start" fontSize="7" fill={C.amareloEscuro} fontFamily={Fn.mono}>100%</text>
                  <text x={padL+cW+3} y={cH/2+3} textAnchor="start" fontSize="7" fill={C.amareloEscuro} fontFamily={Fn.mono}>50%</text>
                  <text x={padL+cW+3} y={cH+3} textAnchor="start" fontSize="7" fill={C.amareloEscuro} fontFamily={Fn.mono}>0%</text>
                  {comboData.map((d,i)=>{
                    const x=padL+i*(pair+gp);const bh1=Math.max(3,(d.abertas/maxV)*cH);const bh2=Math.max(3,(d.concluidas/maxV)*cH);
                    const isH=hovCombo===i;const isActive=filter.month===d.l;const isDimmed=filter.month&&!isActive;
                    return <g key={i} onClick={()=>toggle("month",d.l)} onMouseEnter={()=>setHovCombo(i)} onMouseLeave={()=>setHovCombo(-1)} style={{cursor:"pointer"}}>
                      <rect x={x} y={-18} width={pair} height={cH+58} fill="transparent"/>
                      <rect x={x} y={cH-bh1} width={pw} height={bh1} rx={3} fill={barColor} opacity={isDimmed?.15:isH||isActive?1:.85}/>
                      <rect x={x+pw+3} y={cH-bh2} width={pw} height={bh2} rx={3} fill={C.verdeFloresta} opacity={isDimmed?.15:isH||isActive?1:.85}/>
                      <text x={x+pw/2} y={cH-bh1-3} textAnchor="middle" fontSize="7" fontWeight="700" fill={isDimmed?C.textLight:barColor} fontFamily={Fn.mono}>{d.abertas}</text>
                      <text x={x+pw+3+pw/2} y={cH-bh2-3} textAnchor="middle" fontSize="7" fontWeight="700" fill={isDimmed?C.textLight:C.verdeFloresta} fontFamily={Fn.mono}>{d.concluidas}</text>
                      <text x={x+pair/2} y={cH+14} textAnchor="middle" fontSize="7" fill={isActive?barColor:isDimmed?C.textLight:C.cinzaChumbo} fontFamily={Fn.body} fontWeight={isActive?700:400}>{d.l}</text>
                      {isActive&&<rect x={x-2} y={cH-Math.max(bh1,bh2)-2} width={pair+4} height={Math.max(bh1,bh2)+4} rx={4} fill="none" stroke={barColor} strokeWidth="1.5" strokeDasharray="4 2"/>}
                    </g>;
                  })}
                  <polyline points={slaLine} fill="none" stroke={C.amareloEscuro} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  {slaPts.map((p,i)=>{
                    const isH=hovCombo===i;const d=comboData[i];
                    return <g key={`sla${i}`}>
                      <circle cx={p.x} cy={p.y} r={isH?5:2.5} fill={isH?C.amareloEscuro:C.cardBg} stroke={C.amareloEscuro} strokeWidth="1.5" style={{transition:"all .12s"}}/>
                      {isH?<text x={p.x} y={p.y-8} textAnchor="middle" fontSize="8" fontWeight="700" fill={C.amareloEscuro} fontFamily={Fn.mono}>{d.sla}%</text>
                      :i%3===0&&<text x={p.x} y={p.y-7} textAnchor="middle" fontSize="6" fontWeight="600" fill={C.amareloEscuro} fontFamily={Fn.mono} opacity=".7">{d.sla}%</text>}
                    </g>;
                  })}
                </svg>
                {tipCombo&&<ChartTooltip {...tipCombo} x={tipPos.x} y={tipPos.y}/>}
              </div>
            );
          })()}

          {/* Stacked Bar — empilhado por status */}
          {(()=>{
            const maxS=Math.max(...stackedData.map(d=>d.segs.reduce((a,s)=>a+s.v,0)),1);
            const bw=22,gp=6,cW=stackedData.length*(bw+gp)-gp,cH=110;
            return(
              <div style={{background:C.cardBg,borderRadius:"10px 10px 10px 18px",border:`1px solid ${C.cardBorder}`,padding:mob?14:20,boxShadow:"0 1px 3px rgba(0,75,155,.04)",position:"relative"}} onMouseMove={trackMouse}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                  <div>
                    <span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title,display:"block"}}>Distribuição por status</span>
                    <span style={{fontSize:10,color:C.cinzaChumbo}}>Barras empilhadas por mês</span>
                  </div>
                  <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                    {STATUSES.map(s=><span key={s} style={{display:"flex",alignItems:"center",gap:3,fontSize:9,color:STATUS_COLOR[s],fontFamily:Fn.body}}><span style={{width:8,height:8,borderRadius:2,background:STATUS_COLOR[s]}}/>
                      {s==="Em análise"?"Análise":s}
                    </span>)}
                  </div>
                </div>
                <svg width="100%" height={cH+40} viewBox={`0 -18 ${cW+10} ${cH+58}`} preserveAspectRatio="none" style={{display:"block"}}>
                  <line x1={0} y1={0} x2={cW} y2={0} stroke={C.cardBorder} strokeWidth=".5" strokeDasharray="3 3"/>
                  <line x1={0} y1={cH/2} x2={cW} y2={cH/2} stroke={C.cardBorder} strokeWidth=".5" strokeDasharray="3 3"/>
                  <line x1={0} y1={cH} x2={cW} y2={cH} stroke={C.cardBorder} strokeWidth=".5"/>
                  {stackedData.map((d,mi)=>{
                    const x=mi*(bw+gp);const stTotal=d.segs.reduce((a,s)=>a+s.v,0);let cy2=cH;
                    const isH=hovStacked===mi;const isActive=filter.month===d.l;const isDimmed=filter.month&&!isActive;
                    return <g key={mi} onClick={()=>toggle("month",d.l)} onMouseEnter={()=>setHovStacked(mi)} onMouseLeave={()=>setHovStacked(-1)} style={{cursor:"pointer"}}>
                      <rect x={x} y={-18} width={bw} height={cH+58} fill="transparent"/>
                      {d.segs.map((s,si)=>{const sh2=stTotal?Math.max(s.v>0?2:0,(s.v/maxS)*cH):0;cy2-=sh2;return <rect key={si} x={x} y={cy2} width={bw} height={sh2} rx={si===0?3:0} fill={s.color} opacity={isDimmed?.15:isH||isActive?1:.75}/>})}
                      <text x={x+bw/2} y={cH-((stTotal/maxS)*cH)-4} textAnchor="middle" fontSize="8" fontWeight="700" fill={isDimmed?C.textLight:barLabelColor} fontFamily={Fn.mono}>{stTotal}</text>
                      <text x={x+bw/2} y={cH+14} textAnchor="middle" fontSize="7" fill={isActive?barColor:isDimmed?C.textLight:C.cinzaChumbo} fontFamily={Fn.body} fontWeight={isActive?700:400}>{d.l}</text>
                      {isActive&&<rect x={x-2} y={cH-((stTotal/maxS)*cH)-2} width={bw+4} height={((stTotal/maxS)*cH)+4} rx={4} fill="none" stroke={barColor} strokeWidth="1.5" strokeDasharray="4 2"/>}
                    </g>;
                  })}
                </svg>
                {tipStacked&&<ChartTooltip {...tipStacked} x={tipPos.x} y={tipPos.y}/>}
              </div>
            );
          })()}
        </div>

        {/* ═══ TABELA + SIDEBAR ═══ */}
        <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"2fr 1fr",gap:mob?16:20}}>

          {/* Tabela */}
          <div style={{background:C.cardBg,borderRadius:"12px 12px 12px 24px",border:`1px solid ${C.cardBorder}`,overflow:"hidden",boxShadow:"0 1px 3px rgba(0,75,155,.04)"}}>
            <div style={{padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
              <div style={{display:"flex",alignItems:"center",gap:14}}>
                <div style={{width:48,height:48,borderRadius:14,background:dark?"rgba(147,189,228,0.04)":`${C.azulProfundo}0A`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><LuList size={20} color={dark?"#93BDE4":C.azulProfundo}/></div>
                <div><span style={{fontSize:15,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title,display:"block"}}>Requisições {hasFilter?"(filtradas)":""}</span><span style={{fontSize:12,color:C.cinzaChumbo,display:"block",marginTop:2}}>{tableData.length} mais recentes</span></div>
              </div>
              <div style={{display:"flex",gap:6}}>
                <button style={{display:"inline-flex",alignItems:"center",gap:5,padding:"6px 12px",fontSize:11,fontWeight:600,fontFamily:Fn.body,color:"#1D6F42",background:"#1D6F4210",border:"1px solid #1D6F4225",borderRadius:8,cursor:"pointer",transition:"all .15s"}} title="Exportar Excel"><LuFileSpreadsheet size={14} color="#1D6F42"/> <span style={{display:mob?"none":"inline"}}>Excel</span></button>
                <button onClick={()=>exportPDF(filtered,filter,{valor:filtered.reduce((a,r)=>a+r.valor,0).toLocaleString("pt-BR")})} style={{display:"inline-flex",alignItems:"center",gap:5,padding:"6px 12px",fontSize:11,fontWeight:600,fontFamily:Fn.body,color:C.danger,background:`${C.danger}08`,border:`1px solid ${C.danger}20`,borderRadius:8,cursor:"pointer",transition:"all .15s"}} title="Exportar PDF"><LuFileDown size={14} color={C.danger}/> <span style={{display:mob?"none":"inline"}}>PDF</span></button>
              </div>
            </div>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontFamily:Fn.body}}>
                <thead><tr style={{background:C.bg}}>
                  {(mob?["Código","Status","SLA"]:["Código","Solicitante","Depto","Status","SLA","Valor"]).map(h=>(
                    <th key={h} style={{padding:"12px 16px",textAlign:"center",fontSize:10,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.cinzaChumbo,fontFamily:Fn.title,borderBottom:`2px solid ${C.cardBorder}`,whiteSpace:"nowrap"}}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {tableData.map((r,i)=>{
                    const isH=hovRow===i;const zebra=i%2===1?`${C.azulCeu}0D`:"transparent";
                    return(
                      <tr key={i} onMouseEnter={()=>setHovRow(i)} onMouseLeave={()=>setHovRow(-1)} style={{background:isH?`${C.amareloOuro}18`:zebra,transition:"background .12s",borderBottom:i<tableData.length-1?`1px solid ${C.cardBorder}`:"none"}}>
                        <td style={{padding:"10px 16px",fontSize:12,fontWeight:600,color:C.cinzaEscuro,fontFamily:Fn.mono}}>{r.id}</td>
                        {!mob&&<td style={{padding:"10px 16px"}}><div style={{display:"flex",alignItems:"center",gap:10}}><Avatar name={r.sol}/><div style={{lineHeight:1.2}}><span style={{fontWeight:600,fontSize:12,color:C.cinzaEscuro,display:"block"}}>{r.sol}</span><span style={{fontSize:10,color:C.textMuted,display:"block"}}>{r.dept}</span></div></div></td>}
                        {!mob&&<td style={{padding:"10px 16px",fontSize:12,color:C.cinzaChumbo}}>{r.dept}</td>}
                        <td style={{padding:"10px 16px"}}><Badge variant={r.status} dot>{r.status}</Badge></td>
                        <td style={{padding:"10px 16px",minWidth:100}}><MiniProgress value={r.sla}/></td>
                        {!mob&&<td style={{padding:"10px 16px",fontSize:12,fontWeight:600,fontFamily:Fn.mono,color:C.cinzaEscuro}}>R$ {r.valor.toLocaleString("pt-BR")}</td>}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={{padding:"10px 16px",borderTop:`1px solid ${C.cardBorder}`,background:C.bg,display:"flex",alignItems:"center",justifyContent:"space-between",fontSize:11,color:C.cinzaChumbo}}>
              <span>{filtered.length} requisições{hasFilter?" filtradas":""}</span>
              <span style={{fontWeight:600,color:C.cinzaEscuro}}>Total: R$ {filtered.reduce((a,r)=>a+r.valor,0).toLocaleString("pt-BR")}</span>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{display:"flex",flexDirection:"column",gap:mob?16:20}}>
            {/* Fluxo */}
            <div style={{background:C.cardBg,borderRadius:"10px 10px 10px 18px",border:`1px solid ${C.cardBorder}`,padding:mob?14:18,boxShadow:"0 1px 3px rgba(0,75,155,.04)"}}>
              <span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title,display:"block",marginBottom:12}}>Fluxo</span>
              {[
                {step:"1",label:"Solicitação",count:total,color:dark?"#93BDE4":C.azulProfundo},
                {step:"2",label:"Triagem",count:aguardando,color:C.azulCeu},
                {step:"3",label:"Aprovação",count:finalizadas,color:C.amareloEscuro},
                {step:"4",label:"Compra",count:Math.round(finalizadas*.8),color:C.verdeFloresta},
              ].map((s,i)=>(
                <div key={i}>
                  <div style={{display:"flex",alignItems:"center",gap:10,padding:"7px 0"}}>
                    <div style={{width:24,height:24,borderRadius:"50%",background:`${s.color}15`,border:`2px solid ${s.color}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontSize:10,fontWeight:800,fontFamily:Fn.title,color:s.color}}>{s.step}</span></div>
                    <span style={{fontSize:12,fontWeight:600,color:C.cinzaEscuro,fontFamily:Fn.body,flex:1}}>{s.label}</span>
                    <code style={{fontSize:11,fontWeight:700,fontFamily:Fn.mono,color:s.color}}>{s.count}</code>
                  </div>
                  {i<3&&<div style={{width:2,height:10,background:C.cardBorder,marginLeft:11,borderRadius:1}}/>}
                </div>
              ))}
            </div>

            {/* Atividade */}
            <div style={{background:C.cardBg,borderRadius:"10px 10px 10px 18px",border:`1px solid ${C.cardBorder}`,padding:mob?14:18,boxShadow:"0 1px 3px rgba(0,75,155,.04)"}}>
              <span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title,display:"block",marginBottom:12}}>Atividade</span>
              {[
                {text:`${finalizadas} requisições finalizadas`,time:"este período",color:C.verdeFloresta,icon:(s:number,c:string)=><LuCircleCheck size={s} color={c}/>},
                {text:`${atrasadas} com SLA crítico`,time:"abaixo de 50%",color:C.danger,icon:(s:number,c:string)=><LuTriangleAlert size={s} color={c}/>},
                {text:`${aguardando} aguardando decisão`,time:"em análise",color:C.amareloEscuro,icon:(s:number,c:string)=><LuClock size={s} color={c}/>},
                {text:`R$ ${Math.round(filtered.reduce((a,r)=>a+r.valor,0)/1000)}k em valor total`,time:"filtrado",color:dark?"#93BDE4":C.azulProfundo,icon:(s:number,c:string)=><LuFileText size={s} color={c}/>},
              ].map((a,i)=>(
                <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:i<3?10:0}}>
                  <div style={{width:22,height:22,borderRadius:6,background:`${a.color}0A`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>{a.icon(11,a.color)}</div>
                  <div style={{flex:1}}><span style={{fontSize:11,color:C.cinzaEscuro,fontFamily:Fn.body,display:"block",lineHeight:1.4}}>{a.text}</span><span style={{fontSize:9,color:C.textMuted}}>{a.time}</span></div>
                </div>
              ))}
            </div>

            {/* Tendência mensal */}
            {(()=>{
              const data=sparkByMonth;const max=Math.max(...data),min=Math.min(...data);
              const cW=260,cH=80;
              const pts=data.map((v,i)=>({x:(i/(data.length-1))*cW,y:cH-((v-min)/(max-min||1))*(cH-10)+5}));
              const line=pts.map(p=>`${p.x},${p.y}`).join(" ");
              const area=`0,${cH} ${line} ${cW},${cH}`;
              const activeIdx=filter.month?MONTHS.indexOf(filter.month):-1;
              return(
                <div style={{background:C.cardBg,borderRadius:"10px 10px 10px 18px",border:`1px solid ${filter.month?(dark?"#93BDE4":C.azulProfundo):C.cardBorder}`,padding:mob?14:18,boxShadow:"0 1px 3px rgba(0,75,155,.04)",transition:"border-color .15s",position:"relative"}} onMouseMove={trackMouse}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
                    <div><span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title,display:"block"}}>Tendência mensal</span><span style={{fontSize:10,color:C.cinzaChumbo}}>Clique no ponto para filtrar</span></div>
                    <div style={{width:26,height:26,borderRadius:7,background:dark?"rgba(147,189,228,0.04)":`${C.azulProfundo}0A`,display:"flex",alignItems:"center",justifyContent:"center"}}><LuChartColumnIncreasing size={12} color={dark?"#93BDE4":C.azulProfundo}/></div>
                  </div>
                  <svg width="100%" height={cH+18} viewBox={`0 0 ${cW} ${cH+18}`} preserveAspectRatio="xMidYMid meet">
                    <defs><linearGradient id="lgLine" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={barColor} stopOpacity=".15"/><stop offset="100%" stopColor={barColor} stopOpacity="0"/></linearGradient></defs>
                    <polygon points={area} fill="url(#lgLine)"/>
                    <polyline points={line} fill="none" stroke={barColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    {pts.map((p,i)=>{
                      const isActive=activeIdx===i;const isDimmed=filter.month&&!isActive;
                      return <g key={i} onClick={()=>toggle("month",MONTHS[i])} onMouseEnter={()=>setHovSideLine(i)} onMouseLeave={()=>setHovSideLine(-1)} style={{cursor:"pointer"}}>
                        <circle cx={p.x} cy={p.y} r="12" fill="transparent"/>
                        <circle cx={p.x} cy={p.y} r={isActive?5:hovSideLine===i?4:2.5} fill={isDimmed?C.textLight:isActive?barColor:hovSideLine===i?barColor:C.cardBg} stroke={isDimmed?C.textLight:barColor} strokeWidth={isActive?2.5:1.5} style={{transition:"all .15s"}}/>
                        {isActive&&<><circle cx={p.x} cy={p.y} r="9" fill="none" stroke={barColor} strokeWidth="1" strokeDasharray="3 2" opacity=".5"/><text x={p.x} y={p.y-10} textAnchor="middle" fontSize="9" fontWeight="700" fill={barLabelColor} fontFamily={Fn.mono}>{data[i]}</text></>}
                        {i%2===0&&<text x={p.x} y={cH+14} textAnchor="middle" fontSize="7" fill={isActive?barColor:isDimmed?C.textLight:C.cinzaChumbo} fontFamily={Fn.body} fontWeight={isActive?700:400}>{MONTHS[i]}</text>}
                      </g>;
                    })}
                  </svg>
                  {tipSideLine&&<ChartTooltip {...tipSideLine} x={tipPos.x} y={tipPos.y}/>}
                </div>
              );
            })()}

            {/* MiniBar sidebar — por dia da semana */}
            <div style={{background:C.cardBg,borderRadius:"10px 10px 10px 18px",border:`1px solid ${C.cardBorder}`,padding:mob?14:18,boxShadow:"0 1px 3px rgba(0,75,155,.04)",position:"relative"}} onMouseMove={trackMouse}>
              <span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title,display:"block",marginBottom:12}}>Por dia da semana</span>
              {(()=>{
                const days=DAYS_LABELS;
                const vals=sideBarVals;
                const max2=Math.max(...vals,1);
                const bw=36,gp=12,cW=days.length*(bw+gp)-gp;
                return <svg width="100%" height={80} viewBox={`0 -12 ${cW} 92`} preserveAspectRatio="xMidYMid meet">{vals.map((v,i)=>{const bh=Math.max(4,(v/max2)*50);const isH=hovSideBar===i;return <g key={i} onMouseEnter={()=>setHovSideBar(i)} onMouseLeave={()=>setHovSideBar(-1)} style={{cursor:"pointer"}}><rect x={i*(bw+gp)} y={-12} width={bw} height={92} fill="transparent"/><rect x={i*(bw+gp)} y={50-bh+12} width={bw} height={bh} rx={5} fill={barColor} opacity={isH?1:.6+(.4*v/max2)}/><text x={i*(bw+gp)+bw/2} y={50-bh+6} textAnchor="middle" fontSize="10" fontWeight="700" fill={isH?barColor:barLabelColor} fontFamily={Fn.mono}>{v}</text><text x={i*(bw+gp)+bw/2} y={75} textAnchor="middle" fontSize="10" fill={isH?barColor:C.cinzaChumbo} fontFamily={Fn.body} fontWeight={isH?700:400}>{days[i]}</text></g>})}</svg>;
              })()}
              {tipSideBarData&&<ChartTooltip {...tipSideBarData} x={tipPos.x} y={tipPos.y}/>}
            </div>
          </div>
        </div>

        {/* ═══ STATUS D ═══ */}
        <div style={{marginTop:mob?16:24}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:mob?10:14}}>
            <div style={{width:30,height:30,borderRadius:8,background:dark?"rgba(147,189,228,0.04)":`${C.azulProfundo}0A`,display:"flex",alignItems:"center",justifyContent:"center"}}><LuChartColumnIncreasing size={14} color={dark?"#93BDE4":C.azulProfundo}/></div>
            <div><span style={{fontSize:14,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title,display:"block"}}>Status das solicitações</span><span style={{fontSize:10,color:C.cinzaChumbo}}>Distribuição por situação atual</span></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:mob?"repeat(2,1fr)":"repeat(4,1fr)",gap:mob?10:16}}>
            {[
              {label:"Solicitadas",value:total,color:dark?"#93BDE4":C.azulProfundo,pct:100,filterVal:null as string|null},
              {label:"Concluídas",value:finalizadas,color:C.verdeFloresta,pct:total?Math.round(finalizadas/total*100):0,filterVal:"Finalizada"},
              {label:"Em andamento",value:aguardando,color:C.amareloEscuro,pct:total?Math.round(aguardando/total*100):0,filterVal:"Aguardando"},
              {label:"Pendentes",value:filtered.filter(r=>r.status==="Recusada"||r.status==="Em análise").length,color:C.danger,pct:total?Math.round(filtered.filter(r=>r.status==="Recusada"||r.status==="Em análise").length/total*100):0,filterVal:"Recusada"},
            ].map((k,i)=>{
              const isActive=k.filterVal&&filter.status===k.filterVal;
              return(
                <div key={i} onClick={()=>k.filterVal&&toggle("status",k.filterVal)} onMouseEnter={()=>setHovStatusD(i)} onMouseLeave={()=>setHovStatusD(-1)} onMouseMove={trackMouse} style={{background:C.cardBg,borderRadius:"10px 10px 10px 18px",border:`1px solid ${isActive?k.color:C.cardBorder}`,padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",boxShadow:isActive?`0 4px 16px ${k.color}15`:"0 1px 3px rgba(0,75,155,.04)",cursor:k.filterVal?"pointer":"default",transition:"all .15s",position:"relative"}}>
                  <div>
                    <span style={{fontSize:10,fontWeight:600,color:isActive?k.color:C.cinzaChumbo,display:"block",marginBottom:3,textTransform:"uppercase",letterSpacing:".5px",transition:"color .15s"}}>{k.label}</span>
                    <span style={{fontSize:24,fontWeight:800,fontFamily:Fn.title,color:C.cinzaEscuro,display:"block",lineHeight:1}}>{k.value}</span>
                  </div>
                  <div style={{position:"relative",flexShrink:0}}>
                    <Donut pct={k.pct} color={k.color}/>
                    <span style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,fontFamily:Fn.mono,color:k.color}}>{k.pct}%</span>
                  </div>
                  {hovStatusD===i&&tipStatusD&&<ChartTooltip {...tipStatusD} x={tipPos.x} y={tipPos.y}/>}
                </div>
              );
            })}
          </div>
        </div>

        {/* ═══ DOCUMENTAÇÃO DO PADRÃO ═══ */}
        <div style={{marginTop:mob?24:40}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
            <div style={{width:36,height:36,borderRadius:10,background:dark?"rgba(147,189,228,0.04)":`${C.azulProfundo}0A`,display:"flex",alignItems:"center",justifyContent:"center"}}><LuFileText size={18} color={dark?"#93BDE4":C.azulProfundo}/></div>
            <div>
              <span style={{fontSize:16,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title,display:"block"}}>Regras do padrão Dashboard</span>
              <span style={{fontSize:11,color:C.cinzaChumbo}}>Diretrizes obrigatórias para todos os dashboards FIPS</span>
            </div>
          </div>

          {/* Regra 1 — Filtros */}
          <div style={{background:C.cardBg,borderRadius:"10px 10px 10px 18px",border:`1px solid ${C.cardBorder}`,padding:mob?16:24,marginBottom:16,boxShadow:"0 1px 3px rgba(0,75,155,.04)"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
              <div style={{width:26,height:26,borderRadius:7,background:dark?"rgba(147,189,228,0.07)":`${C.azulProfundo}12`,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:13,fontWeight:800,color:C.cinzaEscuro,fontFamily:Fn.title}}>1</span></div>
              <span style={{fontSize:14,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>Barra de filtros sempre no topo</span>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {[
                {r:"Posição fixa entre o Hero e os KPIs — nunca abaixo dos gráficos",icon:(s:number,c:string)=><LuChartColumnIncreasing size={s} color={c}/>},
                {r:"Usar o componente DSSelect do catálogo (custom dropdown, não nativo do navegador)",icon:(s:number,c:string)=><LuList size={s} color={c}/>},
                {r:"Cada select com ícone à esquerda (edificio, calendario, pessoa, flag, checkCircle)",icon:(s:number,c:string)=><LuLayoutGrid size={s} color={c}/>},
                {r:"Mínimo: Área/Processo, Ano, Mês, Solicitante, Prioridade, Status",icon:(s:number,c:string)=><LuFileText size={s} color={c}/>},
                {r:"Badges de filtros ativos abaixo da barra com cor semântica por categoria",icon:(s:number,c:string)=><LuCircleCheck size={s} color={c}/>},
                {r:"Botão 'Limpar' vermelho visível quando qualquer filtro está ativo",icon:(s:number,c:string)=><LuX size={s} color={c}/>},
                {r:"Contador 'X de Y registros' sempre visível na barra",icon:(s:number,c:string)=><LuTriangleAlert size={s} color={c}/>},
              ].map((item,i)=>(
                <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"6px 0"}}>
                  <div style={{width:20,height:20,borderRadius:6,background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>{item.icon(11,dark?"#93BDE4":C.azulProfundo)}</div>
                  <span style={{fontSize:12,color:C.cinzaEscuro,fontFamily:Fn.body,lineHeight:1.5}}>{item.r}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Regra 2 — Cross-filter */}
          <div style={{background:C.cardBg,borderRadius:"10px 10px 10px 18px",border:`1px solid ${C.cardBorder}`,padding:mob?16:24,marginBottom:16,boxShadow:"0 1px 3px rgba(0,75,155,.04)"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
              <div style={{width:26,height:26,borderRadius:7,background:dark?"rgba(147,189,228,0.07)":`${C.azulProfundo}12`,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:13,fontWeight:800,color:C.cinzaEscuro,fontFamily:Fn.title}}>2</span></div>
              <span style={{fontSize:14,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>Todos os gráficos com interação de filtro</span>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {[
                {r:"Todo gráfico clicável deve filtrar os demais (padrão Power BI cross-filter)",icon:(s:number,c:string)=><LuChartColumnIncreasing size={s} color={c}/>},
                {r:"Clicar no mesmo elemento de novo remove o filtro (toggle)",icon:(s:number,c:string)=><LuLayoutGrid size={s} color={c}/>},
                {r:"Elemento ativo: opacidade 100% + borda/anel de destaque",icon:(s:number,c:string)=><LuCircleCheck size={s} color={c}/>},
                {r:"Elementos inativos (dimmed): opacidade 15–30%",icon:(s:number,c:string)=><LuClock size={s} color={c}/>},
                {r:"Borda do card muda para a cor do filtro quando ativo",icon:(s:number,c:string)=><LuFileText size={s} color={c}/>},
                {r:"Filtros dos gráficos e dos selects são sincronizados (mesmo state)",icon:(s:number,c:string)=><LuList size={s} color={c}/>},
                {r:"Todos os KPIs, tabela, sidebar e Status D recalculam com o filtro",icon:(s:number,c:string)=><LuTriangleAlert size={s} color={c}/>},
                {r:"Hit areas transparentes maiores que o elemento visual (mínimo r=12 em SVG)",icon:(s:number,c:string)=><LuLayoutGrid size={s} color={c}/>},
              ].map((item,i)=>(
                <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"6px 0"}}>
                  <div style={{width:20,height:20,borderRadius:6,background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>{item.icon(11,C.verdeFloresta)}</div>
                  <span style={{fontSize:12,color:C.cinzaEscuro,fontFamily:Fn.body,lineHeight:1.5}}>{item.r}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Regra 3 — Rótulos de dados */}
          <div style={{background:C.cardBg,borderRadius:"10px 10px 10px 18px",border:`1px solid ${C.cardBorder}`,padding:mob?16:24,marginBottom:16,boxShadow:"0 1px 3px rgba(0,75,155,.04)"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
              <div style={{width:26,height:26,borderRadius:7,background:dark?"rgba(147,189,228,0.07)":`${C.azulProfundo}12`,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:13,fontWeight:800,color:C.cinzaEscuro,fontFamily:Fn.title}}>3</span></div>
              <span style={{fontSize:14,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>Rótulos de dados obrigatórios</span>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {[
                {r:"Bar chart: valor numérico acima de cada barra — sempre visível",icon:(s:number,c:string)=><LuChartColumnIncreasing size={s} color={c}/>},
                {r:"Line chart: valor nos pontos (hover ou sempre, conforme espaço disponível)",icon:(s:number,c:string)=><LuFileText size={s} color={c}/>},
                {r:"Donut: valor e % no centro ao passar mouse no segmento",icon:(s:number,c:string)=><LuLayoutGrid size={s} color={c}/>},
                {r:"Horizontal bar: valor + percentual à direita da barra",icon:(s:number,c:string)=><LuList size={s} color={c}/>},
                {r:"SLA: fração (ok/total) + percentual colorido por faixa (verde ≥90, amarelo ≥70, vermelho <70)",icon:(s:number,c:string)=><LuCircleCheck size={s} color={c}/>},
                {r:"KPI sparkline: meses visíveis embaixo (a cada 2), valores no hover do ponto",icon:(s:number,c:string)=><LuClock size={s} color={c}/>},
                {r:"Delta (%) do KPI: tooltip explicando a comparação ao passar mouse",icon:(s:number,c:string)=><LuTriangleAlert size={s} color={c}/>},
                {r:"ViewBox do SVG deve ter padding suficiente para não cortar rótulos",icon:(s:number,c:string)=><LuLayoutGrid size={s} color={c}/>},
              ].map((item,i)=>(
                <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"6px 0"}}>
                  <div style={{width:20,height:20,borderRadius:6,background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>{item.icon(11,C.amareloEscuro)}</div>
                  <span style={{fontSize:12,color:C.cinzaEscuro,fontFamily:Fn.body,lineHeight:1.5}}>{item.r}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Regra 4 — Hover e feedback */}
          <div style={{background:C.cardBg,borderRadius:"10px 10px 10px 18px",border:`1px solid ${C.cardBorder}`,padding:mob?16:24,marginBottom:16,boxShadow:"0 1px 3px rgba(0,75,155,.04)"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
              <div style={{width:26,height:26,borderRadius:7,background:dark?"rgba(147,189,228,0.07)":`${C.azulProfundo}12`,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:13,fontWeight:800,color:C.cinzaEscuro,fontFamily:Fn.title}}>4</span></div>
              <span style={{fontSize:14,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>Hover e feedback visual</span>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {[
                {r:"Toda área clicável deve ter cursor: pointer",icon:(s:number,c:string)=><LuLayoutGrid size={s} color={c}/>},
                {r:"Transições suaves em todas as mudanças visuais (transition: 0.12s–0.18s)",icon:(s:number,c:string)=><LuClock size={s} color={c}/>},
                {r:"Barras: opacidade aumenta no hover, borda tracejada ao selecionar",icon:(s:number,c:string)=><LuChartColumnIncreasing size={s} color={c}/>},
                {r:"Line chart: dot cresce no hover + valor aparece",icon:(s:number,c:string)=><LuFileText size={s} color={c}/>},
                {r:"Donut: stroke expande (+4) no hover, legenda destaca com fundo",icon:(s:number,c:string)=><LuCircleCheck size={s} color={c}/>},
                {r:"Horizontal bar: barra cresce (6→10px), label muda para cor da barra",icon:(s:number,c:string)=><LuList size={s} color={c}/>},
                {r:"Tabela: zebra azulCeu + hover amareloOuro por linha",icon:(s:number,c:string)=><LuLayoutGrid size={s} color={c}/>},
              ].map((item,i)=>(
                <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"6px 0"}}>
                  <div style={{width:20,height:20,borderRadius:6,background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>{item.icon(11,C.azulCeu)}</div>
                  <span style={{fontSize:12,color:C.cinzaEscuro,fontFamily:Fn.body,lineHeight:1.5}}>{item.r}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Regra 5 — Layout e exportação */}
          <div style={{background:C.cardBg,borderRadius:"10px 10px 10px 18px",border:`1px solid ${C.cardBorder}`,padding:mob?16:24,marginBottom:16,boxShadow:"0 1px 3px rgba(0,75,155,.04)"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
              <div style={{width:26,height:26,borderRadius:7,background:dark?"rgba(147,189,228,0.07)":`${C.azulProfundo}12`,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:13,fontWeight:800,color:C.cinzaEscuro,fontFamily:Fn.title}}>5</span></div>
              <span style={{fontSize:14,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>Layout, tabela e exportação</span>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {[
                {r:"Hero navy com título, subtítulo e botão de ação principal (amareloOuro)",icon:(s:number,c:string)=><LuFileText size={s} color={c}/>},
                {r:"KPIs em grid 4 colunas (2 no mobile) com sparkline de ponta a ponta",icon:(s:number,c:string)=><LuChartColumnIncreasing size={s} color={c}/>},
                {r:"Charts em grid 2 colunas (1 no mobile) — evitar 3 colunas se donut ficar apertado",icon:(s:number,c:string)=><LuLayoutGrid size={s} color={c}/>},
                {r:"Tabela: headers centralizados, avatar do solicitante, zebra, SLA com barra de progresso",icon:(s:number,c:string)=><LuList size={s} color={c}/>},
                {r:"Sidebar: fluxo (steps), atividade, gráfico de tendência e mini-bar",icon:(s:number,c:string)=><LuClock size={s} color={c}/>},
                {r:"Status D no final: cards clicáveis que filtram por status",icon:(s:number,c:string)=><LuCircleCheck size={s} color={c}/>},
                {r:"Botões de exportação (Excel + PDF) no header da tabela com ícones coloridos",icon:(s:number,c:string)=><LuTriangleAlert size={s} color={c}/>},
                {r:"PDF funcional: gera no client via Blob, inclui filtros ativos, paginação e footer FIPS",icon:(s:number,c:string)=><LuFileText size={s} color={c}/>},
              ].map((item,i)=>(
                <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"6px 0"}}>
                  <div style={{width:20,height:20,borderRadius:6,background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>{item.icon(11,C.danger)}</div>
                  <span style={{fontSize:12,color:C.cinzaEscuro,fontFamily:Fn.body,lineHeight:1.5}}>{item.r}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Checklist */}
          <div style={{background:`linear-gradient(135deg,${C.azulProfundo},${C.azulEscuro})`,borderRadius:"10px 10px 10px 18px",padding:mob?16:24,position:"relative",overflow:"hidden"}}>
            <JunctionLines style={{position:"absolute",top:-10,right:-20,width:300,height:180,opacity:.06}}/>
            <div style={{position:"relative"}}>
              <span style={{fontSize:14,fontWeight:700,color:C.amareloOuro,fontFamily:Fn.title,display:"block",marginBottom:12}}>Checklist antes de publicar</span>
              <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:8}}>
                {[
                  "Barra de filtros com DSSelect + ícones",
                  "Cross-filter em todos os gráficos",
                  "Rótulos de dados visíveis ou no hover",
                  "Tooltip no delta (%) dos KPIs",
                  "Hit areas maiores que o visual",
                  "Donut com pointerEvents:none no centro",
                  "Sparkline de ponta a ponta (sem margem)",
                  "Botões Excel e PDF na tabela",
                  "Tabela com zebra, avatar e SLA bar",
                  "Status D clicáveis filtram por status",
                  "Responsivo: 2 colunas no mobile",
                  "Footer com total R$ e contador filtrado",
                ].map((item,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:8}}>
                    <svg width={14} height={14} viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="14" height="14" rx="3" stroke={C.amareloOuro} strokeWidth="1.3"/><path d="M4.5 8.5l2 2 5-5" stroke={C.amareloOuro} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span style={{fontSize:11,color:`${C.branco}CC`,fontFamily:Fn.body}}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        </Copyable>

        <CodePlayground />

        <CodeExportSection items={[
          {
            label: 'Dashboard KPI Cards',
            description: 'Grid de 4 KPI cards com sparkline, delta e ícone. Padrão obrigatório do Dashboard FIPS.',
            code: `/* Dashboard KPI Cards — DS-FIPS
   4 cards em grid, cada um com:
   - Ícone em container 48x48 r14
   - Valor principal (Saira Expanded 28px 700)
   - Label (Open Sans 12px muted)
   - Delta % com seta (verde/vermelho)
   - Sparkline area chart

   CSS vars: --color-primary, --color-success, --color-accent-strong, --color-danger
*/

const kpis = [
  { label: 'Total', value: '1.247', delta: '+12%', up: true, color: '#004B9B' },
  { label: 'Aprovados', value: '892', delta: '+8%', up: true, color: 'var(--color-success)' },
  { label: 'Pendentes', value: '234', delta: '-3%', up: false, color: 'var(--color-accent-strong)' },
  { label: 'Urgentes', value: '121', delta: '+5%', up: true, color: 'var(--color-danger)' },
]

function KPIGrid() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
      {kpis.map(kpi => (
        <div key={kpi.label} style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '12px 12px 12px 24px',
          padding: 20,
        }}>
          <p style={{ fontSize: 12, color: '#7B8C96' }}>{kpi.label}</p>
          <p style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Saira Expanded', sans-serif", color: kpi.color }}>
            {kpi.value}
          </p>
          <span style={{ fontSize: 11, color: kpi.up ? 'var(--color-success)' : 'var(--color-danger)' }}>
            {kpi.delta}
          </span>
        </div>
      ))}
    </div>
  )
}`,
          },
          {
            label: 'Dashboard Layout Completo',
            description: 'Estrutura PageHero + filtros + KPIs + charts + tabela resumo.',
            code: `/* Dashboard Layout — DS-FIPS
   Ordem obrigatória: Header Navy > KPIs > Filtros > Charts > Tabela

   Tokens:
   --color-gov-gradient-from / --color-gov-gradient-to (header navy)
   --color-surface-muted (background)
   --color-surface (cards)
   --color-border (bordas)
   Fontes: Saira Expanded (titulos), Open Sans (corpo), Fira Code (valores)
*/

function DashboardPage() {
  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh' }}>
      {/* Header Navy — gradiente azul com titulo do modulo */}
      <div style={{
        background: 'linear-gradient(135deg, var(--color-gov-gradient-from), var(--color-gov-gradient-to))',
        borderRadius: '12px 12px 12px 24px',
        padding: '22px 26px', color: '#fff',
      }}>
        <h2 style={{ fontFamily: "'Saira Expanded', sans-serif", fontSize: 21, fontWeight: 700 }}>
          Painel de Requisicoes
        </h2>
      </div>

      {/* KPI Grid — sempre 4 cards, 2x2 no mobile */}
      {/* <KPIGrid /> */}

      {/* Toolbar — Filtros esquerda, Export direita */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0' }}>
        <div>{/* Filtros + Busca + Periodo */}</div>
        <div>{/* Excel + PDF */}</div>
      </div>

      {/* Charts area — grid flex */}
      {/* Tabela com header proprio (icone 48x48 + titulo Saira 16/700) */}
    </div>
  )
}`,
          },
        ]} />

        <div style={{textAlign:"center",padding:"24px 0 0",marginTop:24}}>
          <span style={{fontSize:11,color:C.cinzaChumbo,letterSpacing:".5px",fontFamily:Fn.title,fontWeight:400}}>DS-FIPS v0.4.2 · Ferrovia Interna do Porto de Santos · Excelência sobre trilhos · {new Date().getFullYear()}</span>
        </div>
      </div>
    </div>
    </PlaygroundProvider>
  );
}
