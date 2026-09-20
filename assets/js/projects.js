/**
 * DeTLeng Ops — Project registry
 * -------------------------------------------------
 * To add a new project later: add one object to this array.
 * Nothing else in the site needs to change — the grid,
 * the modal and the tag filters are all rendered from this data.
 *
 * Fields:
 *  id            unique slug, used for anchors and DOM ids
 *  title         project name
 *  summary       one-sentence description
 *  flow          the pipeline shown as "A → B → C"
 *  status        "planned" | "in-development" | "architecture-ready" | "live"
 *  tags          array of short technology/category tags
 *  pageUrl       optional dedicated project page (null while unbuilt)
 *  githubUrl     optional repo link
 *  demoUrl       optional live demo link
 *  detail        longer text shown in the detail panel when no pageUrl exists
 */

const PROJECTS = [
  {
    id: "lead-automation-engine",
    title: "Lead Automation Engine",
    summary: "Capture, validate and score inbound leads before they ever reach a CRM.",
    flow: ["Webhook", "Validate", "Enrich", "Score", "Database", "Notify"],
    status: "planned",
    tags: ["n8n", "PostgreSQL", "Lead Ops"],
    pageUrl: null,
    githubUrl: null,
    demoUrl: null,
    detail:
      "Normalizes inbound leads from forms, WhatsApp and email into one schema, enriches them with third-party data, scores intent, and writes a clean record before anything touches a CRM."
  },
  {
    id: "ai-customer-support-desk",
    title: "AI Customer Support Desk",
    summary: "Classify and draft support responses, with a human approving anything sent.",
    flow: ["Request", "Classify", "Retrieve", "Draft", "Approve", "Reply"],
    status: "planned",
    tags: ["RAG", "AI Brain", "Human Gate"],
    pageUrl: null,
    githubUrl: null,
    demoUrl: null,
    detail:
      "Triages incoming support requests, retrieves the relevant knowledge, and prepares a draft reply — but nothing reaches a customer without human review."
  },
  {
    id: "rag-knowledge-assistant",
    title: "RAG Knowledge Assistant",
    summary: "Turn internal documents into grounded, source-backed answers.",
    flow: ["Documents", "Embeddings", "Retrieval", "Grounded Answer"],
    status: "planned",
    tags: ["Vector Search", "RAG", "AI Brain"],
    pageUrl: null,
    githubUrl: null,
    demoUrl: null,
    detail:
      "Indexes a document set into a vector store and answers questions with citations back to source material, instead of relying on an unconstrained model response."
  },
  {
    id: "document-invoice-automation",
    title: "Document & Invoice Automation",
    summary: "Extract and validate invoice data on its way into accounting.",
    flow: ["Email / Upload", "Extraction", "Validation", "Database", "Accounting Handoff"],
    status: "planned",
    tags: ["OCR", "PostgreSQL", "Operations"],
    pageUrl: null,
    githubUrl: null,
    demoUrl: null,
    detail:
      "Reads incoming invoices and documents, extracts structured fields, validates them against business rules, and hands off a clean record to accounting systems."
  },
  {
    id: "multi-agent-operations",
    title: "Production Multi-Agent Operations",
    summary: "Specialized agents working under one audit trail and one approval layer.",
    flow: ["Orchestrate", "Specialize", "Approve", "Audit", "Monitor"],
    status: "planned",
    tags: ["Multi-Agent", "Human Gate", "Observability"],
    pageUrl: null,
    githubUrl: null,
    demoUrl: null,
    detail:
      "Coordinates multiple specialized agents against one shared operational contract, so every action is still approvable, auditable and monitored."
  },
  {
    id: "custom-integration-workflow",
    title: "Custom Integration / API Workflow",
    summary: "Purpose-built integration between systems that don't talk to each other yet.",
    flow: ["API", "Authentication", "Pagination", "Transformation", "Business Action"],
    status: "planned",
    tags: ["REST API", "OAuth", "Integration"],
    pageUrl: null,
    githubUrl: null,
    demoUrl: null,
    detail:
      "A template for connecting two systems that don't natively integrate — authentication, pagination and data transformation handled once, reused per client."
  }
];

const STATUS_LABEL = {
  "planned": "Planned",
  "in-development": "In development",
  "architecture-ready": "Architecture ready",
  "live": "Live"
};
