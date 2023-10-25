import * as React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import logo from '@/images/logo.svg';
import { RootState } from '@/store';

const AppHelmet: React.FC = () => {
  const { t } = useTranslation();
  const title = useSelector((state: RootState) => state.appState.pageTitle);

  return (
    <HelmetProvider>
      <Helmet>
        <link rel="icon" href={logo} type="image/svg" />
        <title>{title ?? t('PlantD Studio')}</title>
      </Helmet>
    </HelmetProvider>
  );
};

export default AppHelmet;
