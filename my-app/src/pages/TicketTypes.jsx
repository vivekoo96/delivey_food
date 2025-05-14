import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TicketTypes = () => {
  const [ticketTypes, setTicketTypes] = useState([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    fetchTicketTypes();
  }, []);

  const fetchTicketTypes = async () => {
    try {
      const response = await axios.get('/api/ticket-types');
      setTicketTypes(response.data);
    } catch (error) {
      console.error('Error fetching ticket types:', error);
    }
  };

  const handleAddTicketType = async () => {
    if (!title) return alert('Title is required');

    try {
      await axios.post('/api/ticket-types', { title });
      setTitle('');
      fetchTicketTypes();
    } catch (error) {
      console.error('Error adding ticket type:', error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Ticket Types</h2>
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title *</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div className="flex justify-end space-x-4 mb-6">
        <button
          onClick={() => setTitle('')}
          className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
        >
          Reset
        </button>
        <button
          onClick={handleAddTicketType}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add Ticket Type
        </button>
      </div>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">ID</th>
            <th className="px-4 py-2 border-b">Title</th>
            <th className="px-4 py-2 border-b">Created At</th>
          </tr>
        </thead>
        <tbody>
          {ticketTypes.map((type) => (
            <tr key={type.id}>
              <td className="px-4 py-2 border-b text-center">{type.id}</td>
              <td className="px-4 py-2 border-b">{type.title}</td>
              <td className="px-4 py-2 border-b text-center">{new Date(type.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TicketTypes;