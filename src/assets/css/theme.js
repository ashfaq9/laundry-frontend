// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6a11cb', // Custom primary color
    },
    secondary: {
      main: '#2575fc', // Custom secondary color
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif', // Custom font
  },
  // Add other custom styles here
});

export default theme;
