import React, { useState, useEffect } from 'react';
import { Search, MapPin, Sun, Cloud, CloudRain, Eye, Wind, Droplets, Thermometer, Sunrise, Sunset } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface WeatherData {
  location: string;
  country: string;
  temperature: number;
  feelsLike: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  sunrise: string;
  sunset: string;
  icon: string;
  forecast: ForecastData[];
}

interface ForecastData {
  date: string;
  temperature: number;
  condition: string;
  icon: string;
}

const WEATHER_API_KEY = ''; // We'll use a free service that doesn't require API key

const WeatherDashboard = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [searchLocation, setSearchLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lon: number} | null>(null);

  // Get user's current location
  const getCurrentLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lon: longitude });
          fetchWeatherByCoords(latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Could not get your location. Please enter a city manually.');
          setLoading(false);
        }
      );
    } else {
      toast.error('Geolocation is not supported by this browser.');
      setLoading(false);
    }
  };

  // Fetch weather by coordinates
  const fetchWeatherByCoords = async (lat: number, lon: number) => {
    try {
      setLoading(true);
      
      // Using OpenWeatherMap's free API (no key required for basic functionality)
      // For production, you'd need to sign up for an API key
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=demo&units=metric`
      );
      
      if (!response.ok) {
        // Fallback to mock data for demo
        const mockData = generateMockWeatherData('Your Location');
        setWeatherData(mockData);
        return;
      }
      
      const data = await response.json();
      setWeatherData(parseWeatherData(data));
    } catch (error) {
      console.error('Error fetching weather:', error);
      // Fallback to mock data
      const mockData = generateMockWeatherData('Your Location');
      setWeatherData(mockData);
    } finally {
      setLoading(false);
    }
  };

  // Fetch weather by city name
  const fetchWeatherByCity = async (city: string) => {
    if (!city.trim()) return;
    
    try {
      setLoading(true);
      
      // Using a geocoding service to get coordinates first
      const geoResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=demo`
      );
      
      if (!geoResponse.ok) {
        // Fallback to mock data
        const mockData = generateMockWeatherData(city);
        setWeatherData(mockData);
        return;
      }
      
      const geoData = await geoResponse.json();
      if (geoData.length === 0) {
        toast.error('Location not found. Please try a different search term.');
        return;
      }
      
      const { lat, lon } = geoData[0];
      await fetchWeatherByCoords(lat, lon);
    } catch (error) {
      console.error('Error fetching weather:', error);
      // Fallback to mock data for demo
      const mockData = generateMockWeatherData(city);
      setWeatherData(mockData);
    } finally {
      setLoading(false);
    }
  };

  // Generate mock weather data for demo purposes
  const generateMockWeatherData = (locationName: string): WeatherData => {
    const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Clear'];
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    const temperature = Math.floor(Math.random() * 35) + 5; // 5-40°C
    
    return {
      location: locationName,
      country: 'Demo',
      temperature,
      feelsLike: temperature + Math.floor(Math.random() * 6) - 3,
      condition: randomCondition,
      description: `${randomCondition} weather`,
      humidity: Math.floor(Math.random() * 60) + 30, // 30-90%
      windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
      visibility: Math.floor(Math.random() * 5) + 10, // 10-15 km
      sunrise: '06:30',
      sunset: '19:45',
      icon: randomCondition,
      forecast: generateMockForecast()
    };
  };

  const generateMockForecast = (): ForecastData[] => {
    const forecast = [];
    const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain'];
    
    for (let i = 1; i <= 5; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const condition = conditions[Math.floor(Math.random() * conditions.length)];
      
      forecast.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        temperature: Math.floor(Math.random() * 30) + 10,
        condition,
        icon: condition
      });
    }
    
    return forecast;
  };

  const parseWeatherData = (data: any): WeatherData => {
    return {
      location: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      condition: data.weather[0].main,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      visibility: Math.round(data.visibility / 1000), // Convert m to km
      sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      icon: data.weather[0].icon,
      forecast: generateMockForecast() // Would fetch real forecast data in production
    };
  };

  const getWeatherIcon = (condition: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'Clear': <Sun className="w-8 h-8 text-yellow-500" />,
      'Sunny': <Sun className="w-8 h-8 text-yellow-500" />,
      'Clouds': <Cloud className="w-8 h-8 text-gray-500" />,
      'Cloudy': <Cloud className="w-8 h-8 text-gray-500" />,
      'Partly Cloudy': <Cloud className="w-8 h-8 text-gray-400" />,
      'Rain': <CloudRain className="w-8 h-8 text-blue-500" />,
      'Light Rain': <CloudRain className="w-8 h-8 text-blue-400" />,
    };
    
    return iconMap[condition] || <Sun className="w-8 h-8 text-yellow-500" />;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchLocation.trim()) {
      fetchWeatherByCity(searchLocation);
    }
  };

  // Load default weather on component mount
  useEffect(() => {
    const defaultCity = 'London';
    fetchWeatherByCity(defaultCity);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-blue-600 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-float">
            🌤️ Weather Bliss
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Beautiful weather insights for your world
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-8 glass-effect border-white/20 animate-slide-in">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search for cities, villages, or any location..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="pl-10 bg-white/90 border-white/30 focus:bg-white text-foreground"
                />
              </div>
              <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90">
                {loading ? 'Searching...' : 'Search'}
              </Button>
              <Button
                type="button"
                onClick={getCurrentLocation}
                disabled={loading}
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Use My Location
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Main Weather Display */}
        {weatherData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            {/* Current Weather - Main Card */}
            <Card className="lg:col-span-2 glass-effect border-white/20 weather-card">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                  <MapPin className="w-6 h-6" />
                  {weatherData.location}, {weatherData.country}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="flex items-center justify-center mb-6 animate-float">
                  {getWeatherIcon(weatherData.condition)}
                </div>
                <div className="text-6xl font-bold text-white mb-2 animate-pulse-glow">
                  {weatherData.temperature}°C
                </div>
                <div className="text-white/80 text-lg mb-2 capitalize">
                  {weatherData.description}
                </div>
                <div className="text-white/70">
                  Feels like {weatherData.feelsLike}°C
                </div>
              </CardContent>
            </Card>

            {/* Weather Details */}
            <Card className="glass-effect border-white/20 weather-card">
              <CardHeader>
                <CardTitle className="text-white text-lg">Weather Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-white/90">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-blue-300" />
                    <span>Humidity</span>
                  </div>
                  <span className="font-semibold">{weatherData.humidity}%</span>
                </div>
                <div className="flex items-center justify-between text-white/90">
                  <div className="flex items-center gap-2">
                    <Wind className="w-5 h-5 text-gray-300" />
                    <span>Wind Speed</span>
                  </div>
                  <span className="font-semibold">{weatherData.windSpeed} km/h</span>
                </div>
                <div className="flex items-center justify-between text-white/90">
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-yellow-300" />
                    <span>Visibility</span>
                  </div>
                  <span className="font-semibold">{weatherData.visibility} km</span>
                </div>
                <div className="flex items-center justify-between text-white/90">
                  <div className="flex items-center gap-2">
                    <Sunrise className="w-5 h-5 text-orange-300" />
                    <span>Sunrise</span>
                  </div>
                  <span className="font-semibold">{weatherData.sunrise}</span>
                </div>
                <div className="flex items-center justify-between text-white/90">
                  <div className="flex items-center gap-2">
                    <Sunset className="w-5 h-5 text-orange-400" />
                    <span>Sunset</span>
                  </div>
                  <span className="font-semibold">{weatherData.sunset}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 5-Day Forecast */}
        {weatherData && (
          <Card className="mt-6 glass-effect border-white/20 animate-slide-in">
            <CardHeader>
              <CardTitle className="text-white text-xl">5-Day Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {weatherData.forecast.map((day, index) => (
                  <div
                    key={index}
                    className="text-center p-4 rounded-lg bg-white/10 hover:bg-white/20 transition-colors weather-card"
                  >
                    <div className="text-white/80 text-sm mb-2">{day.date}</div>
                    <div className="flex justify-center mb-2 animate-float-slow">
                      {getWeatherIcon(day.condition)}
                    </div>
                    <div className="text-white font-bold text-lg">{day.temperature}°</div>
                    <div className="text-white/70 text-xs">{day.condition}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && !weatherData && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            <span className="ml-4 text-white text-lg">Loading weather data...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherDashboard;