<?php
/**
 * Functions.php para AhorraYa VZ
 * Código para agregar al archivo functions.php del tema activo
 */

// Prevenir acceso directo
if (!defined('ABSPATH')) {
    exit;
}

/**
 * 1. REGISTRO DE CUSTOM POST TYPES
 */

// Registrar CPT: Productos
function ahorraya_register_productos_cpt() {
    $labels = array(
        'name'                  => 'Productos',
        'singular_name'         => 'Producto',
        'menu_name'             => 'Productos',
        'name_admin_bar'        => 'Producto',
        'archives'              => 'Archivo de Productos',
        'attributes'            => 'Atributos del Producto',
        'parent_item_colon'     => 'Producto Padre:',
        'all_items'             => 'Todos los Productos',
        'add_new_item'          => 'Agregar Nuevo Producto',
        'add_new'               => 'Agregar Nuevo',
        'new_item'              => 'Nuevo Producto',
        'edit_item'             => 'Editar Producto',
        'update_item'           => 'Actualizar Producto',
        'view_item'             => 'Ver Producto',
        'view_items'            => 'Ver Productos',
        'search_items'          => 'Buscar Productos',
        'not_found'             => 'No encontrado',
        'not_found_in_trash'    => 'No encontrado en papelera',
        'featured_image'        => 'Imagen del Producto',
        'set_featured_image'    => 'Establecer imagen del producto',
        'remove_featured_image' => 'Remover imagen del producto',
        'use_featured_image'    => 'Usar como imagen del producto',
        'insert_into_item'      => 'Insertar en producto',
        'uploaded_to_this_item' => 'Subido a este producto',
        'items_list'            => 'Lista de productos',
        'items_list_navigation' => 'Navegación de lista de productos',
        'filter_items_list'     => 'Filtrar lista de productos',
    );
    
    $args = array(
        'label'                 => 'Producto',
        'description'           => 'Productos del comparador de precios',
        'labels'                => $labels,
        'supports'              => array('title', 'editor', 'thumbnail', 'custom-fields', 'excerpt'),
        'taxonomies'            => array('categoria_producto'),
        'hierarchical'          => false,
        'public'                => true,
        'show_ui'               => true,
        'show_in_menu'          => true,
        'menu_position'         => 20,
        'menu_icon'             => 'dashicons-cart',
        'show_in_admin_bar'     => true,
        'show_in_nav_menus'     => true,
        'can_export'            => true,
        'has_archive'           => true,
        'exclude_from_search'   => false,
        'publicly_queryable'    => true,
        'capability_type'       => 'post',
        'show_in_rest'          => true,
        'rest_base'             => 'productos',
        'rest_controller_class' => 'WP_REST_Posts_Controller',
    );
    
    register_post_type('productos', $args);
}
add_action('init', 'ahorraya_register_productos_cpt', 0);

// Registrar CPT: Tiendas
function ahorraya_register_tiendas_cpt() {
    $labels = array(
        'name'                  => 'Tiendas',
        'singular_name'         => 'Tienda',
        'menu_name'             => 'Tiendas',
        'name_admin_bar'        => 'Tienda',
        'archives'              => 'Archivo de Tiendas',
        'attributes'            => 'Atributos de la Tienda',
        'parent_item_colon'     => 'Tienda Padre:',
        'all_items'             => 'Todas las Tiendas',
        'add_new_item'          => 'Agregar Nueva Tienda',
        'add_new'               => 'Agregar Nueva',
        'new_item'              => 'Nueva Tienda',
        'edit_item'             => 'Editar Tienda',
        'update_item'           => 'Actualizar Tienda',
        'view_item'             => 'Ver Tienda',
        'view_items'            => 'Ver Tiendas',
        'search_items'          => 'Buscar Tiendas',
        'not_found'             => 'No encontrado',
        'not_found_in_trash'    => 'No encontrado en papelera',
        'featured_image'        => 'Logo de la Tienda',
        'set_featured_image'    => 'Establecer logo de la tienda',
        'remove_featured_image' => 'Remover logo de la tienda',
        'use_featured_image'    => 'Usar como logo de la tienda',
    );
    
    $args = array(
        'label'                 => 'Tienda',
        'description'           => 'Tiendas registradas en el comparador',
        'labels'                => $labels,
        'supports'              => array('title', 'editor', 'thumbnail', 'custom-fields'),
        'taxonomies'            => array('categoria_tienda'),
        'hierarchical'          => false,
        'public'                => true,
        'show_ui'               => true,
        'show_in_menu'          => true,
        'menu_position'         => 21,
        'menu_icon'             => 'dashicons-store',
        'show_in_admin_bar'     => true,
        'show_in_nav_menus'     => true,
        'can_export'            => true,
        'has_archive'           => true,
        'exclude_from_search'   => false,
        'publicly_queryable'    => true,
        'capability_type'       => 'post',
        'show_in_rest'          => true,
        'rest_base'             => 'tiendas',
        'rest_controller_class' => 'WP_REST_Posts_Controller',
    );
    
    register_post_type('tiendas', $args);
}
add_action('init', 'ahorraya_register_tiendas_cpt', 0);

