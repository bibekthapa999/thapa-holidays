"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 mt-2"
      >
        <span className="inline-flex items-center gap-2 px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-medium mb-4">
          <Heart className="h-4 w-4" />
          About Us
        </span>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          Your Journey Begins With Us
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Creating unforgettable travel experiences since 2009
        </p>
      </motion.div>

      {/* Main Image */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative rounded-2xl overflow-hidden shadow-2xl"
      >
        <Image
          src="https://images.pexels.com/photos/2108813/pexels-photo-2108813.jpeg?auto=compress&cs=tinysrgb&w=1200"
          alt="Travel Experience"
          width={1200}
          height={400}
          className="w-full h-64 md:h-96 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            15+ Years of Excellence
          </h2>
          <p className="text-white/80 max-w-lg">
            From humble beginnings to becoming one of India's most trusted
            travel partners
          </p>
        </div>
      </motion.div>
    </section>
  );
}
