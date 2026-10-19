# Teknisk fil: Selfi Boks gen 2, type SB2, hardware halo-gen2-v8

**Version:** halo-gen2-v8_teknisk-fil, udgave 1, 19. okt. 2026. Efter radioudstyrsdirektivet 2014/53/EU, bilag V (modul A), RoHS-direktivet og GPSR. Skal gemmes i **10 år** efter, at den sidste boks af denne type er leveret, og vises til Sikkerhedsstyrelsen eller Energistyrelsen på forlangende (på dansk eller engelsk).

Hver gang hardware, strømforsyning, radiomoduler eller kabinettets materiale ændres, laves en ny udgave med nyt versionsnavn, og ændringen vurderes mod punkt 6–10. Software-opdateringer skal vurderes mod punkt 9 (cyber).

**Tjeklister i denne fil skal krydses af (✔ dato, initialer), før den første boks leveres.**

---

## 1. Produktbeskrivelse (bilag V, a)

| | |
|---|---|
| Produkt | Selfi Boks gen 2, type SB2: interaktiv fotoboks til vægmontering i barer, klubber, hoteller, foyerer og på festivaler, indendørs og under tag |
| Hardwareversion | halo-gen2-v8 (printfiler: `/mnt/project-files/gen2-printfiler/halo-gen2-v8/`, CAD: `hardware/cad/gen2_concept.scad` i esbenchristensen/selfiebox) |
| Software | Selfi kiosk/agent (esbenchristensen/selfiebox-platform, `box/`), Raspberry Pi OS. Version noteres i produktionsloggen pr. boks |
| Mål og vægt | 222,5 × 306 × 70 mm, ca. 1,6 kg |
| Strøm | Ekstern adapter Mean Well GST90A24-P1M: 100–240 V~ ind, 24 V ⎓ 3,75 A ud. Ind i boksen: 24 V via 2,5 mm hunstik med skrueklemmer |
| Indvendige spændinger | 24 V (hvide COB-strips via dæmper), 5 V fra Mean Well RSD-60G-5 (Pi 5, skærm, RGB-strip, Gledopto) |
| Kabinet | 3D-printet ASA (sort skal/front/beslag, hvid bagramme, natur lysring), ingen åbninger over 2,5 mm (mikrofonhuller Ø1) |
| Brugere | Gæster (forbrugere, også børn) betjener skærmen. Kun Selfi installerer, åbner og servicerer |
| Billeder | 3D og snit på admin.selfi.dk/admin/hardware (version halo-gen2-v8) og i printmappen |

## 2. Dele (stykliste med overensstemmelse)

Kilde: `/mnt/project-files/indkoeb/halo-gen2-v4_indkoebsliste.xlsx` (dele uændret til v8) og datablade i `/mnt/project-files/gen2-elektronik/datablade/`. Kolonnen "Erklæring" krydses af, når leverandørens EU-overensstemmelseserklæring (DoC) og RoHS-erklæring er gemt i `dokumentation/leverandoerer/`.

