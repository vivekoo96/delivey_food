import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Tax = () => {
  const [taxes, setTaxes] = useState([]);
  const [formData, setFormData] = useState({ title: '', percentage: '', status: 'active' });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const fetchTaxes = async () => {
    try {
      const response = await api.get('/taxes');
      setTaxes(response.data.data || []);
    } catch (error) {
      console.error('Error fetching taxes:', error);
    }
  };

  useEffect(() => {
    fetchTaxes();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/taxes/${currentId}`, formData);
      } else {
        await api.post('/taxes', formData);
      }
      setFormData({ title: '', percentage: '', status: 'active' });
      setIsEditing(false);
      setCurrentId(null);
      fetchTaxes();
    } catch (error) {
      console.error('Error saving tax:', error);
    }
  };

  const handleEdit = (tax) => {
    setFormData({ title: tax.title, percentage: tax.percentage, status: tax.status });
    setIsEditing(true);
    setCurrentId(tax.id);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/taxes/${id}`);
      fetchTaxes();
    } catch (error) {
      console.error('Error deleting tax:', error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Taxes</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-2">
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium">Percentage (%)</label>
          <input
            type="number"
            name="percentage"
            value={formData.percentage}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
            required
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {isEditing ? 'Update' : 'Add'} Tax
        </button>
      </form>
      <table className="min-w-full bg-white rounded-lg shadow-md">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">Title</th>
            <th className="px-4 py-2 border-b">Percentage</th>
            <th className="px-4 py-2 border-b">Status</th>
            <th className="px-4 py-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {taxes.map((tax) => (
            <tr key={tax.id}>
              <td className="px-4 py-2 border-b">{tax.title}</td>
              <td className="px-4 py-2 border-b">{tax.percentage}%</td>
              <td className="px-4 py-2 border-b capitalize">{tax.status}</td>
              <td className="px-4 py-2 border-b">
                <button
                  onClick={() => handleEdit(tax)}
                  className="mr-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(tax.id)}
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

export default Tax;
