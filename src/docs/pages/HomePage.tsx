import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import { PageHero } from "../../composites/PageHero";
import {
  Sparkles, Palette, Component, LayoutDashboard, ShieldCheck, BookOpen,
  ArrowRight, Users, FileInput, Cog,
  BarChart3,
} from "lucide-react";

/* ═══════ TOKENS (mesmo padrão das doc pages) ═══════ */
const C={azulProfundo:"var(--color-gov-azul-profundo)",azulEscuro:"var(--color-gov-azul-escuro)",azulClaro:"var(--color-gov-azul-claro)",cinzaChumbo:"var(--color-fg-muted)",cinzaEscuro:"var(--color-fg)",cinzaClaro:"#C0CCD2",azulCeu:"#93BDE4",azulCeuClaro:"#D3E3F4",amareloOuro:"#FDC24E",amareloEscuro:"#F6921E",verdeFloresta:"#00C64C",verdeEscuro:"var(--color-gov-verde-escuro)",danger:"#DC3545",neutro:"var(--color-surface-soft)",branco:"#FFFFFF",bg:"var(--color-surface-muted)",cardBg:"var(--color-surface)",cardBorder:"var(--color-border)",textMuted:"var(--color-fg-muted)"};
const Fn={title:"'Saira Expanded',sans-serif",body:"'Open Sans',sans-serif",mono:"'Fira Code',monospace"};
const alpha=(c:string,a:number)=>`color-mix(in srgb, ${c} ${Math.round(a*100)}%, transparent)`;

