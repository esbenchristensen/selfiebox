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
| P7 | Linjen "Under 15? Vælg Kun til mig." på samtykkeskærmen (ingen separat aldersskærm). Stedet kan slå en aldersskærm til, hvis boksen står hvor der er mange børn | Gæsteinfo, DPA |
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
| P21 | Tekst under startknappen: "Ved at tage et billede siger du ja til vilkårene · selfi.dk/brugsvilkaar" | Gæstevilkår |
| P22 | Kontrolpanelet kan fjerne et billede fra stedets egne flader (fotovæg, storskærm, galleri) med det samme, når en gæst trækker sit ja tilbage, og viser stedet en liste over tilbagetrukne samtykker | Gæstevilkår punkt 6 |

## Skærmtekster (valgt af Esben 19. okt.: to knapper, kort og indbydende)

Princip: én skærm, ét tryk, ingen juratekst på skærmen. Det juridiske står på selfi.dk/brugsvilkaar og selfi.dk/gaester. [Sted] er stedets navn. Stedet kan ændre alle tekster i kontrolpanelet (P19).

**1. Startskærm** (lille, grå tekst under startknappen)
> Ved at tage et billede siger du ja til vilkårene · selfi.dk/brugsvilkaar

**2. Efter billedet** (billedet stort, to knapper under)
> **Skal [Sted] vise dit billede frem?**
> [STOR KNAP i stedets farve] **Ja, del det** 
> lille tekst under: På storskærm, SoMe og i reklamer. Du kan altid fortryde.
> [tekstknap] Kun til mig
> nederst, lille: Under 15? Vælg "Kun til mig".

Begge knapper går videre til QR-koden/SMS. Kun "Ja, del det" gemmer samtykke (med tekstversion, P6). Ingen forvalg, ingen nedtælling, og "Kun til mig" skal være tydelig at se (ikke grå på grå), ellers er det ikke et frit valg.

**3. Få billedet** (QR-kode + felt til nummer)
> Scan koden, eller skriv dit nummer, så sender vi det.
> [ ] Send mig også tilbud fra [Sted]  ← ikke sat på forhånd, vises kun når et nummer er skrevet

**4. Hilsen til storskærmen** (før optagelse)
> Din hilsen bliver vist på storskærmen.
> Efter optagelse: [STOR KNAP] **Send hilsen**  · [tekstknap] Slet

**5. Konkurrence** (hvis aktiv, én linje)
> Du er med i lodtrækningen, uanset hvad du vælger.

## Skilt ved boksen (lag 1)

Fil: `selfi-gdpr-v1_skilt-ved-boksen.pdf` (A6, med QR til selfi.dk/gaester og felt til stedets navn). Følger med hver boks; stedet sætter det op (står i databehandleraftalen og vilkårene).
