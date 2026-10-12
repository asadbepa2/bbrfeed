/* Aslam Local Visibility — script.js
   Small by design: no libraries, nothing blocks rendering. */
(() => {
  'use strict';

  /* 1. If a Cloudinary image fails to load, show a labelled placeholder
        instead of a broken-image icon. */
  document.querySelectorAll('.ph img, .video-play img').forEach((img) => {
    const fail = () => img.parentElement.classList.add('img-failed');
    if (img.complete && img.naturalWidth === 0) {
      fail();
    } else {
      img.addEventListener('error', fail, { once: true });
    }
  });

  /* 2. Click-to-play videos. The YouTube player only loads after a click,
        which keeps the page fast (Core Web Vitals). */
  document.querySelectorAll('[data-yt]').forEach((box) => {
    const button = box.querySelector('.video-play');
    if (!button) return;

    button.addEventListener('click', () => {
      const id = box.dataset.yt || '';

      // Placeholder IDs: show a note instead of a broken player.
      if (!id || id.indexOf('YOUTUBE_ID') === 0) {
        const msg = box.querySelector('.video-msg');
        if (msg) msg.hidden = false;
        return;
      }

      const frame = document.createElement('iframe');
      frame.src = 'https://www.youtube-nocookie.com/embed/' +
        encodeURIComponent(id) + '?autoplay=1&rel=0';
      frame.title = box.dataset.title || 'Video';
      frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      frame.allowFullscreen = true;
      frame.referrerPolicy = 'strict-origin-when-cross-origin';
      box.replaceChildren(frame);
    });
  });

  /* 3. Contact form (Static Forms). Sent with fetch so visitors get clear
        feedback. Without JavaScript the form still posts normally and
        Static Forms redirects back to /contact/?sent=true. */
  const form = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  const errorBox = document.getElementById('form-error');
  const CAL_URL = 'https://cal.com/mdaslam';

  // Fallback path: redirected back after a normal (no-JS) submission.
  if (success && !form.hidden && /[?&]sent=true/.test(window.location.search)) {
    form.hidden = true;
    success.hidden = false;
    success.focus();
  }

  if (form) {
    form.noValidate = true; // we show our own, friendlier messages
    const submitBtn = form.querySelector('button[type="submit"]');
    const rules = {
      name: (v) => (v.trim().length >= 2 ? '' : 'Please enter your name.'),
      email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
        ? '' : 'Please enter a valid email address, like name@example.com.'),
      message: (v) => (v.trim().length >= 10
        ? '' : 'Please add a few words about what you would like help with.')
    };

    const check = (field) => {
      const input = form.elements[field];
      const note = document.getElementById(field + '-error');
      const text = rules[field](input.value);
      note.textContent = text;
      note.hidden = !text;
      input.setAttribute('aria-invalid', text ? 'true' : 'false');
      return !text;
    };

    Object.keys(rules).forEach((field) => {
      const input = form.elements[field];
      input.addEventListener('blur', () => check(field));
      input.addEventListener('input', () => {
        if (input.getAttribute('aria-invalid') === 'true') check(field);
      });
    });

    const showError = (text) => {
      errorBox.textContent = text + ' ';
      const link = document.createElement('a');
      link.href = CAL_URL;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = 'Book a time directly instead.';
      errorBox.appendChild(link);
      errorBox.hidden = false;
    };

    const setLoading = (on) => {
      submitBtn.disabled = on;
      submitBtn.classList.toggle('is-loading', on);
      submitBtn.textContent = on ? 'Sending' : 'Send Message';
      form.setAttribute('aria-busy', on ? 'true' : 'false');
    };

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      errorBox.hidden = true;

      const results = Object.keys(rules).map((f) => [f, check(f)]);
      const firstBad = results.find((r) => !r[1]);
      if (firstBad) { form.elements[firstBad[0]].focus(); return; }

      // Honeypot filled in = bot. Pretend it worked.
      if (form.elements.honeypot && form.elements.honeypot.value) {
        form.hidden = true; success.hidden = false; return;
      }

      const data = Object.fromEntries(new FormData(form).entries());
      delete data.redirectTo; // only used by the no-JS fallback

      setLoading(true);
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 15000);

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(data),
          signal: controller.signal
        });
        let body = null;
        try { body = await res.json(); } catch (e) { /* no JSON body */ }

        if (res.ok && !(body && body.success === false)) {
          document.getElementById('success-name').textContent = data.name.trim();
          document.getElementById('success-email').textContent = data.email.trim();
          form.hidden = true;
          success.hidden = false;
          success.focus();
          return;
        }

        console.error('Static Forms error', res.status, body);
        if (res.status === 429) {
          showError('Too many messages were sent just now. Please wait a few minutes and try again.');
        } else if (res.status === 400) {
          showError('Something in the form was not accepted. Please check your details and try again.');
        } else if (res.status === 401 || res.status === 403) {
          showError('The message service is not accepting messages right now.');
        } else {
          showError('Your message could not be sent.');
        }
      } catch (err) {
        showError('Your message could not be sent. Please check your connection and try again.');
      } finally {
        clearTimeout(timer);
        setLoading(false);
      }
    });
  }
})();
