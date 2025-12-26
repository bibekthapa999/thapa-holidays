import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AdminLayout from "@/components/admin/admin-layout";
import { Providers } from "@/components/providers";

export const metadata = {
  title: "Admin Dashboard | Thapa Holidays",
  description: "Admin dashboard for Thapa Holidays",
};

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  return (
    <Providers>
      <AdminLayout>{children}</AdminLayout>
    </Providers>
  );
}



