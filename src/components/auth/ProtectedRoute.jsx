import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Box, CircularProgress, Typography } from '@mui/material'
import { useStore } from '../../store/useStore'

/**
 * Componente ProtectedRoute - Protege rutas que requieren autenticación
 * 
 * @param {React.ReactNode} children - Componentes hijos a renderizar si está autenticado
 * @param {string} requiredRole - Rol requerido para acceder (opcional)
 * @param {string} redirectTo - Ruta a la que redirigir si no está autenticado
 */
const ProtectedRoute = ({ 
  children, 
  requiredRole = null, 
  redirectTo = '/login' 
}) => {
  const { user } = useStore()
  const location = useLocation()
  const isAuthenticated = !!user

  // Redirigir al login si no está autenticado
  if (!isAuthenticated) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location.pathname }}
        replace 
      />
    )
  }

  // Verificar rol requerido si se especifica
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
          textAlign: 'center',
          p: 3
        }}
      >
        <Typography variant="h5" color="error" gutterBottom>
          Acceso Denegado
        </Typography>
        <Typography variant="body1" color="text.secondary">
          No tienes permisos para acceder a esta página.
          {requiredRole && ` Se requiere rol: ${requiredRole}`}
        </Typography>
      </Box>
    )
  }

  // Renderizar contenido protegido
  return children
}

export default ProtectedRoute