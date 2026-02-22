(function() {
  "use strict";

  const includeSelector = "[data-include]";
  const includeTargets = Array.from(document.querySelectorAll(includeSelector));

  const loadInclude = async (target) => {
    const path = target.getAttribute("data-include");
    if (!path) return;

    const response = await fetch(path, { credentials: "same-origin" });
    if (!response.ok) {
      throw new Error(`Failed to load ${path}: ${response.status}`);
    }

    const html = await response.text();
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    target.replaceWith(template.content);
  };

  const setActiveNav = () => {
    const navLinks = document.querySelectorAll("#navmenu a");
    if (!navLinks.length) return;

    const current = window.location.pathname.split("/").pop() || "index.html";

    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (!href) return;

      const [linkPath, linkHash] = href.split("#");
      const normalizedPath = linkPath || current;

      const isSamePage = normalizedPath === current;
      const isHomeLink = current === "index.html" && href === "index.html";

      if ((isSamePage && !linkHash) || isHomeLink) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    });
  };

  const finalize = () => {
    window.__partialsLoaded = true;
    document.dispatchEvent(new CustomEvent("partials:loaded"));
    setActiveNav();
  };

  if (!includeTargets.length) {
    window.__partialsReady = Promise.resolve();
    finalize();
    return;
  }

  const readyPromise = Promise.all(includeTargets.map(loadInclude))
    .then(() => {
      finalize();
    })
    .catch((error) => {
      console.error(error);
      finalize();
    });

  window.__partialsReady = readyPromise;
})();
