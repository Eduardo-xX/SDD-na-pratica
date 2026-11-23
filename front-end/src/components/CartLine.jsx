import { useCart } from '../hooks/useCart'
import { formatCurrency } from '../utils/formatCurrency'
import { MinusIcon, PlusIcon, TrashIcon } from './Icons'

export function CartLine({ item }) {
  const { incrementarItem, decrementarItem, removerItem } = useCart()
  const { lineId, produto, quantidade, observacao, precoTotal } = item

  return (
    <li className="cart-line">
      <div
        className={`cart-line__media cart-line__media--${produto.categoria}`}
        aria-hidden="true"
      >
        {produto.emoji}
      </div>

      <div className="cart-line__info">
        <div className="cart-line__top">
          <div>
            <h3 className="cart-line__name">{produto.nome}</h3>
            {observacao && (
              <p className="cart-line__obs">Obs.: {observacao}</p>
            )}
          </div>
          <strong className="cart-line__price">
            {formatCurrency(precoTotal)}
          </strong>
        </div>

        <div className="cart-line__bottom">
          <div className="quantity-stepper">
            <button
              type="button"
              onClick={() => decrementarItem(lineId)}
              disabled={quantidade <= 1}
              aria-label={`Diminuir quantidade de ${produto.nome}`}
            >
              <MinusIcon />
            </button>
            <span aria-live="polite">{quantidade}</span>
            <button
              type="button"
              onClick={() => incrementarItem(lineId)}
              disabled={quantidade >= 20}
              aria-label={`Aumentar quantidade de ${produto.nome}`}
            >
              <PlusIcon />
            </button>
          </div>

          <span className="cart-line__unit">
            {formatCurrency(produto.preco)} cada
          </span>

          <button
            type="button"
            className="cart-line__remove"
            onClick={() => removerItem(lineId)}
            aria-label={`Remover ${produto.nome} do carrinho`}
          >
            <TrashIcon />
            Remover
          </button>
        </div>
      </div>
    </li>
  )
}
