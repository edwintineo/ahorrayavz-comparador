import React from 'react'
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material'
import {
  CheckCircle as CheckIcon,
  TrendingUp as TrendingIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Group as GroupIcon,
  Store as StoreIcon
} from '@mui/icons-material'

const About = () => {
  const features = [
    {
      icon: <CheckIcon color="primary" />,
      title: 'Precios Verificados',
      description: 'Todos los precios son verificados y actualizados en tiempo real'
    },
    {
      icon: <TrendingIcon color="primary" />,
      title: 'Tendencias del Mercado',
      description: 'Análisis de tendencias y predicciones de precios'
    },
    {
      icon: <SecurityIcon color="primary" />,
      title: 'Datos Seguros',
      description: 'Tu información personal está protegida con los más altos estándares'
    },
    {
      icon: <SpeedIcon color="primary" />,
      title: 'Búsqueda Rápida',
      description: 'Encuentra los mejores precios en segundos'
    },
    {
      icon: <GroupIcon color="primary" />,
      title: 'Comunidad Activa',
      description: 'Miles de usuarios comparten y verifican precios diariamente'
    },
    {
      icon: <StoreIcon color="primary" />,
      title: 'Red de Comercios',
      description: 'Más de 500 tiendas y comercios verificados'
    }
  ]

  const team = [
    {
      name: 'Carlos Rodríguez',
      role: 'CEO & Fundador',
      description: 'Experto en tecnología financiera con más de 10 años de experiencia'
    },
    {
      name: 'María González',
      role: 'CTO',
      description: 'Ingeniera de software especializada en sistemas de alta disponibilidad'
    },
    {
      name: 'Luis Martínez',
      role: 'Director de Producto',
      description: 'Especialista en experiencia de usuario y análisis de mercado'
    }
  ]

  const stats = [
    { label: 'Productos Monitoreados', value: '50,000+' },
    { label: 'Tiendas Afiliadas', value: '500+' },
    { label: 'Usuarios Activos', value: '25,000+' },
    { label: 'Comparaciones Diarias', value: '100,000+' }
  ]

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Acerca de AhorraYa VZ
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 4, maxWidth: 800, mx: 'auto' }}>
          Somos la plataforma líder en comparación de precios en Venezuela, 
          ayudando a las familias a ahorrar dinero en sus compras diarias.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Chip label="Fundada en 2023" color="primary" />
          <Chip label="100% Venezolana" color="secondary" />
          <Chip label="Gratuita" color="success" />
        </Box>
      </Box>

      {/* Mission Section */}
      <Paper elevation={2} sx={{ p: 4, mb: 6, bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          Nuestra Misión
        </Typography>
        <Typography variant="h6" sx={{ lineHeight: 1.6 }}>
          Democratizar el acceso a información de precios en Venezuela, 
          empoderando a los consumidores para tomar decisiones de compra 
          inteligentes y ayudar a las familias a maximizar su poder adquisitivo 
          en tiempos de incertidumbre económica.
        </Typography>
      </Paper>

      {/* Stats Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4, fontWeight: 600 }}>
          Nuestro Impacto
        </Typography>
        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Card sx={{ textAlign: 'center', p: 2 }}>
                <CardContent>
                  <Typography variant="h3" color="primary" sx={{ fontWeight: 700 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {stat.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Features Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4, fontWeight: 600 }}>
          ¿Por qué elegir AhorraYa VZ?
        </Typography>
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card sx={{ height: '100%', p: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {feature.icon}
                    <Typography variant="h6" sx={{ ml: 1, fontWeight: 600 }}>
                      {feature.title}
                    </Typography>
                  </Box>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Team Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4, fontWeight: 600 }}>
          Nuestro Equipo
        </Typography>
        <Grid container spacing={3}>
          {team.map((member, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ textAlign: 'center', p: 3 }}>
                <CardContent>
                  <Avatar 
                    sx={{ 
                      width: 80, 
                      height: 80, 
                      mx: 'auto', 
                      mb: 2, 
                      bgcolor: 'primary.main',
                      fontSize: '2rem'
                    }}
                  >
                    {member.name.charAt(0)}
                  </Avatar>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    {member.name}
                  </Typography>
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    {member.role}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {member.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Values Section */}
      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          Nuestros Valores
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <CheckIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Transparencia" 
              secondary="Creemos en la información clara y accesible para todos"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Innovación" 
              secondary="Utilizamos tecnología de vanguardia para mejorar la experiencia del usuario"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Compromiso Social" 
              secondary="Contribuimos al bienestar económico de las familias venezolanas"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Calidad" 
              secondary="Nos esforzamos por ofrecer datos precisos y actualizados"
            />
          </ListItem>
        </List>
      </Paper>
    </Container>
  )
}

export default About