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

1. Otevři svůj repozitář na GitHubu.
2. Jdi na záložku **Actions**.
3. Vyber workflow **Build Windows Portable Viewer**.
4. Klikni **Run workflow**.
5. Po doběhnutí workflow stáhni artifact `md-github-viewer-portable`.
6. Rozbal ZIP a zkopíruj `.exe` na plochu.
7. Spusť `.exe` (u SmartScreen případně **More info** → **Run anyway**).

---

## Lokální build na vlastním Windows PC (alternativa)

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

## Troubleshooting

- **Aplikace se otevře, ale nejde načíst `.md`**:
  - ověř, že soubor fyzicky existuje a není zamčený jiným programem,
  - pokud byl přesunut/smazán, otevři ho znovu tlačítkem **Otevřít .md**,
  - vyzkoušej cestu bez speciálních omezení (např. `C:\Users\<ty>\Documents`).
- **Po spuštění je prázdné okno / chyba inicializace**:
  - spusť aktuální build z artifactu znovu, případně stáhni nový artifact,
  - zkontroluj, že jsi rozbalil celý ZIP, ne jen samotné `.exe` vytržené z balíčku.
