
// Update Date
document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

// Set this duration in milliseconds to adjust desktop section transitions.
function initTimedSectionScroll() {
  if (
    document.body.classList.contains("project2-page") ||
    window.matchMedia("(pointer: coarse)").matches ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) return;

  const sections = Array.from(document.querySelectorAll("body:not(.project2-page) > section.section"));
  if (sections.length < 2) return;

  const transitionDuration = 850;
  document.documentElement.classList.add("timed-section-scroll");
  let animationFrame = 0;

  const getCurrentSectionIndex = () => {
    const activeIndex = sections.findIndex((section) => {
      const bounds = section.getBoundingClientRect();
      return bounds.top <= 1 && bounds.bottom > 1;
    });
    if (activeIndex !== -1) return activeIndex;
    return sections.findIndex((section) => section.getBoundingClientRect().top > 1);
  };

  const scrollToSection = (index) => {
    if (animationFrame || index < 0 || index >= sections.length) return false;

    const startY = window.scrollY;
    const distance = sections[index].getBoundingClientRect().top;
    const startTime = performance.now();

    const animate = (time) => {
      const progress = Math.min((time - startTime) / transitionDuration, 1);
      const eased = progress < 0.5
        ? 4 * progress ** 3
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      window.scrollTo(0, startY + distance * eased);

      if (progress < 1) animationFrame = window.requestAnimationFrame(animate);
      else animationFrame = 0;
    };

    animationFrame = window.requestAnimationFrame(animate);
    return true;
  };

  const moveSection = (direction, event) => {
    if (document.body.classList.contains("image-lightbox-open")) return;
    if (animationFrame) {
      event.preventDefault();
      return;
    }

    const currentIndex = getCurrentSectionIndex();
    if (currentIndex < 0) return;

    const bounds = sections[currentIndex].getBoundingClientRect();
    const isAtTop = bounds.top >= -2;
    const isAtBottom = bounds.bottom <= window.innerHeight + 2;
    if ((direction > 0 && !isAtBottom) || (direction < 0 && !isAtTop)) return;

    if (scrollToSection(currentIndex + direction)) event.preventDefault();
  };

  window.addEventListener("wheel", (event) => {
    if (Math.abs(event.deltaY) >= 12) moveSection(Math.sign(event.deltaY), event);
  }, { passive: false });

  window.addEventListener("keydown", (event) => {
    const target = event.target;
    if (target instanceof Element && target.closest("input, textarea, select, [contenteditable='true']")) return;

    const direction = ["ArrowDown", "PageDown"].includes(event.key)
      ? 1
      : ["ArrowUp", "PageUp"].includes(event.key)
        ? -1
        : 0;
    if (direction) moveSection(direction, event);
  });
}

window.addEventListener("DOMContentLoaded", initTimedSectionScroll);

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

// Expand project 3 development images over a dimmed backdrop.
document.addEventListener("DOMContentLoaded", () => {
  const thumbnails = document.querySelectorAll("#project-development .dev-thumb img");
  if (!thumbnails.length) return;

  const lightbox = document.createElement("div");
  const content = document.createElement("figure");
  const expandedImage = document.createElement("img");
  const caption = document.createElement("figcaption");
  const closeButton = document.createElement("button");

  lightbox.className = "image-lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "Expanded development image");
  lightbox.hidden = true;

  content.className = "image-lightbox__content";
  expandedImage.className = "image-lightbox__image";
  caption.className = "image-lightbox__caption";
  closeButton.className = "image-lightbox__close";
  closeButton.type = "button";
  closeButton.textContent = "Close";
  closeButton.setAttribute("aria-label", "Close expanded image");
  content.append(expandedImage, caption);
  lightbox.append(content, closeButton);
  document.body.appendChild(lightbox);

  let activeThumbnail = null;

  const closeLightbox = () => {
    if (lightbox.hidden) return;
    lightbox.hidden = true;
    document.body.classList.remove("image-lightbox-open");
    activeThumbnail?.setAttribute("aria-expanded", "false");
    activeThumbnail?.focus();
    activeThumbnail = null;
  };

  const openLightbox = (thumbnail) => {
    activeThumbnail = thumbnail;
    expandedImage.src = thumbnail.currentSrc || thumbnail.src;
    expandedImage.alt = thumbnail.alt;
    const sourceCaption = thumbnail.closest("figure")?.querySelector("figcaption, .dev-caption");
    caption.textContent = sourceCaption?.textContent.trim() || thumbnail.alt;
    thumbnail.setAttribute("aria-expanded", "true");
    lightbox.hidden = false;
    document.body.classList.add("image-lightbox-open");
    closeButton.focus();
  };

  thumbnails.forEach((thumbnail) => {
    thumbnail.tabIndex = 0;
    thumbnail.setAttribute("role", "button");
    thumbnail.setAttribute("aria-haspopup", "dialog");
    thumbnail.setAttribute("aria-expanded", "false");
    thumbnail.addEventListener("click", () => openLightbox(thumbnail));
    thumbnail.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(thumbnail);
      }
    });
  });

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox || event.target === expandedImage || event.target === closeButton) {
      closeLightbox();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeLightbox();
  });
});