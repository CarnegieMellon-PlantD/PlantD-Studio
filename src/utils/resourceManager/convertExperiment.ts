import { ExperimentDTO, ExperimentVO } from '@/types/resourceManager/experiment';

/**
 * Convert the data transfer object of an Experiment to the view object
 * @param experimentDTO The data transfer object of an Experiment
 * @returns The view object of an Experiment
 */
export const getExperimentVO = (experimentDTO: ExperimentDTO): ExperimentVO => {
  return {
    namespace: experimentDTO.metadata.namespace,
    name: experimentDTO.metadata.name,
    pipelineRef: {
      namespace: experimentDTO.spec.pipelineRef?.namespace ?? '',
      name: experimentDTO.spec.pipelineRef?.name ?? '',
    },
    loadPatterns:
      experimentDTO.spec.loadPatterns?.map((loadPattern) => ({
        endpointName: loadPattern.endpointName ?? '',
        loadPatternRef: {
          namespace: loadPattern.loadPatternRef?.namespace ?? '',
          name: loadPattern.loadPatternRef?.name ?? '',
        },
      })) ?? [],
    hasScheduledTime: experimentDTO.spec.scheduledTime !== undefined && experimentDTO.spec.scheduledTime !== null,
    scheduledTime: experimentDTO.spec.scheduledTime ?? '',
  };
};

/**
 * Convert the view object of an Experiment to the data transfer object
 * @param experimentVO The view object of an Experiment
 * @returns The data transfer object of an Experiment
 */
export const getExperimentDTO = (experimentVO: ExperimentVO): Pick<ExperimentDTO, 'metadata' | 'spec'> => {
  return {
    metadata: {
      namespace: experimentVO.namespace,
      name: experimentVO.name,
    },
    spec: {
      pipelineRef: experimentVO.pipelineRef,
      loadPatterns: experimentVO.loadPatterns,
      scheduledTime: !experimentVO.hasScheduledTime ? undefined : experimentVO.scheduledTime,
    },
  };
};
