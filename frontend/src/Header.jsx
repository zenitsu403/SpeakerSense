import React, { useState, useEffect } from 'react';
import { Activity, User } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const Header = ({isLoggedIn,setIsLoggedIn}) => {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // Check login status on component mount and when navigating
  useEffect(() => {
    const token = localStorage.getItem('token');
    if(token && token.length>0)
      setIsLoggedIn(true);
    else setIsLoggedIn(false);
  }, [isLoggedIn]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const handleLogoClick = () => {
    navigate('/');
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleLogout = () => {
    // Use the logout utility from the auth component
    fetch('logout/', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${localStorage.getItem('token')}`
      }
    }).finally(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      setIsLoggedIn(false);
      setShowUserMenu(false);
      navigate('/');
    });
  };

  return (
    <header className="fixed top-0 w-full backdrop-blur-sm bg-gray-900/50 z-50">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={handleLogoClick}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <Activity className="h-8 w-8 text-blue-400" />
            <span className="text-xl font-bold text-blue-400">SpeakerSense</span>
          </button>
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('features')}
              className="text-gray-300 hover:text-blue-400 transition-colors"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="text-gray-300 hover:text-blue-400 transition-colors"
            >
              How It Works
            </button>
            <button 
              onClick={() => scrollToSection('analytics')}
              className="text-gray-300 hover:text-blue-400 transition-colors"
            >
              Analytics
            </button>
            <button 
              onClick={() => isLoggedIn ? navigate('/upload') : navigate('/login')}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition-colors"
            >
              Upload Audio File
            </button>
            
            {/* Authentication Buttons */}
            {!isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-400 text-white transition-colors"
                >
                  Get Started
                </button>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-gray-300 hover:text-blue-400 transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span>{localStorage.getItem('userName')}</span>
                </button>
                
                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      {/* <button
                        onClick={() => navigate('/profile')}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        Profile
                      </button> */}
                      <button
                        onClick={handleLogout}
                        className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;