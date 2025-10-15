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
import AgentManagement from './pages/AgentManagement';
import UserProfiles from './pages/UserProfiles';
import AgentDashboard from './pages/AgentDashboard';
import AgentAppointments from './pages/AgentAppointments';
import UserDashboard from './pages/UserDashboard';
import AddProperty from './pages/AddProperty';
import AdminProperties from './pages/AdminProperties';
import AdminAppointments from './pages/AdminAppointments';
import UserProfile from './pages/UserProfile';
import SavedProperties from './pages/SavedProperties';
import PropertyHistory from './pages/PropertyHistory';
import UserAppointments from './pages/UserAppointments';
import AdminProfile from './pages/AdminProfile';
import AgentProfile from './pages/AgentProfile';
import ValidationTest from './pages/ValidationTest';
import OtpVerification from './pages/OtpVerification';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AuthCallback from './pages/AuthCallback';
import MakeAdmin from './pages/MakeAdmin';
import EditProperty from './pages/EditProperty';
import AgentProperties from './pages/AgentProperties';
import PropertyDetail from './pages/PropertyDetail';
import VisitedProperties from './pages/VisitedProperties';
import PurchaseDetails from './pages/PurchaseDetails';
import PurchaseRequestManagement from './pages/PurchaseRequestManagement';
import Payment from './pages/Payment';
import PayAdvance from './pages/PayAdvance';
import BuyerDetails from './pages/BuyerDetails';
import PurchaseHistory from './pages/PurchaseHistory';

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
      <Route path="/property/:id" element={
        <div className="App min-h-screen bg-gray-50">
          <ContactNavbar />
          <main><PropertyDetail /></main>
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
      <Route path="/auth/callback" element={<AuthCallback />} />
      
      {/* Debug Route */}
      <Route path="/debug" element={
        <div className="p-8 text-center bg-green-50">
          <h1 className="text-3xl font-bold text-green-600 mb-4">🎉 Navigation Works!</h1>
          <p className="text-lg text-gray-700 mb-4">If you can see this page, navigation is working correctly.</p>
          <p className="text-sm text-gray-500">This means the issue is likely with route protection or user authentication.</p>
          <div className="mt-6">
            <button 
              onClick={() => window.history.back()} 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Go Back
            </button>
          </div>
        </div>
      } />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute requireAdmin={true}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/appointments" element={
        <ProtectedRoute requireAdmin={true}>
          <AdminAppointments />
        </ProtectedRoute>
      } />
      <Route path="/admin/agents/add" element={
        <ProtectedRoute requireAdmin={true}>
          <AgentRegistration />
        </ProtectedRoute>
      } />
      <Route path="/admin/agents" element={
        <ProtectedRoute requireAdmin={true}>
          <AgentManagement />
        </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute requireAdmin={true}>
          <UserProfiles />
        </ProtectedRoute>
      } />
      <Route path="/admin/analytics" element={
        <ProtectedRoute requireAdmin={true}>
          <div className="p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600 mt-2">Analytics page coming soon...</p>
          </div>
        </ProtectedRoute>
      } />
      <Route path="/admin/reports" element={
        <ProtectedRoute requireAdmin={true}>
          <div className="p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
            <p className="text-gray-600 mt-2">Reports page coming soon...</p>
          </div>
        </ProtectedRoute>
      } />
      <Route path="/admin/settings" element={
        <ProtectedRoute requireAdmin={true}>
          <div className="p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-2">Settings page coming soon...</p>
          </div>
        </ProtectedRoute>
      } />
      <Route path="/admin/profile" element={
        <ProtectedRoute requireAdmin={true}>
          <AdminProfile />
        </ProtectedRoute>
      } />
      <Route path="/admin/properties" element={
        <ProtectedRoute requireAdmin={true}>
          <AdminProperties />
        </ProtectedRoute>
      } />
      <Route path="/add-property" element={
        <ProtectedRoute requireAdminOrAgent={true}>
          <AddProperty />
        </ProtectedRoute>
      } />
      <Route path="/admin/properties/add" element={
        <ProtectedRoute requireAdmin={true}>
          <AddProperty />
        </ProtectedRoute>
      } />
      <Route path="/admin/properties/edit/:id" element={
        <ProtectedRoute requireAdmin={true}>
          <EditProperty />
        </ProtectedRoute>
      } />
      <Route path="/admin/purchase-requests" element={
        <ProtectedRoute requireAdmin={true}>
          <PurchaseRequestManagement />
        </ProtectedRoute>
      } />

      {/* Agent Routes */}
      <Route path="/agent/dashboard" element={
        <ProtectedRoute requireAgent={true}>
          <AgentDashboard />
        </ProtectedRoute>
      } />
      <Route path="/agent/appointments" element={
        <ProtectedRoute requireAgent={true}>
          <AgentAppointments />
        </ProtectedRoute>
      } />
      <Route path="/agent/properties" element={
        <ProtectedRoute requireAgent={true}>
          <AgentProperties />
        </ProtectedRoute>
      } />
      <Route path="/agent/properties/add" element={
        <ProtectedRoute requireAgent={true}>
          <AddProperty />
        </ProtectedRoute>
      } />
      <Route path="/agent/properties/edit/:id" element={
        <ProtectedRoute requireAgent={true}>
          <EditProperty />
        </ProtectedRoute>
      } />
      <Route path="/agent/profile" element={
        <ProtectedRoute requireAgent={true}>
          <AgentProfile />
        </ProtectedRoute>
      } />
      <Route path="/agent/purchase-requests" element={
        <ProtectedRoute requireAgent={true}>
          <PurchaseRequestManagement />
        </ProtectedRoute>
      } />

      {/* User/Buyer Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <UserDashboard />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <UserProfile />
        </ProtectedRoute>
      } />
      <Route path="/appointments" element={
        <ProtectedRoute>
          <UserAppointments />
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
      <Route path="/visited-properties" element={
        <ProtectedRoute>
          <VisitedProperties />
        </ProtectedRoute>
      } />
      <Route path="/purchase-details" element={
        <ProtectedRoute>
          <PurchaseDetails />
        </ProtectedRoute>
      } />
      <Route path="/purchase-history" element={
        <ProtectedRoute>
          <PurchaseHistory />
        </ProtectedRoute>
      } />
      <Route path="/payment/:offerId" element={
        <ProtectedRoute>
          <Payment />
        </ProtectedRoute>
      } />
      <Route path="/buyer-details/:propertyId" element={
        <ProtectedRoute>
          <BuyerDetails />
        </ProtectedRoute>
      } />
      <Route path="/pay-advance/:propertyId" element={
        <ProtectedRoute>
          <PayAdvance />
        </ProtectedRoute>
      } />
      <Route path="/make-admin" element={
        <ProtectedRoute>
          <MakeAdmin />
        </ProtectedRoute>
      } />

      {/* Catch-all route for 404 */}
      <Route path="*" element={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-8">Page not found</p>
            <button
              onClick={() => window.history.back()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
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
