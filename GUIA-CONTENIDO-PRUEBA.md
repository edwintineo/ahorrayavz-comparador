# 🚀 Guía Paso a Paso: Crear Contenido de Prueba

## ¿Qué es esto?
Un plugin temporal que crea automáticamente categorías, tiendas y productos de prueba para validar tu sistema de conversión de precios. **Se puede eliminar después de usar.**

---

## 📋 Pasos Súper Simples

### 1️⃣ Subir el Plugin
1. Ve a tu **WordPress Admin** → **Plugins** → **Añadir nuevo**
2. Haz clic en **"Subir plugin"**
3. Selecciona el archivo `test-content-plugin.php`
4. Haz clic en **"Instalar ahora"**
5. Haz clic en **"Activar plugin"**

### 2️⃣ Crear el Contenido
1. Ve a **Herramientas** → **Contenido de Prueba**
2. Haz clic en **"🎯 Crear Contenido de Prueba"**
3. Confirma cuando te pregunte
4. ¡Listo! Ya tienes contenido de prueba

### 3️⃣ Verificar que Funciona
1. Ve a **Productos** → **Todos los productos**
2. Abre cualquier producto
3. Verifica que tenga precios en USD y Bs
4. Ve a tu frontend React y verifica que se muestren correctamente

### 4️⃣ Eliminar el Plugin (Opcional)
1. En la misma página **Herramientas** → **Contenido de Prueba**
2. Haz clic en **"Desactivar Plugin"**
3. Ve a **Plugins** → **Plugins instalados**
4. Elimina el plugin "Creador de Contenido de Prueba"

---

## 📦 ¿Qué se va a crear?

### 🏷️ 4 Categorías:
- 📱 Electrónicos
- 🏠 Hogar  
- 👕 Ropa
- ⚽ Deportes

### 🏪 4 Tiendas:
- TecnoMax (Caracas)
- Casa Bella (Valencia)
- Moda Urbana (Maracaibo)
- Deportes Total (Barquisimeto)

### 📱 8 Productos:
- iPhone 15 ($999 USD)
- Samsung Galaxy S24 ($899 USD)
- Aspiradora Robot (14,600 Bs)
- Juego de Ollas ($89.99 USD)
- Zapatillas Nike ($120 USD)
- Apple Watch (18,250 Bs)
- Bicicleta Trek ($850 USD)
- Pelota Adidas (1,825 Bs)

---

## ⚠️ Requisitos Previos

**¿No tienes nada configurado aún?** 🚀

**OPCIÓN FÁCIL:** Usa el plugin de configuración automática:
1. Sube e instala `configuracion-automatica-plugin.php`
2. Actívalo desde Plugins
3. Instala ACF (Advanced Custom Fields)
4. ¡Listo! Todo se configura automáticamente

**OPCIÓN MANUAL:** Sigue la guía completa en `GUIA-CONFIGURACION-WORDPRESS.md`

### Lo que necesitas tener configurado:

1. **Plugin ACF (Advanced Custom Fields)** instalado y activo
2. **Tipos de post personalizados:**
   - `producto` (para los productos)
   - `tienda` (para las tiendas)
3. **Taxonomía personalizada:**
   - `categoria_producto` (para categorizar productos)
4. **Campos personalizados ACF:**
   - Para productos: `precio_usd`, `precio_bs`, `tienda`, `disponible`
   - Para tiendas: `ubicacion`, `telefono`, `calificacion`
   - Para categorías: `icono`

---

## 🔧 ¿Qué pasa si algo no funciona?

### Error: "Tipo de post no existe"
- Verifica que tengas los custom post types `producto` y `tienda` configurados

### Error: "Taxonomía no existe"
- Verifica que tengas la taxonomía `categoria_producto` configurada

### Error: "Campos no se guardan"
- Verifica que ACF esté activo
- Verifica que los campos personalizados estén configurados

### Los precios no se convierten
- Verifica que tengas las funciones de conversión en `functions.php`
- Verifica que la tasa de cambio esté configurada (36.50)

---

## 💡 Consejos de Novato

1. **Haz un backup** antes de crear contenido de prueba
2. **Prueba en un sitio de desarrollo** primero
3. **No te preocupes** - el contenido se puede eliminar fácilmente
4. **Si algo sale mal** - simplemente elimina los posts manualmente
5. **El plugin es temporal** - úsalo y elimínalo

---

## 🎯 Después de Crear el Contenido

1. **Verifica la conversión de precios:**
   - Los productos con precio en USD deben mostrar también el precio en Bs
   - Los productos con precio en Bs deben mostrar también el precio en USD

2. **Prueba tu frontend React:**
   - Ve a tu aplicación React
   - Verifica que se muestren todos los productos
   - Verifica que los precios se muestren correctamente

3. **Prueba la API:**
   - Ve a `/wp-json/ahorraya/v1/productos`
   - Verifica que devuelva productos con ambos precios

---

## ❓ ¿Necesitas Ayuda?

Si algo no funciona:
1. Verifica los requisitos de arriba
2. Revisa la consola de WordPress (si hay errores)
3. Verifica que todos los plugins estén activos
4. Asegúrate de que las funciones de conversión estén en `functions.php`

**¡Es súper fácil! Solo sigue los pasos y tendrás contenido de prueba en minutos.** 🚀