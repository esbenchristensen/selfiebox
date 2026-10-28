import type { Metadata, Viewport } from "next";
import { Instrument_Sans } from "next/font/google";
import { ChatWidget } from "@/components/support/ChatWidget";
import { themeScript } from "@/lib/theme";
import "./globals.css";

// One typeface: Instrument Sans (headings 600, body 400, labels 500 in capitals). Geist and Geist Mono are
// gone (21 Oct 2026); the --font-mono variable stays as a name, so older rules keep working, but points here.
const sans = Instrument_Sans({ subsets: ["latin", "latin-ext"], weight: ["400", "500", "600"], variable: "--font-sans" });

// Site-wide defaults only. Each page sets its own title, description, canonical and share image,
// because the private page and the venue page target different searches and different people.
export const metadata: Metadata = {
  metadataBase: new URL("https://www.selfi.dk"),
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
    <html lang="da" className={sans.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
