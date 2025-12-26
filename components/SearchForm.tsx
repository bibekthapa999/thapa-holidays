"use client";

import React, { useState } from "react";
import { Search, MapPin, Calendar, Users, Filter } from "lucide-react";
import { useRouter } from "next/navigation";

interface SearchFormProps {
  onBookNow?: () => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ onBookNow }) => {
  const router = useRouter();
  const [searchData, setSearchData] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    travelers: "2",
    budget: "any",
  });

  const destinations = [
    "Sikkim",
    "Darjeeling",
    "Goa",
    "Kerala",
    "Rajasthan",
    "Himachal Pradesh",
    "Uttarakhand",
    "Assam",
    "Meghalaya",
    "Arunachal Pradesh",
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // If no destination selected, show all packages
    if (!searchData.destination) {
      router.push("/packages");
      return;
    }

    // Navigate to packages with search parameters
    const searchParams = new URLSearchParams();
    if (searchData.destination)
      searchParams.set("destination", searchData.destination);
    if (searchData.startDate)
      searchParams.set("startDate", searchData.startDate);
    if (searchData.endDate) searchParams.set("endDate", searchData.endDate);
    if (searchData.travelers)
      searchParams.set("travelers", searchData.travelers);
    if (searchData.budget) searchParams.set("budget", searchData.budget);

    router.push(`/packages?${searchParams.toString()}`);
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl max-w-4xl mx-auto">
      <form onSubmit={handleSearch} className="space-y-4 md:space-y-0">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Destination */}
          <div className="md:col-span-2 relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Where to?
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                value={searchData.destination}
                onChange={(e) =>
                  setSearchData({ ...searchData, destination: e.target.value })
                }
              >
                <option value="">Choose Destination</option>
                {destinations.map((dest) => (
                  <option key={dest} value={dest}>
                    {dest}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Check-in */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="date"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                value={searchData.startDate}
                onChange={(e) =>
                  setSearchData({ ...searchData, startDate: e.target.value })
                }
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          {/* Check-out */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="date"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                value={searchData.endDate}
                onChange={(e) =>
                  setSearchData({ ...searchData, endDate: e.target.value })
                }
                min={
                  searchData.startDate || new Date().toISOString().split("T")[0]
                }
              />
            </div>
          </div>

          {/* Travelers */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Travelers
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                value={searchData.travelers}
                onChange={(e) =>
                  setSearchData({ ...searchData, travelers: e.target.value })
                }
              >
                <option value="1">1 Person</option>
                <option value="2">2 People</option>
                <option value="3">3 People</option>
                <option value="4">4 People</option>
                <option value="5">5+ People</option>
              </select>
            </div>
          </div>
        </div>

        {/* Budget Filter */}
        <div className="flex flex-wrap items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Budget:</span>
            <div className="flex space-x-2">
              {[
                { value: "budget", label: "Budget" },
                { value: "mid", label: "Mid-range" },
                { value: "luxury", label: "Luxury" },
                { value: "any", label: "Any" },
              ].map((option) => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    name="budget"
                    value={option.value}
                    checked={searchData.budget === option.value}
                    onChange={(e) =>
                      setSearchData({ ...searchData, budget: e.target.value })
                    }
                    className="sr-only"
                  />
                  <span
                    className={`px-3 py-1 rounded-full text-sm cursor-pointer transition-colors ${
                      searchData.budget === option.value
                        ? "bg-yellow-100 text-yellow-700 border-2 border-yellow-300"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-yellow-500 to-teal-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-yellow-600 hover:to-teal-600 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Search className="h-5 w-5" />
            <span>Search Tours</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;
