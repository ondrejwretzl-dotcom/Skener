const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const fs = require('node:fs/promises');
const path = require('node:path');

let mainWindow;

async function readMarkdownFile(filePath) {
  const resolved = path.resolve(filePath);
  const content = await fs.readFile(resolved, 'utf-8');
  return {
    content,
    path: resolved,
    fileName: path.basename(resolved),
    directory: path.dirname(resolved)
  };
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 900,
    minWidth: 900,
    minHeight: 640,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('file:open', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    title: 'Vyber Markdown soubor',
    properties: ['openFile'],
    filters: [
      { name: 'Markdown', extensions: ['md', 'markdown', 'mdown'] },
      { name: 'Všechny soubory', extensions: ['*'] }
    ]
  });

  if (canceled || filePaths.length === 0) {
    return null;
  }

  try {
    return await readMarkdownFile(filePaths[0]);
  } catch {
    throw new Error('Soubor se nepodařilo otevřít. Zkontroluj, že existuje a máš k němu přístup.');
  }
});

ipcMain.handle('file:load', async (_event, filePath) => {
  if (!filePath || typeof filePath !== 'string') {
    throw new Error('Neplatná cesta k souboru.');
  }

  try {
    return await readMarkdownFile(filePath);
  } catch {
    throw new Error('Soubor se nepodařilo načíst. Mohl být přesunut, smazán nebo je blokovaný.');
  }
});
