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
    private readonly table: rhythm.Note[][];
    private elapsed: number;
    private score: number;
    private texts: rhythm.Text[];
    private lastClicked: number;
    private lastDelta: number;
    private lastText: string;
    private missedNotes: number;
    private okNotes: number;
    private goodNotes: number;
    private perfectNotes: number;

    // Defines constructor
    constructor(chart: rhythm.Chart) {
        // Initializes fields
        this.chart = chart;
        this.table = chart.getLanes().map((lane) => [ ...lane.getNotes() ]);
        this.elapsed = -3000;
        this.score = 0;
        this.texts = [ ...chart.getTexts() ];
        this.lastClicked = Number.MIN_SAFE_INTEGER;
        this.lastDelta = 0;
        this.lastText = "";
        this.missedNotes = 0;
        this.okNotes = 0;
        this.goodNotes = 0;
        this.perfectNotes = 0;
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
        if(this.elapsed < 0) return false;
        let missed = 0;
        for(let i = 0; i < this.table.length; i++) {
            const lane = this.table[i]!;
            if(lane.length === 0) continue;
            while(lane.length !== 0 && lane[0]!.getTime() - this.elapsed < -300) {
                lane.shift();
                missed++;
            }
        }
        if(missed === 0) return false;
        this.missedNotes += missed;

        // Subtracts score
        this.score = Math.max(this.score - missed * 100, 0);

        // Updates last elapsed
        this.lastClicked = this.elapsed;
        this.lastDelta = Number.MIN_SAFE_INTEGER;
        return true;
    }
    clickNote(channel: Channel): boolean {
        // Clicks and removes note
        if(this.elapsed < 0) return false;
        const lane = this.table[channel]!;
        if(lane.length === 0) return false;
        const note = lane[0]!;
        const delta = note.getTime() - this.elapsed;
        if(delta > 1000) return false;
        lane.shift();
        if(this.lastDelta < -100) this.okNotes++;
        else if(this.lastDelta < -50) this.goodNotes++;
        else if(this.lastDelta <= 50) this.perfectNotes++;
        else if(this.lastDelta <= 100) this.goodNotes++; 
        else if(this.lastDelta <= 500) this.okNotes++;
        else this.missedNotes++;

        // Adds score
        this.score += Math.round(1000 / Math.log(Math.abs(delta) + 1));

        // Updates last elapsed
        this.lastClicked = this.elapsed;
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
    getComment(): string {
        // Returns comment
        if(this.elapsed - this.lastClicked > 3000) return "";
        if(this.lastDelta < -300) return chalk.redBright(`Miss!`);
        else if(this.lastDelta < -100) return chalk.yellowBright(`Late! (${this.lastDelta} ms)`);
        else if(this.lastDelta < -50) return chalk.greenBright(`Good! (${this.lastDelta} ms)`);
        else if(this.lastDelta <= 50) return chalk.cyanBright(`Perfect! (${this.lastDelta} ms)`);
        else if(this.lastDelta <= 100) return chalk.greenBright(`Good! (${this.lastDelta} ms)`); 
        else if(this.lastDelta <= 500) return chalk.yellowBright(`Early! (${this.lastDelta} ms)`);
        else return chalk.redBright(`Too early! (${this.lastDelta} ms)`);
    }
    getElapsed(): number {
        // Returns elapsed
        return this.elapsed;
    }
    getLastDelta(): number {
        // Returns last delta
        return this.lastDelta;
    }
    getLength(): number {
        // Returns length
        return this.chart.getLength();
    }
    getName(): string {
        // Returns name
        return this.chart.getName();
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
        const elapsed = formatTime(Math.min(Math.max(this.elapsed, 0), this.chart.getLength()));
        const total = formatTime(this.chart.getLength());
        return `${elapsed} / ${total}`;
    }
    getText(): string {
        // Returns presets
        if(this.elapsed < -2000) return "Ready?";
        else if(this.elapsed < -1000) return "Set!";
        else if(this.elapsed < 0) return "GO!";
        else if(this.hasEnded()) {
            if(this.elapsed < this.chart.getLength() + 3000) return "Congratulations!";
            return [
                `Perfect: ${this.perfectNotes}`,
                `Good: ${this.goodNotes}`,
                `OK: ${this.okNotes}`,
                `Missed: ${this.missedNotes}`
            ].join(" | ");
        }
        
        // Returns texts
        while(this.texts.length !== 0 && this.texts[0]!.getTime() < this.elapsed)
            this.lastText = this.texts.shift()!.getContent();
        return this.lastText;
    }
    hasEnded(): boolean {
        // Returns status
        return this.elapsed > this.chart.getLength();
    }
    press(channel: Channel): void {
        // Clicks note
        if(this.elapsed < 0) return;
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

    // Click missed
    game.clickMissed();

    // Elapses delta
    game.elapseDelta(delta);

    // Sets up auto return
    if(game.getElapsed() >= game.getLength() + 10000) await context.setScene("menu");
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

    // Prints text
    await render.writeCenter(4, game.getText());

    // Prints board
    const board = game.buildBoard();
    for(let i = 0; i < board.length; i++) {
        await render.writeCenter(5 + i, board[i]!);
    }
    
    // Prints comments
    await render.writeCenter(24, game.getComment());
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
