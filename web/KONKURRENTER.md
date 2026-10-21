# Konkurrenter: leje af fotoboks til private i Danmark

*Gennemgang 21. oktober 2026 af udlejernes egne hjemmesider. Grundlag for sammenligningen på forsiden (`components/lej/Compare.tsx`). Alle beløb er inkl. moms. Tjek siderne igen, før tallene bruges i annoncer.*

## Priser og tilkøb

| Udlejer | Grundpris | Hvad der koster ekstra | Levering | Social proof |
|---|---|---|---|---|
| **Myselfie** (Vejle, markedsleder) | Fra 999 kr. for weekend eller 1 hverdag, 2 hverdage fra 1.299 kr., uge fra 1.999 kr. Prisen afhænger af datoen (sæsoner: Low, Mid, High, Peak) | Lydgæstebog 400 kr., gæsternes mobilbilleder i galleriet 99 kr., festpakker med rekvisitter, ekstra boks 795 kr., print fra +2.000 kr. (400 print). Pakker op til 3.399 kr. | GLS-pakkeshop, gratis, forsikring med | 50.000+ udlejninger, 10 år, anmeldelsesvæg, kundelogoer, 4,9 på Trustpilot |
| **Selfie.dk** (GoSelfie, siden 2013) | Fra 895 kr. for en weekend »ved booking i god tid«, med print fra 1.890 kr. | Rekvisitter og baggrunde sælges i egen webshop, lydgæstebog, Foto Sky-album | Gratis fragt og retur, forsikring med | Kundelogoer, »de første og blandt de største«, support til kl. 03 i weekenden |
| **MindeMagi** (Odense) | 899 kr. pr. dag, »Danmarks billigste« | Rekvisitter, baggrunde og printer i menuen uden priser | Kører selv ud og stiller op | Trustpilot 5,0 uden antal, fire udtalelser med fornavn |
| **EasySelfie** | Fra 995 kr. pr. dag (siden siger også »hele weekenden«) | Ingen nævnt, rekvisitter er med | Pakkeshop, gratis | Ingen |
| **Betty Booth** (svensk) | Betty Light 1.499 kr. (1 hverdag eller weekend), 1.999 kr. for 2 dage. Med print 4.599 kr. | Ingen nævnt | Med posten | Ingen |
| **SelfieCircle** (Ringsted) | 1.500 kr. for en weekend | Lydhilsen-pakke 1.899 kr., printer 3.000 kr., alt 3.399 kr. | Gratis fragt, leveringsgaranti | 6+ år, rekord på 2.310 billeder, fire udtalelser |
| **Simple Selfie** (LejAnlæg/Lejfesten) | 1.645 kr. for 3–4 dage | Baggrund som tilvalg, levering vist til 1.195 kr. ét sted og gratis et andet | GLS eller afhentning i Søborg/Langeskov | Ingen |
| **PartyVikings** | 1.049 kr. (nedsat fra 1.599 kr.) for 1–3 dage | Mikrofon til videohilsen 399 kr., fragt 42 kr. under 599 kr. | GLS | Trustpilot »Fremragende«, e-mærket, +250.000 kunder (hele webshoppen) |
| **360kamera.dk** | 999 kr. (360°-boks) | Depositum 1.000 kr. | Kører selv ud | Ingen |

**Selfi:** 695 kr. pr. dag, 895 kr. for weekend, 1.495 kr. for en uge (sat 21. okt. 2026: lige under de billigste konkurrenters »fra«-priser, men med alt inkluderet og uden sæsontillæg). Printer 895 kr. med 100 print er det eneste tilvalg. Ubegrænsede billeder, navne og dato på billedet, eventside, fragt begge veje og forsikring er med. Intet depositum.

## Det, de andre gør godt, og som vi har taget med

- **Myselfie:** »Se ledige datoer« som den eneste handling, prisen vises først ved valgt dato, »Gratis ombooking, så længe Myselfie ikke er sendt«, »Du betaler først i kassen«, betalingsikoner og »Inkl. moms, fragt, retur og forsikring« lige ved knappen. Anledning vælges i bookingen. Anmeldelsesvæg.
- **MindeMagi:** Kalender med »Populær, få pladser tilbage« og »Udsolgt«. Trustpilot-score i heroen. »Ingen skjulte gebyrer« og »Ingen binding« som badges.
- **SelfieCircle:** Leveringsgaranti og ubegrænset afbestilling, indtil maskinen er sendt. Rekord på én dag som social proof.
- **PartyVikings:** e-mærket, Trustpilot og GLS-leveringssikkerhed i procent.

## Det, de gør dårligt, og som vi undgår

- Lav »fra«-pris, der kun gælder i lavsæson eller »ved booking i god tid« (Selfie.dk, Myselfie). Vores pris er den samme hele året.
- Tilkøb for galleri, gæstebog, rekvisitter og print (Myselfie, Selfie.dk, SelfieCircle). Hos os er det med, og det meste er digitalt.
- Depositum (360kamera) og uklar fragt (Simple Selfie).
- Modstridende oplysninger på samme side: pris pr. dag mod pr. weekend (EasySelfie), 16 MP mod 4K (SelfieCircle), gratis levering mod 1.195 kr. (Simple Selfie).
- Ingen social proof overhovedet (EasySelfie, Betty Booth, 360kamera). Det er vores største hul også, se `lib/udlejning/proof.ts`.

## Best practice, vi har bygget efter

- **Baymard (2025):** 40 % af forladte køb skyldes ekstra omkostninger, 12 % at den samlede pris ikke kunne ses, 18 % at man skulle oprette en konto, 19 % mistillid med kortoplysninger. Derfor: den samlede pris i kalenderen, ingen konto, betalingsmåder og »I betaler først i kassen« ved knappen.
- **Social proof:** Konkret slår generelt (navn, anledning, by). En bedømmelse på 4,2–4,5 konverterer bedre end 5,0, og én anmeldelse med et minus gør resten troværdige. Anmeldelser tæt på knappen.
- **Afbestilling og ombooking** skrevet tydeligt på siden, ikke kun i betingelserne.
- **Ét mål pr. side:** Alle knapper på forsiden fører til kalenderen. 3D-boksen er indhold, ikke handling.

## Markedet

- Omkring 45.000 konfirmander om året (Danmarks Statistik, 2022) og omkring 28.000 vielser om året. Dertil runde fødselsdage, studenterfester, julefrokoster og firmafester. Sæsonen er april til september plus december.
- Søgeord, folk bruger: »lej fotoboks«, »fotoboks til bryllup«, »photo booth leje«, »selfiebox leje«, »fotoboks konfirmation«, »hvad koster en fotoboks«.
