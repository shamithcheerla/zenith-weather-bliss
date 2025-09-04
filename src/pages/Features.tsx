import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cloud, ArrowLeft, Thermometer, Sun, CloudRain, Eye, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import WeatherFooter from '@/components/WeatherFooter';
import * as THREE from 'three';

// Declare VANTA for TypeScript
declare global {
  interface Window {
    VANTA: any;
  }
}

const Features = () => {
  const navigate = useNavigate();
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);

  useEffect(() => {
    // Load Vanta.js scripts
    const loadVanta = async () => {
      // Load Three.js
      const threeScript = document.createElement('script');
      threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js';
      document.head.appendChild(threeScript);

      await new Promise(resolve => {
        threeScript.onload = resolve;
      });

      // Load Vanta Clouds
      const vantaScript = document.createElement('script');
      vantaScript.src = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.clouds.min.js';
      document.head.appendChild(vantaScript);

      await new Promise(resolve => {
        vantaScript.onload = resolve;
      });

      // Initialize Vanta effect
      const initVanta = () => {
        if (vantaRef.current && window.VANTA) {
          if (vantaEffect.current) {
            vantaEffect.current.destroy();
          }
          
          vantaEffect.current = window.VANTA.CLOUDS({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: Math.max(window.innerHeight, 400),
            minWidth: Math.max(window.innerWidth, 300),
            scale: 1.0,
            scaleMobile: 1.0,
            skyColor: 0x87CEEB,
            cloudColor: 0xFFFFFF,
            cloudShadowColor: 0xE6E6FA,
            sunColor: 0xFFD700,
            sunGlareColor: 0xFFA500,
            sunlightColor: 0xFFE5B4,
            speed: 2.00
          });
        }
      };

      initVanta();

      const handleResize = () => {
        if (vantaEffect.current && vantaEffect.current.resize) {
          vantaEffect.current.resize();
        } else {
          initVanta();
        }
      };

      window.addEventListener('resize', handleResize);
      window.addEventListener('orientationchange', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('orientationchange', handleResize);
      };
    };

    const cleanup = loadVanta();

    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
      }
      if (cleanup && typeof cleanup.then === 'function') {
        cleanup.then(cleanupFn => cleanupFn && cleanupFn());
      }
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Vanta Background */}
      <div ref={vantaRef} className="fixed inset-0 w-full h-full z-0" style={{ minHeight: '100vh', minWidth: '100vw' }} />
      
      {/* Content Overlay */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white/20 backdrop-blur-md border-b border-blue-200/30 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Cloud className="w-8 h-8" style={{ color: '#3a0ca3' }} />
              <span className="text-2xl font-bold" style={{ color: '#3a0ca3' }}>Weather Bliss</span>
            </div>
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Features Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4" style={{ color: '#3a0ca3' }}>Our Features</h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Discover the powerful features that make Weather Bliss your perfect weather companion.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-blue-200/50 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Thermometer className="w-8 h-8" style={{ color: '#3a0ca3' }} />
                  <h3 className="text-lg font-semibold text-slate-800">Real-time Temperature</h3>
                </div>
                <p className="text-slate-600">Get accurate temperature readings updated in real-time for any location.</p>
              </CardContent>
            </Card>
            
            <Card className="border-blue-200/50 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Sun className="w-8 h-8" style={{ color: '#3a0ca3' }} />
                  <h3 className="text-lg font-semibold text-slate-800">UV Index & Sunrise</h3>
                </div>
                <p className="text-slate-600">Stay protected with UV index monitoring and sunrise/sunset times.</p>
              </CardContent>
            </Card>
            
            <Card className="border-blue-200/50 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <CloudRain className="w-8 h-8" style={{ color: '#3a0ca3' }} />
                  <h3 className="text-lg font-semibold text-slate-800">Precipitation Forecast</h3>
                </div>
                <p className="text-slate-600">Detailed rainfall and precipitation predictions for better planning.</p>
              </CardContent>
            </Card>
            
            <Card className="border-blue-200/50 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Eye className="w-8 h-8" style={{ color: '#3a0ca3' }} />
                  <h3 className="text-lg font-semibold text-slate-800">Visibility & Air Quality</h3>
                </div>
                <p className="text-slate-600">Monitor visibility conditions and air quality indices in your area.</p>
              </CardContent>
            </Card>
            
            <Card className="border-blue-200/50 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Zap className="w-8 h-8" style={{ color: '#3a0ca3' }} />
                  <h3 className="text-lg font-semibold text-slate-800">Weather Alerts</h3>
                </div>
                <p className="text-slate-600">Receive instant notifications for severe weather conditions and warnings.</p>
              </CardContent>
            </Card>
            
            <Card className="border-blue-200/50 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Cloud className="w-8 h-8" style={{ color: '#3a0ca3' }} />
                  <h3 className="text-lg font-semibold text-slate-800">7-Day Forecast</h3>
                </div>
                <p className="text-slate-600">Plan ahead with detailed 7-day weather forecasts and trends.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

        <WeatherFooter />
      </div>
    </div>
  );
};

export default Features;