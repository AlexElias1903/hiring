import { useEffect } from 'react';
import type { FC } from 'react';
import { useRoutes } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import './i18n';
import { gtmConfig } from './config';
import gtm from './lib/gtm';
import routes from './routes';

const App: FC = () => {
  const content = useRoutes(routes);

  useEffect(() => {
    gtm.initialize(gtmConfig);
  }, []);

  return (
    <SnackbarProvider
      dense
      maxSnack={3}
    >
      {content}
    </SnackbarProvider>

  );
};

export default App;
