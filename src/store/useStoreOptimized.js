import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createAuthSlice } from './slices/authSlice'
import { createExchangeRateSlice } from './slices/exchangeRateSlice'
import { createSearchSlice } from './slices/searchSlice'
import { createShoppingListSlice } from './slices/shoppingListSlice'
import { createLocationSlice } from './slices/locationSlice'

// Store principal optimizado con slices
const useStoreOptimized = create(
  persist(
    (...args) => ({
      // Combinar todos los slices
      ...createAuthSlice(...args),
      ...createExchangeRateSlice(...args),
      ...createSearchSlice(...args),
      ...createShoppingListSlice(...args),
      ...createLocationSlice(...args),
      
      // Acciones globales adicionales
      resetStore: () => {
        const { clearShoppingList, clearLocation, logout } = args[0]()
        clearShoppingList()
        clearLocation()
        logout()
      },
      
      // Utilidades globales
      getAppState: () => {
        const state = args[1]()
        return {
          isAuthenticated: state.isAuthenticated,
          hasLocation: state.location.latitude !== null,
          shoppingListCount: state.shoppingList.items.length,
          exchangeRate: state.exchangeRate.rate,
          lastActivity: new Date().toISOString()
        }
      }
    }),
    {
      name: 'ahorrayavz-storage-v2',
      // Persistir solo los datos importantes
      partialize: (state) => ({
        // Autenticación
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        
        // Lista de compras
        shoppingList: state.shoppingList,
        
        // Ubicación
        location: {
          latitude: state.location.latitude,
          longitude: state.location.longitude,
          city: state.location.city,
          state: state.location.state,
          country: state.location.country,
          lastUpdated: state.location.lastUpdated
        },
        
        // Tasa de cambio (solo el valor y fecha)
        exchangeRate: {
          rate: state.exchangeRate.rate,
          lastUpdated: state.exchangeRate.lastUpdated
        },
        
        // Filtros de búsqueda preferidos
        searchPreferences: {
          filters: state.searchState.filters,
          resultsPerPage: state.searchState.resultsPerPage
        }
      }),
      
      // Configuración de versionado para migraciones futuras
      version: 1,
      migrate: (persistedState, version) => {
        // Aquí se pueden manejar migraciones de versiones anteriores
        if (version === 0) {
          // Migrar desde la versión anterior del store
          return {
            ...persistedState,
            // Agregar nuevos campos con valores por defecto
          }
        }
        return persistedState
      }
    }
  )
)

export default useStoreOptimized