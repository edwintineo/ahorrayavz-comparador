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
  Menu as MenuIcon,
  Store as StoreIcon,
  ExitToApp as LogoutIcon
} from '@mui/icons-material'
import { useNavigate, Link } from 'react-router-dom'
import { useStore } from '../../store/useStore'
import SearchBar from '../search/SearchBar'

const Header = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  
  const { user, shoppingLists, logout, exchangeRate } = useStore()
  const isAuthenticated = !!user
  
  const [anchorEl, setAnchorEl] = useState(null)
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null)
  const [showSearch, setShowSearch] = useState(false)

  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleUserMenuClose = () => {
    setAnchorEl(null)
  }

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget)
  }

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null)
  }

  const handleLogout = () => {
    logout()
    handleUserMenuClose()
    navigate('/')
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

          {/* Barra de búsqueda (desktop) */}
          {!isMobile && (
            <Box sx={{ flexGrow: 1, mx: 3, maxWidth: 600 }}>
              <SearchBar />
            </Box>
          )}

          {/* Tasa de cambio */}
          {exchangeRate && exchangeRate > 0 && (
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
          )}

          {/* Acciones del usuario */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Botón de búsqueda móvil */}
            {isMobile && (
              <IconButton 
                color="inherit" 
                onClick={() => setShowSearch(!showSearch)}
              >
                <SearchIcon />
              </IconButton>
            )}

            {/* Lista de compras */}
            <IconButton 
              color="inherit" 
              onClick={() => navigate('/mis-listas')}
            >
              <Badge badgeContent={shoppingLists.reduce((total, list) => total + list.items.length, 0)} color="secondary">
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
                {!isMobile ? (
                  <>
                    <Button 
                      color="inherit" 
                      onClick={() => navigate('/login')}
                      sx={{ textTransform: 'none' }}
                    >
                      Iniciar Sesión
                    </Button>
                    <Button 
                      variant="contained" 
                      color="secondary"
                      onClick={() => navigate('/registro')}
                      sx={{ 
                        textTransform: 'none',
                        ml: 1
                      }}
                    >
                      Registrarse
                    </Button>
                  </>
                ) : (
                  <IconButton 
                    color="inherit" 
                    onClick={handleMobileMenuOpen}
                  >
                    <MenuIcon />
                  </IconButton>
                )}
              </>
            )}
          </Box>
        </Toolbar>

        {/* Barra de búsqueda móvil */}
        {isMobile && showSearch && (
          <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <SearchBar />
          </Box>
        )}
      </AppBar>

      {/* Menú móvil para usuarios no autenticados */}
      <Menu
        anchorEl={mobileMenuAnchor}
        open={Boolean(mobileMenuAnchor)}
        onClose={handleMobileMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => { navigate('/login'); handleMobileMenuClose(); }}>
          Iniciar Sesión
        </MenuItem>
        <MenuItem onClick={() => { navigate('/registro'); handleMobileMenuClose(); }}>
          Registrarse
        </MenuItem>
      </Menu>
    </>
  )
}

export default Header