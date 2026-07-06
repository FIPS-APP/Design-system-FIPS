import { useState, useEffect } from "react";
import { Badge } from "../../components/ui/badge";
import {
  Blocks, Box, Cloud, Code2, Cpu, Database,
  ExternalLink, Flame, Gauge, Globe, Layers, LayoutDashboard,
  Monitor, Package, Palette, PenTool, Server,
  Shield, Sparkles, Terminal, Zap,
} from "lucide-react";

/* ═══════ TOKENS ═══════ */
const C={azulProfundo:"var(--color-gov-azul-profundo)",azulEscuro:"var(--color-gov-azul-escuro)",azulClaro:"var(--color-gov-azul-claro)",cinzaChumbo:"var(--color-fg-muted)",cinzaEscuro:"var(--color-fg)",cinzaClaro:"#C0CCD2",azulCeu:"#93BDE4",azulCeuClaro:"#D3E3F4",amareloOuro:"#FDC24E",amareloEscuro:"#F6921E",verdeFloresta:"#00C64C",verdeEscuro:"var(--color-gov-verde-escuro)",danger:"#DC3545",neutro:"var(--color-surface-soft)",branco:"#FFFFFF",bg:"var(--color-surface-muted)",cardBg:"var(--color-surface)",cardBorder:"var(--color-border)",textMuted:"var(--color-fg-muted)",gradientFrom:"var(--color-gov-gradient-from)",gradientTo:"var(--color-gov-gradient-to)"};
const Fn={title:"'Saira Expanded',sans-serif",body:"'Open Sans',sans-serif",mono:"'Fira Code',monospace"};
const alpha=(c:string,a:number)=>`color-mix(in srgb, ${c} ${Math.round(a*100)}%, transparent)`;

/* ═══════ Hero SVG (padrao Governance) ═══════ */
const Ic={
  grid:(s:number,c:string)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><rect x="2" y="2" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/><rect x="11" y="2" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/><rect x="2" y="11" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/><rect x="11" y="11" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/></svg>,
};
function JunctionLines({style}:{style?:React.CSSProperties}){return <svg viewBox="0 0 320 200" fill="none" style={{opacity:.12,...style}}><path d="M0 60H100C120 60 120 60 140 40L200 40H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/><path d="M0 60H100C120 60 120 60 140 80L200 80H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/><path d="M0 120H60C80 120 80 120 100 100L160 100H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/><path d="M0 120H60C80 120 80 120 100 140L160 140H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/></svg>}

