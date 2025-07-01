import { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Paper,
  Avatar,
  Rating,
  Skeleton
} from '@mui/material'
import {
  TrendingUp as TrendingIcon,
  LocalOffer as OfferIcon,
  Store as StoreIcon,
  Star as StarIcon
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../components/search/SearchBar'
import ProductCard from '../components/products/ProductCard'
import { useProducts, useStores } from '../hooks/useWordPressAPI'
import { useExchangeRateContext } from '../contexts/ExchangeRateContext'

const Home = () => {
  const navigate = useNavigate()
  const { exchangeRate } = useExchangeRateContext()
  const { products, loading: productsLoading, fetchProducts } = useProducts()
  const { stores, loading: storesLoading, fetchStores } = useStores()
  
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [topStores, setTopStores] = useState([])

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Cargar productos destacados
        await fetchProducts({ 
          perPage: 8, 
          orderBy: 'date',
          order: 'desc'
        })
        
        // Cargar tiendas destacadas
        await fetchStores({ 
          perPage: 6,
          featured: true
        })
      } catch (error) {
        console.error('Error cargando datos iniciales:', error)
      }
    }

    loadInitialData()
  }, [])

  // Actualizar productos y tiendas destacadas
  useEffect(() => {
    setFeaturedProducts(products.slice(0, 8))
  }, [products])

  useEffect(() => {
    setTopStores(stores.slice(0, 6))
  }, [stores])

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

  const formatExchangeRate = (rate) => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: 'VES',
      minimumFractionDigits: 2
    }).format(rate)
  }

  return (
    <Box>
      {/* Hero Section */}
      <Box
        className="search-container"
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
            
            {/* Tasa de cambio destacada */}
            {exchangeRate.rate > 0 && (
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
                  Tasa BCV: {formatExchangeRate(exchangeRate.rate)}
                </Typography>
              </Paper>
            )}
          </Box>
          
          {/* Barra de búsqueda principal */}
          <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            <SearchBar showFilters={true} />
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg">
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
            {productsLoading ? (
              // Skeleton loading
              Array.from(new Array(8)).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <Card>
                    <Skeleton variant="rectangular" height={200} />
                    <CardContent>
                      <Skeleton variant="text" height={24} />
                      <Skeleton variant="text" height={20} width="60%" />
                      <Skeleton variant="text" height={32} width="40%" />
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              featuredProducts.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                  <ProductCard 
                    product={product}
                    showStore={false}
                  />
                </Grid>
              ))
            )}
          </Grid>
        </Box>

        {/* Tiendas destacadas */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Tiendas Destacadas
          </Typography>
          
          <Grid container spacing={3}>
            {storesLoading ? (
              // Skeleton loading
              Array.from(new Array(6)).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Skeleton variant="circular" width={48} height={48} />
                        <Box sx={{ ml: 2, flexGrow: 1 }}>
                          <Skeleton variant="text" height={24} />
                          <Skeleton variant="text" height={20} width="60%" />
                        </Box>
                      </Box>
                      <Skeleton variant="text" height={20} />
                      <Skeleton variant="text" height={20} width="80%" />
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              topStores.map((store) => (
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
                        <Avatar
                          src={store.logo}
                          sx={{ width: 48, height: 48, mr: 2 }}
                        >
                          <StoreIcon />
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {store.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Rating 
                              value={store.rating} 
                              readOnly 
                              size="small" 
                              precision={0.5}
                            />
                            <Typography variant="body2" color="text.secondary">
                              ({store.rating})
                            </Typography>
                          </Box>
                        </Box>
                        {store.is_premium && (
                          <Chip 
                            label="Premium" 
                            color="primary" 
                            size="small"
                            icon={<StarIcon />}
                          />
                        )}
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
                        {store.description || store.address}
                      </Typography>
                      
                      {store.category && (
                        <Chip 
                          label={store.category} 
                          size="small" 
                          variant="outlined"
                          sx={{ mt: 1 }}
                        />
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
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