| Del | Producent / nr. | Relevante krav | Leverandørens erklæring | Gemt |
|---|---|---|---|---|
| Raspberry Pi 5, 4 GB | Raspberry Pi Ltd | RED (Wi-Fi 2,4/5 GHz, BT), RoHS, EN 62368-1, EN 18031-1 | EU DoC 17. jul. 2025 (pip.raspberrypi.com, RP-004946-CF) | ☐ |
| Active Cooler | Raspberry Pi Ltd | EMC, RoHS | pip.raspberrypi.com | ☐ |
| Touch Display 2, 10" | Raspberry Pi Ltd | EMC, RoHS, 62368-1 | pip.raspberrypi.com | ☐ |
| Camera Module 3 Wide + kabel | Raspberry Pi Ltd | EMC, RoHS | pip.raspberrypi.com | ☐ |
| Netadapter GST90A24-P1M | Mean Well | LVD, EMC, RoHS, ErP (EU) 2019/1782 niveau VI, EN 62368-1 | meanwell.com | ☐ |
| Netkabel C13/DK | Elektronik-lavpris (W95732) | LVD, RoHS | Bed leverandøren | ☐ |
| DC-DC RSD-60G-5 | Mean Well | EMC, RoHS, EN 62368-1 (kabinet UL94 V-0) | meanwell.com | ☐ |
| RGB-styring GL-C-016WL-D (Wi-Fi) | Gledopto | **RED**, RoHS | Bed leverandøren/Gledopto om RED-DoC. Uden en RED-erklæring må modulet ikke bruges | ☐ |
| Dæmper DFR0457 | DFRobot | EMC, RoHS (modul uden radio, 24 V) | dfrobot.com | ☐ |
| Hvid COB-strip 24 V Ra95 (2 rækker) | LEDlife (Ledproff) | EMC, RoHS, EN 62471 | Ledproff | ☐ |
| RGB-strip WS2812B COB 5 V | Ledprodukter.dk | EMC, RoHS | Ledprodukter.dk | ☐ |
| Klikstik, Wago 221-41x, hunstik EL 124-538, sikringsholder, kabler 1,0 mm² | Diverse | RoHS (passive) | Wago: wago.com; øvrige: bed leverandør | ☐ |
| Sikring | Fladsikring **3,15 A træg** (ny, se punkt 6.3) | | | ☐ |
| Tilvalg: SIM7600G-H 4G HAT (B) | Waveshare/SIMCom | **RED** (GSM/UMTS/LTE/GNSS), RoHS | waveshare.com | ☐ |
| Tilvalg: reSpeaker Flex XVF3800 + XIAO ESP32-S3 | Seeed Studio | **RED** (XIAO har Wi-Fi/BLE), EMC, RoHS | seeedstudio.com | ☐ |
| Tilvalg: højttaler FIT0502 3 W | DFRobot | RoHS | dfrobot.com | ☐ |
| Tilvalg: LIS3DH, reed-modul, magnet | Adafruit, diverse | RoHS | adafruit.com / leverandør | ☐ |
| ASA-filament (sort, hvid, natur, grøn) | Bambu Lab | RoHS, REACH | Bambu Labs RoHS/REACH-erklæring for ASA | ☐ |
| Skruer A2, dybler | Bolte.dk, Fischer | RoHS/REACH (ikke elektrisk) | Ikke påkrævet | — |

## 3. Tegninger og diagrammer (bilag V, b)

- Ledningsdiagram: `/mnt/project-files/gen2-printfiler/halo-gen2-v8/halo-gen2-v8_ledningsdiagram.png` (**skal rettes: sikring 3,15 A træg, ikke 5 A**).
- Printfiler og PRINTGUIDE: samme mappe. CAD-kilde i repo.
- Placering af elektronik: `/mnt/project-files/gen2-elektronik/gen2_elektronik_og_laas.png`, `gen2_bund_kabler_hoejttaler.png`.

## 4. Anvendte standarder (bilag V, d)

| Krav | Standard | Hvordan |
|---|---|---|
| 3.1(a) sikkerhed | EN IEC 62368-1:2020+A11:2020 | Risikovurdering punkt 6 + egne test punkt 11 |
| 3.1(a) EMF | EN 62311:2008 | Beregning punkt 8 |
| 3.1(a) lys | EN 62471:2008 | Vurdering punkt 6.6 |
| 3.1(b) EMC | ETSI EN 301 489-1/-17 (+ -19/-52 med 4G), EN 55032, EN 55035 | Teknisk vurdering punkt 7 |
| 3.2 radio | ETSI EN 300 328, EN 301 893 (+ EN 301 511, EN 301 908-1/-2/-13, EN 303 413 med 4G) | Modulernes egne testrapporter, punkt 8 |
| 3.3(d)(e) cyber | EN 18031-1:2024, EN 18031-2:2024 | Tjekliste punkt 9 |
| RoHS | EN IEC 63000:2018 | Punkt 10 |

## 5. EU-overensstemmelseserklæring (bilag V, e)

`halo-gen2-v8_eu-overensstemmelseserklaering.pdf` og selfi.dk/dokumentation/overensstemmelseserklaering. Forenklet erklæring (bilag VII) står i brugsanvisningen.

