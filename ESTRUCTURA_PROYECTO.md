# Estructura Completa del Proyecto - AhorraYa VZ

## Estructura de Directorios del Frontend (React)

```
ahorrayavz-frontend/
├── public/
│   ├── favicon.ico
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── LoginForm.jsx
│   │   │   └── RegisterForm.jsx
│   │   ├── layout/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Layout.jsx
│   │   ├── products/
│   │   │   ├── ProductCard.jsx ✓
│   │   │   ├── ProductList.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── ProductFilter.jsx
│   │   │   └── ProductComparison.jsx
│   │   ├── stores/
│   │   │   ├── StoreCard.jsx
│   │   │   ├── StoreList.jsx
│   │   │   ├── StoreDetail.jsx
│   │   │   └── StoreMap.jsx
│   │   ├── search/
│   │   │   ├── SearchBar.jsx ✓
│   │   │   ├── SearchResults.jsx
│   │   │   ├── SearchFilters.jsx
│   │   │   └── SearchSuggestions.jsx
│   │   ├── shopping/
│   │   │   ├── ShoppingList.jsx
│   │   │   ├── ShoppingListItem.jsx
│   │   │   ├── ShoppingCart.jsx
│   │   │   └── PriceComparison.jsx
│   │   ├── dashboard/
│   │   │   ├── UserDashboard.jsx
│   │   │   ├── MerchantDashboard.jsx
│   │   │   ├── Statistics.jsx
│   │   │   └── Analytics.jsx
│   │   ├── maps/
│   │   │   ├── MapContainer.jsx
│   │   │   ├── StoreMarker.jsx
│   │   │   └── LocationPicker.jsx
│   │   └── common/
│   │       ├── Loading.jsx
│   │       ├── ErrorBoundary.jsx
│   │       ├── Notification.jsx
│   │       ├── Modal.jsx
│   │       └── Pagination.jsx
│   ├── pages/
│   │   ├── Home.jsx ✓
│   │   ├── Search.jsx ✓
│   │   ├── Login.jsx ✓
│   │   ├── Register.jsx ✓
│   │   ├── ProductDetail.jsx
│   │   ├── StoreDetail.jsx
│   │   ├── UserDashboard.jsx
│   │   ├── MerchantDashboard.jsx
│   │   ├── ShoppingLists.jsx
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── Privacy.jsx
│   │   ├── Terms.jsx
│   │   └── NotFound.jsx
│   ├── hooks/
│   │   ├── useWordPressAPI.js ✓
│   │   ├── useAuth.js
│   │   ├── useGeolocation.js
│   │   ├── useLocalStorage.js
│   │   ├── useDebounce.js
│   │   └── useInfiniteScroll.js
│   ├── contexts/
│   │   ├── AuthContext.jsx ✓
│   │   ├── ExchangeRateContext.jsx ✓
│   │   ├── NotificationContext.jsx ✓
│   │   ├── ThemeContext.jsx
│   │   └── GeolocationContext.jsx
│   ├── store/
│   │   ├── useStore.js ✓
│   │   ├── slices/
│   │   │   ├── authSlice.js
│   │   │   ├── productsSlice.js
│   │   │   ├── storesSlice.js
│   │   │   └── shoppingSlice.js
│   │   └── middleware/
│   │       ├── apiMiddleware.js
│   │       └── persistMiddleware.js
│   ├── services/
│   │   ├── api.js
│   │   ├── wordpressAPI.js
│   │   ├── exchangeRateAPI.js
│   │   ├── geolocationAPI.js
│   │   └── notificationService.js
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   ├── formatters.js
│   │   ├── validators.js
│   │   └── dateUtils.js
│   ├── styles/
│   │   ├── theme.js
│   │   ├── globals.css
│   │   └── components/
│   │       ├── ProductCard.css
│   │       ├── SearchBar.css
│   │       └── Dashboard.css
│   ├── assets/
│   │   ├── images/
│   │   │   ├── logo.svg
│   │   │   ├── hero-bg.jpg
│   │   │   └── placeholder.png
│   │   ├── icons/
│   │   │   ├── categories/
│   │   │   └── ui/
│   │   └── fonts/
│   ├── App.jsx ✓
│   ├── main.jsx ✓
│   └── index.css ✓
├── .env.example ✓
├── .env.local
├── .gitignore
├── package.json ✓
├── vite.config.js ✓
├── index.html ✓
├── README.md ✓
├── INSTALACION.md ✓
├── WORDPRESS_BACKEND.md ✓
├── ESTRUCTURA_PROYECTO.md ✓
└── eslint.config.js
```

