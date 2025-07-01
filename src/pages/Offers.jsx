import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Avatar,
  Badge,
  Skeleton,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  LinearProgress,
  Tooltip,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Breadcrumbs,
  Link,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Fab
} from '@mui/material';
import {
  LocalOffer,
  Search,
  FilterList,
  Sort,
  Share,
  Favorite,
  FavoriteBorder,
  ShoppingCart,
  Timer,
  Percent,
  AttachMoney,
  Store,
  Category,
  Home,
  TrendingUp,
  Flash,
  Star,
  AccessTime,
  CalendarToday,
  LocationOn,
  Notifications,
  NotificationsActive,
  Close,
  Info,
  ContentCopy,
  WhatsApp,
  Facebook,
  Twitter,
  Email,
  ExpandMore,
  Refresh,
  BookmarkBorder,
  Bookmark,
  Visibility,
  ThumbUp,
  Schedule,
  MonetizationOn,
  Discount,
  CardGiftcard,
  ShoppingBag,
  LocalShipping,
  VerifiedUser
} from '@mui/icons-material';
import { useStore } from '../store/useStore';
import { useProducts } from '../hooks/useProducts';
import { useNotification } from '../contexts/NotificationContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Offers = () => {
  const navigate = useNavigate();
  const { user, addToCart, addToFavorites, removeFromFavorites } = useStore();
  const { getProducts, loading } = useProducts();
  const { showNotification } = useNotification();
  
  const [offers, setOffers] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [discountFilter, setDiscountFilter] = useState('');
  const [storeFilter, setStoreFilter] = useState('');
  const [sortBy, setSortBy] = useState('discount');
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [showOfferDialog, setShowOfferDialog] = useState(false);
  const [favoriteOffers, setFavoriteOffers] = useState([]);
  const [savedOffers, setSavedOffers] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [notificationSettings, setNotificationSettings] = useState({
    flashDeals: true,
    priceDrops: true,
    newOffers: true,
    expiringSoon: true
  });

  const offerCategories = [
    { id: '', name: 'Todas las ofertas', icon: <LocalOffer /> },
    { id: 'electronics', name: 'Electrónicos', icon: <Category /> },
    { id: 'fashion', name: 'Moda y Ropa', icon: <Category /> },
    { id: 'home', name: 'Hogar y Jardín', icon: <Category /> },
    { id: 'sports', name: 'Deportes', icon: <Category /> },
    { id: 'books', name: 'Libros', icon: <Category /> },
    { id: 'beauty', name: 'Belleza', icon: <Category /> },
    { id: 'automotive', name: 'Automotriz', icon: <Category /> },
    { id: 'food', name: 'Alimentos', icon: <Category /> }
  ];

  const discountRanges = [
    { id: '', name: 'Todos los descuentos' },
    { id: '10-25', name: '10% - 25%' },
    { id: '25-50', name: '25% - 50%' },
    { id: '50-75', name: '50% - 75%' },
    { id: '75+', name: '75% o más' }
  ];

  const stores = [
    'Todas las tiendas', 'TechStore', 'FashionHub', 'HomeCenter', 
    'SportZone', 'BookWorld', 'BeautyPlus', 'AutoParts', 'FoodMart'
  ];

  const sortOptions = [
    { value: 'discount', label: 'Mayor Descuento' },
    { value: 'savings', label: 'Mayor Ahorro' },
    { value: 'expiry', label: 'Expira Pronto' },
    { value: 'newest', label: 'Más Recientes' },
    { value: 'popular', label: 'Más Populares' },
    { value: 'price', label: 'Menor Precio' }
  ];

  const tabLabels = [
    { label: 'Todas las Ofertas', icon: <LocalOffer /> },
    { label: 'Flash Deals', icon: <Flash /> },
    { label: 'Ofertas del Día', icon: <Star /> },
    { label: 'Guardadas', icon: <Bookmark /> },
    { label: 'Favoritas', icon: <Favorite /> }
  ];

  useEffect(() => {
    loadOffers();
    
    // Load saved data from localStorage
    const favorites = JSON.parse(localStorage.getItem('favoriteOffers') || '[]');
    const saved = JSON.parse(localStorage.getItem('savedOffers') || '[]');
    const notifications = JSON.parse(localStorage.getItem('offerNotifications') || JSON.stringify(notificationSettings));
    
    setFavoriteOffers(favorites);
    setSavedOffers(saved);
    setNotificationSettings(notifications);
  }, []);

  useEffect(() => {
    filterAndSortOffers();
  }, [offers, searchQuery, categoryFilter, discountFilter, storeFilter, sortBy, activeTab]);

  const loadOffers = async () => {
    try {
      // Mock offers data
      const mockOffers = Array.from({ length: 30 }, (_, index) => {
        const originalPrice = Math.floor(Math.random() * 500) + 50;
        const discountPercent = Math.floor(Math.random() * 70) + 10;
        const discountedPrice = originalPrice * (1 - discountPercent / 100);
        const savings = originalPrice - discountedPrice;
        
        return {
          id: `offer-${index + 1}`,
          title: `Oferta Especial ${index + 1}`,
          description: `Descripción detallada de la oferta ${index + 1}. Aprovecha este increíble descuento por tiempo limitado.`,
          image: '/api/placeholder/300/200',
          originalPrice: originalPrice,
          discountedPrice: discountedPrice.toFixed(2),
          discountPercent: discountPercent,
          savings: savings.toFixed(2),
          category: offerCategories[Math.floor(Math.random() * (offerCategories.length - 1)) + 1].id,
          store: stores[Math.floor(Math.random() * (stores.length - 1)) + 1],
          storeId: `store-${Math.floor(Math.random() * 10) + 1}`,
          storeLogo: '/api/placeholder/50/50',
          expiryDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
          startDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
          isFlashDeal: Math.random() > 0.7,
          isDealOfDay: Math.random() > 0.8,
          isLimitedStock: Math.random() > 0.6,
          stockLeft: Math.floor(Math.random() * 50) + 5,
          totalStock: 100,
          views: Math.floor(Math.random() * 1000) + 100,
          likes: Math.floor(Math.random() * 200) + 20,
          claimed: Math.floor(Math.random() * 50) + 10,
          rating: (Math.random() * 2 + 3).toFixed(1),
          reviews: Math.floor(Math.random() * 100) + 10,
          freeShipping: Math.random() > 0.5,
          verified: Math.random() > 0.3,
          exclusive: Math.random() > 0.8,
          couponCode: Math.random() > 0.5 ? `SAVE${discountPercent}` : null,
          minPurchase: Math.random() > 0.7 ? Math.floor(Math.random() * 100) + 50 : null,
          maxDiscount: Math.random() > 0.6 ? Math.floor(Math.random() * 100) + 50 : null,
          termsAndConditions: [
            'Válido hasta agotar existencias',
            'No acumulable con otras ofertas',
            'Aplica solo para productos seleccionados'
          ],
          tags: ['Descuento', 'Oferta Especial', 'Tiempo Limitado'].filter(() => Math.random() > 0.5)
        };
      });
      
      setOffers(mockOffers);
    } catch (error) {
      showNotification('Error al cargar ofertas', 'error');
    }
  };

  const filterAndSortOffers = () => {
    let filtered = [...offers];
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(offer => 
        offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offer.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offer.store.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by category
    if (categoryFilter) {
      filtered = filtered.filter(offer => offer.category === categoryFilter);
    }
    
    // Filter by discount range
    if (discountFilter) {
      const [min, max] = discountFilter.split('-').map(Number);
      if (max) {
        filtered = filtered.filter(offer => offer.discountPercent >= min && offer.discountPercent <= max);
      } else {
        filtered = filtered.filter(offer => offer.discountPercent >= min);
      }
    }
    
    // Filter by store
    if (storeFilter && storeFilter !== 'Todas las tiendas') {
      filtered = filtered.filter(offer => offer.store === storeFilter);
    }
    
    // Filter by tab
    switch (activeTab) {
      case 1: // Flash Deals
        filtered = filtered.filter(offer => offer.isFlashDeal);
        break;
      case 2: // Deal of Day
        filtered = filtered.filter(offer => offer.isDealOfDay);
        break;
      case 3: // Saved
        filtered = filtered.filter(offer => savedOffers.includes(offer.id));
        break;
      case 4: // Favorites
        filtered = filtered.filter(offer => favoriteOffers.includes(offer.id));
        break;
      default:
        break;
    }
    
    // Sort offers
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'discount':
          return b.discountPercent - a.discountPercent;
        case 'savings':
          return b.savings - a.savings;
        case 'expiry':
          return new Date(a.expiryDate) - new Date(b.expiryDate);
        case 'newest':
          return new Date(b.startDate) - new Date(a.startDate);
        case 'popular':
          return b.views - a.views;
        case 'price':
          return a.discountedPrice - b.discountedPrice;
        default:
          return 0;
      }
    });
    
    setFilteredOffers(filtered);
  };

  const handleToggleFavorite = (offerId) => {
    const newFavorites = favoriteOffers.includes(offerId)
      ? favoriteOffers.filter(id => id !== offerId)
      : [...favoriteOffers, offerId];
    
    setFavoriteOffers(newFavorites);
    localStorage.setItem('favoriteOffers', JSON.stringify(newFavorites));
    
    showNotification(
      favoriteOffers.includes(offerId) ? 'Oferta eliminada de favoritos' : 'Oferta agregada a favoritos',
      'success'
    );
  };

  const handleToggleSaved = (offerId) => {
    const newSaved = savedOffers.includes(offerId)
      ? savedOffers.filter(id => id !== offerId)
      : [...savedOffers, offerId];
    
    setSavedOffers(newSaved);
    localStorage.setItem('savedOffers', JSON.stringify(newSaved));
    
    showNotification(
      savedOffers.includes(offerId) ? 'Oferta eliminada de guardados' : 'Oferta guardada',
      'success'
    );
  };

  const handleViewOffer = (offer) => {
    setSelectedOffer(offer);
    setShowOfferDialog(true);
  };

  const handleShareOffer = (offer) => {
    const shareData = {
      title: offer.title,
      text: `¡Mira esta increíble oferta! ${offer.discountPercent}% de descuento`,
      url: `${window.location.origin}/offer/${offer.id}`
    };
    
    if (navigator.share) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(shareData.url);
      showNotification('Enlace copiado al portapapeles', 'success');
    }
  };

  const getTimeRemaining = (expiryDate) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diff = expiry - now;
    
    if (diff <= 0) return 'Expirada';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getStockProgress = (stockLeft, totalStock) => {
    return ((totalStock - stockLeft) / totalStock) * 100;
  };

  const OfferCard = ({ offer }) => {
    const isFavorite = favoriteOffers.includes(offer.id);
    const isSaved = savedOffers.includes(offer.id);
    const timeRemaining = getTimeRemaining(offer.expiryDate);
    const stockProgress = getStockProgress(offer.stockLeft, offer.totalStock);
    
    return (
      <Card 
        sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          position: 'relative',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 6
          }
        }}
        onClick={() => handleViewOffer(offer)}
      >
        {/* Badges */}
        <Box sx={{ position: 'absolute', top: 8, left: 8, zIndex: 2 }}>
          {offer.isFlashDeal && (
            <Chip
              label="Flash Deal"
              size="small"
              sx={{ bgcolor: 'error.main', color: 'white', mb: 0.5, display: 'block' }}
              icon={<Flash sx={{ color: 'white !important' }} />}
            />
          )}
          {offer.isDealOfDay && (
            <Chip
              label="Oferta del Día"
              size="small"
              sx={{ bgcolor: 'warning.main', color: 'white', mb: 0.5, display: 'block' }}
              icon={<Star sx={{ color: 'white !important' }} />}
            />
          )}
          {offer.exclusive && (
            <Chip
              label="Exclusiva"
              size="small"
              sx={{ bgcolor: 'purple', color: 'white', display: 'block' }}
            />
          )}
        </Box>
        
        {/* Action Buttons */}
        <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 2 }}>
          <IconButton
            size="small"
            sx={{ bgcolor: 'rgba(255,255,255,0.9)', mb: 0.5, display: 'block' }}
            onClick={(e) => {
              e.stopPropagation();
              handleToggleFavorite(offer.id);
            }}
          >
            {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
          </IconButton>
          <IconButton
            size="small"
            sx={{ bgcolor: 'rgba(255,255,255,0.9)', mb: 0.5, display: 'block' }}
            onClick={(e) => {
              e.stopPropagation();
              handleToggleSaved(offer.id);
            }}
          >
            {isSaved ? <Bookmark color="primary" /> : <BookmarkBorder />}
          </IconButton>
          <IconButton
            size="small"
            sx={{ bgcolor: 'rgba(255,255,255,0.9)', display: 'block' }}
            onClick={(e) => {
              e.stopPropagation();
              handleShareOffer(offer);
            }}
          >
            <Share />
          </IconButton>
        </Box>
        
        {/* Discount Badge */}
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 0, 
            right: 0, 
            bgcolor: 'success.main', 
            color: 'white',
            px: 2,
            py: 1,
            borderBottomLeftRadius: 16,
            zIndex: 1
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            -{offer.discountPercent}%
          </Typography>
        </Box>
        
        {/* Image */}
        <CardMedia
          component="img"
          height={200}
          image={offer.image}
          alt={offer.title}
          sx={{ objectFit: 'cover' }}
        />
        
        <CardContent sx={{ flexGrow: 1, p: 2 }}>
          {/* Store Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar src={offer.storeLogo} sx={{ width: 24, height: 24, mr: 1 }}>
              <Store />
            </Avatar>
            <Typography variant="body2" color="text.secondary">
              {offer.store}
            </Typography>
            {offer.verified && (
              <VerifiedUser sx={{ fontSize: 16, color: 'primary.main', ml: 0.5 }} />
            )}
          </Box>
          
          {/* Title */}
          <Typography variant="h6" gutterBottom noWrap>
            {offer.title}
          </Typography>
          
          {/* Description */}
          <Typography variant="body2" color="text.secondary" paragraph>
            {offer.description.substring(0, 100)}...
          </Typography>
          
          {/* Pricing */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography 
                variant="h5" 
                color="primary" 
                fontWeight="bold"
                sx={{ mr: 1 }}
              >
                ${offer.discountedPrice}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
              >
                ${offer.originalPrice}
              </Typography>
            </Box>
            <Typography variant="body2" color="success.main" fontWeight="bold">
              Ahorras ${offer.savings}
            </Typography>
          </Box>
          
          {/* Time Remaining */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Timer sx={{ fontSize: 16, color: 'warning.main', mr: 0.5 }} />
            <Typography 
              variant="body2" 
              color={timeRemaining === 'Expirada' ? 'error.main' : 'warning.main'}
              fontWeight="bold"
            >
              {timeRemaining === 'Expirada' ? 'Oferta Expirada' : `Termina en ${timeRemaining}`}
            </Typography>
          </Box>
          
          {/* Stock Progress */}
          {offer.isLimitedStock && (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">Stock disponible</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {offer.stockLeft} restantes
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={stockProgress}
                sx={{ height: 6, borderRadius: 3 }}
                color={stockProgress > 80 ? 'error' : stockProgress > 50 ? 'warning' : 'success'}
              />
            </Box>
          )}
          
          {/* Features */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
            {offer.freeShipping && (
              <Chip label="Envío Gratis" size="small" color="success" />
            )}
            {offer.couponCode && (
              <Chip label={`Código: ${offer.couponCode}`} size="small" color="info" />
            )}
          </Box>
          
          {/* Stats */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Visibility sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {offer.views}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ThumbUp sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {offer.likes}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ShoppingCart sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {offer.claimed}
              </Typography>
            </Box>
          </Box>
          
          {/* Action Button */}
          <Button
            variant="contained"
            fullWidth
            startIcon={<LocalOffer />}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/product/${offer.id}`);
            }}
            disabled={timeRemaining === 'Expirada'}
          >
            {timeRemaining === 'Expirada' ? 'Oferta Expirada' : 'Ver Oferta'}
          </Button>
        </CardContent>
      </Card>
    );
  };

  const OfferDialog = () => (
    <Dialog 
      open={showOfferDialog} 
      onClose={() => setShowOfferDialog(false)}
      maxWidth="md"
      fullWidth
    >
      {selectedOffer && (
        <>
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h5">{selectedOffer.title}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Avatar src={selectedOffer.storeLogo} sx={{ width: 32, height: 32, mr: 1 }}>
                    <Store />
                  </Avatar>
                  <Typography variant="body1">{selectedOffer.store}</Typography>
                  {selectedOffer.verified && (
                    <VerifiedUser sx={{ color: 'primary.main', ml: 1 }} />
                  )}
                </Box>
              </Box>
              <IconButton onClick={() => setShowOfferDialog(false)}>
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <img 
                  src={selectedOffer.image} 
                  alt={selectedOffer.title}
                  style={{ width: '100%', borderRadius: 8, marginBottom: 16 }}
                />
                
                {/* Pricing */}
                <Paper sx={{ p: 2, mb: 2, bgcolor: 'success.50' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h4" color="primary" fontWeight="bold" sx={{ mr: 2 }}>
                      ${selectedOffer.discountedPrice}
                    </Typography>
                    <Typography 
                      variant="h6" 
                      sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                    >
                      ${selectedOffer.originalPrice}
                    </Typography>
                  </Box>
                  <Typography variant="h6" color="success.main" fontWeight="bold">
                    Ahorras ${selectedOffer.savings} ({selectedOffer.discountPercent}% descuento)
                  </Typography>
                </Paper>
                
                {/* Coupon Code */}
                {selectedOffer.couponCode && (
                  <Paper sx={{ p: 2, mb: 2, bgcolor: 'info.50', border: '2px dashed', borderColor: 'info.main' }}>
                    <Typography variant="h6" gutterBottom>Código de Descuento</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="h5" fontWeight="bold" sx={{ mr: 2 }}>
                        {selectedOffer.couponCode}
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<ContentCopy />}
                        onClick={() => {
                          navigator.clipboard.writeText(selectedOffer.couponCode);
                          showNotification('Código copiado al portapapeles', 'success');
                        }}
                      >
                        Copiar
                      </Button>
                    </Box>
                  </Paper>
                )}
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="body1" paragraph>
                  {selectedOffer.description}
                </Typography>
                
                {/* Offer Details */}
                <List>
                  <ListItem>
                    <ListItemIcon><Timer /></ListItemIcon>
                    <ListItemText 
                      primary="Tiempo restante" 
                      secondary={getTimeRemaining(selectedOffer.expiryDate)}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Category /></ListItemIcon>
                    <ListItemText 
                      primary="Categoría" 
                      secondary={offerCategories.find(cat => cat.id === selectedOffer.category)?.name}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Visibility /></ListItemIcon>
                    <ListItemText 
                      primary="Visualizaciones" 
                      secondary={`${selectedOffer.views} personas han visto esta oferta`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><ShoppingCart /></ListItemIcon>
                    <ListItemText 
                      primary="Reclamadas" 
                      secondary={`${selectedOffer.claimed} personas han aprovechado esta oferta`}
                    />
                  </ListItem>
                  {selectedOffer.isLimitedStock && (
                    <ListItem>
                      <ListItemIcon><Schedule /></ListItemIcon>
                      <ListItemText 
                        primary="Stock limitado" 
                        secondary={`Solo quedan ${selectedOffer.stockLeft} unidades`}
                      />
                    </ListItem>
                  )}
                </List>
                
                {/* Terms and Conditions */}
                <Accordion sx={{ mt: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h6">Términos y Condiciones</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List>
                      {selectedOffer.termsAndConditions.map((term, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={term} />
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowOfferDialog(false)}>Cerrar</Button>
            <Button 
              variant="outlined" 
              startIcon={<Share />}
              onClick={() => handleShareOffer(selectedOffer)}
            >
              Compartir
            </Button>
            <Button 
              variant="outlined" 
              startIcon={savedOffers.includes(selectedOffer.id) ? <Bookmark /> : <BookmarkBorder />}
              onClick={() => handleToggleSaved(selectedOffer.id)}
            >
              {savedOffers.includes(selectedOffer.id) ? 'Guardada' : 'Guardar'}
            </Button>
            <Button 
              variant="contained" 
              startIcon={<LocalOffer />}
              onClick={() => {
                navigate(`/product/${selectedOffer.id}`);
                setShowOfferDialog(false);
              }}
            >
              Ver Producto
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {[...Array(8)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Skeleton variant="text" height={24} />
                  <Skeleton variant="text" height={20} />
                  <Skeleton variant="text" height={20} width="60%" />
                  <Box sx={{ mt: 2 }}>
                    <Skeleton variant="text" height={32} width="40%" />
                    <Skeleton variant="text" height={20} width="30%" />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

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
        <Typography color="text.primary">Ofertas y Promociones</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Paper elevation={2} sx={{ p: 4, mb: 4, textAlign: 'center' }}>
        <LocalOffer sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h3" gutterBottom>
          Ofertas y Promociones
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Descubre las mejores ofertas y descuentos exclusivos
        </Typography>
        
        {/* Quick Stats */}
        <Grid container spacing={2} sx={{ mt: 3 }}>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">{offers.length}</Typography>
              <Typography variant="body2">Ofertas Activas</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="error.main">
                {offers.filter(o => o.isFlashDeal).length}
              </Typography>
              <Typography variant="body2">Flash Deals</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                {favoriteOffers.length}
              </Typography>
              <Typography variant="body2">Favoritas</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {Math.max(...offers.map(o => o.discountPercent))}%
              </Typography>
              <Typography variant="body2">Máximo Descuento</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Search and Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              placeholder="Buscar ofertas..."
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
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Categoría</InputLabel>
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                label="Categoría"
              >
                {offerCategories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Descuento</InputLabel>
              <Select
                value={discountFilter}
                onChange={(e) => setDiscountFilter(e.target.value)}
                label="Descuento"
              >
                {discountRanges.map((range) => (
                  <MenuItem key={range.id} value={range.id}>
                    {range.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Tienda</InputLabel>
              <Select
                value={storeFilter}
                onChange={(e) => setStoreFilter(e.target.value)}
                label="Tienda"
              >
                {stores.map((store) => (
                  <MenuItem key={store} value={store}>
                    {store}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Ordenar por</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                label="Ordenar por"
              >
                {sortOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={1}>
            <IconButton 
              onClick={loadOffers}
              color="primary"
              sx={{ width: '100%' }}
            >
              <Refresh />
            </IconButton>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabLabels.map((tab, index) => (
            <Tab 
              key={index}
              label={tab.label} 
              icon={tab.icon}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Paper>

      {/* Results */}
      <Typography variant="h6" gutterBottom>
        {filteredOffers.length} ofertas encontradas
      </Typography>

      {/* Offers Grid */}
      {filteredOffers.length > 0 ? (
        <Grid container spacing={3}>
          {filteredOffers.map((offer) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={offer.id}>
              <OfferCard offer={offer} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <LocalOffer sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No se encontraron ofertas
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Intenta ajustar tus filtros de búsqueda
          </Typography>
        </Paper>
      )}

      {/* Offer Detail Dialog */}
      <OfferDialog />

      {/* Floating Action Button for Notifications */}
      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 80, right: 16 }}
        onClick={() => showNotification('Configuración de notificaciones próximamente', 'info')}
      >
        <Badge badgeContent={3} color="error">
          <NotificationsActive />
        </Badge>
      </Fab>
    </Container>
  );
};

export default Offers;