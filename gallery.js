/* GS Flooring — Gallery (dynamic via GitHub Contents API) */

(function () {
    const REPO_API = 'https://api.github.com/repos/gsflooring/gsflooring.github.io/contents/public';
    const EXCLUDE  = ['logo.jpg', 'demo.txt'];

    const grid  = document.getElementById('galleryGrid');
    if (!grid) return;

    const lb      = document.getElementById('lightbox');
    const lbImg   = document.getElementById('lbImg');
    const lbClose = document.getElementById('lbClose');
    const lbPrev  = document.getElementById('lbPrev');
    const lbNext  = document.getElementById('lbNext');
    const lbCount = document.getElementById('lbCount');

    let images  = [];
    let current = 0;

    /* ── Fetch image list ── */
    fetch(REPO_API, { headers: { 'Accept': 'application/vnd.github.v3+json' } })
        .then(function (r) { return r.json(); })
        .then(function (files) {
            images = files.filter(function (f) {
                return f.type === 'file'
                    && !EXCLUDE.includes(f.name)
                    && /\.(jpe?g|png|webp|gif)$/i.test(f.name);
            }).map(function (f) {
                return { src: f.download_url, name: f.name };
            });

            // Remove skeleton placeholders
            grid.innerHTML = '';

            if (images.length === 0) {
                grid.innerHTML = '<p class="gallery-empty">No photos found.</p>';
                return;
            }

            images.forEach(function (img, i) {
                const item = document.createElement('div');
                item.className = 'gallery-item';
                item.setAttribute('role', 'button');
                item.setAttribute('tabindex', '0');
                item.setAttribute('aria-label', 'View project photo ' + (i + 1));

                const el = document.createElement('img');
                el.src     = img.src;
                el.alt     = 'GS Flooring project — photo ' + (i + 1);
                el.loading = 'lazy';
                el.decoding = 'async';

                item.appendChild(el);
                item.addEventListener('click',   function () { openLightbox(i); });
                item.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') openLightbox(i); });
                grid.appendChild(item);
            });
        })
        .catch(function () {
            grid.innerHTML = '<p class="gallery-empty">Gallery unavailable — please check back soon.</p>';
        });

    /* ── Lightbox controls ── */
    function openLightbox(index) {
        current     = index;
        lbImg.src   = '';
        lbImg.src   = images[current].src;
        updateCount();
        lb.classList.add('open');
        lb.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        lbClose.focus();
    }

    function closeLightbox() {
        lb.classList.remove('open');
        lb.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        lbImg.src = '';
    }

    function showPrev() {
        current = (current - 1 + images.length) % images.length;
        lbImg.src = '';
        lbImg.src = images[current].src;
        updateCount();
    }

    function showNext() {
        current = (current + 1) % images.length;
        lbImg.src = '';
        lbImg.src = images[current].src;
        updateCount();
    }

    function updateCount() {
        if (lbCount) lbCount.textContent = (current + 1) + ' / ' + images.length;
    }

    lbClose.addEventListener('click', closeLightbox);
    lbPrev.addEventListener('click',  showPrev);
    lbNext.addEventListener('click',  showNext);

    // Close on backdrop click
    lb.addEventListener('click', function (e) {
        if (e.target === lb) closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
        if (!lb.classList.contains('open')) return;
        if (e.key === 'ArrowLeft')  { e.preventDefault(); showPrev(); }
        if (e.key === 'ArrowRight') { e.preventDefault(); showNext(); }
        if (e.key === 'Escape')     closeLightbox();
    });
}());
