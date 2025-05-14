import React, { useState } from 'react';

const POS = () => {
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('');

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleAddToCart = (product) => {
    setCart([...cart, product]);
  };

  const handleRemoveFromCart = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
  };

  const handlePlaceOrder = () => {
    alert('Order placed successfully!');
    setCart([]);
    setPaymentMethod('');
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex">
      {/* Left Section */}
      <div className="w-2/3 pr-4">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">Point Of Sale</h1>

        <div className="flex items-center space-x-4 mb-6">
          <select className="border border-gray-300 rounded-md p-2 bg-white shadow-sm">
            <option>All Products</option>
          </select>
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search Products"
            className="border border-gray-300 rounded-md p-2 flex-1 shadow-sm focus:ring-2 focus:ring-blue-500"
          />
          <button className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 focus:ring-2 focus:ring-blue-500">
            Search
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Products</h2>
          <p className="text-gray-500 text-center">No products available in this category...</p>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-1/3 pl-4">
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Cart</h2>
          {cart.length > 0 ? (
            <ul className="space-y-4">
              {cart.map((item, index) => (
                <li key={index} className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-700">{item}</span>
                  <button
                    onClick={() => handleRemoveFromCart(index)}
                    className="text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center">No items in cart</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Payment Methods</h2>
          <div className="space-y-2">
            {['Cash', 'Card Payment', 'Bar Code / QR Code Scan', 'Net Banking', 'Online Payment', 'Other'].map(
              (method) => (
                <label key={method} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="form-radio text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">{method}</span>
                </label>
              )
            )}
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => setCart([])}
            className="px-6 py-3 bg-red-500 text-white rounded shadow hover:bg-red-600 focus:ring-2 focus:ring-red-500"
          >
            Clear Cart
          </button>
          <button
            onClick={handlePlaceOrder}
            className="px-6 py-3 bg-green-500 text-white rounded shadow hover:bg-green-600 focus:ring-2 focus:ring-green-500"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default POS;
