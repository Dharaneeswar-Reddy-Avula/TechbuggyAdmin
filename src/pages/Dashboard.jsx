import React, { useState, useEffect } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

// Card Component
const Card = ({ title, number, subText, percentage }) => {
  return (
    <div className="shadow-md bg-white rounded-lg p-4 flex flex-col justify-center items-center text-center w-full">
      <h3 className="text-blue-500 text-lg font-medium">{title}</h3>
      <p className="text-2xl font-bold text-blue-600">{number}</p>
      <p className="text-gray-500 mt-2">{subText}</p>
      <p className={`text-sm ${percentage > 0 ? 'text-green-500' : 'text-red-500'}`}>
        {percentage}% {percentage > 0 ? '↑' : '↓'}
      </p>
    </div>
  );
};

// Circle Component (unused)
const Circle = ({ id, percentage }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center justify-center w-[130px] sm:w-[150px]">
      <div className="relative w-16 h-16 sm:w-20 sm:h-20">
        <div
          className="absolute inset-0 rounded-full"
          style={{ background: `conic-gradient(#10027E ${percentage}%, #e5e5e5 ${percentage}%)` }}
        ></div>
        <div className="absolute inset-1 bg-white rounded-full"></div>
        <div className="absolute inset-0 flex items-center justify-center text-[#10027E] text-sm sm:text-lg font-bold">
          {percentage}%
        </div>
      </div>
      <div className="mt-4 text-sm sm:text-base font-semibold text-[#10027E]">Test {id}</div>
    </div>
  );
};

const Dashboard = () => {
  const [timeframe, setTimeframe] = useState('Monthly');
  const [cardData, setCardData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const cardResponse = await axios.get('https://backteg.onrender.com/api/dashboard/cards');
        setCardData(cardResponse.data);
        const chartResponse = await axios.get(`https://backteg.onrender.com/api/dashboard/chart/${timeframe}`);
        setChartData(chartResponse.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load dashboard data');
        console.error('Error fetching data:', err.response?.data, err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [timeframe]);

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6 lg:w-full">
      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cardData.map((item, index) => (
              <Card
                key={index}
                title={item.title}
                number={item.number}
                subText={item.subText}
                percentage={parseFloat(item.percentage)}
              />
            ))}
          </div>
          <div className="bg-white shadow-lg rounded-lg p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
              <h2 className="text-xl font-bold">Test Progress Overview</h2>
              <select
                className="border border-gray-300 rounded-md p-2"
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
              >
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
                <option value="Weekly">Weekly</option>
              </select>
            </div>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 20, right: 30, bottom: 20, left: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="registrations" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;