import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cloud, Sun, CloudRain, ArrowRight, MapPin, Thermometer, Wind } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as THREE from 'three';

// Declare VANTA for TypeScript
declare global {
  interface Window {
    VANTA: any;
  }
}

const Home = () => {
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
      if (vantaRef.current && window.VANTA) {
        vantaEffect.current = window.VANTA.CLOUDS({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          skyColor: 0x68b8ff,
          cloudColor: 0xffffff,
          cloudShadowColor: 0x183550,
          sunColor: 0xff6600,
          sunGlareColor: 0xff6600,
          sunlightColor: 0xff7700,
          speed: 1.0
        });
      }
    };

    loadVanta();

    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
      }
    };
  }, []);

  const handleGetStarted = () => {
    navigate('/weather');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Vanta Background */}
      <div ref={vantaRef} className="absolute inset-0 z-0" />
      
      {/* Content Overlay */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Navigation */}
        <nav className="p-6">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Cloud className="w-8 h-8 text-white" />
              <span className="text-2xl font-bold text-white">Weather Bliss</span>
            </div>
            <div className="hidden md:flex space-x-6">
              <a href="#features" className="text-white/80 hover:text-white transition-colors">Features</a>
              <a href="#about" className="text-white/80 hover:text-white transition-colors">About</a>
              <a href="#contact" className="text-white/80 hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 animate-fade-in">
              Weather Bliss
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 animate-slide-in">
              Experience beautiful weather insights with stunning 3D animations
            </p>
            <p className="text-lg text-white/70 mb-12 max-w-2xl mx-auto animate-fade-in">
              Get real-time weather data, forecasts, and personalized insights in a visually stunning interface that adapts to your local weather conditions.
            </p>
            
            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="glass-effect p-6 rounded-xl text-white animate-scale-in">
                <MapPin className="w-12 h-12 mx-auto mb-4 text-blue-300" />
                <h3 className="text-xl font-semibold mb-2">Location-Based</h3>
                <p className="text-white/70">Automatic location detection with global weather coverage</p>
              </div>
              <div className="glass-effect p-6 rounded-xl text-white animate-scale-in" style={{ animationDelay: '0.2s' }}>
                <Thermometer className="w-12 h-12 mx-auto mb-4 text-orange-300" />
                <h3 className="text-xl font-semibold mb-2">Detailed Insights</h3>
                <p className="text-white/70">Comprehensive weather data including UV index, air quality, and more</p>
              </div>
              <div className="glass-effect p-6 rounded-xl text-white animate-scale-in" style={{ animationDelay: '0.4s' }}>
                <Wind className="w-12 h-12 mx-auto mb-4 text-cyan-300" />
                <h3 className="text-xl font-semibold mb-2">Dynamic Animations</h3>
                <p className="text-white/70">Beautiful weather animations that match current conditions</p>
              </div>
            </div>

            <Button 
              onClick={handleGetStarted}
              size="lg"
              className="bg-white/20 hover:bg-white/30 text-white border border-white/30 text-xl px-8 py-4 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-105 animate-bounce-in group"
            >
              Get Started
              <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </main>

        {/* Footer */}
        <footer className="p-6 bg-black/20 backdrop-blur-sm">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Cloud className="w-6 h-6 text-white" />
                  <span className="text-xl font-bold text-white">Weather Bliss</span>
                </div>
                <p className="text-white/70">Beautiful weather insights for your world with stunning 3D visualizations.</p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4">Features</h3>
                <ul className="space-y-2 text-white/70">
                  <li>Real-time Weather</li>
                  <li>5-Day Forecasts</li>
                  <li>Weather Animations</li>
                  <li>Location Detection</li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4">Data</h3>
                <ul className="space-y-2 text-white/70">
                  <li>Temperature & Humidity</li>
                  <li>Wind Speed & Direction</li>
                  <li>UV Index & Air Quality</li>
                  <li>Sunrise & Sunset</li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4">Contact</h3>
                <ul className="space-y-2 text-white/70">
                  <li>support@weatherbliss.com</li>
                  <li>+1 (555) 123-4567</li>
                  <li>Follow us on social media</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-white/20 pt-6 text-center text-white/60">
              <p>&copy; 2024 Weather Bliss. All rights reserved. Made with ❤️ for weather enthusiasts.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;