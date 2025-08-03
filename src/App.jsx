import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ContactNavbar from './components/ContactNavbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Properties from './pages/Properties';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import AgentRegistration from './pages/AgentRegistration';
import UserProfiles from './pages/UserProfiles';

const AppContent = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={
        <div className="App min-h-screen bg-gray-50">
          <ContactNavbar />
          <main><Home /></main>
          <Footer />
        </div>
      } />
      <Route path="/about" element={
        <div className="App min-h-screen bg-gray-50">
          <ContactNavbar />
          <main><About /></main>
          <Footer />
        </div>
      } />
      <Route path="/services" element={
        <div className="App min-h-screen bg-gray-50">
          <ContactNavbar />
          <main><Services /></main>
          <Footer />
        </div>
      } />
      <Route path="/properties" element={
        <div className="App min-h-screen bg-gray-50">
          <ContactNavbar />
          <main><Properties /></main>
          <Footer />
        </div>
      } />
      <Route path="/contact" element={
        <div className="App min-h-screen bg-gray-50">
          <ContactNavbar />
          <main><Contact /></main>
          <Footer />
        </div>
      } />
      <Route path="/login" element={
        <div className="App min-h-screen bg-gray-50">
          <ContactNavbar />
          <main><Login /></main>
          <Footer />
        </div>
      } />
      <Route path="/register" element={
        <div className="App min-h-screen bg-gray-50">
          <ContactNavbar />
          <main><Register /></main>
          <Footer />
        </div>
      } />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/agents/add" element={<AgentRegistration />} />
      <Route path="/admin/users" element={<UserProfiles />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
