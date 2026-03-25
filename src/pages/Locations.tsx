import React, { useState } from "react";
import { motion } from "framer-motion";
import { practiceInfo, physicians, realStats } from "../data/practiceData";
import { 
  MapPin, 
  Phone, 
  Clock, 
  Calendar, 
  Star, 
  Navigation, 
  Car,
  ExternalLink,
  Users,
  Award,
  Mail,
  Shield
} from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import { Button, Card, Badge } from "../components/ui";

const Locations: React.FC = () => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const hoursArray = Object.entries(practiceInfo.hours).map(([day, hours]) => ({
    day: day.charAt(0).toUpperCase() + day.slice(1),
    hours
  }));

  const currentDay = new Date().getDay();
  const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const todayKey = daysOfWeek[currentDay];
  const isOpenToday = todayKey !== 'sunday';

  return (
    <AppLayout>

      <main className="pt-6">
        {/* Hero Section */}
        <section className="py-12 md:py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#B57EDC]/5 via-transparent to-[#9F6BCB]/5"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <Badge
                variant="success"
                size="md"
                className="mb-6"
              >
                📍 Visit Our Practice
              </Badge>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-navy mb-6">
                Reflect Medical & Cosmetic Center
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Experience world-class aesthetic medicine in Bergen County's premier medical facility
              </p>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              
              {/* Left Column - Contact Information */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeInOut" }}
                className="space-y-8"
              >
                
                {/* Address Card */}
                <Card variant="elevated" padding="lg" className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-navy rounded-xl flex items-center justify-center shadow-soft">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-navy mb-2">Practice Location</h3>
                      <address className="text-gray-600 not-italic leading-relaxed">
                        {practiceInfo.address.street}<br />
                        {practiceInfo.address.city}, {practiceInfo.address.state} {practiceInfo.address.zipCode}
                      </address>
                      <button 
                        onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(practiceInfo.address.full)}`, '_blank')}
                        className="inline-flex items-center gap-2 text-[#B57EDC] font-semibold mt-3 hover:text-[#9F6BCB] transition-colors"
                      >
                        <Navigation className="w-4 h-4" />
                        Get Directions
                      </button>
                    </div>
                  </div>
                </Card>

                {/* Contact Card */}
                <Card variant="elevated" padding="lg" className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#B57EDC] rounded-xl flex items-center justify-center shadow-soft">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-navy mb-2">Contact Information</h3>
                      <div className="space-y-2">
                        <a 
                          href={`tel:${practiceInfo.phone}`}
                          className="flex items-center gap-3 text-gray-600 hover:text-navy transition-colors group"
                        >
                          <Phone className="w-4 h-4 group-hover:text-[#B57EDC] transition-colors" />
                          <span className="font-medium">{practiceInfo.phone}</span>
                        </a>
                        <a 
                          href={practiceInfo.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 text-gray-600 hover:text-navy transition-colors group"
                        >
                          <ExternalLink className="w-4 h-4 group-hover:text-[#B57EDC] transition-colors" />
                          <span className="font-medium">Visit Website</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Hours Card */}
                <Card variant="elevated" padding="lg" className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-premium-gold rounded-xl flex items-center justify-center shadow-soft">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <h3 className="text-xl font-semibold text-navy">Practice Hours</h3>
                        <Badge 
                          variant={isOpenToday ? "success" : "outline"} 
                          size="sm"
                        >
                          {isOpenToday ? "Open Today" : "Closed Today"}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        {hoursArray.map(({ day, hours }) => (
                          <div 
                            key={day}
                            className={`flex justify-between items-center py-1 ${
                              day.toLowerCase() === todayKey ? 'bg-[#B57EDC]/5 -mx-2 px-2 rounded font-semibold' : ''
                            }`}
                          >
                            <span className="text-gray-700">{day}</span>
                            <span className={`text-sm ${hours === 'Closed' ? 'text-gray-500' : 'text-gray-600'}`}>
                              {hours}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4, ease: "easeInOut" }}
                >
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full text-lg font-semibold py-4 shadow-lg hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all duration-200"
                    onClick={() => window.location.href = `tel:${practiceInfo.phone}`}
                    leftIcon={<Calendar className="w-5 h-5" />}
                  >
                    Book Your Appointment
                  </Button>
                </motion.div>

              </motion.div>

              {/* Right Column - Map */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: "easeInOut" }}
              >
                <Card variant="elevated" padding="sm" className="overflow-hidden">
                  <div className="aspect-square md:aspect-[4/3] w-full bg-gray-100 rounded-lg overflow-hidden relative">
                    {!isMapLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <div className="text-center">
                          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-500 font-medium">Loading Map...</p>
                        </div>
                      </div>
                    )}
                    <iframe
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(practiceInfo.address.full)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="rounded-lg"
                      onLoad={() => setIsMapLoaded(true)}
                      title="Reflect Medical & Cosmetic Center Location"
                    ></iframe>
                  </div>
                  
                  {/* Map Footer */}
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-navy">Free Parking Available</p>
                        <p className="text-sm text-gray-600">Convenient access from Lafayette Avenue</p>
                      </div>
                      <button
                        onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(practiceInfo.address.full)}`, '_blank')}
                        className="flex items-center gap-2 text-[#B57EDC] font-semibold hover:text-[#9F6BCB] transition-colors"
                      >
                        <Car className="w-4 h-4" />
                        Directions
                      </button>
                    </div>
                  </div>
                </Card>
              </motion.div>

            </div>
          </div>
        </section>

        {/* Optional Team Section */}
        {physicians && physicians.length > 0 && (
          <section className="py-12 md:py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5, ease: "easeInOut" }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
                  Meet Our Expert Team
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Our board-certified professionals bring years of experience in aesthetic medicine
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {physicians.map((physician, index) => (
                  <motion.div
                    key={physician.name}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 + index * 0.1, ease: "easeInOut" }}
                  >
                    <Card variant="elevated" padding="lg" hover className="text-center h-full">
                      <div className="w-20 h-20 bg-gradient-to-br from-[#1F2937] to-[#B57EDC] rounded-full flex items-center justify-center mx-auto mb-4 shadow-soft">
                        <Users className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-navy mb-2">{physician.name}</h3>
                      <p className="text-[#B57EDC] font-medium mb-3">{physician.title}</p>
                      <p className="text-gray-600 text-sm leading-relaxed">{physician.specialization}</p>
                      
                      <div className="flex items-center justify-center gap-1 mt-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-premium-gold fill-current" />
                        ))}
                        <span className="text-sm text-gray-600 ml-2">Excellent Reviews</span>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Stats Section */}
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7, ease: "easeInOut" }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
                Trusted by the Community
              </h2>
              <p className="text-lg text-gray-600">
                Our commitment to excellence speaks for itself
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: Users, number: `${realStats.patientsServed.toLocaleString()}+`, label: "Patients Served", color: "bg-navy" },
                { icon: Award, number: `${realStats.satisfactionRate}%`, label: "Satisfaction Rate", color: "bg-[#B57EDC]" },
                { icon: Star, number: `${realStats.averageRating}/5`, label: "Average Rating", color: "bg-premium-gold" },
                { icon: Shield, number: "15+", label: "Years Experience", color: "bg-gray-600" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1, ease: "easeInOut" }}
                >
                  <Card variant="default" padding="lg" hover className="text-center group">
                    <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-soft group-hover:scale-110 transition-transform duration-200`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-navy mb-2">
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">
                      {stat.label}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

      </main>
    </AppLayout>
  );
};

export default Locations;