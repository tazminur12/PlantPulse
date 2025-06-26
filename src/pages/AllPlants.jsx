import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { toast } from 'react-hot-toast';
import { FaSearch, FaSort, FaWater, FaSun, FaSeedling } from 'react-icons/fa';
import LoadingSpinner from '../components/LoadingSpinner';

const AllPlants = () => {
  const { user } = useAuth();
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await fetch('https://plant-pulse-server.vercel.app/plants');
        if (!response.ok) {
          throw new Error(`Error fetching plants: ${response.statusText}`);
        }
        const data = await response.json();
        setPlants(data);
      } catch (error) {
        toast.error('Failed to load plants from server');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();
  }, []);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const sortedPlants = [...plants].sort((a, b) => {
    if (sortBy === 'name') {
      return sortOrder === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
    if (sortBy === 'careLevel') {
      const levels = { Easy: 1, Moderate: 2, Difficult: 3 };
      return sortOrder === 'asc'
        ? levels[a.careLevel] - levels[b.careLevel]
        : levels[b.careLevel] - levels[a.careLevel];
    }
    if (sortBy === 'nextWatering') {
      return sortOrder === 'asc'
        ? new Date(a.nextWatering) - new Date(b.nextWatering)
        : new Date(b.nextWatering) - new Date(a.nextWatering);
    }
    return 0;
  });

  const filteredPlants = sortedPlants.filter((plant) =>
    plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plant.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-800 dark:text-lime-300">
          Plant Library
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Browse our collection of plants and find your perfect green companion
        </p>
      </div>

      {/* Search and Sort */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search plants by name or category..."
            className="pl-10 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-700 dark:text-gray-300">Sort by:</span>
          <select
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
            value={sortBy}
            onChange={(e) => handleSort(e.target.value)}
          >
            <option value="name">Name</option>
            <option value="careLevel">Care Level</option>
            <option value="nextWatering">Next Watering</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            <FaSort className={sortOrder === 'asc' ? 'transform rotate-180' : ''} />
          </button>
        </div>
      </div>

      {/* Plants Grid */}
      {filteredPlants.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium text-gray-600 dark:text-gray-400">
            No plants found matching your search
          </h2>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPlants.map((plant) => (
            <div
              key={plant._id}
              className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Plant Image */}
              <div className="h-48 bg-gray-100 dark:bg-gray-600 overflow-hidden">
                <img
                  src={plant.image || '/default-plant.jpg'}
                  alt={`Image of ${plant.name || 'Unnamed Plant'}`}
                  title={plant.name || 'Unnamed Plant'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/default-plant.jpg';
                  }}
                />
              </div>

              {/* Plant Info */}
              <div className="p-4">
                {/* Name */}
                <h3 className="text-xl font-semibold text-green-800 dark:text-lime-300 mb-2 truncate">
                  {plant.name || 'Unnamed Plant'}
                </h3>

                {/* Category Badge */}
                {plant.category && (
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-2">
                    <span className="bg-green-100 dark:bg-gray-600 text-green-800 dark:text-green-300 px-2 py-1 rounded-full text-xs">
                      {plant.category}
                    </span>
                  </div>
                )}

                {/* Plant Meta Info */}
                <div className="space-y-2 text-sm">
                  {plant.wateringFrequency && (
                    <div className="flex items-center">
                      <FaWater className="text-blue-500 mr-2" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Water every {plant.wateringFrequency} days
                      </span>
                    </div>
                  )}

                  {plant.careLevel && (
                    <div className="flex items-center">
                      <FaSun className="text-yellow-500 mr-2" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {plant.careLevel} care
                      </span>
                    </div>
                  )}

                  <div className="flex items-center">
                    <FaSeedling className="text-green-500 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Next watering:{' '}
                      {plant.nextWatering
                        ? new Date(plant.nextWatering).toLocaleDateString()
                        : 'N/A'}
                    </span>
                  </div>
                </div>

                {/* View Details Link */}
                <Link
                  to={`/plants/${plant._id}`}
                  className="inline-block mt-4 text-green-600 dark:text-green-400 hover:underline text-sm font-medium"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllPlants;