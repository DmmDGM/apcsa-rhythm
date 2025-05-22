// Imports
import nodeFile from "node:fs/promises";
import nodePath from "node:path";
import chalk from "chalk";
import * as rhythm from "../core/rhythm";
import * as project from "../core/project";
import * as render from "../core/render";
import type * as engine from "../core/engine";

// Defines tables
let tables: chart.Chart[];

// Defines index
let index = 0;

// Defines scene
export async function init(): Promise<void> {
    // Fetches tables
    const dataPath = nodePath.resolve(project.root, "./data/");
    const filepaths = await nodeFile.readdir(dataPath);
    tables = await Promise.all(filepaths.map(async (filepath) => {
        // Creates table
        const data = await chart.fetchData(filepath);
        const table = new chart.Chart(data);
        return table;
    }));
    tables.sort((left, right) => left.getDifficulty() - right.getDifficulty());

    // Clears screen
    await render.clearScreen();
}
export async function draw(context: engine.Context): Promise<void> {
    // Prints header
    await render.writeLine(1, 1, chalk.cyanBright("-".repeat(render.renderWidth)));
    await render.writeCenter(2, chalk.cyanBright("Choose a Chart to Play!"));
    await render.writeLine(3, 1, chalk.cyanBright("-".repeat(render.renderWidth)));

    // 
}
export async function key(context: engine.Context, data: Buffer): Promise<void> {
    // Handles key
    switch(data.toString()) {
        case "\x1b\x5b\x41": {
            index = Math.max(index - 1, 0);
            break;
        }
        case "\x1b\x5b\x42": {
           index = Math.min(index + 1, tables.length - 1);
           break;
        }
        case " ": {
            context.setTable(tables[index]!);
            await context.setScene("game");
            break;
        }
    }
}
