"use client";

import React, { useState } from "react";
import {
  X,
  Calendar,
  Users,
  MapPin,
  Phone,
  Mail,
  Star,
  Check,
  CreditCard,
  Shield,
  Award,
} from "lucide-react";

interface BookingModalProps {
  onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    destination: "",
    package: "",
    startDate: "",
    endDate: "",
    adults: 2,
    children: 0,
    name: "",
    email: "",
    phone: "",
    requirements: "",
  });

  const packages = [
    {
      id: "sikkim-6d",
      name: "Sikkim Explorer (6D/5N)",
      price: 24999,
      image:
        "https://images.pexels.com/photos/3935702/pexels-photo-3935702.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: "goa-5d",
      name: "Goa Beach Paradise (5D/4N)",
      price: 18999,
      image:
        "https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: "kerala-7d",
      name: "Kerala Backwaters (7D/6N)",
      price: 32999,
      image:
        "https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: "rajasthan-8d",
      name: "Royal Rajasthan (8D/7N)",
      price: 28999,
      image:
        "https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
  ];

  const selectedPackage = packages.find((pkg) => pkg.id === formData.package);
  const totalTravelers = formData.adults + formData.children;
  const basePrice = selectedPackage ? selectedPackage.price : 0;
  const totalPrice =
    basePrice * formData.adults + basePrice * 0.7 * formData.children;
  const taxes = totalPrice * 0.12;
  const finalPrice = totalPrice + taxes;

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      alert("⚠️ Please enter your name");
      return;
    }
    if (
      !formData.email.trim() ||
      !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(formData.email)
    ) {
      alert("⚠️ Please enter a valid email address");
      return;
    }
    if (
      !formData.phone.trim() ||
      !/[0-9]{10,}/.test(formData.phone.replace(/[^0-9]/g, ""))
    ) {
      alert("⚠️ Please enter a valid phone number");
      return;
    }

    try {
      const bookingData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        travel_date: `${formData.startDate} to ${formData.endDate}`,
        group_size: `${formData.adults} Adults, ${formData.children} Children`,
        message: formData.requirements.trim(),
        package_name: selectedPackage?.name || "Travel Package",
        source: "booking_modal",
        status: "new",
      };

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        alert(
          "🎉 Booking inquiry submitted successfully! Our team will contact you within 24 hours."
        );
        onClose();
      } else {
        throw new Error("Failed to submit booking");
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      alert(
        "❌ Sorry, there was an error submitting your booking. Please try again or call us directly."
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Book Your Trip
              </h2>
              <div className="flex items-center space-x-4 mt-2">
                {[1, 2, 3].map((stepNum) => (
                  <div
                    key={stepNum}
                    className={`flex items-center space-x-2 ${
                      stepNum <= step ? "text-teal-600" : "text-gray-400"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        stepNum <= step
                          ? "bg-teal-600 text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {stepNum}
                    </div>
                    <span className="text-sm font-medium">
                      {stepNum === 1 && "Select Package"}
                      {stepNum === 2 && "Travel Details"}
                      {stepNum === 3 && "Confirmation"}
                    </span>
                    {stepNum < 3 && <span className="text-gray-300">→</span>}
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Package Selection */}
            {step === 1 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Choose Your Package
                </h3>
                <div className="space-y-4">
                  {packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                        formData.package === pkg.id
                          ? "border-teal-500 bg-teal-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() =>
                        setFormData({ ...formData, package: pkg.id })
                      }
                    >
                      <div className="flex items-start space-x-4">
                        <img
                          src={pkg.image}
                          alt={pkg.name}
                          className="w-20 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900">
                            {pkg.name}
                          </h4>
                          <div className="flex items-center mt-2 space-x-4">
                            <span className="text-2xl font-bold text-teal-600">
                              ₹{pkg.price.toLocaleString()}
                            </span>
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-600">
                                4.8 (120+ reviews)
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {pkg.name.includes("6D")
                                  ? "6 Days"
                                  : pkg.name.includes("5D")
                                  ? "5 Days"
                                  : pkg.name.includes("7D")
                                  ? "7 Days"
                                  : "8 Days"}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="h-3 w-3" />
                              <span>2-6 People</span>
                            </div>
                          </div>
                        </div>
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            formData.package === pkg.id
                              ? "border-teal-500 bg-teal-500"
                              : "border-gray-300"
                          }`}
                        >
                          {formData.package === pkg.id && (
                            <Check className="h-4 w-4 text-white" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Travel Details */}
            {step === 2 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Travel Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date *
                    </label>
                    <input
                      type="date"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                      min={formData.startDate}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adults (12+ years)
                    </label>
                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      value={formData.adults}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          adults: parseInt(e.target.value),
                        })
                      }
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <option key={num} value={num}>
                          {num} Adult{num > 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Children (2-11 years)
                    </label>
                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      value={formData.children}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          children: parseInt(e.target.value),
                        })
                      }
                    >
                      {[0, 1, 2, 3, 4].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? "Child" : "Children"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Requirements
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Any special requirements, dietary preferences, or accessibility needs..."
                    value={formData.requirements}
                    onChange={(e) =>
                      setFormData({ ...formData, requirements: e.target.value })
                    }
                  />
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && selectedPackage && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Booking Confirmation
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Booking Summary */}
                  <div>
                    <div className="bg-gray-50 rounded-xl p-6 mb-6">
                      <h4 className="font-bold text-gray-900 mb-4">
                        Trip Summary
                      </h4>
                      <div className="flex items-start space-x-4 mb-4">
                        <img
                          src={selectedPackage.image}
                          alt={selectedPackage.name}
                          className="w-16 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <h5 className="font-bold text-gray-900">
                            {selectedPackage.name}
                          </h5>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                            <span>
                              {formData.startDate} to {formData.endDate}
                            </span>
                            <span>
                              {totalTravelers} Traveler
                              {totalTravelers > 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Adults ({formData.adults})</span>
                          <span>
                            ₹{(basePrice * formData.adults).toLocaleString()}
                          </span>
                        </div>
                        {formData.children > 0 && (
                          <div className="flex justify-between">
                            <span>Children ({formData.children})</span>
                            <span>
                              ₹
                              {(
                                basePrice *
                                0.7 *
                                formData.children
                              ).toLocaleString()}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>Taxes & Fees</span>
                          <span>₹{taxes.toLocaleString()}</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-bold text-lg">
                          <span>Total Amount</span>
                          <span className="text-teal-600">
                            ₹{finalPrice.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Contact Details */}
                    <div className="bg-blue-50 rounded-xl p-6">
                      <h4 className="font-bold text-gray-900 mb-3">
                        Contact Details
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">Name:</span>
                          <span>{formData.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">Email:</span>
                          <span>{formData.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">Phone:</span>
                          <span>{formData.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment & Guarantees */}
                  <div>
                    <div className="bg-green-50 rounded-xl p-6 mb-6">
                      <h4 className="font-bold text-gray-900 mb-4">
                        What's Included
                      </h4>
                      <div className="space-y-2">
                        {[
                          "Accommodation in premium hotels",
                          "All meals as per itinerary",
                          "Private AC transportation",
                          "Professional tour guide",
                          "All entry fees & permits",
                          "24/7 customer support",
                        ].map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2 text-sm"
                          >
                            <Check className="h-4 w-4 text-green-600" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Trust Badges */}
                      <div className="flex items-center justify-around bg-gray-50 rounded-xl p-4">
                        <div className="text-center">
                          <Shield className="h-8 w-8 text-teal-600 mx-auto mb-1" />
                          <span className="text-xs text-gray-600">
                            Secure Booking
                          </span>
                        </div>
                        <div className="text-center">
                          <Award className="h-8 w-8 text-teal-600 mx-auto mb-1" />
                          <span className="text-xs text-gray-600">
                            Best Price
                          </span>
                        </div>
                        <div className="text-center">
                          <Phone className="h-8 w-8 text-teal-600 mx-auto mb-1" />
                          <span className="text-xs text-gray-600">
                            24/7 Support
                          </span>
                        </div>
                      </div>

                      {/* Payment Note */}
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                        <div className="flex items-start space-x-3">
                          <CreditCard className="h-5 w-5 text-yellow-600 mt-0.5" />
                          <div>
                            <h5 className="font-medium text-yellow-800">
                              Payment Information
                            </h5>
                            <p className="text-sm text-yellow-700 mt-1">
                              No payment required now. Our travel consultant
                              will contact you within 24 hours to discuss
                              payment options and finalize your booking.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <button
                type="button"
                onClick={handlePrev}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  step === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                disabled={step === 1}
              >
                Previous
              </button>

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    step === 1 && !formData.package
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-yellow-500 to-teal-500 text-white hover:from-yellow-600 hover:to-teal-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  }`}
                  disabled={step === 1 && !formData.package}
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-teal-500 text-white rounded-lg font-semibold hover:from-yellow-600 hover:to-teal-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Confirm Booking
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
