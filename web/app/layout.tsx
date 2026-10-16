import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Sans } from "next/font/google";
import "./globals.css";

const display = Instrument_Sans({ subsets: ["latin", "latin-ext"], weight: ["500", "600"], variable: "--font-display" });
const body = Geist({ subsets: ["latin", "latin-ext"], variable: "--font-body" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  metadataBase: new URL("https://selfi.dk"),
  title: "Selfi Boks – fotoboksen med lysringen",
  description:
    "Selfi Boks hænger på væggen, lyser gæsterne op og printer ægte Instax-fotos. Til barer, hoteller og festivaler, og til leje til bryllupper og fester.",
  openGraph: {
    title: "Selfi Boks – fotoboksen med lysringen",
    description: "Fotoboksen der hænger på væggen og tjener penge på hvert smil.",
    url: "https://selfi.dk",
    siteName: "Selfi",
    locale: "da_DK",
    type: "website",
    images: [{ url: "/renders/hero.jpg", width: 1200, height: 1500, alt: "Selfi Boks med tændt lysring" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0e0f0e",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="da" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
