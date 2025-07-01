import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline, Container, Typography, Box } from '@mui/material'
import theme from './theme/theme'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import { NotificationProvider } from './contexts/NotificationContext'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationProvider>
        <Router>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <Container component="main" sx={{ flex: 1, py: 4 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="*" element={
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h4" gutterBottom>
                      Página no encontrada
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      La página que buscas no existe.
                    </Typography>
                  </Box>
                } />
              </Routes>
            </Container>
            <Footer />
          </Box>
        </Router>
      </NotificationProvider>
    </ThemeProvider>
  )
}

export default App