// Registrar CPT: Listas de Compras
function ahorraya_register_listas_compras_cpt() {
    $labels = array(
        'name'                  => 'Listas de Compras',
        'singular_name'         => 'Lista de Compras',
        'menu_name'             => 'Listas de Compras',
        'name_admin_bar'        => 'Lista de Compras',
        'all_items'             => 'Todas las Listas',
        'add_new_item'          => 'Agregar Nueva Lista',
        'add_new'               => 'Agregar Nueva',
        'new_item'              => 'Nueva Lista',
        'edit_item'             => 'Editar Lista',
        'update_item'           => 'Actualizar Lista',
        'view_item'             => 'Ver Lista',
        'search_items'          => 'Buscar Listas',
    );
    
    $args = array(
        'label'                 => 'Lista de Compras',
        'description'           => 'Listas de compras de usuarios',
        'labels'                => $labels,
        'supports'              => array('title', 'custom-fields'),
        'hierarchical'          => false,
        'public'                => false,
        'show_ui'               => true,
        'show_in_menu'          => true,
        'menu_position'         => 22,
        'menu_icon'             => 'dashicons-list-view',
        'show_in_admin_bar'     => false,
        'show_in_nav_menus'     => false,
        'can_export'            => true,
        'has_archive'           => false,
        'exclude_from_search'   => true,
        'publicly_queryable'    => false,
        'capability_type'       => 'post',
        'show_in_rest'          => true,
        'rest_base'             => 'listas-compras',
        'rest_controller_class' => 'WP_REST_Posts_Controller',
    );
    
    register_post_type('listas_compras', $args);
}
add_action('init', 'ahorraya_register_listas_compras_cpt', 0);

/**
 * 2. TAXONOMÍAS PERSONALIZADAS
 */

// Registrar taxonomía: Categoría de Productos
function ahorraya_register_categoria_producto_taxonomy() {
    $labels = array(
        'name'              => 'Categorías de Productos',
        'singular_name'     => 'Categoría de Producto',
        'search_items'      => 'Buscar Categorías',
        'all_items'         => 'Todas las Categorías',
        'parent_item'       => 'Categoría Padre',
        'parent_item_colon' => 'Categoría Padre:',
        'edit_item'         => 'Editar Categoría',
        'update_item'       => 'Actualizar Categoría',
        'add_new_item'      => 'Agregar Nueva Categoría',
        'new_item_name'     => 'Nuevo Nombre de Categoría',
        'menu_name'         => 'Categorías',
    );
    
    $args = array(
        'hierarchical'      => true,
        'labels'            => $labels,
        'show_ui'           => true,
        'show_admin_column' => true,
        'query_var'         => true,
        'show_in_rest'      => true,
        'rest_base'         => 'categorias-productos',
        'rewrite'           => array('slug' => 'categoria-producto'),
    );
    
    register_taxonomy('categoria_producto', array('productos'), $args);
}
add_action('init', 'ahorraya_register_categoria_producto_taxonomy', 0);

/**
 * 3. ENDPOINTS PERSONALIZADOS DE LA API REST
 */

