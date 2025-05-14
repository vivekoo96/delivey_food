import React, { useState, useEffect } from 'react';
import { useForm ,Controller } from 'react-hook-form';
import api from '../services/api';
import axios from 'axios';
import Select from 'react-select';
const AddProduct = ({ addOnSnaps }) => {
  const branchId = localStorage.getItem('branch_id');
  const { register,control, handleSubmit, setValue, reset, formState: { errors } } = useForm();
  
  const [isCancelable, setIsCancelable] = useState(false);
  const [isSpicy, setIsSpicy] = useState(false);
  const [isCodAllowed, setIsCodAllowed] = useState(false);
  const [hasAvailableTime, setHasAvailableTime] = useState(false);
  const [productType, setProductType] = useState('');
  const [simpleStockManagement, setSimpleStockManagement] = useState(false);
  const [variantStockManagement, setVariantStockManagement] = useState(false);
  const [variantStockLevelType, setVariantStockLevelType] = useState('');
  const [productAddOns, setProductAddOns] = useState([]);
  const [mainImage, setMainImage] = useState('');
  const [activeTab, setActiveTab] = useState('general');
const [categories, setCategories] = useState([]);
const [branches, setBranches] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await api.get('/tags');
        setTags(res.data.data.map(tag => ({
          value: tag.id,
          label: tag.title
        })));
      } catch (err) {
        setTags([]);
      }
    };
    fetchTags();
  }, []);

  const handleTagChange = (selectedOptions) => {
    setSelectedTags(selectedOptions || []);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories/all');
        setCategories(response.data.data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

   useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await api.get('/branches');
        setBranches(response.data.data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setBranches([]);
      }
    };
    fetchBranches();
  }, []);



  const handleCategoryChange = (e) => {
    console.log('Selected category:', e.target.value);
    setSelectedCategory(e.target.value);
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      // Append all form fields to FormData
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });

      // Append additional fields explicitly
      formData.append('name', data.name || '');
      formData.append('short_description', data.short_description || '');
      formData.append('indicator', data.indicator || '');
      formData.append('highlights', data.highlights || '');
      formData.append('calories', data.calories || '');
      formData.append('total_allowed_quantity', data.total_allowed_quantity || '');
      formData.append('minimum_order_quantity', data.minimum_order_quantity || '');
      formData.append('product_category_id', data.product_category_id || '');
      formData.append('cancelable_till', data.cancelable_till || '');
      formData.append('simple_price', data.simple_price || '');
      formData.append('simple_special_price', data.simple_special_price || '');
      formData.append('product_total_stock', data.product_total_stock || '');
      formData.append('stock_status', data.stock_status || '');
      formData.append('product_start_time', data.product_start_time || '');
      formData.append('product_end_time', data.product_end_time || '');
      // formData.append('branch_id', branchId || 'dummy_branch_id');
      formData.append('product_add_ons', JSON.stringify(productAddOns));

      // Ensure 'mainImage' is appended only once
      if (mainImage) {
        if (!formData.has('mainImage')) {
          formData.append('mainImage', mainImage); // Append the file
        }
      } else {
        alert('Main image is required.');
        return;
      }

      // Ensure 'is_spicy' is included in the payload
      formData.append('is_spicy', data.is_spicy || false);

      // Ensure all fields are included
      console.log('Final FormData before submission:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      // Send the form data to the backend
      const response = await api.post('/products/add', formData); // Removed manual Content-Type header

      if (response.status === 200) {
        alert('Product saved successfully!');
      } else {
        alert('Failed to save product.');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('An error occurred while saving the product.');
    }
  };

  const handleImageUpload = (file) => {
    if (file) {
      setMainImage(file);
      setValue('mainImage', file); // Ensure the file is set in the form data
    } else {
      alert('Please select an image.');
    }
  };

  const handleAddAddOn = () => {
    const addOnTitle = document.getElementById('title').value;
    const addOnDescription = document.getElementById('description').value;
    const addOnPrice = document.getElementById('price').value;
    const addOnCalories = document.getElementById('add_on_calories').value;

    if (!addOnTitle || !addOnPrice) {
      alert('Title and Price are required fields.');
      return;
    }

    const newAddOn = {
      id: Date.now(), // Temporary unique ID
      title: addOnTitle,
      description: addOnDescription,
      price: addOnPrice,
      calories: addOnCalories,
    };

    setProductAddOns([...productAddOns, newAddOn]);

    // Clear input fields
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('price').value = '';
    document.getElementById('add_on_calories').value = '';
  };

  const handleRemoveAddOn = (id) => {
    setProductAddOns(productAddOns.filter((addOn) => addOn.id !== id));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Add Product</h1>
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-4">
                <li>
                  <div className="flex items-center">
                    <a href="/admin/home" className="text-blue-600 hover:text-blue-800">
                      Home
                    </a>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg
                      className="flex-shrink-0 h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="ml-4 text-gray-500">Products</span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <form className="form-horizontal space-y-6" onSubmit={handleSubmit(onSubmit)} >
          <input type="hidden" name="branch_id" value={branchId || ''} />
          <input type="hidden" name="product_add_ons" value={JSON.stringify(productAddOns)} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Left Column - Basic Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Product Name"
                    {...register('name', { required: true })}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">This field is required</p>}
                </div>

                      <div>
        <label htmlFor="product_category_id" className="block text-sm font-medium text-gray-700 mb-1">
          Select Branch
        </label>
        <Controller
          name="branch_id"
          control={control}
          rules={{ required: 'Branch is required' }}
          render={({ field }) => (
            <select
              id="branch_id"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              {...field}
            >
              <option value="">Select Branch</option>
              {branches.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.branch_name}
                </option>
              ))}
            </select>
          )}
        />
        {errors.branch_id && (
          <p className="text-red-500 text-xs mt-1">{errors.branch_id.message}</p>
        )}
      </div>

                 <div>
        <label htmlFor="product_category_id" className="block text-sm font-medium text-gray-700 mb-1">
          Select Category
        </label>
        <Controller
          name="product_category_id"
          control={control}
          rules={{ required: 'Category is required' }}
          render={({ field }) => (
            <select
              id="product_category_id"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              {...field}
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          )}
        />
        {errors.product_category_id && (
          <p className="text-red-500 text-xs mt-1">{errors.product_category_id.message}</p>
        )}
      </div>
                <div>
                  <label htmlFor="short_description" className="block text-sm font-medium text-gray-700">
                    Short Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="short_description"
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Product Short Description"
                    {...register('short_description', { required: true })}
                  />
                  {errors.short_description && <p className="mt-1 text-sm text-red-600">This field is required</p>}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="flex items-center">
                    <label htmlFor="cod_allowed" className="block text-sm font-medium text-gray-700 mr-3">
                      Is COD allowed?
                    </label>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input
                        type="checkbox"
                        id="cod_allowed"
                        name='cod_allowed'
                        checked={isCodAllowed}
                        onChange={() => setIsCodAllowed(!isCodAllowed)}
                        className="sr-only"
                      />
                      <label
                        htmlFor="cod_allowed"
                        className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                      >
                        <span
                          className={`absolute left-0 top-0 h-6 w-6 bg-blue-500 rounded-full transition-transform ${
                            isCodAllowed ? "translate-x-full" : ""
                          }`}
                        ></span>
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <label htmlFor="is_cancelable" className="block text-sm font-medium text-gray-700 mr-3">
                      Is Cancelable?
                    </label>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input
                        type="checkbox"
                        id="is_cancelable"
                        name='is_cancelable'
                        checked={isCancelable}
                        onChange={() => setIsCancelable(!isCancelable)}
                        className="sr-only"
                      />
                      <label
                        htmlFor="is_cancelable"
                        className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                      >
                        <span
                          className={`absolute left-0 top-0 h-6 w-6 bg-blue-500 rounded-full transition-transform ${
                            isCancelable ? "translate-x-full" : ""
                          }`}
                        ></span>
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <label htmlFor="is_spicy" className="block text-sm font-medium text-gray-700 mr-3">
                      Is Spicy?
                    </label>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input
                        type="checkbox"
                        name="is_spicy"
                        id="is_spicy"
                        checked={isSpicy}
                        onChange={() => setIsSpicy(!isSpicy)}
                        className="sr-only"
                      />
                      <label
                        htmlFor="is_spicy"
                        className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                      >
                        <span
                          className={`absolute left-0 top-0 h-6 w-6 bg-blue-500 rounded-full transition-transform ${
                            isSpicy ? "translate-x-full" : ""
                          }`}
                        ></span>
                      </label>
                    </div>
                  </div>
                </div>

                {isCancelable && (
                  <div>
                    <label htmlFor="cancelable_till" className="block text-sm font-medium text-gray-700">
                      Till which status? <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="cancelable_till"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      {...register('cancelable_till', { required: isCancelable })}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="preparing">Preparing</option>
                      <option value="out_for_delivery">Out For Delivery</option>
                    </select>
                    {errors.cancelable_till && <p className="mt-1 text-sm text-red-600">This field is required</p>}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Main Image <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 flex items-center">
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={() => document.getElementById('imageUpload').click()}
                    >
                      Upload
                    </button>
                    <input
                      id="imageUpload"
                      type="file"
                      name="mainImage" // Ensure the name matches the backend field
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e.target.files[0])}
                    />
                  </div>
                  {mainImage && (
                    <div className="mt-4">
                      <div className="w-32 h-32 rounded-md overflow-hidden border border-gray-200">
                        <img
                          className="w-full h-full object-cover"
                          src={URL.createObjectURL(mainImage)}
                          alt="Product preview"
                        />
                      </div>
                    </div>
                  )}
                  {errors.image && <p className="mt-1 text-sm text-red-600">Please upload an image</p>}
                </div>
              </div>
            </div>

            {/* Right Column - Additional Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h2>
              
              <div className="space-y-4">
                
              <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                Select Tags
              </label>
              <Select
                isMulti
                name="tags"
                options={tags}
                value={selectedTags}
                onChange={handleTagChange}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Choose tags..."
              />
            </div>

                <div>
                  <label htmlFor="indicator" className="block text-sm font-medium text-gray-700">
                    Indicator
                  </label>
                  <select
                    id="indicator"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    {...register('indicator')}
                  >
                    <option value="">None</option>
                    <option value="1">Veg</option>
                    <option value="2">Non-Veg</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="highlights" className="block text-sm font-medium text-gray-700">
                    Highlights
                  </label>
                  <input
                    type="text"
                    id="highlights"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Type highlights (e.g., Spicy, Sweet, Must Try)"
                    {...register('highlights')}
                  />
                </div>

                <div>
                  <label htmlFor="calories" className="block text-sm font-medium text-gray-700">
                    Calories <span className="text-xs text-gray-500">(1 kilocalorie (kcal) = 1000 calories (cal))</span>
                  </label>
                  <input
                    type="number"
                    id="calories"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    min="0"
                    placeholder="Enter calories in cal unit"
                    {...register('calories')}
                  />
                </div>

                <div>
                  <label htmlFor="total_allowed_quantity" className="block text-sm font-medium text-gray-700">
                    Total Allowed Quantity
                  </label>
                  <input
                    type="number"
                    id="total_allowed_quantity"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    min="0"
                    placeholder="Total Allowed Quantity"
                    {...register('total_allowed_quantity')}
                  />
                </div>

                <div>
                  <label htmlFor="minimum_order_quantity" className="block text-sm font-medium text-gray-700">
                    Minimum Order Quantity
                  </label>
                  <input
                    type="number"
                    id="minimum_order_quantity"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Minimum Order Quantity"
                    {...register('minimum_order_quantity')}
                  />
                </div>

                <div className="flex items-center">
                  <label htmlFor="available_time" className="block text-sm font-medium text-gray-700 mr-3">
                    Product available time?
                  </label>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      id="available_time"
                      checked={hasAvailableTime}
                      onChange={() => setHasAvailableTime(!hasAvailableTime)}
                      className="sr-only"
                    />
                    <label
                      htmlFor="available_time"
                      className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                    >
                      <span
                        className={`absolute left-0 top-0 h-6 w-6 bg-blue-500 rounded-full transition-transform ${
                          hasAvailableTime ? "translate-x-full" : ""
                        }`}
                      ></span>
                    </label>
                  </div>
                </div>

                {hasAvailableTime && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="product_start_time" className="block text-sm font-medium text-gray-700">
                        Start Time <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="time"
                        id="product_start_time"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        {...register('product_start_time', { required: hasAvailableTime })}
                      />
                      {errors.product_start_time && <p className="mt-1 text-sm text-red-600">This field is required</p>}
                    </div>
                    <div>
                      <label htmlFor="product_end_time" className="block text-sm font-medium text-gray-700">
                        End Time <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="time"
                        id="product_end_time"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        {...register('product_end_time', { required: hasAvailableTime })}
                      />
                      {errors.product_end_time && <p className="mt-1 text-sm text-red-600">This field is required</p>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Add Ons Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Product Add Ons</h2>
            
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="add_on_snaps" className="block text-sm font-medium text-gray-700">
                      Choose Add Ons
                    </label>
                    <select
                      id="add_on_snaps"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="">Select Add On</option>
                      {addOnSnaps?.map((addOn) => (
                        <option
                          key={addOn.id}
                          value={addOn.id}
                          data-price={addOn.price}
                          data-description={addOn.description}
                          data-calories={addOn.calories}
                        >
                          {addOn.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Add On Title"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Short Description
                    </label>
                    <textarea
                      id="description"
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Add Ons Short Description"
                    />
                  </div>

                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                      Price <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="price"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Add On Price"
                      min="1"
                    />
                  </div>

                  <div>
                    <label htmlFor="add_on_calories" className="block text-sm font-medium text-gray-700">
                      Calories
                    </label>
                    <input
                      type="number"
                      id="add_on_calories"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Add On Calories"
                      min="1"
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={handleAddAddOn}
                    >
                      Save Add Ons
                    </button>
                    <p className="text-sm text-red-600">
                      Click on <strong>Add Product</strong> to save the Add Ons for this product after filling remaining details.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-md font-medium text-gray-900 mb-3">
                  Saved Add Ons <span className="text-sm text-red-600">(Temporary until product is saved)</span>
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Calories</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {productAddOns.length > 0 ? (
                        productAddOns.map((addOn) => (
                          <tr key={addOn.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{addOn.title}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{addOn.description}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{addOn.price}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{addOn.calories}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <button
                                type="button"
                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                onClick={() => handleRemoveAddOn(addOn.id)}
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                            No add-ons saved yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Additional Info</h2>
            
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  type="button"
                  onClick={() => handleTabChange('general')}
                  className={`${activeTab === 'general' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  General
                </button>
                <button
                  type="button"
                  onClick={() => handleTabChange('attributes')}
                  className={`${activeTab === 'attributes' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Attributes
                </button>
                <button
                  type="button"
                  onClick={() => handleTabChange('variations')}
                  className={`${activeTab === 'variations' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} ${productType !== 'variable_product' ? 'hidden' : ''} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Variations
                </button>
              </nav>
            </div>

            <div className="mt-6">
              {/* General Tab */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div>
                    <label htmlFor="product_type" className="block text-sm font-medium text-gray-700">
                      Type Of Product:
                    </label>
                    <select
                      id="product_type"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={productType}
                      onChange={(e) => setProductType(e.target.value)}
                    >
                      <option value="">Select Type</option>
                      <option value="simple_product">Simple Product</option>
                      <option value="variable_product">Variable Product</option>
                    </select>
                  </div>

                  {productType === 'simple_product' && (
                    <>
                      <div>
                        <label htmlFor="simple_price" className="block text-sm font-medium text-gray-700">
                          Price: <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          id="simple_price"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          min="0"
                          step="0.01"
                          {...register('simple_price', { required: productType === 'simple_product' })}
                        />
                        {errors.simple_price && <p className="mt-1 text-sm text-red-600">This field is required</p>}
                      </div>
                      <div>
                        <label htmlFor="simple_special_price" className="block text-sm font-medium text-gray-700">
                          Special Price:
                        </label>
                        <input
                          type="number"
                          id="simple_special_price"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          min="0"
                          step="0.01"
                          {...register('simple_special_price')}
                        />
                      </div>
                      <div className="flex items-center">
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input
                            type="checkbox"
                            id="simple_stock_management"
                            checked={simpleStockManagement}
                            onChange={() => setSimpleStockManagement(!simpleStockManagement)}
                            className="sr-only"
                          />
                          <label
                            htmlFor="simple_stock_management"
                            className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                          >
                            <span
                              className={`absolute left-0 top-0 h-6 w-6 bg-blue-500 rounded-full transition-transform ${
                                simpleStockManagement ? "translate-x-full" : ""
                              }`}
                            ></span>
                          </label>
                        </div>
                        <label htmlFor="simple_stock_management" className="block text-sm font-medium text-gray-700">
                          Enable Stock Management
                        </label>
                      </div>

                      {simpleStockManagement && (
                        <>
                          <div>
                            <label htmlFor="product_total_stock" className="block text-sm font-medium text-gray-700">
                              Total Stock: <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              id="product_total_stock"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              {...register('product_total_stock', {
                                required: simpleStockManagement ? 'This field is required when stock management is enabled' : false,
                              })}
                            />
                            {errors.product_total_stock && <p className="mt-1 text-sm text-red-600">{errors.product_total_stock.message}</p>}
                          </div>
                          <div>
                            <label htmlFor="stock_status" className="block text-sm font-medium text-gray-700">
                              Stock Status: <span className="text-red-500">*</span>
                            </label>
                            <select
                              id="stock_status"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              {...register('stock_status', { required: simpleStockManagement })}
                            >
                              <option value="1">In Stock</option>
                              <option value="0">Out Of Stock</option>
                            </select>
                            {errors.stock_status && <p className="mt-1 text-sm text-red-600">This field is required</p>}
                          </div>
                        </>
                      )}
                    </>
                  )}

                  {productType === 'variable_product' && (
                    <>
                      <div className="flex items-center">
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input
                            type="checkbox"
                            id="variant_stock_management"
                            checked={variantStockManagement}
                            onChange={() => setVariantStockManagement(!variantStockManagement)}
                            className="sr-only toggle-checkbox"
                          />
                          <div
                            className={`block w-10 h-6 rounded-full ${variantStockManagement ? 'bg-blue-600' : 'bg-gray-300'}`}
                          ></div>
                          <div
                            className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${variantStockManagement ? 'transform translate-x-4' : ''}`}
                          ></div>
                        </div>
                        <label htmlFor="variant_stock_management" className="block text-sm font-medium text-gray-700">
                          Enable Stock Management
                        </label>
                      </div>

                      {variantStockManagement && (
                        <>
                          <div>
                            <label htmlFor="stock_level_type" className="block text-sm font-medium text-gray-700">
                              Choose Stock Management Type: <span className="text-red-500">*</span>
                            </label>
                            <select
                              id="stock_level_type"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              value={variantStockLevelType}
                              onChange={(e) => setVariantStockLevelType(e.target.value)}
                              {...register('stock_level_type', { required: variantStockManagement })}
                            >
                              <option value="">Select Stock Type</option>
                              <option value="product_level">
                                Product Level (Stock Will Be Managed Generally)
                              </option>
                            </select>
                            {errors.stock_level_type && <p className="mt-1 text-sm text-red-600">This field is required</p>}
                          </div>

                          {variantStockLevelType === 'product_level' && (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                              <div>
                                <label htmlFor="total_stock_variant_type" className="block text-sm font-medium text-gray-700">
                                  Total Stock: <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="number"
                                  id="total_stock_variant_type"
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                  {...register('total_stock_variant_type', { required: variantStockManagement })}
                                />
                                {errors.total_stock_variant_type && <p className="mt-1 text-sm text-red-600">This field is required</p>}
                              </div>
                              <div>
                                <label htmlFor="variant_status" className="block text-sm font-medium text-gray-700">
                                  Stock Status: <span className="text-red-500">*</span>
                                </label>
                                <select
                                  id="variant_status"
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                  {...register('variant_status', { required: variantStockManagement })}
                                >
                                  <option value="1">In Stock</option>
                                  <option value="0">Out Of Stock</option>
                                </select>
                                {errors.variant_status && <p className="mt-1 text-sm text-red-600">This field is required</p>}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Attributes Tab */}
              {activeTab === 'attributes' && (
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-md">
                    <div className="flex items-center">
                      <strong className="text-dark">Note: </strong>
                      <input
                        type="checkbox"
                        checked
                        className="ml-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        disabled
                      />
                      <span className="ml-3 text-sm text-gray-700">
                        check if the attribute is to be used for variation
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-1 border border-blue-500 text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Add Attributes
                    </button>
                  </div>

                  <div className="bg-gray-100 p-4 rounded-md text-center">
                    <p className="text-gray-700">No Product Attributes Are Added!</p>
                  </div>
                </div>
              )}

              {/* Variations Tab */}
              {activeTab === 'variations' && (
                <div className="space-y-6">
                  <div className="bg-gray-100 p-4 rounded-md text-center">
                    <p className="text-gray-700">No Product Variations Are Added!</p>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-6 flex space-x-3">
              <button
                type="reset"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Reset
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Product
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;