/* ═══════ Shared components (padrão DS doc pages) ═══════ */
function Section({n,title,desc,children}:{n:string,title:string,desc:string,children:React.ReactNode}){return(<section style={{marginBottom:48}}><div style={{fontSize:10,fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",color:C.azulClaro,fontFamily:Fn.title,marginBottom:6}}>{n}</div><h2 style={{fontSize:22,fontWeight:700,color:C.cinzaEscuro,margin:"0 0 4px",fontFamily:Fn.title,letterSpacing:".5px"}}>{title}</h2><p style={{fontSize:14,color:C.cinzaChumbo,margin:"0 0 22px",lineHeight:1.55,fontFamily:Fn.body}}>{desc}</p>{children}</section>)}
function DSCard({children,s,mob:m}:{children:React.ReactNode,s?:React.CSSProperties,mob?:boolean}){return(<div style={{background:C.cardBg,borderRadius:"12px 12px 12px 24px",border:`1px solid ${C.cardBorder}`,padding:m?16:28,boxShadow:"0 1px 3px rgba(0,75,155,.04),0 4px 14px rgba(0,75,155,.03)",...s}}>{children}</div>)}

/* ═══════ Data ═══════ */
const quickLinks = [
  { label: "Visão geral", desc: "Tokens, princípios e catálogo completo", to: "/docs", icon: Sparkles, color: C.azulProfundo },
  { label: "Fundamentos", desc: "Cores, tipografia, espaçamento, raios e sombras", to: "/docs/foundations/colors", icon: Palette, color: C.amareloOuro },
  { label: "Componentes", desc: "14+ componentes React prontos para uso", to: "/docs/components/button", icon: Component, color: C.verdeFloresta },
  { label: "Padrões de tela", desc: "Login, Dashboard, Data Listing, Form e mais", to: "/docs/patterns/application-shell", icon: LayoutDashboard, color: C.azulCeu },
  { label: "Governança", desc: "Regras de uso, versionamento e contribuição", to: "/docs/governance", icon: ShieldCheck, color: C.amareloEscuro },
  { label: "Histórico de versões", desc: "Notas de cada release e mudanças recentes", to: "/docs/changelog", icon: BookOpen, color: C.cinzaClaro },
];

const rules = [
  "Todo produto digital FIPS deve usar exclusivamente componentes e tokens deste Design System.",
  "Override visual direto (CSS inline ou classes avulsas) é proibido — use variantes e props.",
  "Novos componentes ou variantes passam por revisão antes de publicação.",
  "A paleta de cores segue o Brandbook FIPS; alterações requerem aprovação institucional.",
  "Acessibilidade WCAG AA é obrigatória — nenhum componente é publicado sem conformidade.",
];

/* ═══════ PAGE ═══════ */
export default function HomePage(){
  const [w,setW]=useState(typeof window!=="undefined"?window.innerWidth:1200);
  useEffect(()=>{const h=()=>setW(window.innerWidth);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h)},[]);
  const mob=w<640;
  const navigate=useNavigate();
  const [hovIdx,setHovIdx]=useState(-1);

  return(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:Fn.body,color:C.cinzaEscuro}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Saira+Expanded:wght@300;400;500;600;700;800&family=Open+Sans:wght@300;400;600;700&family=Fira+Code:wght@400;500&display=swap');@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}@keyframes pulse{0%,100%{opacity:.6}50%{opacity:1}}`}</style>

      {/* ═══════ HERO (composite PageHero — padrão FIPS, espelha Suprimentos) ═══════ */}
      <PageHero>
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-4 py-12 text-center sm:px-6 sm:py-16">
          <Badge className="mb-5 rounded-full border-0 bg-[rgba(246,146,30,0.95)] text-white shadow-[0_12px_28px_rgba(246,146,30,0.28)]">
            Design System FIPS
          </Badge>
          <h1 style={{fontSize:mob?32:48,fontWeight:700,color:C.branco,margin:0,fontFamily:Fn.title,lineHeight:1.1,letterSpacing:"-0.03em"}}>Design System<br/><span style={{color:C.amareloOuro}}>FIPS</span></h1>
          <p style={{fontSize:mob?14:16,color:"rgba(255,255,255,0.78)",lineHeight:1.65,margin:0,fontFamily:Fn.body,maxWidth:750}}>
            Biblioteca oficial de componentes, tokens e padrões da Ferrovia Interna do Porto de Santos.
            Tudo para construir interfaces consistentes, acessíveis e com identidade ferroviária.
          </p>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center"}}>
            <Badge variant="success" dot>v0.4.2</Badge>
            <Badge variant="secondary">React 19 + Tailwind 4</Badge>
            <Badge variant="secondary">14+ componentes</Badge>
            <Badge variant="info">Dark mode</Badge>
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:10,justifyContent:"center"}}>
            <Button variant="ouro" size="sm" onClick={()=>navigate("/docs")}>Explorar componentes <ArrowRight size={14}/></Button>
            <Button variant="inverseOutline" size="sm" onClick={()=>navigate("/docs/governance")}>Governança</Button>
          </div>
        </div>
      </PageHero>

      {/* ═══════ CONTENT ═══════ */}
      <div style={{padding:mob?"24px 16px 40px":"40px 40px 60px",maxWidth:1100,margin:"0 auto"}}>

        {/* 01 — Objetivo */}
        <Section n="01" title="Objetivo" desc="Qual é o propósito deste Design System.">
          <DSCard mob={mob}>
            <p style={{fontSize:14,lineHeight:1.75,color:C.cinzaEscuro,fontFamily:Fn.body,margin:0}}>
              O <strong>Design System FIPS</strong> é a fonte única de verdade para o design e desenvolvimento dos produtos digitais da Ferrovia Interna do Porto de Santos.
              Ele garante que toda interface — de dashboards operacionais a formulários de campo — siga os mesmos padrões visuais, de acessibilidade e de interação, acelerando entregas e reduzindo retrabalho.
            </p>
          </DSCard>
        </Section>

        {/* 02 — Como funciona */}
        <Section n="02" title="Como funciona" desc="Fluxo de uso do Design System no dia a dia.">
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr 1fr",gap:16}}>
            {[
              {step:"1",title:"Consultar",desc:"Navegue pela documentação para encontrar o componente, token ou padrão adequado.",color:C.azulProfundo},
              {step:"2",title:"Importar",desc:"Importe o componente do pacote ds-fips. Tokens e variantes já estão embutidos.",color:C.amareloOuro},
              {step:"3",title:"Compor",desc:"Monte sua tela combinando componentes e seguindo os padrões de layout documentados.",color:C.verdeFloresta},
            ].map((s,i)=>(
              <DSCard key={i} mob={mob} s={{textAlign:"center",padding:mob?16:24}}>
                <div style={{width:40,height:40,borderRadius:"50%",background:alpha(s.color,.12),border:`1.5px solid ${alpha(s.color,.25)}`,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,color:s.color,fontFamily:Fn.title,marginBottom:12}}>{s.step}</div>
                <h3 style={{fontSize:16,fontWeight:700,color:C.cinzaEscuro,margin:"0 0 6px",fontFamily:Fn.title}}>{s.title}</h3>
                <p style={{fontSize:13,color:C.cinzaChumbo,margin:0,lineHeight:1.55,fontFamily:Fn.body}}>{s.desc}</p>
              </DSCard>
            ))}
          </div>
        </Section>

        {/* 03 — Responsável */}
        <Section n="03" title="Responsável" desc="Quem mantém e governa o Design System.">
          <DSCard mob={mob}>
            <div style={{display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
              <div style={{width:48,height:48,borderRadius:"50%",background:`linear-gradient(135deg,${C.azulProfundo},${C.azulEscuro})`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <Users size={22} color={C.branco}/>
              </div>
              <div>
                <div style={{fontSize:15,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>Time de Design & Engenharia FIPS</div>
                <div style={{fontSize:13,color:C.cinzaChumbo,fontFamily:Fn.body,marginTop:2}}>Governado pelas regras de contribuição descritas na seção de <span style={{color:C.azulProfundo,fontWeight:600,cursor:"pointer"}} onClick={()=>navigate("/docs/governance")}>Governança</span>.</div>
              </div>
            </div>
          </DSCard>
        </Section>

        {/* 04 — Entradas */}
        <Section n="04" title="Entradas" desc="O que o usuário/desenvolvedor precisa informar ou fornecer.">
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:16}}>
            {[
              {title:"Requisitos da tela",desc:"Tipo de padrão (dashboard, form, listing) e componentes necessários.",icon:FileInput,color:C.azulProfundo},
              {title:"Dados do domínio",desc:"Estrutura dos dados a serem exibidos, editados ou filtrados.",icon:BarChart3,color:C.amareloOuro},
              {title:"Contexto de uso",desc:"Desktop, mobile ou ambos — responsividade e breakpoints aplicáveis.",icon:Component,color:C.verdeFloresta},
              {title:"Regras de negócio",desc:"Validações, permissões e fluxos condicionais da aplicação.",icon:ShieldCheck,color:C.amareloEscuro},
            ].map((e,i)=>(
              <DSCard key={i} mob={mob} s={{padding:mob?16:20}}>
                <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
                  <div style={{width:32,height:32,borderRadius:10,background:alpha(e.color,.10),border:`1px solid ${alpha(e.color,.20)}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}>
                    <e.icon size={16} color={e.color}/>
                  </div>
                  <div>
                    <h4 style={{fontSize:14,fontWeight:700,color:C.cinzaEscuro,margin:"0 0 4px",fontFamily:Fn.title}}>{e.title}</h4>
                    <p style={{fontSize:13,color:C.cinzaChumbo,margin:0,lineHeight:1.5,fontFamily:Fn.body}}>{e.desc}</p>
                  </div>
                </div>
              </DSCard>
            ))}
          </div>
        </Section>

        {/* 05 — Processamento */}
        <Section n="05" title="Processamento" desc="O que o Design System faz por você.">
          <DSCard mob={mob}>
            <div style={{display:"flex",flexDirection:"column",gap:20}}>
              {[
                {label:"Resolve tokens",desc:"Cores, tipografia, espaçamento e sombras do tema ativo (light ou dark).",pct:100,color:C.azulProfundo},
                {label:"Garante acessibilidade",desc:"Contrastes WCAG AA, tamanhos mínimos de toque, labels e foco.",pct:100,color:C.verdeFloresta},
                {label:"Compõe layouts",desc:"Padrões pré-definidos (shell, dashboard, listing, form) sem CSS manual.",pct:85,color:C.amareloOuro},
                {label:"Responsividade",desc:"Breakpoints desktop (≥900px), tablet e mobile (<640px) automáticos.",pct:90,color:C.azulCeu},
              ].map((p,i)=>(
                <div key={i}>
                  <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",marginBottom:6}}>
                    <span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>{p.label}</span>
                    <span style={{fontSize:11,fontWeight:600,color:C.cinzaChumbo,fontFamily:Fn.mono}}>{p.pct}%</span>
                  </div>
                  <Progress value={p.pct}/>
                  <p style={{fontSize:12,color:C.cinzaChumbo,margin:"4px 0 0",lineHeight:1.5,fontFamily:Fn.body}}>{p.desc}</p>
                </div>
              ))}
            </div>
          </DSCard>
        </Section>

        {/* 06 — Saídas */}
        <Section n="06" title="Saídas" desc="O que você obtém ao usar o Design System.">
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr 1fr",gap:16}}>
            {[
              {title:"Interfaces consistentes",desc:"Todas as telas seguem o mesmo padrão visual e de interação.",color:C.azulProfundo,icon:Sparkles},
              {title:"Código reutilizável",desc:"Componentes importáveis, sem duplicação de CSS ou lógica de UI.",color:C.verdeFloresta,icon:Component},
              {title:"Entregas rápidas",desc:"Menos tempo criando do zero, mais tempo no que importa ao negócio.",color:C.amareloOuro,icon:Cog},
            ].map((s,i)=>(
              <DSCard key={i} mob={mob} s={{borderTop:`3px solid ${s.color}`,padding:mob?16:20}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                  <s.icon size={16} color={s.color}/>
                  <h4 style={{fontSize:14,fontWeight:700,color:C.cinzaEscuro,margin:0,fontFamily:Fn.title}}>{s.title}</h4>
                </div>
                <p style={{fontSize:13,color:C.cinzaChumbo,margin:0,lineHeight:1.5,fontFamily:Fn.body}}>{s.desc}</p>
              </DSCard>
            ))}
          </div>
        </Section>

        {/* 07 — Regras de negócio */}
        <Section n="07" title="Regras de negócio" desc="Regras que governam o uso correto do Design System.">
          <DSCard mob={mob}>
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              {rules.map((r,i)=>(
                <div key={i} style={{display:"flex",alignItems:"flex-start",gap:12}}>
                  <div style={{width:24,height:24,borderRadius:8,background:alpha(C.danger,.10),border:`1px solid ${alpha(C.danger,.18)}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
                    <span style={{fontSize:11,fontWeight:700,color:C.danger,fontFamily:Fn.mono}}>{i+1}</span>
                  </div>
                  <p style={{fontSize:13,color:C.cinzaEscuro,margin:0,lineHeight:1.55,fontFamily:Fn.body}}>{r}</p>
                </div>
              ))}
            </div>
          </DSCard>
        </Section>

        {/* 08 — Procedimentos operacionais */}
        <Section n="08" title="Procedimentos operacionais" desc="Passo a passo para contribuir ou consumir o Design System.">
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:16}}>
            {[
              {title:"Para consumir",steps:["Clone o repositório ou importe o pacote","Importe componentes de src/components/ui/","Use tokens via variáveis CSS (--color-*, --font-*)","Siga os padrões de tela documentados em Padrões"]},
              {title:"Para contribuir",steps:["Crie uma branch a partir de main","Desenvolva seguindo as regras de Governança","Documente o componente com exemplo interativo","Abra PR para revisão do time de design"]},
            ].map((p,i)=>(
              <DSCard key={i} mob={mob} s={{padding:mob?16:24}}>
                <h4 style={{fontSize:15,fontWeight:700,color:C.cinzaEscuro,margin:"0 0 14px",fontFamily:Fn.title}}>{p.title}</h4>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {p.steps.map((s,j)=>(
                    <div key={j} style={{display:"flex",alignItems:"flex-start",gap:10}}>
                      <div style={{width:22,height:22,borderRadius:"50%",background:alpha(C.azulProfundo,.10),border:`1px solid ${alpha(C.azulProfundo,.18)}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                        <span style={{fontSize:10,fontWeight:700,color:C.azulProfundo,fontFamily:Fn.mono}}>{j+1}</span>
                      </div>
                      <p style={{fontSize:13,color:C.cinzaChumbo,margin:0,lineHeight:1.5,fontFamily:Fn.body}}>{s}</p>
                    </div>
                  ))}
                </div>
              </DSCard>
            ))}
          </div>
        </Section>

        {/* 09 — Indicadores */}
        <Section n="09" title="Indicadores relacionados" desc="Métricas de adoção e saúde do Design System.">
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr 1fr":"1fr 1fr 1fr 1fr",gap:16}}>
            {[
              {label:"Componentes",value:"14+",color:C.azulProfundo},
              {label:"Padrões",value:"7",color:C.amareloOuro},
              {label:"Tokens",value:"50+",color:C.verdeFloresta},
              {label:"Fundamentos",value:"6",color:C.azulCeu},
            ].map((k,i)=>(
              <DSCard key={i} mob={mob} s={{textAlign:"center",padding:mob?16:20}}>
                <div style={{fontSize:28,fontWeight:800,color:k.color,fontFamily:Fn.title,lineHeight:1}}>{k.value}</div>
                <div style={{fontSize:12,color:C.cinzaChumbo,fontFamily:Fn.body,marginTop:8}}>{k.label}</div>
              </DSCard>
            ))}
          </div>
        </Section>

        {/* 10 — Navegação rápida */}
        <Section n="10" title="Navegação rápida" desc="Acesse as principais seções da documentação.">
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr 1fr",gap:16}}>
            {quickLinks.map((l,i)=>(
              <div
                key={i}
                onClick={()=>navigate(l.to)}
                onMouseEnter={()=>setHovIdx(i)}
                onMouseLeave={()=>setHovIdx(-1)}
                style={{
                  background:C.cardBg,
                  borderRadius:"12px 12px 12px 24px",
                  border:`1px solid ${hovIdx===i?l.color:C.cardBorder}`,
                  padding:mob?16:20,
                  cursor:"pointer",
                  transition:"all .2s ease",
                  transform:hovIdx===i?"translateY(-2px)":"none",
                  boxShadow:hovIdx===i?`0 4px 16px ${alpha(l.color,.15)}`:"0 1px 3px rgba(0,75,155,.04),0 4px 14px rgba(0,75,155,.03)",
                }}
              >
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:28,height:28,borderRadius:8,background:alpha(l.color,.10),display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <l.icon size={14} color={l.color}/>
                    </div>
                    <h4 style={{fontSize:14,fontWeight:700,color:C.cinzaEscuro,margin:0,fontFamily:Fn.title}}>{l.label}</h4>
                  </div>
                  <ArrowRight size={14} color={hovIdx===i?l.color:C.cinzaChumbo} style={{transition:"transform .2s",transform:hovIdx===i?"translateX(2px)":"none"}}/>
                </div>
                <p style={{fontSize:12,color:C.cinzaChumbo,margin:0,lineHeight:1.5,fontFamily:Fn.body}}>{l.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Footer */}
        <div style={{textAlign:"center",padding:"20px 0 0",borderTop:`1px solid ${C.cardBorder}`,marginTop:20}}>
          <span style={{fontSize:12,color:C.cinzaChumbo,letterSpacing:"0.5px",fontFamily:Fn.title,fontWeight:400}}>DS-FIPS v0.4.2 · Ferrovia Interna do Porto de Santos · Excelência sobre trilhos · {new Date().getFullYear()}</span>
        </div>

      </div>
    </div>
  );
}
