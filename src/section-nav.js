document.addEventListener("DOMContentLoaded", () => {
  const sections = Array.from(document.querySelectorAll("body > section.section"));
  if (sections.length < 2) return;

  const nav = document.createElement("nav");
  nav.className = "section-nav";
  nav.setAttribute("aria-label", "Page sections");

  const list = document.createElement("ol");
  const buttons = sections.map((section, index) => {
    const heading = section.querySelector("h1, h2, h3");
    const label = heading?.textContent.trim().replace(/\s+/g, " ") || `Section ${index + 1}`;
    const item = document.createElement("li");
    const button = document.createElement("button");
    const dot = document.createElement("span");

    button.type = "button";
    button.className = "section-nav__button";
    button.setAttribute("aria-label", `Go to ${label}`);
    button.title = label;
    button.dataset.label = label;

    dot.className = "section-nav__dot";
    dot.setAttribute("aria-hidden", "true");
    button.appendChild(dot);
    button.addEventListener("click", () => {
      section.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start"
      });
    });

    item.appendChild(button);
    list.appendChild(item);
    return button;
  });

  nav.appendChild(list);
  document.body.appendChild(nav);

  let updateFrame = 0;
  const updateActiveSection = () => {
    updateFrame = 0;
    const viewportCenter = window.innerHeight / 2;
    let activeIndex = sections.findIndex((section) => {
      const bounds = section.getBoundingClientRect();
      return bounds.top <= viewportCenter && bounds.bottom > viewportCenter;
    });

    if (activeIndex === -1) {
      activeIndex = sections.reduce((nearestIndex, section, index) => {
        const distance = Math.abs(section.getBoundingClientRect().top - viewportCenter);
        const nearestDistance = Math.abs(sections[nearestIndex].getBoundingClientRect().top - viewportCenter);
        return distance < nearestDistance ? index : nearestIndex;
      }, 0);
    }

    buttons.forEach((button, index) => {
      if (index === activeIndex) {
        button.classList.add("is-active");
        button.setAttribute("aria-current", "step");
      } else {
        button.classList.remove("is-active");
        button.removeAttribute("aria-current");
      }
    });
  };

  const scheduleActiveSectionUpdate = () => {
    if (!updateFrame) updateFrame = window.requestAnimationFrame(updateActiveSection);
  };

  window.addEventListener("scroll", scheduleActiveSectionUpdate, { passive: true });
  window.addEventListener("resize", scheduleActiveSectionUpdate);
  updateActiveSection();
});