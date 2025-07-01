import React, { useState, useEffect } from 'react';
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
  Chip,
  Alert,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
  FormControlLabel,
  Paper,
  Skeleton,
  Tooltip,
  Fab,
  Breadcrumbs,
  Link,
  Menu,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge
} from '@mui/material';
import {
  ShoppingCart,
  Add,
  Remove,
  Delete,
  Edit,
  Store,
  LocationOn,
  AttachMoney,
  Share,
  Print,
  Download,
  Clear,
  Search,
  FilterList,
  Sort,
  ExpandMore,
  CheckCircle,
  RadioButtonUnchecked,
  Home,
  NavigateNext,
  ShoppingBag,
  LocalGroceryStore,
  Receipt,
  Calculate,
  Visibility,
  Compare,
  Favorite,
  MoreVert,
  ContentCopy,
  Archive,
  Unarchive
} from '@mui/icons-material';
import { useStore } from '../store/useStore';
import { useProducts } from '../hooks/useWordPressAPI';
import { useNotification } from '../contexts/NotificationContext';

const ShoppingList = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { 
    user, 
    exchangeRate, 
    convertPrice, 
    shoppingList,
    updateShoppingListItem,
    removeFromShoppingList,
    clearShoppingList,
    addToComparison,
    toggleFavorite,
    favorites
  } = useStore();
  const { getProduct } = useProducts();
  
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState({});
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editQuantity, setEditQuantity] = useState(1);
  const [filterStore, setFilterStore] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [showCompleted, setShowCompleted] = useState(true);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [groupByStore, setGroupByStore] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    loadProductDetails();
  }, [user, shoppingList]);

  const loadProductDetails = async () => {
    try {
      setLoading(true);
      const productDetails = {};
      
      for (const item of shoppingList) {
        if (!products[item.productId]) {
          try {
            const product = await getProduct(item.productId);
            if (product) {
              productDetails[item.productId] = product;
            }
          } catch (error) {
            console.error(`Error loading product ${item.productId}:`, error);
          }
        }
      }
      
      setProducts(prev => ({ ...prev, ...productDetails }));
    } catch (error) {
      console.error('Error loading product details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(itemId);
      return;
    }
    
    updateShoppingListItem(itemId, { quantity: newQuantity });
    showNotification('Cantidad actualizada', 'success');
  };

  const handleRemoveItem = (itemId) => {
    removeFromShoppingList(itemId);
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(itemId);
      return newSet;
    });
    showNotification('Producto removido de la lista', 'info');
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setEditQuantity(item.quantity);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingItem) {
      updateShoppingListItem(editingItem.id, { quantity: editQuantity });
      showNotification('Producto actualizado', 'success');
    }
    setEditDialogOpen(false);
    setEditingItem(null);
  };

  const handleToggleCompleted = (itemId) => {
    const item = shoppingList.find(item => item.id === itemId);
    if (item) {
      updateShoppingListItem(itemId, { completed: !item.completed });
    }
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    const filteredItems = getFilteredItems();
    if (selectedItems.size === filteredItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredItems.map(item => item.id)));
    }
  };

  const handleDeleteSelected = () => {
    selectedItems.forEach(itemId => {
      removeFromShoppingList(itemId);
    });
    setSelectedItems(new Set());
    showNotification(`${selectedItems.size} productos removidos`, 'info');
  };

  const handleMarkSelectedCompleted = () => {
    selectedItems.forEach(itemId => {
      updateShoppingListItem(itemId, { completed: true });
    });
    setSelectedItems(new Set());
    showNotification(`${selectedItems.size} productos marcados como completados`, 'success');
  };

  const handleAddToComparison = (product) => {
    addToComparison(product);
    showNotification('Producto agregado a comparación', 'success');
  };

  const handleToggleFavorite = (productId) => {
    toggleFavorite(productId);
    const isFavorite = favorites.includes(productId);
    showNotification(
      isFavorite ? 'Removido de favoritos' : 'Agregado a favoritos',
      'success'
    );
  };

  const getFilteredItems = () => {
    let filtered = shoppingList.filter(item => {
      if (!showCompleted && item.completed) return false;
      if (filterStore && item.storeName !== filterStore) return false;
      return true;
    });

    // Sort items
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.productName.localeCompare(b.productName);
        case 'price':
          return (a.price || 0) - (b.price || 0);
        case 'store':
          return (a.storeName || '').localeCompare(b.storeName || '');
        case 'quantity':
          return b.quantity - a.quantity;
        case 'added':
          return new Date(b.addedAt || 0) - new Date(a.addedAt || 0);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const getGroupedItems = () => {
    const filtered = getFilteredItems();
    
    if (!groupByStore) {
      return { 'Todos los productos': filtered };
    }
    
    return filtered.reduce((groups, item) => {
      const store = item.storeName || 'Sin tienda';
      if (!groups[store]) {
        groups[store] = [];
      }
      groups[store].push(item);
      return groups;
    }, {});
  };

  const getTotalPrice = () => {
    return shoppingList
      .filter(item => !item.completed)
      .reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCompletedPrice = () => {
    return shoppingList
      .filter(item => item.completed)
      .reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getStores = () => {
    const stores = new Set(shoppingList.map(item => item.storeName).filter(Boolean));
    return Array.from(stores);
  };

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

  const handleShare = () => {
    const listText = shoppingList
      .map(item => `${item.productName} (${item.quantity}x) - ${formatPrice(item.price)}`)
      .join('\n');
    
    const shareText = `Mi Lista de Compras - AhorraYa VZ\n\n${listText}\n\nTotal: ${formatPrice(getTotalPrice())}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Mi Lista de Compras - AhorraYa VZ',
        text: shareText
      });
    } else {
      navigator.clipboard.writeText(shareText);
      showNotification('Lista copiada al portapapeles', 'success');
    }
  };

  const handlePrint = () => {
    const printContent = `
      <h1>Lista de Compras - AhorraYa VZ</h1>
      <p>Fecha: ${new Date().toLocaleDateString()}</p>
      <ul>
        ${shoppingList.map(item => `
          <li>
            ${item.productName} (${item.quantity}x) - ${formatPrice(item.price)}
            ${item.storeName ? ` - ${item.storeName}` : ''}
          </li>
        `).join('')}
      </ul>
      <p><strong>Total: ${formatPrice(getTotalPrice())}</strong></p>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  if (!user) {
    return null;
  }

  if (loading && shoppingList.length > 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {[1, 2, 3].map((item) => (
            <Grid item xs={12} key={item}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Skeleton variant="rectangular" width={60} height={60} />
                    <Box sx={{ flex: 1 }}>
                      <Skeleton variant="text" height={24} width="60%" />
                      <Skeleton variant="text" height={20} width="40%" />
                    </Box>
                    <Skeleton variant="rectangular" width={100} height={36} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  if (shoppingList.length === 0) {
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
          <Typography color="text.primary">Lista de Compras</Typography>
        </Breadcrumbs>

        <Box sx={{ textAlign: 'center' }}>
          <ShoppingCart sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Tu lista de compras está vacía
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Agrega productos desde la búsqueda o desde las páginas de productos para comenzar tu lista.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/buscar')}
            startIcon={<Search />}
          >
            Buscar Productos
          </Button>
        </Box>
      </Container>
    );
  }

  const filteredItems = getFilteredItems();
  const groupedItems = getGroupedItems();
  const stores = getStores();
  const totalItems = shoppingList.length;
  const completedItems = shoppingList.filter(item => item.completed).length;

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
        <Typography color="text.primary">Lista de Compras</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Mi Lista de Compras
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {totalItems} producto{totalItems !== 1 ? 's' : ''} 
            {completedItems > 0 && ` (${completedItems} completado${completedItems !== 1 ? 's' : ''})`}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            onClick={(e) => setMenuAnchor(e.currentTarget)}
          >
            <MoreVert />
          </IconButton>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <ShoppingBag sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6">{totalItems}</Typography>
              <Typography variant="body2" color="text.secondary">
                Productos
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Store sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h6">{stores.length}</Typography>
              <Typography variant="body2" color="text.secondary">
                Tiendas
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <AttachMoney sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h6">{formatPrice(getTotalPrice())}</Typography>
              <Typography variant="body2" color="text.secondary">
                Total Pendiente
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CheckCircle sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h6">{formatPrice(getCompletedPrice())}</Typography>
              <Typography variant="body2" color="text.secondary">
                Total Completado
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Controls */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Filtrar por tienda</InputLabel>
                <Select
                  value={filterStore}
                  label="Filtrar por tienda"
                  onChange={(e) => setFilterStore(e.target.value)}
                >
                  <MenuItem value="">Todas las tiendas</MenuItem>
                  {stores.map((store) => (
                    <MenuItem key={store} value={store}>{store}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Ordenar por</InputLabel>
                <Select
                  value={sortBy}
                  label="Ordenar por"
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="name">Nombre</MenuItem>
                  <MenuItem value="price">Precio</MenuItem>
                  <MenuItem value="store">Tienda</MenuItem>
                  <MenuItem value="quantity">Cantidad</MenuItem>
                  <MenuItem value="added">Fecha agregado</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showCompleted}
                    onChange={(e) => setShowCompleted(e.target.checked)}
                  />
                }
                label="Mostrar completados"
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={groupByStore}
                    onChange={(e) => setGroupByStore(e.target.checked)}
                  />
                }
                label="Agrupar por tienda"
              />
            </Grid>
          </Grid>
          
          {selectedItems.size > 0 && (
            <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label={`${selectedItems.size} seleccionado${selectedItems.size !== 1 ? 's' : ''}`}
                color="primary"
                onDelete={() => setSelectedItems(new Set())}
              />
              <Button
                size="small"
                startIcon={<CheckCircle />}
                onClick={handleMarkSelectedCompleted}
              >
                Marcar completados
              </Button>
              <Button
                size="small"
                color="error"
                startIcon={<Delete />}
                onClick={handleDeleteSelected}
              >
                Eliminar
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Shopping List Items */}
      {Object.entries(groupedItems).map(([groupName, items]) => (
        <Card key={groupName} sx={{ mb: 3 }}>
          {groupByStore && (
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Store color="action" />
                  <Typography variant="h6">{groupName}</Typography>
                  <Chip label={`${items.length} producto${items.length !== 1 ? 's' : ''}`} size="small" />
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {items.map((item) => {
                    const product = products[item.productId];
                    const isSelected = selectedItems.has(item.id);
                    
                    return (
                      <ListItem
                        key={item.id}
                        sx={{
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 1,
                          mb: 1,
                          bgcolor: item.completed ? 'action.hover' : 'background.paper',
                          opacity: item.completed ? 0.7 : 1
                        }}
                      >
                        <ListItemAvatar>
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleSelectItem(item.id)}
                          />
                        </ListItemAvatar>
                        
                        <ListItemAvatar>
                          <Avatar
                            src={product?.acf?.imagenes?.[0]}
                            variant="rounded"
                            sx={{ width: 60, height: 60 }}
                          >
                            <ShoppingBag />
                          </Avatar>
                        </ListItemAvatar>
                        
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography
                                variant="subtitle1"
                                sx={{
                                  textDecoration: item.completed ? 'line-through' : 'none',
                                  cursor: 'pointer',
                                  '&:hover': { color: 'primary.main' }
                                }}
                                onClick={() => navigate(`/producto/${item.productId}`)}
                              >
                                {item.productName}
                              </Typography>
                              {favorites.includes(item.productId) && (
                                <Favorite color="error" fontSize="small" />
                              )}
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {formatPrice(item.price)} × {item.quantity} = {formatPrice(item.price * item.quantity)}
                              </Typography>
                              {item.storeName && (
                                <Typography variant="body2" color="text.secondary">
                                  {item.storeName}
                                </Typography>
                              )}
                              {exchangeRate && (
                                <Typography variant="body2" color="text.secondary">
                                  ≈ {formatPrice(convertPrice(item.price * item.quantity, 'bs', 'usd'), 'usd')}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                        
                        <ListItemSecondaryAction>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {/* Quantity Controls */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <IconButton
                                size="small"
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <Remove />
                              </IconButton>
                              <Typography variant="body2" sx={{ minWidth: 20, textAlign: 'center' }}>
                                {item.quantity}
                              </Typography>
                              <IconButton
                                size="small"
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              >
                                <Add />
                              </IconButton>
                            </Box>
                            
                            {/* Action Buttons */}
                            <Tooltip title="Marcar como completado">
                              <IconButton
                                size="small"
                                onClick={() => handleToggleCompleted(item.id)}
                                color={item.completed ? 'success' : 'default'}
                              >
                                {item.completed ? <CheckCircle /> : <RadioButtonUnchecked />}
                              </IconButton>
                            </Tooltip>
                            
                            {product && (
                              <Tooltip title="Agregar a comparación">
                                <IconButton
                                  size="small"
                                  onClick={() => handleAddToComparison(product)}
                                >
                                  <Compare />
                                </IconButton>
                              </Tooltip>
                            )}
                            
                            <Tooltip title="Agregar/quitar de favoritos">
                              <IconButton
                                size="small"
                                onClick={() => handleToggleFavorite(item.productId)}
                                color={favorites.includes(item.productId) ? 'error' : 'default'}
                              >
                                {favorites.includes(item.productId) ? <Favorite /> : <FavoriteBorder />}
                              </IconButton>
                            </Tooltip>
                            
                            <Tooltip title="Editar">
                              <IconButton
                                size="small"
                                onClick={() => handleEditItem(item)}
                              >
                                <Edit />
                              </IconButton>
                            </Tooltip>
                            
                            <Tooltip title="Eliminar">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleRemoveItem(item.id)}
                              >
                                <Delete />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </ListItemSecondaryAction>
                      </ListItem>
                    );
                  })}
                </List>
              </AccordionDetails>
            </Accordion>
          )}
          
          {!groupByStore && (
            <CardContent>
              <List>
                {items.map((item) => {
                  const product = products[item.productId];
                  const isSelected = selectedItems.has(item.id);
                  
                  return (
                    <ListItem
                      key={item.id}
                      sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        mb: 1,
                        bgcolor: item.completed ? 'action.hover' : 'background.paper',
                        opacity: item.completed ? 0.7 : 1
                      }}
                    >
                      {/* Same content as above */}
                    </ListItem>
                  );
                })}
              </List>
            </CardContent>
          )}
        </Card>
      ))}

      {/* Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem onClick={() => { handleSelectAll(); setMenuAnchor(null); }}>
          <CheckCircle sx={{ mr: 1 }} />
          {selectedItems.size === filteredItems.length ? 'Deseleccionar todo' : 'Seleccionar todo'}
        </MenuItem>
        <MenuItem onClick={() => { handleShare(); setMenuAnchor(null); }}>
          <Share sx={{ mr: 1 }} />
          Compartir lista
        </MenuItem>
        <MenuItem onClick={() => { handlePrint(); setMenuAnchor(null); }}>
          <Print sx={{ mr: 1 }} />
          Imprimir lista
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => { clearShoppingList(); setMenuAnchor(null); }} sx={{ color: 'error.main' }}>
          <Clear sx={{ mr: 1 }} />
          Limpiar lista
        </MenuItem>
      </Menu>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Editar Producto</DialogTitle>
        <DialogContent>
          {editingItem && (
            <Box sx={{ pt: 1 }}>
              <Typography variant="subtitle1" gutterBottom>
                {editingItem.productName}
              </Typography>
              <TextField
                label="Cantidad"
                type="number"
                value={editQuantity}
                onChange={(e) => setEditQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                fullWidth
                margin="normal"
                inputProps={{ min: 1 }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Precio unitario: {formatPrice(editingItem.price)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total: {formatPrice(editingItem.price * editQuantity)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleSaveEdit} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => navigate('/buscar')}
      >
        <Add />
      </Fab>
    </Container>
  );
};

export default ShoppingList;