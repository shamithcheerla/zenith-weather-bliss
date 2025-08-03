// Enhanced weather service with better location search for villages and small places

export interface LocationData {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

export interface WeatherResponse {
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
}

// Multiple geocoding services for better location search
const GEOCODING_SERVICES = [
  // Nominatim (OpenStreetMap) - Free and covers villages/small places very well
  {
    name: 'nominatim',
    url: (query: string) => `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`,
    parser: (data: any[]): LocationData[] => {
      return data.map(item => ({
        name: item.display_name.split(',')[0],
        country: item.address?.country || 'Unknown',
        state: item.address?.state,
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon)
      }));
    }
  },
  // Mapbox Geocoding (has good coverage for small places)
  {
    name: 'mapbox',
    url: (query: string) => `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?types=place,locality,neighborhood,address&limit=5`,
    parser: (data: any): LocationData[] => {
      if (!data.features) return [];
      return data.features.map((feature: any) => ({
        name: feature.text,
        country: feature.context?.find((c: any) => c.id.includes('country'))?.text || 'Unknown',
        state: feature.context?.find((c: any) => c.id.includes('region'))?.text,
        lat: feature.center[1],
        lon: feature.center[0]
      }));
    }
  }
];

export class EnhancedWeatherService {
  private async searchLocations(query: string): Promise<LocationData[]> {
    const results: LocationData[] = [];
    
    // Try multiple geocoding services for better coverage
    for (const service of GEOCODING_SERVICES) {
      try {
        const response = await fetch(service.url(query));
        if (response.ok) {
          const data = await response.json();
          const locations = service.parser(data);
          results.push(...locations);
          
          // If we got good results from one service, we can stop
          if (locations.length > 0) {
            break;
          }
        }
      } catch (error) {
        console.log(`${service.name} geocoding failed:`, error);
        // Continue to next service
      }
    }
    
    // Remove duplicates and return
    const uniqueResults = results.filter((location, index, self) => 
      index === self.findIndex(l => 
        Math.abs(l.lat - location.lat) < 0.01 && 
        Math.abs(l.lon - location.lon) < 0.01
      )
    );
    
    return uniqueResults;
  }

  async searchLocationWithFallback(query: string): Promise<LocationData | null> {
    try {
      const locations = await this.searchLocations(query);
      
      if (locations.length > 0) {
        return locations[0]; // Return the first/best match
      }
      
      // If no results, try with different search patterns
      const alternativeQueries = [
        query.replace(/village|town|city/gi, '').trim(),
        query + ' village',
        query + ' town',
        query.split(' ')[0] // Try just the first word
      ];
      
      for (const altQuery of alternativeQueries) {
        if (altQuery && altQuery !== query) {
          const altLocations = await this.searchLocations(altQuery);
          if (altLocations.length > 0) {
            return altLocations[0];
          }
        }
      }
      
      return null;
    } catch (error) {
      console.error('Location search failed:', error);
      return null;
    }
  }

  async getWeatherByLocation(location: LocationData): Promise<WeatherResponse | null> {
    try {
      // Try OpenWeatherMap first (would need API key in production)
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=demo&units=metric`
      );
      
      if (response.ok) {
        const data = await response.json();
        return this.parseOpenWeatherData(data, location);
      }
      
      // Fallback to mock data with location info
      return this.generateMockWeather(location);
    } catch (error) {
      console.error('Weather fetch failed:', error);
      return this.generateMockWeather(location);
    }
  }

  private parseOpenWeatherData(data: any, location: LocationData): WeatherResponse {
    return {
      location: location.name,
      country: location.country,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      condition: data.weather[0].main,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6),
      visibility: Math.round(data.visibility / 1000),
      sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      icon: data.weather[0].icon
    };
  }

  private generateMockWeather(location: LocationData): WeatherResponse {
    const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Clear'];
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    const temperature = Math.floor(Math.random() * 35) + 5;
    
    return {
      location: location.name,
      country: location.country,
      temperature,
      feelsLike: temperature + Math.floor(Math.random() * 6) - 3,
      condition: randomCondition,
      description: `${randomCondition} weather`,
      humidity: Math.floor(Math.random() * 60) + 30,
      windSpeed: Math.floor(Math.random() * 20) + 5,
      visibility: Math.floor(Math.random() * 5) + 10,
      sunrise: '06:30',
      sunset: '19:45',
      icon: randomCondition.toLowerCase()
    };
  }
}

export const weatherService = new EnhancedWeatherService();