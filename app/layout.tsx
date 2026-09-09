import type { Metadata, Viewport } from "next";
import "./globals.css";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Ta-réincarnation — Et si tu avais déjà vécu ?",
  description:
    "Qui étais-tu dans une vie antérieure ? Réponds à 6 questions et découvre ta réincarnation. Expérience 100 % ludique.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#14102b",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body className="min-h-dvh font-sans antialiased">
        {children}
        <Footer />
      </body>
    </html>
  );
}
