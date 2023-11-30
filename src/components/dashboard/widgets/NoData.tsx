import * as React from 'react';
import { useTranslation } from 'react-i18next';

export const NoData: React.FC = () => {
  const { t } = useTranslation();
  return <div className="text-center text-xl text-gray-400 dark:text-gray-500 py-6">{t('NO DATA')}</div>;
};
