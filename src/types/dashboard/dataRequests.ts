export type PrometheusBiChannelDataRequest = {
  source: 'prometheus';
  params: {
    query: string;
    end: number;
    labelSelector: string[];
  };
};
export type BiChannelDataRequest = PrometheusBiChannelDataRequest;

export type PrometheusTriChannelDataRequest = {
  source: 'prometheus';
  params: {
    query: string;
    start: number;
    end: number;
    step: number;
    labelSelector: string[];
  };
};

export type TriChannelDataRequest = PrometheusTriChannelDataRequest;
