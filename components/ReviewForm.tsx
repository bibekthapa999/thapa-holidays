"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Send,
  MessageSquare,
  Loader2,
  CheckCircle,
  MapPin,
  Mail,
  User,
  Heart,
  Shield,
  Award,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Package,
  Quote,
  ThumbsUp,
  Globe,
  X,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Testimonial {
  id: string;
  name: string;
  email?: string;
  location: string;
  rating: number;
  comment: string;
  image?: string;
  packageId?: string;
  tripDate?: string;
  featured: boolean;
  createdAt: string;
}

interface TestimonialsResponse {
  testimonials: Testimonial[];
  total: number;
  page: number;
  totalPages: number;
}

interface ReviewForm {
  name: string;
  email: string;
  location: string;
  rating: number;
  comment: string;
}

export default function TestimonialsWithForm() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeFilter, setActiveFilter] = useState<"all" | "recent">("all");
  const [currentSlide, setCurrentSlide] = useState(0);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [form, setForm] = useState<ReviewForm>({
    name: "",
    email: "",
    location: "",
    rating: 5,
    comment: "",
  });

  const ITEMS_PER_PAGE = 6;
  const MOBILE_SLIDES = 3;

  useEffect(() => {
    fetchTestimonials();
  }, [currentPage, activeFilter]);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: ITEMS_PER_PAGE.toString(),
        status: "APPROVED",
        ...(activeFilter === "recent" && { sort: "newest" }),
      });

      const response = await fetch(`/api/testimonials?${params}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch testimonials: ${response.status}`);
      }

      const data: TestimonialsResponse = await response.json();
      setTestimonials(data.testimonials || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      setError("Unable to load testimonials. Please try again later.");
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filter: "all" | "recent") => {
    setActiveFilter(filter);
    setCurrentPage(1);
    setCurrentSlide(0);
  };

  const handleNextSlide = () => {
    if (!testimonials || testimonials.length === 0) return;

    const totalSlides = Math.ceil(testimonials.length / MOBILE_SLIDES);
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      setCurrentSlide(0);
    }
  };

  const handlePrevSlide = () => {
    if (!testimonials || testimonials.length === 0) return;

    const totalSlides = Math.ceil(testimonials.length / MOBILE_SLIDES);
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    } else {
      setCurrentSlide(totalSlides - 1);
    }
  };

  // Review Form Functions
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingClick = (rating: number) => {
    setForm((prev) => ({ ...prev, rating }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.comment) {
      toast.error("Name and review comment are required");
      return;
    }

    if (form.comment.length < 50) {
      toast.error(
        "Please write a more detailed review (minimum 50 characters)"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email || null,
          location: form.location,
          rating: form.rating,
          comment: form.comment,
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setForm({
          name: "",
          email: "",
          location: "",
          rating: 5,
          comment: "",
        });
        toast.success(
          "Thank you for your review! It will be published after approval."
        );
        // Refresh testimonials after successful submission
        setTimeout(() => {
          fetchTestimonials();
        }, 1000);
      } else {
        throw new Error("Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setForm({
      name: "",
      email: "",
      location: "",
      rating: 5,
      comment: "",
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={cn(
              "h-4 w-4 sm:h-5 sm:w-5",
              i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            )}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        year: "numeric",
      }).format(date);
    } catch (error) {
      return "Recent";
    }
  };

  const renderSkeleton = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="border-0 shadow-lg bg-white">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-5 w-5" />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const getVisibleTestimonials = () => {
    if (!testimonials || testimonials.length === 0) return [];
    const startIndex = currentSlide * MOBILE_SLIDES;
    const endIndex = (currentSlide + 1) * MOBILE_SLIDES;
    return testimonials.slice(startIndex, endIndex);
  };

  const visibleTestimonials = getVisibleTestimonials();

  return (
    <>
      {/* Testimonials Display Section */}
      <section className="relative py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-white via-gray-50/50 to-white overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-teal-500/5 to-yellow-500/5 -skew-y-3" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-bl from-teal-500/10 to-yellow-500/10 rounded-full blur-3xl" />
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-tr from-yellow-500/10 to-teal-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with Add Review Button */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 lg:mb-16"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500/10 to-yellow-500/10 border border-teal-200/50 rounded-full text-sm font-medium mb-4 backdrop-blur-sm"
            >
              <Sparkles className="h-4 w-4 text-teal-600" />
              <span className="bg-gradient-to-r from-teal-600 to-yellow-600 bg-clip-text text-transparent font-semibold">
                Traveler Stories
              </span>
              <Sparkles className="h-4 w-4 text-yellow-600" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
            >
              <span className="bg-gradient-to-r from-teal-600 to-yellow-600 bg-clip-text text-transparent">
                Traveler Experiences
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-lg text-gray-600 max-w-3xl mx-auto mb-8"
            >
              Discover what our travelers have to say about their unforgettable
              journeys with Thapa Holidays
            </motion.p>

            {/* Add Review Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className="group bg-gradient-to-r from-teal-500 to-yellow-500 hover:from-teal-600 hover:to-yellow-600 text-white rounded-full px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform" />
                    Share Your Experience
                  </Button>
                </DialogTrigger>
                <DialogContent
                  className="max-w-[95vw] sm:max-w-2xl lg:max-w-4xl max-h-[90vh] p-0 overflow-hidden"
                  showCloseButton={false}
                >
                  <ReviewFormModal
                    form={form}
                    isSubmitting={isSubmitting}
                    isSubmitted={isSubmitted}
                    handleChange={handleChange}
                    handleRatingClick={handleRatingClick}
                    handleSubmit={handleSubmit}
                    resetForm={resetForm}
                    setIsModalOpen={setIsModalOpen}
                  />
                </DialogContent>
              </Dialog>
            </motion.div>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="mb-12"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-3 bg-white/80 backdrop-blur-sm border border-gray-100 rounded-xl p-4 shadow-sm">
                <div className="p-2 bg-teal-100 rounded-lg">
                  <Shield className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Verified Reviews
                  </p>
                  <p className="text-xs text-gray-600">100% Authentic</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 bg-white/80 backdrop-blur-sm border border-gray-100 rounded-xl p-4 shadow-sm">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <ThumbsUp className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    5-Star Rated
                  </p>
                  <p className="text-xs text-gray-600">Excellent Service</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 bg-white/80 backdrop-blur-sm border border-gray-100 rounded-xl p-4 shadow-sm">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Globe className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Global Travelers
                  </p>
                  <p className="text-xs text-gray-600">Worldwide Experiences</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Filter Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap justify-center gap-3 mb-8"
          >
            <Button
              variant={activeFilter === "all" ? "default" : "outline"}
              onClick={() => handleFilterChange("all")}
              className="rounded-full"
            >
              All Reviews
            </Button>
            <Button
              variant={activeFilter === "recent" ? "default" : "outline"}
              onClick={() => handleFilterChange("recent")}
              className="rounded-full"
            >
              Most Recent
            </Button>
          </motion.div>

          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-3 bg-red-50 text-red-700 rounded-xl">
                <span>{error}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={fetchTestimonials}
                  className="ml-2"
                >
                  Retry
                </Button>
              </div>
            </motion.div>
          )}

          {/* Loading State */}
          {loading && renderSkeleton()}

          {/* Testimonials Display */}
          {!loading && !error && testimonials && testimonials.length > 0 ? (
            <>
              {/* Mobile Carousel */}
              <div className="md:hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {visibleTestimonials.map((testimonial) => (
                      <TestimonialCard
                        key={testimonial.id}
                        testimonial={testimonial}
                        renderStars={renderStars}
                        formatDate={formatDate}
                      />
                    ))}
                  </motion.div>
                </AnimatePresence>

                {/* Carousel Controls */}
                {testimonials.length > MOBILE_SLIDES && (
                  <div className="flex items-center justify-center gap-4 mt-8">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handlePrevSlide}
                      className="rounded-full"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex gap-2">
                      {[
                        ...Array(
                          Math.ceil(testimonials.length / MOBILE_SLIDES)
                        ),
                      ].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentSlide(i)}
                          className={cn(
                            "w-2 h-2 rounded-full transition-all",
                            i === currentSlide
                              ? "bg-teal-500 w-6"
                              : "bg-gray-300"
                          )}
                        />
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleNextSlide}
                      className="rounded-full"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Desktop Grid */}
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map((testimonial) => (
                  <TestimonialCard
                    key={testimonial.id}
                    testimonial={testimonial}
                    renderStars={renderStars}
                    formatDate={formatDate}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="rounded-full"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <div className="flex items-center gap-2">
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      const pageNumber = i + 1;
                      return (
                        <Button
                          key={pageNumber}
                          variant={
                            currentPage === pageNumber ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setCurrentPage(pageNumber)}
                          className="rounded-full w-10 h-10"
                        >
                          {pageNumber}
                        </Button>
                      );
                    })}
                    {totalPages > 5 && (
                      <>
                        <span className="px-2">...</span>
                        <Button
                          variant={
                            currentPage === totalPages ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setCurrentPage(totalPages)}
                          className="rounded-full w-10 h-10"
                        >
                          {totalPages}
                        </Button>
                      </>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="rounded-full"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Results Count */}
              <div className="text-center mt-8 text-gray-600 text-sm">
                Showing {testimonials.length} of many traveler experiences
              </div>
            </>
          ) : !loading && !error ? (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="inline-flex flex-col items-center gap-4 max-w-md mx-auto">
                <div className="p-4 bg-gray-100 rounded-full">
                  <Quote className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No testimonials yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Be the first to share your travel experience!
                  </p>
                </div>
              </div>
            </motion.div>
          ) : null}
        </div>
      </section>
    </>
  );
}

// Review Form Modal Component
interface ReviewFormModalProps {
  form: ReviewForm;
  isSubmitting: boolean;
  isSubmitted: boolean;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleRatingClick: (rating: number) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
  setIsModalOpen: (open: boolean) => void;
}

function ReviewFormModal({
  form,
  isSubmitting,
  isSubmitted,
  handleChange,
  handleRatingClick,
  handleSubmit,
  resetForm,
  setIsModalOpen,
}: ReviewFormModalProps) {
  // Success state animation variants
  const successVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
    },
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: 0.4 },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: 0.6 },
    },
  };

  if (isSubmitted) {
    return (
      <div className="relative bg-gradient-to-b from-white via-gray-50/50 to-white p-8">
        <motion.div
          variants={successVariants}
          initial="hidden"
          animate="visible"
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="text-center"
        >
          <div className="relative">
            {/* Success gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5" />

            <div className="relative p-8 sm:p-12">
              <motion.div
                variants={iconVariants}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: 0.2,
                }}
                className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 border-4 border-white shadow-lg"
              >
                <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12 text-green-600" />
              </motion.div>

              <motion.div variants={contentVariants}>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                  Thank You for Your Review! 🎉
                </h3>
                <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base max-w-2xl mx-auto">
                  Your review has been submitted successfully and will be
                  published after our team reviews it. We truly appreciate your
                  feedback and value your contribution to our travel community!
                </p>
              </motion.div>

              <motion.div
                variants={buttonVariants}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button
                  onClick={resetForm}
                  size="lg"
                  className="group relative bg-gradient-to-r from-teal-500 to-yellow-500 hover:from-teal-600 hover:to-yellow-600 text-white rounded-full px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    Write Another Review
                    <Heart className="h-5 w-5 ml-2 group-hover:scale-110 transition-transform" />
                  </span>
                </Button>
                <Button
                  onClick={() => setIsModalOpen(false)}
                  variant="outline"
                  size="lg"
                  className="rounded-full"
                >
                  Close
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-b from-white via-gray-50/50 to-white">
      {/* Close button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-10"
        onClick={() => setIsModalOpen(false)}
      >
        <X className="h-4 w-4" />
      </Button>

      {/* Header */}
      <DialogHeader className="border-b border-gray-100 p-6">
        <DialogTitle className="flex items-center gap-3 text-xl sm:text-2xl">
          <div className="p-2 bg-gradient-to-r from-teal-500 to-yellow-500 rounded-lg">
            <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <span className="bg-gradient-to-r from-teal-600 to-yellow-600 bg-clip-text text-transparent">
            Share Your Experience
          </span>
        </DialogTitle>
        <p className="text-gray-600 text-sm mt-2">
          Had an amazing trip with us? We'd love to hear about your experience!
        </p>
      </DialogHeader>

      {/* Form Content */}
      <div className="p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-[calc(90vh-80px)]">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 sm:space-y-6 lg:space-y-8"
        >
          {/* Name and Email - Responsive grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2 sm:space-y-3">
              <Label
                htmlFor="modal-name"
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <User className="h-4 w-4 text-teal-500" />
                Full Name *
              </Label>
              <div className="relative">
                <Input
                  id="modal-name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="pl-10 bg-gray-50 border-gray-200 focus:border-teal-500 focus:ring-teal-500 text-sm sm:text-base"
                  required
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <Label
                htmlFor="modal-email"
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <Mail className="h-4 w-4 text-teal-500" />
                Email (Optional)
              </Label>
              <div className="relative">
                <Input
                  id="modal-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="pl-10 bg-gray-50 border-gray-200 focus:border-teal-500 focus:ring-teal-500 text-sm sm:text-base"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2 sm:space-y-3">
            <Label
              htmlFor="modal-location"
              className="text-sm font-medium text-gray-700 flex items-center gap-2"
            >
              <MapPin className="h-4 w-4 text-teal-500" />
              Your Location
            </Label>
            <div className="relative">
              <Input
                id="modal-location"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="City, State, Country"
                className="pl-10 bg-gray-50 border-gray-200 focus:border-teal-500 focus:ring-teal-500 text-sm sm:text-base"
              />
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-3 sm:space-y-4">
            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Star className="h-4 w-4 text-teal-500 fill-teal-500" />
              Your Rating *
            </Label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="flex gap-1 sm:gap-2 justify-center sm:justify-start">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="focus:outline-none"
                  >
                    <Star
                      className={cn(
                        "h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 transition-all duration-200",
                        star <= form.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300 hover:text-yellow-200"
                      )}
                    />
                  </motion.button>
                ))}
              </div>
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xs sm:text-sm lg:text-base text-gray-600 font-medium bg-gradient-to-r from-teal-50 to-yellow-50 px-3 py-1 sm:px-4 sm:py-2 rounded-full border border-gray-100 text-center"
              >
                {form.rating} out of 5 stars
              </motion.span>
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2 sm:space-y-3">
            <Label
              htmlFor="modal-comment"
              className="text-sm font-medium text-gray-700"
            >
              Your Review *
            </Label>
            <Textarea
              id="modal-comment"
              name="comment"
              value={form.comment}
              onChange={handleChange}
              placeholder="Tell us about your experience with Thapa Holidays. What made your trip special? How was our service?"
              rows={4}
              className="min-h-[120px] sm:min-h-[150px] resize-none bg-gray-50 border-gray-200 focus:border-teal-500 focus:ring-teal-500 text-sm sm:text-base overflow-hidden break-words"
              style={{ wordWrap: "break-word", overflowWrap: "break-word" }}
              required
            />
            <p className="text-xs text-gray-500">
              {form.comment.length < 50 ? (
                <span className="text-amber-600">
                  Minimum 50 characters required ({50 - form.comment.length}{" "}
                  more)
                </span>
              ) : (
                <span className="text-green-600">
                  ✓ Great! Your review has {form.comment.length} characters
                </span>
              )}
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-2 sm:pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || form.comment.length < 50}
              size="lg"
              className="group relative w-full bg-gradient-to-r from-teal-500 to-yellow-500 hover:from-teal-600 hover:to-yellow-600 text-white rounded-full px-6 sm:px-8 py-4 sm:py-6 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {isSubmitting ? (
                <span className="relative z-10 flex items-center justify-center">
                  <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2 animate-spin" />
                  Submitting Review...
                </span>
              ) : (
                <span className="relative z-10 flex items-center justify-center">
                  <Send className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:translate-x-1 transition-transform" />
                  Submit Your Review
                </span>
              )}
            </Button>
          </div>

          {/* Trust Badges and Note */}
          <div className="space-y-4 sm:space-y-6">
            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 bg-gray-50 rounded-lg p-2 sm:p-3">
                <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-teal-500" />
                <span className="font-medium">Secure Submission</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 bg-gray-50 rounded-lg p-2 sm:p-3">
                <Award className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
                <span className="font-medium">Quality Checked</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 bg-gray-50 rounded-lg p-2 sm:p-3">
                <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-rose-500" />
                <span className="font-medium">Real Experiences</span>
              </div>
            </div>

            {/* Note */}
            <div className="text-xs sm:text-sm text-gray-600 bg-gradient-to-r from-teal-50/50 to-yellow-50/50 rounded-xl p-3 sm:p-4 lg:p-6 border border-teal-100/50">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 text-teal-500" />
                Important Notes:
              </h4>
              <ul className="space-y-1 sm:space-y-1.5 text-xs sm:text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-teal-500 mt-0.5">•</span>
                  <span>
                    Your review will be published after our team approves it
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-500 mt-0.5">•</span>
                  <span>
                    Please be honest and constructive in your feedback
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-500 mt-0.5">•</span>
                  <span>
                    Reviews help other travelers make informed decisions
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-500 mt-0.5">•</span>
                  <span>We appreciate detailed and genuine experiences</span>
                </li>
              </ul>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// Testimonial Card Component
interface TestimonialCardProps {
  testimonial: Testimonial;
  renderStars: (rating: number) => React.ReactNode;
  formatDate: (dateString: string) => string;
}

function TestimonialCard({
  testimonial,
  renderStars,
  formatDate,
}: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white group">
        <CardContent className="p-6 h-full flex flex-col">
          {/* Quote Icon */}
          <div className="mb-4">
            <Quote className="h-6 w-6 text-teal-500/30 group-hover:text-teal-500/50 transition-colors" />
          </div>

          {/* Comment */}
          <p className="text-gray-700 mb-6 flex-grow line-clamp-4">
            {testimonial.comment}
          </p>

          {/* Rating */}
          <div className="mb-6">{renderStars(testimonial.rating)}</div>

          {/* User Info */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
            <div className="flex-shrink-0">
              {testimonial.image ? (
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-teal-100 to-yellow-100 flex items-center justify-center">
                  <span className="text-lg font-semibold text-gray-700">
                    {testimonial.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-grow">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900">
                  {testimonial.name}
                </h4>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-gray-600 mt-1">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{testimonial.location}</span>
                </div>

                {testimonial.tripDate && (
                  <div className="hidden sm:flex items-center gap-1">
                    <span className="text-gray-300">•</span>
                    <Calendar className="h-3 w-3" />
                    <span>{testimonial.tripDate}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              {testimonial.packageId && (
                <>
                  <Package className="h-3 w-3" />
                  <span className="truncate">
                    Package{" "}
                    {testimonial.packageId?.slice?.(0, 8) ||
                      testimonial.packageId}
                  </span>
                </>
              )}
            </div>
            <span>{formatDate(testimonial.createdAt)}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
