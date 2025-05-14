import React, { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import api from '../services/api';

const Tags = () => {
  const [tags, setTags] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '' }); // Changed from name to title
  const [editTagId, setEditTagId] = useState(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await api.get('/tags');
        setTags(response.data.data || []);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchTags();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editTagId) {
        await api.put(`/tags/${editTagId}`, { title: formData.title }); // Changed from name to title
        alert('Tag updated successfully!');
      } else {
        await api.post('/tags', { title: formData.title }); // Changed from name to title
        alert('Tag added successfully!');
      }
      setFormData({ title: '' }); // Reset form
      setEditTagId(null);
      setIsModalOpen(false);
      const response = await api.get('/tags');
      setTags(response.data.data || []);
    } catch (error) {
      console.error('Error saving tag:', error);
      alert('Failed to save tag.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this tag?')) {
      try {
        await api.delete(`/tags/${id}`);
        alert('Tag deleted successfully!');
        setTags(tags.filter((tag) => tag.id !== id));
      } catch (error) {
        console.error('Error deleting tag:', error);
        alert('Failed to delete tag.');
      }
    }
  };

  const openEditModal = (tag) => {
    setFormData({ title: tag.title }); // Changed from name to title
    setEditTagId(tag.id);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Tags</h1>
      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add Tag
      </button>
      <table className="min-w-full bg-white rounded-lg shadow-md">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">Title</th>
            <th className="px-4 py-2 border-b">Date Created</th>
            <th className="px-4 py-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tags.map((tag) => (
            <tr key={tag.id}>
              <td className="px-4 py-2 border-b">{tag.title}</td>
              <td className="px-4 py-2 border-b">{new Date(tag.date_created).toLocaleDateString()}</td>
              <td className="px-4 py-2 border-b">
                <button
                  onClick={() => openEditModal(tag)}
                  className="mr-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(tag.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        ariaHideApp={false}
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center"
      >
        <h2 className="text-xl font-semibold mb-4 text-center">
          {editTagId ? 'Edit Tag' : 'Add Tag'}
        </h2>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <label className="block">
            <span className="text-gray-700">Title:</span>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </form>
      </ReactModal>
    </div>
  );
};

export default Tags;
