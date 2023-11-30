export type PrometheusBiChannelDataRequest = {
  __source: 'prometheus';
  query: string;
  end: number;
  labelSelector: string[];
};

export type RedisTSBiChannelDataRequest = {
  __source: 'redis-ts';
  filters: string[];
  labelSelector: string[];
};

export type BiChannelDataRequest = PrometheusBiChannelDataRequest | RedisTSBiChannelDataRequest;

export type PrometheusTriChannelDataRequest = {
  __source: 'prometheus';
  query: string;
  start: number;
  end: number;
  step: number;
  labelSelector: string[];
};

export type RedisTSTriChannelDataRequest = {
  __source: 'redis-ts';
  start: number;
  end: number;
  filters: string[];
  labelSelector: string[];
};

export type TriChannelDataRequest = PrometheusTriChannelDataRequest | RedisTSTriChannelDataRequest;
