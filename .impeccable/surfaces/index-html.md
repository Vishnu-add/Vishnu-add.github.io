---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: ["card.html","project.html","cv.html"]
---

# Surface brief: home page (index.html)

Scope: the home page, plus the shared stylesheet that carries the world to card.html, project.html and cv.html chrome.
Mode: Experience (portfolio), with a Persuade close: the visitor should end up emailing.
Audience and job: PhD admissions reviewers and supervisors with about 90 seconds, who need to name the research contribution and find contact. Recruiters and phone visitors are secondary.
Proof on hand: 1 accepted paper (ISTM 2026), 3 under review, 1 planned, 1 ongoing; 4 flagship projects; hand-built animated diagrams per thread and project.
Constraints: plain HTML, CSS and JS from data.json; light and dark themes; extracurriculars stay on the page; the map draws only connections recorded in data.json.

## Direction contract

THESIS: The research is a transit network. Themes are lines, papers and projects are stations, and publication status is the station marker. The page refuses the category default: dark canvas, neon accent, terminal costume and a split hero with a portrait.

OWN-WORLD: Vignelli/Beck signage. A cool white ground (#f5f6f8) and white panels, ink text (#0d1117), five saturated line colours used only as routes and bullets (blue, red, green, amber, purple). Black signage bands carry section titles in white, with lettered line bullets. One grotesk (Archivo) at 800 for display and 400 to 600 for text, with tabular figures. Square-ish 6px corners. No glow, no gradients, no grid paper, no mono costume.

STORY: The visitor sees the whole research network at once and understands that it is real work with honest statuses. Hovering a station previews its animated diagram, and clicking goes deeper. They believe the contribution is concrete, then reach the terminus and email.

FIRST VIEWPORT: Left 5/12: a small portrait, the name in Archivo 800 at about 56px, an affiliation line, a one-sentence research claim, an "Accepted · ISTM 2026" station row, and actions: "Email me" (ink, primary) and "CV". Right 7/12: the map in a white frame at full column width, with the legend under it and a station preview panel (diagram, title, status, link). Nav above: name, section links, CV, Contact.

FORM: transit diagram, position 7 of 7 on my grounded list; seed:a53da6a31c922544. Signature interaction: station hover or focus previews in the panel, and a click opens the write-up. Motion grammar: lines draw in once on load (staggered, ease-out), everything else is static; reduced motion shows the drawn map.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

Unresolved: the owner has not explicitly confirmed the two interchanges (Deep Research Agent on Agentic systems × Shipped; Sight-Sphere on Edge perception × Shipped). They live in data.json under map so the owner can change them.
