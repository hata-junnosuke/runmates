'use client';

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

interface ClientThemeWrapperProps {
  children: ReactNode;
}

const ThemeRegistry = dynamic(() => import('./ThemeRegistry'), {
  ssr: false,
  loading: () => null
});

export default function ClientThemeWrapper({ children }: ClientThemeWrapperProps) {
  return (
    <ThemeRegistry>
      {children}
    </ThemeRegistry>
  );
}