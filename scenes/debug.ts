// Imports
import chalk from "chalk"
import * as context from "../core/context";
import * as engine from "../core/engine";
import * as render from "../core/render";

// Defines statistics
let lastDelta: number = 0;
let calculatedFps: number = 0;
let terminalHeight: number = 0;
let terminalWidth: number = 0;

// Defines scene
export async function init(): Promise<void> {
    // Resets statistics
    lastDelta = 0;
    calculatedFps = 0;
    terminalHeight = 0;
    terminalWidth = 0;
}
export async function update(delta: number): Promise<void> {
    // Calculates statistics
    lastDelta = delta;
    calculatedFps = 1000 / delta;
    [ terminalWidth, terminalHeight ] = process.stdout.getWindowSize();
}
export async function draw(): Promise<void> {
    // Renders title
    await render.writeLine(1, 56, "DEBUG MODE ENABLED");
    await render.clearLine(2);

    // Renders board width
    await render.writeLeft(3, chalk.bgWhite.black("/".repeat(render.renderWidth)));
    await render.clearLine(4);

    // Renders text alignment
    await render.writeLeft(5, "--- LEFT TEXT ---");    
    await render.writeCenter(6, "--- CENTER TEXT ---");
    await render.writeRight(7, "--- RIGHT TEXT ---");
    await render.writeJustify(
        8,
        "--- LEFT JUSTIFY ---",
        "--- CENTER JUSTIFY ---",
        "--- RIGHT JUSTIFY ---"
    );
    await render.clearLine(9);

    // Renders statistics
    await render.writeJustify(
        10,
        `FPS: ${calculatedFps} / ${engine.getFps()}`,
        "",
        `Delta: ${lastDelta} ms`
    );
    await render.writeJustify(
        11,
        `Render size: ${render.renderWidth}x${render.renderHeight}`,
        "",
        `Terminal size: ${terminalWidth}x${terminalHeight}`
    );

    // Clears lines
    for(let i = 12; i < render.renderHeight; i++) await render.clearLine(i);

    // Renders bottom
    await render.writeCenter(render.renderHeight, "--- BOTTOM OF RENDER ---");
    await render.clearHere();
}
export async function key(): Promise<void> {
    // Exits debug mode
    await context.setScene("init");
}
