import React from 'react'
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider
} from '@mui/material'
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  WhatsApp as WhatsAppIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material'
import { Link as RouterLink } from 'react-router-dom'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'grey.900',
        color: 'white',
        mt: 'auto',
        pt: 6,
        pb: 3
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Información de la empresa */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              AhorraYa VZ
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: 'grey.300' }}>
              El comparador de precios más completo de Venezuela. 
              Encuentra los mejores precios y ahorra en tus compras diarias.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton 
                color="inherit" 
                size="small"
                href="https://facebook.com/ahorrayavz"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FacebookIcon />
              </IconButton>
              <IconButton 
                color="inherit" 
                size="small"
                href="https://twitter.com/ahorrayavz"
                target="_blank"
                rel="noopener noreferrer"
              >
                <TwitterIcon />
              </IconButton>
              <IconButton 
                color="inherit" 
                size="small"
                href="https://instagram.com/ahorrayavz"
                target="_blank"
                rel="noopener noreferrer"
              >
                <InstagramIcon />
              </IconButton>
              <IconButton 
                color="inherit" 
                size="small"
                href="https://wa.me/584121234567"
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Enlaces rápidos */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Enlaces
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link 
                component={RouterLink} 
                to="/" 
                color="inherit" 
                underline="hover"
                variant="body2"
              >
                Inicio
              </Link>
              <Link 
                component={RouterLink} 
                to="/buscar" 
                color="inherit" 
                underline="hover"
                variant="body2"
              >
                Buscar Productos
              </Link>
              <Link 
                component={RouterLink} 
                to="/acerca" 
                color="inherit" 
                underline="hover"
                variant="body2"
              >
                Acerca de Nosotros
              </Link>
              <Link 
                component={RouterLink} 
                to="/contacto" 
                color="inherit" 
                underline="hover"
                variant="body2"
              >
                Contacto
              </Link>
            </Box>
          </Grid>

          {/* Para usuarios */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Usuarios
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link 
                component={RouterLink} 
                to="/registro" 
                color="inherit" 
                underline="hover"
                variant="body2"
              >
                Crear Cuenta
              </Link>
              <Link 
                component={RouterLink} 
                to="/login" 
                color="inherit" 
                underline="hover"
                variant="body2"
              >
                Iniciar Sesión
              </Link>
              <Link 
                component={RouterLink} 
                to="/mis-listas" 
                color="inherit" 
                underline="hover"
                variant="body2"
              >
                Mis Listas
              </Link>
            </Box>
          </Grid>

          {/* Para comercios */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Comercios
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link 
                component={RouterLink} 
                to="/registro?tipo=comercio" 
                color="inherit" 
                underline="hover"
                variant="body2"
              >
                Registrar Tienda
              </Link>
              <Link 
                component={RouterLink} 
                to="/panel-comercio" 
                color="inherit" 
                underline="hover"
                variant="body2"
              >
                Panel de Control
              </Link>
              <Link 
                href="mailto:comercios@ahorrayavz.com"
                color="inherit" 
                underline="hover"
                variant="body2"
              >
                Soporte Comercios
              </Link>
            </Box>
          </Grid>

          {/* Información de contacto */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Contacto
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon fontSize="small" />
                <Link 
                  href="mailto:info@ahorrayavz.com"
                  color="inherit" 
                  underline="hover"
                  variant="body2"
                >
                  info@ahorrayavz.com
                </Link>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon fontSize="small" />
                <Typography variant="body2" color="grey.300">
                  +58 412-123-4567
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationIcon fontSize="small" />
                <Typography variant="body2" color="grey.300">
                  Caracas, Venezuela
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, borderColor: 'grey.700' }} />

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
          <Typography variant="body2" color="grey.400">
            © {currentYear} AhorraYa VZ. Todos los derechos reservados.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Link 
              href="/terminos" 
              color="grey.400" 
              underline="hover"
              variant="body2"
            >
              Términos de Uso
            </Link>
            <Link 
              href="/privacidad" 
              color="grey.400" 
              underline="hover"
              variant="body2"
            >
              Política de Privacidad
            </Link>
            <Link 
              href="/cookies" 
              color="grey.400" 
              underline="hover"
              variant="body2"
            >
              Cookies
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer