/* GS Flooring — Contact Form (Web3Forms) */

document.addEventListener('DOMContentLoaded', function () {
    const form    = document.getElementById('quoteForm');
    const wrap    = document.getElementById('contactFormWrap');
    const success = document.getElementById('formSuccess');

    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Basic client-side validation
        const required = ['firstName', 'lastName', 'email', 'message'];
        let valid = true;
        required.forEach(function (id) {
            const el = document.getElementById(id);
            if (!el || !el.value.trim()) {
                if (el) el.style.borderColor = '#e05555';
                el && el.addEventListener('input', function () { el.style.borderColor = ''; }, { once: true });
                valid = false;
            }
        });
        if (!valid) return;

        const submitBtn = form.querySelector('[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled    = true;
        submitBtn.textContent = 'Sending…';

        try {
            const res = await fetch('https://api.web3forms.com/submit', {
                method:  'POST',
                body:    new FormData(form),
                headers: { 'Accept': 'application/json' }
            });

            const data = await res.json();

            if (res.ok && data.success) {
                wrap.style.display    = 'none';
                success.style.display = 'block';
            } else {
                alert(data.message || 'Something went wrong. Please try again or call 07890 484465.');
                submitBtn.disabled    = false;
                submitBtn.textContent = originalText;
            }
        } catch {
            alert('Could not send message. Please call 07890 484465 directly.');
            submitBtn.disabled    = false;
            submitBtn.textContent = originalText;
        }
    });
});
