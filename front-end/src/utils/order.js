import { formatCurrency } from './formatCurrency'

const WHATSAPP_NUMERO = '5511999990000'

export const PAGAMENTOS = {
  pix: 'Pix',
  cartao: 'Cartão na entrega',
  dinheiro: 'Dinheiro',
}

export function gerarNumeroPedido() {
  const agora = new Date()
  const dia = String(agora.getDate()).padStart(2, '0')
  const mes = String(agora.getMonth() + 1).padStart(2, '0')
  const sufixo = Math.floor(1000 + Math.random() * 9000)

  return `BB-${dia}${mes}-${sufixo}`
}

export function gerarMensagemPedido(pedido) {
  const linhas = [
    `*Novo pedido ${pedido.numero}*`,
    '',
    `*Nome:* ${pedido.nome}`,
    `*Telefone:* ${pedido.telefone}`,
    `*Tipo:* ${pedido.tipoEntrega === 'entrega' ? 'Entrega' : 'Retirada'}`,
  ]

  if (pedido.tipoEntrega === 'entrega') {
    const complemento = pedido.complemento ? `, ${pedido.complemento}` : ''
    linhas.push(`*Endereço:* ${pedido.endereco}${complemento} — ${pedido.bairro}`)
  }

  linhas.push(`*Pagamento:* ${PAGAMENTOS[pedido.pagamento] ?? pedido.pagamento}`)

  if (pedido.pagamento === 'dinheiro' && pedido.troco) {
    linhas.push(`*Troco para:* R$ ${pedido.troco}`)
  }

  linhas.push('', '*Itens:*')

  for (const item of pedido.itens) {
    linhas.push(
      `${item.quantidade}x ${item.nome} — ${formatCurrency(item.precoTotal)}`,
    )
    if (item.observacao) {
      linhas.push(`   Obs.: ${item.observacao}`)
    }
  }

  linhas.push('', `Subtotal: ${formatCurrency(pedido.subtotal)}`)

  if (pedido.taxaEntrega > 0) {
    linhas.push(`Entrega: ${formatCurrency(pedido.taxaEntrega)}`)
  }

  linhas.push(`*Total: ${formatCurrency(pedido.total)}*`)

  if (pedido.observacoes) {
    linhas.push('', `*Observações:* ${pedido.observacoes}`)
  }

  return linhas.join('\n')
}

export function gerarLinkWhatsApp(pedido) {
  const mensagem = gerarMensagemPedido(pedido)

  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`
}
