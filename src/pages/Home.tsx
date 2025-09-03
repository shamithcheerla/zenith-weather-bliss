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

      // Initialize Vanta effect with responsive configuration
      const initVanta = () => {
        if (vantaRef.current && window.VANTA) {
          // Destroy existing effect before creating new one
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

      // Handle window resize for responsiveness
      const handleResize = () => {
        if (vantaEffect.current && vantaEffect.current.resize) {
          vantaEffect.current.resize();
        } else {
          // Reinitialize if resize method not available
          initVanta();
        }
      };

      window.addEventListener('resize', handleResize);
      window.addEventListener('orientationchange', handleResize);

      // Cleanup resize listeners
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

  const handleGetStarted = () => {
    navigate('/weather');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Vanta Background - Fixed responsive sizing */}
      <div ref={vantaRef} className="fixed inset-0 w-full h-full z-0" style={{ minHeight: '100vh', minWidth: '100vw' }} />
      
      {/* Content Overlay */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Navigation */}
        <nav className="p-6 bg-white/20 backdrop-blur-md border-b border-blue-200/30">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Cloud className="w-10 h-10 text-blue-600" />
              <span className="text-3xl font-bold text-slate-800">Weather Bliss</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <button onClick={() => navigate('/features')} className="text-slate-700 hover:text-blue-600 transition-colors font-medium">Features</button>
              <button onClick={() => navigate('/about')} className="text-slate-700 hover:text-blue-600 transition-colors font-medium">About</button>
              <button 
                onClick={() => navigate('/contact')} 
                className="text-slate-700 hover:text-blue-600 transition-colors font-medium"
              >
                Contact
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-bold text-slate-800 mb-6 animate-fade-in">
              Weather Bliss
            </h1>
            <p className="text-xl md:text-2xl text-slate-700 mb-8 animate-slide-in">
              Experience beautiful weather insights with stunning 3D animations
            </p>
            <p className="text-lg text-slate-600 mb-12 max-w-2xl mx-auto animate-fade-in">
              Get real-time weather data, forecasts, and personalized insights in a visually stunning interface that adapts to your local weather conditions.
            </p>
            
            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white/80 backdrop-blur-md border border-blue-200/50 p-6 rounded-xl hover:bg-white/90 transition-all duration-300 animate-scale-in shadow-lg">
                <MapPin className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                <h3 className="text-xl font-semibold mb-2 text-slate-800">Location-Based</h3>
                <p className="text-slate-600">Automatic location detection with global weather coverage</p>
              </div>
              <div className="bg-white/80 backdrop-blur-md border border-blue-200/50 p-6 rounded-xl hover:bg-white/90 transition-all duration-300 animate-scale-in shadow-lg" style={{ animationDelay: '0.2s' }}>
                <Thermometer className="w-12 h-12 mx-auto mb-4 text-orange-500" />
                <h3 className="text-xl font-semibold mb-2 text-slate-800">Detailed Insights</h3>
                <p className="text-slate-600">Comprehensive weather data including UV index, air quality, and more</p>
              </div>
              <div className="bg-white/80 backdrop-blur-md border border-blue-200/50 p-6 rounded-xl hover:bg-white/90 transition-all duration-300 animate-scale-in shadow-lg" style={{ animationDelay: '0.4s' }}>
                <Wind className="w-12 h-12 mx-auto mb-4 text-cyan-600" />
                <h3 className="text-xl font-semibold mb-2 text-slate-800">Dynamic Animations</h3>
                <p className="text-slate-600">Beautiful weather animations that match current conditions</p>
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

        {/* Simplified Footer */}
        <footer className="bg-white/20 backdrop-blur-md border-t border-blue-200/30 mt-16">
          <div className="container mx-auto px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Brand Section */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Cloud className="w-6 h-6 text-blue-600" />
                  <span className="text-lg font-bold text-slate-800">Weather Bliss</span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Beautiful weather insights with comprehensive data visualization.
                </p>
              </div>

              {/* Quick Links */}
              <div className="space-y-3">
                <h3 className="text-slate-800 font-semibold">Quick Links</h3>
                <ul className="space-y-1 text-sm">
                  <li><button onClick={() => navigate('/weather')} className="text-slate-600 hover:text-blue-600 transition-colors">Weather Data</button></li>
                  <li><button onClick={() => navigate('/features')} className="text-slate-600 hover:text-blue-600 transition-colors">Features</button></li>
                  <li><button onClick={() => navigate('/about')} className="text-slate-600 hover:text-blue-600 transition-colors">About</button></li>
                </ul>
              </div>

              {/* Contact */}
              <div className="space-y-3">
                <h3 className="text-slate-800 font-semibold">Contact</h3>
                <div className="text-sm space-y-1">
                  <p className="text-slate-600">support@weatherbliss.com</p>
                  <button 
                    onClick={() => navigate('/contact')}
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Contact Us
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="border-t border-blue-200/30 pt-4">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
                <p className="text-slate-600 text-sm">&copy; 2024 Weather Bliss. All rights reserved.</p>
                <div className="flex space-x-4 text-xs">
                  <span className="text-slate-600 hover:text-blue-600 transition-colors cursor-pointer">Privacy</span>
                  <span className="text-slate-600 hover:text-blue-600 transition-colors cursor-pointer">Terms</span>
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