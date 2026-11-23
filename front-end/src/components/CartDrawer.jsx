import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useCart } from '../hooks/useCart'
import { useDialogFocus } from '../hooks/useDialogFocus'
import { formatCurrency } from '../utils/formatCurrency'
import { gerarNumeroPedido } from '../utils/order'
import { CartLine } from './CartLine'
import { CheckoutForm } from './CheckoutForm'
import { ArrowLeftIcon, CloseIcon } from './Icons'
import { OrderSuccess } from './OrderSuccess'

export function CartDrawer() {
  const {
    itens,
    quantidadeTotal,
    subtotal,
    taxaEntrega,
    total,
    tipoEntrega,
    selecionarTipoEntrega,
    fecharCarrinho,
    limparCarrinho,
  } = useCart()

  const [etapa, setEtapa] = useState('carrinho')
  const [pedido, setPedido] = useState(null)
  const dialogRef = useRef(null)
  const closeButtonRef = useRef(null)

  useDialogFocus(dialogRef, closeButtonRef, fecharCarrinho)

  useEffect(() => {
    if (etapa === 'sucesso') {
      document.getElementById('cart-drawer-title')?.focus()
    }
  }, [etapa])

  const titulos = {
    carrinho: `Seu carrinho${quantidadeTotal > 0 ? ` (${quantidadeTotal})` : ''}`,
    checkout: 'Finalizar pedido',
    sucesso: 'Pedido confirmado',
  }

  function confirmarPedido(dados) {
    setPedido({
      numero: gerarNumeroPedido(),
      ...dados,
      criadoEm: new Date().toISOString(),
    })
    setEtapa('sucesso')
    limparCarrinho()
  }

  function novoPedido() {
    fecharCarrinho()
    requestAnimationFrame(() => {
      document
        .getElementById('cardapio')
        ?.scrollIntoView({ behavior: 'smooth' })
    })
  }

  return createPortal(
    <div
      className="cart-overlay"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) fecharCarrinho()
      }}
    >
      <aside
        ref={dialogRef}
        className="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
      >
        <header className="cart-drawer__header">
          {etapa === 'checkout' ? (
            <button
              type="button"
              className="icon-button"
              onClick={() => setEtapa('carrinho')}
              aria-label="Voltar ao carrinho"
            >
              <ArrowLeftIcon />
            </button>
          ) : (
            <span className="cart-drawer__spacer" aria-hidden="true" />
          )}

          <h2 id="cart-drawer-title" tabIndex="-1">
            {titulos[etapa]}
          </h2>

          <button
            ref={closeButtonRef}
            type="button"
            className="icon-button"
            onClick={fecharCarrinho}
            aria-label="Fechar carrinho"
          >
            <CloseIcon />
          </button>
        </header>

        <div className="cart-drawer__body">
          {etapa === 'carrinho' &&
            (itens.length === 0 ? (
              <div className="cart-empty">
                <span className="cart-empty__emoji" aria-hidden="true">
                  🛒
                </span>
                <h3>Seu carrinho está vazio</h3>
                <p>
                  Adicione produtos do cardápio para montar o seu pedido.
                </p>
                <a
                  className="button button--primary"
                  href="#cardapio"
                  onClick={fecharCarrinho}
                >
                  Ver cardápio
                </a>
              </div>
            ) : (
              <>
                <ul className="cart-list">
                  {itens.map((item) => (
                    <CartLine key={item.lineId} item={item} />
                  ))}
                </ul>

                <div className="cart-summary">
                  <div
                    className="delivery-toggle"
                    role="group"
                    aria-label="Tipo de pedido"
                  >
                    <button
                      type="button"
                      className={tipoEntrega === 'entrega' ? 'is-active' : ''}
                      aria-pressed={tipoEntrega === 'entrega'}
                      onClick={() => selecionarTipoEntrega('entrega')}
                    >
                      Entrega
                    </button>
                    <button
                      type="button"
                      className={tipoEntrega === 'retirada' ? 'is-active' : ''}
                      aria-pressed={tipoEntrega === 'retirada'}
                      onClick={() => selecionarTipoEntrega('retirada')}
                    >
                      Retirada
                    </button>
                  </div>

                  <dl>
                    <div className="cart-summary__row">
                      <dt>Subtotal</dt>
                      <dd>{formatCurrency(subtotal)}</dd>
                    </div>
                    <div className="cart-summary__row">
                      <dt>Entrega</dt>
                      <dd>
                        {tipoEntrega === 'entrega'
                          ? formatCurrency(taxaEntrega)
                          : 'Grátis'}
                      </dd>
                    </div>
                    <div className="cart-summary__row cart-summary__total">
                      <dt>Total</dt>
                      <dd>{formatCurrency(total)}</dd>
                    </div>
                  </dl>

                  <p className="cart-summary__note">
                    {tipoEntrega === 'entrega'
                      ? 'Entrega estimada em 40–50 min.'
                      : 'Retirada na Rua das Brasas, 123 — em até 20–30 min.'}
                  </p>
                </div>
              </>
            ))}

          {etapa === 'checkout' && (
            <CheckoutForm onConfirm={confirmarPedido} />
          )}

          {etapa === 'sucesso' && pedido && (
            <OrderSuccess pedido={pedido} onNovoPedido={novoPedido} />
          )}
        </div>

        {etapa === 'carrinho' && itens.length > 0 && (
          <footer className="cart-drawer__footer">
            <div className="cart-drawer__footer-total">
              <div>
                <small>Total</small>
                <strong>{formatCurrency(total)}</strong>
              </div>
              <span>
                {quantidadeTotal}{' '}
                {quantidadeTotal === 1 ? 'item' : 'itens'}
              </span>
            </div>
            <button
              type="button"
              className="button button--primary cart-drawer__checkout"
              onClick={() => setEtapa('checkout')}
            >
              Finalizar compra
            </button>
          </footer>
        )}
      </aside>
    </div>,
    document.body,
  )
}
