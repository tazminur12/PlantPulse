import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaLeaf, FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthProvider';
import { Tooltip } from 'react-tooltip';

const Navbar = () => {
  const { user, logOut, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Dark mode state, initialize from localStorage or system preference
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem('theme');
      if (stored) return stored === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Apply/remove dark class on <html>
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Scroll effect for shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const toggleTheme = () => setIsDark(!isDark);

  const navLinks = [
    { path: '/', name: 'Home' },
    { path: '/all-plants', name: 'All Plants' },
    ...(user ? [
      { path: '/add-plant', name: 'Add Plant' },
      { path: '/my-plants', name: 'My Plants' }
    ] : [])
  ];

  if (loading) {
    return (
      <header className="fixed w-full top-0 z-50 bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="w-32 h-8 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full animate-pulse"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled ? 'shadow-lg' : 'shadow-md'
      } bg-gradient-to-r from-lime-200 via-green-100 to-lime-300 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800`}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between py-3">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-green-800 dark:text-lime-300 font-bold text-xl hover:scale-105 transition-transform"
            onClick={closeMenu}
          >
            <FaLeaf className="text-green-700 dark:text-lime-400 text-2xl" />
            <span>PlantPulse</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <ul className="flex gap-6 text-base font-medium">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `hover:text-green-600 dark:hover:text-lime-400 transition-colors ${
                        isActive
                          ? 'text-green-600 dark:text-lime-400 font-semibold'
                          : 'text-green-900 dark:text-lime-200'
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Dark mode toggle */}
            <label className="flex cursor-pointer gap-2 items-center select-none">
              {/* Sun icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-yellow-500"
              >
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
              </svg>
              {/* Toggle */}
              <input
                type="checkbox"
                checked={isDark}
                onChange={toggleTheme}
                className="toggle theme-controller"
              />
              {/* Moon icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-700 dark:text-gray-300"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            </label>

            <div className="flex items-center gap-4 ml-4">
              {/* User Profile */}
              {user ? (
                <div className="flex items-center gap-2">
                  <div
                    className="relative"
                    data-tooltip-id="user-tooltip"
                    data-tooltip-content={user.displayName || 'User'}
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || 'User'}
                        className="w-8 h-8 rounded-full object-cover cursor-pointer"
                      />
                    ) : (
                      <FaUserCircle className="text-2xl text-green-700 dark:text-lime-300" />
                    )}
                  </div>
                  <button
                    onClick={logOut}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Link
                    to="/login"
                    className="text-green-800 dark:text-lime-300 font-semibold hover:underline hover:text-green-600 dark:hover:text-lime-400"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={toggleMenu}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              className="text-2xl text-green-900 dark:text-lime-200"
            >
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 pt-2">
            <ul className="flex flex-col gap-3 text-green-900 dark:text-lime-200 font-medium">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `block py-2 px-4 rounded-lg hover:bg-green-100 dark:hover:bg-gray-700 ${
                        isActive
                          ? 'bg-green-100 dark:bg-gray-700 text-green-600 dark:text-lime-400'
                          : ''
                      }`
                    }
                    onClick={closeMenu}
                  >
                    {link.name}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Dark mode toggle on mobile */}
            <div className="mt-4 pt-4 border-t border-green-200 dark:border-gray-700 px-4 flex items-center gap-2 select-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-yellow-500"
              >
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
              </svg>
              <input
                type="checkbox"
                checked={isDark}
                onChange={toggleTheme}
                className="toggle theme-controller"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-700 dark:text-gray-300"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            </div>

            <div className="mt-4 pt-4 border-t border-green-200 dark:border-gray-700 px-4">
              {user ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || 'User'}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <FaUserCircle className="text-2xl text-green-700 dark:text-lime-300" />
                    )}
                    <span className="text-green-800 dark:text-lime-300">
                      {user.displayName || 'User'}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      logOut();
                      closeMenu();
                    }}
                    className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="text-center py-2 text-green-800 dark:text-lime-300 font-semibold hover:underline hover:text-green-600 dark:hover:text-lime-400"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="text-center py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Tooltips */}
      <Tooltip id="user-tooltip" place="bottom" effect="solid" />
    </header>
  );
};

export default Navbar;
