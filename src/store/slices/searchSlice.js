// Slice de búsqueda
export const createSearchSlice = (set, get) => ({
  // Estado
  searchState: {
    query: '',
    filters: {
      category: '',
      priceRange: [0, 1000],
      location: null,
      sortBy: 'relevance'
    },
    results: [],
    loading: false,
    error: null,
    totalResults: 0,
    currentPage: 1,
    resultsPerPage: 20
  },
  
  // Acciones
  setSearchQuery: (query) => set((state) => ({
    searchState: {
      ...state.searchState,
      query,
      currentPage: 1 // Reset page when query changes
    }
  })),
  
  setSearchFilters: (filters) => set((state) => ({
    searchState: {
      ...state.searchState,
      filters: {
        ...state.searchState.filters,
        ...filters
      },
      currentPage: 1 // Reset page when filters change
    }
  })),
  
  setSearchResults: (results, totalResults = 0) => set((state) => ({
    searchState: {
      ...state.searchState,
      results,
      totalResults,
      loading: false,
      error: null
    }
  })),
  
  setSearchLoading: (loading) => set((state) => ({
    searchState: {
      ...state.searchState,
      loading
    }
  })),
  
  setSearchError: (error) => set((state) => ({
    searchState: {
      ...state.searchState,
      loading: false,
      error
    }
  })),
  
  setSearchPage: (page) => set((state) => ({
    searchState: {
      ...state.searchState,
      currentPage: page
    }
  })),
  
  clearSearchResults: () => set((state) => ({
    searchState: {
      ...state.searchState,
      results: [],
      totalResults: 0,
      error: null
    }
  })),
  
  // Getters
  getSearchQuery: () => get().searchState.query,
  getSearchFilters: () => get().searchState.filters,
  getSearchResults: () => get().searchState.results,
  isSearchLoading: () => get().searchState.loading,
  getSearchError: () => get().searchState.error,
  getTotalPages: () => {
    const { searchState } = get()
    return Math.ceil(searchState.totalResults / searchState.resultsPerPage)
  }
})