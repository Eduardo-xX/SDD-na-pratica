const ABERTURA_EM_MINUTOS = 18 * 60
const FECHAMENTO_EM_MINUTOS = 23 * 60 + 30

export function getStoreStatus(date = new Date()) {
  const minutos = date.getHours() * 60 + date.getMinutes()
  const aberto = minutos >= ABERTURA_EM_MINUTOS && minutos < FECHAMENTO_EM_MINUTOS

  if (aberto) {
    return {
      aberto: true,
      label: 'Aberto agora',
      detalhe: 'Fecha às 23h30',
    }
  }

  return {
    aberto: false,
    label: 'Fechado agora',
    detalhe: 'Abre às 18h',
  }
}
