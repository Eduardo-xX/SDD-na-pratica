import { useCart } from '../hooks/useCart'
import { formatCurrency } from '../utils/formatCurrency'
import { CartIcon, PlusIcon } from './Icons'
import { TagBadge } from './TagBadge'

export function ProductCard({ produto, onOpen }) {
  const { adicionarItem, itens } = useCart()
  const { nome, descricao, preco, categoria, emoji, disponivel, tags } = produto

  const quantidadeNoCarrinho = itens.reduce(
    (total, item) =>
      item.id === produto.id ? total + item.quantidade : total,
    0,
  )

  return (
    <article
      className={`product-card product-card--${categoria} ${
        disponivel ? '' : 'is-unavailable'
      }`}
    >
      <div className="product-card__media">
        <span className="product-card__emoji" aria-hidden="true">
          {emoji}
        </span>

        {tags.length > 0 && (
          <div className="product-card__badges">
            {tags.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
        )}

        {quantidadeNoCarrinho > 0 && (
          <span
            className="product-card__in-cart"
            aria-label={`${quantidadeNoCarrinho} no carrinho`}
          >
            <CartIcon />
            {quantidadeNoCarrinho}
          </span>
        )}

        {!disponivel && (
          <span className="product-card__unavailable">Indisponível</span>
        )}
      </div>

      <div className="product-card__body">
        <div className="product-card__heading">
          <h3 className="product-card__name">{nome}</h3>
          <span className="product-card__price">{formatCurrency(preco)}</span>
        </div>
        <p className="product-card__description">{descricao}</p>

        <div className="product-card__actions">
          <button
            type="button"
            className="product-card__details"
            onClick={() => onOpen(produto)}
          >
            Ver detalhes
          </button>

          <button
            type="button"
            className="product-card__add"
            onClick={() => adicionarItem(produto.id)}
            disabled={!disponivel}
            aria-label={
              disponivel
                ? `Adicionar ${nome} ao carrinho`
                : `${nome} está indisponível`
            }
          >
            {disponivel ? (
              <>
                <PlusIcon />
                Adicionar
              </>
            ) : (
              'Indisponível'
            )}
          </button>
        </div>
      </div>
    </article>
  )
}