// Registrar endpoints personalizados
function ahorraya_register_custom_endpoints() {
    // Endpoint para tasa de cambio BCV
    register_rest_route('ahorraya/v1', '/tasa-bcv', array(
        'methods'  => 'GET',
        'callback' => 'ahorraya_get_exchange_rate',
        'permission_callback' => '__return_true',
    ));
    
    // Endpoint para búsqueda avanzada de productos
    register_rest_route('ahorraya/v1', '/buscar-productos', array(
        'methods'  => 'GET',
        'callback' => 'ahorraya_search_products',
        'permission_callback' => '__return_true',
        'args' => array(
            'q' => array(
                'required' => false,
                'type' => 'string',
                'description' => 'Término de búsqueda',
            ),
            'categoria' => array(
                'required' => false,
                'type' => 'string',
                'description' => 'Categoría del producto',
            ),
            'precio_min' => array(
                'required' => false,
                'type' => 'number',
                'description' => 'Precio mínimo en Bs.',
            ),
            'precio_max' => array(
                'required' => false,
                'type' => 'number',
                'description' => 'Precio máximo en Bs.',
            ),
            'lat' => array(
                'required' => false,
                'type' => 'number',
                'description' => 'Latitud para búsqueda por proximidad',
            ),
            'lng' => array(
                'required' => false,
                'type' => 'number',
                'description' => 'Longitud para búsqueda por proximidad',
            ),
            'radio' => array(
                'required' => false,
                'type' => 'number',
                'description' => 'Radio de búsqueda en km',
                'default' => 10,
            ),
        ),
    ));
    
    // Endpoint para productos cercanos
    register_rest_route('ahorraya/v1', '/productos-cercanos', array(
        'methods'  => 'GET',
        'callback' => 'ahorraya_get_nearby_products',
        'permission_callback' => '__return_true',
        'args' => array(
            'lat' => array(
                'required' => true,
                'type' => 'number',
            ),
            'lng' => array(
                'required' => true,
                'type' => 'number',
            ),
            'radio' => array(
                'required' => false,
                'type' => 'number',
                'default' => 5,
            ),
        ),
    ));
    
    // Endpoint para listas de compras del usuario
    register_rest_route('ahorraya/v1', '/mis-listas', array(
        'methods'  => 'GET',
        'callback' => 'ahorraya_get_user_shopping_lists',
        'permission_callback' => 'is_user_logged_in',
    ));
}
add_action('rest_api_init', 'ahorraya_register_custom_endpoints');

/**
 * 4. FUNCIONES DE LOS ENDPOINTS
 */

// Función simplificada para obtener la tasa de cambio (sin APIs externas)
function ahorraya_get_exchange_rate($request) {
    // Verificar caché primero
    $cached_rate = get_transient('ahorraya_bcv_rate');
    
    if ($cached_rate !== false) {
        return rest_ensure_response(array(
            'success' => true,
            'data' => array(
                'rate' => floatval($cached_rate['rate']),
                'last_updated' => $cached_rate['timestamp'],
                'source' => 'Cache',
                'cached' => true
            )
        ));
    }
    
    // Tasa fija actualizable manualmente (cambiar este valor cuando sea necesario)
    $rate = 36.50; // Actualiza este valor manualmente
    $timestamp = current_time('mysql');
    
    // Guardar en caché por 24 horas
    $cache_data = array(
        'rate' => $rate,
        'timestamp' => $timestamp
    );
    set_transient('ahorraya_bcv_rate', $cache_data, DAY_IN_SECONDS);
    
    return rest_ensure_response(array(
        'success' => true,
        'data' => array(
            'rate' => $rate,
            'last_updated' => $timestamp,
            'source' => 'Manual',
            'cached' => false
        )
    ));
}

// Función auxiliar para obtener la tasa de cambio actual
function ahorraya_get_current_exchange_rate() {
    $cached_rate = get_transient('ahorraya_bcv_rate');
    
    if ($cached_rate !== false) {
        return floatval($cached_rate['rate']);
    }
    
    // Si no hay caché, usar tasa por defecto
    return 36.50;
}

// Función para convertir precios automáticamente
function ahorraya_convert_price($amount, $from_currency = 'bs', $to_currency = 'usd') {
    $rate = ahorraya_get_current_exchange_rate();
    
    if ($from_currency === 'bs' && $to_currency === 'usd') {
        return $rate > 0 ? round($amount / $rate, 2) : 0;
    } elseif ($from_currency === 'usd' && $to_currency === 'bs') {
        return round($amount * $rate, 2);
    }
    
    return $amount;
}

 // Función para obtener precio en Bs con conversión automática
function ahorraya_get_product_price_bs($product_id) {
    // Intentar obtener precio en Bs directamente
    $precio_bs = floatval(get_field('precio_bs', $product_id));
    
    // Si no existe, intentar con nombre alternativo
    if (!$precio_bs) {
        $precio_bs = floatval(get_field('precio_bolivares', $product_id));
    }
    
    // Si aún no hay precio en Bs, convertir desde USD
    if (!$precio_bs) {
        $precio_usd = floatval(get_field('precio_usd', $product_id));
        if ($precio_usd > 0) {
            $precio_bs = ahorraya_convert_price($precio_usd, 'usd', 'bs');
        }
    }
    
    return $precio_bs;
}

