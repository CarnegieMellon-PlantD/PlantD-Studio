import { CostExporterDTO, CostExporterVO } from '@/types/resourceManager/costExporter';

/**
 * Convert the data transfer object of a CostExporter to the view object
 * @param dto The data transfer object of a CostExporter
 * @returns The view object of a CostExporter
 */
export const getCostExporterVO = (dto: CostExporterDTO): CostExporterVO => {
  return {
    originalObject: dto.spec,
    namespace: dto.metadata.namespace,
    name: dto.metadata.name,
    cloudServiceProvider: dto.spec.cloudServiceProvider ?? '',
    config: {
      name: dto.spec.config?.name ?? '',
      key: dto.spec.config?.key ?? '',
    },
  };
};

/**
 * Convert the view object of a CostExporter to the data transfer object
 * @param vo The view object of a CostExporter
 * @returns The data transfer object of a CostExporter
 */
export const getCostExporterDTO = (vo: CostExporterVO): Pick<CostExporterDTO, 'metadata' | 'spec'> => {
  return {
    metadata: {
      namespace: vo.namespace,
      name: vo.name,
    },
    spec: {
      ...vo.originalObject,
      cloudServiceProvider: vo.cloudServiceProvider,
      config: {
        name: vo.config.name,
        key: vo.config.key,
      },
    },
  };
};
