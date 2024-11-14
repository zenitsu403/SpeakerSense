import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Home from './Home';
import Upload from './Upload';
import MeetingAnalytics from './MeetingAnalytics';

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/meeting-analytics" element={<MeetingAnalytics />}/>
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;