"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function CTASection() {
  const router = useRouter();

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="border-0 shadow-xl bg-gradient-to-r from-teal-500 to-yellow-500 text-white overflow-hidden">
          <CardContent className="p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-white/90 mb-6 max-w-lg mx-auto">
              Let us help you plan the perfect trip. Contact us today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => router.push("/contact")}
                size="lg"
                className="bg-white text-teal-600 hover:bg-gray-100 rounded-full"
              >
                <Mail className="h-5 w-5 mr-2" />
                Contact Us
              </Button>
              <Button onClick={() => router.push("/packages")} size="lg">
                View Packages
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
