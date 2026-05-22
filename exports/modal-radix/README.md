# Modal Radix (composite)

Padrão usado no **ChangelogModal** e modais de produto FIPS Suprimentos.

## Dependências

- `Dialog` / `DialogContent` (Radix) — ver `src/components/ui/dialog.tsx`
- `Button` do DS
- Opcional: `Badge` para listas de novidades

## Uso

```tsx
import { Modal, ModalFooter } from './Modal'
import { Button } from '../button/Button'
import { Sparkles } from 'lucide-react'

<Modal
  open={open}
  onOpenChange={setOpen}
  size="lg"
  headerIcon={Sparkles}
  title="Novidades do sistema"
  description="Versão 0.3.0 Beta"
>
  {/* corpo scrollável */}
  <ModalFooter>
    <Button variant="primary" onClick={() => setOpen(false)}>
      Entendi, continuar
    </Button>
  </ModalFooter>
</Modal>
```

## Anatomia

| Parte | Classe / token |
|-------|----------------|
| Overlay | `bg-slate-950/35 backdrop-blur-[3px]` |
| Fechar (X) | `absolute top-5 right-5`, hover `surface-soft` |
| Header | `border-b`, ícone em círculo `primary/10` |
| Footer | `border-t bg-[var(--color-surface-muted)]/70` |
| CTA | `Button variant="primary"` |

Documentação viva: `/docs/components/modal-radix`
