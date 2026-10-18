import { Logo } from "@/components/Logo";

// Shown for a catalogue that does not exist, is hidden or has expired, and for every catalogue while MONGODB_URI is not set.
export default function KatalogMangler() {
  return (
    <main className="wrap" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", gap: 20, paddingTop: 48, paddingBottom: 48 }}>
      <Logo size={34} href="/events" />
      <h1 style={{ margin: 0, font: "600 clamp(32px, 7vw, 56px)/1.02 var(--font-display), sans-serif", letterSpacing: "-0.03em", maxWidth: "16ch" }}>
        Kataloget er ikke tilgængeligt
      </h1>
      <p style={{ margin: 0, maxWidth: "46ch", fontSize: 17, lineHeight: 1.5, color: "var(--ink-muted)" }}>
        Linket er måske udløbet, eller kataloget er ikke lagt op endnu. Skriv til os, så sender vi jer et nyt link.
      </p>
      <div className="btn-row">
        <a className="btn btn-primary" href="/events#kontakt">Kontakt os</a>
        <a className="btn btn-secondary" href="/events">Se Selfi til events</a>
      </div>
    </main>
  );
}
