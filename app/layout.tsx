import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppLayout } from "@/components/layout/app-layout";

import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "RevNews | Premium AI News Aggregator",
  description: "Unbiased news analysis powered by AI.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "RevNews",
  },
  applicationName: "RevNews",
};

export const viewport: Viewport = {
  themeColor: "#0056b3",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased text-foreground bg-background">
        <AppLayout>{children}</AppLayout>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
