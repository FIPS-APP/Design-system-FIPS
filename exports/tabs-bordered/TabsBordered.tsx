// DS-FIPS — Tabs (Bordered) — Copy-paste ready
const C={azulProfundo:"var(--color-gov-azul-profundo)",azulEscuro:"var(--color-gov-azul-escuro)",cinzaChumbo:"var(--color-fg-muted)",cinzaEscuro:"var(--color-fg)",cinzaClaro:"#C0CCD2",amareloEscuro:"#F6921E",branco:"#FFFFFF",cardBorder:"var(--color-border)",textLight:"var(--color-fg-muted)",verdeFloresta:"#00C64C"};
const Fn={body:"'Open Sans',sans-serif",mono:"'Fira Code',monospace"};

export function TabsBordered({tabs=[],active=0,onChange,size="md",vertical=false}){
  const sz={sm:{fs:12,py:7,px:14},md:{fs:13,py:9,px:16},lg:{fs:14,py:11,px:20}};
  const s=sz[size]||sz.md;
  return(
    <div style={{display:"flex",flexDirection:vertical?"column":"row",gap:vertical?1:4,flexWrap:vertical?"nowrap":"wrap"}}>
      {tabs.map((t,i)=>{
        const isA=active===i; const dis=t.disabled;
        return(
          <div key={i} onClick={()=>!dis&&onChange?.(i)} style={{padding:`${s.py}px ${s.px}px`,fontSize:s.fs,fontWeight:isA?600:400,fontFamily:Fn.body,color:dis?C.textLight:isA?C.azulProfundo:C.cinzaChumbo,background:isA?"rgba(0,75,155,0.02)":"transparent",border:vertical?"none":`1px solid ${isA?"rgba(0,75,155,0.19)":C.cardBorder}`,borderLeft:vertical?`2px solid ${isA?C.amareloEscuro:"transparent"}`:undefined,borderRadius:vertical?"0 6px 6px 0":6,cursor:dis?"not-allowed":"pointer",display:"flex",alignItems:"center",gap:7,whiteSpace:"nowrap",transition:"all .2s",opacity:dis?.45:1}}>
            {t.icon&&<span style={{display:"flex",color:isA?C.amareloEscuro:C.cinzaChumbo}}>{typeof t.icon==="function"?t.icon(isA?C.azulProfundo:C.cinzaChumbo):t.icon}</span>}
            {t.label}
            {t.count!==undefined&&<span style={{minWidth:18,height:18,borderRadius:999,background:isA?C.azulProfundo:`${C.cinzaChumbo}15`,color:isA?C.branco:C.cinzaChumbo,fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 5px",fontFamily:Fn.mono,marginLeft:vertical?"auto":0}}>{t.count}</span>}
            {t.dot&&<span style={{width:6,height:6,borderRadius:"50%",background:t.dotColor||C.verdeFloresta,marginLeft:vertical?"auto":0}}/>}
          </div>
        );
      })}
    </div>
  );
}
// USO: <TabsBordered tabs={[{label:"Perfil"},{label:"Segurança"},{label:"Notificações",count:3}]} active={0} onChange={setActive} vertical />
