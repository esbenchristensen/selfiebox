# Skærmtekster og krav til platformen (selfi-gdpr-v1)

**Version:** selfi-gdpr-v1, 19. okt. 2026. Teksterne på hjemmesiden (selfi.dk/gaester, /databehandleraftale, /dokumentation/brugsanvisning) og EU-erklæringen lover nedenstående. **Det skal være sandt i esbenchristensen/selfiebox-platform**, før den første boks leveres. Opgave til en tråd med adgang til den repo.

## Krav til platformen

| # | Krav | Hvorfor |
|---|---|---|
| P1 | Kamera og mikrofon gemmer/sender intet, før gæsten trykker start. Livebilledet vises kun på skærmen | Gæsteinfo, DPA, tv-overvågningsloven |
| P2 | Billeder uden "må bruges"-samtykke slettes automatisk senest 30 dage efter (server og galleri-link). Numre kun til SMS-deling slettes samtidig | Gæsteinfo |
| P3 | Content med samtykke slettes, når samtykket trækkes tilbage, eller når det ikke er brugt i 5 år | Gæsteinfo |
| P4 | Numre på gæstelisten slettes ved afmelding eller efter 2 år uden brug | Gæsteinfo |
| P5 | Tekniske logs med personoplysninger slettes efter 90 dage | Gæsteinfo, DPA |
| P6 | Samtykker gemmes med tidspunkt, boks, sted og den præcise tekst/version | GDPR art. 7(1) |
| P7 | Aldersspørgsmål ("Er du 15 år eller ældre?") før samtykke til brug og markedsføring. Nej → ingen samtykke-knapper | Gæsteinfo, DPA |
| P8 | Samtykke til markedsføring må ikke være krav for konkurrencer eller for at få billedet | GDPR art. 7(4), vilkår |
| P9 | Hver SMS fra stedet har en nem afmelding | Markedsføringsloven § 10 |
| P10 | Ingen ansigtsgenkendelse/følelsesgenkendelse. AI-genererede billeder mærkes "lavet med AI" | Gæsteinfo, AI-forordningen art. 50 |
| P11 | Ingen standardadgangskoder, SSH kun med nøgler eller slået fra, Bluetooth og ubrugte tjenester slået fra, WLED-flade beskyttet | EN 18031, DoC |
| P12 | Signerede opdateringer over TLS, automatiske sikkerhedsopdateringer | EN 18031, DoC |
| P13 | Wi-Fi landekode DK. Bokse registreret som "udendørs" bruger ikke 5150–5350 MHz (kanal 36–64) | RED art. 10(10), brugsanvisning |
| P14 | RGB-effekter højst 3 blink pr. sekund; WLED strømbegrænser 2000 mA | Brugsanvisning, teknisk fil 6.3/6.6 |
| P15 | Billeder/video slettes fra boksens SD-kort, når de er uploadet. Fjernspærring og -sletning af en boks | DPA punkt 7 |
| P16 | Stedets navn vises på skærmen som dataansvarlig, og link/QR til selfi.dk/gaester | GDPR art. 13 |
| P17 | Galleri-links er lange og tilfældige (≥ 128 bit) | DPA punkt 7 |
| P18 | Totrinsbekræftelse for Selfis administratorer i admin.selfi.dk | DPA punkt 7 |
| P19 | **Stedet kan redigere alle gæstetekster i kontrolpanelet** (tekst under startknap, samtykketekster, link til egne vilkår, skilt). Selfis tekster er standard. Hver ændring gemmes som ny version med tidspunkt og bruger, og hvert samtykke peger på den version, gæsten så. Ved første ændring viser kontrolpanelet: "I står selv for, at jeres tekster er lovlige" og stedet accepterer | Vilkår punkt 7, DPA punkt 4 (ansvaret ligger hos stedet) |
| P20 | **Hilsen til storskærmen:** skærmen siger før optagelsen, at hilsenen vises på storskærm og bruges af stedet. Knappen "Send hilsen" er samtykket (gemmes som P6). "Slet" sletter med det samme | Gæstevilkår punkt 4 |
| P21 | Tekst under startknappen: "Ved at tage et billede accepterer du vilkårene for [Stedets navn]. selfi.dk/brugsvilkaar" | Gæstevilkår |
| P22 | Kontrolpanelet kan fjerne et billede fra stedets egne flader (fotovæg, storskærm, galleri) med det samme, når en gæst trækker sit ja tilbage, og viser stedet en liste over tilbagetrukne samtykker | Gæstevilkår punkt 6 |

## Skærmtekster (forslag, lag 1)

**Startskærm, lille tekst under startknappen:**
> Ved at tage et billede accepterer du vilkårene for [Stedets navn]. Boksen optager først, når du trykker start. selfi.dk/brugsvilkaar

**Efter billedet, før deling:**
> Få dit billede: scan QR-koden, eller skriv dit nummer, så sender vi det på SMS.
> Nummeret bruges kun til at sende billedet og slettes efter 30 dage, medmindre du siger ja nedenfor.

**Alder (vises før samtykker):**
> Er du 15 år eller ældre?  [Ja] [Nej]
> (Nej: "Så får du bare dit billede. Spørg en voksen, hvis I vil dele det med [stedet].")

**Samtykke til brug af billede/video (afhænger af Esbens valg 19. okt.):**

*Anbefalet: ét tryk, to knapper.* Efter billedet, i stedet for en ja/nej-dialog:
> [STOR KNAP, stedets farve] **Del, og [Stedets navn] må bruge det**
> [lille tekstknap] Kun til mig
> Lille tekst: "Så må [Stedet] bruge billedet på storskærm, sociale medier og i markedsføring. Du kan fortryde på selfi.dk/gaester."
Begge knapper giver gæsten billedet (QR/SMS). Kun den store knap gemmer samtykke.

*Alternativ (Esbens oprindelige ønske):* teksten under startknappen dækker også brugen, og billedet udleveres kun efter accept. Holder sandsynligvis ikke som samtykke (GDPR art. 7(4), EDPB 05/2020), så stedet bærer risikoen.

**Samtykke til markedsføring (separat, ikke forvalgt, kun hvis nummer er givet):**
> Vil du have tilbud og nyheder fra [Stedets navn] på SMS? Du kan altid afmelde dig i beskederne.  [Ja tak] [Nej tak]

**Konkurrence:**
> Du er med i lodtrækningen, uanset hvad du svarer om tilbud.

**Video med lyd, før optagelse:**
> Videoen optager billede og lyd i [X] sekunder, når du trykker start.

## Skilt ved boksen (lag 1)

Fil: `selfi-gdpr-v1_skilt-ved-boksen.pdf` (A6, med QR til selfi.dk/gaester og felt til stedets navn). Følger med hver boks; stedet sætter det op (står i databehandleraftalen og vilkårene).
