"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Save,
  Loader2,
  Upload,
  X,
  FileText,
  Sparkles,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import RichTextEditor from "@/components/RichTextEditor";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image?: string;
  author: string;
  category: string;
  tags: string[];
  featured: boolean;
  published: boolean;
  publishedAt?: string;
  readTime?: string;
  views: number;
  createdAt: string;
  updatedAt: string;
}

const categories = [
  "Travel Tips",
  "Destination Guide",
  "Adventure",
  "Culture",
  "Food",
  "Budget Travel",
  "Luxury Travel",
  "Solo Travel",
  "Family Travel",
  "News",
];

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

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [editingPost, setEditingPost] = useState<Partial<BlogPost>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/blog/${postId}`);
      if (response.ok) {
        const data = await response.json();
        setEditingPost(data);
      } else {
        toast.error("Post not found");
        router.push("/admin/blog");
      }
    } catch (error) {
      console.error("Error fetching post:", error);
      toast.error("Failed to load post");
      router.push("/admin/blog");
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setEditingPost((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "blog");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      setEditingPost((prev) => ({ ...prev, image: data.url }));
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setImageUploading(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !editingPost.tags?.includes(tagInput.trim())) {
      setEditingPost((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditingPost((prev) => ({
      ...prev,
      tags: prev.tags?.filter((tag) => tag !== tagToRemove) || [],
    }));
  };

  const handleSubmit = async () => {
    if (!editingPost.title || !editingPost.content || !editingPost.excerpt) {
      toast.error("Please fill in title, excerpt, and content");
      return;
    }

    setIsSubmitting(true);
    try {
      const body = {
        ...editingPost,
        publishedAt: editingPost.published ? new Date().toISOString() : null,
      };

      const response = await fetch(`/api/blog/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error("Failed to update post");

      toast.success("Post updated successfully");
      router.push("/admin/blog");
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Failed to update post");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 p-4 sm:p-6 lg:p-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.push("/admin/blog")}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Blog Posts</span>
              </Button>
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
                  Edit Blog Post
                </h1>
              </div>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-linear-to-r from-teal-500 to-yellow-500 hover:from-teal-600 hover:to-yellow-600 shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Update Post
                </>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-xl bg-white">
            <CardHeader>
              <CardTitle className="text-2xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Post Details
              </CardTitle>
              <CardDescription className="text-gray-600">
                Update the details for your blog post. All fields marked with *
                are required.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Image Upload */}
              <div>
                <Label className="text-gray-700 text-base font-medium">
                  Featured Image
                </Label>
                <div className="mt-3">
                  {editingPost.image ? (
                    <div className="relative w-full h-64 sm:h-80 rounded-lg overflow-hidden border-2 border-gray-200">
                      <img
                        src={editingPost.image}
                        alt="Featured"
                        className="w-full h-full object-cover"
                      />
                      <Button
                        size="icon"
                        variant="destructive"
                        className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white"
                        onClick={() =>
                          setEditingPost((prev) => ({ ...prev, image: "" }))
                        }
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-64 sm:h-80 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-teal-500 transition-all duration-300 bg-linear-to-br from-gray-50 to-white">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      {imageUploading ? (
                        <div className="flex flex-col items-center">
                          <Loader2 className="h-10 w-10 animate-spin text-teal-600 mb-3" />
                          <span className="text-sm text-gray-500">
                            Uploading...
                          </span>
                        </div>
                      ) : (
                        <>
                          <Upload className="h-10 w-10 text-gray-400 mb-3" />
                          <span className="text-sm text-gray-500 text-center">
                            Click to upload featured image
                          </span>
                          <span className="text-xs text-gray-400 mt-2 text-center">
                            Recommended: 1200x800px
                          </span>
                        </>
                      )}
                    </label>
                  )}
                </div>
              </div>

              {/* Title & Slug */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <Label
                    htmlFor="title"
                    className="text-gray-700 text-base font-medium"
                  >
                    Title *
                  </Label>
                  <Input
                    id="title"
                    value={editingPost.title || ""}
                    onChange={handleTitleChange}
                    placeholder="Enter post title"
                    className="mt-2 border-gray-200 focus:border-teal-500 focus:ring-teal-500 text-lg"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="slug"
                    className="text-gray-700 text-base font-medium"
                  >
                    Slug
                  </Label>
                  <Input
                    id="slug"
                    value={editingPost.slug || ""}
                    onChange={(e) =>
                      setEditingPost((prev) => ({
                        ...prev,
                        slug: e.target.value,
                      }))
                    }
                    placeholder="post-url-slug"
                    className="mt-2 border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Category & Author */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <Label className="text-gray-700 text-base font-medium">
                    Category *
                  </Label>
                  <Select
                    value={editingPost.category || ""}
                    onValueChange={(value) =>
                      setEditingPost((prev) => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger className="mt-2 border-gray-200 focus:border-teal-500 focus:ring-teal-500">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label
                    htmlFor="author"
                    className="text-gray-700 text-base font-medium"
                  >
                    Author *
                  </Label>
                  <Input
                    id="author"
                    value={editingPost.author || ""}
                    onChange={(e) =>
                      setEditingPost((prev) => ({
                        ...prev,
                        author: e.target.value,
                      }))
                    }
                    placeholder="Author name"
                    className="mt-2 border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <Label
                  htmlFor="excerpt"
                  className="text-gray-700 text-base font-medium"
                >
                  Excerpt *
                </Label>
                <div className="mt-2">
                  <RichTextEditor
                    content={editingPost.excerpt || ""}
                    onChange={(content) =>
                      setEditingPost((prev) => ({
                        ...prev,
                        excerpt: content,
                      }))
                    }
                    placeholder="Short description for preview..."
                    limit={300}
                  />
                </div>
              </div>

              {/* Content */}
              <div>
                <Label
                  htmlFor="content"
                  className="text-gray-700 text-base font-medium"
                >
                  Content *
                </Label>
                <div className="mt-2">
                  <RichTextEditor
                    content={editingPost.content || ""}
                    onChange={(content) =>
                      setEditingPost((prev) => ({
                        ...prev,
                        content,
                      }))
                    }
                    placeholder="Write your blog post content..."
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <Label className="text-gray-700 text-base font-medium">
                  Tags
                </Label>
                <div className="flex flex-col sm:flex-row gap-3 mt-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add a tag"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    className="border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddTag}
                    className="border-gray-200 hover:border-gray-300 whitespace-nowrap"
                  >
                    Add Tag
                  </Button>
                </div>
                {editingPost.tags && editingPost.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {editingPost.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer hover:bg-gray-200 transition-colors px-3 py-1"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        #{tag}
                        <X className="h-3 w-3 ml-2" />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Read Time & Settings */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <Label
                    htmlFor="readTime"
                    className="text-gray-700 text-base font-medium"
                  >
                    Read Time
                  </Label>
                  <Input
                    id="readTime"
                    value={editingPost.readTime || ""}
                    onChange={(e) =>
                      setEditingPost((prev) => ({
                        ...prev,
                        readTime: e.target.value,
                      }))
                    }
                    placeholder="5 min read"
                    className="mt-2 border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                  />
                </div>
                <div className="flex items-center gap-4 lg:col-span-2 pt-6">
                  <div className="flex items-center gap-3">
                    <Switch
                      id="published"
                      checked={editingPost.published || false}
                      onCheckedChange={(checked) =>
                        setEditingPost((prev) => ({
                          ...prev,
                          published: checked,
                        }))
                      }
                      className="data-[state=checked]:bg-teal-500"
                    />
                    <Label
                      htmlFor="published"
                      className="text-gray-700 cursor-pointer font-medium"
                    >
                      Publish
                    </Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      id="featured"
                      checked={editingPost.featured || false}
                      onCheckedChange={(checked) =>
                        setEditingPost((prev) => ({
                          ...prev,
                          featured: checked,
                        }))
                      }
                      className="data-[state=checked]:bg-yellow-500"
                    />
                    <Label
                      htmlFor="featured"
                      className="text-gray-700 cursor-pointer font-medium"
                    >
                      Featured
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
