import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    status: 'Activated',
    indicator: 'Non-Veg',
    type: 'Simple Product',
    search: '',
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products', { params: filters });
        setProducts(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]); // Fallback to an empty array in case of an error
      }
    };

    fetchProducts();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Manage Products</h1>

      <div className="grid grid-cols-4 gap-4 mb-4">
        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          className="border border-gray-300 rounded-md p-2"
        >
          <option value="">Select Categories</option>
          {/* Add category options dynamically */}
        </select>

        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="border border-gray-300 rounded-md p-2"
        >
          <option value="Activated">Activated</option>
          <option value="Deactivated">Deactivated</option>
        </select>

        <select
          name="indicator"
          value={filters.indicator}
          onChange={handleFilterChange}
          className="border border-gray-300 rounded-md p-2"
        >
          <option value="Veg">Veg</option>
          <option value="Non-Veg">Non-Veg</option>
        </select>

        <select
          name="type"
          value={filters.type}
          onChange={handleFilterChange}
          className="border border-gray-300 rounded-md p-2"
        >
          <option value="Simple Product">Simple Product</option>
          <option value="Variable Product">Variable Product</option>
        </select>
      </div>

      <input
        type="text"
        name="search"
        value={filters.search}
        onChange={handleFilterChange}
        placeholder="Search"
        className="border border-gray-300 rounded-md p-2 w-full mb-4"
      />

      <table className="min-w-full bg-white rounded-lg shadow-md">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">Image</th>
            <th className="px-4 py-2 border-b">Name</th>
            <th className="px-4 py-2 border-b">Category</th>
            <th className="px-4 py-2 border-b">Branch</th>
            <th className="px-4 py-2 border-b">Rating</th>
            <th className="px-4 py-2 border-b">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product.id}>
                <td className="px-4 py-2 border-b">
                  <img src={product.image} alt={product.name} className="w-16 h-16 object-cover" />
                </td>
                <td className="px-4 py-2 border-b">{product.name}</td>
                <td className="px-4 py-2 border-b">{product.category}</td>
                <td className="px-4 py-2 border-b">{product.branch}</td>
                <td className="px-4 py-2 border-b">{product.rating}</td>
                <td className="px-4 py-2 border-b">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2">Edit</button>
                  <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-4">No matching records found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageProducts;
