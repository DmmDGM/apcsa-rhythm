// Imports
import * as context from "./context";
import * as engine from "./engine";
import * as render from "./render";

// Initializes game
await render.cursorHide();
await context.setScene("init");

// Advances game
async function advance(): Promise<void> {
    // Executes tick
    await engine.elapseFrame();
    setTimeout(() => advance(), 1000 / engine.getFps());
}
setTimeout(() => advance(), 1000 / engine.getFps());

// Handles keyboard
process.stdin.setRawMode(true);
process.stdin.on("data", async (key) => {
    // Emits key
    await engine.emitKey(key);
});
