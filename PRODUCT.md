# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: people deciding whether to invite Vishnu into a **PhD or research position**: admissions committees, supervisors and research-lab recruiters. They have little time (assume a first look of roughly 90 seconds) and want to know what research he does, how strong the evidence is, and how to contact him.

Secondary (supported, not leading): industry AI/ML recruiters and hiring managers, and research collaborators, including people opening the site on a phone.

## Product Purpose

A personal academic and professional portfolio for Vishnu Vardhan Addanki Tirumala, an AI researcher and engineer (Masters in AI & Data Science, exchange at the University of Agder, Norway). It exists to get him PhD or research positions, internships and collaborations in vision-language models, interpretable ML, edge AI and agentic systems. Success is a reviewer understanding his research contribution quickly and getting in touch.

## Positioning

A research-first portfolio where each research thread and project is explained by its own hand-built, animated diagram (for example the LoRA `h = Wx + B·A·x` figure, the RGB/thermal/NIR wildfire tile, the terrain-walking robot). Another applicant's site could copy the layout, not these diagrams or the work behind them.

## Operating Context

- Static site: `index.html` is a shell, `app.js` renders everything from `data.json`; `style.css`, plus `card.html` (profile card with QR and vCard), `cv.html` (print-ready A4 CV), `project.html?id=…` (project write-ups), and `contact.html` / `projects.html` redirects to home sections.
- Hosted as a GitHub Pages user site (repo `Vishnu-add.github.io`).
- Content is edited in `data.json`; PDFs live in `assets/`, media in `media/`.
- The owner's own notes are in `list.md` (known UI issues: fixed image sizes, content only showing on scroll, videos without ids/captions, links as list).

## Capabilities and Constraints

- Home sections: hero, research threads (with publication status badges), experience, projects (17 with category filters), skills, credentials, contact.
- Keep the stack: plain HTML, CSS and vanilla JS driven by `data.json`; no build step.
- Resume and CV are available as PDFs (`assets/Vishnu_Resume.pdf`, `assets/Vishnu_CV.pdf`); `cv.html` is the printable version.
- Light and dark themes exist and must keep working.
- **Flagship projects (home page tier):** Deep Research Agent, Sight-Sphere Communicator, EduBot (university RAG), AI video generator. The remaining projects stay reachable but are secondary.
- **Extracurriculars and certificates** (Dance Club head, flash mobs, MUN, NCC A/B/C, certifications) **stay on the home page** by the owner's decision. Their placement should not push Contact far down.
- Open to remote or on-site work anywhere in the world.
- Known data bug to fix: a stray " , " appears where a dash belongs in dates and roles.
- Terminology to clarify for non-academics: "Communicated" means submitted for review.

## Brand Commitments

- Name: Vishnu Vardhan Addanki Tirumala.
- No binding visual constraints. The owner is open to a new visual direction, so the current look is evidence, not a requirement.

## Evidence on Hand

- 1 accepted paper: "Clause Sanitization for Compact and Interpretable Tsetlin Machines", ISTM 2026.
- 3 papers under review: CVPR 2027 (Master's thesis on where LoRA falls short in multimodal learning), IEEE Transactions on Artificial Intelligence (interpretable ML for distributed systems), International Journal of Applied Earth Observation and Geoinformation (sensing-agnostic wildfire segmentation).
- 1 planned submission: IEEE Internet of Things Journal (real-time terrain classification for humanoid robots).
- 1 ongoing course research project: agentic AI in a mechatronics building pipeline (University of Agder).
- Experience: University Research Assistant (Agder, from Jan 2026), Phenom People (ML engineer), Wadhwani AI, Omdena AI, AICTE, ECIL.
- Links: GitHub, LinkedIn, ORCID.
- Not on hand, so do not fabricate: arXiv or PDF links for the papers, testimonials, metrics beyond what `data.json` states.

## Product Principles

1. Research first: the first screen names the research contribution and the accepted paper.
2. Show, don't claim: the authored diagrams carry the evidence.
3. Respect a 90-second reader: lead with a few strong items and keep the rest reachable.
4. Contact is always one click away.
5. Plain language for status and jargon.

## Accessibility & Inclusion

No product-specific standard was stated; aim for WCAG AA. The critique found gaps: contrast on faint text, no skip link, no focus styling, touch targets under 44px. The audience includes keyboard and screen-reader users and visitors on phones.
