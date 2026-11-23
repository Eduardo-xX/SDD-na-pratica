import { formatCurrency } from '../utils/formatCurrency'
import { PAGAMENTOS, gerarLinkWhatsApp } from '../utils/order'

export function OrderSuccess({ pedido, onNovoPedido }) {
  const previsao =
    pedido.tipoEntrega === 'entrega' ? '40–50 min' : '20–30 min'
  const linkWhatsApp = gerarLinkWhatsApp(pedido)

  return (
    <div className="order-success">
      <span className="order-success__icon" aria-hidden="true">
        ✅
      </span>

      <div className="order-success__intro">
        <h3>Pedido confirmado!</h3>
        <p>
          Seu pedido foi registrado. Envie o resumo pelo WhatsApp para
          confirmar os detalhes com a lanchonete.
        </p>
      </div>

      <div className="order-success__number">
        <small>Número do pedido</small>
        <strong>{pedido.numero}</strong>
      </div>

      <div className="order-success__meta">
        <div>
          <small>Tipo</small>
          <strong>
            {pedido.tipoEntrega === 'entrega' ? 'Entrega' : 'Retirada'}
          </strong>
        </div>
        <div>
          <small>Previsão</small>
          <strong>{previsao}</strong>
        </div>
        <div>
          <small>Total</small>
          <strong>{formatCurrency(pedido.total)}</strong>
        </div>
      </div>

      <p className="order-success__payment">
        Pagamento: <strong>{PAGAMENTOS[pedido.pagamento]}</strong>
      </p>

      {pedido.tipoEntrega === 'entrega' && (
        <p className="order-success__address">
          {pedido.endereco}
          {pedido.complemento ? `, ${pedido.complemento}` : ''} —{' '}
          {pedido.bairro}
        </p>
      )}

      <ul className="order-success__items">
        {pedido.itens.map((item, index) => (
          <li key={`${item.id}-${index}`}>
            <span>
              {item.quantidade}x {item.nome}
            </span>
            <span>{formatCurrency(item.precoTotal)}</span>
          </li>
        ))}
      </ul>

      <div className="order-success__actions">
        <a
          className="button button--primary"
          href={linkWhatsApp}
          target="_blank"
          rel="noreferrer"
        >
          Enviar resumo pelo WhatsApp
        </a>
        <button
          type="button"
          className="button button--ghost"
          onClick={onNovoPedido}
        >
          Fazer novo pedido
        </button>
      </div>

      <p className="order-success__note">
        Este pedido foi registrado neste navegador. O envio pelo WhatsApp é o
        que confirma os detalhes com a lanchonete.
      </p>
    </div>
  )
}
