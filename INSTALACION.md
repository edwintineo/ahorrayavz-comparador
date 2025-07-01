# Guía de Instalación - AhorraYa VZ

## Requisitos del Sistema

### Frontend (React)
- Node.js 18.0 o superior
- npm 8.0 o superior (o yarn 1.22+)
- Navegador web moderno

### Backend (WordPress)
- PHP 8.0 o superior
- MySQL 5.7 o superior / MariaDB 10.3+
- WordPress 6.0 o superior
- Servidor web (Apache/Nginx)
- SSL/HTTPS (recomendado para producción)

## Instalación del Frontend (React)

### 1. Clonar o descargar el proyecto
```bash
# Si tienes el proyecto en Git
git clone [URL_DEL_REPOSITORIO]
cd ahorrayavz-frontend

# O simplemente navegar a la carpeta del proyecto
cd "C:\Users\brimo\OneDrive\Escritorio\COMPARADOR con react 2025"
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
# Copiar el archivo de ejemplo
copy .env.example .env

# Editar el archivo .env con tus configuraciones
# Ejemplo para desarrollo local:
VITE_WP_API_URL=http://localhost/ahorrayavz-wp/wp-json
VITE_WP_BASE_URL=http://localhost/ahorrayavz-wp
VITE_APP_NAME=AhorraYa VZ
VITE_DEBUG=true
```

### 4. Ejecutar en modo desarrollo
```bash
npm run dev
```

El frontend estará disponible en: `http://localhost:3000`

### 5. Construir para producción
```bash
npm run build
```

## Instalación del Backend (WordPress)

### 1. Instalar WordPress

#### Opción A: Instalación Local (XAMPP/WAMP)
1. Descargar e instalar XAMPP desde https://www.apachefriends.org/
2. Iniciar Apache y MySQL
3. Crear base de datos:
   ```sql
   CREATE DATABASE ahorrayavz_wp;
   CREATE USER 'ahorrayavz'@'localhost' IDENTIFIED BY 'password_seguro';
   GRANT ALL PRIVILEGES ON ahorrayavz_wp.* TO 'ahorrayavz'@'localhost';
   FLUSH PRIVILEGES;
   ```
4. Descargar WordPress desde https://wordpress.org/download/
5. Extraer en `C:\xampp\htdocs\ahorrayavz-wp\`
6. Configurar `wp-config.php`

#### Opción B: Hosting/Servidor
1. Subir archivos de WordPress al servidor
2. Crear base de datos desde el panel de control
3. Configurar `wp-config.php`

### 2. Configurar wp-config.php
```php
<?php
// Configuración de base de datos
define('DB_NAME', 'ahorrayavz_wp');
define('DB_USER', 'ahorrayavz');
define('DB_PASSWORD', 'password_seguro');
define('DB_HOST', 'localhost');
define('DB_CHARSET', 'utf8mb4');
define('DB_COLLATE', '');

// Claves de seguridad (generar en https://api.wordpress.org/secret-key/1.1/salt/)
define('AUTH_KEY', 'tu-clave-auth');
define('SECURE_AUTH_KEY', 'tu-clave-secure-auth');
// ... (agregar todas las claves)

// Configuración para API REST
define('JWT_AUTH_SECRET_KEY', 'tu-clave-jwt-muy-segura');
define('JWT_AUTH_CORS_ENABLE', true);

// Configuración de entorno
define('WP_ENVIRONMENT_TYPE', 'development'); // o 'production'
define('WP_DEBUG', WP_ENVIRONMENT_TYPE === 'development');
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);

// URLs
if (WP_ENVIRONMENT_TYPE === 'development') {
    define('WP_HOME', 'http://localhost/ahorrayavz-wp');
    define('WP_SITEURL', 'http://localhost/ahorrayavz-wp');
} else {
    define('WP_HOME', 'https://api.ahorrayavz.com');
    define('WP_SITEURL', 'https://api.ahorrayavz.com');
}

// Configuración de tabla
$table_prefix = 'wp_';

// WordPress
if (!defined('ABSPATH')) {
    define('ABSPATH', __DIR__ . '/');
}
require_once ABSPATH . 'wp-settings.php';
?>
```

### 3. Instalar plugins requeridos

#### Plugins esenciales:
1. **Advanced Custom Fields (ACF) Pro**
   - Descargar desde https://www.advancedcustomfields.com/
   - Subir e instalar el plugin
   - Activar licencia

2. **Custom Post Type UI**
   ```bash
   # Desde wp-admin > Plugins > Agregar nuevo
   # Buscar "Custom Post Type UI" e instalar
   ```

3. **JWT Authentication for WP REST API**
   ```bash
   # Descargar desde:
   # https://github.com/Tmeister/wp-api-jwt-auth
   # Subir como plugin
   ```

4. **User Role Editor**
   ```bash
   # Desde wp-admin > Plugins > Agregar nuevo
   # Buscar "User Role Editor" e instalar
   ```

### 4. Configurar .htaccess
```apache
# WordPress .htaccess
RewriteEngine On
RewriteBase /ahorrayavz-wp/

