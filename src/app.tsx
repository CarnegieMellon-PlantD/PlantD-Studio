import * as React from 'react';
import { lazy, useEffect, useMemo, useState } from 'react';
import * as ReactDOM from 'react-dom/client';
import { useTranslation } from 'react-i18next';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { App as AntdApp, ConfigProvider, theme } from 'antd';
import en_US from 'antd/locale/en_US';
import { useDarkMode } from 'usehooks-ts';

import AppError from '@/components/AppError';
import AppHelmet from '@/components/AppHelmet';
import AppLayout from '@/components/AppLayout';
import { store } from '@/store';
import NetworkAndStorageList from './pages/resourceManager/NetworkAndStorageList';
import ProjectedUploadList from './pages/resourceManager/ProjectedUploadList';

import 'dayjs/locale/en';
import '@/i18n';
import '@/styles/base.less';

const Home = lazy(() => import('@/pages/Home'));
const NamespaceList = lazy(() => import('@/pages/resourceManager/NamespaceList'));
const NamespaceEditor = lazy(() => import('@/pages/resourceManager/NamespaceEditor'));
const SchemaList = lazy(() => import('@/pages/resourceManager/SchemaList'));
const SchemaEditor = lazy(() => import('@/pages/resourceManager/SchemaEditor'));
const DataSetList = lazy(() => import('@/pages/resourceManager/DataSetList'));
const DataSetEditor = lazy(() => import('@/pages/resourceManager/DataSetEditor'));
const LoadPatternList = lazy(() => import('@/pages/resourceManager/LoadPatternList'));
const LoadPatternEditor = lazy(() => import('@/pages/resourceManager/LoadPatternEditor'));
const PipelineList = lazy(() => import('@/pages/resourceManager/PipelineList'));
const PipelineEditor = lazy(() => import('@/pages/resourceManager/PipelineEditor'));
const ExperimentList = lazy(() => import('@/pages/resourceManager/ExperimentList'));
const ExperimentEditor = lazy(() => import('@/pages/resourceManager/ExperimentEditor'));
const ExperimentDetailDashboard = lazy(() => import('@/pages/dashboard/ExperimentDetailDashboard'));
const LoadGeneratorDashboard = lazy(() => import('@/pages/dashboard/LoadGeneratorDashboard'));
const TrafficModelList = lazy(() => import('@/pages/resourceManager/TrafficModelList'));
const TrafficModelEditor = lazy(() => import('@/pages/resourceManager/TrafficModelEditor'));
const DigitalTwinList = lazy(() => import('@/pages/resourceManager/DigitalTwinList'));
const DigitalTwinEditor = lazy(() => import('@/pages/resourceManager/DigitalTwinEditor'));
const SimulationList = lazy(() => import('@/pages/resourceManager/SimulationList'));
const SimulationEditor = lazy(() => import('@/pages/resourceManager/SimulationEditor'));
const SimulationReportDashboard = lazy(() => import('@/pages/dashboard/SimulationReportDashboard'));

const ImportExport = lazy(() => import('@/pages/ImportExport'));
const About = lazy(() => import('@/pages/About'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <AppError />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'namespace',
        children: [
          {
            index: true,
            element: <NamespaceList />,
          },
          {
            path: ':action/:name?',
            element: <NamespaceEditor />,
          },
        ],
      },
      {
        path: 'schema',
        children: [
          {
            index: true,
            element: <SchemaList />,
          },
          {
            path: ':action/:namespace?/:name?',
            element: <SchemaEditor />,
          },
        ],
      },
      {
        path: 'dataSet',
        children: [
          {
            index: true,
            element: <DataSetList />,
          },
          {
            path: ':action/:namespace?/:name?',
            element: <DataSetEditor />,
          },
        ],
      },
      {
        path: 'loadPattern',
        children: [
          {
            index: true,
            element: <LoadPatternList />,
          },
          {
            path: ':action/:namespace?/:name?',
            element: <LoadPatternEditor />,
          },
        ],
      },
      {
        path: 'pipeline',
        children: [
          {
            index: true,
            element: <PipelineList />,
          },
          {
            path: ':action/:namespace?/:name?',
            element: <PipelineEditor />,
          },
        ],
      },
      {
        path: 'experiment',
        children: [
          {
            index: true,
            element: <ExperimentList />,
          },
          {
            path: ':action/:namespace?/:name?',
            element: <ExperimentEditor />,
          },
        ],
      },
      {
        path: 'projectedUploads',
        children: [
          {
            index: true,
            element: <ProjectedUploadList />,
          },
        ],
      },
      {
        path: 'networkAndStorage',
        children: [
          {
            index: true,
            element: <NetworkAndStorageList />,
          },
        ],
      },
      {
        path: 'trafficModel',
        children: [
          {
            index: true,
            element: <TrafficModelList />,
          },
          {
            path: ':action/:namespace?/:name?',
            element: <TrafficModelEditor />,
          },
        ],
      },
      {
        path: 'digitalTwin',
        children: [
          {
            index: true,
            element: <DigitalTwinList />,
          },
          {
            path: ':action/:namespace?/:name?',
            element: <DigitalTwinEditor />,
          },
        ],
      },
      {
        path: 'simulation',
        children: [
          {
            index: true,
            element: <SimulationList />,
          },
          {
            path: ':action/:namespace?/:name?',
            element: <SimulationEditor />,
          },
        ],
      },
      {
        path: 'dashboard',
        children: [
          {
            path: 'experimentDetail/:namespace/:name',
            element: <ExperimentDetailDashboard />,
          },
          {
            path: 'loadGenerator/:namespace/:name',
            element: <LoadGeneratorDashboard />,
          },
          {
            path: 'simulationReport/:namespace/:name',
            element: <SimulationReportDashboard />,
          },
        ],
      },
      {
        path: 'importExport',
        element: <ImportExport />,
      },
      {
        path: 'about',
        element: <About />,
      },
    ],
  },
]);

const App: React.FC = () => {
  const { isDarkMode } = useDarkMode();
  const { i18n } = useTranslation();
  const [locale, setLocale] = useState(en_US);

  // Switch theme algorithm based on dark mode value, so that Antd components can switch between light mode and dark mode
  const algorithm = useMemo(() => (isDarkMode ? [theme.darkAlgorithm] : []), [isDarkMode]);

  // Update <html> element's class name based on dark mode value, so that Tailwind CSS can switch between light mode and dark mode
  // See https://tailwindcss.com/docs/dark-mode#toggling-dark-mode-manually
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Update locale for Antd when i18next language changes, it will automatically update dayjs locale
  // For supported locales of Antd, see https://ant.design/docs/react/i18n
  // For supported locales of dayjs, see https://github.com/iamkun/dayjs/tree/dev/src/locale
  useEffect(() => {
    // Fallback
    setLocale(en_US);
  }, [i18n.language]);

  return (
    <React.StrictMode>
      <Provider store={store}>
        <ConfigProvider locale={locale} theme={{ algorithm }}>
          <AntdApp>
            <AppHelmet />
            <RouterProvider router={router} />
          </AntdApp>
        </ConfigProvider>
      </Provider>
    </React.StrictMode>
  );
};

const root = ReactDOM.createRoot(document.getElementById('app') as HTMLElement);
root.render(<App />);
