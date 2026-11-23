import { ProductCard } from './ProductCard'

export function ProductGrid({ produtos, onOpen }) {
  return (
    <div className="product-grid">
      {produtos.map((produto) => (
        <ProductCard key={produto.id} produto={produto} onOpen={onOpen} />
      ))}
    </div>
  )
}
