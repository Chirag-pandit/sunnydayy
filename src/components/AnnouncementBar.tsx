import React, { useState } from 'react';
import { X } from 'lucide-react';

const AnnouncementBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-primary text-secondary px-4 py-2 text-center relative">
      <p className="font-heading font-semibold">
        FREE SHIPPING ON ORDERS OVER $100
      </p>
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-secondary-dark"
        aria-label="Close announcement"
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default AnnouncementBar;