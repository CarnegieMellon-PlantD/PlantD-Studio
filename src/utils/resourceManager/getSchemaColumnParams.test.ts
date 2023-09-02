import { expect, test } from '@jest/globals';

import { getSchemaColumnParams } from './getSchemaColumnParams';

test('Nonexistent type', () => {
  // Nonexistent type should yield no params
  expect(getSchemaColumnParams('type')).toStrictEqual([]);
});

test('Type without params', () => {
  // Type without params should yield no params
  expect(getSchemaColumnParams('achaccount')).toStrictEqual([]);
});

test('Param values forwarding', () => {
  // When no values are provided, all yielded values should be empty
  expect(getSchemaColumnParams('creditcardnumber')).toStrictEqual([
    {
      info: expect.objectContaining({
        field: 'types',
      }),
      value: '',
    },
    {
      info: expect.objectContaining({
        field: 'bins',
      }),
      value: '',
    },
    {
      info: expect.objectContaining({
        field: 'gaps',
      }),
      value: '',
    },
  ]);

  // When values are provided, they should be forwarded
  expect(
    getSchemaColumnParams('creditcardnumber', {
      types: 'types-value',
      bins: 'bins-value',
      gaps: 'gaps-value',
    })
  ).toStrictEqual([
    {
      info: expect.objectContaining({
        field: 'types',
      }),
      value: 'types-value',
    },
    {
      info: expect.objectContaining({
        field: 'bins',
      }),
      value: 'bins-value',
    },
    {
      info: expect.objectContaining({
        field: 'gaps',
      }),
      value: 'gaps-value',
    },
  ]);
});

test('Nonexistent params forwarding', () => {
  // Nonexistent params and their values should be forwarded
  expect(getSchemaColumnParams('type', { param: 'value' })).toStrictEqual([
    {
      info: {
        field: 'param',
        display: 'param',
        type: '',
        optional: false,
        default: '',
        options: null,
        description: '',
      },
      value: 'value',
    },
  ]);
});
