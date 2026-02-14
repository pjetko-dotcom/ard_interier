#!/usr/bin/env python3
"""
Vytvára placeholder obrázky a stiahne alternatívne obrázky pre chýbajúce realizácie.
"""
import os
from pathlib import Path
import requests
from PIL import Image, ImageDraw, ImageFont
from io import BytesIO

TARGET_DIR = Path("public/images")
TARGET_DIR.mkdir(parents=True, exist_ok=True)

# Alternatívne Unsplash obrázky pre realizácie
alternative_urls = {
    "realization-2.jpg": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=800",
    "realization-3.jpg": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800",
    "realization-4.jpg": "https://images.unsplash.com/photo-1600121848371-bb8e3c6a8fe3?auto=format&fit=crop&q=80&w=800",
    "realization-6.jpg": "https://images.unsplash.com/photo-1556228578-8c89e6aaf883?auto=format&fit=crop&q=80&w=800",
    "realization-7.jpg": "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800",
    "realization-8.jpg": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=800",
    "realization-10.jpg": "https://images.unsplash.com/photo-1567605100947-62467e1a24c7?auto=format&fit=crop&q=80&w=800",
    "realization-11.jpg": "https://images.unsplash.com/photo-1556227702-c90ff169d362?auto=format&fit=crop&q=80&w=800",
    "realization-12.jpg": "https://images.unsplash.com/photo-1556228578-8c89e6aaf883?auto=format&fit=crop&q=80&w=800",
}

def create_placeholder(filename, width=800, height=600):
    """Vytvára placeholder obrázok s textom."""
    img = Image.new('RGB', (width, height), color=(200, 180, 160))
    draw = ImageDraw.Draw(img)
    
    # Pridaj text
    text = filename.replace('.jpg', '').replace('-', ' ').title()
    draw.text((width//2, height//2), text, fill=(100, 80, 60), anchor="mm")
    
    filepath = TARGET_DIR / filename
    img.save(filepath, "JPEG", quality=85)
    print(f"  Placeholder: {filename} ({filepath.stat().st_size / 1024:.1f} KB)")

print("Stiahavam alternatívne obrázky...")
print("-" * 60)

success = 0
failed = []

for filename, url in alternative_urls.items():
    # Preskočí ak už existuje
    if (TARGET_DIR / filename).exists():
        print(f"  Existuje: {filename}")
        success += 1
        continue
    
    try:
        print(f"  Stiahavam: {filename}...", end=" ")
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        
        img = Image.open(BytesIO(response.content))
        max_size = (1600, 1200)
        img.thumbnail(max_size, Image.Resampling.LANCZOS)
        
        if img.mode in ('RGBA', 'LA'):
            rgb_img = Image.new("RGB", img.size, (255, 255, 255))
            rgb_img.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
            img = rgb_img
        
        filepath = TARGET_DIR / filename
        img.save(filepath, "JPEG", quality=85, optimize=True)
        print(f"✓ ({filepath.stat().st_size / 1024:.1f} KB)")
        success += 1
        
    except Exception as e:
        print(f"✗ Skúšam placeholder...")
        try:
            create_placeholder(filename)
            success += 1
        except Exception as pe:
            print(f"    Chyba: {pe}")
            failed.append(filename)

print("-" * 60)
print(f"\nSpolu vytvorené: {success}")
if failed:
    print(f"Zlyhané: {', '.join(failed)}")

print(f"\nVšetky obrázky v {TARGET_DIR}:")
for img in sorted(TARGET_DIR.glob("*.jpg")):
    size_kb = img.stat().st_size / 1024
    print(f"  ✓ {img.name} ({size_kb:.1f} KB)")
