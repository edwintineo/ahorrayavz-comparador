# 🚀 INSTRUCCIONES MANUALES - FASE 3

## ⚠️ IMPORTANTE: Ejecutar Manualmente

Debido a problemas con la terminal automática, necesitas ejecutar estos comandos manualmente.

## 📋 Pasos a Seguir (Como Novato)

### Paso 1: Abrir Terminal

1. **Presiona** `Windows + R`
2. **Escribe** `cmd` y presiona Enter
3. **Navega** a la carpeta del proyecto:
   ```cmd
   cd "C:\Users\brimo\OneDrive\Escritorio\COMPARADOR con react 2025"
   ```

### Paso 2: Verificar Node.js

1. **Ejecuta** este comando para verificar que Node.js esté instalado:
   ```cmd
   node --version
   ```
2. **Deberías ver** algo como `v18.x.x` o `v20.x.x`
3. **Si no tienes Node.js**, descárgalo de: https://nodejs.org

### Paso 3: Instalar Dependencias

1. **Ejecuta** este comando:
   ```cmd
   npm install
   ```
2. **Espera** a que termine (puede tomar varios minutos)
3. **Verás** muchas líneas de texto descargando paquetes

### Paso 4: Iniciar el Servidor de Desarrollo

1. **Ejecuta** este comando:
   ```cmd
   npm run dev
   ```
2. **Deberías ver** algo como:
   ```
   VITE v5.0.8  ready in 1234 ms
   
   ➜  Local:   http://localhost:3000/
   ➜  Network: use --host to expose
   ```
3. **¡NO CIERRES** esta ventana de terminal

### Paso 5: Abrir el Navegador

1. **Abre** tu navegador web (Chrome, Firefox, Edge)
2. **Ve a** la dirección: `http://localhost:3000`
3. **Deberías ver** la página principal de AhorraYa VZ

### Paso 6: Probar la Conexión con WordPress

1. **En el navegador, ve a:**
   ```
   http://localhost:3000/test-wordpress
   ```
2. **Verás** una página titulada "🧪 Prueba de Conexión WordPress"
3. **Haz clic** en el botón "🔄 Probar Conexión"

## 🎯 Resultados Esperados

### ✅ Si Todo Funciona Bien:

- **Estado de Conexión:** Chip verde que dice "Conectado"
- **Tasa de Cambio:** Chip azul con la tasa actual (ej: "Tasa: 36.50 Bs/$")
- **Botones activos:** Los botones de "Obtener Productos", "Obtener Tiendas", etc.

### 🧪 Pruebas a Realizar:

1. **Haz clic en "📦 Obtener Productos"**
   - Deberías ver productos como "iPhone 15", "Samsung Galaxy S24", etc.
   - Con precios en USD y Bolívares
   - Con información de marca, stock, disponibilidad

2. **Haz clic en "🏪 Obtener Tiendas"**
   - Deberías ver tiendas como "Amazon", "MercadoLibre", etc.
   - Con ubicación y teléfono

3. **Haz clic en "📂 Obtener Categorías"**
   - Deberías ver categorías como "Electrónicos", "Hogar", etc.
   - Con cantidad de productos por categoría

## ❌ Solución de Problemas

### Problema: "npm no se reconoce como comando"

**Solución:**
1. **Instala Node.js** desde https://nodejs.org
2. **Reinicia** la terminal
3. **Intenta de nuevo**

### Problema: "Error: Cannot find module"

**Solución:**
1. **Ejecuta:**
   ```cmd
   npm install
   ```
2. **Espera** a que termine
3. **Intenta** `npm run dev` de nuevo

### Problema: "Puerto 3000 en uso"

**Solución:**
1. **Presiona** `Ctrl + C` en la terminal
2. **Ejecuta:**
   ```cmd
   npm run dev -- --port 3001
   ```
3. **Ve a** `http://localhost:3001`

### Problema: "Network Error" en la página de prueba

**Solución:**
1. **Verifica** que WordPress esté funcionando en `http://localhost/ahorrayavz-wp`
2. **Ve al panel de WordPress** (`http://localhost/ahorrayavz-wp/wp-admin`)
3. **Activa** el plugin "Configuración Automática - Comparador de Precios"
4. **Recarga** la página de prueba

### Problema: "No products found"

**Solución:**
1. **Ve al panel de WordPress**
2. **Herramientas → Contenido de Prueba Mejorado**
3. **Haz clic** en "🧪 Crear Contenido de Prueba"
4. **Recarga** la página de prueba

## 📱 Navegación en la Aplicación

Una vez que todo funcione:

- **Página Principal:** `http://localhost:3000/`
- **Página de Prueba:** `http://localhost:3000/test-wordpress`
- **Búsqueda:** `http://localhost:3000/buscar`
- **Acerca de:** `http://localhost:3000/acerca`

## 🎉 ¡Éxito!

Si puedes ver productos, tiendas y categorías en la página de prueba, ¡felicidades! Has completado exitosamente la Fase 3.

### Lo que has logrado:

- ✅ **Conexión React ↔ WordPress** funcionando
- ✅ **API REST** de WordPress accesible
- ✅ **Conversión de precios** USD ↔ Bolívares
- ✅ **Tasa de cambio** en tiempo real
- ✅ **Campos ACF** siendo leídos correctamente
- ✅ **Entorno de desarrollo** configurado

## 🔄 Para Detener el Servidor

Cuando termines de probar:

1. **Ve a la terminal** donde ejecutaste `npm run dev`
2. **Presiona** `Ctrl + C`
3. **Confirma** con `Y` si te pregunta

## 📞 Si Necesitas Ayuda

Si algo no funciona:

1. **Toma una captura** de pantalla del error
2. **Copia** el mensaje de error completo
3. **Verifica** que WordPress esté funcionando
4. **Revisa** que los plugins estén activos

---

**¡Excelente trabajo!** 🚀 Estás listo para continuar con el desarrollo de funcionalidades avanzadas.