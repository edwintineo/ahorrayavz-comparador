import React from 'react'
import { Box, Typography, Button, Container, Alert } from '@mui/material'
import { ErrorOutline, Refresh } from '@mui/icons-material'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null
    }
  }

  static getDerivedStateFromError(error) {
    // Actualiza el estado para mostrar la UI de error
    return { 
      hasError: true,
      errorId: Date.now().toString(36) + Math.random().toString(36).substr(2)
    }
  }

  componentDidCatch(error, errorInfo) {
    // Registra el error
    this.setState({
      error,
      errorInfo
    })
    
    // Log del error para debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // Aquí se puede enviar el error a un servicio de logging
    this.logErrorToService(error, errorInfo)
  }

  logErrorToService = (error, errorInfo) => {
    // En producción, enviar a un servicio como Sentry, LogRocket, etc.
    if (process.env.NODE_ENV === 'production') {
      // Ejemplo de logging
      const errorData = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        errorId: this.state.errorId
      }
      
      // Enviar a servicio de logging
      console.log('Error logged:', errorData)
    }
  }

  handleReload = () => {
    window.location.reload()
  }

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null 
    })
  }

  render() {
    if (this.state.hasError) {
      const isDevelopment = process.env.NODE_ENV === 'development'
      
      return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            textAlign="center"
            gap={3}
          >
            <ErrorOutline color="error" sx={{ fontSize: 80 }} />
            
            <Typography variant="h4" color="error" gutterBottom>
              ¡Oops! Algo salió mal
            </Typography>
            
            <Typography variant="body1" color="text.secondary" maxWidth={600}>
              Ha ocurrido un error inesperado en la aplicación. 
              Nuestro equipo ha sido notificado automáticamente.
            </Typography>
            
            {isDevelopment && this.state.error && (
              <Alert severity="error" sx={{ width: '100%', textAlign: 'left' }}>
                <Typography variant="h6" gutterBottom>
                  Error Details (Development Mode):
                </Typography>
                <Typography variant="body2" component="pre" sx={{ 
                  whiteSpace: 'pre-wrap',
                  fontSize: '0.8rem',
                  maxHeight: 200,
                  overflow: 'auto'
                }}>
                  {this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </Typography>
              </Alert>
            )}
            
            <Box display="flex" gap={2} flexWrap="wrap" justifyContent="center">
              <Button
                variant="contained"
                startIcon={<Refresh />}
                onClick={this.handleReload}
                size="large"
              >
                Recargar Página
              </Button>
              
              <Button
                variant="outlined"
                onClick={this.handleReset}
                size="large"
              >
                Intentar de Nuevo
              </Button>
              
              <Button
                variant="text"
                onClick={() => window.history.back()}
                size="large"
              >
                Volver Atrás
              </Button>
            </Box>
            
            {this.state.errorId && (
              <Typography variant="caption" color="text.secondary">
                ID del Error: {this.state.errorId}
              </Typography>
            )}
          </Box>
        </Container>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary