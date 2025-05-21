// Imports
import chalk from "chalk";
import * as except from "./except";

// Defines render size
export const renderWidth = 128;
export const renderHeight = 32;

// Defines clear methods
export async function clearDown(): Promise<void> {
    await Bun.stdout.write("\x1b[0J");
}
export async function clearLine(rows: number): Promise<void> {
    // Writes to terminal
    await Bun.stdout.write(`\x1b[${rows};1H`);
    await Bun.stdout.write("\x1b[0K");
}
export async function clearScreen(): Promise<void> {
    // Writes to terminal
    await Bun.stdout.write("\x1b[1;1H");
    await Bun.stdout.write("\x1b[0J");
}

// Defines write methods
export async function writeCenter(rows: number, text: string): Promise<void> {
    // Writes to terminal
    await Bun.stdout.write(`\x1b[${rows};1H`);
    const textWidth = Bun.stringWidth(text);
    const leftWidth = Math.floor((renderWidth - textWidth) / 2);
    const rightWidth = renderWidth - leftWidth - textWidth;
    await Bun.stdout.write(" ".repeat(leftWidth) + text + " ".repeat(rightWidth));
}
export async function writeLine(rows: number, columns: number, text: string): Promise<void> {
    // Writes to terminal
    await Bun.stdout.write(`\x1b[${rows};${columns}H`);
    await Bun.stdout.write(`\x1b[1K${text}\x1b[0K`)
}
export async function writeText(rows: number, columns: number, text: string): Promise<void> {
    // Writes to terminal
    await Bun.stdout.write(`\x1b[${rows};${columns}H`);
    await Bun.stdout.write(text);
}

// Defines cursor methods
export async function cursorHide(): Promise<void> {
    // Writes to terminal
    await Bun.stdout.write("\x1b[?25l");
}
export async function cursorMove(rows: number, columns: number): Promise<void> {
    // Writes to terminal
    await Bun.stdout.write(`\x1b[${rows};${columns}H`);
}
export async function cursorShow(): Promise<void> {
    // Writes to terminal
    await Bun.stdout.write("\x1b[?25h");
}
