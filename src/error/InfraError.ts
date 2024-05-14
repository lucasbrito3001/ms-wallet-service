import { ErrorBase } from "./ErrorBase";

export class DatabaseConnectionError extends ErrorBase {
	constructor(cause: string) {
		super("DATABASE_CONNECTION_ERROR", "Database connection error", 500, cause);
	}
}

export class QueueConnectionError extends ErrorBase {
	constructor(cause: string) {
		super("QUEUE_CONNECTION_ERROR", "Queue connection error", 500, cause);
	}
}

export class InvalidInputError extends ErrorBase {
	constructor(cause: any) {
		super("INVALID_INPUT", "The input is invalid", 400, cause);
	}
}

export class MissingEnvVariableError extends ErrorBase {
	constructor(variable: string) {
		super("MISSING_ENV_VARIABLE", `Missing the env variable: ${variable}`, 500);
	}
}