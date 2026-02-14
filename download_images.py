#!/usr/bin/env python3
"""
Stiahne všetky externé obrázky projektovej webovej stránky.
"""
import os
import requests
from pathlib import Path
from PIL import Image
from io import BytesIO
import json

# Cieľový priečinok
TARGET_DIR = Path("public/images")
TARGET_DIR.mkdir(parents=True, exist_ok=True)

# Zoznam obrázkov na stiahnutie
images = {
    # Hero.tsx - background
    "hero-bg.jpg": "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=2000",
    
    # Realizations.tsx - featured projects
    "realization-featured-1.jpg": "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800",
    "realization-featured-2.jpg": "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&q=80&w=800",
    "realization-featured-fallback.jpg": "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800",
    
    # About.tsx - company images
    "about-main.jpg": "https://images.unsplash.com/photo-1595846519845-68e298c2edd8?auto=format&fit=crop&q=80&w=800",
    "about-workshop.jpg": "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=600",
}

# Realization placeholders - vygenerujeme obrázky pre portfolio
realizations = {
    "realization-1.jpg": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=800",
    "realization-2.jpg": "https://images.unsplash.com/photo-1595428772223-ef52624120d2?auto=format&fit=crop&q=80&w=800",
    "realization-3.jpg": "https://images.unsplash.com/photo-1604857555107-1b1c70e7f7d3?auto=format&fit=crop&q=80&w=800",
    "realization-4.jpg": "https://images.unsplash.com/photo-1600121848371-bb8e3c6a8fe3?auto=format&fit=crop&q=80&w=800",
    "realization-5.jpg": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=800",
    "realization-6.jpg": "https://images.unsplash.com/photo-1562183241-bd8033a46ff9?auto=format&fit=crop&q=80&w=800",
    "realization-7.jpg": "https://images.unsplash.com/photo-1606857521220-46bddaf5df21?auto=format&fit=crop&q=80&w=800",
    "realization-8.jpg": "https://images.unsplash.com/photo-1578500494198-246f612d03b3?auto=format&fit=crop&q=80&w=800",
    "realization-9.jpg": "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&q=80&w=800",
    "realization-10.jpg": "https://images.unsplash.com/photo-1567605100947-62467e1a24c7?auto=format&fit=crop&q=80&w=800",
    "realization-11.jpg": "https://images.unsplash.com/photo-1565183938294-7563f3ff68c5?auto=format&fit=crop&q=80&w=800",
    "realization-12.jpg": "https://images.unsplash.com/photo-1556227702-c90ff169d362?auto=format&fit=crop&q=80&w=800",
    "realization-13.jpg": "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&q=80&w=800",
}

# Spojíme všetky obrázky
all_images = {**images, **realizations}

print(f"Začína stiahnutie {len(all_images)} obrázkov do {TARGET_DIR}...")
print("-" * 60)

success_count = 0
failed_count = 0
failed_images = []

for filename, url in all_images.items():
    try:
        print(f"Stiahavam: {filename}...", end=" ")
        
        # Stiahni obrázok
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        
        # Otvor obrázok a optimalizuj ho
        img = Image.open(BytesIO(response.content))
        
        # Ak je obrázok príliš veľký, zmensuj ho
        max_size = (1600, 1200)
        img.thumbnail(max_size, Image.Resampling.LANCZOS)
        
        # Konvertuj na RGB ak je potrebné (pre jpg)
        if img.mode in ('RGBA', 'LA'):
            rgb_img = Image.new("RGB", img.size, (255, 255, 255))
            rgb_img.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
            img = rgb_img
        
        # Ulož obrázok
        filepath = TARGET_DIR / filename
        img.save(filepath, "JPEG", quality=85, optimize=True)
        
        print(f"✓ Uložené ({filepath.stat().st_size / 1024:.1f} KB)")
        success_count += 1
        
    except Exception as e:
        print(f"✗ CHYBA: {str(e)}")
        failed_count += 1
        failed_images.append((filename, str(e)))

print("-" * 60)
print(f"\nVýsledky:")
print(f"  ✓ Úspešne stiahnuté: {success_count}")
print(f"  ✗ Zlyhaní obrázky: {failed_count}")

if failed_images:
    print("\nZlyhané obrázky:")
    for filename, error in failed_images:
        print(f"  - {filename}: {error}")

print(f"\nObrázky sú uložené v: {TARGET_DIR.resolve()}")

# Vypíš dostupné obrázky
print(f"\nDostupné obrázky:")
image_files = sorted(TARGET_DIR.glob("*.jpg"))
for img_file in image_files:
    print(f"  - {img_file.name}")
