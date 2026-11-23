import { useState } from 'react'
import { useCart } from '../hooks/useCart'
import { formatCurrency } from '../utils/formatCurrency'
import { PAGAMENTOS } from '../utils/order'

const FORM_INICIAL = {
  nome: '',
  telefone: '',
  endereco: '',
  complemento: '',
  bairro: '',
  pagamento: 'pix',
  troco: '',
  observacoes: '',
}

export function CheckoutForm({ onConfirm }) {
  const {
    itens,
    quantidadeTotal,
    subtotal,
    taxaEntrega,
    total,
    tipoEntrega,
    selecionarTipoEntrega,
  } = useCart()

  const [form, setForm] = useState(FORM_INICIAL)
  const [erros, setErros] = useState({})

  function atualizarCampo(campo, valor) {
    setForm((anterior) => ({ ...anterior, [campo]: valor }))
    setErros((anteriores) => {
      if (!anteriores[campo]) return anteriores

      const proximos = { ...anteriores }
      delete proximos[campo]
      return proximos
    })
  }

  function escolherTipo(tipo) {
    selecionarTipoEntrega(tipo)

    if (tipo === 'retirada') {
      setErros((anteriores) =>
        Object.fromEntries(
          Object.entries(anteriores).filter(
            ([campo]) => campo !== 'endereco' && campo !== 'bairro',
          ),
        ),
      )
    }
  }

  function validar() {
    const novosErros = {}
    const telefone = form.telefone.replace(/\D/g, '')

    if (form.nome.trim().length < 3) {
      novosErros.nome = 'Informe seu nome completo.'
    }

    if (telefone.length < 10 || telefone.length > 11) {
      novosErros.telefone = 'Informe um telefone com DDD.'
    }

    if (tipoEntrega === 'entrega') {
      if (form.endereco.trim().length < 5) {
        novosErros.endereco = 'Informe a rua e o número.'
      }

      if (form.bairro.trim().length < 2) {
        novosErros.bairro = 'Informe o bairro.'
      }
    }

    if (form.pagamento === 'dinheiro' && form.troco.trim()) {
      const troco = Number(form.troco.replace(',', '.'))

      if (!Number.isFinite(troco) || troco < total) {
        novosErros.troco = `O troco deve ser igual ou maior que ${formatCurrency(total)}.`
      }
    }

    setErros(novosErros)

    const primeiroCampo = Object.keys(novosErros)[0]
    if (primeiroCampo) {
      requestAnimationFrame(() => {
        document.getElementById(`checkout-${primeiroCampo}`)?.focus()
      })
    }

    return Object.keys(novosErros).length === 0
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!validar()) return

    onConfirm({
      nome: form.nome.trim(),
      telefone: form.telefone.trim(),
      endereco: form.endereco.trim(),
      complemento: form.complemento.trim(),
      bairro: form.bairro.trim(),
      pagamento: form.pagamento,
      troco: form.pagamento === 'dinheiro' ? form.troco.trim() : '',
      observacoes: form.observacoes.trim(),
      tipoEntrega,
      subtotal,
      taxaEntrega,
      total,
      itens: itens.map((item) => ({
        id: item.produto.id,
        nome: item.produto.nome,
        emoji: item.produto.emoji,
        quantidade: item.quantidade,
        observacao: item.observacao,
        precoUnitario: item.produto.preco,
        precoTotal: item.precoTotal,
      })),
    })
  }

  return (
    <form className="checkout" onSubmit={handleSubmit} noValidate>
      <div className="checkout__fields">
        <div className="field">
          <label htmlFor="checkout-nome">Nome completo *</label>
          <input
            id="checkout-nome"
            type="text"
            value={form.nome}
            onChange={(event) => atualizarCampo('nome', event.target.value)}
            placeholder="Como podemos chamar você?"
            autoComplete="name"
            aria-invalid={Boolean(erros.nome)}
            aria-describedby={erros.nome ? 'checkout-nome-error' : undefined}
            autoFocus
          />
          {erros.nome && (
            <p className="field-error" id="checkout-nome-error" role="alert">
              {erros.nome}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="checkout-telefone">Telefone *</label>
          <input
            id="checkout-telefone"
            type="tel"
            inputMode="tel"
            value={form.telefone}
            onChange={(event) => atualizarCampo('telefone', event.target.value)}
            placeholder="(11) 99999-0000"
            autoComplete="tel"
            aria-invalid={Boolean(erros.telefone)}
            aria-describedby={
              erros.telefone ? 'checkout-telefone-error' : undefined
            }
          />
          {erros.telefone && (
            <p
              className="field-error"
              id="checkout-telefone-error"
              role="alert"
            >
              {erros.telefone}
            </p>
          )}
        </div>

        <div className="checkout__section">
          <span className="checkout__label">Tipo de pedido *</span>
          <div
            className="delivery-toggle"
            role="group"
            aria-label="Tipo de pedido"
          >
            <button
              type="button"
              className={tipoEntrega === 'entrega' ? 'is-active' : ''}
              aria-pressed={tipoEntrega === 'entrega'}
              onClick={() => escolherTipo('entrega')}
            >
              Entrega
            </button>
            <button
              type="button"
              className={tipoEntrega === 'retirada' ? 'is-active' : ''}
              aria-pressed={tipoEntrega === 'retirada'}
              onClick={() => escolherTipo('retirada')}
            >
              Retirada
            </button>
          </div>
        </div>

        {tipoEntrega === 'entrega' && (
          <>
            <div className="field">
              <label htmlFor="checkout-endereco">Rua e número *</label>
              <input
                id="checkout-endereco"
                type="text"
                value={form.endereco}
                onChange={(event) =>
                  atualizarCampo('endereco', event.target.value)
                }
                placeholder="Rua das Flores, 123"
                autoComplete="street-address"
                aria-invalid={Boolean(erros.endereco)}
                aria-describedby={
                  erros.endereco ? 'checkout-endereco-error' : undefined
                }
              />
              {erros.endereco && (
                <p
                  className="field-error"
                  id="checkout-endereco-error"
                  role="alert"
                >
                  {erros.endereco}
                </p>
              )}
            </div>

            <div className="checkout__row">
              <div className="field">
                <label htmlFor="checkout-complemento">Complemento</label>
                <input
                  id="checkout-complemento"
                  type="text"
                  value={form.complemento}
                  onChange={(event) =>
                    atualizarCampo('complemento', event.target.value)
                  }
                  placeholder="Apto, bloco..."
                />
              </div>

              <div className="field">
                <label htmlFor="checkout-bairro">Bairro *</label>
                <input
                  id="checkout-bairro"
                  type="text"
                  value={form.bairro}
                  onChange={(event) =>
                    atualizarCampo('bairro', event.target.value)
                  }
                  placeholder="Vila Mariana"
                  aria-invalid={Boolean(erros.bairro)}
                  aria-describedby={
                    erros.bairro ? 'checkout-bairro-error' : undefined
                  }
                />
                {erros.bairro && (
                  <p
                    className="field-error"
                    id="checkout-bairro-error"
                    role="alert"
                  >
                    {erros.bairro}
                  </p>
                )}
              </div>
            </div>
          </>
        )}

        <fieldset className="payment-options">
          <legend className="checkout__label">Forma de pagamento *</legend>
          {Object.entries(PAGAMENTOS).map(([valor, rotulo]) => (
            <label key={valor} className="payment-option">
              <input
                type="radio"
                name="pagamento"
                value={valor}
                checked={form.pagamento === valor}
                onChange={() => atualizarCampo('pagamento', valor)}
              />
              <span>{rotulo}</span>
            </label>
          ))}
        </fieldset>

        {form.pagamento === 'dinheiro' && (
          <div className="field">
            <label htmlFor="checkout-troco">Troco para</label>
            <input
              id="checkout-troco"
              type="text"
              inputMode="decimal"
              value={form.troco}
              onChange={(event) => atualizarCampo('troco', event.target.value)}
              placeholder="Ex.: 100,00"
              aria-invalid={Boolean(erros.troco)}
              aria-describedby={erros.troco ? 'checkout-troco-error' : undefined}
            />
            {erros.troco && (
              <p className="field-error" id="checkout-troco-error" role="alert">
                {erros.troco}
              </p>
            )}
          </div>
        )}

        <div className="field">
          <label htmlFor="checkout-observacoes">Observações do pedido</label>
          <textarea
            id="checkout-observacoes"
            rows="3"
            value={form.observacoes}
            onChange={(event) =>
              atualizarCampo('observacoes', event.target.value)
            }
            placeholder="Ponto de referência, preferências..."
          />
        </div>
      </div>

      <div className="checkout__summary">
        <h3>Resumo do pedido</h3>
        <ul>
          {itens.map((item) => (
            <li key={item.lineId}>
              <span>
                {item.quantidade}x {item.produto.nome}
              </span>
              <span>{formatCurrency(item.precoTotal)}</span>
            </li>
          ))}
        </ul>

        <dl>
          <div className="cart-summary__row">
            <dt>
            Subtotal ({quantidadeTotal}{' '}
            {quantidadeTotal === 1 ? 'item' : 'itens'})
          </dt>
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
      </div>

      <button
        type="submit"
        className="button button--primary checkout__submit"
      >
        Confirmar pedido
      </button>
    </form>
  )
}