// Función para obtener precio en USD con conversión automática
function ahorraya_get_product_price_usd($product_id) {
    // Intentar obtener precio en USD directamente
    $precio_usd = floatval(get_field('precio_usd', $product_id));
    
    // Si no hay precio en USD, convertir desde Bs
    if (!$precio_usd) {
        $precio_bs = floatval(get_field('precio_bs', $product_id));
        
        // Si no existe, intentar con nombre alternativo
        if (!$precio_bs) {
            $precio_bs = floatval(get_field('precio_bolivares', $product_id));
        }
        
        if ($precio_bs > 0) {
            $precio_usd = ahorraya_convert_price($precio_bs, 'bs', 'usd');
        }
    }
    
    return $precio_usd;
}

// JavaScript para conversión automática de precios en el admin
function ahorraya_admin_price_converter_script() {
    global $post_type;
    
    if ($post_type === 'productos') {
        ?>
        <script type="text/javascript">
        jQuery(document).ready(function($) {
            // Obtener la tasa de cambio actual
            let exchangeRate = 36.50; // Valor por defecto
            
            // Obtener tasa actual del endpoint
            $.get('/wp-json/ahorraya/v1/tasa-bcv', function(response) {
                if (response.success && response.data.rate) {
                    exchangeRate = parseFloat(response.data.rate);
                }
            });
            
            // Función para convertir precios
            function convertPrice(amount, fromCurrency, toCurrency) {
                if (fromCurrency === 'bs' && toCurrency === 'usd') {
                    return exchangeRate > 0 ? (amount / exchangeRate).toFixed(2) : 0;
                } else if (fromCurrency === 'usd' && toCurrency === 'bs') {
                    return (amount * exchangeRate).toFixed(2);
                }
                return amount;
            }
            
            // Campos de precio
            const precioBsField = $('input[name="acf[field_precio_bs]"], input[id*="precio_bs"]');
            const precioUsdField = $('input[name="acf[field_precio_usd]"], input[id*="precio_usd"]');
            
            // Conversión automática cuando se cambia el precio en Bs
            precioBsField.on('input blur', function() {
                const bsValue = parseFloat($(this).val()) || 0;
                if (bsValue > 0) {
                    const usdValue = convertPrice(bsValue, 'bs', 'usd');
                    precioUsdField.val(usdValue);
                    
                    // Mostrar indicador visual
                    precioUsdField.css('background-color', '#e8f5e8').delay(1000).queue(function() {
                        $(this).css('background-color', '').dequeue();
                    });
                }
            });
            
            // Conversión automática cuando se cambia el precio en USD
            precioUsdField.on('input blur', function() {
                const usdValue = parseFloat($(this).val()) || 0;
                if (usdValue > 0) {
                    const bsValue = convertPrice(usdValue, 'usd', 'bs');
                    precioBsField.val(bsValue);
                    
                    // Mostrar indicador visual
                    precioBsField.css('background-color', '#e8f5e8').delay(1000).queue(function() {
                        $(this).css('background-color', '').dequeue();
                    });
                }
            });
            
            // Agregar información de tasa de cambio
            if (precioBsField.length && precioUsdField.length) {
                const rateInfo = $('<div style="margin: 10px 0; padding: 10px; background: #f0f8ff; border-left: 4px solid #0073aa; font-size: 12px;">💱 <strong>Conversión Automática Activa</strong><br>Tasa actual: 1 USD = ' + exchangeRate + ' Bs.<br>Los precios se convierten automáticamente al escribir en cualquier campo.</div>');
                precioBsField.closest('.acf-field').after(rateInfo);
            }
        });
        </script>
        <?php
    }
}
add_action('admin_footer', 'ahorraya_admin_price_converter_script');

