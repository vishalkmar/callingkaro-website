// Build step: writes the policy pages as plain static HTML (no JavaScript needed, so Razorpay's reviewers,
// Google and AI crawlers all read them): /terms, /privacy, /refund-policy, /contact.
// vercel.json has cleanUrls, so dist/terms.html is served at /terms.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadEnv } from 'vite';
import { BUSINESS, TERMS_OF_USE, PRIVACY_POLICY, REFUND_POLICY } from '../src/legal.js';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dist = path.join(root, 'dist');
const env = loadEnv('production', root, 'VITE_');
const siteUrl = (env.VITE_SITE_URL || 'https://callingkaro.in').replace(/\/$/, '');

const esc = s =>
  String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export const PAGES = [
  { slug: 'terms', label: 'Terms and Conditions', doc: TERMS_OF_USE },
  { slug: 'privacy', label: 'Privacy Policy', doc: PRIVACY_POLICY },
  { slug: 'refund-policy', label: 'Refund and Cancellation', doc: REFUND_POLICY },
  { slug: 'contact', label: 'Contact Us' },
];

const tel = BUSINESS.phone.replace(/\s/g, '');

const contactBody = () => `
<p class="lead">We are happy to help with calls, credits, payments and refunds.</p>
<div class="cards">
  <div class="card"><span class="k">Business</span><b>${esc(BUSINESS.brand)}</b><span>Operated by ${esc(BUSINESS.owner)} - ${esc(BUSINESS.type)}</span></div>
  <div class="card"><span class="k">Address</span><b>${esc(BUSINESS.address)}</b></div>
  <div class="card"><span class="k">Email</span><a href="mailto:${esc(BUSINESS.email)}"><b>${esc(BUSINESS.email)}</b></a></div>
  <div class="card"><span class="k">Phone</span><a href="tel:${esc(tel)}"><b>${esc(BUSINESS.phone)}</b></a></div>
  <div class="card wide"><span class="k">Support hours</span><b>${esc(BUSINESS.hours)}</b><span>We reply within 2 working days. For payment or refund questions, include your registered email and the order ID shown in the app under Wallet.</span></div>
</div>`;

const docBody = doc => `
<p class="u">${esc(doc.updated)}</p>
${doc.sections.map(s => `<h2>${esc(s.heading)}</h2>\n<p>${esc(s.body)}</p>`).join('\n')}`;

const page = p => {
  const title = p.doc ? p.doc.title : 'Contact Us';
  const url = `${siteUrl}/${p.slug}`;
  const description = p.doc
    ? `${title} of ${BUSINESS.brand}, the internet calling app for India.`
    : `Contact ${BUSINESS.brand}: ${BUSINESS.email}, ${BUSINESS.phone}, ${BUSINESS.address}.`;
  return `<!doctype html>
<html lang="en-IN">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(title)} | ${esc(BUSINESS.brand)}</title>
<meta name="description" content="${esc(description)}" />
<link rel="canonical" href="${url}" />
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<meta name="theme-color" content="#FF7A45" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700..800&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap" rel="stylesheet" />
<style>
:root{--orange:#FF7A45;--deep:#C94A17;--ink:#1B1F27;--muted:#5B6170;--line:#F1E3DA;--bg:#FFF8F4}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.7 'Plus Jakarta Sans',system-ui,sans-serif}
a{color:var(--deep)}
.top{position:sticky;top:0;z-index:5;background:rgba(255,248,244,.92);border-bottom:1px solid var(--line)}
.bar{max-width:880px;margin:0 auto;padding:12px 16px;display:flex;align-items:center;justify-content:space-between;gap:12px}
.brand{display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--ink);font:800 21px 'Bricolage Grotesque',sans-serif}
.brand img{width:34px;height:34px}.brand span{color:var(--orange)}
.home{font-weight:700;font-size:14px;text-decoration:none;padding:9px 16px;border-radius:999px;background:var(--orange);color:#fff;white-space:nowrap}
main{max-width:880px;margin:0 auto;padding:36px 16px 40px}
.tabs{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:26px}
.tabs a{font-size:13.5px;font-weight:700;text-decoration:none;color:var(--muted);padding:7px 14px;border-radius:999px;border:1px solid var(--line);background:#fff}
.tabs a[aria-current]{background:var(--ink);border-color:var(--ink);color:#fff}
h1{font:800 clamp(30px,6vw,44px)/1.1 'Bricolage Grotesque',sans-serif;margin:0 0 6px;letter-spacing:-.02em}
h2{font-size:18px;margin:28px 0 4px}
p{margin:0 0 10px;color:#353a46}
.u{color:var(--muted);font-size:14px}
.lead{font-size:18px;color:var(--muted)}
.paper{background:#fff;border:1px solid var(--line);border-radius:24px;padding:28px clamp(18px,4vw,40px);box-shadow:0 20px 40px -32px rgba(56,31,18,.35)}
.cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:20px}
.card{background:var(--bg);border:1px solid var(--line);border-radius:18px;padding:16px 18px;display:flex;flex-direction:column;gap:2px}
.card.wide{grid-column:1/-1}
.card .k{font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--deep)}
.card b{font-size:16.5px;word-break:break-word}.card span{color:var(--muted);font-size:14.5px}.card a{text-decoration:none;color:var(--ink)}
footer{max-width:880px;margin:0 auto;padding:10px 16px 40px;color:var(--muted);font-size:13.5px}
footer nav{display:flex;flex-wrap:wrap;gap:6px 16px;margin-bottom:8px}footer a{color:var(--muted);font-weight:600}
@media (max-width:600px){.cards{grid-template-columns:1fr}.paper{border-radius:18px}}
</style>
</head>
<body>
<header class="top"><div class="bar">
<a class="brand" href="/"><img src="/favicon.svg" alt="" width="34" height="34" /><b>Calling<span>Karo</span></b></a>
<a class="home" href="/">Download app</a>
</div></header>
<main>
<nav class="tabs" aria-label="Policies">
${PAGES.map(x => `<a href="/${x.slug}"${x.slug === p.slug ? ' aria-current="page"' : ''}>${esc(x.label)}</a>`).join('\n')}
</nav>
<article class="paper">
<h1>${esc(title)}</h1>
${p.doc ? docBody(p.doc) : contactBody()}
</article>
</main>
<footer>
<nav aria-label="Footer">${PAGES.map(x => `<a href="/${x.slug}">${esc(x.label)}</a>`).join('')}<a href="/">Home</a></nav>
<div>© ${new Date().getFullYear()} ${esc(BUSINESS.brand)} · ${esc(BUSINESS.owner)} (${esc(BUSINESS.type)}) · ${esc(BUSINESS.address)} · ${esc(BUSINESS.email)} · ${esc(BUSINESS.phone)}</div>
</footer>
</body>
</html>
`;
};

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  for (const p of PAGES) {
    fs.writeFileSync(path.join(dist, `${p.slug}.html`), page(p));
  }
  console.log(`[legal-pages] wrote ${PAGES.map(p => `/${p.slug}`).join(', ')}`);
}
