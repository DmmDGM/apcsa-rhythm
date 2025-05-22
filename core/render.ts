// Defines render size
export const renderWidth = 128;
export const renderHeight = 24;

// Defines clear methods
export async function clearDown(rows: number): Promise<void> {
    // Clears after position
    await Bun.stdout.write(`\x1b[${rows};1H`);
    await Bun.stdout.write("\x1b[0J");
}
export async function clearHere(): Promise<void> {
    // Clears here
    await Bun.stdout.write("\x1b[0J");
}
export async function clearLine(rows: number): Promise<void> {
    // Clears line
    await Bun.stdout.write(`\x1b[${rows};1H`);
    await Bun.stdout.write("\x1b[0K");
}
export async function clearScreen(): Promise<void> {
    // Clears screen
    await Bun.stdout.write(`\x1b[1;1H`);
    await Bun.stdout.write("\x1b[0J");
}
export async function clearUp(rows: number): Promise<void> {
    // Clears before position
    await Bun.stdout.write(`\x1b[${rows};1H`);
    await Bun.stdout.write("\x1b[1J");
}

// Defines write methods
export async function writeCenter(rows: number, text: string): Promise<void> {
    // Writes center-aligned text
    const textWidth = Bun.stringWidth(text);
    const columns = Math.floor((renderWidth - textWidth) / 2) + 1;
    await Bun.stdout.write(`\x1b[${rows};${columns}H`);
    await Bun.stdout.write(`\x1b[1K${text}\x1b[0K`);
}
export async function writeHere(text: string): Promise<void> {
    // Writes text
    await Bun.stdout.write(text);
}
export async function writeJustify(
    rows: number,
    leftText: string,
    centerText: string,
    rightText: string
): Promise<void> {
    // Writes left-aligned text
    await Bun.stdout.write(`\x1b[${rows};1H`);
    await Bun.stdout.write(`${leftText}\x1b[0K`);

    // Writes right-aligned text
    const rightWidth = Bun.stringWidth(rightText);
    const rightColumns = renderWidth - rightWidth + 1;
    await Bun.stdout.write(`\x1b[${rows};${rightColumns}H`);
    await Bun.stdout.write(rightText);

    // Writes center-aligned text
    const centerWidth = Bun.stringWidth(centerText);
    const centerColumns = Math.floor((renderWidth - centerWidth) / 2) + 1;
    await Bun.stdout.write(`\x1b[${rows};${centerColumns}H`);
    await Bun.stdout.write(centerText);
}
export async function writeLine(rows: number, columns: number, text: string): Promise<void> {
    // Writes line
    await Bun.stdout.write(`\x1b[${rows};${columns}H`);
    await Bun.stdout.write(`\x1b[1K${text}\x1b[0K`);
}
export async function writeLeft(rows: number, text: string): Promise<void> {
    // Writes left-aligned text
    await Bun.stdout.write(`\x1b[${rows};1H`);
    await Bun.stdout.write(`${text}\x1b[0K`);
}
export async function writeRight(rows: number, text: string): Promise<void> {
    // Writes right-aligned text
    const textWidth = Bun.stringWidth(text);
    const columns = renderWidth - textWidth + 1;
    await Bun.stdout.write(`\x1b[${rows};${columns}H`);
    await Bun.stdout.write(`\x1b[1K${text}`);
}
export async function writeText(rows: number, columns: number, text: string): Promise<void> {
    // Writes at position
    await Bun.stdout.write(`\x1b[${rows};${columns}H`);
    await Bun.stdout.write(text);
}

// Defines cursor methods
export async function cursorHide(): Promise<void> {
    // Hides cursor
    await Bun.stdout.write("\x1b[?25l");
}
export async function cursorMove(rows: number, columns: number): Promise<void> {
    // Moves cursor to position
    await Bun.stdout.write(`\x1b[${rows};${columns}H`);
}
export async function cursorShow(): Promise<void> {
    // Shows cursor
    await Bun.stdout.write("\x1b[?25h");
}
