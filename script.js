(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const header = document.querySelector('.site-header');
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  const closeMenu = () => {
    if (!menu || !nav) return;
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Open navigation');
    nav.classList.remove('open');
  };
  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    nav.classList.toggle('open', open);
  });
  nav?.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  window.matchMedia('(min-width: 821px)').addEventListener('change', closeMenu);
  const links = [...document.querySelectorAll('.site-nav a[href^="#"]')];
  const sections = links.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  let scrollFrame = 0;
  const updateNavigation = () => {
    scrollFrame = 0;
    header?.classList.toggle('scrolled', window.scrollY > 20);
    const current = [...sections].reverse().find(section => section.getBoundingClientRect().top <= 170);
    links.forEach(link => {
      const active = current && link.getAttribute('href') === '#' + current.id;
      link.classList.toggle('active', Boolean(active));
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };
  window.addEventListener('scroll', () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateNavigation); }, { passive: true });
  updateNavigation();

  // Keep content readable without JavaScript or when reduced motion is enabled.
  const revealTargets = [...document.querySelectorAll('[data-reveal]')];
  let revealObserver;
  const configureReveals = () => {
    revealObserver?.disconnect();
    revealTargets.forEach(element => element.classList.remove('reveal-ready', 'is-visible'));
    if (reducedMotion.matches || !('IntersectionObserver' in window)) return;
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.target.classList.toggle('is-visible', entry.isIntersecting));
    }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });
    revealTargets.forEach(element => {
      const bounds = element.getBoundingClientRect();
      element.classList.add('reveal-ready');
      element.classList.toggle('is-visible', bounds.top < window.innerHeight && bounds.bottom > 0);
      revealObserver.observe(element);
    });
  };
  configureReveals();
  reducedMotion.addEventListener('change', configureReveals);

  const canvas = document.getElementById('network-canvas');
  const context = canvas?.getContext('2d');
  if (!context) return;
  const visual = canvas.parentElement;
  let width = 0, height = 0, frame = 0, visible = true;
  const resize = () => {
    const bounds = canvas.getBoundingClientRect();
    width = bounds.width; height = bounds.height;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    draw(performance.now());
  };
  const draw = time => {
    context.clearRect(0, 0, width, height);
    const t = reducedMotion.matches ? 0 : time / 1000;
    const nodes = [...visual.querySelectorAll('.system-node')].map(node => ({
      x: node.offsetLeft + node.offsetWidth / 2, y: node.offsetTop + node.offsetHeight / 2
    }));
    nodes.slice(0, -1).forEach((node, index) => {
      const next = nodes[index + 1];
      context.strokeStyle = 'rgba(244,178,58,.55)';
      context.lineWidth = 1;
      context.beginPath(); context.moveTo(node.x, node.y);
      context.lineTo(next.x, node.y); context.lineTo(next.x, next.y); context.stroke();
      const distance = Math.abs(next.x - node.x) + Math.abs(next.y - node.y);
      const travelled = ((t * 25 + index * 80) % distance);
      const horizontal = Math.abs(next.x - node.x);
      const x = travelled < horizontal ? node.x + Math.sign(next.x - node.x) * travelled : next.x;
      const y = travelled < horizontal ? node.y : node.y + Math.sign(next.y - node.y) * (travelled - horizontal);
      context.fillStyle = '#ffc55c';
      context.beginPath(); context.arc(x, y, 2.8, 0, Math.PI * 2); context.fill();
    });
    for (let i = 0; i < 16; i++) {
      const x = width * (.12 + ((i * 37) % 83) / 100);
      const y = height * (.16 + ((i * 23) % 67) / 100) + Math.sin(t * .4 + i) * 3;
      context.fillStyle = i % 3 ? 'rgba(244,178,58,.28)' : '#f4b23a';
      context.fillRect(x, y, 2, 2);
    }
  };
  const animate = time => {
    frame = 0;
    draw(time);
    if (visible && !document.hidden && !reducedMotion.matches) frame = requestAnimationFrame(animate);
  };
  const syncAnimation = () => {
    cancelAnimationFrame(frame); frame = 0;
    draw(performance.now());
    if (visible && !document.hidden && !reducedMotion.matches) frame = requestAnimationFrame(animate);
  };
  new ResizeObserver(resize).observe(visual);
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; syncAnimation(); }).observe(visual);
  document.addEventListener('visibilitychange', syncAnimation);
  reducedMotion.addEventListener('change', syncAnimation);
  resize(); syncAnimation();
})();
