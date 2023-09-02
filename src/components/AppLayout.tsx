import * as React from 'react';
import { Suspense, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  faChartArea,
  faChevronLeft,
  faChevronRight,
  faCircleInfo,
  faCube,
  faDatabase,
  faFlask,
  faGlobe,
  faLanguage,
  faMoon,
  faServer,
  faSun,
  faTableColumns,
  faWrench,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Layout, Menu, MenuProps } from 'antd';
import { useBoolean, useDarkMode } from 'usehooks-ts';

import AppLoading from '@/components/AppLoading';
import { appName } from '@/constants/base';

type MenuItem = Exclude<MenuProps['items'], undefined>[number];

type MenuItemRule = {
  /** Key of menu item */
  key: string;
  /** Regular expression for URL to calculate selected state */
  match: RegExp;
  /** URL to jump to on selected */
  target: string;
};

const supportedLanguages = {
  'en-US': '🇺🇸 English (US)',
};

const AppLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode, toggle: toggleDarkMode } = useDarkMode();
  const { value: collapsed, setValue: setCollapsed, toggle: toggleCollapsed } = useBoolean(false);
  const { t, i18n } = useTranslation();

  const headerMenuItems = useMemo<MenuItem[]>(
    () => [
      {
        key: 'language',
        label: <FontAwesomeIcon icon={faLanguage} />,
        children: Object.entries(supportedLanguages).map(([langCode, langName]) => ({
          key: langCode,
          label: langName,
          onClick: () => {
            i18n.changeLanguage(langCode);
          },
        })),
      },
    ],
    []
  );
  const sideMenuItems = useMemo<MenuItem[]>(
    () => [
      {
        key: 'resources',
        icon: <FontAwesomeIcon icon={faCube} />,
        label: t('resources'),
        children: [
          {
            key: 'namespace',
            icon: <FontAwesomeIcon icon={faGlobe} />,
            label: t('namespace'),
          },
          {
            key: 'schema',
            icon: <FontAwesomeIcon icon={faTableColumns} />,
            label: t('schema'),
          },
          {
            key: 'dataSet',
            icon: <FontAwesomeIcon icon={faDatabase} />,
            label: t('dataSet'),
          },
          {
            key: 'loadPattern',
            icon: <FontAwesomeIcon icon={faChartArea} />,
            label: t('loadPattern'),
          },
          {
            key: 'pipeline',
            icon: <FontAwesomeIcon icon={faServer} />,
            label: t('pipeline'),
          },
          {
            key: 'experiment',
            icon: <FontAwesomeIcon icon={faFlask} />,
            label: t('experiment'),
          },
        ],
      },
      {
        key: 'tools',
        icon: <FontAwesomeIcon icon={faWrench} />,
        label: t('tools'),
        children: [
          {
            key: 'about',
            icon: <FontAwesomeIcon icon={faCircleInfo} />,
            label: t('about'),
          },
        ],
      },
    ],
    [t]
  );
  const sideMenuDefaultOpenKeys = useMemo<string[]>(() => ['resources', 'tools'], []);
  const sideMenuItemRules = useMemo<MenuItemRule[]>(
    () => [
      {
        key: 'namespace',
        match: /^\/namespace(\/.*)?$/,
        target: '/namespace',
      },
      {
        key: 'schema',
        match: /^\/schema(\/.*)?$/,
        target: '/schema',
      },
      {
        key: 'dataSet',
        match: /^\/dataSet(\/.*)?$/,
        target: '/dataSet',
      },
      {
        key: 'loadPattern',
        match: /^\/loadPattern(\/.*)?$/,
        target: '/loadPattern',
      },
      {
        key: 'pipeline',
        match: /^\/pipeline(\/.*)?$/,
        target: '/pipeline',
      },
      {
        key: 'experiment',
        match: /^\/experiment(\/.*)?$/,
        target: '/experiment',
      },
      {
        key: 'about',
        match: /^\/about(\/.*)?$/,
        target: '/about',
      },
    ],
    []
  );
  const sideMenuSelectedKeys = useMemo(
    () => sideMenuItemRules.filter(({ match }) => location.pathname.match(match) !== null).map(({ key }) => key),
    [sideMenuItemRules, location.pathname]
  );

  return (
    <Layout className="h-screen">
      {/* Header, justify children on two ends */}
      <Layout.Header className="transition-all px-4 lg:px-8 flex gap-4 justify-between">
        {/* Left part, disable shrink */}
        <div className="flex-none flex items-center gap-2 select-none">
          {/* <img src={} alt={t('productLogo')} className="w-12 h-12 pointer-events-none" /> */}
          <span className="font-logo text-xl text-white hidden lg:block">{appName}</span>
        </div>
        {/* Right part */}
        <Menu
          mode="horizontal"
          theme="dark"
          // Expand width to fill the space, justify children on right end
          className="min-w-0 w-full justify-end select-none"
          // Disable hover effect
          selectable={false}
          items={headerMenuItems}
        />
      </Layout.Header>
      <Layout hasSider>
        {/* Sider */}
        <Layout.Sider
          width={260}
          collapsedWidth={48}
          collapsible
          collapsed={collapsed}
          trigger={null}
          breakpoint="lg"
          onBreakpoint={(broken) => {
            setCollapsed(broken);
          }}
        >
          {/* Expand height to fill the space */}
          <div className="h-full flex flex-col select-none">
            {/* Upper part menu, wrap with scrollbar */}
            <div className="h-full overflow-y-auto">
              <Menu
                mode="inline"
                // Set minimal height to fill the space and disable default border of Antd Menu
                className="min-h-full border-r-0"
                items={sideMenuItems}
                selectedKeys={sideMenuSelectedKeys}
                defaultOpenKeys={sideMenuDefaultOpenKeys}
                onClick={({ key }) => {
                  // Find rule by key, if found, navigate to target
                  const target = sideMenuItemRules.find((itemInfo) => itemInfo.key === key)?.target;
                  if (target !== undefined) {
                    navigate(target);
                  }
                }}
              />
            </div>
            {/* Lower part menu */}
            <Menu
              mode="inline"
              // Disable default border of Antd Menu
              className="border-r-0"
              items={[
                {
                  key: 'toggleDarkMode',
                  icon: <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />,
                  label: isDarkMode ? t('lightMode') : t('darkMode'),
                  onClick: () => {
                    toggleDarkMode();
                  },
                },
                {
                  key: 'toggleCollapsed',
                  icon: <FontAwesomeIcon icon={collapsed ? faChevronRight : faChevronLeft} className="w-full h-4" />,
                  onClick: () => {
                    toggleCollapsed();
                  },
                },
              ]}
              selectable={false}
            />
          </div>
        </Layout.Sider>
        {/* Content, wrap with scrollbar */}
        <Layout.Content className="overflow-y-auto">
          <Suspense fallback={<AppLoading />}>
            <Outlet />
          </Suspense>
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
