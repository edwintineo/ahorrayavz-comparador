<?php
/**
 * Plugin Name: Configuración Automática - Comparador de Precios
 * Description: Configura automáticamente tipos de post, taxonomías y campos ACF necesarios para el comparador de precios
 * Version: 1.0
 * Author: Tu Nombre
 */

// Evitar acceso directo
if (!defined('ABSPATH')) {
    exit;
}

// Activar el plugin
register_activation_hook(__FILE__, 'configurar_comparador_activacion');

function configurar_comparador_activacion() {
    // Registrar tipos de post y taxonomías
    registrar_tipos_post_comparador();
    registrar_taxonomias_comparador();
    
    // Limpiar permalinks
    flush_rewrite_rules();
}

// Registrar tipos de post al inicializar
add_action('init', 'registrar_tipos_post_comparador');
add_action('init', 'registrar_taxonomias_comparador');

// Registrar tipo de post: Producto
function registrar_tipos_post_comparador() {
    // Tipo de post: Producto
    register_post_type('producto', [
        'labels' => [
            'name' => 'Productos',
            'singular_name' => 'Producto',
            'add_new' => 'Añadir Producto',
            'add_new_item' => 'Añadir Nuevo Producto',
            'edit_item' => 'Editar Producto',
            'new_item' => 'Nuevo Producto',
            'view_item' => 'Ver Producto',
            'search_items' => 'Buscar Productos',
            'not_found' => 'No se encontraron productos',
            'not_found_in_trash' => 'No hay productos en la papelera',
            'menu_name' => 'Productos'
        ],
        'public' => true,
        'publicly_queryable' => true,
        'show_ui' => true,
        'show_in_menu' => true,
        'show_in_nav_menus' => true,
        'show_in_admin_bar' => true,
        'has_archive' => true,
        'supports' => ['title', 'editor', 'thumbnail', 'excerpt'],
        'menu_icon' => 'dashicons-products',
        'menu_position' => 20,
        'rewrite' => ['slug' => 'productos'],
        'capability_type' => 'post',
        'show_in_rest' => true, // Para Gutenberg y API REST
    ]);
    
    // Tipo de post: Tienda
    register_post_type('tienda', [
        'labels' => [
            'name' => 'Tiendas',
            'singular_name' => 'Tienda',
            'add_new' => 'Añadir Tienda',
            'add_new_item' => 'Añadir Nueva Tienda',
            'edit_item' => 'Editar Tienda',
            'new_item' => 'Nueva Tienda',
            'view_item' => 'Ver Tienda',
            'search_items' => 'Buscar Tiendas',
            'not_found' => 'No se encontraron tiendas',
            'not_found_in_trash' => 'No hay tiendas en la papelera',
            'menu_name' => 'Tiendas'
        ],
        'public' => true,
        'publicly_queryable' => true,
        'show_ui' => true,
        'show_in_menu' => true,
        'show_in_nav_menus' => true,
        'show_in_admin_bar' => true,
        'has_archive' => true,
        'supports' => ['title', 'editor', 'thumbnail', 'excerpt'],
        'menu_icon' => 'dashicons-store',
        'menu_position' => 21,
        'rewrite' => ['slug' => 'tiendas'],
        'capability_type' => 'post',
        'show_in_rest' => true, // Para Gutenberg y API REST
    ]);
}

// Registrar taxonomía: Categoría de Producto
function registrar_taxonomias_comparador() {
    register_taxonomy('categoria_producto', 'producto', [
        'labels' => [
            'name' => 'Categorías de Producto',
            'singular_name' => 'Categoría de Producto',
            'add_new_item' => 'Añadir Nueva Categoría',
            'new_item_name' => 'Nombre de Nueva Categoría',
            'edit_item' => 'Editar Categoría',
            'update_item' => 'Actualizar Categoría',
            'view_item' => 'Ver Categoría',
            'separate_items_with_commas' => 'Separar categorías con comas',
            'add_or_remove_items' => 'Añadir o quitar categorías',
            'choose_from_most_used' => 'Elegir de las más usadas',
            'popular_items' => 'Categorías populares',
            'search_items' => 'Buscar categorías',
            'not_found' => 'No encontrado',
            'menu_name' => 'Categorías',
        ],
        'public' => true,
        'publicly_queryable' => true,
        'hierarchical' => true,
        'show_ui' => true,
        'show_admin_column' => true,
        'show_in_nav_menus' => true,
        'show_tagcloud' => true,
        'rewrite' => ['slug' => 'categoria-producto'],
        'show_in_rest' => true, // Para Gutenberg y API REST
    ]);
}

// Crear campos ACF automáticamente
add_action('acf/init', 'crear_campos_acf_comparador');

