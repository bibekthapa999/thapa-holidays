"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Phone,
  Mail,
  MessageCircle,
  MapPin,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Destinations", href: "/destinations" },
  { name: "Packages", href: "/packages" },
  { name: "About", href: "/about" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

const siteConfig = {
  companyName: "Thapa Holidays",
  phone: "+91 9002660557",
  email: "thapa.holidays09@gmail.com",
  whatsapp: "919002660557",
  address: "Vastu Vihar, Near Steel Factory, Panchkulgari",
};

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Track scroll for header effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Top Information Bar - Desktop Only */}
      <div className="hidden lg:block bg-gradient-to-r from-teal-600 to-teal-500 text-white fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2 text-sm">
            <div className="flex items-center gap-6">
              <a
                href={`tel:${siteConfig.phone}`}
                className="flex items-center gap-2 hover:text-yellow-300 transition-colors duration-200"
              >
                <Phone className="h-3.5 w-3.5" />
                <span className="font-medium">{siteConfig.phone}</span>
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="flex items-center gap-2 hover:text-yellow-300 transition-colors duration-200"
              >
                <Mail className="h-3.5 w-3.5" />
                <span className="font-medium">{siteConfig.email}</span>
              </a>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-white/90">
                <Clock className="h-3.5 w-3.5" />
                <span>Mon - Sat: 9:00 AM - 7:00 PM</span>
              </div>
              <a
                href={`https://wa.me/${siteConfig.whatsapp}?text=Hi! I'm interested in your travel packages.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-1.5 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-200"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                <span className="font-medium">WhatsApp Us</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "fixed left-0 right-0 z-50 transition-all duration-300 bg-gray-900",
          scrolled ? "shadow-lg" : "",
          "lg:top-[48px] top-0"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center z-50">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <img
                  src="/logo-new.png"
                  alt="Thapa Holidays"
                  className="h-10 w-auto object-contain"
                />
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navigation.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-full",
                      isActive
                        ? "text-yellow-400 bg-gray-800"
                        : "text-gray-300 hover:text-yellow-400 hover:bg-gray-800"
                    )}
                  >
                    {item.name}
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-teal-500 rounded-full"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* CTA Buttons - Desktop */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                href="/contact"
                className="px-5 py-2 text-sm font-medium text-teal-500 border-2 border-teal-500 rounded-full hover:bg-teal-500 hover:text-white transition-all duration-300"
              >
                Get Quote
              </Link>
              <Link
                href="/packages"
                className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-yellow-500 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                Explore Packages
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden relative z-50 p-2 text-gray-300 hover:text-yellow-400 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
                onClick={() => setMobileMenuOpen(false)}
              />

              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="fixed top-0 right-0 bottom-0 w-full sm:w-80 bg-gray-900 shadow-2xl z-40 lg:hidden overflow-y-auto"
              >
                <div className="p-6 pt-24">
                  {/* Mobile Navigation */}
                  <nav className="space-y-2">
                    {navigation.map((item, index) => {
                      const isActive =
                        pathname === item.href ||
                        (item.href !== "/" && pathname.startsWith(item.href));

                      return (
                        <motion.div
                          key={item.name}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Link
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={cn(
                              "block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200",
                              isActive
                                ? "bg-gray-800 text-yellow-400 border-l-4 border-teal-500"
                                : "text-gray-300 hover:bg-gray-800 hover:text-yellow-400"
                            )}
                          >
                            {item.name}
                          </Link>
                        </motion.div>
                      );
                    })}
                  </nav>

                  {/* Mobile CTA Buttons */}
                  <div className="mt-6 space-y-3">
                    <Link
                      href="/packages"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full px-6 py-3 text-center text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-yellow-500 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      Explore Packages
                    </Link>
                    <Link
                      href="/contact"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full px-6 py-3 text-center text-sm font-medium text-teal-400 border-2 border-teal-500 rounded-lg hover:bg-teal-500 hover:text-white transition-all duration-300"
                    >
                      Get Quote
                    </Link>
                  </div>

                  {/* Mobile Contact Info */}
                  <div className="mt-8 pt-6 border-t border-gray-800 space-y-3">
                    <h3 className="text-sm font-semibold text-gray-400 mb-4">
                      Contact Us
                    </h3>

                    <a
                      href={`tel:${siteConfig.phone}`}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-full bg-teal-900/50 flex items-center justify-center group-hover:bg-teal-900 transition-colors">
                        <Phone className="h-4 w-4 text-teal-400" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Call Us</div>
                        <div className="text-sm font-medium text-gray-300">
                          {siteConfig.phone}
                        </div>
                      </div>
                    </a>

                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-full bg-yellow-900/50 flex items-center justify-center group-hover:bg-yellow-900 transition-colors">
                        <Mail className="h-4 w-4 text-yellow-400" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Email Us</div>
                        <div className="text-sm font-medium text-gray-300">
                          {siteConfig.email}
                        </div>
                      </div>
                    </a>

                    <a
                      href={`https://wa.me/${siteConfig.whatsapp}?text=Hi! I'm interested in your travel packages.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-full bg-green-900/50 flex items-center justify-center group-hover:bg-green-900 transition-colors">
                        <MessageCircle className="h-4 w-4 text-green-400" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">WhatsApp</div>
                        <div className="text-sm font-medium text-gray-300">
                          Chat with us
                        </div>
                      </div>
                    </a>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/50">
                      <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center shrink-0">
                        <MapPin className="h-4 w-4 text-gray-400" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Location</div>
                        <div className="text-sm font-medium text-gray-300">
                          {siteConfig.address}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
