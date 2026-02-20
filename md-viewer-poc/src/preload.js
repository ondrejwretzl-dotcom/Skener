const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('viewerApi', {
  openMarkdownFile: () => ipcRenderer.invoke('file:open'),
  loadMarkdownFile: (filePath) => ipcRenderer.invoke('file:load', filePath),
  renderMarkdown: (rawMarkdown) => ipcRenderer.invoke('markdown:render', rawMarkdown),
  getLogPath: () => ipcRenderer.invoke('diagnostic:get-log-path')
});
