import { useState } from 'react'
import { ClipboardCheck, PenLine, ShieldCheck } from 'lucide-react'
import { DocPage, DemoSection } from '../../components/DocPage'
import { SecaoNumerada } from '../../../components/composites/SecaoNumerada'
import { BarraAcoesRodape, EstadoSalvamento, type EstadoSalvamentoValor } from '../../../components/composites/BarraAcoesRodape'
import { SegmentoAvaliacao } from '../../../components/composites/SegmentoAvaliacao'
import { AssinaturaCanvas } from '../../../components/composites/AssinaturaCanvas'
import { CardChecklist } from '../../../components/composites/CardChecklist'
import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import { Field, FieldLabel } from '../../../components/ui/field'
import { Input } from '../../../components/ui/input'
import { Textarea } from '../../../components/ui/textarea'
import { OPCOES_INSPECAO } from '../../data/opcoes-inspecao'

const ITENS = [
  { codigo: '1.1', texto: 'Agulhas sem folga e encostando por inteiro nos trilhos.' },
  { codigo: '1.2', texto: 'Sapatilhas e parafusos de fixação presentes e apertados.' },
  { codigo: '1.3', texto: 'Barra de manobra e cadeado em condição de uso.' },
  { codigo: '1.4', texto: 'Drenagem livre em volta do aparelho.' },
]

function Hub({ onIniciar }: { onIniciar: () => void }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      <CardChecklist
        como="li"
        titulo="Vistoria de aparelho de mudança de via"
        codigo="FT-014"
        revisao="03"
        totalItens={ITENS.length}
        selo={<Badge variant="info">Semanal</Badge>}
        dados={[
          { rotulo: 'Última inspeção', valor: '28/10/2026' },
          { rotulo: 'Média de nota', valor: '8,4' },
        ]}
        acao={{ rotulo: 'Iniciar inspeção', nomeAcessivel: 'Iniciar inspeção: Vistoria de aparelho de mudança de via', onClick: onIniciar }}
      />
      <CardChecklist
        como="li"
        titulo="Inspeção de extintores"
        codigo="FT-031"
        revisao="01"
        totalItens={12}
        selo={<Badge variant="info">Mensal</Badge>}
        dados={[
          { rotulo: 'Última inspeção', valor: 'Ainda não feita' },
          { rotulo: 'Média de nota', valor: '—' },
        ]}
        acao={{ rotulo: 'Iniciar inspeção', onClick: onIniciar }}
      />
      <CardChecklist
        como="li"
        titulo="Passagem em nível"
        codigo="FT-052"
        totalItens={9}
        selo={<Badge variant="info">Trimestral</Badge>}
        dados={[
          { rotulo: 'Última inspeção', valor: '02/09/2026' },
          { rotulo: 'Média de nota', valor: '9,1' },
        ]}
        acao={{ rotulo: 'Iniciar inspeção', desabilitada: true, motivoDesabilitada: 'Seu perfil não inicia inspeções.' }}
      />
    </ul>
  )
}

