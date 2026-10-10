
// Update Date
document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

// Set the duration here to control how long one section transition takes.
function initTimedSectionScroll() {
  if (
    document.body.classList.contains("project2-page") ||
    window.matchMedia("(pointer: coarse)").matches ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) return;

  const sections = Array.from(document.querySelectorAll("body:not(.project2-page) section.section"));
  if (sections.length < 2) return;

  const transitionDuration = 850;
  const root = document.documentElement;
  root.classList.add("timed-section-scroll");

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

    const section = sections[index];
    const currentTop = section.getBoundingClientRect().top;
    const startY = window.scrollY;
    const targetY = startY + currentTop;
    const distance = targetY - startY;
    const startTime = performance.now();

    const animate = (time) => {
      const progress = Math.min((time - startTime) / transitionDuration, 1);
      const eased = progress < 0.5
        ? 4 * progress ** 3
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      window.scrollTo(0, startY + distance * eased);

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(animate);
      } else {
        animationFrame = 0;
      }
    };

    animationFrame = window.requestAnimationFrame(animate);
    return true;
  };

  const moveSection = (direction, event) => {
    if (document.body.classList.contains("image-lightbox-open")) {
      event.preventDefault();
      return;
    }

    if (animationFrame) {
      event.preventDefault();
      return;
    }

    const currentIndex = getCurrentSectionIndex();
    if (currentIndex === -1) return;

    const currentSection = sections[currentIndex];
    const bounds = currentSection.getBoundingClientRect();
    const isAtSectionTop = bounds.top >= -2;
    const isAtSectionBottom = bounds.bottom <= window.innerHeight + 2;

    if ((direction > 0 && !isAtSectionBottom) || (direction < 0 && !isAtSectionTop)) return;

    if (scrollToSection(currentIndex + direction)) event.preventDefault();
  };

  window.addEventListener("wheel", (event) => {
    if (Math.abs(event.deltaY) < 12) return;
    moveSection(Math.sign(event.deltaY), event);
  }, { passive: false });

  window.addEventListener("keydown", (event) => {
    if (event.target.closest("input, textarea, select, [contenteditable='true']")) return;

    const direction = ["ArrowDown", "PageDown"].includes(event.key)
      ? 1
      : ["ArrowUp", "PageUp"].includes(event.key)
        ? -1
        : 0;

    if (direction) moveSection(direction, event);
  });
}

window.addEventListener("DOMContentLoaded", initTimedSectionScroll);

// Expand project 3 development thumbnails over a dimmed backdrop.
document.addEventListener("DOMContentLoaded", () => {
  const thumbnails = document.querySelectorAll("#project-development .dev-thumb img");
  if (!thumbnails.length) return;

  const lightbox = document.createElement("div");
  const imageContent = document.createElement("figure");
  const expandedImage = document.createElement("img");
  const expandedCaption = document.createElement("figcaption");
  const closeButton = document.createElement("button");

  lightbox.className = "image-lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "Expanded development image");
  lightbox.hidden = true;

  imageContent.className = "image-lightbox__content";
  expandedImage.className = "image-lightbox__image";
  expandedCaption.className = "image-lightbox__caption";
  closeButton.className = "image-lightbox__close";
  closeButton.type = "button";
  closeButton.textContent = "Close";
  closeButton.setAttribute("aria-label", "Close expanded image");

  imageContent.append(expandedImage, expandedCaption);
  lightbox.append(imageContent, closeButton);
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

  thumbnails.forEach((thumbnail) => {
    thumbnail.tabIndex = 0;
    thumbnail.setAttribute("role", "button");
    thumbnail.setAttribute("aria-haspopup", "dialog");
    thumbnail.setAttribute("aria-expanded", "false");

    const openLightbox = () => {
      activeThumbnail = thumbnail;
      expandedImage.src = thumbnail.currentSrc || thumbnail.src;
      expandedImage.alt = thumbnail.alt;
      const sourceCaption = thumbnail.closest("figure")?.querySelector("figcaption, .dev-caption");
      expandedCaption.textContent = sourceCaption?.textContent.trim() || thumbnail.alt;
      thumbnail.setAttribute("aria-expanded", "true");
      lightbox.hidden = false;
      document.body.classList.add("image-lightbox-open");
      closeButton.focus();
    };

    thumbnail.addEventListener("click", openLightbox);
    thumbnail.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox();
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