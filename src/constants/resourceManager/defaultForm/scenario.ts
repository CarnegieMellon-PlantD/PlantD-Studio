import { ScenarioVO } from '@/types/resourceManager/scenario';

export const getDefaultScenarioForm = (namespace: string): ScenarioVO => ({
  namespace: namespace,
  name: '',
  dataSetConfig: {
    compressPerSchema: false,
    compressedFileFormat: '',
    fileFormat: '',
  },
  pipelineRef: {
    namespace: namespace,
    name: '',
  },
  tasks: [],
});
