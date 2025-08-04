import React from 'react';
import { Lightbulb, Umbrella, Shirt, Car, Activity } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface WeatherTipsProps {
  temperature: number;
  condition: string;
  humidity: number;
  uvIndex: number;
  windSpeed: number;
}

const WeatherTips: React.FC<WeatherTipsProps> = ({ 
  temperature, 
  condition, 
  humidity, 
  uvIndex, 
  windSpeed 
}) => {
  const getTips = () => {
    const tips = [];

    // Temperature-based clothing tips
    if (temperature < 10) {
      tips.push({
        icon: <Shirt className="w-4 h-4" />,
        title: "Dress Warmly",
        description: "Wear layers, gloves, and a warm coat. Don't forget a hat!"
      });
    } else if (temperature > 30) {
      tips.push({
        icon: <Shirt className="w-4 h-4" />,
        title: "Stay Cool",
        description: "Wear light, breathable clothing and stay hydrated."
      });
    } else if (temperature > 20) {
      tips.push({
        icon: <Shirt className="w-4 h-4" />,
        title: "Perfect Weather",
        description: "Light clothing is perfect for today's temperature."
      });
    }

    // Weather condition tips
    if (condition.toLowerCase().includes('rain')) {
      tips.push({
        icon: <Umbrella className="w-4 h-4" />,
        title: "Rain Expected",
        description: "Don't forget your umbrella or rain jacket!"
      });
    }

    // UV Index tips
    if (uvIndex > 6) {
      tips.push({
        icon: <Activity className="w-4 h-4" />,
        title: "High UV Index",
        description: "Use sunscreen, wear a hat, and seek shade during peak hours."
      });
    }

    // Humidity tips
    if (humidity > 80) {
      tips.push({
        icon: <Lightbulb className="w-4 h-4" />,
        title: "High Humidity",
        description: "Stay hydrated and avoid strenuous outdoor activities."
      });
    }

    // Wind tips
    if (windSpeed > 25) {
      tips.push({
        icon: <Car className="w-4 h-4" />,
        title: "Windy Conditions",
        description: "Drive carefully and secure loose outdoor items."
      });
    }

    // Activity suggestions
    if (temperature >= 20 && temperature <= 25 && !condition.toLowerCase().includes('rain')) {
      tips.push({
        icon: <Activity className="w-4 h-4" />,
        title: "Great for Outdoor Activities",
        description: "Perfect weather for walking, cycling, or outdoor sports!"
      });
    }

    return tips.slice(0, 3); // Show max 3 tips
  };

  const tips = getTips();

  if (tips.length === 0) {
    tips.push({
      icon: <Lightbulb className="w-4 h-4" />,
      title: "Enjoy Your Day",
      description: "Have a wonderful day with today's weather!"
    });
  }

  return (
    <Card className="glass-effect border-white/20 weather-card">
      <CardContent className="p-4">
        <h3 className="text-white font-medium mb-3 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-yellow-400" />
          Weather Tips
        </h3>
        <div className="space-y-3">
          {tips.map((tip, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="text-blue-300 mt-0.5">
                {tip.icon}
              </div>
              <div>
                <div className="text-white/90 text-sm font-medium">
                  {tip.title}
                </div>
                <div className="text-white/70 text-xs">
                  {tip.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherTips;