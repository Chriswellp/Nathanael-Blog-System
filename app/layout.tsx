import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ErrorSuppressor from "./ErrorSuppressor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.socialworkeracrossborders.co.uk"),
  title: {
    default: "Social Work Across Borders | Global Social Work & Transformation",
    template: "%s | Social Work Across Borders",
  },
  description:
    "Official portal for Social Work Across Borders (SWAB). Bridging communities, cross-border social work initiatives, and driving global social transformation led by Nathanael Maradza.",
  keywords: [
    "Social Work Across Borders",
    "Social Worker Across Borders",
    "SWAB",
    "International Social Work",
    "Global Social Work",
    "Nathanael Maradza",
    "Social Transformation",
    "Community Development",
    "Cross Border Support",
  ],
  authors: [{ name: "Nathanael Maradza" }],
  // Explicit Icon declarations for Google Search and web browsers
  icons: {
    icon: "/favicon.ico", // or /icon.png (min 48x48px, ideally 192x192px)
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Social Work Across Borders | Global Social Work & Transformation",
    description:
      "Bridging communities, cross-border social work initiatives, and driving global social transformation worldwide.",
    url: "https://www.socialworkeracrossborders.co.uk",
    siteName: "Social Work Across Borders",
    images: [
      {
        url: "/og-image.png", // Recommended: 1200x630px social preview image
        width: 1200,
        height: 630,
        alt: "Social Work Across Borders",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Social Work Across Borders | Global Social Work & Transformation",
    description:
      "Bridging communities, cross-border social work initiatives, and driving global social transformation worldwide.",
    images: ["/og-image.png"],
  },
  verification: {
    google: "OnbkyHyfbc5pDYHq9cxdoeofQXzU0Rjaah2pB3Cpifo",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Social Work Across Borders",
    alternateName: ["SWAB", "Social Worker Across Borders"],
    url: "https://www.socialworkeracrossborders.co.uk",
    logo: "https://www.socialworkeracrossborders.co.uk/icon.png", // Helps Google associate your logo with search results
    founder: {
      "@type": "Person",
      name: "Nathanael Maradza",
    },
    description:
      "Bridging communities, cross-border social work initiatives, and driving global social transformation worldwide.",
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Direct Bing Meta Tag Verification */}
        <meta name="msvalidate.01" content="5F4FE391BD2E0F10B15B36BCA6A9BCC6" />
        
        {/* JSON-LD Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 selection:bg-amber-400 selection:text-slate-950">
        <ErrorSuppressor />
        {children}
      </body>
    </html>
  );
}