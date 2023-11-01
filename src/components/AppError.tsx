import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router-dom';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'antd';

const AppError: React.FC = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-white dark:bg-black">
      <div className="mb-2 text-3xl">
        {isRouteErrorResponse(error)
          ? // react-router-dom error
            error.statusText
          : error instanceof Error
          ? // JavaScript error
            error.name
          : // Unknown error
            t('Unknown Error')}
      </div>
      <div className="mb-4 px-8 lg:px-32">
        {isRouteErrorResponse(error)
          ? // react-router-dom error
            error.data
          : error instanceof Error
          ? // JavaScript error
            error.message
          : // Unknown error
            t('An unknown error has occurred. Please see console for more details and submit an issue on GitHub.')}
      </div>
      <div className="flex gap-2">
        <Button
          type="primary"
          icon={<FontAwesomeIcon icon={faHome} />}
          onClick={() => {
            // Go home
            navigate('/');
          }}
        >
          {t('Go Home')}
        </Button>
      </div>
    </div>
  );
};

export default AppError;
