const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.primary-nav');
if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
  });
  nav.addEventListener('click', event => {
    if (event.target.closest('a')) {
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    }
  });
}

const intro = document.getElementById('intro-screen');
if (intro) {
  const enter = document.getElementById('intro-skip');
  const replay = document.getElementById('intro-replay');
  let timer;
  let returnFocus;
  const close = () => {
    clearTimeout(timer);
    intro.classList.add('is-exiting');
    setTimeout(() => {
      intro.hidden = true;
      document.body.classList.remove('no-scroll');
      document.querySelector('main').inert = false;
      document.querySelector('.site-header').inert = false;
      document.querySelector('.floating-directory').inert = false;
      document.body.classList.remove('intro-active');
      returnFocus?.focus?.({preventScroll:true});
    }, 450);
  };
  const open = () => {
    clearTimeout(timer);
    returnFocus = document.activeElement;
    intro.hidden = false;
    intro.classList.remove('is-exiting');
    document.body.classList.add('no-scroll');
    document.querySelector('main').inert = true;
    document.querySelector('.site-header').inert = true;
    document.querySelector('.floating-directory').inert = true;
    document.body.classList.add('intro-active');
    enter.focus({preventScroll:true});
    timer = setTimeout(close, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 1500 : 3200);
  };
  enter.addEventListener('click', close);
  intro.addEventListener('keydown', event => { if (event.key === 'Escape') close(); });
  replay?.addEventListener('click', open);
  open();
}

const dialog = document.getElementById('video-dialog');
if (dialog) {
  const video = document.getElementById('project-video');
  const closeButton = document.getElementById('video-close');
  const download = document.getElementById('video-download');
  let previousFocus;
  const closeVideo = () => {
    video.pause();
    video.removeAttribute('src');
    video.load();
    dialog.hidden = true;
    document.body.classList.remove('no-scroll');
    previousFocus?.focus?.({preventScroll:true});
  };
  document.querySelectorAll('.video-trigger').forEach(button => button.addEventListener('click', () => {
    previousFocus = button;
    const src = button.dataset.video;
    document.getElementById('video-title').textContent = button.dataset.title;
    document.getElementById('video-description').textContent = button.dataset.description;
    video.src = src;
    video.poster = button.querySelector('img')?.src || '';
    download.href = src;
    dialog.hidden = false;
    document.body.classList.add('no-scroll');
    closeButton.focus();
    video.play().catch(() => {});
  }));
  closeButton.addEventListener('click', closeVideo);
  dialog.addEventListener('click', event => { if (event.target === dialog) closeVideo(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !dialog.hidden) closeVideo(); });
}

// The front photograph starts with the certificate portrait. Select a card,
// use the arrows, or scroll/swipe within the stack to bring another forward.
const photoStack = document.getElementById('photo-stack');
if (photoStack) {
  const cards = [...photoStack.querySelectorAll('.photo-card')];
  const labels = ['证件照', '肖像照', '生活照'];
  let activePhoto = 0;
  let lastWheel = 0;
  let wheelDistance = 0;
  let touchStart;
  let ignoreClickUntil = 0;
  const selectPhoto = index => {
    activePhoto = (index + cards.length) % cards.length;
    cards.forEach((card, i) => {
      card.dataset.depth = String((i - activePhoto + cards.length) % cards.length);
      card.setAttribute('aria-pressed', String(i === activePhoto));
    });
    document.getElementById('photo-caption').textContent =
      `0${activePhoto + 1} / 03 · ${labels[activePhoto]}`;
  };
  cards.forEach((card, i) => card.addEventListener('click', () => {
    if (Date.now() < ignoreClickUntil) return;
    selectPhoto(i === activePhoto ? activePhoto + 1 : i);
  }));
  document.getElementById('photo-prev').addEventListener('click', () => selectPhoto(activePhoto - 1));
  document.getElementById('photo-next').addEventListener('click', () => selectPhoto(activePhoto + 1));
  photoStack.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    selectPhoto(activePhoto + (event.key === 'ArrowRight' ? 1 : -1));
  });
  photoStack.addEventListener('wheel', event => {
    if (event.ctrlKey || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
    event.preventDefault();
    const now = Date.now();
    if (now - lastWheel < 500) return;
    wheelDistance += event.deltaY;
    if (Math.abs(wheelDistance) < 35) return;
    selectPhoto(activePhoto + Math.sign(wheelDistance));
    wheelDistance = 0;
    lastWheel = now;
  }, {passive: false});
  photoStack.addEventListener('touchstart', event => {
    const touch = event.touches[0];
    touchStart = {x: touch.clientX, y: touch.clientY};
  }, {passive: true});
  photoStack.addEventListener('touchend', event => {
    if (!touchStart) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - touchStart.x;
    const dy = touch.clientY - touchStart.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      selectPhoto(activePhoto + (dx < 0 ? 1 : -1));
      ignoreClickUntil = Date.now() + 500;
    }
    touchStart = undefined;
  }, {passive: true});
}

const directory = document.querySelector('.floating-directory');
if (directory) {
  const links = [...directory.querySelectorAll('.directory-pills a')];
  const sections = links.map(link => document.querySelector(link.getAttribute('href')));
  let scheduled = false;
  const updateDirectory = () => {
    const marker = Math.min(window.innerHeight * .3, 200);
    let current = 0;
    sections.forEach((section, i) => {
      if (section.getBoundingClientRect().top <= marker) current = i;
    });
    links.forEach((link, i) => {
      if (i === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    scheduled = false;
  };
  window.addEventListener('scroll', () => {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(updateDirectory);
    }
  }, {passive: true});
  updateDirectory();
}
