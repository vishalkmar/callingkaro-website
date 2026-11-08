// Copies the latest built APK into public/downloads so the "Download APK" button works locally.
// In the CallKaro monorepo it copies ../apk/CallKaro-arm64.apk; elsewhere (Vercel) it keeps the committed file.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const src = path.join(root, '..', 'apk', 'CallKaro-arm64.apk');
const dest = path.join(root, 'public', 'downloads', 'CallKaro.apk');

if (!fs.existsSync(src)) {
  // Normal on Vercel / in the website repo: the committed public/downloads/CallKaro.apk is served as is.
  console.log(
    fs.existsSync(dest)
      ? '[copy-apk] using public/downloads/CallKaro.apk'
      : '[copy-apk] WARNING: public/downloads/CallKaro.apk is missing - the Download APK button will 404.',
  );
} else {
  const s = fs.statSync(src);
  const d = fs.existsSync(dest) ? fs.statSync(dest) : null;
  if (!d || d.size !== s.size || d.mtimeMs < s.mtimeMs) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
    console.log(`[copy-apk] copied ${(s.size / 1048576).toFixed(1)} MB -> public/downloads/CallKaro.apk`);
  } else {
    console.log('[copy-apk] APK is up to date');
  }
}
