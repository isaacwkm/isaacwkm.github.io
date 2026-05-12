---
title: "<i>Bug Fighter</i>: &nbsp;Gameplay Programming - <i>2026 to Current</i>"
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

## Major Decisions

Some major decisions I made during development were related to the major focus of separating simulation from presentation so the game can support rollback networking and replay validation. In order to support online netplay, the game had a requirement to be fully deterministic, serializable, and able to be rolled back to any point previously occured in the match, and also simulate future frames quickly. This meant the architecture had to represent and hold its data carefully.

The first step I took was having all gameplay occur under a single GameLoop.cs file. All entities, their interactions, and behavior would be encapsulated within this file. Instead of object-oriented design where each actor on screen has its own code, the entities were given behavior defined in a native C# class, and simulated within the GameLoop. The game objects on screen served as visual renders of everything that occurred within GameLoop.

Of course, entities and their interactions were further encapsulated into their own categories of mechanics and classes to prevent a mega-script of a main game loop. This ECS-inspired architecture allowed easy additions of new features and data to exist within the foundation and be added to serialization of the game state.

## Links

1.[ GitHub repository](https://github.com/Team-Lost-At-Sea/Bug-Fighter-Stix-Prototype-Snapshot)

2.[ Playtest build: playable in-browser](https://saxxiefone.itch.io/dirtcrawlers-8)
