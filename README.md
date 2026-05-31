# Wellness OS — Daily Planner

Your personal wellness planner with daily agenda, shopping lists, and supplement reorder tracker.

## Deploy to Vercel (5 minutes)

### Option A: Drag & Drop (easiest)
1. Go to [vercel.com](https://vercel.com) and sign up / log in (free)
2. Click **"Add New Project"**
3. Click **"Upload"** and drag the entire `wellness-app` folder onto the page
4. Click **Deploy** — Vercel builds it automatically
5. You get a URL like `wellness-planner-abc123.vercel.app`

### Option B: GitHub (recommended for updates)
1. Create a free account at [github.com](https://github.com)
2. Create a new repository called `wellness-planner`
3. Upload all files in this folder to the repo
4. Go to [vercel.com](https://vercel.com), click **"Add New Project"**, connect GitHub
5. Select your repo — Vercel auto-detects everything and deploys

## Add to iPhone Home Screen
1. Open the Vercel URL in **Safari** (must be Safari, not Chrome)
2. Tap the **Share button** (box with arrow at bottom of screen)
3. Scroll down and tap **"Add to Home Screen"**
4. Tap **"Add"**
5. The app icon appears on your home screen and opens full-screen like a native app

## Update the App
- To change anything, edit `src/App.jsx` and re-deploy to Vercel
- Vercel re-builds in ~60 seconds and the URL stays the same

## Add Your Peptide Provider URL
In `src/App.jsx`, search for `"Sermorelin"` in the `REORDER` array and replace `url: "#"` with your provider's portal URL.
