import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cloud, ArrowLeft, Mail, Phone, MapPin, Clock, Eye, Users, Shield, Thermometer, Sun, CloudRain, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import WeatherFooter from '@/components/WeatherFooter';
import * as THREE from 'three';

// Declare VANTA for TypeScript
declare global {
  interface Window {
    VANTA: any;
  }
}

const Contact = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

      try {
        const response = await fetch('https://formspree.io/f/xpznpjad', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Message sent successfully!",
          description: "We'll get back to you as soon as possible.",
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast({
        title: "Error sending message",
        description: "Please try again later or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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

      {/* Contact Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Remove About and Features sections - now in separate pages */}

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4" style={{ color: '#3a0ca3' }}>Contact Us</h1>
            <p className="text-xl text-slate-600">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <Card className="border-blue-200/50 shadow-lg">
              <CardHeader>
                <CardTitle className="text-slate-800">Send us a message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                    <Input 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your name" 
                      className="border-blue-200 focus:border-sky-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                    <Input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com" 
                      className="border-blue-200 focus:border-sky-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                    <Input 
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="How can we help?" 
                      className="border-blue-200 focus:border-sky-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                    <Textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us more about your question or feedback..."
                      rows={5}
                      className="border-blue-200 focus:border-sky-400"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full text-white"
                    style={{ backgroundColor: '#3a0ca3' }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-6">
              <Card className="border-blue-200/50 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Mail className="w-6 h-6" style={{ color: '#3a0ca3' }} />
                    <div>
                      <h3 className="font-semibold text-slate-800">Email</h3>
                      <p className="text-slate-600">support@weatherbliss.com</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-200/50 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Phone className="w-6 h-6" style={{ color: '#3a0ca3' }} />
                    <div>
                      <h3 className="font-semibold text-slate-800">Phone</h3>
                      <p className="text-slate-600">+1 (555) 123-4567</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-200/50 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <MapPin className="w-6 h-6" style={{ color: '#3a0ca3' }} />
                    <div>
                      <h3 className="font-semibold text-slate-800">Address</h3>
                      <p className="text-slate-600">San Francisco, CA</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-200/50 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Clock className="w-6 h-6" style={{ color: '#3a0ca3' }} />
                    <div>
                      <h3 className="font-semibold text-slate-800">Business Hours</h3>
                      <p className="text-slate-600">Mon - Fri: 9:00 AM - 6:00 PM PST</p>
                      <p className="text-slate-600">Sat - Sun: 10:00 AM - 4:00 PM PST</p>
                    </div>
                  </div>
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

export default Contact;