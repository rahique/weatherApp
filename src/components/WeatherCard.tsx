
import { memo } from 'react';
import { WeatherData, TemperatureUnit } from '@/utils/types';
import { weatherService } from '@/utils/weatherService';
import { X, Droplets, Wind } from 'lucide-react';
import * as Icons from 'lucide-react';

interface WeatherCardProps {
  data: WeatherData;
  temperatureUnit: TemperatureUnit;
  onRemove: (id: string) => void;
}

const WeatherCard = memo(({ data, temperatureUnit, onRemove }: WeatherCardProps) => {
  // Display temperature based on selected unit
  const displayTemperature = temperatureUnit === 'celsius' 
    ? data.temperature 
    : weatherService.celsiusToFahrenheit(data.temperature);
  
  // Dynamically get the icon based on the weather condition
  const IconComponent = (Icons as any)[data.icon.charAt(0).toUpperCase() + data.icon.slice(1)];
  
  const getWeatherColor = (condition: string) => {
    switch (condition) {
      case 'sunny': return 'from-yellow-300 to-orange-400';
      case 'cloudy': return 'from-gray-300 to-gray-400';
      case 'rainy': return 'from-blue-300 to-blue-500';
      case 'snowy': return 'from-blue-100 to-blue-300';
      case 'stormy': return 'from-indigo-400 to-purple-600';
      default: return 'from-blue-300 to-blue-500';
    }
  };
  
  return (
    <div className="weather-card card-hover-effect overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <div className="flex items-center space-x-1">
              <span className="text-xl font-semibold">{data.city}</span>
              <span className="chip bg-primary/10 text-primary">{data.country}</span>
            </div>
            <p className="text-sm text-gray-600">
              {new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <button 
            onClick={() => onRemove(data.id)}
            className="p-1 rounded-full hover:bg-gray-200/50 transition-colors duration-200 text-gray-500 hover:text-gray-700"
            aria-label="Remove city"
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className={`p-3 rounded-full bg-gradient-to-br ${getWeatherColor(data.condition)}`}>
              {IconComponent && <IconComponent className="text-white" size={30} />}
            </div>
            <span className="ml-3 text-3xl font-light">
              {displayTemperature}°{temperatureUnit === 'celsius' ? 'C' : 'F'}
            </span>
          </div>
          <p className="text-lg capitalize">{data.condition}</p>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="flex items-center p-2 rounded-lg bg-blue-50 border border-blue-100">
            <Droplets className="text-blue-400 mr-2" size={18} />
            <div>
              <p className="text-xs text-gray-500">Humidity</p>
              <p className="font-medium">{data.humidity}%</p>
            </div>
          </div>
          <div className="flex items-center p-2 rounded-lg bg-blue-50 border border-blue-100">
            <Wind className="text-blue-400 mr-2" size={18} />
            <div>
              <p className="text-xs text-gray-500">Wind</p>
              <p className="font-medium">{data.windSpeed} km/h</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

WeatherCard.displayName = 'WeatherCard';

export default WeatherCard;
