(() => {
  const section = document.getElementById("speakers");
  const content = document.getElementById("speakersContent");
  if (!section || !content) return;

  const titleEl = section.querySelector(".section-title h2");
  const subtitleEl = section.querySelector(".section-title p");

  const escapeHtml = (value = "") =>
    String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const resolveAssetPath = (path) => {
    if (!path) return "";
    if (
      path.startsWith("/") ||
      path.startsWith("http://") ||
      path.startsWith("https://") ||
      path.startsWith("data:")
    ) {
      return path;
    }
    return `/${path}`;
  };

  const render = (data) => {
    const sessions = Array.isArray(data?.sessions) ? data.sessions : [];

    if (titleEl && data?.title) titleEl.textContent = data.title;
    if (subtitleEl && data?.subtitle) subtitleEl.textContent = data.subtitle;

    if (!sessions.length) {
      content.innerHTML =
        '<p class="text-muted">Speaker details will be announced soon.</p>';
      return;
    }

    content.innerHTML = sessions
      .map((session, sessionIndex) => {
        const speakers = Array.isArray(session?.speakers) ? session.speakers : [];
        const rowClass =
          sessionIndex === sessions.length - 1 ? "row g-4" : "row g-4 mb-5";

        return `
          <h3 class="h4 mb-4">${escapeHtml(session?.name || `Session ${sessionIndex + 1}`)}</h3>
          <div class="${rowClass}">
            ${speakers
              .map((speaker) => {
                const name = escapeHtml(speaker?.name || "Speaker");
                const title = escapeHtml(speaker?.title || "");
                const company = escapeHtml(speaker?.company || "");
                const image = resolveAssetPath(speaker?.image || "");
                const alt = escapeHtml(speaker?.alt || speaker?.name || "Speaker");

                return `
                  <div class="col-lg-3 col-md-6">
                    <div class="speaker-card h-100">
                      <div class="speaker-image">
                        <img src="${image}" alt="${alt}" class="img-fluid" loading="lazy" decoding="async" />
                      </div>
                      <div class="speaker-content">
                        <h4>${name}</h4>
                        <p class="speaker-title">${title}</p>
                        <p class="speaker-company">${company}</p>
                      </div>
                    </div>
                  </div>
                `;
              })
              .join("")}
          </div>
        `;
      })
      .join("");
  };

  fetch("/data/speakers.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load speakers: ${response.status}`);
      }
      return response.json();
    })
    .then(render)
    .catch((error) => {
      console.error(error);
      content.innerHTML =
        '<p class="text-danger">Unable to load speakers at the moment.</p>';
    });
})();
