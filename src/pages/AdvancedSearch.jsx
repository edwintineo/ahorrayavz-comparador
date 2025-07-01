import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  Breadcrumbs,
  Link,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Chip,
  Autocomplete,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Alert,
  IconButton,
  Tooltip,
  Switch,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Badge
} from '@mui/material';
import {
  Home,
  Search,
  ExpandMore,
  Clear,
  FilterList,
  Save,
  History,
  TrendingUp,
  LocationOn,
  Store,
  Category,
  AttachMoney,
  Star,
  LocalOffer,
  Inventory,
  Schedule,
  Compare,
  Favorite,
  Share,
  GetApp,
  Refresh,
  Settings,
  Help
} from '@mui/icons-material';
import { useStore } from '../store/useStore';
import { useProducts } from '../hooks/useProducts';
import { useNotification } from '../contexts/NotificationContext';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

const AdvancedSearch = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { exchangeRate } = useStore();
  const { searchProducts, loading } = useProducts();
  const { showNotification } = useNotification();
  
  const [searchCriteria, setSearchCriteria] = useState({
    query: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    location: searchParams.get('location') || '',
    store: searchParams.get('store') || '',
    condition: searchParams.get('condition') || 'all',
    availability: searchParams.get('availability') || 'all',
    rating: searchParams.get('rating') || 0,
    sortBy: searchParams.get('sortBy') || 'relevance',
    currency: searchParams.get('currency') || 'bs',
    radius: searchParams.get('radius') || 10,
    hasPromotion: searchParams.get('hasPromotion') === 'true',
    freeShipping: searchParams.get('freeShipping') === 'true',
    inStock: searchParams.get('inStock') === 'true'
  });
  
  const [results, setResults] = useState([]);
  const [savedSearches, setSavedSearches] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showFilters, setShowFilters] = useState(true);
  const [activeFilters, setActiveFilters] = useState([]);

  // Mock data
  const categories = [
    'Electrónicos',
    'Ropa y Accesorios',
    'Hogar y Jardín',
    'Deportes',
    'Libros',
    'Salud y Belleza',
    'Automóviles',
    'Comida y Bebidas',
    'Juguetes',
    'Música'
  ];

  const brands = [
    'Samsung',
    'Apple',
    'Sony',
    'LG',
    'Nike',
    'Adidas',
    'HP',
    'Dell',
    'Canon',
    'Nikon'
  ];

  const stores = [
    'TecnoStore',
    'SuperMercado Central',
    'ElectroMax',
    'GameZone',
    'FashionHub',
    'HomeCenter',
    'SportWorld',
    'BookLand'
  ];

  const locations = [
    'Caracas',
    'Maracaibo',
    'Valencia',
    'Barquisimeto',
    'Maracay',
    'Ciudad Guayana',
    'San Cristóbal',
    'Maturín'
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Relevancia' },
    { value: 'price_asc', label: 'Precio: Menor a Mayor' },
    { value: 'price_desc', label: 'Precio: Mayor a Menor' },
    { value: 'rating', label: 'Mejor Calificación' },
    { value: 'newest', label: 'Más Recientes' },
    { value: 'popularity', label: 'Más Populares' },
    { value: 'distance', label: 'Distancia' }
  ];

  useEffect(() => {
    // Load saved searches and history from localStorage
    const saved = JSON.parse(localStorage.getItem('savedSearches') || '[]');
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    setSavedSearches(saved);
    setSearchHistory(history);
  }, []);

  useEffect(() => {
    updateActiveFilters();
  }, [searchCriteria]);

  const updateActiveFilters = () => {
    const filters = [];
    
    if (searchCriteria.category) filters.push({ key: 'category', label: `Categoría: ${searchCriteria.category}` });
    if (searchCriteria.brand) filters.push({ key: 'brand', label: `Marca: ${searchCriteria.brand}` });
    if (searchCriteria.minPrice) filters.push({ key: 'minPrice', label: `Precio mín: ${searchCriteria.minPrice}` });
    if (searchCriteria.maxPrice) filters.push({ key: 'maxPrice', label: `Precio máx: ${searchCriteria.maxPrice}` });
    if (searchCriteria.location) filters.push({ key: 'location', label: `Ubicación: ${searchCriteria.location}` });
    if (searchCriteria.store) filters.push({ key: 'store', label: `Tienda: ${searchCriteria.store}` });
    if (searchCriteria.condition !== 'all') filters.push({ key: 'condition', label: `Condición: ${searchCriteria.condition}` });
    if (searchCriteria.availability !== 'all') filters.push({ key: 'availability', label: `Disponibilidad: ${searchCriteria.availability}` });
    if (searchCriteria.rating > 0) filters.push({ key: 'rating', label: `Calificación: ${searchCriteria.rating}+ estrellas` });
    if (searchCriteria.hasPromotion) filters.push({ key: 'hasPromotion', label: 'Con promoción' });
    if (searchCriteria.freeShipping) filters.push({ key: 'freeShipping', label: 'Envío gratis' });
    if (searchCriteria.inStock) filters.push({ key: 'inStock', label: 'En stock' });
    
    setActiveFilters(filters);
  };

  const handleSearch = async () => {
    // Update URL params
    const params = new URLSearchParams();
    Object.entries(searchCriteria).forEach(([key, value]) => {
      if (value && value !== '' && value !== 'all' && value !== 0 && value !== false) {
        params.set(key, value.toString());
      }
    });
    setSearchParams(params);

    // Add to search history
    const searchEntry = {
      id: Date.now(),
      query: searchCriteria.query,
      criteria: { ...searchCriteria },
      timestamp: new Date(),
      resultsCount: 0
    };
    
    const newHistory = [searchEntry, ...searchHistory.slice(0, 9)];
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));

    // Perform search
    try {
      const searchResults = await searchProducts(searchCriteria);
      setResults(searchResults);
      
      // Update results count in history
      searchEntry.resultsCount = searchResults.length;
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
      
      showNotification(`Se encontraron ${searchResults.length} productos`, 'success');
    } catch (error) {
      showNotification('Error al realizar la búsqueda', 'error');
    }
  };

  const handleClearFilters = () => {
    setSearchCriteria({
      query: '',
      category: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      location: '',
      store: '',
      condition: 'all',
      availability: 'all',
      rating: 0,
      sortBy: 'relevance',
      currency: 'bs',
      radius: 10,
      hasPromotion: false,
      freeShipping: false,
      inStock: false
    });
    setSearchParams(new URLSearchParams());
  };

  const handleSaveSearch = () => {
    const searchName = prompt('Nombre para esta búsqueda:');
    if (searchName) {
      const savedSearch = {
        id: Date.now(),
        name: searchName,
        criteria: { ...searchCriteria },
        createdAt: new Date()
      };
      
      const newSaved = [savedSearch, ...savedSearches.slice(0, 9)];
      setSavedSearches(newSaved);
      localStorage.setItem('savedSearches', JSON.stringify(newSaved));
      showNotification('Búsqueda guardada exitosamente', 'success');
    }
  };

  const handleLoadSavedSearch = (savedSearch) => {
    setSearchCriteria(savedSearch.criteria);
    showNotification('Búsqueda cargada', 'success');
  };

  const handleRemoveFilter = (filterKey) => {
    setSearchCriteria(prev => ({
      ...prev,
      [filterKey]: filterKey === 'condition' || filterKey === 'availability' ? 'all' : 
                   filterKey === 'rating' ? 0 :
                   filterKey === 'hasPromotion' || filterKey === 'freeShipping' || filterKey === 'inStock' ? false :
                   ''
    }));
  };

  const formatPrice = (price) => {
    if (searchCriteria.currency === 'usd') {
      return `$${(price / exchangeRate).toFixed(2)}`;
    }
    return `Bs. ${price.toLocaleString()}`;
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
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
        <Typography color="text.primary">Búsqueda Avanzada</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Search sx={{ fontSize: 32, color: 'primary.main' }} />
            <Box>
              <Typography variant="h4">
                Búsqueda Avanzada
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Encuentra exactamente lo que buscas con filtros detallados
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Alternar filtros">
              <IconButton onClick={() => setShowFilters(!showFilters)}>
                <FilterList />
              </IconButton>
            </Tooltip>
            <Tooltip title="Guardar búsqueda">
              <IconButton onClick={handleSaveSearch}>
                <Save />
              </IconButton>
            </Tooltip>
            <Tooltip title="Limpiar filtros">
              <IconButton onClick={handleClearFilters}>
                <Clear />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Main Search Bar */}
        <TextField
          fullWidth
          placeholder="¿Qué estás buscando?"
          value={searchCriteria.query}
          onChange={(e) => setSearchCriteria(prev => ({ ...prev, query: e.target.value }))}
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
                  disabled={loading}
                >
                  Buscar
                </Button>
              </InputAdornment>
            )
          }}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
      </Paper>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography variant="body2" color="text.secondary">
              Filtros activos:
            </Typography>
            {activeFilters.map((filter) => (
              <Chip
                key={filter.key}
                label={filter.label}
                onDelete={() => handleRemoveFilter(filter.key)}
                color="primary"
                variant="outlined"
                size="small"
              />
            ))}
            <Button 
              size="small" 
              startIcon={<Clear />} 
              onClick={handleClearFilters}
            >
              Limpiar todo
            </Button>
          </Box>
        </Paper>
      )}

      <Grid container spacing={3}>
        {/* Filters Sidebar */}
        {showFilters && (
          <Grid item xs={12} md={3}>
            <Card sx={{ position: 'sticky', top: 20 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Filtros de Búsqueda
                </Typography>

                {/* Category Filter */}
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Category sx={{ mr: 1 }} />
                    <Typography>Categoría</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <FormControl fullWidth size="small">
                      <InputLabel>Seleccionar categoría</InputLabel>
                      <Select
                        value={searchCriteria.category}
                        onChange={(e) => setSearchCriteria(prev => ({ ...prev, category: e.target.value }))}
                        label="Seleccionar categoría"
                      >
                        <MenuItem value="">Todas las categorías</MenuItem>
                        {categories.map((category) => (
                          <MenuItem key={category} value={category}>
                            {category}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </AccordionDetails>
                </Accordion>

                {/* Brand Filter */}
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Star sx={{ mr: 1 }} />
                    <Typography>Marca</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Autocomplete
                      size="small"
                      options={brands}
                      value={searchCriteria.brand}
                      onChange={(e, newValue) => setSearchCriteria(prev => ({ ...prev, brand: newValue || '' }))}
                      renderInput={(params) => (
                        <TextField {...params} label="Seleccionar marca" />
                      )}
                    />
                  </AccordionDetails>
                </Accordion>

                {/* Price Range Filter */}
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <AttachMoney sx={{ mr: 1 }} />
                    <Typography>Rango de Precio</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ mb: 2 }}>
                      <FormControl size="small" sx={{ mb: 2 }}>
                        <InputLabel>Moneda</InputLabel>
                        <Select
                          value={searchCriteria.currency}
                          onChange={(e) => setSearchCriteria(prev => ({ ...prev, currency: e.target.value }))}
                          label="Moneda"
                        >
                          <MenuItem value="bs">Bolívares (Bs.)</MenuItem>
                          <MenuItem value="usd">Dólares (USD)</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <TextField
                          size="small"
                          label="Precio mínimo"
                          type="number"
                          value={searchCriteria.minPrice}
                          onChange={(e) => setSearchCriteria(prev => ({ ...prev, minPrice: e.target.value }))}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                {searchCriteria.currency === 'usd' ? '$' : 'Bs.'}
                              </InputAdornment>
                            )
                          }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          size="small"
                          label="Precio máximo"
                          type="number"
                          value={searchCriteria.maxPrice}
                          onChange={(e) => setSearchCriteria(prev => ({ ...prev, maxPrice: e.target.value }))}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                {searchCriteria.currency === 'usd' ? '$' : 'Bs.'}
                              </InputAdornment>
                            )
                          }}
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>

                {/* Location Filter */}
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <LocationOn sx={{ mr: 1 }} />
                    <Typography>Ubicación</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                      <InputLabel>Ciudad</InputLabel>
                      <Select
                        value={searchCriteria.location}
                        onChange={(e) => setSearchCriteria(prev => ({ ...prev, location: e.target.value }))}
                        label="Ciudad"
                      >
                        <MenuItem value="">Todas las ciudades</MenuItem>
                        {locations.map((location) => (
                          <MenuItem key={location} value={location}>
                            {location}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Typography gutterBottom>Radio de búsqueda: {searchCriteria.radius} km</Typography>
                    <Slider
                      value={searchCriteria.radius}
                      onChange={(e, newValue) => setSearchCriteria(prev => ({ ...prev, radius: newValue }))}
                      min={1}
                      max={50}
                      marks={[
                        { value: 1, label: '1km' },
                        { value: 25, label: '25km' },
                        { value: 50, label: '50km' }
                      ]}
                    />
                  </AccordionDetails>
                </Accordion>

                {/* Store Filter */}
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Store sx={{ mr: 1 }} />
                    <Typography>Tienda</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <FormControl fullWidth size="small">
                      <InputLabel>Seleccionar tienda</InputLabel>
                      <Select
                        value={searchCriteria.store}
                        onChange={(e) => setSearchCriteria(prev => ({ ...prev, store: e.target.value }))}
                        label="Seleccionar tienda"
                      >
                        <MenuItem value="">Todas las tiendas</MenuItem>
                        {stores.map((store) => (
                          <MenuItem key={store} value={store}>
                            {store}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </AccordionDetails>
                </Accordion>

                {/* Condition Filter */}
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Inventory sx={{ mr: 1 }} />
                    <Typography>Condición</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <RadioGroup
                      value={searchCriteria.condition}
                      onChange={(e) => setSearchCriteria(prev => ({ ...prev, condition: e.target.value }))}
                    >
                      <FormControlLabel value="all" control={<Radio />} label="Todas" />
                      <FormControlLabel value="new" control={<Radio />} label="Nuevo" />
                      <FormControlLabel value="used" control={<Radio />} label="Usado" />
                      <FormControlLabel value="refurbished" control={<Radio />} label="Reacondicionado" />
                    </RadioGroup>
                  </AccordionDetails>
                </Accordion>

                {/* Rating Filter */}
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Star sx={{ mr: 1 }} />
                    <Typography>Calificación</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography gutterBottom>Mínimo: {searchCriteria.rating} estrellas</Typography>
                    <Slider
                      value={searchCriteria.rating}
                      onChange={(e, newValue) => setSearchCriteria(prev => ({ ...prev, rating: newValue }))}
                      min={0}
                      max={5}
                      step={0.5}
                      marks={[
                        { value: 0, label: '0' },
                        { value: 2.5, label: '2.5' },
                        { value: 5, label: '5' }
                      ]}
                    />
                  </AccordionDetails>
                </Accordion>

                {/* Additional Options */}
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Settings sx={{ mr: 1 }} />
                    <Typography>Opciones Adicionales</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={searchCriteria.hasPromotion}
                          onChange={(e) => setSearchCriteria(prev => ({ ...prev, hasPromotion: e.target.checked }))}
                        />
                      }
                      label="Solo con promociones"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={searchCriteria.freeShipping}
                          onChange={(e) => setSearchCriteria(prev => ({ ...prev, freeShipping: e.target.checked }))}
                        />
                      }
                      label="Envío gratis"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={searchCriteria.inStock}
                          onChange={(e) => setSearchCriteria(prev => ({ ...prev, inStock: e.target.checked }))}
                        />
                      }
                      label="Solo en stock"
                    />
                  </AccordionDetails>
                </Accordion>

                <Divider sx={{ my: 2 }} />

                {/* Search History */}
                {searchHistory.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      <History sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Búsquedas Recientes
                    </Typography>
                    <List dense>
                      {searchHistory.slice(0, 3).map((search) => (
                        <ListItem 
                          key={search.id} 
                          button 
                          onClick={() => setSearchCriteria(search.criteria)}
                          sx={{ px: 0 }}
                        >
                          <ListItemIcon>
                            <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                              {search.resultsCount}
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText
                            primary={search.query || 'Búsqueda sin texto'}
                            secondary={new Date(search.timestamp).toLocaleDateString()}
                            primaryTypographyProps={{ variant: 'body2' }}
                            secondaryTypographyProps={{ variant: 'caption' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {/* Saved Searches */}
                {savedSearches.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      <Save sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Búsquedas Guardadas
                    </Typography>
                    <List dense>
                      {savedSearches.slice(0, 3).map((search) => (
                        <ListItem 
                          key={search.id} 
                          button 
                          onClick={() => handleLoadSavedSearch(search)}
                          sx={{ px: 0 }}
                        >
                          <ListItemIcon>
                            <Star sx={{ fontSize: 20 }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={search.name}
                            secondary={new Date(search.createdAt).toLocaleDateString()}
                            primaryTypographyProps={{ variant: 'body2' }}
                            secondaryTypographyProps={{ variant: 'caption' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Results Area */}
        <Grid item xs={12} md={showFilters ? 9 : 12}>
          {/* Sort and View Options */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Typography variant="h6">
                {results.length > 0 ? `${results.length} productos encontrados` : 'Resultados de búsqueda'}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Ordenar por</InputLabel>
                  <Select
                    value={searchCriteria.sortBy}
                    onChange={(e) => setSearchCriteria(prev => ({ ...prev, sortBy: e.target.value }))}
                    label="Ordenar por"
                  >
                    {sortOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <Button 
                  variant="outlined" 
                  startIcon={<Refresh />} 
                  onClick={handleSearch}
                  disabled={loading}
                >
                  Actualizar
                </Button>
              </Box>
            </Box>
          </Paper>

          {/* Results */}
          {loading ? (
            <LoadingSpinner />
          ) : results.length > 0 ? (
            <Grid container spacing={2}>
              {results.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Search sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No se encontraron productos
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Intenta ajustar tus filtros de búsqueda o usar términos más generales.
              </Typography>
              <Button 
                variant="outlined" 
                startIcon={<Clear />} 
                onClick={handleClearFilters}
              >
                Limpiar filtros
              </Button>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdvancedSearch;