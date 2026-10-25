# Frances Calulo — Portfolio (React front end)

My portfolio, **Self Portrait, in Code**: a designer who codes, introduced in code first and then decoded into plain English.

- **Live site:** https://francescalulo.com
- **Platform:** Headless CMS — WordPress with React output (Vite + Sass)
- **Content:** WordPress at `francescalulo.com/fc-cms-1212`, read through the WP REST API
- **WordPress plugin (custom post types, taxonomies, REST field):** [frances-portfolio-plugin](https://github.com/francescalulo/frances-portfolio-plugin)

## Tech stack

- React 19, React Router 7, Vite 6
- Sass (design tokens, mixins, light/dark themes with CSS custom properties)
- DOMPurify (sanitises the HTML that comes from WordPress), normalize.css
- ESLint 9 (flat config) and Prettier
- WordPress: Frances Portfolio (custom plugin), ACF Pro, Yoast SEO, ACF Content Analysis for Yoast SEO, Wordfence, LiteSpeed Cache

No animation library: every effect (scramble, decode, glitch, typing, preloader) is built with CSS and plain React.

## Pages

| Route         | Page                                                                                     | Content from WordPress                                                         |
| ------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `/`           | TheLounge (Home): hero, featured work, about snippet, career chapters, contact           | Work posts, Experience posts, Site Settings                                    |
| `/work`       | TheBuild (Work archive), filterable by category                                          | Work posts + Category terms                                                    |
| `/work/:slug` | Work Detail: overview, challenge, approach, live preview, mockups, key takeaway, Next Up | One Work post (ACF fields, Yoast title/description, `next_project` REST field) |
| `/about`      | TheHuman (About): portrait, bio, core competencies, FAQs                                 | About page (ACF fields, featured image)                                        |
| `*`           | 404                                                                                      | —                                                                              |

Contact isn't a page: Home, Work, Work Detail and About end with the same Contact section, and the nav's `<Contact/>` link jumps to it.

## Features

- **Coded / decoded copy:** large headings type or shuffle in as code, then decode into plain English on hover, scroll, tap or the Decode switch
- **Light and dark mode:** dark by default; the header toggle (in the mobile menu on phones) is remembered and applied before the page draws, so it never flashes the wrong theme
- **Preloader** on the first visit of a session
- **Live site previews** of each project, scaled to fit when a project isn't built for small screens (ACF _Site Preview Embed Width_)
- **Responsive images:** WordPress image sizes with `srcset` / `sizes`, alt text from the Media Library
- **No layout shift while loading:** loading areas keep the page's shape until WordPress answers

## Accessibility

- Semantic landmarks, one `h1` per page, skip link, visible focus styles, full keyboard support
- Animated text is `aria-hidden` and paired with a plain, screen-reader version
- `prefers-reduced-motion` turns animations off
- Every text colour passes WCAG AA (4.5:1) in both themes
- Links that open a new tab say so to screen readers
- Results: Lighthouse Accessibility 100 on every page · WAVE 0 errors, 0 contrast errors (AIM score 9.6–10) · axe 0 issues · tested with VoiceOver, keyboard only and 200% zoom

## Performance

Lighthouse (mobile): Performance 91–95, Accessibility 100, Best Practices 100, SEO 100 · Desktop: 99–100.

Performance budget (mobile, first screen):

| Budget                                        | Limit    | Result     |
| --------------------------------------------- | -------- | ---------- |
| Lighthouse Performance                        | ≥ 90     | 91–95      |
| Page weight                                   | ≤ 1.5 MB | 137–546 KB |
| Requests                                      | ≤ 40     | 7–13       |
| Cumulative Layout Shift                       | ≤ 0.1    | 0–0.03     |
| Total Blocking Time                           | ≤ 200 ms | 0 ms       |
| Largest Contentful Paint (Lighthouse slow 4G) | ≤ 3 s    | 2.6–2.8 s  |

The LCP limit was adjusted from 2.5 s to 3 s after testing: the extra time comes from loading Google Fonts. Self-hosting the fonts is the next improvement.

## Getting started

Requires Node.js 20 or newer.

```bash
git clone https://github.com/francescalulo/frances-portfolio-react.git
cd frances-portfolio-react
npm install
npm run dev
```

No `.env` is needed: the app reads public WordPress content from the REST API (`restBase` in `src/utilities/Utilities.jsx`).

| Script            | What it does                  |
| ----------------- | ----------------------------- |
| `npm run dev`     | Local development server      |
| `npm run lint`    | ESLint (0 warnings allowed)   |
| `npm run build`   | Production build into `dist/` |
| `npm run preview` | Serves the build locally      |

## Deployment

1. Merge `staging` into `main`, then `npm run build`.
2. Upload the contents of `dist/` to `public_html`: the `assets` folder first, `index.html` and `.htaccess` last.
3. Delete the previous build's hashed files from `public_html/assets`.

`public/.htaccess` forces HTTPS, sends every route to `index.html` (React Router), leaves the CMS and past project folders alone, and sets security and caching headers.

## Project structure

```
src/
  components/   one folder per component (JSX + its own Sass)
  pages/        Home, Work, Work Detail, About, 404
  hooks/        data hooks (one shared request per endpoint) and UI hooks
  routers/      AppRouter
  styles/       design tokens, mixins, themes, global styles
  utilities/    REST helpers, image helpers, shared constants
```

Git workflow: `feature/*` and `fix/*` branches → pull request into `staging` → release pull request into `main`.

## Credits

- Design, content and code: Frances Calulo
- Fonts: Space Grotesk, Google Sans Flex and Inter (Google Fonts)
- Built for FWDP 4000 Web Portfolio Project, BCIT
