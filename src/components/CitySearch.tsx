
import { useState, useEffect, useRef } from 'react';
import { City } from '@/utils/types';
import { weatherService } from '@/utils/weatherService';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface CitySearchProps {
  onCitySelect: (city: City) => void;
}

const CitySearch = ({ onCitySelect }: CitySearchProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Search cities when query changes
  useEffect(() => {
    const searchCities = async () => {
      if (query.length < 2) {
        setResults([]);
        setShowDropdown(false);
        return;
      }
      
      setLoading(true);
      try {
        const cities = await weatherService.getCities(query);
        setResults(cities);
        setShowDropdown(true);
      } catch (error) {
        console.error('Error searching cities:', error);
      } finally {
        setLoading(false);
      }
    };
    
    const debounceTimer = setTimeout(searchCities, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSelect = (city: City) => {
    onCitySelect(city);
    setQuery('');
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a city..."
          className="search-input pr-10"
          onFocus={() => query.length >= 2 && setShowDropdown(true)}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <Search size={18} />
        </div>
      </div>
      
      {showDropdown && (
        <div 
          ref={dropdownRef}
          className="absolute mt-1 w-full max-h-60 overflow-auto rounded-lg glassmorphism shadow-lg z-50 animate-fade-in"
        >
          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : results.length > 0 ? (
            <ul>
              {results.map((city, index) => (
                <li 
                  key={`${city.name}-${city.country}-${index}`}
                  className="p-3 hover:bg-white/40 cursor-pointer transition-colors duration-200 flex items-center justify-between"
                  onClick={() => handleSelect(city)}
                >
                  <span>{city.name}</span>
                  <span className="chip bg-primary/10 text-primary">{city.country}</span>
                </li>
              ))}
            </ul>
          ) : query.length >= 2 ? (
            <div className="p-4 text-center text-gray-500">No cities found</div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default CitySearch;
