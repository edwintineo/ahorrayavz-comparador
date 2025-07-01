import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  Breadcrumbs,
  Link,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Button,
  Divider,
  Alert,
  Avatar,
  Tab,
  Tabs,
  IconButton
} from '@mui/material';
import {
  Home,
  Search,
  Help as HelpIcon,
  ExpandMore,
  Person,
  Store,
  ShoppingCart,
  Compare,
  Favorite,
  Notifications,
  Security,
  Settings,
  Phone,
  Email,
  VideoLibrary,
  Article,
  Quiz,
  TrendingUp,
  LocalOffer,
  Payment,
  LocationOn,
  BugReport,
  Feedback,
  Support,
  School,
  PlayArrow,
  GetApp,
  Share,
  Star,
  ThumbUp,
  AccessTime
} from '@mui/icons-material';

const Help = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [tabValue, setTabValue] = useState(0);

  const helpCategories = [
    {
      id: 'getting-started',
      title: 'Primeros Pasos',
      icon: <School />,
      color: 'primary',
      description: 'Aprende lo básico para usar AhorraYa VZ'
    },
    {
      id: 'account',
      title: 'Cuenta y Perfil',
      icon: <Person />,
      color: 'secondary',
      description: 'Gestiona tu cuenta y configuraciones'
    },
    {
      id: 'shopping',
      title: 'Compras y Búsquedas',
      icon: <ShoppingCart />,
      color: 'success',
      description: 'Cómo buscar y comparar productos'
    },
    {
      id: 'merchants',
      title: 'Para Comerciantes',
      icon: <Store />,
      color: 'warning',
      description: 'Guías para tiendas y vendedores'
    },
    {
      id: 'technical',
      title: 'Soporte Técnico',
      icon: <Support />,
      color: 'error',
      description: 'Solución de problemas técnicos'
    }
  ];

  const faqData = {
    'getting-started': [
      {
        question: '¿Qué es AhorraYa VZ?',
        answer: 'AhorraYa VZ es una plataforma de comparación de precios que te ayuda a encontrar los mejores precios de productos en diferentes tiendas de Venezuela. Puedes buscar productos, comparar precios, crear listas de compras y recibir alertas de precios.'
      },
      {
        question: '¿Cómo empiezo a usar la plataforma?',
        answer: 'Simplemente visita nuestra página principal y usa la barra de búsqueda para encontrar productos. Para funciones avanzadas como listas de compras y alertas, puedes crear una cuenta gratuita.'
      },
      {
        question: '¿Necesito registrarme para usar AhorraYa VZ?',
        answer: 'No es necesario registrarse para buscar y comparar precios. Sin embargo, crear una cuenta te permite guardar productos favoritos, crear listas de compras, recibir alertas de precios y acceder a funciones personalizadas.'
      },
      {
        question: '¿Es gratis usar AhorraYa VZ?',
        answer: 'Sí, AhorraYa VZ es completamente gratuito para los consumidores. No cobramos por buscar productos, comparar precios o usar cualquiera de nuestras funciones.'
      }
    ],
    'account': [
      {
        question: '¿Cómo creo una cuenta?',
        answer: 'Haz clic en "Registrarse" en la parte superior de la página. Puedes registrarte como Cliente para uso personal o como Comerciante si tienes una tienda. Completa el formulario con tu información y verifica tu email.'
      },
      {
        question: '¿Cómo cambio mi contraseña?',
        answer: 'Ve a Configuración > Seguridad y haz clic en "Cambiar Contraseña". Necesitarás tu contraseña actual para establecer una nueva.'
      },
      {
        question: '¿Cómo actualizo mi información personal?',
        answer: 'En tu perfil, ve a Configuración > Perfil. Allí puedes actualizar tu nombre, email, teléfono, dirección y otras preferencias.'
      },
      {
        question: '¿Cómo elimino mi cuenta?',
        answer: 'En Configuración > Seguridad, encontrarás la opción "Eliminar Cuenta". Esta acción es irreversible y eliminará todos tus datos permanentemente.'
      }
    ],
    'shopping': [
      {
        question: '¿Cómo busco productos?',
        answer: 'Usa la barra de búsqueda en la página principal. Puedes buscar por nombre del producto, marca, categoría o palabras clave. También puedes usar filtros para refinar tus resultados.'
      },
      {
        question: '¿Cómo comparo productos?',
        answer: 'En los resultados de búsqueda, haz clic en "Comparar" en los productos que te interesen. Puedes comparar hasta 4 productos a la vez, viendo sus características, precios y tiendas lado a lado.'
      },
      {
        question: '¿Cómo creo una lista de compras?',
        answer: 'Con una cuenta registrada, puedes agregar productos a tu lista de compras haciendo clic en el ícono de carrito. Accede a tu lista desde el menú principal para gestionar cantidades y tiendas.'
      },
      {
        question: '¿Los precios están actualizados?',
        answer: 'Trabajamos constantemente para mantener los precios actualizados. Los comerciantes pueden actualizar precios en tiempo real, pero siempre recomendamos verificar el precio final con la tienda antes de comprar.'
      }
    ],
    'merchants': [
      {
        question: '¿Cómo registro mi tienda?',
        answer: 'Regístrate como "Comerciante" y completa la información de tu negocio. Nuestro equipo revisará tu solicitud en 24-48 horas. Una vez aprobada, podrás agregar productos y gestionar tu tienda.'
      },
      {
        question: '¿Cómo agrego productos a mi tienda?',
        answer: 'Desde tu panel de comerciante, ve a "Gestionar Productos" y haz clic en "Agregar Producto". Completa la información del producto, incluyendo fotos, descripción, precio y stock.'
      },
      {
        question: '¿Cómo actualizo precios?',
        answer: 'En tu panel de comerciante, puedes actualizar precios individualmente o en lote. Los cambios se reflejan inmediatamente en la plataforma.'
      },
      {
        question: '¿Hay algún costo por listar productos?',
        answer: 'El registro básico y listado de productos es gratuito. Ofrecemos planes premium con funciones adicionales como promociones destacadas y análisis avanzados.'
      }
    ],
    'technical': [
      {
        question: '¿Por qué no puedo iniciar sesión?',
        answer: 'Verifica que estés usando el email y contraseña correctos. Si olvidaste tu contraseña, usa "Recuperar Contraseña". Si el problema persiste, contacta a soporte.'
      },
      {
        question: '¿Por qué la página carga lentamente?',
        answer: 'Esto puede deberse a tu conexión a internet o alta demanda en el servidor. Intenta refrescar la página, limpiar el caché del navegador o intentar más tarde.'
      },
      {
        question: '¿Por qué no recibo notificaciones?',
        answer: 'Verifica tu configuración de notificaciones en tu perfil. Asegúrate de que las notificaciones estén habilitadas y revisa tu carpeta de spam para emails.'
      },
      {
        question: '¿Cómo reporto un error?',
        answer: 'Usa nuestro formulario de contacto seleccionando "Reportar Error" o envía un email a soporte@ahorrayavz.com con detalles del problema y capturas de pantalla si es posible.'
      }
    ]
  };

  const quickActions = [
    {
      title: 'Contactar Soporte',
      description: 'Habla directamente con nuestro equipo',
      icon: <Phone />,
      action: () => navigate('/contact'),
      color: 'primary'
    },
    {
      title: 'Reportar Problema',
      description: 'Informa sobre errores o problemas',
      icon: <BugReport />,
      action: () => navigate('/contact'),
      color: 'error'
    },
    {
      title: 'Enviar Sugerencia',
      description: 'Comparte ideas para mejorar',
      icon: <Feedback />,
      action: () => navigate('/contact'),
      color: 'success'
    },
    {
      title: 'Ver Tutoriales',
      description: 'Videos paso a paso',
      icon: <VideoLibrary />,
      action: () => {},
      color: 'secondary'
    }
  ];

  const tutorials = [
    {
      title: 'Cómo buscar productos',
      duration: '2:30',
      views: '1.2k',
      rating: 4.8,
      thumbnail: '/api/placeholder/300/200'
    },
    {
      title: 'Crear y gestionar listas de compras',
      duration: '3:45',
      views: '856',
      rating: 4.9,
      thumbnail: '/api/placeholder/300/200'
    },
    {
      title: 'Configurar alertas de precios',
      duration: '1:50',
      views: '2.1k',
      rating: 4.7,
      thumbnail: '/api/placeholder/300/200'
    }
  ];

  const filteredFAQ = searchQuery
    ? Object.values(faqData).flat().filter(
        item => 
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqData[helpCategories[tabValue]?.id] || [];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          component="button"
          variant="body1"
          onClick={() => navigate('/')}
          sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
        >
          <Home sx={{ mr: 0.5 }} fontSize="inherit" />
          Inicio
        </Link>
        <Typography color="text.primary">Centro de Ayuda</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Paper elevation={2} sx={{ p: 4, mb: 4, textAlign: 'center' }}>
        <HelpIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h3" gutterBottom>
          Centro de Ayuda
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Encuentra respuestas a tus preguntas y aprende a usar AhorraYa VZ
        </Typography>
        
        {/* Search Bar */}
        <Box sx={{ mt: 3, maxWidth: 600, mx: 'auto' }}>
          <TextField
            fullWidth
            placeholder="Buscar en la ayuda..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              )
            }}
          />
        </Box>
      </Paper>

      {/* Quick Actions */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {quickActions.map((action, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-2px)' }
              }}
              onClick={action.action}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar 
                  sx={{ 
                    bgcolor: `${action.color}.main`, 
                    mx: 'auto', 
                    mb: 2,
                    width: 56,
                    height: 56
                  }}
                >
                  {action.icon}
                </Avatar>
                <Typography variant="h6" gutterBottom>
                  {action.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {action.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          {!searchQuery ? (
            <>
              {/* Category Tabs */}
              <Paper sx={{ mb: 3 }}>
                <Tabs 
                  value={tabValue} 
                  onChange={(e, newValue) => setTabValue(newValue)}
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  {helpCategories.map((category, index) => (
                    <Tab
                      key={category.id}
                      label={category.title}
                      icon={category.icon}
                      iconPosition="start"
                    />
                  ))})
                </Tabs>
              </Paper>

              {/* Category Description */}
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  {helpCategories[tabValue]?.description}
                </Typography>
              </Alert>
            </>
          ) : (
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                Mostrando resultados para: "{searchQuery}"
              </Typography>
            </Alert>
          )}

          {/* FAQ Section */}
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {searchQuery ? 'Resultados de Búsqueda' : 'Preguntas Frecuentes'}
              </Typography>
              
              {filteredFAQ.length > 0 ? (
                filteredFAQ.map((faq, index) => (
                  <Accordion key={index}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography variant="h6">
                        {faq.question}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body1">
                        {faq.answer}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" color="text.secondary">
                    No se encontraron resultados
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Intenta con otros términos de búsqueda
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Popular Articles */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Artículos Populares
              </Typography>
              
              <List>
                <ListItem button>
                  <ListItemIcon>
                    <TrendingUp color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Cómo encontrar las mejores ofertas"
                    secondary="Leído 2.3k veces"
                  />
                </ListItem>
                <ListItem button>
                  <ListItemIcon>
                    <LocalOffer color="warning" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Configurar alertas de precios"
                    secondary="Leído 1.8k veces"
                  />
                </ListItem>
                <ListItem button>
                  <ListItemIcon>
                    <Compare color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Comparar productos efectivamente"
                    secondary="Leído 1.5k veces"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          {/* Video Tutorials */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tutoriales en Video
              </Typography>
              
              {tutorials.map((tutorial, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PlayArrow color="primary" sx={{ mr: 1 }} />
                    <Typography variant="subtitle2">
                      {tutorial.title}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip 
                      label={tutorial.duration} 
                      size="small" 
                      icon={<AccessTime />}
                    />
                    <Chip 
                      label={`${tutorial.views} vistas`} 
                      size="small" 
                      variant="outlined"
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Star sx={{ fontSize: 16, color: 'warning.main' }} />
                      <Typography variant="caption">
                        {tutorial.rating}
                      </Typography>
                    </Box>
                  </Box>
                  {index < tutorials.length - 1 && <Divider sx={{ mt: 2 }} />}
                </Box>
              ))}
            </CardContent>
          </Card>

          {/* Contact Support */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                ¿Necesitas más ayuda?
              </Typography>
              
              <Typography variant="body2" color="text.secondary" paragraph>
                Si no encuentras la respuesta que buscas, nuestro equipo de soporte 
                está aquí para ayudarte.
              </Typography>
              
              <Button 
                variant="contained" 
                fullWidth 
                startIcon={<Email />}
                onClick={() => navigate('/contact')}
                sx={{ mb: 2 }}
              >
                Contactar Soporte
              </Button>
              
              <Button 
                variant="outlined" 
                fullWidth 
                startIcon={<Phone />}
                href="tel:+582125550123"
              >
                Llamar: (212) 555-0123
              </Button>
              
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  Horario: Lun - Vie, 8:00 AM - 6:00 PM
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Feedback Section */}
      <Paper sx={{ p: 3, mt: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          ¿Te fue útil esta información?
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button startIcon={<ThumbUp />} variant="outlined">
            Sí, me ayudó
          </Button>
          <Button startIcon={<Feedback />} variant="outlined">
            Podría mejorar
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Help;