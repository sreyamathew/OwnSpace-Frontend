import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, Loader2, Info } from 'lucide-react';
import { propertyAPI } from '../services/api';
import './SimilarHomes.css';

const SimilarHomes = ({ 
  bedrooms, 
  area, 
  bathrooms, 
  city, 
  price, 
  propertyType,
  currentPropertyId 
}) => {
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSimilar = async () => {
      if (!city) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await propertyAPI.getSimilarHomes({
          bedrooms,
          area,
          bathrooms,
          city,
          price,
          propertyType,
          currentPropertyId
        });

        if (res.success) {
          setSimilar(res.results || []);
        }
      } catch (err) {
        console.error('Error fetching similar homes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilar();
  }, [city, bedrooms, area, bathrooms, price, propertyType, currentPropertyId]);

  const formatPrice = (price) => {
    if (!price) return 'N/A';
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)}Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)}L`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };

  const handlePropertyClick = (id) => {
    navigate(`/property/${id}`);
    window.scrollTo(0, 0); // Scroll to top on navigation
  };

  if (loading) {
    return (
      <div className="similar-homes-section">
        <h3 className="similar-homes-title">Similar Homes</h3>
        <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <Loader2 className="h-8 w-8 text-primary-600 animate-spin mb-2" />
          <p className="text-gray-500 font-medium">Finding comparable properties in {city}...</p>
        </div>
      </div>
    );
  }

  if (similar.length === 0) {
    return (
      <div className="similar-homes-section">
        <h3 className="similar-homes-title">Similar Homes</h3>
        <div className="no-similar-homes">
           <Info className="h-8 w-8 text-gray-400 mx-auto mb-2" />
           <p className="font-medium">No similar properties found in {city}.</p>
           <p className="text-sm">We are expanding our listings in this area. Check back soon!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="similar-homes-section">
      <div className="similar-homes-header">
        <h3 className="similar-homes-title">Similar Homes</h3>
        <span className="text-sm font-medium text-gray-500">
          Top {similar.length} matches for you
        </span>
      </div>
      
      <div className="similar-homes-grid">
        {similar.map((property) => (
          <div 
            key={property._id} 
            className="similar-property-card"
            onClick={() => handlePropertyClick(property._id)}
          >
            <div className="relative">
              {property.images && property.images.length > 0 ? (
                <img 
                  src={property.images[0].url} 
                  alt={property.title} 
                  className="similar-property-image"
                />
              ) : (
                <div className="no-image-placeholder">
                  <span>No Image Available</span>
                </div>
              )}
              
              {property.similarityScore && (
                <div className="similarity-badge">
                  {property.similarityScore}% Match
                </div>
              )}
            </div>

            <div className="similar-property-content">
              <div className="similar-property-price">
                {formatPrice(property.price)}
              </div>
              <h4 className="similar-property-title">{property.title}</h4>
              
              <div className="similar-property-location">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                {property.address?.city}, {property.address?.state}
              </div>

              <div className="similar-property-details">
                {property.bedrooms && (
                  <div className="detail-item">
                    <Bed className="h-4 w-4" />
                    <span>{property.bedrooms} BHK</span>
                  </div>
                )}
                {property.area && (
                  <div className="detail-item">
                    <Square className="h-3.5 w-3.5" />
                    <span>{property.area} sqft</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="detail-item">
                    <Bath className="h-4 w-4" />
                    <span>{property.bathrooms} Bath</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimilarHomes;
