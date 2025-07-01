import React, { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material'
import {
  Search as SearchIcon,
  ShoppingCart as ShoppingListIcon,
  AccountCircle as AccountIcon,
  Store as StoreIcon,
  ExitToApp as LogoutIcon
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  
  // Estado simplificado para demostración
  const [user, setUser] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null)
  const [showSearch, setShowSearch] = useState(false)

  const isAuthenticated = !!user
  const shoppingListCount = 0 // Simplificado
  const exchangeRate = 50.0 // Tasa fija para demostración

  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleUserMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    setUser(null)
    handleUserMenuClose()
    navigate('/')
  }

  const handleLogin = () => {
    navigate('/login')
  }

  const handleRegister = () => {
    navigate('/registro')
  }

  const formatExchangeRate = (rate) => {
    return new Intl.NumberFormat('es-VE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(rate)
  }

  return (
    <>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: theme.zIndex.drawer + 1,
          background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Logo y nombre */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer',
              '&:hover': { opacity: 0.9 }
            }}
            onClick={() => navigate('/')}
          >
            <StoreIcon sx={{ mr: 1, fontSize: 28 }} />
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 700,
                fontSize: { xs: '1.1rem', sm: '1.25rem' }
              }}
            >
              AhorraYa VZ
            </Typography>
          </Box>

          {/* Barra de búsqueda simple (desktop) */}
          {!isMobile && (
            <Box sx={{ flexGrow: 1, mx: 3, maxWidth: 600 }}>
              <Button 
                variant="outlined"
                startIcon={<SearchIcon />}
                onClick={() => navigate('/buscar')}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.3)',
                  width: '100%',
                  justifyContent: 'flex-start',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderColor: 'rgba(255,255,255,0.5)'
                  }
                }}
              >
                Buscar productos...
              </Button>
            </Box>
          )}

          {/* Tasa de cambio */}
          <Box 
            sx={{ 
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: 1,
              px: 2,
              py: 0.5,
              mr: 2
            }}
          >
            <Typography variant="caption" sx={{ color: 'white', opacity: 0.9 }}>
              USD: {formatExchangeRate(exchangeRate)}
            </Typography>
          </Box>

          {/* Acciones del usuario */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Botón de búsqueda móvil */}
            {isMobile && (
              <IconButton 
                color="inherit" 
                onClick={() => navigate('/buscar')}
              >
                <SearchIcon />
              </IconButton>
            )}

            {/* Lista de compras */}
            <IconButton 
              color="inherit" 
              onClick={() => navigate('/mis-listas')}
            >
              <Badge badgeContent={shoppingListCount} color="secondary">
                <ShoppingListIcon />
              </Badge>
            </IconButton>

            {/* Menú de usuario */}
            {isAuthenticated ? (
              <>
                <IconButton
                  color="inherit"
                  onClick={handleUserMenuOpen}
                  sx={{ p: 0.5 }}
                >
                  <Avatar 
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      bgcolor: 'secondary.main',
                      fontSize: '0.875rem'
                    }}
                  >
                    {user?.displayName?.charAt(0)?.toUpperCase() || 'U'}
                  </Avatar>
                </IconButton>
                
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleUserMenuClose}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem onClick={() => { navigate('/mi-cuenta'); handleUserMenuClose(); }}>
                    <AccountIcon sx={{ mr: 1 }} />
                    Mi Cuenta
                  </MenuItem>
                  <MenuItem onClick={() => { navigate('/mis-listas'); handleUserMenuClose(); }}>
                    <ShoppingListIcon sx={{ mr: 1 }} />
                    Mis Listas
                  </MenuItem>
                  {user?.role === 'comercio' && (
                    <MenuItem onClick={() => { navigate('/panel-comercio'); handleUserMenuClose(); }}>
                      <StoreIcon sx={{ mr: 1 }} />
                      Panel Comercio
                    </MenuItem>
                  )}
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon sx={{ mr: 1 }} />
                    Cerrar Sesión
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button 
                  color="inherit" 
                  onClick={handleLogin}
                  sx={{ 
                    textTransform: 'none',
                    display: { xs: 'none', sm: 'inline-flex' }
                  }}
                >
                  Iniciar Sesión
                </Button>
                <Button 
                  variant="outlined" 
                  color="inherit"
                  onClick={handleRegister}
                  sx={{ 
                    textTransform: 'none',
                    borderColor: 'rgba(255,255,255,0.5)',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Registrarse
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Barra de búsqueda móvil */}
      {isMobile && showSearch && (
        <Box
          sx={{
            position: 'fixed',
            top: 64,
            left: 0,
            right: 0,
            zIndex: theme.zIndex.drawer,
            backgroundColor: 'white',
            p: 2,
            boxShadow: 2
          }}
        >
          <Button 
            variant="outlined"
            startIcon={<SearchIcon />}
            onClick={() => {
              setShowSearch(false)
              navigate('/buscar')
            }}
            sx={{
              width: '100%',
              justifyContent: 'flex-start',
              textTransform: 'none'
            }}
          >
            Buscar productos...
          </Button>
        </Box>
      )}
    </>
  )
}

export default Header