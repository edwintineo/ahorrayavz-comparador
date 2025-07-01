import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Store principal de la aplicación
const useStore = create(
  persist(
    (set, get) => ({
      // Estado de autenticación
      user: null,
      token: null,
      isAuthenticated: false,
      
      // Estado de la tasa de cambio
      exchangeRate: {
        rate: 0,
        lastUpdated: null,
        loading: false,
        error: null
      },
      
      // Estado de búsqueda
      searchState: {
        query: '',
        filters: {
          category: '',
          priceRange: [0, 1000],
          location: null,
          sortBy: 'relevance'
        },
        results: [],
        loading: false,
        error: null
      },
      
      // Estado del carrito/lista de compras
      shoppingList: {
        items: [],
        totalBs: 0,
        totalUsd: 0
      },
      
      // Estado de geolocalización
      location: {
        latitude: null,
        longitude: null,
        city: '',
        state: '',
        error: null
      },
      
      // Acciones de autenticación
      setUser: (user, token) => set({ 
        user, 
        token, 
        isAuthenticated: !!user 
      }),
      
      logout: () => set({ 
        user: null, 
        token: null, 
        isAuthenticated: false 
      }),
      
      // Acciones de tasa de cambio
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
      
      // Acciones de búsqueda
      setSearchQuery: (query) => set((state) => ({
        searchState: {
          ...state.searchState,
          query
        }
      })),
      
      setSearchFilters: (filters) => set((state) => ({
        searchState: {
          ...state.searchState,
          filters: {
            ...state.searchState.filters,
            ...filters
          }
        }
      })),
      
      setSearchResults: (results) => set((state) => ({
        searchState: {
          ...state.searchState,
          results,
          loading: false,
          error: null
        }
      })),
      
      setSearchLoading: (loading) => set((state) => ({
        searchState: {
          ...state.searchState,
          loading
        }
      })),
      
      setSearchError: (error) => set((state) => ({
        searchState: {
          ...state.searchState,
          loading: false,
          error
        }
      })),
      
      // Acciones de lista de compras
      addToShoppingList: (product) => set((state) => {
        const existingItem = state.shoppingList.items.find(
          item => item.id === product.id
        )
        
        let newItems
        if (existingItem) {
          newItems = state.shoppingList.items.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        } else {
          newItems = [...state.shoppingList.items, { ...product, quantity: 1 }]
        }
        
        const totalBs = newItems.reduce((sum, item) => 
          sum + (item.price_bs * item.quantity), 0
        )
        const totalUsd = newItems.reduce((sum, item) => 
          sum + (item.price_usd * item.quantity), 0
        )
        
        return {
          shoppingList: {
            items: newItems,
            totalBs,
            totalUsd
          }
        }
      }),
      
      removeFromShoppingList: (productId) => set((state) => {
        const newItems = state.shoppingList.items.filter(
          item => item.id !== productId
        )
        
        const totalBs = newItems.reduce((sum, item) => 
          sum + (item.price_bs * item.quantity), 0
        )
        const totalUsd = newItems.reduce((sum, item) => 
          sum + (item.price_usd * item.quantity), 0
        )
        
        return {
          shoppingList: {
            items: newItems,
            totalBs,
            totalUsd
          }
        }
      }),
      
      updateShoppingListQuantity: (productId, quantity) => set((state) => {
        const newItems = state.shoppingList.items.map(item =>
          item.id === productId
            ? { ...item, quantity: Math.max(0, quantity) }
            : item
        ).filter(item => item.quantity > 0)
        
        const totalBs = newItems.reduce((sum, item) => 
          sum + (item.price_bs * item.quantity), 0
        )
        const totalUsd = newItems.reduce((sum, item) => 
          sum + (item.price_usd * item.quantity), 0
        )
        
        return {
          shoppingList: {
            items: newItems,
            totalBs,
            totalUsd
          }
        }
      }),
      
      clearShoppingList: () => set({
        shoppingList: {
          items: [],
          totalBs: 0,
          totalUsd: 0
        }
      }),
      
      // Acciones de geolocalización
      setLocation: (latitude, longitude, city = '', state = '') => set({
        location: {
          latitude,
          longitude,
          city,
          state,
          error: null
        }
      }),
      
      setLocationError: (error) => set((state) => ({
        location: {
          ...state.location,
          error
        }
      })),
      
      // Utilidades
      convertToUsd: (priceBs) => {
        const { exchangeRate } = get()
        return exchangeRate.rate > 0 ? priceBs / exchangeRate.rate : 0
      },
      
      convertToBs: (priceUsd) => {
        const { exchangeRate } = get()
        return priceUsd * exchangeRate.rate
      }
    }),
    {
      name: 'ahorrayavz-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        shoppingList: state.shoppingList,
        location: state.location
      })
    }
  )
)

export default useStore
export { useStore }