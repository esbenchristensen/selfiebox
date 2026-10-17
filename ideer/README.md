# Idéer, skitser og tegninger

Alt, der endnu ikke er bygget, bor her. Det færdige bor i `web/` (hjemmeside og film) og `hardware/` (boksen).

| Mappe | Hvad |
|---|---|
| `skitser/` | Tegninger, fotos af papirskitser, eksport fra Figma. Navngiv med dato først: `2026-10-17-vaegbeslag.jpg` |
| `noter/` | Én kort Markdown-fil pr. idé: hvad, hvorfor, status |
| `marked/` | Markedsliste over danske steder og scriptet, der laver den |

## Reglen

- Er en idé bygget, flytter den ind i `web/` eller `hardware/`, og skitsen slettes her.
- Er en idé droppet, slettes den. Git husker den, hvis den skal frem igen.
- Ingen arkivmapper. Gamle designs ligger i git-historikken, og på grenen `arkiv-okt-2026`, der viser repoet, som det var før oprydningen:
  `git checkout origin/arkiv-okt-2026 -- hardware/docs/themes-page`
