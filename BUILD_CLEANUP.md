# Build Cleanup Process - ARD Interiér

## Why This Matters

After each Vite build, old JavaScript/CSS bundles with different hashes remain in `dist/assets/`. These are **never loaded** by the browser (only files referenced in `dist/index.html` are used), but they add unnecessary bloat.

**Example Scenario:**
```
dist/assets/
├── Gallery-ABC123.js (build #1 - OLD, never used)
├── Gallery-DEF456.js (build #2 - OLD, never used)  
├── Gallery-GHI789.js (build #3 - CURRENT, used by index.html) ← KEEP
├── index-OLD111.js (OLD, never used)
├── index-OLD222.js (OLD, never used)
├── index-CURRENT.js (CURRENT, used by index.html) ← KEEP
└── vendor-SHARED.js (CURRENT, used by index.html) ← KEEP
```

## Automated Cleanup Checklist

After **every** `npm run build` or `npm run deploy`:

### Step 1: Identify Used Assets

Open [dist/index.html](dist/index.html) and look for:

```html
<!-- These are the ONLY files that matter -->
<script type="module" crossorigin src="/react_web/assets/index-ABC123.js"></script>
<link rel="modulepreload" crossorigin href="/react_web/assets/icons-XYZ789.js">
<link rel="modulepreload" crossorigin href="/react_web/assets/vendor-XYZ789.js">
<link rel="stylesheet" crossorigin href="/react_web/assets/index-ABC123.css">
```

Write down all filenames referenced (copy-paste the hashes).

### Step 2: List Current Assets

```powershell
# Windows PowerShell
Get-ChildItem -Path "dist\assets" -Name | Sort-Object
```

### Step 3: Delete Unused Files

```powershell
# Remove stale files (NOT referenced in index.html)
Remove-Item -Path "dist\assets\Gallery-OldHash.js", `
                      "dist\assets\Contact-OldHash.js", `
                      "dist\assets\Services-OldHash.js" -Force
```

### Step 4: Verify Only Current Assets Remain

```powershell
Get-ChildItem -Path "dist\assets"
```

Should match exactly with files in index.html. If you see duplicates of the same component (e.g., two `Gallery-*.js`), delete the old one.

## Current Hashes (as of latest build)

Check this each time you build:

**Last Clean Build** (Feb 15, 2026):
- `index-BXm4lZHt.css` ✓
- `index-CoG1cE4a.js` ✓
- `icons-DR-aUcg6.js` ✓
- `vendor-DF_EYJIJ.js` ✓

Only these 4 files should exist. Anything else is old and can be safely deleted.

## Integration with Deploy Script

Ideally, we should add cleanup to `package.json`:

```json
{
  "scripts": {
    "build": "vite build && npm run clean-dist",
    "clean-dist": "node scripts/clean-dist.js"
  }
}
```

But for now, **manual cleanup is required**.

## PowerShell Script (Copy-Paste Ready)

Save this as `cleanup-dist.ps1` and run: `.\cleanup-dist.ps1`

```powershell
# Get hashes from index.html
$indexPath = "dist\index.html"
$indexContent = Get-Content $indexPath -Raw

# Extract all asset filenames used
$pattern = 'assets/[a-zA-Z0-9\-]+\.(js|css)'
$usedFiles = [regex]::Matches($indexContent, $pattern) | ForEach-Object { $_.Value -replace 'assets/', '' }

# Get all files in dist/assets
$allFiles = Get-ChildItem -Path "dist\assets" -Name

# Find unused files
$unusedFiles = $allFiles | Where-Object { $_ -notin $usedFiles }

# Delete unused files
if ($unusedFiles.Count -gt 0) {
    Write-Host "Deleting $($unusedFiles.Count) unused file(s):"
    $unusedFiles | ForEach-Object { 
        Write-Host "  - $_"
        Remove-Item -Path "dist\assets\$_" -Force
    }
} else {
    Write-Host "No unused files found. dist/assets is clean!"
}
```

## CI/CD Recommendation

For production deploys, add to GitHub Actions workflow:
- Run `npm run build`
- Run cleanup script
- Run `npm run publish` (gh-pages)

This ensures GitHub Pages always has clean, minimal assets.

## See Also

- [DEVELOPMENT.md](DEVELOPMENT.md) - Main development guide
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Deployment instructions
- [vite.config.ts](vite.config.ts) - Vite config with BASE_URL
