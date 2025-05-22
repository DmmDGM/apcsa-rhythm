// Imports
import chalk from "chalk";
import * as context from "../core/context";
import * as engine from "../core/engine";
import * as project from "../core/project";
import * as render from "../core/render";
import * as rhythm from "../core/rhythm";

// Defines window
let charts: rhythm.Chart[] = [];
let scroll: rhythm.Chart[] = [];
let position = 0;
let index = 0;

// Defines elapsed
let elapsed = 0;

// Defines statistics
let lastDelta = 0;
let calculatedFps = 0;

// Defines scene
export async function init(): Promise<void> {
    // Updates fps
    engine.setFps(30);

    // Resets window
    charts = await rhythm.fetchAll();
    charts = [ ...charts, ...charts, ...charts, ...charts, ...charts ];
    charts = [ ...charts, ...charts, ...charts, ...charts, ...charts ];
    scroll = [];
    position = 0;
    index = 0;

    // Resets elapsed
    elapsed = 0;

    // Resets statistics
    lastDelta = 0;
    calculatedFps = 0;

    // Clears screen
    await render.clearScreen();
}
export async function update(delta: number): Promise<void> {
    // Updates statistics
    lastDelta = delta;
    calculatedFps = 1000 / delta;

    // Updates scroll
    if(index < position) position = index;
    if(index >= position + 15) position = index - 15 + 1;
    scroll = charts.slice(position, position + 15);
    
    // Updates elapsed
    elapsed += delta;
}
export async function draw(): Promise<void> {
    // Prints header
    await render.writeLeft(1, chalk.cyanBright("-".repeat(render.renderWidth)));
    await render.writeCenter(2, chalk.cyanBright("Choose a Chart to Play!"));
    await render.writeLeft(3, chalk.cyanBright("-".repeat(render.renderWidth)));

    // Prints scroll
    for(let i = 0; i < scroll.length; i++) {
        const chart = scroll[i]!;
        const selected = index - position === i;
        const number = position + i + 1;
        const blink = elapsed % 1000 < 500;
        const style = selected ?
            (blink ? chalk.cyanBright : chalk.yellowBright) :
            chalk.white;
        await render.writeLeft(
            5 + i,
            style(`${number}. ${chart.getName()} ${selected ? "<--" : ""}`)
        );
    }

    // Prints footer
    const chart = charts[index]!;
    await render.writeLeft(22, chalk.cyanBright("-".repeat(render.renderWidth)));
    await render.writeJustify(
        23,
        chart.getDescription(),
        "",
        `| ${charts.length} charts loaded! (${calculatedFps.toFixed(1)} / ${engine.getFps()} fps)`);
    await render.writeLeft(24, chalk.cyanBright("-".repeat(render.renderWidth)));
    
}
export async function key(data: Buffer): Promise<void> {
    // Handles key
    switch(data.toString()) {
        case "\x1b\x5b\x31\x3b\x32\x41": {
            index = Math.max(index - 10, 0);
            break;
        }
        case "\x1b\x5b\x41": {
            index = Math.max(index - 1, 0);
            break;
        }
        case "\x1b\x5b\x42": {
           index = Math.min(index + 1, charts.length - 1);
           break;
        }
        case "\x1b\x5b\x31\x3b\x32\x42": {
            index = Math.min(index + 10, charts.length - 1);
            break;
        }

        // case " ": {
        //     context.setTable(tables[index]!);
        //     await context.setScene("game");
        //     break;
        // }
    }
}