## 6. Risikovurdering, sikkerhed (EN IEC 62368-1, GPSR art. 6)

Tilgang: 62368-1 er "fareforebyggende": energikilder klassificeres, og der skal være beskyttelse mellem kilde og person.

### 6.1 Elektrisk stød
- Netspænding findes kun i Mean Wells adapter (dobbeltisoleret klasse II, CE, EN 62368-1). Inde i boksen er alt ES1 (≤ 60 V DC): 24 V og 5 V. **Ingen fare for elektrisk stød fra boksen.** ✔ ved design.
- Krav: adapteren må ikke byttes til en anden. Står i brugsanvisning og på typeskilt.

### 6.2 Varme (brændskader, TS)
- Ydersider: berøres af gæster. Grænse for plastoverflader, der berøres kort: 48 °C (TS1) / længere tid 43 °C. Indvendig luft skønnet 45 °C ved 22 °C rum (PRINTGUIDE v7). **Mål overfladetemperaturen på front og skærm efter 4 timers drift ved fuld belastning (test T3).**
- Pi'en sætter farten ned ved 80–85 °C og slukker ved fortsat overophedning. Indbygget beskyttelse.

### 6.3 Brand (PS)
- Netadapter 90 W slår først fra ved 105–150 % last → uden sikring er 24 V-kredsen **PS3** og kræver V-1-brandkabinet. ASA er HB. **Ikke acceptabelt.**
- **Tiltag:** sikring 3,15 A træg (IEC 60127/ISO 8820) i 24 V-plus lige efter hunstikket → efterfølgende kredse er begrænset strømkilde efter bilag Q, tabel Q.2 (≤ 100/U = 4,16 A ved 24 V) → **PS2**.
- Sikringen sidder før al anden ledningsføring; mellem hunstik og sikringsholder maks. 5 cm ledning, fastholdt.
- PS2: vis ved enkeltfejlstest (afsnit 6.4.3), at intet antændes (test F1–F6). Hvis en test viser flammer eller over 300 °C på plast: brug V-0-filament til bagrammen og bakkerne.
- RGB-styringen begrænses i WLED til 2000 mA (ABL), så normal spidslast holder sig under sikringens værdi.

### 6.4 Mekanisk (MS)
- Vægt 1,6 kg på vægbeslag med 4 skruer og dybler efter væggen + sikkerhedsskrue: træktest T5 (3 × vægten = 50 N i 1 min nedad og udad).
- Skarpe kanter: printede kanter er rundede (squircle). Skærmglas 1,1 mm: ved brud, sluk og afspær (brugsanvisning). Glasset sidder bag frontens kant, så det ikke stikker ud.
- Ingen bevægelige dele udvendigt. Pi-blæseren er inde i lukket kabinet.
- Boksen ved børnehøjde: ingen smådele, der kan løsne sig udvendigt (logoet er printet ind).

### 6.5 Vand og fugt
- Kun indendørs og under tag. Ingen IP-klasse erklæres. Elektronikken er kun ES1/PS2, så indtrængende vand giver ikke stødfare, men kan give kortslutning → sikringen (6.3) beskytter.
- Adapteren er kun til tørre steder (står i brugsanvisning). HFI anbefales/kræves udendørs.
- Egen sprøjtetest T6 (valgfri, kun hvis I vil skrive "tåler stænk"): 10 min vandforstøver fra 1 m ovenfra og forfra, derefter åbn og se efter vand.

### 6.6 Lys (EN 62471, epilepsi)
- Hvide COB-strips (4000 K) lyser mod en hvid reflektor og ud gennem diffus ASA-lysring på 1 mm. Luminansen er langt under 10.000 cd/m² → fritaget gruppe efter EN 62471 (skøn, ingen måling nødvendig for diffust hvidt lys i denne effekt).
- RGB-effekter: højst 3 blink pr. sekund og ingen fuldskærms rød blink (WCAG 2.3.1 / ISO 9241-391). **Krav til platformen.**

### 6.7 Lyd
- Højttaler 3 W: maks. lydtryk langt under grænser for høreskade. Ingen krav.

