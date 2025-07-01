import React from 'react'
import {
  Box,
  Container,
  Typography,
  Grid,
  Link,
  IconButton,
  Divider
} from '@mui/material'
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

const Footer = () => {
  const navigate = useNavigate()
  const currentYear = new Date().getFullYear()

  const handleNavigation = (path) => {
    navigate(path)
  }

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'primary.main',
        color: 'white',
        py: 6,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Información de la empresa */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              AhorraYa VZ
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
              La plataforma líder en comparación de precios en Venezuela. 
              Encuentra los mejores precios y ahorra en tus compras.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton 
                color="inherit" 
                size="small"
                href="https://facebook.com" 
                target="_blank"
                sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton 
                color="inherit" 
                size="small"
                href="https://twitter.com" 
                target="_blank"
                sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}
              >
                <TwitterIcon />
              </IconButton>
              <IconButton 
                color="inherit" 
                size="small"
                href="https://instagram.com" 
                target="_blank"
                sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}
              >
                <InstagramIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Enlaces rápidos */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Enlaces Rápidos
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link
                component="button"
                variant="body2"
                onClick={() => handleNavigation('/')}
                sx={{
                  color: 'inherit',
                  textAlign: 'left',
                  textDecoration: 'none',
                  opacity: 0.9,
                  '&:hover': { opacity: 1, textDecoration: 'underline' }
                }}
              >
                Inicio
              </Link>
              <Link
                component="button"
                variant="body2"
                onClick={() => handleNavigation('/buscar')}
                sx={{
                  color: 'inherit',
                  textAlign: 'left',
                  textDecoration: 'none',
                  opacity: 0.9,
                  '&:hover': { opacity: 1, textDecoration: 'underline' }
                }}
              >
                Buscar Productos
              </Link>
              <Link
                component="button"
                variant="body2"
                onClick={() => handleNavigation('/acerca')}
                sx={{
                  color: 'inherit',
                  textAlign: 'left',
                  textDecoration: 'none',
                  opacity: 0.9,
                  '&:hover': { opacity: 1, textDecoration: 'underline' }
                }}
              >
                Acerca de Nosotros
              </Link>
              <Link
                component="button"
                variant="body2"
                onClick={() => handleNavigation('/contacto')}
                sx={{
                  color: 'inherit',
                  textAlign: 'left',
                  textDecoration: 'none',
                  opacity: 0.9,
                  '&:hover': { opacity: 1, textDecoration: 'underline' }
                }}
              >
                Contacto
              </Link>
            </Box>
          </Grid>

          {/* Para usuarios */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Para Usuarios
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link
                component="button"
                variant="body2"
                onClick={() => handleNavigation('/registro')}
                sx={{
                  color: 'inherit',
                  textAlign: 'left',
                  textDecoration: 'none',
                  opacity: 0.9,
                  '&:hover': { opacity: 1, textDecoration: 'underline' }
                }}
              >
                Crear Cuenta
              </Link>
              <Link
                component="button"
                variant="body2"
                onClick={() => handleNavigation('/login')}
                sx={{
                  color: 'inherit',
                  textAlign: 'left',
                  textDecoration: 'none',
                  opacity: 0.9,
                  '&:hover': { opacity: 1, textDecoration: 'underline' }
                }}
              >
                Iniciar Sesión
              </Link>
              <Link
                component="button"
                variant="body2"
                onClick={() => handleNavigation('/mis-listas')}
                sx={{
                  color: 'inherit',
                  textAlign: 'left',
                  textDecoration: 'none',
                  opacity: 0.9,
                  '&:hover': { opacity: 1, textDecoration: 'underline' }
                }}
              >
                Mis Listas
              </Link>
            </Box>
          </Grid>

          {/* Para comercios */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Para Comercios
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link
                component="button"
                variant="body2"
                onClick={() => handleNavigation('/registro?tipo=comercio')}
                sx={{
                  color: 'inherit',
                  textAlign: 'left',
                  textDecoration: 'none',
                  opacity: 0.9,
                  '&:hover': { opacity: 1, textDecoration: 'underline' }
                }}
              >
                Registrar Tienda
              </Link>
              <Link
                component="button"
                variant="body2"
                onClick={() => handleNavigation('/panel-comercio')}
                sx={{
                  color: 'inherit',
                  textAlign: 'left',
                  textDecoration: 'none',
                  opacity: 0.9,
                  '&:hover': { opacity: 1, textDecoration: 'underline' }
                }}
              >
                Panel de Control
              </Link>
              <Link
                component="button"
                variant="body2"
                onClick={() => handleNavigation('/contacto')}
                sx={{
                  color: 'inherit',
                  textAlign: 'left',
                  textDecoration: 'none',
                  opacity: 0.9,
                  '&:hover': { opacity: 1, textDecoration: 'underline' }
                }}
              >
                Soporte Comercios
              </Link>
            </Box>
          </Grid>
        </Grid>

        {/* Información de contacto */}
        <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmailIcon sx={{ fontSize: 18, opacity: 0.8 }} />
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    contacto@ahorraya.ve
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PhoneIcon sx={{ fontSize: 18, opacity: 0.8 }} />
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    +58 212 555-0123
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationIcon sx={{ fontSize: 18, opacity: 0.8 }} />
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Caracas, Venezuela
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.1)' }} />

        {/* Copyright y enlaces legales */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © {currentYear} AhorraYa VZ. Todos los derechos reservados.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Link
              component="button"
              variant="body2"
              onClick={() => handleNavigation('/terminos')}
              sx={{
                color: 'inherit',
                textDecoration: 'none',
                opacity: 0.8,
                '&:hover': { opacity: 1, textDecoration: 'underline' }
              }}
            >
              Términos de Uso
            </Link>
            <Link
              component="button"
              variant="body2"
              onClick={() => handleNavigation('/privacidad')}
              sx={{
                color: 'inherit',
                textDecoration: 'none',
                opacity: 0.8,
                '&:hover': { opacity: 1, textDecoration: 'underline' }
              }}
            >
              Política de Privacidad
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer