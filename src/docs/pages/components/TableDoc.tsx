/* eslint-disable @typescript-eslint/ban-ts-comment -- doc page synced from DS export bundle */
// @ts-nocheck
import { useState, useEffect, useMemo, useRef } from 'react'
import type { CSSProperties } from 'react'
import { CodeExportSection } from '../../components/CodeExport'
import { PlaygroundProvider, Copyable, CodePlayground } from '../../components/CodePlayground'

/* ═══════════════════════════════════════════ TOKENS ═══════════════════════════════════════════ */
const C={azulProfundo:"var(--color-gov-azul-profundo)",azulEscuro:"var(--color-gov-azul-escuro)",azulClaro:"var(--color-gov-azul-claro)",cinzaChumbo:"var(--color-fg-muted)",cinzaEscuro:"var(--color-fg)",cinzaClaro:"#C0CCD2",azulCeu:"#93BDE4",azulCeuClaro:"#D3E3F4",amareloOuro:"#FDC24E",amareloEscuro:"#F6921E",verdeFloresta:"#00C64C",verdeEscuro:"#00904C",danger:"#DC3545",neutro:"var(--color-surface-soft)",branco:"#FFFFFF",bg:"var(--color-surface-muted)",cardBg:"var(--color-surface)",cardBorder:"var(--color-border)",textMuted:"var(--color-fg-muted)",textLight:"var(--color-fg-muted)"};
const Fn={title:"'Saira Expanded',sans-serif",body:"'Open Sans',sans-serif",mono:"'Fira Code',monospace"};

/* ═══════════════════════════════════════════ ICONS ═══════════════════════════════════════════ */
const Ic={
  grid:(s=14,c=C.amareloOuro)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><rect x="2" y="2" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/><rect x="11" y="2" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/><rect x="2" y="11" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/><rect x="11" y="11" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/></svg>,
  sortAsc:(s=12,c=C.azulProfundo)=><svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M8 3v10M5 6l3-3 3 3" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  sortDesc:(s=12,c=C.azulProfundo)=><svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M8 13V3M5 10l3 3 3-3" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  sortNone:(s=12,c=C.cinzaClaro)=><svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M5 6l3-3 3 3M5 10l3 3 3-3" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  eye:(s=14,c=C.azulProfundo)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke={c} strokeWidth="1.5"/><circle cx="10" cy="10" r="2.5" stroke={c} strokeWidth="1.5"/></svg>,
  edit:(s=14,c=C.cinzaChumbo)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M12 3l5 5-10 10H2v-5L12 3z" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/></svg>,
};

function JunctionLines({ style }: { style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 320 200" fill="none" style={{ opacity: 0.12, ...style }}>
      <path d="M0 60H100C120 60 120 60 140 40L200 40H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round" />
      <path d="M0 60H100C120 60 120 60 140 80L200 80H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round" />
      <path d="M0 120H60C80 120 80 120 100 100L160 100H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round" />
      <path d="M0 120H60C80 120 80 120 100 140L160 140H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round" />
    </svg>
  )
}

/* ═══════════════════════════════════════════ BADGE ═══════════════════════════════════════════ */
const BV={sucesso:{bg:"#ECFDF5",color:C.verdeEscuro,border:"#A7F3D0"},atencao:{bg:"#FFF7ED",color:"#C2410C",border:"#FDBA74"},critico:{bg:"#FEF2F2",color:"#B91C1C",border:"#FECACA"},info:{bg:C.azulCeuClaro,color:C.azulEscuro,border:C.azulCeu},secondary:{bg:C.bg,color:C.cinzaEscuro,border:C.cardBorder}};
function Badge({variant="info",children,dot,size="sm"}){const v=BV[variant]||BV.info;return(<span style={{display:"inline-flex",alignItems:"center",gap:4,padding:`2px ${size==="sm"?6:8}px`,fontSize:size==="sm"?10:11,fontWeight:600,fontFamily:Fn.body,color:v.color,background:v.bg,border:`1px solid ${v.border}`,borderRadius:4,whiteSpace:"nowrap"}}>{dot&&<span style={{width:5,height:5,borderRadius:"50%",background:v.color}}/>}{children}</span>)}

/* ═══════════════════════════════════════════ MINI PROGRESS ═══════════════════════════════════════════ */
function MiniProgress({value=0}){
  const color=value>=90?C.verdeEscuro:value>=60?C.verdeFloresta:value>=30?C.amareloEscuro:C.danger;
  return(<div style={{display:"flex",alignItems:"center",gap:6}}><div style={{flex:1,height:4,borderRadius:2,background:`${color}20`}}><div style={{height:4,borderRadius:2,background:color,width:`${value}%`}}/></div><span style={{fontSize:10,fontWeight:600,color,fontFamily:Fn.mono,minWidth:28,textAlign:"right"}}>{value}%</span></div>);
}

/* ═══════════════════════════════════════════ AVATAR ═══════════════════════════════════════════ */
function Avatar({name,photo}){
  const parts=(name||"").split(" ").filter(Boolean);
  const initials=parts.length>=2?`${parts[0][0]}${parts[parts.length-1][0]}`:parts[0]?parts[0][0]:"?";
  if(photo)return <img src={photo} alt={name} style={{width:32,height:32,borderRadius:"50%",objectFit:"cover",flexShrink:0,border:`1px solid ${C.cardBorder}`}}/>;
  return(<div style={{width:32,height:32,borderRadius:"50%",background:C.bg,border:`1px solid ${C.cardBorder}`,color:C.cinzaChumbo,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,fontFamily:Fn.title,flexShrink:0,letterSpacing:".5px"}}>{initials.toUpperCase()}</div>);
}

/* ═══════════════════════════════════════════
   TABLE COMPONENT
   ═══════════════════════════════════════════ */