### 6.8 Forudsigelig fejlbrug (GPSR art. 6)
| Fejlbrug | Risiko | Tiltag |
|---|---|---|
| Gæst slår på skærmen / kaster glas | Glasbrud, snitsår | Glas bag forkant, brugsanvisning, stødsensor (tilvalg) giver alarm |
| Spild af øl ovenfra | Kortslutning | Toppen er lukket (v8), drypkant, sikring 3,15 A |
| Stedet bruger en anden adapter (fx 48 V) | Brand/defekt | Typeskilt "Kun Mean Well GST90A24", brugsanvisning. RSD-60G-5 tåler 9–36 V ind; hvide strips ville tage skade ved over 24 V → sikring |
| Boks i direkte sol i telt | Overophedning | Brugsanvisning; Pi drosler selv; overvågning giver alarm ved temperatur |
| Børn hænger i boksen | Nedfald | Beslag + træktest T5 |
| Nogen åbner boksen | Ingen stødfare (ES1) | Sikkerhedsskrue, "åbn ikke" |

## 7. EMC-vurdering (3.1(b))

- Alle elektroniske delmoduler er CE-mærkede til EMC (punkt 2), og ingen af dem er ændret. Der tilføjes ingen egne printkort, oscillatorer eller switch-kredse.
- Kilder til forstyrrelser: RSD-60G-5 (switch-mode, opfylder selv EN 55032 klasse B), Pi 5 (klasse B), dæmperens PWM på de hvide strips (lavfrekvent), WS2812-data (800 kHz).
- Forholdsregler: korte ledninger, plus og minus snoet sammen/ført parallelt, kamerakabel væk fra 24 V-ledninger, dæmperens PWM ≥ 1 kHz (ingen synlig flimmer på video).
- Immunitet: boksen bruges i barer/klubber med lys- og lydanlæg (miljø: bolig/erhverv, EN 55035).
- **Egne kontroller (E1–E4), krydses af:**
  - ☐ E1: FM/DAB-radio 1 m fra boksen: ingen hørbar støj, når boksen tager billede med fuldt lys.
  - ☐ E2: Wi-Fi-hastighed og 4G-signal er uændret med lys til/fra (ingen selvforstyrrelse).
  - ☐ E3: Touch og kamera virker, mens en mobiltelefon ringer 10 cm fra boksen og mens en lysdæmper/stroboskop kører i samme stikkontakt.
  - ☐ E4: ESD: gnid en uldtrøje, rør skærm, front og mikrofonhuller 10 gange: boksen må gerne genstarte appen, men ikke låse eller tage skade.
- Restrisiko: uden laboratorie-måling kendes udstrålingen ikke præcist. Anbefaling (ikke krav): én EMC-forscanning på et laboratorium, når hardwaren er låst.

## 8. Radio (3.2) og elektromagnetiske felter (3.1(a))

- Radiomoduler: Pi 5 (Wi-Fi/BT, modulært certificeret), Gledopto (Wi-Fi), XIAO ESP32-S3 (tilvalg), SIM7600G-H (tilvalg). Alle med egen RED-erklæring, egne antenner, ikke ændret. Kabinettet er plast (ASA), så antennerne afskærmes ikke.
- Integration efter ETSI EG 203 367: modulerne bruges inden for deres egne betingelser (forsyningsspænding, antenne, ingen ændret firmware til radiodelen). Krav: **Wi-Fi landekode sat til DK** i Pi'ens opsætning (styrer kanaler og effekt).
- 5150–5350 MHz er kun til indendørs brug i hele EU (RED art. 10(10)). Krav til platformen: når boksen er registreret som "udendørs/telt", må Pi'en ikke bruge kanal 36–64. Brugsanvisning og emballageindlæg oplyser begrænsningen.
- Sendeeffekter i brugsanvisningen er de øvre grænser for båndene. Erstat med modulernes faktiske tal fra testrapporterne, når de er hentet.
- **EMF (EN 62311), beregning ved 20 cm (værste tilfælde 4G LTE 23 dBm + 2 dBi antenne = 316 mW e.i.r.p.):** S = 0,316 / (4π × 0,2²) = 0,63 W/m². ICNIRP referenceværdi ved 800 MHz: 4 W/m². Under grænsen med faktor 6, også ved 20 cm. Wi-Fi (≤ 100 mW) og BT er lavere. GSM 2 W spids, 0,25 W i gennemsnit (1/8 tidsslot): samme niveau. **Overholdt.** Gæster står normalt 0,5–1 m fra boksen.
- RED art. 10(2): alle bånd kan bruges i mindst ét EU-land. ✔

