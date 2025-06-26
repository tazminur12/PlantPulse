import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaLeaf, FaBars, FaTimes, FaUserCircle, FaChartLine, FaQuestionCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthProvider';
import { Tooltip } from 'react-tooltip';

const Navbar = () => {
  const { user, logOut, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const navLinks = [
    { path: '/', name: 'Home' },
    { path: '/all-plants', name: 'Plant Library' },
    { path: '/dashboard', name: 'Dashboard', icon: <FaChartLine /> },
    { path: '/support', name: 'Support', icon: <FaQuestionCircle /> },
  ];

  if (loading) {
    return (
      <header className="fixed w-full top-0 z-50 bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="w-32 h-8 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full animate-pulse"></div>
        </div>
      </header>
    );
  }

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-lg' : 'shadow-md'} bg-gradient-to-r from-lime-200 via-green-100 to-lime-300 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800`}>
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-green-800 dark:text-lime-300 font-bold text-xl hover:scale-105 transition-transform" onClick={closeMenu}>
            <FaLeaf className="text-green-700 dark:text-lime-400 text-2xl" />
            <span className="tracking-tight">PlantPulse</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {/* Nav Links */}
            <ul className="flex gap-6 text-base font-medium">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <NavLink to={link.path} className={({ isActive }) =>
                    `flex items-center gap-1 transition-colors ${isActive ? 'text-green-600 dark:text-lime-400 font-semibold' : 'text-green-900 dark:text-lime-200 hover:text-green-600 dark:hover:text-lime-400'}`
                  }>
                    {link.icon}
                    {link.name}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* User Auth */}
            <div className="ml-4">
              {user ? (
                <div className="flex items-center gap-2">
                  <div data-tooltip-id="user-tooltip" data-tooltip-content={user.displayName || 'User'}>
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="User" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <FaUserCircle className="text-2xl text-green-700 dark:text-lime-300" />
                    )}
                  </div>
                  <button onClick={logOut} className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">Logout</button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Link to="/login" className="text-green-800 dark:text-lime-300 font-semibold hover:underline">Login</Link>
                  <Link to="/register" className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors">Register</Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-2xl text-green-900 dark:text-lime-200">
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-[500px]' : 'max-h-0 overflow-hidden'}`}>
          <ul className="flex flex-col gap-2 px-4 pb-4 text-green-900 dark:text-lime-200 font-medium">
            {navLinks.map((link) => (
              <li key={link.path}>
                <NavLink to={link.path} onClick={closeMenu} className={({ isActive }) =>
                  `block py-2 px-4 rounded-lg flex items-center gap-2 ${isActive ? 'bg-green-100 dark:bg-gray-700 text-green-600 dark:text-lime-400' : 'hover:bg-green-100 dark:hover:bg-gray-700'}`
                }>
                  {link.icon}
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Auth Buttons */}
          <div className="px-4 py-4 border-t border-green-200 dark:border-gray-700">
            <div className="mt-3">
              {user ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="User" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <FaUserCircle className="text-2xl text-green-700 dark:text-lime-300" />
                    )}
                    <span>{user.displayName || 'User'}</span>
                  </div>
                  <button onClick={() => { logOut(); closeMenu(); }} className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">Logout</button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link to="/login" onClick={closeMenu} className="text-center py-2 font-semibold hover:underline text-green-800 dark:text-lime-300">Login</Link>
                  <Link to="/register" onClick={closeMenu} className="text-center py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">Register</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Tooltip id="user-tooltip" place="bottom" effect="solid" />
    </header>
  );
};

export default Navbar;
