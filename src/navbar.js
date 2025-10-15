
// This script is loaded after navbar HTML is inserted, so elements exist
const menuButton = document.getElementById('menu-button');
const sidebar = document.getElementById('sidebar');
const links = document.querySelectorAll('#sidebar a');

//Set correct anchor links depending on current page
const isHome = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname === '/Tzulun-Portfolio-Website/';
document.querySelectorAll('#sidebar a[data-anchor]').forEach(link => {
  const anchor = link.getAttribute('data-anchor');
  if (isHome) {
    link.setAttribute('href', `#${anchor}`);
  } else {
    link.setAttribute('href', `../index.html#${anchor}`);
  }
});


// Side bar menu - open/close
menuButton.addEventListener('click', (e) => {
  e.stopPropagation();
  sidebar.classList.toggle('show');
});

// Close sidebar when clicking outside of it
document.addEventListener('click', (e) => {
  if (!sidebar.contains(e.target) && !menuButton.contains(e.target)) {
    sidebar.classList.remove('show');
  }
});

// Scroll + close sidebar after clicking a link
links.forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    // Only handle in-page anchors (on homepage)
    if (href.startsWith('#')) {
      e.preventDefault();
      sidebar.classList.remove('show');
      const targetId = href.substring(1);
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        window.scrollTo({
          top: targetSection.offsetTop,
          behavior: 'smooth'
        });
      }
    }
    // For ../index.html#anchor, let the browser handle it (no preventDefault)
  });
});








