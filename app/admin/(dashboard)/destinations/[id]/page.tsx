"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Loader2, Upload, X, Plus, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import Link from "next/link";

interface DestinationForm {
  name: string;
  location: string;
  country: string;
  region: string;
  image: string;
  images: string[];
  description: string;
  highlights: string[];
  bestTime: string;
  featured: boolean;
  status: string;
  packageIds: string[]; // New field for package selection
}

export default function DestinationFormPage({
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
  const [packages, setPackages] = useState<
    Array<{ id: string; name: string; location: string }>
  >([]);
  const [form, setForm] = useState<DestinationForm>({
    name: "",
    location: "",
    country: "India",
    region: "INDIA",
    image: "",
    images: [],
    description: "",
    highlights: [""],
    bestTime: "",
    featured: false,
    status: "ACTIVE",
    packageIds: [],
  });

  useEffect(() => {
    fetchPackages();
    if (!isNew) {
      fetchDestination();
    }
  }, [id]);

  const fetchPackages = async () => {
    try {
      const res = await fetch("/api/packages?status=ACTIVE");
      if (res.ok) {
        const data = await res.json();
        setPackages(data);
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
    }
  };

  const fetchDestination = async () => {
    try {
      const res = await fetch(`/api/destinations/${id}`);
      if (res.ok) {
        const data = await res.json();
        const { packages, ...rest } = data;
        setForm({
          ...rest,
          highlights: data.highlights?.length ? data.highlights : [""],
          packageIds: packages?.map((pkg: any) => pkg.id) || [],
        });
      } else {
        toast.error("Destination not found");
        router.push("/admin/destinations");
      }
    } catch (error) {
      toast.error("Error fetching destination");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { packages, ...formData } = form as any;
      const payload = {
        ...formData,
        highlights: form.highlights.filter((h) => h.trim()),
      };

      const res = await fetch(
        isNew ? "/api/destinations" : `/api/destinations/${id}`,
        {
          method: isNew ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        toast.success(isNew ? "Destination created!" : "Destination updated!");
        router.push("/admin/destinations");
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to save destination");
      }
    } catch (error) {
      toast.error("Failed to save destination");
    } finally {
      setSaving(false);
    }
  };

  const handleArrayChange = (
    field: "highlights",
    index: number,
    value: string
  ) => {
    const newArray = [...form[field]];
    newArray[index] = value;
    setForm({ ...form, [field]: newArray });
  };

  const addArrayItem = (field: "highlights") => {
    setForm({ ...form, [field]: [...form[field], ""] });
  };

  const removeArrayItem = (field: "highlights", index: number) => {
    const newArray = form[field].filter((_, i) => i !== index);
    setForm({ ...form, [field]: newArray.length ? newArray : [""] });
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

  const handlePackageToggle = (packageId: string, checked: boolean) => {
    setForm((prev) => ({
      ...prev,
      packageIds: checked
        ? [...prev.packageIds, packageId]
        : prev.packageIds.filter((id) => id !== packageId),
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/destinations">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isNew ? "Create Destination" : "Edit Destination"}
            </h1>
            <p className="text-gray-600">
              {isNew
                ? "Add a new travel destination"
                : "Update destination details"}
            </p>
          </div>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={saving}
          className="bg-linear-to-r from-yellow-500 to-teal-500 hover:from-yellow-600 hover:to-teal-600"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Destination
            </>
          )}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Destination Name *</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      placeholder="Sikkim"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={form.location}
                      onChange={(e) =>
                        setForm({ ...form, location: e.target.value })
                      }
                      placeholder="North East India"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={form.country}
                    onChange={(e) =>
                      setForm({ ...form, country: e.target.value })
                    }
                    placeholder="India"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="region">Region *</Label>
                  <Select
                    value={form.region}
                    onValueChange={(value) =>
                      setForm({ ...form, region: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INDIA">India</SelectItem>
                      <SelectItem value="WORLD">International</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    placeholder="Describe the destination..."
                    rows={4}
                    required
                  />
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <Label>Main Image</Label>
                  <div className="flex gap-4 items-center">
                    <div className="flex-1">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file, "main");
                        }}
                        disabled={uploading}
                      />
                    </div>
                    {uploading && <Loader2 className="h-5 w-5 animate-spin" />}
                  </div>
                  {form.image && (
                    <div className="mt-2">
                      <img
                        src={form.image}
                        alt="Preview"
                        className="w-32 h-24 object-cover rounded-md border"
                      />
                    </div>
                  )}
                </div>

                {/* Gallery Images */}
                <div className="space-y-2">
                  <Label>Gallery Images</Label>
                  <div className="space-y-3">
                    <Input
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
                    />
                    {form.images.length > 0 && (
                      <div className="grid grid-cols-4 gap-2">
                        {form.images.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={image}
                              alt={`Gallery ${index + 1}`}
                              className="w-full h-20 object-cover rounded border"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeGalleryImage(index)}
                              className="absolute top-0 right-0 h-6 w-6 p-0"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Highlights */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Highlights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {form.highlights.map((highlight, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={highlight}
                      onChange={(e) =>
                        handleArrayChange("highlights", index, e.target.value)
                      }
                      placeholder="Destination highlight..."
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeArrayItem("highlights", index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addArrayItem("highlights")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Highlight
                </Button>
              </CardContent>
            </Card>

            {/* Associated Packages */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Associated Packages</CardTitle>
                <p className="text-sm text-gray-600">
                  Select packages that are associated with this destination
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="max-h-64 overflow-y-auto space-y-3">
                  {packages.map((pkg) => (
                    <div key={pkg.id} className="flex items-center space-x-3">
                      <Checkbox
                        id={pkg.id}
                        checked={form.packageIds.includes(pkg.id)}
                        onCheckedChange={(checked) =>
                          handlePackageToggle(pkg.id, checked as boolean)
                        }
                      />
                      <Label htmlFor={pkg.id} className="flex-1 cursor-pointer">
                        <div>
                          <div className="font-medium">{pkg.name}</div>
                          <div className="text-sm text-gray-500">
                            {pkg.location}
                          </div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
                {packages.length === 0 && (
                  <p className="text-sm text-gray-500">
                    No packages available. Create packages first to associate
                    them with this destination.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status & Type */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Status & Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={form.status}
                    onValueChange={(v) => setForm({ ...form, status: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between py-2">
                  <Label>Featured Destination</Label>
                  <Switch
                    checked={form.featured}
                    onCheckedChange={(v) => setForm({ ...form, featured: v })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Additional Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bestTime">Best Time to Visit</Label>
                  <Input
                    id="bestTime"
                    value={form.bestTime}
                    onChange={(e) =>
                      setForm({ ...form, bestTime: e.target.value })
                    }
                    placeholder="March to June"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
