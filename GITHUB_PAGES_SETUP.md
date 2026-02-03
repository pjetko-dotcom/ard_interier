# GitHub Pages Deployment - Krok za krokom

## 📋 Predpoklady
- GitHub účet (máš ✅)
- Git nainštalovaný na počítači
- Projekt je build-nutý (hotové ✅)

---

## 🚀 Krok 1: Inicializovať Git repozitár (AK JE PRVÝKRÁT)

Ak nemáš repozitár inicializovaný:

```bash
cd c:\data\web\ard_interier
git init
git config user.email "tvoj-email@gmail.com"
git config user.name "Tvoje Meno"
```

---

## 📁 Krok 2: Vytvoriť repozitár na GitHube

1. Choď na https://github.com/new
2. Vytvára nový repozitár s menom: **`ard_interier`**
3. Daj popis: "ARD Interiér - Portfolio stolárstva"
4. **VZORNÝ ODKAZ bude**: `https://github.com/TVOJE_UZIVATEL/ard_interier`
5. Klikni **"Create repository"**

---

## 🔗 Krok 3: Pripojiť lokálny projekt k GitHubu

```bash
cd c:\data\web\ard_interier

# Pridaj GitHub repozitár ako remote
git remote add origin https://github.com/pjetko-dotcom/ard_interier

# Nahráš všetky súbory
git add .
git commit -m "Initial commit - ARD Interiér portfolio"
git branch -M main
git push -u origin main
```

**❗ Nahraď `TVOJE_UZIVATEL` svojím GitHub username!**

---

## ⚙️ Krok 4: Nastaviť GitHub Pages

### Možnosť A: Automatické deployment (ODPORÚČANÉ)

Vytvor `.github/workflows/deploy.yml` v projekte:

```bash
mkdir -p .github/workflows
```

Vytvor súbor `.github/workflows/deploy.yml` s týmto obsahom:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

Pushni túto zmenu:
```bash
git add .github/
git commit -m "Add GitHub Pages deployment workflow"
git push
```

---

### Možnosť B: Manuálne nasadenie (JEDNODUCHŠIE AK CHCEŠ RÝCHLO)

1. **Buildni projekt** (ak ešte nie je):
   ```bash
   npm run build
   ```

2. **Deployuj s gh-pages**:
   ```bash
   npm run deploy
   ```

   Tento príkaz:
   - Vytvorí build
   - Nahrá `dist` priečinok na GitHub Pages

---

## 📱 Krok 5: Aktivovať GitHub Pages v Settings

1. Choď na https://github.com/TVOJE_UZIVATEL/ard_interier/settings
2. V ľavom menu klikni: **"Pages"**
3. Nastav:
   - **Source**: `Deploy from a branch`
   - **Branch**: `gh-pages` (ak máš automatické deployment) alebo `main` (manuál)
   - **Folder**: `/ (root)`
4. Klikni **"Save"**

---

## ✅ Krok 6: Skontrolovať Deployment

- Čakaj 1-2 minúty
- Tvoj web bude dostupný na: **`https://TVOJE_UZIVATEL.github.io/ard_interier/`**

---

## 🔄 Ako aktualizovať web v budúcnosti

**Ak máš nastavenú automatizáciu (GitHub Actions):**
```bash
# Urob zmeny v kóde
git add .
git commit -m "Popis zmien"
git push
# Automaticky sa deployuje! ✨
```

**Ak používaš manuálny deploy:**
```bash
npm run deploy
```

---

## 🆘 Troubleshooting

**"dist priečinok sa nenašiel"**
```bash
npm install
npm run build
```

**"GitHub nedovolí push"**
- Skontroluj či je `git remote -v` nastavené správne
- Možno potrebuješ Personal Access Token namiesto hesla: https://github.com/settings/tokens

**"Stránka sa nenačítava zo správnej cesty"**
- Skontroluj `vite.config.ts` či má `base: '/ard_interier/'` ✅

---

## 📝 Súhrn toho, čo je hotové

✅ App je optimalizovaná (lazy loading komponentov)  
✅ Aplikácia je buildnutá (do priečinku `dist/`)  
✅ `vite.config.ts` má GitHub Pages cestu  
✅ `package.json` má deploy script  
✅ `gh-pages` balíček je nainštalovaný  

**Teraz stačí len pushnutí na GitHub a nastaviť Pages! 🎉**

