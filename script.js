const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');
const navLinks = [...navigation.querySelectorAll('a[href^="#"]')];
const navSections = navLinks.map((link) => document.querySelector(link.getAttribute('href')));
let preferredId = location.hash.slice(1);
let updateScheduled = false;

function closeMenu() {
  navigation.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.textContent = 'Menu';
}

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.textContent = isOpen ? 'Menu' : 'Close';
  navigation.classList.toggle('open', !isOpen);
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navigation.classList.contains('open')) {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener('click', (event) => {
  const anchor = event.target.closest('a[href^="#"]');
  if (anchor) {
    preferredId = anchor.getAttribute('href').slice(1);
    closeMenu();
    scheduleUpdate();
  } else if (!event.target.closest('.site-header')) {
    closeMenu();
  }
});

function updateActiveLink() {
  const positions = navSections.map((section, index) => ({
    index, id: section.id, top: section.getBoundingClientRect().top
  }));
  const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
  const candidates = atBottom ? positions : positions.filter((item) => item.top <= 150);
  const nearestTop = Math.max(...candidates.map((item) => item.top));
  // Keep the selected anchor when two sections share a desktop row.
  const row = candidates.filter((item) => Math.abs(item.top - nearestTop) < 4);
  const active = row.find((item) => item.id === preferredId) || row[0] || positions[0];
  navLinks.forEach((link, index) => {
    link.classList.toggle('active', index === active.index);
    if (index === active.index) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  updateScheduled = false;
}

function scheduleUpdate() {
  if (!updateScheduled) {
    updateScheduled = true;
    requestAnimationFrame(updateActiveLink);
  }
}
window.addEventListener('scroll', scheduleUpdate, { passive: true });
window.addEventListener('resize', scheduleUpdate);
window.addEventListener('hashchange', () => {
  preferredId = location.hash.slice(1);
  scheduleUpdate();
});
document.querySelectorAll('details').forEach((details) => details.addEventListener('toggle', scheduleUpdate));
updateActiveLink();
document.querySelector('#year').textContent = new Date().getFullYear();
