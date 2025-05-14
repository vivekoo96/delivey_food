import React, { useEffect, useState } from 'react';
import Sidebar from '../components/layout/Asidebar';
import api from '../services/api';
import Loader from '../components/ui/Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faTruck, faCheck, faTimes, faUtensils, faBoxOpen, faClipboardList, faBan } from '@fortawesome/free-solid-svg-icons';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'All Orders',
    paymentMethod: 'All Payment Methods',
    dateRange: '',
  });

  const [summary, setSummary] = useState({
    awaiting: 0,
    pending: 0,
    confirmed: 0,
    preparing: 0,
    readyForPickup: 0,
    outForDelivery: 0,
    delivered: 0,
    cancelled: 0,
    draft: 0,
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders');
        setOrders(response.data.orders);
        setSummary(response.data.summary);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      filters.status === 'All Orders' || order.status === filters.status;
    const matchesPaymentMethod =
      filters.paymentMethod === 'All Payment Methods' ||
      order.paymentMethod === filters.paymentMethod;
    // Add date range filtering logic if needed
    return matchesStatus && matchesPaymentMethod;
  });

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Manage Orders</h1>

      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {Object.entries(summary).map(([key, value]) => (
              <div
                key={key}
                className="bg-white shadow-md p-4 rounded flex flex-col items-center justify-center"
              >
                <FontAwesomeIcon
                  icon={
                    key === 'awaiting' ? faClock :
                    key === 'pending' ? faClipboardList :
                    key === 'confirmed' ? faCheck :
                    key === 'preparing' ? faUtensils :
                    key === 'readyForPickup' ? faBoxOpen :
                    key === 'outForDelivery' ? faTruck :
                    key === 'delivered' ? faCheck :
                    key === 'cancelled' ? faTimes :
                    key === 'draft' ? faBan : faClipboardList
                  }
                  className="text-blue-500 text-3xl mb-2"
                />
                <h2 className="text-lg font-semibold capitalize">{key.replace(/_/g, ' ')}</h2>
                <p className="text-2xl font-bold">{value}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              name="dateRange"
              placeholder="Select Date Of Ranges To Filter"
              className="border p-2 rounded w-1/3"
              value={filters.dateRange}
              onChange={handleFilterChange}
            />
            <select
              name="status"
              className="border p-2 rounded"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option>All Orders</option>
              <option>awaiting</option>
              <option>pending</option>
              <option>confirmed</option>
              <option>preparing</option>
              <option>ready_for_pickup</option>
              <option>out_for_delivery</option>
              <option>delivered</option>
              <option>cancelled</option>
              <option>draft</option>
            </select>
            <select
              name="paymentMethod"
              className="border p-2 rounded"
              value={filters.paymentMethod}
              onChange={handleFilterChange}
            >
              <option>All Payment Methods</option>
              <option>Cash</option>
              <option>Card</option>
              <option>Online</option>
            </select>
          </div>

          <table className="w-full bg-white shadow-md rounded">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Order ID</th>
                <th className="p-2">User Name</th>
                <th className="p-2">Items</th>
                <th className="p-2">Final Total(₹)</th>
                <th className="p-2">Payment Method</th>
                <th className="p-2">Address</th>
                <th className="p-2">Status</th>
                <th className="p-2">Order Date</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b">
                    <td className="p-2 text-center">{order.id}</td>
                    <td className="p-2 text-center">{order.userName}</td>
                    <td className="p-2 text-center">{order.items.length}</td>
                    <td className="p-2 text-center">₹{order.totalAmount}</td>
                    <td className="p-2 text-center">{order.paymentMethod}</td>
                    <td className="p-2 text-center">{order.address}</td>
                    <td className="p-2 text-center capitalize">{order.status}</td>
                    <td className="p-2 text-center">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-2 text-center">
                      <button className="bg-blue-500 text-white px-4 py-1 rounded">View</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center p-4">
                    No matching records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default Orders;
