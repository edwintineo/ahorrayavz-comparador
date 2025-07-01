import React, { useEffect, useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Button,
  Chip,
  Pagination,
  CircularProgress
} from '@mui/material'
import { useSearchParams } from 'react-router-dom'
import SearchBar from '../components/search/SearchBar'
import ProductCard from '../components/products/ProductCard'
import { useProducts } from '../hooks/useWordPressAPI'
import useStore from '../store/useStore'

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { products, pagination, loading, searchProducts } = useProducts()
  const { searchState, setSearchFilters } = useStore()
  
  const [filters, setFilters] = useState({
    category: searchParams.get('categoria') || '',
    sortBy: searchParams.get('orden') || 'relevance',
    priceRange: [0, 1000],
    page: parseInt(searchParams.get('pagina')) || 1
  })

  const query = searchParams.get('q') || ''

  // Cargar resultados cuando cambien los parámetros
  useEffect(() => {
    if (query) {
      handleSearch()
    }
  }, [query, filters])

  const handleSearch = async () => {
    try {
      await searchProducts(query, {
        ...filters,
        perPage: 12
      })
    } catch (error) {
      console.error('Error en búsqueda:', error)
    }
  }

  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value, page: 1 }
    setFilters(newFilters)
    setSearchFilters(newFilters)
    
    // Actualizar URL
    const newParams = new URLSearchParams(searchParams)
    if (value) {
      newParams.set(filterName === 'category' ? 'categoria' : 
                   filterName === 'sortBy' ? 'orden' : filterName, value)
    } else {
      newParams.delete(filterName === 'category' ? 'categoria' : 
                      filterName === 'sortBy' ? 'orden' : filterName)
    }
    newParams.set('pagina', '1')
    setSearchParams(newParams)
  }

  const handlePageChange = (event, page) => {
    setFilters(prev => ({ ...prev, page }))
    const newParams = new URLSearchParams(searchParams)
    newParams.set('pagina', page.toString())
    setSearchParams(newParams)
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const clearFilters = () => {
    const newFilters = {
      category: '',
      sortBy: 'relevance',
      priceRange: [0, 1000],
      page: 1
    }
    setFilters(newFilters)
    setSearchFilters(newFilters)
    
    const newParams = new URLSearchParams()
    if (query) newParams.set('q', query)
    setSearchParams(newParams)
  }

  const categories = [
    'Supermercado',
    'Farmacia',
    'Ferretería',
    'Licorería',
    'Panadería',
    'Carnicería',
    'Verdulería',
    'Tecnología',
    'Ropa',
    'Hogar',
    'Belleza',
    'Deportes'
  ]

  const sortOptions = [
    { value: 'relevance', label: 'Relevancia' },
    { value: 'price_low', label: 'Precio: Menor a Mayor' },
    { value: 'price_high', label: 'Precio: Mayor a Menor' },
    { value: 'newest', label: 'Más Recientes' },
    { value: 'oldest', label: 'Más Antiguos' }
  ]

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Barra de búsqueda */}
      <Box sx={{ mb: 4 }}>
        <SearchBar showFilters={true} />
      </Box>

      {/* Resultados y filtros */}
      <Grid container spacing={3}>
        {/* Sidebar de filtros */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3, position: 'sticky', top: 100 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Filtros
            </Typography>

            {/* Categoría */}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Categoría</InputLabel>
              <Select
                value={filters.category}
                label="Categoría"
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <MenuItem value="">Todas las categorías</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Ordenar por */}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Ordenar por</InputLabel>
              <Select
                value={filters.sortBy}
                label="Ordenar por"
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                {sortOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Rango de precios */}
            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>Rango de Precios (Bs.)</Typography>
              <Slider
                value={filters.priceRange}
                onChange={(e, value) => handleFilterChange('priceRange', value)}
                valueLabelDisplay="auto"
                min={0}
                max={10000}
                step={50}
                marks={[
                  { value: 0, label: '0' },
                  { value: 5000, label: '5K' },
                  { value: 10000, label: '10K' }
                ]}
              />
            </Box>

            {/* Limpiar filtros */}
            <Button 
              variant="outlined" 
              fullWidth 
              onClick={clearFilters}
              sx={{ textTransform: 'none' }}
            >
              Limpiar Filtros
            </Button>
          </Paper>
        </Grid>

        {/* Resultados */}
        <Grid item xs={12} md={9}>
          {/* Header de resultados */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {query ? `Resultados para "${query}"` : 'Todos los productos'}
              </Typography>
              {!loading && (
                <Typography variant="body2" color="text.secondary">
                  {pagination.totalItems} productos encontrados
                </Typography>
              )}
            </Box>
            
            {/* Filtros activos */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {filters.category && (
                <Chip
                  label={filters.category}
                  onDelete={() => handleFilterChange('category', '')}
                  color="primary"
                  variant="outlined"
                />
              )}
              {filters.sortBy !== 'relevance' && (
                <Chip
                  label={sortOptions.find(opt => opt.value === filters.sortBy)?.label}
                  onDelete={() => handleFilterChange('sortBy', 'relevance')}
                  color="primary"
                  variant="outlined"
                />
              )}
            </Box>
          </Box>

          {/* Loading */}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          )}

          {/* Productos */}
          {!loading && (
            <>
              {products.length > 0 ? (
                <>
                  <Grid container spacing={3}>
                    {products.map((product) => (
                      <Grid item xs={12} sm={6} lg={4} key={product.id}>
                        <ProductCard product={product} />
                      </Grid>
                    ))}
                  </Grid>

                  {/* Paginación */}
                  {pagination.totalPages > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                      <Pagination
                        count={pagination.totalPages}
                        page={pagination.page}
                        onChange={handlePageChange}
                        color="primary"
                        size="large"
                      />
                    </Box>
                  )}
                </>
              ) : (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No se encontraron productos
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Intenta con otros términos de búsqueda o ajusta los filtros
                  </Typography>
                </Box>
              )}
            </>
          )}
        </Grid>
      </Grid>
    </Container>
  )
}

export default Search