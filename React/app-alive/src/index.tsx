import ReactDOM from 'react-dom';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <HelmetProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </LocalizationProvider>
  </HelmetProvider>,
  document.getElementById('root')
);

serviceWorker.unregister();

reportWebVitals();
