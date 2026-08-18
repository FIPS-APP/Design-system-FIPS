import { useState, useEffect } from "react";
import { useFipsTheme } from "../../hooks/useFipsTheme";

const C={azulProfundo:"var(--color-gov-azul-profundo)",azulEscuro:"var(--color-gov-azul-escuro)",azulClaro:"var(--color-gov-azul-claro)",cinzaChumbo:"var(--color-fg-muted)",cinzaEscuro:"var(--color-fg)",cinzaClaro:"#C0CCD2",azulCeu:"#93BDE4",azulCeuClaro:"#D3E3F4",amareloOuro:"#FDC24E",amareloEscuro:"#F6921E",verdeFloresta:"#00C64C",verdeEscuro:"var(--color-gov-verde-escuro)",danger:"#DC3545",neutro:"var(--color-surface-soft)",branco:"#FFFFFF",bg:"var(--color-surface-muted)",cardBg:"var(--color-surface)",cardBorder:"var(--color-border)",textMuted:"var(--color-fg-muted)",textLight:"var(--color-fg-muted)",gradFrom:"var(--color-gov-gradient-from)",gradTo:"var(--color-gov-gradient-to)"};
const Fn={title:"'Saira Expanded',sans-serif",body:"'Open Sans',sans-serif",mono:"'Fira Code',monospace"};

/* ─── Helper: alpha channel via color-mix (works with CSS vars) ─── */
const alpha=(c:string,a:number)=>`color-mix(in srgb, ${c} ${Math.round(a*100)}%, transparent)`;

const Ic={
  grid:(s:number=14,c:string=C.amareloOuro)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><rect x="2" y="2" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/><rect x="11" y="2" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/><rect x="2" y="11" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/><rect x="11" y="11" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/></svg>,
  link:(s:number=22,c:string=C.branco)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke={c} strokeWidth="1.8" strokeLinecap="round"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>,
  eye:(s:number=22,c:string=C.branco)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" stroke={c} strokeWidth="1.8"/><circle cx="12" cy="12" r="3" stroke={c} strokeWidth="1.8"/></svg>,
  zap:(s:number=22,c:string=C.branco)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/></svg>,
  train:(s:number=22,c:string=C.branco)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none"><rect x="4" y="3" width="16" height="14" rx="3" stroke={c} strokeWidth="1.8"/><path d="M4 11h16M9 21l-2-4h10l-2 4" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><circle cx="8.5" cy="15" r="1" fill={c}/><circle cx="15.5" cy="15" r="1" fill={c}/></svg>,
  btn:(s:number=16,c:string)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><rect x="2" y="5" width="16" height="10" rx="3" stroke={c} strokeWidth="1.4"/><path d="M7 10h6" stroke={c} strokeWidth="1.4" strokeLinecap="round"/></svg>,
  input:(s:number=16,c:string)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><rect x="2" y="5" width="16" height="10" rx="2" stroke={c} strokeWidth="1.3"/><path d="M5 10h4" stroke={c} strokeWidth="1.3" strokeLinecap="round"/><path d="M11 7v6" stroke={c} strokeWidth="1.3" strokeLinecap="round" opacity=".4"/></svg>,
  field:(s:number=16,c:string)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><rect x="2" y="3" width="16" height="14" rx="2" stroke={c} strokeWidth="1.3"/><path d="M5 7h10M5 10h6" stroke={c} strokeWidth="1.3" strokeLinecap="round"/></svg>,
  progress:(s:number=16,c:string)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><rect x="2" y="8" width="16" height="4" rx="2" stroke={c} strokeWidth="1.3"/><rect x="2" y="8" width="10" height="4" rx="2" fill={c} opacity=".3"/></svg>,
  select:(s:number=16,c:string)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><rect x="2" y="5" width="16" height="10" rx="2" stroke={c} strokeWidth="1.3"/><path d="M13 9l2 2-2 2" stroke={c} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  textarea:(s:number=16,c:string)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><rect x="2" y="3" width="16" height="14" rx="2" stroke={c} strokeWidth="1.3"/><path d="M5 7h10M5 10h10M5 13h6" stroke={c} strokeWidth="1.2" strokeLinecap="round"/></svg>,
  badge:(s:number=16,c:string)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><rect x="3" y="7" width="14" height="6" rx="3" stroke={c} strokeWidth="1.3"/><circle cx="6.5" cy="10" r="1.5" fill={c} opacity=".4"/></svg>,
  card:(s:number=16,c:string)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><rect x="2" y="3" width="16" height="14" rx="3" stroke={c} strokeWidth="1.3"/><path d="M2 8h16" stroke={c} strokeWidth="1.3"/></svg>,
  toast:(s:number=16,c:string)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><rect x="3" y="6" width="14" height="8" rx="2" stroke={c} strokeWidth="1.3"/><circle cx="6.5" cy="10" r="1.2" stroke={c} strokeWidth="1.1"/><path d="M9 10h5" stroke={c} strokeWidth="1.3" strokeLinecap="round"/></svg>,
  tooltip:(s:number=16,c:string)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><rect x="3" y="4" width="14" height="9" rx="2" stroke={c} strokeWidth="1.3"/><path d="M8 13l2 3 2-3" stroke={c} strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  drawer:(s:number=16,c:string)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><rect x="8" y="2" width="10" height="16" rx="2" stroke={c} strokeWidth="1.3"/><path d="M11 6h4M11 9h4M11 12h2" stroke={c} strokeWidth="1.2" strokeLinecap="round"/></svg>,
  tabs:(s:number=16,c:string)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><rect x="2" y="6" width="16" height="11" rx="2" stroke={c} strokeWidth="1.3"/><path d="M2 9h16" stroke={c} strokeWidth="1.3"/><rect x="3" y="6" width="5" height="3" rx="1" fill={c} opacity=".3"/></svg>,
  modal:(s:number=16,c:string)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><rect x="3" y="4" width="14" height="12" rx="2.5" stroke={c} strokeWidth="1.3"/><path d="M3 8h14" stroke={c} strokeWidth="1.3"/><circle cx="15" cy="6" r=".8" fill={c}/></svg>,
  table:(s:number=16,c:string)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><rect x="2" y="3" width="16" height="14" rx="2" stroke={c} strokeWidth="1.3"/><path d="M2 7h16M2 11h16M8 7v10" stroke={c} strokeWidth="1.2"/></svg>,
  arrow:(s:number=12,c:string=C.azulProfundo)=><svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
};

