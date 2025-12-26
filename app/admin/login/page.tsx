"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  AtSign,
  Key,
  Eye,
  EyeOff,
  Loader2,
  Sparkles,
  Shield,
  KeyRound,
  UserCheck,
  ArrowRight,
  CheckCircle,
  Globe,
  Mountain,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStep(2);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid email or password");
        setStep(1);
      } else {
        setStep(3);
        setTimeout(() => {
          setShowSuccess(true);
          toast.success("Login successful! Welcome back!");
          setTimeout(() => {
            router.push("/admin");
            router.refresh();
          }, 1000);
        }, 800);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 via-white to-gray-50 p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-linear-to-br from-yellow-400/20 to-yellow-600/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-linear-to-br from-teal-400/20 to-teal-600/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Floating Icons */}
        <motion.div
          className="absolute top-1/4 left-1/4"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Globe className="h-8 w-8 text-teal-400/30" />
        </motion.div>
        <motion.div
          className="absolute top-1/3 right-1/4"
          animate={{
            y: [0, 20, 0],
            rotate: [0, -15, 15, 0],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        >
          <Mountain className="h-8 w-8 text-yellow-400/30" />
        </motion.div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-lg"
      >
        {/* Login Steps Progress */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-center gap-8">
            {[1, 2, 3].map((stepNum) => (
              <motion.div
                key={stepNum}
                className="flex flex-col items-center"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                    step >= stepNum
                      ? "bg-linear-to-br from-teal-500 to-yellow-500"
                      : "bg-white border-2 border-gray-200"
                  }`}
                  initial={false}
                  animate={{
                    scale: step === stepNum ? [1, 1.1, 1] : 1,
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: step === stepNum ? 1 : 0,
                  }}
                >
                  {stepNum === 1 && (
                    <UserCheck
                      className={`h-5 w-5 ${
                        step >= stepNum ? "text-white" : "text-gray-400"
                      }`}
                    />
                  )}
                  {stepNum === 2 && (
                    <Key
                      className={`h-5 w-5 ${
                        step >= stepNum ? "text-white" : "text-gray-400"
                      }`}
                    />
                  )}
                  {stepNum === 3 && (
                    <Shield
                      className={`h-5 w-5 ${
                        step >= stepNum ? "text-white" : "text-gray-400"
                      }`}
                    />
                  )}
                </motion.div>
                <span
                  className={`text-sm mt-2 font-medium ${
                    step >= stepNum ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {stepNum === 1
                    ? "Credentials"
                    : stepNum === 2
                    ? "Verifying"
                    : "Access"}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Login Card */}
        <Card className="border-0 shadow-2xl backdrop-blur-xl bg-linear-to-br from-white via-white to-gray-50/90 overflow-hidden">
          <div className="absolute top-0 right-0">
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <div className="w-64 h-64 bg-linear-to-br from-yellow-500/10 to-teal-500/10 rounded-full -mr-32 -mt-32" />
            </motion.div>
          </div>

          <CardHeader className="text-center relative z-10">
            <motion.div
              variants={itemVariants}
              className="flex justify-center mb-4"
            >
              <div className="relative">
                <motion.div
                  animate={{
                    rotate: [0, 14, -8, 14, -4, 10, 0],
                  }}
                  transition={{
                    duration: 2.5,
                    ease: "easeInOut",
                    times: [0, 0.2, 0.4, 0.6, 0.8, 0.9, 1],
                  }}
                  className="w-20 h-20 rounded-2xl bg-linear-to-br from-yellow-500 to-teal-500 flex items-center justify-center shadow-2xl"
                >
                  <MapPin className="h-10 w-10 text-white" />
                </motion.div>
                <motion.div
                  className="absolute -top-2 -right-2"
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Sparkles className="h-6 w-6 text-yellow-500" />
                </motion.div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <CardTitle className="text-3xl font-bold bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                Welcome Back
              </CardTitle>
            </motion.div>

            <motion.div variants={itemVariants}>
              <CardDescription className="text-gray-600 text-lg mt-2">
                Sign in to Thapa Holidays Admin Panel
              </CardDescription>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-2">
              <Badge className="bg-linear-to-r from-teal-100 to-yellow-100 text-teal-700 border-teal-200">
                <Shield className="h-3 w-3 mr-1" />
                Secure Admin Access
              </Badge>
            </motion.div>
          </CardHeader>

          <CardContent className="relative z-10">
            <AnimatePresence mode="wait">
              {showSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center py-12"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                    }}
                    className="w-20 h-20 mx-auto mb-6 rounded-full bg-linear-to-br from-emerald-500 to-teal-500 flex items-center justify-center"
                  >
                    <CheckCircle className="h-10 w-10 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Access Granted!
                  </h3>
                  <p className="text-gray-600">
                    Redirecting to admin dashboard...
                  </p>
                  <motion.div
                    className="mt-8"
                    animate={{
                      width: ["0%", "100%"],
                    }}
                    transition={{
                      duration: 1,
                      ease: "easeInOut",
                    }}
                  >
                    <div className="h-2 bg-linear-to-r from-teal-500 to-yellow-500 rounded-full" />
                  </motion.div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  {/* Email Input */}
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-gray-700 font-medium"
                    >
                      Email Address
                    </Label>
                    <div className="relative">
                      <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 z-10 pointer-events-none" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="admin@thapaholidays.com"
                        className="pl-11 h-12 bg-white/80 border-gray-200 focus:border-teal-500 focus:ring-teal-500 text-gray-900"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading || step > 1}
                      />
                    </div>
                  </motion.div>

                  {/* Password Input */}
                  <motion.div variants={itemVariants} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="password"
                        className="text-gray-700 font-medium"
                      >
                        Password
                      </Label>
                    </div>
                    <div className="relative">
                      <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 z-10 pointer-events-none" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="pl-11 pr-11 h-12 bg-white/80 border-gray-200 focus:border-teal-500 focus:ring-teal-500 text-gray-900"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading || step > 1}
                      />
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </motion.div>

                  {/* Loading State */}
                  {step === 2 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-3">
                        <Loader2 className="h-5 w-5 animate-spin text-teal-500" />
                        <p className="text-sm text-gray-600">
                          Verifying credentials...
                        </p>
                      </div>
                      <div className="h-2 bg-linear-to-r from-teal-500 to-yellow-500 rounded-full animate-pulse" />
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <motion.div variants={itemVariants}>
                    <Button
                      type="submit"
                      className="w-full h-12 text-lg font-semibold bg-linear-to-r from-yellow-500 to-teal-500 hover:from-yellow-600 hover:to-teal-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={loading || step > 1}
                      size="lg"
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>Authenticating...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <span>Sign In to Dashboard</span>
                          <motion.div
                            initial={false}
                            whileHover={{ x: 4 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ArrowRight className="h-5 w-5" />
                          </motion.div>
                        </div>
                      )}
                    </Button>
                  </motion.div>
                </motion.form>
              )}
            </AnimatePresence>
          </CardContent>

          {/* Removed the footer section with demo credentials */}
        </Card>

        {/* Floating Particles */}
        <motion.div
          className="absolute -bottom-8 left-8 w-4 h-4 rounded-full bg-linear-to-r from-yellow-400/40 to-teal-400/40"
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -top-8 right-8 w-3 h-3 rounded-full bg-linear-to-r from-teal-400/40 to-yellow-400/40"
          animate={{
            y: [0, 15, 0],
            x: [0, -15, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
      </motion.div>
    </div>
  );
}
