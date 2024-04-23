import { PlantDCoreDTO, PlantDCoreVO } from '@/types/resourceManager/plantDCore';

/**
 * Convert the data transfer object of a PlantDCore to the view object
 * @param dto The data transfer object of a PlantDCore
 * @returns The view object of a PlantDCore
 */
export const getPlantDCoreVO = (dto: PlantDCoreDTO): PlantDCoreVO => {
  return {
    originalObject: dto.spec,
    namespace: dto.metadata.namespace,
    name: dto.metadata.name,
    enableThanos: dto.spec.thanos?.objectStoreConfig !== undefined,
    thanosObjectStoreConfig: {
      name: dto.spec.thanos?.objectStoreConfig?.name ?? '',
      key: dto.spec.thanos?.objectStoreConfig?.key ?? '',
    },
  };
};

/**
 * Convert the view object of a PlantDCore to the data transfer object
 * @param vo The view object of a PlantDCore
 * @returns The data transfer object of a PlantDCore
 */
export const getPlantDCoreDTO = (vo: PlantDCoreVO): Pick<PlantDCoreDTO, 'metadata' | 'spec'> => {
  return {
    metadata: {
      namespace: vo.namespace,
      name: vo.name,
    },
    spec: {
      ...vo.originalObject,
      thanos: {
        ...vo.originalObject.thanos,
        objectStoreConfig: vo.enableThanos
          ? {
              name: vo.thanosObjectStoreConfig.name,
              key: vo.thanosObjectStoreConfig.key,
            }
          : undefined,
      },
    },
  };
};
