"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, Heart, Award, Globe, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const values = [
  {
    icon: Shield,
    title: "Safety First",
    description:
      "Your safety and security are our top priorities on every journey.",
  },
  {
    icon: Heart,
    title: "Passion for Travel",
    description:
      "We're travelers ourselves, sharing our love for exploration with you.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "Committed to delivering exceptional service in every detail.",
  },
  {
    icon: Globe,
    title: "Sustainability",
    description:
      "Responsible tourism that benefits local communities and environment.",
  },
];

export default function ValuesSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-medium mb-4">
            <Star className="h-4 w-4" />
            Our Values
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            What Drives Us
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 bg-gradient-to-r from-teal-500 to-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
