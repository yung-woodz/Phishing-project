import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Noto_Sans_Display } from "next/font/google";
import "./globals.css";

const noto = Noto_Sans_Display({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Phishing Project | yungwoodz",
  description: "Dashboard for phishing campaign",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={noto.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
