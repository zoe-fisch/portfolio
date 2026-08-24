(function () {
  const root = document.documentElement;
  const toggle = document.querySelector('[data-theme-toggle]');
  const storedTheme = window.localStorage.getItem('theme');
  let theme =
    storedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  function renderTheme() {
    root.setAttribute('data-theme', theme);
    if (!toggle) return;
    toggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    toggle.innerHTML =
      theme === 'dark'
        ? '<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
        : '<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }

  renderTheme();
  toggle?.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    window.localStorage.setItem('theme', theme);
    renderTheme();
  });
})();

(function () {
  const cards = document.querySelectorAll('[data-tilt]');
  if (!cards.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  cards.forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${y * -3}deg) rotateY(${x * 4}deg) translateY(-3px)`;
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });
})();

(function () {
  const controls = document.querySelector('[data-video-controls]');
  const video = controls?.previousElementSibling?.querySelector('video');
  if (!controls || !video) return;

  const toggle = controls.querySelector('[data-video-toggle]');
  const progress = controls.querySelector('[data-video-progress]');
  const current = controls.querySelector('[data-video-current]');
  const duration = controls.querySelector('[data-video-duration]');

  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${Math.floor(seconds % 60).toString().padStart(2, '0')}`;
  };

  const renderPlayback = () => {
    const isPlaying = !video.paused && !video.ended;
    toggle.textContent = isPlaying ? '❚❚' : '▶';
    toggle.setAttribute('aria-label', isPlaying ? 'Pause video' : 'Play video');
  };

  const renderTime = () => {
    current.textContent = formatTime(video.currentTime);
    duration.textContent = formatTime(video.duration);
    progress.value = video.duration ? String((video.currentTime / video.duration) * 100) : '0';
  };

  toggle.addEventListener('click', () => {
    if (video.paused || video.ended) video.play();
    else video.pause();
  });
  progress.addEventListener('input', () => {
    if (video.duration) video.currentTime = (Number(progress.value) / 100) * video.duration;
  });
  video.addEventListener('loadedmetadata', renderTime);
  video.addEventListener('timeupdate', renderTime);
  video.addEventListener('play', renderPlayback);
  video.addEventListener('pause', renderPlayback);
  video.addEventListener('ended', renderPlayback);
  renderPlayback();
})();
