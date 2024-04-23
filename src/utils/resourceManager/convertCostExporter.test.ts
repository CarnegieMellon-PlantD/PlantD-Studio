import { expect, test } from '@jest/globals';

import { CostExporterDTO } from '@/types/resourceManager/costExporter';
import { getCostExporterDTO, getCostExporterVO } from './convertCostExporter';

test('DTO->VO, Default', () => {
  const dtoIn: CostExporterDTO = {
    metadata: {
      namespace: 'namespace',
      name: 'name',
    },
    spec: {},
    status: {},
  };
  const vo = getCostExporterVO(dtoIn);

  expect(vo).toStrictEqual({
    originalObject: dtoIn.spec,
    namespace: 'namespace',
    name: 'name',
    cloudServiceProvider: '',
    config: {
      name: '',
      key: '',
    },
  });
});

test('DTO->VO->DTO', () => {
  const dtoIn: CostExporterDTO = {
    metadata: {
      namespace: 'namespace',
      name: 'name',
    },
    spec: {
      image: 'image',
      cloudServiceProvider: 'csp',
      config: {
        name: 'config-name',
        key: 'config-key',
      },
    },
    status: {},
  };
  const vo = getCostExporterVO(dtoIn);
  const dtoOut = getCostExporterDTO(vo);

  expect(vo).toStrictEqual({
    originalObject: dtoIn.spec,
    namespace: 'namespace',
    name: 'name',
    cloudServiceProvider: 'csp',
    config: {
      name: 'config-name',
      key: 'config-key',
    },
  });

  expect(dtoOut).toStrictEqual({
    metadata: {
      namespace: 'namespace',
      name: 'name',
    },
    spec: {
      image: 'image',
      cloudServiceProvider: 'csp',
      config: {
        name: 'config-name',
        key: 'config-key',
      },
    },
  });
});
