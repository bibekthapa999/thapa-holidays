"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Star,
  Clock,
  Users,
  Grid,
  List,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
import { toast } from "sonner";

interface Package {
  id: string;
  name: string;
  slug: string;
  destinationName: string;
  image: string | null;
  price: number;
  originalPrice: number | null;
  duration: string;
  groupSize: string;
  rating: number;
  type: string;
  badge: string | null;
  featured: boolean;
  status: string;
}

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

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await fetch("/api/packages");
      if (res.ok) {
        const data = await res.json();
        setPackages(data);
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
      toast.error("Failed to fetch packages");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(`/api/packages/${deleteId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setPackages(packages.filter((p) => p.id !== deleteId));
        toast.success("Package deleted successfully");
      } else {
        toast.error("Failed to delete package");
      }
    } catch (error) {
      toast.error("Failed to delete package");
    } finally {
      setDeleteId(null);
    }
  };

  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch =
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.destinationName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || pkg.status === statusFilter;
    const matchesType = typeFilter === "all" || pkg.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case "BUDGET":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "PREMIUM":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "LUXURY":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

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

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setTypeFilter("all");
  };

  const activeFilters = [
    searchTerm && "Search",
    statusFilter !== "all" && "Status",
    typeFilter !== "all" && "Type",
  ].filter(Boolean).length;

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
              <h1 className="text-3xl font-bold bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                Packages
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your travel packages and tours
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-9"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-9"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              <Link href="/admin/packages/new">
                <Button className="h-9 bg-linear-to-r from-yellow-500 to-teal-500 hover:from-yellow-600 hover:to-teal-600 shadow-lg hover:shadow-xl transition-all">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Package
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Filters Card - Modern Design */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-xl bg-linear-to-br from-white via-white to-gray-50 overflow-hidden">
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-6">
                {/* Main Filters Row */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search packages or destinations..."
                      className="pl-11 h-11 bg-white/50 backdrop-blur-sm border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="w-full sm:w-[180px] h-11 bg-white/50 backdrop-blur-sm border-gray-200">
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="w-full sm:w-[180px] h-11 bg-white/50 backdrop-blur-sm border-gray-200">
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="BUDGET">Budget</SelectItem>
                        <SelectItem value="PREMIUM">Premium</SelectItem>
                        <SelectItem value="LUXURY">Luxury</SelectItem>
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

                {/* Mobile Filter Toggle & Active Filters */}
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
                        {typeFilter !== "all" && (
                          <Badge
                            variant="secondary"
                            className="bg-purple-50 text-purple-700 border-purple-200"
                          >
                            Type: {typeFilter}
                            <button
                              onClick={() => setTypeFilter("all")}
                              className="ml-2 hover:text-purple-900"
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

                {/* Mobile View Toggle */}
                <div className="sm:hidden flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <Button
                      variant={viewMode === "grid" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear
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
                {filteredPackages.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">
                {packages.length}
              </span>{" "}
              packages
            </p>
            <div className="flex items-center gap-2">
              {activeFilters > 0 && (
                <Badge
                  variant="outline"
                  className="bg-amber-50 text-amber-700 border-amber-200"
                >
                  {activeFilters} active filter{activeFilters > 1 ? "s" : ""}
                </Badge>
              )}
            </div>
          </div>
        </motion.div>

        {/* Packages Grid/List */}
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
          ) : filteredPackages.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card className="border-0 shadow-xl bg-linear-to-br from-white via-white to-gray-50">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-700 font-medium mb-2">
                    No packages found
                  </p>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    {searchTerm ||
                    statusFilter !== "all" ||
                    typeFilter !== "all"
                      ? "Try adjusting your filters or search term"
                      : "Get started by creating your first package"}
                  </p>
                  <Link href="/admin/packages/new">
                    <Button className="bg-linear-to-r from-yellow-500 to-teal-500 hover:from-yellow-600 hover:to-teal-600 shadow-lg hover:shadow-xl">
                      <Plus className="h-4 w-4 mr-2" />
                      Create your first package
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ) : viewMode === "grid" ? (
            <motion.div
              key="grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredPackages.map((pkg, index) => (
                <motion.div
                  key={pkg.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group bg-white">
                    <div className="relative h-48 overflow-hidden">
                      <motion.img
                        src={
                          pkg.image ||
                          "https://images.pexels.com/photos/3935702/pexels-photo-3935702.jpeg?auto=compress&cs=tinysrgb&w=400"
                        }
                        alt={pkg.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        initial={{ scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent" />
                      <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                        <Badge
                          className={`${getTypeColor(pkg.type)} shadow-sm`}
                        >
                          {pkg.type}
                        </Badge>
                        {pkg.featured && (
                          <Badge className="bg-linear-to-r from-yellow-500 to-amber-500 text-white border-0 shadow-sm">
                            Featured
                          </Badge>
                        )}
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
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/packages/${pkg.slug}`}
                                target="_blank"
                                className="cursor-pointer"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Live
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/admin/packages/${pkg.id}`}
                                className="cursor-pointer"
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Package
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600 cursor-pointer"
                              onClick={() => setDeleteId(pkg.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-teal-600 transition-colors">
                          {pkg.name}
                        </h3>
                        <Badge
                          className={`${getStatusColor(pkg.status)} shadow-sm`}
                        >
                          {pkg.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mb-3 line-clamp-1">
                        {pkg.destinationName}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3 flex-wrap">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {pkg.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {pkg.groupSize}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          {pkg.rating.toFixed(1)}
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div>
                          <span className="text-xl font-bold text-gray-900">
                            ₹{pkg.price.toLocaleString()}
                          </span>
                          {pkg.originalPrice && (
                            <span className="text-sm text-gray-400 line-through ml-2">
                              ₹{pkg.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <Link href={`/admin/packages/${pkg.id}`}>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-gray-200 hover:border-teal-500 hover:text-teal-600"
                            >
                              Edit
                            </Button>
                          </motion.div>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {filteredPackages.map((pkg, index) => (
                <motion.div
                  key={pkg.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -2 }}
                >
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                    <div className="flex flex-col sm:flex-row">
                      <div className="relative w-full sm:w-48 h-48 sm:h-auto shrink-0">
                        <img
                          src={
                            pkg.image ||
                            "https://images.pexels.com/photos/3935702/pexels-photo-3935702.jpeg?auto=compress&cs=tinysrgb&w=400"
                          }
                          alt={pkg.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                          <Badge
                            className={`${getTypeColor(pkg.type)} shadow-sm`}
                          >
                            {pkg.type}
                          </Badge>
                          {pkg.featured && (
                            <Badge className="bg-linear-to-r from-yellow-500 to-amber-500 text-white border-0 shadow-sm">
                              Featured
                            </Badge>
                          )}
                        </div>
                      </div>
                      <CardContent className="flex-1 p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-teal-600 transition-colors">
                              {pkg.name}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {pkg.destinationName}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              className={`${getStatusColor(
                                pkg.status
                              )} shadow-sm`}
                            >
                              {pkg.status}
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link
                                    href={`/packages/${pkg.slug}`}
                                    target="_blank"
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    View
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/admin/packages/${pkg.id}`}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => setDeleteId(pkg.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {pkg.duration}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {pkg.groupSize}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            {pkg.rating.toFixed(1)}
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-gray-100">
                          <div>
                            <span className="text-xl font-bold text-gray-900">
                              ₹{pkg.price.toLocaleString()}
                            </span>
                            {pkg.originalPrice && (
                              <span className="text-sm text-gray-400 line-through ml-2">
                                ₹{pkg.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                          <Link href={`/admin/packages/${pkg.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-gray-200 hover:border-teal-500 hover:text-teal-600"
                            >
                              Edit Package
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Package</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this package? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}



