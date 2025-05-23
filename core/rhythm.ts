// Imports
import nodeFile from "node:fs/promises";
import nodePath from "node:path";
import * as except from "./except";
import * as project from "./project";

// Defines structures
export type Data = {
    description: string;
    difficulty: number;
    length: number;
    name: string;
    table: number[][];
    texts: [ number, string ][]
};
export class Text {
    // Declares fields
    private readonly content: string;
    private readonly time: number;

    // Defines constructor
    constructor(time: number, content: string) {
        // Initializes fields
        this.content = content;
        this.time = time;
    }

    // Defines methods
    getContent(): string {
        // Returns content
        return this.content;
    }
    getTime(): number {
        // Returns time
        return this.time;
    }
}
export class Note {
    // Declares fields
    private readonly time: number;

    // Defines constructor
    constructor(time: number) {
        // Initializes fields
        this.time = time;
    }

    // Defines methods
    getTime(): number {
        // Returns time
        return this.time;
    }
}
export class Lane {
    // Declares fields
    private readonly notes: Note[];
    
    // Defines constructor
    constructor(times: number[]) {
        // Initializes fields
        this.notes = [];

        // Populates notes
        for(let i = 0; i < times.length; i++) {
            const note = new Note(times[i]!);
            this.notes.push(note);
        }
        this.notes.sort((left, right) => left.getTime() - right.getTime());
    }

    // Defines methods
    getNotes(): readonly Note[] {
        // Returns notes
        return this.notes;
    }
}
export class Chart {
    // Declares fields
    private readonly description: string;
    private readonly difficulty: number;
    private readonly lanes: Lane[];
    private readonly length: number;
    private readonly name: string;
    private readonly notes: Note[];
    private readonly texts: Text[];

    // Defines constructor
    constructor(data: Data) {
        // Initializes fields
        this.description = data.description;
        this.difficulty = data.difficulty;
        this.lanes = [];
        this.length = data.length;
        this.name = data.name;
        this.notes = [];
        this.texts = [];

        // Populates fields
        for(let i = 0; i < data.table.length; i++) {
            const lane = new Lane(data.table[i]!);
            this.lanes.push(lane);
            this.notes.push(...lane.getNotes());
        }
        this.notes.sort((left, right) => left.getTime() - right.getTime());
        for(let i = 0; i < data.texts.length; i++) {
            const [ time, content ] = data.texts[i]!;            
            const text = new Text(time, content);
            this.texts.push(text);
        }
        this.texts.sort((left, right) => left.getTime() - right.getTime());
    }

    // Defines methods
    getDescription(): string {
        // Returns description
        return this.description;
    }
    getDifficulty(): number {
        // Returns difficulty
        return this.difficulty;
    }
    getName(): string {
        // Returns names
        return this.name;
    }
    getLanes(): readonly Lane[] {
        // Returns lanes
        return this.lanes;
    }
    getLength(): number {
        // Returns length
        return this.length;
    }
    getNotes(): readonly Note[] {
        // Returns notes
        return this.notes;
    }
    getTexts(): readonly Text[] {
        // Return texts
        return this.texts;
    }
}

// Defines handlers
export let chart: Chart | null = null;
export const charts: Map<string, Chart> = new Map();
export async function fetchChart(name: string): Promise<Chart> {
    // Fetches data
    try {
        // Checks cache
        const cached = charts.get(name);
        if(typeof cached !== "undefined") return cached;

        // Fetches chart
        const chartPath = nodePath.resolve(project.root, `./charts/${name}`);
        const imported = await import(chartPath) as Data;
        const data = Object.assign({
            description: "",
            difficulty: 0,
            length: 0,
            name: "default",
            table: [],
            texts: []
        }, imported) as Data;
        const chart = new Chart(data);

        // Caches chart
        charts.set(name, chart);
        return chart;
    }
    catch {
        // Handles exception
        throw new except.UnknownChart();
    }
}
export async function fetchAll(): Promise<Chart[]> {
    // Fetches charts
    const dirpath = nodePath.resolve(project.root, `./charts/`);
    const filepaths = await nodeFile.readdir(dirpath);
    const promises = filepaths.map(async (filepath) => await fetchChart(filepath));
    const fetched: Chart[] = await Promise.all(promises);
    fetched.sort((left, right) => left.getDifficulty() - right.getDifficulty());
    return fetched;
}
export function getChart(): Chart {
    // Returns chart
    if(chart === null) throw new except.ChartNotInitialized();
    return chart;
}
export async function setChart(name: string): Promise<void> {
    // Updates chart
    const fetched = await fetchChart(name);
    chart = fetched;
}
export function changeChart(updated: Chart): void {
    // Updates chart
    chart = updated;
}
