import * as React from 'react';
import { version as reactVersion } from 'react';
import { version as reactDomVersion } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { G2 } from '@ant-design/plots';
import { Breadcrumb, Card, Statistic, version as antdVersion } from 'antd';

const About: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="p-6">
      <Breadcrumb
        items={[{ title: t('PlantD Studio') }, { title: t('Tools') }, { title: t('About') }]}
        className="mb-6"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <Card bordered={false}>
          <Statistic title={t('App Version')} value={APP_VERSION} />
        </Card>
        <Card bordered={false}>
          <Statistic title={t('{package} Version', { package: 'React' })} value={reactVersion} />
        </Card>
        <Card bordered={false}>
          <Statistic title={t('{package} Version', { package: 'ReactDOM' })} value={reactDomVersion} />
        </Card>
        <Card bordered={false}>
          <Statistic title={t('{package} Version', { package: 'Ant Design' })} value={antdVersion} />
        </Card>
        <Card bordered={false}>
          <Statistic title={t('{package} Version', { package: 'AntV G2' })} value={G2.VERSION} />
        </Card>
        <Card bordered={false}>
          <Statistic title={t('Build Type')} value={IS_DEVELOPMENT ? t('Development Build') : t('Production Build')} />
        </Card>
        <Card bordered={false} className="col-span-2 lg:col-span-4 xl:col-span-6">
          <Statistic title={t('Build Time (Local)')} value={BUILD_LOCAL_TIME} />
        </Card>
        <Card bordered={false} className="col-span-2 lg:col-span-4 xl:col-span-6">
          <Statistic title={t('Build Time (ISO)')} value={BUILD_ISO_TIME} />
        </Card>
      </div>
    </div>
  );
};

export default About;
