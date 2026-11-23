import { useCart } from '../hooks/useCart'
import { formatCurrency } from '../utils/formatCurrency'
import { CartIcon } from './Icons'

export function MobileCartBar() {
  const { quantidadeTotal, subtotal, carrinhoAberto, abrirCarrinho } = useCart()

  if (quantidadeTotal === 0 || carrinhoAberto) return null

  const rotuloItens =
    quantidadeTotal === 1 ? '1 item' : `${quantidadeTotal} itens`

  return (
    <>
      <div className="mobile-cart-bar-spacer" aria-hidden="true" />
      <div className="mobile-cart-bar">
        <button
          type="button"
          className="mobile-cart-bar__button"
          onClick={abrirCarrinho}
          aria-label={`Ver carrinho: ${rotuloItens}, ${formatCurrency(subtotal)}`}
        >
          <span className="mobile-cart-bar__icon">
            <CartIcon />
            <span className="mobile-cart-bar__badge" aria-hidden="true">
              {quantidadeTotal}
            </span>
          </span>
          <span className="mobile-cart-bar__text" aria-hidden="true">
            <small>{rotuloItens}</small>
            <strong>{formatCurrency(subtotal)}</strong>
          </span>
          <span className="mobile-cart-bar__cta" aria-hidden="true">
            Ver carrinho
            <span aria-hidden="true">→</span>
          </span>
        </button>
      </div>
    </>
  )
}
