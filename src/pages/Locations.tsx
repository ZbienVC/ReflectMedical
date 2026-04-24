import React, { useState } from "react";
import { motion } from "framer-motion";
import { practiceInfo, physicians, realStats, realReviews } from "../data/practiceData";
import { MemberStories } from "../components/MemberStories";
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
  Shield,
  GraduationCap,
  BadgeCheck,
  Quote
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {physicians.map((physician, index) => {
              const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(physician.name)}&background=B57EDC&color=fff&size=200`;
              return (
                <motion.div
                  key={physician.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={avatarUrl}
                      alt={physician.name}
                      className="w-20 h-20 rounded-2xl object-cover flex-shrink-0 shadow-md"
                      onError={(e) => { (e.target as HTMLImageElement).src = avatarUrl; }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{physician.name}</h3>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 border border-violet-200 dark:border-violet-700">
                          {physician.experience}
                        </span>
                      </div>
                      <p className="text-violet-600 dark:text-violet-400 font-medium text-sm mt-0.5">{physician.title}</p>
                      <div className="flex items-center gap-1 mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                        ))}
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">Highly Rated</span>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">{physician.bio}</p>

                  {/* Specialties */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Specialties</p>
                    <div className="flex flex-wrap gap-1.5">
                      {physician.specialties.map((s) => (
                        <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 border border-violet-100 dark:border-violet-800">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Education */}
                  {"education" in physician && Array.isArray((physician as any).education) && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5" /> Education
                      </p>
                      <ul className="space-y-1">
                        {((physician as any).education as string[]).map((edu: string) => (
                          <li key={edu} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1.5">
                            <span className="text-violet-400 mt-0.5">•</span>{edu}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Certifications */}
                  {physician.certifications && (
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <BadgeCheck className="w-3.5 h-3.5" /> Certifications
                      </p>
                      <ul className="space-y-1">
                        {physician.certifications.map((cert) => (
                          <li key={cert} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1.5">
                            <span className="text-green-500 mt-0.5">✓</span>{cert}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              );
            })}
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
            { icon: Shield, number: `${realStats.yearsInBusiness}+`, label: "Years in Business" }
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

      {/* Patient Reviews Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">What Our Patients Say</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Verified reviews from real Reflect members</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {realReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5"
            >
              <div className="flex items-center gap-1 mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <div className="flex items-start gap-2 mb-3">
                <Quote className="w-4 h-4 text-violet-300 dark:text-violet-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed italic">{review.text}</p>
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{review.name}</p>
                  <p className="text-xs text-gray-400">{review.treatment}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 border border-violet-100 dark:border-violet-800">
                    {review.membershipTier}
                  </span>
                  {review.verified && (
                    <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-0.5">
                      <BadgeCheck className="w-3 h-3" /> Verified
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Member Stories Component */}
      <div className="-mx-4 sm:-mx-6 lg:-mx-8">
        <MemberStories />
      </div>
    </div>
  );
};

export default Locations;
