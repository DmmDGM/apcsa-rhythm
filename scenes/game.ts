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
        const borderHorizontal = chalk.bgCyanBright(" ".repeat(100));
        const labels: string[] = [ "S", "D", "F", "J", "K", "L" ];
        const buildTrack = (channel: Channel) => {
            const borderVertical = chalk.bgCyanBright("  ");
            const label = labels[channel]!;
            const space = new Array(92).fill(" ");
            space[12] = chalk.bgGreenBright(" ");
            const track = 
            // "J || 92 ||"  
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

// Defines scene
export async function init(): Promise<void> {
    // Clears screen
    await render.clearScreen();
}
export async function draw(): Promise<void> {
    await render.clearScreen();
    console.log(rhythm.getChart());
}
export async function key(data: Buffer): Promise<void> {
    console.log(data);
}