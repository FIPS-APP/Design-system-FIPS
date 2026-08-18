// @ts-nocheck
import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════ TOKENS ═══════════════════════════════════════════ */
const C={azulProfundo:"var(--color-gov-azul-profundo)",azulEscuro:"var(--color-gov-azul-escuro)",azulClaro:"var(--color-gov-azul-claro)",cinzaChumbo:"var(--color-fg-muted)",cinzaEscuro:"var(--color-fg)",cinzaClaro:"#C0CCD2",azulCeu:"#93BDE4",azulCeuClaro:"#D3E3F4",amareloOuro:"#FDC24E",amareloEscuro:"#F6921E",verdeFloresta:"#00C64C",verdeEscuro:"#00904C",danger:"#DC3545",neutro:"var(--color-surface-soft)",branco:"#FFFFFF",bg:"var(--color-surface-muted)",cardBg:"var(--color-surface)",cardBorder:"var(--color-border)",textMuted:"var(--color-fg-muted)",textLight:"var(--color-fg-muted)"};
const Fn={title:"'Saira Expanded',sans-serif",body:"'Open Sans',sans-serif",mono:"'Fira Code',monospace"};

/* ═══════════════════════════════════════════ ICONS ═══════════════════════════════════════════ */
const Ic={
  help:(s=16,c=C.cinzaChumbo)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke={c} strokeWidth="1.5"/><path d="M8 7.5a2.5 2.5 0 014.5 1.5c0 1.5-2 2-2 3.5M10 15v.5" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>,
  info:(s=16,c=C.azulProfundo)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke={c} strokeWidth="1.5"/><path d="M10 9v5M10 6.5v.5" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>,
  check:(s=16,c=C.verdeFloresta)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke={c} strokeWidth="1.5"/><path d="M7 10l2 2 4-4" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  alert:(s=16,c=C.amareloEscuro)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M10 2L1.5 17h17L10 2z" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/><path d="M10 8v4M10 14v.5" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>,
  error:(s=16,c=C.danger)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke={c} strokeWidth="1.5"/><path d="M7 7l6 6M13 7l-6 6" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>,
  grid:(s=14,c=C.amareloOuro)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><rect x="2" y="2" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/><rect x="11" y="2" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/><rect x="2" y="11" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/><rect x="11" y="11" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/></svg>,
  lock:(s=16,c=C.cinzaChumbo)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><rect x="4" y="9" width="12" height="9" rx="2" stroke={c} strokeWidth="1.5"/><path d="M7 9V6a3 3 0 016 0v3" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>,
  star:(s=14,c=C.amareloOuro)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M10 2l2.5 5.2 5.7.8-4.1 4 1 5.7L10 14.8 4.9 17.7l1-5.7-4.1-4 5.7-.8L10 2z" fill={c}/></svg>,
};

function JunctionLines({style}){return <svg viewBox="0 0 320 200" fill="none" style={{opacity:.12,...style}}><path d="M0 60H100C120 60 120 60 140 40L200 40H320" stroke="var(--color-junction-stroke)" strokeWidth="6" strokeLinecap="round"/><path d="M0 60H100C120 60 120 60 140 80L200 80H320" stroke="var(--color-junction-stroke)" strokeWidth="6" strokeLinecap="round"/><path d="M0 120H60C80 120 80 120 100 100L160 100H320" stroke="var(--color-junction-stroke)" strokeWidth="6" strokeLinecap="round"/><path d="M0 120H60C80 120 80 120 100 140L160 140H320" stroke="var(--color-junction-stroke)" strokeWidth="6" strokeLinecap="round"/></svg>}

/* ═══════════════════════════════════════════
   TOOLTIP COMPONENT
   ═══════════════════════════════════════════ */
const TTV={
  dark:{bg:C.cinzaEscuro,color:C.branco,border:C.cinzaEscuro},
  light:{bg:C.branco,color:C.cinzaEscuro,border:C.cardBorder},
  info:{bg:"#EFF6FF",color:C.azulEscuro,border:C.azulCeu},
  atencao:{bg:"#FFF7ED",color:"#C2410C",border:"#FDBA74"},
  erro:{bg:"#FEF2F2",color:"#B91C1C",border:"#FECACA"},
  sucesso:{bg:"#ECFDF5",color:C.verdeEscuro,border:"#A7F3D0"},
};

