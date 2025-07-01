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
  MenuItem as MenuItemComponent
} from '@mui/material';
import {
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
  People,
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
  Map
} from '@mui/icons-material';
import { useStore } from '../store/useStore';
import { useProducts, useStores, useAuth } from '../hooks/useWordPressAPI';
import { useNotification } from '../contexts/NotificationContext';
import { useErrorHandler } from '../hooks/useErrorHandler';

// Constants
const PRODUCT_STATUS = {
  PUBLISH: 'publish',
  DRAFT: 'draft',
  PRIVATE: 'private'
};

const MERCHANT_TABS = {
  DASHBOARD: 0,
  PRODUCTS: 1,
  STORE: 2,
  ANALYTICS: 3,
  SETTINGS: 4
};

const MerchantDashboard = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { user, logout, convertPrice } = useStore();
  const { createProduct, updateProduct, deleteProduct, searchProducts } = useProducts();
  const { updateStore } = useStores();
  const handleError = useErrorHandler();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [storeData, setStoreData] = useState(null);
  const [analytics, setAnalytics] = useState({
    totalProducts: 0,
    totalViews: 0,
    totalSales: 0,
    averageRating: 0,
    monthlyRevenue: 0,
    topProducts: []
  });
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [storeDialogOpen, setStoreDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  
  const [newProduct, setNewProduct] = useState({
    title: '',
    content: '',
    categoria: '',
    precio_bs: '',
    precio_usd: '',
    especificaciones: '',
    imagenes: [],
    disponible: true,
    destacado: false
  });
  
  const [storeInfo, setStoreInfo] = useState({
    title: '',
    content: '',
    categoria: '',
    direccion: '',
    telefono: '',
    email: '',
    horario: '',
    sitio_web: '',
    whatsapp: '',
    instagram: '',
    facebook: '',
    latitud: '',
    longitud: '',
    imagen_portada: ''
  });

  const categories = [
    'Alimentos y Bebidas',
    'Productos de Limpieza',
    'Cuidado Personal',
    'Hogar y Jardín',
    'Electrónicos',
    'Ropa y Accesorios',
    'Deportes y Recreación',
    'Salud y Bienestar',
    'Mascotas',
    'Otros'
  ];

  useEffect(() => {
    if (user && user.roles?.includes('merchant')) {
      loadMerchantData();
    } else {
      navigate('/dashboard');
    }
  }, [user]);

  const loadMerchantData = async () => {
    try {
      setLoading(true);
      
      // Load store data
      if (user.acf?.tienda_id) {
        // In real app, fetch store data
        setStoreData({
          id: user.acf.tienda_id,
          title: { rendered: user.acf?.nombre_tienda || 'Mi Tienda' },
          acf: {
            categoria: user.acf?.categoria_tienda || '',
            direccion: user.acf?.direccion || '',
            telefono: user.acf?.telefono || '',
            email: user.email || '',
            horario: user.acf?.horario || '',
            sitio_web: user.acf?.sitio_web || '',
            whatsapp: user.acf?.whatsapp || '',
            instagram: user.acf?.instagram || '',
            facebook: user.acf?.facebook || '',
            latitud: user.acf?.latitud || '',
            longitud: user.acf?.longitud || ''
          }
        });
        
        setStoreInfo({
          title: user.acf?.nombre_tienda || '',
          content: user.acf?.descripcion_tienda || '',
          categoria: user.acf?.categoria_tienda || '',
          direccion: user.acf?.direccion || '',
          telefono: user.acf?.telefono || '',
          email: user.email || '',
          horario: user.acf?.horario || '',
          sitio_web: user.acf?.sitio_web || '',
          whatsapp: user.acf?.whatsapp || '',
          instagram: user.acf?.instagram || '',
          facebook: user.acf?.facebook || '',
          latitud: user.acf?.latitud || '',
          longitud: user.acf?.longitud || '',
          imagen_portada: user.acf?.imagen_portada || ''
        });
      }
      
      // Load products
      await loadProducts();
      
      // Load analytics
      loadAnalytics();
      
    } catch (error) {
      console.error('Error loading merchant data:', error);
      showNotification('Error al cargar los datos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const result = await searchProducts({
        author: user.id,
        search: searchQuery,
        categoria: categoryFilter,
        status: statusFilter || 'any',
        per_page: 50
      });
      setProducts(result.products || []);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const loadAnalytics = () => {
    // Mock analytics data (in real app, fetch from API)
    setAnalytics({
      totalProducts: products.length,
      totalViews: 1250,
      totalSales: 89,
      averageRating: 4.3,
      monthlyRevenue: 15420.50,
      topProducts: [
        { name: 'Arroz Diana 1kg', sales: 25, revenue: 875.00 },
        { name: 'Aceite Mazeite 1L', sales: 18, revenue: 720.00 },
        { name: 'Azúcar Blanca 1kg', sales: 15, revenue: 450.00 }
      ]
    });
  };

  useEffect(() => {
    if (user) {
      loadProducts();
    }
  }, [searchQuery, categoryFilter, statusFilter]);

  const handleCreateProduct = useCallback(async () => {
    try {
      setLoading(true);
      
      const productData = {
        ...newProduct,
        status: PRODUCT_STATUS.PUBLISH,
        acf: {
          categoria: newProduct.categoria,
          precio_bs: parseFloat(newProduct.precio_bs) || 0,
          precio_usd: parseFloat(newProduct.precio_usd) || 0,
          especificaciones: newProduct.especificaciones,
          imagenes: newProduct.imagenes,
          disponible: newProduct.disponible,
          destacado: newProduct.destacado,
          tienda_id: storeData?.id || user.acf?.tienda_id
        }
      };
      
      await createProduct(productData);
      setProductDialogOpen(false);
      setNewProduct({
        title: '',
        content: '',
        categoria: '',
        precio_bs: '',
        precio_usd: '',
        especificaciones: '',
        imagenes: [],
        disponible: true,
        destacado: false
      });
      
      await loadProducts();
      showNotification('Producto creado exitosamente', 'success');
      
    } catch (error) {
      handleError(error, 'Error al crear el producto');
    } finally {
      setLoading(false);
    }
  }, [newProduct, storeData?.id, user.acf?.tienda_id, createProduct, loadProducts, showNotification, handleError]);

  const handleUpdateProduct = useCallback(async () => {
    try {
      setLoading(true);
      
      const productData = {
        ...newProduct,
        acf: {
          categoria: newProduct.categoria,
          precio_bs: parseFloat(newProduct.precio_bs) || 0,
          precio_usd: parseFloat(newProduct.precio_usd) || 0,
          especificaciones: newProduct.especificaciones,
          imagenes: newProduct.imagenes,
          disponible: newProduct.disponible,
          destacado: newProduct.destacado
        }
      };
      
      await updateProduct(selectedProduct.id, productData);
      setProductDialogOpen(false);
      setSelectedProduct(null);
      
      await loadProducts();
      showNotification('Producto actualizado exitosamente', 'success');
      
    } catch (error) {
      handleError(error, 'Error al actualizar el producto');
    } finally {
      setLoading(false);
    }
  }, [newProduct, selectedProduct?.id, updateProduct, loadProducts, showNotification, handleError]);

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

  const handleUpdateStore = useCallback(async () => {
    try {
      setLoading(true);
      
      const storeUpdateData = {
        title: storeInfo.title,
        content: storeInfo.content,
        acf: {
          categoria: storeInfo.categoria,
          direccion: storeInfo.direccion,
          telefono: storeInfo.telefono,
          email: storeInfo.email,
          horario: storeInfo.horario,
          sitio_web: storeInfo.sitio_web,
          whatsapp: storeInfo.whatsapp,
          instagram: storeInfo.instagram,
          facebook: storeInfo.facebook,
          latitud: parseFloat(storeInfo.latitud) || 0,
          longitud: parseFloat(storeInfo.longitud) || 0,
          imagen_portada: storeInfo.imagen_portada
        }
      };
      
      await updateStore(storeData.id, storeUpdateData);
      setStoreDialogOpen(false);
      showNotification('Información de la tienda actualizada', 'success');
      
    } catch (error) {
      handleError(error, 'Error al actualizar la tienda');
    } finally {
      setLoading(false);
    }
  }, [storeInfo, storeData?.id, updateStore, showNotification, handleError]);

  const openProductDialog = useCallback((product = null) => {
    if (product) {
      setSelectedProduct(product);
      setNewProduct({
        title: product.title.rendered,
        content: product.content.rendered,
        categoria: product.acf?.categoria || '',
        precio_bs: product.acf?.precio_bs?.toString() || '',
        precio_usd: product.acf?.precio_usd?.toString() || '',
        especificaciones: product.acf?.especificaciones || '',
        imagenes: product.acf?.imagenes || [],
        disponible: product.acf?.disponible !== false,
        destacado: product.acf?.destacado || false
      });
    } else {
      setSelectedProduct(null);
      setNewProduct({
        title: '',
        content: '',
        categoria: '',
        precio_bs: '',
        precio_usd: '',
        especificaciones: '',
        imagenes: [],
        disponible: true,
        destacado: false
      });
    }
    setProductDialogOpen(true);
  }, []);

  const handleMenuClick = useCallback((event, productId) => {
    setAnchorEl(event.currentTarget);
    setSelectedProductId(productId);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
    setSelectedProductId(null);
  }, []);

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

  const handleLogout = useCallback(() => {
    logout();
    navigate('/');
    showNotification('Sesión cerrada exitosamente', 'info');
  }, [logout, navigate, showNotification]);

  // Memoized computations
  const memoizedAnalytics = useMemo(() => ({
    totalProducts: products.length,
    totalViews: analytics.totalViews,
    totalSales: analytics.totalSales,
    averageRating: analytics.averageRating,
    monthlyRevenue: analytics.monthlyRevenue,
    topProducts: analytics.topProducts
  }), [products.length, analytics]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = !searchQuery || 
        product.title.rendered.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.content.rendered.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = !categoryFilter || 
        product.acf?.categoria === categoryFilter;
      
      const matchesStatus = !statusFilter || 
        product.status === statusFilter;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchQuery, categoryFilter, statusFilter]);

  if (!user || !user.roles?.includes('merchant')) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">
          No tienes permisos para acceder al dashboard de comercio.
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
            sx={{ width: 64, height: 64, bgcolor: 'primary.main' }}
            src={user.avatar_url}
          >
            <Store />
          </Avatar>
          <Box>
            <Typography variant="h4">
              {storeData?.title?.rendered || 'Mi Tienda'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Dashboard de Comercio
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

      {/* Analytics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Inventory color="primary" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">{memoizedAnalytics.totalProducts}</Typography>
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
                <Visibility color="info" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">{memoizedAnalytics.totalViews}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Visualizaciones
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
                  <Typography variant="h4">{memoizedAnalytics.totalSales}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ventas
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
                <AttachMoney color="warning" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">
                    {formatPrice(memoizedAnalytics.monthlyRevenue, 'bs').replace('Bs.', '')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ingresos (Bs.)
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab icon={<Inventory />} label="Productos" />
          <Tab icon={<Analytics />} label="Estadísticas" />
          <Tab icon={<Store />} label="Mi Tienda" />
          <Tab icon={<Settings />} label="Configuración" />
        </Tabs>
      </Box>

      {/* Products Tab */}
      {tabValue === MERCHANT_TABS.PRODUCTS && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">Gestión de Productos</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => openProductDialog()}
            >
              Nuevo Producto
            </Button>
          </Box>
          
          {/* Filters */}
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
                    <InputLabel>Estado</InputLabel>
                    <Select
                      value={statusFilter}
                      label="Estado"
                      onChange={(e) => setStatusFilter(e.target.value)}
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
                  <TableCell>Categoría</TableCell>
                  <TableCell>Precio (Bs.)</TableCell>
                  <TableCell>Precio (USD)</TableCell>
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
                      <Chip
                        label={product.acf?.categoria || 'Sin categoría'}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      {formatPrice(product.acf?.precio_bs, 'bs')}
                    </TableCell>
                    <TableCell>
                      {formatPrice(product.acf?.precio_usd, 'usd')}
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
                        onClick={(e) => handleMenuClick(e, product.id)}
                      >
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {filteredProducts.length === 0 && (
            <Alert severity="info" sx={{ mt: 2 }}>
              {products.length === 0 
                ? 'No tienes productos registrados. ¡Crea tu primer producto para comenzar!' 
                : 'No se encontraron productos con los filtros aplicados.'}
            </Alert>
          )}
        </Box>
      )}

      {/* Analytics Tab */}
      {tabValue === MERCHANT_TABS.ANALYTICS && (
        <Box>
          <Typography variant="h5" gutterBottom>
            Estadísticas y Análisis
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Productos Más Vendidos
                  </Typography>
                  <List>
                    {memoizedAnalytics.topProducts.map((product, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={product.name}
                          secondary={`${product.sales} ventas`}
                        />
                        <ListItemSecondaryAction>
                          <Typography variant="body2" color="primary">
                            {formatPrice(product.revenue, 'bs')}
                          </Typography>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Calificación Promedio
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Typography variant="h3" color="primary">
                      {memoizedAnalytics.averageRating}
                    </Typography>
                    <Star color="warning" />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Basado en las reseñas de clientes
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Store Tab */}
      {tabValue === MERCHANT_TABS.STORE && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">Información de la Tienda</Typography>
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={() => setStoreDialogOpen(true)}
            >
              Editar Tienda
            </Button>
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Información General
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon><Store /></ListItemIcon>
                      <ListItemText
                        primary="Nombre"
                        secondary={storeInfo.title || 'No especificado'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><LocationOn /></ListItemIcon>
                      <ListItemText
                        primary="Dirección"
                        secondary={storeInfo.direccion || 'No especificada'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><Phone /></ListItemIcon>
                      <ListItemText
                        primary="Teléfono"
                        secondary={storeInfo.telefono || 'No especificado'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><Email /></ListItemIcon>
                      <ListItemText
                        primary="Email"
                        secondary={storeInfo.email || 'No especificado'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><Schedule /></ListItemIcon>
                      <ListItemText
                        primary="Horario"
                        secondary={storeInfo.horario || 'No especificado'}
                      />
                    </ListItem>
                  </List>
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
                      startIcon={<Visibility />}
                      onClick={() => navigate(`/tienda/${storeData?.id}`)}
                      fullWidth
                    >
                      Ver Tienda Pública
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Share />}
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/tienda/${storeData?.id}`);
                        showNotification('Enlace copiado', 'success');
                      }}
                      fullWidth
                    >
                      Compartir Tienda
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Map />}
                      onClick={() => {
                        if (storeInfo.latitud && storeInfo.longitud) {
                          window.open(`https://www.google.com/maps?q=${storeInfo.latitud},${storeInfo.longitud}`, '_blank');
                        }
                      }}
                      fullWidth
                      disabled={!storeInfo.latitud || !storeInfo.longitud}
                    >
                      Ver en Mapa
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Settings Tab */}
      {tabValue === MERCHANT_TABS.SETTINGS && (
        <Box>
          <Typography variant="h5" gutterBottom>
            Configuración
          </Typography>
          
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Configuración de la Cuenta
              </Typography>
              <Alert severity="info">
                Para cambiar la configuración de tu cuenta, contacta al administrador del sistema.
              </Alert>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Product Dialog */}
      <Dialog open={productDialogOpen} onClose={() => setProductDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedProduct ? 'Editar Producto' : 'Nuevo Producto'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre del Producto"
                value={newProduct.title}
                onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                multiline
                rows={3}
                value={newProduct.content}
                onChange={(e) => setNewProduct({ ...newProduct, content: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={newProduct.categoria}
                  label="Categoría"
                  onChange={(e) => setNewProduct({ ...newProduct, categoria: e.target.value })}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Especificaciones"
                value={newProduct.especificaciones}
                onChange={(e) => setNewProduct({ ...newProduct, especificaciones: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Precio en Bolívares"
                type="number"
                value={newProduct.precio_bs}
                onChange={(e) => setNewProduct({ ...newProduct, precio_bs: e.target.value })}
                InputProps={{
                  startAdornment: <InputAdornment position="start">Bs.</InputAdornment>
                }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Precio en Dólares"
                type="number"
                value={newProduct.precio_usd}
                onChange={(e) => setNewProduct({ ...newProduct, precio_usd: e.target.value })}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={newProduct.disponible}
                      onChange={(e) => setNewProduct({ ...newProduct, disponible: e.target.checked })}
                    />
                  }
                  label="Disponible"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={newProduct.destacado}
                      onChange={(e) => setNewProduct({ ...newProduct, destacado: e.target.checked })}
                    />
                  }
                  label="Producto Destacado"
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProductDialogOpen(false)}>Cancelar</Button>
          <Button
            onClick={selectedProduct ? handleUpdateProduct : handleCreateProduct}
            variant="contained"
            disabled={loading || !newProduct.title || !newProduct.categoria || !newProduct.precio_bs}
          >
            {loading ? 'Guardando...' : (selectedProduct ? 'Actualizar' : 'Crear')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Store Dialog */}
      <Dialog open={storeDialogOpen} onClose={() => setStoreDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Editar Información de la Tienda</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre de la Tienda"
                value={storeInfo.title}
                onChange={(e) => setStoreInfo({ ...storeInfo, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={storeInfo.categoria}
                  label="Categoría"
                  onChange={(e) => setStoreInfo({ ...storeInfo, categoria: e.target.value })}
                >
                  <MenuItem value="Supermercado">Supermercado</MenuItem>
                  <MenuItem value="Farmacia">Farmacia</MenuItem>
                  <MenuItem value="Ferretería">Ferretería</MenuItem>
                  <MenuItem value="Panadería">Panadería</MenuItem>
                  <MenuItem value="Carnicería">Carnicería</MenuItem>
                  <MenuItem value="Tienda de Conveniencia">Tienda de Conveniencia</MenuItem>
                  <MenuItem value="Otros">Otros</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                multiline
                rows={3}
                value={storeInfo.content}
                onChange={(e) => setStoreInfo({ ...storeInfo, content: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Dirección"
                value={storeInfo.direccion}
                onChange={(e) => setStoreInfo({ ...storeInfo, direccion: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Teléfono"
                value={storeInfo.telefono}
                onChange={(e) => setStoreInfo({ ...storeInfo, telefono: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={storeInfo.email}
                onChange={(e) => setStoreInfo({ ...storeInfo, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Horario de Atención"
                value={storeInfo.horario}
                onChange={(e) => setStoreInfo({ ...storeInfo, horario: e.target.value })}
                placeholder="Ej: Lun-Vie 8:00-18:00, Sáb 8:00-14:00"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Sitio Web"
                value={storeInfo.sitio_web}
                onChange={(e) => setStoreInfo({ ...storeInfo, sitio_web: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="WhatsApp"
                value={storeInfo.whatsapp}
                onChange={(e) => setStoreInfo({ ...storeInfo, whatsapp: e.target.value })}
                placeholder="Ej: +584121234567"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Instagram"
                value={storeInfo.instagram}
                onChange={(e) => setStoreInfo({ ...storeInfo, instagram: e.target.value })}
                placeholder="Ej: @mitienda"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Latitud"
                type="number"
                value={storeInfo.latitud}
                onChange={(e) => setStoreInfo({ ...storeInfo, latitud: e.target.value })}
                placeholder="Ej: 10.4806"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Longitud"
                type="number"
                value={storeInfo.longitud}
                onChange={(e) => setStoreInfo({ ...storeInfo, longitud: e.target.value })}
                placeholder="Ej: -66.9036"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStoreDialogOpen(false)}>Cancelar</Button>
          <Button
            onClick={handleUpdateStore}
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Product Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItemComponent
          onClick={() => {
            const product = products.find(p => p.id === selectedProductId);
            openProductDialog(product);
            handleMenuClose();
          }}
        >
          <ListItemIcon><Edit /></ListItemIcon>
          Editar
        </MenuItemComponent>
        <MenuItemComponent
          onClick={() => {
            navigate(`/producto/${selectedProductId}`);
            handleMenuClose();
          }}
        >
          <ListItemIcon><Visibility /></ListItemIcon>
          Ver
        </MenuItemComponent>
        <MenuItemComponent
          onClick={() => {
            handleDeleteProduct(selectedProductId);
            handleMenuClose();
          }}
        >
          <ListItemIcon><Delete /></ListItemIcon>
          Eliminar
        </MenuItemComponent>
      </Menu>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => openProductDialog()}
      >
        <Add />
      </Fab>
    </Container>
  );
};

export default MerchantDashboard;