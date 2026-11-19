# Smile Precision Dental Clinic website

Five-page static site for Smile Precision Dental Clinic, City of San Fernando, Pampanga. It uses the same stack as Dental Heights:
[Astro](https://astro.build), no JavaScript framework, self-hosted fonts. Design direction: "Frosted Stats" (frosted
glass nav, proof bar, cards and panels on pale aqua).

## Structure

```
images/               ORIGINAL Facebook screenshots (do not edit)
images/optimized/     cropped, cleaned masters the site imports (Astro makes responsive WebP from these at build)
src/
  components/sections Header, Footer, Hero, Results, VeneerSpotlight, CareRow, Doctor, Reviews, Booking
  components/ui       Icon, Placeholder, CaseCard, CompareSlider, PageHeader, AppointmentForm, ChatWidget
  content/blog/       one Markdown file per blog post (file name = URL)
  data/
    site.ts           every clinic detail: name, address, phone, email, links, hours, hero stats
    services.json     services and categories ("confirmed": false = confirm with the clinic)
    cases.ts          the before/after cases
    testimonials.json review slots (currently placeholders)
    chatbot.ts        chat assistant knowledge and replies
  layouts/BaseLayout  <head>, SEO tags, schema.org Dentist, header/footer/chat on every page
  pages/              index, about, services, blog/, blog/[slug], contact
  styles/             tokens.css (colours, type, spacing) and global.css (glass, buttons, motion)
public/               favicon, apple-touch-icon, og-image.jpg, robots.txt
```

## Before launch

Search the project for `REPLACE` and `PLACEHOLDER`:

| What | Where |
|---|---|
| Live domain | `url` in `src/data/site.ts` |
| Facebook / Messenger / Instagram links | `facebookUrl`, `messengerUrl`, `instagramUrl` in `site.ts` |
| Opening hours | `hours` in `site.ts`, then set `hoursConfirmed: true` (the chatbot then quotes them) |
| Real patient reviews | `src/data/testimonials.json`, then set `placeholder: false` |
| Dentist portrait, reception, team photos, blog covers | every `<Placeholder` in `src/` |
| Unconfirmed services | entries with `"confirmed": false` in `services.json` |
| Blog articles | `src/content/blog/*.md` have `placeholder: true`; have the dentist review them |

## Adding a photo

Put a cropped copy in `images/optimized/` (keep originals in `images/`), import it where it's shown, and
give it a descriptive `alt`. Astro resizes and compresses it at build time.

## Run locally

Needs Node.js 22.12+.

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # static site in dist/
npm run preview   # serve dist/
```

Deploy `dist/` to any static host (Netlify, Vercel, Cloudflare Pages), then set `url` in `site.ts` and rebuild.