## 9. Cybersikkerhed (3.3(d)(e), EN 18031-1 og -2)

Boksen er internetforbundet radioudstyr og behandler personoplysninger (billeder, video, lyd, numre). Modul A er kun tilladt, når EN 18031-1/-2 anvendes fuldt og uden de begrænsninger, der er i (EU) 2025/138 (fx må brugeren ikke kunne vælge at slå adgangskoder fra). Ellers kræves et bemyndiget organ. Tjeklisten skal derfor være sand:

| EN 18031-krav | Hvad boksen skal gøre | ✔ |
|---|---|---|
| ACM (adgangskontrol) | Ingen lokale konti, der kan bruges af gæster. Kiosk-app i fuldskærm uden adgang til styresystemet. Stedet har kun adgang via kontrolpanelet på nettet | ☐ |
| AUM (godkendelse), AUM-5 | **Ingen standardadgangskoder.** Bruger `pi`/standardkode fjernet. SSH slået fra eller kun med personlige nøgler, ingen adgangskode-login. WLED-webflade på Gledopto beskyttet med unik kode pr. boks (eller kun på et lukket net mellem Pi og Gledopto). Ingen mulighed for at slå adgangskoder fra | ☐ |
| SUM (sikre opdateringer) | Opdateringer hentes over TLS og er signeret af Selfi, verificeres før installation (står allerede på hjemmesiden: "kun software, vi har signeret"). Raspberry Pi OS-sikkerhedsopdateringer installeres automatisk | ☐ |
| SSM (sikker opbevaring) | Nøgler/tokens til serveren ligger kun på boksen med adgang for kiosk-tjenesten; unikke pr. boks; kan spærres fra serveren | ☐ |
| SCM (sikker kommunikation) | Al trafik til serveren over TLS 1.2+ med certifikatkontrol. Ingen åbne porte udefra (firewall) | ☐ |
| LGM (logning) | Sikkerhedshændelser (login, opdatering, fejl) logges og sendes til fleet-serveren, 90 dage | ☐ |
| DLM (sletning) | Billeder/video slettes fra boksen, når de er uploadet. Fabriksnulstilling sletter alt ved retur | ☐ |
| NMM/RLM (netværk, robusthed) | Ubrugte tjenester (Bluetooth, avahi, cups m.m.) slået fra. Boksen genstarter selv efter netudfald og spammer ikke nettet | ☐ |
| GEC (generelt) | Ingen kendte udnyttelige sårbarheder ved levering (opdatér før levering). Kontakt for sårbarheder: selfi.dk/.well-known/security.txt | ☐ |
| CCK/CRY (kryptografi) | Kun moderne kryptografi (TLS-bibliotekets standard), ingen egne algoritmer | ☐ |
| Privatliv (-2) | Kamera og mikrofon gemmer intet før start. Samtykker gemmes. Slettefrister håndhæves på serveren. Ingen ansigtsgenkendelse | ☐ |

Dokumentér for hvert punkt, hvordan det er opfyldt (fil og linje i selfiebox-platform), før første levering.

## 10. RoHS (EN IEC 63000)

- Alle elektriske dele er købte, færdige komponenter fra leverandører, der erklærer RoHS. Selfi lodder ikke og tilfører ingen stoffer. Kabinettet er ASA (Bambu Labs RoHS-erklæring).
- Dokumentation: leverandørernes erklæringer i `dokumentation/leverandoerer/` (punkt 2). Risiko efter EN IEC 63000: lav for kendte EU-leverandører (Raspberry Pi, Mean Well, Wago), middel for direkte køb fra Kina (Gledopto, strips) → bed om erklæring, og gem den.
- REACH: bed de samme leverandører om en SVHC-erklæring (art. 33).

