import { StoreStatus } from './StoreStatus'

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero__inner container">
        <div className="hero__content">
          <div className="hero__status">
            <StoreStatus />
          </div>

          <span className="hero__eyebrow">Cardápio digital</span>
          <h1>
            Feito na brasa,
            <br />
            <em>do jeito que você gosta.</em>
          </h1>
          <p>
            Consulte os produtos disponíveis, confira os preços e descubra a
            descrição de cada item. Simples, rápido e sem sair da página.
          </p>
          <a className="button button--primary" href="#cardapio">
            Ver cardápio
          </a>
          <ul className="hero__highlights">
            <li>Ingredientes frescos</li>
            <li>Feito na hora</li>
            <li>Retirada e entrega</li>
          </ul>
        </div>

        <div className="hero__art" aria-hidden="true">
          <div className="hero__plate">
            <span className="hero__food">🍔</span>
            <span className="hero__side hero__side--fries">🍟</span>
            <span className="hero__side hero__side--drink">🥤</span>
          </div>
        </div>
      </div>
    </section>
  )
}
