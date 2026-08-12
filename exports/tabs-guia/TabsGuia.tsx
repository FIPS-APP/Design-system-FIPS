// DS-FIPS — Tabs (Guia) — Copy-paste ready
const C={azulEscuro:"var(--color-gov-azul-escuro)",azulProfundo:"var(--color-gov-azul-profundo)",cinzaChumbo:"var(--color-fg-muted)",cinzaEscuro:"var(--color-fg)",branco:"#FFFFFF",cardBg:"var(--color-surface)",textLight:"var(--color-fg-muted)",verdeFloresta:"#00C64C"};
const Fn={body:"'Open Sans',sans-serif",mono:"'Fira Code',monospace"};

export function TabsGuia({tabs=[],active=0,onChange,size="md"}){
  const sz={sm:{fs:11,py:8,px:18},md:{fs:12,py:10,px:20},lg:{fs:13,py:12,px:24}};
  const s=sz[size]||sz.md;
  return(
    <div style={{display:"flex",gap:0,alignItems:"flex-end",position:"relative"}}>
      {tabs.map((t,i)=>{
        const isA=active===i; const dis=t.disabled;
        return(
          <div key={i} onClick={()=>!dis&&onChange?.(i)} style={{padding:`${s.py}px ${s.px}px`,fontSize:s.fs,fontWeight:isA?700:500,fontFamily:Fn.body,color:dis?C.textLight:isA?C.azulEscuro:C.cinzaChumbo,background:C.cardBg,borderRadius:"10px 10px 0 0",border:"none",cursor:dis?"not-allowed":"pointer",display:"flex",alignItems:"center",gap:7,whiteSpace:"nowrap",transition:"all .2s",opacity:dis?.45:1,position:"relative",zIndex:isA?3:1,boxShadow:isA?"0 -4px 12px rgba(0,42,104,.1)":"none"}}>
            {t.icon&&<span style={{display:"flex"}}>{typeof t.icon==="function"?t.icon(isA?C.azulEscuro:C.cinzaChumbo):t.icon}</span>}
            {t.label}
            {t.count!==undefined&&<span style={{minWidth:20,height:20,borderRadius:999,background:isA?(t.color||C.azulProfundo):`${C.cinzaChumbo}18`,color:isA?C.branco:C.cinzaChumbo,fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 6px",fontFamily:Fn.mono}}>{t.count}</span>}
            {t.dot&&<span style={{width:7,height:7,borderRadius:"50%",background:t.dotColor||C.verdeFloresta}}/>}
          </div>
        );
      })}
    </div>
  );
}
// USO: <TabsGuia tabs={[{label:"Todos"},{label:"Pendentes"},{label:"Aprovados"}]} active={0} onChange={setActive} />
