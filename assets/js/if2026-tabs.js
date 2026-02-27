(function () {
  const section = document.querySelector("#if2026-section");
  if (!section) return;

  const tabs = Array.from(section.querySelectorAll(".if2026-tab"));
  const panels = Array.from(section.querySelectorAll(".if2026-content"));

  if (!tabs.length || !panels.length) return;

  const activateTab = (tab) => {
    const targetId = tab.getAttribute("data-tab");
    const targetPanel = section.querySelector(`#${targetId}`);

    tabs.forEach((btn) => btn.classList.remove("active"));
    panels.forEach((panel) => panel.classList.remove("active"));

    tab.classList.add("active");
    if (targetPanel) {
      targetPanel.classList.add("active");
    }
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => activateTab(tab));
  });
})();
