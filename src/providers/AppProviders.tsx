import React from 'react';
import type { ReactNode } from 'react';

interface AppProvidersProps {
  children: ReactNode;
}

const AppProviders = ({ children }: AppProvidersProps) => {
  return <>{children}</>;
};

export default AppProviders;