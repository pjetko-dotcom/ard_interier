# ARD Interiér - React Webová Aplikácia

Moderná single-page aplikácia pre stolársku firmu ARD Interiér, vytvorená pomocou React 19, TypeScript a Tailwind CSS.

**Status:** ✅ Optimalizovaná | ✅ Buildnutá | ✅ Pripravená na GitHub Pages

## 🌟 Funkcie
- Plne responzívny dizajn (Mobile First)
- Interaktívna swipe galéria (Carousel + Lightbox)
- Elegantný UI/UX dizajn s teplými farbami dreva
- Hladké scrollovanie (Smooth Scroll)
- Kontaktný formulár
- **NEW:** Lazy loading komponentov (-57% bundle size)
- **NEW:** Optimalizovaný build (59.51 kB gzipped)

## 📖 DEPLOYMENT NA GITHUB PAGES

**Rýchly start (5 minút):**
```bash
cd c:\data\web\ard_interier
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/TVOJE_UZIVATEL/ard_interier.git
git push -u origin main
npm run deploy
```

**Podrobný postup:** Pozri súbor [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

Po deploymente bude tvoj web dostupný na:
```
https://TVOJE_UZIVATEL.github.io/ard_interier/
```

## 🖼️ DÔLEŽITÉ: Návod na obrázky (Image Setup)
Pre správne fungovanie galérie s originálnymi obrázkami ARD Interiér, postupujte podľa týchto krokov:

1. Navštívte oficiálny web [ardinterier.sk](https://www.ardinterier.sk/).
2. Otvorte vývojárske nástroje (stlačte `F12`) a prejdite na záložku **Network**.
3. Filtrujte iba obrázky kliknutím na **Img**.
4. Preklikajte sa sekciami *Realizácie* a *Galéria* na stránke, aby sa načítali obrázky.
5. Stiahnite 12+ najlepších obrázkov realizácií (kliknite pravým tlačidlom na obrázok v zozname Network alebo na stránke -> *Save image as...*).
6. Premenujte ich presne nasledovne:
   - `realization-1.jpg`
   - `realization-2.jpg`
   - ... až po `realization-12.jpg`
7. Ak je to možné, zmenšite ich veľkosť cez [tinypng.com](https://tinypng.com) (odporúčaná šírka 1200px).
8. Vložte tieto súbory do priečinka `public/images/` v koreňovom adresári projektu (vytvorte priečinok `images`, ak neexistuje).

*Poznámka: Aplikácia obsahuje fallback mechanizmus. Ak obrázky nenájde, zobrazí náhodné placeholder obrázky z Picsum, aby ste videli funkčnosť dizajnu okamžite.*

## 🚀 Inštalácia a Spustenie

1. **Inštalácia závislostí:**
   ```bash
   npm install
   ```
   *(Uistite sa, že máte nainštalovaný Node.js v18+)*

2. **Spustenie vývojového servera:**
   ```bash
   npm run dev
   ```
   Aplikácia beží na `http://localhost:3000`.

3. **Build pre produkciu:**
   ```bash
   npm run build
   ```

4. **Preview produkčného buildu:**
   ```bash
   npm run preview
   ```

5. **Deploy na GitHub Pages:**
   ```bash
   npm run deploy
   ```
   Nástrojom `gh-pages` sa priamo nahrá na GitHub Pages.

## 🎯 Optimalizácie

Aplikácia bola optimalizovaná pre maximálny výkon:

- ✅ **Lazy Loading** - Komponenty sa načítavajú na požiadavku
- ✅ **Code Splitting** - React, ikony a ďalšie sú v samostatných bundloch
- ✅ **Minifikácia** - Terser minifikuje JS v produkcii
- ✅ **Tree Shaking** - Nepoužívaný kód je odstraňovaný
- ✅ **Bundle Size** - ~59.51 kB gzipped (pôvodne ~90 kB)

Podrobnosti: [OPTIMIZATIONS.md](./OPTIMIZATIONS.md)

## 🛠️ Technológie
- **React 19.2.4** - UI Framework
- **TypeScript 5.8** - Type Safety
- **Vite 6.2** - Build Tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **gh-pages** - GitHub Pages Deployment
- **Tailwind CSS** (Styling)
- **Lucide React** (Ikony)
- **Vite** (Build tool)

## 📦 Nasadenie na GitHub Pages
1. Upravte `vite.config.ts`, pridajte `base: '/nazov-repozitara/'`.
2. Spustite `npm run build`.
3. Nahrajte obsah priečinka `dist` na vetvu `gh-pages`.

---
*Vytvorené ako demo projekt pre ARD Interiér.*