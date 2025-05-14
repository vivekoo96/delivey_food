import React, { useState } from 'react';

const Riders = () => {
  const [sliderData, setSliderData] = useState({
    type: '',
    branch: '',
    image: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSliderData({ ...sliderData, [name]: value });
  };

  const handleImageUpload = (e) => {
    setSliderData({ ...sliderData, image: e.target.files[0] });
  };

  const handleReset = () => {
    setSliderData({ type: '', branch: '', image: null });
  };

  const handleSubmit = () => {
    // Add logic to submit slider data to the backend
    console.log('Slider Data:', sliderData);
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Slider Image For Add-on Offers and Other Benefits</h2>
      <form className="space-y-4">
        <div className="form-group">
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type *</label>
          <select
            id="type"
            name="type"
            value={sliderData.type}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select Type</option>
            <option value="offer">Offer</option>
            <option value="promotion">Promotion</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="branch" className="block text-sm font-medium text-gray-700">Select Branch *</label>
          <input
            type="text"
            id="branch"
            name="branch"
            value={sliderData.branch}
            onChange={handleInputChange}
            placeholder="Search for Branch"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="form-group">
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">Slider Image *</label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleImageUpload}
            required
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
          />
        </div>

        <div className="form-actions flex justify-end space-x-4">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Add Slider
          </button>
        </div>
      </form>
    </div>
  );
};

export default Riders;
