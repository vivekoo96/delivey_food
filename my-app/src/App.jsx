import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/auth/Login';
import Dashboard from './pages/Dashboard';
import Location from './pages/Location'; // Import the Location component
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
import AllBranches from './pages/AllBranches'; // Import the AllBranches component
import AllCategories from './pages/AllCategories'; // Import the AllCategories component
import Attributes from './pages/Attributes'; // Import the Attributes component
import Tax from './pages/Tax'; // Import the Tax component
import AddProducts from './pages/AddProducts'; // Import the AddProducts component
import BulkUpload from './pages/BulkUpload'; // Import the BulkUpload component
import ManageProducts from './pages/ManageProducts'; // Import the ManageProducts component
import ProductsOrder from './pages/ProductsOrder'; // Import the ProductsOrder component
import TicketTypes from './pages/TicketTypes'; // Import the TicketTypes component
import Tickets from './pages/Tickets'; // Import the Tickets component
import './index.css';
import ProtectedRoute from './components/auth/PrivateRoute';
import MainLayout from './components/layout/MainLayout'; // Import MainLayout

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="locations" element={<Location />} />
          <Route path="orders" element={<Orders />} />
          <Route path="categories" element={<Categories />} />
          <Route path="tags" element={<Tags />} />
          <Route path="branch" element={<Branch />} />
          <Route path="products" element={<Products />} />
          <Route path="products/attributes" element={<Attributes />} />
          <Route path="products/tax" element={<Tax />} />
          <Route path="products/add" element={<AddProducts />} />
          <Route path="products/bulk-upload" element={<BulkUpload />} />
          <Route path="products/manage-products" element={<ManageProducts />} />
          <Route path="products/orders" element={<ProductsOrder />} />
          <Route path="media" element={<Media />} />
          <Route path="pos" element={<POS />} />
          <Route path="sliders" element={<Sliders />} />
          <Route path="offers" element={<Offers />} />
          <Route path="support" element={<Support />}>
            <Route path="ticket-types" element={<TicketTypes />} />
            <Route path="tickets" element={<Tickets />} />
          </Route>
          <Route path="promo" element={<Promo />} />
          <Route path="featured" element={<Featured />} />
          <Route path="customers" element={<Customers />} />
          <Route path="riders" element={<Riders />} />
          <Route path="payment-request" element={<PaymentRequest />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="system" element={<System />} />
          <Route path="settings" element={<Settings />} />
          <Route path="all-branches" element={<AllBranches />} />
          <Route path="all-categories" element={<AllCategories />} />
        </Route>
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;