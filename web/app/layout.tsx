import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Sans } from "next/font/google";
import { themeScript } from "@/lib/theme";
import "./globals.css";

const display = Instrument_Sans({ subsets: ["latin", "latin-ext"], weight: ["500", "600"], variable: "--font-display" });
const body = Geist({ subsets: ["latin", "latin-ext"], variable: "--font-body" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

// Site-wide defaults only. Each page sets its own title, description, canonical and share image,
// because the private page and the venue page target different searches and different people.
export const metadata: Metadata = {
  metadataBase: new URL("https://selfi.dk"),
  openGraph: { siteName: "Selfi", locale: "da_DK", type: "website" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0e0f0e" },
    { media: "(prefers-color-scheme: light)", color: "#f3f4f1" },
  ],
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="da" className={`${display.variable} ${body.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
