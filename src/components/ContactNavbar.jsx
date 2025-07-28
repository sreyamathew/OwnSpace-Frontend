import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Building, Users, Phone, LogIn, UserPlus, Info, Settings } from 'lucide-react';

const ContactNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'About', href: '/about', icon: Info },
    { name: 'Services', href: '/services', icon: Settings },
    { name: 'Properties', href: '/properties', icon: Building },
    { name: 'Contact', href: '/contact', icon: Phone },
  ];

  const isActive = (path) => location.pathname === path;

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

            {/* Try Now Button */}
            <div className="flex items-center">
              <Link
                to="/register"
                className="bg-black text-white px-6 py-2 rounded-sm text-sm font-light transition-all duration-200 hover:bg-gray-800"
              >
                try now
              </Link>
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
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="block mx-3 bg-black text-white px-3 py-2 rounded-sm text-base font-light hover:bg-gray-800 transition-all duration-200 text-center"
              >
                try now
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default ContactNavbar;
