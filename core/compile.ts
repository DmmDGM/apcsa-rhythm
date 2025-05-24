// Imports
import nodePath from "node:path";

// Parses file
const filepath = process.argv[2];
if(typeof filepath === "undefined") throw new Error("No input file was specified");
const output = process.argv[3];
if(typeof output === "undefined") throw new Error("No output file was specified");
const file = Bun.file(filepath);
const map = await file.text();
const [ header, ...body ] = (map + "\n").split("\n").map((line) => line.trim());

// Parses data
enum Channel { S, D, F, J, K, L }
const labels = {
    "s": Channel.S,
    "d": Channel.D,
    "f": Channel.F,
    "j": Channel.J,
    "k": Channel.K,
    "l": Channel.L
};
if(typeof header === "undefined") throw new Error("No header.");
const pattern = header.match(/^# (.*?) \| (\d+) \| (.*?)$/);
if(pattern === null) throw new Error("Invalid header.");
const name = pattern[1];
const difficulty = Number(pattern[2]);
const description = pattern[3];
let measures = 0;
let elapsed = 0;
let lanes: { [ channel in Channel ]: number[]; } = {
    [ Channel.S ]: [],
    [ Channel.D ]: [],
    [ Channel.F ]: [],
    [ Channel.J ]: [],
    [ Channel.K ]: [],
    [ Channel.L ]: []
};
let texts: [ number, string ][] = [];
for(let i = 0; i < body.length; i++) {
    // Parses line
    const line = body[i]!;

    // Parses skips
    if(line === "---") {
        measures++;
        elapsed = measures * 1000;
        continue;
    }
    
    // Parses contents
    const [ values, text ] = line.split("|");
    if(typeof text !== "undefined") texts.push([ elapsed, text.trim() ]);
    if(typeof values === "undefined") throw new Error("Invalid map file.");
    const notes = values.trim().split(" ");
    if(!notes.includes("=") && !notes.includes("")) {
        for(let j = 0; j < notes.length; j++) {
            const note = notes[j]!;
            lanes[labels[note as keyof typeof labels]].push(elapsed);
        }
    }
    elapsed += 125;
    if(elapsed === 1000) {
        measures++;
        elapsed = 0;
    }
}
let length = (measures + 5) * 1000;

// Constructs chart
const chart = {
    description: description,
    difficulty: difficulty,
    length: length,
    name: name,
    table: [
        lanes[Channel.S],
        lanes[Channel.D],
        lanes[Channel.F],
        lanes[Channel.J],
        lanes[Channel.K],
        lanes[Channel.L]
    ],
    texts: texts
};

// Writes file
Bun.write(output, JSON.stringify(chart, null, 4));
console.log(`Done! ${filepath} -> ${output}`);
