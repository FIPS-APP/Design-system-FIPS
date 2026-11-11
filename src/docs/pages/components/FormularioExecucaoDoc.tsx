import { useState, type ReactNode } from 'react'
import { ClipboardCheck, Pencil, Save, Send, ShieldCheck } from 'lucide-react'
import { DocPage, DemoSection } from '../../components/DocPage'
import { SecaoNumerada } from '../../../components/composites/SecaoNumerada'
import { BarraAcoesRodape, EstadoSalvamento, type BarraAcoesRodapeVariante, type EstadoSalvamentoValor } from '../../../components/composites/BarraAcoesRodape'
import { SegmentoAvaliacao, type OpcaoAvaliacao } from '../../../components/composites/SegmentoAvaliacao'
import { AssinaturaCanvas } from '../../../components/composites/AssinaturaCanvas'
import { CardChecklist } from '../../../components/composites/CardChecklist'
import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import { OPCOES_INSPECAO } from '../../data/opcoes-inspecao'

const SIM_NAO: OpcaoAvaliacao[] = [
  { valor: 'SIM', rotulo: 'Sim', tom: 'sucesso' },
  { valor: 'NAO', rotulo: 'Não', tom: 'critico' },
  { valor: 'NA', rotulo: 'NA', tom: 'neutro' },
]

