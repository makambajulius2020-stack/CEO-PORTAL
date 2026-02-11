import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hugamara CEO Portal",
  description: "Executive Portal for Hugamara Hospitality Group",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
