"use client";

import React from "react";
import { motion } from "framer-motion";
import { Plane, Check } from "lucide-react";
import Image from "next/image";

export default function StorySection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium mb-4">
              <Plane className="h-4 w-4" />
              Our Story
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              From Dreams to Destinations
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Thapa Holidays was founded in 2009 by Rajan Thapa, a passionate
              traveler who dreamed of sharing the beauty of India and the world
              with fellow explorers. What started as a small travel agency has
              grown into one of the country's most trusted travel partners.
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Our journey has been marked by countless memorable trips, from the
              snow-capped peaks of Sikkim to the serene backwaters of Kerala,
              from the royal heritage of Rajasthan to the pristine beaches of
              Goa. Each journey we craft is infused with our love for travel and
              commitment to excellence.
            </p>
            <div className="space-y-3">
              {[
                "Started with just 5 destinations, now offering 100+",
                "Grown from 2 employees to a team of 50+ travel experts",
                "Served over 50,000 happy travelers",
                "Multiple industry awards for service excellence",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-teal-500 to-yellow-500 flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <Image
              src="https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Our Journey"
              width={800}
              height={450}
              className="rounded-2xl shadow-2xl w-full h-80 md:h-[450px] object-cover"
            />
            <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-teal-500 to-yellow-500 text-white p-5 rounded-2xl shadow-xl">
              <div className="text-3xl font-bold">2009</div>
              <div className="text-white/90">Founded</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
