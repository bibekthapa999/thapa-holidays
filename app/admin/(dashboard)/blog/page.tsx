"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Calendar,
  Loader2,
  Upload,
  X,
  FileText,
  Sparkles,
  TrendingUp,
  Filter,
  Grid,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

const defaultPost: Partial<BlogPost> = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  image: "",
  author: "",
  category: "",
  tags: [],
  featured: false,
  published: false,
  readTime: "",
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

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterPublished, setFilterPublished] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Form state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] =
    useState<Partial<BlogPost>>(defaultPost);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [tagInput, setTagInput] = useState("");

  // Delete state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch("/api/blog");
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to fetch blog posts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

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
      slug: prev?.id ? prev.slug : generateSlug(title),
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
      const method = editingPost.id ? "PUT" : "POST";
      const url = editingPost.id ? `/api/blog/${editingPost.id}` : "/api/blog";

      const body = {
        ...editingPost,
        publishedAt: editingPost.published ? new Date().toISOString() : null,
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error("Failed to save post");

      toast.success(
        editingPost.id
          ? "Post updated successfully"
          : "Post created successfully"
      );
      setIsDialogOpen(false);
      setEditingPost(defaultPost);
      fetchPosts();
    } catch (error) {
      console.error("Error saving post:", error);
      toast.error("Failed to save post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!postToDelete) return;

    try {
      const response = await fetch(`/api/blog/${postToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete post");

      toast.success("Post deleted successfully");
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
    } finally {
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    }
  };

  const togglePublished = async (post: BlogPost) => {
    try {
      const response = await fetch(`/api/blog/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          published: !post.published,
          publishedAt: !post.published ? new Date().toISOString() : null,
        }),
      });

      if (!response.ok) throw new Error("Failed to update post");

      toast.success(post.published ? "Post unpublished" : "Post published");
      fetchPosts();
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Failed to update post");
    }
  };

  const toggleFeatured = async (post: BlogPost) => {
    try {
      const response = await fetch(`/api/blog/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !post.featured }),
      });

      if (!response.ok) throw new Error("Failed to update post");

      toast.success(
        post.featured ? "Removed from featured" : "Added to featured"
      );
      fetchPosts();
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Failed to update post");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterCategory("all");
    setFilterPublished("all");
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || post.category === filterCategory;
    const matchesPublished =
      filterPublished === "all" ||
      (filterPublished === "published" && post.published) ||
      (filterPublished === "draft" && !post.published);

    return matchesSearch && matchesCategory && matchesPublished;
  });

  const stats = {
    total: posts.length,
    published: posts.filter((p) => p.published).length,
    featured: posts.filter((p) => p.featured).length,
    draft: posts.filter((p) => !p.published).length,
  };

  const activeFilters = [
    searchTerm && "Search",
    filterCategory !== "all" && "Category",
    filterPublished !== "all" && "Status",
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
                  Blog Posts
                </h1>
              </div>
              <p className="text-gray-600 mt-1">
                Manage and create travel blog content
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => {
                  setEditingPost(defaultPost);
                  setIsDialogOpen(true);
                }}
                className="h-9 bg-linear-to-r from-teal-500 to-yellow-500 hover:from-teal-600 hover:to-yellow-600 shadow-lg hover:shadow-xl"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
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
              title: "Total Posts",
              value: stats.total,
              icon: FileText,
              change: "+8",
              gradient: "from-blue-500 via-blue-600 to-indigo-600",
              bgGradient: "from-blue-50 to-indigo-50",
            },
            {
              title: "Published",
              value: stats.published,
              icon: Eye,
              change: "+5",
              gradient: "from-emerald-500 via-green-600 to-teal-600",
              bgGradient: "from-emerald-50 to-teal-50",
            },
            {
              title: "Featured",
              value: stats.featured,
              icon: Star,
              change: "+2",
              gradient: "from-amber-500 via-orange-600 to-yellow-600",
              bgGradient: "from-amber-50 to-orange-50",
            },
            {
              title: "Drafts",
              value: stats.draft,
              icon: EyeOff,
              change: stats.draft > 0 ? "Needs attention" : "All clear",
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
                        stat.title === "Drafts" && stats.draft > 0
                          ? "bg-amber-100"
                          : "bg-emerald-100"
                      }`}
                    >
                      <TrendingUp className="h-3 w-3 text-emerald-600" />
                      <span
                        className={`text-sm font-semibold ${
                          stat.title === "Drafts" && stats.draft > 0
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
                      placeholder="Search posts by title or excerpt..."
                      className="pl-11 h-11 bg-white/50 backdrop-blur-sm border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 sm:flex sm:flex-nowrap gap-3">
                    <Select
                      value={filterCategory}
                      onValueChange={setFilterCategory}
                    >
                      <SelectTrigger className="h-11 bg-white/50 backdrop-blur-sm border-gray-200">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={filterPublished}
                      onValueChange={setFilterPublished}
                    >
                      <SelectTrigger className="h-11 bg-white/50 backdrop-blur-sm border-gray-200">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
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

                {/* View Mode & Active Filters */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
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

                  <AnimatePresence>
                    {activeFilters > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex flex-wrap items-center gap-2"
                      >
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
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        )}
                        {filterCategory !== "all" && (
                          <Badge
                            variant="secondary"
                            className="bg-emerald-50 text-emerald-700 border-emerald-200"
                          >
                            Category: {filterCategory}
                            <button
                              onClick={() => setFilterCategory("all")}
                              className="ml-2 hover:text-emerald-900"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        )}
                        {filterPublished !== "all" && (
                          <Badge
                            variant="secondary"
                            className="bg-purple-50 text-purple-700 border-purple-200"
                          >
                            Status: {filterPublished}
                            <button
                              onClick={() => setFilterPublished("all")}
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
                      </motion.div>
                    )}
                  </AnimatePresence>
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
                {filteredPosts.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">
                {posts.length}
              </span>{" "}
              posts
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

        {/* Posts Grid/List */}
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
                  <div className="h-48 bg-linear-to-br from-gray-200 to-gray-300" />
                  <CardContent className="p-4 space-y-3">
                    <div className="h-5 bg-linear-to-r from-gray-200 to-gray-300 rounded w-3/4" />
                    <div className="h-4 bg-linear-to-r from-gray-200 to-gray-300 rounded w-1/2" />
                    <div className="h-4 bg-linear-to-r from-gray-200 to-gray-300 rounded w-1/3" />
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          ) : filteredPosts.length === 0 ? (
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
                    <FileText className="h-8 w-8 text-gray-400" />
                  </motion.div>
                  <p className="text-gray-700 font-medium mb-2">
                    No posts found
                  </p>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    {searchTerm ||
                    filterCategory !== "all" ||
                    filterPublished !== "all"
                      ? "Try adjusting your filters or search term"
                      : "Get started by creating your first blog post"}
                  </p>
                  <Button
                    onClick={() => {
                      setEditingPost(defaultPost);
                      setIsDialogOpen(true);
                    }}
                    className="bg-linear-to-r from-teal-500 to-yellow-500 hover:from-teal-600 hover:to-yellow-600 shadow-lg hover:shadow-xl"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Post
                  </Button>
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
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group bg-white">
                    <div className="relative h-48 overflow-hidden">
                      {post.image ? (
                        <motion.img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover"
                          initial={{ scale: 1 }}
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                        />
                      ) : (
                        <div className="w-full h-full bg-linear-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                          <FileText className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
                      <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                        {!post.published && (
                          <Badge className="bg-gray-100 text-gray-700 border-gray-200 shadow-sm">
                            Draft
                          </Badge>
                        )}
                        {post.featured && (
                          <Badge className="bg-linear-to-r from-yellow-500 to-amber-500 text-white border-0 shadow-sm">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex gap-2">
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8 bg-white/90 backdrop-blur-sm border-white/20 shadow-lg"
                            onClick={() => {
                              setEditingPost(post);
                              setIsDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8 bg-white/90 backdrop-blur-sm border-white/20 shadow-lg"
                            onClick={() => {
                              setPostToDelete(post);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <Badge
                        variant="outline"
                        className="bg-white/50 backdrop-blur-sm text-gray-700 border-gray-200 mb-2"
                      >
                        {post.category}
                      </Badge>
                      <h3 className="font-semibold text-gray-900 text-lg line-clamp-2 mb-2 group-hover:text-teal-600 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {post.views}
                          </div>
                          {post.readTime && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {post.readTime}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => togglePublished(post)}
                            className={`h-8 w-8 ${
                              post.published
                                ? "text-emerald-600"
                                : "text-gray-400"
                            }`}
                          >
                            {post.published ? (
                              <Eye className="h-4 w-4" />
                            ) : (
                              <EyeOff className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => toggleFeatured(post)}
                            className={`h-8 w-8 ${
                              post.featured
                                ? "text-yellow-500"
                                : "text-gray-400"
                            }`}
                          >
                            <Star className="h-4 w-4" />
                          </Button>
                        </div>
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
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -2 }}
                >
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group bg-white">
                    <div className="flex flex-col sm:flex-row">
                      <div className="relative w-full sm:w-48 h-48 sm:h-auto shrink-0">
                        {post.image ? (
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-linear-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                            <FileText className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                          {!post.published && (
                            <Badge className="bg-gray-100 text-gray-700 border-gray-200 shadow-sm">
                              Draft
                            </Badge>
                          )}
                          {post.featured && (
                            <Badge className="bg-linear-to-r from-yellow-500 to-amber-500 text-white border-0 shadow-sm">
                              Featured
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex-1 p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge
                                variant="outline"
                                className="bg-white/50 backdrop-blur-sm text-gray-700 border-gray-200"
                              >
                                {post.category}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {new Date(post.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-teal-600 transition-colors">
                              {post.title}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                              {post.excerpt}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Eye className="h-4 w-4" />
                              {post.views}
                            </div>
                            <div className="flex gap-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => togglePublished(post)}
                                className={`h-8 w-8 ${
                                  post.published
                                    ? "text-emerald-600"
                                    : "text-gray-400"
                                }`}
                              >
                                {post.published ? (
                                  <Eye className="h-4 w-4" />
                                ) : (
                                  <EyeOff className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => toggleFeatured(post)}
                                className={`h-8 w-8 ${
                                  post.featured
                                    ? "text-yellow-500"
                                    : "text-gray-400"
                                }`}
                              >
                                <Star className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => {
                                  setEditingPost(post);
                                  setIsDialogOpen(true);
                                }}
                                className="h-8 w-8"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => {
                                  setPostToDelete(post);
                                  setDeleteDialogOpen(true);
                                }}
                                className="h-8 w-8"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          {post.readTime && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {post.readTime}
                            </div>
                          )}
                          <div className="flex flex-wrap gap-1">
                            {post.tags?.map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Edit/Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {editingPost.id ? "Edit Blog Post" : "Create New Blog Post"}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Fill in the details for your blog post. All fields marked with *
              are required.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Image Upload */}
            <div>
              <Label className="text-gray-700">Featured Image</Label>
              <div className="mt-2">
                {editingPost.image ? (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-200">
                    <img
                      src={editingPost.image}
                      alt="Featured"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm"
                      onClick={() =>
                        setEditingPost((prev) => ({ ...prev, image: "" }))
                      }
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-teal-500 transition-all duration-300 bg-linear-to-br from-gray-50 to-white">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    {imageUploading ? (
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
                          Click to upload featured image
                        </span>
                        <span className="text-xs text-gray-400 mt-1">
                          Recommended: 1200x800px
                        </span>
                      </>
                    )}
                  </label>
                )}
              </div>
            </div>

            {/* Title & Slug */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title" className="text-gray-700">
                  Title *
                </Label>
                <Input
                  id="title"
                  value={editingPost.title || ""}
                  onChange={handleTitleChange}
                  placeholder="Enter post title"
                  className="mt-1 border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
              <div>
                <Label htmlFor="slug" className="text-gray-700">
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
                  className="mt-1 border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Category & Author */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-700">Category *</Label>
                <Select
                  value={editingPost.category || ""}
                  onValueChange={(value) =>
                    setEditingPost((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger className="mt-1 border-gray-200 focus:border-teal-500 focus:ring-teal-500">
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
                <Label htmlFor="author" className="text-gray-700">
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
                  className="mt-1 border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <Label htmlFor="excerpt" className="text-gray-700">
                Excerpt *
              </Label>
              <Textarea
                id="excerpt"
                value={editingPost.excerpt || ""}
                onChange={(e) =>
                  setEditingPost((prev) => ({
                    ...prev,
                    excerpt: e.target.value,
                  }))
                }
                placeholder="Short description for preview..."
                rows={3}
                className="mt-1 border-gray-200 focus:border-teal-500 focus:ring-teal-500"
              />
            </div>

            {/* Content */}
            <div>
              <Label htmlFor="content" className="text-gray-700">
                Content *
              </Label>
              <Textarea
                id="content"
                value={editingPost.content || ""}
                onChange={(e) =>
                  setEditingPost((prev) => ({
                    ...prev,
                    content: e.target.value,
                  }))
                }
                placeholder="Write your blog post content..."
                rows={10}
                className="mt-1 border-gray-200 focus:border-teal-500 focus:ring-teal-500 font-mono text-sm"
              />
            </div>

            {/* Tags */}
            <div>
              <Label className="text-gray-700">Tags</Label>
              <div className="flex gap-2 mt-1">
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
                  className="border-gray-200 hover:border-gray-300"
                >
                  Add
                </Button>
              </div>
              {editingPost.tags && editingPost.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {editingPost.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer hover:bg-gray-200 transition-colors"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      {tag}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Read Time & Settings */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="readTime" className="text-gray-700">
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
                  className="mt-1 border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
              <div className="flex items-center gap-4 pt-6">
                <div className="flex items-center gap-2">
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
                    className="text-gray-700 cursor-pointer"
                  >
                    Publish
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="featured"
                    checked={editingPost.featured || false}
                    onCheckedChange={(checked) =>
                      setEditingPost((prev) => ({ ...prev, featured: checked }))
                    }
                    className="data-[state=checked]:bg-yellow-500"
                  />
                  <Label
                    htmlFor="featured"
                    className="text-gray-700 cursor-pointer"
                  >
                    Featured
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSubmitting}
              className="border-gray-200 hover:border-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-linear-to-r from-teal-500 to-yellow-500 hover:from-teal-600 hover:to-yellow-600"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {editingPost.id ? "Updating..." : "Creating..."}
                </>
              ) : editingPost.id ? (
                "Update Post"
              ) : (
                "Create Post"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-gray-900">
              Delete Blog Post?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Are you sure you want to delete "{postToDelete?.title}"? This
              action cannot be undone.
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
              Delete Post
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}



