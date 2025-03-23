
import { useState, useEffect } from 'react';
import { TemperatureUnit } from '@/utils/types';
import { Button } from '@/components/ui/button';
import { motion as FramerMotion } from 'framer-motion';

interface TemperatureToggleProps {
  unit: TemperatureUnit;
  onChange: (unit: TemperatureUnit) => void;
}

const TemperatureToggle = ({ unit, onChange }: TemperatureToggleProps) => {
  const [mounted, setMounted] = useState(false);
  
  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;
  
  return (
    <div className="inline-flex items-center justify-center p-1 rounded-lg glassmorphism">
      <div className="relative flex">
        <Button
          variant="ghost"
          size="sm"
          className={`relative z-10 px-4 py-2 rounded-md transition-all duration-300 ${
            unit === 'celsius' ? 'text-white' : 'text-gray-600'
          }`}
          onClick={() => onChange('celsius')}
        >
          °C
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className={`relative z-10 px-4 py-2 rounded-md transition-all duration-300 ${
            unit === 'fahrenheit' ? 'text-white' : 'text-gray-600'
          }`}
          onClick={() => onChange('fahrenheit')}
        >
          °F
        </Button>
        
        <FramerMotion.div
          className="absolute top-0 h-full rounded-md bg-primary"
          initial={false}
          animate={{
            x: unit === 'celsius' ? 0 : '100%',
            width: '50%'
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      </div>
    </div>
  );
};

export default TemperatureToggle;
