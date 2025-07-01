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
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputAdornment,
  Fab,
  Menu,
  MenuItem as MenuItemComponent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  Tooltip
} from '@mui/material';
import {
  AdminPanelSettings,
  People,
  Store,
  Inventory,
  Analytics,
  Settings,
  Add,
  Edit,
  Delete,
  Visibility,
  VisibilityOff,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Star,
  AttachMoney,
  Notifications,
  ExitToApp,
  MoreVert,
  Search,
  FilterList,
  Upload,
  Download,
  Share,
  LocationOn,
  Phone,
  Email,
  Schedule,
  Language,
  Save,
  Cancel,
  PhotoCamera,
  Map,
  Block,
  CheckCircle,
  Warning,
  Info,
  Error,
  ExpandMore,
  Refresh,
  Security,
  Backup,
  Update,
  Dashboard,
  Report,
  Assignment,
  Group,
  Business,
  Category,
  Public,
  Lock,
  VpnKey
} from '@mui/icons-material';
import { useStore } from '../store/useStore';
import { useProducts, useStores, useAuth } from '../hooks/useWordPressAPI';
import { useNotification } from '../contexts/NotificationContext';
import { useErrorHandler } from '../hooks/useErrorHandler';

// Constants
const ADMIN_TABS = {
  DASHBOARD: 0,
  USERS: 1,
  PRODUCTS: 2,
  STORES: 3,
  REPORTS: 4,
  SETTINGS: 5
};

const USER_ROLES = {
  ADMINISTRATOR: 'administrator',
  MERCHANT: 'merchant',
  CLIENT: 'client'
};

const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending'
};

