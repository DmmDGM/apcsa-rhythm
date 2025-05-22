// Imports
import * as context from "./context";
import * as except from "./except";

// Defines fps handlers
let fps: number = 10;
export function getFps(): number {
    // Returns fps
    return fps;
}
export function setFps(rate: number): void {
    // Updates fps
    fps = Math.min(Math.max(Math.floor(rate), 1), 120);
}

// Defines tick handler
let tick = Date.now();
export function getTick(): number {
    // Returns number
    return tick;
}

// Defines frames handlers
let frames: number = 0;
export function getFrames(): number {
    // Returns frames
    return frames;
}
export async function elapseFrame(): Promise<void> {
    // Fetches scene
    const scene = context.getScene();

    // Calculates deltas
    const tock = Date.now();
    const delta = tock - tick;

    // Executes frame
    try {
        await scene.update(delta);
        await scene.draw();
    }
    catch(thrown) {
        if(thrown instanceof except.Exception) await scene.fix(thrown);
        else throw (thrown instanceof Error) ? thrown : new Error(String(thrown));
    }

    // Updates deltas
    frames++;
    tick = tock;
}

// Defines key handlers
export async function emitKey(key: Buffer): Promise<void> {
    // Parses key
    switch(key.toString()) {
        case "\x1b\x44": {
            await context.setScene("debug");
            break;
        }
        case "\x1b\x51": {
            process.exit(0);
        }
        default: {
            const scene = context.getScene();
            await scene.key(key);
            break;
        }
    }
}
