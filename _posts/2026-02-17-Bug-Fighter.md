---
title: "<i>Bug Fighter</i>: &nbsp;Multiplayer Networking, &nbsp;Team Lead - <i>2026 to Current</i>"
layout: post
categories: Portfolio
date: 2026-02-17
hidedate: true
featured: false
---

![Bug Fighter Cover](https://isaacwkm.github.io/assets/images/2026-02-17-BugFight/Cover.png)


A Unity 2D fighting game prototype focused on online-ready simulation architecture.

## Image Gallery

<div class="image-gallery bug-fighter-gallery">
  <figure>
    <img src="https://isaacwkm.github.io/assets/images/2026-02-17-BugFight/Gallery/character%20select.png" alt="Bug Fighter character select">
    <figcaption>Character select.</figcaption>
  </figure>
  <figure>
    <img src="https://isaacwkm.github.io/assets/images/2026-02-17-BugFight/Gallery/come%20at%20me.png" alt="Bug Fighter combat screenshot">
    <figcaption>Combat screenshot.</figcaption>
  </figure>
  <figure>
    <img src="https://isaacwkm.github.io/assets/images/2026-02-17-BugFight/Gallery/CassanovaIdle_3.gif" alt="Cassanova idle animation">
    <figcaption>Cassanova idle animation.</figcaption>
  </figure>
  <figure>
    <img src="https://isaacwkm.github.io/assets/images/2026-02-17-BugFight/Gallery/HerculesJumpingHeavyFollowUp.gif" alt="Hercules jumping heavy follow-up animation">
    <figcaption>Hercules knockdown.</figcaption>
  </figure>
  <figure>
    <img src="https://isaacwkm.github.io/assets/images/2026-02-17-BugFight/Gallery/HerculesMedium.gif" alt="Hercules medium attack animation">
    <figcaption>Hercules medium attack.</figcaption>
  </figure>
  <figure>
    <img src="https://isaacwkm.github.io/assets/images/2026-02-17-BugFight/Gallery/JasperForwardWalk.gif" alt="Jasper forward walk animation">
    <figcaption>Jasper forward walk.</figcaption>
  </figure>
  <figure>
    <img src="https://isaacwkm.github.io/assets/images/2026-02-17-BugFight/Gallery/LadyJoanaIdle.gif" alt="Lady Joana idle animation">
    <figcaption>Lady Joana idle animation.</figcaption>
  </figure>
  <figure>
    <img src="https://isaacwkm.github.io/assets/images/2026-02-17-BugFight/Gallery/LilacWalkBackwards.gif" alt="Lilac walk backwards animation">
    <figcaption>Lilac walk backwards.</figcaption>
  </figure>
</div>

# Key Contributions

I built the deterministic simulation, fighter state machine, data-driven attacks, hitbox combat, projectiles, throws, blocking, round flow, training tools, character select, HUD systems, and early rollback netcode. The project emphasizes clean separation between gameplay simulation and visual presentation so mechanics can be tested, replayed, and eventually synchronized online.

- Created data-driven character and move configuration using ScriptableObjects.
- Made use of game programming patterns for systems where appropriate, including observer, command, and component. 
- All game simulation is encapsulated under a single Gameloop file, and all entities in scene are simulated through an ECS-like system, owned by plain C# code.
- Refactored code incrementally throughout development to apply patterns once systems grew larger.
- Capable of creating and created debugging tools and harnesses to test iterations of new features.

![Ladybug Blocking Attack](https://isaacwkm.github.io/assets/images/2026-02-17-BugFight/ladyblock.png)

A major focus of the project has been separating simulation from presentation so the game can support rollback networking and replay validation. I implemented net state capture/restore, input packet encoding, rollback resimulation, deterministic smoke tests, replay verification, and local/UDP network adapter work. I also built debugging tools for validating simulation consistency, inspecting combat interactions, and testing network behavior.

## Links

1.[ GitHub repository](https://github.com/Team-Lost-At-Sea/Bug-Fighter-Stix-Prototype-Snapshot)

2.[ Playtest build: playable in-browser, with no online play](https://saxxiefone.itch.io/dirtcrawlers-week-8)

3.[ Playtest build: Windows download, with online play on local network](https://saxxiefone.itch.io/dirtcrawlers-multiplayer-playtest)
