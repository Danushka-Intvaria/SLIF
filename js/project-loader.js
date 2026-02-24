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

    const resolveAssetPath = (path) => {
      if (!path) return '';
      if (
        path.startsWith('/') ||
        path.startsWith('http://') ||
        path.startsWith('https://') ||
        path.startsWith('data:')
      ) {
        return path;
      }
      return `/${path}`;
    };

    const resolveLink = (path) => {
      if (!path || path === '#') return path || '#';
      if (
        path.startsWith('/') ||
        path.startsWith('http://') ||
        path.startsWith('https://') ||
        path.startsWith('mailto:') ||
        path.startsWith('tel:')
      ) {
        return path;
      }
      return `/${path}`;
    };

    const buildHeroCarousel = () => {
      const images = Array.isArray(currentProject.heroImage)
        ? currentProject.heroImage
        : currentProject.heroImage
          ? [currentProject.heroImage]
          : [];
      const fallbackImage = sector.heroImage ? [sector.heroImage] : [];
      const safeImages = images.length ? images : fallbackImage;
      const hasVideo = Boolean(currentProject.heroVideo);
      const poster = safeImages[0] ? resolveAssetPath(safeImages[0]) : '';

      const items = [];
      if (hasVideo) {
        items.push(`
          <div class="carousel-item active">
            <div class="slif-video-frame">
              <video class="slif-project-hero-media-item" controls preload="metadata" playsinline poster="${poster}">
                <source src="${resolveAssetPath(currentProject.heroVideo)}" type="video/mp4">
              </video>
              <button type="button" class="slif-video-play" aria-label="Play video">
                <i class="bi bi-play-fill" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        `);
      }

      safeImages.forEach((img, index) => {
        const isActive = !hasVideo && index === 0;
        items.push(`
          <div class="carousel-item${isActive ? ' active' : ''}">
            <img src="${resolveAssetPath(img)}" loading="lazy" class="slif-project-hero-media-item" alt="${currentProject.title}">
          </div>
        `);
      });

      const hasMultiple = items.length > 1;
      const carouselId = 'projectHeroCarousel';

      return `
        <div id="${carouselId}" class="carousel slide slif-project-hero-carousel" data-bs-ride="false" data-bs-interval="false" data-bs-wrap="false" data-bs-touch="false">
          <div class="carousel-inner">
            ${items.join('')}
          </div>
          ${
            hasMultiple
              ? `
          <button class="carousel-control-prev" type="button" data-bs-target="#${carouselId}" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#${carouselId}" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
          `
              : ''
          }
        </div>
      `;
    };

    const heroMedia = document.getElementById('projectHeroMedia');
    if (heroMedia) heroMedia.innerHTML = buildHeroCarousel();

    const wireHeroMedia = () => {
      document.querySelectorAll('.slif-video-play').forEach((button) => {
        if (button.dataset.bound) return;
        button.dataset.bound = 'true';

        const frame = button.closest('.slif-video-frame');
        const video = frame?.querySelector('video');
        if (!video) return;

        const setPlaying = (isPlaying) => {
          if (!frame) return;
          frame.classList.toggle('is-playing', isPlaying);
        };

        button.addEventListener('click', () => {
          video.play().catch(() => {});
          setPlaying(true);
        });

        video.addEventListener('play', () => setPlaying(true));
        video.addEventListener('pause', () => setPlaying(false));
        video.addEventListener('ended', () => setPlaying(false));
      });

      const carousel = document.querySelector('.slif-project-hero-carousel');
      if (carousel && !carousel.dataset.bound) {
        carousel.dataset.bound = 'true';
        carousel.addEventListener('slide.bs.carousel', () => {
          carousel.querySelectorAll('video').forEach((video) => {
            video.pause();
            video.currentTime = 0;
            const frame = video.closest('.slif-video-frame');
            if (frame) frame.classList.remove('is-playing');
          });
        });
      }
    };

    wireHeroMedia();

    setText('projectSectorName', sector.name);
    setText('projectTitle', currentProject.title);
    setText('projectSummary', currentProject.subTitle);
    setText('projectOverview', currentProject.description);

    document.title = `${currentProject.title} | SLIF`;

    const highlights = document.getElementById('projectHighlights');
    highlights.innerHTML = (currentProject.keyHighlights || []).map((item) => `<li>${item}</li>`).join('');

    const financial = document.getElementById('financialSnapshot');
    const financialItems = currentProject.financialSnapshot || [];
    if (financialItems.length) {
      financial.innerHTML = financialItems.map((item) => `<li>${item}</li>`).join('');
    } else {
      const financialSection = financial.closest('section');
      if (financialSection) financialSection.classList.add('d-none');
    }

    const facts = (currentProject.stats || []).slice(0, 4);

    document.getElementById('projectFacts').innerHTML = facts.map((fact) => `
      <div class="col-6 col-lg-12">
        <article class="slif-fact-card">
          <p class="small text-muted mb-1">${fact.label}</p>
          <p class="mb-0 fw-semibold">${fact.value}</p>
        </article>
      </div>
    `).join('');

    const brochure = document.getElementById('projectBrochure');
    brochure.href = resolveLink(currentProject.brochure || '#');
  } catch (error) {
    app.innerHTML = '<div class="container py-5"><p class="text-danger">Unable to load project content at the moment.</p></div>';
    console.error(error);
  }
})();
