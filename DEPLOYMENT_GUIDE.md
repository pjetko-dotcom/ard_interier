# 🚀 KOMPLETNÝ POSTUP: ARD INTERIÉR NA GITHUB PAGES

## 📌 STATUS

✅ **Aplikácia je optimalizovaná**  
✅ **Build je hotový** (v `dist/` priečinku)  
✅ **Všetky skripty sú nastavené**  
✅ **Deployment je pripravený**  

---

## 🎯 RÝCHLY START (5 MINÚT)

### Ak máš Git na počítači:

```bash
# 1. Choď do priečinku
cd c:\data\web\ard_interier

# 2. Inicializuj Git
git init
git config user.email "tvoj-email@gmail.com"
git config user.name "Tvoje Meno"

# 3. Pridaj všetky súbory
git add .
git commit -m "Initial commit - ARD Interiér portfolio"

# 4. Rename branch na main
git branch -M main

# 5. Pridaj GitHub remote (NAHRAĎ username!)
git remote add origin https://github.com/TVOJE_UZIVATEL/ard_interier.git

# 6. Pushni na GitHub
git push -u origin main

# 7. Deployuj web
npm run deploy
```

---

## 📋 DETAILNÝ POSTUP

### FÁZA 1: Príprava na GitHube

#### 1.1 Vytvor nový repozitár
1. Choď na https://github.com/new
2. **Repository name**: `ard_interier`
3. **Description**: ARD Interiér - Portfolio stolárstva
4. **Visibility**: Public (aby videli všetci)
5. ❌ **Neinicializuj** s README (máš lokálny kód)
6. Klikni **"Create repository"**

**Výsledok**: `https://github.com/TVOJE_UZIVATEL/ard_interier`

---

#### 1.2 Skopíruj URL repozitára
Po vytvorení sa otvorí stránka. Skopíruj URL:
- Formát: `https://github.com/TVOJE_UZIVATEL/ard_interier.git`

---

### FÁZA 2: Lokálny Git Setup

#### 2.1 Otvor PowerShell/Terminal

```bash
cd c:\data\web\ard_interier
```

#### 2.2 Inicializuj Git projekt

```bash
git init
```

#### 2.3 Nastav Git config

```bash
git config user.email "tvoj-email@gmail.com"
git config user.name "Tvoje Meno"
```

*Poznámka: Použij tú emailovu adresu a meno, ktoré máš na GitHube*

#### 2.4 Pridaj všetky súbory

```bash
git add .
```

#### 2.5 Vytvor prvý commit

```bash
git commit -m "Initial commit - ARD Interiér portfolio s optimalizáciami"
```

---

### FÁZA 3: Pripojiť k GitHubu

#### 3.1 Rename branch (GitHub používa `main` ako default)

```bash
git branch -M main
```

#### 3.2 Pridaj GitHub ako remote

```bash
git remote add origin https://github.com/TVOJE_UZIVATEL/ard_interier.git
```

**❗ DÔLEŽITÉ: Nahraď `TVOJE_UZIVATEL` svojím GitHub username!**

#### 3.3 Skontroluj remote

```bash
git remote -v
```

Výstup by mal byť:
```
origin  https://github.com/TVOJE_UZIVATEL/ard_interier.git (fetch)
origin  https://github.com/TVOJE_UZIVATEL/ard_interier.git (push)
```

#### 3.4 Pushni na GitHub

```bash
git push -u origin main
```

**Ak sa spýta na heslo:**
- Nepoužívaj priame heslo do GitHubu (je zastarané)
- Vytvor Personal Access Token: https://github.com/settings/tokens
- Klikni "Generate new token (classic)"
- Nastav `repo` a `workflow` scopes
- Použij token ako heslo

---

### FÁZA 4: Aktivovať GitHub Pages

#### 4.1 Choď do Repository Settings

1. Otvor: `https://github.com/TVOJE_UZIVATEL/ard_interier/settings`
2. V ľavom menu: klikni **"Pages"**

#### 4.2 Nastav Source

- **Source**: `Deploy from a branch`
- **Branch**: `gh-pages`
- **Folder**: `/ (root)`

#### 4.3 Ulož

Klikni **"Save"**

---

### FÁZA 5: Deploy na GitHub Pages

#### 5.1 Automatické nasadenie

```bash
npm run deploy
```

