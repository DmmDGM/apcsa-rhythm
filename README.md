# Term-a-Rhythm (APCSA Rhythm)

## About
This is a repository for my AP CSA end-of-year final project.

It is a minimalistic terminal game, mostly inspired by Guitar Hero, written completely in Bun.

The rendering and game logic are built from scratch, with the only library used being Chalk to simplify coloring.

## Installation
For initializing the project and running the game:
```sh
git clone https://github.com/DmmDGM/apcsa-rhythm
cd apcsa-rhythm
bun i
bun .
```

If Bun is not installed but Node is available on your machine, you can install Bun like so:
```sh
npm i bun -g
```

## Levels
This is meant to be a proof-of-concept / demo for my school project.

If you want to add additional levels in your own version, you can mimic the maps in the `maps/` directory and run the `core/compile` file:
```
bun core/compile maps/<input> charts/<output>.json
```

## Future Plans
No idea. Maybe I will return to this in college or in a few years later.

By the way, this isn't my first time attempting to make a rhythm game in a terminal.

And I would love to make it into an actual game one day.

## Additional Notes
Until next time, I guess...

Thanks for playing though. I hope you enjoy the game. <3

---

###### Last Updated: 2025, May 27th, 9:39 AM EST.
