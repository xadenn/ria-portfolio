import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Atelier Studio & Control Panel | Ria Verma",
  description: "Administrative workspace and cloud data engine for Ria Verma's portfolio.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
