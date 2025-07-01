# WordPress Backend - AhorraYa VZ

## Configuración del Backend WordPress Headless

### 1. Instalación y Configuración Inicial

#### Requisitos
- WordPress 6.0 o superior
- PHP 8.0 o superior
- MySQL 5.7 o superior
- Servidor web (Apache/Nginx)

#### Plugins Requeridos
```bash
# Plugins esenciales para instalar
1. Advanced Custom Fields (ACF) Pro
2. Custom Post Type UI
3. JWT Authentication for WP REST API
4. User Role Editor
5. WP REST API Controller (opcional)
6. Yoast SEO (opcional)
```

### 2. Custom Post Types (CPTs)

#### 2.1 CPT: Productos
```php
// Configuración en Custom Post Type UI o functions.php
Slug: productos
Plural Label: Productos
Singular Label: Producto
Public: true
Show in REST: true
REST Base: productos
Supports: title, editor, thumbnail, custom-fields
Hierarchical: false
Menu Icon: dashicons-cart
```

#### 2.2 CPT: Tiendas
```php
Slug: tiendas
Plural Label: Tiendas
Singular Label: Tienda
Public: true
Show in REST: true
REST Base: tiendas
Supports: title, editor, thumbnail, custom-fields
Hierarchical: false
Menu Icon: dashicons-store
```

#### 2.3 CPT: Listas de Compras
```php
Slug: listas-compras
Plural Label: Listas de Compras
Singular Label: Lista de Compras
Public: false
Show in REST: true
REST Base: listas-compras
Supports: title, custom-fields
Hierarchical: false
Menu Icon: dashicons-list-view
```

### 3. Advanced Custom Fields (ACF)

#### 3.1 Campos para Productos
```php
// Grupo de campos: Información del Producto
Field Group: producto_info
Location: Post Type = productos

Campos:
1. precio_bolivares (Number)
   - Label: Precio en Bolívares
   - Required: Yes
   - Min: 0
   - Step: 0.01

2. precio_usd (Number)
   - Label: Precio en USD
   - Required: No
   - Min: 0
   - Step: 0.01

3. categoria (Select)
   - Label: Categoría
   - Choices: Supermercado, Farmacia, Ferretería, Licorería, Panadería, etc.
   - Required: Yes

4. marca (Text)
   - Label: Marca
   - Required: No

5. codigo_barras (Text)
   - Label: Código de Barras
   - Required: No

6. unidad_medida (Select)
   - Label: Unidad de Medida
   - Choices: Unidad, Kg, Gramos, Litros, ml, etc.

7. peso_volumen (Number)
   - Label: Peso/Volumen
   - Required: No

8. tienda_asociada (Post Object)
   - Label: Tienda
   - Post Type: tiendas
   - Required: Yes

9. disponible (True/False)
   - Label: Disponible
   - Default: Yes

10. fecha_actualizacion (Date Picker)
    - Label: Última Actualización de Precio
    - Required: Yes
    - Default: Today

11. imagen_producto (Image)
    - Label: Imagen del Producto
    - Return Format: Array
```

#### 3.2 Campos para Tiendas
```php
// Grupo de campos: Información de la Tienda
Field Group: tienda_info
Location: Post Type = tiendas

Campos:
1. direccion (Textarea)
   - Label: Dirección
   - Required: Yes

2. telefono (Text)
   - Label: Teléfono
   - Required: No

3. email (Email)
   - Label: Email
   - Required: No

4. horarios (Textarea)
   - Label: Horarios de Atención
   - Required: No

5. latitud (Number)
   - Label: Latitud
   - Required: Yes
   - Step: 0.000001

6. longitud (Number)
   - Label: Longitud
   - Required: Yes
   - Step: 0.000001

7. logo_tienda (Image)
   - Label: Logo de la Tienda
   - Return Format: Array

8. categoria_tienda (Select)
   - Label: Tipo de Tienda
   - Choices: Supermercado, Farmacia, Ferretería, etc.
   - Required: Yes

9. es_premium (True/False)
   - Label: Tienda Premium
   - Default: No

10. calificacion (Number)
    - Label: Calificación
    - Min: 0
    - Max: 5
    - Step: 0.1
    - Default: 0

11. propietario (User)
    - Label: Propietario
    - Role: comercio
    - Required: Yes

12. redes_sociales (Repeater)
    - Label: Redes Sociales
    - Sub Fields:
      - red_social (Select): Facebook, Instagram, Twitter, WhatsApp
      - url (URL): Enlace
```

