import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Home, Building, Users, Phone, LogIn, UserPlus, Info, Settings, LogOut, LayoutDashboard, User, Heart, History, ChevronDown, Calendar, Eye, Receipt } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ContactNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, isAdmin, isAgent, isLoading } = useAuth();

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'About', href: '/about', icon: Info },
    { name: 'Services', href: '/services', icon: Settings },
    { name: 'Properties', href: '/properties', icon: Building },
    { name: 'Contact', href: '/contact', icon: Phone },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isBuyer = () => {
    return user && user.userType === 'buyer';
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Minimal Aesthetic Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 border-2 border-gray-300 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-gradient-to-br from-gray-800 to-gray-600 rounded-full"></div>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-thin text-gray-900 tracking-wide">
                  OwnSpace
                </span>
                <div className="w-12 h-px bg-gradient-to-r from-gray-400 to-transparent"></div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-baseline space-x-6">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 text-sm font-light transition-colors duration-200 ${
                      isActive(item.href)
                        ? 'text-black'
                        : 'text-gray-600 hover:text-black'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              {!isLoading && isAuthenticated && user ? (
                <>
                  {isAdmin() && (
                    <Link
                      to="/admin/dashboard"
                      className="flex items-center space-x-2 text-sm font-light text-gray-600 hover:text-black transition-colors duration-200"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}
                  {isAgent() && (
                    <Link
                      to="/agent/dashboard"
                      className="flex items-center space-x-2 text-sm font-light text-gray-600 hover:text-black transition-colors duration-200"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Agent Dashboard</span>
                    </Link>
                  )}
                  
                  {/* Buyer Profile Dropdown */}
                  {isBuyer() && (
                    <div className="relative" ref={profileRef}>
                      <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center space-x-2 text-sm font-light text-gray-600 hover:text-black transition-colors duration-200"
                      >
                        <User className="h-4 w-4" />
                        <span>{user?.name}</span>
                        <ChevronDown className="h-3 w-3" />
                      </button>
                      
                      {isProfileOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                          <Link
                            to="/profile"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <User className="h-4 w-4" />
                            <span>My Profile</span>
                          </Link>
                          <Link
                            to="/saved-properties"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Heart className="h-4 w-4" />
                            <span>Saved Properties</span>
                          </Link>
                          <Link
                            to="/property-history"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <History className="h-4 w-4" />
                            <span>View History</span>
                          </Link>
                          <Link
                            to="/visited-properties"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Eye className="h-4 w-4" />
                            <span>Visited Properties</span>
                          </Link>
                          <Link
                            to="/appointments"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Calendar className="h-4 w-4" />
                            <span>Appointments</span>
                          </Link>
                          <Link
                            to="/purchase-details"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Receipt className="h-4 w-4" />
                            <span>Purchase Details</span>
                          </Link>
                          <div className="border-t border-gray-100"></div>
                          <button
                            onClick={() => {
                              handleLogout();
                              setIsProfileOpen(false);
                            }}
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          >
                            <LogOut className="h-4 w-4" />
                            <span>Logout</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Admin/Agent Welcome + Logout */}
                  {(isAdmin() || isAgent()) && (
                    <>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>Welcome, {user?.name}</span>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-sm text-sm font-light transition-all duration-200 hover:bg-gray-200"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </>
                  )}
                </>
              ) : !isLoading ? (
                <>
                  <Link
                    to="/login"
                    className="flex items-center space-x-2 text-sm font-light text-gray-600 hover:text-black transition-colors duration-200"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className="bg-black text-white px-6 py-2 rounded-sm text-sm font-light transition-all duration-200 hover:bg-gray-800"
                  >
                    try now
                  </Link>
                </>
              ) : null}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-black focus:outline-none focus:text-black transition-colors duration-200"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-sm text-base font-light transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'text-black bg-gray-50'
                      : 'text-gray-600 hover:text-black hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <div className="border-t border-gray-200 pt-4 pb-3">
              {!isLoading && isAuthenticated && user ? (
                <>
                  {isAdmin() && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 mx-3 px-3 py-2 rounded-sm text-base font-light text-gray-600 hover:text-black hover:bg-gray-50 transition-colors duration-200"
                    >
                      <LayoutDashboard className="h-5 w-5" />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}
                  {isAgent() && (
                    <Link
                      to="/agent/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 mx-3 px-3 py-2 rounded-sm text-base font-light text-gray-600 hover:text-black hover:bg-gray-50 transition-colors duration-200"
                    >
                      <LayoutDashboard className="h-5 w-5" />
                      <span>Agent Dashboard</span>
                    </Link>
                  )}
                  
                  {/* Buyer Profile Options */}
                  {isBuyer() && (
                    <>
                      <div className="mx-3 px-3 py-2 text-base text-gray-600">
                        Welcome, {user?.name}
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-3 mx-3 px-3 py-2 rounded-sm text-base font-light text-gray-600 hover:text-black hover:bg-gray-50 transition-colors duration-200"
                      >
                        <User className="h-5 w-5" />
                        <span>My Profile</span>
                      </Link>
                      <Link
                        to="/saved-properties"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-3 mx-3 px-3 py-2 rounded-sm text-base font-light text-gray-600 hover:text-black hover:bg-gray-50 transition-colors duration-200"
                      >
                        <Heart className="h-5 w-5" />
                        <span>Saved Properties</span>
                      </Link>
                      <Link
                        to="/property-history"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-3 mx-3 px-3 py-2 rounded-sm text-base font-light text-gray-600 hover:text-black hover:bg-gray-50 transition-colors duration-200"
                      >
                        <History className="h-5 w-5" />
                        <span>View History</span>
                      </Link>
                      <Link
                        to="/visited-properties"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-3 mx-3 px-3 py-2 rounded-sm text-base font-light text-gray-600 hover:text-black hover:bg-gray-50 transition-colors duration-200"
                      >
                        <Eye className="h-5 w-5" />
                        <span>Visited Properties</span>
                      </Link>
                      <Link
                        to="/appointments"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-3 mx-3 px-3 py-2 rounded-sm text-base font-light text-gray-600 hover:text-black hover:bg-gray-50 transition-colors duration-200"
                      >
                        <Calendar className="h-5 w-5" />
                        <span>Appointments</span>
                      </Link>
                      <Link
                        to="/purchase-details"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-3 mx-3 px-3 py-2 rounded-sm text-base font-light text-gray-600 hover:text-black hover:bg-gray-50 transition-colors duration-200"
                      >
                        <Receipt className="h-5 w-5" />
                        <span>Purchase Details</span>
                      </Link>
                    </>
                  )}
                  
                  {/* Admin/Agent Welcome */}
                  {(isAdmin() || isAgent()) && (
                    <div className="mx-3 px-3 py-2 text-base text-gray-600">
                      Welcome, {user?.name}
                    </div>
                  )}
                  
                  {/* Logout Button for all authenticated users */}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="flex items-center space-x-3 mx-3 px-3 py-2 rounded-sm text-base font-light text-gray-600 hover:text-black hover:bg-gray-50 transition-colors duration-200 w-full"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : !isLoading ? (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-3 mx-3 px-3 py-2 rounded-sm text-base font-light text-gray-600 hover:text-black hover:bg-gray-50 transition-colors duration-200"
                  >
                    <LogIn className="h-5 w-5" />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="block mx-3 bg-black text-white px-3 py-2 rounded-sm text-base font-light hover:bg-gray-800 transition-all duration-200 text-center"
                  >
                    try now
                  </Link>
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default ContactNavbar;
