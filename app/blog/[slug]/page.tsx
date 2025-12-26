"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  User,
  Tag,
  ArrowLeft,
  Clock,
  Share2,
  Facebook,
  Twitter,
  Instagram,
  Eye,
  BookOpen,
  ChevronRight,
  Sparkles,
  PenTool,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
  views?: number;
}

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [isSharing, setIsSharing] = useState(false);

  const slug = params.slug as string;

  useEffect(() => {
    if (slug) {
      fetchPost();
      fetchRelatedPosts();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/blog/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setPost(data);
      } else {
        router.push("/blog");
      }
    } catch (error) {
      console.error("Error fetching blog post:", error);
      router.push("/blog");
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedPosts = async () => {
    try {
      const response = await fetch("/api/blog?published=true&limit=4");
      if (response.ok) {
        const data = await response.json();
        setRelatedPosts(data.filter((p: BlogPost) => p.slug !== slug));
      }
    } catch (error) {
      console.error("Error fetching related posts:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getReadTime = (content: string) => {
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

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

  const shareOnSocial = async (platform: string) => {
    if (!post) return;

    setIsSharing(true);
    const url = window.location.href;
    const text = `Check out this blog post: ${post.title}`;

    switch (platform) {
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url
          )}&quote=${encodeURIComponent(text)}`,
          "_blank"
        );
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            text
          )}&url=${encodeURIComponent(url)}`,
          "_blank"
        );
        break;
      case "instagram":
        try {
          await navigator.clipboard.writeText(`${text} ${url}`);
          alert("Link copied to clipboard! Share on Instagram manually.");
        } catch (error) {
          console.error("Failed to copy link:", error);
        }
        break;
    }
    setIsSharing(false);
  };

  const LoadingSkeleton = () => (
    <div className="min-h-screen pt-24 lg:pt-32 flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mb-4"></div>
        <p className="text-gray-600">Loading blog post...</p>
      </div>
    </div>
  );

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!post) {
    return (
      <div className="min-h-screen pt-24 lg:pt-32 flex items-center justify-center bg-white">
        <div className="text-center max-w-md px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Blog post not found
          </h1>
          <p className="text-gray-600 mb-6">
            The blog post you're looking for doesn't exist or has been moved.
          </p>
          <Button
            onClick={() => router.push("/blog")}
            className="bg-gradient-to-r from-teal-500 to-yellow-500 hover:from-teal-600 hover:to-yellow-600 text-white"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Blog
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 lg:pt-32 pb-20 bg-white">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-teal-500/5 to-yellow-500/5 -skew-y-3" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => router.push("/blog")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Blog</span>
          </Button>
        </motion.div>

        {/* Article Header */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          {/* Category Badge */}
          <div className="mb-4">
            <Badge
              className={cn(
                "border-0 font-medium px-4 py-2 mb-4",
                getCategoryColor(post.category)
              )}
            >
              {post.category}
            </Badge>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            {/* Author */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-r from-teal-100 to-yellow-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {post.author}
                </p>
                <p className="text-xs text-gray-500">Author</p>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-4 w-4 text-teal-500" />
              <span className="text-sm">{formatDate(post.publishedAt)}</span>
            </div>

            {/* Read Time */}
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="h-4 w-4 text-teal-500" />
              <span className="text-sm">{getReadTime(post.content)}</span>
            </div>

            {/* Views */}
            {post.views && (
              <div className="flex items-center gap-2 text-gray-600">
                <Eye className="h-4 w-4 text-teal-500" />
                <span className="text-sm">
                  {post.views.toLocaleString()} views
                </span>
              </div>
            )}
          </div>

          {/* Featured Image */}
          <div className="relative h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden mb-8 shadow-xl">
            {post.image ? (
              <>
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <span className="text-gray-500">No image available</span>
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <Tag className="h-4 w-4 text-teal-500" />
                Topics:
              </h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Share Section */}
          <div className="mb-8 p-4 bg-gradient-to-r from-teal-50 to-yellow-50 rounded-xl border border-teal-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-teal-600" />
                <span className="text-sm font-medium text-gray-900">
                  Share this article:
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => shareOnSocial("facebook")}
                  disabled={isSharing}
                  className="border-gray-300 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                >
                  {isSharing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Facebook className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => shareOnSocial("twitter")}
                  disabled={isSharing}
                  className="border-gray-300 hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200"
                >
                  {isSharing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Twitter className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => shareOnSocial("instagram")}
                  disabled={isSharing}
                  className="border-gray-300 hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200"
                >
                  {isSharing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Instagram className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </motion.article>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="prose prose-lg sm:prose-xl max-w-none mb-12"
        >
          <div
            className="leading-relaxed text-gray-700"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </motion.div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16"
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-gradient-to-r from-teal-500 to-yellow-500 rounded-lg">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                <span className="bg-gradient-to-r from-teal-600 to-yellow-600 bg-clip-text text-transparent">
                  Related
                </span>{" "}
                Articles
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.slice(0, 3).map((relatedPost, index) => (
                <motion.div
                  key={relatedPost.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card
                    className="group cursor-pointer overflow-hidden border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 h-full bg-white"
                    onClick={() => router.push(`/blog/${relatedPost.slug}`)}
                  >
                    {/* Image */}
                    <div className="relative h-40 overflow-hidden">
                      {relatedPost.image ? (
                        <>
                          <img
                            src={relatedPost.image}
                            alt={relatedPost.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                        </>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <BookOpen className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {formatDate(relatedPost.publishedAt)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-teal-600 hover:text-teal-700 group/btn"
                        >
                          Read
                          <ChevronRight className="h-3 w-3 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Back to Blog CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <Card className="border-0 bg-gradient-to-r from-teal-50 to-yellow-50 shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Discover More Stories
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Explore more travel tips, guides, and inspiring stories from our
                blog.
              </p>
              <Button
                onClick={() => router.push("/blog")}
                size="lg"
                className="group relative bg-gradient-to-r from-teal-500 to-yellow-500 hover:from-teal-600 hover:to-yellow-600 text-white rounded-full px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Explore All Articles
                  <motion.span
                    className="ml-2"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <ChevronRight className="h-5 w-5" />
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
      </div>
    </div>
  );
}
