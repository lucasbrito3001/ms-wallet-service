import express, { Express, NextFunction, Request, Response } from "express";
import { DataSourceConnection } from "./DataSource";
import { Server } from "http";
import { DependencyRegistry } from "./DependencyRegistry";
import { QueueController } from "./queue/QueueController";
import { UncaughtExceptionHandler } from "@/error/UncaughtExceptionHandler";
import { Logger } from "./log/Logger";
import { Queue } from "./queue/Queue";
import cors from "cors";
import {
	DatabaseConnectionError,
	QueueConnectionError,
} from "@/error/InfraError";
import { QueueSubscriber } from "./queue/subscriber/QueueSubscriber";
import { WalletRouter } from "./router/WalletRouter";
import { WalletController } from "@/application/controller/WalletController";
import { OperationRouter } from "./router/OperationRouter";
import { OperationController } from "@/application/controller/OperationController";
import { AddBalance } from "@/application/usecase/AddBalance";
import {
	OperationRepositoryInMemory,
	WalletRepositoryInMemory,
} from "./repository";
import { WalletEntity } from "./repository/entity/Wallet.entity";
import { WalletRepositoryDatabase } from "./repository/database/WalletRepositoryDatabase";
import { OperationRepositoryDatabase } from "./repository/database/OperationRepositoryDatabase";
import { OperationEntity } from "./repository/entity/Operation.entity";
import { ZodSchemaValidator } from "./ZodSchemaValidator";
import { OperationInputSchema } from "@/application/schema/input/OperationInput";
import { OrderItemsApprovedSub } from "./queue/subscriber/OrderItemsApproved";
import { AccountCreatedSub } from "./queue/subscriber/AccountCreated";

export class WebServer {
	private server: Server | undefined;
	private app: Express = express();

	constructor(
		private dataSourceConnection: DataSourceConnection,
		private queue: Queue,
		private logger: Logger
	) {}

	start = async (isTest: boolean) => {
		this.app.use(express.json());
		this.app.use(cors());

		try {
			await this.dataSourceConnection.initialize();
		} catch (error) {
			throw new DatabaseConnectionError(error as any);
		}

		try {
			await this.queue.connect();
		} catch (error) {
			throw new QueueConnectionError(error as any);
		}

		const registry = await this.fillRegistry();

		this.setRoutes(registry);
		this.setQueueControllerSubscribers(registry);

		// Exception handler middleware
		this.app.use(
			(err: Error, req: Request, res: Response, next: NextFunction): void => {
				return new UncaughtExceptionHandler(res, this.logger).handle(err);
			}
		);

		if (isTest) return this.app;

		this.server = this.app.listen(process.env.PORT, () => {
			this.logger.log(
				`\n[SERVER] Server started, listening on port: ${process.env.PORT}\n`
			);
		});
	};

	private async fillRegistry() {
		const registry = new DependencyRegistry();

		const walletRepository = new WalletRepositoryDatabase(
			this.dataSourceConnection.getRepository(WalletEntity)
		);
		const operationRepository = new OperationRepositoryDatabase(
			this.dataSourceConnection.getRepository(OperationEntity)
		);

		registry
			.push("queue", this.queue)
			.push("logger", this.logger)
			.push("walletRepository", walletRepository)
			.push("operationRepository", operationRepository)
			.push("addBalance", new AddBalance(registry))
			.push(
				"addOperationSchemaValidation",
				new ZodSchemaValidator(OperationInputSchema)
			);

		return registry;
	}

	private setQueueControllerSubscribers = (registry: DependencyRegistry) => {
		const subs: QueueSubscriber[] = [
			new OrderItemsApprovedSub(registry),
			new AccountCreatedSub(registry),
		];

		console.log("");
		new QueueController(registry).appendSubscribers(subs);
	};

	private setRoutes = (registry: DependencyRegistry) => {
		const router = express.Router();

		new WalletRouter(router, new WalletController(registry)).expose();
		new OperationRouter(router, new OperationController(registry)).expose();

		this.app.use("/", router);

		this.app.get("/healthy", (_, res) => {
			res.send("Hello world!");
		});
	};

	gracefulShutdown = () => {
		if (!this.server) return;
		this.server.close();
	};
}
