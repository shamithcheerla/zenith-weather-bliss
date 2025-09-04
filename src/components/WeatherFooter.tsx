import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Cloud, Github, Twitter, Linkedin } from 'lucide-react';

const WeatherFooter = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-gradient-to-r from-blue-600/80 via-sky-500/80 to-cyan-400/80 backdrop-blur-md border-t border-white/20 mt-8 shadow-2xl">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Brand Section */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Cloud className="w-7 h-7 text-white drop-shadow-lg" />
              <span className="text-2xl font-bold text-white drop-shadow-md">Weather Bliss</span>
            </div>
            <p className="text-white/90 text-base leading-relaxed font-medium">
              Beautiful weather insights with comprehensive data visualization and stunning animations.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-lg drop-shadow-md">Quick Links</h3>
            <ul className="space-y-2 text-base">
              <li><button onClick={() => navigate('/weather')} className="text-white/90 hover:text-white hover:scale-105 transition-all duration-200 font-medium">Weather Data</button></li>
              <li><button onClick={() => navigate('/features')} className="text-white/90 hover:text-white hover:scale-105 transition-all duration-200 font-medium">Features</button></li>
              <li><button onClick={() => navigate('/about')} className="text-white/90 hover:text-white hover:scale-105 transition-all duration-200 font-medium">About</button></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-lg drop-shadow-md">Contact</h3>
            <div className="text-base space-y-2">
              <p className="text-white/90 font-medium">support@weatherbliss.com</p>
              <p className="text-white/90 font-medium">+1 (555) 123-4567</p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <p className="text-white/90 text-base font-medium drop-shadow-md">&copy; 2024 Weather Bliss. All rights reserved.</p>
            <div className="flex space-x-6 text-base">
              <span className="text-white/90 hover:text-white hover:scale-105 transition-all duration-200 cursor-pointer font-medium">Privacy</span>
              <span className="text-white/90 hover:text-white hover:scale-105 transition-all duration-200 cursor-pointer font-medium">Terms</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default WeatherFooter;