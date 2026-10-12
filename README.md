## 📄 Credits & Upstream License Compliance

This project is a fork built upon the work of **Gabriele Giuseppini (G2-Labs)** (© 2018–2024) and **Luke Wren** (© 2013). We strictly follow and honor the original license conditions ([Creative Commons Attribution 4.0 International](http://creativecommons.org/licenses/by/4.0/)). Please refer to the upstream repository and `LICENSE.txt` for full legal details.

# Floating Sandbox
A two-dimensional physics simulation written in C++ and ported to the web!

# Overview
Floating Sandbox is a realistic 2D physics simulator. It is essentially a particle system that uses mass-spring networks to simulate rigid bodies, with added thermodynamics, fluid dynamics, and basic electrotechnics. The simulation is mostly focused around ships floating on water, but you can build any kind of object using the integrated ShipBuilder and a database of over 1,000 different materials. Once you build an object you can punch holes into it, slice it, apply forces and heat, set it on fire, smash it with bomb explosions - anything you want. And when it starts sinking, you can watch it slowly dive its way into the abyss, where it will rot for eternity!

<img src="https://i.imgur.com/Rl9K9w1.png">

The simulator is _crammed_ with physics; every conceivable aspect of the gameplay is governed exclusively by classical mechanics (e.g. friction and elasticity, conservation of momentum, Hooke's spring forces, impacts), thermodynamics (e.g. heat transfer, dissipation, combustion and melting), and fluid dynamics (e.g. buoyancy, drag, hydrostatic and atmospheric pressure, wind), while the extensive material system has been put together using real physical characteristics specific to each of the materials - ranging from density, mass, and friction coefficients, up to elasticity and thermal expansion coefficients.

In coding this game I've been trying hard to stay true to my mission of avoiding "visual tricks", striving instead to obtain behaviors by means of careful, detailed, and honest simulations. The end result has been very rewarding for me, as I'm constantly surprised by the natural feeling and unexpected side-effects that spring out of the game. For example, round objects rotate when sliding downhill - which is completely due to friction, without a single line of code imposing some "magical" rotational forces - and different shapes sink with different velocities and trajectories - a side-effect of fluid dynamics acting on surfaces.

<img src="https://i.imgur.com/kovxCty.png">
<img src="https://i.imgur.com/XHw3Jrl.png">

The world of Floating Sandbox is rich with interactions, and new ones are being continuously added. To make a few examples, you can:
* Detonate different kinds of bombs with different behaviors
* Trigger storms with rain, hurricane winds, and lightnings - all interacting with the ship in a way or the other
* Overheat materials and reach either their combustion point or melting point
* Use tools to damage the ship by e.g. hitting, pulling parts, overheating, and inflating
* Use tools to impart tremendous radial or rotational force fields
* Control waves on the surface of the sea, creating monster waves and triggering tsunami's
* Spawn NPCs walking about the ship and being subject to what's happening around them

The simulator comes with a built-in ShipBuilder that allows you to create ships by drawing individual particles choosing materials out of the game's library. Each material has its own physical properties, such as mass, strength, stiffness, water permeability, specific heat, sound properties, and so on. You can also create electrical layers with electrical materials (lamps, engines, generators, switches, etc.), layers with ropes, and texture layers for a final, high-definition look'n'feel of the ship.

<img src="https://i.imgur.com/lSUj90c.png">
<img src="https://imgur.com/E0X3n93.png">

The game currently comes with a few example objects - mostly ships - and I'm always busy making new ships and objects. Anyone is encouraged to make their own objects, and if you'd like them to be included in the game, just get in touch with me - you'll get proper recognition in the About dialog, of course. Also have a look at [the official Floating Sandbox web site](https://floatingsandbox.com/), where you can find plenty of Ship Packs!

Floating Sandbox is featured at [GameJolt](https://gamejolt.com/games/floating-sandbox/353572), and plenty of videos may be found on any major social media platforms.
