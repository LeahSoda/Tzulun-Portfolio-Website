window.addEventListener("DOMContentLoaded", () => {
  console.log("[navbar] navbar.js running");

  const mount = document.getElementById("navbar-placeholder");
  if (!mount) {
    console.error("[navbar] #navbar-placeholder not found");
    return;
  }

  const inProjects = location.pathname.includes("/projects/");
  const prefix = inProjects ? "../" : "";

  // 1) Insert navbar HTML (hamburger + links + sidebar)
  mount.innerHTML = `
    <div class="navbar-wrap">
      <button id="menu-button" class="menu-button" aria-label="Menu" type="button">
        <span class="menu-line"></span>
        <span class="menu-line"></span>
        <span class="menu-line"></span>
      </button>

      <nav class="nav-bar" id="homepage-nav-bar">
        <a class="nav-bar-link" href="${prefix}index.html#projects">Projects</a>
        <a class="nav-bar-link" href="${prefix}cv.html">CV</a>
      </nav>

      <nav class="sidebar" id="sidebar" aria-label="Sidebar menu">
        <a href="${prefix}index.html#projects" data-anchor="projects">Projects</a>
        <a href="${prefix}cv.html">CV</a>
      </nav>
    </div>
  `;

  // 2) Hook up behaviors
  const menuButton = document.getElementById("menu-button");
  const sidebar = document.getElementById("sidebar");
  const links = sidebar.querySelectorAll("a");

  if (!menuButton || !sidebar) {
    console.error("[navbar] Missing #menu-button or #sidebar after insertion");
    return;
  }

  // open/close sidebar
  menuButton.addEventListener("click", (e) => {
    e.stopPropagation();
    sidebar.classList.toggle("show");
  });

  // close on outside click
  document.addEventListener("click", (e) => {
    if (!sidebar.contains(e.target) && !menuButton.contains(e.target)) {
      sidebar.classList.remove("show");
    }
  });

  // smooth scroll only when clicking in-page anchors on the same page
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href") || "";
      const isSamePageAnchor = href.startsWith("#") || href.includes("#");

      // If it’s an anchor on THIS page (e.g., index.html#projects when already on index)
      // we can smooth scroll; otherwise let browser navigate.
      const onHome =
        location.pathname.endsWith("/index.html") ||
        location.pathname === "/" ||
        location.pathname.endsWith("/Tzulun-Portfolio-Website/");

      if (onHome && href.startsWith("#")) {
        e.preventDefault();
        sidebar.classList.remove("show");
        const target = document.getElementById(href.slice(1));
        if (target) target.scrollIntoView({ behavior: "smooth" });
      } else {
        // navigate normally; also close sidebar for cleanliness
        sidebar.classList.remove("show");
      }
    });
  });

  console.log("[navbar] inserted ✅");
});



