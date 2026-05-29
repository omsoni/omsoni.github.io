/* =========================================================================
   content.js — EDIT THIS FILE to manage the whole site.
   No HTML needed. render.js turns this data into pages.

   ── How to add things ────────────────────────────────────────────────────
   LINK:    { label: "Text shown", url: "https://...", type: "github" }
            type is one of:  "github" | "external" | "internal"
            ("internal" = a link to another page on this site, e.g. "ai-ml.html")

   DIAGRAM (PlantUML, rendered live via plantuml.com, no build step):
            { type: "plantuml", caption: "Optional caption",
              source: `@startuml
                       Alice -> Bob: Hi
                       @enduml` }

   IMAGE (any URL — GitHub, plantuml, or anywhere else):
            { type: "image", caption: "Optional", src: "https://.../pic.png" }

   To add a whole new page: add a key under `pages`, then add a matching
   .html file (copy an existing one) and a nav entry below.
   ========================================================================= */

const SITE = {
  /* PlantUML server. Swap for a self-hosted instance later if you want. */
  plantumlServer: "https://www.plantuml.com/plantuml",
  plantumlFormat: "svg", // "svg" (crisp) or "png"

  profile: {
    name: "Om Soni",
    role: "Senior Enterprise Architect",
    tagline: "Software · AI/ML · Enterprise Architecture",
    githubUsername: "omsoni",
    email: "om.soni@gignav.com",
    blurb:
      "Enterprise Architect working across software, AI/ML, and platform " +
      "engineering. This site collects reference architectures, diagrams, and " +
      "links to the work behind them.",
    links: [
      { label: "GitHub", url: "https://github.com/omsoni", type: "external" },
      { label: "Email", url: "mailto:om.soni@gignav.com", type: "external" },
      // { label: "LinkedIn", url: "https://www.linkedin.com/in/...", type: "external" },
    ],
  },

  /* Top navigation — shared on every page. `key` matches a page below. */
  nav: [
    { label: "Home",                    href: "index.html",                  key: "home" },
    { label: "Software Architecture",   href: "software-architecture.html",  key: "software-architecture" },
    { label: "AI / ML",                 href: "ai-ml.html",                  key: "ai-ml" },
    { label: "Enterprise Architecture", href: "enterprise-architecture.html",key: "enterprise-architecture" },
  ],

  pages: {
    /* ------------------------------------------------------------------ */
    home: {
      hero: true,
      sections: [
        {
          heading: "Focus Areas",
          body: "Pick an area to explore reference architectures, diagrams, and links.",
          links: [
            { label: "Software Architecture",   url: "software-architecture.html",   type: "internal" },
            { label: "AI / ML",                 url: "ai-ml.html",                    type: "internal" },
            { label: "Enterprise Architecture", url: "enterprise-architecture.html",  type: "internal" },
          ],
        },
        {
          heading: "GitHub Projects",
          body: "Public repositories, pulled live from GitHub.",
          repos: { limit: 9, includeForks: false, sort: "updated" },
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    "software-architecture": {
      title: "Software Architecture",
      intro:
        "Patterns and reference designs for building resilient, scalable systems.",
      sections: [
        {
          heading: "Event-Driven Microservices",
          body:
            "A reference topology: services communicate asynchronously through a " +
            "message broker, with an API gateway fronting synchronous traffic.",
          diagrams: [
            {
              type: "plantuml",
              caption: "Event-driven service topology",
              source: `@startuml
skinparam componentStyle rectangle
actor Client
[API Gateway] as GW
queue "Event Bus" as BUS
[Order Service] as ORD
[Payment Service] as PAY
[Notification Service] as NOTI
database "Order DB" as ODB

Client --> GW
GW --> ORD
ORD --> ODB
ORD --> BUS : OrderPlaced
BUS --> PAY
BUS --> NOTI
@enduml`,
            },
          ],
          links: [
            { label: "Reference implementation (repo)", url: "https://github.com/omsoni", type: "github" },
            { label: "12-Factor App", url: "https://12factor.net", type: "external" },
          ],
        },
        {
          heading: "C4 Container View",
          body: "Document systems at the right altitude using the C4 model.",
          diagrams: [
            {
              type: "plantuml",
              caption: "C4-style container diagram",
              source: `@startuml
left to right direction
actor User
rectangle "Web App\\n[SPA]" as WEB
rectangle "API\\n[Service]" as API
database "PostgreSQL" as DB
cloud "Auth Provider" as AUTH

User --> WEB
WEB --> API : JSON/HTTPS
API --> DB : reads/writes
API --> AUTH : OIDC
@enduml`,
            },
          ],
          links: [
            { label: "C4 Model", url: "https://c4model.com", type: "external" },
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    "ai-ml": {
      title: "AI / ML",
      intro:
        "Machine learning systems, MLOps pipelines, and applied AI architecture.",
      sections: [
        {
          heading: "ML Training & Serving Pipeline",
          body:
            "From raw data to a served model, with a feature store and a model " +
            "registry gating what reaches production.",
          diagrams: [
            {
              type: "plantuml",
              caption: "End-to-end MLOps flow",
              source: `@startuml
skinparam componentStyle rectangle
[Raw Data] --> [Feature Pipeline]
[Feature Pipeline] --> [Feature Store]
[Feature Store] --> [Training Job]
[Training Job] --> [Model Registry]
[Model Registry] --> [Model Serving]
[Model Serving] --> [Application]
[Application] --> [Monitoring]
[Monitoring] --> [Feature Pipeline] : drift signal
@enduml`,
            },
          ],
          links: [
            { label: "Hugging Face", url: "https://huggingface.co/omsoni", type: "external" },
            { label: "Notebooks (repo)", url: "https://github.com/omsoni", type: "github" },
          ],
        },
        {
          heading: "Retrieval-Augmented Generation (RAG)",
          body:
            "Grounding an LLM in your own documents via embeddings and a vector store.",
          diagrams: [
            {
              type: "plantuml",
              caption: "RAG request flow",
              source: `@startuml
actor User
User -> "App": question
"App" -> "Embedder": embed query
"Embedder" -> "Vector DB": similarity search
"Vector DB" --> "App": top-k chunks
"App" -> "LLM": prompt + context
"LLM" --> "App": grounded answer
"App" --> User: answer + sources
@enduml`,
            },
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    "enterprise-architecture": {
      title: "Enterprise Architecture",
      intro:
        "Aligning business capabilities, applications, data, and technology.",
      sections: [
        {
          heading: "Capability → Application Mapping",
          body:
            "Business capabilities mapped to the applications that realize them — " +
            "the backbone of application portfolio management.",
          diagrams: [
            {
              type: "plantuml",
              caption: "Capability to application map",
              source: `@startuml
skinparam componentStyle rectangle
package "Business Capabilities" {
  [Customer Mgmt]
  [Order Mgmt]
  [Billing]
}
package "Applications" {
  [CRM]
  [Commerce Platform]
  [Billing System]
}
[Customer Mgmt] --> [CRM]
[Order Mgmt] --> [Commerce Platform]
[Billing] --> [Billing System]
@enduml`,
            },
          ],
          links: [
            { label: "TOGAF", url: "https://www.opengroup.org/togaf", type: "external" },
            { label: "ArchiMate", url: "https://www.opengroup.org/archimate-forum", type: "external" },
          ],
        },
        {
          heading: "Technology Layers",
          body: "A layered view from channels down to infrastructure.",
          diagrams: [
            {
              type: "plantuml",
              caption: "Layered enterprise view",
              source: `@startuml
rectangle "Channels\\n(web, mobile, partner APIs)" as CH
rectangle "Business Services" as BS
rectangle "Application Services" as AS
rectangle "Data Services" as DS
rectangle "Infrastructure\\n(cloud, network, security)" as INF
CH --> BS
BS --> AS
AS --> DS
DS --> INF
@enduml`,
            },
          ],
        },
      ],
    },
  },
};
