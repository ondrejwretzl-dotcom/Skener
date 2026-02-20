const openFileButton = document.getElementById('openFileButton');
const reloadButton = document.getElementById('reloadButton');
const fileMeta = document.getElementById('fileMeta');
const markdownHost = document.getElementById('markdownHost');
const emptyState = document.getElementById('emptyState');

let currentPath = null;

function showContent() {
  markdownHost.style.display = 'block';
  emptyState.style.display = 'none';
}

function showEmptyState() {
  markdownHost.style.display = 'none';
  emptyState.style.display = 'grid';
}

async function renderMarkdown(rawMarkdown, fileName, directory) {
  const sanitizedHtml = await window.viewerApi.renderMarkdown(rawMarkdown);
  markdownHost.innerHTML = sanitizedHtml;
  fileMeta.textContent = `${fileName} — ${directory}`;
  showContent();
}

function showDetailedError(error, operation) {
  window.viewerApi.getLogPath().then((logPath) => {
    alert(`${operation}: ${error.message}\n\nDiagnostika: ${logPath}`);
  });
}

async function openFile() {
  const file = await window.viewerApi.openMarkdownFile();
  if (!file) {
    return;
  }

  currentPath = file.path;
  reloadButton.disabled = false;
  await renderMarkdown(file.content, file.fileName, file.directory);
}

async function reloadCurrentFile() {
  if (!currentPath) {
    return;
  }

  const file = await window.viewerApi.loadMarkdownFile(currentPath);
  await renderMarkdown(file.content, file.fileName, file.directory);
}

openFileButton.addEventListener('click', () => {
  openFile().catch((error) => {
    console.error(error);
    showDetailedError(error, 'Nepodařilo se otevřít soubor');
  });
});

reloadButton.addEventListener('click', () => {
  reloadCurrentFile().catch((error) => {
    console.error(error);
    showDetailedError(error, 'Nepodařilo se načíst soubor');
  });
});

window.addEventListener('dragover', (event) => {
  event.preventDefault();
});

window.addEventListener('drop', async (event) => {
  event.preventDefault();
  const [file] = event.dataTransfer.files;

  if (!file || !file.path) {
    return;
  }

  const fileName = file.name.toLowerCase();
  if (!fileName.endsWith('.md') && !fileName.endsWith('.markdown') && !fileName.endsWith('.mdown')) {
    alert('Podporované jsou pouze .md, .markdown a .mdown soubory.');
    return;
  }

  try {
    const loaded = await window.viewerApi.loadMarkdownFile(file.path);
    currentPath = loaded.path;
    reloadButton.disabled = false;
    await renderMarkdown(loaded.content, loaded.fileName, loaded.directory);
  } catch (error) {
    console.error(error);
    showDetailedError(error, 'Nepodařilo se načíst soubor');
  }
});

showEmptyState();
