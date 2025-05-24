import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-white dark:bg-gray-900 text-center">
      {/* SVG Graphic */}
      <svg
        className="w-40 h-40 mb-6"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2V4M12 20V22M4 12H2M6.314 6.314L4.9 4.9M17.686 6.314L19.1 4.9M6.314 17.69L4.9 19.104M17.686 17.69L19.1 19.104M16 12A4 4 0 1 1 8 12A4 4 0 0 1 16 12Z"
          stroke="#ef4444"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 12L10 10M12 12L14 10M12 12L10 14M12 12L14 14"
          stroke="#ef4444"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      {/* Heading */}
      <h1 className="text-4xl font-bold text-green-800 dark:text-lime-300 mb-2">404 - Page Not Found</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Oops! The page you're looking for doesn't exist.
      </p>

      {/* Redirect Button */}
      <Link
        to="/"
        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default ErrorPage;
