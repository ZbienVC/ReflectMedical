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
  Shield
} from "lucide-react";

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
    <div className="space-y-8 pb-12">
      {/* Hero */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Our Location</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Visit Reflect Medical & Cosmetic Center in Bergen County.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Address Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-violet-50 dark:bg-violet-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Practice Location</h3>
                <address className="text-gray-600 dark:text-gray-400 not-italic leading-relaxed text-sm">
                  {practiceInfo.address.street}<br />
                  {practiceInfo.address.city}, {practiceInfo.address.state} {practiceInfo.address.zipCode}
                </address>
                <button 
                  onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(practiceInfo.address.full)}`, '_blank')}
                  className="inline-flex items-center gap-2 text-violet-600 dark:text-violet-400 font-semibold mt-3 hover:text-violet-700 dark:hover:text-violet-300 transition-colors text-sm"
                >
                  <Navigation className="w-4 h-4" />
                  Get Directions
                </button>
              </div>
            </div>
          </div>

          {/* Contact Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-violet-50 dark:bg-violet-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Contact Information</h3>
                <div className="space-y-2">
                  <a 
                    href={`tel:${practiceInfo.phone}`}
                    className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors group"
                  >
                    <Phone className="w-4 h-4" />
                    <span className="font-medium text-sm">{practiceInfo.phone}</span>
                  </a>
                  <a 
                    href={practiceInfo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors group"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="font-medium text-sm">Visit Website</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Hours Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-violet-50 dark:bg-violet-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Practice Hours</h3>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${isOpenToday ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800" : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600"}`}>
                    {isOpenToday ? "Open Today" : "Closed Today"}
                  </span>
                </div>
                <div className="space-y-2">
                  {hoursArray.map(({ day, hours }) => (
                    <div 
                      key={day}
                      className={`flex justify-between items-center py-1 text-sm ${
                        day.toLowerCase() === todayKey ? 'font-semibold' : ''
                      }`}
                    >
                      <span className="text-gray-700 dark:text-gray-300">{day}</span>
                      <span className={hours === 'Closed' ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-400'}>
                        {hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <a
            href={`tel:${practiceInfo.phone}`}
            className="flex items-center justify-center gap-2 w-full bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 text-white rounded-xl px-6 py-4 font-semibold transition-colors text-lg"
          >
            <Calendar className="w-5 h-5" />
            Book Your Appointment
          </a>
        </motion.div>

        {/* Right Column - Map */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="aspect-square md:aspect-[4/3] w-full bg-gray-100 dark:bg-gray-700 relative">
              {!isMapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Loading Map...</p>
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
                className="w-full h-full"
                onLoad={() => setIsMapLoaded(true)}
                title="Reflect Medical & Cosmetic Center Location"
              ></iframe>
            </div>
            
            <div className="p-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">Free Parking Available</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Convenient access from Lafayette Avenue</p>
                </div>
                <button
                  onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(practiceInfo.address.full)}`, '_blank')}
                  className="flex items-center gap-2 text-violet-600 dark:text-violet-400 font-semibold hover:text-violet-700 dark:hover:text-violet-300 transition-colors text-sm"
                >
                  <Car className="w-4 h-4" />
                  Directions
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Team Section */}
      {physicians && physicians.length > 0 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Meet Our Expert Team</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              Our board-certified professionals bring years of experience in aesthetic medicine
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {physicians.map((physician, index) => (
              <motion.div
                key={physician.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 text-center"
              >
                <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-2 border-violet-100 shadow-md">
                  {physician.image ? (
                    <img
                      src={physician.image}
                      alt={physician.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-violet-600 to-violet-700 flex items-center justify-center">
                      <span className="text-white text-2xl font-black">
                        {physician.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                      </span>
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{physician.name}</h3>
                <p className="text-violet-600 dark:text-violet-400 font-medium text-sm mb-2">{physician.title}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">{physician.specialties?.join(", ")}</p>
                <div className="flex items-center justify-center gap-1 mt-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">Excellent Reviews</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Trusted by the Community</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Our commitment to excellence speaks for itself</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Users, number: `${realStats.patientsServed.toLocaleString()}+`, label: "Patients Served" },
            { icon: Award, number: `${realStats.satisfactionRate}%`, label: "Satisfaction Rate" },
            { icon: Star, number: `${realStats.averageRating}/5`, label: "Average Rating" },
            { icon: Shield, number: "15+", label: "Years Experience" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 text-center"
            >
              <div className="w-10 h-10 bg-violet-50 dark:bg-violet-900/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <stat.icon className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.number}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Locations;
