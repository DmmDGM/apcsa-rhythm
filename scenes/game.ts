// Imports
import chalk from "chalk";
import * as context from "../core/context";
import * as engine from "../core/engine";
import * as render from "../core/render";
import * as rhythm from "../core/rhythm";

// Defines game
type Button = {
    label: string;
    note: typeof chalk;
    key: typeof chalk;
};
enum Channel { S, D, F, J, K, L }
const mapping: { [ channel in Channel ]: Button; } = {
    [ Channel.S ]: {
        label: "S",
        note: chalk.bgRedBright,
        key: chalk.redBright
    },
    [ Channel.D ]: {
        label: "D",
        note: chalk.bgYellowBright,
        key: chalk.yellowBright
    },
    [ Channel.F ]: {
        label: "F",
        note: chalk.bgGreenBright,
        key: chalk.greenBright
    },
    [ Channel.J ]: {
        label: "J",
        note: chalk.bgCyanBright,
        key: chalk.cyanBright
    },
    [ Channel.K ]: {
        label: "K",
        note: chalk.bgBlueBright,
        key: chalk.blueBright
    },
    [ Channel.L ]: {
        label: "L",
        note: chalk.bgMagentaBright,
        key: chalk.magentaBright
    }
};
class Game {
    // Declares fields
    private readonly chart: rhythm.Chart;
    readonly table: rhythm.Note[][];
    private elapsed: number;
    private score: number;
    private lastDelta: number;

    // Defines constructor
    constructor(chart: rhythm.Chart) {
        // Initializes fields
        this.chart = chart;
        this.table = chart.getLanes().map((lane) => [ ...lane.getNotes() ]);
        this.elapsed = -3000;
        this.score = 0;
        this.lastDelta = 0;
    }

    // Defines methods
    buildBoard(): string[] {
        // Defines borders
        const horizontal = "═".repeat(100);
        const vertical = "║";
        const dash = "┆";

        // Builds board
        const buildTrack = (channel: Channel) => {
            // Formats track
            const lane = this.table[channel]!;
            const mapped = mapping[channel];
            const label = mapped.key(mapped.label);
            const spaces = new Array(92).fill(" ");
            spaces[12] = dash;
            for(let i = 0; i < lane.length; i++) {
                const note = lane[i]!;
                const delta = note.getTime() - Math.max(this.elapsed, 0);
                if(delta < -300) continue;
                if(delta >= 2000) break;
                const index = Math.floor(delta / 25) + 12;
                spaces[index] = mapped.note(spaces[index]!);
            }
            const rail = spaces.join("");

            // Builds track
            const lineLabeled = `${vertical}  ${label}  ${vertical}${rail}${vertical}`;
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
    }
    clickMissed(): boolean {
        // Clicks and removes missed
        let missed = 0;
        for(let i = 0; i < this.table.length; i++) {
            const lane = this.table[i]!;
            if(lane.length === 0) continue;
            while(lane[0]!.getTime() - this.elapsed < -300) {
                lane.shift();
                missed++;
            }
        }

        // Subtracts score
        this.score = Math.max(this.score - missed * 100, 0);

        // Updates last delta
        this.lastDelta = Number.MIN_SAFE_INTEGER;
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

        // Updates last delta
        this.lastDelta = delta;
        return true;
    }
    elapseDelta(delta: number): void {
        // Elapses delta
        this.elapsed += delta;
    }
    getChart(): rhythm.Chart {
        // Returns chart
        return this.chart;
    }
    getLastDelta(): number {
        // Returns last delta
        return this.lastDelta;
    }
    getName(): string {
        // Returns name
        return this.getChart().getName();
    }
    getScore(): number {
        // Returns score
        return this.score;
    }
    getTime(): string {
        // Defines formatter
        const formatTime = (time: number): string => {
            // Formats time
            const seconds = (Math.floor(time / 1000) % 60).toString().padStart(2, "0");
            const minutes = (Math.floor(time / 1000 / 60)).toString();
            return `${minutes}:${seconds}`;
        }

        // Formats time
        const elapsed = formatTime(Math.max(this.elapsed, 0));
        const total = formatTime(this.getChart().getLength());
        return `${elapsed} / ${total}`;
    }
    press(channel: Channel): void {
        // Presses button
        this.clickNote(channel);
    }
}

// Defines statistics
let calculatedFps = 0;

// Defines game
let game: Game;

// Defines scene
export async function init(): Promise<void> {
    // Updates fps
    engine.setFps(60);

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

    // Elapses delta
    game.elapseDelta(delta);
}
export async function draw(): Promise<void> {
    // Prints header
    await render.writeJustify(
        1,
        `Name: ${game.getName()}`,
        "",
        `FPS: ${calculatedFps.toFixed(3)} / ${engine.getFps()}`
    );
    await render.writeJustify(
        2,
        `Time: ${game.getTime()}`,
        "",
        "Shift + [R]eset [Q]uit"
    );
    await render.writeLeft(
        3,
        `Score: ${game.getScore()}`
    )   

    // Prints board
    await render.writeCenter(4, "Text");
    const board = game.buildBoard();
    for(let i = 0; i < board.length; i++) {
        await render.writeCenter(5 + i, board[i]!);
    }
    await render.writeCenter(24, "Good (0 ms)");
    await render.clearHere();
}
export async function key(data: Buffer): Promise<void> {
    // Handles key
    switch(data.toString()) {
        case "s": {
            game.press(Channel.S);
            break;
        }
        case "d": {
            game.press(Channel.D);
            break;
        }
        case "f": {
            game.press(Channel.F);
            break;
        }
        case "j": {
            game.press(Channel.J);
            break;
        }
        case "k": {
            game.press(Channel.K);
            break;
        }
        case "l": {
            game.press(Channel.L);
            break;
        }
        case "R": {
            await context.setScene("game");
            break;
        }
        case "Q": {
            await context.setScene("menu");
            break;
        }
    }
}
