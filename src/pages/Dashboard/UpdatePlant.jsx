import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const UpdatePlant = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plantData, setPlantData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPlant = async () => {
      try {
        setLoading(true);
        console.log('Fetching plant with id:', id);

        const res = await fetch(`https://plant-pulse-server.vercel.app/plants/${id}`, {
          // Uncomment if your backend requires auth for GET:
          // headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });

        if (!res.ok) throw new Error('Failed to fetch plant data');

        const data = await res.json();
        console.log('Plant data fetched:', data);
        setPlantData(data);
      } catch (error) {
        toast.error('Plant not found or failed to fetch');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchPlant();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlantData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!plantData?.name) {
      toast.error('Plant name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const { _id, ...dataToUpdate } = plantData; // Remove _id before sending
      console.log('Submitting update for:', dataToUpdate);

      const res = await fetch(`https://plant-pulse-server.vercel.app/plants/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Keep auth if required
        },
        body: JSON.stringify(dataToUpdate),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update plant');
      }

      toast.success('Plant updated successfully!');
      navigate('/dashboard', { state: { updated: true } });
    } catch (error) {
      toast.error(`Update failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading plant data...</div>;
  if (!plantData) return null;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow pt-20">
      <h2 className="text-2xl font-bold mb-4 text-green-700 dark:text-lime-300 text-center">Update Plant Info</h2>
      <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">

        <input
          type="text"
          name="name"
          value={plantData.name || ''}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Plant Name"
          required
          disabled={isSubmitting}
        />

        <input
          type="text"
          name="category"
          value={plantData.category || ''}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Category"
          disabled={isSubmitting}
        />

        <input
          type="text"
          name="wateringFrequency"
          value={plantData.wateringFrequency || ''}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Watering Frequency (e.g., 3 days)"
          disabled={isSubmitting}
        />

        <select
          name="careLevel"
          value={plantData.careLevel || ''}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          disabled={isSubmitting}
        >
          <option value="">Select Care Level</option>
          <option value="Easy">Easy</option>
          <option value="Moderate">Moderate</option>
          <option value="Hard">Hard</option>
        </select>

        <input
          type="date"
          name="nextWatering"
          value={
            plantData.nextWatering && !isNaN(new Date(plantData.nextWatering))
              ? new Date(plantData.nextWatering).toISOString().split('T')[0]
              : ''
          }
          onChange={handleChange}
          className="w-full p-2 border rounded"
          disabled={isSubmitting}
        />

        <input
          type="url"
          name="image"
          value={plantData.image || ''}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Image URL (optional)"
          disabled={isSubmitting}
        />

        <textarea
          name="description"
          value={plantData.description || ''}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Plant Description"
          rows={4}
          disabled={isSubmitting}
        />

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded ${
              isSubmitting ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Updating...' : 'Update Plant'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="text-gray-600 hover:underline"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdatePlant;
