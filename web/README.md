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
| `content.ts` | Al tekst der ændres ofte: priser, pakker, aktiviteter, specifikationer, FAQ |
| `app/globals.css` | Tokens (farver, afstande, radier) og al styling |
| `app/page.tsx` | Sektionernes rækkefølge |
| `components/` | Én fil pr. sektion |
| `app/api/kontakt/route.ts` | Kontaktformularen |
| `public/renders/` | Produktrenderinger fra CAD-modellen (Blender) |

## Før lancering

- **Privatpriser:** sæt `price` på pakkerne i `content.ts`. Indtil da står der "Pris efter dato".
- **Kontaktformular:** sæt miljøvariablen `CONTACT_WEBHOOK_URL` i Vercel (fx et Slack-, Zapier- eller Make-webhook). Uden den svarer formularen, at den ikke er sat op endnu.
- **Fotos:** sektionerne Fotoet, fotobåndet og Privat bruger pladsholdere (`.ph`). Erstat dem med rigtige fotos, når de findes, og kun med samtykke.
- **Renderinger:** skærmen i renderingerne viser stadig "SELFIEBOX" nederst og skal gen-renderes med Selfi-logoet.
- **Juridisk:** cookie- og privatlivstekst mangler, hvis der tilføjes analyse eller tracking.

## Hosting på Vercel

Importér repoet i Vercel og sæt **Root Directory** til `web`. Framework genkendes som Next.js. Tilføj domænet `selfi.dk` under Domains.
