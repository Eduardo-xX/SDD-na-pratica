import { useEffect, useState } from 'react'
import { getStoreStatus } from '../utils/storeStatus'

export function StoreStatus() {
  const [status, setStatus] = useState(() => getStoreStatus())

  useEffect(() => {
    const intervalId = setInterval(() => {
      setStatus(getStoreStatus())
    }, 60_000)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div
      className={`store-status ${status.aberto ? 'is-open' : 'is-closed'}`}
      title={status.detalhe}
    >
      <span className="store-status__dot" aria-hidden="true" />
      <span className="store-status__text">
        <strong>{status.label}</strong>
        <small>{status.detalhe}</small>
      </span>
    </div>
  )
}