function crear_campos_acf_comparador() {
    // Solo crear si ACF está activo
    if (!function_exists('acf_add_local_field_group')) {
        return;
    }
    
    // Grupo de campos para Productos
    acf_add_local_field_group([
        'key' => 'group_productos_comparador',
        'title' => 'Información del Producto',
        'fields' => [
            [
                'key' => 'field_precio_usd',
                'label' => 'Precio USD',
                'name' => 'precio_usd',
                'type' => 'number',
                'instructions' => 'Precio del producto en dólares estadounidenses',
                'required' => 0,
                'step' => 0.01,
                'min' => 0,
            ],
            [
                'key' => 'field_precio_bs',
                'label' => 'Precio Bs',
                'name' => 'precio_bs',
                'type' => 'number',
                'instructions' => 'Precio del producto en bolívares',
                'required' => 0,
                'step' => 0.01,
                'min' => 0,
            ],
            [
                'key' => 'field_marca',
                'label' => 'Marca',
                'name' => 'marca',
                'type' => 'text',
                'instructions' => 'Marca del producto',
                'required' => 0,
            ],
            [
                'key' => 'field_tienda',
                'label' => 'Tienda',
                'name' => 'tienda',
                'type' => 'relationship',
                'instructions' => 'Selecciona la tienda donde se vende este producto',
                'required' => 0,
                'post_type' => ['tienda'],
                'taxonomy' => [],
                'filters' => ['search'],
                'elements' => ['featured_image'],
                'min' => 0,
                'max' => 1,
                'return_format' => 'id',
            ],
            [
                'key' => 'field_disponible',
                'label' => 'Disponible',
                'name' => 'disponible',
                'type' => 'true_false',
                'instructions' => 'Marca si el producto está disponible',
                'required' => 0,
                'default_value' => 1,
                'ui' => 1,
                'ui_on_text' => 'Sí',
                'ui_off_text' => 'No',
            ],
            [
                'key' => 'field_stock',
                'label' => 'Stock',
                'name' => 'stock',
                'type' => 'number',
                'instructions' => 'Cantidad disponible en stock',
                'required' => 0,
                'min' => 0,
            ],
            [
                'key' => 'field_modelo',
                'label' => 'Modelo',
                'name' => 'modelo',
                'type' => 'text',
                'instructions' => 'Modelo específico del producto',
                'required' => 0,
            ],
            [
                'key' => 'field_garantia',
                'label' => 'Garantía',
                'name' => 'garantia',
                'type' => 'text',
                'instructions' => 'Tiempo de garantía del producto (ej: 12 meses, N/A)',
                'required' => 0,
            ],
            [
                'key' => 'field_galeria_imagenes',
                'label' => 'Galería de Imágenes',
                'name' => 'galeria_imagenes',
                'type' => 'gallery',
                'instructions' => 'Sube múltiples imágenes del producto (además de la imagen destacada)',
                'required' => 0,
                'min' => 0,
                'max' => 10,
                'insert' => 'append',
                'library' => 'all',
                'min_width' => 300,
                'min_height' => 300,
                'return_format' => 'array',
                'preview_size' => 'medium',
            ],
        ],
        'location' => [
            [
                [
                    'param' => 'post_type',
                    'operator' => '==',
                    'value' => 'producto',
                ],
            ],
        ],
        'menu_order' => 0,
        'position' => 'normal',
        'style' => 'default',
        'label_placement' => 'top',
        'instruction_placement' => 'label',
    ]);
    
    // Grupo de campos para Tiendas
    acf_add_local_field_group([
        'key' => 'group_tiendas_comparador',
        'title' => 'Información de la Tienda',
        'fields' => [
            [
                'key' => 'field_ubicacion',
                'label' => 'Ubicación',
                'name' => 'ubicacion',
                'type' => 'text',
                'instructions' => 'Dirección o ubicación de la tienda',
                'required' => 0,
            ],
            [
                'key' => 'field_telefono',
                'label' => 'Teléfono',
                'name' => 'telefono',
                'type' => 'text',
                'instructions' => 'Número de teléfono de contacto',
                'required' => 0,
            ],
            [
                'key' => 'field_calificacion',
                'label' => 'Calificación',
                'name' => 'calificacion',
                'type' => 'number',
                'instructions' => 'Calificación de la tienda (1-5 estrellas)',
                'required' => 0,
                'min' => 1,
                'max' => 5,
                'step' => 0.1,
            ],
            [
                'key' => 'field_email',
                'label' => 'Email',
                'name' => 'email',
                'type' => 'email',
                'instructions' => 'Correo electrónico de contacto de la tienda',
                'required' => 0,
            ],
            [
                'key' => 'field_sitio_web',
                'label' => 'Sitio Web',
                'name' => 'sitio_web',
                'type' => 'url',
                'instructions' => 'URL del sitio web de la tienda',
                'required' => 0,
                'placeholder' => 'https://ejemplo.com',
            ],
        ],
        'location' => [
            [
                [
                    'param' => 'post_type',
                    'operator' => '==',
                    'value' => 'tienda',
                ],
            ],
        ],
        'menu_order' => 0,
        'position' => 'normal',
        'style' => 'default',
        'label_placement' => 'top',
        'instruction_placement' => 'label',
    ]);
    
    // Grupo de campos para Categorías
    acf_add_local_field_group([
        'key' => 'group_categorias_comparador',
        'title' => 'Campos de Categoría',
        'fields' => [
            [
                'key' => 'field_icono',
                'label' => 'Icono',
                'name' => 'icono',
                'type' => 'text',
                'instructions' => 'Clase CSS del icono o emoji para la categoría',
                'required' => 0,
                'placeholder' => 'Ej: 📱 o fas fa-mobile',
            ],
        ],
        'location' => [
            [
                [
                    'param' => 'taxonomy',
                    'operator' => '==',
                    'value' => 'categoria_producto',
                ],
            ],
        ],
        'menu_order' => 0,
        'position' => 'normal',
        'style' => 'default',
        'label_placement' => 'top',
        'instruction_placement' => 'label',
    ]);
}

