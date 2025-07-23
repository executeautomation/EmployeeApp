import { createTheme } from '@mui/material/styles';

// Define color palettes for different themes
const themeConfigs = {
  light: {
    palette: {
      mode: 'light',
    },
  },
  dark: {
    palette: {
      mode: 'dark',
    },
  },
  blue: {
    palette: {
      mode: 'light',
      primary: {
        main: '#1976d2',
        light: '#42a5f5',
        dark: '#1565c0',
      },
      secondary: {
        main: '#0288d1',
        light: '#29b6f6',
        dark: '#0277bd',
      },
      background: {
        default: '#f0f8ff',
        paper: '#ffffff',
      },
    },
  },
  green: {
    palette: {
      mode: 'light',
      primary: {
        main: '#388e3c',
        light: '#66bb6a',
        dark: '#2e7d32',
      },
      secondary: {
        main: '#4caf50',
        light: '#81c784',
        dark: '#388e3c',
      },
      background: {
        default: '#f1f8e9',
        paper: '#ffffff',
      },
    },
  },
  purple: {
    palette: {
      mode: 'light',
      primary: {
        main: '#7b1fa2',
        light: '#ab47bc',
        dark: '#6a1b9a',
      },
      secondary: {
        main: '#9c27b0',
        light: '#ba68c8',
        dark: '#8e24aa',
      },
      background: {
        default: '#fce4ec',
        paper: '#ffffff',
      },
    },
  },
  orange: {
    palette: {
      mode: 'light',
      primary: {
        main: '#f57c00',
        light: '#ffb74d',
        dark: '#ef6c00',
      },
      secondary: {
        main: '#ff9800',
        light: '#ffcc02',
        dark: '#f57c00',
      },
      background: {
        default: '#fff8e1',
        paper: '#ffffff',
      },
    },
  },
};

// Create themes from configurations
export const themes = Object.keys(themeConfigs).reduce((acc, key) => {
  acc[key] = createTheme(themeConfigs[key]);
  return acc;
}, {});

// Theme names for display
export const themeNames = {
  light: 'Light',
  dark: 'Dark',
  blue: 'Blue Ocean',
  green: 'Forest Green',
  purple: 'Royal Purple',
  orange: 'Sunset Orange',
};

// Available theme keys
export const themeKeys = Object.keys(themes);