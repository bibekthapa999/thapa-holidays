"use client";

import React from "react";
import {
  Heart,
  Sparkles,
  Users,
  Building2,
  Mountain,
  Landmark,
  Compass,
  Bike,
  GraduationCap,
  Camera,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  const services = [
    {
      icon: Users,
      title: "Family Holiday Packages",
      description: "Perfect getaways for families with kids and elders",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Heart,
      title: "Honeymoon Packages",
      description: "Romantic destinations for your special moments",
      color: "from-pink-500 to-pink-600",
    },
    {
      icon: Users,
      title: "Group Tours & Kitchen Groups",
      description: "Fun-filled adventures for friends and colleagues",
      color: "from-green-500 to-green-600",
    },
    {
      icon: Building2,
      title: "Corporate Tours & Incentive Trips",
      description: "Team-building experiences and incentive programs",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: GraduationCap,
      title: "Student Group Tours",
      description: "Educational and recreational trips for students",
      color: "from-indigo-500 to-indigo-600",
    },
    {
      icon: Landmark,
      title: "Leisure & Cultural Tours",
      description: "Immersive experiences of local traditions and heritage",
      color: "from-teal-500 to-teal-600",
    },
    {
      icon: Compass,
      title: "Adventure & Trekking Tours",
      description: "Thrilling expeditions across the Himalayas",
      color: "from-orange-500 to-orange-600",
    },
    {
      icon: Bike,
      title: "Biker's Expeditions",
      description: "Motorcycle adventures across scenic routes",
      color: "from-red-500 to-red-600",
    },
  ];

  return (
    <div className="min-h-screen pt-24 lg:pt-32 pb-20 bg-gradient-to-b from-white via-gray-50/50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500/10 to-yellow-500/10 border border-teal-200/50 rounded-full text-sm font-medium mb-6 mt-8 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-teal-600" />
            <span className="bg-gradient-to-r from-teal-600 to-yellow-600 bg-clip-text text-transparent font-semibold">
              About Thapa Holidays
            </span>
            <Heart className="h-4 w-4 text-yellow-600" />
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 px-4 sm:px-0">
            About{" "}
            <span className="bg-gradient-to-r from-teal-600 to-yellow-600 bg-clip-text text-transparent">
              Thapa Holidays
            </span>
          </h1>
        </div>

        <div className="space-y-16">
          {/* Main Content */}
          <div>
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
              <CardContent className="p-4 lg:p-8">
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                  <p className="text-xl mb-6">
                    Established in 2022, Thapa Holidays is one of the
                    fastest-growing travel companies in Northeast of India,
                    dedicated to offering customized holiday packages across
                    Sikkim, Darjeeling, North East India, Kashmir, Kerala,
                    Himachal Pradesh, and international destinations such as
                    Nepal, Bhutan, Thailand, Cambodia, Bali and Vietnam. Based
                    in the foot of Darjeeling Hills situated in Vastu Vihar,
                    Panchkulgari, Darjeeling, we specialize in crafting
                    memorable journeys for families, honeymoon couples, friends,
                    and corporate travellers.
                  </p>

                  <p className="mb-6">
                    At Thapa Holidays, we believe that travel is more than just
                    visiting places — it's about creating experiences that stay
                    with you forever. Our team of travel experts, with over
                    10–15 years of experience, ensures every trip is perfectly
                    planned, well-organized, and full of unforgettable moments.
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-6">
                    Our Expertise & Services
                  </h2>
                  <p className="mb-8 text-lg">
                    We specialize in B2C and B2B holiday packages, offering
                    tailor-made itineraries for every type of traveler:
                  </p>

                  {/* Services Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {services.map((service, index) => (
                      <Card
                        key={index}
                        className="border-0 shadow-md bg-white hover:shadow-lg transition-all duration-300 group hover:-translate-y-1"
                      >
                        <CardContent className="p-4 text-center">
                          <div
                            className={`w-12 h-12 bg-gradient-to-r ${service.color} rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}
                          >
                            <service.icon className="h-6 w-6 text-white" />
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-2 text-sm leading-tight">
                            {service.title}
                          </h3>
                          <p className="text-gray-600 text-xs leading-relaxed">
                            {service.description}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <p className="mb-6 text-base">
                    Whether you're planning a Nepal Tour Package, a Sikkim
                    Darjeeling Holiday, a Bhutan Tour Package, or exploring the
                    North East, we take care of every detail — from comfortable
                    accommodations to guided sightseeing and 24/7 support.
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-6">
                    Popular Holiday Destinations
                  </h2>
                  <p className="mb-8 text-lg">
                    Looking for inspiration? Explore our best-selling India and
                    International tour packages:
                  </p>

                  {/* Destinations Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {[
                      {
                        name: "Nepal",
                        locations: "Kathmandu, Pokhara, Chitwan",
                        highlight: "Himalayan Beauty",
                      },
                      {
                        name: "Sikkim Darjeeling",
                        locations: "Gangtok, Pelling, Tiger Hill",
                        highlight: "Tea Gardens & Monasteries",
                      },
                      {
                        name: "Bhutan",
                        locations: "Thimphu, Paro, Punakha",
                        highlight: "Last Shangri-La",
                      },
                      {
                        name: "North East India",
                        locations: "Arunachal, Meghalaya, Kaziranga",
                        highlight: "Tribal Culture & Wildlife",
                      },
                      {
                        name: "Himachal Pradesh",
                        locations: "Shimla, Manali, Dharamshala",
                        highlight: "Snow-Capped Peaks",
                      },
                      {
                        name: "Kashmir",
                        locations: "Srinagar, Gulmarg, Pahalgam",
                        highlight: "Paradise on Earth",
                      },
                      {
                        name: "Kerala",
                        locations: "Backwaters, Alleppey, Munnar",
                        highlight: "God's Own Country",
                      },
                      {
                        name: "Bali",
                        locations: "Beaches, Ubud, Temples",
                        highlight: "Tropical Paradise",
                      },
                      {
                        name: "Vietnam",
                        locations: "Hanoi, Halong Bay, Ho Chi Minh",
                        highlight: "Ancient & Modern",
                      },
                      {
                        name: "Chardham",
                        locations: "Yamunotri, Gangotri, Kedarnath, Badrinath",
                        highlight: "Sacred Pilgrimage",
                      },
                    ].map((destination, index) => (
                      <div
                        key={index}
                        className="group relative bg-gradient-to-br from-white to-gray-50/50 border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-teal-200 transition-all duration-300 hover:-translate-y-1"
                      >
                        <div className="absolute top-3 right-3 w-2 h-2 bg-gradient-to-r from-teal-500 to-yellow-500 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"></div>
                        <h3 className="font-bold text-gray-900 mb-1 text-sm">
                          {destination.name}
                        </h3>
                        <p className="text-xs text-gray-600 mb-2 leading-tight">
                          {destination.locations}
                        </p>
                        <div className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-teal-500/10 to-yellow-500/10 rounded-full">
                          <span className="text-xs font-medium bg-gradient-to-r from-teal-600 to-yellow-600 bg-clip-text text-transparent">
                            {destination.highlight}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gradient-to-r from-teal-500/5 to-yellow-500/5 rounded-2xl p-6 border border-teal-100">
                    <p className="text-center text-gray-700 font-medium">
                      ✨ Each of these destinations is handpicked and
                      personalized to match your travel style, preferences, and
                      budget.
                    </p>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                    Why Choose Thapa Holidays?
                  </h2>
                  <ul className="list-disc list-inside mb-6 space-y-2">
                    <li>
                      <strong>Experienced Travel Experts</strong> – Our team has
                      10–15 years of on-ground experience in curating domestic
                      and international holidays.
                    </li>
                    <li>
                      <strong>Customized Itineraries</strong> – We design
                      personalized packages based on your travel interests,
                      budget, and duration.
                    </li>
                    <li>
                      <strong>Affordable Tour Packages</strong> – Get the best
                      deals on Nepal, Bhutan, and India tours with no hidden
                      costs.
                    </li>
                    <li>
                      <strong>24/7 Customer Assistance</strong> – Enjoy peace of
                      mind with our round-the-clock travel support.
                    </li>
                    <li>
                      <strong>Trusted by Travelers & Agents</strong> – We serve
                      B2C customers directly and partner with reputed travel
                      agents and corporate clients.
                    </li>
                    <li>
                      <strong>Quality & Safety First</strong> – From verified
                      hotels to licensed guides and hygienic food, we ensure
                      safety and comfort at every step.
                    </li>
                    <li>
                      <strong>Transparent Pricing</strong> – You get what you
                      pay for — no surprises, just great value.
                    </li>
                  </ul>

                  <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                    Our Mission
                  </h2>
                  <p className="mb-6">
                    Our mission is to connect travellers with the most
                    authentic, affordable, and exciting travel experiences
                    across India and International. We aim to make travel
                    simpler, safer, and more rewarding through our expertise,
                    service quality, and passion for exploration.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
