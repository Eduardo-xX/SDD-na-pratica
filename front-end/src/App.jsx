import { useCallback, useState } from 'react'
import './App.css'
import { CartDrawer } from './components/CartDrawer'
import { CategoryNav } from './components/CategoryNav'
import { EmptyState } from './components/EmptyState'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { MobileCartBar } from './components/MobileCartBar'
import { ProductGrid } from './components/ProductGrid'
import { ProductModal } from './components/ProductModal'
import { Toast } from './components/Toast'
import { CartProvider } from './context/CartProvider'
import { categories } from './data/categories'
import { menu } from './data/menu'
import { useCart } from './hooks/useCart'
import { sortOptions, useMenuFilters } from './hooks/useMenuFilters'

function AppContent() {
  const [produtoSelecionado, setProdutoSelecionado] = useState(null)
  const { carrinhoAberto } = useCart()

  const {
    busca,
    setBusca,
    categoria,
    setCategoria,
    ordenacao,
    setOrdenacao,
    produtosFiltrados,
    contagemPorCategoria,
    temFiltro,
    limparFiltros,
  } = useMenuFilters(menu)

  const abrirProduto = useCallback((produto) => {
    setProdutoSelecionado(produto)
  }, [])

  const fecharProduto = useCallback(() => {
    setProdutoSelecionado(null)
  }, [])

  const total = produtosFiltrados.length

  return (
    <>
      <Header busca={busca} onBuscaChange={setBusca} />

      <main>
        <Hero />

        <CategoryNav
          categorias={categories}
          ativa={categoria}
          onChange={setCategoria}
          contagem={contagemPorCategoria}
        />

        <section
          className="menu container"
          id="cardapio"
          aria-labelledby="menu-title"
        >
          <div className="menu__intro">
            <h2 id="menu-title">Nosso cardápio</h2>
            <p>Escolha uma categoria ou busque pelo nome do produto.</p>
          </div>

          <div className="menu__toolbar">
            <p className="menu__count" aria-live="polite">
              <strong>{total}</strong>{' '}
              {total === 1 ? 'produto encontrado' : 'produtos encontrados'}
            </p>

            <label className="sort-select">
              <span>Ordenar por</span>
              <select
                value={ordenacao}
                onChange={(event) => setOrdenacao(event.target.value)}
              >
                {sortOptions.map((opcao) => (
                  <option key={opcao.value} value={opcao.value}>
                    {opcao.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {total > 0 ? (
            <ProductGrid produtos={produtosFiltrados} onOpen={abrirProduto} />
          ) : (
            <EmptyState onClear={limparFiltros} />
          )}

          {temFiltro && total > 0 && (
            <div className="menu__reset">
              <button
                type="button"
                className="button button--ghost"
                onClick={limparFiltros}
              >
                Limpar filtros
              </button>
            </div>
          )}
        </section>
      </main>

      <Footer />

      {produtoSelecionado && (
        <ProductModal produto={produtoSelecionado} onClose={fecharProduto} />
      )}

      {carrinhoAberto && <CartDrawer />}

      <Toast />
      <MobileCartBar />
    </>
  )
}

function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  )
}

export default App
