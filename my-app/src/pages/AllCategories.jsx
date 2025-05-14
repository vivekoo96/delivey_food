import React, { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import api from '../services/api';

const AllCategories = () => {
  const [categories, setCategories] = useState([]);
  const [branches, setBranches] = useState([]); // State for branches
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    branch_id: '', // Include branch_id
    status: 'active',
    image: null,
  });

  

  useEffect(() => {
    // Fetch categories with pagination
    const fetchCategories = async () => {
      try {
        const response = await api.get(`/categories/all?page=${currentPage}`);
        setCategories(response.data.data || []);
        setTotalPages(response.data.totalPages || 1);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [currentPage]);

  useEffect(() => {
    // Fetch branches
    const fetchBranches = async () => {
      try {
        const response = await api.get('/branches');
        setBranches(response.data.data || []);
      } catch (error) {
        console.error('Error fetching branches:', error);
      }
    };

    fetchBranches();
  }, []);

  const openEditModal = (category) => {
    console.log('Opening edit modal for category:', category); // Debugging log
    setEditFormData({
      id: category.id, // Include id
      name: category.name,
      branch_id: category.branch_id || '', // Include branch_id
      status: category.status === 1 ? 'active' : 'inactive',
      image: category.image,
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', editFormData.name);
    formData.append('branch_id', editFormData.branch_id);
    formData.append('status', editFormData.status);
    if (editFormData.image) {
      formData.append('image', editFormData.image);
    }

    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      await api.put(`/categories/${editFormData.id}`, formData); // Removed manual Content-Type header
      alert('Category updated successfully!');
      setCategories(categories.map((category) => (category.id === editFormData.id ? { ...category, ...editFormData } : category)));
      closeEditModal();
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Failed to update category.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await api.delete(`/categories/${id}`);
        setCategories(categories.filter((category) => category.id !== id));
        alert('Category deleted successfully!');
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Failed to delete category.');
      }
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">All Categories</h1>
      <table className="min-w-full bg-white rounded-lg shadow-md">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">Image</th>
            <th className="px-4 py-2 border-b">Name</th>
            <th className="px-4 py-2 border-b">Status</th>
            <th className="px-4 py-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td className="px-4 py-2 border-b">
                <img
                  src={`${import.meta.env.VITE_API_URL}/uploads/${category.image}`} // Use Vite's import.meta.env for environment variables
                  alt={category.name}
                  className="w-16 h-16 object-cover rounded-md"
                />
              </td>
              <td className="px-4 py-2 border-b">{category.name}</td>
              <td className="px-4 py-2 border-b">{category.status}</td>
              <td className="px-4 py-2 border-b">
                <button
                  onClick={() => openEditModal(category)}
                  className="mr-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Next
        </button>
      </div>
      <ReactModal
        isOpen={isEditModalOpen}
        onRequestClose={closeEditModal}
        ariaHideApp={false}
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-gray-30 bg-opacity-0 flex items-center justify-center" // Changed to gray with 50% opacity
      >
        <h2 className="text-xl font-semibold mb-4 text-center">Edit Category</h2>
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <label className="block">
            <span className="text-gray-700">Name:</span>
            <input
              type="text"
              value={editFormData.name}
              onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Branch:</span>
            <select
              value={editFormData.branch_id}
              onChange={(e) => setEditFormData({ ...editFormData, branch_id: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.branch_name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-gray-700">Status:</span>
            <select
              value={editFormData.status}
              onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>
          <label className="block">
            <span className="text-gray-700">Image:</span>
            {editFormData.image ? (
              <img
                src={
                  typeof editFormData.image === 'string'
                    ? `${import.meta.env.VITE_API_URL}/uploads/${editFormData.image}`
                    : URL.createObjectURL(editFormData.image)
                }
                alt="Preview"
                className="w-32 h-32 object-cover rounded-md mb-2"
              />
            ) : null}
            <input
              type="file"
              onChange={(e) => setEditFormData({ ...editFormData, image: e.target.files[0] })}
              className="mt-1 block w-full text-gray-700"
            />
          </label>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={closeEditModal}
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

export default AllCategories;
