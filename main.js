// ── Photo manifest
// Add your photo filenames here after uploading to the folders.
// Format: { 'folder-id': ['file1.jpg', 'file2.jpg', ...] }
const PHOTOS = {
  'city-hawaii':   ['1.jpg','2.jpg','3.jpg','4.jpg','5.jpg','6.jpg','7.jpg','8.jpg','9.jpg','10.jpg','11.jpg'],
  'city-orlando':  ['1.jpg','2.jpg','3.jpg','4.jpg','5.jpg','6.jpg'],
  'grid-hk':       ['1.jpg','2.jpg','3.jpg','4.jpg','5.jpg','6.jpg'],
  'grid-jp':       ['1.jpg','2.jpg','3.jpg','4.jpg'],
  'grid-life':     ['1.jpg','2.jpg','3.jpg','4.jpg','5.jpg'],
  'grid-people':   ['1.jpg','2.jpg','3.jpg','4.jpg','5.jpg','6.jpg','7.jpg']
};

// ── Slide decks
// Each deck: a folder of s-01.jpg … s-NN.jpg thumbnails plus the full PDF.
const DECKS = {
  'bw': {
    title: 'Bandwidth-Limited Imaging via Sparse Scanning and Diffusion Priors · VC Seminar, Feb 2026',
    dir: 'slides/bw',
    count: 38,
    pdf: 'slides/bw_seminar.pdf'
  }
};

// ── Render photos into a grid element
function renderGrid(el) {
  if (el.dataset.rendered) return;
  el.dataset.rendered = true;
  const folder = el.dataset.folder;
  const id = el.id;
  const files = PHOTOS[id] || [];
  if (files.length === 0) {
    el.innerHTML = `<div class="photo-cell" style="grid-column:span 3;aspect-ratio:3/1;background:var(--bg-secondary)">
      <div class="photo-placeholder"><i class="ti ti-camera" style="font-size:22px"></i><span>Photos coming soon — add filenames to PHOTOS in index.html</span></div>
    </div>`;
    return;
  }
  el.innerHTML = files.map((f, i) => {
    const wide = i === 0 ? ' wide' : '';
    return `<div class="photo-cell${wide}">
      <img src="${folder}/${f}" alt="" loading="lazy" onclick="openLightbox('${folder}/${f}')">
    </div>`;
  }).join('');
}

// ── Init: render all currently-visible grids
document.querySelectorAll('[data-folder]').forEach(el => {
  if (el.closest('.panel.active, .grid-panel.active, #country-us')) {
    renderGrid(el);
  }
});

// ── Tab switching
function switchTab(el, tab) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  const panel = document.getElementById('panel-' + tab);
  panel.classList.add('active');
  panel.querySelectorAll('[data-folder]').forEach(renderGrid);
}

function switchCountry(el, country) {
  document.querySelectorAll('.sub-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  ['us','hk','jp'].forEach(c => {
    const div = document.getElementById('country-' + c);
    if (div) div.style.display = c === country ? 'block' : 'none';
  });
  const active = document.getElementById('country-' + country);
  if (active) active.querySelectorAll('[data-folder]').forEach(renderGrid);
}

function switchCity(el, city) {
  document.querySelectorAll('.city-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  ['hawaii','orlando'].forEach(c => {
    const g = document.getElementById('city-' + c);
    if (g) g.className = 'grid-panel' + (c === city ? ' active' : '');
  });
  const g = document.getElementById('city-' + city);
  if (g) renderGrid(g);
}

// ── Lightbox
function openLightbox(src) {
  document.getElementById('lightbox-img').src = src;
  document.getElementById('lightbox').classList.add('open');
}
function closeLightbox() {
  const lb = document.getElementById('lightbox'); if (lb) lb.classList.remove('open');
}

// ── Slide deck viewer
let deckState = null;
function deckSrc(deck, i) { return `${deck.dir}/s-${String(i).padStart(2, '0')}.jpg`; }
function openDeck(key) {
  const deck = DECKS[key];
  if (!deck) return;
  deckState = { deck, i: 1 };
  document.getElementById('deck-title').textContent = deck.title;
  document.getElementById('deck-pdf').href = deck.pdf;
  document.getElementById('deck').classList.add('open');
  document.body.style.overflow = 'hidden';
  deckShow();
}
function deckShow() {
  const { deck, i } = deckState;
  document.getElementById('deck-img').src = deckSrc(deck, i);
  document.getElementById('deck-counter').textContent = `${i} / ${deck.count}`;
  document.getElementById('deck-prev').disabled = i <= 1;
  document.getElementById('deck-next').disabled = i >= deck.count;
  // Preload neighbours so arrow keys feel instant.
  [i + 1, i - 1].forEach(j => { if (j >= 1 && j <= deck.count) { const im = new Image(); im.src = deckSrc(deck, j); } });
}
function deckStep(d) {
  if (!deckState) return;
  const next = deckState.i + d;
  if (next < 1 || next > deckState.deck.count) return;
  deckState.i = next;
  deckShow();
}
function closeDeck() {
  const d = document.getElementById('deck'); if (!d) return;
  d.classList.remove('open');
  document.body.style.overflow = '';
  deckState = null;
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeLightbox(); closeDeck(); }
  if (deckState) {
    if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); deckStep(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); deckStep(-1); }
  }
});

// ── Figures rendered straight from their PDFs (vector, crisp at any zoom)
// Each <canvas class="pdf-fig" data-pdf="..."> is rendered by PDF.js at the
// device pixel ratio and re-rendered on resize. If PDF.js fails to load, the
// canvas is swapped for its data-fallback image.
(function () {
  const figs = [...document.querySelectorAll('canvas.pdf-fig')];
  if (!figs.length) return;
  function fallback(c) {
    const img = document.createElement('img');
    img.src = c.dataset.fallback; img.alt = c.getAttribute('aria-label') || '';
    c.replaceWith(img);
  }
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
  script.onerror = () => figs.forEach(fallback);
  script.onload = () => {
    const pdfjs = window['pdfjs-dist/build/pdf'];
    pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    figs.forEach(async c => {
      try {
        const doc = await pdfjs.getDocument(c.dataset.pdf).promise;
        const page = await doc.getPage(1);
        const base = page.getViewport({ scale: 1 });
        c.style.aspectRatio = `${base.width} / ${base.height}`;
        let task = null, lastW = 0;
        async function render() {
          const cssW = c.clientWidth || c.parentElement.clientWidth;
          const dpr = window.devicePixelRatio || 1;
          const targetW = Math.round(cssW * dpr);
          if (!targetW || targetW === lastW) return;
          lastW = targetW;
          if (task) { try { task.cancel(); } catch (e) {} }
          const vp = page.getViewport({ scale: targetW / base.width });
          c.width = Math.round(vp.width); c.height = Math.round(vp.height);
          task = page.render({ canvasContext: c.getContext('2d'), viewport: vp });
          try { await task.promise; } catch (e) { /* cancelled by a newer render */ }
        }
        await render();
        let t; window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(render, 150); });
      } catch (e) { fallback(c); }
    });
  };
  document.head.appendChild(script);
})();
