import { Suspense, lazy } from 'react';
import type { PartialRouteObject } from 'react-router';
import DashboardLayout from './components/dashboard/DashboardLayout';

const Loadable = (Component) => (props) => (
  <Suspense fallback={<></>}>
    <Component {...props} />
  </Suspense>
);

const Quote = Loadable(lazy(() => import('./pages/dashboard/Quote')));
const History = Loadable(lazy(() => import('./pages/dashboard/History')));
const Compare = Loadable(lazy(() => import('./pages/dashboard/Compare')));
const Gains = Loadable(lazy(() => import('./pages/dashboard/Gains')));
const Overview = Loadable(lazy(() => import('./pages/dashboard/Overview')));


const routes: PartialRouteObject[] = [
  {
    path: 'dashboard',
    element: (
      <DashboardLayout />
    ),
    children: [
      {
        path: '/',
        element: <Overview />
      },
      {
        path: 'quote',
        element: <Quote />
      },
      {
        path: 'history',
        element: <History />
      },
      {
        path: 'compare',
        element: <Compare />
      },
      {
        path: 'gains',
        element: <Gains />
      }
    ]
  },
{
    path: '*',
    element: <DashboardLayout />,
    children: [
      {
        path: '/',
        element:<DashboardLayout />
      }
    ]
  }
];

export default routes;