function Tooltip({children,text,title:ttl,position="top",variant="dark",delay=200,maxW=240}){
  const [show,setShow]=useState(false);
  const timer=useRef(null);
  const v=TTV[variant]||TTV.dark;

  const enter=()=>{timer.current=setTimeout(()=>setShow(true),delay)};
  const leave=()=>{clearTimeout(timer.current);setShow(false)};

  const arrowSize=6;
  const posStyles={
    top:{bottom:"100%",left:"50%",transform:"translateX(-50%)",marginBottom:arrowSize+2},
    bottom:{top:"100%",left:"50%",transform:"translateX(-50%)",marginTop:arrowSize+2},
    left:{right:"100%",top:"50%",transform:"translateY(-50%)",marginRight:arrowSize+2},
    right:{left:"100%",top:"50%",transform:"translateY(-50%)",marginLeft:arrowSize+2},
  };
  const arrowStyles={
    top:{bottom:-arrowSize,left:"50%",transform:"translateX(-50%)",borderLeft:`${arrowSize}px solid transparent`,borderRight:`${arrowSize}px solid transparent`,borderTop:`${arrowSize}px solid ${v.bg}`},
    bottom:{top:-arrowSize,left:"50%",transform:"translateX(-50%)",borderLeft:`${arrowSize}px solid transparent`,borderRight:`${arrowSize}px solid transparent`,borderBottom:`${arrowSize}px solid ${v.bg}`},
    left:{right:-arrowSize,top:"50%",transform:"translateY(-50%)",borderTop:`${arrowSize}px solid transparent`,borderBottom:`${arrowSize}px solid transparent`,borderLeft:`${arrowSize}px solid ${v.bg}`},
    right:{left:-arrowSize,top:"50%",transform:"translateY(-50%)",borderTop:`${arrowSize}px solid transparent`,borderBottom:`${arrowSize}px solid transparent`,borderRight:`${arrowSize}px solid ${v.bg}`},
  };

  return(
    <span onMouseEnter={enter} onMouseLeave={leave} style={{position:"relative",display:"inline-flex",cursor:"default"}}>
      {children}
      {show&&(
        <span style={{position:"absolute",...posStyles[position],zIndex:50,pointerEvents:"none",animation:"ttFadeIn .15s ease"}}>
          <span style={{display:"block",background:v.bg,color:v.color,border:`1px solid ${v.border}`,borderRadius:6,padding:ttl?"8px 12px":"6px 10px",fontSize:12,fontFamily:Fn.body,lineHeight:1.4,maxWidth:maxW,boxShadow:"0 4px 12px rgba(0,0,0,.12)",whiteSpace:"normal"}}>
            {ttl&&<span style={{display:"block",fontWeight:700,fontSize:12,marginBottom:2}}>{ttl}</span>}
            {text}
          </span>
          <span style={{position:"absolute",width:0,height:0,...arrowStyles[position]}}/>
        </span>
      )}
    </span>
  );
}

/* ═══════════════════════════════════════════ BADGE mini ═══════════════════════════════════════════ */
const BV={sucesso:{bg:"#ECFDF5",color:C.verdeEscuro,border:"#A7F3D0"},atencao:{bg:"#FFF7ED",color:"#C2410C",border:"#FDBA74"},critico:{bg:"#FEF2F2",color:"#B91C1C",border:"#FECACA"},info:{bg:C.azulCeuClaro,color:C.azulEscuro,border:C.azulCeu},default:{bg:C.azulProfundo,color:C.branco,border:"transparent"},secondary:{bg:C.bg,color:C.cinzaEscuro,border:C.cardBorder}};
function Badge({variant="default",children,dot,size="md"}){const v=BV[variant]||BV.default;return(<span style={{display:"inline-flex",alignItems:"center",gap:5,padding:`2px ${size==="sm"?6:8}px`,fontSize:size==="sm"?10:11,fontWeight:600,fontFamily:Fn.body,color:v.color,background:v.bg,border:`1px solid ${v.border}`,borderRadius:4,whiteSpace:"nowrap"}}>{dot&&<span style={{width:6,height:6,borderRadius:"50%",background:v.color,opacity:.85}}/>}{children}</span>)}

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

