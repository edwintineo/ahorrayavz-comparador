// Slice de autenticación
export const createAuthSlice = (set, get) => ({
  // Estado
  user: null,
  token: null,
  isAuthenticated: false,
  
  // Acciones
  setUser: (user, token) => set({ 
    user, 
    token, 
    isAuthenticated: !!user 
  }),
  
  logout: () => set({ 
    user: null, 
    token: null, 
    isAuthenticated: false 
  }),
  
  // Getters
  getCurrentUser: () => get().user,
  getToken: () => get().token,
  isUserAuthenticated: () => get().isAuthenticated
})