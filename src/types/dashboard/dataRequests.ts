/** Request for BiChannelData from Prometheus */
export type PrometheusBiChannelDataRequest = {
  __source: 'prometheus';
  query: string;
  end: number;
  labelSelector: string[];
};

/** Request for BiChannelData from Redis Time Series */
export type RedisTSBiChannelDataRequest = {
  __source: 'redis-ts';
  filters: string[];
  labelSelector: string[];
};

/** Request for BiChannelData */
export type BiChannelDataRequest = PrometheusBiChannelDataRequest | RedisTSBiChannelDataRequest;

/** Request for TriChannelData from Prometheus */
export type PrometheusTriChannelDataRequest = {
  __source: 'prometheus';
  query: string;
  start: number;
  end: number;
  step: number;
  labelSelector: string[];
};

/** Request for TriChannelData from Redis Time Series */
export type RedisTSTriChannelDataRequest = {
  __source: 'redis-ts';
  start: number;
  end: number;
  filters: string[];
  labelSelector: string[];
};

/** Request for TriChannelData */
export type TriChannelDataRequest = PrometheusTriChannelDataRequest | RedisTSTriChannelDataRequest;
