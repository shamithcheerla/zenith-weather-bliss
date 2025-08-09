import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Cloud, ArrowLeft, Mail, Phone, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const Contact = () => {
  const navigate = useNavigate();

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
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                  <Input placeholder="Your name" className="border-blue-200 focus:border-sky-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <Input type="email" placeholder="your.email@example.com" className="border-blue-200 focus:border-sky-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                  <Input placeholder="How can we help?" className="border-blue-200 focus:border-sky-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                  <Textarea 
                    placeholder="Tell us more about your question or feedback..."
                    rows={5}
                    className="border-blue-200 focus:border-sky-400"
                  />
                </div>
                <Button className="w-full bg-sky-500 hover:bg-sky-600 text-white">
                  Send Message
                </Button>
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