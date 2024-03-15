/** Data with 1 data channel and 1 group channel, used in pie chart, bar chart, etc. */
export type BiChannelData = Array<{
  /** Y axis */
  y: number | null;
  /** Group name */
  series: string;
}>;

/** Data with 2 data channels and 1 group channel, used in line chart, scatter chart, etc. */
export type TriChannelData = Array<{
  /** X axis */
  x: number;
  /** Y axis */
  y: number | null;
  /** Group name */
  series: string;
}>;

export type RedisRawData = Array<never>;
