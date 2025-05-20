// Imports
import * as game from "./core/game";
import * as project from "./core/project";

// Runs game loop
await game.init();
async function tick(lastTick: number): Promise<void> {
    // Executes tick
    const thisTick = Date.now();
    await game.update(thisTick - lastTick);
    await game.draw();
    setTimeout(() => tick(thisTick), 1000 / project.fps);
}
tick(Date.now());
process.stdin.setRawMode(true);
process.stdin.on("data", async (data) => await game.key(data));