Tento príkaz:
1. Buildne aplikáciu (znova)
2. Vytvorí `gh-pages` branch
3. Nahrá `dist` priečinok na GitHub Pages
4. Aktualizuje repozitár

#### 5.2 Čakaj 1-2 minúty

GitHub Pages nastavuje obsah...

---

### FÁZA 6: ✨ Tvoj web je live!

**Otvor v prehliadači:**
```
https://TVOJE_UZIVATEL.github.io/ard_interier/
```

Príklad pre username `peter123`:
```
https://peter123.github.io/ard_interier/
```

---

## 🔄 AKO AKTUALIZOVAŤ WEB NESKÔR

Ak chceš urobiť zmeny a posunúť nový obsah:

```bash
# 1. Urob zmeny v kóde
# ...Edituj súbory ...

# 2. Commitni zmeny
git add .
git commit -m "Popis zmien (napr. Fix contact form)"

# 3. Pushni na GitHub
git push

# 4. Deployuj nový build
npm run deploy
```

**Hotové!** Zmeny budú live za 1-2 minúty.

---

## ❗ TROUBLESHOOTING

### ❌ "fatal: not a git repository"
**Riešenie:**
```bash
cd c:\data\web\ard_interier
git init
```

### ❌ "error: remote origin already exists"
**Riešenie:**
```bash
git remote remove origin
git remote add origin https://github.com/TVOJE_UZIVATEL/ard_interier.git
```

### ❌ "Personal access token required"
1. Vytvor token: https://github.com/settings/tokens
2. Klikni "Generate new token (classic)"
3. Nastav tieto scopes:
   - ✅ `repo` (plný prístup k repozitárom)
   - ✅ `workflow` (GitHub Actions)
4. Skopíruj token
5. Keď sa spýta na heslo, vložz token namiesto hesla

### ❌ "404 - Page not found"
Možné príčiny:
1. **Chýba `base: '/ard_interier/'` v vite.config.ts** - ✅ Je nastavené
2. **GitHub Pages nie je povolené** - Skontroluj Settings → Pages
3. **Čakaj dlhšie** - GitHub Pages potrebuje 1-2 minúty

### ❌ "npm run deploy" selže
```bash
# 1. Zisti aký je problém
npm run build

# 2. Ak build OK, skús:
npm run publish

# 3. Ak to nefunguje, manuálne:
npx gh-pages -d dist
```

---

## 📊 PERFORMANCE TIPS

Ako skontrolovať performance webu:

1. **Otvor DevTools** (F12)
2. **Choď na záložku "Lighthouse"**
3. Klikni "Analyze page load"
4. Čakaj pár sekúnd...

Měl by si vidieť:
- ✅ Performance: ~90+
- ✅ Accessibility: ~90+
- ✅ Best Practices: ~90+
- ✅ SEO: ~100

---

## 🎯 ČEKLIST PRED PUBLIKOVANÍM

- [ ] Git je inicializovaný (`git init` hotový)
- [ ] Všetky súbory sú commitnuté (`git status` = clean)
- [ ] Repozitár existuje na GitHube
- [ ] Remote je nastavený (`git remote -v` ukazuje origin)
- [ ] Branch je `main` (`git branch` = main)
- [ ] GitHub Pages sú aktivované v Settings
- [ ] `npm run deploy` beží bez chýb
- [ ] Web je dostupný na GitHub Pages URL
- [ ] Stránka sa načítava správne

---

## 🎨 BUDÚCE VYLEPŠENIA

**Ak chceš ďalšie optimalizácie:**

```bash
# PWA Support (offline mode)
npm install --save-dev vite-plugin-pwa

# Image Optimization
npm install --save-dev imagemin

# Analytics
# Pridaj Google Analytics alebo Plausible
```

---

## 📚 UŽITOČNÉ LINKY

- **GitHub Pages Docs**: https://pages.github.com/
- **Vite Deploy Guide**: https://vitejs.dev/guide/static-deploy.html#github-pages
- **Git Basics**: https://git-scm.com/book/en/v2/Getting-Started

---

## ✨ READY TO DEPLOY!

Všetko je pripravené. **Ak máš ľubovoľné otázky alebo problém:**

1. Skontroluj TROUBLESHOOTING sekciu vyššie
2. Čitaj error message v terminále (často časti riešenia)
3. Ak zlyháš, skúš znova s týmto postupom krok za krokom

**Veľa šťastia s deploymentom! 🚀**

