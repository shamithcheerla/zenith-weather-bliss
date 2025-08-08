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
          skyColor: 0x1e293b,
          cloudColor: 0x475569,
          cloudShadowColor: 0x0f172a,
          sunColor: 0x272700,
          sunGlareColor: 0xcc8100,
          sunlightColor: 0x3a2d3b,
          speed: 3.00
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
        <nav className="p-6 bg-slate-900/40 backdrop-blur-md border-b border-slate-700/50">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Cloud className="w-10 h-10 text-sky-400" />
              <span className="text-3xl font-bold bg-gradient-to-r from-sky-400 to-blue-400 bg-clip-text text-transparent">Weather Bliss</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-slate-200 hover:text-sky-400 transition-colors font-medium">Features</a>
              <a href="#about" className="text-slate-200 hover:text-sky-400 transition-colors font-medium">About</a>
              <a href="#contact" className="text-slate-200 hover:text-sky-400 transition-colors font-medium">Contact</a>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent mb-6 animate-fade-in">
              Weather Bliss
            </h1>
            <p className="text-xl md:text-2xl text-slate-200 mb-8 animate-slide-in">
              Experience beautiful weather insights with stunning 3D animations
            </p>
            <p className="text-lg text-slate-300 mb-12 max-w-2xl mx-auto animate-fade-in">
              Get real-time weather data, forecasts, and personalized insights in a visually stunning interface that adapts to your local weather conditions.
            </p>
            
            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50 p-6 rounded-xl hover:bg-slate-800/80 transition-all duration-300 animate-scale-in">
                <MapPin className="w-12 h-12 mx-auto mb-4 text-sky-400" />
                <h3 className="text-xl font-semibold mb-2 text-slate-100">Location-Based</h3>
                <p className="text-slate-300">Automatic location detection with global weather coverage</p>
              </div>
              <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50 p-6 rounded-xl hover:bg-slate-800/80 transition-all duration-300 animate-scale-in" style={{ animationDelay: '0.2s' }}>
                <Thermometer className="w-12 h-12 mx-auto mb-4 text-orange-400" />
                <h3 className="text-xl font-semibold mb-2 text-slate-100">Detailed Insights</h3>
                <p className="text-slate-300">Comprehensive weather data including UV index, air quality, and more</p>
              </div>
              <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50 p-6 rounded-xl hover:bg-slate-800/80 transition-all duration-300 animate-scale-in" style={{ animationDelay: '0.4s' }}>
                <Wind className="w-12 h-12 mx-auto mb-4 text-cyan-400" />
                <h3 className="text-xl font-semibold mb-2 text-slate-100">Dynamic Animations</h3>
                <p className="text-slate-300">Beautiful weather animations that match current conditions</p>
              </div>
            </div>

            <Button 
              onClick={handleGetStarted}
              size="lg"
              className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white text-xl px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 animate-bounce-in group shadow-lg shadow-sky-500/25"
            >
              Get Started
              <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-slate-900/80 backdrop-blur-md border-t border-slate-700/50 mt-16">
          <div className="container mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              {/* Brand Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Cloud className="w-8 h-8 text-sky-400" />
                  <span className="text-2xl font-bold text-slate-100">Weather Bliss</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Beautiful weather insights for your world with stunning animations and comprehensive data visualization.
                </p>
              </div>

              {/* Features Section */}
              <div className="space-y-4">
                <h3 className="text-slate-100 font-semibold text-lg">Features</h3>
                <ul className="space-y-2">
                  <li className="text-slate-300 hover:text-sky-400 transition-colors cursor-pointer">Real-time Weather</li>
                  <li className="text-slate-300 hover:text-sky-400 transition-colors cursor-pointer">5-Day Forecasts</li>
                  <li className="text-slate-300 hover:text-sky-400 transition-colors cursor-pointer">Weather Animations</li>
                  <li className="text-slate-300 hover:text-sky-400 transition-colors cursor-pointer">Location Detection</li>
                  <li className="text-slate-300 hover:text-sky-400 transition-colors cursor-pointer">Weather Tips</li>
                </ul>
              </div>

              {/* Documentation Section */}
              <div className="space-y-4">
                <h3 className="text-slate-100 font-semibold text-lg">Documentation</h3>
                <ul className="space-y-2">
                  <li className="text-slate-300 hover:text-sky-400 transition-colors cursor-pointer">API Reference</li>
                  <li className="text-slate-300 hover:text-sky-400 transition-colors cursor-pointer">User Guide</li>
                  <li className="text-slate-300 hover:text-sky-400 transition-colors cursor-pointer">Developer Docs</li>
                  <li className="text-slate-300 hover:text-sky-400 transition-colors cursor-pointer">Weather Data Sources</li>
                  <li className="text-slate-300 hover:text-sky-400 transition-colors cursor-pointer">FAQ</li>
                </ul>
              </div>

              {/* Contact Section */}
              <div className="space-y-4">
                <h3 className="text-slate-100 font-semibold text-lg">Contact Us</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-slate-300">support@weatherbliss.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-slate-300">+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-slate-300">San Francisco, CA</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="border-t border-slate-700/50 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="text-slate-400 text-center md:text-left">
                  <p>&copy; 2024 Weather Bliss. All rights reserved.</p>
                </div>
                <div className="flex items-center space-x-2 text-slate-400">
                  <span>Made with ❤️ for weather enthusiasts</span>
                </div>
                <div className="flex space-x-6 text-sm">
                  <span className="text-slate-400 hover:text-sky-400 transition-colors cursor-pointer">Privacy Policy</span>
                  <span className="text-slate-400 hover:text-sky-400 transition-colors cursor-pointer">Terms of Service</span>
                  <span className="text-slate-400 hover:text-sky-400 transition-colors cursor-pointer">About</span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;