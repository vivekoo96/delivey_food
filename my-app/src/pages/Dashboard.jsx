import React, { useEffect, useState } from 'react';
import axios from 'axios';
import InfoCard from '../components/InfoCard';
import ChartSection from '../components/ChartSection';
import EarningsCard from '../components/EarningsCard';

const Dashboard = () => {
  const [adminData, setAdminData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/admin', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdminData(response.data);
      } catch {
        setError('Failed to fetch admin data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex-1 transition-all duration-300">
      {/* Toggle button */}
    

      <main className="p-6 bg-gray-100 min-h-screen">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <div className="p-6 bg-gray-100 min-h-screen">
              {/* Top Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <InfoCard title="Orders" value="0" type="orders" color="bg-yellow-500" />
                <InfoCard title="New Signups" value="0" type="signups" color="bg-blue-600" />
                <InfoCard title="Riders" value="0" type="riders" color="bg-green-600" />
                <InfoCard title="Branches" value="1" type="branches" color="bg-red-600" />
              </div>

              {/* Charts */}
              <ChartSection />

              {/* Alerts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-gray-800 text-yellow-400 p-4 rounded-lg">
                  <p className="font-semibold">0 Product(s) sold out!</p>
                  <a href="#" className="text-white text-sm">More info →</a>
                </div>
                <div className="bg-gray-800 text-orange-400 p-4 rounded-lg">
                  <p className="font-semibold">0 Product(s) low in stock! (Low stock limit 1)</p>
                  <a href="#" className="text-white text-sm">More info →</a>
                </div>
              </div>

              {/* Earnings */}
              <div className="flex flex-wrap gap-4 mt-4">
                <EarningsCard label="Overall Earnings" amount="0.00" />
                <EarningsCard label="TESTING Branch Earnings" amount="0.00" />
                <EarningsCard label="Top Earning Branch" amount="-" />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
