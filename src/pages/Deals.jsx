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
  Tabs,
  Tab,
  Badge,
  Avatar,
  LinearProgress,
  Countdown,
  Alert,
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
  Tooltip,
  Fab,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon
} from '@mui/material';
import {
  LocalOffer,
  Whatshot,
  Schedule,
  Star,
  Favorite,
  FavoriteBorder,
  Share,
  ShoppingCart,
  Compare,
  Visibility,
  TrendingUp,
  FlashOn,
  AccessTime,
  LocalShipping,
  Verified,
  Store,
  Category,
  FilterList,
  Sort,
  Refresh,
  NotificationsActive,
  BookmarkBorder,
  Bookmark,
  Info,
  Timer,
  Percent,
  AttachMoney,
  ShoppingBag,
  NewReleases,
  EmojiEvents,
  LocalFireDepartment
} from '@mui/icons-material';
import { useStore } from '../store/useStore';
import { useProducts } from '../hooks/useProducts';
import { useNotification } from '../contexts/NotificationContext';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Deals = () => {
  const navigate = useNavigate();
  const { exchangeRate, user, addToFavorites, removeFromFavorites, addToShoppingList } = useStore();
  const { searchProducts, loading } = useProducts();
  const { showNotification } = useNotification();
  
  const [activeTab, setActiveTab] = useState(0);
  const [deals, setDeals] = useState([]);
  const [flashDeals, setFlashDeals] = useState([]);
  const [featuredDeals, setFeaturedDeals] = useState([]);
  const [sortBy, setSortBy] = useState('discount');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [showDealDialog, setShowDealDialog] = useState(false);
  const [savedDeals, setSavedDeals] = useState([]);
  const [notifications, setNotifications] = useState(true);

  const dealCategories = [
    { id: '', name: 'Todas las ofertas', icon: <LocalOffer /> },
    { id: 'electronics', name: 'Electrónicos', icon: <Category /> },
    { id: 'fashion', name: 'Moda', icon: <Category /> },
    { id: 'home', name: 'Hogar', icon: <Category /> },
    { id: 'sports', name: 'Deportes', icon: <Category /> },
    { id: 'books', name: 'Libros', icon: <Category /> }
  ];

  const sortOptions = [
    { value: 'discount', label: 'Mayor Descuento' },
    { value: 'price_asc', label: 'Precio: Menor a Mayor' },
    { value: 'price_desc', label: 'Precio: Mayor a Menor' },
    { value: 'ending_soon', label: 'Terminan Pronto' },
    { value: 'newest', label: 'Más Recientes' },
    { value: 'popularity', label: 'Más Populares' }
  ];

  const tabLabels = [
    { label: 'Ofertas del Día', icon: <Whatshot /> },
    { label: 'Ofertas Flash', icon: <FlashOn /> },
    { label: 'Destacadas', icon: <EmojiEvents /> },
    { label: 'Mis Ofertas', icon: <Bookmark /> }
  ];

  useEffect(() => {
    loadDeals();
    loadFlashDeals();
    loadFeaturedDeals();
    
    // Load saved deals from localStorage
    const saved = JSON.parse(localStorage.getItem('savedDeals') || '[]');
    setSavedDeals(saved);
  }, []);

  useEffect(() => {
    filterAndSortDeals();
  }, [sortBy, categoryFilter, activeTab]);

  const loadDeals = async () => {
    try {
      // Mock deals data
      const mockDeals = Array.from({ length: 20 }, (_, index) => ({
        id: `deal-${index + 1}`,
        name: `Oferta Especial ${index + 1}`,
        originalPrice: Math.floor(Math.random() * 500000) + 100000,
        salePrice: Math.floor(Math.random() * 300000) + 50000,
        discount: Math.floor(Math.random() * 70) + 10,
        image: '/api/placeholder/300/300',
        rating: (Math.random() * 2 + 3).toFixed(1),
        reviews: Math.floor(Math.random() * 500) + 10,
        store: `Tienda ${Math.floor(Math.random() * 5) + 1}`,
        category: dealCategories[Math.floor(Math.random() * (dealCategories.length - 1)) + 1].id,
        endTime: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000),
        stock: Math.floor(Math.random() * 50) + 5,
        sold: Math.floor(Math.random() * 100) + 10,
        isFlash: Math.random() > 0.7,
        isFeatured: Math.random() > 0.8,
        freeShipping: Math.random() > 0.5,
        verified: Math.random() > 0.6,
        tags: ['Oferta Limitada', 'Envío Gratis', 'Mejor Precio'].filter(() => Math.random() > 0.5)
      }));
      
      setDeals(mockDeals);
    } catch (error) {
      showNotification('Error al cargar ofertas', 'error');
    }
  };

  const loadFlashDeals = () => {
    const flashDealsData = deals.filter(deal => deal.isFlash).slice(0, 8);
    setFlashDeals(flashDealsData);
  };

  const loadFeaturedDeals = () => {
    const featuredDealsData = deals.filter(deal => deal.isFeatured).slice(0, 6);
    setFeaturedDeals(featuredDealsData);
  };

  const filterAndSortDeals = () => {
    let filteredDeals = [...deals];
    
    // Filter by category
    if (categoryFilter) {
      filteredDeals = filteredDeals.filter(deal => deal.category === categoryFilter);
    }
    
    // Filter by tab
    switch (activeTab) {
      case 1: // Flash Deals
        filteredDeals = filteredDeals.filter(deal => deal.isFlash);
        break;
      case 2: // Featured
        filteredDeals = filteredDeals.filter(deal => deal.isFeatured);
        break;
      case 3: // Saved
        filteredDeals = filteredDeals.filter(deal => savedDeals.includes(deal.id));
        break;
      default:
        break;
    }
    
    // Sort deals
    filteredDeals.sort((a, b) => {
      switch (sortBy) {
        case 'discount':
          return b.discount - a.discount;
        case 'price_asc':
          return a.salePrice - b.salePrice;
        case 'price_desc':
          return b.salePrice - a.salePrice;
        case 'ending_soon':
          return new Date(a.endTime) - new Date(b.endTime);
        case 'newest':
          return b.id.localeCompare(a.id);
        case 'popularity':
          return b.sold - a.sold;
        default:
          return 0;
      }
    });
    
    setDeals(filteredDeals);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: 'VES'
    }).format(price);
  };

  const formatTimeRemaining = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;
    
    if (diff <= 0) return 'Expirada';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const handleSaveDeal = (dealId) => {
    const newSavedDeals = savedDeals.includes(dealId)
      ? savedDeals.filter(id => id !== dealId)
      : [...savedDeals, dealId];
    
    setSavedDeals(newSavedDeals);
    localStorage.setItem('savedDeals', JSON.stringify(newSavedDeals));
    
    showNotification(
      savedDeals.includes(dealId) ? 'Oferta eliminada de guardados' : 'Oferta guardada',
      'success'
    );
  };

  const handleViewDeal = (deal) => {
    setSelectedDeal(deal);
    setShowDealDialog(true);
  };

  const DealCard = ({ deal, size = 'normal' }) => {
    const isExpired = new Date(deal.endTime) <= new Date();
    const stockPercentage = (deal.sold / (deal.sold + deal.stock)) * 100;
    
    return (
      <Card 
        sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 6
          },
          opacity: isExpired ? 0.6 : 1
        }}
        onClick={() => handleViewDeal(deal)}
      >
        {/* Discount Badge */}
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            zIndex: 2,
            bgcolor: 'error.main',
            color: 'white',
            px: 1,
            py: 0.5,
            borderRadius: 1,
            fontWeight: 'bold',
            fontSize: '0.8rem'
          }}
        >
          -{deal.discount}%
        </Box>
        
        {/* Save Button */}
        <IconButton
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 2,
            bgcolor: 'rgba(255,255,255,0.9)',
            '&:hover': { bgcolor: 'rgba(255,255,255,1)' }
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleSaveDeal(deal.id);
          }}
        >
          {savedDeals.includes(deal.id) ? <Bookmark color="primary" /> : <BookmarkBorder />}
        </IconButton>
        
        <CardMedia
          component="img"
          height={size === 'small' ? 120 : 200}
          image={deal.image}
          alt={deal.name}
        />
        
        <CardContent sx={{ flexGrow: 1, p: 2 }}>
          <Typography variant={size === 'small' ? 'body2' : 'h6'} gutterBottom noWrap>
            {deal.name}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Star sx={{ color: '#ffc107', fontSize: 16, mr: 0.5 }} />
            <Typography variant="body2" color="text.secondary">
              {deal.rating} ({deal.reviews})
            </Typography>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography 
              variant="h6" 
              color="primary" 
              sx={{ fontWeight: 'bold' }}
            >
              {formatPrice(deal.salePrice)}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ textDecoration: 'line-through' }}
            >
              {formatPrice(deal.originalPrice)}
            </Typography>
          </Box>
          
          {/* Time Remaining */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Timer sx={{ fontSize: 16, mr: 0.5, color: 'warning.main' }} />
            <Typography variant="body2" color="warning.main">
              {formatTimeRemaining(deal.endTime)}
            </Typography>
          </Box>
          
          {/* Stock Progress */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption">Vendidos: {deal.sold}</Typography>
              <Typography variant="caption">Stock: {deal.stock}</Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={stockPercentage} 
              sx={{ height: 6, borderRadius: 3 }}
            />
          </Box>
          
          {/* Tags */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
            {deal.freeShipping && (
              <Chip label="Envío Gratis" size="small" color="success" />
            )}
            {deal.verified && (
              <Chip label="Verificado" size="small" color="info" />
            )}
            {deal.isFlash && (
              <Chip label="Flash" size="small" color="warning" />
            )}
          </Box>
          
          {/* Actions */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<ShoppingCart />}
              onClick={(e) => {
                e.stopPropagation();
                addToShoppingList(deal);
                showNotification('Producto agregado a la lista', 'success');
              }}
              disabled={isExpired}
            >
              {isExpired ? 'Expirada' : 'Agregar'}
            </Button>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/product/${deal.id}`);
              }}
            >
              <Visibility />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const DealDialog = () => (
    <Dialog 
      open={showDealDialog} 
      onClose={() => setShowDealDialog(false)}
      maxWidth="md"
      fullWidth
    >
      {selectedDeal && (
        <>
          <DialogTitle>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">{selectedDeal.name}</Typography>
              <Chip 
                label={`-${selectedDeal.discount}%`} 
                color="error" 
                sx={{ fontWeight: 'bold' }}
              />
            </Box>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <img 
                  src={selectedDeal.image} 
                  alt={selectedDeal.name}
                  style={{ width: '100%', borderRadius: 8 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                    {formatPrice(selectedDeal.salePrice)}
                  </Typography>
                  <Typography 
                    variant="h6" 
                    color="text.secondary"
                    sx={{ textDecoration: 'line-through' }}
                  >
                    {formatPrice(selectedDeal.originalPrice)}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Star sx={{ color: '#ffc107', mr: 0.5 }} />
                  <Typography variant="body1">
                    {selectedDeal.rating} ({selectedDeal.reviews} reseñas)
                  </Typography>
                </Box>
                
                <Typography variant="body1" paragraph>
                  Oferta especial con {selectedDeal.discount}% de descuento. 
                  ¡Aprovecha esta oportunidad única!
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="warning.main" sx={{ fontWeight: 'bold' }}>
                    ⏰ Termina en: {formatTimeRemaining(selectedDeal.endTime)}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Stock disponible: {selectedDeal.stock} unidades
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={(selectedDeal.sold / (selectedDeal.sold + selectedDeal.stock)) * 100}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                
                <List dense>
                  <ListItem>
                    <ListItemIcon><Store /></ListItemIcon>
                    <ListItemText primary={selectedDeal.store} />
                  </ListItem>
                  {selectedDeal.freeShipping && (
                    <ListItem>
                      <ListItemIcon><LocalShipping /></ListItemIcon>
                      <ListItemText primary="Envío gratis" />
                    </ListItem>
                  )}
                  {selectedDeal.verified && (
                    <ListItem>
                      <ListItemIcon><Verified /></ListItemIcon>
                      <ListItemText primary="Vendedor verificado" />
                    </ListItem>
                  )}
                </List>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDealDialog(false)}>Cerrar</Button>
            <Button 
              variant="contained" 
              startIcon={<ShoppingCart />}
              onClick={() => {
                addToShoppingList(selectedDeal);
                showNotification('Producto agregado a la lista', 'success');
                setShowDealDialog(false);
              }}
            >
              Agregar a Lista
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => {
                navigate(`/product/${selectedDeal.id}`);
                setShowDealDialog(false);
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
                  <Skeleton variant="text" height={32} />
                  <Skeleton variant="text" height={20} />
                  <Skeleton variant="text" height={20} width="60%" />
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
      {/* Header */}
      <Paper elevation={2} sx={{ p: 4, mb: 4, textAlign: 'center' }}>
        <LocalFireDepartment sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
        <Typography variant="h3" gutterBottom>
          Ofertas y Descuentos
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Encuentra las mejores ofertas y ahorra en tus compras
        </Typography>
        
        {/* Quick Stats */}
        <Grid container spacing={2} sx={{ mt: 3 }}>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">{deals.length}</Typography>
              <Typography variant="body2">Ofertas Activas</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="error.main">{flashDeals.length}</Typography>
              <Typography variant="body2">Ofertas Flash</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">70%</Typography>
              <Typography variant="body2">Descuento Máx.</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">{savedDeals.length}</Typography>
              <Typography variant="body2">Guardadas</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Flash Deals Banner */}
      {flashDeals.length > 0 && (
        <Paper elevation={2} sx={{ p: 3, mb: 3, bgcolor: 'warning.light' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <FlashOn sx={{ color: 'warning.dark', mr: 1 }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'warning.dark' }}>
              ⚡ Ofertas Flash - ¡Por Tiempo Limitado!
            </Typography>
          </Box>
          <Grid container spacing={2}>
            {flashDeals.slice(0, 4).map((deal) => (
              <Grid item xs={12} sm={6} md={3} key={deal.id}>
                <DealCard deal={deal} size="small" />
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

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

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Categoría</InputLabel>
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                label="Categoría"
              >
                {dealCategories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {category.icon}
                      <Typography sx={{ ml: 1 }}>{category.name}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
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
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={loadDeals}
              fullWidth
            >
              Actualizar
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant={notifications ? 'contained' : 'outlined'}
              startIcon={<NotificationsActive />}
              onClick={() => setNotifications(!notifications)}
              fullWidth
            >
              {notifications ? 'Notificaciones ON' : 'Notificaciones OFF'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Deals Grid */}
      {deals.length > 0 ? (
        <Grid container spacing={3}>
          {deals.map((deal) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={deal.id}>
              <DealCard deal={deal} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <LocalOffer sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No hay ofertas disponibles
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Intenta cambiar los filtros o vuelve más tarde
          </Typography>
        </Paper>
      )}

      {/* Deal Detail Dialog */}
      <DealDialog />

      {/* Speed Dial for Quick Actions */}
      <SpeedDial
        ariaLabel="Acciones rápidas"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        <SpeedDialAction
          icon={<NotificationsActive />}
          tooltipTitle="Configurar alertas"
          onClick={() => showNotification('Alertas configuradas', 'success')}
        />
        <SpeedDialAction
          icon={<Share />}
          tooltipTitle="Compartir ofertas"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            showNotification('Enlace copiado al portapapeles', 'success');
          }}
        />
        <SpeedDialAction
          icon={<Bookmark />}
          tooltipTitle="Ver guardadas"
          onClick={() => setActiveTab(3)}
        />
      </SpeedDial>
    </Container>
  );
};

export default Deals;