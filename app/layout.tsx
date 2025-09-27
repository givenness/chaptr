import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/next";

import "./globals.css";
import { MobileNavigation } from "@/components/mobile-navigation";
import MiniKitProvider from "@/components/Minikit-Provider";
import { AuthWrapper } from "@/components/auth-wrapper";
export const metadata: Metadata = {
  title: "Chaptr - Stories by Verified Humans",
  description:
    "A mobile-first platform for serialized fiction where verified humans publish stories and readers follow, upvote, comment, and tip authors.",
  generator: "v0.app",
  themeColor: "#f5f0f0",
};

// (Optional) put viewport in its own export instead of inside `metadata`
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <MiniKitProvider>
          <AuthWrapper>
            <main className="pb-20">
              <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
            </main>
            <MobileNavigation />
            <Analytics />
          </AuthWrapper>
        </MiniKitProvider>
      </body>
    </html>
  );
}
