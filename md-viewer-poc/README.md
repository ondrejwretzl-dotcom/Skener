# MD Github Viewer (Windows POC)

Lehký desktop viewer pro `.md` soubory ve stylu podobném GitHubu.

## Co umí

- otevření `.md` souboru přes tlačítko,
- drag & drop `.md` souboru do okna,
- GitHub-like vzhled (`github-markdown-css`),
- zvýraznění syntaxe v code blocích (`highlight.js`),
- bezpečné sanitizování HTML (`DOMPurify`),
- ruční refresh souboru tlačítkem **Znovu načíst**.

---

## Jak to dostat z GitHubu na Windows desktop (doporučeno)

> Cíl: stáhnout hotový `.exe` bez řešení Node.js lokálně.

1. Otevři svůj repozitář na GitHubu.
2. Jdi na záložku **Actions**.
3. Vyber workflow **Build Windows Portable Viewer**.
4. Klikni **Run workflow** (na hlavní větvi nebo na větvi, kde je viewer).
5. Po doběhnutí workflow otevři konkrétní run a v sekci **Artifacts** stáhni `md-github-viewer-portable`.
6. Rozbal ZIP artifact a zkopíruj `.exe` na plochu.
7. Spusť `.exe` (u SmartScreen případně klikni na **More info** → **Run anyway**).

Výsledek: přenosná aplikace bez instalačního wizardu.

---

## Lokální build na vlastním Windows PC (alternativa)

Pokud chceš buildovat mimo GitHub Actions:

1. Nainstaluj Node.js LTS (doporučeno 22+).
2. V terminálu přejdi do `md-viewer-poc`.
3. Spusť:
## Rychlé spuštění (vývoj)

```bash
npm install
npm run start
```

## Build portable `.exe` bez instalace

Na Windows:

```bash
npm install
npm run dist:win
```

Výstup je v `release/`, typicky:

`MD Github Viewer-0.1.0-portable.exe`

---

## Vývojové spuštění

```bash
npm install
npm run start
```

---
Výstup bude v `release/`, typicky soubor jako:

`MD Github Viewer-0.1.0-portable.exe`

Ten můžeš přenést na jiný Windows počítač a spouštět bez instalačního wizardu.

## Poznámky k POC

- Je to **viewer-only** (bez editace).
- Pro GitHub-like vzhled se používá CSS z CDN (vyžaduje internet). Pokud chceš full offline režim, lze CSS přibalit lokálně v dalším kroku.
