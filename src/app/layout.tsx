import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yumami",
  description: "A shared life hub for two people.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