# Reglas para WordPress
RewriteRule ^index\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /ahorrayavz-wp/index.php [L]

# Configuración para JWT
RewriteCond %{HTTP:Authorization} ^(.*)
RewriteRule ^(.*) - [E=HTTP_AUTHORIZATION:%1]

# Headers de seguridad
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
```

### 5. Agregar código personalizado

1. **Copiar código de functions.php**
   ```bash
   # Copiar el contenido de wordpress-functions.php
   # Al archivo functions.php del tema activo
   ```

2. **Activar tema compatible**
   - Usar un tema headless como "Headless" o "Twenty Twenty-Four"
   - O crear un tema mínimo personalizado

### 6. Configurar Custom Post Types y ACF

#### Usando Custom Post Type UI:
1. Ir a `wp-admin > CPT UI > Add/Edit Post Types`
2. Crear los CPTs según la documentación en `WORDPRESS_BACKEND.md`

#### Configurar ACF:
1. Ir a `wp-admin > Custom Fields > Field Groups`
2. Crear los grupos de campos según la documentación

### 7. Configurar roles de usuario

#### Usando User Role Editor:
1. Ir a `wp-admin > Users > User Role Editor`
2. Crear roles "cliente" y "comercio"
3. Asignar capacidades según la documentación

### 8. Probar la API

```bash
# Probar endpoints básicos
curl http://localhost/ahorrayavz-wp/wp-json/wp/v2/productos
curl http://localhost/ahorrayavz-wp/wp-json/ahorraya/v1/tasa-bcv
```

## Configuración de Producción

### 1. Seguridad

```php
// En wp-config.php
define('DISALLOW_FILE_EDIT', true);
define('WP_DEBUG', false);
define('WP_DEBUG_LOG', false);
define('WP_DEBUG_DISPLAY', false);

// Limitar intentos de login
define('WP_LOGIN_ATTEMPTS', 3);
```

### 2. Optimización

```php
// Caché
define('WP_CACHE', true);
define('ENABLE_CACHE', true);

// Compresión
define('COMPRESS_CSS', true);
define('COMPRESS_SCRIPTS', true);
```

### 3. SSL/HTTPS

```php
// Forzar HTTPS
define('FORCE_SSL_ADMIN', true);

// En .htaccess
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

### 4. Backup

```bash
# Configurar backups automáticos
# Base de datos
mysqldump -u usuario -p ahorrayavz_wp > backup_$(date +%Y%m%d).sql

# Archivos
tar -czf backup_files_$(date +%Y%m%d).tar.gz /path/to/wordpress/
```

## Solución de Problemas Comunes

### 1. Error de CORS
```javascript
// Verificar configuración en functions.php
// Asegurar que el origen esté en la lista permitida
```

### 2. Error 404 en endpoints
```bash
# Regenerar permalinks
# wp-admin > Settings > Permalinks > Save Changes
```

### 3. Error de autenticación JWT
```php
// Verificar que JWT_AUTH_SECRET_KEY esté definido
// Verificar configuración de .htaccess
```

### 4. Problemas de permisos
```bash
# Linux/Mac
chmod 755 wp-content/
chmod 644 wp-config.php

# Windows
# Configurar permisos desde Propiedades > Seguridad
```

### 5. Error de memoria PHP
```php
// En wp-config.php
ini_set('memory_limit', '256M');
define('WP_MEMORY_LIMIT', '256M');
```

## Comandos Útiles

### Frontend
```bash
# Desarrollo
npm run dev

# Construcción
npm run build

# Preview de producción
npm run preview

# Linting
npm run lint

# Actualizar dependencias
npm update
```

### WordPress
```bash
# WP-CLI (si está instalado)
wp core update
wp plugin update --all
wp theme update --all
wp db optimize
```

## Monitoreo y Mantenimiento

### 1. Logs importantes
- Frontend: Consola del navegador
- WordPress: `wp-content/debug.log`
- Servidor: logs de Apache/Nginx

### 2. Métricas a monitorear
- Tiempo de respuesta de la API
- Uso de memoria PHP
- Tamaño de la base de datos
- Tasa de errores 404/500

### 3. Mantenimiento regular
- Actualizar WordPress, plugins y temas
- Limpiar base de datos (spam, revisiones)
- Optimizar imágenes
- Verificar backups
- Revisar logs de errores

## Contacto y Soporte

Para problemas técnicos o consultas:
- Documentación: Ver archivos README.md y WORDPRESS_BACKEND.md
- Issues: Crear issue en el repositorio del proyecto
- Email: [tu-email@dominio.com]

---

**Nota**: Esta guía asume un entorno de desarrollo local. Para producción, considera usar servicios administrados como WordPress.com, WP Engine, o configurar un servidor VPS con las mejores prácticas de seguridad.