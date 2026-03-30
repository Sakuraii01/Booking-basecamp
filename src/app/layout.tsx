import type { Metadata } from "next";
import { Geist, Geist_Mono, Prompt } from "next/font/google";

// @ts-ignore: allow side-effect CSS import without type declaration
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const prompt = Prompt({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-prompt",
});

export const metadata: Metadata = {
  title: "UrbanBooking",
  description: "จองห้องประชุมในพื้นที่ Base Camp 24",
  icons: {
    icon: "/booking-mini-logo.png",
  },
  openGraph: {
    title: "UrbanBooking",
    description: "จองห้องประชุมในพื้นที่ Base Camp 24",
    url: "https://booking.urbandata-th.com/",
    siteName: "UrbanBooking",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${prompt.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
