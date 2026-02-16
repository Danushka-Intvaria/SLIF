# Sector and Project Data Management

This site now supports a **single reusable sector page** and a **single reusable project page**.

## Pages
- `sector.html?id=<sector-id>` renders one sector and all related projects.
- `project.html?sector=<sector-id>&project=<project-id>` renders one project.

## Where to update content
Update only this file:
- `assets/js/sector-projects-data.js`

## Data format
Each sector has:
- `id`
- `name`
- `summary`
- `heroImage`
- `stats[]`
- `projects[]`

Each project has:
- `id`
- `name`
- `location`
- `investment`
- `stage`
- `description`

## How to add a new sector
1. Add a new object inside `sectors` in `assets/js/sector-projects-data.js`.
2. Use a unique `id` (example: `fisheries`).
3. Add a link from any page using: `sector.html?id=fisheries`.

## How to add/update projects
1. Open the relevant sector object.
2. Add/edit/remove items inside `projects`.
3. Ensure each project has a unique `id` within that sector.

This approach makes it easy to maintain 20+ projects without creating 20 separate HTML page structures.
