import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import type { Viewport } from "next";

const unica77Bold = localFont({ src: "./unica77-Bold.woff2" });

export const metadata: Metadata = {
  title: "Group Reading",
  description: "Let's read together, friends",
  icons: { icon: "/vercel.svg" },
  openGraph: {
    images: [
      {
        url: "/read.jpg",
        width: 736,
        height: 736,
        alt: "Group Reading",
      },
    ],
  },
};

export const viewport: Viewport = { maximumScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${unica77Bold.className} no-scrollbar overflow-x-clip antialiased`}>
        {children}
      </body>
    </html>
  );
}
