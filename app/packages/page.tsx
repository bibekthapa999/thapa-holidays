"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Star,
  Users,
  Calendar,
  Filter,
  Search,
  ArrowRight,
  Check,
  Sparkles,
  SlidersHorizontal,
  Tag,
  Shield,
  Percent,
  ChevronRight,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface Package {
  id: string;
  name: string;
  slug: string;
  destinationName: string;
  image: string | null;
  price: number;
  originalPrice: number | null;
  duration: string;
  groupSize: string;
  rating: number;
  type: string;
  badge: string | null;
  featured: boolean;
  inclusions?: string[];
}

function PackagesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedFeatured, setSelectedFeatured] = useState("all");
  const [selectedDestination, setSelectedDestination] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Package types for filtering
  const packageTypes = ["BUDGET", "PREMIUM", "LUXURY"];

  // Featured options for filtering
  const featuredOptions = [
    { value: "all", label: "All Packages" },
    { value: "true", label: "Featured Only" },
    { value: "false", label: "Regular Only" },
  ];

  const destinationId = searchParams.get("destination");
  const destinationName = searchParams.get("name");

  const activeFiltersCount =
    (searchTerm ? 1 : 0) +
    (selectedType !== "all" ? 1 : 0) +
    (selectedFeatured !== "all" ? 1 : 0) +
    (selectedDestination !== "all" ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 50000 ? 1 : 0);

  useEffect(() => {
    fetchPackages();
    fetchDestinations();
  }, [
    destinationId,
    selectedType,
    selectedFeatured,
    selectedDestination,
    priceRange,
  ]);

  // Auto-open filters when there are active filters
  useEffect(() => {
    if (activeFiltersCount > 0 && !showFilters) {
      setShowFilters(true);
    }
  }, [activeFiltersCount, showFilters]);

  const fetchPackages = async () => {
    try {
      let url = "/api/packages?status=ACTIVE";
      if (destinationId) {
        url += `&destinationId=${destinationId}`;
      }
      if (selectedType !== "all") {
        url += `&type=${selectedType}`;
      }
      if (selectedFeatured !== "all") {
        url += `&featured=${selectedFeatured}`;
      }
      if (selectedDestination !== "all") {
        url += `&destinationId=${selectedDestination}`;
      }
      if (priceRange[0] > 0) {
        url += `&minPrice=${priceRange[0]}`;
      }
      if (priceRange[1] < 50000) {
        url += `&maxPrice=${priceRange[1]}`;
      }
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setPackages(data || []);
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDestinations = async () => {
    try {
      const response = await fetch("/api/destinations?status=ACTIVE");
      if (response.ok) {
        const data = await response.json();
        setDestinations(data || []);
      }
    } catch (error) {
      console.error("Error fetching destinations:", error);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedType("all");
    setSelectedFeatured("all");
    setSelectedDestination("all");
    setPriceRange([0, 50000]);
    setShowFilters(false);
  };

  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch =
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.destinationName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || pkg.type === selectedType;
    const matchesFeatured =
      selectedFeatured === "all" ||
      (selectedFeatured === "true" && pkg.featured) ||
      (selectedFeatured === "false" && !pkg.featured);
    return matchesSearch && matchesType && matchesFeatured;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case "BUDGET":
        return "bg-green-50 border-green-200 text-green-700";
      case "PREMIUM":
        return "bg-blue-50 border-blue-200 text-blue-700";
      case "LUXURY":
        return "bg-purple-50 border-purple-200 text-purple-700";
      default:
        return "bg-gray-50 border-gray-200 text-gray-700";
    }
  };

  const getBadgeColor = (badge: string | null) => {
    switch (badge) {
      case "Bestseller":
        return "bg-gradient-to-r from-red-500 to-orange-500 text-white";
      case "Popular":
        return "bg-gradient-to-r from-teal-500 to-cyan-500 text-white";
      case "Limited":
        return "bg-gradient-to-r from-purple-500 to-pink-500 text-white";
      default:
        return "bg-gradient-to-r from-teal-500 to-yellow-500 text-white";
    }
  };

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
      transition: {
        duration: 0.4,
      },
    },
  };

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="overflow-hidden border-0 shadow-lg">
          <div className="h-52 bg-gray-200 animate-pulse" />
          <CardContent className="p-5">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-3 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2 animate-pulse" />
            <div className="flex gap-4 mb-4">
              <div className="h-8 bg-gray-200 rounded w-20 animate-pulse" />
              <div className="h-8 bg-gray-200 rounded w-20 animate-pulse" />
            </div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-5/6 mb-4 animate-pulse" />
            <div className="h-10 bg-gray-200 rounded w-full animate-pulse" />
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
              {destinationName
                ? `Packages for ${destinationName}`
                : "Featured Packages"}
            </span>
            <Tag className="h-4 w-4 text-yellow-600" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 px-4 sm:px-0"
          >
            {destinationName ? (
              <>
                Explore{" "}
                <span className="bg-gradient-to-r from-teal-600 to-yellow-600 bg-clip-text text-transparent">
                  {destinationName}
                </span>
              </>
            ) : (
              <>
                <span className="bg-gradient-to-r from-teal-600 to-yellow-600 bg-clip-text text-transparent">
                  Tour
                </span>{" "}
                Packages
              </>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto px-4 sm:px-0"
          >
            Discover our carefully crafted tour packages to amazing destinations
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
                    Search Packages
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search packages or destinations..."
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

                {/* Filter Toggle Button */}
                <div className="md:col-span-2 flex justify-end">
                  <Collapsible open={showFilters} onOpenChange={setShowFilters}>
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="outline"
                        className={`h-9 border-gray-200 hover:bg-gray-50 text-gray-700 px-4 flex items-center gap-2 relative ${
                          activeFiltersCount > 0
                            ? "border-teal-300 bg-teal-50/50"
                            : ""
                        }`}
                      >
                        <SlidersHorizontal className="h-4 w-4" />
                        <span className="hidden sm:inline">
                          Filters{" "}
                          {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                        </span>
                        {activeFiltersCount > 0 && (
                          <span className="sm:hidden bg-teal-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {activeFiltersCount}
                          </span>
                        )}
                        <ChevronRight
                          className={`h-4 w-4 transition-transform duration-200 ${
                            showFilters ? "rotate-90" : ""
                          }`}
                        />
                      </Button>
                    </CollapsibleTrigger>
                  </Collapsible>
                </div>
              </div>

              {/* Collapsible Filters */}
              <Collapsible open={showFilters} onOpenChange={setShowFilters}>
                <CollapsibleContent className="mt-6 pt-6 border-t border-gray-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Type Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Package Type
                      </label>
                      <div className="relative">
                        <Select
                          value={selectedType}
                          onValueChange={setSelectedType}
                        >
                          <SelectTrigger className="pl-10 h-9 bg-gray-50 border-gray-200 focus:border-teal-500 focus:ring-teal-500 w-full">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <SelectValue placeholder="All Types" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            {packageTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Featured Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Featured
                      </label>
                      <div className="relative">
                        <Select
                          value={selectedFeatured}
                          onValueChange={setSelectedFeatured}
                        >
                          <SelectTrigger className="pl-10 h-9 bg-gray-50 border-gray-200 focus:border-teal-500 focus:ring-teal-500 w-full">
                            <Star className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <SelectValue placeholder="All Packages" />
                          </SelectTrigger>
                          <SelectContent>
                            {featuredOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Destination Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Destination
                      </label>
                      <div className="relative">
                        <Select
                          value={selectedDestination}
                          onValueChange={setSelectedDestination}
                        >
                          <SelectTrigger className="pl-10 h-9 bg-gray-50 border-gray-200 focus:border-teal-500 focus:ring-teal-500 w-full">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <SelectValue placeholder="All Destinations" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">
                              All Destinations
                            </SelectItem>
                            {destinations.map((dest) => (
                              <SelectItem key={dest.id} value={dest.id}>
                                {dest.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Price Range Filter */}
                    <div className="sm:col-span-2 lg:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Price Range
                      </label>
                      <div className="space-y-3">
                        <div className="px-2">
                          <Slider
                            value={priceRange}
                            onValueChange={setPriceRange}
                            max={50000}
                            min={0}
                            step={1000}
                            className="w-full"
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>₹{priceRange[0].toLocaleString()}</span>
                          <span>
                            ₹
                            {priceRange[1] >= 50000
                              ? "50,000+"
                              : priceRange[1].toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Clear Filters Button */}
                  <div className="flex justify-center mt-6">
                    <Button
                      onClick={clearFilters}
                      variant="outline"
                      className="h-9 border-gray-200 hover:bg-gray-50 text-gray-700 px-6"
                      disabled={
                        !searchTerm &&
                        selectedType === "all" &&
                        selectedFeatured === "all" &&
                        selectedDestination === "all" &&
                        priceRange[0] === 0 &&
                        priceRange[1] === 50000
                      }
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear All Filters
                    </Button>
                  </div>
                </CollapsibleContent>
              </Collapsible>
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
                {filteredPackages.length}
              </span>{" "}
              package{filteredPackages.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {destinationId && (
              <Button
                variant="outline"
                onClick={() => router.push("/packages")}
                className="text-sm h-8 border-gray-200"
              >
                Clear Destination Filter
              </Button>
            )}
          </div>
        </motion.div>

        {/* Packages Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <LoadingSkeleton />
          ) : filteredPackages.length > 0 ? (
            <motion.div
              key="packages-grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredPackages.map((pkg, index) => (
                <motion.div
                  key={pkg.id}
                  variants={itemVariants}
                  onMouseEnter={() => setHoveredCard(pkg.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <Card
                    className="group relative cursor-pointer overflow-hidden border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white h-full p-0"
                    onClick={() => router.push(`/packages/${pkg.slug}`)}
                  >
                    {/* Hover gradient overlay */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"
                      animate={{
                        scale: hoveredCard === pkg.id ? 1.1 : 1,
                      }}
                    />

                    {/* Image Container */}
                    <div className="relative h-52 overflow-hidden w-full m-0 p-0">
                      {pkg.image ? (
                        <>
                          <img
                            src={pkg.image}
                            alt={pkg.name}
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

                      {/* Badge */}
                      {pkg.badge && (
                        <div className="absolute top-3 left-3 z-10">
                          <Badge
                            className={cn(
                              "border-0 shadow-sm font-medium px-3 py-1.5",
                              getBadgeColor(pkg.badge)
                            )}
                          >
                            <Sparkles className="h-3 w-3 mr-1.5" />
                            {pkg.badge}
                          </Badge>
                        </div>
                      )}

                      {/* Type Badge */}
                      <div className="absolute top-3 right-3 z-10">
                        <Badge
                          className={cn(
                            "border backdrop-blur-sm font-medium px-3 py-1.5",
                            getTypeColor(pkg.type)
                          )}
                        >
                          {pkg.type}
                        </Badge>
                      </div>

                      {/* Rating */}
                      <div className="absolute bottom-3 left-3 z-10">
                        <Badge className="bg-white/95 text-gray-800 border border-gray-200 font-medium shadow-sm">
                          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 mr-1.5" />
                          {pkg.rating}
                        </Badge>
                      </div>

                      {/* Price Overlay */}
                      <div className="absolute bottom-3 right-3 z-10">
                        <div className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-100 shadow-sm">
                          {pkg.originalPrice && (
                            <div className="flex items-center mb-1">
                              <span className="text-xs text-gray-500 line-through mr-2">
                                ₹{pkg.originalPrice.toLocaleString()}
                              </span>
                              <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs px-1.5 py-0.5">
                                <Percent className="h-2.5 w-2.5 mr-1" />
                                {Math.round(
                                  ((pkg.originalPrice - pkg.price) /
                                    pkg.originalPrice) *
                                    100
                                )}
                                %
                              </Badge>
                            </div>
                          )}
                          <span className="text-lg font-bold bg-gradient-to-r from-teal-600 to-yellow-600 bg-clip-text text-transparent">
                            ₹{pkg.price.toLocaleString()}
                            <span className="text-gray-500 text-xs font-normal ml-1">
                              per person
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Content */}
                    <CardContent className="p-5 bg-white relative z-10">
                      {/* Package Title */}
                      <motion.div
                        animate={{
                          y: hoveredCard === pkg.id ? -3 : 0,
                        }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors line-clamp-1">
                          {pkg.name}
                        </h3>
                      </motion.div>

                      {/* Destination */}
                      <div className="flex items-center text-gray-600 mb-3">
                        <MapPin className="h-4 w-4 mr-2 text-teal-500" />
                        <span className="text-sm font-medium">
                          {pkg.destinationName}
                        </span>
                      </div>

                      {/* Duration and Group Size */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full">
                          <Calendar className="h-4 w-4 mr-2 text-teal-500" />
                          <span className="font-medium">{pkg.duration}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full">
                          <Users className="h-4 w-4 mr-2 text-teal-500" />
                          <span className="font-medium">{pkg.groupSize}</span>
                        </div>
                      </div>

                      {/* Inclusions */}
                      {pkg.inclusions && pkg.inclusions.length > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center text-xs text-gray-500 mb-2">
                            <Check className="h-3 w-3 mr-1.5 text-green-500" />
                            <span className="font-medium">Inclusions:</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {pkg.inclusions
                              .slice(0, 3)
                              .map((inclusion, idx) => (
                                <Badge
                                  key={idx}
                                  variant="outline"
                                  className="text-xs bg-green-50 text-green-700 border-green-200"
                                >
                                  <Check className="h-3 w-3 mr-1" />
                                  {inclusion}
                                </Badge>
                              ))}
                            {pkg.inclusions.length > 3 && (
                              <Badge
                                variant="outline"
                                className="text-xs bg-gray-50 text-gray-600 border-gray-200"
                              >
                                +{pkg.inclusions.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {/* CTA Button */}
                      <Button className="w-full group/btn bg-gradient-to-r from-teal-500 to-yellow-500 hover:from-teal-600 hover:to-yellow-600 text-white rounded-lg py-6 shadow-md hover:shadow-lg transition-all duration-300">
                        <span className="font-medium">View Details</span>
                        <motion.span
                          className="ml-2"
                          animate={{
                            x: hoveredCard === pkg.id ? 5 : 0,
                          }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                        </motion.span>
                      </Button>
                    </CardContent>

                    {/* Trust Badges */}
                    <CardFooter className="px-5 pb-4 pt-0 bg-white relative z-10">
                      <div className="flex items-center justify-center gap-4 text-xs text-gray-500 w-full">
                        <div className="flex items-center">
                          <Shield className="h-3 w-3 mr-1 text-teal-500" />
                          <span className="font-medium">Secure</span>
                        </div>
                        <div className="h-3 w-px bg-gray-300" />
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1 text-teal-500" />
                          <span className="font-medium">Flexible</span>
                        </div>
                        <div className="h-3 w-px bg-gray-300" />
                        <div className="flex items-center">
                          <Tag className="h-3 w-3 mr-1 text-teal-500" />
                          <span className="font-medium">Best Price</span>
                        </div>
                      </div>
                    </CardFooter>
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
                    No packages found
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

function LoadingFallback() {
  return (
    <div className="min-h-screen pt-24 lg:pt-32 flex items-center justify-center bg-gradient-to-b from-white via-gray-50/50 to-white">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mb-4"></div>
        <p className="text-gray-600">Loading packages...</p>
      </div>
    </div>
  );
}

export default function PackagesPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PackagesContent />
    </Suspense>
  );
}
