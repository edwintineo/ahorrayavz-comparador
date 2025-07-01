# 🚀 Guía de Deployment - AhorraYa VZ

## 📋 Pasos Rápidos para Deployment

### 1️⃣ Preparar el Proyecto

✅ **Ya tienes estos archivos creados:**
- `.gitignore` - Excluye archivos innecesarios
- `vercel.json` - Configuración de Vercel
- `.env.production` - Variables para producción
- `vite.config.js` - Optimizado para build

### 2️⃣ Subir a GitHub

#### Opción A: Usando GitHub Desktop (Más Fácil)
1. **Descarga** GitHub Desktop: https://desktop.github.com
2. **Instala** y conecta tu cuenta
3. **File → Add Local Repository**
4. **Selecciona** la carpeta del proyecto
5. **Publish repository** → Nombra: `ahorrayavz-comparador`
6. **¡Listo!** Tu código está en GitHub

#### Opción B: Usando Terminal
```bash
# 1. Inicializar Git (si no está inicializado)
git init

# 2. Agregar archivos
git add .

# 3. Primer commit
git commit -m "🚀 Initial commit - AhorraYa VZ Comparador"

# 4. Crear repositorio en GitHub.com y luego:
git remote add origin https://github.com/TU-USUARIO/ahorrayavz-comparador.git
git branch -M main
git push -u origin main
```

### 3️⃣ Desplegar en Vercel

#### Paso a Paso:
1. **Ve a** https://vercel.com
2. **Sign up** con tu cuenta de GitHub
3. **New Project** → Import Git Repository
4. **Selecciona** `ahorrayavz-comparador`
5. **Configure Project:**
   - Framework Preset: **Vite**
   - Root Directory: **./** (raíz)
   - Build Command: **npm run build**
   - Output Directory: **dist**

#### Variables de Entorno en Vercel:
```
VITE_WP_API_URL = https://tu-wordpress.com/wp-json
VITE_WP_BASE_URL = https://tu-wordpress.com
VITE_APP_NAME = AhorraYa VZ
VITE_APP_VERSION = 1.0.0
VITE_EXCHANGE_API_URL = https://pydolarve.org/api/v1/dollar?page=bcv&monitor=usd
VITE_DEFAULT_LAT = 10.4806
VITE_DEFAULT_LNG = -66.9036
VITE_DEFAULT_ZOOM = 10
VITE_DEBUG = false
```

6. **Deploy** → ¡Espera 2-3 minutos!
7. **¡Tu app está live!** 🎉

### 4️⃣ Configurar WordPress para Vercel

**En tu WordPress, actualiza el plugin:**

```php
// En configuracion-automatica-plugin.php
function configurar_cors_headers() {
    $allowed_origins = [
        'http://localhost:3000',
        'https://tu-app.vercel.app', // ← Cambiar por tu URL de Vercel
        'https://ahorrayavz-comparador.vercel.app' // Ejemplo
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

## 🔄 Workflow de Actualizaciones

### Para Hacer Cambios:
1. **Modifica** tu código localmente
2. **Commit** los cambios:
   ```bash
   git add .
   git commit -m "✨ Descripción del cambio"
   git push
   ```
3. **Vercel automáticamente** desplegará los cambios
4. **¡Listo!** En 1-2 minutos estará actualizado

## 🌐 URLs de tu Aplicación

### Desarrollo
- **Local:** http://localhost:3000
- **Test:** http://localhost:3000/test-wordpress

### Producción
- **App:** https://tu-app.vercel.app
- **Test:** https://tu-app.vercel.app/test-wordpress

## 🎯 Checklist de Deployment

### Antes de Desplegar:
- ✅ WordPress funcionando en tu servidor
- ✅ Plugin ACF activo
- ✅ Plugin de configuración activo
- ✅ Contenido de prueba creado
- ✅ Variables de entorno configuradas

### Después del Deployment:
- ✅ App carga correctamente
- ✅ Test de conexión funciona
- ✅ Productos se muestran
- ✅ Conversión de precios funciona
- ✅ No hay errores CORS

## 🚨 Solución de Problemas

### ❌ "Build Failed"
**Solución:**
```bash
# Probar build localmente
npm run build

# Si falla, revisar errores y corregir
# Luego hacer commit y push
```

### ❌ "CORS Error"
**Solución:**
1. Verificar que WordPress permite tu dominio de Vercel
2. Actualizar plugin de configuración
3. Verificar variables de entorno

### ❌ "Environment Variables Not Found"
**Solución:**
1. Ir a Vercel → Project Settings → Environment Variables
2. Verificar que todas las variables estén configuradas
3. Redeploy el proyecto

### ❌ "404 Not Found"
**Solución:**
1. Verificar que `vercel.json` esté configurado
2. Verificar que el build genere `dist/index.html`
3. Revisar configuración de rutas

## 🎉 ¡Éxito!

**Si todo funciona, tendrás:**
- ✅ Aplicación accesible desde internet
- ✅ HTTPS automático
- ✅ CDN global (carga rápida)
- ✅ Deployment automático con Git
- ✅ Analytics de Vercel
- ✅ Dominio personalizable

## 📱 Compartir tu App

**Puedes compartir tu comparador:**
- 🔗 **URL directa:** https://tu-app.vercel.app
- 📱 **Móvil:** Funciona perfectamente
- 🌍 **Global:** Accesible desde cualquier país
- ⚡ **Rápido:** CDN de Vercel optimiza la carga

## 🔮 Próximos Pasos

1. **Dominio personalizado** (opcional)
2. **Analytics avanzados**
3. **SEO optimization**
4. **PWA (Progressive Web App)**
5. **Notificaciones push**

---

**¡Felicidades!** 🎊 Tu comparador de precios ya está en la nube y accesible para todo el mundo.

**URLs importantes:**
- 📖 **Documentación completa:** `DEPLOYMENT-VERCEL-GITHUB.md`
- 🧪 **Guía de testing:** `FASE-3-FRONTEND-REACT.md`
- 🆘 **Solución de problemas:** `GUIA-SOLUCION-PROBLEMAS.md`