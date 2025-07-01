<?php
/**
 * Plugin Name: Contenido de Prueba - Comparador de Precios (Mejorado)
 * Description: Crea contenido de prueba con logging detallado y diagnóstico avanzado
 * Version: 2.0
 * Author: Tu Nombre
 */

// Evitar acceso directo
if (!defined('ABSPATH')) {
    exit;
}

// Añadir página de administración
add_action('admin_menu', 'test_content_menu_mejorado');

function test_content_menu_mejorado() {
    add_management_page(
        'Contenido de Prueba Mejorado',
        'Contenido de Prueba Mejorado',
        'manage_options',
        'test-content-mejorado',
        'test_content_pagina_mejorada'
    );
}

function test_content_pagina_mejorada() {
    // Ejecutar creación de contenido si se solicita
    if (isset($_POST['crear_contenido'])) {
        $resultado = crear_contenido_prueba_mejorado();
    }
    
    // Limpiar todo el contenido si se solicita
    if (isset($_POST['limpiar_contenido'])) {
        $resultado = limpiar_contenido_prueba();
    }
    
    ?>
    <div class="wrap">
        <h1>🧪 Generador de Contenido de Prueba Mejorado</h1>
        <p>Versión mejorada con logging detallado y mejor diagnóstico de errores.</p>
        
        <div class="card" style="max-width: 900px; padding: 20px; margin: 20px 0;">
            <h2>⚠️ Requisitos Importantes:</h2>
            <?php mostrar_requisitos_detallados(); ?>
            
            <h2>🚀 Acciones:</h2>
            <form method="post" style="margin-bottom: 20px;">
                <input type="submit" name="crear_contenido" class="button button-primary" value="🧪 Crear Contenido de Prueba (Con Logging)">
                <input type="submit" name="limpiar_contenido" class="button button-secondary" value="🗑️ Limpiar Todo el Contenido" style="margin-left: 10px;">
            </form>
            
            <?php if (isset($resultado)): ?>
                <div style="background: #f0f8ff; padding: 15px; border: 1px solid #0073aa; border-radius: 4px; margin: 15px 0;">
                    <h3>📊 Resultado Detallado:</h3>
                    <pre style="background: #fff; padding: 10px; border: 1px solid #ddd; overflow-x: auto; font-size: 12px; max-height: 400px;"><?php echo esc_html($resultado); ?></pre>
                </div>
            <?php endif; ?>
            
            <h3>📋 Estado Actual:</h3>
            <?php mostrar_estado_actual(); ?>
        </div>
    </div>
    <?php
}

function mostrar_requisitos_detallados() {
    $acf_activo = function_exists('acf_add_local_field_group');
    $producto_existe = post_type_exists('producto');
    $tienda_existe = post_type_exists('tienda');
    $taxonomia_existe = taxonomy_exists('categoria_producto');
    
    echo '<ul style="list-style-type: none; padding: 0;">';
    echo '<li style="margin: 5px 0;">'
        . ($acf_activo ? '✅' : '❌') 
        . ' Plugin ACF (Advanced Custom Fields) activo</li>';
    echo '<li style="margin: 5px 0;">'
        . ($producto_existe ? '✅' : '❌') 
        . ' Tipos de post: <code>producto</code> y <code>tienda</code></li>';
    echo '<li style="margin: 5px 0;">'
        . ($taxonomia_existe ? '✅' : '❌') 
        . ' Taxonomía: <code>categoria_producto</code></li>';
    echo '</ul>';
    
    if (!$acf_activo || !$producto_existe || !$tienda_existe || !$taxonomia_existe) {
        echo '<div style="background: #fff3cd; padding: 10px; border: 1px solid #ffeaa7; border-radius: 4px; margin: 10px 0;">';
        echo '<strong>💡 Tip:</strong> Usa el plugin "Diagnóstico Completo" para configurar automáticamente los requisitos faltantes.';
        echo '</div>';
    }
}

