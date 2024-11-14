import React from 'react';
import { Activity } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80; // Account for fixed header height
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
    // Smooth scroll to top after navigation
    window.scrollTo({
      top: 0,
      behavior: "smooth"
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
              onClick={() => navigate('./upload')} 
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition-colors"
            >
              Upload Audio File
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;