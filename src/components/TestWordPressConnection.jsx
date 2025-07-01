import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button,
  Grid,
  Chip
} from '@mui/material';
import { useWordPressAPI } from '../hooks/useWordPressAPI';
import { useExchangeRate } from '../contexts/ExchangeRateContext';

/**
 * Componente de prueba para verificar la conexión con WordPress
 * Muestra productos obtenidos desde la API de WordPress
 */
const TestWordPressConnection = () => {
  const [productos, setProductos] = useState([]);
  const [tiendas, setTiendas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('idle');
  
  const { apiClient } = useWordPressAPI();
  const { exchangeRate } = useExchangeRate();

  // Función para probar la conexión básica
  const testBasicConnection = async () => {
    setLoading(true);
    setError(null);
    setConnectionStatus('testing');
    
    try {
      // Probar conexión básica a la API
      const response = await apiClient.get('/');
      console.log('✅ Conexión básica exitosa:', response.data);
      setConnectionStatus('connected');
      return true;
    } catch (err) {
      console.error('❌ Error en conexión básica:', err);
      setError(`Error de conexión: ${err.message}`);
      setConnectionStatus('error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener productos
  const fetchProductos = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.get('/wp/v2/producto?_embed&per_page=5');
      console.log('✅ Productos obtenidos:', response.data);
      setProductos(response.data);
    } catch (err) {
      console.error('❌ Error obteniendo productos:', err);
      setError(`Error obteniendo productos: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener tiendas
  const fetchTiendas = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.get('/wp/v2/tienda?_embed&per_page=5');
      console.log('✅ Tiendas obtenidas:', response.data);
      setTiendas(response.data);
    } catch (err) {
      console.error('❌ Error obteniendo tiendas:', err);
      setError(`Error obteniendo tiendas: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener categorías
  const fetchCategorias = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.get('/wp/v2/categoria_producto?per_page=10');
      console.log('✅ Categorías obtenidas:', response.data);
      setCategorias(response.data);
    } catch (err) {
      console.error('❌ Error obteniendo categorías:', err);
      setError(`Error obteniendo categorías: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Función para formatear precios
  const formatPrice = (priceUsd, priceBs) => {
    const usdPrice = priceUsd || (exchangeRate.rate > 0 ? priceBs / exchangeRate.rate : 0);
    const bsPrice = priceBs || (exchangeRate.rate > 0 ? priceUsd * exchangeRate.rate : 0);
    
    return {
      usd: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(usdPrice),
      bs: new Intl.NumberFormat('es-VE', {
        style: 'currency',
        currency: 'VES'
      }).format(bsPrice)
    };
  };

  // Función para obtener campos ACF de un producto
  const getACFFields = (producto) => {
    return {
      precio_usd: producto.acf?.precio_usd || 0,
      precio_bs: producto.acf?.precio_bs || 0,
      marca: producto.acf?.marca || 'N/A',
      disponible: producto.acf?.disponible || false,
      stock: producto.acf?.stock || 0
    };
  };

  useEffect(() => {
    // Probar conexión al cargar el componente
    testBasicConnection();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        🧪 Prueba de Conexión WordPress
      </Typography>
      
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Este componente prueba la conexión entre React y WordPress.
      </Typography>

      {/* Estado de conexión */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📡 Estado de Conexión
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Chip 
              label={connectionStatus === 'connected' ? 'Conectado' : 
                     connectionStatus === 'testing' ? 'Probando...' :
                     connectionStatus === 'error' ? 'Error' : 'Sin probar'}
              color={connectionStatus === 'connected' ? 'success' : 
                     connectionStatus === 'error' ? 'error' : 'default'}
            />
            
            {exchangeRate.rate > 0 && (
              <Chip 
                label={`Tasa: ${exchangeRate.rate.toFixed(2)} Bs/$`}
                color="info"
              />
            )}
          </Box>
          
          <Button 
            variant="outlined" 
            onClick={testBasicConnection}
            disabled={loading}
            sx={{ mr: 1 }}
          >
            🔄 Probar Conexión
          </Button>
        </CardContent>
      </Card>

      {/* Controles de prueba */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🎮 Controles de Prueba
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              onClick={fetchProductos}
              disabled={loading || connectionStatus !== 'connected'}
            >
              📦 Obtener Productos
            </Button>
            
            <Button 
              variant="contained" 
              onClick={fetchTiendas}
              disabled={loading || connectionStatus !== 'connected'}
            >
              🏪 Obtener Tiendas
            </Button>
            
            <Button 
              variant="contained" 
              onClick={fetchCategorias}
              disabled={loading || connectionStatus !== 'connected'}
            >
              📂 Obtener Categorías
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Loading */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Productos */}
      {productos.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              📦 Productos ({productos.length})
            </Typography>
            
            <Grid container spacing={2}>
              {productos.map((producto) => {
                const acfFields = getACFFields(producto);
                const prices = formatPrice(acfFields.precio_usd, acfFields.precio_bs);
                
                return (
                  <Grid item xs={12} md={6} key={producto.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          {producto.title.rendered}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          ID: {producto.id} | Marca: {acfFields.marca}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                          <Chip label={prices.usd} color="primary" size="small" />
                          <Chip label={prices.bs} color="secondary" size="small" />
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Chip 
                            label={acfFields.disponible ? 'Disponible' : 'No disponible'}
                            color={acfFields.disponible ? 'success' : 'error'}
                            size="small"
                          />
                          <Chip label={`Stock: ${acfFields.stock}`} size="small" />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Tiendas */}
      {tiendas.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              🏪 Tiendas ({tiendas.length})
            </Typography>
            
            <Grid container spacing={2}>
              {tiendas.map((tienda) => (
                <Grid item xs={12} md={6} key={tienda.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        {tienda.title.rendered}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary">
                        ID: {tienda.id}
                      </Typography>
                      
                      {tienda.acf?.ubicacion && (
                        <Typography variant="body2">
                          📍 {tienda.acf.ubicacion}
                        </Typography>
                      )}
                      
                      {tienda.acf?.telefono && (
                        <Typography variant="body2">
                          📞 {tienda.acf.telefono}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Categorías */}
      {categorias.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              📂 Categorías ({categorias.length})
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {categorias.map((categoria) => (
                <Chip 
                  key={categoria.id}
                  label={`${categoria.name} (${categoria.count})`}
                  variant="outlined"
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default TestWordPressConnection;