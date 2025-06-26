import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaWater, 
  FaSun, 
  FaSeedling, 
  FaCalendarAlt,
  FaBell,
  FaCheck,
  FaPlus,
  FaTrash,
  FaEdit
} from 'react-icons/fa';
import { useAuth } from '../context/AuthProvider';

const RemindersPage = () => {
  const { user } = useAuth();
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');

  // Fetch reminders from server
  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const response = await fetch('https://plant-pulse-server.vercel.app/plants', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch reminders');
        }
        
        const data = await response.json();
        setReminders(data);
      } catch (err) {
        console.error('Error fetching reminders:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchReminders();
    }
  }, [user]);

  // Filter reminders based on active tab
  const filteredReminders = reminders.filter(reminder => {
    const now = new Date();
    const dueDate = new Date(reminder.dueDate);
    
    if (activeTab === 'upcoming') {
      return dueDate >= now;
    } else if (activeTab === 'completed') {
      return reminder.completed;
    } else if (activeTab === 'overdue') {
      return dueDate < now && !reminder.completed;
    }
    return true;
  });

  // Toggle reminder completion status
  const toggleReminderCompletion = async (id) => {
    try {
      const response = await fetch(`https://plant-pulse-server.vercel.app/plants/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ completed: !reminders.find(r => r._id === id).completed })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update reminder');
      }
      
      const updatedReminder = await response.json();
      setReminders(reminders.map(r => 
        r._id === id ? updatedReminder : r
      ));
    } catch (err) {
      console.error('Error updating reminder:', err);
    }
  };

  // Delete reminder
  const deleteReminder = async (id) => {
    try {
      const response = await fetch(`https://plant-pulse-server.vercel.app/plants/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete reminder');
      }
      
      setReminders(reminders.filter(r => r._id !== id));
    } catch (err) {
      console.error('Error deleting reminder:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading reminders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-md">
          <p className="text-red-500 dark:text-red-400 mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-emerald-600 text-white py-12 px-4 pt-30">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Plant Care Reminders</h1>
              <p className="text-emerald-100">Never miss important plant care tasks</p>
            </div>
            <Link
              to="/add-reminder"
              className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 bg-white text-emerald-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              <FaPlus className="mr-2" />
              Add New Reminder
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-8">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-6 py-3 font-medium ${activeTab === 'upcoming' ? 'text-emerald-600 border-b-2 border-emerald-600 dark:text-emerald-400 dark:border-emerald-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab('overdue')}
            className={`px-6 py-3 font-medium ${activeTab === 'overdue' ? 'text-emerald-600 border-b-2 border-emerald-600 dark:text-emerald-400 dark:border-emerald-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
          >
            Overdue
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-6 py-3 font-medium ${activeTab === 'completed' ? 'text-emerald-600 border-b-2 border-emerald-600 dark:text-emerald-400 dark:border-emerald-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
          >
            Completed
          </button>
        </div>

        {/* Reminders List */}
        {filteredReminders.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <FaBell className="mx-auto text-4xl text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No {activeTab} reminders found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {activeTab === 'upcoming' 
                ? "Add reminders to keep track of your plant care schedule" 
                : activeTab === 'overdue'
                ? "All caught up! No overdue reminders"
                : "You haven't completed any reminders yet"}
            </p>
            <Link
              to="/add-reminder"
              className="inline-flex items-center px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            >
              <FaPlus className="mr-2" />
              Create Reminder
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReminders.map(reminder => (
              <div 
                key={reminder._id} 
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-l-4 ${
                  reminder.completed 
                    ? 'border-gray-300 dark:border-gray-600' 
                    : new Date(reminder.dueDate) < new Date() 
                      ? 'border-red-500' 
                      : 'border-emerald-500'
                }`}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start">
                      <button
                        onClick={() => toggleReminderCompletion(reminder._id)}
                        className={`mr-4 mt-1 flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center ${
                          reminder.completed
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                        aria-label={reminder.completed ? "Mark as incomplete" : "Mark as complete"}
                      >
                        {reminder.completed && <FaCheck className="text-xs" />}
                      </button>
                      <div>
                        <h3 className={`text-lg font-semibold ${
                          reminder.completed 
                            ? 'text-gray-500 dark:text-gray-400 line-through' 
                            : 'text-gray-800 dark:text-white'
                        }`}>
                          {reminder.task}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                          <FaCalendarAlt className="mr-2" />
                          <span>
                            {new Date(reminder.dueDate).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        {reminder.plant && (
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                            <FaSeedling className="mr-2" />
                            <span>{reminder.plant.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => console.log('Edit', reminder._id)} // Replace with your edit function
                        className="text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                        aria-label="Edit reminder"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => deleteReminder(reminder._id)}
                        className="text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        aria-label="Delete reminder"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  {reminder.notes && (
                    <div className="mt-4 pl-10">
                      <p className="text-gray-600 dark:text-gray-300 text-sm">{reminder.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reminder Types Info */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 p-3 rounded-full mr-4">
                <FaWater />
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-white">Watering</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Set reminders based on each plant's specific watering needs. We'll adjust frequency based on season.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 p-3 rounded-full mr-4">
                <FaSun />
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-white">Fertilizing</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Never forget when to fertilize. Get reminders for different fertilizer types and strengths.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 p-3 rounded-full mr-4">
                <FaSeedling />
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-white">Maintenance</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Pruning, repotting, pest checks - we'll remind you of all important plant maintenance tasks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemindersPage;