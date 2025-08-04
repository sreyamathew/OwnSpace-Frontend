import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
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
import AgentDashboard from './pages/AgentDashboard';
import AddProperty from './pages/AddProperty';
import UserProfile from './pages/UserProfile';
import SavedProperties from './pages/SavedProperties';
import PropertyHistory from './pages/PropertyHistory';
import AdminProfile from './pages/AdminProfile';
import AgentProfile from './pages/AgentProfile';
import ValidationTest from './pages/ValidationTest';
import OtpVerification from './pages/OtpVerification';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

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
      <Route path="/validation-test" element={
        <div className="App min-h-screen bg-gray-50">
          <ContactNavbar />
          <main><ValidationTest /></main>
          <Footer />
        </div>
      } />
      <Route path="/verify-otp" element={<OtpVerification />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute requireAdmin={true}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/agents/add" element={
        <ProtectedRoute requireAdmin={true}>
          <AgentRegistration />
        </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute requireAdmin={true}>
          <UserProfiles />
        </ProtectedRoute>
      } />
      <Route path="/admin/profile" element={
        <ProtectedRoute requireAdmin={true}>
          <AdminProfile />
        </ProtectedRoute>
      } />

      {/* Agent Routes */}
      <Route path="/agent/dashboard" element={
        <ProtectedRoute requireAgent={true}>
          <AgentDashboard />
        </ProtectedRoute>
      } />
      <Route path="/agent/properties/add" element={
        <ProtectedRoute requireAgent={true}>
          <AddProperty />
        </ProtectedRoute>
      } />
      <Route path="/agent/profile" element={
        <ProtectedRoute requireAgent={true}>
          <AgentProfile />
        </ProtectedRoute>
      } />

      {/* User/Buyer Routes */}
      <Route path="/profile" element={
        <ProtectedRoute>
          <UserProfile />
        </ProtectedRoute>
      } />
      <Route path="/saved-properties" element={
        <ProtectedRoute>
          <SavedProperties />
        </ProtectedRoute>
      } />
      <Route path="/property-history" element={
        <ProtectedRoute>
          <PropertyHistory />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
