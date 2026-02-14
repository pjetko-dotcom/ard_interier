#!/usr/bin/env python3
import requests
from PIL import Image
from io import BytesIO
from pathlib import Path

TARGET_DIR = Path("public/images")
TARGET_DIR.mkdir(parents=True, exist_ok=True)

# Poškodené obrázky
images_to_fix = {
    "realization-6.jpg": "https://images.unsplash.com/photo-1562183241-bd8033a46ff9?auto=format&fit=crop&q=80&w=800",
    "realization-10.jpg": "https://images.unsplash.com/photo-1567605100947-62467e1a24c7?auto=format&fit=crop&q=80&w=800",
    "realization-11.jpg": "https://images.unsplash.com/photo-1565183938294-7563f3ff68c5?auto=format&fit=crop&q=80&w=800",
    "realization-12.jpg": "https://images.unsplash.com/photo-1556227702-c90ff169d362?auto=format&fit=crop&q=80&w=800",
}

print("Opakujem stiahnutie poškodených obrázkov...")
print("-" * 60)

for filename, url in images_to_fix.items():
    try:
        print(f"Stiahavam: {filename}...", end=" ")
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
        
        size_kb = filepath.stat().st_size / 1024
        print(f"✓ Uložené ({size_kb:.1f} KB)")
        
    except Exception as e:
        print(f"✗ CHYBA: {str(e)}")

print("-" * 60)
print("Hotovo!")
