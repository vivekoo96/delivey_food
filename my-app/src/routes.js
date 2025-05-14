import { lazy } from 'react';
import PrivateRoute from './components/auth/PrivateRoute';

const Login = lazy(() => import('./components/auth/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Users = lazy(() => import('./pages/Users/Users'));
const Location = lazy(() => import('./pages/Location'));
import Orders from './pages/Orders';
import Categories from './pages/Categories';
import Tags from './pages/Tags';
import Branch from './pages/Branch';
import Products from './pages/Products';
import Media from './pages/Media';
import POS from './pages/POS';
import Sliders from './pages/Sliders';
import Offers from './pages/Offers';
import Support from './pages/Support';
import Promo from './pages/Promo';
import Featured from './pages/Featured';
import Customers from './pages/Customers';
import Riders from './pages/Riders';
import PaymentRequest from './pages/PaymentRequest';
import Notifications from './pages/Notifications';
import System from './pages/System';
import Settings from './pages/Settings';
import AllBranches from './pages/AllBranches';
import AllCategories from './pages/AllCategories';
import Tax from './pages/Tax';
import TicketTypes from './pages/TicketTypes';

const routes = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/admin',
    element: <PrivateRoute />,
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'locations',
        element: <Location />,
      },
      {
        path: 'users',
        element: <Users />,
      },
      {
        path: 'orders',
        element: <Orders />,
      },
      {
        path: 'categories',
        element: <Categories />,
      },
      {
        path: 'tags',
        element: <Tags />,
      },
      {
        path: 'branch',
        element: <Branch />,
      },
      {
        path: 'products',
        element: <Products />,
      },
      {
        path: 'media',
        element: <Media />,
      },
      {
        path: 'pos',
        element: <POS />,
      },
      {
        path: 'sliders',
        element: <Sliders />,
      },
      {
        path: 'offers',
        element: <Offers />,
      },
      {
        path: 'support',
        element: <Support />,
        children: [
          {
            path: 'ticket-types',
            element: <TicketTypes />,
          },
        ],
      },
      {
        path: 'promo',
        element: <Promo />,
      },
      {
        path: 'featured',
        element: <Featured />,
      },
      {
        path: 'customers',
        element: <Customers />,
      },
      {
        path: 'riders',
        element: <Riders />,
      },
      {
        path: 'payment-request',
        element: <PaymentRequest />,
      },
      {
        path: 'notifications',
        element: <Notifications />,
      },
      {
        path: 'system',
        element: <System />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
      {
        path: '/all-branches',
        element: <AllBranches />,
      },
      {
        path: 'all-categories',
        element: <AllCategories />,
      },
      {
        path: '/tax',
        element: <Tax />,
      },
    ],
  },
 
];

export default routes;