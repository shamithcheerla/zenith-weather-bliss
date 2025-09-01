import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cloud, ArrowLeft, Mail, Phone, MapPin, Clock, Sun, CloudRain, Thermometer, Eye, Users, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

const Contact = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
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
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-blue-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Cloud className="w-8 h-8 text-sky-500" />
              <span className="text-2xl font-bold text-slate-800">Weather Bliss</span>
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
          {/* About Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">About Weather Bliss</h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Weather Bliss is your comprehensive weather companion, providing accurate and reliable weather information 
                with a beautiful, user-friendly interface. We're committed to delivering the most precise weather data 
                to help you plan your day perfectly.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="border-blue-200/50 shadow-lg text-center">
                <CardContent className="p-6">
                  <Eye className="w-12 h-12 text-sky-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">Accurate Data</h3>
                  <p className="text-slate-600">Real-time weather data from trusted meteorological sources worldwide.</p>
                </CardContent>
              </Card>
              
              <Card className="border-blue-200/50 shadow-lg text-center">
                <CardContent className="p-6">
                  <Users className="w-12 h-12 text-sky-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">User-Friendly</h3>
                  <p className="text-slate-600">Intuitive design that makes checking weather effortless and enjoyable.</p>
                </CardContent>
              </Card>
              
              <Card className="border-blue-200/50 shadow-lg text-center">
                <CardContent className="p-6">
                  <Shield className="w-12 h-12 text-sky-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">Reliable Service</h3>
                  <p className="text-slate-600">24/7 availability with consistent performance you can depend on.</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Features Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Our Features</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Discover the powerful features that make Weather Bliss your perfect weather companion.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-blue-200/50 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Thermometer className="w-8 h-8 text-sky-500" />
                    <h3 className="text-lg font-semibold text-slate-800">Real-time Temperature</h3>
                  </div>
                  <p className="text-slate-600">Get accurate temperature readings updated in real-time for any location.</p>
                </CardContent>
              </Card>
              
              <Card className="border-blue-200/50 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Sun className="w-8 h-8 text-sky-500" />
                    <h3 className="text-lg font-semibold text-slate-800">UV Index & Sunrise</h3>
                  </div>
                  <p className="text-slate-600">Stay protected with UV index monitoring and sunrise/sunset times.</p>
                </CardContent>
              </Card>
              
              <Card className="border-blue-200/50 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <CloudRain className="w-8 h-8 text-sky-500" />
                    <h3 className="text-lg font-semibold text-slate-800">Precipitation Forecast</h3>
                  </div>
                  <p className="text-slate-600">Detailed rainfall and precipitation predictions for better planning.</p>
                </CardContent>
              </Card>
              
              <Card className="border-blue-200/50 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Eye className="w-8 h-8 text-sky-500" />
                    <h3 className="text-lg font-semibold text-slate-800">Visibility & Air Quality</h3>
                  </div>
                  <p className="text-slate-600">Monitor visibility conditions and air quality indices in your area.</p>
                </CardContent>
              </Card>
              
              <Card className="border-blue-200/50 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Zap className="w-8 h-8 text-sky-500" />
                    <h3 className="text-lg font-semibold text-slate-800">Weather Alerts</h3>
                  </div>
                  <p className="text-slate-600">Receive instant notifications for severe weather conditions and warnings.</p>
                </CardContent>
              </Card>
              
              <Card className="border-blue-200/50 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Cloud className="w-8 h-8 text-sky-500" />
                    <h3 className="text-lg font-semibold text-slate-800">7-Day Forecast</h3>
                  </div>
                  <p className="text-slate-600">Plan ahead with detailed 7-day weather forecasts and trends.</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-800 mb-4">Contact Us</h1>
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
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white"
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
                    <Mail className="w-6 h-6 text-sky-500" />
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
                    <Phone className="w-6 h-6 text-sky-500" />
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
                    <MapPin className="w-6 h-6 text-sky-500" />
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
                    <Clock className="w-6 h-6 text-sky-500" />
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
    </div>
  );
};

export default Contact;