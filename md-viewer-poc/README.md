# MD Github Viewer (Windows POC)

Lehký desktop viewer pro `.md` soubory ve stylu podobném GitHubu.

## Důležité k antiviru/SmartScreen (Windows)

Pokud je aplikace **nepodepsaná**, Windows/antivir ji může označit jako „unknown app“.
To není bug v kódu, ale reputační/podpisová politika Windows.

### Jak to řešit správně

1. Použít **code signing certifikát** (EV ideálně) při buildu `.exe`.
2. Distribuovat build opakovaně pod stejným podpisem (buduje se reputace).
3. Pokud nechceš `.exe`, použij alternativu níže (**no-exe web viewer**).

---

## Co umí

- otevření `.md` / `.markdown` / `.mdown` souboru přes tlačítko,
- drag & drop markdown souboru do okna,
- GitHub-like vzhled,
- ruční refresh souboru tlačítkem **Znovu načíst**,
- diagnostický log souboru při chybě knihovny/parsování.

---

## Jak to dostat z GitHubu na Windows desktop

1. Otevři repozitář na GitHubu.
2. Jdi do **Actions**.
3. Vyber workflow **Build Windows Portable Viewer**.
4. Klikni **Run workflow**.
5. Stáhni artifact:
   - `md-github-viewer-portable` (klasická `.exe` varianta), nebo
   - `md-viewer-web-no-exe` (HTML varianta bez `.exe`).

---

## Varianta 1: Portable `.exe`

Spusť `MD Github Viewer-0.1.0-portable.exe`.

Pokud SmartScreen varuje:
- **More info** → **Run anyway** (u interního testování),
- pro veřejnou distribuci doporučen podpis certifikátem.

---

## Varianta 2: Bez `.exe` (méně falešných AV poplachů)

Použij `web-viewer/index.html`:
- otevři soubor v prohlížeči (Edge/Chrome),
- vyber markdown soubor přes file picker.

Tato varianta je nejjednodušší na distribuci a běžně nevyvolává SmartScreen blokaci jako neznámé `.exe`.

---

## Troubleshooting

- **Nejde otevřít `.md`**: aplikace teď ukáže i cestu k diagnostickému logu (`viewer.log`).
- **Chyba knihovny**: renderer už není závislý na přímém načítání JS knihoven v okně; markdown parsing běží v main procesu.
