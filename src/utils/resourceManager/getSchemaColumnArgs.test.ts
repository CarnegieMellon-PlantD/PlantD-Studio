import { expect, test } from '@jest/globals';

import { getSchemaColumnArgs } from './getSchemaColumnArgs';

test('Nonexistent formula', () => {
  // Nonexistent formula, no arg provided, should return no arg
  expect(getSchemaColumnArgs('formula')).toStrictEqual({
    info: 'null',
    value: [],
  });

  // Nonexistent formula, excess args provided, should return no arg
  expect(getSchemaColumnArgs('formula', ['arg'])).toStrictEqual({
    info: 'null',
    value: [],
  });
});

test('Formula without args', () => {
  // Formula without args, no arg provided, should return no arg
  expect(getSchemaColumnArgs('CurrentTimeMs')).toStrictEqual({
    info: 'null',
    value: [],
  });

  // Formula without args, excess args provided, should return no arg
  expect(getSchemaColumnArgs('CurrentTimeMs', ['arg'])).toStrictEqual({
    info: 'null',
    value: [],
  });
});

test('Formula with one arg', () => {
  // Formula with one arg, no arg provided, should return one empty arg
  expect(getSchemaColumnArgs('Copy')).toStrictEqual({
    info: 'anyColumn',
    value: [''],
  });

  // Formula with one arg, one arg provided, should forward the arg
  expect(getSchemaColumnArgs('Copy', ['arg'])).toStrictEqual({
    info: 'anyColumn',
    value: ['arg'],
  });

  // Formula with one arg, excess args provided, should truncate and forward the arg
  expect(getSchemaColumnArgs('Copy', ['arg-0', 'arg-1'])).toStrictEqual({
    info: 'anyColumn',
    value: ['arg-0'],
  });
});

test('Formula with three args', () => {
  // Formula with three args, no arg provided, should return three empty args
  expect(getSchemaColumnArgs('AddRandomTimeMs')).toStrictEqual({
    info: 'anyColumnWithBoundary',
    value: ['', '', ''],
  });

  // Formula with three args, insufficient args provided, should forward the args and fill the rest with empty args
  expect(getSchemaColumnArgs('AddRandomTimeMs', ['arg-0', 'arg-1'])).toStrictEqual({
    info: 'anyColumnWithBoundary',
    value: ['arg-0', 'arg-1', ''],
  });

  // Formula with three args, three args provided, should forward the args
  expect(getSchemaColumnArgs('AddRandomTimeMs', ['arg-0', 'arg-1', 'arg-2'])).toStrictEqual({
    info: 'anyColumnWithBoundary',
    value: ['arg-0', 'arg-1', 'arg-2'],
  });

  // Formula with three args, excess args provided, should truncate and forward the args
  expect(getSchemaColumnArgs('AddRandomTimeMs', ['arg-0', 'arg-1', 'arg-2', 'arg-3'])).toStrictEqual({
    info: 'anyColumnWithBoundary',
    value: ['arg-0', 'arg-1', 'arg-2'],
  });
});

test('Formula with infinite args', () => {
  // Formula with infinite args, no arg provided, should return no arg
  expect(getSchemaColumnArgs('AddInt')).toStrictEqual({
    info: 'intColumnList',
    value: [],
  });

  // Formula with infinite args, some args provided, should forward the args
  expect(getSchemaColumnArgs('AddInt', ['arg-0', 'arg-1', 'arg-2', 'arg-3'])).toStrictEqual({
    info: 'intColumnList',
    value: ['arg-0', 'arg-1', 'arg-2', 'arg-3'],
  });
});
