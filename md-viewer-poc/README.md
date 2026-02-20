# MD Github Viewer (Windows POC)

Lehký desktop viewer pro `.md` soubory ve stylu podobném GitHubu.

## Co umí

- otevření `.md` souboru přes tlačítko,
- drag & drop `.md` souboru do okna,
- GitHub-like vzhled (`github-markdown-css`),
- zvýraznění syntaxe v code blocích (`highlight.js`),
- bezpečné sanitizování HTML (`DOMPurify`),
- ruční refresh souboru tlačítkem **Znovu načíst**.

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

Výstup bude v `release/`, typicky soubor jako:

`MD Github Viewer-0.1.0-portable.exe`

Ten můžeš přenést na jiný Windows počítač a spouštět bez instalačního wizardu.

## Poznámky k POC

- Je to **viewer-only** (bez editace).
- Pro GitHub-like vzhled se používá CSS z CDN (vyžaduje internet). Pokud chceš full offline režim, lze CSS přibalit lokálně v dalším kroku.
