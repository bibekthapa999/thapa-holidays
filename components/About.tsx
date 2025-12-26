"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Shield,
  Award,
  Users,
  Globe,
  Star,
  Check,
  ArrowRight,
  Heart,
  Plane,
  Calendar,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const About: React.FC = () => {
  const router = useRouter();

  const stats = [
    { number: "50,000+", label: "Happy Travelers", icon: Users },
    { number: "100+", label: "Destinations", icon: Globe },
    { number: "15+", label: "Years Experience", icon: Award },
    { number: "4.9/5", label: "Customer Rating", icon: Star },
  ];

  const features = [
    {
      icon: Shield,
      title: "Safe & Secure Travel",
      description:
        "Your safety is our priority with 24/7 support and comprehensive travel insurance.",
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      iconColor: "text-blue-500",
    },
    {
      icon: Award,
      title: "Award Winning Service",
      description:
        "Recognized for excellence in travel services and customer satisfaction.",
      color: "bg-gradient-to-br from-yellow-500 to-orange-500",
      iconColor: "text-yellow-500",
    },
    {
      icon: Users,
      title: "Expert Local Guides",
      description:
        "Knowledgeable local guides who bring destinations to life with their stories.",
      color: "bg-gradient-to-br from-teal-500 to-green-500",
      iconColor: "text-teal-500",
    },
    {
      icon: Globe,
      title: "Sustainable Tourism",
      description:
        "Committed to responsible travel that benefits local communities and environment.",
      color: "bg-gradient-to-br from-purple-500 to-pink-500",
      iconColor: "text-purple-500",
    },
  ];

  const highlights = [
    "Personalized itinerary planning",
    "24/7 customer support during travel",
    "Best price guarantee",
    "Sustainable and responsible tourism",
    "Expert local guides and partners",
  ];

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-white via-gray-50/50 to-white overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-teal-500/5 to-yellow-500/5 -skew-y-3" />
      <div className="absolute bottom-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-bl from-teal-500/10 to-yellow-500/10 rounded-full blur-3xl" />
      <div className="absolute top-20 left-10 w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-tr from-yellow-500/10 to-teal-500/10 rounded-full blur-3xl" />

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
            <Heart className="h-4 w-4 text-teal-600" />
            <span className="bg-gradient-to-r from-teal-600 to-yellow-600 bg-clip-text text-transparent font-semibold">
              Why Choose Us
            </span>
            <TrendingUp className="h-4 w-4 text-yellow-600" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 px-4 sm:px-0"
          >
            Why Choose{" "}
            <span className="bg-gradient-to-r from-teal-600 to-yellow-600 bg-clip-text text-transparent">
              Thapa Holidays
            </span>
            ?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto px-4 sm:px-0"
          >
            With over 15 years of experience creating unforgettable travel
            experiences across India
          </motion.p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16 lg:mb-20 px-4 sm:px-0"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + 0.6 }}
            >
              <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 h-full">
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <CardContent className="relative p-4 sm:p-6 text-center">
                  <div className="flex justify-center mb-3 sm:mb-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-teal-500 to-yellow-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-teal-600 to-yellow-600 bg-clip-text text-transparent mb-1">
                    {stat.number}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-16 lg:mb-20 px-4 sm:px-0">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + 0.7 }}
            >
              <Card className="group relative overflow-hidden border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 h-full">
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <CardContent className="relative p-4 sm:p-6">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div
                      className={cn(
                        "w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300",
                        feature.color
                      )}
                    >
                      <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2 group-hover:text-teal-600 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-xs sm:text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* About Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="relative px-4 sm:px-0"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Travel Experience"
                className="w-full h-64 sm:h-80 md:h-96 object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </div>

            {/* Floating Card */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1, type: "spring", bounce: 0.4 }}
              className="absolute -bottom-6 -right-4 sm:-right-6 z-10"
            >
              <Card className="border-0 shadow-2xl bg-gradient-to-r from-teal-500 to-yellow-500 text-white overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-yellow-600 opacity-0 hover:opacity-100 transition-opacity duration-300" />
                <CardContent className="relative p-4 sm:p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <Calendar className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-bold">15+</div>
                      <div className="text-white/90 text-xs sm:text-sm">
                        Years of Excellence
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.9 }}
            className="px-4 sm:px-0"
          >
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
              Creating{" "}
              <span className="bg-gradient-to-r from-teal-600 to-yellow-600 bg-clip-text text-transparent">
                Memories
              </span>{" "}
              Since 2009
            </h3>

            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                Thapa Holidays was founded with a simple mission: to make travel
                accessible, enjoyable, and meaningful for everyone. What started
                as a small local travel agency has grown into one of India's
                most trusted travel partners.
              </p>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                We believe that travel is more than just visiting places – it's
                about connecting with cultures, creating lasting memories, and
                discovering new perspectives.
              </p>
            </div>

            {/* Highlights List */}
            <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
              {highlights.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 1 }}
                  className="flex items-start gap-2 sm:gap-3"
                >
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-r from-teal-500 to-yellow-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-2 w-2 sm:h-3 sm:w-3 text-white" />
                  </div>
                  <span className="text-gray-700 text-sm sm:text-base">
                    {item}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <Button
              onClick={() => router.push("/about")}
              size="lg"
              className="group relative bg-gradient-to-r from-teal-500 to-yellow-500 hover:from-teal-600 hover:to-yellow-600 text-white rounded-full px-6 sm:px-8 py-5 sm:py-6 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                Learn More About Us
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
        </div>
      </div>
    </section>
  );
};

export default About;
