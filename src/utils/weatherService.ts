
import { WeatherData, WeatherCondition, City } from './types';

// Predefined list of major cities
const popularCities: City[] = [
  { name: 'New York', country: 'US' },
  { name: 'London', country: 'UK' },
  { name: 'Tokyo', country: 'JP' },
  { name: 'Paris', country: 'FR' },
  { name: 'Sydney', country: 'AU' },
  { name: 'Singapore', country: 'SG' },
  { name: 'Berlin', country: 'DE' },
  { name: 'Toronto', country: 'CA' },
  { name: 'Dubai', country: 'AE' },
  { name: 'San Francisco', country: 'US' },
  { name: 'Rome', country: 'IT' },
  { name: 'Bangkok', country: 'TH' },
  { name: 'Mumbai', country: 'IN' },
  { name: 'Stockholm', country: 'SE' },
  { name: 'Madrid', country: 'ES' },
  { name: 'Seoul', country: 'KR' },
  { name: 'Barcelona', country: 'ES' },
  { name: 'Hong Kong', country: 'HK' },
  { name: 'Amsterdam', country: 'NL' },
  { name: 'Rio de Janeiro', country: 'BR' }
];

// Weather conditions with their corresponding icons
const weatherConditions: Record<WeatherCondition, string> = {
  sunny: 'sun',
  cloudy: 'cloud',
  rainy: 'cloud-rain',
  snowy: 'cloud-snow',
  stormy: 'cloud-lightning'
};

// Generate random weather data for a city
const generateWeatherData = (city: City): WeatherData => {
  const conditions: WeatherCondition[] = ['sunny', 'cloudy', 'rainy', 'snowy', 'stormy'];
  const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
  
  // Temperature range based on condition
  let tempMin = 0, tempMax = 0;
  switch (randomCondition) {
    case 'sunny': tempMin = 25; tempMax = 35; break;
    case 'cloudy': tempMin = 15; tempMax = 25; break;
    case 'rainy': tempMin = 10; tempMax = 20; break;
    case 'snowy': tempMin = -10; tempMax = 5; break;
    case 'stormy': tempMin = 10; tempMax = 20; break;
  }

  return {
    id: `${city.name.toLowerCase().replace(/\s/g, '_')}_${Date.now()}`,
    city: city.name,
    country: city.country,
    temperature: Math.floor(Math.random() * (tempMax - tempMin + 1)) + tempMin,
    condition: randomCondition,
    humidity: Math.floor(Math.random() * 70) + 30, // 30-100%
    windSpeed: Math.floor(Math.random() * 30) + 5, // 5-35 km/h
    icon: weatherConditions[randomCondition],
    timestamp: Date.now()
  };
};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Weather service object
export const weatherService = {
  // Get weather data for a city
  getWeatherForCity: async (cityName: string, countryCode: string = ''): Promise<WeatherData> => {
    // Simulate API call delay
    await delay(800 + Math.random() * 800);
    
    const city = { name: cityName, country: countryCode || 'Unknown' };
    return generateWeatherData(city);
  },
  
  // Convert Celsius to Fahrenheit
  celsiusToFahrenheit: (celsius: number): number => {
    return Math.round((celsius * 9/5) + 32);
  },
  
  // Convert Fahrenheit to Celsius
  fahrenheitToCelsius: (fahrenheit: number): number => {
    return Math.round((fahrenheit - 32) * 5/9);
  },
  
  // Get list of cities for autocomplete
  getCities: async (query: string): Promise<City[]> => {
    // Simulate API call delay
    await delay(300);
    
    if (!query) return [];
    
    const filteredCities = popularCities.filter(city => 
      city.name.toLowerCase().includes(query.toLowerCase())
    );
    
    return filteredCities.slice(0, 5); // Return max 5 results
  }
};
