import "reflect-metadata";
import "module-alias/register";

import { config } from "dotenv";
import { DataSourceConnection } from "./infra/data/DataSource";
import { WebServer } from "./infra/Server";
import { RabbitMQAdapter } from "./infra/queue/RabbitMQAdapter";
import { GeneralLogger } from "./infra/log/GeneralLogger";
import { MissingEnvVariableError } from "./error/InfraError";
import { ErrorBase } from "./error/ErrorBase";

config();

const logger = new GeneralLogger();

const dataSourceConnection = new DataSourceConnection();
const queueAdapter = new RabbitMQAdapter(logger);

const webServer = new WebServer(dataSourceConnection, queueAdapter, logger);

["uncaughtException", "SIGINT", "SIGTERM"].forEach((signal) =>
	process.on(signal, (err) => {
		console.log(`[${signal.toUpperCase()}]: ${err.message}`);

		webServer.gracefulShutdown();
		process.exit(143);
	})
);

if (!process.env.MORGAN_LOG_TYPE)
	throw new MissingEnvVariableError("MORGAN_LOG_TYPE");

if (!process.env.DB_CONNECTION_STRING)
	throw new MissingEnvVariableError("DB_CONNECTION_STRING");

webServer.start(false);
