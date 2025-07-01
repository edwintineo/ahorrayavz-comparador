<?php
/**
 * Script para crear contenido de prueba en WordPress
 * Ejecutar desde wp-admin/admin.php?page=test-content-creator
 * 
 * Este script crea:
 * - Categorías de productos
 * - Tiendas/comercios
 * - Productos con precios en USD y Bs
 */

// Verificar que estamos en WordPress
if (!defined('ABSPATH')) {
    die('Acceso directo no permitido');
}

// Función para crear categorías de prueba
function create_test_categories() {
    $categories = [
        [
            'name' => 'Electrónicos',
            'description' => 'Dispositivos electrónicos y tecnología',
            'icon' => '📱'
        ],
        [
            'name' => 'Hogar y Jardín',
            'description' => 'Productos para el hogar y jardín',
            'icon' => '🏠'
        ],
        [
            'name' => 'Ropa y Accesorios',
            'description' => 'Vestimenta y accesorios de moda',
            'icon' => '👕'
        ],
        [
            'name' => 'Deportes',
            'description' => 'Equipos y accesorios deportivos',
            'icon' => '⚽'
        ],
        [
            'name' => 'Salud y Belleza',
            'description' => 'Productos de cuidado personal',
            'icon' => '💄'
        ],
        [
            'name' => 'Alimentos',
            'description' => 'Comida y bebidas',
            'icon' => '🍕'
        ]
    ];
    
    $created_categories = [];
    
    foreach ($categories as $category) {
        // Crear término de categoría
        $term = wp_insert_term(
            $category['name'],
            'categoria_producto',
            [
                'description' => $category['description']
            ]
        );
        
        if (!is_wp_error($term)) {
            // Agregar campos personalizados si usas ACF
            if (function_exists('update_field')) {
                update_field('icono', $category['icon'], 'categoria_producto_' . $term['term_id']);
            }
            
            $created_categories[] = [
                'id' => $term['term_id'],
                'name' => $category['name']
            ];
        }
    }
    
    return $created_categories;
}

// Función para crear tiendas de prueba
function create_test_stores() {
    $stores = [
        [
            'title' => 'TecnoMax',
            'description' => 'Tienda especializada en electrónicos y tecnología',
            'location' => 'Caracas, Venezuela',
            'phone' => '+58 212 555-0101',
            'email' => 'info@tecnomax.ve',
            'website' => 'https://tecnomax.ve',
            'rating' => 4.5
        ],
        [
            'title' => 'Casa Bella',
            'description' => 'Todo para tu hogar y jardín',
            'location' => 'Valencia, Venezuela',
            'phone' => '+58 241 555-0202',
            'email' => 'ventas@casabella.ve',
            'website' => 'https://casabella.ve',
            'rating' => 4.2
        ],
        [
            'title' => 'Moda Urbana',
            'description' => 'Ropa y accesorios de última moda',
            'location' => 'Maracaibo, Venezuela',
            'phone' => '+58 261 555-0303',
            'email' => 'contacto@modaurbana.ve',
            'website' => 'https://modaurbana.ve',
            'rating' => 4.7
        ],
        [
            'title' => 'Deportes Total',
            'description' => 'Equipos deportivos para todos',
            'location' => 'Barquisimeto, Venezuela',
            'phone' => '+58 251 555-0404',
            'email' => 'info@deportestotal.ve',
            'website' => 'https://deportestotal.ve',
            'rating' => 4.3
        ],
        [
            'title' => 'Farmacia Salud+',
            'description' => 'Productos de salud y belleza',
            'location' => 'Maracay, Venezuela',
            'phone' => '+58 243 555-0505',
            'email' => 'ventas@saludmas.ve',
            'website' => 'https://saludmas.ve',
            'rating' => 4.6
        ],
        [
            'title' => 'Súper Mercado Central',
            'description' => 'Alimentos frescos y productos básicos',
            'location' => 'San Cristóbal, Venezuela',
            'phone' => '+58 276 555-0606',
            'email' => 'info@mercadocentral.ve',
            'website' => 'https://mercadocentral.ve',
            'rating' => 4.1
        ]
    ];
    
    $created_stores = [];
    
    foreach ($stores as $store) {
        $post_id = wp_insert_post([
            'post_title' => $store['title'],
            'post_content' => $store['description'],
            'post_status' => 'publish',
            'post_type' => 'tienda'
        ]);
        
        if ($post_id && !is_wp_error($post_id)) {
            // Agregar campos personalizados
            if (function_exists('update_field')) {
                update_field('ubicacion', $store['location'], $post_id);
                update_field('telefono', $store['phone'], $post_id);
                update_field('email', $store['email'], $post_id);
                update_field('sitio_web', $store['website'], $post_id);
                update_field('calificacion', $store['rating'], $post_id);
            }
            
            $created_stores[] = [
                'id' => $post_id,
                'name' => $store['title']
            ];
        }
    }
    
    return $created_stores;
}

