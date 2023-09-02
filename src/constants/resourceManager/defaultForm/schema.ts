import { SchemaVO } from '@/types/resourceManager/schema';

export const getDefaultSchemaForm = (namespace: string): SchemaVO => ({
  namespace: namespace,
  name: '',
  columns: [],
});
