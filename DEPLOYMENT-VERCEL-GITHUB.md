# 🚀 DEPLOYMENT: Vercel + GitHub

## 🎯 Objetivo
Desplegar tu comparador de precios en Vercel usando GitHub para tener una aplicación accesible desde internet.

## ✅ Requisitos
- ✅ Cuenta de GitHub
- ✅ Cuenta de Vercel
- ✅ Proyecto React funcionando localmente
- ✅ WordPress funcionando (para la API)

## 📋 Pasos de Deployment

### Paso 1: Preparar el Proyecto para Production

#### 1.1 Crear archivo `.gitignore`
```gitignore
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production build
dist/
build/

# Environment variables
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless/

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Stores VSCode versions used for testing VSCode extensions
.vscode-test
```

#### 1.2 Actualizar Variables de Entorno para Production

Crea un archivo `.env.production`:
```env
# URL de tu WordPress en producción (cambiar por tu dominio real)
VITE_WP_API_URL=https://tu-dominio-wordpress.com/wp-json
VITE_WP_BASE_URL=https://tu-dominio-wordpress.com

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
```

### Paso 2: Subir a GitHub

#### 2.1 Inicializar Git (si no está inicializado)
```bash
git init
git add .
git commit -m "Initial commit - Comparador de Precios AhorraYa VZ"
```

#### 2.2 Crear Repositorio en GitHub
1. **Ve a** https://github.com
2. **Haz clic** en "New repository"
3. **Nombre:** `ahorrayavz-comparador`
4. **Descripción:** "Comparador de precios para Venezuela con React y WordPress"
5. **Público** o **Privado** (tu elección)
6. **NO marques** "Initialize with README" (ya tienes archivos)
7. **Haz clic** en "Create repository"

#### 2.3 Conectar Repositorio Local con GitHub
```bash
git remote add origin https://github.com/TU-USUARIO/ahorrayavz-comparador.git
git branch -M main
git push -u origin main
```

### Paso 3: Configurar Vercel

#### 3.1 Conectar GitHub con Vercel
1. **Ve a** https://vercel.com
2. **Inicia sesión** con tu cuenta de GitHub
3. **Autoriza** a Vercel para acceder a tus repositorios

#### 3.2 Importar Proyecto
1. **En el dashboard de Vercel**, haz clic en "New Project"
2. **Busca** tu repositorio `ahorrayavz-comparador`
3. **Haz clic** en "Import"

#### 3.3 Configurar el Proyecto
- **Framework Preset:** Vite
- **Root Directory:** `./` (raíz)
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

#### 3.4 Configurar Variables de Entorno en Vercel
1. **En la configuración del proyecto**, ve a "Environment Variables"
2. **Agrega cada variable** de tu archivo `.env.production`:
   - `VITE_WP_API_URL`
   - `VITE_WP_BASE_URL`
   - `VITE_APP_NAME`
   - `VITE_APP_VERSION`
   - `VITE_EXCHANGE_API_URL`
   - `VITE_DEFAULT_LAT`
   - `VITE_DEFAULT_LNG`
   - `VITE_DEFAULT_ZOOM`
   - `VITE_DEBUG`

#### 3.5 Deploy
1. **Haz clic** en "Deploy"
2. **Espera** a que termine el build (2-5 minutos)
3. **¡Tu aplicación estará live!**

### Paso 4: Configurar WordPress para CORS

#### 4.1 Actualizar Plugin de Configuración
En tu WordPress, actualiza el plugin para permitir el dominio de Vercel:

```php
// En configuracion-automatica-plugin.php
function configurar_cors_headers() {
    $allowed_origins = [
        'http://localhost:3000',
        'http://localhost:5173',
        'https://tu-app.vercel.app', // Cambiar por tu URL de Vercel
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

### Paso 5: Configurar Dominio Personalizado (Opcional)

#### 5.1 En Vercel
1. **Ve a** tu proyecto en Vercel
2. **Settings → Domains**
3. **Agrega** tu dominio personalizado
4. **Configura** los DNS según las instrucciones

#### 5.2 Actualizar Variables de Entorno
Cambia las URLs en Vercel por tu dominio personalizado.

## 🔄 Workflow de Desarrollo

### Para Actualizaciones
```bash
# 1. Hacer cambios en tu código
# 2. Commit y push
git add .
git commit -m "Descripción de los cambios"
git push origin main

# 3. Vercel automáticamente desplegará los cambios
```

### Para Rollback
1. **En Vercel**, ve a "Deployments"
2. **Encuentra** la versión anterior
3. **Haz clic** en "Promote to Production"

## 🌐 URLs Importantes

### Desarrollo
- **Local:** `http://localhost:3000`
- **Test WordPress:** `http://localhost:3000/test-wordpress`

### Producción
- **App:** `https://tu-app.vercel.app`
- **Test WordPress:** `https://tu-app.vercel.app/test-wordpress`
- **WordPress API:** `https://tu-dominio-wordpress.com/wp-json`

## 🔧 Optimizaciones para Producción

### 1. Configurar Build Optimizado
En `vite.config.js`:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
          utils: ['axios', 'zustand']
        }
      }
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  }
})
```

### 2. Configurar Headers de Seguridad
En Vercel, crea `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## 📊 Monitoreo y Analytics

### 1. Vercel Analytics
1. **En tu proyecto Vercel**, ve a "Analytics"
2. **Habilita** Vercel Analytics
3. **Instala** el paquete:
   ```bash
   npm install @vercel/analytics
   ```
4. **Agrega** en `main.jsx`:
   ```javascript
   import { Analytics } from '@vercel/analytics/react'
   
   // En tu componente raíz
   <Analytics />
   ```

### 2. Error Tracking
Puedes integrar Sentry para tracking de errores:
```bash
npm install @sentry/react @sentry/tracing
```

## 🚨 Troubleshooting

### Error: "Build Failed"
- **Verifica** que `npm run build` funcione localmente
- **Revisa** los logs de build en Vercel
- **Asegúrate** de que todas las dependencias estén en `package.json`

### Error: "CORS"
- **Verifica** que WordPress permita tu dominio de Vercel
- **Actualiza** el plugin de configuración
- **Revisa** las variables de entorno

### Error: "Environment Variables"
- **Verifica** que todas las variables estén configuradas en Vercel
- **Asegúrate** de que tengan el prefijo `VITE_`
- **Redeploy** después de cambiar variables

## 🎉 ¡Éxito!

Si todo funciona correctamente, tendrás:

- ✅ **Aplicación live** en internet
- ✅ **Deployment automático** con cada push
- ✅ **HTTPS** configurado automáticamente
- ✅ **CDN global** de Vercel
- ✅ **Optimización automática** de assets
- ✅ **Analytics** y monitoreo

**¡Tu comparador de precios ya está en la nube!** 🚀