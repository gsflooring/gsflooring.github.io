/* GS Flooring — Gallery (sequential probe: public/photo1.jpeg, photo2.jpeg …) */

(function () {
    const BASE = 'public/photo';
    const EXT  = '.jpeg';

    const grid  = document.getElementById('galleryGrid');
    if (!grid) return;

    const lb      = document.getElementById('lightbox');
    const lbImg   = document.getElementById('lbImg');
    const lbClose = document.getElementById('lbClose');
    const lbPrev  = document.getElementById('lbPrev');
    const lbNext  = document.getElementById('lbNext');
    const lbCount = document.getElementById('lbCount');

    let images  = [];   // array of src strings
    let current = 0;

    /* ── Sequential image probe ── */
    function probe(index) {
        var src  = BASE + index + EXT;
        var test = new Image();

        test.onload = function () {
            images.push(src);
            probe(index + 1);          // try the next one
        };

        test.onerror = function () {
            // This index doesn't exist — we're done loading
            grid.innerHTML = '';

            if (images.length === 0) {
                grid.innerHTML = '<p class="gallery-empty">No photos found.</p>';
                return;
            }

            images.forEach(function (imgSrc, i) {
                var item = document.createElement('div');
                item.className = 'gallery-item';
                item.setAttribute('role', 'button');
                item.setAttribute('tabindex', '0');
                item.setAttribute('aria-label', 'View project photo ' + (i + 1));

                var el = document.createElement('img');
                el.alt     = 'GS Flooring project — photo ' + (i + 1);
                el.decoding = 'async';
                // Attach listener BEFORE setting src so cached images don't miss the event
                el.addEventListener('load', function () { el.classList.add('loaded'); });
                if (el.complete) el.classList.add('loaded'); // already cached
                el.src = imgSrc;

                item.appendChild(el);
                item.addEventListener('click',   function () { openLightbox(i); });
                item.addEventListener('keydown', function (e) {
                    if (e.key === 'Enter' || e.key === ' ') openLightbox(i);
                });
                grid.appendChild(item);
            });
        };

        test.src = src;
    }

    probe(1);   // start from photo1.jpeg

    /* ── Lightbox controls ── */
    function openLightbox(index) {
        current     = index;
        lbImg.src   = '';
        lbImg.src   = images[current];
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
        lbImg.src = images[current];
        updateCount();
    }

    function showNext() {
        current = (current + 1) % images.length;
        lbImg.src = '';
        lbImg.src = images[current];
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
