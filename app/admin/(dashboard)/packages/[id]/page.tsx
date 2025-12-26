"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Save,
  Loader2,
  Upload,
  X,
  Plus,
  Sparkles,
  ChevronRight,
  Image,
  Calendar,
  Users,
  DollarSign,
  MapPin,
  Check,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  accommodation?: string;
  meals?: string;
  activities?: string[];
}

interface AccommodationDetail {
  type: string;
  name: string;
  description: string;
  rating?: string;
  amenities?: string[];
}

interface FAQItem {
  question: string;
  answer: string;
}

interface PackageForm {
  name: string;
  destinationId: string;
  destinationName: string;
  location: string;
  country: string;
  image: string;
  images: string[];
  price: string;
  originalPrice: string;
  duration: string;
  groupSize: string;
  description: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  bestTime: string;
  difficulty: string;
  type: string;
  badge: string;
  featured: boolean;
  status: string;
  itinerary: ItineraryDay[];
  accommodations: AccommodationDetail[];
  faq: FAQItem[];
  policy: {
    cancellation: string;
    payment: string;
    health: string;
    baggage: string;
    insurance: string;
  };
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
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

export default function PackageFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const isNew = id === "new";
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [destinations, setDestinations] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [form, setForm] = useState<PackageForm>({
    name: "",
    destinationId: "",
    destinationName: "",
    location: "",
    country: "India",
    image: "",
    images: [],
    price: "",
    originalPrice: "",
    duration: "",
    groupSize: "",
    description: "",
    highlights: [""],
    inclusions: [""],
    exclusions: [""],
    bestTime: "",
    difficulty: "EASY",
    type: "PREMIUM",
    badge: "",
    featured: false,
    status: "ACTIVE",
    itinerary: [
      {
        day: 1,
        title: "",
        description: "",
        accommodation: "",
        meals: "",
        activities: [""],
      },
    ],
    accommodations: [
      {
        type: "Hotel",
        name: "",
        description: "",
        rating: "",
        amenities: [""],
      },
    ],
    faq: [
      {
        question: "",
        answer: "",
      },
    ],
    policy: {
      cancellation: "",
      payment: "",
      health: "",
      baggage: "",
      insurance: "",
    },
  });

  useEffect(() => {
    fetchDestinations();
    if (!isNew) {
      fetchPackage();
    }
  }, [id]);

  const fetchDestinations = async () => {
    try {
      const res = await fetch("/api/destinations?status=ACTIVE");
      if (res.ok) {
        const data = await res.json();
        setDestinations(data);
      }
    } catch (error) {
      console.error("Error fetching destinations:", error);
    }
  };

