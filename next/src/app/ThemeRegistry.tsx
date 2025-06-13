'use client';

import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import createEmotionCache from './createEmotionCache';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

interface ThemeRegistryProps {
  children: React.ReactNode;
  emotionCache?: EmotionCache;
}

export default function ThemeRegistry({
  children,
  emotionCache = clientSideEmotionCache,
}: ThemeRegistryProps) {
  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}