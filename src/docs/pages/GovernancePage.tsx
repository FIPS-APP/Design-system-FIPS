import { useState, useEffect } from "react";

/* ═══════════════════════════════════════════ TOKENS ═══════════════════════════════════════════ */
const C={azulProfundo:"var(--color-gov-azul-profundo)",azulEscuro:"var(--color-gov-azul-escuro)",azulClaro:"var(--color-gov-azul-claro)",cinzaChumbo:"var(--color-fg-muted)",cinzaEscuro:"var(--color-fg)",cinzaClaro:"#C0CCD2",azulCeu:"#93BDE4",azulCeuClaro:"#D3E3F4",amareloOuro:"#FDC24E",amareloEscuro:"#F6921E",verdeFloresta:"#00C64C",verdeEscuro:"var(--color-gov-verde-escuro)",danger:"#DC3545",neutro:"var(--color-surface-soft)",branco:"#FFFFFF",bg:"var(--color-surface-muted)",cardBg:"var(--color-surface)",cardBorder:"var(--color-border)",textMuted:"var(--color-fg-muted)",textLight:"var(--color-fg-muted)",gradientFrom:"var(--color-gov-gradient-from)",gradientTo:"var(--color-gov-gradient-to)"};
const Fn={title:"'Saira Expanded',sans-serif",body:"'Open Sans',sans-serif",mono:"'Fira Code',monospace"};
const alpha=(c:string,a:number)=>`color-mix(in srgb,${c} ${Math.round(a*100)}%,transparent)`;

const Ic={
  grid:(s:number,c:string)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><rect x="2" y="2" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/><rect x="11" y="2" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/><rect x="2" y="11" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/><rect x="11" y="11" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4"/></svg>,
  shield:(s:number,c:string)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M10 2L3 5.5v5c0 4 3.5 6.5 7 7.5 3.5-1 7-3.5 7-7.5v-5L10 2z" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/><path d="M7 10l2 2 4-4" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  alert:(s:number,c:string)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M10 2L1.5 17h17L10 2z" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/><path d="M10 8v4M10 14v.5" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>,
  scale:(s:number,c:string)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M10 2v16M4 6l6-4 6 4M3 8l3.5-2M17 8l-3.5-2M4 14a6 6 0 006 0M10 14a6 6 0 006 0" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  check:(s:number,c:string)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke={c} strokeWidth="1.5"/><path d="M7 10l2 2 4-4" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  x:(s:number,c:string)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke={c} strokeWidth="1.5"/><path d="M7 7l6 6M13 7l-6 6" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>,
  ban:(s:number,c:string)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke={c} strokeWidth="1.5"/><path d="M4.3 4.3l11.4 11.4" stroke={c} strokeWidth="1.5"/></svg>,
  code:(s:number,c:string)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M7 5L2 10l5 5M13 5l5 5-5 5" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  doc:(s:number,c:string)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M6 2h6l5 5v10a1 1 0 01-1 1H6a1 1 0 01-1-1V3a1 1 0 011-1z" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/><path d="M12 2v5h5" stroke={c} strokeWidth="1.5"/></svg>,
  star:(s:number,c:string)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M10 2l2.5 5.2 5.7.8-4.1 4 1 5.7L10 14.8 4.9 17.7l1-5.7-4.1-4 5.7-.8L10 2z" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  eye:(s:number,c:string)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke={c} strokeWidth="1.5"/><circle cx="10" cy="10" r="2.5" stroke={c} strokeWidth="1.5"/></svg>,
  lock:(s:number,c:string)=><svg width={s} height={s} viewBox="0 0 20 20" fill="none"><rect x="4" y="9" width="12" height="9" rx="2" stroke={c} strokeWidth="1.5"/><path d="M7 9V6a3 3 0 016 0v3" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>,
};

