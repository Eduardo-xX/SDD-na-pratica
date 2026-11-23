import { useCart } from '../hooks/useCart'
import { formatCurrency } from '../utils/formatCurrency'
import { CartIcon } from './Icons'

export function CartButton() {
  const { quantidadeTotal, subtotal, abrirCarrinho } = useCart()
  const rotuloItens =
    quantidadeTotal === 1 ? '1 item' : `${quantidadeTotal} itens`

  return (
    <button
      type="button"
      className={`cart-button ${quantidadeTotal > 0 ? 'has-items' : ''}`}
      onClick={abrirCarrinho}
      aria-label={`Abrir carrinho: ${rotuloItens}, ${formatCurrency(subtotal)}`}
    >
      <CartIcon className="cart-button__icon" />
      <span className="cart-button__label" aria-hidden="true">
        <small>Carrinho</small>
        <span>{formatCurrency(subtotal)}</span>
      </span>
      {quantidadeTotal > 0 && (
        <span className="cart-button__badge" aria-hidden="true">
          {quantidadeTotal}
        </span>
      )}
    </button>
  )
}