function mostrar_estado_actual() {
    // Contar contenido existente
    $count_productos = 0;
    $count_tiendas = 0;
    $count_categorias = 0;
    
    if (post_type_exists('producto')) {
        $productos = get_posts(['post_type' => 'producto', 'numberposts' => -1, 'post_status' => 'any']);
        $count_productos = count($productos);
    }
    
    if (post_type_exists('tienda')) {
        $tiendas = get_posts(['post_type' => 'tienda', 'numberposts' => -1, 'post_status' => 'any']);
        $count_tiendas = count($tiendas);
    }
    
    if (taxonomy_exists('categoria_producto')) {
        $categorias = get_terms(['taxonomy' => 'categoria_producto', 'hide_empty' => false]);
        $count_categorias = is_array($categorias) ? count($categorias) : 0;
    }
    
    echo '<table class="widefat">';
    echo '<tr><td><strong>Productos existentes:</strong></td><td>' . $count_productos . '</td></tr>';
    echo '<tr><td><strong>Tiendas existentes:</strong></td><td>' . $count_tiendas . '</td></tr>';
    echo '<tr><td><strong>Categorías existentes:</strong></td><td>' . $count_categorias . '</td></tr>';
    echo '</table>';
}

function crear_contenido_prueba_mejorado() {
    $log = "=== CREACIÓN DE CONTENIDO DE PRUEBA MEJORADO ===\n";
    $log .= "Fecha: " . date('Y-m-d H:i:s') . "\n\n";
    
    // 1. Verificación inicial de requisitos
    $log .= "1. VERIFICANDO REQUISITOS:\n";
    $requisitos_ok = true;
    
    if (!function_exists('acf_add_local_field_group')) {
        $log .= "   ❌ ACF no está activo\n";
        $requisitos_ok = false;
    } else {
        $log .= "   ✅ ACF está activo\n";
    }
    
    if (!post_type_exists('producto')) {
        $log .= "   ❌ Tipo de post 'producto' no existe\n";
        $requisitos_ok = false;
    } else {
        $log .= "   ✅ Tipo de post 'producto' existe\n";
    }
    
    if (!post_type_exists('tienda')) {
        $log .= "   ❌ Tipo de post 'tienda' no existe\n";
        $requisitos_ok = false;
    } else {
        $log .= "   ✅ Tipo de post 'tienda' existe\n";
    }
    
    if (!taxonomy_exists('categoria_producto')) {
        $log .= "   ❌ Taxonomía 'categoria_producto' no existe\n";
        $requisitos_ok = false;
    } else {
        $log .= "   ✅ Taxonomía 'categoria_producto' existe\n";
    }
    
    if (!$requisitos_ok) {
        $log .= "\n❌ FALTAN REQUISITOS. Usa el plugin 'Diagnóstico Completo' para configurar automáticamente.\n";
        return $log;
    }
    
    $log .= "\n2. CREANDO CATEGORÍAS:\n";
    $categorias_data = [
        'Electrónicos' => 'Productos electrónicos y tecnología',
        'Hogar' => 'Artículos para el hogar',
        'Deportes' => 'Equipamiento deportivo',
        'Libros' => 'Libros y material de lectura'
    ];
    
    $categorias_creadas = [];
    foreach ($categorias_data as $nombre => $descripcion) {
        $existing_term = get_term_by('name', $nombre, 'categoria_producto');
        if ($existing_term) {
            $log .= "   ℹ️ Categoría '$nombre' ya existe (ID: {$existing_term->term_id})\n";
            $categorias_creadas[] = $existing_term->term_id;
        } else {
            $term = wp_insert_term($nombre, 'categoria_producto', [
                'description' => $descripcion
            ]);
            
            if (is_wp_error($term)) {
                $log .= "   ❌ Error creando categoría '$nombre': " . $term->get_error_message() . "\n";
            } else {
                $log .= "   ✅ Categoría '$nombre' creada (ID: {$term['term_id']})\n";
                $categorias_creadas[] = $term['term_id'];
            }
        }
    }
    
    $log .= "\n3. CREANDO TIENDAS:\n";
    $tiendas_data = [
        'Amazon' => 'Tienda online líder mundial',
        'MercadoLibre' => 'Marketplace de América Latina',
        'Falabella' => 'Tienda departamental',
        'Ripley' => 'Retail y moda'
    ];
    
    $tiendas_creadas = [];
    foreach ($tiendas_data as $nombre => $descripcion) {
        // Verificar si ya existe
        $existing_tienda = get_posts([
            'post_type' => 'tienda',
            'title' => $nombre,
            'post_status' => 'any',
            'numberposts' => 1
        ]);
        
        if (!empty($existing_tienda)) {
            $log .= "   ℹ️ Tienda '$nombre' ya existe (ID: {$existing_tienda[0]->ID})\n";
            $tiendas_creadas[] = $existing_tienda[0]->ID;
        } else {
            $tienda_id = wp_insert_post([
                'post_title' => $nombre,
                'post_content' => $descripcion,
                'post_status' => 'publish',
                'post_type' => 'tienda'
            ]);
            
            if (is_wp_error($tienda_id)) {
                $log .= "   ❌ Error creando tienda '$nombre': " . $tienda_id->get_error_message() . "\n";
            } else {
                $log .= "   ✅ Tienda '$nombre' creada (ID: $tienda_id)\n";
                $tiendas_creadas[] = $tienda_id;
                
                // Añadir campos ACF si están disponibles
                if (function_exists('update_field')) {
                    update_field('ubicacion', 'Online', $tienda_id);
                    update_field('telefono', '+1-800-' . rand(100, 999) . '-' . rand(1000, 9999), $tienda_id);
                    $log .= "     📝 Campos ACF añadidos a tienda '$nombre'\n";
                }
            }
        }
    }
    
    $log .= "\n4. CREANDO PRODUCTOS:\n";
    $productos_data = [
        ['nombre' => 'iPhone 15', 'precio_usd' => 999, 'precio_bs' => 6930, 'categoria' => 'Electrónicos'],
        ['nombre' => 'Samsung Galaxy S24', 'precio_usd' => 899, 'precio_bs' => 6237, 'categoria' => 'Electrónicos'],
        ['nombre' => 'Aspiradora Dyson', 'precio_usd' => 299, 'precio_bs' => 2077, 'categoria' => 'Hogar'],
        ['nombre' => 'Bicicleta Trek', 'precio_usd' => 599, 'precio_bs' => 4158, 'categoria' => 'Deportes'],
        ['nombre' => 'Libro "Cien años de soledad"', 'precio_usd' => 15, 'precio_bs' => 104, 'categoria' => 'Libros']
    ];
    
    $productos_creados = 0;
    foreach ($productos_data as $producto_info) {
        // Verificar si ya existe
        $existing_producto = get_posts([
            'post_type' => 'producto',
            'title' => $producto_info['nombre'],
            'post_status' => 'any',
            'numberposts' => 1
        ]);
        
        if (!empty($existing_producto)) {
            $log .= "   ℹ️ Producto '{$producto_info['nombre']}' ya existe (ID: {$existing_producto[0]->ID})\n";
        } else {
            $producto_id = wp_insert_post([
                'post_title' => $producto_info['nombre'],
                'post_content' => 'Descripción del producto ' . $producto_info['nombre'],
                'post_status' => 'publish',
                'post_type' => 'producto'
            ]);
            
            if (is_wp_error($producto_id)) {
                $log .= "   ❌ Error creando producto '{$producto_info['nombre']}': " . $producto_id->get_error_message() . "\n";
            } else {
                $log .= "   ✅ Producto '{$producto_info['nombre']}' creado (ID: $producto_id)\n";
                $productos_creados++;
                
                // Asignar categoría
                $categoria_term = get_term_by('name', $producto_info['categoria'], 'categoria_producto');
                if ($categoria_term) {
                    wp_set_post_terms($producto_id, [$categoria_term->term_id], 'categoria_producto');
                    $log .= "     📂 Categoría '{$producto_info['categoria']}' asignada\n";
                }
                
                // Añadir campos ACF si están disponibles
                if (function_exists('update_field')) {
                    update_field('precio_usd', $producto_info['precio_usd'], $producto_id);
                    update_field('precio_bs', $producto_info['precio_bs'], $producto_id);
                    update_field('marca', 'Marca ' . rand(1, 10), $producto_id);
                    update_field('disponible', true, $producto_id);
                    update_field('stock', rand(1, 100), $producto_id);
                    
                    // Asignar tienda aleatoria
                    if (!empty($tiendas_creadas)) {
                        $tienda_random = $tiendas_creadas[array_rand($tiendas_creadas)];
                        update_field('tienda', $tienda_random, $producto_id);
                        $log .= "     🏪 Tienda asignada (ID: $tienda_random)\n";
                    }
                    
                    $log .= "     📝 Campos ACF añadidos\n";
                }
            }
        }
    }
    
    // 5. Resumen final
    $log .= "\n5. RESUMEN FINAL:\n";
    $log .= "   📊 Categorías disponibles: " . count($categorias_creadas) . "\n";
    $log .= "   🏪 Tiendas disponibles: " . count($tiendas_creadas) . "\n";
    $log .= "   📦 Productos nuevos creados: $productos_creados\n";
    
    // Contar totales
    $total_productos = get_posts(['post_type' => 'producto', 'numberposts' => -1, 'post_status' => 'any']);
    $total_tiendas = get_posts(['post_type' => 'tienda', 'numberposts' => -1, 'post_status' => 'any']);
    $total_categorias = get_terms(['taxonomy' => 'categoria_producto', 'hide_empty' => false]);
    
    $log .= "   📈 TOTALES EN EL SISTEMA:\n";
    $log .= "      - Productos: " . count($total_productos) . "\n";
    $log .= "      - Tiendas: " . count($total_tiendas) . "\n";
    $log .= "      - Categorías: " . (is_array($total_categorias) ? count($total_categorias) : 0) . "\n";
    
    if ($productos_creados > 0) {
        $log .= "\n✅ ÉXITO: Se creó contenido de prueba exitosamente.\n";
        $log .= "💡 Ahora puedes probar el frontend de React y la conversión de precios.\n";
    } else {
        $log .= "\nℹ️ INFO: No se creó contenido nuevo (ya existía).\n";
        $log .= "💡 El sistema ya tiene contenido disponible para pruebas.\n";
    }
    
    $log .= "\n=== FIN DE LA CREACIÓN ===\n";
    
    return $log;
}

