import React from 'react';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';
import { Toaster } from 'react-hot-toast';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white transition-colors">
      {/* Navigation */}
      <header className="sticky top-0 z-50">
  <Navbar />
</header>


      {/* Main Content */}
      <main className="flex-grow ">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      {/* Notification System */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            theme: {
              primary: 'green',
              secondary: 'black',
            },
          },
          error: {
            duration: 5000,
          },
        }}
      />
    </div>
  );
};

export default MainLayout;
