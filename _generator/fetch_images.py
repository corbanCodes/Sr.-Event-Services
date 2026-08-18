#!/usr/bin/env python3
"""Pull commercial-use photos from Wikimedia Commons for the Sr. Event Services site.

Same approach as the C-A-S-P build: Commons needs no auth and its extmetadata
block carries licence + attribution for ATTRIBUTION.md. Candidates land in
_generator/raw/ to be eyeballed before any of them ship.
"""
import json, os, re, sys, time, urllib.parse, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.join(HERE, "raw")
API = "https://commons.wikimedia.org/w/api.php"
UA = {"User-Agent": "60MinuteSites/1.0 (https://60minutesites.com; corbandamukaitis@gmail.com)"}

QUERIES = [
    "cocktail bar dark moody",
    "bartender pouring cocktail",
    "bartender mixing drink shaker",
    "old fashioned cocktail whiskey glass",
    "margarita cocktail glass lime",
    "espresso martini cocktail",
    "mojito cocktail mint",
    "negroni cocktail orange",
    "whiskey sour cocktail",
    "champagne glasses toast",
    "champagne tower glasses",
    "wedding reception bar drinks",
    "cocktail garnish preparation",
    "wine glasses table setting",
    "fine china table setting formal",
    "banquet table event dinner",
    "waiter serving tray event",
    "catering staff service event",
    "bar shelf bottles backlit",
    "gin tonic cocktail glass",
    "cocktail smoke garnish",
    "event tent wedding tables",
]

# Licences we can actually use commercially.
OK_LICENCE = re.compile(r"^(cc0|cc-by(-sa)?-[234]\.\d|public domain|pd-|attribution)", re.I)

def api(params):
    params = dict(params, format="json", formatversion="2")
    req = urllib.request.Request(API + "?" + urllib.parse.urlencode(params), headers=UA)
    with urllib.request.urlopen(req, timeout=45) as r:
        return json.load(r)

def clean(html):
    if not html:
        return ""
    txt = re.sub(r"<[^>]+>", " ", html)
    txt = re.sub(r"&amp;", "&", txt)
    txt = re.sub(r"&[a-z]+;", " ", txt)
    return re.sub(r"\s+", " ", txt).strip()

def slug(s):
    return re.sub(r"[^a-z0-9]+", "-", (s or "").lower()).strip("-")[:55]

def main():
    os.makedirs(RAW, exist_ok=True)
    manifest, seen = [], set()
    for q in QUERIES:
        try:
            data = api({
                "action": "query",
                "generator": "search",
                "gsrsearch": f"filetype:bitmap {q}",
                "gsrnamespace": "6",
                "gsrlimit": "24",
                "prop": "imageinfo",
                "iiprop": "url|size|extmetadata",
                "iiurlwidth": "2000",
            })
        except Exception as e:
            print(f"  !! {q}: {e}", file=sys.stderr)
            continue
        kept = 0
        for page in data.get("query", {}).get("pages", []):
            if kept >= 8:
                break
            info = (page.get("imageinfo") or [{}])[0]
            meta = info.get("extmetadata", {}) or {}
            lic = clean(meta.get("LicenseShortName", {}).get("value"))
            if not OK_LICENCE.match(lic or ""):
                continue
            w, h = info.get("width", 0), info.get("height", 0)
            if w < 1100 or h < 700:              # need real hero-grade pixels
                continue
            title = page.get("title", "").replace("File:", "")
            if title in seen:
                continue
            url = info.get("thumburl") or info.get("url")
            name = f"{slug(q)}--{slug(os.path.splitext(title)[0])}.jpg"
            path = os.path.join(RAW, name)
            if not os.path.exists(path):
                try:
                    req = urllib.request.Request(url, headers=UA)
                    with urllib.request.urlopen(req, timeout=60) as r:
                        blob = r.read()
                    if len(blob) < 40000:
                        continue
                    with open(path, "wb") as f:
                        f.write(blob)
                except Exception:
                    continue
            seen.add(title)
            kept += 1
            manifest.append({
                "file": name,
                "query": q,
                "title": title,
                "creator": clean(meta.get("Artist", {}).get("value")) or "Unknown",
                "license": lic,
                "license_url": clean(meta.get("LicenseUrl", {}).get("value")),
                "credit": clean(meta.get("Credit", {}).get("value"))[:160],
                "page": "https://commons.wikimedia.org/wiki/" + urllib.parse.quote(page.get("title", "")),
                "width": w, "height": h,
            })
        print(f"{q}: kept {kept}")
        time.sleep(0.3)
    with open(os.path.join(RAW, "manifest.json"), "w") as f:
        json.dump(manifest, f, indent=2)
    print(f"\n{len(manifest)} candidates in {RAW}")

if __name__ == "__main__":
    main()
