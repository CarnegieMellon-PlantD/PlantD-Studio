import { InfoCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';

interface ErrorTooltipProps {
  record: { status?: { error?: string } };
}

const ErrorTooltip: React.FC<ErrorTooltipProps> = ({ record }) => {
  return (
    <>
      {' '}
      <Tooltip title={record.status?.error}>
        <InfoCircleOutlined className="cursor-pointer" />
      </Tooltip>
    </>
  );
};

export default ErrorTooltip;
