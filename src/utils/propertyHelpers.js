import { toast } from 'react-hot-toast';

// API Configuration
const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api`;

/**
 * Format a property address object or string into a single readable line.
 */
export const formatAddress = (address) => {
  if (!address) return '';
  if (typeof address === 'string') return address;
  try {
    const { street, city, state, zipCode, country } = address || {};
    return [street, city, state, zipCode, country].filter(Boolean).join(', ');
  } catch (_) {
    return '';
  }
};

/**
 * Handle investor interest in a property
 * @param {Object} property - The property object
 * @param {Object} user - The current logged-in user
 */
export const handleInterest = async (property, user) => {
  try {
    // Debug logging to verify property data
    console.log("Property data for offer:", property);
    
    const investorId = user._id; // current logged-in user
    const propertyId = property._id || property.propertyId;
    
    // Enhanced agent detection logic to handle various property object formats
    const agentId = 
      property.agent?._id || 
      property.agentId?._id || 
      property.agentId || 
      property.listedBy?._id || 
      property.listedBy || 
      property.createdBy?._id || 
      property.createdBy;

    if (!agentId) {
      toast.error("No agent assigned to this property. Please contact admin.");
      return;
    }

    const token = localStorage.getItem('token');
    const url = `${API_BASE_URL}/offers`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        propertyId,
        investorId,
        agentId,
        offerAmount: property.price || 0,
        message: "I'm interested in buying this property."
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      toast.success("Your interest has been sent to the listing agent successfully! We'll notify you when they respond.");
    } else {
      toast.error(data.message || "Failed to submit interest");
    }
  } catch (err) {
    console.error("Offer submission error:", err);
    toast.error(`Failed to submit interest: ${err.message || "Unknown error"}`);
  }
};