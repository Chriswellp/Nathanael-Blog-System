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
  metadataBase: new URL("https://nathanael-blog-system-44yf.vercel.app"),
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
  openGraph: {
    title: "Social Work Across Borders | Global Social Work & Transformation",
    description:
      "Bridging communities, cross-border social work initiatives, and driving global social transformation worldwide.",
    url: "https://nathanael-blog-system-44yf.vercel.app",
    siteName: "Social Work Across Borders",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Social Work Across Borders | Global Social Work & Transformation",
    description:
      "Bridging communities, cross-border social work initiatives, and driving global social transformation worldwide.",
  },
  verification: {
    google: "OnbkyHyfbc5pDYHq9cxdoeofQXzU0Rjaah2pB3Cpifo",
    other: {
      "msvalidate.01": ["5F4FE391BD2E0F10B15B36BCA6A9BCC6"],
    },
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
    alternateName: "SWAB",
    url: "https://nathanael-blog-system-44yf.vercel.app",
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