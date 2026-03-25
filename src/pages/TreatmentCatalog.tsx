"use client";

import React, { useState, useMemo } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { Card, Badge } from "../components/ui";
import { 
  Search,
  Filter,
  Clock,
  TrendingUp,
  Star,
  ArrowRight,
  Calendar,
  Award,
  Sparkles,
  ChevronDown,
  Heart,
  Zap
} from "lucide-react";
import { 
  treatments, 
  categories, 
  getTreatmentsByCategory, 
  getPopularTreatments,
  calculateSavings,
  formatPrice,
  Treatment 
} from "../data/treatments";

const TreatmentCatalog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popularity"); // popularity, price, name
  const [showFilters, setShowFilters] = useState(false);
  
  const membershipTier = "Evolve"; // Would come from auth context
  const memberDiscount = 0.20; // 20% discount for Evolve members

  // Filter and sort treatments
  const filteredTreatments = useMemo(() => {
    let filtered = getTreatmentsByCategory(selectedCategory);
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(treatment => 
        treatment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        treatment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        treatment.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sort treatments
    switch (sortBy) {
      case "popularity":
        return filtered.sort((a, b) => b.popularityScore - a.popularityScore);
      case "price":
        return filtered.sort((a, b) => a.memberPrice - b.memberPrice);
      case "name":
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return filtered;
    }
  }, [searchTerm, selectedCategory, sortBy]);

  const popularTreatments = getPopularTreatments(6);
  const recommendedTreatments = treatments.filter(t => 
    t.recommendedFor.includes(membershipTier)
  ).slice(0, 4);

  const TreatmentCard: React.FC<{ treatment: Treatment }> = ({ treatment }) => {
    const savings = calculateSavings(treatment);
    const isRecommended = treatment.recommendedFor.includes(membershipTier);

    return (
      <Card className="p-6 bg-white rounded-2xl shadow-lg border border-black/5 hover:shadow-xl hover:border-[#B57EDC]/20 transition-all duration-200 group cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-[#1F2937] group-hover:text-[#B57EDC] transition-colors">
                {treatment.name}
              </h3>
              {isRecommended && (
                <Badge className="bg-gradient-to-r from-[#B57EDC] to-[#9F6BCB] text-white text-xs px-2 py-1">
                  Recommended
                </Badge>
              )}
            </div>
            <Badge variant="outline" className="border-[#B57EDC]/20 text-[#6B7280] text-xs mb-3">
              {treatment.category}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-[#B57EDC] fill-current" />
            <span className="text-sm font-medium text-[#1F2937]">
              {(treatment.popularityScore / 10).toFixed(1)}
            </span>
          </div>
        </div>

        <p className="text-sm text-[#6B7280] mb-4 leading-relaxed line-clamp-2">
          {treatment.description}
        </p>

        <div className="flex items-center gap-4 text-xs text-[#6B7280] mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{treatment.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            <span>Lasts {treatment.resultsDuration}</span>
          </div>
        </div>

        <div className="border-t border-black/5 pt-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold text-[#1F2937]">
                {formatPrice(treatment.memberPrice)}{treatment.units && (
                  <span className="text-sm font-normal text-[#6B7280]"> {treatment.units}</span>
                )}
              </span>
              <span className="text-sm line-through text-[#9CA3AF]">
                {formatPrice(treatment.basePrice)}
              </span>
            </div>
            {treatment.sessionPackage && (
              <Badge variant="outline" className="text-xs border-[#B57EDC]/20 text-[#B57EDC]">
                {treatment.sessionPackage} sessions
              </Badge>
            )}
          </div>
          
          <p className="text-xs text-[#B57EDC] font-medium mb-4">
            You save {formatPrice(savings)} with {membershipTier} membership
          </p>
          
          <div className="flex gap-2">
            <button className="flex-1 bg-[#B57EDC] text-white py-2.5 px-4 rounded-xl font-medium hover:bg-[#9F6BCB] transition-colors text-sm">
              Book Now
            </button>
            <button className="px-4 py-2.5 border border-[#B57EDC]/20 text-[#B57EDC] rounded-xl hover:bg-[#B57EDC]/5 transition-colors">
              <Heart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#1F2937]">Treatment Catalog</h1>
            <p className="text-[#6B7280] mt-1">Discover and book your next aesthetic treatment</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-gradient-to-r from-[#B57EDC] to-[#9F6BCB] text-white px-4 py-2">
              {membershipTier} Pricing
            </Badge>
            <button className="text-[#B57EDC] hover:text-[#9F6BCB] text-sm font-medium">
              View Membership Benefits
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="p-6 bg-white rounded-2xl shadow-lg border border-black/5">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
              <input
                type="text"
                placeholder="Search treatments, concerns, or body areas..."
                className="w-full pl-10 pr-4 py-3 border border-black/10 rounded-xl focus:outline-none focus:border-[#B57EDC] focus:ring-1 focus:ring-[#B57EDC]/20 transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto lg:overflow-visible">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-3 rounded-xl font-medium text-sm whitespace-nowrap transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-[#B57EDC] text-white shadow-lg'
                      : 'bg-[#F7F6FB] text-[#6B7280] hover:bg-[#F4EEFB] hover:text-[#B57EDC]'
                  }`}
                >
                  {category.name}
                  <span className="ml-2 text-xs opacity-75">
                    ({category.count})
                  </span>
                </button>
              ))}
            </div>
            
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-[#F7F6FB] border border-black/10 rounded-xl px-4 py-3 pr-8 text-sm font-medium text-[#1F2937] focus:outline-none focus:border-[#B57EDC] focus:ring-1 focus:ring-[#B57EDC]/20 transition-colors cursor-pointer"
              >
                <option value="popularity">Most Popular</option>
                <option value="price">Price: Low to High</option>
                <option value="name">Name: A to Z</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
            </div>
          </div>
        </Card>

        {/* Recommended Section */}
        {searchTerm === "" && selectedCategory === "all" && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-6 h-6 text-[#B57EDC]" />
              <h2 className="text-2xl font-bold text-[#1F2937]">Recommended for You</h2>
              <Badge className="bg-[#B57EDC]/10 text-[#B57EDC]">
                {membershipTier} Member
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {recommendedTreatments.map((treatment) => (
                <TreatmentCard key={treatment.id} treatment={treatment} />
              ))}
            </div>
          </div>
        )}

        {/* Popular Treatments */}
        {searchTerm === "" && selectedCategory === "all" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-[#B57EDC]" />
                <h2 className="text-2xl font-bold text-[#1F2937]">Popular This Month</h2>
              </div>
              <button className="text-[#B57EDC] hover:text-[#9F6BCB] font-medium flex items-center gap-1">
                View All
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {popularTreatments.map((treatment) => (
                <TreatmentCard key={treatment.id} treatment={treatment} />
              ))}
            </div>
          </div>
        )}

        {/* All Treatments Results */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#1F2937]">
              {searchTerm || selectedCategory !== "all" ? "Search Results" : "All Treatments"} 
              <span className="text-[#6B7280] font-normal ml-2">
                ({filteredTreatments.length} treatments)
              </span>
            </h2>
          </div>

          {filteredTreatments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTreatments.map((treatment) => (
                <TreatmentCard key={treatment.id} treatment={treatment} />
              ))}
            </div>
          ) : (
            <Card className="p-12 bg-white rounded-2xl shadow-lg border border-black/5 text-center">
              <Search className="w-12 h-12 text-[#6B7280] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#1F2937] mb-2">No treatments found</h3>
              <p className="text-[#6B7280] mb-6">
                Try adjusting your search or browse our popular treatments
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
                className="bg-[#B57EDC] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#9F6BCB] transition-colors"
              >
                Browse All Treatments
              </button>
            </Card>
          )}
        </div>

        {/* Membership CTA */}
        <Card className="p-8 bg-gradient-to-br from-[#B57EDC] to-[#9F6BCB] text-white rounded-2xl shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Award className="w-8 h-8" />
                <h3 className="text-2xl font-bold">Maximize Your Savings</h3>
              </div>
              <p className="text-white/90 mb-4 text-lg">
                Upgrade to Transform membership and unlock exclusive treatments with up to 30% savings
              </p>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  <span>Priority Booking</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  <span>Exclusive Treatments</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  <span>VIP Support</span>
                </div>
              </div>
            </div>
            <div className="ml-8">
              <button className="bg-white text-[#B57EDC] px-8 py-4 rounded-xl font-semibold hover:bg-white/95 transition-colors shadow-lg">
                Upgrade Membership
              </button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TreatmentCatalog;