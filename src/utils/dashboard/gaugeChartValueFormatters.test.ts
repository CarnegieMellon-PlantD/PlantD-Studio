import { expect, test } from '@jest/globals';

import {
  byteBinUnitValueFormatter,
  byteSIUnitValueFormatter,
  percentValueFormatter,
  prefixSuffixValueFormatter,
} from './gaugeChartValueFormatters';

test('Prefix suffix', () => {
  expect(prefixSuffixValueFormatter(2, 'prefix ', ' suffix')(0.123456)).toStrictEqual('prefix 0.12 suffix');
});

test('Percent', () => {
  expect(percentValueFormatter(2)(0.123456)).toStrictEqual('12.35%');
});

test('Byte SI unit', () => {
  expect(byteSIUnitValueFormatter(2)(1000 * 1000)).toStrictEqual('1.00 MB');
});

test('Byte binary unit', () => {
  expect(byteBinUnitValueFormatter(2)(1024 * 1024)).toStrictEqual('1.00 MiB');
});
