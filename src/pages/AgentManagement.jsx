import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Filter,
  MoreVertical,
  X,
  Save,
  User,
  Mail,
  Phone,
  FileText,
  Building,
  MapPin,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Loader,
  Menu,
  UserPlus,
  BarChart3,
  Settings,
  Home,
  LayoutDashboard
} from 'lucide-react';
import { 
  validateName, 
  validateEmail, 
  validatePhone, 
  validateLicenseNumber,
  getFieldValidationMessage
} from '../utils/validation';
import { agentAPI } from '../services/api';
import MinimalSidebar from '../components/MinimalSidebar';

const AgentManagement = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);
  const [deletingAgent, setDeletingAgent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAgents, setIsLoadingAgents] = useState(true);
  const [errors, setErrors] = useState({});
  const [focusErrors, setFocusErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Agent data - fetched from database
  const [agents, setAgents] = useState([]);

  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    licenseNumber: '',
    agency: '',
    experience: '',
    specialization: '',
    status: 'active'
  });

  // Fetch agents from database on component mount
  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      setIsLoadingAgents(true);
      setErrorMessage('');
      console.log('Fetching agents...');
      const response = await agentAPI.getAllAgents();
      console.log('Agents response:', response);
      
      if (response.success) {
        console.log('Agents data:', response.data);
        setAgents(response.data || []);
      } else {
        console.error('Failed to fetch agents:', response.message);
        setErrorMessage('Failed to fetch agents');
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
      setErrorMessage('Failed to load agents. Please try again.');
    } finally {
      setIsLoadingAgents(false);
    }
  };


  // Filter agents based on search and status
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (agent.phone && agent.phone.includes(searchTerm)) ||
                         (agent.agentProfile?.licenseNumber && agent.agentProfile.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (agent.agentProfile?.agency && agent.agentProfile.agency.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const agentStatus = agent.agentProfile?.isVerified ? 'active' : 'inactive';
    const matchesStatus = filterStatus === 'all' || agentStatus === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleEditAgent = (agent) => {
    setEditingAgent(agent);
    setEditFormData({
      name: agent.name,
      email: agent.email,
      phone: agent.phone || '',
      licenseNumber: agent.agentProfile?.licenseNumber || '',
      agency: agent.agentProfile?.agency || '',
      experience: agent.agentProfile?.experience || '',
      specialization: agent.agentProfile?.specialization || '',
      status: agent.agentProfile?.isVerified ? 'active' : 'inactive'
    });
    setErrors({});
    setFocusErrors({});
    setShowEditModal(true);
  };

  const handleDeleteAgent = (agent) => {
    setDeletingAgent(agent);
    setShowDeleteModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear focus error only if the input becomes valid
    if (focusErrors[name]) {
      const errorMessage = getFieldValidationMessage(name, value);
      if (!errorMessage) {
        setFocusErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
    }
  };

  const handleInputFocus = (e) => {
    const { name } = e.target;
    // Clear focus errors when user focuses on field
    setFocusErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const handleInputBlur = (e) => {
    const { name, value } = e.target;
    // Show validation error when user leaves the field
    const errorMessage = getFieldValidationMessage(name, value);
    if (errorMessage) {
      setFocusErrors(prev => ({
        ...prev,
        [name]: errorMessage
      }));
    }
  };

  const validateEditForm = () => {
    const newErrors = {};
    
    // Validate name
    const nameErrors = validateName(editFormData.name);
    if (nameErrors.length > 0) {
      newErrors.name = nameErrors[0];
    }
    
    // Validate email
    const emailErrors = validateEmail(editFormData.email);
    if (emailErrors.length > 0) {
      newErrors.email = emailErrors[0];
    }
    
    // Validate phone
    const phoneErrors = validatePhone(editFormData.phone);
    if (phoneErrors.length > 0) {
      newErrors.phone = phoneErrors[0];
    }
    
    // Validate license number
    const licenseErrors = validateLicenseNumber(editFormData.licenseNumber);
    if (licenseErrors.length > 0) {
      newErrors.licenseNumber = licenseErrors[0];
    }
    
    if (!editFormData.agency.trim()) {
      newErrors.agency = 'Agency name is required';
    }
    
    if (!editFormData.experience.trim()) {
      newErrors.experience = 'Experience is required';
    }
    
    if (!editFormData.specialization.trim()) {
      newErrors.specialization = 'Specialization is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveEdit = async () => {
    if (!validateEditForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await agentAPI.updateAgent(editingAgent._id, editFormData);
      
      if (response.success) {
        // Update agent in the list with proper structure
        setAgents(prev => prev.map(agent => 
          agent._id === editingAgent._id 
            ? { 
                ...agent, 
                name: editFormData.name,
                email: editFormData.email,
                phone: editFormData.phone,
                agentProfile: {
                  ...agent.agentProfile,
                  licenseNumber: editFormData.licenseNumber,
                  agency: editFormData.agency,
                  experience: editFormData.experience,
                  specialization: editFormData.specialization,
                  isVerified: editFormData.status === 'active'
                }
              }
            : agent
        ));
        
        setSuccessMessage('Agent updated successfully!');
        setShowEditModal(false);
        setEditingAgent(null);
        
        // Refresh the agents list to ensure data consistency
        fetchAgents();
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrors({
          general: response.message || 'Failed to update agent. Please try again.'
        });
      }
    } catch (error) {
      console.error('Update error:', error);
      setErrors({
        general: error.message || 'Failed to update agent. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    setIsLoading(true);
    try {
      const response = await agentAPI.deleteAgent(deletingAgent._id);
      
      if (response.success) {
        // Remove agent from the list
        setAgents(prev => prev.filter(agent => agent._id !== deletingAgent._id));
        
        setSuccessMessage('Agent deleted successfully!');
        setShowDeleteModal(false);
        setDeletingAgent(null);
        
        // Refresh the agents list to ensure data consistency
        fetchAgents();
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage(response.message || 'Failed to delete agent. Please try again.');
      }
    } catch (error) {
      console.error('Delete error:', error);
      setErrorMessage(error.message || 'Failed to delete agent. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    switch (status) {
      case 'active':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'inactive':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg">
            <MinimalSidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:left-0 lg:top-0 lg:h-full lg:w-64 lg:block">
        <MinimalSidebar />
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left side - Logo and Menu */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-2">
                <Building className="h-6 w-6 text-blue-600" />
                <span className="text-lg font-semibold text-gray-900">OwnSpace Admin</span>
              </div>
            </div>

            {/* Right side - Title and Add Button */}
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Agent Management</h1>
                <p className="text-sm text-gray-600">Manage real estate agents</p>
              </div>
              <button
                onClick={() => navigate('/admin/agents/add')}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Agent</span>
              </button>
            </div>
          </div>
        </header>

        {/* Success Message */}
        {successMessage && (
          <div className="mx-6 mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
              <p className="text-sm text-green-800">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-sm text-red-800">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="p-6">
          {/* Filters and Search */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search agents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Agents Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {isLoadingAgents ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="animate-spin h-8 w-8 text-blue-600 mr-3" />
                <p className="text-gray-600">Loading agents...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Agent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      License & Agency
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Performance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAgents.map((agent) => (
                    <tr key={agent._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <User className="h-5 w-5 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{agent.name}</div>
                            <div className="text-sm text-gray-500">{agent.agentProfile?.specialization || 'Not specified'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{agent.email}</div>
                        <div className="text-sm text-gray-500">{agent.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{agent.agentProfile?.licenseNumber || 'Not provided'}</div>
                        <div className="text-sm text-gray-500">{agent.agentProfile?.agency || 'Not specified'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{agent.propertiesSold || 0} properties</div>
                        <div className="text-sm text-gray-500">${(agent.totalSales || 0).toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getStatusBadge(agent.agentProfile?.isVerified ? 'active' : 'inactive')}>
                          {agent.agentProfile?.isVerified ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditAgent(agent)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                            title="Edit Agent"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteAgent(agent)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                            title="Delete Agent"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                </table>
              </div>
            )}

            {!isLoadingAgents && filteredAgents.length === 0 && (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No agents found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Get started by adding a new agent.'
                  }
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowEditModal(false)} />
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Edit Agent</h3>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Error Message */}
                {errors.general && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
                      <p className="text-sm text-red-800">{errors.general}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={editFormData.name}
                      onChange={handleInputChange}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      className={`w-full px-3 py-2 border ${
                        errors.name || focusErrors.name ? 'border-red-300' : 'border-gray-300'
                      } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="Enter full name"
                    />
                    {(errors.name || focusErrors.name) && (
                      <p className="mt-1 text-sm text-red-600">{errors.name || focusErrors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={editFormData.email}
                      onChange={handleInputChange}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      className={`w-full px-3 py-2 border ${
                        errors.email || focusErrors.email ? 'border-red-300' : 'border-gray-300'
                      } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="Enter email address"
                    />
                    {(errors.email || focusErrors.email) && (
                      <p className="mt-1 text-sm text-red-600">{errors.email || focusErrors.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={editFormData.phone}
                      onChange={handleInputChange}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      className={`w-full px-3 py-2 border ${
                        errors.phone || focusErrors.phone ? 'border-red-300' : 'border-gray-300'
                      } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="9876543210 (Must start with 7, 8, or 9)"
                    />
                    {(errors.phone || focusErrors.phone) && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone || focusErrors.phone}</p>
                    )}
                  </div>

                  {/* License Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      License Number *
                    </label>
                    <input
                      type="text"
                      name="licenseNumber"
                      value={editFormData.licenseNumber}
                      onChange={handleInputChange}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      className={`w-full px-3 py-2 border ${
                        errors.licenseNumber || focusErrors.licenseNumber ? 'border-red-300' : 'border-gray-300'
                      } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="RE123456789 (RE followed by 9 digits)"
                    />
                    {(errors.licenseNumber || focusErrors.licenseNumber) && (
                      <p className="mt-1 text-sm text-red-600">{errors.licenseNumber || focusErrors.licenseNumber}</p>
                    )}
                  </div>

                  {/* Agency */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Agency *
                    </label>
                    <input
                      type="text"
                      name="agency"
                      value={editFormData.agency}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border ${
                        errors.agency ? 'border-red-300' : 'border-gray-300'
                      } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="Enter agency name"
                    />
                    {errors.agency && (
                      <p className="mt-1 text-sm text-red-600">{errors.agency}</p>
                    )}
                  </div>

                  {/* Experience */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Experience *
                    </label>
                    <input
                      type="text"
                      name="experience"
                      value={editFormData.experience}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border ${
                        errors.experience ? 'border-red-300' : 'border-gray-300'
                      } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="e.g., 5 years"
                    />
                    {errors.experience && (
                      <p className="mt-1 text-sm text-red-600">{errors.experience}</p>
                    )}
                  </div>

                  {/* Specialization */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Specialization *
                    </label>
                    <select
                      name="specialization"
                      value={editFormData.specialization}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border ${
                        errors.specialization ? 'border-red-300' : 'border-gray-300'
                      } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    >
                      <option value="">Select specialization</option>
                      <option value="Residential">Residential</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Luxury">Luxury</option>
                      <option value="Industrial">Industrial</option>
                    </select>
                    {errors.specialization && (
                      <p className="mt-1 text-sm text-red-600">{errors.specialization}</p>
                    )}
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status *
                    </label>
                    <select
                      name="status"
                      value={editFormData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={handleSaveEdit}
                  disabled={isLoading}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader className="animate-spin h-4 w-4 mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowDeleteModal(false)} />
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Delete Agent
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete <strong>{deletingAgent?.name}</strong>? 
                        This action cannot be undone and will remove all associated data.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={handleConfirmDelete}
                  disabled={isLoading}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader className="animate-spin h-4 w-4 mr-2" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Agent
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentManagement;