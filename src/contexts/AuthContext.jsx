import React, { createContext, useContext, useEffect } from 'react'
import useStore from '../store/useStore'
import { useAuth } from '../hooks/useWordPressAPI'

const AuthContext = createContext({})

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext debe ser usado dentro de AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const { user, token, isAuthenticated, setUser, logout } = useStore()
  const { validateToken, loading } = useAuth()

  // Validar token al cargar la aplicación
  useEffect(() => {
    const checkAuthStatus = async () => {
      if (token && !user) {
        try {
          await validateToken()
          // Si el token es válido, el usuario ya está en el store
        } catch (error) {
          console.error('Token inválido:', error)
          logout()
        }
      }
    }

    checkAuthStatus()
  }, [token, user, validateToken, logout])

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    setUser,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext