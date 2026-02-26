(async function initSectorPage() {
  const app = document.getElementById("sectorApp");
  if (!app) return;

  try {
    const [templateRes, sectorsRes, projectsRes] = await Promise.all([
      fetch("/templates/sector-template.html"),
      fetch("/data/sectors.json"),
      fetch("/data/projects.json"),
    ]);

    const [template, sectors, projects] = await Promise.all([
      templateRes.text(),
      sectorsRes.json(),
      projectsRes.json(),
    ]);

    const params = new URLSearchParams(window.location.search);
    const sectorKey = (
      params.get("sector") ||
      params.get("id") ||
      "education"
    ).toLowerCase();
    const sector = sectors[sectorKey] || sectors.education;
    const sectorProjects = projects[sectorKey] || [];

    app.innerHTML = template;

    const setText = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value || "";
    };

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

    const renderOverview = (overview) => {
      const wrap = document.getElementById("sectorOverview");
      if (!wrap) return;

      const paragraphs = Array.isArray(overview) ? overview : [overview];
      const cleaned = paragraphs.filter((text) => Boolean(text));

      wrap.innerHTML = "";

      if (!cleaned.length) return;

      cleaned.forEach((text, index) => {
        const p = document.createElement("p");
        p.textContent = text;
        p.className = index === cleaned.length - 1 ? "mb-0" : "mb-3";
        wrap.appendChild(p);
      });
    };

    const resolveLink = (path) => {
      if (!path || path === "#") return path || "#";
      if (
        path.startsWith("/") ||
        path.startsWith("http://") ||
        path.startsWith("https://") ||
        path.startsWith("mailto:") ||
        path.startsWith("tel:")
      ) {
        return path;
      }
      return `/${path}`;
    };

    const heroImage = document.getElementById("sectorHeroImage");
    heroImage.src = resolveAssetPath(sector.heroImage);
    heroImage.alt = sector.name;

    const overviewImage = document.getElementById("sectorOverviewImage");
    if (overviewImage) {
      const frame = document.getElementById("sectorOverviewImageFrame");
      const overviewSrc = resolveAssetPath(
        sector.image || sector.heroImage || "",
      );
      const fallbackSrc = resolveAssetPath("assets/img/herobg.png");

      const clearLoading = () => {
        if (frame) frame.classList.remove("is-loading");
      };

      overviewImage.onload = () => clearLoading();
      overviewImage.onerror = () => {
        if (overviewImage.dataset.fallbackApplied === "true") {
          clearLoading();
          return;
        }
        overviewImage.dataset.fallbackApplied = "true";
        overviewImage.src = fallbackSrc;
      };

      overviewImage.src = overviewSrc;
      overviewImage.alt = sector.name
        ? `${sector.name} overview`
        : "Sector overview";
    }

    setText("sectorName", sector.name);
    setText("sectorTagline", sector.tagline);
    renderOverview(sector.overview);
    setText("sectorCtaTitle", sector.cta?.title);
    setText("sectorCtaDescription", sector.cta?.description);

    /* ==========================
   OFFICER SECTION
========================== */

    if (sector.officer) {
      const officer = sector.officer;

      setText("sectorOfficerDescription", officer.description);
      setText("officerName", officer.name);
      setText("officerTitle", officer.title);
      setText("officerSpecialization", officer.specialization);
      setText("officerPhone", officer.phone);
      setText("officerEmail", officer.email);

      const img = document.getElementById("officerImage");
      if (img) {
        const fallbackImage = "assets/img/person/person-m-8.webp";
        const resolvedFallback = resolveAssetPath(fallbackImage);
        img.src = resolveAssetPath(officer.image || fallbackImage);
        img.alt = officer.name || "Sector officer";
        img.onerror = () => {
          img.onerror = null;
          img.src = resolvedFallback;
        };
      }

      const consult = document.getElementById("consultationLink");
      if (consult) consult.href = resolveLink(officer.consultationLink || "#");

      const report = document.getElementById("sectorReportLink");
      if (report) report.href = resolveLink(officer.reportLink || "#");
    }

    if (sector.seo?.title) document.title = sector.seo.title;
    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta && sector.seo?.description)
      descMeta.setAttribute("content", sector.seo.description);

    const cardIcons = [
      "bi-briefcase-fill",
      "bi-graph-up-arrow",
      "bi-globe2",
      "bi-lightning-charge-fill",
      "bi-building-fill-check",
      "bi-shield-check",
    ];
    const statsWrap = document.getElementById("sectorStats");
    statsWrap.innerHTML = (sector.stats || [])
      .map(
        (stat, index) => `
      <div class="col-5 col-lg-3">
        <article class="slif-stat-card h-100 fade-in-up">
          <span class="slif-card-icon-box" aria-hidden="true"><i class="bi ${cardIcons[index % cardIcons.length]}"></i></span>
          <p class="slif-stat-value mb-1">${stat.value}</p>
          <p class="slif-stat-label mb-0">${stat.label}</p>
        </article>
      </div>
    `,
      )
      .join("");

    const whyWrap = document.getElementById("whyInvestList");
    whyWrap.innerHTML = (sector.whyInvest || [])
      .map(
        (item, index) => `
      <article class="slif-bullet-card fade-in-up">
        <span class="slif-card-icon-box" aria-hidden="true"><i class="bi ${cardIcons[index % cardIcons.length]}"></i></span>
        <div>
          <p class="mb-0">${item}</p>
          <span class="slif-hover-arrow" aria-hidden="true"><i class="bi bi-arrow-up-right"></i></span>
        </div>
      </article>
    `,
      )
      .join("");

    const advantagesWrap = document.getElementById("advantagesList");
    advantagesWrap.innerHTML = (sector.advantages || [])
      .map(
        (advantage, index) => `
      <div class="col-12 col-md-6 col-lg-4">
        <article class="slif-adv-card h-100 fade-in-up">
          <span class="slif-card-icon-box" aria-hidden="true"><i class="bi ${cardIcons[(index + 2) % cardIcons.length]}"></i></span>
          <div>
            <p class="mb-0">${advantage}</p>
            <span class="slif-hover-arrow" aria-hidden="true"><i class="bi bi-arrow-up-right"></i></span>
          </div>
        </article>
      </div>
    `,
      )
      .join("");

    const buildCarousel = (project) => {
      const images = Array.isArray(project.images)
        ? project.images
        : project.images
          ? [project.images]
          : [];
      const fallbackImage = sector.heroImage ? [sector.heroImage] : [];
      const safeImages = images.length ? images : fallbackImage;
      const hasVideo = Boolean(project.video);
      const poster = safeImages[0] ? resolveAssetPath(safeImages[0]) : "";

      const items = [];

      if (hasVideo) {
        items.push(`
          <div class="carousel-item active">
            <div class="slif-video-frame slif-media-frame">
              <video class="slif-project-media-item" controls preload="metadata" playsinline poster="${poster}">
                <source src="${resolveAssetPath(project.video)}" type="video/mp4">
              </video>
              <button type="button" class="slif-video-play" aria-label="Play video">
                <i class="bi bi-play-fill" aria-hidden="true"></i>
              </button>
              <button type="button" class="slif-media-open" data-media-type="video" data-src="${resolveAssetPath(
                project.video,
              )}" data-poster="${poster}" data-title="${project.title}">
                <i class="bi bi-arrows-fullscreen" aria-hidden="true"></i>
                View
              </button>
            </div>
          </div>
        `);
      }

      safeImages.forEach((img, index) => {
        const isActive = !hasVideo && index === 0;
        items.push(`
          <div class="carousel-item${isActive ? " active" : ""}">
            <div class="slif-media-frame">
              <img src="${resolveAssetPath(img)}" loading="lazy" class="slif-project-media-item" alt="${project.title}">
              <button type="button" class="slif-media-open" data-media-type="image" data-src="${resolveAssetPath(
                img,
              )}" data-title="${project.title}">
                <i class="bi bi-arrows-fullscreen" aria-hidden="true"></i>
                View
              </button>
            </div>
          </div>
        `);
      });

      const hasMultiple = items.length > 1;
      const carouselId = `projectCarousel-${project.id}`;

      return `
        <div id="${carouselId}" class="carousel slide slif-project-carousel" data-bs-ride="false" data-bs-interval="false" data-bs-wrap="false" data-bs-touch="false">
          <div class="carousel-inner">
            ${items.join("")}
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
              : ""
          }
        </div>
      `;
    };

    const wireProjectMedia = () => {
      document.querySelectorAll(".slif-video-play").forEach((button) => {
        if (button.dataset.bound) return;
        button.dataset.bound = "true";

        const frame = button.closest(".slif-video-frame");
        const video = frame?.querySelector("video");
        if (!video) return;

        const setPlaying = (isPlaying) => {
          if (!frame) return;
          frame.classList.toggle("is-playing", isPlaying);
        };

        button.addEventListener("click", () => {
          video.play().catch(() => {});
          setPlaying(true);
        });

        video.addEventListener("play", () => setPlaying(true));
        video.addEventListener("pause", () => setPlaying(false));
        video.addEventListener("ended", () => setPlaying(false));
      });

      document
        .querySelectorAll(".slif-project-carousel")
        .forEach((carousel) => {
          if (carousel.dataset.bound) return;
          carousel.dataset.bound = "true";
          carousel.addEventListener("slide.bs.carousel", () => {
            carousel.querySelectorAll("video").forEach((video) => {
              video.pause();
              video.currentTime = 0;
              const frame = video.closest(".slif-video-frame");
              if (frame) frame.classList.remove("is-playing");
            });
          });
        });

      const modal = document.getElementById("projectMediaModal");
      const modalBody = modal?.querySelector(".slif-project-media-modal-body");
      const modalLabel = modal?.querySelector("#projectMediaModalLabel");
      const modalInstance =
        modal && window.bootstrap ? new window.bootstrap.Modal(modal) : null;

      if (modal && !modal.dataset.bound) {
        modal.dataset.bound = "true";
        modal.addEventListener("hidden.bs.modal", () => {
          modalBody?.querySelectorAll("video").forEach((video) => {
            video.pause();
            video.currentTime = 0;
          });
          if (modalBody) modalBody.innerHTML = "";
        });
      }

      document.querySelectorAll(".slif-media-open").forEach((button) => {
        if (button.dataset.bound) return;
        button.dataset.bound = "true";

        button.addEventListener("click", () => {
          if (!modalBody || !modalInstance) return;
          const mediaType = button.dataset.mediaType;
          const src = button.dataset.src;
          const poster = button.dataset.poster;
          const title = button.dataset.title;

          if (!src) return;

          if (modalLabel) {
            modalLabel.textContent = title
              ? `${title} Preview`
              : "Media Preview";
          }

          if (mediaType === "video") {
            modalBody.innerHTML = `
              <video controls preload="metadata" playsinline ${
                poster ? `poster="${poster}"` : ""
              }>
                <source src="${src}" type="video/mp4">
              </video>
            `;
          } else {
            modalBody.innerHTML = `<img src="${src}" alt="${title || "Project media"}">`;
          }

          modalInstance.show();
        });
      });
    };

    const renderProjects = (filter = "all") => {
      const list =
        filter === "flagship"
          ? sectorProjects.filter((p) => p.type === "flagship")
          : sectorProjects;
      const flagship = list.filter((project) => project.type === "flagship");
      const standard = list.filter((project) => project.type !== "flagship");

      const toCard = (project, variant = "standard") => {
        const badge =
          project.type === "flagship" ? "Flagship Project" : "Standard Project";
        const stats = (project.stats || []).slice(0, 4);
        const highlights = (project.keyHighlights || []).slice(0, 4);
        const detailsLink =
          project.moreInfo && project.moreInfo !== "#"
            ? resolveLink(project.moreInfo)
            : "/contact.html";

        return `
        <article class="slif-project-feature-card fade-in-up ${
          variant === "flagship" ? "slif-project-feature-card--flagship" : ""
        }">
          <div class="slif-project-media">
            ${buildCarousel(project)}
            <span class="badge slif-project-badge">${badge}</span>
          </div>
          <div class="slif-project-body">
            <h3 class="slif-project-title">${project.title}</h3>
            <p class="slif-project-subtitle">${project.subTitle || ""}</p>
            <p class="slif-project-description">${project.description || ""}</p>

            <div class="slif-project-stats">
              ${
                stats.length
                  ? stats
                      .map(
                        (stat) => `
                <div class="slif-project-stat">
                  <span class="slif-project-stat-label">${stat.label}</span>
                  <span class="slif-project-stat-value">${stat.value}</span>
                </div>
              `,
                      )
                      .join("")
                  : ""
              }
            </div>

            ${
              highlights.length
                ? `
            <div class="slif-project-divider"></div>
            <div class="slif-project-highlights">
              <p class="slif-project-highlights-title">Key Highlights</p>
              <ul class="slif-project-highlights-list">
                ${highlights.map((item) => `<li>${item}</li>`).join("")}
              </ul>
            </div>
            `
                : ""
            }

            <div class="slif-project-actions">
              <a class="btn btn-primary" href="${detailsLink}">Contact Investment Team <i class="bi bi-arrow-right-short"></i></a>
              <a class="btn btn-outline-primary" href="${resolveLink(
                project.brochure || "#",
              )}">Download Project Brief</a>
            </div>
          </div>
        </article>
        `;
      };

      const emptyMessage = `
        <div class="col-12">
          <div class="text-center py-5">
            <p class="text-muted mb-0">No projects available.</p>
          </div>
        </div>
      `;
      const hasFlagship = flagship.length > 0;
      const hasStandard = standard.length > 0;
      const showEmpty = !hasFlagship && !hasStandard;

      document.getElementById("flagshipProjects").innerHTML = hasFlagship
        ? flagship.map((project) => toCard(project, "flagship")).join("")
        : "";
      document.getElementById("standardProjects").innerHTML = hasStandard
        ? standard
            .map(
              (project) =>
                `<div class="col-12">${toCard(project, "standard")}</div>`,
            )
            .join("")
        : showEmpty
          ? emptyMessage
          : "";

      wireProjectMedia();
    };

    renderProjects();

    document.querySelectorAll("[data-filter]").forEach((button) => {
      button.addEventListener("click", () => {
        document
          .querySelectorAll("[data-filter]")
          .forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
        renderProjects(button.dataset.filter);
      });
    });
  } catch (error) {
    app.innerHTML =
      '<div class="container py-5"><p class="text-danger">Unable to load sector content at the moment.</p></div>';
    console.error(error);
  }
})();
