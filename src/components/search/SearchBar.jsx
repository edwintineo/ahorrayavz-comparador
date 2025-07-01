import React, { useState, useEffect } from 'react'
import {
  Paper,
  InputBase,
  IconButton,
  Box,
  Autocomplete,
  TextField,
  Chip
} from '@mui/material'
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store/useStore'

// Categorías predefinidas para el autocompletado
const CATEGORIES = [
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

// Sugerencias de búsqueda populares
const POPULAR_SEARCHES = [
  'Arroz',
  'Aceite',
  'Harina',
  'Azúcar',
  'Leche',
  'Pan',
  'Pollo',
  'Pasta',
  'Café',
  'Jabón'
]

const SearchBar = ({ showFilters = false, onSearch = null }) => {
  const navigate = useNavigate()
  const { searchState, setSearchQuery, setSearchFilters } = useStore()
  
  const [localQuery, setLocalQuery] = useState(searchState.query || '')
  const [selectedCategory, setSelectedCategory] = useState(searchState.filters.category || '')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Actualizar query local cuando cambie el estado global
  useEffect(() => {
    setLocalQuery(searchState.query || '')
  }, [searchState.query])

  // Generar sugerencias basadas en el input
  useEffect(() => {
    if (localQuery.length > 0) {
      const filteredSuggestions = POPULAR_SEARCHES
        .filter(item => 
          item.toLowerCase().includes(localQuery.toLowerCase())
        )
        .slice(0, 5)
      setSuggestions(filteredSuggestions)
      setShowSuggestions(true)
    } else {
      setSuggestions(POPULAR_SEARCHES.slice(0, 5))
      setShowSuggestions(false)
    }
  }, [localQuery])

  const handleSearch = (query = localQuery) => {
    if (!query.trim()) return
    
    // Actualizar estado global
    setSearchQuery(query.trim())
    if (selectedCategory) {
      setSearchFilters({ category: selectedCategory })
    }
    
    // Callback personalizado o navegación
    if (onSearch) {
      onSearch(query.trim(), { category: selectedCategory })
    } else {
      navigate(`/buscar?q=${encodeURIComponent(query.trim())}${selectedCategory ? `&categoria=${encodeURIComponent(selectedCategory)}` : ''}`)
    }
    
    setShowSuggestions(false)
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleSearch()
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setLocalQuery(suggestion)
    handleSearch(suggestion)
  }

  const handleClear = () => {
    setLocalQuery('')
    setSelectedCategory('')
    setSearchQuery('')
    setSearchFilters({ category: '' })
    setShowSuggestions(false)
  }

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <Paper
        component="form"
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          borderRadius: 2,
          boxShadow: 2
        }}
        onSubmit={(e) => {
          e.preventDefault()
          handleSearch()
        }}
      >
        {/* Campo de búsqueda principal */}
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Buscar productos, marcas o tiendas..."
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => setShowSuggestions(true)}
          inputProps={{ 'aria-label': 'buscar productos' }}
        />

        {/* Selector de categoría */}
        {showFilters && (
          <Autocomplete
            size="small"
            options={CATEGORIES}
            value={selectedCategory}
            onChange={(event, newValue) => setSelectedCategory(newValue || '')}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Categoría"
                variant="standard"
                sx={{ minWidth: 120, mx: 1 }}
                InputProps={{
                  ...params.InputProps,
                  disableUnderline: true
                }}
              />
            )}
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                {option}
              </Box>
            )}
          />
        )}

        {/* Botón de limpiar */}
        {(localQuery || selectedCategory) && (
          <IconButton 
            type="button" 
            sx={{ p: '10px' }} 
            aria-label="limpiar"
            onClick={handleClear}
          >
            <ClearIcon />
          </IconButton>
        )}

        {/* Botón de filtros */}
        {!showFilters && (
          <IconButton 
            type="button" 
            sx={{ p: '10px' }} 
            aria-label="filtros"
            onClick={() => navigate('/buscar')}
          >
            <FilterIcon />
          </IconButton>
        )}

        {/* Botón de búsqueda */}
        <IconButton 
          type="submit" 
          sx={{ p: '10px' }} 
          aria-label="buscar"
        >
          <SearchIcon />
        </IconButton>
      </Paper>

      {/* Sugerencias de búsqueda */}
      {showSuggestions && suggestions.length > 0 && (
        <Paper
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1000,
            mt: 1,
            maxHeight: 200,
            overflow: 'auto',
            borderRadius: 2
          }}
        >
          <Box sx={{ p: 2 }}>
            <Box sx={{ mb: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {suggestions.map((suggestion, index) => (
                <Chip
                  key={index}
                  label={suggestion}
                  variant="outlined"
                  size="small"
                  onClick={() => handleSuggestionClick(suggestion)}
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'primary.light',
                      color: 'white'
                    }
                  }}
                />
              ))}
            </Box>
          </Box>
        </Paper>
      )}
    </Box>
  )
}

export default SearchBar