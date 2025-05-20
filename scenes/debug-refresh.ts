// Imports
import chalk from "chalk"
import type * as game from "../core/game";

// Defines scene
export async function init(context: game.Context): Promise<void> {
    
}
export async function update(context: game.Context, delta: number): Promise<void> {
    
}
export async function draw(context: game.Context): Promise<void> {
    // console.clear();
    Bun.stdout.write("\x1b[1;1H");
    const [ columns, rows ] = process.stdout.getWindowSize();
    Bun.stdout.write(new Array(columns * rows).fill(" ").map((cell) => {
        return chalk.bgRgb(
            Math.floor(Math.random() * 255),
            Math.floor(Math.random() * 255),
            Math.floor(Math.random() * 255)
        )(cell);
    }).join(""));
}
export async function key(context: game.Context, data: Buffer): Promise<void> {

}