function DSTable({columns=[],data=[],striped=true,compact,bordered,selectable,sortable=true,emptyText,loading,footer,paginate,perPageOptions,title,subtitle,icon,iconBg,iconBorder,configurable}){
  const [sortCol,setSortCol]=useState(null);
  const [sortDir,setSortDir]=useState("asc");
  const [selected,setSelected]=useState([]);
  const [hoverRow,setHoverRow]=useState(-1);
  const [page,setPage]=useState(1);
  const [perPage,setPerPage]=useState(paginate||0);
  const [hiddenCols,setHiddenCols]=useState([]);
  const [showColMenu,setShowColMenu]=useState(false);
  const [colOrder,setColOrder]=useState(()=>columns.map(c=>c.key));
  const [dragIdx,setDragIdx]=useState(null);
  const [dragOverIdx,setDragOverIdx]=useState(null);
  const [configTab,setConfigTab]=useState("colunas");
  const [densityS,setDensityS]=useState(compact?"compact":"normal");
  const [stripedS,setStripedS]=useState(striped);
  const [borderedS,setBorderedS]=useState(!!bordered);
  const [stickyHS,setStickyHS]=useState(false);
  const [wrapTextS,setWrapTextS]=useState(false);
  const configRef=useRef(null);

  useEffect(()=>{
    if(!showColMenu)return;
    const h=e=>{if(configRef.current&&!configRef.current.contains(e.target))setShowColMenu(false)};
    document.addEventListener("mousedown",h);
    return()=>document.removeEventListener("mousedown",h);
  },[showColMenu]);

  const toggleCol=(key)=>setHiddenCols(h=>h.includes(key)?h.filter(k=>k!==key):[...h,key]);
  const orderedCols=colOrder.map(k=>columns.find(c=>c.key===k)).filter(Boolean);
  const visibleCols=orderedCols.filter(c=>!hiddenCols.includes(c.key));

  const handleDragStart=(i)=>setDragIdx(i);
  const handleDragOver=(e,i)=>{e.preventDefault();setDragOverIdx(i)};
  const handleDrop=(i)=>{
    if(dragIdx===null||dragIdx===i)return;
    const newOrder=[...colOrder];
    const [moved]=newOrder.splice(dragIdx,1);
    newOrder.splice(i,0,moved);
    setColOrder(newOrder);
    setDragIdx(null);setDragOverIdx(null);
  };
  const handleDragEnd=()=>{setDragIdx(null);setDragOverIdx(null)};

  const toggleSort=(key)=>{
    if(!sortable)return;
    if(sortCol===key){setSortDir(d=>d==="asc"?"desc":"asc")}
    else{setSortCol(key);setSortDir("asc")}
  };

  const sorted=useMemo(()=>{
    if(!sortCol)return data;
    return [...data].sort((a,b)=>{
      const av=a[sortCol];const bv=b[sortCol];
      if(typeof av==="number"&&typeof bv==="number")return sortDir==="asc"?av-bv:bv-av;
      const as=String(av||"").toLowerCase();const bs=String(bv||"").toLowerCase();
      return sortDir==="asc"?as.localeCompare(bs):bs.localeCompare(as);
    });
  },[data,sortCol,sortDir]);

  const totalPages=perPage?Math.ceil(sorted.length/perPage):1;
  const paged=perPage?sorted.slice((page-1)*perPage,page*perPage):sorted;
  const startIdx=perPage?(page-1)*perPage+1:1;
  const endIdx=perPage?Math.min(page*perPage,sorted.length):sorted.length;

  const allSelected=selected.length===paged.length&&paged.length>0;
  const toggleAll=()=>setSelected(allSelected?[]:paged.map((_,i)=>i));
  const toggleRow=(i)=>setSelected(s=>s.includes(i)?s.filter(x=>x!==i):[...s,i]);

  // Densidade idêntica à do Data Listing (`DENSITY` em DataListingDemo.tsx): altura de
  // linha fixa (não padding vertical), que é o que mantém a tabela densa e previsível.
  const D=densityS==="compact"?{rowH:30,fs:11,padX:12}:densityS==="comfortable"?{rowH:56,fs:13,padX:20}:{rowH:42,fs:12,padX:16};
  const py=8; // padding vertical só do thead — o corpo usa rowH

  const pgBtn=(label,disabled,onClick)=><button onClick={onClick} disabled={disabled} style={{padding:"4px 10px",fontSize:11,fontWeight:600,fontFamily:Fn.body,background:disabled?"transparent":C.cardBg,color:disabled?C.textLight:C.azulProfundo,border:`1px solid ${disabled?C.cardBorder:C.azulCeu}`,borderRadius:5,cursor:disabled?"default":"pointer",transition:"all .15s"}}>{label}</button>;

  return(
    <div style={{border:`1px solid ${C.cardBorder}`,borderRadius:"12px 12px 12px 24px",overflow:"hidden",background:C.cardBg,boxShadow:"0 1px 3px rgba(0,75,155,.04)",position:"relative"}}>
      {/* Title bar — mesma anatomia do header do card de Data Listing (DataListingDemo.tsx:593-598):
          padding 18/20/14, borda inferior, ícone 48 com aro azul, título 16/1.2, subtítulo 11/1.4. */}
      {(title||configurable)&&(
        <div style={{padding:"18px 20px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:14,borderBottom:`1px solid ${C.cardBorder}`}}>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            {icon&&<div style={{width:48,height:48,borderRadius:14,background:iconBg||C.bg,border:`1px solid ${iconBorder||C.cardBorder}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{icon}</div>}
            <div>
              {title&&<h3 style={{fontSize:16,fontWeight:700,color:C.cinzaEscuro,margin:0,lineHeight:1.2,fontFamily:Fn.title}}>{title}</h3>}
              {subtitle&&<p style={{fontSize:11,color:C.cinzaChumbo,margin:"3px 0 0",lineHeight:1.4,fontFamily:Fn.body}}>{subtitle}</p>}
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            {configurable&&(
              <div ref={configRef} style={{position:"relative"}}>
                <button onClick={()=>setShowColMenu(v=>!v)} style={{display:"inline-flex",alignItems:"center",gap:6,padding:"7px 12px",fontSize:11,fontWeight:600,fontFamily:Fn.body,color:showColMenu?C.azulProfundo:C.cinzaEscuro,background:showColMenu?C.azulCeuClaro:C.cardBg,border:`1px solid ${showColMenu?C.azulProfundo:C.cardBorder}`,borderRadius:8,cursor:"pointer",transition:"all .15s"}}>
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M3 5h6M13 5h4M3 10h2M9 10h8M3 15h10M17 15h0" stroke={showColMenu?C.azulProfundo:C.cinzaChumbo} strokeWidth="1.6" strokeLinecap="round"/><circle cx="11" cy="5" r="1.6" fill={showColMenu?C.azulProfundo:C.cinzaChumbo}/><circle cx="7" cy="10" r="1.6" fill={showColMenu?C.azulProfundo:C.cinzaChumbo}/><circle cx="15" cy="15" r="1.6" fill={showColMenu?C.azulProfundo:C.cinzaChumbo}/></svg>
                  Configurar
                </button>
                {showColMenu&&(
                  <div style={{position:"absolute",top:"calc(100% + 6px)",right:0,zIndex:50,width:300,background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:"10px 10px 10px 16px",boxShadow:"0 12px 36px rgba(0,42,104,.18),0 2px 8px rgba(0,42,104,.06)",overflow:"hidden"}}>
                    {/* Header */}
                    <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.cardBorder}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                      <span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>Configurações</span>
                      <button onClick={()=>setShowColMenu(false)} style={{width:22,height:22,background:"transparent",border:"none",cursor:"pointer",borderRadius:5,display:"flex",alignItems:"center",justifyContent:"center"}}>
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke={C.cinzaChumbo} strokeWidth="1.8" strokeLinecap="round"/></svg>
                      </button>
                    </div>
                    {/* Tabs */}
                    <div style={{display:"flex",borderBottom:`1px solid ${C.cardBorder}`,background:C.bg}}>
                      {[
                        {id:"colunas",label:"Colunas"},
                        {id:"densidade",label:"Densidade"},
                        {id:"aparencia",label:"Aparência"},
                      ].map(t=>(
                        <button key={t.id} onClick={()=>setConfigTab(t.id)} style={{flex:1,padding:"9px 8px",fontSize:11,fontWeight:600,fontFamily:Fn.body,color:configTab===t.id?C.azulProfundo:C.cinzaChumbo,background:configTab===t.id?C.cardBg:"transparent",border:"none",borderBottom:`2px solid ${configTab===t.id?C.azulProfundo:"transparent"}`,cursor:"pointer",transition:"all .12s"}}>{t.label}</button>
                      ))}
                    </div>
                    {/* Body */}
                    <div style={{padding:"12px 0",maxHeight:320,overflowY:"auto"}}>
                      {configTab==="colunas"&&(
                        <>
                          <div style={{padding:"0 14px 8px",fontSize:9,fontWeight:700,letterSpacing:".5px",textTransform:"uppercase",color:C.cinzaChumbo,fontFamily:Fn.title}}>Arraste para ordenar</div>
                          {colOrder.map((key,i)=>{
                            const col=columns.find(c=>c.key===key);
                            if(!col)return null;
                            const isDrag=dragIdx===i;
                            const isOver=dragOverIdx===i;
                            return(
                              <div key={key} draggable onDragStart={()=>handleDragStart(i)} onDragOver={e=>handleDragOver(e,i)} onDrop={()=>handleDrop(i)} onDragEnd={handleDragEnd}
                                style={{display:"flex",alignItems:"center",gap:8,padding:"7px 14px",fontSize:12,color:C.cinzaEscuro,fontFamily:Fn.body,cursor:"grab",transition:"background .1s",opacity: isDrag ? 0.4 : 1,background:isOver?`${C.azulCeu}15`:"transparent",borderTop:isOver?`2px solid ${C.azulProfundo}`:"2px solid transparent"}}
                                onMouseEnter={e=>{if(!isDrag)e.currentTarget.style.background=C.bg}}
                                onMouseLeave={e=>{if(!isOver)e.currentTarget.style.background="transparent"}}
                              >
                                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{flexShrink:0,opacity:.35,cursor:"grab"}}>
                                  <circle cx="5" cy="3" r="1.2" fill={C.cinzaChumbo}/><circle cx="11" cy="3" r="1.2" fill={C.cinzaChumbo}/>
                                  <circle cx="5" cy="8" r="1.2" fill={C.cinzaChumbo}/><circle cx="11" cy="8" r="1.2" fill={C.cinzaChumbo}/>
                                  <circle cx="5" cy="13" r="1.2" fill={C.cinzaChumbo}/><circle cx="11" cy="13" r="1.2" fill={C.cinzaChumbo}/>
                                </svg>
                                <div onMouseDown={e=>e.stopPropagation()} onClick={e=>{e.stopPropagation();toggleCol(key)}} style={{width:14,height:14,borderRadius:3,border:`1.5px solid ${!hiddenCols.includes(key)?C.azulProfundo:C.cardBorder}`,background:!hiddenCols.includes(key)?C.azulProfundo:C.branco,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,cursor:"pointer"}}>{!hiddenCols.includes(key)&&<svg width="10" height="10" viewBox="0 0 16 16" fill="none"><path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke={C.branco} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>}</div>
                                <span style={{flex:1}} onMouseDown={e=>e.stopPropagation()} onClick={e=>{e.stopPropagation();toggleCol(key)}}>{col.label||key}</span>
                              </div>
                            );
                          })}
                        </>
                      )}
                      {configTab==="densidade"&&(
                        <div style={{padding:"4px 14px",display:"flex",flexDirection:"column",gap:4}}>
                          {[
                            {id:"compact",label:"Compacta",desc:"30px · alta densidade"},
                            {id:"normal",label:"Normal",desc:"42px · padrão"},
                            {id:"comfortable",label:"Confortável",desc:"56px · acessível"},
                          ].map(d=>(
                            <div key={d.id} onClick={()=>setDensityS(d.id)} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",borderRadius:6,cursor:"pointer",background:densityS===d.id?C.azulCeuClaro:"transparent",transition:"background .1s"}} onMouseEnter={e=>{if(densityS!==d.id)e.currentTarget.style.background=C.bg}} onMouseLeave={e=>{if(densityS!==d.id)e.currentTarget.style.background="transparent"}}>
                              <div style={{width:14,height:14,borderRadius:"50%",border:`1.5px solid ${densityS===d.id?C.azulProfundo:C.cardBorder}`,background:densityS===d.id?C.azulProfundo:C.branco,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{densityS===d.id&&<div style={{width:5,height:5,borderRadius:"50%",background:C.branco}}/>}</div>
                              <div style={{flex:1}}>
                                <div style={{fontSize:12,fontWeight:600,color:C.cinzaEscuro,fontFamily:Fn.body}}>{d.label}</div>
                                <div style={{fontSize:10,color:C.cinzaChumbo,marginTop:1}}>{d.desc}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {configTab==="aparencia"&&(
                        <div style={{padding:"4px 14px",display:"flex",flexDirection:"column",gap:2}}>
                          {[
                            {id:"zebra",label:"Linhas zebradas",val:stripedS,set:setStripedS},
                            {id:"borders",label:"Bordas verticais",val:borderedS,set:setBorderedS},
                            {id:"sticky",label:"Header fixo",val:stickyHS,set:setStickyHS},
                            {id:"wrap",label:"Quebra de linha",val:wrapTextS,set:setWrapTextS},
                          ].map(t=>(
                            <div key={t.id} onClick={()=>t.set(!t.val)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 10px",borderRadius:6,cursor:"pointer",transition:"background .1s"}} onMouseEnter={e=>{e.currentTarget.style.background=C.bg}} onMouseLeave={e=>{e.currentTarget.style.background="transparent"}}>
                              <span style={{fontSize:12,fontWeight:600,color:C.cinzaEscuro,fontFamily:Fn.body}}>{t.label}</span>
                              <div style={{width:30,height:16,borderRadius:8,background:t.val?C.azulProfundo:C.cardBorder,position:"relative",transition:"background .15s"}}>
                                <div style={{position:"absolute",top:2,left:t.val?16:2,width:12,height:12,borderRadius:"50%",background:C.branco,boxShadow:"0 1px 2px rgba(0,0,0,.2)",transition:"left .15s"}}/>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {/* Footer */}
                    <div style={{padding:"10px 14px",borderTop:`1px solid ${C.cardBorder}`,background:C.bg,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <button onClick={()=>{setHiddenCols([]);setColOrder(columns.map(c=>c.key));setDensityS(compact?"compact":"normal");setStripedS(striped);setBorderedS(!!bordered);setStickyHS(false);setWrapTextS(false)}} style={{fontSize:10,color:C.cinzaChumbo,background:"transparent",border:"none",cursor:"pointer",fontFamily:Fn.body,fontWeight:600}}>Restaurar padrão</button>
                      <button onClick={()=>setShowColMenu(false)} style={{padding:"6px 12px",fontSize:11,fontWeight:700,color:C.branco,background:C.azulProfundo,border:"none",borderRadius:6,cursor:"pointer",fontFamily:Fn.body}}>Aplicar</button>
                    </div>
                  </div>
                )}
              </div>
            )}
            {perPage>0&&<span style={{fontSize:11,color:C.textMuted,fontFamily:Fn.body,whiteSpace:"nowrap"}}>Mostrando {startIdx}–{endIdx} de {sorted.length}</span>}
          </div>
        </div>
      )}
      <div style={{overflowX:"auto",...(stickyHS?{maxHeight:420,overflowY:"auto"}:{})}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontFamily:Fn.body}}>
          <thead style={stickyHS?{position:"sticky",top:0,zIndex:2,background:C.bg,boxShadow:`0 1px 0 ${C.cardBorder}`}:undefined}>
            <tr style={{background:C.bg}}>
              {selectable&&<th style={{padding:`${py}px ${D.padX}px`,width:36,...(borderedS?{borderRight:`1px solid ${C.cardBorder}`}:{})}}><input type="checkbox" checked={allSelected} onChange={toggleAll} style={{cursor:"pointer",}}/></th>}
              {visibleCols.map((col,ci)=>(
                <th key={col.key} onClick={()=>col.sortable!==false&&toggleSort(col.key)} style={{padding:`${py}px ${D.padX}px`,textAlign:col.align||"left",fontSize:9,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.cinzaChumbo,fontFamily:Fn.title,cursor:col.sortable!==false&&sortable?"pointer":"default",userSelect:"none",borderBottom:`2px solid ${C.cardBorder}`,whiteSpace:"nowrap",transition:"color .15s",...(borderedS&&ci<visibleCols.length-1?{borderRight:`1px solid ${C.cardBorder}`}:{}),...(col.width?{width:col.width}:{})}}>
                  <span style={{display:"inline-flex",alignItems:"center",gap:4}}>
                    {col.label}
                    {sortable&&col.sortable!==false&&(sortCol===col.key?sortDir==="asc"?Ic.sortAsc(12,C.azulProfundo):Ic.sortDesc(12,C.azulProfundo):Ic.sortNone(12))}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading&&Array.from({length:5}).map((_,ri)=>(
              <tr key={`sk${ri}`} style={{height:D.rowH,borderBottom:`1px solid ${C.cardBorder}`}}>
                {selectable&&<td style={{padding:`0 ${D.padX}px`}}><div className="ds-shim" style={{width:16,height:16,borderRadius:3}}/></td>}
                {visibleCols.map((col,ci)=>(
                  <td key={ci} style={{padding:`0 ${D.padX}px`}}>
                    {ci===0?(
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <div className="ds-shim" style={{width:32,height:32,borderRadius:"50%",flexShrink:0}}/>
                        <div style={{flex:1}}>
                          <div className="ds-shim" style={{height:12,borderRadius:4,width:"65%",marginBottom:5}}/>
                          <div className="ds-shim" style={{height:8,borderRadius:3,width:"40%"}}/>
                        </div>
                      </div>
                    ):(
                      <div className="ds-shim" style={{height:compact?10:12,borderRadius:4,width:`${40+((ci*17+ri*23)%40)}%`}}/>
                    )}
                  </td>
                ))}
              </tr>
            ))}
            {!loading&&paged.length===0&&(
              <tr><td colSpan={visibleCols.length+(selectable?1:0)} style={{padding:"56px 16px",textAlign:"center"}}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
                  {/* Empty illustration */}
                  <div style={{position:"relative",width:80,height:80}}>
                    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{animation:"floatUp 3s ease-in-out infinite"}}>
                      {/* Folder base */}
                      <rect x="10" y="24" width="60" height="42" rx="4" fill={C.bg} stroke={C.cardBorder} strokeWidth="2"/>
                      {/* Folder tab */}
                      <path d="M10 28V20a4 4 0 014-4h16l4 8H10z" fill={C.bg} stroke={C.cardBorder} strokeWidth="2"/>
                      {/* Lines inside */}
                      <rect x="24" y="38" width="32" height="3" rx="1.5" fill={C.cardBorder}/>
                      <rect x="28" y="46" width="24" height="3" rx="1.5" fill={C.cardBorder}/>
                      <rect x="32" y="54" width="16" height="3" rx="1.5" fill={C.cardBorder}/>
                      {/* Magnifying glass */}
                      <circle cx="60" cy="58" r="9" fill={C.cardBg} stroke={C.azulCeu} strokeWidth="2.5"/>
                      <path d="M66 64l6 6" stroke={C.azulCeu} strokeWidth="2.5" strokeLinecap="round"/>
                      <path d="M57 58h6M60 55v6" stroke={C.azulCeu} strokeWidth="1.5" strokeLinecap="round" opacity=".5"/>
                    </svg>
                  </div>
                  <span style={{fontSize:15,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>{emptyText||"Nenhum registro encontrado"}</span>
                  <span style={{fontSize:12,color:C.textMuted,fontFamily:Fn.body,maxWidth:300}}>Tente ajustar os filtros ou realizar uma nova busca para encontrar resultados.</span>
                </div>
              </td></tr>
            )}
            {!loading&&paged.map((row,i)=>{
              const isSelected=selected.includes(i);
              const isHover=hoverRow===i;
              const rowBg=isSelected?`${C.azulCeu}20`:isHover?`${C.amareloOuro}18`:stripedS&&i%2===1?`${C.azulCeuClaro}40`:"transparent";
              return(
                <tr key={i} onMouseEnter={()=>setHoverRow(i)} onMouseLeave={()=>setHoverRow(-1)} style={{height:wrapTextS?undefined:D.rowH,background:rowBg,transition:"background .12s",cursor:selectable?"pointer":"default",...(borderedS?{borderBottom:`1px solid ${C.cardBorder}`}:{borderBottom:i<paged.length-1?`1px solid ${C.cardBorder}`:"none"})}} onClick={()=>selectable&&toggleRow(i)}>
                  {selectable&&<td style={{padding:`0 ${D.padX}px`,...(borderedS?{borderRight:`1px solid ${C.cardBorder}`}:{})}}><input type="checkbox" checked={isSelected} onChange={()=>toggleRow(i)} style={{cursor:"pointer",}}/></td>}
                  {visibleCols.map((col,ci)=>(
                    <td key={col.key} style={{padding:wrapTextS?`10px ${D.padX}px`:`0 ${D.padX}px`,fontSize:D.fs,color:C.cinzaEscuro,textAlign:col.align||"left",whiteSpace:wrapTextS?"normal":"nowrap",...(borderedS&&ci<visibleCols.length-1?{borderRight:`1px solid ${C.cardBorder}`}:{})}}>
                      {col.render?col.render(row[col.key],row):row[col.key]}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Footer: pagination + custom content */}
      {(footer||perPage>0)&&(
        <div style={{padding:"10px 16px",borderTop:`1px solid ${C.cardBorder}`,background:C.bg,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap",fontSize:11,color:C.cinzaChumbo,fontFamily:Fn.body}}>
          {footer&&<div style={{display:"flex",alignItems:"center",gap:12,flex:1}}>{footer}</div>}
          {perPage>0&&(
            <div style={{display:"flex",alignItems:"center",gap:8,marginLeft:"auto"}}>
              {perPageOptions&&(
                <div style={{display:"flex",alignItems:"center",gap:4}}>
                  <span style={{fontSize:11,color:C.textMuted}}>Linhas:</span>
                  <select value={perPage} onChange={e=>{setPerPage(Number(e.target.value));setPage(1)}} style={{padding:"2px 4px",fontSize:11,border:`1px solid ${C.cardBorder}`,borderRadius:4,background:C.cardBg,color:C.cinzaEscuro,fontFamily:Fn.body,cursor:"pointer"}}>
                    {perPageOptions.map(n=><option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              )}
              <span style={{fontSize:11,color:C.textMuted}}>{startIdx}–{endIdx} de {sorted.length}</span>
              {pgBtn("‹",page<=1,()=>setPage(p=>Math.max(1,p-1)))}
              {totalPages<=5?Array.from({length:totalPages}).map((_,i)=>(
                <button key={i} onClick={()=>setPage(i+1)} style={{width:24,height:24,fontSize:11,fontWeight:page===i+1?700:400,fontFamily:Fn.body,background:page===i+1?C.azulProfundo:"transparent",color:page===i+1?C.branco:C.cinzaChumbo,border:page===i+1?"none":`1px solid ${C.cardBorder}`,borderRadius:5,cursor:"pointer"}}>{i+1}</button>
              )):(<span style={{fontSize:11,color:C.cinzaChumbo,fontFamily:Fn.mono}}>{page}/{totalPages}</span>)}
              {pgBtn("›",page>=totalPages,()=>setPage(p=>Math.min(totalPages,p+1)))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════ ACTION BTNS ═══════════════════════════════════════════ */
function ActionBtn({icon,onClick,title}){return <span onClick={onClick} title={title} style={{display:"flex",cursor:"pointer",opacity:.5,padding:3,borderRadius:4,transition:"all .15s"}} onMouseEnter={e=>{e.currentTarget.style.opacity="1";e.currentTarget.style.background=C.bg}} onMouseLeave={e=>{e.currentTarget.style.opacity=".5";e.currentTarget.style.background="transparent"}}>{icon}</span>}

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

/* ═══════════════════════════════════════════ DATA ═══════════════════════════════════════════ */
const reqData=[
  {id:"REQ-4025",solicitante:"Carlos Santos",cargo:"Técnico de Segurança",dept:"SSMA",valor:2450,status:"Pendente",sla:72},
  {id:"REQ-4024",solicitante:"Ana Costa",cargo:"Supervisora de Pátio",dept:"Operações",valor:8900,status:"Aprovada",sla:94},
  {id:"REQ-4023",solicitante:"Marcos Oliveira",cargo:"Analista de Logística",dept:"Logística",valor:1200,status:"Aprovada",sla:88},
  {id:"REQ-4022",solicitante:"Julia Ferreira",cargo:"Coordenadora de TI",dept:"TI",valor:15600,status:"Rejeitada",sla:45},
  {id:"REQ-4021",solicitante:"Pedro Lima",cargo:"Inspetor SSMA",dept:"SSMA",valor:3200,status:"Pendente",sla:60},
  {id:"REQ-4020",solicitante:"Rafaela Mendes",cargo:"Analista de RH",dept:"RH",valor:4500,status:"Aprovada",sla:96},
  {id:"REQ-4019",solicitante:"Lucas Almeida",cargo:"Operador de Pátio",dept:"Logística",valor:6800,status:"Aprovada",sla:85},
  {id:"REQ-4018",solicitante:"Camila Rocha",cargo:"Eng. de Operações",dept:"Operações",valor:1900,status:"Pendente",sla:55},
  {id:"REQ-4017",solicitante:"Fernando Dias",cargo:"Dev Full Stack",dept:"TI",valor:22000,status:"Aprovada",sla:91},
  {id:"REQ-4016",solicitante:"Beatriz Nunes",cargo:"Técnica de Segurança",dept:"SSMA",valor:780,status:"Rejeitada",sla:32},
  {id:"REQ-4015",solicitante:"Ricardo Souza",cargo:"Gestor Logístico",dept:"Logística",valor:5400,status:"Aprovada",sla:89},
  {id:"REQ-4014",solicitante:"Patrícia Gomes",cargo:"Analista de DP",dept:"RH",valor:3100,status:"Pendente",sla:67},
];
const statusMap={Aprovada:"sucesso",Pendente:"atencao",Rejeitada:"critico"};

const fornData=[
  {nome:"MRS Logística",cnpj:"01.417.222/0001-77",responsavel:"Roberto Alves",cargoResp:"Diretor Comercial",cidade:"Juiz de Fora",seg:"Ferroviário",status:"Ativo",score:94},
  {nome:"VLI Multimodal",cnpj:"27.316.349/0001-78",responsavel:"Marina Silva",cargoResp:"Gerente de Contas",cidade:"Belo Horizonte",seg:"Multimodal",status:"Ativo",score:88},
  {nome:"Brado Logística",cnpj:"09.232.541/0001-30",responsavel:"Thiago Pinto",cargoResp:"Coord. Operacional",cidade:"Curitiba",seg:"Contêiner",status:"Pendente",score:71},
  {nome:"Rumo S.A.",cnpj:"02.387.125/0001-10",responsavel:"Carla Duarte",cargoResp:"Key Account",cidade:"São Paulo",seg:"Ferroviário",status:"Ativo",score:92},
  {nome:"ALL Malha Sul",cnpj:"05.156.887/0001-49",responsavel:"João Moreira",cargoResp:"Gestor Logístico",cidade:"Curitiba",seg:"Grãos",status:"Inativo",score:40},
];
const statusForn={Ativo:"sucesso",Pendente:"atencao",Inativo:"critico"};

/* ═══════════════════════════════════════════ MAIN ═══════════════════════════════════════════ */
/* ═══════════════════════════════════════════ EXPORT CODE ═══════════════════════════════════════════ */
const tableExportCode = `// DS-FIPS — Table with sorting & pagination — Copy-paste ready
import { useState, useMemo } from "react";

const C = {
  azulProfundo: "#004B9B",
  azulEscuro: "#002A68",
  cinzaChumbo: "#7B8C96",
  cinzaEscuro: "#333B41",
  cinzaClaro: "#C0CCD2",
  azulCeu: "#93BDE4",
  azulCeuClaro: "#D3E3F4",
  amareloOuro: "#FDC24E",
  verdeFloresta: "#00C64C",
  branco: "#FFFFFF",
  bg: "#F8FAFC",
  cardBg: "#FFFFFF",
  cardBorder: "#E2E8F0",
  textLight: "#7B8C96",
};

const Fn = {
  title: "'Saira Expanded', sans-serif",
  body: "'Open Sans', sans-serif",
  mono: "'Fira Code', monospace",
};

interface Column {
  key: string;
  label: string;
  width?: number | string;
  align?: "left" | "center" | "right";
  render?: (value: any, row: any) => React.ReactNode;
}

export function DSTable({
  columns = [], data = [], striped = true, compact = false,
  sortable = true, paginate = 0, footer,
}: {
  columns: Column[]; data: any[]; striped?: boolean; compact?: boolean;
  sortable?: boolean; paginate?: number; footer?: React.ReactNode;
}) {
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [hoverRow, setHoverRow] = useState(-1);
  const py = compact ? 6 : 10;
  const fs = compact ? 11 : 12;

  const toggleSort = (key: string) => {
    if (!sortable) return;
    if (sortCol === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortCol(key); setSortDir("asc"); }
  };

  const sorted = useMemo(() => {
    if (!sortCol) return data;
    return [...data].sort((a, b) => {
      const av = a[sortCol], bv = b[sortCol];
      if (typeof av === "number" && typeof bv === "number") return sortDir === "asc" ? av - bv : bv - av;
      return sortDir === "asc" ? String(av || "").localeCompare(String(bv || "")) : String(bv || "").localeCompare(String(av || ""));
    });
  }, [data, sortCol, sortDir]);

  const totalPages = paginate ? Math.ceil(sorted.length / paginate) : 1;
  const paged = paginate ? sorted.slice((page - 1) * paginate, page * paginate) : sorted;

  const SortIcon = ({ col }: { col: string }) => {
    if (sortCol !== col) return <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M5 6l3-3 3 3M5 10l3 3 3-3" stroke={C.cinzaClaro} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    return sortDir === "asc"
      ? <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M5 6l3-3 3 3" stroke={C.azulProfundo} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
      : <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M8 13V3M5 10l3 3 3-3" stroke={C.azulProfundo} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  };

  return (
    <div style={{ border: \`1px solid \${C.cardBorder}\`, borderRadius: "12px 12px 12px 24px", overflow: "hidden", background: C.cardBg }}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: Fn.body }}>
          <thead>
            <tr style={{ background: C.bg, borderBottom: \`2px solid \${C.cardBorder}\` }}>
              {columns.map((col) => (
                <th key={col.key} onClick={() => sortable && toggleSort(col.key)}
                  style={{ padding: \`\${py}px 16px\`, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".5px", color: C.cinzaChumbo, fontFamily: Fn.title, textAlign: col.align || "left", cursor: sortable ? "pointer" : "default", whiteSpace: "nowrap", width: col.width, userSelect: "none" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                    {col.label}{sortable && <SortIcon col={col.key} />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((row, ri) => (
              <tr key={ri}
                onMouseEnter={() => setHoverRow(ri)} onMouseLeave={() => setHoverRow(-1)}
                style={{ borderBottom: \`1px solid \${C.cardBorder}\`, background: hoverRow === ri ? \`\${C.amareloOuro}18\` : striped && ri % 2 === 1 ? \`\${C.azulCeu}0D\` : "transparent", transition: "background .12s" }}>
                {columns.map((col) => (
                  <td key={col.key} style={{ padding: \`\${py}px 16px\`, fontSize: fs, color: C.cinzaEscuro, textAlign: col.align || "left" }}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {(paginate > 0 || footer) && (
        <div style={{ padding: "10px 16px", background: C.bg, borderTop: \`1px solid \${C.cardBorder}\`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          {footer || <span />}
          {paginate > 0 && totalPages > 1 && (
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              <button disabled={page <= 1} onClick={() => setPage(page - 1)} style={{ padding: "4px 10px", fontSize: 11, fontWeight: 600, fontFamily: Fn.body, background: page <= 1 ? "transparent" : C.cardBg, color: page <= 1 ? C.textLight : C.azulProfundo, border: \`1px solid \${page <= 1 ? C.cardBorder : C.azulCeu}\`, borderRadius: 5, cursor: page <= 1 ? "default" : "pointer" }}>Anterior</button>
              <span style={{ fontSize: 11, color: C.cinzaChumbo, fontFamily: Fn.mono, padding: "0 8px" }}>{page}/{totalPages}</span>
              <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} style={{ padding: "4px 10px", fontSize: 11, fontWeight: 600, fontFamily: Fn.body, background: page >= totalPages ? "transparent" : C.cardBg, color: page >= totalPages ? C.textLight : C.azulProfundo, border: \`1px solid \${page >= totalPages ? C.cardBorder : C.azulCeu}\`, borderRadius: 5, cursor: page >= totalPages ? "default" : "pointer" }}>Próxima</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Usage:
// <DSTable
//   columns={[
//     { key: "id", label: "Codigo", width: 80 },
//     { key: "nome", label: "Nome" },
//     { key: "status", label: "Status", render: (v) => <span style={{color: v==="Ativo"?"green":"red"}}>{v}</span> },
//   ]}
//   data={[{ id: 1, nome: "FIPS", status: "Ativo" }, { id: 2, nome: "MRS", status: "Inativo" }]}
//   paginate={10}
//   footer={<span>Total: 2 registros</span>}
// />
`;

/* ═══════════════════════════════════════════ TABLE VARIANT CODE HELPER ═══════════════════════════════════════════ */
function tableVariantCode(variant: string, props: string): string {
  const labels: Record<string, string> = {
    striped: 'Striped (zebrada)',
    compact: 'Compacta',
    clean: 'Limpa (sem zebra)',
    bordered: 'Bordered',
  };
  const label = labels[variant] || variant;
  const isStriped = props.includes('striped={true}') || (!props.includes('striped={false}'));
  const isCompact = props.includes('compact={true}');
  const isBordered = props.includes('bordered={true}');
  const py = isCompact ? 6 : 10;
  const fs = isCompact ? 11 : 12;
  return `// DS-FIPS — Table "${label}" — Copy-paste ready
import { useState } from "react";

const columns = [
  { key: "id", label: "Código" },
  { key: "dept", label: "Depto" },
  { key: "status", label: "Status" },
];

const data = [
  { id: "REQ-4025", dept: "SSMA", status: "Pendente" },
  { id: "REQ-4024", dept: "Operações", status: "Aprovada" },
  { id: "REQ-4023", dept: "Logística", status: "Aprovada" },
];

export function Table${label.replace(/[^a-zA-Z]/g, '')}() {
  const [hoverRow, setHoverRow] = useState(-1);

  return (
    <div style={{ border: "1px solid #E2E8F0", borderRadius: "12px 12px 12px 24px", overflow: "hidden", background: "#FFFFFF" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'Open Sans', sans-serif" }}>
        <thead>
          <tr style={{ background: "#F2F4F8", borderBottom: "2px solid #E2E8F0" }}>
            {columns.map((col${isBordered ? ', ci' : ''}) => (
              <th key={col.key}
                style={{ padding: "${py + 2}px 16px", textAlign: "center", fontSize: 10, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "#7B8C96", fontFamily: "'Saira Expanded', sans-serif", whiteSpace: "nowrap"${isBordered ? ', borderRight: ci < columns.length - 1 ? "1px solid #E2E8F0" : "none"' : ''} }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, ri) => (
            <tr key={ri}
              onMouseEnter={() => setHoverRow(ri)}
              onMouseLeave={() => setHoverRow(-1)}
              style={{ borderBottom: ri < data.length - 1 ? "1px solid #E2E8F0" : "none", background: hoverRow === ri ? "rgba(253,194,78,0.09)" : ${isStriped && !props.includes('striped={false}') ? 'ri % 2 === 1 ? "rgba(147,189,228,0.05)" : "transparent"' : '"transparent"'}, transition: "background .12s" }}>
              {columns.map((col${isBordered ? ', ci' : ''}) => (
                <td key={col.key}
                  style={{ padding: "${py}px 16px", fontSize: ${fs}, color: "#333B41", textAlign: "left"${isBordered ? ', borderRight: ci < columns.length - 1 ? "1px solid #E2E8F0" : "none"' : ''} }}>
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
`;
}

export default function TableDoc() {
  const [w,setW]=useState(typeof window!=="undefined"?window.innerWidth:1200);
  useEffect(()=>{const h=()=>setW(window.innerWidth);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h)},[]);
  const mob=w<640;
  const [tabFilter,setTabFilter]=useState("Todas");

  const reqCols=[
    {key:"id",label:"Código",width:100},
    {key:"solicitante",label:"Solicitante",render:(v,r)=><div style={{display:"flex",alignItems:"center",gap:10}}><Avatar name={v}/><div style={{lineHeight:1.2}}><span style={{fontWeight:600,fontSize:12,color:C.cinzaEscuro,display:"block"}}>{v}</span><span style={{fontSize:10,color:C.textMuted,marginTop:-1,display:"block"}}>{r.cargo}</span></div></div>},
    {key:"dept",label:"Depto"},
    {key:"valor",label:"Valor",align:"right",render:v=><span style={{fontFamily:Fn.mono,fontWeight:600,color:C.cinzaEscuro}}>R$ {v.toLocaleString("pt-BR")}</span>},
    {key:"status",label:"Status",render:v=><Badge variant={statusMap[v]} dot>{v}</Badge>},
    {key:"sla",label:"SLA",width:120,render:v=><MiniProgress value={v}/>},
    {key:"_actions",label:"",sortable:false,width:70,render:()=><div style={{display:"flex",gap:4}}><ActionBtn icon={Ic.eye(14,C.azulProfundo)} title="Ver"/><ActionBtn icon={Ic.edit(14,C.cinzaChumbo)} title="Editar"/></div>},
  ];

  const fornCols=[
    {key:"nome",label:"Fornecedor",render:(v,r)=><div style={{display:"flex",alignItems:"center",gap:10}}><Avatar name={v}/><div style={{lineHeight:1.2}}><span style={{fontWeight:600,fontSize:12,color:C.cinzaEscuro,display:"block"}}>{v}</span><span style={{fontSize:10,color:C.textMuted,marginTop:-1,display:"block"}}>{r.cnpj}</span></div></div>},
    {key:"responsavel",label:"Responsável",render:(v,r)=><div style={{display:"flex",alignItems:"center",gap:10}}><Avatar name={v}/><div style={{lineHeight:1.2}}><span style={{fontWeight:600,fontSize:12,color:C.cinzaEscuro,display:"block"}}>{v}</span><span style={{fontSize:10,color:C.textMuted,marginTop:-1,display:"block"}}>{r.cargoResp}</span></div></div>},
    {key:"seg",label:"Segmento",render:v=><Badge variant="secondary">{v}</Badge>},
    {key:"status",label:"Status",render:v=><Badge variant={statusForn[v]} dot>{v}</Badge>},
    {key:"score",label:"Score",width:120,render:v=><MiniProgress value={v}/>},
  ];

  return(
    <PlaygroundProvider>
    <div style={{minHeight:"100vh",background:"var(--color-surface-muted)",fontFamily:Fn.body,color:C.cinzaEscuro}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Saira+Expanded:wght@300;400;500;600;700;800&family=Open+Sans:wght@300;400;600;700&family=Fira+Code:wght@400;500&display=swap');
        @keyframes shimmer{0%{opacity:.5}50%{opacity:.8}100%{opacity:.5}}
        @keyframes floatUp{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
        .ds-shim{background:linear-gradient(90deg,#E2E8F0 25%,#f0f3f7 50%,#E2E8F0 75%);background-size:300% 100%;animation:shimMove 1.8s ease infinite}
        @keyframes shimMove{0%{background-position:100% 0}100%{background-position:-100% 0}}
      `}</style>

      {/* HEADER */}
      <header style={{background:`linear-gradient(135deg,${C.azulProfundo} 0%,${C.azulEscuro} 100%)`,padding:mob?"32px 20px":"48px 40px 44px",position:"relative",overflow:"hidden"}}>
        <JunctionLines style={{position:"absolute",top:-10,right:-20,width:mob?250:400,height:250}}/>
        <div style={{position:"relative"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:6,background:`${C.branco}10`,border:`1px solid ${C.branco}18`,borderRadius:20,padding:"5px 14px",fontSize:11,fontWeight:600,letterSpacing:"1.5px",textTransform:"uppercase",color:C.amareloOuro,fontFamily:Fn.title,marginBottom:16}}>{Ic.grid(14,C.amareloOuro)} Design System FIPS</div>
          <h1 style={{fontSize:mob?30:44,fontWeight:700,color:C.branco,margin:"0 0 10px",fontFamily:Fn.title}}>Table</h1>
          <p style={{fontSize:16,color:`${C.branco}B0`,lineHeight:1.6,maxWidth:700,margin:0,fontFamily:Fn.body}}>Tabela de dados com ordenação por coluna, seleção de linhas, hover interativo, composições com badges, avatares e progress bars. Border-radius assimétrico do Brandbook.</p>
        </div>
      </header>

      <div style={{padding:mob?"24px 16px 40px":"36px 40px 60px",maxWidth:1100,margin:"0 auto"}}>

        {/* 01 — PLAYGROUND */}
        <Section n="01" title="Playground interativo" desc="Tabela completa com título, botão Colunas, paginação, ordenação e seleção. Oculte colunas pelo dropdown. Hover azul suave.">
          <DSTable columns={reqCols} data={reqData} selectable paginate={5} perPageOptions={[3,5,10]} configurable
            title="Requisições de compra"
            subtitle="Lista de requisições do módulo Suprimentos."
            icon={<svg width="28" height="28" viewBox="0 0 48 48" fill="none"><path d="M14 6h14l10 10v24a2 2 0 01-2 2H14a2 2 0 01-2-2V8a2 2 0 012-2z" stroke={C.azulProfundo} strokeWidth="2.5" strokeLinejoin="round"/><path d="M28 6v10h10M20 24h8M20 30h12M20 36h6" stroke={C.azulProfundo} strokeWidth="2" strokeLinecap="round"/></svg>}
            iconBg={`color-mix(in srgb, ${C.azulProfundo} 4%, transparent)`}
            iconBorder={`color-mix(in srgb, ${C.azulProfundo} 8%, transparent)`}
            footer={<><span>12 requisições · 4 pendentes</span><span style={{fontWeight:600,color:C.cinzaEscuro}}>Total: R$ 75.930</span></>}
          />
        </Section>

        {/* 02 — VARIANTES */}
        <Section n="02" title="Variantes visuais" desc="Quatro estilos de tabela para diferentes densidades e contextos. Clique em qualquer variante para copiar o codigo.">
          <div style={{display:"flex",flexDirection:"column",gap:24}}>
            {/* Striped (padrão) */}
            <div>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>Striped (zebrada) ★</span>
                <code style={gk}>padrão</code>
              </div>
              <Copyable label="Table Striped" code={tableVariantCode("striped","striped={true}")} preview={<DSTable columns={[{key:"id",label:"Código"},{key:"dept",label:"Depto"},{key:"status",label:"Status"}]} data={reqData.slice(0,3)} sortable={false}/>}>
                <DSTable columns={[{key:"id",label:"Código"},{key:"dept",label:"Depto"},{key:"status",label:"Status",render:v=><Badge variant={statusMap[v]} dot>{v}</Badge>}]} data={reqData.slice(0,3)} sortable={false}/>
              </Copyable>
            </div>

            {/* Compacta */}
            <div>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>Compacta</span>
                <code style={gk}>dense</code>
              </div>
              <Copyable label="Table Compacta" code={tableVariantCode("compact","compact={true}")} preview={<DSTable columns={[{key:"id",label:"Código"},{key:"dept",label:"Depto"},{key:"valor",label:"Valor"}]} data={reqData.slice(0,4)} compact sortable={false}/>}>
                <DSTable columns={[{key:"id",label:"Código"},{key:"dept",label:"Depto"},{key:"valor",label:"Valor",align:"right",render:v=><span style={{fontFamily:Fn.mono}}>R$ {v.toLocaleString("pt-BR")}</span>}]} data={reqData.slice(0,4)} compact sortable={false}/>
              </Copyable>
            </div>

            {/* Limpa */}
            <div>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>Limpa</span>
                <code style={gk}>sem zebra</code>
              </div>
              <Copyable label="Table Limpa" code={tableVariantCode("clean","striped={false}")} preview={<DSTable columns={[{key:"id",label:"Código"},{key:"solicitante",label:"Solicitante"},{key:"sla",label:"SLA"}]} data={reqData.slice(0,3)} striped={false} sortable={false}/>}>
                <DSTable columns={[{key:"id",label:"Código"},{key:"solicitante",label:"Solicitante"},{key:"sla",label:"SLA",render:v=><MiniProgress value={v}/>}]} data={reqData.slice(0,3)} striped={false} sortable={false}/>
              </Copyable>
            </div>

            {/* Bordered */}
            <div>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>Bordered</span>
                <code style={gk}>todas as bordas</code>
              </div>
              <Copyable label="Table Bordered" code={tableVariantCode("bordered","bordered={true}")} preview={<DSTable columns={[{key:"id",label:"Código"},{key:"dept",label:"Depto"},{key:"status",label:"Status"},{key:"valor",label:"Valor"}]} data={reqData.slice(0,3)} bordered sortable={false}/>}>
                <DSTable columns={[{key:"id",label:"Código"},{key:"dept",label:"Depto"},{key:"status",label:"Status",render:v=><Badge variant={statusMap[v]} dot>{v}</Badge>},{key:"valor",label:"Valor",align:"right",render:v=><span style={{fontFamily:Fn.mono}}>R$ {v.toLocaleString("pt-BR")}</span>}]} data={reqData.slice(0,3)} bordered sortable={false}/>
              </Copyable>
            </div>
          </div>
        </Section>

        {/* 03 — COMPOSIÇÕES */}
        <Section n="03" title="Composições de coluna" desc="Colunas com avatar, badge, progress, valor monetário e botões de ação. Combináveis na mesma tabela.">
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:16}}>
            {[
              {name:"Avatar + nome",c:C.azulProfundo,desc:"Coluna com avatar circular (inicial) + nome em bold + subtítulo (CNPJ, cargo). Para identificação de pessoas e entidades.",ex:"Lista de fornecedores, colaboradores, solicitantes."},
              {name:"Badge de status",c:C.verdeFloresta,desc:"Badge com dot colorido: Ativo (verde), Pendente (laranja), Rejeitada (vermelho). Para categorização rápida.",ex:"Status de requisição, situação cadastral, fase de ideia."},
              {name:"Progress bar",c:C.amareloEscuro,desc:"Barra de progresso mini com cor automática (vermelho→laranja→verde) e valor percentual à direita.",ex:"SLA, score de fornecedor, progresso de tarefa."},
              {name:"Valor monetário",c:C.azulCeu,desc:"Alinhamento à direita, font mono, cor azul escuro. Para valores financeiros e quantidades numéricas.",ex:"Valor de requisição, faturamento, orçamento disponível."},
              {name:"Botões de ação",c:C.cinzaChumbo,desc:"Ícones discretos (olho, lápis) à direita da linha. Hover revela com fundo sutil. Sem texto — só ícone.",ex:"Ver detalhe (drawer), editar, excluir. Máximo 3 ações por linha."},
              {name:"Badge secundário",c:C.textMuted,desc:"Badge cinza discreto para categorias e tags não críticas. Menor hierarquia que badge de status.",ex:"Segmento (Ferroviário, Multimodal), departamento, tipo."},
            ].map(t=>(
              <div key={t.name} style={{...gc,borderLeft:`4px solid ${t.c}`}}>
                <div style={gh}><span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>{t.name}</span></div>
                <div style={gb}>
                  <p style={gt}>{t.desc}</p>
                  <div style={gl}>Exemplo FIPS</div><p style={ge}>{t.ex}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* 04 — ESTADOS */}
        <Section n="04" title="Estados" desc="Quatro estados visuais: vazio, carregando, erro e selecionado. Cada um com feedback visual claro.">
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:20}}>
            {/* Empty */}
            <div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                <span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>Empty state</span>
                <code style={gk}>data vazio</code>
              </div>
              <DSTable columns={[{key:"id",label:"Código"},{key:"nome",label:"Solicitante"},{key:"status",label:"Status"},{key:"valor",label:"Valor"}]} data={[]} emptyText="Nenhuma requisição encontrada" sortable={false}/>
            </div>

            {/* Loading */}
            <div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                <span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>Loading skeleton</span>
                <code style={gk}>loading=true</code>
              </div>
              <DSTable columns={[{key:"id",label:"Código"},{key:"nome",label:"Solicitante"},{key:"status",label:"Status"},{key:"valor",label:"Valor"}]} data={[]} loading selectable sortable={false}/>
            </div>

            {/* Erro */}
            <div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                <span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>Error state</span>
                <code style={gk}>falha de conexão</code>
              </div>
              <div style={{border:`1px solid ${C.cardBorder}`,borderRadius:"12px 12px 12px 24px",overflow:"hidden",background:C.cardBg}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontFamily:Fn.body}}>
                  <thead><tr style={{background:C.bg}}>{["Código","Solicitante","Status","Valor"].map(h=><th key={h} style={{padding:"10px 16px",textAlign:"center",fontSize:10,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.cinzaChumbo,fontFamily:Fn.title,borderBottom:`2px solid ${C.cardBorder}`}}>{h}</th>)}</tr></thead>
                  <tbody>
                    <tr><td colSpan={4} style={{padding:"56px 16px",textAlign:"center"}}>
                      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
                        <div style={{position:"relative",width:80,height:80}}>
                          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                            {/* Cloud */}
                            <path d="M20 50h40a12 12 0 000-24 16 16 0 00-30-8A14 14 0 0020 50z" fill="#FEF2F2" stroke="#FECACA" strokeWidth="2"/>
                            {/* X mark */}
                            <path d="M33 33l14 14M47 33L33 47" stroke={C.danger} strokeWidth="3" strokeLinecap="round"/>
                            {/* Lightning bolt */}
                            <path d="M42 52l-4 10 8-4-4 10" stroke={C.amareloEscuro} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity=".6"/>
                          </svg>
                        </div>
                        <span style={{fontSize:15,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>Erro ao carregar dados</span>
                        <span style={{fontSize:12,color:C.textMuted,fontFamily:Fn.body,maxWidth:280}}>Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.</span>
                        <button style={{marginTop:4,padding:"7px 18px",fontSize:12,fontWeight:600,color:C.cinzaEscuro,background:"transparent",border:`1.5px solid ${C.azulProfundo}`,borderRadius:6,cursor:"pointer",fontFamily:Fn.body}}>Tentar novamente</button>
                      </div>
                    </td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Selecionado */}
            <div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                <span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>Selected rows</span>
                <code style={gk}>selectable=true</code>
              </div>
              <div style={{border:`1px solid ${C.cardBorder}`,borderRadius:"12px 12px 12px 24px",overflow:"hidden",background:C.cardBg}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontFamily:Fn.body}}>
                  <thead><tr style={{background:C.bg}}>
                    <th style={{padding:"10px 12px 10px 16px",width:36}}><input type="checkbox" checked={false} readOnly style={{cursor:"pointer"}}/></th>
                    {["Código","Solicitante","Status"].map(h=><th key={h} style={{padding:"10px 16px",textAlign:"center",fontSize:10,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.cinzaChumbo,fontFamily:Fn.title,borderBottom:`2px solid ${C.cardBorder}`}}>{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {[{id:"REQ-4025",n:"Carlos Santos",s:"Pendente",sel:false},{id:"REQ-4024",n:"Ana Costa",s:"Aprovada",sel:true},{id:"REQ-4023",n:"Marcos Oliveira",s:"Aprovada",sel:true},{id:"REQ-4022",n:"Julia Ferreira",s:"Rejeitada",sel:false}].map((r,i)=>(
                      <tr key={i} style={{background:r.sel?`${C.azulCeu}20`:i%2===1?`${C.azulCeu}0D`:"transparent",borderBottom:i<3?`1px solid ${C.cardBorder}`:"none"}}>
                        <td style={{padding:"10px 12px 10px 16px"}}><input type="checkbox" checked={r.sel} readOnly style={{cursor:"pointer"}}/></td>
                        <td style={{padding:"10px 16px",fontSize:12,fontWeight:600,color:C.cinzaEscuro}}>{r.id}</td>
                        <td style={{padding:"10px 16px",fontSize:12}}><div style={{display:"flex",alignItems:"center",gap:10}}><Avatar name={r.n}/><span style={{fontWeight:600}}>{r.n}</span></div></td>
                        <td style={{padding:"10px 16px"}}><Badge variant={statusMap[r.s]} dot>{r.s}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{padding:"10px 16px",borderTop:`1px solid ${C.cardBorder}`,background:`${C.azulCeu}10`,display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:11,color:C.cinzaEscuro,fontFamily:Fn.body}}>
                  <span style={{fontWeight:600}}>2 selecionados</span>
                  <div style={{display:"flex",gap:8}}>
                    <button style={{padding:"4px 12px",fontSize:11,fontWeight:600,color:C.cinzaEscuro,background:C.cardBg,border:`1px solid ${C.azulCeu}`,borderRadius:5,cursor:"pointer",fontFamily:Fn.body}}>Aprovar selecionados</button>
                    <button style={{padding:"4px 12px",fontSize:11,fontWeight:600,color:C.danger,background:C.cardBg,border:`1px solid ${C.danger}40`,borderRadius:5,cursor:"pointer",fontFamily:Fn.body}}>Excluir</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* 05 — CENÁRIOS */}
        <Section n="05" title="Cenários de negócio" desc="Tabelas aplicadas em contextos reais do ecossistema FIPS.">
          <div style={{display:"flex",flexDirection:"column",gap:24}}>
            {/* Fornecedores */}
            <div style={{background:C.bg,border:`1px solid ${C.cardBorder}`,borderRadius:"10px 10px 10px 20px",padding:mob?16:24}}>
              <h3 style={{fontSize:14,fontWeight:700,color:C.cinzaEscuro,margin:"0 0 4px",fontFamily:Fn.title}}>App Suprimentos — Fornecedores</h3>
              <p style={{fontSize:12,color:C.cinzaChumbo,margin:"0 0 16px"}}>Com título, botão Colunas e paginação</p>
              <DSTable columns={fornCols} data={fornData} selectable configurable paginate={3}
                title="Carteira de Fornecedores"
                subtitle="Fornecedores cadastrados no sistema."
                icon={<svg width="28" height="28" viewBox="0 0 48 48" fill="none"><rect x="8" y="6" width="32" height="36" rx="3" stroke={C.verdeFloresta} strokeWidth="2.5"/><path d="M18 16h4M26 16h4M18 24h4M26 24h4M20 32h8v10H20z" stroke={C.verdeFloresta} strokeWidth="2" strokeLinecap="round"/></svg>}
                iconBg={`color-mix(in srgb, ${C.verdeFloresta} 4%, transparent)`}
                iconBorder={`color-mix(in srgb, ${C.verdeFloresta} 8%, transparent)`}
                footer={<><span>5 fornecedores · 3 ativos</span><span style={{fontWeight:600,color:C.cinzaEscuro}}>Score médio: 77%</span></>}
              />
            </div>

            {/* Guia + Tabela */}
            <div style={{background:C.bg,border:`1px solid ${C.cardBorder}`,borderRadius:"10px 10px 10px 20px",padding:mob?16:24}}>
              <h3 style={{fontSize:14,fontWeight:700,color:C.cinzaEscuro,margin:"0 0 4px",fontFamily:Fn.title}}>Guia + Tabela filtrada</h3>
              <p style={{fontSize:12,color:C.cinzaChumbo,margin:"0 0 16px"}}>Tabs Guia acima da tabela filtrando por status</p>
              <div style={{borderRadius:"12px 12px 12px 24px",overflow:"hidden",border:`1px solid ${C.cardBorder}`,background:C.cardBg}}>
                {/* Title bar */}
                <div style={{padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
                  <div style={{display:"flex",alignItems:"center",gap:14}}>
                    <div style={{width:48,height:48,borderRadius:14,background:`color-mix(in srgb, ${C.azulProfundo} 5%, transparent)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <svg width="28" height="28" viewBox="0 0 48 48" fill="none"><path d="M14 6h14l10 10v24a2 2 0 01-2 2H14a2 2 0 01-2-2V8a2 2 0 012-2z" stroke={C.azulProfundo} strokeWidth="2.5" strokeLinejoin="round"/><path d="M28 6v10h10M20 24h8M20 30h12M20 36h6" stroke={C.azulProfundo} strokeWidth="2" strokeLinecap="round"/></svg>
                    </div>
                    <div>
                      <h3 style={{fontSize:15,fontWeight:700,color:C.cinzaEscuro,margin:0,fontFamily:Fn.title}}>Requisições por status</h3>
                      <p style={{fontSize:12,color:C.cinzaChumbo,margin:"2px 0 0",fontFamily:Fn.body}}>Filtre por abas para visualizar requisições por situação.</p>
                    </div>
                  </div>
                  <span style={{fontSize:11,color:C.textMuted,fontFamily:Fn.body,whiteSpace:"nowrap"}}>Mostrando {reqData.length} registros</span>
                </div>
                {/* Guia tab strip */}
                <div style={{display:"flex",gap:0,alignItems:"flex-end",padding:"0 4px",position:"relative"}}>
                  {[
                    {l:"Todas",c:reqData.length,color:C.azulProfundo},
                    {l:"Pendentes",c:reqData.filter(r=>r.status==="Pendente").length,color:C.amareloEscuro},
                    {l:"Aprovadas",c:reqData.filter(r=>r.status==="Aprovada").length,color:C.verdeFloresta},
                    {l:"Rejeitadas",c:reqData.filter(r=>r.status==="Rejeitada").length,color:C.danger},
                  ].map(t=>{
                    const isA=tabFilter===t.l;
                    return(
                      <div key={t.l} onClick={()=>setTabFilter(t.l)} style={{
                        padding:"10px 20px",fontSize:12,fontWeight:isA?700:500,fontFamily:Fn.body,
                        color:isA?C.azulEscuro:C.cinzaChumbo,
                        background:C.cardBg,
                        borderRadius:"10px 10px 0 0",
                        border:"none",
                        cursor:"pointer",display:"flex",alignItems:"center",gap:7,
                        transition:"all .2s ease",position:"relative",zIndex:isA?3:1,
                        boxShadow:isA?"0 -4px 12px rgba(0,42,104,.1), 0 -1px 4px rgba(0,42,104,.06)":"none",
                      }}
                        onMouseEnter={e=>{if(!isA){e.currentTarget.style.color=C.azulEscuro;e.currentTarget.style.boxShadow="0 -2px 8px rgba(0,42,104,.05)"}}}
                        onMouseLeave={e=>{if(!isA){e.currentTarget.style.color=C.cinzaChumbo;e.currentTarget.style.boxShadow="none"}}}
                      >
                        {t.l}
                        <span style={{
                          minWidth:20,height:20,borderRadius:999,
                          background:isA?t.color:`${C.cinzaChumbo}18`,
                          color:isA?C.branco:C.cinzaChumbo,
                          fontSize:10,fontWeight:700,
                          display:"flex",alignItems:"center",justifyContent:"center",
                          padding:"0 6px",fontFamily:Fn.mono,
                          transition:"all .2s",
                        }}>{t.c}</span>
                      </div>
                    );
                  })}
                </div>
                {/* Tabela filtrada */}
                <table style={{width:"100%",borderCollapse:"collapse",fontFamily:Fn.body}}>
                  <thead>
                    <tr style={{background:C.bg}}>
                      {["Código","Solicitante","Depto","Valor","Status"].map(h=>(
                        <th key={h} style={{padding:"10px 16px",textAlign:h==="Valor"?"right":"left",fontSize:10,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.cinzaChumbo,fontFamily:Fn.title,borderBottom:`1px solid ${C.cardBorder}`}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(()=>{const filtered=reqData.filter(r=>tabFilter==="Todas"||r.status===(tabFilter==="Pendentes"?"Pendente":tabFilter==="Aprovadas"?"Aprovada":"Rejeitada"));return filtered.slice(0,5).map((r,i)=>(
                      <tr key={i} style={{borderBottom:i<Math.min(filtered.length,5)-1?`1px solid ${C.cardBorder}`:"none",background:i%2===1?`${C.azulCeu}0D`:"transparent",transition:"background .12s"}}
                        onMouseEnter={e=>e.currentTarget.style.background=`${C.amareloOuro}18`}
                        onMouseLeave={e=>e.currentTarget.style.background=i%2===1?`${C.azulCeu}0D`:"transparent"}
                      >
                        <td style={{padding:"10px 16px",fontSize:12,fontWeight:600,color:C.cinzaEscuro}}>{r.id}</td>
                        <td style={{padding:"10px 16px",fontSize:12}}><div style={{display:"flex",alignItems:"center",gap:10}}><Avatar name={r.solicitante}/><div style={{lineHeight:1.2}}><span style={{fontWeight:600,fontSize:12,display:"block"}}>{r.solicitante}</span><span style={{fontSize:10,color:C.textMuted,marginTop:-1,display:"block"}}>{r.cargo}</span></div></div></td>
                        <td style={{padding:"10px 16px",fontSize:12}}>{r.dept}</td>
                        <td style={{padding:"10px 16px",fontSize:12,textAlign:"right",fontFamily:Fn.mono,fontWeight:600,color:C.cinzaEscuro}}>R$ {r.valor.toLocaleString("pt-BR")}</td>
                        <td style={{padding:"10px 16px"}}><Badge variant={statusMap[r.status]} dot>{r.status}</Badge></td>
                      </tr>
                    ))})()}
                  </tbody>
                </table>
                {/* Footer */}
                <div style={{padding:"10px 16px",borderTop:`1px solid ${C.cardBorder}`,background:C.bg,display:"flex",justifyContent:"space-between",fontSize:11,color:C.cinzaChumbo}}>
                  <span>{tabFilter==="Todas"?`${reqData.length} requisições`:reqData.filter(r=>r.status===(tabFilter==="Pendentes"?"Pendente":tabFilter==="Aprovadas"?"Aprovada":"Rejeitada")).length+` ${tabFilter.toLowerCase()}`}</span>
                  <span style={{fontWeight:600,color:C.cinzaEscuro}}>Filtro: {tabFilter}</span>
                </div>
              </div>
            </div>

            {/* Ocorrências */}
            <div style={{background:C.bg,border:`1px solid ${C.cardBorder}`,borderRadius:"10px 10px 10px 20px",padding:mob?16:24}}>
              <h3 style={{fontSize:14,fontWeight:700,color:C.cinzaEscuro,margin:"0 0 4px",fontFamily:Fn.title}}>SSMA — Ocorrências</h3>
              <p style={{fontSize:12,color:C.cinzaChumbo,margin:"0 0 16px"}}>Status crítico com badge, data e local</p>
              <DSTable columns={[
                {key:"id",label:"Código",width:90},
                {key:"tipo",label:"Tipo"},
                {key:"local",label:"Local"},
                {key:"data",label:"Data"},
                {key:"status",label:"Gravidade",render:v=><Badge variant={v==="Crítica"?"critico":v==="Alta"?"atencao":"info"} dot>{v}</Badge>},
              ]} data={[
                {id:"OC-2041",tipo:"Vazamento",local:"Pátio 47-B",data:"02/04/2026",status:"Crítica"},
                {id:"OC-2040",tipo:"Equipamento",local:"Oficina Central",data:"01/04/2026",status:"Alta"},
                {id:"OC-2039",tipo:"Sinalização",local:"Trilho 12",data:"30/03/2026",status:"Média"},
                {id:"OC-2038",tipo:"EPI",local:"Pátio 23-A",data:"29/03/2026",status:"Alta"},
              ]} compact/>
            </div>
          </div>
        </Section>

        {/* 06 — ANATOMIA */}
        <Section n="06" title="Anatomia e comportamento" desc="Estrutura da tabela e regras de interação.">
          <DSCard mob={mob}>
            <div style={{display:"flex",gap:40,flexWrap:"wrap"}}>
              <div style={{flex:1,minWidth:250}}>
                <span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title,display:"block",marginBottom:12}}>Estrutura</span>
                {[
                  {l:"Container",v:"border-radius 12px 12px 12px 24px"},
                  {l:"Header",v:"bg #F2F4F8, font 10px uppercase"},
                  {l:"Header border",v:"2px solid #E2E8F0"},
                  {l:"Row height",v:"Padrão 40px, Compacta 30px"},
                  {l:"Row striped",v:"#93BDE4 ~5% (azul céu)"},
                  {l:"Row hover",v:"#FDC24E ~9% (amarelo ouro)"},
                  {l:"Row selected",v:"#93BDE4 ~12% (azul céu)"},
                  {l:"Footer",v:"bg #F2F4F8, 10px 16px"},
                ].map(s=>(
                  <div key={s.l} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                    <div style={{width:6,height:6,borderRadius:"50%",background:C.azulProfundo,flexShrink:0}}/>
                    <span style={{fontSize:12,fontWeight:600,color:C.cinzaEscuro,fontFamily:Fn.body,minWidth:90}}>{s.l}</span>
                    <span style={{fontSize:11,color:C.cinzaChumbo,fontFamily:Fn.body}}>{s.v}</span>
                  </div>
                ))}
              </div>
              <div style={{flex:1,minWidth:250}}>
                <span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title,display:"block",marginBottom:12}}>Interação</span>
                {[
                  {l:"Sort",v:"Clique no header. ↑ asc / ↓ desc. Toggle."},
                  {l:"Select",v:"Checkbox por linha. Header seleciona todas."},
                  {l:"Hover",v:"Fundo azul sutil .12s transition."},
                  {l:"Empty",v:"'Nenhum registro' centralizado."},
                  {l:"Loading",v:"5 rows skeleton com shimmer animation."},
                  {l:"Ações",v:"Ícones discretos, hover revela bg."},
                  {l:"Overflow X",v:"Scroll horizontal em mobile."},
                  {l:"Footer",v:"Totais à esquerda, ações à direita."},
                ].map(s=>(
                  <div key={s.l} style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:6}}>
                    <code style={{background:`${C.amareloOuro}30`,color:C.amareloEscuro,padding:"2px 8px",borderRadius:4,fontSize:10,fontFamily:Fn.mono,fontWeight:600,minWidth:65,textAlign:"center",flexShrink:0}}>{s.l}</code>
                    <span style={{fontSize:12,color:C.cinzaEscuro,fontFamily:Fn.body}}>{s.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </DSCard>
        </Section>

        {/* 07 — GUIA */}
        <Section n="07" title="Guia de uso" desc="Quando usar cada variante de tabela.">
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:16}}>
            {[
              {name:"Striped (zebrada) ★",c:C.azulProfundo,desc:"Linhas alternadas para facilitar leitura horizontal. O padrão para qualquer tabela de dados.",when:"Listagens com 5+ linhas, dados tabulares genéricos, relatórios.",not:"Tabelas com 1–3 linhas (não precisa de zebra). Cards são melhores para poucos itens."},
              {name:"Compacta",c:C.cinzaChumbo,desc:"Menor padding, font 11px. Para maximizar dados visíveis na tela.",when:"Dashboards densos, listagens longas, modais com tabela, logs de auditoria.",not:"Tabelas com composições complexas (avatar+badge) — espaço apertado demais."},
              {name:"Limpa",c:C.verdeFloresta,desc:"Sem zebra, fundo uniforme. Visual mais clean e moderno.",when:"Tabelas curtas (3–5 linhas), contextos onde zebra polui o visual.",not:"Tabelas longas (10+ linhas) — zebra ajuda a manter a leitura."},
              {name:"Bordered",c:C.amareloEscuro,desc:"Bordas em todas as células. Grid visual rígido.",when:"Dados financeiros, planilhas, contextos onde delimitação precisa é necessária.",not:"Listagens simples — borda em tudo fica pesado. Preferir striped."},
            ].map(t=>(
              <div key={t.name} style={{...gc,borderLeft:`4px solid ${t.c}`}}>
                <div style={gh}><span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>{t.name}</span></div>
                <div style={gb}>
                  <p style={gt}>{t.desc}</p>
                  <div style={gl}>Quando usar</div><p style={gt}>{t.when}</p>
                  <div style={{...gl,color:C.danger}}>Quando NÃO usar</div><p style={{...gt,color:C.cinzaChumbo}}>{t.not}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Regras de uso */}
          <div style={{marginTop:16,background:`${C.azulCeuClaro}40`,border:`1px solid ${C.azulCeuClaro}`,borderRadius:12,padding:20,display:"flex",gap:14,alignItems:"flex-start"}}>
            <div style={{width:20,height:20,borderRadius:"50%",background:C.azulProfundo,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}><span style={{color:C.branco,fontSize:12,fontWeight:700}}>i</span></div>
            <div>
              <p style={{fontSize:14,fontWeight:700,color:C.cinzaEscuro,margin:"0 0 8px",fontFamily:Fn.body}}>Regras de composição da tabela</p>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {[
                  {r:"Tabela com título e subtítulo",v:"→ Sempre incluir ícone no header (padrão DS-FIPS)",c:C.azulProfundo},
                  {r:"5+ colunas",v:"→ Habilitar botão 'Colunas' (configurable)",c:C.verdeFloresta},
                  {r:"Até 4 colunas",v:"→ Sem botão 'Colunas' (não precisa de configuração)",c:C.cinzaChumbo},
                  {r:"10+ registros",v:"→ Habilitar paginação (paginate + perPageOptions)",c:C.amareloEscuro},
                  {r:"Coluna com nome de pessoa",v:"→ Avatar (iniciais) + subtítulo (cargo/email)",c:C.azulCeu},
                  {r:"Coluna com valor monetário",v:"→ Alinhamento à direita + font mono",c:C.cinzaChumbo},
                  {r:"Filtro por categoria/status",v:"→ Tabs Guia acima da tabela",c:C.azulProfundo},
                ].map(i=>(
                  <div key={i.r} style={{display:"flex",alignItems:"center",gap:8,fontSize:12,fontFamily:Fn.body}}>
                    <div style={{width:6,height:6,borderRadius:"50%",background:i.c,flexShrink:0}}/>
                    <span style={{color:C.cinzaChumbo,flex:1}}>{i.r}</span>
                    <span style={{fontWeight:700,color:i.c,whiteSpace:"nowrap",fontSize:11}}>{i.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>
        <Section n="08" title="Configuração avançada" desc="Props disponíveis para personalizar a tabela em diferentes contextos.">
          <DSCard mob={mob}>
            <div style={{display:"flex",flexDirection:"column",gap:0}}>
              {[
                {prop:"columns",type:"Column[]",def:"—",desc:"Array de colunas. Cada coluna: key, label, align, width, sortable, render(value, row)."},
                {prop:"data",type:"Object[]",def:"[]",desc:"Array de objetos com dados. Cada chave corresponde a uma column key."},
                {prop:"striped",type:"boolean",def:"true",desc:"Linhas alternadas com fundo azul céu 3%. Desativar para tabelas curtas (< 5 linhas)."},
                {prop:"compact",type:"boolean",def:"false",desc:"Padding reduzido (6px) e font 11px. Para dashboards densos e listagens longas."},
                {prop:"bordered",type:"boolean",def:"false",desc:"Borda em todas as células. Para dados financeiros e planilhas."},
                {prop:"selectable",type:"boolean",def:"false",desc:"Checkbox por linha + select all no header. Retorna índices selecionados."},
                {prop:"sortable",type:"boolean",def:"true",desc:"Habilita ordenação ao clicar no header. Pode ser desativado por coluna (sortable: false)."},
                {prop:"paginate",type:"number",def:"0",desc:"Linhas por página. 0 = sem paginação. Exibe controles de página no footer."},
                {prop:"perPageOptions",type:"number[]",def:"—",desc:"Array de opções para selector de linhas/página. Ex: [5, 10, 25]. Exibe dropdown no footer."},
                {prop:"loading",type:"boolean",def:"false",desc:"Exibe 5 linhas de skeleton com animação shimmer (gradiente deslizante). Para estados de carregamento."},
                {prop:"emptyText",type:"string",def:"\"Nenhum registro\"",desc:"Texto personalizado para estado vazio. Centralizado com cor muted."},
                {prop:"footer",type:"ReactNode",def:"—",desc:"Conteúdo custom no footer (totais, contadores). Aparece à esquerda da paginação."},
                {prop:"title",type:"string",def:"—",desc:"Título da tabela exibido no header bar acima das colunas."},
                {prop:"subtitle",type:"string",def:"—",desc:"Subtítulo descritivo abaixo do título. Contexto da listagem."},
                {prop:"configurable",type:"boolean",def:"false",desc:"Exibe botão 'Colunas' com dropdown para ocultar/exibir e reordenar colunas. Usar apenas com 5+ colunas — tabelas com poucas colunas não precisam de configuração."},
              ].map((p,i)=>(
                <div key={p.prop} style={{display:"flex",alignItems:"flex-start",gap:12,padding:"10px 0",borderBottom:i<14?`1px solid ${C.cardBorder}`:"none"}}>
                  <code style={{fontFamily:Fn.mono,fontSize:12,fontWeight:700,color:C.cinzaEscuro,minWidth:110}}>{p.prop}</code>
                  <code style={{fontFamily:Fn.mono,fontSize:10,color:C.cinzaChumbo,background:C.bg,padding:"2px 6px",borderRadius:3,minWidth:60,textAlign:"center"}}>{p.type}</code>
                  <code style={{fontFamily:Fn.mono,fontSize:10,color:C.textMuted,minWidth:55,textAlign:"center"}}>{p.def}</code>
                  <span style={{fontSize:12,color:C.cinzaEscuro,fontFamily:Fn.body,lineHeight:1.4}}>{p.desc}</span>
                </div>
              ))}
            </div>
            {/* Exemplo de uso */}
            <div style={{marginTop:20,background:C.bg,borderRadius:8,padding:16,border:`1px solid ${C.cardBorder}`}}>
              <span style={{fontSize:11,fontWeight:700,color:C.cinzaChumbo,fontFamily:Fn.title,textTransform:"uppercase",letterSpacing:"1px",display:"block",marginBottom:8}}>Exemplo de uso</span>
              <pre style={{fontSize:11,fontFamily:Fn.mono,color:C.cinzaEscuro,margin:0,lineHeight:1.6,whiteSpace:"pre-wrap"}}>{`<DSTable
  columns={[
    { key: "id", label: "Código", width: 100 },
    { key: "nome", label: "Nome" },
    { key: "status", label: "Status",
      render: v => <Badge variant={...}>{v}</Badge> },
    { key: "valor", label: "Valor", align: "right" },
  ]}
  data={dados}
  selectable
  paginate={10}
  perPageOptions={[5, 10, 25]}
  footer={<span>Total: R$ 12.500</span>}
/>`}</pre>
            </div>
          </DSCard>
        </Section>

        {/* 09 — TOKENS */}
        <Section n="09" title="Tokens de referência" desc="Valores de design do componente Table.">
          <DSCard mob={mob} s={{display:"flex",gap:mob?24:48,flexWrap:"wrap"}}>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:Fn.title,marginBottom:4}}>Cores</span>
              <TokenRow label="Header bg" value="#F2F4F8" color={C.bg}/>
              <TokenRow label="Row striped" value="#93BDE4 ~5%" color={`${C.azulCeu}0D`}/>
              <TokenRow label="Row hover" value="#FDC24E ~9%" color={`${C.amareloOuro}18`}/>
              <TokenRow label="Row selected" value="#93BDE4 ~12%" color={`${C.azulCeu}20`}/>
              <TokenRow label="Border" value="#E2E8F0" color={C.cardBorder}/>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:Fn.title,marginBottom:4}}>Dimensões</span>
              <TokenRow label="Row padding" value="10px 16px"/>
              <TokenRow label="Compact padding" value="6px 16px"/>
              <TokenRow label="Header border" value="2px solid"/>
              <TokenRow label="Border radius" value="12px 12px 12px 24px"/>
              <TokenRow label="Avatar" value="28px circle"/>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:Fn.title,marginBottom:4}}>Tipografia</span>
              <TokenRow label="Header" value="Saira 700 10px caps"/>
              <TokenRow label="Cell padrão" value="Open Sans 400 12px"/>
              <TokenRow label="Cell compacta" value="Open Sans 400 11px"/>
              <TokenRow label="Valor mono" value="Fira Code 600"/>
              <TokenRow label="Footer" value="Open Sans 400 11px"/>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:Fn.title,marginBottom:4}}>Interação</span>
              <TokenRow label="Hover transition" value=".12s ease"/>
              <TokenRow label="Sort icons" value="12px"/>
              <TokenRow label="Action icons" value="14px"/>
              <TokenRow label="Checkbox accent" value="#004B9B"/>
              <TokenRow label="Shimmer animation" value="1.5s infinite"/>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:Fn.title,marginBottom:4}}>Paginação</span>
              <TokenRow label="Btn padding" value="4px 10px"/>
              <TokenRow label="Page active bg" value="#004B9B"/>
              <TokenRow label="Page btn size" value="24px"/>
              <TokenRow label="Btn border" value="1px solid #93BDE4"/>
              <TokenRow label="Per page select" value="dropdown 11px"/>
            </div>
          </DSCard>
        </Section>

        {/* 10 — MODO DARK */}
        <Section n="10" title="Modo Dark" desc="Tokens e comportamento do componente no tema escuro. Consistência visual garantida em ambos os modos.">
          <div style={{background:C.cardBg,borderRadius:"10px 10px 10px 18px",border:`1px solid ${C.cardBorder}`,padding:mob?16:24}}>
            <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:12}}>
              {[
                {token:"Header bg",light:"#F2F4F8",dark:"#1A2332"},
                {token:"Row bg",light:"#FFFFFF",dark:"#0F1923"},
                {token:"Row striped",light:"rgba(147,189,228,0.05)",dark:"rgba(147,189,228,0.06)"},
                {token:"Row hover",light:"rgba(253,194,78,0.09)",dark:"rgba(253,194,78,0.12)"},
                {token:"Row selected",light:"rgba(147,189,228,0.12)",dark:"rgba(147,189,228,0.15)"},
                {token:"Border",light:"#E2E8F0",dark:"#2A3A4A"},
                {token:"Header text",light:"#7B8C96",dark:"#8A9BA7"},
                {token:"Cell text",light:"#333B41",dark:"#D1D9E0"},
                {token:"Footer bg",light:"#F2F4F8",dark:"#1A2332"},
                {token:"Sort icon",light:"#004B9B",dark:"#93BDE4"},
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
          label: "Table",
          description: "Tabela com sorting por coluna, paginacao, striped rows, hover e footer customizavel.",
          code: tableExportCode,
        }]} />

        <div style={{textAlign:"center",padding:"20px 0 0",borderTop:`1px solid ${C.cardBorder}`,marginTop:20}}>
          <span style={{fontSize:12,color:C.cinzaChumbo,letterSpacing:".5px",fontFamily:Fn.title,fontWeight:400}}>DS-FIPS v2.0 · Ferrovia Interna do Porto de Santos · Excelência sobre trilhos · {new Date().getFullYear()}</span>
        </div>
      </div>
    </div>
    </PlaygroundProvider>
  );
}
