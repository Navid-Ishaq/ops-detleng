(function () {
  "use strict";

  /* ---------- Architecture stage data ---------- */
  const STAGES = [
    {
      name: "Intake",
      sub: "WhatsApp · Web · Email",
      description: "Normalize incoming events and assign stable IDs.",
      concern: "Every channel produces a different payload shape. Intake's job is to convert all of them into one consistent event before anything downstream sees them."
    },
    {
      name: "AI Brain",
      sub: "Classify · score · language",
      description: "Use structured model outputs instead of uncontrolled free-form responses.",
      concern: "The model is constrained to a schema. A response that doesn't validate is treated as a failure, not silently accepted."
    },
    {
      name: "Router",
      sub: "Lead · support · document · ops",
      description: "Send each classified event to the workflow built to handle it.",
      concern: "Routing rules are explicit and versioned, so a misroute is traceable back to the exact rule that produced it."
    },
    {
      name: "Data",
      sub: "PostgreSQL / Supabase",
      description: "Persist a clean, structured record of every event and its outcome.",
      concern: "Writes are idempotent — retrying an event never creates a duplicate record."
    },
    {
      name: "Actions",
      sub: "CRM · email · tasks · APIs",
      description: "Carry out the business action the event calls for.",
      concern: "Every external call is retried on transient failure and logged on permanent failure."
    },
    {
      name: "Human Gate",
      sub: "Approval",
      description: "Require human approval for sensitive or low-confidence decisions.",
      concern: "A confidence threshold or an action's risk level — refunds, cancellations, outbound messages — determines whether it waits for a human."
    },
    {
      name: "Operations",
      sub: "Logs · retries · alerts",
      description: "Retries, error workflows, audit logs and alerts.",
      concern: "Failures raise an alert with enough context to diagnose the issue without reading raw logs."
    },
    {
      name: "Reporting",
      sub: "ROI · response time · rate",
      description: "Turn operational data into numbers the business can act on.",
      concern: "Reporting only shows measured outcomes — automation rate, response time, error rate — never a projected or assumed figure."
    }
  ];

  const archRail = document.getElementById("archRail");
  const archDetail = document.getElementById("archDetail");

  function renderStages() {
    STAGES.forEach((stage, i) => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.className = "arch-stage";
      btn.type = "button";
      btn.setAttribute("aria-pressed", "false");
      btn.dataset.index = String(i);
      btn.innerHTML =
        '<span class="arch-num">' + String(i + 1).padStart(2, "0") + "</span>" +
        "<h3>" + stage.name + "</h3>" +
        '<span class="arch-sub">' + stage.sub + "</span>";
      btn.addEventListener("click", () => selectStage(i));
      li.appendChild(btn);
      archRail.appendChild(li);
    });
  }

  function selectStage(index) {
    const stage = STAGES[index];
    document.querySelectorAll(".arch-stage").forEach((el) => {
      el.setAttribute("aria-pressed", String(Number(el.dataset.index) === index));
    });
    archDetail.innerHTML =
      '<span class="detail-eyebrow">Stage ' + String(index + 1).padStart(2, "0") + " — " + stage.name + "</span>" +
      "<h3>" + stage.description + "</h3>" +
      '<p><span class="concern-label">Production concern.</span> ' + stage.concern + "</p>";
  }

  renderStages();
  selectStage(0);

  /* ---------- Project grid ---------- */
  const grid = document.getElementById("projectGrid");

  function renderProjects() {
    PROJECTS.forEach((project) => {
      const card = document.createElement("article");
      card.className = "project-card";

      const flow = project.flow
        .map((step) => "<span>" + step + "</span>")
        .join('<span class="arrow">&rarr;</span>');

      const tags = project.tags.map((t) => "<span>" + t + "</span>").join("");

      card.innerHTML =
        '<div class="project-card-head">' +
          "<h3>" + project.title + "</h3>" +
          '<span class="status-badge status-' + project.status + '">' + STATUS_LABEL[project.status] + "</span>" +
        "</div>" +
        '<p class="summary">' + project.summary + "</p>" +
        '<div class="flow-trace">' + flow + "</div>" +
        '<div class="tag-row">' + tags + "</div>" +
        '<div class="project-card-foot">' +
          '<button type="button" class="project-view-btn" data-project="' + project.id + '">View project</button>' +
        "</div>";

      grid.appendChild(card);
    });
  }

  renderProjects();

  /* ---------- Modal ---------- */
  const backdrop = document.getElementById("modalBackdrop");
  const modalBody = document.getElementById("modalBody");
  const modalClose = document.getElementById("modalClose");
  let lastFocused = null;

  function openModal(projectId) {
    const project = PROJECTS.find((p) => p.id === projectId);
    if (!project) return;

    const flow = project.flow
      .map((step) => "<span>" + step + "</span>")
      .join('<span class="arrow">&rarr;</span>');

    let linksHtml = "";
    if (project.githubUrl) linksHtml += '<a class="btn btn-secondary" href="' + project.githubUrl + '" target="_blank" rel="noopener">View code</a>';
    if (project.demoUrl) linksHtml += '<a class="btn btn-secondary" href="' + project.demoUrl + '" target="_blank" rel="noopener">Live demo</a>';

    modalBody.innerHTML =
      '<div class="modal-body">' +
        "<h3>" + project.title + "</h3>" +
        '<div class="flow-trace modal-flow">' + flow + "</div>" +
        "<p>" + project.detail + "</p>" +
        (project.pageUrl
          ? '<div class="hero-actions">' + linksHtml + "</div>"
          : '<div class="modal-note">Implementation coming next. This project is currently: <strong>' + STATUS_LABEL[project.status] + "</strong>.</div>") +
      "</div>";

    lastFocused = document.activeElement;
    backdrop.hidden = false;
    modalClose.focus();
    document.addEventListener("keydown", onModalKeydown);
  }

  function closeModal() {
    backdrop.hidden = true;
    document.removeEventListener("keydown", onModalKeydown);
    if (lastFocused) lastFocused.focus();
  }

  function onModalKeydown(e) {
    if (e.key === "Escape") closeModal();
  }

  grid.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-project]");
    if (btn) openModal(btn.dataset.project);
  });

  modalClose.addEventListener("click", closeModal);
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) closeModal();
  });

  /* ---------- Mobile nav ---------- */
  const navToggle = document.getElementById("navToggle");
  const header = document.querySelector(".site-header");

  navToggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.querySelectorAll(".main-nav a").forEach((link) => {
    link.addEventListener("click", () => {
      header.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
})();
