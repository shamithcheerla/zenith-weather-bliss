import React from 'react';
import { Cloud, Github, Twitter, Linkedin } from 'lucide-react';

const WeatherFooter = () => {
  return (
    <footer className="bg-slate-900/80 backdrop-blur-md border-t border-slate-700/50 mt-8">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Brand Section */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Cloud className="w-6 h-6 text-sky-400" />
              <span className="text-lg font-bold text-slate-100">Weather Bliss</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Beautiful weather insights with comprehensive data visualization.
            </p>
            <div className="flex space-x-3">
              <Twitter className="w-4 h-4 text-slate-400 hover:text-sky-400 cursor-pointer transition-colors" />
              <Github className="w-4 h-4 text-slate-400 hover:text-sky-400 cursor-pointer transition-colors" />
              <Linkedin className="w-4 h-4 text-slate-400 hover:text-sky-400 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-slate-100 font-semibold">Quick Links</h3>
            <ul className="space-y-1 text-sm">
              <li className="text-slate-300 hover:text-sky-400 transition-colors cursor-pointer">Weather Data</li>
              <li className="text-slate-300 hover:text-sky-400 transition-colors cursor-pointer">Forecasts</li>
              <li className="text-slate-300 hover:text-sky-400 transition-colors cursor-pointer">Weather Tips</li>
              <li className="text-slate-300 hover:text-sky-400 transition-colors cursor-pointer">API Documentation</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h3 className="text-slate-100 font-semibold">Contact</h3>
            <div className="text-sm space-y-1">
              <p className="text-slate-300">support@weatherbliss.com</p>
              <p className="text-slate-300">+1 (555) 123-4567</p>
              <p className="text-slate-300">San Francisco, CA</p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-700/50 pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-slate-400 text-sm">&copy; 2024 Weather Bliss. All rights reserved.</p>
            <div className="flex space-x-4 text-xs">
              <span className="text-slate-400 hover:text-sky-400 transition-colors cursor-pointer">Privacy</span>
              <span className="text-slate-400 hover:text-sky-400 transition-colors cursor-pointer">Terms</span>
              <span className="text-slate-400 hover:text-sky-400 transition-colors cursor-pointer">About</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default WeatherFooter;