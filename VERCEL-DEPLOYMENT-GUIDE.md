# Guía de Despliegue en Vercel - AhorraYa VZ

## Configuración Recomendada para Vercel

### 1. Variables de Entorno en Vercel

En el dashboard de Vercel, ve a **Settings > Environment Variables** y configura:

```env
# WordPress (temporalmente deshabilitado)
VITE_WP_API_URL=
VITE_WP_BASE_URL=

# Configuración de la aplicación
VITE_APP_NAME=AhorraYa VZ
VITE_APP_VERSION=1.0.0

# API de tasa de cambio
VITE_EXCHANGE_API_URL=https://pydolarve.org/api/v1/dollar?page=bcv&monitor=usd

# Configuración de mapas (Caracas, Venezuela)
VITE_DEFAULT_LAT=10.4806
VITE_DEFAULT_LNG=-66.9036
VITE_DEFAULT_ZOOM=10

# Configuración de producción
VITE_DEBUG=false
NODE_ENV=production
```

### 2. Configuración de Build

Asegúrate de que tu `vercel.json` contenga:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 3. Comandos de Build

Vercel debería usar automáticamente:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## Solución de Problemas Comunes

### Problema: Página en Blanco

**Causas Posibles:**
1. Errores de JavaScript no capturados
2. Variables de entorno mal configuradas
3. Problemas de routing en SPA
4. Errores de build no detectados

**Soluciones Implementadas:**
1. ✅ Manejo de errores en todos los hooks
2. ✅ Variables de entorno con valores por defecto
3. ✅ Configuración correcta de rewrites para SPA
4. ✅ Datos de ejemplo cuando APIs no están disponibles

### Problema: Errores de Conexión a WordPress

**Solución:**
- Las URLs de WordPress están vacías intencionalmente
- La aplicación detecta automáticamente cuando WordPress no está configurado
- Se muestran datos de ejemplo en lugar de errores

### Problema: Errores de Build

**Verificaciones:**
1. Todas las dependencias están en `package.json`
2. No hay imports de archivos inexistentes
3. Todas las variables de entorno tienen valores por defecto
4. El código es compatible con el entorno de producción

## Verificación Post-Despliegue

### 1. Funcionalidades que Deben Funcionar
- ✅ Página de inicio con datos de ejemplo
- ✅ Navegación entre páginas
- ✅ Búsqueda (interfaz)
- ✅ Lista de compras (local)
- ✅ Tasa de cambio de ejemplo
- ✅ Responsive design

### 2. Mensaje de Modo Demostración
La aplicación debe mostrar un mensaje informativo indicando:
> "⚠️ Modo de Demostración: WordPress no está configurado. Se están mostrando datos de ejemplo. Para conectar con WordPress, configura VITE_WP_API_URL en las variables de entorno."

### 3. Datos de Ejemplo Visibles
- **Productos**: 6 productos de diferentes categorías
- **Tiendas**: 4 tiendas con información completa
- **Tasa de Cambio**: 50.00 Bs/USD

## Logs y Debugging

### En Vercel Dashboard
1. Ve a **Functions** para ver logs de build
2. Revisa **Deployments** para errores específicos
3. Usa **Preview** para probar antes de producción

### En el Navegador
1. Abre **Developer Tools > Console**
2. Busca errores de JavaScript
3. Verifica que no hay errores 404 en **Network**

## Próximos Pasos

### Para Conectar WordPress Real
1. Configura WordPress en un servidor
2. Actualiza las variables de entorno en Vercel:
   ```env
   VITE_WP_API_URL=https://tu-wordpress.com/wp-json
   VITE_WP_BASE_URL=https://tu-wordpress.com
   ```
3. Redeploy la aplicación
4. Verifica que la conexión funciona correctamente

### Para Mejorar el Rendimiento
1. Optimizar imágenes
2. Implementar lazy loading
3. Configurar CDN para assets estáticos
4. Implementar service worker para PWA

## Contacto y Soporte

Si encuentras problemas:
1. Revisa los logs de Vercel
2. Verifica la configuración de variables de entorno
3. Asegúrate de que el último commit incluye todas las mejoras
4. Consulta este archivo para soluciones comunes

---

**Nota**: Esta configuración permite que la aplicación funcione completamente sin WordPress, mostrando datos de ejemplo y manteniendo toda la funcionalidad de la interfaz de usuario.