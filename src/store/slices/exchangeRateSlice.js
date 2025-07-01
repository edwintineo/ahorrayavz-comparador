// Slice de tasa de cambio
export const createExchangeRateSlice = (set, get) => ({
  // Estado
  exchangeRate: {
    rate: 0,
    lastUpdated: null,
    loading: false,
    error: null
  },
  
  // Acciones
  setExchangeRate: (rate) => set((state) => ({
    exchangeRate: {
      ...state.exchangeRate,
      rate,
      lastUpdated: new Date().toISOString(),
      loading: false,
      error: null
    }
  })),
  
  setExchangeRateLoading: (loading) => set((state) => ({
    exchangeRate: {
      ...state.exchangeRate,
      loading
    }
  })),
  
  setExchangeRateError: (error) => set((state) => ({
    exchangeRate: {
      ...state.exchangeRate,
      loading: false,
      error
    }
  })),
  
  // Utilidades de conversión
  convertToUsd: (priceBs) => {
    const { exchangeRate } = get()
    return exchangeRate.rate > 0 ? priceBs / exchangeRate.rate : 0
  },
  
  convertToBs: (priceUsd) => {
    const { exchangeRate } = get()
    return priceUsd * exchangeRate.rate
  },
  
  // Getters
  getCurrentRate: () => get().exchangeRate.rate,
  isRateLoading: () => get().exchangeRate.loading,
  getRateError: () => get().exchangeRate.error
})