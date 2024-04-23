import { nanoid } from '@reduxjs/toolkit';

import { SchemaVO } from '@/types/resourceManager/schema';

export const getDefaultSchema = (namespace: string): SchemaVO => ({
  originalObject: {},
  namespace: namespace,
  name: '',
  columns: [],
});

export const getDefaultSchemaColumn = (): SchemaVO['columns'][number] => ({
  id: nanoid(),
  name: '',
  type: '',
  params: [],
  formula: '',
  args: {
    info: 'null',
    value: [],
  },
});
