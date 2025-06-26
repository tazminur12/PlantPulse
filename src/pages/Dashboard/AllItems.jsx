import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import { toast } from 'react-hot-toast';
import { FaSearch, FaPlus, FaSort, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import LoadingSpinner from '../../components/LoadingSpinner';
import ConfirmationModal from '../ConfirmationModal'; // If you have a modal

const AllItems = () => {
  const { user } = useAuth();
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await fetch('https://plant-pulse-server.vercel.app/plants');
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const data = await response.json();
        setPlants(data);
      } catch (error) {
        toast.error('Failed to load plants');
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

  const handleDelete = async () => {
    if (!deleteId) return;

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("You are not authenticated.");
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`https://plant-pulse-server.vercel.app/plants/${deleteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Delete failed');

      toast.success('Plant deleted');
      setPlants(prev => prev.filter(p => p._id !== deleteId));
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setDeleteId(null);
      setIsDeleting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-green-800 dark:text-lime-300 mb-4 md:mb-0">
          All Plants
        </h1>
        {user && (
          <Link
            to="/dashboard/add"
            className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <FaPlus className="mr-2" />
            Add New Plant
          </Link>
        )}
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

      {/* Table */}
      {filteredPlants.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium text-gray-600 dark:text-gray-400">
            No plants found matching your search
          </h2>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
            <thead className="bg-green-600 dark:bg-green-800 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Image</th>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Category</th>
                <th className="py-3 px-4 text-left">Watering Frequency</th>
                <th className="py-3 px-4 text-left">Care Level</th>
                <th className="py-3 px-4 text-left">Next Watering</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredPlants.map((plant) => (
                <tr key={plant._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-4 px-4">
                    <img
                      src={plant.image}
                      alt={plant.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">
                    {plant.name}
                  </td>
                  <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                    {plant.category}
                  </td>
                  <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                    Every {plant.wateringFrequency} days
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      plant.careLevel === 'Easy'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : plant.careLevel === 'Moderate'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {plant.careLevel}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                    {new Date(plant.nextWatering).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <Link
                        to={`/plants/${plant._id}`}
                        className="p-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                        title="View Details"
                      >
                        <FaEye />
                      </Link>
                      {user?.email === plant.userEmail && (
                        <>
                          <Link
                            to={`/dashboard/update-plants/${plant._id}`}
                            className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            title="Edit"
                          >
                            <FaEdit />
                          </Link>
                          <button
                            onClick={() => setDeleteId(plant._id)}
                            className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            title="Delete"
                            disabled={isDeleting}
                          >
                            <FaTrash />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Optional Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deleteId}
        title="Delete Plant"
        message="Are you sure you want to delete this plant? This action is irreversible."
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        confirmText={isDeleting ? 'Deleting...' : 'Delete'}
        isConfirming={isDeleting}
      />
    </div>
  );
};

export default AllItems;
