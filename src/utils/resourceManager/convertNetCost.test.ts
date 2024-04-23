import { expect, test } from '@jest/globals';

import { NetCostDTO } from '@/types/resourceManager/netCost';
import { getNetCostDTO, getNetCostVO } from './convertNetCost';

test('DTO->VO, Default', () => {
  const dtoIn: NetCostDTO = {
    metadata: {
      namespace: 'namespace',
      name: 'name',
    },
    spec: {},
    status: {},
  };
  const vo = getNetCostVO(dtoIn);

  expect(vo).toStrictEqual({
    originalObject: dtoIn.spec,
    namespace: 'namespace',
    name: 'name',
    netCostPerMB: '',
    rawDataStoreCostPerMBMonth: '',
    processedDataStoreCostPerMBMonth: '',
    rawDataRetentionPolicyMonths: 0,
    processedDataRetentionPolicyMonths: 0,
  });
});

test('DTO->VO->DTO', () => {
  const dtoIn: NetCostDTO = {
    metadata: {
      name: 'name',
      namespace: 'namespace',
    },
    spec: {
      netCostPerMB: 'netCostPerMB',
      rawDataStoreCostPerMBMonth: 'rawDataStoreCostPerMBMonth',
      processedDataStoreCostPerMBMonth: 'processedDataStoreCostPerMBMonth',
      rawDataRetentionPolicyMonths: 1,
      processedDataRetentionPolicyMonths: 2,
    },
    status: {},
  };
  const vo = getNetCostVO(dtoIn);
  const dtoOut = getNetCostDTO(vo);

  expect(vo).toStrictEqual({
    originalObject: dtoIn.spec,
    name: 'name',
    namespace: 'namespace',
    netCostPerMB: 'netCostPerMB',
    rawDataStoreCostPerMBMonth: 'rawDataStoreCostPerMBMonth',
    processedDataStoreCostPerMBMonth: 'processedDataStoreCostPerMBMonth',
    rawDataRetentionPolicyMonths: 1,
    processedDataRetentionPolicyMonths: 2,
  });

  expect(dtoOut).toStrictEqual({
    metadata: {
      name: 'name',
      namespace: 'namespace',
    },
    spec: {
      netCostPerMB: 'netCostPerMB',
      rawDataStoreCostPerMBMonth: 'rawDataStoreCostPerMBMonth',
      processedDataStoreCostPerMBMonth: 'processedDataStoreCostPerMBMonth',
      rawDataRetentionPolicyMonths: 1,
      processedDataRetentionPolicyMonths: 2,
    },
  });
});
