// lib/pdfGenerator.ts
import jsPDF from "jspdf";

// Helper function to load image as base64
const loadImageAsBase64 = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL("image/jpeg", 0.8);
      resolve(dataURL);
    };
    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
};

interface PackageData {
  id: string;
  name: string;
  slug: string;
  destinationName: string;
  location: string;
  country: string;
  image?: string;
  images: string[];
  price: number;
  originalPrice?: number;
  duration: string;
  groupSize: string;
  rating: number;
  description: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary?: {
    day: number;
    title: string;
    description: string;
    meals?: string;
    accommodation?: string;
    activities?: string[];
  }[];
  accommodations?: {
    name: string;
    type: string;
    description: string;
    amenities?: string[];
    rating?: string;
  }[];
  faqs?: { question: string; answer: string }[];
  policies?: {
    cancellation?: string;
    payment?: string;
    health?: string;
    baggage?: string;
    insurance?: string;
  };
  bestTime?: string;
  difficulty: string;
  type: string;
  badge?: string;
  featured: boolean;
}

export const generatePackagePDF = async (packageData: PackageData) => {
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;

  // Helper function to add text with word wrapping
  const addWrappedText = (
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    fontSize = 12
  ) => {
    pdf.setFontSize(fontSize);
    const lines = pdf.splitTextToSize(text, maxWidth);
    pdf.text(lines, x, y);
    return y + lines.length * fontSize * 0.4;
  };

  // Helper function to check if we need a new page
  const checkNewPage = (requiredHeight: number) => {
    if (yPosition + requiredHeight > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // Header with company branding
  // Solid color background: #1f7192
  pdf.setFillColor(31, 113, 146); // #1f7192
  pdf.rect(0, 0, pageWidth, 50, "F"); // Increased height for contact info

  pdf.setTextColor(255, 255, 255);

  // Center the main title
  pdf.setFontSize(24); // Made bigger
  pdf.setFont("helvetica", "bold");
  const titleText = "THAPA HOLIDAYS";
  const titleWidth = pdf.getTextWidth(titleText);
  const titleX = (pageWidth - titleWidth) / 2;
  pdf.text(titleText, titleX, 18);

  // Center the subtitle
  pdf.setFontSize(12); // Made bigger
  pdf.setFont("helvetica", "normal");
  const subtitleText = "Best Travel Agency in India";
  const subtitleWidth = pdf.getTextWidth(subtitleText);
  const subtitleX = (pageWidth - subtitleWidth) / 2;
  pdf.text(subtitleText, subtitleX, 26);

  // Add contact information
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  const phoneText = "Phone: +91 9002660557";
  const emailText = "Email: thapa.holidays09@gmail.com";

  const phoneWidth = pdf.getTextWidth(phoneText);
  const emailWidth = pdf.getTextWidth(emailText);

  const phoneX = (pageWidth - phoneWidth) / 2;
  const emailX = (pageWidth - emailWidth) / 2;

  pdf.text(phoneText, phoneX, 36);
  pdf.text(emailText, emailX, 41);

  yPosition = 56; // Adjusted for new header height

  // Load and add main package image
  if (packageData.image) {
    try {
      const imageData = await loadImageAsBase64(packageData.image);
      const imgWidth = pageWidth - 2 * margin;
      const imgHeight = 80; // Fixed height for main image

      pdf.addImage(imageData, "JPEG", margin, yPosition, imgWidth, imgHeight);
      yPosition += imgHeight + 15;
    } catch (error) {
      console.warn("Failed to load main package image:", error);
      yPosition += 10; // Add some space even if image fails
    }
  }

  // Package Title
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(20);
  pdf.setFont("helvetica", "bold");
  yPosition = addWrappedText(
    packageData.name,
    margin,
    yPosition,
    pageWidth - 2 * margin
  );

  yPosition += 10;

  // Package Overview Table
  const overviewData = [
    ["Destination", packageData.destinationName],
    ["Location", packageData.location],
    ["Duration", packageData.duration],
    ["Group Size", packageData.groupSize],
    ["Best Time", packageData.bestTime || "N/A"],
    ["Difficulty", packageData.difficulty],
    ["Type", packageData.type],
  ];

  if (packageData.badge) {
    overviewData.push(["Badge", packageData.badge]);
  }

  // Package Overview Table
  checkNewPage(60);
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(85, 90, 92); // #101828
  pdf.text("Package Overview", margin, yPosition);
  yPosition += 12;

  // Add a decorative line under the header
  pdf.setDrawColor(85, 90, 92);
  pdf.setLineWidth(0.5);
  pdf.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  // Create a proper table with borders
  const tableWidth = pageWidth - 2 * margin;
  const colWidth = tableWidth / 2;
  const rowHeight = 14;

  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(11);

  overviewData.forEach(([label, value], index) => {
    checkNewPage(rowHeight);

    // Alternate row colors
    const isEvenRow = index % 2 === 0;
    pdf.setFillColor(
      isEvenRow ? 250 : 255,
      isEvenRow ? 250 : 255,
      isEvenRow ? 250 : 255
    );

    // Draw row background
    pdf.rect(margin, yPosition - 10, tableWidth, rowHeight, "F");

    // Draw borders
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.2);
    pdf.rect(margin, yPosition - 10, colWidth, rowHeight);
    pdf.rect(margin + colWidth, yPosition - 10, colWidth, rowHeight);

    // Label column (header style)
    pdf.setFillColor(85, 90, 92);
    pdf.rect(margin, yPosition - 10, colWidth, rowHeight, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFont("helvetica", "bold");
    pdf.text(label, margin + 5, yPosition - 2);

    // Value column
    pdf.setFillColor(
      isEvenRow ? 250 : 255,
      isEvenRow ? 250 : 255,
      isEvenRow ? 250 : 255
    );
    pdf.rect(margin + colWidth, yPosition - 10, colWidth, rowHeight, "F");
    pdf.setTextColor(0, 0, 0);
    pdf.setFont("helvetica", "normal");
    pdf.text(value, margin + colWidth + 5, yPosition - 2);

    yPosition += rowHeight;
  });

  yPosition += 10;

  // Pricing
  checkNewPage(20);
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.text("Pricing Information", margin, yPosition);
  yPosition += 10;

  pdf.setFontSize(14);
  pdf.setFont("helvetica", "normal");
  const priceText = `INR ${packageData.price.toLocaleString("en-IN")}`;
  let discountText = "";
  if (
    packageData.originalPrice &&
    packageData.originalPrice > packageData.price
  ) {
    discountText = ` (Original: INR ${packageData.originalPrice.toLocaleString(
      "en-IN"
    )})`;
  }

  pdf.text(`Price: ${priceText}${discountText}`, margin, yPosition);
  yPosition += 15;

  // Description
  checkNewPage(30);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("Description", margin, yPosition);
  yPosition += 10;

  pdf.setFontSize(11);
  pdf.setFont("helvetica", "normal");
  yPosition = addWrappedText(
    packageData.description,
    margin,
    yPosition,
    pageWidth - 2 * margin
  );

  yPosition += 10;

  // Highlights
  if (packageData.highlights && packageData.highlights.length > 0) {
    checkNewPage(30);
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("Highlights", margin, yPosition);
    yPosition += 10;

    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");
    packageData.highlights.forEach((highlight, index) => {
      checkNewPage(8);
      pdf.text(`• ${highlight}`, margin + 10, yPosition);
      yPosition += 8;
    });
    yPosition += 5;
  }

  // Inclusions & Exclusions in Tabular Format
  const inclusionsExclusions = [
    { title: "Inclusions", items: packageData.inclusions, icon: "✓" },
    { title: "Exclusions", items: packageData.exclusions, icon: "✗" },
  ];

  inclusionsExclusions.forEach(({ title, items, icon }) => {
    if (items && items.length > 0) {
      checkNewPage(40);
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(85, 90, 92); // #101828
      pdf.text(title, margin, yPosition);
      yPosition += 12;

      // Add a decorative line under the header
      pdf.setDrawColor(85, 90, 92);
      pdf.setLineWidth(0.5);
      pdf.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 10;

      // Create table for items
      const tableWidth = pageWidth - 2 * margin;
      const iconColWidth = 15;
      const itemColWidth = tableWidth - iconColWidth;
      const rowHeight = 12;

      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);

      items.forEach((item, index) => {
        checkNewPage(rowHeight);

        // Alternate row colors
        const isEvenRow = index % 2 === 0;
        pdf.setFillColor(
          isEvenRow ? 250 : 255,
          isEvenRow ? 250 : 255,
          isEvenRow ? 250 : 255
        );

        // Draw row background
        pdf.rect(margin, yPosition - 8, tableWidth, rowHeight, "F");

        // Draw borders
        pdf.setDrawColor(200, 200, 200);
        pdf.setLineWidth(0.2);
        pdf.rect(margin, yPosition - 8, iconColWidth, rowHeight);
        pdf.rect(margin + iconColWidth, yPosition - 8, itemColWidth, rowHeight);

        // Icon column
        pdf.setTextColor(
          title === "Inclusions" ? 34 : 239,
          title === "Inclusions" ? 197 : 68,
          title === "Inclusions" ? 94 : 68
        ); // green for inclusions, red for exclusions
        pdf.setFont("helvetica", "bold");
        pdf.text(icon, margin + iconColWidth / 2 - 3, yPosition);

        // Item column
        pdf.setTextColor(0, 0, 0);
        pdf.setFont("helvetica", "normal");
        const wrappedText = pdf.splitTextToSize(item, itemColWidth - 10);
        pdf.text(wrappedText, margin + iconColWidth + 5, yPosition);

        yPosition += Math.max(rowHeight, wrappedText.length * 8);
      });

      yPosition += 10;
    }
  });

  // Itinerary in Enhanced Tabular Format
  if (packageData.itinerary && packageData.itinerary.length > 0) {
    checkNewPage(30);
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(85, 90, 92); // #101828
    pdf.text("Detailed Itinerary", margin, yPosition);
    yPosition += 12;

    // Add a decorative line under the header
    pdf.setDrawColor(85, 90, 92);
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 15;

    packageData.itinerary.forEach((day, index) => {
      checkNewPage(80);

      // Day header with background
      pdf.setFillColor(85, 90, 92);
      pdf.rect(margin, yPosition - 5, pageWidth - 2 * margin, 15, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text(`Day ${day.day}: ${day.title}`, margin + 5, yPosition + 3);
      yPosition += 20;

      // Create a table for day details
      const tableData = [];
      if (day.meals) tableData.push(["Meals", day.meals]);
      if (day.accommodation)
        tableData.push(["Accommodation", day.accommodation]);
      if (day.activities && day.activities.length > 0) {
        tableData.push([
          "Activities",
          day.activities.map((act) => `• ${act}`).join("\n"),
        ]);
      }
      tableData.push(["Description", day.description]);

      const tableWidth = pageWidth - 2 * margin;
      const labelColWidth = 40;
      const valueColWidth = tableWidth - labelColWidth;
      const rowHeight = 12;

      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);

      tableData.forEach(([label, value], rowIndex) => {
        const wrappedValue = pdf.splitTextToSize(value, valueColWidth - 10);
        const actualRowHeight = Math.max(rowHeight, wrappedValue.length * 8);

        checkNewPage(actualRowHeight);

        // Alternate row colors
        const isEvenRow = rowIndex % 2 === 0;
        pdf.setFillColor(
          isEvenRow ? 250 : 255,
          isEvenRow ? 250 : 255,
          isEvenRow ? 250 : 255
        );

        // Draw row background
        pdf.rect(margin, yPosition - 8, tableWidth, actualRowHeight, "F");

        // Draw borders
        pdf.setDrawColor(200, 200, 200);
        pdf.setLineWidth(0.2);
        pdf.rect(margin, yPosition - 8, labelColWidth, actualRowHeight);
        pdf.rect(
          margin + labelColWidth,
          yPosition - 8,
          valueColWidth,
          actualRowHeight
        );

        // Label column (header style)
        pdf.setFillColor(245, 245, 245);
        pdf.rect(margin, yPosition - 8, labelColWidth, actualRowHeight, "F");
        pdf.setTextColor(85, 90, 92);
        pdf.setFont("helvetica", "bold");
        pdf.text(label, margin + 5, yPosition);

        // Value column
        pdf.setFillColor(
          isEvenRow ? 250 : 255,
          isEvenRow ? 250 : 255,
          isEvenRow ? 250 : 255
        );
        pdf.rect(
          margin + labelColWidth,
          yPosition - 8,
          valueColWidth,
          actualRowHeight,
          "F"
        );
        pdf.setTextColor(0, 0, 0);
        pdf.setFont("helvetica", "normal");
        pdf.text(wrappedValue, margin + labelColWidth + 5, yPosition);

        yPosition += actualRowHeight;
      });

      yPosition += 15; // Space between days
    });
  }

  // Accommodations in Tabular Format
  if (packageData.accommodations && packageData.accommodations.length > 0) {
    checkNewPage(30);
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(85, 90, 92); // #101828
    pdf.text("Accommodations", margin, yPosition);
    yPosition += 12;

    // Add a decorative line under the header
    pdf.setDrawColor(85, 90, 92);
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 15;

    packageData.accommodations.forEach((accommodation, index) => {
      checkNewPage(60);

      // Accommodation header
      pdf.setFillColor(85, 90, 92);
      pdf.rect(margin, yPosition - 5, pageWidth - 2 * margin, 12, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text(accommodation.name, margin + 5, yPosition + 2);
      yPosition += 17;

      // Create table for accommodation details
      const tableData = [];
      if (accommodation.type) tableData.push(["Type", accommodation.type]);
      if (accommodation.rating)
        tableData.push(["Rating", accommodation.rating]);
      if (accommodation.description)
        tableData.push(["Description", accommodation.description]);
      if (accommodation.amenities && accommodation.amenities.length > 0) {
        tableData.push([
          "Amenities",
          accommodation.amenities.map((amenity) => `• ${amenity}`).join("\n"),
        ]);
      }

      const tableWidth = pageWidth - 2 * margin;
      const labelColWidth = 35;
      const valueColWidth = tableWidth - labelColWidth;
      const rowHeight = 12;

      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);

      tableData.forEach(([label, value], rowIndex) => {
        const wrappedValue = pdf.splitTextToSize(value, valueColWidth - 10);
        const actualRowHeight = Math.max(rowHeight, wrappedValue.length * 8);

        checkNewPage(actualRowHeight);

        // Alternate row colors
        const isEvenRow = rowIndex % 2 === 0;
        pdf.setFillColor(
          isEvenRow ? 250 : 255,
          isEvenRow ? 250 : 255,
          isEvenRow ? 250 : 255
        );

        // Draw row background
        pdf.rect(margin, yPosition - 8, tableWidth, actualRowHeight, "F");

        // Draw borders
        pdf.setDrawColor(200, 200, 200);
        pdf.setLineWidth(0.2);
        pdf.rect(margin, yPosition - 8, labelColWidth, actualRowHeight);
        pdf.rect(
          margin + labelColWidth,
          yPosition - 8,
          valueColWidth,
          actualRowHeight
        );

        // Label column (header style)
        pdf.setFillColor(245, 245, 245);
        pdf.rect(margin, yPosition - 8, labelColWidth, actualRowHeight, "F");
        pdf.setTextColor(85, 90, 92);
        pdf.setFont("helvetica", "bold");
        pdf.text(label, margin + 5, yPosition);

        // Value column
        pdf.setFillColor(
          isEvenRow ? 250 : 255,
          isEvenRow ? 250 : 255,
          isEvenRow ? 250 : 255
        );
        pdf.rect(
          margin + labelColWidth,
          yPosition - 8,
          valueColWidth,
          actualRowHeight,
          "F"
        );
        pdf.setTextColor(0, 0, 0);
        pdf.setFont("helvetica", "normal");
        pdf.text(wrappedValue, margin + labelColWidth + 5, yPosition);

        yPosition += actualRowHeight;
      });

      yPosition += 15; // Space between accommodations
    });
  }

  // FAQs in Tabular Format
  if (packageData.faqs && packageData.faqs.length > 0) {
    checkNewPage(30);
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(85, 90, 92); // #101828
    pdf.text("Frequently Asked Questions", margin, yPosition);
    yPosition += 12;

    // Add a decorative line under the header
    pdf.setDrawColor(85, 90, 92);
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 15;

    packageData.faqs.forEach((faq, index) => {
      checkNewPage(40);

      // Question header
      pdf.setFillColor(85, 90, 92);
      pdf.rect(margin, yPosition - 5, pageWidth - 2 * margin, 12, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.text(`Q${index + 1}: ${faq.question}`, margin + 5, yPosition + 2);
      yPosition += 17;

      // Answer in table format
      const tableWidth = pageWidth - 2 * margin;
      const labelColWidth = 20;
      const valueColWidth = tableWidth - labelColWidth;
      const wrappedAnswer = pdf.splitTextToSize(faq.answer, valueColWidth - 10);
      const answerHeight = Math.max(12, wrappedAnswer.length * 8);

      checkNewPage(answerHeight);

      // Draw table
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.2);
      pdf.rect(margin, yPosition - 8, tableWidth, answerHeight);

      // Label column (A:)
      pdf.setFillColor(245, 245, 245);
      pdf.rect(margin, yPosition - 8, labelColWidth, answerHeight, "F");
      pdf.setTextColor(85, 90, 92);
      pdf.setFont("helvetica", "bold");
      pdf.text("A:", margin + 5, yPosition);

      // Answer column
      pdf.setFillColor(255, 255, 255);
      pdf.rect(
        margin + labelColWidth,
        yPosition - 8,
        valueColWidth,
        answerHeight,
        "F"
      );
      pdf.setTextColor(0, 0, 0);
      pdf.setFont("helvetica", "normal");
      pdf.text(wrappedAnswer, margin + labelColWidth + 5, yPosition);

      yPosition += answerHeight + 10;
    });
  }

  // Important Policies in Tabular Format
  if (packageData.policies) {
    checkNewPage(30);
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(85, 90, 92); // #101828
    pdf.text("Important Policies", margin, yPosition);
    yPosition += 12;

    // Add a decorative line under the header
    pdf.setDrawColor(85, 90, 92);
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 15;

    const policies = [
      { key: "cancellation", label: "Cancellation Policy" },
      { key: "payment", label: "Payment Policy" },
      { key: "health", label: "Health & Safety" },
      { key: "baggage", label: "Baggage Policy" },
      { key: "insurance", label: "Insurance Policy" },
    ];

    policies.forEach(({ key, label }, index) => {
      const value =
        packageData.policies?.[key as keyof typeof packageData.policies];
      if (value) {
        checkNewPage(30);

        // Policy header
        pdf.setFillColor(85, 90, 92);
        pdf.rect(margin, yPosition - 5, pageWidth - 2 * margin, 12, "F");
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "bold");
        pdf.text(label, margin + 5, yPosition + 2);
        yPosition += 17;

        // Policy content in table format
        const tableWidth = pageWidth - 2 * margin;
        const wrappedPolicy = pdf.splitTextToSize(value, tableWidth - 20);
        const policyHeight = Math.max(12, wrappedPolicy.length * 8);

        checkNewPage(policyHeight);

        // Draw table
        pdf.setFillColor(250, 250, 250);
        pdf.rect(margin, yPosition - 8, tableWidth, policyHeight, "F");
        pdf.setDrawColor(200, 200, 200);
        pdf.setLineWidth(0.2);
        pdf.rect(margin, yPosition - 8, tableWidth, policyHeight);

        // Policy text
        pdf.setTextColor(0, 0, 0);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.text(wrappedPolicy, margin + 10, yPosition);

        yPosition += policyHeight + 10;
      }
    });
  }

  // Footer
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(128, 128, 128);
    pdf.text(
      `Generated by Thapa Holidays - ${new Date().toLocaleDateString()}`,
      margin,
      pageHeight - 10
    );
    pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 40, pageHeight - 10);
  }

  // Save the PDF
  const fileName = `${packageData.slug}-package-details.pdf`;
  pdf.save(fileName);
};
