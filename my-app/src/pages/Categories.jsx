import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Categories = () => {
  const [formData, setFormData] = useState({
    categoryName: '',
    description: '',
    status: 'active',
    branch: '',
    image: null,
  });

  const [branches, setBranches] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [categories, setCategories] = useState([]); // State to store all categories

  const navigate = useNavigate(); // Initialize navigate function

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await api.get('/branches');
        console.log('API Response:', response.data); // Log the response to debug

        // Access the `data` property directly
        if (response.data && Array.isArray(response.data.data)) {
          setBranches(response.data.data);
        } else {
          console.error('Unexpected response format:', response.data);
          setBranches([]); // Fallback to an empty array
        }
      } catch (error) {
        console.error('Error fetching branches:', error);
        setBranches([]); // Fallback to an empty array
      }
    };

    fetchBranches();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });

    // Generate a preview URL for the selected image
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.categoryName);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('branch_id', formData.branch);
    formDataToSend.append('status', formData.status);
    formDataToSend.append('image', formData.image);
    formDataToSend.append('row_order', 0); // Default value
    formDataToSend.append('parent_id', formData.parent_id || null); // Send null if parent_id is not set

    try {
      const response = await api.post('/categories/add', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Category added successfully:', response.data);
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleReset = () => {
    setFormData({
      categoryName: '',
      description: '',
      status: 'active',
      branch: '',
      image: null,
    });
    setImagePreview(null);
  };

  const redirectToAllCategories = () => {
    navigate('/admin/all-categories'); // Redirect to the All Categories page
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-semibold mb-4">Add Category</h1>
      <button
        onClick={redirectToAllCategories}
        className="mb-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Go to All Categories
      </button>
        </div>
     
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
        <div>
          <label className="block text-sm font-medium text-gray-700">Category Name</label>
          <input
            type="text"
            name="categoryName"
            value={formData.categoryName}
            onChange={handleChange}
            placeholder="Enter category name"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter category description"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Select Branch</label>
          <select
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
          >
            <option value="">Select a branch</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.branch_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Main Image</label>
          <input
            type="file"
            name="image"
            onChange={handleImageChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-4 w-32 h-32 object-cover rounded-md border"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
          >
            Reset
          </button>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Category
          </button>
        </div>
      </form>
    </div>
  );
};

export default Categories;
