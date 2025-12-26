"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Eye,
  Phone,
  Mail,
  Calendar,
  Check,
  X as XIcon,
  MoreHorizontal,
  Trash2,
  MessageSquare,
  Send,
  Sparkles,
  TrendingUp,
  User,
  Filter,
  MailOpen,
  HelpCircle,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { format } from "date-fns";

interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  type: string;
  destination: string | null;
  travelDate: string | null;
  travelers: string | null;
  budget: string | null;
  hotelType: string | null;
  groupSize: string | null;
  specialRequirements: string | null;
  notes: string | null;
  status: string;
  createdAt: string;
}

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
    y: -2,
    boxShadow: "0 8px 24px -4px rgba(0, 0, 0, 0.12)",
  },
};

const statusColors: Record<
  string,
  { bg: string; text: string; border: string; icon: any }
> = {
  NEW: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    icon: Mail,
  },
  READ: {
    bg: "bg-gray-50",
    text: "text-gray-700",
    border: "border-gray-200",
    icon: MailOpen,
  },
  RESPONDED: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    icon: Send,
  },
  RESOLVED: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    icon: Check,
  },
  SPAM: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
    icon: XIcon,
  },
};

const typeColors: Record<
  string,
  { bg: string; text: string; border: string; icon: any }
> = {
  CONTACT: {
    bg: "bg-teal-50",
    text: "text-teal-700",
    border: "border-teal-200",
    icon: Mail,
  },
  QUOTE: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    icon: Star,
  },
  SUPPORT: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
    icon: HelpCircle,
  },
  FEEDBACK: {
    bg: "bg-pink-50",
    text: "text-pink-700",
    border: "border-pink-200",
    icon: MessageSquare,
  },
};

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedContact, setSelectedContact] = useState<ContactInquiry | null>(
    null
  );
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await fetch("/api/contact");
      if (res.ok) {
        const data = await res.json();
        setContacts(data);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast.error("Failed to fetch contacts");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setContacts(contacts.map((c) => (c.id === id ? { ...c, status } : c)));
        if (selectedContact?.id === id) {
          setSelectedContact({ ...selectedContact, status });
        }
        toast.success("Status updated successfully!");
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const saveNotes = async (id: string) => {
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });

      if (res.ok) {
        setContacts(contacts.map((c) => (c.id === id ? { ...c, notes } : c)));
        if (selectedContact?.id === id) {
          setSelectedContact({ ...selectedContact, notes });
        }
        toast.success("Notes saved successfully!");
      }
    } catch (error) {
      toast.error("Failed to save notes");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(`/api/contact/${deleteId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setContacts(contacts.filter((c) => c.id !== deleteId));
        toast.success("Contact deleted successfully!");
        if (selectedContact?.id === deleteId) {
          setSelectedContact(null);
          setIsDialogOpen(false);
        }
      } else {
        toast.error("Failed to delete contact");
      }
    } catch (error) {
      toast.error("Failed to delete contact");
    } finally {
      setDeleteId(null);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setTypeFilter("all");
  };

  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    const matchesType = typeFilter === "all" || c.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: contacts.length,
    new: contacts.filter((c) => c.status === "NEW").length,
    quotes: contacts.filter((c) => c.type === "QUOTE").length,
    responded: contacts.filter((c) => c.status === "RESPONDED").length,
  };

  const activeFilters = [
    searchTerm && "Search",
    statusFilter !== "all" && "Status",
    typeFilter !== "all" && "Type",
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
                  Contact Inquiries
                </h1>
              </div>
              <p className="text-gray-600 mt-1">
                Manage contact forms, quote requests, and customer feedback
              </p>
            </div>
            {stats.new > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Badge className="bg-linear-to-r from-blue-500 to-indigo-500 text-white border-0 shadow-lg">
                  {stats.new} New Inquiry{stats.new !== 1 ? "ies" : ""}
                </Badge>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {[
            {
              title: "Total Inquiries",
              value: stats.total,
              icon: Mail,
              change: "+18%",
              gradient: "from-blue-500 via-blue-600 to-indigo-600",
              bgGradient: "from-blue-50 to-indigo-50",
            },
            {
              title: "New",
              value: stats.new,
              icon: MailOpen,
              change: stats.new > 0 ? "Needs attention" : "All clear",
              gradient: "from-emerald-500 via-green-600 to-teal-600",
              bgGradient: "from-emerald-50 to-teal-50",
            },
            {
              title: "Quote Requests",
              value: stats.quotes,
              icon: Star,
              change: "+7",
              gradient: "from-amber-500 via-orange-600 to-yellow-600",
              bgGradient: "from-amber-50 to-orange-50",
            },
            {
              title: "Responded",
              value: stats.responded,
              icon: Send,
              change: "+12",
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
                        stat.title === "New" && stats.new > 0
                          ? "bg-amber-100"
                          : "bg-emerald-100"
                      }`}
                    >
                      <TrendingUp className="h-3 w-3 text-emerald-600" />
                      <span
                        className={`text-sm font-semibold ${
                          stat.title === "New" && stats.new > 0
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
                      placeholder="Search by name, email, or message..."
                      className="pl-11 h-11 bg-white/50 backdrop-blur-sm border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 sm:flex sm:flex-nowrap gap-3">
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="h-11 bg-white/50 backdrop-blur-sm border-gray-200">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="NEW">New</SelectItem>
                        <SelectItem value="READ">Read</SelectItem>
                        <SelectItem value="RESPONDED">Responded</SelectItem>
                        <SelectItem value="RESOLVED">Resolved</SelectItem>
                        <SelectItem value="SPAM">Spam</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="h-11 bg-white/50 backdrop-blur-sm border-gray-200">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="CONTACT">Contact</SelectItem>
                        <SelectItem value="QUOTE">Quote</SelectItem>
                        <SelectItem value="SUPPORT">Support</SelectItem>
                        <SelectItem value="FEEDBACK">Feedback</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="hidden sm:flex h-11 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    >
                      <XIcon className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
                  </div>
                </div>

                {/* Active Filters */}
                <AnimatePresence>
                  {activeFilters > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pt-4 border-t border-gray-100"
                    >
                      <div className="flex flex-wrap items-center gap-2">
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
                              <XIcon className="h-3 w-3" />
                            </button>
                          </Badge>
                        )}
                        {statusFilter !== "all" && (
                          <Badge
                            variant="secondary"
                            className={`
                              ${statusColors[statusFilter]?.bg}
                              ${statusColors[statusFilter]?.text}
                              ${statusColors[statusFilter]?.border}
                            `}
                          >
                            Status: {statusFilter}
                            <button
                              onClick={() => setStatusFilter("all")}
                              className="ml-2"
                            >
                              <XIcon className="h-3 w-3" />
                            </button>
                          </Badge>
                        )}
                        {typeFilter !== "all" && (
                          <Badge
                            variant="secondary"
                            className={`
                              ${typeColors[typeFilter]?.bg}
                              ${typeColors[typeFilter]?.text}
                              ${typeColors[typeFilter]?.border}
                            `}
                          >
                            Type: {typeFilter}
                            <button
                              onClick={() => setTypeFilter("all")}
                              className="ml-2"
                            >
                              <XIcon className="h-3 w-3" />
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
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Mobile Clear Button */}
                <div className="sm:hidden flex items-center justify-between pt-4 border-t border-gray-100">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <XIcon className="h-4 w-4 mr-2" />
                    Clear filters
                  </Button>
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
                {filteredContacts.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">
                {contacts.length}
              </span>{" "}
              inquiries
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

        {/* Contacts List */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {[...Array(5)].map((_, i) => (
                <Card key={i} className="border-0 shadow-lg animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-gray-200 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/3" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                      </div>
                      <div className="h-8 bg-gray-200 rounded w-24" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          ) : filteredContacts.length === 0 ? (
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
                    <Mail className="h-8 w-8 text-gray-400" />
                  </motion.div>
                  <p className="text-gray-700 font-medium mb-2">
                    No inquiries found
                  </p>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    {searchTerm ||
                    statusFilter !== "all" ||
                    typeFilter !== "all"
                      ? "Try adjusting your filters or search term"
                      : "New inquiries will appear here"}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {filteredContacts.map((contact, index) => {
                const StatusIcon = statusColors[contact.status]?.icon || Mail;
                const TypeIcon = typeColors[contact.type]?.icon || Mail;
                return (
                  <motion.div
                    key={contact.id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card
                      className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group bg-white ${
                        contact.status === "NEW"
                          ? "border-l-4 border-l-blue-500"
                          : ""
                      }`}
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                          {/* Contact Info */}
                          <div className="flex-1">
                            <div className="flex items-start gap-4">
                              <motion.div
                                className="w-12 h-12 rounded-full bg-linear-to-br from-blue-400 via-teal-500 to-cyan-600 flex items-center justify-center text-white font-bold shadow-lg shrink-0"
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.6 }}
                              >
                                {contact.name[0].toUpperCase()}
                              </motion.div>
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                                  <h3 className="font-semibold text-gray-900 text-lg group-hover:text-teal-600 transition-colors">
                                    {contact.name}
                                  </h3>
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      className={`
                                      ${typeColors[contact.type]?.bg}
                                      ${typeColors[contact.type]?.text}
                                      ${typeColors[contact.type]?.border}
                                      border font-medium shadow-sm
                                    `}
                                    >
                                      <TypeIcon className="h-3 w-3 mr-1" />
                                      {contact.type}
                                    </Badge>
                                    <Badge
                                      className={`
                                      ${statusColors[contact.status]?.bg}
                                      ${statusColors[contact.status]?.text}
                                      ${statusColors[contact.status]?.border}
                                      border font-medium shadow-sm
                                    `}
                                    >
                                      <StatusIcon className="h-3 w-3 mr-1" />
                                      {contact.status}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                                  <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                    <span className="truncate">
                                      {contact.email}
                                    </span>
                                  </div>
                                  {contact.phone && (
                                    <div className="flex items-center gap-2">
                                      <Phone className="h-4 w-4 text-gray-400" />
                                      <span>{contact.phone}</span>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    <span>
                                      {format(
                                        new Date(contact.createdAt),
                                        "MMM d, yyyy h:mm a"
                                      )}
                                    </span>
                                  </div>
                                </div>
                                <div className="p-3 bg-linear-to-r from-gray-50 to-transparent rounded-lg border border-gray-100">
                                  <p className="text-gray-600 text-sm line-clamp-2">
                                    {contact.subject && (
                                      <strong className="text-gray-900">
                                        {contact.subject}:{" "}
                                      </strong>
                                    )}
                                    {contact.message}
                                  </p>
                                </div>

                                {/* Travel Details Preview */}
                                {(contact.destination ||
                                  contact.hotelType ||
                                  contact.budget) && (
                                  <div className="flex flex-wrap gap-2 mt-3">
                                    {contact.destination && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                                      >
                                        📍 {contact.destination}
                                      </Badge>
                                    )}
                                    {contact.hotelType && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs bg-teal-50 text-teal-700 border-teal-200"
                                      >
                                        🏨 {contact.hotelType.split(" ")[0]}
                                      </Badge>
                                    )}
                                    {contact.budget && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs bg-amber-50 text-amber-700 border-amber-200"
                                      >
                                        💰 {contact.budget}
                                      </Badge>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="lg:w-auto flex flex-col gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedContact(contact);
                                setNotes(contact.notes || "");
                                setIsDialogOpen(true);
                                if (contact.status === "NEW") {
                                  updateStatus(contact.id, "READ");
                                }
                              }}
                              className="w-full lg:w-auto border-slate-200 hover:border-slate-300"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                            <div className="flex gap-2">
                              {contact.phone && (
                                <>
                                  <Button
                                    onClick={() =>
                                      window.open(`tel:${contact.phone}`)
                                    }
                                    size="sm"
                                    className="flex-1 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                                  >
                                    <Phone className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    onClick={() =>
                                      window.open(
                                        `https://wa.me/${contact.phone?.replace(
                                          /\D/g,
                                          ""
                                        )}`,
                                        "_blank"
                                      )
                                    }
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 border-slate-200 hover:border-slate-300 bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                  >
                                    <MessageSquare className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                              <Button
                                onClick={() =>
                                  window.open(`mailto:${contact.email}`)
                                }
                                variant="outline"
                                size="sm"
                                className="flex-1 border-slate-200 hover:border-slate-300"
                              >
                                <Mail className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Contact Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedContact && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Contact Inquiry Details
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  Inquiry from {selectedContact.name}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                {/* Header Card */}
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-linear-to-br from-blue-400 via-teal-500 to-cyan-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                        {selectedContact.name[0].toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div>
                            <h4 className="font-bold text-xl text-gray-900">
                              {selectedContact.name}
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                              <div className="flex items-center gap-1">
                                <Mail className="h-4 w-4" />
                                {selectedContact.email}
                              </div>
                              {selectedContact.phone && (
                                <div className="flex items-center gap-1">
                                  <Phone className="h-4 w-4" />
                                  {selectedContact.phone}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Badge
                              className={`
                              ${typeColors[selectedContact.type]?.bg}
                              ${typeColors[selectedContact.type]?.text}
                              ${typeColors[selectedContact.type]?.border}
                              border font-medium text-lg py-2 px-4
                            `}
                            >
                              {(() => {
                                const TypeIcon =
                                  typeColors[selectedContact.type]?.icon;
                                return TypeIcon ? (
                                  <TypeIcon className="h-4 w-4 mr-1" />
                                ) : null;
                              })()}
                              {selectedContact.type}
                            </Badge>
                            <Badge
                              className={`
                              ${statusColors[selectedContact.status]?.bg}
                              ${statusColors[selectedContact.status]?.text}
                              ${statusColors[selectedContact.status]?.border}
                              border font-medium text-lg py-2 px-4
                            `}
                            >
                              {(() => {
                                const StatusIcon =
                                  statusColors[selectedContact.status]?.icon;
                                return StatusIcon ? (
                                  <StatusIcon className="h-4 w-4 mr-1" />
                                ) : null;
                              })()}
                              {selectedContact.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Details Grid */}
                <Card className="border-0 shadow-lg bg-linear-to-br from-teal-50 to-cyan-50">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-gray-900">
                      Travel Consultation Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedContact.hotelType && (
                        <div>
                          <p className="text-sm text-gray-500">Hotel Type</p>
                          <p className="font-medium text-gray-900">
                            {selectedContact.hotelType}
                          </p>
                        </div>
                      )}
                      {selectedContact.destination && (
                        <div>
                          <p className="text-sm text-gray-500">Destination</p>
                          <p className="font-medium text-gray-900">
                            {selectedContact.destination}
                          </p>
                        </div>
                      )}
                      {selectedContact.travelDate && (
                        <div>
                          <p className="text-sm text-gray-500">Travel Date</p>
                          <p className="font-medium text-gray-900">
                            {selectedContact.travelDate}
                          </p>
                        </div>
                      )}
                      {selectedContact.groupSize && (
                        <div>
                          <p className="text-sm text-gray-500">Group Size</p>
                          <p className="font-medium text-gray-900">
                            {selectedContact.groupSize}
                          </p>
                        </div>
                      )}
                      {selectedContact.budget && (
                        <div>
                          <p className="text-sm text-gray-500">Budget Range</p>
                          <p className="font-medium text-gray-900">
                            {selectedContact.budget}
                          </p>
                        </div>
                      )}
                    </div>
                    {selectedContact.specialRequirements && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-500 mb-2">
                          Special Requirements
                        </p>
                        <div className="p-3 bg-white rounded-lg border border-gray-200">
                          <p className="text-gray-700 whitespace-pre-wrap">
                            {selectedContact.specialRequirements}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Message Card */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-gray-900">
                      Message
                    </CardTitle>
                    {selectedContact.subject && (
                      <CardDescription className="text-gray-600">
                        Subject: {selectedContact.subject}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {selectedContact.message}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Status Update */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-gray-900">
                      Update Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(statusColors).map((status) => (
                        <Button
                          key={status}
                          variant={
                            selectedContact.status === status
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            updateStatus(selectedContact.id, status)
                          }
                          className={`
                            ${
                              selectedContact.status === status
                                ? statusColors[status]?.text.replace(
                                    "text-",
                                    "bg-"
                                  )
                                : ""
                            }
                          `}
                        >
                          {status}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Notes Section */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-gray-900">
                      Internal Notes
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Add private notes about this inquiry
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add internal notes about this inquiry..."
                      rows={4}
                      className="border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() => saveNotes(selectedContact.id)}
                        className="bg-linear-to-r from-teal-500 to-yellow-500 hover:from-teal-600 hover:to-yellow-600"
                      >
                        Save Notes
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="border-gray-200 hover:border-gray-300"
                          >
                            <MoreHorizontal className="h-4 w-4 mr-2" />
                            Quick Actions
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              updateStatus(selectedContact.id, "RESPONDED")
                            }
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Mark as Responded
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              updateStatus(selectedContact.id, "RESOLVED")
                            }
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Mark as Resolved
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              updateStatus(selectedContact.id, "SPAM")
                            }
                          >
                            <XIcon className="h-4 w-4 mr-2" />
                            Mark as Spam
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-rose-600 focus:text-rose-600"
                            onClick={() => setDeleteId(selectedContact.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Inquiry
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Actions */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-gray-900">
                      Contact Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        onClick={() =>
                          window.open(`mailto:${selectedContact.email}`)
                        }
                        className="flex-1"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Send Email
                      </Button>
                      {selectedContact.phone && (
                        <>
                          <Button
                            onClick={() =>
                              window.open(`tel:${selectedContact.phone}`)
                            }
                            className="flex-1 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                          >
                            <Phone className="h-4 w-4 mr-2" />
                            Call Customer
                          </Button>
                          <Button
                            onClick={() =>
                              window.open(
                                `https://wa.me/${selectedContact.phone?.replace(
                                  /\D/g,
                                  ""
                                )}`,
                                "_blank"
                              )
                            }
                            variant="outline"
                            className="flex-1 border-gray-200 hover:border-gray-300 bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            WhatsApp
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-gray-900">
              Delete Contact Inquiry
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Are you sure you want to delete this contact inquiry? This action
              cannot be undone.
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
              Delete Inquiry
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