// Añadir página de administración
add_action('admin_menu', 'configuracion_comparador_menu');

function configuracion_comparador_menu() {
    add_management_page(
        'Configuración Comparador',
        'Config. Comparador',
        'manage_options',
        'configuracion-comparador',
        'configuracion_comparador_pagina'
    );
}

function configuracion_comparador_pagina() {
    // Verificar estado de la configuración
    $acf_activo = function_exists('acf_add_local_field_group');
    $producto_existe = post_type_exists('producto');
    $tienda_existe = post_type_exists('tienda');
    $taxonomia_existe = taxonomy_exists('categoria_producto');
    
    $todo_configurado = $acf_activo && $producto_existe && $tienda_existe && $taxonomia_existe;
    
    ?>
    <div class="wrap">
        <h1>🔧 Configuración del Comparador de Precios</h1>
        <p>Este plugin configura automáticamente todo lo necesario para el comparador de precios.</p>
        
        <div class="card" style="max-width: 600px; padding: 20px; margin: 20px 0;">
            <h2>📊 Estado de la Configuración:</h2>
            
            <table class="widefat">
                <tr>
                    <td><strong>Plugin ACF:</strong></td>
                    <td><?php echo $acf_activo ? '✅ Activo' : '❌ No activo'; ?></td>
                </tr>
                <tr>
                    <td><strong>Tipo de post "Producto":</strong></td>
                    <td><?php echo $producto_existe ? '✅ Registrado' : '❌ No registrado'; ?></td>
                </tr>
                <tr>
                    <td><strong>Tipo de post "Tienda":</strong></td>
                    <td><?php echo $tienda_existe ? '✅ Registrado' : '❌ No registrado'; ?></td>
                </tr>
                <tr>
                    <td><strong>Taxonomía "Categoría Producto":</strong></td>
                    <td><?php echo $taxonomia_existe ? '✅ Registrada' : '❌ No registrada'; ?></td>
                </tr>
            </table>
            
            <?php if ($todo_configurado): ?>
                <div style="background: #d4edda; padding: 15px; border: 1px solid #c3e6cb; border-radius: 4px; margin-top: 15px;">
                    <strong>🎉 ¡Perfecto! Todo está configurado correctamente.</strong><br>
                    Ahora puedes usar el plugin de contenido de prueba sin problemas.
                </div>
            <?php else: ?>
                <div style="background: #f8d7da; padding: 15px; border: 1px solid #f5c6cb; border-radius: 4px; margin-top: 15px;">
                    <strong>⚠️ Configuración incompleta.</strong><br>
                    <?php if (!$acf_activo): ?>
                        • Instala y activa el plugin "Advanced Custom Fields"<br>
                    <?php endif; ?>
                    <?php if (!$producto_existe || !$tienda_existe || !$taxonomia_existe): ?>
                        • Los tipos de post y taxonomías se registrarán automáticamente al activar este plugin<br>
                    <?php endif; ?>
                </div>
            <?php endif; ?>
            
            <h3>📋 Próximos pasos:</h3>
            <ol>
                <?php if (!$acf_activo): ?>
                    <li>Instalar y activar "Advanced Custom Fields"</li>
                <?php endif; ?>
                <li>Verificar que aparezcan "Productos" y "Tiendas" en el menú lateral</li>
                <li>Crear algunos productos y tiendas de prueba</li>
                <li>Usar el plugin "Generador de Contenido de Prueba"</li>
            </ol>
        </div>
    </div>
    <?php
}

// Limpiar al desactivar
register_deactivation_hook(__FILE__, 'configuracion_comparador_desactivacion');

function configuracion_comparador_desactivacion() {
    flush_rewrite_rules();
}

?>