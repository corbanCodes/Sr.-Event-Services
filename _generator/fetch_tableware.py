#!/usr/bin/env python3
"""Second pass: pull from Commons *categories*, which beat keyword search badly
for cocktail and event-service subjects the first pass came up empty on."""
import json, os, re, sys, time, urllib.parse, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.join(HERE, "raw")
API = "https://commons.wikimedia.org/w/api.php"
UA = {"User-Agent": "60MinuteSites/1.0 (https://60minutesites.com; corbandamukaitis@gmail.com)"}

CATS = {
    "Category:Place settings": 10,
    "Category:Tableware": 10,
    "Category:Porcelain tableware": 10,
    "Category:Dinner plates": 8,
    "Category:Cutlery": 8,
    "Category:Napkins": 6,
    "Category:Banquet halls": 10,
    "Category:Wedding tables": 10,
    "Category:Catering": 10,
    "Category:Waiting staff": 10,
    "Category:Buffets": 8,
    "Category:Dining tables": 8,
}

OK_LICENCE = re.compile(r"^(cc0|cc-by(-sa)?-[234]\.\d|public domain|pd-|attribution)", re.I)

def api(params):
    params = dict(params, format="json", formatversion="2")
    req = urllib.request.Request(API + "?" + urllib.parse.urlencode(params), headers=UA)
    with urllib.request.urlopen(req, timeout=45) as r:
        return json.load(r)

def clean(html):
    if not html: return ""
    txt = re.sub(r"<[^>]+>", " ", html)
    txt = re.sub(r"&amp;", "&", txt); txt = re.sub(r"&[a-z]+;", " ", txt)
    return re.sub(r"\s+", " ", txt).strip()

def slug(s):
    return re.sub(r"[^a-z0-9]+", "-", (s or "").lower()).strip("-")[:55]

def main():
    os.makedirs(RAW, exist_ok=True)
    mpath = os.path.join(RAW, "manifest.json")
    manifest = json.load(open(mpath)) if os.path.exists(mpath) else []
    seen = {m["title"] for m in manifest}
    for cat, want in CATS.items():
        try:
            data = api({
                "action": "query", "generator": "categorymembers",
                "gcmtitle": cat, "gcmtype": "file", "gcmlimit": "40",
                "prop": "imageinfo", "iiprop": "url|size|extmetadata",
                "iiurlwidth": "2000",
            })
        except Exception as e:
            print(f"  !! {cat}: {e}", file=sys.stderr); continue
        kept = 0
        for page in data.get("query", {}).get("pages", []):
            if kept >= want: break
            info = (page.get("imageinfo") or [{}])[0]
            meta = info.get("extmetadata", {}) or {}
            lic = clean(meta.get("LicenseShortName", {}).get("value"))
            if not OK_LICENCE.match(lic or ""): continue
            w, h = info.get("width", 0), info.get("height", 0)
            if w < 1000 or h < 700: continue
            title = page.get("title", "").replace("File:", "")
            if title in seen: continue
            url = info.get("thumburl") or info.get("url")
            name = f"{slug(cat.replace('Category:',''))}--{slug(os.path.splitext(title)[0])}.jpg"
            path = os.path.join(RAW, name)
            if not os.path.exists(path):
                try:
                    req = urllib.request.Request(url, headers=UA)
                    with urllib.request.urlopen(req, timeout=60) as r:
                        blob = r.read()
                    if len(blob) < 40000: continue
                    with open(path, "wb") as f: f.write(blob)
                except Exception:
                    continue
            seen.add(title); kept += 1
            manifest.append({
                "file": name, "query": cat, "title": title,
                "creator": clean(meta.get("Artist", {}).get("value")) or "Unknown",
                "license": lic, "license_url": clean(meta.get("LicenseUrl", {}).get("value")),
                "credit": clean(meta.get("Credit", {}).get("value"))[:160],
                "page": "https://commons.wikimedia.org/wiki/" + urllib.parse.quote(page.get("title", "")),
                "width": w, "height": h,
            })
        print(f"{cat}: kept {kept}")
        time.sleep(0.3)
    with open(mpath, "w") as f: json.dump(manifest, f, indent=2)
    print(f"\n{len(manifest)} candidates total")

if __name__ == "__main__":
    main()
