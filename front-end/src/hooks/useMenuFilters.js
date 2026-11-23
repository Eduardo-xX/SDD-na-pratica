import { useMemo, useState } from 'react'
import { menu } from '../data/menu'

export const sortOptions = [
  { value: 'destaques', label: 'Destaques' },
  { value: 'nome', label: 'Nome (A–Z)' },
  { value: 'menor-preco', label: 'Menor preço' },
  { value: 'maior-preco', label: 'Maior preço' },
]

function normalizar(texto) {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function compararNome(a, b) {
  return a.nome.localeCompare(b.nome, 'pt-BR')
}

const comparadores = {
  nome: compararNome,
  'menor-preco': (a, b) => a.preco - b.preco || compararNome(a, b),
  'maior-preco': (a, b) => b.preco - a.preco || compararNome(a, b),
}

export function useMenuFilters(produtos = menu) {
  const [busca, setBusca] = useState('')
  const [categoria, setCategoria] = useState('todos')
  const [ordenacao, setOrdenacao] = useState('destaques')

  const produtosFiltrados = useMemo(() => {
    const termo = normalizar(busca)
    const indiceOriginal = new Map(
      produtos.map((produto, index) => [produto.id, index]),
    )

    const filtrados = produtos.filter((produto) => {
      const pertenceACategoria =
        categoria === 'todos' || produto.categoria === categoria

      if (!pertenceACategoria) return false
      if (!termo) return true

      return normalizar(`${produto.nome} ${produto.descricao}`).includes(termo)
    })

    const comparador =
      ordenacao === 'destaques'
        ? (a, b) =>
            Number(b.destaque) - Number(a.destaque) ||
            indiceOriginal.get(a.id) - indiceOriginal.get(b.id)
        : comparadores[ordenacao] ?? comparadores.nome

    return [...filtrados].sort(
      (a, b) =>
        comparador(a, b) || Number(b.disponivel) - Number(a.disponivel),
    )
  }, [produtos, busca, categoria, ordenacao])

  const contagemPorCategoria = useMemo(() => {
    const contagem = { todos: produtos.length }

    for (const produto of produtos) {
      contagem[produto.categoria] = (contagem[produto.categoria] ?? 0) + 1
    }

    return contagem
  }, [produtos])

  const temFiltro = busca.trim() !== '' || categoria !== 'todos'

  function limparFiltros() {
    setBusca('')
    setCategoria('todos')
  }

  return {
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
  }
}