#### 3.3 Campos para Listas de Compras
```php
// Grupo de campos: Lista de Compras
Field Group: lista_compras_info
Location: Post Type = listas-compras

Campos:
1. usuario_propietario (User)
   - Label: Usuario Propietario
   - Required: Yes

2. productos_lista (Repeater)
   - Label: Productos en la Lista
   - Sub Fields:
     - producto (Post Object): Post Type = productos
     - cantidad (Number): Min = 1
     - notas (Textarea): Opcional

3. total_estimado_bs (Number)
   - Label: Total Estimado (Bs.)
   - Readonly: Yes

4. total_estimado_usd (Number)
   - Label: Total Estimado (USD)
   - Readonly: Yes

5. fecha_creacion (Date Picker)
   - Label: Fecha de Creación
   - Default: Today

6. es_publica (True/False)
   - Label: Lista Pública
   - Default: No
```

### 4. Roles de Usuario Personalizados

#### 4.1 Rol: Cliente
```php
// Configuración con User Role Editor
Role Name: cliente
Display Name: Cliente

Capabilities:
- read
- edit_posts (solo sus propias listas)
- delete_posts (solo sus propias listas)
- upload_files
- edit_listas_compras
- delete_listas_compras
- publish_listas_compras
```

#### 4.2 Rol: Comercio
```php
Role Name: comercio
Display Name: Comercio

Capabilities:
- read
- edit_posts
- delete_posts
- upload_files
- edit_productos
- delete_productos
- publish_productos
- edit_tiendas (solo su tienda)
- delete_tiendas (solo su tienda)
- publish_tiendas
- edit_others_productos (solo de su tienda)
- delete_others_productos (solo de su tienda)
```

### 5. Endpoints de la API REST

#### 5.1 Endpoints Nativos de WordPress
```php
// Productos
GET    /wp-json/wp/v2/productos
GET    /wp-json/wp/v2/productos/{id}
POST   /wp-json/wp/v2/productos
PUT    /wp-json/wp/v2/productos/{id}
DELETE /wp-json/wp/v2/productos/{id}

// Tiendas
GET    /wp-json/wp/v2/tiendas
GET    /wp-json/wp/v2/tiendas/{id}
POST   /wp-json/wp/v2/tiendas
PUT    /wp-json/wp/v2/tiendas/{id}
DELETE /wp-json/wp/v2/tiendas/{id}

// Listas de Compras
GET    /wp-json/wp/v2/listas-compras
GET    /wp-json/wp/v2/listas-compras/{id}
POST   /wp-json/wp/v2/listas-compras
PUT    /wp-json/wp/v2/listas-compras/{id}
DELETE /wp-json/wp/v2/listas-compras/{id}

// Usuarios
GET    /wp-json/wp/v2/users
POST   /wp-json/wp/v2/users

// Autenticación JWT
POST   /wp-json/jwt-auth/v1/token
POST   /wp-json/jwt-auth/v1/token/validate
```

#### 5.2 Endpoints Personalizados
```php
// Tasa de cambio BCV
GET    /wp-json/ahorraya/v1/tasa-bcv

// Búsqueda avanzada de productos
GET    /wp-json/ahorraya/v1/buscar-productos

// Productos por geolocalización
GET    /wp-json/ahorraya/v1/productos-cercanos

// Estadísticas para comercios
GET    /wp-json/ahorraya/v1/estadisticas-tienda/{id}

// Gestión de listas de compras
GET    /wp-json/ahorraya/v1/mis-listas
POST   /wp-json/ahorraya/v1/agregar-producto-lista
DELETE /wp-json/ahorraya/v1/remover-producto-lista

// Productos destacados
GET    /wp-json/ahorraya/v1/productos-destacados

// Tiendas por categoría
GET    /wp-json/ahorraya/v1/tiendas-categoria/{categoria}
```

### 6. Configuración de Autenticación

