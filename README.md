# CallingKaro website

Landing page for **CallingKaro**, an internet calling app for India. It is built with React (JavaScript), Vite, framer-motion and three.js. One 3D phone travels through the page as you scroll, and the **Download APK** button serves the app straight from this site.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/ (pre-rendered HTML for SEO)
npm run preview    # serve dist/ on http://localhost:4173
```

## Update the APK (no Play Store needed)

The app is served from `public/downloads/CallingKaro.apk`. To ship a new version:

1. Replace `public/downloads/CallingKaro.apk` with the new build. Keep the same file name.
2. Update `apkVersion` / `apkSize` in `src/content.js` if they changed.
3. Commit and push. Vercel redeploys, and the download button serves the new file.

GitHub refuses files over 100 MB, so keep the APK under that. A single-ABI (arm64) release build is about 65 MB.

## Deploy on Vercel

1. Import this repository in Vercel. The framework is detected as **Vite**, and `vercel.json` already sets:
   - build command: `npm run build`
   - output directory: `dist`
   - APK download headers
2. Optional: under Project > Settings > Environment Variables, set `VITE_SITE_URL` to your real domain, for example `https://callingkaro-website.vercel.app`. The default is in `.env`. This value is used in the SEO tags, the sitemap and `llms.txt`.
3. Deploy.

The only environment variables are public ones (`VITE_SITE_URL`, `VITE_APK_URL`). No API keys or other secrets belong in this repository.

## SEO

- The full page text is pre-rendered into `index.html` at build time (`scripts/prerender.mjs`), so search engines and AI crawlers read it without JavaScript.
- Structured data in JSON-LD:
  - `MobileApplication`, `Organization` and `WebSite` in `index.html`;
  - `FAQPage`, rendered with the FAQ section.
- `public/robots.txt` allows search and AI crawlers. Also included: `sitemap.xml`, `llms.txt` (a summary for AI search), a web manifest and an Open Graph image.
- Indian keywords and hreflang `en-IN` / `hi-IN` are set in `index.html`.

## Where things are

| Path | What |
|---|---|
| `src/content.js` | All page text, FAQ and story chapters (edit copy here) |
| `src/three/StoryScene.jsx` | The scroll-driven 3D phone and the 3D objects |
| `src/three/screens.js`, `screenArt.js` | The app screens drawn on the phone |
| `src/components/` | Header, hero, story chapters, FAQ, footer |
| `src/styles.css` | Design tokens, glass UI, layout |
