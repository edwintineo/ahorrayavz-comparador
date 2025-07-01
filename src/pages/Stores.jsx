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
  Rating,
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Breadcrumbs,
  Link
} from '@mui/material';
import {
  Store,
  Search,
  LocationOn,
  Phone,
  Email,
  Language,
  Schedule,
  Star,
  Favorite,
  FavoriteBorder,
  Share,
  Directions,
  Verified,
  LocalShipping,
  CreditCard,
  Security,
  Category,
  FilterList,
  Sort,
  ViewModule,
  ViewList,
  Home,
  TrendingUp,
  LocalOffer,
  ShoppingBag,
  People,
  ThumbUp,
  AccessTime,
  AttachMoney,
  ExpandMore,
  Close,
  Info,
  Map,
  Call,
  Public,
  StoreMallDirectory,
  BusinessCenter,
  LocalMall,
  ShoppingCart
} from '@mui/icons-material';
import { useStore } from '../store/useStore';
import { useStores } from '../hooks/useStores';
import { useNotification } from '../contexts/NotificationContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Stores = () => {
  const navigate = useNavigate();
  const { user, addToFavorites, removeFromFavorites } = useStore();
  const { getStores, loading } = useStores();
  const { showNotification } = useNotification();
  
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedStore, setSelectedStore] = useState(null);
  const [showStoreDialog, setShowStoreDialog] = useState(false);
  const [favoriteStores, setFavoriteStores] = useState([]);
  const [activeTab, setActiveTab] = useState(0);

  const storeCategories = [
    { id: '', name: 'Todas las tiendas', icon: <Store /> },
    { id: 'electronics', name: 'Electrónicos', icon: <Category /> },
    { id: 'fashion', name: 'Moda y Ropa', icon: <Category /> },
    { id: 'home', name: 'Hogar y Jardín', icon: <Category /> },
    { id: 'supermarket', name: 'Supermercados', icon: <Category /> },
    { id: 'pharmacy', name: 'Farmacias', icon: <Category /> },
    { id: 'books', name: 'Librerías', icon: <Category /> },
    { id: 'sports', name: 'Deportes', icon: <Category /> },
    { id: 'automotive', name: 'Automotriz', icon: <Category /> }
  ];

  const locations = [
    '', 'Caracas', 'Maracaibo', 'Valencia', 'Barquisimeto', 
    'Maracay', 'Ciudad Guayana', 'San Cristóbal', 'Maturín'
  ];

  const sortOptions = [
    { value: 'rating', label: 'Mejor Calificación' },
    { value: 'name', label: 'Nombre A-Z' },
    { value: 'products', label: 'Más Productos' },
    { value: 'reviews', label: 'Más Reseñas' },
    { value: 'newest', label: 'Más Recientes' },
    { value: 'distance', label: 'Más Cercanas' }
  ];

  const tabLabels = [
    { label: 'Todas las Tiendas', icon: <Store /> },
    { label: 'Verificadas', icon: <Verified /> },
    { label: 'Favoritas', icon: <Favorite /> },
    { label: 'Cercanas', icon: <LocationOn /> }
  ];

  useEffect(() => {
    loadStores();
    
    // Load favorite stores from localStorage
    const favorites = JSON.parse(localStorage.getItem('favoriteStores') || '[]');
    setFavoriteStores(favorites);
  }, []);

  useEffect(() => {
    filterAndSortStores();
  }, [stores, searchQuery, categoryFilter, locationFilter, sortBy, activeTab]);

  const loadStores = async () => {
    try {
      // Mock stores data
      const mockStores = Array.from({ length: 24 }, (_, index) => ({
        id: `store-${index + 1}`,
        name: `Tienda ${index + 1}`,
        description: `Descripción de la tienda ${index + 1}. Ofrecemos los mejores productos con excelente servicio al cliente.`,
        logo: '/api/placeholder/100/100',
        banner: '/api/placeholder/400/200',
        category: storeCategories[Math.floor(Math.random() * (storeCategories.length - 1)) + 1].id,
        rating: (Math.random() * 2 + 3).toFixed(1),
        reviews: Math.floor(Math.random() * 1000) + 50,
        products: Math.floor(Math.random() * 500) + 100,
        location: locations[Math.floor(Math.random() * (locations.length - 1)) + 1],
        address: `Dirección ${index + 1}, Caracas, Venezuela`,
        phone: `+58 212 ${Math.floor(Math.random() * 9000000) + 1000000}`,
        email: `tienda${index + 1}@email.com`,
        website: `https://tienda${index + 1}.com`,
        verified: Math.random() > 0.3,
        premium: Math.random() > 0.7,
        freeShipping: Math.random() > 0.5,
        acceptsCards: Math.random() > 0.2,
        hasPhysicalStore: Math.random() > 0.3,
        onlineOnly: Math.random() > 0.7,
        established: Math.floor(Math.random() * 20) + 2000,
        followers: Math.floor(Math.random() * 10000) + 500,
        responseTime: Math.floor(Math.random() * 24) + 1,
        openHours: {
          monday: '9:00 AM - 6:00 PM',
          tuesday: '9:00 AM - 6:00 PM',
          wednesday: '9:00 AM - 6:00 PM',
          thursday: '9:00 AM - 6:00 PM',
          friday: '9:00 AM - 6:00 PM',
          saturday: '9:00 AM - 4:00 PM',
          sunday: 'Cerrado'
        },
        socialMedia: {
          facebook: `https://facebook.com/tienda${index + 1}`,
          instagram: `https://instagram.com/tienda${index + 1}`,
          twitter: `https://twitter.com/tienda${index + 1}`
        },
        paymentMethods: ['Efectivo', 'Tarjetas', 'Transferencias', 'Pago Móvil'],
        specialties: ['Envío Rápido', 'Atención 24/7', 'Garantía Extendida'].filter(() => Math.random() > 0.5),
        distance: Math.floor(Math.random() * 50) + 1
      }));
      
      setStores(mockStores);
    } catch (error) {
      showNotification('Error al cargar tiendas', 'error');
    }
  };

  const filterAndSortStores = () => {
    let filtered = [...stores];
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(store => 
        store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by category
    if (categoryFilter) {
      filtered = filtered.filter(store => store.category === categoryFilter);
    }
    
    // Filter by location
    if (locationFilter) {
      filtered = filtered.filter(store => store.location === locationFilter);
    }
    
    // Filter by tab
    switch (activeTab) {
      case 1: // Verified
        filtered = filtered.filter(store => store.verified);
        break;
      case 2: // Favorites
        filtered = filtered.filter(store => favoriteStores.includes(store.id));
        break;
      case 3: // Nearby
        filtered = filtered.filter(store => store.distance <= 10);
        break;
      default:
        break;
    }
    
    // Sort stores
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'products':
          return b.products - a.products;
        case 'reviews':
          return b.reviews - a.reviews;
        case 'newest':
          return b.established - a.established;
        case 'distance':
          return a.distance - b.distance;
        default:
          return 0;
      }
    });
    
    setFilteredStores(filtered);
  };

  const handleToggleFavorite = (storeId) => {
    const newFavorites = favoriteStores.includes(storeId)
      ? favoriteStores.filter(id => id !== storeId)
      : [...favoriteStores, storeId];
    
    setFavoriteStores(newFavorites);
    localStorage.setItem('favoriteStores', JSON.stringify(newFavorites));
    
    showNotification(
      favoriteStores.includes(storeId) ? 'Tienda eliminada de favoritos' : 'Tienda agregada a favoritos',
      'success'
    );
  };

  const handleViewStore = (store) => {
    setSelectedStore(store);
    setShowStoreDialog(true);
  };

  const StoreCard = ({ store }) => {
    const isFavorite = favoriteStores.includes(store.id);
    
    return (
      <Card 
        sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 6
          }
        }}
        onClick={() => navigate(`/store/${store.id}`)}
      >
        {/* Banner */}
        <CardMedia
          component="div"
          sx={{
            height: 120,
            backgroundImage: `url(${store.banner})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative'
          }}
        >
          {/* Premium Badge */}
          {store.premium && (
            <Chip
              label="Premium"
              size="small"
              sx={{
                position: 'absolute',
                top: 8,
                left: 8,
                bgcolor: 'gold',
                color: 'black',
                fontWeight: 'bold'
              }}
            />
          )}
          
          {/* Favorite Button */}
          <IconButton
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'rgba(255,255,255,0.9)',
              '&:hover': { bgcolor: 'rgba(255,255,255,1)' }
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleToggleFavorite(store.id);
            }}
          >
            {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
          </IconButton>
        </CardMedia>
        
        <CardContent sx={{ flexGrow: 1, p: 2 }}>
          {/* Store Logo and Name */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar 
              src={store.logo} 
              sx={{ width: 48, height: 48, mr: 2 }}
            >
              <Store />
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
                  {store.name}
                </Typography>
                {store.verified && (
                  <Verified sx={{ color: 'primary.main', ml: 1, fontSize: 20 }} />
                )}
              </Box>
              <Typography variant="body2" color="text.secondary">
                {storeCategories.find(cat => cat.id === store.category)?.name}
              </Typography>
            </Box>
          </Box>
          
          {/* Rating and Reviews */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Rating value={parseFloat(store.rating)} readOnly size="small" />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              {store.rating} ({store.reviews} reseñas)
            </Typography>
          </Box>
          
          {/* Location */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <LocationOn sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
            <Typography variant="body2" color="text.secondary">
              {store.location} • {store.distance} km
            </Typography>
          </Box>
          
          {/* Products Count */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ShoppingBag sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
            <Typography variant="body2" color="text.secondary">
              {store.products} productos
            </Typography>
          </Box>
          
          {/* Description */}
          <Typography variant="body2" color="text.secondary" paragraph>
            {store.description.substring(0, 100)}...
          </Typography>
          
          {/* Features */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
            {store.freeShipping && (
              <Chip label="Envío Gratis" size="small" color="success" />
            )}
            {store.acceptsCards && (
              <Chip label="Acepta Tarjetas" size="small" color="info" />
            )}
            {store.hasPhysicalStore && (
              <Chip label="Tienda Física" size="small" color="primary" />
            )}
          </Box>
          
          {/* Actions */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/store/${store.id}`);
              }}
            >
              Ver Tienda
            </Button>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleViewStore(store);
              }}
            >
              <Info />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const StoreDialog = () => (
    <Dialog 
      open={showStoreDialog} 
      onClose={() => setShowStoreDialog(false)}
      maxWidth="md"
      fullWidth
    >
      {selectedStore && (
        <>
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar src={selectedStore.logo} sx={{ mr: 2 }}>
                <Store />
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{selectedStore.name}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Rating value={parseFloat(selectedStore.rating)} readOnly size="small" />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {selectedStore.rating} ({selectedStore.reviews} reseñas)
                  </Typography>
                  {selectedStore.verified && (
                    <Verified sx={{ color: 'primary.main', ml: 1 }} />
                  )}
                </Box>
              </Box>
              <IconButton onClick={() => setShowStoreDialog(false)}>
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <img 
                  src={selectedStore.banner} 
                  alt={selectedStore.name}
                  style={{ width: '100%', borderRadius: 8, marginBottom: 16 }}
                />
                
                <Typography variant="body1" paragraph>
                  {selectedStore.description}
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom>Especialidades</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedStore.specialties.map((specialty, index) => (
                      <Chip key={index} label={specialty} size="small" />
                    ))}
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <List>
                  <ListItem>
                    <ListItemIcon><LocationOn /></ListItemIcon>
                    <ListItemText 
                      primary="Ubicación" 
                      secondary={selectedStore.address}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Phone /></ListItemIcon>
                    <ListItemText 
                      primary="Teléfono" 
                      secondary={selectedStore.phone}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Email /></ListItemIcon>
                    <ListItemText 
                      primary="Email" 
                      secondary={selectedStore.email}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Language /></ListItemIcon>
                    <ListItemText 
                      primary="Sitio Web" 
                      secondary={selectedStore.website}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><ShoppingBag /></ListItemIcon>
                    <ListItemText 
                      primary="Productos" 
                      secondary={`${selectedStore.products} productos disponibles`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><People /></ListItemIcon>
                    <ListItemText 
                      primary="Seguidores" 
                      secondary={`${selectedStore.followers} seguidores`}
                    />
                  </ListItem>
                </List>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="h6" gutterBottom>Métodos de Pago</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {selectedStore.paymentMethods.map((method, index) => (
                    <Chip key={index} label={method} size="small" variant="outlined" />
                  ))}
                </Box>
                
                <Typography variant="h6" gutterBottom>Horarios</Typography>
                <List dense>
                  {Object.entries(selectedStore.openHours).map(([day, hours]) => (
                    <ListItem key={day}>
                      <ListItemText 
                        primary={day.charAt(0).toUpperCase() + day.slice(1)}
                        secondary={hours}
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowStoreDialog(false)}>Cerrar</Button>
            <Button 
              variant="outlined" 
              startIcon={<Phone />}
              href={`tel:${selectedStore.phone}`}
            >
              Llamar
            </Button>
            <Button 
              variant="outlined" 
              startIcon={<Directions />}
              onClick={() => {
                window.open(`https://maps.google.com/?q=${encodeURIComponent(selectedStore.address)}`, '_blank');
              }}
            >
              Direcciones
            </Button>
            <Button 
              variant="contained" 
              onClick={() => {
                navigate(`/store/${selectedStore.id}`);
                setShowStoreDialog(false);
              }}
            >
              Ver Tienda
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
                <Skeleton variant="rectangular" height={120} />
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Skeleton variant="circular" width={48} height={48} sx={{ mr: 2 }} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Skeleton variant="text" height={24} />
                      <Skeleton variant="text" height={16} width="60%" />
                    </Box>
                  </Box>
                  <Skeleton variant="text" height={20} />
                  <Skeleton variant="text" height={20} />
                  <Skeleton variant="text" height={20} width="80%" />
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
        <Typography color="text.primary">Tiendas</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Paper elevation={2} sx={{ p: 4, mb: 4, textAlign: 'center' }}>
        <StoreMallDirectory sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h3" gutterBottom>
          Directorio de Tiendas
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Descubre las mejores tiendas y comercios de Venezuela
        </Typography>
        
        {/* Quick Stats */}
        <Grid container spacing={2} sx={{ mt: 3 }}>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">{stores.length}</Typography>
              <Typography variant="body2">Tiendas Registradas</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {stores.filter(s => s.verified).length}
              </Typography>
              <Typography variant="body2">Verificadas</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                {favoriteStores.length}
              </Typography>
              <Typography variant="body2">Favoritas</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main">
                {storeCategories.length - 1}
              </Typography>
              <Typography variant="body2">Categorías</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Search and Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Buscar tiendas..."
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
                {storeCategories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Ubicación</InputLabel>
              <Select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                label="Ubicación"
              >
                <MenuItem value="">Todas las ubicaciones</MenuItem>
                {locations.slice(1).map((location) => (
                  <MenuItem key={location} value={location}>
                    {location}
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
          <Grid item xs={12} sm={6} md={2}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton 
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                color={viewMode === 'grid' ? 'primary' : 'default'}
              >
                {viewMode === 'grid' ? <ViewList /> : <ViewModule />}
              </IconButton>
            </Box>
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
        {filteredStores.length} tiendas encontradas
      </Typography>

      {/* Stores Grid */}
      {filteredStores.length > 0 ? (
        <Grid container spacing={3}>
          {filteredStores.map((store) => (
            <Grid 
              item 
              xs={12} 
              sm={viewMode === 'grid' ? 6 : 12} 
              md={viewMode === 'grid' ? 4 : 12} 
              lg={viewMode === 'grid' ? 3 : 12}
              key={store.id}
            >
              <StoreCard store={store} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Store sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No se encontraron tiendas
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Intenta ajustar tus filtros de búsqueda
          </Typography>
        </Paper>
      )}

      {/* Store Detail Dialog */}
      <StoreDialog />

      {/* Speed Dial for Quick Actions */}
      <SpeedDial
        ariaLabel="Acciones rápidas"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        <SpeedDialAction
          icon={<Map />}
          tooltipTitle="Ver en mapa"
          onClick={() => showNotification('Función de mapa próximamente', 'info')}
        />
        <SpeedDialAction
          icon={<Share />}
          tooltipTitle="Compartir directorio"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            showNotification('Enlace copiado al portapapeles', 'success');
          }}
        />
        <SpeedDialAction
          icon={<Favorite />}
          tooltipTitle="Ver favoritas"
          onClick={() => setActiveTab(2)}
        />
      </SpeedDial>
    </Container>
  );
};

export default Stores;