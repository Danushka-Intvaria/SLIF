# Sector and Project Data Management

This site uses centralized data and templates to avoid duplicating sector or project markup.

## Pages
- `/sectors/index.html` lists all sectors.
- `/sectors/sector.html?sector=<sector-id>` renders one sector and its projects.
- `/sectors/<sector-id>.html` redirects to the sector detail page.
- `/project.html?id=<project-id>` renders one project.

## Templates
- `templates/sector-template.html`
- `templates/project-template.html`

## Data sources
- `data/sectors.json` contains sector metadata.
- `data/projects.json` contains project details grouped by sector.
- `data/speakers.json` contains all homepage speaker sessions and speaker cards.

## Add a new sector
1. Add a new key inside `data/sectors.json` (example: `fisheries`).
2. Add the sector's projects inside `data/projects.json` under the same key.
3. Add a redirect page at `sectors/fisheries.html` (copy an existing redirect) or link directly to `/sectors/sector.html?sector=fisheries`.

## Add or update projects
1. Open the sector entry in `data/projects.json`.
2. Add/edit/remove items inside that sector array.
3. Ensure each project has a unique `id` across all sectors.

## Add or update speakers
1. Open `data/speakers.json`.
2. Update `title` / `subtitle` for the section heading if needed.
3. Add/edit/remove sessions under `sessions`.
4. Add/edit/remove speaker entries under each session's `speakers` array.
