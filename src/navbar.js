
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
        <a class="nav-bar-link" href="${prefix}about.html">About</a>
        <a class="nav-bar-link" href="${prefix}Doc/Tzulun_Huang_CV.pdf">CV</a>
      </nav>

      <nav class="sidebar" id="sidebar" aria-label="Sidebar menu">
        <a href="${prefix}index.html#projects" data-anchor="projects">Projects</a>
        <a href="${prefix}about.html">About</a>
        <a href="${prefix}Doc/Tzulun_Huang_CV.pdf">CV</a>
      </nav>
    </div>
  `;

  // 2) Set active state based on current page
  const currentPath = location.pathname;
  const navBarLinks = document.querySelectorAll(".nav-bar-link");
  
  navBarLinks.forEach(link => {
    const href = link.getAttribute("href");
    
    // Check if current page matches the link
    if ((currentPath.includes("about.html") && href.includes("about.html")) ||
        (currentPath.includes("CV.pdf") && href.includes("CV.pdf")) ||
        ((currentPath.endsWith("/index.html") || currentPath === "/" || currentPath.includes("index.html")) && href.includes("index.html#projects"))) {
      link.classList.add("active");
    }
  });

  // 3) Hook up behaviors
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

  // Also handle clicks for top navigation links
  const topNavLinks = document.querySelectorAll(".nav-bar-link");
  console.log("[navbar] Found top nav links:", topNavLinks.length);
  
  topNavLinks.forEach((link, index) => {
    const href = link.getAttribute("href") || "";
    console.log(`[navbar] Top nav link ${index}: ${href}`);
    
    link.addEventListener("click", (e) => {
      console.log(`[navbar] Clicked top nav link: ${href}`);
      
      // For regular navigation (like about.html), let browser navigate normally
      // Only special handling needed for same-page anchors
      const onHome =
        location.pathname.endsWith("/index.html") ||
        location.pathname === "/" ||
        location.pathname.endsWith("/Tzulun-Portfolio-Website/");

      if (onHome && href.startsWith("#")) {
        e.preventDefault();
        const target = document.getElementById(href.slice(1));
        if (target) target.scrollIntoView({ behavior: "smooth" });
      }
      // For other links (about.html, CV), let browser handle normally
    });
  });

  console.log("[navbar] inserted ✅");
});



