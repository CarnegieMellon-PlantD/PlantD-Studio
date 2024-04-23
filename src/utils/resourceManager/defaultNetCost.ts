import { NetCostVO } from '@/types/resourceManager/netCost';

export const getDefaultNetCost = (namespace: string): NetCostVO => ({
  originalObject: {},
  namespace: namespace,
  name: '',
  netCostPerMB: '',
  rawDataStoreCostPerMBMonth: '',
  processedDataStoreCostPerMBMonth: '',
  rawDataRetentionPolicyMonths: 0,
  processedDataRetentionPolicyMonths: 0,
});
