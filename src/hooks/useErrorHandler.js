import { useCallback } from 'react'
import { useNotification } from '../contexts/NotificationContext'

// Hook personalizado para manejo de errores
export const useErrorHandler = () => {
  const { showNotification } = useNotification()

  const handleError = useCallback((error, context = '') => {
    // Log del error para debugging
    console.error(`Error in ${context}:`, error)

    // Determinar el tipo de error y mensaje apropiado
    let errorMessage = 'Ha ocurrido un error inesperado'
    let errorType = 'error'

    if (error.response) {
      // Error de respuesta HTTP
      const status = error.response.status
      const data = error.response.data

      switch (status) {
        case 400:
          errorMessage = data.message || 'Solicitud inválida'
          break
        case 401:
          errorMessage = 'No autorizado. Por favor, inicia sesión nuevamente'
          errorType = 'warning'
          // Opcional: redirigir al login
          break
        case 403:
          errorMessage = 'No tienes permisos para realizar esta acción'
          break
        case 404:
          errorMessage = 'Recurso no encontrado'
          break
        case 422:
          errorMessage = data.message || 'Datos de entrada inválidos'
          break
        case 429:
          errorMessage = 'Demasiadas solicitudes. Intenta de nuevo más tarde'
          break
        case 500:
          errorMessage = 'Error interno del servidor. Intenta de nuevo más tarde'
          break
        case 503:
          errorMessage = 'Servicio no disponible temporalmente'
          break
        default:
          errorMessage = `Error del servidor (${status})`
      }
    } else if (error.request) {
      // Error de red
      errorMessage = 'Error de conexión. Verifica tu conexión a internet'
    } else if (error.message) {
      // Error de configuración u otro
      errorMessage = error.message
    }

    // Mostrar notificación al usuario
    showNotification(errorMessage, errorType)

    // Retornar información del error para uso opcional
    return {
      message: errorMessage,
      type: errorType,
      originalError: error,
      context
    }
  }, [showNotification])

  // Wrapper para promesas que maneja errores automáticamente
  const withErrorHandling = useCallback((promise, context = '') => {
    return promise.catch(error => {
      handleError(error, context)
      throw error // Re-throw para que el componente pueda manejar el estado
    })
  }, [handleError])

  // Función para validar respuestas de API
  const validateApiResponse = useCallback((response, expectedFields = []) => {
    if (!response || !response.data) {
      throw new Error('Respuesta de API inválida')
    }

    // Validar campos requeridos
    for (const field of expectedFields) {
      if (!(field in response.data)) {
        throw new Error(`Campo requerido '${field}' no encontrado en la respuesta`)
      }
    }

    return response.data
  }, [])

  // Función para retry con backoff exponencial
  const retryWithBackoff = useCallback(async (fn, maxRetries = 3, baseDelay = 1000) => {
    let lastError
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn()
      } catch (error) {
        lastError = error
        
        if (attempt === maxRetries) {
          break
        }
        
        // Calcular delay con backoff exponencial
        const delay = baseDelay * Math.pow(2, attempt)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
    
    throw lastError
  }, [])

  return {
    handleError,
    withErrorHandling,
    validateApiResponse,
    retryWithBackoff
  }
}

export default useErrorHandler