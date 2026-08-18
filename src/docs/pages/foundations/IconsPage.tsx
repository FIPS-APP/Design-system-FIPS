import { useState, useEffect, type ReactNode } from "react";
import type { IconType } from "react-icons";
import { PlaygroundProvider, Copyable, CodePlayground } from '../../components/CodePlayground'
import {
  LuHouse, LuLayoutGrid, LuList, LuChartColumnIncreasing, LuFilter, LuSettings, LuSearch,
  LuX, LuCheck, LuPencil, LuTrash2, LuEye, LuPaperclip,
  LuTriangleAlert, LuShield, LuLock, LuCircleCheck, LuInfo,
  LuFileText, LuFolder, LuBell, LuTag, LuClock, LuCalendar,
  LuUser, LuBuilding2, LuMail,
  LuMapPin, LuTruck, LuPackage, LuWrench,
} from "react-icons/lu";

const C={azulProfundo:"var(--color-gov-azul-profundo)",azulEscuro:"var(--color-gov-azul-escuro)",azulClaro:"var(--color-gov-azul-claro)",cinzaChumbo:"var(--color-fg-muted)",cinzaEscuro:"var(--color-fg)",cinzaClaro:"#C0CCD2",azulCeu:"#93BDE4",azulCeuClaro:"#D3E3F4",amareloOuro:"#FDC24E",amareloEscuro:"#F6921E",verdeFloresta:"#00C64C",verdeEscuro:"var(--color-gov-verde-escuro)",danger:"#DC3545",neutro:"var(--color-surface-soft)",branco:"#FFFFFF",bg:"var(--color-surface-muted)",cardBg:"var(--color-surface)",cardBorder:"var(--color-border)",textMuted:"var(--color-fg-muted)",textLight:"var(--color-fg-muted)"};
const Fn={title:"'Saira Expanded',sans-serif",body:"'Open Sans',sans-serif",mono:"'Fira Code',monospace"};
const alpha=(c:string,a:number)=>`color-mix(in srgb, ${c} ${Math.round(a*100)}%, transparent)`;

const iconMap: Record<string, IconType> = {
  home: LuHouse, grid: LuLayoutGrid, list: LuList, chart: LuChartColumnIncreasing,
  filter: LuFilter, settings: LuSettings, busca: LuSearch,
  dashboard: LuLayoutGrid, menu: LuList, modulo: LuSettings,
  x: LuX, check: LuCheck, edit: LuPencil, trash: LuTrash2,
  eye: LuEye, clip: LuPaperclip,
  approve: LuCheck, reject: LuX, remove: LuTrash2, attach: LuPaperclip,
  alert: LuTriangleAlert, shield: LuShield, lock: LuLock,
  status: LuCircleCheck, info: LuInfo,
  warning: LuTriangleAlert, secure: LuShield, done: LuCircleCheck, blocked: LuLock, details: LuInfo,
  doc: LuFileText, folder: LuFolder, bell: LuBell, tag: LuTag,
  clock: LuClock, calendar: LuCalendar,
  report: LuFileText, notify: LuBell, schedule: LuCalendar, labels: LuTag,
  pessoa: LuUser, building: LuBuilding2, email: LuMail,
  team: LuUser, manager: LuUser, company: LuBuilding2, contact: LuMail,
  profile: LuUser, org: LuBuilding2, support: LuMail,
  map: LuMapPin, truck: LuTruck, package: LuPackage, wrench: LuWrench,
  route: LuMapPin, delivery: LuTruck, cargo: LuPackage, maintenance: LuWrench, yard: LuBuilding2, inspection: LuEye,
};

