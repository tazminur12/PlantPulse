// MyPlants.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { toast } from 'react-hot-toast';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmationModal from './ConfirmationModal';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString();
  } catch {
    return 'N/A';
  }
};

const MyPlants = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [plantToDelete, setPlantToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUserPlants = useCallback(async () => {
    if (!user?.email) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://plant-pulse-server.vercel.app/plants?userEmail=${encodeURIComponent(user.email)}`);
      if (!response.ok) throw new Error(`Failed to fetch plants: ${response.status}`);
      const data = await response.json();
      setPlants(data);
    } catch (err) {
      console.error('Error loading plants:', err);
      setError(err.message);
      toast.error('Failed to load your plants');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUserPlants();
  }, [fetchUserPlants]);

  useEffect(() => {
    if (location.state?.updated) {
      toast.success('Plant updated successfully!');
    }
  }, [location]);

  const handleDelete = async () => {
    if (!plantToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`https://plant-pulse-server.vercel.app/plants/${plantToDelete}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete plant');
      }

      setPlants(prev => prev.filter(p => p._id !== plantToDelete && p.id !== plantToDelete));
      toast.success(data.message || 'Plant deleted successfully');
    } catch (err) {
      console.error('Delete error:', err);
      toast.error(err.message || 'Error deleting plant');
      await fetchUserPlants();
    } finally {
      setIsDeleting(false);
      setShowModal(false);
      setPlantToDelete(null);
    }
  };

  
  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-green-800 dark:text-green-200">
          My Plants
        </h1>
        <Link
          to="/add-plant"
          className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          aria-label="Add new plant"
        >
          <FaPlus className="mr-2" />
          Add New Plant
        </Link>
      </div>

      {error ? (
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <button 
            onClick={fetchUserPlants}
            className="text-green-600 dark:text-green-400 hover:underline"
          >
            Retry
          </button>
        </div>
      ) : plants.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
            You haven't added any plants yet.
          </p>
          <Link
            to="/add-plant"
            className="inline-flex items-center text-green-600 dark:text-green-400 hover:underline"
          >
            <FaPlus className="mr-1" /> Add your first plant
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="min-w-full bg-white dark:bg-gray-800">
            <thead className="bg-green-600 dark:bg-green-800 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Image</th>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Category</th>
                <th className="py-3 px-4 text-left">Care Level</th>
                <th className="py-3 px-4 text-left">Next Watering</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {plants.map((plant) => {
                const plantId = plant._id || plant.id;
                return (
                  <tr key={plantId} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="py-4 px-4">
                      <img 
                        src={plant.image || '/default-plant.png'} 
                        alt={plant.name || 'Plant'} 
                        className="w-12 h-12 object-cover rounded"
                        loading="lazy"
                      />
                    </td>
                    <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">
                      {plant.name || 'Unnamed'}
                    </td>
                    <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                      {plant.category || 'N/A'}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        plant.careLevel === 'Low' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : plant.careLevel === 'Moderate' 
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {plant.careLevel || 'Unknown'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                      {formatDate(plant.nextWatering)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <Link
                          to={`/update-plant/${plantId}`}
                          className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                          aria-label={`Edit ${plant.name || 'plant'}`}
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPlantToDelete(plantId);
                            setShowModal(true);
                          }}
                          className={`p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors ${
                            isDeleting ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          aria-label={`Delete ${plant.name || 'plant'}`}
                          disabled={isDeleting}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDelete}
        title="Delete Plant"
        message="Are you sure you want to delete this plant? This action cannot be undone."
        confirmText={isDeleting ? 'Deleting...' : 'Delete'}
        isConfirming={isDeleting}
      />
    </div>
  );
};

export default MyPlants;
