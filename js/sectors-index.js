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

  const render = (sectors, projects) => {
    const entries = Object.entries(sectors || {});
    const projectCounts = Object.entries(projects || {}).reduce((acc, [key, list]) => {
      acc[key] = Array.isArray(list) ? list.length : 0;
      return acc;
    }, {});

    if (!entries.length) {
      grid.innerHTML = '<p class="text-muted">No sectors available at the moment.</p>';
      return;
    }

    grid.innerHTML = entries.map(([key, sector]) => {
      const name = sector?.name || key;
      const tagline = sector?.tagline || sector?.overview || '';
      const image = resolveAssetPath(sector?.heroImage);
      const link = `/sectors/${key}.html`;
      const baseStats = Array.isArray(sector?.stats) ? sector.stats.slice(0, 4) : [];
      if (baseStats.length < 4) {
        const projectCount = projectCounts[key];
        if (projectCount) {
          baseStats.push({ label: 'Projects', value: `${projectCount}+` });
        }
      }
      const stats = baseStats.slice(0, 4);

      return `
        <div class="col-12 col-md-6 col-lg-4">
          <a class="text-decoration-none text-reset" href="${link}" aria-label="View ${name} sector">
            <article class="card border-0 sector-card h-100">
              <div class="sector-media">
                <img src="${image}" loading="lazy" alt="${name}">
                <div class="sector-overlay"></div>
                <div class="sector-title-wrap">
                  <h3 class="sector-title">${name}</h3>
                </div>
              </div>
              <div class="card-body sector-body">
                <p class="sector-tagline">${tagline}</p>
                <div class="sector-stats">
                  ${stats
                    .map(
                      (stat) => `
                    <div class="sector-stat">
                      <span class="sector-stat-label">${stat.label}</span>
                      <span class="sector-stat-value">${stat.value}</span>
                    </div>
                  `,
                    )
                    .join('')}
                </div>
                <span class="btn btn-primary sector-action">View Projects <i class="bi bi-arrow-right"></i></span>
              </div>
            </article>
          </a>
        </div>
      `;
    }).join('');
  };

  Promise.all([fetch('/data/sectors.json'), fetch('/data/projects.json')])
    .then(([sectorsResponse, projectsResponse]) => {
      if (!sectorsResponse.ok) {
        throw new Error(`Failed to load sectors: ${sectorsResponse.status}`);
      }
      if (!projectsResponse.ok) {
        throw new Error(`Failed to load projects: ${projectsResponse.status}`);
      }
      return Promise.all([sectorsResponse.json(), projectsResponse.json()]);
    })
    .then(([sectors, projects]) => render(sectors, projects))
    .catch((error) => {
      console.error(error);
      grid.innerHTML = '<p class="text-danger">Unable to load sectors at the moment.</p>';
    });
})();
