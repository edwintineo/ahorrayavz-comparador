# 📱 FASE 3: Configuración del Frontend React

## 🎯 Objetivo
Configurar la conexión entre React y WordPress, establecer el entorno de desarrollo del frontend y realizar la primera conexión para obtener y mostrar productos de WordPress en React.

## ✅ Requisitos Previos
- ✅ WordPress configurado y funcionando (Fase 1)
- ✅ Contenido de prueba creado (Fase 2)
- ✅ Plugins ACF y Configuración Automática activos
- ✅ Node.js instalado en tu sistema

## 🚀 Pasos de Configuración

### Paso 1: Verificar Variables de Entorno

1. **Abrir el archivo `.env`** en la raíz del proyecto
2. **Verificar que las URLs sean correctas:**
   ```env
   VITE_WP_API_URL=http://localhost/ahorrayavz-wp/wp-json
   VITE_WP_BASE_URL=http://localhost/ahorrayavz-wp
   ```
3. **Asegurarse de que WordPress esté funcionando** en esa URL

### Paso 2: Instalar Dependencias

1. **Abrir terminal** en la carpeta del proyecto
2. **Ejecutar:**
   ```bash
   npm install
   ```
3. **Esperar** a que se instalen todas las dependencias

### Paso 3: Iniciar el Servidor de Desarrollo

1. **En la terminal, ejecutar:**
   ```bash
   npm run dev
   ```
2. **El servidor debería iniciarse** en `http://localhost:3000`
3. **Abrir el navegador** y ir a esa dirección

### Paso 4: Probar la Conexión con WordPress

1. **En el navegador, ir a:**
   ```
   http://localhost:3000/test-wordpress
   ```
2. **Deberías ver** la página de prueba de conexión
3. **Hacer clic en "🔄 Probar Conexión"**
4. **Si todo está bien**, verás:
   - ✅ Estado: "Conectado"
   - 💱 Tasa de cambio actual

### Paso 5: Obtener Datos de WordPress

1. **Hacer clic en "📦 Obtener Productos"**
2. **Deberías ver** los productos de prueba creados en WordPress
3. **Hacer clic en "🏪 Obtener Tiendas"**
4. **Hacer clic en "📂 Obtener Categorías"**

## 🔧 Solución de Problemas

### ❌ Error: "Network Error" o "CORS"

**Problema:** WordPress no permite conexiones desde React

**Solución:**
1. **Ir al panel de WordPress** (`http://localhost/ahorrayavz-wp/wp-admin`)
2. **Activar el plugin** "Configuración Automática - Comparador de Precios"
3. **El plugin configura automáticamente** los permisos CORS

### ❌ Error: "404 Not Found"

**Problema:** La URL de WordPress es incorrecta

**Solución:**
1. **Verificar que WordPress funcione** en `http://localhost/ahorrayavz-wp`
2. **Probar la API directamente** en `http://localhost/ahorrayavz-wp/wp-json`
3. **Ajustar las URLs** en el archivo `.env` si es necesario

### ❌ Error: "No products found"

**Problema:** No hay contenido de prueba en WordPress

**Solución:**
1. **Ir al panel de WordPress**
2. **Herramientas → Contenido de Prueba Mejorado**
3. **Hacer clic en "🧪 Crear Contenido de Prueba"**

### ❌ Error: "ACF fields not found"

**Problema:** Plugin ACF no está activo

**Solución:**
1. **Ir a Plugins** en WordPress
2. **Activar "Advanced Custom Fields"**
3. **Activar "Configuración Automática - Comparador de Precios"**

## 📊 Verificación de Éxito

La Fase 3 está completa cuando puedas ver:

- ✅ **Conexión exitosa** con WordPress
- ✅ **Productos mostrados** con precios en USD y Bs
- ✅ **Tiendas listadas** con información
- ✅ **Categorías disponibles**
- ✅ **Conversión de precios** funcionando
- ✅ **Tasa de cambio** actualizada

## 🎨 Características del Componente de Prueba

### 📡 Estado de Conexión
- Muestra si la conexión con WordPress está activa
- Indica la tasa de cambio actual
- Permite probar la conexión manualmente

### 📦 Visualización de Productos
- Lista productos con ID, nombre y marca
- Muestra precios en USD y Bolívares
- Indica disponibilidad y stock
- Convierte precios automáticamente

### 🏪 Información de Tiendas
- Muestra tiendas registradas
- Incluye ubicación y teléfono
- Lista ID para referencia

### 📂 Categorías
- Muestra todas las categorías disponibles
- Indica cantidad de productos por categoría

## 🔄 Conversión de Precios

El sistema convierte automáticamente entre USD y Bolívares:

- **Si hay precio USD:** Calcula Bs = USD × Tasa
- **Si hay precio Bs:** Calcula USD = Bs ÷ Tasa
- **Tasa obtenida** de PyDolarVe API
- **Actualización automática** cada 30 minutos

## 📱 Próximos Pasos

Una vez completada la Fase 3:

1. **Fase 4:** Desarrollo de componentes principales
2. **Fase 5:** Implementación de búsqueda y filtros
3. **Fase 6:** Sistema de comparación de precios
4. **Fase 7:** Funcionalidades avanzadas

## 🆘 Ayuda Adicional

Si tienes problemas:

1. **Revisar la consola** del navegador (F12)
2. **Verificar que WordPress** esté funcionando
3. **Comprobar que los plugins** estén activos
4. **Usar el componente de diagnóstico** en WordPress

---

**¡Felicidades!** 🎉 Si llegaste hasta aquí, tu frontend React ya está conectado con WordPress y listo para el desarrollo de funcionalidades avanzadas.