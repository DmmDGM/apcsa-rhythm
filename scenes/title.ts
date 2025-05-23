// Imports
import chalk from "chalk";
import * as context from "../core/context";
import * as engine from "../core/engine";
import * as render from "../core/render";

// Defines title
const title = [
    "████████╗███████╗██████╗ ███╗   ███╗       █████╗       ██████╗ ██╗  ██╗██╗   ██╗████████╗██╗  ██╗███╗   ███╗",
    "╚══██╔══╝██╔════╝██╔══██╗████╗ ████║      ██╔══██╗      ██╔══██╗██║  ██║╚██╗ ██╔╝╚══██╔══╝██║  ██║████╗ ████║",
    "   ██║   █████╗  ██████╔╝██╔████╔██║█████╗███████║█████╗██████╔╝███████║ ╚████╔╝    ██║   ███████║██╔████╔██║",
    "   ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║╚════╝██╔══██║╚════╝██╔══██╗██╔══██║  ╚██╔╝     ██║   ██╔══██║██║╚██╔╝██║",
    "   ██║   ███████╗██║  ██║██║ ╚═╝ ██║      ██║  ██║      ██║  ██║██║  ██║   ██║      ██║   ██║  ██║██║ ╚═╝ ██║",
    "   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝      ╚═╝  ╚═╝      ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝      ╚═╝   ╚═╝  ╚═╝╚═╝     ╚═╝"
];

// Defines frame
let elapsed: number = 0;
let index: number = 0;
let refresh: boolean = false;

// Defines scene
export async function init(): Promise<void> {
    // Updates fps
    engine.setFps(10);

    // Resets frame
    elapsed = 0;
    index = 0;
    refresh = false;

    // Clears screen
    await render.clearScreen();
}
export async function update(delta: number): Promise<void> {
    // Updates refresh
    const crosses = (time: number): boolean => elapsed < time && elapsed + delta >= time;
    refresh = crosses(3000) || crosses(4000);

    // Updates elapsed
    elapsed += delta;
}
export async function draw(): Promise<void> {
    // Renders intro
    if(refresh) await render.clearScreen();

    // Renders footnote
    if(elapsed < 3000) {
        await render.writeCenter(
            Math.floor(render.renderHeight / 2),
            "~~ A terminal game dedicated for my AP CSA End-of-Year Final Project ~~"
        );
    }

    // Renders title
    if(elapsed >= 4000) {
        for(let i = 0; i < title.length; i++) {
            const style = [
                chalk.white,
                chalk.yellowBright,
                chalk.redBright,
                chalk.cyanBright
            ][Math.floor(elapsed / 500) % 4]!;
            const line = title[i]!;
            await render.writeCenter(i + 2, style(line));
        }
    }

    // Renders credits
    if(elapsed >= 6000) {
        const blink = elapsed % 1000 < 500;
        const style = blink ? chalk.white : chalk.gray;
        await render.writeCenter(title.length + 4, style("A game by Leo Deng"));
    }

    // Renders options
    if(elapsed >= 8000) {
        const blink = elapsed % 1000 < 500;
        const style = blink ? chalk.yellowBright : chalk.cyanBright;
        await render.writeCenter(
            title.length + 8,
            index === 0 ? style("S T A R T") : "START"
        );
        await render.writeCenter(
            title.length + 10,
            index === 1 ? style("E X I T") : "EXIT"
        );
        await render.writeCenter(
            title.length + 14,
            chalk.gray("HINT: You can exit the game at any time by pressing alt (or option) + shift + q!")
        );
    }

    // Clears here
    await render.clearHere();
}
export async function key(data: Buffer): Promise<void> {
    // Handles skip
    if(elapsed < 8000) {
        elapsed = 8000;
        return;
    }

    // Handles selection
    switch(data.toString()) {
        case "\x1b\x5b\x41": {
            index = Math.max(index - 1, 0);
            break;
        }
        case "\x1b\x5b\x42": {
           index = Math.min(index + 1, 1);
           break;
        }
        case " ": {
            switch(index) {
                case 0: {
                    await context.setScene("menu");
                    break;
                }
                case 1: {
                    process.exit(0);
                }
            }
            break;
        }
    }
}
