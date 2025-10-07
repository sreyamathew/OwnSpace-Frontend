import React, { useState } from 'react';
import { Calendar, DollarSign, MessageSquare } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { offerAPI } from '../services/api';

const OfferForm = ({ propertyId, investorId, agentId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    amount: '',
    message: '',
    preferredDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
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
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.amount || isNaN(formData.amount) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    
    if (!formData.preferredDate) {
      newErrors.preferredDate = 'Please select a preferred date';
    } else {
      const selectedDate = new Date(formData.preferredDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.preferredDate = 'Date cannot be in the past';
      }
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Please enter a message';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message should be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await offerAPI.createOffer({
        propertyId,
        investorId,
        agentId,
        amount: Number(formData.amount),
        message: formData.message,
        preferredDate: formData.preferredDate
      });
      
      if (response.success) {
        toast.success('Your interest in this property has been submitted successfully!');
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      } else {
        toast.error(response.message || 'Failed to submit your interest');
        setErrors({ general: response.message || 'Failed to submit your interest' });
      }
    } catch (error) {
      console.error('Error submitting offer:', error);
      toast.error('Failed to submit your interest. Please try again.');
      setErrors({ general: 'Failed to submit your interest. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Get today's date in YYYY-MM-DD format for min date attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">I'm Interested in Buying</h3>
      
      {errors.general && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{errors.general}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Offer Amount ($)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              className={`block w-full pl-10 pr-3 py-2 border ${
                errors.amount ? 'border-red-300' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter your offer amount"
            />
          </div>
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Date
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              id="preferredDate"
              name="preferredDate"
              min={today}
              value={formData.preferredDate}
              onChange={handleInputChange}
              className={`block w-full pl-10 pr-3 py-2 border ${
                errors.preferredDate ? 'border-red-300' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            />
          </div>
          {errors.preferredDate && (
            <p className="mt-1 text-sm text-red-600">{errors.preferredDate}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <div className="relative">
            <div className="absolute top-3 left-3 pointer-events-none">
              <MessageSquare className="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              id="message"
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleInputChange}
              className={`block w-full pl-10 pr-3 py-2 border ${
                errors.message ? 'border-red-300' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Tell the agent why you're interested in this property..."
            />
          </div>
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message}</p>
          )}
        </div>
        
        <div className="flex space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-70"
          >
            {loading ? 'Submitting...' : 'Submit Interest'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OfferForm;