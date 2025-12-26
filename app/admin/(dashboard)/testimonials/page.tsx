"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Star,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  TrendingUp,
  User,
  Filter,
  ThumbsUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface Testimonial {
  id: string;
  name: string;
  email?: string;
  location: string;
  rating: number;
  comment: string;
  image: string | null;
  packageId?: string;
  tripDate?: string;
  featured: boolean;
  status: string;
  createdAt: string;
}

const emptyTestimonial = {
  name: "",
  email: "",
  location: "",
  rating: 5,
  comment: "",
  image: "",
  packageId: "",
  tripDate: "",
  featured: false,
  status: "APPROVED",
};

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

const statusColors: Record<
  string,
  { bg: string; text: string; border: string; icon: any }
> = {
  PENDING: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    icon: Clock,
  },
  APPROVED: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    icon: CheckCircle,
  },
  REJECTED: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
    icon: XCircle,
  },
};

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] =
    useState<Testimonial | null>(null);
  const [formData, setFormData] = useState(emptyTestimonial);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch("/api/testimonials?includeAll=true");
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data.testimonials || []);
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      toast.error("Failed to fetch testimonials");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.comment) {
      toast.error("Name and comment are required");
      return;
    }

    setSaving(true);
    try {
      const url = editingTestimonial
        ? `/api/testimonials/${editingTestimonial.id}`
        : "/api/testimonials";
      const method = editingTestimonial ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, isAdmin: true }),
      });

      if (res.ok) {
        toast.success(
          editingTestimonial
            ? "Testimonial updated successfully!"
            : "Testimonial created successfully!"
        );
        setIsDialogOpen(false);
        setEditingTestimonial(null);
        setFormData(emptyTestimonial);
        fetchTestimonials();
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      toast.error("Failed to save testimonial");
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setTestimonials(
          testimonials.map((t) =>
            t.id === id ? { ...t, status: newStatus } : t
          )
        );
        toast.success(`Testimonial ${newStatus.toLowerCase()}!`);
      } else {
        throw new Error("Failed to update");
      }
    } catch (error) {
      toast.error("Failed to update testimonial status");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(`/api/testimonials/${deleteId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setTestimonials(testimonials.filter((t) => t.id !== deleteId));
        toast.success("Testimonial deleted successfully!");
      } else {
        throw new Error("Failed to delete");
      }
    } catch (error) {
      toast.error("Failed to delete testimonial");
    } finally {
      setDeleteId(null);
    }
  };

  const openEditDialog = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      email: testimonial.email || "",
      location: testimonial.location,
      rating: testimonial.rating,
      comment: testimonial.comment,
      image: testimonial.image || "",
      packageId: testimonial.packageId || "",
      tripDate: testimonial.tripDate || "",
      featured: testimonial.featured,
      status: testimonial.status,
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingTestimonial(null);
    setFormData(emptyTestimonial);
    setIsDialogOpen(true);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };

  const filteredTestimonials = testimonials.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = testimonials.filter(
    (t) => t.status === "PENDING"
  ).length;
  const approvedCount = testimonials.filter(
    (t) => t.status === "APPROVED"
  ).length;
  const rejectedCount = testimonials.filter(
    (t) => t.status === "REJECTED"
  ).length;
  const featuredCount = testimonials.filter((t) => t.featured).length;

  const activeFilters = [
    searchTerm && "Search",
    statusFilter !== "all" && "Status",
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
                  Testimonials
                </h1>
              </div>
              <p className="text-gray-600 mt-1">
                Manage customer testimonials and reviews
              </p>
            </div>
            {/* <Button
              onClick={openCreateDialog}
              className="h-9 bg-linear-to-r from-teal-500 to-yellow-500 hover:from-teal-600 hover:to-yellow-600 shadow-lg hover:shadow-xl"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Testimonial
            </Button> */}
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {[
            {
              title: "Total Testimonials",
              value: testimonials.length,
              icon: User,
              change: "+12",
              gradient: "from-blue-500 via-blue-600 to-indigo-600",
              bgGradient: "from-blue-50 to-indigo-50",
            },
            {
              title: "Pending Review",
              value: pendingCount,
              icon: Clock,
              change: pendingCount > 0 ? "Needs attention" : "All clear",
              gradient: "from-amber-500 via-orange-600 to-yellow-600",
              bgGradient: "from-amber-50 to-orange-50",
            },
            {
              title: "Approved",
              value: approvedCount,
              icon: CheckCircle,
              change: "+8",
              gradient: "from-emerald-500 via-green-600 to-teal-600",
              bgGradient: "from-emerald-50 to-teal-50",
            },
            {
              title: "Featured",
              value: featuredCount,
              icon: Star,
              change: "+3",
              gradient: "from-purple-500 via-violet-600 to-purple-700",
              bgGradient: "from-purple-50 to-violet-50",
            },
          ].map((stat, index) => (
            <motion.div key={stat.title} variants={itemVariants}>
              <Card className="group relative overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer">
                <div
                  className={`absolute inset-0 bg-linear-to-br ${stat.bgGradient} opacity-50 group-hover:opacity-100 transition-opacity duration-500`}
                />
                <CardContent className="relative p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-600">
                        {stat.title}
                      </p>
                      <motion.p
                        className="text-4xl font-bold text-slate-900"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                      >
                        {loading ? (
                          <span className="inline-block animate-pulse">--</span>
                        ) : (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                          >
                            {stat.value}
                          </motion.span>
                        )}
                      </motion.p>
                    </div>
                    <motion.div
                      className={`p-3 rounded-2xl bg-linear-to-br ${stat.gradient} shadow-lg group-hover:scale-110 transition-transform duration-500`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <stat.icon className="h-6 w-6 text-white" />
                    </motion.div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                        stat.title === "Pending Review" && pendingCount > 0
                          ? "bg-amber-100"
                          : "bg-emerald-100"
                      }`}
                    >
                      <TrendingUp className="h-3 w-3 text-emerald-600" />
                      <span
                        className={`text-sm font-semibold ${
                          stat.title === "Pending Review" && pendingCount > 0
                            ? "text-amber-700"
                            : "text-emerald-700"
                        }`}
                      >
                        {stat.change}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500">this month</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
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
                      placeholder="Search testimonials by name, location, or comment..."
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
                      <SelectTrigger className="h-11 w-full sm:w-50 bg-white/50 backdrop-blur-sm border-gray-200">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="APPROVED">Approved</SelectItem>
                        <SelectItem value="REJECTED">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="hidden sm:flex h-11 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
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
                            Search:{" "}
                            {searchTerm.length > 20
                              ? `${searchTerm.substring(0, 20)}...`
                              : searchTerm}
                            <button
                              onClick={() => setSearchTerm("")}
                              className="ml-2 hover:text-blue-900"
                            >
                              <XCircle className="h-3 w-3" />
                            </button>
                          </Badge>
                        )}
                        {statusFilter !== "all" && (
                          <Badge
                            variant="secondary"
                            className={`
                              ${statusColors[statusFilter]?.bg}
                              ${statusColors[statusFilter]?.text}
                              ${statusColors[statusFilter]?.border}
                            `}
                          >
                            Status: {statusFilter}
                            <button
                              onClick={() => setStatusFilter("all")}
                              className="ml-2"
                            >
                              <XCircle className="h-3 w-3" />
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

                {/* Quick Status Filter Buttons */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                  <Button
                    variant={statusFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("all")}
                    className="h-9"
                  >
                    All ({testimonials.length})
                  </Button>
                  <Button
                    variant={statusFilter === "PENDING" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("PENDING")}
                    className={`h-9 ${
                      statusFilter !== "PENDING" && pendingCount > 0
                        ? "border-amber-400 text-amber-600"
                        : ""
                    }`}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Pending ({pendingCount})
                    {pendingCount > 0 && statusFilter !== "PENDING" && (
                      <span className="ml-2 w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                    )}
                  </Button>
                  <Button
                    variant={
                      statusFilter === "APPROVED" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setStatusFilter("APPROVED")}
                    className="h-9"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approved ({approvedCount})
                  </Button>
                  <Button
                    variant={
                      statusFilter === "REJECTED" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setStatusFilter("REJECTED")}
                    className="h-9"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Rejected ({rejectedCount})
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
                {filteredTestimonials.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">
                {testimonials.length}
              </span>{" "}
              testimonials
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

        {/* Testimonials Grid */}
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
                  <div className="h-64 bg-linear-to-br from-gray-200 to-gray-300" />
                </Card>
              ))}
            </motion.div>
          ) : filteredTestimonials.length === 0 ? (
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
                    <ThumbsUp className="h-8 w-8 text-gray-400" />
                  </motion.div>
                  <p className="text-gray-700 font-medium mb-2">
                    No testimonials found
                  </p>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    {searchTerm || statusFilter !== "all"
                      ? "Try adjusting your filters or search term"
                      : "Customer testimonials will appear here"}
                  </p>
                  <Button
                    onClick={openCreateDialog}
                    className="bg-linear-to-r from-teal-500 to-yellow-500 hover:from-teal-600 hover:to-yellow-600 shadow-lg hover:shadow-xl"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Testimonial
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredTestimonials.map((testimonial, index) => {
                const StatusIcon =
                  statusColors[testimonial.status]?.icon || Clock;
                return (
                  <motion.div
                    key={testimonial.id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card
                      className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group bg-white ${
                        testimonial.status === "PENDING"
                          ? "border-l-4 border-l-amber-500"
                          : ""
                      }`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <motion.div
                              className="w-12 h-12 rounded-full bg-linear-to-br from-teal-500 to-yellow-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shrink-0"
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.6 }}
                            >
                              {testimonial.name[0].toUpperCase()}
                            </motion.div>
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {testimonial.name}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {testimonial.location}
                              </p>
                              {testimonial.email && (
                                <p className="text-xs text-gray-400 truncate max-w-[180px]">
                                  {testimonial.email}
                                </p>
                              )}
                            </div>
                          </div>
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
                            <DropdownMenuContent align="end" className="w-48">
                              {testimonial.status === "PENDING" && (
                                <>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleStatusChange(
                                        testimonial.id,
                                        "APPROVED"
                                      )
                                    }
                                    className="text-emerald-600 focus:text-emerald-600"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Approve
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleStatusChange(
                                        testimonial.id,
                                        "REJECTED"
                                      )
                                    }
                                    className="text-rose-600 focus:text-rose-600"
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Reject
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                </>
                              )}
                              {testimonial.status === "APPROVED" && (
                                <>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleStatusChange(
                                        testimonial.id,
                                        "REJECTED"
                                      )
                                    }
                                    className="text-rose-600 focus:text-rose-600"
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Reject
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                </>
                              )}
                              {testimonial.status === "REJECTED" && (
                                <>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleStatusChange(
                                        testimonial.id,
                                        "APPROVED"
                                      )
                                    }
                                    className="text-emerald-600 focus:text-emerald-600"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Approve
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                </>
                              )}
                              <DropdownMenuItem
                                onClick={() => openEditDialog(testimonial)}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-rose-600 focus:text-rose-600"
                                onClick={() => setDeleteId(testimonial.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="flex items-center gap-1 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < testimonial.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="text-sm text-gray-500 ml-2">
                            {testimonial.rating}.0
                          </span>
                        </div>

                        <div className="p-3 bg-linear-to-r from-gray-50 to-transparent rounded-lg border border-gray-100 mb-4">
                          <p className="text-gray-600 text-sm line-clamp-4 italic">
                            &ldquo;{testimonial.comment}&rdquo;
                          </p>
                        </div>

                        {testimonial.tripDate && (
                          <div className="text-xs text-gray-400 mb-3 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Trip: {testimonial.tripDate}
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <Badge
                            className={`
                            ${statusColors[testimonial.status]?.bg}
                            ${statusColors[testimonial.status]?.text}
                            ${statusColors[testimonial.status]?.border}
                            border font-medium shadow-sm
                          `}
                          >
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {testimonial.status}
                          </Badge>
                          <div className="flex items-center gap-2">
                            {testimonial.featured && (
                              <Badge className="bg-linear-to-r from-purple-500 to-pink-500 text-white border-0 shadow-sm">
                                Featured
                              </Badge>
                            )}
                            <span className="text-xs text-gray-400">
                              {new Date(
                                testimonial.createdAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {testimonial.status === "PENDING" && (
                          <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                            <Button
                              size="sm"
                              className="flex-1 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                              onClick={() =>
                                handleStatusChange(testimonial.id, "APPROVED")
                              }
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 text-rose-600 border-rose-300 hover:bg-rose-50"
                              onClick={() =>
                                handleStatusChange(testimonial.id, "REJECTED")
                              }
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {editingTestimonial ? "Edit Testimonial" : "Add Testimonial"}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {editingTestimonial
                ? "Update the testimonial details"
                : "Add a new customer testimonial. All fields marked with * are required."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-gray-700">
                  Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Customer name"
                  className="mt-1 border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="customer@email.com"
                  className="mt-1 border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location" className="text-gray-700">
                  Location *
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="City, Country"
                  className="mt-1 border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
              <div>
                <Label htmlFor="tripDate" className="text-gray-700">
                  Trip Date
                </Label>
                <Input
                  id="tripDate"
                  value={formData.tripDate}
                  onChange={(e) =>
                    setFormData({ ...formData, tripDate: e.target.value })
                  }
                  placeholder="March 2024"
                  className="mt-1 border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <Label className="text-gray-700">Rating</Label>
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-8 w-8 transition-all duration-200 ${
                        star <= formData.rating
                          ? "text-yellow-400 fill-yellow-400 scale-110"
                          : "text-gray-300 hover:text-yellow-200 hover:scale-105"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Selected: {formData.rating} out of 5 stars
              </p>
            </div>

            <div>
              <Label htmlFor="comment" className="text-gray-700">
                Comment *
              </Label>
              <Textarea
                id="comment"
                value={formData.comment}
                onChange={(e) =>
                  setFormData({ ...formData, comment: e.target.value })
                }
                placeholder="Customer's testimonial..."
                rows={4}
                className="mt-1 border-gray-200 focus:border-teal-500 focus:ring-teal-500"
              />
            </div>

            <div>
              <Label htmlFor="image" className="text-gray-700">
                Image URL
              </Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                placeholder="https://example.com/photo.jpg"
                className="mt-1 border-gray-200 focus:border-teal-500 focus:ring-teal-500"
              />
            </div>

            <div>
              <Label className="text-gray-700">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger className="mt-1 border-gray-200 focus:border-teal-500 focus:ring-teal-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value="PENDING"
                    className="flex items-center gap-2"
                  >
                    <Clock className="h-4 w-4 text-amber-500" />
                    Pending
                  </SelectItem>
                  <SelectItem
                    value="APPROVED"
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    Approved
                  </SelectItem>
                  <SelectItem
                    value="REJECTED"
                    className="flex items-center gap-2"
                  >
                    <XCircle className="h-4 w-4 text-rose-500" />
                    Rejected
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, featured: checked })
                }
                className="data-[state=checked]:bg-purple-500"
              />
              <Label
                htmlFor="featured"
                className="text-gray-700 cursor-pointer"
              >
                Mark as Featured
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={saving}
              className="border-gray-200 hover:border-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-linear-to-r from-teal-500 to-yellow-500 hover:from-teal-600 hover:to-yellow-600"
            >
              {saving ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  {editingTestimonial ? "Updating..." : "Creating..."}
                </div>
              ) : editingTestimonial ? (
                "Update Testimonial"
              ) : (
                "Create Testimonial"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-gray-900">
              Delete Testimonial
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Are you sure you want to delete this testimonial? This action
              cannot be undone.
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
              Delete Testimonial
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
