# selfi.dk

Hjemmesiden for Selfi Boks, kun til erhverv: fotobokse i stedets eget design til venues, klubber, barer, hoteller og festivaler. Next.js (App Router). MongoDB bruges kun til katalogerne. Design og tekst følger Selfis brandguide.

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
| `app/kataloger/[slug]/` | Kataloger fra MongoDB, se nedenfor |
| `components/Outline.tsx` | Stregtegninger af boksen: sort streg med grønne detaljer |

## Før lancering

- **Kontaktformular:** sæt miljøvariablen `CONTACT_WEBHOOK_URL` i Vercel (fx et Slack-, Zapier- eller Make-webhook). Uden den svarer formularen, at den ikke er sat op endnu. Feltet `topic` fortæller, hvilken side beskeden kom fra.
- **Funktionssiderne:** teksterne i `features` er første udkast. Tjek dem mod, hvad boksen kan i dag, før siden markedsføres.
- **Temaer i 3D:** designene til Smukfest, Roskilde, Nibe, Fårup, LEGOLAND og Aalborg Zoo er konceptdesigns uden aftale med stederne. Få en tilladelse, eller skift dem ud med rigtige kunder, før siden bruges i markedsføring.
- **Juridisk:** cookie- og privatlivstekst mangler, hvis der tilføjes analyse eller tracking.

## Kataloger fra databasen

Salgskataloger ligger i MongoDB og vises på `selfi.dk/kataloger/<slug>`. Et nyt eller rettet katalog er online, så snart det er gemt, uden at siden skal deployes. Siderne er skjult for Google og står ikke i menuen eller sitemap.

1. Sæt `MONGODB_URI` i Vercel (og i `web/.env.local` på din egen maskine, se `.env.example`). Uden den viser alle katalog-URL'er en pæn "ikke tilgængeligt"-side. Vercel læser kun miljøvariabler ved deploy, så redeploy efter du har sat eller ændret den. Giv Vercel en databasebruger med kun `read` på databasen `selfi`; brugeren med skriveadgang hører kun til i `.env.local` til scriptet.
2. Læg et katalog ind:

```bash
cd web
node scripts/katalog.mjs gem smukfest-2027 kataloger/smukfest.html --titel "Selfi × Smukfest | Salgskatalog" --udloeber 2027-12-31
node scripts/katalog.mjs liste
node scripts/katalog.mjs skjul smukfest-2027   # viser 404 igen
node scripts/katalog.mjs slet smukfest-2027
```

Et katalog er HTML med én `<div class="kat-slot"><section class="kat-pg">…</section></div>` pr. A4-side. Det får stylingen fra `components/katalog/katalog.css`, og `--css fil.css` lægger katalogets egne regler ovenpå. `kataloger/smukfest.html` er Smukfest-kataloget fra `/events/smukfest` i det format, klar til at lægge ind. `kataloger/flying-hirsch.html` og `.css` er Flying Hirsch-kataloget fra `/erhverv/flying-hirsch` (gem med `--css kataloger/flying-hirsch.css`); designet bruger barens eget logo, så det kræver deres accept. `kataloger/aab.html` og `.css` er AaB-kataloget fra `/erhverv/aab` (gem med `--css kataloger/aab.css`); det bruger klubbens logo og kræver også deres accept. `kataloger/palads.html` og `.css` er Palads Teatret-kataloget fra `/erhverv/palads` (gem med `--css kataloger/palads.css`); boksen er tegnet på gen 2, og designet bruger biografens logo, så det kræver også deres accept. `kataloger/meny.html` og `.css` er MENY Fjerritslev-kataloget fra `/erhverv/meny-fjerritslev` (gem med `--css kataloger/meny.css`); det bruger MENYs logo og kræver også deres accept. `kataloger/heidis.html` og `.css` er Heidi's Bier Bar-kataloget fra `/erhverv/heidis` (gem med `--css kataloger/heidis.css`); boksen er tegnet på gen 2, og designet bruger barens logo, så det kræver deres accept. `kataloger/white-hawks.html` og `.css` er Frederikshavn White Hawks-kataloget fra `/erhverv/white-hawks` (gem med `--css kataloger/white-hawks.css`); boksen er tegnet på gen 2, og designet bruger klubbens logo, så det kræver deres accept. `--udloeber` gør linket dødt efter datoen, `--index` lader Google finde det. Husk: ingen standardrenders, tekniske tegninger eller boks-pris i festivalmateriale.

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
