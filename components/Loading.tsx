"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function LoadingBar() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900">
      <div className="flex flex-col items-center space-y-6">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative"
        >
          <Image
            src="/logo-new.png"
            alt="Thapa Holidays"
            width={120}
            height={48}
            className="object-contain"
            priority
          />
        </motion.div>

        {/* Loading Animation */}
        <div className="flex flex-col items-center space-y-4">
          {/* Spinner */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="relative"
          >
            <div className="w-12 h-12 border-4 border-slate-700 border-t-teal-400 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-slate-500 rounded-full animate-spin animation-delay-150"></div>
          </motion.div>

          {/* Loading Text */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="text-slate-300 text-sm font-medium tracking-wide"
          >
            Loading...
          </motion.p>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-slate-700/10"></div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-teal-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-slate-500/5 rounded-full blur-2xl"></div>
      </div>
    </div>
  );
}