function limpiar_contenido_prueba() {
    $log = "=== LIMPIEZA DE CONTENIDO DE PRUEBA ===\n";
    $log .= "Fecha: " . date('Y-m-d H:i:s') . "\n\n";
    
    $eliminados = 0;
    
    // Eliminar productos
    if (post_type_exists('producto')) {
        $productos = get_posts(['post_type' => 'producto', 'numberposts' => -1, 'post_status' => 'any']);
        foreach ($productos as $producto) {
            wp_delete_post($producto->ID, true);
            $eliminados++;
        }
        $log .= "🗑️ Productos eliminados: " . count($productos) . "\n";
    }
    
    // Eliminar tiendas
    if (post_type_exists('tienda')) {
        $tiendas = get_posts(['post_type' => 'tienda', 'numberposts' => -1, 'post_status' => 'any']);
        foreach ($tiendas as $tienda) {
            wp_delete_post($tienda->ID, true);
            $eliminados++;
        }
        $log .= "🗑️ Tiendas eliminadas: " . count($tiendas) . "\n";
    }
    
    // Eliminar categorías
    if (taxonomy_exists('categoria_producto')) {
        $categorias = get_terms(['taxonomy' => 'categoria_producto', 'hide_empty' => false]);
        if (is_array($categorias)) {
            foreach ($categorias as $categoria) {
                wp_delete_term($categoria->term_id, 'categoria_producto');
                $eliminados++;
            }
            $log .= "🗑️ Categorías eliminadas: " . count($categorias) . "\n";
        }
    }
    
    $log .= "\n✅ Limpieza completada. Total de elementos eliminados: $eliminados\n";
    
    return $log;
}

?>