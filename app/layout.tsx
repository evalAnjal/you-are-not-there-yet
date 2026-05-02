import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "YouAreNotThere Yet",
  description: "A geographic dead drop application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}