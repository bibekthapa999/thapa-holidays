"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Star,
  Search,
  Package,
  Loader2,
  ArrowRight,
  Sparkles,
  Users,
  Globe,
  Plane,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchResult {
  id: string;
  type: "package" | "destination";
  title: string;
  subtitle: string;
  price?: number;
  href: string;
  image?: string;
  rating?: number;
}

const Hero = ({ onBookNow }: { onBookNow?: () => void }) => {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const slides = [
    {
      image:
        "https://images.pexels.com/photos/3278215/pexels-photo-3278215.jpeg?auto=compress&cs=tinysrgb&w=1920",
      title: "Discover Incredible India",
      subtitle: "From the Himalayas to the backwaters, experience the magic",
    },
    {
      image:
        "https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=1920",
      title: "Adventure Awaits",
      subtitle: "Trek through pristine mountains and explore hidden gems",
    },
    {
      image:
        "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=1920",
      title: "Cultural Heritage",
      subtitle: "Immerse yourself in rich traditions and timeless experiences",
    },
  ];

  const popularDestinations = [
    "Sikkim",
    "Darjeeling",
    "Goa",
    "Kerala",
    "Rajasthan",
    "Ladakh",
    "Andaman",
  ];

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setIsSearching(true);
        setHasSearched(false);
        try {
          const res = await fetch(
            `/api/search?q=${encodeURIComponent(searchQuery)}`
          );
          if (res.ok) {
            const data = await res.json();
            setSearchResults(data.results || []);
            setShowResults(true);
          }
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          setIsSearching(false);
          setHasSearched(true);
        }
      } else {
        setSearchResults([]);
        setShowResults(false);
        setHasSearched(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close search results on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleResultClick = (href: string) => {
    setShowResults(false);
    setSearchQuery("");
    router.push(href);
  };

  const handleSearch = () => {
    if (searchQuery.length >= 2) {
      router.push(`/packages?search=${encodeURIComponent(searchQuery)}`);
      setShowResults(false);
    }
  };

  return (
    <div className="relative h-[90vh] w-full overflow-hidden mt-20 lg:mt-[120px]">
      {/* Background Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/75" />
        </div>
      ))}

      {/* Main Content - Compact & Centered */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-4xl mx-auto text-center space-y-4">
          {/* Badge - Compact */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-md rounded-full text-white text-sm font-medium border border-white/25">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            ✈️ Your Journey Begins Here
          </div>

          {/* Title - Responsive sizing */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white px-2 sm:px-0">
            {slides[currentSlide].title}
          </h1>

          {/* Subtitle - Responsive */}
          <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto px-2 sm:px-0">
            {slides[currentSlide].subtitle}
          </p>

          {/* Stats - Responsive layout */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 pt-2">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400" />
              <span className="text-xs sm:text-sm text-white">4.9 Rating</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-400" />
              <span className="text-xs sm:text-sm text-white">
                50K+ Travelers
              </span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" />
              <span className="text-xs sm:text-sm text-white">
                100+ Destinations
              </span>
            </div>
          </div>

          {/* CTA Button - Responsive with smaller mobile width */}
          <div className="pt-2">
            <Button
              onClick={() => router.push("/packages")}
              className="px-5 py-3.5 sm:px-6 sm:py-4 text-sm font-semibold bg-gradient-to-r from-teal-500 to-yellow-500 hover:from-teal-600 hover:to-yellow-600 text-white shadow-lg hover:shadow-xl w-auto"
            >
              <Plane className="w-4 h-4 mr-2" />
              Explore All Packages
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Search Section - Improved mobile layout */}
          <div
            ref={searchRef}
            className="w-full max-w-2xl mx-auto pt-2 px-2 sm:px-0"
          >
            <div className="bg-white rounded-xl shadow-xl p-3 sm:p-4">
              {/* Search Header */}
              <div className="flex items-center gap-2 text-gray-700 mb-3">
                <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-teal-500" />
                <h3 className="text-xs sm:text-sm font-semibold">
                  Search Destinations & Packages
                </h3>
              </div>

              {/* Search Input & Button - Improved mobile layout */}
              <div className="flex flex-col sm:flex-row gap-3 mb-3">
                <div className="flex-1 relative">
                  <div className="relative">
                    <Input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() =>
                        searchQuery.length >= 2 && setShowResults(true)
                      }
                      placeholder="e.g., Sikkim, Goa, Kerala..."
                      className="pl-9 sm:pl-10 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500 focus:border-teal-500 h-10 sm:h-11 text-sm"
                    />
                    <MapPin className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                    {isSearching && (
                      <Loader2 className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 animate-spin" />
                    )}
                  </div>

                  {/* Search Results Dropdown - Mobile optimized */}
                  <AnimatePresence>
                    {showResults &&
                      (searchResults.length > 0 ||
                        (hasSearched && searchResults.length === 0)) && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 max-h-48 sm:max-h-56 overflow-y-auto z-50"
                        >
                          {searchResults.length > 0 ? (
                            <>
                              {searchResults.slice(0, 4).map((result) => (
                                <button
                                  key={`${result.type}-${result.id}`}
                                  className="w-full flex items-center gap-2 p-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                                  onClick={() => handleResultClick(result.href)}
                                >
                                  {result.type === "package" ? (
                                    <Package className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-teal-500" />
                                  ) : (
                                    <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-500" />
                                  )}
                                  <div className="flex-1 text-left">
                                    <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                                      {result.title}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                      {result.subtitle}
                                    </p>
                                  </div>
                                  <ArrowRight className="h-3 w-3 text-gray-400" />
                                </button>
                              ))}
                              <button
                                onClick={handleSearch}
                                className="w-full p-2 text-center text-xs font-medium text-teal-600 hover:bg-teal-50 border-t border-gray-100"
                              >
                                View all results
                              </button>
                            </>
                          ) : (
                            <div className="p-3 text-center text-sm text-gray-500">
                              No search results found
                            </div>
                          )}
                        </motion.div>
                      )}
                  </AnimatePresence>
                </div>

                {/* Search Button - Full width on mobile */}
                <div className="sm:flex sm:items-center">
                  <Button
                    onClick={handleSearch}
                    disabled={
                      searchQuery.length < 2 ||
                      (hasSearched && searchResults.length === 0)
                    }
                    className={cn(
                      "w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-3 h-10 sm:h-11 text-sm font-medium",
                      searchQuery.length < 2 ||
                        (hasSearched && searchResults.length === 0)
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-teal-500 to-yellow-500 hover:from-teal-600 hover:to-yellow-600 text-white shadow-md hover:shadow-lg"
                    )}
                  >
                    <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>

              {/* Popular Destinations - Mobile optimized */}
              <div className="pt-3 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="text-xs text-gray-600 font-medium whitespace-nowrap">
                    Popular:
                  </span>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {popularDestinations.map((place) => (
                      <button
                        key={place}
                        onClick={() => {
                          setSearchQuery(place);
                          setShowResults(true);
                          setHasSearched(false);
                        }}
                        className="px-2 py-1 text-xs bg-gray-100 hover:bg-teal-50 hover:text-teal-700 text-gray-700 rounded transition-all duration-200 whitespace-nowrap"
                      >
                        {place}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="pt-2 flex justify-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentSlide
                    ? "w-6 sm:w-8 h-1.5 bg-white"
                    : "w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/50 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
