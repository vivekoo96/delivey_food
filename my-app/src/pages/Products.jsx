import React, { useState } from "react";

const ProductForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    shortDescription: "",
    tax: "",
    codAllowed: false,
    isCancelable: false,
    isSpicy: false,
    cancelableTill: "pending",
    mainImage: null,
    tags: [],
    indicator: "",
    highlights: "",
    calories: "",
    totalAllowedQuantity: "",
    minimumOrderQuantity: "",
    availableTime: false,
    startTime: "",
    endTime: "",
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    // Append all form fields to FormData
    Object.keys(formData).forEach((key) => {
      if (key === "mainImage" && formData[key]) {
        formDataToSend.append(key, formData[key]);
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    // Debugging FormData
    console.log("FormData before submission:");
    for (let [key, value] of formDataToSend.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await fetch("/products/add", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        alert("Product added successfully!");
      } else {
        alert("Failed to add product.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting the form.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">
        {formData.id ? "Update" : "Add"} Product
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Product Name"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Select Category <span className="text-red-500">*</span>
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select Category</option>
            <option value="category1">Category 1</option>
            <option value="category2">Category 2</option>
          </select>
        </div>

        {/* Short Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Short Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleInputChange}
            placeholder="Product Short Description"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* Tax */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Tax</label>
          <input
            type="text"
            name="tax"
            value={formData.tax}
            onChange={handleInputChange}
            disabled
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* Checkboxes */}
        <div className="flex items-center space-x-4">
          <div>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="codAllowed"
                checked={formData.codAllowed}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
              />
              <span className="ml-2">Is COD Allowed?</span>
            </label>
          </div>
          <div>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="isCancelable"
                checked={formData.isCancelable}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
              />
              <span className="ml-2">Is Cancelable?</span>
            </label>
          </div>
          <div>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="isSpicy"
                checked={formData.isSpicy}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
              />
              <span className="ml-2">Is Spicy?</span>
            </label>
          </div>
        </div>

        {/* Cancelable Till */}
        {formData.isCancelable && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Till which status? <span className="text-red-500">*</span>
            </label>
            <select
              name="cancelableTill"
              value={formData.cancelableTill}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="preparing">Preparing</option>
              <option value="out_for_delivery">Out For Delivery</option>
            </select>
          </div>
        )}

        {/* Main Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Main Image <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            name="mainImage"
            onChange={(e) =>
              setFormData({
                ...formData,
                mainImage: e.target.files[0],
              })
            }
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
          >
            {formData.id ? "Update Product" : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