// Hook para actualizar precios automáticamente al guardar producto
function ahorraya_auto_update_prices($post_id) {
    // Verificar que es un producto
    if (get_post_type($post_id) !== 'productos') {
        return;
    }
    
    // Evitar loops infinitos
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    
    // Obtener precios actuales
    $precio_bs = floatval(get_field('precio_bs', $post_id));
    $precio_usd = floatval(get_field('precio_usd', $post_id));
    
    // Si no existe precio_bs, intentar con nombre alternativo
    if (!$precio_bs) {
        $precio_bs = floatval(get_field('precio_bolivares', $post_id));
    }
    
    // Si solo hay precio en Bs, calcular USD
    if ($precio_bs > 0 && !$precio_usd) {
        $precio_usd_calculado = ahorraya_convert_price($precio_bs, 'bs', 'usd');
        update_field('precio_usd', $precio_usd_calculado, $post_id);
    }
    
    // Si solo hay precio en USD, calcular Bs
    elseif ($precio_usd > 0 && !$precio_bs) {
        $precio_bs_calculado = ahorraya_convert_price($precio_usd, 'usd', 'bs');
        update_field('precio_bs', $precio_bs_calculado, $post_id);
        
        // También actualizar el campo alternativo si existe
        if (get_field('precio_bolivares', $post_id) !== false) {
            update_field('precio_bolivares', $precio_bs_calculado, $post_id);
        }
    }
}
add_action('acf/save_post', 'ahorraya_auto_update_prices', 20);

// Función para búsqueda avanzada de productos
function ahorraya_search_products($request) {
    $params = $request->get_params();
    
    $args = array(
        'post_type' => 'productos',
        'post_status' => 'publish',
        'posts_per_page' => isset($params['per_page']) ? intval($params['per_page']) : 20,
        'paged' => isset($params['page']) ? intval($params['page']) : 1,
        'meta_query' => array(),
        'tax_query' => array(),
    );
    
    // Búsqueda por texto
    if (!empty($params['q'])) {
        $args['s'] = sanitize_text_field($params['q']);
    }
    
    // Filtro por categoría
    if (!empty($params['categoria'])) {
        $args['tax_query'][] = array(
            'taxonomy' => 'categoria_producto',
            'field'    => 'slug',
            'terms'    => sanitize_text_field($params['categoria']),
        );
    }
    
    // Filtro por rango de precios
    if (isset($params['precio_min']) || isset($params['precio_max'])) {
        $price_query = array(
            'key' => 'precio_bolivares',
            'type' => 'NUMERIC',
        );
        
        if (isset($params['precio_min']) && isset($params['precio_max'])) {
            $price_query['value'] = array(floatval($params['precio_min']), floatval($params['precio_max']));
            $price_query['compare'] = 'BETWEEN';
        } elseif (isset($params['precio_min'])) {
            $price_query['value'] = floatval($params['precio_min']);
            $price_query['compare'] = '>=';
        } elseif (isset($params['precio_max'])) {
            $price_query['value'] = floatval($params['precio_max']);
            $price_query['compare'] = '<=';
        }
        
        $args['meta_query'][] = $price_query;
    }
    
    // Ordenamiento
    if (isset($params['orderby'])) {
        switch ($params['orderby']) {
            case 'price_low':
                $args['meta_key'] = 'precio_bolivares';
                $args['orderby'] = 'meta_value_num';
                $args['order'] = 'ASC';
                break;
            case 'price_high':
                $args['meta_key'] = 'precio_bolivares';
                $args['orderby'] = 'meta_value_num';
                $args['order'] = 'DESC';
                break;
            case 'newest':
                $args['orderby'] = 'date';
                $args['order'] = 'DESC';
                break;
            case 'oldest':
                $args['orderby'] = 'date';
                $args['order'] = 'ASC';
                break;
        }
    }
    
    $query = new WP_Query($args);
    
    $products = array();
    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $product_id = get_the_ID();
            
            $products[] = array(
                'id' => $product_id,
                'title' => get_the_title(),
                'content' => get_the_content(),
                'excerpt' => get_the_excerpt(),
                'featured_image' => get_the_post_thumbnail_url($product_id, 'medium'),
                'precio_bs' => ahorraya_get_product_price_bs($product_id),
                'precio_usd' => ahorraya_get_product_price_usd($product_id),
                'categoria' => get_field('categoria', $product_id),
                'marca' => get_field('marca', $product_id),
                'tienda' => get_field('tienda_asociada', $product_id),
                'disponible' => get_field('disponible', $product_id),
                'fecha_actualizacion' => get_field('fecha_actualizacion', $product_id),
            );
        }
        wp_reset_postdata();
    }
    
    return rest_ensure_response(array(
        'success' => true,
        'data' => $products,
        'pagination' => array(
            'total' => $query->found_posts,
            'pages' => $query->max_num_pages,
            'current_page' => intval($args['paged']),
            'per_page' => intval($args['posts_per_page'])
        )
    ));
}

