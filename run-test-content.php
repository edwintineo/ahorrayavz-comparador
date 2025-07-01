<?php
/**
 * Script ejecutable para crear contenido de prueba
 * Ejecutar desde la línea de comandos: php run-test-content.php
 * O incluir en functions.php y ejecutar desde wp-admin
 */

// Si se ejecuta desde línea de comandos, cargar WordPress
if (php_sapi_name() === 'cli') {
    // Ajustar la ruta según tu instalación de WordPress
    $wp_path = dirname(__FILE__) . '/wp-load.php';
    if (!file_exists($wp_path)) {
        echo "Error: No se puede encontrar WordPress. Ajusta la ruta en el script.\n";
        echo "Ruta actual buscada: $wp_path\n";
        echo "Ejecuta este script desde el directorio raíz de WordPress o ajusta la variable \$wp_path\n";
        exit(1);
    }
    require_once($wp_path);
}

// Función para mostrar progreso
function show_progress($message, $is_cli = null) {
    if ($is_cli === null) {
        $is_cli = php_sapi_name() === 'cli';
    }
    
    if ($is_cli) {
        echo $message . "\n";
    } else {
        echo '<p>' . esc_html($message) . '</p>';
        if (ob_get_level()) {
            ob_flush();
            flush();
        }
    }
}

// Datos de prueba simplificados
function get_test_data() {
    return [
        'categories' => [
            ['name' => 'Electrónicos', 'desc' => 'Dispositivos electrónicos y tecnología', 'icon' => '📱'],
            ['name' => 'Hogar y Jardín', 'desc' => 'Productos para el hogar y jardín', 'icon' => '🏠'],
            ['name' => 'Ropa y Accesorios', 'desc' => 'Vestimenta y accesorios de moda', 'icon' => '👕'],
            ['name' => 'Deportes', 'desc' => 'Equipos y accesorios deportivos', 'icon' => '⚽'],
            ['name' => 'Salud y Belleza', 'desc' => 'Productos de cuidado personal', 'icon' => '💄'],
            ['name' => 'Alimentos', 'desc' => 'Comida y bebidas', 'icon' => '🍕']
        ],
        'stores' => [
            ['name' => 'TecnoMax', 'desc' => 'Tienda de electrónicos', 'location' => 'Caracas', 'phone' => '+58 212 555-0101'],
            ['name' => 'Casa Bella', 'desc' => 'Todo para tu hogar', 'location' => 'Valencia', 'phone' => '+58 241 555-0202'],
            ['name' => 'Moda Urbana', 'desc' => 'Ropa de moda', 'location' => 'Maracaibo', 'phone' => '+58 261 555-0303'],
            ['name' => 'Deportes Total', 'desc' => 'Equipos deportivos', 'location' => 'Barquisimeto', 'phone' => '+58 251 555-0404'],
            ['name' => 'Farmacia Salud+', 'desc' => 'Salud y belleza', 'location' => 'Maracay', 'phone' => '+58 243 555-0505'],
            ['name' => 'Súper Central', 'desc' => 'Alimentos frescos', 'location' => 'San Cristóbal', 'phone' => '+58 276 555-0606']
        ],
        'products' => [
            ['name' => 'iPhone 15 Pro 128GB', 'desc' => 'Último modelo de iPhone', 'cat' => 'Electrónicos', 'price_usd' => 999, 'brand' => 'Apple'],
            ['name' => 'Samsung Galaxy S24', 'desc' => 'Smartphone premium', 'cat' => 'Electrónicos', 'price_usd' => 1199, 'brand' => 'Samsung'],
            ['name' => 'MacBook Air M3', 'desc' => 'Laptop ultradelgada', 'cat' => 'Electrónicos', 'price_usd' => 1299, 'brand' => 'Apple'],
            ['name' => 'Aspiradora Robot', 'desc' => 'Robot aspiradora inteligente', 'cat' => 'Hogar y Jardín', 'price_bs' => 14600, 'brand' => 'iRobot'],
            ['name' => 'Juego de Ollas', 'desc' => 'Set de 12 piezas antiadherentes', 'cat' => 'Hogar y Jardín', 'price_usd' => 89.99, 'brand' => 'T-fal'],
            ['name' => 'Zapatillas Nike', 'desc' => 'Zapatillas deportivas Air Max', 'cat' => 'Ropa y Accesorios', 'price_usd' => 120, 'brand' => 'Nike'],
            ['name' => 'Apple Watch Series 9', 'desc' => 'Reloj inteligente', 'cat' => 'Ropa y Accesorios', 'price_bs' => 18250, 'brand' => 'Apple'],
            ['name' => 'Bicicleta Trek', 'desc' => 'Bicicleta de montaña', 'cat' => 'Deportes', 'price_usd' => 850, 'brand' => 'Trek'],
            ['name' => 'Pelota Adidas', 'desc' => 'Balón de fútbol profesional', 'cat' => 'Deportes', 'price_bs' => 1825, 'brand' => 'Adidas'],
            ['name' => 'Crema Anti-edad', 'desc' => 'Crema facial con retinol', 'cat' => 'Salud y Belleza', 'price_usd' => 45.99, 'brand' => 'Olay'],
            ['name' => 'Multivitamínico', 'desc' => 'Suplemento vitamínico', 'cat' => 'Salud y Belleza', 'price_bs' => 1095, 'brand' => 'Centrum'],
            ['name' => 'Aceite de Oliva', 'desc' => 'Extra virgen importado', 'cat' => 'Alimentos', 'price_usd' => 12.99, 'brand' => 'Carbonell'],
            ['name' => 'Café Venezolano', 'desc' => 'Café gourmet de los Andes', 'cat' => 'Alimentos', 'price_bs' => 730, 'brand' => 'Café Fama']
        ]
    ];
}

