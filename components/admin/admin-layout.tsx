"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  MapPin,
  BookOpen,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown,
  Users,
  MessageSquare,
  Mail,
  Search,
  Loader2,
  Home,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Packages", href: "/admin/packages", icon: Package },
  { name: "Destinations", href: "/admin/destinations", icon: MapPin },
  { name: "Reviews", href: "/admin/reviews", icon: MessageSquare },
  { name: "Enquiries", href: "/admin/enquiries", icon: Mail },
  { name: "Contacts", href: "/admin/contacts", icon: MessageSquare },
  { name: "Blog", href: "/admin/blog", icon: BookOpen },
  { name: "Testimonials", href: "/admin/testimonials", icon: Users },
];

interface SearchResult {
  id: string;
  type:
    | "package"
    | "destination"
    | "enquiry"
    | "contact"
    | "blog"
    | "testimonial";
  title: string;
  subtitle: string;
  href: string;
  status: string;
}

const typeIcons: Record<string, React.ElementType> = {
  package: Package,
  destination: MapPin,
  enquiry: Mail,
  contact: MessageSquare,
  blog: BookOpen,
  testimonial: Users,
};

const typeColors: Record<string, string> = {
  package: "bg-emerald-100 text-emerald-700",
  destination: "bg-violet-100 text-violet-700",
  enquiry: "bg-blue-100 text-blue-700",
  contact: "bg-orange-100 text-orange-700",
  blog: "bg-pink-100 text-pink-700",
  testimonial: "bg-amber-100 text-amber-700",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [notificationCounts, setNotificationCounts] = useState({
    newEnquiries: 0,
    pendingReviews: 0,
    pendingTestimonials: 0,
  });
  const searchRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const fetchNotificationCounts = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      if (response.ok) {
        const data = await response.json();
        setNotificationCounts({
          newEnquiries: data.stats.newEnquiries,
          pendingReviews: data.stats.pendingReviews,
          pendingTestimonials: data.stats.pendingTestimonials,
        });
      }
    } catch (error) {
      console.error("Error fetching notification counts:", error);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchNotificationCounts();

    // Refresh notification counts every 30 seconds
    const interval = setInterval(fetchNotificationCounts, 30000);
    return () => clearInterval(interval);
  }, []);

  // Refresh counts when navigating to admin pages
  useEffect(() => {
    if (pathname.startsWith("/admin/")) {
      fetchNotificationCounts();
    }
  }, [pathname]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setIsSearching(true);
        try {
          const res = await fetch(
            `/api/admin/search?q=${encodeURIComponent(searchQuery)}`
          );
          if (res.ok) {
            const data = await res.json();
            setSearchResults(data.results || []);
            setShowSearchResults(true);
          }
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleResultClick = (href: string) => {
    setShowSearchResults(false);
    setSearchQuery("");
    router.push(href);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <style jsx global>{`
        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideDown {
          from {
            transform: translateY(-10px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        .animate-slide-in-left {
          animation: slideInLeft 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slide-down {
          animation: slideDown 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animate-slide-up {
          animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animate-scale-in {
          animation: scaleIn 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animate-shimmer {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #374151;
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #4b5563;
        }
        .nav-item {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .nav-item:hover {
          transform: translateX(4px);
        }
        .nav-item-active {
          animation: scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 transform transition-all duration-300 ease-out lg:translate-x-0",
          sidebarOpen
            ? "translate-x-0 animate-slide-in-left"
            : "-translate-x-full"
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-yellow-500/5 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(20,184,166,0.05),transparent_50%)] pointer-events-none" />

        {/* Logo */}
        <div className="relative flex flex-col h-20 items-start justify-center gap-2 px-6 border-b border-gray-800/50">
          <Link href="/admin" className="flex items-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <img
                src="/logo-new.png"
                alt="Thapa Holidays"
                className="h-8 w-auto object-contain"
              />
            </motion.div>
          </Link>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <Sparkles className="h-3 w-3 animate-pulse" />
            Admin Panel
          </p>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden absolute right-4 top-4 text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-200 hover:scale-105"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 scrollbar-thin">
          <ul className="space-y-2">
            {navigation.map((item, index) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <li
                  key={item.name}
                  style={{
                    animation: mounted
                      ? `slideUp 0.3s ease-out ${index * 0.05}s both`
                      : "none",
                  }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "nav-item relative flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium group overflow-hidden",
                      isActive
                        ? "bg-gradient-to-r from-yellow-500/10 via-teal-500/10 to-yellow-500/10 text-white shadow-lg shadow-teal-500/10 nav-item-active"
                        : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                    )}
                    onClick={() => setSidebarOpen(false)}
                    onMouseEnter={() => setHoveredNav(item.name)}
                    onMouseLeave={() => setHoveredNav(null)}
                  >
                    {isActive && (
                      <>
                        <div className="absolute inset-0 border border-teal-500/30 rounded-xl" />
                        <div className="absolute inset-0 animate-shimmer" />
                      </>
                    )}
                    <item.icon
                      className={cn(
                        "h-5 w-5 transition-all duration-300 relative z-10",
                        isActive
                          ? "text-teal-400"
                          : "text-gray-500 group-hover:text-teal-400",
                        hoveredNav === item.name &&
                          !isActive &&
                          "scale-110 rotate-12"
                      )}
                    />
                    <span className="relative z-10">{item.name}</span>
                    {/* Notification badges */}
                    {item.name === "Enquiries" &&
                      notificationCounts.newEnquiries > 0 && (
                        <span className="relative z-10 ml-auto h-5 w-5 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                          {notificationCounts.newEnquiries}
                        </span>
                      )}
                    {item.name === "Reviews" &&
                      notificationCounts.pendingReviews > 0 && (
                        <span className="relative z-10 ml-auto h-5 w-5 rounded-full bg-orange-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                          {notificationCounts.pendingReviews}
                        </span>
                      )}
                    {item.name === "Testimonials" &&
                      notificationCounts.pendingTestimonials > 0 && (
                        <span className="relative z-10 ml-auto h-5 w-5 rounded-full bg-purple-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                          {notificationCounts.pendingTestimonials}
                        </span>
                      )}
                    {isActive && (
                      <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User section */}
        <div className="relative border-t border-gray-800/50 p-4 backdrop-blur-sm">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-gray-800/30 border border-gray-800/50 hover:bg-gray-800/40 transition-all duration-300 hover:border-gray-700/50 group">
            <Avatar className="h-10 w-10 ring-2 ring-teal-500/20 transition-all duration-300 group-hover:ring-teal-500/40 group-hover:scale-105">
              <AvatarImage src={session?.user?.image || ""} />
              <AvatarFallback className="bg-gradient-to-br from-yellow-500 to-teal-500 text-white font-semibold">
                {session?.user?.name?.[0] || "A"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {session?.user?.name || "Admin"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {session?.user?.email || "admin@thapaholidays.com"}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 mt-3 rounded-xl transition-all duration-300 hover:translate-x-1 hover:shadow-lg hover:shadow-red-500/10"
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/80 border-b border-gray-200/50 shadow-sm animate-slide-down">
          <div className="flex h-16 items-center gap-4 px-4 sm:px-6 lg:px-8">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-110 hover:rotate-90"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="flex-1 flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3 animate-scale-in">
                <div className="h-8 w-1 bg-gradient-to-b from-yellow-500 to-teal-500 rounded-full animate-float" />
                <h2 className="text-lg font-bold text-gray-900">
                  {navigation.find(
                    (item) =>
                      pathname === item.href ||
                      (item.href !== "/admin" && pathname.startsWith(item.href))
                  )?.name || "Dashboard"}
                </h2>
              </div>

              {/* Search */}
              <div
                ref={searchRef}
                className="relative flex-1 max-w-md animate-scale-in"
                style={{ animationDelay: "0.1s" }}
              >
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-teal-500 transition-all duration-300 group-focus-within:scale-110" />
                  <Input
                    type="text"
                    placeholder="Search everything..."
                    className="pl-10 pr-10 h-11 bg-gray-50/50 border-gray-200/50 focus:bg-white focus:border-teal-500/30 focus:ring-2 focus:ring-teal-500/20 rounded-xl transition-all duration-300 focus:shadow-lg focus:shadow-teal-500/10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setShowSearchResults(true)}
                    onBlur={() => {
                      // Delay hiding to allow click on results
                      setTimeout(() => setShowSearchResults(false), 200);
                    }}
                  />
                  {isSearching && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-500 animate-spin" />
                  )}
                </div>

                {/* Search Results */}
                {showSearchResults && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200/50 max-h-96 overflow-y-auto z-50 backdrop-blur-xl animate-slide-down">
                    {isSearching ? (
                      <div className="p-6 text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-teal-500" />
                        <p className="text-sm text-gray-500">Searching...</p>
                      </div>
                    ) : searchResults.length > 0 ? (
                      searchResults.map((result, index) => {
                        const Icon = typeIcons[result.type] || Package;
                        return (
                          <button
                            key={`${result.type}-${result.id}`}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-teal-50/50 hover:to-yellow-50/50 transition-all duration-300 text-left border-b border-gray-100 last:border-0 first:rounded-t-2xl last:rounded-b-2xl group"
                            onClick={() => handleResultClick(result.href)}
                            style={{
                              animation: `slideUp 0.2s ease-out ${
                                index * 0.05
                              }s both`,
                            }}
                          >
                            <div
                              className={cn(
                                "p-2.5 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg",
                                typeColors[result.type]
                              )}
                            >
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 truncate text-sm group-hover:text-teal-600 transition-colors">
                                {result.title}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {result.subtitle}
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className="text-xs capitalize px-2.5 py-0.5 rounded-full transition-all duration-300 group-hover:border-teal-500 group-hover:text-teal-600 group-hover:scale-105"
                            >
                              {result.type}
                            </Badge>
                          </button>
                        );
                      })
                    ) : searchQuery.length >= 2 ? (
                      <div className="p-6 text-center">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-3">
                          <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-500">
                          No results found for &quot;{searchQuery}&quot;
                        </p>
                      </div>
                    ) : (
                      <div className="p-6 text-center">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center mx-auto mb-3">
                          <Search className="h-5 w-5 text-teal-500" />
                        </div>
                        <p className="text-sm text-gray-500">
                          Start typing to search...
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div
              className="flex items-center gap-2 animate-scale-in"
              style={{ animationDelay: "0.2s" }}
            >
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative hover:bg-gray-100 rounded-xl transition-all duration-300 hover:scale-110 group"
                  >
                    <Bell className="h-5 w-5 group-hover:animate-pulse" />
                    {notificationCounts.newEnquiries +
                      notificationCounts.pendingReviews +
                      notificationCounts.pendingTestimonials >
                      0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-[10px] font-bold text-white flex items-center justify-center shadow-lg animate-pulse">
                        {notificationCounts.newEnquiries +
                          notificationCounts.pendingReviews +
                          notificationCounts.pendingTestimonials}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-64 p-2 bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-xl rounded-xl"
                >
                  <DropdownMenuLabel className="font-semibold text-gray-900 px-3 py-2">
                    Notifications
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-2" />

                  {/* New Enquiries */}
                  <DropdownMenuItem
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-teal-50 cursor-pointer transition-colors"
                    onClick={() => router.push("/admin/enquiries")}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                        <Mail className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          New Enquiries
                        </p>
                        <p className="text-xs text-gray-500">
                          Pending enquiries
                        </p>
                      </div>
                    </div>
                    {notificationCounts.newEnquiries > 0 && (
                      <span className="h-6 w-6 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center">
                        {notificationCounts.newEnquiries}
                      </span>
                    )}
                  </DropdownMenuItem>

                  {/* Pending Reviews */}
                  <DropdownMenuItem
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-orange-50 cursor-pointer transition-colors"
                    onClick={() => router.push("/admin/reviews")}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
                        <MessageSquare className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Pending Reviews
                        </p>
                        <p className="text-xs text-gray-500">
                          Awaiting approval
                        </p>
                      </div>
                    </div>
                    {notificationCounts.pendingReviews > 0 && (
                      <span className="h-6 w-6 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center">
                        {notificationCounts.pendingReviews}
                      </span>
                    )}
                  </DropdownMenuItem>

                  {/* Pending Testimonials */}
                  <DropdownMenuItem
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-purple-50 cursor-pointer transition-colors"
                    onClick={() => router.push("/admin/testimonials")}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                        <Users className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Pending Testimonials
                        </p>
                        <p className="text-xs text-gray-500">
                          Awaiting approval
                        </p>
                      </div>
                    </div>
                    {notificationCounts.pendingTestimonials > 0 && (
                      <span className="h-6 w-6 rounded-full bg-purple-500 text-white text-xs font-bold flex items-center justify-center">
                        {notificationCounts.pendingTestimonials}
                      </span>
                    )}
                  </DropdownMenuItem>

                  {notificationCounts.newEnquiries +
                    notificationCounts.pendingReviews +
                    notificationCounts.pendingTestimonials ===
                    0 && (
                    <>
                      <DropdownMenuSeparator className="my-2" />
                      <div className="px-3 py-4 text-center text-gray-500 text-sm">
                        <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                        All caught up! No pending notifications.
                      </div>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="gap-2 hover:bg-gray-100 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-md"
                  >
                    <Avatar className="h-8 w-8 ring-2 ring-teal-500/20 transition-all duration-300 hover:ring-teal-500/40">
                      <AvatarImage src={session?.user?.image || ""} />
                      <AvatarFallback className="bg-gradient-to-br from-yellow-500 to-teal-500 text-white text-xs font-semibold">
                        {session?.user?.name?.[0] || "A"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline-block text-sm font-medium">
                      {session?.user?.name || "Admin"}
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-300 group-hover:rotate-180" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 rounded-xl animate-slide-down"
                >
                  <DropdownMenuLabel className="font-semibold">
                    My Account
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    asChild
                    className="cursor-pointer transition-all duration-200 hover:pl-4"
                  >
                    <Link href="/admin/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="cursor-pointer transition-all duration-200 hover:pl-4"
                  >
                    <Link href="/" target="_blank">
                      <Home className="mr-2 h-4 w-4" />
                      View Website
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer transition-all duration-200 hover:pl-4"
                    onClick={() => signOut({ callbackUrl: "/admin/login" })}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main
          className={cn(
            pathname === "/admin" ? "p-0" : "p-4 sm:p-6 lg:p-8",
            "animate-slide-up"
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
