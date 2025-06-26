import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DashboardHome = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        setLoading(true);
        // সব প্ল্যান্টের ডাটা নিয়ে আসুন (userEmail অনুযায়ী filter নাই)
        const response = await axios.get('https://plant-pulse-server.vercel.app/plants');
        setPlants(response.data);
      } catch (error) {
        console.error('Error fetching plants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();
  }, []);

  if (loading) return <p>Loading plants...</p>;
  if (plants.length === 0) return <p>No plants found.</p>;

  // Summary counts
  const totalPlants = plants.length;

  // যতগুলো প্ল্যান্টের nextWatering তারিখ আজ বা তার আগে, তা Pending Watering
  const pendingWatering = plants.filter(p => {
    if (!p.nextWatering) return false;
    const nextDate = new Date(p.nextWatering);
    return nextDate <= new Date();
  }).length;

  return (
    <div>
      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-green-100 p-6 rounded-xl shadow text-center">
          <h2 className="text-lg font-semibold">Total Plants</h2>
          <p className="text-3xl font-bold text-green-800">{totalPlants}</p>
        </div>
        <div className="bg-blue-100 p-6 rounded-xl shadow text-center">
          <h2 className="text-lg font-semibold">All Plants</h2>
          <p className="text-3xl font-bold text-blue-800">{totalPlants}</p>
        </div>
        <div className="bg-yellow-100 p-6 rounded-xl shadow text-center">
          <h2 className="text-lg font-semibold">Pending Watering</h2>
          <p className="text-3xl font-bold text-yellow-800">{pendingWatering}</p>
        </div>
      </div>

      {/* Plant Details List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plants.map(plant => (
          <div key={plant._id} className="bg-white dark:bg-gray-700 rounded-lg shadow p-4">
            <img
              src={plant.image || '/default-plant.jpg'}
              alt={plant.name}
              className="w-full h-48 object-cover rounded mb-4"
              onError={e => (e.target.src = '/default-plant.jpg')}
            />
            <h3 className="text-xl font-semibold mb-2 text-green-800 dark:text-lime-300">{plant.name}</h3>
            <p className="mb-1"><strong>Category:</strong> {plant.category}</p>
            <p className="mb-1"><strong>Description:</strong> {plant.description}</p>
            <p className="mb-1"><strong>Care Level:</strong> {plant.careLevel}</p>
            <p className="mb-1"><strong>Watering Frequency:</strong> {plant.wateringFrequency}</p>
            <p className="mb-1"><strong>Last Watered:</strong> {new Date(plant.lastWatered).toLocaleDateString()}</p>
            <p className="mb-1"><strong>Next Watering:</strong> {new Date(plant.nextWatering).toLocaleDateString()}</p>
            <p className="mb-1"><strong>Sunlight:</strong> {plant.sunlight}</p>
            <p className="mb-1"><strong>Health Status:</strong> {plant.healthStatus}</p>
            <p className="mb-1"><strong>User:</strong> {plant.userName} ({plant.userEmail})</p>
            <p className="mb-1"><strong>Care Tips:</strong> {plant.careTips}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardHome;
