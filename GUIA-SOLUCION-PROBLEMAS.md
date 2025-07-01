# 🛠️ Guía de Solución de Problemas - AhorraYa VZ

## 🚨 Problemas Comunes y Soluciones

### 1️⃣ Problemas de Desarrollo Local

#### ❌ "npm: command not found"
**Causa:** Node.js no está instalado
**Solución:**
1. Descargar Node.js: https://nodejs.org
2. Instalar versión LTS (recomendada)
3. Reiniciar terminal
4. Verificar: `node --version` y `npm --version`

#### ❌ "Error: Cannot find module"
**Causa:** Dependencias no instaladas
**Solución:**
```bash
# Eliminar node_modules y package-lock.json
rm -rf node_modules package-lock.json

# Reinstalar dependencias
npm install

# Si persiste, usar npm ci
npm ci
```

#### ❌ "Port 3000 is already in use"
**Causa:** Puerto ocupado
**Solución:**
```bash
# Opción 1: Usar otro puerto
npm run dev -- --port 3001

# Opción 2: Matar proceso en puerto 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# Opción 3: Matar proceso en puerto 3000 (Mac/Linux)
lsof -ti:3000 | xargs kill -9
```

#### ❌ "VITE_* variables not defined"
**Causa:** Archivo .env no se está cargando
**Solución:**
1. Verificar que `.env` esté en la raíz del proyecto
2. Verificar que las variables empiecen con `VITE_`
3. Reiniciar el servidor de desarrollo
4. Verificar sintaxis del .env (sin espacios alrededor del =)

### 2️⃣ Problemas de Conexión con WordPress

#### ❌ "CORS Error" / "Access blocked by CORS policy"
**Causa:** WordPress no permite conexiones desde tu dominio
**Solución:**

**En WordPress (functions.php o plugin):**
```php
function configurar_cors_headers() {
    $allowed_origins = [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://tu-app.vercel.app'
    ];
    
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    
    if (in_array($origin, $allowed_origins)) {
        header("Access-Control-Allow-Origin: $origin");
    }
    
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Allow-Credentials: true');
    
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        exit(0);
    }
}
add_action('init', 'configurar_cors_headers');
```

#### ❌ "404 Not Found" en API de WordPress
**Causa:** Permalinks o API REST deshabilitada
**Solución:**
1. **WordPress Admin → Settings → Permalinks**
2. **Cambiar** a "Post name" o "Custom Structure"
3. **Save Changes**
4. **Verificar** que la API funcione: `https://tu-wordpress.com/wp-json/wp/v2/posts`

#### ❌ "Empty response" de WordPress
**Causa:** No hay contenido o plugin ACF no activo
**Solución:**
1. **Verificar** que ACF esté activo
2. **Crear** al menos un producto de prueba
3. **Verificar** que los custom fields estén configurados
4. **Test manual:** `https://tu-wordpress.com/wp-json/wp/v2/productos`

### ❌ **Problema 2: Tipos de Post No Registrados**
**Síntoma:** Error "Tipo de post 'producto' no existe"

**Solución:**
```
1. Usa el plugin "Diagnóstico Completo"
2. Haz clic en "Reparación Automática"
3. O instala "Custom Post Type UI" plugin
4. Crea tipos de post: 'producto' y 'tienda'
```

### ❌ **Problema 3: Taxonomía No Existe**
**Síntoma:** Error "Taxonomía 'categoria_producto' no existe"

**Solución:**
```
1. Usa la "Reparación Automática" del diagnóstico
2. O crea manualmente la taxonomía 'categoria_producto'
```

### ❌ **Problema 4: Campos ACF No Configurados**
**Síntoma:** Se crean posts pero sin campos personalizados

**Solución:**
```
1. Ve a Campos Personalizados → Grupos de Campos
2. Crea grupos para 'producto' y 'tienda'
3. Añade campos: precio_usd, precio_bs, marca, etc.
```

## 🔧 **Herramientas de Diagnóstico Disponibles**

### 📊 **Plugin de Diagnóstico Completo**
- **Archivo:** `diagnostico-completo-plugin.php`
- **Función:** Identifica todos los problemas
- **Incluye:** Reparación automática
- **Ubicación:** Herramientas → Diagnóstico Completo

### 🧪 **Plugin de Contenido Mejorado**
- **Archivo:** `test-content-plugin.php` (v2.0)
- **Función:** Crea contenido con logging detallado
- **Incluye:** Verificación de requisitos
- **Ubicación:** Herramientas → Contenido de Prueba Mejorado

### ⚙️ **Plugin de Configuración Automática**
- **Archivo:** `configuracion-automatica-plugin.php`
- **Función:** Configura tipos de post y campos ACF
- **Incluye:** Interfaz de verificación
- **Ubicación:** Herramientas → Configuración Automática

## 📝 **Proceso de Solución Recomendado**

### **Opción A: Solución Rápida (Recomendada)**
```
1. Activa: diagnostico-completo-plugin.php
2. Ve a: Herramientas → Diagnóstico Completo
3. Ejecuta: "Diagnóstico Completo"
4. Si hay problemas, ejecuta: "Reparación Automática"
5. Activa: test-content-plugin.php
6. Ve a: Herramientas → Contenido de Prueba Mejorado
7. Ejecuta: "Crear Contenido de Prueba"
8. Revisa el log detallado
```

### **Opción B: Configuración Manual**
```
1. Instala y activa ACF
2. Usa configuracion-automatica-plugin.php
3. Configura tipos de post y campos
4. Usa test-content-plugin.php para crear contenido
```

## 🎯 **Verificación Final**

Después de seguir los pasos, verifica que todo funcione:

1. **Ve a:** Posts → Productos
   - **Deberías ver:** 5 productos creados

2. **Ve a:** Posts → Tiendas
   - **Deberías ver:** 4 tiendas creadas

3. **Ve a:** Productos → Categorías de Producto
   - **Deberías ver:** 4 categorías creadas

4. **Edita un producto** y verifica que tenga:
   - Campos de precio (USD y Bs)
   - Marca, stock, disponibilidad
   - Tienda asignada
   - Categoría asignada

## 🚀 **Próximos Pasos**

Una vez que tengas contenido de prueba:

1. **Prueba el frontend de React:**
   ```bash
   cd frontend
   npm start
   ```

2. **Verifica la conversión de precios:**
   - Abre el frontend
   - Busca productos
   - Verifica que los precios se conviertan correctamente

3. **Prueba las funcionalidades:**
   - Filtros por categoría
   - Búsqueda de productos
   - Comparación de precios
   - Información de tiendas

## 📞 **Soporte Adicional**

Si sigues teniendo problemas:

1. **Ejecuta el diagnóstico completo** y comparte el reporte
2. **Revisa el log detallado** del plugin de contenido
3. **Verifica la consola del navegador** para errores de JavaScript
4. **Comprueba los logs de WordPress** en wp-content/debug.log

## 💡 **Consejos Importantes**

- ✅ **Siempre ejecuta el diagnóstico primero**
- ✅ **Lee los logs detallados para entender qué pasó**
- ✅ **Verifica que ACF esté activo antes de crear contenido**
- ✅ **Usa la reparación automática para configurar requisitos**
- ✅ **Los plugins de diagnóstico se pueden desactivar después de usar**

---

**🎉 Con estas herramientas mejoradas, deberías poder identificar y resolver cualquier problema de configuración rápidamente.**