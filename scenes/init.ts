// Imports
import * as context from "../core/context";
import * as engine from "../core/engine";
import * as render from "../core/render";

// Defines check
let terminalHeight: number = 0;
let terminalWidth: number = 0;
let pass: boolean = false;

// Defines scene
export async function init(): Promise<void> {
    // Updates fps
    engine.setFps(10);
    
    // Resets check
    terminalHeight = 0;
    terminalWidth = 0;
    pass = false;

    // Clears screen
    await render.clearScreen();
}
export async function update(): Promise<void> {
    // Tests terminal size
    [ terminalWidth, terminalHeight ] = process.stdout.getWindowSize();
    pass = terminalWidth >= render.renderWidth && terminalHeight >= render.renderHeight;
    if(pass) await context.setScene("title");
}
export async function draw(): Promise<void> {
    // Displays warning
    if(pass) return;
    await render.writeCenter(1, "--- WARNING! ---");
    await render.clearLine(2);
    await render.writeCenter(3, "Your current terminal is too small to display this game!");
    await render.writeCenter(4, `Minimum size: ${render.renderWidth}x${render.renderHeight}`);
    await render.writeCenter(5, `Current size: ${terminalWidth}x${terminalHeight}`);
    await render.clearLine(6);
    await render.writeCenter(7, "Resizing during gameplay may result in corrupt rendering.");
    await render.writeCenter(8, "The game will proceed once the minimum terminal size is met.");
    await render.writeCenter(9, "Users on Windows or MacOS may notice that the terminal size does not update live.");
    await render.writeCenter(10, "Please manually quit the game using alt (option) + shift + q and restart.");
    await render.clearHere();
}
