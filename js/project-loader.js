(async function initProjectPage() {
  const app = document.getElementById('projectApp');
  if (!app) return;

  try {
    const [templateRes, sectorsRes, projectsRes] = await Promise.all([
      fetch('templates/project-template.html'),
      fetch('data/sectors.json'),
      fetch('data/projects.json')
    ]);

    const [template, sectors, projectsBySector] = await Promise.all([
      templateRes.text(),
      sectorsRes.json(),
      projectsRes.json()
    ]);

    app.innerHTML = template;

    const params = new URLSearchParams(window.location.search);
    const projectId = params.get('id');

    let currentProject;
    let currentSectorKey;

    Object.entries(projectsBySector).some(([sectorKey, projects]) => {
      const match = (projects || []).find((project) => project.id === projectId);
      if (match) {
        currentProject = match;
        currentSectorKey = sectorKey;
        return true;
      }
      return false;
    });

    if (!currentProject) {
      currentSectorKey = 'education';
      currentProject = projectsBySector.education?.[0];
    }

    const sector = sectors[currentSectorKey];

    const setText = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value || '';
    };

    const heroImage = document.getElementById('projectHeroImage');
    heroImage.src = currentProject.images?.[0] || sector.heroImage;
    heroImage.alt = currentProject.title;

    setText('projectSectorName', sector.name);
    setText('projectTitle', currentProject.title);
    setText('projectSummary', currentProject.summary);
    setText('projectOverview', currentProject.overview);

    document.title = `${currentProject.title} | SLIF`;

    const highlights = document.getElementById('projectHighlights');
    highlights.innerHTML = (currentProject.highlights || []).map((item) => `<li>${item}</li>`).join('');

    const financial = document.getElementById('financialSnapshot');
    financial.innerHTML = (currentProject.financialSnapshot || []).map((item) => `<li>${item}</li>`).join('');

    const facts = [
      { label: 'Location', value: currentProject.location },
      { label: 'Investment', value: currentProject.investment },
      { label: 'Expected IRR', value: currentProject.irr || 'N/A' },
      { label: 'Land Area', value: currentProject.landArea || 'N/A' }
    ];

    document.getElementById('projectFacts').innerHTML = facts.map((fact) => `
      <div class="col-6 col-lg-12">
        <article class="slif-fact-card">
          <p class="small text-muted mb-1">${fact.label}</p>
          <p class="mb-0 fw-semibold">${fact.value}</p>
        </article>
      </div>
    `).join('');

    const brochure = document.getElementById('projectBrochure');
    brochure.href = currentProject.brochure || '#';
  } catch (error) {
    app.innerHTML = '<div class="container py-5"><p class="text-danger">Unable to load project content at the moment.</p></div>';
    console.error(error);
  }
})();
