import React, { useState } from 'react'
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Alert,
  CircularProgress,
  Divider,
  Stepper,
  Step,
  StepLabel
} from '@mui/material'
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useWordPressAPI'
import { useNotification } from '../contexts/NotificationContext'

const Register = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { register, loading } = useAuth()
  const { showSuccess, showError } = useNotification()
  
  const tipoUsuario = searchParams.get('tipo') || 'cliente'
  const [activeStep, setActiveStep] = useState(0)
  
  const [formData, setFormData] = useState({
    // Datos básicos
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    userType: tipoUsuario,
    
    // Datos adicionales para comercios
    storeName: '',
    storeDescription: '',
    storeCategory: '',
    storeAddress: '',
    storePhone: '',
    
    // Términos y condiciones
    acceptTerms: false,
    acceptPrivacy: false
  })
  
  const [errors, setErrors] = useState({})

  const steps = tipoUsuario === 'comercio' 
    ? ['Datos Personales', 'Información de la Tienda', 'Términos y Condiciones']
    : ['Datos Personales', 'Términos y Condiciones']

  const storeCategories = [
    'Supermercado',
    'Farmacia',
    'Ferretería',
    'Licorería',
    'Panadería',
    'Carnicería',
    'Verdulería',
    'Tecnología',
    'Ropa',
    'Hogar',
    'Belleza',
    'Deportes',
    'Otro'
  ]

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateStep = (step) => {
    const newErrors = {}
    
    if (step === 0) {
      // Validar datos básicos
      if (!formData.username.trim()) {
        newErrors.username = 'El nombre de usuario es requerido'
      } else if (formData.username.length < 3) {
        newErrors.username = 'El nombre de usuario debe tener al menos 3 caracteres'
      }
      
      if (!formData.email.trim()) {
        newErrors.email = 'El email es requerido'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'El email no es válido'
      }
      
      if (!formData.password) {
        newErrors.password = 'La contraseña es requerida'
      } else if (formData.password.length < 6) {
        newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden'
      }
      
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'El nombre es requerido'
      }
      
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'El apellido es requerido'
      }
    }
    
    if (step === 1 && tipoUsuario === 'comercio') {
      // Validar datos de la tienda
      if (!formData.storeName.trim()) {
        newErrors.storeName = 'El nombre de la tienda es requerido'
      }
      
      if (!formData.storeCategory) {
        newErrors.storeCategory = 'La categoría de la tienda es requerida'
      }
      
      if (!formData.storeAddress.trim()) {
        newErrors.storeAddress = 'La dirección de la tienda es requerida'
      }
    }
    
    const finalStep = tipoUsuario === 'comercio' ? 2 : 1
    if (step === finalStep) {
      // Validar términos y condiciones
      if (!formData.acceptTerms) {
        newErrors.acceptTerms = 'Debes aceptar los términos y condiciones'
      }
      
      if (!formData.acceptPrivacy) {
        newErrors.acceptPrivacy = 'Debes aceptar la política de privacidad'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    setActiveStep(prev => prev - 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const finalStep = tipoUsuario === 'comercio' ? 2 : 1
    if (!validateStep(finalStep)) return
    
    try {
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
        roles: [tipoUsuario === 'comercio' ? 'comercio' : 'cliente'],
        meta: {
          phone: formData.phone,
          user_type: formData.userType
        }
      }
      
      if (tipoUsuario === 'comercio') {
        userData.meta.store_name = formData.storeName
        userData.meta.store_description = formData.storeDescription
        userData.meta.store_category = formData.storeCategory
        userData.meta.store_address = formData.storeAddress
        userData.meta.store_phone = formData.storePhone
      }
      
      await register(userData)
      
      showSuccess(
        tipoUsuario === 'comercio' 
          ? '¡Registro exitoso! Tu tienda será revisada antes de ser activada.'
          : '¡Bienvenido a AhorraYa VZ! Ya puedes comenzar a usar la plataforma.',
        'Registro completado'
      )
      
      navigate('/login')
    } catch (error) {
      showError(
        error.response?.data?.message || 'Error al crear la cuenta',
        'Error de registro'
      )
    }
  }

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Información Personal
            </Typography>
            
            <TextField
              fullWidth
              label="Nombre de Usuario"
              name="username"
              value={formData.username}
              onChange={handleChange}
              error={!!errors.username}
              helperText={errors.username}
              margin="normal"
              autoComplete="username"
            />
            
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              margin="normal"
              autoComplete="email"
            />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Nombre"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
                margin="normal"
                autoComplete="given-name"
              />
              
              <TextField
                fullWidth
                label="Apellido"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
                margin="normal"
                autoComplete="family-name"
              />
            </Box>
            
            <TextField
              fullWidth
              label="Teléfono (Opcional)"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              margin="normal"
              autoComplete="tel"
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
              autoComplete="new-password"
            />
            
            <TextField
              fullWidth
              label="Confirmar Contraseña"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              margin="normal"
              autoComplete="new-password"
            />
          </Box>
        )
      
      case 1:
        if (tipoUsuario === 'comercio') {
          return (
            <Box>
              <Typography variant="h6" gutterBottom>
                Información de la Tienda
              </Typography>
              
              <TextField
                fullWidth
                label="Nombre de la Tienda"
                name="storeName"
                value={formData.storeName}
                onChange={handleChange}
                error={!!errors.storeName}
                helperText={errors.storeName}
                margin="normal"
              />
              
              <FormControl fullWidth margin="normal" error={!!errors.storeCategory}>
                <InputLabel>Categoría de la Tienda</InputLabel>
                <Select
                  name="storeCategory"
                  value={formData.storeCategory}
                  onChange={handleChange}
                  label="Categoría de la Tienda"
                >
                  {storeCategories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
                {errors.storeCategory && (
                  <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                    {errors.storeCategory}
                  </Typography>
                )}
              </FormControl>
              
              <TextField
                fullWidth
                label="Descripción de la Tienda"
                name="storeDescription"
                value={formData.storeDescription}
                onChange={handleChange}
                margin="normal"
                multiline
                rows={3}
                placeholder="Describe brevemente tu tienda y los productos que ofreces..."
              />
              
              <TextField
                fullWidth
                label="Dirección de la Tienda"
                name="storeAddress"
                value={formData.storeAddress}
                onChange={handleChange}
                error={!!errors.storeAddress}
                helperText={errors.storeAddress}
                margin="normal"
                multiline
                rows={2}
              />
              
              <TextField
                fullWidth
                label="Teléfono de la Tienda"
                name="storePhone"
                value={formData.storePhone}
                onChange={handleChange}
                margin="normal"
              />
            </Box>
          )
        } else {
          // Términos para clientes
          return renderTermsStep()
        }
      
      case 2:
        // Términos para comercios
        return renderTermsStep()
      
      default:
        return null
    }
  }

  const renderTermsStep = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Términos y Condiciones
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3, maxHeight: 200, overflow: 'auto', bgcolor: 'grey.50' }}>
        <Typography variant="body2" paragraph>
          <strong>Términos y Condiciones de Uso - AhorraYa VZ</strong>
        </Typography>
        <Typography variant="body2" paragraph>
          Al registrarte en AhorraYa VZ, aceptas cumplir con estos términos y condiciones...
        </Typography>
        <Typography variant="body2" paragraph>
          1. Uso responsable de la plataforma
        </Typography>
        <Typography variant="body2" paragraph>
          2. Veracidad de la información proporcionada
        </Typography>
        <Typography variant="body2" paragraph>
          3. Respeto hacia otros usuarios
        </Typography>
        {tipoUsuario === 'comercio' && (
          <>
            <Typography variant="body2" paragraph>
              4. Actualización regular de precios y productos
            </Typography>
            <Typography variant="body2" paragraph>
              5. Cumplimiento de las leyes comerciales venezolanas
            </Typography>
          </>
        )}
      </Paper>
      
      <FormControlLabel
        control={
          <Checkbox
            name="acceptTerms"
            checked={formData.acceptTerms}
            onChange={handleChange}
            color="primary"
          />
        }
        label="Acepto los términos y condiciones de uso"
        sx={{ mb: 2 }}
      />
      {errors.acceptTerms && (
        <Typography variant="caption" color="error" display="block" sx={{ mb: 2 }}>
          {errors.acceptTerms}
        </Typography>
      )}
      
      <FormControlLabel
        control={
          <Checkbox
            name="acceptPrivacy"
            checked={formData.acceptPrivacy}
            onChange={handleChange}
            color="primary"
          />
        }
        label="Acepto la política de privacidad"
        sx={{ mb: 2 }}
      />
      {errors.acceptPrivacy && (
        <Typography variant="caption" color="error" display="block">
          {errors.acceptPrivacy}
        </Typography>
      )}
    </Box>
  )

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
            {tipoUsuario === 'comercio' ? 'Registrar Tienda' : 'Crear Cuenta'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {tipoUsuario === 'comercio' 
              ? 'Únete a AhorraYa VZ y llega a más clientes'
              : 'Únete a AhorraYa VZ y encuentra los mejores precios'
            }
          </Typography>
        </Box>

        {/* Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Contenido del paso */}
        <Box component="form" onSubmit={handleSubmit}>
          {renderStepContent(activeStep)}
          
          {/* Botones de navegación */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              onClick={handleBack}
              disabled={activeStep === 0}
              sx={{ textTransform: 'none' }}
            >
              Anterior
            </Button>
            
            {activeStep === steps.length - 1 ? (
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{ textTransform: 'none', minWidth: 120 }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Crear Cuenta'
                )}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{ textTransform: 'none' }}
              >
                Siguiente
              </Button>
            )}
          </Box>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            ¿Ya tienes una cuenta?{' '}
            <Link
              component={RouterLink}
              to="/login"
              variant="body2"
              underline="hover"
              sx={{ fontWeight: 600 }}
            >
              Inicia sesión aquí
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  )
}

export default Register