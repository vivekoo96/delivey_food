// src/AddCityForm.jsx
import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../components/layout/Asidebar';
import axios from 'axios';
import {
  GoogleMap,
  LoadScript,
  StandaloneSearchBox,
  Marker,
} from '@react-google-maps/api';
import ReactPaginate from 'react-paginate';

const libraries = ['places'];
const mapContainerStyle = {
  width: '100%',
  height: '300px',
};

const defaultCenter = {
  lat: 23.0225,
  lng: 72.5714,
};

const Location = () => {
  const [center, setCenter] = useState(defaultCenter);
  const [marker, setMarker] = useState(defaultCenter);
  const [formData, setFormData] = useState({
    latitude: '',
    longitude: '',
    cityName: '',
    minOrderAmount: '',
    timeToTravel: '',
    maxDistance: '',
    relatedCities: '',
    chargeMethod: '',
    fixedCharge: '',
    perKmCharge: '',
    rangeWiseCharges: '',
    geolocationType: '',
    radius: '',
    boundaryPoints: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [errors, setErrors] = useState({});
  const [cities, setCities] = useState([]); // State to store added cities
  const [alert, setAlert] = useState(null); // State to manage alert messages
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  const searchBoxRef = useRef();

  const validateForm = () => {
    const errors = {};

    if (!formData.cityName) {
      errors.cityName = 'City Name is required';
    }
    if (!formData.latitude) {
      errors.latitude = 'Latitude is required';
    }
    if (!formData.longitude) {
      errors.longitude = 'Longitude is required';
    }
    if (!formData.minOrderAmount) {
      errors.minOrderAmount = 'Minimum Order Amount is required';
    } else if (isNaN(formData.minOrderAmount)) {
      errors.minOrderAmount = 'Minimum Order Amount must be a number';
    }
    if (!formData.timeToTravel) {
      errors.timeToTravel = 'Time to Travel is required';
    } else if (isNaN(formData.timeToTravel)) {
      errors.timeToTravel = 'Time to Travel must be a number';
    }
    if (!formData.maxDistance) {
      errors.maxDistance = 'Maximum Deliverable Distance is required';
    } else if (isNaN(formData.maxDistance)) {
      errors.maxDistance = 'Maximum Deliverable Distance must be a number';
    }
    if (!formData.chargeMethod) {
      errors.chargeMethod = 'Delivery Charge Method is required';
    }
    if (!formData.fixedCharge) {
      errors.fixedCharge = 'Fixed Charge is required';
    } else if (isNaN(formData.fixedCharge)) {
      errors.fixedCharge = 'Fixed Charge must be a number';
    }
    if (!formData.perKmCharge) {
      errors.perKmCharge = 'Per Km Charge is required';
    } else if (isNaN(formData.perKmCharge)) {
      errors.perKmCharge = 'Per Km Charge must be a number';
    }
    if (!formData.radius) {
      errors.radius = 'Radius is required';
    } else if (isNaN(formData.radius)) {
      errors.radius = 'Radius must be a number';
    }

    return errors;
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
      cityName: place.formatted_address || place.name,
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const res = await axios.post('http://localhost:3000/api/cities', formData);
      setAlert({ type: 'success', message: 'City added successfully!' });
      setCities([...cities, res.data]); // Add the new city to the table
      setFormData({
        latitude: '',
        longitude: '',
        cityName: '',
        minOrderAmount: '',
        timeToTravel: '',
        maxDistance: '',
        relatedCities: '',
        chargeMethod: '',
        fixedCharge: '',
        perKmCharge: '',
        rangeWiseCharges: '',
        geolocationType: '',
        radius: '',
        boundaryPoints: '',
      });
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to add city.' });
      console.error(err);
    }
  };

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const paginatedCities = cities.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/cities');
        setCities(res.data.data); // Assuming the API response has a `data` field containing cities
      } catch (err) {
        console.error('Failed to fetch cities:', err);
      }
    };

    fetchCities();
  }, []);

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={libraries}
    >
      {alert && (
        <div
          className={`p-4 mb-4 text-sm rounded-lg ${
            alert.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {alert.message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="mt-6 space-y-6 bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-700">Search City</h2>
        <p className="text-sm text-gray-500 mb-4">Search your city where you will deliver the food and to find co-ordinates.</p>
        <div>
          <StandaloneSearchBox
            onLoad={(ref) => (searchBoxRef.current = ref)}
            onPlacesChanged={onPlacesChanged}
          >
            <div>
              <input
                type="text"
                name="cityName"
                value={formData.cityName}
                placeholder="Enter a location"
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
              />
              {formErrors.cityName && <p className="text-red-500 text-sm mt-1">{formErrors.cityName}</p>}
            </div>
          </StandaloneSearchBox>
        </div>

        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={13}
          className="rounded-lg overflow-hidden"
        >
          <Marker position={marker} />
        </GoogleMap>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Latitude *</label>
            <input
              name="latitude"
              value={formData.latitude}
              placeholder="Latitude"
              readOnly
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
            />
            {formErrors.latitude && <p className="text-red-500 text-sm mt-1">{formErrors.latitude}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Longitude *</label>
            <input
              name="longitude"
              value={formData.longitude}
              placeholder="Longitude"
              readOnly
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
            />
            {formErrors.longitude && <p className="text-red-500 text-sm mt-1">{formErrors.longitude}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Time to travel 1 (km) *</label>
            <input
              name="timeToTravel"
              value={formData.timeToTravel}
              placeholder="Enter in minutes"
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
            />
            {formErrors.timeToTravel && <p className="text-red-500 text-sm mt-1">{formErrors.timeToTravel}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Min order amount for free delivery *</label>
            <input
              name="minOrderAmount"
              value={formData.minOrderAmount}
              placeholder="Enter amount"
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
            />
            {formErrors.minOrderAmount && <p className="text-red-500 text-sm mt-1">{formErrors.minOrderAmount}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Maximum Deliverable Distance *</label>
            <input
              name="maxDistance"
              value={formData.maxDistance}
              placeholder="Enter Deliverable Maximum Distance in km"
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
            />
            {formErrors.maxDistance && <p className="text-red-500 text-sm mt-1">{formErrors.maxDistance}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Related Deliverable Cities</label>
            <input
              name="relatedCities"
              value={formData.relatedCities}
              placeholder="Search for city"
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Delivery Charge Methods *</label>
          <select
            name="chargeMethod"
            value={formData.chargeMethod}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
          >
            <option value="">Select Method</option>
            <option value="flat">Flat</option>
            <option value="per_km">Per km</option>
          </select>
          {formErrors.chargeMethod && <p className="text-red-500 text-sm mt-1">{formErrors.chargeMethod}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Fixed Charge *</label>
            <input
              name="fixedCharge"
              value={formData.fixedCharge}
              placeholder="Enter fixed charge"
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
            />
            {formErrors.fixedCharge && <p className="text-red-500 text-sm mt-1">{formErrors.fixedCharge}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Per Km Charge *</label>
            <input
              name="perKmCharge"
              value={formData.perKmCharge}
              placeholder="Enter per km charge"
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
            />
            {formErrors.perKmCharge && <p className="text-red-500 text-sm mt-1">{formErrors.perKmCharge}</p>}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Range Wise Charges</label>
          <textarea
            name="rangeWiseCharges"
            value={formData.rangeWiseCharges}
            placeholder="Enter range wise charges"
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
          ></textarea>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Geolocation Type</label>
            <input
              name="geolocationType"
              value={formData.geolocationType}
              placeholder="Enter geolocation type"
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Radius *</label>
            <input
              name="radius"
              value={formData.radius}
              placeholder="Enter radius"
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
            />
            {formErrors.radius && <p className="text-red-500 text-sm mt-1">{formErrors.radius}</p>}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Boundary Points</label>
          <textarea
            name="boundaryPoints"
            value={formData.boundaryPoints}
            placeholder="Enter boundary points"
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
          ></textarea>
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
            Submit
          </button>
        </div>
      </form>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Added Cities</h2>
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">City Name</th>
              <th className="px-4 py-2 border-b">Min Order Amount</th>
              <th className="px-4 py-2 border-b">Max Distance</th>
              <th className="px-4 py-2 border-b">Charge Method</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCities.map((city, index) => (
              <tr key={index}>
                <td className="px-4 py-2 border-b">{city.name}</td>
                <td className="px-4 py-2 border-b">{city.min_order_amount_for_free_delivery}</td>
                <td className="px-4 py-2 border-b">{city.max_deliverable_distance}</td>
                <td className="px-4 py-2 border-b">{city.delivery_charge_method}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          pageCount={Math.ceil(cities.length / itemsPerPage)}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          activeClassName={"active"}
          className="flex justify-center mt-4 space-x-2"
          pageClassName="px-3 py-1 border rounded-md text-gray-700 hover:bg-gray-200"
          activeLinkClassName="bg-indigo-500 text-white"
        />
      </div>
    </LoadScript>
  );
};

export default Location;
