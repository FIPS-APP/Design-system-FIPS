import { SlidersHorizontal, type LucideIcon } from 'lucide-react'
import { Drawer, DrawerContent, DrawerHero } from '../ui/drawer'
import { ChipSelect } from '../ui/chip-select'
import { PillGroup } from './PillGroup'
import { type PillOption } from './PillFilter'

/** Grupo de pills no drawer. `multiple` → value é string[] e '' limpa. */
export type FilterGroup = {
  key: string
  label: string
  icon: LucideIcon
  options: PillOption[]
  value: string | string[]
  onChange: (v: string) => void
  multiple?: boolean
}

/** Campo com muitas opções → ChipSelect block (busca automática a partir de 10). */
export type FilterChip = {
  key: string
  label: string
  icon: LucideIcon
  options: string[]
  value: string | null
  onChange: (v: string | null) => void
}

/**
 * Drawer de filtros — hero institucional + pills + ChipSelect + rodapé fixo.
 * Use em toda listagem com botão "Filtros" (nunca popover ancorado).
 */
export function FilterDrawer({
  open,
  onOpenChange,
  eyebrow,
  groups,
  chips = [],
  activeCount,
  resultCount,
  onClear,
  emptyDescription = 'Refine os OPAs pelos campos abaixo',
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  eyebrow: string
  groups: FilterGroup[]
  chips?: FilterChip[]
  activeCount: number
  resultCount: number
  onClear: () => void
  emptyDescription?: string
}) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        side="left"
        showCloseButton={false}
        className="max-w-[400px] gap-0 overflow-hidden p-0 sm:p-0"
      >
        <DrawerHero
          icon={SlidersHorizontal}
          eyebrow={eyebrow}
          title="Filtros"
          description={
            activeCount > 0 ? `${activeCount} filtro(s) ativo(s)` : emptyDescription
          }
        />
        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
          {groups.map((g) => (
            <PillGroup
              key={g.key}
              icon={g.icon}
              label={g.label}
              options={g.options}
              value={g.value}
              onChange={g.onChange}
              multiple={g.multiple}
            />
          ))}
          {chips.map((c) => (
            <ChipSelect
              key={c.key}
              block
              fieldLabel={c.label}
              value={c.value ?? ''}
              onChange={(v) => c.onChange(v === '' ? null : v)}
              options={[{ value: '', label: 'Todos' }, ...c.options.map((o) => ({ value: o, label: o }))]}
              icon={c.icon}
              ariaLabel={c.label}
            />
          ))}
        </div>
        <div className="flex shrink-0 gap-2 border-t border-[var(--color-border)] bg-[var(--color-surface-muted)]/70 px-6 py-4">
          <button
            type="button"
            onClick={onClear}
            disabled={activeCount === 0}
            className="inline-flex h-9 flex-1 items-center justify-center rounded-lg border border-[var(--color-primary)]/20 bg-transparent text-[12px] font-semibold text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary)]/6 disabled:opacity-50"
          >
            Limpar tudo
          </button>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="inline-flex h-9 flex-1 items-center justify-center rounded-lg bg-[var(--color-secondary)] text-[12px] font-semibold text-white"
          >
            Ver {resultCount} resultado{resultCount === 1 ? '' : 's'}
          </button>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
