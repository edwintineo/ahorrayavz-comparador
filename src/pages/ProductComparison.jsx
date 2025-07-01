import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Avatar,
  Divider,
  Chip,
  Alert,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Autocomplete,
  Tooltip,
  Fab,
  Breadcrumbs,
  Link
} from '@mui/material';
import {
  Compare,
  Add,
  Remove,
  Star,
  StarBorder,
  Store,
  LocationOn,
  Phone,
  AttachMoney,
  ShoppingCart,
  Share,
  Print,
  Download,
  Clear,
  Search,
  Favorite,
  FavoriteBorder,
  Visibility,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Cancel,
  Info,
  Warning,
  Home,
  NavigateNext,
  SwapHoriz
} from '@mui/icons-material';
import { useStore } from '../store/useStore';
import { useProducts } from '../hooks/useWordPressAPI';
import { useNotification } from '../contexts/NotificationContext';
import ProductCard from '../components/products/ProductCard';

const ProductComparison = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { showNotification } = useNotification();
  const { 
    user, 
    exchangeRate, 
    convertPrice, 
    addToShoppingList, 
    toggleFavorite, 
    favorites,
    comparisonProducts,
    addToComparison,
    removeFromComparison,
    clearComparison
  } = useStore();
  const { searchProducts, getProduct } = useProducts();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // Get product IDs from URL params
  const productIds = searchParams.get('products')?.split(',').filter(Boolean) || [];

  useEffect(() => {
    if (productIds.length > 0) {
      loadProducts();
    } else if (comparisonProducts.length > 0) {
      // Load from store if no URL params
      const ids = comparisonProducts.map(p => p.id).join(',');
      setSearchParams({ products: ids });
    }
  }, [productIds]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const loadedProducts = [];
      
      for (const id of productIds) {
        try {
          const product = await getProduct(id);
          if (product) {
            loadedProducts.push(product);
          }
        } catch (error) {
          console.error(`Error loading product ${id}:`, error);
        }
      }
      
      setProducts(loadedProducts);
      
      if (loadedProducts.length === 0) {
        showNotification('No se pudieron cargar los productos para comparar', 'warning');
      }
      
    } catch (error) {
      console.error('Error loading products:', error);
      showNotification('Error al cargar los productos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchProducts = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    try {
      setSearchLoading(true);
      const result = await searchProducts({
        search: query,
        per_page: 10,
        status: 'publish'
      });
      
      // Filter out products already in comparison
      const filteredResults = result.products.filter(
        product => !productIds.includes(product.id.toString())
      );
      
      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Error searching products:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleAddProduct = (product) => {
    if (products.length >= 4) {
      showNotification('Máximo 4 productos para comparar', 'warning');
      return;
    }
    
    const newProductIds = [...productIds, product.id.toString()];
    setSearchParams({ products: newProductIds.join(',') });
    setSearchDialogOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    
    // Add to store for persistence
    addToComparison(product);
    
    showNotification(`${product.title.rendered} agregado a la comparación`, 'success');
  };

  const handleRemoveProduct = (productId) => {
    const newProductIds = productIds.filter(id => id !== productId.toString());
    
    if (newProductIds.length === 0) {
      navigate('/buscar');
      return;
    }
    
    setSearchParams({ products: newProductIds.join(',') });
    
    // Remove from store
    removeFromComparison(productId);
    
    showNotification('Producto removido de la comparación', 'info');
  };

  const handleClearComparison = () => {
    clearComparison();
    navigate('/buscar');
    showNotification('Comparación limpiada', 'info');
  };

  const handleAddToCart = (product) => {
    if (!user) {
      showNotification('Inicia sesión para agregar productos a tu lista', 'warning');
      navigate('/login');
      return;
    }
    
    addToShoppingList({
      productId: product.id,
      productName: product.title.rendered,
      price: product.acf?.precio_bs || 0,
      quantity: 1,
      storeId: product.acf?.tienda_id,
      storeName: product.acf?.tienda_nombre
    });
    
    showNotification('Producto agregado a tu lista de compras', 'success');
  };

  const handleToggleFavorite = (product) => {
    if (!user) {
      showNotification('Inicia sesión para guardar favoritos', 'warning');
      navigate('/login');
      return;
    }
    
    toggleFavorite(product.id);
    const isFavorite = favorites.includes(product.id);
    showNotification(
      isFavorite ? 'Removido de favoritos' : 'Agregado a favoritos',
      'success'
    );
  };

  const formatPrice = (price, currency = 'bs') => {
    if (!price) return 'N/A';
    
    if (currency === 'bs') {
      return new Intl.NumberFormat('es-VE', {
        style: 'currency',
        currency: 'VES',
        minimumFractionDigits: 2
      }).format(price).replace('VES', 'Bs.');
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(price);
    }
  };

  const getLowestPrice = () => {
    if (products.length === 0) return null;
    
    const prices = products
      .map(p => p.acf?.precio_bs || 0)
      .filter(price => price > 0);
    
    return Math.min(...prices);
  };

  const getHighestPrice = () => {
    if (products.length === 0) return null;
    
    const prices = products
      .map(p => p.acf?.precio_bs || 0)
      .filter(price => price > 0);
    
    return Math.max(...prices);
  };

  const getPriceDifference = (price) => {
    const lowestPrice = getLowestPrice();
    if (!lowestPrice || !price) return 0;
    
    return ((price - lowestPrice) / lowestPrice) * 100;
  };

  const handleShare = () => {
    const url = window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: 'Comparación de Productos - AhorraYa VZ',
        text: 'Compara estos productos en AhorraYa VZ',
        url: url
      });
    } else {
      navigator.clipboard.writeText(url);
      showNotification('Enlace copiado al portapapeles', 'success');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {[1, 2, 3].map((item) => (
            <Grid item xs={12} md={4} key={item}>
              <Card>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Skeleton variant="text" height={40} />
                  <Skeleton variant="text" height={20} />
                  <Skeleton variant="text" height={20} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  if (products.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Compare sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            No hay productos para comparar
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Agrega productos desde la búsqueda o desde las páginas de productos para comenzar a comparar.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/buscar')}
            startIcon={<Search />}
          >
            Buscar Productos
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
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
        <Link
          component="button"
          variant="body1"
          onClick={() => navigate('/buscar')}
          sx={{ textDecoration: 'none' }}
        >
          Búsqueda
        </Link>
        <Typography color="text.primary">Comparación</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Comparación de Productos
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Comparando {products.length} producto{products.length !== 1 ? 's' : ''}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Agregar producto">
            <IconButton
              color="primary"
              onClick={() => setSearchDialogOpen(true)}
              disabled={products.length >= 4}
            >
              <Add />
            </IconButton>
          </Tooltip>
          <Tooltip title="Compartir">
            <IconButton onClick={handleShare}>
              <Share />
            </IconButton>
          </Tooltip>
          <Tooltip title="Imprimir">
            <IconButton onClick={handlePrint}>
              <Print />
            </IconButton>
          </Tooltip>
          <Tooltip title="Limpiar comparación">
            <IconButton color="error" onClick={handleClearComparison}>
              <Clear />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Price Summary */}
      {products.length > 1 && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2">
              <strong>Precio más bajo:</strong> {formatPrice(getLowestPrice())}
            </Typography>
            <Typography variant="body2">
              <strong>Precio más alto:</strong> {formatPrice(getHighestPrice())}
            </Typography>
            <Typography variant="body2">
              <strong>Diferencia:</strong> {formatPrice(getHighestPrice() - getLowestPrice())}
            </Typography>
          </Box>
        </Alert>
      )}

      {/* Products Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {products.map((product) => {
          const priceDiff = getPriceDifference(product.acf?.precio_bs);
          const isLowestPrice = product.acf?.precio_bs === getLowestPrice();
          const isHighestPrice = product.acf?.precio_bs === getHighestPrice();
          
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  position: 'relative',
                  border: isLowestPrice ? '2px solid' : '1px solid',
                  borderColor: isLowestPrice ? 'success.main' : 'divider'
                }}
              >
                {/* Price Badge */}
                {products.length > 1 && (
                  <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
                    {isLowestPrice && (
                      <Chip
                        label="Mejor Precio"
                        color="success"
                        size="small"
                        icon={<TrendingDown />}
                      />
                    )}
                    {isHighestPrice && products.length > 2 && (
                      <Chip
                        label="Más Caro"
                        color="error"
                        size="small"
                        icon={<TrendingUp />}
                      />
                    )}
                  </Box>
                )}
                
                {/* Remove Button */}
                <IconButton
                  sx={{ position: 'absolute', top: 8, left: 8, zIndex: 1 }}
                  size="small"
                  onClick={() => handleRemoveProduct(product.id)}
                  color="error"
                >
                  <Remove />
                </IconButton>

                {/* Product Image */}
                <Box
                  sx={{
                    height: 200,
                    backgroundImage: `url(${product.acf?.imagenes?.[0] || '/placeholder-product.jpg'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    cursor: 'pointer'
                  }}
                  onClick={() => navigate(`/producto/${product.id}`)}
                />

                <CardContent>
                  {/* Product Title */}
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 1,
                      cursor: 'pointer',
                      '&:hover': { color: 'primary.main' }
                    }}
                    onClick={() => navigate(`/producto/${product.id}`)}
                  >
                    {product.title.rendered}
                  </Typography>

                  {/* Category */}
                  <Chip
                    label={product.acf?.categoria || 'Sin categoría'}
                    size="small"
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />

                  {/* Store Info */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Store fontSize="small" color="action" />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { color: 'primary.main' }
                      }}
                      onClick={() => navigate(`/tienda/${product.acf?.tienda_id}`)}
                    >
                      {product.acf?.tienda_nombre || 'Tienda no especificada'}
                    </Typography>
                  </Box>

                  {/* Prices */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h5" color="primary" gutterBottom>
                      {formatPrice(product.acf?.precio_bs)}
                    </Typography>
                    {product.acf?.precio_usd && (
                      <Typography variant="body2" color="text.secondary">
                        {formatPrice(product.acf.precio_usd, 'usd')}
                      </Typography>
                    )}
                    {exchangeRate && product.acf?.precio_bs && (
                      <Typography variant="body2" color="text.secondary">
                        ≈ {formatPrice(convertPrice(product.acf.precio_bs, 'bs', 'usd'), 'usd')}
                      </Typography>
                    )}
                  </Box>

                  {/* Price Difference */}
                  {products.length > 1 && priceDiff > 0 && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                      <Typography variant="body2">
                        +{priceDiff.toFixed(1)}% más caro que el menor precio
                      </Typography>
                    </Alert>
                  )}

                  {/* Specifications Preview */}
                  {product.acf?.especificaciones && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {product.acf.especificaciones}
                    </Typography>
                  )}

                  {/* Action Buttons */}
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<ShoppingCart />}
                      onClick={() => handleAddToCart(product)}
                      fullWidth
                    >
                      Agregar a Lista
                    </Button>
                    
                    <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                      <IconButton
                        size="small"
                        onClick={() => handleToggleFavorite(product)}
                        color={favorites.includes(product.id) ? 'error' : 'default'}
                      >
                        {favorites.includes(product.id) ? <Favorite /> : <FavoriteBorder />}
                      </IconButton>
                      
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Visibility />}
                        onClick={() => navigate(`/producto/${product.id}`)}
                        sx={{ flex: 1 }}
                      >
                        Ver Detalles
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
        
        {/* Add Product Card */}
        {products.length < 4 && (
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: '2px dashed',
                borderColor: 'primary.main',
                '&:hover': {
                  bgcolor: 'action.hover'
                }
              }}
              onClick={() => setSearchDialogOpen(true)}
            >
              <Box sx={{ textAlign: 'center', p: 4 }}>
                <Add sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" color="primary">
                  Agregar Producto
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Busca y agrega más productos para comparar
                </Typography>
              </Box>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Detailed Comparison Table */}
      {products.length > 1 && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Comparación Detallada
            </Typography>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Característica</strong></TableCell>
                    {products.map((product) => (
                      <TableCell key={product.id} align="center">
                        <strong>{product.title.rendered}</strong>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell><strong>Precio (Bs.)</strong></TableCell>
                    {products.map((product) => (
                      <TableCell key={product.id} align="center">
                        <Typography
                          variant="h6"
                          color={product.acf?.precio_bs === getLowestPrice() ? 'success.main' : 'text.primary'}
                        >
                          {formatPrice(product.acf?.precio_bs)}
                        </Typography>
                      </TableCell>
                    ))}
                  </TableRow>
                  
                  <TableRow>
                    <TableCell><strong>Precio (USD)</strong></TableCell>
                    {products.map((product) => (
                      <TableCell key={product.id} align="center">
                        {product.acf?.precio_usd ? 
                          formatPrice(product.acf.precio_usd, 'usd') : 
                          exchangeRate ? 
                            formatPrice(convertPrice(product.acf?.precio_bs || 0, 'bs', 'usd'), 'usd') :
                            'N/A'
                        }
                      </TableCell>
                    ))}
                  </TableRow>
                  
                  <TableRow>
                    <TableCell><strong>Categoría</strong></TableCell>
                    {products.map((product) => (
                      <TableCell key={product.id} align="center">
                        {product.acf?.categoria || 'N/A'}
                      </TableCell>
                    ))}
                  </TableRow>
                  
                  <TableRow>
                    <TableCell><strong>Tienda</strong></TableCell>
                    {products.map((product) => (
                      <TableCell key={product.id} align="center">
                        <Button
                          variant="text"
                          size="small"
                          onClick={() => navigate(`/tienda/${product.acf?.tienda_id}`)}
                        >
                          {product.acf?.tienda_nombre || 'N/A'}
                        </Button>
                      </TableCell>
                    ))}
                  </TableRow>
                  
                  <TableRow>
                    <TableCell><strong>Disponibilidad</strong></TableCell>
                    {products.map((product) => (
                      <TableCell key={product.id} align="center">
                        {product.acf?.disponible !== false ? (
                          <Chip label="Disponible" color="success" size="small" icon={<CheckCircle />} />
                        ) : (
                          <Chip label="No disponible" color="error" size="small" icon={<Cancel />} />
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Search Dialog */}
      <Dialog open={searchDialogOpen} onClose={() => setSearchDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Agregar Producto a la Comparación</DialogTitle>
        <DialogContent>
          <Autocomplete
            options={searchResults}
            getOptionLabel={(option) => option.title.rendered}
            loading={searchLoading}
            onInputChange={(event, newInputValue) => {
              setSearchQuery(newInputValue);
              handleSearchProducts(newInputValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Buscar productos"
                placeholder="Escribe el nombre del producto..."
                fullWidth
                margin="normal"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <Box sx={{ display: 'flex', alignItems: 'center', pl: 1 }}>
                      <Search color="action" />
                    </Box>
                  )
                }}
              />
            )}
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                <Avatar
                  src={option.acf?.imagenes?.[0]}
                  sx={{ width: 40, height: 40, mr: 2 }}
                  variant="rounded"
                >
                  <Inventory />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2">
                    {option.title.rendered}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatPrice(option.acf?.precio_bs)} - {option.acf?.tienda_nombre}
                  </Typography>
                </Box>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleAddProduct(option)}
                >
                  Agregar
                </Button>
              </Box>
            )}
            noOptionsText="No se encontraron productos"
          />
          
          {searchResults.length === 0 && searchQuery && !searchLoading && (
            <Alert severity="info" sx={{ mt: 2 }}>
              No se encontraron productos que coincidan con tu búsqueda.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSearchDialogOpen(false)}>Cancelar</Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setSearchDialogOpen(true)}
        disabled={products.length >= 4}
      >
        <Add />
      </Fab>
    </Container>
  );
};

export default ProductComparison;