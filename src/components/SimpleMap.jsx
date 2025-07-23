import React, { useState } from 'react';
import { MapPin, ExternalLink, Navigation, Phone, Clock } from 'lucide-react';

const SimpleMap = ({
  address = "MG Road, Kochi, Kerala 682016, India",
  embedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.0537885309143!2d76.29441731479394!3d9.981347292829894!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080d514abec6bf%3A0xbd582caa5844192!2sMG%20Road%2C%20Kochi%2C%20Kerala!5e0!3m2!1sen!2sin!4v1703123456789!5m2!1sen!2sin"
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const handleDirectionsClick = () => {
    const encodedAddress = encodeURIComponent(address);
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
    window.open(directionsUrl, '_blank');
  };

  return (
    <div className="w-full h-96 relative rounded-xl overflow-hidden shadow-lg bg-gray-100">
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
            <p className="text-gray-600 text-sm">Loading map...</p>
          </div>
        </div>
      )}

      {/* Google Maps Embed */}
      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Office Location Map"
        className="rounded-xl"
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
      ></iframe>

      {/* Control buttons overlay */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        <button
          onClick={handleDirectionsClick}
          className="bg-white hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg shadow-md flex items-center space-x-2 transition-all duration-200 hover:shadow-lg"
          title="Get Directions"
        >
          <Navigation className="h-4 w-4" />
          <span className="text-sm font-medium">Directions</span>
        </button>

        <button
          onClick={() => window.open('tel:+914841234567', '_self')}
          className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-lg shadow-md flex items-center space-x-2 transition-all duration-200 hover:shadow-lg"
          title="Call Office"
        >
          <Phone className="h-4 w-4" />
          <span className="text-sm font-medium">Call</span>
        </button>
      </div>

      {/* Office info overlay */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg p-4 shadow-lg max-w-xs">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-sm">OwnSpace Real Estate</h4>
            <p className="text-gray-600 text-xs mt-1">{address}</p>
            <div className="flex items-center mt-2 text-xs text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              <span>Mon-Fri 9AM-6PM IST</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleMap;
