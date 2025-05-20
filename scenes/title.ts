// Imports
import chalk from "chalk"
import type * as game from "../core/game";

// Defines scene
export async function init(context: game.Context): Promise<void> {
    
}
export async function update(context: game.Context, delta: number): Promise<void> {
    const minimumWidth = Math.max(process.stdout.getWindowSize()[0], 80);
    const center = (text: string): string => {
        const textWidth = Bun.stringWidth(text);
        const leftWidth = Math.round((minimumWidth - textWidth) / 2);
        const rightWidth = minimumWidth - leftWidth - textWidth;
        const padded = " ".repeat(leftWidth) + text + " ".repeat(rightWidth);
        return padded;
    };
    console.log(center("hello world"));
}
export async function draw(context: game.Context): Promise<void> {

}
export async function key(context: game.Context, data: Buffer): Promise<void> {

}
