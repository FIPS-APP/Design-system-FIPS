/**
 * Rola a opção realçada pelo teclado para dentro da lista (`block: 'nearest'`).
 * A rolagem é conveniência, não requisito: `?.` cobre o elemento ausente e a chamada
 * opcional cobre o método ausente (`Element.prototype.scrollIntoView` não existe no jsdom,
 * que os testes dos apps usam).
 */
export function rolarOpcaoParaVista(id: string): void {
  document.getElementById(id)?.scrollIntoView?.({ block: 'nearest' })
}
