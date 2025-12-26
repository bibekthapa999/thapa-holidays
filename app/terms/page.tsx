import { Metadata } from "next";
import { FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions | Thapa Holidays",
  description:
    "Terms & Conditions for Thapa Holidays - Read our terms of service for travel bookings and packages.",
};

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 lg:pt-32">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-teal-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Terms & Conditions
            </h1>
          </div>
          <p className="text-gray-600 mt-2">
            Effective Date: December 26, 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          {/* Introduction */}
          <div>
            <p className="text-gray-700 leading-relaxed">
              By accessing thapaholidays.com booking services, you agree to
              these Terms. Thapa Holidays provides travel packages to the
              destinations provided in our website.
            </p>
          </div>

          {/* Services and Bookings */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Services and Bookings
            </h2>
            <p className="text-gray-700 mb-4">
              We offer itineraries, accommodations, and tours via B2B/B2C
              models. Bookings are confirmed upon payment; changes incur fees.
              All details subject to availability and force majeure (weather,
              strikes).
            </p>
            <p className="text-gray-700">
              Unused accommodation, missed meals, transportation, and
              sightseeing tours are not refundable or exchangeable. Hotel room
              allocation depends on availability at check-in. No refunds are
              offered for unsatisfactory services or amenities. Costs arising
              from natural calamities, such as landslides, road blockages, and
              political disturbances, are the responsibility of the guest.
            </p>
          </section>

          {/* Payments and Refunds */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Payments and Refunds
            </h2>
            <p className="text-gray-700 mb-4">
              Full payment required upfront. Refunds: 100% within 48 hours of
              booking (minus fees); 50% up to 30 days before travel; none within
              30 days or for no-shows. Currency in INR/USD.
            </p>
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <p className="text-red-800 font-medium">Important:</p>
              <p className="text-red-700 mt-1">
                NO REFUND WILL BE MADE AGAINST ANY UNUTILIZED SERVICES, WHAT SO
                EVER MAY BE THE REASON.
              </p>
            </div>
          </section>

          {/* User Responsibilities */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              User Responsibilities
            </h2>
            <p className="text-gray-700">
              Provide accurate info; comply with destination laws (visas,
              health). Liability limited to booking value; travel insurance
              recommended.
            </p>
          </section>

          {/* Limitations of Liability */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Limitations of Liability
            </h2>
            <p className="text-gray-700">
              We disclaim liability for third-party services, delays, or
              injuries. Governing law: India (Haryana courts).
            </p>
          </section>

          {/* Changes to Tours */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Changes to Booked Tours
            </h2>
            <p className="text-gray-700">
              Changes to booked tours are considered cancellations, but minor
              amendments can be made with communication charge.
            </p>
          </section>

          {/* Refund Policy */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Refund Policy
            </h2>
            <p className="text-gray-700">
              Refunds will be processed by the guest's booking source and sent
              via A/C payee cheque within 15 days.
            </p>
          </section>

          {/* Prepone & Postpone */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Prepone & Postpone
            </h2>
            <p className="text-gray-700">
              Any postponement or prepone of a tour package must be notified in
              writing and at least 07 days before the scheduled departure date.
              If any additional fee applicable guest can communicate with the
              sales person.
            </p>
          </section>

          {/* Cancellation Policy */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Cancellation Policy
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-4">
                Once booking is CONFIRMED cancellation charges will be
                applicable as below:
              </p>
              <p className="text-gray-700 mb-4">
                Cancellation has to be sent to us by Mail/Whatsapp. 30 Days
                prior to arrival from The Date of Booking.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>
                  <strong>
                    Cancellation made before 15 days of Guest Arrival:
                  </strong>{" "}
                  90% of the amount will be Refunded.
                </li>
                <li>
                  <strong>
                    Cancellation made before 7 days & within 15 Days of Guest
                    Arrival:
                  </strong>{" "}
                  75% of the total amount will be Refunded.
                </li>
                <li>
                  <strong>
                    Cancellation made before 72 hours & within 7 days of Guest
                    Arrival:
                  </strong>{" "}
                  50% of the total amount will be Refunded.
                </li>
                <li>
                  <strong>
                    Cancellation made within 72 hours of Arrival of the Guest:
                  </strong>{" "}
                  will be treated as no show & No Refund will be given.
                </li>
              </ul>
            </div>
          </section>

          {/* Payment Policy */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Payment Policy
            </h2>
            <div className="bg-blue-50 p-6 rounded-lg">
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>
                  <strong>30-15 Days Prior To Departure:</strong> 25% Of Tour
                  Cost.
                </li>
                <li>
                  <strong>14-07 Days Prior To Departure:</strong> 50% Of Tour
                  Cost.
                </li>
                <li>
                  <strong>07-03 Days Prior To Departure:</strong> 75% Of Tour
                  Cost.
                </li>
                <li>
                  <strong>02 Days/ No Show:</strong> 100% Of Tour Cost.
                </li>
              </ul>
            </div>
          </section>

          {/* Legal Notice */}
          <section className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              Legal Notice
            </h3>
            <p className="text-yellow-700">
              Consult a lawyer to tailor these to Indian laws (IT Act, DPDP Act)
              and your tech stack (React, MongoDB). Use generators like Termly
              for updates.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
