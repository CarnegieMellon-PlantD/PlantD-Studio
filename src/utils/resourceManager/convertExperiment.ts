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
    endpointSpecs:
      experimentDTO.spec.endpointSpecs?.map((endpointSpec) => ({
        endpointName: endpointSpec.endpointName ?? '',
        dataSpec: {
          option:
            endpointSpec.dataSpec.dataSetRef?.namespace !== '' && endpointSpec.dataSpec.dataSetRef?.name !== ''
              ? 'dataSet'
              : 'plainText',
          plainText: endpointSpec.dataSpec.plainText ?? '',
          dataSetRef: {
            namespace: endpointSpec.dataSpec.dataSetRef?.namespace ?? '',
            name: endpointSpec.dataSpec.dataSetRef?.name ?? '',
          },
        },
        loadPatternRef: {
          namespace: endpointSpec.loadPatternRef?.namespace ?? '',
          name: endpointSpec.loadPatternRef?.name ?? '',
        },
      })) ?? [],
    hasScheduledTime: Boolean(experimentDTO.spec.scheduledTime),
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
      endpointSpecs: experimentVO.endpointSpecs.map((endpointSpec) => ({
        endpointName: endpointSpec.endpointName,
        dataSpec: {
          plainText: endpointSpec.dataSpec.option === 'plainText' ? endpointSpec.dataSpec.plainText : undefined,
          dataSetRef:
            endpointSpec.dataSpec.option === 'dataSet'
              ? {
                  namespace: endpointSpec.dataSpec.dataSetRef.namespace,
                  name: endpointSpec.dataSpec.dataSetRef.name,
                }
              : undefined,
        },
        loadPatternRef: endpointSpec.loadPatternRef,
      })),
      scheduledTime: !experimentVO.hasScheduledTime ? undefined : experimentVO.scheduledTime,
    },
  };
};
