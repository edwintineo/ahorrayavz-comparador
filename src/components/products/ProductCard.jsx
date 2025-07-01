import React from 'react'
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material'
import {
  Add as AddIcon,
  Store as StoreIcon,
  LocationOn as LocationIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store/useStore'

/**
 * Componente ProductCard - Muestra información de un producto en formato de tarjeta
 * 
 * @param {Object} product - Objeto del producto
 * @param {number} product.id - ID del producto
 * @param {string} product.title - Título del producto
 * @param {string} product.excerpt - Descripción corta del producto
 * @param {number} product.price_bs - Precio en bolívares
 * @param {number} product.price_usd - Precio en dólares
 * @param {string} product.image - URL de la imagen del producto
 * @param {string} product.brand - Marca del producto
 * @param {string} product.category - Categoría del producto
 * @param {Object} store - Información de la tienda
 * @param {string} store.name - Nombre de la tienda
 * @param {string} store.address - Dirección de la tienda
 * @param {number} store.distance - Distancia en km (opcional)
 * @param {boolean} showStore - Si mostrar información de la tienda
 * @param {boolean} compact - Si usar diseño compacto
 */
const ProductCard = ({ 
  product, 
  store = null, 
  showStore = true, 
  compact = false 
}) => {
  const navigate = useNavigate()
  const { addToShoppingList, exchangeRate } = useStore()
  const [isFavorite, setIsFavorite] = React.useState(false)

  // Calcular precio en USD si no está disponible
  const priceUsd = product.price_usd || 
    (exchangeRate.rate > 0 ? product.price_bs / exchangeRate.rate : 0)

  // Formatear precios
  const formatPrice = (price, currency) => {
    if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
      }).format(price)
    } else {
      return new Intl.NumberFormat('es-VE', {
        style: 'currency',
        currency: 'VES',
        minimumFractionDigits: 2
      }).format(price)
    }
  }

  const handleCardClick = () => {
    navigate(`/producto/${product.id}`)
  }

  const handleAddToList = (e) => {
    e.stopPropagation()
    addToShoppingList({
      ...product,
      price_usd: priceUsd,
      store: store
    })
  }

  const handleToggleFavorite = (e) => {
    e.stopPropagation()
    setIsFavorite(!isFavorite)
    // Aquí se podría agregar lógica para guardar en favoritos
  }

  const handleStoreClick = (e) => {
    e.stopPropagation()
    if (store?.id) {
      navigate(`/tienda/${store.id}`)
    }
  }

  return (
    <Card 
      className="product-card"
      sx={{ 
        height: compact ? 'auto' : '100%',
        display: 'flex',
        flexDirection: compact ? 'row' : 'column',
        cursor: 'pointer',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3
        },
        transition: 'all 0.2s ease-in-out'
      }}
      onClick={handleCardClick}
    >
      {/* Botón de favoritos */}
      <IconButton
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 1)'
          }
        }}
        onClick={handleToggleFavorite}
        size="small"
      >
        {isFavorite ? (
          <FavoriteIcon color="error" fontSize="small" />
        ) : (
          <FavoriteBorderIcon fontSize="small" />
        )}
      </IconButton>

      {/* Imagen del producto */}
      <CardMedia
        component="img"
        sx={{
          width: compact ? 120 : '100%',
          height: compact ? 120 : 200,
          objectFit: 'cover'
        }}
        image={product.image || '/placeholder-product.jpg'}
        alt={product.title}
        loading="lazy"
      />

      <CardContent sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column',
        padding: compact ? 2 : 2
      }}>
        {/* Categoría y marca */}
        <Box sx={{ mb: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {product.category && (
            <Chip 
              label={product.category} 
              size="small" 
              color="primary" 
              variant="outlined"
            />
          )}
          {product.brand && (
            <Chip 
              label={product.brand} 
              size="small" 
              variant="outlined"
            />
          )}
        </Box>

        {/* Título del producto */}
        <Typography 
          variant={compact ? "body1" : "h6"} 
          component="h3"
          sx={{ 
            fontWeight: 600,
            mb: 1,
            display: '-webkit-box',
            WebkitLineClamp: compact ? 2 : 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: 1.3
          }}
        >
          {product.title}
        </Typography>

        {/* Descripción (solo en modo no compacto) */}
        {!compact && product.excerpt && (
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {product.excerpt.replace(/<[^>]*>/g, '')}
          </Typography>
        )}

        {/* Información de la tienda */}
        {showStore && store && (
          <Box 
            sx={{ 
              mb: 2, 
              p: 1, 
              backgroundColor: 'grey.50', 
              borderRadius: 1,
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'grey.100'
              }
            }}
            onClick={handleStoreClick}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <StoreIcon fontSize="small" color="primary" />
              <Typography variant="body2" fontWeight={500}>
                {store.name}
              </Typography>
            </Box>
            {store.address && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationIcon fontSize="small" color="action" />
                <Typography variant="caption" color="text.secondary">
                  {store.address}
                  {store.distance && ` • ${store.distance.toFixed(1)} km`}
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Precios */}
        <Box className="price-display" sx={{ mt: 'auto', mb: 2 }}>
          <Typography 
            className="price-bs"
            variant={compact ? "h6" : "h5"}
            component="div"
            sx={{ 
              fontWeight: 700,
              color: 'primary.main',
              lineHeight: 1.2
            }}
          >
            {formatPrice(product.price_bs, 'VES')}
          </Typography>
          <Typography 
            className="price-usd"
            variant="body2"
            color="text.secondary"
            sx={{ fontStyle: 'italic' }}
          >
            ≈ {formatPrice(priceUsd, 'USD')}
          </Typography>
        </Box>

        {/* Botón de agregar a lista */}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddToList}
          fullWidth
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600
          }}
        >
          Agregar a Lista
        </Button>
      </CardContent>
    </Card>
  )
}

export default ProductCard