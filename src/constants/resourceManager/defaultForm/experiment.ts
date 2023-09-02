import { ExperimentVO } from '@/types/resourceManager/experiment';

export const getDefaultExperimentForm = (namespace: string): ExperimentVO => ({
  namespace: namespace,
  name: '',
  pipelineRef: {
    namespace: namespace,
    name: '',
  },
  loadPatterns: [],
  hasScheduledTime: false,
  scheduledTime: '',
});
