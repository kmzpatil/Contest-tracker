import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./Providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VoidTrack | Elite CP Dashboard",
  description: "A high-fidelity competitive programming dashboard for Codeforces, LeetCode, and more.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="antialiased">
        <div className="mesh-bg" />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
