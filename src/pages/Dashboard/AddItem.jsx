import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthProvider";


const AddItem = () => {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const [plantData, setPlantData] = useState({
    name: "",
    category: "",
    description: "",
    image: "",
    careLevel: "",
    wateringFrequency: "",
    lastWatered: "",
    nextWatering: "",
    sunlight: "",
    healthStatus: "",
    userEmail: "",
    userName: "",
    careTips: "",
  });

  useEffect(() => {
    if (user) {
      setPlantData((prev) => ({
        ...prev,
        userEmail: user.email || "",
        userName: user.displayName || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setPlantData({
      ...plantData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("https://plant-pulse-server.vercel.app/plants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(plantData),
      });

      if (response.ok) {
        Swal.fire({
          title: "🌱 Success!",
          text: "Plant added successfully!",
          icon: "success",
          confirmButtonColor: "#16a34a",
        });

        setPlantData({
          name: "",
          category: "",
          description: "",
          image: "",
          careLevel: "",
          wateringFrequency: "",
          lastWatered: "",
          nextWatering: "",
          sunlight: "",
          healthStatus: "",
          userEmail: user?.email || "",
          userName: user?.displayName || "",
          careTips: "",
        });
      } else {
        const err = await response.json();
        Swal.fire({
          title: "❌ Error!",
          text: err.message || "Something went wrong.",
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "❌ Error!",
        text: error.message,
        icon: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-24 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center text-green-700 dark:text-lime-300">
        Add a New Plant
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <input
          type="text"
          name="name"
          value={plantData.name}
          onChange={handleChange}
          placeholder="Plant Name"
          className="w-full p-2 border rounded"
          required
        />

        {/* Category */}
        <select
          name="category"
          value={plantData.category}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Category</option>
          <option value="succulent">Succulent</option>
          <option value="fern">Fern</option>
          <option value="flowering">Flowering</option>
          <option value="indoor">Indoor</option>
          <option value="outdoor">Outdoor</option>
        </select>

        {/* Description */}
        <textarea
          name="description"
          value={plantData.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-2 border rounded"
          rows={2}
          required
        />

        {/* Image */}
        <input
          type="text"
          name="image"
          value={plantData.image}
          onChange={handleChange}
          placeholder="Image URL"
          className="w-full p-2 border rounded"
        />

        {/* Care Level */}
        <select
          name="careLevel"
          value={plantData.careLevel}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Care Level</option>
          <option value="Easy">Easy</option>
          <option value="Moderate">Moderate</option>
          <option value="Difficult">Difficult</option>
        </select>

        {/* Watering */}
        <input
          type="text"
          name="wateringFrequency"
          value={plantData.wateringFrequency}
          onChange={handleChange}
          placeholder="Watering Frequency (e.g., Every 3 days)"
          className="w-full p-2 border rounded"
        />

        {/* Dates */}
        <input
          type="date"
          name="lastWatered"
          value={plantData.lastWatered}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="date"
          name="nextWatering"
          value={plantData.nextWatering}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        {/* Sunlight */}
        <input
          type="text"
          name="sunlight"
          value={plantData.sunlight}
          onChange={handleChange}
          placeholder="Sunlight Requirements"
          className="w-full p-2 border rounded"
        />

        {/* Health Status */}
        <input
          type="text"
          name="healthStatus"
          value={plantData.healthStatus}
          onChange={handleChange}
          placeholder="Health Status"
          className="w-full p-2 border rounded"
        />

        {/* Care Tips */}
        <textarea
          name="careTips"
          value={plantData.careTips}
          onChange={handleChange}
          placeholder="Care Tips"
          className="w-full p-2 border rounded"
          rows={2}
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          {submitting ? "Adding..." : "Add Plant"}
        </button>
      </form>
    </div>
  );
};

export default AddItem;
