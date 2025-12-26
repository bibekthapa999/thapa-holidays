"use client";

import { useState, useEffect } from "react";
import Hero from "@/components/Hero";
import Destinations from "@/components/Destinations";
import Packages from "@/components/Packages";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import ReviewForm from "@/components/ReviewForm";
import BookingModal from "@/components/BookingModal";
import ConsultationPopup from "@/components/ConsultationPopup";

export default function HomePage() {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showConsultationPopup, setShowConsultationPopup] = useState(false);

  useEffect(() => {
    // Show consultation popup after 3 seconds
    const timer = setTimeout(() => {
      setShowConsultationPopup(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Hero onBookNow={() => setShowBookingModal(true)} />
      <Destinations />
      <Packages />
      <Testimonials />
      <ReviewForm />
      <About />
      {showBookingModal && (
        <BookingModal onClose={() => setShowBookingModal(false)} />
      )}
      {showConsultationPopup && (
        <ConsultationPopup onClose={() => setShowConsultationPopup(false)} />
      )}
    </>
  );
}
