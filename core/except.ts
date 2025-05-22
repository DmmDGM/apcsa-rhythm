// Defines abstract exception
export abstract class Exception extends Error {
    // Declares fields
    abstract readonly code: string;
    abstract readonly message: string;
}

// Defines exceptions
export class ChartNotInitialized extends Exception {
    // Defines fields
    readonly code = "CHART_NOT_INITIALIZED";
    readonly message = "Cannot retrieve data from an uninitialized chart.";
}
export class SceneNotInitialized extends Exception {
    // Defines fields
    readonly code = "SCENE_NOT_INITIALIZED";
    readonly message = "Cannot retrieve data from an uninitialized scene.";
}
export class UnknownChart extends Exception {
    // Defines fields
    readonly code = "UNKNOWN_CHART";
    readonly message = "Chart does not exist.";
}
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
