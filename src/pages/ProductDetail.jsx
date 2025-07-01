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
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Rating
} from '@mui/material';
import {
  ArrowBack,
  Favorite,
  FavoriteBorder,
  Share,
  ShoppingCart,
  Store,
  LocationOn,
  Phone,
  Schedule,
  CompareArrows,
  Add,
  Remove
} from '@mui/icons-material';
import { useProducts, useStores } from '../hooks/useWordPressAPI';
import { useStore } from '../store/useStore';
import { useNotification } from '../contexts/NotificationContext';
import ProductCard from '../components/products/ProductCard';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { convertPrice, addToShoppingList, user } = useStore();
  const [product, setProduct] = useState(null);
  const [store, setStore] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [compareDialogOpen, setCompareDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const { getProduct } = useProducts();
  const { getStore } = useStores();

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const productData = await getProduct(id);
        setProduct(productData);

        if (productData.acf?.tienda_id) {
          const storeData = await getStore(productData.acf.tienda_id);
          setStore(storeData);
        }

        // Fetch related products
        if (productData.acf?.categoria) {
          const { searchProducts } = useProducts();
          const related = await searchProducts({
            categoria: productData.acf.categoria,
            exclude: id,
            per_page: 4
          });
          setRelatedProducts(related.products || []);
        }

        // Check if product is in favorites
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setIsFavorite(favorites.includes(parseInt(id)));

      } catch (err) {
        setError('Error al cargar el producto');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductData();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      showNotification('Debes iniciar sesión para agregar productos', 'warning');
      navigate('/login');
      return;
    }

    const item = {
      id: product.id,
      name: product.title.rendered,
      price: product.acf?.precio_bs || 0,
      priceUsd: product.acf?.precio_usd || 0,
      quantity,
      image: product.acf?.imagenes?.[0] || '/placeholder.png',
      store: store?.title?.rendered || 'Tienda no especificada'
    };

    addToShoppingList(item);
    showNotification(`${quantity} ${product.title.rendered} agregado(s) al carrito`, 'success');
  };

  const handleToggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const productId = parseInt(id);
    
    if (isFavorite) {
      const newFavorites = favorites.filter(fav => fav !== productId);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      setIsFavorite(false);
      showNotification('Producto removido de favoritos', 'info');
    } else {
      favorites.push(productId);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      setIsFavorite(true);
      showNotification('Producto agregado a favoritos', 'success');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title.rendered,
          text: `Mira este producto en AhorraYa VZ: ${product.title.rendered}`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      setShareDialogOpen(true);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showNotification('Enlace copiado al portapapeles', 'success');
    setShareDialogOpen(false);
  };

  const formatPrice = (price, currency = 'bs') => {
    if (!price) return 'Precio no disponible';
    
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

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" height={400} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="text" height={60} />
            <Skeleton variant="text" height={40} width="60%" />
            <Skeleton variant="rectangular" height={100} sx={{ my: 2 }} />
            <Skeleton variant="rectangular" height={50} width="40%" />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Producto no encontrado'}
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

  const images = product.acf?.imagenes || ['/placeholder.png'];
  const currentPrice = product.acf?.precio_bs || 0;
  const currentPriceUsd = product.acf?.precio_usd || convertPrice(currentPrice, 'usd');

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

      <Grid container spacing={4}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              height="400"
              image={images[selectedImage]}
              alt={product.title.rendered}
              sx={{ objectFit: 'cover' }}
            />
            {images.length > 1 && (
              <Box sx={{ p: 2, display: 'flex', gap: 1, overflowX: 'auto' }}>
                {images.map((image, index) => (
                  <Box
                    key={index}
                    component="img"
                    src={image}
                    alt={`${product.title.rendered} ${index + 1}`}
                    sx={{
                      width: 60,
                      height: 60,
                      objectFit: 'cover',
                      borderRadius: 1,
                      cursor: 'pointer',
                      border: selectedImage === index ? '2px solid primary.main' : '1px solid grey.300',
                      '&:hover': { opacity: 0.8 }
                    }}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </Box>
            )}
          </Card>
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Box sx={{ position: 'sticky', top: 20 }}>
            {/* Title and Actions */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography variant="h4" component="h1" sx={{ flex: 1, mr: 2 }}>
                {product.title.rendered}
              </Typography>
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

            {/* Category */}
            {product.acf?.categoria && (
              <Chip
                label={product.acf.categoria}
                color="primary"
                variant="outlined"
                sx={{ mb: 2 }}
              />
            )}

            {/* Prices */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                {formatPrice(currentPrice, 'bs')}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {formatPrice(currentPriceUsd, 'usd')}
              </Typography>
            </Box>

            {/* Description */}
            {product.content?.rendered && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Descripción
                </Typography>
                <Typography
                  variant="body1"
                  dangerouslySetInnerHTML={{ __html: product.content.rendered }}
                />
              </Box>
            )}

            {/* Specifications */}
            {product.acf?.especificaciones && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Especificaciones
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.acf.especificaciones}
                </Typography>
              </Box>
            )}

            <Divider sx={{ my: 3 }} />

            {/* Quantity Selector */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Typography variant="body1">Cantidad:</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid', borderColor: 'grey.300', borderRadius: 1 }}>
                <IconButton
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Remove />
                </IconButton>
                <Typography sx={{ px: 2, minWidth: 40, textAlign: 'center' }}>
                  {quantity}
                </Typography>
                <IconButton onClick={() => setQuantity(quantity + 1)}>
                  <Add />
                </IconButton>
              </Box>
            </Box>

            {/* Add to Cart Button */}
            <Button
              variant="contained"
              size="large"
              startIcon={<ShoppingCart />}
              onClick={handleAddToCart}
              fullWidth
              sx={{ mb: 2 }}
            >
              Agregar al Carrito
            </Button>

            {/* Store Info */}
            {store && (
              <Card variant="outlined" sx={{ mt: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Store color="primary" />
                    <Typography variant="h6">
                      {store.title.rendered}
                    </Typography>
                  </Box>
                  
                  {store.acf?.direccion && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <LocationOn fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {store.acf.direccion}
                      </Typography>
                    </Box>
                  )}
                  
                  {store.acf?.telefono && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Phone fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {store.acf.telefono}
                      </Typography>
                    </Box>
                  )}
                  
                  {store.acf?.horario && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Schedule fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {store.acf.horario}
                      </Typography>
                    </Box>
                  )}
                  
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate(`/tienda/${store.id}`)}
                    fullWidth
                  >
                    Ver Tienda
                  </Button>
                </CardContent>
              </Card>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" gutterBottom>
            Productos Relacionados
          </Typography>
          <Grid container spacing={3}>
            {relatedProducts.map((relatedProduct) => (
              <Grid item xs={12} sm={6} md={3} key={relatedProduct.id}>
                <ProductCard product={relatedProduct} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onClose={() => setShareDialogOpen(false)}>
        <DialogTitle>Compartir Producto</DialogTitle>
        <DialogContent>
          <Typography variant="body2" gutterBottom>
            Copia el enlace para compartir este producto:
          </Typography>
          <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1, mt: 2 }}>
            <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
              {window.location.href}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareDialogOpen(false)}>Cancelar</Button>
          <Button onClick={() => copyToClipboard(window.location.href)} variant="contained">
            Copiar Enlace
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Compare Button */}
      <Fab
        color="secondary"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setCompareDialogOpen(true)}
      >
        <CompareArrows />
      </Fab>
    </Container>
  );
};

export default ProductDetail;