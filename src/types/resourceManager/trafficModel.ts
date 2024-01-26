/** Type definition for the metadata of a TrafficModel */
export type TrafficModelMetadata = {
  namespace: string;
  name: string;
};

/** Type definition for the spec of a TrafficModel */
export type TrafficModelSpec = {
  // Replace with the spec of a TrafficModel
};

/** Type definition for the status of a TrafficModel */
export type TrafficModelStatus = {
  // Replace with the status of a TrafficModel
};

/** Type definition for the data transfer object of a TrafficModel */
export type TrafficModelDTO = {
  metadata: TrafficModelMetadata;
  spec: TrafficModelSpec;
  status: TrafficModelStatus | undefined;
};

/** Type definition for the view object of a TrafficModel */
export type TrafficModelVO = {
  namespace: string;
  name: string;
  // Replace with the view object of a TrafficModel
};

/** Enums of `status.trafficModelState` */
export enum TrafficModelState {}
// Replace with the states of a TrafficModel

/** All `status.trafficModelState` for enumerating and sorting */
export const allTrafficModelStates: TrafficModelState[] = [
  // Replace with the states of a TrafficModel
];