// Crear contenido de prueba
function create_test_content_simple() {
    $is_cli = php_sapi_name() === 'cli';
    $data = get_test_data();
    $results = ['categories' => [], 'stores' => [], 'products' => []];
    
    show_progress('🚀 Iniciando creación de contenido de prueba...', $is_cli);
    
    // 1. Crear categorías
    show_progress('📁 Creando categorías...', $is_cli);
    foreach ($data['categories'] as $cat) {
        $term = wp_insert_term($cat['name'], 'categoria_producto', ['description' => $cat['desc']]);
        if (!is_wp_error($term)) {
            if (function_exists('update_field')) {
                update_field('icono', $cat['icon'], 'categoria_producto_' . $term['term_id']);
            }
            $results['categories'][] = ['id' => $term['term_id'], 'name' => $cat['name']];
            show_progress('  ✅ ' . $cat['name'], $is_cli);
        } else {
            show_progress('  ❌ Error creando ' . $cat['name'] . ': ' . $term->get_error_message(), $is_cli);
        }
    }
    
    // 2. Crear tiendas
    show_progress('🏪 Creando tiendas...', $is_cli);
    foreach ($data['stores'] as $store) {
        $post_id = wp_insert_post([
            'post_title' => $store['name'],
            'post_content' => $store['desc'],
            'post_status' => 'publish',
            'post_type' => 'tienda'
        ]);
        
        if ($post_id && !is_wp_error($post_id)) {
            if (function_exists('update_field')) {
                update_field('ubicacion', $store['location'], $post_id);
                update_field('telefono', $store['phone'], $post_id);
                update_field('calificacion', rand(40, 50) / 10, $post_id); // 4.0 - 5.0
            }
            $results['stores'][] = ['id' => $post_id, 'name' => $store['name']];
            show_progress('  ✅ ' . $store['name'], $is_cli);
        } else {
            show_progress('  ❌ Error creando tienda ' . $store['name'], $is_cli);
        }
    }
    
    // 3. Crear productos
    show_progress('📦 Creando productos...', $is_cli);
    foreach ($data['products'] as $product) {
        // Encontrar categoría
        $category_id = null;
        foreach ($results['categories'] as $cat) {
            if ($cat['name'] === $product['cat']) {
                $category_id = $cat['id'];
                break;
            }
        }
        
        // Seleccionar tienda aleatoria
        $store = $results['stores'][array_rand($results['stores'])];
        
        $post_id = wp_insert_post([
            'post_title' => $product['name'],
            'post_content' => $product['desc'],
            'post_status' => 'publish',
            'post_type' => 'producto'
        ]);
        
        if ($post_id && !is_wp_error($post_id)) {
            // Asignar categoría
            if ($category_id) {
                wp_set_post_terms($post_id, [$category_id], 'categoria_producto');
            }
            
            if (function_exists('update_field')) {
                // Precio (el sistema convertirá automáticamente)
                if (isset($product['price_usd'])) {
                    update_field('precio_usd', $product['price_usd'], $post_id);
                } elseif (isset($product['price_bs'])) {
                    update_field('precio_bs', $product['price_bs'], $post_id);
                }
                
                update_field('marca', $product['brand'], $post_id);
                update_field('tienda', $store['id'], $post_id);
                update_field('disponible', true, $post_id);
                update_field('stock', rand(5, 50), $post_id);
            }
            
            $results['products'][] = ['id' => $post_id, 'name' => $product['name']];
            show_progress('  ✅ ' . $product['name'], $is_cli);
        } else {
            show_progress('  ❌ Error creando producto ' . $product['name'], $is_cli);
        }
    }
    
    // Resumen
    $summary = sprintf(
        '🎉 ¡Contenido creado exitosamente!\n📊 Resumen: %d categorías, %d tiendas, %d productos',
        count($results['categories']),
        count($results['stores']),
        count($results['products'])
    );
    
    show_progress('', $is_cli);
    show_progress($summary, $is_cli);
    show_progress('', $is_cli);
    show_progress('💡 Próximos pasos:', $is_cli);
    show_progress('1. Verifica que los productos aparezcan en tu sitio', $is_cli);
    show_progress('2. Prueba la conversión automática de precios', $is_cli);
    show_progress('3. Revisa que las categorías y tiendas estén correctas', $is_cli);
    
    return $results;
}

// Ejecutar si es llamado desde línea de comandos
if (php_sapi_name() === 'cli') {
    echo "\n=== CREADOR DE CONTENIDO DE PRUEBA ===\n\n";
    
    // Verificar que WordPress esté cargado
    if (!function_exists('wp_insert_post')) {
        echo "❌ Error: WordPress no está cargado correctamente.\n";
        exit(1);
    }
    
    echo "✅ WordPress cargado correctamente\n\n";
    
    // Preguntar confirmación
    echo "¿Quieres crear el contenido de prueba? (y/N): ";
    $handle = fopen("php://stdin", "r");
    $line = fgets($handle);
    fclose($handle);
    
    if (trim(strtolower($line)) !== 'y') {
        echo "\n❌ Operación cancelada.\n";
        exit(0);
    }
    
    echo "\n";
    create_test_content_simple();
    echo "\n✨ ¡Proceso completado!\n\n";
}

// Función para usar en WordPress admin
function execute_test_content_creation() {
    if (!current_user_can('manage_options')) {
        wp_die('No tienes permisos para realizar esta acción.');
    }
    
    echo '<div class="wrap"><h1>Creando Contenido de Prueba</h1>';
    create_test_content_simple();
    echo '<p><a href="' . admin_url('edit.php?post_type=producto') . '" class="button-primary">Ver Productos Creados</a></p>';
    echo '</div>';
}

?>