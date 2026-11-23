import { menu } from '../data/menu'

export const TAXA_ENTREGA = 5
export const MAX_QUANTIDADE = 20
export const CART_STORAGE_KEY = 'brasa-burger:carrinho:v1'

export function normalizarObservacao(observacao) {
  if (typeof observacao !== 'string') return ''

  return observacao.trim().replace(/\s+/g, ' ').slice(0, 140)
}

export function criarLineId(id, observacao) {
  return `${id}::${normalizarObservacao(observacao)}`
}

export function limitarQuantidade(quantidade) {
  const valor = Math.trunc(Number(quantidade) || 1)
  return Math.min(MAX_QUANTIDADE, Math.max(1, valor))
}

export function sanitizarItens(itens) {
  if (!Array.isArray(itens)) return []

  const validos = []

  for (const item of itens) {
    if (!item || typeof item !== 'object') continue

    const produto = menu.find((produto) => produto.id === item.id)
    if (!produto || !produto.disponivel) continue

    const observacao = normalizarObservacao(item.observacao)
    const lineId = criarLineId(produto.id, observacao)
    const quantidade = limitarQuantidade(item.quantidade)
    const existente = validos.find((entrada) => entrada.lineId === lineId)

    if (existente) {
      existente.quantidade = limitarQuantidade(
        existente.quantidade + quantidade,
      )
    } else {
      validos.push({ lineId, id: produto.id, quantidade, observacao })
    }
  }

  return validos
}

export function carregarCarrinho() {
  const padrao = { itens: [], tipoEntrega: 'entrega' }

  try {
    if (typeof localStorage === 'undefined') return padrao

    const salvo = localStorage.getItem(CART_STORAGE_KEY)
    if (!salvo) return padrao

    const dados = JSON.parse(salvo)

    return {
      itens: sanitizarItens(dados?.itens),
      tipoEntrega: dados?.tipoEntrega === 'retirada' ? 'retirada' : 'entrega',
    }
  } catch {
    return padrao
  }
}

export function cartReducer(state, action) {
  switch (action.type) {
    case 'adicionar': {
      const { id, quantidade, observacao } = action.payload
      const produto = menu.find((produto) => produto.id === id)

      if (!produto?.disponivel) return state

      const observacaoNormalizada = normalizarObservacao(observacao)
      const lineId = criarLineId(id, observacaoNormalizada)
      const quantidadeAdicionada = limitarQuantidade(quantidade)
      const existente = state.itens.find((item) => item.lineId === lineId)

      if (existente) {
        return {
          ...state,
          itens: state.itens.map((item) =>
            item.lineId === lineId
              ? {
                  ...item,
                  quantidade: limitarQuantidade(
                    item.quantidade + quantidadeAdicionada,
                  ),
                }
              : item,
          ),
        }
      }

      return {
        ...state,
        itens: [
          ...state.itens,
          {
            lineId,
            id,
            quantidade: quantidadeAdicionada,
            observacao: observacaoNormalizada,
          },
        ],
      }
    }

    case 'incrementar':
      return {
        ...state,
        itens: state.itens.map((item) =>
          item.lineId === action.lineId
            ? {
                ...item,
                quantidade: limitarQuantidade(item.quantidade + 1),
              }
            : item,
        ),
      }

    case 'decrementar':
      return {
        ...state,
        itens: state.itens.flatMap((item) => {
          if (item.lineId !== action.lineId) return [item]
          if (item.quantidade <= 1) return []

          return [{ ...item, quantidade: item.quantidade - 1 }]
        }),
      }

    case 'remover':
      return {
        ...state,
        itens: state.itens.filter((item) => item.lineId !== action.lineId),
      }

    case 'limpar':
      return { ...state, itens: [] }

    case 'tipo-entrega':
      return {
        ...state,
        tipoEntrega: action.tipoEntrega === 'retirada' ? 'retirada' : 'entrega',
      }

    default:
      return state
  }
}
