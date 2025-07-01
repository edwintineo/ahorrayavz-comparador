import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  Breadcrumbs,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  IconButton,
  Button,
  Chip,
  Divider,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  TextField,
  Select,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  Badge,
  Alert,
  Skeleton,
  Fab,
  Tooltip
} from '@mui/material';
import {
  Home,
  Notifications as NotificationsIcon,
  MoreVert,
  Delete,
  MarkEmailRead,
  MarkEmailUnread,
  Settings,
  TrendingDown,
  TrendingUp,
  Store,
  LocalOffer,
  ShoppingCart,
  Favorite,
  Security,
  Info,
  Warning,
  Error,
  CheckCircle,
  Schedule,
  FilterList,
  Clear,
  Refresh,
  DoneAll,
  Star,
  Share,
  OpenInNew
} from '@mui/icons-material';
import { useStore } from '../store/useStore';
import { useNotification } from '../contexts/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const Notifications = () => {
  const navigate = useNavigate();
  const { user } = useStore();
  const { showNotification } = useNotification();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    priceAlerts: true,
    newProducts: true,
    promotions: true,
    systemUpdates: true,
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false
  });
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    dateRange: 'all'
  });

  // Mock notifications data
  const mockNotifications = [
    {
      id: 1,
      type: 'price_alert',
      title: 'Alerta de Precio',
      message: 'El precio del iPhone 14 Pro ha bajado a Bs. 8,500.00 en TecnoStore',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      read: false,
      priority: 'high',
      data: {
        productId: 1,
        storeId: 1,
        oldPrice: 9200,
        newPrice: 8500,
        productName: 'iPhone 14 Pro',
        storeName: 'TecnoStore'
      }
    },
    {
      id: 2,
      type: 'promotion',
      title: 'Nueva Promoción',
      message: 'SuperMercado Central tiene 20% de descuento en productos de limpieza',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      read: true,
      priority: 'medium',
      data: {
        storeId: 2,
        discount: 20,
        category: 'Limpieza',
        storeName: 'SuperMercado Central'
      }
    },
    {
      id: 3,
      type: 'new_product',
      title: 'Nuevo Producto',
      message: 'Samsung Galaxy S24 Ultra ya está disponible en ElectroMax',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      read: false,
      priority: 'medium',
      data: {
        productId: 2,
        storeId: 3,
        productName: 'Samsung Galaxy S24 Ultra',
        storeName: 'ElectroMax'
      }
    },
    {
      id: 4,
      type: 'system',
      title: 'Actualización del Sistema',
      message: 'Hemos mejorado nuestro algoritmo de búsqueda para mejores resultados',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      read: true,
      priority: 'low',
      data: {}
    },
    {
      id: 5,
      type: 'favorite_available',
      title: 'Producto Favorito Disponible',
      message: 'PlayStation 5 está nuevamente en stock en GameZone',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      read: false,
      priority: 'high',
      data: {
        productId: 3,
        storeId: 4,
        productName: 'PlayStation 5',
        storeName: 'GameZone'
      }
    }
  ];

  useEffect(() => {
    // Simulate loading notifications
    setTimeout(() => {
      setNotifications(mockNotifications);
      setLoading(false);
    }, 1000);
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'price_alert':
        return <TrendingDown color="success" />;
      case 'promotion':
        return <LocalOffer color="warning" />;
      case 'new_product':
        return <Store color="primary" />;
      case 'system':
        return <Info color="info" />;
      case 'favorite_available':
        return <Favorite color="error" />;
      default:
        return <NotificationsIcon />;
    }
  };

  const getNotificationColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    if (!notification.read) {
      markAsRead(notification.id);
    }

    // Navigate based on notification type
    switch (notification.type) {
      case 'price_alert':
      case 'new_product':
      case 'favorite_available':
        if (notification.data.productId) {
          navigate(`/product/${notification.data.productId}`);
        }
        break;
      case 'promotion':
        if (notification.data.storeId) {
          navigate(`/store/${notification.data.storeId}`);
        }
        break;
      default:
        break;
    }
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    );
  };

  const markAsUnread = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: false }
          : notif
      )
    );
  };

  const deleteNotification = (notificationId) => {
    setNotifications(prev => 
      prev.filter(notif => notif.id !== notificationId)
    );
    showNotification('Notificación eliminada', 'success');
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    showNotification('Todas las notificaciones marcadas como leídas', 'success');
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    showNotification('Todas las notificaciones eliminadas', 'success');
  };

  const getFilteredNotifications = () => {
    let filtered = notifications;

    // Filter by tab
    if (tabValue === 1) {
      filtered = filtered.filter(notif => !notif.read);
    } else if (tabValue === 2) {
      filtered = filtered.filter(notif => notif.read);
    }

    // Apply additional filters
    if (filters.type !== 'all') {
      filtered = filtered.filter(notif => notif.type === filters.type);
    }

    if (filters.priority !== 'all') {
      filtered = filtered.filter(notif => notif.priority === filters.priority);
    }

    return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const unreadCount = notifications.filter(notif => !notif.read).length;
  const filteredNotifications = getFilteredNotifications();

  const NotificationItem = ({ notification }) => (
    <ListItem
      button
      onClick={() => handleNotificationClick(notification)}
      sx={{
        bgcolor: notification.read ? 'transparent' : 'action.hover',
        borderLeft: notification.read ? 'none' : '4px solid',
        borderLeftColor: `${getNotificationColor(notification.priority)}.main`,
        mb: 1,
        borderRadius: 1
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: `${getNotificationColor(notification.priority)}.light` }}>
          {getNotificationIcon(notification.type)}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: notification.read ? 'normal' : 'bold' }}>
              {notification.title}
            </Typography>
            <Chip 
              label={notification.priority} 
              size="small" 
              color={getNotificationColor(notification.priority)}
              variant="outlined"
            />
          </Box>
        }
        secondary={
          <Box>
            <Typography variant="body2" color="text.secondary">
              {notification.message}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDistanceToNow(notification.timestamp, { addSuffix: true, locale: es })}
            </Typography>
          </Box>
        }
      />
      <ListItemSecondaryAction>
        <IconButton
          edge="end"
          onClick={(e) => {
            e.stopPropagation();
            setFilterAnchorEl(e.currentTarget);
            setSelectedNotification(notification);
          }}
        >
          <MoreVert />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Skeleton variant="text" width={200} height={40} />
        </Box>
        {[...Array(5)].map((_, index) => (
          <Card key={index} sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Skeleton variant="circular" width={40} height={40} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="60%" height={24} />
                  <Skeleton variant="text" width="80%" height={20} />
                  <Skeleton variant="text" width="40%" height={16} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
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
        <Typography color="text.primary">Notificaciones</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon sx={{ fontSize: 32, color: 'primary.main' }} />
            </Badge>
            <Box>
              <Typography variant="h4">
                Notificaciones
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {unreadCount > 0 
                  ? `Tienes ${unreadCount} notificación${unreadCount > 1 ? 'es' : ''} sin leer`
                  : 'Todas las notificaciones están al día'
                }
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Configurar notificaciones">
              <IconButton onClick={() => setSettingsOpen(true)}>
                <Settings />
              </IconButton>
            </Tooltip>
            <Tooltip title="Actualizar">
              <IconButton onClick={() => window.location.reload()}>
                <Refresh />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              {/* Tabs */}
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
                  <Tab 
                    label={`Todas (${notifications.length})`} 
                    icon={<NotificationsIcon />} 
                    iconPosition="start"
                  />
                  <Tab 
                    label={`No leídas (${unreadCount})`} 
                    icon={<Badge badgeContent={unreadCount} color="error"><MarkEmailUnread /></Badge>} 
                    iconPosition="start"
                  />
                  <Tab 
                    label={`Leídas (${notifications.length - unreadCount})`} 
                    icon={<MarkEmailRead />} 
                    iconPosition="start"
                  />
                </Tabs>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                <Button 
                  startIcon={<DoneAll />} 
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                >
                  Marcar todas como leídas
                </Button>
                <Button 
                  startIcon={<Clear />} 
                  onClick={clearAllNotifications}
                  color="error"
                  disabled={notifications.length === 0}
                >
                  Eliminar todas
                </Button>
                <Button 
                  startIcon={<FilterList />} 
                  onClick={(e) => setFilterAnchorEl(e.currentTarget)}
                >
                  Filtros
                </Button>
              </Box>

              {/* Notifications List */}
              {filteredNotifications.length > 0 ? (
                <List>
                  {filteredNotifications.map((notification, index) => (
                    <React.Fragment key={notification.id}>
                      <NotificationItem notification={notification} />
                      {index < filteredNotifications.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <NotificationsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    No hay notificaciones
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {tabValue === 1 
                      ? 'No tienes notificaciones sin leer'
                      : tabValue === 2
                      ? 'No tienes notificaciones leídas'
                      : 'No tienes notificaciones en este momento'
                    }
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Quick Stats */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Resumen
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2">Total:</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {notifications.length}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2">Sin leer:</Typography>
                <Typography variant="body2" fontWeight="bold" color="error.main">
                  {unreadCount}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2">Alertas de precio:</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {notifications.filter(n => n.type === 'price_alert').length}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Promociones:</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {notifications.filter(n => n.type === 'promotion').length}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Actividad Reciente
              </Typography>
              <List dense>
                {notifications.slice(0, 3).map((notification) => (
                  <ListItem key={notification.id} sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar size="small" sx={{ width: 32, height: 32 }}>
                        {getNotificationIcon(notification.type)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={notification.title}
                      secondary={formatDistanceToNow(notification.timestamp, { addSuffix: true, locale: es })}
                      primaryTypographyProps={{ variant: 'body2' }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Context Menu */}
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={() => setFilterAnchorEl(null)}
      >
        {selectedNotification && (
          [
            <MenuItem 
              key="read"
              onClick={() => {
                if (selectedNotification.read) {
                  markAsUnread(selectedNotification.id);
                } else {
                  markAsRead(selectedNotification.id);
                }
                setFilterAnchorEl(null);
              }}
            >
              {selectedNotification.read ? <MarkEmailUnread sx={{ mr: 1 }} /> : <MarkEmailRead sx={{ mr: 1 }} />}
              {selectedNotification.read ? 'Marcar como no leída' : 'Marcar como leída'}
            </MenuItem>,
            <MenuItem 
              key="delete"
              onClick={() => {
                deleteNotification(selectedNotification.id);
                setFilterAnchorEl(null);
              }}
            >
              <Delete sx={{ mr: 1 }} />
              Eliminar
            </MenuItem>
          ]
        )}
      </Menu>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Configuración de Notificaciones</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Tipos de Notificaciones
            </Typography>
            
            <FormControlLabel
              control={
                <Switch 
                  checked={notificationSettings.priceAlerts}
                  onChange={(e) => setNotificationSettings(prev => ({ ...prev, priceAlerts: e.target.checked }))}
                />
              }
              label="Alertas de precios"
            />
            
            <FormControlLabel
              control={
                <Switch 
                  checked={notificationSettings.newProducts}
                  onChange={(e) => setNotificationSettings(prev => ({ ...prev, newProducts: e.target.checked }))}
                />
              }
              label="Nuevos productos"
            />
            
            <FormControlLabel
              control={
                <Switch 
                  checked={notificationSettings.promotions}
                  onChange={(e) => setNotificationSettings(prev => ({ ...prev, promotions: e.target.checked }))}
                />
              }
              label="Promociones y ofertas"
            />
            
            <FormControlLabel
              control={
                <Switch 
                  checked={notificationSettings.systemUpdates}
                  onChange={(e) => setNotificationSettings(prev => ({ ...prev, systemUpdates: e.target.checked }))}
                />
              }
              label="Actualizaciones del sistema"
            />
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" gutterBottom>
              Métodos de Entrega
            </Typography>
            
            <FormControlLabel
              control={
                <Switch 
                  checked={notificationSettings.emailNotifications}
                  onChange={(e) => setNotificationSettings(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                />
              }
              label="Notificaciones por email"
            />
            
            <FormControlLabel
              control={
                <Switch 
                  checked={notificationSettings.pushNotifications}
                  onChange={(e) => setNotificationSettings(prev => ({ ...prev, pushNotifications: e.target.checked }))}
                />
              }
              label="Notificaciones push"
            />
            
            <FormControlLabel
              control={
                <Switch 
                  checked={notificationSettings.smsNotifications}
                  onChange={(e) => setNotificationSettings(prev => ({ ...prev, smsNotifications: e.target.checked }))}
                />
              }
              label="Notificaciones por SMS"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            onClick={() => {
              showNotification('Configuración guardada', 'success');
              setSettingsOpen(false);
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setSettingsOpen(true)}
      >
        <Settings />
      </Fab>
    </Container>
  );
};

export default Notifications;