import { DigitalTwinDTO, DigitalTwinVO } from '@/types/resourceManager/digitalTwin';

/**
 * Convert the data transfer object of a DigitalTwin to the view object
 * @param digitalTwinDTO The data transfer object of a DigitalTwin
 * @returns The view object of a DigitalTwin
 */
export const getDigitalTwinVO = (digitalTwinDTO: DigitalTwinDTO): DigitalTwinVO => {
  console.log(digitalTwinDTO.spec);
  return {
    namespace: digitalTwinDTO.metadata.namespace,
    name: digitalTwinDTO.metadata.name,
    experiments:
      digitalTwinDTO.spec.experiments?.map((experiment) => ({
        namespace: experiment.namespace ?? '',
        name: experiment.name ?? '',
      })) ?? [],
    modelType: digitalTwinDTO.spec.modelType ?? '',
  };
};

/**
 * Convert the view object of a DigitalTwin to the data transfer object
 * @param digitalTwinVO The view object of a DigitalTwin
 * @returns The data transfer object of a DigitalTwin
 */
export const getDigitalTwinDTO = (digitalTwinVO: DigitalTwinVO): Pick<DigitalTwinDTO, 'metadata' | 'spec'> => {
  return {
    metadata: {
      namespace: digitalTwinVO.namespace,
      name: digitalTwinVO.name,
    },
    spec: {
      experiments: digitalTwinVO.experiments,
      modelType: digitalTwinVO.modelType,
    },
  };
};
