import { useState, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { PAGE_HERO_DEFAULT_DECORATION } from '../../composites/PageHero'
import { HeroFileira, type HeroFileiraAtalho } from './HeroFileira'

export type HomeHeroSobreposicao = 'leve' | 'media' | 'forte'

export interface HomeHeroProps {
  /** Linha pequena em caixa alta acima do título (ex.: o nome do procedimento ou do módulo). */
  sobretitulo?: string
  /** Palavra-chave do título, em laranja. Vem antes do `titulo`, ou depois com `posicaoDestaque="fim"`. */
  destaque?: string
  /** Resto do título, em branco. É o texto do `h1`: com `destaque`, o `h1` lê "destaque + separador + titulo". */
  titulo: string
  /** Texto entre o destaque e o resto do título. Padrão: um espaço. */
  separador?: string
  /**
   * Onde o destaque laranja fica: `inicio` ("OPA - Observar, Parar e Agir", padrão) ou `fim`
   * ("Painel Integrado de Gestão de SSMA", com a parte final em laranja).
   */
  posicaoDestaque?: 'inicio' | 'fim'
  subtitulo?: ReactNode
  /** Foto de fundo. Padrão: o trem do DS (`/backgrounds/app-shell-home-trains.png`, em `public/` do app). `null` desliga a foto e fica só o azul. */
  imagem?: string | null
  /**
   * Quanto o azul cobre a foto. `leve` (padrão) deixa a foto aparecer; `media` e `forte` entram quando a
   * foto é clara demais para o texto branco.
   */
  sobreposicao?: HomeHeroSobreposicao
  /** Fileira de atalhos (`HeroFileira`) sob o subtítulo. Vazia ou ausente: o hero termina no subtítulo. */
  atalhos?: HeroFileiraAtalho[]
  /** Nome da fileira de atalhos para leitor de tela. */
  atalhosLabel?: string
  /** Abaixo da fileira (uma chamada extra, um aviso). */
  children?: ReactNode
  className?: string
}

/** Azul institucional (`--color-fips-blue-950`) a N% por cima da foto: topo, meio e pé. */
const SOBREPOSICAO: Record<HomeHeroSobreposicao, string> = {
  leve: 'from-[color-mix(in_srgb,var(--color-fips-blue-950)_60%,transparent)] via-[color-mix(in_srgb,var(--color-fips-blue-950)_45%,transparent)] to-[color-mix(in_srgb,var(--color-fips-blue-950)_60%,transparent)]',
  media:
    'from-[color-mix(in_srgb,var(--color-fips-blue-950)_76%,transparent)] via-[color-mix(in_srgb,var(--color-fips-blue-950)_62%,transparent)] to-[color-mix(in_srgb,var(--color-fips-blue-950)_76%,transparent)]',
  forte:
    'from-[color-mix(in_srgb,var(--color-fips-blue-950)_90%,transparent)] via-[color-mix(in_srgb,var(--color-fips-blue-950)_80%,transparent)] to-[color-mix(in_srgb,var(--color-fips-blue-950)_90%,transparent)]',
}

/**
 * Hero da Home padrão FIPS: foto clara com o azul por cima (a foto aparece), sobretítulo em caixa alta,
 * título em duas cores (palavra-chave laranja + resto branco), subtítulo e a fileira de atalhos
 * (`HeroFileira`). A altura encolhe no estreito e só cresce quando sobra tela.
 *
 * Não substitui o `PageHero` (faixa de módulo, gradiente sem foto em primeiro plano). Para a faixa de
 * pilares que sobe sobre o pé do hero, use `FaixaPilares` logo abaixo.
 */
export function HomeHero({
  sobretitulo,
  destaque,
  titulo,
  separador = ' ',
  posicaoDestaque = 'inicio',
  subtitulo,
  imagem = PAGE_HERO_DEFAULT_DECORATION,
  sobreposicao = 'leve',
  atalhos,
  atalhosLabel = 'Atalhos',
  children,
  className,
}: HomeHeroProps) {
  // Com a foto carregada o fundo fica transparente (como no Gestão OPA). O azul entra quando não há foto ou
  // quando ela falha ao carregar: o texto branco precisa de fundo escuro para manter o contraste.
  const [fotoFalhou, setFotoFalhou] = useState(false)
  const semFoto = !imagem || fotoFalhou
  return (
    <section
      className={cn('relative isolate overflow-hidden text-white', semFoto && 'bg-[var(--color-fips-blue-950)]', className)}
    >
      {imagem ? (
        <img
          src={imagem}
          alt=""
          aria-hidden
          decoding="async"
          onError={() => setFotoFalhou(true)}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      ) : null}
      <div aria-hidden className={cn('absolute inset-0 bg-gradient-to-b', SOBREPOSICAO[sobreposicao])} />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/15" />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-8 text-center sm:gap-5 sm:px-6 sm:py-10 lg:py-14 xl:py-20">
        <div className="flex max-w-3xl flex-col items-center gap-3">
          {sobretitulo ? (
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white">{sobretitulo}</p>
          ) : null}
          <h1 className="font-heading text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {destaque && posicaoDestaque === 'inicio' ? (
              <>
                <span className="text-[var(--color-accent-strong)]">{destaque}</span>
                {separador}
              </>
            ) : null}
            {titulo}
            {destaque && posicaoDestaque === 'fim' ? (
              <>
                {separador}
                {/* O destaque no fim não quebra no meio: "Gestão de SSMA" desce inteiro. */}
                <span className="whitespace-nowrap text-[var(--color-accent-strong)]">{destaque}</span>
              </>
            ) : null}
          </h1>
          {subtitulo ? <p className="text-sm leading-relaxed text-white sm:text-base">{subtitulo}</p> : null}
        </div>
        {atalhos && atalhos.length > 0 ? <HeroFileira label={atalhosLabel} atalhos={atalhos} /> : null}
        {children}
      </div>
    </section>
  )
}
