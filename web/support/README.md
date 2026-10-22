# Supportchatten (Sif)

AI-supportchat på selfi.dk, der kan det samme som en erfaren supportmedarbejder: slå kundens bookinger op, svare på priser, vilkår og datoer, søge på nettet, og sende sagen videre til Esben med en SMS, når den ikke må eller kan svare. Esben overtager fra admin.selfi.dk → Support.

## Filer

| Fil | Hvad |
|---|---|
| `support/system-prompt.md` | Reglerne: hvad Sif må, verificering, eskalering, prompt-sikkerhed. `{{VIDEN}}` og `{{STILGUIDE}}` fyldes ind ved kørsel. |
| `support/stilguide.md` | Tonen: de otte regler, form, sure kunder, nej, eksempler på gode og dårlige svar. |
| `support/viden.md` | Vidensbasen: forløbet for privat leje, lejebetingelser, første hjælp, erhverv. Priser og regler kommer live fra admin (rental_settings), ikke herfra. |
| `lib/support/knowledge.ts` | Samler de tre filer plus FAQ og funktioner fra `content.ts` til modellens instruktioner, og laver kontekstbeskeden pr. tur (dato, åbningstid, verificering, priser). |
| `lib/support/tools.ts` | Værktøjerne: `verify_customer`, `get_bookings`, `check_availability`, `escalate`, og OpenAI's indbyggede `web_search`. Kundeafgrænsningen håndhæves her. |
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

- **Verificering** med bookingnummer + e-mail (`verify_customer`), højst 5 forsøg pr. chat. Før det kender modellen ingen bookinger.
- **Afgrænsning i backend:** alle opslag og ændringer går gennem `myRental()` i `tools.ts`, som kun accepterer bookingnumre fra `chat.customer.bookings`. Prompten kan ikke udvide det.
- **Ingen ændringer:** Bookinger er bindende (lejebetingelserne punkt 8), så assistenten kan ikke flytte eller afbestille. Ønsker om ændringer går til Esben med `escalate`. Verificering og eskalering logges i `support_audit` med tid og aktør.
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
# én samtale:           … scripts/support-test.mts --only flyt-dato-nej
# uden LLM-dommer:      … scripts/support-test.mts --no-judge
```

`.env.test` sætter `MONGODB_DB=selfiebox_support_test` (navnet skal indeholde "test"; databasen tømmes pr. samtale). SMS sendes aldrig i tests. Rapporten ligger i `support/tests/last-run.md`. Hver samtale koster få øre; hele sættet et par kroner.

Lokal udvikling med de samme bookinger: `node --conditions=react-server --import tsx --env-file=.env.local scripts/support-seed.mts` (kræver at `MONGODB_DB` indeholder "dev" eller "test").

## Rediger tonen uden kode

Ret `support/stilguide.md`, `support/system-prompt.md` eller `support/viden.md` og deploy. Kør testsættet bagefter, så en ny formulering ikke åbner for noget, der var lukket.
