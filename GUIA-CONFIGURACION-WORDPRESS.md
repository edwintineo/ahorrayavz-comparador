# 🚀 Guía Completa: Configuración de WordPress para el Comparador de Precios

## 📋 Requisitos que necesitas configurar:

1. ✅ **Plugin ACF (Advanced Custom Fields)**
2. ✅ **Tipos de post personalizados: `producto` y `tienda`**
3. ✅ **Taxonomía personalizada: `categoria_producto`**
4. ✅ **Campos personalizados ACF**

---

## 🔧 PASO 1: Instalar y Activar ACF

### Opción A: Desde el administrador de WordPress (Recomendado)

1. **Ir a Plugins → Añadir nuevo**
2. **Buscar "Advanced Custom Fields"**
3. **Instalar el plugin de Elliot Condon**
4. **Activar el plugin**

### Opción B: Descarga manual

1. Ir a [wordpress.org/plugins/advanced-custom-fields](https://wordpress.org/plugins/advanced-custom-fields/)
2. Descargar el archivo ZIP
3. Subir en WordPress: Plugins → Añadir nuevo → Subir plugin

---

## 🏗️ PASO 2: Crear Tipos de Post Personalizados

### Método 1: Usando un plugin (Más fácil para principiantes)

1. **Instalar "Custom Post Type UI":**
   - Ir a Plugins → Añadir nuevo
   - Buscar "Custom Post Type UI"
   - Instalar y activar

2. **Crear tipo de post "Producto":**
   - Ir a CPT UI → Añadir/Editar tipos de entrada
   - Slug del tipo de entrada: `producto`
   - Nombre plural: `Productos`
   - Nombre singular: `Producto`
   - Marcar: Público, Mostrar en menú admin, Soporta título, editor, miniatura
   - Guardar tipo de entrada

3. **Crear tipo de post "Tienda":**
   - Repetir el proceso anterior
   - Slug del tipo de entrada: `tienda`
   - Nombre plural: `Tiendas`
   - Nombre singular: `Tienda`
   - Guardar tipo de entrada

### Método 2: Código en functions.php (Para usuarios avanzados)

Si prefieres código, agrega esto al `functions.php` de tu tema:

```php
// Registrar tipo de post: Producto
function registrar_tipo_producto() {
    register_post_type('producto', [
        'labels' => [
            'name' => 'Productos',
            'singular_name' => 'Producto',
            'add_new' => 'Añadir Producto',
            'add_new_item' => 'Añadir Nuevo Producto',
            'edit_item' => 'Editar Producto',
        ],
        'public' => true,
        'has_archive' => true,
        'supports' => ['title', 'editor', 'thumbnail'],
        'menu_icon' => 'dashicons-products',
        'rewrite' => ['slug' => 'productos'],
    ]);
}
add_action('init', 'registrar_tipo_producto');

// Registrar tipo de post: Tienda
function registrar_tipo_tienda() {
    register_post_type('tienda', [
        'labels' => [
            'name' => 'Tiendas',
            'singular_name' => 'Tienda',
            'add_new' => 'Añadir Tienda',
            'add_new_item' => 'Añadir Nueva Tienda',
            'edit_item' => 'Editar Tienda',
        ],
        'public' => true,
        'has_archive' => true,
        'supports' => ['title', 'editor', 'thumbnail'],
        'menu_icon' => 'dashicons-store',
        'rewrite' => ['slug' => 'tiendas'],
    ]);
}
add_action('init', 'registrar_tipo_tienda');
```

---

## 🏷️ PASO 3: Crear Taxonomía "Categoría de Producto"

### Método 1: Usando Custom Post Type UI

1. **Ir a CPT UI → Añadir/Editar taxonomías**
2. **Configurar:**
   - Slug de taxonomía: `categoria_producto`
   - Nombre plural: `Categorías de Producto`
   - Nombre singular: `Categoría de Producto`
   - Adjuntar a tipo de entrada: `producto`
   - Marcar: Público, Jerárquico, Mostrar en menú admin
3. **Guardar taxonomía**

### Método 2: Código en functions.php

```php
// Registrar taxonomía: Categoría de Producto
function registrar_taxonomia_categoria_producto() {
    register_taxonomy('categoria_producto', 'producto', [
        'labels' => [
            'name' => 'Categorías de Producto',
            'singular_name' => 'Categoría de Producto',
            'add_new_item' => 'Añadir Nueva Categoría',
            'edit_item' => 'Editar Categoría',
        ],
        'public' => true,
        'hierarchical' => true,
        'show_admin_column' => true,
        'rewrite' => ['slug' => 'categoria-producto'],
    ]);
}
add_action('init', 'registrar_taxonomia_categoria_producto');
```

---

## 🎛️ PASO 4: Crear Campos Personalizados ACF

### Para Productos:

1. **Ir a Campos personalizados → Grupos de campos**
2. **Crear nuevo grupo: "Campos de Producto"**
3. **Añadir estos campos:**

   - **Campo 1:**
     - Etiqueta: `Precio USD`
     - Nombre: `precio_usd`
     - Tipo: Número
     - Paso: 0.01

   - **Campo 2:**
     - Etiqueta: `Precio Bs`
     - Nombre: `precio_bs`
     - Tipo: Número
     - Paso: 0.01

   - **Campo 3:**
     - Etiqueta: `Tienda`
     - Nombre: `tienda`
     - Tipo: Relación
     - Filtrar por tipo de entrada: Tienda

   - **Campo 4:**
     - Etiqueta: `Disponible`
     - Nombre: `disponible`
     - Tipo: Verdadero/Falso
     - Valor por defecto: Sí

4. **Configurar ubicación:**
   - Mostrar este grupo de campos si: Tipo de entrada es igual a Producto

### Para Tiendas:

1. **Crear nuevo grupo: "Campos de Tienda"**
2. **Añadir estos campos:**

   - **Campo 1:**
     - Etiqueta: `Ubicación`
     - Nombre: `ubicacion`
     - Tipo: Texto

   - **Campo 2:**
     - Etiqueta: `Teléfono`
     - Nombre: `telefono`
     - Tipo: Texto

   - **Campo 3:**
     - Etiqueta: `Calificación`
     - Nombre: `calificacion`
     - Tipo: Número
     - Mínimo: 1
     - Máximo: 5
     - Paso: 0.1

3. **Configurar ubicación:**
   - Mostrar este grupo de campos si: Tipo de entrada es igual a Tienda

### Para Categorías:

1. **Crear nuevo grupo: "Campos de Categoría"**
2. **Añadir campo:**

   - **Campo:**
     - Etiqueta: `Icono`
     - Nombre: `icono`
     - Tipo: Texto

3. **Configurar ubicación:**
   - Mostrar este grupo de campos si: Taxonomía es igual a Categoría de Producto

---

## ✅ PASO 5: Verificar la Configuración

### Verificación rápida:

1. **Ir al menú lateral del admin de WordPress**
2. **Deberías ver:**
   - 📦 Productos (nuevo menú)
   - 🏪 Tiendas (nuevo menú)
   - En Productos → Categorías de Producto

3. **Crear un producto de prueba:**
   - Ir a Productos → Añadir nuevo
   - Deberías ver los campos ACF al final del editor

4. **Crear una tienda de prueba:**
   - Ir a Tiendas → Añadir nuevo
   - Deberías ver los campos ACF de tienda

---

## 🧪 PASO 6: Ejecutar el Plugin de Contenido de Prueba

Una vez que todo esté configurado:

1. **Ir a Herramientas → Generador de Contenido de Prueba**
2. **Hacer clic en "Crear Contenido de Prueba"**
3. **Ahora debería funcionar sin errores**

---

## 🚨 Solución de Problemas Comunes

### Error: "ACF no está activo"
- Verificar que ACF esté instalado y activado
- Ir a Plugins y confirmar que aparece "Advanced Custom Fields"

### Error: "Tipo de post no existe"
- Si usaste Custom Post Type UI, verificar que los tipos estén guardados
- Si usaste código, verificar que esté en functions.php y sin errores de sintaxis

### Error: "Taxonomía no existe"
- Verificar que la taxonomía esté creada y asociada al tipo de post "producto"

### Los campos ACF no aparecen:
- Verificar que los grupos de campos estén configurados para las ubicaciones correctas
- Confirmar que los nombres de los campos coincidan exactamente

---

## 💡 Consejos Adicionales

1. **Hacer backup** antes de hacer cambios
2. **Probar en un sitio de desarrollo** primero
3. **Usar un tema hijo** si modificas functions.php
4. **Documentar los cambios** que hagas

---

## 🎯 Resultado Final

Cuando todo esté configurado correctamente:
- ✅ Podrás crear productos con precios en USD y Bs
- ✅ Podrás crear tiendas con ubicación y datos de contacto
- ✅ Podrás categorizar productos
- ✅ El plugin de contenido de prueba funcionará perfectamente
- ✅ Tu sistema de comparación de precios tendrá datos para probar

¡Sigue esta guía paso a paso y tendrás todo funcionando!