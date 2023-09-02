import * as React from 'react';
import { Spin } from 'antd';

const AppLoading: React.FC = () => {
  return (
    <div className="h-full flex flex-col justify-center items-center">
      <Spin size="large" />
    </div>
  );
};

export default AppLoading;