function JunctionLines({style}:{style?:React.CSSProperties}){return <svg viewBox="0 0 320 200" fill="none" style={{opacity:.12,...style}}><path d="M0 60H100C120 60 120 60 140 40L200 40H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/><path d="M0 60H100C120 60 120 60 140 80L200 80H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/><path d="M0 120H60C80 120 80 120 100 100L160 100H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/><path d="M0 120H60C80 120 80 120 100 140L160 140H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/></svg>}

function Section({n,title,desc,children}:{n:string,title:string,desc:string,children:React.ReactNode}){return(<section style={{marginBottom:48}}><div style={{fontSize:10,fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",color:C.azulClaro,fontFamily:Fn.title,marginBottom:6}}>{n}</div><h2 style={{fontSize:22,fontWeight:700,color:C.cinzaEscuro,margin:"0 0 4px",fontFamily:Fn.title,letterSpacing:".5px"}}>{title}</h2><p style={{fontSize:14,color:C.cinzaChumbo,margin:"0 0 22px",lineHeight:1.55,fontFamily:Fn.body}}>{desc}</p>{children}</section>)}
function DSCard({children,s,mob:m}:{children:React.ReactNode,s?:React.CSSProperties,mob?:boolean}){return(<div style={{background:C.cardBg,borderRadius:"12px 12px 12px 24px",border:`1px solid ${C.cardBorder}`,padding:m?16:28,boxShadow:"0 1px 3px rgba(0,75,155,.04),0 4px 14px rgba(0,75,155,.03)",...s}}>{children}</div>)}

/* ═══════════════════════════════════════════ MAIN ═══════════════════════════════════════════ */
export default function DSFIPSGovernance(){
  const [w,setW]=useState(typeof window!=="undefined"?window.innerWidth:1200);
  useEffect(()=>{const h=()=>setW(window.innerWidth);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h)},[]);
  const mob=w<640;

  return(
    <div style={{minHeight:"100vh",background:"var(--color-surface-muted)",fontFamily:Fn.body,color:C.cinzaEscuro}}>
      <style>{`
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      {/* HEADER */}
      <header style={{background:`linear-gradient(135deg,${C.gradientFrom} 0%,${C.gradientTo} 100%)`,padding:mob?"32px 20px":"48px 40px 44px",position:"relative",overflow:"hidden"}}>
        <JunctionLines style={{position:"absolute",top:-10,right:-20,width:mob?250:400,height:250}}/>
        <div style={{position:"relative"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:6,background:`${C.branco}10`,border:`1px solid ${C.branco}18`,borderRadius:20,padding:"5px 14px",fontSize:11,fontWeight:600,letterSpacing:"1.5px",textTransform:"uppercase",color:C.amareloOuro,fontFamily:Fn.title,marginBottom:16}}>{Ic.grid(14,C.amareloOuro)} Design System FIPS</div>
          <h1 style={{fontSize:mob?30:44,fontWeight:700,color:C.branco,margin:"0 0 10px",fontFamily:Fn.title}}>Governança</h1>
          <p style={{fontSize:16,color:`${C.branco}B0`,lineHeight:1.6,maxWidth:700,margin:0,fontFamily:Fn.body}}>As regras aqui valem para todos: times internos, parceiros e projetos futuros. Se uma tela existe na empresa, ela <strong style={{color:C.amareloOuro}}>obrigatoriamente</strong> usa os componentes e tokens deste Design System. Sem exceções.</p>
        </div>
      </header>

      <div style={{padding:mob?"24px 16px 40px":"36px 40px 60px",maxWidth:1100,margin:"0 auto"}}>

        {/* 01 — PRINCÍPIOS OBRIGATÓRIOS */}
        <Section n="01" title="Princípios obrigatórios" desc="Três regras inegociáveis. Se um projeto não segue estas regras, a tela volta pra correção.">
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr 1fr",gap:16}}>
            {[
              {icon:Ic.shield,color:C.azulProfundo,bg:alpha(C.azulProfundo,0.03),title:"Use o componente, não invente",desc:"Precisa de um botão? Use o Button do DS. Precisa de uma tabela? Use o Table do DS. Nunca crie um componente visual do zero — sempre parta do que já existe aqui.",tag:"REGRA 1"},
              {icon:Ic.alert,color:C.amareloEscuro,bg:alpha(C.amareloEscuro,0.03),title:"Não mude o visual por fora",desc:"Proibido alterar borda, raio, sombra, cor, fonte ou padding de um componente do DS com CSS externo no projeto. Se o visual não atende, peça uma evolução — não conserte por fora.",tag:"REGRA 2"},
              {icon:Ic.scale,color:C.azulEscuro,bg:alpha(C.azulEscuro,0.03),title:"Evoluir antes de usar",desc:"Surgiu um caso que o DS não cobre? Primeiro crie a variante oficial aqui, documente, e só depois use no projeto. Nenhuma solução visual nasce escondida dentro de uma tela.",tag:"REGRA 3"},
            ].map((p,i)=>(
              <div key={i} style={{background:C.cardBg,borderRadius:"10px 10px 10px 18px",border:`1px solid ${C.cardBorder}`,overflow:"hidden",boxShadow:"0 2px 8px rgba(0,75,155,.05)",animation:`fadeUp .4s ease ${i*0.08}s both`}}>
                <div style={{background:p.bg,padding:mob?"16px 16px 14px":"20px 22px 16px",borderBottom:`1px solid ${C.cardBorder}`}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                    <div style={{width:42,height:42,borderRadius:12,background:C.cardBg,border:`1px solid ${C.cardBorder}`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 6px rgba(0,75,155,.06)"}}>{p.icon(20,p.color)}</div>
                    <span style={{fontSize:9,fontWeight:700,letterSpacing:"1.5px",fontFamily:Fn.title,color:p.color,background:C.cardBg,padding:"3px 8px",borderRadius:4,border:`1px solid ${alpha(p.color,0.13)}`}}>{p.tag}</span>
                  </div>
                  <h3 style={{fontSize:mob?14:16,fontWeight:700,color:C.cinzaEscuro,margin:0,fontFamily:Fn.title,lineHeight:1.3}}>{p.title}</h3>
                </div>
                <div style={{padding:mob?"14px 16px":"16px 22px 20px"}}>
                  <p style={{fontSize:13,color:C.cinzaChumbo,lineHeight:1.6,margin:0,fontFamily:Fn.body}}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* 02 — REGRAS DE USO */}
        <Section n="02" title="Na prática, como construir" desc="Regras do dia a dia. Siga estas orientações sempre que for montar uma tela.">
          <DSCard mob={mob}>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {[
                {text:"Formulários sempre usam a composição Field + Input (ou Select, ou Textarea). Não monte campos soltos — o Field agrupa label, campo e mensagem de erro.",icon:Ic.code,color:C.azulProfundo},
                {text:'Dentro de modal ou drawer, use o modo compacto. Isso reduz o espaçamento e a altura dos campos automaticamente — não ajuste manualmente.',icon:Ic.doc,color:C.verdeFloresta},
                {text:"Se a tela precisa de algo que o DS não tem, pare. Primeiro evolua o componente aqui, depois volte e use a versão oficial no projeto.",icon:Ic.star,color:C.amareloEscuro},
                {text:"CSS externo no projeto só serve para posicionamento: grid, flex, margem, largura. Nunca use CSS externo para mudar cor, borda, raio, sombra ou fonte de um componente do DS.",icon:Ic.lock,color:C.cinzaChumbo},
              ].map((r,i)=>(
                <div key={i} style={{display:"flex",alignItems:"flex-start",gap:12,padding:"12px 16px",background:C.bg,borderRadius:8,border:`1px solid ${C.cardBorder}`}}>
                  <div style={{width:32,height:32,borderRadius:8,background:alpha(r.color,0.04),display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>{r.icon(16,r.color)}</div>
                  <span style={{fontSize:13,color:C.cinzaEscuro,fontFamily:Fn.body,lineHeight:1.55}}>{r.text}</span>
                </div>
              ))}
            </div>
          </DSCard>
        </Section>

        {/* 03 — OBRIGATÓRIO / OPCIONAL / EVITAR */}
        <Section n="03" title="Faça, pode fazer e nunca faça" desc="Referência rápida para saber o que é obrigatório, o que é flexível e o que é proibido.">
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr 1fr",gap:16}}>
            <div style={{background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:"10px 10px 10px 18px",overflow:"hidden"}}>
              <div style={{padding:"14px 20px",background:alpha(C.verdeFloresta,0.03),borderBottom:`1px solid ${C.cardBorder}`,display:"flex",alignItems:"center",gap:10}}>
                {Ic.check(20,C.verdeFloresta)}
                <span style={{fontSize:14,fontWeight:700,color:C.verdeEscuro,fontFamily:Fn.title}}>Sempre faça</span>
              </div>
              <div style={{padding:mob?14:20}}>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {["Comece qualquer tela importando componentes do DS-FIPS. Zero exceção.","Ao documentar um padrão novo, prove que ele reusa componentes existentes — não que cria visuais novos.","Modal de filtro, drawer de filtro e form compacto usam exatamente a mesma composição. Copie do DS, não reinvente.","Antes de publicar, confira se algum componente do DS foi alterado visualmente. Borda mudada = problema."].map((item,i)=>(
                    <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start"}}>
                      <span style={{color:C.verdeFloresta,fontSize:14,lineHeight:"20px",flexShrink:0}}>✓</span>
                      <span style={{fontSize:12,color:C.cinzaEscuro,fontFamily:Fn.body,lineHeight:1.5}}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:"10px 10px 10px 18px",overflow:"hidden"}}>
              <div style={{padding:"14px 20px",background:alpha(C.azulCeu,0.06),borderBottom:`1px solid ${C.cardBorder}`,display:"flex",alignItems:"center",gap:10}}>
                {Ic.eye(20,C.azulProfundo)}
                <span style={{fontSize:14,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title}}>Pode fazer</span>
              </div>
              <div style={{padding:mob?14:20}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:80}}>
                  <span style={{fontSize:13,color:C.textMuted,fontFamily:Fn.body,fontStyle:"italic",textAlign:"center",lineHeight:1.5}}>Nenhuma extensão opcional definida ainda. Quando houver, aparecerá aqui.</span>
                </div>
              </div>
            </div>
            <div style={{background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:"10px 10px 10px 18px",overflow:"hidden"}}>
              <div style={{padding:"14px 20px",background:alpha(C.danger,0.02),borderBottom:`1px solid ${C.cardBorder}`,display:"flex",alignItems:"center",gap:10}}>
                {Ic.ban(20,C.danger)}
                <span style={{fontSize:14,fontWeight:700,color:C.danger,fontFamily:Fn.title}}>Nunca faça</span>
              </div>
              <div style={{padding:mob?14:20}}>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {["Mudar borda, raio, sombra ou altura de componente usando CSS externo no projeto. Isso quebra a consistência.",'Criar um Input ou Button "especial" que só existe dentro de uma tela. Se precisa existir, tem que estar no DS.',"Documentar componentes só pra ficar bonito. Se não está sendo reusado de verdade nos projetos, não serve."].map((item,i)=>(
                    <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start"}}>
                      <span style={{color:C.danger,fontSize:14,lineHeight:"20px",flexShrink:0}}>✗</span>
                      <span style={{fontSize:12,color:C.cinzaEscuro,fontFamily:Fn.body,lineHeight:1.5}}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* 04 — APLICAÇÃO PRÁTICA */}
        <Section n="04" title="A regra de ouro" desc="Se você ler só uma coisa nesta página, leia isso.">
          <div style={{background:`linear-gradient(135deg,${C.gradientFrom},${C.gradientTo})`,borderRadius:"12px 12px 12px 24px",padding:mob?"24px 20px":"36px 40px",position:"relative",overflow:"hidden"}}>
            <JunctionLines style={{position:"absolute",bottom:-30,right:-40,width:400,height:250,opacity:.06}}/>
            <div style={{position:"relative"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
                <div style={{width:44,height:44,borderRadius:12,background:`${C.amareloOuro}20`,display:"flex",alignItems:"center",justifyContent:"center"}}>{Ic.star(22,C.amareloOuro)}</div>
                <span style={{fontSize:mob?16:20,fontWeight:700,color:C.branco,fontFamily:Fn.title}}>Se a tela e o DS estão diferentes, o DS é que precisa mudar.</span>
              </div>
              <p style={{fontSize:mob?14:16,color:`${C.branco}D0`,lineHeight:1.65,margin:"0 0 20px",fontFamily:Fn.body,maxWidth:700}}>Nunca "conserte" a diferença no projeto com CSS local. Se o componente não atende, <strong style={{color:C.amareloOuro}}>abra uma evolução no Design System</strong>, corrija aqui, e depois atualize o projeto. O DS é a fonte de verdade — o projeto só consome.</p>
              <div style={{background:`${C.branco}08`,borderRadius:10,padding:"14px 18px",border:`1px solid ${C.branco}10`}}>
                <p style={{fontSize:13,color:`${C.branco}A0`,lineHeight:1.55,margin:0,fontFamily:Fn.body}}>Esta documentação não é só uma vitrine para gestores e diretoria. É uma <strong style={{color:`${C.branco}D0`}}>norma técnica obrigatória</strong>. Todo dev, designer e parceiro que constrói telas na FIPS segue estas regras.</p>
              </div>
            </div>
          </div>
        </Section>

        {/* 05 — FLUXO DE DECISÃO */}
        <Section n="05" title="Preciso de algo novo — e agora?" desc="Siga este passo a passo toda vez que a tela pedir algo que você não encontra no DS.">
          <DSCard mob={mob}>
            <div style={{display:"flex",flexDirection:mob?"column":"row",gap:0,alignItems:"stretch"}}>
              {[
                {step:"1",title:"Já existe?",desc:"Procure no DS-FIPS. A maioria dos casos já está coberta por algum componente ou variante.",color:C.azulProfundo,answer:"Existe → Use direto."},
                {step:"2",title:"Uma prop resolve?",desc:"Tente size, variant ou density. Muitas vezes o componente já cobre o caso com uma prop diferente.",color:C.verdeFloresta,answer:"Resolve → Use a prop."},
                {step:"3",title:"Precisa evoluir?",desc:"O componente existe mas falta uma variante? Crie a evolução no DS primeiro, documente, e depois use.",color:C.amareloEscuro,answer:"Evolua → Documente → Use."},
                {step:"4",title:"Não existe nada?",desc:"Caso raro. Crie o componente novo no DS-FIPS com tokens oficiais, publique, e só então use no projeto.",color:C.danger,answer:"Crie no DS → Depois use."},
              ].map((s,i)=>(
                <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",padding:mob?"16px 12px":"16px 20px",position:"relative"}}>
                  {i<3&&!mob&&<div style={{position:"absolute",right:0,top:"50%",width:1,height:"60%",transform:"translateY(-50%)",background:`${C.cardBorder}`}}/>}
                  {i<3&&!mob&&<div style={{position:"absolute",right:-4,top:"50%",transform:"translateY(-50%)",width:0,height:0,borderTop:"5px solid transparent",borderBottom:"5px solid transparent",borderLeft:`6px solid ${C.cardBorder}`}}/>}
                  <div style={{width:36,height:36,borderRadius:"50%",background:alpha(s.color,0.07),border:`2px solid ${s.color}`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:12}}>
                    <span style={{fontSize:14,fontWeight:800,fontFamily:Fn.title,color:s.color}}>{s.step}</span>
                  </div>
                  <span style={{fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:Fn.title,textAlign:"center",marginBottom:6}}>{s.title}</span>
                  <span style={{fontSize:12,color:C.cinzaChumbo,fontFamily:Fn.body,textAlign:"center",lineHeight:1.45,marginBottom:10}}>{s.desc}</span>
                  <div style={{background:alpha(s.color,0.03),borderRadius:6,padding:"6px 10px",border:`1px solid ${alpha(s.color,0.13)}`}}>
                    <span style={{fontSize:11,fontWeight:600,color:s.color,fontFamily:Fn.body}}>{s.answer}</span>
                  </div>
                </div>
              ))}
            </div>
          </DSCard>
        </Section>

        {/* 06 — CHECKLIST */}
        <Section n="06" title="Checklist antes de publicar" desc="Antes de colocar qualquer tela nova no ar, confira cada item. Se algum falhar, a tela não sobe.">
          <DSCard mob={mob}>
            <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:mob?10:12}}>
              {["Todo visual da tela vem de componentes do DS-FIPS?","Nenhum CSS externo muda cor, borda, raio ou sombra de componente?","Formulários usam a composição Field + Input/Select/Textarea?",'Modais e filtros usam o modo compacto?',"Nenhum componente visual foi criado solto, fora do DS?","Cores e fontes são tokens oficiais do Brandbook?","Espaçamentos usam a escala de 4px (4/8/12/16/24/32/48)?","Containers grandes usam border-radius Elemento Caixa?","CSS externo no projeto é só pra posicionamento (grid, flex, margem)?","Se criou algo novo, foi adicionado ao DS-FIPS primeiro?"].map((item,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:8,background:C.bg,border:`1px solid ${C.cardBorder}`}}>
                  <div style={{width:20,height:20,borderRadius:4,border:`2px solid ${C.verdeFloresta}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    {Ic.check(12,C.verdeFloresta)}
                  </div>
                  <span style={{fontSize:12,color:C.cinzaEscuro,fontFamily:Fn.body,lineHeight:1.4}}>{item}</span>
                </div>
              ))}
            </div>
          </DSCard>
        </Section>

        {/* 07 — DARK MODE OBRIGATÓRIO */}
        <Section n="07" title="Dark mode obrigatório" desc="Todo componente e tela do DS-FIPS deve funcionar em ambos os modos — claro e escuro. As regras de governança se aplicam igualmente.">
          <DSCard mob={mob}>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {[
                {text:"Nunca use #004B9B, #002A68 ou cores escuras como texto/ícone no dark mode — troque por #93BDE4, #658EC9",icon:Ic.alert,color:C.amareloEscuro},
                {text:"Inputs, selects e badges devem ter bordas visíveis (#3A3A3A idle, #93BDE4 focus)",icon:Ic.shield,color:C.azulProfundo},
                {text:"SVG fill/stroke não aceita CSS variables — use hex direto com condicional dark/light",icon:Ic.code,color:C.verdeFloresta},
                {text:"Teste todo componente novo em ambos os modos antes de publicar",icon:Ic.check,color:C.cinzaChumbo},
              ].map((r,i)=>(
                <div key={i} style={{display:"flex",alignItems:"flex-start",gap:12,padding:"12px 16px",background:C.bg,borderRadius:8,border:`1px solid ${C.cardBorder}`}}>
                  <div style={{width:32,height:32,borderRadius:8,background:alpha(r.color,0.04),display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>{r.icon(16,r.color)}</div>
                  <span style={{fontSize:13,color:C.cinzaEscuro,fontFamily:Fn.body,lineHeight:1.55}}>{r.text}</span>
                </div>
              ))}
            </div>
          </DSCard>
        </Section>

        <div style={{textAlign:"center",padding:"20px 0 0",borderTop:`1px solid ${C.cardBorder}`,marginTop:20}}>
          <span style={{fontSize:12,color:C.cinzaChumbo,letterSpacing:".5px",fontFamily:Fn.title,fontWeight:400}}>DS-FIPS v0.4.2 · Ferrovia Interna do Porto de Santos · Excelência sobre trilhos · {new Date().getFullYear()}</span>
        </div>
      </div>
    </div>
  );
}