## Estructura del Backend WordPress

```
ahorrayavz-wp/
├── wp-admin/
├── wp-content/
│   ├── themes/
│   │   └── ahorrayavz-theme/
│   │       ├── functions.php (con código personalizado) ✓
│   │       ├── style.css
│   │       ├── index.php
│   │       ├── header.php
│   │       ├── footer.php
│   │       └── screenshot.png
│   ├── plugins/
│   │   ├── advanced-custom-fields-pro/
│   │   ├── custom-post-type-ui/
│   │   ├── jwt-authentication-for-wp-rest-api/
│   │   ├── user-role-editor/
│   │   └── ahorrayavz-custom/
│   │       ├── ahorrayavz-custom.php
│   │       ├── includes/
│   │       │   ├── class-products.php
│   │       │   ├── class-stores.php
│   │       │   ├── class-shopping-lists.php
│   │       │   └── class-api-endpoints.php
│   │       └── assets/
│   ├── uploads/
│   │   ├── 2025/
│   │   │   └── 01/
│   │   └── acf-json/
│   └── mu-plugins/
│       └── ahorrayavz-core.php
├── wp-includes/
├── wp-config.php
├── .htaccess
├── index.php
└── wordpress-functions.php ✓ (código para copiar)
```

## Archivos de Configuración Creados

### ✅ Archivos Completados

1. **Frontend React:**
   - `package.json` - Dependencias y scripts
   - `vite.config.js` - Configuración de Vite
   - `index.html` - HTML base
   - `src/main.jsx` - Punto de entrada
   - `src/App.jsx` - Componente principal
   - `src/index.css` - Estilos globales
   - `src/store/useStore.js` - Estado global con Zustand
   - `src/hooks/useWordPressAPI.js` - Hooks para API
   - `src/contexts/` - Contextos de React
   - `src/components/` - Componentes principales
   - `src/pages/` - Páginas principales

2. **Backend WordPress:**
   - `wordpress-functions.php` - Código PHP completo
   - `WORDPRESS_BACKEND.md` - Documentación detallada

3. **Documentación:**
   - `README.md` - Documentación principal
   - `INSTALACION.md` - Guía de instalación
   - `ESTRUCTURA_PROYECTO.md` - Este archivo
   - `.env.example` - Variables de entorno

### 📋 Archivos Pendientes (Para Implementación Futura)

1. **Páginas adicionales:**
   - `src/pages/ProductDetail.jsx`
   - `src/pages/StoreDetail.jsx`
   - `src/pages/UserDashboard.jsx`
   - `src/pages/MerchantDashboard.jsx`
   - `src/pages/About.jsx`
   - `src/pages/Contact.jsx`

2. **Componentes adicionales:**
   - Componentes de mapas (Leaflet)
   - Dashboards de usuario y comercio
   - Gestión de listas de compras
   - Comparación de precios

3. **Funcionalidades avanzadas:**
   - Notificaciones push
   - Geolocalización avanzada
   - Analytics y estadísticas
   - Sistema de favoritos
   - Comentarios y reseñas

## Tecnologías Utilizadas

### Frontend
- **React 18** - Biblioteca principal
- **Vite** - Build tool y dev server
- **Material-UI (MUI)** - Componentes de UI
- **React Router DOM** - Enrutamiento
- **Zustand** - Gestión de estado
- **Axios** - Cliente HTTP
- **Leaflet** - Mapas interactivos

### Backend
- **WordPress 6.0+** - CMS headless
- **PHP 8.0+** - Lenguaje del servidor
- **MySQL/MariaDB** - Base de datos
- **Advanced Custom Fields** - Campos personalizados
- **JWT Authentication** - Autenticación API
- **Custom Post Types** - Tipos de contenido

### APIs Externas
- **PyDolarVe** - Tasa de cambio BCV
- **OpenStreetMap** - Datos de mapas
- **Nominatim** - Geocodificación

## Funcionalidades Implementadas

### ✅ Completadas

1. **Arquitectura Base:**
   - Configuración de React con Vite
   - Configuración de WordPress headless
   - Sistema de enrutamiento
   - Gestión de estado global

2. **Autenticación:**
   - Sistema de login/registro
   - Protección de rutas
   - Gestión de tokens JWT
   - Roles de usuario (cliente/comercio)

