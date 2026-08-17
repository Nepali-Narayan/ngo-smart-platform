import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NGO Smart Platform Admin",
  description: "NGO Management and Administration Platform",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}