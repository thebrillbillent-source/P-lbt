# Project Budget Planner

A single-page React budgeting tool (projects, cost entries, income, team/persona rates), with data persisted to `localStorage` in the browser.

## Deploy to GitHub Pages in under 5 minutes

1. **Create a new GitHub repo** (e.g. `ppe-app`) and push this folder to it:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/ppe-app.git
   git push -u origin main
   ```

2. **Set the base path.** Open `vite.config.js` and make sure `base` matches your repo name:
   ```js
   base: "/ppe-app/",   // change "ppe-app" to your actual repo name
   ```
   If this will live at `<your-username>.github.io` (a user/org root site, not a project repo), set `base: "/"` instead.

3. **Enable Pages via Actions.** In your repo: **Settings → Pages → Source → GitHub Actions**. That's it — no branch to pick.

4. **Push.** The included workflow (`.github/workflows/deploy.yml`) builds and deploys automatically on every push to `main`. Check the **Actions** tab for progress; the live URL appears there and under **Settings → Pages** once it finishes (usually 1–2 minutes).

Your app will be live at:
```
https://<your-username>.github.io/ppe-app/
```

## Local development

```bash
npm install
npm run dev
```

## Notes

- Data is stored per-browser via `localStorage` — there's no backend/database, so budgets don't sync across devices.
- The app is a single component in `src/App.jsx`; everything else in this scaffold is standard Vite/React boilerplate needed to build and serve it.
