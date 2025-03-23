
import { useState, useEffect } from 'react';
import { weatherService } from '@/utils/weatherService';
import { WeatherData, TemperatureUnit, City } from '@/utils/types';
import CitySearch from '@/components/CitySearch';
import WeatherCard from '@/components/WeatherCard';
import TemperatureToggle from '@/components/TemperatureToggle';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// Default cities to load
const DEFAULT_CITIES = [
  { name: 'New York', country: 'US' },
  { name: 'London', country: 'UK' },
  { name: 'Tokyo', country: 'JP' }
];

const Index = () => {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>('celsius');
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  // Load saved cities from localStorage
  useEffect(() => {
    const savedCities = localStorage.getItem('weatherCities');
    const citiesToLoad = savedCities ? JSON.parse(savedCities) : DEFAULT_CITIES;
    
    const loadCities = async () => {
      setLoading(true);
      try {
        const weatherPromises = citiesToLoad.map((city: City) => 
          weatherService.getWeatherForCity(city.name, city.country)
        );
        
        const results = await Promise.all(weatherPromises);
        setWeatherData(results);
      } catch (error) {
        console.error('Error loading weather data:', error);
        toast.error('Failed to load weather data');
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    };
    
    loadCities();
  }, []);

  // Save cities to localStorage when they change
  useEffect(() => {
    if (!initialLoad) {
      const citiesToSave = weatherData.map(data => ({
        name: data.city,
        country: data.country
      }));
      localStorage.setItem('weatherCities', JSON.stringify(citiesToSave));
    }
  }, [weatherData, initialLoad]);

  // Add a new city
  const handleAddCity = async (city: City) => {
    // Check if city already exists
    const exists = weatherData.some(data => 
      data.city.toLowerCase() === city.name.toLowerCase() && 
      data.country === city.country
    );
    
    if (exists) {
      toast.info(`${city.name} is already in your dashboard`);
      return;
    }
    
    setLoading(true);
    try {
      const newCityData = await weatherService.getWeatherForCity(city.name, city.country);
      setWeatherData(prev => [...prev, newCityData]);
      toast.success(`Added ${city.name} to your dashboard`);
    } catch (error) {
      console.error('Error adding city:', error);
      toast.error(`Failed to add ${city.name}`);
    } finally {
      setLoading(false);
    }
  };

  // Remove a city
  const handleRemoveCity = (id: string) => {
    setWeatherData(prev => prev.filter(data => data.id !== id));
    toast.success('City removed from dashboard');
  };

  // Change temperature unit
  const handleUnitChange = (unit: TemperatureUnit) => {
    setTemperatureUnit(unit);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="animate-slide-down">
        <h1 className="text-4xl font-light mb-2 text-center">Weather Dashboard</h1>
        <p className="text-gray-500 mb-8 text-center">
          Real-time weather information for your favorite cities
        </p>
      </div>
      
      <div className="mb-8 max-w-lg mx-auto animate-slide-up">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-grow">
            <CitySearch onCitySelect={handleAddCity} />
          </div>
          <div className="flex justify-center">
            <TemperatureToggle unit={temperatureUnit} onChange={handleUnitChange} />
          </div>
        </div>
      </div>
      
      {loading && initialLoad ? (
        <div className="flex flex-col items-center justify-center h-64 animate-fade-in">
          <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
          <p className="text-gray-500">Loading weather data...</p>
        </div>
      ) : weatherData.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {weatherData.map((data, index) => (
            <div 
              key={data.id} 
              className="animate-slide-up" 
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <WeatherCard 
                data={data} 
                temperatureUnit={temperatureUnit} 
                onRemove={handleRemoveCity} 
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-12 glassmorphism rounded-xl animate-fade-in">
          <h3 className="text-xl font-medium mb-2">No cities added yet</h3>
          <p className="text-gray-500 mb-4">
            Search for a city above to add it to your dashboard
          </p>
        </div>
      )}
      
      <footer className="mt-16 text-center text-gray-500 text-sm animate-fade-in">
        <p>Weather data is simulated for demonstration purposes</p>
        <p className="mt-1">Designed with ❤️ for simplicity and elegance</p>
      </footer>
    </div>
  );
};

export default Index;
