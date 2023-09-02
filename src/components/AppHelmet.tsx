import * as React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useSelector } from 'react-redux';

import { RootState } from '@/store';

const AppHelmet: React.FC = () => {
  const title = useSelector((state: RootState) => state.appState.pageTitle);

  return (
    <HelmetProvider>
      <Helmet>
        <title>{title}</title>
      </Helmet>
    </HelmetProvider>
  );
};

export default AppHelmet;
