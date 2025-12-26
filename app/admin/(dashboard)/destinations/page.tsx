"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  MapPin,
  Eye,
  Package,
  Globe,
  Mountain,
  Calendar,
  Filter,
  X,
  Sparkles,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Destination {
  id: string;
  name: string;
  slug: string;
  location: string;
  country: string;
  region: string;
  image: string | null;
  description: string;
  category: string;
  bestTime: string | null;
  status: string;
  rating: number;
  _count?: { packages: number };
  createdAt: string;
}

const categories = [
  "MOUNTAIN",
  "BEACH",
  "CULTURAL",
  "ADVENTURE",
  "CITY",
  "WILDLIFE",
  "PILGRIMAGE",
];

const regions = ["INDIA", "WORLD"];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  hover: {
    y: -4,
    boxShadow: "0 12px 32px -8px rgba(0, 0, 0, 0.15)",
  },
};

const categoryIcons: Record<string, any> = {
  MOUNTAIN: Mountain,
  BEACH: Eye,
  CULTURAL: Globe,
  ADVENTURE: Package,
  CITY: MapPin,
  WILDLIFE: Eye,
  PILGRIMAGE: Globe,
};

export default function AdminDestinationsPage() {
  const router = useRouter();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const res = await fetch("/api/destinations");
      if (res.ok) {
        const data = await res.json();
        setDestinations(data);
      }
    } catch (error) {
      console.error("Error fetching destinations:", error);
      toast.error("Failed to fetch destinations");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(`/api/destinations/${deleteId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setDestinations(destinations.filter((d) => d.id !== deleteId));
        toast.success("Destination deleted successfully!");
      } else {
        throw new Error("Failed to delete");
      }
    } catch (error) {
      toast.error("Failed to delete destination");
    } finally {
      setDeleteId(null);
    }
  };

  const filteredDestinations = destinations.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || d.status === statusFilter;
    const matchesRegion = regionFilter === "all" || d.region === regionFilter;
    const matchesCategory =
      categoryFilter === "all" || d.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesRegion && matchesCategory;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setRegionFilter("all");
    setCategoryFilter("all");
  };

  const activeFilters = [
    searchTerm && "Search",
    statusFilter !== "all" && "Status",
    regionFilter !== "all" && "Region",
    categoryFilter !== "all" && "Category",
  ].filter(Boolean).length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "INACTIVE":
        return "bg-rose-100 text-rose-700 border-rose-200";
      case "DRAFT":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "MOUNTAIN":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "BEACH":
        return "bg-cyan-100 text-cyan-700 border-cyan-200";
      case "CULTURAL":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "ADVENTURE":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "CITY":
        return "bg-pink-100 text-pink-700 border-pink-200";
      case "WILDLIFE":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "PILGRIMAGE":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getRegionIcon = (region: string) => {
    return region === "INDIA" ? "🇮🇳" : "🌍";
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 p-4 sm:p-6 lg:p-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{
                    rotate: [0, 14, -8, 14, -4, 10, 0],
                  }}
                  transition={{
                    duration: 2.5,
                    ease: "easeInOut",
                    times: [0, 0.2, 0.4, 0.6, 0.8, 0.9, 1],
                  }}
                >
                  <Sparkles className="h-8 w-8 text-yellow-500" />
                </motion.div>
                <h1 className="text-3xl font-bold bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                  Destinations
                </h1>
              </div>
              <p className="text-gray-600 mt-1">
                Manage travel destinations and locations
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/admin/destinations/new">
                <Button className="h-9 bg-linear-to-r from-teal-500 to-yellow-500 hover:from-teal-600 hover:to-yellow-600 shadow-lg hover:shadow-xl transition-all">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Destination
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Filters Card */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-xl bg-linear-to-br from-white via-white to-gray-50 overflow-hidden">
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-6">
                {/* Main Filters Row */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search destinations or locations..."
                      className="pl-11 h-11 bg-white/50 backdrop-blur-sm border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 sm:flex sm:flex-nowrap gap-3">
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="h-11 bg-white/50 backdrop-blur-sm border-gray-200">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={regionFilter}
                      onValueChange={setRegionFilter}
                    >
                      <SelectTrigger className="h-11 bg-white/50 backdrop-blur-sm border-gray-200">
                        <SelectValue placeholder="Region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Regions</SelectItem>
                        <SelectItem value="INDIA">India</SelectItem>
                        <SelectItem value="WORLD">World</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={categoryFilter}
                      onValueChange={setCategoryFilter}
                    >
                      <SelectTrigger className="h-11 bg-white/50 backdrop-blur-sm border-gray-200">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="hidden sm:flex h-11 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
                  </div>
                </div>

                {/* Active Filters */}
                <AnimatePresence>
                  {activeFilters > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pt-4 border-t border-gray-100"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium text-gray-500">
                          Active filters:
                        </span>
                        {searchTerm && (
                          <Badge
                            variant="secondary"
                            className="bg-blue-50 text-blue-700 border-blue-200"
                          >
                            Search: {searchTerm}
                            <button
                              onClick={() => setSearchTerm("")}
                              className="ml-2 hover:text-blue-900"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        )}
                        {statusFilter !== "all" && (
                          <Badge
                            variant="secondary"
                            className="bg-emerald-50 text-emerald-700 border-emerald-200"
                          >
                            Status: {statusFilter}
                            <button
                              onClick={() => setStatusFilter("all")}
                              className="ml-2 hover:text-emerald-900"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        )}
                        {regionFilter !== "all" && (
                          <Badge
                            variant="secondary"
                            className="bg-purple-50 text-purple-700 border-purple-200"
                          >
                            Region: {regionFilter}
                            <button
                              onClick={() => setRegionFilter("all")}
                              className="ml-2 hover:text-purple-900"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        )}
                        {categoryFilter !== "all" && (
                          <Badge
                            variant="secondary"
                            className="bg-orange-50 text-orange-700 border-orange-200"
                          >
                            Category: {categoryFilter}
                            <button
                              onClick={() => setCategoryFilter("all")}
                              className="ml-2 hover:text-orange-900"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearFilters}
                          className="ml-auto text-sm text-gray-500 hover:text-gray-700"
                        >
                          Clear all
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Mobile Clear Button */}
                <div className="sm:hidden flex items-center justify-between pt-4 border-t border-gray-100">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Count */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {filteredDestinations.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">
                {destinations.length}
              </span>{" "}
              destinations
            </p>
            {activeFilters > 0 && (
              <Badge
                variant="outline"
                className="bg-amber-50 text-amber-700 border-amber-200"
              >
                {activeFilters} active filter{activeFilters > 1 ? "s" : ""}
              </Badge>
            )}
          </div>
        </motion.div>

        {/* Destinations Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {[...Array(6)].map((_, i) => (
                <Card
                  key={i}
                  className="border-0 shadow-lg animate-pulse overflow-hidden"
                >
                  <div className="h-48 bg-linear-to-br from-gray-200 to-gray-300 rounded-t-xl" />
                  <CardContent className="p-4 space-y-3">
                    <div className="h-5 bg-linear-to-r from-gray-200 to-gray-300 rounded w-3/4" />
                    <div className="h-4 bg-linear-to-r from-gray-200 to-gray-300 rounded w-1/2" />
                    <div className="h-4 bg-linear-to-r from-gray-200 to-gray-300 rounded w-1/3" />
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          ) : filteredDestinations.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card className="border-0 shadow-xl bg-linear-to-br from-white via-white to-gray-50">
                <CardContent className="p-12 text-center">
                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="w-16 h-16 mx-auto mb-4 rounded-full bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center"
                  >
                    <MapPin className="h-8 w-8 text-gray-400" />
                  </motion.div>
                  <p className="text-gray-700 font-medium mb-2">
                    No destinations found
                  </p>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    {searchTerm ||
                    statusFilter !== "all" ||
                    regionFilter !== "all" ||
                    categoryFilter !== "all"
                      ? "Try adjusting your filters or search term"
                      : "Get started by creating your first destination"}
                  </p>
                  <Button
                    onClick={() => router.push("/admin/destinations/new")}
                    className="bg-linear-to-r from-teal-500 to-yellow-500 hover:from-teal-600 hover:to-yellow-600 shadow-lg hover:shadow-xl"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create your first destination
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredDestinations.map((destination, index) => {
                const CategoryIcon =
                  categoryIcons[destination.category] || MapPin;
                return (
                  <motion.div
                    key={destination.id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group bg-white">
                      <div className="relative h-48 overflow-hidden">
                        {destination.image ? (
                          <motion.img
                            src={destination.image}
                            alt={destination.name}
                            className="w-full h-full object-cover"
                            initial={{ scale: 1 }}
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.5 }}
                          />
                        ) : (
                          <motion.div
                            className="w-full h-full bg-linear-to-br from-gray-200 to-gray-300 flex items-center justify-center"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                          >
                            <CategoryIcon className="h-12 w-12 text-gray-400" />
                          </motion.div>
                        )}
                        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
                        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                          <Badge
                            className={`${getCategoryColor(
                              destination.category
                            )} shadow-sm`}
                          >
                            <CategoryIcon className="h-3 w-3 mr-1" />
                            {destination.category}
                          </Badge>
                          <Badge
                            className={`${getStatusColor(
                              destination.status
                            )} shadow-sm`}
                          >
                            {destination.status}
                          </Badge>
                        </div>
                        <div className="absolute top-3 right-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Button
                                  variant="secondary"
                                  size="icon"
                                  className="h-8 w-8 bg-white/90 backdrop-blur-sm border-white/20 shadow-lg"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </motion.div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem
                                onClick={() =>
                                  router.push(
                                    `/admin/destinations/${destination.id}`
                                  )
                                }
                                className="cursor-pointer"
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Destination
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-600 cursor-pointer"
                                onClick={() => setDeleteId(destination.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="absolute bottom-3 left-3 right-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className="bg-white/90 backdrop-blur-sm text-gray-700"
                              >
                                {getRegionIcon(destination.region)}{" "}
                                {destination.region}
                              </Badge>
                            </div>
                            <Badge
                              variant="outline"
                              className="bg-white/90 backdrop-blur-sm text-gray-700"
                            >
                              <Package className="h-3 w-3 mr-1" />
                              {destination._count?.packages || 0} packages
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-1 group-hover:text-teal-600 transition-colors">
                          {destination.name}
                        </h3>
                        <div className="flex items-center text-gray-500 text-sm mb-2">
                          <MapPin className="h-4 w-4 mr-1 shrink-0" />
                          <span className="line-clamp-1">
                            {destination.location}, {destination.country}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3 min-h-10">
                          {destination.description}
                        </p>
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          {destination.bestTime ? (
                            <div className="flex items-center text-xs text-gray-500">
                              <Calendar className="h-3 w-3 mr-1" />
                              Best: {destination.bestTime}
                            </div>
                          ) : (
                            <div />
                          )}
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                            <span className="text-xs text-gray-600">
                              {destination.rating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-gray-900">
              Delete Destination
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Are you sure you want to delete this destination? This will also
              affect any packages linked to this destination. This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-200 hover:border-gray-300">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-linear-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700"
            >
              Delete Destination
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
