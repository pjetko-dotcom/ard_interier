# Image Loading & Asset Path Guidelines

## Problem: Images Not Loading in Gallery

If gallery carousel shows only background colors (no images), the issue is almost always **incorrect asset path resolution**.

## How Image Paths Work

### Development (localhost:5173)
```
/images/realization-11.jpg → works directly
```

### Production (GitHub Pages @ /react_web/)
```
/images/realization-11.jpg → FAILS (404)
/react_web/images/realization-11.jpg → WORKS ✓
```

## The Solution: Use `getImageUrl()` Helper

All image paths **MUST** go through the `getImageUrl()` function from [utils.ts](utils.ts):

```typescript
import { getImageUrl } from '../utils';

// ✓ CORRECT
img.src = getImageUrl('images/realization-11.jpg');

// ✗ WRONG - ignores BASE_URL
img.src = 'images/realization-11.jpg';
```

### How It Works

[utils.ts](utils.ts):
```typescript
export const getImageUrl = (imagePath: string): string => {
  const basePath = import.meta.env.BASE_URL;  // /react_web/ in production
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  return `${basePath}${cleanPath}`;
};
```

**Result:**
- Dev: `/ + images/realization-11.jpg` = `/images/realization-11.jpg`
- Prod: `/react_web/ + images/realization-11.jpg` = `/react_web/images/realization-11.jpg`

## Where Images Are Used

### Gallery Component  
**File**: [components/Gallery.tsx](components/Gallery.tsx)

✓ **CORRECT** (uses shared helper):
```tsx
import { getImageUrl } from '../utils';

<img src={getImageUrl(item.image)} alt="..." />
```

### Other Components

Search for image references:
```bash
# Find all places using images
grep -r "images/" components/
grep -r "images/" data/
```

Make sure they all use `getImageUrl()`.

## Image Data Structure

[data/realizations.ts](data/realizations.ts):
```typescript
{
  id: 1,
  image: 'images/realization-1.jpg',  // ← Store relative path
  title: 'Title',
  category: 'Category',
  categoryKey: 'residential',
}
```

Image paths in data should be **unqualified relative paths** (`images/...`), then `getImageUrl()` adds the base path.

## File Locations

| Location | Purpose | Must Use getImageUrl? |
|----------|---------|----------------------|
| [data/realizations.ts](data/realizations.ts) | Gallery items | ✓ YES |
| [components/Gallery.tsx](components/Gallery.tsx) | Carousel carousel display | ✓ YES |
| [components/Hero.tsx](components/Hero.tsx) | Hero background | ✓ YES |
| [components/About.tsx](components/About.tsx) | About section | ✓ YES |
| [index.html](index.html) | Static HTML | ✗ NO (use `/react_web/` prefix manually) |
| [public/](public/) | Static files | ✗ NO (served as-is) |

## Testing Image Paths

### Development
1. Start `npm run dev`
2. Open http://localhost:5173
3. Check browser DevTools → Network tab
4. Images should load from `/images/...`

### Production
1. Run `npm run deploy`
2. Open https://www.ardinterier.sk/react_web/
3. Check browser DevTools → Network tab
4. Images should load from `/react_web/images/...`
5. If you see 404 errors on `/images/...`, **getImageUrl() was not used**

## Fallback Images

Gallery has fallback for failed loads [components/Gallery.tsx](components/Gallery.tsx):
```tsx
const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.target as HTMLImageElement;
    img.src = getImageUrl('images/realization-featured-fallback.jpg');
};
```

If image fails, shows [public/images/realization-featured-fallback.jpg](public/images/realization-featured-fallback.jpg).

## Adding New Images

1. Add to [public/images/](public/images/) folder
2. Add entry to [data/realizations.ts](data/realizations.ts) with path like `'images/realization-XX.jpg'`
3. In components, use `getImageUrl(item.image)` - never hardcode the path

## Debugging

If images still don't load:

1. **Check file exists**: `ls public/images/realization-11.jpg`
2. **Check path in data**: grep `realization-11` data/realizations.ts
3. **Check component uses getImageUrl**: grep `getImageUrl` components/Gallery.tsx
4. **Check dist is clean**: No old hashes conflicting - see [BUILD_CLEANUP.md](BUILD_CLEANUP.md)
5. **Check browser DevTools**: Network tab shows request URL and response (404 indicates file missing)

## See Also

- [DEVELOPMENT.md](DEVELOPMENT.md) - General development guide
- [BUILD_CLEANUP.md](BUILD_CLEANUP.md) - Dist assets cleanup
- [utils.ts](utils.ts) - Source of `getImageUrl()`
- [vite.config.ts](vite.config.ts) - BASE_URL configuration
