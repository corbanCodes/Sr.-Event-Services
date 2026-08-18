# Sr. Event Services — demo site

Demo/concept site built by [60 Minute Sites](https://60minutesites.com) for
**Sunny (Arvind) Kumar — Sr. Event Services**: premium mobile bar service, event
staffing, and tableware (china, crockery, glassware, plates & cups).

- `index.html` — home: hero, signature drinks, packages, services, contact
- `bartending.html` — the bar page: how it works, pick-and-choose packages,
  full drink menu, services at the bottom (per Sunny's spec), contact
- `credits.html` — photo attribution (all images Wikimedia Commons, commercial-use licences)
- `404.html`
- `_generator/` — reproducible image sourcing + processing scripts (raw candidates gitignored)

Static site, no build step. Fonts from Google Fonts, everything else self-contained.
Forms post to the shared 60MS Formspree endpoint during the demo period (disclaimer shown
on-site); swap to the client's own endpoint at handoff.

Motion: hand-rolled pointer-parallax hero, 3D tilt cards, scroll parallax, staggered
reveals — no JS dependencies, `prefers-reduced-motion` respected throughout.

See `DEMO-NOTES.md` for open questions and content to confirm with the client.
