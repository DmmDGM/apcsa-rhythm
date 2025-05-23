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
     pressed: number;
    private score: number;

    // Defines constructor
    constructor(chart: rhythm.Chart) {
        // Initializes fields
        this.chart = chart;
        this.table = chart.getLanes().map((lane) => [ ...lane.getNotes() ]);
        this.elapsed = 0;
        this.pressed = 0;
        this.score = 0;
    }

    // Defines methods
    buildBoard(): string[] {
        // Defines borders
        const horizontal = "═".repeat(100);
        const vertical = "║";
        const dash = "┆";

        // Defines maps
        const labels: string[] = [ "S", "D", "F", "J", "K", "L" ];
        const paints: typeof chalk[] = [
            chalk.bgRedBright, chalk.bgYellowBright,
            chalk.bgGreenBright, chalk.bgCyanBright,
            chalk.bgBlueBright, chalk.bgMagentaBright
        ];
        const styles: typeof chalk[] = [
            chalk.redBright, chalk.yellowBright,
            chalk.greenBright, chalk.cyanBright,
            chalk.blueBright, chalk.magentaBright
        ];

        // Builds board
        const buildTrack = (channel: Channel) => {
            // Maps channel
            const lane = this.table[channel]!;
            const label = labels[channel]!;
            const paint = paints[channel]!;
            const style = styles[channel]!;

            // Builds track
            const button = (this.pressed & 1 << channel) === 0 ? paint("a") : style("a");
            const spaces = new Array(92).fill(" ");
            spaces[12] = dash;
            for(let i = 0; i < lane.length; i++) {
                const note = lane[i]!;
                const delta = note.getTime() - this.elapsed;
                if(delta > 2000) break;
                const index = Math.floor(delta / 25) + 12;
                spaces[index] = paint(spaces[index]!);
            }
            const rail = spaces.join("");
            const lineLabeled = `${vertical}  ${button}  ${vertical}${rail}${vertical}`;
            const lineUnabled = `${vertical}     ${vertical}${rail}${vertical}`;
            const track: string[] = channel < Channel.J ?
                [ lineLabeled, lineUnabled ] :
                [ lineUnabled, lineLabeled ];
            return track;
        }
        const board = [
            horizontal,
            ...buildTrack(Channel.S),
            horizontal,
            ...buildTrack(Channel.D),
            horizontal,
            ...buildTrack(Channel.F),
            horizontal,
            ...buildTrack(Channel.J),
            horizontal,
            ...buildTrack(Channel.K),
            horizontal,
            ...buildTrack(Channel.L),
            horizontal
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
    press(channel: Channel): void {
        // Presses button
        this.pressed |= (1 << channel);
    }
    unpress(): void {
        // Unpresses buttons
        this.pressed = 0;
    }
}

// Defines statistics
let calculatedFps = 0;

// Defines game
let game: Game | null = null;

// Defines scene
export async function init(): Promise<void> {
    // Updates fps
    engine.setFps(30);

    // Clears screen
    await render.clearScreen();

    // Resets statistics
    calculatedFps = 0;

    // Resets game
    game = new Game(rhythm.getChart());
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

    // Unpresses buttons
    // game!.unpress();
}
export async function key(data: Buffer): Promise<void> {
    switch(data.toString()) {
        case "d": {
            game!.press(Channel.D);
            break;
        }
    }
}