#### 6.1 JWT Authentication
```php
// En wp-config.php
define('JWT_AUTH_SECRET_KEY', 'tu-clave-secreta-muy-segura');
define('JWT_AUTH_CORS_ENABLE', true);

// En .htaccess
RewriteEngine On
RewriteCond %{HTTP:Authorization} ^(.*)
RewriteRule ^(.*) - [E=HTTP_AUTHORIZATION:%1]
```

#### 6.2 CORS Configuration
```php
// En functions.php
function add_cors_http_header(){
    header("Access-Control-Allow-Origin: http://localhost:3000");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Access-Control-Allow-Credentials: true");
}
add_action('init','add_cors_http_header');
```

### 7. Configuración de Caché y Optimización

#### 7.1 Transients para Tasa de Cambio
```php
// Configuración de caché
define('WP_CACHE_KEY_SALT', 'ahorraya_vz_');

// Tiempo de caché para tasa de cambio: 1 hora
define('EXCHANGE_RATE_CACHE_TIME', 3600);
```

#### 7.2 WP-Cron para Actualización Automática
```php
// Configurar cron job para actualizar tasa cada hora
if (!wp_next_scheduled('actualizar_tasa_bcv')) {
    wp_schedule_event(time(), 'hourly', 'actualizar_tasa_bcv');
}
```

### 8. Configuración de Seguridad

#### 8.1 Permisos de API
```php
// Restringir acceso a endpoints sensibles
function restrict_api_access($result, $server, $request) {
    $route = $request->get_route();
    
    // Rutas que requieren autenticación
    $protected_routes = [
        '/wp-json/wp/v2/listas-compras',
        '/wp-json/ahorraya/v1/mis-listas',
        '/wp-json/ahorraya/v1/estadisticas-tienda'
    ];
    
    if (in_array($route, $protected_routes) && !is_user_logged_in()) {
        return new WP_Error('rest_forbidden', 'Acceso no autorizado', ['status' => 401]);
    }
    
    return $result;
}
add_filter('rest_pre_dispatch', 'restrict_api_access', 10, 3);
```

#### 8.2 Validación de Datos
```php
// Sanitización automática de campos ACF
function sanitize_acf_fields($value, $post_id, $field) {
    if ($field['type'] === 'number') {
        return floatval($value);
    }
    if ($field['type'] === 'email') {
        return sanitize_email($value);
    }
    if ($field['type'] === 'url') {
        return esc_url_raw($value);
    }
    return sanitize_text_field($value);
}
add_filter('acf/update_value', 'sanitize_acf_fields', 10, 3);
```

### 9. Base de Datos

#### 9.1 Tablas Personalizadas (Opcional)
```sql
-- Tabla para estadísticas de productos
CREATE TABLE wp_ahorraya_product_stats (
    id bigint(20) NOT NULL AUTO_INCREMENT,
    product_id bigint(20) NOT NULL,
    views int(11) DEFAULT 0,
    searches int(11) DEFAULT 0,
    date_created datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY product_id (product_id)
);

-- Tabla para historial de precios
CREATE TABLE wp_ahorraya_price_history (
    id bigint(20) NOT NULL AUTO_INCREMENT,
    product_id bigint(20) NOT NULL,
    price_bs decimal(10,2) NOT NULL,
    price_usd decimal(10,2),
    date_recorded datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY product_id (product_id),
    KEY date_recorded (date_recorded)
);
```

### 10. Configuración de Desarrollo vs Producción

#### 10.1 Variables de Entorno
```php
// En wp-config.php
define('WP_ENVIRONMENT_TYPE', 'development'); // o 'production'
define('WP_DEBUG', WP_ENVIRONMENT_TYPE === 'development');
define('WP_DEBUG_LOG', WP_ENVIRONMENT_TYPE === 'development');
define('WP_DEBUG_DISPLAY', false);

// URLs según entorno
if (WP_ENVIRONMENT_TYPE === 'development') {
    define('WP_HOME', 'http://localhost/ahorrayavz-wp');
    define('WP_SITEURL', 'http://localhost/ahorrayavz-wp');
} else {
    define('WP_HOME', 'https://api.ahorrayavz.com');
    define('WP_SITEURL', 'https://api.ahorrayavz.com');
}
```

Esta configuración proporciona una base sólida para el backend WordPress headless de AhorraYa VZ, con todas las funcionalidades requeridas para el comparador de precios.