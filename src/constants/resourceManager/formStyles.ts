import { FormProps } from 'antd';

export const formStyle: Pick<FormProps, 'labelCol' | 'labelWrap' | 'wrapperCol'> = {
  labelCol: { span: 6 },
  labelWrap: true,
  wrapperCol: { span: 18, lg: { span: 12 } },
};
