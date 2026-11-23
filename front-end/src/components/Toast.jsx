import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useCart } from '../hooks/useCart'

export function Toast() {
  const {
    notificacao,
    fecharNotificacao,
    abrirCarrinho,
    carrinhoAberto,
  } = useCart()

  useEffect(() => {
    if (!notificacao) return undefined

    const timeoutId = setTimeout(fecharNotificacao, 4000)
    return () => clearTimeout(timeoutId)
  }, [notificacao, fecharNotificacao])

  if (!notificacao || carrinhoAberto) return null

  return createPortal(
    <div className="toast" role="status" aria-live="polite">
      <span className="toast__message">
        <span className="toast__check" aria-hidden="true">
          ✓
        </span>
        {notificacao.mensagem}
      </span>
      <button
        type="button"
        className="toast__action"
        onClick={() => {
          fecharNotificacao()
          abrirCarrinho()
        }}
      >
        Ver carrinho
      </button>
    </div>,
    document.body,
  )
}
