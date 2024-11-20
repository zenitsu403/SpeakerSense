import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Home from './Home';
import Upload from './Upload';
import MeetingAnalytics from './MeetingAnalytics';
import { LoginPage, RegisterPage } from './AuthComponents'

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <Router>
      <Layout  isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}>
        <Routes>
          <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/meeting-analytics" element={<MeetingAnalytics />}/>
          <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn}/>}/>
          <Route path="/register" element={<RegisterPage />}/>
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;