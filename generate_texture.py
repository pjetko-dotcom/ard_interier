#!/usr/bin/env python3
"""
Generuje textúru pre References pozadie.
"""
from PIL import Image, ImageDraw
import random
from pathlib import Path

TARGET_DIR = Path("public/images")
TARGET_DIR.mkdir(parents=True, exist_ok=True)

# Ich je textúra wood-pattern.png - vytvoríme si podobnú
width, height = 200, 200
img = Image.new('RGB', (width, height), color=(60, 40, 30))  # Dark wood color
draw = ImageDraw.Draw(img, 'RGBA')

# Generuj lineárne vzory podobné drevo
random.seed(42)
for i in range(100):
    x1 = random.randint(0, width)
    y1 = random.randint(0, height)
    x2 = x1 + random.randint(20, 100)
    y2 = y1 + random.randint(-10, 10)
    
    color = (
        40 + random.randint(-20, 20),
        25 + random.randint(-15, 15),
        15 + random.randint(-10, 10),
        20
    )
    draw.line([(x1, y1), (x2, y2)], fill=color, width=random.randint(1, 3))

filepath = TARGET_DIR / "wood-pattern.png"
img.save(filepath, "PNG")
print(f"✓ Textúra vytvorená: {filepath} ({filepath.stat().st_size / 1024:.1f} KB)")
