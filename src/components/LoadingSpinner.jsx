import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingSpinner = ({ 
  size = 40, 
  message = 'Cargando...', 
  showMessage = true,
  color = 'primary',
  thickness = 3.6,
  variant = 'indeterminate',
  value,
  sx = {}
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        p: 2,
        ...sx
      }}
    >
      <CircularProgress
        size={size}
        color={color}
        thickness={thickness}
        variant={variant}
        value={value}
      />
      {showMessage && message && (
        <Typography 
          variant="body2" 
          color="text.secondary"
          textAlign="center"
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default LoadingSpinner;