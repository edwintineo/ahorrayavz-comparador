import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
  FormControlLabel,
  Paper,
  Skeleton,
  Tooltip,
  Fab,
  Breadcrumbs,
  Link,
  Menu,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  Badge,
  CardMedia,
  CardActions
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Add,
  Remove,
  Delete,
  Store,
  LocationOn,
  AttachMoney,
  Share,
  Print,
  Clear,
  Search,
  FilterList,
  Sort,
  CheckCircle,
  Home,
  NavigateNext,
  ShoppingCart,
  Compare,
  Visibility,
  Star,
  StarBorder,
  Phone,
  Email,
  Language,
  Schedule,
  MoreVert,
  Category,
  LocalOffer,
  TrendingUp,
  TrendingDown,
  Inventory
} from '@mui/icons-material';
import { useStore } from '../store/useStore';
import { useProducts, useStores } from '../hooks/useWordPressAPI';
import { useNotification } from '../contexts/NotificationContext';
import ProductCard from '../components/products/ProductCard';

const Favorites = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { 
    user, 
    exchangeRate, 
    convertPrice, 
    favorites,
    favoriteStores,
    toggleFavorite,
    toggleFavoriteStore,
    addToShoppingList,
    addToComparison
  } = useStore();
  const { getProduct, searchProducts } = useProducts();
  const { getStore, searchStores } = useStores();
  
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [sortBy, setSortBy] = useState('name');
  const [filterCategory, setFilterCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [menuAnchor, setMenuAnchor] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    loadFavorites();
  }, [user, favorites, favoriteStores]);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      
      // Load favorite products
      const favoriteProducts = [];
      for (const productId of favorites) {
        try {
          const product = await getProduct(productId);
          if (product) {
            favoriteProducts.push(product);
          }
        } catch (error) {
          console.error(`Error loading product ${productId}:`, error);
        }
      }
      
      // Load favorite stores
      const favoriteStoresList = [];
      for (const storeId of favoriteStores) {
        try {
          const store = await getStore(storeId);
          if (store) {
            favoriteStoresList.push(store);
          }
        } catch (error) {
          console.error(`Error loading store ${storeId}:`, error);
        }
      }
      
      setProducts(favoriteProducts);
      setStores(favoriteStoresList);
      
    } catch (error) {
      console.error('Error loading favorites:', error);
      showNotification('Error al cargar favoritos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = (productId) => {
    toggleFavorite(productId);
    showNotification('Producto removido de favoritos', 'info');
  };

  const handleRemoveFavoriteStore = (storeId) => {
    toggleFavoriteStore(storeId);
    showNotification('Tienda removida de favoritos', 'info');
  };

  const handleAddToCart = (product) => {
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

  const handleAddToComparison = (product) => {
    addToComparison(product);
    showNotification('Producto agregado a comparación', 'success');
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    const currentItems = tabValue === 0 ? getFilteredProducts() : getFilteredStores();
    if (selectedItems.size === currentItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(currentItems.map(item => item.id)));
    }
  };

  const handleRemoveSelected = () => {
    if (tabValue === 0) {
      // Remove selected products
      selectedItems.forEach(productId => {
        toggleFavorite(productId);
      });
      showNotification(`${selectedItems.size} productos removidos de favoritos`, 'info');
    } else {
      // Remove selected stores
      selectedItems.forEach(storeId => {
        toggleFavoriteStore(storeId);
      });
      showNotification(`${selectedItems.size} tiendas removidas de favoritos`, 'info');
    }
    setSelectedItems(new Set());
  };

  const handleAddSelectedToCart = () => {
    const selectedProducts = products.filter(product => selectedItems.has(product.id));
    selectedProducts.forEach(product => {
      handleAddToCart(product);
    });
    setSelectedItems(new Set());
    showNotification(`${selectedProducts.length} productos agregados a la lista`, 'success');
  };

  const handleAddSelectedToComparison = () => {
    const selectedProducts = products.filter(product => selectedItems.has(product.id));
    if (selectedProducts.length > 4) {
      showNotification('Máximo 4 productos para comparar', 'warning');
      return;
    }
    
    selectedProducts.forEach(product => {
      addToComparison(product);
    });
    setSelectedItems(new Set());
    showNotification(`${selectedProducts.length} productos agregados a comparación`, 'success');
    navigate('/comparar');
  };

  const getFilteredProducts = () => {
    let filtered = products.filter(product => {
      if (filterCategory && product.acf?.categoria !== filterCategory) return false;
      if (searchQuery && !product.title.rendered.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.rendered.localeCompare(b.title.rendered);
        case 'price':
          return (a.acf?.precio_bs || 0) - (b.acf?.precio_bs || 0);
        case 'category':
          return (a.acf?.categoria || '').localeCompare(b.acf?.categoria || '');
        case 'store':
          return (a.acf?.tienda_nombre || '').localeCompare(b.acf?.tienda_nombre || '');
        default:
          return 0;
      }
    });

    return filtered;
  };

  const getFilteredStores = () => {
    let filtered = stores.filter(store => {
      if (searchQuery && !store.title.rendered.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });

    // Sort stores
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.rendered.localeCompare(b.title.rendered);
        case 'rating':
          return (b.acf?.calificacion || 0) - (a.acf?.calificacion || 0);
        case 'products':
          return (b.acf?.total_productos || 0) - (a.acf?.total_productos || 0);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const getCategories = () => {
    const categories = new Set(products.map(product => product.acf?.categoria).filter(Boolean));
    return Array.from(categories);
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

  const handleShare = () => {
    const shareText = tabValue === 0 
      ? `Mis productos favoritos en AhorraYa VZ:\n${products.map(p => p.title.rendered).join('\n')}`
      : `Mis tiendas favoritas en AhorraYa VZ:\n${stores.map(s => s.title.rendered).join('\n')}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Mis Favoritos - AhorraYa VZ',
        text: shareText
      });
    } else {
      navigator.clipboard.writeText(shareText);
      showNotification('Lista copiada al portapapeles', 'success');
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item}>
              <Card>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Skeleton variant="text" height={24} />
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

  const filteredProducts = getFilteredProducts();
  const filteredStores = getFilteredStores();
  const categories = getCategories();
  const currentItems = tabValue === 0 ? filteredProducts : filteredStores;

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
        <Typography color="text.primary">Favoritos</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Mis Favoritos
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {products.length} producto{products.length !== 1 ? 's' : ''} y {stores.length} tienda{stores.length !== 1 ? 's' : ''}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            onClick={(e) => setMenuAnchor(e.currentTarget)}
          >
            <MoreVert />
          </IconButton>
        </Box>
      </Box>

      {/* Empty State */}
      {products.length === 0 && stores.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Favorite sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            No tienes favoritos aún
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Agrega productos y tiendas a tus favoritos para encontrarlos fácilmente aquí.
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
      )}

      {(products.length > 0 || stores.length > 0) && (
        <>
          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
              <Tab 
                label={
                  <Badge badgeContent={products.length} color="primary">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Inventory />
                      Productos
                    </Box>
                  </Badge>
                } 
              />
              <Tab 
                label={
                  <Badge badgeContent={stores.length} color="primary">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Store />
                      Tiendas
                    </Box>
                  </Badge>
                } 
              />
            </Tabs>
          </Box>

          {/* Filters and Controls */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Buscar"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    fullWidth
                    size="small"
                    InputProps={{
                      startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />
                    }}
                  />
                </Grid>
                
                {tabValue === 0 && (
                  <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Categoría</InputLabel>
                      <Select
                        value={filterCategory}
                        label="Categoría"
                        onChange={(e) => setFilterCategory(e.target.value)}
                      >
                        <MenuItem value="">Todas las categorías</MenuItem>
                        {categories.map((category) => (
                          <MenuItem key={category} value={category}>{category}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                )}
                
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Ordenar por</InputLabel>
                    <Select
                      value={sortBy}
                      label="Ordenar por"
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <MenuItem value="name">Nombre</MenuItem>
                      {tabValue === 0 ? (
                        <>
                          <MenuItem value="price">Precio</MenuItem>
                          <MenuItem value="category">Categoría</MenuItem>
                          <MenuItem value="store">Tienda</MenuItem>
                        </>
                      ) : (
                        <>
                          <MenuItem value="rating">Calificación</MenuItem>
                          <MenuItem value="products">Productos</MenuItem>
                        </>
                      )}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              
              {selectedItems.size > 0 && (
                <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    label={`${selectedItems.size} seleccionado${selectedItems.size !== 1 ? 's' : ''}`}
                    color="primary"
                    onDelete={() => setSelectedItems(new Set())}
                  />
                  
                  {tabValue === 0 && (
                    <>
                      <Button
                        size="small"
                        startIcon={<ShoppingCart />}
                        onClick={handleAddSelectedToCart}
                      >
                        Agregar a lista
                      </Button>
                      <Button
                        size="small"
                        startIcon={<Compare />}
                        onClick={handleAddSelectedToComparison}
                        disabled={selectedItems.size > 4}
                      >
                        Comparar
                      </Button>
                    </>
                  )}
                  
                  <Button
                    size="small"
                    color="error"
                    startIcon={<Delete />}
                    onClick={handleRemoveSelected}
                  >
                    Remover
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Products Tab */}
          {tabValue === 0 && (
            <Grid container spacing={3}>
              {filteredProducts.map((product) => {
                const isSelected = selectedItems.has(product.id);
                
                return (
                  <Grid item xs={12} sm={6} md={4} key={product.id}>
                    <Card 
                      sx={{ 
                        height: '100%',
                        position: 'relative',
                        border: isSelected ? '2px solid' : '1px solid',
                        borderColor: isSelected ? 'primary.main' : 'divider'
                      }}
                    >
                      {/* Selection Checkbox */}
                      <Checkbox
                        checked={isSelected}
                        onChange={() => handleSelectItem(product.id)}
                        sx={{ position: 'absolute', top: 8, left: 8, zIndex: 1 }}
                      />
                      
                      {/* Favorite Button */}
                      <IconButton
                        sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
                        onClick={() => handleRemoveFavorite(product.id)}
                        color="error"
                      >
                        <Favorite />
                      </IconButton>

                      {/* Product Image */}
                      <CardMedia
                        component="img"
                        height={200}
                        image={product.acf?.imagenes?.[0] || '/placeholder-product.jpg'}
                        alt={product.title.rendered}
                        sx={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/producto/${product.id}`)}
                      />

                      <CardContent>
                        {/* Product Title */}
                        <Typography
                          variant="h6"
                          sx={{
                            mb: 1,
                            cursor: 'pointer',
                            '&:hover': { color: 'primary.main' },
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
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
                      </CardContent>

                      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<ShoppingCart />}
                          onClick={() => handleAddToCart(product)}
                          fullWidth
                          sx={{ mr: 1 }}
                        >
                          Agregar
                        </Button>
                        
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Tooltip title="Comparar">
                            <IconButton
                              size="small"
                              onClick={() => handleAddToComparison(product)}
                            >
                              <Compare />
                            </IconButton>
                          </Tooltip>
                          
                          <Tooltip title="Ver detalles">
                            <IconButton
                              size="small"
                              onClick={() => navigate(`/producto/${product.id}`)}
                            >
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}

          {/* Stores Tab */}
          {tabValue === 1 && (
            <Grid container spacing={3}>
              {filteredStores.map((store) => {
                const isSelected = selectedItems.has(store.id);
                
                return (
                  <Grid item xs={12} sm={6} md={4} key={store.id}>
                    <Card 
                      sx={{ 
                        height: '100%',
                        position: 'relative',
                        border: isSelected ? '2px solid' : '1px solid',
                        borderColor: isSelected ? 'primary.main' : 'divider'
                      }}
                    >
                      {/* Selection Checkbox */}
                      <Checkbox
                        checked={isSelected}
                        onChange={() => handleSelectItem(store.id)}
                        sx={{ position: 'absolute', top: 8, left: 8, zIndex: 1 }}
                      />
                      
                      {/* Favorite Button */}
                      <IconButton
                        sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
                        onClick={() => handleRemoveFavoriteStore(store.id)}
                        color="error"
                      >
                        <Favorite />
                      </IconButton>

                      {/* Store Image */}
                      <CardMedia
                        component="img"
                        height={200}
                        image={store.acf?.logo || store.acf?.imagen || '/placeholder-store.jpg'}
                        alt={store.title.rendered}
                        sx={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/tienda/${store.id}`)}
                      />

                      <CardContent>
                        {/* Store Title */}
                        <Typography
                          variant="h6"
                          sx={{
                            mb: 1,
                            cursor: 'pointer',
                            '&:hover': { color: 'primary.main' }
                          }}
                          onClick={() => navigate(`/tienda/${store.id}`)}
                        >
                          {store.title.rendered}
                        </Typography>

                        {/* Rating */}
                        {store.acf?.calificacion && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Star color="warning" fontSize="small" />
                            <Typography variant="body2">
                              {store.acf.calificacion.toFixed(1)}
                            </Typography>
                          </Box>
                        )}

                        {/* Location */}
                        {store.acf?.direccion && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <LocationOn fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              {store.acf.direccion}
                            </Typography>
                          </Box>
                        )}

                        {/* Contact */}
                        {store.acf?.telefono && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Phone fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              {store.acf.telefono}
                            </Typography>
                          </Box>
                        )}

                        {/* Products Count */}
                        {store.acf?.total_productos && (
                          <Chip
                            label={`${store.acf.total_productos} productos`}
                            size="small"
                            variant="outlined"
                            sx={{ mt: 1 }}
                          />
                        )}
                      </CardContent>

                      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<Visibility />}
                          onClick={() => navigate(`/tienda/${store.id}`)}
                          fullWidth
                        >
                          Ver Tienda
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}

          {/* No Results */}
          {currentItems.length === 0 && (searchQuery || filterCategory) && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Search sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No se encontraron resultados
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Intenta con otros términos de búsqueda o filtros.
              </Typography>
            </Box>
          )}
        </>
      )}

      {/* Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem onClick={() => { handleSelectAll(); setMenuAnchor(null); }}>
          <CheckCircle sx={{ mr: 1 }} />
          {selectedItems.size === currentItems.length ? 'Deseleccionar todo' : 'Seleccionar todo'}
        </MenuItem>
        <MenuItem onClick={() => { handleShare(); setMenuAnchor(null); }}>
          <Share sx={{ mr: 1 }} />
          Compartir favoritos
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => { setMenuAnchor(null); navigate('/buscar'); }}>
          <Add sx={{ mr: 1 }} />
          Buscar más productos
        </MenuItem>
      </Menu>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => navigate('/buscar')}
      >
        <Add />
      </Fab>
    </Container>
  );
};

export default Favorites;