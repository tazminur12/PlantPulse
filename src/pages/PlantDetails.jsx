import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FaLeaf,
  FaTint,
  FaCalendarAlt,
  FaHeartbeat,
  FaArrowLeft
} from 'react-icons/fa';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-hot-toast';

const PlantDetails = () => {
  const { id } = useParams();
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlant = async () => {
      try {
        const res = await fetch(`https://plant-pulse-server.vercel.app/plants/${id}`);
        if (!res.ok) {
          throw new Error('Plant not found');
        }
        const data = await res.json();
        setPlant(data);
      } catch (error) {
        console.error('Error fetching plant:', error);
        toast.error('Failed to load plant details');
      } finally {
        setLoading(false);
      }
    };

    fetchPlant();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const parsedDate = new Date(dateString);
    return isNaN(parsedDate)
      ? 'Invalid date'
      : parsedDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
  };

  if (loading) {
    return <LoadingSpinner message="Loading plant details..." fullscreen={true} />;
  }

  if (!plant) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold text-red-500 mb-4">Plant Not Found</h2>
        <Link to="/" className="inline-flex items-center text-green-600 hover:underline">
          <FaArrowLeft className="mr-2" /> Back to Plants
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link
        to="/"
        className="inline-flex items-center mb-6 text-green-600 dark:text-green-400 hover:underline"
      >
        <FaArrowLeft className="mr-2" /> Back to Plants
      </Link>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            <img
              src={plant.image || '/default-plant.jpg'}
              alt={plant.name || 'Plant'}
              className="w-full h-64 md:h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/default-plant.jpg';
              }}
              loading="lazy"
            />
          </div>

          <div className="p-6 md:p-8 md:w-1/2">
            <h1 className="text-3xl font-bold text-green-700 dark:text-green-300 mb-4">
              {plant.name || 'Unnamed Plant'}
            </h1>

            <div className="flex flex-wrap gap-2 mb-6">
              {plant.category && (
                <span className="badge bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                  <FaLeaf className="inline mr-1" /> {plant.category}
                </span>
              )}
              {plant.careLevel && (
                <span className="badge bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
                  ⭐ {plant.careLevel}
                </span>
              )}
              {plant.healthStatus && (
                <span className="badge bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                  <FaHeartbeat className="inline mr-1" /> {plant.healthStatus}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
                  <FaTint className="inline mr-2" /> Watering Frequency
                </h3>
                <p className="text-gray-800 dark:text-gray-200">
                  {plant.wateringFrequency || 'Not specified'}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
                  <FaCalendarAlt className="inline mr-2" /> Last Watered
                </h3>
                <p className="text-gray-800 dark:text-gray-200">
                  {formatDate(plant.lastWatered)}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
                  <FaCalendarAlt className="inline mr-2" /> Next Watering
                </h3>
                <p className="text-gray-800 dark:text-gray-200">
                  {formatDate(plant.nextWatering)}
                </p>
              </div>
            </div>

            {plant.description && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Description
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {plant.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantDetails;