const iconImportName: Record<string, string> = {
  home: "LuHouse", grid: "LuLayoutGrid", list: "LuList", chart: "LuChartColumnIncreasing",
  filter: "LuFilter", settings: "LuSettings", busca: "LuSearch",
  dashboard: "LuLayoutGrid", menu: "LuList", modulo: "LuSettings",
  x: "LuX", check: "LuCheck", edit: "LuPencil", trash: "LuTrash2",
  eye: "LuEye", clip: "LuPaperclip",
  approve: "LuCheck", reject: "LuX", remove: "LuTrash2", attach: "LuPaperclip",
  alert: "LuTriangleAlert", shield: "LuShield", lock: "LuLock",
  status: "LuCircleCheck", info: "LuInfo",
  warning: "LuTriangleAlert", secure: "LuShield", done: "LuCircleCheck", blocked: "LuLock", details: "LuInfo",
  doc: "LuFileText", folder: "LuFolder", bell: "LuBell", tag: "LuTag",
  clock: "LuClock", calendar: "LuCalendar",
  report: "LuFileText", notify: "LuBell", schedule: "LuCalendar", labels: "LuTag",
  pessoa: "LuUser", building: "LuBuilding2", email: "LuMail",
  team: "LuUser", manager: "LuUser", company: "LuBuilding2", contact: "LuMail",
  profile: "LuUser", org: "LuBuilding2", support: "LuMail",
  map: "LuMapPin", truck: "LuTruck", package: "LuPackage", wrench: "LuWrench",
  route: "LuMapPin", delivery: "LuTruck", cargo: "LuPackage", maintenance: "LuWrench", yard: "LuBuilding2", inspection: "LuEye",
};
const iconImportSource: Record<string, string> = {
  home: "react-icons/lu", grid: "react-icons/lu", list: "react-icons/lu", chart: "react-icons/lu",
  filter: "react-icons/lu", settings: "react-icons/lu", busca: "react-icons/lu", x: "react-icons/lu",
  check: "react-icons/lu", edit: "react-icons/lu", trash: "react-icons/lu", eye: "react-icons/lu",
  clip: "react-icons/lu", alert: "react-icons/lu", shield: "react-icons/lu", lock: "react-icons/lu",
  status: "react-icons/lu", info: "react-icons/lu", doc: "react-icons/lu", folder: "react-icons/lu",
  bell: "react-icons/lu", tag: "react-icons/lu", clock: "react-icons/lu", calendar: "react-icons/lu",
  pessoa: "react-icons/lu", building: "react-icons/lu", email: "react-icons/lu", map: "react-icons/lu",
  profile: "react-icons/lu", org: "react-icons/lu", support: "react-icons/lu",
  truck: "react-icons/lu", package: "react-icons/lu", wrench: "react-icons/lu",
  dashboard: "react-icons/lu", menu: "react-icons/lu", modulo: "react-icons/lu",
  approve: "react-icons/lu", reject: "react-icons/lu", remove: "react-icons/lu", attach: "react-icons/lu",
  warning: "react-icons/lu", secure: "react-icons/lu", done: "react-icons/lu", blocked: "react-icons/lu", details: "react-icons/lu",
  report: "react-icons/lu", notify: "react-icons/lu", schedule: "react-icons/lu", labels: "react-icons/lu",
  team: "react-icons/lu", manager: "react-icons/lu", company: "react-icons/lu", contact: "react-icons/lu",
  route: "react-icons/lu", delivery: "react-icons/lu", cargo: "react-icons/lu", maintenance: "react-icons/lu", yard: "react-icons/lu", inspection: "react-icons/lu",
}

function Ic({ id, size, color }: { id: string; size: number; color: string }) {
  const Icon = iconMap[id];
  if (!Icon) return null;
  return <Icon size={size} color={color} />;
}

function JunctionLines({style}:{style?:React.CSSProperties}){return <svg viewBox="0 0 320 200" fill="none" style={{opacity:.12,...style}}><path d="M0 60H100C120 60 120 60 140 40L200 40H320" stroke="var(--color-junction-stroke)" strokeWidth="6" strokeLinecap="round"/><path d="M0 60H100C120 60 120 60 140 80L200 80H320" stroke="var(--color-junction-stroke)" strokeWidth="6" strokeLinecap="round"/><path d="M0 120H60C80 120 80 120 100 100L160 100H320" stroke="var(--color-junction-stroke)" strokeWidth="6" strokeLinecap="round"/><path d="M0 120H60C80 120 80 120 100 140L160 140H320" stroke="var(--color-junction-stroke)" strokeWidth="6" strokeLinecap="round"/></svg>}
function Section({n,title,desc,children}:{n:string,title:string,desc:string,children:ReactNode}){return(<section style={{marginBottom:48}}><div style={{fontSize:10,fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",color:C.azulClaro,fontFamily:Fn.title,marginBottom:6}}>{n}</div><h2 style={{fontSize:22,fontWeight:700,color:C.cinzaEscuro,margin:"0 0 4px",fontFamily:Fn.title,letterSpacing:".5px"}}>{title}</h2><p style={{fontSize:14,color:C.cinzaChumbo,margin:"0 0 22px",lineHeight:1.55,fontFamily:Fn.body}}>{desc}</p>{children}</section>)}
function DSCard({children,s,mob:m}:{children:ReactNode,s?:React.CSSProperties,mob?:boolean}){return(<div style={{background:C.cardBg,borderRadius:"12px 12px 12px 24px",border:`1px solid ${C.cardBorder}`,padding:m?16:28,boxShadow:"0 1px 3px rgba(0,75,155,.04),0 4px 14px rgba(0,75,155,.03)",...s}}>{children}</div>)}
function TokenRow({label,value}:{label:string,value:string}){return(<div style={{display:"flex",alignItems:"center",gap:10,fontSize:12,fontFamily:Fn.body}}><span style={{color:C.cinzaChumbo,minWidth:140}}>{label}</span><code style={{background:C.neutro,padding:"2px 8px",borderRadius:4,fontSize:11,fontFamily:Fn.mono,color:C.cinzaEscuro}}>{value}</code></div>)}

const categories=[
  {name:"Navegação",icons:[{id:"home",label:"Home"},{id:"grid",label:"Grid"},{id:"list",label:"Lista"},{id:"chart",label:"Gráfico"},{id:"filter",label:"Filtro"},{id:"settings",label:"Configuração"},{id:"busca",label:"Busca"},{id:"dashboard",label:"Dashboard"},{id:"menu",label:"Menu"},{id:"modulo",label:"Módulo"}]},
  {name:"Ações",icons:[{id:"x",label:"Fechar"},{id:"check",label:"Confirmar"},{id:"edit",label:"Editar"},{id:"trash",label:"Excluir"},{id:"eye",label:"Visualizar"},{id:"clip",label:"Anexar"},{id:"approve",label:"Aprovar"},{id:"reject",label:"Rejeitar"},{id:"remove",label:"Remover"},{id:"attach",label:"Anexo"}]},
  {name:"Status",icons:[{id:"alert",label:"Alerta"},{id:"shield",label:"Segurança"},{id:"lock",label:"Bloqueado"},{id:"status",label:"Concluído"},{id:"info",label:"Informação"},{id:"warning",label:"Atenção"},{id:"secure",label:"Protegido"},{id:"done",label:"Finalizado"},{id:"blocked",label:"Restrito"},{id:"details",label:"Detalhes"}]},
  {name:"Objetos",icons:[{id:"doc",label:"Documento"},{id:"folder",label:"Pasta"},{id:"bell",label:"Notificação"},{id:"tag",label:"Tag"},{id:"clock",label:"Relógio"},{id:"calendar",label:"Calendário"},{id:"report",label:"Relatório"},{id:"notify",label:"Alarme"},{id:"schedule",label:"Agenda"},{id:"labels",label:"Rótulos"}]},
  {name:"Entidades",icons:[{id:"pessoa",label:"Pessoa"},{id:"building",label:"Empresa"},{id:"email",label:"E-mail"},{id:"team",label:"Equipe"},{id:"manager",label:"Gestor"},{id:"company",label:"Corporação"},{id:"contact",label:"Contato"},{id:"profile",label:"Perfil"},{id:"org",label:"Organização"},{id:"support",label:"Suporte"}]},
  {name:"Operação",icons:[{id:"map",label:"Mapa"},{id:"truck",label:"Transporte"},{id:"package",label:"Pacote"},{id:"wrench",label:"Manutenção"},{id:"route",label:"Rota"},{id:"delivery",label:"Entrega"},{id:"cargo",label:"Carga"},{id:"maintenance",label:"Manutenção 2"},{id:"yard",label:"Pátio"},{id:"inspection",label:"Verificação"}]},
];
const sizes=[
  {px:12,use:"Dentro de tabs sm, badges, elementos compactos"},
  {px:14,use:"Inputs, selects, labels, tabs padrão"},
  {px:16,use:"Botões, drawers, formulários, ações de tabela"},
  {px:20,use:"Headers de seção, destaque visual, modal icons"},
  {px:24,use:"Hero, empty states, ícones isolados grandes"},
];
const colorRules=[
  {color:C.azulProfundo,name:"Azul Profundo",use:"Ações primárias, links, sort ativo"},
  {color:C.azulEscuro,name:"Azul Escuro",use:"Headers, títulos com ícone"},
  {color:C.cinzaChumbo,name:"Cinza Chumbo",use:"Ícones neutros, inputs, labels"},
  {color:C.amareloEscuro,name:"Amarelo Escuro",use:"Tab ativa, atenção, destaque"},
  {color:C.verdeFloresta,name:"Verde Floresta",use:"Sucesso, confirmação, ativo"},
  {color:C.danger,name:"Vermelho",use:"Erro, exclusão, destrutivo"},
  {color:C.azulCeu,name:"Azul Céu",use:"Info, backgrounds, seleção sutil"},
  {color:C.textMuted,name:"Cinza Muted",use:"Disabled, placeholder, dica"},
];

export default function DSFIPSIconography(){
  const [w,setW]=useState(typeof window!=="undefined"?window.innerWidth:1200);
  useEffect(()=>{const h=()=>setW(window.innerWidth);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h)},[]);
  const mob=w<640;
  const [hovIcon,setHovIcon]=useState<string|null>(null);
  const [selSize,setSelSize]=useState(20);

  return(
    <PlaygroundProvider>
    <div style={{minHeight:"100vh",background:"var(--color-surface-muted)",fontFamily:Fn.body,color:C.cinzaEscuro}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Saira+Expanded:wght@300;400;500;600;700;800&family=Open+Sans:wght@300;400;600;700&family=Fira+Code:wght@400;500&display=swap');@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <header style={{background:`linear-gradient(135deg,var(--color-gov-gradient-from) 0%,var(--color-gov-gradient-to) 100%)`,padding:mob?"32px 20px":"48px 40px 44px",position:"relative",overflow:"hidden"}}>
        <JunctionLines style={{position:"absolute",top:-10,right:-20,width:mob?250:400,height:250}}/>
        <div style={{position:"relative"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:6,background:`${C.branco}10`,border:`1px solid ${C.branco}18`,borderRadius:20,padding:"5px 14px",fontSize:11,fontWeight:600,letterSpacing:"1.5px",textTransform:"uppercase",color:C.amareloOuro,fontFamily:Fn.title,marginBottom:16}}><Ic id="grid" size={14} color={C.amareloOuro} /> Design System FIPS</div>
          <h1 style={{fontSize:mob?30:44,fontWeight:700,color:C.branco,margin:"0 0 10px",fontFamily:Fn.title}}>Iconografia</h1>
          <p style={{fontSize:16,color:`${C.branco}B0`,lineHeight:1.6,maxWidth:700,margin:0,fontFamily:Fn.body}}>Biblioteca baseada em <strong style={{color:C.amareloOuro}}>React Icons</strong> — usando <strong style={{color:`${C.branco}D0`}}>Lucide (lu)</strong> como família padrão, stroke consistente e tree-shakeable.</p>
        </div>
      </header>

      <div style={{padding:mob?"24px 16px 40px":"36px 40px 60px",maxWidth:1100,margin:"0 auto"}}>
        <Section n="01" title="Biblioteca de ícones" desc={`Seleção de ${categories.reduce((a,c)=>a+c.icons.length,0)} ícones com várias bibliotecas React Icons. Visual compacto (ícone + nome) para caber muito mais itens.`}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:20,flexWrap:"wrap"}}>
            <span style={{fontSize:12,fontWeight:600,color:C.cinzaChumbo,fontFamily:Fn.body}}>Tamanho:</span>
            {[14,16,20,24].map(s=>(
              <button key={s} onClick={()=>setSelSize(s)} style={{padding:"4px 10px",fontSize:11,fontWeight:selSize===s?700:400,fontFamily:Fn.mono,background:selSize===s?C.azulProfundo:"transparent",color:selSize===s?C.branco:C.cinzaChumbo,border:`1px solid ${selSize===s?C.azulProfundo:C.cardBorder}`,borderRadius:6,cursor:"pointer",transition:"all .15s"}}>{s}px</button>
            ))}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:20}}>
            {categories.map(cat=>(
              <div key={cat.name}>
                <span style={{fontSize:11,fontWeight:700,letterSpacing:"1.2px",textTransform:"uppercase",color:C.textLight,fontFamily:Fn.title,display:"block",marginBottom:10}}>{cat.name}</span>
                <div style={{display:"grid",gridTemplateColumns:mob?"repeat(4,minmax(0,1fr))":"repeat(10,minmax(0,1fr))",gap:6}}>
                  {cat.icons.map(ic=>{const isHov=hovIcon===ic.id;const importName=iconImportName[ic.id]||ic.id;const source=iconImportSource[ic.id]||"react-icons/lu";const codeSnippet=`// DS-FIPS — Icone: ${ic.label}\nimport { ${importName} } from "${source}";\n\n<${importName} size={${selSize}} color="#004B9B" />`;return(
                    <div onMouseEnter={()=>setHovIcon(ic.id)} onMouseLeave={()=>setHovIcon(null)} style={{background:C.cardBg,border:`1px solid ${isHov?C.azulProfundo:C.cardBorder}`,borderRadius:8,padding:"8px 4px 6px",display:"flex",flexDirection:"column",alignItems:"center",gap:5,transition:"all .15s",boxShadow:isHov?"0 2px 8px rgba(0,75,155,.08)":"none"}}>
                      <Copyable
                        key={ic.id}
                        label={`icon-${ic.id}`}
                        code={codeSnippet}
                        preview={
                          <div style={{display:"flex",alignItems:"center",gap:14}}>
                            <div style={{width:48,height:48,borderRadius:12,background:"#F3F6FB",display:"flex",alignItems:"center",justifyContent:"center"}}>
                              <Ic id={ic.id} size={24} color="#004B9B" />
                            </div>
                            <div>
                              <div style={{fontSize:14,fontWeight:700,fontFamily:"'Saira Expanded', sans-serif",color:"#333B41"}}>{ic.label}</div>
                              <code style={{fontSize:11,fontFamily:"'Fira Code', monospace",color:"#6B7784"}}>{importName}</code>
                            </div>
                          </div>
                        }
                      >
                        <div style={{width:selSize+10,height:selSize+10,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:6,background:isHov?alpha(C.azulProfundo,0.03):C.bg,transition:"background .15s"}}>
                          <Ic id={ic.id} size={selSize} color={isHov?C.azulProfundo:C.cinzaEscuro} />
                        </div>
                      </Copyable>
                      <span style={{fontSize:9,fontWeight:600,color:isHov?C.azulProfundo:C.cinzaChumbo,fontFamily:Fn.body,textAlign:"center",transition:"color .15s",lineHeight:1.15}}>{ic.label}</span>
                    </div>
                  )})}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section n="02" title="Escala de tamanhos" desc="5 tamanhos padrão. Cada contexto tem seu tamanho recomendado.">
          <DSCard mob={mob}>
            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              {sizes.map(s=>(
                <div key={s.px} style={{display:"flex",alignItems:"center",gap:mob?12:24,padding:"10px 0",borderBottom:`1px solid ${C.cardBorder}`}}>
                  <div style={{width:48,height:48,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ic id="settings" size={s.px} color={C.azulProfundo} /></div>
                  <div style={{minWidth:60,flexShrink:0}}><code style={{fontSize:14,fontWeight:700,fontFamily:Fn.mono,color:C.cinzaEscuro}}>{s.px}px</code></div>
                  <span style={{fontSize:13,color:C.cinzaChumbo,fontFamily:Fn.body,lineHeight:1.4}}>{s.use}</span>
                </div>
              ))}
            </div>
          </DSCard>
        </Section>

        <Section n="03" title="Cores de ícone" desc="Ícones herdam cor do contexto. Cada cor semântica tem uso definido.">
          <DSCard mob={mob}>
            <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:12}}>
              {colorRules.map(cr=>(
                <div key={cr.name} style={{display:"flex",alignItems:"center",gap:14,padding:"10px 14px",borderRadius:8,border:`1px solid ${C.cardBorder}`,background:C.bg}}>
                  <div style={{width:40,height:40,borderRadius:10,background:C.cardBg,border:`1px solid ${C.cardBorder}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ic id="shield" size={20} color={cr.color} /></div>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:2}}>
                      <span style={{fontSize:12,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>{cr.name}</span>
                      <code style={{fontSize:10,fontFamily:Fn.mono,color:cr.color}}>{cr.color}</code>
                    </div>
                    <span style={{fontSize:11,color:C.cinzaChumbo,fontFamily:Fn.body}}>{cr.use}</span>
                  </div>
                </div>
              ))}
            </div>
          </DSCard>
        </Section>

        <Section n="04" title="Uso em contexto" desc="Ícones aplicados dentro de componentes reais do DS-FIPS.">
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:16}}>
            <div style={{background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:"10px 10px 10px 18px",padding:mob?16:20}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.textLight,fontFamily:Fn.title,display:"block",marginBottom:12}}>Botão</span>
              <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                <button style={{display:"inline-flex",alignItems:"center",gap:6,padding:"8px 16px",fontSize:13,fontWeight:600,fontFamily:Fn.body,color:C.branco,background:C.azulProfundo,border:"none",borderRadius:8,cursor:"pointer"}}><Ic id="check" size={14} color={C.branco} /> Confirmar</button>
                <button style={{display:"inline-flex",alignItems:"center",gap:6,padding:"8px 16px",fontSize:13,fontWeight:600,fontFamily:Fn.body,color:C.danger,background:"transparent",border:`1px solid ${C.danger}`,borderRadius:8,cursor:"pointer"}}><Ic id="trash" size={14} color={C.danger} /> Excluir</button>
              </div>
            </div>
            <div style={{background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:"10px 10px 10px 18px",padding:mob?16:20}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.textLight,fontFamily:Fn.title,display:"block",marginBottom:12}}>Badge</span>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"3px 8px",fontSize:11,fontWeight:600,color:C.verdeEscuro,background:"#ECFDF5",border:"1px solid #A7F3D0",borderRadius:4}}><Ic id="status" size={12} color={C.verdeEscuro} /> Ativo</span>
                <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"3px 8px",fontSize:11,fontWeight:600,color:"#C2410C",background:"#FFF7ED",border:"1px solid #FDBA74",borderRadius:4}}><Ic id="clock" size={12} color="#C2410C" /> Pendente</span>
                <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"3px 8px",fontSize:11,fontWeight:600,color:"#B91C1C",background:"#FEF2F2",border:"1px solid #FECACA",borderRadius:4}}><Ic id="lock" size={12} color="#B91C1C" /> Bloqueado</span>
              </div>
            </div>
            <div style={{background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:"10px 10px 10px 18px",padding:mob?16:20}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.textLight,fontFamily:Fn.title,display:"block",marginBottom:12}}>Header de modal</span>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:48,height:48,borderRadius:14,background:alpha(C.azulProfundo,0.04),display:"flex",alignItems:"center",justifyContent:"center"}}><Ic id="doc" size={24} color={C.azulProfundo} /></div>
                <div><span style={{fontSize:15,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title,display:"block"}}>Nova Requisição</span><span style={{fontSize:12,color:C.cinzaChumbo}}>Preencha os dados abaixo</span></div>
              </div>
            </div>
            <div style={{background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:"10px 10px 10px 18px",padding:mob?16:20}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:C.textLight,fontFamily:Fn.title,display:"block",marginBottom:12}}>Containers com fundo</span>
              <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                {[{bg:alpha(C.azulProfundo,0.04),ic:C.azulProfundo,l:"Info"},{bg:`${C.verdeFloresta}0A`,ic:C.verdeFloresta,l:"Sucesso"},{bg:`${C.amareloEscuro}0A`,ic:C.amareloEscuro,l:"Atenção"},{bg:`${C.danger}0A`,ic:C.danger,l:"Destrutivo"}].map(c=>(
                  <div key={c.l} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
                    <div style={{width:48,height:48,borderRadius:14,background:c.bg,display:"flex",alignItems:"center",justifyContent:"center"}}><Ic id="bell" size={22} color={c.ic} /></div>
                    <span style={{fontSize:10,color:C.cinzaChumbo,fontFamily:Fn.body}}>{c.l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        <Section n="05" title="Regras de uso" desc="Diretrizes para manter consistência visual na biblioteca de ícones.">
          <DSCard mob={mob}>
            <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:mob?16:24}}>
              {[
                {title:"Stroke-only",desc:"Família Lucide (lu) do React Icons, stroke consistente, sem fill. Mantém unidade visual com o DS.",icon:"edit"},
                {title:"Sempre com label",desc:"Ícones sozinhos só em ações de tabela e botões icon-only. Em todos os outros, acompanhar texto.",icon:"tag"},
                {title:"Espaçamento",desc:"Gap mínimo de 6px entre ícone e texto. Em badges 4px, em inputs 8px.",icon:"grid"},
                {title:"Alinhamento",desc:"Sempre centralizado verticalmente com o texto (alignItems center).",icon:"check"},
                {title:"Cor herdada",desc:"Ícones usam a cor do contexto. Tab ativa = laranja, botão primário = branco, input = cinza.",icon:"eye"},
                {title:"React Icons (Lucide)",desc:"Biblioteca padrão do DS-FIPS. Importar de react-icons/lu. Tree-shakeable.",icon:"shield"},
              ].map(r=>(
                <div key={r.title} style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                  <div style={{width:36,height:36,borderRadius:10,background:C.bg,border:`1px solid ${C.cardBorder}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ic id={r.icon} size={16} color={C.azulProfundo} /></div>
                  <div><span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title,display:"block",marginBottom:2}}>{r.title}</span><span style={{fontSize:12,color:C.cinzaChumbo,fontFamily:Fn.body,lineHeight:1.5}}>{r.desc}</span></div>
                </div>
              ))}
            </div>
          </DSCard>
        </Section>

        <Section n="06" title="Tokens de referência" desc="Valores técnicos da biblioteca de ícones.">
          <DSCard mob={mob} s={{display:"flex",gap:mob?24:48,flexWrap:"wrap"}}>
            <div style={{display:"flex",flexDirection:"column",gap:10,minWidth:200}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:Fn.title,marginBottom:4}}>Tamanhos</span>
              <TokenRow label="Compacto (badge)" value="12px"/>
              <TokenRow label="Padrão (input)" value="14px"/>
              <TokenRow label="Médio (botão)" value="16px"/>
              <TokenRow label="Grande (header)" value="20px"/>
              <TokenRow label="Hero (empty)" value="24px"/>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10,minWidth:200}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:Fn.title,marginBottom:4}}>Stroke</span>
              <TokenRow label="Família" value="Lucide (lu)"/>
              <TokenRow label="Estilo" value="stroke, sem fill"/>
              <TokenRow label="Stroke cap" value="round"/>
              <TokenRow label="Stroke join" value="round"/>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10,minWidth:200}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:".5px",color:C.textLight,textTransform:"uppercase",fontFamily:Fn.title,marginBottom:4}}>Integração</span>
              <TokenRow label="Pacote" value="react-icons"/>
              <TokenRow label="Import" value="react-icons/lu"/>
              <TokenRow label="Tree-shake" value="sim (por ícone)"/>
              <TokenRow label="Gap ícone–texto" value="4–8px"/>
              <TokenRow label="Container modal" value="48×48 r14"/>
            </div>
          </DSCard>
        </Section>

        <Section n="07" title="Considerações Dark Mode" desc="Adaptações de cor de ícones para o modo escuro do DS-FIPS.">
          <div style={{background:C.cardBg,borderRadius:"10px 10px 10px 18px",border:`1px solid ${C.cardBorder}`,padding:mob?16:24}}>
            <p style={{fontSize:13,color:C.cinzaChumbo,lineHeight:1.6,margin:"0 0 16px",fontFamily:Fn.body}}>
              Ícones seguem a cor do texto — #E2E2E8 (fg) ou #A1A1AA (muted) no dark mode. Ícones de destaque usam as cores semânticas dark: primary #93BDE4, success #8BE5AD, accent #FDC24E.
            </p>
            <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:10}}>
              {[
                {label:"fg (dark)",value:"#E2E2E8"},
                {label:"muted (dark)",value:"#A1A1AA"},
                {label:"Primary (dark)",value:"#93BDE4"},
                {label:"Success (dark)",value:"#8BE5AD"},
                {label:"Accent (dark)",value:"#FDC24E"},
                {label:"Danger (dark)",value:"#DC3545"},
                {label:"Tamanhos",value:"Idênticos em ambos"},
                {label:"Stroke style",value:"Sem alteração"},
              ].map((t,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,fontSize:12,fontFamily:Fn.body}}>
                  <span style={{color:C.cinzaChumbo,minWidth:140}}>{t.label}</span>
                  <code style={{background:C.neutro,padding:"2px 8px",borderRadius:4,fontSize:11,fontFamily:Fn.mono,color:C.cinzaEscuro}}>{t.value}</code>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section n="08" title="Bibliotecas e links" desc="Referências oficiais das bibliotecas usadas no catálogo de ícones do DS-FIPS.">
          <DSCard mob={mob}>
            <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:12}}>
              {[
                {name:"React Icons",link:"https://react-icons.github.io/react-icons/",desc:"Catálogo unificado e pacote usado no projeto."},
                {name:"Lucide (coleção lu)",link:"https://lucide.dev/icons/",desc:"Família de ícones padrão adotada no DS-FIPS."},
                {name:"Pacote npm react-icons",link:"https://www.npmjs.com/package/react-icons",desc:"Versões, instalação e notas técnicas do pacote."},
                {name:"Guia de acessibilidade de ícones",link:"https://www.w3.org/WAI/ARIA/apg/practices/names-and-descriptions/",desc:"Boas práticas para ícones com texto alternativo e labels."},
              ].map((item)=>(
                <a key={item.name} href={item.link} target="_blank" rel="noreferrer" style={{display:"block",textDecoration:"none",border:`1px solid ${C.cardBorder}`,borderRadius:10,padding:"12px 14px",background:C.bg}}>
                  <div style={{fontSize:13,fontWeight:700,color:C.azulProfundo,fontFamily:Fn.title,marginBottom:4}}>{item.name}</div>
                  <div style={{fontSize:12,color:C.cinzaChumbo,fontFamily:Fn.body,lineHeight:1.5,marginBottom:6}}>{item.desc}</div>
                  <code style={{fontSize:11,fontFamily:Fn.mono,color:C.azulEscuro,wordBreak:"break-all"}}>{item.link}</code>
                </a>
              ))}
            </div>
          </DSCard>
        </Section>

        <CodePlayground />

        <div style={{textAlign:"center",padding:"20px 0 0",borderTop:`1px solid ${C.cardBorder}`,marginTop:20}}>
          <span style={{fontSize:12,color:C.cinzaChumbo,letterSpacing:".5px",fontFamily:Fn.title,fontWeight:400}}>DS-FIPS v0.4.2 · Ferrovia Interna do Porto de Santos · Excelência sobre trilhos · {new Date().getFullYear()}</span>
        </div>
      </div>
    </div>
    </PlaygroundProvider>
  );
}
