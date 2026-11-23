export function CategoryNav({ categorias, ativa, onChange, contagem }) {
  return (
    <nav className="category-nav" aria-label="Categorias do cardápio">
      <div className="category-nav__inner container">
        <ul className="category-nav__list">
          {categorias.map((categoria) => {
            const isAtiva = ativa === categoria.id
            const total = contagem[categoria.id] ?? 0

            return (
              <li key={categoria.id}>
                <button
                  type="button"
                  className={`category-chip ${isAtiva ? 'is-active' : ''}`}
                  aria-pressed={isAtiva}
                  onClick={() => onChange(categoria.id)}
                >
                  <span aria-hidden="true">{categoria.emoji}</span>
                  {categoria.nome}
                  <span className="category-chip__count">{total}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
