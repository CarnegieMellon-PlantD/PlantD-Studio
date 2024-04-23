import { TrafficModelDTO, TrafficModelVO } from '@/types/resourceManager/trafficModel';

/**
 * Convert the data transfer object of a TrafficModel to the view object
 * @param dto The data transfer object of a TrafficModel
 * @returns The view object of a TrafficModel
 */
export const getTrafficModelVO = (dto: TrafficModelDTO): TrafficModelVO => {
  return {
    originalObject: dto.spec,
    namespace: dto.metadata.namespace,
    name: dto.metadata.name,
    config: dto.spec.config ?? '',
  };
};

/**
 * Convert the view object of a TrafficModel to the data transfer object
 * @param vo The view object of a TrafficModel
 * @returns The data transfer object of a TrafficModel
 */
export const getTrafficModelDTO = (vo: TrafficModelVO): Pick<TrafficModelDTO, 'metadata' | 'spec'> => {
  return {
    metadata: {
      namespace: vo.namespace,
      name: vo.name,
    },
    spec: {
      ...vo.originalObject,
      config: vo.config,
    },
  };
};
