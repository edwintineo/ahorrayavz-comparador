import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Paper,
  Breadcrumbs,
  Link,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  TextField,
  InputAdornment,
  Skeleton,
  Badge,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Home,
  Category,
  Search,
  FilterList,
  Sort,
  ViewModule,
  ViewList,
  TrendingUp,
  LocalOffer,
  Star,
  Store,
  ShoppingCart,
  Favorite,
  Compare,
  ExpandMore,
  Phone,
  Computer,
  Checkroom,
  SportsEsports,
  MenuBook,
  FitnessCenter,
  DirectionsCar,
  Restaurant,
  Toys,
  MusicNote,
  Home as HomeIcon,
  HealthAndSafety,
  School,
  Pets,
  Build,
  LocalFlorist
} from '@mui/icons-material';
import { useStore } from '../store/useStore';
import { useProducts } from '../hooks/useProducts';
import { useNotification } from '../contexts/NotificationContext';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Categories = () => {
  const navigate = useNavigate();
  const { categorySlug } = useParams();
  const { exchangeRate } = useStore();
  const { searchProducts, loading } = useProducts();
  const { showNotification } = useNotification();
  
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('popularity');
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Categories data with icons and colors
  const categories = [
    {
      id: 1,
      name: 'Electrónicos',
      slug: 'electronicos',
      icon: <Phone />,
      color: '#2196F3',
      description: 'Smartphones, laptops, tablets y más',
      productCount: 1250,
      image: '/api/placeholder/300/200',
      subcategories: [
        { id: 11, name: 'Smartphones', count: 450 },
        { id: 12, name: 'Laptops', count: 320 },
        { id: 13, name: 'Tablets', count: 180 },
        { id: 14, name: 'Accesorios', count: 300 }
      ]
    },
    {
      id: 2,
      name: 'Ropa y Accesorios',
      slug: 'ropa-accesorios',
      icon: <Checkroom />,
      color: '#E91E63',
      description: 'Moda para hombres, mujeres y niños',
      productCount: 2100,
      image: '/api/placeholder/300/200',
      subcategories: [
        { id: 21, name: 'Ropa Masculina', count: 650 },
        { id: 22, name: 'Ropa Femenina', count: 850 },
        { id: 23, name: 'Ropa Infantil', count: 400 },
        { id: 24, name: 'Accesorios', count: 200 }
      ]
    },
    {
      id: 3,
      name: 'Hogar y Jardín',
      slug: 'hogar-jardin',
      icon: <HomeIcon />,
      color: '#4CAF50',
      description: 'Muebles, decoración y jardinería',
      productCount: 890,
      image: '/api/placeholder/300/200',
      subcategories: [
        { id: 31, name: 'Muebles', count: 320 },
        { id: 32, name: 'Decoración', count: 280 },
        { id: 33, name: 'Jardín', count: 190 },
        { id: 34, name: 'Cocina', count: 100 }
      ]
    },
    {
      id: 4,
      name: 'Deportes',
      slug: 'deportes',
      icon: <FitnessCenter />,
      color: '#FF9800',
      description: 'Equipos deportivos y fitness',
      productCount: 560,
      image: '/api/placeholder/300/200',
      subcategories: [
        { id: 41, name: 'Fitness', count: 180 },
        { id: 42, name: 'Fútbol', count: 150 },
        { id: 43, name: 'Basketball', count: 120 },
        { id: 44, name: 'Natación', count: 110 }
      ]
    },
    {
      id: 5,
      name: 'Libros',
      slug: 'libros',
      icon: <MenuBook />,
      color: '#795548',
      description: 'Literatura, educación y más',
      productCount: 780,
      image: '/api/placeholder/300/200',
      subcategories: [
        { id: 51, name: 'Ficción', count: 250 },
        { id: 52, name: 'Educación', count: 200 },
        { id: 53, name: 'Biografías', count: 180 },
        { id: 54, name: 'Infantiles', count: 150 }
      ]
    },
    {
      id: 6,
      name: 'Salud y Belleza',
      slug: 'salud-belleza',
      icon: <HealthAndSafety />,
      color: '#9C27B0',
      description: 'Cuidado personal y bienestar',
      productCount: 920,
      image: '/api/placeholder/300/200',
      subcategories: [
        { id: 61, name: 'Cuidado Facial', count: 280 },
        { id: 62, name: 'Maquillaje', count: 250 },
        { id: 63, name: 'Cuidado Capilar', count: 220 },
        { id: 64, name: 'Suplementos', count: 170 }
      ]
    },
    {
      id: 7,
      name: 'Automóviles',
      slug: 'automoviles',
      icon: <DirectionsCar />,
      color: '#607D8B',
      description: 'Repuestos y accesorios para vehículos',
      productCount: 650,
      image: '/api/placeholder/300/200',
      subcategories: [
        { id: 71, name: 'Repuestos', count: 300 },
        { id: 72, name: 'Accesorios', count: 200 },
        { id: 73, name: 'Herramientas', count: 100 },
        { id: 74, name: 'Audio', count: 50 }
      ]
    },
    {
      id: 8,
      name: 'Comida y Bebidas',
      slug: 'comida-bebidas',
      icon: <Restaurant />,
      color: '#FF5722',
      description: 'Alimentos, bebidas y gourmet',
      productCount: 1100,
      image: '/api/placeholder/300/200',
      subcategories: [
        { id: 81, name: 'Despensa', count: 400 },
        { id: 82, name: 'Bebidas', count: 300 },
        { id: 83, name: 'Gourmet', count: 250 },
        { id: 84, name: 'Orgánicos', count: 150 }
      ]
    },
    {
      id: 9,
      name: 'Juguetes',
      slug: 'juguetes',
      icon: <Toys />,
      color: '#FFEB3B',
      description: 'Diversión para todas las edades',
      productCount: 480,
      image: '/api/placeholder/300/200',
      subcategories: [
        { id: 91, name: 'Educativos', count: 150 },
        { id: 92, name: 'Electrónicos', count: 130 },
        { id: 93, name: 'Muñecas', count: 100 },
        { id: 94, name: 'Construcción', count: 100 }
      ]
    },
    {
      id: 10,
      name: 'Música',
      slug: 'musica',
      icon: <MusicNote />,
      color: '#3F51B5',
      description: 'Instrumentos y equipos de audio',
      productCount: 320,
      image: '/api/placeholder/300/200',
      subcategories: [
        { id: 101, name: 'Instrumentos', count: 150 },
        { id: 102, name: 'Audio', count: 100 },
        { id: 103, name: 'Accesorios', count: 70 }
      ]
    }
  ];

  const sortOptions = [
    { value: 'popularity', label: 'Más Populares' },
    { value: 'price_asc', label: 'Precio: Menor a Mayor' },
    { value: 'price_desc', label: 'Precio: Mayor a Menor' },
    { value: 'rating', label: 'Mejor Calificación' },
    { value: 'newest', label: 'Más Recientes' },
    { value: 'name', label: 'Nombre A-Z' }
  ];

  useEffect(() => {
    if (categorySlug) {
      const category = categories.find(cat => cat.slug === categorySlug);
      if (category) {
        setSelectedCategory(category);
        setSubcategories(category.subcategories);
        loadCategoryProducts(category.id);
      }
    }
  }, [categorySlug]);

  const loadCategoryProducts = async (categoryId) => {
    try {
      // Mock products for the category
      const mockProducts = Array.from({ length: 12 }, (_, index) => ({
        id: `${categoryId}-${index + 1}`,
        name: `Producto ${index + 1} de Categoría`,
        price: Math.floor(Math.random() * 500000) + 50000,
        originalPrice: Math.floor(Math.random() * 600000) + 60000,
        image: '/api/placeholder/300/300',
        rating: (Math.random() * 2 + 3).toFixed(1),
        reviews: Math.floor(Math.random() * 500) + 10,
        store: `Tienda ${Math.floor(Math.random() * 5) + 1}`,
        hasPromotion: Math.random() > 0.7,
        freeShipping: Math.random() > 0.5,
        inStock: Math.random() > 0.2
      }));
      
      setProducts(mockProducts);
    } catch (error) {
      showNotification('Error al cargar productos', 'error');
    }
  };

  const handleCategoryClick = (category) => {
    navigate(`/categories/${category.slug}`);
  };

  const handleSubcategoryClick = (subcategory) => {
    navigate(`/categories/${selectedCategory.slug}/${subcategory.id}`);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}&category=${selectedCategory?.slug || ''}`);
    }
  };

  const CategoryCard = ({ category }) => (
    <Card 
      sx={{ 
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6
        }
      }}
      onClick={() => handleCategoryClick(category)}
    >
      <CardMedia
        component="div"
        sx={{
          height: 120,
          background: `linear-gradient(135deg, ${category.color}20, ${category.color}40)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Avatar 
          sx={{ 
            bgcolor: category.color, 
            width: 56, 
            height: 56,
            fontSize: 28
          }}
        >
          {category.icon}
        </Avatar>
      </CardMedia>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" component="h3">
            {category.name}
          </Typography>
          <Badge 
            badgeContent={category.productCount} 
            color="primary" 
            max={9999}
            sx={{ '& .MuiBadge-badge': { fontSize: '0.7rem' } }}
          />
        </Box>
        <Typography variant="body2" color="text.secondary" paragraph>
          {category.description}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Chip 
            label={`${category.productCount} productos`} 
            size="small" 
            variant="outlined"
          />
          <Button size="small" endIcon={<TrendingUp />}>
            Explorar
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading && !selectedCategory) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {[...Array(8)].map((_, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <Skeleton variant="rectangular" height={120} />
                <CardContent>
                  <Skeleton variant="text" height={32} />
                  <Skeleton variant="text" height={20} />
                  <Skeleton variant="text" height={20} width="60%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          component="button"
          variant="body1"
          onClick={() => navigate('/')}
          sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
        >
          <Home sx={{ mr: 0.5 }} fontSize="inherit" />
          Inicio
        </Link>
        <Link
          component="button"
          variant="body1"
          onClick={() => navigate('/categories')}
          sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
        >
          <Category sx={{ mr: 0.5 }} fontSize="inherit" />
          Categorías
        </Link>
        {selectedCategory && (
          <Typography color="text.primary">{selectedCategory.name}</Typography>
        )}
      </Breadcrumbs>

      {!selectedCategory ? (
        // Categories Overview
        <>
          {/* Header */}
          <Paper elevation={2} sx={{ p: 4, mb: 4, textAlign: 'center' }}>
            <Category sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h3" gutterBottom>
              Explorar Categorías
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Descubre productos organizados por categorías
            </Typography>
          </Paper>

          {/* Categories Grid */}
          <Grid container spacing={3}>
            {categories.map((category) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={category.id}>
                <CategoryCard category={category} />
              </Grid>
            ))}
          </Grid>

          {/* Popular Categories */}
          <Paper elevation={2} sx={{ p: 4, mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Categorías Populares
            </Typography>
            <Grid container spacing={2}>
              {categories.slice(0, 4).map((category) => (
                <Grid item xs={12} sm={6} md={3} key={category.id}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={category.icon}
                    onClick={() => handleCategoryClick(category)}
                    sx={{ 
                      py: 2,
                      borderColor: category.color,
                      color: category.color,
                      '&:hover': {
                        borderColor: category.color,
                        bgcolor: `${category.color}10`
                      }
                    }}
                  >
                    {category.name}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </>
      ) : (
        // Category Detail View
        <>
          {/* Category Header */}
          <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
              <Avatar 
                sx={{ 
                  bgcolor: selectedCategory.color, 
                  width: 64, 
                  height: 64,
                  fontSize: 32
                }}
              >
                {selectedCategory.icon}
              </Avatar>
              <Box>
                <Typography variant="h4" gutterBottom>
                  {selectedCategory.name}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {selectedCategory.description}
                </Typography>
                <Chip 
                  label={`${selectedCategory.productCount} productos disponibles`}
                  color="primary"
                  sx={{ mt: 1 }}
                />
              </Box>
            </Box>

            {/* Search Bar */}
            <TextField
              fullWidth
              placeholder={`Buscar en ${selectedCategory.name}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Button 
                      variant="contained" 
                      onClick={handleSearch}
                    >
                      Buscar
                    </Button>
                  </InputAdornment>
                )
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </Paper>

          <Grid container spacing={3}>
            {/* Sidebar */}
            <Grid item xs={12} md={3}>
              {/* Subcategories */}
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Subcategorías
                </Typography>
                <List>
                  {subcategories.map((subcategory) => (
                    <ListItem 
                      key={subcategory.id}
                      button 
                      onClick={() => handleSubcategoryClick(subcategory)}
                      sx={{ borderRadius: 1 }}
                    >
                      <ListItemText 
                        primary={subcategory.name}
                        secondary={`${subcategory.count} productos`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>

              {/* Filters */}
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Filtros
                </Typography>
                
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography>Rango de Precio</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <TextField
                          size="small"
                          label="Mínimo"
                          type="number"
                          value={priceRange.min}
                          onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          size="small"
                          label="Máximo"
                          type="number"
                          value={priceRange.max}
                          onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Paper>
            </Grid>

            {/* Products */}
            <Grid item xs={12} md={9}>
              {/* Toolbar */}
              <Paper sx={{ p: 2, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                  <Typography variant="h6">
                    {products.length} productos encontrados
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                      <InputLabel>Ordenar por</InputLabel>
                      <Select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        label="Ordenar por"
                      >
                        {sortOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    
                    <IconButton 
                      onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                    >
                      {viewMode === 'grid' ? <ViewList /> : <ViewModule />}
                    </IconButton>
                  </Box>
                </Box>
              </Paper>

              {/* Products Grid */}
              {loading ? (
                <LoadingSpinner />
              ) : products.length > 0 ? (
                <Grid container spacing={2}>
                  {products.map((product) => (
                    <Grid 
                      item 
                      xs={12} 
                      sm={viewMode === 'grid' ? 6 : 12} 
                      md={viewMode === 'grid' ? 4 : 12} 
                      key={product.id}
                    >
                      <ProductCard product={product} viewMode={viewMode} />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                  <Search sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No se encontraron productos
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Intenta ajustar tus filtros de búsqueda
                  </Typography>
                </Paper>
              )}
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
};

export default Categories;