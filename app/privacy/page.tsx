import { Metadata } from "next";
import { Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Thapa Holidays",
  description:
    "Privacy Policy for Thapa Holidays - Learn how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicy() {
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
            <Shield className="h-8 w-8 text-teal-600" />
            <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
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
              Thapa Holidays operates thapaholidays.com. This Privacy Policy
              explains how we collect, use, disclose, and safeguard personal
              information from users visiting our Sites or using our travel
              services.
            </p>
          </div>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Information We Collect
            </h2>
            <p className="text-gray-700 mb-4">
              We gather personal data only when guests submit their details for
              our packages after filling the consultation form or enquiry form
              from website.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>
                <strong>Identification details:</strong> name, email, phone,
                billing address.
              </li>
              <li>
                <strong>Travel data:</strong> passport numbers, trip dates,
                destinations, preferences.
              </li>
              <li>
                <strong>Payment info:</strong> Bank transfer & Payment details
                are processed offline only if the guest is confident and
                approved by the guest itself.
              </li>
              <li>
                <strong>Technical data:</strong> IP address, device type,
                cookies, location for personalized itineraries.
              </li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              How We Use Your Information
            </h2>
            <p className="text-gray-700">
              Data supports booking confirmations, customer service, marketing
              (with consent), security, and legal compliance. Lawful bases
              include contract performance and legitimate interests under
              GDPR/CCPA equivalents.
            </p>
          </section>

          {/* Sharing and Third Parties */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Sharing and Third Parties
            </h2>
            <p className="text-gray-700">
              We share data only with service providers (hotels, transport
              vendors, analytics like Google), partners in Nepal/Bhutan, or as
              required by law. No selling of data occurs.
            </p>
          </section>

          {/* Data Retention and Rights */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Data Retention and Rights
            </h2>
            <p className="text-gray-700 mb-4">
              We retain data as needed for bookings, or for sharing our packages
              updates then delete it.
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                ABOUT TRANSPORT:
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Vehicles will be provided as per the itinerary if any extra
                sightseeing is applicable then guest have to pay extra for the
                same. In some areas vehicle may change due to permit issue. If
                the sightseeing not covered on closing day, additional costs may
                apply if guest want to visit on next day. So, It is advised to
                maintain appropriate timing for sightseeing and transfers.
              </p>
            </div>
          </section>

          {/* Package Policy */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Package Policy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              The itinerary provided is a suggested tour plan, with the company
              responsible for only charged services. The company is not
              obligated to provide or pay for any other suggested services.
              Hotel check-in and check-out timings are based on the respective
              hotels. The company is not responsible for any loss or additional
              costs incurred by guests or passengers. Any claims related to the
              package must be brought to the company within a week.
            </p>
          </section>

          {/* Conditions */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Conditions
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Unused accommodation, missed meals, transportation, and
              sightseeing tours are not refundable or exchangeable. Hotel room
              allocation depends on availability at check-in. No refunds are
              offered for unsatisfactory services or amenities. Costs arising
              from natural calamities, such as landslides, road blockages, and
              political disturbances, are the responsibility of the guest.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
