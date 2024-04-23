import * as React from 'react';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { App, Select, SelectProps } from 'antd';
import { useUpdateEffect } from 'usehooks-ts';

import { useLazyGetSecretQuery } from '@/services/resourceManager/utilApi';
import { getErrMsg } from '@/utils/getErrMsg';

interface SecretKeySelectProps extends Omit<SelectProps, 'showSearch' | 'loading' | 'options'> {
  /** Namespace of the current Secret */
  secretNamespace: string;
  /** Name of the current Secret */
  secretName: string;
}

const SecretKeySelect: React.FC<SecretKeySelectProps> = ({ secretNamespace, secretName, ...props }) => {
  const { t } = useTranslation();
  const { message } = App.useApp();

  const [getSecret, { data, isFetching, isSuccess, isError, error }] = useLazyGetSecretQuery();

  useEffect(() => {
    if (secretNamespace === '' || secretName === '') {
      return;
    }
    getSecret({
      metadata: {
        namespace: secretNamespace,
        name: secretName,
      },
    });
  }, [secretNamespace, secretName]);

  // Show error message if failed to list resources
  useUpdateEffect(() => {
    if (isError && error !== undefined) {
      message.error(t('Failed to list keys in Secret resources: {error}', { error: getErrMsg(error) }));
    }
  }, [isError, error]);

  const options = useMemo(
    () => (isSuccess && data?.data !== undefined ? Object.entries(data?.data).map(([key]) => key) : []),
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
export default SecretKeySelect;
