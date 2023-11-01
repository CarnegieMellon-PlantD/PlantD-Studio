export const getFriendlyByte = (value: number, precision: number) => {
  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  let idx = 0;
  while (value > 1024) {
    value /= 1024;
    idx++;
  }
  return `${value.toFixed(precision)} ${units[idx]}`;
};
