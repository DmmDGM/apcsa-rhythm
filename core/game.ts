// Imports
import nodePath from "node:path";
import chalk from "chalk";
import * as project from "./project";

// Defines context
export type Scene = {
    init: (context: Context) => Promise<void>;
    update: (context: Context, delta: number) => Promise<void>;
    draw: (context: Context) => Promise<void>;
    key: (context: Context, data: Buffer) => Promise<void>;
};
export let scene: Scene;
export type Context = typeof context;
export const context = {
    getScene: (): typeof scene => {
        // Returns scene
        return scene;
    },
    setScene: async (name: string): Promise<void> => {
        // Updates scene
        const cached = context.scenes.get(name);
        if(typeof cached === "undefined") {
            const scenePath = nodePath.resolve(project.root, `./scenes/${name}`);
            const imported = await import(scenePath) as Scene;
            context.scenes.set(name, imported);
            scene = imported;
        }
        else scene = cached;
        await scene.init(context);
    },
    scenes: new Map<string, Scene>()
};

// Defines game loop
export async function init(): Promise<void> {
    // Initializes scene
    await context.setScene("debug-refresh");
}
export async function update(delta: number): Promise<void> {
    // Runs scene loop
    await context.getScene().update(context, delta);
}
export async function draw(): Promise<void> {
    // Runs scene loop
    await context.getScene().draw(context);
}
export async function key(data: Buffer): Promise<void> {
    // Runs scene loop
    await context.getScene().key(context, data);
}
