import React from 'react';

interface SalonMarkerProps {
  salon: any;
}

const SalonMarker: React.FC<SalonMarkerProps> = ({ salon }) => {
  return (
    <div style={{
      backgroundColor: '#007AFF',
      color: 'white',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 'bold'
    }}>
      {salon.name} ({salon.queue || 0})
    </div>
  );
};

export default SalonMarker;
