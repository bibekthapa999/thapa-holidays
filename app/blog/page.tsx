"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  User,
  Tag,
  ArrowRight,
  Search,
  Filter,
  BookOpen,
  PenTool,
  Sparkles,
  ChevronRight,
  X,
  Loader2,
  Globe,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, stripHtml } from "@/lib/utils";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string | null;
  category: string;
  tags: string[];
  author: string;
  publishedAt: string;
  published: boolean;
}

export default function BlogPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedFeatured, setSelectedFeatured] = useState("all");
  const [hoveredPost, setHoveredPost] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory, selectedFeatured]);

  const fetchPosts = async () => {
    try {
      let url = "/api/blog?published=true";
      if (selectedCategory !== "all") {
        url += `&category=${selectedCategory}`;
      }
      if (selectedFeatured !== "all") {
        url += `&featured=${selectedFeatured}`;
      }
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setPosts(data || []);
      }
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stripHtml(post.excerpt).toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const categories = [...new Set(posts.map((post) => post.category))];
  const featuredOptions = [
    { value: "all", label: "All Posts" },
    { value: "true", label: "Featured Only" },
    { value: "false", label: "Regular Only" },
  ];

  const getCategoryColor = (category: string) => {
    switch (category?.toUpperCase()) {
      case "TRAVEL":
        return "bg-gradient-to-r from-teal-500 to-yellow-500 text-white";
      case "GUIDE":
        return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white";
      case "EXPERIENCE":
        return "bg-gradient-to-r from-purple-500 to-pink-500 text-white";
      case "CULTURE":
        return "bg-gradient-to-r from-orange-500 to-red-500 text-white";
      case "TIPS":
        return "bg-gradient-to-r from-green-500 to-emerald-500 text-white";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-700 text-white";
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedFeatured("all");
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
      },
    },
  };

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="overflow-hidden border-0 shadow-lg">
          <div className="h-48 bg-gray-200 animate-pulse" />
          <CardContent className="p-6">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-3 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-5/6 mb-4 animate-pulse" />
            <div className="flex justify-between">
              <div className="h-8 bg-gray-200 rounded w-24 animate-pulse" />
              <div className="h-8 bg-gray-200 rounded w-20 animate-pulse" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen pt-24 lg:pt-32 pb-20 bg-gradient-to-b from-white via-gray-50/50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500/10 to-yellow-500/10 border border-teal-200/50 rounded-full text-sm font-medium mb-4 backdrop-blur-sm mt-5"
          >
            <BookOpen className="h-4 w-4 text-teal-600" />
            <span className="bg-gradient-to-r from-teal-600 to-yellow-600 bg-clip-text text-transparent font-semibold ">
              Travel Insights
            </span>
            <PenTool className="h-4 w-4 text-yellow-600" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 px-4 sm:px-0"
          >
            Travel{" "}
            <span className="bg-gradient-to-r from-teal-600 to-yellow-600 bg-clip-text text-transparent">
              Blog
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto px-4 sm:px-0"
          >
            Discover travel stories, expert tips, and inspiring insights from
            our adventures around the world
          </motion.p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8 flex justify-center"
        >
          <Card className="border border-gray-100 shadow-lg bg-white/80 backdrop-blur-sm max-w-4xl w-full">
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                {/* Search Input */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Blog Posts
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search blog posts, tips, stories..."
                      className="pl-10 h-9 bg-gray-50 border-gray-200 focus:border-teal-500 focus:ring-teal-500 text-sm w-full"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 hover:bg-gray-100 rounded-full p-1 transition-colors"
                      >
                        <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <div className="relative">
                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger className="pl-10 h-9 bg-gray-50 border-gray-200 focus:border-teal-500 focus:ring-teal-500 w-full">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            <span className="capitalize">
                              {category.toLowerCase()}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Featured Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Featured
                  </label>
                  <div className="relative">
                    <Select
                      value={selectedFeatured}
                      onValueChange={setSelectedFeatured}
                    >
                      <SelectTrigger className="pl-10 h-9 bg-gray-50 border-gray-200 focus:border-teal-500 focus:ring-teal-500 w-full">
                        <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <SelectValue placeholder="All Posts" />
                      </SelectTrigger>
                      <SelectContent>
                        {featuredOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Clear Filters Button - Always visible */}
              <div className="flex justify-center mt-4">
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  className="h-9 border-gray-200 hover:bg-gray-50 text-gray-700 px-6"
                  disabled={
                    !searchTerm &&
                    selectedCategory === "all" &&
                    selectedFeatured === "all"
                  }
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear All Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Count and Active Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div>
            <p className="text-gray-600">
              Showing{" "}
              <span className="font-semibold bg-gradient-to-r from-teal-600 to-yellow-600 bg-clip-text text-transparent">
                {filteredPosts.length}
              </span>{" "}
              article{filteredPosts.length !== 1 ? "s" : ""}
            </p>
          </div>

          {(searchTerm ||
            selectedCategory !== "all" ||
            selectedFeatured !== "all") && (
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <Badge
                  variant="outline"
                  className="bg-teal-50 text-teal-700 border-teal-200"
                >
                  Search: "{searchTerm}"
                </Badge>
              )}
              {selectedCategory !== "all" && (
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200 capitalize"
                >
                  Category: {selectedCategory.toLowerCase()}
                </Badge>
              )}
              {selectedFeatured !== "all" && (
                <Badge
                  variant="outline"
                  className="bg-purple-50 text-purple-700 border-purple-200"
                >
                  {selectedFeatured === "true"
                    ? "Featured Only"
                    : "Regular Only"}
                </Badge>
              )}
            </div>
          )}
        </motion.div>

        {/* Blog Posts Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <LoadingSkeleton />
          ) : filteredPosts.length > 0 ? (
            <motion.div
              key="blog-grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  variants={itemVariants}
                  onMouseEnter={() => setHoveredPost(post.id)}
                  onMouseLeave={() => setHoveredPost(null)}
                >
                  <Card
                    className="group relative cursor-pointer overflow-hidden border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white h-full p-0"
                    onClick={() => router.push(`/blog/${post.slug}`)}
                  >
                    {/* Hover gradient overlay */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"
                      animate={{
                        scale: hoveredPost === post.id ? 1.1 : 1,
                      }}
                    />

                    {/* Image */}
                    <div className="relative h-48 overflow-hidden w-full m-0 p-0">
                      {post.image ? (
                        <>
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        </>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <div className="text-center">
                            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                            <span className="text-gray-500 text-sm">
                              No image available
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Category Badge */}
                      <div className="absolute top-3 left-3 z-10">
                        <Badge
                          className={cn(
                            "border-0 shadow-sm font-medium px-3 py-1.5",
                            getCategoryColor(post.category)
                          )}
                        >
                          <Tag className="h-3 w-3 mr-1.5" />
                          {post.category}
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <CardContent className="p-6 bg-white relative z-10">
                      {/* Post Title */}
                      <motion.div
                        animate={{
                          y: hoveredPost === post.id ? -3 : 0,
                        }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <h2 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors line-clamp-2">
                          {post.title}
                        </h2>
                      </motion.div>

                      {/* Excerpt */}
                      <div className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed prose prose-sm max-w-none [&>*]:my-1 [&>p]:leading-relaxed [&>strong]:font-semibold [&>em]:italic">
                        <div
                          dangerouslySetInnerHTML={{ __html: post.excerpt }}
                        />
                      </div>

                      {/* Meta Information */}
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center">
                            <User className="h-3 w-3 mr-1.5 text-teal-500" />
                            <span className="font-medium">{post.author}</span>
                          </div>
                          <div className="h-3 w-px bg-gray-300" />
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1.5 text-teal-500" />
                            <span className="font-medium">
                              {new Date(post.publishedAt).toLocaleDateString(
                                "en-US",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1.5">
                            {post.tags.slice(0, 3).map((tag, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="text-xs bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                              >
                                #{tag}
                              </Badge>
                            ))}
                            {post.tags.length > 3 && (
                              <Badge
                                variant="outline"
                                className="text-xs bg-gray-50 text-gray-600 border-gray-200"
                              >
                                +{post.tags.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>

                    {/* CTA Footer */}
                    <CardFooter className="px-6 pb-6 pt-0 bg-white relative z-10">
                      <Button
                        variant="ghost"
                        className="w-full group/btn bg-gradient-to-r from-teal-50 to-yellow-50 hover:from-teal-500 hover:to-yellow-500 hover:text-white text-teal-600 border border-teal-100 rounded-full px-4 py-2 shadow-sm hover:shadow transition-all duration-300 justify-start"
                      >
                        <span className="text-sm font-medium">
                          Read Article
                        </span>
                        <motion.span
                          className="ml-auto"
                          animate={{
                            x: hoveredPost === post.id ? 5 : 0,
                          }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                        </motion.span>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-16"
            >
              <Card className="max-w-md mx-auto border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                    <Search className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No articles found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your search or filter criteria
                  </p>
                  <Button
                    onClick={clearFilters}
                    size="lg"
                    className="group relative bg-gradient-to-r from-teal-500 to-yellow-500 hover:from-teal-600 hover:to-yellow-600 text-white rounded-full px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center">
                      Clear All Filters
                      <motion.span
                        className="ml-2"
                        animate={{ rotate: [0, 180, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        <X className="h-5 w-5" />
                      </motion.span>
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-teal-600 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={false}
                    />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Newsletter CTA */}
        {!loading && filteredPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-16 text-center"
          >
            <Card className="border-0 bg-gradient-to-r from-teal-50 to-yellow-50 shadow-lg">
              <CardContent className="p-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full text-sm font-medium mb-4">
                  <Sparkles className="h-4 w-4 text-teal-600" />
                  Stay Updated
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Never Miss a Story
                </h3>
                <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                  Subscribe to our newsletter for the latest travel tips,
                  stories, and exclusive offers
                </p>
                <Button
                  size="lg"
                  className="group relative bg-gradient-to-r from-teal-500 to-yellow-500 hover:from-teal-600 hover:to-yellow-600 text-white rounded-full px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    Subscribe to Newsletter
                    <motion.span
                      className="ml-2"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <ArrowRight className="h-5 w-5" />
                    </motion.span>
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-teal-600 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                  />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
