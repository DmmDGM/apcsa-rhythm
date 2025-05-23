// Imports
import chalk from "chalk";
import * as context from "../core/context";
import * as engine from "../core/engine";
import * as render from "../core/render";
import * as rhythm from "../core/rhythm";

// Defines game
enum Channel { S, D, F, J, K, L }
class Game {
    // Declares fields
    private readonly chart: rhythm.Chart;
    private readonly table: rhythm.Note[][];
    private elapsed: number;
    private score: number;

    // Defines constructor
    constructor(chart: rhythm.Chart) {
        // Initializes fields
        this.chart = chart;
        this.table = chart.getLanes().map((lane) => [ ...lane.getNotes() ]);
        this.elapsed = 0;
        this.score = 0;
    }

    // Defines methods
    buildBoard(): string[] {
        // Defines borders
        const borderHorizontal = chalk.bgWhite(" ".repeat(100));
        const borderVertical = chalk.bgWhite("  ");
        const borderVerticalThin = chalk.bgWhite(" ");

        // Defines maps
        const labels: string[] = [ "S", "D", "F", "J", "K", "L" ];
        const styles: typeof chalk[] = [
            chalk.bgRedBright, chalk.bgYellowBright,
            chalk.bgGreenBright, chalk.bgCyanBright,
            chalk.bgBlueBright, chalk.bgMagentaBright
        ];

        // Builds board
        const buildTrack = (channel: Channel) => {
            // Maps channel
            const lane = this.table[channel]!;
            const label = labels[channel]!;
            const style = styles[channel]!;

            // Builds track
            const spaces = new Array(92).fill(" ");
            spaces[12] = chalk.greenBright("|");
            for(let i = 0; i < lane.length; i++) {
                const note = lane[i]!;
                const delta = note.getTime() - this.elapsed;
                if(delta > 2000) break;
                const index = Math.floor(delta / 25) + 12;
                spaces[index] = style(spaces[index]!);
            }
            const rail = spaces.join("");
            
            const track: string[] = channel < Channel.J ?
                [
                    `${borderVertical} ${label} ${borderVerticalThin}${rail}${borderVertical}`,
                    `${borderVertical}   ${borderVerticalThin}${rail}${borderVertical}`
                ] :
                [ "  " + rail, label + " " + rail ];
            return track;
        }
        const board = [
            borderHorizontal,
            ...buildTrack(Channel.S),
            borderHorizontal,
            ...buildTrack(Channel.D),
            borderHorizontal,
            ...buildTrack(Channel.F),
            borderHorizontal,
            ...buildTrack(Channel.J),
            borderHorizontal,
            ...buildTrack(Channel.K),
            borderHorizontal,
            ...buildTrack(Channel.L),
            borderHorizontal
        ];
        return board;

        // Name: aaaaaa                                                          Time: 0:00 / 2:30
        // FPS: 119.030                                                     Shift + [R]eset [Q]uit
        // 
        //                              Sample text sample text.
        // "====================================================================================="
        // "S ||     |    |                                                                    ||"
        // "  ||     |    |                                                                    ||"
        // "====================================================================================="
        // "D ||     |       |                                                                 ||"  
        // "  ||     |       |                                                                 ||"
        // "====================================================================================="
        // "F ||     |                                                                     |   ||"  
        // "  ||     |                                                                     |   ||"
        // "====================================================================================="
        // "  ||     |       |                                                                 ||"  
        // "J ||     |       |                                                                 ||"
        // "====================================================================================="
        // "  ||     |                                                                     |   ||"  
        // "K ||     |                                                                     |   ||"
        // "====================================================================================="
        // "  ||     |                                                                     |   ||"  
        // "L ||     |                                                                     |   ||"
        // "====================================================================================="
        //                                    Good (130 ms)
    }
    clickMissed(): boolean {
        // Clicks and removes missed
        let missed = 0;
        for(let i = 0; i < this.table.length; i++) {
            const lane = this.table[i]!;
            if(lane.length === 0) continue;
            while(lane[0]!.getTime() - this.elapsed < -500) {
                lane.shift();
                missed++;
            }
        }

        // Subtracts score
        this.score = Math.max(this.score - missed * 100, 0);
        return missed !== 0;
    }
    clickNote(channel: Channel): boolean {
        // Clicks and removes note
        const lane = this.table[channel]!;
        if(lane.length === 0) return false;
        const note = lane[0]!;
        const delta = note.getTime() - this.elapsed;
        if(delta > 1000) return false;
        lane.shift();

        // Adds score
        this.score += Math.round(1000 / Math.abs(delta));
        return true;
    }
}

// Defines statistics
let calculatedFps = 0;

// Defines scene
export async function init(): Promise<void> {
    // Updates fps
    engine.setFps(120);

    // Clears screen
    await render.clearScreen();

    // Resets statistics
    calculatedFps = 0;
}
export async function update(delta: number): Promise<void> {
    // Updates statistics
    calculatedFps = 1000 / delta;
}
export async function draw(): Promise<void> {
    // await render.clearScreen();
    await render.writeLeft(1, `${calculatedFps}`);
    const board = new Game(rhythm.getChart()).buildBoard();
    for(let i = 0; i < board.length; i++) {
        await render.writeCenter(2 + i, board[i]!);
    }
    // console.log(rhythm.getChart());
}
export async function key(data: Buffer): Promise<void> {
    console.log(data);
}