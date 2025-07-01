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
  IconButton,
  TextField,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  Alert,
  Chip,
  Avatar,
  Badge,
  Tooltip,
  Breadcrumbs,
  Link,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Skeleton
} from '@mui/material';
import {
  ShoppingCart,
  Add,
  Remove,
  Delete,
  Clear,
  Home,
  Store,
  LocalShipping,
  Payment,
  Security,
  CheckCircle,
  Error,
  Warning,
  Info,
  Share,
  Print,
  Save,
  Refresh,
  ArrowBack,
  ArrowForward,
  CreditCard,
  AccountBalanceWallet,
  LocalAtm,
  Phone,
  Email,
  LocationOn,
  Schedule,
  Discount,
  LocalOffer,
  CardGiftcard,
  ExpandMore,
  Close,
  ShoppingBag,
  Favorite,
  Compare,
  VerifiedUser,
  AttachMoney,
  PercentIcon
} from '@mui/icons-material';
import { useStore } from '../store/useStore';
import { useNotification } from '../contexts/NotificationContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Cart = () => {
  const navigate = useNavigate();
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart, 
    user,
    addToFavorites
  } = useStore();
  const { showNotification } = useNotification();
  
  const [loading, setLoading] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(0);
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Venezuela'
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });
  const [orderNotes, setOrderNotes] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [groupByStore, setGroupByStore] = useState(true);
  const [showSummary, setShowSummary] = useState(false);

  const checkoutSteps = [
    'Revisar Carrito',
    'Información de Envío',
    'Método de Pago',
    'Confirmación'
  ];

  const paymentMethods = [
    { id: 'card', name: 'Tarjeta de Crédito/Débito', icon: <CreditCard /> },
    { id: 'wallet', name: 'Billetera Digital', icon: <AccountBalanceWallet /> },
    { id: 'transfer', name: 'Transferencia Bancaria', icon: <LocalAtm /> },
    { id: 'cash', name: 'Pago Contra Entrega', icon: <AttachMoney /> }
  ];

  const availableCoupons = [
    { code: 'SAVE10', discount: 10, type: 'percentage', minAmount: 50 },
    { code: 'WELCOME20', discount: 20, type: 'percentage', minAmount: 100 },
    { code: 'SHIP5', discount: 5, type: 'fixed', minAmount: 30 },
    { code: 'FIRST15', discount: 15, type: 'percentage', minAmount: 75 }
  ];

  useEffect(() => {
    // Select all items by default
    setSelectedItems(cart.map(item => item.id));
  }, [cart]);

  const calculateSubtotal = () => {
    return cart
      .filter(item => selectedItems.includes(item.id))
      .reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    if (subtotal > 100) return 0; // Free shipping over $100
    return 10;
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.16; // 16% IVA
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    
    const subtotal = calculateSubtotal();
    if (subtotal < appliedCoupon.minAmount) return 0;
    
    if (appliedCoupon.type === 'percentage') {
      return subtotal * (appliedCoupon.discount / 100);
    } else {
      return appliedCoupon.discount;
    }
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() + calculateTax() - calculateDiscount();
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(itemId);
      return;
    }
    updateCartQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
    setSelectedItems(prev => prev.filter(id => id !== itemId));
    showNotification('Producto eliminado del carrito', 'success');
  };

  const handleClearCart = () => {
    clearCart();
    setSelectedItems([]);
    showNotification('Carrito vaciado', 'success');
  };

  const handleApplyCoupon = () => {
    const coupon = availableCoupons.find(c => c.code === couponCode.toUpperCase());
    
    if (!coupon) {
      showNotification('Código de cupón inválido', 'error');
      return;
    }
    
    const subtotal = calculateSubtotal();
    if (subtotal < coupon.minAmount) {
      showNotification(`Monto mínimo requerido: $${coupon.minAmount}`, 'warning');
      return;
    }
    
    setAppliedCoupon(coupon);
    showNotification('Cupón aplicado exitosamente', 'success');
    setCouponCode('');
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    showNotification('Cupón removido', 'info');
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === cart.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cart.map(item => item.id));
    }
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      showNotification('Selecciona al menos un producto para continuar', 'warning');
      return;
    }
    setShowCheckoutDialog(true);
  };

  const handleNextStep = () => {
    if (checkoutStep < checkoutSteps.length - 1) {
      setCheckoutStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (checkoutStep > 0) {
      setCheckoutStep(prev => prev - 1);
    }
  };

  const handlePlaceOrder = async () => {
    if (!agreeTerms) {
      showNotification('Debes aceptar los términos y condiciones', 'warning');
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear selected items from cart
      selectedItems.forEach(itemId => removeFromCart(itemId));
      
      setShowCheckoutDialog(false);
      setCheckoutStep(0);
      showNotification('¡Pedido realizado exitosamente!', 'success');
      navigate('/orders');
    } catch (error) {
      showNotification('Error al procesar el pedido', 'error');
    } finally {
      setLoading(false);
    }
  };

  const groupCartByStore = () => {
    const grouped = {};
    cart.forEach(item => {
      const storeId = item.storeId || 'unknown';
      if (!grouped[storeId]) {
        grouped[storeId] = {
          storeName: item.storeName || 'Tienda Desconocida',
          items: []
        };
      }
      grouped[storeId].items.push(item);
    });
    return grouped;
  };

  const CartItem = ({ item, showStore = false }) => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={1}>
            <Checkbox
              checked={selectedItems.includes(item.id)}
              onChange={() => handleSelectItem(item.id)}
            />
          </Grid>
          <Grid item xs={2}>
            <CardMedia
              component="img"
              height={80}
              image={item.image || '/api/placeholder/80/80'}
              alt={item.name}
              sx={{ borderRadius: 1, objectFit: 'cover' }}
            />
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6" gutterBottom>
              {item.name}
            </Typography>
            {showStore && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Store sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {item.storeName}
                </Typography>
              </Box>
            )}
            <Typography variant="body2" color="text.secondary">
              {item.description?.substring(0, 100)}...
            </Typography>
            {item.features && (
              <Box sx={{ mt: 1 }}>
                {item.features.slice(0, 2).map((feature, index) => (
                  <Chip key={index} label={feature} size="small" sx={{ mr: 0.5 }} />
                ))}
              </Box>
            )}
          </Grid>
          <Grid item xs={2}>
            <Typography variant="h6" color="primary">
              ${item.price}
            </Typography>
            {item.originalPrice && item.originalPrice > item.price && (
              <Typography 
                variant="body2" 
                sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
              >
                ${item.originalPrice}
              </Typography>
            )}
          </Grid>
          <Grid item xs={2}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton 
                size="small" 
                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
              >
                <Remove />
              </IconButton>
              <TextField
                size="small"
                value={item.quantity}
                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                inputProps={{ 
                  style: { textAlign: 'center', width: '60px' },
                  min: 1
                }}
                type="number"
              />
              <IconButton 
                size="small" 
                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
              >
                <Add />
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={1}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Tooltip title="Eliminar">
                <IconButton 
                  color="error" 
                  onClick={() => handleRemoveItem(item.id)}
                >
                  <Delete />
                </IconButton>
              </Tooltip>
              <Tooltip title="Agregar a favoritos">
                <IconButton 
                  onClick={() => {
                    addToFavorites(item);
                    showNotification('Agregado a favoritos', 'success');
                  }}
                >
                  <Favorite />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const OrderSummary = () => (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Resumen del Pedido
      </Typography>
      
      <List>
        <ListItem>
          <ListItemText primary="Subtotal" />
          <Typography>${calculateSubtotal().toFixed(2)}</Typography>
        </ListItem>
        <ListItem>
          <ListItemText primary="Envío" />
          <Typography>
            {calculateShipping() === 0 ? 'Gratis' : `$${calculateShipping().toFixed(2)}`}
          </Typography>
        </ListItem>
        <ListItem>
          <ListItemText primary="IVA (16%)" />
          <Typography>${calculateTax().toFixed(2)}</Typography>
        </ListItem>
        {appliedCoupon && (
          <ListItem>
            <ListItemText 
              primary={`Descuento (${appliedCoupon.code})`}
              secondary={`${appliedCoupon.discount}${appliedCoupon.type === 'percentage' ? '%' : ' USD'} off`}
            />
            <Typography color="success.main">
              -${calculateDiscount().toFixed(2)}
            </Typography>
            <ListItemSecondaryAction>
              <IconButton size="small" onClick={handleRemoveCoupon}>
                <Close />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        )}
        <Divider sx={{ my: 1 }} />
        <ListItem>
          <ListItemText 
            primary="Total" 
            primaryTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
          />
          <Typography variant="h6" fontWeight="bold" color="primary">
            ${calculateTotal().toFixed(2)}
          </Typography>
        </ListItem>
      </List>
      
      {/* Coupon Section */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Código de Descuento
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            size="small"
            placeholder="Ingresa código"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            fullWidth
          />
          <Button 
            variant="outlined" 
            onClick={handleApplyCoupon}
            disabled={!couponCode}
          >
            Aplicar
          </Button>
        </Box>
        
        {/* Available Coupons */}
        <Accordion sx={{ mt: 2 }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="body2">Cupones Disponibles</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {availableCoupons.map((coupon) => (
              <Chip
                key={coupon.code}
                label={`${coupon.code} - ${coupon.discount}${coupon.type === 'percentage' ? '%' : '$'} off`}
                size="small"
                sx={{ mr: 1, mb: 1 }}
                onClick={() => setCouponCode(coupon.code)}
              />
            ))}
          </AccordionDetails>
        </Accordion>
      </Box>
    </Paper>
  );

  const CheckoutDialog = () => (
    <Dialog 
      open={showCheckoutDialog} 
      onClose={() => setShowCheckoutDialog(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Finalizar Compra</Typography>
          <IconButton onClick={() => setShowCheckoutDialog(false)}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Stepper activeStep={checkoutStep} sx={{ mb: 4 }}>
          {checkoutSteps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {checkoutStep === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Revisar Productos
            </Typography>
            {cart.filter(item => selectedItems.includes(item.id)).map((item) => (
              <CartItem key={item.id} item={item} showStore />
            ))}
          </Box>
        )}
        
        {checkoutStep === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Información de Envío
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nombre Completo"
                  value={shippingInfo.fullName}
                  onChange={(e) => setShippingInfo({...shippingInfo, fullName: e.target.value})}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={shippingInfo.email}
                  onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  value={shippingInfo.phone}
                  onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Ciudad"
                  value={shippingInfo.city}
                  onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Dirección"
                  value={shippingInfo.address}
                  onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                  required
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Estado"
                  value={shippingInfo.state}
                  onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Código Postal"
                  value={shippingInfo.zipCode}
                  onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
                />
              </Grid>
            </Grid>
          </Box>
        )}
        
        {checkoutStep === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Método de Pago
            </Typography>
            <RadioGroup
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              {paymentMethods.map((method) => (
                <FormControlLabel
                  key={method.id}
                  value={method.id}
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {method.icon}
                      <Typography sx={{ ml: 1 }}>{method.name}</Typography>
                    </Box>
                  }
                />
              ))}
            </RadioGroup>
            
            {paymentMethod === 'card' && (
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Número de Tarjeta"
                    value={paymentInfo.cardNumber}
                    onChange={(e) => setPaymentInfo({...paymentInfo, cardNumber: e.target.value})}
                    placeholder="1234 5678 9012 3456"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Fecha de Vencimiento"
                    value={paymentInfo.expiryDate}
                    onChange={(e) => setPaymentInfo({...paymentInfo, expiryDate: e.target.value})}
                    placeholder="MM/YY"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="CVV"
                    value={paymentInfo.cvv}
                    onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value})}
                    placeholder="123"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nombre en la Tarjeta"
                    value={paymentInfo.cardName}
                    onChange={(e) => setPaymentInfo({...paymentInfo, cardName: e.target.value})}
                  />
                </Grid>
              </Grid>
            )}
          </Box>
        )}
        
        {checkoutStep === 3 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Confirmación del Pedido
            </Typography>
            
            <Alert severity="info" sx={{ mb: 2 }}>
              Revisa todos los detalles antes de confirmar tu pedido
            </Alert>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <Paper sx={{ p: 2, mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Productos ({selectedItems.length})
                  </Typography>
                  {cart.filter(item => selectedItems.includes(item.id)).map((item) => (
                    <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography>{item.name} x {item.quantity}</Typography>
                      <Typography>${(item.price * item.quantity).toFixed(2)}</Typography>
                    </Box>
                  ))}
                </Paper>
                
                <Paper sx={{ p: 2, mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Información de Envío
                  </Typography>
                  <Typography variant="body2">
                    {shippingInfo.fullName}<br/>
                    {shippingInfo.address}<br/>
                    {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}<br/>
                    {shippingInfo.phone}
                  </Typography>
                </Paper>
                
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Método de Pago
                  </Typography>
                  <Typography variant="body2">
                    {paymentMethods.find(m => m.id === paymentMethod)?.name}
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <OrderSummary />
              </Grid>
            </Grid>
            
            <TextField
              fullWidth
              label="Notas del Pedido (Opcional)"
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              multiline
              rows={3}
              sx={{ mt: 2, mb: 2 }}
            />
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                />
              }
              label={
                <Typography variant="body2">
                  Acepto los{' '}
                  <Link href="/terms" target="_blank">
                    términos y condiciones
                  </Link>
                  {' '}y la{' '}
                  <Link href="/privacy" target="_blank">
                    política de privacidad
                  </Link>
                </Typography>
              }
            />
          </Box>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={() => setShowCheckoutDialog(false)}>Cancelar</Button>
        {checkoutStep > 0 && (
          <Button onClick={handlePrevStep} startIcon={<ArrowBack />}>
            Anterior
          </Button>
        )}
        {checkoutStep < checkoutSteps.length - 1 ? (
          <Button 
            variant="contained" 
            onClick={handleNextStep}
            endIcon={<ArrowForward />}
          >
            Siguiente
          </Button>
        ) : (
          <Button 
            variant="contained" 
            onClick={handlePlaceOrder}
            disabled={!agreeTerms || loading}
            startIcon={loading ? <LoadingSpinner size={20} /> : <CheckCircle />}
          >
            {loading ? 'Procesando...' : 'Confirmar Pedido'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );

  if (cart.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
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
          <Typography color="text.primary">Carrito</Typography>
        </Breadcrumbs>
        
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <ShoppingCart sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Tu carrito está vacío
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Agrega algunos productos para comenzar tu compra
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => navigate('/')}
            startIcon={<ShoppingBag />}
          >
            Continuar Comprando
          </Button>
        </Paper>
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
        <Typography color="text.primary">Carrito</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ShoppingCart sx={{ fontSize: 32, mr: 2, color: 'primary.main' }} />
          <Typography variant="h4">
            Carrito de Compras
          </Typography>
          <Badge badgeContent={cart.length} color="primary" sx={{ ml: 2 }}>
            <ShoppingBag />
          </Badge>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Share />}
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              showNotification('Enlace copiado', 'success');
            }}
          >
            Compartir
          </Button>
          <Button
            variant="outlined"
            startIcon={<Clear />}
            onClick={handleClearCart}
            color="error"
          >
            Vaciar Carrito
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {/* Cart Controls */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedItems.length === cart.length}
                    indeterminate={selectedItems.length > 0 && selectedItems.length < cart.length}
                    onChange={handleSelectAll}
                  />
                }
                label={`Seleccionar todos (${selectedItems.length}/${cart.length})`}
              />
              
              <FormControlLabel
                control={
                  <Checkbox
                    checked={groupByStore}
                    onChange={(e) => setGroupByStore(e.target.checked)}
                  />
                }
                label="Agrupar por tienda"
              />
            </Box>
          </Paper>

          {/* Cart Items */}
          {groupByStore ? (
            Object.entries(groupCartByStore()).map(([storeId, storeData]) => (
              <Paper key={storeId} sx={{ p: 2, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Store sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">{storeData.storeName}</Typography>
                  <Chip 
                    label={`${storeData.items.length} productos`} 
                    size="small" 
                    sx={{ ml: 2 }}
                  />
                </Box>
                {storeData.items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </Paper>
            ))
          ) : (
            cart.map((item) => (
              <CartItem key={item.id} item={item} showStore />
            ))
          )}
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Box sx={{ position: 'sticky', top: 20 }}>
            <OrderSummary />
            
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleCheckout}
              disabled={selectedItems.length === 0}
              startIcon={<Payment />}
              sx={{ mt: 2 }}
            >
              Proceder al Checkout ({selectedItems.length} productos)
            </Button>
            
            <Button
              variant="outlined"
              fullWidth
              onClick={() => navigate('/')}
              startIcon={<ShoppingBag />}
              sx={{ mt: 1 }}
            >
              Continuar Comprando
            </Button>
            
            {/* Security Info */}
            <Paper sx={{ p: 2, mt: 2, bgcolor: 'success.50' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Security sx={{ color: 'success.main', mr: 1 }} />
                <Typography variant="subtitle2" color="success.main">
                  Compra Segura
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Tus datos están protegidos con encriptación SSL
              </Typography>
            </Paper>
            
            {/* Free Shipping Alert */}
            {calculateSubtotal() < 100 && (
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  Agrega ${(100 - calculateSubtotal()).toFixed(2)} más para envío gratis
                </Typography>
              </Alert>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Checkout Dialog */}
      <CheckoutDialog />
    </Container>
  );
};

export default Cart;