## 11. Egne test (bilag V, g og h)

Laves på én prøveboks (første v8-boks) og noteres med dato, resultat og billede. Måleudstyr: multimeter, IR-termometer eller termoelement, stopur.

| Nr. | Test | Godkendt når | ✔ |
|---|---|---|---|
| T1 | Polaritet og spændinger: 24 V på hunstik, 5,0–5,2 V ud af RSD-60G-5, før Pi og strips sættes i | Rigtige værdier | ☐ |
| T2 | Fuld last 30 min: hvide strips 100 %, RGB hvid 100 % (med ABL 2000 mA), Pi stresstest (`stress-ng`), skærm max | Sikringen holder, ingen dele over databladets grænse | ☐ |
| T3 | Temperatur efter 4 timer normal brug ved stuetemperatur: front, skærm, top, adapter; `vcgencmd measure_temp` | Ydersider ≤ 43 °C, Pi < 80 °C | ☐ |
| F1 | Kortslutning 5 V-udgang ved Wago W3/W4 (med boksen åben, ingen personer tæt på) | RSD-60G-5 går i hiccup, intet bliver over 300 °C, ingen røg | ☐ |
| F2 | Kortslutning hvid strip ved klikstik | Sikring 3,15 A brænder eller dæmper slår fra, ingen flammer | ☐ |
| F3 | Kortslutning 24 V direkte efter sikringen | Sikringen brænder inden for 5 s | ☐ |
| F4 | Pi-blæser stoppet (stik af), 1 time fuld last | Pi drosler, ingen dele over 300 °C eller deformeret plast | ☐ |
| F5 | Alle ventilationshuller tapet til, 2 timer | Samme som F4 | ☐ |
| F6 | Forkert adapter 36 V (via labforsyning) i 1 min | Intet antændes (strips/dæmper må gerne gå i stykker) | ☐ |
| T5 | Vægbeslag: 50 N nedad og 50 N udad i 1 min, gips + dybel og træ | Ingen løsning | ☐ |
| T6 | (Valgfri) Sprøjtetest, se 6.5 | Intet vand ved elektronikken | ☐ |
| E1–E4 | EMC-kontroller, se punkt 7 | | ☐ |

## 12. Produktion og sporbarhed (modul A, punkt 3; GPSR art. 9)

- Serienummer: **SB2-ÅÅÅÅ-NNNN** (fx SB2-2026-0001), på typeskiltet og i boksens software (samme som fleet-id). Registreres i `halo-gen2-v8_produktionslog.xlsx` med dato, softwareversion, tilvalg, kunde og placering.
- Sluttest på hver boks (fanen "Sluttest" i loggen): T1, visuel kontrol af ledninger og sikring 3,15 A, funktionstest af kamera/lys/touch/upload, opdatering til nyeste software, typeskilt sat på, brugsanvisning og skilt i kassen.
- Ændringer i komponenter (anden strip, anden RGB-styring osv.) må kun ske efter vurdering i denne fil.
- Klager, ulykker og nærved-hændelser registreres i loggens fane "Hændelser". Ulykker med en boks indberettes via EU's Safety Business Gateway (GPSR art. 20). Sårbarheder: se `selfi-gdpr-v1_fortegnelse-dpia-og-haendelser.md`.

## 13. Mærkning

- Typeskilt `halo-gen2-v8_typeskilt.pdf` (40 × 70 mm, polyester/vinyl, permanent lim, eller lamineret tape fra en labelprinter) bag på boksen, til højre for vægbeslaget (45 mm fri bredde). CE ≥ 5 mm høj. Affaldsspand med streg under.
- Serienummeret skrives i feltet eller printes på en separat label i feltet.
- Når næste version tegnes: overvej at printe CE, spand og tekst ind i bagvæggen (fordybet 0,6 mm) og kun have serienummeret som label.
- Emballage/kasse: indlæg med 5 GHz-begrænsning, fabrikant og brugsanvisning følger med.
