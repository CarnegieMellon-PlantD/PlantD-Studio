export const getStep = (startTime: number, endTime: number, numSamples: number): number => {
  return Math.floor((endTime - startTime) / numSamples);
};
