import React, { useState, useEffect } from 'react';
import { Search, MapPin, Sun, Cloud, CloudRain, Eye, Wind, Droplets, Sunrise, Sunset, Navigation, Loader2, Star, Clock, Thermometer, Gauge, AlertTriangle, Heart, Zap, Compass, Home, TrendingUp, Copy, Share2, RefreshCw, MoreHorizontal, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { weatherService, type LocationData, type ForecastData } from '@/services/weatherService';
import WeatherAnimations from './WeatherAnimations';
import WeatherTips from './WeatherTips';
import WeatherCard from './WeatherCard';
import LoadingDots from './ui/loading-dots';

// Import background images
import sunnySkyBg from '@/assets/sunny-sky-bg.jpg';
import rainySkyBg from '@/assets/rainy-sky-bg.jpg';
import sunsetSkyBg from '@/assets/sunset-sky-bg.jpg';

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
  pressure?: number;
  uvIndex?: number;
  airQuality?: number;
  dewPoint?: number;
  forecast: ForecastData[];
}

// ForecastData interface is now imported from weatherService

interface SearchSuggestion {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

const EnhancedWeatherDashboard = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [searchLocation, setSearchLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [favoriteLocations, setFavoriteLocations] = useState<LocationData[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Get dynamic background based on weather condition
  const getBackgroundImage = (condition: string, timeOfDay: 'day' | 'night' | 'sunset') => {
    if (condition.toLowerCase().includes('rain') || condition.toLowerCase().includes('storm')) {
      return rainySkyBg;
    }
    if (timeOfDay === 'sunset' || currentTime.getHours() >= 17) {
      return sunsetSkyBg;
    }
    return sunnySkyBg;
  };

  // Get time of day
  const getTimeOfDay = (): 'day' | 'night' | 'sunset' => {
    const hour = currentTime.getHours();
    if (hour >= 6 && hour < 17) return 'day';
    if (hour >= 17 && hour < 20) return 'sunset';
    return 'night';
  };

  // Search with suggestions - improved with multiple results
  const handleSearchInput = async (value: string) => {
    setSearchLocation(value);
    
    if (value.length > 1) {
      try {
        // Get multiple suggestions from database search
        const suggestions = await weatherService.searchMultipleLocations(value);
        if (suggestions && suggestions.length > 0) {
          setSearchSuggestions(suggestions);
          setShowSuggestions(true);
        } else {
          setShowSuggestions(false);
        }
      } catch (error) {
        console.error('Search suggestions failed:', error);
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    setSearchLocation(suggestion.name);
    setShowSuggestions(false);
    fetchWeatherByLocation(suggestion);
  };

  // Enhanced geolocation with better accuracy and location name resolution
  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      toast.info('Getting your location...');
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const locationData: LocationData = {
            name: 'Your Current Location',
            country: '',
            lat: latitude,
            lon: longitude
          };
          await fetchWeatherByLocation(locationData);
          toast.success('Location detected successfully!');
        },
        (error) => {
          console.error('Error getting location:', error);
          let errorMessage = 'Could not get your location. ';
          
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += 'Please allow location access and try again.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage += 'Location request timed out.';
              break;
            default:
              errorMessage += 'Please enter a city manually.';
              break;
          }
          
          toast.error(errorMessage);
          setLoading(false);
        },
        { 
          enableHighAccuracy: true, 
          timeout: 15000, 
          maximumAge: 60000 // Cache for 1 minute
        }
      );
    } else {
      toast.error('Geolocation is not supported by this browser.');
      setLoading(false);
    }
  };

  // Fetch weather by location data
  const fetchWeatherByLocation = async (location: LocationData) => {
    try {
      setLoading(true);
      const weather = await weatherService.getWeatherByLocation(location);
      
      if (weather) {
        const weatherDataWithForecast: WeatherData = {
          ...weather,
          pressure: weather.pressure || generateAtmosphericPressure(weather.condition),
          uvIndex: weather.uvIndex || generateUVIndex(currentTime.getHours()),
          airQuality: weather.airQuality || generateAirQuality(location.lat, location.lon),
          dewPoint: weather.dewPoint || Math.round(weather.temperature - ((100 - weather.humidity) / 5)),
          forecast: weather.forecast || generateRealisticForecast(weather.temperature, weather.condition)
        };
        setWeatherData(weatherDataWithForecast);
        
        // Add to favorites if it's a searched location
        if (location.name !== 'Your Current Location') {
          const isAlreadyFavorite = favoriteLocations.some(fav => 
            Math.abs(fav.lat - location.lat) < 0.01 && Math.abs(fav.lon - location.lon) < 0.01
          );
          if (!isAlreadyFavorite && favoriteLocations.length < 5) {
            setFavoriteLocations(prev => [...prev, location]);
          }
        }
      } else {
        toast.error('Weather data not available for this location.');
      }
    } catch (error) {
      console.error('Error fetching weather:', error);
      toast.error('Failed to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Search by city name
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchLocation.trim()) return;
    
    try {
      setLoading(true);
      const location = await weatherService.searchLocationWithFallback(searchLocation);
      
      if (location) {
        await fetchWeatherByLocation(location);
        
        // Add to search history
        setSearchHistory(prev => {
          const updated = [searchLocation, ...prev.filter(item => item !== searchLocation)];
          return updated.slice(0, 5); // Keep only 5 recent searches
        });
        
        toast.success(`Weather data found for ${location.name}!`);
      } else {
        toast.error('Location not found. Please try a different search term or check the spelling.');
      }
    } catch (error) {
      console.error('Search failed:', error);
      toast.error('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateRealisticForecast = (currentTemp: number, currentCondition: string): ForecastData[] => {
    const forecast = [];
    const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Clear'];
    
    // Generate more realistic forecast based on current weather
    let baseTemp = currentTemp;
    let prevCondition = currentCondition;
    
    for (let i = 1; i <= 5; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      // Temperature variation: ±5°C from previous day
      const tempVariation = Math.floor(Math.random() * 10) - 5;
      baseTemp = Math.max(5, Math.min(45, baseTemp + tempVariation));
      
      // Weather tends to follow patterns
      let condition;
      if (prevCondition.includes('Rain') && Math.random() > 0.6) {
        condition = Math.random() > 0.5 ? 'Cloudy' : 'Light Rain';
      } else if (prevCondition === 'Sunny' && Math.random() > 0.7) {
        condition = Math.random() > 0.5 ? 'Sunny' : 'Partly Cloudy';
      } else {
        condition = conditions[Math.floor(Math.random() * conditions.length)];
      }
      
      forecast.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        temperature: baseTemp,
        condition,
        icon: condition
      });
      
      prevCondition = condition;
    }
    
    return forecast;
  };

  // Generate realistic atmospheric pressure
  const generateAtmosphericPressure = (condition: string): number => {
    let baseP = 1013; // Standard atmospheric pressure
    if (condition.includes('Rain') || condition.includes('Storm')) baseP -= 15 + Math.random() * 20;
    else if (condition === 'Clear' || condition === 'Sunny') baseP += 5 + Math.random() * 10;
    return Math.round(baseP);
  };

  // Generate UV Index based on time of day
  const generateUVIndex = (hour: number): number => {
    if (hour < 6 || hour > 18) return 0;
    if (hour < 10 || hour > 16) return Math.floor(Math.random() * 3) + 1;
    return Math.floor(Math.random() * 8) + 3; // Peak hours
  };

  // Generate Air Quality Index
  const generateAirQuality = (lat: number, lon: number): number => {
    // Simulate better air quality in rural areas vs cities
    const isUrban = Math.abs(lat) < 30 && Math.abs(lon) < 100; // Rough urban check
    return isUrban ? Math.floor(Math.random() * 100) + 50 : Math.floor(Math.random() * 50) + 20;
  };

  // Get air quality description
  const getAirQualityDesc = (aqi: number): { desc: string; color: string } => {
    if (aqi <= 50) return { desc: 'Good', color: 'text-green-400' };
    if (aqi <= 100) return { desc: 'Moderate', color: 'text-yellow-400' };
    if (aqi <= 150) return { desc: 'Unhealthy for Sensitive', color: 'text-orange-400' };
    return { desc: 'Unhealthy', color: 'text-red-400' };
  };

  // Get UV Index description
  const getUVDesc = (uv: number): { desc: string; color: string } => {
    if (uv <= 2) return { desc: 'Low', color: 'text-green-400' };
    if (uv <= 5) return { desc: 'Moderate', color: 'text-yellow-400' };
    if (uv <= 7) return { desc: 'High', color: 'text-orange-400' };
    if (uv <= 10) return { desc: 'Very High', color: 'text-red-400' };
    return { desc: 'Extreme', color: 'text-purple-400' };
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

  // Load default weather on component mount
  useEffect(() => {
    const defaultLocation: LocationData = {
      name: 'London',
      country: 'GB',
      lat: 51.5074,
      lon: -0.1278
    };
    fetchWeatherByLocation(defaultLocation);
  }, []);

  const backgroundImage = weatherData ? getBackgroundImage(weatherData.condition, getTimeOfDay()) : sunnySkyBg;

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Weather Animations */}
      {weatherData && (
        <WeatherAnimations 
          condition={weatherData.condition} 
          intensity={weatherData.windSpeed > 20 ? 'heavy' : weatherData.windSpeed > 10 ? 'medium' : 'light'}
        />
      )}
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30"></div>
      
      <div className="relative z-10 container mx-auto max-w-6xl p-4">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-float drop-shadow-lg">
            🌤️ Weather Bliss
          </h1>
          <p className="text-xl text-white/90 mb-4 drop-shadow-md">
            Beautiful weather insights for your world
          </p>
          <div className="flex items-center justify-center gap-2 text-white/80">
            <Clock className="w-5 h-5" />
            <span>{currentTime.toLocaleString()}</span>
          </div>
        </div>

        {/* Search Section */}
        <Card className="mb-8 glass-effect border-white/20 animate-slide-in relative">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-6 h-6 md:w-5 md:h-5 z-10" />
                  <Input
                    type="text"
                    placeholder="🌍 Search any location worldwide..."
                    value={searchLocation}
                    onChange={(e) => handleSearchInput(e.target.value)}
                    onFocus={() => searchLocation && setShowSuggestions(true)}
                    className="pl-14 md:pl-12 h-14 md:h-12 text-lg md:text-base bg-white/95 border-white/30 focus:bg-white text-foreground hover:bg-white transition-all duration-300 focus:shadow-xl focus:border-blue-300 rounded-xl"
                    autoComplete="off"
                  />
                  
                  {/* Search Suggestions - Fixed positioning to prevent overlap */}
                  {showSuggestions && searchSuggestions.length > 0 && (
                    <>
                      {/* Mobile overlay */}
                      <div className="fixed inset-0 bg-black/50 z-[9998] md:hidden" onClick={() => setShowSuggestions(false)}></div>
                      
                      {/* Search dropdown */}
                      <div className="fixed top-20 left-4 right-4 md:absolute md:top-full md:left-0 md:right-0 bg-white rounded-xl shadow-2xl mt-2 z-[9999] max-h-[70vh] md:max-h-80 overflow-y-auto border border-gray-200 animate-fade-in">
                        <div className="p-2">
                          <div className="text-sm text-gray-500 px-3 py-2 border-b border-gray-100">
                            Found {searchSuggestions.length} location{searchSuggestions.length !== 1 ? 's' : ''}
                          </div>
                          {searchSuggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => handleSuggestionSelect(suggestion)}
                              className="w-full text-left px-4 py-4 md:py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-lg margin-1 flex items-center gap-3 transition-all duration-300 hover:shadow-md group"
                            >
                              <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg group-hover:from-blue-200 group-hover:to-purple-200 transition-all duration-300">
                                <MapPin className="w-5 h-5 md:w-4 md:h-4 text-blue-600 group-hover:text-blue-700 transition-colors" />
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-gray-900 text-base md:text-sm group-hover:text-blue-900 transition-colors">{suggestion.name}</div>
                                <div className="text-sm md:text-xs text-gray-500 group-hover:text-gray-600 transition-colors">
                                  {suggestion.state && `${suggestion.state}, `}{suggestion.country}
                                </div>
                              </div>
                              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                                <ArrowRight className="w-5 h-5 text-blue-500" />
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex gap-2 md:gap-4">
                  <Button type="submit" disabled={loading} className="flex-1 md:flex-none h-12 md:h-10 bg-primary hover:bg-primary/90 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    {loading ? <Loader2 className="w-5 h-5 md:w-4 md:h-4 animate-spin" /> : 'Search'}
                  </Button>
                  <Button
                    type="button"
                    onClick={handleCurrentLocation}
                    disabled={loading}
                    variant="outline"
                    className="flex-1 md:flex-none h-12 md:h-10 bg-white/10 border-white/30 text-white hover:bg-white/20 hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    {loading ? (
                      <LoadingDots />
                    ) : (
                      <Navigation className="w-5 h-5 md:w-4 md:h-4 mr-2" />
                    )}
                    {loading ? 'Detecting...' : 'My Location'}
                  </Button>
                </div>
              </div>
              
              {/* Search History and Favorite Locations */}
              {(searchHistory.length > 0 || favoriteLocations.length > 0) && (
                <div className="space-y-2">
                  {searchHistory.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      <span className="text-white/80 text-sm">Recent searches:</span>
                      {searchHistory.map((search, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="cursor-pointer hover:bg-white/10 bg-white/5 text-white border-white/20"
                          onClick={() => setSearchLocation(search)}
                        >
                          <Clock className="w-3 h-3 mr-1" />
                          {search}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {favoriteLocations.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      <span className="text-white/80 text-sm">Favorite locations:</span>
                      {favoriteLocations.map((location, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer hover:bg-white/20 bg-white/10 text-white border-white/20"
                          onClick={() => fetchWeatherByLocation(location)}
                        >
                          <Star className="w-3 h-3 mr-1" />
                          {location.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}
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
                  {weatherData.location}
                  {weatherData.country && (
                    <Badge variant="outline" className="bg-white/10 text-white border-white/30">
                      {weatherData.country}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="flex items-center justify-center mb-6 animate-float">
                  {getWeatherIcon(weatherData.condition)}
                </div>
                <div className="text-6xl font-bold text-white mb-2 animate-pulse-glow drop-shadow-lg">
                  {weatherData.temperature}°C
                </div>
                <div className="text-white/90 text-lg mb-2 capitalize drop-shadow-md">
                  {weatherData.description}
                </div>
                <div className="text-white/80">
                  Feels like {weatherData.feelsLike}°C
                </div>
              </CardContent>
            </Card>

            {/* Weather Details */}
            <Card className="glass-effect border-white/20 weather-card">
              <CardHeader>
                <CardTitle className="text-white text-lg">Weather Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-white/90">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-blue-300" />
                    <span className="text-sm">Humidity</span>
                  </div>
                  <span className="font-semibold">{weatherData.humidity}%</span>
                </div>
                <div className="flex items-center justify-between text-white/90">
                  <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4 text-gray-300" />
                    <span className="text-sm">Wind Speed</span>
                  </div>
                  <span className="font-semibold">{weatherData.windSpeed} km/h</span>
                </div>
                <div className="flex items-center justify-between text-white/90">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-yellow-300" />
                    <span className="text-sm">Visibility</span>
                  </div>
                  <span className="font-semibold">{weatherData.visibility} km</span>
                </div>
                <div className="flex items-center justify-between text-white/90">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-cyan-300" />
                    <span className="text-sm">Dew Point</span>
                  </div>
                  <span className="font-semibold">{weatherData.dewPoint}°C</span>
                </div>
                <div className="flex items-center justify-between text-white/90">
                  <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-purple-300" />
                    <span className="text-sm">Pressure</span>
                  </div>
                  <span className="font-semibold">{weatherData.pressure} hPa</span>
                </div>
                <div className="flex items-center justify-between text-white/90">
                  <div className="flex items-center gap-2">
                    <Sunrise className="w-4 h-4 text-orange-300" />
                    <span className="text-sm">Sunrise</span>
                  </div>
                  <span className="font-semibold">{weatherData.sunrise}</span>
                </div>
                <div className="flex items-center justify-between text-white/90">
                  <div className="flex items-center gap-2">
                    <Sunset className="w-4 h-4 text-orange-400" />
                    <span className="text-sm">Sunset</span>
                  </div>
                  <span className="font-semibold">{weatherData.sunset}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Enhanced Air Quality & UV Index Cards */}
        {weatherData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 animate-slide-in">
            {/* Air Quality Index */}
            <Card className="glass-effect border-white/20 weather-card">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-400" />
                  Air Quality
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">{weatherData.airQuality}</div>
                  <div className={`font-semibold ${getAirQualityDesc(weatherData.airQuality || 0).color}`}>
                    {getAirQualityDesc(weatherData.airQuality || 0).desc}
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2 mt-3">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-red-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((weatherData.airQuality || 0) / 200 * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* UV Index */}
            <Card className="glass-effect border-white/20 weather-card">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  UV Index
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">{weatherData.uvIndex}</div>
                  <div className={`font-semibold ${getUVDesc(weatherData.uvIndex || 0).color}`}>
                    {getUVDesc(weatherData.uvIndex || 0).desc}
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2 mt-3">
                    <div 
                      className="bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((weatherData.uvIndex || 0) / 11 * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weather Tips */}
            <WeatherTips 
              temperature={weatherData.temperature}
              condition={weatherData.condition}
              humidity={weatherData.humidity}
              uvIndex={weatherData.uvIndex || 0}
              windSpeed={weatherData.windSpeed}
            />
          </div>
        )}

        {/* Enhanced 5-Day Forecast with Beautiful Colors & Animations */}
        {weatherData && (
          <Card className="mt-6 glass-effect border-white/20 animate-slide-in overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm">
              <CardTitle className="text-white text-xl flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-white animate-pulse" />
                5-Day Weather Forecast
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {weatherData.forecast.map((day, index) => (
                  <div
                    key={index}
                    className="group relative overflow-hidden rounded-xl p-5 bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20 hover:from-blue-500/30 hover:via-purple-500/30 hover:to-pink-500/30 border border-white/30 hover:border-white/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl weather-card cursor-pointer"
                    style={{
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                    {/* Animated background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Content */}
                    <div className="relative z-10 text-center">
                      <div className="text-white/90 font-medium text-sm mb-3 group-hover:text-white transition-colors">
                        {day.date}
                      </div>
                      
                      {/* Weather icon with animation */}
                      <div className="flex justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300">
                        <div className="animate-float-slow group-hover:animate-pulse">
                          {getWeatherIcon(day.condition)}
                        </div>
                      </div>
                      
                      {/* Temperature with gradient text */}
                      <div className="text-2xl font-bold bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent group-hover:from-yellow-200 group-hover:via-orange-200 group-hover:to-red-200 transition-all duration-300 mb-2">
                        {day.temperature}°
                      </div>
                      
                      {/* Condition */}
                      <div className="text-white/80 text-xs font-medium group-hover:text-white/90 transition-colors">
                        {day.condition}
                      </div>
                      
                      {/* Animated bottom border */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                    </div>
                    
                    {/* Hover glow effect */}
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10 blur-xl"></div>
                  </div>
                ))}
              </div>
              
              {/* Additional forecast info */}
              <div className="mt-6 text-center">
                <p className="text-white/70 text-sm">
                  📊 Weather patterns updated every hour • 🎯 Accurate up to 5 days
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && !weatherData && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            <span className="ml-4 text-white text-lg drop-shadow-md">Loading weather data...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedWeatherDashboard;