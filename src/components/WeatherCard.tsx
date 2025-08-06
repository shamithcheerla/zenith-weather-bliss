import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Thermometer, Droplets, Wind, Eye, Gauge, Sun } from 'lucide-react';

interface WeatherCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple';
  progress?: number;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ 
  title, 
  value, 
  icon, 
  description, 
  color = 'blue',
  progress 
}) => {
  const colorClasses = {
    blue: 'border-blue-200 bg-blue-50/50 text-blue-700',
    green: 'border-green-200 bg-green-50/50 text-green-700',
    orange: 'border-orange-200 bg-orange-50/50 text-orange-700',
    red: 'border-red-200 bg-red-50/50 text-red-700',
    purple: 'border-purple-200 bg-purple-50/50 text-purple-700'
  };

  return (
    <Card className={`hover:scale-105 transition-all duration-300 animate-fade-in ${colorClasses[color]} border backdrop-blur-sm`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{icon}</div>
            <div>
              <p className="text-sm font-medium opacity-80">{title}</p>
              <p className="text-lg font-bold">{value}</p>
              {description && (
                <p className="text-xs opacity-60 mt-1">{description}</p>
              )}
            </div>
          </div>
        </div>
        {progress !== undefined && (
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  color === 'green' ? 'bg-green-500' :
                  color === 'orange' ? 'bg-orange-500' :
                  color === 'red' ? 'bg-red-500' :
                  color === 'purple' ? 'bg-purple-500' :
                  'bg-blue-500'
                }`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherCard;