import React, { useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { FiMapPin } from 'react-icons/fi';
import 'leaflet/dist/leaflet.css';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import L from 'leaflet';
import ReactDOMServer from 'react-dom/server';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const customIcon = L.divIcon({
  html: ReactDOMServer.renderToString(<FiMapPin size={32} color="red" />),
  iconSize: [32, 32],
  className: 'custom-icon',
});

function Dashboard() {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [efficiency, setEfficiency] = useState(0.18);
  const [solarData, setSolarData] = useState(null);

  const fetchSolarData = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/estimate', {
        latitude,
        longitude,
        startDate,
        endDate,
        efficiency,
        user_id: 1, // Replace with actual user ID after implementing authentication
      });
      setSolarData(response.data);
    } catch (error) {
      console.error('Error fetching solar data:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchSolarData();
  };

  const calculateMonthlyAverage = (data) => {
    const monthlyData = {};
    for (const date in data) {
      const month = date.slice(0, 6);
      if (!monthlyData[month]) {
        monthlyData[month] = { total: 0, count: 0 };
      }
      monthlyData[month].total += data[date];
      monthlyData[month].count += 1;
    }
    const monthlyAverage = {};
    for (const month in monthlyData) {
      monthlyAverage[month] = monthlyData[month].total / monthlyData[month].count;
    }
    return monthlyAverage;
  };

  const calculateEnergyPotential = (data, area, efficiency) => {
    const energyPotential = {};
    for (const date in data) {
      const month = date.slice(0, 6);
      if (!energyPotential[month]) {
        energyPotential[month] = 0;
      }
      energyPotential[month] += data[date] * area * efficiency;
    }
    return energyPotential;
  };

  const monthlyAverage = solarData ? calculateMonthlyAverage(solarData) : {};
  const energyPotential = solarData ? calculateEnergyPotential(solarData, 500, efficiency) : {};

  const solarRadianceData = {
    labels: Object.keys(monthlyAverage),
    datasets: [
      {
        label: 'Monthly Average Solar Radiance (W/m²)',
        data: Object.values(monthlyAverage),
        backgroundColor: 'rgba(13, 136, 230, 0.5)',
      },
    ],
  };

  const energyPotentialData = {
    labels: Object.keys(energyPotential),
    datasets: [
      {
        label: 'Monthly Solar Energy Potential (Wh)',
        data: Object.values(energyPotential),
        backgroundColor: 'rgba(255, 187, 51, 0.5)',
      },
    ],
  };

  const annualEnergyPotential = Object.values(energyPotential).reduce((acc, val) => acc + val, 0);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Solar Potential Dashboard</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="number"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            placeholder="Latitude"
            className="p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="number"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            placeholder="Longitude"
            className="p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="text"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Start Date (YYYYMMDD)"
            className="p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="text"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="End Date (YYYYMMDD)"
            className="p-2 border border-gray-300 rounded"
            required
          />
          <select
            value={efficiency}
            onChange={(e) => setEfficiency(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          >
            <option value={0.15}>15%</option>
            <option value={0.18}>18%</option>
            <option value={0.20}>20%</option>
          </select>
        </div>
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
      <MapContainer center={[latitude, longitude]} zoom={13} style={{ height: '250px', marginBottom: '250px' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[latitude, longitude]} icon={customIcon} />
      </MapContainer>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold text-center mb-2">Monthly Average Solar Radiance</h2>
          <Bar data={solarRadianceData} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-center mb-2">Monthly Solar Energy Potential</h2>
          <Bar data={energyPotentialData} />
        </div>
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-semibold text-center">Annual Solar Energy Potential (Wh)</h2>
        <p className="text-center text-2xl font-bold">{annualEnergyPotential.toFixed(2)}</p>
      </div>
    </div>
  );
}

export default Dashboard;
