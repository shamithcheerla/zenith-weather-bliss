import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cloud, ArrowLeft, Eye, Users, Shield } from 'lucide-react';
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

const About = () => {
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

      {/* About Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4" style={{ color: '#3a0ca3' }}>About Weather Bliss</h1>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Weather Bliss is your comprehensive weather companion, providing accurate and reliable weather information 
              with a beautiful, user-friendly interface. We're committed to delivering the most precise weather data 
              to help you plan your day perfectly.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="border-blue-200/50 shadow-lg text-center">
              <CardContent className="p-6">
                <Eye className="w-12 h-12 mx-auto mb-4" style={{ color: '#3a0ca3' }} />
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Accurate Data</h3>
                <p className="text-slate-600">Real-time weather data from trusted meteorological sources worldwide.</p>
              </CardContent>
            </Card>
            
            <Card className="border-blue-200/50 shadow-lg text-center">
              <CardContent className="p-6">
                <Users className="w-12 h-12 mx-auto mb-4" style={{ color: '#3a0ca3' }} />
                <h3 className="text-xl font-semibold text-slate-800 mb-2">User-Friendly</h3>
                <p className="text-slate-600">Intuitive design that makes checking weather effortless and enjoyable.</p>
              </CardContent>
            </Card>
            
            <Card className="border-blue-200/50 shadow-lg text-center">
              <CardContent className="p-6">
                <Shield className="w-12 h-12 mx-auto mb-4" style={{ color: '#3a0ca3' }} />
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Reliable Service</h3>
                <p className="text-slate-600">24/7 availability with consistent performance you can depend on.</p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6" style={{ color: '#3a0ca3' }}>Our Mission</h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              At Weather Bliss, we believe that weather information should be accessible, accurate, and beautifully presented. 
              Our mission is to empower people with the weather insights they need to make informed decisions about their daily 
              activities, travel plans, and outdoor adventures.
            </p>
            
            <h2 className="text-3xl font-bold mb-6" style={{ color: '#3a0ca3' }}>Why Choose Us?</h2>
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <Card className="border-blue-200/50 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3" style={{ color: '#3a0ca3' }}>Advanced Technology</h3>
                  <p className="text-slate-600">
                    We use cutting-edge weather prediction models and real-time data processing to deliver the most 
                    accurate forecasts possible.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-blue-200/50 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3" style={{ color: '#3a0ca3' }}>Global Coverage</h3>
                  <p className="text-slate-600">
                    From major cities to remote villages, we provide comprehensive weather data for locations 
                    around the world.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

        <WeatherFooter />
      </div>
    </div>
  );
};

export default About;