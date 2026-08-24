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
- Luxury pass (18 Aug, after Corban review; referenced Death & Co's site): etched-coupe
  intro veil w/ line-drawn monogram (once per session), headline line-mask reveals, gold
  cursor halo + magnetic buttons (desktop), foil-gradient buttons w/ shine sweep, hairline
  card frames, cinematic hero exit on scroll, slower italic marquee w/ ✦. Removed the small
  caption text on the hero floating photos (Corban: felt off)

## Concept A/B (added 20 Aug, pre-call)

- Fixed toggle (top-left, bottom-left on mobile) flips between concept A (`/`) and
  concept B (`/b.html`) so Sunny can compare live.
- Concept B = award-style one-pager: Bodoni Moda/Marcellus/Plex Mono, WebGL gold-dust
  field, Lenis inertia scroll, GSAP pinned horizontal drink rail + stacked package
  cards + hover-reveal service rows, SR. counter preloader. `?skipintro` skips the
  preloader (it also auto-skips once per session). Same Formspree + disclaimer.
- B needs CDN (GSAP/Lenis/Three + Google Fonts) — fine on Netlify/localhost; page
  still renders statically if CDNs are blocked.

## Client notes from Sunny (implemented 24 Aug, both concepts)

- **Staffing & crockery as on-page sections** on the bartending page (A: dedicated
  `#staffing` + `#china` sections replacing the combined services grid, nav updated;
  B: already chaptered sections, notes enriched)
- **Domain: TipsyTbar.com** — Sunny's pick for the bartending domain. Not yet purchased/
  wired; buy + point at Netlify at go-live. Site branding stays "Sr. Event Services"
  until he says otherwise (ask whether TipsyT should appear on the site itself)
- **Server questionnaire** — booking forms on both concepts now ask: servers needed,
  service hours (6-hr minimum enforced via min=6), china preference, venue city
  (A bartending form only for venue city; B has occasion field)
- **6-hour minimum + travel fee** — stated in A's packages "Good to know" note, the
  staffing section bullets, home booking card; B's packages terms line
- **Premium White China & Gold Rim China** — named in A's `#china` section chips +
  home card; B's crockery row + terms line + form select

## Round 6 (24 Aug, FINAL — sale closed, $50/mo) — the shipped architecture

- **Root (`/`) = TipsyTee Bar** (bright, unchanged content). **`/sr/` = SR Event Services**
  — the black/gold concept A restored (Sunny picked it), with `/sr/bartending.html`.
- **Two tabs at the top of every page** (TipsyTee Bar ⇄ SR Event Services) replace all
  banners; TipsyTee is the default since tipsyteebar.com is the domain. The dismissible
  partner banner is gone.
- Brand is **"SR Event Services" — no period** (not an abbreviation of Senior). No
  "catering" anywhere per client.
- **Sunny's URL to hand out: tipsyteebar.com/sr/** (his sreventservices.com can redirect
  there from his registrar). c.html (his old light draft) deleted — he chose option A.
- Assets at ?v=3 cache-buster.

## Round 5 (24 Aug) — TipsyTee IS the site now; concepts A/B removed (superseded)

- Client committed ("they bought") — concepts A and B deleted from the repo
  (index/bartending/b.html + b assets). **TipsyTee now serves at the root** (`/`,
  was /tipsytee.html) — ready for tipsyteebar.com to point at the deploy.
  tipsyteebar.com still shows no DNS; if they bought it, nameservers aren't set yet.
- "DEMO PREVIEW — the future tipsyteebar.com" strip removed. In its place: a
  **dismissible banner** — "Partnered with Sr. Event Services — bartending, staffing,
  and china rentals" (links sreventservices.com) with an × that hides it for the
  session (sessionStorage).
- `/c.html` (Sunny's light draft) still in repo, direct URL. 404.html still styled
  by the old dark main.css — restyle whenever.
- Asset URLs carry `?v=N` cache-busters now — bump on future JS/CSS edits.

## Round 4 (24 Aug) — spelling: TipsyTee, tipsyteebar.com

- Brand is **TipsyTee Bar** (tee, not tea). Domain: **tipsyteebar.com** — still unregistered
  (verified no DNS 24 Aug) — register ASAP.
- Top wordmark stays **"TipsyT"** (Tipsy + just the T) per her instruction, even though the
  domain spells out tipsyteebar.com. Her link renamed again: **/tipsytee.html**.

## Round 3 (24 Aug, daughter's notes) — TipsyTea, her own standalone link (superseded spelling)

- Brand is **TipsyTea**, domain **tipsyteabar.com** (she also said "tipsyteabaring.com"
  once — assumed typo, CONFIRM). tipsyteabar.com unregistered as of 24 Aug — register ASAP.
- **sreventservices.com is already live** (minimal "Crafting Unforgettable Moments" landing
  page + contact form — presumably Sunny's). The eventual Sr. Event Services rebuild
  replaces that site.
- Concept C = **TipsyTea only** now: `/tipsytea.html` (renamed from tipsyt.html), her own
  shareable link with NO concept toggle, NO site switcher, no Sr. Event Services
  section/nav — partner appears by name only: demo strip reads "partnered with
  Sr. Event Services — staffing, china, catering & more" → links sreventservices.com;
  small footer mention + the form's "add staffing & china" option.
- `/c.html` (light Sr. Event Services draft) kept in repo for Sunny's separate track —
  reachable by direct URL only.
- Concept A hero → "The **service** your guests remember." (she liked both lines; "bar"
  version still lives on the B concept + TipsyTea contexts).
- Going forward Sunny and the daughter are separate tracks: he'll spec Sr. Event Services,
  she'll spec TipsyTea individually.

## Concept C — the two-site plan (24 Aug, after Sunny's second round of notes)

They want TWO sites, both modeled on mobilemixologist.com (bright/friendly), cross-linked:

- **TipsyTbar.com** (the priority — "her" bar site): demoed at `/tipsyt.html`. Craft mobile
  bartending, blush-pink accent, bookings section (`#bookings`), links to Sr. Event Services
  for staffing/china. **Domain unregistered as of 24 Aug (no DNS) — register it ASAP.**
- **Sr. Event Services** (main/event site): demoed at `/c.html`. Staffing + china/tableware,
  gold accent; bar-service card + partnership section route to TipsyT's bookings.
- Both pages carry a top "site switcher" (TipsyT Bar ⇄ Sr. Event Services) simulating the
  cross-domain links; at go-live these become real domain links and each page becomes its
  own site/repo/Netlify deploy.
- Concept toggle A/B/C on all pages; C entry point = TipsyT (their preference).
- **No pricing anywhere** — Sunny: "the pricing won't transfer over." Bar pricing lives with
  TipsyT off-site; both demos quote-on-request only.
- Stock imagery approved by client for the bar ("just stock imagery bar is fine").
- Sr. Event Services' own domain still unchosen — ask.

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
