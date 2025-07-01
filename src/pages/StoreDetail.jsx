import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Chip,
  Box,
  Divider,
  IconButton,
  Tooltip,
  Alert,
  Skeleton,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Rating,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  ArrowBack,
  Favorite,
  FavoriteBorder,
  Share,
  LocationOn,
  Phone,
  Schedule,
  Email,
  Language,
  Star,
  Search,
  FilterList,
  DirectionsWalk,
  DirectionsCar,
  Public,
  WhatsApp,
  Instagram,
  Facebook
} from '@mui/icons-material';
import { useStores, useProducts } from '../hooks/useWordPressAPI';
import { useStore } from '../store/useStore';
import { useNotification } from '../contexts/NotificationContext';
import ProductCard from '../components/products/ProductCard';

const StoreDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { user, userLocation } = useStore();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [productsLoading, setProductsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  const { getStore } = useStores();
  const { searchProducts } = useProducts();

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        setLoading(true);
        const storeData = await getStore(id);
        setStore(storeData);

        // Check if store is in favorites
        const favorites = JSON.parse(localStorage.getItem('favoriteStores') || '[]');
        setIsFavorite(favorites.includes(parseInt(id)));

        // Fetch store products
        await fetchStoreProducts();

        // Mock reviews (in real app, fetch from API)
        setReviews([
          {
            id: 1,
            user: 'María González',
            rating: 5,
            comment: 'Excelente atención y buenos precios. Muy recomendado.',
            date: '2025-01-15'
          },
          {
            id: 2,
            user: 'Carlos Rodríguez',
            rating: 4,
            comment: 'Buena variedad de productos, aunque a veces tardan en actualizar precios.',
            date: '2025-01-10'
          }
        ]);

      } catch (err) {
        setError('Error al cargar la tienda');
        console.error('Error fetching store:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStoreData();
    }
  }, [id]);

  const fetchStoreProducts = async () => {
    try {
      setProductsLoading(true);
      const result = await searchProducts({
        tienda_id: id,
        search: searchQuery,
        categoria: categoryFilter,
        orderby: sortBy,
        per_page: 20
      });
      
      setProducts(result.products || []);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(
        result.products?.map(p => p.acf?.categoria).filter(Boolean) || []
      )];
      setCategories(uniqueCategories);
      
    } catch (err) {
      console.error('Error fetching store products:', err);
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    if (store) {
      fetchStoreProducts();
    }
  }, [searchQuery, categoryFilter, sortBy]);

  const handleToggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favoriteStores') || '[]');
    const storeId = parseInt(id);
    
    if (isFavorite) {
      const newFavorites = favorites.filter(fav => fav !== storeId);
      localStorage.setItem('favoriteStores', JSON.stringify(newFavorites));
      setIsFavorite(false);
      showNotification('Tienda removida de favoritos', 'info');
    } else {
      favorites.push(storeId);
      localStorage.setItem('favoriteStores', JSON.stringify(favorites));
      setIsFavorite(true);
      showNotification('Tienda agregada a favoritos', 'success');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: store.title.rendered,
          text: `Conoce esta tienda en AhorraYa VZ: ${store.title.rendered}`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      showNotification('Enlace copiado al portapapeles', 'success');
    }
  };

  const calculateDistance = () => {
    if (!userLocation.latitude || !store?.acf?.latitud) return null;
    
    const R = 6371; // Radio de la Tierra en km
    const dLat = (store.acf.latitud - userLocation.latitude) * Math.PI / 180;
    const dLon = (store.acf.longitud - userLocation.longitude) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(userLocation.latitude * Math.PI / 180) * Math.cos(store.acf.latitud * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`;
  };

  const handleSubmitReview = () => {
    if (!user) {
      showNotification('Debes iniciar sesión para dejar una reseña', 'warning');
      navigate('/login');
      return;
    }

    if (!newReview.comment.trim()) {
      showNotification('Por favor escribe un comentario', 'warning');
      return;
    }

    // In real app, submit to API
    const review = {
      id: Date.now(),
      user: user.name || 'Usuario',
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split('T')[0]
    };

    setReviews([review, ...reviews]);
    setNewReview({ rating: 5, comment: '' });
    showNotification('Reseña enviada exitosamente', 'success');
  };

  const openInMaps = () => {
    if (store?.acf?.latitud && store?.acf?.longitud) {
      const url = `https://www.google.com/maps?q=${store.acf.latitud},${store.acf.longitud}`;
      window.open(url, '_blank');
    }
  };

  const openWhatsApp = () => {
    if (store?.acf?.whatsapp) {
      const url = `https://wa.me/${store.acf.whatsapp.replace(/[^0-9]/g, '')}`;
      window.open(url, '_blank');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Skeleton variant="rectangular" height={300} sx={{ mb: 3 }} />
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Skeleton variant="text" height={60} />
            <Skeleton variant="text" height={40} width="60%" />
            <Skeleton variant="rectangular" height={200} sx={{ mt: 2 }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={300} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (error || !store) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Tienda no encontrada'}
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          variant="outlined"
        >
          Volver
        </Button>
      </Container>
    );
  }

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  const distance = calculateDistance();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
        variant="outlined"
      >
        Volver
      </Button>

      {/* Store Header */}
      <Card sx={{ mb: 4 }}>
        {store.acf?.imagen_portada && (
          <CardMedia
            component="img"
            height="300"
            image={store.acf.imagen_portada}
            alt={store.title.rendered}
            sx={{ objectFit: 'cover' }}
          />
        )}
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h4" component="h1" gutterBottom>
                    {store.title.rendered}
                  </Typography>
                  
                  {store.acf?.categoria && (
                    <Chip
                      label={store.acf.categoria}
                      color="primary"
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
                  )}
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Rating value={averageRating} readOnly precision={0.1} />
                    <Typography variant="body2" color="text.secondary">
                      {averageRating.toFixed(1)} ({reviews.length} reseñas)
                    </Typography>
                    {distance && (
                      <>
                        <Typography variant="body2" color="text.secondary">•</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {distance}
                        </Typography>
                      </>
                    )}
                  </Box>
                </Box>
                
                <Box>
                  <Tooltip title={isFavorite ? 'Remover de favoritos' : 'Agregar a favoritos'}>
                    <IconButton onClick={handleToggleFavorite} color={isFavorite ? 'error' : 'default'}>
                      {isFavorite ? <Favorite /> : <FavoriteBorder />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Compartir">
                    <IconButton onClick={handleShare}>
                      <Share />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              
              {store.content?.rendered && (
                <Typography
                  variant="body1"
                  dangerouslySetInnerHTML={{ __html: store.content.rendered }}
                  sx={{ mb: 2 }}
                />
              )}
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Información de Contacto
                  </Typography>
                  
                  <List dense>
                    {store.acf?.direccion && (
                      <ListItem>
                        <ListItemIcon>
                          <LocationOn color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Dirección"
                          secondary={store.acf.direccion}
                        />
                      </ListItem>
                    )}
                    
                    {store.acf?.telefono && (
                      <ListItem>
                        <ListItemIcon>
                          <Phone color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Teléfono"
                          secondary={store.acf.telefono}
                        />
                      </ListItem>
                    )}
                    
                    {store.acf?.email && (
                      <ListItem>
                        <ListItemIcon>
                          <Email color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Email"
                          secondary={store.acf.email}
                        />
                      </ListItem>
                    )}
                    
                    {store.acf?.horario && (
                      <ListItem>
                        <ListItemIcon>
                          <Schedule color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Horario"
                          secondary={store.acf.horario}
                        />
                      </ListItem>
                    )}
                    
                    {store.acf?.sitio_web && (
                      <ListItem>
                        <ListItemIcon>
                          <Language color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Sitio Web"
                          secondary={
                            <a href={store.acf.sitio_web} target="_blank" rel="noopener noreferrer">
                              {store.acf.sitio_web}
                            </a>
                          }
                        />
                      </ListItem>
                    )}
                  </List>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {store.acf?.latitud && store.acf?.longitud && (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<DirectionsCar />}
                        onClick={openInMaps}
                        fullWidth
                      >
                        Cómo llegar
                      </Button>
                    )}
                    
                    {store.acf?.whatsapp && (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<WhatsApp />}
                        onClick={openWhatsApp}
                        color="success"
                        fullWidth
                      >
                        WhatsApp
                      </Button>
                    )}
                  </Box>
                  
                  {/* Social Media Links */}
                  {(store.acf?.instagram || store.acf?.facebook) && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Redes Sociales
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {store.acf?.instagram && (
                          <IconButton
                            component="a"
                            href={store.acf.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            color="primary"
                          >
                            <Instagram />
                          </IconButton>
                        )}
                        {store.acf?.facebook && (
                          <IconButton
                            component="a"
                            href={store.acf.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            color="primary"
                          >
                            <Facebook />
                          </IconButton>
                        )}
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label={`Productos (${products.length})`} />
          <Tab label={`Reseñas (${reviews.length})`} />
        </Tabs>
      </Box>

      {/* Products Tab */}
      {tabValue === 0 && (
        <Box>
          {/* Search and Filters */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    placeholder="Buscar productos..."
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
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Categoría</InputLabel>
                    <Select
                      value={categoryFilter}
                      label="Categoría"
                      onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                      <MenuItem value="">Todas las categorías</MenuItem>
                      {categories.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Ordenar por</InputLabel>
                    <Select
                      value={sortBy}
                      label="Ordenar por"
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <MenuItem value="name">Nombre</MenuItem>
                      <MenuItem value="price_asc">Precio: Menor a Mayor</MenuItem>
                      <MenuItem value="price_desc">Precio: Mayor a Menor</MenuItem>
                      <MenuItem value="date">Más Recientes</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Products Grid */}
          {productsLoading ? (
            <Grid container spacing={3}>
              {[...Array(8)].map((_, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Skeleton variant="rectangular" height={300} />
                </Grid>
              ))}
            </Grid>
          ) : products.length > 0 ? (
            <Grid container spacing={3}>
              {products.map((product) => (
                <Grid item xs={12} sm={6} md={3} key={product.id}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Alert severity="info">
              No se encontraron productos en esta tienda.
            </Alert>
          )}
        </Box>
      )}

      {/* Reviews Tab */}
      {tabValue === 1 && (
        <Box>
          {/* Add Review */}
          {user && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Escribir una reseña
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography component="legend">Calificación</Typography>
                  <Rating
                    value={newReview.rating}
                    onChange={(e, newValue) => setNewReview({ ...newReview, rating: newValue })}
                  />
                </Box>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Comparte tu experiencia con esta tienda..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  onClick={handleSubmitReview}
                  disabled={!newReview.comment.trim()}
                >
                  Enviar Reseña
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Reviews List */}
          {reviews.length > 0 ? (
            <Box>
              {reviews.map((review) => (
                <Card key={review.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar>{review.user.charAt(0)}</Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1">
                          {review.user}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Rating value={review.rating} readOnly size="small" />
                          <Typography variant="body2" color="text.secondary">
                            {review.date}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Typography variant="body1">
                      {review.comment}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : (
            <Alert severity="info">
              Aún no hay reseñas para esta tienda. ¡Sé el primero en escribir una!
            </Alert>
          )}
        </Box>
      )}
    </Container>
  );
};

export default StoreDetail;