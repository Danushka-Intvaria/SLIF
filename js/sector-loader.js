(async function initSectorPage() {
  const app = document.getElementById('sectorApp');
  if (!app) return;

  try {
    const [templateRes, sectorsRes, projectsRes] = await Promise.all([
      fetch('/templates/sector-template.html'),
      fetch('/data/sectors.json'),
      fetch('/data/projects.json')
    ]);

    const [template, sectors, projects] = await Promise.all([
      templateRes.text(),
      sectorsRes.json(),
      projectsRes.json()
    ]);

    const params = new URLSearchParams(window.location.search);
    const sectorKey = (params.get('sector') || params.get('id') || 'education').toLowerCase();
    const sector = sectors[sectorKey] || sectors.education;
    const sectorProjects = projects[sectorKey] || [];

    app.innerHTML = template;

    const setText = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value || '';
    };

    const resolveAssetPath = (path) => {
      if (!path) return '';
      if (path.startsWith('/') || path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
        return path;
      }
      return `/${path}`;
    };

    const resolveLink = (path) => {
      if (!path || path === '#') return path || '#';
      if (path.startsWith('/') || path.startsWith('http://') || path.startsWith('https://') || path.startsWith('mailto:') || path.startsWith('tel:')) {
        return path;
      }
      return `/${path}`;
    };

    const heroImage = document.getElementById('sectorHeroImage');
    heroImage.src = resolveAssetPath(sector.heroImage);
    heroImage.alt = sector.name;

    setText('sectorName', sector.name);
    setText('sectorTagline', sector.tagline);
    setText('sectorOverview', sector.overview);
    setText('sectorCtaTitle', sector.cta?.title);
    setText('sectorCtaDescription', sector.cta?.description);

    /* ==========================
   OFFICER SECTION
========================== */

if (sector.officer) {
  const officer = sector.officer;

  setText('sectorOfficerDescription', officer.description);
  setText('officerName', officer.name);
  setText('officerTitle', officer.title);
  setText('officerSpecialization', officer.specialization);
  setText('officerPhone', officer.phone);
  setText('officerEmail', officer.email);

  const img = document.getElementById('officerImage');
  if (img) img.src = resolveAssetPath(officer.image);

  const consult = document.getElementById('consultationLink');
  if (consult) consult.href = resolveLink(officer.consultationLink || '#');

  const report = document.getElementById('sectorReportLink');
  if (report) report.href = resolveLink(officer.reportLink || '#');
}

    if (sector.seo?.title) document.title = sector.seo.title;
    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta && sector.seo?.description) descMeta.setAttribute('content', sector.seo.description);

    const cardIcons = ['bi-briefcase-fill', 'bi-graph-up-arrow', 'bi-globe2', 'bi-lightning-charge-fill', 'bi-building-fill-check', 'bi-shield-check'];
    const statsWrap = document.getElementById('sectorStats');
    statsWrap.innerHTML = (sector.stats || []).map((stat, index) => `
      <div class="col-6 col-lg-4">
        <article class="slif-stat-card h-100 fade-in-up">
          <span class="slif-card-icon-box" aria-hidden="true"><i class="bi ${cardIcons[index % cardIcons.length]}"></i></span>
          <p class="slif-stat-value mb-1">${stat.value}</p>
          <p class="slif-stat-label mb-0">${stat.label}</p>
        </article>
      </div>
    `).join('');

    const whyWrap = document.getElementById('whyInvestList');
    whyWrap.innerHTML = (sector.whyInvest || []).map((item, index) => `
      <article class="slif-bullet-card fade-in-up">
        <span class="slif-card-icon-box" aria-hidden="true"><i class="bi ${cardIcons[index % cardIcons.length]}"></i></span>
        <div>
          <p class="mb-0">${item}</p>
          <span class="slif-hover-arrow" aria-hidden="true"><i class="bi bi-arrow-up-right"></i></span>
        </div>
      </article>
    `).join('');

    const advantagesWrap = document.getElementById('advantagesList');
    advantagesWrap.innerHTML = (sector.advantages || []).map((advantage, index) => `
      <div class="col-12 col-md-6 col-lg-4">
        <article class="slif-adv-card h-100 fade-in-up">
          <span class="slif-card-icon-box" aria-hidden="true"><i class="bi ${cardIcons[(index + 2) % cardIcons.length]}"></i></span>
          <div>
            <p class="mb-0">${advantage}</p>
            <span class="slif-hover-arrow" aria-hidden="true"><i class="bi bi-arrow-up-right"></i></span>
          </div>
        </article>
      </div>
    `).join('');

    const renderProjects = (filter = 'all') => {
      const list = filter === 'flagship' ? sectorProjects.filter((p) => p.type === 'flagship') : sectorProjects;
      const flagship = list.filter((project) => project.type === 'flagship');
      const standard = list.filter((project) => project.type !== 'flagship');

      const toCard = (project) => `
        <div class="col-12 col-md-6">
          <article class="card h-100 border-0 shadow-sm slif-project-card fade-in-up">
            <img src="${resolveAssetPath(project.images?.[0] || sector.heroImage)}" loading="lazy" class="card-img-top" alt="${project.title}">
            <div class="card-body d-flex flex-column">
              <span class="badge text-bg-light border mb-2 text-uppercase">${project.type}</span>
              <h4 class="h6 mb-2">${project.title}</h4>
              <p class="text-muted small mb-1"><i class="bi bi-geo-alt"></i> ${project.location}</p>
              <p class="small mb-1"><strong>Investment:</strong> ${project.investment}</p>
              <p class="small mb-3"><strong>Expected IRR:</strong> ${project.irr || 'N/A'}</p>
              <p class="text-muted small mb-3">${project.summary || ''}</p>
              <a class="mt-auto btn btn-sm btn-outline-primary slif-project-link" href="/project.html?id=${project.id}">View details <i class="bi bi-arrow-right-short"></i></a>
            </div>
          </article>
        </div>
      `;

      document.getElementById('flagshipProjects').innerHTML = flagship.length ? flagship.map(toCard).join('') : '<p class="text-muted small mb-0">No projects available.</p>';
      document.getElementById('standardProjects').innerHTML = standard.length ? standard.map(toCard).join('') : '<p class="text-muted small mb-0">No projects available.</p>';
    };

    renderProjects();

    document.querySelectorAll('[data-filter]').forEach((button) => {
      button.addEventListener('click', () => {
        document.querySelectorAll('[data-filter]').forEach((btn) => btn.classList.remove('active'));
        button.classList.add('active');
        renderProjects(button.dataset.filter);
      });
    });
  } catch (error) {
    app.innerHTML = '<div class="container py-5"><p class="text-danger">Unable to load sector content at the moment.</p></div>';
    console.error(error);
  }
})();
