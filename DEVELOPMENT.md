# Development Guide - ARD Interiér

## Environment

- **OS**: Developed on Windows
- **Node**: v18+
- **Python**: Virtual environment (.venv)
- **Build Tool**: Vite + React + TypeScript

## Development Setup

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## Important: Windows-Specific Notes

⚠️ **Do NOT use Linux/Unix commands** (grep, sed, etc.) - use PowerShell equivalents:

- Instead of `grep`: Use `Select-String` or read PowerShell cmdlets
- Instead of `ls`: Use `Get-ChildItem` or `ls` alias
- Use forward slashes in paths when needed, but PowerShell handles both

## Build Process - CRITICAL MAINTENANCE ISSUE

### The Problem
After each `npm run build`, **Vite generates new bundle hashes** and old assets accumulate in `dist/assets/`.

**Example**: After multiple builds, you might see:
- `Gallery-NQAh5EzL.js` (old, unused)
- `Gallery-CQ1myaeR.js` (newer, still unused)  
- `Gallery-XXXnewHashXX.js` (current, referenced in index.html)

Only the **current hash referenced in index.html** is actually loaded. Old files are dead weight.

### The Solution
**After every `npm run build` or `npm run deploy`, manually clean stale assets:**

1. Check [dist/index.html](dist/index.html) to see which assets are referenced
2. Find hashes in:
   - `<script type="module" crossorigin src="/react_web/assets/index-HASH.js">`
   - `<link rel="modulepreload" crossorigin href="/react_web/assets/icons-HASH.js">`
   - Other `<link>` and `<script>` tags

3. Delete all files in `dist/assets/` that are NOT in index.html

**PowerShell example:**
```powershell
# List files in dist/assets
Get-ChildItem -Path "dist\assets"

# Delete specific old files
Remove-Item -Path "dist\assets\Gallery-OldHash.js", "dist\assets\Contact-OldHash.js" -Force
```

## Image Loading Issue (FIXED)

### Problem
Gallery carousel showed only background color, no images loaded on production.

### Root Cause
Gallery component had a local `getImageUrl()` helper that ignored `BASE_URL` (set to `/react_web/` in production).
- Development: `/images/realization-11.jpg` ✓
- Production: Should be `/react_web/images/realization-11.jpg` ✗

### Solution
Use the shared `getImageUrl()` from [utils.ts](utils.ts) which correctly applies `BASE_URL`.

**File**: [components/Gallery.tsx](components/Gallery.tsx) - removed local helper, now uses import from utils.

## Key File Locations

| File | Purpose |
|------|---------|
| [vite.config.ts](vite.config.ts) | Vite configuration, sets `BASE_URL` |
| [utils.ts](utils.ts) | Shared utility functions (getImageUrl) |
| [components/Gallery.tsx](components/Gallery.tsx) | Carousel gallery (image paths fixed) |
| [data/realizations.ts](data/realizations.ts) | Gallery content data |
| [public/manifest.json](public/manifest.json) | PWA manifest |
| [dist/](dist/) | Build output - **check assets regularly** |

## Environment Variables

Check [.env.local](.env.local) and [vite.config.ts](vite.config.ts) for:
- `BASE_URL` - set for production deployment path
- Other environment-specific settings

## Git Workflow

```bash
# Check status
git status -sb

# Stage changes
git add <file>

# Commit
git commit -m "Clear message"

# Push to main
git push
```

## Common Issues

### Images not loading in gallery
→ Check if image paths in [data/realizations.ts](data/realizations.ts) exist in [public/images/](public/images/)  
→ Verify [utils.ts](utils.ts) `getImageUrl()` is used everywhere  
→ Check browser DevTools Network tab for 404 errors

### Old assets showing after deploy
→ Clear `dist/assets/` of unused files (see Build Process section)  
→ Run `npm run deploy` again

### Build fails
→ Check `tsconfig.json` for type issues  
→ Clear `node_modules/` and run `npm install` again  
→ Check for console errors

## Next Steps for New Developers

1. Read [00_START_HERE.md](00_START_HERE.md)
2. Read [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
3. Understand [utils.ts](utils.ts) image path handling
4. Keep [dist/assets/](dist/assets/) clean after every build
5. Always test in development first (`npm run dev`)
