import React, { useState } from 'react'
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material'
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useWordPressAPI'
import { useNotification } from '../contexts/NotificationContext'

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loading } = useAuth()
  const { showSuccess, showError } = useNotification()
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [errors, setErrors] = useState({})

  const from = location.state?.from || '/'

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.username.trim()) {
      newErrors.username = 'El usuario o email es requerido'
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    try {
      await login(formData.username, formData.password)
      showSuccess('¡Bienvenido de vuelta!', 'Inicio de sesión exitoso')
      navigate(from, { replace: true })
    } catch (error) {
      showError(
        error.response?.data?.message || 'Credenciales incorrectas',
        'Error de autenticación'
      )
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
            Iniciar Sesión
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Accede a tu cuenta de AhorraYa VZ
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Usuario o Email"
            name="username"
            value={formData.username}
            onChange={handleChange}
            error={!!errors.username}
            helperText={errors.username}
            margin="normal"
            autoComplete="username"
            autoFocus
          />
          
          <TextField
            fullWidth
            label="Contraseña"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            margin="normal"
            autoComplete="current-password"
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mt: 3, mb: 2, py: 1.5 }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Iniciar Sesión'
            )}
          </Button>
          
          <Box sx={{ textAlign: 'center' }}>
            <Link
              component={RouterLink}
              to="/recuperar-password"
              variant="body2"
              underline="hover"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </Box>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            ¿No tienes una cuenta?{' '}
            <Link
              component={RouterLink}
              to="/registro"
              variant="body2"
              underline="hover"
              sx={{ fontWeight: 600 }}
            >
              Regístrate aquí
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  )
}

export default Login