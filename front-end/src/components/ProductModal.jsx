import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useCart } from '../hooks/useCart'
import { useDialogFocus } from '../hooks/useDialogFocus'
import { formatCurrency } from '../utils/formatCurrency'
import { CloseIcon, MinusIcon, PlusIcon } from './Icons'
import { TagBadge } from './TagBadge'

export function ProductModal({ produto, onClose }) {
  const { adicionarItem } = useCart()
  const dialogRef = useRef(null)
  const closeButtonRef = useRef(null)
  const [quantidade, setQuantidade] = useState(1)
  const [observacao, setObservacao] = useState('')

  useDialogFocus(dialogRef, closeButtonRef, onClose)

  const {
    nome,
    descricao,
    preco,
    categoria,
    emoji,
    disponivel,
    tags,
    ingredientes,
    alergenicos,
  } = produto

  function handleAdicionar() {
    if (!disponivel) return

    adicionarItem(produto.id, quantidade, observacao)
    onClose()
  }

  return createPortal(
    <div
      className="modal"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        ref={dialogRef}
        className="modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
      >
        <button
          ref={closeButtonRef}
          type="button"
          className="modal__close"
          onClick={onClose}
          aria-label="Fechar detalhes do produto"
        >
          <CloseIcon />
        </button>

        <div className={`modal__media modal__media--${categoria}`}>
          <span className="modal__emoji" aria-hidden="true">
            {emoji}
          </span>
          {!disponivel && (
            <span className="modal__unavailable">Indisponível no momento</span>
          )}
        </div>

        <div className="modal__content">
          <div className="modal__badges">
            {tags.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
            <span
              className={`availability ${
                disponivel ? 'is-available' : 'is-unavailable'
              }`}
            >
              {disponivel ? 'Disponível' : 'Indisponível'}
            </span>
          </div>

          <h2 id="product-modal-title">{nome}</h2>
          <p className="modal__description">{descricao}</p>

          {ingredientes.length > 0 && (
            <>
              <h3>Ingredientes</h3>
              <ul className="modal__ingredients">
                {ingredientes.map((ingrediente) => (
                  <li key={ingrediente}>{ingrediente}</li>
                ))}
              </ul>
            </>
          )}

          {alergenicos.length > 0 && (
            <p className="modal__allergens">
              <strong>Contém:</strong> {alergenicos.join(', ')}.
            </p>
          )}

          <div className="modal__order">
            <div className="modal__order-row">
              <span className="modal__order-label">Quantidade</span>
              <div className="quantity-stepper">
                <button
                  type="button"
                  onClick={() =>
                    setQuantidade((atual) => Math.max(1, atual - 1))
                  }
                  disabled={quantidade <= 1}
                  aria-label="Diminuir quantidade"
                >
                  <MinusIcon />
                </button>
                <span aria-live="polite">{quantidade}</span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantidade((atual) => Math.min(20, atual + 1))
                  }
                  disabled={quantidade >= 20}
                  aria-label="Aumentar quantidade"
                >
                  <PlusIcon />
                </button>
              </div>
            </div>

            <label className="modal__note">
              <span>Observação (opcional)</span>
              <input
                type="text"
                value={observacao}
                onChange={(event) => setObservacao(event.target.value)}
                placeholder="Ex.: sem cebola, molho à parte"
                maxLength={140}
              />
            </label>
          </div>

          <div className="modal__footer">
            <div className="modal__total">
              <small>Total</small>
              <strong className="modal__price">
                {formatCurrency(preco * quantidade)}
              </strong>
            </div>
            <button
              type="button"
              className="button button--primary modal__add-button"
              onClick={handleAdicionar}
              disabled={!disponivel}
            >
              {disponivel ? 'Adicionar ao carrinho' : 'Indisponível'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
