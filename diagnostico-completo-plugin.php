<?php
/**
 * Plugin Name: Diagnóstico Completo - Comparador de Precios
 * Description: Plugin de diagnóstico avanzado para identificar problemas de configuración
 * Version: 1.0
 * Author: Tu Nombre
 */

// Evitar acceso directo
if (!defined('ABSPATH')) {
    exit;
}

// Añadir página de administración
add_action('admin_menu', 'diagnostico_comparador_menu');

function diagnostico_comparador_menu() {
    add_management_page(
        'Diagnóstico Completo',
        'Diagnóstico Completo',
        'manage_options',
        'diagnostico-comparador',
        'diagnostico_comparador_pagina'
    );
}

function diagnostico_comparador_pagina() {
    // Ejecutar diagnóstico si se solicita
    if (isset($_POST['ejecutar_diagnostico'])) {
        $diagnostico = ejecutar_diagnostico_completo();
    }
    
    // Ejecutar reparación automática si se solicita
    if (isset($_POST['reparar_automatico'])) {
        $reparacion = ejecutar_reparacion_automatica();
    }
    
    ?>
    <div class="wrap">
        <h1>🔍 Diagnóstico Completo del Comparador de Precios</h1>
        <p>Esta herramienta identifica y soluciona problemas de configuración.</p>
        
        <div class="card" style="max-width: 800px; padding: 20px; margin: 20px 0;">
            <h2>🚀 Acciones Rápidas:</h2>
            
            <form method="post" style="margin-bottom: 20px;">
                <input type="submit" name="ejecutar_diagnostico" class="button button-primary" value="🔍 Ejecutar Diagnóstico Completo">
                <input type="submit" name="reparar_automatico" class="button button-secondary" value="🔧 Reparación Automática" style="margin-left: 10px;">
            </form>
            
            <?php if (isset($diagnostico)): ?>
                <div style="background: #f0f8ff; padding: 15px; border: 1px solid #0073aa; border-radius: 4px; margin: 15px 0;">
                    <h3>📊 Resultados del Diagnóstico:</h3>
                    <pre style="background: #fff; padding: 10px; border: 1px solid #ddd; overflow-x: auto; font-size: 12px;"><?php echo esc_html($diagnostico); ?></pre>
                </div>
            <?php endif; ?>
            
            <?php if (isset($reparacion)): ?>
                <div style="background: #d4edda; padding: 15px; border: 1px solid #c3e6cb; border-radius: 4px; margin: 15px 0;">
                    <h3>🔧 Resultados de la Reparación:</h3>
                    <pre style="background: #fff; padding: 10px; border: 1px solid #ddd; overflow-x: auto; font-size: 12px;"><?php echo esc_html($reparacion); ?></pre>
                </div>
            <?php endif; ?>
            
            <h3>📋 Verificación Rápida:</h3>
            <?php mostrar_estado_rapido(); ?>
        </div>
    </div>
    <?php
}

function mostrar_estado_rapido() {
    $acf_activo = function_exists('acf_add_local_field_group');
    $producto_existe = post_type_exists('producto');
    $tienda_existe = post_type_exists('tienda');
    $taxonomia_existe = taxonomy_exists('categoria_producto');
    
    // Contar contenido existente
    $count_productos = wp_count_posts('producto');
    $count_tiendas = wp_count_posts('tienda');
    $count_categorias = wp_count_terms(['taxonomy' => 'categoria_producto']);
    
    echo '<table class="widefat">';
    echo '<tr><td><strong>Plugin ACF:</strong></td><td>' . ($acf_activo ? '✅ Activo' : '❌ No activo') . '</td></tr>';
    echo '<tr><td><strong>Tipo de post "Producto":</strong></td><td>' . ($producto_existe ? '✅ Registrado' : '❌ No registrado') . '</td></tr>';
    echo '<tr><td><strong>Tipo de post "Tienda":</strong></td><td>' . ($tienda_existe ? '✅ Registrado' : '❌ No registrado') . '</td></tr>';
    echo '<tr><td><strong>Taxonomía "Categoría Producto":</strong></td><td>' . ($taxonomia_existe ? '✅ Registrada' : '❌ No registrada') . '</td></tr>';
    echo '<tr><td><strong>Productos existentes:</strong></td><td>' . ($count_productos->publish ?? 0) . '</td></tr>';
    echo '<tr><td><strong>Tiendas existentes:</strong></td><td>' . ($count_tiendas->publish ?? 0) . '</td></tr>';
    echo '<tr><td><strong>Categorías existentes:</strong></td><td>' . ($count_categorias ?? 0) . '</td></tr>';
    echo '</table>';
}

