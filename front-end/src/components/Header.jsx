import { CartButton } from './CartButton'
import { SearchBar } from './SearchBar'
import { StoreStatus } from './StoreStatus'

export function Header({ busca, onBuscaChange }) {
  return (
    <header className="header">
      <div className="header__inner container">
        <a className="brand" href="#top" aria-label="Brasa Burger — início">
          <span className="brand__mark" aria-hidden="true">
            🍔
          </span>
          <span className="brand__text">
            <span className="brand__name">Brasa Burger</span>
            <span className="brand__tagline">Hamburgueria artesanal</span>
          </span>
        </a>

        <div className="header__search">
          <SearchBar value={busca} onChange={onBuscaChange} />
        </div>

        <div className="header__actions">
          <div className="header__status">
            <StoreStatus />
          </div>
          <CartButton />
        </div>
      </div>
    </header>
  )
}
