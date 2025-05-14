import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageProductsOrder = () => {
  const [category, setCategory] = useState('');
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products', { params: { category } });
      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    }
  };

  useEffect(() => {
    if (category) {
      fetchProducts();
    }
  }, [category]);

  const handleSave = async () => {
    try {
      const response = await axios.post('/api/products/order', { products });
      alert(response.data.message || 'Order saved successfully!');
    } catch (error) {
      console.error('Error saving product order:', error);
      alert('Failed to save product order.');
    }
  };

  const handleOrderChange = (index, value) => {
    const updatedProducts = [...products];
    updatedProducts[index].row_order = value;
    setProducts(updatedProducts);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Manage Products Order</h1>

      <div className="mb-4">
        <label htmlFor="category" className="block font-medium mb-2">Filter By Product Category</label>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
            className="border border-gray-300 rounded-md p-2 flex-1"
          />
          <button
            onClick={fetchProducts}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Search
          </button>
        </div>
      </div>

      <table className="min-w-full bg-white rounded-lg shadow-md">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">No.</th>
            <th className="px-4 py-2 border-b">Row Order Id</th>
            <th className="px-4 py-2 border-b">Product Name</th>
            <th className="px-4 py-2 border-b">Image</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product, index) => (
              <tr key={product.id}>
                <td className="px-4 py-2 border-b text-center">{index + 1}</td>
                <td className="px-4 py-2 border-b text-center">
                  <input
                    type="number"
                    value={product.row_order || ''}
                    onChange={(e) => handleOrderChange(index, e.target.value)}
                    className="border border-gray-300 rounded-md p-2 w-full"
                  />
                </td>
                <td className="px-4 py-2 border-b">{product.name}</td>
                <td className="px-4 py-2 border-b">
                  <img src={product.image} alt={product.name} className="w-16 h-16 object-cover" />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center py-4">No products found</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="mt-4 text-center">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default ManageProductsOrder;
