(() => {
  const grid = document.getElementById('sectorsGrid');
  if (!grid) return;

  const resolveAssetPath = (path) => {
    if (!path) return '';
    if (path.startsWith('/') || path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
      return path;
    }
    return `/${path}`;
  };

  const render = (sectors) => {
    const entries = Object.entries(sectors || {});

    if (!entries.length) {
      grid.innerHTML = '<p class="text-muted">No sectors available at the moment.</p>';
      return;
    }

    grid.innerHTML = entries.map(([key, sector]) => {
      const name = sector?.name || key;
      const tagline = sector?.tagline || sector?.overview || '';
      const image = resolveAssetPath(sector?.heroImage);
      const link = `/sectors/${key}.html`;

      return `
        <div class="col-12 col-md-6 col-lg-4">
          <a class="text-decoration-none text-reset" href="${link}" aria-label="View ${name} sector">
            <article class="card border-0 shadow-sm sector-card h-100">
              <div class="sector-img">
                <img src="${image}" loading="lazy" alt="${name}">
                <div class="sector-overlay"></div>
                <h3 class="sector-title">${name}</h3>
              </div>
              <div class="card-body">
                <p class="text-muted mb-3">${tagline}</p>
                <span class="btn btn-sm btn-outline-primary">View sector <i class="bi bi-arrow-right-short"></i></span>
              </div>
            </article>
          </a>
        </div>
      `;
    }).join('');
  };

  fetch('/data/sectors.json')
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load sectors: ${response.status}`);
      }
      return response.json();
    })
    .then(render)
    .catch((error) => {
      console.error(error);
      grid.innerHTML = '<p class="text-danger">Unable to load sectors at the moment.</p>';
    });
})();
