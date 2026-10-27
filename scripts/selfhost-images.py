#!/usr/bin/env python3
"""Descarga las imágenes de producto del CDN externo a /public/catalog y
reescribe catalog.json para que ninguna URL pública mencione al proveedor."""
import json
import hashlib
import os
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CATALOG = os.path.join(ROOT, "src/lib/data/catalog.json")
OUT_DIR = os.path.join(ROOT, "public/catalog")
MAPPING = os.path.join(ROOT, "scripts/image-map.json")

os.makedirs(OUT_DIR, exist_ok=True)

data = json.load(open(CATALOG, encoding="utf-8"))
urls = set()
for p in data["products"]:
    for c in p["colors"]:
        imgs = c["images"]
        for u in [imgs.get("front"), imgs.get("back")] + imgs.get("gallery", []):
            if u:
                urls.add(u)

mapping = {}
if os.path.exists(MAPPING):
    mapping = json.load(open(MAPPING, encoding="utf-8"))

ok, fail, skipped = 0, 0, 0
for i, url in enumerate(sorted(urls), 1):
    ext = ".jpg"
    h = hashlib.sha1(url.encode()).hexdigest()[:16]
    local = f"/catalog/{h}{ext}"
    mapping[url] = local
    dest = os.path.join(ROOT, "public" + local)
    if os.path.exists(dest) and os.path.getsize(dest) > 0:
        skipped += 1
        continue
    r = subprocess.run(
        ["curl", "-sfL", "--retry", "3", "-H", "User-Agent: gzs-web", "-o", dest, url],
        capture_output=True,
    )
    if r.returncode != 0 or not os.path.exists(dest) or os.path.getsize(dest) == 0:
        print(f"FAIL {url}")
        fail += 1
        if os.path.exists(dest):
            os.remove(dest)
    else:
        ok += 1
    if i % 20 == 0:
        print(f"  {i}/{len(urls)} procesadas…")

print(f"descargadas={ok} omitidas={skipped} fallos={fail}")

if fail:
    sys.exit(1)


def rewrite(u):
    return mapping.get(u, u) if u else u


for p in data["products"]:
    for c in p["colors"]:
        imgs = c["images"]
        if imgs.get("front"):
            imgs["front"] = rewrite(imgs["front"])
        if imgs.get("back"):
            imgs["back"] = rewrite(imgs["back"])
        imgs["gallery"] = [rewrite(u) for u in imgs.get("gallery", []) if u]

json.dump(data, open(CATALOG, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
json.dump(mapping, open(MAPPING, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
print("catalog.json reescrito con rutas locales /catalog/…")
