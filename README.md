# Aslam Local Visibility — site (bbrfeed.online)

Static HTML/CSS/JS. No build step, no dependencies. Deploy the folder to Netlify as-is.

## Placeholders to replace (search for these)

| What | Where | Replace with |
|---|---|---|
| Cloudinary cloud name | every `res.cloudinary.com/demo/` URL | `res.cloudinary.com/YOUR_CLOUD_NAME/` |
| Headshot | `samples/people/smiling-man` (home + about, plus schema) | your uploaded headshot's public ID |
| Spec case study images | `/work/` (`cld-sample` to `cld-sample-5`) | your Google Profile mockup screenshots |
| Video posters | home page, `#videos` | one thumbnail per video |
| Video IDs | `data-yt="YOUTUBE_ID_1"` (and `_2`, `_3`) on the home page | your YouTube video IDs (the part after `v=`) |
| Brand name / person name | "Aslam Local Visibility", "Aslam" | your final names (also in schema + llms.txt) |
| OG share image | `<meta property="og:image">` | a 1200x630 Cloudinary image |

Cloudinary's public `demo` cloud is used so the pages look complete now. If an image
fails to load, the page shows a labelled placeholder box instead of a broken icon.

## Videos
- Click-to-play: the YouTube player only loads after a click (faster page).
- Vertical Reels? In `styles.css` change `--video-ratio` from `16 / 9` to `9 / 16`.
- When your videos are live, add `VideoObject` schema (name, description, thumbnailUrl,
  uploadDate, embedUrl) to the home page. It was left out on purpose: schema with fake
  video data is invalid.

## Contact form (Static Forms)
Submissions go to https://api.staticforms.dev/submit with your API key, and Static Forms emails them to you.
- The form is sent by `script.js` with `fetch`, so visitors see "Sending...", a success message, or a clear error.
  If JavaScript is off, the form still works as a normal POST and redirects back to `/contact/?sent=true`.
- The honeypot field (`name="honeypot"`) catches most spam bots.
- Your API key is visible in the page source. That is normal for this service, but turn on
  **Domain Restriction** in your Static Forms dashboard (allow `bbrfeed.online`) so nobody else can use it.
- Free plan limits: 500 submissions/month, 10/minute. Check the dashboard if messages stop arriving.
- To change the key, edit it on `contact/index.html` (hidden `apiKey` input).
- Add your email address to the contact page if you want one shown.

## Hosting notes
- `_redirects` and `_headers` are Netlify files. On Vercel they are ignored; ask for a `vercel.json`.
- HTTPS: turn on the free certificate in Netlify (Domain settings > HTTPS) and use
  "Force HTTPS". `_redirects` is the backup.
- `_headers` includes a strict Content-Security-Policy. If you add a new service
  (analytics, chat widget, another video host), add its domain there or it will be blocked.
- Pages use root-relative paths (`/styles.css`), so open the site through a server, not by
  double-clicking `index.html`: `python3 -m http.server` in this folder, then visit localhost:8000.

## After the first Founding Clients
- Add real testimonials, then add `Review`/`AggregateRating` schema.
- Split `/work/` into separate Portfolio and Proof pages if you have enough content.
- Update `lastmod` dates in `sitemap.xml` when you change pages.

## SEO checklist status
sitemap.xml, robots.txt, llms.txt, canonical tags, unique titles + descriptions, one H1 per
page, ordered headings, alt text on every image, JSON-LD (WebSite, ProfessionalService, Person,
FAQPage, Service/OfferCatalog, Breadcrumb, AboutPage, ContactPage), internal links, Cloudinary
images (f_auto,q_auto, lazy-loaded, fixed dimensions), self-hosted fonts, no render-blocking
scripts, HTTPS redirects, indexable (`index, follow`; only 404.html is noindex).
