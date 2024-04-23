import { NetCostDTO, NetCostVO } from '@/types/resourceManager/netCost';

/**
 * Convert the data transfer object of a NetCost to the view object
 * @param dto The data transfer object of a NetCost
 * @returns The view object of a NetCost
 */
export const getNetCostVO = (dto: NetCostDTO): NetCostVO => {
  return {
    originalObject: dto.spec,
    namespace: dto.metadata.namespace,
    name: dto.metadata.name,
    netCostPerMB: dto.spec.netCostPerMB ?? '',
    rawDataStoreCostPerMBMonth: dto.spec.rawDataStoreCostPerMBMonth ?? '',
    processedDataStoreCostPerMBMonth: dto.spec.processedDataStoreCostPerMBMonth ?? '',
    rawDataRetentionPolicyMonths: dto.spec.rawDataRetentionPolicyMonths ?? 0,
    processedDataRetentionPolicyMonths: dto.spec.processedDataRetentionPolicyMonths ?? 0,
  };
};

/**
 * Convert the view object of a NetCost to the data transfer object
 * @param vo The view object of a NetCost
 * @returns The data transfer object of a NetCost
 */
export const getNetCostDTO = (vo: NetCostVO): Pick<NetCostDTO, 'metadata' | 'spec'> => {
  return {
    metadata: {
      namespace: vo.namespace,
      name: vo.name,
    },
    spec: {
      ...vo.originalObject,
      netCostPerMB: vo.netCostPerMB,
      rawDataStoreCostPerMBMonth: vo.rawDataStoreCostPerMBMonth,
      processedDataStoreCostPerMBMonth: vo.processedDataStoreCostPerMBMonth,
      rawDataRetentionPolicyMonths: vo.rawDataRetentionPolicyMonths,
      processedDataRetentionPolicyMonths: vo.processedDataRetentionPolicyMonths,
    },
  };
};