function Tabela({ linhas }: { linhas: [string, string, string][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
      <table className="w-full min-w-[34rem] text-left text-xs">
        <thead className="bg-[var(--color-surface-muted)] text-[var(--color-fg)]">
          <tr>
            <th className="px-3 py-2 font-semibold">Prop</th>
            <th className="px-3 py-2 font-semibold">Tipo</th>
            <th className="px-3 py-2 font-semibold">O que faz</th>
          </tr>
        </thead>
        <tbody className="text-[var(--color-fg-muted)]">
          {linhas.map(([p, t, d]) => (
            <tr key={p} className="border-t border-[var(--color-border)] align-top">
              <td className="px-3 py-2 font-mono text-[var(--color-fg)]">{p}</td>
              <td className="px-3 py-2 font-mono">{t}</td>
              <td className="px-3 py-2">{d}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Codigo({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4 text-xs leading-relaxed text-[var(--color-fg)]">
      {children}
    </pre>
  )
}

function Nota({ children }: { children: ReactNode }) {
  return <p className="max-w-3xl text-sm leading-relaxed text-[var(--color-fg-muted)]">{children}</p>
}

function DemoSegmento() {
  const [a, setA] = useState<string | null>('ATP')
  const [b, setB] = useState<string | null>(null)
  const [c, setC] = useState<string | null>('NAT')
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <p className="text-sm font-semibold text-[var(--color-fg)]">Cinco respostas, uma marcada (clique na marcada para limpar)</p>
        <SegmentoAvaliacao rotulo="Avaliação do item 1.1" opcoes={OPCOES_INSPECAO} valor={a} onChange={setA} />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-semibold text-[var(--color-fg)]">Sem resposta ainda, três opções</p>
        <SegmentoAvaliacao rotulo="O extintor está no prazo?" opcoes={SIM_NAO} valor={b} onChange={setB} />
      </div>
      <div className="max-w-sm space-y-2">
        <p className="text-sm font-semibold text-[var(--color-fg)]">
          <code>grande</code>: cinco colunas iguais na largura do celular (aqui, 24rem)
        </p>
        <SegmentoAvaliacao rotulo="Avaliação do item 1.3" opcoes={OPCOES_INSPECAO} valor={c} onChange={setC} grande />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-semibold text-[var(--color-fg)]">Desabilitado (inspeção finalizada)</p>
        <SegmentoAvaliacao rotulo="Avaliação do item 1.4" opcoes={OPCOES_INSPECAO} valor="AT" onChange={() => {}} desabilitado />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-semibold text-[var(--color-fg)]">Os cinco tons, todos marcados (contraste do texto medido nos dois temas)</p>
        <div className="flex flex-wrap gap-2">
          {OPCOES_INSPECAO.map((o) => (
            <SegmentoAvaliacao key={o.valor} rotulo={`Tom ${o.nome}`} opcoes={[o]} valor={o.valor} onChange={() => {}} permitirLimpar={false} />
          ))}
        </div>
      </div>
    </div>
  )
}

const ESTADOS: { id: EstadoSalvamentoValor; nome: string }[] = [
  { id: 'limpo', nome: 'Salvo' },
  { id: 'sujo', nome: 'Alterado' },
  { id: 'salvando', nome: 'Salvando' },
  { id: 'erro', nome: 'Erro' },
]

function DemoBarra() {
  const [estado, setEstado] = useState<EstadoSalvamentoValor>('limpo')
  const [salvoEm] = useState(() => new Date())
  const [variante, setVariante] = useState<BarraAcoesRodapeVariante>('rodape')
  const tamanho = variante === 'rodape' ? 'sm' : 'lg'
  return (
    <div className="space-y-3">
      <div role="group" aria-label="Variante da barra" className="flex flex-wrap gap-2">
        {(['rodape', 'cartao'] as const).map((v) => (
          <Button key={v} type="button" size="sm" variant={variante === v ? 'primary' : 'outline'} aria-pressed={variante === v} onClick={() => setVariante(v)}>
            {v === 'rodape' ? 'variante="rodape" (padrão)' : 'variante="cartao"'}
          </Button>
        ))}
      </div>
      <div role="group" aria-label="Estado mostrado na barra" className="flex flex-wrap gap-2">
        {ESTADOS.map((e) => (
          <Button key={e.id} type="button" size="sm" variant={estado === e.id ? 'primary' : 'outline'} aria-pressed={estado === e.id} onClick={() => setEstado(e.id)}>
            {e.nome}
          </Button>
        ))}
      </div>
      <div className="h-[260px] overflow-y-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-3">
        <div className="space-y-3 text-sm text-[var(--color-fg-muted)]">
          {Array.from({ length: 8 }, (_, i) => (
            <p key={i}>Conteúdo do formulário, linha {i + 1}. A barra gruda no fim da área visível enquanto isto rola.</p>
          ))}
        </div>
        <BarraAcoesRodape
          variante={variante}
          className="mt-3"
          label="Ações do exemplo"
          estado={<EstadoSalvamento estado={estado} salvoEm={salvoEm} />}
          aviso={
            <Button type="button" variant="inverseOutline" size="sm">
              2 pendências para finalizar
            </Button>
          }
        >
          <Button type="button" variant="inverseOutline" size={tamanho}>
            <Save aria-hidden />
            Salvar rascunho
          </Button>
          <Button type="button" variant="ouro" size={tamanho}>
            <Send aria-hidden />
            Finalizar
          </Button>
        </BarraAcoesRodape>
      </div>
    </div>
  )
}

function DemoAssinatura() {
  const [v, setV] = useState<string | null>(null)
  const [w, setW] = useState<string | null>(null)
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <AssinaturaCanvas rotulo="Inspetor responsável" obrigatoria valor={v} onChange={setV} />
      <AssinaturaCanvas rotulo="Gestor da área" obrigatoria valor={w} onChange={setW} erro="Falta a assinatura do gestor." />
    </div>
  )
}

const USO = `import {
  SecaoNumerada, SegmentoAvaliacao, AssinaturaCanvas,
  BarraAcoesRodape, EstadoSalvamento, CardChecklist,
} from '@fips-app/ds-fips'

<SecaoNumerada id="itens" numero={2} titulo="Itens" dica="Responda todos" icone={ClipboardCheck}>
  <SegmentoAvaliacao
    rotulo="Avaliação do item 2.1"
    opcoes={[
      { valor: 'AT', rotulo: 'AT', nome: 'Atende', tom: 'sucesso' },
      { valor: 'NAT', rotulo: 'NAT', nome: 'Não atende', tom: 'aviso' },
    ]}
    valor={resposta}
    onChange={setResposta}   // recebe null ao clicar na marcada
  />
</SecaoNumerada>

<AssinaturaCanvas rotulo="Inspetor" obrigatoria valor={assinatura} onChange={setAssinatura} />

<BarraAcoesRodape
  label="Ações da inspeção"
  estado={<EstadoSalvamento estado="limpo" salvoEm={salvoEm} />}
>
  <Button variant="inverseOutline" size="sm">Salvar rascunho</Button>
  <Button variant="ouro" size="sm">Finalizar</Button>
</BarraAcoesRodape>

{/* variante="cartao": cartão flutuante, botões lg */}

<ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
  <CardChecklist como="li" titulo="Vistoria de AMV" codigo="FT-014" revisao="03" totalItens={18}
    selo={<Badge variant="info">Semanal</Badge>}
    dados={[{ rotulo: 'Última inspeção', valor: '28/10/2026' }, { rotulo: 'Média', valor: '8,4' }]}
    acao={{ rotulo: 'Iniciar inspeção', onClick: iniciar }} />
</ul>`

export default function FormularioExecucaoDoc() {
  return (
    <DocPage
      title="Formulário de execução"
      description="Cinco peças genéricas para formulários longos de campo (inspeção, vistoria, checklist): seção numerada, resposta em pílula segmentada, assinatura, barra de ações no rodapé e cartão para iniciar. O exemplo montado está em Padrões, Execução de inspeção."
    >
      <DemoSection title="SecaoNumerada">
        <div className="space-y-4">
          <Nota>
            Cartão de seção com o número no chip ("01"), título como heading de verdade, dica e ícone no canto. O cartão é um
            contêiner: o respiro e o ícone respondem à largura dele, não à da janela.{' '}
            <strong>Não estende</strong> <code>FormSectionCard</code> + <code>FormSectionHeader</code>: aquele par é o cabeçalho
            compacto do registro (chip com o ícone, rótulo em caixa alta, sem heading, espaço fixado em <code>style</code>). Os
            dois partilham o canto assimétrico <code>12px 12px 12px 24px</code> e convivem.
          </Nota>
          <div className="space-y-4">
            <SecaoNumerada id="demo-s1" numero={1} titulo="Identificação" dica="Onde e quando a inspeção aconteceu" icone={ShieldCheck}>
              <p className="text-sm text-[var(--color-fg-muted)]">Corpo da seção: campos, grades, o que o formulário pedir.</p>
            </SecaoNumerada>
            <SecaoNumerada
              id="demo-s2"
              numero={2}
              titulo="Itens do checklist"
              acao={
                <Button type="button" size="sm" variant="outline">
                  <Pencil aria-hidden />
                  Editar
                </Button>
              }
            >
              <p className="text-sm text-[var(--color-fg-muted)]">Com <code>acao</code> o botão ocupa o lugar do ícone.</p>
            </SecaoNumerada>
            <SecaoNumerada id="demo-s3" numero={3} titulo="Sem corpo" dica="Sem filhos, o divisor some" icone={ClipboardCheck} />
          </div>
          <Tabela
            linhas={[
              ['id', 'string', 'Âncora da seção e base do id do título.'],
              ['numero', 'number', 'Chip com dois dígitos; o leitor de tela lê "3." antes do título.'],
              ['titulo / dica', 'string', 'Heading e linha de apoio.'],
              ['icone', 'LucideIcon', 'Enfeite à direita; some em contêiner abaixo de 28rem.'],
              ['acao', 'ReactNode', 'Substitui o ícone (botão "Editar dados").'],
              ['nivelTitulo', '2 | 3', 'Padrão 2. Use 3 dentro de outra seção.'],
              ['className / corpoClassName', 'string', 'Margem do cartão e espaço entre blocos do corpo.'],
            ]}
          />
        </div>
      </DemoSection>

      <DemoSection title="SegmentoAvaliacao">
        <div className="space-y-4">
          <Nota>
            Botões de resposta colados numa pílula, alvo de 44px, <code>aria-pressed</code>, rótulo curto + nome inteiro
            (<code>title</code> e nome acessível "AT, Atende"). As respostas e os tons vêm de <code>opcoes</code>: o componente não
            sabe o que é AT. Tab entra em cada botão; setas, Home e End movem o foco; Espaço ou Enter marcam. Tons:{' '}
            <code>sucesso</code> verde, <code>atencao</code> amarelo, <code>aviso</code> laranja, <code>neutro</code> cinza,{' '}
            <code>critico</code> vermelho. O texto marcado é a mistura do <code>fg</code> semântico com <code>--color-fg</code>:
            4,5:1 ou mais nos dois temas (medido em <code>scripts/formulario-execucao.test.mjs</code>).
          </Nota>
          <DemoSegmento />
          <Tabela
            linhas={[
              ['opcoes', 'OpcaoAvaliacao[]', '{ valor, rotulo, nome?, tom? }, 2 a 6 respostas.'],
              ['valor', 'V | null', 'Resposta marcada.'],
              ['onChange', '(v: V | null) => void', 'Recebe null ao clicar na marcada.'],
              ['rotulo', 'string', 'Nome do grupo para leitor de tela; o texto do item fica fora.'],
              ['grande', 'boolean', 'Colunas iguais na largura toda (celular).'],
              ['permitirLimpar', 'boolean', 'Padrão true. false: a marcada não desmarca.'],
              ['desabilitado', 'boolean', 'Só leitura.'],
            ]}
          />
        </div>
      </DemoSection>

      <DemoSection title="AssinaturaCanvas">
        <div className="space-y-4">
          <Nota>
            Assinatura a dedo, caneta ou mouse (eventos de ponteiro). Devolve o PNG em data URL ao levantar o ponteiro e{' '}
            <code>null</code> ao limpar. O papel é branco nos dois temas e o traço é o azul-escuro da marca; o PNG sai sempre
            com <code>largura</code> x <code>altura</code>. Com a assinatura gravada, a imagem ocupa o lugar do quadro. O quadro
            exige ponteiro: ofereça outro caminho a quem não consegue desenhar. Desenhe nos quadros abaixo.
          </Nota>
          <DemoAssinatura />
          <Tabela
            linhas={[
              ['rotulo', 'string', 'Quem assina. Rótulo e texto alternativo.'],
              ['valor / onChange', 'string | null', 'Data URL gravada; onChange(dataUrl | null).'],
              ['obrigatoria', 'boolean', 'Asterisco e "(obrigatória)" para leitor de tela.'],
              ['erro', 'string', 'Borda vermelha e mensagem, só enquanto não há assinatura.'],
              ['desabilitado', 'boolean', 'Sem desenhar, sem Limpar.'],
              ['largura / altura', 'number', 'Tamanho interno do PNG. Padrão 520 x 160 (quadro de até 32rem, borda sólida de 1px).'],
              ['dicaVazio / dicaRegistrada', 'string', 'Textos de apoio.'],
            ]}
          />
        </div>
      </DemoSection>

      <DemoSection title="BarraAcoesRodape + EstadoSalvamento">
        <div className="space-y-4">
          <Nota>
            Barra presa ao rodapé do formulário (<code>position: sticky</code>): faixa azul-escura no claro, superfície com borda
            no escuro. Dentro dela use <code>inverseOutline</code> nas ações secundárias e <code>ouro</code> na principal.{' '}
            <code>EstadoSalvamento</code> é o texto "Salvo às 14:32" / "Salvando…" / erro, em região <code>status</code>. Duas
            variantes: <code>rodape</code> (padrão desde a 0.21.0, faixa reta de largura inteira com linha e sombra para cima,
            estado à esquerda e ações à direita, botões <code>sm</code> de 30px, como o rodapé do formulário da Manutenção) e{' '}
            <code>cartao</code> (a barra de antes: cartão arredondado e flutuante, botões <code>lg</code>; com contêiner abaixo
            de 48rem o estado vai em cima e as ações na linha de baixo). Quem tem barra de navegação fixa embaixo
            publica <code>--barra-acoes-base</code> com a altura dela.
          </Nota>
          <DemoBarra />
          <Tabela
            linhas={[
              ['variante', "'rodape' | 'cartao'", 'Padrão "rodape" (faixa reta, botões sm). "cartao": cartão flutuante, botões lg.'],
              ['label', 'string', 'Nome da região. Padrão "Ações do formulário".'],
              ['estado', 'ReactNode', 'Normalmente <EstadoSalvamento />.'],
              ['aviso', 'ReactNode', 'Ao lado do estado (botão de pendências).'],
              ['children', 'ReactNode', 'As ações.'],
              ['EstadoSalvamento', '{ estado: limpo|sujo|salvando|erro, salvoEm?, erro? }', 'limpo + salvoEm vira "Salvo às hh:mm".'],
            ]}
          />
        </div>
      </DemoSection>

      <DemoSection title="CardChecklist">
        <div className="space-y-4">
          <Nota>
            Cartão de um checklist modelo para iniciar: título, código, revisão, selo do tipo, número de itens, dois dados do
            histórico e a ação principal presa ao pé (os botões alinham numa grade de cartões de alturas diferentes). Não conhece
            inspeção: dados e ação são de quem usa. Em app com router, passe um <code>Button asChild</code> com o{' '}
            <code>Link</code> em <code>acaoPersonalizada</code>.
          </Nota>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <CardChecklist
              como="li"
              titulo="Vistoria de aparelho de mudança de via"
              codigo="FT-014"
              revisao="03"
              totalItens={18}
              selo={<Badge variant="info">Semanal</Badge>}
              dados={[
                { rotulo: 'Última inspeção', valor: '28/10/2026' },
                { rotulo: 'Média de nota', valor: '8,4' },
              ]}
              acao={{ rotulo: 'Iniciar inspeção', nomeAcessivel: 'Iniciar inspeção: Vistoria de aparelho de mudança de via', onClick: () => {} }}
            />
            <CardChecklist
              como="li"
              titulo="Extintores"
              codigo="FT-031"
              totalItens={1}
              selo={<Badge variant="info">Mensal</Badge>}
              dados={[
                { rotulo: 'Última inspeção', valor: 'Ainda não feita' },
                { rotulo: 'Média de nota', valor: '—' },
              ]}
              acao={{ rotulo: 'Iniciar inspeção', desabilitada: true, motivoDesabilitada: 'Seu perfil não inicia inspeções.' }}
            />
            <CardChecklist como="li" titulo="Sem dados nem ação" codigo="FT-099" totalItens={6} />
          </ul>
          <Tabela
            linhas={[
              ['titulo / codigo / revisao', 'string', 'Cabeçalho do cartão; revisão sai como "revisão 03".'],
              ['selo', 'ReactNode', 'Ao lado do título.'],
              ['totalItens', 'number', '"1 item" / "12 itens".'],
              ['dados', '{ rotulo, valor }[]', 'Duas colunas.'],
              ['acao', 'CardChecklistAcao', '{ rotulo, icone?, href?, onClick?, desabilitada?, motivoDesabilitada?, nomeAcessivel? }.'],
              ['acaoPersonalizada', 'ReactNode', 'Substitui o botão (Link do router).'],
              ['como / nivelTitulo', "'div'|'li'|'article' / 2|3|4", 'Elemento raiz e nível do título.'],
            ]}
          />
        </div>
      </DemoSection>

      <DemoSection title="Uso">
        <Codigo>{USO}</Codigo>
      </DemoSection>
    </DocPage>
  )
}