function JunctionLines({style}:{style?:React.CSSProperties}){return <svg viewBox="0 0 320 200" fill="none" style={{opacity:.12,...style}}><path d="M0 60H100C120 60 120 60 140 40L200 40H320" stroke="var(--color-junction-stroke)" strokeWidth="6" strokeLinecap="round"/><path d="M0 60H100C120 60 120 60 140 80L200 80H320" stroke="var(--color-junction-stroke)" strokeWidth="6" strokeLinecap="round"/><path d="M0 120H60C80 120 80 120 100 100L160 100H320" stroke="var(--color-junction-stroke)" strokeWidth="6" strokeLinecap="round"/><path d="M0 120H60C80 120 80 120 100 140L160 140H320" stroke="var(--color-junction-stroke)" strokeWidth="6" strokeLinecap="round"/></svg>}

function Section({n,title,desc,children}:{n:string,title:string,desc:string,children:React.ReactNode}){return(<section style={{marginBottom:48}}><div style={{fontSize:10,fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",color:C.azulClaro,fontFamily:Fn.title,marginBottom:6}}>{n}</div><h2 style={{fontSize:22,fontWeight:700,color:C.cinzaEscuro,margin:"0 0 4px",fontFamily:Fn.title,letterSpacing:".5px"}}>{title}</h2><p style={{fontSize:14,color:C.cinzaChumbo,margin:"0 0 22px",lineHeight:1.55,fontFamily:Fn.body}}>{desc}</p>{children}</section>)}
function DSCard({children,s,mob:m}:{children:React.ReactNode,s?:React.CSSProperties,mob?:boolean}){return(<div style={{background:C.cardBg,borderRadius:"12px 12px 12px 24px",border:`1px solid ${C.cardBorder}`,padding:m?16:28,boxShadow:"0 1px 3px rgba(0,75,155,.04),0 4px 14px rgba(0,75,155,.03)",...s}}>{children}</div>)}
function TokenRow({label,value,color}:{label:string,value:string,color?:string}){return(<div style={{display:"flex",alignItems:"center",gap:10,fontSize:12,fontFamily:Fn.body}}>{color&&<div style={{width:16,height:16,borderRadius:4,background:color,border:`1px solid ${C.cardBorder}`,flexShrink:0}}/>}<span style={{color:C.cinzaChumbo,minWidth:140}}>{label}</span><code style={{background:C.neutro,padding:"2px 8px",borderRadius:4,fontSize:11,fontFamily:Fn.mono,color:C.cinzaEscuro}}>{value}</code></div>)}

const principles=[
  {icon:Ic.link,title:"Consistência",desc:"Todos os apps FIPS compartilham os mesmos tokens, componentes e padrões de interação. Um usuário do App Suprimentos se sente em casa no App Ocorrências.",color:C.azulProfundo,bg:alpha(C.azulProfundo,.09)},
  {icon:Ic.eye,title:"Acessibilidade",desc:"Contrastes WCAG AA, tamanhos mínimos de toque 42px no mobile, labels sempre visíveis, estados de foco em todos os interativos.",color:C.verdeFloresta,bg:alpha(C.verdeFloresta,.09)},
  {icon:Ic.zap,title:"Eficiência",desc:"Componentes prontos para uso com opções claras de personalização. Menos tempo projetando, mais tempo resolvendo problemas do negócio ferroviário.",color:C.amareloEscuro,bg:alpha(C.amareloEscuro,.09)},
  {icon:Ic.train,title:"Identidade Ferroviária",desc:"Elemento caixa, linhas de junção, cores do Brandbook FIPS. Cada tela carrega a identidade da Ferrovia Interna do Porto de Santos.",color:C.azulCeu,bg:alpha(C.azulCeu,.15)},
];

const colors={
  primary:[{name:"Azul Profundo",hex:"#004B9B",usage:"Ações primárias, headers, links"},{name:"Azul Escuro",hex:"#002A68",usage:"Textos de título, backgrounds escuros"},{name:"Cinza Chumbo",hex:"#7B8C96",usage:"Textos secundários, labels, placeholders"}],
  secondary:[{name:"Azul Céu",hex:"#93BDE4",usage:"Backgrounds info, seleção sutil"},{name:"Azul Céu Claro",hex:"#D3E3F4",usage:"Backgrounds leves, containers"},{name:"Amarelo Ouro",hex:"#FDC24E",usage:"Destaques, indicadores, atenção leve"},{name:"Amarelo Escuro",hex:"#F6921E",usage:"Underline ativo, badges atenção, CTA"},{name:"Verde Floresta",hex:"#00C64C",usage:"Sucesso, status ativo, progresso"},{name:"Verde Escuro",hex:"#00904C",usage:"Texto sucesso, badges aprovado"}],
  semantic:[{name:"Sucesso",hex:"#00C64C",usage:"Aprovado, ativo, completo"},{name:"Atenção",hex:"#F6921E",usage:"Pendente, alerta, prazo"},{name:"Crítico",hex:"#DC3545",usage:"Rejeitado, erro, exclusão"},{name:"Info",hex:"#93BDE4",usage:"Informativo, neutro, destaque leve"}]
};

const components=[
  {name:"Button",desc:"Primário, secundário, ghost, danger, loading",icon:Ic.btn,color:C.azulProfundo},
  {name:"Input",desc:"Texto, senha, busca, com ícone e validação",icon:Ic.input,color:C.azulEscuro},
  {name:"Field",desc:"Label + input + helper + erro em conjunto",icon:Ic.field,color:C.cinzaChumbo},
  {name:"Progress",desc:"Barra, circular, autoColor 5 faixas",icon:Ic.progress,color:C.verdeFloresta},
  {name:"Select",desc:"Dropdown custom com busca e multi",icon:Ic.select,color:C.amareloEscuro},
  {name:"Textarea",desc:"Multilinha com contador e resize",icon:Ic.textarea,color:C.azulCeu},
  {name:"Badge",desc:"Status, contadores, categorias, dot",icon:Ic.badge,color:C.verdeEscuro},
  {name:"Card",desc:"KPI, status, resumo, ação, lista",icon:Ic.card,color:C.amareloOuro},
  {name:"Toast",desc:"Sucesso, erro, aviso, info com auto-dismiss",icon:Ic.toast,color:C.danger},
  {name:"Tooltip",desc:"4 posições, hover/click, delay",icon:Ic.tooltip,color:C.cinzaClaro},
  {name:"Drawer",desc:"Lateral direita, formulário, detalhes",icon:Ic.drawer,color:C.azulProfundo},
  {name:"Tabs",desc:"Underline, filled, guia, bordered, vertical",icon:Ic.tabs,color:C.amareloEscuro},
  {name:"Modal",desc:"Confirmação, form, destrutivo, animação spring",icon:Ic.modal,color:C.azulEscuro},
  {name:"Table",desc:"Sort, select, paginate, composições ricas",icon:Ic.table,color:C.verdeFloresta},
];

const downloadPackages=[
  {
    kind:"docs",
    file:"design-system-fips-complete-docs.md",
    title:"Documentação completa",
    description:"Markdown offline com fundamentos, componentes, governança e mapa de código do Design System FIPS.",
    href:"/downloads/design-system-fips-complete-docs.md",
    cta:"Baixar .md",
    accent:C.amareloOuro,
    bullets:[
      "Tokens oficiais de cor, tipografia, spacing, raios e sombras",
      "Mapa dos arquivos-fonte do repositório",
      "Regras de uso por componente e padrão de tela",
      "Checklist de governança para times e parceiros",
    ],
  },
  {
    kind:"skill",
    file:"ds-fips-skill.zip",
    title:"Skill portátil para IA",
    description:"Pacote com SKILL.md, referências sob demanda e instruções exatas para outra IA reproduzir o padrão FIPS.",
    href:"/downloads/ds-fips-skill.zip",
    cta:"Baixar .zip",
    accent:C.verdeFloresta,
    bullets:[
      "SKILL.md pronto para uso em ambientes Codex/OpenAI",
      "Referências separadas por foundations, components e patterns",
      "Snippets essenciais e ordem de prioridade das fontes",
      "Regras para reutilizar componentes em vez de CSS local",
    ],
  },
];

export default function DSFIPSOverview(){
  const [w,setW]=useState(typeof window!=="undefined"?window.innerWidth:1200);
  useEffect(()=>{const h=()=>setW(window.innerWidth);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h)},[]);
  const mob=w<640;
  const [hovComp,setHovComp]=useState(-1);
  const {dark}=useFipsTheme();

  return(
    <div style={{minHeight:"100vh",background:"var(--color-surface-muted)",fontFamily:Fn.body,color:C.cinzaEscuro}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Saira+Expanded:wght@300;400;500;600;700;800&family=Open+Sans:wght@300;400;600;700&family=Fira+Code:wght@400;500&display=swap');@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}@keyframes pulse{0%,100%{opacity:.6}50%{opacity:1}}`}</style>

      <header style={{background:`linear-gradient(135deg,${C.gradFrom} 0%,${C.gradTo} 100%)`,padding:mob?"40px 20px 36px":"64px 40px 56px",position:"relative",overflow:"hidden"}}>
        <JunctionLines style={{position:"absolute",top:-10,right:-20,width:mob?250:500,height:300}}/>
        <JunctionLines style={{position:"absolute",bottom:-40,left:-60,width:300,height:200,transform:"scaleX(-1)"}}/>
        <div style={{position:"relative",maxWidth:800}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:6,background:alpha(C.branco,.06),border:`1px solid ${alpha(C.branco,.09)}`,borderRadius:20,padding:"5px 14px",fontSize:11,fontWeight:600,letterSpacing:"1.5px",textTransform:"uppercase",color:C.amareloOuro,fontFamily:Fn.title,marginBottom:20}}>{Ic.grid(14,C.amareloOuro)} Visão Geral</div>
          <h1 style={{fontSize:mob?32:52,fontWeight:800,color:C.branco,margin:"0 0 12px",fontFamily:Fn.title,lineHeight:1.1,letterSpacing:"-0.5px"}}>Design System<br/><span style={{color:C.amareloOuro}}>FIPS</span></h1>
          <p style={{fontSize:mob?15:18,color:alpha(C.branco,.72),lineHeight:1.65,margin:"0 0 24px",fontFamily:Fn.body,maxWidth:650}}>Sistema de design unificado da Ferrovia Interna do Porto de Santos. Componentes, tokens e padrões para construir aplicações consistentes, acessíveis e com identidade ferroviária.</p>
          <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:6,background:alpha(C.verdeFloresta,.19),border:`1px solid ${alpha(C.verdeFloresta,.31)}`,borderRadius:20,padding:"6px 14px",fontSize:12,fontWeight:600,color:C.verdeFloresta,fontFamily:Fn.body}}><span style={{width:6,height:6,borderRadius:"50%",background:C.verdeFloresta,animation:"pulse 2s infinite"}}/>v0.4.2</div>
            <div style={{display:"inline-flex",alignItems:"center",gap:6,background:alpha(C.branco,.06),border:`1px solid ${alpha(C.branco,.09)}`,borderRadius:20,padding:"6px 14px",fontSize:12,fontWeight:500,color:alpha(C.branco,.80),fontFamily:Fn.body}}>14 componentes</div>
            <div style={{display:"inline-flex",alignItems:"center",gap:6,background:alpha(C.branco,.06),border:`1px solid ${alpha(C.branco,.09)}`,borderRadius:20,padding:"6px 14px",fontSize:12,fontWeight:500,color:alpha(C.branco,.80),fontFamily:Fn.body}}>React + Tailwind</div>
            <div style={{display:"inline-flex",alignItems:"center",gap:6,background:alpha(C.branco,.06),border:`1px solid ${alpha(C.branco,.09)}`,borderRadius:20,padding:"6px 14px",fontSize:12,fontWeight:500,color:alpha(C.branco,.80),fontFamily:Fn.body}}>Dark mode ✓</div>
          </div>
        </div>
      </header>

      <div style={{padding:mob?"24px 16px 40px":"40px 40px 60px",maxWidth:1100,margin:"0 auto"}}>
        <Section n="01" title="Princípios de design" desc="Quatro pilares que guiam todas as decisões visuais e de interação do ecossistema FIPS.">
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr 1fr":"1fr 1fr 1fr 1fr",gap:mob?10:16}}>
            {principles.map((p,i)=>{const c=p.color;return(
              <div key={i} style={{background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:"10px 10px 10px 18px",overflow:"hidden",boxShadow:dark?"0 2px 12px rgba(0,0,0,.25)":"0 2px 8px rgba(0,75,155,.05)"}}>
                <div style={{height:3,background:`linear-gradient(90deg,${c},${alpha(c,.38)})`}}/>
                <div style={{padding:mob?"14px 12px":"20px 20px 18px",textAlign:"center"}}>
                  <div style={{width:mob?40:50,height:mob?40:50,borderRadius:"50%",background:dark?alpha(c,.07):C.bg,border:`1.5px solid ${dark?alpha(c,.15):C.cardBorder}`,display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:12}}>{p.icon(mob?18:22,c)}</div>
                  <h3 style={{fontSize:mob?12:14,fontWeight:700,color:C.cinzaEscuro,margin:"0 0 6px",fontFamily:Fn.title}}>{p.title}</h3>
                  <p style={{fontSize:mob?10:12,color:C.cinzaChumbo,lineHeight:1.5,margin:0,fontFamily:Fn.body}}>{p.desc}</p>
                </div>
              </div>
            )})}
          </div>
        </Section>

        <Section n="02" title="Paleta de cores" desc="Cores primárias do Brandbook FIPS, cores secundárias de apoio e cores semânticas para feedback.">
          <DSCard mob={mob}>
            <div style={{marginBottom:28}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:"1.2px",textTransform:"uppercase",color:C.textLight,fontFamily:Fn.title,display:"block",marginBottom:12}}>Primárias</span>
              <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr 1fr",gap:12}}>
                {colors.primary.map(c=>(
                  <div key={c.hex} style={{borderRadius:10,overflow:"hidden",border:`1px solid ${C.cardBorder}`}}>
                    <div style={{height:56,background:c.hex}}/>
                    <div style={{padding:"10px 12px"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                        <span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>{c.name}</span>
                        <code style={{fontSize:11,fontFamily:Fn.mono,color:C.cinzaChumbo}}>{c.hex}</code>
                      </div>
                      <span style={{fontSize:11,color:C.textMuted,fontFamily:Fn.body}}>{c.usage}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{marginBottom:28}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:"1.2px",textTransform:"uppercase",color:C.textLight,fontFamily:Fn.title,display:"block",marginBottom:12}}>Secundárias</span>
              <div style={{display:"grid",gridTemplateColumns:mob?"1fr 1fr":"repeat(6,1fr)",gap:10}}>
                {colors.secondary.map(c=>(
                  <div key={c.hex} style={{borderRadius:8,overflow:"hidden",border:`1px solid ${C.cardBorder}`}}>
                    <div style={{height:40,background:c.hex}}/>
                    <div style={{padding:"8px 10px"}}>
                      <span style={{fontSize:11,fontWeight:600,color:C.cinzaEscuro,fontFamily:Fn.title,display:"block"}}>{c.name}</span>
                      <code style={{fontSize:10,fontFamily:Fn.mono,color:C.cinzaChumbo}}>{c.hex}</code>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:"1.2px",textTransform:"uppercase",color:C.textLight,fontFamily:Fn.title,display:"block",marginBottom:12}}>Semânticas</span>
              <div style={{display:"grid",gridTemplateColumns:mob?"1fr 1fr":"1fr 1fr 1fr 1fr",gap:10}}>
                {colors.semantic.map(c=>(
                  <div key={c.name} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:8,border:`1px solid ${C.cardBorder}`,background:C.bg}}>
                    <div style={{width:28,height:28,borderRadius:8,background:c.hex,flexShrink:0}}/>
                    <div><span style={{fontSize:12,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title,display:"block"}}>{c.name}</span><span style={{fontSize:10,color:C.textMuted,fontFamily:Fn.body}}>{c.usage}</span></div>
                  </div>
                ))}
              </div>
            </div>
          </DSCard>
        </Section>

        <Section n="03" title="Tipografia" desc="Três famílias tipográficas com funções específicas: títulos com personalidade, corpo legível e código técnico.">
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr 1fr",gap:16}}>
            <DSCard mob={mob}>
              <code style={{fontSize:10,fontFamily:Fn.mono,background:alpha(C.azulProfundo,.07),color:C.cinzaEscuro,padding:"3px 8px",borderRadius:4,fontWeight:600}}>Títulos</code>
              <span style={{fontSize:28,fontWeight:800,color:C.cinzaEscuro,fontFamily:Fn.title,display:"block",lineHeight:1.2,margin:"12px 0 8px"}}>Saira Expanded</span>
              <p style={{fontSize:13,color:C.cinzaChumbo,margin:"0 0 16px",fontFamily:Fn.body,lineHeight:1.5}}>Headers de seção, títulos de página, badges de navegação e labels de destaque.</p>
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                <span style={{fontFamily:Fn.title,fontWeight:800,fontSize:20,color:C.cinzaEscuro}}>ExtraBold 800</span>
                <span style={{fontFamily:Fn.title,fontWeight:700,fontSize:18,color:C.cinzaEscuro}}>Bold 700</span>
                <span style={{fontFamily:Fn.title,fontWeight:600,fontSize:16,color:C.cinzaEscuro}}>SemiBold 600</span>
                <span style={{fontFamily:Fn.title,fontWeight:400,fontSize:14,color:C.cinzaChumbo}}>Regular 400</span>
              </div>
            </DSCard>
            <DSCard mob={mob}>
              <code style={{fontSize:10,fontFamily:Fn.mono,background:alpha(C.verdeFloresta,.07),color:C.verdeEscuro,padding:"3px 8px",borderRadius:4,fontWeight:600}}>Corpo</code>
              <span style={{fontSize:28,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.body,display:"block",lineHeight:1.2,margin:"12px 0 8px"}}>Open Sans</span>
              <p style={{fontSize:13,color:C.cinzaChumbo,margin:"0 0 16px",fontFamily:Fn.body,lineHeight:1.5}}>Textos de corpo, descrições, labels de formulário, conteúdo de tabela e parágrafos.</p>
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                <span style={{fontFamily:Fn.body,fontWeight:700,fontSize:16,color:C.cinzaEscuro}}>Bold 700 — destaque</span>
                <span style={{fontFamily:Fn.body,fontWeight:600,fontSize:14,color:C.cinzaEscuro}}>SemiBold 600 — labels</span>
                <span style={{fontFamily:Fn.body,fontWeight:400,fontSize:14,color:C.cinzaChumbo}}>Regular 400 — corpo de texto padrão para leitura confortável</span>
              </div>
            </DSCard>
            <DSCard mob={mob}>
              <code style={{fontSize:10,fontFamily:Fn.mono,background:alpha(C.amareloEscuro,.08),color:C.amareloEscuro,padding:"3px 8px",borderRadius:4,fontWeight:600}}>Mono</code>
              <span style={{fontSize:28,fontWeight:500,color:C.cinzaEscuro,fontFamily:Fn.mono,display:"block",lineHeight:1.2,margin:"12px 0 8px"}}>Fira Code</span>
              <p style={{fontSize:13,color:C.cinzaChumbo,margin:"0 0 16px",fontFamily:Fn.body,lineHeight:1.5}}>Valores numéricos, códigos, IDs, tokens de referência e snippets técnicos.</p>
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                <span style={{fontFamily:Fn.mono,fontWeight:500,fontSize:14,color:C.cinzaEscuro}}>Medium 500 — REQ-4025</span>
                <span style={{fontFamily:Fn.mono,fontWeight:400,fontSize:14,color:C.cinzaChumbo}}>Regular 400 — R$ 15.600</span>
                <span style={{fontFamily:Fn.mono,fontWeight:400,fontSize:12,color:C.textMuted}}>12px — #004B9B · 12px 24px</span>
              </div>
            </DSCard>
          </div>
        </Section>

        <Section n="04" title="Elementos gráficos" desc="Identidade visual herdada do Brandbook: elemento caixa assimétrico e linhas de junção ferroviária.">
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:16}}>
            <DSCard mob={mob}>
              <span style={{fontSize:14,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title,display:"block",marginBottom:12}}>Elemento Caixa</span>
              <p style={{fontSize:13,color:C.cinzaChumbo,lineHeight:1.55,margin:"0 0 20px",fontFamily:Fn.body}}>Border-radius assimétrico: três cantos arredondados + canto inferior esquerdo maior. Aplicado em cards, containers, modais e tabelas.</p>
              <div style={{display:"flex",gap:16,alignItems:"center",flexWrap:"wrap"}}>
                <div style={{width:100,height:70,borderRadius:"12px 12px 12px 24px",background:`linear-gradient(135deg,${C.gradFrom},${C.gradTo})`,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:10,color:alpha(C.branco,.56),fontFamily:Fn.mono}}>12 12 12 24</span></div>
                <div style={{width:80,height:56,borderRadius:"10px 10px 10px 18px",background:`linear-gradient(135deg,${C.verdeFloresta},${C.verdeEscuro})`,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:9,color:alpha(C.branco,.56),fontFamily:Fn.mono}}>10 10 10 18</span></div>
                <div style={{width:60,height:42,borderRadius:"8px 8px 8px 14px",background:`linear-gradient(135deg,${C.amareloOuro},${C.amareloEscuro})`,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:8,color:alpha(C.branco,.56),fontFamily:Fn.mono}}>8 8 8 14</span></div>
              </div>
            </DSCard>
            <DSCard mob={mob}>
              <span style={{fontSize:14,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title,display:"block",marginBottom:12}}>Linhas de Junção Ferroviária</span>
              <p style={{fontSize:13,color:C.cinzaChumbo,lineHeight:1.55,margin:"0 0 16px",fontFamily:Fn.body}}>Linhas que se dividem em bifurcações, remetendo aos trilhos da ferrovia. Usadas como elemento decorativo em headers e backgrounds.</p>
              <div style={{background:`linear-gradient(135deg,${C.gradFrom},${C.gradTo})`,borderRadius:"10px 10px 10px 18px",padding:"16px 12px",position:"relative",overflow:"hidden",height:100}}>
                <JunctionLines style={{position:"absolute",top:-10,left:-10,width:"120%",height:"120%",opacity:.25}}/>
                <span style={{position:"relative",fontSize:10,color:alpha(C.branco,.44),fontFamily:Fn.mono}}>header background pattern</span>
              </div>
            </DSCard>
          </div>
        </Section>

        <Section n="05" title="Catálogo de componentes" desc="14 componentes documentados com playground interativo, variantes, cenários de negócio e tokens de referência.">
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:0,border:`1px solid ${C.cardBorder}`,borderRadius:"12px 12px 12px 24px",overflow:"hidden",background:C.cardBg}}>
            {components.map((comp,i)=>{const isHov=hovComp===i;const cc=comp.color;return(
              <div key={comp.name} onMouseEnter={()=>setHovComp(i)} onMouseLeave={()=>setHovComp(-1)} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 18px",cursor:"pointer",transition:"all .15s",background:isHov?alpha(cc,.03):"transparent",borderBottom:((!mob&&i>=12)||(mob&&i===components.length-1))?"none":`1px solid ${C.cardBorder}`,borderRight:!mob&&i%2===0?`1px solid ${C.cardBorder}`:"none"}}>
                <span style={{fontSize:10,fontWeight:700,fontFamily:Fn.mono,color:isHov?cc:C.textLight,minWidth:20,transition:"color .15s"}}>{String(i+1).padStart(2,"0")}</span>
                <div style={{width:32,height:32,borderRadius:8,background:alpha(cc,isHov?.13:.05),display:"flex",alignItems:"center",justifyContent:"center",transition:"background .15s",flexShrink:0}}>{comp.icon(16,cc)}</div>
                <div style={{flex:1,minWidth:0}}>
                  <span style={{fontSize:13,fontWeight:700,color:isHov?cc:C.cinzaEscuro,fontFamily:Fn.title,display:"block",transition:"color .15s"}}>{comp.name}</span>
                  <span style={{fontSize:11,color:C.cinzaChumbo,fontFamily:Fn.body,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",display:"block"}}>{comp.desc}</span>
                </div>
                <div style={{opacity:isHov?1:0,transition:"opacity .15s",flexShrink:0}}>{Ic.arrow(12,cc)}</div>
              </div>
            )})}
          </div>
        </Section>

        <Section n="06" title="Tokens globais" desc="Espaçamentos, sombras, transições e breakpoints compartilhados por todos os componentes.">
          <DSCard mob={mob} s={{display:"flex",gap:mob?24:48,flexWrap:"wrap"}}>
            <div style={{display:"flex",flexDirection:"column",gap:10,minWidth:200}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:Fn.title,marginBottom:4}}>Espaçamento</span>
              <TokenRow label="xs" value="4px"/><TokenRow label="sm" value="8px"/><TokenRow label="md" value="12px"/><TokenRow label="lg" value="16px"/><TokenRow label="xl" value="24px"/><TokenRow label="2xl" value="32px"/><TokenRow label="3xl" value="48px"/>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10,minWidth:200}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:Fn.title,marginBottom:4}}>Sombras</span>
              <TokenRow label="Card" value="0 1px 3px rgba(…,.04)"/><TokenRow label="Elevated" value="0 4px 14px rgba(…,.08)"/><TokenRow label="Modal" value="0 20px 60px rgba(…,.20)"/><TokenRow label="Dropdown" value="0 8px 24px rgba(…,.12)"/><TokenRow label="Guia ativa" value="0 -4px 12px rgba(…,.10)"/>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10,minWidth:200}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:Fn.title,marginBottom:4}}>Transições</span>
              <TokenRow label="Rápida" value=".12s ease"/><TokenRow label="Padrão" value=".2s ease"/><TokenRow label="Suave" value=".3s ease"/><TokenRow label="Modal spring" value=".35s cubic-bezier"/><TokenRow label="Drawer slide" value=".3s ease"/>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10,minWidth:200}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:Fn.title,marginBottom:4}}>Breakpoints</span>
              <TokenRow label="Mobile" value="< 640px"/><TokenRow label="Tablet" value="< 900px"/><TokenRow label="Desktop" value="≥ 900px"/>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:Fn.title,marginBottom:4,marginTop:8}}>Inputs</span>
              <TokenRow label="Desktop" value="35px height"/><TokenRow label="Mobile" value="42px height"/><TokenRow label="Compacto" value="30px height"/>
            </div>
          </DSCard>
        </Section>

        <Section n="07" title="Baixar pacotes para IA" desc="Baixe a documentação consolidada ou a skill portátil para usar este design system fora deste projeto.">
          <div style={{background:`linear-gradient(135deg,${C.gradFrom},${C.gradTo})`,borderRadius:"12px 12px 12px 24px",padding:mob?"24px 20px":"32px 36px",position:"relative",overflow:"hidden"}}>
            <JunctionLines style={{position:"absolute",top:-20,right:-30,width:350,height:250,opacity:.08}}/>
            <div style={{position:"relative",display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:16}}>
              {downloadPackages.map((pkg)=>(
                <div key={pkg.file} style={{background:alpha(C.branco,.03),borderRadius:"10px 10px 10px 20px",padding:mob?"18px 16px":"22px 22px 20px",border:`1px solid ${alpha(C.branco,.06)}`,display:"flex",flexDirection:"column",gap:16}}>
                  <div style={{display:"flex",alignItems:"flex-start",gap:14}}>
                    <div style={{width:52,height:52,borderRadius:16,background:alpha(C.branco,.08),display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      {pkg.kind==="skill" ? (
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                          <path d="M12 3l7 4v10l-7 4-7-4V7l7-4z" stroke={pkg.accent} strokeWidth="1.8" strokeLinejoin="round"/>
                          <path d="M9.5 12l1.5 1.5L14.5 10" stroke={pkg.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                          <path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5z" stroke={pkg.accent} strokeWidth="1.8" strokeLinejoin="round"/>
                          <path d="M14 3v5h5" stroke={pkg.accent} strokeWidth="1.8" strokeLinejoin="round"/>
                          <path d="M12 12v5m0 0l-2-2m2 2l2-2" stroke={pkg.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <span style={{display:"inline-flex",alignItems:"center",gap:6,background:alpha(pkg.accent,.13),color:pkg.accent,border:`1px solid ${alpha(pkg.accent,.21)}`,borderRadius:999,padding:"4px 10px",fontSize:10,fontWeight:700,letterSpacing:"1.1px",textTransform:"uppercase",fontFamily:Fn.title,marginBottom:10}}>
                        {pkg.kind==="skill"?"Skill":"Documentação"}
                      </span>
                      <span style={{fontSize:18,fontWeight:700,color:C.branco,fontFamily:Fn.title,display:"block",marginBottom:4}}>{pkg.title}</span>
                      <span style={{fontSize:12,color:alpha(C.branco,.50),fontFamily:Fn.mono,display:"block",marginBottom:8}}>{pkg.file}</span>
                      <span style={{fontSize:13,color:alpha(C.branco,.66),fontFamily:Fn.body,lineHeight:1.5,display:"block"}}>{pkg.description}</span>
                    </div>
                  </div>

                  <a
                    href={pkg.href}
                    download
                    style={{display:"inline-flex",alignItems:"center",justifyContent:"center",gap:6,alignSelf:mob?"stretch":"flex-start",background:pkg.accent,color:"#002A68",padding:"10px 18px",borderRadius:8,fontSize:13,fontWeight:700,fontFamily:Fn.title,textDecoration:"none",boxShadow:`0 4px 12px ${alpha(pkg.accent,.25)}`}}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M12 3v12m0 0l-4-4m4 4l4-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {pkg.cta}
                  </a>

                  <div style={{display:"grid",gridTemplateColumns:"1fr",gap:8}}>
                    {pkg.bullets.map((item,i)=>(
                      <div key={i} style={{display:"flex",alignItems:"flex-start",gap:8}}>
                        <span style={{color:pkg.accent,fontSize:12,lineHeight:"18px",flexShrink:0}}>✓</span>
                        <span style={{fontSize:11,color:alpha(C.branco,.56),fontFamily:Fn.body,lineHeight:1.45}}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <div style={{textAlign:"center",padding:"20px 0 0",borderTop:`1px solid ${C.cardBorder}`,marginTop:20}}>
          <span style={{fontSize:12,color:C.cinzaChumbo,letterSpacing:".5px",fontFamily:Fn.title,fontWeight:400}}>DS-FIPS v0.4.2 · Ferrovia Interna do Porto de Santos · Excelência sobre trilhos · {new Date().getFullYear()}</span>
        </div>
      </div>
    </div>
  );
}