/* ═══════ Shared components ═══════ */
function Section({n,title,desc,children}:{n:string,title:string,desc:string,children:React.ReactNode}){return(<section style={{marginBottom:48}}><div style={{fontSize:10,fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",color:C.azulClaro,fontFamily:Fn.title,marginBottom:6}}>{n}</div><h2 style={{fontSize:22,fontWeight:700,color:C.cinzaEscuro,margin:"0 0 4px",fontFamily:Fn.title,letterSpacing:".5px"}}>{title}</h2><p style={{fontSize:14,color:C.cinzaChumbo,margin:"0 0 22px",lineHeight:1.55,fontFamily:Fn.body}}>{desc}</p>{children}</section>)}
function DSCard({children,s,mob:m}:{children:React.ReactNode,s?:React.CSSProperties,mob?:boolean}){return(<div style={{background:C.cardBg,borderRadius:"12px 12px 12px 24px",border:`1px solid ${C.cardBorder}`,padding:m?16:28,boxShadow:"0 1px 3px rgba(0,75,155,.04),0 4px 14px rgba(0,75,155,.03)",...s}}>{children}</div>)}

/* ═══════ DATA ═══════ */

type StackItem = {
  name: string
  version?: string
  icon: typeof Sparkles
  color: string
  url: string
  why: string
  highlights: string[]
  category: "core" | "ui" | "tooling" | "backend" | "infra" | "dashboard"
}

const stacks: StackItem[] = [
  /* ── Core ── */
  {
    name: "React",
    version: "19",
    icon: Blocks,
    color: "#61DAFB",
    url: "https://react.dev",
    category: "core",
    why: "Biblioteca mais madura do ecossistema para interfaces complexas. O React 19 traz Server Components, Actions e o novo compilador que elimina memorizacoes manuais. Ecosistema imenso, comunidade ativa e suporte de longo prazo.",
    highlights: [
      "Concurrent rendering para UI sem travamento",
      "Hooks compostos que simplificam logica complexa",
      "Novo compilador auto-memoiza renders",
      "Ecosistema com milhares de libs compativeis",
    ],
  },
  {
    name: "TypeScript",
    version: "5.9",
    icon: Code2,
    color: "#3178C6",
    url: "https://www.typescriptlang.org",
    category: "core",
    why: "Tipagem estatica que pega erros em tempo de compilacao, antes de chegar ao usuario. Essencial em um Design System onde a API dos componentes precisa ser autodocumentada e segura.",
    highlights: [
      "Autocompletar inteligente via LSP",
      "Generics para componentes reutilizaveis tipados",
      "Detecta erros antes do deploy",
      "Props autodocumentadas — menos erros de integracao",
    ],
  },
  {
    name: "Vite",
    version: "8",
    icon: Zap,
    color: "#646CFF",
    url: "https://vite.dev",
    category: "core",
    why: "Build tool ultrarapido baseado em ESModules nativos. Hot Module Replacement instantaneo — mudou o codigo, viu na tela. Substituiu Webpack por ser 10-100x mais rapido no dev server.",
    highlights: [
      "Dev server inicia em menos de 500ms",
      "HMR instantaneo sem perder estado",
      "Tree-shaking e code-splitting automaticos",
      "Plugin ecosystem rico (React, Tailwind, etc.)",
    ],
  },

  /* ── UI / Styling ── */
  {
    name: "Tailwind CSS",
    version: "4",
    icon: Palette,
    color: "#06B6D4",
    url: "https://tailwindcss.com",
    category: "ui",
    why: "Framework utility-first que elimina a necessidade de escrever CSS customizado. O Tailwind 4 usa o novo engine Lightning CSS e e ate 10x mais rapido na compilacao. Design tokens viram variaveis CSS nativas.",
    highlights: [
      "Utility classes — sem arquivos CSS separados",
      "Engine Lightning CSS (10x mais rapido)",
      "Tokens integrados via CSS custom properties",
      "Purge automatico remove classes nao usadas",
    ],
  },
  {
    name: "Radix UI",
    icon: Box,
    color: "#AD7CFF",
    url: "https://www.radix-ui.com",
    category: "ui",
    why: "Primitivos headless acessiveis por padrao. Dialog, Tabs, Tooltip — todos com WAI-ARIA correto, foco trapping, keyboard nav e sem estilos opinativos. Nos estilizamos com nossos tokens.",
    highlights: [
      "100% acessivel por padrao (WAI-ARIA)",
      "Headless — sem estilos, nos controlamos tudo",
      "Composicao por slots (Radix Slot API)",
      "Gerenciamento de foco e keyboard navigation",
    ],
  },
  {
    name: "Framer Motion",
    icon: Sparkles,
    color: "#FF0055",
    url: "https://motion.dev",
    category: "ui",
    why: "Motor de animacoes declarativo para React. Permite animacoes complexas (layout, drag, scroll, gestures) com poucas linhas. Performance otimizada com GPU acceleration.",
    highlights: [
      "API declarativa — animate, exit, layout",
      "Animacoes de layout automaticas (LayoutGroup)",
      "Gestures: drag, tap, hover, pan",
      "Spring physics para animacoes naturais",
    ],
  },
  {
    name: "Lucide React",
    icon: PenTool,
    color: "#F56565",
    url: "https://lucide.dev",
    category: "ui",
    why: "Icones SVG leves, consistentes e tree-shakeable. Fork moderno do Feather Icons com 1500+ icones. Cada icone e um componente React com props tipadas.",
    highlights: [
      "1500+ icones consistentes em 24x24",
      "Tree-shakeable — so importa o que usa",
      "Customizavel via props (size, color, strokeWidth)",
      "Mantido ativamente pela comunidade",
    ],
  },
  {
    name: "Class Variance Authority",
    icon: Layers,
    color: "#8B5CF6",
    url: "https://cva.style",
    category: "ui",
    why: "Gerencia variantes de componentes (size, variant, state) de forma tipada. Essencial para um Design System onde cada componente tem multiplas variantes controladas por props.",
    highlights: [
      "Variantes tipadas com TypeScript",
      "Composicao de variantes (compound variants)",
      "Defaults configuraveis por variante",
      "Integra com Tailwind via tailwind-merge",
    ],
  },
  {
    name: "Sonner",
    icon: Monitor,
    color: "#F59E0B",
    url: "https://sonner.emilkowal.ski",
    category: "ui",
    why: "Toasts bonitos e acessiveis com zero configuracao. Empilhamento animado, swipe-to-dismiss, e temas automaticos. A melhor lib de toast do ecossistema React.",
    highlights: [
      "Setup em 1 linha (<Toaster />)",
      "Empilhamento animado com hover expand",
      "Acessivel com aria-live regions",
      "Temas light/dark automaticos",
    ],
  },

  /* ── Tooling ── */
  {
    name: "React Router",
    version: "7",
    icon: Globe,
    color: "#CA4245",
    url: "https://reactrouter.com",
    category: "tooling",
    why: "Roteamento client-side padrao do React. Code-splitting nativo com React.lazy + Suspense. Nested routes para layouts compartilhados (DocLayout wrapper).",
    highlights: [
      "Nested routes com Outlet para layouts",
      "Lazy loading nativo com Suspense",
      "URL params e search params tipados",
      "Navigate para redirects declarativos",
    ],
  },
  {
    name: "ESLint",
    version: "9",
    icon: Shield,
    color: "#4B32C3",
    url: "https://eslint.org",
    category: "tooling",
    why: "Linter que garante qualidade e consistencia do codigo. Com plugins React Hooks e React Refresh, detecta erros comuns de hooks e Fast Refresh. Flat config no ESLint 9.",
    highlights: [
      "Rules of Hooks enforcement",
      "React Refresh boundary validation",
      "Flat config (eslint.config.js) — sem cascata",
      "TypeScript-aware rules via typescript-eslint",
    ],
  },

  /* ── Dashboard ── */
  {
    name: "Apache ECharts",
    icon: LayoutDashboard,
    color: "#22C55E",
    url: "https://echarts.apache.org",
    category: "dashboard",
    why: "Motor de visualizacao que renderiza em Canvas ou SVG, configurado por um unico objeto option. Cobre muito mais tipos de grafico que o Recharts e aguenta grandes volumes de dados sem perder performance. Biblioteca oficial de graficos dos dashboards operacionais FIPS.",
    highlights: [
      "Configuracao declarativa por um unico objeto option",
      "Renderiza em Canvas ou SVG pelo motor ZRender",
      "Dezenas de tipos: linha, barra, heatmap, sankey, gauge, mapas",
      "Interacao nativa: zoom, tooltip e selecao por brush",
    ],
  },

  /* ── Backend ── */
  {
    name: "Node.js",
    icon: Terminal,
    color: "#339933",
    url: "https://nodejs.org",
    category: "backend",
    why: "Runtime JavaScript no servidor. Mesmo ecossistema e linguagem do frontend — compartilhamento de tipos, validacoes e logica. Event loop nao-bloqueante para I/O intensivo.",
    highlights: [
      "Mesmo ecossistema TypeScript front e back",
      "NPM com +2M pacotes disponiveis",
      "Event loop async para alta concorrencia",
      "Streams para processamento de dados em tempo real",
    ],
  },
  {
    name: "Supabase",
    icon: Database,
    color: "#3ECF8E",
    url: "https://supabase.com",
    category: "backend",
    why: "Plataforma open-source que combina PostgreSQL, autenticacao, storage e realtime em um unico servico. Substitui o Firebase com a vantagem de usar SQL real e ser self-hostable. Auth pronto, Row Level Security e API REST gerada automaticamente.",
    highlights: [
      "PostgreSQL completo com Row Level Security",
      "Auth integrado (email, OAuth, magic link)",
      "Realtime subscriptions via WebSocket",
      "Storage para arquivos com CDN integrado",
    ],
  },
  {
    name: "PostgreSQL",
    icon: Database,
    color: "#336791",
    url: "https://www.postgresql.org",
    category: "backend",
    why: "Banco relacional robusto, ACID compliant, com suporte a JSON, full-text search e extensoes. Ideal para dados estruturados do ERP (pedidos, estoque, producao) e rastreabilidade industrial. Roda como engine dentro do Supabase.",
    highlights: [
      "ACID compliant — integridade garantida",
      "JSONB para dados semi-estruturados",
      "Full-text search nativo",
      "Extensoes (PostGIS, pg_trgm, etc.)",
    ],
  },

  /* ── Infra ── */
  {
    name: "AWS",
    icon: Server,
    color: "#FF9900",
    url: "https://aws.amazon.com",
    category: "infra",
    why: "Infraestrutura cloud da Amazon. Hospeda todo o stack em instancias EC2 com IP fixo, escalabilidade sob demanda, rede global e servicos gerenciados. Confiabilidade enterprise com SLA de 99.99%.",
    highlights: [
      "EC2 com IP fixo (Elastic IP) para DNS",
      "Escalabilidade horizontal sob demanda",
      "Rede global com baixa latencia",
      "Backups automaticos e snapshots EBS",
    ],
  },
  {
    name: "Docker Swarm",
    icon: Cpu,
    color: "#2496ED",
    url: "https://docs.docker.com/engine/swarm",
    category: "infra",
    why: "Orquestracao de containers nativa do Docker. Mais simples que Kubernetes para o porte do projeto. Deploy com docker stack deploy, rolling updates e service discovery automatico.",
    highlights: [
      "Setup simples vs Kubernetes",
      "Rolling updates sem downtime",
      "Service discovery e load balancing nativos",
      "Secrets management integrado",
    ],
  },
  {
    name: "Traefik",
    icon: Cloud,
    color: "#24A1C1",
    url: "https://traefik.io",
    category: "infra",
    why: "Reverse proxy e load balancer automatico. Detecta servicos Docker automaticamente, gera certificados SSL via Let's Encrypt e roteia por dominio. Zero config manual por servico.",
    highlights: [
      "Auto-discovery de containers Docker",
      "SSL automatico via Let's Encrypt",
      "Roteamento por dominio (Host rules)",
      "Dashboard de monitoramento built-in",
    ],
  },
  {
    name: "Evolution API",
    icon: Flame,
    color: "#25D366",
    url: "https://doc.evolution-api.com",
    category: "infra",
    why: "API para integracao com WhatsApp. Roda como container Docker no Swarm. Usada para notificacoes operacionais, alertas de producao e comunicacao com motoristas/colaboradores.",
    highlights: [
      "WhatsApp Business API simplificada",
      "Webhooks para eventos em tempo real",
      "Multi-device e multi-session",
      "Deploy via Docker container no Swarm",
    ],
  },
];

const categoryMeta: Record<string, { label: string; desc: string; color: string; icon: typeof Sparkles }> = {
  core:      { label: "Core",          desc: "Fundacao do projeto — framework, linguagem e build.",       color: C.azulProfundo, icon: Cpu },
  ui:        { label: "UI & Styling",  desc: "Estilizacao, animacoes, icones e componentes primitivos.",  color: C.amareloOuro,  icon: Palette },
  tooling:   { label: "Tooling",       desc: "Roteamento, linting e ferramentas de desenvolvimento.",     color: C.verdeFloresta,icon: Package },
  dashboard: { label: "Dashboard",     desc: "Graficos e visualizacao de dados operacionais.",            color: "#22C55E",      icon: LayoutDashboard },
  backend:   { label: "Backend",       desc: "Servidor, banco de dados e logica de negocio.",             color: C.azulCeu,      icon: Terminal },
  infra:     { label: "Infraestrutura",desc: "Deploy, containers, proxy e comunicacao.",                  color: C.amareloEscuro,icon: Cloud },
};

const categoryOrder = ["core","ui","tooling","dashboard","backend","infra"] as const;

/* ═══════ PAGE ═══════ */
export default function StacksPage(){
  const [w,setW]=useState(typeof window!=="undefined"?window.innerWidth:1200);
  useEffect(()=>{const h=()=>setW(window.innerWidth);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h)},[]);
  const mob=w<640;
  const [expanded,setExpanded]=useState<string|null>(null);

  let sectionNum=0;

  return(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:Fn.body,color:C.cinzaEscuro}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Saira+Expanded:wght@300;400;500;600;700;800&family=Open+Sans:wght@300;400;600;700&family=Fira+Code:wght@400;500&display=swap');@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* ═══════ HEADER (padrao Governance — gradient + JunctionLines) ═══════ */}
      <header style={{background:`linear-gradient(135deg,${C.gradientFrom} 0%,${C.gradientTo} 100%)`,padding:mob?"32px 20px":"48px 40px 44px",position:"relative",overflow:"hidden"}}>
        <JunctionLines style={{position:"absolute",top:-10,right:-20,width:mob?250:400,height:250}}/>
        <div style={{position:"relative"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:6,background:`${C.branco}10`,border:`1px solid ${C.branco}18`,borderRadius:20,padding:"5px 14px",fontSize:11,fontWeight:600,letterSpacing:"1.5px",textTransform:"uppercase",color:C.amareloOuro,fontFamily:Fn.title,marginBottom:16}}>{Ic.grid(14,C.amareloOuro)} Design System FIPS</div>
          <h1 style={{fontSize:mob?30:44,fontWeight:700,color:C.branco,margin:"0 0 10px",fontFamily:Fn.title}}>Tech Stacks</h1>
          <p style={{fontSize:16,color:`${C.branco}B0`,lineHeight:1.6,maxWidth:700,margin:0,fontFamily:Fn.body}}>Todas as tecnologias do ecossistema FIPS — do Design System ao backend, passando pelo dashboard e infraestrutura. Por que cada uma foi <strong style={{color:C.amareloOuro}}>escolhida</strong> e o que a torna a melhor opção.</p>
        </div>
      </header>

      {/* ═══════ CONTENT ═══════ */}
      <div style={{padding:mob?"24px 16px 40px":"36px 40px 60px",maxWidth:1100,margin:"0 auto"}}>

        {/* Categorias detalhadas */}
        {categoryOrder.map(cat=>{
          const m=categoryMeta[cat];
          const items=stacks.filter(s=>s.category===cat);
          sectionNum++;
          return(
            <Section key={cat} n={String(sectionNum).padStart(2,"0")} title={m.label} desc={m.desc}>
              <div style={{display:"flex",flexDirection:"column",gap:16}}>
                {items.map(stack=>{
                  const isOpen=expanded===stack.name;
                  return(
                    <DSCard key={stack.name} mob={mob} s={{
                      borderLeft:`4px solid ${stack.color}`,
                      cursor:"pointer",
                      transition:"all .2s ease",
                      boxShadow:isOpen?`0 4px 20px ${alpha(stack.color,.12)}`:"0 1px 3px rgba(0,75,155,.04),0 4px 14px rgba(0,75,155,.03)",
                    }}>
                      <div
                        onClick={()=>setExpanded(isOpen?null:stack.name)}
                        style={{display:"flex",alignItems:"center",gap:14}}
                      >
                        <div style={{width:44,height:44,borderRadius:12,background:alpha(stack.color,.10),border:`1.5px solid ${alpha(stack.color,.22)}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                          <stack.icon size={20} color={stack.color}/>
                        </div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                            <h3 style={{fontSize:16,fontWeight:700,color:C.cinzaEscuro,margin:0,fontFamily:Fn.title}}>{stack.name}</h3>
                            {stack.version && <Badge variant="secondary" className="text-[10px] px-2 py-0">{`v${stack.version}`}</Badge>}
                          </div>
                          <p style={{fontSize:12,color:C.cinzaChumbo,margin:"4px 0 0",lineHeight:1.5,fontFamily:Fn.body,display:isOpen?"none":undefined,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{stack.why.slice(0,90)}...</p>
                        </div>
                        <div style={{fontSize:18,color:C.cinzaChumbo,transition:"transform .2s",transform:isOpen?"rotate(180deg)":"rotate(0)",flexShrink:0,userSelect:"none"}}>
                          &#9662;
                        </div>
                      </div>

                      {isOpen && (
                        <div style={{marginTop:18,paddingTop:18,borderTop:`1px solid ${C.cardBorder}`,animation:"fadeUp .25s ease"}}>
                          <h4 style={{fontSize:12,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",color:stack.color,fontFamily:Fn.title,marginBottom:10}}>Por que escolhemos</h4>
                          <p style={{fontSize:13,color:C.cinzaEscuro,lineHeight:1.7,fontFamily:Fn.body,margin:"0 0 18px"}}>{stack.why}</p>

                          <h4 style={{fontSize:12,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",color:stack.color,fontFamily:Fn.title,marginBottom:10}}>Destaques</h4>
                          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:10}}>
                            {stack.highlights.map((h,i)=>(
                              <div key={i} style={{display:"flex",alignItems:"flex-start",gap:8}}>
                                <div style={{width:6,height:6,borderRadius:"50%",background:stack.color,marginTop:6,flexShrink:0}}/>
                                <span style={{fontSize:13,color:C.cinzaChumbo,lineHeight:1.5,fontFamily:Fn.body}}>{h}</span>
                              </div>
                            ))}
                          </div>

                          {/* Link oficial */}
                          <div style={{marginTop:18,paddingTop:14,borderTop:`1px solid ${C.cardBorder}`}}>
                            <a
                              href={stack.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={e=>e.stopPropagation()}
                              style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:13,fontWeight:600,color:stack.color,fontFamily:Fn.title,textDecoration:"none",padding:"6px 14px",borderRadius:8,background:alpha(stack.color,.08),border:`1px solid ${alpha(stack.color,.18)}`,transition:"all .15s ease"}}
                              onMouseEnter={e=>{e.currentTarget.style.background=alpha(stack.color,.15);e.currentTarget.style.transform="translateY(-1px)"}}
                              onMouseLeave={e=>{e.currentTarget.style.background=alpha(stack.color,.08);e.currentTarget.style.transform="none"}}
                            >
                              <ExternalLink size={13}/>
                              Documentacao oficial
                            </a>
                          </div>
                        </div>
                      )}
                    </DSCard>
                  );
                })}
              </div>
            </Section>
          );
        })}

        {/* Arquitetura resumo */}
        <Section n={String(++sectionNum).padStart(2,"0")} title="Arquitetura geral" desc="Como as camadas se conectam no ecossistema FIPS.">
          <DSCard mob={mob}>
            <div style={{display:"flex",flexDirection:"column",gap:0}}>
              {[
                { layer:"Frontend", items:"React 19 + TypeScript + Tailwind 4 + Vite 8", color:C.azulProfundo, icon: Gauge },
                { layer:"Design System", items:"DS FIPS (este projeto) — tokens, componentes, padroes", color:C.amareloOuro, icon: Palette },
                { layer:"Dashboard", items:"Apache ECharts + Framer Motion + padroes de data viz", color:"#22C55E", icon: LayoutDashboard },
                { layer:"Backend", items:"Node.js + Supabase + PostgreSQL + APIs REST", color:C.azulCeu, icon: Terminal },
                { layer:"Infra", items:"AWS + Docker Swarm + Traefik + Evolution API", color:C.amareloEscuro, icon: Cloud },
              ].map((l,i,arr)=>(
                <div key={i}>
                  <div style={{display:"flex",alignItems:"center",gap:14,padding:"14px 0"}}>
                    <div style={{width:40,height:40,borderRadius:10,background:alpha(l.color,.10),border:`1.5px solid ${alpha(l.color,.20)}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <l.icon size={18} color={l.color}/>
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:14,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>{l.layer}</div>
                      <div style={{fontSize:12,color:C.cinzaChumbo,fontFamily:Fn.body,marginTop:2}}>{l.items}</div>
                    </div>
                  </div>
                  {i<arr.length-1 && (
                    <div style={{display:"flex",justifyContent:"center",padding:"2px 0"}}>
                      <div style={{width:2,height:18,background:`linear-gradient(to bottom,${l.color},${arr[i+1].color})`,borderRadius:1}}/>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </DSCard>
        </Section>

        {/* Footer */}
        <div style={{textAlign:"center",padding:"20px 0 0",borderTop:`1px solid ${C.cardBorder}`,marginTop:20}}>
          <span style={{fontSize:12,color:C.cinzaChumbo,letterSpacing:"0.5px",fontFamily:Fn.title,fontWeight:400}}>DS-FIPS v0.4.2 · Ferrovia Interna do Porto de Santos · Excelencia sobre trilhos · {new Date().getFullYear()}</span>
        </div>

      </div>
    </div>
  );
}
