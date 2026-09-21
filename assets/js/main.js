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
      sub: "Classify · score · extract",
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
  archRail.setAttribute("role", "tablist");

  function renderStages() {
    STAGES.forEach((stage, i) => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.className = "arch-stage";
      btn.type = "button";
      btn.setAttribute("aria-pressed", "false");
      btn.setAttribute("role", "tab");
      btn.dataset.index = String(i);
      btn.innerHTML =
        '<span class="arch-num">' + String(i + 1).padStart(2, "0") + "</span>" +
        "<h3>" + stage.name + "</h3>" +
        '<span class="arch-sub">' + stage.sub + "</span>";
      btn.addEventListener("click", () => selectStage(i));
      btn.addEventListener("keydown", (event) => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        let next = i;
        if (event.key === "ArrowLeft") next = (i - 1 + STAGES.length) % STAGES.length;
        if (event.key === "ArrowRight") next = (i + 1) % STAGES.length;
        if (event.key === "Home") next = 0;
        if (event.key === "End") next = STAGES.length - 1;
        selectStage(next);
        archRail.querySelectorAll(".arch-stage")[next].focus();
      });
      li.appendChild(btn);
      archRail.appendChild(li);
    });
  }

  function selectStage(index) {
    const stage = STAGES[index];
    document.querySelectorAll(".arch-stage").forEach((el) => {
      const selected = Number(el.dataset.index) === index;
      el.setAttribute("aria-pressed", String(selected));
      el.setAttribute("aria-selected", String(selected));
      el.tabIndex = selected ? 0 : -1;
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
  const modal = document.getElementById("modal");
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
    document.body.classList.add("modal-open");
    modalClose.focus();
    document.addEventListener("keydown", onModalKeydown);
  }

  function closeModal() {
    backdrop.hidden = true;
    document.body.classList.remove("modal-open");
    document.removeEventListener("keydown", onModalKeydown);
    if (lastFocused) lastFocused.focus();
  }

  function onModalKeydown(e) {
    if (e.key === "Escape") closeModal();
    if (e.key === "Tab") {
      const focusable = modal.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
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

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && header.classList.contains("nav-open")) {
      header.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.focus();
    }
  });

  /* ---------- Contact links ---------- */
  const subject = "Automation Enquiry — DeTLeng Ops";
  const body = `Hello DeTLeng Ops team,

I’d like to discuss automating a repetitive business process.

What I would like to automate:
-

How the process works today:
-

Tools or systems currently involved:
-

What a successful result would look like:
-

Approximate volume or frequency:
-

Any additional details:
-

Thank you. I look forward to hearing from you.

Best regards,`;
  const mailto = `mailto:info@detleng.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  document.querySelectorAll(".contact-link").forEach((link) => link.setAttribute("href", mailto));
})();
