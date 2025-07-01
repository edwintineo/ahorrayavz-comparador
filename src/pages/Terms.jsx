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
  Button
} from '@mui/material';
import {
  Home,
  ExpandMore,
  Gavel,
  Security,
  Info,
  Warning,
  CheckCircle
} from '@mui/icons-material';

const Terms = () => {
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
        <Typography color="text.primary">Términos y Condiciones</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Paper elevation={2} sx={{ p: 4, mb: 4, textAlign: 'center' }}>
        <Gavel sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h3" gutterBottom>
          Términos y Condiciones
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          AhorraYa VZ - Plataforma de Comparación de Precios
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Última actualización: {lastUpdated}
        </Typography>
      </Paper>

      {/* Important Notice */}
      <Alert severity="info" sx={{ mb: 4 }}>
        <Typography variant="body2">
          Al utilizar nuestros servicios, usted acepta estos términos y condiciones. 
          Le recomendamos leer detenidamente este documento.
        </Typography>
      </Alert>

      {/* Terms Content */}
      <Paper elevation={1} sx={{ p: 3 }}>
        {/* 1. Aceptación de Términos */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">
              1. Aceptación de los Términos
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" paragraph>
              Al acceder y utilizar AhorraYa VZ ("el Servicio"), usted acepta estar sujeto a estos 
              Términos y Condiciones ("Términos"). Si no está de acuerdo con alguna parte de estos 
              términos, no debe utilizar nuestro servicio.
            </Typography>
            <Typography variant="body1" paragraph>
              Estos términos se aplican a todos los visitantes, usuarios y otras personas que accedan 
              o utilicen el servicio.
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* 2. Descripción del Servicio */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">
              2. Descripción del Servicio
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" paragraph>
              AhorraYa VZ es una plataforma digital que permite a los usuarios:
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Comparar precios de productos en diferentes tiendas" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Buscar productos y ofertas especiales" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Crear listas de compras personalizadas" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Recibir notificaciones sobre cambios de precios" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Acceder a información de tiendas y comercios" />
              </ListItem>
            </List>
            <Typography variant="body1" paragraph>
              El servicio es gratuito para los consumidores finales. Los comerciantes pueden 
              registrarse para promocionar sus productos bajo términos específicos.
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* 3. Registro y Cuentas de Usuario */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">
              3. Registro y Cuentas de Usuario
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" paragraph>
              Para utilizar ciertas funciones del servicio, debe crear una cuenta proporcionando 
              información precisa, actual y completa.
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Responsabilidades del Usuario:</strong>
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Mantener la seguridad de su contraseña" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Proporcionar información veraz y actualizada" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Notificar inmediatamente cualquier uso no autorizado" />
              </ListItem>
              <ListItem>
                <ListItemText primary="No compartir su cuenta con terceros" />
              </ListItem>
            </List>
            <Typography variant="body1" paragraph>
              Nos reservamos el derecho de suspender o terminar cuentas que violen estos términos.
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* 4. Uso Aceptable */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">
              4. Uso Aceptable
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" gutterBottom>
              <strong>Usos Permitidos:</strong>
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Búsqueda personal de productos y precios" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Comparación de ofertas para uso personal" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Creación de listas de compras personales" />
              </ListItem>
            </List>
            
            <Typography variant="body2" gutterBottom sx={{ mt: 2 }}>
              <strong>Usos Prohibidos:</strong>
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Uso comercial no autorizado de los datos" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Scraping automatizado o extracción masiva de datos" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Interferir con el funcionamiento del servicio" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Publicar contenido falso, engañoso o ilegal" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Violar derechos de propiedad intelectual" />
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        {/* 5. Información de Precios y Productos */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">
              5. Información de Precios y Productos
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="body2">
                Los precios mostrados son referenciales y pueden no reflejar el precio actual en la tienda.
              </Typography>
            </Alert>
            <Typography variant="body1" paragraph>
              La información de productos y precios se obtiene de diversas fuentes, incluyendo:
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Datos proporcionados directamente por comerciantes" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Información pública disponible en sitios web" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Reportes de usuarios verificados" />
              </ListItem>
            </List>
            <Typography variant="body1" paragraph>
              No garantizamos la exactitud, completitud o actualidad de toda la información. 
              Los usuarios deben verificar precios y disponibilidad directamente con los comerciantes.
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* 6. Privacidad y Protección de Datos */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">
              6. Privacidad y Protección de Datos
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" paragraph>
              Su privacidad es importante para nosotros. Recopilamos y utilizamos información personal 
              de acuerdo con nuestra Política de Privacidad.
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Datos que Recopilamos:</strong>
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Información de registro (nombre, email, teléfono)" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Preferencias de búsqueda y navegación" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Ubicación (con su consentimiento)" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Datos de uso de la plataforma" />
              </ListItem>
            </List>
            <Typography variant="body1" paragraph>
              No vendemos ni compartimos información personal con terceros sin su consentimiento, 
              excepto según se describe en nuestra Política de Privacidad.
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* 7. Comerciantes y Contenido de Terceros */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">
              7. Comerciantes y Contenido de Terceros
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" paragraph>
              Los comerciantes registrados pueden publicar información sobre sus productos y servicios. 
              AhorraYa VZ actúa como intermediario y no es responsable por:
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="La calidad, seguridad o legalidad de los productos" />
              </ListItem>
              <ListItem>
                <ListItemText primary="La exactitud de las descripciones de productos" />
              </ListItem>
              <ListItem>
                <ListItemText primary="El cumplimiento de las transacciones" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Disputas entre usuarios y comerciantes" />
              </ListItem>
            </List>
            <Typography variant="body1" paragraph>
              Las transacciones se realizan directamente entre usuarios y comerciantes. 
              Recomendamos verificar la reputación y políticas de los comerciantes antes de realizar compras.
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* 8. Propiedad Intelectual */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">
              8. Propiedad Intelectual
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" paragraph>
              El servicio y su contenido original, características y funcionalidad son propiedad de 
              AhorraYa VZ y están protegidos por derechos de autor, marcas comerciales y otras leyes.
            </Typography>
            <Typography variant="body1" paragraph>
              Los usuarios conservan los derechos sobre el contenido que publican, pero otorgan a 
              AhorraYa VZ una licencia para usar, mostrar y distribuir dicho contenido en la plataforma.
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* 9. Limitación de Responsabilidad */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">
              9. Limitación de Responsabilidad
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="body2">
                El servicio se proporciona "tal como está" sin garantías de ningún tipo.
              </Typography>
            </Alert>
            <Typography variant="body1" paragraph>
              En ningún caso AhorraYa VZ será responsable por daños indirectos, incidentales, 
              especiales, consecuentes o punitivos, incluyendo pero no limitado a:
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Pérdida de beneficios o datos" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Interrupción del negocio" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Daños por uso de información incorrecta" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Problemas derivados de transacciones con terceros" />
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        {/* 10. Modificaciones del Servicio */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">
              10. Modificaciones del Servicio
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" paragraph>
              Nos reservamos el derecho de modificar o discontinuar el servicio (o cualquier parte del mismo) 
              temporal o permanentemente, con o sin previo aviso.
            </Typography>
            <Typography variant="body1" paragraph>
              No seremos responsables ante usted o terceros por cualquier modificación, suspensión o 
              discontinuación del servicio.
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* 11. Terminación */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">
              11. Terminación
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" paragraph>
              Podemos terminar o suspender su cuenta inmediatamente, sin previo aviso o responsabilidad, 
              por cualquier motivo, incluyendo sin limitación si usted incumple los Términos.
            </Typography>
            <Typography variant="body1" paragraph>
              Al terminar, su derecho a usar el servicio cesará inmediatamente. Si desea terminar su cuenta, 
              puede simplemente dejar de usar el servicio o contactarnos para eliminar su cuenta.
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* 12. Ley Aplicable */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">
              12. Ley Aplicable y Jurisdicción
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" paragraph>
              Estos Términos se regirán e interpretarán de acuerdo con las leyes de la República 
              Bolivariana de Venezuela, sin tener en cuenta sus disposiciones sobre conflictos de leyes.
            </Typography>
            <Typography variant="body1" paragraph>
              Cualquier disputa que surja en relación con estos términos será sometida a la jurisdicción 
              exclusiva de los tribunales competentes de Venezuela.
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* 13. Contacto */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">
              13. Información de Contacto
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" paragraph>
              Si tiene preguntas sobre estos Términos y Condiciones, puede contactarnos:
            </Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary="Email: legal@ahorrayavz.com" 
                  secondary="Para consultas legales y términos de servicio"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Email: soporte@ahorrayavz.com" 
                  secondary="Para soporte técnico y consultas generales"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Teléfono: +58 (212) 555-0123" 
                  secondary="Horario de atención: Lunes a Viernes, 8:00 AM - 6:00 PM"
                />
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        <Divider sx={{ my: 4 }} />

        {/* Footer */}
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <Typography variant="body2" color="text.secondary" paragraph>
            Estos términos y condiciones son efectivos a partir del {lastUpdated}.
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Al continuar usando AhorraYa VZ, usted acepta estos términos y condiciones.
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
              onClick={() => navigate('/privacy')}
            >
              Ver Política de Privacidad
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Terms;