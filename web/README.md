# selfi.dk

Landingssiden for Selfi Boks. Next.js (App Router), ingen andre afhængigheder. Design og tekst følger Selfis brandguide.

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
| `content.ts` | Priser, pakker, aktiviteter, specifikationer og FAQ for hver målgruppe |
| `app/globals.css` | Tokens (farver, afstande, radier) og al styling |
| `app/page.tsx` | Forsiden: leje til private fester. Tekster, billeder og rækkefølge |
| `app/erhverv/page.tsx` | Barer, klubber og hoteller. Tekster, billeder og rækkefølge |
| `components/` | Én fil pr. sektion. Sektionerne tager deres tekst fra siden |
| `SIDESTRUKTUR.md` | Hvorfor privat og erhverv har hver sin side |
| `app/api/kontakt/route.ts` | Kontaktformularen |
| `components/three/` | 3D-boksen (React Three Fiber) og temaerne i `themes.ts`. Alt tegnes i kode, ingen billedfiler |
| `components/Outline.tsx` | Stregtegninger af boksen: sort streg med grønne detaljer |

## Før lancering

- **Privatpriser:** sæt `price` på pakkerne i `content.ts`. Indtil da står der "Pris efter dato".
- **Kontaktformular:** sæt miljøvariablen `CONTACT_WEBHOOK_URL` i Vercel (fx et Slack-, Zapier- eller Make-webhook). Uden den svarer formularen, at den ikke er sat op endnu.
- **Fotos:** sektionerne Fotoet, fotobåndet og Privat bruger pladsholdere (`.ph`). Erstat dem med rigtige fotos, når de findes, og kun med samtykke.
- **Temaer i 3D:** designene til Smukfest, Roskilde, Nibe, Fårup, LEGOLAND og Aalborg Zoo er konceptdesigns uden aftale med stederne. Få en tilladelse, eller skift dem ud med rigtige kunder, før siden bruges i markedsføring.
- **Juridisk:** cookie- og privatlivstekst mangler, hvis der tilføjes analyse eller tracking.

## Hosting på Vercel

Importér repoet i Vercel og sæt **Root Directory** til `web`. Framework genkendes som Next.js. Tilføj domænet `selfi.dk` under Domains.
