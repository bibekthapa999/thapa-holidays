"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Eye,
  Phone,
  Mail as MailIcon,
  Calendar,
  Users,
  MapPin,
  Package,
  Clock,
  MoreHorizontal,
  Check,
  X,
  Star,
  MessageSquare,
  Filter,
  Sparkles,
  TrendingUp,
  User,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface PackageEnquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  travelDate: string | null;
  travelTime: string | null;
  adults: number;
  children: number;
  rooms: number;
  message: string | null;
  status: string;
  createdAt: string;
  package?: {
    id: string;
    name: string;
    slug: string;
    price: number;
    destinationName: string;
  } | null;
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
    y: -2,
    boxShadow: "0 8px 24px -4px rgba(0, 0, 0, 0.12)",
  },
};

const statusColors: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  NEW: {
    bg: "bg-sky-50",
    text: "text-sky-700",
    border: "border-sky-200",
  },
  PENDING: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  CONTACTED: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  QUOTED: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
  },
  CONFIRMED: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  REJECTED: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
  },
  COMPLETED: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
  },
  CANCELLED: {
    bg: "bg-gray-50",
    text: "text-gray-700",
    border: "border-gray-200",
  },
};

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<PackageEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedEnquiry, setSelectedEnquiry] = useState<PackageEnquiry | null>(
    null
  );

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const res = await fetch("/api/packages/enquiry");
      if (res.ok) {
        const data = await res.json();
        setEnquiries(data);
      }
    } catch (error) {
      console.error("Error fetching enquiries:", error);
      toast.error("Failed to fetch enquiries");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/packages/enquiry/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setEnquiries(
          enquiries.map((e) => (e.id === id ? { ...e, status } : e))
        );
        toast.success("Status updated successfully!");
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };

  const filteredEnquiries = enquiries.filter((enquiry) => {
    const matchesSearch =
      enquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.phone.includes(searchTerm) ||
      (enquiry.package?.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || enquiry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const newCount = enquiries.filter((e) => e.status === "NEW").length;
  const pendingCount = enquiries.filter((e) => e.status === "PENDING").length;
  const contactedCount = enquiries.filter(
    (e) => e.status === "CONTACTED"
  ).length;
  const quotedCount = enquiries.filter((e) => e.status === "QUOTED").length;
  const confirmedCount = enquiries.filter(
    (e) => e.status === "CONFIRMED"
  ).length;
  const rejectedCount = enquiries.filter((e) => e.status === "REJECTED").length;
  const completedCount = enquiries.filter(
    (e) => e.status === "COMPLETED"
  ).length;
  const cancelledCount = enquiries.filter(
    (e) => e.status === "CANCELLED"
  ).length;

  // Calculate metrics for dashboard
  const activeEnquiries =
    newCount + pendingCount + contactedCount + quotedCount;
  const needsAttention = newCount + pendingCount;

  const activeFilters = [
    searchTerm && "Search",
    statusFilter !== "all" && "Status",
  ].filter(Boolean).length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "NEW":
        return <Sparkles className="h-3 w-3" />;
      case "PENDING":
        return <Clock className="h-3 w-3" />;
      case "CONTACTED":
        return <Phone className="h-3 w-3" />;
      case "QUOTED":
        return <MessageSquare className="h-3 w-3" />;
      case "CONFIRMED":
        return <Check className="h-3 w-3" />;
      case "REJECTED":
        return <X className="h-3 w-3" />;
      case "COMPLETED":
        return <Star className="h-3 w-3" />;
      case "CANCELLED":
        return <X className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
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
                  Package Enquiries
                </h1>
              </div>
              <p className="text-gray-600 mt-1">
                Manage customer enquiries and convert them into bookings
              </p>
            </div>
            <div className="flex items-center gap-3">
              {needsAttention > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <Badge className="bg-linear-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg">
                    {needsAttention} Need Attention
                  </Badge>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {[
            {
              title: "Total Enquiries",
              value: enquiries.length,
              icon: MailIcon,
              change: "+12%",
              subtitle: "this month",
              gradient: "from-blue-500 via-blue-600 to-indigo-600",
              bgGradient: "from-blue-50 to-indigo-50",
            },
            {
              title: "Pending",
              value: needsAttention,
              icon: Clock,
              change: needsAttention > 0 ? "Needs attention" : "All clear",
              subtitle: "this month",
              gradient: "from-amber-500 via-orange-600 to-yellow-600",
              bgGradient: "from-amber-50 to-orange-50",
            },
            {
              title: "Contacted",
              value: contactedCount + quotedCount,
              icon: Phone,
              change: "+5",
              subtitle: "this month",
              gradient: "from-emerald-500 via-green-600 to-teal-600",
              bgGradient: "from-emerald-50 to-teal-50",
            },
            {
              title: "Confirmed",
              value: confirmedCount,
              icon: Check,
              change: "+3",
              subtitle: "this month",
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
                        stat.title === "Pending" && needsAttention > 0
                          ? "bg-amber-100"
                          : "bg-emerald-100"
                      }`}
                    >
                      <TrendingUp className="h-3 w-3 text-emerald-600" />
                      <span
                        className={`text-sm font-semibold ${
                          stat.title === "Pending" && needsAttention > 0
                            ? "text-amber-700"
                            : "text-emerald-700"
                        }`}
                      >
                        {stat.change}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500">
                      {stat.subtitle}
                    </span>
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
                      placeholder="Search enquiries by name, email, phone or package..."
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
                        <SelectItem value="NEW">New</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="CONTACTED">Contacted</SelectItem>
                        <SelectItem value="QUOTED">Quoted</SelectItem>
                        <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                        <SelectItem value="REJECTED">Rejected</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
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
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions Panel */}
        {needsAttention > 0 && (
          <motion.div variants={itemVariants}>
            <Card className="border-0 shadow-lg bg-linear-to-r from-amber-50 to-orange-50 border-l-4 border-l-amber-500">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-amber-600" />
                    <div>
                      <h3 className="font-semibold text-amber-900">
                        {needsAttention} enquiries need attention
                      </h3>
                      <p className="text-sm text-amber-700">
                        {newCount} new and {pendingCount} pending enquiries
                        require follow-up
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setStatusFilter("NEW")}
                      className="border-amber-200 text-amber-700 hover:bg-amber-100"
                    >
                      View New ({newCount})
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setStatusFilter("PENDING")}
                      className="border-amber-200 text-amber-700 hover:bg-amber-100"
                    >
                      View Pending ({pendingCount})
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Results Count */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {filteredEnquiries.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">
                {enquiries.length}
              </span>{" "}
              enquiries
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

        {/* Enquiries List */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {[...Array(5)].map((_, i) => (
                <Card key={i} className="border-0 shadow-lg animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-gray-200 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/3" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                      </div>
                      <div className="h-8 bg-gray-200 rounded w-24" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          ) : filteredEnquiries.length === 0 ? (
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
                    <MailIcon className="h-8 w-8 text-gray-400" />
                  </motion.div>
                  <p className="text-gray-700 font-medium mb-2">
                    No enquiries found
                  </p>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    {searchTerm || statusFilter !== "all"
                      ? "Try adjusting your filters or search term"
                      : "Customer enquiries will appear here"}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {filteredEnquiries.map((enquiry, index) => (
                <motion.div
                  key={enquiry.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group bg-white">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                        {/* Customer Info */}
                        <div className="flex-1">
                          <div className="flex items-start gap-4">
                            <motion.div
                              className="w-12 h-12 rounded-full bg-linear-to-br from-yellow-400 via-teal-500 to-teal-600 flex items-center justify-center text-white font-bold shadow-lg shrink-0"
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.6 }}
                            >
                              {enquiry.name[0].toUpperCase()}
                            </motion.div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                                <h3 className="font-semibold text-gray-900 text-lg group-hover:text-teal-600 transition-colors">
                                  {enquiry.name}
                                </h3>
                                <div className="flex items-center gap-2">
                                  <Badge
                                    className={`
                                    ${statusColors[enquiry.status]?.bg}
                                    ${statusColors[enquiry.status]?.text}
                                    ${statusColors[enquiry.status]?.border}
                                    border font-medium shadow-sm
                                  `}
                                  >
                                    {getStatusIcon(enquiry.status)}
                                    <span className="ml-1">
                                      {enquiry.status}
                                    </span>
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
                                    <DropdownMenuContent
                                      align="end"
                                      className="w-52"
                                    >
                                      <DropdownMenuItem
                                        onClick={() =>
                                          updateStatus(enquiry.id, "PENDING")
                                        }
                                      >
                                        <Clock className="h-4 w-4 mr-2" />
                                        Mark as Pending
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          updateStatus(enquiry.id, "CONTACTED")
                                        }
                                      >
                                        <Phone className="h-4 w-4 mr-2" />
                                        Mark as Contacted
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          updateStatus(enquiry.id, "QUOTED")
                                        }
                                      >
                                        <MessageSquare className="h-4 w-4 mr-2" />
                                        Mark as Quoted
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          updateStatus(enquiry.id, "CONFIRMED")
                                        }
                                        className="text-emerald-600 focus:text-emerald-600"
                                      >
                                        <Check className="h-4 w-4 mr-2" />
                                        Mark as Confirmed
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          updateStatus(enquiry.id, "COMPLETED")
                                        }
                                        className="text-green-600 focus:text-green-600"
                                      >
                                        <Star className="h-4 w-4 mr-2" />
                                        Mark as Completed
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          updateStatus(enquiry.id, "REJECTED")
                                        }
                                        className="text-rose-600 focus:text-rose-600"
                                      >
                                        <X className="h-4 w-4 mr-2" />
                                        Mark as Rejected
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          updateStatus(enquiry.id, "CANCELLED")
                                        }
                                        className="text-gray-600 focus:text-gray-600"
                                      >
                                        <X className="h-4 w-4 mr-2" />
                                        Mark as Cancelled
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <MailIcon className="h-4 w-4 text-gray-400" />
                                  <span className="truncate">
                                    {enquiry.email}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-gray-400" />
                                  <span>{enquiry.phone}</span>
                                </div>
                                {enquiry.travelDate && (
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    <span>
                                      {new Date(
                                        enquiry.travelDate
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>
                                )}
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4 text-gray-400" />
                                  <span>
                                    {enquiry.adults} Adult
                                    {enquiry.adults !== 1 ? "s" : ""}
                                    {enquiry.children > 0 &&
                                      `, ${enquiry.children} Children`}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Package Info */}
                          {enquiry.package && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-4 p-4 bg-linear-to-r from-slate-50 to-transparent rounded-lg border border-slate-100"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <Package className="h-4 w-4 text-teal-600" />
                                    <h4 className="font-medium text-gray-900">
                                      {enquiry.package.name}
                                    </h4>
                                  </div>
                                  <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      {enquiry.package.destinationName}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                      ₹{enquiry.package.price?.toLocaleString()}
                                    </div>
                                  </div>
                                </div>
                                <Badge
                                  variant="outline"
                                  className="bg-white border-slate-200"
                                >
                                  Package Enquiry
                                </Badge>
                              </div>
                            </motion.div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="lg:w-auto flex flex-col gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedEnquiry(enquiry)}
                            className="w-full lg:w-auto border-slate-200 hover:border-slate-300"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          <div className="flex gap-2">
                            <Button
                              onClick={() =>
                                window.open(`tel:${enquiry.phone}`)
                              }
                              size="sm"
                              className="flex-1 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                            >
                              <Phone className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() =>
                                window.open(`mailto:${enquiry.email}`)
                              }
                              variant="outline"
                              size="sm"
                              className="flex-1 border-slate-200 hover:border-slate-300"
                            >
                              <MailIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() =>
                                window.open(
                                  `https://wa.me/${enquiry.phone.replace(
                                    /\D/g,
                                    ""
                                  )}`,
                                  "_blank"
                                )
                              }
                              variant="outline"
                              size="sm"
                              className="flex-1 border-slate-200 hover:border-slate-300 bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                            >
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Enquiry Details Dialog */}
      <Dialog
        open={!!selectedEnquiry}
        onOpenChange={() => setSelectedEnquiry(null)}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedEnquiry && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Enquiry Details
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  Customer enquiry from {selectedEnquiry.name}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                {/* Customer Info Card */}
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-full bg-linear-to-br from-yellow-400 via-teal-500 to-teal-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                        {selectedEnquiry.name[0].toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-xl text-gray-900">
                          {selectedEnquiry.name}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <div className="flex items-center gap-1">
                            <MailIcon className="h-4 w-4" />
                            {selectedEnquiry.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {selectedEnquiry.phone}
                          </div>
                        </div>
                      </div>
                      <Badge
                        className={`
                        ${statusColors[selectedEnquiry.status]?.bg}
                        ${statusColors[selectedEnquiry.status]?.text}
                        ${statusColors[selectedEnquiry.status]?.border}
                        border font-medium text-lg py-2 px-4
                      `}
                      >
                        {selectedEnquiry.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Travel Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-lg font-bold text-gray-900">
                        Travel Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Travel Date</p>
                          <p className="font-medium text-gray-900">
                            {selectedEnquiry.travelDate
                              ? new Date(
                                  selectedEnquiry.travelDate
                                ).toLocaleDateString()
                              : "Not specified"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            Preferred Time
                          </p>
                          <p className="font-medium text-gray-900">
                            {selectedEnquiry.travelTime || "Not specified"}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Adults</p>
                          <p className="font-medium text-gray-900">
                            {selectedEnquiry.adults}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Children</p>
                          <p className="font-medium text-gray-900">
                            {selectedEnquiry.children}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Rooms Required</p>
                        <p className="font-medium text-gray-900">
                          {selectedEnquiry.rooms} room
                          {selectedEnquiry.rooms !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Package Info Card */}
                  {selectedEnquiry.package && (
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="text-lg font-bold text-gray-900">
                          Package Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500">Package Name</p>
                          <p className="font-medium text-gray-900">
                            {selectedEnquiry.package.name}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Destination</p>
                          <p className="font-medium text-gray-900">
                            {selectedEnquiry.package.destinationName}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Package Price</p>
                          <p className="font-bold text-2xl text-teal-600">
                            ₹{selectedEnquiry.package.price?.toLocaleString()}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Message */}
                {selectedEnquiry.message && (
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-lg font-bold text-gray-900">
                        Customer Message
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-50 p-4 rounded-lg text-gray-700">
                        {selectedEnquiry.message}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Status Update & Actions */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-gray-900">
                      Update Status & Contact
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(statusColors).map((status) => (
                        <Button
                          key={status}
                          variant={
                            selectedEnquiry.status === status
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => {
                            updateStatus(selectedEnquiry.id, status);
                            setSelectedEnquiry({ ...selectedEnquiry, status });
                          }}
                          className={`
                            ${
                              selectedEnquiry.status === status
                                ? statusColors[status]?.text.replace(
                                    "text-",
                                    "bg-"
                                  )
                                : ""
                            }
                          `}
                        >
                          {status}
                        </Button>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={() =>
                          window.open(`tel:${selectedEnquiry.phone}`)
                        }
                        className="flex-1 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Call Customer
                      </Button>
                      <Button
                        onClick={() =>
                          window.open(`mailto:${selectedEnquiry.email}`)
                        }
                        variant="outline"
                        className="flex-1 border-gray-200 hover:border-gray-300"
                      >
                        <MailIcon className="h-4 w-4 mr-2" />
                        Send Email
                      </Button>
                      <Button
                        onClick={() =>
                          window.open(
                            `https://wa.me/${selectedEnquiry.phone.replace(
                              /\D/g,
                              ""
                            )}`,
                            "_blank"
                          )
                        }
                        variant="outline"
                        className="flex-1 border-gray-200 hover:border-gray-300 bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        WhatsApp
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}



