import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "MovieStream - Watch Movies Online",
  description: "Stream your favorite movies online with high quality",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-white pt-16`}>
        {children}
      </body>
    </html>
  );
}
