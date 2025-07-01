import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
  Badge,
  Skeleton
} from '@mui/material';
import {
  Person,
  ShoppingList,
  Favorite,
  Store,
  Notifications,
  Security,
  LocationOn,
  Edit,
  Delete,
  Add,
  Share,
  Visibility,
  VisibilityOff,
  Save,
  Cancel,
  TrendingUp,
  ShoppingCart,
  Star,
  History,
  Settings,
  ExitToApp
} from '@mui/icons-material';
import { useStore } from '../store/useStore';
import { useAuth } from '../hooks/useWordPressAPI';
import { useNotification } from '../contexts/NotificationContext';
import { useErrorHandler } from '../hooks/useErrorHandler';
import ProductCard from '../components/products/ProductCard';

// Constants for better code maintainability
const VENEZUELAN_STATES = [
  'Amazonas', 'Anzoátegui', 'Apure', 'Aragua', 'Barinas', 'Bolívar',
  'Carabobo', 'Cojedes', 'Delta Amacuro', 'Distrito Capital', 'Falcón',
  'Guárico', 'Lara', 'Mérida', 'Miranda', 'Monagas', 'Nueva Esparta',
  'Portuguesa', 'Sucre', 'Táchira', 'Trujillo', 'Vargas', 'Yaracuy', 'Zulia'
];

const TABS = {
  MY_LISTS: 0,
  FAVORITES: 1,
  ACTIVITY: 2,
  PROFILE: 3,
  SETTINGS: 4
};

const ACTIVITY_TYPES = {
  LIST_CREATED: 'list_created',
  PRODUCT_FAVORITED: 'product_favorited',
  STORE_VISITED: 'store_visited'
};

