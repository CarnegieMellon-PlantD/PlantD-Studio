import { PlantDCoreVO } from '@/types/resourceManager/plantDCore';

export const getDefaultPlantDCore = (namespace: string): PlantDCoreVO => {
  return {
    originalObject: {},
    namespace: namespace,
    name: '',
    enableThanos: false,
    thanosObjectStoreConfig: {
      name: '',
      key: '',
    },
  };
};
