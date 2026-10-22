# Supportchatten (Sif)

AI-supportchat på selfi.dk, der kan det samme som en erfaren supportmedarbejder: slå kundens bookinger op, svare på priser, vilkår og datoer, flytte datoer uden for højsæson efter et klart ja, søge på nettet, og sende sagen videre til Esben med en SMS, når den ikke må eller kan svare. Esben overtager fra admin.selfi.dk → Support.

## Filer

| Fil | Hvad |
|---|---|
| `support/system-prompt.md` | Reglerne: hvad Sif må, verificering, eskalering, prompt-sikkerhed. `{{VIDEN}}` og `{{STILGUIDE}}` fyldes ind ved kørsel. |
| `support/stilguide.md` | Tonen: de otte regler, form, sure kunder, nej, eksempler på gode og dårlige svar. |
| `support/viden.md` | Vidensbasen: forløbet for privat leje, lejebetingelser, første hjælp, erhverv. Priser og regler kommer live fra admin (rental_settings), ikke herfra. |
| `lib/support/knowledge.ts` | Samler de tre filer plus FAQ og funktioner fra `content.ts` til modellens instruktioner, og laver kontekstbeskeden pr. tur (dato, åbningstid, verificering, priser). |
| `lib/support/tools.ts` | Værktøjerne: `verify_customer`, `send_sms_code`, `verify_sms_code`, `register_business_lead` (designudkast, se `lib/erhverv/leads.ts`), `get_bookings`, `check_availability`, `propose_date_change`, `commit_date_change`, `escalate`, og OpenAI's indbyggede `web_search`. Kundeafgrænsningen håndhæves her. |
| `lib/support/agent.ts` | Én tur: OpenAI Responses API med streaming og function calling, værktøjsløkke, logning. |
| `lib/support/db.ts` | Collections `support_chats`, `support_messages` (TTL 90 dage) og `support_audit` (gemmes). Samme typer i selfiebox-platform `web/src/lib/types.ts`. |
| `lib/support/session.ts` | Cookie med chat-id og hemmelig token. |
| `lib/support/hours.ts` | Åbningstid (alle dage 10–22) og hvornår Esben realistisk svarer. |
| `lib/support/sms.ts` | SMS til Esben gennem Twilio ved eskalering. |
| `app/api/support/chat/route.ts` | GET (hent beskeder), POST (ny besked, svar som SSE), DELETE (ny samtale). |
| `app/api/support/human/route.ts` | "Tal med et menneske" uden om modellen. |
| `components/support/ChatWidget.tsx` + `support.css` | Widget'en på alle sider (lagt ind i `app/layout.tsx`). |
| `support/tests/cases.ts` | 29 testsamtaler, inkl. forsøg på at få andre kunders data og omgå reglerne. |
| `scripts/support-test.mts` | Kører testsamtalerne mod den rigtige model og skriver `support/tests/last-run.md`. |
| `scripts/support-seed.mts` | Testbookinger i en lokal udviklingsdatabase. |

Admin-siden ligger i selfiebox-platform: `web/src/app/admin/(panel)/support/` (liste, live-visning, Overtag, Giv tilbage, Afslut), `web/src/app/admin/support-actions.ts` og `web/src/lib/support-server.ts`.

## Sikkerhed

- **Kontaktoplysninger først:** widget'en beder om navn, e-mail og telefon, før første besked (`parseContact` i `session.ts`, gemt på `support_chats.contact`). De bruges ikke til opslag, før kunden selv spørger til en ordre.
- **Verificering** (GDPR) med bookingnummer, der skal være lavet med den oplyste e-mail eller det oplyste telefonnummer (`verify_customer`), eller med en 6-cifret engangskode på SMS til det oplyste nummer (`send_sms_code` + `verify_sms_code`: 10 min., højst 3 koder, hash i databasen). Efter en SMS-kode er kundens bookinger dem, der er lavet med det telefonnummer. Højst 5 forkerte forsøg pr. chat i alt. Før det kender modellen ingen bookinger.
- **Erhverv:** Sif taler også med steder og kan bestille et gratis designudkast (`register_business_lead`), som havner i Leads i admin, præcis som formularen på /erhverv.
- **Afgrænsning i backend:** alle opslag og ændringer går gennem `myRental()` i `tools.ts`, som kun accepterer bookingnumre fra `chat.customer.bookings`. Prompten kan ikke udvide det.
- **Bindende bookinger:** En annullering er aldrig mulig (lejebetingelserne punkt 8, stilguiden). Flytning kun til datoer uden for højsæson (`peakDays` i `lib/udlejning/core.ts`, måneder i `rules.peakMonths`).
- **Ændringer kræver ja:** `propose_date_change` gemmer et forslag og afviser højsæsondatoer; `commit_date_change` afvises, medmindre kunden har skrevet en ny besked efter forslaget (og inden en time). Alt logges i bookingens `history` og i `support_audit` med tid og aktør. Verificering og eskalering logges i `support_audit` med tid og aktør.
- **Penge, klager, jura, skade:** aldrig i chatten; `escalate`.
- **Prompt injection:** reglerne står i `instructions`, kundens tekst er altid `user`-beskeder, værktøjs- og websvar mærkes som data. Modellen får `store: false`, så OpenAI gemmer intet; `safety_identifier` er en hash af chat-id'et.
- **Rate limits:** 1.500 tegn pr. besked, 30 beskeder pr. 10 min. pr. chat, 20 nye chats pr. time pr. IP (pseudonymiseret).
- **GDPR:** chats og beskeder slettes af et TTL-indeks `SUPPORT_RETENTION_DAYS` (90) efter sidste besked. Privatlivspolitikken (`app/privatliv/page.tsx`) beskriver chatten.

