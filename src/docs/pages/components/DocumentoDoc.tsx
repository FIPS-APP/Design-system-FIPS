import { DocPage, DemoSection } from '../../components/DocPage'
import { TabelaDeProps, BlocoDeCodigo, NotaDeDoc } from '../../components/DocApoio'
import {
  Folha,
  CabecalhoDocumento,
  BlocoDeCamposDocumento,
  FaixaSecaoDocumento,
  FaixaCategoriaDocumento,
  TabelaDocumento,
  CabecalhoTabelaDocumento,
  CelulaCabecalhoDocumento,
  CelulaDocumento,
  CorpoTabelaDocumento,
  LinhaTabelaDocumento,
} from '../../../components/composites/Documento'
import { FipsLogo } from '../../../components/brand/FipsLogo'

export default function DocumentoDoc() {
  return (
    <DocPage
      title="Documento de impressão"
      description="O formulário de papel na tela como uma folha única com grade: cabeçalho com metadados, bloco de campos, faixas de seção e de categoria com progresso, e a tabela de itens. Para checklists, laudos e registros que também saem em PDF."
    >
      <DemoSection title="Folha completa">
        <div className="space-y-4">
          <Folha>
            <CabecalhoDocumento
              titulo="Inspeção de segurança do trabalho"
              marca={<FipsLogo variante="branca" />}
              metadados={[
                { rotulo: 'Código', valor: 'FR-SST-014' },
                { rotulo: 'Revisão', valor: '', quandoVazio: 'sem revisão' },
                { rotulo: 'Elaboração', valor: '02/11/2026' },
                { rotulo: 'Aprovação', valor: 'Coord. SST' },
              ]}
            />
            <BlocoDeCamposDocumento
              titulo="Dados da inspeção"
              campos={[
                { rotulo: 'Local', valor: 'Pátio Norte' },
                { rotulo: 'Empresa', valor: 'Empresa auditada' },
                { rotulo: 'Auditor', valor: null },
              ]}
            />
            <FaixaSecaoDocumento nome="1. Sinalização" paginas={[1, 2]} progresso={{ feitos: 6, total: 8 }} />
            <FaixaCategoriaDocumento nome="Placas de advertência" contagem="8 itens" progresso={{ feitos: 6, total: 8 }} />
            <TabelaDocumento>
              <CabecalhoTabelaDocumento>
                <LinhaTabelaDocumento>
                  <CelulaCabecalhoDocumento className="w-12">Nº</CelulaCabecalhoDocumento>
                  <CelulaCabecalhoDocumento>Item</CelulaCabecalhoDocumento>
                  <CelulaCabecalhoDocumento className="w-20">Nota</CelulaCabecalhoDocumento>
                </LinhaTabelaDocumento>
              </CabecalhoTabelaDocumento>
              <CorpoTabelaDocumento>
                {[
                  ['1.1', 'As placas estão legíveis e fixadas', 'AT'],
                  ['1.2', 'A sinalização noturna funciona', 'NAT'],
                  ['1.3', 'Há rota de fuga desobstruída', 'ATP'],
                ].map(([n, t, c]) => (
                  <LinhaTabelaDocumento key={n}>
                    <CelulaDocumento className="font-mono">{n}</CelulaDocumento>
                    <CelulaDocumento>{t}</CelulaDocumento>
                    <CelulaDocumento className="font-mono font-semibold">{c}</CelulaDocumento>
                  </LinhaTabelaDocumento>
                ))}
              </CorpoTabelaDocumento>
            </TabelaDocumento>
            <FaixaSecaoDocumento nome="2. Extintores" tom="indisponivel" />
            <FaixaCategoriaDocumento nome="Por transcrever" tom="indisponivel" contagem="0 itens" />
          </Folha>
          <NotaDeDoc>
            A escada de cor é a hierarquia do papel: verde no título, grafite nos rótulos dos metadados, azul-noite na seção, azul na
            categoria, cinza no que ainda não pode ser preenchido. Todo texto é branco sobre a faixa, com 4,5:1 ou mais nos dois temas. A
            moldura mora na <code>Folha</code> e só nela (sem raio, sem sombra); os filhos entram rentes.
          </NotaDeDoc>
        </div>
      </DemoSection>

      <DemoSection title="API">
        <div className="space-y-4">
          <TabelaDeProps
            linhas={[
              ['Folha', 'children, className', 'Borda de 1px, sem raio, overflow escondido.'],
              ['CabecalhoDocumento', 'titulo, metadados[], marca?, nivel? (1 | 2)', 'metadado: { rotulo, valor, quandoVazio? }. `marca` é o bloco à esquerda (logo em branco); sem ele o título ocupa a linha. Lista vazia some com a grade.'],
              ['BlocoDeCamposDocumento', 'titulo, campos[], valores? (curtos | longos), textoVazio?, nivelTitulo?', 'campo: { rotulo, valor | null }; null sai "a preencher". 1, 2 ou 3 colunas pela largura do bloco (34rem, 42rem ou 53rem).'],
              ['FaixaSecaoDocumento', 'nome, paginas?, acoes?, progresso?, tom?, nivelTitulo?', 'paginas vira "páginas 1 e 2 do impresso". progresso: { feitos, total }.'],
              ['FaixaCategoriaDocumento', 'nome, contagem?, progresso?, tom?, nivelTitulo?', 'A barra usa ProgressoPorFaixa. tom: normal | indisponivel.'],
              ['TabelaDocumento', 'props da Table do DS menos framed, zebra e verticalBorders', 'Grade rente, densidade compacta.'],
              ['CabecalhoTabelaDocumento / CelulaCabecalhoDocumento / CelulaDocumento', 'props do elemento', 'Faixa escura de cabeçalho; célula de 42px com fio embaixo e à direita.'],
              ['CorpoTabelaDocumento / LinhaTabelaDocumento', 'props do elemento', 'O corpo e a linha da Table do DS.'],
            ]}
          />
          <BlocoDeCodigo>{`<Folha>
  <CabecalhoDocumento titulo="Inspeção" metadados={[{ rotulo: 'Código', valor: 'FR-014' }]} marca={<FipsLogo variante="branca" />} />
  <FaixaSecaoDocumento nome="1. Sinalização" progresso={{ feitos: 6, total: 8 }} />
  <TabelaDocumento>…</TabelaDocumento>
</Folha>`}</BlocoDeCodigo>
        </div>
      </DemoSection>
    </DocPage>
  )
}
