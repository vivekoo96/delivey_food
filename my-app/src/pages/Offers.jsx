import React, { useState } from 'react';

const Offers = () => {
  const [offerData, setOfferData] = useState({
    type: '',
    startDate: '',
    endDate: '',
    image: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOfferData({ ...offerData, [name]: value });
  };

  const handleImageUpload = (e) => {
    setOfferData({ ...offerData, image: e.target.files[0] });
  };

  const handleReset = () => {
    setOfferData({ type: '', startDate: '', endDate: '', image: null });
  };

  const handleSubmit = () => {
    // Add logic to submit offer data to the backend
    console.log('Offer Data:', offerData);
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Upload Offer Images</h2>
      <form className="space-y-4">
        <div className="form-group">
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type *</label>
          <select
            id="type"
            name="type"
            value={offerData.type}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select Type</option>
            <option value="offer">Offer</option>
            <option value="promotion">Promotion</option>
          </select>
        </div>

        <div className="form-group grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date *</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={offerData.startDate}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date *</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={offerData.endDate}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">Offer Image *</label>
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
            Add Offer
          </button>
        </div>
      </form>
    </div>
  );
};

export default Offers;
