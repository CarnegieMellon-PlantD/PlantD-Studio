import { ExperimentDTO, ExperimentVO } from '@/types/resourceManager/experiment';

/**
 * Convert the data transfer object of an Experiment to the view object
 * @param dto The data transfer object of an Experiment
 * @returns The view object of an Experiment
 */
export const getExperimentVO = (dto: ExperimentDTO): ExperimentVO => {
  let drainingMode: ExperimentVO['drainingMode'] = 'none';
  if (dto.spec.useEndDetection === true) {
    drainingMode = 'endDetection';
  } else if (dto.spec.drainingTime !== undefined && dto.spec.drainingTime !== '') {
    drainingMode = 'time';
  }

  const vo: ExperimentVO = {
    originalObject: dto.spec,
    namespace: dto.metadata.namespace,
    name: dto.metadata.name,
    pipelineRef: {
      name: dto.spec.pipelineRef?.name ?? '',
    },
    endpointSpecs: [],
    hasScheduledTime: dto.spec.scheduledTime !== undefined && dto.spec.scheduledTime !== '',
    scheduledTime: dto.spec.scheduledTime ?? '',
    drainingMode,
    drainingTime: dto.spec.drainingTime ?? '',
  };

  if (dto.spec.endpointSpecs !== undefined) {
    vo.endpointSpecs = dto.spec.endpointSpecs.map((endpointSpec) => {
      let dataOption: ExperimentVO['endpointSpecs'][number]['dataSpec']['option'] = 'plainText';
      if (
        endpointSpec.dataSpec?.dataSetRef !== undefined &&
        endpointSpec.dataSpec.dataSetRef.name !== undefined &&
        endpointSpec.dataSpec.dataSetRef.name !== ''
      ) {
        dataOption = 'dataSet';
      }

      return {
        endpointName: endpointSpec.endpointName ?? '',
        dataSpec: {
          option: dataOption,
          plainText: endpointSpec.dataSpec?.plainText ?? '',
          dataSetRef: {
            name: endpointSpec.dataSpec?.dataSetRef?.name ?? '',
          },
        },
        loadPatternRef: {
          namespace: endpointSpec.loadPatternRef?.namespace ?? '',
          name: endpointSpec.loadPatternRef?.name ?? '',
        },
        storageSize: endpointSpec.storageSize ?? '',
      };
    });
  }

  return vo;
};

/**
 * Convert the view object of an Experiment to the data transfer object
 * @param vo The view object of an Experiment
 * @returns The data transfer object of an Experiment
 */
export const getExperimentDTO = (vo: ExperimentVO): Pick<ExperimentDTO, 'metadata' | 'spec'> => {
  const dto: Pick<ExperimentDTO, 'metadata' | 'spec'> = {
    metadata: {
      namespace: vo.namespace,
      name: vo.name,
    },
    spec: {
      ...vo.originalObject,
      pipelineRef: {
        name: vo.pipelineRef.name,
      },
      endpointSpecs: [],
      scheduledTime: vo.hasScheduledTime ? vo.scheduledTime : undefined,
      drainingTime: vo.drainingMode === 'time' ? vo.drainingTime : undefined,
      useEndDetection: vo.drainingMode === 'endDetection' ? true : undefined,
    },
  };

  dto.spec.endpointSpecs = vo.endpointSpecs.map((endpointSpec) => ({
    endpointName: endpointSpec.endpointName,
    dataSpec: {
      plainText: endpointSpec.dataSpec.option === 'plainText' ? endpointSpec.dataSpec.plainText : undefined,
      dataSetRef:
        endpointSpec.dataSpec.option === 'dataSet'
          ? {
              name: endpointSpec.dataSpec.dataSetRef.name,
            }
          : undefined,
    },
    loadPatternRef: {
      namespace: endpointSpec.loadPatternRef.namespace,
      name: endpointSpec.loadPatternRef.name,
    },
    storageSize: endpointSpec.storageSize !== '' ? endpointSpec.storageSize : undefined,
  }));

  return dto;
};
