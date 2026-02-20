const { marked } = require('marked');
const hljs = require('highlight.js');
const createDOMPurify = require('dompurify');

const DOMPurify = createDOMPurify(window);

const openFileButton = document.getElementById('openFileButton');
const reloadButton = document.getElementById('reloadButton');
const fileMeta = document.getElementById('fileMeta');
const markdownHost = document.getElementById('markdownHost');
const emptyState = document.getElementById('emptyState');

let currentPath = null;

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

function showContent() {
  markdownHost.style.display = 'block';
  emptyState.style.display = 'none';
}

function showEmptyState() {
  markdownHost.style.display = 'none';
  emptyState.style.display = 'grid';
}

function renderMarkdown(rawMarkdown, fileName, directory) {
  const html = marked.parse(rawMarkdown);
  const sanitized = DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
  markdownHost.innerHTML = sanitized;
  fileMeta.textContent = `${fileName} — ${directory}`;
  showContent();
}

async function openFile() {
  const file = await window.viewerApi.openMarkdownFile();
  if (!file) {
    return;
  }

  currentPath = file.path;
  reloadButton.disabled = false;
  renderMarkdown(file.content, file.fileName, file.directory);
}

async function reloadCurrentFile() {
  if (!currentPath) {
    return;
  }

  const file = await window.viewerApi.loadMarkdownFile(currentPath);
  renderMarkdown(file.content, file.fileName, file.directory);
}

openFileButton.addEventListener('click', () => {
  openFile().catch((error) => {
    console.error(error);
    alert(`Nepodařilo se otevřít soubor: ${error.message}`);
  });
});

reloadButton.addEventListener('click', () => {
  reloadCurrentFile().catch((error) => {
    console.error(error);
    alert(`Nepodařilo se načíst soubor: ${error.message}`);
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

  if (!file.name.toLowerCase().endsWith('.md')) {
    alert('Podporované jsou pouze .md soubory.');
    return;
  }

  try {
    const loaded = await window.viewerApi.loadMarkdownFile(file.path);
    currentPath = loaded.path;
    reloadButton.disabled = false;
    renderMarkdown(loaded.content, loaded.fileName, loaded.directory);
  } catch (error) {
    console.error(error);
    alert(`Nepodařilo se načíst soubor: ${error.message}`);
  }
});

showEmptyState();
