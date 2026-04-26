---
title: "<i>The Flying Dutchman</i>: &nbsp;Team Lead,&nbsp; Gameplay Programming - <i>Spring 2025</i>"
layout: post
categories: Portfolio
date: 2025-01-04
hidedate: true
---

![Intro Art](https://isaacwkm.github.io/assets/images/2025-01-04-Dutchman/lighthouse_night.png)

Placed Top 7% at Global Game Jam, Rising Tide 1 (73rd / 1000+ entries)<br>
*Unity (C#) | 4-person core team*

<!-- Trailer Embed -->
<!-- Replace with YouTube/Vimeo embed or link -->

<iframe width="560" height="315" src="https://www.youtube.com/embed/d2Q0EGJr9Hg?si=Nay1U3OA_oeAC7cV" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

---

**Overview**  
Flying Dutchman is a first-person exploration and mystery game where players investigate scattered islands, uncover clues, and unlock new areas through interconnected progression systems. Inspired by games that were personally influencial in the exploration genre; Outer Wilds, Majora's Mask, and Sea of Thieves.

---

## My Role

- Project Lead for a 4-person core team  
- Coordinated with 12+ external collaborators (art, audio, etc.)  
- Owned core gameplay systems and technical implementation  

---

## Key Contributions

### Gameplay Systems
- Designed and implemented physics-based interaction systems  
- Built inventory system and interaction logics  
- Developed core progression systems linking clue discovery to island traversal  

### Technical Art / Visuals
- Developed post-processing pipeline to enhance atmosphere and visual fidelity  
- Tuned lighting and rendering settings to support the game’s tone  
- *(See screenshots below for before/afters)*

### Team Leadership
- Facilitated communication between developers and external contributors  
- Managed task flow and ensured timely integration of assets  
- Maintained development velocity with time constraints (global game jam, internal milestones, and periodic pitch-decks with instructors)  

---

## Visual Development (Before/afters)

![Before-After 1](https://isaacwkm.github.io/assets/images/2025-01-04-Dutchman/beforeafters/ba_1.1.png)

![Before-After 2](https://isaacwkm.github.io/assets/images/2025-01-04-Dutchman/beforeafters/ba_1.2.png)

*Fischer's Lookout, a satellite island, floating above the larger desert prison island, Edelweiss.*

The most helpful techniques were making use of lookup tables, small amounts of posterization and pixel blurring (kuwahara filter), and shaders on background scenery.

![Before-After 3](https://isaacwkm.github.io/assets/images/2025-01-04-Dutchman/beforeafters/ba_2.1.png)

![Before-After 4](https://isaacwkm.github.io/assets/images/2025-01-04-Dutchman/beforeafters/ba_2.2.png)

*Post-processing and technical art improvements applied during development.*

Lookup tables (LUTs) helped dampen the harsh colors and higher-saturated colors. This allowed our art pipeline to have looser color use restrictions on our 3D modelers, as the LUTs would dampen any extreme color values to the closest acceptable color.

---

## Image Gallery

<div class="image-gallery">
  <figure>
    <img src="https://isaacwkm.github.io/assets/images/2025-01-04-Dutchman/shrimp_band.png" alt="Shrimp band scene">
    <figcaption>Shrimp band encounter.</figcaption>
  </figure>
  <figure>
    <img src="https://isaacwkm.github.io/assets/images/2025-01-04-Dutchman/lighthouse_night.png" alt="Lighthouse at night">
    <figcaption>Lighthouse scene at night.</figcaption>
  </figure>
  <figure>
    <img src="https://isaacwkm.github.io/assets/images/2025-01-04-Dutchman/birds_sunset.png" alt="Birds at sunset">
    <figcaption>Sunset island composition.</figcaption>
  </figure>
  <figure>
    <img src="https://isaacwkm.github.io/assets/images/2025-01-04-Dutchman/opening_shot.png" alt="Opening shot">
    <figcaption>Opening island shot.</figcaption>
  </figure>
</div>

### Gallery Setup

To add a horizontal image gallery in another post, paste this structure and swap the image paths:

```html
<div class="image-gallery">
  <figure>
    <img src="https://isaacwkm.github.io/assets/images/YOUR-FOLDER/image-1.png" alt="Short description of image 1">
    <figcaption>Optional caption for image 1.</figcaption>
  </figure>
  <figure>
    <img src="https://isaacwkm.github.io/assets/images/YOUR-FOLDER/image-2.png" alt="Short description of image 2">
    <figcaption>Optional caption for image 2.</figcaption>
  </figure>
</div>
```

---

## Gameplay Loop

1. Explore islands and search for clues  
2. Use discovered information to unlock new areas  
3. Traverse between islands (new and previously explored)  
4. Repeat with deeper layers of progression  

---

## Results

- Ranked **73rd out of 1000+ entries** at Global Game Jam (~Top 7%)

<!-- Optional Proof Screenshot -->
![Leaderboard Proof]()

---

## Reflection *(optional but strong for portfolio)*

- What worked:
  - [e.g., Strong visual identity through post-processing]
  - [e.g., Flexible gameplay systems enabled fast iteration]

- Challenges:
  - [e.g., Coordinating large number of external contributors]
  - [e.g., Balancing scope within jam timeframe]

- What I would improve:
  - [e.g., Expand progression depth]
  - [e.g., Refactor systems for scalability]

---

## Links

- [Playable Build](LINK)
- [Source Code / GitHub](LINK)
- [Additional Media](LINK)
