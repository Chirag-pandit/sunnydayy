import React from 'react';
import { Sun } from 'lucide-react';

interface SunnyDayLogoProps {
  className?: string;
}

const SunnyDayLogo: React.FC<SunnyDayLogoProps> = ({ className }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <Sun className="text-primary mr-2" size={32} strokeWidth={2.5} />
      <div className="font-heading font-extrabold text-2xl tracking-wider flex items-center">
        <span className="text-primary">SUNNY</span>
        <span className="text-gray-100">DAY</span>
      </div>
    </div>
  );
};

export default SunnyDayLogo;