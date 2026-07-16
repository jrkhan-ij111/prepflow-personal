import type { Metadata, Viewport } from "next";
import "./globals.css";
import RegisterSW from "./register-sw";
import PwaNavControls from "@/components/pwa-nav-controls";

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),

  title: {
    default: "PrepFlow - Personal Study Assistant",
    template: "%s | PrepFlow",
  },

  description:
    "PrepFlow is a personal study management app for BCS preparation, MCQ practice, revision tracking and productivity.",

  icons: {
    icon: [
      {
        url: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],

    apple: [
      {
        url: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  },

  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PrepFlow",
  },

  openGraph: {
    title: "PrepFlow - Personal Study Assistant",
    description:
      "Manage BCS preparation, MCQ practice, revision and study progress.",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "PrepFlow - Personal Study Assistant",
    description:
      "Your personal BCS preparation companion.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0B0F",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <body className="min-h-screen overflow-x-hidden bg-[#FFF8E7] antialiased">
        {children}
        <RegisterSW />
        <PwaNavControls />
      </body>
    </html>
  );
}