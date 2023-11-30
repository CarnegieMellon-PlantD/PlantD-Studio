import * as React from 'react';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { App, Select, SelectProps } from 'antd';
import { useUpdateEffect } from 'usehooks-ts';

import { useLazyGetPipelineQuery } from '@/services/resourceManager/pipelineApi';
import { PipelineVO } from '@/types/resourceManager/pipeline';
import { getErrMsg } from '@/utils/getErrMsg';

interface EndpointSelectProps extends Omit<SelectProps, 'showSearch' | 'loading' | 'options'> {
  /** Namespace of the current Pipeline */
  pipelineNamespace: PipelineVO['namespace'];
  /** Name of the current Pipeline */
  pipelineName: PipelineVO['name'];
}

const EndpointSelect: React.FC<EndpointSelectProps> = ({ pipelineNamespace, pipelineName, ...props }) => {
  const { t } = useTranslation();
  const { message } = App.useApp();

  const [getPipeline, { data, isFetching, isSuccess, isError, error }] = useLazyGetPipelineQuery();

  useEffect(() => {
    if (pipelineNamespace === '' || pipelineName === '') {
      return;
    }
    getPipeline({
      metadata: {
        namespace: pipelineNamespace,
        name: pipelineName,
      },
    });
  }, [pipelineNamespace, pipelineName]);

  // Show error message if failed to list resources
  useUpdateEffect(() => {
    if (isError && error !== undefined) {
      message.error(t('Failed to list endpoints in Pipeline resources: {error}', { error: getErrMsg(error) }));
    }
  }, [isError, error]);

  const options = useMemo(
    () =>
      !isSuccess
        ? []
        : data?.spec.pipelineEndpoints?.map((endpoint) => endpoint.name ?? '').filter((name) => name !== '') ?? [],
    [isSuccess, data]
  );

  return (
    <Select showSearch loading={isFetching} {...props}>
      {options.map((option) => (
        <Select.Option key={option} value={option}>
          {option}
        </Select.Option>
      ))}
    </Select>
  );
};
export default EndpointSelect;
