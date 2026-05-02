import type { Metadata } from "next";
import { Fira_Code, Fira_Sans } from "next/font/google";
import { Providers } from "./Providers";
import "./globals.css";

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
  display: "swap",
});

const firaSans = Fira_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-fira-sans",
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
    <html lang="en" className={`${firaCode.variable} ${firaSans.variable}`}>
      <body className="antialiased">
        <div className="mesh-bg" />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
