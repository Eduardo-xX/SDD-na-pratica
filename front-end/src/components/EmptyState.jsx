export function EmptyState({ onClear }) {
  return (
    <div className="empty-state">
      <span className="empty-state__emoji" aria-hidden="true">
        🔎
      </span>
      <h3>Nenhum produto encontrado</h3>
      <p>
        Tente buscar por outra palavra ou escolha uma categoria diferente do
        cardápio.
      </p>
      <button type="button" className="button button--ghost" onClick={onClear}>
        Limpar filtros
      </button>
    </div>
  )
}