// Función para obtener productos cercanos
function ahorraya_get_nearby_products($request) {
    $params = $request->get_params();
    $lat = floatval($params['lat']);
    $lng = floatval($params['lng']);
    $radio = floatval($params['radio']);
    
    // Obtener todas las tiendas primero
    $tiendas_query = new WP_Query(array(
        'post_type' => 'tiendas',
        'post_status' => 'publish',
        'posts_per_page' => -1,
        'meta_query' => array(
            array(
                'key' => 'latitud',
                'compare' => 'EXISTS'
            ),
            array(
                'key' => 'longitud',
                'compare' => 'EXISTS'
            )
        )
    ));
    
    $tiendas_cercanas = array();
    
    if ($tiendas_query->have_posts()) {
        while ($tiendas_query->have_posts()) {
            $tiendas_query->the_post();
            $tienda_id = get_the_ID();
            $tienda_lat = floatval(get_field('latitud', $tienda_id));
            $tienda_lng = floatval(get_field('longitud', $tienda_id));
            
            // Calcular distancia usando fórmula de Haversine
            $distancia = ahorraya_calculate_distance($lat, $lng, $tienda_lat, $tienda_lng);
            
            if ($distancia <= $radio) {
                $tiendas_cercanas[] = $tienda_id;
            }
        }
        wp_reset_postdata();
    }
    
    if (empty($tiendas_cercanas)) {
        return rest_ensure_response(array(
            'success' => true,
            'data' => array(),
            'message' => 'No se encontraron tiendas cercanas'
        ));
    }
    
    // Buscar productos de las tiendas cercanas
    $productos_query = new WP_Query(array(
        'post_type' => 'productos',
        'post_status' => 'publish',
        'posts_per_page' => 50,
        'meta_query' => array(
            array(
                'key' => 'tienda_asociada',
                'value' => $tiendas_cercanas,
                'compare' => 'IN'
            )
        )
    ));
    
    $productos = array();
    if ($productos_query->have_posts()) {
        while ($productos_query->have_posts()) {
            $productos_query->the_post();
            $product_id = get_the_ID();
            
            $productos[] = array(
                'id' => $product_id,
                'title' => get_the_title(),
                'precio_bs' => ahorraya_get_product_price_bs($product_id),
                'precio_usd' => ahorraya_get_product_price_usd($product_id),
                'tienda' => get_field('tienda_asociada', $product_id),
                'featured_image' => get_the_post_thumbnail_url($product_id, 'medium'),
            );
        }
        wp_reset_postdata();
    }
    
    return rest_ensure_response(array(
        'success' => true,
        'data' => $productos
    ));
}

// Función para obtener listas de compras del usuario
function ahorraya_get_user_shopping_lists($request) {
    $user_id = get_current_user_id();
    
    $args = array(
        'post_type' => 'listas_compras',
        'post_status' => 'publish',
        'author' => $user_id,
        'posts_per_page' => -1,
    );
    
    $query = new WP_Query($args);
    $listas = array();
    
    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $lista_id = get_the_ID();
            
            $listas[] = array(
                'id' => $lista_id,
                'title' => get_the_title(),
                'productos' => get_field('productos_lista', $lista_id),
                'total_bs' => floatval(get_field('total_estimado_bs', $lista_id)),
                'total_usd' => floatval(get_field('total_estimado_usd', $lista_id)),
                'fecha_creacion' => get_field('fecha_creacion', $lista_id),
                'es_publica' => get_field('es_publica', $lista_id),
            );
        }
        wp_reset_postdata();
    }
    
    return rest_ensure_response(array(
        'success' => true,
        'data' => $listas
    ));
}

/**
 * 5. FUNCIONES AUXILIARES
 */

// Función para calcular distancia entre dos puntos (Haversine)
function ahorraya_calculate_distance($lat1, $lng1, $lat2, $lng2) {
    $earth_radius = 6371; // Radio de la Tierra en km
    
    $lat_delta = deg2rad($lat2 - $lat1);
    $lng_delta = deg2rad($lng2 - $lng1);
    
    $a = sin($lat_delta / 2) * sin($lat_delta / 2) +
         cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
         sin($lng_delta / 2) * sin($lng_delta / 2);
    
    $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
    
    return $earth_radius * $c;
}