// Función para crear productos de prueba
function create_test_products($categories, $stores) {
    $products = [
        // Electrónicos
        [
            'title' => 'iPhone 15 Pro 128GB',
            'description' => 'Último modelo de iPhone con chip A17 Pro y cámara de 48MP',
            'category' => 'Electrónicos',
            'price_usd' => 999.00,
            'brand' => 'Apple',
            'model' => 'iPhone 15 Pro',
            'warranty' => '12 meses'
        ],
        [
            'title' => 'Samsung Galaxy S24 Ultra',
            'description' => 'Smartphone premium con S Pen y cámara de 200MP',
            'category' => 'Electrónicos',
            'price_usd' => 1199.00,
            'brand' => 'Samsung',
            'model' => 'Galaxy S24 Ultra',
            'warranty' => '24 meses'
        ],
        [
            'title' => 'MacBook Air M3',
            'description' => 'Laptop ultradelgada con chip M3 y pantalla Liquid Retina',
            'category' => 'Electrónicos',
            'price_usd' => 1299.00,
            'brand' => 'Apple',
            'model' => 'MacBook Air M3',
            'warranty' => '12 meses'
        ],
        
        // Hogar y Jardín
        [
            'title' => 'Aspiradora Robot Roomba',
            'description' => 'Robot aspiradora inteligente con mapeo y control por app',
            'category' => 'Hogar y Jardín',
            'price_bs' => 14600.00, // Precio en bolívares
            'brand' => 'iRobot',
            'model' => 'Roomba i7+',
            'warranty' => '24 meses'
        ],
        [
            'title' => 'Juego de Ollas Antiadherentes',
            'description' => 'Set de 12 piezas con recubrimiento cerámico',
            'category' => 'Hogar y Jardín',
            'price_usd' => 89.99,
            'brand' => 'T-fal',
            'model' => 'Ceramic Pro',
            'warranty' => '6 meses'
        ],
        
        // Ropa y Accesorios
        [
            'title' => 'Zapatillas Nike Air Max',
            'description' => 'Zapatillas deportivas con tecnología Air Max',
            'category' => 'Ropa y Accesorios',
            'price_usd' => 120.00,
            'brand' => 'Nike',
            'model' => 'Air Max 270',
            'warranty' => '6 meses'
        ],
        [
            'title' => 'Reloj Smartwatch Apple Watch',
            'description' => 'Reloj inteligente con GPS y monitor de salud',
            'category' => 'Ropa y Accesorios',
            'price_bs' => 18250.00,
            'brand' => 'Apple',
            'model' => 'Apple Watch Series 9',
            'warranty' => '12 meses'
        ],
        
        // Deportes
        [
            'title' => 'Bicicleta de Montaña Trek',
            'description' => 'Bicicleta todo terreno con suspensión completa',
            'category' => 'Deportes',
            'price_usd' => 850.00,
            'brand' => 'Trek',
            'model' => 'Fuel EX 7',
            'warranty' => '24 meses'
        ],
        [
            'title' => 'Pelota de Fútbol Adidas',
            'description' => 'Balón oficial de fútbol profesional',
            'category' => 'Deportes',
            'price_bs' => 1825.00,
            'brand' => 'Adidas',
            'model' => 'Tango España',
            'warranty' => '3 meses'
        ],
        
        // Salud y Belleza
        [
            'title' => 'Crema Facial Anti-edad',
            'description' => 'Crema hidratante con retinol y vitamina C',
            'category' => 'Salud y Belleza',
            'price_usd' => 45.99,
            'brand' => 'Olay',
            'model' => 'Regenerist',
            'warranty' => 'N/A'
        ],
        [
            'title' => 'Vitaminas Multivitamínico',
            'description' => 'Suplemento vitamínico completo para adultos',
            'category' => 'Salud y Belleza',
            'price_bs' => 1095.00,
            'brand' => 'Centrum',
            'model' => 'Adults',
            'warranty' => 'N/A'
        ],
        
        // Alimentos
        [
            'title' => 'Aceite de Oliva Extra Virgen',
            'description' => 'Aceite de oliva premium importado de España',
            'category' => 'Alimentos',
            'price_usd' => 12.99,
            'brand' => 'Carbonell',
            'model' => 'Extra Virgen 500ml',
            'warranty' => 'N/A'
        ],
        [
            'title' => 'Café Gourmet Venezolano',
            'description' => 'Café tostado artesanal de los Andes venezolanos',
            'category' => 'Alimentos',
            'price_bs' => 730.00,
            'brand' => 'Café Fama',
            'model' => 'Gourmet 500g',
            'warranty' => 'N/A'
        ]
    ];
    
    $created_products = [];
    
    foreach ($products as $product) {
        // Encontrar la categoría
        $category_id = null;
        foreach ($categories as $cat) {
            if ($cat['name'] === $product['category']) {
                $category_id = $cat['id'];
                break;
            }
        }
        
        // Seleccionar tienda aleatoria
        $store = $stores[array_rand($stores)];
        
        $post_id = wp_insert_post([
            'post_title' => $product['title'],
            'post_content' => $product['description'],
            'post_status' => 'publish',
            'post_type' => 'producto'
        ]);
        
        if ($post_id && !is_wp_error($post_id)) {
            // Asignar categoría
            if ($category_id) {
                wp_set_post_terms($post_id, [$category_id], 'categoria_producto');
            }
            
            // Agregar campos personalizados
            if (function_exists('update_field')) {
                // Precio (solo uno, el sistema convertirá automáticamente)
                if (isset($product['price_usd'])) {
                    update_field('precio_usd', $product['price_usd'], $post_id);
                } elseif (isset($product['price_bs'])) {
                    update_field('precio_bs', $product['price_bs'], $post_id);
                }
                
                update_field('marca', $product['brand'], $post_id);
                update_field('modelo', $product['model'], $post_id);
                update_field('garantia', $product['warranty'], $post_id);
                update_field('tienda', $store['id'], $post_id);
                update_field('disponible', true, $post_id);
                update_field('stock', rand(5, 50), $post_id);
            }
            
            $created_products[] = [
                'id' => $post_id,
                'title' => $product['title'],
                'category' => $product['category'],
                'store' => $store['name']
            ];
        }
    }
    
    return $created_products;
}

