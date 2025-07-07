'use client';

import { ReactNode } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import createEmotionCache from '../createEmotionCache';

// Client-side Emotion cache
const clientSideEmotionCache = createEmotionCache();

// MUI theme configuration
const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

interface MuiProviderProps {
  children: ReactNode;
}

// MUI provider component for components that need Material-UI
// Only wrap components that actually use MUI to maintain server component benefits
export default function MuiProvider({ children }: MuiProviderProps) {
  return (
    <CacheProvider value={clientSideEmotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}