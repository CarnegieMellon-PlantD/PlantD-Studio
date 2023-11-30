export const getStep = (startTime: number, endTime: number, numSamples: number): number => {
  return Math.max(Math.floor((endTime - startTime) / (numSamples - 1)), 1);
};
