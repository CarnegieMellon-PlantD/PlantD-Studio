import { CostExporterVO } from '@/types/resourceManager/costExporter';

export const getDefaultCostExporter = (namespace: string): CostExporterVO => ({
  originalObject: {},
  namespace: namespace,
  name: '',
  cloudServiceProvider: '',
  config: {
    name: '',
    key: '',
  },
});
