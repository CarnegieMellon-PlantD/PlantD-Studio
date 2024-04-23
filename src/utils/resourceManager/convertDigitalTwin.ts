import { DigitalTwinDTO, DigitalTwinVO } from '@/types/resourceManager/digitalTwin';

/**
 * Convert the data transfer object of a DigitalTwin to the view object
 * @param dto The data transfer object of a DigitalTwin
 * @returns The view object of a DigitalTwin
 */
export const getDigitalTwinVO = (dto: DigitalTwinDTO): DigitalTwinVO => {
  const vo: DigitalTwinVO = {
    originalObject: dto.spec,
    namespace: dto.metadata.namespace,
    name: dto.metadata.name,
    modelType: dto.spec.modelType ?? '',
    digitalTwinType: dto.spec.digitalTwinType === 'schemaaware' ? 'schemaaware' : 'regular',
    experiments: [],
    dataSet: {
      name: dto.spec.dataSet?.name ?? '',
    },
    pipeline: {
      name: dto.spec.pipeline?.name ?? '',
    },
    pipelineCapacity: dto.spec.pipelineCapacity ?? 0,
  };

  if (dto.spec.experiments !== undefined) {
    vo.experiments = dto.spec.experiments.map((experiment) => ({
      namespace: experiment.namespace ?? '',
      name: experiment.name ?? '',
    }));
  }

  return vo;
};

/**
 * Convert the view object of a DigitalTwin to the data transfer object
 * @param vo The view object of a DigitalTwin
 * @returns The data transfer object of a DigitalTwin
 */
export const getDigitalTwinDTO = (vo: DigitalTwinVO): Pick<DigitalTwinDTO, 'metadata' | 'spec'> => {
  return {
    metadata: {
      namespace: vo.namespace,
      name: vo.name,
    },
    spec: {
      ...vo.originalObject,
      modelType: vo.modelType,
      digitalTwinType: vo.digitalTwinType,
      experiments: vo.digitalTwinType === 'regular' ? vo.experiments : undefined,
      dataSet: vo.digitalTwinType === 'schemaaware' ? vo.dataSet : undefined,
      pipeline: vo.digitalTwinType === 'schemaaware' ? vo.pipeline : undefined,
      pipelineCapacity: vo.digitalTwinType === 'schemaaware' ? vo.pipelineCapacity : undefined,
    },
  };
};
