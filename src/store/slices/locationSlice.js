// Slice de geolocalización
export const createLocationSlice = (set, get) => ({
  // Estado
  location: {
    latitude: null,
    longitude: null,
    city: '',
    state: '',
    country: 'Venezuela',
    error: null,
    loading: false,
    lastUpdated: null
  },
  
  // Acciones
  setLocation: (latitude, longitude, city = '', state = '', country = 'Venezuela') => set({
    location: {
      latitude,
      longitude,
      city,
      state,
      country,
      error: null,
      loading: false,
      lastUpdated: new Date().toISOString()
    }
  }),
  
  setLocationLoading: (loading) => set((state) => ({
    location: {
      ...state.location,
      loading
    }
  })),
  
  setLocationError: (error) => set((state) => ({
    location: {
      ...state.location,
      error,
      loading: false
    }
  })),
  
  clearLocation: () => set({
    location: {
      latitude: null,
      longitude: null,
      city: '',
      state: '',
      country: 'Venezuela',
      error: null,
      loading: false,
      lastUpdated: null
    }
  }),
  
  // Utilidades
  calculateDistance: (lat1, lon1, lat2, lon2) => {
    const R = 6371 // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c // Distancia en km
  },
  
  // Getters
  getCurrentLocation: () => get().location,
  getCoordinates: () => {
    const { location } = get()
    return {
      latitude: location.latitude,
      longitude: location.longitude
    }
  },
  getLocationString: () => {
    const { location } = get()
    const parts = [location.city, location.state, location.country].filter(Boolean)
    return parts.join(', ')
  },
  isLocationAvailable: () => {
    const { location } = get()
    return location.latitude !== null && location.longitude !== null
  },
  isLocationLoading: () => get().location.loading,
  getLocationError: () => get().location.error
})