import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AllBranches = () => {
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/branches');
        setBranches(res.data.data);
      } catch (err) {
        console.error('Failed to fetch branches:', err);
      }
    };

    fetchBranches();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">All Branches</h1>
      <div className="bg-white p-8 rounded-lg shadow-md">
        {branches.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {branches.map((branch) => (
                <tr key={branch.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{branch.branch_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{branch.city_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{branch.address}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{branch.contact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No branches found.</p>
        )}
      </div>
    </div>
  );
};

export default AllBranches;
