# Selfiebox Halo – referencepakke til AI-billeder

Renderinger af boksen fra CAD-modellen med gennemsigtig baggrund (PNG med alfa). Brug dem som produktreference, når I laver stemningsbilleder i AI-værktøjer.

## Filer

| Fil | Indhold |
|---|---|
| `ref_std_*.png` | Standardboks i sort med fotomodul (Instax) – varmhvidt lys |
| `ref_unit_*.png` | Kun boksen, uden fotomodul |
| `ref_sommernat_*.png` | Festival-tema Sommernat: vinger, topper, lilla glød, tema på skærmen |
| `ref_neon_*.png` | Klub-tema Neon: fluorescerende striber, lyserød glød |
| `*_front`, `*_left`, `*_right`, `*_side` | Forfra, skråt fra venstre, skråt fra højre, profil |
| `../renders/room_maal.jpg` | Boksen på en væg ved siden af en person på 175 cm (størrelsesforhold) |

## Fakta, AI'en skal ramme

- Bredde 23,4 cm. Højde 30,6 cm for boksen og 50 cm med fotomodul. Dybde 6,6 cm (8 cm med vægbeslag).
- Hænger på væggen med kameraet i øjenhøjde (ca. 160 cm over gulv). Fotomodulets vindue sidder ca. 115 cm over gulv.
- Alt er mat sort. Det eneste lys er den frostede ring om skærmen og en tynd lysstribe rundt om siderne.
- Skærmen står på højkant (10"). Kameraet sidder i et lille hak midt i toppen af lysringen.
- Fotos er kvadratiske instant-fotos (Instax Square, 62 × 62 mm billede) og kommer frem i vinduet forneden.

## Fast produktbeskrivelse (indsæt i alle prompts)

> a sleek matte-black wall-mounted selfie photo booth, a portrait 10-inch touchscreen framed by a glowing frosted white rounded-rectangle light ring, a tiny camera lens in a notch at the top centre of the ring, a thin glowing stripe around the sides, below it a matching matte-black photo printer module with a small window at the bottom where square instant photos appear, about 23 cm wide and 50 cm tall, only 7 cm deep, mounted at eye level, minimalist premium product design

## Prompts pr. setting

**Natklub**
> [produktbeskrivelse] on a dark concrete wall in a busy nightclub, purple and blue stage lights, light haze, a group of friends in their twenties laughing and posing in front of the booth, the ring light softly lighting their faces, shallow depth of field, editorial nightlife photography, 35mm

**Bryllup**
> [produktbeskrivelse] on a white panelled wall at an elegant Scandinavian wedding reception, warm candlelight, eucalyptus and white flowers, guests in suits and dresses, a bride holding a square instant photo, a guestbook table below with instant photos pinned on a string, soft golden hour light, documentary wedding photography

**Brunt værtshus (bodega)**
> [produktbeskrivelse] on dark wood panelling in a traditional Danish brown pub, dim warm lamps with fabric shades, beer taps and old framed posters, a dart board nearby, two locals in their sixties and a young couple taking a photo together, cosy and a little smoky atmosphere, authentic, 35mm film look

**Festival (brug Sommernat-filerne)**
> [produktbeskrivelse] with colourful hill-shaped side panels and a cloud-shaped top sign reading "SOMMERNAT", mounted on the wooden wall of a festival bar tent at dusk, string lights, summer evening, happy festival guests with glitter and wristbands, warm natural light, lifestyle photography

**Klub med UV (brug Neon-filerne)**
> [produktbeskrivelse] with fluorescent pink, cyan and lime zig-zag side panels glowing under UV black light, in a dark techno club, laser beams, people dancing in the background, a couple taking a selfie, high contrast, neon atmosphere

**Firmafest / julefrokost**
> [produktbeskrivelse] on a wall at a Danish office Christmas party, fairy lights, a Christmas tree in the background, colleagues in festive sweaters laughing, holding square instant photos, warm cosy light, candid photography

**Cocktailbar**
> [produktbeskrivelse] on a dark green wall next to a marble bar with brass details, moody cocktail bar lighting, a bartender in the background, two women posing with cocktails, luxurious and intimate, editorial interior photography

**Studenterfest**
> [produktbeskrivelse] on a school gym wall decorated for a Danish graduation party, students in white graduation caps, confetti, colourful party lights, energetic and joyful, flash photography

**Messe / konference**
> [produktbeskrivelse] on the back wall of a clean exhibition stand at a trade fair, bright even lighting, branded wall graphics, visitors in business casual taking a photo, professional event photography

## Sådan får I det bedste resultat

1. **Billedreference:** Giv AI-værktøjet en eller to af PNG'erne som billedreference sammen med prompten. Det gælder fx Midjourney (omni-reference), Gemini/Nano Banana, GPT-image, Flux Kontext og Firefly. Vælg den vinkel, der passer til scenen.
2. **Mest præcist:** Lav først rummet med en tom væg i øjenhøjde. Sæt derefter PNG'en ind i fx Photoshop, og brug AI til "harmonize", "relight" eller generative fill på kanterne. Så bevarer boksen sin præcise form.
3. **Tjek størrelsen:** Boksen er lille (23 cm bred). Hvis AI'en laver den for stor, skriv "small, about the size of a tablet" og brug `room_maal.jpg` som ekstra reference.
4. **Hold det sort:** Skriv "no logos, no colours on the casing except the light ring" for standardboksen. Temaerne har deres farver på vingerne og topperen.
5. **Skærmen:** AI'en finder ofte på tekst. Skriv "screen shows a simple black start screen" eller ret skærmen bagefter.
