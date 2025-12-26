"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Clock,
  Users,
  MapPin,
  Check,
  ArrowRight,
  Sparkles,
  Plane,
  Percent,
  Calendar,
  Shield,
  Tag,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
  inclusions: string[];
}

const Packages: React.FC = () => {
  const router = useRouter();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch("/api/packages?status=ACTIVE&limit=6");
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
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="overflow-hidden border-0 shadow-lg">
          <Skeleton className="h-56 w-full" />
          <CardContent className="p-5">
            <Skeleton className="h-6 w-3/4 mb-3" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <div className="flex gap-4 mb-4">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6 mb-4" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-white via-gray-50/50 to-white overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-72 h-72 sm:w-96 sm:h-96 bg-gradient-to-br from-teal-500/10 to-yellow-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 sm:w-96 sm:h-96 bg-gradient-to-tr from-yellow-500/10 to-teal-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500/10 to-yellow-500/10 border border-teal-200/50 rounded-full text-sm font-medium mb-4 backdrop-blur-sm"
          >
            <Sparkles className="h-4 w-4 text-teal-600" />
            <span className="bg-gradient-to-r from-teal-600 to-yellow-600 bg-clip-text text-transparent font-semibold">
              Featured Packages
            </span>
            <Plane className="h-4 w-4 text-yellow-600" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 px-4 sm:px-0"
          >
            <span className="bg-gradient-to-r from-teal-600 to-yellow-600 bg-clip-text text-transparent">
              Handpicked
            </span>{" "}
            Tour Packages
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto px-4 sm:px-0"
          >
            Unforgettable experiences curated just for you at the best prices
          </motion.p>
        </motion.div>

        {/* Packages Grid */}
        <AnimatePresence>
          {loading ? (
            <LoadingSkeleton />
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {packages.slice(0, 6).map((pkg, index) => (
                <motion.div
                  key={pkg.id}
                  variants={itemVariants}
                  transition={{ duration: 0.4, ease: "easeOut" }}
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
                    <div className="relative h-56 overflow-hidden w-full m-0 p-0">
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
                          <Clock className="h-4 w-4 mr-2 text-teal-500" />
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
                        <span className="font-medium">Book Now</span>
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
          )}
        </AnimatePresence>

        {/* View All Button */}
        {!loading && packages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="text-center mt-12 lg:mt-16"
          >
            <Button
              onClick={() => router.push("/packages")}
              size="lg"
              className="group relative bg-gradient-to-r from-teal-500 to-yellow-500 hover:from-teal-600 hover:to-yellow-600 text-white rounded-full px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                View All Packages
                <motion.span
                  className="ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <ChevronRight className="h-5 w-5" />
                </motion.span>
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-teal-600 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={false}
              />
            </Button>
          </motion.div>
        )}

        {/* No Packages Message */}
        {!loading && packages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="bg-gray-50 rounded-2xl p-8 max-w-md mx-auto">
              <Plane className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No packages available
              </h3>
              <p className="text-gray-600 mb-6">
                We're currently updating our tour packages. Please check back
                soon!
              </p>
              <Button
                onClick={() => router.push("/")}
                className="bg-gradient-to-r from-teal-500 to-yellow-500 hover:from-teal-600 hover:to-yellow-600 text-white"
              >
                Back to Home
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Packages;
