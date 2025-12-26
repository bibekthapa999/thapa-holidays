"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Package,
  MapPin,
  BookOpen,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Clock,
  Sparkles,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface DashboardStats {
  stats: {
    totalPackages: number;
    totalDestinations: number;
    totalEnquiries: number;
    totalBlogPosts: number;
    newEnquiries: number;
  };
  recentEnquiries: Array<{
    id: string;
    name: string;
    email: string;
    status: string;
    createdAt: string;
    package?: { name: string } | null;
  }>;
}

const statCards = [
  {
    title: "Total Enquiries",
    key: "totalEnquiries",
    icon: Mail,
    gradient: "from-blue-500 via-blue-600 to-indigo-600",
    bgGradient: "from-blue-50 to-indigo-50",
    change: "+12%",
    changeType: "positive" as const,
  },
  {
    title: "Active Packages",
    key: "totalPackages",
    icon: Package,
    gradient: "from-emerald-500 via-green-600 to-teal-600",
    bgGradient: "from-emerald-50 to-teal-50",
    change: "+3",
    changeType: "positive" as const,
  },
  {
    title: "Destinations",
    key: "totalDestinations",
    icon: MapPin,
    gradient: "from-purple-500 via-violet-600 to-purple-700",
    bgGradient: "from-purple-50 to-violet-50",
    change: "+2",
    changeType: "positive" as const,
  },
  {
    title: "Blog Posts",
    key: "totalBlogPosts",
    icon: BookOpen,
    gradient: "from-orange-500 via-amber-600 to-yellow-600",
    bgGradient: "from-orange-50 to-amber-50",
    change: "+5",
    changeType: "positive" as const,
  },
];

const quickActions = [
  {
    title: "Add New Package",
    href: "/admin/packages/new",
    icon: Package,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    title: "Add Destination",
    href: "/admin/destinations/new",
    icon: MapPin,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    title: "Write Blog Post",
    href: "/admin/blog/new",
    icon: BookOpen,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    title: "View All Enquiries",
    href: "/admin/enquiries",
    icon: Mail,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
];

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          const stats = await res.json();
          setData(stats);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "NEW":
      case "PENDING":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "CONTACTED":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "QUOTED":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "CONFIRMED":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "COMPLETED":
        return "bg-slate-100 text-slate-700 border-slate-200";
      case "CANCELLED":
      case "REJECTED":
        return "bg-rose-100 text-rose-700 border-rose-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
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
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50 p-4 sm:p-6 lg:p-8">
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
            <h1 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
              Welcome back, Admin!
            </h1>
          </div>
          <p className="text-slate-600 text-base sm:text-lg">
            Here's what's happening with your travel business today.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {statCards.map((stat, index) => (
            <motion.div key={stat.key} variants={itemVariants}>
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
                            {data?.stats[stat.key as keyof typeof data.stats] ||
                              0}
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
                        stat.changeType === "positive"
                          ? "bg-emerald-100"
                          : "bg-rose-100"
                      }`}
                    >
                      {stat.changeType === "positive" ? (
                        <ArrowUpRight className="h-3 w-3 text-emerald-600" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 text-rose-600" />
                      )}
                      <span
                        className={`text-sm font-semibold ${
                          stat.changeType === "positive"
                            ? "text-emerald-700"
                            : "text-rose-700"
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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <motion.div variants={itemVariants}>
            <Card className="border-0 shadow-sm hover:shadow-lg transition-shadow duration-300 h-full">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-slate-900">
                  Quick Actions
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Common tasks and shortcuts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                  >
                    <a href={action.href}>
                      <motion.div
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        className="group"
                      >
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-3 h-14 hover:bg-linear-to-r hover:from-slate-50 hover:to-slate-100 border border-transparent hover:border-slate-200 transition-all duration-300"
                        >
                          <div
                            className={`p-2 rounded-lg ${action.bgColor} group-hover:scale-110 transition-transform duration-300`}
                          >
                            <action.icon
                              className={`h-5 w-5 ${action.color}`}
                            />
                          </div>
                          <span className="font-medium text-slate-700 group-hover:text-slate-900">
                            {action.title}
                          </span>
                          {action.title === "View All Enquiries" &&
                            data?.stats.newEnquiries && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="ml-auto"
                              >
                                <Badge className="bg-rose-500 text-white border-0 shadow-sm">
                                  {data.stats.newEnquiries}
                                </Badge>
                              </motion.div>
                            )}
                        </Button>
                      </motion.div>
                    </a>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Enquiries */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="border-0 shadow-sm hover:shadow-lg transition-shadow duration-300 h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div>
                  <CardTitle className="text-xl font-bold text-slate-900">
                    Recent Enquiries
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Latest package enquiries
                  </CardDescription>
                </div>
                <a href="/admin/enquiries">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View All
                  </Button>
                </a>
              </CardHeader>
              <CardContent>
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 animate-pulse"
                        >
                          <div className="h-12 w-12 bg-slate-200 rounded-full" />
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-slate-200 rounded w-1/3" />
                            <div className="h-3 bg-slate-200 rounded w-1/2" />
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  ) : data?.recentEnquiries.length ? (
                    <motion.div
                      key="content"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-3"
                    >
                      {data.recentEnquiries.map((enquiry, index) => (
                        <motion.div
                          key={enquiry.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02, x: 4 }}
                          className="group"
                        >
                          <div className="flex items-center gap-4 p-4 rounded-xl bg-linear-to-r from-slate-50 to-transparent hover:from-slate-100 hover:to-slate-50 transition-all duration-300 border border-transparent hover:border-slate-200">
                            <motion.div
                              className="w-12 h-12 rounded-full bg-linear-to-br from-yellow-400 via-teal-500 to-teal-600 flex items-center justify-center text-white font-bold shadow-lg"
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.6 }}
                            >
                              {enquiry.name[0].toUpperCase()}
                            </motion.div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-slate-900 truncate group-hover:text-teal-700 transition-colors">
                                {enquiry.name}
                              </p>
                              <p className="text-sm text-slate-500 truncate">
                                {enquiry.package?.name || "General Enquiry"}
                              </p>
                            </div>
                            <div className="text-right space-y-1">
                              <Badge
                                className={`${getStatusColor(
                                  enquiry.status
                                )} border font-medium shadow-sm`}
                              >
                                {enquiry.status}
                              </Badge>
                              <div className="flex items-center gap-1 text-xs text-slate-500">
                                <Clock className="h-3 w-3" />
                                {new Date(enquiry.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-12"
                    >
                      <Mail className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500 font-medium">
                        No enquiries yet
                      </p>
                      <p className="text-sm text-slate-400 mt-1">
                        New enquiries will appear here
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
