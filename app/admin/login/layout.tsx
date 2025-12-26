import { Providers } from "@/components/providers";

export const metadata = {
  title: "Admin Login | Thapa Holidays",
  description: "Login to Thapa Holidays Admin Panel",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Providers>{children}</Providers>;
}