function Execucao() {
  const [local, setLocal] = useState('')
  const [obs, setObs] = useState('')
  const [respostas, setRespostas] = useState<Record<string, string | null>>({})
  const [assinatura, setAssinatura] = useState<string | null>(null)
  const [estado, setEstado] = useState<EstadoSalvamentoValor>('limpo')
  const [salvoEm, setSalvoEm] = useState<Date | null>(null)
  const [tentou, setTentou] = useState(false)

  const faltam = ITENS.filter((i) => !respostas[i.codigo]).length + (assinatura ? 0 : 1) + (local.trim() ? 0 : 1)
  const sujou = () => setEstado('sujo')
  function salvar() {
    setEstado('salvando')
    window.setTimeout(() => {
      setSalvoEm(new Date())
      setEstado('limpo')
    }, 600)
  }

  return (
    <div className="h-[640px] overflow-y-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-3 sm:p-4" data-demo="execucao">
      <div className="space-y-3">
        <div>
          <h2 className="font-heading text-lg font-bold text-[var(--color-fg)]">Vistoria de aparelho de mudança de via</h2>
          <p className="text-xs text-[var(--color-fg-muted)]">FT-014 · revisão 03 · rascunho</p>
        </div>

        <SecaoNumerada id="ex-identificacao" numero={1} titulo="Identificação" dica="Onde a inspeção acontece" icone={ShieldCheck} nivelTitulo={3} corpoClassName="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="ex-local" required>Local</FieldLabel>
            <Input id="ex-local" value={local} placeholder="Ex.: AMV 12, pátio Saboó" aria-invalid={tentou && !local.trim()} onChange={(e) => { setLocal(e.target.value); sujou() }} />
          </Field>
          <Field>
            <FieldLabel htmlFor="ex-data">Data</FieldLabel>
            <Input id="ex-data" type="date" defaultValue="2026-11-02" onChange={sujou} />
          </Field>
        </SecaoNumerada>

        <SecaoNumerada id="ex-itens" numero={2} titulo="Itens do checklist" dica="Uma resposta por item" icone={ClipboardCheck} nivelTitulo={3} corpoClassName="space-y-4">
          {ITENS.map((i) => (
            <div key={i.codigo} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="min-w-0 text-sm text-[var(--color-fg)]">
                <span className="mr-2 font-mono text-xs text-[var(--color-fg-muted)]">{i.codigo}</span>
                {i.texto}
              </p>
              <SegmentoAvaliacao
                rotulo={`Avaliação do item ${i.codigo}`}
                opcoes={OPCOES_INSPECAO}
                valor={respostas[i.codigo]}
                onChange={(v) => { setRespostas((r) => ({ ...r, [i.codigo]: v })); sujou() }}
              />
            </div>
          ))}
          <Field>
            <FieldLabel htmlFor="ex-obs">Observações</FieldLabel>
            <Textarea id="ex-obs" rows={3} value={obs} onChange={(e) => { setObs(e.target.value); sujou() }} />
          </Field>
        </SecaoNumerada>

        <SecaoNumerada id="ex-assinatura" numero={3} titulo="Assinatura" dica="Do inspetor responsável" icone={PenLine} nivelTitulo={3}>
          <AssinaturaCanvas
            rotulo="Inspetor responsável"
            obrigatoria
            valor={assinatura}
            onChange={(v) => { setAssinatura(v); sujou() }}
            erro={tentou ? 'Falta a assinatura.' : undefined}
          />
        </SecaoNumerada>

        <BarraAcoesRodape
          label="Ações da inspeção"
          estado={<EstadoSalvamento estado={estado} salvoEm={salvoEm} />}
          aviso={
            tentou && faltam > 0 ? (
              <Button type="button" variant="inverseOutline" size="sm" onClick={() => document.getElementById('ex-itens')?.scrollIntoView({ block: 'start' })}>
                {faltam === 1 ? '1 pendência para finalizar' : `${faltam} pendências para finalizar`}
              </Button>
            ) : null
          }
          className="mt-2"
        >
          <Button type="button" variant="inverseOutline" size="sm" onClick={salvar} disabled={estado === 'salvando'}>
            Salvar rascunho
          </Button>
          <Button type="button" variant="ouro" size="sm" onClick={() => setTentou(true)}>
            Finalizar
          </Button>
        </BarraAcoesRodape>
      </div>
    </div>
  )
}

export default function ExecucaoInspecaoDemo() {
  const [aberta, setAberta] = useState(false)
  return (
    <DocPage
      title="Execução de inspeção"
      description="Montagem das peças genéricas de formulário de campo: o cartão que inicia o checklist, as seções numeradas, a resposta em pílula por item, a assinatura e a barra de ações no rodapé. A regra de negócio (quais respostas, o que bloqueia a finalização) é do app."
    >
      <DemoSection title="1. Escolher o formulário (CardChecklist)">
        <Hub onIniciar={() => setAberta(true)} />
      </DemoSection>
      <DemoSection title="2. Preencher (SecaoNumerada, SegmentoAvaliacao, AssinaturaCanvas, BarraAcoesRodape)">
        <div className="space-y-3">
          <p className="max-w-3xl text-sm text-[var(--color-fg-muted)]">
            {aberta ? 'Inspeção aberta pelo cartão. ' : ''}Responda, assine e use Finalizar com itens em branco para ver as pendências e o erro da
            assinatura. A barra fica presa no fim da área que rola. Nada é enviado.
          </p>
          <Execucao />
        </div>
      </DemoSection>
    </DocPage>
  )
}
