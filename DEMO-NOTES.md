# Demo notes — Sr. Event Services

Built 18 Aug 2026 from the intake call. Call scheduled 2PM EST / 11AM PT with Sunny
(209.750.0788, sunnyk029@hotmail.com). Nickname "Sunny", full name Sunny Arvind Kumar.

## What the call specified (implemented)

- Main focus = **bar service** → dedicated `bartending.html`, home hero leads with the bar
- **Packages, pick & choose** → 3 packages on home; each card links straight to the
  bartending page (his exact ask: "someone clicks on it and it goes straight to bartending page")
- **Bottom of the bartending page lists his other services**: staffing +
  plates/cups/glassware + china & crockery → `#services` section sits above the contact form
- Not-AI-looking / classy / 3D "images that move" → dark editorial design, pointer-parallax
  hero cards, tilt cards with glare, scroll parallax, film grain. Hand-rolled JS (no Three.js —
  full WebGL would read gimmicky and hurt mobile; can add if he pushes for more)

## Placeholders to replace

- **Drink list + photos**: Sunny and his daughter picked drinks; he's emailing pictures +
  names. Current 6 signature drinks + full menu are stand-ins. Drop replacements into
  `assets/img/drink-*.jpg` and edit the cards on both pages.
- **Quote in the gold band** ("A good bartender doesn't just pour drinks…") — invented,
  get his blessing or his own line.
- **Package names/contents/pricing** (The Classic / Signature / Grand) — invented tiers,
  no pricing shown anywhere. Confirm structure on the follow-up call.
- **Service area** — not stated on the call; site avoids naming a region. 209 area code =
  CA Central Valley, but he books 2PM EST, so confirm where he actually operates.
- **"Founder & head of service" / signature "Sunny Kumar"** — confirm he wants his name
  styled this way (vs "Sr." branding or full Arvind Kumar).
- **Licensing/insurance** — no claims made on-site; add once confirmed.
- Daughter is involved in drink curation — ask if she should appear on the site
  (family-run angle is good copy if he wants it).

## Wiring

- Forms → Formspree `xojeqvng` (shared 60MS endpoint) with on-site disclaimer that
  submissions route through 60 Minute Sites during the demo. Swap at handoff + remove
  the `.form-note` blocks and the `demo-bar` banner.
- Photos: Wikimedia Commons, commercial-use licences, credited in `credits.html` +
  `ATTRIBUTION.md`. The pour portrait shows a "Friedrichs" shirt logo (another bar) —
  used small in the hero stack; replace with Sunny's own photo ASAP.
- No sitemap/robots yet — add at go-live with the real domain.
