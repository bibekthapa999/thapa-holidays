// lib/ga.ts
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Track page views
export const pageview = (url: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Track custom events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track specific events for travel website
export const trackBookingInquiry = (packageName: string) => {
  event({
    action: "booking_inquiry",
    category: "engagement",
    label: packageName,
  });
};

export const trackContactForm = () => {
  event({
    action: "contact_form_submit",
    category: "engagement",
  });
};

export const trackSearch = (searchTerm: string) => {
  event({
    action: "search",
    category: "engagement",
    label: searchTerm,
  });
};

export const trackPackageView = (packageName: string) => {
  event({
    action: "package_view",
    category: "engagement",
    label: packageName,
  });
};
