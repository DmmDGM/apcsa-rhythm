// Imports
import nodePath from "node:path";
import * as except from "./except";
import * as project from "./project";

// Defines scene handlers
export type Scene = {
    init: () => void | Promise<void>;
    update: (delta: number) => void | Promise<void>;
    draw: () => void | Promise<void>;
    key: (data: Buffer) => void | Promise<void>;
    fix: (exception: except.Exception) => void | Promise<void>;
};
export let scene: Scene | null = null;
export const scenes: Map<string, Scene> = new Map();
export async function fetchScene(name: string): Promise<Scene> {
    // Fetches scene
    try {
        // Checks cache
        const cached = scenes.get(name);
        if(typeof cached !== "undefined") return cached;

        // Imports scene
        const scenePath = nodePath.resolve(project.root, `./scenes/${name}`);
        const imported = await import(scenePath) as Partial<Scene>;
        const scene = Object.assign({
            init: () => {},
            update: () => {},
            draw: () => {},
            key: () => {},
            fix: () => {}
        }, imported) as Scene;

        // Caches scene
        scenes.set(name, scene);
        return scene;
    }
    catch {
        // Handles exception
        throw new except.UnknownScene();
    }
}
export function getScene(): Scene {
    // Returns scene
    if(scene === null) throw new except.SceneNotInitialized();
    return scene;
}
export async function setScene(name: string): Promise<void> {
    // Updates scene
    const fetched = await fetchScene(name);
    scene = fetched;
    await scene.init();
}
export async function changeScene(updated: Scene): Promise<void> {
    // Updates scene
    scene = updated;
    await scene.init();
}

// Defines state handlers
export const states: Set<string> = new Set();
export function testState(state: string): boolean {
    // Tests state
    return states.has(state);
}
export function addState(state: string): void {
    // Adds state
    states.add(state);
}
export function removeState(state: string): void {
    // Removes state
    states.delete(state);
}