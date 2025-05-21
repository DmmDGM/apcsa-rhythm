// Imports
import type * as engine from "../core/engine";
import * as render from "../core/render";

// Defines scene
export async function init(context: engine.Context): Promise<void> {
    // Initializes terminal
    await render.clearScreen();
    await render.cursorHide();
}
export async function update(context: engine.Context): Promise<void> {
    const [ columns, rows ] = process.stdout.getWindowSize();
    if(columns < render.renderWidth || rows < render.renderHeight) {
        await render.writeLine(1, 1, "Terminal is too small!");
        await render.writeLine(2, 1, `Minimum size: ${render.renderWidth}x${render.renderHeight}`);
        await render.writeLine(3, 1, `Current size: ${columns}x${rows}`);
        await render.clearLine(4);
        await render.writeLine(5, 1, "The game will automatically start when the size requirement is met.");
        await render.writeLine(6, 1, "Note: Please try to refrain from resizing your terminal during the game.");
        await render.writeLine(7, 1,  `${context.getFrames() % 15}`);
        await render.clearHere();
    }
}
