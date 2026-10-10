document.addEventListener("DOMContentLoaded", () => {
  const sections = Array.from(document.querySelectorAll("body > section.section"));
  const targets = sections.map((section, index) => {
    const heading = section.querySelector("h1, h2, h3");
    return {
      element: section,
      label: heading?.textContent.trim().replace(/\s+/g, " ") || `Section ${index + 1}`
    };
  });

  const homepage = document.getElementById("homepage");
  if (homepage && !sections.some((section) => section.contains(homepage))) {
    targets.unshift({ element: homepage, label: "Home" });
  }

  if (targets.length < 2) {
    const footer = document.querySelector("body > footer");
    if (footer && !targets.some((target) => target.element === footer)) {
      targets.push({ element: footer, label: "Footer" });
    }
  }

  if (targets.length < 2) return;

  const nav = document.createElement("nav");
  const list = document.createElement("ol");
  const buttons = targets.map(({ element, label }) => {
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
      element.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start"
      });
    });

    item.appendChild(button);
    list.appendChild(item);
    return button;
  });

  nav.className = "section-nav";
  nav.setAttribute("aria-label", "Page sections");
  nav.appendChild(list);
  document.body.appendChild(nav);

  let frame = 0;
  const updateActiveSection = () => {
    frame = 0;
    const viewportCenter = window.innerHeight / 2;
    let activeIndex = targets.findIndex(({ element }) => {
      const bounds = element.getBoundingClientRect();
      return bounds.top <= viewportCenter && bounds.bottom > viewportCenter;
    });

    if (activeIndex === -1) {
      activeIndex = targets.reduce((closestIndex, { element }, index) => {
        const distance = Math.abs(element.getBoundingClientRect().top - viewportCenter);
        const closestDistance = Math.abs(targets[closestIndex].element.getBoundingClientRect().top - viewportCenter);
        return distance < closestDistance ? index : closestIndex;
      }, 0);
    }

    buttons.forEach((button, index) => {
      button.classList.toggle("is-active", index === activeIndex);
      if (index === activeIndex) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
    });
  };

  const scheduleUpdate = () => {
    if (!frame) frame = window.requestAnimationFrame(updateActiveSection);
  };

  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate);
  updateActiveSection();
});