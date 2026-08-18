#!/usr/bin/env python3
"""Crop, colour-correct and compress the chosen candidates into assets/img/.

Only the files listed in PICKS ship. Everything else stays in _generator/raw/
(gitignored) so the shortlist stays reviewable without bloating the repo.
"""
import glob, json, os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.join(HERE, "raw")
OUT = os.path.join(HERE, "..", "assets", "img")

# out-name -> (raw glob, crop geometry, extra magick args)
WIDE = "1800x1013^"      # 16:9 heroes and banners
CARD = "1200x900^"       # 4:3 cards
TALL = "1000x1250^"      # portrait drink cards

PICKS = {
    # --- heroes / atmosphere ---
    "hero-bar":        ("bartenders--bartender-at-sylvarum-cocktail-bar-alicante*", WIDE, []),
    "backbar":         ("cocktail-glasses--cocktail-249195241*", WIDE, []),
    "pour-portrait":   ("bartending--barkeeper-im-friedrichs*", TALL, []),
    # --- signature drinks (placeholders until Sunny's daughter's list lands) ---
    "drink-old-fashioned":   ("old-fashioned-cocktail--oldfashioned-cocktail*", TALL, []),
    "drink-espresso-martini":("espresso-martini-cocktail--espresso-martini-november-2024*", TALL, []),
    "drink-mojito":          ("mojito--cocktail-mojito*", TALL, []),
    "drink-cosmopolitan":    ("cosmopolitan-cocktail--cosmopolitan-cocktail-drink*", TALL, []),
    "drink-spritz":          ("aperol-spritz--aperol-spritz-july-2024*", TALL, []),
    "drink-mule":            ("moscow-mule--moscow-mule-in-schmitz-katze-in-t-bingen-an-der-bar*", TALL, []),
    # --- services ---
    "glassware":       ("cocktail-glasses--alcohol-bar-glass-shooters*", CARD, []),
    "table-setting":   ("wine-glasses-table-setting--11-depot-st-concord*", WIDE, []),
    "plated-service":  ("wine-glasses-table-setting--gourmet-meal-and-white-wine*", CARD, []),
}

def run(cmd):
    subprocess.run(cmd, check=True)

def main():
    os.makedirs(OUT, exist_ok=True)
    manifest = {m["file"]: m for m in json.load(open(os.path.join(RAW, "manifest.json")))}
    used = []
    for name, (pattern, geom, extra) in PICKS.items():
        hits = sorted(glob.glob(os.path.join(RAW, pattern)))
        if not hits:
            print(f"  !! no raw file for {name} ({pattern})", file=sys.stderr)
            continue
        src = hits[0]
        dst = os.path.join(OUT, f"{name}.jpg")
        run(["magick", src, "-auto-orient", *extra,
             "-resize", geom, "-gravity", "center", "-extent", geom.rstrip("^"),
             "-strip", "-interlace", "Plane", "-sampling-factor", "4:2:0",
             "-quality", "82", dst])
        run(["cwebp", "-quiet", "-q", "80", dst, "-o", os.path.join(OUT, f"{name}.webp")])
        meta = manifest.get(os.path.basename(src), {})
        used.append({"name": name, **{k: meta.get(k) for k in
                    ("title", "creator", "license", "license_url", "page")}})
        print(f"{name}.jpg  <-  {os.path.basename(src)[:60]}")

    with open(os.path.join(HERE, "used_images.json"), "w") as f:
        json.dump(used, f, indent=2)
    print(f"\n{len(used)} images in assets/img/")

if __name__ == "__main__":
    main()
