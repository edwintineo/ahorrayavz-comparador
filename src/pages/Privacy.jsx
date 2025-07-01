import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Breadcrumbs,
  Link,
  Divider,
  List,
  ListItem,
  ListItemText,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Chip,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  Home,
  ExpandMore,
  Security,
  Info,
  Warning,
  CheckCircle,
  Shield,
  Lock,
  Visibility,
  Share,
  Storage,
  Delete,
  Update,
  ContactMail
} from '@mui/icons-material';

const Privacy = () => {
  const navigate = useNavigate();

  const lastUpdated = "15 de enero de 2025";

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
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
        <Typography color="text.primary">Política de Privacidad</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Paper elevation={2} sx={{ p: 4, mb: 4, textAlign: 'center' }}>
        <Shield sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h3" gutterBottom>
          Política de Privacidad
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          AhorraYa VZ - Protección de Datos Personales
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Última actualización: {lastUpdated}
        </Typography>
      </Paper>

      {/* Important Notice */}
      <Alert severity="info" sx={{ mb: 4 }}>
        <Typography variant="body2">
          En AhorraYa VZ respetamos su privacidad y nos comprometemos a proteger sus datos personales. 
          Esta política explica cómo recopilamos, usamos y protegemos su información.
        </Typography>
      </Alert>

      {/* Quick Overview */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Lock sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                Datos Seguros
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Encriptación y protección avanzada
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Visibility sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                Transparencia
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Control total sobre sus datos
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Share sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                No Vendemos
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Nunca vendemos información personal
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Delete sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                Sus Derechos
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Acceso, corrección y eliminación
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Privacy Content */}
      <Paper elevation={1} sx={{ p: 3 }}>
        {/* 1. Información que Recopilamos */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">
              1. Información que Recopilamos
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" gutterBottom>
              <strong>Información Personal Directa:</strong>
            </Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary="Datos de Registro" 
                  secondary="Nombre, apellido, email, teléfono, dirección"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Información de Perfil" 
                  secondary="Preferencias, foto de perfil, configuraciones"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Datos de Comerciantes" 
                  secondary="Información comercial, RIF, datos bancarios (encriptados)"
                />
              </ListItem>
            </List>
            
            <Typography variant="body2" gutterBottom sx={{ mt: 2 }}>
              <strong>Información de Uso Automática:</strong>
            </Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary="Datos de Navegación" 
                  secondary="Páginas visitadas, tiempo de sesión, clics, búsquedas"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Información Técnica" 
                  secondary="Dirección IP, tipo de navegador, dispositivo, sistema operativo"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Ubicación" 
                  secondary="Ubicación aproximada (solo con su consentimiento)"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Cookies y Tecnologías Similares" 
                  secondary="Para mejorar la experiencia y recordar preferencias"
                />
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        {/* 2. Cómo Usamos su Información */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">
              2. Cómo Usamos su Información
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" gutterBottom>
              <strong>Propósitos Principales:</strong>
            </Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary="Prestación del Servicio" 
                  secondary="Comparación de precios, búsquedas, listas de compras"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Personalización" 
                  secondary="Recomendaciones, resultados relevantes, experiencia personalizada"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Comunicación" 
                  secondary="Notificaciones, alertas de precios, actualizaciones del servicio"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Mejora del Servicio" 
                  secondary="Análisis de uso, desarrollo de nuevas funciones, corrección de errores"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Seguridad" 
                  secondary="Prevención de fraude, protección de cuentas, cumplimiento legal"
                />
              </ListItem>
            </List>
            
            <Alert severity="success" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Compromiso:</strong> Solo usamos sus datos para los propósitos descritos. 
                Nunca vendemos información personal a terceros.
              </Typography>
            </Alert>
          </AccordionDetails>
        </Accordion>

        {/* 3. Compartir Información */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">
              3. Cuándo Compartimos su Información
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" paragraph>
              Compartimos información personal solo en las siguientes circunstancias:
            </Typography>
            
            <Typography variant="body2" gutterBottom>
              <strong>Con su Consentimiento:</strong>
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Cuando usted autoriza explícitamente el compartir" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Al usar funciones de compartir en redes sociales" />
              </ListItem>
            </List>
            
            <Typography variant="body2" gutterBottom sx={{ mt: 2 }}>
              <strong>Proveedores de Servicios:</strong>
            </Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary="Servicios de Hosting y Almacenamiento" 
                  secondary="Para mantener la plataforma funcionando"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Servicios de Email" 
                  secondary="Para enviar notificaciones y comunicaciones"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Análisis y Métricas" 
                  secondary="Para entender el uso y mejorar el servicio (datos anonimizados)"
                />
              </ListItem>
            </List>
            
            <Typography variant="body2" gutterBottom sx={{ mt: 2 }}>
              <strong>Requerimientos Legales:</strong>
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Cumplimiento de órdenes judiciales" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Investigaciones de autoridades competentes" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Protección de derechos y seguridad" />
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        {/* 4. Seguridad de Datos */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">
              4. Seguridad y Protección de Datos
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" paragraph>
              Implementamos múltiples capas de seguridad para proteger su información:
            </Typography>
            
            <Typography variant="body2" gutterBottom>
              <strong>Medidas Técnicas:</strong>
            </Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary="Encriptación SSL/TLS" 
                  secondary="Todas las comunicaciones están encriptadas"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Encriptación de Base de Datos" 
                  secondary="Datos sensibles encriptados en reposo"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Autenticación Segura" 
                  secondary="Contraseñas hasheadas, autenticación de dos factores"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Monitoreo de Seguridad" 
                  secondary="Detección de actividades sospechosas 24/7"
                />
              </ListItem>
            </List>
            
            <Typography variant="body2" gutterBottom sx={{ mt: 2 }}>
              <strong>Medidas Organizacionales:</strong>
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Acceso limitado a datos personales" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Capacitación regular del personal" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Auditorías de seguridad periódicas" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Políticas estrictas de manejo de datos" />
              </ListItem>
            </List>
            
            <Alert severity="warning" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Importante:</strong> Aunque implementamos las mejores prácticas de seguridad, 
                ningún sistema es 100% seguro. Le recomendamos usar contraseñas fuertes y únicas.
              </Typography>
            </Alert>
          </AccordionDetails>
        </Accordion>

        {/* 5. Sus Derechos */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">
              5. Sus Derechos sobre los Datos
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" paragraph>
              Usted tiene los siguientes derechos sobre sus datos personales:
            </Typography>
            
            <List>
              <ListItem>
                <ListItemText 
                  primary="Derecho de Acceso" 
                  secondary="Solicitar una copia de todos los datos que tenemos sobre usted"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Derecho de Rectificación" 
                  secondary="Corregir datos inexactos o incompletos"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Derecho de Eliminación" 
                  secondary="Solicitar la eliminación de sus datos personales"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Derecho de Portabilidad" 
                  secondary="Recibir sus datos en un formato estructurado y legible"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Derecho de Oposición" 
                  secondary="Oponerse al procesamiento de sus datos para ciertos propósitos"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Derecho de Limitación" 
                  secondary="Solicitar la limitación del procesamiento de sus datos"
                />
              </ListItem>
            </List>
            
            <Box sx={{ mt: 2, p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
              <Typography variant="body2" color="primary.contrastText">
                <strong>¿Cómo ejercer sus derechos?</strong><br />
                Puede ejercer estos derechos contactándonos en privacy@ahorrayavz.com o 
                a través de la configuración de su cuenta.
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* 6. Cookies y Tecnologías de Seguimiento */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">
              6. Cookies y Tecnologías de Seguimiento
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" paragraph>
              Utilizamos cookies y tecnologías similares para mejorar su experiencia:
            </Typography>
            
            <Typography variant="body2" gutterBottom>
              <strong>Tipos de Cookies:</strong>
            </Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary="Cookies Esenciales" 
                  secondary="Necesarias para el funcionamiento básico del sitio"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Cookies de Preferencias" 
                  secondary="Recordar sus configuraciones y preferencias"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Cookies de Análisis" 
                  secondary="Entender cómo usa el sitio para mejorarlo"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Cookies de Marketing" 
                  secondary="Mostrar contenido y ofertas relevantes (con su consentimiento)"
                />
              </ListItem>
            </List>
            
            <Typography variant="body1" paragraph sx={{ mt: 2 }}>
              Puede controlar las cookies a través de la configuración de su navegador. 
              Sin embargo, deshabilitar ciertas cookies puede afectar la funcionalidad del sitio.
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* 7. Retención de Datos */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">
              7. Retención y Eliminación de Datos
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" paragraph>
              Conservamos sus datos personales solo durante el tiempo necesario para los propósitos 
              para los cuales fueron recopilados:
            </Typography>
            
            <List>
              <ListItem>
                <ListItemText 
                  primary="Datos de Cuenta Activa" 
                  secondary="Mientras su cuenta esté activa y por 2 años después de la inactividad"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Datos de Transacciones" 
                  secondary="5 años para cumplimiento fiscal y legal"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Datos de Marketing" 
                  secondary="Hasta que retire su consentimiento"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Logs de Seguridad" 
                  secondary="1 año para investigaciones de seguridad"
                />
              </ListItem>
            </List>
            
            <Typography variant="body1" paragraph sx={{ mt: 2 }}>
              Cuando eliminamos datos, lo hacemos de forma segura e irreversible. 
              Algunos datos pueden conservarse en copias de seguridad por un período adicional limitado.
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* 8. Transferencias Internacionales */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">
              8. Transferencias Internacionales de Datos
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" paragraph>
              Sus datos pueden ser transferidos y procesados en países fuera de Venezuela, 
              específicamente en servidores ubicados en:
            </Typography>
            
            <List>
              <ListItem>
                <ListItemText 
                  primary="Estados Unidos" 
                  secondary="Servicios de hosting y almacenamiento en la nube"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Unión Europea" 
                  secondary="Servicios de análisis y procesamiento de datos"
                />
              </ListItem>
            </List>
            
            <Typography variant="body1" paragraph>
              Estas transferencias se realizan bajo salvaguardas apropiadas, incluyendo 
              cláusulas contractuales estándar y certificaciones de privacidad.
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* 9. Menores de Edad */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">
              9. Protección de Menores de Edad
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" paragraph>
              Nuestro servicio está dirigido a personas mayores de 18 años. No recopilamos 
              intencionalmente información personal de menores de 18 años.
            </Typography>
            
            <Typography variant="body1" paragraph>
              Si descubrimos que hemos recopilado información personal de un menor de 18 años 
              sin el consentimiento parental verificable, tomaremos medidas para eliminar 
              esa información de nuestros servidores.
            </Typography>
            
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                Si es padre o tutor y cree que su hijo nos ha proporcionado información personal, 
                contáctenos inmediatamente en privacy@ahorrayavz.com
              </Typography>
            </Alert>
          </AccordionDetails>
        </Accordion>

        {/* 10. Cambios en la Política */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">
              10. Cambios en esta Política
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" paragraph>
              Podemos actualizar esta Política de Privacidad ocasionalmente. Le notificaremos 
              sobre cambios significativos mediante:
            </Typography>
            
            <List>
              <ListItem>
                <ListItemText primary="Email a su dirección registrada" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Notificación prominente en nuestro sitio web" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Notificación push (si está habilitada)" />
              </ListItem>
            </List>
            
            <Typography variant="body1" paragraph>
              Le recomendamos revisar esta política periódicamente. El uso continuado 
              del servicio después de los cambios constituye su aceptación de la nueva política.
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* 11. Contacto */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">
              11. Contacto y Preguntas
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" paragraph>
              Si tiene preguntas sobre esta Política de Privacidad o sobre el manejo de sus datos, 
              puede contactarnos:
            </Typography>
            
            <List>
              <ListItem>
                <ListItemText 
                  primary="Email de Privacidad: privacy@ahorrayavz.com" 
                  secondary="Para consultas específicas sobre privacidad y datos"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Email General: soporte@ahorrayavz.com" 
                  secondary="Para consultas generales y soporte"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Teléfono: +58 (212) 555-0123" 
                  secondary="Horario: Lunes a Viernes, 8:00 AM - 6:00 PM (hora de Venezuela)"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Dirección Postal" 
                  secondary="AhorraYa VZ, Av. Principal, Caracas 1010, Venezuela"
                />
              </ListItem>
            </List>
            
            <Box sx={{ mt: 2, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
              <Typography variant="body2" color="success.contrastText">
                <strong>Tiempo de Respuesta:</strong> Nos comprometemos a responder a sus consultas 
                sobre privacidad dentro de 30 días hábiles.
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>

        <Divider sx={{ my: 4 }} />

        {/* Footer */}
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <Typography variant="body2" color="text.secondary" paragraph>
            Esta Política de Privacidad es efectiva a partir del {lastUpdated}.
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Su privacidad es importante para nosotros. Gracias por confiar en AhorraYa VZ.
          </Typography>
          
          <Box sx={{ mt: 3 }}>
            <Button 
              variant="contained" 
              onClick={() => navigate('/')}
              sx={{ mr: 2 }}
            >
              Volver al Inicio
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/terms')}
            >
              Ver Términos y Condiciones
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Privacy;