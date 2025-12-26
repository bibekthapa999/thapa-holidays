"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  ThumbsUp,
  MessageSquare,
  User,
  Calendar,
  MapPin,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

interface Review {
  id: string;
  name: string;
  location?: string;
  rating: number;
  title?: string;
  comment: string;
  images: string[];
  verified: boolean;
  helpful: number;
  status: string;
  createdAt: string;
}

interface PackageReviewsProps {
  packageId: string;
  packageName: string;
  isAdmin?: boolean;
}

interface ReviewForm {
  name: string;
  email: string;
  location: string;
  rating: number;
  title: string;
  comment: string;
}

export default function PackageReviews({
  packageId,
  packageName,
  isAdmin = false,
}: PackageReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [votedReviews, setVotedReviews] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(1);
  const [form, setForm] = useState<ReviewForm>({
    name: "",
    email: "",
    location: "",
    rating: 5,
    title: "",
    comment: "",
  });

  useEffect(() => {
    fetchReviews();
  }, [packageId]);

  // Reset to first page when reviews change
  useEffect(() => {
    setCurrentPage(1);
  }, [reviews.length, isAdmin]);

  const fetchReviews = async () => {
    try {
      const params = new URLSearchParams({
        packageId,
        ...(isAdmin ? { includeAll: "true" } : {}),
      });

      const response = await fetch(`/api/reviews?${params}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.comment.trim()) {
      toast.error("Name and comment are required");
      return;
    }

    if (form.comment.length < 50) {
      toast.error(
        "Please write a more detailed review (minimum 50 characters)"
      );
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          packageId,
          ...form,
        }),
      });

      if (response.ok) {
        toast.success(
          "Thank you for your review! It will be published after approval."
        );
        setForm({
          name: "",
          email: "",
          location: "",
          rating: 5,
          title: "",
          comment: "",
        });
        setShowForm(false);
        // Refresh reviews to show pending status if admin
        if (isAdmin) {
          fetchReviews();
        }
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReviewAction = async (
    reviewId: string,
    action: "approve" | "reject"
  ) => {
    try {
      const response = await fetch("/api/reviews", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: reviewId,
          status: action === "approve" ? "APPROVED" : "REJECTED",
          verified: action === "approve",
        }),
      });

      if (response.ok) {
        toast.success(`Review ${action}d successfully`);
        fetchReviews();
      } else {
        toast.error("Failed to update review");
      }
    } catch (error) {
      console.error("Error updating review:", error);
      toast.error("Failed to update review");
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const response = await fetch(`/api/reviews?id=${reviewId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Review deleted successfully");
        fetchReviews();
      } else {
        toast.error("Failed to delete review");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
    }
  };

  const handleHelpfulVote = async (reviewId: string) => {
    // Prevent multiple votes on the same review
    if (votedReviews.has(reviewId)) {
      toast.info("You've already voted on this review");
      return;
    }

    try {
      const response = await fetch("/api/reviews", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: reviewId,
          action: "helpful",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Update the review's helpful count in the local state
        setReviews((prevReviews) =>
          prevReviews.map((review) =>
            review.id === reviewId
              ? { ...review, helpful: data.review.helpful }
              : review
          )
        );
        // Mark this review as voted
        setVotedReviews((prev) => new Set(prev).add(reviewId));
        toast.success("Thank you for your feedback!");
      } else {
        toast.error("Failed to vote. Please try again.");
      }
    } catch (error) {
      console.error("Error voting:", error);
      toast.error("Failed to vote. Please try again.");
    }
  };

  const renderStars = (
    rating: number,
    interactive = false,
    onRatingChange?: (rating: number) => void
  ) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRatingChange?.(star)}
            className={cn(
              "transition-colors",
              interactive
                ? "cursor-pointer hover:text-yellow-400"
                : "cursor-default",
              star <= rating ? "text-yellow-400" : "text-gray-300"
            )}
          >
            <Star className="h-4 w-4 fill-current" />
          </button>
        ))}
      </div>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "PENDING":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "REJECTED":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
        </div>
      </div>
    );
  }

  const approvedReviews = reviews.filter((r) => r.status === "APPROVED");
  const pendingReviews = reviews.filter((r) => r.status === "PENDING");

  // For admin, show all reviews; for users, show only approved
  const displayReviews = isAdmin ? reviews : approvedReviews;

  // Pagination logic
  const totalPages = Math.ceil(displayReviews.length / reviewsPerPage);
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const endIndex = startIndex + reviewsPerPage;
  const currentReviews = displayReviews.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to reviews section
    const reviewsSection = document.getElementById("reviews-section");
    if (reviewsSection) {
      reviewsSection.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Customer Reviews</h3>
          <p className="text-gray-600 mt-1">
            {approvedReviews.length > 0
              ? `${approvedReviews.length} verified review${
                  approvedReviews.length !== 1 ? "s" : ""
                }`
              : "No reviews yet"}
            {isAdmin && pendingReviews.length > 0 && (
              <span className="ml-2 text-yellow-600">
                • {pendingReviews.length} pending
              </span>
            )}
          </p>
        </div>

        {!isAdmin && (
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700">
                <Plus className="h-4 w-4 mr-2" />
                Write a Review
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Write a Review for {packageName}</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={form.location}
                    onChange={(e) =>
                      setForm({ ...form, location: e.target.value })
                    }
                    placeholder="City, Country"
                  />
                </div>

                <div>
                  <Label>Rating *</Label>
                  <div className="flex items-center gap-2 mt-2">
                    {renderStars(form.rating, true, (rating) =>
                      setForm({ ...form, rating })
                    )}
                    <span className="text-sm text-gray-600 ml-2">
                      {form.rating} star{form.rating !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="title">Review Title</Label>
                  <Input
                    id="title"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    placeholder="Summarize your experience"
                  />
                </div>

                <div>
                  <Label htmlFor="comment">Your Review *</Label>
                  <Textarea
                    id="comment"
                    value={form.comment}
                    onChange={(e) =>
                      setForm({ ...form, comment: e.target.value })
                    }
                    placeholder="Share your experience with this package..."
                    rows={4}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum 50 characters. Your review will be published after
                    approval.
                  </p>
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Submit Review
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Reviews List */}
      <div id="reviews-section" className="space-y-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {displayReviews.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  No reviews yet
                </h4>
                <p className="text-gray-600">
                  {isAdmin
                    ? "No reviews have been submitted for this package."
                    : "Be the first to share your experience!"}
                </p>
              </motion.div>
            ) : (
              currentReviews.map((review) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card
                    className={cn(
                      "transition-all duration-200",
                      review.status !== "APPROVED" && "border-l-4",
                      review.status === "PENDING" && "border-l-yellow-400",
                      review.status === "REJECTED" && "border-l-red-400",
                      review.status === "APPROVED" && "border-l-green-400"
                    )}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900">
                                {review.name}
                              </h4>
                              {review.verified && (
                                <span title="Verified Review">
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                </span>
                              )}
                              {isAdmin && getStatusBadge(review.status)}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              {renderStars(review.rating)}
                              {review.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {review.location}
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(
                                  review.createdAt
                                ).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>

                        {isAdmin && review.status === "PENDING" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() =>
                                handleReviewAction(review.id, "approve")
                              }
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleReviewAction(review.id, "reject")
                              }
                              className="border-red-300 text-red-600 hover:bg-red-50"
                            >
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}

                        {isAdmin && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteReview(review.id)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </Button>
                        )}
                      </div>

                      {review.title && (
                        <h5 className="font-medium text-gray-900 mb-2">
                          {review.title}
                        </h5>
                      )}

                      <p className="text-gray-700 leading-relaxed mb-4">
                        {review.comment}
                      </p>

                      {review.images.length > 0 && (
                        <div className="flex gap-2 mb-4">
                          {review.images.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`Review image ${index + 1}`}
                              className="w-20 h-20 object-cover rounded-lg border"
                            />
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <button
                            onClick={() => handleHelpfulVote(review.id)}
                            disabled={votedReviews.has(review.id)}
                            className={cn(
                              "flex items-center gap-1 transition-colors",
                              votedReviews.has(review.id)
                                ? "text-teal-600 cursor-not-allowed"
                                : "hover:text-teal-600 cursor-pointer"
                            )}
                          >
                            <ThumbsUp className="h-4 w-4" />
                            Helpful ({review.helpful})
                          </button>
                        </div>

                        {review.status === "PENDING" && (
                          <div className="flex items-center gap-1 text-yellow-600 text-sm">
                            <Clock className="h-4 w-4" />
                            Awaiting approval
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {displayReviews.length > reviewsPerPage && (
        <div className="flex justify-end mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={cn(
                    "cursor-pointer transition-all duration-200",
                    currentPage === 1 && "pointer-events-none opacity-50"
                  )}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, currentPage + 1))
                  }
                  className={cn(
                    "cursor-pointer transition-all duration-200",
                    currentPage === totalPages &&
                      "pointer-events-none opacity-50"
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
