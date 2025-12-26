"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Send,
  Loader2,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Hotel,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface ConsultationPopupProps {
  onClose: () => void;
}

const ConsultationPopup: React.FC<ConsultationPopupProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    destination: "",
    travelDate: "",
    hotelType: "",
    groupSize: "",
    budget: "",
    specialRequirements: "",
  });
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
      // Construct message from form data
      const message = `Travel Consultation Request:
Name: ${formData.name}
Phone: ${formData.phone}
Destination: ${formData.destination || "Not specified"}
Travel Date: ${formData.travelDate || "Not specified"}
Hotel Type: ${formData.hotelType || "Not specified"}
Group Size: ${formData.groupSize || "Not specified"}
Budget: ${formData.budget || "Not specified"}
Special Requirements: ${formData.specialRequirements || "None"}`;

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message,
          type: "CONTACT",
          destination: formData.destination,
          travelDate: formData.travelDate,
          hotelType: formData.hotelType,
          groupSize: formData.groupSize,
          budget: formData.budget,
          specialRequirements: formData.specialRequirements,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        toast.success("Thank you! We'll get back to you soon.");
        setTimeout(() => {
          onClose();
        }, 2000);
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

  if (submitted) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="border-0 shadow-2xl bg-white">
              <CardContent className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                  className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center"
                >
                  <Sparkles className="h-10 w-10 text-green-600" />
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
                  Your consultation request has been sent successfully. Our
                  travel experts will get back to you within 24 hours!
                </motion.p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="border-0 shadow-2xl bg-white max-h-[90vh] overflow-hidden">
            {/* Header */}
            <CardHeader className="relative pb-3">
              <button
                onClick={onClose}
                className="absolute right-3 top-3 z-10 w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>

              <div className="text-center pr-8">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-linear-to-r from-teal-500/10 to-yellow-500/10 border border-teal-200 rounded-full text-sm font-medium mb-3"
                >
                  <Sparkles className="h-3.5 w-3.5 text-teal-600" />
                  <span className="bg-linear-to-r from-teal-600 to-yellow-600 bg-clip-text text-transparent font-semibold">
                    Free Consultation
                  </span>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl sm:text-2xl font-bold text-gray-900 mb-1"
                >
                  Plan Your Dream Trip
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-600 text-sm"
                >
                  Get personalized recommendations from our experts
                </motion.p>
              </div>
            </CardHeader>

            <CardContent className="px-5 pb-5 overflow-y-auto max-h-[calc(90vh-200px)]">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Compact Form Layout */}
                <div className="grid grid-cols-1 gap-3">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">
                      Full Name *
                    </label>
                    <Input
                      required
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full border-gray-300 focus:border-teal-500 focus:ring-teal-500 h-10 text-sm"
                    />
                  </div>

                  {/* Email and Phone in one row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">
                        Email *
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
                        className="w-full border-gray-300 focus:border-teal-500 focus:ring-teal-500 h-10 text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">
                        Phone *
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
                        className="w-full border-gray-300 focus:border-teal-500 focus:ring-teal-500 h-10 text-sm"
                      />
                    </div>
                  </div>

                  {/* Travel Details in compact grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">
                        Destination
                      </label>
                      <Select
                        value={formData.destination}
                        onValueChange={(value) =>
                          setFormData({ ...formData, destination: value })
                        }
                      >
                        <SelectTrigger className="w-full border-gray-300 focus:border-teal-500 focus:ring-teal-500 h-10 text-sm">
                          <SelectValue placeholder="Select" />
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

                    <div className="space-y-1.5">
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
                        className="w-full border-gray-300 focus:border-teal-500 focus:ring-teal-500 h-10 text-sm"
                      />
                    </div>
                  </div>

                  {/* Hotel Type and Group Size */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">
                        Hotel Type
                      </label>
                      <Select
                        value={formData.hotelType}
                        onValueChange={(value) =>
                          setFormData({ ...formData, hotelType: value })
                        }
                      >
                        <SelectTrigger className="w-full border-gray-300 focus:border-teal-500 focus:ring-teal-500 h-10 text-sm">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Budget">Budget</SelectItem>
                          <SelectItem value="Standard">Standard</SelectItem>
                          <SelectItem value="Deluxe">Deluxe</SelectItem>
                          <SelectItem value="Luxury">Luxury</SelectItem>
                          <SelectItem value="Homestay">Homestay</SelectItem>
                          <SelectItem value="Resort">Resort</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">
                        Group Size
                      </label>
                      <Select
                        value={formData.groupSize}
                        onValueChange={(value) =>
                          setFormData({ ...formData, groupSize: value })
                        }
                      >
                        <SelectTrigger className="w-full border-gray-300 focus:border-teal-500 focus:ring-teal-500 h-10 text-sm">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Person</SelectItem>
                          <SelectItem value="2">2 People</SelectItem>
                          <SelectItem value="3-5">3-5 People</SelectItem>
                          <SelectItem value="6-10">6-10 People</SelectItem>
                          <SelectItem value="11-20">11-20 People</SelectItem>
                          <SelectItem value="20+">20+ People</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Budget */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">
                      Budget Range
                    </label>
                    <Select
                      value={formData.budget}
                      onValueChange={(value) =>
                        setFormData({ ...formData, budget: value })
                      }
                    >
                      <SelectTrigger className="w-full border-gray-300 focus:border-teal-500 focus:ring-teal-500 h-10 text-sm">
                        <SelectValue placeholder="Select budget range" />
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

                  {/* Special Requirements */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">
                      Special Requirements
                    </label>
                    <Textarea
                      rows={3}
                      placeholder="Any special requirements or preferences..."
                      value={formData.specialRequirements}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specialRequirements: e.target.value,
                        })
                      }
                      className="w-full border-gray-300 focus:border-teal-500 focus:ring-teal-500 resize-none text-sm"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  size="lg"
                  className="w-full bg-linear-to-r from-teal-500 to-yellow-500 hover:from-teal-600 hover:to-yellow-600 text-white rounded-full py-3 text-base font-semibold transition-all duration-300 hover:shadow-lg disabled:opacity-50 h-12"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Get Free Consultation
                      <Send className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ConsultationPopup;
