# DeTLeng Ops — ops.detleng.com

Public website for **DeTLeng Ops** — AI Operations & Automation Systems. A static,
dependency-free site (semantic HTML, plain CSS, vanilla JS) designed to be hosted on
GitHub Pages at `ops.detleng.com`.

This first version ships the complete brand, design system, homepage, architecture
visualization and a data-driven project portfolio shell. Individual automation
projects are added later — see "Adding a project" below.

## Structure

```
/
  index.html                 full homepage
  assets/
    css/
      styles.css             design system + layout
    js/
      main.js                architecture interactivity, project grid, modal, nav
      projects.js             project data (edit this to add/update projects)
    images/                  (empty — add screenshots/OG image here)
  README.md
  CNAME                       ops.detleng.com
```

## Adding a project later

Open `assets/js/projects.js` and add one object to the `PROJECTS` array:

```js
{
  id: "my-new-project",
  title: "My New Project",
  summary: "One sentence describing it.",
  flow: ["Step 1", "Step 2", "Step 3"],
  status: "planned", // planned | in-development | architecture-ready | live
  tags: ["n8n", "PostgreSQL"],
  pageUrl: null,       // set once a dedicated project page exists
  githubUrl: null,
  demoUrl: null,
  detail: "A longer paragraph shown in the detail panel."
}
```

Nothing else needs to change — the grid and the detail modal render from this file.
Once a project has a real page, set `pageUrl` (and the site can be extended to link
to it directly instead of opening the modal).

## Local preview

No build step is required. From the project root:

```bash
# Python 3
python -m http.server 8080

# or Node
npx serve .
```

Then open `http://localhost:8080`.

## Deploying

This repo is already wired to GitHub Pages (see the existing `CNAME` file, which
should keep pointing at `ops.detleng.com`). To publish changes:

```bash
git add .
git commit -m "Update site"
git push origin main
```

GitHub Pages will redeploy automatically from the `main` branch.

## Notes

- No backend, no build tooling, no external JS frameworks — kept intentionally simple
  so it is easy to host and easy to extend.
- Status labels (`Planned`, `In development`, `Architecture ready`, `Live`) are used
  honestly — nothing is presented as live before it is.
- This is an independent engineering project and is not affiliated with n8n GmbH.
