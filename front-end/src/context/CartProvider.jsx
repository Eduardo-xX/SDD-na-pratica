import { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import { menu } from '../data/menu'
import {
  CART_STORAGE_KEY,
  TAXA_ENTREGA,
  carregarCarrinho,
  cartReducer,
} from '../utils/cart'
import { CartContext } from './cart-context'

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, carregarCarrinho)
  const [carrinhoAberto, setCarrinhoAberto] = useState(false)
  const [notificacao, setNotificacao] = useState(null)

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state))
    } catch {
      // Sem acesso ao localStorage: o carrinho continua funcionando em memória.
    }
  }, [state])

  const itens = useMemo(
    () =>
      state.itens
        .map((item) => {
          const produto = menu.find((produto) => produto.id === item.id)
          if (!produto) return null

          return {
            ...item,
            produto,
            precoTotal: produto.preco * item.quantidade,
          }
        })
        .filter(Boolean),
    [state.itens],
  )

  const quantidadeTotal = useMemo(
    () => itens.reduce((total, item) => total + item.quantidade, 0),
    [itens],
  )

  const subtotal = useMemo(
    () => itens.reduce((total, item) => total + item.precoTotal, 0),
    [itens],
  )

  const taxaEntrega =
    state.tipoEntrega === 'entrega' && itens.length > 0 ? TAXA_ENTREGA : 0
  const total = subtotal + taxaEntrega

  const adicionarItem = useCallback((id, quantidade = 1, observacao = '') => {
    const produto = menu.find((produto) => produto.id === id)
    if (!produto?.disponivel) return

    dispatch({ type: 'adicionar', payload: { id, quantidade, observacao } })
    setNotificacao({
      id: Date.now(),
      mensagem: `${produto.nome} adicionado ao carrinho`,
    })
  }, [])

  const incrementarItem = useCallback((lineId) => {
    dispatch({ type: 'incrementar', lineId })
  }, [])

  const decrementarItem = useCallback((lineId) => {
    dispatch({ type: 'decrementar', lineId })
  }, [])

  const removerItem = useCallback((lineId) => {
    dispatch({ type: 'remover', lineId })
  }, [])

  const limparCarrinho = useCallback(() => {
    dispatch({ type: 'limpar' })
  }, [])

  const selecionarTipoEntrega = useCallback((tipoEntrega) => {
    dispatch({ type: 'tipo-entrega', tipoEntrega })
  }, [])

  const abrirCarrinho = useCallback(() => {
    setNotificacao(null)
    setCarrinhoAberto(true)
  }, [])
  const fecharCarrinho = useCallback(() => setCarrinhoAberto(false), [])
  const fecharNotificacao = useCallback(() => setNotificacao(null), [])

  const value = {
    itens,
    quantidadeTotal,
    subtotal,
    taxaEntrega,
    total,
    tipoEntrega: state.tipoEntrega,
    carrinhoAberto,
    notificacao,
    adicionarItem,
    incrementarItem,
    decrementarItem,
    removerItem,
    limparCarrinho,
    selecionarTipoEntrega,
    abrirCarrinho,
    fecharCarrinho,
    fecharNotificacao,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