## Miljøvariabler (Vercel)

```
OPENAI_API_KEY        kun på serveren; aldrig i kode, logs eller NEXT_PUBLIC_*
SUPPORT_MODEL         gpt-6.1-sol (standard). gpt-6-luna er billigere, gpt-6-astra dyrere og langsommere
SUPPORT_RETENTION_DAYS 90
TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM   samme konto som platformen (fleet/.env)
SUPPORT_SMS_TO        +45… det nummer, der får eskaleringer
LEADS_SMS_TO          +45… det nummer, der får nye leads (standard SUPPORT_SMS_TO)
LEADS_MAIL_TO         den adresse, der får nye leads på mail (standard company.email)
RESEND_API_KEY        bekræftelsen til leadet (fra booking@mail.selfi.dk)
ADMIN_URL             https://admin.selfi.dk (linket i SMS'en)
```

Uden Twilio-variablerne sendes ingen SMS, men chatten markeres stadig som "venter på menneske" i admin.

## OpenAI (oktober 2026)

Bygget på Responses API (`/v1/responses`) med den nyeste dokumentation på developers.openai.com:

- Modeller: `gpt-6.1-sol` (balance, 1 M kontekst, prompt-cache-læsning 0,05× input), `gpt-6-luna` (billig; `SUPPORT_JUDGE_MODEL` kan sætte den som dommer i testene), `gpt-6-astra` (dyrest). GPT-6-modellerne kræver Responses API til værktøjer og understøtter ikke `temperature`.
- `reasoning.effort: "low"` for hurtige svar (3–6 s med ét værktøjskald).
- Function calling med `strict: true` (alle felter i `required`, `additionalProperties: false`, valgfrie felter som `["string", "null"]`).
- Indbygget `web_search` med `user_location` DK og `search_context_size: "low"`; kilder (`url_citation`) vises som links under svaret.
- Streaming (`stream: true`): `response.output_text.delta`, `response.output_item.added`, `response.completed`.
- `store: false` + `include: ["reasoning.encrypted_content"]`, så reasoning kan sendes med tilbage i værktøjsløkken uden at OpenAI gemmer noget.
- Prompt caching: de statiske instruktioner kommer først og uændret, kontekst og historik sidst. `prompt_cache_key` holder cachen samlet.

## Tests

```bash
cd web
node --conditions=react-server --import tsx --env-file=.env.local --env-file=.env.test scripts/support-test.mts
# én samtale:           … scripts/support-test.mts --only flyt-dato-ok
# uden LLM-dommer:      … scripts/support-test.mts --no-judge
```

`.env.test` sætter `MONGODB_DB=selfiebox_support_test` (navnet skal indeholde "test"; databasen tømmes pr. samtale). SMS sendes aldrig i tests. Rapporten ligger i `support/tests/last-run.md`. Hver samtale koster få øre; hele sættet et par kroner.

Lokal udvikling med de samme bookinger: `node --conditions=react-server --import tsx --env-file=.env.local scripts/support-seed.mts` (kræver at `MONGODB_DB` indeholder "dev" eller "test").

## Rediger tonen uden kode

Ret `support/stilguide.md`, `support/system-prompt.md` eller `support/viden.md` og deploy. Kør testsættet bagefter, så en ny formulering ikke åbner for noget, der var lukket.
