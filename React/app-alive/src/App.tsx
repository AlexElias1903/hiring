import { useEffect } from 'react';
import type { FC } from 'react';
import { useRoutes } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import './i18n';
import routes from './routes';

const App: FC = () => {
  const content = useRoutes(routes);

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
