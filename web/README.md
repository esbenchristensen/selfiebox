# selfi.dk

Hjemmesiden for Selfi Boks, kun til erhverv: fotobokse i stedets eget design til venues, klubber, barer, hoteller og festivaler. Next.js (App Router). Design og tekst følger Selfis brandguide.

## Kør lokalt

```bash
cd web
npm install
npm run dev        # http://localhost:3000
npm run build      # produktionsbuild
npm run lint       # typecheck
```

## Hvor ting ligger

| Fil | Indhold |
|---|---|
| `content.ts` | Funktionerne (menu og sider), aktiviteter, contentregneren og FAQ |
| `app/globals.css` | Tokens (farver, afstande, radier) og al styling |
| `app/page.tsx` | Forsiden: fotobokse i eget design og contentmaskinen. Tekster, billeder og rækkefølge |
| `app/funktioner/` | Oversigten og én side pr. funktion, bygget fra `features` i `content.ts` |
| `components/Nav.tsx` | Headeren med Funktioner-megamenuen |
| `components/` | Én fil pr. sektion. Sektionerne tager deres tekst fra siden |
| `SIDESTRUKTUR.md` | Historik: dengang privat og erhverv havde hver sin side |
| `app/api/kontakt/route.ts` | Kontaktformularen |
| `components/three/` | 3D-boksen (React Three Fiber): den rigtige Halo-kasse og stedernes printede dele. `venues.json` er stederne, `themes.ts` er privattemaerne |
| `public/models/` | 3D-modeller, skærme, fotorammer og logoer. Bygges fra hardware-branchen, se nedenfor |
| `app/erhverv/<slug>/` | Salgskatalogerne, ét pr. kunde, se nedenfor |
| `components/Outline.tsx` | Stregtegninger af boksen: sort streg med grønne detaljer |

## Før lancering

- **Kontaktformular:** sæt miljøvariablen `CONTACT_WEBHOOK_URL` i Vercel (fx et Slack-, Zapier- eller Make-webhook). Uden den svarer formularen, at den ikke er sat op endnu. Feltet `topic` fortæller, hvilken side beskeden kom fra.
- **Funktionssiderne:** teksterne i `features` er første udkast. Tjek dem mod, hvad boksen kan i dag, før siden markedsføres.
- **Temaer i 3D:** designene til Smukfest, Roskilde, Nibe, Fårup, LEGOLAND og Aalborg Zoo er konceptdesigns uden aftale med stederne. Få en tilladelse, eller skift dem ud med rigtige kunder, før siden bruges i markedsføring.
- **Juridisk:** cookie- og privatlivstekst mangler, hvis der tilføjes analyse eller tracking.

## Udlejning til private (/lej)

selfi.dk (forsiden) er landingssiden for B2C-udlejning. Kunden vælger tema, printer, billedtype og levering, så datoer i kalenderen, og betaler i Stripe Checkout. Bookingerne ligger i MongoDB (database `selfiebox`, samlingerne `rentals`, `rental_settings` og `rental_blocks`) og styres i admin.selfi.dk under Udlejning, hvor også priser, antal bokse og printere og reglerne for forsendelse ligger.

- `lib/udlejning/core.ts`: priser og ledighed. En kopi ligger i selfiebox-platform (`web/src/lib/udlejning.ts`), så hold dem ens.
- `/api/udlejning/ledighed`, `/api/udlejning/checkout`, `/api/udlejning/annuller` og `/api/stripe/webhook`.
- Miljøvariabler i Vercel: `MONGODB_URI`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` (fra webhooket i Stripe til `https://www.selfi.dk/api/stripe/webhook`), valgfrit `MONGODB_DB` (standard `selfiebox`), `SITE_URL` (standard `https://www.selfi.dk`) og `BOOKING_WEBHOOK_URL` til en besked, når en booking er betalt (ellers bruges `CONTACT_WEBHOOK_URL`).

## Kataloger

Et salgskatalog er kundens side på `selfi.dk/erhverv/<slug>` (Smukfest ligger på `/events/smukfest`): en `page.tsx`, der viser A4-siderne med `components/katalog/Viewer` og `components/katalog/katalog.css`, plus kundens egen CSS i samme mappe. Siderne er skjult for Google og står ikke i menuen eller sitemap. Der er kun den ene version: de gamle MongoDB-kopier på `/kataloger/<slug>` sender videre til erhvervssiden (`next.config.ts`).

`selfi.dk/api/kataloger` lister alle sider, der bruger katalog-vieweren, med titel og beskrivelse fra sidens metadata. Admin (`admin.selfi.dk/admin/kataloger`) viser den liste, så et nyt katalog dukker op der ved næste deploy uden flere skridt. Katalogerne bruger kundens logo og kræver deres accept. Husk: ingen standardrenders, tekniske tegninger eller boks-pris i festivalmateriale.

## Hosting på Vercel

Importér repoet i Vercel og sæt **Root Directory** til `web`. Framework genkendes som Next.js. Tilføj domænet `selfi.dk` under Domains.

## 3D-modellerne

Kassen og stedernes temadele (vinger og topper) er de samme filer, som printes. De ligger på branchen
`claude/halo-enclosure`. Byg temaerne dér, og kopiér dem ind på siden:

```bash
git worktree add ../halo origin/claude/halo-enclosure
python3 ../halo/hardware/tools/venue_themes.py     # printfiler + web-filer for alle seks steder
node scripts/build-models.mjs ../halo               # -> public/models/ og components/three/venues.json
```
