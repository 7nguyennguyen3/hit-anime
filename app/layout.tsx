import Navbar from "@/components/Navbar";
import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import QueryClientProvider from "./QueryClientProvider";
import Script from "next/script";
import Head from "next/head";

const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Hit Anime",
  description: "Search for your next anime or movie here!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={jost.className}>
        <QueryClientProvider>
          <Navbar />
          {children}
          <Footer />
        </QueryClientProvider>
      </body>
    </html>
  );
}
