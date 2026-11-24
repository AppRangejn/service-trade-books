'use client';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1e40af',
    },
    secondary: {
      main: '#0f766e',
    },
    background: {
      default: '#f8fafc',
    },
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: 'inherit',
  },
});

export const ThemeRegistry = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
};
