// DS-FIPS — Tabs (Filled) — Copy-paste ready
const C={azulProfundo:"var(--color-gov-azul-profundo)",cinzaChumbo:"var(--color-fg-muted)",cinzaEscuro:"var(--color-fg)",cinzaClaro:"#C0CCD2",branco:"#FFFFFF",bg:"var(--color-surface-muted)",textLight:"var(--color-fg-muted)"};
const Fn={body:"'Open Sans',sans-serif",mono:"'Fira Code',monospace"};

export function TabsFilled({tabs=[],active=0,onChange,size="md"}){
  const sz={sm:{fs:12,py:7,px:14},md:{fs:13,py:9,px:18},lg:{fs:14,py:11,px:22}};
  const s=sz[size]||sz.md;
  return(
    <div style={{display:"flex",gap:6,background:C.bg,padding:4,borderRadius:10,flexWrap:"wrap"}}>
      {tabs.map((t,i)=>{
        const isA=active===i; const dis=t.disabled;
        return(
          <div key={i} onClick={()=>!dis&&onChange?.(i)} style={{padding:`${s.py}px ${s.px}px`,fontSize:s.fs,fontWeight:isA?700:500,fontFamily:Fn.body,color:dis?C.textLight:isA?C.branco:C.cinzaEscuro,background:isA?C.azulProfundo:"transparent",borderRadius:7,cursor:dis?"not-allowed":"pointer",display:"flex",alignItems:"center",gap:6,whiteSpace:"nowrap",transition:"all .25s",opacity:dis?.45:1,boxShadow:isA?"0 2px 8px rgba(0,75,155,.25)":"none"}}>
            {t.icon&&<span style={{display:"flex"}}>{typeof t.icon==="function"?t.icon(isA?C.branco:C.cinzaEscuro):t.icon}</span>}
            {t.label}
            {t.count!==undefined&&<span style={{minWidth:18,height:18,borderRadius:999,background:isA?`${C.branco}30`:C.cinzaClaro,color:isA?C.branco:C.cinzaChumbo,fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 5px",fontFamily:Fn.mono}}>{t.count}</span>}
          </div>
        );
      })}
    </div>
  );
}
// USO: <TabsFilled tabs={[{label:"Todas",count:23},{label:"Ativas",count:8}]} active={0} onChange={setActive} />
