import * as React from 'react';
import { version as reactVersion } from 'react';
import { version as reactDomVersion } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { G2 } from '@ant-design/plots';
import { Breadcrumb, Card, Statistic, version as antdVersion } from 'antd';

import { appName } from '@/constants/base';

const About: React.FC = () => {
  const { t } = useTranslation(['about', 'common']);

  return (
    <div className="p-6">
      <Breadcrumb
        items={[{ title: appName }, { title: t('common:tools') }, { title: t('common:about') }]}
        className="mb-6"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <Card bordered={false}>
          <Statistic title={t('appVersion')} value={APP_VERSION} />
        </Card>
        <Card bordered={false}>
          <Statistic title={t('dependencyVersion', { dep: 'React' })} value={reactVersion} />
        </Card>
        <Card bordered={false}>
          <Statistic title={t('dependencyVersion', { dep: 'ReactDOM' })} value={reactDomVersion} />
        </Card>
        <Card bordered={false}>
          <Statistic title={t('dependencyVersion', { dep: 'Ant Design' })} value={antdVersion} />
        </Card>
        <Card bordered={false}>
          <Statistic title={t('dependencyVersion', { dep: 'AntV G2' })} value={G2.VERSION} />
        </Card>
        <Card bordered={false}>
          <Statistic title={t('buildType')} value={IS_DEVELOPMENT ? t('developmentBuild') : t('productionBuild')} />
        </Card>
        <Card bordered={false} className="col-span-2 lg:col-span-4 xl:col-span-6">
          <Statistic title={t('buildLocalTime')} value={BUILD_LOCAL_TIME} />
        </Card>
        <Card bordered={false} className="col-span-2 lg:col-span-4 xl:col-span-6">
          <Statistic title={t('buildTime')} value={BUILD_TIME} />
        </Card>
      </div>
    </div>
  );
};

export default About;
