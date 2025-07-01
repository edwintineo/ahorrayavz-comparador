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
  Button,
  Chip,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Rating,
  Skeleton,
  Badge,
  Tooltip,
  Breadcrumbs,
  Link,
  Tab,
  Tabs
} from '@mui/material';
import {
  ShoppingBag,
  Search,
  FilterList,
  Sort,
  Visibility,
  Download,
  Print,
  Share,
  Refresh,
  Home,
  Store,
  LocalShipping,
  CheckCircle,
  Cancel,
  Schedule,
  Payment,
  Receipt,
  Star,
  RateReview,
  Replay,
  Support,
  Info,
  Warning,
  Error,
  Close,
  ExpandMore,
  Timeline as TimelineIcon,
  LocationOn,
  Phone,
  Email,
  CalendarToday,
  AttachMoney,
  CreditCard,
  LocalOffer,
  Inventory,
  DeliveryDining,
  AssignmentReturn,
  ThumbUp,
  ThumbDown,
  Message,
  Call,
  Help
} from '@mui/icons-material';
import { useStore } from '../store/useStore';
import { useNotification } from '../contexts/NotificationContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Orders = () => {
  const navigate = useNavigate();
  const { user } = useStore();
  const { showNotification } = useNotification();
  
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  const orderStatuses = [
    { id: '', name: 'Todos los estados', color: 'default' },
    { id: 'pending', name: 'Pendiente', color: 'warning' },
    { id: 'confirmed', name: 'Confirmado', color: 'info' },
    { id: 'processing', name: 'Procesando', color: 'primary' },
    { id: 'shipped', name: 'Enviado', color: 'secondary' },
    { id: 'delivered', name: 'Entregado', color: 'success' },
    { id: 'cancelled', name: 'Cancelado', color: 'error' },
    { id: 'returned', name: 'Devuelto', color: 'default' }
  ];

  const dateFilters = [
    { id: '', name: 'Todas las fechas' },
    { id: 'today', name: 'Hoy' },
    { id: 'week', name: 'Esta semana' },
    { id: 'month', name: 'Este mes' },
    { id: 'quarter', name: 'Últimos 3 meses' },
    { id: 'year', name: 'Este año' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Más Recientes' },
    { value: 'oldest', label: 'Más Antiguos' },
    { value: 'amount_high', label: 'Mayor Monto' },
    { value: 'amount_low', label: 'Menor Monto' },
    { value: 'status', label: 'Por Estado' }
  ];

  const tabLabels = [
    { label: 'Todos', icon: <ShoppingBag /> },
    { label: 'Pendientes', icon: <Schedule /> },
    { label: 'En Proceso', icon: <Inventory /> },
    { label: 'Entregados', icon: <CheckCircle /> },
    { label: 'Cancelados', icon: <Cancel /> }
  ];

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterAndSortOrders();
  }, [orders, searchQuery, statusFilter, dateFilter, sortBy, activeTab]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      
      // Mock orders data
      const mockOrders = Array.from({ length: 15 }, (_, index) => {
        const orderDate = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000);
        const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const total = Math.floor(Math.random() * 500) + 50;
        
        return {
          id: `ORD-${String(index + 1).padStart(6, '0')}`,
          orderNumber: `#${String(index + 1000).padStart(6, '0')}`,
          date: orderDate,
          status: status,
          total: total,
          items: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, itemIndex) => ({
            id: `item-${index}-${itemIndex}`,
            name: `Producto ${itemIndex + 1}`,
            image: '/api/placeholder/80/80',
            price: Math.floor(Math.random() * 100) + 20,
            quantity: Math.floor(Math.random() * 3) + 1,
            store: `Tienda ${Math.floor(Math.random() * 5) + 1}`,
            storeId: `store-${Math.floor(Math.random() * 5) + 1}`,
            canReview: status === 'delivered' && Math.random() > 0.5,
            reviewed: Math.random() > 0.7
          })),
          shippingAddress: {
            name: 'Juan Pérez',
            address: 'Av. Principal #123',
            city: 'Caracas',
            state: 'Distrito Capital',
            zipCode: '1010',
            phone: '+58 212 1234567'
          },
          paymentMethod: 'Tarjeta de Crédito',
          paymentStatus: Math.random() > 0.2 ? 'paid' : 'pending',
          shippingCost: Math.random() > 0.5 ? 0 : 10,
          tax: total * 0.16,
          discount: Math.random() > 0.7 ? Math.floor(total * 0.1) : 0,
          estimatedDelivery: new Date(orderDate.getTime() + Math.random() * 14 * 24 * 60 * 60 * 1000),
          trackingNumber: status === 'shipped' || status === 'delivered' ? `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}` : null,
          notes: Math.random() > 0.7 ? 'Entrega en horario de oficina' : '',
          timeline: [
            { status: 'pending', date: orderDate, description: 'Pedido realizado' },
            ...(status !== 'pending' ? [{ status: 'confirmed', date: new Date(orderDate.getTime() + 2 * 60 * 60 * 1000), description: 'Pedido confirmado' }] : []),
            ...(status === 'processing' || status === 'shipped' || status === 'delivered' ? [{ status: 'processing', date: new Date(orderDate.getTime() + 24 * 60 * 60 * 1000), description: 'Preparando pedido' }] : []),
            ...(status === 'shipped' || status === 'delivered' ? [{ status: 'shipped', date: new Date(orderDate.getTime() + 48 * 60 * 60 * 1000), description: 'Pedido enviado' }] : []),
            ...(status === 'delivered' ? [{ status: 'delivered', date: new Date(orderDate.getTime() + 72 * 60 * 60 * 1000), description: 'Pedido entregado' }] : []),
            ...(status === 'cancelled' ? [{ status: 'cancelled', date: new Date(orderDate.getTime() + 12 * 60 * 60 * 1000), description: 'Pedido cancelado' }] : [])
          ]
        };
      });
      
      setOrders(mockOrders);
    } catch (error) {
      showNotification('Error al cargar pedidos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortOrders = () => {
    let filtered = [...orders];
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(order => 
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    // Filter by date
    if (dateFilter) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.date);
        
        switch (dateFilter) {
          case 'today':
            return orderDate >= today;
          case 'week':
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            return orderDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
            return orderDate >= monthAgo;
          case 'quarter':
            const quarterAgo = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
            return orderDate >= quarterAgo;
          case 'year':
            const yearAgo = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000);
            return orderDate >= yearAgo;
          default:
            return true;
        }
      });
    }
    
    // Filter by tab
    switch (activeTab) {
      case 1: // Pending
        filtered = filtered.filter(order => order.status === 'pending');
        break;
      case 2: // Processing
        filtered = filtered.filter(order => ['confirmed', 'processing', 'shipped'].includes(order.status));
        break;
      case 3: // Delivered
        filtered = filtered.filter(order => order.status === 'delivered');
        break;
      case 4: // Cancelled
        filtered = filtered.filter(order => ['cancelled', 'returned'].includes(order.status));
        break;
      default:
        break;
    }
    
    // Sort orders
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date) - new Date(a.date);
        case 'oldest':
          return new Date(a.date) - new Date(b.date);
        case 'amount_high':
          return b.total - a.total;
        case 'amount_low':
          return a.total - b.total;
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });
    
    setFilteredOrders(filtered);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderDialog(true);
  };

  const handleReviewProduct = (product) => {
    setSelectedProduct(product);
    setShowReviewDialog(true);
  };

  const handleSubmitReview = () => {
    // Simulate review submission
    showNotification('Reseña enviada exitosamente', 'success');
    setShowReviewDialog(false);
    setReviewRating(5);
    setReviewComment('');
    setSelectedProduct(null);
  };

  const handleCancelOrder = (orderId) => {
    // Simulate order cancellation
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: 'cancelled' }
        : order
    ));
    showNotification('Pedido cancelado exitosamente', 'success');
  };

  const handleReorder = (order) => {
    // Simulate reorder
    showNotification('Productos agregados al carrito', 'success');
    navigate('/cart');
  };

  const getStatusColor = (status) => {
    const statusObj = orderStatuses.find(s => s.id === status);
    return statusObj ? statusObj.color : 'default';
  };

  const getStatusName = (status) => {
    const statusObj = orderStatuses.find(s => s.id === status);
    return statusObj ? statusObj.name : status;
  };

  const OrderCard = ({ order }) => (
    <Card sx={{ mb: 2, cursor: 'pointer' }} onClick={() => handleViewOrder(order)}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <Box>
              <Typography variant="h6" color="primary">
                {order.orderNumber}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {new Date(order.date).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={2}>
            <Chip 
              label={getStatusName(order.status)}
              color={getStatusColor(order.status)}
              size="small"
            />
          </Grid>
          
          <Grid item xs={12} sm={2}>
            <Typography variant="body2" color="text.secondary">
              {order.items.length} producto{order.items.length !== 1 ? 's' : ''}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={2}>
            <Typography variant="h6" color="primary">
              ${order.total.toFixed(2)}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={3}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button 
                size="small" 
                variant="outlined"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewOrder(order);
                }}
                startIcon={<Visibility />}
              >
                Ver
              </Button>
              
              {order.status === 'pending' && (
                <Button 
                  size="small" 
                  variant="outlined"
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCancelOrder(order.id);
                  }}
                  startIcon={<Cancel />}
                >
                  Cancelar
                </Button>
              )}
              
              {order.status === 'delivered' && (
                <Button 
                  size="small" 
                  variant="outlined"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReorder(order);
                  }}
                  startIcon={<Replay />}
                >
                  Reordenar
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
        
        {/* Order Items Preview */}
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {order.items.slice(0, 3).map((item, index) => (
              <Avatar 
                key={index}
                src={item.image} 
                sx={{ width: 40, height: 40 }}
                variant="rounded"
              />
            ))}
            {order.items.length > 3 && (
              <Avatar sx={{ width: 40, height: 40, bgcolor: 'grey.300' }} variant="rounded">
                <Typography variant="caption">+{order.items.length - 3}</Typography>
              </Avatar>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const OrderDialog = () => (
    <Dialog 
      open={showOrderDialog} 
      onClose={() => setShowOrderDialog(false)}
      maxWidth="lg"
      fullWidth
    >
      {selectedOrder && (
        <>
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h5">{selectedOrder.orderNumber}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Realizado el {new Date(selectedOrder.date).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Typography>
              </Box>
              <IconButton onClick={() => setShowOrderDialog(false)}>
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>
          
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                {/* Order Status */}
                <Paper sx={{ p: 2, mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ mr: 2 }}>Estado del Pedido</Typography>
                    <Chip 
                      label={getStatusName(selectedOrder.status)}
                      color={getStatusColor(selectedOrder.status)}
                    />
                  </Box>
                  
                  {selectedOrder.trackingNumber && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                      <Typography variant="body2">
                        Número de seguimiento: <strong>{selectedOrder.trackingNumber}</strong>
                      </Typography>
                    </Alert>
                  )}
                  
                  {/* Timeline */}
                  <Timeline>
                    {selectedOrder.timeline.map((event, index) => (
                      <TimelineItem key={index}>
                        <TimelineOppositeContent sx={{ flex: 0.3 }}>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(event.date).toLocaleDateString('es-ES', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </Typography>
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                          <TimelineDot color={getStatusColor(event.status)} />
                          {index < selectedOrder.timeline.length - 1 && <TimelineConnector />}
                        </TimelineSeparator>
                        <TimelineContent>
                          <Typography variant="body1">{event.description}</Typography>
                        </TimelineContent>
                      </TimelineItem>
                    ))}
                  </Timeline>
                </Paper>
                
                {/* Order Items */}
                <Paper sx={{ p: 2, mb: 3 }}>
                  <Typography variant="h6" gutterBottom>Productos</Typography>
                  <List>
                    {selectedOrder.items.map((item, index) => (
                      <React.Fragment key={index}>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar src={item.image} variant="rounded" />
                          </ListItemAvatar>
                          <ListItemText
                            primary={item.name}
                            secondary={
                              <Box>
                                <Typography variant="body2" color="text.secondary">
                                  {item.store} • Cantidad: {item.quantity}
                                </Typography>
                                <Typography variant="body2" color="primary" fontWeight="bold">
                                  ${item.price} c/u
                                </Typography>
                              </Box>
                            }
                          />
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="h6">
                              ${(item.price * item.quantity).toFixed(2)}
                            </Typography>
                            {selectedOrder.status === 'delivered' && item.canReview && !item.reviewed && (
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<RateReview />}
                                onClick={() => handleReviewProduct(item)}
                                sx={{ mt: 1 }}
                              >
                                Reseñar
                              </Button>
                            )}
                          </Box>
                        </ListItem>
                        {index < selectedOrder.items.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </Paper>
                
                {/* Shipping Address */}
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>Dirección de Envío</Typography>
                  <Typography variant="body1">{selectedOrder.shippingAddress.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedOrder.shippingAddress.address}<br/>
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}<br/>
                    {selectedOrder.shippingAddress.phone}
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={4}>
                {/* Order Summary */}
                <Paper sx={{ p: 2, mb: 2 }}>
                  <Typography variant="h6" gutterBottom>Resumen del Pedido</Typography>
                  <List>
                    <ListItem>
                      <ListItemText primary="Subtotal" />
                      <Typography>${(selectedOrder.total - selectedOrder.tax - selectedOrder.shippingCost + selectedOrder.discount).toFixed(2)}</Typography>
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Envío" />
                      <Typography>
                        {selectedOrder.shippingCost === 0 ? 'Gratis' : `$${selectedOrder.shippingCost.toFixed(2)}`}
                      </Typography>
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="IVA" />
                      <Typography>${selectedOrder.tax.toFixed(2)}</Typography>
                    </ListItem>
                    {selectedOrder.discount > 0 && (
                      <ListItem>
                        <ListItemText primary="Descuento" />
                        <Typography color="success.main">-${selectedOrder.discount.toFixed(2)}</Typography>
                      </ListItem>
                    )}
                    <Divider />
                    <ListItem>
                      <ListItemText 
                        primary="Total" 
                        primaryTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
                      />
                      <Typography variant="h6" fontWeight="bold" color="primary">
                        ${selectedOrder.total.toFixed(2)}
                      </Typography>
                    </ListItem>
                  </List>
                </Paper>
                
                {/* Payment Info */}
                <Paper sx={{ p: 2, mb: 2 }}>
                  <Typography variant="h6" gutterBottom>Información de Pago</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CreditCard sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">{selectedOrder.paymentMethod}</Typography>
                  </Box>
                  <Chip 
                    label={selectedOrder.paymentStatus === 'paid' ? 'Pagado' : 'Pendiente'}
                    color={selectedOrder.paymentStatus === 'paid' ? 'success' : 'warning'}
                    size="small"
                  />
                </Paper>
                
                {/* Actions */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Button 
                    variant="outlined" 
                    startIcon={<Download />}
                    fullWidth
                  >
                    Descargar Factura
                  </Button>
                  <Button 
                    variant="outlined" 
                    startIcon={<Print />}
                    fullWidth
                  >
                    Imprimir
                  </Button>
                  <Button 
                    variant="outlined" 
                    startIcon={<Support />}
                    fullWidth
                  >
                    Contactar Soporte
                  </Button>
                  {selectedOrder.status === 'delivered' && (
                    <Button 
                      variant="contained" 
                      startIcon={<Replay />}
                      fullWidth
                      onClick={() => handleReorder(selectedOrder)}
                    >
                      Reordenar
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
        </>
      )}
    </Dialog>
  );

  const ReviewDialog = () => (
    <Dialog 
      open={showReviewDialog} 
      onClose={() => setShowReviewDialog(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Escribir Reseña</Typography>
          <IconButton onClick={() => setShowReviewDialog(false)}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {selectedProduct && (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar 
                src={selectedProduct.image} 
                sx={{ width: 60, height: 60, mr: 2 }}
                variant="rounded"
              />
              <Box>
                <Typography variant="h6">{selectedProduct.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedProduct.store}
                </Typography>
              </Box>
            </Box>
            
            <Typography variant="subtitle1" gutterBottom>
              Calificación
            </Typography>
            <Rating
              value={reviewRating}
              onChange={(event, newValue) => setReviewRating(newValue)}
              size="large"
              sx={{ mb: 3 }}
            />
            
            <TextField
              fullWidth
              label="Comentario (opcional)"
              multiline
              rows={4}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Comparte tu experiencia con este producto..."
            />
          </Box>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={() => setShowReviewDialog(false)}>Cancelar</Button>
        <Button 
          variant="contained" 
          onClick={handleSubmitReview}
          startIcon={<Star />}
        >
          Enviar Reseña
        </Button>
      </DialogActions>
    </Dialog>
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {[...Array(5)].map((_, index) => (
            <Grid item xs={12} key={index}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Skeleton variant="text" width={120} height={24} sx={{ mr: 2 }} />
                    <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 1 }} />
                  </Box>
                  <Skeleton variant="text" width="60%" height={20} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="40%" height={20} />
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
        <Typography color="text.primary">Mis Pedidos</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ShoppingBag sx={{ fontSize: 32, mr: 2, color: 'primary.main' }} />
          <Typography variant="h4">
            Mis Pedidos
          </Typography>
          <Badge badgeContent={orders.length} color="primary" sx={{ ml: 2 }}>
            <Receipt />
          </Badge>
        </Box>
        
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={loadOrders}
        >
          Actualizar
        </Button>
      </Box>

      {/* Search and Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Buscar por número de pedido o producto..."
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
          <Grid item xs={12} sm={4} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Estado</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Estado"
              >
                {orderStatuses.map((status) => (
                  <MenuItem key={status.id} value={status.id}>
                    {status.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Fecha</InputLabel>
              <Select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                label="Fecha"
              >
                {dateFilters.map((filter) => (
                  <MenuItem key={filter.id} value={filter.id}>
                    {filter.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4} md={2}>
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
        {filteredOrders.length} pedido{filteredOrders.length !== 1 ? 's' : ''} encontrado{filteredOrders.length !== 1 ? 's' : ''}
      </Typography>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        filteredOrders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <ShoppingBag sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No se encontraron pedidos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Intenta ajustar tus filtros de búsqueda
          </Typography>
        </Paper>
      )}

      {/* Order Detail Dialog */}
      <OrderDialog />
      
      {/* Review Dialog */}
      <ReviewDialog />
    </Container>
  );
};

export default Orders;