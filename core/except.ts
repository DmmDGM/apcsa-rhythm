// Defines abstract exception
export abstract class Exception extends Error {
    // Declares fields
    abstract readonly code: string;
    abstract readonly message: string;
}

// Defines exceptions
export class UnknownException extends Exception {
    // Defines fields
    readonly code = "UNKNOWN_EXCEPTION";
    readonly message = "An unknown exception has occurred.";
}
export class UnknownScene extends Exception {
    // Defines fields
    readonly code = "UNKNOWN_SCENE";
    readonly message = "Scene does not exist.";
}
