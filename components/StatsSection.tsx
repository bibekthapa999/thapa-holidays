"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users, Globe, Award, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  { number: "50,000+", label: "Happy Travelers", icon: Users },
  { number: "100+", label: "Destinations", icon: Globe },
  { number: "15+", label: "Years Experience", icon: Award },
  { number: "4.9/5", label: "Customer Rating", icon: Star },
];

export default function StatsSection() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="text-center border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    <div className="w-14 h-14 bg-gradient-to-r from-teal-500 to-yellow-500 rounded-full flex items-center justify-center">
                      <stat.icon className="h-7 w-7 text-white" />
                    </div>
                  </div>
                  <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-teal-600 to-yellow-600 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 text-sm font-medium">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
