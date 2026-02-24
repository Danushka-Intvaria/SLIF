
function initSite() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader) return;
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  if (scrollTop) {
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    if (typeof AOS === 'undefined') return;
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Countdown timer
   */
  function updateCountDown(countDownItem) {
    const timeleft = new Date(countDownItem.getAttribute('data-count')).getTime() - new Date().getTime();

    const days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeleft % (1000 * 60)) / 1000);

    const daysElement = countDownItem.querySelector('.count-days');
    const hoursElement = countDownItem.querySelector('.count-hours');
    const minutesElement = countDownItem.querySelector('.count-minutes');
    const secondsElement = countDownItem.querySelector('.count-seconds');

    const formatCount = (value) => String(value).padStart(2, '0');

    if (daysElement) daysElement.innerHTML = formatCount(days);
    if (hoursElement) hoursElement.innerHTML = formatCount(hours);
    if (minutesElement) minutesElement.innerHTML = formatCount(minutes);
    if (secondsElement) secondsElement.innerHTML = formatCount(seconds);

  }

  document.querySelectorAll('.countdown').forEach(function(countDownItem) {
    updateCountDown(countDownItem);
    setInterval(function() {
      updateCountDown(countDownItem);
    }, 1000);
  });

  /**
   * Initiate Pure Counter
   */
  if (typeof PureCounter !== 'undefined') {
    new PureCounter();
  }

  /**
   * Init isotope layout and filters
   */
  if (typeof Isotope !== 'undefined' && typeof imagesLoaded !== 'undefined') {
    document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    const container = isotopeItem.querySelector('.isotope-container');
    if (!container) return;
    imagesLoaded(container, function() {
      initIsotope = new Isotope(container, {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        const active = isotopeItem.querySelector('.isotope-filters .filter-active');
        if (active) active.classList.remove('filter-active');
        this.classList.add('filter-active');
        if (initIsotope) {
          initIsotope.arrange({
            filter: this.getAttribute('data-filter')
          });
        }
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });
  }

  /*
   * Pricing Toggle
   */

  const pricingContainers = document.querySelectorAll('.pricing-toggle-container');

  pricingContainers.forEach(function(container) {
    const pricingSwitch = container.querySelector('.pricing-toggle input[type="checkbox"]');
    const monthlyText = container.querySelector('.monthly');
    const yearlyText = container.querySelector('.yearly');

    if (!pricingSwitch || !monthlyText || !yearlyText) return;

    pricingSwitch.addEventListener('change', function() {
      const pricingItems = container.querySelectorAll('.pricing-item');

      if (this.checked) {
        monthlyText.classList.remove('active');
        yearlyText.classList.add('active');
        pricingItems.forEach(item => {
          item.classList.add('yearly-active');
        });
      } else {
        monthlyText.classList.add('active');
        yearlyText.classList.remove('active');
        pricingItems.forEach(item => {
          item.classList.remove('yearly-active');
        });
      }
    });
  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    if (typeof Swiper === 'undefined') return;
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      const configEl = swiperElement.querySelector(".swiper-config");
      if (!configEl) return;
      let config = JSON.parse(
        configEl.innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Initiate glightbox
   */
  if (typeof GLightbox !== 'undefined') {
    GLightbox({
      selector: '.glightbox'
    });
  }

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  function handleHashScroll() {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  }
  window.addEventListener('load', handleHashScroll);

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

  /**
   * IF2026 tab switcher
   */
  function initIf2026Tabs() {
    const tabs = document.querySelectorAll("#if2026-section .if2026-tab");
    const panels = document.querySelectorAll("#if2026-section .if2026-content");
    if (!tabs.length || !panels.length) return;

    tabs.forEach(btn => {
      btn.addEventListener("click", function() {
        tabs.forEach(b => b.classList.remove("active"));
        panels.forEach(c => c.classList.remove("active"));
        this.classList.add("active");
        const panel = document.getElementById(this.dataset.tab);
        if (panel) panel.classList.add("active");
      });
    });
  }
  window.addEventListener('load', initIf2026Tabs);

  /**
   * Static form handler (no backend)
   */
  function initStaticForms() {
    document.querySelectorAll('form[data-static-form="true"]').forEach((form) => {
      form.addEventListener('submit', (event) => {
        event.preventDefault();

        const loading = form.querySelector('.loading');
        const error = form.querySelector('.error-message');
        const sent = form.querySelector('.sent-message');

        if (error) {
          error.textContent = '';
          error.style.display = 'none';
        }
        if (sent) sent.style.display = 'none';
        if (loading) loading.style.display = 'block';

        window.setTimeout(() => {
          if (loading) loading.style.display = 'none';
          if (sent) sent.style.display = 'block';
          form.reset();
        }, 600);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStaticForms);
  } else {
    initStaticForms();
  }

  if (document.readyState === 'complete') {
    toggleScrolled();
    toggleScrollTop();
    aosInit();
    initSwiper();
    navmenuScrollspy();
    initIf2026Tabs();
    handleHashScroll();
    if (preloader) preloader.remove();
  }

}

function initSectorFilters() {
  /**
     * Education Sector filter
     */
  const locationFilter = document.getElementById('locationFilter');
  const typeFilter = document.getElementById('typeFilter');
  const sizeFilter = document.getElementById('sizeFilter');
  const cards = document.querySelectorAll('.project-card');

  if (locationFilter && typeFilter && sizeFilter && cards.length) {
    [locationFilter, typeFilter, sizeFilter].forEach(filter => {
      filter.addEventListener('change', applyFilters);
    });
  }

  function applyFilters() {
    if (!locationFilter || !typeFilter || !sizeFilter) return;
    const locationValue = locationFilter.value;
    const type = typeFilter.value;
    const size = sizeFilter.value;

    cards.forEach(card => {
      const match =
        (locationValue === 'all' || card.dataset.location === locationValue) &&
        (type === 'all' || card.dataset.type === type) &&
        (size === 'all' || card.dataset.size === size);

      card.style.display = match ? 'block' : 'none';
    });
  }
}

(function() {
  "use strict";

  let initialized = false;

  const runInit = () => {
    if (initialized) return;
    initialized = true;
    initSite();
    initSectorFilters();
  };

  const readyPromise = window.__partialsReady;
  if (readyPromise && typeof readyPromise.then === 'function') {
    readyPromise.then(runInit);
    return;
  }

  document.addEventListener('partials:loaded', runInit, { once: true });

  if (!document.querySelector('[data-include]')) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', runInit, { once: true });
    } else {
      runInit();
    }
  }
})();
