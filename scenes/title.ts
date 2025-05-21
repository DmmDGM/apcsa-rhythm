// Imports
import chalk from "chalk"
import type * as game from "../core/engine";
import * as render from "../core/render";

// Defines scene
export async function init(context: game.Context): Promise<void> {
    // Resets terminal
    await render.clearScreen();
}
export async function update(context: game.Context, delta: number): Promise<void> {
    // const minimumWidth = Math.max(process.stdout.getWindowSize()[0], 80);
    // const center = (text: string): string => {
    //     const textWidth = Bun.stringWidth(text);
    //     const leftWidth = Math.round((minimumWidth - textWidth) / 2);
    //     const rightWidth = minimumWidth - leftWidth - textWidth;
    //     const padded = " ".repeat(leftWidth) + text + " ".repeat(rightWidth);
    //     return padded;
    // };
    // console.log(center("hello world"));
    await render.writeLine(1, 30, `${context.getFrames() % 15}`);
}
