# AhorraYa VZ - Comparador de Precios

## Descripción del Proyecto

AhorraYa VZ es un comparador de precios diseñado específicamente para el mercado venezolano. Permite a los usuarios encontrar los mejores precios de productos en diferentes categorías (supermercados, farmacias, ferreterías, licorerías, etc.) con visualización dual de moneda (Bs. y USD).

## Arquitectura del Sistema

### Frontend (React)
- **Framework**: React 18+ con Vite
- **Enrutamiento**: React Router DOM
- **HTTP Client**: Axios
- **Estado Global**: Zustand
- **UI Framework**: Material-UI (MUI)
- **Mapas**: React Leaflet

### Backend (WordPress Headless)
- **CMS**: WordPress (última versión)
- **API**: WordPress REST API + endpoints personalizados
- **Autenticación**: JWT Authentication for WP REST API
- **Custom Post Types**: Productos, Tiendas, Listas de Compras
- **Campos Personalizados**: Advanced Custom Fields (ACF)
- **Roles de Usuario**: Cliente, Comercio (User Role Editor)

### APIs Externas
- **Tasa de Cambio**: PyDolarVe API (BCV)
- **Geolocalización**: Navegador + OpenStreetMap

## Estructura del Proyecto

```
ahorrayavz/
├── frontend/          # Aplicación React
├── backend/           # WordPress headless
├── docs/              # Documentación
└── README.md
```

## Instalación y Configuración

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
1. Instalar WordPress
2. Activar plugins requeridos
3. Configurar Custom Post Types y ACF
4. Configurar autenticación JWT

## Funcionalidades Principales

### Para Usuarios
- Búsqueda avanzada de productos
- Comparación de precios en tiempo real
- Visualización dual de moneda (Bs./USD)
- Geolocalización de tiendas
- Listas de compras personalizadas
- Panel de usuario

### Para Comercios
- Dashboard de gestión
- Subida de productos e inventario
- Actualización de precios
- Perfil público de tienda
- Suscripción premium

## Tecnologías Utilizadas

- React 18+
- Vite
- Material-UI
- Zustand
- Axios
- React Router DOM
- WordPress
- Advanced Custom Fields
- JWT Authentication
- Custom Post Type UI

## Licencia

MIT License