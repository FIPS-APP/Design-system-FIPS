/**
 * Tutoriais contextuais — textos detalhados por rota do DS-FIPS.
 * Cada step com `target` faz scroll + spotlight no elemento real da página.
 * Seletor padrão: `main section:nth-of-type(N)` para a N-ésima seção.
 */
export interface PageTutorialStep {
  title: string;
  description: string;
  /** Seletor CSS do elemento a destacar. Se omitido, modal centralizado. */
  target?: string;
}

/* Helper: seção N dentro de main */
const s = (n: number) => `main section:nth-of-type(${n})`;

export const PAGE_TUTORIALS: Record<string, PageTutorialStep[]> = {

  /* ═══════════════════ INÍCIO ═══════════════════ */

  home: [
    { title: "Bem-vindo ao Design System FIPS", description: "Esta é a página inicial. Vamos percorrer cada seção para que você entenda a estrutura completa da documentação.\n\nUse as setas ← → ou os botões para navegar." },
    { title: "01 · Objetivo", description: "O propósito do DS-FIPS: fonte única de verdade para design e desenvolvimento dos produtos digitais da Ferrovia Interna do Porto de Santos.\n\nGarante consistência visual, acessibilidade e identidade ferroviária em todas as interfaces.", target: s(1) },
    { title: "02 · Como funciona", description: "Três passos simples:\n1) Consultar — navegue pela documentação\n2) Importar — traga o componente do pacote\n3) Compor — monte a tela seguindo os padrões\n\nTokens e variantes já estão embutidos nos componentes.", target: s(2) },
    { title: "03 · Responsável", description: "O Time de Design & Engenharia FIPS governa o sistema.\n\nAs regras de contribuição estão na seção de Governança — qualquer novo componente ou variante passa por revisão antes de publicação.", target: s(3) },
    { title: "04 · Entradas", description: "O que você precisa fornecer ao usar o DS:\n• Requisitos da tela (tipo de padrão)\n• Dados do domínio\n• Contexto de uso (desktop/mobile)\n• Regras de negócio\n\nO Design System cuida do resto.", target: s(4) },
    { title: "05 · Processamento", description: "O que o DS faz automaticamente:\n• Resolve tokens (cores, tipografia, sombras) — 100%\n• Garante acessibilidade WCAG AA — 100%\n• Compõe layouts (shell, dashboard, listing) — 85%\n• Responsividade automática — 90%", target: s(5) },
    { title: "06 · Saídas", description: "O resultado: interfaces consistentes, código reutilizável e entregas rápidas.\n\nMenos tempo criando do zero, mais tempo no que importa ao negócio.", target: s(6) },
    { title: "07 · Regras de negócio", description: "5 regras inegociáveis:\n1) Use exclusivamente componentes e tokens do DS\n2) Override CSS proibido — use variantes e props\n3) Novos componentes passam por revisão\n4) Paleta segue o Brandbook FIPS\n5) Acessibilidade WCAG AA obrigatória", target: s(7) },
    { title: "08 · Procedimentos operacionais", description: "Para consumir: clone, importe de src/components/ui/, use variáveis CSS e siga os padrões.\n\nPara contribuir: crie branch, siga Governança, documente com exemplo interativo e abra PR.", target: s(8) },
    { title: "09 · Indicadores", description: "Métricas de adoção do DS:\n• 14+ componentes\n• 7 padrões de tela\n• 50+ tokens\n• 6 fundamentos documentados", target: s(9) },
    { title: "10 · Navegação rápida", description: "Links diretos para as principais seções: Visão geral, Fundamentos, Componentes, Padrões, Governança e Changelog.\n\nUse para saltar rapidamente para qualquer área da documentação.", target: s(10) },
  ],

  overview: [
    { title: "Visão Geral do DS-FIPS", description: "Panorama completo do Design System: princípios, paleta, tipografia, componentes e tokens. Ideal para onboarding." },
    { title: "01 · Princípios de design", description: "4 pilares que guiam todas as decisões:\n• Consistência — mesma linguagem visual em tudo\n• Acessibilidade — WCAG AA obrigatório\n• Eficiência — componentes prontos, sem retrabalho\n• Identidade Ferroviária — DNA do porto em cada tela", target: s(1) },
    { title: "02 · Paleta de cores", description: "Cores primárias (azul profundo, cinza chumbo), secundárias (céu, ouro, floresta) e neutros.\n\nTodas extraídas do Brandbook oficial da FIPS.", target: s(2) },
    { title: "03 · Tipografia", description: "Saira Expanded para títulos (personalidade industrial), Open Sans para corpo, Fira Code para valores técnicos.\n\nNunca substitua por outras fontes.", target: s(3) },
    { title: "04 · Elementos gráficos", description: "Ícones, ilustrações e grafismos que complementam a identidade visual do porto.\n\nSeguem as mesmas regras de cor e proporção do Brandbook.", target: s(4) },
    { title: "05 · Catálogo de componentes", description: "14+ componentes React documentados com playground interativo, variantes, estados e guia de uso.\n\nCada um pode ser importado diretamente do pacote.", target: s(5) },
    { title: "06 · Tokens globais", description: "Variáveis CSS para cores, tipografia, espaçamento, raios e sombras.\n\nUsadas por todos os componentes — garante que mudanças de tema propagam automaticamente.", target: s(6) },
    { title: "07 · Pacotes para IA", description: "Download de guias consolidados para ferramentas de IA.\n\nPermite que assistentes de código conheçam o DS e gerem código compatível.", target: s(7) },
  ],

  governance: [
    { title: "Governança do DS-FIPS", description: "As regras que garantem a integridade do Design System. Valem para todos: times internos, parceiros e projetos futuros." },
    { title: "01 · Princípios obrigatórios", description: "3 regras inegociáveis:\n\nRegra 1 — Use o componente, não invente: precisa de botão? Use Button do DS.\nRegra 2 — Não mude o visual por fora: proibido alterar borda, cor, fonte via CSS externo.\nRegra 3 — Evolua antes de usar: se o DS não cobre, crie a variante oficial primeiro.", target: s(1) },
    { title: "02 · Na prática", description: "Fluxo real de como construir uma tela:\n1) Consulte o catálogo\n2) Importe os componentes\n3) Use tokens (variáveis CSS)\n4) Siga os padrões de layout\n5) Se faltar algo, proponha antes de improvisar", target: s(2) },
    { title: "03 · Faça, pode fazer e nunca faça", description: "Guia rápido de decisão:\n✅ Faça: use componentes do DS, siga tokens\n🟡 Pode fazer: propor variantes, abrir issues\n❌ Nunca: CSS inline overriding, cores hardcoded, componentes caseiros", target: s(3) },
    { title: "04 · A regra de ouro", description: "Se uma tela existe na empresa, ela obrigatoriamente usa os componentes e tokens deste Design System.\n\nSem exceções. Sem atalhos.", target: s(4) },
    { title: "05 · Preciso de algo novo?", description: "Processo para propor novos componentes:\n1) Verifique se já existe algo parecido\n2) Documente a necessidade\n3) Crie a variante com exemplo\n4) Submeta para revisão do time\n5) Só depois de aprovado, use em produção", target: s(5) },
    { title: "06 · Checklist antes de publicar", description: "Antes de um componente entrar no DS:\n• Tem playground interativo?\n• Segue tokens de cor/tipografia/espaçamento?\n• Passa WCAG AA?\n• Funciona em light e dark mode?\n• Tem documentação de props e variantes?", target: s(6) },
    { title: "07 · Dark mode obrigatório", description: "Todo componente publicado deve funcionar em ambos os modos.\n\nTokens de dark mode definidos em globals.css via seletor .dark. Nunca use cores fixas — use variáveis CSS.", target: s(7) },
  ],

  /* ═══════════════════ FUNDAMENTOS ═══════════════════ */

  colors: [
    { title: "Fundamento: Cores", description: "Paleta oficial extraída do Brandbook FIPS. Vamos percorrer cada grupo de cores." },
    { title: "01 · Paleta principal", description: "Cores primárias e secundárias do Brandbook:\n• Azul Profundo #004B9B — marca principal\n• Azul Profundo Dark #002A68 — hover/ênfase\n• Cinza Chumbo #333B41 — texto principal\n• Céu #0090D0 — secundária\n• Ouro #FDC24E — accent\n• Floresta #00C64C — sucesso", target: s(1) },
    { title: "02 · Tokens semânticos", description: "Variáveis CSS mapeadas para a UI:\n--color-primary, --color-secondary, --color-accent, --color-success, --color-danger, --color-surface, --color-fg, --color-border.\n\nSempre use tokens, nunca hex direto.", target: s(2) },
    { title: "03 · Paleta Dark Mode", description: "Superfícies escuras (#222222), texto claro (#E2E2E8), bordas sutis (#2E2E2E).\n\nPrimary muda para #93BDE4, ring para #F6921E. Contraste garantido em WCAG AA.", target: s(3) },
    { title: "04 · Mapeamento Light → Dark", description: "Tabela comparativa mostrando como cada token light se transforma no dark mode.\n\nUse esta referência ao criar novos componentes para garantir consistência em ambos os modos.", target: s(4) },
  ],

  typography: [
    { title: "Fundamento: Tipografia", description: "3 famílias tipográficas com funções definidas. Percorra cada seção para entender a hierarquia." },
    { title: "01 · Famílias tipográficas", description: "Saira Expanded — títulos, headers, identidade industrial.\nOpen Sans — corpo de texto, formulários, UI geral.\nFira Code — código, valores técnicos, monospace.\n\nCada família tem função exclusiva — nunca misture.", target: s(1) },
    { title: "02 · Escala de tamanhos", description: "Do display (4xl–5xl) ao caption (xs):\n• Display: títulos hero\n• H1–H3: hierarquia de página\n• Body: texto corrido\n• Small/Caption: informações secundárias\n\nUse a escala documentada — tamanhos fora dela quebram hierarquia.", target: s(2) },
    { title: "03 · Pesos por contexto", description: "Cada contexto tem peso definido:\n• Heading: 700 (bold)\n• Body: 400 (regular)\n• Label: 600 (semibold)\n• Caption: 400\n\nNão use 900/black em texto corrido.", target: s(3) },
    { title: "04 · Hierarquia visual", description: "Demonstração da escala completa aplicada numa página real.\n\nNote como cada nível tem tamanho, peso e espaçamento distintos para criar ritmo visual.", target: s(4) },
    { title: "05 · Line-height", description: "Valores de line-height por contexto:\n• Headings: 1.1–1.2 (tight)\n• Body: 1.5–1.65 (comfortable)\n• UI/Labels: 1.2–1.3\n\nLH correto evita texto apertado ou espaçado demais.", target: s(5) },
    { title: "06 · Regras de uso", description: "Regras práticas:\n• Tracking tight (-0.03em) em H1/H2\n• Uppercase com tracking 0.02em em labels\n• Nunca use ALL CAPS em body text\n• Itálico apenas para citações, nunca para ênfase", target: s(6) },
    { title: "07 · Tokens de referência", description: "Variáveis CSS e classes Tailwind para cada estilo tipográfico.\n\nUse font-heading, font-sans, font-mono — nunca declare font-family inline.", target: s(7) },
    { title: "08 · Dark Mode", description: "No dark mode a cor do texto muda (--color-fg: #E2E2E8) mas tamanhos e pesos permanecem.\n\nContraste mínimo 4.5:1 em body text, 3:1 em headings grandes.", target: s(8) },
  ],

  spacing: [
    { title: "Fundamento: Espaçamento", description: "Escala de 8 valores baseada em múltiplos de 4px." },
    { title: "01 · Escala visual", description: "8 valores:\n• xs (4px) — gap ícone-badge\n• sm (8px) — gap entre badges\n• md (12px) — padding input\n• lg (16px) — padding card mobile\n• xl (20px) — padding card desktop\n• 2xl (24px) — padding modal\n• 3xl (32px) — gap entre seções\n• 4xl (40px) — margin grande", target: s(1) },
  ],

  radius: [
    { title: "Fundamento: Raios", description: "Border-radius simétricos e o Elemento Caixa assimétrico — assinatura FIPS." },
    { title: "01 · Escala simétrica", description: "Do zero ao circular:\n• none (0) — separadores\n• xs (4px) — badges, chips\n• sm (6px) — botões compactos\n• md (8px) — inputs, selects\n• lg (10px) — cards internos\n• xl (14px) — containers\n• pill (20px) — pills, tags\n• full (50%) — avatares, dots", target: s(1) },
    { title: "02 · Elemento Caixa", description: "Assinatura do Brandbook FIPS: canto inferior esquerdo maior que os demais.\n\nInspirado nos contornos dos vagões ferroviários. Usado em cards, tabelas e modais.\n\nEx: border-radius: 10px 10px 10px 18px;", target: s(2) },
  ],

  shadows: [
    { title: "Fundamento: Sombras", description: "6 níveis de elevação com cor azul FIPS — nunca preto puro." },
    { title: "01 · Escala visual", description: "6 níveis de elevação:\n0 — Nenhuma (flat)\n1 — Card (sutil)\n2 — Elevated (moderada)\n3 — Dropdown/Guia ativa\n3 — Floating (destaque)\n4 — Modal (máxima)\n\nCada componente tem seu nível definido.", target: s(1) },
  ],

  icons: [
    { title: "Fundamento: Iconografia", description: "React Icons com Lucide como família padrão." },
    { title: "01 · Biblioteca de ícones", description: "27 ícones selecionados do Lucide, organizados por categoria:\n• Navegação (Home, Grid, Lista, etc.)\n• Ações (Filtro, Configuração, Busca)\n• Status (Check, Alert, Info)\n\nTroque o tamanho no seletor (14–24px). Use 20px como padrão.", target: s(1) },
  ],

  /* ═══════════════════ COMPONENTES ═══════════════════ */

  button: [
    { title: "Componente: Button", description: "Catálogo visual de ações, estados e composições reais do DS-FIPS. Vamos percorrer cada seção." },
    { title: "01 · Variantes do sistema", description: "10 variantes, cada uma com intenção clara:\n• Primary (#004B9B) — ação principal\n• Secondary — ação secundária\n• Outline — borda sem fundo\n• Ghost — sem borda, sem fundo\n• Accent (#F6921E) — destaque\n• Success (#00C64C) — salvar/gravar\n• Danger (#DC3545) — excluir/destrutivo\n• Link — como texto clicável\n\nPasse o mouse para ver hover.", target: s(1) },
    { title: "02 · Guia de uso por variante", description: "Para cada variante: quando usar, quando NÃO usar, e exemplo real de contexto.\n\nPrimary = 1 por tela (ação principal). Success = sempre para salvar dados. Danger = sempre com confirmação.", target: s(2) },
    { title: "03 · Tamanhos", description: "5 tamanhos: sm, md, lg, icon e iconSm.\n\nmd é o padrão. sm para toolbars e tabelas. lg para CTAs hero. icon/iconSm para botões só com ícone.", target: s(3) },
    { title: "04 · Estados", description: "Estados interativos:\n• Default — aparência normal\n• Hover — feedback visual\n• Focus — ring de acessibilidade\n• Disabled — opacidade reduzida\n• Loading — spinner substituindo texto", target: s(4) },
    { title: "05 · Composições com ícone", description: "Botões com ícone à esquerda, à direita ou só ícone.\n\nUse leftIcon/rightIcon como ReactNode. Para botão só-ícone, use size='icon' ou 'iconSm'.", target: s(5) },
    { title: "06 · Cenários de negócio", description: "Exemplos reais de uso no contexto FIPS:\n• Toolbar de ações (editar, excluir, duplicar)\n• Footer de modal (cancelar + salvar)\n• Hero CTA (explorar componentes)\n• Filtros e chips de ação", target: s(6) },
    { title: "07 · Tokens de referência", description: "Cores, raios, sombras e pesos tipográficos usados pelo Button.\n\nTudo definido em button-variants.ts via CVA (class-variance-authority).\n\nNunca estilize localmente — use as variantes existentes.", target: s(7) },
    { title: "08 · Modo Dark", description: "No dark mode, as cores se ajustam automaticamente via tokens.\n\nPrimary fica mais claro, borders mais sutis, hover mantém contraste. Tudo via variáveis CSS.", target: s(8) },
  ],

  field: [
    { title: "Componente: Field", description: "Composição oficial de formulário: label + input + helper + mensagem de erro." },
    { title: "01 · Cadastro desktop de referência", description: "Formulário completo usando Field como camada de composição.\n\nCada campo é Field + componente base (Input, Select, Textarea). Nunca monte campos com combinações soltas.", target: s(1) },
  ],

  input: [
    { title: "Componente: Input", description: "Campos de entrada do DS-FIPS com ícone contextual, borda arredondada e estados visuais claros." },
    { title: "01 · Formulário padrão", description: "Padrão oficial: cada input tem ícone contextual à esquerda que reforça o tipo de dado esperado.\n\nNome do cliente (User), Email (Mail), Busca (Search), Data (Calendar).", target: s(1) },
    { title: "02 · Anatomia do label", description: "Estrutura do label: texto + asterisco vermelho para obrigatórios.\n\nHelper text abaixo em cinza muted. Mensagem de erro em vermelho quando aria-invalid.", target: s(2) },
    { title: "03 · Sistema de ícones", description: "Catálogo de ícones por tipo de campo:\n• Texto: User, Building, FileText\n• Numérico: Hash, DollarSign\n• Data: Calendar, Clock\n• Busca: Search, Filter\n\nSempre à esquerda, 16px, stroke 1.5.", target: s(3) },
    { title: "04 · Guia de uso por tipo", description: "Para cada tipo de input: quando usar, placeholder recomendado, ícone padrão e máscara se aplicável.\n\nCPF, CNPJ, telefone, CEP, moeda — cada um com formato definido.", target: s(4) },
    { title: "05 · Estados interativos", description: "4 estados visuais:\n• Default — borda #CBD5E1\n• Foco — borda #004B9B + ring\n• Erro — borda #DC3545 + mensagem\n• Bloqueado — fundo #F1F5F9, cursor not-allowed", target: s(5) },
    { title: "06 · Tamanhos", description: "Default (h-10, py-2.5) e Compact (h-8, py-1.5).\n\nUse default em formulários normais. Compact em modais, toolbars e tabelas editáveis.", target: s(6) },
    { title: "07 · Modo compacto de modal", description: "Em modais e drawers, use density='compact' para economizar espaço vertical.\n\nO input fica menor mas mantém todos os estados e acessibilidade.", target: s(7) },
    { title: "08 · Cenários de negócio", description: "Exemplos reais:\n• Cadastro de cliente (nome, CNPJ, email, telefone)\n• Busca global com autocomplete\n• Filtro de data com range picker\n• Campo monetário com máscara R$", target: s(8) },
    { title: "09 · Tokens de referência", description: "Cores de borda, foco, erro; raio (rounded-xl), padding, font-size.\n\nTudo definido no componente Input — nunca sobreescreva com CSS.", target: s(9) },
    { title: "10 · Modo Dark", description: "Surface escuro, bordas sutis (#2E2E2E), texto claro.\n\nFoco muda para ring laranja (#F6921E). Placeholder com opacidade ajustada.", target: s(10) },
  ],

  select: [
    { title: "Componente: Select", description: "8 tipos de seleção para cobrir qualquer cenário." },
    { title: "01 · Tipos de seleção", description: "8 componentes interativos:\n• Select dropdown — escolha única\n• Autocomplete — busca com 15+ opções\n• Multi-select — seleção múltipla\n• Checkbox — opções em lista\n• Radio — escolha exclusiva\n• Toggle — on/off\n• Chips — tags selecionáveis\n• Segmented — controle segmentado", target: s(1) },
    { title: "02 · Guia de uso por tipo", description: "Quando usar cada um:\n• ≤5 opções → Radio ou Select\n• 6–15 opções → Select dropdown\n• 15+ opções → Autocomplete\n• Sim/Não → Toggle\n• Múltipla seleção → Checkbox ou Multi\n• Modo de visualização → Segmented", target: s(2) },
    { title: "03 · Cenários de negócio", description: "Exemplos do contexto FIPS:\n• Departamento → Select\n• Status do pedido → Segmented\n• Notificações → Checkbox\n• Busca de fornecedor → Autocomplete\n• Modo escuro → Toggle", target: s(3) },
    { title: "04 · Tokens de referência", description: "Cores de borda, dropdown, hover, selected. Mesmo padrão visual do Input.\n\nDropdown com shadow-dropdown e border-radius seguindo a escala.", target: s(4) },
    { title: "05 · Modo Dark", description: "Dropdown com fundo escuro, hover azulado sutil, texto claro.\n\nToggle muda cor de ativo para primary dark.", target: s(5) },
  ],

  textarea: [
    { title: "Componente: Textarea", description: "Área de texto expandível com 3 variantes." },
    { title: "01 · Tipos de textarea", description: "3 variantes:\n• Padrão — resize manual pelo canto\n• Com contador — mostra caracteres restantes (maxLength)\n• Auto-resize — cresce conforme digitação\n\nDigite nos campos para testar cada comportamento.", target: s(1) },
  ],

  badge: [
    { title: "Componente: Badge", description: "Etiquetas compactas para status, categorias e tags." },
    { title: "01 · Vitrine de variantes", description: "7 variantes semânticas:\n• Padrão (azul) — default\n• Secundário (cinza) — neutro\n• Sucesso (verde) — aprovado/ativo\n• Atenção (laranja) — pendente\n• Crítico (vermelho) — urgente/erro\n• Contorno — borda sem fundo\n• Informativo (azul claro) — dica\n\n+ Com dot indicador, com ícone, contadores.", target: s(1) },
  ],

  card: [
    { title: "Componente: Card", description: "Container base com duas famílias: Dashboard e Relatório." },
    { title: "01 · Card KPI com area chart", description: "Para dashboards operacionais: número grande + variação % + mini gráfico de tendência.\n\nÍcone padrão DS no canto superior direito. 4 cards lado a lado no padrão Dashboard.", target: s(1) },
    { title: "02 · Card Status com donut", description: "Gráfico donut mostrando proporção (ex: 75% concluído).\n\nÚtil para metas, SLAs e indicadores de completude.", target: s(2) },
    { title: "03 · Card Relatório", description: "Informação descritiva + badges de status + ações.\n\nPara listas de itens com ações contextuais (ver detalhes, editar, etc.).", target: s(3) },
    { title: "04 · Card Princípio", description: "Layout para exibir princípios, regras ou diretrizes.\n\nÍcone + título + descrição + número da regra.", target: s(4) },
    { title: "05 · Card de Resumo e Ação", description: "Resumo compacto com botão de ação primária.\n\nUse em dashboards quando há uma ação clara a tomar.", target: s(5) },
    { title: "06 · Card de Lista", description: "Lista interna com items, ideal para atividades recentes ou notificações.\n\nCada item com ícone, título e timestamp.", target: s(6) },
    { title: "07 · Guia de uso", description: "Quando usar cada tipo de card e combinações recomendadas.\n\nDashboard → KPI + Status. Listing → Relatório. Governança → Princípio + Regra.", target: s(7) },
    { title: "08 · Cenários de negócio", description: "Cards aplicados no contexto FIPS:\n• Dashboard de requisições\n• Painel de aprovações\n• Cards de fornecedores\n• Métricas de produção", target: s(8) },
    { title: "09 · Tokens de referência", description: "Border-radius 2xl (16px), shadow-card, padding 20–24px.\n\nBackground: --color-surface. Border: --color-border.", target: s(9) },
    { title: "10 · Card Regra", description: "Variante especial para as 3 regras da Governança.\n\nÍcone colorido + número da regra + título + descrição.", target: s(10) },
    { title: "11 · Modo Dark", description: "Surface #222222, border #2E2E2E, shadow ajustado.\n\nGráficos mantêm cores semânticas com opacidade ajustada.", target: s(11) },
  ],

  tabs: [
    { title: "Componente: Tabs", description: "Navegação por abas com indicador deslizante." },
    { title: "01 · Playground interativo", description: "Clique nas abas — o indicador laranja (#F6921E) desliza suavemente.\n\nConteúdo aparece com fade. Hover muda o fundo da aba.", target: s(1) },
    { title: "02 · Variantes visuais", description: "4 variantes para diferentes contextos:\n• Underline (padrão) — indicador abaixo\n• Pill — fundo preenchido na aba ativa\n• Contained — cards como abas\n• Vertical — empilhadas lateralmente", target: s(2) },
  ],

  table: [
    { title: "Componente: Table", description: "Tabela de dados com ordenação, seleção e composições ricas." },
    { title: "01 · Playground interativo", description: "Tabela completa com:\n• Checkbox de seleção por linha\n• Ordenação por coluna (clique no header)\n• Badges de status\n• Progress bars de SLA\n• Ações por linha (ver, editar)\n• Paginação\n\nInteraja com todos os elementos.", target: s(1) },
  ],

  dialog: [
    { title: "Componente: Modal (Dialog)", description: "6 tipos de modal para diferentes situações." },
    { title: "01 · Playground interativo", description: "Clique nos botões para abrir cada tipo de modal:\n• Confirmação (verde) — ações positivas\n• Destrutivo (vermelho) — exclusão com confirmação\n• Alerta (laranja) — avisos importantes\n• Informativo (azul) — mensagens\n• Formulário — edição de dados\n• Lista — seleção de itens\n\nESC ou clique no overlay fecha.", target: s(1) },
    { title: "02 · Guia de uso por tipo", description: "Para cada tipo: quando usar, hierarquia de botões, tom da mensagem.\n\nDestrutivo SEMPRE pede confirmação explícita. Informativo nunca tem ação destrutiva.", target: s(2) },
    { title: "03 · Anatomia do Modal", description: "Estrutura obrigatória:\n1) Overlay com blur\n2) Card com border-radius Caixa\n3) Header (título + botão fechar)\n4) Body (conteúdo scrollável)\n5) Footer (ações alinhadas à direita)\n\nBaseado em Radix Dialog — acessibilidade nativa.", target: s(3) },
    { title: "04 · Acessibilidade e teclado", description: "• ESC fecha o modal\n• Tab navega entre elementos focáveis\n• Focus trap — foco não sai do modal\n• aria-modal, aria-labelledby\n• Botão X sempre acessível", target: s(4) },
    { title: "05 · Faça e evite", description: "✅ Faça: título claro, ação principal destacada, overlay para contexto\n❌ Evite: modais em cima de modais, textos longos no body, mais de 3 botões", target: s(5) },
    { title: "06 · Tamanhos", description: "sm (420px), md (520px), lg (680px), xl (800px).\n\nUse sm para confirmações, md para formulários curtos, lg para formulários completos.", target: s(6) },
    { title: "07 · UX refinados", description: "Detalhes que fazem a diferença:\n• Animação spring na entrada\n• Overlay com blur progressivo\n• Focus no primeiro input ao abrir\n• Botão primário alinhado à direita", target: s(7) },
    { title: "08 · Tokens de referência", description: "Overlay: rgba(0,0,0,0.5) + backdrop-blur.\nCard: shadow-modal, radius Caixa.\nHeader: border-bottom sutil.\nBotões: variantes do Button component.", target: s(8) },
    { title: "09 · Modo Dark", description: "Overlay mais escuro, card com surface #232328.\n\nBordas e separadores com white/8%. Botão fechar com hover laranja.", target: s(9) },
  ],

  drawer: [
    { title: "Componente: Drawer", description: "Painel lateral deslizante para detalhes, formulários e filtros." },
    { title: "01 · Playground interativo", description: "5 variantes por direção e tamanho:\n• Detalhe (right 420px) — ficha de registro\n• Filtros (left 360px) — painel de filtros\n• Ação rápida (bottom 280px) — mobile actions\n• Edição larga (right 560px) — form completo\n• Ocorrência (right 340px) — side note\n\nClique para abrir cada um.", target: s(1) },
    { title: "02 · Tamanhos", description: "Larguras recomendadas por uso:\n• 280–340px — informação rápida\n• 360–420px — detalhes e filtros\n• 480–560px — formulários completos\n\nNunca ultrapasse 60% da viewport.", target: s(2) },
  ],

  header: [
    { title: "Componente: Header", description: "Barra superior do shell de documentação." },
    { title: "01 · Finalidade", description: "O header ancora o usuário na hierarquia (grupo → página).\n\nOferece busca, navegação rápida entre seções e acesso a utilitários (notificações, tutorial, tema).", target: s(1) },
    { title: "02 · Anatomia", description: "Da esquerda para a direita:\n• Controle de menu (mobile)\n• Ícone de painel\n• Coluna de título (eyebrow + H2)\n• Busca (md+)\n• Botões neumórficos\n• Chip de conta\n\nAbaixo: trilho de tabs (39px).", target: s(2) },
    { title: "03 · Tokens e comportamento", description: "Sticky com blur sobre o hero.\n\nArte hero-train-silhouette.svg com lavagem #002A68/#004B9B.\n\nFaixas de vidro white/6–16%. Título: font-heading + text-lg font-semibold.", target: s(3) },
    { title: "04 · Espaçamentos da barra de tabs", description: "Medidas obrigatórias (referência Governança TI v1.1.1):\n• Altura nav: 39px\n• Padding tab: 8px vertical, 24px horizontal\n• Font: 13px, weight 600/400\n• Indicador: 3px, #F6921E\n• Border-bottom: 2px\n• Wrapper: pt-0 pb-0", target: s(4) },
    { title: "05 · Implementação de referência", description: "Arquivos-chave:\n• Shell: src/app/DocLayout.tsx\n• Header visual: DocHeaderStandard.tsx\n• Tabs: DocHeaderSectionNav.tsx\n• Botão neumórfico: DocHeaderNeuIconButton.tsx\n• Tokens: docHeaderChrome.ts", target: s(5) },
    { title: "06 · Modo Dark", description: "Header bg: linear-gradient(#004B9B, #002A68) → linear-gradient(#0F1923, #0A1119).\n\nTab ativa: #FFFFFF → #D1D9E8. Tab inativa: rgba(255,255,255,0.55) → rgba(255,255,255,0.4).\n\nSearch bg: rgba(255,255,255,0.1) → rgba(255,255,255,0.06).", target: s(6) },
  ],

  sidebar: [
    { title: "Componente: Sidebar", description: "Navegação lateral do DS-FIPS com tile neumórfico 3D, shimmer, auto-colapso e estado ativo por rota. Vamos percorrer cada seção." },
    { title: "01 · Playground interativo", description: "Demo funcional completa:\n• Clique nos itens para simular navegação\n• Abra submenus (PADRÕES, FUNDAMENTOS, COMPONENTES)\n• Veja badges de notificação nos itens\n• No colapsado, passe o mouse para tooltip\n• Abra 'Modo menu' para configurar auto-colapso\n\nA rota ativa aparece à direita.", target: s(1) },
    { title: "02 · Dark Mode", description: "Mesma sidebar com tema escuro:\n• Fundo #1A1A1A (ao invés de #002A68)\n• Tiles neumórficos com sombras adaptadas\n• Bordas #3f3f46\n• Tooltip cinza escuro\n• Accent laranja mantido\n\nCompare os dois playgrounds lado a lado.", target: s(2) },
    { title: "03 · Arquitetura funcional", description: "4 camadas de responsabilidade:\n1) Domínio — fonte única para itens, rotas, ícones, badges\n2) Motor de estado — collapsed/expanded, submenus, item ativo\n3) SidebarNeuIcon36 — visual 3D, specular, shimmer\n4) Integração app — roteador, permissões, telemetria\n\nEstados do tile: Idle → Hover → Ativo → Modo menu.", target: s(3) },
    { title: "04 · Blueprint de implementação", description: "Fluxo do zero ao release:\n1) Contrato de dados (tipo com id, href, icon, badge)\n2) Motor de visibilidade (permissions + feature flags)\n3) Estado ativo por rota (useLocation, nunca por clique)\n4) Hover = affordance visual (laranja 3D + shimmer)\n5) Auto-colapso (1–30s, switch liga/desliga)\n6) Telemetria (eventos de clique e abertura)\n\n+ Riscos e anti-patterns documentados.", target: s(4) },
    { title: "05 · Tokens e governança", description: "Mapa completo de tokens:\n• Superfície: bg #002A68, border rgba(255,255,255,0.06)\n• Hover/Ativo: gradient laranja 3D, glow rgba(246,146,30,0.42)\n• Dimensões: 256px expandido, 68px colapsado, tile 36×36\n• Motion: shimmer 0.5s, loop 2.8s, collapse 0.25s\n• Modal: max-w-lg, rounded-2xl, padrão DS Dialog\n\nContraste mínimo AA em todos os estados.", target: s(5) },
  ],

  toast: [
    { title: "Componente: Toast", description: "Notificações temporárias no canto superior direito." },
    { title: "01 · Playground interativo", description: "6 tipos — clique para disparar:\n• Sucesso (verde) — ação completada\n• Erro (vermelho) — falha\n• Atenção (laranja) — aviso\n• Info (azul) — informação\n• Neutro (cinza) — genérico\n• Com ação — botão dentro do toast\n\nTimer visual diminui até auto-dismiss. X fecha imediatamente.", target: s(1) },
  ],

  tooltip: [
    { title: "Componente: Tooltip", description: "Informação contextual ao passar o mouse." },
    { title: "01 · Posições", description: "4 posições: top (padrão), bottom, left, right.\n\nPasse o mouse sobre cada botão para ver o tooltip na posição indicada.\n\nUse top como padrão. Outras posições quando top é cortado pelo viewport.", target: s(1) },
  ],

  progress: [
    { title: "Componente: Progress", description: "Barra de progresso para workflows e indicadores." },
    { title: "01 · Playground interativo", description: "Arraste o slider para testar todas as variantes em tempo real:\n• Linear grande — barras de workflow\n• Linear médio — progresso de formulário\n• Circular — indicador compacto\n• Steps — etapas discretas\n• Micro — inline em tabelas\n\nValor sincronizado entre todas as variantes.", target: s(1) },
  ],

  /* ═══════════════════ PADRÕES ═══════════════════ */

  "application-shell": [
    { title: "Padrão: Application Shell", description: "Shell base obrigatório para todos os produtos FIPS." },
    { title: "Regras estruturais", description: "3 regras:\n1) Estrutura fixa — sidebar + header + hero + conteúdo, sempre nessa ordem\n2) Layout base de todo produto — consistência entre módulos\n3) Responsividade em 3 faixas — desktop (sidebar fixa), tablet (rail compacto), mobile (drawer)\n\nTodo produto FIPS parte deste shell.", target: s(1) },
  ],

  dashboard: [
    { title: "Padrão: Dashboard", description: "Painel operacional com KPIs, gráficos e tabela." },
    { title: "Estrutura do Dashboard", description: "Sequência obrigatória:\n1) Filtros (Área, Ano, Mês, Solicitante, Prioridade, Status)\n2) 4 Cards KPI com area chart de tendência\n3) Gráficos (barras por mês + rosca por status)\n4) Tabela resumo com paginação\n\nUse este padrão para qualquer visão consolidada.", target: s(1) },
  ],

  "data-listing": [
    { title: "Padrão: Data Listing", description: "Painel completo para listagem de dados administrativos." },
    { title: "Estrutura do Data Listing", description: "Sequência obrigatória:\n1) Header azul (ícone + título + subtítulo + ação primária)\n2) 4 Cards KPI com tendência\n3) Toolbar (busca + filtros + colunas)\n4) Tabela com ordenação, seleção, badges, ações e paginação\n\nUse sempre que precisar listar dados com ações.", target: s(1) },
  ],

  "form-workspace": [
    { title: "Padrão: Form Workspace", description: "Workspace de formulário para fluxos densos." },
    { title: "Estrutura do Form Workspace", description: "Componentes:\n1) Header azul com resumo (obrigatórios, locais, cadeia, RC SAP)\n2) Barra de progresso (% preenchido)\n3) Seções de formulário com Field + controle base\n4) Painel contextual lateral\n\nTodos os campos usam a composição oficial Field.", target: s(1) },
  ],

  "modal-workflow": [
    { title: "Padrão: Modal Workflow", description: "Modal com abas segmentadas para criação e edição." },
    { title: "Estrutura do Modal Workflow", description: "3 blocos obrigatórios:\n1) Header (ícone + título + subtítulo)\n2) Corpo com abas segmentadas + campos em grid 2 colunas\n3) Footer com ações (cancelar + salvar)\n\nExtras: prioridade com dots, slider de progresso, chips de responsável, área de anexos.\n\nClique 'Nova Tarefa' para ver o modal em ação.", target: s(1) },
  ],

  hero: [
    { title: "Padrão: Hero", description: "Header adaptativo glass-to-white exclusivo da Home." },
    { title: "Regras do Hero", description: "3 regras:\n1) Header glass transparente sobre a imagem do hero\n2) Exclusivo da página Home — demais rotas usam header branco estático\n3) Transição suave ao rolar (glass → branco sólido em 300ms após 60px)\n\nNunca aplique glass fora da Home.", target: s(1) },
  ],

  "hero-banner": [
    { title: "Padrão: Banner", description: "3 variantes de banner padronizado." },
    { title: "Variantes de Banner", description: "3 tipos:\n1) Banner de Página — hero completo com título grande, badges e arte decorativa (landing pages)\n2) Banner de Conteúdo — faixa compacta com ícone + título + botão (cabeçalhos de módulo)\n3) Banner de Fluxo — badges de status + cadeia de etapas (Solicitação → Aprovação → Entrega)\n\nDegradê azul institucional obrigatório como fundo. PatternPanelHero cobre Banner de Conteúdo 2 com chips de KPI.", target: s(1) },
  ],

  switch: [
    { title: "Switch DS-FIPS", description: "Toggle 42×24px com Radix. Estados on/off e disabled." },
    { title: "SettingsPreferenceRow", description: "Linha de preferência com label, descrição opcional e switch — padrão usado em Configurações do FIPS Suprimentos. Variante info para destaque de e-mail.", target: s(2) },
  ],

  configuracoes: [
    { title: "Padrão: Configurações", description: "Referência do módulo FIPS Suprimentos — FipsTabBar + cards + preference rows." },
    { title: "FipsTabBar", description: "Abas segmentadas Notificações · Backup · Sistema. Radius assimétrico 10px 10px 10px 18px no container.", target: "section" },
  ],

  "relatorios-operacionais": [
    { title: "Relatórios operacionais", description: "PatternPanelHero + filtros + tabela + export CSV — escopos de Suprimentos." },
  ],

  "export-modal": [
    { title: "Export Modal", description: "Preview de exportação com colunas arrastáveis, filtros em chips e ações XLSX/PDF/Impressão." },
  ],

  login: [
    { title: "Padrão: Login", description: "Tela de autenticação do sistema FIPS." },
    { title: "Playground interativo", description: "Login V1 completo:\n• Painel de branding à esquerda (slogan + imagem do porto)\n• Formulário liquid glass à direita\n• Filtro background padrão 1 (degradê azul escuro)\n• Borda animada dourada no card\n• Ícones amarelos, textos brancos\n• Toggle de senha (olho)\n• Validação CS/Email", target: s(1) },
  ],

  changelog: [
    { title: "Changelog do DS-FIPS", description: "Histórico de evolução do Design System.\n\n• v0.4.2 (2026-04-07) — Catálogo expandido, 14+ componentes, Dashboard, distribuição para IA\n• v0.3.0 (2026-04-01) — Shell consolidado, PageHero, Field, governança\n\nConsulte antes de atualizar dependências." },
  ],
};
