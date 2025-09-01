import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Sun, Cloud, CloudRain, Eye, Wind, Droplets, Sunrise, Sunset, Navigation, Loader2, Star, Clock, Thermometer, Gauge, AlertTriangle, Heart, Zap, Compass, Home, TrendingUp, Copy, Share2, RefreshCw, MoreHorizontal, ArrowRight, X, Bell, Palette, Globe, BarChart3, Moon, Calendar } from 'lucide-react';
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
import WeatherFooter from './WeatherFooter';

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
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Animated placeholders
  const placeholders = [
    "🏙️ Search New York, Paris, Tokyo...",
    "🏝️ Discover Maldives, Bali, Hawaii...", 
    "🗻 Explore Alps, Himalayas, Rockies...",
    "🌆 Find London, Dubai, Sydney...",
    "🏘️ Search your hometown...",
    "🌍 Explore any place on Earth..."
  ];

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Animated placeholder rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);
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
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      {/* Responsive cloud background */}
      <div 
        className="fixed inset-0 w-full h-full opacity-20 z-0" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill='%233a0ca3' fill-opacity='0.2'%3E%3Cpath d='M25 40c0-13.8 11.2-25 25-25s25 11.2 25 25c0 1.5-.1 3-.3 4.4 8.3 2.7 14.3 10.4 14.3 19.6 0 11.3-9.2 20.5-20.5 20.5H31c-11.3 0-20.5-9.2-20.5-20.5 0-9.2 6-17 14.3-19.6-.2-1.4-.3-2.9-.3-4.4z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '200px 150px',
          backgroundRepeat: 'repeat',
          minHeight: '100vh',
          minWidth: '100vw',
          width: '100%',
          height: '100%'
        }}
      ></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white/10 to-blue-50/10"></div>
      
      <div className="flex-1 relative">
        {/* Weather Animations */}
        {weatherData && (
          <WeatherAnimations 
            condition={weatherData.condition} 
            intensity={weatherData.windSpeed > 20 ? 'heavy' : weatherData.windSpeed > 10 ? 'medium' : 'light'}
          />
        )}
        
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30"></div>
        
        <div className="relative z-10 container mx-auto max-w-7xl p-4">
          {/* Search Section - Moved to top */}
          <Card className="mb-8 bg-white/95 backdrop-blur-md border-2 animate-slide-in relative overflow-visible shadow-xl" style={{ borderColor: '#3a0ca3' }}>
            <CardContent className="p-6">
              <form onSubmit={handleSearch} className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 md:w-5 md:h-5 z-10" style={{ color: '#3a0ca3' }} />
                    {searchLocation && (
                      <Button
                        type="button"
                        onClick={() => {
                          setSearchLocation('');
                          setShowSuggestions(false);
                          searchInputRef.current?.focus();
                        }}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-1 h-auto bg-transparent hover:bg-slate-100 rounded-full transition-all duration-200"
                      >
                        <X className="w-5 h-5 text-slate-500 hover:text-slate-700" />
                      </Button>
                    )}
                    <Input
                      ref={searchInputRef}
                      type="text"
                      placeholder={placeholders[placeholderIndex]}
                      value={searchLocation}
                      onChange={(e) => handleSearchInput(e.target.value)}
                      onFocus={() => searchLocation && setShowSuggestions(true)}
                      className="pl-14 pr-12 md:pl-12 h-16 md:h-14 text-lg md:text-base bg-white border-2 focus:bg-white text-slate-800 hover:bg-gray-50 transition-all duration-300 focus:shadow-xl rounded-xl placeholder:text-slate-500 placeholder:transition-all placeholder:duration-500"
                      style={{ borderColor: '#3a0ca3', boxShadow: showSuggestions ? '0 0 20px rgba(58, 12, 163, 0.2)' : 'none' }}
                      autoComplete="off"
                    />
                    
                    {/* Search Suggestions - Fixed positioning to avoid overlap */}
                    {showSuggestions && searchSuggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-white border-2 rounded-xl shadow-2xl max-h-80 overflow-y-auto" style={{ borderColor: '#3a0ca3' }}>
                        {searchSuggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            className="p-4 hover:bg-blue-50 cursor-pointer border-b last:border-b-0 transition-all duration-200"
                            onClick={() => handleSuggestionSelect(suggestion)}
                          >
                            <div className="flex items-center gap-3">
                              <MapPin className="w-4 h-4 text-slate-500 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-slate-900 truncate">{suggestion.name}</p>
                                <p className="text-sm text-slate-600 truncate">
                                  {suggestion.state ? `${suggestion.state}, ` : ''}{suggestion.country}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="h-16 md:h-14 px-6 md:px-4 text-lg md:text-base font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
                      style={{ backgroundColor: '#3a0ca3', color: 'white' }}
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                      <span className="ml-2 hidden md:inline">Search</span>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCurrentLocation}
                      disabled={loading}
                      className="h-16 md:h-14 px-6 md:px-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg border-2"
                      style={{ borderColor: '#3a0ca3', color: '#3a0ca3' }}
                    >
                      <Navigation className="w-5 h-5" />
                      <span className="ml-2 hidden md:inline">Current</span>
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-float drop-shadow-lg" style={{ color: '#3a0ca3' }}>
              🌤️ Weather Bliss
            </h1>
            <p className="text-xl mb-4 drop-shadow-md" style={{ color: '#3a0ca3' }}>
              Beautiful weather insights for your world
            </p>
            <div className="flex items-center justify-center gap-2" style={{ color: '#3a0ca3' }}>
              <Clock className="w-5 h-5" />
              <span>{currentTime.toLocaleString()}</span>
            </div>
          </div>
          <Card className="mb-8 bg-white/80 backdrop-blur-md border-blue-200/50 animate-slide-in relative overflow-visible shadow-lg">
            <CardContent className="p-6">
              <form onSubmit={handleSearch} className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 w-6 h-6 md:w-5 md:h-5 z-10" />
                    {searchLocation && (
                      <Button
                        type="button"
                        onClick={() => {
                          setSearchLocation('');
                          setShowSuggestions(false);
                          searchInputRef.current?.focus();
                        }}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-1 h-auto bg-transparent hover:bg-slate-600 rounded-full transition-all duration-200"
                      >
                        <X className="w-5 h-5 text-slate-500 hover:text-slate-700" />
                      </Button>
                    )}
                    <Input
                      ref={searchInputRef}
                      type="text"
                      placeholder={placeholders[placeholderIndex]}
                      value={searchLocation}
                      onChange={(e) => handleSearchInput(e.target.value)}
                      onFocus={() => searchLocation && setShowSuggestions(true)}
                      className="pl-14 pr-12 md:pl-12 h-16 md:h-14 text-lg md:text-base bg-white/70 border-blue-200/50 focus:bg-white/90 text-slate-800 hover:bg-white/80 transition-all duration-300 focus:shadow-xl focus:border-blue-400 rounded-xl placeholder:text-slate-500 placeholder:transition-all placeholder:duration-500"
                      autoComplete="off"
                    />
                    
                    {/* Search Suggestions - Properly positioned to avoid overlap */}
                    {showSuggestions && searchSuggestions.length > 0 && (
                      <>
                        {/* Mobile overlay */}
                        <div className="fixed inset-0 bg-black/50 z-[100] md:hidden" onClick={() => setShowSuggestions(false)}></div>
                        
                        {/* Search dropdown - positioned properly */}
                        <div className="absolute top-full left-0 right-0 bg-white rounded-xl shadow-2xl mt-2 z-[101] max-h-[60vh] overflow-y-auto border border-blue-200 animate-fade-in">
                          <div className="p-2">
                            <div className="text-sm text-slate-400 px-3 py-2 border-b border-slate-600 bg-slate-700/50">
                              ✨ Found {searchSuggestions.length} location{searchSuggestions.length !== 1 ? 's' : ''}
                            </div>
                            {searchSuggestions.map((suggestion, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => handleSuggestionSelect(suggestion)}
                                className="w-full text-left px-4 py-4 md:py-3 hover:bg-slate-700/60 rounded-lg margin-1 flex items-center gap-3 transition-all duration-300 hover:shadow-md group"
                              >
                                <div className="p-2 bg-slate-700/60 rounded-lg group-hover:bg-sky-600/60 transition-all duration-300 group-hover:scale-110">
                                  <MapPin className="w-5 h-5 md:w-4 md:h-4 text-sky-400 group-hover:text-sky-200 transition-colors" />
                                </div>
                                <div className="flex-1">
                                  <div className="font-semibold text-slate-100 text-base md:text-sm group-hover:text-white transition-colors">{suggestion.name}</div>
                                  <div className="text-sm md:text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                                    {suggestion.state && `${suggestion.state}, `}{suggestion.country}
                                  </div>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                                  <ArrowRight className="w-5 h-5 text-sky-400 group-hover:scale-110" />
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex gap-2 md:gap-4">
                    <Button type="submit" disabled={loading} className="flex-1 md:flex-none h-12 md:h-10 bg-sky-600 hover:bg-sky-700 hover:shadow-lg transition-all duration-300 hover:scale-105 text-white">
                      {loading ? <Loader2 className="w-5 h-5 md:w-4 md:h-4 animate-spin" /> : 'Search'}
                    </Button>
                    <Button
                      type="button"
                      onClick={handleCurrentLocation}
                      disabled={loading}
                      variant="outline"
                      className="flex-1 md:flex-none h-12 md:h-10 bg-slate-700/60 border-slate-600/50 text-slate-200 hover:bg-slate-700/80 hover:shadow-lg transition-all duration-300 hover:scale-105"
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
                        <span className="text-slate-300 text-sm">Recent searches:</span>
                        {searchHistory.map((search, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="cursor-pointer hover:bg-slate-700/60 bg-slate-700/30 text-slate-200 border-slate-600/50"
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
                        <span className="text-slate-300 text-sm">Favorite locations:</span>
                        {favoriteLocations.map((location, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="cursor-pointer hover:bg-slate-600/60 bg-slate-700/40 text-slate-200 border-slate-600/50"
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
              <Card className="lg:col-span-2 bg-white/90 backdrop-blur-md border-blue-200/50 weather-card shadow-lg">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold text-slate-800 flex items-center justify-center gap-2">
                    <MapPin className="w-6 h-6 text-blue-600" />
                    {weatherData.location}
                    {weatherData.country && (
                      <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                        {weatherData.country}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="flex items-center justify-center mb-6 animate-float">
                    {getWeatherIcon(weatherData.condition)}
                  </div>
                  <div className="text-6xl font-bold text-slate-800 mb-2 animate-pulse-glow drop-shadow-lg">
                    {weatherData.temperature}°C
                  </div>
                  <div className="text-slate-700 text-lg mb-2 capitalize drop-shadow-md">
                    {weatherData.description}
                  </div>
                  <div className="text-slate-600">
                    Feels like {weatherData.feelsLike}°C
                  </div>
                </CardContent>
              </Card>

              {/* Weather Details */}
              <Card className="bg-white/90 backdrop-blur-md border-blue-200/50 weather-card shadow-lg">
                <CardHeader>
                  <CardTitle className="text-slate-800 text-lg">Weather Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-slate-700">
                    <div className="flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">Humidity</span>
                    </div>
                    <span className="font-semibold">{weatherData.humidity}%</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-700">
                    <div className="flex items-center gap-2">
                      <Wind className="w-4 h-4 text-slate-600" />
                      <span className="text-sm">Wind Speed</span>
                    </div>
                    <span className="font-semibold">{weatherData.windSpeed} km/h</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-700">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm">Visibility</span>
                    </div>
                    <span className="font-semibold">{weatherData.visibility} km</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-700">
                    <div className="flex items-center gap-2">
                      <Thermometer className="w-4 h-4 text-cyan-500" />
                      <span className="text-sm">Dew Point</span>
                    </div>
                    <span className="font-semibold">{weatherData.dewPoint}°C</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-700">
                    <div className="flex items-center gap-2">
                      <Gauge className="w-4 h-4 text-purple-500" />
                      <span className="text-sm">Pressure</span>
                    </div>
                    <span className="font-semibold">{weatherData.pressure} hPa</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-700">
                    <div className="flex items-center gap-2">
                      <Sunrise className="w-4 h-4 text-orange-500" />
                      <span className="text-sm">Sunrise</span>
                    </div>
                    <span className="font-semibold">{weatherData.sunrise}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-700">
                    <div className="flex items-center gap-2">
                      <Sunset className="w-4 h-4 text-orange-600" />
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
              <Card className="bg-white/90 backdrop-blur-md border-blue-200/50 weather-card shadow-lg">
                <CardHeader>
                  <CardTitle className="text-slate-800 text-lg flex items-center gap-2">
                    <Heart className="w-5 h-5 text-pink-500" />
                    Air Quality
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-slate-800 mb-2">{weatherData.airQuality}</div>
                    <div className={`font-semibold ${getAirQualityDesc(weatherData.airQuality || 0).color}`}>
                      {getAirQualityDesc(weatherData.airQuality || 0).desc}
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 mt-3">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-red-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((weatherData.airQuality || 0) / 200 * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* UV Index */}
              <Card className="bg-white/90 backdrop-blur-md border-blue-200/50 weather-card shadow-lg">
                <CardHeader>
                  <CardTitle className="text-slate-800 text-lg flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    UV Index
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-slate-800 mb-2">{weatherData.uvIndex}</div>
                    <div className={`font-semibold ${getUVDesc(weatherData.uvIndex || 0).color}`}>
                      {getUVDesc(weatherData.uvIndex || 0).desc}
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 mt-3">
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

          {/* 5-Day Forecast */}
          {weatherData && (
            <div className="mt-6 animate-slide-in">
              <div className="bg-white/90 backdrop-blur-md rounded-xl p-6 border border-blue-200/50 shadow-lg">
                <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                  5-Day Forecast
                </h3>
                <div className="space-y-3">
                  {weatherData.forecast.map((day, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-blue-50/60 hover:bg-blue-100/80 rounded-lg border border-blue-200/30 transition-all duration-200 shadow-sm">
                      <div className="flex items-center space-x-4">
                        <span className="text-slate-700 font-medium w-12 text-sm">{day.date.split(',')[0]}</span>
                        <div className="text-2xl">{getWeatherIcon(day.condition)}</div>
                        <span className="text-slate-700">{day.condition}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-slate-800 font-semibold">{day.temperature}°C</div>
                        <div className="text-slate-600 text-sm">{Math.round(day.temperature - 5)}°C</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && !weatherData && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-200"></div>
              <span className="ml-4 text-slate-200 text-lg drop-shadow-md">Loading weather data...</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <WeatherFooter />
    </div>
  );
};

export default EnhancedWeatherDashboard;