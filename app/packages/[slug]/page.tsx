"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Clock,
  Users,
  Star,
  Calendar,
  Phone,
  Mail,
  User,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Loader2,
  Heart,
  Share2,
  MessageCircle,
  ArrowLeft,
  BedDouble,
  HelpCircle,
  FileText,
  Route,
  Printer,
  Sparkles,
  Tag,
  Shield,
  Award,
  Globe,
  TrendingUp,
  MessageSquare,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import PackageReviews from "@/components/PackageReviews";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { generatePackagePDF } from "@/lib/pdfGenerator";

interface Package {
  id: string;
  name: string;
  slug: string;
  destinationId?: string;
  destinationName: string;
  location: string;
  country: string;
  image?: string;
  images: string[];
  price: number;
  originalPrice?: number;
  duration: string;
  groupSize: string;
  rating: number;
  reviews: number;
  description: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary?: {
    day: number;
    title: string;
    description: string;
    meals?: string;
    accommodation?: string;
  }[];
  accommodations?: {
    id: string;
    destinationId?: string;
    destination?: {
      id: string;
      name: string;
      slug: string;
    };
    hotelName: string;
    roomType: string;
    hotelCategory: string;
    nights: number;
  }[];
  faqs?: { question: string; answer: string }[];
  policies?: {
    cancellation?: string;
    payment?: string;
    health?: string;
    baggage?: string;
    insurance?: string;
  };
  bestTime?: string;
  difficulty: string;
  type: string;
  badge?: string;
  featured: boolean;
  status: string;
}

interface EnquiryForm {
  name: string;
  email: string;
  phone: string;
  travelDate: string;
  travelTime: string;
  adults: number;
  children: number;
  rooms: number;
  message: string;
}

