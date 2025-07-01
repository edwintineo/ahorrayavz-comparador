import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Box } from '@mui/material'

// Layout components
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'

// Page components
import Home from './pages/Home'
import Search from './pages/Search'
import ProductDetail from './pages/ProductDetail'
import StoreDetail from './pages/StoreDetail'
import UserDashboard from './pages/UserDashboard'
import MerchantDashboard from './pages/MerchantDashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import ShoppingList from './pages/ShoppingList'
import About from './pages/About'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

// Test components
import TestWordPressConnection from './components/TestWordPressConnection'

// Providers
import { NotificationProvider } from './contexts/NotificationContext'

// Protected Route component
import ProtectedRoute from './components/auth/ProtectedRoute'

function App() {
  return (
    <NotificationProvider>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh' 
      }}>
        <Header />
            
            <Box component="main" sx={{ 
              flexGrow: 1, 
              paddingTop: { xs: '64px', sm: '70px' } // Offset for fixed header
            }}>
              <Routes>
                {/* Rutas públicas */}
                <Route path="/" element={<Home />} />
                <Route path="/buscar" element={<Search />} />
                <Route path="/producto/:id" element={<ProductDetail />} />
                <Route path="/tienda/:id" element={<StoreDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Register />} />
                <Route path="/acerca" element={<About />} />
                <Route path="/contacto" element={<Contact />} />
                <Route path="/test-wordpress" element={<TestWordPressConnection />} />
                
                {/* Rutas protegidas para usuarios */}
                <Route path="/mi-cuenta" element={
                  <ProtectedRoute>
                    <UserDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/mis-listas" element={
                  <ProtectedRoute>
                    <ShoppingList />
                  </ProtectedRoute>
                } />
                
                {/* Rutas protegidas para comercios */}
                <Route path="/panel-comercio" element={
                  <ProtectedRoute requiredRole="comercio">
                    <MerchantDashboard />
                  </ProtectedRoute>
                } />
                
                {/* Ruta 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Box>
            
            <Footer />
          </Box>
        </NotificationProvider>
  )
}

export default App