function ejecutar_diagnostico_completo() {
    $log = "=== DIAGNÓSTICO COMPLETO DEL COMPARADOR DE PRECIOS ===\n";
    $log .= "Fecha: " . date('Y-m-d H:i:s') . "\n\n";
    
    // 1. Verificar WordPress
    $log .= "1. INFORMACIÓN DE WORDPRESS:\n";
    $log .= "   - Versión de WordPress: " . get_bloginfo('version') . "\n";
    $log .= "   - Tema activo: " . get_option('stylesheet') . "\n";
    $log .= "   - URL del sitio: " . get_site_url() . "\n\n";
    
    // 2. Verificar plugins
    $log .= "2. PLUGINS RELEVANTES:\n";
    $plugins_activos = get_option('active_plugins');
    $acf_encontrado = false;
    foreach ($plugins_activos as $plugin) {
        if (strpos($plugin, 'advanced-custom-fields') !== false) {
            $log .= "   ✅ ACF encontrado: $plugin\n";
            $acf_encontrado = true;
        }
        if (strpos($plugin, 'custom-post-type') !== false) {
            $log .= "   📦 Custom Post Type UI: $plugin\n";
        }
    }
    if (!$acf_encontrado) {
        $log .= "   ❌ ACF NO encontrado en plugins activos\n";
    }
    $log .= "\n";
    
    // 3. Verificar funciones ACF
    $log .= "3. FUNCIONES ACF:\n";
    $log .= "   - function_exists('acf_add_local_field_group'): " . (function_exists('acf_add_local_field_group') ? 'SÍ' : 'NO') . "\n";
    $log .= "   - function_exists('update_field'): " . (function_exists('update_field') ? 'SÍ' : 'NO') . "\n";
    $log .= "   - function_exists('get_field'): " . (function_exists('get_field') ? 'SÍ' : 'NO') . "\n\n";
    
    // 4. Verificar tipos de post
    $log .= "4. TIPOS DE POST:\n";
    $tipos_post = get_post_types(['public' => true], 'objects');
    $producto_encontrado = false;
    $tienda_encontrada = false;
    
    foreach ($tipos_post as $tipo => $objeto) {
        if ($tipo === 'producto') {
            $log .= "   ✅ Producto encontrado: $tipo\n";
            $producto_encontrado = true;
        } elseif ($tipo === 'tienda') {
            $log .= "   ✅ Tienda encontrada: $tipo\n";
            $tienda_encontrada = true;
        }
    }
    
    if (!$producto_encontrado) {
        $log .= "   ❌ Tipo de post 'producto' NO encontrado\n";
    }
    if (!$tienda_encontrada) {
        $log .= "   ❌ Tipo de post 'tienda' NO encontrado\n";
    }
    $log .= "\n";
    
    // 5. Verificar taxonomías
    $log .= "5. TAXONOMÍAS:\n";
    $taxonomias = get_taxonomies(['public' => true], 'objects');
    $categoria_encontrada = false;
    
    foreach ($taxonomias as $tax => $objeto) {
        if ($tax === 'categoria_producto') {
            $log .= "   ✅ Categoría de producto encontrada: $tax\n";
            $categoria_encontrada = true;
        }
    }
    
    if (!$categoria_encontrada) {
        $log .= "   ❌ Taxonomía 'categoria_producto' NO encontrada\n";
    }
    $log .= "\n";
    
    // 6. Verificar contenido existente
    $log .= "6. CONTENIDO EXISTENTE:\n";
    if ($producto_encontrado) {
        $productos = get_posts(['post_type' => 'producto', 'numberposts' => -1]);
        $log .= "   - Productos: " . count($productos) . "\n";
        if (count($productos) > 0) {
            $log .= "     Primeros 3 productos:\n";
            for ($i = 0; $i < min(3, count($productos)); $i++) {
                $log .= "     - " . $productos[$i]->post_title . " (ID: " . $productos[$i]->ID . ")\n";
            }
        }
    }
    
    if ($tienda_encontrada) {
        $tiendas = get_posts(['post_type' => 'tienda', 'numberposts' => -1]);
        $log .= "   - Tiendas: " . count($tiendas) . "\n";
        if (count($tiendas) > 0) {
            $log .= "     Primeras 3 tiendas:\n";
            for ($i = 0; $i < min(3, count($tiendas)); $i++) {
                $log .= "     - " . $tiendas[$i]->post_title . " (ID: " . $tiendas[$i]->ID . ")\n";
            }
        }
    }
    
    if ($categoria_encontrada) {
        $categorias = get_terms(['taxonomy' => 'categoria_producto', 'hide_empty' => false]);
        $log .= "   - Categorías: " . count($categorias) . "\n";
        if (count($categorias) > 0) {
            $log .= "     Categorías existentes:\n";
            foreach ($categorias as $cat) {
                $log .= "     - " . $cat->name . " (ID: " . $cat->term_id . ")\n";
            }
        }
    }
    $log .= "\n";
    
    // 7. Verificar errores de PHP
    $log .= "7. CONFIGURACIÓN PHP:\n";
    $log .= "   - Versión PHP: " . phpversion() . "\n";
    $log .= "   - Memoria límite: " . ini_get('memory_limit') . "\n";
    $log .= "   - Tiempo máximo ejecución: " . ini_get('max_execution_time') . "\n";
    $log .= "   - Display errors: " . (ini_get('display_errors') ? 'ON' : 'OFF') . "\n\n";
    
    // 8. Verificar hooks y acciones
    $log .= "8. HOOKS Y ACCIONES:\n";
    global $wp_filter;
    if (isset($wp_filter['init'])) {
        $log .= "   - Hook 'init' tiene " . count($wp_filter['init']) . " callbacks\n";
    }
    if (isset($wp_filter['acf/init'])) {
        $log .= "   - Hook 'acf/init' tiene " . count($wp_filter['acf/init']) . " callbacks\n";
    }
    $log .= "\n";
    
    // 9. Recomendaciones
    $log .= "9. RECOMENDACIONES:\n";
    if (!function_exists('acf_add_local_field_group')) {
        $log .= "   🔧 CRÍTICO: Instalar y activar Advanced Custom Fields\n";
    }
    if (!$producto_encontrado || !$tienda_encontrada) {
        $log .= "   🔧 CRÍTICO: Registrar tipos de post personalizados\n";
    }
    if (!$categoria_encontrada) {
        $log .= "   🔧 CRÍTICO: Registrar taxonomía categoria_producto\n";
    }
    
    $log .= "\n=== FIN DEL DIAGNÓSTICO ===\n";
    
    return $log;
}

