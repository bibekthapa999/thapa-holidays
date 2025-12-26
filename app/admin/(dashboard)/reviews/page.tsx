"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Star,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Trash2,
  Package,
  User,
  Calendar,
  MapPin,
  ThumbsUp,
  AlertCircle,
  Check,
  X,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Shield,
  Award,
  Heart,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { cn } from "@/lib/utils";

interface Review {
  id: string;
  packageId: string;
  packageName: string;
  name: string;
  email?: string;
  location?: string;
  rating: number;
  title?: string;
  comment: string;
  images: string[];
  verified: boolean;
  helpful: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  type?: "review" | "testimonial"; // Add type to distinguish between review types
}

interface ReviewStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  averageRating: number;
  pendingChange: number;
  approvedChange: number;
}

const statCards = [
  {
    title: "Total Reviews",
    key: "total",
    icon: MessageSquare,
    gradient: "from-blue-500 via-blue-600 to-indigo-600",
    bgGradient: "from-blue-50 to-indigo-50",
    changeKey: null,
    changeType: "neutral" as const,
  },
  {
    title: "Pending Reviews",
    key: "pending",
    icon: Clock,
    gradient: "from-amber-500 via-yellow-600 to-orange-600",
    bgGradient: "from-amber-50 to-orange-50",
    changeKey: "pendingChange",
    changeType: "positive" as const,
  },
  {
    title: "Approved Reviews",
    key: "approved",
    icon: CheckCircle,
    gradient: "from-emerald-500 via-green-600 to-teal-600",
    bgGradient: "from-emerald-50 to-teal-50",
    changeKey: "approvedChange",
    changeType: "positive" as const,
  },
  {
    title: "Rejected Reviews",
    key: "rejected",
    icon: XCircle,
    gradient: "from-rose-500 via-red-600 to-pink-600",
    bgGradient: "from-rose-50 to-pink-50",
    changeKey: null,
    changeType: "negative" as const,
  },
  {
    title: "Avg. Rating",
    key: "averageRating",
    icon: Star,
    gradient: "from-purple-500 via-violet-600 to-purple-700",
    bgGradient: "from-purple-50 to-violet-50",
    changeKey: null,
    changeType: "positive" as const,
  },
];

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    averageRating: 0,
    pendingChange: 0,
    approvedChange: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [packageFilter, setPackageFilter] = useState<string>("all");
  const [packages, setPackages] = useState<{ id: string; name: string }[]>([]);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchReviews();
    fetchPackages();
  }, [statusFilter, packageFilter]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (packageFilter !== "all") params.set("packageId", packageFilter);
      params.set("includeAll", "true");

      // Fetch from both reviews and testimonials APIs
      const [reviewsResponse, testimonialsResponse] = await Promise.all([
        fetch(`/api/reviews?${params}`),
        fetch(`/api/testimonials?${params}`),
      ]);

      let allReviews: Review[] = [];

      // Process reviews API response
      if (reviewsResponse.ok) {
        const reviewsData = await reviewsResponse.json();
        const reviews = (reviewsData.reviews || []).map((review: any) => ({
          ...review,
          type: "review", // Add type to distinguish
        }));
        allReviews = [...allReviews, ...reviews];
      }

      // Process testimonials API response
      if (testimonialsResponse.ok) {
        const testimonialsData = await testimonialsResponse.json();
        const testimonials = (testimonialsData.testimonials || []).map(
          (testimonial: any) => {
            // Find package name if testimonial has packageId
            const packageInfo = packages.find(
              (pkg) => pkg.id === testimonial.packageId
            );
            return {
              id: testimonial.id,
              packageId: testimonial.packageId || null,
              packageName: packageInfo
                ? packageInfo.name
                : testimonial.packageId
                ? "Unknown Package"
                : "General",
              name: testimonial.name,
              email: testimonial.email,
              location: testimonial.location,
              rating: testimonial.rating,
              title: testimonial.title || null,
              comment: testimonial.comment,
              images: testimonial.image ? [testimonial.image] : [],
              verified: testimonial.featured || false,
              helpful: 0, // testimonials don't have helpful count
              status:
                testimonial.status === "APPROVED"
                  ? "APPROVED"
                  : testimonial.status === "REJECTED"
                  ? "REJECTED"
                  : "PENDING",
              createdAt: testimonial.createdAt,
              type: "testimonial", // Add type to distinguish
            };
          }
        );
        allReviews = [...allReviews, ...testimonials];
      }

      // Sort by creation date (newest first)
      allReviews.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setReviews(allReviews);

      // Calculate stats
      const total = allReviews.length;
      const pending = allReviews.filter(
        (r: Review) => r.status === "PENDING"
      ).length;
      const approved = allReviews.filter(
        (r: Review) => r.status === "APPROVED"
      ).length;
      const rejected = allReviews.filter(
        (r: Review) => r.status === "REJECTED"
      ).length;
      const averageRating =
        allReviews.length > 0
          ? allReviews.reduce((sum: number, r: Review) => sum + r.rating, 0) /
            allReviews.length
          : 0;

      // Mock change percentages for demo (in real app, fetch from analytics API)
      const pendingChange = 12;
      const approvedChange = 8;

      setStats({
        total,
        pending,
        approved,
        rejected,
        averageRating: parseFloat(averageRating.toFixed(1)),
        pendingChange,
        approvedChange,
      });
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const fetchPackages = async () => {
    try {
      const response = await fetch("/api/packages");
      if (response.ok) {
        const data = await response.json();
        setPackages(data.map((p: any) => ({ id: p.id, name: p.name })));
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
    }
  };

  const handleReviewAction = async (
    reviewId: string,
    action: "approve" | "reject"
  ) => {
    try {
      setIsProcessing(true);

      // Find the review to determine its type
      const review = reviews.find((r) => r.id === reviewId);
      const apiEndpoint =
        review?.type === "testimonial" ? "/api/testimonials" : "/api/reviews";

      const response = await fetch(apiEndpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: reviewId,
          status: action === "approve" ? "APPROVED" : "REJECTED",
          ...(review?.type === "testimonial"
            ? { featured: action === "approve" }
            : { verified: action === "approve" }),
        }),
      });

      if (response.ok) {
        toast.success(`Review ${action}d successfully`, {
          description:
            action === "approve"
              ? "Review is now live on the website"
              : "Review has been rejected",
        });
        fetchReviews();
      } else {
        throw new Error("Failed to update review");
      }
    } catch (error) {
      console.error("Error updating review:", error);
      toast.error("Failed to update review");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!selectedReview) return;

    try {
      setIsProcessing(true);
      const apiEndpoint =
        selectedReview.type === "testimonial"
          ? "/api/testimonials"
          : "/api/reviews";
      const response = await fetch(`${apiEndpoint}?id=${selectedReview.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Review deleted successfully", {
          description: "The review has been permanently removed",
        });
        setShowDeleteDialog(false);
        setSelectedReview(null);
        fetchReviews();
      } else {
        throw new Error("Failed to delete review");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredReviews = reviews.filter(
    (review) =>
      review.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.packageName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderStars = (rating: number, size: "sm" | "md" | "lg" = "md") => {
    const sizeClasses = {
      sm: "h-3 w-3",
      md: "h-4 w-4",
      lg: "h-5 w-5",
    };

    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              sizeClasses[size],
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            )}
          />
        ))}
      </div>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200 transition-colors">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200 transition-colors">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-200 transition-colors">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-4 sm:p-6 lg:p-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="space-y-2">
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
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
              Reviews Management
            </h1>
          </div>
          <p className="text-slate-600 text-base sm:text-lg">
            Manage and moderate customer reviews for your packages
          </p>
        </motion.div>

        {/* Stats Grid - All cards now have consistent size */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
        >
          {statCards.map((stat, index) => (
            <motion.div key={stat.key} variants={itemVariants}>
              <Card className="group relative overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer h-full">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50 group-hover:opacity-100 transition-opacity duration-500`}
                />
                <CardContent className="relative p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-600">
                        {stat.title}
                      </p>
                      <motion.p
                        className="text-3xl font-bold text-slate-900"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                      >
                        {loading ? (
                          <span className="inline-block animate-pulse">--</span>
                        ) : stat.key === "averageRating" ? (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                          >
                            {stats[stat.key as keyof ReviewStats] || 0}
                            <span className="text-lg text-slate-600">/5</span>
                          </motion.span>
                        ) : (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                          >
                            {stats[stat.key as keyof ReviewStats] || 0}
                          </motion.span>
                        )}
                      </motion.p>
                    </div>
                    <motion.div
                      className={`p-2 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <stat.icon className="h-5 w-5 text-white" />
                    </motion.div>
                  </div>
                  {stat.changeKey &&
                    stats[stat.changeKey as keyof ReviewStats] !== 0 && (
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                            stat.changeType === "positive"
                              ? "bg-emerald-100"
                              : "bg-rose-100"
                          }`}
                        >
                          {stat.changeType === "positive" ? (
                            <TrendingUp className="h-3 w-3 text-emerald-600" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-rose-600" />
                          )}
                          <span
                            className={`font-semibold ${
                              stat.changeType === "positive"
                                ? "text-emerald-700"
                                : "text-rose-700"
                            }`}
                          >
                            {stats[stat.changeKey as keyof ReviewStats] > 0
                              ? "+"
                              : ""}
                            {stats[stat.changeKey as keyof ReviewStats]}%
                          </span>
                        </div>
                        <span className="text-xs text-slate-500">
                          this week
                        </span>
                      </div>
                    )}
                  {/* Add consistent bottom spacing for all cards */}
                  <div className="mt-2 text-xs text-slate-500">
                    {stat.changeKey ? "Updated today" : "Current"}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Filters & Search Card */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-sm hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search reviews by name, comment, or package..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-white border-slate-200 focus:border-teal-500 focus:ring-teal-500"
                    />
                  </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-48 bg-white border-slate-200 focus:border-teal-500 focus:ring-teal-500">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-slate-500" />
                        <SelectValue placeholder="Filter by status" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="APPROVED">Approved</SelectItem>
                      <SelectItem value="REJECTED">Rejected</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={packageFilter}
                    onValueChange={setPackageFilter}
                  >
                    <SelectTrigger className="w-full sm:w-48 bg-white border-slate-200 focus:border-teal-500 focus:ring-teal-500">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-slate-500" />
                        <SelectValue placeholder="Filter by package" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Packages</SelectItem>
                      {packages.map((pkg) => (
                        <SelectItem key={pkg.id} value={pkg.id}>
                          {pkg.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Reviews List */}
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">
              Customer Reviews
              {searchQuery ||
              statusFilter !== "all" ||
              packageFilter !== "all" ? (
                <span className="text-slate-600 text-sm font-normal ml-2">
                  ({filteredReviews.length} found)
                </span>
              ) : (
                <span className="text-slate-600 text-sm font-normal ml-2">
                  ({reviews.length} total)
                </span>
              )}
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchReviews}
              disabled={loading}
              className="text-slate-700 hover:text-slate-900"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </Button>
          </div>

          <AnimatePresence mode="wait">
            {filteredReviews.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-12 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200"
              >
                <MessageSquare className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  {searchQuery ||
                  statusFilter !== "all" ||
                  packageFilter !== "all"
                    ? "No matching reviews found"
                    : "No reviews yet"}
                </h3>
                <p className="text-slate-600 max-w-md mx-auto">
                  {searchQuery ||
                  statusFilter !== "all" ||
                  packageFilter !== "all"
                    ? "Try adjusting your search or filters to find what you're looking for."
                    : "Customer reviews will appear here once they start submitting feedback."}
                </p>
              </motion.div>
            ) : (
              filteredReviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className={cn(
                      "border-0 shadow-sm hover:shadow-lg transition-all duration-300",
                      review.status !== "APPROVED" && "border-l-4",
                      review.status === "PENDING" && "border-l-amber-400",
                      review.status === "REJECTED" && "border-l-rose-400",
                      review.status === "APPROVED" && "border-l-emerald-400"
                    )}
                  >
                    <CardContent className="p-6">
                      {/* Header Section */}
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6">
                        <div className="flex items-start gap-3">
                          <motion.div
                            className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 via-teal-500 to-teal-600 flex items-center justify-center text-white font-bold shadow-lg"
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                          >
                            <User className="h-6 w-6" />
                          </motion.div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-slate-900 text-lg">
                                {review.name}
                              </h4>
                              {review.verified && (
                                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                  <Shield className="h-3 w-3 mr-1" />
                                  Verified
                                </Badge>
                              )}
                              {getStatusBadge(review.status)}
                            </div>

                            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                              <div className="flex items-center gap-1">
                                {renderStars(review.rating, "md")}
                                <span className="font-medium">
                                  {review.rating}.0
                                </span>
                              </div>
                              {review.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {review.location}
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(review.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  }
                                )}
                              </div>
                              <div className="flex items-center gap-1">
                                <Package className="h-3 w-3" />
                                <span className="font-medium">
                                  {review.packageName}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                          {review.status === "PENDING" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() =>
                                  handleReviewAction(review.id, "approve")
                                }
                                disabled={isProcessing}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4"
                              >
                                <Check className="h-4 w-4 mr-2" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleReviewAction(review.id, "reject")
                                }
                                disabled={isProcessing}
                                className="border-rose-300 text-rose-600 hover:bg-rose-50"
                              >
                                <X className="h-4 w-4 mr-2" />
                                Reject
                              </Button>
                            </>
                          )}

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="border-slate-300 text-slate-700 hover:text-slate-900"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem className="text-slate-700">
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedReview(review);
                                  setShowDeleteDialog(true);
                                }}
                                className="text-rose-600 focus:text-rose-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Review
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      {/* Review Content */}
                      <div className="space-y-4">
                        {review.title && (
                          <h5 className="text-xl font-semibold text-slate-900">
                            {review.title}
                          </h5>
                        )}

                        <p className="text-slate-700 leading-relaxed text-base">
                          {review.comment}
                        </p>

                        {/* Images */}
                        {review.images && review.images.length > 0 && (
                          <div className="flex flex-wrap gap-3">
                            {review.images.map((image, index) => (
                              <motion.div
                                key={index}
                                whileHover={{ scale: 1.05 }}
                                className="relative w-24 h-24 rounded-lg overflow-hidden border border-slate-200"
                              >
                                <img
                                  src={image}
                                  alt={`Review image ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </motion.div>
                            ))}
                          </div>
                        )}

                        {/* Footer */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-slate-100">
                          <div className="flex items-center gap-4">
                            <button className="flex items-center gap-2 text-slate-600 hover:text-teal-600 transition-colors group">
                              <div className="p-2 rounded-full bg-slate-100 group-hover:bg-teal-50 transition-colors">
                                <ThumbsUp className="h-4 w-4" />
                              </div>
                              <span className="font-medium">
                                Helpful ({review.helpful})
                              </span>
                            </button>
                            {review.status === "PENDING" && (
                              <div className="flex items-center gap-2 text-amber-600">
                                <Clock className="h-4 w-4" />
                                <span className="text-sm font-medium">
                                  Awaiting Approval
                                </span>
                              </div>
                            )}
                            {review.status === "APPROVED" &&
                              review.verified && (
                                <div className="flex items-center gap-2 text-emerald-600">
                                  <Award className="h-4 w-4" />
                                  <span className="text-sm font-medium">
                                    Featured Review
                                  </span>
                                </div>
                              )}
                          </div>

                          {/* Quick Stats */}
                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            <div className="flex items-center gap-1">
                              <Heart className="h-4 w-4 text-rose-500" />
                              <span>{review.helpful} helpful votes</span>
                            </div>
                            {review.status === "APPROVED" && (
                              <Badge
                                variant="outline"
                                className="border-emerald-200 text-emerald-700"
                              >
                                Published
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="border-0 shadow-2xl">
          <AlertDialogHeader>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
                <AlertCircle className="h-6 w-6 text-rose-600" />
              </div>
              <AlertDialogTitle className="text-center text-xl font-bold text-slate-900">
                Delete Review
              </AlertDialogTitle>
              <AlertDialogDescription className="text-center text-slate-600">
                Are you sure you want to delete this review? This action cannot
                be undone and will permanently remove the review from the
                system.
              </AlertDialogDescription>
            </motion.div>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-3">
            <AlertDialogCancel
              disabled={isProcessing}
              className="w-full sm:w-auto border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteReview}
              disabled={isProcessing}
              className="w-full sm:w-auto bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white"
            >
              {isProcessing ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete Review"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
