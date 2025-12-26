import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  MessageCircle,
} from "lucide-react";

const siteConfig = {
  companyName: "Thapa Holidays",
  phone: "+91 9002660557",
  phone2: "+91 8617410057",
  whatsapp: "919002660557",
  email: "thapa.holidays09@gmail.com",
  address:
    "Vastu Vihar, Near Steel Factory, Panchkulgari\nP.O. Matigara, Dist Darjeeling, Pin: 734010",
  description:
    "Your trusted travel partner for over 15 years. We create unforgettable experiences and help you discover the incredible beauty of India and beyond.",
  socialLinks: {
    facebook: "https://facebook.com/thapaholidays",
    instagram: "https://instagram.com/thapaholidays",
    twitter: "https://twitter.com/thapaholidays",
    youtube: "https://youtube.com/thapaholidays",
  },
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center mb-6">
              <img
                src="/logo-new.png"
                alt="Thapa Holidays"
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed text-sm">
              {siteConfig.description}
            </p>

            {/* Contact Info */}
            <div className="space-y-3 text-sm">
              <a
                href={`tel:${siteConfig.phone}`}
                className="flex items-center gap-3 text-gray-400 hover:text-teal-400 transition-colors"
              >
                <Phone className="h-4 w-4 text-teal-400" />
                {siteConfig.phone}
              </a>
              <a
                href={`https://wa.me/${siteConfig.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-400 hover:text-teal-400 transition-colors"
              >
                <MessageCircle className="h-4 w-4 text-teal-400" />
                WhatsApp: {siteConfig.phone}
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="flex items-center gap-3 text-gray-400 hover:text-teal-400 transition-colors"
              >
                <Mail className="h-4 w-4 text-teal-400" />
                {siteConfig.email}
              </a>
              <div className="flex items-start gap-3 text-gray-400">
                <MapPin className="h-4 w-4 text-teal-400 mt-0.5" />
                <span className="whitespace-pre-line">
                  {siteConfig.address}
                </span>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-bold mb-6">Follow Us</h3>
            <div className="flex gap-3">
              <a
                href={siteConfig.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-teal-500 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href={siteConfig.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-teal-500 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={siteConfig.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-teal-500 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href={siteConfig.socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-teal-500 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>
              © {new Date().getFullYear()} {siteConfig.companyName}. All rights
              reserved.
            </p>
            <div className="flex gap-6">
              <Link
                href="/privacy"
                className="hover:text-teal-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="hover:text-teal-400 transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