function ejecutar_reparacion_automatica() {
    $log = "=== REPARACIÓN AUTOMÁTICA ===\n";
    $log .= "Fecha: " . date('Y-m-d H:i:s') . "\n\n";
    
    // 1. Registrar tipos de post si no existen
    if (!post_type_exists('producto')) {
        $resultado = register_post_type('producto', [
            'labels' => [
                'name' => 'Productos',
                'singular_name' => 'Producto',
            ],
            'public' => true,
            'has_archive' => true,
            'supports' => ['title', 'editor', 'thumbnail'],
            'menu_icon' => 'dashicons-products',
            'show_in_rest' => true,
        ]);
        
        if (is_wp_error($resultado)) {
            $log .= "❌ Error registrando tipo 'producto': " . $resultado->get_error_message() . "\n";
        } else {
            $log .= "✅ Tipo de post 'producto' registrado exitosamente\n";
        }
    } else {
        $log .= "ℹ️ Tipo de post 'producto' ya existe\n";
    }
    
    if (!post_type_exists('tienda')) {
        $resultado = register_post_type('tienda', [
            'labels' => [
                'name' => 'Tiendas',
                'singular_name' => 'Tienda',
            ],
            'public' => true,
            'has_archive' => true,
            'supports' => ['title', 'editor', 'thumbnail'],
            'menu_icon' => 'dashicons-store',
            'show_in_rest' => true,
        ]);
        
        if (is_wp_error($resultado)) {
            $log .= "❌ Error registrando tipo 'tienda': " . $resultado->get_error_message() . "\n";
        } else {
            $log .= "✅ Tipo de post 'tienda' registrado exitosamente\n";
        }
    } else {
        $log .= "ℹ️ Tipo de post 'tienda' ya existe\n";
    }
    
    // 2. Registrar taxonomía si no existe
    if (!taxonomy_exists('categoria_producto')) {
        $resultado = register_taxonomy('categoria_producto', 'producto', [
            'labels' => [
                'name' => 'Categorías de Producto',
                'singular_name' => 'Categoría de Producto',
            ],
            'public' => true,
            'hierarchical' => true,
            'show_admin_column' => true,
            'show_in_rest' => true,
        ]);
        
        if (is_wp_error($resultado)) {
            $log .= "❌ Error registrando taxonomía 'categoria_producto': " . $resultado->get_error_message() . "\n";
        } else {
            $log .= "✅ Taxonomía 'categoria_producto' registrada exitosamente\n";
        }
    } else {
        $log .= "ℹ️ Taxonomía 'categoria_producto' ya existe\n";
    }
    
    // 3. Limpiar permalinks
    flush_rewrite_rules();
    $log .= "🔄 Permalinks actualizados\n";
    
    // 4. Crear contenido de prueba básico
    $log .= "\n--- CREANDO CONTENIDO DE PRUEBA ---\n";
    
    // Crear una categoría de prueba
    if (taxonomy_exists('categoria_producto')) {
        $term = wp_insert_term('Electrónicos', 'categoria_producto', [
            'description' => 'Productos electrónicos de prueba'
        ]);
        
        if (is_wp_error($term)) {
            $log .= "⚠️ Categoría 'Electrónicos' ya existe o error: " . $term->get_error_message() . "\n";
        } else {
            $log .= "✅ Categoría 'Electrónicos' creada (ID: " . $term['term_id'] . ")\n";
        }
    }
    
    // Crear una tienda de prueba
    if (post_type_exists('tienda')) {
        $tienda_id = wp_insert_post([
            'post_title' => 'Tienda de Prueba',
            'post_content' => 'Esta es una tienda de prueba creada automáticamente.',
            'post_status' => 'publish',
            'post_type' => 'tienda'
        ]);
        
        if (is_wp_error($tienda_id)) {
            $log .= "❌ Error creando tienda: " . $tienda_id->get_error_message() . "\n";
        } else {
            $log .= "✅ Tienda de prueba creada (ID: $tienda_id)\n";
        }
    }
    
    // Crear un producto de prueba
    if (post_type_exists('producto')) {
        $producto_id = wp_insert_post([
            'post_title' => 'Producto de Prueba',
            'post_content' => 'Este es un producto de prueba creado automáticamente.',
            'post_status' => 'publish',
            'post_type' => 'producto'
        ]);
        
        if (is_wp_error($producto_id)) {
            $log .= "❌ Error creando producto: " . $producto_id->get_error_message() . "\n";
        } else {
            $log .= "✅ Producto de prueba creado (ID: $producto_id)\n";
            
            // Asignar categoría si existe
            if (taxonomy_exists('categoria_producto')) {
                $terms = get_terms(['taxonomy' => 'categoria_producto', 'hide_empty' => false]);
                if (!empty($terms) && !is_wp_error($terms)) {
                    wp_set_post_terms($producto_id, [$terms[0]->term_id], 'categoria_producto');
                    $log .= "✅ Categoría asignada al producto\n";
                }
            }
        }
    }
    
    $log .= "\n=== FIN DE LA REPARACIÓN ===\n";
    
    return $log;
}

?>