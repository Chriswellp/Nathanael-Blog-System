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
  title: "Social Work Across Borders | Nathanael Maradza",
  description:
    "Official portal for Social Work Across Borders (SWAB). Bridging communities and driving social transformation worldwide led by Nathanael Maradza.",
  keywords: [
    "Social Work Across Borders",
    "SWAB",
    "Nathanael Maradza",
    "Social Transformation",
    "Global Social Work",
    "Community Support",
  ],
  authors: [{ name: "Nathanael Maradza" }],
  openGraph: {
    title: "Social Work Across Borders | Nathanael Maradza",
    description:
      "Bridging communities and driving social transformation worldwide.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Social Work Across Borders | Nathanael Maradza",
    description:
      "Bridging communities and driving social transformation worldwide.",
  },
  verification:{

google: "OnbkyHyfbc5pDYHq9cxdoeofQXzU0Rjaah2pB3Cpifo"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 selection:bg-amber-400 selection:text-slate-950">
        <ErrorSuppressor />
        {children}
      </body>
    </html>
  );
}