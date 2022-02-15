import 'react-perfect-scrollbar/dist/css/styles.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import 'react-quill/dist/quill.snow.css';
import 'nprogress/nprogress.css';
import ReactDOM from 'react-dom';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import { Provider as ReduxProvider } from 'react-redux';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as serviceWorker from './serviceWorker';
import store from './store';

ReactDOM.render(
  <HelmetProvider>
    <ReduxProvider store={store}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </LocalizationProvider>
    </ReduxProvider>
  </HelmetProvider>
  ,
  document.getElementById('root')
);

serviceWorker.unregister();

reportWebVitals();
