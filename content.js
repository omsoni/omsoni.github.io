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
    role: "Architecture Leader · Enterprise AI Strategist & Enabler · Principal Solution Architect",
    tagline: "Enterprise & Solution Architecture · AI Enablement · Cloud-Native Platforms",
    githubUsername: "omsoni",
    email: "omsoni@gmail.com",
    blurb:
      "Enterprise Architecture leader with 20+ years across Fortune 500 " +
      "organizations and startups — defining enterprise-wide architecture " +
      "strategy, aligning business capabilities with technology platforms, and " +
      "driving large-scale, AI-enabled transformation with measurable impact.",
    strengths: [
      "Enterprise Architecture",
      "Enterprise AI Strategy and Enablement",
      "Solution Architecture",
      "SaaS and Startup Experience",
      "Hands-on Software Engineering Leader",
      "Helping Organizations with AI Enablement",
    ],
    links: [
      { label: "LinkedIn", url: "https://www.linkedin.com/in/omsoni/", type: "external" },
      { label: "GitHub", url: "https://github.com/omsoni", type: "external" },
      { label: "Email", url: "mailto:omsoni@gmail.com", type: "external" },
    ],
  },

  /* Top navigation — shared on every page. `key` matches a page below.
     Add `children: [...]` to make a dropdown of sub-pages.            */
  nav: [
    { label: "Home",                    href: "index.html",                   key: "home" },
    { label: "Architectures",           href: "architectures.html",           key: "architectures" },
    { label: "AI / ML",                 href: "ai-ml.html",                    key: "ai-ml" },
    { label: "Enterprise Architecture", href: "enterprise-architecture.html",  key: "enterprise-architecture" },
    {
      label: "Platform Architectures", href: "platform-architectures.html", key: "platform-architectures",
      children: [
        { label: "Personalization Platform", href: "personalization-platform-architecture.html", key: "personalization-platform-architecture" },
      ],
    },
  ],

  pages: {
    /* ------------------------------------------------------------------ */
    home: {
      hero: true,
      sections: [
        {
          heading: "Professional Summary",
          markdown:
            "20+ years as Chief Architect, Principal Enterprise Architect, and " +
            "technology strategist across Fortune 500 organizations and startups. " +
            "Proven track record of defining enterprise-wide architecture strategy, " +
            "aligning business capabilities with technology platforms, and driving " +
            "large-scale transformation. Deep expertise in cloud-native platforms, " +
            "enterprise data ecosystems, and AI-driven systems — with a focus on " +
            "scalability, governance, and measurable business impact.\n\n" +
            "## Core Expertise\n" +
            "- **Architecture:** Enterprise & solution architecture, reference architectures, roadmaps, Architecture Review Boards\n" +
            "- **Cloud-native:** AWS, Azure, GCP — Kubernetes, serverless, microservices, APIs\n" +
            "- **Data:** Data lakes & warehouses, DaaS, enterprise data models — SQL/NoSQL, graph, time-series, in-memory\n" +
            "- **AI / ML:** Deep learning (MLP/CNN/RNN), NLP (Transformers, RAG), LLMs (Claude, GPT, HF), Agentic AI (LangChain), MCP\n" +
            "- **Languages:** Java, Python, Go, C++, R",
        },
        {
          heading: "Technology Leadership",
          markdown:
            "- **Principal Enterprise Architect (Director, IC)** — Expedia Group — Mar 2025 to Present\n" +
            "- **Principal Engineer** — GEICO — Dec 2023 to Mar 2025\n" +
            "- **Principal Architect & Engineer** — Neiman Marcus — Oct 2021 to Aug 2023\n" +
            "- **Co-founder & Chief Architect** — Gignav — Jun 2019 to Oct 2021\n" +
            "- **Principal Architect / Director, Software Engineering** — GE Digital — Sep 2016 to Mar 2019\n" +
            "- **Senior Enterprise Architect** — GE Aviation — Mar 2014 to Aug 2016\n" +
            "- **Chief Applications Architect** — GE Transportation — Sep 2011 to Mar 2014\n" +
            "- **Enterprise Architect** — GE Capital — Feb 2010 to Sep 2011",
        },
        {
          heading: "Certifications & Education",
          markdown:
            "## Certifications\n" +
            "- AWS Certified Solution Architect – Professional (2023–2026)\n" +
            "- TOGAF Certified Enterprise Architect Practitioner (2023–2026)\n\n" +
            "## Education\n" +
            "- M.S., Data & Analytics — Wayne State University\n" +
            "- PG Diploma in AI/ML — The University of Texas at Austin (2025–2026)",
        },
        {
          heading: "Focus Areas",
          body: "Pick an area to explore reference architectures, diagrams, and links.",
          links: [
            { label: "Architectures",            url: "architectures.html",                  type: "internal" },
            { label: "AI / ML",                  url: "ai-ml.html",                          type: "internal" },
            { label: "Enterprise Architecture",  url: "enterprise-architecture.html",        type: "internal" },
            { label: "Platform Architectures",   url: "platform-architectures.html",         type: "internal" },
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
    architectures: {
      title: "Architectures",
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
        {
          heading: "RAG Assistant — Medical Q&A over the Merck Manual",
          body:
            "A Retrieval-Augmented Generation system that answers clinical questions " +
            "grounded in the Merck Manual. Generation uses Meta-Llama-3-8B-Instruct; " +
            "retrieval pairs a ChromaDB vector store with a cross-encoder reranker " +
            "(top-20 → top-5). An independent Mistral-7B judge LLM scores answers for " +
            "groundedness, relevance, and faithfulness. Shipped as a Dockerized Hugging " +
            "Face Space with a Flask API and Streamlit UI — covering the full lifecycle " +
            "from prompt engineering → retrieve/rerank/generate → evaluation → deployment.",
          diagrams: [
            {
              type: "image",
              caption: "RAG Assistant architecture",
              src: "https://drive.google.com/uc?id=1-0_pjR7gg07Zxt7uiZFHP-xpWqBfeqT_",
            },
          ],
          links: [
            { label: "RAG Assistant (repo)", url: "https://github.com/omsoni/llm-rag-work", type: "github" },
            { label: "Hugging Face", url: "https://huggingface.co/omsoni", type: "external" },
          ],
        },
        {
          heading: "Predictive Maintenance — Wind Turbine Failure",
          body:
            "Binary classification of wind-turbine generator failure from 40 anonymized " +
            "sensor features under severe class imbalance (~95% / 5%). Iterates through " +
            "six feedforward neural-network architectures (BatchNorm, Dropout, He init, " +
            "AdamW, L2, focal loss, LR scheduling) and selects the final model with a " +
            "cost-sensitive framework that weights false negatives at 10× false positives. " +
            "The chosen model reaches ~99% accuracy with ~88% failure recall. Built with " +
            "TensorFlow/Keras and scikit-learn.",
          links: [
            { label: "Predictive Maintenance (repo)", url: "https://github.com/omsoni/predictive-maintenance", type: "github" },
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

    /* ------------------------------------------------------------------ */
    "platform-architectures": {
      title: "Platform Architectures",
      intro:
        "End-to-end platform designs — the systems, data flows, and integrations " +
        "behind each capability.",
      sections: [
        {
          heading: "Platforms",
          body: "Detailed reference architecture for each platform.",
          links: [
            { label: "Personalization Platform Architecture", url: "personalization-platform-architecture.html", type: "internal" },
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    "personalization-platform-architecture": {
      title: "Personalization Platform Architecture",
      intro:
        "Real-time, identity-aware personalization across web, mobile, and email — " +
        "built on AWS with a Snowflake customer-data foundation.",
      sections: [
        {
          heading: "Overview",
          markdown:
            "The **Personalization Platform** unifies clickstream ingestion, identity " +
            "resolution, data enrichment, and ML-driven recommendations on AWS. It " +
            "integrates best-of-breed SaaS — **Merkle** (identity), **Reltio** (Customer " +
            "MDM), **ActionIQ** (CDP), **Optimizely** (experimentation), and **Contentful / " +
            "Contently** (content) — around a **Snowflake** customer-data foundation, " +
            "serving personalized experiences through the Tealium experience layer.",
        },
        {
          heading: "Reference Architecture",
          body: "A reference architecture for a luxury-retail personalization platform (anonymized case study).",
          diagrams: [
            {
              type: "plantuml",
              caption: "Personalization platform — AWS reference architecture",
              source: String.raw`@startuml
title Retail Personalization Platform

skinparam componentStyle rectangle
skinparam shadowing false
skinparam defaultFontSize 12
skinparam rectangle {
  BackgroundColor White
  BorderColor #6c8ebf
  roundCorner 0
}
skinparam package {
  BackgroundColor #f8fafc
  BorderColor #94a3b8
}
skinparam rectangle<<aws>> {
  BackgroundColor #FFF3E6
  BorderColor #ED7100
}
skinparam rectangle<<saas>> {
  BackgroundColor #DAE8FC
  BorderColor #6C8EBF
}

package "Edge & Channels" {
  rectangle "Customers" <<saas>> as customers
  rectangle "Channel\n(Web, Mobile Apps)" as channel
  rectangle "CDN (Fastly)" as cdn
  rectangle "Experience Layer\n(Tealium)" as exp
}

package "1 - Identity Resolution & Stitching" as P1 {
  rectangle "API Gateway\n(Clickstream)" <<aws>> as apigwCS
  rectangle "Clickstream API\nLambda" <<aws>> as lambdaCS
  rectangle "SQS" <<aws>> as sqs
  rectangle "Identity Resolution\nLambda" <<aws>> as lambdaIR
  rectangle "Merkle\n(Mercury)" <<saas>> as merkle
  rectangle "Identity\nDynamoDB" <<aws>> as ddbId
}

package "2 - Streaming, Enrichment & Analytics" as P2 {
  rectangle "Raw Data\n(Kinesis Streams)" <<aws>> as kdsRaw
  rectangle "Enrichment\nLambda" <<aws>> as lambdaEnr
  rectangle "Kinesis\nStreams" <<aws>> as kds2
  rectangle "Kinesis\nFirehose" <<aws>> as firehose
  rectangle "S3\n(Analytics)" <<aws>> as s3analytics
  rectangle "Glue" <<aws>> as glueA
  rectangle "Athena" <<aws>> as athena
  rectangle "QuickSight" <<aws>> as quicksight
  rectangle "Snowflake DW\n(Product Data)" as snowProd
}

package "3 - Personalization & Recommendations" as P3 {
  rectangle "API Gateway\n(GET /personalize)" <<aws>> as apigwP13N
  rectangle "P13N\nLambda" <<aws>> as lambdaP13N
  rectangle "Personalize\nLambda" <<aws>> as lambdaPers
  rectangle "AWS Personalize" <<aws>> as personalize
  rectangle "Recs\nDynamoDB" <<aws>> as ddbRecs
  rectangle "Glue" <<aws>> as glueP
  rectangle "S3\n(Datasets)" <<aws>> as s3datasets
  rectangle "S3\n(Batch Recs)" <<aws>> as s3recs
}

package "Content" {
  rectangle "Contentful\n(Headless CMS)" <<saas>> as contentful
  rectangle "Contently\n(Digital Asset Mgmt)" <<saas>> as contently
}

package "Delivery & Catalog" {
  rectangle "Delivery APIs" as delivery
  rectangle "Inventory, Pricing" as inv
  rectangle "Elastic Search" as es
  rectangle "Product Database" as prodDB
  rectangle "Snowflake DW\n(Catalog)" as snowCat
}

package "Customer Data Platform" {
  rectangle "Snowflake DW" as snowDW {
    rectangle "Segments" as seg
    rectangle "Profiles" as prof
    rectangle "Purchase History" as ph
    rectangle "Products" as prod
    rectangle "Preferences" as pref
    rectangle "Affinity" as aff
  }
  rectangle "Reltio\n(Customer MDM)" <<saas>> as reltio
  rectangle "ActionIQ\n(CDP)" <<saas>> as actioniq
  rectangle "AWS Sagemaker\n(ML Models)" <<aws>> as sagemaker
}

rectangle "Optimizely\n(Experimentation)" <<saas>> as optimizely

' ---- Edge flow ----
customers --> channel
channel --> cdn
cdn --> exp : Identity Resolution

' ---- Experience layer fan-out ----
exp --> apigwCS : Clickstream
exp --> apigwP13N : GET /personalize
exp --> contentful
exp --> delivery
exp --> optimizely

' ---- 1. Identity resolution ----
apigwCS --> lambdaCS
lambdaCS --> ddbId : Get Guest Identity
lambdaCS --> sqs : SNS
sqs --> merkle : No ucaId Found
sqs --> lambdaIR
lambdaIR --> merkle
lambdaIR --> ddbId : save resolved identity

' ---- 2. Streaming / enrichment / analytics ----
lambdaCS --> kdsRaw
lambdaEnr --> kdsRaw
lambdaEnr --> kds2
lambdaEnr --> snowProd : Retrieve Product Data\n(Pricing, Category, Brand)
kds2 --> firehose
firehose --> s3analytics
s3analytics --> glueA
glueA --> athena
athena --> quicksight

' ---- 3. Personalization / recommendations ----
apigwP13N --> lambdaP13N
lambdaP13N --> ddbRecs : Read Recs
lambdaPers --> kds2 : Get Enriched Data
lambdaPers --> personalize
personalize --> s3datasets : Upload Datasets
personalize --> s3recs : Batch Recs
glueP --> s3datasets : Prepare Datasets
glueP --> s3recs : Read Recs
glueP --> ddbRecs : Load Recs

' ---- Content ----
contently --> contentful : Publish

' ---- Delivery & catalog ----
delivery --> es
delivery --> inv
prodDB --> es
snowCat --> es

' ---- Customer data platform ----
reltio --> snowDW
actioniq --> snowDW
snowDW --> s3datasets
sagemaker --> snowDW

legend right
  Service types
  |<#FFF3E6> AWS service |
  |<#DAE8FC> Third-party / SaaS |
  |<#FFFFFF> Internal store / app |
  --
  Numbered flows
  1  Clickstream ingest + identity resolution
  2  Enrichment, analytics & model training
  3  Real-time personalized delivery
endlegend

@enduml`,
            },
          ],
          links: [
            { label: "AWS Personalize", url: "https://aws.amazon.com/personalize/", type: "external" },
            { label: "AWS Well-Architected", url: "https://aws.amazon.com/architecture/well-architected/", type: "external" },
          ],
        },
        {
          heading: "Key Flows",
          markdown:
            "## 1 — Clickstream Ingestion & Identity Resolution\n" +
            "Channel traffic flows through the **Fastly CDN** into the **Tealium** experience " +
            "layer, then to the Clickstream API Gateway and Lambda. The Lambda looks up guest " +
            "identity in **DynamoDB** and publishes events via SNS/SQS; an Identity Resolution " +
            "Lambda stitches identities against **Merkle (Mercury)** and writes the resolved " +
            "identity back to DynamoDB.\n\n" +
            "## 2 — Enrichment, Analytics & Model Training\n" +
            "Events land in **Kinesis Data Streams** and are enriched (pricing, category, brand) " +
            "by an Enrichment Lambda backed by **Snowflake**. **Firehose** delivers raw data to " +
            "**S3**, where **Glue**, **Athena**, and **QuickSight** power analytics. Curated " +
            "datasets feed **AWS Personalize** for model training.\n\n" +
            "## 3 — Real-Time Personalized Delivery\n" +
            "`GET /personalize` hits the P13N API Gateway and Lambda, which reads precomputed " +
            "recommendations from **DynamoDB**. AWS Personalize writes batch recs to S3; Glue " +
            "prepares datasets and loads recs into DynamoDB for low-latency reads.",
        },
        {
          heading: "Business Goals",
          markdown:
            "- Targeted outreach: grow customer identification from **4% to 12%**\n" +
            "- Increase conversion by **2%**\n" +
            "- Increase abandoned-cart conversion by **5–10%**\n" +
            "- Capture data for customer-behavior analytics",
        },
        {
          heading: "Platform Capabilities",
          markdown:
            "- Identity Resolution\n" +
            "- Content Personalization\n" +
            "- Real-time Personalized Recommendations\n" +
            "- Segment-based Personalization\n" +
            "- Affinity-based Personalization\n" +
            "- Promotions & Coupons\n" +
            "- Email Personalization\n" +
            "- Experimentation (A/B Testing)\n" +
            "- Analytics Dashboard",
        },
        {
          heading: "Non-Functional Requirements",
          markdown:
            "- **Response time:** 50 ms to preserve personalization\n" +
            "- **Throughput:** 25 requests/sec\n" +
            "- **Scalability:** on-demand\n" +
            "- **Availability:** 99%\n" +
            "- **Latency:** p99 of 100 ms\n" +
            "- Graceful degradation & **fallback recommendations**\n" +
            "- Recommendation consistency\n" +
            "- Circuit breakers\n" +
            "- Observability",
        },
        {
          heading: "Teams Involved",
          markdown:
            "- MarTech\n" +
            "- eCommerce\n" +
            "- Data Science\n" +
            "- Cloud Infrastructure",
        },
      ],
    },
  },
};