const UserDashboard = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { user, shoppingLists, logout, updateUser } = useStore();
  const { updateProfile } = useAuth();
  const { handleError, withErrorHandling } = useErrorHandler();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editListOpen, setEditListOpen] = useState(false);
  const [selectedList, setSelectedList] = useState(null);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: ''
  });
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    priceAlerts: true,
    weeklyDigest: false,
    currency: 'bs',
    language: 'es'
  });
  const [favorites, setFavorites] = useState({
    products: [],
    stores: []
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [statistics, setStatistics] = useState({
    totalLists: 0,
    totalProducts: 0,
    totalSavings: 0,
    favoriteStores: 0
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.acf?.telefono || '',
        address: user.acf?.direccion || '',
        city: user.acf?.ciudad || '',
        state: user.acf?.estado || ''
      });

      // Load user preferences
      const savedPreferences = localStorage.getItem(`preferences_${user.id}`);
      if (savedPreferences) {
        setPreferences(JSON.parse(savedPreferences));
      }

      // Load favorites
      loadFavorites();
      loadRecentActivity();
      calculateStatistics();
    }
  }, [user]);

  const loadFavorites = useCallback(() => {
    try {
      const favoriteProducts = JSON.parse(localStorage.getItem('favorites') || '[]');
      const favoriteStores = JSON.parse(localStorage.getItem('favoriteStores') || '[]');
      
      setFavorites({
        products: favoriteProducts,
        stores: favoriteStores
      });
    } catch (error) {
      handleError(error, 'Error al cargar favoritos');
    }
  }, [handleError]);

  const loadRecentActivity = useCallback(() => {
    try {
      // Mock recent activity (in real app, fetch from API)
      setRecentActivity([
        {
          id: 1,
          type: ACTIVITY_TYPES.LIST_CREATED,
          description: 'Creaste la lista "Compras del mes"',
          date: '2025-01-15T10:30:00Z',
          icon: <ShoppingList />
        },
        {
          id: 2,
          type: ACTIVITY_TYPES.PRODUCT_FAVORITED,
          description: 'Agregaste "Arroz Diana 1kg" a favoritos',
          date: '2025-01-14T15:45:00Z',
          icon: <Favorite />
        },
        {
          id: 3,
          type: ACTIVITY_TYPES.STORE_VISITED,
          description: 'Visitaste el perfil de "Supermercado Central"',
          date: '2025-01-13T09:20:00Z',
          icon: <Store />
        }
      ]);
    } catch (error) {
      handleError(error, 'Error al cargar actividad reciente');
    }
  }, [handleError]);

  const calculateStatistics = useCallback(() => {
    try {
      setStatistics({
        totalLists: shoppingLists.length,
        totalProducts: shoppingLists.reduce((total, list) => total + list.items.length, 0),
        totalSavings: 0, // Calculate based on price comparisons
        favoriteStores: favorites.stores.length
      });
    } catch (error) {
      handleError(error, 'Error al calcular estadísticas');
    }
  }, [shoppingLists, favorites.stores.length, handleError]);

  // Memoized statistics for performance optimization
  const memoizedStatistics = useMemo(() => ({
    totalLists: shoppingLists.length,
    totalProducts: shoppingLists.reduce((total, list) => total + list.items.length, 0),
    totalSavings: 0, // Calculate based on price comparisons
    favoriteStores: favorites.stores.length
  }), [shoppingLists, favorites.stores.length]);

  const handleUpdateProfile = useCallback(async () => {
    const updateProfileWithErrorHandling = withErrorHandling(async () => {
      setLoading(true);
      await updateProfile(profileData);
      updateUser(profileData);
      setEditProfileOpen(false);
      showNotification('Perfil actualizado exitosamente', 'success');
    });

    try {
      await updateProfileWithErrorHandling();
    } finally {
      setLoading(false);
    }
  }, [profileData, updateProfile, updateUser, showNotification, withErrorHandling]);

  const handleUpdatePreferences = useCallback(() => {
    try {
      if (!user?.id) {
        throw new Error('Usuario no válido');
      }
      localStorage.setItem(`preferences_${user.id}`, JSON.stringify(preferences));
      showNotification('Preferencias guardadas', 'success');
    } catch (error) {
      handleError(error, 'Error al guardar preferencias');
    }
  }, [user?.id, preferences, showNotification, handleError]);

  const handleDeleteList = useCallback((listId) => {
    // In real app, call API to delete list
    if (window.confirm('¿Estás seguro de que deseas eliminar esta lista?')) {
      showNotification('Lista eliminada', 'info');
    }
  }, [showNotification]);

  const handleShareList = useCallback(async (list) => {
    try {
      const shareUrl = `${window.location.origin}/lista/${list.id}`;
      
      if (navigator.share) {
        await navigator.share({
          title: `Lista de compras: ${list.name}`,
          url: shareUrl
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        showNotification('Enlace de la lista copiado', 'success');
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        handleError(error, 'Error al compartir la lista');
      }
    }
  }, [showNotification, handleError]);

  const handleLogout = useCallback(() => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      logout();
      navigate('/');
      showNotification('Sesión cerrada exitosamente', 'info');
    }
  }, [logout, navigate, showNotification]);

  const formatDate = useCallback((dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('es-VE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Fecha inválida';
    }
  }, []);

  const formatPrice = useCallback((price, currency = 'bs') => {
    if (!price || isNaN(price)) return 'N/A';
    
    try {
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
    } catch (error) {
      console.error('Error formatting price:', error);
      return `${price} ${currency === 'bs' ? 'Bs.' : 'USD'}`;
    }
  }, []);



  const tabChangeHandler = useCallback((event, newValue) => {
    setTabValue(newValue);
  }, []);

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">
          Debes iniciar sesión para acceder al dashboard.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{ width: 64, height: 64, bgcolor: 'primary.main' }}
            src={user.avatar_url}
          >
            {user.name?.charAt(0) || 'U'}
          </Avatar>
          <Box>
            <Typography variant="h4">
              ¡Hola, {user.name || 'Usuario'}!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Bienvenido a tu dashboard personal
            </Typography>
          </Box>
        </Box>
        <Button
          variant="outlined"
          startIcon={<ExitToApp />}
          onClick={handleLogout}
          color="error"
        >
          Cerrar Sesión
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <ShoppingList color="primary" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">{memoizedStatistics.totalLists}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Listas de Compras
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <ShoppingCart color="success" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">{memoizedStatistics.totalProducts}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Productos Guardados
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Favorite color="error" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">{favorites.products.length}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Productos Favoritos
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Store color="warning" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">{memoizedStatistics.favoriteStores}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tiendas Favoritas
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={tabChangeHandler}
          aria-label="Dashboard navigation tabs"
        >
          <Tab 
            icon={<ShoppingList />} 
            label="Mis Listas" 
            id={`tab-${TABS.MY_LISTS}`}
            aria-controls={`tabpanel-${TABS.MY_LISTS}`}
          />
          <Tab 
            icon={<Favorite />} 
            label="Favoritos" 
            id={`tab-${TABS.FAVORITES}`}
            aria-controls={`tabpanel-${TABS.FAVORITES}`}
          />
          <Tab 
            icon={<History />} 
            label="Actividad" 
            id={`tab-${TABS.ACTIVITY}`}
            aria-controls={`tabpanel-${TABS.ACTIVITY}`}
          />
          <Tab 
            icon={<Person />} 
            label="Perfil" 
            id={`tab-${TABS.PROFILE}`}
            aria-controls={`tabpanel-${TABS.PROFILE}`}
          />
          <Tab 
            icon={<Settings />} 
            label="Configuración" 
            id={`tab-${TABS.SETTINGS}`}
            aria-controls={`tabpanel-${TABS.SETTINGS}`}
          />
        </Tabs>
      </Box>

      {/* Shopping Lists Tab */}
      {tabValue === TABS.MY_LISTS && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">Mis Listas de Compras</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/listas/nueva')}
            >
              Nueva Lista
            </Button>
          </Box>
          
          {shoppingLists.length > 0 ? (
            <Grid container spacing={3}>
              {shoppingLists.map((list) => (
                <Grid item xs={12} md={6} key={list.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6">{list.name}</Typography>
                        <Box>
                          <IconButton
                            size="small"
                            onClick={() => handleShareList(list)}
                          >
                            <Share />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedList(list);
                              setEditListOpen(true);
                            }}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteList(list.id)}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {list.items.length} productos
                      </Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                        <Box>
                          <Typography variant="body1" fontWeight="bold">
                            {formatPrice(list.totalBs, 'bs')}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {formatPrice(list.totalUsd, 'usd')}
                          </Typography>
                        </Box>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => navigate(`/lista/${list.id}`)}
                        >
                          Ver Lista
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Alert severity="info">
              Aún no tienes listas de compras. ¡Crea tu primera lista para comenzar a ahorrar!
            </Alert>
          )}
        </Box>
      )}

      {/* Favorites Tab */}
      {tabValue === TABS.FAVORITES && (
        <Box>
          <Typography variant="h5" gutterBottom>
            Productos y Tiendas Favoritas
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Productos Favoritos ({favorites.products.length})
            </Typography>
            {favorites.products.length > 0 ? (
              <Typography variant="body2" color="text.secondary">
                Tus productos favoritos aparecerán aquí cuando los agregues.
              </Typography>
            ) : (
              <Alert severity="info">
                No tienes productos favoritos aún. ¡Explora nuestro catálogo y marca tus productos preferidos!
              </Alert>
            )}
          </Box>
          
          <Box>
            <Typography variant="h6" gutterBottom>
              Tiendas Favoritas ({favorites.stores.length})
            </Typography>
            {favorites.stores.length > 0 ? (
              <Typography variant="body2" color="text.secondary">
                Tus tiendas favoritas aparecerán aquí cuando las agregues.
              </Typography>
            ) : (
              <Alert severity="info">
                No tienes tiendas favoritas aún. ¡Explora las tiendas y marca tus preferidas!
              </Alert>
            )}
          </Box>
        </Box>
      )}

      {/* Activity Tab */}
      {tabValue === TABS.ACTIVITY && (
        <Box>
          <Typography variant="h5" gutterBottom>
            Actividad Reciente
          </Typography>
          
          {recentActivity.length > 0 ? (
            <List>
              {recentActivity.map((activity) => (
                <ListItem key={activity.id}>
                  <ListItemIcon>
                    {activity.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={activity.description}
                    secondary={formatDate(activity.date)}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Alert severity="info">
              No hay actividad reciente para mostrar.
            </Alert>
          )}
        </Box>
      )}

      {/* Profile Tab */}
      {tabValue === TABS.PROFILE && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">Mi Perfil</Typography>
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={() => setEditProfileOpen(true)}
            >
              Editar Perfil
            </Button>
          </Box>
          
          <Card>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Información Personal
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Nombre"
                        secondary={profileData.name || 'No especificado'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Email"
                        secondary={profileData.email || 'No especificado'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Teléfono"
                        secondary={profileData.phone || 'No especificado'}
                      />
                    </ListItem>
                  </List>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Ubicación
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Dirección"
                        secondary={profileData.address || 'No especificada'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Ciudad"
                        secondary={profileData.city || 'No especificada'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Estado"
                        secondary={profileData.state || 'No especificado'}
                      />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Settings Tab */}
      {tabValue === TABS.SETTINGS && (
        <Box>
          <Typography variant="h5" gutterBottom>
            Configuración
          </Typography>
          
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Notificaciones
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemText
                    primary="Notificaciones por email"
                    secondary="Recibe actualizaciones por correo electrónico"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={preferences.emailNotifications}
                      onChange={(e) => setPreferences({
                        ...preferences,
                        emailNotifications: e.target.checked
                      })}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemText
                    primary="Notificaciones push"
                    secondary="Recibe notificaciones en tu dispositivo"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={preferences.pushNotifications}
                      onChange={(e) => setPreferences({
                        ...preferences,
                        pushNotifications: e.target.checked
                      })}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemText
                    primary="Alertas de precios"
                    secondary="Notificaciones cuando cambien los precios"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={preferences.priceAlerts}
                      onChange={(e) => setPreferences({
                        ...preferences,
                        priceAlerts: e.target.checked
                      })}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>
                Preferencias
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Moneda preferida</InputLabel>
                    <Select
                      value={preferences.currency}
                      label="Moneda preferida"
                      onChange={(e) => setPreferences({
                        ...preferences,
                        currency: e.target.value
                      })}
                    >
                      <MenuItem value="bs">Bolívares (Bs.)</MenuItem>
                      <MenuItem value="usd">Dólares (USD)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Idioma</InputLabel>
                    <Select
                      value={preferences.language}
                      label="Idioma"
                      onChange={(e) => setPreferences({
                        ...preferences,
                        language: e.target.value
                      })}
                    >
                      <MenuItem value="es">Español</MenuItem>
                      <MenuItem value="en">English</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  onClick={handleUpdatePreferences}
                >
                  Guardar Configuración
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Edit Profile Dialog */}
      <Dialog open={editProfileOpen} onClose={() => setEditProfileOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Editar Perfil</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Teléfono"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ciudad"
                value={profileData.city}
                onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Dirección"
                value={profileData.address}
                onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={profileData.state}
                  label="Estado"
                  onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
                >
                  {VENEZUELAN_STATES.map((state) => (
                    <MenuItem key={state} value={state}>{state}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditProfileOpen(false)}>Cancelar</Button>
          <Button
            onClick={handleUpdateProfile}
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserDashboard;