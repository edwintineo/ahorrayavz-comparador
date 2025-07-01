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
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Skeleton,
  Alert,
  Breadcrumbs,
  Link,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Slider,
  RadioGroup,
  Radio,
  Checkbox
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Person,
  Notifications,
  Security,
  Language,
  Palette,
  LocationOn,
  AttachMoney,
  Store,
  Search,
  Compare,
  ShoppingCart,
  Favorite,
  Home,
  NavigateNext,
  ExpandMore,
  Save,
  Restore,
  Delete,
  Edit,
  Visibility,
  VisibilityOff,
  Phone,
  Email,
  Lock,
  VpnKey,
  Backup,
  CloudDownload,
  CloudUpload,
  Warning,
  Info,
  CheckCircle,
  Cancel
} from '@mui/icons-material';
import { useStore } from '../store/useStore';
import { useNotification } from '../contexts/NotificationContext';
import { useWordPressAPI } from '../hooks/useWordPressAPI';

const Settings = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { user, updateUser, clearUserData } = useStore();
  const { updateUserProfile, changePassword } = useWordPressAPI();
  
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [settings, setSettings] = useState({
    // Profile settings
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    phone: user?.acf?.telefono || '',
    address: user?.acf?.direccion || '',
    
    // Notification settings
    emailNotifications: true,
    pushNotifications: true,
    priceAlerts: true,
    newProductAlerts: false,
    promotionAlerts: true,
    weeklyDigest: false,
    
    // Privacy settings
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    allowDataCollection: true,
    
    // App preferences
    theme: 'light',
    language: 'es',
    currency: 'bs',
    defaultLocation: '',
    searchRadius: 10,
    resultsPerPage: 20,
    autoRefreshPrices: true,
    showOutOfStock: false,
    
    // Shopping preferences
    defaultPaymentMethod: '',
    saveShoppingHistory: true,
    shareWishlist: false,
    autoAddToComparison: false
  });
  
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [deleteAccountDialog, setDeleteAccountDialog] = useState(false);
  const [exportDataDialog, setExportDataDialog] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    loadUserSettings();
  }, [user]);

  const loadUserSettings = () => {
    // Load settings from localStorage or user preferences
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error parsing saved settings:', error);
      }
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      
      // Save to localStorage
      localStorage.setItem('userSettings', JSON.stringify(settings));
      
      // Update user profile if profile data changed
      const profileData = {
        first_name: settings.firstName,
        last_name: settings.lastName,
        email: settings.email,
        acf: {
          telefono: settings.phone,
          direccion: settings.address
        }
      };
      
      await updateUserProfile(user.id, profileData);
      updateUser(profileData);
      
      showNotification('Configuración guardada exitosamente', 'success');
    } catch (error) {
      console.error('Error saving settings:', error);
      showNotification('Error al guardar la configuración', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showNotification('Las contraseñas no coinciden', 'error');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      showNotification('La contraseña debe tener al menos 6 caracteres', 'error');
      return;
    }
    
    try {
      setLoading(true);
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      
      setPasswordDialog(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showNotification('Contraseña cambiada exitosamente', 'success');
    } catch (error) {
      console.error('Error changing password:', error);
      showNotification('Error al cambiar la contraseña', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    const userData = {
      profile: user,
      settings: settings,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `ahorrayavz-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setExportDataDialog(false);
    showNotification('Datos exportados exitosamente', 'success');
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      // In a real app, you would call an API to delete the account
      // await deleteUserAccount(user.id);
      
      clearUserData();
      localStorage.clear();
      
      showNotification('Cuenta eliminada exitosamente', 'info');
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      showNotification('Error al eliminar la cuenta', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSettings = () => {
    localStorage.removeItem('userSettings');
    setSettings({
      firstName: user?.first_name || '',
      lastName: user?.last_name || '',
      email: user?.email || '',
      phone: user?.acf?.telefono || '',
      address: user?.acf?.direccion || '',
      emailNotifications: true,
      pushNotifications: true,
      priceAlerts: true,
      newProductAlerts: false,
      promotionAlerts: true,
      weeklyDigest: false,
      profileVisibility: 'public',
      showEmail: false,
      showPhone: false,
      allowDataCollection: true,
      theme: 'light',
      language: 'es',
      currency: 'bs',
      defaultLocation: '',
      searchRadius: 10,
      resultsPerPage: 20,
      autoRefreshPrices: true,
      showOutOfStock: false,
      defaultPaymentMethod: '',
      saveShoppingHistory: true,
      shareWishlist: false,
      autoAddToComparison: false
    });
    showNotification('Configuración restablecida', 'info');
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {[1, 2, 3].map((item) => (
            <Grid item xs={12} key={item}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" height={40} />
                  <Skeleton variant="text" height={20} />
                  <Skeleton variant="rectangular" height={100} sx={{ mt: 2 }} />
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
        <Typography color="text.primary">Configuración</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Configuración
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Personaliza tu experiencia en AhorraYa VZ
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Restore />}
            onClick={handleResetSettings}
          >
            Restablecer
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSaveSettings}
            disabled={loading}
          >
            Guardar
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab 
            label="Perfil" 
            icon={<Person />} 
            iconPosition="start"
          />
          <Tab 
            label="Notificaciones" 
            icon={<Notifications />} 
            iconPosition="start"
          />
          <Tab 
            label="Privacidad" 
            icon={<Security />} 
            iconPosition="start"
          />
          <Tab 
            label="Preferencias" 
            icon={<SettingsIcon />} 
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Profile Tab */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Información Personal
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Nombre"
                      value={settings.firstName}
                      onChange={(e) => handleSettingChange('firstName', e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Apellido"
                      value={settings.lastName}
                      onChange={(e) => handleSettingChange('lastName', e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Email"
                      type="email"
                      value={settings.email}
                      onChange={(e) => handleSettingChange('email', e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Teléfono"
                      value={settings.phone}
                      onChange={(e) => handleSettingChange('phone', e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Dirección"
                      value={settings.address}
                      onChange={(e) => handleSettingChange('address', e.target.value)}
                      fullWidth
                      multiline
                      rows={2}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Seguridad
                </Typography>
                
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Lock />
                    </ListItemIcon>
                    <ListItemText
                      primary="Cambiar Contraseña"
                      secondary="Actualiza tu contraseña"
                    />
                    <ListItemSecondaryAction>
                      <Button
                        size="small"
                        onClick={() => setPasswordDialog(true)}
                      >
                        Cambiar
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <CloudDownload />
                    </ListItemIcon>
                    <ListItemText
                      primary="Exportar Datos"
                      secondary="Descarga tus datos"
                    />
                    <ListItemSecondaryAction>
                      <Button
                        size="small"
                        onClick={() => setExportDataDialog(true)}
                      >
                        Exportar
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <Delete color="error" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Eliminar Cuenta"
                      secondary="Acción irreversible"
                    />
                    <ListItemSecondaryAction>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => setDeleteAccountDialog(true)}
                      >
                        Eliminar
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Notifications Tab */}
      {tabValue === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Preferencias de Notificaciones
                </Typography>
                
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Email />
                    </ListItemIcon>
                    <ListItemText
                      primary="Notificaciones por Email"
                      secondary="Recibe actualizaciones por correo electrónico"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.emailNotifications}
                        onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <Notifications />
                    </ListItemIcon>
                    <ListItemText
                      primary="Notificaciones Push"
                      secondary="Recibe notificaciones en tiempo real"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.pushNotifications}
                        onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <AttachMoney />
                    </ListItemIcon>
                    <ListItemText
                      primary="Alertas de Precios"
                      secondary="Notificaciones cuando cambien los precios"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.priceAlerts}
                        onChange={(e) => handleSettingChange('priceAlerts', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <Store />
                    </ListItemIcon>
                    <ListItemText
                      primary="Nuevos Productos"
                      secondary="Notificaciones de productos nuevos"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.newProductAlerts}
                        onChange={(e) => handleSettingChange('newProductAlerts', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <LocalOffer />
                    </ListItemIcon>
                    <ListItemText
                      primary="Promociones"
                      secondary="Ofertas especiales y descuentos"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.promotionAlerts}
                        onChange={(e) => handleSettingChange('promotionAlerts', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <Info />
                    </ListItemIcon>
                    <ListItemText
                      primary="Resumen Semanal"
                      secondary="Resumen de actividad semanal"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.weeklyDigest}
                        onChange={(e) => handleSettingChange('weeklyDigest', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Privacy Tab */}
      {tabValue === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Configuración de Privacidad
                </Typography>
                
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Visibilidad del Perfil"
                      secondary="Controla quién puede ver tu perfil"
                    />
                    <ListItemSecondaryAction>
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <Select
                          value={settings.profileVisibility}
                          onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
                        >
                          <MenuItem value="public">Público</MenuItem>
                          <MenuItem value="friends">Solo amigos</MenuItem>
                          <MenuItem value="private">Privado</MenuItem>
                        </Select>
                      </FormControl>
                    </ListItemSecondaryAction>
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <Email />
                    </ListItemIcon>
                    <ListItemText
                      primary="Mostrar Email"
                      secondary="Permite que otros vean tu email"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.showEmail}
                        onChange={(e) => handleSettingChange('showEmail', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <Phone />
                    </ListItemIcon>
                    <ListItemText
                      primary="Mostrar Teléfono"
                      secondary="Permite que otros vean tu teléfono"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.showPhone}
                        onChange={(e) => handleSettingChange('showPhone', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <Backup />
                    </ListItemIcon>
                    <ListItemText
                      primary="Recopilación de Datos"
                      secondary="Permite recopilar datos para mejorar el servicio"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.allowDataCollection}
                        onChange={(e) => handleSettingChange('allowDataCollection', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Preferences Tab */}
      {tabValue === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Preferencias de la Aplicación
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Tema
                  </Typography>
                  <RadioGroup
                    value={settings.theme}
                    onChange={(e) => handleSettingChange('theme', e.target.value)}
                    row
                  >
                    <FormControlLabel value="light" control={<Radio />} label="Claro" />
                    <FormControlLabel value="dark" control={<Radio />} label="Oscuro" />
                    <FormControlLabel value="auto" control={<Radio />} label="Automático" />
                  </RadioGroup>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <FormControl fullWidth>
                    <InputLabel>Idioma</InputLabel>
                    <Select
                      value={settings.language}
                      label="Idioma"
                      onChange={(e) => handleSettingChange('language', e.target.value)}
                    >
                      <MenuItem value="es">Español</MenuItem>
                      <MenuItem value="en">English</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <FormControl fullWidth>
                    <InputLabel>Moneda Principal</InputLabel>
                    <Select
                      value={settings.currency}
                      label="Moneda Principal"
                      onChange={(e) => handleSettingChange('currency', e.target.value)}
                    >
                      <MenuItem value="bs">Bolívares (Bs.)</MenuItem>
                      <MenuItem value="usd">Dólares (USD)</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Radio de Búsqueda (km)
                  </Typography>
                  <Slider
                    value={settings.searchRadius}
                    onChange={(e, value) => handleSettingChange('searchRadius', value)}
                    min={1}
                    max={50}
                    step={1}
                    marks
                    valueLabelDisplay="auto"
                  />
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <FormControl fullWidth>
                    <InputLabel>Resultados por Página</InputLabel>
                    <Select
                      value={settings.resultsPerPage}
                      label="Resultados por Página"
                      onChange={(e) => handleSettingChange('resultsPerPage', e.target.value)}
                    >
                      <MenuItem value={10}>10</MenuItem>
                      <MenuItem value={20}>20</MenuItem>
                      <MenuItem value={50}>50</MenuItem>
                      <MenuItem value={100}>100</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Preferencias de Compras
                </Typography>
                
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Actualización Automática de Precios"
                      secondary="Actualiza precios automáticamente"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.autoRefreshPrices}
                        onChange={(e) => handleSettingChange('autoRefreshPrices', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  
                  <ListItem>
                    <ListItemText
                      primary="Mostrar Productos Agotados"
                      secondary="Incluir productos sin stock en resultados"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.showOutOfStock}
                        onChange={(e) => handleSettingChange('showOutOfStock', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  
                  <ListItem>
                    <ListItemText
                      primary="Guardar Historial de Compras"
                      secondary="Mantener registro de tus compras"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.saveShoppingHistory}
                        onChange={(e) => handleSettingChange('saveShoppingHistory', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  
                  <ListItem>
                    <ListItemText
                      primary="Compartir Lista de Deseos"
                      secondary="Permite que otros vean tu lista"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.shareWishlist}
                        onChange={(e) => handleSettingChange('shareWishlist', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  
                  <ListItem>
                    <ListItemText
                      primary="Auto-agregar a Comparación"
                      secondary="Agregar automáticamente productos similares"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.autoAddToComparison}
                        onChange={(e) => handleSettingChange('autoAddToComparison', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Password Change Dialog */}
      <Dialog open={passwordDialog} onClose={() => setPasswordDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Cambiar Contraseña</DialogTitle>
        <DialogContent>
          <TextField
            label="Contraseña Actual"
            type={showPasswords.current ? 'text' : 'password'}
            value={passwordData.currentPassword}
            onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
            fullWidth
            margin="normal"
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                >
                  {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              )
            }}
          />
          <TextField
            label="Nueva Contraseña"
            type={showPasswords.new ? 'text' : 'password'}
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
            fullWidth
            margin="normal"
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                >
                  {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              )
            }}
          />
          <TextField
            label="Confirmar Nueva Contraseña"
            type={showPasswords.confirm ? 'text' : 'password'}
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            fullWidth
            margin="normal"
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                >
                  {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              )
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialog(false)}>Cancelar</Button>
          <Button onClick={handleChangePassword} variant="contained" disabled={loading}>
            Cambiar Contraseña
          </Button>
        </DialogActions>
      </Dialog>

      {/* Export Data Dialog */}
      <Dialog open={exportDataDialog} onClose={() => setExportDataDialog(false)}>
        <DialogTitle>Exportar Datos</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Se descargará un archivo JSON con toda tu información personal, configuraciones y datos de la aplicación.
          </Typography>
          <Alert severity="info" sx={{ mt: 2 }}>
            Este archivo contiene información sensible. Manténlo seguro.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportDataDialog(false)}>Cancelar</Button>
          <Button onClick={handleExportData} variant="contained" startIcon={<CloudDownload />}>
            Descargar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={deleteAccountDialog} onClose={() => setDeleteAccountDialog(false)}>
        <DialogTitle>Eliminar Cuenta</DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              ¡Atención! Esta acción es irreversible.
            </Typography>
            <Typography variant="body2">
              Se eliminarán permanentemente:
            </Typography>
            <ul>
              <li>Tu perfil y datos personales</li>
              <li>Listas de compras y favoritos</li>
              <li>Historial de búsquedas</li>
              <li>Todas las configuraciones</li>
            </ul>
          </Alert>
          <Typography variant="body1">
            ¿Estás seguro de que deseas eliminar tu cuenta?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteAccountDialog(false)}>Cancelar</Button>
          <Button onClick={handleDeleteAccount} color="error" variant="contained" disabled={loading}>
            Eliminar Cuenta
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Settings;