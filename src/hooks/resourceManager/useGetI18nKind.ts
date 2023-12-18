import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export const useGetI18nKind = () => {
  const { t } = useTranslation();
  return useCallback(
    (kind: string) => {
      switch (kind) {
        case 'Schema':
          return t('Schema');
        case 'DataSet':
          return t('DataSet');
        case 'LoadPattern':
          return t('LoadPattern');
        case 'Pipeline':
          return t('Pipeline');
        case 'Experiment':
          return t('Experiment');
        case 'CostExporter':
          return t('CostExporter');
        default:
          return kind;
      }
    },
    [t]
  );
};
