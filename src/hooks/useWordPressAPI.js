import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import useStore from '../store/useStore'

// Configuración base de la API
const API_BASE_URL = import.meta.env.VITE_WP_API_URL || 'http://localhost/ahorrayavz-wp/wp-json'

// Verificar si WordPress está configurado
const isWordPressConfigured = () => {
  return API_BASE_URL && API_BASE_URL !== '' && !API_BASE_URL.includes('tu-dominio-wordpress.com')
}

// Instancia de Axios configurada
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para agregar token de autenticación
apiClient.interceptors.request.use(
  (config) => {
    const token = useStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar respuestas y errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      useStore.getState().logout()
    }
    return Promise.reject(error)
  }
)

// Hook principal para la API de WordPress
export const useWordPressAPI = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleRequest = useCallback(async (requestFn) => {
    // Verificar si WordPress está configurado
    if (!isWordPressConfigured()) {
      const errorMessage = 'WordPress no está configurado. Configure VITE_WP_API_URL en las variables de entorno.'
      setError(errorMessage)
      console.warn('⚠️ WordPress API no configurada:', errorMessage)
      return null
    }

    setLoading(true)
    setError(null)
    
    try {
      const result = await requestFn()
      return result
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error desconocido'
      setError(errorMessage)
      console.error('❌ Error en API WordPress:', errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { 
    loading, 
    error, 
    handleRequest, 
    apiClient,
    isConfigured: isWordPressConfigured()
  }
}

// Hook específico para productos
export const useProducts = () => {
  const { handleRequest, loading, error } = useWordPressAPI()
  const [products, setProducts] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0
  })

  const fetchProducts = useCallback(async (params = {}) => {
    return handleRequest(async () => {
      const response = await apiClient.get('/wp/v2/productos', {
        params: {
          _embed: true,
          per_page: params.perPage || 12,
          page: params.page || 1,
          search: params.search || '',
          categoria: params.category || '',
          orderby: params.orderBy || 'date',
          order: params.order || 'desc',
          ...params
        }
      })
      
      const productsData = response.data.map(product => ({
        id: product.id,
        title: product.title.rendered,
        content: product.content.rendered,
        excerpt: product.excerpt.rendered,
        price_bs: parseFloat(product.acf?.precio_bs || 0),
        price_usd: parseFloat(product.acf?.precio_usd || 0),
        category: product.acf?.categoria || '',
        brand: product.acf?.marca || '',
        store_id: product.acf?.tienda || null,
        image: product._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
        slug: product.slug,
        date: product.date,
        modified: product.modified
      }))
      
      setProducts(productsData)
      setPagination({
        page: parseInt(response.headers['x-wp-page'] || 1),
        totalPages: parseInt(response.headers['x-wp-totalpages'] || 1),
        totalItems: parseInt(response.headers['x-wp-total'] || 0)
      })
      
      return productsData
    })
  }, [handleRequest])

  const fetchProductById = useCallback(async (id) => {
    return handleRequest(async () => {
      const response = await apiClient.get(`/wp/v2/productos/${id}`, {
        params: { _embed: true }
      })
      
      const product = response.data
      return {
        id: product.id,
        title: product.title.rendered,
        content: product.content.rendered,
        excerpt: product.excerpt.rendered,
        price_bs: parseFloat(product.acf?.precio_bs || 0),
        price_usd: parseFloat(product.acf?.precio_usd || 0),
        category: product.acf?.categoria || '',
        brand: product.acf?.marca || '',
        store_id: product.acf?.tienda || null,
        image: product._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
        slug: product.slug,
        date: product.date,
        modified: product.modified
      }
    })
  }, [handleRequest])

  const searchProducts = useCallback(async (query, filters = {}) => {
    return fetchProducts({
      search: query,
      category: filters.category,
      page: filters.page || 1,
      perPage: filters.perPage || 12,
      orderBy: filters.sortBy === 'price_low' ? 'meta_value_num' : 
               filters.sortBy === 'price_high' ? 'meta_value_num' : 'relevance',
      order: filters.sortBy === 'price_low' ? 'asc' : 
             filters.sortBy === 'price_high' ? 'desc' : 'desc',
      meta_key: filters.sortBy?.includes('price') ? 'precio_bs' : undefined
    })
  }, [fetchProducts])

  return {
    products,
    pagination,
    loading,
    error,
    fetchProducts,
    fetchProductById,
    searchProducts
  }
}

// Hook específico para tiendas
export const useStores = () => {
  const { handleRequest, loading, error } = useWordPressAPI()
  const [stores, setStores] = useState([])

  const fetchStores = useCallback(async (params = {}) => {
    return handleRequest(async () => {
      const response = await apiClient.get('/wp/v2/tiendas', {
        params: {
          _embed: true,
          per_page: params.perPage || 20,
          page: params.page || 1,
          search: params.search || '',
          ...params
        }
      })
      
      const storesData = response.data.map(store => ({
        id: store.id,
        name: store.title.rendered,
        description: store.content.rendered,
        address: store.acf?.direccion || '',
        phone: store.acf?.telefono || '',
        email: store.acf?.email || '',
        website: store.acf?.sitio_web || '',
        latitude: parseFloat(store.acf?.latitud || 0),
        longitude: parseFloat(store.acf?.longitud || 0),
        logo: store._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
        category: store.acf?.categoria || '',
        rating: parseFloat(store.acf?.calificacion || 0),
        is_premium: store.acf?.es_premium || false,
        slug: store.slug
      }))
      
      setStores(storesData)
      return storesData
    })
  }, [handleRequest])

  const fetchStoreById = useCallback(async (id) => {
    return handleRequest(async () => {
      const response = await apiClient.get(`/wp/v2/tiendas/${id}`, {
        params: { _embed: true }
      })
      
      const store = response.data
      return {
        id: store.id,
        name: store.title.rendered,
        description: store.content.rendered,
        address: store.acf?.direccion || '',
        phone: store.acf?.telefono || '',
        email: store.acf?.email || '',
        website: store.acf?.sitio_web || '',
        latitude: parseFloat(store.acf?.latitud || 0),
        longitude: parseFloat(store.acf?.longitud || 0),
        logo: store._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
        category: store.acf?.categoria || '',
        rating: parseFloat(store.acf?.calificacion || 0),
        is_premium: store.acf?.es_premium || false,
        slug: store.slug
      }
    })
  }, [handleRequest])

  return {
    stores,
    loading,
    error,
    fetchStores,
    fetchStoreById
  }
}

// Hook para autenticación
export const useAuth = () => {
  const { handleRequest, loading, error } = useWordPressAPI()
  const { setUser, logout } = useStore()

  const login = useCallback(async (username, password) => {
    return handleRequest(async () => {
      const response = await apiClient.post('/jwt-auth/v1/token', {
        username,
        password
      })
      
      const { token, user_email, user_nicename, user_display_name } = response.data
      const userData = {
        email: user_email,
        username: user_nicename,
        displayName: user_display_name
      }
      
      setUser(userData, token)
      return userData
    })
  }, [handleRequest, setUser])

  const register = useCallback(async (userData) => {
    return handleRequest(async () => {
      const response = await apiClient.post('/wp/v2/users', userData)
      return response.data
    })
  }, [handleRequest])

  const validateToken = useCallback(async () => {
    return handleRequest(async () => {
      const response = await apiClient.post('/jwt-auth/v1/token/validate')
      return response.data
    })
  }, [handleRequest])

  return {
    loading,
    error,
    login,
    register,
    logout,
    validateToken
  }
}

// Hook para tasa de cambio
export const useExchangeRate = () => {
  const { handleRequest, loading, error, isConfigured } = useWordPressAPI()
  const { setExchangeRate, setExchangeRateLoading, setExchangeRateError } = useStore()

  const fetchExchangeRate = useCallback(async () => {
    if (!isConfigured) {
      // Si WordPress no está configurado, usar una tasa de ejemplo
      const mockRate = 50.0 // Tasa de ejemplo
      setExchangeRate(mockRate)
      return mockRate
    }

    setExchangeRateLoading(true)
    
    try {
      const response = await apiClient.get('/ahorraya/v1/tasa-bcv')
      const rate = response.data.rate
      setExchangeRate(rate)
      return rate
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message
      setExchangeRateError(errorMessage)
      // En caso de error, usar tasa de ejemplo
      const fallbackRate = 50.0
      setExchangeRate(fallbackRate)
      return fallbackRate
    }
  }, [isConfigured, setExchangeRate, setExchangeRateLoading, setExchangeRateError])

  return {
    loading,
    error,
    fetchExchangeRate,
    isConfigured
  }
}

export default useWordPressAPI