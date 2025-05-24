import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const LoadingSpinner = ({
  size = 'text-4xl',
  color = 'text-green-600 dark:text-lime-400',
  fullscreen = false,
  message = '',
}) => {
  return (
    <div
      className={`flex flex-col justify-center items-center ${
        fullscreen ? 'fixed inset-0 bg-white/80 dark:bg-black/50 z-50' : 'py-20'
      }`}
      role="status"
      aria-label="Loading"
    >
      <FaSpinner className={`animate-spin ${size} ${color}`} />
      {message && <p className="mt-4 text-gray-700 dark:text-gray-300">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
