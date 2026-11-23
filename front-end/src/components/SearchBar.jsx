import { CloseIcon, SearchIcon } from './Icons'

export function SearchBar({
  value,
  onChange,
  placeholder = 'Buscar no cardápio...',
}) {
  return (
    <div className="search-bar">
      <SearchIcon className="search-bar__icon" />
      <input
        id="busca-cardapio"
        type="search"
        className="search-bar__input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label="Buscar produtos no cardápio"
        autoComplete="off"
      />
      {value && (
        <button
          type="button"
          className="search-bar__clear"
          onClick={() => onChange('')}
          aria-label="Limpar busca"
        >
          <CloseIcon />
        </button>
      )}
    </div>
  )
}
