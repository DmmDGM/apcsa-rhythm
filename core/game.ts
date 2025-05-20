// Imports
import nodePath from "node:path";
import * as except from "./except";
import * as project from "./project";

// Defines fps handlers
let fps: number = 60;
function getFps(): number {
    // Returns fps
    return fps;
}
function setFps(rate: number): void {
    // Updates fps
    fps = Math.min(Math.max(Math.floor(rate), 1), 120);
}

// Defines frames handlers
let frames: number = 0;
function getFrames(): number {
    // Returns frames
    return frames;
}

// Defines scene handlers
export type Scene = {
    init: (context: Context) => void | Promise<void>;
    update: (context: Context, delta: number) => void | Promise<void>;
    draw: (context: Context) => void | Promise<void>;
    key: (context: Context, data: Buffer) => void | Promise<void>;
    fix: (context: Context, exception: except.Exception) => void | Promise<void>;
};
const scenes: Map<string, Scene> = new Map();
let scene: Scene;
function getScene(): Scene {
    // Returns scene
    return scene;
}
async function setScene(name: string): Promise<void> {
    // Updates scene
    const cached = scenes.get(name);
    if(typeof cached === "undefined") {
        try {
            const scenePath = nodePath.resolve(project.root, `./scenes/${name}`);
            const imported = await import(scenePath) as Partial<Scene>;
            const resolved = Object.assign({
                init: () => {},
                update: () => {},
                draw: () => {},
                key: () => {},
                fix: () => {}
            }, imported) as Scene;
            scenes.set(name, resolved);
            scene = resolved;
        }
        catch {
            throw new except.UnknownScene();
        }
    }
    else scene = cached;
    await scene.init(context);
}

// Defines context
export type Context = Readonly<typeof context>;
const context = {
    getFps: getFps,
    setFps: setFps,
    getFrames: getFrames,
    getScene: getScene,
    setScene: setScene
};

// Initializes game
const startTick = Date.now();
async function tick(lastTick: number): Promise<void> {
    // Executes tick
    const thisTick = Date.now();
    try {
        await scene.update(context, thisTick - lastTick);
        await scene.draw(context);
    }
    catch(thrown) {
        if(thrown instanceof except.Exception) await scene.fix(context, thrown);
        else throw (thrown instanceof Error) ? thrown : new Error(String(thrown));
    }
    setTimeout(() => tick(thisTick), 1000 / fps);
}
await setScene("init");
setTimeout(() => tick(startTick), 1000 / fps);
process.stdin.setRawMode(true);
process.stdin.on("data", (data) => scene.key(context, data));
