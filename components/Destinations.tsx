"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Clock,
  Mountain,
  Waves,
  Building2,
  Compass,
  Landmark,
  ArrowRight,
  Sparkles,
  Globe,
  Flag,
  ChevronRight,
  TreePine,
  Church,
  Camera,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const Destinations = () => {
  const router = useRouter();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"INDIA" | "WORLD">("INDIA");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const response = await fetch("/api/destinations?status=ACTIVE");
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
        return <Mountain className="h-4 w-4" />;
      case "BEACH":
        return <Waves className="h-4 w-4" />;
      case "CULTURAL":
        return <Landmark className="h-4 w-4" />;
      case "ADVENTURE":
        return <Compass className="h-4 w-4" />;
      case "CITY":
        return <Building2 className="h-4 w-4" />;
      case "WILDLIFE":
        return <TreePine className="h-4 w-4" />;
      case "PILGRIMAGE":
        return <Church className="h-4 w-4" />;
      case "DESERT":
        return <Globe className="h-4 w-4" />;
      case "HILL_STATION":
        return <Mountain className="h-4 w-4" />;
      case "ISLAND":
        return <Waves className="h-4 w-4" />;
      case "LAKE":
        return <Waves className="h-4 w-4" />;
      case "FOREST":
        return <TreePine className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category?.toUpperCase()) {
      case "MOUNTAIN":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "BEACH":
        return "bg-cyan-100 text-cyan-700 border-cyan-200";
      case "CULTURAL":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "ADVENTURE":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "CITY":
        return "bg-pink-100 text-pink-700 border-pink-200";
      case "WILDLIFE":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "PILGRIMAGE":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "DESERT":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "HILL_STATION":
        return "bg-indigo-100 text-indigo-700 border-indigo-200";
      case "ISLAND":
        return "bg-teal-100 text-teal-700 border-teal-200";
      case "LAKE":
        return "bg-sky-100 text-sky-700 border-sky-200";
      case "FOREST":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const handleDestinationClick = (destination: Destination) => {
    router.push(
      `/packages?destination=${destination.id}&name=${encodeURIComponent(
        destination.name
      )}`
    );
  };

  const indiaDestinations = destinations.filter((d) => d.region === "INDIA");
  const worldDestinations = destinations.filter((d) => d.region === "WORLD");
  const displayedDestinations =
    activeTab === "INDIA" ? indiaDestinations : worldDestinations;

  const finalDestinations = displayedDestinations;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  if (loading) {
    return (
      <section className="py-20 bg-linear-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            <p className="mt-4 text-gray-600">Loading destinations...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-linear-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.span
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-medium mb-4"
          >
            <Sparkles className="h-4 w-4" />
            Top Destinations
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 px-4 sm:px-0"
          >
            Explore Amazing Places
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto px-4 sm:px-0"
          >
            Discover breathtaking destinations across India and beyond
          </motion.p>
        </motion.div>

        {/* Fixed Tabs - No Overlapping */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex justify-center mb-12 px-4 sm:px-0"
        >
          <div className="bg-white rounded-2xl p-1.5 shadow-lg border border-gray-100 w-full max-w-sm sm:max-w-md md:max-w-lg">
            <div className="flex w-full">
              <button
                onClick={() => setActiveTab("INDIA")}
                className={cn(
                  "relative flex-1 px-4 py-3 rounded-xl font-medium text-sm sm:text-base transition-all duration-300",
                  activeTab === "INDIA"
                    ? "text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900 bg-gray-50"
                )}
              >
                {activeTab === "INDIA" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-teal-500 to-yellow-500 rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Flag className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">
                    India{" "}
                    <span className="hidden xs:inline">
                      ({indiaDestinations.length})
                    </span>
                  </span>
                </span>
              </button>

              <div className="w-2" />

              <button
                onClick={() => setActiveTab("WORLD")}
                className={cn(
                  "relative flex-1 px-4 py-3 rounded-xl font-medium text-sm sm:text-base transition-all duration-300",
                  activeTab === "WORLD"
                    ? "text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900 bg-gray-50"
                )}
              >
                {activeTab === "WORLD" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-teal-500 to-yellow-500 rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Globe className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">
                    World{" "}
                    <span className="hidden xs:inline">
                      ({worldDestinations.length})
                    </span>
                  </span>
                </span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Destinations Grid with enhanced animations */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 sm:px-0"
          >
            {finalDestinations.length > 0 ? (
              finalDestinations.slice(0, 8).map((destination, index) => (
                <motion.div
                  key={destination.id}
                  variants={itemVariants}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  onMouseEnter={() => setHoveredCard(destination.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <Card
                    className="group relative cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 p-0"
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
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                        </>
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 text-sm">
                            No image
                          </span>
                        </div>
                      )}

                      {/* Category Badge */}
                      <div className="absolute top-3 left-3 z-10">
                        <Badge
                          className={`${getCategoryColor(
                            destination.category
                          )} flex items-center gap-1 border backdrop-blur-sm`}
                        >
                          {getCategoryIcon(destination.category)}
                          <span className="capitalize text-xs">
                            {destination.category?.toLowerCase()}
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
                            <MapPin className="h-3.5 w-3.5 mr-1" />
                            {destination.location}
                          </div>
                        </motion.div>
                      </div>
                    </div>

                    <CardContent className="p-4 relative z-10">
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                        {destination.description}
                      </p>

                      <div className="flex items-center justify-between">
                        {destination.bestTime && (
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="h-3.5 w-3.5 mr-1 text-teal-500" />
                            Best: {destination.bestTime}
                          </div>
                        )}
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
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="bg-gray-50 rounded-2xl p-8 max-w-md mx-auto">
                  <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No destinations found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {activeTab === "INDIA"
                      ? "No Indian destinations available at the moment."
                      : "No international destinations available at the moment."}
                  </p>
                  <Button
                    onClick={() =>
                      activeTab === "INDIA"
                        ? setActiveTab("WORLD")
                        : setActiveTab("INDIA")
                    }
                    className="bg-gradient-to-r from-teal-500 to-yellow-500 hover:from-teal-600 hover:to-yellow-600 text-white"
                  >
                    View {activeTab === "INDIA" ? "World" : "India"}{" "}
                    Destinations
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* View All Button - Only show if there are destinations */}
        {finalDestinations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="text-center mt-12 px-4 sm:px-0"
          >
            <Button
              onClick={() => router.push("/destinations")}
              size="lg"
              className="group relative bg-gradient-to-r from-teal-500 to-yellow-500 hover:from-teal-600 hover:to-yellow-600 text-white rounded-full px-8 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                View All Destinations
                <motion.span
                  className="ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <ArrowRight className="h-5 w-5" />
                </motion.span>
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-teal-600 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={false}
              />
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Destinations;
