import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
  secure: process.env.EMAIL_SERVER_SECURE === "true",
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

interface ContactEmailData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  destination?: string;
  travelDate?: string;
  hotelType?: string;
  groupSize?: string;
  budget?: string;
  specialRequirements?: string;
  type: string;
  // Package enquiry specific fields
  packageName?: string;
  travelTime?: string;
  adults?: number;
  children?: number;
  rooms?: number;
}

export const sendContactEmail = async (data: ContactEmailData) => {
  try {
    const {
      name,
      email,
      phone,
      message,
      destination,
      travelDate,
      hotelType,
      groupSize,
      budget,
      specialRequirements,
      type,
      packageName,
      travelTime,
      adults,
      children,
      rooms,
    } = data;

    // Determine email type and subject
    const isPackageEnquiry = type === "PACKAGE_ENQUIRY";
    const emailType = isPackageEnquiry
      ? "Package Enquiry"
      : type === "CONTACT"
      ? "Contact"
      : "Consultation";
    const subject = `New ${emailType} from ${name}`;

    // Minimal, text-based email template
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New ${emailType} - Thapa Holidays</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #374151;
            background-color: #f9fafb;
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #14b8a6 0%, #eab308 100%);
            color: white;
            padding: 24px 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
          }
          .header p {
            margin: 8px 0 0 0;
            opacity: 0.9;
            font-size: 14px;
          }
          .content {
            padding: 30px;
          }
          .section {
            margin-bottom: 24px;
          }
          .section-title {
            font-size: 16px;
            font-weight: 600;
            color: #14b8a6;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
            border-bottom: 2px solid #14b8a6;
            padding-bottom: 4px;
          }
          .info-item {
            margin-bottom: 12px;
            padding: 12px;
            background: #f8fafc;
            border-radius: 6px;
            border-left: 3px solid #14b8a6;
          }
          .info-label {
            font-weight: 600;
            color: #14b8a6;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
          }
          .info-value {
            color: #374151;
            font-size: 15px;
            line-height: 1.5;
          }
          .message-box {
            background: #f8fafc;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            padding: 16px;
            margin-top: 8px;
          }
          .message-text {
            color: #374151;
            line-height: 1.6;
            white-space: pre-wrap;
          }
          .footer {
            background: #f9fafb;
            padding: 20px 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
          }
          .footer p {
            margin: 0;
            font-size: 14px;
            color: #6b7280;
          }
          .badge {
            display: inline-block;
            background: #14b8a6;
            color: white;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-top: 8px;
          }
          @media (max-width: 600px) {
            body {
              padding: 10px;
            }
            .container {
              margin: 0;
            }
            .header {
              padding: 20px;
            }
            .header h1 {
              font-size: 20px;
            }
            .content {
              padding: 20px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New ${emailType} Received</h1>
            <p>${
              isPackageEnquiry
                ? "Package booking inquiry from a potential customer"
                : "Travel consultation request received"
            }</p>
          </div>

          <div class="content">
            <!-- Customer Information -->
            <div class="section">
              <div class="section-title">Customer Information</div>
              <div class="info-item">
                <div class="info-label">Name</div>
                <div class="info-value">${name}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Email</div>
                <div class="info-value">${email}</div>
              </div>
              ${
                phone
                  ? `
              <div class="info-item">
                <div class="info-label">Phone</div>
                <div class="info-value">${phone}</div>
              </div>
              `
                  : ""
              }
            </div>

            <!-- Travel Details -->
            ${
              isPackageEnquiry
                ? `
            <div class="section">
              <div class="section-title">Package Enquiry Details</div>
              ${
                packageName
                  ? `
              <div class="info-item">
                <div class="info-label">Package</div>
                <div class="info-value">${packageName}</div>
              </div>
              `
                  : ""
              }
              ${
                travelDate
                  ? `
              <div class="info-item">
                <div class="info-label">Travel Date</div>
                <div class="info-value">${new Date(
                  travelDate
                ).toLocaleDateString("en-IN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}</div>
              </div>
              `
                  : ""
              }
              ${
                travelTime
                  ? `
              <div class="info-item">
                <div class="info-label">Travel Time</div>
                <div class="info-value">${travelTime}</div>
              </div>
              `
                  : ""
              }
              ${
                adults || children
                  ? `
              <div class="info-item">
                <div class="info-label">Travelers</div>
                <div class="info-value">
                  ${adults ? `${adults} Adult${adults > 1 ? "s" : ""}` : ""}
                  ${
                    children
                      ? `${adults ? ", " : ""}${children} Child${
                          children > 1 ? "ren" : ""
                        }`
                      : ""
                  }
                  ${rooms ? ` • ${rooms} Room${rooms > 1 ? "s" : ""}` : ""}
                </div>
              </div>
              `
                  : ""
              }
            </div>
            `
                : `
            <div class="section">
              <div class="section-title">Travel Preferences</div>
              ${
                destination
                  ? `
              <div class="info-item">
                <div class="info-label">Destination</div>
                <div class="info-value">${destination}</div>
              </div>
              `
                  : ""
              }
              ${
                travelDate
                  ? `
              <div class="info-item">
                <div class="info-label">Travel Date</div>
                <div class="info-value">${new Date(
                  travelDate
                ).toLocaleDateString("en-IN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}</div>
              </div>
              `
                  : ""
              }
              ${
                hotelType
                  ? `
              <div class="info-item">
                <div class="info-label">Hotel Type</div>
                <div class="info-value">${hotelType}</div>
              </div>
              `
                  : ""
              }
              ${
                groupSize
                  ? `
              <div class="info-item">
                <div class="info-label">Group Size</div>
                <div class="info-value">${groupSize}</div>
              </div>
              `
                  : ""
              }
              ${
                budget
                  ? `
              <div class="info-item">
                <div class="info-label">Budget Range</div>
                <div class="info-value">${budget}</div>
              </div>
              `
                  : ""
              }
            </div>
            `
            }

            <!-- Message -->
            ${
              message
                ? `
            <div class="section">
              <div class="section-title">${
                isPackageEnquiry ? "Additional Message" : "Special Requirements"
              }</div>
              <div class="message-box">
                <div class="message-text">${message.replace(
                  /\n/g,
                  "<br>"
                )}</div>
              </div>
            </div>
            `
                : ""
            }
          </div>

          <div class="footer">
            <p><strong>Thapa Holidays</strong></p>
            <p>Please respond to this inquiry within 24 hours</p>
            <div class="badge">${emailType}</div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email to admin
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_FROM,
      subject,
      html: adminEmailHtml,
    });

    console.log(`Email sent successfully to admin for ${emailType}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};
