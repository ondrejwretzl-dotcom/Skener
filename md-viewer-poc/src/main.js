const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const fs = require('node:fs/promises');
const path = require('node:path');
const { marked } = require('marked');
const hljs = require('highlight.js');

let mainWindow;
let logFilePath;

function sanitizeHtml(html) {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/\son\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '');
}

function configureMarkdown() {
  marked.setOptions({
    gfm: true,
    breaks: false,
    headerIds: true,
    mangle: false,
    highlight(code, language) {
      if (language && hljs.getLanguage(language)) {
        return hljs.highlight(code, { language }).value;
      }
      return hljs.highlightAuto(code).value;
    }
  });
}

async function writeLog(message) {
  if (!logFilePath) {
    return;
  }

  const line = `[${new Date().toISOString()}] ${message}\n`;
  await fs.appendFile(logFilePath, line, 'utf-8').catch(() => {});
}

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

  mainWindow.loadFile(path.join(__dirname, 'index.html')).catch((error) => {
    writeLog(`Failed to load UI: ${error.message}`);
  });
}

app.whenReady().then(async () => {
  logFilePath = path.join(app.getPath('userData'), 'viewer.log');
  configureMarkdown();
  await writeLog('Application started.');

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

process.on('uncaughtException', (error) => {
  writeLog(`Uncaught exception: ${error.message}`);
});

process.on('unhandledRejection', (reason) => {
  writeLog(`Unhandled rejection: ${String(reason)}`);
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
  } catch (error) {
    await writeLog(`Open error: ${error.message}`);
    throw new Error('Soubor se nepodařilo otevřít. Zkontroluj, že existuje a máš k němu přístup.');
  }
});

ipcMain.handle('file:load', async (_event, filePath) => {
  if (!filePath || typeof filePath !== 'string') {
    throw new Error('Neplatná cesta k souboru.');
  }

  try {
    return await readMarkdownFile(filePath);
  } catch (error) {
    await writeLog(`Load error for ${filePath}: ${error.message}`);
    throw new Error('Soubor se nepodařilo načíst. Mohl být přesunut, smazán nebo je blokovaný.');
  }
});

ipcMain.handle('markdown:render', async (_event, rawMarkdown) => {
  if (typeof rawMarkdown !== 'string') {
    throw new Error('Neplatný obsah markdownu.');
  }

  try {
    const html = marked.parse(rawMarkdown);
    return sanitizeHtml(html);
  } catch (error) {
    await writeLog(`Markdown render error: ${error.message}`);
    throw new Error('Nepodařilo se vykreslit markdown kvůli chybě parseru.');
  }
});

ipcMain.handle('diagnostic:get-log-path', () => logFilePath);
