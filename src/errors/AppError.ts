export class AppError {
    public readonly message: string;
    public readonly statusCode: number;
    public readonly error: object;

    constructor(message: string, statusCode: number, error: object = undefined) {
        this.message = message;
        this.statusCode = statusCode;
        this.error = error;
    }
}