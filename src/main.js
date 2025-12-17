
// Update Date
document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

// Section enter scrolling animation
document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".section");
  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  sections.forEach((section) => observer.observe(section));
});

// Scroll to anchor if URL has a hash
window.addEventListener("DOMContentLoaded", () => {
  if (!window.location.hash) return;

  const targetId = window.location.hash.substring(1);
  const targetSection = document.getElementById(targetId);
  if (!targetSection) return;

  setTimeout(() => {
    targetSection.scrollIntoView({ behavior: "smooth" });
  }, 100);
});

// Homepage scroll (only if #homepage exists)
window.addEventListener("load", () => {
  if (window.location.hash) return;

  const element = document.getElementById("homepage");
  if (element) element.scrollIntoView({ behavior: "auto" });
});