import React from 'react'
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Paper
} from '@mui/material'
import {
  TrendingUp as TrendingIcon,
  Store as StoreIcon
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()
  
  // Datos de ejemplo simples
  const mockProducts = [
    {
      id: 1,
      title: 'Arroz Diana 1kg',
      price_bs: 45000,
      price_usd: 1.25,
      category: 'Supermercado',
      brand: 'Diana'
    },
    {
      id: 2,
      title: 'Aceite Mazeite 1L',
      price_bs: 38000,
      price_usd: 1.05,
      category: 'Supermercado',
      brand: 'Mazeite'
    },
    {
      id: 3,
      title: 'Harina P.A.N. 1kg',
      price_bs: 28000,
      price_usd: 0.78,
      category: 'Supermercado',
      brand: 'P.A.N.'
    },
    {
      id: 4,
      title: 'Pasta La Favorita 500g',
      price_bs: 15000,
      price_usd: 0.42,
      category: 'Supermercado',
      brand: 'La Favorita'
    }
  ]
  
  const mockStores = [
    {
      id: 1,
      name: 'Supermercado Central',
      description: 'Tu supermercado de confianza con los mejores precios',
      category: 'Supermercado',
      rating: 4.5
    },
    {
      id: 2,
      name: 'Farmacia San Rafael',
      description: 'Medicamentos y productos de salud al mejor precio',
      category: 'Farmacia',
      rating: 4.2
    },
    {
      id: 3,
      name: 'Ferretería El Martillo',
      description: 'Todo para la construcción y el hogar',
      category: 'Ferretería',
      rating: 4.7
    }
  ]

  const categories = [
    { name: 'Supermercado', icon: '🛒', color: '#4CAF50' },
    { name: 'Farmacia', icon: '💊', color: '#2196F3' },
    { name: 'Ferretería', icon: '🔧', color: '#FF9800' },
    { name: 'Licorería', icon: '🍷', color: '#9C27B0' },
    { name: 'Panadería', icon: '🍞', color: '#795548' },
    { name: 'Tecnología', icon: '📱', color: '#607D8B' }
  ]

  const handleCategoryClick = (category) => {
    navigate(`/buscar?categoria=${encodeURIComponent(category)}`)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-VE').format(price)
  }

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
          color: 'white',
          py: 8,
          mb: 4
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
              }}
            >
              Encuentra los Mejores Precios en Venezuela
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 4, 
                opacity: 0.9,
                fontSize: { xs: '1.1rem', sm: '1.3rem' }
              }}
            >
              Compara precios en miles de productos y ahorra en tus compras
            </Typography>
            
            {/* Tasa de cambio */}
            <Paper
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                px: 3,
                py: 1,
                mb: 4,
                backgroundColor: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <TrendingIcon sx={{ mr: 1 }} />
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                Tasa BCV: Bs. 50.00
              </Typography>
            </Paper>
          </Box>
          
          {/* Barra de búsqueda simple */}
          <Box sx={{ maxWidth: 800, mx: 'auto', textAlign: 'center' }}>
            <Button 
              variant="contained" 
              size="large"
              onClick={() => navigate('/buscar')}
              sx={{
                backgroundColor: 'white',
                color: 'primary.main',
                fontWeight: 600,
                px: 4,
                py: 2,
                fontSize: '1.1rem'
              }}
            >
              🔍 Buscar Productos
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* Mensaje informativo */}
        <Box sx={{ mb: 4 }}>
          <Paper
            sx={{
              p: 3,
              backgroundColor: 'info.light',
              color: 'info.contrastText',
              textAlign: 'center'
            }}
          >
            <Typography variant="h6" gutterBottom>
              🚀 ¡Bienvenido a AhorraYa VZ!
            </Typography>
            <Typography variant="body1">
              Plataforma de comparación de precios en Venezuela. 
              Encuentra los mejores precios y ahorra en tus compras.
            </Typography>
          </Paper>
        </Box>
        
        {/* Categorías populares */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Categorías Populares
          </Typography>
          <Grid container spacing={2}>
            {categories.map((category, index) => (
              <Grid item xs={6} sm={4} md={2} key={index}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 3
                    }
                  }}
                  onClick={() => handleCategoryClick(category.name)}
                >
                  <CardContent sx={{ py: 3 }}>
                    <Box
                      sx={{
                        fontSize: '2rem',
                        mb: 1,
                        display: 'flex',
                        justifyContent: 'center'
                      }}
                    >
                      {category.icon}
                    </Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 500,
                        color: category.color
                      }}
                    >
                      {category.name}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Productos destacados */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              Productos Destacados
            </Typography>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/buscar')}
              sx={{ textTransform: 'none' }}
            >
              Ver Todos
            </Button>
          </Box>
          
          <Grid container spacing={3}>
            {mockProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 3
                    }
                  }}
                  onClick={() => navigate(`/producto/${product.id}`)}
                >
                  <Box
                    sx={{
                      height: 200,
                      backgroundColor: 'grey.100',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '3rem'
                    }}
                  >
                    📦
                  </Box>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      {product.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {product.brand} • {product.category}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                        Bs. {formatPrice(product.price_bs)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ${product.price_usd}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Tiendas destacadas */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Tiendas Destacadas
          </Typography>
          
          <Grid container spacing={3}>
            {mockStores.map((store) => (
              <Grid item xs={12} sm={6} md={4} key={store.id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 3
                    }
                  }}
                  onClick={() => navigate(`/tienda/${store.id}`)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          backgroundColor: 'primary.main',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          mr: 2
                        }}
                      >
                        <StoreIcon />
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {store.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ⭐ {store.rating} • {store.category}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {store.description}
                    </Typography>
                    
                    <Chip 
                      label={store.category} 
                      size="small" 
                      variant="outlined"
                      sx={{ mt: 1 }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Call to action */}
        <Box
          sx={{
            textAlign: 'center',
            py: 6,
            mb: 4,
            background: 'linear-gradient(135deg, #FFC107 0%, #FF8F00 100%)',
            borderRadius: 3,
            color: 'white'
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            ¿Tienes una tienda?
          </Typography>
          <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
            Únete a AhorraYa VZ y llega a más clientes
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/registro?tipo=comercio')}
            sx={{
              backgroundColor: 'white',
              color: 'primary.main',
              fontWeight: 600,
              px: 4,
              py: 1.5,
              '&:hover': {
                backgroundColor: 'grey.100'
              }
            }}
          >
            Registrar mi Tienda
          </Button>
        </Box>
      </Container>
    </Box>
  )
}

export default Home