3. **Productos:**
   - Modelo de datos completo
   - API endpoints
   - Componente ProductCard
   - Búsqueda básica

4. **Tiendas:**
   - Modelo de datos con geolocalización
   - Sistema de categorías
   - Perfiles de tienda

5. **Tasa de Cambio:**
   - Integración con PyDolarVe
   - Sistema de caché
   - Actualización automática

6. **UI/UX:**
   - Diseño responsive
   - Tema personalizado venezolano
   - Componentes reutilizables
   - Sistema de notificaciones

### 🔄 En Desarrollo

1. **Búsqueda Avanzada:**
   - Filtros por categoría, precio, ubicación
   - Autocompletado
   - Resultados paginados

2. **Geolocalización:**
   - Detección automática de ubicación
   - Búsqueda por proximidad
   - Mapas interactivos

3. **Listas de Compras:**
   - Creación y gestión
   - Cálculo de totales
   - Compartir listas

### 📅 Planificadas

1. **Dashboard de Comercios:**
   - Gestión de productos
   - Estadísticas de ventas
   - Actualización de precios

2. **Funcionalidades Sociales:**
   - Sistema de favoritos
   - Comentarios y reseñas
   - Compartir productos

3. **Optimizaciones:**
   - PWA (Progressive Web App)
   - Caché offline
   - Optimización de imágenes

## Endpoints de la API

### WordPress REST API Nativa
```
GET    /wp-json/wp/v2/productos
GET    /wp-json/wp/v2/productos/{id}
POST   /wp-json/wp/v2/productos
PUT    /wp-json/wp/v2/productos/{id}
DELETE /wp-json/wp/v2/productos/{id}

GET    /wp-json/wp/v2/tiendas
GET    /wp-json/wp/v2/tiendas/{id}
POST   /wp-json/wp/v2/tiendas
PUT    /wp-json/wp/v2/tiendas/{id}
DELETE /wp-json/wp/v2/tiendas/{id}

GET    /wp-json/wp/v2/listas-compras
POST   /wp-json/wp/v2/listas-compras
PUT    /wp-json/wp/v2/listas-compras/{id}
DELETE /wp-json/wp/v2/listas-compras/{id}
```

### Endpoints Personalizados
```
GET    /wp-json/ahorraya/v1/tasa-bcv
GET    /wp-json/ahorraya/v1/buscar-productos
GET    /wp-json/ahorraya/v1/productos-cercanos
GET    /wp-json/ahorraya/v1/mis-listas
GET    /wp-json/ahorraya/v1/estadisticas-tienda/{id}
GET    /wp-json/ahorraya/v1/productos-destacados
GET    /wp-json/ahorraya/v1/tiendas-categoria/{categoria}
```

### Autenticación
```
POST   /wp-json/jwt-auth/v1/token
POST   /wp-json/jwt-auth/v1/token/validate
POST   /wp-json/wp/v2/users/register
```

## Variables de Entorno

### Frontend (.env)
```env
VITE_WP_API_URL=http://localhost/ahorrayavz-wp/wp-json
VITE_WP_BASE_URL=http://localhost/ahorrayavz-wp
VITE_APP_NAME=AhorraYa VZ
VITE_DEBUG=true
VITE_DEFAULT_LAT=10.4806
VITE_DEFAULT_LNG=-66.9036
```

### WordPress (wp-config.php)
```php
define('JWT_AUTH_SECRET_KEY', 'tu-clave-secreta');
define('JWT_AUTH_CORS_ENABLE', true);
define('WP_ENVIRONMENT_TYPE', 'development');
define('WP_DEBUG', true);
```

## Comandos de Desarrollo

### Frontend
```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Construcción
npm run build

# Preview
npm run preview
```

### WordPress
```bash
# Activar plugins
wp plugin activate advanced-custom-fields-pro
wp plugin activate custom-post-type-ui
wp plugin activate jwt-authentication-for-wp-rest-api

# Flush permalinks
wp rewrite flush

# Actualizar
wp core update
wp plugin update --all
```

## Próximos Pasos

1. **Completar páginas faltantes**
2. **Implementar dashboards**
3. **Agregar funcionalidades de mapas**
4. **Optimizar rendimiento**
5. **Agregar tests unitarios**
6. **Configurar CI/CD**
7. **Documentar API completa**
8. **Implementar PWA**

---

**Estado del Proyecto:** Base funcional completada ✅
**Fecha:** Enero 2025
**Versión:** 1.0.0-alpha