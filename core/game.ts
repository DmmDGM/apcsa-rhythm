// Imports
import * as context from "./context";
import * as engine from "./engine";
import * as render from "./render";

// Initializes game
await render.cursorHide();
await context.setScene("init");

// Advances game
export async function advance(): Promise<void> {
    // Executes tick
    await engine.elapseFrame();
    setTimeout(() => advance(), 1000 / engine.getFps());
}
setTimeout(() => advance(), 1000 / engine.getFps());

// Handles keyboard
process.stdin.setRawMode(true);
process.stdin.on("data", async (data) => {
    // Emits key
    await engine.emitKey(data);
});
