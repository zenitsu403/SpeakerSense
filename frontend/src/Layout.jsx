// Layout.jsx
import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children ,isLoggedIn,setIsLoggedIn}) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
      {children}
      <Footer />
    </div>
  );
};

export default Layout