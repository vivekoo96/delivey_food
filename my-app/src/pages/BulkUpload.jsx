import React, { useState } from 'react';
import axios from 'axios';

const BulkUpload = () => {
  const [file, setFile] = useState(null);
  const [uploadType, setUploadType] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleTypeChange = (e) => {
    setUploadType(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !uploadType) {
      setError('Please select a file and upload type.');
      return;
    }

    const formData = new FormData();
    formData.append('uploadFile', file);
    formData.append('type', uploadType);

    try {
      const response = await axios.post('http://localhost:3000/api/products/bulk-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(response.data.message);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during upload.');
      setMessage('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Bulk Upload</h1>
      <p className="text-sm text-gray-600 mb-4">Read and follow instructions carefully while preparing data.</p>
      <ul className="list-disc list-inside mb-4 text-sm text-gray-700">
        <li>Download and save the sample file to reduce errors.</li>
        <li>For adding bulk products, the file should be in .csv format.</li>
        <li>You can copy the image path from the media section.</li>
        <li>Make sure you entered valid data as per instructions before proceeding.</li>
      </ul>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="uploadType" className="font-medium mb-1">Type [upload] *</label>
          <select id="uploadType" value={uploadType} onChange={handleTypeChange} required className="border border-gray-300 rounded-md p-2">
            <option value="">Select</option>
            <option value="simple">Simple Product</option>
            <option value="variable">Variable Product</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="file" className="font-medium mb-1">File *</label>
          <input type="file" id="file" onChange={handleFileChange} required className="border border-gray-300 rounded-md p-2" />
        </div>

        <div className="flex justify-between">
          <button type="reset" onClick={() => { setFile(null); setUploadType(''); setMessage(''); setError(''); }} className="px-4 py-2 bg-gray-500 text-white rounded-md">Reset</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Submit</button>
        </div>
      </form>

      {message && <p className="text-green-600 font-medium mt-4">{message}</p>}
      {error && <p className="text-red-600 font-medium mt-4">{error}</p>}

      <div className="mt-6 space-y-2">
        <a
          href="/downloads/simple-product-bulk-upload-sample-erestro.csv"
          download
          className="w-full block text-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Simple product bulk upload sample file
        </a>
        <a
          href="/downloads/variable-product-bulk-upload-sample-erestro.csv"
          download
          className="w-full block text-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Variable product bulk upload sample file
        </a>
        <a
          href="/downloads/bulk-upload-instructions.txt"
          download
          className="w-full block text-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Bulk upload instructions
        </a>
      </div>
    </div>
  );
};

export default BulkUpload;
