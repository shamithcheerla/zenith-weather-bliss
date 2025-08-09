import React from 'react';
import { Cloud, Github, Twitter, Linkedin } from 'lucide-react';

const WeatherFooter = () => {
  return (
    <footer className="bg-white/80 backdrop-blur-md border-t border-blue-200/30 mt-8">
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Brand Section */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Cloud className="w-5 h-5 text-blue-600" />
              <span className="text-lg font-bold text-slate-800">Weather Bliss</span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              Beautiful weather insights with comprehensive data visualization.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h3 className="text-slate-800 font-semibold">Quick Links</h3>
            <ul className="space-y-1 text-sm">
              <li className="text-slate-600 hover:text-blue-600 transition-colors cursor-pointer">Weather Data</li>
              <li className="text-slate-600 hover:text-blue-600 transition-colors cursor-pointer">Forecasts</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-2">
            <h3 className="text-slate-800 font-semibold">Contact</h3>
            <div className="text-sm space-y-1">
              <p className="text-slate-600">support@weatherbliss.com</p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-blue-200/30 pt-3">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-1 md:space-y-0">
            <p className="text-slate-600 text-sm">&copy; 2024 Weather Bliss. All rights reserved.</p>
            <div className="flex space-x-3 text-xs">
              <span className="text-slate-600 hover:text-blue-600 transition-colors cursor-pointer">Privacy</span>
              <span className="text-slate-600 hover:text-blue-600 transition-colors cursor-pointer">Terms</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default WeatherFooter;