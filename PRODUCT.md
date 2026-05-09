# PRODUCT.md — Enciclopedia Naturista de Chile

## Product Purpose

A static PWA herbal encyclopedia covering 85 Chilean medicinal plants and 1,058 traditional recipes from Mapuche, Chilote, and Chilean folk medicine. The design serves the content: users come with a symptom or a plant name and need to find it fast, trust what they read, and apply it safely.

## Register

product

## Users

**Primary**: Chilean adults (25–65) who practice or want to learn traditional herbal medicine. They may be treating themselves or a family member. Many are women managing household health. Mobile-first; some are in rural areas or low-bandwidth situations.

**Secondary**: Students and practitioners of naturopathy and ethnobotany in Chile. They want references and scientific names, not just recipes.

**Context of use**: At home, in a kitchen or garden. Not clinical. Often a moment of need ("I have a headache, what can I make?"). Occasionally leisurely browsing.

## Brand & Tone

Warm, grounded, respectful of ancestral knowledge. Not clinical, not mystical. The app should feel like a well-kept notebook from a knowledgeable grandmother, not a pharmacy app or a wellness startup. Spanish only. Chilean idiom welcome.

**Voice**: Informative but conversational. Direct. Never condescending. Warns when safety matters without causing alarm.

## Anti-References

- Clinical/pharmaceutical apps (white + teal, pill iconography)
- SaaS dashboards (navy + gold, metric cards, data-heavy)
- Wellness startup aesthetics (pastel, sans-serif maximalism, "clean" white space)
- Crypto/dark-mode-by-default vibes (neon on black)
- Anything that reads as generic "herb app" from the App Store

## Strategic Principles

1. **Safety first**: Contraindications and warnings must be impossible to miss. Never bury a danger signal.
2. **Speed of access**: A person with a headache should find a remedy in 2 taps or one search. No gatekeeping.
3. **Offline capable**: PWA with service worker. Core content must work without network.
4. **Credibility**: Show sources, traditional origin, and evidence level. Distinguish "ancestral use" from "clinical study."
5. **No development noise in the UI**: No file paths, scripts, schemas, or technical metadata visible to users.

## What Works Well (Do Not Break)

- Dark earthy palette ("tierra futurista") — distinctive and earned, not default dark mode
- Category gradient system — each body system has its own color identity
- Planta del Día, Favoritos, Notas personales — personal layer makes the app feel alive
- Body-system drill-down for recipe search — replaces old accordion, keep refining
