import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductsOrder = () => {
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
      <h1 className="text-2xl font-semibold mb-4">Point Of Sale - Manage Products Order</h1>

      <div className="flex items-center space-x-4 mb-6">
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Search Products by Category"
          className="border border-gray-300 rounded-md p-2 flex-1"
        />
        <button
          onClick={fetchProducts}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Search
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-medium mb-4">Products</h2>
          {products.length > 0 ? (
            <ul className="space-y-2">
              {products.map((product, index) => (
                <li key={product.id} className="flex items-center justify-between">
                  <span>{product.name}</span>
                  <input
                    type="number"
                    value={product.row_order || ''}
                    onChange={(e) => handleOrderChange(index, e.target.value)}
                    className="border border-gray-300 rounded-md p-1 w-16 text-center"
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No products available in this category...</p>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-medium mb-4">Cart</h2>
          <p className="text-gray-500">No items in cart</p>
        </div>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
        >
          Save Order
        </button>
      </div>
    </div>
  );
};

export default ProductsOrder;
