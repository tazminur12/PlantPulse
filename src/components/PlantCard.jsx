import React from 'react';
import { Link } from 'react-router-dom';
import { FaWater, FaSun, FaSeedling } from 'react-icons/fa';

const PlantCard = ({ plant }) => {
  console.log(plant);
  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
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
                Water every {plant.wateringFrequency}
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
  );
};

export default PlantCard;
