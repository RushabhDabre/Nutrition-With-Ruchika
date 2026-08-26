# Nutrition with Ruchika — React + MUI Version

Same site, same design, same content as the approved version — built with
**Material-UI (MUI)** components this time instead of plain CSS.

## Run it locally

```bash
npm install
npm start
```

Opens at `http://localhost:3000`.

## Build for deployment

```bash
npm run build
```

Uploads the `build/` folder to Vercel, Netlify, or any static host.

## ⚡ The only file you need to edit for content

**`src/data/siteData.js`** — same as before. Your WhatsApp number, Instagram,
email, pricing, services, testimonials, FAQ, and about text all live here.
Change it there and it updates everywhere on the site automatically.

### To add your real photo
```js
export const hero = {
  ...
  photo: null, // set to an image path/URL
```
Change `null` to your image path (place the file in `public/` and reference it
as `/yourphoto.jpg`), or a hosted image URL. Same for `about.photo`.

### To update WhatsApp / Instagram / email
```js
export const contact = {
  whatsappNumber: '919876543210', // ← replace with your real number
  instagramHandle: '@nutritionwithruchika',
  instagramUrl: 'https://instagram.com/nutritionwithruchika',
  email: 'ruchika@nutritionwithruchika.com',
  officeHours: 'Mon–Sat: 10 AM – 6 PM IST',
};
```

## What's different from the plain-CSS version

- Built entirely with **MUI components**: `AppBar`, `Card`, `Accordion`,
  `TextField`, `Fab`, `Chip`, `Button`, `Paper`, etc. — instead of raw HTML +
  custom CSS classes.
- A central `src/theme.js` defines the color palette and typography as an MUI
  theme, applied globally via `ThemeProvider`. Change colors there once and
  they update across every component.
- Styling is done with MUI's `sx` prop (inline, theme-aware) rather than a
  separate CSS file — there's no `index.css` in this version.
- The header's mobile menu is a proper MUI `Drawer` (slide-out panel) instead
  of a CSS media-query toggle.
- The FAQ section uses MUI's `Accordion` component instead of a custom
  hand-rolled expand/collapse.
- The contact form uses MUI `TextField` / `Select` / `Alert` components with
  built-in validation styling.

Visually, it looks the same as the version you approved — same colors,
layout, spacing, and content structure — just built on top of MUI so it's
easier to extend with more MUI components later (dialogs, snackbars, tabs,
date pickers, etc. all become one import away).

## Project structure

```
src/
  theme.js                MUI theme: colors, typography, component overrides
  data/siteData.js         EDIT THIS for all content changes
  components/
    Header.js               AppBar + mobile Drawer menu
    Hero.js                  Homepage hero section
    SectionTitle.js          Shared eyebrow+title+subtitle header (reused everywhere)
    KeyServices.js            Key services strip + "Why choose me" cards
    Testimonials.js            Testimonials grid
    About.js                   About Me section
    Services.js                8 service cards
    Programs.js                Pricing tiers
    Contact.js                  Contact cards + consultation form (MUI TextFields)
    FAQ.js                       Accordion-based FAQ
    FooterSection.js             Final CTA + Footer + floating WhatsApp Fab
  App.js                    Assembles all sections
  index.js                  Wraps app in MUI ThemeProvider + CssBaseline
```

## Connecting the contact form to actually send you leads

Right now, submitting the form shows a success alert and logs to the browser
console — it doesn't send you anything yet. In `src/components/Contact.js`,
replace the `// TODO: connect to your email service` line with:

- **[EmailJS](https://www.emailjs.com/)** — free tier, no backend needed, easiest
- **[Formspree](https://formspree.io/)** — free tier, no backend needed
- Your own backend API endpoint

## Deploying (free)

**Vercel** (recommended): push to GitHub → vercel.com → New Project → import repo → deploy (auto-detected as Create React App).

**Netlify**: `npm run build` → drag the `build/` folder onto netlify.com's deploy page.

## Still placeholder / needs your real info

- [ ] WhatsApp number
- [ ] Instagram handle
- [ ] Email address
- [ ] Your real photo (hero + about section)
- [ ] Real testimonials (3 placeholders currently)
- [ ] Confirm pricing figures
- [ ] Confirm education/certification wording
- [ ] Privacy Policy / Disclaimer / Terms pages (linked but not yet written)
- [ ] Contact form → email service connection
