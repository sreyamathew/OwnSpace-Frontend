import React, { useEffect, useRef, useState } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { MapPin, AlertCircle } from 'lucide-react';

// Map component that renders the actual Google Map
const MapComponent = ({ center, zoom, markers }) => {
  const ref = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (ref.current && !map) {
      const newMap = new window.google.maps.Map(ref.current, {
        center,
        zoom,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });
      setMap(newMap);
    }
  }, [ref, map, center, zoom]);

  useEffect(() => {
    if (map && markers) {
      markers.forEach(marker => {
        const mapMarker = new window.google.maps.Marker({
          position: marker.position,
          map: map,
          title: marker.title,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 10C21 17 12 23 12 23S3 17 3 10C3 5.02944 7.02944 1 12 1C16.9706 1 21 5.02944 21 10Z" fill="#2563eb" stroke="#1d4ed8" stroke-width="2"/>
                <circle cx="12" cy="10" r="3" fill="white"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(32, 32),
            anchor: new window.google.maps.Point(16, 32)
          }
        });

        if (marker.infoWindow) {
          const infoWindow = new window.google.maps.InfoWindow({
            content: marker.infoWindow
          });

          mapMarker.addListener('click', () => {
            infoWindow.open(map, mapMarker);
          });
        }
      });
    }
  }, [map, markers]);

  return <div ref={ref} className="w-full h-full rounded-xl" />;
};

// Render function for different loading states
const render = (status) => {
  switch (status) {
    case Status.LOADING:
      return (
        <div className="bg-gray-100 rounded-xl h-96 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      );
    case Status.FAILURE:
      return (
        <div className="bg-red-50 rounded-xl h-96 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <p className="text-red-600 font-semibold">Failed to load map</p>
            <p className="text-red-500 text-sm mt-2">Please check your internet connection</p>
          </div>
        </div>
      );
    default:
      return (
        <div className="bg-gray-200 rounded-xl h-96 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Map is initializing...</p>
          </div>
        </div>
      );
  }
};

// Main GoogleMap component
const GoogleMap = ({ 
  apiKey = "YOUR_GOOGLE_MAPS_API_KEY", 
  center = { lat: 40.7128, lng: -74.0060 }, // Default to NYC
  zoom = 15,
  markers = []
}) => {
  return (
    <div className="w-full h-96">
      <Wrapper apiKey={apiKey} render={render}>
        <MapComponent center={center} zoom={zoom} markers={markers} />
      </Wrapper>
    </div>
  );
};

export default GoogleMap;
