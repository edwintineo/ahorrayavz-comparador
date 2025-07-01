import React, { createContext, useContext, useState, useCallback } from 'react'
import { Snackbar, Alert, AlertTitle } from '@mui/material'

const NotificationContext = createContext({})

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification debe ser usado dentro de NotificationProvider')
  }
  return context
}

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])

  const showNotification = useCallback((message, type = 'info', title = null, duration = 6000) => {
    const id = Date.now() + Math.random()
    const notification = {
      id,
      message,
      type,
      title,
      duration,
      open: true
    }

    setNotifications(prev => [...prev, notification])

    // Auto-remove notification after duration
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, duration)
    }

    return id
  }, [])

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }, [])

  const showSuccess = useCallback((message, title = null) => {
    return showNotification(message, 'success', title)
  }, [showNotification])

  const showError = useCallback((message, title = 'Error') => {
    return showNotification(message, 'error', title, 8000)
  }, [showNotification])

  const showWarning = useCallback((message, title = 'Advertencia') => {
    return showNotification(message, 'warning', title)
  }, [showNotification])

  const showInfo = useCallback((message, title = null) => {
    return showNotification(message, 'info', title)
  }, [showNotification])

  const value = {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeNotification
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
      
      {/* Render notifications */}
      {notifications.map((notification) => (
        <Snackbar
          key={notification.id}
          open={notification.open}
          autoHideDuration={notification.duration}
          onClose={() => removeNotification(notification.id)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{ mt: 8 }}
        >
          <Alert
            onClose={() => removeNotification(notification.id)}
            severity={notification.type}
            variant="filled"
            sx={{ width: '100%', minWidth: 300 }}
          >
            {notification.title && (
              <AlertTitle>{notification.title}</AlertTitle>
            )}
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </NotificationContext.Provider>
  )
}

export default NotificationContext