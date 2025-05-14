import React, { useState, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, StandaloneSearchBox } from '@react-google-maps/api';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const libraries = ['places'];
const mapContainerStyle = {
  width: '100%',
  height: '300px',
};
const defaultCenter = {
  lat: 23.0225,
  lng: 72.5714,
};

const Branch = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    branch_name: '',
    description: '',
    address: '',
    city_id: '',
    latitude: '',
    longitude: '',
    email: '',
    contact: '',
    image: '',
    status: 1,
    self_pickup: 0,
    deliver_orders: 0,
    default_branch: 0,
    global_branch_time: 1,
  });
  const [center, setCenter] = useState(defaultCenter);
  const [marker, setMarker] = useState(defaultCenter);
  const [cities, setCities] = useState([]);
  const searchBoxRef = useRef();

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/cities');
        setCities(res.data.data);
      } catch (err) {
        console.error('Failed to fetch cities:', err);
      }
    };

    fetchCities();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked ? 1 : 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const onPlacesChanged = () => {
    const places = searchBoxRef.current.getPlaces();
    if (places.length === 0) return;

    const place = places[0];
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();

    setCenter({ lat, lng });
    setMarker({ lat, lng });

    setFormData({
      ...formData,
      latitude: lat,
      longitude: lng,
      branch_name: place.name || '',
      address: place.formatted_address || '',
    });
  };

  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    setCenter({ lat, lng });
    setMarker({ lat, lng });

    setFormData({
      ...formData,
      latitude: lat,
      longitude: lng,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Transform formData into timings array
    const timings = [
      'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
    ].map((day) => ({
      day,
      opening_time: formData[`${day.toLowerCase()}_from`] || null,
      closing_time: formData[`${day.toLowerCase()}_to`] || null,
      is_open: formData[`${day.toLowerCase()}_open`] || false,
    }));

    const payload = {
      ...formData,
      timings,
    };

    try {
      const response = await api.post('/branches', payload);
      console.log('Branch added successfully:', response.data);
      alert('Branch added successfully!');

      // Reset form data
      setFormData({
        branch_name: '',
        description: '',
        address: '',
        city_id: '',
        latitude: '',
        longitude: '',
        email: '',
        contact: '',
        image: '',
        status: 1,
        self_pickup: 0,
        deliver_orders: 0,
        default_branch: 0,
        global_branch_time: 1,
      });
      setCenter(defaultCenter);
      setMarker(defaultCenter);
    } catch (error) {
      console.error('Failed to add branch:', error);
      alert('Failed to add branch. Please try again.');
    }
  };

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={libraries}
    >
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600">Add Branch</h1>
          <button
            onClick={() => navigate('/admin/all-branches')}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            View All Branches
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6 bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">Search Location</h2>
          <p className="text-sm text-gray-500 mb-4">Search your branch location to find coordinates.</p>
          <div>
            <StandaloneSearchBox
              onLoad={(ref) => (searchBoxRef.current = ref)}
              onPlacesChanged={onPlacesChanged}
            >
              <input
                type="text"
                placeholder="Enter a location"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 z-50"
              />
            </StandaloneSearchBox>
          </div>

          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={13}
            onClick={handleMapClick}
            className="rounded-lg overflow-hidden"
          >
            <Marker position={marker} />
          </GoogleMap>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Branch Name *</label>
              <input
                name="branch_name"
                value={formData.branch_name}
                onChange={handleChange}
                placeholder="Branch Name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
              ></textarea>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Address *</label>
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email *</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact *</label>
              <input
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="Contact"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">City *</label>
              <select
                name="city_id"
                value={formData.city_id}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
              <input
                type="checkbox"
                name="default_branch"
                checked={formData.default_branch === 1}
                onChange={handleChange}
                className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-sm font-medium text-gray-700">Set Default</span>
            </label>
            <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
              <input
                type="checkbox"
                name="self_pickup"
                checked={formData.self_pickup === 1}
                onChange={handleChange}
                className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-sm font-medium text-gray-700">Self Pickup</span>
            </label>
            <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
              <input
                type="checkbox"
                name="deliver_orders"
                checked={formData.deliver_orders === 1}
                onChange={handleChange}
                className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-sm font-medium text-gray-700">Deliver Orders</span>
            </label>
            <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
              <input
                type="checkbox"
                name="global_branch_time"
                checked={formData.global_branch_time === 1}
                onChange={handleChange}
                className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-sm font-medium text-gray-700">Global Branch Time</span>
            </label>
          </div>

          <div>
            <h2 className="text-lg font-medium text-gray-700">Working Days *</h2>
            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => (
              <div key={index} className="flex items-center gap-4 mb-2">
                <span className="capitalize w-20 text-gray-600 text-sm">{day}:</span>
                <input
                  type="time"
                  name={`${day.toLowerCase()}_from`}
                  value={formData[`${day.toLowerCase()}_from`] || ''}
                  onChange={(e) => setFormData({ ...formData, [`${day.toLowerCase()}_from`]: e.target.value })}
                  className="p-2 border border-blue-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  disabled={!formData[`${day.toLowerCase()}_open`]}
                />
                <input
                  type="time"
                  name={`${day.toLowerCase()}_to`}
                  value={formData[`${day.toLowerCase()}_to`] || ''}
                  onChange={(e) => setFormData({ ...formData, [`${day.toLowerCase()}_to`]: e.target.value })}
                  className="p-2 border border-blue-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  disabled={!formData[`${day.toLowerCase()}_open`]}
                />
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name={`${day.toLowerCase()}_open`}
                    checked={formData[`${day.toLowerCase()}_open`] || false}
                    onChange={(e) => setFormData({ ...formData, [`${day.toLowerCase()}_open`]: e.target.checked })}
                    className="h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600">Open</span>
                </label>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="reset"
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Reset
            </button>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Branch
            </button>
          </div>
        </form>
      </div>
    </LoadScript>
  );
};

export default Branch;