/* helper pill for demo */
function DemoPill({children,bg,color}){return <span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",padding:"8px 20px",borderRadius:8,background:bg||C.bg,color:color||C.cinzaEscuro,fontSize:12,fontWeight:600,fontFamily:Fn.body,border:`1px solid ${C.cardBorder}`,cursor:"default"}}>{children}</span>}

/* ═══════════════════════════════════════════ MAIN ═══════════════════════════════════════════ */
export default function TooltipDoc(){
  const [w,setW]=useState(typeof window!=="undefined"?window.innerWidth:1200);
  useEffect(()=>{const h=()=>setW(window.innerWidth);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h)},[]);
  const mob=w<640;

  return(
    <div style={{minHeight:"100vh",background:"var(--color-surface-muted)",fontFamily:Fn.body,color:C.cinzaEscuro}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Saira+Expanded:wght@300;400;500;600;700;800&family=Open+Sans:wght@300;400;600;700&family=Fira+Code:wght@400;500&display=swap');
        @keyframes ttFadeIn{from{opacity:0;transform:translateX(-50%) translateY(4px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
      `}</style>

      {/* HEADER */}
      <header style={{background:`linear-gradient(135deg,var(--color-gov-gradient-from) 0%,var(--color-gov-gradient-to) 100%)`,padding:mob?"32px 20px":"48px 40px 44px",position:"relative",overflow:"hidden"}}>
        <JunctionLines style={{position:"absolute",top:-10,right:-20,width:mob?250:400,height:250}}/>
        <div style={{position:"relative"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:6,background:`${C.branco}10`,border:`1px solid ${C.branco}18`,borderRadius:20,padding:"5px 14px",fontSize:11,fontWeight:600,letterSpacing:"1.5px",textTransform:"uppercase",color:C.amareloOuro,fontFamily:Fn.title,marginBottom:16}}>{Ic.grid(14,C.amareloOuro)} Design System FIPS</div>
          <h1 style={{fontSize:mob?30:44,fontWeight:700,color:C.branco,margin:"0 0 10px",fontFamily:Fn.title}}>Tooltip</h1>
          <p style={{fontSize:16,color:`${C.branco}B0`,lineHeight:1.6,maxWidth:700,margin:0,fontFamily:Fn.body}}>Informação contextual ao passar o mouse. Aparece com delay de 200ms, seta indicativa e desaparece ao sair. Para textos de ajuda, descrições e dicas rápidas.</p>
        </div>
      </header>

      <div style={{padding:mob?"24px 16px 40px":"36px 40px 60px",maxWidth:1100,margin:"0 auto"}}>

        {/* 01 — PLAYGROUND POSIÇÕES */}
        <Section n="01" title="Posições" desc="Passe o mouse para ver o tooltip.">
          <DSCard mob={mob}>
            <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:mob?20:40,flexWrap:"wrap",padding:"40px 20px"}}>
                <Tooltip text="Tooltip posicionado acima do elemento." position="top"><DemoPill>↑ Top</DemoPill></Tooltip>

                <Tooltip text="Tooltip posicionado abaixo do elemento." position="bottom"><DemoPill>↓ Bottom</DemoPill></Tooltip>

                <Tooltip text="Tooltip à esquerda." position="left"><DemoPill>← Left</DemoPill></Tooltip>

                <Tooltip text="Tooltip à direita." position="right"><DemoPill>→ Right</DemoPill></Tooltip>

            </div>
            <div style={{textAlign:"center",marginTop:8}}>
              <span style={{fontSize:11,color:C.textMuted}}>★ Posição padrão: <strong>top</strong>. Use outras posições quando top for cortado pelo viewport.</span>
            </div>
          </DSCard>
        </Section>

        {/* 02 — VARIANTES */}
        <Section n="02" title="Variantes visuais" desc="Seis estilos para diferentes contextos. Passe o mouse para testar.">
          <DSCard mob={mob}>
            <div style={{display:"flex",gap:16,flexWrap:"wrap",justifyContent:"center",padding:"30px 0"}}>
                <Tooltip text="Tooltip padrão com fundo escuro." variant="dark"><DemoPill bg={C.cinzaEscuro} color={C.branco}>Escuro ★</DemoPill></Tooltip>

                <Tooltip text="Tooltip claro com borda sutil." variant="light"><DemoPill>Claro</DemoPill></Tooltip>

                <Tooltip text="Tooltip informativo para dicas de contexto." variant="info"><DemoPill bg="#EFF6FF" color={C.azulEscuro}>Info</DemoPill></Tooltip>

                <Tooltip text="Tooltip de atenção para alertas leves." variant="atencao"><DemoPill bg="#FFF7ED" color="#C2410C">Atenção</DemoPill></Tooltip>

                <Tooltip text="Tooltip de erro para campos inválidos." variant="erro"><DemoPill bg="#FEF2F2" color="#B91C1C">Erro</DemoPill></Tooltip>

                <Tooltip text="Tooltip de sucesso para confirmações." variant="sucesso"><DemoPill bg="#ECFDF5" color={C.verdeEscuro}>Sucesso</DemoPill></Tooltip>

            </div>
          </DSCard>
        </Section>

        {/* 03 — COMPOSIÇÕES */}
        <Section n="03" title="Composições" desc="Tooltip pode ser aplicado em ícones, botões, badges, links e campos. Passe o mouse nos exemplos.">
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:16}}>
            {/* Em ícone de ajuda */}
            <div style={gc}>
              <div style={gh}><span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>Ícone de ajuda (?)</span><code style={gk}>mais comum</code></div>
              <div style={{...gb,display:"flex",flexDirection:"column",gap:16}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:13,color:C.cinzaEscuro,fontFamily:Fn.body}}>Código CNPJ</span>
                  <Tooltip text="Cadastro Nacional de Pessoa Jurídica. 14 dígitos no formato XX.XXX.XXX/XXXX-XX." variant="dark"><span style={{display:"flex",cursor:"help"}}>{Ic.help(16,C.azulCeu)}</span></Tooltip>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:13,color:C.cinzaEscuro,fontFamily:Fn.body}}>Status SLA</span>
                  <Tooltip text="Service Level Agreement — indicador de cumprimento de prazo. Meta: 90%." variant="info"><span style={{display:"flex",cursor:"help"}}>{Ic.info(16,C.azulProfundo)}</span></Tooltip>
                </div>
                <p style={gt}>Ícone (?) ou (i) ao lado do label. O tooltip mais frequente do sistema.</p>
              </div>
            </div>

            {/* Em botão */}
            <div style={gc}>
              <div style={gh}><span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>Botão com tooltip</span><code style={gk}>disabled + ação</code></div>
              <div style={{...gb,display:"flex",flexDirection:"column",gap:16}}>
                <div style={{display:"flex",gap:10,alignItems:"center"}}>
                  <Tooltip text="Clique para aprovar esta requisição." position="bottom">
                    <button style={{padding:"7px 16px",fontSize:12,fontWeight:600,background:C.azulProfundo,color:C.branco,border:"none",borderRadius:6,cursor:"pointer",fontFamily:Fn.body}}>Aprovar</button>
                  </Tooltip>
                  <Tooltip text="Você não tem permissão para excluir. Contate o administrador." variant="erro" position="bottom">
                    <button style={{padding:"7px 16px",fontSize:12,fontWeight:600,background:C.cinzaClaro,color:C.cinzaChumbo,border:"none",borderRadius:6,cursor:"not-allowed",fontFamily:Fn.body,opacity:.6}}>Excluir</button>
                  </Tooltip>
                </div>
                <p style={gt}>Útil em botões desabilitados para explicar por que a ação não está disponível.</p>
              </div>
            </div>

            {/* Em badge */}
            <div style={gc}>
              <div style={gh}><span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>Badge com tooltip</span><code style={gk}>status detalhado</code></div>
              <div style={{...gb,display:"flex",flexDirection:"column",gap:16}}>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  <Tooltip text="Empresa ativa no sistema. Última atualização: 28/03/2026." variant="sucesso"><Badge variant="sucesso" dot>Ativo</Badge></Tooltip>
                  <Tooltip text="Aguardando aprovação do gestor desde 01/04/2026." variant="atencao"><Badge variant="atencao" dot>Pendente</Badge></Tooltip>
                  <Tooltip text="Cadastro vencido em 15/03/2026. Renovação necessária." variant="critico"><Badge variant="critico" dot>Vencido</Badge></Tooltip>
                </div>
                <p style={gt}>Tooltip complementa o badge com detalhes que não cabem na etiqueta.</p>
              </div>
            </div>

            {/* Rico com título */}
            <div style={gc}>
              <div style={gh}><span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>Tooltip rico</span><code style={gk}>título + descrição</code></div>
              <div style={{...gb,display:"flex",flexDirection:"column",gap:16}}>
                <div style={{display:"flex",gap:12,alignItems:"center"}}>
                  <Tooltip title="Fipcoins" text="Sistema de gamificação da FIPS. Colaboradores ganham moedas por ideias aprovadas e boas práticas." variant="dark" maxW={280}><span style={{display:"flex",cursor:"help"}}>{Ic.star(18,C.amareloOuro)}</span></Tooltip>
                  <Tooltip title="Campo obrigatório" text="Este campo deve ser preenchido antes de submeter o formulário." variant="erro" maxW={220}><span style={{display:"flex",cursor:"help",color:C.danger,fontSize:16,fontWeight:700}}>*</span></Tooltip>
                  <Tooltip title="Bloqueado" text="Este registro está em modo somente leitura. Para editar, solicite permissão ao administrador." variant="dark" maxW={260}><span style={{display:"flex",cursor:"help"}}>{Ic.lock(18,C.cinzaChumbo)}</span></Tooltip>
                </div>
                <p style={gt}>Tooltip com título em bold + descrição. Para explicações mais detalhadas. Max-width configurável.</p>
              </div>
            </div>

            {/* Header de tabela */}
            <div style={gc}>
              <div style={gh}><span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>Header de tabela</span><code style={gk}>colunas com dica</code></div>
              <div style={gb}>
                <div style={{border:`1px solid ${C.cardBorder}`,borderRadius:6,overflow:"hidden"}}>
                  <div style={{display:"flex",background:C.bg,borderBottom:`1px solid ${C.cardBorder}`}}>
                    {[
                      {l:"Empresa",t:"Razão social cadastrada no sistema."},
                      {l:"SLA",t:"Service Level Agreement. Percentual de entregas no prazo."},
                      {l:"Status",t:"Situação atual do cadastro (Ativo, Pendente, Vencido)."},
                    ].map(h=>(
                      <div key={h.l} style={{flex:1,padding:"8px 12px",display:"flex",alignItems:"center",gap:4}}>
                        <span style={{fontSize:11,fontWeight:700,color:C.cinzaChumbo,fontFamily:Fn.body,textTransform:"uppercase",letterSpacing:".5px"}}>{h.l}</span>
                        <Tooltip text={h.t} variant="dark" position="bottom"><span style={{display:"flex",cursor:"help",opacity:.5}}>{Ic.help(12,C.cinzaChumbo)}</span></Tooltip>
                      </div>
                    ))}
                  </div>
                  <div style={{display:"flex",padding:"8px 12px"}}>
                    <span style={{flex:1,fontSize:12,color:C.cinzaEscuro}}>FIPS Logística</span>
                    <span style={{flex:1,fontSize:12,color:C.cinzaEscuro}}>94%</span>
                    <span style={{flex:1}}><Badge variant="sucesso" dot size="sm">Ativo</Badge></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Em formulário */}
            <div style={gc}>
              <div style={gh}><span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>Campo de formulário</span><code style={gk}>help inline</code></div>
              <div style={gb}>
                <div style={{display:"flex",flexDirection:"column",gap:4}}>
                  <div style={{display:"flex",alignItems:"center",gap:4}}>
                    <label style={{fontSize:12,fontWeight:600,color:C.cinzaEscuro,fontFamily:Fn.body}}>Placa do veículo</label>
                    <Tooltip text="Formato: ABC-1D23 (Mercosul) ou ABC-1234 (antigo). Necessário para veículos motorizados." variant="dark"><span style={{display:"flex",cursor:"help"}}>{Ic.help(14,C.azulCeu)}</span></Tooltip>
                    <span style={{color:C.danger,fontWeight:700}}>*</span>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8,height:35,padding:"0 12px",background:C.branco,border:`1.5px solid ${C.cardBorder}`,borderRadius:8,fontFamily:Fn.body,fontSize:13,color:C.textLight}}>
                    ABC-1D23
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* 04 — GUIA */}
        <Section n="04" title="Guia de uso por variante" desc="Quando usar cada estilo de tooltip.">
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:16}}>
            {[
              {name:"Escuro (dark)",c:C.cinzaEscuro,badge:"★ padrão",desc:"Fundo escuro com texto branco. Alto contraste, máxima legibilidade.",when:"Dicas de ajuda, explicação de ícones, descrição de campos. 90% dos casos.",ex:"(?) ao lado de CNPJ; tooltip em header de tabela; dica em ícone de status."},
              {name:"Claro (light)",c:C.cinzaClaro,badge:"neutro",desc:"Fundo branco com borda. Discreto, menor hierarquia visual.",when:"Contextos claros onde dark seria agressivo. Cards com fundo escuro.",ex:"Tooltips sobre elementos em headers azuis; dicas em menus laterais."},
              {name:"Info",c:C.azulProfundo,badge:"informativo",desc:"Fundo azul claro. Para dicas informativas e contexto de aprendizado.",when:"Onboarding, tutoriais, explicações de funcionalidade, dicas proativas.",ex:"Primeiro acesso ao App Ideias; dica sobre Fipcoins; explicação de SLA."},
              {name:"Atenção",c:C.amareloEscuro,badge:"alerta",desc:"Fundo laranja claro. Alerta suave para campos ou ações sensíveis.",when:"Campos com regras especiais, ações que afetam outros registros.",ex:"Campo de exclusão; prazo próximo do vencimento; ação irreversível."},
              {name:"Erro",c:C.danger,badge:"validação",desc:"Fundo vermelho claro. Para erros de validação e bloqueios de ação.",when:"Botão desabilitado com explicação, campo inválido, permissão negada.",ex:"'Sem permissão para excluir'; 'Campo obrigatório'; 'Formato inválido'."},
              {name:"Sucesso",c:C.verdeFloresta,badge:"confirmação",desc:"Fundo verde claro. Confirmação positiva ou validação OK.",when:"Status ativo com detalhes, campo validado, ação disponível com contexto.",ex:"Badge 'Ativo' com data; campo validado com check; permissão concedida."},
            ].map(t=>(
              <div key={t.name} style={{...gc,borderLeft:`4px solid ${t.c}`}}>
                <div style={gh}><span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>{t.name}</span><code style={gk}>{t.badge}</code></div>
                <div style={gb}>
                  <p style={gt}>{t.desc}</p>
                  <div style={gl}>Quando usar</div><p style={gt}>{t.when}</p>
                  <div style={gl}>Exemplo FIPS</div><p style={ge}>{t.ex}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* 05 — COMPORTAMENTO */}
        <Section n="05" title="Anatomia e comportamento" desc="Estrutura visual e regras de interação.">
          <DSCard mob={mob}>
            <div style={{display:"flex",gap:40,flexWrap:"wrap"}}>
              <div style={{flex:1,minWidth:250}}>
                <span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title,display:"block",marginBottom:12}}>Estrutura</span>
                {[
                  {l:"Fundo",v:"Cor da variante (dark = #333B41)"},
                  {l:"Texto",v:"12px Open Sans, line-height 1.4"},
                  {l:"Título (rico)",v:"12px Open Sans 700 (opcional)"},
                  {l:"Padding",v:"6px 10px (simples) / 8px 12px (rico)"},
                  {l:"Border radius",v:"6px"},
                  {l:"Max width",v:"240px (configurável)"},
                  {l:"Seta (arrow)",v:"6px CSS border-trick"},
                  {l:"Sombra",v:"0 4px 12px rgba(0,0,0,.12)"},
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
                  {l:"Trigger",v:"mouseEnter (hover)"},
                  {l:"Delay entrada",v:"200ms (evita flash acidental)"},
                  {l:"Delay saída",v:"Imediato no mouseLeave"},
                  {l:"Animação",v:"fadeIn .15s ease"},
                  {l:"Posição padrão",v:"top (acima do elemento)"},
                  {l:"Fallback",v:"Trocar posição se corta viewport"},
                  {l:"z-index",v:"50"},
                  {l:"Pointer events",v:"none (não intercepta cliques)"},
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

        {/* 06 — CENÁRIOS */}
        <Section n="06" title="Cenários de negócio" desc="Exemplos reais de tooltips nos apps FIPS. Passe o mouse para testar.">
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:16}}>
            <div style={{background:C.bg,border:`1px solid ${C.cardBorder}`,borderRadius:"10px 10px 10px 20px",padding:mob?16:24}}>
              <h3 style={{fontSize:14,fontWeight:700,color:C.cinzaEscuro,margin:"0 0 4px",fontFamily:Fn.title}}>App Visitante</h3>
              <p style={{fontSize:12,color:C.cinzaChumbo,margin:"0 0 16px"}}>Help em campos do formulário</p>
              <div style={{background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:8,padding:16,display:"flex",flexDirection:"column",gap:12}}>
                <div style={{display:"flex",alignItems:"center",gap:4}}>
                  <span style={{fontSize:12,fontWeight:600,color:C.cinzaEscuro}}>Tipo de veículo</span>
                  <Tooltip text="Selecione 'A pé' ou 'Bicicleta' para ocultar o campo de placa." variant="info"><span style={{display:"flex",cursor:"help"}}>{Ic.help(14,C.azulCeu)}</span></Tooltip>
                  <span style={{color:C.danger,fontWeight:700}}>*</span>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:4}}>
                  <span style={{fontSize:12,fontWeight:600,color:C.cinzaEscuro}}>Empresa visitada</span>
                  <Tooltip text="Razão social da empresa que o visitante vai acessar. Obrigatório para gerar o crachá." variant="dark"><span style={{display:"flex",cursor:"help"}}>{Ic.help(14,C.azulCeu)}</span></Tooltip>
                </div>
              </div>
            </div>

            <div style={{background:C.bg,border:`1px solid ${C.cardBorder}`,borderRadius:"10px 10px 10px 20px",padding:mob?16:24}}>
              <h3 style={{fontSize:14,fontWeight:700,color:C.cinzaEscuro,margin:"0 0 4px",fontFamily:Fn.title}}>App Suprimentos</h3>
              <p style={{fontSize:12,color:C.cinzaChumbo,margin:"0 0 16px"}}>Tooltips em ações e status</p>
              <div style={{background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:8,padding:16,display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
                <Tooltip text="Aprovar e encaminhar para compra." variant="sucesso" position="bottom">
                  <button style={{padding:"7px 16px",fontSize:12,fontWeight:600,background:C.verdeFloresta,color:C.branco,border:"none",borderRadius:6,cursor:"pointer",fontFamily:Fn.body}}>Aprovar</button>
                </Tooltip>
                <Tooltip text="Rejeitar com justificativa obrigatória." variant="erro" position="bottom">
                  <button style={{padding:"7px 16px",fontSize:12,fontWeight:600,background:C.danger,color:C.branco,border:"none",borderRadius:6,cursor:"pointer",fontFamily:Fn.body}}>Rejeitar</button>
                </Tooltip>
                <Tooltip text="Valor: R$ 2.450,00. Fornecedor: MRS Logística." variant="dark">
                  <Badge variant="info" size="sm">REQ-4025</Badge>
                </Tooltip>
              </div>
            </div>

            <div style={{background:C.bg,border:`1px solid ${C.cardBorder}`,borderRadius:"10px 10px 10px 20px",padding:mob?16:24}}>
              <h3 style={{fontSize:14,fontWeight:700,color:C.cinzaEscuro,margin:"0 0 4px",fontFamily:Fn.title}}>App Ideias</h3>
              <p style={{fontSize:12,color:C.cinzaChumbo,margin:"0 0 16px"}}>Dica sobre sistema de gamificação</p>
              <div style={{background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:8,padding:16,display:"flex",alignItems:"center",gap:10}}>
                <Tooltip title="Fipcoins" text="Moeda virtual da FIPS. Ganhe por ideias aprovadas, boas práticas e participação." variant="dark" maxW={260}>
                  <span style={{display:"flex",gap:4,alignItems:"center",cursor:"help"}}>{Ic.star(16,C.amareloOuro)}<span style={{fontSize:13,fontWeight:700,color:"#92400E"}}>+50 Fipcoins</span></span>
                </Tooltip>
                <Tooltip text="Sua ideia foi avaliada por 3 membros da comissão." variant="info">
                  <Badge variant="sucesso" dot size="sm">Aprovada</Badge>
                </Tooltip>
              </div>
            </div>

            <div style={{background:C.bg,border:`1px solid ${C.cardBorder}`,borderRadius:"10px 10px 10px 20px",padding:mob?16:24}}>
              <h3 style={{fontSize:14,fontWeight:700,color:C.cinzaEscuro,margin:"0 0 4px",fontFamily:Fn.title}}>Dashboard / Power BI</h3>
              <p style={{fontSize:12,color:C.cinzaChumbo,margin:"0 0 16px"}}>Tooltip em KPIs e métricas</p>
              <div style={{background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:8,padding:16,display:"flex",gap:16,alignItems:"center"}}>
                <Tooltip title="SLA" text="Service Level Agreement. Meta: 90%. Cálculo: entregas no prazo / total de entregas." variant="dark" maxW={280}>
                  <div style={{cursor:"help"}}>
                    <span style={{fontSize:11,color:C.cinzaChumbo,display:"block"}}>SLA</span>
                    <span style={{fontSize:24,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>94%</span>
                  </div>
                </Tooltip>
                <Tooltip title="Ocorrências" text="Ocorrências SSMA abertas. Críticas: 2, Pendentes: 3, Em análise: 2." variant="atencao" maxW={260}>
                  <div style={{cursor:"help"}}>
                    <span style={{fontSize:11,color:C.cinzaChumbo,display:"block"}}>Ocorrências</span>
                    <span style={{fontSize:24,fontWeight:700,color:C.amareloEscuro,fontFamily:Fn.title}}>7</span>
                  </div>
                </Tooltip>
              </div>
            </div>
          </div>
        </Section>

        {/* 07 — TOKENS */}
        <Section n="07" title="Tokens de referência" desc="Valores de design do componente Tooltip.">
          <DSCard mob={mob} s={{display:"flex",gap:mob?24:48,flexWrap:"wrap"}}>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:Fn.title,marginBottom:4}}>Cores de fundo</span>
              <TokenRow label="Dark ★" value="#333B41" color={C.cinzaEscuro}/>
              <TokenRow label="Light" value="#FFFFFF" color={C.branco}/>
              <TokenRow label="Info" value="#EFF6FF" color="#EFF6FF"/>
              <TokenRow label="Atenção" value="#FFF7ED" color="#FFF7ED"/>
              <TokenRow label="Erro" value="#FEF2F2" color="#FEF2F2"/>
              <TokenRow label="Sucesso" value="#ECFDF5" color="#ECFDF5"/>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:Fn.title,marginBottom:4}}>Dimensões</span>
              <TokenRow label="Padding simples" value="6px 10px"/>
              <TokenRow label="Padding rico" value="8px 12px"/>
              <TokenRow label="Border radius" value="6px"/>
              <TokenRow label="Max width" value="240px (default)"/>
              <TokenRow label="Arrow size" value="6px"/>
              <TokenRow label="z-index" value="50"/>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:Fn.title,marginBottom:4}}>Tipografia</span>
              <TokenRow label="Texto" value="Open Sans 400 12px"/>
              <TokenRow label="Título (rico)" value="Open Sans 700 12px"/>
              <TokenRow label="Line height" value="1.4"/>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:Fn.title,marginBottom:4}}>Comportamento</span>
              <TokenRow label="Delay entrada" value="200ms"/>
              <TokenRow label="Delay saída" value="Imediato"/>
              <TokenRow label="Animação" value="fadeIn .15s ease"/>
              <TokenRow label="Sombra" value="0 4px 12px"/>
            </div>
          </DSCard>
        </Section>

        {/* 08 — MODO DARK */}
        <Section n="08" title="Modo Dark" desc="Tokens e comportamento do componente no tema escuro. Consistência visual garantida em ambos os modos.">
          <div style={{background:C.cardBg,borderRadius:"10px 10px 10px 18px",border:`1px solid ${C.cardBorder}`,padding:mob?16:24}}>
            <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:12}}>
              {[
                {token:"Dark bg",light:"#333B41",dark:"#1A2332"},
                {token:"Dark text",light:"#FFFFFF",dark:"#D1D9E0"},
                {token:"Light bg",light:"#FFFFFF",dark:"#2A3A4A"},
                {token:"Light text",light:"#333B41",dark:"#D1D9E0"},
                {token:"Light border",light:"#E2E8F0",dark:"#3A4A5A"},
                {token:"Info bg",light:"#EFF6FF",dark:"#0F1F33"},
                {token:"Atenção bg",light:"#FFF7ED",dark:"#2A1F0E"},
                {token:"Erro bg",light:"#FEF2F2",dark:"#2A1215"},
                {token:"Sucesso bg",light:"#ECFDF5",dark:"#0D2818"},
                {token:"Arrow color",light:"matches bg",dark:"matches bg"},
                {token:"Shadow",light:"rgba(0,0,0,0.12)",dark:"rgba(0,0,0,0.35)"},
                {token:"Border radius",light:"6px",dark:"6px"},
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

        <div style={{textAlign:"center",padding:"20px 0 0",borderTop:`1px solid ${C.cardBorder}`,marginTop:20}}>
          <span style={{fontSize:12,color:C.cinzaChumbo,letterSpacing:".5px",fontFamily:Fn.title,fontWeight:400}}>DS-FIPS v2.0 · Ferrovia Interna do Porto de Santos · Excelência sobre trilhos · {new Date().getFullYear()}</span>
        </div>
      </div>
    </div>
  );
}
