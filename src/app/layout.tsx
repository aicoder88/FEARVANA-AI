import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fearvana AI - Find Your Sacred Edge",
  description:
    "Find Your Sacred Edge. Live it. Track it. Automate growth. - Akshay Nanavati's AI-powered personal development platform for YPO leaders.",
  keywords: [
    "sacred edge",
    "personal development",
    "AI coaching",
    "fearvana",
    "akshay nanavati",
    "YPO",
    "leadership development",
    "mindset coaching",
  ],
  authors: [{ name: "Akshay Nanavati - Fearvana.com" }],
  creator: "Akshay Nanavati",
  publisher: "Fearvana.com",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ),
  openGraph: {
    title: "Fearvana AI - Find Your Sacred Edge",
    description:
      "Find Your Sacred Edge. Live it. Track it. Automate growth. - Akshay Nanavati's AI-powered personal development platform for YPO leaders.",
    url: "/",
    siteName: "Fearvana AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Fearvana AI Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fearvana AI - Find Your Sacred Edge",
    description:
      "Find Your Sacred Edge. Live it. Track it. Automate growth. - Akshay Nanavati's AI-powered personal development platform for YPO leaders.",
    images: ["/og-image.png"],
    creator: "@akshaynanavati",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background font-sans`}
      >
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <div className="flex-1">{children}</div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
