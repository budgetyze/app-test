import { render } from 'solid-js/web';
import { Router, Route, Routes } from '@solidjs/router';

import App from './components/App';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import Transactions from './components/Transactions';
import { StateProvider } from './contexts/State';

import './index.css';

render(
  () => {
    return (
      <StateProvider>
        <App>
          <Router>
            <Routes>
              <Route path="/" component={Dashboard} />
              <Route path="/transactions" component={Transactions} />
              <Route path="/settings" component={Settings} />
            </Routes>
          </Router>
        </App>
      </StateProvider>
    );
  },
  document.getElementById('root')!,
);