// Función principal para crear todo el contenido
function create_all_test_content() {
    $results = [
        'success' => true,
        'message' => '',
        'data' => []
    ];
    
    try {
        // Crear categorías
        $categories = create_test_categories();
        $results['data']['categories'] = $categories;
        
        // Crear tiendas
        $stores = create_test_stores();
        $results['data']['stores'] = $stores;
        
        // Crear productos
        $products = create_test_products($categories, $stores);
        $results['data']['products'] = $products;
        
        $results['message'] = sprintf(
            'Contenido creado exitosamente: %d categorías, %d tiendas, %d productos',
            count($categories),
            count($stores),
            count($products)
        );
        
    } catch (Exception $e) {
        $results['success'] = false;
        $results['message'] = 'Error al crear contenido: ' . $e->getMessage();
    }
    
    return $results;
}

// Página de administración para ejecutar el script
function add_test_content_admin_page() {
    add_management_page(
        'Crear Contenido de Prueba',
        'Contenido de Prueba',
        'manage_options',
        'test-content-creator',
        'test_content_admin_page'
    );
}
add_action('admin_menu', 'add_test_content_admin_page');

function test_content_admin_page() {
    $message = '';
    
    if (isset($_POST['create_content']) && wp_verify_nonce($_POST['_wpnonce'], 'create_test_content')) {
        $results = create_all_test_content();
        $message = $results['message'];
        $message_type = $results['success'] ? 'success' : 'error';
    }
    
    ?>
    <div class="wrap">
        <h1>Crear Contenido de Prueba</h1>
        
        <?php if ($message): ?>
            <div class="notice notice-<?php echo $message_type; ?> is-dismissible">
                <p><?php echo esc_html($message); ?></p>
            </div>
        <?php endif; ?>
        
        <div class="card">
            <h2>Generar Datos de Prueba</h2>
            <p>Este script creará contenido de prueba para el sistema de comparación de precios:</p>
            <ul>
                <li><strong>6 Categorías:</strong> Electrónicos, Hogar y Jardín, Ropa y Accesorios, Deportes, Salud y Belleza, Alimentos</li>
                <li><strong>6 Tiendas:</strong> Con información completa (ubicación, contacto, calificación)</li>
                <li><strong>14 Productos:</strong> Con precios en USD o Bs (el sistema convertirá automáticamente)</li>
            </ul>
            
            <form method="post">
                <?php wp_nonce_field('create_test_content'); ?>
                <p class="submit">
                    <input type="submit" name="create_content" class="button-primary" value="Crear Contenido de Prueba" 
                           onclick="return confirm('¿Estás seguro de que quieres crear el contenido de prueba? Esto agregará nuevos posts a tu sitio.');">
                </p>
            </form>
            
            <h3>Importante:</h3>
            <ul>
                <li>Asegúrate de tener los tipos de post 'producto' y 'tienda' configurados</li>
                <li>Verifica que la taxonomía 'categoria_producto' esté creada</li>
                <li>Los campos personalizados deben estar configurados con ACF</li>
                <li>El sistema de conversión de precios debe estar activo</li>
            </ul>
        </div>
    </div>
    <?php
}

?>