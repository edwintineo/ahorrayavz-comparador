import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Breadcrumbs,
  Link,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip
} from '@mui/material';
import {
  Home,
  Email,
  Phone,
  LocationOn,
  Send,
  ContactMail,
  Support,
  Business,
  BugReport,
  Feedback,
  Help,
  Schedule,
  Language,
  ExpandMore,
  CheckCircle,
  Info,
  Warning
} from '@mui/icons-material';
import { useNotification } from '../contexts/NotificationContext';
import { useStore } from '../store/useStore';

const Contact = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { user } = useStore();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.display_name || '',
    email: user?.email || '',
    phone: '',
    subject: '',
    category: '',
    message: '',
    priority: 'medium'
  });
  const [submitted, setSubmitted] = useState(false);

  const categories = [
    { value: 'support', label: 'Soporte Técnico', icon: <Support /> },
    { value: 'business', label: 'Consultas Comerciales', icon: <Business /> },
    { value: 'bug', label: 'Reportar Error', icon: <BugReport /> },
    { value: 'feedback', label: 'Sugerencias', icon: <Feedback /> },
    { value: 'general', label: 'Consulta General', icon: <Help /> }
  ];

  const priorities = [
    { value: 'low', label: 'Baja', color: 'success' },
    { value: 'medium', label: 'Media', color: 'warning' },
    { value: 'high', label: 'Alta', color: 'error' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message || !formData.category) {
      showNotification('Por favor complete todos los campos requeridos', 'error');
      return;
    }
    
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would send this to your backend
      console.log('Contact form submitted:', formData);
      
      setSubmitted(true);
      showNotification('Mensaje enviado exitosamente. Te contactaremos pronto.', 'success');
      
      // Reset form
      setFormData({
        name: user?.display_name || '',
        email: user?.email || '',
        phone: '',
        subject: '',
        category: '',
        message: '',
        priority: 'medium'
      });
      
    } catch (error) {
      console.error('Error sending message:', error);
      showNotification('Error al enviar el mensaje. Inténtalo de nuevo.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
          <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            ¡Mensaje Enviado!
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Gracias por contactarnos. Hemos recibido tu mensaje y nuestro equipo te responderá 
            dentro de las próximas 24-48 horas.
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Si tu consulta es urgente, puedes llamarnos directamente al +58 (212) 555-0123.
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Button 
              variant="contained" 
              onClick={() => setSubmitted(false)}
              sx={{ mr: 2 }}
            >
              Enviar Otro Mensaje
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/')}
            >
              Volver al Inicio
            </Button>
          </Box>
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
        <Typography color="text.primary">Contacto</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" gutterBottom>
          Contáctanos
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Estamos aquí para ayudarte. Envíanos tu consulta y te responderemos pronto.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Contact Form */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Envíanos un Mensaje
              </Typography>
              
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Nombre Completo"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Teléfono (Opcional)"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Categoría</InputLabel>
                      <Select
                        value={formData.category}
                        label="Categoría"
                        onChange={(e) => handleInputChange('category', e.target.value)}
                      >
                        {categories.map((category) => (
                          <MenuItem key={category.value} value={category.value}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {category.icon}
                              <Typography sx={{ ml: 1 }}>{category.label}</Typography>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Asunto"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Prioridad</InputLabel>
                      <Select
                        value={formData.priority}
                        label="Prioridad"
                        onChange={(e) => handleInputChange('priority', e.target.value)}
                      >
                        {priorities.map((priority) => (
                          <MenuItem key={priority.value} value={priority.value}>
                            <Chip 
                              label={priority.label} 
                              color={priority.color} 
                              size="small"
                            />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Mensaje"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      fullWidth
                      multiline
                      rows={6}
                      required
                      placeholder="Describe tu consulta o problema en detalle..."
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      startIcon={<Send />}
                      disabled={loading}
                      fullWidth
                    >
                      {loading ? 'Enviando...' : 'Enviar Mensaje'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Contact Information */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={3}>
            {/* Contact Details */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Información de Contacto
                  </Typography>
                  
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Email color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Email"
                        secondary="soporte@ahorrayavz.com"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Phone color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Teléfono"
                        secondary="+58 (212) 555-0123"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <LocationOn color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Dirección"
                        secondary="Av. Principal, Caracas 1010, Venezuela"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Schedule color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Horario de Atención"
                        secondary="Lun - Vie: 8:00 AM - 6:00 PM"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Response Times */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Tiempos de Respuesta
                  </Typography>
                  
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Consultas Generales"
                        secondary="24-48 horas"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Soporte Técnico"
                        secondary="4-8 horas"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Consultas Comerciales"
                        secondary="1-2 días hábiles"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Reportes de Errores"
                        secondary="2-4 horas"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Quick Links */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Enlaces Útiles
                  </Typography>
                  
                  <List>
                    <ListItem button onClick={() => navigate('/help')}>
                      <ListItemIcon>
                        <Help />
                      </ListItemIcon>
                      <ListItemText primary="Centro de Ayuda" />
                    </ListItem>
                    <ListItem button onClick={() => navigate('/terms')}>
                      <ListItemIcon>
                        <Info />
                      </ListItemIcon>
                      <ListItemText primary="Términos y Condiciones" />
                    </ListItem>
                    <ListItem button onClick={() => navigate('/privacy')}>
                      <ListItemIcon>
                        <Warning />
                      </ListItemIcon>
                      <ListItemText primary="Política de Privacidad" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* FAQ Section */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>
          Preguntas Frecuentes
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6">
                  ¿Cómo puedo registrar mi tienda en AhorraYa VZ?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1">
                  Para registrar tu tienda, ve a la página de registro y selecciona "Comerciante". 
                  Completa el formulario con la información de tu negocio y nuestro equipo 
                  revisará tu solicitud en 24-48 horas.
                </Typography>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6">
                  ¿Los precios mostrados están actualizados?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1">
                  Hacemos nuestro mejor esfuerzo para mantener los precios actualizados. 
                  Los comerciantes pueden actualizar sus precios en tiempo real, pero 
                  recomendamos verificar el precio final directamente con la tienda.
                </Typography>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6">
                  ¿Puedo comprar directamente a través de AhorraYa VZ?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1">
                  AhorraYa VZ es una plataforma de comparación de precios. No procesamos 
                  transacciones directamente. Te conectamos con las tiendas para que 
                  puedas realizar tus compras directamente con ellas.
                </Typography>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6">
                  ¿Cómo reporto un precio incorrecto?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1">
                  Puedes reportar precios incorrectos usando el formulario de contacto 
                  seleccionando "Reportar Error" como categoría, o directamente desde 
                  la página del producto usando el botón "Reportar precio".
                </Typography>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6">
                  ¿Hay algún costo por usar AhorraYa VZ?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1">
                  AhorraYa VZ es completamente gratuito para los consumidores. 
                  Los comerciantes pueden tener planes premium con funciones adicionales, 
                  pero el uso básico de la plataforma es gratuito para todos.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      </Box>

      {/* Emergency Contact */}
      <Alert severity="info" sx={{ mt: 4 }}>
        <Typography variant="body2">
          <strong>¿Necesitas ayuda urgente?</strong> Para problemas críticos que requieren 
          atención inmediata, llámanos directamente al +58 (212) 555-0123 durante 
          nuestro horario de atención.
        </Typography>
      </Alert>
    </Container>
  );
};

export default Contact;