const PRODUCT_STATUS = {
  PUBLISH: 'publish',
  DRAFT: 'draft'
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { user, logout } = useStore();
  const { searchProducts, deleteProduct, updateProduct } = useProducts();
  const { searchStores, deleteStore, updateStore } = useStores();
  const { handleError } = useErrorHandler();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalStores: 0,
    totalViews: 0,
    activeUsers: 0,
    pendingApprovals: 0,
    systemHealth: 95,
    storageUsed: 65
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedItemType, setSelectedItemType] = useState('');
  
  const [userForm, setUserForm] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    roles: ['client'],
    status: 'active'
  });

  const [systemSettings, setSystemSettings] = useState({
    site_title: 'AhorraYa VZ',
    site_description: 'Comparador de precios en Venezuela',
    maintenance_mode: false,
    user_registration: true,
    merchant_approval: true,
    max_products_per_store: 1000,
    max_images_per_product: 5,
    exchange_rate_update_frequency: 60,
    cache_duration: 300,
    email_notifications: true,
    sms_notifications: false
  });

  // Memoized functions
  const handleTabChange = useCallback((event, newValue) => {
    setTabValue(newValue);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/');
    showNotification('Sesión cerrada exitosamente', 'info');
  }, [logout, navigate, showNotification]);

  const handleMenuClick = useCallback((event, itemId, itemType) => {
    setAnchorEl(event.currentTarget);
    setSelectedItemId(itemId);
    setSelectedItemType(itemType);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
    setSelectedItemId(null);
    setSelectedItemType('');
  }, []);

  useEffect(() => {
    if (user && user.roles?.includes(USER_ROLES.ADMINISTRATOR)) {
      loadAdminData();
    } else {
      navigate('/dashboard');
    }
  }, [user]);

  const loadAdminData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Load system statistics
      await loadSystemStats();
      
      // Load users, products, and stores based on current tab
      switch (tabValue) {
        case ADMIN_TABS.DASHBOARD:
          await loadDashboardData();
          break;
        case ADMIN_TABS.USERS:
          await loadUsers();
          break;
        case ADMIN_TABS.PRODUCTS:
          await loadProducts();
          break;
        case ADMIN_TABS.STORES:
          await loadStores();
          break;
        default:
          break;
      }
      
    } catch (error) {
      handleError(error, 'Error al cargar los datos del panel de administración');
    } finally {
      setLoading(false);
    }
  }, [tabValue, handleError]);

  const loadSystemStats = useCallback(async () => {
    try {
      // Mock data - in real app, fetch from API
      setSystemStats({
        totalUsers: 1250,
        totalProducts: 8500,
        totalStores: 320,
        totalViews: 45000,
        activeUsers: 180,
        pendingApprovals: 12,
        systemHealth: 95,
        storageUsed: 65
      });
    } catch (error) {
      handleError(error, 'Error al cargar las estadísticas del sistema');
    }
  }, [handleError]);

  // Memoized statistics
  const memoizedSystemStats = useMemo(() => systemStats, [systemStats]);

  // Memoized filtered data
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = !searchQuery || 
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRole = !filterRole || user.roles.includes(filterRole);
      const matchesStatus = !filterStatus || user.status === filterStatus;
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, filterRole, filterStatus]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = !searchQuery || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = !filterStatus || product.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    });
  }, [products, searchQuery, filterStatus]);

  const filteredStores = useMemo(() => {
    return stores.filter(store => {
      const matchesSearch = !searchQuery || 
        store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = !filterStatus || store.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    });
  }, [stores, searchQuery, filterStatus]);

  const loadDashboardData = async () => {
    // Load recent activity and summary data
  };

  const loadUsers = async () => {
    // Mock users data - in real app, fetch from WordPress API
    setUsers([
      {
        id: 1,
        username: 'admin',
        email: 'admin@ahorrayavz.com',
        first_name: 'Administrador',
        last_name: 'Sistema',
        roles: ['administrator'],
        status: 'active',
        registered: '2024-01-01',
        last_login: '2024-01-15'
      },
      {
        id: 2,
        username: 'comerciante1',
        email: 'comerciante@tienda.com',
        first_name: 'Juan',
        last_name: 'Pérez',
        roles: ['merchant'],
        status: 'active',
        registered: '2024-01-05',
        last_login: '2024-01-14'
      },
      {
        id: 3,
        username: 'cliente1',
        email: 'cliente@email.com',
        first_name: 'María',
        last_name: 'González',
        roles: ['client'],
        status: 'active',
        registered: '2024-01-10',
        last_login: '2024-01-15'
      }
    ]);
  };

  const loadProducts = useCallback(async () => {
    try {
      const result = await searchProducts({
        search: searchQuery,
        status: filterStatus || 'any',
        per_page: 50
      });
      setProducts(result.products || []);
    } catch (error) {
      handleError(error, 'Error al cargar los productos');
    }
  }, [searchProducts, searchQuery, filterStatus, handleError]);

  const loadStores = useCallback(async () => {
    try {
      const result = await searchStores({
        search: searchQuery,
        status: filterStatus || 'any',
        per_page: 50
      });
      setStores(result.stores || []);
    } catch (error) {
      handleError(error, 'Error al cargar las tiendas');
    }
  }, [searchStores, searchQuery, filterStatus, handleError]);

  useEffect(() => {
    if (user) {
      loadAdminData();
    }
  }, [tabValue, searchQuery, filterStatus, filterRole]);

  const handleCreateUser = useCallback(async () => {
    try {
      setLoading(true);
      
      // In real app, create user via WordPress API
      console.log('Creating user:', userForm);
      
      setUserDialogOpen(false);
      setUserForm({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        roles: [USER_ROLES.CLIENT],
        status: USER_STATUS.ACTIVE
      });
      
      await loadUsers();
      showNotification('Usuario creado exitosamente', 'success');
      
    } catch (error) {
      handleError(error, 'Error al crear el usuario');
    } finally {
      setLoading(false);
    }
  }, [userForm, loadUsers, showNotification, handleError]);

  const handleUpdateUser = useCallback(async () => {
    try {
      setLoading(true);
      
      // In real app, update user via WordPress API
      console.log('Updating user:', selectedUser.id, userForm);
      
      setUserDialogOpen(false);
      setSelectedUser(null);
      
      await loadUsers();
      showNotification('Usuario actualizado exitosamente', 'success');
      
    } catch (error) {
      handleError(error, 'Error al actualizar el usuario');
    } finally {
      setLoading(false);
    }
  }, [selectedUser, userForm, loadUsers, showNotification, handleError]);

  const handleDeleteUser = useCallback(async (userId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        // In real app, delete user via WordPress API
        console.log('Deleting user:', userId);
        
        await loadUsers();
        showNotification('Usuario eliminado exitosamente', 'success');
      } catch (error) {
        handleError(error, 'Error al eliminar el usuario');
      }
    }
  }, [loadUsers, showNotification, handleError]);

  const handleDeleteProduct = useCallback(async (productId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await deleteProduct(productId);
        await loadProducts();
        showNotification('Producto eliminado exitosamente', 'success');
      } catch (error) {
        handleError(error, 'Error al eliminar el producto');
      }
    }
  }, [deleteProduct, loadProducts, showNotification, handleError]);

  const handleDeleteStore = useCallback(async (storeId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tienda?')) {
      try {
        await deleteStore(storeId);
        await loadStores();
        showNotification('Tienda eliminada exitosamente', 'success');
      } catch (error) {
        handleError(error, 'Error al eliminar la tienda');
      }
    }
  }, [deleteStore, loadStores, showNotification, handleError]);

  const handleToggleStatus = useCallback(async (itemId, itemType, currentStatus) => {
    try {
      const newStatus = currentStatus === PRODUCT_STATUS.PUBLISH ? PRODUCT_STATUS.DRAFT : PRODUCT_STATUS.PUBLISH;
      
      if (itemType === 'product') {
        await updateProduct(itemId, { status: newStatus });
        await loadProducts();
      } else if (itemType === 'store') {
        await updateStore(itemId, { status: newStatus });
        await loadStores();
      }
      
      showNotification(`Estado actualizado exitosamente`, 'success');
    } catch (error) {
      handleError(error, 'Error al actualizar el estado');
    }
  }, [updateProduct, updateStore, loadProducts, loadStores, showNotification, handleError]);

  const openUserDialog = useCallback((user = null) => {
    if (user) {
      setSelectedUser(user);
      setUserForm({
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        roles: user.roles,
        status: user.status
      });
    } else {
      setSelectedUser(null);
      setUserForm({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        roles: [USER_ROLES.CLIENT],
        status: USER_STATUS.ACTIVE
      });
    }
    setUserDialogOpen(true);
  }, []);

  const handleMenuClick = (event, itemId, itemType) => {
    setAnchorEl(event.currentTarget);
    setSelectedItemId(itemId);
    setSelectedItemType(itemType);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItemId(null);
    setSelectedItemType('');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    showNotification('Sesión cerrada exitosamente', 'info');
  };



  const getRoleColor = useCallback((roles) => {
    if (roles.includes(USER_ROLES.ADMINISTRATOR)) return 'error';
    if (roles.includes(USER_ROLES.MERCHANT)) return 'warning';
    return 'primary';
  }, []);

  const getRoleLabel = useCallback((roles) => {
    if (roles.includes(USER_ROLES.ADMINISTRATOR)) return 'Administrador';
    if (roles.includes(USER_ROLES.MERCHANT)) return 'Comerciante';
    return 'Cliente';
  }, []);

  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleDateString('es-VE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }, []);

  if (!user || !user.roles?.includes(USER_ROLES.ADMINISTRATOR)) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          No tienes permisos para acceder al panel de administración.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{ width: 64, height: 64, bgcolor: 'error.main' }}
            src={user.avatar_url}
          >
            <AdminPanelSettings />
          </Avatar>
          <Box>
            <Typography variant="h4">
              Panel de Administración
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Gestión completa del sistema AhorraYa VZ
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

      {/* System Health Alert */}
      {systemStats.systemHealth < 90 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="subtitle2">
            Estado del Sistema: {systemStats.systemHealth}%
          </Typography>
          <Typography variant="body2">
            Se recomienda revisar el rendimiento del sistema.
          </Typography>
        </Alert>
      )}

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <People color="primary" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">{memoizedSystemStats.totalUsers}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Usuarios Totales
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
                <Inventory color="info" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">{memoizedSystemStats.totalProducts}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Productos
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
                <Store color="success" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">{memoizedSystemStats.totalStores}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tiendas
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
                <Visibility color="warning" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">{memoizedSystemStats.totalViews}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Visualizaciones
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
          onChange={handleTabChange}
          aria-label="Panel de administración"
        >
          <Tab 
            icon={<Dashboard />} 
            label="Dashboard" 
            id={`admin-tab-${ADMIN_TABS.DASHBOARD}`}
            aria-controls={`admin-tabpanel-${ADMIN_TABS.DASHBOARD}`}
          />
          <Tab 
            icon={<People />} 
            label="Usuarios" 
            id={`admin-tab-${ADMIN_TABS.USERS}`}
            aria-controls={`admin-tabpanel-${ADMIN_TABS.USERS}`}
          />
          <Tab 
            icon={<Inventory />} 
            label="Productos" 
            id={`admin-tab-${ADMIN_TABS.PRODUCTS}`}
            aria-controls={`admin-tabpanel-${ADMIN_TABS.PRODUCTS}`}
          />
          <Tab 
            icon={<Store />} 
            label="Tiendas" 
            id={`admin-tab-${ADMIN_TABS.STORES}`}
            aria-controls={`admin-tabpanel-${ADMIN_TABS.STORES}`}
          />
          <Tab 
            icon={<Analytics />} 
            label="Reportes" 
            id={`admin-tab-${ADMIN_TABS.REPORTS}`}
            aria-controls={`admin-tabpanel-${ADMIN_TABS.REPORTS}`}
          />
          <Tab 
            icon={<Settings />} 
            label="Configuración" 
            id={`admin-tab-${ADMIN_TABS.SETTINGS}`}
            aria-controls={`admin-tabpanel-${ADMIN_TABS.SETTINGS}`}
          />
        </Tabs>
      </Box>

      {/* Dashboard Tab */}
      {tabValue === ADMIN_TABS.DASHBOARD && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Estado del Sistema
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Salud del Sistema</Typography>
                    <Typography variant="body2">{systemStats.systemHealth}%</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={systemStats.systemHealth} 
                    color={systemStats.systemHealth > 90 ? 'success' : 'warning'}
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Almacenamiento Usado</Typography>
                    <Typography variant="body2">{systemStats.storageUsed}%</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={systemStats.storageUsed} 
                    color={systemStats.storageUsed > 80 ? 'error' : 'primary'}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Acciones Rápidas
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={() => loadAdminData()}
                    fullWidth
                  >
                    Actualizar Datos
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Backup />}
                    fullWidth
                  >
                    Crear Respaldo
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Report />}
                    fullWidth
                  >
                    Generar Reporte
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Actividad Reciente
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon><People /></ListItemIcon>
                    <ListItemText
                      primary="Nuevo usuario registrado"
                      secondary="María González se registró como cliente"
                    />
                    <Typography variant="body2" color="text.secondary">
                      Hace 2 horas
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Store /></ListItemIcon>
                    <ListItemText
                      primary="Nueva tienda aprobada"
                      secondary="Supermercado Central fue aprobado"
                    />
                    <Typography variant="body2" color="text.secondary">
                      Hace 4 horas
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Inventory /></ListItemIcon>
                    <ListItemText
                      primary="Productos actualizados"
                      secondary="25 productos actualizaron sus precios"
                    />
                    <Typography variant="body2" color="text.secondary">
                      Hace 6 horas
                    </Typography>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Users Tab */}
      {tabValue === ADMIN_TABS.USERS && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">Gestión de Usuarios</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => openUserDialog()}
            >
              Nuevo Usuario
            </Button>
          </Box>
          
          {/* Filters */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    placeholder="Buscar usuarios..."
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
                    <InputLabel>Rol</InputLabel>
                    <Select
                      value={filterRole}
                      label="Rol"
                      onChange={(e) => setFilterRole(e.target.value)}
                    >
                      <MenuItem value="">Todos los roles</MenuItem>
                      <MenuItem value={USER_ROLES.ADMINISTRATOR}>Administrador</MenuItem>
                      <MenuItem value={USER_ROLES.MERCHANT}>Comerciante</MenuItem>
                      <MenuItem value={USER_ROLES.CLIENT}>Cliente</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Estado</InputLabel>
                    <Select
                      value={filterStatus}
                      label="Estado"
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <MenuItem value="">Todos</MenuItem>
                      <MenuItem value={USER_STATUS.ACTIVE}>Activo</MenuItem>
                      <MenuItem value={USER_STATUS.INACTIVE}>Inactivo</MenuItem>
                      <MenuItem value={USER_STATUS.PENDING}>Pendiente</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Users Table */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Usuario</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Rol</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Registro</TableCell>
                  <TableCell>Último Acceso</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar src={user.avatar_url}>
                          {user.first_name?.[0] || user.username[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2">
                            {user.first_name} {user.last_name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            @{user.username}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={getRoleLabel(user.roles)}
                        color={getRoleColor(user.roles)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.status === USER_STATUS.ACTIVE ? 'Activo' : 'Inactivo'}
                        color={user.status === USER_STATUS.ACTIVE ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{formatDate(user.registered)}</TableCell>
                    <TableCell>{formatDate(user.last_login)}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={(e) => handleMenuClick(e, user.id, 'user')}
                      >
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Products Tab */}
      {tabValue === ADMIN_TABS.PRODUCTS && (
        <Box>
          <Typography variant="h5" gutterBottom>
            Gestión de Productos
          </Typography>
          
          {/* Filters */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={6}>
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
                    <InputLabel>Estado</InputLabel>
                    <Select
                      value={filterStatus}
                      label="Estado"
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <MenuItem value="">Todos</MenuItem>
                      <MenuItem value={PRODUCT_STATUS.PUBLISH}>Publicado</MenuItem>
                      <MenuItem value={PRODUCT_STATUS.DRAFT}>Borrador</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Products Table */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Producto</TableCell>
                  <TableCell>Tienda</TableCell>
                  <TableCell>Categoría</TableCell>
                  <TableCell>Precio</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          src={product.acf?.imagenes?.[0]}
                          variant="rounded"
                          sx={{ width: 50, height: 50 }}
                        >
                          <Inventory />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2">
                            {product.title.rendered}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            ID: {product.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {product.acf?.tienda_nombre || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={product.acf?.categoria || 'Sin categoría'}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        Bs. {product.acf?.precio_bs?.toLocaleString() || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={product.status === PRODUCT_STATUS.PUBLISH ? 'Publicado' : 'Borrador'}
                        color={product.status === PRODUCT_STATUS.PUBLISH ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={(e) => handleMenuClick(e, product.id, 'product')}
                      >
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Stores Tab */}
      {tabValue === ADMIN_TABS.STORES && (
        <Box>
          <Typography variant="h5" gutterBottom>
            Gestión de Tiendas
          </Typography>
          
          {/* Filters */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={6}>
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
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Estado</InputLabel>
                    <Select
                      value={filterStatus}
                      label="Estado"
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <MenuItem value="">Todos</MenuItem>
                      <MenuItem value={PRODUCT_STATUS.PUBLISH}>Publicado</MenuItem>
                      <MenuItem value={PRODUCT_STATUS.DRAFT}>Borrador</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Stores Table */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tienda</TableCell>
                  <TableCell>Categoría</TableCell>
                  <TableCell>Ubicación</TableCell>
                  <TableCell>Productos</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStores.map((store) => (
                  <TableRow key={store.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          src={store.acf?.imagen_portada}
                          variant="rounded"
                          sx={{ width: 50, height: 50 }}
                        >
                          <Store />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2">
                            {store.title.rendered}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            ID: {store.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={store.acf?.categoria || 'Sin categoría'}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {store.acf?.direccion || 'No especificada'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {store.acf?.total_productos || 0} productos
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={store.status === PRODUCT_STATUS.PUBLISH ? 'Publicado' : 'Borrador'}
                        color={store.status === PRODUCT_STATUS.PUBLISH ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={(e) => handleMenuClick(e, store.id, 'store')}
                      >
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Reports Tab */}
      {tabValue === ADMIN_TABS.REPORTS && (
        <Box>
          <Typography variant="h5" gutterBottom>
            Reportes y Análisis
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Reportes Disponibles
                  </Typography>
                  <List>
                    <ListItem button>
                      <ListItemIcon><Assignment /></ListItemIcon>
                      <ListItemText
                        primary="Reporte de Usuarios"
                        secondary="Estadísticas de registro y actividad"
                      />
                      <ListItemSecondaryAction>
                        <IconButton>
                          <Download />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem button>
                      <ListItemIcon><Assignment /></ListItemIcon>
                      <ListItemText
                        primary="Reporte de Productos"
                        secondary="Análisis de productos y precios"
                      />
                      <ListItemSecondaryAction>
                        <IconButton>
                          <Download />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem button>
                      <ListItemIcon><Assignment /></ListItemIcon>
                      <ListItemText
                        primary="Reporte de Tiendas"
                        secondary="Estadísticas de tiendas registradas"
                      />
                      <ListItemSecondaryAction>
                        <IconButton>
                          <Download />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Métricas del Sistema
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Usuarios Activos (últimos 30 días)
                    </Typography>
                    <Typography variant="h4" color="primary">
                      {systemStats.activeUsers}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Aprobaciones Pendientes
                    </Typography>
                    <Typography variant="h4" color="warning.main">
                      {systemStats.pendingApprovals}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Settings Tab */}
      {tabValue === ADMIN_TABS.SETTINGS && (
        <Box>
          <Typography variant="h5" gutterBottom>
            Configuración del Sistema
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6">Configuración General</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Título del Sitio"
                        value={systemSettings.site_title}
                        onChange={(e) => setSystemSettings({ ...systemSettings, site_title: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Descripción del Sitio"
                        value={systemSettings.site_description}
                        onChange={(e) => setSystemSettings({ ...systemSettings, site_description: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={systemSettings.maintenance_mode}
                            onChange={(e) => setSystemSettings({ ...systemSettings, maintenance_mode: e.target.checked })}
                          />
                        }
                        label="Modo de Mantenimiento"
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
              
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6">Configuración de Usuarios</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={systemSettings.user_registration}
                            onChange={(e) => setSystemSettings({ ...systemSettings, user_registration: e.target.checked })}
                          />
                        }
                        label="Permitir Registro de Usuarios"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={systemSettings.merchant_approval}
                            onChange={(e) => setSystemSettings({ ...systemSettings, merchant_approval: e.target.checked })}
                          />
                        }
                        label="Requerir Aprobación de Comerciantes"
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
              
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6">Límites del Sistema</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Máximo de Productos por Tienda"
                        type="number"
                        value={systemSettings.max_products_per_store}
                        onChange={(e) => setSystemSettings({ ...systemSettings, max_products_per_store: parseInt(e.target.value) })}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Máximo de Imágenes por Producto"
                        type="number"
                        value={systemSettings.max_images_per_product}
                        onChange={(e) => setSystemSettings({ ...systemSettings, max_images_per_product: parseInt(e.target.value) })}
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={() => showNotification('Configuración guardada', 'success')}
            >
              Guardar Configuración
            </Button>
          </Box>
        </Box>
      )}

      {/* User Dialog */}
      <Dialog open={userDialogOpen} onClose={() => setUserDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedUser ? 'Editar Usuario' : 'Nuevo Usuario'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre de Usuario"
                value={userForm.username}
                onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                required
                disabled={selectedUser !== null}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={userForm.email}
                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre"
                value={userForm.first_name}
                onChange={(e) => setUserForm({ ...userForm, first_name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Apellido"
                value={userForm.last_name}
                onChange={(e) => setUserForm({ ...userForm, last_name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Rol</InputLabel>
                <Select
                  value={userForm.roles[0] || ''}
                  label="Rol"
                  onChange={(e) => setUserForm({ ...userForm, roles: [e.target.value] })}
                >
                  <MenuItem value="client">Cliente</MenuItem>
                  <MenuItem value="merchant">Comerciante</MenuItem>
                  <MenuItem value="administrator">Administrador</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={userForm.status}
                  label="Estado"
                  onChange={(e) => setUserForm({ ...userForm, status: e.target.value })}
                >
                  <MenuItem value="active">Activo</MenuItem>
                  <MenuItem value="inactive">Inactivo</MenuItem>
                  <MenuItem value="pending">Pendiente</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUserDialogOpen(false)}>Cancelar</Button>
          <Button
            onClick={selectedUser ? handleUpdateUser : handleCreateUser}
            variant="contained"
            disabled={loading || !userForm.username || !userForm.email}
          >
            {loading ? 'Guardando...' : (selectedUser ? 'Actualizar' : 'Crear')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {selectedItemType === 'user' && [
          <MenuItemComponent
            key="edit"
            onClick={() => {
              const user = users.find(u => u.id === selectedItemId);
              openUserDialog(user);
              handleMenuClose();
            }}
          >
            <ListItemIcon><Edit /></ListItemIcon>
            Editar
          </MenuItemComponent>,
          <MenuItemComponent
            key="delete"
            onClick={() => {
              handleDeleteUser(selectedItemId);
              handleMenuClose();
            }}
          >
            <ListItemIcon><Delete /></ListItemIcon>
            Eliminar
          </MenuItemComponent>
        ]}
        
        {selectedItemType === 'product' && [
          <MenuItemComponent
            key="view"
            onClick={() => {
              navigate(`/producto/${selectedItemId}`);
              handleMenuClose();
            }}
          >
            <ListItemIcon><Visibility /></ListItemIcon>
            Ver
          </MenuItemComponent>,
          <MenuItemComponent
            key="toggle"
            onClick={() => {
              const product = products.find(p => p.id === selectedItemId);
              handleToggleStatus(selectedItemId, 'product', product?.status);
              handleMenuClose();
            }}
          >
            <ListItemIcon>{products.find(p => p.id === selectedItemId)?.status === 'publish' ? <VisibilityOff /> : <Visibility />}</ListItemIcon>
            {products.find(p => p.id === selectedItemId)?.status === 'publish' ? 'Ocultar' : 'Publicar'}
          </MenuItemComponent>,
          <MenuItemComponent
            key="delete"
            onClick={() => {
              handleDeleteProduct(selectedItemId);
              handleMenuClose();
            }}
          >
            <ListItemIcon><Delete /></ListItemIcon>
            Eliminar
          </MenuItemComponent>
        ]}
        
        {selectedItemType === 'store' && [
          <MenuItemComponent
            key="view"
            onClick={() => {
              navigate(`/tienda/${selectedItemId}`);
              handleMenuClose();
            }}
          >
            <ListItemIcon><Visibility /></ListItemIcon>
            Ver
          </MenuItemComponent>,
          <MenuItemComponent
            key="toggle"
            onClick={() => {
              const store = stores.find(s => s.id === selectedItemId);
              handleToggleStatus(selectedItemId, 'store', store?.status);
              handleMenuClose();
            }}
          >
            <ListItemIcon>{stores.find(s => s.id === selectedItemId)?.status === 'publish' ? <VisibilityOff /> : <Visibility />}</ListItemIcon>
            {stores.find(s => s.id === selectedItemId)?.status === 'publish' ? 'Ocultar' : 'Publicar'}
          </MenuItemComponent>,
          <MenuItemComponent
            key="delete"
            onClick={() => {
              handleDeleteStore(selectedItemId);
              handleMenuClose();
            }}
          >
            <ListItemIcon><Delete /></ListItemIcon>
            Eliminar
          </MenuItemComponent>
        ]}
      </Menu>
    </Container>
  );
};

export default AdminDashboard;