  const fetchPackage = async () => {
    try {
      const res = await fetch(`/api/packages/${id}`);
      if (res.ok) {
        const data = await res.json();
        setForm({
          ...data,
          price: String(data.price),
          originalPrice: data.originalPrice ? String(data.originalPrice) : "",
          highlights: data.highlights?.length ? data.highlights : [""],
          inclusions: data.inclusions?.length ? data.inclusions : [""],
          exclusions: data.exclusions?.length ? data.exclusions : [""],
          itinerary: data.itinerary?.length
            ? data.itinerary
            : [
                {
                  day: 1,
                  title: "",
                  description: "",
                  accommodation: "",
                  meals: "",
                  activities: [""],
                },
              ],
          accommodations: data.accommodations?.length
            ? data.accommodations
            : [
                {
                  type: "Hotel",
                  name: "",
                  description: "",
                  rating: "",
                  amenities: [""],
                },
              ],
          faq: data.faqs?.length ? data.faqs : [{ question: "", answer: "" }],
          policy: data.policies || {
            cancellation: "",
            payment: "",
            health: "",
            baggage: "",
            insurance: "",
          },
        });
      } else {
        toast.error("Package not found");
        router.push("/admin/packages");
      }
    } catch (error) {
      toast.error("Error fetching package");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Clean empty items from arrays
      const cleanArray = (arr: string[]) =>
        arr.filter((item) => item.trim() !== "");

      const payload = {
        ...form,
        highlights: cleanArray(form.highlights),
        inclusions: cleanArray(form.inclusions),
        exclusions: cleanArray(form.exclusions),
        itinerary: form.itinerary.filter(
          (day) => day.title.trim() || day.description.trim()
        ),
        accommodations: form.accommodations.filter((acc) => acc.name.trim()),
        faq: form.faq.filter(
          (item) => item.question.trim() && item.answer.trim()
        ),
        price: parseFloat(form.price) || 0,
        originalPrice: form.originalPrice
          ? parseFloat(form.originalPrice)
          : null,
      };

      const res = await fetch(isNew ? "/api/packages" : `/api/packages/${id}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(isNew ? "Package created!" : "Package updated!");
        router.push("/admin/packages");
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to save package");
      }
    } catch (error) {
      toast.error("Failed to save package");
    } finally {
      setSaving(false);
    }
  };

  const handleArrayChange = (
    field: "highlights" | "inclusions" | "exclusions",
    index: number,
    value: string
  ) => {
    const newArray = [...form[field]];
    newArray[index] = value;
    setForm({ ...form, [field]: newArray });
  };

  const addArrayItem = (field: "highlights" | "inclusions" | "exclusions") => {
    setForm({ ...form, [field]: [...form[field], ""] });
  };

  const removeArrayItem = (
    field: "highlights" | "inclusions" | "exclusions",
    index: number
  ) => {
    const newArray = form[field].filter((_, i) => i !== index);
    setForm({ ...form, [field]: newArray.length ? newArray : [""] });
  };

  const addItineraryDay = () => {
    setForm((prev) => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        {
          day: prev.itinerary.length + 1,
          title: "",
          description: "",
          accommodation: "",
          meals: "",
          activities: [""],
        },
      ],
    }));
  };

  const removeItineraryDay = (index: number) => {
    setForm((prev) => ({
      ...prev,
      itinerary: prev.itinerary
        .filter((_, i) => i !== index)
        .map((day, i) => ({ ...day, day: i + 1 })),
    }));
  };

  const handleItineraryChange = (
    index: number,
    field: keyof ItineraryDay,
    value: any
  ) => {
    setForm((prev) => ({
      ...prev,
      itinerary: prev.itinerary.map((day, i) =>
        i === index ? { ...day, [field]: value } : day
      ),
    }));
  };

  const handleItineraryActivityChange = (
    dayIndex: number,
    actIndex: number,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      itinerary: prev.itinerary.map((day, i) =>
        i === dayIndex
          ? {
              ...day,
              activities: day.activities
                ? day.activities.map((act, j) => (j === actIndex ? value : act))
                : [value],
            }
          : day
      ),
    }));
  };

  const addItineraryActivity = (dayIndex: number) => {
    setForm((prev) => ({
      ...prev,
      itinerary: prev.itinerary.map((day, i) =>
        i === dayIndex
          ? { ...day, activities: [...(day.activities || []), ""] }
          : day
      ),
    }));
  };

  const removeItineraryActivity = (dayIndex: number, actIndex: number) => {
    setForm((prev) => ({
      ...prev,
      itinerary: prev.itinerary.map((day, i) =>
        i === dayIndex
          ? {
              ...day,
              activities: (day.activities || []).filter(
                (_, j) => j !== actIndex
              ),
            }
          : day
      ),
    }));
  };

  const addAccommodation = () => {
    setForm((prev) => ({
      ...prev,
      accommodations: [
        ...prev.accommodations,
        {
          type: "Hotel",
          name: "",
          description: "",
          rating: "",
          amenities: [""],
        },
      ],
    }));
  };

  const removeAccommodation = (index: number) => {
    setForm((prev) => ({
      ...prev,
      accommodations: prev.accommodations.filter((_, i) => i !== index),
    }));
  };

  const handleAccommodationChange = (
    index: number,
    field: keyof AccommodationDetail,
    value: any
  ) => {
    setForm((prev) => ({
      ...prev,
      accommodations: prev.accommodations.map((acc, i) =>
        i === index ? { ...acc, [field]: value } : acc
      ),
    }));
  };

  const addFAQ = () => {
    setForm((prev) => ({
      ...prev,
      faq: [...prev.faq, { question: "", answer: "" }],
    }));
  };

  const removeFAQ = (index: number) => {
    setForm((prev) => ({
      ...prev,
      faq: prev.faq.filter((_, i) => i !== index),
    }));
  };

  const handleFAQChange = (
    index: number,
    field: keyof FAQItem,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      faq: prev.faq.map((faq, i) =>
        i === index ? { ...faq, [field]: value } : faq
      ),
    }));
  };

  const handlePolicyChange = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      policy: { ...prev.policy, [field]: value },
    }));
  };

  const handleImageUpload = async (file: File, type: "main" | "gallery") => {
    if (!file) return;

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const { url } = await response.json();

      if (type === "main") {
        setForm((prev) => ({ ...prev, image: url }));
      } else {
        setForm((prev) => ({ ...prev, images: [...prev.images, url] }));
      }

      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      </div>
    );
  }

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
            <div className="flex items-center gap-3">
              <Link href="/admin/packages">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 border border-gray-200"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </motion.div>
              </Link>
              <div>
                <h1 className="text-3xl font-bold bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                  {isNew ? "Create New Package" : "Edit Package"}
                </h1>
                <p className="text-gray-600 mt-1">
                  {isNew
                    ? "Add a new travel package to your catalog"
                    : "Update package details and content"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => router.push("/admin/packages")}
                className="border-gray-200 hover:border-gray-300"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={saving}
                className="h-9 bg-linear-to-r from-yellow-500 to-teal-500 hover:from-yellow-600 hover:to-teal-600 shadow-lg hover:shadow-xl"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Package
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information Card */}
              <motion.div variants={cardVariants} whileHover="hover">
                <Card className="border-0 shadow-xl bg-linear-to-br from-white via-white to-gray-50">
                  <CardHeader className="border-b border-gray-100">
                    <CardTitle className="text-xl font-bold text-gray-900">
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
                          <Sparkles className="h-6 w-6 text-yellow-500" />
                        </motion.div>
                        Basic Information
                      </div>
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Core details about the travel package
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="name"
                          className="text-gray-700 font-medium"
                        >
                          Package Name *
                        </Label>
                        <Input
                          id="name"
                          value={form.name}
                          onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                          }
                          placeholder="Sikkim Explorer"
                          required
                          className="border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="destinationName"
                          className="text-gray-700 font-medium"
                        >
                          Destination Name *
                        </Label>
                        <Input
                          id="destinationName"
                          value={form.destinationName}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              destinationName: e.target.value,
                            })
                          }
                          placeholder="Gangtok, Pelling, Darjeeling"
                          required
                          className="border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="location"
                          className="text-gray-700 font-medium"
                        >
                          Location *
                        </Label>
                        <Input
                          id="location"
                          value={form.location}
                          onChange={(e) =>
                            setForm({ ...form, location: e.target.value })
                          }
                          placeholder="Sikkim, India"
                          required
                          className="border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="country"
                          className="text-gray-700 font-medium"
                        >
                          Country
                        </Label>
                        <Input
                          id="country"
                          value={form.country}
                          onChange={(e) =>
                            setForm({ ...form, country: e.target.value })
                          }
                          placeholder="India"
                          className="border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="description"
                        className="text-gray-700 font-medium"
                      >
                        Description *
                      </Label>
                      <Textarea
                        id="description"
                        value={form.description}
                        onChange={(e) =>
                          setForm({ ...form, description: e.target.value })
                        }
                        placeholder="Describe the package..."
                        rows={4}
                        required
                        className="border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                      />
                    </div>

                    {/* Image Upload */}
                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium flex items-center gap-2">
                          <Image className="h-4 w-4" />
                          Main Image
                        </Label>
                        <div className="flex flex-col sm:flex-row gap-4">
                          <label className="flex flex-col items-center justify-center w-full sm:w-48 h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-teal-500 transition-colors bg-linear-to-br from-gray-50 to-white">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageUpload(file, "main");
                              }}
                              disabled={uploading}
                              className="hidden"
                            />
                            {uploading ? (
                              <div className="flex flex-col items-center">
                                <Loader2 className="h-8 w-8 animate-spin text-teal-600 mb-2" />
                                <span className="text-sm text-gray-500">
                                  Uploading...
                                </span>
                              </div>
                            ) : (
                              <>
                                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                <span className="text-sm text-gray-500">
                                  Upload main image
                                </span>
                              </>
                            )}
                          </label>
                          {form.image && (
                            <div className="flex-1">
                              <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-200">
                                <img
                                  src={form.image}
                                  alt="Preview"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium">
                          Gallery Images
                        </Label>
                        <div className="space-y-3">
                          <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-teal-500 transition-colors bg-linear-to-br from-gray-50 to-white">
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={(e) => {
                                const files = Array.from(e.target.files || []);
                                files.forEach((file) =>
                                  handleImageUpload(file, "gallery")
                                );
                              }}
                              disabled={uploading}
                              className="hidden"
                            />
                            <div className="flex flex-col items-center">
                              <Upload className="h-6 w-6 text-gray-400 mb-1" />
                              <span className="text-sm text-gray-500">
                                Click to upload gallery images
                              </span>
                            </div>
                          </label>
                          {form.images.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              {form.images.map((image, index) => (
                                <div key={index} className="relative">
                                  <div className="aspect-square overflow-hidden rounded-lg border border-gray-200">
                                    <img
                                      src={image}
                                      alt={`Gallery ${index + 1}`}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeGalleryImage(index)}
                                    className="absolute top-1 right-1 h-6 w-6 p-0 bg-white/90 backdrop-blur-sm"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Pricing & Duration Card */}
              <motion.div variants={cardVariants} whileHover="hover">
                <Card className="border-0 shadow-xl bg-linear-to-br from-white via-white to-gray-50">
                  <CardHeader className="border-b border-gray-100">
                    <CardTitle className="text-xl font-bold text-gray-900">
                      Pricing & Duration
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Set pricing and duration details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Price (₹) *
                        </Label>
                        <Input
                          type="number"
                          value={form.price}
                          onChange={(e) =>
                            setForm({ ...form, price: e.target.value })
                          }
                          placeholder="24999"
                          required
                          className="border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium">
                          Original Price (₹)
                        </Label>
                        <Input
                          type="number"
                          value={form.originalPrice}
                          onChange={(e) =>
                            setForm({ ...form, originalPrice: e.target.value })
                          }
                          placeholder="29999"
                          className="border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Duration *
                        </Label>
                        <Input
                          value={form.duration}
                          onChange={(e) =>
                            setForm({ ...form, duration: e.target.value })
                          }
                          placeholder="6 Days 5 Nights"
                          required
                          className="border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Group Size *
                        </Label>
                        <Input
                          value={form.groupSize}
                          onChange={(e) =>
                            setForm({ ...form, groupSize: e.target.value })
                          }
                          placeholder="2-6 People"
                          required
                          className="border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Highlights Card - Single Row */}
              <motion.div variants={cardVariants} whileHover="hover">
                <Card className="border-0 shadow-xl bg-linear-to-br from-white via-white to-gray-50">
                  <CardHeader className="border-b border-gray-100">
                    <CardTitle className="text-xl font-bold text-gray-900">
                      Package Highlights
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Key features and selling points
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {form.highlights.map((highlight, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="relative"
                          >
                            <Input
                              value={highlight}
                              onChange={(e) =>
                                handleArrayChange(
                                  "highlights",
                                  index,
                                  e.target.value
                                )
                              }
                              placeholder={`Highlight ${index + 1}`}
                              className="pr-10 border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                            />
                            {form.highlights.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  removeArrayItem("highlights", index)
                                }
                                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            )}
                          </motion.div>
                        ))}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => addArrayItem("highlights")}
                        className="w-full border-gray-200 hover:border-gray-300"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Highlight
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Inclusions & Exclusions Card */}
              <motion.div variants={cardVariants} whileHover="hover">
                <Card className="border-0 shadow-xl bg-linear-to-br from-white via-white to-gray-50">
                  <CardHeader className="border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl font-bold text-gray-900">
                          Inclusions & Exclusions
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                          What's included and what's not in the package
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Inclusions */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                            <Check className="h-4 w-4 text-emerald-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            What's Included
                          </h3>
                        </div>
                        <div className="space-y-3">
                          {form.inclusions.map((inclusion, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="flex gap-2"
                            >
                              <Input
                                value={inclusion}
                                onChange={(e) =>
                                  handleArrayChange(
                                    "inclusions",
                                    index,
                                    e.target.value
                                  )
                                }
                                placeholder="e.g., Accommodation, Meals, Transfers"
                                className="flex-1 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                              />
                              {form.inclusions.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    removeArrayItem("inclusions", index)
                                  }
                                  className="text-gray-400 hover:text-gray-600"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </motion.div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => addArrayItem("inclusions")}
                            className="w-full border-emerald-200 hover:border-emerald-300 text-emerald-600 hover:text-emerald-700"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Inclusion
                          </Button>
                        </div>
                      </div>

                      {/* Exclusions */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-rose-100 flex items-center justify-center">
                            <XCircle className="h-4 w-4 text-rose-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            What's Excluded
                          </h3>
                        </div>
                        <div className="space-y-3">
                          {form.exclusions.map((exclusion, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="flex gap-2"
                            >
                              <Input
                                value={exclusion}
                                onChange={(e) =>
                                  handleArrayChange(
                                    "exclusions",
                                    index,
                                    e.target.value
                                  )
                                }
                                placeholder="e.g., Flights, Insurance, Tips"
                                className="flex-1 border-rose-200 focus:border-rose-500 focus:ring-rose-500"
                              />
                              {form.exclusions.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    removeArrayItem("exclusions", index)
                                  }
                                  className="text-gray-400 hover:text-gray-600"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </motion.div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => addArrayItem("exclusions")}
                            className="w-full border-rose-200 hover:border-rose-300 text-rose-600 hover:text-rose-700"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Exclusion
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Itinerary Card */}
              <motion.div variants={cardVariants} whileHover="hover">
                <Card className="border-0 shadow-xl bg-linear-to-br from-white via-white to-gray-50">
                  <CardHeader className="border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-bold text-gray-900">
                        Day-wise Itinerary
                      </CardTitle>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addItineraryDay}
                        className="border-gray-200 hover:border-gray-300"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Day
                      </Button>
                    </div>
                    <CardDescription className="text-gray-600">
                      Plan detailed day-by-day itinerary
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <AnimatePresence>
                      {form.itinerary.map((day, dayIndex) => (
                        <motion.div
                          key={dayIndex}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border border-gray-200 rounded-xl p-6 space-y-4 bg-white"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Badge className="bg-linear-to-r from-teal-500 to-yellow-500 text-white border-0">
                                Day {day.day}
                              </Badge>
                              <ChevronRight className="h-4 w-4 text-gray-400" />
                              <h4 className="font-semibold text-gray-900">
                                Itinerary Details
                              </h4>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItineraryDay(dayIndex)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Title</Label>
                              <Input
                                value={day.title}
                                onChange={(e) =>
                                  handleItineraryChange(
                                    dayIndex,
                                    "title",
                                    e.target.value
                                  )
                                }
                                placeholder="e.g., Arrival in Gangtok"
                                className="border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Accommodation</Label>
                              <Input
                                value={day.accommodation || ""}
                                onChange={(e) =>
                                  handleItineraryChange(
                                    dayIndex,
                                    "accommodation",
                                    e.target.value
                                  )
                                }
                                placeholder="Hotel name"
                                className="border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                              value={day.description}
                              onChange={(e) =>
                                handleItineraryChange(
                                  dayIndex,
                                  "description",
                                  e.target.value
                                )
                              }
                              placeholder="Detailed description of the day..."
                              rows={3}
                              className="border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Meals</Label>
                              <Input
                                value={day.meals || ""}
                                onChange={(e) =>
                                  handleItineraryChange(
                                    dayIndex,
                                    "meals",
                                    e.target.value
                                  )
                                }
                                placeholder="e.g., Breakfast, Lunch, Dinner"
                                className="border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Activities</Label>
                              <div className="space-y-2">
                                {(day.activities || []).map(
                                  (activity, actIndex) => (
                                    <div key={actIndex} className="flex gap-2">
                                      <Input
                                        value={activity}
                                        onChange={(e) =>
                                          handleItineraryActivityChange(
                                            dayIndex,
                                            actIndex,
                                            e.target.value
                                          )
                                        }
                                        placeholder="Activity..."
                                        className="border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                                      />
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          removeItineraryActivity(
                                            dayIndex,
                                            actIndex
                                          )
                                        }
                                        className="text-gray-400 hover:text-gray-600"
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  )
                                )}
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => addItineraryActivity(dayIndex)}
                                  className="border-gray-200 hover:border-gray-300"
                                >
                                  <Plus className="h-4 w-4 mr-1" />
                                  Add Activity
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Accommodations Card */}
              <motion.div variants={cardVariants} whileHover="hover">
                <Card className="border-0 shadow-xl bg-linear-to-br from-white via-white to-gray-50">
                  <CardHeader className="border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-bold text-gray-900">
                        Accommodations
                      </CardTitle>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            accommodations: [
                              ...prev.accommodations,
                              {
                                type: "Hotel",
                                name: "",
                                description: "",
                                rating: "",
                                amenities: [""],
                              },
                            ],
                          }))
                        }
                        className="border-gray-200 hover:border-gray-300"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Accommodation
                      </Button>
                    </div>
                    <CardDescription className="text-gray-600">
                      Add accommodation details for this package
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <AnimatePresence>
                      {form.accommodations.map((acc, accIndex) => (
                        <motion.div
                          key={accIndex}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border border-gray-200 rounded-xl p-6 space-y-4 bg-white"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Badge className="bg-linear-to-r from-teal-500 to-yellow-500 text-white border-0">
                                Accommodation {accIndex + 1}
                              </Badge>
                              <ChevronRight className="h-4 w-4 text-gray-400" />
                              <h4 className="font-semibold text-gray-900">
                                {acc.name || "New Accommodation"}
                              </h4>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setForm((prev) => ({
                                  ...prev,
                                  accommodations: prev.accommodations.filter(
                                    (_, i) => i !== accIndex
                                  ),
                                }))
                              }
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Type</Label>
                              <Select
                                value={acc.type}
                                onValueChange={(value) =>
                                  handleAccommodationChange(
                                    accIndex,
                                    "type",
                                    value
                                  )
                                }
                              >
                                <SelectTrigger className="border-gray-200 focus:border-teal-500 focus:ring-teal-500">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Hotel">Hotel</SelectItem>
                                  <SelectItem value="Resort">Resort</SelectItem>
                                  <SelectItem value="Homestay">
                                    Homestay
                                  </SelectItem>
                                  <SelectItem value="Camp">Camp</SelectItem>
                                  <SelectItem value="Houseboat">
                                    Houseboat
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Name</Label>
                              <Input
                                value={acc.name}
                                onChange={(e) =>
                                  handleAccommodationChange(
                                    accIndex,
                                    "name",
                                    e.target.value
                                  )
                                }
                                placeholder="e.g., Taj Mahal Palace"
                                className="border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                              value={acc.description}
                              onChange={(e) =>
                                handleAccommodationChange(
                                  accIndex,
                                  "description",
                                  e.target.value
                                )
                              }
                              placeholder="Describe the accommodation..."
                              rows={3}
                              className="border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Rating</Label>
                              <Input
                                value={acc.rating}
                                onChange={(e) =>
                                  handleAccommodationChange(
                                    accIndex,
                                    "rating",
                                    e.target.value
                                  )
                                }
                                placeholder="e.g., 4.5 stars"
                                className="border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Amenities</Label>
                              <div className="space-y-2">
                                {acc.amenities?.map((amenity, amenityIndex) => (
                                  <div
                                    key={amenityIndex}
                                    className="flex gap-2"
                                  >
                                    <Input
                                      value={amenity}
                                      onChange={(e) => {
                                        const newAmenities = [
                                          ...(acc.amenities || []),
                                        ];
                                        newAmenities[amenityIndex] =
                                          e.target.value;
                                        handleAccommodationChange(
                                          accIndex,
                                          "amenities",
                                          newAmenities
                                        );
                                      }}
                                      placeholder="e.g., WiFi, Pool"
                                      className="border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                                    />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        const newAmenities = (
                                          acc.amenities || []
                                        ).filter((_, i) => i !== amenityIndex);
                                        handleAccommodationChange(
                                          accIndex,
                                          "amenities",
                                          newAmenities.length
                                            ? newAmenities
                                            : [""]
                                        );
                                      }}
                                      className="text-gray-400 hover:text-gray-600"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const newAmenities = [
                                      ...(acc.amenities || []),
                                      "",
                                    ];
                                    handleAccommodationChange(
                                      accIndex,
                                      "amenities",
                                      newAmenities
                                    );
                                  }}
                                  className="w-full border-gray-200 hover:border-gray-300"
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add Amenity
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>

              {/* FAQ Card */}
              <motion.div variants={cardVariants} whileHover="hover">
                <Card className="border-0 shadow-xl bg-linear-to-br from-white via-white to-gray-50">
                  <CardHeader className="border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-bold text-gray-900">
                        Frequently Asked Questions
                      </CardTitle>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addFAQ}
                        className="border-gray-200 hover:border-gray-300"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add FAQ
                      </Button>
                    </div>
                    <CardDescription className="text-gray-600">
                      Add common questions and answers for this package
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <AnimatePresence>
                      {form.faq.map((faq, faqIndex) => (
                        <motion.div
                          key={faqIndex}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border border-gray-200 rounded-xl p-6 space-y-4 bg-white"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Badge className="bg-linear-to-r from-teal-500 to-yellow-500 text-white border-0">
                                FAQ {faqIndex + 1}
                              </Badge>
                              <ChevronRight className="h-4 w-4 text-gray-400" />
                              <h4 className="font-semibold text-gray-900">
                                {faq.question || "New Question"}
                              </h4>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFAQ(faqIndex)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label>Question</Label>
                              <Input
                                value={faq.question}
                                onChange={(e) =>
                                  handleFAQChange(
                                    faqIndex,
                                    "question",
                                    e.target.value
                                  )
                                }
                                placeholder="e.g., What is included in the package?"
                                className="border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Answer</Label>
                              <Textarea
                                value={faq.answer}
                                onChange={(e) =>
                                  handleFAQChange(
                                    faqIndex,
                                    "answer",
                                    e.target.value
                                  )
                                }
                                placeholder="Provide a detailed answer..."
                                rows={3}
                                className="border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                              />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Policies Card */}
              <motion.div variants={cardVariants} whileHover="hover">
                <Card className="border-0 shadow-xl bg-linear-to-br from-white via-white to-gray-50">
                  <CardHeader className="border-b border-gray-100">
                    <CardTitle className="text-xl font-bold text-gray-900">
                      Terms & Policies
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Set important policies for this package
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium">
                          Cancellation Policy
                        </Label>
                        <Textarea
                          value={form.policy.cancellation}
                          onChange={(e) =>
                            handlePolicyChange("cancellation", e.target.value)
                          }
                          placeholder="Describe cancellation terms..."
                          rows={3}
                          className="border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium">
                          Payment Policy
                        </Label>
                        <Textarea
                          value={form.policy.payment}
                          onChange={(e) =>
                            handlePolicyChange("payment", e.target.value)
                          }
                          placeholder="Describe payment terms..."
                          rows={3}
                          className="border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium">
                          Health & Safety
                        </Label>
                        <Textarea
                          value={form.policy.health}
                          onChange={(e) =>
                            handlePolicyChange("health", e.target.value)
                          }
                          placeholder="Describe health and safety measures..."
                          rows={3}
                          className="border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium">
                          Baggage Policy
                        </Label>
                        <Textarea
                          value={form.policy.baggage}
                          onChange={(e) =>
                            handlePolicyChange("baggage", e.target.value)
                          }
                          placeholder="Describe baggage allowances and restrictions..."
                          rows={3}
                          className="border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium">
                          Travel Insurance
                        </Label>
                        <Textarea
                          value={form.policy.insurance}
                          onChange={(e) =>
                            handlePolicyChange("insurance", e.target.value)
                          }
                          placeholder="Describe insurance requirements and recommendations..."
                          rows={3}
                          className="border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status & Type Card */}
              <motion.div variants={cardVariants} whileHover="hover">
                <Card className="border-0 shadow-xl bg-linear-to-br from-white via-white to-gray-50">
                  <CardHeader className="border-b border-gray-100">
                    <CardTitle className="text-xl font-bold text-gray-900">
                      Status & Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">
                        Destination
                      </Label>
                      <Select
                        value={form.destinationId}
                        onValueChange={(v) =>
                          setForm({ ...form, destinationId: v })
                        }
                      >
                        <SelectTrigger className="border-gray-200 focus:border-teal-500 focus:ring-teal-500">
                          <SelectValue placeholder="Select destination" />
                        </SelectTrigger>
                        <SelectContent>
                          {destinations.map((dest) => (
                            <SelectItem key={dest.id} value={dest.id}>
                              {dest.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">
                        Status
                      </Label>
                      <Select
                        value={form.status}
                        onValueChange={(v) => setForm({ ...form, status: v })}
                      >
                        <SelectTrigger className="border-gray-200 focus:border-teal-500 focus:ring-teal-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem
                            value="ACTIVE"
                            className="flex items-center gap-2"
                          >
                            <div className="h-2 w-2 rounded-full bg-emerald-500" />
                            Active
                          </SelectItem>
                          <SelectItem
                            value="INACTIVE"
                            className="flex items-center gap-2"
                          >
                            <div className="h-2 w-2 rounded-full bg-gray-500" />
                            Inactive
                          </SelectItem>
                          <SelectItem
                            value="DRAFT"
                            className="flex items-center gap-2"
                          >
                            <div className="h-2 w-2 rounded-full bg-amber-500" />
                            Draft
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">
                        Package Type
                      </Label>
                      <Select
                        value={form.type}
                        onValueChange={(v) => setForm({ ...form, type: v })}
                      >
                        <SelectTrigger className="border-gray-200 focus:border-teal-500 focus:ring-teal-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem
                            value="BUDGET"
                            className="flex items-center gap-2"
                          >
                            <div className="h-2 w-2 rounded-full bg-emerald-500" />
                            Budget
                          </SelectItem>
                          <SelectItem
                            value="PREMIUM"
                            className="flex items-center gap-2"
                          >
                            <div className="h-2 w-2 rounded-full bg-blue-500" />
                            Premium
                          </SelectItem>
                          <SelectItem
                            value="LUXURY"
                            className="flex items-center gap-2"
                          >
                            <div className="h-2 w-2 rounded-full bg-purple-500" />
                            Luxury
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">
                        Difficulty Level
                      </Label>
                      <Select
                        value={form.difficulty}
                        onValueChange={(v) =>
                          setForm({ ...form, difficulty: v })
                        }
                      >
                        <SelectTrigger className="border-gray-200 focus:border-teal-500 focus:ring-teal-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EASY">Easy</SelectItem>
                          <SelectItem value="MODERATE">Moderate</SelectItem>
                          <SelectItem value="CHALLENGING">
                            Challenging
                          </SelectItem>
                          <SelectItem value="DIFFICULT">Difficult</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-linear-to-r from-gray-50 to-white">
                      <div>
                        <Label className="text-gray-700 font-medium cursor-pointer">
                          Featured Package
                        </Label>
                        <p className="text-sm text-gray-500 mt-1">
                          Show in featured section
                        </p>
                      </div>
                      <Switch
                        checked={form.featured}
                        onCheckedChange={(v) =>
                          setForm({ ...form, featured: v })
                        }
                        className="data-[state=checked]:bg-yellow-500"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Additional Info Card */}
              <motion.div variants={cardVariants} whileHover="hover">
                <Card className="border-0 shadow-xl bg-linear-to-br from-white via-white to-gray-50">
                  <CardHeader className="border-b border-gray-100">
                    <CardTitle className="text-xl font-bold text-gray-900">
                      Additional Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="badge"
                        className="text-gray-700 font-medium"
                      >
                        Badge
                      </Label>
                      <Input
                        id="badge"
                        value={form.badge}
                        onChange={(e) =>
                          setForm({ ...form, badge: e.target.value })
                        }
                        placeholder="Bestseller"
                        className="border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="bestTime"
                        className="text-gray-700 font-medium"
                      >
                        Best Time to Visit
                      </Label>
                      <Input
                        id="bestTime"
                        value={form.bestTime}
                        onChange={(e) =>
                          setForm({ ...form, bestTime: e.target.value })
                        }
                        placeholder="March to June"
                        className="border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
