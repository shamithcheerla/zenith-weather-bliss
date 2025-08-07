import React from 'react';
import { Cloud, Heart, Mail, Phone, MapPin, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-sky-900/50 to-blue-900/50 backdrop-blur-md border-t border-white/20 mt-16">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Cloud className="w-8 h-8 text-sky-400" />
              <span className="text-2xl font-bold text-white">Weather Bliss</span>
            </div>
            <p className="text-white/70 leading-relaxed">
              Beautiful weather insights for your world with stunning animations and comprehensive data visualization.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white/60 hover:text-sky-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/60 hover:text-sky-400 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/60 hover:text-sky-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Features Section */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Features</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Real-time Weather</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">5-Day Forecasts</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Weather Animations</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Location Detection</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Weather Tips</a></li>
            </ul>
          </div>

          {/* Weather Data Section */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Weather Data</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Temperature & Humidity</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Wind Speed & Direction</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">UV Index & Air Quality</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Atmospheric Pressure</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Sunrise & Sunset Times</a></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-sky-400" />
                <span className="text-white/70">support@weatherbliss.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-sky-400" />
                <span className="text-white/70">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-sky-400" />
                <span className="text-white/70">San Francisco, CA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-white/60 text-center md:text-left">
              <p>&copy; 2024 Weather Bliss. All rights reserved.</p>
            </div>
            <div className="flex items-center space-x-2 text-white/60">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-400 animate-pulse" />
              <span>for weather enthusiasts</span>
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-white/60 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">About</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;