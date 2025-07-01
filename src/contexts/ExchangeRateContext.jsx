import { createContext, useContext, useEffect } from 'react'
import useStore from '../store/useStore'
import { useExchangeRate } from '../hooks/useWordPressAPI'

const ExchangeRateContext = createContext({})

export const useExchangeRateContext = () => {
  const context = useContext(ExchangeRateContext)
  if (!context) {
    throw new Error('useExchangeRateContext debe ser usado dentro de ExchangeRateProvider')
  }
  return context
}

export const ExchangeRateProvider = ({ children }) => {
  const { exchangeRate, convertToUsd, convertToBs } = useStore()
  const { fetchExchangeRate, loading, error } = useExchangeRate()

  // Obtener tasa de cambio al cargar la aplicación
  useEffect(() => {
    const loadExchangeRate = async () => {
      // Solo cargar si no hay tasa o si es muy antigua (más de 1 hora)
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
      const lastUpdated = exchangeRate.lastUpdated ? new Date(exchangeRate.lastUpdated) : null
      
      if (!exchangeRate.rate || !lastUpdated || lastUpdated < oneHourAgo) {
        try {
          await fetchExchangeRate()
        } catch (error) {
          console.error('Error al obtener tasa de cambio:', error)
        }
      }
    }

    loadExchangeRate()
  }, [])

  // Actualizar tasa cada hora
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await fetchExchangeRate()
      } catch (error) {
        console.error('Error al actualizar tasa de cambio:', error)
      }
    }, 60 * 60 * 1000) // 1 hora

    return () => clearInterval(interval)
  }, [fetchExchangeRate])

  const value = {
    exchangeRate,
    loading,
    error,
    convertToUsd,
    convertToBs,
    refreshRate: fetchExchangeRate
  }

  return (
    <ExchangeRateContext.Provider value={value}>
      {children}
    </ExchangeRateContext.Provider>
  )
}

export default ExchangeRateContext