/**
 * 6. CRON JOB PARA ACTUALIZAR TASA DE CAMBIO
 */

// Programar cron job
function ahorraya_schedule_exchange_rate_update() {
    if (!wp_next_scheduled('ahorraya_update_exchange_rate')) {
        wp_schedule_event(time(), 'hourly', 'ahorraya_update_exchange_rate');
    }
}
add_action('wp', 'ahorraya_schedule_exchange_rate_update');

// Función del cron job
function ahorraya_update_exchange_rate_cron() {
    // Forzar actualización eliminando el caché
    delete_transient('ahorraya_bcv_rate');
    
    // Llamar a la función para obtener nueva tasa
    $request = new WP_REST_Request('GET', '/ahorraya/v1/tasa-bcv');
    ahorraya_get_exchange_rate($request);
}
add_action('ahorraya_update_exchange_rate', 'ahorraya_update_exchange_rate_cron');

/**
 * 7. CONFIGURACIÓN DE CORS
 */
function ahorraya_add_cors_headers() {
    // Solo en desarrollo o dominios específicos
    $allowed_origins = array(
        'http://localhost:3000',
        'http://localhost:5173', // Vite dev server
        'https://ahorrayavz.com' // Dominio de producción
    );
    
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
    
    if (in_array($origin, $allowed_origins)) {
        header("Access-Control-Allow-Origin: $origin");
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization, X-WP-Nonce");
        header("Access-Control-Allow-Credentials: true");
    }
    
    // Manejar preflight requests
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        status_header(200);
        exit();
    }
}
add_action('init', 'ahorraya_add_cors_headers');

/**
 * 8. FILTROS PARA MEJORAR LA API REST
 */

// Agregar campos ACF a la respuesta REST
function ahorraya_add_acf_to_rest_api() {
    // Para productos
    register_rest_field('productos', 'acf_fields', array(
        'get_callback' => function($post) {
            return get_fields($post['id']);
        },
        'schema' => null,
    ));
    
    // Para tiendas
    register_rest_field('tiendas', 'acf_fields', array(
        'get_callback' => function($post) {
            return get_fields($post['id']);
        },
        'schema' => null,
    ));
}
add_action('rest_api_init', 'ahorraya_add_acf_to_rest_api');

// Filtro para restringir acceso a listas de compras
function ahorraya_restrict_shopping_lists_access($args, $request) {
    if ($request->get_route() === '/wp/v2/listas-compras') {
        // Solo mostrar listas del usuario actual
        if (is_user_logged_in()) {
            $args['author'] = get_current_user_id();
        } else {
            // Si no está logueado, no mostrar nada
            $args['post__in'] = array(0);
        }
    }
    
    return $args;
}
add_filter('rest_post_query', 'ahorraya_restrict_shopping_lists_access', 10, 2);

/**
 * 9. ACTIVACIÓN Y DESACTIVACIÓN
 */

// Función de activación
function ahorraya_activation() {
    // Registrar CPTs y taxonomías
    ahorraya_register_productos_cpt();
    ahorraya_register_tiendas_cpt();
    ahorraya_register_listas_compras_cpt();
    ahorraya_register_categoria_producto_taxonomy();
    
    // Flush rewrite rules
    flush_rewrite_rules();
    
    // Crear páginas necesarias si no existen
    ahorraya_create_default_pages();
}
register_activation_hook(__FILE__, 'ahorraya_activation');

// Función para crear páginas por defecto
function ahorraya_create_default_pages() {
    $pages = array(
        'productos' => 'Productos',
        'tiendas' => 'Tiendas',
        'buscar' => 'Buscar',
    );
    
    foreach ($pages as $slug => $title) {
        if (!get_page_by_path($slug)) {
            wp_insert_post(array(
                'post_title' => $title,
                'post_name' => $slug,
                'post_status' => 'publish',
                'post_type' => 'page',
                'post_content' => "<!-- wp:paragraph --><p>Esta página será manejada por React.</p><!-- /wp:paragraph -->"
            ));
        }
    }
}

// Función de desactivación
function ahorraya_deactivation() {
    // Limpiar cron jobs
    wp_clear_scheduled_hook('ahorraya_update_exchange_rate');
    
    // Flush rewrite rules
    flush_rewrite_rules();
}
register_deactivation_hook(__FILE__, 'ahorraya_deactivation');

?>