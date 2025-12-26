"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Send,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Headphones,
  MessageSquare,
  Shield,
  Navigation,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    hotelType: "",
    destination: "",
    travelDate: "",
    groupSize: "",
    budget: "",
    specialRequirements: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [destinations, setDestinations] = useState<any[]>([]);

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const res = await fetch("/api/destinations?status=ACTIVE");
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setDestinations(data);
        } else {
          // Fallback to hardcoded destinations if API returns empty
          setDestinations([
            { id: "1", name: "Darjeeling" },
            { id: "2", name: "Sikkim" },
            { id: "3", name: "Kolkata" },
            { id: "4", name: "Doars" },
            { id: "5", name: "Bhutan" },
            { id: "6", name: "Nepal" },
            { id: "7", name: "Assam" },
            { id: "8", name: "Meghalaya" },
            { id: "9", name: "Arunachal Pradesh" },
          ]);
        }
      } else {
        // Fallback to hardcoded destinations if API fails
        setDestinations([
          { id: "1", name: "Darjeeling" },
          { id: "2", name: "Sikkim" },
          { id: "3", name: "Kolkata" },
          { id: "4", name: "Doars" },
          { id: "5", name: "Bhutan" },
          { id: "6", name: "Nepal" },
          { id: "7", name: "Assam" },
          { id: "8", name: "Meghalaya" },
          { id: "9", name: "Arunachal Pradesh" },
        ]);
      }
    } catch (error) {
      console.error("Error fetching destinations:", error);
      // Fallback to hardcoded destinations if API fails
      setDestinations([
        { id: "1", name: "Darjeeling" },
        { id: "2", name: "Sikkim" },
        { id: "3", name: "Kolkata" },
        { id: "4", name: "Doars" },
        { id: "5", name: "Bhutan" },
        { id: "6", name: "Nepal" },
        { id: "7", name: "Assam" },
        { id: "8", name: "Meghalaya" },
        { id: "9", name: "Arunachal Pradesh" },
      ]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          type: "CONTACT",
          message:
            formData.specialRequirements || "Travel consultation request",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        toast.success("Message sent successfully!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          hotelType: "",
          destination: "",
          travelDate: "",
          groupSize: "",
          budget: "",
          specialRequirements: "",
        });
      } else {
        throw new Error(data.error || "Failed to send message");
      }
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast.error(
        error.message || "Sorry, there was an error sending your message."
      );
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Address",
      content: "Vastu Vihar, Near Steel Factory\nPanchkulgari, Siliguri",
      color: "bg-gradient-to-br from-teal-500 to-yellow-500",
      iconColor: "text-white",
    },
    {
      icon: Phone,
      title: "Phone",
      content: "+91 9002660557\n+91 8617410057",
      href: "tel:+919002660557",
      color: "bg-gradient-to-br from-blue-500 to-cyan-500",
      iconColor: "text-white",
    },
    {
      icon: Mail,
      title: "Email",
      content: "thapa.holidays09@gmail.com",
      href: "mailto:thapa.holidays09@gmail.com",
      color: "bg-gradient-to-br from-purple-500 to-pink-500",
      iconColor: "text-white",
    },
    {
      icon: Clock,
      title: "Office Hours",
      content: "Mon - Sat: 9AM - 8PM\nSunday: 10AM - 6PM",
      color: "bg-gradient-to-br from-orange-500 to-red-500",
      iconColor: "text-white",
    },
  ];

  const businessHours = [
    { day: "Monday - Friday", time: "9:00 AM - 8:00 PM" },
    { day: "Saturday", time: "9:00 AM - 6:00 PM" },
    { day: "Sunday", time: "10:00 AM - 4:00 PM" },
  ];

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
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen pt-24 lg:pt-32 pb-20 bg-white">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-teal-500/5 to-yellow-500/5 -skew-y-3" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-bl from-teal-500/5 to-yellow-500/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500/10 to-yellow-500/10 border border-teal-200 rounded-full text-sm font-medium mb-4 mt-5"
          >
            <MessageSquare className="h-4 w-4 text-teal-600" />
            <span className="bg-gradient-to-r from-teal-600 to-yellow-600 bg-clip-text text-transparent font-semibold">
              Get In Touch
            </span>
            <Headphones className="h-4 w-4 text-yellow-600" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
          >
            <span className="bg-gradient-to-r from-teal-600 to-yellow-600 bg-clip-text text-transparent">
              Contact
            </span>{" "}
            Us
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Have questions about your next adventure? We're here to help plan
            your perfect trip!
          </motion.p>
        </motion.div>

        {/* Contact Info Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
        >
          {contactInfo.map((item, index) => (
            <motion.div key={item.title} variants={itemVariants}>
              <Card className="group relative h-full border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 bg-white overflow-hidden">
                <CardContent className="relative p-6 text-center">
                  <div
                    className={cn(
                      "w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110",
                      item.color
                    )}
                  >
                    <item.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
                    {item.title}
                  </h3>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-gray-600 hover:text-teal-600 transition-colors whitespace-pre-line text-sm block"
                    >
                      {item.content}
                    </a>
                  ) : (
                    <p className="text-gray-600 whitespace-pre-line text-sm">
                      {item.content}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="shadow-xl border border-gray-200 bg-white overflow-hidden">
              {submitted ? (
                <CardContent className="p-8 text-center">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center"
                  >
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-bold text-gray-900 mb-2"
                  >
                    Thank You! 🎉
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-gray-600 mb-6"
                  >
                    Your message has been sent successfully. We'll get back to
                    you soon!
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Button
                      onClick={() => setSubmitted(false)}
                      size="lg"
                      className="bg-gradient-to-r from-teal-500 to-yellow-500 hover:from-teal-600 hover:to-yellow-600 text-white rounded-full px-8 py-6"
                    >
                      Send Another Message
                      <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </motion.div>
                </CardContent>
              ) : (
                <>
                  <CardContent className="p-6 sm:p-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      Get Your Free Travel Consultation
                    </h2>
                    <p className="text-gray-600 mb-6">
                      Fill out the form below and our travel experts will get
                      back to you with personalized recommendations.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Personal Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                          Personal Information
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                              Full Name *
                            </label>
                            <Input
                              required
                              placeholder="Your full name"
                              value={formData.name}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  name: e.target.value,
                                })
                              }
                              className="w-full border-gray-300 focus:border-teal-500 focus:ring-teal-500 h-11"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700">
                                Email Address *
                              </label>
                              <Input
                                type="email"
                                required
                                placeholder="your@email.com"
                                value={formData.email}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    email: e.target.value,
                                  })
                                }
                                className="w-full border-gray-300 focus:border-teal-500 focus:ring-teal-500 h-11"
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700">
                                Phone Number *
                              </label>
                              <Input
                                type="tel"
                                required
                                placeholder="+91 98765 43210"
                                value={formData.phone}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    phone: e.target.value,
                                  })
                                }
                                className="w-full border-gray-300 focus:border-teal-500 focus:ring-teal-500 h-11"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Travel Preferences */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                          Travel Preferences
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700">
                                Destination
                              </label>
                              <Select
                                value={formData.destination}
                                onValueChange={(value) =>
                                  setFormData({
                                    ...formData,
                                    destination: value,
                                  })
                                }
                              >
                                <SelectTrigger className="w-full border-gray-300 focus:border-teal-500 focus:ring-teal-500 h-11">
                                  <SelectValue placeholder="Select destination" />
                                </SelectTrigger>
                                <SelectContent>
                                  {destinations.map((destination) => (
                                    <SelectItem
                                      key={destination.id || destination.name}
                                      value={destination.name}
                                    >
                                      {destination.name}
                                    </SelectItem>
                                  ))}
                                  <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700">
                                Travel Date
                              </label>
                              <Input
                                type="date"
                                value={formData.travelDate}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    travelDate: e.target.value,
                                  })
                                }
                                className="w-full border-gray-300 focus:border-teal-500 focus:ring-teal-500 h-11"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700">
                                Hotel Type
                              </label>
                              <Select
                                value={formData.hotelType}
                                onValueChange={(value) =>
                                  setFormData({ ...formData, hotelType: value })
                                }
                              >
                                <SelectTrigger className="w-full border-gray-300 focus:border-teal-500 focus:ring-teal-500 h-11">
                                  <SelectValue placeholder="Select hotel type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Budget">
                                    Budget (₹1,000-₹3,000)
                                  </SelectItem>
                                  <SelectItem value="Standard">
                                    Standard (₹3,000-₹7,000)
                                  </SelectItem>
                                  <SelectItem value="Deluxe">
                                    Deluxe (₹7,000-₹15,000)
                                  </SelectItem>
                                  <SelectItem value="Luxury">
                                    Luxury (₹15,000+)
                                  </SelectItem>
                                  <SelectItem value="Homestay">
                                    Homestay
                                  </SelectItem>
                                  <SelectItem value="Resort">Resort</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700">
                                Group Size
                              </label>
                              <Select
                                value={formData.groupSize}
                                onValueChange={(value) =>
                                  setFormData({ ...formData, groupSize: value })
                                }
                              >
                                <SelectTrigger className="w-full border-gray-300 focus:border-teal-500 focus:ring-teal-500 h-11">
                                  <SelectValue placeholder="Select group size" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1">1 Person</SelectItem>
                                  <SelectItem value="2">2 People</SelectItem>
                                  <SelectItem value="3-5">
                                    3-5 People
                                  </SelectItem>
                                  <SelectItem value="6-10">
                                    6-10 People
                                  </SelectItem>
                                  <SelectItem value="11-20">
                                    11-20 People
                                  </SelectItem>
                                  <SelectItem value="20+">
                                    20+ People
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700">
                                Budget Range
                              </label>
                              <Select
                                value={formData.budget}
                                onValueChange={(value) =>
                                  setFormData({ ...formData, budget: value })
                                }
                              >
                                <SelectTrigger className="w-full border-gray-300 focus:border-teal-500 focus:ring-teal-500 h-11">
                                  <SelectValue placeholder="Select budget" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Under ₹10,000">
                                    Under ₹10,000
                                  </SelectItem>
                                  <SelectItem value="₹10,000-₹25,000">
                                    ₹10,000-₹25,000
                                  </SelectItem>
                                  <SelectItem value="₹25,000-₹50,000">
                                    ₹25,000-₹50,000
                                  </SelectItem>
                                  <SelectItem value="₹50,000-₹1,00,000">
                                    ₹50,000-₹1,00,000
                                  </SelectItem>
                                  <SelectItem value="₹1,00,000-₹2,00,000">
                                    ₹1,00,000-₹2,00,000
                                  </SelectItem>
                                  <SelectItem value="Above ₹2,00,000">
                                    Above ₹2,00,000
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                              Special Requirements
                            </label>
                            <Textarea
                              rows={4}
                              placeholder="Any special requirements, dietary restrictions, accessibility needs, or specific preferences..."
                              value={formData.specialRequirements}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  specialRequirements: e.target.value,
                                })
                              }
                              className="w-full border-gray-300 focus:border-teal-500 focus:ring-teal-500 resize-none"
                            />
                          </div>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={loading}
                        size="lg"
                        className="w-full bg-gradient-to-r from-teal-500 to-yellow-500 hover:from-teal-600 hover:to-yellow-600 text-white rounded-full py-4 text-lg font-semibold transition-all duration-300 hover:shadow-lg disabled:opacity-50 h-14"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            Get Free Consultation
                            <Send className="h-5 w-5 ml-2" />
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>

                  {/* Form Footer */}
                  <CardFooter className="px-6 pb-6 pt-0">
                    <div className="flex items-center gap-3 text-sm text-gray-500 w-full justify-center">
                      <Shield className="h-4 w-4 text-teal-500" />
                      <span>
                        Your information is secure and will never be shared
                      </span>
                    </div>
                  </CardFooter>
                </>
              )}
            </Card>
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-6"
          >
            {/* WhatsApp CTA */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="h-8 w-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">
                      Quick Chat on WhatsApp
                    </h3>
                    <p className="text-green-100 mb-4 text-sm sm:text-base">
                      Get instant responses for your travel queries. Our team is
                      available to help you plan your dream vacation!
                    </p>
                    <Button
                      asChild
                      size="lg"
                      className="bg-white text-green-600 hover:bg-green-50 rounded-full px-6 py-6"
                    >
                      <a
                        href="https://wa.me/919002660557?text=Hi! I'm interested in your travel packages."
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="h-5 w-5 mr-2" />
                        <span>Chat Now</span>
                        <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map */}
            <Card className="overflow-hidden shadow-xl border border-gray-200">
              <div className="aspect-video relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3565.2!2d88.4!3d26.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDQyJzAwLjAiTiA4OMKwMjQnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                />
              </div>
              <CardFooter className="p-4 bg-gray-50">
                <div className="flex items-center gap-3 text-gray-700 w-full">
                  <Navigation className="h-5 w-5 text-teal-500 flex-shrink-0" />
                  <span className="text-sm font-medium">
                    Vastu Vihar, Near Steel Factory, Panchkulgari, Siliguri
                  </span>
                </div>
              </CardFooter>
            </Card>

            {/* Business Hours */}
            <Card className="shadow-xl border border-gray-200 bg-white">
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-teal-500 to-yellow-500 rounded-lg">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-teal-600 to-yellow-600 bg-clip-text text-transparent">
                    Business Hours
                  </span>
                </h3>
                <div className="space-y-3">
                  {businessHours.map((item, index) => (
                    <motion.div
                      key={item.day}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="flex justify-between items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <span className="text-sm text-gray-600">{item.day}</span>
                      <span className="font-medium text-gray-900 text-sm bg-white px-3 py-1 rounded-full shadow-sm">
                        {item.time}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
