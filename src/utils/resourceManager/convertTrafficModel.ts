import { TrafficModelDTO, TrafficModelVO } from '@/types/resourceManager/trafficModel';

/**
 * Convert the data transfer object of a TrafficModel to the view object
 * @param trafficModelDTO The data transfer object of a TrafficModel
 * @returns The view object of a TrafficModel
 */
export const getTrafficModelVO = (trafficModelDTO: TrafficModelDTO): TrafficModelVO => {
  return {
    namespace: trafficModelDTO.metadata.namespace,
    name: trafficModelDTO.metadata.name,
  };
};

/**
 * Convert the view object of a TrafficModel to the data transfer object
 * @param trafficModelVO The view object of a TrafficModel
 * @returns The data transfer object of a TrafficModel
 */
export const getTrafficModelDTO = (trafficModelVO: TrafficModelVO): Pick<TrafficModelDTO, 'metadata' | 'spec'> => {
  return {
    metadata: {
      namespace: trafficModelVO.namespace,
      name: trafficModelVO.name,
    },
    spec: {
      //   pipelineRef: trafficModelVO.pipelineRef,
      //   loadPatterns: trafficModelVO.loadPatterns,
      //   scheduledTime: !trafficModelVO.hasScheduledTime ? undefined : trafficModelVO.scheduledTime,
    },
  };
};
