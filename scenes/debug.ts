// Imports
import chalk from "chalk"
import * as engine from "../core/engine";
import * as render from "../core/render";

// Defines frame
let lastDelta: number;
let calculatedFps: number;

// Defines terminal size
let terminalHeight: number;
let terminalWidth: number;

// Defines scene
export async function update(context: engine.Context, delta: number): Promise<void> {
    // Calculates frame
    lastDelta = delta;
    calculatedFps = 1000 / delta;

    // Updates terminal size
    [ terminalWidth, terminalHeight ] = process.stdout.getWindowSize();
}
export async function draw(context: engine.Context): Promise<void> {
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

    // Renders context
    await render.writeJustify(
        10,
        `FPS: ${calculatedFps} / ${context.getFps()}`,
        "",
        `Delta: ${lastDelta} ms`
    );
    await render.writeJustify(
        11,
        `Render size: ${render.renderWidth}x${render.renderHeight}`,
        "",
        `Terminal size: ${terminalWidth}x${terminalHeight}`
    );

    // Clears down
    await render.clearDown(12);
}
export async function key(context: engine.Context): Promise<void> {
    // Exits debug mode
    await context.setScene("init");
}
