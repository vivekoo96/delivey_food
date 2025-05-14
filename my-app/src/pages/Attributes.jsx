import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Attributes = () => {
  const [attributes, setAttributes] = useState([]);
  const [formData, setFormData] = useState({ name: '', values: [] });

  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const response = await api.get('/attributes');
        setAttributes(response.data.data || []);
      } catch (error) {
        console.error('Error fetching attributes:', error);
      }
    };

    fetchAttributes();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'values') {
      setFormData({ ...formData, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleTagInput = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newValue = e.target.value.trim();
      if (newValue && !formData.values.includes(newValue)) {
        setFormData({
          ...formData,
          values: [...formData.values, newValue],
        });
      }
      e.target.value = '';
    }
  };

  const removeTag = (index) => {
    const updatedValues = formData.values.filter((_, i) => i !== index);
    setFormData({ ...formData, values: updatedValues });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/attributes', { ...formData, values: formData.values.join(',') });
      setFormData({ name: '', values: [] });
      fetchAttributes();
    } catch (error) {
      console.error('Error adding attribute:', error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Manage Attributes</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-2">
          <label className="block text-sm font-medium">Attribute Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium">Attribute Values</label>
          <div className="flex flex-wrap items-center gap-2 border px-3 py-2 rounded">
            {formData.values.map((value, index) => (
              <span
                key={index}
                className="bg-blue-500 text-white px-2 py-1 rounded flex items-center gap-1"
              >
                {value}
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="text-white hover:text-gray-300"
                >
                  &times;
                </button>
              </span>
            ))}
            <input
              type="text"
              onKeyDown={handleTagInput}
              className="flex-grow focus:outline-none"
              placeholder="Type and press Enter or comma"
            />
          </div>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add Attribute
        </button>
      </form>
      <table className="min-w-full bg-white rounded-lg shadow-md">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">ID</th>
            <th className="px-4 py-2 border-b">Attribute Name</th>
            <th className="px-4 py-2 border-b">Attribute Values</th>
            <th className="px-4 py-2 border-b">Status</th>
            <th className="px-4 py-2 border-b">Action</th>
          </tr>
        </thead>
        <tbody>
          {attributes.map((attribute) => (
            <tr key={attribute.id}>
              <td className="px-4 py-2 border-b">{attribute.id}</td>
              <td className="px-4 py-2 border-b">{attribute.name}</td>
              <td className="px-4 py-2 border-b">{attribute.values}</td>
              <td className="px-4 py-2 border-b">{attribute.status ? 'Active' : 'Inactive'}</td>
              <td className="px-4 py-2 border-b">
                <button
                  className="mr-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Attributes;
