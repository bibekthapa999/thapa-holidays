"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Star,
  Clock,
  Mountain,
  Waves,
  Building2,
  Compass,
  Landmark,
  ArrowRight,
  Sparkles,
  Search,
  SlidersHorizontal,
  Filter,
  Globe,
  Calendar,
  ChevronRight,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Destination {
  id: string;
  name: string;
  slug: string;
  location: string;
  country: string;
  region: string;
  image: string | null;
  rating: number;
  reviews: number;
  description: string;
  highlights: string[];
  category: string;
  bestTime: string | null;
  status: string;
  _count?: { packages: number };
}

export default function DestinationsPage() {
  const router = useRouter();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    fetchDestinations();
  }, [selectedRegion, selectedCategory]);

  const fetchDestinations = async () => {
    try {
      let url = "/api/destinations?status=ACTIVE";
      if (selectedRegion !== "all") {
        url += `&region=${selectedRegion}`;
      }
      if (selectedCategory !== "all") {
        url += `&category=${selectedCategory}`;
      }
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setDestinations(data || []);
      }
    } catch (error) {
      console.error("Error fetching destinations:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category?.toUpperCase()) {
      case "MOUNTAIN":
        return <Mountain className="h-3.5 w-3.5 sm:h-4 sm:w-4" />;
      case "BEACH":
        return <Waves className="h-3.5 w-3.5 sm:h-4 sm:w-4" />;
      case "CULTURAL":
        return <Landmark className="h-3.5 w-3.5 sm:h-4 sm:w-4" />;
      case "ADVENTURE":
        return <Compass className="h-3.5 w-3.5 sm:h-4 sm:w-4" />;
      case "CITY":
        return <Building2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />;
      default:
        return <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category?.toUpperCase()) {
      case "MOUNTAIN":
        return "bg-blue-50 border-blue-200 text-blue-700";
      case "BEACH":
        return "bg-cyan-50 border-cyan-200 text-cyan-700";
      case "CULTURAL":
        return "bg-purple-50 border-purple-200 text-purple-700";
      case "ADVENTURE":
        return "bg-orange-50 border-orange-200 text-orange-700";
      case "CITY":
        return "bg-pink-50 border-pink-200 text-pink-700";
      default:
        return "bg-gray-50 border-gray-200 text-gray-700";
    }
  };

  const handleDestinationClick = (destination: Destination) => {
    router.push(
      `/packages?destination=${destination.id}&name=${encodeURIComponent(
        destination.name
      )}`
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedRegion("all");
    setSelectedCategory("all");
  };

  const displayDestinations = destinations;
  const filteredDestinations = displayDestinations.filter((dest) => {
    const matchesSearch =
      dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const categories = [...new Set(displayDestinations.map((d) => d.category))];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <Card key={i} className="overflow-hidden border-0 shadow-lg">
          <div className="h-56 bg-gray-200 animate-pulse" />
          <CardContent className="p-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />
            <div className="h-3 bg-gray-200 rounded w-full mb-1 animate-pulse" />
            <div className="h-3 bg-gray-200 rounded w-5/6 mb-3 animate-pulse" />
            <div className="flex justify-between">
              <div className="h-6 bg-gray-200 rounded w-20 animate-pulse" />
              <div className="h-6 bg-gray-200 rounded w-16 animate-pulse" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen pt-24 lg:pt-32 pb-20 bg-gradient-to-b from-white via-gray-50/50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500/10 to-yellow-500/10 border border-teal-200/50 rounded-full text-sm font-medium mb-4 backdrop-blur-sm mt-5"
          >
            <Sparkles className="h-4 w-4 text-teal-600" />
            <span className="bg-gradient-to-r from-teal-600 to-yellow-600 bg-clip-text text-transparent font-semibold">
              Explore Destinations
            </span>
            <Globe className="h-4 w-4 text-yellow-600" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 px-4 sm:px-0"
          >
            Amazing{" "}
            <span className="bg-gradient-to-r from-teal-600 to-yellow-600 bg-clip-text text-transparent">
              Destinations
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto px-4 sm:px-0"
          >
            Discover breathtaking places across India and the world
          </motion.p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8 flex justify-center"
        >
          <Card className="border border-gray-100 shadow-lg bg-white/80 backdrop-blur-sm max-w-4xl w-full">
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                {/* Search Input */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Destinations
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search destinations, locations..."
                      className="pl-10 h-9 bg-gray-50 border-gray-200 focus:border-teal-500 focus:ring-teal-500 text-sm w-full"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 hover:bg-gray-100 rounded-full p-1 transition-colors"
                      >
                        <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Region Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Region
                  </label>
                  <div className="relative">
                    <Select
                      value={selectedRegion}
                      onValueChange={setSelectedRegion}
                    >
                      <SelectTrigger className="pl-10 h-9 bg-gray-50 border-gray-200 focus:border-teal-500 focus:ring-teal-500 w-full">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <SelectValue placeholder="All Regions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Regions</SelectItem>
                        <SelectItem value="INDIA">🇮🇳 India</SelectItem>
                        <SelectItem value="WORLD">🌍 International</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <div className="relative">
                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger className="pl-10 h-9 bg-gray-50 border-gray-200 focus:border-teal-500 focus:ring-teal-500 w-full">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            <span className="capitalize">
                              {cat.toLowerCase()}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Clear Filters Button - Always visible */}
              <div className="flex justify-center mt-4">
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  className="h-9 border-gray-200 hover:bg-gray-50 text-gray-700 px-6"
                  disabled={
                    !searchTerm &&
                    selectedRegion === "all" &&
                    selectedCategory === "all"
                  }
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear All Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Count and Active Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div>
            <p className="text-gray-600">
              Showing{" "}
              <span className="font-semibold bg-gradient-to-r from-teal-600 to-yellow-600 bg-clip-text text-transparent">
                {filteredDestinations.length}
              </span>{" "}
              destination{filteredDestinations.length !== 1 ? "s" : ""}
            </p>
          </div>

          {(searchTerm ||
            selectedRegion !== "all" ||
            selectedCategory !== "all") && (
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <Badge
                  variant="outline"
                  className="bg-teal-50 text-teal-700 border-teal-200"
                >
                  Search: "{searchTerm}"
                </Badge>
              )}
              {selectedRegion !== "all" && (
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200"
                >
                  {selectedRegion === "INDIA" ? "🇮🇳 India" : "🌍 International"}
                </Badge>
              )}
              {selectedCategory !== "all" && (
                <Badge
                  variant="outline"
                  className="bg-purple-50 text-purple-700 border-purple-200 capitalize"
                >
                  {selectedCategory.toLowerCase()}
                </Badge>
              )}
            </div>
          )}
        </motion.div>

        {/* Destinations Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <LoadingSkeleton />
          ) : filteredDestinations.length > 0 ? (
            <motion.div
              key="destinations-grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
            >
              {filteredDestinations.map((destination, index) => (
                <motion.div
                  key={destination.id}
                  variants={itemVariants}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  onMouseEnter={() => setHoveredCard(destination.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <Card
                    className="group relative cursor-pointer overflow-hidden border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white h-full p-0"
                    onClick={() => handleDestinationClick(destination)}
                  >
                    {/* Hover gradient overlay */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"
                      animate={{
                        scale: hoveredCard === destination.id ? 1.1 : 1,
                      }}
                    />

                    {/* Image */}
                    <div className="relative h-56 overflow-hidden w-full m-0 p-0">
                      {destination.image ? (
                        <>
                          <img
                            src={destination.image}
                            alt={destination.name}
                            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        </>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <div className="text-center">
                            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                            <span className="text-gray-500 text-sm">
                              No image available
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Category Badge */}
                      <div className="absolute top-3 left-3 z-10">
                        <Badge
                          className={cn(
                            "border backdrop-blur-sm font-medium px-3 py-1.5",
                            getCategoryColor(destination.category)
                          )}
                        >
                          {getCategoryIcon(destination.category)}
                          <span className="ml-1.5 capitalize text-xs font-semibold">
                            {destination.category?.toLowerCase()}
                          </span>
                        </Badge>
                      </div>

                      {/* Rating */}
                      <div className="absolute top-3 right-3 z-10">
                        <Badge className="bg-white/95 text-gray-800 border border-gray-200 font-medium shadow-sm">
                          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 mr-1.5" />
                          {destination.rating}
                          <span className="text-gray-500 text-xs ml-1">
                            ({destination.reviews || 0})
                          </span>
                        </Badge>
                      </div>

                      {/* Title Overlay with animation */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                        <motion.div
                          animate={{
                            y: hoveredCard === destination.id ? -5 : 0,
                          }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <h3 className="text-xl font-bold text-white mb-1 group-hover:text-yellow-300 transition-colors">
                            {destination.name}
                          </h3>
                          <div className="flex items-center text-white/80 text-sm">
                            <MapPin className="h-3.5 w-3.5 mr-1 text-teal-300" />
                            {destination.location}
                          </div>
                        </motion.div>
                      </div>
                    </div>

                    <CardContent className="p-4 relative z-10">
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3 min-h-[40px]">
                        {destination.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs text-gray-500">
                          {destination.bestTime ? (
                            <>
                              <Calendar className="h-3.5 w-3.5 mr-1.5 text-teal-500" />
                              <span className="font-medium">
                                Best: {destination.bestTime}
                              </span>
                            </>
                          ) : (
                            <span className="text-gray-400 text-xs">
                              No season info
                            </span>
                          )}
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="group/btn bg-gradient-to-r from-teal-50 to-yellow-50 hover:from-teal-500 hover:to-yellow-500 hover:text-white text-teal-600 border border-teal-100 rounded-full px-3 py-1.5 shadow-sm hover:shadow transition-all duration-300"
                        >
                          <span className="text-xs font-medium">Explore</span>
                          <motion.span
                            animate={{
                              x: hoveredCard === destination.id ? 3 : 0,
                            }}
                            transition={{ type: "spring", stiffness: 400 }}
                          >
                            <ChevronRight className="h-4 w-4 ml-1.5 group-hover/btn:translate-x-1 transition-transform" />
                          </motion.span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-16"
            >
              <Card className="max-w-md mx-auto border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                    <Search className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No destinations found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your search or filter criteria
                  </p>
                  <Button
                    onClick={clearFilters}
                    size="lg"
                    className="group relative bg-gradient-to-r from-teal-500 to-yellow-500 hover:from-teal-600 hover:to-yellow-600 text-white rounded-full px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center">
                      Clear All Filters
                      <motion.span
                        className="ml-2"
                        animate={{ rotate: [0, 180, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        <X className="h-5 w-5" />
                      </motion.span>
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-teal-600 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={false}
                    />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
