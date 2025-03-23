
export interface WeatherData {
  id: string;
  city: string;
  country: string;
  temperature: number;
  condition: WeatherCondition;
  humidity: number;
  windSpeed: number;
  icon: string;
  timestamp: number;
}

export type WeatherCondition = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy';

export type TemperatureUnit = 'celsius' | 'fahrenheit';

export interface City {
  name: string;
  country: string;
}
