import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  TextField,
  InputAdornment,
  Chip
} from '@mui/material';
import {
  Home,
  Search,
  ArrowBack,
  Help,
  Phone,
  Email,
  TrendingUp,
  LocalOffer,
  Store,
  Category,
  Refresh,
  BugReport,
  SentimentVeryDissatisfied,
  Explore,
  ShoppingCart,
  Favorite,
  Compare
} from '@mui/icons-material';
import { useStore } from '../store/useStore';

const NotFound = () => {
  const navigate = useNavigate();
  const { user } = useStore();

  const popularPages = [
    {
      title: 'Inicio',
      description: 'Volver a la página principal',
      icon: <Home />,
      path: '/',
      color: 'primary'
    },
    {
      title: 'Búsqueda Avanzada',
      description: 'Encuentra productos específicos',
      icon: <Search />,
      path: '/search',
      color: 'secondary'
    },
    {
      title: 'Ofertas',
      description: 'Descubre las mejores promociones',
      icon: <LocalOffer />,
      path: '/offers',
      color: 'warning'
    },
    {
      title: 'Tiendas',
      description: 'Explora todas las tiendas',
      icon: <Store />,
      path: '/stores',
      color: 'success'
    }
  ];

  const quickActions = [
    {
      title: 'Buscar Productos',
      icon: <Search />,
      action: () => navigate('/search')
    },
    {
      title: 'Ver Ofertas',
      icon: <LocalOffer />,
      action: () => navigate('/offers')
    },
    {
      title: 'Explorar Categorías',
      icon: <Category />,
      action: () => navigate('/categories')
    },
    {
      title: 'Contactar Soporte',
      icon: <Help />,
      action: () => navigate('/contact')
    }
  ];

  const userSpecificActions = user ? [
    {
      title: 'Mi Lista de Compras',
      icon: <ShoppingCart />,
      action: () => navigate('/shopping-list')
    },
    {
      title: 'Mis Favoritos',
      icon: <Favorite />,
      action: () => navigate('/favorites')
    },
    {
      title: 'Comparaciones',
      icon: <Compare />,
      action: () => navigate('/comparison')
    },
    {
      title: 'Mi Perfil',
      icon: <Home />,
      action: () => navigate('/dashboard')
    }
  ] : [
    {
      title: 'Iniciar Sesión',
      icon: <Home />,
      action: () => navigate('/login')
    },
    {
      title: 'Registrarse',
      icon: <Home />,
      action: () => navigate('/register')
    }
  ];

  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4} justifyContent="center">
        {/* Main 404 Content */}
        <Grid item xs={12} md={8}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 6, 
              textAlign: 'center',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: 3
            }}
          >
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h1" 
                sx={{ 
                  fontSize: { xs: '4rem', md: '6rem' },
                  fontWeight: 'bold',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  mb: 2
                }}
              >
                404
              </Typography>
              <SentimentVeryDissatisfied sx={{ fontSize: 64, mb: 2, opacity: 0.8 }} />
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'medium' }}>
                ¡Oops! Página no encontrada
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, mb: 4 }}>
                La página que buscas no existe o ha sido movida
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<Home />}
                onClick={() => navigate('/')}
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                  backdropFilter: 'blur(10px)'
                }}
              >
                Ir al Inicio
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<ArrowBack />}
                onClick={handleGoBack}
                sx={{ 
                  borderColor: 'rgba(255,255,255,0.5)',
                  color: 'white',
                  '&:hover': { 
                    borderColor: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Volver Atrás
              </Button>
            </Box>
          </Paper>

          {/* Search Section */}
          <Paper elevation={2} sx={{ p: 4, mt: 4, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              ¿Buscabas algo específico?
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Prueba buscar el producto o tienda que necesitas
            </Typography>
            
            <TextField
              fullWidth
              placeholder="Buscar productos, tiendas, ofertas..."
              sx={{ maxWidth: 500, mx: 'auto' }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Button 
                      variant="contained"
                      onClick={(e) => {
                        const input = e.target.closest('.MuiTextField-root').querySelector('input');
                        handleSearch(input.value);
                      }}
                    >
                      Buscar
                    </Button>
                  </InputAdornment>
                )
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch(e.target.value);
                }
              }}
            />
          </Paper>

          {/* Popular Pages */}
          <Paper elevation={2} sx={{ p: 4, mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Páginas Populares
            </Typography>
            <Grid container spacing={2}>
              {popularPages.map((page, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4
                      }
                    }}
                    onClick={() => navigate(page.path)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box 
                          sx={{ 
                            p: 1.5, 
                            borderRadius: 2, 
                            bgcolor: `${page.color}.light`,
                            color: `${page.color}.main`
                          }}
                        >
                          {page.icon}
                        </Box>
                        <Box>
                          <Typography variant="h6">
                            {page.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {page.description}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Quick Actions */}
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Acciones Rápidas
            </Typography>
            <List>
              {quickActions.map((action, index) => (
                <ListItem 
                  key={index}
                  button 
                  onClick={action.action}
                  sx={{ 
                    borderRadius: 1,
                    mb: 1,
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                >
                  <ListItemIcon>
                    {action.icon}
                  </ListItemIcon>
                  <ListItemText primary={action.title} />
                </ListItem>
              ))}
            </List>
          </Paper>

          {/* User Specific Actions */}
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              {user ? 'Mi Cuenta' : 'Únete a AhorraYa VZ'}
            </Typography>
            <List>
              {userSpecificActions.map((action, index) => (
                <ListItem 
                  key={index}
                  button 
                  onClick={action.action}
                  sx={{ 
                    borderRadius: 1,
                    mb: 1,
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                >
                  <ListItemIcon>
                    {action.icon}
                  </ListItemIcon>
                  <ListItemText primary={action.title} />
                </ListItem>
              ))}
            </List>
          </Paper>

          {/* Help Section */}
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              ¿Necesitas Ayuda?
            </Typography>
            
            <Typography variant="body2" color="text.secondary" paragraph>
              Si crees que esto es un error o necesitas asistencia, no dudes en contactarnos.
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button 
                variant="outlined" 
                startIcon={<Help />}
                onClick={() => navigate('/help')}
                fullWidth
              >
                Centro de Ayuda
              </Button>
              
              <Button 
                variant="outlined" 
                startIcon={<Email />}
                onClick={() => navigate('/contact')}
                fullWidth
              >
                Contactar Soporte
              </Button>
              
              <Button 
                variant="outlined" 
                startIcon={<BugReport />}
                onClick={() => navigate('/contact?type=bug')}
                fullWidth
              >
                Reportar Error
              </Button>
            </Box>
          </Paper>

          {/* Error Details */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Detalles del Error
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Chip 
                label={`Código: 404`}
                variant="outlined"
                size="small"
              />
              <Chip 
                label={`URL: ${window.location.pathname}`}
                variant="outlined"
                size="small"
              />
              <Chip 
                label={`Tiempo: ${new Date().toLocaleString()}`}
                variant="outlined"
                size="small"
              />
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="body2" color="text.secondary">
              Si este error persiste, por favor incluye estos detalles al contactar soporte.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Bottom Section */}
      <Paper elevation={2} sx={{ p: 4, mt: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Mientras tanto, explora lo que tenemos para ti
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap', mt: 2 }}>
          <Button 
            variant="contained" 
            startIcon={<TrendingUp />}
            onClick={() => navigate('/trending')}
          >
            Productos Populares
          </Button>
          
          <Button 
            variant="contained" 
            startIcon={<LocalOffer />}
            onClick={() => navigate('/offers')}
            color="warning"
          >
            Ofertas del Día
          </Button>
          
          <Button 
            variant="contained" 
            startIcon={<Explore />}
            onClick={() => navigate('/categories')}
            color="success"
          >
            Explorar Categorías
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default NotFound;