export default function PackageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [packageData, setPackageData] = useState<Package | null>(null);
  const [relatedPackages, setRelatedPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [enquiryForm, setEnquiryForm] = useState<EnquiryForm>({
    name: "",
    email: "",
    phone: "",
    travelDate: "",
    travelTime: "",
    adults: 1,
    children: 0,
    rooms: 1,
    message: "",
  });

  useEffect(() => {
    if (slug) {
      fetchPackage();
    }
  }, [slug]);

  const fetchPackage = async () => {
    try {
      const response = await fetch(`/api/packages/${slug}`);
      if (!response.ok) throw new Error("Package not found");
      const data = await response.json();
      setPackageData(data);

      // Fetch related packages from same destination
      if (data.destinationId) {
        const relatedRes = await fetch(
          `/api/packages?status=ACTIVE&destinationId=${data.destinationId}&limit=4`
        );
        if (relatedRes.ok) {
          const relatedData = await relatedRes.json();
          setRelatedPackages(
            relatedData.filter((p: Package) => p.id !== data.id).slice(0, 3)
          );
        }
      }
    } catch (error) {
      console.error("Error fetching package:", error);
      toast.error("Package not found");
    } finally {
      setLoading(false);
    }
  };

  const allImages = packageData
    ? ([packageData.image, ...packageData.images].filter(Boolean) as string[])
    : [];

  const nextImage = useCallback(() => {
    if (allImages.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    }
  }, [allImages.length]);

  const prevImage = useCallback(() => {
    if (allImages.length > 1) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + allImages.length) % allImages.length
      );
    }
  }, [allImages.length]);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (allImages.length > 1) {
      const interval = setInterval(nextImage, 5000);
      return () => clearInterval(interval);
    }
  }, [allImages.length, nextImage]);

  const handleEnquiryChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEnquiryForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/packages/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...enquiryForm,
          packageId: packageData?.id,
          packageName: packageData?.name,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit enquiry");

      toast.success("Enquiry submitted successfully! We'll contact you soon.");
      setEnquiryForm({
        name: "",
        email: "",
        phone: "",
        travelDate: "",
        travelTime: "",
        adults: 1,
        children: 0,
        rooms: 1,
        message: "",
      });
    } catch (error) {
      toast.error("Failed to submit enquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: packageData?.name || "Amazing Package",
      text: `Check out this amazing ${packageData?.duration} trip to ${packageData?.destinationName}!`,
      url: window.location.href,
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast.error("Failed to share");
    }
  };

  const handlePrint = () => {
    const printContent = document.getElementById("package-details-print");
    if (printContent) {
      const newWin = window.open("");
      newWin?.document.write(`
        <html>
          <head>
            <title>${packageData?.name || "Package Details"}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .print-header { text-align: center; margin-bottom: 30px; }
              .print-section { margin-bottom: 20px; }
              .print-section h3 { color: #0f766e; border-bottom: 2px solid #0f766e; padding-bottom: 5px; }
              .print-list { list-style-type: disc; margin-left: 20px; }
              .print-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
              @media print { .no-print { display: none; } }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      newWin?.document.close();
      newWin?.print();
      newWin?.close();
    }
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  const handleExportPDF = async () => {
    if (!packageData) return;

    try {
      toast.loading("Generating PDF with images...");
      await generatePackagePDF(packageData);
      toast.dismiss();
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.dismiss();
      toast.error("Failed to generate PDF");
    }
  };

  const LoadingSkeleton = () => (
    <div className="min-h-screen flex items-center justify-center bg-white pt-24 lg:pt-32">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mb-4"></div>
        <p className="text-gray-600">Loading package details...</p>
      </div>
    </div>
  );

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!packageData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white pt-24 lg:pt-32">
        <div className="text-center max-w-md px-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Package Not Found
          </h1>
          <p className="mt-2 text-gray-600">
            The package you're looking for doesn't exist.
          </p>
          <Button
            onClick={() => router.push("/packages")}
            className="mt-4 bg-gradient-to-r from-teal-500 to-yellow-500 hover:from-teal-600 hover:to-yellow-600 text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Packages
          </Button>
        </div>
      </div>
    );
  }

  const discount = packageData.originalPrice
    ? Math.round(
        ((packageData.originalPrice - packageData.price) /
          packageData.originalPrice) *
          100
      )
    : 0;

  const getTypeColor = (type: string) => {
    switch (type?.toUpperCase()) {
      case "LUXURY":
        return "bg-gradient-to-r from-purple-500 to-pink-500 text-white";
      case "PREMIUM":
        return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white";
      case "BUDGET":
        return "bg-gradient-to-r from-green-500 to-emerald-500 text-white";
      default:
        return "bg-gradient-to-r from-teal-500 to-yellow-500 text-white";
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-teal-500/5 to-yellow-500/5 -skew-y-3" />

      <div className="relative">
        {/* Hero Image Carousel */}
        <div className="relative h-[50vh] min-h-[400px] max-h-[500px] bg-gray-900 mt-20 lg:mt-32">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              {allImages[currentImageIndex] ? (
                <Image
                  src={allImages[currentImageIndex]}
                  alt={packageData.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <Globe className="h-20 w-20 text-gray-600" />
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Back Button */}
          <div className="absolute top-6 left-6 z-10">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-0"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>

          {/* Share & Wishlist & Export */}
          <div className="absolute top-6 right-6 z-10 flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleExportPDF}
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-0"
              title="Export to PDF"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-0"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleWishlist}
              className={cn(
                "backdrop-blur-sm border-0",
                isWishlisted
                  ? "bg-rose-500/20 hover:bg-rose-600/20 text-rose-300"
                  : "bg-white/10 hover:bg-white/20 text-white"
              )}
            >
              <Heart
                className={cn("h-4 w-4", isWishlisted && "fill-rose-500")}
              />
            </Button>
          </div>

          {/* Package Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 z-10">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    {packageData.badge && (
                      <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                        {packageData.badge}
                      </Badge>
                    )}
                    <Badge
                      className={cn("border-0", getTypeColor(packageData.type))}
                    >
                      {packageData.type}
                    </Badge>
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                    {packageData.name}
                  </h1>
                  <div className="flex items-center gap-4 text-white/80 text-sm">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {packageData.location}, {packageData.country}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{packageData.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{packageData.groupSize}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {packageData.originalPrice && discount > 0 && (
                    <div className="flex items-center justify-end gap-2 mb-1">
                      <span className="text-white/70 text-sm line-through">
                        ₹{packageData.originalPrice.toLocaleString()}
                      </span>
                      <Badge className="bg-red-500 text-white border-0">
                        {discount}% OFF
                      </Badge>
                    </div>
                  )}
                  <div className="text-3xl lg:text-4xl font-bold text-white">
                    ₹{packageData.price.toLocaleString()}
                  </div>
                  <p className="text-white/70 text-sm">per person</p>
                </div>
              </div>
            </div>
          </div>

          {/* Image Navigation */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white transition-colors"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* Image Indicators */}
              <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                {allImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex
                        ? "bg-white w-8"
                        : "bg-white/50 hover:bg-white/75"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Package Details */}
            <div className="lg:col-span-2">
              <div id="package-details-print">
                {/* Rating & Reviews */}
                <div className="flex flex-wrap items-center gap-4 mb-8 p-4 bg-gradient-to-r from-teal-50 to-yellow-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                      <span className="ml-1 text-lg font-bold text-gray-900">
                        {packageData.rating}
                      </span>
                    </div>
                    <span className="text-gray-600">
                      ({packageData.reviews} reviews)
                    </span>
                  </div>
                  <Separator orientation="vertical" className="h-6" />
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-teal-500" />
                    <span className="text-gray-900 font-medium">
                      Popular Choice
                    </span>
                  </div>
                  <Separator orientation="vertical" className="h-6" />
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-teal-500" />
                    <span className="text-gray-900 font-medium">
                      Best Price Guarantee
                    </span>
                  </div>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="description" className="space-y-6">
                  <TabsList className="bg-white border border-gray-200 w-full grid grid-cols-2 sm:grid-cols-6 h-auto p-1 rounded-lg">
                    <TabsTrigger
                      value="description"
                      className="flex items-center gap-2 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-yellow-500 data-[state=active]:text-white rounded-md"
                    >
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">Description</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="itinerary"
                      className="flex items-center gap-2 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-yellow-500 data-[state=active]:text-white rounded-md"
                    >
                      <Route className="h-4 w-4" />
                      <span className="text-sm">Itinerary</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="accommodations"
                      className="flex items-center gap-2 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-yellow-500 data-[state=active]:text-white rounded-md"
                    >
                      <BedDouble className="h-4 w-4" />
                      <span className="text-sm">Stay</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="reviews"
                      className="flex items-center gap-2 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-yellow-500 data-[state=active]:text-white rounded-md"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span className="text-sm">Reviews</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="faq"
                      className="flex items-center gap-2 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-yellow-500 data-[state=active]:text-white rounded-md"
                    >
                      <HelpCircle className="h-4 w-4" />
                      <span className="text-sm">FAQ</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="policy"
                      className="flex items-center gap-2 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-yellow-500 data-[state=active]:text-white rounded-md"
                    >
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">Policy</span>
                    </TabsTrigger>
                  </TabsList>

                  {/* Description Tab */}
                  <TabsContent value="description" className="space-y-6">
                    <Card className="border-0 shadow-lg">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                          About This Package
                        </h3>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                          {packageData.description}
                        </p>
                      </CardContent>
                    </Card>

                    {/* Highlights */}
                    {packageData.highlights?.length > 0 && (
                      <Card className="border-0 shadow-lg">
                        <CardContent className="p-6">
                          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-yellow-500" />
                            Package Highlights
                          </h3>
                          <div className="grid sm:grid-cols-2 gap-3">
                            {packageData.highlights.map((highlight, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-teal-50/50 to-yellow-50/50 hover:from-teal-100/50 hover:to-yellow-100/50 transition-all"
                              >
                                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-teal-500 to-yellow-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <Check className="h-3 w-3 text-white" />
                                </div>
                                <span className="text-gray-800 font-medium">
                                  {highlight}
                                </span>
                              </motion.div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Inclusions & Exclusions */}
                    <div className="grid md:grid-cols-2 gap-6">
                      {packageData.inclusions?.length > 0 && (
                        <Card className="border-0 shadow-lg">
                          <CardContent className="p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                              <Check className="h-5 w-5 text-green-500" />
                              What's Included
                            </h3>
                            <ul className="space-y-3">
                              {packageData.inclusions.map((item, index) => (
                                <motion.li
                                  key={index}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-green-50 transition-colors"
                                >
                                  <Check className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                                  <span className="text-gray-700">{item}</span>
                                </motion.li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      )}

                      {packageData.exclusions?.length > 0 && (
                        <Card className="border-0 shadow-lg">
                          <CardContent className="p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                              <X className="h-5 w-5 text-red-500" />
                              What's Not Included
                            </h3>
                            <ul className="space-y-3">
                              {packageData.exclusions.map((item, index) => (
                                <motion.li
                                  key={index}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                >
                                  <X className="h-4 w-4 text-red-600 mt-1 flex-shrink-0" />
                                  <span className="text-gray-700">{item}</span>
                                </motion.li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </TabsContent>

                  {/* Itinerary Tab */}
                  <TabsContent value="itinerary">
                    <Card className="border-0 shadow-lg">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                          <Route className="h-5 w-5 text-teal-500" />
                          Day-by-Day Itinerary
                        </h3>
                        {packageData.itinerary &&
                        packageData.itinerary.length > 0 ? (
                          <div className="space-y-4">
                            {packageData.itinerary.map((day, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="relative pl-8 pb-6 border-l-2 border-teal-300 last:border-0 last:pb-0"
                              >
                                <div className="absolute left-0 top-0 w-8 h-8 -translate-x-1/2 rounded-full bg-gradient-to-r from-teal-500 to-yellow-500 text-white text-sm flex items-center justify-center font-bold shadow-lg">
                                  {day.day}
                                </div>
                                <div className="bg-gradient-to-r from-teal-50/50 to-yellow-50/50 rounded-xl p-5 ml-4 border border-teal-100">
                                  <h4 className="font-bold text-gray-900 mb-2 text-lg">
                                    Day {day.day}: {day.title}
                                  </h4>
                                  <p className="text-gray-600 leading-relaxed">
                                    {day.description}
                                  </p>
                                  {(day.meals || day.accommodation) && (
                                    <div className="flex flex-wrap gap-4 mt-4 text-sm">
                                      {day.meals && (
                                        <span className="text-teal-600 bg-teal-50 px-3 py-1 rounded-full">
                                          🍽️ {day.meals}
                                        </span>
                                      )}
                                      {day.accommodation && (
                                        <span className="text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                                          🏨 {day.accommodation}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <Route className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">
                              Detailed itinerary will be shared upon enquiry.
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Accommodations Tab */}
                  <TabsContent value="accommodations">
                    <Card className="border-0 shadow-lg">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                          <BedDouble className="h-5 w-5 text-teal-500" />
                          Accommodation Details
                        </h3>
                        {packageData.accommodations &&
                        packageData.accommodations.length > 0 ? (
                          <div className="grid gap-4">
                            {packageData.accommodations.map((hotel, index) => (
                              <motion.div
                                key={hotel.id || index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white border border-gray-200 rounded-xl p-5 hover:border-teal-300 transition-all"
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex-1">
                                    <h4 className="font-bold text-gray-900 text-lg">
                                      {hotel.hotelName}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-2">
                                      <Badge className="bg-gradient-to-r from-teal-500 to-yellow-500 text-white border-0">
                                        {hotel.hotelCategory}
                                      </Badge>
                                      <Badge variant="outline" className="text-gray-600">
                                        {hotel.roomType}
                                      </Badge>
                                      <Badge variant="secondary" className="text-gray-700">
                                        {hotel.nights} {hotel.nights === 1 ? 'Night' : 'Nights'}
                                      </Badge>
                                    </div>
                                    {hotel.destination && (
                                      <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        {hotel.destination.name}
                                      </p>
                                    )}
                                  </div>
                                  <BedDouble className="h-6 w-6 text-teal-600" />
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <BedDouble className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">
                              Accommodation details will be shared upon enquiry
                              based on your preferences.
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Reviews Tab */}
                  <TabsContent value="reviews">
                    <PackageReviews
                      packageId={packageData.id}
                      packageName={packageData.name}
                      isAdmin={false}
                    />
                  </TabsContent>

                  {/* FAQ Tab */}
                  <TabsContent value="faq">
                    <Card className="border-0 shadow-lg">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                          <HelpCircle className="h-5 w-5 text-teal-500" />
                          Frequently Asked Questions
                        </h3>
                        {packageData.faqs && packageData.faqs.length > 0 ? (
                          <Accordion
                            type="single"
                            collapsible
                            className="space-y-2"
                          >
                            {packageData.faqs.map((faq, index) => (
                              <AccordionItem
                                key={index}
                                value={`faq-${index}`}
                                className="border border-gray-200 rounded-lg px-5 data-[state=open]:border-teal-200 data-[state=open]:bg-teal-50/50"
                              >
                                <AccordionTrigger className="text-left hover:no-underline py-4">
                                  <span className="font-medium text-gray-900">
                                    {faq.question}
                                  </span>
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-600 pb-4 pt-2">
                                  {faq.answer}
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                          </Accordion>
                        ) : (
                          <div className="text-center py-12">
                            <HelpCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">
                              Have questions? Feel free to contact us using the
                              enquiry form.
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Policy Tab */}
                  <TabsContent value="policy">
                    <Card className="border-0 shadow-lg">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                          <Shield className="h-5 w-5 text-teal-500" />
                          Terms & Policies
                        </h3>
                        {packageData.policies &&
                        typeof packageData.policies === "object" &&
                        Object.keys(packageData.policies).length > 0 ? (
                          <Accordion
                            type="single"
                            collapsible
                            className="space-y-2"
                          >
                            {Object.entries(packageData.policies).map(
                              ([key, value], index) => {
                                const policyTitles = {
                                  cancellation: "Cancellation Policy",
                                  payment: "Payment Policy",
                                  health: "Health & Safety",
                                  baggage: "Baggage Policy",
                                  insurance: "Insurance Policy",
                                };
                                return (
                                  <AccordionItem
                                    key={index}
                                    value={`policy-${index}`}
                                    className="border border-gray-200 rounded-lg px-5 data-[state=open]:border-teal-200 data-[state=open]:bg-teal-50/50"
                                  >
                                    <AccordionTrigger className="text-left hover:no-underline py-4">
                                      <span className="font-medium text-gray-900">
                                        {policyTitles[
                                          key as keyof typeof policyTitles
                                        ] || key}
                                      </span>
                                    </AccordionTrigger>
                                    <AccordionContent className="text-gray-600 pb-4 pt-2 whitespace-pre-line">
                                      {value as string}
                                    </AccordionContent>
                                  </AccordionItem>
                                );
                              }
                            )}
                          </Accordion>
                        ) : (
                          <div className="space-y-6 text-gray-600">
                            <div className="p-4 bg-gray-50 rounded-lg">
                              <h4 className="font-bold text-gray-900 mb-2">
                                Booking Policy
                              </h4>
                              <p>
                                A 25% advance payment is required to confirm
                                your booking. Balance payment is due 15 days
                                before the trip start date.
                              </p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                              <h4 className="font-bold text-gray-900 mb-2">
                                Cancellation Policy
                              </h4>
                              <ul className="list-disc pl-5 space-y-2">
                                <li>
                                  30+ days before departure: 10% cancellation
                                  fee
                                </li>
                                <li>
                                  15-29 days before departure: 25% cancellation
                                  fee
                                </li>
                                <li>
                                  7-14 days before departure: 50% cancellation
                                  fee
                                </li>
                                <li>Less than 7 days: No refund</li>
                              </ul>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                              <h4 className="font-bold text-gray-900 mb-2">
                                Important Notes
                              </h4>
                              <p>
                                Prices are subject to change during peak season.
                                Personal expenses are not included in the
                                package price.
                              </p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* Right Column - Enquiry Form & Details */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Quick Details Card */}
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Duration</span>
                        <span className="font-medium">
                          {packageData.duration}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Group Size</span>
                        <span className="font-medium">
                          {packageData.groupSize}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Difficulty</span>
                        <span className="font-medium">
                          {packageData.difficulty}
                        </span>
                      </div>
                      {packageData.bestTime && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Best Time</span>
                          <span className="font-medium">
                            {packageData.bestTime}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Enquiry Form */}
                <Card className="border-0 shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-teal-600 to-yellow-500 p-5">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <MessageCircle className="h-5 w-5" />
                      Send Enquiry
                    </h3>
                    <p className="text-teal-100 text-sm mt-1">
                      Get personalized quotes and assistance
                    </p>
                  </div>
                  <CardContent className="p-5">
                    <form onSubmit={handleEnquirySubmit} className="space-y-4">
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          name="name"
                          value={enquiryForm.name}
                          onChange={handleEnquiryChange}
                          placeholder="Full Name *"
                          className="pl-10 bg-gray-50 border-gray-200 focus:border-teal-500"
                          required
                        />
                      </div>

                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          name="phone"
                          value={enquiryForm.phone}
                          onChange={handleEnquiryChange}
                          placeholder="Phone Number *"
                          className="pl-10 bg-gray-50 border-gray-200 focus:border-teal-500"
                          required
                        />
                      </div>

                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          name="email"
                          type="email"
                          value={enquiryForm.email}
                          onChange={handleEnquiryChange}
                          placeholder="Email Address *"
                          className="pl-10 bg-gray-50 border-gray-200 focus:border-teal-500"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            name="travelDate"
                            type="date"
                            value={enquiryForm.travelDate}
                            onChange={handleEnquiryChange}
                            className="pl-10 bg-gray-50 border-gray-200 focus:border-teal-500"
                          />
                        </div>
                        <Input
                          name="travelTime"
                          type="time"
                          value={enquiryForm.travelTime}
                          onChange={handleEnquiryChange}
                          placeholder="Time"
                          className="bg-gray-50 border-gray-200 focus:border-teal-500"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">
                            Adults
                          </label>
                          <Input
                            name="adults"
                            type="number"
                            min="1"
                            max="20"
                            value={enquiryForm.adults}
                            onChange={handleEnquiryChange}
                            className="bg-gray-50 border-gray-200 focus:border-teal-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">
                            Children
                          </label>
                          <Input
                            name="children"
                            type="number"
                            min="0"
                            max="10"
                            value={enquiryForm.children}
                            onChange={handleEnquiryChange}
                            className="bg-gray-50 border-gray-200 focus:border-teal-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">
                            Rooms
                          </label>
                          <Input
                            name="rooms"
                            type="number"
                            min="1"
                            max="10"
                            value={enquiryForm.rooms}
                            onChange={handleEnquiryChange}
                            className="bg-gray-50 border-gray-200 focus:border-teal-500"
                          />
                        </div>
                      </div>

                      <div>
                        <Textarea
                          name="message"
                          value={enquiryForm.message}
                          onChange={handleEnquiryChange}
                          placeholder="Any special requirements or questions..."
                          rows={3}
                          className="bg-gray-50 border-gray-200 focus:border-teal-500"
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-teal-500 to-yellow-500 hover:from-teal-600 hover:to-yellow-600 text-white py-6 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          "Submit Enquiry"
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Quick Contact */}
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-5">
                    <h4 className="font-bold text-gray-900 mb-4">Need Help?</h4>
                    <div className="space-y-3">
                      <a
                        href="tel:+919876543210"
                        className="flex items-center gap-3 p-3 rounded-lg bg-teal-50 hover:bg-teal-100 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-500 to-yellow-500 flex items-center justify-center">
                          <Phone className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Call Us</p>
                          <p className="text-sm text-teal-600">
                            +91 98765 43210
                          </p>
                        </div>
                      </a>
                      <a
                        href="https://wa.me/919876543210"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                          <MessageCircle className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">WhatsApp</p>
                          <p className="text-sm text-green-600">Chat Now</p>
                        </div>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* You May Also Like Section */}
          {relatedPackages.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-16"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    You May Also Like
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Other packages in {packageData.destinationName}
                  </p>
                </div>
                <Link
                  href={`/packages?destination=${packageData.destinationId}&name=${packageData.destinationName}`}
                >
                  <Button variant="outline" className="border-gray-300">
                    View All
                    <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                  </Button>
                </Link>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {relatedPackages.map((pkg) => (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <Link href={`/packages/${pkg.slug}`}>
                      <Card className="group relative overflow-hidden border border-gray-200 hover:border-teal-300 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                        <div className="relative h-48">
                          {pkg.image ? (
                            <Image
                              src={pkg.image}
                              alt={pkg.name}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                              <Globe className="h-12 w-12 text-gray-400" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                          {pkg.badge && (
                            <Badge className="absolute top-3 left-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                              {pkg.badge}
                            </Badge>
                          )}
                        </div>
                        <CardContent className="p-5">
                          <h3 className="font-bold text-gray-900 group-hover:text-teal-600 transition-colors line-clamp-2 mb-2">
                            {pkg.name}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{pkg.duration}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span>{pkg.rating}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <div>
                              {pkg.originalPrice && (
                                <span className="text-xs text-gray-400 line-through">
                                  ₹{pkg.originalPrice.toLocaleString()}
                                </span>
                              )}
                              <div className="text-lg font-bold bg-gradient-to-r from-teal-600 to-yellow-600 bg-clip-text text-transparent">
                                ₹{pkg.price.toLocaleString()}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-teal-500 to-yellow-500 hover:from-teal-600 hover:to-yellow-600 text-white"
                            >
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </div>
      </div>
    </div>
  );
}
